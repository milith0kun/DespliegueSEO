<?php
// Configuración Simple de Base de Datos

// Detectar entorno
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocalHost = strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false;
$isLocalPath = strpos(__DIR__, 'localhost') !== false || strpos(__DIR__, 'xampp') !== false || strpos(__DIR__, 'wamp') !== false;
$isLocal = $isLocalHost || $isLocalPath || php_sapi_name() === 'cli';

if ($isLocal) {
    // Local - MySQL via XAMPP
    define('DB_HOST', '127.0.0.1');
    define('DB_PORT', '3307');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'ecosdelseo_db');
} else {
    // Hostinger
    define('DB_HOST', '127.0.0.1');
    define('DB_PORT', '3306');
    define('DB_USER', 'u815370372_ceo');
    define('DB_PASS', 'jampier1997281qA@');
    define('DB_NAME', 'u815370372_ecosdelseoBD');
}

// Configuración básica
define('DB_CHARSET', 'utf8mb4');
?>
