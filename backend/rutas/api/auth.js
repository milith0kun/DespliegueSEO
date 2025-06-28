/**
 * Rutas para la API de Autenticación y Usuarios
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../../controladores/usuarioController');

// Middleware de autenticación (se implementará más adelante)
// const autenticacion = require('../../middleware/autenticacion');
// const autorizacion = require('../../middleware/autorizacion');

// Rutas públicas
router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);

// Rutas protegidas que requieren autenticación
// router.use(autenticacion.verificarToken);

// Rutas de perfil de usuario
router.get('/perfil', usuarioController.obtenerPerfil);
router.put('/perfil', usuarioController.actualizarPerfil);
router.post('/cambiar-password', usuarioController.cambiarPassword);

// Rutas de administración de usuarios (solo admin)
router.get('/usuarios', usuarioController.obtenerUsuarios);
router.put('/usuarios/:id', usuarioController.actualizarUsuario);

module.exports = router;
