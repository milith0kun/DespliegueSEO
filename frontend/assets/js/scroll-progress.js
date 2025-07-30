/**
 * Control del indicador de progreso de scroll
 */
document.addEventListener('DOMContentLoaded', function() {
    // Crear el elemento scroll-progress si no existe
    let scrollProgress = document.querySelector('.scroll-progress');
    
    if (!scrollProgress) {
        scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        document.body.appendChild(scrollProgress);
    }
    
    // Función para actualizar el progreso del scroll
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        // Actualizar el ancho del indicador
        scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
        
        // Mostrar/ocultar basado en la posición
        if (scrollTop > 100) {
            scrollProgress.style.opacity = '1';
        } else {
            scrollProgress.style.opacity = '0';
        }
    }
    
    // Escuchar eventos de scroll
    let ticking = false;
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestScrollUpdate();
        ticking = false;
    });
    
    // Actualizar en resize
    window.addEventListener('resize', updateScrollProgress);
    
    // Inicializar
    updateScrollProgress();
});