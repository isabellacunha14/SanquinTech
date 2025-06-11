document.addEventListener('DOMContentLoaded', () => {
    const tipoCadastroSelect = document.getElementById('tipoCadastro');
    const camposCadastroDiv = document.getElementById('camposCadastro');
    const cadastroAcademicoForm = document.getElementById('cadastroAcademicoForm');
    const registrosCursosDiv = document.getElementById('registrosCursos');
    const mainModal = document.getElementById('mainModal');

    // Armazenamento local: cursos (cada curso terá um array de matérias)
    let cursosCadastrados = JSON.parse(localStorage.getItem('cursosCadastrados')) || [];

    // Carregar usuários cadastrados (professores e alunos) para atribuição
    // É importante que o cadastro de usuários já esteja funcionando para isso!
    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [];
    const professores = usuariosCadastrados.filter(u => u.tipoUsuario === 'professor' && u.ativo);
    const alunos = usuariosCadastrados.filter(u => u.tipoUsuario === 'aluno' && u.ativo); // Para turmas

    // Função para renderizar os cursos cadastrados
    function renderizarRegistros() {
        registrosCursosDiv.innerHTML = ''; // Limpa os registros existentes

        if (cursosCadastrados.length === 0) {
            registrosCursosDiv.innerHTML = '<p class="no-records-message">Nenhum curso cadastrado ainda.</p>';
            return;
        }

        cursosCadastrados.forEach(curso => {
            const cursoItem = document.createElement('div');
            cursoItem.classList.add('registro-item-curso'); // Usar classe diferente
            cursoItem.dataset.id = curso.id;

            cursoItem.innerHTML = `
                <div class="registro-item-header">
                    <h3><i class="fas fa-book"></i> ${curso.nomeCurso}</h3>
                    <p>Carga Horária: ${curso.cargaHoraria}h</p>
                    <p>Matérias: ${curso.materias.length}</p>
                </div>
                <div class="registro-actions">
                    <button class="btn-visualizar" data-id="${curso.id}" title="Visualizar Curso"><i class="fas fa-eye"></i></button>
                    <button class="btn-editar" data-id="${curso.id}" title="Editar Curso e Matérias"><i class="fas fa-edit"></i></button>
                    <button class="btn-inativar" data-id="${curso.id}" title="Excluir Curso"><i class="fas fa-trash"></i></button>
                </div>
            `;
            registrosCursosDiv.appendChild(cursoItem);
        });
        adicionarEventListenersAcoes(); // Adiciona listeners aos botões
    }

    // Função para adicionar os event listeners aos botões de ação
    function adicionarEventListenersAcoes() {
        // Delegação de eventos para os botões de ação dentro da div de registros de cursos
        registrosCursosDiv.removeEventListener('click', handleActionClickDelegated); // Remove para evitar duplicidade
        registrosCursosDiv.addEventListener('click', handleActionClickDelegated);
    }

    // Função para lidar com o clique nos botões de ação (visualizar, editar, inativar/ativar)
    function handleActionClickDelegated(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        if (target.classList.contains('btn-visualizar')) {
            visualizarCurso(id);
        } else if (target.classList.contains('btn-editar')) {
            editarCurso(id);
        } else if (target.classList.contains('btn-inativar')) { // Usando btn-inativar para excluir o curso
            excluirCurso(id);
        }
    }

    // Exibe campos de formulário baseados no tipo de cadastro (Curso ou Matéria)
    function exibirCamposCadastro(tipo, valoresAtuais = {}) {
        camposCadastroDiv.innerHTML = '';

        if (tipo === 'curso') {
            camposCadastroDiv.innerHTML = `
                <div class="form-group">
                    <label for="nomeCurso">Nome do Curso:</label>
                    <input type="text" id="nomeCurso" name="nomeCurso" placeholder="Ex: Engenharia de Software" value="${valoresAtuais.nomeCurso || ''}" required>
                </div>
                <div class="form-group">
                    <label for="descricaoCurso">Descrição do Curso:</label>
                    <textarea id="descricaoCurso" name="descricaoCurso" placeholder="Breve descrição do curso">${valoresAtuais.descricaoCurso || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="cargaHoraria">Carga Horária (horas):</label>
                    <input type="number" id="cargaHoraria" name="cargaHoraria" placeholder="Ex: 3600" value="${valoresAtuais.cargaHoraria || ''}" required min="1">
                </div>
            `;
        }
        // Se houver tipos de cadastro futuros, pode adicionar aqui
    }

    // Event listener para o select de tipo de cadastro
    tipoCadastroSelect.addEventListener('change', (event) => {
        exibirCamposCadastro(event.target.value);
    });

    // Event listener para o submit do formulário de cadastro
    cadastroAcademicoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const tipo = tipoCadastroSelect.value;
        if (tipo === 'curso') {
            const formData = new FormData(cadastroAcademicoForm);
            const novoCurso = {
                id: Date.now().toString(),
                nomeCurso: formData.get('nomeCurso'),
                descricaoCurso: formData.get('descricaoCurso'),
                cargaHoraria: parseInt(formData.get('cargaHoraria')),
                materias: [] // Um novo curso começa sem matérias
            };

            if (!novoCurso.nomeCurso || !novoCurso.cargaHoraria) {
                alert('Por favor, preencha o nome do curso e a carga horária.');
                return;
            }

            cursosCadastrados.push(novoCurso);
            localStorage.setItem('cursosCadastrados', JSON.stringify(cursosCadastrados));
            renderizarRegistros();

            cadastroAcademicoForm.reset();
            camposCadastroDiv.innerHTML = '';
            tipoCadastroSelect.value = ''; // Reseta o select
            alert('Curso cadastrado com sucesso!');
        } else {
            alert('Selecione um tipo de cadastro válido.');
        }
    });

    // Funções de Modal (Visualizar, Editar, Excluir)

    function visualizarCurso(id) {
        const curso = cursosCadastrados.find(c => c.id === id);
        if (!curso) return;

        let materiasHtml = '';
        if (curso.materias.length > 0) {
            materiasHtml = `
                <h3><i class="fas fa-list-alt"></i> Matérias do Curso:</h3>
                <ul class="materias-list">
                    ${curso.materias.map(materia => `
                        <li class="materia-item">
                            <div class="materia-details">
                                <strong>${materia.nomeMateria}</strong> (${materia.cargaHorariaMateria}h)
                                <br>Professor: ${materia.professor ? professores.find(p => p.id === materia.professor)?.nomeCompleto || 'N/A' : 'Não Atribuído'}
                                <br>Turma: ${materia.turma ? materia.turma.join(', ') : 'Não Atribuída'}
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `;
        } else {
            materiasHtml = '<p>Nenhuma matéria cadastrada para este curso ainda.</p>';
        }


        mainModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">×</span>
                <h2>Detalhes do Curso: ${curso.nomeCurso}</h2>
                <p><strong>ID:</strong> ${curso.id}</p>
                <p><strong>Descrição:</strong> ${curso.descricaoCurso || 'N/A'}</p>
                <p><strong>Carga Horária Total:</strong> ${curso.cargaHoraria} horas</p>
                ${materiasHtml}
            </div>
        `;
        mainModal.style.display = 'flex';

        document.querySelector('#mainModal .close-button').onclick = () => mainModal.style.display = 'none';
        mainModal.onclick = (e) => {
            if (e.target === mainModal) {
                mainModal.style.display = 'none';
            }
        };
    }

    function editarCurso(id) {
        const cursoIndex = cursosCadastrados.findIndex(c => c.id === id);
        if (cursoIndex === -1) return;

        const curso = cursosCadastrados[cursoIndex];

        // Opções de professores para o select
        const professorOptions = professores.map(p => `<option value="${p.id}">${p.nomeCompleto}</option>`).join('');

        // Opções de turmas (simplificado para strings, pode ser mais complexo se houver um cadastro de turmas)
        // Por enquanto, vamos permitir input manual ou um select de alunos já cadastrados como referência de turma.
        // Para simplificar, vou fazer um campo de texto que aceita múltiplas turmas separadas por vírgula.
        // Ou, se tivermos um array de alunos, podemos listar as "turmas" deles.
        // Vamos usar um input para a turma e considerar a turma como um array de strings por matéria

        // Renderiza as matérias existentes
        function renderizarMateriasEditaveis() {
            const materiasList = document.getElementById('editMateriasList');
            if (!materiasList) return; // Garante que o elemento existe

            materiasList.innerHTML = ''; // Limpa a lista antes de renderizar

            if (curso.materias.length === 0) {
                materiasList.innerHTML = '<p class="no-materias-message">Nenhuma matéria adicionada a este curso ainda.</p>';
                return;
            }

            curso.materias.forEach((materia, index) => {
                const materiaItem = document.createElement('li');
                materiaItem.classList.add('materia-item');
                materiaItem.innerHTML = `
                    <div class="materia-details">
                        <strong>${materia.nomeMateria}</strong> (${materia.cargaHorariaMateria}h)
                        <br>Professor: ${materia.professor ? professores.find(p => p.id === materia.professor)?.nomeCompleto || 'N/A' : 'Não Atribuído'}
                        <br>Turma: ${materia.turma && materia.turma.length > 0 ? materia.turma.join(', ') : 'Não Atribuída'}
                    </div>
                    <div class="materia-actions">
                        <button type="button" class="btn-remove-materia" data-index="${index}" title="Remover Matéria"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                materiasList.appendChild(materiaItem);
            });

            // Adiciona listener para os botões de remover matéria
            materiasList.querySelectorAll('.btn-remove-materia').forEach(button => {
                button.onclick = (e) => {
                    const indexToRemove = parseInt(e.target.closest('button').dataset.index);
                    if (confirm(`Tem certeza que deseja remover a matéria "${curso.materias[indexToRemove].nomeMateria}"?`)) {
                        curso.materias.splice(indexToRemove, 1);
                        localStorage.setItem('cursosCadastrados', JSON.stringify(cursosCadastrados));
                        renderizarMateriasEditaveis(); // Re-renderiza as matérias no modal
                        renderizarRegistros(); // Atualiza a contagem de matérias na lista principal
                    }
                };
            });
        }


        mainModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">×</span>
                <h2>Editar Curso: ${curso.nomeCurso}</h2>
                <form id="editCursoForm" class="modal-form">
                    <div class="form-group">
                        <label for="editNomeCurso">Nome do Curso:</label>
                        <input type="text" id="editNomeCurso" name="nomeCurso" value="${curso.nomeCurso}" required>
                    </div>
                    <div class="form-group">
                        <label for="editDescricaoCurso">Descrição do Curso:</label>
                        <textarea id="editDescricaoCurso" name="descricaoCurso">${curso.descricaoCurso || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editCargaHoraria">Carga Horária (horas):</label>
                        <input type="number" id="editCargaHoraria" name="cargaHoraria" value="${curso.cargaHoraria}" required min="1">
                    </div>

                    <div class="materias-list-container">
                        <h3><i class="fas fa-book-reader"></i> Matérias Atribuídas</h3>
                        <ul id="editMateriasList" class="materias-list">
                            </ul>
                    </div>

                    <div class="add-materia-form">
                        <h3><i class="fas fa-plus"></i> Adicionar Nova Matéria</h3>
                        <div class="form-group">
                            <label for="novaMateriaNome">Nome da Matéria:</label>
                            <input type="text" id="novaMateriaNome" placeholder="Ex: Estruturas de Dados" required>
                        </div>
                        <div class="form-group">
                            <label for="novaMateriaCargaHoraria">Carga Horária da Matéria (horas):</label>
                            <input type="number" id="novaMateriaCargaHoraria" placeholder="Ex: 80" required min="1">
                        </div>
                        <div class="form-group">
                            <label for="novaMateriaProfessor">Professor:</label>
                            <select id="novaMateriaProfessor">
                                <option value="">Selecione um Professor</option>
                                ${professorOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="novaMateriaTurma">Turma(s) (separar por vírgula, ex: 1A, 2B):</label>
                            <input type="text" id="novaMateriaTurma" placeholder="Ex: ADS1A, ADS1B">
                        </div>
                        <button type="button" id="btnAddMateria" class="btn-add-materia"><i class="fas fa-plus"></i> Adicionar Matéria</button>
                    </div>

                    <button type="submit" class="btn-submit">Salvar Alterações do Curso</button>
                </form>
            </div>
        `;
        mainModal.style.display = 'flex';

        // Renderiza as matérias existentes assim que o modal é aberto
        renderizarMateriasEditaveis();

        document.querySelector('#mainModal .close-button').onclick = () => mainModal.style.display = 'none';
        mainModal.onclick = (e) => {
            if (e.target === mainModal) {
                mainModal.style.display = 'none';
            }
        };

        const editForm = document.getElementById('editCursoForm');
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Atualiza os dados principais do curso
            curso.nomeCurso = document.getElementById('editNomeCurso').value;
            curso.descricaoCurso = document.getElementById('editDescricaoCurso').value;
            curso.cargaHoraria = parseInt(document.getElementById('editCargaHoraria').value);

            localStorage.setItem('cursosCadastrados', JSON.stringify(cursosCadastrados));
            renderizarRegistros();
            mainModal.style.display = 'none';
            alert('Curso atualizado com sucesso!');
        });

        // Lógica para adicionar nova matéria
        document.getElementById('btnAddMateria').addEventListener('click', () => {
            const nomeMateria = document.getElementById('novaMateriaNome').value.trim();
            const cargaHorariaMateria = parseInt(document.getElementById('novaMateriaCargaHoraria').value);
            const professorMateriaId = document.getElementById('novaMateriaProfessor').value;
            const turmaMateriaInput = document.getElementById('novaMateriaTurma').value.trim();

            if (!nomeMateria || !cargaHorariaMateria || cargaHorariaMateria <= 0) {
                alert('Preencha o nome e a carga horária da matéria.');
                return;
            }

            const novaMateria = {
                id: Date.now().toString(),
                nomeMateria: nomeMateria,
                cargaHorariaMateria: cargaHorariaMateria,
                professor: professorMateriaId || null, // Atribui null se não selecionado
                turma: turmaMateriaInput ? turmaMateriaInput.split(',').map(t => t.trim()).filter(t => t) : []
            };

            curso.materias.push(novaMateria);
            localStorage.setItem('cursosCadastrados', JSON.stringify(cursosCadastrados));
            renderizarMateriasEditaveis(); // Re-renderiza as matérias no modal
            renderizarRegistros(); // Atualiza a contagem de matérias na lista principal (se exibir)

            // Limpa os campos do formulário de nova matéria
            document.getElementById('novaMateriaNome').value = '';
            document.getElementById('novaMateriaCargaHoraria').value = '';
            document.getElementById('novaMateriaProfessor').value = '';
            document.getElementById('novaMateriaTurma').value = '';
            alert('Matéria adicionada com sucesso!');
        });
    }

    function excluirCurso(id) {
        if (confirm('Tem certeza que deseja EXCLUIR este curso? Esta ação é irreversível.')) {
            cursosCadastrados = cursosCadastrados.filter(c => c.id !== id);
            localStorage.setItem('cursosCadastrados', JSON.stringify(cursosCadastrados));
            renderizarRegistros();
            alert('Curso excluído com sucesso!');
        }
    }

    // Inicializa a renderização dos registros ao carregar a página
    renderizarRegistros();
});