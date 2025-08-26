<?php
/**
 * Página de acceso alternativo al panel de WordPress
 * Solución para el error 403 en wp-admin en Hostinger
 * 
 * Uso: https://ecosdelseo.com/blog/admin-panel.php
 */

// Cargar WordPress
require_once('wp-config.php');
require_once('wp-load.php');

// Verificar si el usuario está logueado
if (!is_user_logged_in()) {
    // Mostrar formulario de login o redirigir
    $login_url = wp_login_url(get_site_url() . '/admin-panel.php');
    
    // Si hay parámetros de login, procesarlos
    if (isset($_POST['log']) && isset($_POST['pwd'])) {
        $creds = array(
            'user_login'    => $_POST['log'],
            'user_password' => $_POST['pwd'],
            'remember'      => isset($_POST['rememberme'])
        );
        
        $user = wp_signon($creds, false);
        
        if (is_wp_error($user)) {
            $error_message = $user->get_error_message();
        } else {
            // Login exitoso, redirigir
            wp_redirect(admin_url());
            exit;
        }
    }
} else {
    // Usuario ya logueado, verificar permisos
    if (current_user_can('manage_options') || current_user_can('edit_posts')) {
        // Redirigir al dashboard
        wp_redirect(admin_url());
        exit;
    }
}

get_header();
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Panel de Administración - <?php bloginfo('name'); ?></title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .wp-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
            background: #0073aa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            font-weight: bold;
        }
        h1 {
            color: #23282d;
            margin-bottom: 30px;
            font-size: 24px;
        }
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: 500;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }
        input[type="text"]:focus, input[type="password"]:focus {
            outline: none;
            border-color: #0073aa;
        }
        .submit-btn {
            width: 100%;
            background: #0073aa;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .submit-btn:hover {
            background: #005a87;
        }
        .error {
            background: #ffebee;
            color: #c62828;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #c62828;
        }
        .info {
            background: #e3f2fd;
            color: #1565c0;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #1565c0;
            text-align: left;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .checkbox-group input {
            margin-right: 8px;
        }
        .links {
            margin-top: 20px;
            text-align: center;
        }
        .links a {
            color: #0073aa;
            text-decoration: none;
            margin: 0 10px;
        }
        .links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="wp-logo">WP</div>
        <h1>Panel de Administración</h1>
        
        <div class="info">
            <strong>Acceso Alternativo:</strong> Esta página permite acceder al panel de WordPress cuando el acceso directo a wp-admin está bloqueado por el servidor.
        </div>
        
        <?php if (isset($error_message)): ?>
            <div class="error">
                <?php echo esc_html($error_message); ?>
            </div>
        <?php endif; ?>
        
        <?php if (!is_user_logged_in()): ?>
            <form method="post" action="">
                <div class="form-group">
                    <label for="log">Usuario o Email:</label>
                    <input type="text" name="log" id="log" required>
                </div>
                
                <div class="form-group">
                    <label for="pwd">Contraseña:</label>
                    <input type="password" name="pwd" id="pwd" required>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" name="rememberme" id="rememberme" value="forever">
                    <label for="rememberme">Recordarme</label>
                </div>
                
                <button type="submit" class="submit-btn">Iniciar Sesión</button>
            </form>
            
            <div class="links">
                <a href="<?php echo wp_lostpassword_url(); ?>">¿Olvidaste tu contraseña?</a>
                <a href="<?php echo home_url(); ?>">← Volver al sitio</a>
            </div>
        <?php else: ?>
            <p>Ya estás conectado. Serás redirigido al panel de administración...</p>
            <script>
                setTimeout(function() {
                    window.location.href = '<?php echo admin_url(); ?>';
                }, 2000);
            </script>
        <?php endif; ?>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="font-size: 12px; color: #666;">
            Sitio: <a href="<?php echo home_url(); ?>" style="color: #0073aa;"><?php bloginfo('name'); ?></a><br>
            <small>Panel alternativo v1.0</small>
        </p>
    </div>
</body>
</html>