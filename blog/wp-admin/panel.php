<?php
/**
 * Archivo de redirección para acceso al panel de WordPress
 * Solución alternativa para el error 403 en wp-admin en Hostinger
 * 
 * Uso: https://ecosdelseo.com/blog/wp-admin/panel.php
 */

// Configuración de seguridad básica
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(dirname(__FILE__)) . '/');
}

// Cargar WordPress
require_once(ABSPATH . 'wp-config.php');
require_once(ABSPATH . 'wp-load.php');
require_once(ABSPATH . 'wp-admin/includes/admin.php');

// Verificar si el usuario está logueado
if (!is_user_logged_in()) {
    // Redirigir a wp-login.php si no está logueado
    wp_redirect(wp_login_url(admin_url()));
    exit;
}

// Verificar permisos de administrador
if (!current_user_can('manage_options')) {
    wp_die(__('No tienes permisos suficientes para acceder a esta página.'));
}

// Si todo está bien, redirigir al dashboard
wp_redirect(admin_url('index.php'));
exit;
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Acceso al Panel de WordPress - <?php bloginfo('name'); ?></title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f1f1f1;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .wp-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: #0073aa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        h1 {
            color: #23282d;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background: #0073aa;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 10px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #005a87;
        }
        .info {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            color: #0073aa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="wp-logo">WP</div>
        <h1>Panel de Administración de WordPress</h1>
        
        <div class="info">
            <strong>Nota:</strong> Este es un acceso alternativo al panel de WordPress debido a restricciones del servidor.
        </div>
        
        <p>Selecciona una opción para acceder al panel:</p>
        
        <a href="<?php echo wp_login_url(admin_url()); ?>" class="btn">Iniciar Sesión</a>
        <a href="<?php echo admin_url(); ?>" class="btn">Dashboard</a>
        <a href="<?php echo admin_url('edit.php'); ?>" class="btn">Entradas</a>
        <a href="<?php echo admin_url('edit.php?post_type=page'); ?>" class="btn">Páginas</a>
        <a href="<?php echo admin_url('themes.php'); ?>" class="btn">Temas</a>
        <a href="<?php echo admin_url('plugins.php'); ?>" class="btn">Plugins</a>
        <a href="<?php echo admin_url('options-general.php'); ?>" class="btn">Configuración</a>
        
        <hr style="margin: 30px 0;">
        
        <p><small>Si tienes problemas de acceso, contacta con el soporte técnico.</small></p>
        <p><small>Sitio: <a href="<?php echo home_url(); ?>"><?php bloginfo('name'); ?></a></small></p>
    </div>
</body>
</html>