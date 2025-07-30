document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');
    
    loginForm.addEventListener('submit', handleLogin);
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        errorMessage.style.display = 'none';
        
        try {
            const data = await apiService.login(email, password);
            
            if (data.success) {
                if (data.data && (data.data.rol === 'ADMIN' || data.data.rol === 'GERENTE')) {
                    window.location.href = 'admin.html';
                } else {
                    throw new Error('Acceso denegado. No tienes permisos de administrador.');
                }
            } else {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
        }
    }
});