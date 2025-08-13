// Módulo principal del panel de administración
export class AdminPanel {
    constructor() {
        // Verificar que API_CONFIG esté disponible
        if (!window.API_CONFIG) {
            console.error('❌ API_CONFIG no está disponible en AdminPanel');
            throw new Error('API_CONFIG no está disponible');
        }
        
        // Acceso seguro a la configuración API global
        this.API = window.API_CONFIG;
        console.log('✅ AdminPanel inicializado con API_CONFIG:', this.API);
        this.currentPage = 1;
        this.messagesPerPage = 10;
        this.messages = [];
        this.filteredMessages = [];
        this.currentFilter = 'todos';
        this.currentServiceFilter = 'todos';
        this.searchTerm = '';
        this.dateFilter = '';
        this.selectedMessages = new Set();
        this.currentMessageId = null;
        this.confirmationCallback = null;
    }

    async init() {
        const isAuthenticated = await this.checkAuth();
        if (isAuthenticated) {
            this.setupEventListeners();
            this.setupModals();
            this.setupNotifications();
            this.loadMessages();
            this.loadStats();
            this.updateDashboard();
        }
    }

    async checkAuth() {
        try {
            const response = await fetch(`${this.API.BASE_URL}${this.API.ENDPOINTS.CHECK}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (!data.authenticated) {
                window.location.href = 'login.html';
                return false;
            } else {
                if (data.data && data.data.nombre) {
                    const userNameElement = document.getElementById('user-name');
                    if (userNameElement) {
                        userNameElement.textContent = data.data.nombre;
                    }
                }
                return true;
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            window.location.href = 'login.html';
            return false;
        }
    }

    async logout() {
        try {
            await fetch(`${this.API.BASE_URL}${this.API.ENDPOINTS.LOGOUT}`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error durante logout:', error);
        } finally {
            window.location.href = 'login.html';
        }
    }
}