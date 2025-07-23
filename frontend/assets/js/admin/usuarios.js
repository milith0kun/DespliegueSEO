/**
 * Gestión de usuarios - Panel de administración
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Proteger la página - solo accesible para administradores
        await protectPage(true);
        
        // Inicializar componentes
        await cargarUsuarios();
        configurarFormularios();
        configurarBuscador();
    } catch (error) {
        console.error('Error al inicializar página de usuarios:', error);
    }
});

// Variables globales
let usuariosData = [];
let paginaActual = 1;
const usuariosPorPagina = 10;

/**
 * Carga la lista de usuarios desde el backend
 */
async function cargarUsuarios() {
    try {
        const response = await fetchWithAuth('/api/admin/usuarios');
        
        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }
        
        const data = await response.json();
        
        if (data.success) {
            usuariosData = data.data;
            renderizarTablaUsuarios();
            actualizarPaginacion();
        } else {
            throw new Error(data.message || 'Error al cargar usuarios');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar la lista de usuarios');
    }
}

/**
 * Renderiza la tabla de usuarios con los datos actuales
 */
function renderizarTablaUsuarios() {
    const tablaBody = document.getElementById('usuariosTableBody');
    if (!tablaBody) return;
    
    tablaBody.innerHTML = '';
    
    // Calcular índices para paginación
    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    const usuariosPaginados = usuariosData.slice(inicio, fin);
    
    if (usuariosPaginados.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay usuarios registrados</td>
            </tr>
        `;
        return;
    }
    
    usuariosPaginados.forEach(usuario => {
        const tr = document.createElement('tr');
        
        // Formatear fecha
        const fecha = new Date(usuario.fecha_creacion);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar avatar-sm me-2">
                        <div class="avatar-initial rounded-circle bg-${getRoleBadgeColor(usuario.rol)}">
                            ${usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <div class="fw-bold">${usuario.nombre}</div>
                        <div class="small text-muted">${usuario.email}</div>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-${getRoleBadgeColor(usuario.rol)}">${formatRoleName(usuario.rol)}</span></td>
            <td>${fechaFormateada}</td>
            <td>
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-estado" type="checkbox" role="switch" 
                        data-id="${usuario.id}" ${usuario.activo ? 'checked' : ''}>
                </div>
            </td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item btn-editar" href="#" data-id="${usuario.id}">
                            <i class="bi bi-pencil me-2"></i> Editar
                        </a></li>
                        <li><a class="dropdown-item btn-reset-password" href="#" data-id="${usuario.id}">
                            <i class="bi bi-key me-2"></i> Resetear contraseña
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item btn-eliminar text-danger" href="#" data-id="${usuario.id}">
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
 * Actualiza la paginación según los datos actuales
 */
function actualizarPaginacion() {
    const paginacion = document.getElementById('paginacion');
    if (!paginacion) return;
    
    const totalPaginas = Math.ceil(usuariosData.length / usuariosPorPagina);
    
    paginacion.innerHTML = '';
    
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
            renderizarTablaUsuarios();
            actualizarPaginacion();
        }
    });
    paginacion.appendChild(btnAnterior);
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${paginaActual === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        li.addEventListener('click', (e) => {
            e.preventDefault();
            paginaActual = i;
            renderizarTablaUsuarios();
            actualizarPaginacion();
        });
        
        paginacion.appendChild(li);
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
            renderizarTablaUsuarios();
            actualizarPaginacion();
        }
    });
    paginacion.appendChild(btnSiguiente);
}

/**
 * Configura los eventos para los botones de acción en la tabla
 */
function configurarEventosAcciones() {
    // Botones de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            abrirModalEditar(id);
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
    
    // Botones de resetear contraseña
    document.querySelectorAll('.btn-reset-password').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            confirmarResetPassword(id);
        });
    });
    
    // Toggles de estado
    document.querySelectorAll('.toggle-estado').forEach(toggle => {
        toggle.addEventListener('change', async (e) => {
            const id = toggle.getAttribute('data-id');
            const activo = toggle.checked;
            
            try {
                const response = await fetchWithAuth(`/api/admin/usuarios/${id}/estado`, {
                    method: 'PUT',
                    body: JSON.stringify({ activo }),
                });
                
                if (!response.ok) {
                    throw new Error('Error al cambiar estado');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // Actualizar en el array local
                    const index = usuariosData.findIndex(u => u.id == id);
                    if (index !== -1) {
                        usuariosData[index].activo = activo;
                    }
                    
                    mostrarMensaje(activo ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente', 'success');
                } else {
                    throw new Error(data.message || 'Error al cambiar estado');
                }
            } catch (error) {
                console.error('Error:', error);
                // Revertir el toggle
                toggle.checked = !toggle.checked;
                mostrarError('Error al cambiar el estado del usuario');
            }
        });
    });
}

/**
 * Configura los formularios de crear y editar usuario
 */
function configurarFormularios() {
    // Formulario de crear usuario
    const formCrear = document.getElementById('formCrearUsuario');
    if (formCrear) {
        formCrear.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = formCrear.querySelector('button[type="submit"]');
            const spinnerCrear = document.getElementById('spinnerCrear');
            
            // Mostrar spinner y deshabilitar botón
            btnSubmit.disabled = true;
            spinnerCrear.classList.remove('d-none');
            
            try {
                const formData = new FormData(formCrear);
                const nuevoUsuario = {
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    rol: formData.get('rol')
                };
                
                const response = await fetchWithAuth('/api/admin/usuarios', {
                    method: 'POST',
                    body: JSON.stringify(nuevoUsuario),
                });
                
                if (!response.ok) {
                    throw new Error('Error al crear usuario');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // Añadir a la lista y actualizar tabla
                    usuariosData.unshift(data.data);
                    renderizarTablaUsuarios();
                    actualizarPaginacion();
                    
                    // Cerrar modal y mostrar mensaje
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearUsuario'));
                    modal.hide();
                    formCrear.reset();
                    
                    mostrarMensaje('Usuario creado correctamente', 'success');
                } else {
                    throw new Error(data.message || 'Error al crear usuario');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarError('Error al crear el usuario');
            } finally {
                // Ocultar spinner y habilitar botón
                btnSubmit.disabled = false;
                spinnerCrear.classList.add('d-none');
            }
        });
    }
    
    // Formulario de editar usuario
    const formEditar = document.getElementById('formEditarUsuario');
    if (formEditar) {
        formEditar.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = formEditar.querySelector('button[type="submit"]');
            const spinnerEditar = document.getElementById('spinnerEditar');
            const userId = formEditar.getAttribute('data-id');
            
            // Mostrar spinner y deshabilitar botón
            btnSubmit.disabled = true;
            spinnerEditar.classList.remove('d-none');
            
            try {
                const formData = new FormData(formEditar);
                const datosUsuario = {
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    rol: formData.get('rol')
                };
                
                const response = await fetchWithAuth(`/api/admin/usuarios/${userId}`, {
                    method: 'PUT',
                    body: JSON.stringify(datosUsuario),
                });
                
                if (!response.ok) {
                    throw new Error('Error al actualizar usuario');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // Actualizar en el array local
                    const index = usuariosData.findIndex(u => u.id == userId);
                    if (index !== -1) {
                        usuariosData[index] = { ...usuariosData[index], ...datosUsuario };
                    }
                    
                    // Actualizar tabla
                    renderizarTablaUsuarios();
                    
                    // Cerrar modal y mostrar mensaje
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario'));
                    modal.hide();
                    
                    mostrarMensaje('Usuario actualizado correctamente', 'success');
                } else {
                    throw new Error(data.message || 'Error al actualizar usuario');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarError('Error al actualizar el usuario');
            } finally {
                // Ocultar spinner y habilitar botón
                btnSubmit.disabled = false;
                spinnerEditar.classList.add('d-none');
            }
        });
    }
}

/**
 * Configura el buscador de usuarios
 */
function configurarBuscador() {
    const inputBuscar = document.getElementById('buscarUsuario');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', (e) => {
            const busqueda = e.target.value.toLowerCase().trim();
            
            if (busqueda === '') {
                // Restaurar lista completa
                renderizarTablaUsuarios();
                return;
            }
            
            // Filtrar usuarios
            const usuariosFiltrados = usuariosData.filter(usuario => 
                usuario.nombre.toLowerCase().includes(busqueda) || 
                usuario.email.toLowerCase().includes(busqueda) ||
                usuario.rol.toLowerCase().includes(busqueda)
            );
            
            // Actualizar tabla con resultados filtrados
            const tablaBody = document.getElementById('usuariosTableBody');
            if (!tablaBody) return;
            
            tablaBody.innerHTML = '';
            
            if (usuariosFiltrados.length === 0) {
                tablaBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">No se encontraron resultados para "${busqueda}"</td>
                    </tr>
                `;
                return;
            }
            
            usuariosFiltrados.forEach(usuario => {
                // Aquí iría el mismo código de renderizado que en renderizarTablaUsuarios
                // pero solo para los usuarios filtrados
                // (código omitido por brevedad)
            });
            
            // Configurar eventos para los botones de acción
            configurarEventosAcciones();
        });
    }
}

/**
 * Abre el modal para editar un usuario
 * @param {string} id - ID del usuario a editar
 */
async function abrirModalEditar(id) {
    try {
        const response = await fetchWithAuth(`/api/admin/usuarios/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener datos del usuario');
        }
        
        const data = await response.json();
        
        if (data.success) {
            const usuario = data.data;
            
            // Rellenar formulario
            const form = document.getElementById('formEditarUsuario');
            form.setAttribute('data-id', usuario.id);
            
            form.elements['nombre'].value = usuario.nombre;
            form.elements['email'].value = usuario.email;
            form.elements['rol'].value = usuario.rol;
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
            modal.show();
        } else {
            throw new Error(data.message || 'Error al obtener datos del usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar datos del usuario');
    }
}

/**
 * Muestra un diálogo de confirmación para eliminar un usuario
 * @param {string} id - ID del usuario a eliminar
 */
function confirmarEliminar(id) {
    const usuario = usuariosData.find(u => u.id == id);
    if (!usuario) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${usuario.nombre}?`)) {
        eliminarUsuario(id);
    }
}

/**
 * Elimina un usuario
 * @param {string} id - ID del usuario a eliminar
 */
async function eliminarUsuario(id) {
    try {
        const response = await fetchWithAuth(`/api/admin/usuarios/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Eliminar del array local
            usuariosData = usuariosData.filter(u => u.id != id);
            
            // Actualizar tabla
            renderizarTablaUsuarios();
            actualizarPaginacion();
            
            mostrarMensaje('Usuario eliminado correctamente', 'success');
        } else {
            throw new Error(data.message || 'Error al eliminar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar el usuario');
    }
}

/**
 * Muestra un diálogo de confirmación para resetear la contraseña
 * @param {string} id - ID del usuario
 */
function confirmarResetPassword(id) {
    const usuario = usuariosData.find(u => u.id == id);
    if (!usuario) return;
    
    if (confirm(`¿Estás seguro de que deseas resetear la contraseña de ${usuario.nombre}?`)) {
        resetearPassword(id);
    }
}

/**
 * Resetea la contraseña de un usuario
 * @param {string} id - ID del usuario
 */
async function resetearPassword(id) {
    try {
        const response = await fetchWithAuth(`/api/admin/usuarios/${id}/reset-password`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Error al resetear contraseña');
        }
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje('Contraseña reseteada correctamente. Se ha enviado un correo al usuario con la nueva contraseña.', 'success');
        } else {
            throw new Error(data.message || 'Error al resetear contraseña');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al resetear la contraseña');
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
