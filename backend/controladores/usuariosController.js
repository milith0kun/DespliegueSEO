/**
 * Controlador de usuarios
 * Gestiona operaciones CRUD para usuarios
 */

const db = require('../configuracion/db');
const bcrypt = require('bcrypt');

/**
 * Obtiene todos los usuarios
 */
const getUsuarios = async (req, res) => {
    try {
        // Consultar usuarios en la base de datos (sin devolver passwords)
        const [usuarios] = await db.query(
            'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC'
        );
        
        return res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Obtiene un usuario por su ID
 */
const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Consultar usuario en la base de datos (sin devolver password)
        const [usuarios] = await db.query(
            'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios WHERE id = ?',
            [id]
        );
        
        // Verificar si el usuario existe
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        return res.status(200).json({
            success: true,
            data: usuarios[0]
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Crea un nuevo usuario
 */
const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }
        
        // Verificar si el email ya está registrado
        const [existentes] = await db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );
        
        if (existentes.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }
        
        // Hashear contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insertar usuario en la base de datos
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, password, rol, activo, fecha_creacion) VALUES (?, ?, ?, ?, true, NOW())',
            [nombre, email, hashedPassword, rol]
        );
        
        // Obtener el usuario recién creado (sin password)
        const [nuevoUsuario] = await db.query(
            'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios WHERE id = ?',
            [result.insertId]
        );
        
        return res.status(201).json({
            success: true,
            message: 'Usuario creado correctamente',
            data: nuevoUsuario[0]
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Actualiza un usuario existente
 */
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !email || !rol) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y rol son requeridos'
            });
        }
        
        // Verificar si el usuario existe
        const [usuarios] = await db.query(
            'SELECT id FROM usuarios WHERE id = ?',
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Verificar si el email ya está registrado por otro usuario
        const [existentes] = await db.query(
            'SELECT id FROM usuarios WHERE email = ? AND id != ?',
            [email, id]
        );
        
        if (existentes.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado por otro usuario'
            });
        }
        
        // Actualizar usuario en la base de datos
        await db.query(
            'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
            [nombre, email, rol, id]
        );
        
        // Obtener el usuario actualizado
        const [usuarioActualizado] = await db.query(
            'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios WHERE id = ?',
            [id]
        );
        
        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: usuarioActualizado[0]
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Elimina un usuario
 */
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el usuario existe
        const [usuarios] = await db.query(
            'SELECT id FROM usuarios WHERE id = ?',
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // No permitir eliminar al usuario que está haciendo la solicitud
        if (req.session.user.id == id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propio usuario'
            });
        }
        
        // Eliminar usuario de la base de datos
        await db.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );
        
        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Cambia el estado (activo/inactivo) de un usuario
 */
const cambiarEstadoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        
        // Validar campo requerido
        if (activo === undefined) {
            return res.status(400).json({
                success: false,
                message: 'El campo activo es requerido'
            });
        }
        
        // Verificar si el usuario existe
        const [usuarios] = await db.query(
            'SELECT id FROM usuarios WHERE id = ?',
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // No permitir desactivar al usuario que está haciendo la solicitud
        if (req.session.user.id == id && !activo) {
            return res.status(400).json({
                success: false,
                message: 'No puedes desactivar tu propio usuario'
            });
        }
        
        // Actualizar estado del usuario
        await db.query(
            'UPDATE usuarios SET activo = ? WHERE id = ?',
            [activo, id]
        );
        
        return res.status(200).json({
            success: true,
            message: activo ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente'
        });
    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Resetea la contraseña de un usuario
 */
const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el usuario existe
        const [usuarios] = await db.query(
            'SELECT id, email FROM usuarios WHERE id = ?',
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Generar contraseña temporal
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // Hashear contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);
        
        // Actualizar contraseña en la base de datos
        await db.query(
            'UPDATE usuarios SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
        
        // Aquí se enviaría un email con la contraseña temporal
        // (implementación omitida por simplicidad)
        console.log(`Contraseña reseteada para usuario ${id}. Nueva contraseña: ${tempPassword}`);
        
        return res.status(200).json({
            success: true,
            message: 'Contraseña reseteada correctamente'
        });
    } catch (error) {
        console.error('Error al resetear contraseña:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

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
        
        return res.status(200).json({
            success: true,
            data: {
                total,
                porRol: rolesDist
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

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    cambiarEstadoUsuario,
    resetPassword,
    getEstadisticasUsuarios
};
