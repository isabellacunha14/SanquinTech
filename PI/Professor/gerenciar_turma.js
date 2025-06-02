document.addEventListener('DOMContentLoaded', () => {
    const turmaTitle = document.getElementById('turmaTitle');
    const turmaDiscipline = document.getElementById('turmaDiscipline');
    const tabsNav = document.querySelector('.tabs-nav');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Elementos da aba de Frequência
    const frequenciaForm = document.getElementById('frequenciaForm');
    const frequenciaDateInput = document.getElementById('frequenciaDate');
    const frequenciaStudentsList = document.getElementById('frequenciaStudents');
    const frequenciaHistoryList = document.getElementById('frequenciaHistory');

    // Elementos da aba de Notas
    const notasForm = document.getElementById('notasForm');
    const notaTypeInput = document.getElementById('notaType');
    const notasStudentsList = document.getElementById('notasStudents');
    const notasHistoryList = document.getElementById('notasHistory');

    // Elementos da aba de Registro de Aulas/Ocorrências
    const registroAulasForm = document.getElementById('registroAulasForm');
    const registroDateInput = document.getElementById('registroDate');
    const registroContentInput = document.getElementById('registroContent');
    const registroHistoryList = document.getElementById('registroHistory');

    // Elementos da aba de Planejamento de Aulas
    const planejamentoAulasForm = document.getElementById('planejamentoAulasForm');
    const planejamentoDateInput = document.getElementById('planejamentoDate');
    const planejamentoContentInput = document.getElementById('planejamentoContent');
    const materialUploadInput = document.getElementById('materialUpload');
    const planejamentoHistoryList = document.getElementById('planejamentoHistory');

    let currentTurmaId = null; // Variável para armazenar o ID da turma atual

    // --- Dados Simulados (Substituiria um Banco de Dados) ---
    const mockTurmasData = {
        'ads3a': {
            name: 'Análise e Desenvolvimento de Sistemas - 3ºA',
            discipline: 'Programação Web',
            students: [
                { id: 'S001', name: 'Alice Silva' },
                { id: 'S002', name: 'Bruno Mendes' },
                { id: 'S003', name: 'Carla Dias' },
                { id: 'S004', name: 'Daniel Costa' },
                { id: 'S005', name: 'Eva Lima' },
                { id: 'S006', name: 'Fernando Garcia' },
                { id: 'S007', name: 'Gabriela Alves' },
                { id: 'S008', name: 'Hugo Pereira' },
            ],
            // Dados persistentes (serão carregados/salvos do localStorage)
            frequencias: [],
            notas: [],
            registros: [],
            planejamentos: []
        },
        'gti2b': {
            name: 'Gestão da Tecnologia da Informação - 2ºB',
            discipline: 'Banco de Dados',
            students: [
                { id: 'S009', name: 'Isabela Rocha' },
                { id: 'S010', name: 'João Victor' },
                { id: 'S011', name: 'Karen Souza' },
                { id: 'S012', name: 'Lucas Pires' },
            ],
            frequencias: [],
            notas: [],
            registros: [],
            planejamentos: []
        },
        'ads1c': {
            name: 'Análise e Desenvolvimento de Sistemas - 1ºC',
            discipline: 'Lógica de Programação',
            students: [
                { id: 'S013', name: 'Mariana Oliveira' },
                { id: 'S014', name: 'Pedro Rodrigues' },
                { id: 'S015', name: 'Beatriz Martins' },
                { id: 'S016', name: 'Gustavo Santos' },
                { id: 'S017', name: 'Luisa Ferreira' },
            ],
            frequencias: [],
            notas: [],
            registros: [],
            planejamentos: []
        }
    };

    // --- Funções de Ajuda ---

    // Função para obter o ID da turma da URL
    function getTurmaIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Função para carregar dados da turma (do localStorage ou mock)
    function loadTurmaData(turmaId) {
        let turmaData = mockTurmasData[turmaId];
        if (!turmaData) {
            console.error('Dados da turma não encontrados para o ID:', turmaId);
            return null;
        }

        // Tenta carregar dados persistidos do localStorage
        const storedData = localStorage.getItem(`turma_${turmaId}_data`);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Mescla os dados armazenados com os dados mock, garantindo que os alunos sejam mantidos
            turmaData = { ...turmaData, ...parsedData };
            // Garante que o array de students sempre venha do mock original para manter ordem e alunos base
            turmaData.students = mockTurmasData[turmaId].students;
        } else {
             // Se não há dados no localStorage, inicializa com arrays vazios para as persistências
            turmaData.frequencias = [];
            turmaData.notas = [];
            turmaData.registros = [];
            turmaData.planejamentos = [];
        }
        return turmaData;
    }

    // Função para salvar dados da turma no localStorage
    function saveTurmaData(turmaId, data) {
        localStorage.setItem(`turma_${turmaId}_data`, JSON.stringify(data));
        console.log(`Dados da turma ${turmaId} salvos no localStorage.`);
    }

    // --- Lógica de Inicialização da Página ---
    const turmaId = getTurmaIdFromUrl();
    if (turmaId) {
        currentTurmaId = turmaId;
        const turmaData = loadTurmaData(currentTurmaId);
        if (turmaData) {
            turmaTitle.textContent = turmaData.name;
            turmaDiscipline.textContent = `Disciplina: ${turmaData.discipline}`;

            // Preenche os formulários e históricos iniciais
            renderFrequenciaStudents(turmaData.students);
            renderNotasStudents(turmaData.students);
            renderFrequenciaHistory(turmaData.frequencias);
            renderNotasHistory(turmaData.notas);
            renderRegistroHistory(turmaData.registros);
            renderPlanejamentoHistory(turmaData.planejamentos);

            // Define a data atual como padrão para campos de data
            const today = new Date().toISOString().split('T')[0];
            frequenciaDateInput.value = today;
            registroDateInput.value = today;
            planejamentoDateInput.value = today;

        } else {
            turmaTitle.textContent = 'Erro: Turma não encontrada.';
            turmaDiscipline.textContent = '';
        }
    } else {
        turmaTitle.textContent = 'Erro: Nenhuma turma selecionada.';
        turmaDiscipline.textContent = 'Volte para "Minhas Turmas" e selecione uma.';
    }

    // --- Lógica de Abas ---
    tabsNav.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.tab-button');
        if (clickedButton) {
            // Remove 'active' de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Adiciona 'active' ao botão clicado e ao painel correspondente
            clickedButton.classList.add('active');
            const targetTabId = clickedButton.dataset.tab;
            document.getElementById(targetTabId).classList.add('active');
        }
    });

    // --- Funções de Renderização e Lógica de Formulários ---

    // Frequência
    function renderFrequenciaStudents(students) {
        frequenciaStudentsList.innerHTML = ''; // Limpa antes de renderizar
        students.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.classList.add('student-item');
            studentItem.innerHTML = `
                <span>${student.name}</span>
                <div class="frequencia-status">
                    <label><input type="radio" name="frequencia_${student.id}" value="presente" required> Presente</label>
                    <label><input type="radio" name="frequencia_${student.id}" value="ausente"> Ausente</label>
                </div>
            `;
            frequenciaStudentsList.appendChild(studentItem);
        });
    }

    function renderFrequenciaHistory(frequencias) {
        frequenciaHistoryList.innerHTML = '';
        if (frequencias.length === 0) {
            frequenciaHistoryList.innerHTML = '<li>Nenhuma frequência registrada ainda.</li>';
            return;
        }
        frequencias.slice(-5).reverse().forEach(freq => { // Mostra as 5 mais recentes
            const li = document.createElement('li');
            li.textContent = `Data: ${freq.date} - Presenças: ${freq.presentCount} / Ausências: ${freq.absentCount}`;
            frequenciaHistoryList.appendChild(li);
        });
    }

    frequenciaForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const turmaData = loadTurmaData(currentTurmaId);
        if (!turmaData) return;

        const date = frequenciaDateInput.value;
        let presentCount = 0;
        let absentCount = 0;
        const studentStatuses = {};

        turmaData.students.forEach(student => {
            const statusInput = document.querySelector(`input[name="frequencia_${student.id}"]:checked`);
            if (statusInput) {
                studentStatuses[student.id] = statusInput.value;
                if (statusInput.value === 'presente') {
                    presentCount++;
                } else {
                    absentCount++;
                }
            }
        });

        const newFrequencia = {
            date: date,
            presentCount: presentCount,
            absentCount: absentCount,
            statuses: studentStatuses // Guarda o status individual de cada aluno
        };

        turmaData.frequencias.push(newFrequencia);
        saveTurmaData(currentTurmaId, turmaData);
        renderFrequenciaHistory(turmaData.frequencias);
        alert('Frequência salva com sucesso!');
        frequenciaForm.reset();
        frequenciaDateInput.value = date; // Mantém a data após o reset
    });

    // Notas
    function renderNotasStudents(students) {
        notasStudentsList.innerHTML = '';
        students.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.classList.add('student-item');
            studentItem.innerHTML = `
                <span>${student.name}</span>
                <input type="number" step="0.1" min="0" max="10" class="nota-input" name="nota_${student.id}" placeholder="Nota">
            `;
            notasStudentsList.appendChild(studentItem);
        });
    }

    function renderNotasHistory(notas) {
        notasHistoryList.innerHTML = '';
        if (notas.length === 0) {
            notasHistoryList.innerHTML = '<li>Nenhuma nota lançada ainda.</li>';
            return;
        }
        notas.slice(-5).reverse().forEach(n => { // Mostra as 5 mais recentes
            const li = document.createElement('li');
            li.textContent = `Tipo: ${n.type} - Data: ${n.date || 'N/A'}`; // Mostra o tipo de nota
            notasHistoryList.appendChild(li);
        });
    }

    notasForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const turmaData = loadTurmaData(currentTurmaId);
        if (!turmaData) return;

        const notaType = notaTypeInput.value;
        const studentNotas = {};
        let allNotasValid = true;

        turmaData.students.forEach(student => {
            const notaInput = document.querySelector(`input[name="nota_${student.id}"]`);
            if (notaInput && notaInput.value !== '') {
                const notaValue = parseFloat(notaInput.value);
                if (isNaN(notaValue) || notaValue < 0 || notaValue > 10) {
                    allNotasValid = false;
                    alert(`Por favor, insira uma nota válida (0-10) para ${student.name}.`);
                    return;
                }
                studentNotas[student.id] = notaValue;
            } else if (notaInput && notaInput.value === '') {
                 studentNotas[student.id] = null; // Ou deixar vazio se a nota não foi lançada
            }
        });

        if (!allNotasValid) return;

        const newNotaLancamento = {
            date: new Date().toLocaleDateString('pt-BR'), // Data de lançamento
            type: notaType,
            notas: studentNotas
        };

        turmaData.notas.push(newNotaLancamento);
        saveTurmaData(currentTurmaId, turmaData);
        renderNotasHistory(turmaData.notas);
        alert('Notas salvas com sucesso!');
        notasForm.reset();
    });

    // Registro de Aulas/Ocorrências
    function renderRegistroHistory(registros) {
        registroHistoryList.innerHTML = '';
        if (registros.length === 0) {
            registroHistoryList.innerHTML = '<li>Nenhum registro ainda.</li>';
            return;
        }
        registros.slice(-5).reverse().forEach(reg => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${reg.date}:</strong> ${reg.content.substring(0, 100)}...`;
            registroHistoryList.appendChild(li);
        });
    }

    registroAulasForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const turmaData = loadTurmaData(currentTurmaId);
        if (!turmaData) return;

        const date = registroDateInput.value;
        const content = registroContentInput.value;

        if (content.trim() === '') {
            alert('Por favor, escreva o conteúdo do registro.');
            return;
        }

        const newRegistro = {
            date: date,
            content: content
        };

        turmaData.registros.push(newRegistro);
        saveTurmaData(currentTurmaId, turmaData);
        renderRegistroHistory(turmaData.registros);
        alert('Registro salvo com sucesso!');
        registroAulasForm.reset();
        registroDateInput.value = date; // Mantém a data
    });

    // Planejamento de Aulas
    function renderPlanejamentoHistory(planejamentos) {
        planejamentoHistoryList.innerHTML = '';
        if (planejamentos.length === 0) {
            planejamentoHistoryList.innerHTML = '<li>Nenhum planejamento ainda.</li>';
            return;
        }
        planejamentos.slice(-5).reverse().forEach(plan => {
            const li = document.createElement('li');
            // Simula link para material se houvesse upload real
            const materialLink = plan.materialName ? ` (<a href="#" onclick="alert('Download simulado: ${plan.materialName}')">Material: ${plan.materialName}</a>)` : '';
            li.innerHTML = `<strong>${plan.date}:</strong> ${plan.content.substring(0, 100)}...${materialLink}`;
            planejamentoHistoryList.appendChild(li);
        });
    }

    planejamentoAulasForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const turmaData = loadTurmaData(currentTurmaId);
        if (!turmaData) return;

        const date = planejamentoDateInput.value;
        const content = planejamentoContentInput.value;
        const materialFile = materialUploadInput.files[0];
        const materialName = materialFile ? materialFile.name : null;

        if (content.trim() === '') {
            alert('Por favor, escreva o conteúdo do planejamento.');
            return;
        }

        const newPlanejamento = {
            date: date,
            content: content,
            materialName: materialName // Salva apenas o nome do arquivo para simulação
        };

        turmaData.planejamentos.push(newPlanejamento);
        saveTurmaData(currentTurmaId, turmaData);
        renderPlanejamentoHistory(turmaData.planejamentos);
        alert('Planejamento salvo com sucesso!');
        planejamentoAulasForm.reset();
        planejamentoDateInput.value = date; // Mantém a data
    });
});