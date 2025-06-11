document.addEventListener('DOMContentLoaded', () => {
    const tipoMaterialSelect = document.getElementById('tipoMaterial');
    const camposTipoMaterialDiv = document.getElementById('camposTipoMaterial');
    const cadastroMaterialForm = document.getElementById('cadastroMaterialForm');
    const materiaisCadastradosDiv = document.getElementById('materiaisCadastrados');
    const mainModal = document.getElementById('mainModal');

    // Array para armazenar os materiais cadastrados
    let materiais = JSON.parse(localStorage.getItem('materiaisBiblioteca')) || [];

    // Função para exibir campos adicionais com base no tipo de material
    function exibirCamposTipoMaterial(tipo, valoresAtuais = {}) {
        camposTipoMaterialDiv.innerHTML = '';
        if (tipo === 'arquivo') {
            camposTipoMaterialDiv.innerHTML = `
                <div class="form-group">
                    <label for="arquivoMaterial">Selecionar Arquivo:</label>
                    <input type="file" id="arquivoMaterial" name="arquivoMaterial" required>
                    ${valoresAtuais.nomeArquivo ? `<p>Arquivo atual: <strong>${valoresAtuais.nomeArquivo}</strong></p>` : ''}
                </div>
            `;
        } else if (tipo === 'url') {
            camposTipoMaterialDiv.innerHTML = `
                <div class="form-group">
                    <label for="urlMaterial">URL do Material:</label>
                    <input type="url" id="urlMaterial" name="urlMaterial" placeholder="Ex: https://youtube.com/watch?v=video" value="${valoresAtuais.urlMaterial || ''}" required>
                </div>
            `;
        }
    }

    // Renderiza os materiais cadastrados na lista
    function renderizarMateriais() {
        materiaisCadastradosDiv.innerHTML = ''; // Limpa a lista existente

        if (materiais.length === 0) {
            materiaisCadastradosDiv.innerHTML = '<p class="no-records-message">Nenhum material cadastrado ainda.</p>';
            return;
        }

        // Agrupar por tipo de material para melhor organização (opcional)
        const grupos = {
            arquivo: [],
            url: []
        };
        materiais.forEach(material => {
            grupos[material.tipoMaterial].push(material);
        });

        // Tipos na ordem desejada
        const tiposOrdenados = ['arquivo', 'url'];

        tiposOrdenados.forEach(tipo => {
            const materiaisDoTipo = grupos[tipo];
            const nomeTipoDisplay = tipo === 'arquivo' ? 'Arquivos' : 'Links/URLs';
            const iconTipo = tipo === 'arquivo' ? 'fas fa-file-alt' : 'fas fa-link';


            if (materiaisDoTipo.length > 0) {
                const grupoDiv = document.createElement('div');
                grupoDiv.classList.add('registro-group'); // Reutilizando classe de grupo
                grupoDiv.dataset.tipo = tipo;

                const header = document.createElement('div');
                header.classList.add('registro-group-header'); // Reutilizando classe de header
                header.innerHTML = `
                    <i class="${iconTipo}"></i> ${nomeTipoDisplay} (${materiaisDoTipo.length})
                    <i class="fas fa-chevron-right toggle-icon"></i>
                `;
                grupoDiv.appendChild(header);

                const content = document.createElement('div');
                content.classList.add('registro-group-content'); // Reutilizando classe de content
                grupoDiv.appendChild(content);

                materiaisDoTipo.forEach(material => {
                    const materialItem = document.createElement('div');
                    materialItem.classList.add('registro-item-material'); // Nova classe para item de material
                    materialItem.dataset.id = material.id;

                    let iconeMaterial = '';
                    let infoConteudo = '';
                    let acaoAbrirBtn = '';

                    if (material.tipoMaterial === 'arquivo') {
                        iconeMaterial = 'fas fa-file-pdf'; // Ícone genérico para arquivo, pode ser mais específico
                        infoConteudo = `Nome do Arquivo: ${material.nomeArquivo}`;
                        // Em um sistema real, o btn-abrir-material faria o download.
                        // Aqui é apenas um placeholder.
                        acaoAbrirBtn = `<button class="btn-abrir-material" data-id="${material.id}" title="Simular Download"><i class="fas fa-download"></i> Download</button>`;
                    } else if (material.tipoMaterial === 'url') {
                        iconeMaterial = 'fas fa-external-link-alt';
                        infoConteudo = `URL: ${material.urlMaterial}`;
                        acaoAbrirBtn = `<button class="btn-abrir-material" data-id="${material.id}" title="Abrir Link"><i class="fas fa-external-link-alt"></i> Abrir</button>`;
                    }

                    materialItem.innerHTML = `
                        <div class="material-info">
                            <h3><i class="${iconeMaterial}"></i> ${material.titulo}</h3>
                            <p>${material.descricao || 'Sem descrição.'}</p>
                            <p>${infoConteudo}</p>
                        </div>
                        <div class="material-actions">
                            ${acaoAbrirBtn}
                            <button class="btn-editar-material" data-id="${material.id}" title="Editar Material"><i class="fas fa-edit"></i> Editar</button>
                            <button class="btn-excluir-material" data-id="${material.id}" title="Excluir Material"><i class="fas fa-trash"></i> Excluir</button>
                        </div>
                    `;
                    content.appendChild(materialItem);
                });
                registrosCadastradosDiv.appendChild(grupoDiv);
            }
        });
        adicionarEventListenersAcoes();
    }

    // Adiciona event listeners para os botões de ação e cabeçalhos de grupo
    function adicionarEventListenersAcoes() {
        // Event listener para expandir/colapsar o grupo de registros
        document.querySelectorAll('.registro-group-header').forEach(header => {
            header.removeEventListener('click', toggleExpandirGrupo); // Evita múltiplos listeners
            header.addEventListener('click', toggleExpandirGrupo);
        });

        // Delegação de eventos para os botões de ação
        registrosCadastradosDiv.removeEventListener('click', handleActionClickDelegated);
        registrosCadastradosDiv.addEventListener('click', handleActionClickDelegated);
    }

    // Função para lidar com o clique nos botões de ação (abrir, editar, excluir)
    function handleActionClickDelegated(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        if (target.classList.contains('btn-abrir-material')) {
            abrirMaterial(id);
        } else if (target.classList.contains('btn-editar-material')) {
            editarMaterial(id);
        } else if (target.classList.contains('btn-excluir-material')) {
            excluirMaterial(id);
        }
    }

    // Função para expandir/colapsar o conteúdo de um grupo de registros
    function toggleExpandirGrupo() {
        this.classList.toggle('expanded');
        const content = this.nextElementSibling;
    }

    // Event listener para o select de tipo de material no formulário de cadastro
    tipoMaterialSelect.addEventListener('change', (event) => {
        exibirCamposTipoMaterial(event.target.value);
    });

    // Event listener para o submit do formulário de cadastro
    cadastroMaterialForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const titulo = document.getElementById('tituloMaterial').value.trim();
        const tipo = tipoMaterialSelect.value;
        const descricao = document.getElementById('descricaoMaterial').value.trim();

        if (!titulo || !tipo) {
            alert('Por favor, preencha o título e selecione o tipo de material.');
            return;
        }

        const novoMaterial = {
            id: Date.now().toString(),
            titulo: titulo,
            tipoMaterial: tipo,
            descricao: descricao
        };

        if (tipo === 'arquivo') {
            const arquivoInput = document.getElementById('arquivoMaterial');
            if (arquivoInput.files.length === 0) {
                alert('Por favor, selecione um arquivo.');
                return;
            }
            // Apenas salvamos o nome do arquivo, não o conteúdo binário no localStorage
            novoMaterial.nomeArquivo = arquivoInput.files[0].name;
            // Em um ambiente real, você faria o upload do arquivo para um servidor aqui
            // e armazenaria a URL ou ID do arquivo retornado pelo servidor.
            alert('Arquivo: O upload real ocorreria em um servidor.');

        } else if (tipo === 'url') {
            const urlInput = document.getElementById('urlMaterial');
            if (!urlInput.value.trim()) {
                alert('Por favor, insira a URL do material.');
                return;
            }
            novoMaterial.urlMaterial = urlInput.value.trim();
        }

        materiais.push(novoMaterial);
        localStorage.setItem('materiaisBiblioteca', JSON.stringify(materiais));
        renderizarMateriais();

        cadastroMaterialForm.reset();
        camposTipoMaterialDiv.innerHTML = ''; // Limpa campos adicionais
        tipoMaterialSelect.value = ''; // Reseta o select
        alert('Material adicionado à biblioteca com sucesso!');
    });

    // Funções de Modal (Abrir, Visualizar/Editar, Excluir)

    function abrirMaterial(id) {
        const material = materiais.find(m => m.id === id);
        if (!material) return;

        if (material.tipoMaterial === 'arquivo') {
            alert(`Simulando download de: ${material.nomeArquivo}\n\nEm um sistema real, o arquivo seria baixado.`);
            // Em um sistema real, você faria window.open(URL_DO_ARQUIVO_NO_SERVIDOR, '_blank');
        } else if (material.tipoMaterial === 'url') {
            window.open(material.urlMaterial, '_blank');
        }
    }

    function editarMaterial(id) {
        const materialIndex = materiais.findIndex(m => m.id === id);
        if (materialIndex === -1) return;

        const material = materiais[materialIndex];

        let camposEspecificosForm = '';
        if (material.tipoMaterial === 'arquivo') {
            camposEspecificosForm = `
                <div class="form-group">
                    <label for="editArquivoMaterial">Selecionar Novo Arquivo (opcional):</label>
                    <input type="file" id="editArquivoMaterial" name="arquivoMaterial">
                    <p>Arquivo atual: <strong>${material.nomeArquivo || 'Nenhum'}</strong></p>
                    <small>Selecione um novo arquivo apenas se quiser substituí-lo.</small>
                </div>
            `;
        } else if (material.tipoMaterial === 'url') {
            camposEspecificosForm = `
                <div class="form-group">
                    <label for="editUrlMaterial">URL do Material:</label>
                    <input type="url" id="editUrlMaterial" name="urlMaterial" value="${material.urlMaterial || ''}" required>
                </div>
            `;
        }

        mainModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">×</span>
                <h2>Editar Material: ${material.titulo}</h2>
                <form id="editMaterialForm" class="modal-form">
                    <div class="form-group">
                        <label for="editTituloMaterial">Título do Material:</label>
                        <input type="text" id="editTituloMaterial" name="tituloMaterial" value="${material.titulo}" required>
                    </div>
                    <div class="form-group">
                        <label for="editTipoMaterial">Tipo de Material:</label>
                        <input type="text" id="editTipoMaterial" value="${material.tipoMaterial === 'arquivo' ? 'Arquivo' : 'Link / URL'}" disabled>
                        <input type="hidden" name="tipoMaterial" value="${material.tipoMaterial}"> </div>
                    ${camposEspecificosForm}
                    <div class="form-group">
                        <label for="editDescricaoMaterial">Descrição (opcional):</label>
                        <textarea id="editDescricaoMaterial" name="descricaoMaterial">${material.descricao || ''}</textarea>
                    </div>
                    <button type="submit" class="btn-submit">Salvar Alterações</button>
                </form>
            </div>
        `;
        mainModal.style.display = 'flex';

        document.querySelector('#mainModal .close-button').onclick = () => mainModal.style.display = 'none';
        mainModal.onclick = (e) => {
            if (e.target === mainModal) {
                mainModal.style.display = 'none';
            }
        };

        const editForm = document.getElementById('editMaterialForm');
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            material.titulo = document.getElementById('editTituloMaterial').value.trim();
            material.descricao = document.getElementById('editDescricaoMaterial').value.trim();

            if (material.tipoMaterial === 'arquivo') {
                const editArquivoInput = document.getElementById('editArquivoMaterial');
                if (editArquivoInput.files.length > 0) {
                    // Se um novo arquivo foi selecionado, atualiza o nome.
                    // Em um sistema real, você faria o upload do novo arquivo e atualizaria a URL/ID.
                    material.nomeArquivo = editArquivoInput.files[0].name;
                    alert('Arquivo: O upload real do novo arquivo ocorreria em um servidor.');
                }
            } else if (material.tipoMaterial === 'url') {
                material.urlMaterial = document.getElementById('editUrlMaterial').value.trim();
            }

            localStorage.setItem('materiaisBiblioteca', JSON.stringify(materiais));
            renderizarMateriais();
            mainModal.style.display = 'none';
            alert('Material atualizado com sucesso!');
        });
    }

    function excluirMaterial(id) {
        if (confirm('Tem certeza que deseja EXCLUIR este material da biblioteca?')) {
            materiais = materiais.filter(m => m.id !== id);
            localStorage.setItem('materiaisBiblioteca', JSON.stringify(materiais));
            renderizarMateriais();
            alert('Material excluído com sucesso!');
        }
    }

    // Inicializa a renderização dos registros ao carregar a página
    renderizarMateriais();
});