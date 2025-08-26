<?php
/**
 * Controlador de Gestión de Usuarios
 * Maneja las operaciones CRUD para usuarios del sistema
 */

require_once __DIR__ . '/../models/Usuario.php';
require_once __DIR__ . '/../models/EventoSeguridad.php';

class UsuariosController {
    private $usuarioModel;
    private $eventoSeguridad;
    
    public function __construct() {
        $this->usuarioModel = new Usuario();
        $this->eventoSeguridad = new EventoSeguridad();
    }
    
    /**
     * Listar todos los usuarios
     */
    public function listar() {
        try {
            // Verificar autenticación
            if (!$this->verificarAutenticacion()) {
                return;
            }
            
            $usuarios = $this->usuarioModel->obtenerTodos();
            
            // Registrar evento de acceso a datos
            $this->registrarEvento('data_access', 'Consulta de lista de usuarios');
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $usuarios
            ]);
            
        } catch (Exception $e) {
            error_log("Error en listar usuarios: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor'
            ]);
        }
    }
    
    /**
     * Crear nuevo usuario
     */
    public function crear() {
        try {
            // Verificar autenticación
            if (!$this->verificarAutenticacion()) {
                return;
            }
            
            // Obtener datos del request
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validar datos requeridos
            $errores = $this->validarDatosUsuario($input);
            if (!empty($errores)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Datos inválidos',
                    'errors' => $errores
                ]);
                return;
            }
            
            // Verificar si el email ya existe
            if ($this->usuarioModel->existeEmail($input['email'])) {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'message' => 'El email ya está registrado'
                ]);
                return;
            }
            
            // Crear usuario
            $datosUsuario = [
                'nombre' => $input['nombre'],
                'email' => $input['email'],
                'password' => $input['password'],
                'rol' => $input['rol'] ?? 'viewer',
                'activo' => $input['activo'] ?? 1
            ];
            
            $usuarioId = $this->usuarioModel->crear($datosUsuario);
            
            if ($usuarioId) {
                // Registrar evento de seguridad
                $this->registrarEvento('user_changes', 'Usuario creado: ' . $input['email'], [
                    'usuario_creado_id' => $usuarioId,
                    'usuario_creado_email' => $input['email'],
                    'usuario_creado_rol' => $datosUsuario['rol']
                ]);
                
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Usuario creado exitosamente',
                    'data' => ['id' => $usuarioId]
                ]);
            } else {
                throw new Exception('Error al crear usuario');
            }
            
        } catch (Exception $e) {
            error_log("Error en crear usuario: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor'
            ]);
        }
    }
    
    /**
     * Actualizar usuario existente
     */
    public function actualizar($id) {
        try {
            // Verificar autenticación
            if (!$this->verificarAutenticacion()) {
                return;
            }
            
            // Obtener datos del request
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validar que el usuario existe
            $usuarioExistente = $this->usuarioModel->obtenerPorId($id);
            if (!$usuarioExistente) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ]);
                return;
            }
            
            // Validar datos
            $errores = $this->validarDatosUsuario($input, $id);
            if (!empty($errores)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Datos inválidos',
                    'errors' => $errores
                ]);
                return;
            }
            
            // Verificar si el email ya existe (excepto el usuario actual)
            if (isset($input['email']) && $this->usuarioModel->existeEmailExcepto($input['email'], $id)) {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'message' => 'El email ya está registrado por otro usuario'
                ]);
                return;
            }
            
            // Preparar datos para actualización
            $datosActualizacion = [];
            $cambios = [];
            
            if (isset($input['nombre']) && $input['nombre'] !== $usuarioExistente['nombre']) {
                $datosActualizacion['nombre'] = $input['nombre'];
                $cambios['nombre'] = ['anterior' => $usuarioExistente['nombre'], 'nuevo' => $input['nombre']];
            }
            
            if (isset($input['email']) && $input['email'] !== $usuarioExistente['email']) {
                $datosActualizacion['email'] = $input['email'];
                $cambios['email'] = ['anterior' => $usuarioExistente['email'], 'nuevo' => $input['email']];
            }
            
            if (isset($input['rol']) && $input['rol'] !== $usuarioExistente['rol']) {
                $datosActualizacion['rol'] = $input['rol'];
                $cambios['rol'] = ['anterior' => $usuarioExistente['rol'], 'nuevo' => $input['rol']];
            }
            
            if (isset($input['activo']) && (bool)$input['activo'] !== (bool)$usuarioExistente['esta_activo']) {
                $datosActualizacion['activo'] = $input['activo'];
                $cambios['activo'] = ['anterior' => $usuarioExistente['esta_activo'], 'nuevo' => (bool)$input['activo']];
            }
            
            if (isset($input['password']) && !empty($input['password'])) {
                $datosActualizacion['password'] = $input['password'];
                $cambios['password'] = 'Contraseña modificada';
            }
            
            // Si no hay cambios, retornar éxito
            if (empty($datosActualizacion)) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'No hay cambios para actualizar'
                ]);
                return;
            }
            
            // Actualizar usuario
            $resultado = $this->usuarioModel->actualizar($id, $datosActualizacion);
            
            if ($resultado) {
                // Registrar evento de seguridad
                $this->registrarEvento('user_changes', 'Usuario actualizado: ' . $usuarioExistente['email'], [
                    'usuario_modificado_id' => $id,
                    'usuario_modificado_email' => $usuarioExistente['email'],
                    'cambios' => $cambios
                ]);
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Usuario actualizado exitosamente'
                ]);
            } else {
                throw new Exception('Error al actualizar usuario');
            }
            
        } catch (Exception $e) {
            error_log("Error en actualizar usuario: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor'
            ]);
        }
    }
    
    /**
     * Eliminar usuario
     */
    public function eliminar($id) {
        try {
            // Verificar autenticación
            if (!$this->verificarAutenticacion()) {
                return;
            }
            
            // Verificar que el usuario existe
            $usuario = $this->usuarioModel->obtenerPorId($id);
            if (!$usuario) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ]);
                return;
            }
            
            // No permitir eliminar el propio usuario
            if (isset($_SESSION['user_id']) && $_SESSION['user_id'] === $id) {
                http_response_code(403);
                echo json_encode([
                    'success' => false,
                    'message' => 'No puedes eliminar tu propio usuario'
                ]);
                return;
            }
            
            // Eliminar usuario
            $resultado = $this->usuarioModel->eliminar($id);
            
            if ($resultado) {
                // Registrar evento de seguridad
                $this->registrarEvento('user_changes', 'Usuario eliminado: ' . $usuario['email'], [
                    'usuario_eliminado_id' => $id,
                    'usuario_eliminado_email' => $usuario['email'],
                    'usuario_eliminado_rol' => $usuario['rol']
                ]);
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Usuario eliminado exitosamente'
                ]);
            } else {
                throw new Exception('Error al eliminar usuario');
            }
            
        } catch (Exception $e) {
            error_log("Error en eliminar usuario: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor'
            ]);
        }
    }
    
    /**
     * Obtener estadísticas de usuarios
     */
    public function obtenerEstadisticas() {
        try {
            // Verificar autenticación
            if (!$this->verificarAutenticacion()) {
                return;
            }
            
            $estadisticas = $this->usuarioModel->obtenerEstadisticas();
            
            // Registrar evento de acceso a datos
            $this->registrarEvento('data_access', 'Consulta de estadísticas de usuarios');
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $estadisticas
            ]);
            
        } catch (Exception $e) {
            error_log("Error en obtener estadísticas: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor'
            ]);
        }
    }
    
    /**
     * Verificar autenticación del usuario
     */
    private function verificarAutenticacion() {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_rol'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'No autenticado'
            ]);
            return false;
        }
        
        // Solo administradores pueden gestionar usuarios
        if (strtolower($_SESSION['user_rol']) !== 'admin') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Permisos insuficientes'
            ]);
            return false;
        }
        
        return true;
    }
    
    /**
     * Validar datos de usuario
     */
    private function validarDatosUsuario($datos, $usuarioId = null) {
        $errores = [];
        
        // Validar nombre
        if (isset($datos['nombre'])) {
            if (empty(trim($datos['nombre']))) {
                $errores['nombre'] = 'El nombre es requerido';
            } elseif (strlen($datos['nombre']) < 2) {
                $errores['nombre'] = 'El nombre debe tener al menos 2 caracteres';
            } elseif (strlen($datos['nombre']) > 100) {
                $errores['nombre'] = 'El nombre no puede exceder 100 caracteres';
            }
        } elseif ($usuarioId === null) {
            $errores['nombre'] = 'El nombre es requerido';
        }
        
        // Validar email
        if (isset($datos['email'])) {
            if (empty(trim($datos['email']))) {
                $errores['email'] = 'El email es requerido';
            } elseif (!filter_var($datos['email'], FILTER_VALIDATE_EMAIL)) {
                $errores['email'] = 'El email no tiene un formato válido';
            } elseif (strlen($datos['email']) > 255) {
                $errores['email'] = 'El email no puede exceder 255 caracteres';
            }
        } elseif ($usuarioId === null) {
            $errores['email'] = 'El email es requerido';
        }
        
        // Validar contraseña (solo para creación o si se proporciona)
        if (isset($datos['password'])) {
            if (!empty($datos['password'])) {
                if (strlen($datos['password']) < 6) {
                    $errores['password'] = 'La contraseña debe tener al menos 6 caracteres';
                } elseif (strlen($datos['password']) > 255) {
                    $errores['password'] = 'La contraseña no puede exceder 255 caracteres';
                }
            }
        } elseif ($usuarioId === null) {
            $errores['password'] = 'La contraseña es requerida';
        }
        
        // Validar rol
        if (isset($datos['rol'])) {
            $rolesValidos = ['admin', 'editor', 'viewer'];
            if (!in_array($datos['rol'], $rolesValidos)) {
                $errores['rol'] = 'El rol debe ser uno de: ' . implode(', ', $rolesValidos);
            }
        }
        
        // Validar estado activo
        if (isset($datos['activo'])) {
            if (!is_bool($datos['activo']) && !in_array($datos['activo'], [0, 1, '0', '1', true, false])) {
                $errores['activo'] = 'El estado activo debe ser verdadero o falso';
            }
        }
        
        return $errores;
    }
    
    /**
     * Registrar evento de seguridad
     */
    private function registrarEvento($tipo, $accion, $detalles = []) {
        try {
            $this->eventoSeguridad->registrar([
                'tipo' => $tipo,
                'usuario_id' => $_SESSION['user_id'] ?? null,
                'accion' => $accion,
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
                'detalles' => $detalles
            ]);
        } catch (Exception $e) {
            error_log("Error al registrar evento de seguridad: " . $e->getMessage());
        }
    }
    
    /**
     * Métodos de autenticación
     */
    public function login() {
        try {
            // Obtener y validar input
            $rawInput = file_get_contents('php://input');
            
            if (empty($rawInput)) {
                http_response_code(400);
                ob_clean();
                echo json_encode(['success' => false, 'message' => 'No se recibieron datos']);
                return;
            }
            
            $input = json_decode($rawInput, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("JSON decode error: " . json_last_error_msg());
                http_response_code(400);
                ob_clean();
                echo json_encode(['success' => false, 'message' => 'Formato JSON inválido']);
                return;
            }
            
            // Validar campos requeridos
            if (!isset($input['email']) || !isset($input['password'])) {
                http_response_code(400);
                ob_clean();
                echo json_encode(['success' => false, 'message' => 'Email y contraseña son requeridos']);
                return;
            }
            
            // Validar formato de email
            if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                ob_clean();
                echo json_encode(['success' => false, 'message' => 'Formato de email inválido']);
                return;
            }
            
            // Validar longitud de contraseña
            if (strlen($input['password']) < 1) {
                http_response_code(400);
                ob_clean();
                echo json_encode(['success' => false, 'message' => 'La contraseña no puede estar vacía']);
                return;
            }

            $userData = $this->usuarioModel->login($input['email'], $input['password']);
            
            if ($userData) {
                // Guardar datos en sesión
                $_SESSION['user_id'] = $userData['id'];
                $_SESSION['user_email'] = $userData['email'];
                $_SESSION['user_rol'] = $userData['rol'];
                $_SESSION['user_nombre'] = $userData['nombre'];
                
                // Debug: Log session data
                error_log("Login successful - Session ID: " . session_id());
                error_log("Session data saved: " . json_encode([
                    'user_id' => $_SESSION['user_id'],
                    'user_email' => $_SESSION['user_email'],
                    'user_rol' => $_SESSION['user_rol']
                ]));
                
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
                
                ob_clean();
                echo json_encode($response, JSON_UNESCAPED_UNICODE);
                
            } else {
                http_response_code(401);
                ob_clean();
                echo json_encode(['success' => false, 'message' => 'Credenciales inválidas'], JSON_UNESCAPED_UNICODE);
            }
            
        } catch (Exception $e) {
            error_log("UsuariosController login error: " . $e->getMessage());
            
            http_response_code(500);
            ob_clean();
            echo json_encode([
                'success' => false, 
                'message' => 'Error interno del servidor'
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    public function checkAuth() {
        try {
            // Debug: Log session info
            error_log("CheckAuth - Session ID: " . session_id());
            error_log("CheckAuth - Session data: " . json_encode($_SESSION));
            error_log("CheckAuth - user_id isset: " . (isset($_SESSION['user_id']) ? 'true' : 'false'));
            
            if (isset($_SESSION['user_id'])) {
                ob_clean();
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
                ob_clean();
                echo json_encode(['authenticated' => false, 'success' => false]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            ob_clean();
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }

    public function me() {
        try {
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                ob_clean();
                echo json_encode(['success' => false, 'message' => 'No autenticado']);
                return;
            }

            ob_clean();
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
            ob_clean();
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }

    public function logout() {
        try {
            session_destroy();
            ob_clean();
            echo json_encode(['success' => true, 'message' => 'Logout exitoso']);
        } catch (Exception $e) {
            http_response_code(500);
            ob_clean();
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }
}
?>