/**
 * Controlador para manejar las operaciones relacionadas con servicios
 */

const Servicio = require('../modelos/Servicio');
const { logger } = require('../utilidades/logger');

/**
 * Crea un nuevo servicio
 */
exports.crear = async (req, res) => {
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
    } = req.body;
    
    // Validaciones básicas
    if (!nombre || !slug) {
      return res.status(400).json({
        error: 'El nombre y el slug son obligatorios'
      });
    }
    
    // Verificar si ya existe un servicio con el mismo slug
    const servicioExistente = await Servicio.buscarPorSlug(slug);
    if (servicioExistente) {
      return res.status(400).json({
        error: 'Ya existe un servicio con ese slug'
      });
    }
    
    // Crear nuevo servicio
    const nuevoServicio = await Servicio.crear({
      nombre,
      slug,
      descripcion_corta,
      descripcion_completa,
      precio,
      imagen_url,
      destacado,
      orden,
      activo
    });
    
    logger.info(`Nuevo servicio creado: ${nombre} (${slug})`);
    
    res.status(201).json({
      mensaje: 'Servicio creado correctamente',
      servicio: nuevoServicio
    });
  } catch (error) {
    logger.error('Error al crear servicio:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene todos los servicios
 */
exports.obtenerTodos = async (req, res) => {
  try {
    const servicios = await Servicio.obtenerTodos();
    
    res.json(servicios);
  } catch (error) {
    logger.error('Error al obtener servicios:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene servicios activos
 */
exports.obtenerActivos = async (req, res) => {
  try {
    const soloDestacados = req.query.destacados === 'true';
    const servicios = await Servicio.obtenerActivos(soloDestacados);
    
    res.json(servicios);
  } catch (error) {
    logger.error('Error al obtener servicios activos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene un servicio por su ID
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const servicio = await Servicio.buscarPorId(id);
    
    if (!servicio) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }
    
    res.json(servicio);
  } catch (error) {
    logger.error('Error al obtener servicio por ID:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene un servicio por su slug
 */
exports.obtenerPorSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const servicio = await Servicio.buscarPorSlug(slug);
    
    if (!servicio) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }
    
    res.json(servicio);
  } catch (error) {
    logger.error('Error al obtener servicio por slug:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Actualiza un servicio
 */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
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
    } = req.body;
    
    // Verificar si el servicio existe
    const servicioExistente = await Servicio.buscarPorId(id);
    if (!servicioExistente) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }
    
    // Si se cambia el slug, verificar que no exista otro con ese slug
    if (slug !== servicioExistente.slug) {
      const slugExistente = await Servicio.buscarPorSlug(slug);
      if (slugExistente) {
        return res.status(400).json({
          error: 'Ya existe un servicio con ese slug'
        });
      }
    }
    
    // Actualizar servicio
    const servicioActualizado = await Servicio.actualizar(id, {
      nombre,
      slug,
      descripcion_corta,
      descripcion_completa,
      precio,
      imagen_url,
      destacado,
      orden,
      activo
    });
    
    logger.info(`Servicio actualizado: ${nombre} (${slug})`);
    
    res.json({
      mensaje: 'Servicio actualizado correctamente',
      servicio: servicioActualizado
    });
  } catch (error) {
    logger.error('Error al actualizar servicio:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Elimina un servicio
 */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el servicio existe
    const servicioExistente = await Servicio.buscarPorId(id);
    if (!servicioExistente) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }
    
    // Eliminar servicio (marcarlo como inactivo)
    await Servicio.eliminar(id);
    
    logger.info(`Servicio eliminado: ${id}`);
    
    res.json({
      mensaje: 'Servicio eliminado correctamente'
    });
  } catch (error) {
    logger.error('Error al eliminar servicio:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};
