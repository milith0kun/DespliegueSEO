export class FooterAnimation {
    constructor() {
        this.footer = document.querySelector('.main-footer');
        this.initObserver();
    }

    initObserver() {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.footer.classList.add('footer-visible');
                    this.footer.classList.remove('footer-hidden');
                } else {
                    this.footer.classList.add('footer-hidden');
                    this.footer.classList.remove('footer-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        this.footer.classList.add('footer-hidden');
        footerObserver.observe(this.footer);
    }
}