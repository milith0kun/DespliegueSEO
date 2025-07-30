
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
  php -S localhost:8080 -t .
  ```
  *Este comando sirve todo el proyecto desde la raíz, y las reglas de `.htaccess` se encargan de redirigir las peticiones correctamente.*

- **Instalar/Actualizar Dependencias PHP:**
  ```bash
  composer install
  ```

## 4. Endpoints Principales de la API

La API se accede a través de `http://localhost:8080/api/`.

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
