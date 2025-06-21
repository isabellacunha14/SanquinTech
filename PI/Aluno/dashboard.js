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

    // --- Lógica do Calendário de Eventos (Dashboard do Aluno) ---

const calendarBody = document.getElementById('calendarBody');
const lessonDetailModal = document.getElementById('lessonDetailModal');
const closeButton = lessonDetailModal ? lessonDetailModal.querySelector('.close-button') : null;

// Elementos do modal de detalhes
const modalSubject = document.getElementById('modalSubject');
const modalClass = document.getElementById('modalClass');
const modalRoom = document.getElementById('modalRoom');
const modalTopic = document.getElementById('modalTopic');
const modalNotes = document.getElementById('modalNotes');
const modalTime = document.getElementById('modalTime');
const modalDay = document.getElementById('modalDay');


// Dados FICTÍCIOS do horário do ALUNO
// Você substituirá isso por dados reais vindo do seu backend/API
const studentScheduleData = [
    {
        day: 'seg',
        time: '08:00',
        subject: 'Matemática',
        class: 'Turma B',
        room: 'Sala 101',
        topic: 'Álgebra Linear',
        notes: 'Revisar capítulos 1 e 2. Trazer calculadora.'
    },
    {
        day: 'seg',
        time: '10:00',
        subject: 'Português',
        class: 'Turma B',
        room: 'Sala 202',
        topic: 'Interpretação de Textos',
        notes: 'Leitura obrigatória do conto "O Cortiço".'
    },
    {
        day: 'ter',
        time: '09:00',
        subject: 'História',
        class: 'Turma B',
        room: 'Sala 301',
        topic: 'Revolução Francesa',
        notes: 'Fazer o mapa conceitual.'
    },
    {
        day: 'ter',
        time: '11:00',
        subject: 'Ciências',
        class: 'Turma B',
        room: 'Laboratório de Ciências',
        topic: 'Sistema Digestório',
        notes: 'Experimento prático.'
    },
    {
        day: 'qua',
        time: '08:00',
        subject: 'Inglês',
        class: 'Turma B',
        room: 'Sala 103',
        topic: 'Grammar: Past Simple',
        notes: 'Praticar com os exercícios do livro.'
    },
    {
        day: 'qui',
        time: '14:00',
        subject: 'Educação Física',
        class: 'Turma B',
        room: 'Quadra Esportiva',
        topic: 'Basquete',
        notes: 'Trazer uniforme.'
    },
    {
        day: 'sex',
        time: '13:00',
        subject: 'Geografia',
        class: 'Turma B',
        room: 'Sala 201',
        topic: 'Climas do Brasil',
        notes: 'Pesquisar sobre o clima da sua região.'
    }
    // Adicione mais eventos aqui conforme necessário
];


function populateStudentSchedule() {
    if (!calendarBody) return; // Garante que o elemento existe

    calendarBody.innerHTML = ''; // Limpa o calendário existente

    const daysOfWeek = ['seg', 'ter', 'qua', 'qui', 'sex'];
    const displayDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
    const hours = Array.from({ length: 17 }, (_, i) => 7 + i); // Das 07:00 às 23:00

    hours.forEach(hour => {
        const hourString = `${String(hour).padStart(2, '0')}:00`;
        const nextHourString = `${String(hour + 1).padStart(2, '0')}:00`;

        const calendarRow = document.createElement('div');
        calendarRow.classList.add('calendar-row');

        // Coluna de Horário
        const timeSlot = document.createElement('div');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = hourString;
        calendarRow.appendChild(timeSlot);

        daysOfWeek.forEach((day, index) => {
            const eventCell = document.createElement('div');
            eventCell.classList.add('event-cell');

            // Encontra eventos para este dia e horário
            const eventsForSlot = studentScheduleData.filter(event =>
                event.day === day && event.time === hourString
            );

            if (eventsForSlot.length > 0) {
                eventsForSlot.forEach(event => {
                    const eventCard = document.createElement('div');
                    eventCard.classList.add('event-card');
                    eventCard.classList.add(event.subject.toLowerCase().replace(/\s/g, '-')); // Adiciona classe para estilização por matéria

                    // Exibe apenas o tópico principal no card, ou a matéria se o tópico for muito longo
                    eventCard.innerHTML = `<strong>${event.topic || event.subject}</strong>`;
                    if (event.class) {
                        eventCard.innerHTML += `<small>${event.class}</small>`;
                    }


                    // Armazena todos os dados do evento no dataset do elemento para o modal
                    eventCard.dataset.subject = event.subject;
                    eventCard.dataset.class = event.class;
                    eventCard.dataset.room = event.room;
                    eventCard.dataset.topic = event.topic;
                    eventCard.dataset.notes = event.notes;
                    eventCard.dataset.time = event.time;
                    eventCard.dataset.day = displayDays[index]; // Nome completo do dia

                    eventCard.addEventListener('click', () => {
                        showLessonDetail(event); // Passa o objeto evento completo
                    });

                    eventCell.appendChild(eventCard);
                });
            }
            calendarRow.appendChild(eventCell);
        });
        calendarBody.appendChild(calendarRow);
    });
}

// Função para mostrar os detalhes da aula no modal
function showLessonDetail(eventData) {
    if (!lessonDetailModal) return;

    modalSubject.textContent = eventData.subject || 'N/A';
    modalClass.textContent = eventData.class || 'N/A';
    modalRoom.textContent = eventData.room || 'N/A';
    modalTopic.textContent = eventData.topic || 'N/A';
    modalNotes.textContent = eventData.notes || 'N/A';
    modalTime.textContent = eventData.time || 'N/A';
    // Encontra o nome completo do dia baseado na abreviação
    const dayIndex = ['seg', 'ter', 'qua', 'qui', 'sex'].indexOf(eventData.day);
    modalDay.textContent = dayIndex !== -1 ? ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'][dayIndex] : 'N/A';

    lessonDetailModal.classList.add('show');
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


// Chama a função para popular o calendário quando a página carrega
populateStudentSchedule();
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

    // Troca de senha
const changePasswordBtn = document.getElementById('alterarProfileBtn');
const passwordModal = document.getElementById('passwordModal');
const closePasswordModal = document.getElementById('closePasswordModal');
const passwordForm = document.getElementById('passwordForm');

if (changePasswordBtn && passwordModal && closePasswordModal && passwordForm) {
  changePasswordBtn.addEventListener('click', () => {
    passwordModal.classList.add('show');
  });

  closePasswordModal.addEventListener('click', () => {
    passwordModal.classList.remove('show');
  });

  window.addEventListener('click', (e) => {
    if (e.target === passwordModal) {
      passwordModal.classList.remove('show');
    }
  });

  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const nova = document.getElementById('newPassword').value;
    const confirmar = document.getElementById('confirmPassword').value;

    if (nova !== confirmar) {
      alert('As novas senhas não coincidem!');
      return;
    }

    // Simula envio
    console.log('Senha alterada:', { atual: current, nova });

    alert('Senha alterada com sucesso!');
    passwordModal.classList.remove('show');
    passwordForm.reset();
  });
}

});