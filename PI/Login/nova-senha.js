// nova-senha.js

document.addEventListener('DOMContentLoaded', () => {
    const novasenhaForm = document.getElementById('novasenhaForm');
    const newpasswordInput = document.getElementById('newpassword');
    const confirmpasswordInput = document.getElementById('confirmpassword');
    const errorMessage = document.getElementById('errorMessage');

    // --- Lógica de Confirmação de E-mail para alterar senha ---
    if (novasenhaForm) { // Garante que esta lógica só execute na página esqueceu-senha.html
        novasenhaForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const newpassword = newpasswordInput.value;
            const confirmpassword = confirmpasswordInput.value;

            if (newpassword === confirmpassword) {
                alert('Nova senha cadastrada!');
                window.location.href = 'login.html'; // Redireciona para a página de nova senha
            } else {
                document.getElementById('newpassword').value = '';
                document.getElementById('confirmpassword').value = '';
                errorMessage.innerHTML = 'Senhas não batem!';
                errorMessage.style.display = 'block';
            }
        });
    }
});