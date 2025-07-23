/**
 * Funciones de autenticación para el panel de administración
 * Toda la autenticación se gestiona mediante cookies HttpOnly y sesiones en el backend
 */

/**
 * Verifica si el usuario está autenticado mediante una llamada al backend
 * @returns {Promise<boolean>} - Promesa que resuelve a true si está autenticado, false en caso contrario
 */
export async function checkAuthentication() {
    try {
        const response = await fetch('/api/auth/check', {
            method: 'GET',
            credentials: 'include' // Importante para enviar cookies
        });
        
        if (!response.ok) {
            return false;
        }
        
        const data = await response.json();
        return data.authenticated === true;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return false;
    }
}

/**
 * Verifica si el usuario está autenticado (versión síncrona para uso inmediato)
 * @returns {boolean} - true si parece estar autenticado según la última comprobación
 */
export function isAuthenticated() {
    // Esta función solo comprueba si hay una cookie de sesión
    // La verificación real se hace con checkAuthentication()
    return document.cookie.includes('session=') || document.cookie.includes('connect.sid=');
}

/**
 * Obtiene los datos del usuario actual desde el backend
 * @returns {Promise<Object|null>} - Promesa que resuelve a los datos del usuario o null
 */
export async function getUserData() {
    try {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include' // Importante para enviar cookies
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        return null;
    }
}

/**
 * Verifica si el usuario tiene rol de administrador
 * @returns {Promise<boolean>} - Promesa que resuelve a true si es administrador
 */
export async function checkIsAdmin() {
    try {
        const userData = await getUserData();
        return userData && userData.rol === 'admin';
    } catch (error) {
        console.error('Error al verificar rol de administrador:', error);
        return false;
    }
}

/**
 * Versión síncrona para verificación rápida de rol admin
 * @returns {boolean} - true si el usuario tiene rol admin según la última verificación
 */
export function isAdmin() {
    // Esta función es una aproximación, la verificación real debe hacerse con checkIsAdmin()
    return document.cookie.includes('role=admin');
}

/**
 * Cierra la sesión del usuario
 */
export async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        // Redirigir a la página de login incluso si hay error
        window.location.href = 'login.html';
    }
}

/**
 * Protege una página para que solo sea accesible por usuarios autenticados
 * @param {boolean} adminOnly - Si es true, solo permite acceso a administradores
 */
export async function protectPage(adminOnly = false) {
    try {
        // Verificar autenticación con el backend
        const isAuth = await checkAuthentication();
        
        if (!isAuth) {
            window.location.href = 'login.html';
            return;
        }
        
        // Si se requiere ser admin, verificar rol
        if (adminOnly) {
            const isUserAdmin = await checkIsAdmin();
            
            if (!isUserAdmin) {
                await logout(); // Si se requiere ser admin y no lo es, cerrar sesión
                return;
            }
        }
        
        // Si todo está bien, cargar datos del usuario para la interfaz
        const userData = await getUserData();
        updateUserInterface(userData);
        
    } catch (error) {
        console.error('Error al proteger página:', error);
        window.location.href = 'login.html';
    }
}

/**
 * Actualiza elementos de la interfaz con datos del usuario
 * @param {Object} userData - Datos del usuario
 */
export function updateUserInterface(userData) {
    if (!userData) return;
    
    // Actualizar nombre de usuario si existe el elemento
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userData.nombre) {
        userNameElement.textContent = userData.nombre;
    }
}

/**
 * Realiza una petición a la API con las cookies de sesión
 * @param {string} url - URL de la petición
 * @param {Object} options - Opciones de fetch
 * @returns {Promise} - Promesa con la respuesta
 */
export async function fetchWithAuth(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Importante para enviar cookies de sesión
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        // Si la sesión expiró o es inválida
        if (response.status === 401) {
            await logout();
            throw new Error('Sesión expirada o inválida');
        }
        
        return response;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// Configurar eventos de logout en todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Verificar autenticación al cargar la página
    // (excepto en la página de login)
    if (!window.location.pathname.includes('login.html')) {
        checkAuthentication().then(isAuth => {
            if (!isAuth) {
                window.location.href = 'login.html';
            } else {
                // Cargar datos del usuario para la interfaz
                getUserData().then(userData => {
                    updateUserInterface(userData);
                });
            }
        });
    }
});
