// Mejorar animaciones y transiciones para desarrollo-web.html
document.addEventListener('DOMContentLoaded', function() {
    // Activar animaciones cuando la página esté cargada
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // Intersection Observer para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Agregar clase de animación específica
                if (entry.target.classList.contains('service-benefits')) {
                    entry.target.style.animationDelay = '0.2s';
                }
                if (entry.target.classList.contains('service-cta')) {
                    entry.target.style.animationDelay = '0.1s';
                }
            }
        });
    }, observerOptions);
    
    // Observar todas las secciones
    document.querySelectorAll('section, .main-footer').forEach(section => {
        section.classList.add('section-animate');
        observer.observe(section);
    });
    
    // Smooth scroll mejorado para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Agregar animación de salida a la sección actual
                const currentSection = document.querySelector('.service-hero');
                if (currentSection) {
                    currentSection.classList.add('exit-animation');
                }
                
                // Scroll suave al target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Remover animación de salida después del scroll
                setTimeout(() => {
                    if (currentSection) {
                        currentSection.classList.remove('exit-animation');
                    }
                }, 800);
            }
        });
    });
    
    // Animación de entrada escalonada para elementos del hero
    const heroElements = document.querySelectorAll('.service-hero h1, .service-hero p, .service-hero .btn-primary');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${0.8 + (index * 0.2)}s`;
    });
});

// Preloader y optimización de carga
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Activar animaciones después de que todo esté cargado
    setTimeout(() => {
        const heroSection = document.querySelector('.service-hero');
        if (heroSection) {
            heroSection.style.opacity = '1';
        }
    }, 100);
});

// Optimización de scroll para mejor rendimiento
let ticking = false;

function updateAnimations() {
    // Aquí puedes agregar animaciones basadas en scroll
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
});

// Funciones adicionales para mejorar la experiencia
function initServiceAnimations() {
    // Animaciones específicas para la página de desarrollo web
    const serviceCards = document.querySelectorAll('.service-card, .benefit-item');
    
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// Inicializar animaciones específicas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initServiceAnimations);