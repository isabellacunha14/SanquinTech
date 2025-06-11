document.addEventListener('DOMContentLoaded', () => {
    const scheduleBody = document.getElementById('studentScheduleBody');
    const lessonDetailModal = document.getElementById('lessonDetailModal');
    const closeButton = document.querySelector('.close-button');

    const filterSubjectSelect = document.getElementById('filterSubject');
    const resetFiltersButton = document.getElementById('resetFilters');

    // Dados da agenda do aluno (exemplo)
    const allStudentScheduleData = [
        {
            day: 'seg',
            time: '08:00',
            subject: 'Matemática',
            teacher: 'Prof. João da Silva',
            room: 'Sala 101',
            topic: 'Cálculo Diferencial',
            notes: 'Trazer calculadora científica.'
        },
        {
            day: 'ter',
            time: '10:00',
            subject: 'Português',
            teacher: 'Profª Ana Lima',
            room: 'Sala 203',
            topic: 'Análise literária',
            notes: 'Ler o conto "A Cartomante".'
        },
        {
            day: 'qua',
            time: '11:00',
            subject: 'Biologia',
            teacher: 'Prof. Marcos Reis',
            room: 'Laboratório',
            topic: 'Genética',
            notes: 'Aula prática.'
        },
        {
            day: 'qui',
            time: '09:00',
            subject: 'Física',
            teacher: 'Prof. Luana Castro',
            room: 'Sala 201',
            topic: 'Leis de Newton',
            notes: 'Resolver exercícios da apostila.'
        },
        {
            day: 'sex',
            time: '16:00',
            subject: 'Filosofia',
            teacher: 'Prof. Caio Souza',
            room: 'Sala 102',
            topic: 'Ética',
            notes: 'Texto base: Kant.'
        }
    ];

    function populateSubjectFilterOptions() {
        const subjects = new Set();
        allStudentScheduleData.forEach(lesson => {
            subjects.add(lesson.subject);
        });

        subjects.forEach(subj => {
            const option = document.createElement('option');
            option.value = subj;
            option.textContent = subj;
            filterSubjectSelect.appendChild(option);
        });
    }

    function populateStudentSchedule(filterSubject = 'all') {
        document.querySelectorAll('#studentScheduleBody td[data-day]').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('filled');
            cell.removeAttribute('data-subject');
            cell.removeAttribute('data-teacher');
            cell.removeAttribute('data-room');
            cell.removeAttribute('data-topic');
            cell.removeAttribute('data-notes');
        });

        const filteredData = allStudentScheduleData.filter(lesson => {
            return filterSubject === 'all' || lesson.subject === filterSubject;
        });

        filteredData.forEach(lesson => {
            const cell = scheduleBody.querySelector(`td[data-day="${lesson.day}"][data-time="${lesson.time}"]`);

            if (cell) {
                cell.textContent = `${lesson.subject}`;
                cell.classList.add('filled');

                cell.setAttribute('data-subject', lesson.subject);
                cell.setAttribute('data-teacher', lesson.teacher);
                cell.setAttribute('data-room', lesson.room || 'Não informado');
                cell.setAttribute('data-topic', lesson.topic || 'Não informado');
                cell.setAttribute('data-notes', lesson.notes || 'Nenhuma.');
                cell.setAttribute('data-day', lesson.day);
                cell.setAttribute('data-time', lesson.time);

                if (!cell.getAttribute('data-has-listener')) {
                    cell.addEventListener('click', () => {
                        if (cell.classList.contains('filled')) {
                            document.getElementById('modalSubject').textContent = cell.getAttribute('data-subject');
                            document.getElementById('modalTeacher').textContent = cell.getAttribute('data-teacher');
                            document.getElementById('modalRoom').textContent = cell.getAttribute('data-room');
                            document.getElementById('modalTopic').textContent = cell.getAttribute('data-topic');
                            document.getElementById('modalNotes').textContent = cell.getAttribute('data-notes');

                            const daysOfWeek = {
                                'seg': 'Segunda-feira', 'ter': 'Terça-feira', 'qua': 'Quarta-feira',
                                'qui': 'Quinta-feira', 'sex': 'Sexta-feira'
                            };

                            document.getElementById('modalDay').textContent = daysOfWeek[cell.getAttribute('data-day')];
                            document.getElementById('modalTime').textContent = cell.getAttribute('data-time');

                            lessonDetailModal.classList.add('show');
                        }
                    });
                    cell.setAttribute('data-has-listener', 'true');
                }
            }
        });
    }

    if (scheduleBody) {
        populateSubjectFilterOptions();
        populateStudentSchedule();

        filterSubjectSelect.addEventListener('change', () => {
            const selectedSubject = filterSubjectSelect.value;
            populateStudentSchedule(selectedSubject);
        });

        resetFiltersButton.addEventListener('click', () => {
            filterSubjectSelect.value = 'all';
            populateStudentSchedule();
        });
    }

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

    // Nome fictício do aluno
    const studentNameSpan = document.querySelector('.welcome-section h2 span');
    if (studentNameSpan) {
        studentNameSpan.textContent = 'Maria Fernandes';
    }
});
