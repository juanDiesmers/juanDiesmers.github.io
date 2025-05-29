// Traducción simple ES/EN para los textos principales
const translations = {
  es: {
    title: 'Juan Diesmers',
    subtitle: 'Desarrollador Web & Diseñador',
    about: '<strong>Sobre mí:</strong><br>Apasionado por la tecnología, el desarrollo web y el diseño digital. Me especializo en crear soluciones creativas y funcionales, con atención al detalle y enfoque en la experiencia de usuario.',
    contact: 'Contáctame',
    expTitle: 'Experiencia',
    expList: `<li><strong>Desarrollador Web Freelance</strong> (2022 - Actualidad)<br>Desarrollo de sitios web y aplicaciones para clientes independientes.</li>\n<li><strong>Diseñador Gráfico</strong> (2020 - 2022)<br>Creación de identidades visuales y material digital para pequeñas empresas.</li>`,
    skillsTitle: 'Habilidades',
    skillsList: `<li>HTML5, CSS3, JavaScript, React</li>\n<li>Diseño UI/UX</li>\n<li>Responsive Design</li>\n<li>Photoshop, Figma</li>`,
    projectsTitle: 'Proyectos Destacados',
    footer: '&copy; 2025 Juan Diesmers. Todos los derechos reservados.'
  },
  en: {
    title: 'Juan Diesmers',
    subtitle: 'Web Developer & Designer',
    about: '<strong>About me:</strong><br>Passionate about technology, web development, and digital design. I specialize in creative and functional solutions, with attention to detail and user experience.',
    contact: 'Contact me',
    expTitle: 'Experience',
    expList: `<li><strong>Freelance Web Developer</strong> (2022 - Present)<br>Development of websites and applications for independent clients.</li>\n<li><strong>Graphic Designer</strong> (2020 - 2022)<br>Branding and digital material for small businesses.</li>`,
    skillsTitle: 'Skills',
    skillsList: `<li>HTML5, CSS3, JavaScript, React</li>\n<li>UI/UX Design</li>\n<li>Responsive Design</li>\n<li>Photoshop, Figma</li>`,
    projectsTitle: 'Featured Projects',
    footer: '&copy; 2025 Juan Diesmers. All rights reserved.'
  }
};

let currentLang = 'es';

document.getElementById('lang-toggle').addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  setLang(currentLang);
});

function setLang(lang) {
  const t = translations[lang];
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('subtitle').textContent = t.subtitle;
  document.getElementById('about-text').innerHTML = t.about;
  document.getElementById('contact-btn').textContent = t.contact;
  document.getElementById('exp-title').textContent = t.expTitle;
  document.getElementById('exp-list').innerHTML = t.expList;
  document.getElementById('skills-title').textContent = t.skillsTitle;
  document.getElementById('skills-list').innerHTML = t.skillsList;
  document.getElementById('projects-title').textContent = t.projectsTitle;
  document.getElementById('footer-text').innerHTML = t.footer;
  document.getElementById('lang-toggle').textContent = lang === 'es' ? 'EN' : 'ES';
}

// Inicializa idioma
setLang(currentLang);
