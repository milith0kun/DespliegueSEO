const { pool } = require('../configuracion/db');

async function verUsuarios() {
  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();
    
    // Consultar todos los usuarios
    const [rows] = await connection.query(
      'SELECT id, nombre, email, rol, esta_activo, creado_en FROM usuarios'
    );
    
    console.log('\n=== USUARIOS EN LA BASE DE DATOS ===');
    console.table(rows);
    
  } catch (error) {
    console.error('❌ Error al consultar usuarios:', error.message);
    console.error('Detalles:', error);
  } finally {
    // Liberar la conexión de vuelta al pool
    if (connection) {
      connection.release();
    }
    // Cerrar el pool de conexiones
    await pool.end();
    process.exit(0);
  }
}

// Ejecutar la función
verUsuarios();
