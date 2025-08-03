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
        $stmt = $this->db->query("SELECT id, email, nombre, rol, esta_activo, email_verificado, fecha_creacion FROM usuarios");
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

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO usuarios (id, email, nombre, rol, hash_password, esta_activo, email_verificado) 
            VALUES (UUID(), ?, ?, ?, ?, 1, 0)
        ");
        
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        return $stmt->execute([
            $data['email'],
            $data['nombre'],
            $data['rol'],
            $hashedPassword
        ]);
    }
}
?>