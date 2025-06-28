-- ========================================
-- SCRIPT 2: CARGAR DATOS INICIALES
-- Ejecutar DESPUÉS del Script 1
-- ========================================

-- Usar la base de datos
USE ecosdelseo_db;

-- ========================================
-- DATOS: usuarios
-- ========================================

INSERT INTO usuarios (id, email, nombre, rol, hash_password, esta_activo, email_verificado) VALUES 
(UUID(), 'admin@ecosdelseo.com', 'Administrador Principal', 'ADMIN', '$2b$12$LQv3c1yqBwzHO6I1BF3fP.yGSzc8HUc8N3vSzV3yP9N1O2M8L9K7Q', true, true),
(UUID(), 'jampier@ecosdelseo.com', 'Jampier Saife', 'ADMIN', '$2b$12$LQv3c1yqBwzHO6I1BF3fP.yGSzc8HUc8N3vSzV3yP9N1O2M8L9K7Q', true, true),
(UUID(), 'dev@ecosdelseo.com', 'Desarrollador', 'GERENTE', '$2b$12$LQv3c1yqBwzHO6I1BF3fP.yGSzc8HUc8N3vSzV3yP9N1O2M8L9K7Q', true, true);

-- ========================================
-- DATOS: servicios
-- ========================================

INSERT INTO servicios (id, nombre, slug, descripcion_corta, descripcion, esta_activo, es_destacado, orden_clasificacion, titulo_meta, descripcion_meta) VALUES 
(UUID(), 'Desarrollo Web Empresarial', 'desarrollo-web', 
'Plataformas seguras y ultra-eficientes para potenciar conversiones', 
'Creamos sitios web empresariales con tecnologías modernas, optimizados para conversiones y preparados para escalar con tu negocio. Utilizamos las últimas tecnologías como React, Node.js y bases de datos optimizadas para garantizar performance excepcional.', 
true, true, 1, 
'Desarrollo Web Empresarial | Ecos del SEO', 
'Desarrollo de sitios web empresariales seguros, rápidos y optimizados para conversiones. Tecnologías modernas y escalables.');

INSERT INTO servicios (id, nombre, slug, descripcion_corta, descripcion, esta_activo, es_destacado, orden_clasificacion, titulo_meta, descripcion_meta) VALUES 
(UUID(), 'SEO & Marketing Digital', 'seo-marketing', 
'Estrategias de posicionamiento orgánico y contenido de valor', 
'Implementamos estrategias SEO integrales y creamos contenido que posiciona tu marca en los primeros resultados de búsqueda. Nuestro enfoque combina SEO técnico, content marketing y link building para resultados duraderos.', 
true, true, 2, 
'SEO y Marketing Digital | Posicionamiento Web | Ecos del SEO', 
'Estrategias SEO profesionales y marketing de contenidos para posicionar tu empresa en Google y captar leads cualificados.');

INSERT INTO servicios (id, nombre, slug, descripcion_corta, descripcion, esta_activo, es_destacado, orden_clasificacion, titulo_meta, descripcion_meta) VALUES 
(UUID(), 'Software a Medida', 'software-medida', 
'Aplicaciones personalizadas que automatizan procesos críticos', 
'Desarrollamos software personalizado que se adapta perfectamente a los procesos únicos de tu empresa, mejorando productividad y eficiencia. Desde CRM personalizados hasta sistemas de gestión empresarial completos.', 
true, true, 3, 
'Software a Medida | Desarrollo Personalizado | Ecos del SEO', 
'Desarrollo de software a medida y aplicaciones personalizadas que automatizan procesos empresariales específicos.');

INSERT INTO servicios (id, nombre, slug, descripcion_corta, descripcion, esta_activo, es_destacado, orden_clasificacion, titulo_meta, descripcion_meta) VALUES 
(UUID(), 'Paid Media Alto ROI', 'paid-media', 
'Campañas publicitarias optimizadas para maximizar ROI', 
'Gestionamos campañas de publicidad digital en Google Ads, Facebook Ads y LinkedIn, optimizadas para generar el máximo retorno de inversión. Segmentación avanzada y optimización continua basada en datos.', 
true, true, 4, 
'Paid Media y Publicidad Digital | Alto ROI | Ecos del SEO', 
'Gestión profesional de campañas publicitarias digitales optimizadas para maximizar ROI en Google Ads, Facebook y LinkedIn.');

INSERT INTO servicios (id, nombre, slug, descripcion_corta, descripcion, esta_activo, es_destacado, orden_clasificacion, titulo_meta, descripcion_meta) VALUES 
(UUID(), 'UX/UI & CRO', 'ux-ui-cro', 
'Diseño centrado en usuario y optimización de conversiones', 
'Diseñamos experiencias de usuario excepcionales y optimizamos cada elemento de tu sitio web para maximizar las conversiones. Testing A/B continuo y análisis de comportamiento de usuarios para mejoras constantes.', 
true, true, 5, 
'UX/UI y Optimización de Conversiones | CRO | Ecos del SEO', 
'Diseño UX/UI profesional y optimización de conversiones (CRO) mediante testing A/B y análisis de comportamiento.');

INSERT INTO servicios (id, nombre, slug, descripcion_corta, descripcion, esta_activo, es_destacado, orden_clasificacion, titulo_meta, descripcion_meta) VALUES 
(UUID(), 'Social Media Management', 'social-media', 
'Gestión integral de redes sociales y contenidos virales', 
'Gestionamos tu presencia en redes sociales con estrategias de contenido que conectan con tu audiencia y generan engagement auténtico. Community management profesional y creación de contenido viral.', 
true, true, 6, 
'Gestión de Redes Sociales | Social Media Marketing | Ecos del SEO', 
'Gestión profesional de redes sociales y creación de contenido viral para conectar con tu audiencia objetivo.');

-- ========================================
-- DATOS: configuraciones_sitio
-- ========================================

-- ========================================
-- DATOS: configuraciones_sitio (CORREGIDO)
-- ========================================

INSERT INTO configuraciones_sitio (id, clave_configuracion, valor_configuracion, descripcion, tipo_configuracion, es_publico) VALUES 
(UUID(), 'titulo_sitio', JSON_QUOTE('Ecos del SEO - Agencia de Marketing Digital'), 'Título principal del sitio web', 'string', true),
(UUID(), 'descripcion_sitio', JSON_QUOTE('Potenciamos tu presencia online con estrategias personalizadas y resultados medibles. Especialistas en SEO, desarrollo web y marketing digital.'), 'Descripción meta del sitio', 'string', true),
(UUID(), 'email_contacto', JSON_QUOTE('contacto@ecosdelseo.com'), 'Email de contacto principal', 'string', true),
(UUID(), 'telefono_contacto', JSON_QUOTE('+34 600 000 000'), 'Teléfono de contacto principal', 'string', true),
(UUID(), 'direccion_oficina', JSON_QUOTE('Madrid, España'), 'Dirección física de la oficina', 'string', true),
(UUID(), 'whatsapp_numero', JSON_QUOTE('+34600000000'), 'Número de WhatsApp Business', 'string', true),
(UUID(), 'horario_atencion', JSON_QUOTE('Lunes a Viernes: 9:00 - 18:00 CET'), 'Horario de atención al cliente', 'string', true),
(UUID(), 'enlaces_sociales', JSON_OBJECT(
    'instagram', 'https://instagram.com/ecosdelseo',
    'linkedin', 'https://linkedin.com/company/ecosdelseo', 
    'twitter', 'https://twitter.com/ecosdelseo',
    'youtube', 'https://youtube.com/@ecosdelseo'
), 'Enlaces a redes sociales oficiales', 'json', true),
(UUID(), 'google_analytics_id', JSON_QUOTE(''), 'ID de Google Analytics para tracking', 'string', false),
(UUID(), 'pixel_facebook', JSON_QUOTE(''), 'ID del Pixel de Facebook para conversiones', 'string', false),
(UUID(), 'tagline', JSON_QUOTE('Resultados medibles, crecimiento sostenible'), 'Eslogan principal de la empresa', 'string', true),
(UUID(), 'anos_experiencia', JSON_QUOTE('5'), 'Años de experiencia en el mercado', 'number', true);

-- ========================================
-- DATOS: contactos de prueba
-- ========================================

INSERT INTO contactos (id, nombre, email, empresa, telefono, cargo, mensaje, interes_servicio, rango_presupuesto, cronograma, estado, fuente_lead) VALUES 
(UUID(), 'Juan Pérez García', 'juan.perez@ejemplo.com', 'Innovación Digital SL', '+34 666 111 222', 'Director de Marketing', 'Necesitamos renovar completamente nuestro sitio web corporativo. Buscamos una solución moderna y optimizada para conversiones.', 'desarrollo-web', 'medio', 'trimestre', 'NUEVO', 'SITIO_WEB'),

(UUID(), 'María González López', 'maria.gonzalez@testcorp.es', 'TestCorp Consulting', '+34 777 333 444', 'CEO', 'Queremos mejorar nuestro posicionamiento en Google y aumentar la visibilidad online de nuestra empresa de consultoría.', 'seo-marketing', 'alto', 'mes', 'CONTACTADO', 'GOOGLE_ADS'),

(UUID(), 'Carlos Rodríguez Martín', 'carlos@democompany.com', 'Demo Company', '+34 888 555 666', 'CTO', 'Buscamos desarrollar una aplicación interna para gestión de inventarios. Necesitamos una solución robusta y escalable.', 'software-medida', 'alto', 'inmediato', 'EN_PROGRESO', 'REFERENCIA'),

(UUID(), 'Ana Fernández Ruiz', 'ana.fernandez@startup.io', 'StartUp Innovadora', '+34 999 777 888', 'Fundadora', 'Necesitamos gestión completa de redes sociales para lanzar nuestro producto. Buscamos crear engagement y comunidad.', 'social-media', 'bajo', 'mes', 'CALIFICADO', 'REDES_SOCIALES'),

(UUID(), 'Roberto Silva Costa', 'roberto@ecommerce.es', 'E-commerce Plus', '+34 555 999 111', 'Director de Ventas', 'Queremos optimizar nuestras campañas de Google Ads para mejorar el ROI de nuestro e-commerce.', 'paid-media', 'medio', 'inmediato', 'NUEVO', 'SITIO_WEB'),

(UUID(), 'Laura Martínez Vega', 'laura@consultora.com', 'Consultora Estratégica', '+34 644 888 999', 'Gerente General', 'Necesitamos mejorar la experiencia de usuario de nuestro sitio web y aumentar las conversiones.', 'ux-ui-cro', 'medio', 'trimestre', 'CONTACTADO', 'LINKEDIN'),

(UUID(), 'David González Ruiz', 'david@techsolutions.es', 'Tech Solutions SL', '+34 633 777 444', 'Director Técnico', 'Buscamos desarrollar una plataforma web completa para gestión de proyectos internos.', 'desarrollo-web', 'alto', 'mes', 'EN_PROGRESO', 'REFERENCIA');

-- ========================================
-- DATOS: entradas_blog
-- ========================================

INSERT INTO entradas_blog (id, titulo, slug, extracto, contenido, categoria, autor_id, esta_publicado, es_destacado) VALUES 
(UUID(), 'Guía Completa de SEO 2024', 'guia-seo-2024', 
'Las mejores estrategias SEO para posicionar tu empresa este año y captar leads cualificados orgánicamente.', 
'El SEO en 2024 ha evolucionado significativamente. En esta guía completa, exploramos las últimas tendencias, algoritmos de Google y estrategias probadas para posicionar tu empresa en los primeros resultados de búsqueda. Desde SEO técnico hasta content marketing, cubrimos todo lo que necesitas saber para dominar el posicionamiento orgánico.', 
'SEO', (SELECT id FROM usuarios WHERE email = 'admin@ecosdelseo.com' LIMIT 1), true, true),

(UUID(), 'Desarrollo Web Moderno: Tecnologías 2024', 'desarrollo-web-moderno-2024', 
'Descubre las tecnologías y frameworks más demandados para desarrollo web empresarial en 2024.', 
'El desarrollo web moderno requiere conocimiento de las últimas tecnologías. En este artículo exploramos React, Node.js, TypeScript y las mejores prácticas para crear aplicaciones web escalables y performantes. Incluimos ejemplos prácticos y casos de uso reales.', 
'Desarrollo', (SELECT id FROM usuarios WHERE email = 'jampier@ecosdelseo.com' LIMIT 1), true, true),

(UUID(), 'Optimización de Conversiones: Estrategias CRO', 'optimizacion-conversiones-cro', 
'Cómo mejorar las conversiones de tu sitio web mediante testing A/B y análisis de comportamiento de usuarios.', 
'La optimización de conversiones (CRO) es clave para maximizar el ROI de tu sitio web. Te mostramos técnicas avanzadas de testing A/B, análisis de embudos de conversión y estrategias para mejorar la experiencia de usuario que se traducen en más ventas y leads.', 
'CRO', (SELECT id FROM usuarios WHERE email = 'admin@ecosdelseo.com' LIMIT 1), true, false),

(UUID(), 'Marketing Digital: Tendencias 2024', 'marketing-digital-tendencias-2024', 
'Las principales tendencias de marketing digital que dominarán este año y cómo adaptarse a ellas.', 
'El marketing digital evoluciona constantemente. Analizamos las tendencias más importantes de 2024: IA en marketing, marketing de influencers, contenido interactivo, y nuevas plataformas emergentes. Descubre cómo aplicar estas tendencias en tu estrategia.', 
'Marketing', (SELECT id FROM usuarios WHERE email = 'dev@ecosdelseo.com' LIMIT 1), true, false),

(UUID(), 'Google Ads: Maximizar ROI en 2024', 'google-ads-maximizar-roi-2024', 
'Estrategias avanzadas para optimizar tus campañas de Google Ads y obtener el máximo retorno de inversión.', 
'Google Ads es una herramienta poderosa cuando se usa correctamente. Te enseñamos estrategias avanzadas de segmentación, optimización de palabras clave, y técnicas de bidding automático para maximizar tu ROI y reducir el costo por conversión.', 
'Paid Media', (SELECT id FROM usuarios WHERE email = 'jampier@ecosdelseo.com' LIMIT 1), true, true);

-- ========================================
-- DATOS: eventos_analytics
-- ========================================

INSERT INTO eventos_analytics (id, tipo_evento, url_pagina, titulo_pagina, tipo_dispositivo, navegador, id_sesion) VALUES 
(UUID(), 'VISTA_PAGINA', '/', 'Inicio - Ecos del SEO', 'desktop', 'Chrome', UUID()),
(UUID(), 'VISTA_PAGINA', '/servicios/desarrollo-web', 'Desarrollo Web Empresarial - Ecos del SEO', 'mobile', 'Safari', UUID()),
(UUID(), 'VISTA_PAGINA', '/servicios/seo-marketing', 'SEO y Marketing Digital - Ecos del SEO', 'desktop', 'Firefox', UUID()),
(UUID(), 'ENVIO_FORMULARIO', '/contacto', 'Contacto - Ecos del SEO', 'desktop', 'Chrome', UUID()),
(UUID(), 'VISTA_SERVICIO', '/servicios/software-medida', 'Software a Medida - Ecos del SEO', 'tablet', 'Chrome', UUID()),
(UUID(), 'VISTA_PAGINA', '/servicios/paid-media', 'Paid Media Alto ROI - Ecos del SEO', 'mobile', 'Chrome', UUID()),
(UUID(), 'VISTA_PAGINA', '/servicios/ux-ui-cro', 'UX/UI & CRO - Ecos del SEO', 'desktop', 'Edge', UUID()),
(UUID(), 'VISTA_PAGINA', '/servicios/social-media', 'Social Media Management - Ecos del SEO', 'desktop', 'Chrome', UUID()),
(UUID(), 'CLICK_BOTON', '/contacto', 'Contacto - Ecos del SEO', 'mobile', 'Safari', UUID()),
(UUID(), 'VISTA_PAGINA', '/blog/guia-seo-2024', 'Guía SEO 2024 - Ecos del SEO', 'desktop', 'Chrome', UUID());

-- ========================================
-- DATOS: paginas_servicios (contenido básico)
-- ========================================

-- Contenido para desarrollo web
INSERT INTO paginas_servicios (id, servicio_id, titulo_hero, subtitulo_hero, lista_caracteristicas, pasos_proceso) 
SELECT 
    UUID(),
    s.id,
    'Desarrollo Web que Impulsa tu Negocio',
    'Creamos plataformas web empresariales modernas, seguras y optimizadas para conversiones',
    JSON_ARRAY('Diseño responsive', 'Optimización SEO', 'Seguridad avanzada', 'Performance optimizado', 'Panel de administración', 'Integración con APIs'),
    JSON_ARRAY(
        JSON_OBJECT('paso', 1, 'titulo', 'Análisis y Planificación', 'descripcion', 'Analizamos tus necesidades y definimos la arquitectura técnica'),
        JSON_OBJECT('paso', 2, 'titulo', 'Diseño UX/UI', 'descripcion', 'Creamos wireframes y diseños centrados en la experiencia de usuario'),
        JSON_OBJECT('paso', 3, 'titulo', 'Desarrollo', 'descripcion', 'Desarrollamos con tecnologías modernas y mejores prácticas'),
        JSON_OBJECT('paso', 4, 'titulo', 'Testing y Lanzamiento', 'descripcion', 'Probamos exhaustivamente y lanzamos tu plataforma')
    )
FROM servicios s WHERE s.slug = 'desarrollo-web';

-- Contenido para SEO
INSERT INTO paginas_servicios (id, servicio_id, titulo_hero, subtitulo_hero, lista_caracteristicas, pasos_proceso) 
SELECT 
    UUID(),
    s.id,
    'Domina Google con Nuestro SEO',
    'Estrategias SEO integrales que posicionan tu empresa en los primeros resultados de búsqueda',
    JSON_ARRAY('Auditoría SEO completa', 'Investigación de palabras clave', 'SEO técnico', 'Content marketing', 'Link building', 'Reportes mensuales'),
    JSON_ARRAY(
        JSON_OBJECT('paso', 1, 'titulo', 'Auditoría SEO', 'descripcion', 'Analizamos tu sitio web y identificamos oportunidades de mejora'),
        JSON_OBJECT('paso', 2, 'titulo', 'Estrategia de Keywords', 'descripcion', 'Investigamos y seleccionamos las mejores palabras clave para tu negocio'),
        JSON_OBJECT('paso', 3, 'titulo', 'Optimización', 'descripcion', 'Implementamos mejoras técnicas y de contenido'),
        JSON_OBJECT('paso', 4, 'titulo', 'Seguimiento', 'descripcion', 'Monitoreamos posiciones y ajustamos la estrategia continuamente')
    )
FROM servicios s WHERE s.slug = 'seo-marketing';

-- ========================================
-- DATOS: suscriptores_email (ejemplos)
-- ========================================

INSERT INTO suscriptores_email (id, email, nombre, fuente_suscripcion, intereses) VALUES 
(UUID(), 'newsletter@ejemplo.com', 'Usuario Newsletter', 'SITIO_WEB', JSON_ARRAY('SEO', 'Marketing Digital')),
(UUID(), 'suscriptor@test.com', 'Test Suscriptor', 'BLOG', JSON_ARRAY('Desarrollo Web', 'UX/UI')),
(UUID(), 'marketing@demo.com', 'Demo Marketing', 'LEAD_MAGNET', JSON_ARRAY('Paid Media', 'Analytics'));

-- ========================================
-- VERIFICACIÓN DE DATOS CARGADOS
-- ========================================

-- Mostrar resumen de datos insertados
SELECT 'usuarios' as tabla, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'servicios', COUNT(*) FROM servicios
UNION ALL
SELECT 'contactos', COUNT(*) FROM contactos
UNION ALL
SELECT 'configuraciones_sitio', COUNT(*) FROM configuraciones_sitio
UNION ALL
SELECT 'entradas_blog', COUNT(*) FROM entradas_blog
UNION ALL
SELECT 'eventos_analytics', COUNT(*) FROM eventos_analytics
UNION ALL
SELECT 'paginas_servicios', COUNT(*) FROM paginas_servicios
UNION ALL
SELECT 'suscriptores_email', COUNT(*) FROM suscriptores_email;