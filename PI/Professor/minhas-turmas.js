// js/minhas-turmas.js

document.addEventListener('DOMContentLoaded', () => {
    const classesGrid = document.getElementById('classesGrid');

    // Dados de exemplo das turmas do professor
    // Em um ambiente real, esses dados viriam de uma API ou banco de dados.
    const professorClassesData = [
        {
            id: 'turma-101-3a', // ID único para a turma (útil para links)
            name: 'Turma 101 - 3º Ano A',
            subject: 'Matemática',
            students: 25,
            // Você pode adicionar mais dados aqui, como 'coordinator', 'scheduleDetails', etc.
            managementLink: 'gerenciar-turma.html?turmaId=turma-101-3a' // Link para a página de gerenciamento
        },
        {
            id: 'turma-202-2a',
            name: 'Turma 202 - 2º Ano B',
            subject: 'Física',
            students: 22,
            managementLink: 'gerenciar-turma.html?turmaId=turma-202-2a'
        },
        {
            id: 'turma-301-1a',
            name: 'Turma 301 - 1º Ano C',
            subject: 'Química',
            students: 28,
            managementLink: 'gerenciar-turma.html?turmaId=turma-301-1a'
        },
        {
            id: 'turma-402-4a',
            name: 'Turma 402 - 4º Ano D',
            subject: 'Biologia',
            students: 20,
            managementLink: 'gerenciar-turma.html?turmaId=turma-402-4a'
        },
        {
            id: 'turma-102-3a',
            name: 'Turma 102 - 3º Ano B',
            subject: 'História',
            students: 27,
            managementLink: 'gerenciar-turma.html?turmaId=turma-102-3a'
        },
        {
            id: 'turma-201-2a',
            name: 'Turma 201 - 2º Ano A',
            subject: 'Português',
            students: 23,
            managementLink: 'gerenciar-turma.html?turmaId=turma-201-2a'
        },
        // Adicione mais turmas conforme necessário
    ];

    /**
     * Renderiza os cards das turmas no DOM.
     */
    function renderClasses() {
        if (!classesGrid) {
            console.error('Elemento #classesGrid não encontrado!');
            return;
        }

        // Limpa qualquer conteúdo existente (como "Carregando turmas...")
        classesGrid.innerHTML = '';

        professorClassesData.forEach(turma => {
            const classCard = document.createElement('div');
            classCard.classList.add('class-card');
            classCard.dataset.id = turma.id; // Adiciona um data-id para referência

            classCard.innerHTML = `
                <h3>${turma.name}</h3>
                <p>Disciplina: <strong>${turma.subject}</strong></p>
                <p>Alunos: <strong>${turma.students}</strong></p>
                <a href="${turma.managementLink}" class="details-button">Gerenciar Turma</a>
            `;

            // Adiciona o event listener para redirecionar ao clicar no card inteiro
            classCard.addEventListener('click', (event) => {
                // Evita que o clique no botão "Gerenciar Turma" dispare duas vezes o redirecionamento
                if (!event.target.classList.contains('details-button')) {
                    window.location.href = turma.managementLink;
                }
            });

            classesGrid.appendChild(classCard);
        });
    }

    // Chama a função para renderizar as turmas quando a página carregar
    renderClasses();

    // Lógica para destacar o item de navegação ativo
    const navItems = document.querySelectorAll('.nav-item');
    const currentPage = 'minhas-turmas'; // Define a página atual

    navItems.forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});