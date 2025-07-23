/**
 * Servidor unificado para Ecos del SEO
 * Este archivo configura y levanta el servidor Express que sirve tanto el backend (API) como el frontend
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const session = require('express-session');
const { testConnection } = require('./configuracion/db');

// Cargar variables de entorno
require('dotenv').config();

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad y optimización
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net', 'https://code.jquery.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.example.com']
    }
  }
})); // Seguridad HTTP con configuración para recursos frontend

// Configuración de CORS para permitir cookies en solicitudes cross-origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  credentials: true // Permitir cookies en solicitudes CORS
}));

app.use(compression()); // Comprimir respuestas
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded
app.use(cookieParser(process.env.COOKIE_SECRET || 'ecoseo-secret-key')); // Parsear cookies

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'ecoseo-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // No accesible por JavaScript del cliente
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

app.use(morgan('dev')); // Logging de solicitudes

// Limitar tasa de solicitudes para la API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuración de rutas para la API
app.use('/api', apiLimiter); // Aplicar limitador solo a rutas de API

// Rutas de API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Rutas de API
app.use('/api/auth', require('./rutas/api/auth'));
app.use('/api/admin/usuarios', require('./rutas/api/usuarios'));
app.use('/api/admin/dashboard', require('./rutas/api/dashboard'));
app.use('/api/contactos', require('./rutas/api/contactos'));

// Aquí se añadirían más rutas de API cuando estén disponibles
// app.use('/api/servicios', require('./rutas/api/servicios'));

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, '../frontend');

// Configuración mejorada para servir archivos estáticos con los MIME types correctos
app.use(express.static(frontendPath, {
  setHeaders: (res, path) => {
    // Configurar tipos MIME explícitos para archivos comunes
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Ruta para servir index.html como página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Ruta para manejar todas las demás solicitudes de páginas y redirigirlas al frontend
// Esto permite que el enrutamiento del frontend funcione correctamente
app.get('*', (req, res, next) => {
  // Si la solicitud es para la API, continuar al siguiente middleware
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Intentar enviar el archivo solicitado
  const filePath = path.join(frontendPath, req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      // Si el archivo no existe, enviar index.html para manejo por el frontend
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
});

// Middleware para manejo de rutas de API no encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta de API no encontrada'
  });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

// Iniciar el servidor
const iniciarServidor = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConectada = await testConnection();
    
    if (!dbConectada) {
      console.error('No se pudo conectar a la base de datos. Abortando inicio del servidor.');
      process.exit(1);
    }
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor unificado iniciado en el puerto ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'desarrollo'}`);
      console.log(`Frontend: http://localhost:${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Ejecutar el servidor
iniciarServidor();

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('Cerrando servidor...');
  process.exit(0);
});

module.exports = app; // Para pruebas
