
# Hoja de Trucos del Proyecto: Ecos del SEO

Este documento contiene información esencial para que el asistente de IA (Gemini) pueda trabajar de manera eficiente en este proyecto.

## 1. Stack Tecnológico

- **Backend:** PHP 8+ (Sin frameworks)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
- **Base de Datos:** MySQL
- **Gestor de Dependencias PHP:** Composer
- **Servidor Web (local):** Servidor web integrado de PHP

## 2. Estructura de Archivos Clave

- **Raíz del Frontend:** `frontend/index.html`
- **Raíz del Backend (API):** `api/index.php`
- **Configuración de la Base de Datos:** `api/config/database.php`
- **Controladores de la API:** `api/controllers/`
    - `ContactoController.php`: Gestiona la lógica del formulario de contacto.
    - `UsuarioController.php`: Gestiona la lógica de autenticación de usuarios.
- **Modelos de la API:** `api/models/`
    - `Contacto.php`: Interactúa con la tabla de contactos.
    - `Usuario.php`: Interactúa con la tabla de usuarios.
- **Scripts de la Base de Datos:** `base-de-datos/esquemas/`
- **Dependencias de PHP:** `composer.json`
- **Reglas de Reescritura del Servidor:** `.htaccess`

## 3. Comandos Esenciales

- **Iniciar Servidor de Desarrollo:**
  ```bash
  php -S localhost:8000 -t .
  ```
  *Este comando sirve todo el proyecto desde la raíz. El archivo `index.php` procesa automáticamente las rutas y sirve el contenido del frontend sin redirecciones.*

- **Instalar/Actualizar Dependencias PHP:**
  ```bash
  composer install
  ```

## 4. Endpoints Principales de la API

La API se accede a través de `http://localhost:8000/api/`.

- **Contactos:**
    - `POST /api/contacto/crear`: Crea un nuevo registro de contacto desde el formulario público.
    - `GET /api/contactos`: Obtiene la lista de todos los contactos (requiere autenticación).
    - `PUT /api/contacto/{id}/estado`: Actualiza el estado de un contacto.
    - `DELETE /api/contacto/{id}`: Elimina un contacto.

- **Autenticación:**
    - `POST /api/login`: Inicia sesión de un usuario.
    - `POST /api/logout`: Cierra la sesión.
    - `GET /api/check-auth`: Verifica si hay una sesión activa.
    - `GET /api/me`: Obtiene la información del usuario autenticado.

## 5. Flujo de Trabajo Común

- **Modificar el formulario de contacto:**
    1.  **Frontend (HTML):** Editar `frontend/index.html` (sección `id="contacto"`).
    2.  **Frontend (JS):** La lógica de envío está en `frontend/assets/js/pages/home.js`.
    3.  **Backend (Controlador):** La lógica de recepción está en `api/controllers/ContactoController.php` (método `crear`).
    4.  **Backend (Modelo):** La lógica de guardado en BD está en `api/models/Contacto.php` (método `crear`).
    5.  **Base de Datos:** Si se añaden campos, modificar el esquema en `base-de-datos/esquemas/`.

## 6. Correcciones Recientes Implementadas

### ✅ Errores JavaScript Corregidos:
- **admin.js**: Eliminadas referencias a funciones inexistentes, implementadas funciones faltantes
- **api-config.js**: Mejorado manejo de errores y detección de respuestas HTML vs JSON
- **Páginas admin**: `admin.html` y `login.html` cargan sin errores de consola

### ✅ Configuración de Servidor Optimizada:
- **index.php**: Eliminada redirección, ahora sirve contenido directamente
- **.htaccess**: Reglas específicas para assets, servicios y admin
- **Rutas de assets**: Procesamiento automático de rutas CSS/JS en el HTML
- **Servidor local**: Funcionando estable en `localhost:8000`

### ✅ Estado Actual:
- ✅ Frontend completamente funcional sin errores JavaScript
- ✅ Backend API operativo con manejo de errores mejorado
- ✅ Configuración lista para despliegue en Hostinger
- ✅ Formulario de contacto integrado y funcionando
- ✅ Panel de administración accesible y operativo
