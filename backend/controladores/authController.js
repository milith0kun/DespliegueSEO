/**
 * Controlador de autenticación
 * Gestiona login, logout y verificación de sesión
 */

const bcrypt = require('bcrypt');
const usuarioModel = require('../modelos/usuarioModel');

/**
 * Inicia sesión y crea una cookie de sesión
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario usando el modelo
        const usuario = await usuarioModel.getUsuarioByEmail(email);

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña usando el modelo
        const passwordValida = await usuarioModel.verificarPassword(password, usuario.hash_password);
        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Datos del usuario (sin password)
        const userData = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };

        // Crear sesión
        req.session.user = userData;

        // Establecer cookie con el rol (para verificación rápida en frontend)
        res.cookie('role', usuario.rol, {
            httpOnly: false, // Esta cookie sí puede ser leída por JS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        // Actualizar última conexión del usuario
        await usuarioModel.updateUltimaConexion(usuario.id);

        // Responder con datos del usuario
        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: userData
        });
    } catch (error) {
        console.error('Error en login:', error);
        console.error('Detalles del error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Verificar si es un error específico de bcrypt
        if (error.message && error.message.includes('bcrypt')) {
            console.error('Posible error en la verificación de contraseña con bcrypt');
        }
        
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor: ' + error.message
        });
    }
};

/**
 * Cierra la sesión del usuario
 */
const logout = (req, res) => {
    try {
        // Destruir sesión
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al cerrar sesión'
                });
            }

            // Eliminar cookie de rol
            res.clearCookie('role');
            
            // Eliminar cookie de sesión
            res.clearCookie('connect.sid');

            return res.status(200).json({
                success: true,
                message: 'Sesión cerrada correctamente'
            });
        });
    } catch (error) {
        console.error('Error en logout:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Verifica si el usuario está autenticado
 */
const checkAuth = (req, res) => {
    try {
        // Si hay sesión de usuario, está autenticado
        if (req.session && req.session.user) {
            return res.status(200).json({
                success: true,
                authenticated: true
            });
        }

        // No hay sesión
        return res.status(401).json({
            success: false,
            authenticated: false,
            message: 'No autenticado'
        });
    } catch (error) {
        console.error('Error en checkAuth:', error);
        return res.status(500).json({
            success: false,
            authenticated: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Obtiene los datos del usuario actual
 */
const getMe = (req, res) => {
    try {
        // Si hay sesión de usuario, devolver sus datos
        if (req.session && req.session.user) {
            return res.status(200).json({
                success: true,
                data: req.session.user
            });
        }

        // No hay sesión
        return res.status(401).json({
            success: false,
            message: 'No autenticado'
        });
    } catch (error) {
        console.error('Error en getMe:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

module.exports = {
    login,
    logout,
    checkAuth,
    getMe
};
