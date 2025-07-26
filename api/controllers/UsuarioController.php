<?php
// Evitar que se muestren errores HTML
error_reporting(0);
ini_set('display_errors', 0);

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
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['email']) || !isset($input['password'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Email y contraseña son requeridos']);
                return;
            }

            $usuario = new Usuario();
            $userData = $usuario->login($input['email'], $input['password']);
            
            if ($userData) {
                // Iniciar sesión
                session_start();
                $_SESSION['user_id'] = $userData['id'];
                $_SESSION['user_email'] = $userData['email'];
                $_SESSION['user_rol'] = $userData['rol'];
                $_SESSION['user_nombre'] = $userData['nombre'];
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Login exitoso',
                    'data' => [
                        'id' => $userData['id'],
                        'email' => $userData['email'],
                        'nombre' => $userData['nombre'],
                        'rol' => $userData['rol']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor: ' . $e->getMessage()]);
        }
    }

    public function checkAuth() {
        try {
            session_start();
            
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
            session_start();
            
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
            session_start();
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logout exitoso']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }
}
?>