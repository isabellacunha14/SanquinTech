// js/gerenciar-turma.js

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const turmaTitulo = document.getElementById('turmaTitulo');
    const frequenciaTabContent = document.getElementById('frequencia');
    const notasTabContent = document.getElementById('notas');
    const aulasTabContent = document.getElementById('aulas');
    const planejamentoTabContent = document.getElementById('planejamento'); // Ref. à aba de Planejamento
    const notasTableBody = document.getElementById('notasTableBody');
    const aulaHistoryContainer = document.getElementById('aulaHistoryContainer');
    const materialsList = document.getElementById('materialsList'); // Lista de materiais

    // Variáveis globais (ou de escopo mais amplo)
    let loadedAlunos = [];
    let aulaRecords = [];
    let planejamentoContent = ""; // Para armazenar o texto do planejamento
    let materials = []; // Para armazenar os materiais adicionados

    // Função para obter o ID da turma da URL
    function getTurmaIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('turmaId');
    }

    // Dados de exemplo para as turmas (ainda mantemos aqui para o título)
    const turmasData = {
        'turma-101-3a': { name: 'Turma 101 - 3º Ano A', subject: 'Matemática' },
        'turma-202-2a': { name: 'Turma 202 - 2º Ano B', subject: 'Física' },
        'turma-301-1a': { name: 'Turma 301 - 1º Ano C', subject: 'Química' },
        'turma-402-4a': { name: 'Turma 402 - 4º Ano D', subject: 'Biologia' },
        'turma-102-3a': { name: 'Turma 102 - 3º Ano B', subject: 'História' },
        'turma-201-2a': { name: 'Turma 201 - 2º Ano A', subject: 'Português' },
        // ... adicione mais turmas aqui conforme necessário
    };

    // Atualiza o título da página com o nome da turma
    const turmaId = getTurmaIdFromUrl();
    let currentTurmaName = 'Turma Desconhecida';
    if (turmaId && turmasData[turmaId]) {
        currentTurmaName = turmasData[turmaId].name;
        turmaTitulo.innerHTML = `<i class="fas fa-users"></i> Gerenciando ${currentTurmaName}`;
    } else {
        turmaTitulo.innerHTML = `<i class="fas fa-users"></i> Gerenciando Turma (ID não encontrado)`;
    }


    // ===========================================
    // Funções para a Aba de Frequência
    // ===========================================
    async function fetchAndRenderAlunos(turmaId) {
        frequenciaTabContent.innerHTML = '<h3>Controle de Frequência</h3><p>Carregando alunos...</p>';
        try {
            const response = await fetch(`http://localhost/PI/api/get_alunos_turma.php?turmaId=${turmaId}`);
            const data = await response.json();

            if (data.success) {
                loadedAlunos = data.alunos;
                renderFrequenciaTable(loadedAlunos);
            } else {
                frequenciaTabContent.innerHTML = `<h3>Controle de Frequência</h3><p class="error-message">${data.message}</p>`;
            }
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            frequenciaTabContent.innerHTML = `<h3>Controle de Frequência</h3><p class="error-message">Erro ao carregar alunos. Tente novamente mais tarde.</p>`;
        }
    }

    function renderFrequenciaTable(alunos) {
        let tableHtml = `
            <h3>Controle de Frequência</h3>
            <div class="frequencia-controls">
                <label for="frequenciaDate">Data:</label>
                <input type="date" id="frequenciaDate" value="${new Date().toISOString().split('T')[0]}">
                <button id="marcarTodosPresentes"><i class="fas fa-check-square"></i> Marcar Todos Presentes</button>
                <button id="salvarFrequencia"><i class="fas fa-save"></i> Salvar Frequência</button>
            </div>
            <table class="frequencia-table">
                <thead>
                    <tr>
                        <th>Nome do Aluno</th>
                        <th>RA</th>
                        <th>Presente</th>
                        <th>Falta</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (alunos.length === 0) {
            tableHtml += `<tr><td colspan="4">Nenhum aluno encontrado para esta turma.</td></tr>`;
        } else {
            alunos.forEach(aluno => {
                tableHtml += `
                    <tr data-aluno-id="${aluno.id}">
                        <td>${aluno.nome}</td>
                        <td>${aluno.ra}</td>
                        <td><input type="radio" name="status-${aluno.id}" value="presente" checked></td>
                        <td><input type="radio" name="status-${aluno.id}" value="falta"></td>
                    </tr>
                `;
            });
        }
        
        tableHtml += `
                </tbody>
            </table>
        `;
        frequenciaTabContent.innerHTML = tableHtml;

        document.getElementById('marcarTodosPresentes').addEventListener('click', () => {
            document.querySelectorAll('.frequencia-table input[value="presente"]').forEach(checkbox => {
                checkbox.checked = true;
            });
        });

        document.getElementById('salvarFrequencia').addEventListener('click', () => {
            const dataFrequencia = document.getElementById('frequenciaDate').value;
            const registros = [];
            document.querySelectorAll('.frequencia-table tbody tr').forEach(row => {
                const alunoId = row.dataset.alunoId;
                const status = row.querySelector(`input[name="status-${alunoId}"]:checked`).value;
                registros.push({
                    alunoId: alunoId,
                    status: status,
                    data: dataFrequencia
                });
            });
            console.log('Frequência a ser salva (dados fictícios):', registros);
            alert('Frequência registrada com sucesso (simulação)! Consulte o console para ver os dados.');
        });
    }

    // ===========================================
    // Funções para a Aba de Notas
    // ===========================================
    function renderNotasTable() {
        notasTableBody.innerHTML = ''; 

        if (loadedAlunos.length === 0) {
            notasTableBody.innerHTML = `<tr><td colspan="4">Nenhum aluno encontrado. Por favor, recarregue a página ou selecione a aba de frequência primeiro.</td></tr>`;
            return;
        }

        loadedAlunos.forEach(aluno => {
            const row = document.createElement('tr');
            row.dataset.alunoId = aluno.id;
            row.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.ra}</td>
                <td><input type="number" class="nota-input" min="0" max="100" step="0.1" value=""></td>
                <td><input type="text" class="observacao-input" placeholder="Observações (opcional)"></td>
            `;
            notasTableBody.appendChild(row);
        });

        document.getElementById('salvarNotas').addEventListener('click', () => {
            const avaliacaoSelecionada = document.getElementById('avaliacaoSelect').value;
            const notasParaSalvar = [];
            document.querySelectorAll('#notasTableBody tr').forEach(row => {
                const alunoId = row.dataset.alunoId;
                const nota = parseFloat(row.querySelector('.nota-input').value);
                const observacao = row.querySelector('.observacao-input').value;

                if (!isNaN(nota) && nota >= 0 && nota <= 100) {
                    notasParaSalvar.push({
                        alunoId: alunoId,
                        avaliacao: avaliacaoSelecionada,
                        nota: nota,
                        observacao: observacao
                    });
                } else if (row.querySelector('.nota-input').value !== '') {
                    alert(`Por favor, insira uma nota válida (0-100) para ${row.querySelector('td:first-child').textContent}.`);
                    return;
                }
            });
            
            if (notasParaSalvar.length > 0) {
                console.log('Notas a serem salvas (dados fictícios):', notasParaSalvar);
                alert('Notas salvas com sucesso (simulação)! Consulte o console para ver os dados.');
            } else {
                alert('Nenhuma nota válida para salvar.');
            }
        });
    }

    // ===========================================
    // Funções para a Aba de Aulas e Ocorrências
    // ===========================================
    function renderAulaHistory() {
        if (aulaRecords.length === 0) {
            aulaHistoryContainer.innerHTML = '<p>Nenhuma aula registrada ainda.</p>';
            return;
        }

        let historyHtml = '';
        const sortedRecords = [...aulaRecords].sort((a, b) => new Date(b.date) - new Date(a.date)); 

        sortedRecords.forEach((record, index) => {
            historyHtml += `
                <div class="aula-record-card">
                    <div class="record-header">
                        <strong>Data:</strong> ${record.date}
                        <button class="delete-record-btn" data-index="${index}" title="Excluir Registro"><i class="fas fa-trash-alt"></i></button>
                    </div>
                    <p><strong>Conteúdo:</strong> ${record.content}</p>
                    ${record.occurrences ? `<p><strong>Ocorrências:</strong> ${record.occurrences}</p>` : ''}
                </div>
            `;
        });
        aulaHistoryContainer.innerHTML = historyHtml;

        document.querySelectorAll('.delete-record-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToDelete = parseInt(event.target.closest('.delete-record-btn').dataset.index); // Converte para número
                if (confirm('Tem certeza que deseja excluir este registro de aula?')) {
                    // Remove do array baseando-se no índice do registro no ARRAY ORIGINAL, não no array ordenado
                    // É melhor usar um ID único para cada registro de aula para evitar problemas de ordenação/exclusão.
                    // Por enquanto, como o array é pequeno e apenas para simulação, vamos usar o índice do array original.
                    // Para isso, precisamos achar o item original.
                    const recordToDelete = sortedRecords[indexToDelete];
                    const originalIndex = aulaRecords.findIndex(rec => 
                        rec.date === recordToDelete.date && 
                        rec.content === recordToDelete.content && 
                        rec.occurrences === recordToDelete.occurrences
                    );
                    if (originalIndex > -1) {
                        aulaRecords.splice(originalIndex, 1);
                        renderAulaHistory();
                    }
                }
            });
        });
    }

    document.getElementById('registrarAulaBtn')?.addEventListener('click', () => {
        const aulaDate = document.getElementById('aulaDate').value;
        const aulaContent = document.getElementById('aulaContent').value.trim();
        const aulaOcorrencias = document.getElementById('aulaOcorrencias').value.trim();

        if (!aulaDate || !aulaContent) {
            alert('Por favor, preencha a data e o conteúdo da aula.');
            return;
        }

        const newRecord = {
            date: aulaDate,
            content: aulaContent,
            occurrences: aulaOcorrencias
        };

        aulaRecords.push(newRecord);
        console.log('Nova aula registrada (dados fictícios):', newRecord);
        alert('Aula registrada com sucesso (simulação)!');

        document.getElementById('aulaContent').value = '';
        document.getElementById('aulaOcorrencias').value = '';
        document.getElementById('aulaDate').value = new Date().toISOString().split('T')[0];

        renderAulaHistory();
    });

    // ===========================================
    // Funções para a Aba de Planejamento e Materiais
    // ===========================================
    function loadPlanningAndMaterials() {
        // Carrega o planejamento salvo (se houver)
        const planejamentoTextarea = document.getElementById('planejamentoText');
        if (planejamentoTextarea) {
            planejamentoTextarea.value = planejamentoContent;
        }
        renderMaterialsList();
    }

    function renderMaterialsList() {
        materialsList.innerHTML = ''; // Limpa a lista existente

        if (materials.length === 0) {
            materialsList.innerHTML = '<li class="no-materials-message">Nenhum material adicionado ainda.</li>';
            return;
        }

        materials.forEach((material, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <i class="fas fa-file-alt"></i> 
                <a href="${material.link}" target="_blank" rel="noopener noreferrer">${material.name}</a> 
                <button class="delete-material-btn" data-index="${index}" title="Remover Material"><i class="fas fa-times-circle"></i></button>
            `;
            materialsList.appendChild(listItem);
        });

        // Adiciona listeners para os botões de exclusão de material
        document.querySelectorAll('.delete-material-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToDelete = parseInt(event.target.closest('.delete-material-btn').dataset.index);
                if (confirm('Tem certeza que deseja remover este material?')) {
                    materials.splice(indexToDelete, 1);
                    renderMaterialsList();
                }
            });
        });
    }

    document.getElementById('salvarPlanejamentoBtn')?.addEventListener('click', () => {
        const planejamentoTextarea = document.getElementById('planejamentoText');
        if (planejamentoTextarea) {
            planejamentoContent = planejamentoTextarea.value.trim();
            console.log('Planejamento salvo (simulação):', planejamentoContent);
            alert('Planejamento salvo com sucesso (simulação)!');
        }
    });

    document.getElementById('adicionarMaterialBtn')?.addEventListener('click', () => {
        const materialNameInput = document.getElementById('materialName');
        const materialLinkInput = document.getElementById('materialLink');

        const name = materialNameInput.value.trim();
        const link = materialLinkInput.value.trim();

        if (!name || !link) {
            alert('Por favor, preencha o nome e o link do material.');
            return;
        }

        materials.push({ name, link });
        console.log('Material adicionado (simulação):', { name, link });
        alert('Material adicionado com sucesso (simulação)!');

        materialNameInput.value = '';
        materialLinkInput.value = '';
        
        renderMaterialsList(); // Atualiza a lista de materiais
    });


    // ===========================================
    // Lógica principal de Abas e Navegação
    // ===========================================
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            const targetTab = button.dataset.tab;
            document.getElementById(targetTab).classList.add('active');

            if (targetTab === 'frequencia') {
                fetchAndRenderAlunos(turmaId);
            } else if (targetTab === 'notas') {
                if (loadedAlunos.length > 0) {
                    renderNotasTable();
                } else {
                    fetchAndRenderAlunos(turmaId).then(() => {
                        renderNotasTable();
                    });
                }
            } else if (targetTab === 'aulas') {
                renderAulaHistory();
            } else if (targetTab === 'planejamento') { // Nova lógica para a aba de planejamento
                loadPlanningAndMaterials();
            }
        });
    });

    // Lógica para destacar o item de navegação "Minhas Turmas"
    const navItems = document.querySelectorAll('.nav-item');
    const currentPageNav = 'minhas-turmas';

    navItems.forEach(item => {
        if (item.getAttribute('data-page') === currentPageNav) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Ao carregar a página, gerencia a aba inicial
    const initialActiveTab = document.querySelector('.tab-button.active')?.dataset.tab;
    if (initialActiveTab === 'frequencia' || initialActiveTab === 'notas') {
        fetchAndRenderAlunos(turmaId);
    } else if (initialActiveTab === 'aulas') {
        renderAulaHistory();
    } else if (initialActiveTab === 'planejamento') {
        loadPlanningAndMaterials();
    }
});