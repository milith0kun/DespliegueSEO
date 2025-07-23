/**
 * Script para la página de login
 * Gestiona la autenticación de usuarios
 */

import { checkAuthentication, checkIsAdmin, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    checkAuthentication().then(isAuth => {
        if (isAuth) {
            // Verificar si es administrador
            checkIsAdmin().then(isUserAdmin => {
                if (isUserAdmin) {
                    window.location.href = 'dashboard.html';
                } else {
                    // Si no es admin, hacer logout
                    logout();
                }
            });
        }
    });
    
    // Configurar el formulario de login
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginSpinner = document.getElementById('loginSpinner');
    const btnLogin = document.getElementById('btnLogin');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar spinner y deshabilitar botón
        loginSpinner.classList.remove('d-none');
        btnLogin.disabled = true;
        loginError.style.display = 'none';
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Importante para cookies
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
            
            if (data.success) {
                // Verificar si es administrador
                if (data.data && data.data.rol === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    throw new Error('Acceso denegado. No tienes permisos de administrador.');
                }
            } else {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            loginError.textContent = error.message;
            loginError.style.display = 'block';
        } finally {
            // Ocultar spinner y habilitar botón
            loginSpinner.classList.add('d-none');
            btnLogin.disabled = false;
        }
    });
});
