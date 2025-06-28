/**
 * Modelo de Contacto
 * Representa la tabla 'contactos' en la base de datos
 */

const { query } = require('../configuracion/db');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utilidades/logger');

class Contacto {
  /**
   * Crea un nuevo contacto
   * @param {Object} datos - Datos del contacto
   * @returns {Object} - Contacto creado
   */
  static async crear(datos) {
    try {
      const { 
        nombre, 
        email, 
        telefono, 
        empresa, 
        mensaje, 
        servicio_id,
        estado = 'nuevo'
      } = datos;
      
      const id = uuidv4();
      
      const resultado = await query(
        `INSERT INTO contactos 
         (id, nombre, email, telefono, empresa, mensaje, servicio_id, estado)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, nombre, email, telefono, empresa, estado, fecha_creacion`,
        [id, nombre, email, telefono, empresa, mensaje, servicio_id, estado]
      );
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al crear contacto:', error);
      throw error;
    }
  }
  
  /**
   * Busca un contacto por su ID
   * @param {string} id - ID del contacto
   * @returns {Object|null} - Contacto encontrado o null
   */
  static async buscarPorId(id) {
    try {
      const resultado = await query(
        `SELECT c.*, s.nombre as servicio_nombre
         FROM contactos c
         LEFT JOIN servicios s ON c.servicio_id = s.id
         WHERE c.id = $1`,
        [id]
      );
      
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('Error al buscar contacto por ID:', error);
      throw error;
    }
  }
  
  /**
   * Actualiza el estado de un contacto
   * @param {string} id - ID del contacto
   * @param {string} estado - Nuevo estado
   * @returns {Object} - Contacto actualizado
   */
  static async actualizarEstado(id, estado) {
    try {
      const estadosValidos = ['nuevo', 'en_proceso', 'atendido', 'archivado'];
      
      if (!estadosValidos.includes(estado)) {
        throw new Error(`Estado no válido. Debe ser uno de: ${estadosValidos.join(', ')}`);
      }
      
      const resultado = await query(
        `UPDATE contactos
         SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, nombre, email, estado, fecha_actualizacion`,
        [estado, id]
      );
      
      if (resultado.rows.length === 0) {
        throw new Error('Contacto no encontrado');
      }
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al actualizar estado de contacto:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los contactos
   * @param {Object} filtros - Filtros para la consulta
   * @returns {Array} - Lista de contactos
   */
  static async obtenerTodos(filtros = {}) {
    try {
      let sql = `
        SELECT c.id, c.nombre, c.email, c.telefono, c.empresa, c.mensaje, 
               c.estado, c.fecha_creacion, c.fecha_actualizacion, 
               s.nombre as servicio_nombre
        FROM contactos c
        LEFT JOIN servicios s ON c.servicio_id = s.id
      `;
      
      const params = [];
      const condiciones = [];
      
      // Aplicar filtros si existen
      if (filtros.estado) {
        params.push(filtros.estado);
        condiciones.push(`c.estado = $${params.length}`);
      }
      
      if (filtros.email) {
        params.push(`%${filtros.email}%`);
        condiciones.push(`c.email ILIKE $${params.length}`);
      }
      
      if (filtros.servicio_id) {
        params.push(filtros.servicio_id);
        condiciones.push(`c.servicio_id = $${params.length}`);
      }
      
      // Agregar condiciones a la consulta
      if (condiciones.length > 0) {
        sql += ' WHERE ' + condiciones.join(' AND ');
      }
      
      // Ordenar resultados
      sql += ' ORDER BY c.fecha_creacion DESC';
      
      // Aplicar paginación si existe
      if (filtros.limite) {
        params.push(parseInt(filtros.limite));
        sql += ` LIMIT $${params.length}`;
        
        if (filtros.offset) {
          params.push(parseInt(filtros.offset));
          sql += ` OFFSET $${params.length}`;
        }
      }
      
      const resultado = await query(sql, params);
      return resultado.rows;
    } catch (error) {
      logger.error('Error al obtener contactos:', error);
      throw error;
    }
  }
  
  /**
   * Cuenta el número total de contactos según los filtros
   * @param {Object} filtros - Filtros para la consulta
   * @returns {number} - Número total de contactos
   */
  static async contarTotal(filtros = {}) {
    try {
      let sql = 'SELECT COUNT(*) as total FROM contactos';
      
      const params = [];
      const condiciones = [];
      
      // Aplicar filtros si existen
      if (filtros.estado) {
        params.push(filtros.estado);
        condiciones.push(`estado = $${params.length}`);
      }
      
      if (filtros.email) {
        params.push(`%${filtros.email}%`);
        condiciones.push(`email ILIKE $${params.length}`);
      }
      
      if (filtros.servicio_id) {
        params.push(filtros.servicio_id);
        condiciones.push(`servicio_id = $${params.length}`);
      }
      
      // Agregar condiciones a la consulta
      if (condiciones.length > 0) {
        sql += ' WHERE ' + condiciones.join(' AND ');
      }
      
      const resultado = await query(sql, params);
      return parseInt(resultado.rows[0].total);
    } catch (error) {
      logger.error('Error al contar contactos:', error);
      throw error;
    }
  }
}

module.exports = Contacto;
