/**
 * Configuración específica para las páginas de servicios
 */

import { apiConfig } from './api.config.js';

export const serviciosConfig = {
    // Endpoints específicos para servicios
    endpoints: {
        // Endpoint para enviar solicitudes de contacto desde páginas de servicios
        solicitudServicio: '/servicios/solicitud',
        
        // Endpoints de administración
        admin: {
            login: '/admin/login',
            mensajes: '/admin/mensajes',
            mensajesPorServicio: '/admin/mensajes/servicio',
            responderMensaje: '/admin/mensajes/responder'
        }
    },
    
    // Tipos de servicios disponibles
    tiposServicio: {
        desarrolloWeb: 'desarrollo-web',
        seo: 'seo-contenido',
        uxUi: 'ux-ui-cro',
        paidMedia: 'paid-media',
        socialMedia: 'social-media',
        softwareMedida: 'software-medida',
        tradingFinanzas: 'trading-finanzas'
    },
    
    // Configuración de formularios por servicio
    formularios: {
        camposComunes: [
            { id: 'nombre', label: 'Nombre', tipo: 'text', requerido: true },
            { id: 'email', label: 'Email', tipo: 'email', requerido: true },
            { id: 'telefono', label: 'Teléfono', tipo: 'tel', requerido: false },
            { id: 'empresa', label: 'Empresa', tipo: 'text', requerido: false },
            { id: 'mensaje', label: 'Mensaje', tipo: 'textarea', requerido: true }
        ],
        
        // Campos específicos por servicio (adicionales a los comunes)
        camposEspecificos: {
            'desarrollo-web': [
                { id: 'tipoWeb', label: 'Tipo de Web', tipo: 'select', opciones: ['Corporativa', 'E-commerce', 'Landing Page', 'Aplicación Web'], requerido: true }
            ],
            'seo-contenido': [
                { id: 'urlSitio', label: 'URL de su sitio web', tipo: 'url', requerido: false }
            ],
            'ux-ui-cro': [
                { id: 'objetivoConversion', label: 'Principal objetivo de conversión', tipo: 'text', requerido: true }
            ]
            // Agregar campos específicos para otros servicios según sea necesario
        }
    }
};

/**
 * Obtiene la configuración del formulario para un servicio específico
 * @param {string} tipoServicio - Tipo de servicio
 * @returns {Array} - Array con todos los campos del formulario
 */
export function obtenerCamposFormulario(tipoServicio) {
    const camposComunes = serviciosConfig.formularios.camposComunes;
    const camposEspecificos = serviciosConfig.formularios.camposEspecificos[tipoServicio] || [];
    
    return [...camposComunes, ...camposEspecificos];
}

/**
 * Envía una solicitud de servicio al backend
 * @param {Object} datos - Datos del formulario
 * @param {string} tipoServicio - Tipo de servicio solicitado
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export async function enviarSolicitudServicio(datos, tipoServicio) {
    try {
        const response = await fetch(`${apiConfig.baseUrl}${serviciosConfig.endpoints.solicitudServicio}`, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify({
                ...datos,
                tipoServicio
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al enviar la solicitud');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en solicitud de servicio:', error);
        throw error;
    }
}
