# 🚀 Plan de Implementación Escalable - Ecos del SEO
## Backend + Frontend Separados | Archivos en Español | Optimizado para Hostinger

### 📊 Estado Actual: Frontend Avanzado | Backend y Base de Datos Pendientes

---

## 📊 Arquitectura del Proyecto - Separación Backend/Frontend

📁 ecos-del-seo/
├── 🔧 backend/                  # API Node.js + PostgreSQL
│   ├── servidor/
│   ├── base-datos/
│   ├── controladores/
│   ├── rutas/
│   ├── modelos/
│   ├── middleware/
│   ├── utilidades/
│   ├── configuracion/
│   └── despliegue/
│
├── 🎨 frontend/                 # HTML + CSS + JS
│   ├── paginas/
│   ├── recursos/
│   ├── componentes/
│   ├── js/
│   ├── css/
│   ├── imagenes/
│   └── admin/
│
└── 📚 documentacion/
    ├── instalacion/
    ├── api/
    └── hostinger/

---

## 🎯 ETAPA 1: Configuración Base - Backend
**Duración: 1-2 semanas**
**Estado: ⏱️ Pendiente**

### **🗂️ Estructura Backend - Etapa 1**
```
backend/
├── package.json                 # Dependencias del proyecto
├── servidor.js                  # Archivo principal del servidor
├── .env.ejemplo                 # Variables de entorno para Hostinger
├── .gitignore                   # Archivos a ignorar
├── README.md                    # Documentación en español
│
├── configuracion/
│   ├── base-datos.js            # Configuración PostgreSQL Hostinger
│   ├── aplicacion.js            # Configuración general
│   ├── email.js                 # Configuración email
│   └── hostinger.js             # Configuración específica Hostinger
│
├── base-datos/
│   ├── esquema.sql              # Schema PostgreSQL inicial
│   ├── datos-iniciales/
│   │   ├── usuarios.sql         # Usuarios iniciales
│   │   ├── servicios.sql        # Servicios base
│   │   └── configuraciones.sql  # Configuraciones del sitio
│   └── migraciones/
│       └── 001_configuracion_inicial.sql
│
├── utilidades/
│   ├── logger.js                # Sistema de logs
│   ├── validador.js             # Validaciones
│   ├── respuestas.js            # Respuestas estandarizadas
│   └── conexion-bd.js           # Conexión a base de datos
│
└── documentacion/
    ├── hostinger-setup.md       # Configuración en Hostinger
    ├── base-datos-setup.md      # Setup PostgreSQL
    └── variables-entorno.md     # Variables de entorno
```

### **📋 Requerimientos Mínimos - Etapa 1 Backend**
- [ ] **Node.js v18+ configurado localmente**
- [ ] **PostgreSQL configurado en Hostinger**
- [ ] **Conexión a base de datos Hostinger establecida**
- [ ] **Variables de entorno configuradas para Hostinger**
- [ ] **Servidor Express básico funcionando**
- [ ] **Schema inicial de PostgreSQL ejecutado**
- [ ] **Sistema de logs implementado**
- [ ] **Documentación de configuración Hostinger**
- [ ] **Git repository inicializado**
- [ ] **Respuestas API estandarizadas funcionando**

### **🔧 Consideraciones Especiales Hostinger:**
- **Límites de recursos:** CPU y memoria optimizada
- **Variables de entorno:** Configuración específica de Hostinger
- **Base de datos:** PostgreSQL remota de Hostinger
- **SSL:** Certificado SSL automático de Hostinger
- **Dominio:** Configuración con subdominio api.ecosdelseo.com

---

## 🎨 ETAPA 2: Frontend Base - Estructura HTML/CSS/JS
**Duración: 3-4 semanas**
**Estado: ✅ Implementado Parcialmente**

### **🗂️ Estructura Frontend - Etapa 2**
```
frontend/
├── index.html                   # Página principal
├── .htaccess                    # Configuración Apache Hostinger
├── robots.txt                   # SEO
├── sitemap.xml                  # Mapa del sitio
│
├── paginas/
│   ├── servicios.html           # Lista de servicios
│   ├── nosotros.html            # Sobre la empresa
│   ├── contacto.html            # Formulario de contacto
│   ├── blog.html                # Blog principal
│   └── politicas/
│       ├── privacidad.html      # Política de privacidad
│       └── terminos.html        # Términos y condiciones
│
├── recursos/
│   ├── css/
│   │   ├── principal.css        # CSS principal compilado
│   │   ├── base/
│   │   │   ├── variables.css    # Variables CSS
│   │   │   ├── reset.css        # Reset CSS
│   │   │   └── tipografia.css   # Tipografías
│   │   ├── componentes/
│   │   │   ├── header.css       # Estilos header
│   │   │   ├── footer.css       # Estilos footer
│   │   │   ├── botones.css      # Botones reutilizables
│   │   │   ├── formularios.css  # Formularios
│   │   │   └── tarjetas.css     # Cards de servicios
│   │   └── paginas/
│   │       ├── inicio.css       # Específico home
│   │       ├── servicios.css    # Específico servicios
│   │       └── contacto.css     # Específico contacto
│   │
│   ├── js/
│   │   ├── principal.js         # JavaScript principal
│   │   ├── nucleo/
│   │   │   ├── aplicacion.js    # Inicializador
│   │   │   ├── api-cliente.js   # Cliente API
│   │   │   └── utilidades.js    # Utilidades generales
│   │   ├── componentes/
│   │   │   ├── navegacion.js    # Navegación responsive
│   │   │   ├── formularios.js   # Manejo formularios
│   │   │   ├── modales.js       # Modales
│   │   │   └── animaciones.js   # Animaciones
│   │   └── paginas/
│   │       ├── inicio.js        # Lógica página inicio
│   │       ├── servicios.js     # Lógica servicios
│   │       └── contacto.js      # Lógica contacto
│   │
│   ├── imagenes/
│   │   ├── logos/               # Logos y branding
│   │   ├── heroes/              # Imágenes hero sections
│   │   ├── servicios/           # Imágenes servicios
│   │   ├── equipo/              # Fotos del equipo
│   │   └── optimizadas/         # Imágenes optimizadas WebP
│   │
│   └── fuentes/                 # Fuentes web
│       ├── inter/               # Fuente principal
│       └── poppins/             # Fuente headings
│
├── componentes/
│   ├── header.html              # Header reutilizable
│   ├── footer.html              # Footer reutilizable
│   ├── tarjeta-servicio.html    # Card de servicio
│   ├── formulario-contacto.html # Formulario de contacto
│   └── modal-base.html          # Modal base
│
└── admin/                       # Panel administración
    ├── index.html               # Dashboard principal
    ├── login.html               # Login administrador
    ├── recursos/
    │   ├── css/
    │   │   └── admin.css        # Estilos admin
    │   └── js/
    │       └── admin.js         # JavaScript admin
    └── paginas/
        ├── leads.html           # Gestión leads
        ├── contenido.html       # Gestión contenido
        └── configuracion.html   # Configuraciones
```

### **📋 Requerimientos Mínimos - Etapa 2 Frontend**
- [x] **Landing page responsive al 100%**
- [x] **5 páginas principales HTML funcionales**
- [x] **Navegación responsive con menú móvil**
- [x] **Sistema de componentes HTML reutilizables**
- [x] **CSS modular**
- [x] **JavaScript básico funcionando**
- [ ] **Formulario de contacto integrado con backend** (pendiente backend)
- [x] **Optimización de imágenes**
- [x] **SEO básico: meta tags, títulos, descripciones**
- [ ] **Configuración .htaccess para Hostinger**
- [x] **Cross-browser compatibility**
- [ ] **Google PageSpeed > 85 en móvil** (pendiente verificación)

### **🔧 Consideraciones Hostinger Frontend:**
- **Apache .htaccess:** Redirecciones y cache
- **Compresión GZIP:** Optimización automática
- **CDN:** Uso del CDN gratuito de Hostinger
- **SSL:** HTTPS forzado en todas las páginas

---

## ⚙️ ETAPA 3: Backend API Completa
**Duración: 3-4 semanas**
**Estado: ⏱️ Pendiente**

### **🗂️ Estructura Backend API - Etapa 3**
```
backend/
├── servidor.js                  # Servidor principal actualizado
├── aplicacion.js                # Configuración Express completa
│
├── rutas/
│   ├── api/
│   │   ├── indice.js            # Router principal API
│   │   ├── autenticacion.js     # Login/registro
│   │   ├── contactos.js         # Gestión contactos/leads
│   │   ├── servicios.js         # Gestión servicios
│   │   ├── contenido.js         # Gestión contenido
│   │   └── publicas.js          # Endpoints públicos
│   │
│   └── web/
│       ├── indice.js            # Rutas web principales
│       └── paginas.js           # Páginas dinámicas
│
├── controladores/
│   ├── autenticacion-controlador.js    # Lógica autenticación
│   ├── contactos-controlador.js        # Lógica contactos
│   ├── servicios-controlador.js        # Lógica servicios
│   ├── contenido-controlador.js        # Lógica contenido
│   └── publico-controlador.js          # Controladores públicos
│
├── modelos/
│   ├── Usuario.js               # Modelo usuario
│   ├── Contacto.js              # Modelo contacto
│   ├── Servicio.js              # Modelo servicio
│   ├── PaginaServicio.js        # Modelo página servicio
│   ├── Contenido.js             # Modelo contenido
│   └── ModeloBase.js            # Modelo base con métodos comunes
│
├── middleware/
│   ├── autenticacion.js         # Middleware autenticación JWT
│   ├── validacion.js            # Validación requests
│   ├── limite-peticiones.js     # Rate limiting
│   ├── cors.js                  # CORS configuration
│   ├── manejo-errores.js        # Manejo global errores
│   └── logs.js                  # Middleware logging
│
├── utilidades/
│   ├── base-datos.js            # Utilidades BD
│   ├── email.js                 # Envío emails
│   ├── jwt.js                   # Utilidades JWT
│   ├── hash.js                  # Hashing passwords
│   ├── validaciones.js          # Validaciones personalizadas
│   └── archivos.js              # Manejo archivos
│
├── servicios/                   # Servicios de negocio
│   ├── servicio-email.js        # Servicio email
│   ├── servicio-contactos.js    # Servicio contactos
│   └── servicio-contenido.js    # Servicio contenido
│
└── configuracion/
    ├── base-datos.js            # Config PostgreSQL
    ├── email.js                 # Config email (SMTP Hostinger)
    ├── jwt.js                   # Config JWT
    ├── aplicacion.js            # Config general
    └── hostinger-prod.js        # Config producción Hostinger
```

### **📋 Requerimientos Mínimos - Etapa 3 Backend**
- [ ] **API REST completa con documentación**
- [ ] **Autenticación JWT segura funcionando**
- [ ] **CRUD completo contactos/leads**
- [ ] **CRUD completo servicios**
- [ ] **Sistema validación datos robusto**
- [ ] **Manejo errores centralizado**
- [ ] **Rate limiting configurado**
- [ ] **CORS configurado para Hostinger**
- [ ] **Envío emails SMTP Hostinger funcionando**
- [ ] **Logs estructurados implementados**
- [ ] **Base de datos optimizada**
- [ ] **Tests unitarios básicos**
- [ ] **Documentación API completa**
- [ ] **Configuración producción Hostinger**

### **🔧 Configuración SMTP Hostinger:**
- **Host:** smtp.hostinger.com
- **Puerto:** 587 (TLS) o 465 (SSL)
- **Autenticación:** email@ecosdelseo.com
- **Configuración específica en backend**

---

## 🎛️ ETAPA 4: Panel Administración Frontend
**Duración: 2-3 semanas**
**Estado: ⏱️ Pendiente**

### **🗂️ Estructura Admin Panel - Etapa 4**
```
frontend/admin/
├── index.html                   # Dashboard principal
├── login.html                   # Página login
├── .htaccess                    # Protección directorio admin
│
├── paginas/
│   ├── dashboard.html           # Panel control principal
│   ├── leads.html               # Gestión leads
│   ├── servicios.html           # Gestión servicios
│   ├── contenido.html           # Editor contenido
│   ├── analytics.html           # Estadísticas
│   ├── configuracion.html       # Configuraciones sitio
│   └── perfil.html              # Perfil usuario
│
├── recursos/
│   ├── css/
│   │   ├── admin-principal.css  # CSS principal admin
│   │   ├── dashboard.css        # Estilos dashboard
│   │   ├── tablas.css           # Estilos tablas datos
│   │   ├── formularios-admin.css # Formularios admin
│   │   └── graficos.css         # Estilos gráficos
│   │
│   ├── js/
│   │   ├── admin-principal.js   # JS principal admin
│   │   ├── dashboard.js         # Lógica dashboard
│   │   ├── cliente-api.js       # Cliente API admin
│   │   ├── modulos/
│   │   │   ├── leads.js         # Módulo gestión leads
│   │   │   ├── servicios.js     # Módulo servicios
│   │   │   ├── contenido.js     # Módulo contenido
│   │   │   ├── graficos.js      # Gráficos estadísticas
│   │   │   └── notificaciones.js # Sistema notificaciones
│   │   └── utilidades/
│   │       ├── validaciones.js  # Validaciones frontend
│   │       ├── formateo.js      # Formateo datos
│   │       └── exportar.js      # Exportación datos
│   │
│   └── vendor/                  # Librerías externas
│       ├── chart.min.js         # Gráficos (Chart.js)
│       ├── datatables.min.js    # Tablas datos
│       └── tinymce/             # Editor de texto
│           └── tinymce.min.js
│
├── componentes/
│   ├── sidebar.html             # Barra lateral navegación
│   ├── topbar.html              # Barra superior
│   ├── tabla-datos.html         # Tabla datos genérica
│   ├── modal-admin.html         # Modal genérico admin
│   ├── card-metrica.html        # Card para métricas
│   └── formulario-base.html     # Formulario base admin
│
└── plantillas/
    ├── base-admin.html          # Plantilla base admin
    ├── dashboard-widgets.html   # Widgets dashboard
    └── editor-contenido.html    # Editor contenido
```

### **📋 Requerimientos Mínimos - Etapa 4 Admin**
- [ ] **Login seguro administradores**
- [ ] **Dashboard métricas tiempo real**
- [ ] **CRUD completo leads interfaz amigable**
- [ ] **Editor contenido visual (TinyMCE)**
- [ ] **Gestión servicios completa**
- [ ] **Sistema permisos roles**
- [ ] **Tablas datos paginación/filtros**
- [ ] **Gráficos estadísticas**
- [ ] **Exportación datos (CSV/PDF)**
- [ ] **Notificaciones tiempo real**
- [ ] **Interfaz responsive admin**
- [ ] **Protección directorio .htaccess**

---

## 📄 ETAPA 5: Páginas Servicios Dinámicas
**Duración: 2-3 semanas**
**Estado: ✅ Implementado Parcialmente**

### **🗂️ Estructura Páginas Servicios - Etapa 5**
```
frontend/servicios/
├── desarrollo-web/
│   ├── index.html               # Página desarrollo web
│   ├── recursos/
│   │   ├── css/
│   │   │   └── desarrollo-web.css
│   │   ├── js/
│   │   │   └── desarrollo-web.js
│   │   └── imagenes/
│   │       ├── hero-desarrollo.webp
│   │       ├── proceso-desarrollo.webp
│   │       └── casos-exito/
│   └── componentes/
│       ├── hero-desarrollo.html
│       ├── caracteristicas.html
│       ├── proceso-trabajo.html
│       ├── precios.html
│       └── casos-estudio.html
│
├── seo-marketing/
│   ├── index.html               # Página SEO y marketing
│   ├── recursos/
│   └── componentes/
│
├── software-medida/
│   ├── index.html               # Página software a medida
│   ├── recursos/
│   └── componentes/
│
├── paid-media/
│   ├── index.html               # Página paid media
│   ├── recursos/
│   └── componentes/
│
├── ux-ui-cro/
│   ├── index.html               # Página UX/UI y CRO
│   ├── recursos/
│   └── componentes/
│
├── social-media/
│   ├── index.html               # Página social media
│   ├── recursos/
│   └── componentes/
│
└── compartido/
    ├── css/
    │   └── servicios-base.css   # CSS base servicios
    ├── js/
    │   └── servicios-base.js    # JS base servicios
    └── plantillas/
        ├── servicio-base.html   # Plantilla base
        ├── hero-servicio.html   # Hero genérico
        ├── caracteristicas.html # Características
        ├── proceso-pasos.html   # Proceso trabajo
        ├── precios-tabla.html   # Tabla precios
        ├── testimonios.html     # Testimonios
        ├── casos-exito.html     # Casos de éxito
        ├── preguntas-frecuentes.html # FAQ
        └── llamada-accion.html  # CTA final
```

### **📋 Requerimientos Mínimos - Etapa 5 Servicios**
- [x] **6 páginas servicios completamente funcionales** (7 implementadas)
- [x] **Contenido específico por servicio**
- [x] **SEO básico página individual**
- [x] **URLs amigables (/servicios/[nombre-servicio].html)**
- [ ] **Formularios contacto específicos integrados con backend** (pendiente backend)
- [ ] **Breadcrumbs navegación**
- [ ] **Schema markup implementado**
- [x] **Imágenes de servicio**
- [ ] **Testimonios casos éxito completos**
- [x] **CTAs básicos**
- [ ] **Tiempo carga < 3 segundos** (pendiente verificación)
- [x] **Estructura reutilizable**

---

## 🔧 ETAPA 6: Backend Funcionalidades Avanzadas
**Duración: 3-4 semanas**
**Estado: ⏱️ Pendiente**

### **🗂️ Estructura Backend Avanzado - Etapa 6**
```
backend/
├── servicios/
│   ├── servicio-analytics.js    # Analytics personalizado
│   ├── servicio-notificaciones.js # Notificaciones tiempo real
│   ├── servicio-email-marketing.js # Email marketing
│   ├── servicio-integraciones.js   # Integraciones externas
│   ├── servicio-scoring-leads.js   # Scoring automático leads
│   └── servicio-whatsapp.js        # Integración WhatsApp
│
├── trabajos/                    # Jobs/Tareas programadas
│   ├── cola-emails.js           # Cola procesamiento emails
│   ├── procesador-analytics.js  # Procesamiento analytics
│   ├── seguimiento-leads.js     # Seguimiento automático
│   ├── backup-automatico.js     # Backup automático
│   └── limpieza-datos.js        # Limpieza datos antiguos
│
├── integraciones/               # APIs externas
│   ├── google-analytics.js      # Google Analytics
│   ├── whatsapp-business.js     # WhatsApp Business
│   ├── mailgun.js               # Mailgun (alternativa SMTP)
│   ├── google-maps.js           # Google Maps
│   └── hostinger-apis.js        # APIs específicas Hostinger
│
├── webhooks/
│   ├── whatsapp-webhook.js      # Webhook WhatsApp
│   ├── analytics-webhook.js     # Webhook analytics
│   └── email-webhook.js         # Webhook emails
│
├── rutas/
│   ├── api/
│   │   ├── analytics.js         # Endpoints analytics
│   │   ├── notificaciones.js    # Endpoints notificaciones
│   │   ├── email-marketing.js   # Endpoints email marketing
│   │   └── integraciones.js     # Endpoints integraciones
│   │
│   └── webhooks/
│       ├── whatsapp.js          # Rutas webhook WhatsApp
│       └── analytics.js         # Rutas webhook analytics
│
└── configuracion/
    ├── integraciones.js         # Config integraciones
    ├── trabajos-programados.js  # Config cron jobs
    └── webhooks.js              # Config webhooks
```

### **📋 Requerimientos Mínimos - Etapa 6 Backend Avanzado**
- [ ] **Sistema analytics propio funcionando**
- [ ] **Integración WhatsApp Business**
- [ ] **Email marketing automatizado**
- [ ] **Notificaciones tiempo real**
- [ ] **Lead scoring automático**
- [ ] **Cola procesamiento emails**
- [ ] **Trabajos programados (cron) funcionando**
- [ ] **Integración Google Analytics**
- [ ] **Sistema webhooks operativo**
- [ ] **Backup automático configurado**
- [ ] **API rate limiting avanzado**
- [ ] **Logs estructurados completos**
- [ ] **Cache implementado**
- [ ] **Monitoreo performance activo**

---

## 📊 ETAPA 7: SEO y Optimización Final
**Duración: 2 semanas**
**Estado: ⏱️ Pendiente**

### **🗂️ Estructura SEO y Optimización - Etapa 7**
```
frontend/
├── seo/
│   ├── sitemap.xml              # Sitemap dinámico
│   ├── robots.txt               # Robots.txt optimizado
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service worker
│   └── schemas/
│       ├── organizacion.json    # Schema organización
│       ├── servicios.json       # Schema servicios
│       └── breadcrumbs.json     # Schema breadcrumbs
│
├── optimizacion/
│   ├── css/
│   │   ├── critico.css          # CSS crítico inline
│   │   └── principal.min.css    # CSS minificado
│   ├── js/
│   │   ├── principal.min.js     # JS minificado
│   │   └── analytics.min.js     # Analytics optimizado
│   └── imagenes/
│       ├── webp/                # Imágenes WebP
│       ├── optimizadas/         # Imágenes optimizadas
│       └── lazy/                # Imágenes lazy loading
│
└── herramientas/
    ├── generador-sitemap.js     # Generador sitemap
    ├── optimizador-imagenes.js  # Optimizador imágenes
    ├── minificador-css.js       # Minificador CSS
    ├── minificador-js.js        # Minificador JS
    └── generador-webp.js        # Generador WebP

backend/
├── seo/
│   ├── generador-sitemap.js     # Generador sitemap dinámico
│   ├── meta-tags.js             # Meta tags dinámicos
│   └── schema-markup.js         # Schema markup automático
│
└── optimizacion/
    ├── cache.js                 # Sistema cache
    ├── compresion.js            # Compresión respuestas
    └── performance.js           # Monitor performance
```

### **📋 Requerimientos Mínimos - Etapa 7 SEO**
- [ ] **Google PageSpeed >95 móvil/desktop**
- [ ] **Core Web Vitals optimizados**
- [ ] **Sitemap XML dinámico actualizado**
- [ ] **Schema markup todas páginas**
- [ ] **Meta tags únicos optimizados**
- [ ] **Open Graph Twitter Cards**
- [ ] **Imágenes WebP lazy loading**
- [ ] **CSS/JS minificados comprimidos**
- [ ] **URLs canónicas configuradas**
- [ ] **Headers cache optimizados**
- [ ] **Compresión GZIP configurada**
- [ ] **PWA básica implementada**
- [ ] **Accesibilidad WCAG 2.1 AA**
- [ ] **Testing cross-browser completo**

---

## ☁️ ETAPA 8: Despliegue Hostinger
**Duración: 1-2 semanas**
**Estado: ⏱️ Pendiente**

### **🗂️ Estructura Despliegue Hostinger - Etapa 8**
```
despliegue-hostinger/
├── scripts/
│   ├── desplegar-frontend.sh    # Script deploy frontend
│   ├── desplegar-backend.sh     # Script deploy backend
│   ├── configurar-base-datos.sh # Setup BD Hostinger
│   ├── configurar-ssl.sh        # Configuración SSL
│   └── verificar-salud.sh       # Health check
│
├── configuracion/
│   ├── .htaccess                # Apache config optimizado
│   ├── hostinger.env            # Variables entorno producción
│   ├── package-prod.json        # Dependencies producción
│   └── pm2.config.js            # PM2 para Node.js
│
├── frontend-hostinger/
│   ├── public_html/             # Directorio público Hostinger
│   │   ├── index.html
│   │   ├── paginas/
│   │   ├── recursos/
│   │   ├── admin/
│   │   ├── servicios/
│   │   ├── .htaccess
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   │
│   └── configuracion/
│       ├── hostinger-apache.conf
│       └── ssl-hostinger.conf
│
├── backend-hostinger/
│   ├── app/                     # Aplicación Node.js
│   │   ├── servidor.js
│   │   ├── aplicacion.js
│   │   ├── rutas/
│   │   ├── controladores/
│   │   ├── modelos/
│   │   ├── middleware/
│   │   ├── utilidades/
│   │   ├── servicios/
│   │   └── configuracion/
│   │
│   ├── configuracion/
│   │   ├── produccion.env       # Variables producción
│   │   ├── pm2-hostinger.json   # Config PM2
│   │   └── nodejs-hostinger.conf
│   │
│   └── base-datos/
│       ├── esquema-produccion.sql
│       ├── datos-produccion.sql
│       └── backup/
│           └── respaldo-diario.sh
│
├── monitoreo/
│   ├── uptime-monitor.js        # Monitor uptime
│   ├── performance-monitor.js   # Monitor performance
│   ├── error-alerting.js        # Alertas errores
│   └── logs-analyzer.js         # Analizador logs
│
├── ssl/
│   ├── generar-ssl-hostinger.sh
│   └── renovar-ssl-hostinger.sh
│
└── documentacion/
    ├── manual-despliegue.md     # Manual despliegue paso a paso
    ├── configuracion-hostinger.md # Config específica Hostinger
    ├── troubleshooting.md       # Solución problemas
    └── mantenimiento.md         # Guía mantenimiento

### **📋 Requerimientos Mínimos - Etapa 8 Hostinger**
- [ ] **Frontend desplegado en public_html Hostinger**
- [ ] **Backend Node.js funcionando en Hostinger**
- [ ] **PostgreSQL conectado y optimizado**
- [ ] **SSL/TLS configurado automático Hostinger**
- [ ] **Dominio principal ecosdelseo.com funcionando**
- [ ] **Subdominio api.ecosdelseo.com para backend**
- [ ] **PM2 configurado para gestión procesos**
- [ ] **Backup automático configurado**
- [ ] **Monitoreo uptime activo**
- [ ] **Logs centralizados funcionando**
- [ ] **Email SMTP Hostinger configurado**
- [ ] **Cache y compresión optimizados**
- [ ] **Firewall y seguridad configurados**
- [ ] **Documentación despliegue completa**

### **🔧 Configuraciones Específicas Hostinger:**

#### **Variables de Entorno Hostinger:**
```bash
# .env para Hostinger
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Base de datos PostgreSQL Hostinger
DB_HOST=postgresql.hostinger.com
DB_PORT=5432
DB_NAME=ecosdelseo_db
DB_USER=ecosdelseo_user
DB_PASSWORD=password_seguro_hostinger
DB_SSL=true

# Email SMTP Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contacto@ecosdelseo.com
SMTP_PASS=password_email_hostinger
SMTP_FROM=contacto@ecosdelseo.com

# URLs
FRONTEND_URL=https://ecosdelseo.com
BACKEND_URL=https://api.ecosdelseo.com
ADMIN_URL=https://ecosdelseo.com/admin

# JWT y Seguridad
JWT_SECRET=clave_secreta_muy_larga_y_segura
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# APIs Externas
GOOGLE_ANALYTICS_ID=GA_TRACKING_ID
WHATSAPP_TOKEN=whatsapp_business_token
WHATSAPP_PHONE=+34600000000
```

---

## 🗄️ BASE DE DATOS POSTGRESQL OPTIMIZADA PARA HOSTINGER
**Estado: ⏱️ Pendiente de Implementación**

```sql
-- ========================================
-- ECOS DEL SEO - POSTGRESQL HOSTINGER
-- Base de datos optimizada para Hostinger
-- Pendiente de implementación
-- ========================================

-- Extensiones (verificar disponibilidad en Hostinger)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Tipos personalizados
CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'GERENTE', 'CLIENTE');
CREATE TYPE estado_lead AS ENUM ('NUEVO', 'CONTACTADO', 'EN_PROGRESO', 'CALIFICADO', 'CERRADO_GANADO', 'CERRADO_PERDIDO');
CREATE TYPE nivel_prioridad AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'URGENTE');
CREATE TYPE tipo_notificacion AS ENUM ('NUEVO_LEAD', 'ACTUALIZACION_LEAD', 'RECORDATORIO_REUNION', 'ALERTA_SISTEMA', 'ACTUALIZACION_MARKETING');
CREATE TYPE tipo_evento AS ENUM ('VISTA_PAGINA', 'ENVIO_FORMULARIO', 'CLICK_BOTON', 'DESCARGA_ARCHIVO', 'SUSCRIPCION_EMAIL', 'VISTA_SERVICIO');

-- ========================================
-- TABLA: usuarios
-- ========================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    rol rol_usuario DEFAULT 'CLIENTE',
    hash_password VARCHAR(255),
    url_avatar TEXT,
    telefono VARCHAR(20),
    empresa VARCHAR(255),
    esta_activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_verificacion_email VARCHAR(255),
    token_reset_password VARCHAR(255),
    expira_reset_password TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: servicios
-- ========================================
CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT,
    descripcion_corta VARCHAR(500),
    icono VARCHAR(100),
    caracteristicas JSONB,
    informacion_precios JSONB,
    titulo_meta VARCHAR(255),
    descripcion_meta VARCHAR(500),
    palabras_clave TEXT,
    imagen_header VARCHAR(255),
    esta_activo BOOLEAN DEFAULT TRUE,
    es_destacado BOOLEAN DEFAULT FALSE,
    orden_clasificacion INTEGER DEFAULT 0,
    contador_visitas INTEGER DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: paginas_servicios
-- ========================================
CREATE TABLE paginas_servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    servicio_id UUID NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
    titulo_hero VARCHAR(255),
    subtitulo_hero VARCHAR(500),
    imagen_hero VARCHAR(255),
    texto_cta_hero VARCHAR(100),
    enlace_cta_hero VARCHAR(255),
    
    -- Secciones de contenido
    secciones_contenido JSONB,
    lista_caracteristicas JSONB,
    pasos_proceso JSONB,
    beneficios JSONB,
    
    -- Precios y testimonios
    niveles_precios JSONB,
    testimonios JSONB,
    casos_estudio JSONB,
    
    -- FAQ y CTA
    preguntas_frecuentes JSONB,
    seccion_cta JSONB,
    
    -- SEO específico
    schema_pagina JSONB,
    
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: contactos
-- ========================================
CREATE TABLE contactos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    
    -- Gestión del lead
    estado estado_lead DEFAULT 'NUEVO',
    prioridad nivel_prioridad DEFAULT 'MEDIA',
    puntuacion INTEGER DEFAULT 0,
    asignado_a UUID REFERENCES usuarios(id),
    
    -- Seguimiento
    notas TEXT,
    etiquetas JSONB,
    campos_personalizados JSONB,
    ultimo_contacto TIMESTAMP WITH TIME ZONE,
    proximo_seguimiento TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    direccion_ip INET,
    agente_usuario TEXT,
    
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: interacciones_contactos
-- ========================================
CREATE TABLE interacciones_contactos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contacto_id UUID NOT NULL REFERENCES contactos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id),
    tipo_interaccion VARCHAR(50) NOT NULL, -- 'email', 'llamada', 'reunion', 'nota'
    asunto VARCHAR(255),
    contenido TEXT,
    fecha_interaccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duracion_minutos INTEGER,
    resultado VARCHAR(100),
    proxima_accion VARCHAR(255),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: entradas_blog
-- ========================================
CREATE TABLE entradas_blog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    extracto VARCHAR(500),
    contenido TEXT,
    imagen_destacada VARCHAR(255),
    autor_id UUID REFERENCES usuarios(id),
    categoria VARCHAR(100),
    etiquetas JSONB,
    
    -- SEO
    titulo_meta VARCHAR(255),
    descripcion_meta VARCHAR(500),
    palabras_clave TEXT,
    
    -- Publicación
    esta_publicado BOOLEAN DEFAULT FALSE,
    es_destacado BOOLEAN DEFAULT FALSE,
    publicado_en TIMESTAMP WITH TIME ZONE,
    
    -- Analytics
    contador_visitas INTEGER DEFAULT 0,
    tiempo_lectura INTEGER, -- minutos
    
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: configuraciones_sitio
-- ========================================
CREATE TABLE configuraciones_sitio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clave_configuracion VARCHAR(100) UNIQUE NOT NULL,
    valor_configuracion JSONB,
    descripcion TEXT,
    tipo_configuracion VARCHAR(50), -- 'string', 'number', 'boolean', 'json', 'file'
    es_publico BOOLEAN DEFAULT FALSE,
    actualizado_por UUID REFERENCES usuarios(id),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: eventos_analytics
-- ========================================
CREATE TABLE eventos_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_evento tipo_evento NOT NULL,
    url_pagina VARCHAR(500),
    titulo_pagina VARCHAR(255),
    url_referencia TEXT,
    agente_usuario TEXT,
    direccion_ip INET,
    pais VARCHAR(2), -- código ISO país
    ciudad VARCHAR(100),
    tipo_dispositivo VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    navegador VARCHAR(50),
    sistema_operativo VARCHAR(50),
    
    -- Tracking de sesión
    id_sesion VARCHAR(255),
    usuario_id UUID REFERENCES usuarios(id),
    contacto_id UUID REFERENCES contactos(id),
    
    -- Datos del evento
    datos_evento JSONB,
    valor_conversion DECIMAL(10,2),
    
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: notificaciones
-- ========================================
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo tipo_notificacion NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT,
    url_accion VARCHAR(255),
    datos JSONB,
    esta_leido BOOLEAN DEFAULT FALSE,
    leido_en TIMESTAMP WITH TIME ZONE,
    expira_en TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: campanas_email
-- ========================================
CREATE TABLE campanas_email (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    plantilla_html TEXT,
    plantilla_texto TEXT,
    nombre_remitente VARCHAR(100),
    email_remitente VARCHAR(255),
    
    -- Programación
    programado_en TIMESTAMP WITH TIME ZONE,
    enviado_en TIMESTAMP WITH TIME ZONE,
    
    -- Estadísticas
    total_destinatarios INTEGER DEFAULT 0,
    total_enviados INTEGER DEFAULT 0,
    total_entregados INTEGER DEFAULT 0,
    total_abiertos INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_rebotados INTEGER DEFAULT 0,
    total_desuscritos INTEGER DEFAULT 0,
    
    -- Metadata
    tipo_campana VARCHAR(50), -- 'newsletter', 'promocional', 'transaccional'
    estado VARCHAR(50) DEFAULT 'BORRADOR', -- 'BORRADOR', 'PROGRAMADO', 'ENVIANDO', 'ENVIADO', 'CANCELADO'
    
    creado_por UUID REFERENCES usuarios(id),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: suscriptores_email
-- ========================================
CREATE TABLE suscriptores_email (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'ACTIVO', -- 'ACTIVO', 'DESUSCRITO', 'REBOTADO'
    fuente_suscripcion VARCHAR(100),
    intereses JSONB,
    campos_personalizados JSONB,
    
    -- Tracking
    suscrito_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    desuscrito_en TIMESTAMP WITH TIME ZONE,
    ultimo_email_enviado TIMESTAMP WITH TIME ZONE,
    total_emails_enviados INTEGER DEFAULT 0,
    total_emails_abiertos INTEGER DEFAULT 0,
    
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: archivos_subidos
-- ========================================
CREATE TABLE archivos_subidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_original VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamano_archivo BIGINT,
    tipo_mime VARCHAR(100),
    tipo_archivo VARCHAR(50), -- 'imagen', 'documento', 'video', etc.
    
    -- Relaciones
    subido_por UUID REFERENCES usuarios(id),
    tabla_relacionada VARCHAR(100),
    id_relacionado UUID,
    
    -- Específico para imágenes
    ancho INTEGER,
    altura INTEGER,
    texto_alt VARCHAR(255),
    
    -- Metadata
    es_publico BOOLEAN DEFAULT FALSE,
    contador_descargas INTEGER DEFAULT 0,
    
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: logs_api
-- ========================================
CREATE TABLE logs_api (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metodo VARCHAR(10) NOT NULL,
    ruta VARCHAR(500) NOT NULL,
    codigo_estado INTEGER,
    tiempo_respuesta_ms INTEGER,
    usuario_id UUID REFERENCES usuarios(id),
    direccion_ip INET,
    agente_usuario TEXT,
    cuerpo_request JSONB,
    cuerpo_response JSONB,
    mensaje_error TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES OPTIMIZADOS PARA HOSTINGER
-- ========================================

-- Usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(esta_activo);

-- Servicios
CREATE INDEX idx_servicios_slug ON servicios(slug);
CREATE INDEX idx_servicios_activo ON servicios(esta_activo);
CREATE INDEX idx_servicios_destacado ON servicios(es_destacado);

-- Contactos (optimizado para búsquedas frecuentes)
CREATE INDEX idx_contactos_email ON contactos(email);
CREATE INDEX idx_contactos_estado ON contactos(estado);
CREATE INDEX idx_contactos_creado_en ON contactos(creado_en);
CREATE INDEX idx_contactos_asignado_a ON contactos(asignado_a);
CREATE INDEX idx_contactos_fuente_lead ON contactos(fuente_lead);
CREATE INDEX idx_contactos_empresa ON contactos(empresa);

-- Interacciones contactos
CREATE INDEX idx_interacciones_contacto_id ON interacciones_contactos(contacto_id);
CREATE INDEX idx_interacciones_fecha ON interacciones_contactos(fecha_interaccion);

-- Blog
CREATE INDEX idx_blog_slug ON entradas_blog(slug);
CREATE INDEX idx_blog_publicado ON entradas_blog(esta_publicado, publicado_en);
CREATE INDEX idx_blog_categoria ON entradas_blog(categoria);

-- Analytics (importantes para reporting)
CREATE INDEX idx_analytics_tipo ON eventos_analytics(tipo_evento);
CREATE INDEX idx_analytics_fecha ON eventos_analytics(creado_en);
CREATE INDEX idx_analytics_sesion ON eventos_analytics(id_sesion);
CREATE INDEX idx_analytics_pagina ON eventos_analytics(url_pagina);

-- Notificaciones
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leido ON notificaciones(esta_leido);

-- Suscriptores email
CREATE INDEX idx_suscriptores_email ON suscriptores_email(email);
CREATE INDEX idx_suscriptores_estado ON suscriptores_email(estado);

-- Logs API (para troubleshooting)
CREATE INDEX idx_logs_api_fecha ON logs_api(creado_en);
CREATE INDEX idx_logs_api_usuario ON logs_api(usuario_id);
CREATE INDEX idx_logs_api_estado ON logs_api(codigo_estado);

-- ========================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ========================================

CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ language 'plpgsql';

-- Aplicar triggers
CREATE TRIGGER actualizar_usuarios BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER actualizar_servicios BEFORE UPDATE ON servicios FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER actualizar_paginas_servicios BEFORE UPDATE ON paginas_servicios FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER actualizar_contactos BEFORE UPDATE ON contactos FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER actualizar_blog BEFORE UPDATE ON entradas_blog FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER actualizar_campanas_email BEFORE UPDATE ON campanas_email FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER actualizar_suscriptores BEFORE UPDATE ON suscriptores_email FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- ========================================
-- FUNCIÓN PARA CALCULAR SCORING DE LEADS
-- ========================================

CREATE OR REPLACE FUNCTION calcular_puntuacion_lead(contacto_uuid UUID)
RETURNS INTEGER AS $
DECLARE
    puntuacion INTEGER := 0;
    datos_contacto RECORD;
BEGIN
    SELECT * INTO datos_contacto FROM contactos WHERE id = contacto_uuid;
    
    -- Puntuación base por información completa
    IF datos_contacto.empresa IS NOT NULL THEN puntuacion := puntuacion + 10; END IF;
    IF datos_contacto.telefono IS NOT NULL THEN puntuacion := puntuacion + 15; END IF;
    IF datos_contacto.sitio_web IS NOT NULL THEN puntuacion := puntuacion + 5; END IF;
    IF datos_contacto.cargo IS NOT NULL THEN puntuacion := puntuacion + 8; END IF;
    
    -- Puntuación por interés en servicio
    IF datos_contacto.interes_servicio IS NOT NULL THEN puntuacion := puntuacion + 20; END IF;
    
    -- Puntuación por presupuesto
    CASE datos_contacto.rango_presupuesto
        WHEN 'alto' THEN puntuacion := puntuacion + 30;
        WHEN 'medio' THEN puntuacion := puntuacion + 20;
        WHEN 'bajo' THEN puntuacion := puntuacion + 10;
        ELSE puntuacion := puntuacion + 0;
    END CASE;
    
    -- Puntuación por urgencia
    CASE datos_contacto.cronograma
        WHEN 'inmediato' THEN puntuacion := puntuacion + 25;
        WHEN 'mes' THEN puntuacion := puntuacion + 20;
        WHEN 'trimestre' THEN puntuacion := puntuacion + 10;
        ELSE puntuacion := puntuacion + 0;
    END CASE;
    
    -- Puntuación por fuente de lead
    CASE datos_contacto.fuente_lead
        WHEN 'REFERENCIA' THEN puntuacion := puntuacion + 20;
        WHEN 'GOOGLE_ADS' THEN puntuacion := puntuacion + 15;
        WHEN 'SITIO_WEB' THEN puntuacion := puntuacion + 10;
        WHEN 'REDES_SOCIALES' THEN puntuacion := puntuacion + 8;
        ELSE puntuacion := puntuacion + 5;
    END CASE;
    
    RETURN puntuacion;
END;
$ LANGUAGE plpgsql;

-- ========================================
-- DATOS INICIALES PARA HOSTINGER
-- ========================================

-- Usuario administrador
INSERT INTO usuarios (email, nombre, rol, hash_password, esta_activo, email_verificado) VALUES 
('admin@ecosdelseo.com', 'Administrador Principal', 'ADMIN', '$2b$12$ejemplo_hash_seguro_aqui', true, true),
('jampier@ecosdelseo.com', 'Jampier Saife', 'ADMIN', '$2b$12$ejemplo_hash_seguro_aqui', true, true);

-- Servicios principales
INSERT INTO servicios (nombre, slug, descripcion_corta, esta_activo, es_destacado, orden_clasificacion) VALUES 
('Desarrollo Web Empresarial', 'desarrollo-web', 'Plataformas seguras y ultra-eficientes para potenciar conversiones y soportar picos de tráfico', true, true, 1),
('SEO & Contenido Estratégico', 'seo-marketing', 'Estrategias de posicionamiento orgánico y creación de contenidos de valor para captar leads cualificados', true, true, 2),
('Software a Medida', 'software-medida', 'Aplicaciones personalizadas que automatizan procesos críticos y se integran con tu ecosistema empresarial', true, true, 3),
('Paid Media de Alto ROI', 'paid-media', 'Campañas publicitarias hiper-segmentadas y optimizadas día a día para maximizar retorno de inversión', true, true, 4),
('UX/UI & CRO Avanzados', 'ux-ui-cro', 'Diseño centrado en el usuario y pruebas A/B continuas para elevar tasas de conversión', true, true, 5),
('Gestión Integral de Social Media', 'social-media', 'Estrategias de community management y contenidos virales para conectar con audiencias clave', true, true, 6);

-- Configuraciones del sitio
INSERT INTO configuraciones_sitio (clave_configuracion, valor_configuracion, descripcion, tipo_configuracion, es_publico) VALUES 
('titulo_sitio', '"Ecos del SEO - Agencia de Marketing Digital"', 'Título principal del sitio web', 'string', true),
('descripcion_sitio', '"Potenciamos tu presencia online con estrategias personalizadas y resultados medibles"', 'Descripción meta del sitio', 'string', true),
('email_contacto', '"contacto@ecosdelseo.com"', 'Email de contacto principal', 'string', true),
('telefono_contacto', '"+34 600 000 000"', 'Teléfono de contacto', 'string', true),
('direccion_oficina', '"Madrid, España"', 'Dirección de la oficina', 'string', true),
('enlaces_sociales', '{"instagram": "https://instagram.com/ecosdelseo", "linkedin": "https://linkedin.com/company/ecosdelseo", "twitter": "https://twitter.com/ecosdelseo", "youtube": "https://youtube.com/@ecosdelseo"}', 'Enlaces redes sociales', 'json', true),
('google_analytics_id', '"G-XXXXXXXXXX"', 'ID de Google Analytics', 'string', false),
('whatsapp_numero', '"+34600000000"', 'Número de WhatsApp Business', 'string', true);

-- ========================================
-- VISTAS OPTIMIZADAS PARA DASHBOARD
-- ========================================

-- Vista métricas dashboard
CREATE VIEW metricas_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM contactos WHERE creado_en >= CURRENT_DATE - INTERVAL '30 days') as nuevos_leads_mes,
    (SELECT COUNT(*) FROM contactos WHERE estado = 'NUEVO') as leads_pendientes,
    (SELECT COUNT(*) FROM contactos WHERE estado IN ('CALIFICADO', 'CERRADO_GANADO')) as leads_calificados,
    (SELECT COUNT(*) FROM eventos_analytics WHERE tipo_evento = 'VISTA_PAGINA' AND creado_en >= CURRENT_DATE - INTERVAL '30 days') as vistas_pagina_mes,
    (SELECT COUNT(DISTINCT id_sesion) FROM eventos_analytics WHERE creado_en >= CURRENT_DATE - INTERVAL '30 days') as visitantes_unicos_mes,
    (SELECT AVG(calcular_puntuacion_lead(id)) FROM contactos WHERE creado_en >= CURRENT_DATE - INTERVAL '30 days') as puntuacion_promedio_leads;

-- Vista leads con puntuación
CREATE VIEW leads_con_puntuacion AS
SELECT 
    c.*,
    calcular_puntuacion_lead(c.id) as puntuacion_calculada,
    u.nombre as nombre_usuario_asignado,
    (SELECT COUNT(*) FROM interacciones_contactos ic WHERE ic.contacto_id = c.id) as total_interacciones,
    (SELECT MAX(fecha_interaccion) FROM interacciones_contactos ic WHERE ic.contacto_id = c.id) as ultima_interaccion
FROM contactos c
LEFT JOIN usuarios u ON c.asignado_a = u.id;

-- ========================================
-- PROCEDIMIENTOS DE MANTENIMIENTO
-- ========================================

-- Limpieza de datos antiguos
CREATE OR REPLACE FUNCTION limpiar_datos_antiguos()
RETURNS void AS $
BEGIN
    -- Limpiar eventos analytics > 1 año
    DELETE FROM eventos_analytics WHERE creado_en < CURRENT_DATE - INTERVAL '1 year';
    
    -- Limpiar logs API > 3 meses
    DELETE FROM logs_api WHERE creado_en < CURRENT_DATE - INTERVAL '3 months';
    
    -- Limpiar notificaciones leídas > 1 mes
    DELETE FROM notificaciones WHERE esta_leido = true AND leido_en < CURRENT_DATE - INTERVAL '1 month';
    
    -- Actualizar estadísticas de tablas
    ANALYZE;
    
    RAISE NOTICE 'Limpieza completada en %', CURRENT_TIMESTAMP;
END;
$ LANGUAGE plpgsql;

-- ========================================
-- CONFIGURACIÓN DE BACKUP PARA HOSTINGER
-- ========================================

-- Script de backup (ejecutar en cron diario)
-- 0 2 * * * pg_dump -h postgresql.hostinger.com -U ecosdelseo_user -d ecosdelseo_db | gzip > /home/usuario/backups/ecosdelseo_$(date +\%Y\%m\%d).sql.gz

-- ========================================
-- PERMISOS Y SEGURIDAD HOSTINGER
-- ========================================

-- Crear usuario específico para la aplicación
-- CREATE ROLE ecosdelseo_app_user WITH LOGIN PASSWORD 'password_muy_seguro_hostinger_2024';

-- Otorgar permisos mínimos necesarios
-- GRANT CONNECT ON DATABASE ecosdelseo_db TO ecosdelseo_app_user;
-- GRANT USAGE ON SCHEMA public TO ecosdelseo_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ecosdelseo_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ecosdelseo_app_user;

-- ========================================
-- CONFIGURACIÓN ESPECÍFICA HOSTINGER
-- ========================================

-- Configuraciones optimizadas para los límites de Hostinger
-- Conexiones máximas: 100
-- Timeout consultas: 30 segundos
-- Memoria por consulta: limitada

-- Índices adicionales para optimización en Hostinger
CREATE INDEX CONCURRENTLY idx_contactos_estado_fecha ON contactos(estado, creado_en);
CREATE INDEX CONCURRENTLY idx_analytics_tipo_fecha ON eventos_analytics(tipo_evento, creado_en);
CREATE INDEX CONCURRENTLY idx_servicios_activo_orden ON servicios(esta_activo, orden_clasificacion);

---

## 📋 CRONOGRAMA FINAL OPTIMIZADO PARA HOSTINGER

| Etapa | Duración | Backend | Frontend | Tecnologías | Entregables Hostinger |
|-------|----------|---------|----------|-------------|----------------------|
| **Etapa 1** | 1-2 sem | ✅ Base | ❌ | Node.js + PostgreSQL | Servidor y BD configurados |
| **Etapa 2** | 3-4 sem | ❌ | ✅ Completo | HTML + CSS + JS | Sitio web responsive |
| **Etapa 3** | 3-4 sem | ✅ API | ❌ | Node.js + Express | API REST funcionando |
| **Etapa 4** | 2-3 sem | ❌ | ✅ Admin | HTML + CSS + JS | Panel administración |
| **Etapa 5** | 2-3 sem | ❌ | ✅ Servicios | HTML + CSS + JS | 6 páginas servicios |
| **Etapa 6** | 3-4 sem | ✅ Avanzado | ❌ | Node.js + APIs | Funcionalidades avanzadas |
| **Etapa 7** | 2 sem | ✅ ✅ | ✅ ✅ | SEO + Optimización | Performance optimizado |
| **Etapa 8** | 1-2 sem | ✅ Deploy | ✅ Deploy | Hostinger | Producción funcionando |

**⏱️ Tiempo Total: 16-24 semanas**

---

## 🎯 LISTA DE VERIFICACIÓN POR ETAPA

### ✅ **ETAPA 1: BACKEND BASE**
**Checklist de Requerimientos:**
- [ ] Node.js v18+ instalado y configurado
- [ ] PostgreSQL Hostinger configurado y conectado
- [ ] Variables de entorno .env configuradas
- [ ] Estructura de carpetas backend creada
- [ ] Schema PostgreSQL ejecutado exitosamente
- [ ] Conexión a base de datos funcionando
- [ ] Servidor Express básico corriendo en puerto 3000
- [ ] Sistema de logging implementado
- [ ] Documentación configuración Hostinger
- [ ] Git repository inicializado con .gitignore
- [ ] Respuestas API estandarizadas funcionando
- [ ] Tests de conexión BD pasando

### ✅ **ETAPA 2: FRONTEND COMPLETO**
**Checklist de Requerimientos:**
- [ ] Landing page 100% responsive (móvil, tablet, desktop)
- [ ] 5 páginas principales HTML creadas y funcionales
- [ ] Navegación responsive con menú hamburguesa móvil
- [ ] Sistema de componentes HTML reutilizables
- [ ] CSS modular con variables y arquitectura SCSS
- [ ] JavaScript modular ES6+ funcionando
- [ ] Formulario contacto frontend completamente funcional
- [ ] Optimización imágenes WebP implementada
- [ ] SEO básico: meta tags, títulos, descripciones únicos
- [ ] Archivo .htaccess configurado para Hostinger
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Google PageSpeed Insights >85 móvil y >90 desktop
- [ ] Accesibilidad WCAG 2.1 AA básica implementada
- [ ] Tiempo de carga <3 segundos en conexión 3G

### ✅ **ETAPA 3: BACKEND API COMPLETA**
**Checklist de Requerimientos:**
- [ ] API REST completa con documentación Swagger/OpenAPI
- [ ] Autenticación JWT segura implementada y probada
- [ ] CRUD completo contactos/leads con validaciones
- [ ] CRUD completo servicios con gestión contenido
- [ ] Sistema validación datos robusto (Joi/Yup)
- [ ] Manejo errores centralizado con códigos estándar
- [ ] Rate limiting configurado (100 req/min por IP)
- [ ] CORS configurado específicamente para Hostinger
- [ ] Envío emails SMTP Hostinger funcionando
- [ ] Sistema logs estructurado con rotación
- [ ] Base de datos normalizada y optimizada
- [ ] Tests unitarios básicos >70% coverage
- [ ] Documentación API completa y actualizada
- [ ] Configuración producción Hostinger funcionando
- [ ] Middleware seguridad (helmet, sanitización) implementado

### ✅ **ETAPA 4: PANEL ADMINISTRACIÓN**
**Checklist de Requerimientos:**
- [ ] Login seguro administradores con 2FA opcional
- [ ] Dashboard métricas tiempo real funcionando
- [ ] CRUD completo leads con interfaz intuitiva
- [ ] Editor contenido visual (TinyMCE) integrado
- [ ] Sistema permisos y roles funcionando
- [ ] Tablas datos con paginación, filtros y búsqueda
- [ ] Gráficos estadísticas interactivos (Chart.js)
- [ ] Sistema notificaciones tiempo real
- [ ] Exportación datos CSV/PDF funcionando
- [ ] Interfaz admin 100% responsive
- [ ] Logs actividad administrador
- [ ] Protección directorio admin con .htaccess
- [ ] Backup y restauración básica desde admin
- [ ] Gestión usuarios y asignación roles

### ✅ **ETAPA 5: PÁGINAS SERVICIOS DINÁMICAS**
**Checklist de Requerimientos:**
- [ ] 6 páginas servicios completamente funcionales
- [ ] Contenido único y específico por cada servicio
- [ ] SEO optimizado individual (meta tags únicos)
- [ ] URLs amigables (/servicios/nombre-servicio/)
- [ ] Formularios contacto específicos por servicio
- [ ] Breadcrumbs navegación implementados
- [ ] Schema markup específico por servicio
- [ ] Galería imágenes optimizada por servicio
- [ ] Testimonios y casos éxito específicos
- [ ] CTAs personalizados y optimizados
- [ ] Tiempo carga <3 segundos todas las páginas
- [ ] Plantillas reutilizables y escalables
- [ ] Contenido editable desde panel admin
- [ ] Tracking específico por página servicio

### ✅ **ETAPA 6: BACKEND FUNCIONALIDADES AVANZADAS**
**Checklist de Requerimientos:**
- [ ] Sistema analytics propio capturando eventos
- [ ] Integración WhatsApp Business API funcionando
- [ ] Email marketing automatizado configurado
- [ ] Sistema notificaciones tiempo real (WebSockets)
- [ ] Lead scoring automático funcionando
- [ ] Cola procesamiento emails (Redis/memoria)
- [ ] Trabajos programados (cron jobs) ejecutándose
- [ ] Integración Google Analytics funcionando
- [ ] Sistema webhooks configurado y probado
- [ ] Backup automático diario configurado
- [ ] API rate limiting avanzado por usuario
- [ ] Sistema logs estructurado con niveles
- [ ] Cache implementado (Redis o memoria)
- [ ] Monitoreo performance activo
- [ ] Integración APIs externas funcionando

### ✅ **ETAPA 7: SEO Y OPTIMIZACIÓN FINAL**
**Checklist de Requerimientos:**
- [ ] Google PageSpeed Insights >95 móvil y desktop
- [ ] Core Web Vitals optimizados (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] Sitemap XML dinámico generándose automáticamente
- [ ] Schema markup implementado en todas las páginas
- [ ] Meta tags únicos y optimizados por página
- [ ] Open Graph y Twitter Cards funcionando
- [ ] Imágenes WebP con lazy loading implementado
- [ ] CSS y JS minificados y comprimidos
- [ ] URLs canónicas configuradas correctamente
- [ ] Headers cache optimizados (1 año assets)
- [ ] Compresión GZIP/Brotli configurada
- [ ] PWA básica implementada (manifest, service worker)
- [ ] Accesibilidad WCAG 2.1 AA completa auditada
- [ ] Testing cross-browser completado y documentado
- [ ] Performance budget establecido y monitoreado

### ✅ **ETAPA 8: DESPLIEGUE HOSTINGER PRODUCCIÓN**
**Checklist de Requerimientos:**
- [ ] Frontend desplegado en public_html Hostinger
- [ ] Backend Node.js corriendo en Hostinger
- [ ] PostgreSQL conectado y optimizado producción
- [ ] SSL/TLS automático Hostinger configurado
- [ ] Dominio principal ecosdelseo.com funcionando
- [ ] Subdominio api.ecosdelseo.com configurado
- [ ] PM2 configurado para gestión procesos Node.js
- [ ] Backup automático diario configurado y probado
- [ ] Monitoreo uptime 24/7 activo
- [ ] Logs centralizados y rotación configurada
- [ ] Email SMTP Hostinger configurado y probado
- [ ] Cache y compresión optimizados servidor
- [ ] Firewall y seguridad básica configurados
- [ ] Documentación despliegue completa
- [ ] Plan recuperación desastres documentado

---

## 🔧 CONFIGURACIONES ESPECÍFICAS HOSTINGER

### **📧 Configuración Email SMTP Hostinger:**
```javascript
// configuracion/email.js
module.exports = {
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: 'contacto@ecosdelseo.com',
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
};
```

### **🗄️ Configuración PostgreSQL Hostinger:**
```javascript
// configuracion/base-datos.js
module.exports = {
  host: process.env.DB_HOST || 'postgresql.hostinger.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecosdelseo_db',
  username: process.env.DB_USER || 'ecosdelseo_user',
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  ssl: {
    require: true,
    rejectUnauthorized: false
  },
  pool: {
    max: 10, // Límite Hostinger
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
```

### **⚙️ Configuración PM2 para Hostinger:**
```javascript
// pm2.config.js
module.exports = {
  apps: [{
    name: 'ecos-del-seo-api',
    script: './servidor.js',
    instances: 1, // Solo 1 instancia en Hostinger básico
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '500M' // Límite memoria Hostinger
  }]
};
```

### **🔒 Configuración .htaccess Optimizado:**
```apache
# .htaccess para Hostinger
RewriteEngine On

# Forzar HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compresión GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Protección Admin
<Files "admin/*">
    Require ip 192.168.1.0/24
    # Agregar tu IP aquí
</Files>

# Redirecciones amigables
RewriteRule ^servicios/([a-z-]+)/?$ /servicios/$1/index.html [L]
RewriteRule ^blog/([a-z0-9-]+)/?$ /blog/$1/index.html [L]

# Seguridad básica
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>
```

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

### **1. Preparación Entorno Hostinger:**
- [ ] **Cuenta Hostinger configurada** con plan Business o superior
- [ ] **Dominio ecosdelseo.com** configurado y apuntando a Hostinger
- [ ] **Subdominio api.ecosdelseo.com** creado para backend
- [ ] **Base de datos PostgreSQL** creada en panel Hostinger
- [ ] **Email contacto@ecosdelseo.com** configurado

### **2. Configuración Desarrollo Local:**
- [ ] **Node.js v18+** instalado
- [ ] **PostgreSQL local** para desarrollo
- [ ] **Git repository** inicializado
- [ ] **IDE configurado** (VS Code recomendado)
- [ ] **Extensiones necesarias** instaladas

### **3. Estructura Inicial del Proyecto:**
- [ ] **Carpetas backend y frontend** creadas
- [ ] **package.json** configurado con dependencias
- [ ] **.env.ejemplo** creado con variables necesarias
- [ ] **README.md** con instrucciones de instalación
- [ ] **.gitignore** configurado apropiadamente

---

## 📚 DOCUMENTACIÓN Y RECURSOS

### **📖 Manuales Específicos a Crear:**
1. **Manual Instalación Local** - Paso a paso desarrollo
2. **Manual Despliegue Hostinger** - Proceso completo producción
3. **Manual Configuración Base Datos** - Setup PostgreSQL
4. **Manual Administrador** - Uso panel admin
5. **Manual Mantenimiento** - Tareas rutinarias
6. **Manual Troubleshooting** - Solución problemas comunes

### **🔧 Herramientas Recomendadas:**
- **Desarrollo:** VS Code + extensiones específicas
- **Base Datos:** pgAdmin o DBeaver
- **API Testing:** Postman o Insomnia
- **Performance:** Google PageSpeed Insights
- **Monitoreo:** UptimeRobot (gratuito)
- **Analytics:** Google Analytics 4

---

## 💡 CONSIDERACIONES IMPORTANTES HOSTINGER

### **⚠️ Limitaciones Hostinger a Considerar:**
- **Memoria RAM:** 512MB-1GB según plan
- **CPU:** Compartido, optimizar queries
- **Conexiones BD:** Máximo 100 simultáneas
- **Almacenamiento:** SSD limitado según plan
- **Bandwidth:** Limitado según plan

### **✅ Optimizaciones Recomendadas:**
- **Queries BD:** Índices optimizados y queries eficientes
- **Cache:** Implementar cache en memoria para datos frecuentes
- **Imágenes:** WebP y compresión agresiva
- **CSS/JS:** Minificación y concatenación
- **CDN:** Usar CDN gratuito de Hostinger

---

## 🎯 RESULTADO FINAL ESPERADO

Al completar todas las etapas tendrás:

✅ **Sitio web profesional** completamente responsive
✅ **Panel administración** completo y funcional  
✅ **API REST robusta** con todas las funcionalidades
✅ **Base de datos optimizada** con backup automático
✅ **SEO completamente optimizado** (>95 PageSpeed)
✅ **Sistema leads avanzado** con scoring automático
✅ **Email marketing** automatizado
✅ **Analytics personalizado** y reportes
✅ **Integraciones externas** (WhatsApp, Google Analytics)
✅ **Despliegue producción** en Hostinger funcionando

**¿Estás listo para comenzar con la ETAPA 1?**

Puedo ayudarte a:
1. **Configurar la estructura inicial** del proyecto
2. **Crear el schema PostgreSQL** optimizado para Hostinger
3. **Configurar el servidor Express** básico
4. **Establecer la conexión** con la base de datos
5. **Documentar el proceso** paso a paso

¿Por cuál aspecto prefieres empezar?