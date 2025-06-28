/**
 * Modelo de Artículo
 * Representa la tabla 'articulos' en la base de datos
 */

const { query } = require('../configuracion/db');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utilidades/logger');

class Articulo {
  /**
   * Crea un nuevo artículo
   * @param {Object} datos - Datos del artículo
   * @returns {Object} - Artículo creado
   */
  static async crear(datos) {
    try {
      const { 
        titulo, 
        slug, 
        contenido, 
        imagen_destacada, 
        extracto, 
        autor_id,
        publicado = false,
        fecha_publicacion = null
      } = datos;
      
      const id = uuidv4();
      
      const resultado = await query(
        `INSERT INTO articulos 
         (id, titulo, slug, contenido, imagen_destacada, extracto, autor_id, publicado, fecha_publicacion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, titulo, slug, extracto, imagen_destacada, publicado, fecha_publicacion, fecha_creacion`,
        [id, titulo, slug, contenido, imagen_destacada, extracto, autor_id, publicado, fecha_publicacion]
      );
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al crear artículo:', error);
      throw error;
    }
  }
  
  /**
   * Busca un artículo por su ID
   * @param {string} id - ID del artículo
   * @returns {Object|null} - Artículo encontrado o null
   */
  static async buscarPorId(id) {
    try {
      const resultado = await query(
        `SELECT a.*, u.nombre as autor_nombre
         FROM articulos a
         LEFT JOIN usuarios u ON a.autor_id = u.id
         WHERE a.id = $1`,
        [id]
      );
      
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('Error al buscar artículo por ID:', error);
      throw error;
    }
  }
  
  /**
   * Busca un artículo por su slug
   * @param {string} slug - Slug del artículo
   * @returns {Object|null} - Artículo encontrado o null
   */
  static async buscarPorSlug(slug) {
    try {
      const resultado = await query(
        `SELECT a.*, u.nombre as autor_nombre
         FROM articulos a
         LEFT JOIN usuarios u ON a.autor_id = u.id
         WHERE a.slug = $1`,
        [slug]
      );
      
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('Error al buscar artículo por slug:', error);
      throw error;
    }
  }
  
  /**
   * Actualiza un artículo
   * @param {string} id - ID del artículo
   * @param {Object} datos - Datos a actualizar
   * @returns {Object} - Artículo actualizado
   */
  static async actualizar(id, datos) {
    try {
      const { 
        titulo, 
        slug, 
        contenido, 
        imagen_destacada, 
        extracto, 
        publicado,
        fecha_publicacion
      } = datos;
      
      // Si se marca como publicado y no tiene fecha de publicación, establecerla ahora
      let fechaPublicacionFinal = fecha_publicacion;
      if (publicado && !fechaPublicacionFinal) {
        fechaPublicacionFinal = new Date();
      }
      
      const resultado = await query(
        `UPDATE articulos
         SET titulo = $1, 
             slug = $2, 
             contenido = $3, 
             imagen_destacada = $4, 
             extracto = $5, 
             publicado = $6,
             fecha_publicacion = $7,
             fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING id, titulo, slug, extracto, imagen_destacada, publicado, fecha_publicacion, fecha_actualizacion`,
        [titulo, slug, contenido, imagen_destacada, extracto, publicado, fechaPublicacionFinal, id]
      );
      
      if (resultado.rows.length === 0) {
        throw new Error('Artículo no encontrado');
      }
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al actualizar artículo:', error);
      throw error;
    }
  }
  
  /**
   * Elimina un artículo
   * @param {string} id - ID del artículo
   * @returns {boolean} - true si se eliminó correctamente
   */
  static async eliminar(id) {
    try {
      const resultado = await query(
        `DELETE FROM articulos
         WHERE id = $1
         RETURNING id`,
        [id]
      );
      
      if (resultado.rows.length === 0) {
        throw new Error('Artículo no encontrado');
      }
      
      return true;
    } catch (error) {
      logger.error('Error al eliminar artículo:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene artículos publicados
   * @param {Object} opciones - Opciones de consulta (límite, offset)
   * @returns {Array} - Lista de artículos
   */
  static async obtenerPublicados(opciones = {}) {
    try {
      const { limite = 10, offset = 0 } = opciones;
      
      const resultado = await query(
        `SELECT a.id, a.titulo, a.slug, a.extracto, a.imagen_destacada, 
                a.fecha_publicacion, u.nombre as autor_nombre
         FROM articulos a
         LEFT JOIN usuarios u ON a.autor_id = u.id
         WHERE a.publicado = true
         ORDER BY a.fecha_publicacion DESC
         LIMIT $1 OFFSET $2`,
        [limite, offset]
      );
      
      return resultado.rows;
    } catch (error) {
      logger.error('Error al obtener artículos publicados:', error);
      throw error;
    }
  }
  
  /**
   * Cuenta el número total de artículos publicados
   * @returns {number} - Número total de artículos publicados
   */
  static async contarPublicados() {
    try {
      const resultado = await query(
        `SELECT COUNT(*) as total
         FROM articulos
         WHERE publicado = true`
      );
      
      return parseInt(resultado.rows[0].total);
    } catch (error) {
      logger.error('Error al contar artículos publicados:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los artículos
   * @param {Object} opciones - Opciones de consulta (límite, offset)
   * @returns {Array} - Lista de artículos
   */
  static async obtenerTodos(opciones = {}) {
    try {
      const { limite = 10, offset = 0 } = opciones;
      
      const resultado = await query(
        `SELECT a.*, u.nombre as autor_nombre
         FROM articulos a
         LEFT JOIN usuarios u ON a.autor_id = u.id
         ORDER BY a.fecha_creacion DESC
         LIMIT $1 OFFSET $2`,
        [limite, offset]
      );
      
      return resultado.rows;
    } catch (error) {
      logger.error('Error al obtener todos los artículos:', error);
      throw error;
    }
  }
}

module.exports = Articulo;
