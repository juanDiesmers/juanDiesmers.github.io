// Juego de la Vida de Conway en el fondo del encabezado.
// Reglas B3/S23 sobre una cuadrícula toroidal (los bordes se conectan).
(function () {
  const canvas = document.getElementById('life');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const toggle = document.getElementById('life-toggle');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CELL = 14;          // tamaño de cada célula en px
  const GAP = 2;            // separación entre células
  const TICK = 140;         // ms por generación
  let cols = 0, rows = 0, grid, next, age;
  let running = !reduce, visible = true, last = 0, dpr = 1;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const nc = Math.ceil(r.width / CELL), nr = Math.ceil(r.height / CELL);
    if (nc === cols && nr === rows) { draw(); return; }
    const old = grid, oc = cols, or = rows;
    cols = nc; rows = nr;
    grid = new Uint8Array(cols * rows);
    next = new Uint8Array(cols * rows);
    age = new Uint16Array(cols * rows);
    if (old) {
      for (let y = 0; y < Math.min(or, rows); y++)
        for (let x = 0; x < Math.min(oc, cols); x++) grid[y * cols + x] = old[y * oc + x];
    } else seed();
    draw();
  }

  function seed() {
    for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.16 ? 1 : 0;
  }

  function step() {
    for (let y = 0; y < rows; y++) {
      const yu = ((y - 1 + rows) % rows) * cols, yc = y * cols, yd = ((y + 1) % rows) * cols;
      for (let x = 0; x < cols; x++) {
        const xl = (x - 1 + cols) % cols, xr = (x + 1) % cols;
        const n = grid[yu + xl] + grid[yu + x] + grid[yu + xr] +
                  grid[yc + xl] + grid[yc + xr] +
                  grid[yd + xl] + grid[yd + x] + grid[yd + xr];
        const i = yc + x, alive = grid[i];
        const live = alive ? (n === 2 || n === 3) : n === 3;
        next[i] = live ? 1 : 0;
        age[i] = live ? (alive ? Math.min(age[i] + 1, 60) : 0) : 0;
      }
    }
    [grid, next] = [next, grid];
    // Si la población se apaga, sembrar de nuevo para que nunca quede vacío.
    let pop = 0;
    for (let i = 0; i < grid.length; i++) pop += grid[i];
    if (pop < grid.length * 0.02) seed();
  }

  function draw() {
    const w = canvas.width / dpr, h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    const s = CELL - GAP;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (!grid[i]) continue;
        // Las células recién nacidas brillan en ámbar y se enfrían con la edad.
        const a = age[i];
        ctx.fillStyle = a < 2 ? 'rgba(255,180,84,0.55)' : a < 6 ? 'rgba(255,180,84,0.28)' : 'rgba(80,110,160,0.35)';
        ctx.fillRect(x * CELL, y * CELL, s, s);
      }
    }
  }

  function loop(t) {
    if (running && visible && t - last > TICK) { step(); draw(); last = t; }
    requestAnimationFrame(loop);
  }

  // Dibujar con el mouse o el dedo
  let painting = false;
  function paint(e) {
    const r = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) / CELL), y = Math.floor((e.clientY - r.top) / CELL);
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    // Un pequeño "planeador" alrededor del punto para que el clic se note
    const pts = [[0, -1], [1, 0], [-1, 1], [0, 1], [1, 1]];
    for (const [dx, dy] of pts) {
      const xx = (x + dx + cols) % cols, yy = (y + dy + rows) % rows;
      grid[yy * cols + xx] = 1; age[yy * cols + xx] = 0;
    }
    draw();
  }
  canvas.addEventListener('pointerdown', e => { painting = true; paint(e); });
  canvas.addEventListener('pointermove', e => { if (painting) paint(e); });
  window.addEventListener('pointerup', () => { painting = false; });

  function label() {
    if (!toggle) return;
    const key = running ? 'hero.pause' : 'hero.play';
    const es = running ? 'pausar' : 'reproducir';
    toggle.dataset.i18n = key;
    toggle.textContent = window.I18N ? window.I18N.t(key, es) : es;
  }
  if (toggle) toggle.addEventListener('click', () => { running = !running; label(); });
  document.addEventListener('langchange', label);
  document.addEventListener('DOMContentLoaded', label);

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
})();
