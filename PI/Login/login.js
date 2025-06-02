document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm'); // Agora o form tem ID
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Mapeamento de usuários e suas páginas de destino
    const users = {
        'aluno@sanquim.com': { password: 'aluno123', redirect: '../Aluno/portalaluno.html' },
        'professor@sanquim.com': { password: 'prof123', redirect: '../Professor/portal_professor.html' },
        'admin@sanquim.com': { password: 'admin123', redirect: 'portaladmin.html' }      // A fazer
    };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const enteredEmail = emailInput.value.trim();
        const enteredPassword = passwordInput.value.trim();

        errorMessage.textContent = '';
        errorMessage.classList.remove('visible');

        const user = users[enteredEmail]; // Tenta encontrar o usuário pelo e-mail

        if (user && enteredPassword === user.password) {
            // Login bem-sucedido
            alert(`Login bem-sucedido! Redirecionando para ${user.redirect}`); // Mensagem de confirmação
            window.location.href = user.redirect; // Redireciona para a página específica
        } else {
            // Login falhou
            errorMessage.textContent = 'E-mail ou senha inválidos.';
            errorMessage.classList.add('visible');
        }
    });
});