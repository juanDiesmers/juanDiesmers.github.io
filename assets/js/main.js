// Lógica principal del portafolio: proyectos, hoja de vida, menú.

// ------- Configuración rápida -------
const CONTACT_EMAIL = 'juan@email.com'; // <- cambia esto por tu correo real

// Orden y lenguaje de resaltado de cada proyecto (los datos están en projectDetails.js)
// `demo` es el archivo en assets/js/demos/ con la versión interactiva del proyecto.
const PROJECTS = [
  { key: 'ProyectoEstructuraDatos_R.I.S.K', code: 'cpp', demo: 'risk' },
  { key: 'Proyecto_Scrabble', code: 'cpp', demo: 'scrabble' },
  { key: 'SimpleEqProyectoAvanzada', code: 'cpp', demo: 'eq' },
  { key: 'WikiGroupT1', code: 'java', demo: 'wiki' },
  { key: 'Portafolio Web', code: 'javascript', demo: 'portfolio' }
];
const ASSET_VERSION = '3';

// Porcentaje de cada lenguaje en los repositorios de GitHub
const LANGS = [
  ['C++', 38], ['Java', 22], ['JavaScript', 18], ['HTML', 12], ['CSS', 10]
];

const STACK = [
  'C++', 'Java', 'Python', 'JavaScript', 'Kotlin', 'C#',
  'Node.js', 'React', 'Spring', 'Android',
  'MySQL', 'PostgreSQL', 'MongoDB',
  'Unity', 'JUCE', 'Git', 'Figma'
];

// ------- Utilidades -------
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const t = (k, es) => (window.I18N ? window.I18N.t(k, es) : es);
const isEn = () => window.I18N && window.I18N.lang === 'en';

// Carga cada demo solo cuando alguien abre el detalle del proyecto
window.PortfolioDemos = window.PortfolioDemos || {};
const demoPromises = {};
function loadDemo(name) {
  if (window.PortfolioDemos[name]) return Promise.resolve(window.PortfolioDemos[name]);
  if (!demoPromises[name]) {
    demoPromises[name] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `assets/js/demos/${name}.js?v=${ASSET_VERSION}`;
      s.onload = () => resolve(window.PortfolioDemos[name]);
      s.onerror = () => { delete demoPromises[name]; reject(new Error('No se pudo cargar la demo')); };
      document.head.appendChild(s);
    });
  }
  return demoPromises[name];
}

let hljsPromise = null;
function loadHighlight() {
  if (window.hljs) return Promise.resolve();
  if (!hljsPromise) {
    hljsPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/common.min.js';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    }).catch(() => {});
  }
  return hljsPromise;
}

// ------- Proyectos -------
function renderProjects() {
  const host = $('#project-rows');
  if (!host || !window.projectDetailsData) return;
  const openKeys = [...host.querySelectorAll('.detail.open')].map(d => d.dataset.key);
  host.querySelectorAll('.row').forEach(r => r._unmount && r._unmount());
  host.innerHTML = '';

  PROJECTS.forEach((p, i) => {
    const d = window.projectDetailsData[p.key];
    if (!d) return;
    const en = isEn();
    const title = en && d.title_en ? d.title_en : d.title;
    const summary = en && d.resumen_en ? d.resumen_en : d.resumen;
    const id = 'detail-' + i;

    const row = document.createElement('article');
    row.className = 'row';
    row.innerHTML = `
      <div class="row-main">
        <div>
          <h3>${esc(title)}</h3>
          <p>${esc(summary.split('. ')[0].replace(/\.$/, ''))}.</p>
          <div class="tags">${(d.tecnologias || []).map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
        </div>
        <div class="row-actions">
          ${d.github
            ? `<a class="link-btn" href="${esc(d.github)}" target="_blank" rel="noopener">${t('projects.code', 'código')}</a>`
            : ''}
          <button class="link-btn" aria-expanded="false" aria-controls="${id}">${t('projects.detail', 'probar')} <span class="chev" aria-hidden="true">▾</span></button>
        </div>
      </div>
      <div class="detail" id="${id}" data-key="${esc(p.key)}" role="region" aria-label="${esc(title)}">
        <div><div class="detail-inner">
          <p class="summary">${esc(summary)}</p>
          ${p.demo ? `<div class="demo" data-demo-host><div class="demo-loading">${t('demo.loading', 'cargando demo…')}</div></div>` : ''}
          <p class="how-title">${t('projects.how', 'Cómo está hecho por dentro')}</p>
          ${(d.secciones || []).map(s => `
            <div class="snippet">
              <h4>${esc(en && s.subtitulo_en ? s.subtitulo_en : s.subtitulo)}</h4>
              <pre><code class="language-${p.code}">${esc(s.code)}</code></pre>
              <p>${esc(en && s.explicacion_en ? s.explicacion_en : s.explicacion)}</p>
            </div>`).join('')}
        </div></div>
      </div>`;
    host.appendChild(row);

    const btn = row.querySelector('button.link-btn');
    const det = row.querySelector('.detail');
    const demoHost = det.querySelector('[data-demo-host]');
    let cleanup = null;
    const mountDemo = () => {
      if (!demoHost || !p.demo || cleanup) return;
      cleanup = () => {};
      loadDemo(p.demo).then(mount => {
        if (!det.classList.contains('open')) { cleanup = null; return; }
        demoHost.innerHTML = '';
        const c = mount(demoHost, { lang: isEn() ? 'en' : 'es', L: (es, en) => (isEn() ? en : es) });
        cleanup = typeof c === 'function' ? c : () => {};
      }).catch(() => {
        demoHost.innerHTML = `<div class="demo-loading">${t('demo.error', 'No se pudo cargar la demo. Recarga la página.')}</div>`;
        cleanup = null;
      });
    };
    const unmountDemo = () => {
      if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
      if (demoHost) demoHost.innerHTML = `<div class="demo-loading">${t('demo.loading', 'cargando demo…')}</div>`;
    };
    const setOpen = open => {
      det.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      det.inert = !open;
      if (open) mountDemo(); else unmountDemo();
      if (open) loadHighlight().then(() => {
        if (!window.hljs) return;
        det.querySelectorAll('pre code:not([data-highlighted])').forEach(c => window.hljs.highlightElement(c));
      });
    };
    row._unmount = unmountDemo;
    setOpen(openKeys.includes(p.key));
    btn.addEventListener('click', () => setOpen(!det.classList.contains('open')));
  });
}

// ------- Hoja de vida -------
function renderCv() {
  const bars = $('#lang-bars');
  if (bars) bars.innerHTML = LANGS.map(([n, v]) => `
    <li><span>${n}</span><span class="track" role="img" aria-label="${n} ${v}%"><span class="fill" style="width:${v}%; display:block"></span></span><span class="pct">${v}%</span></li>`).join('');
  const stack = $('#stack');
  if (stack) stack.innerHTML = STACK.map(s => `<span class="tag">${esc(s)}</span>`).join('');
}

// ------- Menú móvil y navegación -------
function setupNav() {
  const btn = $('#menu-btn'), nav = $('#nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', e => {
      if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }
  // Marca la sección visible en la barra superior
  const links = [...document.querySelectorAll('.nav a')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.removeAttribute('aria-current'));
        const a = map.get(e.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderCv();
  setupNav();
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  const mail = $('#email-link'), mt = $('#email-text');
  if (mail) mail.href = 'mailto:' + CONTACT_EMAIL;
  if (mt) mt.textContent = CONTACT_EMAIL;
});
document.addEventListener('langchange', renderProjects);
