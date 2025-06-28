/**
 * Rutas para la API de Servicios
 */

const express = require('express');
const router = express.Router();
const servicioController = require('../../controladores/servicioController');

// Middleware de autenticación (se implementará más adelante)
// const autenticacion = require('../../middleware/autenticacion');
// const autorizacion = require('../../middleware/autorizacion');

// Rutas públicas
router.get('/', servicioController.obtenerActivos);
router.get('/todos', servicioController.obtenerTodos);
router.get('/:id', servicioController.obtenerPorId);
router.get('/slug/:slug', servicioController.obtenerPorSlug);

// Rutas protegidas que requieren autenticación de administrador
// router.use(autenticacion.verificarToken);
// router.use(autorizacion.esAdmin);

// Rutas de administración de servicios
router.post('/', servicioController.crear);
router.put('/:id', servicioController.actualizar);
router.delete('/:id', servicioController.eliminar);

module.exports = router;
