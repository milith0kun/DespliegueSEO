/**
 * Rutas para la API de Contactos
 */

const express = require('express');
const router = express.Router();
const contactoController = require('../../controladores/contactoController');

// Middleware de autenticación
const autenticacion = require('../../middleware/autenticacion');
const autorizacion = require('../../middleware/autorizacion');

// Ruta pública para enviar mensajes de contacto
router.post('/', contactoController.crearContacto);

// Rutas protegidas que requieren autenticación
router.use(autenticacion.verificarToken);

// Obtener estadísticas de mensajes (debe ir antes de las rutas con parámetros)
router.get('/estadisticas', autorizacion.esAdmin, contactoController.obtenerEstadisticas);

// Obtener todos los mensajes de contacto (solo administradores)
router.get('/', autorizacion.esAdmin, contactoController.obtenerContactos);

// Obtener un mensaje específico por ID
router.get('/:id', autorizacion.esAdmin, contactoController.obtenerContactoPorId);

// Responder a un mensaje
router.post('/:id/responder', autorizacion.esAdmin, contactoController.responderContacto);

// Actualizar estado de un mensaje (solo administradores)
router.patch('/:id/estado', autorizacion.esAdmin, contactoController.actualizarEstadoContacto);

// Ruta temporal para pruebas - Obtener todos los contactos (sin autenticación)
// router.get('/todos', contactoController.obtenerContactos);

module.exports = router;
