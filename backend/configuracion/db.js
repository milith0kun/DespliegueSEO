/**
 * Configuración de conexión a la base de datos MySQL
 * Este archivo lee las variables de entorno del archivo .env existente y establece la conexión
 * No utiliza ningún archivo de ejemplo, solo las variables reales del .env
 */

const mysql = require('mysql2/promise');
const path = require('path'); 

// Cargar variables de entorno desde el archivo .env existente
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

// Crear un pool de conexiones para mejor rendimiento usando SOLO las variables del .env existente
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para mostrar los datos de conexión (sin mostrar la contraseña completa)
const getConnectionInfo = () => {
  const passwordLength = process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0;
  const maskedPassword = passwordLength > 0 ? 
    '*'.repeat(Math.max(passwordLength - 2, 0)) + 
    (passwordLength > 2 ? process.env.DB_PASSWORD.slice(-2) : '') : '';
  
  return {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: maskedPassword, // Contraseña parcialmente oculta por seguridad
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  };
};

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    console.log('Conectado a:', getConnectionInfo());
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  getConnectionInfo
};
