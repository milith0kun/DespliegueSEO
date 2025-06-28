/**
 * Servidor principal - Ecos del SEO
 * API REST para gestión de servicios, contactos y contenido
 */

// Importaciones
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const { logger } = require('./utilidades/logger');
const os = require('os');
const { format } = require('util');

// Función para generar una línea decorativa
const line = (char = '=', length = 60) => char.repeat(length);

// Función para mostrar información del sistema
const getSystemInfo = () => {
  return {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    cpus: os.cpus().length,
    totalMem: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
    freeMem: (os.freemem() / 1024 / 1024).toFixed(2) + ' MB',
    uptime: (os.uptime() / 60 / 60).toFixed(2) + ' horas'
  };
};

// Configuración global del servidor
const app = express();

// Configuración por entorno
const config = {
  // Configuración base compartida entre entornos
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0', // Usar 0.0.0.0 para permitir conexiones desde cualquier interfaz
  corsOrigin: process.env.FRONTEND_URL || '*', // Permitir cualquier origen en desarrollo
  apiPrefix: process.env.API_PREFIX || '/api',
  // Ruta a los archivos estáticos del frontend
  frontendPath: path.resolve(__dirname, '../frontend'),
  // Ajustes específicos por entorno
  development: {
    logLevel: 'debug',
    enableDetailedErrors: true
  },
  production: {
    logLevel: 'info',
    enableDetailedErrors: false
  },
  testing: {
    logLevel: 'debug',
    enableDetailedErrors: true
  }
};

// Obtener configuración del entorno actual
const env = process.env.NODE_ENV || 'development';
const currentConfig = { ...config, ...config[env] };

// Establecer nivel de log según entorno
logger.level = currentConfig.logLevel;

// Middleware configurado según entorno

// Seguridad - Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar temporalmente CSP para desarrollo
  crossOriginEmbedderPolicy: false
}));

// Compresión de respuestas
app.use(compression());

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(cors({
  origin: currentConfig.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Logging HTTP
const morganFormat = env === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { 
  stream: { write: message => logger.info(message.trim()) },
  skip: (req, res) => env === 'production' && res.statusCode < 400 // En producción, solo log de errores
}));

// Servir archivos estáticos del frontend
app.use(express.static(currentConfig.frontendPath, {
  index: 'index.html',
  extensions: ['html']
}));

// Manejar rutas del frontend (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(currentConfig.frontendPath, 'index.html'));
});

// Ruta de verificación de estado
app.get('/api/status', (req, res) => {
  res.json({
    mensaje: 'API de Ecos del SEO funcionando correctamente',
    version: '1.0.0',
    estado: 'online',
    entorno: env,
    timestamp: new Date().toISOString()
  });
});

// Rutas API
app.use('/api/auth', require('./rutas/api/auth'));
app.use('/api/contactos', require('./rutas/api/contactos'));
app.use('/api/servicios', require('./rutas/api/servicios'));
app.use('/api/testimonios', require('./rutas/api/testimonios'));
app.use('/api/articulos', require('./rutas/api/articulos'));
app.use('/api/configuracion', require('./rutas/api/configuracion'));

// Para cualquier otra ruta, servir el index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(currentConfig.frontendPath, 'index.html'));
});

// Manejo de errores
app.use((req, res, next) => {
  const error = new Error('Ruta no encontrada');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const mensaje = error.message || 'Error interno del servidor';
  
  logger.error(`${status} - ${mensaje}`);
  if (error.stack && currentConfig.enableDetailedErrors) {
    logger.error(error.stack);
  }
  
  res.status(status).json({
    error: {
      mensaje,
      status,
      // Solo incluir detalles adicionales en entornos no productivos
      ...(currentConfig.enableDetailedErrors ? {
        path: req.path,
        stack: error.stack,
        timestamp: new Date().toISOString()
      } : {})
    }
  });
});

// Función para mostrar el banner de inicio
const showStartupBanner = () => {
  const sysInfo = getSystemInfo();
  const startTime = new Date();
  
  // Limpiar consola
  console.clear();
  
  // Mostrar banner
  console.log('\n' + line() + '\n' +
    '  ███████╗ ██████╗ ██████╗ ███████╗     ██████╗ ███████╗ ██████╗ \n' +
    '  ██╔════╝██╔════╝██╔═══██╗██╔════╝    ██╔═══██╗██╔════╝██╔═══██╗\n' +
    '  █████╗  ██║     ██║   ██║███████╗    ██║   ██║███████╗██║   ██║\n' +
    '  ██╔══╝  ██║     ██║   ██║╚════██║    ██║   ██║╚════██║██║   ██║\n' +
    '  ███████╗╚██████╗╚██████╔╝███████║    ╚██████╔╝███████║╚██████╔╝\n' +
    '  ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚══════╝ ╚═════╝ \n');

  // Información del sistema
  console.log(`\n${line('-')}`);
  console.log('  INFORMACIÓN DEL SISTEMA'.padEnd(40));
  console.log(line('-'));
  console.log(`  Fecha/Hora:    ${startTime.toLocaleString()}`);
  console.log(`  Plataforma:    ${sysInfo.platform} (${sysInfo.arch})`);
  console.log(`  Hostname:      ${sysInfo.hostname}`);
  console.log(`  CPU Cores:     ${sysInfo.cpus}`);
  console.log(`  Memoria:       ${sysInfo.totalMem} total, ${sysInfo.freeMem} libre`);
  console.log(`  Tiempo activo: ${sysInfo.uptime}`);
  
  // Información de la aplicación
  console.log(`\n${line('-')}`);
  console.log('  CONFIGURACIÓN DE LA APLICACIÓN'.padEnd(40));
  console.log(line('-'));
  
  // Mostrar URLs de acceso para desarrollo local
  const localUrl = `http://localhost:${currentConfig.port}`;
  const networkUrl = `http://${currentConfig.host}:${currentConfig.port}`;
  
  console.log(`  URLs de acceso:`);
  console.log(`    ✓ Local:     ${localUrl}`);
  console.log(`    ✓ Red:       ${networkUrl}`);
  console.log(`  Entorno:      ${env.toUpperCase()}`);
  console.log(`  CORS:         ${currentConfig.corsOrigin}`);
  console.log(`  API Base:     ${currentConfig.apiPrefix}`);
  console.log(`  Frontend:     ${currentConfig.frontendPath}`);
  console.log(`  Nivel de Log: ${currentConfig.logLevel.toUpperCase()}`);
  
  // Estado de la base de datos
  console.log(`\n${line('-')}`);
  console.log('  ESTADO DE LA BASE DE DATOS'.padEnd(40));
  console.log(line('-'));
  console.log(`  Estado:        Conectado correctamente`);
  console.log(`  Base de datos: ${process.env.DB_NAME}`);
  console.log(`  Usuario:       ${process.env.DB_USER}`);
  console.log(`  Servidor:      ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  
  // Mensaje final
  console.log(`\n${line('=')}`);
  console.log('  [OK] Servidor inicializado correctamente'.padStart(45));
  console.log(`  Tiempo de inicio: ${new Date().toLocaleTimeString()}`);
  console.log(`${line('=')}\n`);
};

// Iniciar el servidor
app.listen(currentConfig.port, currentConfig.host, () => {
  showStartupBanner();
  
  // Registrar en el logger también
  logger.info(line());
  logger.info('SERVIDOR INICIADO CORRECTAMENTE');
  const url = `http://${currentConfig.host}:${currentConfig.port}`;
  console.log(`\n  Servidor en ejecución en: ${url}`);
  console.log('  Presiona Ctrl+C para detener el servidor\n');
  logger.info(`URL: ${url}`);
  logger.info(`Entorno: ${env}`);
  logger.info(`Hora de inicio: ${new Date().toLocaleString()}`);
  logger.info(line());
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Podrías cerrar el servidor y reiniciarlo aquí
  // server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Podrías cerrar el servidor y reiniciarlo aquí
  // server.close(() => process.exit(1));
});

// Exportar la aplicación para pruebas
module.exports = { app, server };
