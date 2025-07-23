/**
 * Rutas para la gestión de contactos
 */

const express = require('express');
const router = express.Router();
const contactosController = require('../../controladores/contactosController');
const authMiddleware = require('../../middleware/authMiddleware');

// Ruta pública para crear contacto (formulario de contacto)
router.post('/', contactosController.createContacto);

// Rutas protegidas - requieren autenticación
router.use(authMiddleware.isAuthenticated);

// Rutas accesibles para admin y editor
router.get('/', authMiddleware.hasRole(['admin', 'editor']), contactosController.getContactos);
router.get('/:id', authMiddleware.hasRole(['admin', 'editor']), contactosController.getContactoById);
router.put('/:id/estado', authMiddleware.hasRole(['admin', 'editor']), contactosController.updateEstadoContacto);
router.post('/:id/notas', authMiddleware.hasRole(['admin', 'editor']), contactosController.addNotaContacto);

// Rutas solo para admin
router.delete('/:id', authMiddleware.isAdmin, contactosController.deleteContacto);
router.get('/estadisticas/general', authMiddleware.isAdmin, contactosController.getEstadisticasContactos);

module.exports = router;
