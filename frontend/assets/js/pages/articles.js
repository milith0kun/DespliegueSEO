/**
 * Funcionalidad para la página de artículos
 * Maneja la carga y visualización de artículos del blog
 */

document.addEventListener('DOMContentLoaded', function() {
    inicializarPaginaArticulos();
});

/**
 * Inicializa la página de artículos
 */
function inicializarPaginaArticulos() {
    console.log('Página de artículos inicializada');
    
    // Aquí puedes agregar funcionalidad específica para artículos
    // Por ejemplo: cargar artículos desde una API, filtros, búsqueda, etc.
    
    // Ejemplo de estructura básica:
    setupArticleFilters();
    loadArticles();
}

/**
 * Configura los filtros de artículos
 */
function setupArticleFilters() {
    const filterButtons = document.querySelectorAll('.article-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterArticlesByCategory(category);
        });
    });
}

/**
 * Carga los artículos
 */
function loadArticles() {
    // Implementar carga de artículos
    // Si tienes una API para artículos, puedes usar apiService aquí
    console.log('Cargando artículos...');
}

/**
 * Filtra artículos por categoría
 */
function filterArticlesByCategory(category) {
    console.log(`Filtrando artículos por categoría: ${category}`);
    // Implementar lógica de filtrado
}

// Exportar funciones si es necesario
window.ArticlesPage = {
    loadArticles,
    filterArticlesByCategory
};