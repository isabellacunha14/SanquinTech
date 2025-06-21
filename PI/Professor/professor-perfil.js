document.addEventListener('DOMContentLoaded', () => {
  // Abrir modais
  const modalButtons = document.querySelectorAll('.btn-modal');
  modalButtons.forEach(button => {
    const modalId = button.getAttribute('data-modal');
    button.addEventListener('click', () => {
      document.getElementById(modalId)?.classList.add('show');
    });
  });

  // Fechar modais
  const closeButtons = document.querySelectorAll('.close-button');
  closeButtons.forEach(btn => {
    const target = btn.getAttribute('data-close');
    btn.addEventListener('click', () => {
      document.getElementById(target)?.classList.remove('show');
    });
  });

  // Fechar ao clicar fora do conteúdo
  window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal) {
        modal.classList.remove('show');
      }
    });
  });

  // Modal de Senha
  const senhaBtn = document.getElementById('changePasswordBtn');
  senhaBtn?.addEventListener('click', () => {
    document.getElementById('modalSenha')?.classList.add('show');
  });

  // Salvamento (simulado)
  document.querySelectorAll('.modal-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Informação registrada com sucesso!');
      form.closest('.modal')?.classList.remove('show');
      form.reset();
    });
  });
});
