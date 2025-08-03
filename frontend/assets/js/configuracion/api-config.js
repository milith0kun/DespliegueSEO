/**
 * Configuración centralizada de la API
 * Este archivo contiene todas las URLs y configuraciones de la API
 * para evitar duplicación y facilitar el mantenimiento
 */

// Función para detectar el entorno y configurar la URL base
function getBaseUrl() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Si estamos en desarrollo local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000'; // Servidor PHP local
    }
    
    // Si estamos en producción
    return `${protocol}//${hostname}`;
}

// Configuración base de la API
const API_CONFIG = {
    // URL base del servidor (detectada automáticamente)
    BASE_URL: getBaseUrl(),
    
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
        
        console.log('🌐 ApiService: Making request');
        console.log('📍 URL:', url);
        console.log('⚙️ Config:', config);
        
        try {
            console.log('📡 Sending fetch request...');
            const response = await fetch(url, config);
            console.log('📨 Response received:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });
            
            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            
            if (!response.ok) {
                // Si hay error HTTP, intentar leer como texto primero
                let errorMessage = `Error HTTP: ${response.status}`;
                try {
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        const errorText = await response.text();
                        // Si es HTML, extraer mensaje de error más limpio
                        if (errorText.includes('<br />')) {
                            const match = errorText.match(/<b>([^<]+)<\/b>/);
                            errorMessage = match ? match[1] : 'Error del servidor';
                        } else {
                            errorMessage = errorText.substring(0, 100) + '...';
                        }
                    }
                } catch (parseError) {
                    console.error('Error al parsear respuesta de error:', parseError);
                }
                throw new Error(errorMessage);
            }
            
            // Para respuestas exitosas, verificar que sea JSON
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('El servidor no devolvió una respuesta JSON válida');
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error(`Error en petición a ${url}:`, error);
            throw error;
        }
    }
    
    // Métodos específicos para autenticación
    async login(email, password) {
        console.log('🔐 ApiService: Iniciando login');
        console.log('📧 Email:', email);
        console.log('🌐 URL:', this.buildUrl(this.endpoints.AUTH.LOGIN));
        
        try {
            const payload = { email, password };
            console.log('📦 Payload:', payload);
            
            const result = await this.request(this.endpoints.AUTH.LOGIN, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            console.log('✅ Login response:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
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