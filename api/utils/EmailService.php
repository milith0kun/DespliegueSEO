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
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Nuevo Contacto</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f8f9fa; padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #2c3e50; }
                .value { margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nuevo Contacto Recibido</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Nombre:</div>
                        <div class="value">' . htmlspecialchars($datos['nombre']) . '</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">' . htmlspecialchars($datos['email']) . '</div>
                    </div>
                    <div class="field">
                        <div class="label">Teléfono:</div>
                        <div class="value">' . htmlspecialchars($datos['telefono'] ?? 'No proporcionado') . '</div>
                    </div>
                    <div class="field">
                        <div class="label">Empresa:</div>
                        <div class="value">' . htmlspecialchars($datos['empresa'] ?? 'No proporcionada') . '</div>
                    </div>
                    <div class="field">
                        <div class="label">Interés en servicio:</div>
                        <div class="value">' . htmlspecialchars($datos['interes_servicio'] ?? 'General') . '</div>
                    </div>
                    <div class="field">
                        <div class="label">Mensaje:</div>
                        <div class="value">' . nl2br(htmlspecialchars($datos['mensaje'])) . '</div>
                    </div>
                    <div class="field">
                        <div class="label">Fecha:</div>
                        <div class="value">' . date('d/m/Y H:i:s') . '</div>
                    </div>
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
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Confirmación de Contacto</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f8f9fa; padding: 20px; }
                .footer { background-color: #34495e; color: white; padding: 15px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>¡Gracias por contactarnos!</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>' . htmlspecialchars($datos['nombre']) . '</strong>,</p>
                    <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
                    <p><strong>Resumen de tu consulta:</strong></p>
                    <p><strong>Servicio de interés:</strong> ' . htmlspecialchars($datos['interes_servicio'] ?? 'General') . '</p>
                    <p><strong>Tu mensaje:</strong><br>' . nl2br(htmlspecialchars($datos['mensaje'])) . '</p>
                    <p>Nuestro equipo revisará tu consulta y te responderemos en un plazo máximo de 24 horas.</p>
                    <p>¡Gracias por confiar en nosotros!</p>
                </div>
                <div class="footer">
                    <p><strong>' . NOMBRE_REMITENTE . '</strong><br>
                    Email: ' . EMAIL_ADMIN . '</p>
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
        $texto = "NUEVO CONTACTO RECIBIDO\n\n";
        $texto .= "Nombre: " . $datos['nombre'] . "\n";
        $texto .= "Email: " . $datos['email'] . "\n";
        $texto .= "Teléfono: " . ($datos['telefono'] ?? 'No proporcionado') . "\n";
        $texto .= "Empresa: " . ($datos['empresa'] ?? 'No proporcionada') . "\n";
        $texto .= "Interés en servicio: " . ($datos['interes_servicio'] ?? 'General') . "\n";
        $texto .= "Mensaje: " . $datos['mensaje'] . "\n";
        $texto .= "Fecha: " . date('d/m/Y H:i:s') . "\n";
        
        return $texto;
    }
    
    /**
     * Generar versión en texto plano para confirmación
     */
    private function generarTextoPlanoConfirmacion($datos) {
        $texto = "¡Gracias por contactarnos!\n\n";
        $texto .= "Hola " . $datos['nombre'] . ",\n\n";
        $texto .= "Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.\n\n";
        $texto .= "Resumen de tu consulta:\n";
        $texto .= "Servicio de interés: " . ($datos['interes_servicio'] ?? 'General') . "\n";
        $texto .= "Tu mensaje: " . $datos['mensaje'] . "\n\n";
        $texto .= "Nuestro equipo revisará tu consulta y te responderemos en un plazo máximo de 24 horas.\n\n";
        $texto .= "¡Gracias por confiar en nosotros!\n\n";
        $texto .= NOMBRE_REMITENTE . "\n";
        $texto .= "Email: " . EMAIL_ADMIN;
        
        return $texto;
    }
}
?>