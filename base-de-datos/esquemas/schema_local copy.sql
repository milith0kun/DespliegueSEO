-- ========================================
-- SCRIPT 1: CREAR BASE DE DATOS Y ESTRUCTURA
-- Ejecutar PRIMERO - Solo estructura sin datos
-- ========================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ecosdelseo_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE ecosdelseo_db;

-- Configurar variables de sesión
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET SESSION sql_mode = 'NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- ========================================
-- TABLA: usuarios
-- ========================================

CREATE TABLE usuarios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'GERENTE', 'CLIENTE') DEFAULT 'CLIENTE',
    hash_password VARCHAR(255),
    url_avatar TEXT,
    telefono VARCHAR(20),
    empresa VARCHAR(255),
    esta_activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_verificacion_email VARCHAR(255),
    token_reset_password VARCHAR(255),
    expira_reset_password TIMESTAMP NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: servicios
-- ========================================

CREATE TABLE servicios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT,
    descripcion_corta VARCHAR(500),
    icono VARCHAR(100),
    caracteristicas JSON,
    informacion_precios JSON,
    titulo_meta VARCHAR(255),
    descripcion_meta VARCHAR(500),
    palabras_clave TEXT,
    imagen_header VARCHAR(255),
    esta_activo BOOLEAN DEFAULT TRUE,
    es_destacado BOOLEAN DEFAULT FALSE,
    orden_clasificacion INTEGER DEFAULT 0,
    contador_visitas INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: paginas_servicios
-- ========================================

CREATE TABLE paginas_servicios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    servicio_id CHAR(36) NOT NULL,
    titulo_hero VARCHAR(255),
    subtitulo_hero VARCHAR(500),
    imagen_hero VARCHAR(255),
    texto_cta_hero VARCHAR(100),
    enlace_cta_hero VARCHAR(255),
    secciones_contenido JSON,
    lista_caracteristicas JSON,
    pasos_proceso JSON,
    beneficios JSON,
    niveles_precios JSON,
    testimonios JSON,
    casos_estudio JSON,
    preguntas_frecuentes JSON,
    seccion_cta JSON,
    schema_pagina JSON,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_paginas_servicios_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: contactos
-- ========================================

CREATE TABLE contactos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    empresa VARCHAR(255),
    cargo VARCHAR(100),
    sitio_web VARCHAR(255),
    mensaje TEXT,
    interes_servicio VARCHAR(255),
    rango_presupuesto VARCHAR(100),
    cronograma VARCHAR(100),
    fuente_lead VARCHAR(100) DEFAULT 'SITIO_WEB',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    url_referencia TEXT,
    pagina_aterrizaje VARCHAR(255),
    estado ENUM('NUEVO', 'CONTACTADO', 'EN_PROGRESO', 'CALIFICADO', 'CERRADO_GANADO', 'CERRADO_PERDIDO') DEFAULT 'NUEVO',
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE') DEFAULT 'MEDIA',
    puntuacion INTEGER DEFAULT 0,
    asignado_a CHAR(36),
    notas TEXT,
    etiquetas JSON,
    campos_personalizados JSON,
    ultimo_contacto TIMESTAMP NULL,
    proximo_seguimiento TIMESTAMP NULL,
    direccion_ip VARCHAR(45),
    agente_usuario TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_contactos_usuario FOREIGN KEY (asignado_a) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: interacciones_contactos
-- ========================================

CREATE TABLE interacciones_contactos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    contacto_id CHAR(36) NOT NULL,
    usuario_id CHAR(36),
    tipo_interaccion VARCHAR(50) NOT NULL,
    asunto VARCHAR(255),
    contenido TEXT,
    fecha_interaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracion_minutos INTEGER,
    resultado VARCHAR(100),
    proxima_accion VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_interacciones_contacto FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
    CONSTRAINT fk_interacciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: entradas_blog
-- ========================================

CREATE TABLE entradas_blog (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    extracto VARCHAR(500),
    contenido LONGTEXT,
    imagen_destacada VARCHAR(255),
    autor_id CHAR(36),
    categoria VARCHAR(100),
    etiquetas JSON,
    titulo_meta VARCHAR(255),
    descripcion_meta VARCHAR(500),
    palabras_clave TEXT,
    esta_publicado BOOLEAN DEFAULT FALSE,
    es_destacado BOOLEAN DEFAULT FALSE,
    publicado_en TIMESTAMP NULL,
    contador_visitas INTEGER DEFAULT 0,
    tiempo_lectura INTEGER,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_blog_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: configuraciones_sitio
-- ========================================

CREATE TABLE configuraciones_sitio (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    clave_configuracion VARCHAR(100) UNIQUE NOT NULL,
    valor_configuracion JSON,
    descripcion TEXT,
    tipo_configuracion VARCHAR(50),
    es_publico BOOLEAN DEFAULT FALSE,
    actualizado_por CHAR(36),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_config_usuario FOREIGN KEY (actualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: eventos_analytics
-- ========================================

CREATE TABLE eventos_analytics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tipo_evento ENUM('VISTA_PAGINA', 'ENVIO_FORMULARIO', 'CLICK_BOTON', 'DESCARGA_ARCHIVO', 'SUSCRIPCION_EMAIL', 'VISTA_SERVICIO') NOT NULL,
    url_pagina VARCHAR(500),
    titulo_pagina VARCHAR(255),
    url_referencia TEXT,
    agente_usuario TEXT,
    direccion_ip VARCHAR(45),
    pais VARCHAR(2),
    ciudad VARCHAR(100),
    tipo_dispositivo VARCHAR(50),
    navegador VARCHAR(50),
    sistema_operativo VARCHAR(50),
    id_sesion VARCHAR(255),
    usuario_id CHAR(36),
    contacto_id CHAR(36),
    datos_evento JSON,
    valor_conversion DECIMAL(10,2),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_analytics_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_analytics_contacto FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: notificaciones
-- ========================================

CREATE TABLE notificaciones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    tipo ENUM('NUEVO_LEAD', 'ACTUALIZACION_LEAD', 'RECORDATORIO_REUNION', 'ALERTA_SISTEMA', 'ACTUALIZACION_MARKETING') NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT,
    url_accion VARCHAR(255),
    datos JSON,
    esta_leido BOOLEAN DEFAULT FALSE,
    leido_en TIMESTAMP NULL,
    expira_en TIMESTAMP NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notificaciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: suscriptores_email
-- ========================================

CREATE TABLE suscriptores_email (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'ACTIVO',
    fuente_suscripcion VARCHAR(100),
    intereses JSON,
    campos_personalizados JSON,
    suscrito_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    desuscrito_en TIMESTAMP NULL,
    ultimo_email_enviado TIMESTAMP NULL,
    total_emails_enviados INTEGER DEFAULT 0,
    total_emails_abiertos INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: archivos_subidos
-- ========================================

CREATE TABLE archivos_subidos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre_original VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamano_archivo BIGINT,
    tipo_mime VARCHAR(100),
    tipo_archivo VARCHAR(50),
    subido_por CHAR(36),
    tabla_relacionada VARCHAR(100),
    id_relacionado CHAR(36),
    ancho INTEGER,
    altura INTEGER,
    texto_alt VARCHAR(255),
    es_publico BOOLEAN DEFAULT FALSE,
    contador_descargas INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_archivos_usuario FOREIGN KEY (subido_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================

-- Usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(esta_activo);

-- Servicios
CREATE INDEX idx_servicios_slug ON servicios(slug);
CREATE INDEX idx_servicios_activo ON servicios(esta_activo);
CREATE INDEX idx_servicios_destacado ON servicios(es_destacado);
CREATE INDEX idx_servicios_orden ON servicios(orden_clasificacion);

-- Contactos
CREATE INDEX idx_contactos_email ON contactos(email);
CREATE INDEX idx_contactos_estado ON contactos(estado);
CREATE INDEX idx_contactos_creado_en ON contactos(creado_en);
CREATE INDEX idx_contactos_asignado_a ON contactos(asignado_a);
CREATE INDEX idx_contactos_fuente ON contactos(fuente_lead);

-- Interacciones
CREATE INDEX idx_interacciones_contacto_id ON interacciones_contactos(contacto_id);
CREATE INDEX idx_interacciones_fecha ON interacciones_contactos(fecha_interaccion);
CREATE INDEX idx_interacciones_tipo ON interacciones_contactos(tipo_interaccion);

-- Blog
CREATE INDEX idx_blog_slug ON entradas_blog(slug);
CREATE INDEX idx_blog_publicado ON entradas_blog(esta_publicado, publicado_en);
CREATE INDEX idx_blog_categoria ON entradas_blog(categoria);
CREATE INDEX idx_blog_autor ON entradas_blog(autor_id);

-- Analytics
CREATE INDEX idx_analytics_tipo ON eventos_analytics(tipo_evento);
CREATE INDEX idx_analytics_fecha ON eventos_analytics(creado_en);
CREATE INDEX idx_analytics_sesion ON eventos_analytics(id_sesion);
CREATE INDEX idx_analytics_pagina ON eventos_analytics(url_pagina(100));

-- Notificaciones
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leido ON notificaciones(esta_leido);
CREATE INDEX idx_notificaciones_creado ON notificaciones(creado_en);

-- Suscriptores
CREATE INDEX idx_suscriptores_email ON suscriptores_email(email);
CREATE INDEX idx_suscriptores_estado ON suscriptores_email(estado);

-- Archivos
CREATE INDEX idx_archivos_subido_por ON archivos_subidos(subido_por);
CREATE INDEX idx_archivos_relacionada ON archivos_subidos(tabla_relacionada, id_relacionado);

-- ========================================
-- FUNCIÓN PARA CALCULAR SCORING DE LEADS
-- ========================================

DELIMITER $$

CREATE FUNCTION calcular_puntuacion_lead(contacto_uuid CHAR(36))
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE puntuacion INT DEFAULT 0;
    DECLARE empresa_val VARCHAR(255);
    DECLARE telefono_val VARCHAR(20);
    DECLARE sitio_web_val VARCHAR(255);
    DECLARE cargo_val VARCHAR(100);
    DECLARE interes_servicio_val VARCHAR(255);
    DECLARE rango_presupuesto_val VARCHAR(100);
    DECLARE cronograma_val VARCHAR(100);
    
    -- Obtener datos del contacto
    SELECT empresa, telefono, sitio_web, cargo, interes_servicio, rango_presupuesto, cronograma
    INTO empresa_val, telefono_val, sitio_web_val, cargo_val, interes_servicio_val, rango_presupuesto_val, cronograma_val
    FROM contactos 
    WHERE id = contacto_uuid;
    
    -- Calcular puntuación por campos completados
    IF empresa_val IS NOT NULL AND empresa_val != '' THEN SET puntuacion = puntuacion + 10; END IF;
    IF telefono_val IS NOT NULL AND telefono_val != '' THEN SET puntuacion = puntuacion + 15; END IF;
    IF sitio_web_val IS NOT NULL AND sitio_web_val != '' THEN SET puntuacion = puntuacion + 5; END IF;
    IF cargo_val IS NOT NULL AND cargo_val != '' THEN SET puntuacion = puntuacion + 8; END IF;
    IF interes_servicio_val IS NOT NULL AND interes_servicio_val != '' THEN SET puntuacion = puntuacion + 20; END IF;
    
    -- Puntuación por presupuesto
    CASE rango_presupuesto_val
        WHEN 'alto' THEN SET puntuacion = puntuacion + 30;
        WHEN 'medio' THEN SET puntuacion = puntuacion + 20;
        WHEN 'bajo' THEN SET puntuacion = puntuacion + 10;
        ELSE SET puntuacion = puntuacion + 0;
    END CASE;
    
    -- Puntuación por urgencia
    CASE cronograma_val
        WHEN 'inmediato' THEN SET puntuacion = puntuacion + 25;
        WHEN 'mes' THEN SET puntuacion = puntuacion + 20;
        WHEN 'trimestre' THEN SET puntuacion = puntuacion + 10;
        ELSE SET puntuacion = puntuacion + 0;
    END CASE;
    
    RETURN puntuacion;
END$$

DELIMITER ;

-- ========================================
-- VISTAS PARA DASHBOARD
-- ========================================

CREATE VIEW metricas_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM contactos WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as nuevos_leads_mes,
    (SELECT COUNT(*) FROM contactos WHERE estado = 'NUEVO') as leads_pendientes,
    (SELECT COUNT(*) FROM contactos WHERE estado IN ('CALIFICADO', 'CERRADO_GANADO')) as leads_calificados,
    (SELECT COUNT(*) FROM eventos_analytics WHERE tipo_evento = 'VISTA_PAGINA' AND creado_en >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as vistas_pagina_mes,
    (SELECT COUNT(DISTINCT id_sesion) FROM eventos_analytics WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as visitantes_unicos_mes;

CREATE VIEW leads_con_puntuacion AS
SELECT 
    c.*,
    calcular_puntuacion_lead(c.id) as puntuacion_calculada,
    u.nombre as nombre_usuario_asignado,
    (SELECT COUNT(*) FROM interacciones_contactos ic WHERE ic.contacto_id = c.id) as total_interacciones,
    (SELECT MAX(ic.fecha_interaccion) FROM interacciones_contactos ic WHERE ic.contacto_id = c.id) as ultima_interaccion
FROM contactos c
LEFT JOIN usuarios u ON c.asignado_a = u.id;

-- ========================================
-- VERIFICACIÓN DE ESTRUCTURA
-- ========================================

-- Mostrar tablas creadas
SELECT 
    'TABLA CREADA' as status,
    TABLE_NAME as tabla,
    TABLE_COMMENT as comentario
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Mostrar funciones creadas
SELECT 
    'FUNCIÓN CREADA' as status,
    ROUTINE_NAME as nombre,
    ROUTINE_TYPE as tipo
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_SCHEMA = DATABASE();

-- Mostrar vistas creadas
SELECT 
    'VISTA CREADA' as status,
    TABLE_NAME as nombre
FROM INFORMATION_SCHEMA.VIEWS 
WHERE TABLE_SCHEMA = DATABASE();

-- Mensaje de confirmación
SELECT 
    '✅ ESTRUCTURA DE BASE DE DATOS CREADA EXITOSAMENTE' as mensaje,
    DATABASE() as base_de_datos,
    NOW() as fecha_creacion;