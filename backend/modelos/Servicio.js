/**
 * Modelo de Servicio
 * Representa la tabla 'servicios' en la base de datos
 */

const { query } = require('../configuracion/db');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utilidades/logger');

class Servicio {
  /**
   * Crea un nuevo servicio
   * @param {Object} datos - Datos del servicio
   * @returns {Object} - Servicio creado
   */
  static async crear(datos) {
    try {
      const { 
        nombre, 
        slug, 
        descripcion_corta, 
        descripcion_completa, 
        precio, 
        imagen_url, 
        destacado = false, 
        orden = 0, 
        activo = true 
      } = datos;
      
      const id = uuidv4();
      
      const resultado = await query(
        `INSERT INTO servicios 
         (id, nombre, slug, descripcion_corta, descripcion, icono, imagen_header, es_destacado, orden_clasificacion, esta_activo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id, nombre, slug, descripcion_corta, informacion_precios as precio, es_destacado as destacado, orden_clasificacion as orden, esta_activo as activo, creado_en`,
        [id, nombre, slug, descripcion_corta, descripcion_completa, null, imagen_url, destacado, orden, activo]
      );
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al crear servicio:', error);
      throw error;
    }
  }
  
  /**
   * Busca un servicio por su ID
   * @param {string} id - ID del servicio
   * @returns {Object|null} - Servicio encontrado o null
   */
  static async buscarPorId(id) {
    try {
      const resultado = await query(
        `SELECT *
         FROM servicios
         WHERE id = ?`,
        [id]
      );
      
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('Error al buscar servicio por ID:', error);
      throw error;
    }
  }
  
  /**
   * Busca un servicio por su slug
   * @param {string} slug - Slug del servicio
   * @returns {Object|null} - Servicio encontrado o null
   */
  static async buscarPorSlug(slug) {
    try {
      const resultado = await query(
        `SELECT *
         FROM servicios
         WHERE slug = ?`,
        [slug]
      );
      
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('Error al buscar servicio por slug:', error);
      throw error;
    }
  }
  
  /**
   * Actualiza un servicio
   * @param {string} id - ID del servicio
   * @param {Object} datos - Datos a actualizar
   * @returns {Object} - Servicio actualizado
   */
  static async actualizar(id, datos) {
    try {
      const { 
        nombre, 
        slug, 
        descripcion_corta, 
        descripcion_completa, 
        precio, 
        imagen_url, 
        destacado, 
        orden, 
        activo 
      } = datos;
      
      const resultado = await query(
        `UPDATE servicios
         SET nombre = ?, 
             slug = ?, 
             descripcion_corta = ?, 
             descripcion = ?, 
             informacion_precios = ?, 
             imagen_header = ?, 
             es_destacado = ?, 
             orden_clasificacion = ?, 
             esta_activo = ?,
             actualizado_en = CURRENT_TIMESTAMP
         WHERE id = ?
         RETURNING id, nombre, slug, descripcion_corta, informacion_precios as precio, es_destacado as destacado, orden_clasificacion as orden, esta_activo as activo, actualizado_en`,
        [nombre, slug, descripcion_corta, descripcion_completa, precio, imagen_url, destacado, orden, activo, id]
      );
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al actualizar servicio:', error);
      throw error;
    }
  }
  
  /**
   * Elimina un servicio (marcándolo como inactivo)
   * @param {string} id - ID del servicio
   * @returns {boolean} - true si se eliminó correctamente
   */
  static async eliminar(id) {
    try {
      await query(
        `UPDATE servicios
         SET esta_activo = false, actualizado_en = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [id]
      );
      
      return true;
    } catch (error) {
      logger.error('Error al eliminar servicio:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los servicios activos
   * @param {boolean} soloDestacados - Si es true, solo devuelve servicios destacados
   * @returns {Array} - Lista de servicios
   */
  static async obtenerActivos(soloDestacados = false) {
    try {
      let sql = `
        SELECT id, nombre, slug, descripcion_corta, informacion_precios as precio, imagen_header as imagen_url, es_destacado as destacado, orden_clasificacion as orden
        FROM servicios
        WHERE esta_activo = true
      `;
      
      if (soloDestacados) {
        sql += ' AND es_destacado = true';
      }
      
      sql += ' ORDER BY orden_clasificacion ASC, nombre ASC';
      
      const resultado = await query(sql);
      return resultado.rows;
    } catch (error) {
      logger.error('Error al obtener servicios activos:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los servicios
   * @returns {Array} - Lista de servicios
   */
  static async obtenerTodos() {
    try {
      const resultado = await query(
        `SELECT *
         FROM servicios
         ORDER BY orden_clasificacion ASC, nombre ASC`
      );
      
      return resultado.rows;
    } catch (error) {
      logger.error('Error al obtener todos los servicios:', error);
      throw error;
    }
  }
}

module.exports = Servicio;
