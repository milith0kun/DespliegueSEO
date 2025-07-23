/**
 * Controlador del Dashboard
 * Proporciona estadísticas y datos para el panel de administración
 */

const db = require('../configuracion/db');

/**
 * Obtiene estadísticas de usuarios para el dashboard
 */
const getEstadisticasUsuarios = async (req, res) => {
    try {
        // Obtener total de usuarios
        const [totalResult] = await db.query('SELECT COUNT(*) as total FROM usuarios');
        const total = totalResult[0].total;
        
        // Obtener distribución por roles
        const [rolesDist] = await db.query(
            'SELECT rol, COUNT(*) as cantidad FROM usuarios GROUP BY rol'
        );
        
        // Obtener usuarios activos vs inactivos
        const [estadosDist] = await db.query(
            'SELECT activo, COUNT(*) as cantidad FROM usuarios GROUP BY activo'
        );
        
        return res.status(200).json({
            success: true,
            data: {
                total,
                porRol: rolesDist,
                porEstado: estadosDist
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de usuarios:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Obtiene estadísticas de contactos para el dashboard
 */
const getEstadisticasContactos = async (req, res) => {
    try {
        // Obtener total de contactos
        const [totalResult] = await db.query('SELECT COUNT(*) as total FROM contactos');
        const total = totalResult[0].total;
        
        // Obtener distribución por estado
        const [estadosDist] = await db.query(
            'SELECT estado, COUNT(*) as cantidad FROM contactos GROUP BY estado'
        );
        
        // Obtener distribución por servicio
        const [serviciosDist] = await db.query(
            'SELECT servicio, COUNT(*) as cantidad FROM contactos GROUP BY servicio'
        );
        
        // Obtener contactos por mes (últimos 6 meses)
        const [contactosPorMes] = await db.query(`
            SELECT 
                DATE_FORMAT(fecha_creacion, '%Y-%m') as mes,
                COUNT(*) as cantidad
            FROM contactos
            WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m')
            ORDER BY mes ASC
        `);
        
        return res.status(200).json({
            success: true,
            data: {
                total,
                porEstado: estadosDist,
                porServicio: serviciosDist,
                porMes: contactosPorMes
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de contactos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Obtiene los contactos más recientes para el dashboard
 */
const getContactosRecientes = async (req, res) => {
    try {
        // Obtener los últimos 5 contactos
        const [contactos] = await db.query(`
            SELECT 
                id, nombre, email, telefono, mensaje, servicio, estado, fecha_creacion
            FROM contactos
            ORDER BY fecha_creacion DESC
            LIMIT 5
        `);
        
        return res.status(200).json({
            success: true,
            data: contactos
        });
    } catch (error) {
        console.error('Error al obtener contactos recientes:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Obtiene resumen general para el dashboard
 */
const getResumenDashboard = async (req, res) => {
    try {
        // Obtener total de usuarios
        const [usuariosResult] = await db.query('SELECT COUNT(*) as total FROM usuarios');
        
        // Obtener total de contactos
        const [contactosResult] = await db.query('SELECT COUNT(*) as total FROM contactos');
        
        // Obtener contactos pendientes
        const [pendientesResult] = await db.query(
            "SELECT COUNT(*) as total FROM contactos WHERE estado = 'pendiente'"
        );
        
        // Obtener servicios más solicitados
        const [serviciosResult] = await db.query(`
            SELECT 
                servicio, COUNT(*) as cantidad
            FROM contactos
            GROUP BY servicio
            ORDER BY cantidad DESC
            LIMIT 3
        `);
        
        return res.status(200).json({
            success: true,
            data: {
                totalUsuarios: usuariosResult[0].total,
                totalContactos: contactosResult[0].total,
                contactosPendientes: pendientesResult[0].total,
                serviciosPopulares: serviciosResult
            }
        });
    } catch (error) {
        console.error('Error al obtener resumen del dashboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

module.exports = {
    getEstadisticasUsuarios,
    getEstadisticasContactos,
    getContactosRecientes,
    getResumenDashboard
};
