// js/professor-contato.js

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const subjectInput = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    const messageSentParagraph = document.getElementById('messageSent');

    // Lógica para destacar o item de navegação "Contato"
    const navItems = document.querySelectorAll('.nav-item');
    const currentPageNav = 'contato'; // Define a página atual para "Contato"

    navItems.forEach(item => {
        if (item.getAttribute('data-page') === currentPageNav) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const subject = subjectInput.value.trim();
        const message = messageTextarea.value.trim();

        if (!subject || !message) {
            messageSentParagraph.textContent = 'Por favor, preencha todos os campos.';
            messageSentParagraph.style.color = 'red';
            return;
        }

        // Simula o envio da mensagem
        console.log('Mensagem enviada (simulação):', {
            subject: subject,
            message: message
        });

        messageSentParagraph.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
        messageSentParagraph.style.color = 'green';

        // Limpa o formulário
        subjectInput.value = '';
        messageTextarea.value = '';

        // Opcional: Esconde a mensagem após alguns segundos
        setTimeout(() => {
            messageSentParagraph.textContent = '';
        }, 5000);
    });
});