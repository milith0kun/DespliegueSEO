// Archivo principal de JavaScript para el sitio

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ecos del SEO - Sitio cargado correctamente');
    
    // Inicializar componentes principales
    initializeScrollEffects();
    initializeLazyLoading();
    initializeAnimations();
});

// Efectos de scroll suaves
function initializeScrollEffects() {
    // Smooth scrolling para enlaces internos
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lazy loading para imágenes
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Animaciones de entrada para secciones
function initializeAnimations() {
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const animatedElements = document.querySelectorAll('.section-animate');
        animatedElements.forEach(el => animationObserver.observe(el));
    }
}

// Utilidades globales
window.EcosDelSEO = {
    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    showNotification: function(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
};