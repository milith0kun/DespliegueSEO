/**
 * Gestión de Usuarios y Seguridad - Admin Panel
 * Maneja la funcionalidad de las pestañas de usuarios y seguridad
 */

class AdminUsers {
    constructor() {
        this.currentTab = 'messages';
        this.users = [];
        this.securityEvents = [];
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupUserModal();
        this.setupEventListeners();
        this.loadInitialData();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Cargar datos específicos de la pestaña
        switch (tabName) {
            case 'users':
                this.loadUsers();
                break;
            case 'security':
                this.loadSecurityEvents();
                break;
        }
    }

    setupUserModal() {
        const modal = document.getElementById('user-modal');
        const closeBtn = document.getElementById('close-user-modal');
        const cancelBtn = document.getElementById('cancel-user-btn');
        const addUserBtn = document.getElementById('add-user-btn');
        const userForm = document.getElementById('user-form');

        // Abrir modal para nuevo usuario
        addUserBtn?.addEventListener('click', () => {
            this.openUserModal();
        });

        // Cerrar modal
        [closeBtn, cancelBtn].forEach(btn => {
            btn?.addEventListener('click', () => {
                this.closeUserModal();
            });
        });

        // Cerrar modal al hacer clic fuera
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeUserModal();
            }
        });

        // Manejar envío del formulario
        userForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserSubmit();
        });
    }

    setupEventListeners() {
        // Filtro de eventos de seguridad
        const securityFilter = document.getElementById('security-filter');
        securityFilter?.addEventListener('change', () => {
            this.loadSecurityEvents();
        });

        // Exportar eventos de seguridad
        const exportBtn = document.getElementById('export-security-btn');
        exportBtn?.addEventListener('click', () => {
            this.exportSecurityEvents();
        });
    }

    loadInitialData() {
        this.loadUserStats();
        this.loadSecurityStats();
    }

    async loadUsers() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                this.users = data.data;
                this.renderUsersTable();
            } else {
                this.showToast('Error al cargar usuarios: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.showToast('Error de conexión al cargar usuarios', 'error');
        }
    }

    renderUsersTable() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id.substring(0, 8)}...</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td><span class="user-role">${this.getRoleLabel(user.rol)}</span></td>
                <td><span class="user-status ${user.esta_activo ? 'active' : 'inactive'}">
                    ${user.esta_activo ? 'Activo' : 'Inactivo'}
                </span></td>
                <td>${user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : 'Nunca'}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminUsers.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminUsers.deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getRoleLabel(role) {
        const roles = {
            'admin': 'Administrador',
            'editor': 'Editor',
            'viewer': 'Visualizador'
        };
        return roles[role] || role;
    }

    async loadUserStats() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/estadisticas`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                const stats = data.data;
                document.getElementById('quick-active-users').textContent = stats.usuarios_activos || 0;
                document.getElementById('quick-inactive-users').textContent = stats.usuarios_inactivos || 0;
            }
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    async loadSecurityEvents() {
        try {
            const filter = document.getElementById('security-filter')?.value || 'all';
            let url = `${API_CONFIG.BASE_URL}/api/admin/seguridad`;
            
            if (filter !== 'all') {
                url += `?tipo=${filter}`;
            }

            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                this.securityEvents = data.data;
                this.renderSecurityTable();
            } else {
                this.showToast('Error al cargar eventos de seguridad: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error loading security events:', error);
            this.showToast('Error de conexión al cargar eventos de seguridad', 'error');
        }
    }

    renderSecurityTable() {
        const tbody = document.getElementById('security-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.securityEvents.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(event.fecha_hora).toLocaleString()}</td>
                <td><span class="event-type ${event.tipo}">${this.getEventTypeLabel(event.tipo)}</span></td>
                <td>${event.usuario_nombre || 'Sistema'}</td>
                <td>${event.accion}</td>
                <td>${event.ip}</td>
                <td title="${event.detalles}">${this.truncateText(event.detalles, 50)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    getEventTypeLabel(type) {
        const types = {
            'login': 'Login',
            'user_changes': 'Cambios Usuario',
            'data_changes': 'Cambios Datos',
            'security_alerts': 'Alerta Seguridad',
            'data_access': 'Acceso Datos'
        };
        return types[type] || type;
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    async loadSecurityStats() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/seguridad/estadisticas`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                const stats = data.data.resumen;
                document.getElementById('quick-warnings').textContent = stats.alertas_seguridad || 0;
                document.getElementById('quick-events').textContent = stats.eventos_hoy || 0;
            }
        } catch (error) {
            console.error('Error loading security stats:', error);
        }
    }

    openUserModal(userId = null) {
        const modal = document.getElementById('user-modal');
        const title = document.getElementById('user-modal-title');
        const form = document.getElementById('user-form');
        const passwordField = document.getElementById('user-password');

        if (userId) {
            // Modo edición
            title.innerHTML = '<i class="fas fa-user-edit"></i> Editar Usuario';
            passwordField.required = false;
            passwordField.placeholder = 'Dejar vacío para mantener contraseña actual';
            this.loadUserForEdit(userId);
        } else {
            // Modo creación
            title.innerHTML = '<i class="fas fa-user-plus"></i> Agregar Usuario';
            passwordField.required = true;
            passwordField.placeholder = '';
            form.reset();
            document.getElementById('user-id').value = '';
        }

        modal.style.display = 'block';
    }

    closeUserModal() {
        const modal = document.getElementById('user-modal');
        modal.style.display = 'none';
    }

    async loadUserForEdit(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.nombre;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.rol;
        document.getElementById('user-status').value = user.esta_activo ? '1' : '0';
        document.getElementById('user-password').value = '';
    }

    async handleUserSubmit() {
        const form = document.getElementById('user-form');
        const formData = new FormData(form);
        const userId = formData.get('id');
        
        const userData = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            rol: formData.get('rol'),
            activo: parseInt(formData.get('activo'))
        };

        // Solo incluir contraseña si se proporcionó
        const password = formData.get('password');
        if (password) {
            userData.password = password;
        }

        try {
            let response;
            if (userId) {
                // Actualizar usuario existente
                response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/${userId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
            } else {
                // Crear nuevo usuario
                response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
            }

            const data = await response.json();

            if (data.success) {
                this.showToast(userId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente', 'success');
                this.closeUserModal();
                this.loadUsers();
                this.loadUserStats();
            } else {
                this.showToast('Error: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            this.showToast('Error de conexión al guardar usuario', 'error');
        }
    }

    editUser(userId) {
        this.openUserModal(userId);
    }

    async deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.nombre}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/${userId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Usuario eliminado exitosamente', 'success');
                this.loadUsers();
                this.loadUserStats();
            } else {
                this.showToast('Error: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showToast('Error de conexión al eliminar usuario', 'error');
        }
    }

    async exportSecurityEvents() {
        try {
            const filter = document.getElementById('security-filter')?.value || 'all';
            let url = '/api/admin/seguridad';
            
            if (filter !== 'all') {
                url += `?tipo=${filter}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                this.downloadCSV(data.data, 'eventos_seguridad.csv');
            } else {
                this.showToast('Error al exportar eventos: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error exporting events:', error);
            this.showToast('Error de conexión al exportar eventos', 'error');
        }
    }

    downloadCSV(data, filename) {
        const headers = ['Fecha/Hora', 'Tipo', 'Usuario', 'Acción', 'IP', 'Detalles'];
        const csvContent = [
            headers.join(','),
            ...data.map(event => [
                new Date(event.fecha_hora).toLocaleString(),
                this.getEventTypeLabel(event.tipo),
                event.usuario_nombre || 'Sistema',
                event.accion,
                event.ip,
                `"${event.detalles.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    showToast(message, type = 'info') {
        // Reutilizar la función showToast existente del admin.js principal
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// Inicializar cuando el DOM esté listo
let adminUsers;
document.addEventListener('DOMContentLoaded', () => {
    adminUsers = new AdminUsers();
});