// Demo interactiva del propio portafolio: una terminal que maneja la página.
(function () {
  const SECTIONS = { proyectos: 'proyectos', projects: 'proyectos', guias: 'guias', guides: 'guias', laboratorio: 'laboratorio', lab: 'laboratorio', cv: 'cv', contacto: 'contacto', contact: 'contacto' };
  const OPEN = {
    risk: ['project', 0], scrabble: ['project', 1], eq: ['project', 2], simpleeq: ['project', 2], wiki: ['project', 3],
    'final-probabilidad': ['url', 'guias/final-probabilidad/'], 'parcial2-probabilidad': ['url', 'guias/parcial2-probabilidad/'],
    'parcial2-analisis-numerico': ['url', 'guias/parcial2-analisis-numerico/'],
    ordenamiento: ['url', 'lab/ordenamiento/'], 'juego-de-la-vida': ['url', 'lab/juego-de-la-vida/']
  };
  const TREE = `.
├── index.html
├── assets/
│   ├── css/style.css
│   ├── data/english-words.txt     ← diccionario del Scrabble
│   └── js/
│       ├── main.js                ← proyectos, menú, carga de demos
│       ├── i18n.js                ← textos en inglés
│       ├── life.js                ← Juego de la Vida del encabezado
│       ├── projectDetails.js      ← datos y código de cada proyecto
│       └── demos/                 ← se cargan solo al abrir un proyecto
│           ├── risk.js  scrabble.js  eq.js  wiki.js  portfolio.js
├── guias/                         ← guías de estudio interactivas
└── lab/                           ← ordenamiento, juego-de-la-vida`;

  function mount(root, { L }) {
    root.innerHTML = `
      <div class="demo-head"><h4>${L('Pruébalo', 'Try it')}</h4></div>
      <div class="demo-body">
        <p class="hint">${L('Esta terminal maneja la página de verdad: escribe help para ver los comandos. Prueba cd guias, open risk, lang en o life pause. Tab completa y las flechas recorren el historial.',
          'This terminal really drives the page: type help to see the commands. Try cd guias, open risk, lang en or life pause. Tab completes and the arrow keys walk the history.')}</p>
        <div class="out" data-out style="height:16rem;max-height:none"></div>
        <form data-f style="display:flex;align-items:center;gap:.5rem;margin-top:.5rem;font:500 .8rem var(--mono)">
          <label for="pf-cmd" style="color:var(--sage)">juan@diesmers:~$</label>
          <input id="pf-cmd" type="text" data-in autocomplete="off" spellcheck="false" style="flex:1" aria-label="${L('Comando', 'Command')}">
        </form>
      </div>`;
    const out = root.querySelector('[data-out]'), input = root.querySelector('[data-in]');
    const hist = []; let hi = 0;
    const print = (html = '') => { out.innerHTML += html + '\n'; out.scrollTop = out.scrollHeight; };
    const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

    const CMDS = {
      help: () => print(`<span class="am">help</span>              ${L('esta ayuda', 'this help')}
<span class="am">ls</span>                ${L('lista las secciones y proyectos', 'list sections and projects')}
<span class="am">cd</span> &lt;${L('sección', 'section')}&gt;      ${L('baja hasta esa sección', 'scroll to that section')} (proyectos, guias, laboratorio, cv, contacto)
<span class="am">open</span> &lt;${L('nombre', 'name')}&gt;       ${L('abre un proyecto, guía o experimento', 'open a project, guide or experiment')}
<span class="am">cat</span> cv.md        ${L('resumen de la hoja de vida', 'resume summary')}
<span class="am">tree</span>              ${L('estructura de archivos del sitio', 'site file structure')}
<span class="am">lang</span> es|en        ${L('cambia el idioma de la página', 'change the page language')}
<span class="am">life</span> pause|play|seed  ${L('controla el Juego de la Vida del encabezado', 'control the header Game of Life')}
<span class="am">whoami</span>, <span class="am">date</span>, <span class="am">clear</span>`),
      ls: () => print(`<span class="sk">proyectos/</span>   risk  scrabble  eq  wiki
<span class="sk">guias/</span>       final-probabilidad  parcial2-probabilidad  parcial2-analisis-numerico
<span class="sk">laboratorio/</span> ordenamiento  juego-de-la-vida
cv.md`),
      cd: a => {
        const id = SECTIONS[(a || '').replace(/[~/]/g, '')];
        if (!id) return print(`<span class="bad">cd: ${esc(a || '')}: ${L('no existe esa sección', 'no such section')}</span>`);
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); print(`<span class="dim">→ #${id}</span>`);
      },
      open: a => {
        const o = OPEN[(a || '').toLowerCase()];
        if (!o) return print(`<span class="bad">open: ${esc(a || '')}: ${L('no encontrado. Usa ls.', 'not found. Use ls.')}</span>`);
        if (o[0] === 'url') { print(`<span class="dim">→ ${o[1]}</span>`); window.location.href = o[1]; return; }
        const rowBtn = document.querySelectorAll('#project-rows .row button.link-btn')[o[1]];
        if (rowBtn) { if (rowBtn.getAttribute('aria-expanded') !== 'true') rowBtn.click(); rowBtn.closest('.row').scrollIntoView({ behavior: 'smooth' }); print(`<span class="dim">→ ${a}</span>`); }
      },
      cat: a => {
        if (a !== 'cv.md') return print(`<span class="bad">cat: ${esc(a || '')}: ${L('no existe el archivo', 'no such file')}</span>`);
        print(`# Juan Diesmers
${L('Ingeniería de Sistemas, Pontificia Universidad Javeriana', 'Systems Engineering, Pontificia Universidad Javeriana')}
${L('Busco', 'Looking for')}: ${L('desarrollador junior, backend o QA', 'junior, backend or QA developer')}
${L('Lenguajes', 'Languages')}: C++ · Java · JavaScript · Python
${L('Proyectos', 'Projects')}: RISK (grafos, Dijkstra, Huffman) · Scrabble (Trie) · SimpleEQ (JUCE) · Wiki (Spring Boot)`);
      },
      tree: () => print(esc(TREE)),
      lang: a => {
        if (a !== 'es' && a !== 'en') return print(`<span class="bad">lang: ${L('usa es o en', 'use es or en')}</span>`);
        print(`<span class="dim">I18N.apply('${a}')</span>`);
        setTimeout(() => window.I18N && window.I18N.apply(a), 250);
      },
      life: a => {
        const btn = document.getElementById('life-toggle');
        if (a === 'seed') { const c = document.getElementById('life'); if (c) { const r = c.getBoundingClientRect(); for (let k = 0; k < 25; k++) c.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + Math.random() * r.width, clientY: r.top + Math.random() * r.height })); window.dispatchEvent(new PointerEvent('pointerup')); } print(L('25 planeadores nuevos en el encabezado.', '25 new gliders in the header.')); return; }
        const running = btn && (btn.dataset.i18n === 'hero.pause');
        if ((a === 'pause' && running) || (a === 'play' && !running)) btn.click();
        else if (a !== 'pause' && a !== 'play') return print(`<span class="bad">life: ${L('usa pause, play o seed', 'use pause, play or seed')}</span>`);
        print(a === 'pause' ? L('Juego de la Vida en pausa.', 'Game of Life paused.') : L('Juego de la Vida corriendo.', 'Game of Life running.'));
      },
      whoami: () => print('juan — ' + L('estudiante de Ingeniería de Sistemas', 'Systems Engineering student')),
      date: () => print(new Date().toString()),
      clear: () => { out.innerHTML = ''; },
      sudo: () => print(L('Buen intento.', 'Nice try.'))
    };

    function run(line) {
      const [cmd, ...args] = line.trim().split(/\s+/);
      print(`<span class="ok">juan@diesmers:~$</span> ${esc(line)}`);
      if (!cmd) return;
      const fn = CMDS[cmd.toLowerCase()];
      if (fn) fn(args.join(' '));
      else print(`<span class="bad">${esc(cmd)}: ${L('comando no encontrado. Escribe help.', 'command not found. Type help.')}</span>`);
    }
    root.querySelector('[data-f]').addEventListener('submit', e => {
      e.preventDefault(); const v = input.value; if (v.trim()) hist.push(v); hi = hist.length; input.value = ''; run(v);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const parts = input.value.split(' '), last = parts[parts.length - 1];
        const pool = parts.length === 1 ? Object.keys(CMDS) : parts[0] === 'cd' ? Object.keys(SECTIONS) : parts[0] === 'open' ? Object.keys(OPEN) : parts[0] === 'cat' ? ['cv.md'] : [];
        const m = pool.filter(x => x.startsWith(last));
        if (m.length === 1) { parts[parts.length - 1] = m[0]; input.value = parts.join(' ') + ' '; }
        else if (m.length > 1) print(m.join('  '));
      }
    });
    print(`<span class="dim">${L('Bienvenido. Escribe', 'Welcome. Type')}</span> <span class="am">help</span><span class="dim">.</span>`);
    run('ls');
  }

  window.PortfolioDemos = window.PortfolioDemos || {};
  window.PortfolioDemos.portfolio = mount;
})();
