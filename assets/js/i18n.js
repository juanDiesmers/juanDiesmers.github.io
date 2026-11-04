// Traducciones ES/EN.
// El español vive directamente en el HTML; aquí solo va el inglés.
// Para agregar un texto traducible: ponle data-i18n="clave" en el HTML y agrega la clave abajo.
window.I18N_EN = {
  'skip': 'Skip to content',
  'nav.projects': 'projects',
  'nav.guides': 'guides',
  'nav.lab': 'lab',
  'nav.cv': 'resume',
  'nav.contact': 'contact',

  'hero.lede': 'Systems Engineering student at Pontificia Universidad Javeriana. I write C++, Java and JavaScript, and I like understanding how things work under the hood.',
  'hero.seek': 'Looking for my first role as a junior, backend or QA developer.',
  'hero.cta': 'See projects',
  'hero.contact': 'Get in touch',
  'hero.hint': "This is Conway's Game of Life. Click or drag to create cells.",
  'hero.pause': 'pause',
  'hero.play': 'play',

  'projects.title': 'Projects',
  'projects.sub': 'University and personal work. Open any of them to try it: each one has an interactive version that runs in the browser with the same logic as the original code.',
  'projects.code': 'code',
  'projects.detail': 'try it',
  'projects.private': 'private repo',
  'projects.how': 'How it works inside',
  'demo.loading': 'loading demo…',
  'demo.error': 'The demo could not load. Reload the page.',

  'guides.title': 'Interactive study guides',
  'guides.sub': 'I built these to prepare for my exams: theory, simulators, calculators and step-by-step solved exercises. They run in the browser and save your progress. Content is in Spanish.',
  'g.open': 'Open guide',
  'g.final.t': 'Final exam',
  'g.final.d': 'Study path for the final: how to pick the right statistic, set up hypotheses and decide.',
  'g.final.1': 'Study path',
  'g.final.2': 'Which statistic?',
  'g.final.3': 'Formulas and tables',
  'g.final.4': 'Exercise bank',
  'g.final.5': 'Exam simulator',
  'g.final.6': 'Common traps',
  'g.p2p.t': 'Second midterm',
  'g.p2p.d': 'Random variables, density functions and joint tables, with animated cell-by-cell solutions.',
  'g.p2p.1': 'Concepts from scratch',
  'g.p2p.2': 'Animated solutions',
  'g.p2p.3': 'Signal detector',
  'g.p2p.4': 'Flashcards',
  'g.p2p.5': 'Calculators',
  'g.p2p.6': 'Rubric-graded practice',
  'g.p2p.7': 'Mock exam',
  'g.an.course': 'Numerical Analysis',
  'g.an.t': 'Second midterm',
  'g.an.d': "Bisection, Newton's method, Lagrange polynomials and cubic splines, plus what shows up most on the exams.",
  'g.an.1': 'Bisection and Newton',
  'g.an.2': 'Lagrange',
  'g.an.3': 'Cubic splines',
  'g.an.4': 'Exam patterns',
  'g.an.5': 'Mock exam',

  'lab.title': 'Lab',
  'lab.sub': 'Research that is still in progress. This is where I try out ideas before they become projects.',
  'lab.dev': 'in development',
  'lab.wip': 'in progress',
  'lab.open': 'Open experiment',
  'lab.movu.d': "My capstone project: a 3D serious game that teaches you to find your way around Javeriana's engineering building. Single-player, first person, with missions built around points of interest.",
  'lab.movu.q': 'How do you turn a building’s floor plans into a walkable world that teaches you to move through it?',
  'lab.movu.progress': 'Progress',
  'lab.movu.c1': 'Proposal approved by the advisor',
  'lab.movu.c2': 'SRS, project plan (SPMP) and game design document (GDD)',
  'lab.movu.c3': 'Floor-plan model loaded in Unity',
  'lab.movu.c4': 'Playable demo: walk and explore in first person',
  'lab.movu.c5': 'Mission system and wayfinding guide',
  'lab.sort.t': 'Sorting algorithms',
  'lab.sort.d': 'A visualizer to watch, step by step, how many comparisons and swaps each algorithm makes on the same array.',
  'lab.sort.q': 'When does an O(n²) algorithm beat an O(n log n) one?',
  'lab.life.t': 'The Game of Life',
  'lab.life.d': "Conway's cellular automaton and a few variants of its rules. Four simple rules, and still there is no way to predict what happens without simulating it.",
  'lab.life.q': 'Why do such simple rules produce behavior that cannot be predicted?',
  'lab.life.tag': 'Cellular automata',

  'cv.title': 'Resume',
  'cv.about': "I'm interested in backend development, software quality, and projects where data structures and algorithms matter. I've built games in C++, audio processing with JUCE, web development, and now a game in Unity.",
  'cv.exp': 'Experience',
  'cv.e1.t': 'Freelance web developer',
  'cv.e1.w': '2022 – present',
  'cv.e1.d': 'Websites, apps and custom solutions for independent clients and university projects.',
  'cv.e2.t': 'C++ and Java developer',
  'cv.e2.d': 'Academic projects in data structures, algorithms and desktop applications.',
  'cv.e3.t': 'Frontend developer',
  'cv.e3.d': 'Web interfaces with JavaScript, HTML5 and CSS3.',
  'cv.edu': 'Education',
  'cv.edu.d': 'Systems Engineering, 2021 – present',
  'cv.langs': 'Languages in my repositories',
  'cv.stack': 'Tools and frameworks',

  'contact.title': 'Contact',
  'contact.sub': 'If you have an opening, a project or a question about anything here, write to me.',
  'contact.email': 'email',

  'footer': 'Handmade with HTML, CSS and JavaScript. No frameworks.'
};

(function () {
  const es = {};
  let lang = 'es';

  function snapshotSpanish() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (!(k in es)) es[k] = el.innerHTML;
    });
  }

  function apply(next) {
    lang = next;
    const dict = lang === 'en' ? window.I18N_EN : es;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (!(k in es)) es[k] = el.innerHTML;
      if (dict[k] != null) el.innerHTML = dict[k];
    });
    document.documentElement.lang = lang;
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.innerHTML = lang === 'es' ? '<b>ES</b> / EN' : 'ES / <b>EN</b>';
      btn.setAttribute('aria-label', lang === 'es' ? 'Change language to English' : 'Cambiar idioma a español');
    }
    try { localStorage.setItem('jd-lang', lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  window.I18N = {
    get lang() { return lang; },
    t(key, fallbackEs) { return lang === 'en' ? (window.I18N_EN[key] ?? fallbackEs) : fallbackEs; },
    apply,
    rescan: snapshotSpanish
  };

  document.addEventListener('DOMContentLoaded', () => {
    snapshotSpanish();
    let saved = null;
    try { saved = localStorage.getItem('jd-lang'); } catch (e) {}
    if (saved === 'en') apply('en');
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', () => apply(lang === 'es' ? 'en' : 'es'));
  });
})();
