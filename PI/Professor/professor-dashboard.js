// professor-dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const scheduleBody = document.getElementById('scheduleBody');
    const lessonDetailModal = document.getElementById('lessonDetailModal');
    const closeButton = document.querySelector('.close-button');

    // Elementos do filtro
    const filterClassSelect = document.getElementById('filterClass');
    const filterSubjectSelect = document.getElementById('filterSubject');
    const resetFiltersButton = document.getElementById('resetFilters');


    // Dados COMPLETO do horário do professor
    const allProfessorScheduleData = [
        {
            day: 'qua',
            time: '08:00',
            subject: 'Matemática',
            class: 'Turma A',
            room: 'Sala 101',
            topic: 'Revisão de Álgebra Linear',
            notes: 'Levar calculadora científica.'
        },
        {
            day: 'seg',
            time: '08:00',
            subject: 'Matemática',
            class: 'Turma A',
            room: 'Sala 101',
            topic: 'Cálculo Diferencial',
            notes: 'Preparar exercício 5 do capítulo 3.'
        },
        {
            day: 'ter',
            time: '10:00',
            subject: 'Português',
            class: 'Turma C',
            room: 'Sala 203',
            topic: 'Análise de Machado de Assis',
            notes: 'Leitura obrigatória do conto "O Cortiço".'
        },
        {
            day: 'qua',
            time: '11:00',
            subject: 'Biologia',
            class: 'Turma D',
            room: 'Laboratório de Ciências',
            topic: 'Genética Mendeliana',
            notes: 'Aula prática no laboratório. Usar jaleco.'
        },
        {
            day: 'qui',
            time: '09:00',
            subject: 'Física',
            class: 'Turma B',
            room: 'Sala 201',
            topic: 'Leis de Newton',
            notes: 'Resolver problemas do livro texto.'
        },
        {
            day: 'seg',
            time: '13:00',
            subject: 'Química',
            class: 'Turma B',
            room: 'Laboratório de Química',
            topic: 'Balanceamento de Equações Químicas',
            notes: 'Trazer tabela periódica.'
        },
        {
            day: 'ter',
            time: '14:00',
            subject: 'História',
            class: 'Turma E',
            room: 'Sala 102',
            topic: 'Revolução Francesa',
            notes: 'Debate sobre o impacto da Revolução.'
        },
        {
            day: 'qui',
            time: '15:00',
            subject: 'Geografia',
            class: 'Turma F',
            room: 'Sala 204',
            topic: 'Climas do Brasil',
            notes: 'Apresentação de seminários.'
        },
        {
            day: 'sex',
            time: '16:00',
            subject: 'Filosofia',
            class: 'Turma A',
            room: 'Sala 101',
            topic: 'Ética e Moral',
            notes: 'Leitura do texto de Kant.'
        }
    ];

    // Função para popular os dropdowns de filtro
    function populateFilterOptions() {
        const classes = new Set();
        const subjects = new Set();

        allProfessorScheduleData.forEach(lesson => {
            classes.add(lesson.class);
            subjects.add(lesson.subject);
        });

        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = cls;
            filterClassSelect.appendChild(option);
        });

        subjects.forEach(subj => {
            const option = document.createElement('option');
            option.value = subj;
            option.textContent = subj;
            filterSubjectSelect.appendChild(option);
        });
    }

    // Função para popular o horário do professor, AGORA ACEITA FILTROS
    function populateProfessorSchedule(filterClass = 'all', filterSubject = 'all') {
        // Limpa APENAS as células de dia/horário da tabela (aquelas com data-day)
        document.querySelectorAll('#scheduleBody td[data-day]').forEach(cell => { // <-- CORREÇÃO AQUI
            cell.textContent = '';
            cell.classList.remove('filled');
            cell.removeAttribute('data-subject');
            cell.removeAttribute('data-class');
            cell.removeAttribute('data-room');
            cell.removeAttribute('data-topic');
            cell.removeAttribute('data-notes');

            // Nao precisamos remover e recriar o listener aqui, basta garantir que ele seja
            // adicionado uma vez e que a logica de ativacao cheque se a celula esta 'filled'
        });


        // Filtra os dados com base nas seleções
        const filteredScheduleData = allProfessorScheduleData.filter(lesson => {
            const classMatches = (filterClass === 'all' || lesson.class === filterClass);
            const subjectMatches = (filterSubject === 'all' || lesson.subject === filterSubject);
            return classMatches && subjectMatches;
        });

        // Preenche a tabela com os dados filtrados
        filteredScheduleData.forEach(lesson => {
            const cell = scheduleBody.querySelector(`td[data-day="${lesson.day}"][data-time="${lesson.time}"]`);

            if (cell) {
                cell.textContent = `${lesson.subject} (${lesson.class})`;
                cell.classList.add('filled');

                // Adiciona os atributos de dados para o modal
                cell.setAttribute('data-subject', lesson.subject);
                cell.setAttribute('data-class', lesson.class);
                cell.setAttribute('data-room', lesson.room || 'Não informado');
                cell.setAttribute('data-topic', lesson.topic || 'Não informado');
                cell.setAttribute('data-notes', lesson.notes || 'Nenhuma.');

                // Adiciona o event listener APENAS UMA VEZ por célula
                if (!cell.getAttribute('data-has-listener')) {
                    cell.addEventListener('click', () => {
                        // Verifica se a célula clicada está 'filled' (tem uma aula)
                        if (cell.classList.contains('filled')) {
                            document.getElementById('modalSubject').textContent = cell.getAttribute('data-subject');
                            document.getElementById('modalClass').textContent = cell.getAttribute('data-class');
                            document.getElementById('modalTime').textContent = cell.getAttribute('data-time');
                            const daysOfWeek = {
                                'seg': 'Segunda-feira', 'ter': 'Terça-feira', 'qua': 'Quarta-feira',
                                'qui': 'Quinta-feira', 'sex': 'Sexta-feira'
                            };
                            document.getElementById('modalDay').textContent = daysOfWeek[cell.getAttribute('data-day')];
                            document.getElementById('modalRoom').textContent = cell.getAttribute('data-room');
                            document.getElementById('modalTopic').textContent = cell.getAttribute('data-topic');
                            document.getElementById('modalNotes').textContent = cell.getAttribute('data-notes');

                            lessonDetailModal.classList.add('show'); // Exibe o modal
                        }
                    });
                    cell.setAttribute('data-has-listener', 'true'); // Marca que o listener foi adicionado
                }
            }
        });
    } // Fechamento da função populateProfessorSchedule (faltava um '}')


    // Chamada inicial
    if (scheduleBody) { // Garante que a lógica do calendário só rode se o elemento existe
        populateFilterOptions(); // Popula os dropdowns ao carregar
        populateProfessorSchedule(); // Preenche a agenda inicialmente sem filtros

        // Event Listeners para os filtros
        filterClassSelect.addEventListener('change', () => {
            const selectedClass = filterClassSelect.value;
            const selectedSubject = filterSubjectSelect.value; // Pega o outro filtro também
            populateProfessorSchedule(selectedClass, selectedSubject);
        });

        filterSubjectSelect.addEventListener('change', () => {
            const selectedClass = filterClassSelect.value; // Pega o outro filtro também
            const selectedSubject = filterSubjectSelect.value;
            populateProfessorSchedule(selectedClass, selectedSubject);
        });

        resetFiltersButton.addEventListener('click', () => {
            filterClassSelect.value = 'all'; // Reseta os selects para 'all'
            filterSubjectSelect.value = 'all';
            populateProfessorSchedule(); // Repopula sem filtros
        });
    }


    // Lógica para fechar o modal
    if (lessonDetailModal && closeButton) {
        closeButton.addEventListener('click', () => {
            lessonDetailModal.classList.remove('show');
        });

        window.addEventListener('click', (event) => {
            if (event.target == lessonDetailModal) {
                lessonDetailModal.classList.remove('show');
            }
        });
    }

    // Seu código original do dashboard.js para o aluno NÃO DEVE SER COLOCADO AQUI.
    // O dashboard.js do aluno é para a página do aluno. Este é o JS do professor.
    // O import <script src="../Aluno/dashboard.js"></script> no HTML já é suficiente.
    const professorNameSpan = document.querySelector('.welcome-section h2 span');
    if (professorNameSpan) {
        professorNameSpan.textContent = 'João da Silva'; // Nome fictício do professor
    }
});