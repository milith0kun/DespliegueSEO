document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDropdownMenu = document.getElementById('mobile-dropdown-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    if (mobileMenuBtn && mobileDropdownMenu && mobileMenuOverlay) {
        // Toggle menú móvil
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Cerrar menú al hacer clic en overlay
        mobileMenuOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });
        
        // Cerrar menú al hacer clic en enlaces
        const mobileLinks = mobileDropdownMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Cerrar menú automáticamente al redimensionar a pantalla grande
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                closeMobileMenu();
            }
        });
        
        // Cerrar menú al presionar Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileDropdownMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
    
    function toggleMobileMenu() {
        const isActive = mobileDropdownMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileDropdownMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileDropdownMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
});