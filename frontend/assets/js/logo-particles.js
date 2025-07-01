document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos
    const particlesContainer = document.getElementById('particles-container');
    const logoContainer = document.querySelector('.logo-container');
    const rotatingElements = document.querySelector('.rotating-elements');
    const elements = document.querySelectorAll('.element');
    
    // Configuración de la animación
    const config = {
        orbitRadius: 60, // Radio de la órbita
        orbitSpeed: 0.05, // Velocidad base de rotación
        pulseIntensity: 0.2, // Intensidad del pulso
        interactiveRange: 100, // Rango de interacción con el mouse
        trailDuration: 500, // Duración de la estela en ms
    };
    
    // Estado de los elementos
    let elementsState = [];
    
    // Inicializar estado de los elementos
    elements.forEach((el, index) => {
        const angle = (index / elements.length) * Math.PI * 2;
        const speed = config.orbitSpeed * (0.8 + Math.random() * 0.4); // Velocidad ligeramente aleatoria
        const direction = index % 2 === 0 ? 1 : -1; // Alternar dirección
        
        elementsState.push({
            element: el,
            angle: angle,
            speed: speed * direction,
            pulsePhase: Math.random() * Math.PI * 2, // Fase aleatoria para el pulso
            trail: el.querySelector('.trail'),
            icon: el.querySelector('.icon'),
            trailActive: false,
            trailTimeout: null
        });
    });
    
    // Función para actualizar la posición de los elementos
    function updateElements() {
        const centerX = rotatingElements.offsetWidth / 2;
        const centerY = rotatingElements.offsetHeight / 2;
        
        elementsState.forEach(state => {
            // Actualizar ángulo
            state.angle += state.speed;
            
            // Calcular posición
            const x = centerX + Math.cos(state.angle) * config.orbitRadius;
            const y = centerY + Math.sin(state.angle) * config.orbitRadius;
            
            // Aplicar posición
            state.element.style.transform = `translate(${x}px, ${y}px)`;
            
            // Efecto de pulso
            const pulseScale = 1 + Math.sin(state.pulsePhase) * config.pulseIntensity;
            state.pulsePhase += 0.01;
            state.icon.style.transform = `scale(${pulseScale})`;
            
            // Orientar la estela en dirección opuesta al centro
            const angle = Math.atan2(y - centerY, x - centerX);
            state.trail.style.transform = `translateY(-50%) translateX(-50%) rotate(${angle}rad)`;
        });
        
        requestAnimationFrame(updateElements);
    }
    
    // Iniciar animación
    updateElements();
    
    // Interacción con el mouse
    particlesContainer.addEventListener('mousemove', function(e) {
        const rect = particlesContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        elementsState.forEach(state => {
            const elRect = state.element.getBoundingClientRect();
            const elCenterX = elRect.left + elRect.width / 2 - rect.left;
            const elCenterY = elRect.top + elRect.height / 2 - rect.top;
            
            // Calcular distancia al mouse
            const dx = mouseX - elCenterX;
            const dy = mouseY - elCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Si está cerca del mouse, activar la estela
            if (distance < config.interactiveRange) {
                if (!state.trailActive) {
                    state.trail.classList.add('fast');
                    state.trailActive = true;
                    
                    // Limpiar timeout anterior si existe
                    if (state.trailTimeout) {
                        clearTimeout(state.trailTimeout);
                    }
                    
                    // Configurar timeout para desactivar la estela
                    state.trailTimeout = setTimeout(() => {
                        state.trail.classList.remove('fast');
                        state.trailActive = false;
                    }, config.trailDuration);
                }
            }
        });
    });
    
    // Efecto al hacer hover en el logo
    logoContainer.addEventListener('mouseenter', function() {
        // Aumentar el radio de órbita temporalmente
        const originalRadius = config.orbitRadius;
        config.orbitRadius = originalRadius * 1.2;
        
        setTimeout(() => {
            // Restaurar gradualmente
            config.orbitRadius = originalRadius;
        }, 500);
    });
});
