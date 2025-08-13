// Configuración Simple de la API

// Detectar entorno y configurar URL base
function getBaseUrl() {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Entorno local - usar el puerto del servidor PHP
        return `${window.location.protocol}//${hostname}:8080`;
    }
    
    // Entorno de producción - usar la URL actual
    return `${window.location.protocol}//${hostname}${port ? ':' + port : ''}`;
}

// Configuración de la API
const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    ENDPOINTS: {
        LOGIN: '/api/auth/login',
        CHECK: '/api/auth/check',
        LOGOUT: '/api/auth/logout',
        USUARIOS: '/api/usuarios',
        CONTACTOS: '/api/contactos'
    },
    
    // Configuración de fetch por defecto
    DEFAULT_OPTIONS: {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    }
};

// Función simple para hacer peticiones
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const config = { ...API_CONFIG.DEFAULT_OPTIONS, ...options };
        
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return { message: await response.text() };
        
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Funciones específicas
const apiService = {
    login: (email, password) => apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    
    checkAuth: () => apiRequest(API_CONFIG.ENDPOINTS.CHECK),
    
    logout: () => apiRequest(API_CONFIG.ENDPOINTS.LOGOUT, { method: 'POST' }),
    
    getUsuarios: () => apiRequest(API_CONFIG.ENDPOINTS.USUARIOS),
    
    createContact: (data) => apiRequest(API_CONFIG.ENDPOINTS.CONTACTOS, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    getContacts: () => apiRequest(API_CONFIG.ENDPOINTS.CONTACTOS)
};

// Exportar globalmente
window.API_CONFIG = API_CONFIG;
window.apiService = apiService;