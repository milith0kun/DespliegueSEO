<?php
require_once __DIR__ . '/../utils/Database.php';

class Usuario {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT id, email, nombre, rol, esta_activo, email_verificado, fecha_creacion FROM usuarios");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function login($email, $password) {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE email = ? AND esta_activo = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['hash_password'])) {
            return $user;
        }
        
        return false;
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