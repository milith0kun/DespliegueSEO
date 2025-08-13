<?php
require_once __DIR__ . '/../config/database.php';

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        try {
            // Verificar configuración
            if (!defined('DB_HOST') || !defined('DB_USER') || !defined('DB_NAME')) {
                throw new Exception('Database configuration constants are not properly defined');
            }
            
            // Construir DSN para MySQL
            $dsn = "mysql:host=" . DB_HOST;
            
            if (defined('DB_PORT') && !empty(DB_PORT)) {
                $dsn .= ";port=" . DB_PORT;
            }
            
            $dsn .= ";dbname=" . DB_NAME . ";charset=" . (defined('DB_CHARSET') ? DB_CHARSET : 'utf8mb4');
            
            // Opciones de PDO
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false
            ];

            // Crear conexión MySQL
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            
            // Verificar conexión
            $this->conn->query('SELECT 1');
            
        } catch (PDOException $e) {
            throw new PDOException("Database connection failed: " . $e->getMessage(), (int)$e->getCode());
        } catch (Exception $e) {
            throw new Exception("Database initialization failed: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }

    // Prevenir la clonación del objeto
    private function __clone() {}

    // Prevenir la deserialización del objeto
    public function __wakeup() {
        throw new Exception("No se puede deserializar una conexión a la base de datos");
    }
}
?>