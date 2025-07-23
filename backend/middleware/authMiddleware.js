/**
 * Middleware de autenticación
 * Protege rutas que requieren autenticación o roles específicos
 */

/**
 * Verifica si el usuario está autenticado
 */
const isAuthenticated = (req, res, next) => {
    // Verificar si hay sesión de usuario
    if (req.session && req.session.user) {
        return next();
    }
    
    // No hay sesión, denegar acceso
    return res.status(401).json({
        success: false,
        message: 'No autenticado'
    });
};

/**
 * Verifica si el usuario tiene rol de administrador
 */
const isAdmin = (req, res, next) => {
    // Verificar si hay sesión de usuario y es admin
    if (req.session && req.session.user && req.session.user.rol === 'admin') {
        return next();
    }
    
    // No es admin, denegar acceso
    return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador.'
    });
};

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 * @param {Array} roles - Array de roles permitidos
 */
const hasRole = (roles) => {
    return (req, res, next) => {
        // Verificar si hay sesión de usuario
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }
        
        // Verificar si el rol del usuario está en la lista de roles permitidos
        if (roles.includes(req.session.user.rol)) {
            return next();
        }
        
        // No tiene rol permitido, denegar acceso
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. No tienes los permisos necesarios.'
        });
    };
};

module.exports = {
    isAuthenticated,
    isAdmin,
    hasRole
};
