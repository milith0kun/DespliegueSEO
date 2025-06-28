/**
 * Animations.js - Módulo unificado para todas las animaciones del sitio
 * Este archivo centraliza todas las animaciones para mejor mantenimiento
 */

import { ParticleSystem, Queue, Vector, Particle } from './particles.js';

/**
 * Clase para manejar las animaciones del encabezado
 */
export class HeaderAnimation {
    constructor() {
        this.lastScroll = 0;
        this.header = document.getElementById('main-header');
        this.initScrollListener();
    }

    initScrollListener() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Añadir clase scrolled cuando hay scroll
            if (currentScroll > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            // Ocultar/mostrar top-bar basado en la dirección del scroll
            if (currentScroll > this.lastScroll && currentScroll > 150) {
                // Scrolling hacia abajo
                this.header.classList.add('hide-top-bar');
            } else {
                // Scrolling hacia arriba
                this.header.classList.remove('hide-top-bar');
            }
            
            this.lastScroll = currentScroll;
        });
    }
}

/**
 * Clase para manejar las animaciones del footer
 */
export class FooterAnimation {
    constructor() {
        this.footer = document.querySelector('.main-footer');
        this.initAnimation();
    }

    initAnimation() {
        if (!this.footer) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.footer.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(this.footer);
    }
}

/**
 * Clase para manejar la barra de progreso de scroll
 */
export class ScrollAnimation {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        document.body.appendChild(this.progressBar);
        this.initScroll();
    }

    initScroll() {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            this.progressBar.style.width = `${scrolled}%`;
        });
    }
}

/**
 * Inicializa todas las animaciones del sitio
 */
export function initializeAnimations() {
    const particleSystem = new ParticleSystem();
    const headerAnimation = new HeaderAnimation();
    const footerAnimation = new FooterAnimation();
    const scrollAnimation = new ScrollAnimation();
    
    // Inicializar animaciones de estadísticas
    initializeStatCounters();
    
    return {
        particleSystem,
        headerAnimation,
        footerAnimation,
        scrollAnimation
    };
}

/**
 * Inicializa los contadores de estadísticas
 */
function initializeStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                const updateCount = () => {
                    const increment = target / 100;
                    if (count < target) {
                        count += increment;
                        entry.target.textContent = Math.ceil(count);
                        setTimeout(updateCount, 20);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}
