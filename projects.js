// Carga y muestra los proyectos desde projects.json
document.addEventListener('DOMContentLoaded', () => {
  fetch('projects.json')
    .then(response => response.json())
    .then(projects => {
      const container = document.getElementById('projects-list');
      if (!container) return;
      projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <img src="${project.image}" alt="${project.title}" class="project-img"/>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a href="${project.url}" target="_blank" class="btn">Ver proyecto</a>
        `;
        container.appendChild(card);
      });
    });
});
