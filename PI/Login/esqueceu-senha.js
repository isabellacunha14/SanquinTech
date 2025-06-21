// esqueceu-senha.js

document.addEventListener('DOMContentLoaded', () => {
    const senhaForm = document.getElementById('senhaForm');
    const emailInput = document.getElementById('email');
    const errorMessage = document.getElementById('errorMessage');

    // Mapeamento de usuários e suas páginas de destino
    const users = {
        'aluno@sanquim.com': { redirect: 'nova-senha.html', role: 'aluno' },
        'professor@sanquim.com': { redirect: 'nova-senha.html', role: 'professor' }, 
        'admin@sanquim.com': { redirect: 'nova-senha.html', role: 'admin' } 
    };

    // --- Lógica de Confirmação de E-mail para alterar senha ---
    if (senhaForm) { // Garante que esta lógica só execute na página esqueceu-senha.html
        senhaForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const email = emailInput.value;

            if (users[email]) {
                // Login bem-sucedido
                // Salva o e-mail do usuário logado e sua role no localStorage para manter o estado
                localStorage.setItem('loggedInUserEmail', email);
                localStorage.setItem('loggedInUserRole', users[email].role);
                alert('Um link de verificação foi enviado no E-mail informado!');
                alert('!!!DEMONSTRATIVO!!!');
                window.location.href = users[email].redirect; // Redireciona para a página de nova senha
            } else {
                document.getElementById('email').value = '';
                errorMessage.textContent = 'E-mail inválido.';
                errorMessage.style.display = 'block';
            }
        });
    }
});