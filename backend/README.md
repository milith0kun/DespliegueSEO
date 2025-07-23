# Ecos del SEO - Backend

Backend para la plataforma de Ecos del SEO, desarrollado con Node.js, Express y MySQL.

## Requisitos Previos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- npm (v9 o superior) o yarn

## Características Principales

- Autenticación segura con JWT y cookies
- Protección de rutas administrativas
- Gestión de usuarios con roles (admin, usuario)
- Sistema de contacto con notificaciones por email
- API RESTful para integración con el frontend
- Inicialización automática de base de datos

## Configuración del Entorno

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo `.env.example` a `.env` y configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
4. Configura las variables de entorno en el archivo `.env` con tus credenciales de base de datos y configuración del servidor.

## Inicialización de la Base de Datos

1. Asegúrate de que MySQL esté en ejecución
2. Crea una base de datos con el nombre especificado en `DB_NAME`
3. El servidor inicializará automáticamente las tablas necesarias al arrancar
4. Se creará un usuario administrador con las credenciales especificadas en el archivo `.env`:
   - Email: valor de `ADMIN_EMAIL`
   - Contraseña: valor de `ADMIN_PASSWORD`

## Iniciar el Servidor

### Modo Desarrollo

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

## Estructura del Proyecto

```
backend/
├── configuracion/     # Configuraciones (base de datos, logger, etc.)
├── controladores/     # Controladores de la API
├── middleware/        # Middleware personalizados
├── modelos/           # Modelos de la base de datos
├── rutas/             # Rutas de la API
├── scripts/           # Scripts de utilidad
├── utilidades/        # Utilidades y helpers
├── .env.example       # Ejemplo de archivo de variables de entorno
├── package.json       # Dependencias y scripts
└── servidor.js        # Punto de entrada de la aplicación
```

## API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar nuevo usuario
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/perfil` - Obtener perfil del usuario
- `PUT /api/auth/perfil` - Actualizar perfil
- `POST /api/auth/cambiar-password` - Cambiar contraseña

### Usuarios (Admin)

- `GET /api/auth/usuarios` - Obtener todos los usuarios (solo admin)
- `PUT /api/auth/usuarios/:id` - Actualizar usuario (solo admin)

## Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| PORT | Puerto del servidor | 3000 |
| NODE_ENV | Entorno de ejecución | development |
| JWT_SECRET | Clave secreta para JWT | |
| JWT_EXPIRES_IN | Tiempo de expiración del token | 24h |
| DB_HOST | Host de la base de datos | localhost |
| DB_PORT | Puerto de la base de datos | 3306 |
| DB_NAME | Nombre de la base de datos | ecosdelseo_db |
| DB_USER | Usuario de la base de datos | root |
| DB_PASSWORD | Contraseña de la base de datos | |
| FRONTEND_URL | URL del frontend | http://localhost:3001 |

## Seguridad

- Se utiliza JWT para la autenticación
- Las contraseñas se almacenan con hash bcrypt
- Se implementa rate limiting para prevenir ataques de fuerza bruta
- Se utiliza Helmet para la seguridad de las cabeceras HTTP
- Se implementa CORS para restringir los orígenes permitidos

## Despliegue

1. Configura las variables de entorno en producción
2. Asegúrate de que la base de datos esté configurada y accesible
3. Instala las dependencias en modo producción:
   ```bash
   npm install --production
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```

## Licencia

MIT
