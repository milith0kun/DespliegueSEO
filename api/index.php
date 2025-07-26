<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8000');
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

// Routing
switch (true) {
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
        
    case preg_match('/^\/api\/contactos\/([a-f0-9-]+)$/', $request, $matches) && $method === 'PUT':
        $controller = new ContactoController();
        $controller->actualizarEstado($matches[1]);
        break;
        
    case preg_match('/^\/api\/contactos\/([a-f0-9-]+)$/', $request, $matches) && $method === 'DELETE':
        $controller = new ContactoController();
        $controller->eliminar($matches[1]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada: ' . $request]);
}
?>