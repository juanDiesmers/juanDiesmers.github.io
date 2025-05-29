// Proyectos embebidos directamente para evitar problemas de fetch en GitHub Pages
const projects = [
  {
    title: "ProyectoEstructuraDatos_R.I.S.K",
    description: "Juego de estrategia tipo RISK implementado en C++ como proyecto universitario avanzado.",
    image: "assets/images/project1.jpg",
    url: "#project-risk",
    tags: ["C++", "Algoritmos", "Juego"]
  },
  {
    title: "Proyecto_Scrabble",
    description: "Versión digital del clásico juego Scrabble, desarrollada en C++ con estructuras de datos.",
    image: "assets/images/project2.jpg",
    url: "#project-scrabble",
    tags: ["C++", "Estructuras de datos", "Juego"]
  },
  {
    title: "WikiGroupT1",
    description: "Wiki colaborativa desarrollada en HTML, CSS y JavaScript para gestión de información grupal.",
    image: "assets/images/project3.jpg",
    url: "#project-wiki",
    tags: ["HTML5", "CSS3", "JavaScript"]
  },
  {
    title: "Portafolio Web",
    description: "Mi portafolio personal, moderno y multilenguaje, hecho con HTML, CSS y JavaScript.",
    image: "assets/images/project4.jpg",
    url: "#project-portfolio",
    tags: ["HTML5", "CSS3", "JavaScript"]
  },
  {
    title: "SimpleEqProyectoAvanzada",
    description: "Proyecto universitario de procesamiento de audio con C++ y el framework JUCE.",
    image: "assets/images/project5.jpg",
    url: "#project-eq",
    tags: ["C++", "JUCE", "Audio"]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('projects-list');
  if (!container) return;
  projects.forEach((project, i) => {
    // Estructura visual compatible con el CSS de assets/css/style.css
    const card = document.createElement('div');
    card.className = 'project-card fade-in transition-transform duration-300 hover:scale-105 hover:shadow-2xl';
    card.style.animationDelay = `${i * 0.1 + 0.2}s`;
    card.setAttribute('data-project-key', i);
    card.innerHTML = `
      <div class="project-img-wrap">
        <img src="${project.image}" alt="${project.title}" class="project-img"/>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="project-actions">
          <a href="#" class="project-action-btn" data-project-key="${i}">Ver proyecto</a>
        </div>
        <div class="project-tags flex flex-wrap gap-2 mt-2">
          ${(project.tags || []).map(tag => `<span class='project-tag bg-[#e3f0ff] dark:bg-[#232a36] text-[#4e6fae] dark:text-[#7fd7ff] px-2 py-1 rounded text-xs font-semibold cursor-pointer transition hover:bg-[#7fd7ff33]' title='${tag}'>${tag}</span>`).join('')}
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Evento click robusto para los botones 'Ver proyecto'
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('project-action-btn')) {
      e.preventDefault();
      const key = e.target.getAttribute('data-project-key');
      if (key !== null) {
        waitForProjectDetails(() => {
          // Buscar la clave real del proyecto en projectDetailsData
          const project = projects[parseInt(key)];
          // Buscar por title exacto en projectDetailsData
          let detailKey = project.title;
          // Si no existe, buscar por title_en
          if (!window.projectDetailsData[detailKey]) {
            // Buscar por title_en
            for (const k in window.projectDetailsData) {
              if (window.projectDetailsData[k].title_en === project.title) {
                detailKey = k;
                break;
              }
            }
          }
          renderProjectDetail(detailKey);
        });
      }
    }
  });
});

// Cargar detalles extendidos desde archivo externo
const script = document.createElement('script');
script.src = 'assets/js/projectDetails.js';
document.head.appendChild(script);

// Esperar a que projectDetailsData esté disponible
function waitForProjectDetails(cb) {
  if (window.projectDetailsData) cb();
  else setTimeout(() => waitForProjectDetails(cb), 50);
}

function renderProjectDetail(title) {
  const section = document.getElementById('project-detail-section');
  if (!window.projectDetailsData) return;
  // Detectar idioma actual
  let lang = 'es';
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn && langBtn.textContent.trim().toLowerCase() === 'en') lang = 'en';
  const details = window.projectDetailsData[title];
  if (!details) return;
  let html = `<div class='project-detail-wrap'>`;
  // Botón cerrar
  html += `<button id='close-project-detail' class='bg-[#4e6fae] dark:bg-[#7fd7ff] text-white dark:text-[#232a36] font-bold py-2 px-4 rounded-lg float-right mb-2 hover:bg-[#7fd7ff] hover:text-[#232a36] dark:hover:bg-[#4e6fae] dark:hover:text-white transition'>${lang === 'en' ? 'Close' : 'Cerrar'}</button>`;
  html += `<h2 class='project-detail-title'>${lang === 'en' && details.title_en ? details.title_en : details.title}</h2>`;
  html += `<div class='project-detail-meta'>`;
  html += `<img src='${details.imagen}' alt='${lang === 'en' && details.title_en ? details.title_en : details.title}' class='project-detail-img'/>`;
  html += `<div class='project-detail-info'>`;
  html += `<div class='project-detail-resumen'><b>${lang === 'en' ? 'Summary:' : 'Resumen:'}</b> ${lang === 'en' && details.resumen_en ? details.resumen_en : details.resumen}</div>`;
  if (details.tecnologias && details.tecnologias.length) {
    html += `<div class='project-detail-tecnologias'><b>${lang === 'en' ? 'Technologies:' : 'Tecnologías:'}</b> ${details.tecnologias.join(', ')}</div>`;
  }
  if (details.github) {
    html += `<div class='project-detail-github'><a href='${details.github}' target='_blank'>${lang === 'en' ? 'View on GitHub' : 'Ver en GitHub'}</a></div>`;
  }
  html += `</div></div>`;
  details.secciones.forEach(sec => {
    let codeLang = 'cpp';
    if (details.tecnologias && details.tecnologias.some(t => t.toLowerCase().includes('javascript'))) codeLang = 'javascript';
    if (details.tecnologias && details.tecnologias.some(t => t.toLowerCase().includes('java'))) codeLang = 'java';
    html += `<div class='project-detail-section-block'><h4>${lang === 'en' && sec.subtitulo_en ? sec.subtitulo_en : sec.subtitulo}</h4><pre class='project-detail-code hljs language-${codeLang}'>${sec.code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre><div class='project-detail-explanation'>${lang === 'en' && sec.explicacion_en ? sec.explicacion_en : sec.explicacion}</div></div>`;
  });
  html += `</div>`;
  section.innerHTML = html;
  section.style.display = 'block';
  // Ocultar lista de proyectos
  const projectsSection = document.querySelector('.projects');
  if (projectsSection) projectsSection.style.display = 'none';
  section.scrollIntoView({behavior: 'smooth', block: 'start'});
  // Forzar highlight.js en todos los bloques de código
  if (window.hljs) {
    section.querySelectorAll('.project-detail-code').forEach(block => {
      block.classList.add('hljs');
      if (!block.classList.contains('language-cpp') && !block.classList.contains('language-javascript') && !block.classList.contains('language-java')) {
        block.classList.add('language-cpp');
      }
      window.hljs.highlightElement(block);
    });
  }
  // Evento para cerrar detalle
  const closeBtn = document.getElementById('close-project-detail');
  if (closeBtn) {
    closeBtn.onclick = () => {
      section.style.display = 'none';
      if (projectsSection) projectsSection.style.display = '';
      window.scrollTo({ top: document.getElementById('projects-title').offsetTop - 40, behavior: 'smooth' });
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('project-action-btn')) {
      e.preventDefault();
      const card = e.target.closest('.project-card');
      const title = card.querySelector('.project-title').textContent;
      waitForProjectDetails(() => {
        renderProjectDetail(title);
      });
    }
  });
});

// Modo oscuro automático
function applyUserColorScheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.classList.toggle('dark-mode', prefersDark);
}
applyUserColorScheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyUserColorScheme);

// Traducción dinámica de títulos de proyectos y detalles
window.updateProjectsLang = function(lang) {
  // Aquí solo se actualizan los títulos de las tarjetas y la sección de detalle si está visible
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const titleEl = card.querySelector('.project-title');
    if (!titleEl) return;
    const key = titleEl.textContent;
    if (window.projectDetailsData && window.projectDetailsData[key]) {
      const detail = window.projectDetailsData[key];
      if (lang === 'en' && detail.title_en) titleEl.textContent = detail.title_en;
      else if (lang === 'es' && detail.title) titleEl.textContent = detail.title;
    }
  });
  // Sección de detalle de proyecto
  const section = document.getElementById('project-detail-section');
  if (section && section.style.display !== 'none' && section.innerHTML.trim()) {
    // Forzar rerender usando el título actual
    const current = section.querySelector('.project-detail-title');
    if (current) {
      const key = current.textContent;
      if (window.renderProjectDetail) window.renderProjectDetail(key);
    }
  }
};
