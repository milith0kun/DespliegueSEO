<?php
require_once __DIR__ . '/../utils/Database.php';

class Contacto {
    private $conn;
    
    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }
    
    /**
     * Crear un nuevo contacto
     */
    public function crear($datos) {
        try {
            $sql = "INSERT INTO contactos (nombre, email, telefono, empresa, mensaje, interes_servicio, estado, fuente_lead) 
                    VALUES (:nombre, :email, :telefono, :empresa, :mensaje, :interes_servicio, 'NUEVO', 'SITIO_WEB')";
            
            $stmt = $this->conn->prepare($sql);
            
            $stmt->bindParam(':nombre', $datos['nombre']);
            $stmt->bindParam(':email', $datos['email']);
            $stmt->bindParam(':telefono', $datos['telefono']);
            $stmt->bindParam(':empresa', $datos['empresa']);
            $stmt->bindParam(':mensaje', $datos['mensaje']);
            $stmt->bindParam(':interes_servicio', $datos['interes_servicio']);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error al crear contacto: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Obtener todos los contactos con paginación
     */
    public function obtenerTodos($page = 1, $limit = 10, $filtros = []) {
        try {
            $offset = ($page - 1) * $limit;
            
            $sql = "SELECT * FROM contactos WHERE 1=1";
            $params = [];
            
            // Aplicar filtros
            if (!empty($filtros['estado'])) {
                $sql .= " AND estado = :estado";
                $params[':estado'] = $filtros['estado'];
            }
            
            if (!empty($filtros['servicio'])) {
                $sql .= " AND interes_servicio = :servicio";
                $params[':servicio'] = $filtros['servicio'];
            }
            
            $sql .= " ORDER BY creado_en DESC LIMIT :limit OFFSET :offset";
            
            $stmt = $this->conn->prepare($sql);
            
            // Bind parámetros
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al obtener contactos: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Contar total de contactos
     */
    public function contarTotal($filtros = []) {
        try {
            $sql = "SELECT COUNT(*) as total FROM contactos WHERE 1=1";
            $params = [];
            
            // Aplicar filtros
            if (!empty($filtros['estado'])) {
                $sql .= " AND estado = :estado";
                $params[':estado'] = $filtros['estado'];
            }
            
            if (!empty($filtros['servicio'])) {
                $sql .= " AND interes_servicio = :servicio";
                $params[':servicio'] = $filtros['servicio'];
            }
            
            $stmt = $this->conn->prepare($sql);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result['total'];
        } catch (PDOException $e) {
            error_log("Error al contar contactos: " . $e->getMessage());
            return 0;
        }
    }
    
    /**
     * Obtener contacto por ID
     */
    public function obtenerPorId($id) {
        try {
            $sql = "SELECT * FROM contactos WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al obtener contacto: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Actualizar estado de contacto
     */
    public function actualizarEstado($id, $estado) {
        try {
            $sql = "UPDATE contactos SET estado = :estado, actualizado_en = CURRENT_TIMESTAMP WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':estado', $estado);
            $stmt->bindParam(':id', $id);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error al actualizar contacto: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Eliminar contacto
     */
    public function eliminar($id) {
        try {
            $sql = "DELETE FROM contactos WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error al eliminar contacto: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Obtener estadísticas de contactos
     */
    public function obtenerEstadisticas() {
        try {
            $sql = "SELECT 
                        COUNT(*) as total,
                        SUM(CASE WHEN estado = 'NUEVO' THEN 1 ELSE 0 END) as nuevos,
                        SUM(CASE WHEN estado = 'CONTACTADO' THEN 1 ELSE 0 END) as contactados,
                        SUM(CASE WHEN estado = 'EN_PROGRESO' THEN 1 ELSE 0 END) as en_progreso,
                        SUM(CASE WHEN estado = 'CALIFICADO' THEN 1 ELSE 0 END) as calificados,
                        SUM(CASE WHEN estado = 'CERRADO_GANADO' THEN 1 ELSE 0 END) as cerrados_ganados
                    FROM contactos";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al obtener estadísticas: " . $e->getMessage());
            return null;
        }
    }
}
?>