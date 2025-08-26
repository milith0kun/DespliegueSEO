<?php
/**
 * Plugin Name: Hostinger Admin Panel Fix
 * Description: Soluciona problemas de acceso al panel de administración en Hostinger
 * Version: 1.0
 * Author: Auto-generated
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Corregir URLs de administración para subdirectorio
 */
function fix_admin_urls() {
    // Asegurar que las URLs de admin sean correctas
    if (!defined('WP_ADMIN_URL')) {
        define('WP_ADMIN_URL', home_url('/wp-admin/'));
    }
}
add_action('init', 'fix_admin_urls', 1);

/**
 * Forzar redirección correcta después del login
 */
function fix_login_redirect($redirect_to, $request, $user) {
    // Si no hay redirección específica, usar el dashboard
    if (empty($redirect_to) || $redirect_to === 'wp-admin/' || $redirect_to === admin_url()) {
        $redirect_to = admin_url('index.php');
    }
    
    // Asegurar que la URL sea absoluta y correcta
    if (!filter_var($redirect_to, FILTER_VALIDATE_URL)) {
        $redirect_to = admin_url('index.php');
    }
    
    // Verificar que la URL contenga el dominio correcto
    $site_url = get_site_url();
    if (strpos($redirect_to, $site_url) !== 0) {
        $redirect_to = admin_url('index.php');
    }
    
    return $redirect_to;
}
add_filter('login_redirect', 'fix_login_redirect', 10, 3);

/**
 * Corregir URLs de admin en el contexto de Hostinger
 */
function fix_admin_url($url, $path, $blog_id) {
    // Asegurar que las URLs de admin usen HTTPS
    if (is_ssl() || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')) {
        $url = str_replace('http://', 'https://', $url);
    }
    
    return $url;
}
add_filter('admin_url', 'fix_admin_url', 10, 3);

/**
 * Manejar problemas de cookies en subdirectorio
 */
function fix_auth_cookies() {
    // Configurar cookies para subdirectorio
    if (!headers_sent()) {
        $cookie_domain = defined('COOKIE_DOMAIN') ? COOKIE_DOMAIN : '.ecosdelseo.com';
        $cookie_path = defined('COOKIEPATH') ? COOKIEPATH : '/blog/';
        
        ini_set('session.cookie_domain', $cookie_domain);
        ini_set('session.cookie_path', $cookie_path);
        ini_set('session.cookie_secure', is_ssl() ? '1' : '0');
        ini_set('session.cookie_httponly', '1');
    }
}
add_action('init', 'fix_auth_cookies', 1);

/**
 * Verificar y corregir capacidades de usuario
 */
function ensure_admin_capabilities($user_login, $user) {
    // Verificar que el usuario tenga las capacidades necesarias
    if ($user && !is_wp_error($user)) {
        // Si es administrador, asegurar que tenga todas las capacidades
        if (in_array('administrator', $user->roles)) {
            $user->add_cap('manage_options');
            $user->add_cap('edit_dashboard');
            $user->add_cap('read');
        }
    }
}
add_action('wp_login', 'ensure_admin_capabilities', 10, 2);

/**
 * Debugging: Log de redirecciones para diagnóstico
 */
function log_admin_redirects() {
    if (defined('WP_DEBUG') && WP_DEBUG && current_user_can('manage_options')) {
        $current_url = (is_ssl() ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        $admin_url = admin_url();
        
        error_log("Admin Redirect Debug - Current URL: $current_url, Admin URL: $admin_url");
    }
}
add_action('admin_init', 'log_admin_redirects');

/**
 * Forzar regeneración de URLs si es necesario
 */
function force_url_refresh() {
    // Solo en admin y si hay problemas de URL
    if (is_admin() && isset($_GET['fix_urls'])) {
        update_option('home', 'https://ecosdelseo.com/blog');
        update_option('siteurl', 'https://ecosdelseo.com/blog');
        
        wp_redirect(admin_url('index.php?urls_fixed=1'));
        exit;
    }
}
add_action('admin_init', 'force_url_refresh');

/**
 * Mostrar mensaje de éxito si las URLs fueron corregidas
 */
function show_url_fix_notice() {
    if (isset($_GET['urls_fixed']) && current_user_can('manage_options')) {
        echo '<div class="notice notice-success is-dismissible"><p>URLs de WordPress corregidas exitosamente.</p></div>';
    }
}
add_action('admin_notices', 'show_url_fix_notice');

/**
 * Agregar enlace de diagnóstico en el dashboard
 */
function add_admin_fix_link() {
    if (current_user_can('manage_options')) {
        echo '<div style="background: #fff; border-left: 4px solid #0073aa; padding: 10px; margin: 10px 0;">';
        echo '<strong>Diagnóstico de Admin:</strong> ';
        echo '<a href="' . admin_url('index.php?fix_urls=1') . '" class="button button-secondary">Corregir URLs</a> ';
        echo '<small>Usar solo si hay problemas de redirección</small>';
        echo '</div>';
    }
}
add_action('admin_notices', 'add_admin_fix_link');
?>