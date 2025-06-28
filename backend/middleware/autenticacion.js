/**
 * Middleware de autenticación
 * Verifica tokens JWT y gestiona la autenticación de usuarios
 */

const jwt = require('jsonwebtoken');
const { logger } = require('../utilidades/logger');
const Usuario = require('../modelos/Usuario');

/**
 * Verifica si el token JWT es válido
 */
exports.verificarToken = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'Acceso denegado. Token no proporcionado'
      });
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar si el usuario existe y está activo
    const usuario = await Usuario.buscarPorId(decoded.id);
    
    if (!usuario || !usuario.esta_activo) {
      return res.status(401).json({
        error: 'Usuario no válido o desactivado'
      });
    }
    
    // Añadir información del usuario a la solicitud
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }
    
    logger.error('Error en verificación de token:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware opcional que no bloquea si no hay token
 * Útil para rutas que pueden ser accedidas por usuarios autenticados y no autenticados
 */
exports.verificarTokenOpcional = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(' ')[1];
    
    // Si no hay token, continuar sin usuario
    if (!token) {
      return next();
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar si el usuario existe y está activo
    const usuario = await Usuario.buscarPorId(decoded.id);
    
    if (usuario && usuario.esta_activo) {
      // Añadir información del usuario a la solicitud
      req.usuario = {
        id: decoded.id,
        email: decoded.email,
        rol: decoded.rol
      };
    }
    
    next();
  } catch (error) {
    // Si hay error en el token, simplemente continuar sin usuario
    next();
  }
};
