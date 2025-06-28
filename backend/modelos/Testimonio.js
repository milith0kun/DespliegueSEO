/**
 * Modelo de Testimonio
 * Representa la tabla 'testimonios' en la base de datos
 */

const { query } = require('../configuracion/db');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utilidades/logger');

class Testimonio {
  /**
   * Crea un nuevo testimonio
   * @param {Object} datos - Datos del testimonio
   * @returns {Object} - Testimonio creado
   */
  static async crear(datos) {
    try {
      const { 
        nombre_cliente, 
        empresa, 
        texto, 
        calificacion, 
        imagen_url, 
        activo = true,
        orden = 0
      } = datos;
      
      // Validar calificación
      if (calificacion < 1 || calificacion > 5) {
        throw new Error('La calificación debe estar entre 1 y 5');
      }
      
      const id = uuidv4();
      
      const resultado = await query(
        `INSERT INTO testimonios 
         (id, nombre_cliente, empresa, texto, calificacion, imagen_url, activo, orden)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, nombre_cliente, empresa, texto, calificacion, imagen_url, activo, orden, fecha_creacion`,
        [id, nombre_cliente, empresa, texto, calificacion, imagen_url, activo, orden]
      );
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al crear testimonio:', error);
      throw error;
    }
  }
  
  /**
   * Busca un testimonio por su ID
   * @param {string} id - ID del testimonio
   * @returns {Object|null} - Testimonio encontrado o null
   */
  static async buscarPorId(id) {
    try {
      const resultado = await query(
        `SELECT *
         FROM testimonios
         WHERE id = $1`,
        [id]
      );
      
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('Error al buscar testimonio por ID:', error);
      throw error;
    }
  }
  
  /**
   * Actualiza un testimonio
   * @param {string} id - ID del testimonio
   * @param {Object} datos - Datos a actualizar
   * @returns {Object} - Testimonio actualizado
   */
  static async actualizar(id, datos) {
    try {
      const { 
        nombre_cliente, 
        empresa, 
        texto, 
        calificacion, 
        imagen_url, 
        activo,
        orden
      } = datos;
      
      // Validar calificación si se proporciona
      if (calificacion !== undefined && (calificacion < 1 || calificacion > 5)) {
        throw new Error('La calificación debe estar entre 1 y 5');
      }
      
      const resultado = await query(
        `UPDATE testimonios
         SET nombre_cliente = $1, 
             empresa = $2, 
             texto = $3, 
             calificacion = $4, 
             imagen_url = $5, 
             activo = $6,
             orden = $7,
             fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING id, nombre_cliente, empresa, texto, calificacion, imagen_url, activo, orden, fecha_actualizacion`,
        [nombre_cliente, empresa, texto, calificacion, imagen_url, activo, orden, id]
      );
      
      if (resultado.rows.length === 0) {
        throw new Error('Testimonio no encontrado');
      }
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al actualizar testimonio:', error);
      throw error;
    }
  }
  
  /**
   * Elimina un testimonio (marcándolo como inactivo)
   * @param {string} id - ID del testimonio
   * @returns {boolean} - true si se eliminó correctamente
   */
  static async eliminar(id) {
    try {
      const resultado = await query(
        `UPDATE testimonios
         SET activo = false, fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id`,
        [id]
      );
      
      if (resultado.rows.length === 0) {
        throw new Error('Testimonio no encontrado');
      }
      
      return true;
    } catch (error) {
      logger.error('Error al eliminar testimonio:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los testimonios activos
   * @param {number} limite - Límite de resultados
   * @returns {Array} - Lista de testimonios
   */
  static async obtenerActivos(limite = null) {
    try {
      let sql = `
        SELECT id, nombre_cliente, empresa, texto, calificacion, imagen_url, orden
        FROM testimonios
        WHERE activo = true
        ORDER BY orden ASC, calificacion DESC
      `;
      
      const params = [];
      
      if (limite) {
        params.push(parseInt(limite));
        sql += ` LIMIT $1`;
      }
      
      const resultado = await query(sql, params);
      return resultado.rows;
    } catch (error) {
      logger.error('Error al obtener testimonios activos:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los testimonios
   * @returns {Array} - Lista de testimonios
   */
  static async obtenerTodos() {
    try {
      const resultado = await query(
        `SELECT *
         FROM testimonios
         ORDER BY orden ASC, fecha_creacion DESC`
      );
      
      return resultado.rows;
    } catch (error) {
      logger.error('Error al obtener todos los testimonios:', error);
      throw error;
    }
  }
}

module.exports = Testimonio;
