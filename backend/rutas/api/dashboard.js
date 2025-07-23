/**
 * Rutas para el dashboard
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../../controladores/dashboardController');
const authMiddleware = require('../../middleware/authMiddleware');

// Proteger todas las rutas del dashboard con middleware de autenticación
router.use(authMiddleware.isAuthenticated);

// Rutas para estadísticas (accesibles para admin y editor)
router.get('/resumen', authMiddleware.hasRole(['admin', 'editor']), dashboardController.getResumenDashboard);
router.get('/contactos/recientes', authMiddleware.hasRole(['admin', 'editor']), dashboardController.getContactosRecientes);

// Rutas para estadísticas detalladas (solo admin)
router.get('/estadisticas/usuarios', authMiddleware.isAdmin, dashboardController.getEstadisticasUsuarios);
router.get('/estadisticas/contactos', authMiddleware.isAdmin, dashboardController.getEstadisticasContactos);

module.exports = router;
