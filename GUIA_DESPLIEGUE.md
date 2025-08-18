# Guía de Despliegue sin VPS - Proyecto Marketing SEO

## Opciones de Hosting Recomendadas

### 1. 🥇 HOSTING COMPARTIDO TRADICIONAL

#### Proveedores Recomendados (España/Internacional)
- **SiteGround** - Excelente para PHP/MySQL
- **Hostinger** - Económico y confiable
- **Webempresa** - Especializado en España
- **Raiola Networks** - Hosting español premium
- **Namecheap** - Internacional económico
- **Bluehost** - Confiable para principiantes

#### Características Necesarias
✅ **Mínimas requeridas**:
- PHP 7.4+ (preferible 8.0+)
- MySQL 5.7+ o MariaDB 10.2+
- Soporte para .htaccess
- Al menos 1GB de espacio
- Certificado SSL gratuito
- cPanel o panel similar

✅ **Recomendadas**:
- PHP 8.1+
- Múltiples dominios
- Backup automático
- CDN incluido
- Soporte técnico 24/7

### 2. 🌐 HOSTING GRATUITO (Para Pruebas)

#### Opciones Gratuitas
- **InfinityFree** - Sin anuncios, PHP/MySQL
- **000webhost** - Hostinger gratuito
- **AwardSpace** - 1GB gratis
- **Byet.host** - Sin límites de ancho de banda

⚠️ **Limitaciones**:
- Recursos limitados
- Posibles interrupciones
- Sin soporte técnico
- Subdominios únicamente

### 3. ☁️ CLOUD HOSTING SIMPLE

#### Opciones Cloud
- **Cloudways** - Hosting cloud gestionado
- **DigitalOcean App Platform** - Despliegue automático
- **Heroku** - Con addon MySQL
- **Railway** - Moderno y simple

## Proceso de Despliegue Paso a Paso

### 📋 PREPARACIÓN PREVIA

#### 1. Verificar Configuración Local
```bash
# Verificar que todo funciona localmente
php -S localhost:8000 -t .
```

#### 2. Preparar Archivos
- ✅ Verificar rutas relativas (no absolutas)
- ✅ Configurar variables de entorno
- ✅ Optimizar imágenes
- ✅ Minificar CSS/JS si es necesario

#### 3. Configuración de Base de Datos
```sql
-- Exportar estructura y datos
mysqldump -u usuario -p nombre_bd > backup.sql
```

### 🚀 DESPLIEGUE EN HOSTING COMPARTIDO

#### Método 1: FTP/SFTP (Más común)

**Paso 1: Conectar por FTP**
- Usar FileZilla, WinSCP o cliente FTP
- Datos: servidor, usuario, contraseña del hosting

**Paso 2: Subir Archivos**
```
/public_html/
├── index.html (frontend)
├── api/ (backend completo)
├── frontend/ (archivos estáticos)
├── config.php
└── .htaccess (si es necesario)
```

**Paso 3: Configurar Base de Datos**
- Crear BD desde cPanel/panel de control
- Importar backup.sql
- Actualizar credenciales en config/database.php

**Paso 4: Configurar Dominios**
- Apuntar dominio a carpeta correcta
- Configurar SSL si no es automático

#### Método 2: cPanel File Manager

**Paso 1: Comprimir Proyecto**
```bash
zip -r proyecto.zip . -x "node_modules/*" ".git/*"
```

**Paso 2: Subir y Extraer**
- Subir ZIP desde File Manager
- Extraer en public_html
- Eliminar ZIP

### 🔧 CONFIGURACIÓN POST-DESPLIEGUE

#### 1. Configurar Variables de Entorno

**Archivo: config/config.php**
```php
<?php
// Detectar entorno
$isLocal = ($_SERVER['HTTP_HOST'] === 'localhost' || 
           strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false);

if ($isLocal) {
    // Configuración local
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'marketing_local');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('SITE_URL', 'http://localhost');
} else {
    // Configuración producción
    define('DB_HOST', 'localhost'); // o IP del hosting
    define('DB_NAME', 'tu_bd_produccion');
    define('DB_USER', 'tu_usuario_bd');
    define('DB_PASS', 'tu_password_bd');
    define('SITE_URL', 'https://tudominio.com');
}

// Configuración de email
define('SMTP_HOST', 'smtp.tudominio.com');
define('SMTP_USER', 'noreply@tudominio.com');
define('SMTP_PASS', 'tu_password_email');
?>
```

#### 2. Configurar .htaccess (si es necesario)

**Archivo: .htaccess**
```apache
# Redireccionar a HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Configurar API
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Seguridad básica
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>

<Files "*.sql">
    Order Allow,Deny
    Deny from all
</Files>
```

#### 3. Verificar Permisos
```bash
# Permisos recomendados
chmod 755 carpetas/
chmod 644 archivos.php
chmod 600 config/database.php  # Archivos sensibles
```

### 🧪 TESTING POST-DESPLIEGUE

#### Checklist de Verificación
- [ ] Página principal carga correctamente
- [ ] Formulario de contacto funciona
- [ ] Emails se envían correctamente
- [ ] Panel admin accesible
- [ ] Login/logout funciona
- [ ] Base de datos conecta
- [ ] SSL configurado
- [ ] Redirecciones funcionan

#### Herramientas de Testing
- **GTmetrix** - Velocidad de carga
- **SSL Labs** - Verificar certificado
- **Pingdom** - Monitoreo uptime
- **Google PageSpeed** - Optimización

### 🔄 MANTENIMIENTO Y ACTUALIZACIONES

#### Backup Regular
```bash
# Script de backup (ejecutar localmente)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h HOST -u USER -pPASS DATABASE > backup_$DATE.sql
zip -r backup_$DATE.zip . -x "*.git/*" "node_modules/*"
```

#### Actualizaciones
1. **Probar localmente** todos los cambios
2. **Backup** antes de actualizar
3. **Subir archivos** modificados
4. **Verificar** funcionamiento
5. **Rollback** si hay problemas

### 💰 COSTOS ESTIMADOS

#### Hosting Compartido
- **Básico**: €3-8/mes
- **Premium**: €8-15/mes
- **Dominio**: €10-15/año
- **SSL**: Gratis (Let's Encrypt)

#### Hosting Cloud
- **Básico**: €5-10/mes
- **Escalable**: €10-25/mes
- **Tráfico**: Variable

### 🚨 PROBLEMAS COMUNES Y SOLUCIONES

#### Error de Conexión a BD
```php
// Verificar credenciales
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    echo "Conexión exitosa";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
```

#### Emails no se envían
- Verificar configuración SMTP
- Usar email del mismo dominio
- Configurar SPF/DKIM records

#### Errores de permisos
- Verificar ownership de archivos
- Ajustar permisos según hosting
- Contactar soporte técnico

### 📞 SOPORTE Y RECURSOS

#### Documentación Útil
- Manual de cPanel
- Documentación PHP oficial
- Guías del proveedor de hosting

#### Contactos de Emergencia
- Soporte técnico del hosting
- Desarrollador del proyecto
- Backup de contactos importantes

## Conclusión

El proyecto actual está **perfectamente preparado** para despliegue en hosting compartido. La arquitectura PHP vanilla garantiza máxima compatibilidad y facilidad de despliegue. El proceso es directo: subir archivos, configurar base de datos, y verificar funcionamiento.

**Tiempo estimado de despliegue**: 2-4 horas (incluyendo configuración inicial)
**Costo mensual**: €5-15 dependiendo del proveedor
**Mantenimiento**: Mínimo, solo actualizaciones ocasionales