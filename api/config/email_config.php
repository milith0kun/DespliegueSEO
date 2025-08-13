<?php
/**
 * Configuración de Email (PHPMailer/SMTP)
 * Configuración para Hostinger usando SMTP
 * IMPORTANTE: Las credenciales deben moverse a variables de entorno
 */

// === CONFIGURACIÓN DEL SERVIDOR SMTP ===
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_USERNAME', 'ceo@ecosdelseo.com');
define('SMTP_PASSWORD', 'jampier1997281qA@'); // MOVER A .ENV
define('SMTP_PORT', 465);
define('SMTP_SECURE', 'ssl'); // ssl o tls

// === CONFIGURACIÓN DE CORREOS ===
define('EMAIL_ADMIN', 'ceo@ecosdelseo.com');
define('EMAIL_NO_REPLY', 'ceo@ecosdelseo.com');
define('NOMBRE_REMITENTE', 'Ecos del SEO');

// === CONFIGURACIÓN DE ENTORNO ===
// Detectar entorno automáticamente
$isLocal = false;
if (isset($_SERVER['HTTP_HOST'])) {
    $localIndicators = ['localhost', '127.0.0.1', '::1', '.local', '.test', '.dev'];
    foreach ($localIndicators as $indicator) {
        if (strpos($_SERVER['HTTP_HOST'], $indicator) !== false) {
            $isLocal = true;
            break;
        }
    }
}

// Configuración según entorno
if ($isLocal) {
    define('EMAIL_DEBUG', true);  // Debug activado en desarrollo
    define('EMAIL_TIMEOUT', 10);  // Timeout más corto para desarrollo
} else {
    define('EMAIL_DEBUG', false); // Debug desactivado en producción
    define('EMAIL_TIMEOUT', 30);  // Timeout más largo para producción
}

// === CONFIGURACIÓN ADICIONAL ===
define('EMAIL_CHARSET', 'UTF-8');
define('EMAIL_ENCODING', '8bit');
define('EMAIL_WORD_WRAP', 70);

error_log("Email configuration loaded - SMTP Host: " . SMTP_HOST . ", Debug: " . (EMAIL_DEBUG ? 'ON' : 'OFF') . ", Environment: " . ($isLocal ? 'LOCAL' : 'PRODUCTION'));
?>