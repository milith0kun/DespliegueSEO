/**
 * Rutas para la API de Configuración
 */

const express = require('express');
const router = express.Router();
const configuracionController = require('../../controladores/configuracionController');

// Middleware de autenticación (se implementará más adelante)
// const autenticacion = require('../../middleware/autenticacion');
// const autorizacion = require('../../middleware/autorizacion');

// Rutas públicas
router.get('/publicas', configuracionController.obtenerConfiguracionesPublicas);

// Rutas protegidas que requieren autenticación de administrador
// router.use(autenticacion.verificarToken);
// router.use(autorizacion.esAdmin);

// Rutas de administración de configuración
router.get('/', configuracionController.obtenerTodas);
router.get('/:clave', configuracionController.obtener);
router.post('/', configuracionController.guardar);
router.delete('/:clave', configuracionController.eliminar);
router.post('/multiples', configuracionController.obtenerMultiples);

module.exports = router;
