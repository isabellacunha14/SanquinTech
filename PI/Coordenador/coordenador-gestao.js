// Função para alternar entre as abas de Cadastro e Consulta
        function showTab(tabId) {
    // Esconde todas as abas
    var tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
    });

    // Remove a classe 'active' de todos os botões
    var buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(function(button) {
        button.classList.remove('active');
    });

    // Exibe a aba clicada
    var selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Ativa o botão correspondente
    var clickedButton = document.querySelector('.tab-button[onclick="showTab(\'' + tabId + '\')"]');
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    // Se a aba for "cadastro", limpa os campos e reseta os formulários
    if (tabId === 'cadastro') {
        var funcaoSelect = document.getElementById('funcao');
        if (funcaoSelect) funcaoSelect.value = "";

        var formComum = document.getElementById("form-comum");
        var formProfessor = document.getElementById("form-professor");
        var formCoordenador = document.getElementById("form-coordenador");
        var formSecretario = document.getElementById("form-secretario");
        var formOutros = document.getElementById("form-outros");
        var botaoCadastroContainer = document.getElementById("botao-cadastro-container");
        var formSelectionContainer = document.querySelector(".form-selection-container");

        if (formComum) formComum.style.display = "none";
        if (formProfessor) formProfessor.style.display = "none";
        if (formCoordenador) formCoordenador.style.display = "none";
        if (formSecretario) formSecretario.style.display = "none";
        if (formOutros) formOutros.style.display = "none";
        if (botaoCadastroContainer) botaoCadastroContainer.style.display = "none";
        if (formSelectionContainer) formSelectionContainer.style.display = "block";
    }
}


        // Função para exibir/ocultar campos do formulário de função
        function exibirFormularioFuncao() {
            var funcaoSelecionada = document.getElementById("funcao").value;
            var formSelectionContainer = document.querySelector(".form-selection-container");
            var formComum = document.getElementById("form-comum");
            var formProfessor = document.getElementById("form-professor");
            var formCoordenador = document.getElementById("form-coordenador");
            var formSecretario = document.getElementById("form-secretario");
            var formOutros = document.getElementById("form-outros");
            var botaoCadastroContainer = document.getElementById("botao-cadastro-container");

            // Oculta todos os formulários específicos e o botão de cadastro
            formComum.style.display = "none";
            formProfessor.style.display = "none";
            formCoordenador.style.display = "none";
            formSecretario.style.display = "none";
            formOutros.style.display = "none";
            botaoCadastroContainer.style.display = "none";

            // Oculta o container do select de função
            formSelectionContainer.style.display = "none";

            // Exibe o formulário comum e o específico, se uma função válida for selecionada
            if (funcaoSelecionada !== "") {
                formComum.style.display = "block"; // Mostra sempre os campos básicos
                botaoCadastroContainer.style.display = "block"; // Mostra o botão de cadastro

                switch (funcaoSelecionada) {
                    case "professor":
                        formProfessor.style.display = "block";
                        break;
                    case "coordenador":
                        formCoordenador.style.display = "block";
                        break;
                    case "secretario":
                        formSecretario.style.display = "block";
                        break;
                    case "outros_funcionarios":
                        formOutros.style.display = "block";
                        break;
                }
            } else {
                // Se nenhuma função for selecionada (voltar para a opção vazia), mostra o select novamente
                formSelectionContainer.style.display = "block";
            }
        }


document.addEventListener('DOMContentLoaded', () => {
    // --- Get all your elements (existing and new ones) ---
    const collaboratorTypeSelect = document.getElementById('collaboratorType');
    const searchTypeSelect = document.getElementById('searchType');
    const searchTermInput = document.getElementById('searchTerm');
    const periodSearchGroup = document.getElementById('periodSearchGroup');
    const periodSearchTermInput = document.getElementById('periodSearchTerm');
    const searchButton = document.getElementById('searchBtn');

    const profileDashboard = document.querySelector('.profile-dashboard');

    // References to the DIFFERENT academic info sections
    const academicInfoStudent = document.getElementById('academicInfoStudent');
    const academicInfoEmployee = document.getElementById('academicInfoEmployee');
    const academicInfoProfessor = document.getElementById('academicInfoProfessor');

    // Personal Info Input Fields (these remain the same for all types)
    const dobInput = document.getElementById('dob');
    const cpfInput = document.getElementById('cpf');
    const rgInput = document.getElementById('rg');
    const addressInput = document.getElementById('address');
    const districtInput = document.getElementById('district');
    const cityInput = document.getElementById('city');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    // "Editar Perfil" and "Salvar" buttons and form inputs
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const personalInfoForm = document.getElementById('personalInfoForm');
    const personalInfoInputs = personalInfoForm.querySelectorAll('input:not([type="submit"]):not([type="button"])');

    // --- Helper function to hide all academic info sections ---
    function hideAllAcademicInfoSections() {
        academicInfoStudent.style.display = 'none';
        academicInfoEmployee.style.display = 'none';
        academicInfoProfessor.style.display = 'none';
    }

    // --- Function to clear current profile display and hide the dashboard ---
    function clearAndHideProfileDisplay() {
        // Clear all academic info paragraphs
        academicInfoStudent.querySelectorAll('p').forEach(p => p.innerHTML = p.innerHTML.split(':')[0] + ':');
        academicInfoEmployee.querySelectorAll('p').forEach(p => p.innerHTML = p.innerHTML.split(':')[0] + ':');
        academicInfoProfessor.querySelectorAll('p').forEach(p => p.innerHTML = p.innerHTML.split(':')[0] + ':');

        // Clear personal info inputs
        dobInput.value = '';
        cpfInput.value = '';
        rgInput.value = '';
        addressInput.value = '';
        districtInput.value = '';
        cityInput.value = '';
        phoneInput.value = '';
        emailInput.value = '';

        // Hide all academic info sections
        hideAllAcademicInfoSections();

        // Hide the entire profile dashboard
        profileDashboard.style.display = 'none';

        // Also ensure inputs are read-only and buttons are in correct state
        personalInfoInputs.forEach(input => {
            input.readOnly = true;
        });
        saveProfileBtn.disabled = true;
        editProfileBtn.disabled = false;
    }

    // --- Initial setup: hide profile when page loads ---
    clearAndHideProfileDisplay();

    // --- Event listener for the "Buscar por" select to show/hide Period field ---
    searchTypeSelect.addEventListener('change', () => {
        if (searchTypeSelect.value === 'curso') {
            periodSearchGroup.style.display = 'block'; // or 'flex' based on your CSS
        } else {
            periodSearchGroup.style.display = 'none';
            periodSearchTermInput.value = ''; // Clear the period input when hidden
        }
    });

    // --- Event listener for the "Buscar" button ---
    searchButton.addEventListener('click', async () => {
        const selectedCollaboratorType = collaboratorTypeSelect.value; // Get the selected type from the filter
        const searchType = searchTypeSelect.value;
        const searchTerm = searchTermInput.value.trim();
        let periodSearchTerm = '';

        if (searchType === 'curso') {
            periodSearchTerm = periodSearchTermInput.value.trim();
            if (!searchTerm && !periodSearchTerm) {
                 alert('Por favor, digite o curso e/ou o período.');
                 return;
            }
        } else if (!searchTerm) {
            alert('Por favor, digite um termo de busca.');
            return;
        }

        // Clear and hide previous results before fetching new ones
        clearAndHideProfileDisplay();

        try {
            // --- Simulate API call (replace with your actual backend fetch) ---
            // You will need your backend to return the 'type' of collaborator (student, employee, professor)
            // along with their specific data.
            let apiUrl = `/api/collaborators?collaboratorType=${selectedCollaboratorType}&searchType=${searchType}&searchTerm=${searchTerm}`;

            if (searchType === 'curso' && periodSearchTerm) {
                apiUrl += `&period=${periodSearchTerm}`;
            }

            console.log("Fetching from API:", apiUrl); // For debugging
            const response = await fetch(apiUrl);

            if (!response.ok) {
                if (response.status === 404) {
                    alert('Nenhum colaborador encontrado com os critérios fornecidos.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // Data should include a 'type' field (e.g., 'student', 'employee', 'professor')

            if (data && data.name && data.type) { // Ensure data has a name and type
                // --- Populate Personal Info (common for all types) ---
                dobInput.value = data.dob || '';
                cpfInput.value = data.cpf || '';
                rgInput.value = data.rg || '';
                addressInput.value = data.address || '';
                districtInput.value = data.district || '';
                cityInput.value = data.city || '';
                phoneInput.value = data.phone || '';
                emailInput.value = data.email || '';

                // --- Handle Academic/Professional Info based on type ---
                hideAllAcademicInfoSections(); // Hide all first

                if (data.type === 'student') {
                    academicInfoStudent.style.display = 'block'; // Or 'flex'
                    academicInfoStudent.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Nome:</strong> ${data.name}`;
                    academicInfoStudent.querySelector('p:nth-of-type(2)').innerHTML = `<strong>Matrícula:</strong> ${data.matricula || 'N/A'}`;
                    academicInfoStudent.querySelector('p:nth-of-type(3)').innerHTML = `<strong>RA:</strong> ${data.ra || 'N/A'}`;
                    academicInfoStudent.querySelector('p:nth-of-type(4)').innerHTML = `<strong>Curso:</strong> ${data.curso || 'N/A'}`;
                    academicInfoStudent.querySelector('p:nth-of-type(5)').innerHTML = `<strong>Período:</strong> ${data.periodo || 'N/A'}`;
                } else if (data.type === 'employee') {
                    academicInfoEmployee.style.display = 'block'; // Or 'flex'
                    academicInfoEmployee.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Nome:</strong> ${data.name}`;
                    academicInfoEmployee.querySelector('p:nth-of-type(2)').innerHTML = `<strong>Matrícula:</strong> ${data.matricula || 'N/A'}`; // Assuming employees also have a matrícula or ID
                    academicInfoEmployee.querySelector('p:nth-of-type(3)').innerHTML = `<strong>Cargo:</strong> ${data.cargo || 'N/A'}`;
                    academicInfoEmployee.querySelector('p:nth-of-type(4)').innerHTML = `<strong>Departamento:</strong> ${data.departamento || 'N/A'}`;
                    academicInfoEmployee.querySelector('p:nth-of-type(5)').innerHTML = `<strong>Data de Contratação:</strong> ${data.dataContratacao || 'N/A'}`;
                } else if (data.type === 'professor') {
                    academicInfoProfessor.style.display = 'block'; // Or 'flex'
                    academicInfoProfessor.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Nome:</strong> ${data.name}`;
                    academicInfoProfessor.querySelector('p:nth-of-type(2)').innerHTML = `<strong>Matrícula:</strong> ${data.matricula || 'N/A'}`; // Assuming professors also have a matrícula or ID
                    academicInfoProfessor.querySelector('p:nth-of-type(3)').innerHTML = `<strong>Titulação:</strong> ${data.titulacao || 'N/A'}`;
                    academicInfoProfessor.querySelector('p:nth-of-type(4)').innerHTML = `<strong>Área de Especialização:</strong> ${data.areaEspecializacao || 'N/A'}`;
                    academicInfoProfessor.querySelector('p:nth-of-type(5)').innerHTML = `<strong>Disciplinas Lecionadas:</strong> ${data.disciplinasLecionadas || 'N/A'}`;
                } else {
                    // Fallback if type is not recognized
                    console.warn('Tipo de colaborador desconhecido:', data.type);
                    alert('Tipo de colaborador desconhecido recebido.');
                    clearAndHideProfileDisplay();
                    return;
                }

                profileDashboard.style.display = 'flex'; // Make the entire dashboard visible
            } else {
                alert('Nenhum colaborador encontrado com os critérios fornecidos.');
            }
        } catch (error) {
            console.error('Erro ao buscar colaborador:', error);
            alert('Ocorreu um erro ao buscar o colaborador. Tente novamente.');
        }
    });

    // --- Existing JavaScript for "Editar Perfil" and "Salvar" buttons ---
    editProfileBtn.addEventListener('click', () => {
        personalInfoInputs.forEach(input => {
            input.readOnly = false;
        });
        saveProfileBtn.disabled = false;
        editProfileBtn.disabled = true;
    });

    personalInfoForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        // Here, you would typically send the updated data to your backend
        alert('Dados do perfil salvos!'); // Placeholder for actual save logic
        personalInfoInputs.forEach(input => {
            input.readOnly = true;
        });
        saveProfileBtn.disabled = true;
        editProfileBtn.disabled = false;
    });
});

const collaboratorsData = [
    {
        type: "student",
        name: "João da Silva",
        matricula: "123456",
        ra: "987654321",
        curso: "Análise e Desenvolvimento de Sistemas",
        periodo: "3º Semestre",
        dob: "2000-01-15",
        cpf: "123.456.789-00",
        rg: "98.765.432-1",
        address: "Rua das Flores, 123",
        district: "Centro",
        city: "Mogi Mirim",
        phone: "(19) 98765-4321",
        email: "joao.silva@aluno.sanquimtech.com"
    },
    {
        type: "employee",
        name: "Ana Paula Mendes",
        matricula: "EMP002",
        cargo: "Gerente de Projetos",
        departamento: "TI",
        dataContratacao: "2018-05-01",
        dob: "1980-10-20",
        cpf: "222.333.444-55",
        rg: "11.223.344-5",
        address: "Av. Paulista, 1000",
        district: "Vila Mariana",
        city: "São Paulo",
        phone: "(11) 97777-6666",
        email: "ana.mendes@sanquimtech.com"
    },
    // Adicione mais objetos de colaborador aqui
];

// Então, no seu manipulador de clique do botão de busca, você filtraria este array:
searchButton.addEventListener('click', () => {
    // ... obter searchType, searchTerm, etc.
    const foundCollaborator = collaboratorsData.find(col => {
        // Implemente sua lógica de filtragem aqui
        // Exemplo:
        if (searchType === 'name' && col.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
        }
        // Adicione outros tipos de busca
        return false;
    });

    if (foundCollaborator) {
        // Preencha os campos com os dados de foundCollaborator
        profileDashboard.style.display = 'flex';
    } else {
        clearAndHideProfileDisplay();
        alert('Nenhum colaborador encontrado.');
    }
});