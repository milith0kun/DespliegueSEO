/**
 * Language Selector Functionality
 * Maneja el cambio de idioma entre ES/EN
 */

class LanguageSelector {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'es';
        this.init();
    }

    init() {
        // Inicializar botones de idioma
        this.setupLanguageButtons();
        // Aplicar idioma guardado
        this.applyLanguage(this.currentLanguage);
    }

    setupLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = button.textContent.toLowerCase();
                this.changeLanguage(selectedLang);
            });
        });
    }

    changeLanguage(language) {
        if (this.currentLanguage === language) return;
        
        this.currentLanguage = language;
        this.updateActiveButton(language);
        this.saveLanguage(language);
        
        // Aquí se puede agregar lógica adicional para cambiar contenido
        this.applyLanguage(language);
        
        // Disparar evento personalizado para otros componentes
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));
    }

    updateActiveButton(language) {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            const buttonLang = button.textContent.toLowerCase();
            
            if (buttonLang === language) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }

    applyLanguage(language) {
        // Actualizar atributo lang del documento
        document.documentElement.lang = language;
        
        // Actualizar botones activos
        this.updateActiveButton(language);
        
        // Aquí se puede agregar lógica para cambiar textos dinámicamente
        // Por ejemplo, cambiar títulos, descripciones, etc.
    }

    saveLanguage(language) {
        try {
            localStorage.setItem('preferredLanguage', language);
        } catch (error) {
            console.warn('No se pudo guardar la preferencia de idioma:', error);
        }
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem('preferredLanguage');
        } catch (error) {
            console.warn('No se pudo obtener la preferencia de idioma:', error);
            return null;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.languageSelector = new LanguageSelector();
});

// Exportar para uso en otros módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSelector;
}