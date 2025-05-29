// Proyectos embebidos directamente para evitar problemas de fetch en GitHub Pages
const projects = [
  {
    title: "Sitio Web Personal",
    description: "Mi portafolio personal desarrollado con HTML, CSS y JavaScript.",
    image: "project1.jpg",
    url: "https://juanDiesmers.github.io"
  },
  {
    title: "App de Tareas",
    description: "Aplicación web para gestionar tareas diarias, construida con React.",
    image: "project2.jpg",
    url: "https://github.com/juanDiesmers/todo-app"
  }
];

document.addEventListener('DOMContentLoaded', () => {
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
