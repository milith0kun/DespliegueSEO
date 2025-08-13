<?php
require_once 'config.php';
require_once 'api/utils/Database.php';

echo "=== ESTRUCTURA TABLA USUARIOS ===\n";

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $stmt = $pdo->query('DESCRIBE usuarios');
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach($columns as $col) {
        echo $col['Field'] . ': ' . $col['Type'] . "\n";
    }
    
    echo "\n=== USUARIOS EXISTENTES ===\n";
    $stmt = $pdo->query('SELECT id, email, rol FROM usuarios LIMIT 3');
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach($usuarios as $user) {
        echo "ID: {$user['id']}, Email: {$user['email']}, Rol: {$user['rol']}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>