/**
 * Controlador para manejar las operaciones relacionadas con artículos/blog
 */

const Articulo = require('../modelos/Articulo');
const { logger } = require('../utilidades/logger');

/**
 * Crea un nuevo artículo
 */
exports.crear = async (req, res) => {
  try {
    const { 
      titulo, 
      slug, 
      contenido, 
      imagen_destacada, 
      extracto, 
      publicado, 
      fecha_publicacion 
    } = req.body;
    
    // Validaciones básicas
    if (!titulo || !slug || !contenido) {
      return res.status(400).json({
        error: 'El título, slug y contenido son obligatorios'
      });
    }
    
    // Verificar si ya existe un artículo con el mismo slug
    const articuloExistente = await Articulo.buscarPorSlug(slug);
    if (articuloExistente) {
      return res.status(400).json({
        error: 'Ya existe un artículo con ese slug'
      });
    }
    
    // Crear nuevo artículo
    const nuevoArticulo = await Articulo.crear({
      titulo,
      slug,
      contenido,
      imagen_destacada,
      extracto,
      autor_id: req.usuario.id, // ID del usuario autenticado
      publicado: publicado || false,
      fecha_publicacion
    });
    
    logger.info(`Nuevo artículo creado: ${titulo} (${slug})`);
    
    res.status(201).json({
      mensaje: 'Artículo creado correctamente',
      articulo: nuevoArticulo
    });
  } catch (error) {
    logger.error('Error al crear artículo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene todos los artículos (admin)
 */
exports.obtenerTodos = async (req, res) => {
  try {
    const opciones = {
      limite: req.query.limite ? parseInt(req.query.limite) : 10,
      offset: req.query.pagina ? (parseInt(req.query.pagina) - 1) * (parseInt(req.query.limite) || 10) : 0
    };
    
    const articulos = await Articulo.obtenerTodos(opciones);
    
    res.json(articulos);
  } catch (error) {
    logger.error('Error al obtener artículos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene artículos publicados (público)
 */
exports.obtenerPublicados = async (req, res) => {
  try {
    const opciones = {
      limite: req.query.limite ? parseInt(req.query.limite) : 10,
      offset: req.query.pagina ? (parseInt(req.query.pagina) - 1) * (parseInt(req.query.limite) || 10) : 0
    };
    
    const articulos = await Articulo.obtenerPublicados(opciones);
    const total = await Articulo.contarPublicados();
    
    res.json({
      articulos,
      paginacion: {
        total,
        pagina: req.query.pagina ? parseInt(req.query.pagina) : 1,
        limite: opciones.limite,
        paginas: Math.ceil(total / opciones.limite)
      }
    });
  } catch (error) {
    logger.error('Error al obtener artículos publicados:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene un artículo por su ID
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const articulo = await Articulo.buscarPorId(id);
    
    if (!articulo) {
      return res.status(404).json({
        error: 'Artículo no encontrado'
      });
    }
    
    // Si no está publicado y no es admin, no mostrar
    if (!articulo.publicado && (!req.usuario || req.usuario.rol !== 'admin')) {
      return res.status(404).json({
        error: 'Artículo no encontrado'
      });
    }
    
    res.json(articulo);
  } catch (error) {
    logger.error('Error al obtener artículo por ID:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene un artículo por su slug (público)
 */
exports.obtenerPorSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const articulo = await Articulo.buscarPorSlug(slug);
    
    if (!articulo) {
      return res.status(404).json({
        error: 'Artículo no encontrado'
      });
    }
    
    // Si no está publicado y no es admin, no mostrar
    if (!articulo.publicado && (!req.usuario || req.usuario.rol !== 'admin')) {
      return res.status(404).json({
        error: 'Artículo no encontrado'
      });
    }
    
    res.json(articulo);
  } catch (error) {
    logger.error('Error al obtener artículo por slug:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Actualiza un artículo
 */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      titulo, 
      slug, 
      contenido, 
      imagen_destacada, 
      extracto, 
      publicado, 
      fecha_publicacion 
    } = req.body;
    
    // Verificar si el artículo existe
    const articuloExistente = await Articulo.buscarPorId(id);
    if (!articuloExistente) {
      return res.status(404).json({
        error: 'Artículo no encontrado'
      });
    }
    
    // Verificar permisos (solo el autor o admin pueden editar)
    if (articuloExistente.autor_id !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        error: 'No autorizado para editar este artículo'
      });
    }
    
    // Si se cambia el slug, verificar que no exista otro con ese slug
    if (slug !== articuloExistente.slug) {
      const slugExistente = await Articulo.buscarPorSlug(slug);
      if (slugExistente) {
        return res.status(400).json({
          error: 'Ya existe un artículo con ese slug'
        });
      }
    }
    
    // Actualizar artículo
    const articuloActualizado = await Articulo.actualizar(id, {
      titulo,
      slug,
      contenido,
      imagen_destacada,
      extracto,
      publicado,
      fecha_publicacion
    });
    
    logger.info(`Artículo actualizado: ${titulo} (${slug})`);
    
    res.json({
      mensaje: 'Artículo actualizado correctamente',
      articulo: articuloActualizado
    });
  } catch (error) {
    logger.error('Error al actualizar artículo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Elimina un artículo
 */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el artículo existe
    const articuloExistente = await Articulo.buscarPorId(id);
    if (!articuloExistente) {
      return res.status(404).json({
        error: 'Artículo no encontrado'
      });
    }
    
    // Verificar permisos (solo el autor o admin pueden eliminar)
    if (articuloExistente.autor_id !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        error: 'No autorizado para eliminar este artículo'
      });
    }
    
    // Eliminar artículo
    await Articulo.eliminar(id);
    
    logger.info(`Artículo eliminado: ${id}`);
    
    res.json({
      mensaje: 'Artículo eliminado correctamente'
    });
  } catch (error) {
    logger.error('Error al eliminar artículo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};
