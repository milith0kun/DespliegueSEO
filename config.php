<?php
// Configuración Simple del Sistema

// Detectar si estamos en local o Hostinger
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocalHost = strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false;
$isLocalPath = strpos(__DIR__, 'localhost') !== false || strpos(__DIR__, 'xampp') !== false || strpos(__DIR__, 'wamp') !== false;
define('IS_LOCAL', $isLocalHost || $isLocalPath || php_sapi_name() === 'cli');

if (IS_LOCAL) {
    // Desarrollo Local
    error_reporting(E_ALL);
    // Solo mostrar errores en páginas HTML, no en API
    $isApiRequest = strpos($_SERVER['REQUEST_URI'] ?? '', '/api') !== false;
    ini_set('display_errors', $isApiRequest ? '0' : '1');
    ini_set('log_errors', 1);
    define('SITE_URL', 'http://localhost:8080');
    define('API_URL', 'http://localhost:8080');
} else {
    // Producción Hostinger
    error_reporting(0);
    ini_set('display_errors', 0);
    define('SITE_URL', 'https://ecosdelseo.com');
    define('API_URL', 'https://ecosdelseo.com/api');
}

// Configuración básica
date_default_timezone_set('America/Lima');

// Configurar sesión antes de iniciarla
if (IS_LOCAL) {
    // Configuración para desarrollo local
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.cookie_secure', '0');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_domain', '');
    ini_set('session.cookie_path', '/');
    ini_set('session.name', 'ECOSDELSEO_SESSION');
    ini_set('session.gc_maxlifetime', 3600); // 1 hora
} else {
    // Configuración para producción
    ini_set('session.cookie_samesite', 'None');
    ini_set('session.cookie_secure', '1');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_path', '/');
    ini_set('session.name', 'ECOSDELSEO_SESSION');
}

// Iniciar sesión si no está iniciada
if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
    session_start();
    
    // Debug: Log session info
    if (IS_LOCAL) {
        error_log("Session started - ID: " . session_id());
        error_log("Session data: " . json_encode($_SESSION));
    }
}

// Crear directorio de logs si no existe
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}
ini_set('error_log', $logDir . '/error.log');

// Constantes
define('APP_NAME', 'Ecos del SEO');
?>