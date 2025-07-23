/**
 * Rutas para la gestión de usuarios
 */

const express = require('express');
const router = express.Router();
const usuariosController = require('../../controladores/usuariosController');
const authMiddleware = require('../../middleware/authMiddleware');

// Proteger todas las rutas de usuarios con middleware de autenticación y rol admin
router.use(authMiddleware.isAuthenticated);
router.use(authMiddleware.isAdmin);

// Rutas CRUD básicas
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById);
router.post('/', usuariosController.createUsuario);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

// Rutas adicionales
router.put('/:id/estado', usuariosController.cambiarEstadoUsuario);
router.post('/:id/reset-password', usuariosController.resetPassword);

module.exports = router;
