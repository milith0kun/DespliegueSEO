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
        /* ELIMINADO: interactiveRange, trailDuration */
    };
    
    // Estado de los elementos
    let elementsState = [];
    
    // Inicializar estado de los elementos
    elements.forEach((el, index) => {
        const angle = (index / elements.length) * Math.PI * 2;
        const speed = config.orbitSpeed * (0.8 + Math.random() * 0.4);
        const direction = index % 2 === 0 ? 1 : -1;
        
        elementsState.push({
            element: el,
            angle: angle,
            speed: speed * direction,
            pulsePhase: Math.random() * Math.PI * 2,
            icon: el.querySelector('.icon')
            /* ELIMINADO: trail, trailActive, trailTimeout */
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
            
            /* ELIMINADO: Orientación de la estela */
        });
        
        requestAnimationFrame(updateElements);
    }
    
    // Iniciar animación
    updateElements();
    
    /* ELIMINADO COMPLETAMENTE: 
    - Interacción con el mouse (mousemove event)
    - Activación de estelas (.fast class)
    - Timeouts para desactivar estelas
    - Efecto hover en el logo que cambia el radio de órbita
    */
});
