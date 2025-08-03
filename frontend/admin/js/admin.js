document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
    setupFilters();
    setupBulkActions();
    setupModal();
});

// Eliminar la constante API_BASE_URL ya que usaremos apiService

async function checkAuth() {
    try {
        const data = await apiService.checkAuth();
        
        if (data.authenticated) {
            document.getElementById('user-name').textContent = data.data.nombre || 'Admin';
            loadMessages();
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error de autenticación:', error);
        window.location.href = 'login.html';
    }
}

function setupEventListeners() {
    document.getElementById('refresh-btn').addEventListener('click', loadMessages);
    // Eliminar logout-btn ya que no existe en el HTML
    document.getElementById('messages-list').addEventListener('click', handleMessageAction);
}

async function loadMessages() {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando mensajes...</div>';
    
    try {
        const data = await apiService.getContacts();
        
        if (data.success && data.data.length > 0) {
            displayMessages(data.data);
            updateStats(data.data);
        } else {
            messagesList.innerHTML = '<div class="no-messages"><i class="fas fa-inbox"></i><br>No hay mensajes nuevos</div>';
        }
    } catch (error) {
        console.error('Error al cargar mensajes:', error);
        messagesList.innerHTML = '<div class="no-messages"><i class="fas fa-exclamation-triangle"></i><br>Error al conectar con el servidor</div>';
    }
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messages-list');
    const messagesHTML = messages.map(message => {
        const date = new Date(message.creado_en).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
        const isNew = message.estado === 'nuevo';
        
        return `
            <div class="message-item ${isNew ? 'message-new' : ''}" id="message-${message.id}">
                <div class="message-header">
                    <div class="message-info">
                        <span class="message-name"><i class="fas fa-user"></i> ${message.nombre}</span>
                        <span class="message-email"><i class="fas fa-at"></i> ${message.email}</span>
                    </div>
                    <span class="message-date"><i class="fas fa-clock"></i> ${date}</span>
                </div>
                <div class="message-content">
                    <p><strong><i class="fas fa-building"></i> Empresa:</strong> ${message.empresa || 'No especificada'}</p>
                    <p><strong><i class="fas fa-phone"></i> Teléfono:</strong> ${message.telefono || 'No especificado'}</p>
                    <p><strong><i class="fas fa-info-circle"></i> Interés:</strong> ${message.interes_servicio || 'General'}</p>
                    <p><strong><i class="fas fa-comment-dots"></i> Mensaje:</strong> ${message.mensaje}</p>
                </div>
                <div class="message-actions">
                    <button class="action-btn btn-read" data-id="${message.id}" ${!isNew ? 'disabled' : ''}>
                        <i class="fas fa-check-circle"></i> Marcar como Gestionado
                    </button>
                    <button class="action-btn btn-delete" data-id="${message.id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    messagesList.innerHTML = messagesHTML;
}

function updateStats(messages) {
    const total = messages.length;
    const newMessages = messages.filter(msg => msg.estado === 'nuevo').length;
    const managedMessages = total - newMessages;

    document.getElementById('total-messages').textContent = total;
    document.getElementById('today-messages').textContent = newMessages;
    document.getElementById('unique-contacts').textContent = managedMessages;
}

async function handleMessageAction(event) {
    const button = event.target.closest('.action-btn');
    if (!button) return;

    const messageId = button.dataset.id;
    
    if (button.classList.contains('btn-read')) {
        await updateMessageState(messageId, 'gestionado');
    } else if (button.classList.contains('btn-delete')) {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje? Esta acción no se puede deshacer.')) {
            await deleteMessage(messageId);
        }
    }
}

async function updateMessageState(id, newState) {
    try {
        const data = await apiService.updateContactStatus(id, newState);
        
        if (data.success) {
            loadMessages(); // Recargar la lista
            return true;
        } else {
            throw new Error(data.message || 'Error al actualizar el estado');
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar el estado del mensaje');
        return false;
    }
}

async function deleteMessage(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
        return;
    }
    
    try {
        const data = await apiService.deleteContact(id);
        
        if (data.success) {
            loadMessages(); // Recargar la lista
        } else {
            throw new Error(data.message || 'Error al eliminar el mensaje');
        }
    } catch (error) {
        console.error('Error al eliminar mensaje:', error);
        alert('Error al eliminar el mensaje');
    }
}

async function logout() {
    try {
        await apiService.logout();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        window.location.href = 'login.html';
    }
}

// Agregar al final del archivo existente

// Variables globales para paginación y filtros
let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;
let currentFilters = {};
let selectedMessages = new Set();

// Función mejorada para cargar mensajes con filtros
async function loadMessagesWithFilters() {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando mensajes...</div>';
    
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: itemsPerPage,
            ...currentFilters
        });
        
        const response = await fetch(`/api/contactos?${params}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            displayMessagesWithCheckboxes(data.data);
            updateStats(data.data);
            updatePagination(data.total || data.data.length);
        } else {
            messagesList.innerHTML = '<div class="no-messages"><i class="fas fa-inbox"></i><br>No hay mensajes que coincidan con los filtros</div>';
        }
    } catch (error) {
        console.error('Error al cargar mensajes:', error);
        messagesList.innerHTML = '<div class="no-messages"><i class="fas fa-exclamation-triangle"></i><br>Error al conectar con el servidor</div>';
    }
}

// Función para mostrar mensajes con checkboxes
function displayMessagesWithCheckboxes(messages) {
    const messagesList = document.getElementById('messages-list');
    const messagesHTML = messages.map(message => {
        const date = new Date(message.creado_en).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
        const isNew = message.estado === 'nuevo';
        const isPriority = message.prioridad === 'alta';
        
        return `
            <div class="message-item ${isNew ? 'message-new' : ''} ${isPriority ? 'message-priority' : ''}" id="message-${message.id}">
                <div class="message-header">
                    <div class="message-info">
                        <input type="checkbox" class="message-checkbox" data-id="${message.id}">
                        <span class="message-name"><i class="fas fa-user"></i> ${message.nombre}</span>
                        <span class="message-email"><i class="fas fa-at"></i> ${message.email}</span>
                        ${isPriority ? '<i class="fas fa-star priority-star" title="Prioritario"></i>' : ''}
                    </div>
                    <span class="message-date"><i class="fas fa-clock"></i> ${date}</span>
                </div>
                <div class="message-content">
                    <p><strong><i class="fas fa-building"></i> Empresa:</strong> ${message.empresa || 'No especificada'}</p>
                    <p><strong><i class="fas fa-phone"></i> Teléfono:</strong> ${message.telefono || 'No especificado'}</p>
                    <p><strong><i class="fas fa-info-circle"></i> Interés:</strong> ${message.interes_servicio || 'General'}</p>
                    <p><strong><i class="fas fa-comment-dots"></i> Mensaje:</strong> ${message.mensaje.substring(0, 100)}${message.mensaje.length > 100 ? '...' : ''}</p>
                </div>
                <div class="message-actions">
                    <button class="action-btn btn-view" data-id="${message.id}">
                        <i class="fas fa-eye"></i> Ver Completo
                    </button>
                    <button class="action-btn btn-read" data-id="${message.id}" ${!isNew ? 'disabled' : ''}>
                        <i class="fas fa-check-circle"></i> Marcar como Gestionado
                    </button>
                    <button class="action-btn btn-priority" data-id="${message.id}">
                        <i class="fas fa-star"></i> ${isPriority ? 'Quitar' : 'Marcar'} Prioridad
                    </button>
                    <button class="action-btn btn-delete" data-id="${message.id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    messagesList.innerHTML = messagesHTML;
    
    // Agregar event listeners para checkboxes
    document.querySelectorAll('.message-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}

// Función para manejar cambios en checkboxes
function handleCheckboxChange(event) {
    const messageId = event.target.dataset.id;
    if (event.target.checked) {
        selectedMessages.add(messageId);
    } else {
        selectedMessages.delete(messageId);
    }
    
    updateBulkActions();
}

// Función para actualizar acciones masivas
function updateBulkActions() {
    const bulkActions = document.getElementById('bulk-actions');
    const selectedCount = document.getElementById('selected-count');
    
    if (selectedMessages.size > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = `${selectedMessages.size} seleccionados`;
    } else {
        bulkActions.style.display = 'none';
    }
}

// Función para configurar filtros
function setupFilters() {
    const filterElements = {
        estado: document.getElementById('filter-estado'),
        servicio: document.getElementById('filter-servicio'),
        search: document.getElementById('search-text'),
        fecha: document.getElementById('filter-fecha')
    };
    
    Object.entries(filterElements).forEach(([key, element]) => {
        if (element) {
            element.addEventListener('change', () => {
                if (element.value) {
                    currentFilters[key] = element.value;
                } else {
                    delete currentFilters[key];
                }
                currentPage = 1;
                loadMessagesWithFilters();
            });
        }
    });
    
    // Búsqueda con debounce
    let searchTimeout;
    if (filterElements.search) {
        filterElements.search.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (filterElements.search.value) {
                    currentFilters.search = filterElements.search.value;
                } else {
                    delete currentFilters.search;
                }
                currentPage = 1;
                loadMessagesWithFilters();
            }, 500);
        });
    }
}

// Funciones adicionales que faltan
function setupFilters() {
    // Implementar filtros si es necesario
    console.log('Filtros configurados');
}

function setupBulkActions() {
    // Implementar acciones masivas si es necesario
    console.log('Acciones masivas configuradas');
}

function setupModal() {
    // Implementar modal si es necesario
    console.log('Modal configurado');
}

// Eliminar el segundo DOMContentLoaded duplicado
// Las funcionalidades se inicializarán en el primer DOMContentLoaded
