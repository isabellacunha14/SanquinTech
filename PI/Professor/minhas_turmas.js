document.addEventListener('DOMContentLoaded', () => {
    const manageButtons = document.querySelectorAll('.btn-manage-turma');

    manageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const turmaCard = button.closest('.turma-card'); // Encontra o card pai
            const turmaId = turmaCard.dataset.turmaId; // Pega o ID da turma do atributo data-turma-id

            if (turmaId) {
                // Redireciona para a página de gerenciamento, passando o ID da turma via URL
                // Ex: gerenciar_turma.html?id=ads3a
                window.location.href = `gerenciar_turma.html?id=${turmaId}`;
            } else {
                console.error('ID da turma não encontrado para gerenciamento.');
            }
        });
    });
});