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
define('EMAIL_DEBUG', true); // Cambiar a false en producción
?>