import { AdminPanel } from './modules/AdminPanel.js';
import { MessagesUI } from './modules/messagesUI.js';
import { showToast, showConfirmation } from './modules/utils.js';
import { getContacts } from './modules/contactsApi.js';

window.showToast = showToast; // Exponer para admin-users.js si lo necesita
window.showConfirmation = showConfirmation;

class AdminApp extends AdminPanel {
  constructor() {
    super();
    this.ui = new MessagesUI(this);
  }

  setupEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

    const quickSearch = document.getElementById('quick-search');
    if (quickSearch) quickSearch.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.trim();
      this.applyFilters();
    });

    const clearSearch = document.getElementById('clear-search');
    if (clearSearch) clearSearch.addEventListener('click', () => {
      const input = document.getElementById('quick-search');
      if (input) input.value = '';
      this.searchTerm = '';
      this.applyFilters();
    });

    const refresh = document.getElementById('refresh-btn');
    if (refresh) refresh.addEventListener('click', () => this.loadMessages());

    // Event listener para el selector de items por página
    const itemsLimit = document.getElementById('items-limit');
    if (itemsLimit) {
      console.log('✅ Selector de límite encontrado:', itemsLimit);
      itemsLimit.addEventListener('change', (e) => {
        console.log('🔄 Cambiando límite de elementos:', e.target.value);
        this.messagesPerPage = parseInt(e.target.value);
        this.currentPage = 1; // Reset a la primera página
        console.log('📊 Nuevo límite:', this.messagesPerPage, 'Página actual:', this.currentPage);
        this.render();
        this.updatePagination();
      });
    } else {
      console.error('❌ Selector de límite no encontrado');
    }

    // Event listeners para la paginación
    const prevPage = document.getElementById('prev-page');
    if (prevPage) {
      prevPage.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.render();
          this.updatePagination();
        }
      });
    }

    const nextPage = document.getElementById('next-page');
    if (nextPage) {
      nextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(this.filteredMessages.length / this.messagesPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.render();
          this.updatePagination();
        }
      });
    }
  }

  setupModals() {
    const closeModal = document.getElementById('close-modal');
    if (closeModal) closeModal.addEventListener('click', () => this.ui.closeModal());
  }

  setupNotifications() {}

  async loadMessages() {
    try {
      console.log('🔄 Iniciando carga de mensajes...');
      const data = await getContacts({});
      console.log('📨 Respuesta de la API:', data);
      
      if (data && data.success) {
        this.messages = Array.isArray(data.data) ? data.data : [];
        console.log('✅ Mensajes cargados:', this.messages.length);
      } else {
        console.warn('⚠️ Respuesta de API sin éxito:', data);
        this.messages = [];
      }
      
      this.applyFilters();
    } catch (e) {
      console.error('❌ Error cargando mensajes:', e);
      showToast('No se pudieron cargar los mensajes: ' + e.message, 'error');
      this.messages = [];
      this.applyFilters();
    }
  }

  loadStats() {}
  updateDashboard() {}

  applyFilters() {
    const term = this.searchTerm.toLowerCase();
    this.filteredMessages = this.messages.filter(m => {
      if (!term) return true;
      return (
        (m.nombre || '').toLowerCase().includes(term) ||
        (m.email || '').toLowerCase().includes(term) ||
        (m.telefono || '').toLowerCase().includes(term) ||
        (m.mensaje || '').toLowerCase().includes(term)
      );
    });
    this.render();
  }

  render() {
    const start = (this.currentPage - 1) * this.messagesPerPage;
    const end = start + this.messagesPerPage;
    const pageItems = this.filteredMessages.slice(start, end);
    console.log('🎯 Renderizando mensajes:', {
      totalMessages: this.filteredMessages.length,
      messagesPerPage: this.messagesPerPage,
      currentPage: this.currentPage,
      start: start,
      end: end,
      pageItems: pageItems.length
    });
    this.ui.renderMessages(pageItems);
    this.updatePagination();
  }

  updatePagination() {
    const totalPages = Math.ceil(this.filteredMessages.length / this.messagesPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    const paginationInfo = document.getElementById('pagination-info');

    // Actualizar botones de navegación
    if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;

    // Actualizar números de página
    if (pageNumbers) {
      pageNumbers.textContent = `Página ${this.currentPage} de ${totalPages || 1}`;
    }
    
    // Actualizar información de paginación
    if (paginationInfo) {
      const start = (this.currentPage - 1) * this.messagesPerPage + 1;
      const end = Math.min(this.currentPage * this.messagesPerPage, this.filteredMessages.length);
      paginationInfo.textContent = `Mostrando ${start}-${end} de ${this.filteredMessages.length} mensajes`;
      console.log('📄 Información de paginación actualizada:', paginationInfo.textContent);
    }
  }

  refreshAfterChange(id, partial) {
    const idx = this.messages.findIndex(m => String(m.id) === String(id));
    if (idx !== -1) {
      this.messages[idx] = { ...this.messages[idx], ...partial };
      this.applyFilters();
    }
  }

  removeMessage(id) {
    this.messages = this.messages.filter(m => String(m.id) !== String(id));
    this.applyFilters();
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando aplicación de administración...');
  try {
    // Verificar que API_CONFIG esté disponible
    if (!window.API_CONFIG) {
      console.error('❌ API_CONFIG no está disponible');
      showToast('Error de configuración: API_CONFIG no encontrado', 'error');
      return;
    }
    
    console.log('✅ API_CONFIG cargado:', window.API_CONFIG);
    const app = new AdminApp();
    await app.init();
    console.log('✅ Aplicación de administración iniciada correctamente');
    window.adminApp = app; // opcional por si otras scripts lo necesitan
    
    // Debug: Verificar elementos importantes
    setTimeout(() => {
      console.log('🔍 Verificando elementos de la interfaz:');
      console.log('- Selector de límite:', document.getElementById('items-limit'));
      console.log('- Modal de mensaje:', document.getElementById('message-modal'));
      console.log('- Tabla de mensajes:', document.getElementById('messages-tbody'));
      console.log('- Info de paginación:', document.getElementById('pagination-info'));
    }, 1000);
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    showToast('Error al cargar la aplicación: ' + error.message, 'error');
  }
});