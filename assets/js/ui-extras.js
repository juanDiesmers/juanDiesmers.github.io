// Animación de fade-in para proyectos y scroll suave
window.addEventListener('DOMContentLoaded', () => {
  // Fade-in animación
  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1)';
      el.style.opacity = 1;
    }, 200 + i * 120);
  });

  // Botón ir arriba
  const scrollBtn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.remove('hidden');
    } else {
      scrollBtn.classList.add('hidden');
    }
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Menú hamburguesa para sidebar en móvil
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
    });
    // Cerrar sidebar al hacer click fuera en móvil
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && e.target !== toggleBtn && window.innerWidth < 768) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  }

  // Scroll suave para anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contacto: feedback de envío (simulado)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      document.getElementById('contact-success').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('contact-success').classList.add('hidden');
        contactForm.reset();
      }, 2500);
    });
  }
});
