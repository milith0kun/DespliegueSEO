<?php
/**
 * Router principal para el servidor PHP integrado
 * Maneja tanto el frontend como la API
 */

// Obtener la URI solicitada con verificación de existencia
$uri = isset($_SERVER['REQUEST_URI']) ? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : '/';
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

// Verificar si es una petición de API
$isApiRequest = (
    strpos($uri, '/api') === 0 || 
    strpos($uri, '/auth') === 0 || 
    strpos($uri, '/usuarios') === 0 || 
    strpos($uri, '/contactos') === 0 ||
    // Solo rutas de admin de API, no archivos HTML
    (strpos($uri, '/admin') === 0 && !preg_match('/\.(html|css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/', $uri)) ||
    // Si es la raíz y el Accept header indica JSON o es una petición AJAX
    ($uri === '/' && (
        (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) ||
        (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') ||
        $method !== 'GET' // POST, PUT, DELETE, etc. van a la API
    ))
);

if ($isApiRequest) {
    // Incluir el archivo de la API
    require_once __DIR__ . '/api/index.php';
    return;
}

// Si es una ruta del frontend
if (strpos($uri, '/frontend') === 0) {
    // Remover /frontend del path
    $uri = substr($uri, 9);
    if (empty($uri) || $uri === '/') {
        $uri = '/index.html';
    }
    $file = __DIR__ . '/frontend' . $uri;
} else {
    // Rutas directas del frontend
    if ($uri === '/' || $uri === '/index.html') {
        $file = __DIR__ . '/frontend/index.html';
    } elseif (strpos($uri, '/admin') === 0) {
        // Rutas de administración - mapear a frontend/admin
        $file = __DIR__ . '/frontend' . $uri;
    } else {
        $file = __DIR__ . '/frontend' . $uri;
    }
}

// Verificar si el archivo existe
if (file_exists($file) && is_file($file)) {
    // Obtener la extensión del archivo
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    
    // Establecer el tipo de contenido apropiado
    switch ($ext) {
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'html':
            header('Content-Type: text/html');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'gif':
            header('Content-Type: image/gif');
            break;
        case 'svg':
            header('Content-Type: image/svg+xml');
            break;
        case 'woff':
        case 'woff2':
            header('Content-Type: font/woff');
            break;
        case 'ttf':
            header('Content-Type: font/ttf');
            break;
        default:
            header('Content-Type: text/plain');
    }
    
    // Servir el archivo
    readfile($file);
    return;
}

// Si no se encuentra el archivo, devolver 404
http_response_code(404);
echo '<!DOCTYPE html><html><head><title>404 - No encontrado</title></head><body><h1>404 - Página no encontrada</h1></body></html>';
?>