<?php
define( 'WP_CACHE', true );

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u815370372_q5WIs' );

/** Database username */
define( 'DB_USER', 'u815370372_rZLTm' );

/** Database password */
define( 'DB_PASSWORD', 'PfBLIyq6n5' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * WordPress URL Configuration
 * Configuración específica para subdirectorio /blog
 */
define('WP_HOME','https://ecosdelseo.com/blog');
define('WP_SITEURL','https://ecosdelseo.com/blog');

/**
 * Configuración adicional para compatibilidad con Hostinger
 */
define('FORCE_SSL_ADMIN', true);
define('WP_CONTENT_URL', 'https://ecosdelseo.com/blog/wp-content');
define('WP_PLUGIN_URL', 'https://ecosdelseo.com/blog/wp-content/plugins');

/**
 * Configuración para resolver problemas de acceso a wp-admin en Hostinger
 */
define('ADMIN_COOKIE_PATH', '/blog/');
define('COOKIE_DOMAIN', '.ecosdelseo.com');
define('COOKIEPATH', '/blog/');
define('SITECOOKIEPATH', '/blog/');

// Configuración para bypass de restricciones de Hostinger
define('DISALLOW_FILE_EDIT', false);
define('DISALLOW_FILE_MODS', false);

// Configuración de memoria y tiempo de ejecución
ini_set('memory_limit', '256M');
ini_set('max_execution_time', 300);
ini_set('max_input_vars', 3000);

// Configuración de sesiones para subdirectorio
ini_set('session.cookie_path', '/blog/');
ini_set('session.cookie_domain', '.ecosdelseo.com');

// Configuración específica para redirección correcta
define('WP_ADMIN_URL', 'https://ecosdelseo.com/blog/wp-admin/');
define('ADMIN_URL', 'https://ecosdelseo.com/blog/wp-admin/');

// Forzar HTTPS para admin
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '455q] Vt5FY3.7CE$g3B19_#(0{^vUl5*%Fc6@46Vhd6(,QbsHTDuMU)PWDrvy@i' );
define( 'SECURE_AUTH_KEY',   '$E{l53plCpc6a?kj>77D&~PU6tsY3W;v:=>h$LG$Y5Ab~SOS&*e(0ZrT$=p[^{MQ' );
define( 'LOGGED_IN_KEY',     '7f.+ga(eX`HT=cm,6y<?==.qZ!(!h,-*.[4HY d%I?v>KR4EwUpZnp zn1G(b|6 ' );
define( 'NONCE_KEY',         'KS8zj(qU8d-z+3LjDYG3mUl^tI{!szk,ZNP;r-=Ftp?3WAy@AjW- A{/5>XqBUe;' );
define( 'AUTH_SALT',         'T^;2I<n/oICJ|p.dH^dzByaJ~yc9cN%RK^Q,$d[-~vXl]Xonp()g7|f$m[pP5)c5' );
define( 'SECURE_AUTH_SALT',  'b}=[X~anJQ|i8H$(3EIfk<UFqSdM{sc 8fg-20rSeC~`7dSS,u-~@V,c;+;!O~Vg' );
define( 'LOGGED_IN_SALT',    'pMr$26zC{y5EMdvvbXRWZ!WSqdCu0<l?iz/ZjfF5}*:e*lQl6Rp4-^B-xeeZ8~n$' );
define( 'NONCE_SALT',        '8|0di:X30g>(O{7R:Rr|nwYolr;p:$|5G?r=<lCl<W`m1U.}fQU^uyfbq68M?&.8' );
define( 'WP_CACHE_KEY_SALT', 'umyd KuGr,ig(JtrXM2d%R{q;;fw!yxz[MSY?*5GB3z3<T#P;oE%K8a$gK7JIrv2' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'FS_METHOD', 'direct' );
define( 'COOKIEHASH', 'f83862c5a22b4c190f450a625d9106b9' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
