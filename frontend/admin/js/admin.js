document.addEventListener('DOMContentLoaded', function() {
    // Eliminar checkAuth() para permitir acceso sin autenticación
    loadMessages();
    setupEventListeners();
});

function setupEventListeners() {
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn.addEventListener('click', loadMessages);
    
    // Eliminar el botón de logout ya que no hay autenticación
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
    
    // Cambiar el nombre de usuario por defecto
    document.getElementById('user-name').textContent = 'Visitante';
}

// Eliminar función checkAuth() completamente

async function loadMessages() {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando mensajes...</div>';
    
    try {
        const response = await fetch('http://localhost:8080/api/contactos');
        
        if (!response.ok) {
            throw new Error('Error al cargar mensajes');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            displayMessages(data.data);
            updateStats(data.data);
        } else {
            messagesList.innerHTML = '<div class="no-messages"><i class="fas fa-inbox"></i><br>No hay mensajes disponibles</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        messagesList.innerHTML = '<div class="no-messages"><i class="fas fa-exclamation-triangle"></i><br>Error al cargar mensajes</div>';
    }
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messages-list');
    
    const messagesHTML = messages.map(message => {
        const date = new Date(message.creado_en).toLocaleString('es-ES');
        return `
            <div class="message-item">
                <div class="message-header">
                    <div class="message-info">
                        <span class="message-name">${message.nombre}</span>
                        <span class="message-email">${message.email}</span>
                    </div>
                    <span class="message-date">${date}</span>
                </div>
                <div class="message-content">
                    <strong>Empresa:</strong> ${message.empresa || 'No especificada'}<br>
                    <strong>Teléfono:</strong> ${message.telefono || 'No especificado'}<br>
                    <strong>Mensaje:</strong> ${message.mensaje}
                </div>
            </div>
        `;
    }).join('');
    
    messagesList.innerHTML = messagesHTML;
}

function updateStats(messages) {
    const today = new Date().toDateString();
    const todayMessages = messages.filter(msg => 
        new Date(msg.creado_en).toDateString() === today
    ).length;
    
    const uniqueEmails = new Set(messages.map(msg => msg.email)).size;
    
    document.getElementById('total-messages').textContent = messages.length;
    document.getElementById('today-messages').textContent = todayMessages;
    document.getElementById('unique-contacts').textContent = uniqueEmails;
}

// Eliminar función logout() ya que no hay autenticación