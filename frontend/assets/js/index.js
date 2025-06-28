// Importar configuración de la API
import { apiConfig, handleApiResponse } from './configuracion/api.config.js';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el formulario de contacto
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
});

/**
 * Maneja el envío del formulario de contacto
 * @param {Event} event - Evento de envío del formulario
 */
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
        // Mostrar indicador de carga
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Convertir FormData a objeto
        const formValues = {};
        formData.forEach((value, key) => {
            formValues[key] = value;
        });
        
        // Añadir campos adicionales necesarios para el backend
        formValues.estado = 'pendiente';
        formValues.prioridad = 'normal';
        
        // Enviar datos al backend
        const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.contact}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        });
        
        const data = await handleApiResponse(response);
        
        // Mostrar mensaje de éxito
        showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        showNotification(error.message || 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar el botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

/**
 * Muestra una notificación al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {'success'|'error'} type - Tipo de notificación
 */
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animación de entrada
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        
        // Eliminar del DOM después de la animación
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Añadir estilos para las notificaciones
const style = document.createElement('style');
style.textContent = `
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
        transform: translateY(-100%);
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
document.head.appendChild(style);