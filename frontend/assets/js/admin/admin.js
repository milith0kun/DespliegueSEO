/**
 * Panel de Administración - Ecos del SEO
 * Gestión de autenticación, mensajes y estadísticas
 */

import { apiConfig, handleApiResponse } from '../configuracion/api.config.js';
import { authConfig, estaAutenticado, obtenerToken, obtenerUsuario, iniciarSesion, cerrarSesion } from '../configuracion/auth.config.js';

// Estado global de la aplicación
const appState = {
    usuario: null,
    mensajes: [],
    estadisticas: {},
    servicios: [],
    filtroMensajes: {
        estado: 'todos',
        busqueda: ''
    },
    paginacion: {
        paginaActual: 1,
        totalPaginas: 1,
        elementosPorPagina: 10,
        totalElementos: 0
    }
};

// Elementos del DOM
const elements = {
    loginPanel: document.getElementById('login-panel'),
    adminPanel: document.getElementById('admin-panel'),
    loginForm: document.getElementById('login-form'),
    logoutBtn: document.getElementById('logout-btn'),
    userName: document.getElementById('user-name'),
    navLinks: document.querySelectorAll('.admin-nav a'),
    sections: document.querySelectorAll('.admin-section'),
    mensajesContainer: document.getElementById('mensajes-container'),
    mensajeModal: document.getElementById('mensaje-modal'),
    mensajeModalClose: document.querySelector('#mensaje-modal .close-btn'),
    mensajeModalContent: document.querySelector('#mensaje-modal .mensaje-detalle'),
    mensajeModalForm: document.querySelector('#mensaje-modal form'),
    mensajeFiltros: document.querySelectorAll('.filter-option'),
    mensajeBusqueda: document.getElementById('mensaje-search'),
    dashboardStats: document.querySelector('.dashboard-stats')
};

/**
 * Inicializa la aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', async () => {
    inicializarEstado();
    configurarEventListeners();
    
    try {
        // Verificar si hay una sesión activa
        const sesionValida = await authConfig.verificarSesion();
        
        if (sesionValida) {
            const usuario = authConfig.obtenerUsuario();
            if (usuario) {
                appState.usuario = usuario;
                mostrarPanelAdmin();
                await cargarDatosIniciales();
            } else {
                mostrarPanelLogin();
            }
        } else {
            mostrarPanelLogin();
        }
    } catch (error) {
        console.error('Error al inicializar:', error);
        mostrarPanelLogin();
    }
});

/**
 * Configura los event listeners de la aplicación
 */
function configurarEventListeners() {
    // Login
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navegación
    if (elements.navLinks && elements.navLinks.length > 0) {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetSection = link.getAttribute('data-section');
                cambiarSeccion(targetSection);
            });
        });
    }
    
    // Filtros de mensajes
    if (elements.mensajeFiltros && elements.mensajeFiltros.length > 0) {
        elements.mensajeFiltros.forEach(filtro => {
            filtro.addEventListener('click', () => {
                const estado = filtro.getAttribute('data-filter');
                filtrarMensajesPorEstado(estado);
            });
        });
    }
    
    // Búsqueda de mensajes
    if (elements.mensajeBusqueda) {
        elements.mensajeBusqueda.addEventListener('input', debounce(() => {
            appState.filtroMensajes.busqueda = elements.mensajeBusqueda.value;
            aplicarFiltrosMensajes();
        }, 300));
    }
    
    // Cerrar modal de mensaje
    if (elements.mensajeModalClose) {
        elements.mensajeModalClose.addEventListener('click', cerrarModalMensaje);
    }
    
    // Botones de paginación
    configurarPaginacion();
}

/**
 * Configura los botones de paginación
 */
function configurarPaginacion() {
    const paginacionContainer = document.getElementById('paginacion-container');
    if (!paginacionContainer) return;
    
    paginacionContainer.addEventListener('click', (e) => {
        if (e.target.matches('.btn-pagina') || e.target.closest('.btn-pagina')) {
            const btn = e.target.matches('.btn-pagina') ? e.target : e.target.closest('.btn-pagina');
            const pagina = parseInt(btn.getAttribute('data-pagina'));
            
            if (pagina && pagina !== appState.paginacion.paginaActual) {
                cambiarPagina(pagina);
            }
        }
    });
}

/**
 * Cambia la página actual y recarga los mensajes
 * @param {number} pagina - Número de página
 */
async function cambiarPagina(pagina) {
    if (pagina < 1 || pagina > appState.paginacion.totalPaginas) return;
    
    try {
        mostrarCargando(true);
        
        await cargarMensajes({ pagina });
        renderizarMensajes();
        renderizarPaginacion();
        
    } catch (error) {
        console.error('Error al cambiar de página:', error);
        mostrarError('Error al cambiar de página: ' + error.message);
    } finally {
        mostrarCargando(false);
    }
}

/**
 * Renderiza los controles de paginación
 */
function renderizarPaginacion() {
    const paginacionContainer = document.getElementById('paginacion-container');
    if (!paginacionContainer) return;
    
    const { paginaActual, totalPaginas, totalElementos, elementosPorPagina } = appState.paginacion;
    
    if (totalPaginas <= 1) {
        paginacionContainer.innerHTML = '';
        return;
    }
    
    let html = `
        <div class="paginacion-info">
            Mostrando ${((paginaActual - 1) * elementosPorPagina) + 1} - 
            ${Math.min(paginaActual * elementosPorPagina, totalElementos)} 
            de ${totalElementos} mensajes
        </div>
        <div class="paginacion-botones">
    `;
    
    // Botón anterior
    html += `
        <button class="btn-pagina ${paginaActual === 1 ? 'disabled' : ''}" 
                data-pagina="${paginaActual - 1}" 
                ${paginaActual === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Números de página
    const maxPaginas = 5;
    let startPage = Math.max(1, paginaActual - Math.floor(maxPaginas / 2));
    let endPage = Math.min(totalPaginas, startPage + maxPaginas - 1);
    
    if (endPage - startPage + 1 < maxPaginas) {
        startPage = Math.max(1, endPage - maxPaginas + 1);
    }
    
    if (startPage > 1) {
        html += `<button class="btn-pagina" data-pagina="1">1</button>`;
        if (startPage > 2) {
            html += `<span class="paginacion-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="btn-pagina ${i === paginaActual ? 'active' : ''}" 
                    data-pagina="${i}">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPaginas) {
        if (endPage < totalPaginas - 1) {
            html += `<span class="paginacion-ellipsis">...</span>`;
        }
        html += `<button class="btn-pagina" data-pagina="${totalPaginas}">${totalPaginas}</button>`;
    }
    
    // Botón siguiente
    html += `
        <button class="btn-pagina ${paginaActual === totalPaginas ? 'disabled' : ''}" 
                data-pagina="${paginaActual + 1}" 
                ${paginaActual === totalPaginas ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    html += `</div>`;
    
    paginacionContainer.innerHTML = html;
}

/**
 * Función para debounce de eventos
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función con debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Inicializa la aplicación
 */
async function inicializarApp() {
    // Comprobar si hay sesión activa
    if (estaAutenticado()) {
        try {
            // Verificar token y cargar datos de usuario
            const usuario = obtenerUsuario();
            if (usuario) {
                appState.usuario = usuario;
                mostrarPanelAdmin();
                await cargarDatosIniciales();
            } else {
                mostrarPanelLogin();
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            mostrarPanelLogin();
        }
    } else {
        mostrarPanelLogin();
    }

    // Configurar event listeners
    configurarEventListeners();
}

/**
 * Configura los event listeners de la aplicación
 */
function configurarEventListeners() {
    // Login form
    elements.loginForm.addEventListener('submit', handleLogin);

    // Logout button
    elements.logoutBtn.addEventListener('click', handleLogout);

    // Navegación
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            cambiarSeccion(targetSection);
        });
    });

    // Filtros de mensajes
    elements.mensajeFiltros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            const estado = filtro.getAttribute('data-filter');
            filtrarMensajesPorEstado(estado);
        });
    });

    // Búsqueda de mensajes
    elements.mensajeBusqueda.addEventListener('input', (e) => {
        appState.filtroMensajes.busqueda = e.target.value.toLowerCase();
        aplicarFiltrosMensajes();
    });

    // Modal de mensaje
    elements.mensajeModalClose.addEventListener('click', cerrarModalMensaje);
    elements.mensajeModalForm.addEventListener('submit', responderMensaje);
}

/**
 * Maneja el inicio de sesión
 * @param {Event} e - Evento del formulario
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[name="email"]').value;
    const password = e.target.querySelector('input[name="password"]').value;
    
    if (!email || !password) {
        mostrarError('Por favor, completa todos los campos');
        return;
    }
    
    try {
        mostrarCargando(true);
        
        // Usar la función de autenticación desde auth.config.js
        const { usuario, token } = await authConfig.iniciarSesion(email, password);
        
        appState.usuario = usuario;
        mostrarPanelAdmin();
        await cargarDatosIniciales();
        
        mostrarExito('Inicio de sesión exitoso');
        
    } catch (error) {
        console.error('Error de inicio de sesión:', error);
        mostrarError('Error de inicio de sesión: ' + error.message);
        
        // Mostrar error en el formulario
        if (elements.loginError) {
            elements.loginError.textContent = 'Credenciales inválidas';
            elements.loginError.classList.remove('hidden');
        }
    } finally {
        mostrarCargando(false);
    }
}

/**
 * Maneja el cierre de sesión
 */
async function handleLogout() {
    try {
        mostrarCargando(true);
        
        // Usar la función de cierre de sesión desde auth.config.js
        await authConfig.cerrarSesion();
        
        // Limpiar estado
        appState.usuario = null;
        appState.mensajes = [];
        appState.estadisticas = {};
        
        mostrarPanelLogin();
        mostrarExito('Sesión cerrada correctamente');
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        mostrarError('Error al cerrar sesión: ' + error.message);
    } finally {
        mostrarCargando(false);
    }
}

/**
 * Muestra el panel de login
 */
function mostrarPanelLogin() {
    elements.loginPanel.style.display = 'flex';
    elements.adminPanel.style.display = 'none';
}

/**
 * Muestra el panel de administración
 */
function mostrarPanelAdmin() {
    elements.loginPanel.style.display = 'none';
    elements.adminPanel.style.display = 'flex';
    elements.userName.textContent = appState.usuario.nombre;
}

/**
 * Carga los datos iniciales al iniciar sesión
 */
async function cargarDatosIniciales() {
    try {
        // Mostrar indicador de carga
        mostrarCargando(true);
        
        // Cargar mensajes y estadísticas en paralelo
        await Promise.all([
            cargarMensajes(),
            cargarEstadisticas()
        ]);
        
        // Actualizar la interfaz
        actualizarDashboard();
        renderizarMensajes();
        
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        mostrarError('Error al cargar datos: ' + error.message);
    } finally {
        mostrarCargando(false);
    }
}

/**
 * Muestra u oculta el indicador de carga
 * @param {boolean} mostrar - Si se debe mostrar el indicador
 */
function mostrarCargando(mostrar) {
    const loader = document.getElementById('loader') || crearLoader();
    loader.style.display = mostrar ? 'flex' : 'none';
}

/**
 * Crea un elemento de carga si no existe
 * @returns {HTMLElement} - Elemento de carga
 */
function crearLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'loader-overlay';
    loader.innerHTML = `
        <div class="loader-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Cargando...</span>
        </div>
    `;
    document.body.appendChild(loader);
    return loader;
}

/**
 * Actualiza el dashboard con las estadísticas
 */
function actualizarDashboard() {
    if (!appState.estadisticas || !elements.dashboardStats) return;
    
    const { total, porEstado, porPrioridad, porServicio, porMes, tiempoPromedio } = appState.estadisticas;
    
    // Actualizar contadores principales
    elements.dashboardStats.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-envelope"></i></div>
            <div class="stat-info">
                <h3>Total Mensajes</h3>
                <p>${total || 0}</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-clock"></i></div>
            <div class="stat-info">
                <h3>Tiempo Promedio Respuesta</h3>
                <p>${tiempoPromedio || 'N/A'}</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-inbox"></i></div>
            <div class="stat-info">
                <h3>Pendientes</h3>
                <p>${porEstado?.pendiente || 0}</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
            <div class="stat-info">
                <h3>Respondidos</h3>
                <p>${porEstado?.respondido || 0}</p>
            </div>
        </div>
    `;
    
    // Aquí se podrían añadir gráficos con Chart.js u otra librería
}

/**
 * Renderiza la lista de mensajes en la tabla
 */
function renderizarMensajes() {
    const tbody = document.getElementById('mensajes-tbody');
    if (!tbody || !appState.mensajes) return;
    
    // Filtrar mensajes según los filtros actuales
    const mensajesFiltrados = filtrarMensajes();
    
    if (mensajesFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">No hay mensajes que coincidan con los filtros</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = mensajesFiltrados.map(mensaje => `
        <tr class="${mensaje.estado === 'pendiente' ? 'mensaje-pendiente' : 'mensaje-respondido'}">
            <td>${mensaje.fecha_formateada || mensaje.fecha_creacion}</td>
            <td>${mensaje.nombre}</td>
            <td>${mensaje.email}</td>
            <td>${formatearServicio(mensaje.interes_servicio)}</td>
            <td>
                <span class="estado-badge ${mensaje.estado}">
                    ${mensaje.estado === 'pendiente' ? 'Pendiente' : 'Respondido'}
                </span>
            </td>
            <td>
                <button class="btn-icon ver-mensaje" data-id="${mensaje.id}" title="Ver mensaje">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Añadir event listeners a los botones de ver mensaje
    const botonesVerMensaje = tbody.querySelectorAll('.ver-mensaje');
    botonesVerMensaje.forEach(btn => {
        btn.addEventListener('click', () => {
            const mensajeId = btn.getAttribute('data-id');
            abrirModalMensaje(mensajeId);
        });
    });
}

/**
 * Formatea el nombre del servicio para mostrar
 * @param {string} servicioId - ID del servicio
 * @returns {string} - Nombre formateado
 */
function formatearServicio(servicioId) {
    const servicios = {
        'desarrollo-web': 'Desarrollo Web',
        'seo-contenido': 'SEO & Contenido',
        'ux-ui-cro': 'UX/UI & CRO',
        'paid-media': 'Paid Media',
        'social-media': 'Social Media',
        'software-medida': 'Software a Medida',
        'trading-finanzas': 'Trading & Finanzas'
    };
    
    return servicios[servicioId] || servicioId || 'General';
}

/**
 * Filtra los mensajes según los filtros actuales
 * @returns {Array} - Mensajes filtrados
 */
function filtrarMensajes() {
    if (!appState.mensajes) return [];
    
    return appState.mensajes.filter(mensaje => {
        // Filtro por estado
        if (appState.filtroMensajes.estado !== 'todos' && 
            mensaje.estado !== appState.filtroMensajes.estado) {
            return false;
        }
        
        // Filtro por búsqueda
        if (appState.filtroMensajes.busqueda) {
            const busqueda = appState.filtroMensajes.busqueda.toLowerCase();
            const coincide = 
                mensaje.nombre?.toLowerCase().includes(busqueda) ||
                mensaje.email?.toLowerCase().includes(busqueda) ||
                mensaje.mensaje?.toLowerCase().includes(busqueda) ||
                mensaje.empresa?.toLowerCase().includes(busqueda);
                
            if (!coincide) return false;
        }
        
        return true;
    });
}

/**
 * Aplica los filtros y actualiza la vista de mensajes
 */
function aplicarFiltrosMensajes() {
    renderizarMensajes();
}

/**
 * Filtra los mensajes por estado
 * @param {string} estado - Estado a filtrar ('todos', 'pendiente', 'respondido')
 */
function filtrarMensajesPorEstado(estado) {
    appState.filtroMensajes.estado = estado;
    
    // Actualizar UI de filtros
    elements.mensajeFiltros.forEach(filtro => {
        const filtroEstado = filtro.getAttribute('data-filter');
        filtro.classList.toggle('active', filtroEstado === estado);
    });
    
    aplicarFiltrosMensajes();
}

/**
 * Cambia la sección activa del panel
 * @param {string} seccionId - ID de la sección a mostrar
 */
function cambiarSeccion(seccionId) {
    // Actualizar navegación
    elements.navLinks.forEach(link => {
        if (link.getAttribute('data-section') === seccionId) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
    
    // Actualizar secciones
    elements.sections.forEach(section => {
        if (section.id === `${seccionId}-section`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

/**
 * Carga los mensajes de contacto
 */
async function cargarMensajes(params = {}) {
    try {
        // Construir parámetros de consulta
        const queryParams = new URLSearchParams({
            pagina: params.pagina || appState.paginacion.paginaActual || 1,
            limite: params.limite || appState.paginacion.elementosPorPagina || 10,
            estado: params.estado || appState.filtroMensajes.estado || 'todos',
            busqueda: params.busqueda || appState.filtroMensajes.busqueda || ''
        }).toString();
        
        // Realizar petición a la API
        const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.messages.list}?${queryParams}`, {
            headers: apiConfig.getAuthHeaders()
        });
        
        const data = await handleApiResponse(response);
        
        // Actualizar estado con los mensajes y paginación
        appState.mensajes = data.mensajes.map(mensaje => ({
            ...mensaje,
            fecha_formateada: formatearFecha(mensaje.fecha_creacion || mensaje.created_at)
        }));
        
        appState.paginacion = {
            ...appState.paginacion,
            paginaActual: data.paginacion?.pagina_actual || 1,
            totalPaginas: data.paginacion?.total_paginas || 1,
            totalElementos: data.paginacion?.total_elementos || appState.mensajes.length
        };
        
        return appState.mensajes;
        
    } catch (error) {
        console.error('Error al cargar mensajes:', error);
        mostrarError('Error al cargar mensajes: ' + error.message);
        return [];
    }
}

/**
 * Carga las estadísticas
 */
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.messages.stats}`, {
            headers: apiConfig.getAuthHeaders()
        });
        
        const data = await handleApiResponse(response);
        
        // Actualizar estado con las estadísticas
        appState.estadisticas = data.estadisticas || {
            total: 0,
            porEstado: { pendiente: 0, respondido: 0 },
            porPrioridad: { baja: 0, media: 0, alta: 0 },
            porServicio: {},
            porMes: {},
            tiempoPromedio: 'N/A'
        };
        
        return appState.estadisticas;
        
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        mostrarError('Error al cargar estadísticas: ' + error.message);
        return {};
    }
}

/**
 * Formatea una fecha
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
function formatearFecha(fecha) {
    if (!fecha) return 'Fecha no disponible';
    
    try {
        return new Date(fecha).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return fecha;
    }
}

/**
 * Abre el modal de detalle de mensaje
 * @param {string} id - ID del mensaje
 */
async function abrirModalMensaje(id) {
    try {
        // Mostrar indicador de carga
        mostrarCargando(true);
        
        // Obtener el mensaje detallado desde la API
        const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.messages.detail}${id}`, {
            headers: apiConfig.getAuthHeaders()
        });
        
        const data = await handleApiResponse(response);
        const mensaje = data.mensaje;
        
        if (!mensaje) {
            mostrarError('Mensaje no encontrado');
            return;
        }
        
        // Llenar el modal con los datos del mensaje
        const modalContent = document.querySelector('#mensaje-modal .modal-body');
        modalContent.innerHTML = `
            <div class="mensaje-details">
                <div class="mensaje-header">
                    <h3>${mensaje.nombre}</h3>
                    <span class="mensaje-fecha">${mensaje.fecha_formateada || mensaje.fecha_creacion}</span>
                    <span class="estado-badge ${mensaje.estado}">
                        ${mensaje.estado === 'pendiente' ? 'Pendiente' : 'Respondido'}
                    </span>
                </div>
                
                <div class="mensaje-info">
                    <p><strong>Email:</strong> ${mensaje.email}</p>
                    <p><strong>Teléfono:</strong> ${mensaje.telefono || 'No proporcionado'}</p>
                    <p><strong>Empresa:</strong> ${mensaje.empresa || 'No proporcionada'}</p>
                    <p><strong>Servicio:</strong> ${formatearServicio(mensaje.interes_servicio)}</p>
                </div>
                
                <div class="mensaje-content">
                    <h4>Mensaje:</h4>
                    <div class="mensaje-text">${mensaje.mensaje}</div>
                </div>
                
                ${mensaje.respuesta ? `
                    <div class="respuesta-previa">
                        <h4>Respuesta anterior:</h4>
                        <div class="respuesta-text">${mensaje.respuesta}</div>
                        <div class="respuesta-meta">
                            <span>Respondido por: ${mensaje.respondido_por || 'Administrador'}</span>
                            <span>Fecha: ${mensaje.fecha_respuesta_formateada || mensaje.fecha_respuesta || 'No disponible'}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <form id="respuesta-form" data-id="${mensaje.id}">
                <h4>${mensaje.respuesta ? 'Enviar nueva respuesta:' : 'Responder mensaje:'}</h4>
                
                <div class="form-group">
                    <label for="asunto">Asunto</label>
                    <input type="text" id="asunto" name="asunto" value="Re: Consulta en Ecos del SEO - ${mensaje.interes_servicio ? formatearServicio(mensaje.interes_servicio) : 'Información general'}">
                </div>
                
                <div class="form-group">
                    <label for="respuesta">Tu respuesta</label>
                    <textarea id="respuesta" name="respuesta" rows="5" required placeholder="Escribe tu respuesta aquí..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary cerrar-modal">Cancelar</button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-paper-plane"></i>
                        Enviar respuesta
                    </button>
                </div>
            </form>
        `;
        
        // Configurar event listeners para el formulario y botones
        const form = modalContent.querySelector('#respuesta-form');
        form.addEventListener('submit', responderMensaje);
        
        const btnCerrar = modalContent.querySelector('.cerrar-modal');
        btnCerrar.addEventListener('click', cerrarModalMensaje);
        
        // Mostrar el modal
        document.getElementById('mensaje-modal').classList.add('active');
        
    } catch (error) {
        console.error('Error al abrir detalle de mensaje:', error);
        mostrarError('Error al cargar el mensaje: ' + error.message);
    } finally {
        mostrarCargando(false);
    }
}

/**
 * Cierra el modal de mensaje
 */
function cerrarModalMensaje() {
    const modal = document.getElementById('mensaje-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Responde a un mensaje
 * @param {Event} e - Evento del formulario
 */
async function responderMensaje(e) {
    e.preventDefault();
    
    const form = e.target;
    const mensajeId = form.getAttribute('data-id');
    const respuesta = form.querySelector('#respuesta').value;
    const asunto = form.querySelector('#asunto').value;
    
    if (!respuesta.trim()) {
        mostrarError('La respuesta no puede estar vacía');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        mostrarCargando(true);
        
        // Enviar respuesta al backend
        const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.messages.respond}${mensajeId}/responder`, {
            method: 'POST',
            headers: apiConfig.getAuthHeaders(),
            body: JSON.stringify({ respuesta, asunto })
        });
        
        await handleApiResponse(response);
        
        // Actualizar datos y UI
        await Promise.all([
            cargarMensajes(),
            cargarEstadisticas()
        ]);
        
        actualizarDashboard();
        renderizarMensajes();
        cerrarModalMensaje();
        
        mostrarExito('Mensaje respondido correctamente');
        
    } catch (error) {
        console.error('Error al responder mensaje:', error);
        mostrarError('Error al responder: ' + error.message);
    } finally {
        mostrarCargando(false);
    }
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-exclamation-circle"></i></div>
        <div class="toast-content">${mensaje}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Configurar cierre
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Muestra un mensaje de éxito
 * @param {string} mensaje - Mensaje de éxito
 */
function mostrarExito(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
        <div class="toast-content">${mensaje}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Configurar cierre
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}
