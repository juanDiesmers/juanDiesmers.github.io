// Demo interactiva de Proyecto_Scrabble
// Usa el mismo diccionario del proyecto (englishWords-1.txt) y reimplementa en JavaScript:
//  - Trie y ReverseTrie: search, wordsWithPrefix y búsqueda por sufijo
//  - calcularPuntajePalabra con la misma tabla de puntajes
//  - GrafoPalabra::posiblesPalabras con comodines '?'
//  - GrafoPalabra::sonConectadas (palabras que difieren en una sola letra)
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const SCORES = { e: 1, a: 1, i: 1, o: 1, n: 1, r: 1, t: 1, l: 1, s: 1, u: 1, d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4, k: 5, j: 8, x: 8, q: 10, z: 10 };
  // Bolsa de fichas del Scrabble en inglés (sin los dos comodines, que se agregan aparte)
  const BAG = 'eeeeeeeeeeeeaaaaaaaaaiiiiiiiiioooooooonnnnnnrrrrrrttttttllllssssuuuuddddgggbbccmmppffhhvvwwyykjxqz';

  let words = null, wordSet = null, trie = null, rtrie = null, nodes = 0, loading = null;

  function makeNode() { nodes++; return { c: {}, e: false, n: 0 }; }
  function insert(root, w) { let cur = root; cur.n++; for (const ch of w) { cur = cur.c[ch] || (cur.c[ch] = makeNode()); cur.n++; } cur.e = true; }
  function walk(root, s) { const path = [root]; let cur = root; for (const ch of s) { cur = cur.c[ch]; if (!cur) return { path, ok: false }; path.push(cur); } return { path, ok: true, node: cur }; }
  function collect(node, prefix, out, max) {
    if (out.length >= max) return;
    if (node.e) out.push(prefix);
    for (const ch of Object.keys(node.c).sort()) { collect(node.c[ch], prefix + ch, out, max); if (out.length >= max) return; }
  }
  function load() {
    if (loading) return loading;
    loading = fetch('assets/data/english-words.txt').then(r => { if (!r.ok) throw new Error(r.status); return r.text(); }).then(txt => {
      words = txt.split('\n').filter(Boolean);
      wordSet = new Set(words);
      nodes = 0; trie = makeNode();
      words.forEach(w => insert(trie, w));
      const trieNodes = nodes;
      nodes = 0; rtrie = makeNode();
      words.forEach(w => insert(rtrie, [...w].reverse().join('')));
      nodes = trieNodes;
    });
    return loading;
  }
  const score = w => [...w].reduce((s, c) => s + (SCORES[c] || 0), 0);

  function mount(root, { L }) {
    let mode = 'trie', suffix = false;
    root.innerHTML = `
      <div class="demo-head">
        <h4>${L('Pruébalo', 'Try it')}</h4>
        <div class="demo-tabs" role="tablist">
          <button role="tab" data-m="trie" aria-selected="true">Trie</button>
          <button role="tab" data-m="rack" aria-selected="false">${L('Posibles palabras', 'Possible words')}</button>
          <button role="tab" data-m="graph" aria-selected="false">${L('Grafo de palabras', 'Word graph')}</button>
        </div>
      </div>
      <div class="demo-body" data-body><div class="demo-loading">${L('Cargando el diccionario del proyecto (45.353 palabras en inglés)…', 'Loading the project dictionary (45,353 English words)…')}</div></div>`;
    const body = root.querySelector('[data-body]');
    const tabs = root.querySelectorAll('[role="tab"]');
    tabs.forEach(b => b.addEventListener('click', () => { mode = b.dataset.m; tabs.forEach(x => x.setAttribute('aria-selected', String(x === b))); render(); }));

    load().then(render).catch(() => { body.innerHTML = `<div class="demo-loading">${L('No se pudo cargar el diccionario.', 'The dictionary could not be loaded.')}</div>`; });

    function render() {
      if (!trie) return;
      if (mode === 'trie') renderTrie();
      else if (mode === 'rack') renderRack();
      else renderGraph();
    }

    // ---------------- Trie ----------------
    function renderTrie() {
      body.innerHTML = `
        <p class="hint">${L('Escribe una palabra en inglés. El Trie la recorre letra por letra: cada nodo es una letra y el doble círculo marca dónde termina una palabra válida. Toca una de las letras siguientes para seguir bajando por el árbol.',
          'Type an English word. The Trie walks it letter by letter: each node is a letter and the double ring marks where a valid word ends. Tap one of the next letters to keep going down the tree.')}</p>
        <div class="demo-row">
          <input type="text" data-q value="play" maxlength="15" autocomplete="off" spellcheck="false" aria-label="${L('Palabra o prefijo', 'Word or prefix')}" style="flex:1;max-width:16rem">
          <button class="ctl" type="button" data-mode>${suffix ? L('Buscar por sufijo (ReverseTrie)', 'Search by suffix (ReverseTrie)') : L('Buscar por prefijo (Trie)', 'Search by prefix (Trie)')}</button>
          <span class="kv"><span>${L('palabras', 'words')} <b>${words.length.toLocaleString(L('es-CO', 'en-US'))}</b></span><span>${L('nodos en el Trie', 'nodes in the Trie')} <b>${nodes.toLocaleString(L('es-CO', 'en-US'))}</b></span></span>
        </div>
        <svg data-svg viewBox="0 0 900 230" aria-hidden="true"></svg>
        <div class="kv" data-kv></div>
        <p class="demo-sub" data-sub></p>
        <div class="chips" data-chips></div>`;
      const q = body.querySelector('[data-q]');
      body.querySelector('[data-mode]').onclick = () => { suffix = !suffix; renderTrie(); };
      q.addEventListener('input', () => update(q));
      update(q);
    }
    function update(q) {
      const raw = q.value.toLowerCase().replace(/[^a-z]/g, '');
      if (raw !== q.value) q.value = raw;
      const key = suffix ? [...raw].reverse().join('') : raw;
      const r = walk(suffix ? rtrie : trie, key);
      drawTrie(body.querySelector('[data-svg]'), raw, r, q);
      const kv = body.querySelector('[data-kv]');
      const valid = wordSet.has(raw);
      const count = r.ok ? r.node.n : 0;
      kv.innerHTML = raw ? `
        <span>search("${raw}") <b style="color:${valid ? '#8fd19e' : '#ff8f8f'}">${valid ? 'true' : 'false'}</b></span>
        <span>${suffix ? L('palabras que terminan en', 'words ending in') : L('palabras que empiezan con', 'words starting with')} "${raw}" <b>${count.toLocaleString(L('es-CO', 'en-US'))}</b></span>
        <span>calcularPuntajePalabra <b>${score(raw)}</b></span>` : '';
      const list = [];
      if (r.ok) collect(r.node, key, list, 60);
      const shown = suffix ? list.map(w => [...w].reverse().join('')) : list;
      body.querySelector('[data-sub]').textContent = raw && r.ok ? (suffix ? 'ReverseTrie::wordsWithSuffix' : 'Trie::wordsWithPrefix') + ` → ${Math.min(60, count)} ${L('de', 'of')} ${count.toLocaleString(L('es-CO', 'en-US'))}` : (raw ? L('Ninguna palabra del diccionario sigue ese camino.', 'No word in the dictionary follows that path.') : '');
      const chips = body.querySelector('[data-chips]');
      chips.innerHTML = '';
      shown.forEach(w => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'chip';
        b.innerHTML = `${w}<small>${score(w)}</small>`; b.onclick = () => { q.value = w; update(q); };
        chips.appendChild(b);
      });
    }
    function drawTrie(svg, raw, r, q) {
      svg.innerHTML = '';
      const letters = suffix ? [...raw].reverse() : [...raw];
      const n = r.path.length; // nodos recorridos incluyendo la raíz
      const step = Math.min(64, 760 / Math.max(1, letters.length + 1));
      const y = 60, x0 = 40;
      const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; };
      // raíz
      mk('circle', { cx: x0, cy: y, r: 16, fill: '#0d1626', stroke: '#93a2bc', 'stroke-width': 2 });
      mk('text', { x: x0, y: y + 4, 'text-anchor': 'middle', 'font-size': 11, fill: '#93a2bc', 'font-family': 'Martian Mono, monospace' }).textContent = 'root';
      let lastX = x0;
      letters.forEach((ch, i) => {
        const x = x0 + (i + 1) * step, ok = i + 1 < n, node = r.path[i + 1];
        mk('line', { x1: lastX + 16, y1: y, x2: x - 16, y2: y, stroke: ok ? '#ffb454' : '#ff8f8f', 'stroke-width': 2, 'stroke-dasharray': ok ? '' : '4 4' });
        mk('circle', { cx: x, cy: y, r: 16, fill: ok ? '#ffb454' : '#0d1626', stroke: ok ? '#ffb454' : '#ff8f8f', 'stroke-width': 2 });
        if (ok && node.e) mk('circle', { cx: x, cy: y, r: 21, fill: 'none', stroke: '#8fd19e', 'stroke-width': 2 });
        mk('text', { x, y: y + 5, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: ok ? '#0d1626' : '#ff8f8f', 'font-family': 'Martian Mono, monospace' }).textContent = ch;
        lastX = x;
      });
      // hijos del último nodo válido
      if (!r.ok) return;
      const last = r.path[r.path.length - 1];
      const kids = Object.keys(last.c).sort();
      if (!kids.length) {
        mk('text', { x: lastX, y: y + 60, 'text-anchor': 'middle', 'font-size': 12, fill: '#93a2bc', 'font-family': 'IBM Plex Sans, sans-serif' }).textContent = L('hoja: no hay más letras', 'leaf: no more letters');
        return;
      }
      const span = Math.min(860, kids.length * 34), sx = Math.max(20, Math.min(900 - span - 10, lastX - span / 2));
      kids.forEach((ch, i) => {
        const x = sx + (kids.length === 1 ? span / 2 : (i * span) / (kids.length - 1 || 1));
        const yy = 170, child = last.c[ch];
        mk('line', { x1: lastX, y1: y + 16, x2: x, y2: yy - 14, stroke: '#2b3d63', 'stroke-width': 1.2 });
        const g = document.createElementNS(NS, 'g'); g.style.cursor = 'pointer'; g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
        g.setAttribute('aria-label', `${L('agregar', 'add')} ${ch}`);
        const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', yy); c.setAttribute('r', 13);
        c.setAttribute('fill', '#0d1626'); c.setAttribute('stroke', child.e ? '#8fd19e' : '#7cc4f5'); c.setAttribute('stroke-width', 2);
        const t = document.createElementNS(NS, 'text'); t.setAttribute('x', x); t.setAttribute('y', yy + 4); t.setAttribute('text-anchor', 'middle');
        t.setAttribute('font-size', 12); t.setAttribute('font-weight', 700); t.setAttribute('fill', '#e2e8f2'); t.setAttribute('font-family', 'Martian Mono, monospace'); t.textContent = ch;
        const cnt = document.createElementNS(NS, 'text'); cnt.setAttribute('x', x); cnt.setAttribute('y', yy + 30); cnt.setAttribute('text-anchor', 'middle');
        cnt.setAttribute('font-size', 9); cnt.setAttribute('fill', '#93a2bc'); cnt.setAttribute('font-family', 'Martian Mono, monospace'); cnt.textContent = child.n;
        g.append(c, t, cnt);
        const add = () => { q.value = suffix ? ch + q.value : q.value + ch; update(q); };
        g.addEventListener('click', add);
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); add(); } });
        svg.appendChild(g);
      });
    }

    // ---------------- Posibles palabras ----------------
    function draw7() { let s = ''; for (let i = 0; i < 7; i++) s += Math.random() < 0.04 ? '?' : BAG[Math.floor(Math.random() * BAG.length)]; return s; }
    function renderRack() {
      body.innerHTML = `
        <p class="hint">${L('Estas son tus 7 fichas. posiblesPalabras recorre todo el diccionario y, para cada palabra, va gastando las letras disponibles; el signo ? es un comodín que vale por cualquier letra y suma 0 puntos.',
          'These are your 7 tiles. posiblesPalabras walks the whole dictionary and, for each word, spends the available letters; ? is a wildcard that stands for any letter and scores 0 points.')}</p>
        <div class="demo-row">
          <input type="text" data-rack value="${draw7()}" maxlength="10" autocomplete="off" spellcheck="false" aria-label="${L('Fichas disponibles', 'Available tiles')}" style="width:10rem;letter-spacing:.2em">
          <button class="ctl" type="button" data-draw>${L('Sacar otras fichas', 'Draw new tiles')}</button>
          <button class="ctl primary" type="button" data-go>${L('Buscar palabras', 'Find words')}</button>
        </div>
        <div class="kv" data-kv></div>
        <div class="chips" data-chips></div>`;
      const rack = body.querySelector('[data-rack]');
      body.querySelector('[data-draw]').onclick = () => { rack.value = draw7(); run(); };
      body.querySelector('[data-go]').onclick = run;
      rack.addEventListener('input', () => { rack.value = rack.value.toLowerCase().replace(/[^a-z?]/g, ''); });
      rack.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
      function run() {
        const letters = rack.value;
        const t0 = performance.now();
        const counts = new Array(26).fill(0); let wild = 0;
        for (const c of letters) { if (c === '?') wild++; else counts[c.charCodeAt(0) - 97]++; }
        const found = [];
        for (const w of words) {
          if (w.length > letters.length) continue;
          const need = counts.slice(); let used = 0, ok = true, pts = 0;
          for (const ch of w) {
            const k = ch.charCodeAt(0) - 97;
            if (need[k] > 0) { need[k]--; pts += SCORES[ch]; }
            else if (wild > used) used++;
            else { ok = false; break; }
          }
          if (ok) found.push([w, pts]);
        }
        const ms = performance.now() - t0;
        found.sort((a, b) => b[1] - a[1] || b[0].length - a[0].length);
        body.querySelector('[data-kv]').innerHTML = `<span>${L('palabras revisadas', 'words checked')} <b>${words.length.toLocaleString(L('es-CO', 'en-US'))}</b></span><span>${L('encontradas', 'found')} <b>${found.length}</b></span><span>${L('tiempo', 'time')} <b>${ms.toFixed(1)} ms</b></span>${found[0] ? `<span>${L('mejor jugada', 'best play')} <b style="color:#8fd19e">${found[0][0]} (${found[0][1]})</b></span>` : ''}`;
        const chips = body.querySelector('[data-chips]');
        chips.innerHTML = found.length ? '' : `<span class="dim" style="color:var(--muted)">${L('No se encontraron palabras que se puedan formar con las letras dadas.', 'No words can be formed with the given letters.')}</span>`;
        found.slice(0, 80).forEach(([w, p]) => { const s = document.createElement('span'); s.className = 'chip'; s.style.cursor = 'default'; s.innerHTML = `${w}<small>${p}</small>`; chips.appendChild(s); });
      }
      run();
    }

    // ---------------- Grafo de palabras ----------------
    function neighbors(w) {
      const out = [];
      for (let i = 0; i < w.length; i++) for (let k = 0; k < 26; k++) {
        const ch = String.fromCharCode(97 + k); if (ch === w[i]) continue;
        const v = w.slice(0, i) + ch + w.slice(i + 1); if (wordSet.has(v)) out.push(v);
      }
      return out;
    }
    function bfs(a, b) {
      if (a.length !== b.length) return null;
      const prev = new Map([[a, null]]), q = [a];
      while (q.length) {
        const u = q.shift(); if (u === b) break;
        for (const v of neighbors(u)) if (!prev.has(v)) { prev.set(v, u); q.push(v); }
      }
      if (!prev.has(b)) return null;
      const p = []; for (let x = b; x; x = prev.get(x)) p.unshift(x);
      return { p, seen: prev.size };
    }
    function renderGraph() {
      body.innerHTML = `
        <p class="hint">${L('En GrafoPalabra dos palabras están conectadas si tienen el mismo largo y cambian en una sola letra (sonConectadas). Toca un vecino para moverte por el grafo, o busca el camino más corto entre dos palabras.',
          'In GrafoPalabra two words are connected if they have the same length and differ in exactly one letter (sonConectadas). Tap a neighbor to move through the graph, or find the shortest path between two words.')}</p>
        <div class="demo-split">
          <div>
            <div class="demo-row"><input type="text" data-w value="cold" maxlength="10" autocomplete="off" spellcheck="false" aria-label="${L('Palabra', 'Word')}" style="width:10rem"></div>
            <div class="kv" data-kv></div>
            <div class="chips" data-n></div>
          </div>
          <div>
            <div class="demo-row">
              <input type="text" data-a value="cold" maxlength="10" aria-label="${L('Desde', 'From')}" style="width:7rem" spellcheck="false">
              <span style="color:var(--muted)">→</span>
              <input type="text" data-b value="warm" maxlength="10" aria-label="${L('Hasta', 'To')}" style="width:7rem" spellcheck="false">
              <button class="ctl primary" type="button" data-go>${L('Camino más corto', 'Shortest path')}</button>
            </div>
            <div class="out" data-out></div>
          </div>
        </div>`;
      const w = body.querySelector('[data-w]');
      const show = () => {
        const v = w.value.toLowerCase().replace(/[^a-z]/g, ''); w.value = v;
        const ns = wordSet.has(v) ? neighbors(v) : [];
        body.querySelector('[data-kv]').innerHTML = `<span>"${v}" ${wordSet.has(v) ? `<b style="color:#8fd19e">${L('está en el diccionario', 'is in the dictionary')}</b>` : `<b style="color:#ff8f8f">${L('no está en el diccionario', 'is not in the dictionary')}</b>`}</span><span>${L('vecinos', 'neighbors')} <b>${ns.length}</b></span>`;
        const box = body.querySelector('[data-n]'); box.innerHTML = '';
        ns.forEach(x => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = x; b.onclick = () => { w.value = x; show(); }; box.appendChild(b); });
      };
      w.addEventListener('input', show); show();
      const out = body.querySelector('[data-out]');
      const go = () => {
        const a = body.querySelector('[data-a]').value.toLowerCase().trim(), b = body.querySelector('[data-b]').value.toLowerCase().trim();
        if (!wordSet.has(a) || !wordSet.has(b)) { out.innerHTML = `<span class="bad">${L('Las dos palabras deben estar en el diccionario.', 'Both words must be in the dictionary.')}</span>`; return; }
        if (a.length !== b.length) { out.innerHTML = `<span class="bad">${L('Solo se conectan palabras del mismo largo.', 'Only words of the same length are connected.')}</span>`; return; }
        const t0 = performance.now(), r = bfs(a, b), ms = performance.now() - t0;
        out.innerHTML = r
          ? `<span class="dim">${L('Búsqueda en anchura (BFS)', 'Breadth-first search (BFS)')}</span>\n${r.p.map((x, i) => `${String(i).padStart(2)}  <span class="${i === 0 || i === r.p.length - 1 ? 'am' : ''}">${x}</span>`).join('\n')}\n\n${L('pasos', 'steps')}: <b>${r.p.length - 1}</b>  ·  ${L('palabras visitadas', 'words visited')}: <b>${r.seen}</b>  ·  <b>${ms.toFixed(1)} ms</b>`
          : `<span class="bad">${L('No hay camino entre esas palabras.', 'There is no path between those words.')}</span>\n<span class="dim">${L('Están en componentes distintas del grafo.', 'They are in different components of the graph.')}</span>`;
      };
      body.querySelector('[data-go]').onclick = go; go();
    }
  }

  window.PortfolioDemos = window.PortfolioDemos || {};
  window.PortfolioDemos.scrabble = mount;
})();
