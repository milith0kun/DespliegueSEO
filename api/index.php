<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

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

// Debugging - log de rutas (remover en producción)
error_log("API Request: $method $request");

// Routing
switch (true) {
    // Ruta raíz - información de la API
    case $request === '/' && $method === 'GET':
        echo json_encode([
            'success' => true,
            'message' => 'API del Sistema de Marketing y SEO',
            'version' => '1.0.0',
            'available_routes' => [
                'POST /api/auth/login',
                'GET /api/auth/check',
                'GET /api/auth/me',
                'POST /api/auth/logout',
                'GET /api/usuarios',
                'POST /api/contactos',
                'GET /api/contactos',
                'GET /api/contactos/estadisticas',
                'PUT /api/contactos/{id}',
                'DELETE /api/contactos/{id}'
            ]
        ]);
        break;
        
    // Rutas de autenticación
    case $request === '/api/auth/login' && $method === 'POST':
        $controller = new UsuarioController();
        $controller->login();
        break;
        
    case $request === '/api/auth/check' && $method === 'GET':
        $controller = new UsuarioController();
        $controller->checkAuth();
        break;
        
    case $request === '/api/auth/me' && $method === 'GET':
        $controller = new UsuarioController();
        $controller->me();
        break;
        
    case $request === '/api/auth/logout' && $method === 'POST':
        $controller = new UsuarioController();
        $controller->logout();
        break;
    
    // Rutas de usuarios
    case $request === '/api/usuarios' && $method === 'GET':
        $controller = new UsuarioController();
        $controller->index();
        break;
        
    // Rutas de contactos
    case $request === '/api/contactos' && $method === 'POST':
        $controller = new ContactoController();
        $controller->crear();
        break;
        
    case $request === '/api/contactos' && $method === 'GET':
        $controller = new ContactoController();
        $controller->index();
        break;
        
    case $request === '/api/contactos/estadisticas' && $method === 'GET':
        $controller = new ContactoController();
        $controller->estadisticas();
        break;
        
    case preg_match('/^\/api\/contactos\/([0-9]+)$/', $request, $matches) && $method === 'PUT':
        $controller = new ContactoController();
        $controller->actualizarEstado($matches[1]);
        break;
        
    case preg_match('/^\/api\/contactos\/([0-9]+)$/', $request, $matches) && $method === 'DELETE':
        $controller = new ContactoController();
        $controller->eliminar($matches[1]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Ruta no encontrada: ' . $request,
            'method' => $method,
            'available_routes' => [
                'POST /api/auth/login',
                'GET /api/auth/check',
                'GET /api/auth/me',
                'POST /api/auth/logout',
                'GET /api/usuarios',
                'POST /api/contactos',
                'GET /api/contactos',
                'GET /api/contactos/estadisticas',
                'PUT /api/contactos/{id}',
                'DELETE /api/contactos/{id}'
            ]
        ]);
}
?>