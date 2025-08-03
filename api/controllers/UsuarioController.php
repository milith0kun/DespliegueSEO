<?php
// Habilitar reporte de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

require_once __DIR__ . '/../models/Usuario.php';

class UsuarioController {
    public function index() {
        try {
            $usuario = new Usuario();
            $usuarios = $usuario->getAll();
            echo json_encode(['success' => true, 'data' => $usuarios]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }

    public function login() {
        try {
            error_log("=== UsuarioController: Login attempt started ===");
            error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
            error_log("Content type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
            
            // Obtener y validar input
            $rawInput = file_get_contents('php://input');
            error_log("Raw input length: " . strlen($rawInput));
            
            if (empty($rawInput)) {
                error_log("Empty input received");
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'No se recibieron datos']);
                return;
            }
            
            $input = json_decode($rawInput, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("JSON decode error: " . json_last_error_msg());
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Formato JSON inválido']);
                return;
            }
            
            error_log("Input decoded successfully: " . json_encode($input, JSON_UNESCAPED_UNICODE));
            
            // Validar campos requeridos
            if (!isset($input['email']) || !isset($input['password'])) {
                error_log("Missing required fields - email: " . (isset($input['email']) ? 'present' : 'missing') . ", password: " . (isset($input['password']) ? 'present' : 'missing'));
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Email y contraseña son requeridos']);
                return;
            }
            
            // Validar formato de email
            if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
                error_log("Invalid email format: " . $input['email']);
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Formato de email inválido']);
                return;
            }
            
            // Validar longitud de contraseña
            if (strlen($input['password']) < 1) {
                error_log("Empty password provided");
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'La contraseña no puede estar vacía']);
                return;
            }

            error_log("UsuarioController: Creating Usuario instance");
            $usuario = new Usuario();
            error_log("UsuarioController: Usuario instance created successfully");
            
            error_log("UsuarioController: Attempting login for email: " . $input['email']);
            $userData = $usuario->login($input['email'], $input['password']);
            
            if ($userData) {
                error_log("UsuarioController: Login successful for user: " . $userData['email']);
                
                // Verificar que la sesión esté disponible
                if (session_status() !== PHP_SESSION_ACTIVE) {
                    error_log("Session not active, starting session");
                    session_start();
                }
                
                // Guardar datos en sesión
                $_SESSION['user_id'] = $userData['id'];
                $_SESSION['user_email'] = $userData['email'];
                $_SESSION['user_rol'] = $userData['rol'];
                $_SESSION['user_nombre'] = $userData['nombre'];
                
                error_log("Session data saved - ID: " . $_SESSION['user_id'] . ", Role: " . $_SESSION['user_rol']);
                
                $response = [
                    'success' => true, 
                    'message' => 'Login exitoso',
                    'data' => [
                        'id' => $userData['id'],
                        'email' => $userData['email'],
                        'nombre' => $userData['nombre'],
                        'rol' => $userData['rol']
                    ]
                ];
                
                error_log("UsuarioController: Sending success response");
                echo json_encode($response, JSON_UNESCAPED_UNICODE);
                
            } else {
                error_log("UsuarioController: Login failed - invalid credentials for email: " . $input['email']);
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Credenciales inválidas'], JSON_UNESCAPED_UNICODE);
            }
            
        } catch (Exception $e) {
            error_log("=== UsuarioController: Login Exception ===");
            error_log("Exception message: " . $e->getMessage());
            error_log("Exception file: " . $e->getFile() . ":" . $e->getLine());
            error_log("Exception trace: " . $e->getTraceAsString());
            
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Error interno del servidor',
                'debug' => $e->getMessage() // Incluir detalles del error para debugging
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    public function checkAuth() {
        try {
            // La sesión ya está iniciada en index.php
            if (isset($_SESSION['user_id'])) {
                echo json_encode([
                    'authenticated' => true,
                    'success' => true,
                    'data' => [
                        'id' => $_SESSION['user_id'],
                        'email' => $_SESSION['user_email'],
                        'nombre' => $_SESSION['user_nombre'],
                        'rol' => $_SESSION['user_rol']
                    ]
                ]);
            } else {
                echo json_encode(['authenticated' => false, 'success' => false]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }

    public function me() {
        try {
            // La sesión ya está iniciada en index.php
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'No autenticado']);
                return;
            }

            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $_SESSION['user_id'],
                    'email' => $_SESSION['user_email'],
                    'nombre' => $_SESSION['user_nombre'],
                    'rol' => $_SESSION['user_rol']
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }

    public function logout() {
        try {
            // La sesión ya está iniciada en index.php
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logout exitoso']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }
}
?>