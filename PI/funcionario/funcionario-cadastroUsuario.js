document.addEventListener('DOMContentLoaded', () => {
    const tipoUsuarioSelect = document.getElementById('tipoUsuario');
    const camposAdicionaisDiv = document.getElementById('camposAdicionais');
    const cadastroUsuarioForm = document.getElementById('cadastroUsuarioForm');
    const registrosArmazenadosDiv = document.getElementById('registrosArmazenados');
    const mainModal = document.getElementById('mainModal'); // O modal principal

    // Array para simular o armazenamento de usuários
    let usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [];

    // Função principal para renderizar os registros agrupados
    function renderizarRegistros() {
        registrosArmazenadosDiv.innerHTML = ''; // Limpa os registros existentes

        if (usuariosCadastrados.length === 0) {
            registrosArmazenadosDiv.innerHTML = '<p class="no-records-message">Nenhum usuário cadastrado ainda.</p>';
            return;
        }

        // Agrupar usuários por tipo
        const grupos = {
            aluno: [],
            professor: [],
            funcionario: []
        };

        usuariosCadastrados.forEach(usuario => {
            grupos[usuario.tipoUsuario].push(usuario);
        });

        // Tipos na ordem desejada
        const tiposOrdenados = ['aluno', 'professor', 'funcionario'];

        tiposOrdenados.forEach(tipo => {
            const usuariosDoTipo = grupos[tipo];
            const nomeTipoDisplay = tipo.charAt(0).toUpperCase() + tipo.slice(1);

            if (usuariosDoTipo.length > 0) {
                const grupoDiv = document.createElement('div');
                grupoDiv.classList.add('registro-group'); // Container para o grupo
                grupoDiv.dataset.tipo = tipo;

                const header = document.createElement('div');
                header.classList.add('registro-group-header');
                header.innerHTML = `
                    ${nomeTipoDisplay} (${usuariosDoTipo.length} usuários)
                    <i class="fas fa-chevron-right toggle-icon"></i>
                `;
                grupoDiv.appendChild(header);

                const content = document.createElement('div');
                content.classList.add('registro-group-content'); // Onde os usuários do tipo serão listados
                grupoDiv.appendChild(content);

                usuariosDoTipo.forEach(usuario => {
                    const registroItem = document.createElement('div');
                    registroItem.classList.add('registro-item');
                    if (!usuario.ativo) {
                        registroItem.classList.add('inativo');
                    }
                    registroItem.dataset.id = usuario.id;

                    let iconClass = '';
                    let infoEssencial = '';

                    switch (usuario.tipoUsuario) {
                        case 'aluno':
                            iconClass = 'fas fa-user-graduate';
                            infoEssencial = `Turma: ${usuario.turma || 'N/A'}`;
                            break;
                        case 'professor':
                            iconClass = 'fas fa-chalkboard-user';
                            infoEssencial = `Disciplina: ${usuario.disciplina || 'N/A'}`;
                            break;
                        case 'funcionario':
                            iconClass = 'fas fa-user-tie';
                            infoEssencial = `Cargo: ${usuario.cargo || 'N/A'}`;
                            break;
                    }

                    registroItem.innerHTML = `
                        <div class="registro-item-header">
                            <h3>
                                <i class="${iconClass}"></i>
                                ${usuario.nomeCompleto}
                                <span class="status-tag ${usuario.ativo ? 'ativo' : 'inativo'}">${usuario.ativo ? 'Ativo' : 'Inativo'}</span>
                            </h3>
                            <p>${infoEssencial}</p>
                        </div>
                        <div class="registro-actions">
                            <button class="btn-visualizar" data-id="${usuario.id}" title="Visualizar"><i class="fas fa-eye"></i></button>
                            <button class="btn-editar" data-id="${usuario.id}" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="btn-${usuario.ativo ? 'inativar' : 'ativar'}" data-id="${usuario.id}" title="${usuario.ativo ? 'Inativar' : 'Ativar'}">${usuario.ativo ? '<i class="fas fa-ban"></i>' : '<i class="fas fa-check-circle"></i>'}</button>
                        </div>
                    `;
                    content.appendChild(registroItem);
                });
                registrosArmazenadosDiv.appendChild(grupoDiv);
            }
        });
        adicionarEventListenersAcoes();
    }

    // Função para adicionar os event listeners aos cabeçalhos dos grupos e aos botões de ação
    function adicionarEventListenersAcoes() {
        // Event listener para expandir/colapsar o grupo de registros
        document.querySelectorAll('.registro-group-header').forEach(header => {
            header.removeEventListener('click', toggleExpandirGrupo); // Evita múltiplos listeners
            header.addEventListener('click', toggleExpandirGrupo);
        });

        // Delegação de eventos para os botões de ação dentro da div de registros
        // Isso é mais eficiente, pois um único listener lida com cliques em todos os botões, mesmo os adicionados dinamicamente.
        registrosArmazenadosDiv.removeEventListener('click', handleActionClickDelegated); // Remove para evitar duplicidade
        registrosArmazenadosDiv.addEventListener('click', handleActionClickDelegated);
    }

    // Função para lidar com o clique nos botões de ação (visualizar, editar, inativar/ativar)
    function handleActionClickDelegated(event) {
        const target = event.target.closest('button'); // Encontra o botão clicado ou null
        if (!target) return; // Se não clicou em um botão, sai

        const id = target.dataset.id; // Pega o ID do usuário
        if (target.classList.contains('btn-visualizar')) {
            visualizarUsuario(id);
        } else if (target.classList.contains('btn-editar')) {
            editarUsuario(id);
        } else if (target.classList.contains('btn-inativar') || target.classList.contains('btn-ativar')) {
            toggleStatusUsuario(id);
        }
    }

    // Função para expandir/colapsar o conteúdo de um grupo de registros
    function toggleExpandirGrupo() {
        this.classList.toggle('expanded'); // Adiciona/remove a classe 'expanded'
        const content = this.nextElementSibling; // Pega o próximo irmão (o conteúdo do grupo)
        // A exibição/ocultação é controlada pelo CSS via `display: none/flex`
    }

    // Função para exibir campos adicionais no formulário de cadastro/edição
    function exibirCamposAdicionais(tipo, valoresAtuais = {}) {
        camposAdicionaisDiv.innerHTML = ''; // Limpa campos anteriores

        let htmlCampos = '';
        if (tipo === 'aluno') {
            htmlCampos = `
                <div class="form-group">
                    <label for="matricula">Matrícula:</label>
                    <input type="text" id="matricula" name="matricula" placeholder="Digite a matrícula do aluno" value="${valoresAtuais.matricula || ''}" required>
                </div>
                <div class="form-group">
                    <label for="turma">Turma:</label>
                    <input type="text" id="turma" name="turma" placeholder="Digite a turma do aluno" value="${valoresAtuais.turma || ''}" required>
                </div>
                <div class="form-group">
                    <label for="curso">Curso:</label>
                    <input type="text" id="curso" name="curso" placeholder="Digite o curso do aluno" value="${valoresAtuais.curso || ''}" required>
                </div>
            `;
        } else if (tipo === 'professor') {
            htmlCampos = `
                <div class="form-group">
                    <label for="disciplina">Disciplina Principal:</label>
                    <input type="text" id="disciplina" name="disciplina" placeholder="Digite a disciplina principal" value="${valoresAtuais.disciplina || ''}" required>
                </div>
                <div class="form-group">
                    <label for="formacao">Formação:</label>
                    <input type="text" id="formacao" name="formacao" placeholder="Digite a formação do professor" value="${valoresAtuais.formacao || ''}">
                </div>
            `;
        } else if (tipo === 'funcionario') {
            htmlCampos = `
                <div class="form-group">
                    <label for="cargo">Cargo:</label>
                    <input type="text" id="cargo" name="cargo" placeholder="Digite o cargo do funcionário" value="${valoresAtuais.cargo || ''}" required>
                </div>
                <div class="form-group">
                    <label for="departamento">Departamento:</label>
                    <input type="text" id="departamento" name="departamento" placeholder="Digite o departamento" value="${valoresAtuais.departamento || ''}">
                </div>
            `;
        }
        camposAdicionaisDiv.innerHTML = htmlCampos;
    }

    // Event listener para o select de tipo de usuário no formulário de cadastro
    tipoUsuarioSelect.addEventListener('change', (event) => {
        exibirCamposAdicionais(event.target.value);
    });

    // Event listener para o submit do formulário de cadastro
    cadastroUsuarioForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(cadastroUsuarioForm);
        const novoUsuario = {
            id: Date.now().toString(), // ID único simples baseado no timestamp
            ativo: true // Novo usuário começa como ativo
        };

        formData.forEach((value, key) => {
            novoUsuario[key] = value;
        });

        // Validação básica para o caso de não ter os campos extras para aluno/professor/funcionário
        if (novoUsuario.tipoUsuario === 'aluno' && (!novoUsuario.matricula || !novoUsuario.turma || !novoUsuario.curso)) {
            alert('Por favor, preencha todos os campos específicos para Aluno (Matrícula, Turma, Curso).');
            return;
        }
        if (novoUsuario.tipoUsuario === 'professor' && !novoUsuario.disciplina) {
            alert('Por favor, preencha a Disciplina Principal para Professor.');
            return;
        }
        if (novoUsuario.tipoUsuario === 'funcionario' && !novoUsuario.cargo) {
            alert('Por favor, preencha o Cargo para Funcionário.');
            return;
        }

        usuariosCadastrados.push(novoUsuario);
        localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados)); // Salva no LocalStorage
        renderizarRegistros(); // Re-renderiza a lista para incluir o novo

        cadastroUsuarioForm.reset(); // Limpa o formulário
        camposAdicionaisDiv.innerHTML = ''; // Limpa campos adicionais
        tipoUsuarioSelect.value = ''; // Reseta o select

        alert('Usuário cadastrado com sucesso!');
    });

    // Função auxiliar para gerar os detalhes específicos de cada tipo de usuário
    function gerarDetalhesCompletos(usuario) {
        let detalhes = '';
        if (usuario.tipoUsuario === 'aluno') {
            detalhes = `
                <p><strong>Matrícula:</strong> ${usuario.matricula || 'N/A'}</p>
                <p><strong>Turma:</strong> ${usuario.turma || 'N/A'}</p>
                <p><strong>Curso:</strong> ${usuario.curso || 'N/A'}</p>
            `;
        } else if (usuario.tipoUsuario === 'professor') {
            detalhes = `
                <p><strong>Disciplina Principal:</strong> ${usuario.disciplina || 'N/A'}</p>
                <p><strong>Formação:</strong> ${usuario.formacao || 'Não informada'}</p>
            `;
        } else if (usuario.tipoUsuario === 'funcionario') {
            detalhes = `
                <p><strong>Cargo:</strong> ${usuario.cargo || 'N/A'}</p>
                <p><strong>Departamento:</strong> ${usuario.departamento || 'Não informado'}</p>
            `;
        }
        return detalhes;
    }

    // Função para visualizar os detalhes de um usuário em um modal
    function visualizarUsuario(id) {
        const usuario = usuariosCadastrados.find(u => u.id === id);
        if (!usuario) return;

        let camposEspecificos = gerarDetalhesCompletos(usuario);

        mainModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">×</span>
                <h2>Detalhes do Usuário</h2>
                <p><strong>ID:</strong> ${usuario.id}</p>
                <p><strong>Tipo:</strong> ${usuario.tipoUsuario.charAt(0).toUpperCase() + usuario.tipoUsuario.slice(1)}</p>
                <p><strong>Nome Completo:</strong> ${usuario.nomeCompleto}</p>
                <p><strong>E-mail:</strong> ${usuario.email}</p>
                <p><strong>CPF:</strong> ${usuario.cpf}</p>
                <p><strong>Data de Nascimento:</strong> ${usuario.dataNascimento}</p>
                <p><strong>Telefone:</strong> ${usuario.telefone || 'Não informado'}</p>
                ${camposEspecificos}
                <p><strong>Status:</strong> <span class="status-tag ${usuario.ativo ? 'ativo' : 'inativo'}">${usuario.ativo ? 'Ativo' : 'Inativo'}</span></p>
            </div>
        `;
        mainModal.style.display = 'flex'; // Exibe o modal (usando flex para centralizar)

        // Adiciona event listeners para fechar o modal
        document.querySelector('#mainModal .close-button').onclick = () => mainModal.style.display = 'none';
        mainModal.onclick = (e) => {
            if (e.target === mainModal) { // Fecha apenas se clicar fora do conteúdo
                mainModal.style.display = 'none';
            }
        };
    }

    // Função para editar um usuário em um modal
    function editarUsuario(id) {
        const usuarioIndex = usuariosCadastrados.findIndex(u => u.id === id);
        if (usuarioIndex === -1) return;

        const usuario = usuariosCadastrados[usuarioIndex];

        let camposEspecificosForm = '';
        if (usuario.tipoUsuario === 'aluno') {
            camposEspecificosForm = `
                <div class="form-group">
                    <label for="editMatricula">Matrícula:</label>
                    <input type="text" id="editMatricula" name="matricula" value="${usuario.matricula || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editTurma">Turma:</label>
                    <input type="text" id="editTurma" name="turma" value="${usuario.turma || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editCurso">Curso:</label>
                    <input type="text" id="editCurso" name="curso" value="${usuario.curso || ''}" required>
                </div>
            `;
        } else if (usuario.tipoUsuario === 'professor') {
            camposEspecificosForm = `
                <div class="form-group">
                    <label for="editDisciplina">Disciplina Principal:</label>
                    <input type="text" id="editDisciplina" name="disciplina" value="${usuario.disciplina || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editFormacao">Formação:</label>
                    <input type="text" id="editFormacao" name="formacao" value="${usuario.formacao || ''}">
                </div>
            `;
        } else if (usuario.tipoUsuario === 'funcionario') {
            camposEspecificosForm = `
                <div class="form-group">
                    <label for="editCargo">Cargo:</label>
                    <input type="text" id="editCargo" name="cargo" value="${usuario.cargo || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editDepartamento">Departamento:</label>
                    <input type="text" id="editDepartamento" name="departamento" value="${usuario.departamento || ''}">
                </div>
            `;
        }

        mainModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">×</span>
                <h2>Editar Usuário</h2>
                <form id="editUsuarioForm" class="modal-form">
                    <div class="form-group">
                        <label for="editTipoUsuario">Tipo de Usuário:</label>
                        <select id="editTipoUsuario" name="tipoUsuario" disabled> <option value="aluno" ${usuario.tipoUsuario === 'aluno' ? 'selected' : ''}>Aluno</option>
                            <option value="professor" ${usuario.tipoUsuario === 'professor' ? 'selected' : ''}>Professor</option>
                            <option value="funcionario" ${usuario.tipoUsuario === 'funcionario' ? 'selected' : ''}>Funcionário</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editNomeCompleto">Nome Completo:</label>
                        <input type="text" id="editNomeCompleto" name="nomeCompleto" value="${usuario.nomeCompleto}" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmail">E-mail:</label>
                        <input type="email" id="editEmail" name="email" value="${usuario.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="editCpf">CPF:</label>
                        <input type="text" id="editCpf" name="cpf" value="${usuario.cpf}" maxlength="14" required>
                    </div>
                    <div class="form-group">
                        <label for="editDataNascimento">Data de Nascimento:</label>
                        <input type="date" id="editDataNascimento" name="dataNascimento" value="${usuario.dataNascimento}" required>
                    </div>
                    <div class="form-group">
                        <label for="editTelefone">Telefone:</label>
                        <input type="tel" id="editTelefone" name="telefone" value="${usuario.telefone || ''}" maxlength="15">
                    </div>
                    ${camposEspecificosForm}
                    <button type="submit">Salvar Alterações</button>
                </form>
            </div>
        `;
        mainModal.style.display = 'flex'; // Exibe o modal

        // Adiciona event listeners para fechar o modal
        document.querySelector('#mainModal .close-button').onclick = () => mainModal.style.display = 'none';
        mainModal.onclick = (e) => {
            if (e.target === mainModal) {
                mainModal.style.display = 'none';
            }
        };

        // Adiciona event listener para o formulário de edição
        const editForm = document.getElementById('editUsuarioForm');
        editForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário

            const updatedData = {};
            // Coleta os dados do formulário de edição
            new FormData(editForm).forEach((value, key) => {
                // Não queremos que o tipo de usuário seja alterado na edição, pois ele é "disabled"
                if (key !== 'tipoUsuario') {
                    updatedData[key] = value;
                }
            });

            // Atualiza o objeto do usuário no array
            Object.assign(usuariosCadastrados[usuarioIndex], updatedData);

            localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados)); // Salva as alterações
            renderizarRegistros(); // Re-renderiza a lista para mostrar as alterações
            mainModal.style.display = 'none'; // Fecha o modal
            alert('Usuário atualizado com sucesso!');
        });
    }

    // Função para alternar o status do usuário (ativo/inativo)
    function toggleStatusUsuario(id) {
        const usuarioIndex = usuariosCadastrados.findIndex(u => u.id === id);
        if (usuarioIndex === -1) return;

        const usuario = usuariosCadastrados[usuarioIndex];
        const acao = usuario.ativo ? 'inativar' : 'ativar'; // Determina a ação com base no status atual

        // Confirmação para o usuário
        if (confirm(`Tem certeza que deseja ${acao} o usuário ${usuario.nomeCompleto}?`)) {
            usuario.ativo = !usuario.ativo; // Inverte o status
            localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados)); // Salva no LocalStorage
            renderizarRegistros(); // Re-renderiza a lista para atualizar o status e o ícone/texto do botão
            alert(`Usuário ${usuario.nomeCompleto} foi ${acao}do com sucesso!`);
        }
    }

    // Renderizar registros na primeira carga da página
    renderizarRegistros();
});