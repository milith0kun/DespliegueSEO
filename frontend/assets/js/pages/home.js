/**
 * Funcionalidad del formulario de contacto - Página principal
 */

document.addEventListener('DOMContentLoaded', function() {
    inicializarFormularioContacto();
});

/**
 * Inicializa el formulario de contacto
 */
function inicializarFormularioContacto() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.warn('Formulario de contacto no encontrado');
        return;
    }
    
    form.addEventListener('submit', manejarEnvioFormulario);
    
    // Agregar validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validarCampo);
        input.addEventListener('input', limpiarErrores);
    });
}

/**
 * Maneja el envío del formulario
 */
async function manejarEnvioFormulario(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Validar formulario
        if (!validarFormulario(form)) {
            return;
        }
        
        // Mostrar estado de carga
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        
        // Recopilar datos del formulario
        const formData = new FormData(form);
        const datos = {
            nombre: formData.get('name'),
            email: formData.get('email'),
            telefono: formData.get('phone'),
            empresa: formData.get('company'),
            mensaje: formData.get('message'),
            interes_servicio: 'general' // Puedes agregar un campo select para esto
        };
        
        // Enviar datos al backend
        const response = await fetch('http://localhost:8080/api/contactos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            // Mostrar mensaje de éxito
            mostrarMensaje('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            
            // Limpiar formulario
            form.reset();
            
            // Opcional: Enviar evento de conversión a Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form'
                });
            }
            
        } else {
            mostrarMensaje(resultado.message || 'Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        }
        
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        mostrarMensaje('Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Valida todo el formulario
 */
function validarFormulario(form) {
    let esValido = true;
    
    // Limpiar errores previos
    limpiarTodosLosErrores(form);
    
    // Validar campos requeridos
    const camposRequeridos = form.querySelectorAll('[required]');
    camposRequeridos.forEach(campo => {
        if (!validarCampo({ target: campo })) {
            esValido = false;
        }
    });
    
    return esValido;
}

/**
 * Valida un campo individual
 */
function validarCampo(event) {
    const campo = event.target;
    const valor = campo.value.trim();
    let esValido = true;
    let mensaje = '';
    
    // Limpiar errores previos
    limpiarErrorCampo(campo);
    
    // Validar campo requerido
    if (campo.hasAttribute('required') && !valor) {
        esValido = false;
        mensaje = 'Este campo es requerido';
    }
    
    // Validaciones específicas por tipo
    if (valor && campo.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
            esValido = false;
            mensaje = 'Ingresa un email válido';
        }
    }
    
    if (valor && campo.type === 'tel') {
        const telefonoRegex = /^[+]?[0-9\s\-()]{9,}$/;
        if (!telefonoRegex.test(valor)) {
            esValido = false;
            mensaje = 'Ingresa un teléfono válido';
        }
    }
    
    if (valor && campo.name === 'name') {
        if (valor.length < 2) {
            esValido = false;
            mensaje = 'El nombre debe tener al menos 2 caracteres';
        }
    }
    
    if (valor && campo.name === 'message') {
        if (valor.length < 10) {
            esValido = false;
            mensaje = 'El mensaje debe tener al menos 10 caracteres';
        }
    }
    
    // Mostrar error si existe
    if (!esValido) {
        mostrarErrorCampo(campo, mensaje);
    }
    
    return esValido;
}

/**
 * Muestra error en un campo específico
 */
function mostrarErrorCampo(campo, mensaje) {
    campo.classList.add('error');
    
    // Crear elemento de error si no existe
    let errorElement = campo.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        campo.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = mensaje;
}

/**
 * Limpia errores de un campo específico
 */
function limpiarErrorCampo(campo) {
    campo.classList.remove('error');
    const errorElement = campo.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Limpia errores de todos los campos
 */
function limpiarTodosLosErrores(form) {
    const campos = form.querySelectorAll('input, textarea');
    campos.forEach(limpiarErrorCampo);
}

/**
 * Limpia errores cuando el usuario empieza a escribir
 */
function limpiarErrores(event) {
    const campo = event.target;
    if (campo.classList.contains('error')) {
        limpiarErrorCampo(campo);
    }
}

/**
 * Muestra mensajes de notificación
 */
function mostrarMensaje(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notification notification-${tipo}`;
    notificacion.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${mensaje}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.classList.remove('show');
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Exportar funciones para uso global si es necesario
window.ContactForm = {
    mostrarMensaje,
    validarFormulario
};