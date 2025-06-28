/**
 * Configuración del servicio de correo electrónico
 * Utiliza nodemailer para enviar correos desde Gmail a través de Hostinger
 */

const nodemailer = require('nodemailer');
const { logger } = require('../utilidades/logger');

// Crear transporte de correo electrónico reutilizable
const createTransporter = () => {
  try {
    // Verificar que las variables de entorno necesarias estén definidas
    const requiredVars = [
      'EMAIL_HOST', 
      'EMAIL_PORT', 
      'EMAIL_USER', 
      'EMAIL_PASSWORD',
      'EMAIL_FROM_NAME',
      'EMAIL_FROM_ADDRESS'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      logger.warn(`Configuración de correo incompleta. Faltan variables: ${missingVars.join(', ')}`);
      return null;
    }
    
    // Crear transporte con la configuración de Hostinger/Gmail
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Necesario en algunos casos para evitar errores de certificado
      }
    });
    
    // Verificar conexión
    transporter.verify(function(error, success) {
      if (error) {
        logger.error('Error en la configuración del servidor de correo:', error);
      } else {
        logger.info('Servidor de correo listo para enviar mensajes');
      }
    });
    
    return transporter;
  } catch (error) {
    logger.error('Error al crear el transporte de correo:', error);
    return null;
  }
};

/**
 * Envía un correo electrónico
 * @param {Object} options - Opciones del correo
 * @param {string} options.to - Destinatario
 * @param {string} options.subject - Asunto
 * @param {string} options.html - Contenido HTML
 * @param {string} [options.text] - Contenido texto plano (alternativa)
 * @returns {Promise} - Promesa con el resultado del envío
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      throw new Error('No se pudo crear el transporte de correo');
    }
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '') // Eliminar etiquetas HTML si no se proporciona texto plano
    };
    
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Correo enviado: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error al enviar correo:', error);
    throw error;
  }
};

/**
 * Genera una plantilla HTML para notificaciones de nuevos mensajes
 * @param {Object} contacto - Datos del mensaje de contacto
 * @returns {string} - HTML formateado
 */
const generarPlantillaNotificacion = (contacto) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #3498db; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Nuevo mensaje de contacto</h2>
      
      <div style="margin: 20px 0;">
        <p><strong>Nombre:</strong> ${contacto.nombre}</p>
        <p><strong>Email:</strong> ${contacto.email}</p>
        ${contacto.telefono ? `<p><strong>Teléfono:</strong> ${contacto.telefono}</p>` : ''}
        ${contacto.empresa ? `<p><strong>Empresa:</strong> ${contacto.empresa}</p>` : ''}
        ${contacto.servicio_nombre ? `<p><strong>Servicio:</strong> ${contacto.servicio_nombre}</p>` : ''}
        <p><strong>Fecha:</strong> ${new Date(contacto.fecha_creacion).toLocaleString()}</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <h3 style="margin-top: 0; color: #2c3e50;">Mensaje:</h3>
        <p style="white-space: pre-line;">${contacto.mensaje}</p>
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="${process.env.ADMIN_URL || 'http://localhost:3000/admin'}" 
           style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Ver en el panel de administración
        </a>
      </div>
      
      <div style="margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
        <p>Este es un mensaje automático del sistema de Ecos del SEO.</p>
      </div>
    </div>
  `;
};

/**
 * Genera una plantilla HTML para respuestas a mensajes
 * @param {Object} datos - Datos para la respuesta
 * @returns {string} - HTML formateado
 */
const generarPlantillaRespuesta = (datos) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #3498db; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Hola ${datos.nombre},</h2>
      
      <div style="margin: 20px 0; line-height: 1.6;">
        <p style="white-space: pre-line;">${datos.respuesta}</p>
      </div>
      
      <div style="margin-top: 30px;">
        <p>Saludos cordiales,<br>Equipo de Ecos del SEO</p>
      </div>
      
      <div style="margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
        <p>Este correo es una respuesta a tu consulta enviada a través de nuestro sitio web.</p>
      </div>
    </div>
  `;
};

module.exports = {
  sendEmail,
  generarPlantillaNotificacion,
  generarPlantillaRespuesta
};
