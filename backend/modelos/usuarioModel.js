/**
 * Modelo para la gestión de usuarios
 */

const db = require('../configuracion/db');
const bcrypt = require('bcrypt');

const usuarioModel = {
    /**
     * Obtiene todos los usuarios con paginación y filtros
     * @param {Object} options - Opciones de filtrado y paginación
     * @returns {Promise<Object>} - Datos de usuarios y paginación
     */
    getUsuarios: async (options = {}) => {
        const { page = 1, limit = 10, estado, rol, busqueda } = options;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT id, nombre, email, rol, estado, fecha_creacion, ultima_conexion
            FROM usuarios
            WHERE 1=1
        `;
        
        const params = [];
        
        if (estado) {
            query += ' AND estado = ?';
            params.push(estado);
        }
        
        if (rol) {
            query += ' AND rol = ?';
            params.push(rol);
        }
        
        if (busqueda) {
            query += ' AND (nombre LIKE ? OR email LIKE ?)';
            params.push(`%${busqueda}%`, `%${busqueda}%`);
        }
        
        // Consulta para contar total de registros
        const countQuery = query.replace('SELECT id, nombre, email, rol, estado, fecha_creacion, ultima_conexion', 'SELECT COUNT(*) as total');
        
        // Agregar ordenamiento y paginación
        query += ' ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        try {
            const [usuarios] = await db.query(query, params);
            const [countResult] = await db.query(countQuery, params.slice(0, params.length - 2));
            
            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);
            
            return {
                data: usuarios,
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            };
        } catch (error) {
            console.error('Error en modelo al obtener usuarios:', error);
            throw new Error('Error al consultar la base de datos');
        }
    },
    
    /**
     * Obtiene un usuario por su ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} - Datos del usuario
     */
    getUsuarioById: async (id) => {
        try {
            const query = `
                SELECT id, nombre, email, rol, estado, fecha_creacion, ultima_conexion
                FROM usuarios
                WHERE id = ?
            `;
            
            const [usuarios] = await db.query(query, [id]);
            
            if (usuarios.length === 0) {
                return null;
            }
            
            return usuarios[0];
        } catch (error) {
            console.error('Error en modelo al obtener usuario por ID:', error);
            throw new Error('Error al consultar la base de datos');
        }
    },
    
    /**
     * Obtiene un usuario por su email
     * @param {string} email - Email del usuario
     * @returns {Promise<Object>} - Datos del usuario
     */
    getUsuarioByEmail: async (email) => {
        try {
            const query = `
                SELECT id, nombre, email, hash_password, rol, estado, fecha_creacion, ultima_conexion
                FROM usuarios
                WHERE email = ?
            `;
            
            const [usuarios] = await db.query(query, [email]);
            
            if (usuarios.length === 0) {
                return null;
            }
            
            return usuarios[0];
        } catch (error) {
            console.error('Error en modelo al obtener usuario por email:', error);
            throw new Error('Error al consultar la base de datos');
        }
    },
    
    /**
     * Crea un nuevo usuario
     * @param {Object} usuario - Datos del usuario
     * @returns {Promise<Object>} - Usuario creado
     */
    createUsuario: async (usuario) => {
        try {
            // Verificar si el email ya existe
            const existente = await usuarioModel.getUsuarioByEmail(usuario.email);
            if (existente) {
                throw new Error('El email ya está registrado');
            }
            
            // Hash de la contraseña usando el método centralizado
            const hashedPassword = await usuarioModel.hashPassword(usuario.password);
            
            const query = `
                INSERT INTO usuarios (nombre, email, password, rol, estado)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.query(query, [
                usuario.nombre,
                usuario.email,
                hashedPassword,
                usuario.rol || 'editor',
                usuario.estado || 'activo'
            ]);
            
            return {
                id: result.insertId,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol || 'editor',
                estado: usuario.estado || 'activo'
            };
        } catch (error) {
            console.error('Error en modelo al crear usuario:', error);
            throw error;
        }
    },
    
    /**
     * Actualiza un usuario existente
     * @param {number} id - ID del usuario
     * @param {Object} datos - Datos a actualizar
     * @returns {Promise<Object>} - Resultado de la operación
     */
    updateUsuario: async (id, datos) => {
        try {
            // Verificar si el usuario existe
            const usuario = await usuarioModel.getUsuarioById(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            
            // Si se actualiza el email, verificar que no exista ya
            if (datos.email && datos.email !== usuario.email) {
                const existente = await usuarioModel.getUsuarioByEmail(datos.email);
                if (existente) {
                    throw new Error('El email ya está registrado por otro usuario');
                }
            }
            
            let query = 'UPDATE usuarios SET ';
            const params = [];
            const updates = [];
            
            // Construir query dinámicamente según los campos a actualizar
            if (datos.nombre) {
                updates.push('nombre = ?');
                params.push(datos.nombre);
            }
            
            if (datos.email) {
                updates.push('email = ?');
                params.push(datos.email);
            }
            
            if (datos.rol) {
                updates.push('rol = ?');
                params.push(datos.rol);
            }
            
            if (datos.estado) {
                updates.push('estado = ?');
                params.push(datos.estado);
            }
            
            if (datos.password) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(datos.password, saltRounds);
                updates.push('password = ?');
                params.push(hashedPassword);
            }
            
            if (updates.length === 0) {
                return { affectedRows: 0, message: 'No hay datos para actualizar' };
            }
            
            query += updates.join(', ') + ' WHERE id = ?';
            params.push(id);
            
            const [result] = await db.query(query, params);
            
            return {
                affectedRows: result.affectedRows,
                message: 'Usuario actualizado correctamente'
            };
        } catch (error) {
            console.error('Error en modelo al actualizar usuario:', error);
            throw error;
        }
    },
    
    /**
     * Actualiza el estado de un usuario
     * @param {number} id - ID del usuario
     * @param {string} estado - Nuevo estado
     * @returns {Promise<Object>} - Resultado de la operación
     */
    updateEstadoUsuario: async (id, estado) => {
        try {
            // Verificar si el usuario existe
            const usuario = await usuarioModel.getUsuarioById(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            
            const query = 'UPDATE usuarios SET estado = ? WHERE id = ?';
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
     * Elimina un usuario
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} - Resultado de la operación
     */
    deleteUsuario: async (id) => {
        try {
            // Verificar si el usuario existe
            const usuario = await usuarioModel.getUsuarioById(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            
            const query = 'DELETE FROM usuarios WHERE id = ?';
            const [result] = await db.query(query, [id]);
            
            return {
                affectedRows: result.affectedRows,
                message: 'Usuario eliminado correctamente'
            };
        } catch (error) {
            console.error('Error en modelo al eliminar usuario:', error);
            throw error;
        }
    },
    
    /**
     * Resetea la contraseña de un usuario
     * @param {number} id - ID del usuario
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<Object>} - Resultado de la operación
     */
    resetPassword: async (id, newPassword) => {
        try {
            // Verificar si el usuario existe
            const usuario = await usuarioModel.getUsuarioById(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            
            // Hash de la nueva contraseña usando el método centralizado
            const hashedPassword = await usuarioModel.hashPassword(newPassword);
            
            const query = 'UPDATE usuarios SET password = ? WHERE id = ?';
            const [result] = await db.query(query, [hashedPassword, id]);
            
            return {
                affectedRows: result.affectedRows,
                message: 'Contraseña reseteada correctamente'
            };
        } catch (error) {
            console.error('Error en modelo al resetear contraseña:', error);
            throw error;
        }
    },
    
    /**
     * Verifica si una contraseña coincide con el hash almacenado
     * @param {string} password - Contraseña en texto plano
     * @param {string} hash - Hash almacenado
     * @returns {Promise<boolean>} - True si coincide, false si no
     */
    verificarPassword: async (password, hash) => {
        try {
            // Validar que ambos parámetros existan
            if (!password || !hash) {
                console.error('Verificación de contraseña fallida: password o hash faltante', { 
                    passwordProvided: !!password, 
                    hashProvided: !!hash 
                });
                return false;
            }
            
            // Verificar que el hash tenga formato válido para bcrypt
            if (typeof hash !== 'string' || !hash.startsWith('$2')) {
                console.error('Hash inválido para bcrypt:', { 
                    hashType: typeof hash, 
                    hashPrefix: hash ? hash.substring(0, 3) : null 
                });
                return false;
            }
            
            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.error('Error al verificar contraseña:', error);
            console.error('Detalles:', { 
                passwordLength: password ? password.length : 0,
                hashLength: hash ? hash.length : 0,
                errorName: error.name,
                errorMessage: error.message
            });
            throw new Error(`Error al verificar credenciales: ${error.message}`);
        }
    },
    
    /**
     * Genera un hash para una contraseña
     * @param {string} password - Contraseña en texto plano
     * @returns {Promise<string>} - Hash generado
     */
    hashPassword: async (password) => {
        try {
            const saltRounds = 12; // Aumentado a 12 para mayor seguridad
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            console.error('Error al generar hash de contraseña:', error);
            throw new Error('Error al procesar credenciales');
        }
    },
    
    /**
     * Obtiene estadísticas de usuarios
     * @returns {Promise<Object>} - Estadísticas de usuarios
     */
    getEstadisticas: async () => {
        try {
            // Consulta para obtener total de usuarios por rol
            const queryRoles = `
                SELECT rol, COUNT(*) as total
                FROM usuarios
                GROUP BY rol
            `;
            
            // Consulta para obtener total de usuarios por estado
            const queryEstados = `
                SELECT estado, COUNT(*) as total
                FROM usuarios
                GROUP BY estado
            `;
            
            // Consulta para obtener usuarios recientes
            const queryRecientes = `
                SELECT id, nombre, email, rol, fecha_creacion
                FROM usuarios
                ORDER BY fecha_creacion DESC
                LIMIT 5
            `;
            
            // Consulta para obtener usuarios con más actividad
            const queryActivos = `
                SELECT id, nombre, email, rol, ultima_conexion
                FROM usuarios
                WHERE ultima_conexion IS NOT NULL
                ORDER BY ultima_conexion DESC
                LIMIT 5
            `;
            
            // Ejecutar consultas
            const [roles] = await db.query(queryRoles);
            const [estados] = await db.query(queryEstados);
            const [recientes] = await db.query(queryRecientes);
            const [activos] = await db.query(queryActivos);
            
            return {
                roles,
                estados,
                recientes,
                activos
            };
        } catch (error) {
            console.error('Error en modelo al obtener estadísticas de usuarios:', error);
            throw new Error('Error al consultar la base de datos');
        }
    },
    
    /**
     * Actualiza la última conexión de un usuario
     * @param {number} id - ID del usuario
     * @returns {Promise<void>}
     */
    updateUltimaConexion: async (id) => {
        try {
            const query = 'UPDATE usuarios SET ultima_conexion = NOW() WHERE id = ?';
            await db.query(query, [id]);
        } catch (error) {
            console.error('Error en modelo al actualizar última conexión:', error);
            // No lanzamos error para no interrumpir el flujo de autenticación
        }
    }
};

module.exports = usuarioModel;
