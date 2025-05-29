// Traducción simple ES/EN para los textos principales
const skillIcons = {
  'C++': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" />',
  'Java': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" />',
  'JavaScript': '<img src="assets/images/js.svg" alt="JavaScript" />',
  'HTML5': '<img src="assets/images/html5.svg" alt="HTML5" />',
  'CSS3': '<img src="assets/images/css3.svg" alt="CSS3" />',
  'Nodejs': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" />',
  'Python': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" />',
  'C': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C" />',
  'C#': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" alt="C#" />',
  'Kotlin': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" alt="Kotlin" />',
  'Ruby': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" alt="Ruby" />',
};

const skillLabels = [
  'C++', 'Java', 'JavaScript', 'HTML5', 'CSS3', 'Nodejs', 'Python', 'C', 'C#', 'Kotlin', 'Ruby'
];

function getSkillCard(label) {
  const main = ['C++', 'Java', 'Java', 'Python', 'Nodejs'];
  return `<div class="skill-card${main.includes(label) ? ' skill-main' : ''}">${skillIcons[label] || ''} <span>${label}</span></div>`;
}

const translations = {
  es: {
    title: 'Juan Diesmers',
    subtitle: 'Desarrollador Web & Diseñador',
    about: '<strong>Sobre mí:</strong><br>Apasionado por la tecnología, el desarrollo web y el diseño digital. Me especializo en crear soluciones creativas y funcionales, con atención al detalle y enfoque en la experiencia de usuario.',
    contact: 'Contáctame',
    contactTitle: 'Contacto',
    contactName: 'Nombre',
    contactEmail: 'Correo electrónico',
    contactMsg: 'Mensaje',
    contactSend: 'Enviar',
    contactSuccess: '¡Mensaje enviado!',
    expTitle: 'Experiencia',
    expList: `<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h3>Desarrollador Web Freelance <span>(2022 - Actualidad)</span></h3><p>Desarrollo de sitios web, aplicaciones y soluciones a medida para clientes independientes y proyectos universitarios.</p></div></div><div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h3>Desarrollador C++ y Java <span>(2023 - 2024)</span></h3><p>Proyectos académicos destacados en estructuras de datos, algoritmos y desarrollo de aplicaciones de escritorio.</p></div></div><div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h3>Desarrollador Frontend <span>(2022 - 2023)</span></h3><p>Desarrollo de interfaces web modernas con JavaScript, HTML5 y CSS3.</p></div></div>`,
    skillsTitle: 'Habilidades',
    skillsList: skillLabels.map(getSkillCard).join(''),
    projectsTitle: 'Proyectos Destacados',
    footer: '&copy; 2025 Juan Diesmers. Todos los derechos reservados.'
  },
  en: {
    title: 'Juan Diesmers',
    subtitle: 'Web Developer & Designer',
    about: '<strong>About me:</strong><br>Passionate about technology, web development, and digital design. I specialize in creative and functional solutions, with attention to detail and user experience.',
    contact: 'Contact me',
    contactTitle: 'Contact',
    contactName: 'Name',
    contactEmail: 'Email',
    contactMsg: 'Message',
    contactSend: 'Send',
    contactSuccess: 'Message sent!',
    expTitle: 'Experience',
    expList: `<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h3>Freelance Web Developer <span>(2022 - Present)</span></h3><p>Development of websites, applications, and custom solutions for independent clients and university projects.</p></div></div><div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h3>C++ and Java Developer <span>(2023 - 2024)</span></h3><p>Academic projects in data structures, algorithms, and desktop app development.</p></div></div><div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h3>Frontend Developer <span>(2022 - 2023)</span></h3><p>Modern web interfaces with JavaScript, HTML5, and CSS3.</p></div></div>`,
    skillsTitle: 'Skills',
    skillsList: skillLabels.map(getSkillCard).join(''),
    projectsTitle: 'Featured Projects',
    footer: '&copy; 2025 Juan Diesmers. All rights reserved.'
  }
};

const mainLanguages = [
  { name: 'C++', percent: 38, icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" />' },
  { name: 'Java', percent: 22, icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" />' },
  { name: 'JavaScript', percent: 18, icon: '<img src="assets/images/js.svg" alt="JavaScript" />' },
  { name: 'HTML5', percent: 12, icon: '<img src="assets/images/html5.svg" alt="HTML5" />' },
  { name: 'CSS3', percent: 10, icon: '<img src="assets/images/css3.svg" alt="CSS3" />' }
];

const mainTools = [
  { name: 'JUCE', icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/juce/juce-original.svg" alt="JUCE" />' },
  { name: 'Node.js', icon: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" />' },
  { name: 'React', icon: '<img src="assets/images/react.svg" alt="React" />' },
  { name: 'Figma', icon: '<img src="assets/images/figma.svg" alt="Figma" />' },
  { name: 'Photoshop', icon: '<img src="assets/images/photoshop.svg" alt="Photoshop" />' },
  { name: 'Responsive', icon: '<img src="assets/images/responsive.svg" alt="Responsive Design" />' },
  { name: 'UI/UX', icon: '<img src="assets/images/uiux.svg" alt="UI/UX" />' }
];

function renderMainLanguages() {
  return mainLanguages.map(lang =>
    `<div class="main-lang-bar">
      <span class="main-lang-icon">${lang.icon}</span>
      <span class="main-lang-name">${lang.name}</span>
      <span class="main-lang-percent">${lang.percent}%</span>
      <div class="main-lang-progress"><div style="width:${lang.percent}%;"></div></div>
    </div>`
  ).join('');
}

function renderMainTools() {
  return mainTools.map(tool =>
    `<div class="main-tool">${tool.icon}<span>${tool.name}</span></div>`
  ).join('');
}

function updateSidebarProfile() {
  document.getElementById('main-langs').innerHTML = renderMainLanguages();
  document.getElementById('main-tools').innerHTML = renderMainTools();
}

const langOrder = ['es', 'en'];
let currentLangIdx = 0;

function setLang(lang) {
  const t = translations[lang];
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('subtitle').textContent = t.subtitle;
  document.getElementById('about-text').innerHTML = t.about;
  document.getElementById('contact-btn').textContent = t.contact;
  document.getElementById('exp-title').textContent = t.expTitle;
  document.getElementById('exp-list').innerHTML = t.expList;
  document.getElementById('skills-list').innerHTML = t.skillsList;
  document.getElementById('projects-title').textContent = t.projectsTitle;
  document.getElementById('footer-text').innerHTML = t.footer;
  document.getElementById('lang-toggle').textContent = lang.toUpperCase();
  // Contacto
  const contactSection = document.getElementById('contact-section');
  if (contactSection) {
    contactSection.querySelector('h2').textContent = t.contactTitle || (lang === 'en' ? 'Contact' : 'Contacto');
    const form = document.getElementById('contact-form');
    if (form) {
      form.querySelector('input[name="name"]').placeholder = t.contactName || (lang === 'en' ? 'Name' : 'Nombre');
      form.querySelector('input[name="email"]').placeholder = t.contactEmail || (lang === 'en' ? 'Email' : 'Correo electrónico');
      form.querySelector('textarea[name="message"]').placeholder = t.contactMsg || (lang === 'en' ? 'Message' : 'Mensaje');
      form.querySelector('button[type="submit"]').textContent = t.contactSend || (lang === 'en' ? 'Send' : 'Enviar');
      const success = document.getElementById('contact-success');
      if (success) success.textContent = t.contactSuccess || (lang === 'en' ? 'Message sent!' : '¡Mensaje enviado!');
    }
  }
  // Proyectos y detalles (si hay traducción)
  if (window.updateProjectsLang) window.updateProjectsLang(lang);
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  currentLangIdx = (currentLangIdx + 1) % langOrder.length;
  setLang(langOrder[currentLangIdx]);
});

document.addEventListener('DOMContentLoaded', () => {
  setLang(langOrder[currentLangIdx]);
  updateSidebarProfile();
});
