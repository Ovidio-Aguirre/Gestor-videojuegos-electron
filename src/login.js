// src/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Lógica de autenticación
        if (username === 'admin' && password === 'admin') {
            errorMessage.classList.add('hidden');
            // Enviamos un mensaje al proceso principal para decirle que el login fue exitoso
            window.api.loginSuccess();
        } else {
            errorMessage.textContent = 'Usuario o contraseña incorrectos.';
            errorMessage.classList.remove('hidden');
        }
    });
});