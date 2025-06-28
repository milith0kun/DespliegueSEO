/**
 * Rutas para la API de Artículos/Blog
 */

const express = require('express');
const router = express.Router();
const articuloController = require('../../controladores/articuloController');

// Middleware de autenticación (se implementará más adelante)
// const autenticacion = require('../../middleware/autenticacion');
// const autorizacion = require('../../middleware/autorizacion');

// Rutas públicas
router.get('/', articuloController.obtenerPublicados);
router.get('/slug/:slug', articuloController.obtenerPorSlug);

// Rutas protegidas que requieren autenticación
// router.use(autenticacion.verificarToken);

// Rutas para autores y administradores
router.get('/admin/todos', articuloController.obtenerTodos);
router.post('/', articuloController.crear);
router.get('/:id', articuloController.obtenerPorId);
router.put('/:id', articuloController.actualizar);
router.delete('/:id', articuloController.eliminar);

module.exports = router;
