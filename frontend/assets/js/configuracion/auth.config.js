/**
 * Configuración para el sistema de autenticación
 */

import { apiConfig, handleApiResponse } from './api.config.js';

export const authConfig = {
    // Endpoints de autenticación
    endpoints: apiConfig.endpoints.auth,
    
    // Configuración de almacenamiento local
    storage: {
        tokenKey: 'auth_token',
        userKey: 'user_data'
    },
    
    // Roles de usuario
    roles: {
        ADMIN: 'admin',
        EDITOR: 'editor',
        USUARIO: 'usuario'
    }
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - True si el usuario está autenticado
 */
export function estaAutenticado() {
    return !!localStorage.getItem(authConfig.storage.tokenKey);
}

/**
 * Obtiene el token de autenticación
 * @returns {string|null} - Token de autenticación o null si no existe
 */
export function obtenerToken() {
    return localStorage.getItem(authConfig.storage.tokenKey);
}

/**
 * Obtiene los datos del usuario actual
 * @returns {Object|null} - Datos del usuario o null si no existe
 */
export function obtenerUsuario() {
    const userData = localStorage.getItem(authConfig.storage.userKey);
    return userData ? JSON.parse(userData) : null;
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} rol - Rol a verificar
 * @returns {boolean} - True si el usuario tiene el rol
 */
export function tieneRol(rol) {
    const usuario = obtenerUsuario();
    return usuario && usuario.rol === rol;
}

/**
 * Inicia sesión con credenciales
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa con los datos del usuario
 */
export async function iniciarSesion(email, password) {
    try {
        const response = await fetch(`${apiConfig.baseUrl}${authConfig.endpoints.login}`, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify({ email, password })
        });
        
        const data = await handleApiResponse(response);
        
        // Guardar token y datos de usuario
        localStorage.setItem(authConfig.storage.tokenKey, data.token);
        localStorage.setItem(authConfig.storage.userKey, JSON.stringify(data.usuario));
        
        return data.usuario;
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        throw error;
    }
}

/**
 * Cierra la sesión del usuario
 * @returns {Promise} - Promesa vacía
 */
export async function cerrarSesion() {
    try {
        // Si hay un endpoint para cerrar sesión en el backend
        if (estaAutenticado()) {
            await fetch(`${apiConfig.baseUrl}${authConfig.endpoints.logout}`, {
                method: 'POST',
                headers: apiConfig.getAuthHeaders()
            });
        }
    } catch (error) {
        console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
        // Limpiar datos locales
        localStorage.removeItem(authConfig.storage.tokenKey);
        localStorage.removeItem(authConfig.storage.userKey);
    }
}

/**
 * Verifica si la sesión actual es válida
 * @returns {Promise<boolean>} - Promesa que resuelve a true si la sesión es válida
 */
export async function verificarSesion() {
    if (!estaAutenticado()) return false;
    
    try {
        const response = await fetch(`${apiConfig.baseUrl}${authConfig.endpoints.verify}`, {
            method: 'GET',
            headers: apiConfig.getAuthHeaders()
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        return false;
    }
}
