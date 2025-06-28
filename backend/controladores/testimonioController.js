/**
 * Controlador para manejar las operaciones relacionadas con testimonios
 */

const Testimonio = require('../modelos/Testimonio');
const { logger } = require('../utilidades/logger');

/**
 * Crea un nuevo testimonio
 */
exports.crear = async (req, res) => {
  try {
    const { 
      nombre_cliente, 
      empresa, 
      texto, 
      calificacion, 
      imagen_url, 
      activo, 
      orden 
    } = req.body;
    
    // Validaciones básicas
    if (!nombre_cliente || !texto || !calificacion) {
      return res.status(400).json({
        error: 'El nombre del cliente, texto y calificación son obligatorios'
      });
    }
    
    // Validar calificación
    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({
        error: 'La calificación debe estar entre 1 y 5'
      });
    }
    
    // Crear nuevo testimonio
    const nuevoTestimonio = await Testimonio.crear({
      nombre_cliente,
      empresa,
      texto,
      calificacion,
      imagen_url,
      activo,
      orden
    });
    
    logger.info(`Nuevo testimonio creado: ${nombre_cliente}`);
    
    res.status(201).json({
      mensaje: 'Testimonio creado correctamente',
      testimonio: nuevoTestimonio
    });
  } catch (error) {
    logger.error('Error al crear testimonio:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene todos los testimonios
 */
exports.obtenerTodos = async (req, res) => {
  try {
    const testimonios = await Testimonio.obtenerTodos();
    
    res.json(testimonios);
  } catch (error) {
    logger.error('Error al obtener testimonios:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene testimonios activos
 */
exports.obtenerActivos = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : null;
    const testimonios = await Testimonio.obtenerActivos(limite);
    
    res.json(testimonios);
  } catch (error) {
    logger.error('Error al obtener testimonios activos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene un testimonio por su ID
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonio = await Testimonio.buscarPorId(id);
    
    if (!testimonio) {
      return res.status(404).json({
        error: 'Testimonio no encontrado'
      });
    }
    
    res.json(testimonio);
  } catch (error) {
    logger.error('Error al obtener testimonio por ID:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Actualiza un testimonio
 */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre_cliente, 
      empresa, 
      texto, 
      calificacion, 
      imagen_url, 
      activo, 
      orden 
    } = req.body;
    
    // Verificar si el testimonio existe
    const testimonioExistente = await Testimonio.buscarPorId(id);
    if (!testimonioExistente) {
      return res.status(404).json({
        error: 'Testimonio no encontrado'
      });
    }
    
    // Validar calificación si se proporciona
    if (calificacion !== undefined && (calificacion < 1 || calificacion > 5)) {
      return res.status(400).json({
        error: 'La calificación debe estar entre 1 y 5'
      });
    }
    
    // Actualizar testimonio
    const testimonioActualizado = await Testimonio.actualizar(id, {
      nombre_cliente,
      empresa,
      texto,
      calificacion,
      imagen_url,
      activo,
      orden
    });
    
    logger.info(`Testimonio actualizado: ${id}`);
    
    res.json({
      mensaje: 'Testimonio actualizado correctamente',
      testimonio: testimonioActualizado
    });
  } catch (error) {
    logger.error('Error al actualizar testimonio:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Elimina un testimonio
 */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el testimonio existe
    const testimonioExistente = await Testimonio.buscarPorId(id);
    if (!testimonioExistente) {
      return res.status(404).json({
        error: 'Testimonio no encontrado'
      });
    }
    
    // Eliminar testimonio (marcarlo como inactivo)
    await Testimonio.eliminar(id);
    
    logger.info(`Testimonio eliminado: ${id}`);
    
    res.json({
      mensaje: 'Testimonio eliminado correctamente'
    });
  } catch (error) {
    logger.error('Error al eliminar testimonio:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};
