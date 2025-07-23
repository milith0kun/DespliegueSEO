/**
 * Dashboard - Funcionalidad para el panel principal de administración
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Proteger la página - solo accesible para administradores
        await protectPage(true);
        
        // Cargar datos del dashboard
        await cargarEstadisticas();
        await cargarContactosRecientes();
    } catch (error) {
        console.error('Error al inicializar dashboard:', error);
    }
});

/**
 * Carga las estadísticas principales del dashboard
 */
async function cargarEstadisticas() {
    try {
        // Cargar estadísticas de usuarios
        const responseUsuarios = await fetchWithAuth('/api/admin/estadisticas/usuarios');
        if (responseUsuarios.ok) {
            const dataUsuarios = await responseUsuarios.json();
            
            if (dataUsuarios.success) {
                // Actualizar contador de usuarios
                document.getElementById('totalUsuarios').textContent = dataUsuarios.data.total || 0;
                
                // Actualizar distribución por roles
                const usuariosPorRol = document.getElementById('usuariosPorRol');
                usuariosPorRol.innerHTML = '';
                
                if (dataUsuarios.data.porRol && dataUsuarios.data.porRol.length > 0) {
                    dataUsuarios.data.porRol.forEach(rol => {
                        const porcentaje = Math.round((rol.cantidad / dataUsuarios.data.total) * 100);
                        
                        const rolItem = document.createElement('div');
                        rolItem.className = 'd-flex justify-content-between align-items-center mb-2';
                        rolItem.innerHTML = `
                            <div>
                                <span class="badge bg-${getRoleBadgeColor(rol.rol)} me-2">${formatRoleName(rol.rol)}</span>
                                <small>${rol.cantidad} usuarios</small>
                            </div>
                            <span>${porcentaje}%</span>
                        `;
                        
                        usuariosPorRol.appendChild(rolItem);
                    });
                } else {
                    usuariosPorRol.innerHTML = '<p class="text-muted small">No hay datos disponibles</p>';
                }
            }
        }
        
        // Cargar estadísticas de contactos
        const responseContactos = await fetchWithAuth('/api/admin/estadisticas/contactos');
        if (responseContactos.ok) {
            const dataContactos = await responseContactos.json();
            
            if (dataContactos.success) {
                // Actualizar contador de contactos
                document.getElementById('totalContactos').textContent = dataContactos.data.total || 0;
                
                // Actualizar distribución por estado
                const contactosPorEstado = document.getElementById('contactosPorEstado');
                contactosPorEstado.innerHTML = '';
                
                if (dataContactos.data.porEstado && dataContactos.data.porEstado.length > 0) {
                    dataContactos.data.porEstado.forEach(estado => {
                        const porcentaje = Math.round((estado.cantidad / dataContactos.data.total) * 100);
                        
                        const estadoItem = document.createElement('div');
                        estadoItem.className = 'd-flex justify-content-between align-items-center mb-2';
                        estadoItem.innerHTML = `
                            <div>
                                <span class="badge bg-${getEstadoBadgeColor(estado.estado)} me-2">${formatEstadoName(estado.estado)}</span>
                                <small>${estado.cantidad} mensajes</small>
                            </div>
                            <span>${porcentaje}%</span>
                        `;
                        
                        contactosPorEstado.appendChild(estadoItem);
                    });
                } else {
                    contactosPorEstado.innerHTML = '<p class="text-muted small">No hay datos disponibles</p>';
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        mostrarError('Error al cargar las estadísticas del dashboard');
    }
}

/**
 * Carga los contactos recientes para mostrar en el dashboard
 */
async function cargarContactosRecientes() {
    try {
        const response = await fetchWithAuth('/api/admin/contactos/recientes');
        
        const contactosContainer = document.getElementById('contactosRecientes');
        contactosContainer.innerHTML = '';
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                data.data.forEach(contacto => {
                    const item = document.createElement('div');
                    item.className = 'list-group-item';
                    
                    const fecha = new Date(contacto.fecha_creacion);
                    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    
                    item.innerHTML = `
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${contacto.nombre}</h6>
                            <small class="text-muted">${fechaFormateada}</small>
                        </div>
                        <p class="mb-1">${contacto.email}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <span class="badge bg-${getServicioBadgeColor(contacto.servicio)}">${contacto.servicio || 'General'}</span>
                            </small>
                            <a href="contactos.html?id=${contacto.id}" class="btn btn-sm btn-outline-primary">Ver</a>
                        </div>
                    `;
                    
                    contactosContainer.appendChild(item);
                });
            } else {
                contactosContainer.innerHTML = '<p class="text-center text-muted">No hay contactos recientes</p>';
            }
        } else {
            throw new Error('Error al cargar contactos recientes');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('contactosRecientes').innerHTML = 
            '<div class="alert alert-danger">Error al cargar los contactos recientes</div>';
    }
}

/**
 * Muestra un mensaje de error en el dashboard
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(mensaje) {
    const alertaExistente = document.querySelector('.alert-danger');
    if (alertaExistente) {
        alertaExistente.remove();
    }
    
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-danger alert-dismissible fade show';
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.querySelector('main').prepend(alerta);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alerta);
        bsAlert.close();
    }, 5000);
}

/**
 * Devuelve el color de badge para un rol
 * @param {string} rol - Rol del usuario
 * @returns {string} - Clase de color para el badge
 */
function getRoleBadgeColor(rol) {
    switch (rol.toLowerCase()) {
        case 'admin':
            return 'danger';
        case 'editor':
            return 'warning';
        default:
            return 'info';
    }
}

/**
 * Formatea el nombre del rol para mostrar
 * @param {string} rol - Rol del usuario
 * @returns {string} - Nombre formateado
 */
function formatRoleName(rol) {
    switch (rol.toLowerCase()) {
        case 'admin':
            return 'Administrador';
        case 'editor':
            return 'Editor';
        default:
            return 'Usuario';
    }
}

/**
 * Devuelve el color de badge para un estado de contacto
 * @param {string} estado - Estado del contacto
 * @returns {string} - Clase de color para el badge
 */
function getEstadoBadgeColor(estado) {
    switch (estado.toLowerCase()) {
        case 'pendiente':
            return 'warning';
        case 'respondido':
            return 'success';
        case 'archivado':
            return 'secondary';
        default:
            return 'info';
    }
}

/**
 * Formatea el nombre del estado para mostrar
 * @param {string} estado - Estado del contacto
 * @returns {string} - Nombre formateado
 */
function formatEstadoName(estado) {
    switch (estado.toLowerCase()) {
        case 'pendiente':
            return 'Pendiente';
        case 'respondido':
            return 'Respondido';
        case 'archivado':
            return 'Archivado';
        default:
            return estado;
    }
}

/**
 * Devuelve el color de badge para un servicio
 * @param {string} servicio - Nombre del servicio
 * @returns {string} - Clase de color para el badge
 */
function getServicioBadgeColor(servicio) {
    if (!servicio) return 'secondary';
    
    switch (servicio.toLowerCase()) {
        case 'desarrollo web':
        case 'desarrollo-web':
            return 'primary';
        case 'seo & contenido':
        case 'seo-contenido':
            return 'success';
        case 'ux/ui & cro':
        case 'ux-ui-cro':
            return 'info';
        case 'paid media':
        case 'paid-media':
            return 'warning';
        case 'social media':
        case 'social-media':
            return 'danger';
        default:
            return 'secondary';
    }
}
