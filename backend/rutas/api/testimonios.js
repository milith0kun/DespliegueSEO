/**
 * Rutas para la API de Testimonios
 */

const express = require('express');
const router = express.Router();
const testimonioController = require('../../controladores/testimonioController');

// Middleware de autenticación (se implementará más adelante)
// const autenticacion = require('../../middleware/autenticacion');
// const autorizacion = require('../../middleware/autorizacion');

// Rutas públicas
router.get('/', testimonioController.obtenerActivos);
router.get('/:id', testimonioController.obtenerPorId);

// Rutas protegidas que requieren autenticación de administrador
// router.use(autenticacion.verificarToken);
// router.use(autorizacion.esAdmin);

// Rutas de administración de testimonios
router.get('/admin/todos', testimonioController.obtenerTodos);
router.post('/', testimonioController.crear);
router.put('/:id', testimonioController.actualizar);
router.delete('/:id', testimonioController.eliminar);

module.exports = router;
