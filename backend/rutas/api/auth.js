/**
 * Rutas de autenticación
 */

const express = require('express');
const router = express.Router();
const authController = require('../../controladores/authController');

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

// Ruta para verificar autenticación
router.get('/check', authController.checkAuth);

// Ruta para obtener datos del usuario actual
router.get('/me', authController.getMe);

module.exports = router;
