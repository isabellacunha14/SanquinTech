// js/professor-avisos.js

document.addEventListener('DOMContentLoaded', () => {
    const avisoTitleInput = document.getElementById('avisoTitle');
    const avisoDateInput = document.getElementById('avisoDate');
    const avisoContentTextarea = document.getElementById('avisoContent');
    const publicarAvisoBtn = document.getElementById('publicarAvisoBtn');
    const avisosListContainer = document.getElementById('avisosListContainer');

    // Inicializa a data com a data atual
    avisoDateInput.value = new Date().toISOString().split('T')[0];

    // Array para simular o armazenamento de avisos
    // Em um ambiente real, isso viria de um banco de dados
    let avisosPublicados = [];

    // Função para renderizar a lista de avisos
    function renderAvisosList() {
        if (avisosPublicados.length === 0) {
            avisosListContainer.innerHTML = '<p class="no-avisos-message">Nenhum aviso publicado ainda.</p>';
            return;
        }

        let avisosHtml = '';
        // Ordena avisos por data de publicação, do mais recente para o mais antigo
        const sortedAvisos = [...avisosPublicados].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedAvisos.forEach((aviso, index) => {
            avisosHtml += `
                <div class="aviso-card">
                    <div class="aviso-header">
                        <h4>${aviso.title}</h4>
                        <span class="aviso-date">${aviso.date}</span>
                    </div>
                    <p class="aviso-preview">${aviso.content.substring(0, 150)}...</p>
                    <div class="aviso-actions">
                        <button class="view-aviso-btn" data-index="${index}"><i class="fas fa-eye"></i> Visualizar</button>
                        <button class="delete-aviso-btn" data-index="${index}"><i class="fas fa-trash-alt"></i> Excluir</button>
                    </div>
                </div>
            `;
        });
        avisosListContainer.innerHTML = avisosHtml;

        // Adiciona listeners para os botões de visualizar e excluir
        document.querySelectorAll('.view-aviso-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.target.closest('.view-aviso-btn').dataset.index);
                const aviso = sortedAvisos[index]; // Usa o aviso do array ordenado
                alert(`Título: ${aviso.title}\nData: ${aviso.date}\n\nConteúdo:\n${aviso.content}`);
            });
        });

        document.querySelectorAll('.delete-aviso-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.target.closest('.delete-aviso-btn').dataset.index);
                if (confirm('Tem certeza que deseja excluir este aviso?')) {
                    // Encontra o aviso original no array não ordenado para remoção precisa
                    const avisoToDelete = sortedAvisos[index];
                    const originalIndex = avisosPublicados.findIndex(a => 
                        a.title === avisoToDelete.title && a.date === avisoToDelete.date && a.content === avisoToDelete.content
                    );
                    if (originalIndex > -1) {
                        avisosPublicados.splice(originalIndex, 1);
                        renderAvisosList(); // Redesenha a lista
                    }
                }
            });
        });
    }

    // Listener para o botão "Publicar Aviso"
    publicarAvisoBtn.addEventListener('click', () => {
        const title = avisoTitleInput.value.trim();
        const date = avisoDateInput.value;
        const content = avisoContentTextarea.value.trim();

        if (!title || !date || !content) {
            alert('Por favor, preencha todos os campos do aviso (Título, Data e Conteúdo).');
            return;
        }

        const novoAviso = {
            title: title,
            date: date,
            content: content
        };

        avisosPublicados.push(novoAviso);
        console.log('Novo aviso publicado (simulação):', novoAviso);
        alert('Aviso publicado com sucesso (simulação)!');

        // Limpa o formulário
        avisoTitleInput.value = '';
        avisoContentTextarea.value = '';
        avisoDateInput.value = new Date().toISOString().split('T')[0]; // Reseta para a data atual

        renderAvisosList(); // Atualiza a lista de avisos
    });

    // Renderiza a lista de avisos ao carregar a página
    renderAvisosList();
});