/**
 * Controlador para manejar las operaciones relacionadas con la configuración del sistema
 */

const Configuracion = require('../modelos/Configuracion');
const { logger } = require('../utilidades/logger');

/**
 * Guarda o actualiza un valor de configuración
 */
exports.guardar = async (req, res) => {
  try {
    const { clave, valor, descripcion } = req.body;
    
    // Validaciones básicas
    if (!clave || valor === undefined) {
      return res.status(400).json({
        error: 'La clave y el valor son obligatorios'
      });
    }
    
    // Guardar configuración
    const configuracion = await Configuracion.guardar(clave, valor, descripcion);
    
    logger.info(`Configuración guardada: ${clave}`);
    
    res.json({
      mensaje: 'Configuración guardada correctamente',
      configuracion
    });
  } catch (error) {
    logger.error('Error al guardar configuración:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene un valor de configuración por su clave
 */
exports.obtener = async (req, res) => {
  try {
    const { clave } = req.params;
    
    const configuracion = await Configuracion.obtener(clave);
    
    if (!configuracion) {
      return res.status(404).json({
        error: 'Configuración no encontrada'
      });
    }
    
    res.json(configuracion);
  } catch (error) {
    logger.error('Error al obtener configuración:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene todas las configuraciones
 */
exports.obtenerTodas = async (req, res) => {
  try {
    const configuraciones = await Configuracion.obtenerTodas();
    
    res.json(configuraciones);
  } catch (error) {
    logger.error('Error al obtener todas las configuraciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Elimina una configuración
 */
exports.eliminar = async (req, res) => {
  try {
    const { clave } = req.params;
    
    const resultado = await Configuracion.eliminar(clave);
    
    if (!resultado) {
      return res.status(404).json({
        error: 'Configuración no encontrada'
      });
    }
    
    logger.info(`Configuración eliminada: ${clave}`);
    
    res.json({
      mensaje: 'Configuración eliminada correctamente'
    });
  } catch (error) {
    logger.error('Error al eliminar configuración:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene múltiples configuraciones como un objeto
 */
exports.obtenerMultiples = async (req, res) => {
  try {
    const { claves } = req.body;
    
    if (!Array.isArray(claves) || claves.length === 0) {
      return res.status(400).json({
        error: 'Se debe proporcionar un array de claves'
      });
    }
    
    const configuraciones = await Configuracion.obtenerMultiples(claves);
    
    res.json(configuraciones);
  } catch (error) {
    logger.error('Error al obtener múltiples configuraciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene configuraciones públicas para el frontend
 */
exports.obtenerConfiguracionesPublicas = async (req, res) => {
  try {
    // Lista de claves de configuración que son públicas
    const clavesPublicas = [
      'sitio_nombre',
      'sitio_descripcion',
      'contacto_email',
      'contacto_telefono',
      'redes_facebook',
      'redes_twitter',
      'redes_instagram',
      'redes_linkedin'
    ];
    
    const configuraciones = await Configuracion.obtenerMultiples(clavesPublicas);
    
    res.json(configuraciones);
  } catch (error) {
    logger.error('Error al obtener configuraciones públicas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};
