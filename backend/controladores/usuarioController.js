/**
 * Controlador para manejar las operaciones relacionadas con usuarios
 */

const Usuario = require('../modelos/Usuario');
const { logger } = require('../utilidades/logger');
const jwt = require('jsonwebtoken');

/**
 * Registra un nuevo usuario
 */
exports.registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }
    
    // Verificar si el email ya está registrado
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'El email ya está registrado'
      });
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.crear({
      nombre,
      email,
      password,
      rol: 'usuario' // Por defecto, rol de usuario normal
    });
    
    logger.info(`Nuevo usuario registrado: ${email}`);
    
    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });
  } catch (error) {
    logger.error('Error al registrar usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Inicia sesión de usuario
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son obligatorios'
      });
    }
    
    // Buscar usuario por email
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }
    
    // Verificar si el usuario está activo
    if (!usuario.esta_activo) {
      return res.status(401).json({
        error: 'Usuario desactivado'
      });
    }
    
    // Verificar contraseña
    const passwordValida = await Usuario.verificarPassword(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    logger.info(`Usuario inició sesión: ${email}`);
    
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene el perfil del usuario actual
 */
exports.obtenerPerfil = async (req, res) => {
  try {
    // El middleware de autenticación ya ha verificado el token
    // y ha añadido el usuario a req.usuario
    const usuario = await Usuario.buscarPorId(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      fecha_creacion: usuario.creado_en
    });
  } catch (error) {
    logger.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Actualiza el perfil del usuario
 */
exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({
        error: 'El nombre es obligatorio'
      });
    }
    
    const usuarioActualizado = await Usuario.actualizar(req.usuario.id, {
      nombre,
      email: req.usuario.email,
      activo: true // Se convierte a esta_activo en el modelo
    });
    
    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email
      }
    });
  } catch (error) {
    logger.error('Error al actualizar perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Cambia la contraseña del usuario
 */
exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    
    if (!passwordActual || !nuevaPassword) {
      return res.status(400).json({
        error: 'La contraseña actual y la nueva son obligatorias'
      });
    }
    
    // Obtener usuario con contraseña
    const usuario = await Usuario.buscarPorEmail(req.usuario.email);
    
    // Verificar contraseña actual
    const passwordValida = await Usuario.verificarPassword(passwordActual, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        error: 'La contraseña actual es incorrecta'
      });
    }
    
    // Cambiar contraseña
    await Usuario.cambiarPassword(req.usuario.id, nuevaPassword);
    
    res.json({
      mensaje: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    logger.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Obtiene todos los usuarios (solo admin)
 */
exports.obtenerUsuarios = async (req, res) => {
  try {
    // Verificar si es administrador
    if (req.usuario.rol !== 'ADMIN') {
      return res.status(403).json({
        error: 'No autorizado'
      });
    }
    
    const usuarios = await Usuario.obtenerTodos();
    
    res.json(usuarios);
  } catch (error) {
    logger.error('Error al obtener usuarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Actualiza un usuario (solo admin)
 */
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, activo, rol } = req.body;
    
    // Verificar si es administrador
    if (req.usuario.rol !== 'ADMIN') {
      return res.status(403).json({
        error: 'No autorizado'
      });
    }
    
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.buscarPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }
    
    // Actualizar usuario
    const usuarioActualizado = await Usuario.actualizar(id, {
      nombre,
      email,
      activo, // Se convierte a esta_activo en el modelo
      rol
    });
    
    res.json({
      mensaje: 'Usuario actualizado correctamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    logger.error('Error al actualizar usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};
