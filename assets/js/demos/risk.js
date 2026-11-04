// Demo interactiva de ProyectoEstructuraDatos_R.I.S.K
// Reimplementa en JavaScript la lógica del proyecto en C++:
//  - realizarAtaques: dados de ataque contra dados de defensa, ordenados y comparados en pares
//  - calcularCostoConquista: Dijkstra sobre las conexiones enemigas, el peso es la cantidad de ejércitos
//  - Huffman: compresión del archivo de guardado
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  // Territorios de América (los nombres son los del proyecto original)
  const T = [
    { id: 0, n: 'Alaska', c: 'America del Norte', x: 60, y: 70 },
    { id: 1, n: 'Territorio Noroccidental', c: 'America del Norte', x: 175, y: 60 },
    { id: 2, n: 'Groenlandia', c: 'America del Norte', x: 395, y: 40 },
    { id: 3, n: 'Alberta', c: 'America del Norte', x: 135, y: 140 },
    { id: 4, n: 'Ontario', c: 'America del Norte', x: 245, y: 140 },
    { id: 5, n: 'Quebec', c: 'America del Norte', x: 355, y: 135 },
    { id: 6, n: 'Estados Unidos Occidentales', c: 'America del Norte', x: 150, y: 220 },
    { id: 7, n: 'Estados Unidos Orientales', c: 'America del Norte', x: 290, y: 225 },
    { id: 8, n: 'America Central', c: 'America del Norte', x: 205, y: 300 },
    { id: 9, n: 'Venezuela', c: 'America del Sur', x: 270, y: 370 },
    { id: 10, n: 'Peru', c: 'America del Sur', x: 235, y: 450 },
    { id: 11, n: 'Brasil', c: 'America del Sur', x: 375, y: 430 },
    { id: 12, n: 'Argentina', c: 'America del Sur', x: 300, y: 520 }
  ];
  const EDGES = [[0,1],[0,3],[1,3],[1,4],[1,2],[2,4],[2,5],[3,4],[3,6],[4,5],[4,6],[4,7],[5,7],[6,7],[6,8],[7,8],[8,9],[9,10],[9,11],[10,11],[10,12],[11,12]];
  const ADJ = T.map(() => []);
  EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });
  const SHORT = { 'Territorio Noroccidental': 'T. Noroccidental', 'Estados Unidos Occidentales': 'EE. UU. Occ.', 'Estados Unidos Orientales': 'EE. UU. Or.', 'America Central': 'América Central', 'Peru': 'Perú' };

  const COLORS = { 1: '#ffb454', 2: '#7cc4f5' };

  function mount(root, { L }) {
    let owner = [], units = [], mode = 'combat', sel = null, target = null, path = [], visited = [];
    const players = { 1: L('Tú', 'You'), 2: L('Rival', 'Rival') };

    root.innerHTML = `
      <div class="demo-head">
        <h4>${L('Pruébalo', 'Try it')}</h4>
        <div class="demo-tabs" role="tablist">
          <button role="tab" data-m="combat" aria-selected="true">${L('Combate', 'Combat')}</button>
          <button role="tab" data-m="cost" aria-selected="false">${L('Costo de conquista', 'Conquest cost')}</button>
          <button role="tab" data-m="save" aria-selected="false">${L('Guardar comprimido', 'Compressed save')}</button>
        </div>
      </div>
      <div class="demo-body">
        <p class="hint" data-hint></p>
        <div class="demo-split">
          <div>
            <svg viewBox="0 0 460 560" data-map role="img" aria-label="${L('Mapa de territorios de América conectados como grafo', 'Map of American territories connected as a graph')}"></svg>
            <div class="kv"><span><b style="color:${COLORS[1]}">●</b> ${players[1]}: <b data-c1>0</b> ${L('territorios', 'territories')}</span><span><b style="color:${COLORS[2]}">●</b> ${players[2]}: <b data-c2>0</b></span></div>
          </div>
          <div>
            <div class="demo-row" data-actions></div>
            <div class="out" data-out aria-live="polite"></div>
          </div>
        </div>
      </div>`;

    const $ = s => root.querySelector(s);
    const svg = $('[data-map]'), out = $('[data-out]'), actions = $('[data-actions]'), hint = $('[data-hint]');

    function deal() {
      const ids = T.map(t => t.id).sort(() => Math.random() - 0.5);
      owner = []; units = [];
      ids.forEach((id, k) => { owner[id] = k % 2 ? 2 : 1; units[id] = 1 + Math.floor(Math.random() * 5); });
      sel = target = null; path = []; visited = [];
    }

    function log(html, clear) { if (clear) out.innerHTML = ''; out.innerHTML += html + '\n'; out.scrollTop = out.scrollHeight; }
    function name(id) { return T[id].n; }
    // Igual que Grafo::ObtenerConexionesEnemigas: vecinos que no son del jugador
    const enemyNeighbors = (id, player) => ADJ[id].filter(v => owner[v] !== player);

    // ---------- Dibujo del grafo ----------
    function draw() {
      svg.innerHTML = '';
      const onPath = new Set();
      for (let i = 0; i + 1 < path.length; i++) onPath.add(path[i] + '-' + path[i + 1]).add(path[i + 1] + '-' + path[i]);
      EDGES.forEach(([a, b]) => {
        const l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', T[a].x); l.setAttribute('y1', T[a].y); l.setAttribute('x2', T[b].x); l.setAttribute('y2', T[b].y);
        const hot = onPath.has(a + '-' + b);
        const enemyEdge = sel != null && ((a === sel && owner[b] !== owner[sel]) || (b === sel && owner[a] !== owner[sel]));
        l.setAttribute('stroke', hot ? '#8fd19e' : enemyEdge ? '#ffb454' : '#2b3d63');
        l.setAttribute('stroke-width', hot ? 4 : enemyEdge ? 2.5 : 1.5);
        if (enemyEdge && !hot) l.setAttribute('stroke-dasharray', '5 4');
        svg.appendChild(l);
      });
      T.forEach(t => {
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
        g.setAttribute('aria-label', `${t.n}, ${players[owner[t.id]]}, ${units[t.id]} ${L('ejércitos', 'armies')}`);
        g.style.cursor = 'pointer';
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', t.x); c.setAttribute('cy', t.y); c.setAttribute('r', 19);
        const isSel = t.id === sel, isTarget = t.id === target, isVisited = visited.includes(t.id);
        c.setAttribute('fill', isSel || isTarget ? COLORS[owner[t.id]] : '#0d1626');
        c.setAttribute('stroke', COLORS[owner[t.id]]);
        c.setAttribute('stroke-width', isSel || isTarget ? 3 : isVisited ? 3 : 2);
        if (isVisited && !isSel && !isTarget) c.setAttribute('stroke-dasharray', '3 3');
        const num = document.createElementNS(NS, 'text');
        num.setAttribute('x', t.x); num.setAttribute('y', t.y + 5); num.setAttribute('text-anchor', 'middle');
        num.setAttribute('font-family', 'Martian Mono, monospace'); num.setAttribute('font-size', '14'); num.setAttribute('font-weight', '700');
        num.setAttribute('fill', isSel || isTarget ? '#0d1626' : '#e2e8f2'); num.textContent = units[t.id];
        const lab = document.createElementNS(NS, 'text');
        lab.setAttribute('x', t.x); lab.setAttribute('y', t.y + 36); lab.setAttribute('text-anchor', 'middle');
        lab.setAttribute('font-family', 'IBM Plex Sans, sans-serif'); lab.setAttribute('font-size', '12');
        lab.setAttribute('fill', '#93a2bc'); lab.setAttribute('stroke', '#132036'); lab.setAttribute('stroke-width', '4'); lab.setAttribute('paint-order', 'stroke'); lab.textContent = SHORT[t.n] || t.n;
        g.append(c, num, lab);
        g.addEventListener('click', () => clickTerritory(t.id));
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickTerritory(t.id); } });
        svg.appendChild(g);
      });
      $('[data-c1]').textContent = owner.filter(o => o === 1).length;
      $('[data-c2]').textContent = owner.filter(o => o === 2).length;
    }

    function btn(label, fn, primary) {
      const b = document.createElement('button');
      b.className = 'ctl' + (primary ? ' primary' : ''); b.type = 'button'; b.textContent = label; b.onclick = fn;
      actions.appendChild(b); return b;
    }

    // ---------- Modo combate ----------
    function rollDice(n) { return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6)).sort((a, b) => b - a); }
    function attack(from, to) {
      const atkPlayer = owner[from];
      // El código original lanza 3 dados de ataque contra 2 de defensa;
      // aquí se limitan a los ejércitos disponibles para que no queden negativos.
      const da = Math.min(3, units[from] - 1), dd = Math.min(2, units[to]);
      const ra = rollDice(da), rd = rollDice(dd);
      let lostA = 0, lostD = 0;
      for (let i = 0; i < Math.min(da, dd); i++) { if (ra[i] > rd[i]) lostD++; else lostA++; }
      units[from] -= lostA; units[to] -= lostD;
      log(`<span class="dim">${players[atkPlayer]}: ${name(from)} → ${name(to)}</span>`);
      log(`Lanzando dados:\nResultado de los dados de ataque:  <span class="am">${ra.join(' ')}</span>\nResultado de los dados de defensa: <span class="sk">${rd.join(' ')}</span>`);
      log(`Unidades perdidas por el atacante: <b>${lostA}</b>\nUnidades perdidas por el defensor: <b>${lostD}</b>`);
      if (units[to] <= 0) {
        const move = Math.max(1, Math.min(da, units[from] - 1));
        owner[to] = atkPlayer; units[to] = move; units[from] -= move;
        log(`<span class="ok">${L('¡Conquistado!', 'Conquered!')} ${name(to)} ${L('ahora es de', 'now belongs to')} ${players[atkPlayer]} (${move} ${L('ejércitos se mueven', 'armies move in')})</span>`);
        sel = to;
      }
      log('');
      checkWin();
    }
    function checkWin() {
      const c1 = owner.filter(o => o === 1).length;
      if (c1 === 0 || c1 === T.length) log(`<span class="ok">${c1 ? L('Ganaste: controlas toda América.', 'You win: you control all of the Americas.') : L('El rival conquistó todo.', 'The rival conquered everything.')}</span>`);
    }
    function rivalTurn() {
      sel = target = null;
      const options = [];
      T.forEach(t => { if (owner[t.id] === 2 && units[t.id] >= 2) enemyNeighbors(t.id, 2).forEach(v => options.push([t.id, v, units[t.id] - units[v]])); });
      // Reclamar unidades: territorios controlados / 3 (mínimo 1)
      const own = T.filter(t => owner[t.id] === 2);
      if (own.length) {
        const extra = Math.max(1, Math.floor(own.length / 3));
        const front = own.filter(t => enemyNeighbors(t.id, 2).length).sort((a, b) => units[b.id] - units[a.id])[0] || own[0];
        units[front.id] += extra;
        log(`<span class="dim">${players[2]} ${L('reclama', 'claims')} ${extra} ${L('unidades en', 'units on')} ${front.n}</span>`);
      }
      if (!options.length) { log(L('El rival no tiene ataques posibles.', 'The rival has no possible attacks.')); draw(); return; }
      options.sort((a, b) => b[2] - a[2]);
      attack(options[0][0], options[0][1]);
      sel = null; draw();
    }
    function reinforce() {
      const own = T.filter(t => owner[t.id] === 1);
      if (sel == null || owner[sel] !== 1) { log(L('Primero elige uno de tus territorios.', 'First pick one of your territories.')); return; }
      const extra = Math.max(1, Math.floor(own.length / 3));
      units[sel] += extra;
      log(`El jugador con ID 1 puede reclamar <b>${extra}</b> unidades <span class="dim">(${own.length} ${L('territorios', 'territories')} / 3) → ${name(sel)}</span>`);
      draw();
    }

    // ---------- Modo costo de conquista (Dijkstra) ----------
    function dijkstra(start, goal, player) {
      const cost = { [start]: 0 }, prev = {}, order = [];
      const pq = [[0, start]];
      while (pq.length) {
        pq.sort((a, b) => a[0] - b[0]);
        const [c, u] = pq.shift();
        if (c > cost[u]) continue;
        order.push(u);
        if (u === goal) break;
        for (const v of enemyNeighbors(u, player)) {
          const nc = c + units[v];
          if (cost[v] == null || nc < cost[v]) { cost[v] = nc; prev[v] = u; pq.push([nc, v]); }
        }
      }
      if (cost[goal] == null) return null;
      const p = [goal]; while (p[0] !== start) p.unshift(prev[p[0]]);
      return { cost: cost[goal], path: p, order, all: cost };
    }
    function showCost(from, to) {
      const r = dijkstra(from, to, 1);
      out.innerHTML = '';
      if (!r) { log(L('No hay ruta a través de territorios enemigos.', 'There is no route through enemy territories.')); path = []; visited = []; draw(); return; }
      path = r.path; visited = r.order;
      log(`<span class="dim">calcularCostoConquista(${name(from)}, ${name(to)})</span>`);
      log(`${L('Orden en que Dijkstra sacó nodos de la cola', 'Order Dijkstra popped nodes from the queue')}:`);
      r.order.forEach((id, k) => log(`  ${k + 1}. ${name(id)}  <span class="am">${L('costo', 'cost')} ${r.all[id]}</span>`));
      log(`\n${L('Ruta', 'Route')}: <span class="ok">${r.path.map(name).join(' → ')}</span>`);
      log(`${L('Costo de la conquista', 'Conquest cost')}: <b>${r.cost}</b> ${r.cost === 1 ? L('ejército enemigo', 'enemy army') : L('ejércitos enemigos', 'enemy armies')}`);
      draw();
    }
    function cheapest() {
      let best = null;
      T.forEach(a => { if (owner[a.id] !== 1) return; T.forEach(b => { if (owner[b.id] === 1) return; const r = dijkstra(a.id, b.id, 1); if (r && (!best || r.cost < best.r.cost)) best = { a: a.id, b: b.id, r }; }); });
      if (!best) { log(L('No queda nada por conquistar.', 'Nothing left to conquer.'), true); return; }
      sel = best.a; target = best.b; showCost(best.a, best.b);
      log(`<span class="ok">conquistaMasBarata: ${name(best.b)}</span>`);
    }

    // ---------- Modo guardar con Huffman ----------
    function saveText() {
      let s = '';
      [1, 2].forEach(p => {
        s += `JUGADOR\nID: ${p}\nNombre: ${p === 1 ? 'Juan' : 'Rival'}\nColor: ${p === 1 ? 'amarillo' : 'azul'}\nTerritorios\n`;
        T.filter(t => owner[t.id] === p).forEach(t => {
          s += `  ID: ${t.id}\n  Nombre: ${t.n}\n  PerteneceJugador: ${p}\n  Unidades de Ejercito: ${units[t.id]}\n  Continente: ${t.c}\n  Territorios Vecinos: ${ADJ[t.id].join(' ')} \n\n`;
        });
        s += '\n';
      });
      return s;
    }
    function huffman(text) {
      const freq = {}; for (const ch of text) freq[ch] = (freq[ch] || 0) + 1;
      let pq = Object.entries(freq).map(([ch, f]) => ({ ch, f }));
      while (pq.length > 1) {
        pq.sort((a, b) => a.f - b.f);
        const l = pq.shift(), r = pq.shift();
        pq.push({ f: l.f + r.f, l, r });
      }
      const codes = {};
      (function enc(n, s) { if (!n) return; if (!n.l && !n.r) { codes[n.ch] = s || '1'; return; } enc(n.l, s + '0'); enc(n.r, s + '1'); })(pq[0], '');
      return { freq, codes };
    }
    function showSave() {
      const text = saveText(), { freq, codes } = huffman(text);
      const bits = [...text].map(c => codes[c]).join('');
      const orig = new TextEncoder().encode(text).length * 8;
      const vis = c => c === ' ' ? '␠' : c === '\n' ? '↵' : c;
      const rows = Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 14);
      out.innerHTML = '';
      log(`<span class="dim">guardarPartidaComprimida("partida.bin")</span>\n`);
      log(`${L('Texto de la partida', 'Saved game text')}: <b>${text.length}</b> ${L('caracteres', 'characters')} = <b>${orig}</b> bits`);
      log(`${L('Comprimido con Huffman', 'Huffman compressed')}: <b class="ok">${bits.length}</b> bits  <span class="ok">(${Math.round((1 - bits.length / orig) * 100)}% ${L('menos', 'smaller')})</span>\n`);
      log(`<span class="dim">${L('carácter  veces  código', 'char      count  code')}</span>`);
      rows.forEach(c => log(`  ${vis(c).padEnd(6)}  ${String(freq[c]).padStart(5)}  <span class="am">${codes[c]}</span>`));
      log(`<span class="dim">  … ${Object.keys(freq).length - rows.length} ${L('caracteres más', 'more characters')}</span>\n`);
      log(`${L('Primeros bits del archivo', 'First bits of the file')}:\n<span class="sk">${bits.slice(0, 192).replace(/(.{8})/g, '$1 ')}</span>…`);
      log(`\n<span class="dim">${L('Inicio del texto original', 'Start of the original text')}:</span>\n${text.slice(0, 220).replace(/</g, '&lt;')}…`);
    }

    // ---------- Interacción ----------
    function clickTerritory(id) {
      if (mode === 'combat') {
        if (owner[id] === 1) {
          sel = id; target = null; path = []; visited = [];
          const en = enemyNeighbors(id, 1);
          log(`${name(id)} <span class="dim">(${units[id]} ${L('ejércitos', 'armies')})</span> · ${L('vecinos enemigos', 'enemy neighbors')}: ${en.length ? en.map(name).join(', ') : L('ninguno', 'none')}`, true);
          if (units[id] < 2) log(`<span class="bad">${L('Necesitas al menos 2 ejércitos para atacar desde aquí.', 'You need at least 2 armies to attack from here.')}</span>`);
          draw();
        } else if (sel != null && owner[sel] === 1) {
          if (!ADJ[sel].includes(id)) { log(`<span class="bad">${name(id)} ${L('no es vecino de', 'is not adjacent to')} ${name(sel)}.</span>`); return; }
          if (units[sel] < 2) { log(`<span class="bad">${L('Necesitas al menos 2 ejércitos para atacar.', 'You need at least 2 armies to attack.')}</span>`); return; }
          attack(sel, id); draw();
        } else log(L('Primero elige uno de tus territorios (ámbar).', 'First pick one of your territories (amber).'), true);
      } else if (mode === 'cost') {
        if (owner[id] === 1) { sel = id; target = null; path = []; visited = []; log(`${L('Origen', 'Origin')}: ${name(id)}. ${L('Ahora elige un territorio enemigo.', 'Now pick an enemy territory.')}`, true); draw(); }
        else if (sel != null) { target = id; showCost(sel, id); }
        else log(L('Primero elige el territorio de origen (ámbar).', 'First pick the origin territory (amber).'), true);
      }
    }

    function setMode(m) {
      mode = m; sel = target = null; path = []; visited = [];
      root.querySelectorAll('[role="tab"]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.m === m)));
      actions.innerHTML = '';
      if (m === 'combat') {
        hint.textContent = L('Haz clic en uno de tus territorios (ámbar) y luego en un vecino enemigo para atacar. Se lanzan hasta 3 dados contra 2, se ordenan de mayor a menor y se comparan en pares: el empate lo gana el defensor.',
          'Click one of your territories (amber), then an enemy neighbor to attack. Up to 3 dice are rolled against 2, sorted high to low and compared in pairs: ties go to the defender.');
        btn(L('Reclamar unidades', 'Claim units'), reinforce);
        btn(L('Turno del rival', "Rival's turn"), rivalTurn, true);
        btn(L('Repartir de nuevo', 'Deal again'), () => { deal(); draw(); log(L('Territorios repartidos al azar.', 'Territories dealt at random.'), true); });
        log(L('Elige un territorio tuyo para empezar.', 'Pick one of your territories to start.'), true);
      } else if (m === 'cost') {
        hint.textContent = L('Elige uno de tus territorios y luego cualquier territorio enemigo. Dijkstra busca la ruta por territorios enemigos que obliga a derrotar menos ejércitos: el número de cada círculo es el peso.',
          'Pick one of your territories, then any enemy territory. Dijkstra finds the route through enemy territories that requires defeating the fewest armies: the number in each circle is the weight.');
        btn(L('Conquista más barata', 'Cheapest conquest'), cheapest, true);
        log(L('Elige el territorio de origen.', 'Pick the origin territory.'), true);
      } else {
        hint.textContent = L('La partida se guarda como texto y luego se comprime con un árbol de Huffman: los caracteres más frecuentes reciben códigos más cortos. Juega un poco en Combate y vuelve para ver cómo cambia.',
          'The game is saved as text and then compressed with a Huffman tree: the most frequent characters get shorter codes. Play a bit in Combat and come back to see how it changes.');
        btn(L('Guardar partida', 'Save game'), showSave, true);
        showSave();
      }
      draw();
    }
    root.querySelectorAll('[role="tab"]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.m)));

    deal();
    setMode('combat');
  }

  window.PortfolioDemos = window.PortfolioDemos || {};
  window.PortfolioDemos.risk = mount;
})();
