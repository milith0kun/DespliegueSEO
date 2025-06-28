const { pool, query } = require('../configuracion/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function crearAdmin() {
  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();
    
    // Verificar si ya existe un administrador
    const [rows] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      ['nuevo@admin.com']
    );
    
    if (rows && rows.length > 0) {
      console.log('❌ Ya existe un administrador con ese correo');
      return;
    }
    
    // Crear nuevo administrador
    const id = uuidv4();
    const nombre = 'Administrador';
    const email = 'nuevo@admin.com';
    const password = 'Admin123!';
    const rol = 'ADMIN';
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Insertar el usuario
    await connection.query(
      `INSERT INTO usuarios (id, nombre, email, hash_password, rol, esta_activo, creado_en, actualizado_en)
       VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [id, nombre, email, passwordHash, rol]
    );
    
    console.log('✅ Administrador creado exitosamente');
    console.log('📧 Email: nuevo@admin.com');
    console.log('🔑 Contraseña: Admin123!');
    
  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message);
    console.error('Detalles:', error);
  } finally {
    // Liberar la conexión de vuelta al pool
    if (connection) {
      connection.release();
    }
    // Cerrar el pool de conexiones
    pool.end();
  }
}

crearAdmin();
