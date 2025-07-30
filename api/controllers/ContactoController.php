<?php
require_once __DIR__ . '/../models/Contacto.php';
require_once __DIR__ . '/../utils/EmailService.php';

class ContactoController {
    private $contactoModel;
    private $emailService;
    
    public function __construct() {
        $this->contactoModel = new Contacto();
        $this->emailService = new EmailService();
    }
    
    /**
     * Crear un nuevo contacto desde el formulario público
     */
    public function crear() {
        try {
            // Verificar método POST
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Método no permitido']);
                return;
            }
            
            // Obtener datos del formulario
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validar datos requeridos
            if (empty($input['nombre']) || empty($input['email']) || empty($input['mensaje'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Faltan campos requeridos']);
                return;
            }
            
            // Validar email
            if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Email inválido']);
                return;
            }
            
            // Preparar datos
            $datos = [
                'nombre' => trim($input['nombre']),
                'email' => trim($input['email']),
                'telefono' => trim($input['telefono'] ?? ''),
                'empresa' => trim($input['empresa'] ?? ''),
                'mensaje' => trim($input['mensaje']),
                'interes_servicio' => trim($input['interes_servicio'] ?? 'general')
            ];
            
            // Crear contacto en la base de datos
            $resultado = $this->contactoModel->crear($datos);
            
            if ($resultado) {
                // Enviar emails de notificación
                $emailEnviado = $this->emailService->enviarNotificacionContacto($datos);
                $confirmacionEnviada = $this->emailService->enviarConfirmacionCliente($datos);
                
                // Log de resultados de email
                if (!$emailEnviado) {
                    error_log("Advertencia: No se pudo enviar email de notificación para contacto: " . $datos['email']);
                }
                
                if (!$confirmacionEnviada) {
                    error_log("Advertencia: No se pudo enviar email de confirmación a: " . $datos['email']);
                }
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Mensaje enviado correctamente. Te contactaremos pronto.',
                    'email_sent' => $emailEnviado,
                    'confirmation_sent' => $confirmacionEnviada
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al enviar el mensaje']);
            }
            
        } catch (Exception $e) {
            error_log("Error en ContactoController::crear: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }
    
    /**
     * Obtener lista de contactos (para admin)
     */
    public function index() {
        try {
            // Verificar autenticación (implementar según tu sistema de auth)
            // $this->verificarAutenticacion();
            
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            
            $filtros = [];
            if (!empty($_GET['estado'])) {
                $filtros['estado'] = $_GET['estado'];
            }
            if (!empty($_GET['servicio'])) {
                $filtros['servicio'] = $_GET['servicio'];
            }
            
            $contactos = $this->contactoModel->obtenerTodos($page, $limit, $filtros);
            $total = $this->contactoModel->contarTotal($filtros);
            
            $pagination = [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit)
            ];
            
            echo json_encode([
                'success' => true,
                'data' => $contactos,
                'pagination' => $pagination
            ]);
            
        } catch (Exception $e) {
            error_log("Error en ContactoController::index: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al cargar contactos']);
        }
    }
    
    /**
     * Obtener estadísticas de contactos
     */
    public function estadisticas() {
        try {
            $stats = $this->contactoModel->obtenerEstadisticas();
            
            echo json_encode([
                'success' => true,
                'data' => $stats
            ]);
            
        } catch (Exception $e) {
            error_log("Error en ContactoController::estadisticas: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al cargar estadísticas']);
        }
    }
    
    /**
     * Actualizar estado de contacto
     */
    public function actualizarEstado($id) {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Método no permitido']);
                return;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['estado'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Estado requerido']);
                return;
            }
            
            $resultado = $this->contactoModel->actualizarEstado($id, $input['estado']);
            
            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Estado actualizado correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al actualizar estado']);
            }
            
        } catch (Exception $e) {
            error_log("Error en ContactoController::actualizarEstado: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }
    
    /**
     * Eliminar contacto
     */
    public function eliminar($id) {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Método no permitido']);
                return;
            }
            
            $resultado = $this->contactoModel->eliminar($id);
            
            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Contacto eliminado correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al eliminar contacto']);
            }
            
        } catch (Exception $e) {
            error_log("Error en ContactoController::eliminar: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
        }
    }
    
    
}
?>