document.addEventListener('DOMContentLoaded', () => {

    // Simula a busca do nome do funcionário logado
    const funcionarioNameSpan = document.querySelector('.welcome-section h2 span');
    if (funcionarioNameSpan) {
        funcionarioNameSpan.textContent = 'Maria Silva'; // Pode ser alterado para o nome real vindo do backend
    }

    // Futuramente, você pode adicionar aqui a lógica para o formulário de busca
    const consultaForm = document.querySelector('.consulta-form');
    if (consultaForm) {
        consultaForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o recarregamento da página
            const searchTerm = document.getElementById('searchInput').value;
            console.log(`Buscando por: ${searchTerm}`);
            // Aqui entraria a lógica de busca (ex: uma chamada fetch para a sua API)
            alert(`Iniciando busca por: "${searchTerm}"`);
        });
    }

// Abrir modal de mensagem
    document.querySelectorAll('.message-item').forEach(item => {
    item.addEventListener('click', () => {
    document.getElementById('modalSender').textContent = item.dataset.user;
    document.getElementById('modalType').textContent = item.dataset.type;
    document.getElementById('modalSubject').textContent = item.dataset.subject;
    document.getElementById('modalMessage').textContent = item.dataset.message;
    document.getElementById('modalEmail').href = `mailto:${item.dataset.email}`;
    document.getElementById('modalEmail').textContent = item.dataset.email;
    document.getElementById('messageDetailModal').classList.add('show');
  });
});

// Fechar modal
document.querySelectorAll('.close-button').forEach(btn => {
  const target = btn.dataset.close;
  btn.addEventListener('click', () => {
    document.getElementById(target)?.classList.remove('show');
  });
});

window.addEventListener('click', (e) => {
  const modal = document.getElementById('messageDetailModal');
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// Botão "Alterar Senha"
document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
  alert('Abrir modal de alteração de senha (futuramente implementado).');
});

});