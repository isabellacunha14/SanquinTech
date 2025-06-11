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
});