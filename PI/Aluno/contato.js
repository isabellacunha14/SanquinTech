document.addEventListener('DOMContentLoaded', () => {
const contactForm = document.getElementById('contactForm');
const messageSent = document.getElementById('messageSent');

if (contactForm && messageSent) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio real do formulário

        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Simule o envio da mensagem (você pode adicionar lógica mais complexa aqui, como validação)
        console.log('Mensagem a ser enviada:', { subject, message });

        // Exibe uma mensagem de sucesso (simulada)
        messageSent.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        messageSent.style.display = 'block'; // Garante que a mensagem seja visível

        // Limpa o formulário após o envio simulado
        contactForm.reset();

        // Oculta a mensagem de sucesso após alguns segundos (opcional)
        setTimeout(() => {
            messageSent.style.display = 'none';
        }, 5000);
    });
}
});