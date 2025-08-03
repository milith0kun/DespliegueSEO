document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');
    
    loginForm.addEventListener('submit', handleLogin);
    
    async function handleLogin(e) {
        e.preventDefault();
        
        console.log('🔐 Login form submitted');
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log('📧 Email from form:', email);
        console.log('🔑 Password length:', password.length);
        
        // Validaciones básicas
        if (!email || !password) {
            console.error('❌ Missing email or password');
            errorMessage.textContent = 'Por favor, completa todos los campos';
            errorMessage.style.display = 'block';
            return;
        }
        
        if (!email.includes('@')) {
            console.error('❌ Invalid email format');
            errorMessage.textContent = 'Por favor, ingresa un email válido';
            errorMessage.style.display = 'block';
            return;
        }
        
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        errorMessage.style.display = 'none';
        
        try {
            console.log('🚀 Calling apiService.login...');
            const data = await apiService.login(email, password);
            
            console.log('📨 Login response received:', data);
            
            if (data && data.success) {
                console.log('✅ Login successful');
                console.log('👤 User data:', data.data);
                
                if (data.data && (data.data.rol === 'ADMIN' || data.data.rol === 'GERENTE')) {
                    console.log('🎯 User has admin permissions, redirecting...');
                    window.location.href = 'admin.html';
                } else {
                    console.error('❌ User does not have admin permissions');
                    console.log('👤 User role:', data.data ? data.data.rol : 'undefined');
                    throw new Error('Acceso denegado. No tienes permisos de administrador.');
                }
            } else {
                console.error('❌ Login failed');
                console.log('📄 Response data:', data);
                throw new Error(data?.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('💥 Login error caught:', error);
            console.error('📄 Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            let errorText = error.message;
            
            // Manejar diferentes tipos de errores
            if (error.message.includes('Failed to fetch')) {
                errorText = 'Error de conexión. Verifica tu conexión a internet.';
            } else if (error.message.includes('NetworkError')) {
                errorText = 'Error de red. No se pudo conectar al servidor.';
            } else if (error.message.includes('JSON')) {
                errorText = 'Error del servidor. Respuesta inválida.';
            }
            
            errorMessage.textContent = errorText;
            errorMessage.style.display = 'block';
        } finally {
            console.log('🔄 Resetting login button');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
        }
    }
});