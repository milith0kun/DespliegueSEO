/**
 * Modelo de Configuración
 * Representa la tabla 'configuracion' en la base de datos
 */

const { query } = require('../configuracion/db');
const { logger } = require('../utilidades/logger');

class Configuracion {
  /**
   * Guarda un valor de configuración
   * @param {string} clave - Clave de configuración
   * @param {string} valor - Valor de configuración
   * @param {string} descripcion - Descripción opcional
   * @returns {Object} - Configuración guardada
   */
  static async guardar(clave, valor, descripcion = null) {
    try {
      // Verificar si la clave ya existe
      const existe = await query(
        'SELECT clave FROM configuracion WHERE clave = $1',
        [clave]
      );
      
      let resultado;
      
      if (existe.rows.length > 0) {
        // Actualizar valor existente
        resultado = await query(
          `UPDATE configuracion
           SET valor = $1, descripcion = $2, fecha_actualizacion = CURRENT_TIMESTAMP
           WHERE clave = $3
           RETURNING clave, valor, descripcion, fecha_actualizacion`,
          [valor, descripcion, clave]
        );
      } else {
        // Insertar nuevo valor
        resultado = await query(
          `INSERT INTO configuracion (clave, valor, descripcion)
           VALUES ($1, $2, $3)
           RETURNING clave, valor, descripcion, fecha_actualizacion`,
          [clave, valor, descripcion]
        );
      }
      
      return resultado.rows[0];
    } catch (error) {
      logger.error('Error al guardar configuración:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene un valor de configuración
   * @param {string} clave - Clave de configuración
   * @returns {Object|null} - Configuración encontrada o null
   */
  static async obtener(clave) {
    try {
      const resultado = await query(
        'SELECT clave, valor, descripcion, fecha_actualizacion FROM configuracion WHERE clave = $1',
        [clave]
      );
      
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('Error al obtener configuración:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene un valor de configuración como string
   * @param {string} clave - Clave de configuración
   * @param {string} valorPredeterminado - Valor predeterminado si no existe
   * @returns {string} - Valor de configuración
   */
  static async obtenerValor(clave, valorPredeterminado = '') {
    try {
      const config = await this.obtener(clave);
      return config ? config.valor : valorPredeterminado;
    } catch (error) {
      logger.error('Error al obtener valor de configuración:', error);
      return valorPredeterminado;
    }
  }
  
  /**
   * Elimina una configuración
   * @param {string} clave - Clave de configuración
   * @returns {boolean} - true si se eliminó correctamente
   */
  static async eliminar(clave) {
    try {
      const resultado = await query(
        'DELETE FROM configuracion WHERE clave = $1 RETURNING clave',
        [clave]
      );
      
      return resultado.rows.length > 0;
    } catch (error) {
      logger.error('Error al eliminar configuración:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todas las configuraciones
   * @returns {Array} - Lista de configuraciones
   */
  static async obtenerTodas() {
    try {
      const resultado = await query(
        'SELECT clave, valor, descripcion, fecha_actualizacion FROM configuracion ORDER BY clave'
      );
      
      return resultado.rows;
    } catch (error) {
      logger.error('Error al obtener todas las configuraciones:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene múltiples configuraciones como un objeto
   * @param {Array} claves - Lista de claves a obtener
   * @returns {Object} - Objeto con las configuraciones
   */
  static async obtenerMultiples(claves) {
    try {
      const resultado = await query(
        'SELECT clave, valor FROM configuracion WHERE clave = ANY($1)',
        [claves]
      );
      
      // Convertir a objeto
      const config = {};
      resultado.rows.forEach(row => {
        config[row.clave] = row.valor;
      });
      
      return config;
    } catch (error) {
      logger.error('Error al obtener múltiples configuraciones:', error);
      throw error;
    }
  }
}

module.exports = Configuracion;
