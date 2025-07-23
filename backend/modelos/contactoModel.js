/**
 * Modelo para la gestión de contactos
 */

const db = require('../configuracion/db');

const contactoModel = {
    /**
     * Obtiene todos los contactos con paginación y filtros
     * @param {Object} options - Opciones de filtrado y paginación
     * @returns {Promise<Object>} - Datos de contactos y paginación
     */
    getContactos: async (options = {}) => {
        const { page = 1, limit = 10, estado, servicio, busqueda } = options;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT id, nombre, email, telefono, servicio, mensaje, estado, notas, fecha_creacion
            FROM contactos
            WHERE 1=1
        `;
        
        const params = [];
        
        if (estado) {
            query += ' AND estado = ?';
            params.push(estado);
        }
        
        if (servicio) {
            query += ' AND servicio = ?';
            params.push(servicio);
        }
        
        if (busqueda) {
            query += ' AND (nombre LIKE ? OR email LIKE ? OR mensaje LIKE ?)';
            params.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`);
        }
        
        // Consulta para contar total de registros
        const countQuery = query.replace('SELECT id, nombre, email, telefono, servicio, mensaje, estado, notas, fecha_creacion', 'SELECT COUNT(*) as total');
        
        // Agregar ordenamiento y paginación
        query += ' ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        try {
            const [contactos] = await db.query(query, params);
            const [countResult] = await db.query(countQuery, params.slice(0, params.length - 2));
            
            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);
            
            return {
                data: contactos,
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            };
        } catch (error) {
            console.error('Error en modelo al obtener contactos:', error);
            throw new Error('Error al consultar la base de datos');
        }
    },
    
    /**
     * Obtiene un contacto por su ID
     * @param {number} id - ID del contacto
     * @returns {Promise<Object>} - Datos del contacto
     */
    getContactoById: async (id) => {
        try {
            const query = `
                SELECT id, nombre, email, telefono, servicio, mensaje, estado, notas, fecha_creacion
                FROM contactos
                WHERE id = ?
            `;
            
            const [contactos] = await db.query(query, [id]);
            
            if (contactos.length === 0) {
                return null;
            }
            
            return contactos[0];
        } catch (error) {
            console.error('Error en modelo al obtener contacto por ID:', error);
            throw new Error('Error al consultar la base de datos');
        }
    },
    
    /**
     * Crea un nuevo contacto
     * @param {Object} contacto - Datos del contacto
     * @returns {Promise<Object>} - Contacto creado
     */
    createContacto: async (contacto) => {
        try {
            const query = `
                INSERT INTO contactos (nombre, email, telefono, servicio, mensaje, estado)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.query(query, [
                contacto.nombre,
                contacto.email,
                contacto.telefono || null,
                contacto.servicio,
                contacto.mensaje,
                contacto.estado || 'pendiente'
            ]);
            
            return {
                id: result.insertId,
                ...contacto,
                estado: contacto.estado || 'pendiente'
            };
        } catch (error) {
            console.error('Error en modelo al crear contacto:', error);
            throw new Error('Error al guardar el contacto en la base de datos');
        }
    },
    
    /**
     * Actualiza el estado de un contacto
     * @param {number} id - ID del contacto
     * @param {string} estado - Nuevo estado
     * @returns {Promise<Object>} - Resultado de la operación
     */
    updateEstadoContacto: async (id, estado) => {
        try {
            // Verificar si el contacto existe
            const contacto = await contactoModel.getContactoById(id);
            if (!contacto) {
                throw new Error('Contacto no encontrado');
            }
            
            const query = 'UPDATE contactos SET estado = ? WHERE id = ?';
            const [result] = await db.query(query, [estado, id]);
            
            return {
                affectedRows: result.affectedRows,
                message: 'Estado actualizado correctamente'
            };
        } catch (error) {
            console.error('Error en modelo al actualizar estado:', error);
            throw error;
        }
    },
    
    /**
     * Agrega una nota a un contacto
     * @param {number} id - ID del contacto
     * @param {string} nota - Texto de la nota
     * @param {string} usuario - Nombre del usuario que agrega la nota
     * @returns {Promise<Object>} - Resultado de la operación
     */
    addNotaContacto: async (id, nota, usuario) => {
        try {
            // Verificar si el contacto existe
            const contacto = await contactoModel.getContactoById(id);
            if (!contacto) {
                throw new Error('Contacto no encontrado');
            }
            
            // Preparar la nueva nota
            const nuevaNota = {
                texto: nota,
                usuario: usuario,
                fecha: new Date()
            };
            
            // Obtener notas existentes o crear array vacío
            let notas = [];
            if (contacto.notas) {
                try {
                    notas = JSON.parse(contacto.notas);
                } catch (e) {
                    console.error('Error al parsear notas existentes:', e);
                }
            }
            
            // Agregar la nueva nota
            notas.push(nuevaNota);
            
            // Actualizar en la base de datos
            const query = 'UPDATE contactos SET notas = ? WHERE id = ?';
            const [result] = await db.query(query, [JSON.stringify(notas), id]);
            
            return {
                affectedRows: result.affectedRows,
                message: 'Nota agregada correctamente'
            };
        } catch (error) {
            console.error('Error en modelo al agregar nota:', error);
            throw error;
        }
    },
    
    /**
     * Elimina un contacto
     * @param {number} id - ID del contacto
     * @returns {Promise<Object>} - Resultado de la operación
     */
    deleteContacto: async (id) => {
        try {
            // Verificar si el contacto existe
            const contacto = await contactoModel.getContactoById(id);
            if (!contacto) {
                throw new Error('Contacto no encontrado');
            }
            
            const query = 'DELETE FROM contactos WHERE id = ?';
            const [result] = await db.query(query, [id]);
            
            return {
                affectedRows: result.affectedRows,
                message: 'Contacto eliminado correctamente'
            };
        } catch (error) {
            console.error('Error en modelo al eliminar contacto:', error);
            throw error;
        }
    },
    
    /**
     * Obtiene estadísticas de contactos
     * @returns {Promise<Object>} - Estadísticas de contactos
     */
    getEstadisticas: async () => {
        try {
            // Total de contactos
            const [totalResult] = await db.query('SELECT COUNT(*) as total FROM contactos');
            
            // Contactos por estado
            const [porEstadoResult] = await db.query(`
                SELECT estado, COUNT(*) as cantidad
                FROM contactos
                GROUP BY estado
                ORDER BY cantidad DESC
            `);
            
            // Contactos por servicio
            const [porServicioResult] = await db.query(`
                SELECT servicio, COUNT(*) as cantidad
                FROM contactos
                GROUP BY servicio
                ORDER BY cantidad DESC
            `);
            
            // Contactos recientes
            const [recientesResult] = await db.query(`
                SELECT id, nombre, email, servicio, estado, fecha_creacion
                FROM contactos
                ORDER BY fecha_creacion DESC
                LIMIT 5
            `);
            
            return {
                total: totalResult[0].total,
                porEstado: porEstadoResult,
                porServicio: porServicioResult,
                recientes: recientesResult
            };
        } catch (error) {
            console.error('Error en modelo al obtener estadísticas:', error);
            throw new Error('Error al consultar la base de datos');
        }
    }
};

module.exports = contactoModel;
