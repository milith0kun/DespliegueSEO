/**
 * Configuración de la API del backend
 */

export const apiConfig = {
    // URL base de la API
    baseUrl: 'http://localhost:3000/api', // Ajusta según tu configuración del backend
    
    // Endpoints
    endpoints: {
        contact: '/contactos',
        auth: {
            login: '/auth/login',
            logout: '/auth/logout',
            verify: '/auth/verificar'
        },
        messages: {
            list: '/contactos',
            detail: '/contactos/', // Agregar ID al final: /contactos/123
            respond: '/contactos/', // Agregar ID al final: /contactos/123/responder
            stats: '/contactos/estadisticas',
            updateStatus: '/contactos/' // Agregar ID al final: /contactos/123/estado
        },
        services: '/servicios'
    },
    
    // Configuración de headers
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Función para obtener headers con token de autenticación
    getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }
};

/**
 * Maneja errores de la API
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise} Promesa con los datos o lanza un error
 */
export const handleApiResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensaje || error.message || 'Error en la solicitud');
    }
    return response.json();
};
