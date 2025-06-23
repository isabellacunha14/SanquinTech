document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('classDetailModal');
  const closeBtn = document.querySelector('.close-button');

  document.querySelectorAll('.btn-class-details').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const card = button.closest('.class-item');
      document.getElementById('modalSubject').textContent = card.querySelector('h3').textContent;
      document.getElementById('modalTeacher').textContent = card.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
      document.getElementById('modalSchedule').textContent = card.querySelector('p:nth-of-type(2)').textContent.split(': ')[1];
      document.getElementById('modalRoom').textContent = card.querySelector('p:nth-of-type(3)').textContent.split(': ')[1];
      modal.classList.add('show');
    });
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });
});
