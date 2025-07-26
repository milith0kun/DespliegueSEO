-- Actualizar usuarios con contraseñas conocidas
USE ecosdelseo_db;

-- Eliminar usuarios existentes
DELETE FROM usuarios;

-- Insertar usuarios con contraseñas conocidas
-- Contraseña para admin: admin123
-- Contraseña para jampier: jampier123  
-- Contraseña para dev: dev123

INSERT INTO usuarios (id, email, nombre, rol, hash_password, esta_activo, email_verificado) VALUES 
(UUID(), 'admin@ecosdelseo.com', 'Administrador Principal', 'ADMIN', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true),
(UUID(), 'jampier@ecosdelseo.com', 'Jampier Saife', 'ADMIN', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true),
(UUID(), 'dev@ecosdelseo.com', 'Desarrollador', 'GERENTE', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true);