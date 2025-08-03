<?php
// Configuración para PHPMailer usando SMTP de Hostinger
// IMPORTANTE: Credenciales actualizadas para ecosdelseo.com

// Configuración del servidor SMTP
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_USERNAME', 'ceo@ecosdelseo.com');
define('SMTP_PASSWORD', 'jampier1997281qA@');
define('SMTP_PORT', 465);
define('SMTP_SECURE', 'ssl');

// Configuración de los correos
define('EMAIL_ADMIN', 'ceo@ecosdelseo.com');
define('EMAIL_NO_REPLY', 'ceo@ecosdelseo.com');
define('NOMBRE_REMITENTE', 'Ecos del SEO');

// Configuración adicional para debug
// Detectar entorno automáticamente
if (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) {
    define('EMAIL_DEBUG', true); // Debug activado en desarrollo
} else {
    define('EMAIL_DEBUG', false); // Debug desactivado en producción
}

// Configuración adicional para producción
define('EMAIL_TIMEOUT', 30);
define('EMAIL_CHARSET', 'UTF-8');
define('EMAIL_ENCODING', '8bit');
?>