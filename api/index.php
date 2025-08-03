<?php
/**
 * API Principal - Punto de entrada de la API
 * Maneja todas las solicitudes HTTP y las enruta a los controladores correspondientes
 */

// Cargar configuración global
require_once __DIR__ . '/../config.php';

// La sesión ya se inicia en config.php

// Configuración dinámica de CORS
$allowedOrigins = [
    'http://localhost:8000',
    'http://localhost:8080',
    'http://localhost',
    'https://localhost',
    'https://marketingseodespliegue.com',
    'http://marketingseodespliegue.com',
    'https://www.marketingseodespliegue.com',
    'http://www.marketingseodespliegue.com',
    'https://ecosdelseo.com',
    'http://ecosdelseo.com',
    'https://www.ecosdelseo.com',
    'http://www.ecosdelseo.com'
];

// Agregar SITE_URL si está definido
if (defined('SITE_URL')) {
    $allowedOrigins[] = SITE_URL;
    $allowedOrigins[] = str_replace('http://', 'https://', SITE_URL);
    
    // Agregar variaciones con www si no es localhost
    if (!IS_LOCAL) {
        $siteUrlWithWww = str_replace('://', '://www.', SITE_URL);
        $allowedOrigins[] = $siteUrlWithWww;
        $allowedOrigins[] = str_replace('http://', 'https://', $siteUrlWithWww);
    }
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // En desarrollo, permitir cualquier origen
    if (IS_LOCAL) {
        header("Access-Control-Allow-Origin: *");
    } else {
        header("Access-Control-Allow-Origin: https://marketingseodespliegue.com");
    }
}

// Log para debugging
error_log("CORS Origin: $origin");
error_log("Allowed Origins: " . implode(', ', $allowedOrigins));

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/controllers/UsuarioController.php';
require_once __DIR__ . '/controllers/ContactoController.php';

// Obtener la ruta y método
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Normalizar la ruta - remover /api si está presente al inicio
// Esto permite que funcione tanto con /api/auth/login como con auth/login
if (strpos($request, '/api/') === 0) {
    $request = substr($request, 4); // Remover '/api'
} elseif (strpos($request, '/api') === 0) {
    $request = substr($request, 4); // Remover '/api'
}

// Si la ruta está vacía después de remover /api, establecer como raíz
if (empty($request) || $request === '/') {
    $request = '/';
}

// Si accedemos directamente a api/index.php, establecer como raíz
if (strpos($_SERVER['SCRIPT_NAME'], '/api/index.php') !== false && $request === '/index.php') {
    $request = '/';
}

// Debugging mejorado - log de rutas y variables del servidor
error_log("API Request: $method $request");
error_log("REQUEST_URI: " . $_SERVER['REQUEST_URI']);
error_log("HTTP_HOST: " . $_SERVER['HTTP_HOST']);
error_log("SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME']);
error_log("Environment: " . (IS_LOCAL ? 'LOCAL' : 'PRODUCTION'));

// Routing
switch (true) {
    // Ruta raíz - información de la API
    case $request === '/' && $method === 'GET':
        echo json_encode([
            'success' => true,
            'message' => 'API del Sistema de Marketing y SEO',
            'version' => '1.0.0',
            'environment' => IS_LOCAL ? 'LOCAL' : 'PRODUCTION',
            'available_routes' => [
                'POST /auth/login',
                'GET /auth/check',
                'GET /auth/me',
                'POST /auth/logout',
                'GET /usuarios',
                'POST /contactos',
                'GET /contactos',
                'GET /contactos/estadisticas',
                'PUT /contactos/{id}',
                'DELETE /contactos/{id}'
            ]
        ]);
        break;
        
    // Rutas de autenticación
    case $request === '/auth/login' && $method === 'POST':
        $controller = new UsuarioController();
        $controller->login();
        break;
        
    case $request === '/auth/check' && $method === 'GET':
        $controller = new UsuarioController();
        $controller->checkAuth();
        break;
        
    case $request === '/auth/me' && $method === 'GET':
        $controller = new UsuarioController();
        $controller->me();
        break;
        
    case $request === '/auth/logout' && $method === 'POST':
        $controller = new UsuarioController();
        $controller->logout();
        break;
    
    // Rutas de usuarios
    case $request === '/usuarios' && $method === 'GET':
        $controller = new UsuarioController();
        $controller->index();
        break;
        
    // Rutas de contactos
    case $request === '/contactos' && $method === 'POST':
        $controller = new ContactoController();
        $controller->crear();
        break;
        
    case $request === '/contactos' && $method === 'GET':
        $controller = new ContactoController();
        $controller->index();
        break;
        
    case $request === '/contactos/estadisticas' && $method === 'GET':
        $controller = new ContactoController();
        $controller->estadisticas();
        break;
        
    case preg_match('/^\/contactos\/([0-9]+)$/', $request, $matches) && $method === 'PUT':
        $controller = new ContactoController();
        $controller->actualizarEstado($matches[1]);
        break;
        
    case preg_match('/^\/contactos\/([0-9]+)$/', $request, $matches) && $method === 'DELETE':
        $controller = new ContactoController();
        $controller->eliminar($matches[1]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Ruta no encontrada: ' . $request,
            'method' => $method,
            'debug_info' => [
                'original_uri' => $_SERVER['REQUEST_URI'],
                'script_name' => $_SERVER['SCRIPT_NAME'],
                'processed_request' => $request
            ],
            'available_routes' => [
                'POST /auth/login',
                'GET /auth/check',
                'GET /auth/me',
                'POST /auth/logout',
                'GET /usuarios',
                'POST /contactos',
                'GET /contactos',
                'GET /contactos/estadisticas',
                'PUT /contactos/{id}',
                'DELETE /contactos/{id}'
            ]
        ]);
}
?>