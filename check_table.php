<?php
require_once __DIR__ . '/api/utils/Database.php';

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    echo "📋 Estructura de la tabla usuarios:\n";
    $stmt = $conn->query('DESCRIBE usuarios');
    while($row = $stmt->fetch()) {
        echo "- {$row['Field']} ({$row['Type']})\n";
    }
    
    echo "\n📋 Datos de la tabla usuarios:\n";
    $stmt = $conn->query('SELECT * FROM usuarios LIMIT 5');
    while($row = $stmt->fetch()) {
        echo "ID: {$row['id']}, Nombre: {$row['nombre']}, Email: {$row['email']}\n";
        foreach($row as $key => $value) {
            echo "  $key: $value\n";
        }
        echo "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>