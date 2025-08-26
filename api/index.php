<?php
/**
 * API Principal - Punto de entrada de la API
 * Maneja todas las solicitudes HTTP y las enruta a los controladores correspondientes
 */

// Iniciar output buffering para evitar output no deseado
ob_start();

// Cargar configuración global primero
require_once __DIR__ . '/../config.php';

// La sesión ya está configurada e iniciada en config.php

// Cargar configuración de base de datos
require_once __DIR__ . '/config/database.php';

// Configuración simple de CORS
if (IS_LOCAL) {
    header("Access-Control-Allow-Origin: http://localhost:8080");
} else {
    header("Access-Control-Allow-Origin: https://ecosdelseo.com");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


require_once __DIR__ . '/controllers/ContactoController.php';
require_once __DIR__ . '/controllers/UsuariosController.php';
require_once __DIR__ . '/models/EventoSeguridad.php';

// Obtener la ruta y método con verificación de existencia
$request = isset($_SERVER['REQUEST_URI']) ? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : '/';
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

// Normalizar la ruta - remover /api si está presente
if (strpos($request, '/api/') === 0) {
    $request = substr($request, 4);
} elseif (strpos($request, '/api') === 0) {
    $request = substr($request, 4);
}

// Establecer ruta raíz si está vacía
if (empty($request) || $request === '/' || $request === '/index.php') {
    $request = '/';
}

// Routing
switch (true) {
    // Ruta raíz - información de la API
    case $request === '/' && $method === 'GET':
        ob_clean(); // Limpiar buffer antes de respuesta JSON
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
                'GET /admin/usuarios',
                'POST /admin/usuarios',
                'PUT /admin/usuarios/{id}',
                'DELETE /admin/usuarios/{id}',
                'GET /admin/usuarios/estadisticas',
                'GET /admin/seguridad',
                'GET /admin/seguridad/estadisticas',
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
        ob_clean(); // Limpiar buffer antes de respuesta JSON
        $controller = new UsuariosController();
        $controller->login();
        break;
        
    case $request === '/auth/check' && $method === 'GET':
        $controller = new UsuariosController();
        $controller->checkAuth();
        break;
        
    case $request === '/auth/me' && $method === 'GET':
        $controller = new UsuariosController();
        $controller->me();
        break;
        
    case $request === '/auth/logout' && $method === 'POST':
        $controller = new UsuariosController();
        $controller->logout();
        break;
    
    // Rutas de usuarios (legacy) - redirigido a admin/usuarios
    case $request === '/usuarios' && $method === 'GET':
        $controller = new UsuariosController();
        $controller->listar();
        break;
        
    // Rutas de administración de usuarios
    case $request === '/admin/usuarios' && $method === 'GET':
        $controller = new UsuariosController();
        $controller->listar();
        break;
        
    case $request === '/admin/usuarios' && $method === 'POST':
        $controller = new UsuariosController();
        $controller->crear();
        break;
        
    case preg_match('/^\/admin\/usuarios\/([a-f0-9\-]+)$/', $request, $matches) && $method === 'PUT':
        $controller = new UsuariosController();
        $controller->actualizar($matches[1]);
        break;
        
    case preg_match('/^\/admin\/usuarios\/([a-f0-9\-]+)$/', $request, $matches) && $method === 'DELETE':
        $controller = new UsuariosController();
        $controller->eliminar($matches[1]);
        break;
        
    case $request === '/admin/usuarios/estadisticas' && $method === 'GET':
        $controller = new UsuariosController();
        $controller->obtenerEstadisticas();
        break;
        
    // Rutas de eventos de seguridad
    case $request === '/admin/seguridad' && $method === 'GET':
        try {
            // Verificar autenticación
            if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_rol'])) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'No autenticado'
                ]);
                break;
            }
            
            // Solo administradores pueden acceder
            if (strtolower($_SESSION['user_rol']) !== 'admin') {
                http_response_code(403);
                echo json_encode([
                    'success' => false,
                    'message' => 'Permisos insuficientes'
                ]);
                break;
            }
            
            $eventoSeguridad = new EventoSeguridad();
            $filtros = [];
            
            if (isset($_GET['tipo'])) {
                $filtros['tipo'] = $_GET['tipo'];
            }
            if (isset($_GET['fecha_desde'])) {
                $filtros['fecha_desde'] = $_GET['fecha_desde'];
            }
            if (isset($_GET['fecha_hasta'])) {
                $filtros['fecha_hasta'] = $_GET['fecha_hasta'];
            }
            
            $eventos = $eventoSeguridad->obtenerEventos($filtros);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $eventos
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener eventos de seguridad: ' . $e->getMessage()
            ]);
        }
        break;
        
    case $request === '/admin/seguridad/estadisticas' && $method === 'GET':
        try {
            // Verificar autenticación
            if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_rol'])) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'No autenticado'
                ]);
                break;
            }
            
            // Solo administradores pueden acceder
            if (strtolower($_SESSION['user_rol']) !== 'admin') {
                http_response_code(403);
                echo json_encode([
                    'success' => false,
                    'message' => 'Permisos insuficientes'
                ]);
                break;
            }
            
            $eventoSeguridad = new EventoSeguridad();
            $estadisticas = $eventoSeguridad->obtenerEstadisticas();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $estadisticas
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener estadísticas de seguridad: ' . $e->getMessage()
            ]);
        }
        break;
        
    // Rutas de contactos
    case $request === '/contactos' && $method === 'POST':
        ob_clean(); // Limpiar buffer antes de respuesta JSON
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
            'error' => 'Ruta no encontrada',
            'available_routes' => [
                'POST /auth/login',
                'GET /auth/check',
                'GET /auth/me',
                'POST /auth/logout',
                'GET /usuarios',
                'GET /admin/usuarios',
                'POST /admin/usuarios',
                'PUT /admin/usuarios/{id}',
                'DELETE /admin/usuarios/{id}',
                'GET /admin/usuarios/estadisticas',
                'GET /admin/seguridad',
                'GET /admin/seguridad/estadisticas',
                'POST /contactos',
                'GET /contactos',
                'GET /contactos/estadisticas',
                'PUT /contactos/{id}',
                'DELETE /contactos/{id}'
            ]
        ]);
}

// Finalizar el procesamiento
?>