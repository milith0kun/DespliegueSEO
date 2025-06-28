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