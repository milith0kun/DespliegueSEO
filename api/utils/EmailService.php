<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../../vendor/autoload.php';

class EmailService {
    private $mailer;
    
    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->configurarSMTP();
    }
    
    private function configurarSMTP() {
        try {
            // Configuración del servidor SMTP
            $this->mailer->isSMTP();
            $this->mailer->Host       = 'smtp.gmail.com';
            $this->mailer->SMTPAuth   = true;
            $this->mailer->Username   = 'ceo@ecosdelseo.com'; // ✅ Ya está correcto
            $this->mailer->Password   = 'abcd efgh ijkl mnop';     // ⚠️ PONER AQUÍ la contraseña de aplicación
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port       = 587;
            
            // Configuración del remitente
            $this->mailer->setFrom('ceo@ecosdelseo.com', 'Ecos del SEO'); // ✅ Ya está correcto
            $this->mailer->isHTML(true);
            $this->mailer->CharSet = 'UTF-8';
            
        } catch (Exception $e) {
            error_log("Error configurando SMTP: {$this->mailer->ErrorInfo}");
        }
    }
    
    /**
     * Enviar notificación de nuevo contacto al administrador
     */
    public function enviarNotificacionContacto($datos) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress('ceo@ecosdelseo.com'); // Tu email real para recibir notificaciones
            
            $this->mailer->Subject = '🔔 Nuevo contacto desde el sitio web - ' . $datos['nombre'];
            
            $mensaje = $this->generarPlantillaNotificacion($datos);
            $this->mailer->Body = $mensaje;
            
            // Versión texto plano
            $this->mailer->AltBody = $this->generarTextoPlano($datos);
            
            $this->mailer->send();
            return true;
            
        } catch (Exception $e) {
            error_log("Error enviando email de notificación: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
    
    /**
     * Enviar email de confirmación al cliente
     */
    public function enviarConfirmacionCliente($datos) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($datos['email'], $datos['nombre']);
            
            $this->mailer->Subject = '✅ Hemos recibido tu mensaje - Ecos del SEO';
            
            $mensaje = $this->generarPlantillaConfirmacion($datos);
            $this->mailer->Body = $mensaje;
            
            $this->mailer->send();
            return true;
            
        } catch (Exception $e) {
            error_log("Error enviando email de confirmación: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
    
    private function generarPlantillaNotificacion($datos) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4a6cf7, #3a5bd9); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #4a6cf7; }
                .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>🔔 Nuevo Contacto Recibido</h2>
                    <p>Se ha recibido un nuevo mensaje desde el sitio web</p>
                </div>
                <div class='content'>
                    <div class='field'>
                        <div class='label'>👤 Nombre:</div>
                        <div class='value'>{$datos['nombre']}</div>
                    </div>
                    <div class='field'>
                        <div class='label'>📧 Email:</div>
                        <div class='value'>{$datos['email']}</div>
                    </div>
                    <div class='field'>
                        <div class='label'>📱 Teléfono:</div>
                        <div class='value'>" . ($datos['telefono'] ?: 'No proporcionado') . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>🏢 Empresa:</div>
                        <div class='value'>" . ($datos['empresa'] ?: 'No proporcionada') . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>🎯 Interés en servicio:</div>
                        <div class='value'>{$datos['interes_servicio']}</div>
                    </div>
                    <div class='field'>
                        <div class='label'>💬 Mensaje:</div>
                        <div class='value'>{$datos['mensaje']}</div>
                    </div>
                    <div class='field'>
                        <div class='label'>⏰ Fecha:</div>
                        <div class='value'>" . date('d/m/Y H:i:s') . "</div>
                    </div>
                </div>
                <div class='footer'>
                    <p>Este email fue generado automáticamente desde ecosdelseo.com</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
    
    private function generarPlantillaConfirmacion($datos) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4a6cf7, #3a5bd9); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .cta { text-align: center; margin: 20px 0; }
                .button { display: inline-block; padding: 12px 24px; background: #4a6cf7; color: white; text-decoration: none; border-radius: 6px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>✅ ¡Gracias por contactarnos!</h2>
                    <p>Hemos recibido tu mensaje correctamente</p>
                </div>
                <div class='content'>
                    <p>Hola <strong>{$datos['nombre']}</strong>,</p>
                    <p>Gracias por contactar con <strong>Ecos del SEO</strong>. Hemos recibido tu mensaje y nuestro equipo lo revisará en breve.</p>
                    <p><strong>Resumen de tu consulta:</strong></p>
                    <p style='background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #4a6cf7;'>
                        {$datos['mensaje']}
                    </p>
                    <p>Nos pondremos en contacto contigo en las próximas <strong>24 horas</strong> para discutir cómo podemos ayudarte a potenciar tu presencia online.</p>
                    <div class='cta'>
                        <a href='https://ecosdelseo.com' class='button'>Visitar nuestro sitio web</a>
                    </div>
                    <p>Si tienes alguna pregunta urgente, no dudes en contactarnos directamente:</p>
                    <ul>
                        <li>📧 Email: ceo@ecosdelseo.com</li>
                        <li>📱 WhatsApp: +34 600 000 000</li>
                    </ul>
                </div>
                <div class='footer'>
                    <p>© 2025 Ecos del SEO - Todos los derechos reservados</p>
                    <p>Este es un email automático, por favor no respondas a esta dirección.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
    
    private function generarTextoPlano($datos) {
        return "Nuevo contacto recibido:\n\n" .
               "Nombre: {$datos['nombre']}\n" .
               "Email: {$datos['email']}\n" .
               "Teléfono: " . ($datos['telefono'] ?: 'No proporcionado') . "\n" .
               "Empresa: " . ($datos['empresa'] ?: 'No proporcionada') . "\n" .
               "Servicio de interés: {$datos['interes_servicio']}\n" .
               "Mensaje: {$datos['mensaje']}\n" .
               "Fecha: " . date('d/m/Y H:i:s');
    }
}
?>