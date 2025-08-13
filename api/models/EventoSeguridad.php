<?php
/**
 * Modelo de Eventos de Seguridad
 * Maneja el registro y consulta de eventos de seguridad del sistema
 */

require_once __DIR__ . '/../utils/Database.php';

class EventoSeguridad {
    private $db;
    
    public function __construct() {
        try {
            $this->db = Database::getInstance()->getConnection();
        } catch (Exception $e) {
            error_log("EventoSeguridad model: Database connection failed - " . $e->getMessage());
            throw new Exception("Failed to initialize EventoSeguridad model: " . $e->getMessage());
        }
    }
    
    /**
     * Registrar un evento de seguridad
     */
    public function registrar($datos) {
        try {
            $sql = "INSERT INTO eventos_seguridad 
                    (tipo, usuario_id, usuario_nombre, accion, tabla_afectada, registro_id, ip, user_agent, detalles) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->db->prepare($sql);
            
            // Obtener nombre del usuario si no se proporciona
            $usuarioNombre = $datos['usuario_nombre'] ?? null;
            if (!$usuarioNombre && isset($datos['usuario_id'])) {
                $usuarioNombre = $this->obtenerNombreUsuario($datos['usuario_id']);
            }
            
            // Convertir detalles a JSON si es array
            $detalles = $datos['detalles'] ?? [];
            if (is_array($detalles)) {
                $detalles = json_encode($detalles, JSON_UNESCAPED_UNICODE);
            }
            
            $resultado = $stmt->execute([
                $datos['tipo'],
                $datos['usuario_id'] ?? null,
                $usuarioNombre,
                $datos['accion'],
                $datos['tabla_afectada'] ?? null,
                $datos['registro_id'] ?? null,
                $datos['ip'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                $datos['user_agent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
                $detalles
            ]);
            
            return $resultado;
            
        } catch (Exception $e) {
            error_log("Error al registrar evento de seguridad: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Obtener eventos de seguridad con filtros
     */
    public function obtenerEventos($filtros = [], $limite = 100, $offset = 0) {
        try {
            $sql = "SELECT 
                        es.*,
                        u.nombre as usuario_nombre_actual
                    FROM eventos_seguridad es
                    LEFT JOIN usuarios u ON es.usuario_id = u.id
                    WHERE 1=1";
            
            $params = [];
            
            // Aplicar filtros
            if (isset($filtros['tipo']) && !empty($filtros['tipo'])) {
                $sql .= " AND es.tipo = ?";
                $params[] = $filtros['tipo'];
            }
            
            if (isset($filtros['usuario_id']) && !empty($filtros['usuario_id'])) {
                $sql .= " AND es.usuario_id = ?";
                $params[] = $filtros['usuario_id'];
            }
            
            if (isset($filtros['fecha_desde']) && !empty($filtros['fecha_desde'])) {
                $sql .= " AND es.fecha_hora >= ?";
                $params[] = $filtros['fecha_desde'];
            }
            
            if (isset($filtros['fecha_hasta']) && !empty($filtros['fecha_hasta'])) {
                $sql .= " AND es.fecha_hora <= ?";
                $params[] = $filtros['fecha_hasta'];
            }
            
            if (isset($filtros['accion']) && !empty($filtros['accion'])) {
                $sql .= " AND es.accion LIKE ?";
                $params[] = '%' . $filtros['accion'] . '%';
            }
            
            // Ordenar por fecha descendente
            $sql .= " ORDER BY es.fecha_hora DESC";
            
            // Aplicar límite y offset
            if ($limite > 0) {
                $sql .= " LIMIT ? OFFSET ?";
                $params[] = $limite;
                $params[] = $offset;
            }
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            
            $eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Decodificar detalles JSON
            foreach ($eventos as &$evento) {
                if (!empty($evento['detalles'])) {
                    $detallesDecodificados = json_decode($evento['detalles'], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $evento['detalles'] = $detallesDecodificados;
                    }
                }
            }
            
            return $eventos;
            
        } catch (Exception $e) {
            error_log("Error al obtener eventos de seguridad: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Obtener estadísticas de eventos de seguridad
     */
    public function obtenerEstadisticas($diasAtras = 30) {
        try {
            $fechaInicio = date('Y-m-d H:i:s', strtotime("-{$diasAtras} days"));
            
            // Estadísticas generales
            $sql = "SELECT 
                        COUNT(*) as total_eventos,
                        COUNT(CASE WHEN tipo = 'security_alerts' THEN 1 END) as alertas_seguridad,
                        COUNT(CASE WHEN tipo = 'user_changes' THEN 1 END) as cambios_usuarios,
                        COUNT(CASE WHEN tipo = 'data_changes' THEN 1 END) as cambios_datos,
                        COUNT(CASE WHEN tipo = 'login' THEN 1 END) as eventos_login,
                        COUNT(CASE WHEN tipo = 'data_access' THEN 1 END) as accesos_datos,
                        COUNT(CASE WHEN DATE(fecha_hora) = CURDATE() THEN 1 END) as eventos_hoy
                    FROM eventos_seguridad 
                    WHERE fecha_hora >= ?";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$fechaInicio]);
            $resumen = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Eventos por día (últimos 7 días)
            $sqlDias = "SELECT 
                            DATE(fecha_hora) as fecha,
                            COUNT(*) as total,
                            COUNT(CASE WHEN tipo = 'security_alerts' THEN 1 END) as alertas
                        FROM eventos_seguridad 
                        WHERE fecha_hora >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                        GROUP BY DATE(fecha_hora)
                        ORDER BY fecha DESC";
            
            $stmt = $this->db->prepare($sqlDias);
            $stmt->execute();
            $eventosPorDia = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Eventos por tipo
            $sqlTipos = "SELECT 
                            tipo,
                            COUNT(*) as cantidad
                        FROM eventos_seguridad 
                        WHERE fecha_hora >= ?
                        GROUP BY tipo
                        ORDER BY cantidad DESC";
            
            $stmt = $this->db->prepare($sqlTipos);
            $stmt->execute([$fechaInicio]);
            $eventosPorTipo = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Usuarios más activos
            $sqlUsuarios = "SELECT 
                                es.usuario_id,
                                es.usuario_nombre,
                                u.nombre as nombre_actual,
                                COUNT(*) as eventos
                            FROM eventos_seguridad es
                            LEFT JOIN usuarios u ON es.usuario_id = u.id
                            WHERE es.fecha_hora >= ? AND es.usuario_id IS NOT NULL
                            GROUP BY es.usuario_id, es.usuario_nombre, u.nombre
                            ORDER BY eventos DESC
                            LIMIT 10";
            
            $stmt = $this->db->prepare($sqlUsuarios);
            $stmt->execute([$fechaInicio]);
            $usuariosActivos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'resumen' => $resumen,
                'eventos_por_dia' => $eventosPorDia,
                'eventos_por_tipo' => $eventosPorTipo,
                'usuarios_activos' => $usuariosActivos,
                'periodo_dias' => $diasAtras
            ];
            
        } catch (Exception $e) {
            error_log("Error al obtener estadísticas de seguridad: " . $e->getMessage());
            return [
                'resumen' => [
                    'total_eventos' => 0,
                    'alertas_seguridad' => 0,
                    'cambios_usuarios' => 0,
                    'cambios_datos' => 0,
                    'eventos_login' => 0,
                    'accesos_datos' => 0,
                    'eventos_hoy' => 0
                ],
                'eventos_por_dia' => [],
                'eventos_por_tipo' => [],
                'usuarios_activos' => [],
                'periodo_dias' => $diasAtras
            ];
        }
    }
    
    /**
     * Limpiar eventos antiguos
     */
    public function limpiarEventosAntiguos($diasAntiguedad = 90) {
        try {
            $fechaLimite = date('Y-m-d H:i:s', strtotime("-{$diasAntiguedad} days"));
            
            // No eliminar alertas de seguridad
            $sql = "DELETE FROM eventos_seguridad 
                    WHERE fecha_hora < ? AND tipo != 'security_alerts'";
            
            $stmt = $this->db->prepare($sql);
            $resultado = $stmt->execute([$fechaLimite]);
            
            $registrosEliminados = $stmt->rowCount();
            
            // Registrar la limpieza
            if ($resultado && $registrosEliminados > 0) {
                $this->registrar([
                    'tipo' => 'data_changes',
                    'accion' => 'Limpieza automática de eventos',
                    'detalles' => [
                        'registros_eliminados' => $registrosEliminados,
                        'fecha_limite' => $fechaLimite,
                        'dias_antiguedad' => $diasAntiguedad
                    ]
                ]);
            }
            
            return $registrosEliminados;
            
        } catch (Exception $e) {
            error_log("Error al limpiar eventos antiguos: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Obtener eventos recientes (últimos 7 días)
     */
    public function obtenerEventosRecientes($limite = 50) {
        $filtros = [
            'fecha_desde' => date('Y-m-d H:i:s', strtotime('-7 days'))
        ];
        
        return $this->obtenerEventos($filtros, $limite);
    }
    
    /**
     * Obtener alertas de seguridad activas
     */
    public function obtenerAlertasActivas($limite = 20) {
        $filtros = [
            'tipo' => 'security_alerts',
            'fecha_desde' => date('Y-m-d H:i:s', strtotime('-30 days'))
        ];
        
        return $this->obtenerEventos($filtros, $limite);
    }
    
    /**
     * Contar eventos por tipo en un período
     */
    public function contarEventosPorTipo($tipo, $diasAtras = 1) {
        try {
            $fechaInicio = date('Y-m-d H:i:s', strtotime("-{$diasAtras} days"));
            
            $sql = "SELECT COUNT(*) as total 
                    FROM eventos_seguridad 
                    WHERE tipo = ? AND fecha_hora >= ?";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$tipo, $fechaInicio]);
            
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            return $resultado['total'] ?? 0;
            
        } catch (Exception $e) {
            error_log("Error al contar eventos por tipo: " . $e->getMessage());
            return 0;
        }
    }
    
    /**
     * Obtener nombre de usuario por ID
     */
    private function obtenerNombreUsuario($usuarioId) {
        try {
            $sql = "SELECT nombre FROM usuarios WHERE id = ? LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$usuarioId]);
            
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            return $usuario['nombre'] ?? null;
            
        } catch (Exception $e) {
            error_log("Error al obtener nombre de usuario: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Verificar si la tabla de eventos existe
     */
    public function verificarTablaExiste() {
        try {
            $sql = "SHOW TABLES LIKE 'eventos_seguridad'";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            
            return $stmt->rowCount() > 0;
            
        } catch (Exception $e) {
            error_log("Error al verificar tabla eventos_seguridad: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Crear tabla de eventos si no existe
     */
    public function crearTablaEventos() {
        try {
            $sql = "CREATE TABLE IF NOT EXISTS eventos_seguridad (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        tipo ENUM('login', 'user_changes', 'data_changes', 'security_alerts', 'data_access') NOT NULL,
                        usuario_id VARCHAR(36),
                        usuario_nombre VARCHAR(100),
                        accion VARCHAR(255) NOT NULL,
                        tabla_afectada VARCHAR(50),
                        registro_id VARCHAR(36),
                        ip VARCHAR(45),
                        user_agent TEXT,
                        detalles JSON,
                        INDEX idx_fecha_hora (fecha_hora),
                        INDEX idx_tipo (tipo),
                        INDEX idx_usuario_id (usuario_id),
                        INDEX idx_tabla_afectada (tabla_afectada)
                    )";
            
            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
            
        } catch (Exception $e) {
            error_log("Error al crear tabla eventos_seguridad: " . $e->getMessage());
            return false;
        }
    }
}
?>