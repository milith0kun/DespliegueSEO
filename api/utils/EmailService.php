<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../config/email_config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $mail;
    
    public function __construct() {
        $this->mail = new PHPMailer(true);
        $this->configurarSMTP();
    }
    
    /**
     * Configurar el servidor SMTP
     */
    private function configurarSMTP() {
        try {
            // Configuración del servidor
            $this->mail->isSMTP();
            $this->mail->Host = SMTP_HOST;
            $this->mail->SMTPAuth = true;
            $this->mail->Username = SMTP_USERNAME;
            $this->mail->Password = SMTP_PASSWORD;
            $this->mail->Port = SMTP_PORT;
            
            // Configuración de seguridad
            if (SMTP_PORT == 465) {
                $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } else {
                $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }
            
            // Configuración adicional para Hostinger
            $this->mail->SMTPDebug = EMAIL_DEBUG ? SMTP::DEBUG_SERVER : SMTP::DEBUG_OFF;
            $this->mail->Timeout = EMAIL_TIMEOUT;
            $this->mail->SMTPKeepAlive = true;
            $this->mail->CharSet = EMAIL_CHARSET;
            $this->mail->Encoding = EMAIL_ENCODING;
            
            // Configurar remitente por defecto
            $this->mail->setFrom(EMAIL_NO_REPLY, NOMBRE_REMITENTE);
            
        } catch (Exception $e) {
            error_log("Error configurando SMTP: " . $e->getMessage());
            throw new Exception("Error en configuración de email: " . $e->getMessage());
        }
    }
    
    /**
     * Enviar notificación de contacto al administrador
     */
    public function enviarNotificacionContacto($datos) {
        try {
            // Limpiar destinatarios previos
            $this->mail->clearAddresses();
            $this->mail->clearAttachments();
            
            // Configurar destinatario
            $this->mail->addAddress(EMAIL_ADMIN);
            
            // Configurar email
            $this->mail->isHTML(true);
            $this->mail->Subject = 'Nuevo contacto desde el sitio web - ' . $datos['nombre'];
            
            // Crear cuerpo del mensaje
            $cuerpoHTML = $this->generarPlantillaNotificacion($datos);
            $this->mail->Body = $cuerpoHTML;
            
            // Versión en texto plano
            $this->mail->AltBody = $this->generarTextoPlano($datos);
            
            // Enviar email
            $resultado = $this->mail->send();
            
            if ($resultado) {
                error_log("Email de notificación enviado exitosamente para: " . $datos['email']);
            }
            
            return $resultado;
            
        } catch (Exception $e) {
            error_log("Error enviando notificación de contacto: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Enviar confirmación al cliente
     */
    public function enviarConfirmacionCliente($datos) {
        try {
            // Limpiar destinatarios previos
            $this->mail->clearAddresses();
            $this->mail->clearAttachments();
            
            // Configurar destinatario
            $this->mail->addAddress($datos['email'], $datos['nombre']);
            
            // Configurar email
            $this->mail->isHTML(true);
            $this->mail->Subject = 'Gracias por contactarnos - ' . NOMBRE_REMITENTE;
            
            // Crear cuerpo del mensaje
            $cuerpoHTML = $this->generarPlantillaConfirmacion($datos);
            $this->mail->Body = $cuerpoHTML;
            
            // Versión en texto plano
            $this->mail->AltBody = $this->generarTextoPlanoConfirmacion($datos);
            
            // Enviar email
            $resultado = $this->mail->send();
            
            if ($resultado) {
                error_log("Email de confirmación enviado exitosamente a: " . $datos['email']);
            }
            
            return $resultado;
            
        } catch (Exception $e) {
            error_log("Error enviando confirmación al cliente: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Generar plantilla HTML para notificación al admin
     */
    private function generarPlantillaNotificacion($datos) {
        $html = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nuevo Contacto - Ecos del SEO</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    line-height: 1.6;
                    color: #1a202c;
                    background-color: #f7fafc;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                }
                .header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header .subtitle {
                    font-size: 16px;
                    font-weight: 300;
                    margin-top: 8px;
                    opacity: 0.9;
                }
                .content {
                    padding: 30px;
                    background-color: #ffffff;
                }
                .alert-badge {
                    display: inline-block;
                    background-color: #48bb78;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .contact-card {
                    background-color: #f7fafc;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-left: 4px solid #667eea;
                }
                .field {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                }
                .field-icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 12px;
                    margin-top: 2px;
                    flex-shrink: 0;
                }
                .field-content {
                    flex: 1;
                }
                .label {
                    font-weight: 600;
                    color: #4a5568;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                }
                .value {
                    color: #1a202c;
                    font-size: 16px;
                    font-weight: 400;
                    word-wrap: break-word;
                }
                .message-box {
                    background-color: #edf2f7;
                    border-radius: 8px;
                    padding: 16px;
                    margin-top: 8px;
                    border-left: 3px solid #667eea;
                }
                .footer {
                    background-color: #1a202c;
                    color: #a0aec0;
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                }
                .footer strong {
                    color: #ffffff;
                }
                .timestamp {
                    background-color: #667eea;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    display: inline-block;
                }
                @media only screen and (max-width: 600px) {
                    .email-container {
                        margin: 10px;
                        border-radius: 8px;
                    }
                    .header {
                        padding: 20px 15px;
                    }
                    .content {
                        padding: 20px 15px;
                    }
                    .header h1 {
                        font-size: 24px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>🚀 Nuevo Contacto</h1>
                    <div class="subtitle">Ecos del SEO - Plataforma de Marketing Digital</div>
                </div>
                <div class="content">
                    <div class="alert-badge">✨ Nueva consulta recibida</div>
                    
                    <div class="contact-card">
                        <div class="field">
                            <div class="field-content">
                                <div class="label">👤 Nombre Completo</div>
                                <div class="value">' . htmlspecialchars($datos['nombre']) . '</div>
                            </div>
                        </div>
                        
                        <div class="field">
                            <div class="field-content">
                                <div class="label">📧 Correo Electrónico</div>
                                <div class="value"><a href="mailto:' . htmlspecialchars($datos['email']) . '" style="color: #667eea; text-decoration: none;">' . htmlspecialchars($datos['email']) . '</a></div>
                            </div>
                        </div>
                        
                        <div class="field">
                            <div class="field-content">
                                <div class="label">📱 Teléfono</div>
                                <div class="value">' . htmlspecialchars($datos['telefono'] ?? 'No proporcionado') . '</div>
                            </div>
                        </div>
                        
                        <div class="field">
                            <div class="field-content">
                                <div class="label">🏢 Empresa</div>
                                <div class="value">' . htmlspecialchars($datos['empresa'] ?? 'No proporcionada') . '</div>
                            </div>
                        </div>
                        
                        <div class="field">
                            <div class="field-content">
                                <div class="label">🎯 Servicio de Interés</div>
                                <div class="value">' . htmlspecialchars($datos['interes_servicio'] ?? 'Consulta General') . '</div>
                            </div>
                        </div>
                        
                        <div class="field">
                            <div class="field-content">
                                <div class="label">💬 Mensaje</div>
                                <div class="message-box">' . nl2br(htmlspecialchars($datos['mensaje'])) . '</div>
                            </div>
                        </div>
                        
                        <div class="field">
                            <div class="field-content">
                                <div class="label">🕒 Fecha y Hora</div>
                                <div class="timestamp">' . date('d/m/Y H:i:s') . '</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="color: #4a5568; font-size: 14px; margin-top: 20px; padding: 16px; background-color: #edf2f7; border-radius: 6px; border-left: 3px solid #48bb78;">
                        💡 <strong>Recordatorio:</strong> Responde a este cliente lo antes posible para mantener una excelente experiencia de servicio.
                    </p>
                </div>
                <div class="footer">
                    <strong>Ecos del SEO</strong><br>
                    Sistema de Notificaciones Automáticas<br>
                    <span style="color: #667eea;">admin@ecosdelseo.com</span>
                </div>
            </div>
        </body>
        </html>';
        
        return $html;
    }
    
    /**
     * Generar plantilla HTML para confirmación al cliente
     */
    private function generarPlantillaConfirmacion($datos) {
        $html = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Contacto - Ecos del SEO</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    line-height: 1.6;
                    color: #1a202c;
                    background-color: #f7fafc;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                .header {
                    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                    color: white;
                    padding: 40px 20px;
                    text-align: center;
                }
                .header h1 {
                    font-size: 32px;
                    font-weight: 700;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header .subtitle {
                    font-size: 18px;
                    font-weight: 300;
                    margin-top: 10px;
                    opacity: 0.95;
                }
                .content {
                    padding: 40px 30px;
                    background-color: #ffffff;
                }
                .welcome-message {
                    background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
                    border-radius: 12px;
                    padding: 25px;
                    margin-bottom: 30px;
                    border-left: 5px solid #48bb78;
                }
                .welcome-message h2 {
                    color: #1a202c;
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                .welcome-message p {
                    color: #4a5568;
                    font-size: 16px;
                    margin: 0;
                }
                .summary-card {
                    background-color: #f7fafc;
                    border-radius: 10px;
                    padding: 25px;
                    margin: 25px 0;
                    border: 1px solid #e2e8f0;
                }
                .summary-title {
                    color: #2d3748;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                }
                .summary-item {
                    margin-bottom: 12px;
                }
                .summary-label {
                    font-weight: 600;
                    color: #4a5568;
                    font-size: 14px;
                    margin-bottom: 4px;
                }
                .summary-value {
                    color: #1a202c;
                    font-size: 15px;
                    padding: 8px 12px;
                    background-color: #ffffff;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                }
                .message-preview {
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 8px;
                    font-style: italic;
                    color: #4a5568;
                    max-height: 100px;
                    overflow: hidden;
                    position: relative;
                }
                .next-steps {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 10px;
                    padding: 25px;
                    margin: 25px 0;
                    text-align: center;
                }
                .next-steps h3 {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                .next-steps p {
                    font-size: 16px;
                    margin: 10px 0;
                    opacity: 0.95;
                }
                .contact-info {
                    background-color: #edf2f7;
                    border-radius: 8px;
                    padding: 20px;
                    margin-top: 25px;
                    text-align: center;
                }
                .contact-info h4 {
                    color: #2d3748;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                .contact-info p {
                    color: #4a5568;
                    font-size: 14px;
                    margin: 5px 0;
                }
                .footer {
                    background-color: #1a202c;
                    color: #a0aec0;
                    padding: 25px;
                    text-align: center;
                }
                .footer .brand {
                    color: #ffffff;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                .footer .tagline {
                    color: #667eea;
                    font-size: 14px;
                    font-style: italic;
                    margin-bottom: 15px;
                }
                .footer .contact {
                    font-size: 14px;
                }
                @media only screen and (max-width: 600px) {
                    .email-container {
                        margin: 10px;
                        border-radius: 8px;
                    }
                    .header {
                        padding: 30px 15px;
                    }
                    .content {
                        padding: 25px 15px;
                    }
                    .header h1 {
                        font-size: 26px;
                    }
                    .welcome-message, .summary-card, .next-steps {
                        padding: 20px 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>🎉 ¡Mensaje Recibido!</h1>
                    <div class="subtitle">Gracias por contactar con Ecos del SEO</div>
                </div>
                <div class="content">
                    <div class="welcome-message">
                        <h2>Hola ' . htmlspecialchars($datos['nombre']) . ' 👋</h2>
                        <p>Hemos recibido tu consulta y estamos emocionados de poder ayudarte a hacer crecer tu negocio digital.</p>
                    </div>
                    
                    <div class="summary-card">
                        <div class="summary-title">
                            📋 Resumen de tu consulta
                        </div>
                        
                        <div class="summary-item">
                            <div class="summary-label">🎯 Servicio de interés</div>
                            <div class="summary-value">' . htmlspecialchars($datos['interes_servicio'] ?? 'Consulta General') . '</div>
                        </div>
                        
                        <div class="summary-item">
                            <div class="summary-label">💬 Tu mensaje</div>
                            <div class="message-preview">' . nl2br(htmlspecialchars($datos['mensaje'])) . '</div>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h3>⏰ ¿Qué sigue ahora?</h3>
                        <p>Nuestro equipo de expertos revisará tu consulta detalladamente</p>
                        <p><strong>Te responderemos en un máximo de 24 horas</strong></p>
                        <p>Mientras tanto, puedes explorar nuestros casos de éxito en nuestra web</p>
                    </div>
                    
                    <div class="contact-info">
                        <h4>📞 ¿Necesitas contactarnos directamente?</h4>
                        <p>Email: <strong style="color: #667eea;">' . EMAIL_ADMIN . '</strong></p>
                        <p>Estamos aquí para ayudarte a alcanzar tus objetivos digitales</p>
                    </div>
                    
                    <p style="color: #4a5568; font-size: 14px; margin-top: 30px; text-align: center; font-style: italic;">
                        💡 Este es un mensaje automático. Por favor, no respondas a este correo.
                    </p>
                </div>
                <div class="footer">
                    <div class="brand">Ecos del SEO</div>
                    <div class="tagline">"Transformando ideas en resultados digitales"</div>
                    <div class="contact">
                        Marketing Digital • SEO • Desarrollo Web • Estrategia Digital<br>
                        <span style="color: #667eea;">' . EMAIL_ADMIN . '</span>
                    </div>
                </div>
            </div>
        </body>
        </html>';
        
        return $html;
    }
    
    /**
     * Generar versión en texto plano para notificación
     */
    private function generarTextoPlano($datos) {
        $texto = "═══════════════════════════════════════════════════════════════\n";
        $texto .= "                    🚀 NUEVA CONSULTA DE CONTACTO                    \n";
        $texto .= "                           Ecos del SEO                           \n";
        $texto .= "═══════════════════════════════════════════════════════════════\n\n";
        
        $texto .= "📋 INFORMACIÓN DEL CLIENTE:\n";
        $texto .= "───────────────────────────────────────────────────────────────\n";
        $texto .= "👤 Nombre:           " . $datos['nombre'] . "\n";
        $texto .= "📧 Email:            " . $datos['email'] . "\n";
        $texto .= "📱 Teléfono:         " . ($datos['telefono'] ?? 'No proporcionado') . "\n";
        $texto .= "🏢 Empresa:          " . ($datos['empresa'] ?? 'No proporcionada') . "\n";
        $texto .= "🎯 Servicio:         " . ($datos['interes_servicio'] ?? 'Consulta General') . "\n";
        $texto .= "📅 Fecha:            " . date('d/m/Y H:i:s') . "\n\n";
        
        $texto .= "💬 MENSAJE DEL CLIENTE:\n";
        $texto .= "───────────────────────────────────────────────────────────────\n";
        $texto .= $datos['mensaje'] . "\n\n";
        
        $texto .= "⚡ ACCIONES RECOMENDADAS:\n";
        $texto .= "───────────────────────────────────────────────────────────────\n";
        $texto .= "• Responder en un máximo de 24 horas\n";
        $texto .= "• Revisar el servicio de interés solicitado\n";
        $texto .= "• Preparar propuesta personalizada\n\n";
        
        $texto .= "═══════════════════════════════════════════════════════════════\n";
        $texto .= "Este mensaje fue generado automáticamente por el sistema de contacto\n";
        $texto .= "de Ecos del SEO - " . date('Y') . "\n";
        $texto .= "═══════════════════════════════════════════════════════════════";
        
        return $texto;
    }
    
    /**
     * Generar versión en texto plano para confirmación
     */
    private function generarTextoPlanoConfirmacion($datos) {
        $texto = "═══════════════════════════════════════════════════════════════\n";
        $texto .= "                    🎉 ¡MENSAJE RECIBIDO!                         \n";
        $texto .= "                  Gracias por contactar con                     \n";
        $texto .= "                       Ecos del SEO                            \n";
        $texto .= "═══════════════════════════════════════════════════════════════\n\n";
        
        $texto .= "👋 Hola " . $datos['nombre'] . ",\n\n";
        $texto .= "Hemos recibido tu consulta y estamos emocionados de poder\n";
        $texto .= "ayudarte a hacer crecer tu negocio digital.\n\n";
        
        $texto .= "📋 RESUMEN DE TU CONSULTA:\n";
        $texto .= "───────────────────────────────────────────────────────────────\n";
        $texto .= "🎯 Servicio de interés: " . ($datos['interes_servicio'] ?? 'Consulta General') . "\n";
        $texto .= "💬 Tu mensaje: " . $datos['mensaje'] . "\n\n";
        
        $texto .= "⏰ ¿QUÉ SIGUE AHORA?\n";
        $texto .= "───────────────────────────────────────────────────────────────\n";
        $texto .= "• Nuestro equipo de expertos revisará tu consulta detalladamente\n";
        $texto .= "• Te responderemos en un máximo de 24 horas\n";
        $texto .= "• Mientras tanto, puedes explorar nuestros casos de éxito\n\n";
        
        $texto .= "📞 ¿NECESITAS CONTACTARNOS DIRECTAMENTE?\n";
        $texto .= "───────────────────────────────────────────────────────────────\n";
        $texto .= "Email: " . EMAIL_ADMIN . "\n";
        $texto .= "Estamos aquí para ayudarte a alcanzar tus objetivos digitales\n\n";
        
        $texto .= "💡 Este es un mensaje automático. Por favor, no respondas\n";
        $texto .= "   a este correo.\n\n";
        
        $texto .= "═══════════════════════════════════════════════════════════════\n";
        $texto .= "                         Ecos del SEO                          \n";
        $texto .= "              \"Transformando ideas en resultados digitales\"      \n";
        $texto .= "     Marketing Digital • SEO • Desarrollo Web • Estrategia     \n";
        $texto .= "                      " . EMAIL_ADMIN . "                       \n";
        $texto .= "═══════════════════════════════════════════════════════════════";
        
        return $texto;
    }
}
?>