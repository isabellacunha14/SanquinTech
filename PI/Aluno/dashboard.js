document.addEventListener('DOMContentLoaded', () => {
    // 1. Destaque do menu na barra de navegação
    const navItems = document.querySelectorAll('.nav-item');

    // Função para ativar o item de menu correto
    function activateMenuItem(pageName) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });
    }

    // Lógica para ativar o menu ao carregar a página
    // Pega o nome do arquivo HTML atual (ex: "perfil" de "perfil.html")
    const currentPagePath = window.location.pathname;
    const currentPageName = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1).split('.')[0];
    if (currentPageName) {
        activateMenuItem(currentPageName);
    } else {
        // Se for a raiz (index.html), ativa "inicio"
        activateMenuItem('inicio');
    }


    // Lógica para ativar o menu ao clicar (para navegação SPA se for implementada)
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // event.preventDefault(); // Comente ou remova se você quiser que o link leve à página real
                                    // Se você quiser SPA (Single Page Application), mantenha.

            const page = item.dataset.page;
            // Se você quer que a página seja recarregada (navegação tradicional):
            if (page !== 'sair') { // O link "sair" geralmente não recarrega uma nova página HTML
                window.location.href = `${page}.html`; // Redireciona para a página correspondente
            } else {
                // Lógica de logout aqui
                alert('Você clicou em Sair!');
                window.location.href = '../Login/login.html';
            }


            // Se você MANTIVER event.preventDefault() para SPA, descomente:
            // activateMenuItem(page);
            // loadContent(page); // Sua função para carregar conteúdo dinamicamente
            // console.log(`Navegou para: ${item.dataset.page}`);
        });
    });

    // 2. Quadro de Avisos (A barra de rolagem já é nativa do CSS com overflow-y: auto)
    // Se precisar de alguma funcionalidade JS para carregar mais avisos (lazy loading),
    // ou filtrar, seria adicionado aqui.

// Adaptação para o Carrossel e Calendário:
    // Envolva a lógica do carrossel e do calendário em uma verificação
    const carouselContainer = document.querySelector('.carousel-container');
    const calendarContainer = document.querySelector('.calendar-container');

    if (carouselContainer) { // Se o carrossel existe na página
        // Lógica do carrossel aqui
        const carouselSlides = document.querySelector('.carousel-slides');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        const indicators = document.querySelectorAll('.indicator');

        let currentSlide = 0;
        const totalSlides = slides.length;

        function showSlide(index) {
            if (index >= totalSlides) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = totalSlides - 1;
            } else {
                currentSlide = index;
            }

            const offset = -currentSlide * 100;
            carouselSlides.style.transform = `translateX(${offset}%)`;

            indicators.forEach((indicator, i) => {
                if (i === currentSlide) {
                    indicator.classList.add('active-indicator');
                } else {
                    indicator.classList.remove('active-indicator');
                }
            });
        }
        // Opcional: Carrossel automático
    let autoSlideInterval = setInterval(() => {
         showSlide(currentSlide + 1);
    }, 5000); // Muda de slide a cada 5 segundos

    // //Pausar carrossel ao passar o mouse
    carouselContainer.addEventListener('mouseenter', () => {
         clearInterval(autoSlideInterval);
    });
    carouselContainer.addEventListener('mouseleave', () => {
         autoSlideInterval = setInterval(() => {
             showSlide(currentSlide + 1);
         }, 5000);
    });

        prevButton.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });

        nextButton.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });

        indicators.forEach(indicator => {
            indicator.addEventListener('click', (event) => {
                const slideIndex = parseInt(event.target.dataset.slideIndex);
                showSlide(slideIndex);
            });
        });
        showSlide(0);
    }

    if (calendarContainer) { // Se o calendário existe na página
        // Lógica do calendário aqui
        const eventSlots = document.querySelectorAll('.event-slot');
        eventSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                const day = slot.dataset.day;
                const time = slot.dataset.time;

                if (slot.classList.contains('event')) {
                    if (confirm(`Remover evento "${slot.textContent}" de ${day} às ${time}?`)) {
                        slot.classList.remove('event');
                        slot.textContent = '';
                        slot.className = 'event-slot';
                        slot.setAttribute('data-time', time);
                        slot.setAttribute('data-day', day);
                        console.log(`Evento removido de ${day} às ${time}`);
                    }
                } else {
                    const eventText = prompt(`Criar evento para ${day} às ${time}. Digite o nome do evento:`);
                    if (eventText) {
                        slot.classList.add('event');
                        slot.textContent = eventText;
                        console.log(`Evento criado: ${eventText} em ${day} às ${time}`);
                    }
                }
            });
        });
    }

// Lógica para a página de perfil
    const personalInfoForm = document.getElementById('personalInfoForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    // CORREÇÃO AQUI: Seleciona TODOS os inputs dentro do formulário.
    const formInputs = personalInfoForm ? personalInfoForm.querySelectorAll('input') : [];

    if (personalInfoForm && editProfileBtn && saveProfileBtn) {
        // Função para habilitar/desabilitar campos
        function toggleEditMode(enable) {
            formInputs.forEach(input => {
                // Apenas remova/adicione 'readonly' se o campo não for CPF ou RG
                if (input.id !== 'cpf' && input.id !== 'rg') {
                    if (enable) {
                        input.removeAttribute('readonly');
                        input.style.backgroundColor = '#fff'; // Retorna o fundo branco para editável
                    } else {
                        input.setAttribute('readonly', true);
                        input.style.backgroundColor = '#f9f9f9'; // Volta o fundo padrão para não editável
                    }
                }
            });

            if (enable) {
                editProfileBtn.disabled = true;
                saveProfileBtn.disabled = false;
            } else {
                editProfileBtn.disabled = false;
                saveProfileBtn.disabled = true;
            }
        }

        // Inicializa: Campos desabilitados e botão Salvar desabilitado
        toggleEditMode(false); // Chama com 'false' para garantir que estejam desabilitados ao carregar

        // Evento para o botão "Editar Perfil"
        editProfileBtn.addEventListener('click', () => {
            toggleEditMode(true); // Habilita a edição
            alert('Você pode editar suas informações pessoais agora.'); // Feedback para o usuário
        });

        // Evento para o botão "Salvar"
        personalInfoForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Aqui você coletaria os dados do formulário
            const dob = document.getElementById('dob').value;
            const address = document.getElementById('address').value;
            const district = document.getElementById('district').value;
            const city = document.getElementById('city').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;

            // Simule o salvamento dos dados
            console.log('Dados do perfil a serem salvos:', {
                dob,
                address,
                district,
                city,
                phone,
                email
            });

            alert('Informações pessoais salvas com sucesso!');

            // Após salvar, volte para o modo de visualização (campos readonly)
            toggleEditMode(false);
        });
    }
});