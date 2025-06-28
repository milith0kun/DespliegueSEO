/**
 * Modelo de Usuario
 * Representa la tabla 'usuarios' en la base de datos
 */

const { query } = require('../configuracion/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { logger } = require('../utilidades/logger');

class Usuario {
  /**
   * Crea un nuevo usuario
   * @param {Object} datos - Datos del usuario
   * @returns {Object} - Usuario creado
   */
  static async crear(datos) {
    try {
      const { nombre, email, password, rol = 'usuario' } = datos;
      
      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      const id = uuidv4();
      
      // Insertar el usuario
      await query(
        `INSERT INTO usuarios (id, nombre, email, hash_password, rol)
         VALUES (?, ?, ?, ?, ?)`,
        [id, nombre, email, passwordHash, rol]
      );
      
      // Obtener el usuario recién creado
      const resultado = await query(
        `SELECT id, nombre, email, rol, creado_en 
         FROM usuarios 
         WHERE id = ?`,
        [id]
      );
      
      // En MySQL, el resultado es un array donde el primer elemento es un array de filas
      // y el segundo es información adicional
      const usuario = resultado[0][0];
      
      return usuario || null;
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      throw error;
    }
  }
  
  /**
   * Busca un usuario por su ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} - Usuario encontrado o null
   */
  static async buscarPorId(id) {
    try {
      const [resultado] = await query(
        `SELECT id, nombre, email, rol, esta_activo, creado_en, actualizado_en
         FROM usuarios
         WHERE id = ?`,
        [id]
      );
      
      // En MySQL, el resultado es un array de filas
      return resultado[0] || null;
    } catch (error) {
      logger.error('Error al buscar usuario por ID:', error);
      throw error;
    }
  }
  
  /**
   * Busca un usuario por su email
   * @param {string} email - Email del usuario
   * @returns {Object|null} - Usuario encontrado o null
   */
  static async buscarPorEmail(email) {
    try {
      const result = await query(
        `SELECT id, nombre, email, hash_password as password, rol, esta_activo, creado_en, actualizado_en
         FROM usuarios
         WHERE email = ?`,
        [email]
      );
      
      // Verificar si se encontraron resultados
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      // Devolver el primer resultado
      return result.rows[0];
    } catch (error) {
      logger.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }
  
  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} datos - Datos a actualizar
   * @returns {Object} - Usuario actualizado
   */
  static async actualizar(id, datos) {
    try {
      const { nombre, email, activo } = datos;
      
      // Actualizar el usuario
      await query(
        `UPDATE usuarios
         SET nombre = ?, email = ?, esta_activo = ?, actualizado_en = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [nombre, email, activo, id]
      );
      
      // Obtener el usuario actualizado
      return await this.buscarPorId(id);
    } catch (error) {
      logger.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  
  /**
   * Cambia la contraseña de un usuario
   * @param {string} id - ID del usuario
   * @param {string} nuevaPassword - Nueva contraseña
   * @returns {boolean} - true si se actualizó correctamente
   */
  static async cambiarPassword(id, nuevaPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(nuevaPassword, salt);
      
      await query(
        `UPDATE usuarios
         SET hash_password = ?, actualizado_en = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [passwordHash, id]
      );
      
      return true;
    } catch (error) {
      logger.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }
  
  /**
   * Verifica si la contraseña es correcta
   * @param {string} password - Contraseña a verificar
   * @param {string} hash - Hash almacenado
   * @returns {boolean} - true si la contraseña es correcta
   */
  static async verificarPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  
  /**
   * Obtiene todos los usuarios
   * @returns {Array} - Lista de usuarios
   */
  static async obtenerTodos() {
    try {
      const [resultado] = await query(
        `SELECT id, nombre, email, rol, esta_activo, creado_en, actualizado_en
         FROM usuarios
         ORDER BY creado_en DESC`
      );
      
      // En MySQL, el resultado es un array de filas
      return resultado || [];
    } catch (error) {
      logger.error('Error al obtener todos los usuarios:', error);
      throw error;
    }
  }
}

module.exports = Usuario;
