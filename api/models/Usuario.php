<?php
require_once __DIR__ . '/../utils/Database.php';

class Usuario {
    private $db;

    public function __construct() {
        try {
            error_log("Usuario model: Initializing database connection");
            $this->db = Database::getInstance()->getConnection();
            error_log("Usuario model: Database connection successful");
        } catch (Exception $e) {
            error_log("Usuario model: Database connection failed - " . $e->getMessage());
            throw new Exception("Failed to initialize Usuario model: " . $e->getMessage());
        }
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT id, email, nombre, rol, esta_activo, email_verificado FROM usuarios");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function login($email, $password) {
        try {
            error_log("Usuario model: Starting login process for email: " . $email);
            
            // Verificar que la conexión esté disponible
            if (!$this->db) {
                throw new Exception('Database connection not available');
            }
            
            error_log("Usuario model: Preparing SQL query");
            $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE email = ? AND esta_activo = 1");
            
            error_log("Usuario model: Executing query with email: " . $email);
            $stmt->execute([$email]);
            
            error_log("Usuario model: Fetching user data");
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                error_log("Usuario model: User found - ID: " . $user['id'] . ", Email: " . $user['email']);
                error_log("Usuario model: User active status: " . ($user['esta_activo'] ? 'true' : 'false'));
                error_log("Usuario model: Verifying password");
                
                if (password_verify($password, $user['hash_password'])) {
                    error_log("Usuario model: Password verification successful");
                    // No incluir la contraseña en el resultado
                    unset($user['hash_password']);
                    return $user;
                } else {
                    error_log("Usuario model: Password verification failed");
                }
            } else {
                error_log("Usuario model: No user found with email: " . $email);
                
                // Verificar si el usuario existe pero está inactivo
                $stmt2 = $this->db->prepare("SELECT id, esta_activo FROM usuarios WHERE email = ?");
                $stmt2->execute([$email]);
                $inactiveUser = $stmt2->fetch(PDO::FETCH_ASSOC);
                
                if ($inactiveUser) {
                    error_log("Usuario model: User exists but is inactive - ID: " . $inactiveUser['id']);
                } else {
                    error_log("Usuario model: User does not exist in database");
                }
            }
            
            return false;
            
        } catch (PDOException $e) {
            error_log("Usuario model: PDO Error in login - " . $e->getMessage());
            throw new Exception("Database error during login: " . $e->getMessage());
        } catch (Exception $e) {
            error_log("Usuario model: General error in login - " . $e->getMessage());
            throw new Exception("Login process failed: " . $e->getMessage());
        }
    }



    public function create($data) {
        $uuid = $this->generateUUID();
        
        $stmt = $this->db->prepare("
            INSERT INTO usuarios (id, email, nombre, rol, hash_password, esta_activo, email_verificado) 
            VALUES (?, ?, ?, ?, ?, 1, 0)
        ");
        
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        return $stmt->execute([
            $uuid,
            $data['email'],
            $data['nombre'],
            $data['rol'],
            $hashedPassword
        ]);
    }

    public function obtenerTodos() {
        try {
            $stmt = $this->db->query("
                SELECT id, email, nombre, rol, esta_activo, email_verificado, 
                       fecha_creacion, ultimo_acceso
                FROM usuarios 
                ORDER BY fecha_creacion DESC
            ");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Error al obtener usuarios: " . $e->getMessage());
            return [];
        }
    }

    public function crear($datos) {
        try {
            // Generar UUID usando PHP en lugar de MySQL
            $uuid = $this->generateUUID();
            
            $stmt = $this->db->prepare("
                INSERT INTO usuarios (id, email, nombre, rol, hash_password, esta_activo, email_verificado, fecha_creacion) 
                VALUES (?, ?, ?, ?, ?, ?, 0, NOW())
            ");
            
            $hashedPassword = password_hash($datos['password'], PASSWORD_DEFAULT);
            
            $result = $stmt->execute([
                $uuid,
                $datos['email'],
                $datos['nombre'],
                $datos['rol'],
                $hashedPassword,
                $datos['activo']
            ]);
            
            if ($result) {
                return $uuid;
            }
            return false;
        } catch (Exception $e) {
            error_log("Error al crear usuario: " . $e->getMessage());
            return false;
        }
    }

    public function actualizar($id, $datos) {
        try {
            $campos = [];
            $valores = [];
            
            if (isset($datos['nombre'])) {
                $campos[] = "nombre = ?";
                $valores[] = $datos['nombre'];
            }
            
            if (isset($datos['email'])) {
                $campos[] = "email = ?";
                $valores[] = $datos['email'];
            }
            
            if (isset($datos['rol'])) {
                $campos[] = "rol = ?";
                $valores[] = $datos['rol'];
            }
            
            if (isset($datos['activo'])) {
                $campos[] = "esta_activo = ?";
                $valores[] = $datos['activo'];
            }
            
            if (isset($datos['password'])) {
                $campos[] = "hash_password = ?";
                $valores[] = password_hash($datos['password'], PASSWORD_DEFAULT);
            }
            
            if (empty($campos)) {
                return false;
            }
            
            $valores[] = $id;
            
            $stmt = $this->db->prepare("
                UPDATE usuarios 
                SET " . implode(', ', $campos) . "
                WHERE id = ?
            ");
            
            return $stmt->execute($valores);
        } catch (Exception $e) {
            error_log("Error al actualizar usuario: " . $e->getMessage());
            return false;
        }
    }

    public function eliminar($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM usuarios WHERE id = ?");
            return $stmt->execute([$id]);
        } catch (Exception $e) {
            error_log("Error al eliminar usuario: " . $e->getMessage());
            return false;
        }
    }

    public function existeEmail($email) {
        try {
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            return $stmt->fetchColumn() > 0;
        } catch (Exception $e) {
            error_log("Error al verificar email: " . $e->getMessage());
            return false;
        }
    }

    public function existeEmailExcepto($email, $id) {
        try {
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ? AND id != ?");
            $stmt->execute([$email, $id]);
            return $stmt->fetchColumn() > 0;
        } catch (Exception $e) {
            error_log("Error al verificar email: " . $e->getMessage());
            return false;
        }
    }

    public function obtenerPorId($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT id, email, nombre, rol, esta_activo, email_verificado, 
                       fecha_creacion, ultimo_acceso
                FROM usuarios 
                WHERE id = ?
            ");
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Error al obtener usuario por ID: " . $e->getMessage());
            return false;
        }
    }

    private function generateUUID() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    public function obtenerEstadisticas() {
        try {
            $stmt = $this->db->query("
                SELECT 
                    COUNT(*) as total_usuarios,
                    COUNT(CASE WHEN esta_activo = 1 THEN 1 END) as usuarios_activos,
                    COUNT(CASE WHEN esta_activo = 0 THEN 1 END) as usuarios_inactivos,
                    COUNT(CASE WHEN rol = 'admin' THEN 1 END) as administradores,
                    COUNT(CASE WHEN rol = 'editor' THEN 1 END) as editores,
                    COUNT(CASE WHEN rol = 'viewer' THEN 1 END) as visualizadores
                FROM usuarios
            ");
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Error al obtener estadísticas de usuarios: " . $e->getMessage());
            return [
                'total_usuarios' => 0,
                'usuarios_activos' => 0,
                'usuarios_inactivos' => 0,
                'administradores' => 0,
                'editores' => 0,
                'visualizadores' => 0
            ];
        }
    }
}
?>