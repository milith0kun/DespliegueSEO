/**
 * Script principal del panel de administración
 * Gestiona la navegación y funcionalidad general del admin
 */

import { protectPage, logout, getUserData } from './auth.js';

// Variables globales
let currentSection = 'dashboard';
let userData = null;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Proteger la página (solo administradores)
        await protectPage(true);
        
        // Obtener datos del usuario
        userData = await getUserData();
        
        // Inicializar la interfaz
        initializeInterface();
        
        // Configurar navegación
        setupNavigation();
        
        // Configurar eventos
        setupEventListeners();
        
        // Cargar sección inicial
        showSection('dashboard');
        
    } catch (error) {
        console.error('Error al inicializar el panel de administración:', error);
        // Redirigir al login si hay error
        window.location.href = 'index.html';
    }
});

/**
 * Inicializa la interfaz del usuario
 */
function initializeInterface() {
    // Mostrar el panel de administración
    const loginPanel = document.getElementById('login-panel');
    const adminPanel = document.getElementById('admin-panel');
    
    if (loginPanel) loginPanel.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'flex';
    
    // Actualizar nombre del usuario
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && userData && userData.nombre) {
        userNameElement.textContent = userData.nombre;
    }
}

/**
 * Configura la navegación del sidebar
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

/**
 * Configura los event listeners generales
 */
function setupEventListeners() {
    // Botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Cerrar modal
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Cerrar modal al hacer clic fuera
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
}

/**
 * Muestra una sección específica del panel
 * @param {string} sectionName - Nombre de la sección a mostrar
 */
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Actualizar navegación activa
    const navItems = document.querySelectorAll('.admin-nav li');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`)?.closest('li');
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Actualizar sección actual
    currentSection = sectionName;
    
    // Cargar contenido específico de la sección
    loadSectionContent(sectionName);
}

/**
 * Carga el contenido específico de una sección
 * @param {string} sectionName - Nombre de la sección
 */
async function loadSectionContent(sectionName) {
    try {
        switch (sectionName) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'mensajes':
                await loadMensajes();
                break;
            case 'usuarios':
                await loadUsuarios();
                break;
            case 'servicios':
                await loadServicios();
                break;
            case 'configuracion':
                await loadConfiguracion();
                break;
        }
    } catch (error) {
        console.error(`Error al cargar la sección ${sectionName}:`, error);
        showNotification('Error al cargar el contenido', 'error');
    }
}

/**
 * Carga el dashboard
 */
async function loadDashboard() {
    // Importar y ejecutar el módulo del dashboard
    const { initDashboard } = await import('./dashboard.js');
    await initDashboard();
}

/**
 * Carga la sección de mensajes
 */
async function loadMensajes() {
    // Importar y ejecutar el módulo de contactos
    const { initContactos } = await import('./contactos.js');
    await initContactos();
}

/**
 * Carga la sección de usuarios
 */
async function loadUsuarios() {
    // Importar y ejecutar el módulo de usuarios
    const { initUsuarios } = await import('./usuarios.js');
    await initUsuarios();
}

/**
 * Carga la sección de servicios
 */
async function loadServicios() {
    console.log('Cargando servicios...');
    // TODO: Implementar gestión de servicios
}

/**
 * Carga la sección de configuración
 */
async function loadConfiguracion() {
    console.log('Cargando configuración...');
    // TODO: Implementar configuración
}

/**
 * Maneja el logout del usuario
 */
async function handleLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Forzar redirección incluso si hay error
            window.location.href = 'index.html';
        }
    }
}

/**
 * Cierra cualquier modal abierto
 */
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

/**
 * Muestra una notificación al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `toast toast-${type}`;
    notification.textContent = message;
    
    // Agregar al contenedor de notificaciones
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Exportar funciones para uso en otros módulos
export {
    showSection,
    showNotification,
    closeModal,
    userData
};