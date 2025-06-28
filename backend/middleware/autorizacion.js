/**
 * Middleware de autorización
 * Verifica permisos y roles de usuarios
 */

const { logger } = require('../utilidades/logger');

/**
 * Verifica si el usuario tiene rol de administrador
 */
exports.esAdmin = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        error: 'Usuario no autenticado'
      });
    }
    
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({
        error: 'Acceso denegado. Se requieren permisos de administrador'
      });
    }
    
    next();
  } catch (error) {
    logger.error('Error en verificación de permisos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Verifica si el usuario es el propietario del recurso o es administrador
 * Requiere que el ID del propietario esté en req.params.usuarioId o en el recurso
 */
exports.esPropietarioOAdmin = (obtenerPropietarioId) => {
  return async (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          error: 'Usuario no autenticado'
        });
      }
      
      // Si es admin, permitir acceso
      if (req.usuario.rol === 'admin') {
        return next();
      }
      
      // Obtener ID del propietario del recurso
      let propietarioId;
      
      if (typeof obtenerPropietarioId === 'function') {
        propietarioId = await obtenerPropietarioId(req);
      } else if (req.params.usuarioId) {
        propietarioId = req.params.usuarioId;
      } else {
        return res.status(403).json({
          error: 'Acceso denegado. No se pudo verificar la propiedad del recurso'
        });
      }
      
      // Verificar si el usuario es el propietario
      if (req.usuario.id !== propietarioId) {
        return res.status(403).json({
          error: 'Acceso denegado. No eres el propietario de este recurso'
        });
      }
      
      next();
    } catch (error) {
      logger.error('Error en verificación de propiedad:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  };
};
