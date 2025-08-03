<?php
// Configuración de base de datos para Hostinger
// Detectar si estamos en desarrollo local o producción

// Función mejorada para detectar entorno local
function isLocalDevelopment() {
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $serverName = $_SERVER['SERVER_NAME'] ?? '';
    
    // Verificar múltiples indicadores de desarrollo local
    $localIndicators = [
        'localhost',
        '127.0.0.1',
        '::1',
        '.local',
        '.test',
        '.dev'
    ];
    
    foreach ($localIndicators as $indicator) {
        if (strpos($host, $indicator) !== false || strpos($serverName, $indicator) !== false) {
            return true;
        }
    }
    
    // Verificar si estamos en XAMPP/WAMP/MAMP
    if (isset($_SERVER['DOCUMENT_ROOT']) && 
        (strpos($_SERVER['DOCUMENT_ROOT'], 'xampp') !== false ||
         strpos($_SERVER['DOCUMENT_ROOT'], 'wamp') !== false ||
         strpos($_SERVER['DOCUMENT_ROOT'], 'mamp') !== false)) {
        return true;
    }
    
    return false;
}

if (isLocalDevelopment()) {
    // Configuración para desarrollo local (XAMPP)
    define('DB_HOST', '127.0.0.1');
    define('DB_PORT', '3307');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'ecosdelseo_db');
    error_log('Database config: Using LOCAL configuration');
} else {
    // Configuración para producción (Hostinger)
    // Datos corregidos según la información de phpMyAdmin
    define('DB_HOST', 'localhost'); // Servidor remoto de Hostinger
    define('DB_PORT', '3306'); // Puerto estándar MySQL
    define('DB_USER', 'u815370372_ceo'); // Usuario corregido
    define('DB_PASS', 'jampier1997281qA@'); // Contraseña corregida
    define('DB_NAME', 'u815370372_ecosdelseoBD'); // Nombre de base de datos corregido
    error_log('Database config: Using PRODUCTION configuration for Hostinger');
}

// Configuración adicional para producción
if (!defined('DB_CHARSET')) {
    define('DB_CHARSET', 'utf8mb4');
}

if (!defined('DB_COLLATE')) {
    define('DB_COLLATE', 'utf8mb4_unicode_ci');
}
?>
