import { escapeHtml, formatDate, showToast, showConfirmation } from './utils.js';
import { updateContact, deleteContact } from './contactsApi.js';

export class MessagesUI {
  constructor(panel) {
    this.panel = panel;
    this.tableBody = document.getElementById('messages-tbody');
    this.modal = document.getElementById('message-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBadges = document.getElementById('modal-badges');
    this.responseText = document.getElementById('response-text');
  }

  renderMessages(messages) {
    if (!this.tableBody) return;
    if (!messages || messages.length === 0) {
      this.tableBody.innerHTML = `
        <tr><td colspan="7" class="empty">No hay mensajes</td></tr>
      `;
      return;
    }
    this.tableBody.innerHTML = messages.map(m => `
      <tr class="message-row ${m.estado === 'nuevo' ? 'unread' : ''}" data-id="${m.id}">
        <td data-label="Seleccionar"><input type="checkbox" class="select-message" data-id="${m.id}"></td>
        <td data-label="Nombre">${escapeHtml(m.nombre || '')}</td>
        <td data-label="Email">${escapeHtml(m.email || '')}</td>
        <td data-label="Servicio">${escapeHtml(m.servicio || '')}</td>
        <td data-label="Estado">${escapeHtml(m.estado || '')}</td>
        <td data-label="Fecha">${formatDate(m.fecha_creacion || m.fecha)}</td>
        <td data-label="Acciones">
          <button class="btn-small btn-view" data-id="${m.id}">Ver</button>
          <button class="btn-small btn-read" data-id="${m.id}">Leído</button>
          <button class="btn-small btn-priority" data-id="${m.id}">Prioritario</button>
          <button class="btn-small btn-archive" data-id="${m.id}">Archivar</button>
          <button class="btn-small btn-delete" data-id="${m.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');

    this.bindRowEvents();
  }

  bindRowEvents() {
    const tbody = this.tableBody;
    if (!tbody) return;

    tbody.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => this.viewMessage(btn.dataset.id));
    });
    tbody.querySelectorAll('.btn-read').forEach(btn => {
      btn.addEventListener('click', () => this.markAsRead(btn.dataset.id));
    });
    tbody.querySelectorAll('.btn-priority').forEach(btn => {
      btn.addEventListener('click', () => this.togglePriority(btn.dataset.id));
    });
    tbody.querySelectorAll('.btn-archive').forEach(btn => {
      btn.addEventListener('click', () => this.archiveMessage(btn.dataset.id));
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => this.deleteMessage(btn.dataset.id));
    });
  }

  openModal() {
    if (this.modal) {
      this.modal.classList.add('show');
      console.log('✅ Modal opened with show class');
    }
  }
  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('show');
      console.log('✅ Modal closed');
    }
  }

  viewMessage(id) {
    console.log('🎯 Intentando ver mensaje con ID:', id);
    const msg = this.panel.messages.find(m => String(m.id) === String(id));
    console.log('📝 Mensaje encontrado:', msg);
    if (!msg) {
      console.error('❌ Mensaje no encontrado para ID:', id);
      return;
    }
    
    // Test básico del modal
    console.log('🧪 Verificando modal:', {
      modalExists: !!this.modal,
      modalId: this.modal?.id,
      modalClasses: this.modal?.className
    });
    
    // Actualizar título del modal
    if (this.modalTitle) {
      this.modalTitle.textContent = `${msg.nombre || 'Mensaje'} - ${formatDate(msg.fecha_creacion || msg.fecha)}`;
      console.log('✅ Modal title updated');
    } else {
      console.error('❌ Modal title element not found');
    }
    
    // Actualizar badges
    if (this.modalBadges) this.modalBadges.innerHTML = `
      <span class="badge">${escapeHtml(msg.estado || 'nuevo')}</span>
      ${msg.prioridad === 'alta' ? '<span class="badge badge-warning">Prioritario</span>' : ''}
    `;
    
    // Actualizar contenido de detalles
    const modalBody = document.getElementById('modal-body');
    console.log('🎯 Modal body element:', modalBody);
    if (modalBody) {
      console.log('📝 Generating modal content for message:', msg);
      
      modalBody.innerHTML = `
        <div class="message-details">
          <div class="detail-group">
            <label><i class="fas fa-user"></i> Nombre:</label>
            <span>${escapeHtml(msg.nombre || 'No especificado')}</span>
          </div>
          <div class="detail-group">
            <label><i class="fas fa-envelope"></i> Email:</label>
            <span>${escapeHtml(msg.email || 'No especificado')}</span>
          </div>
          <div class="detail-group">
            <label><i class="fas fa-phone"></i> Teléfono:</label>
            <span>${escapeHtml(msg.telefono || 'No especificado')}</span>
          </div>
          <div class="detail-group">
            <label><i class="fas fa-briefcase"></i> Servicio:</label>
            <span>${escapeHtml(msg.servicio || 'No especificado')}</span>
          </div>
          <div class="detail-group">
            <label><i class="fas fa-calendar"></i> Fecha:</label>
            <span>${formatDate(msg.fecha_creacion || msg.fecha)}</span>
          </div>
          <div class="detail-group full-width">
            <label><i class="fas fa-comment"></i> Mensaje:</label>
            <div class="message-content">${escapeHtml(msg.mensaje || 'Sin mensaje')}</div>
          </div>
        </div>
      `;
      console.log('✅ Modal content generated successfully');
    } else {
      console.error('❌ Modal body element not found');
    }
    
    console.log('🚀 Opening modal...');
    this.openModal();
    this.setupModalTabs();
    
    // Verificar que el modal esté visible
    setTimeout(() => {
      console.log('🔍 Modal visibility check:', {
        modalExists: !!this.modal,
        modalHasShowClass: this.modal?.classList.contains('show'),
        modalBodyExists: !!document.getElementById('modal-body'),
        detailsTabActive: document.getElementById('details-tab')?.classList.contains('active')
      });
    }, 100);
    
    // Marcar como leído si es nuevo
    if ((msg.estado || 'nuevo') === 'nuevo') {
      this.markAsRead(id);
    }
  }

  setupModalTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Remover clase active de todos los botones y panes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Agregar clase active al botón clickeado y su pane correspondiente
        btn.classList.add('active');
        const targetPane = document.getElementById(`${targetTab}-tab`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  async markAsRead(id) {
    try {
      await updateContact(id, { estado: 'gestionado' });
      showToast('Marcado como leído', 'success');
      this.panel.refreshAfterChange(id, { estado: 'gestionado' });
    } catch (e) {
      console.error(e);
      showToast('No se pudo marcar como leído', 'error');
    }
  }

  async togglePriority(id) {
    const msg = this.panel.messages.find(m => String(m.id) === String(id));
    const newPriority = msg && msg.prioridad === 'alta' ? 'normal' : 'alta';
    try {
      await updateContact(id, { prioridad: newPriority });
      showToast('Prioridad actualizada', 'success');
      this.panel.refreshAfterChange(id, { prioridad: newPriority });
    } catch (e) {
      console.error(e);
      showToast('No se pudo actualizar prioridad', 'error');
    }
  }

  async archiveMessage(id) {
    try {
      await updateContact(id, { estado: 'archivado' });
      showToast('Mensaje archivado', 'success');
      this.panel.refreshAfterChange(id, { estado: 'archivado' });
    } catch (e) {
      console.error(e);
      showToast('No se pudo archivar', 'error');
    }
  }

  async deleteMessage(id) {
    showConfirmation('¿Eliminar mensaje definitivamente?', async () => {
      try {
        await deleteContact(id);
        showToast('Mensaje eliminado', 'success');
        this.panel.removeMessage(id);
      } catch (e) {
        console.error(e);
        showToast('No se pudo eliminar', 'error');
      }
    });
  }
}