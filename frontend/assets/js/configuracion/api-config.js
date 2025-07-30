/**
 * Configuración centralizada de la API
 * Este archivo contiene todas las URLs y configuraciones de la API
 * para evitar duplicación y facilitar el mantenimiento
 */

// Configuración base de la API
const API_CONFIG = {
    // URL base del servidor
    BASE_URL: 'http://localhost:8080',
    
    // Endpoints de la API
    ENDPOINTS: {
        // Autenticación
        AUTH: {
            LOGIN: '/api/auth/login',
            CHECK: '/api/auth/check',
            ME: '/api/auth/me',
            LOGOUT: '/api/auth/logout'
        },
        
        // Usuarios
        USERS: {
            LIST: '/api/usuarios'
        },
        
        // Contactos
        CONTACTS: {
            CREATE: '/api/contactos',
            LIST: '/api/contactos',
            STATS: '/api/contactos/estadisticas',
            UPDATE: (id) => `/api/contactos/${id}`,
            DELETE: (id) => `/api/contactos/${id}`
        }
    },
    
    // Configuración de fetch por defecto
    DEFAULT_OPTIONS: {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }
};

// Clase para manejar las llamadas a la API
class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.endpoints = API_CONFIG.ENDPOINTS;
        this.defaultOptions = API_CONFIG.DEFAULT_OPTIONS;
    }
    
    // Método para construir URL completa
    buildUrl(endpoint) {
        return `${this.baseUrl}${endpoint}`;
    }
    
    // Método genérico para hacer peticiones
    async request(endpoint, options = {}) {
        const url = this.buildUrl(endpoint);
        const config = {
            ...this.defaultOptions,
            ...options,
            headers: {
                ...this.defaultOptions.headers,
                ...(options.headers || {})
            }
        };
        
        try {
            const response = await fetch(url, config);
            
            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('El servidor no devolvió una respuesta JSON válida');
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `Error HTTP: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error(`Error en petición a ${url}:`, error);
            throw error;
        }
    }
    
    // Métodos específicos para autenticación
    async login(email, password) {
        return this.request(this.endpoints.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }
    
    async checkAuth() {
        return this.request(this.endpoints.AUTH.CHECK);
    }
    
    async logout() {
        return this.request(this.endpoints.AUTH.LOGOUT, {
            method: 'POST'
        });
    }
    
    // Métodos específicos para contactos
    async createContact(contactData) {
        return this.request(this.endpoints.CONTACTS.CREATE, {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }
    
    async getContacts() {
        return this.request(this.endpoints.CONTACTS.LIST);
    }
    
    async updateContactStatus(id, status) {
        return this.request(this.endpoints.CONTACTS.UPDATE(id), {
            method: 'PUT',
            body: JSON.stringify({ estado: status })
        });
    }
    
    async deleteContact(id) {
        return this.request(this.endpoints.CONTACTS.DELETE(id), {
            method: 'DELETE'
        });
    }
    
    async getContactStats() {
        return this.request(this.endpoints.CONTACTS.STATS);
    }
}

// Crear instancia global del servicio API
const apiService = new ApiService();

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, ApiService, apiService };
} else {
    window.API_CONFIG = API_CONFIG;
    window.ApiService = ApiService;
    window.apiService = apiService;
}