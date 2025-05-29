// Slider/carousel para proyectos destacados
let currentSlide = 0;
let projectCards = [];

function showSlide(idx) {
  if (!projectCards.length) return;
  projectCards.forEach((card, i) => {
    card.style.display = i === idx ? 'flex' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('projects-list');
  const prev = document.getElementById('slider-prev');
  const next = document.getElementById('slider-next');

  // Espera a que projects.js cree las tarjetas
  setTimeout(() => {
    projectCards = Array.from(list.children);
    if (projectCards.length > 1) {
      showSlide(currentSlide);
      prev.style.display = 'inline-block';
      next.style.display = 'inline-block';
    } else {
      prev.style.display = 'none';
      next.style.display = 'none';
    }
  }, 100);

  prev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + projectCards.length) % projectCards.length;
    showSlide(currentSlide);
  });
  next.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % projectCards.length;
    showSlide(currentSlide);
  });
});
