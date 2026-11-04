// Demo interactiva de SimpleEqProyectoAvanzada
// La misma cadena del plugin en JUCE (LowCut -> Peak -> HighCut), hecha con la Web Audio API:
//  - cada corte son hasta 4 filtros de 2º orden en serie (12, 24, 36 o 48 dB/oct), con los Q de un Butterworth
//  - el pico es un filtro peaking con frecuencia, ganancia y Q
// La curva se calcula con getFrequencyResponse de cada filtro, igual que el editor del plugin.
(function () {
  const FMIN = 20, FMAX = 20000, DB = 24;

  // Q de cada etapa de 2º orden de un Butterworth de orden N
  function butterQs(order) {
    const qs = [];
    for (let i = 0; i < order / 2; i++) qs.push(1 / (2 * Math.cos(Math.PI * (2 * i + 1) / (2 * order))));
    return qs;
  }
  const fToX = (f, w) => (Math.log(f / FMIN) / Math.log(FMAX / FMIN)) * w;
  const xToF = (x, w) => FMIN * Math.pow(FMAX / FMIN, Math.min(1, Math.max(0, x / w)));
  const sliderToF = v => FMIN * Math.pow(FMAX / FMIN, v / 1000);
  const fToSlider = f => Math.round((Math.log(f / FMIN) / Math.log(FMAX / FMIN)) * 1000);
  const fmtF = f => (f >= 1000 ? (f / 1000).toFixed(f >= 10000 ? 1 : 2) + ' kHz' : Math.round(f) + ' Hz');

  function mount(root, { L }) {
    // Valores por defecto del plugin (createParameterLayout)
    const s = { lowCutFreq: 20, lowCutSlope: 0, highCutFreq: 20000, highCutSlope: 0, peakFreq: 750, peakGain: 0, peakQ: 1, bypass: false };
    let ctx = null, chain = null, source = null, sourceKind = 'pink', fileBuffer = null, playing = false, raf = 0, alive = true;
    const AC = window.AudioContext || window.webkitAudioContext;

    root.innerHTML = `
      <div class="demo-head">
        <h4>${L('Pruébalo', 'Try it')}</h4>
        <span class="kv" style="margin:0 0 0 auto"><span>${L('usa audífonos y empieza con volumen bajo', 'use headphones and start with low volume')}</span></span>
      </div>
      <div class="demo-body">
        <p class="hint">${L('Mueve las perillas o arrastra el punto ámbar sobre la curva para cambiar el filtro de pico. Dale a Reproducir para oír el efecto sobre ruido rosa, un acorde o tu propio archivo de audio.',
          'Move the knobs or drag the amber dot on the curve to change the peak filter. Press Play to hear the effect on pink noise, a chord or your own audio file.')}</p>
        <canvas data-c style="width:100%;height:clamp(180px,30vw,260px);display:block;background:#0a111e;border:1px solid var(--line);border-radius:6px;touch-action:none;cursor:grab" aria-label="${L('Curva de respuesta en frecuencia del ecualizador', 'Equalizer frequency response curve')}" role="img"></canvas>
        <div class="demo-row" style="margin-top:1rem">
          <button class="ctl primary" type="button" data-play>${L('Reproducir', 'Play')}</button>
          <select data-src aria-label="${L('Fuente de audio', 'Audio source')}">
            <option value="pink">${L('Ruido rosa', 'Pink noise')}</option>
            <option value="chord">${L('Acorde (ondas de sierra)', 'Chord (sawtooth waves)')}</option>
            <option value="file">${L('Mi archivo de audio…', 'My audio file…')}</option>
          </select>
          <input type="file" accept="audio/*" data-file hidden>
          <label class="f" style="grid-auto-flow:column;align-items:center">${L('volumen', 'volume')} <input type="range" min="0" max="100" value="35" data-vol></label>
          <label style="font:500 .75rem var(--mono);color:var(--muted);display:inline-flex;gap:.4rem;align-items:center"><input type="checkbox" data-byp> bypass</label>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));gap:1rem;margin-top:.5rem">
          <fieldset style="border:1px solid var(--line);border-radius:6px;padding:.8rem;display:grid;gap:.75rem;align-content:start">
            <legend style="font:600 .75rem var(--mono);color:var(--amber);padding:0 .3rem">Low Cut</legend>
            <label class="f">${L('frecuencia', 'frequency')} <span data-v="lcf"></span><input type="range" min="0" max="1000" data-k="lcf"></label>
            <label class="f">${L('pendiente', 'slope')}<select data-k="lcs"><option value="0">12 dB/Oct</option><option value="1">24 dB/Oct</option><option value="2">36 dB/Oct</option><option value="3">48 dB/Oct</option></select></label>
          </fieldset>
          <fieldset style="border:1px solid var(--line);border-radius:6px;padding:.8rem;display:grid;gap:.75rem;align-content:start">
            <legend style="font:600 .75rem var(--mono);color:var(--amber);padding:0 .3rem">Peak</legend>
            <label class="f">${L('frecuencia', 'frequency')} <span data-v="pf"></span><input type="range" min="0" max="1000" data-k="pf"></label>
            <label class="f">${L('ganancia', 'gain')} <span data-v="pg"></span><input type="range" min="-24" max="24" step="0.5" data-k="pg"></label>
            <label class="f">Q <span data-v="pq"></span><input type="range" min="0.1" max="10" step="0.05" data-k="pq"></label>
          </fieldset>
          <fieldset style="border:1px solid var(--line);border-radius:6px;padding:.8rem;display:grid;gap:.75rem;align-content:start">
            <legend style="font:600 .75rem var(--mono);color:var(--amber);padding:0 .3rem">High Cut</legend>
            <label class="f">${L('frecuencia', 'frequency')} <span data-v="hcf"></span><input type="range" min="0" max="1000" data-k="hcf"></label>
            <label class="f">${L('pendiente', 'slope')}<select data-k="hcs"><option value="0">12 dB/Oct</option><option value="1">24 dB/Oct</option><option value="2">36 dB/Oct</option><option value="3">48 dB/Oct</option></select></label>
          </fieldset>
        </div>
        <div class="kv" data-info style="margin-top:.75rem"></div>
      </div>`;
    const $ = q => root.querySelector(q);
    const canvas = $('[data-c]'), g = canvas.getContext('2d');

    // ---------- Cadena de audio ----------
    // Mientras nadie da Reproducir se usa un contexto sin salida de audio, solo para calcular la curva
    function build(real) {
      if (ctx && ctx.close && !(ctx instanceof OfflineAudioContext)) ctx.close();
      ctx = real ? new AC() : new OfflineAudioContext(1, 128, 48000);
      const mk = type => { const f = ctx.createBiquadFilter(); f.type = type; return f; };
      chain = {
        input: ctx.createGain(),
        low: [mk('highpass'), mk('highpass'), mk('highpass'), mk('highpass')],
        peak: mk('peaking'),
        high: [mk('lowpass'), mk('lowpass'), mk('lowpass'), mk('lowpass')],
        out: ctx.createGain(),
        analyser: ctx.createAnalyser()
      };
      chain.analyser.fftSize = 4096; chain.analyser.smoothingTimeConstant = 0.8;
      chain.out.connect(chain.analyser); chain.analyser.connect(ctx.destination);
      chain.out.gain.value = (+$('[data-vol]').value / 100) * 0.6;
      update();
    }
    // Equivalente a updateCutFilter: solo se conectan las etapas que la pendiente necesita
    function wire() {
      const { input, low, peak, high, out } = chain;
      [input, ...low, peak, ...high].forEach(n => n.disconnect());
      if (s.bypass) { input.connect(out); return; }
      const nodes = [...low.slice(0, s.lowCutSlope + 1), peak, ...high.slice(0, s.highCutSlope + 1)];
      let prev = input;
      nodes.forEach(n => { prev.connect(n); prev = n; });
      prev.connect(out);
    }
    function update() {
      if (!chain) return;
      const t = ctx.currentTime;
      const lq = butterQs(2 * (s.lowCutSlope + 1)), hq = butterQs(2 * (s.highCutSlope + 1));
      // En Web Audio el Q de pasa altos y pasa bajos va en dB
      chain.low.forEach((f, i) => { f.frequency.setTargetAtTime(s.lowCutFreq, t, 0.01); f.Q.value = 20 * Math.log10(lq[i] || Math.SQRT1_2); });
      chain.high.forEach((f, i) => { f.frequency.setTargetAtTime(s.highCutFreq, t, 0.01); f.Q.value = 20 * Math.log10(hq[i] || Math.SQRT1_2); });
      chain.peak.frequency.setTargetAtTime(s.peakFreq, t, 0.01);
      chain.peak.gain.setTargetAtTime(s.peakGain, t, 0.01);
      chain.peak.Q.value = s.peakQ;
      // Para la curva se necesitan los valores ya aplicados
      chain.low.forEach(f => f.frequency.value = s.lowCutFreq);
      chain.high.forEach(f => f.frequency.value = s.highCutFreq);
      chain.peak.frequency.value = s.peakFreq; chain.peak.gain.value = s.peakGain;
      wire();
    }

    // ---------- Fuentes ----------
    function pinkBuffer() {
      const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) { // filtro de Paul Kellet
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      }
      return buf;
    }
    function start() {
      if (!ctx || ctx instanceof OfflineAudioContext) build(true);
      ctx.resume();
      stopSource();
      if (sourceKind === 'chord') {
        const gain = ctx.createGain(); gain.gain.value = 0.12; gain.connect(chain.input);
        const oscs = [110, 164.81, 277.18, 440].map(f => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(gain); o.start(); return o; });
        source = { stop: () => { oscs.forEach(o => o.stop()); gain.disconnect(); } };
      } else {
        const b = ctx.createBufferSource();
        b.buffer = sourceKind === 'file' && fileBuffer ? fileBuffer : pinkBuffer();
        b.loop = true; b.connect(chain.input); b.start();
        source = { stop: () => { try { b.stop(); } catch (e) {} b.disconnect(); } };
      }
      playing = true; $('[data-play]').textContent = L('Detener', 'Stop');
    }
    function stopSource() { if (source) { source.stop(); source = null; } }
    function stop() { stopSource(); playing = false; $('[data-play]').textContent = L('Reproducir', 'Play'); }

    // ---------- Curva ----------
    const N = 400, freqs = new Float32Array(N);
    for (let i = 0; i < N; i++) freqs[i] = FMIN * Math.pow(FMAX / FMIN, i / (N - 1));
    function response() {
      if (!chain) build();
      const total = new Float32Array(N).fill(1), mag = new Float32Array(N), ph = new Float32Array(N);
      if (s.bypass) return total;
      const nodes = [...chain.low.slice(0, s.lowCutSlope + 1), chain.peak, ...chain.high.slice(0, s.highCutSlope + 1)];
      nodes.forEach(n => { n.getFrequencyResponse(freqs, mag, ph); for (let i = 0; i < N; i++) total[i] *= mag[i]; });
      return total;
    }
    let spectrum = null;
    function draw() {
      if (!alive) return;
      const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(r.width * dpr) || canvas.height !== Math.round(r.height * dpr)) { canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = r.width, h = r.height, yOf = db => h / 2 - (db / DB) * (h / 2 - 12);
      g.clearRect(0, 0, w, h);
      // rejilla
      g.font = '10px Martian Mono, monospace'; g.fillStyle = '#5d6c88'; g.strokeStyle = '#18253d'; g.lineWidth = 1;
      [50, 100, 200, 500, 1000, 2000, 5000, 10000].forEach(f => { const x = fToX(f, w); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); g.fillText(f >= 1000 ? f / 1000 + 'k' : f, x + 3, h - 6); });
      [-24, -12, 0, 12, 24].forEach(db => { const y = yOf(db); g.strokeStyle = db === 0 ? '#26365a' : '#18253d'; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); g.fillText((db > 0 ? '+' : '') + db + ' dB', 4, y - 3); });
      // espectro en vivo
      if (playing && chain) {
        const an = chain.analyser; spectrum = spectrum || new Float32Array(an.frequencyBinCount);
        an.getFloatFrequencyData(spectrum);
        g.beginPath(); g.moveTo(0, h);
        const nyq = ctx.sampleRate / 2;
        for (let x = 0; x <= w; x += 2) {
          const f = xToF(x, w), bin = Math.min(spectrum.length - 1, Math.round((f / nyq) * spectrum.length));
          const v = Math.max(0, Math.min(1, (spectrum[bin] + 100) / 80));
          g.lineTo(x, h - v * h);
        }
        g.lineTo(w, h); g.closePath(); g.fillStyle = 'rgba(124,196,245,0.13)'; g.fill();
      }
      // curva de respuesta
      const mags = response();
      g.beginPath();
      for (let i = 0; i < N; i++) { const x = fToX(freqs[i], w), db = 20 * Math.log10(Math.max(mags[i], 1e-6)); const y = yOf(Math.max(-DB * 1.4, Math.min(DB * 1.4, db))); i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.strokeStyle = s.bypass ? '#5d6c88' : '#e2e8f2'; g.lineWidth = 2; g.stroke();
      // punto del pico
      if (!s.bypass) {
        const px = fToX(s.peakFreq, w), py = yOf(s.peakGain);
        g.beginPath(); g.arc(px, py, 7, 0, Math.PI * 2); g.fillStyle = '#ffb454'; g.fill();
        g.beginPath(); g.arc(px, py, 12, 0, Math.PI * 2); g.strokeStyle = 'rgba(255,180,84,.35)'; g.lineWidth = 2; g.stroke();
      }
      raf = requestAnimationFrame(draw);
    }

    // ---------- Controles ----------
    function syncUI() {
      $('[data-k="lcf"]').value = fToSlider(s.lowCutFreq); $('[data-v="lcf"]').textContent = fmtF(s.lowCutFreq);
      $('[data-k="hcf"]').value = fToSlider(s.highCutFreq); $('[data-v="hcf"]').textContent = fmtF(s.highCutFreq);
      $('[data-k="pf"]').value = fToSlider(s.peakFreq); $('[data-v="pf"]').textContent = fmtF(s.peakFreq);
      $('[data-k="pg"]').value = s.peakGain; $('[data-v="pg"]').textContent = (s.peakGain > 0 ? '+' : '') + s.peakGain + ' dB';
      $('[data-k="pq"]').value = s.peakQ; $('[data-v="pq"]').textContent = s.peakQ.toFixed(2);
      $('[data-k="lcs"]').value = s.lowCutSlope; $('[data-k="hcs"]').value = s.highCutSlope;
      const stages = (s.lowCutSlope + 1) + 1 + (s.highCutSlope + 1);
      $('[data-info]').innerHTML = `<span>${L('filtros activos por canal', 'active filters per channel')} <b>${stages}</b> ${L('de 9', 'of 9')}</span><span>Low Cut: Butterworth ${L('orden', 'order')} <b>${2 * (s.lowCutSlope + 1)}</b></span><span>High Cut: Butterworth ${L('orden', 'order')} <b>${2 * (s.highCutSlope + 1)}</b></span>`;
    }
    const onInput = (k, v) => {
      if (k === 'lcf') s.lowCutFreq = Math.round(sliderToF(v));
      if (k === 'hcf') s.highCutFreq = Math.round(sliderToF(v));
      if (k === 'pf') s.peakFreq = Math.round(sliderToF(v));
      if (k === 'pg') s.peakGain = +v;
      if (k === 'pq') s.peakQ = +v;
      if (k === 'lcs') s.lowCutSlope = +v;
      if (k === 'hcs') s.highCutSlope = +v;
      update(); syncUI();
    };
    root.querySelectorAll('[data-k]').forEach(el => el.addEventListener('input', () => onInput(el.dataset.k, el.value)));
    $('[data-byp]').addEventListener('change', e => { s.bypass = e.target.checked; update(); });
    $('[data-vol]').addEventListener('input', e => { if (chain) chain.out.gain.setTargetAtTime((+e.target.value / 100) * 0.6, ctx.currentTime, 0.02); });
    $('[data-play]').addEventListener('click', () => (playing ? stop() : start()));
    $('[data-src]').addEventListener('change', e => {
      if (e.target.value === 'file') { $('[data-file]').click(); return; }
      sourceKind = e.target.value; if (playing) start();
    });
    $('[data-file]').addEventListener('change', async e => {
      const f = e.target.files[0]; if (!f) { $('[data-src]').value = sourceKind; return; }
      if (!ctx) build();
      try { fileBuffer = await ctx.decodeAudioData(await f.arrayBuffer()); sourceKind = 'file'; start(); }
      catch (err) { $('[data-src]').value = sourceKind; alertInline(L('No se pudo leer ese archivo de audio.', 'That audio file could not be read.')); }
    });
    function alertInline(msg) { $('[data-info]').innerHTML = `<span style="color:#ff8f8f">${msg}</span>`; }

    // arrastrar el punto del pico sobre la curva
    let dragging = false;
    const pointer = e => {
      const r = canvas.getBoundingClientRect();
      s.peakFreq = Math.round(xToF(e.clientX - r.left, r.width));
      const db = ((r.height / 2 - (e.clientY - r.top)) / (r.height / 2 - 12)) * DB;
      s.peakGain = Math.round(Math.max(-DB, Math.min(DB, db)) * 2) / 2;
      update(); syncUI();
    };
    canvas.addEventListener('pointerdown', e => { dragging = true; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; pointer(e); });
    canvas.addEventListener('pointermove', e => { if (dragging) pointer(e); });
    canvas.addEventListener('pointerup', () => { dragging = false; canvas.style.cursor = 'grab'; });
    canvas.addEventListener('wheel', e => { e.preventDefault(); s.peakQ = Math.max(0.1, Math.min(10, +(s.peakQ * (e.deltaY < 0 ? 1.1 : 0.9)).toFixed(2))); update(); syncUI(); }, { passive: false });

    if (!AC) { root.querySelector('.demo-body').innerHTML = `<p class="hint">${L('Tu navegador no soporta Web Audio.', 'Your browser does not support Web Audio.')}</p>`; return; }
    build(); syncUI(); draw();

    return () => { alive = false; cancelAnimationFrame(raf); stopSource(); if (ctx && ctx.close && !(ctx instanceof OfflineAudioContext)) ctx.close(); };
  }

  window.PortfolioDemos = window.PortfolioDemos || {};
  window.PortfolioDemos.eq = mount;
})();
