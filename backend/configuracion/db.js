/**
 * Configuración de conexión a la base de datos MySQL
 * Ecos del SEO
 */

const mysql = require('mysql2/promise');
const { logger } = require('../utilidades/logger');

// Configuración por entorno
const getDbConfig = () => {
  // Mostrar las variables de entorno para depuración
  // Mostrar configuración básica de la base de datos
  if (process.env.NODE_ENV === 'development') {
    console.log('DB Config:');
    console.log('- DB_HOST:', process.env.DB_HOST || 'localhost');
    console.log('- DB_PORT:', process.env.DB_PORT || '3306');
    console.log('- DB_NAME:', process.env.DB_NAME || 'ecosdelseo_db');
    console.log('- DB_USER:', process.env.DB_USER || 'root');
    console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(vacío)');
  }
  
  // Configuración base para todos los entornos
  const baseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'ecosdelseo_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1997281qA', // Contraseña por defecto
    // Configuraciones adicionales
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '20'),
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000'), // Aumentado a 10 segundos
    debug: false // Deshabilitar depuración para una salida más limpia
  };
  
  // Solo mostrar la configuración detallada en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('Configuración de conexión:', {
      host: baseConfig.host,
      port: baseConfig.port,
      database: baseConfig.database,
      user: baseConfig.user,
      connectionLimit: baseConfig.connectionLimit,
      waitForConnections: baseConfig.waitForConnections,
      queueLimit: baseConfig.queueLimit,
      connectTimeout: baseConfig.connectTimeout,
      debug: baseConfig.debug
    });
  }

  // Ajustes específicos según entorno
  switch(process.env.NODE_ENV) {
    case 'production':
      return {
        ...baseConfig,
        // En producción podemos tener más conexiones y timeout más largo
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '50'),
        connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '5000'),
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
      };
    case 'testing':
      return {
        ...baseConfig,
        // En testing usamos menos recursos
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '5')
      };
    default: // development
      return baseConfig;
  }
};

// Crear pool de conexiones con la configuración adecuada al entorno
const pool = mysql.createPool(getDbConfig());

// Verificar conexión
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info(`Conexión establecida con la base de datos MySQL (${process.env.NODE_ENV || 'development'})`);
    connection.release();
    return true;
  } catch (error) {
    logger.error('Error en la conexión a MySQL:', error);
    return false;
  }
};

// Iniciar verificación de conexión
checkConnection();

// Función para verificar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('Conexión a la base de datos verificada correctamente');
    connection.release();
    return true;
  } catch (error) {
    logger.error('No se pudo conectar a la base de datos:', error);
    return false;
  }
};

// Función para ejecutar consultas
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    // En MySQL2/promise, pool.query devuelve [rows, fields]
    const [rows, fields] = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Consulta ejecutada', { text, duration, rows: rows.length });
    
    // Crear un objeto compatible con el formato de respuesta anterior
    const res = {
      rows: rows,
      rowCount: rows.length,
      fields: fields
    };
    
    return res;
  } catch (error) {
    logger.error('Error al ejecutar consulta', { text, error });
    throw error;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};
