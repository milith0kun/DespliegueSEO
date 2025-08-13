// Utilidades compartidas
export function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.padding = '10px 16px';
  toast.style.marginTop = '8px';
  toast.style.borderRadius = '6px';
  toast.style.color = '#fff';
  toast.style.fontSize = '14px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  toast.style.transition = 'all .3s ease';

  const colors = {
    info: '#2563eb',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626'
  };
  toast.style.background = colors[type] || colors.info;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export function showConfirmation(message, onConfirm, onCancel) {
  let overlay = document.getElementById('confirmation-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confirmation-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10000';

    const modal = document.createElement('div');
    modal.style.background = '#fff';
    modal.style.borderRadius = '8px';
    modal.style.padding = '16px';
    modal.style.width = '360px';
    modal.style.maxWidth = '90vw';
    modal.innerHTML = `
      <h3 style="margin:0 0 8px 0;font-size:18px">Confirmación</h3>
      <p style="margin:0 0 16px 0;font-size:14px;color:#374151">${escapeHtml(message)}</p>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button id="confirmation-cancel" style="padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;background:#fff;cursor:pointer">Cancelar</button>
        <button id="confirmation-confirm" style="padding:8px 12px;border:1px solid transparent;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer">Confirmar</button>
      </div>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  overlay.style.display = 'flex';

  const confirmBtn = overlay.querySelector('#confirmation-confirm');
  const cancelBtn = overlay.querySelector('#confirmation-cancel');

  const cleanup = () => {
    overlay.style.display = 'none';
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
  };

  confirmBtn.addEventListener('click', () => {
    cleanup();
    if (typeof onConfirm === 'function') onConfirm();
  });
  cancelBtn.addEventListener('click', () => {
    cleanup();
    if (typeof onCancel === 'function') onCancel();
  });
}