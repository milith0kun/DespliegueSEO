/**
 * Gestión de contactos - Panel de administración
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Proteger la página - accesible para admin y editor
        await protectPage(false); // false = no solo admin, cualquier usuario autenticado
        
        // Inicializar componentes
        await cargarContactos();
        configurarFiltros();
        configurarFormularios();
    } catch (error) {
        console.error('Error al inicializar página de contactos:', error);
    }
});

// Variables globales
let contactosData = [];
let paginaActual = 1;
const contactosPorPagina = 10;
let filtroEstado = '';
let filtroServicio = '';

/**
 * Carga la lista de contactos desde el backend
 */
async function cargarContactos() {
    try {
        // Construir URL con filtros y paginación
        let url = `/api/contactos?page=${paginaActual}&limit=${contactosPorPagina}`;
        if (filtroEstado) url += `&estado=${filtroEstado}`;
        if (filtroServicio) url += `&servicio=${filtroServicio}`;
        
        // Mostrar spinner de carga
        document.getElementById('spinnerContactos').classList.remove('d-none');
        
        const response = await fetchWithAuth(url);
        
        if (!response.ok) {
            throw new Error('Error al cargar contactos');
        }
        
        const data = await response.json();
        
        if (data.success) {
            contactosData = data.data;
            renderizarTablaContactos();
            actualizarPaginacion(data.pagination);
        } else {
            throw new Error(data.message || 'Error al cargar contactos');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar la lista de contactos');
    } finally {
        // Ocultar spinner de carga
        document.getElementById('spinnerContactos').classList.add('d-none');
    }
}

/**
 * Renderiza la tabla de contactos con los datos actuales
 */
function renderizarTablaContactos() {
    const tablaBody = document.getElementById('contactosTableBody');
    if (!tablaBody) return;
    
    tablaBody.innerHTML = '';
    
    if (contactosData.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay contactos registrados</td>
            </tr>
        `;
        return;
    }
    
    contactosData.forEach(contacto => {
        const tr = document.createElement('tr');
        
        // Formatear fecha
        const fecha = new Date(contacto.fecha_creacion);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        tr.innerHTML = `
            <td>${contacto.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div>
                        <div class="fw-bold">${contacto.nombre}</div>
                        <div class="small text-muted">${contacto.email}</div>
                        ${contacto.telefono ? `<div class="small text-muted">${contacto.telefono}</div>` : ''}
                    </div>
                </div>
            </td>
            <td><span class="badge bg-${getServicioBadgeColor(contacto.servicio)}">${contacto.servicio}</span></td>
            <td><span class="badge bg-${getEstadoBadgeColor(contacto.estado)}">${formatEstadoName(contacto.estado)}</span></td>
            <td>${fechaFormateada}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item btn-ver-contacto" href="#" data-id="${contacto.id}">
                            <i class="bi bi-eye me-2"></i> Ver detalles
                        </a></li>
                        <li><a class="dropdown-item btn-cambiar-estado" href="#" data-id="${contacto.id}" data-estado="${contacto.estado}">
                            <i class="bi bi-arrow-repeat me-2"></i> Cambiar estado
                        </a></li>
                        <li><a class="dropdown-item btn-agregar-nota" href="#" data-id="${contacto.id}">
                            <i class="bi bi-journal-text me-2"></i> Agregar nota
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item btn-eliminar text-danger" href="#" data-id="${contacto.id}">
                            <i class="bi bi-trash me-2"></i> Eliminar
                        </a></li>
                    </ul>
                </div>
            </td>
        `;
        
        tablaBody.appendChild(tr);
    });
    
    // Configurar eventos para los botones de acción
    configurarEventosAcciones();
}

/**
 * Actualiza la paginación según los datos recibidos
 */
function actualizarPaginacion(paginacion) {
    const paginacionElement = document.getElementById('paginacion');
    if (!paginacionElement) return;
    
    paginacionElement.innerHTML = '';
    
    const totalPaginas = paginacion.totalPages;
    paginaActual = paginacion.currentPage;
    
    // Botón anterior
    const btnAnterior = document.createElement('li');
    btnAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    btnAnterior.innerHTML = `
        <a class="page-link" href="#" aria-label="Anterior">
            <span aria-hidden="true">&laquo;</span>
        </a>
    `;
    btnAnterior.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActual > 1) {
            paginaActual--;
            cargarContactos();
        }
    });
    paginacionElement.appendChild(btnAnterior);
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${paginaActual === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        li.addEventListener('click', (e) => {
            e.preventDefault();
            paginaActual = i;
            cargarContactos();
        });
        
        paginacionElement.appendChild(li);
    }
    
    // Botón siguiente
    const btnSiguiente = document.createElement('li');
    btnSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    btnSiguiente.innerHTML = `
        <a class="page-link" href="#" aria-label="Siguiente">
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
    btnSiguiente.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActual < totalPaginas) {
            paginaActual++;
            cargarContactos();
        }
    });
    paginacionElement.appendChild(btnSiguiente);
}

/**
 * Configura los eventos para los botones de acción en la tabla
 */
function configurarEventosAcciones() {
    // Botones de ver detalles
    document.querySelectorAll('.btn-ver-contacto').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            verDetallesContacto(id);
        });
    });
    
    // Botones de cambiar estado
    document.querySelectorAll('.btn-cambiar-estado').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            const estadoActual = btn.getAttribute('data-estado');
            abrirModalCambiarEstado(id, estadoActual);
        });
    });
    
    // Botones de agregar nota
    document.querySelectorAll('.btn-agregar-nota').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            abrirModalAgregarNota(id);
        });
    });
    
    // Botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            confirmarEliminar(id);
        });
    });
}

/**
 * Configura los filtros de búsqueda
 */
function configurarFiltros() {
    // Filtro de estado
    const selectEstado = document.getElementById('filtroEstado');
    if (selectEstado) {
        selectEstado.addEventListener('change', () => {
            filtroEstado = selectEstado.value;
            paginaActual = 1; // Reiniciar paginación
            cargarContactos();
        });
    }
    
    // Filtro de servicio
    const selectServicio = document.getElementById('filtroServicio');
    if (selectServicio) {
        selectServicio.addEventListener('change', () => {
            filtroServicio = selectServicio.value;
            paginaActual = 1; // Reiniciar paginación
            cargarContactos();
        });
    }
    
    // Botón de limpiar filtros
    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', () => {
            if (selectEstado) selectEstado.value = '';
            if (selectServicio) selectServicio.value = '';
            filtroEstado = '';
            filtroServicio = '';
            paginaActual = 1;
            cargarContactos();
        });
    }
    
    // Búsqueda por texto
    const inputBusqueda = document.getElementById('busquedaContacto');
    const btnBuscar = document.getElementById('btnBuscar');
    
    if (inputBusqueda && btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const busqueda = inputBusqueda.value.trim();
            // Aquí implementaríamos la búsqueda por texto
            // Por ahora, solo recargaremos los contactos
            cargarContactos();
        });
        
        // Buscar al presionar Enter
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                btnBuscar.click();
            }
        });
    }
}

/**
 * Configura los formularios
 */
function configurarFormularios() {
    // Formulario de cambiar estado
    const formCambiarEstado = document.getElementById('formCambiarEstado');
    if (formCambiarEstado) {
        formCambiarEstado.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const contactoId = formCambiarEstado.getAttribute('data-id');
            const nuevoEstado = formCambiarEstado.elements['estado'].value;
            
            try {
                const response = await fetchWithAuth(`/api/contactos/${contactoId}/estado`, {
                    method: 'PUT',
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
                
                if (!response.ok) {
                    throw new Error('Error al cambiar estado');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // Cerrar modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCambiarEstado'));
                    modal.hide();
                    
                    // Recargar contactos
                    await cargarContactos();
                    
                    mostrarMensaje('Estado actualizado correctamente', 'success');
                } else {
                    throw new Error(data.message || 'Error al cambiar estado');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarError('Error al cambiar el estado del contacto');
            }
        });
    }
    
    // Formulario de agregar nota
    const formAgregarNota = document.getElementById('formAgregarNota');
    if (formAgregarNota) {
        formAgregarNota.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const contactoId = formAgregarNota.getAttribute('data-id');
            const nota = formAgregarNota.elements['nota'].value;
            
            try {
                const response = await fetchWithAuth(`/api/contactos/${contactoId}/notas`, {
                    method: 'POST',
                    body: JSON.stringify({ nota }),
                });
                
                if (!response.ok) {
                    throw new Error('Error al agregar nota');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // Cerrar modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarNota'));
                    modal.hide();
                    
                    // Limpiar formulario
                    formAgregarNota.reset();
                    
                    mostrarMensaje('Nota agregada correctamente', 'success');
                } else {
                    throw new Error(data.message || 'Error al agregar nota');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarError('Error al agregar la nota');
            }
        });
    }
}

/**
 * Abre el modal para ver detalles de un contacto
 * @param {string} id - ID del contacto
 */
async function verDetallesContacto(id) {
    try {
        const response = await fetchWithAuth(`/api/contactos/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener detalles del contacto');
        }
        
        const data = await response.json();
        
        if (data.success) {
            const contacto = data.data;
            
            // Rellenar modal con los datos del contacto
            const modalDetalles = document.getElementById('modalDetallesContacto');
            
            // Información básica
            modalDetalles.querySelector('#detalleNombre').textContent = contacto.nombre;
            modalDetalles.querySelector('#detalleEmail').textContent = contacto.email;
            modalDetalles.querySelector('#detalleTelefono').textContent = contacto.telefono || 'No proporcionado';
            modalDetalles.querySelector('#detalleServicio').textContent = contacto.servicio;
            modalDetalles.querySelector('#detalleEstado').textContent = formatEstadoName(contacto.estado);
            modalDetalles.querySelector('#detalleEstado').className = `badge bg-${getEstadoBadgeColor(contacto.estado)}`;
            
            // Fecha formateada
            const fecha = new Date(contacto.fecha_creacion);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            modalDetalles.querySelector('#detalleFecha').textContent = fechaFormateada;
            
            // Mensaje
            modalDetalles.querySelector('#detalleMensaje').textContent = contacto.mensaje;
            
            // Notas (si existen)
            const notasContainer = modalDetalles.querySelector('#detalleNotas');
            notasContainer.innerHTML = '';
            
            if (contacto.notas) {
                let notas = [];
                try {
                    notas = JSON.parse(contacto.notas);
                } catch (e) {
                    console.error('Error al parsear notas:', e);
                }
                
                if (notas.length > 0) {
                    notas.forEach(nota => {
                        const fechaNota = new Date(nota.fecha);
                        const fechaNotaFormateada = fechaNota.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        const notaElement = document.createElement('div');
                        notaElement.className = 'card mb-2';
                        notaElement.innerHTML = `
                            <div class="card-body">
                                <p class="card-text">${nota.texto}</p>
                                <p class="card-text"><small class="text-muted">Por ${nota.usuario} - ${fechaNotaFormateada}</small></p>
                            </div>
                        `;
                        
                        notasContainer.appendChild(notaElement);
                    });
                } else {
                    notasContainer.innerHTML = '<p class="text-muted">No hay notas para este contacto</p>';
                }
            } else {
                notasContainer.innerHTML = '<p class="text-muted">No hay notas para este contacto</p>';
            }
            
            // Mostrar modal
            const modal = new bootstrap.Modal(modalDetalles);
            modal.show();
        } else {
            throw new Error(data.message || 'Error al obtener detalles del contacto');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar los detalles del contacto');
    }
}

/**
 * Abre el modal para cambiar el estado de un contacto
 * @param {string} id - ID del contacto
 * @param {string} estadoActual - Estado actual del contacto
 */
function abrirModalCambiarEstado(id, estadoActual) {
    const modal = document.getElementById('modalCambiarEstado');
    const form = document.getElementById('formCambiarEstado');
    
    form.setAttribute('data-id', id);
    form.elements['estado'].value = estadoActual;
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/**
 * Abre el modal para agregar una nota a un contacto
 * @param {string} id - ID del contacto
 */
function abrirModalAgregarNota(id) {
    const modal = document.getElementById('modalAgregarNota');
    const form = document.getElementById('formAgregarNota');
    
    form.setAttribute('data-id', id);
    form.reset();
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/**
 * Muestra un diálogo de confirmación para eliminar un contacto
 * @param {string} id - ID del contacto a eliminar
 */
function confirmarEliminar(id) {
    const contacto = contactosData.find(c => c.id == id);
    if (!contacto) return;
    
    // Verificar si el usuario tiene permisos para eliminar
    getUserData().then(userData => {
        if (userData.rol !== 'admin') {
            mostrarError('No tienes permisos para eliminar contactos');
            return;
        }
        
        if (confirm(`¿Estás seguro de que deseas eliminar el contacto de ${contacto.nombre}?`)) {
            eliminarContacto(id);
        }
    }).catch(error => {
        console.error('Error al verificar permisos:', error);
        mostrarError('Error al verificar permisos');
    });
}

/**
 * Elimina un contacto
 * @param {string} id - ID del contacto a eliminar
 */
async function eliminarContacto(id) {
    try {
        const response = await fetchWithAuth(`/api/contactos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar contacto');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Recargar contactos
            await cargarContactos();
            
            mostrarMensaje('Contacto eliminado correctamente', 'success');
        } else {
            throw new Error(data.message || 'Error al eliminar contacto');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar el contacto');
    }
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(mensaje) {
    mostrarMensaje(mensaje, 'danger');
}

/**
 * Muestra un mensaje en la interfaz
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje (success, danger, warning, info)
 */
function mostrarMensaje(mensaje, tipo) {
    const alertaExistente = document.querySelector('.alert');
    if (alertaExistente) {
        alertaExistente.remove();
    }
    
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
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
 * Devuelve el color de badge para un estado
 * @param {string} estado - Estado del contacto
 * @returns {string} - Clase de color para el badge
 */
function getEstadoBadgeColor(estado) {
    switch (estado.toLowerCase()) {
        case 'pendiente':
            return 'warning';
        case 'en_proceso':
            return 'info';
        case 'completado':
            return 'success';
        case 'cancelado':
            return 'danger';
        default:
            return 'secondary';
    }
}

/**
 * Devuelve el color de badge para un servicio
 * @param {string} servicio - Servicio solicitado
 * @returns {string} - Clase de color para el badge
 */
function getServicioBadgeColor(servicio) {
    switch (servicio.toLowerCase()) {
        case 'seo':
            return 'primary';
        case 'sem':
            return 'success';
        case 'diseño_web':
            return 'info';
        case 'redes_sociales':
            return 'warning';
        default:
            return 'secondary';
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
        case 'en_proceso':
            return 'En proceso';
        case 'completado':
            return 'Completado';
        case 'cancelado':
            return 'Cancelado';
        default:
            return estado;
    }
}
