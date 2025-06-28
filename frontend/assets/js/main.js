/**
 * Main.js - Punto de entrada principal para JavaScript del sitio
 * Centraliza la inicialización de todos los componentes
 */

import { initializeAnimations } from './components/animations.js';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las animaciones del sitio
    const animations = initializeAnimations();
    
    // Inicializar menú móvil
    initializeMobileMenu();
});

/**
 * Inicializa el menú móvil y su comportamiento
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Cerrar menú al hacer clic en enlaces
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}