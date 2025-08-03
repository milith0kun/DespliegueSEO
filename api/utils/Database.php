<?php
require_once __DIR__ . '/../config/database.php';

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        try {
            error_log("=== Database Connection Attempt Started ===");
            error_log("DB_HOST: " . (defined('DB_HOST') ? DB_HOST : 'NOT_DEFINED'));
            error_log("DB_PORT: " . (defined('DB_PORT') ? DB_PORT : 'NOT_DEFINED'));
            error_log("DB_USER: " . (defined('DB_USER') ? DB_USER : 'NOT_DEFINED'));
            error_log("DB_NAME: " . (defined('DB_NAME') ? DB_NAME : 'NOT_DEFINED'));
            error_log("DB_CHARSET: " . (defined('DB_CHARSET') ? DB_CHARSET : 'NOT_DEFINED'));
            
            // Verificar que todas las constantes estén definidas
            if (!defined('DB_HOST') || !defined('DB_USER') || !defined('DB_NAME')) {
                throw new Exception('Database configuration constants are not properly defined');
            }
            
            // Construir DSN con configuración dinámica
            $dsn = "mysql:host=" . DB_HOST;
            
            // Agregar puerto solo si está definido y no es el puerto por defecto
            if (defined('DB_PORT') && DB_PORT != '3306' && !empty(DB_PORT)) {
                $dsn .= ";port=" . DB_PORT;
            }
            
            $dsn .= ";dbname=" . DB_NAME;
            
            // Usar charset de configuración si está disponible
            if (defined('DB_CHARSET') && !empty(DB_CHARSET)) {
                $dsn .= ";charset=" . DB_CHARSET;
            } else {
                $dsn .= ";charset=utf8mb4";
            }
            
            error_log("DSN constructed: " . $dsn);
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::ATTR_PERSISTENT         => false,
                PDO::ATTR_TIMEOUT            => 30, // Aumentado para Hostinger
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . (defined('DB_CHARSET') ? DB_CHARSET : 'utf8mb4')
            ];

            error_log("Attempting PDO connection with timeout 30s...");
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            error_log("PDO connection successful!");
            
            // Configurar collation si está definido
            if (defined('DB_COLLATE') && !empty(DB_COLLATE)) {
                $charset = defined('DB_CHARSET') ? DB_CHARSET : 'utf8mb4';
                $sql = "SET NAMES {$charset} COLLATE " . DB_COLLATE;
                error_log("Setting collation: " . $sql);
                $this->conn->exec($sql);
            }
            
            // Verificar la conexión con una consulta simple
            $test = $this->conn->query('SELECT 1 as test');
            if ($test && $test->fetch()['test'] == 1) {
                error_log("=== Database Connection Test PASSED ===");
            } else {
                throw new Exception('Database connection test failed');
            }
            
            error_log("=== Database Connection Completed Successfully ===");
            
        } catch (PDOException $e) {
            error_log("=== PDO CONNECTION FAILED ===");
            error_log("PDO Error Message: " . $e->getMessage());
            error_log("PDO Error Code: " . $e->getCode());
            error_log("PDO Error File: " . $e->getFile() . ":" . $e->getLine());
            error_log("PDO Error Trace: " . $e->getTraceAsString());
            throw new PDOException("Database connection failed: " . $e->getMessage(), (int)$e->getCode());
        } catch (Exception $e) {
            error_log("=== GENERAL CONNECTION ERROR ===");
            error_log("Error Message: " . $e->getMessage());
            error_log("Error File: " . $e->getFile() . ":" . $e->getLine());
            error_log("Error Trace: " . $e->getTraceAsString());
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