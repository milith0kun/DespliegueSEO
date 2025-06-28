// Importar configuraciones
import { serviciosConfig, obtenerCamposFormulario, enviarSolicitudServicio } from './configuracion/servicios.config.js';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el tipo de servicio actual basado en la URL
    const tipoServicio = obtenerTipoServicioActual();
    
    // Inicializar el formulario de contacto específico para el servicio
    inicializarFormularioServicio(tipoServicio);
    
    // Inicializar otros elementos interactivos en la página
    inicializarElementosInteractivos();
});

/**
 * Obtiene el tipo de servicio actual basado en la URL
 * @returns {string} - Tipo de servicio
 */
function obtenerTipoServicioActual() {
    const rutaActual = window.location.pathname;
    const nombreArchivo = rutaActual.split('/').pop().replace('.html', '');
    
    return nombreArchivo || 'general';
}

/**
 * Inicializa el formulario de contacto para el servicio actual
 * @param {string} tipoServicio - Tipo de servicio
 */
function inicializarFormularioServicio(tipoServicio) {
    // Buscar la sección de contacto
    const seccionContacto = document.getElementById('contacto');
    
    if (!seccionContacto) return;
    
    // Verificar si ya existe un formulario en la sección
    let formularioExistente = seccionContacto.querySelector('form');
    
    if (!formularioExistente) {
        // Si no existe un formulario, crear uno nuevo
        formularioExistente = crearFormularioServicio(tipoServicio);
        
        // Buscar el contenedor adecuado para insertar el formulario
        const contenedor = seccionContacto.querySelector('.container') || seccionContacto;
        contenedor.appendChild(formularioExistente);
    } else {
        // Si ya existe un formulario, asegurarse de que tenga los campos correctos
        actualizarFormularioExistente(formularioExistente, tipoServicio);
    }
    
    // Agregar event listener para el envío del formulario
    formularioExistente.addEventListener('submit', function(event) {
        event.preventDefault();
        manejarEnvioFormulario(event.target, tipoServicio);
    });
}

/**
 * Crea un nuevo formulario para el servicio especificado
 * @param {string} tipoServicio - Tipo de servicio
 * @returns {HTMLFormElement} - Elemento formulario creado
 */
function crearFormularioServicio(tipoServicio) {
    const form = document.createElement('form');
    form.className = 'service-form';
    form.id = `${tipoServicio}-form`;
    
    // Obtener los campos para este tipo de servicio
    const campos = obtenerCamposFormulario(tipoServicio);
    
    // Crear los campos del formulario
    campos.forEach(campo => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        // Crear label
        const label = document.createElement('label');
        label.setAttribute('for', campo.id);
        label.textContent = campo.label + (campo.requerido ? ' *' : '');
        formGroup.appendChild(label);
        
        // Crear input o textarea según el tipo
        let input;
        if (campo.tipo === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 4;
        } else if (campo.tipo === 'select') {
            input = document.createElement('select');
            // Agregar opciones al select
            if (campo.opciones && Array.isArray(campo.opciones)) {
                // Opción por defecto
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Seleccione una opción';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                input.appendChild(defaultOption);
                
                // Resto de opciones
                campo.opciones.forEach(opcion => {
                    const option = document.createElement('option');
                    option.value = opcion.toLowerCase().replace(/\\s+/g, '-');
                    option.textContent = opcion;
                    input.appendChild(option);
                });
            }
        } else {
            input = document.createElement('input');
            input.type = campo.tipo;
        }
        
        // Configurar atributos comunes
        input.id = campo.id;
        input.name = campo.id;
        if (campo.requerido) input.required = true;
        input.placeholder = `Ingrese su ${campo.label.toLowerCase()}`;
        
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });
    
    // Agregar botón de envío
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn-primary';
    
    // Icono para el botón
    const icon = document.createElement('i');
    icon.className = 'fas fa-paper-plane';
    submitButton.appendChild(icon);
    
    // Texto para el botón
    const span = document.createElement('span');
    span.textContent = ' Enviar solicitud';
    submitButton.appendChild(span);
    
    form.appendChild(submitButton);
    
    return form;
}

/**
 * Actualiza un formulario existente para asegurar que tenga los campos correctos
 * @param {HTMLFormElement} formulario - Formulario existente
 * @param {string} tipoServicio - Tipo de servicio
 */
function actualizarFormularioExistente(formulario, tipoServicio) {
    // Obtener los campos que debería tener este formulario
    const camposNecesarios = obtenerCamposFormulario(tipoServicio);
    
    // Verificar si faltan campos y agregarlos
    camposNecesarios.forEach(campo => {
        const inputExistente = formulario.querySelector(`#${campo.id}`);
        
        if (!inputExistente) {
            // Si el campo no existe, crear un nuevo grupo de formulario
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            // Crear label
            const label = document.createElement('label');
            label.setAttribute('for', campo.id);
            label.textContent = campo.label + (campo.requerido ? ' *' : '');
            formGroup.appendChild(label);
            
            // Crear input según el tipo
            let input;
            if (campo.tipo === 'textarea') {
                input = document.createElement('textarea');
                input.rows = 4;
            } else if (campo.tipo === 'select') {
                input = document.createElement('select');
                // Agregar opciones al select
                if (campo.opciones && Array.isArray(campo.opciones)) {
                    // Opción por defecto
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Seleccione una opción';
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    input.appendChild(defaultOption);
                    
                    // Resto de opciones
                    campo.opciones.forEach(opcion => {
                        const option = document.createElement('option');
                        option.value = opcion.toLowerCase().replace(/\\s+/g, '-');
                        option.textContent = opcion;
                        input.appendChild(option);
                    });
                }
            } else {
                input = document.createElement('input');
                input.type = campo.tipo;
            }
            
            // Configurar atributos comunes
            input.id = campo.id;
            input.name = campo.id;
            if (campo.requerido) input.required = true;
            input.placeholder = `Ingrese su ${campo.label.toLowerCase()}`;
            
            formGroup.appendChild(input);
            
            // Insertar antes del botón de envío
            const submitButton = formulario.querySelector('button[type="submit"]');
            if (submitButton) {
                formulario.insertBefore(formGroup, submitButton);
            } else {
                formulario.appendChild(formGroup);
            }
        }
    });
}

/**
 * Maneja el envío del formulario de servicio
 * @param {HTMLFormElement} formulario - Formulario enviado
 * @param {string} tipoServicio - Tipo de servicio
 */
async function manejarEnvioFormulario(formulario, tipoServicio) {
    // Obtener el botón de envío
    const submitButton = formulario.querySelector('button[type="submit"]');
    const originalButtonContent = submitButton.innerHTML;
    
    try {
        // Mostrar indicador de carga
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Recopilar datos del formulario
        const formData = new FormData(formulario);
        const datos = {};
        
        formData.forEach((valor, clave) => {
            datos[clave] = valor;
        });
        
        // Enviar solicitud al backend
        const respuesta = await enviarSolicitudServicio(datos, tipoServicio);
        
        // Mostrar mensaje de éxito
        mostrarNotificacion('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Limpiar formulario
        formulario.reset();
        
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        mostrarNotificacion(error.message || 'Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar el botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
    }
}

/**
 * Inicializa otros elementos interactivos en la página
 */
function inicializarElementosInteractivos() {
    // Inicializar botones de CTA
    const botonesContacto = document.querySelectorAll('a[href="#contacto"]');
    botonesContacto.forEach(boton => {
        boton.addEventListener('click', function(event) {
            event.preventDefault();
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/**
 * Muestra una notificación al usuario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {'success'|'error'} tipo - Tipo de notificación
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.textContent = mensaje;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const estilos = document.createElement('style');
        estilos.id = 'notification-styles';
        estilos.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                max-width: 300px;
            }
            
            .notification.success {
                background-color: #4CAF50;
            }
            
            .notification.error {
                background-color: #F44336;
            }
        `;
        document.head.appendChild(estilos);
    }
    
    // Animación de entrada
    requestAnimationFrame(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateY(0)';
    });
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateY(-20px)';
        
        // Eliminar del DOM después de la animación
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 5000);
}
