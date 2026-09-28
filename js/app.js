/* =========================================================================
   HOGWARTS WIKI · Lógica de la aplicación
   ========================================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, def) { try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
  };

  const BY_ID = Object.fromEntries(PERSONAJES.map((p) => [p.id, p]));
  const ORDEN_IMPORTANCIA = { principal: 0, secundario: 1, reparto: 2 };
  const LISTA = [...PERSONAJES].sort((a, b) => ORDEN_IMPORTANCIA[a.importancia] - ORDEN_IMPORTANCIA[b.importancia]);

  // Índice de relaciones por personaje
  const REL = {};
  PERSONAJES.forEach((p) => (REL[p.id] = []));
  RELACIONES.forEach(([a, b, tipo, etiqueta]) => {
    REL[a].push({ otro: b, tipo, etiqueta });
    REL[b].push({ otro: a, tipo, etiqueta });
  });

  const casaDe = (p) => CASAS[p.casa] || CASAS.ninguna;
  // Nombre corto con el que se conoce a cada personaje (para vistas densas)
  const CORTOS = {
    voldemort: 'Voldemort', dumbledore: 'Dumbledore', mcgonagall: 'McGonagall', snape: 'Snape', lupin: 'Lupin',
    hagrid: 'Hagrid', slughorn: 'Slughorn', ollivander: 'Ollivander', quirrell: 'Quirrell', umbridge: 'Umbridge',
    lockhart: 'Lockhart', crouchjr: 'Barty Jr.', filch: 'Filch', flitwick: 'Flitwick', trelawney: 'Trelawney',
    sprout: 'Sprout', fudge: 'Fudge', moody: 'Ojoloco', grindelwald: 'Grindelwald', pettigrew: 'Colagusano',
    greyback: 'Greyback', kingsley: 'Kingsley', tonks: 'Tonks'
  };
  const corto = (id) => CORTOS[id] || BY_ID[id].nombre.split(' ')[0];
  const anio = (txt) => (String(txt || '').match(/\d{4}/) || [''])[0];
  const actorPrincipal = (p) => p.wiki.replace(/_/g, ' ').replace(/\s*\(.*\)$/, '');

  /* ---------------------------------------------------------------------
     Retratos: avatar ilustrado de respaldo + fotos reales vía Wikipedia
     --------------------------------------------------------------------- */
  const avatarCache = {};
  function avatar(id) {
    if (avatarCache[id]) return avatarCache[id];
    const p = BY_ID[id];
    const c = casaDe(p);
    const ini = p.nombre.split(/\s+/).filter((w) => /^[A-ZÁÉÍÓÚ]/.test(w)).slice(0, 2).map((w) => w[0]).join('');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
      <defs><radialGradient id='g' cx='50%' cy='30%' r='80%'><stop offset='0' stop-color='${c.color}'/><stop offset='1' stop-color='#07080f'/></radialGradient></defs>
      <rect width='300' height='400' fill='url(#g)'/>
      <circle cx='150' cy='150' r='70' fill='none' stroke='${c.color2}' stroke-opacity='.35' stroke-width='2'/>
      <path d='M165 40 L125 160 L160 160 L130 270 L195 130 L158 130 L185 40Z' fill='${c.color2}' opacity='.12'/>
      <text x='150' y='175' font-family='Cinzel, Georgia, serif' font-size='64' font-weight='700' text-anchor='middle' fill='${c.color2}'>${ini}</text>
      <text x='150' y='330' font-family='Georgia, serif' font-size='22' font-style='italic' text-anchor='middle' fill='#f3e9d2' opacity='.75'>${c.animal}</text>
    </svg>`;
    avatarCache[id] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return avatarCache[id];
  }

  // Retratos de los personajes tal y como aparecen en las películas (Harry Potter Wiki · Fandom)
  const IMG_KEY = 'hpwiki:fotos-pelicula:v2';
  const IMG_TTL = 1000 * 60 * 60 * 24 * 7;
  let fotos = (() => {
    const c = store.get(IMG_KEY, null);
    return c && Date.now() - c.t < IMG_TTL ? c.data : {};
  })();

  const imgFor = (id) => fotos[id] || avatar(id);

  function aplicarFoto(id) {
    const url = imgFor(id);
    $$(`img[data-char="${id}"]`).forEach((img) => {
      if (img.src === url) return;
      img.classList.add('swap');
      const pre = new Image();
      pre.onload = () => { img.src = url; img.classList.remove('swap'); };
      pre.onerror = () => img.classList.remove('swap');
      pre.src = url;
    });
    $$(`image[data-char="${id}"]`).forEach((im) => im.setAttribute('href', url));
    document.dispatchEvent(new CustomEvent('hp:foto', { detail: { id, url } }));
  }

  async function cargarFotos() {
    const pendientes = PERSONAJES.map((p) => p.id).filter((id) => !(id in fotos) && FOTOS_PELICULA[id]);
    if (!pendientes.length) return;
    for (let i = 0; i < pendientes.length; i += 40) {
      const lote = pendientes.slice(i, i + 40);
      try {
        const params = new URLSearchParams({
          action: 'query', format: 'json', origin: '*', redirects: '1',
          prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '480', pilimit: 'max',
          titles: lote.map((id) => FOTOS_PELICULA[id]).join('|')
        });
        const res = await fetch('https://harrypotter.fandom.com/api.php?' + params);
        const q = (await res.json()).query || {};
        const alias = {};
        (q.normalized || []).forEach((n) => (alias[n.from] = n.to));
        (q.redirects || []).forEach((r) => (alias[r.from] = r.to));
        const porTitulo = {};
        Object.values(q.pages || {}).forEach((pg) => { porTitulo[pg.title] = pg.thumbnail ? pg.thumbnail.source : null; });
        lote.forEach((id) => {
          let t = FOTOS_PELICULA[id];
          for (let k = 0; k < 3 && alias[t]; k++) t = alias[t];
          fotos[id] = porTitulo[t] || null;
        });
      } catch (err) {
        console.warn('No se pudieron cargar los retratos de la Harry Potter Wiki:', err);
        return;
      }
    }
    // null = sin retrato: se guarda para no volver a preguntar
    store.set(IMG_KEY, { t: Date.now(), data: fotos });
    PERSONAJES.forEach((p) => aplicarFoto(p.id));
  }

  /* ---------------------------------------------------------------------
     Estado y filtros
     --------------------------------------------------------------------- */
  const state = { q: '', casa: 'todas', grupo: 'todos', importancia: 'todas', vista: 'retratos' };

  function filtrados() {
    const q = norm(state.q);
    return LISTA.filter((p) => {
      if (state.casa !== 'todas' && p.casa !== state.casa) return false;
      if (state.grupo !== 'todos' && !p.grupos.includes(state.grupo)) return false;
      if (state.importancia !== 'todas' && p.importancia !== state.importancia) return false;
      if (!q) return true;
      const heno = norm([p.nombre, p.nombreCompleto, p.apodo, p.actor, casaDe(p).nombre, ...p.grupos.map((g) => GRUPOS[g])].join(' '));
      return q.split(/\s+/).every((w) => heno.includes(w));
    });
  }

  function construirFiltros() {
    const hf = $('#houseFilter');
    const opciones = [['todas', { nombre: 'Todas', animal: '✨', color: '#8a6d1c', color2: '#f5d77a' }], ...Object.entries(CASAS)];
    hf.innerHTML = opciones.map(([k, c]) =>
      `<button class="house-pill${k === 'todas' ? ' active' : ''}" data-casa="${k}" style="--c1:${c.color};--c2:${c.color2}">${c.animal} ${esc(c.nombre)}</button>`
    ).join('');
    hf.addEventListener('click', (e) => {
      const b = e.target.closest('[data-casa]');
      if (b) setCasa(b.dataset.casa);
    });

    const gf = $('#groupFilter');
    gf.innerHTML = `<option value="todos">Todos los grupos</option>` +
      Object.entries(GRUPOS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
    gf.addEventListener('change', () => { state.grupo = gf.value; actualizar(); });

    const imf = $('#importanceFilter');
    imf.innerHTML = `<option value="todas">Protagonistas y secundarios</option>` +
      Object.entries(IMPORTANCIA).map(([k, v]) => `<option value="${k}">${esc(v)}s</option>`).join('');
    imf.addEventListener('change', () => { state.importancia = imf.value; actualizar(); });

    const si = $('#searchInput');
    let t;
    si.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (huevoMerodeador(si.value)) return;
        state.q = si.value;
        actualizar();
      }, 140);
    });

    $('#btnReset').addEventListener('click', resetFiltros);
  }

  function setCasa(casa) {
    state.casa = casa;
    document.body.dataset.house = casa === 'ninguna' ? 'todas' : casa;
    $$('.house-pill').forEach((b) => b.classList.toggle('active', b.dataset.casa === casa));
    actualizar();
  }

  function resetFiltros() {
    state.q = ''; state.grupo = 'todos'; state.importancia = 'todas';
    $('#searchInput').value = '';
    $('#groupFilter').value = 'todos';
    $('#importanceFilter').value = 'todas';
    setCasa('todas');
  }

  function actualizar() {
    const lista = filtrados();
    $('#resultCount').textContent = `Mostrando ${lista.length} de ${PERSONAJES.length}`;
    renderTarjetas(lista);
    aplicarFiltroGrafo(lista);
  }

  /* ---------------------------------------------------------------------
     Tarjetas (retratos animados con inclinación 3D)
     --------------------------------------------------------------------- */
  function tarjetaHTML(p, i) {
    const c = casaDe(p);
    const muerte = anio(p.muerte);
    const tags = p.grupos.slice(0, 2).map((g) => `<span class="tag">${esc(GRUPOS[g])}</span>`).join('');
    return `
      <div class="col card-col spawn" style="--d:${Math.min(i * 0.035, 0.8)}s">
        <article class="hp-card" tabindex="0" role="button" data-id="${p.id}" aria-label="Abrir ficha de ${esc(p.nombre)}"
          style="--c1:${c.color};--c2:${c.color2}">
          <div class="portrait">
            <span class="card-house">${c.animal} ${esc(c.nombre)}</span>
            ${p.importancia === 'principal' ? '<span class="card-rank" title="Protagonista"><i class="bi bi-star-fill"></i></span>' : ''}
            <img data-char="${p.id}" src="${imgFor(p.id)}" alt="${esc(p.actor)} como ${esc(p.nombre)}" loading="lazy"
              style="--pd:${(-i * 0.7) % 11}s" onerror="HP.imgError(this)">
            ${muerte ? `<span class="card-dead" title="Fallecimiento">✝ ${muerte}</span>` : ''}
          </div>
          <div class="card-info">
            <h3 class="card-name">${esc(p.nombre)}</h3>
            <p class="card-actor">${esc(p.actor)}</p>
            <div class="card-tags">${tags}</div>
          </div>
        </article>
      </div>`;
  }

  function renderTarjetas(lista) {
    const grid = $('#cardGrid');
    grid.innerHTML = lista.map(tarjetaHTML).join('');
    $('#emptyState').classList.toggle('d-none', lista.length > 0);
  }

  function initTarjetas() {
    const grid = $('#cardGrid');
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.hp-card');
      if (card) abrirFicha(card.dataset.id);
    });
    grid.addEventListener('keydown', (e) => {
      const card = e.target.closest('.hp-card');
      if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abrirFicha(card.dataset.id); }
    });
    if (reduceMotion) return;
    grid.addEventListener('pointermove', (e) => {
      const card = e.target.closest('.hp-card');
      if (!card || e.pointerType === 'touch') return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', `${(x - 0.5) * 16}deg`);
      card.style.setProperty('--rx', `${(0.5 - y) * 12}deg`);
      const portrait = card.querySelector('.portrait');
      portrait.style.setProperty('--gx', `${x * 100}%`);
      portrait.style.setProperty('--gy', `${y * 100}%`);
    });
    grid.addEventListener('pointerout', (e) => {
      const card = e.target.closest('.hp-card');
      if (card && !card.contains(e.relatedTarget)) {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      }
    });
  }

  /* ---------------------------------------------------------------------
     Grimorio: ficha completa del personaje
     --------------------------------------------------------------------- */
  let modal, fichaActual = null;

  function relacionesAgrupadas(id) {
    const grupos = {};
    REL[id].forEach((r) => (grupos[r.tipo] = grupos[r.tipo] || []).push(r));
    return Object.keys(TIPOS_RELACION).filter((t) => grupos[t]).map((t) => [t, grupos[t]]);
  }

  function egoSVG(p) {
    const rels = REL[p.id];
    const W = 640, H = 340, cx = W / 2, cy = H / 2;
    const n = rels.length;
    const dosAnillos = n > 18;
    const conEtiqueta = n <= 22;
    const c = casaDe(p);
    let lineas = '', nodos = '', clips = '';
    rels.forEach((r, i) => {
      const o = BY_ID[r.otro];
      const oc = casaDe(o);
      const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
      const exterior = dosAnillos && i % 2 === 1;
      const rx = exterior ? 285 : (dosAnillos ? 195 : 250);
      const ry = exterior ? 145 : (dosAnillos ? 98 : 125);
      const x = cx + Math.cos(ang) * rx;
      const y = cy + Math.sin(ang) * ry;
      const rad = n > 26 ? 14 : 18;
      const col = TIPOS_RELACION[r.tipo].color;
      clips += `<clipPath id="ego-c-${i}"><circle cx="${x}" cy="${y}" r="${rad}"/></clipPath>`;
      lineas += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${col}" stroke-width="2" stroke-opacity=".8" style="animation-delay:${i * 0.03}s"><title>${esc(r.etiqueta)}</title></line>`;
      nodos += `
        <g class="ego-node" data-goto="${o.id}" style="transform-origin:${x}px ${y}px">
          <title>${esc(o.nombre)} · ${esc(TIPOS_RELACION[r.tipo].nombre)}: ${esc(r.etiqueta)}</title>
          <circle cx="${x}" cy="${y}" r="${rad + 3}" fill="${col}"/>
          <image data-char="${o.id}" href="${imgFor(o.id)}" x="${x - rad}" y="${y - rad}" width="${rad * 2}" height="${rad * 2}"
            preserveAspectRatio="xMidYMin slice" clip-path="url(#ego-c-${i})"/>
          <circle cx="${x}" cy="${y}" r="${rad}" fill="none" stroke="${oc.color}" stroke-width="1.5"/>
          ${conEtiqueta ? `<text x="${x}" y="${y + rad + 13}">${esc(o.nombre.split(' ')[0])}</text>` : ''}
        </g>`;
    });
    return `
      <svg class="ego-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Relaciones de ${esc(p.nombre)}">
        <defs>${clips}<clipPath id="ego-center"><circle cx="${cx}" cy="${cy}" r="38"/></clipPath></defs>
        ${lineas}
        ${nodos}
        <circle cx="${cx}" cy="${cy}" r="43" fill="${c.color2}"/>
        <image data-char="${p.id}" href="${imgFor(p.id)}" x="${cx - 38}" y="${cy - 38}" width="76" height="76" preserveAspectRatio="xMidYMin slice" clip-path="url(#ego-center)"/>
        <circle cx="${cx}" cy="${cy}" r="38" fill="none" stroke="${c.color}" stroke-width="3"/>
      </svg>`;
  }

  function fichaHTML(p) {
    const c = casaDe(p);
    const fact = (icon, label, val, wide) =>
      `<div class="fact${wide ? ' wide' : ''}"><small><i class="bi ${icon}"></i>${label}</small><span>${esc(val || 'Desconocido')}</span></div>`;
    const rels = relacionesAgrupadas(p.id);
    const relHTML = rels.map(([tipo, lista]) => {
      const t = TIPOS_RELACION[tipo];
      return `<div class="rel-type" style="--rc:${t.color}"><i class="bi ${t.icono}"></i>${t.nombre} · ${lista.length}</div>
        <div class="rel-list">${lista.map((r) => {
          const o = BY_ID[r.otro];
          return `<button class="rel-item" data-goto="${o.id}" style="--rc:${t.color}">
            <img data-char="${o.id}" src="${imgFor(o.id)}" alt="" onerror="HP.imgError(this)">
            <span><strong>${esc(o.nombre)}</strong><small>${esc(r.etiqueta)}</small></span></button>`;
        }).join('')}</div>`;
    }).join('');

    return `
      <button type="button" class="btn-close-grim" data-bs-dismiss="modal" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
      <div class="grimoire-grid">
        <aside class="page-left">
          <div class="frame"><div class="frame-inner">
            <img data-char="${p.id}" src="${imgFor(p.id)}" alt="${esc(p.actor)} como ${esc(p.nombre)}" onerror="HP.imgError(this)">
          </div></div>
          <div class="char-title">
            <h2 class="char-name" id="charModalTitle">${esc(p.nombre)}</h2>
            ${p.nombreCompleto !== p.nombre ? `<p class="char-full">${esc(p.nombreCompleto)}</p>` : ''}
            <div class="char-alias">«${esc(p.apodo)}»</div>
          </div>
          <div class="actor-badge">
            <i class="bi bi-camera-reels"></i>
            <div><small>Interpretado por</small><strong>${esc(p.actor)}</strong></div>
            <a href="https://es.wikipedia.org/w/index.php?search=${encodeURIComponent(actorPrincipal(p))}" target="_blank" rel="noopener">Wiki <i class="bi bi-box-arrow-up-right"></i></a>
          </div>
          <div class="facts">
            ${fact('bi-balloon', 'Nacimiento', p.nacimiento)}
            ${fact('bi-flower1', 'Fallecimiento', p.muerte || 'Sigue con vida')}
            ${fact('bi-droplet-half', 'Sangre', p.sangre)}
            ${fact('bi-stars', 'Patronus', p.patronus)}
            ${fact('bi-magic', 'Varita', p.varita, true)}
            ${fact('bi-briefcase', 'Ocupación', p.ocupacion, true)}
          </div>
        </aside>
        <section class="page-right">
          <div class="page-head">
            <span class="house-seal"><span class="emoji">${c.animal}</span>${esc(c.nombre)}</span>
            <span class="trait">${esc(IMPORTANCIA[p.importancia])}</span>
            <div class="page-nav">
              <button class="btn" data-nav="-1" title="Anterior (←)"><i class="bi bi-chevron-left"></i></button>
              <button class="btn" data-nav="1" title="Siguiente (→)"><i class="bi bi-chevron-right"></i></button>
            </div>
          </div>
          <div class="grimoire-tabs" role="tablist">
            <button class="active" data-tab="historia"><i class="bi bi-book"></i> Historia</button>
            <button data-tab="cronologia"><i class="bi bi-hourglass-split"></i> Cronología</button>
            <button data-tab="relaciones"><i class="bi bi-diagram-3"></i> Relaciones (${REL[p.id].length})</button>
          </div>
          <div class="page-body">
            <div class="tab-pane-g active" data-pane="historia">
              <p class="lead-quote">${esc(p.resumen)}</p>
              <div class="story">${p.historia.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
              <div class="h-ink">Rasgos</div>
              <div class="traits">${p.rasgos.map((r) => `<span class="trait">${esc(r)}</span>`).join('')}</div>
              <div class="h-ink">Afiliaciones</div>
              <div class="traits">${p.grupos.map((g) => `<span class="trait">${esc(GRUPOS[g])}</span>`).join('')}</div>
            </div>
            <div class="tab-pane-g" data-pane="cronologia">
              <ul class="mini-tl">${p.momentos.map((m, i) => `<li style="--i:${i}"><span class="yr">${esc(m.ano)}</span>${esc(m.texto)}</li>`).join('')}</ul>
            </div>
            <div class="tab-pane-g" data-pane="relaciones">
              <div class="ego-wrap">${egoSVG(p)}<div>${relHTML}</div></div>
            </div>
          </div>
        </section>
      </div>`;
  }

  function abrirFicha(id, { flip = false } = {}) {
    const p = BY_ID[id];
    if (!p) return;
    fichaActual = id;
    const g = $('#grimoire');
    const c = casaDe(p);
    g.style.setProperty('--c1', c.color);
    g.style.setProperty('--c2', c.color2);
    g.innerHTML = fichaHTML(p);
    if (flip && !reduceMotion) {
      g.classList.remove('flip');
      void g.offsetWidth;
      g.classList.add('flip');
    }
    try { history.replaceState(null, '', '#personaje/' + id); } catch { /* file:// */ }
    if (!$('#charModal').classList.contains('show')) modal.show();
    chispazo(window.innerWidth / 2, window.innerHeight / 2, 40);
  }

  function navegarFicha(delta) {
    const lista = filtrados();
    const base = lista.some((p) => p.id === fichaActual) ? lista : LISTA;
    const i = base.findIndex((p) => p.id === fichaActual);
    const sig = base[(i + delta + base.length) % base.length];
    abrirFicha(sig.id, { flip: true });
  }

  function initFicha() {
    const el = $('#charModal');
    modal = new bootstrap.Modal(el);
    el.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (tab) {
        $$('[data-tab]', el).forEach((b) => b.classList.toggle('active', b === tab));
        $$('[data-pane]', el).forEach((pn) => pn.classList.toggle('active', pn.dataset.pane === tab.dataset.tab));
        $('.page-body', el).scrollTop = 0;
        return;
      }
      const go = e.target.closest('[data-goto]');
      if (go) { abrirFicha(go.dataset.goto, { flip: true }); return; }
      const nav = e.target.closest('[data-nav]');
      if (nav) navegarFicha(+nav.dataset.nav);
    });
    el.addEventListener('hidden.bs.modal', () => {
      fichaActual = null;
      try { history.replaceState(null, '', location.pathname + location.search); } catch { /* file:// */ }
    });
    document.addEventListener('keydown', (e) => {
      if (!fichaActual) return;
      if (e.key === 'ArrowRight') navegarFicha(1);
      if (e.key === 'ArrowLeft') navegarFicha(-1);
    });
  }

  /* ---------------------------------------------------------------------
     Constelación de relaciones: un personaje en el centro y sus vínculos
     ordenados por tipo en sectores (legible aunque tenga decenas de relaciones)
     --------------------------------------------------------------------- */
  let conste = null;
  const tiposActivos = new Set(Object.keys(TIPOS_RELACION));

  function construirLeyenda() {
    const lg = $('#graphLegend');
    lg.innerHTML = Object.entries(TIPOS_RELACION).map(([k, t]) =>
      `<span class="legend-chip" data-tipo="${k}" style="--c:${t.color}" role="switch" aria-checked="true" tabindex="0"><span class="dot"></span>${esc(t.nombre)}</span>`
    ).join('');
    lg.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-tipo]');
      if (!chip) return;
      const t = chip.dataset.tipo;
      tiposActivos.has(t) ? tiposActivos.delete(t) : tiposActivos.add(t);
      chip.classList.toggle('off', !tiposActivos.has(t));
      chip.setAttribute('aria-checked', tiposActivos.has(t));
      if (conste) conste.pintar();
    });
  }

  function initConstelacion() {
    const el = $('#graph');
    const shell = el.parentElement;
    const tip = $('#graphTooltip');
    let W = el.clientWidth, H = el.clientHeight;
    let centro = store.get('hpwiki:centro', 'harry');
    if (!BY_ID[centro]) centro = 'harry';
    let recorrido = [centro];
    let pulso = new Set();
    let visibles = new Set(PERSONAJES.map((p) => p.id));
    let posPrevias = {};

    const svg = d3.select(el).append('svg').attr('viewBox', [0, 0, W, H]);
    const defs = svg.append('defs');
    const gOrbitas = svg.append('g');
    const gSectores = svg.append('g');
    const gRadios = svg.append('g');
    const gNodos = svg.append('g');

    const clip = (r) => {
      const id = `fclip-${r}`;
      if (defs.select('#' + id).empty()) defs.append('clipPath').attr('id', id).append('circle').attr('r', r);
      return `url(#${id})`;
    };

    // En pantallas anchas las etiquetas de cada sector van fuera del anillo; en móvil, dentro
    const etiquetasFuera = () => W >= 760;
    function geometria() {
      const arriba = W < 700 ? 96 : 70, abajo = 44;
      const alto = H - arriba - abajo;
      const fuera = etiquetasFuera();
      return {
        cx: W / 2, cy: arriba + alto / 2,
        rx: Math.max(120, W / 2 - (fuera ? 175 : 50)),
        ry: Math.max(110, alto / 2 - (fuera ? 58 : 42)),
        arriba, abajo
      };
    }

    function calcular(id) {
      const { cx, cy, rx, ry } = geometria();
      const rels = REL[id].filter((r) => tiposActivos.has(r.tipo));
      const tipos = Object.keys(TIPOS_RELACION).filter((t) => rels.some((r) => r.tipo === t));
      const n = rels.length;
      const hueco = tipos.length > 1 ? 0.09 : 0;
      const util = Math.PI * 2 - hueco * tipos.length;
      let pesos = tipos.map((t) => Math.max(0.32, (rels.filter((r) => r.tipo === t).length / Math.max(1, n)) * util));
      const suma = pesos.reduce((a, b) => a + b, 0);
      pesos = pesos.map((p) => (p / suma) * util);

      const rNodo = n > 26 ? 20 : n > 14 ? 25 : 30;
      const anillos = n > 26 ? [0.58, 0.79, 1] : n > 16 ? [0.7, 1] : [0.88];
      const nodos = [{ id, x: cx, y: cy, r: Math.min(62, ry * 0.3), centro: true }];
      const sectores = [];
      let a = -Math.PI / 2 - (pesos[0] || 0) / 2;
      tipos.forEach((t, i) => {
        const lista = rels.filter((r) => r.tipo === t);
        const a0 = a, a1 = a + pesos[i];
        sectores.push({ tipo: t, a0, a1, n: lista.length });
        lista.forEach((r, j) => {
          const ang = a0 + ((j + 0.5) * (a1 - a0)) / lista.length;
          const f = lista.length > 1 ? anillos[j % anillos.length] : anillos[anillos.length - 1];
          nodos.push({ id: r.otro, x: cx + Math.cos(ang) * rx * f, y: cy + Math.sin(ang) * ry * f, r: rNodo, tipo: t, etiqueta: r.etiqueta });
        });
        a = a1 + hueco;
      });
      const g = geometria();
      return { nodos, sectores, cx, cy, rx, ry, n, anillos, arriba: g.arriba, abajo: g.abajo };
    }

    function cuña(cx, cy, rx, ry, a0, a1, f0, f1) {
      const pasos = Math.max(6, Math.ceil((a1 - a0) * 24));
      const pt = (ang, f) => `${(cx + Math.cos(ang) * rx * f).toFixed(1)},${(cy + Math.sin(ang) * ry * f).toFixed(1)}`;
      let d = `M${pt(a0, f0)}`;
      for (let i = 0; i <= pasos; i++) d += `L${pt(a0 + ((a1 - a0) * i) / pasos, f1)}`;
      for (let i = pasos; i >= 0; i--) d += `L${pt(a0 + ((a1 - a0) * i) / pasos, f0)}`;
      return d + 'Z';
    }

    function pintar({ animar = true } = {}) {
      const L = calcular(centro);
      const dur = animar && !reduceMotion ? 800 : 0;
      const t = svg.transition().duration(dur).ease(d3.easeCubicInOut);
      const origen = posPrevias[centro] || { x: L.cx, y: L.cy };

      // Órbitas y sectores
      gOrbitas.selectAll('ellipse').data(L.anillos)
        .join('ellipse').attr('class', 'orbit')
        .attr('cx', L.cx).attr('cy', L.cy).attr('rx', (f) => L.rx * f).attr('ry', (f) => L.ry * f);

      gSectores.selectAll('*').remove();
      const sec = gSectores.selectAll('g').data(L.sectores).join('g').attr('class', 'sector').style('opacity', 0);
      sec.append('path')
        .attr('d', (s) => cuña(L.cx, L.cy, L.rx, L.ry, s.a0, s.a1, 0.4, 1.1))
        .attr('fill', (s) => TIPOS_RELACION[s.tipo].color).attr('fill-opacity', 0.07)
        .attr('stroke', (s) => TIPOS_RELACION[s.tipo].color).attr('stroke-opacity', 0.25);
      const fuera = etiquetasFuera();
      const medio = (s) => (s.a0 + s.a1) / 2;
      sec.append('text').attr('class', 'sector-label')
        .attr('x', (s) => L.cx + Math.cos(medio(s)) * (fuera ? L.rx * 1.13 + 8 : L.rx * 0.5))
        .attr('y', (s) => {
          const y = L.cy + Math.sin(medio(s)) * (fuera ? L.ry * 1.13 + 10 : L.ry * 0.5) + 4;
          return Math.min(H - L.abajo - 2, Math.max(L.arriba + 14, y));
        })
        .attr('text-anchor', (s) => {
          if (!fuera) return 'middle';
          const c = Math.cos(medio(s));
          return c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
        })
        .attr('fill', (s) => TIPOS_RELACION[s.tipo].color)
        .text((s) => `${TIPOS_RELACION[s.tipo].nombre.split(' /')[0]} · ${s.n}`);
      sec.transition().delay(dur * 0.5).duration(500).style('opacity', 1);

      // Radios (líneas centro → vínculo)
      const vecinos = L.nodos.filter((d) => !d.centro);
      gRadios.selectAll('line').data(vecinos, (d) => d.id).join(
        (enter) => enter.append('line').attr('class', 'spoke').attr('x1', L.cx).attr('y1', L.cy).attr('x2', L.cx).attr('y2', L.cy),
        (update) => update,
        (exit) => exit.transition(t).style('opacity', 0).remove()
      )
        .attr('stroke', (d) => TIPOS_RELACION[d.tipo].color)
        .classed('dim', (d) => !visibles.has(d.id))
        .transition(t)
        .style('opacity', 1)
        .attr('x1', L.cx).attr('y1', L.cy).attr('x2', (d) => d.x).attr('y2', (d) => d.y);

      // Nodos
      const conEtiqueta = L.n <= 16;
      const denso = L.n > 16 || W < 700;
      const sel = gNodos.selectAll('g.fnode').data(L.nodos, (d) => d.id).join(
        (enter) => {
          const g = enter.append('g').attr('class', 'fnode').attr('tabindex', 0).attr('role', 'button')
            .attr('transform', `translate(${origen.x},${origen.y}) scale(0.2)`).style('opacity', 0);
          g.append('circle').attr('class', 'glow');
          g.append('circle').attr('class', 'bg');
          g.append('image').attr('preserveAspectRatio', 'xMidYMin slice');
          g.append('circle').attr('class', 'ring');
          g.append('text').attr('class', 'name');
          g.append('text').attr('class', 'rel');
          return g;
        },
        (update) => update,
        (exit) => exit.transition(t).style('opacity', 0).attr('transform', `translate(${L.cx},${L.cy}) scale(0.2)`).remove()
      );
      sel.raise();
      gNodos.selectAll('g.fnode').filter((d) => d.centro).raise();
      sel.classed('center', (d) => !!d.centro)
        .classed('pulse', (d) => pulso.has(d.id))
        .attr('aria-label', (d) => d.centro ? `${BY_ID[d.id].nombre}: abrir grimorio` : `Ver la constelación de ${BY_ID[d.id].nombre}`);
      sel.select('circle.glow').attr('r', (d) => d.r + 9).attr('fill', (d) => d.centro ? '#f5d77a' : TIPOS_RELACION[d.tipo].color).attr('fill-opacity', 0.35);
      sel.select('circle.bg').transition(t).attr('r', (d) => d.r + 3).attr('fill', (d) => casaDe(BY_ID[d.id]).color2);
      sel.select('image')
        .attr('data-char', (d) => d.id)
        .attr('href', (d) => imgFor(d.id))
        .attr('clip-path', (d) => clip(Math.round(d.r)))
        .attr('x', (d) => -d.r).attr('y', (d) => -d.r).attr('width', (d) => d.r * 2).attr('height', (d) => d.r * 2);
      sel.select('circle.ring').transition(t).attr('r', (d) => d.r).attr('stroke', (d) => casaDe(BY_ID[d.id]).color);
      sel.select('text.name')
        .attr('y', (d) => d.r + (d.centro ? 26 : 14))
        .attr('font-size', (d) => (d.centro ? 20 : denso ? 11 : 12))
        .text((d) => (d.centro || !denso ? BY_ID[d.id].nombre : corto(d.id)));
      sel.select('text.rel')
        .attr('y', (d) => d.r + (d.centro ? 46 : 29))
        .attr('font-size', (d) => (d.centro ? 14 : 11.5))
        .text((d) => (d.centro ? BY_ID[d.id].actor : conEtiqueta && W >= 700 ? d.etiqueta : ''));
      const opac = (d) => (!d.centro && !visibles.has(d.id) ? 0.25 : 1);
      sel.transition(t).style('opacity', opac).attr('transform', (d) => `translate(${d.x},${d.y})`);

      posPrevias = Object.fromEntries(L.nodos.map((d) => [d.id, { x: d.x, y: d.y }]));
      pintarPanel();
      pintarRecorrido();
      $$('.pick').forEach((b) => b.classList.toggle('active', b.dataset.pick === centro));
    }

    // Interacción con los nodos
    gNodos.on('click', (e) => {
      const g = e.target.closest('g.fnode');
      if (!g) return;
      const d = d3.select(g).datum();
      tip.classList.remove('show');
      d.centro ? abrirFicha(d.id) : fijarCentro(d.id);
    });
    gNodos.on('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const g = e.target.closest('g.fnode');
      if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    gNodos.on('pointerover', (e) => {
      const g = e.target.closest('g.fnode');
      if (!g) return;
      const d = d3.select(g).datum();
      const p = BY_ID[d.id];
      gRadios.selectAll('line').classed('hl', (l) => l.id === d.id);
      tip.innerHTML = d.centro
        ? `<h6>${esc(p.nombre)}</h6><small>${esc(p.actor)} · pulsa para abrir su grimorio</small>`
        : `<h6>${esc(p.nombre)}</h6><small>${esc(p.actor)}</small>
           <div class="tt-rel" style="--c:${TIPOS_RELACION[d.tipo].color}"><span class="dot"></span>${esc(TIPOS_RELACION[d.tipo].nombre)}: ${esc(d.etiqueta)}</div>`;
      tip.classList.add('show');
    });
    gNodos.on('pointermove', (e) => {
      const r = shell.getBoundingClientRect();
      let x = e.clientX - r.left + 16, y = e.clientY - r.top + 16;
      if (x + tip.offsetWidth > r.width - 8) x = e.clientX - r.left - tip.offsetWidth - 16;
      if (y + tip.offsetHeight > r.height - 8) y = e.clientY - r.top - tip.offsetHeight - 16;
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    });
    gNodos.on('pointerout', (e) => {
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('g.fnode')) return;
      tip.classList.remove('show');
      gRadios.selectAll('line').classed('hl', false);
    });

    function fijarCentro(id, { animar = true, conservarPulso = false } = {}) {
      if (!BY_ID[id]) return;
      centro = id;
      if (!conservarPulso) pulso = new Set();
      store.set('hpwiki:centro', id);
      recorrido = recorrido.filter((x) => x !== id).concat(id).slice(-6);
      pintar({ animar });
      // Centra el retrato en el selector desplazándolo solo en horizontal (la página no salta)
      const b = $(`.pick[data-pick="${id}"]`);
      const picker = $('#focusPicker');
      if (b) picker.scrollTo({ left: b.offsetLeft - picker.clientWidth / 2 + b.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    // Panel lateral con la ficha rápida
    function pintarPanel() {
      const p = BY_ID[centro];
      const c = casaDe(p);
      const grupos = relacionesAgrupadas(centro);
      const total = REL[centro].length;
      $('#focusPanel').innerHTML = `
        <div class="fp-head" style="--c1:${c.color2}">
          <img data-char="${p.id}" src="${imgFor(p.id)}" alt="${esc(p.nombre)}" onerror="HP.imgError(this)">
          <div>
            <h3>${esc(p.nombre)}</h3>
            <small>${esc(p.actor)}</small>
            <span class="house-seal mt-2" style="--c1:${c.color};--c2:${c.color2}"><span class="emoji">${c.animal}</span>${esc(c.nombre)}</span>
          </div>
        </div>
        <p class="fp-summary">${esc(p.resumen)}</p>
        <button class="btn btn-magic w-100 mb-3" data-open="${p.id}"><i class="bi bi-book"></i> Abrir su grimorio</button>
        <div class="fp-count">${total} vínculos</div>
        <div class="fp-bars">${grupos.map(([t, l]) => `<span style="--c:${TIPOS_RELACION[t].color};width:${(l.length / total) * 100}%" title="${esc(TIPOS_RELACION[t].nombre)}: ${l.length}"></span>`).join('')}</div>
        <div class="fp-groups">${grupos.map(([t, l]) => `
          <div class="fp-group" style="--c:${TIPOS_RELACION[t].color};${tiposActivos.has(t) ? '' : 'opacity:.4'}">
            <h4><i class="bi ${TIPOS_RELACION[t].icono}"></i>${esc(TIPOS_RELACION[t].nombre)} · ${l.length}</h4>
            ${l.map((r) => `<button class="fp-item" data-centro="${r.otro}">
              <img data-char="${r.otro}" src="${imgFor(r.otro)}" alt="" onerror="HP.imgError(this)">
              <span><strong>${esc(BY_ID[r.otro].nombre)}</strong><small>${esc(r.etiqueta)}</small></span></button>`).join('')}
          </div>`).join('')}</div>`;
    }
    $('#focusPanel').addEventListener('click', (e) => {
      const b = e.target.closest('[data-centro]');
      if (b) fijarCentro(b.dataset.centro);
    });

    function pintarRecorrido() {
      $('#focusTrail').innerHTML = recorrido.length > 1
        ? '<span>Recorrido:</span>' + recorrido.map((id, i) =>
          `${i ? '<i class="bi bi-chevron-right"></i>' : ''}<button data-centro="${id}">${esc(BY_ID[id].nombre)}</button>`).join('')
        : '';
    }
    $('#focusTrail').addEventListener('click', (e) => {
      const b = e.target.closest('[data-centro]');
      if (b) fijarCentro(b.dataset.centro);
    });

    // Selector de personajes (respeta los filtros de la barra superior)
    function pintarSelector(lista) {
      $('#focusPicker').innerHTML = lista.map((p) => `
        <button class="pick${p.id === centro ? ' active' : ''}" data-pick="${p.id}" style="--c1:${casaDe(p).color2}" title="${esc(p.nombre)}">
          <img data-char="${p.id}" src="${imgFor(p.id)}" alt="" loading="lazy" onerror="HP.imgError(this)"><span>${esc(p.nombre)}</span>
        </button>`).join('');
    }
    $('#focusPicker').addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (b) fijarCentro(b.dataset.pick);
    });

    function filtrar(lista) {
      visibles = new Set(lista.map((p) => p.id));
      pintarSelector(lista);
      gNodos.selectAll('g.fnode').style('opacity', (d) => (!d.centro && !visibles.has(d.id) ? 0.25 : 1));
      gRadios.selectAll('line').classed('dim', (d) => !visibles.has(d.id));
    }

    function redimensionar() {
      const nW = el.clientWidth, nH = el.clientHeight;
      if (!nW || !nH || (nW === W && nH === H)) return;
      W = nW; H = nH;
      svg.attr('viewBox', [0, 0, W, H]);
      pintar({ animar: false });
    }

    function iluminar(ids) {
      const principal = ids.find((id) => BY_ID[id]) || centro;
      pulso = new Set(ids.filter((id) => id !== principal));
      fijarCentro(principal, { conservarPulso: true });
      setTimeout(() => { pulso = new Set(); gNodos.selectAll('g.fnode').classed('pulse', false); }, 7000);
    }

    pintarSelector(filtrados());
    pintar({ animar: false });
    return { pintar, filtrar, redimensionar, iluminar, fijarCentro };
  }

  function aplicarFiltroGrafo(lista) { conste && conste.filtrar(lista); }

  function asegurarGrafo() {
    if (!conste) {
      conste = initConstelacion();
      conste.filtrar(filtrados());
    } else {
      conste.redimensionar();
    }
  }

  /* ---------------------------------------------------------------------
     Cronología
     --------------------------------------------------------------------- */
  function avatarBtn(id) {
    const p = BY_ID[id];
    return `<button class="avatar-btn" data-open="${id}" title="${esc(p.nombre)} · ${esc(p.actor)}" style="--c1:${casaDe(p).color2}">
      <img data-char="${id}" src="${imgFor(id)}" alt="${esc(p.nombre)}" loading="lazy" onerror="HP.imgError(this)"></button>`;
  }

  function renderCronologia() {
    const tl = $('#timeline');
    tl.innerHTML = CRONOLOGIA.map((ev, i) => `
      <div class="tl-item reveal" style="--d:${(i % 2) * 0.1}s">
        <span class="tl-dot"><i class="bi ${ev.icono}"></i></span>
        <div class="tl-card">
          <div class="tl-year">${esc(ev.ano)}</div>
          <h3 class="tl-title">${esc(ev.titulo)}</h3>
          <p class="tl-text">${esc(ev.texto)}</p>
          <div class="tl-people">
            ${ev.personajes.map(avatarBtn).join('')}
            <button class="btn btn-magic-outline tl-map-btn" data-map="${i}"><i class="bi bi-diagram-3"></i> Ver en el mapa</button>
          </div>
        </div>
      </div>`).join('');
    tl.addEventListener('click', (e) => {
      const m = e.target.closest('[data-map]');
      if (m) {
        const ev = CRONOLOGIA[+m.dataset.map];
        mostrarVista('mapa');
        setTimeout(() => conste && conste.iluminar(ev.personajes), 350);
        toast('✨', `Constelación de <b>${esc(ev.titulo)}</b>: los implicados brillan`);
      }
    });
    observarReveal(tl);
  }

  /* ---------------------------------------------------------------------
     Casas
     --------------------------------------------------------------------- */
  function renderCasas() {
    const g = $('#houseGrid');
    g.innerHTML = Object.entries(CASAS).filter(([k]) => k !== 'ninguna').map(([k, c], i) => {
      const miembros = LISTA.filter((p) => p.casa === k);
      return `
        <div class="col-sm-6 col-xl-3 reveal" style="--d:${i * 0.1}s">
          <article class="house-card" data-house-go="${k}" tabindex="0" role="button" style="--c1:${c.color};--c2:${c.color2}">
            <div class="house-crest">${c.animal}</div>
            <h3 class="house-name">${esc(c.nombre)}</h3>
            <p class="house-values">${esc(c.valores)}</p>
            <div class="house-meta">
              <div><small>Fundador</small>${esc(c.fundador)}</div>
              <div><small>Elemento</small>${esc(c.elemento)}</div>
              <div><small>Fantasma</small>${esc(c.fantasma)}</div>
              <div><small>Miembros</small>${miembros.length} en la wiki</div>
            </div>
            <div class="house-members">${miembros.slice(0, 14).map((p) => avatarBtn(p.id)).join('')}</div>
          </article>
        </div>`;
    }).join('');
    g.addEventListener('click', (e) => {
      if (e.target.closest('[data-open]')) return;
      const card = e.target.closest('[data-house-go]');
      if (card) irACasa(card.dataset.houseGo);
    });
    observarReveal(g);
  }

  function irACasa(casa) {
    setCasa(casa);
    mostrarVista('retratos');
    toast(CASAS[casa].animal, `La wiki se tiñe de los colores de <b>${CASAS[casa].nombre}</b>`);
  }

  /* ---------------------------------------------------------------------
     Navegación entre vistas
     --------------------------------------------------------------------- */
  function mostrarVista(v, { scroll = true } = {}) {
    const anterior = state.vista;
    state.vista = v;
    if (anterior === 'merodeador' && v !== 'merodeador') window.Merodeador.salir();
    document.body.dataset.vista = v;
    $$('.view').forEach((s) => s.classList.toggle('active', s.id === 'view-' + v));
    $$('.view-switch .nav-link').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
    if (v === 'mapa') requestAnimationFrame(asegurarGrafo);
    if (v === 'merodeador') requestAnimationFrame(() => window.Merodeador.entrar());
    if (scroll) {
      const ancla = v === 'merodeador' ? $('#main') : $('#toolbar');
      const top = ancla.getBoundingClientRect().top + window.scrollY - $('#mainNav').offsetHeight + 1;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    const nav = bootstrap.Collapse.getInstance($('#navMenu'));
    if (nav) nav.hide();
  }

  function initNavegacion() {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-view]');
      if (b) { e.preventDefault(); mostrarVista(b.dataset.view); return; }
      const o = e.target.closest('[data-open]');
      if (o) abrirFicha(o.dataset.open);
    });
    window.addEventListener('resize', () => conste && state.vista === 'mapa' && conste.redimensionar());
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        $('#searchInput').focus();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Sombrero Seleccionador
     --------------------------------------------------------------------- */
  const PREGUNTAS = [
    { q: '¿Qué es lo que más valoras?', o: [['La valentía', 'gryffindor'], ['La ambición', 'slytherin'], ['La sabiduría', 'ravenclaw'], ['La lealtad', 'hufflepuff']] },
    { q: 'Un trol entra en los baños del castillo. Tú…', o: [['Lo enfrentas varita en mano', 'gryffindor'], ['Buscas cómo sacar ventaja', 'slytherin'], ['Recuerdas el hechizo exacto', 'ravenclaw'], ['Te aseguras de que nadie quede atrás', 'hufflepuff']] },
    { q: 'Elige una reliquia de los fundadores:', o: [['La espada de Gryffindor', 'gryffindor'], ['El guardapelo de Slytherin', 'slytherin'], ['La diadema de Ravenclaw', 'ravenclaw'], ['La copa de Hufflepuff', 'hufflepuff']] },
    { q: '¿Cuál sería tu asignatura favorita?', o: [['Defensa Contra las Artes Oscuras', 'gryffindor'], ['Pociones', 'slytherin'], ['Encantamientos', 'ravenclaw'], ['Herbología', 'hufflepuff']] },
    { q: 'El espejo de Oesed te mostraría…', o: [['Una gran hazaña heroica', 'gryffindor'], ['Tu nombre en lo más alto', 'slytherin'], ['Un saber que nadie más posee', 'ravenclaw'], ['A todos los tuyos, felices y juntos', 'hufflepuff']] },
    { q: '¿Qué te gustaría que dijeran de ti?', o: [['Que fuiste valiente', 'gryffindor'], ['Que llegaste lejos', 'slytherin'], ['Que eras brillante', 'ravenclaw'], ['Que siempre estuviste ahí', 'hufflepuff']] }
  ];
  let hatModal, hatPaso = 0, hatVotos = {};

  function hatRender() {
    const body = $('#hatBody');
    if (hatPaso < PREGUNTAS.length) {
      const pr = PREGUNTAS[hatPaso];
      const ops = [...pr.o].sort(() => Math.random() - 0.5);
      body.innerHTML = `
        <div class="hat-progress"><div style="width:${(hatPaso / PREGUNTAS.length) * 100}%"></div></div>
        <p class="hat-q">${esc(pr.q)}</p>
        <div class="hat-options">${ops.map(([t, c], i) => `<button class="hat-opt" data-voto="${c}" style="animation-delay:${i * 0.07}s">${esc(t)}</button>`).join('')}</div>`;
      return;
    }
    body.innerHTML = `<div class="hat-progress"><div style="width:100%"></div></div><p class="hat-q">Hmm… difícil. Muy difícil. Veo mucho coraje… y también una mente nada despreciable…</p>`;
    setTimeout(() => {
      const max = Math.max(...Object.values(hatVotos));
      const empatadas = Object.keys(hatVotos).filter((k) => hatVotos[k] === max);
      const casa = empatadas[Math.floor(Math.random() * empatadas.length)];
      const c = CASAS[casa];
      const miembros = LISTA.filter((p) => p.casa === casa).slice(0, 10);
      body.innerHTML = `
        <div class="hat-result-crest">${c.animal}</div>
        <p class="mb-0 text-uppercase small" style="letter-spacing:.3em;color:var(--muted)">¡Mejor que sea…!</p>
        <div class="hat-house" style="color:${c.color2}">${esc(c.nombre.toUpperCase())}</div>
        <p class="fst-italic">${esc(c.valores)}</p>
        <p class="small mb-2" style="color:var(--muted)">Compartes casa con:</p>
        <div class="house-members mb-4">${miembros.map((p) => avatarBtn(p.id)).join('')}</div>
        <div class="d-flex gap-2 justify-content-center flex-wrap">
          <button class="btn btn-magic" data-hat-casa="${casa}"><i class="bi bi-palette"></i> Teñir la wiki de ${esc(c.nombre)}</button>
          <button class="btn btn-magic-outline" data-hat-reset><i class="bi bi-arrow-repeat"></i> Repetir</button>
        </div>`;
      fuegosArtificiales(c.color2);
    }, 1900);
  }

  function initSombrero() {
    const el = $('#hatModal');
    hatModal = new bootstrap.Modal(el);
    $('#btnSombrero').addEventListener('click', () => { hatPaso = 0; hatVotos = {}; hatRender(); hatModal.show(); });
    el.addEventListener('click', (e) => {
      const v = e.target.closest('[data-voto]');
      if (v) { hatVotos[v.dataset.voto] = (hatVotos[v.dataset.voto] || 0) + 1; hatPaso++; hatRender(); return; }
      const c = e.target.closest('[data-hat-casa]');
      if (c) { hatModal.hide(); irACasa(c.dataset.hatCasa); return; }
      if (e.target.closest('[data-hat-reset]')) { hatPaso = 0; hatVotos = {}; hatRender(); return; }
      if (e.target.closest('[data-open]')) hatModal.hide();
    });
  }

  /* ---------------------------------------------------------------------
     API de YouTube (compartida por el vídeo de fondo y la banda sonora)
     --------------------------------------------------------------------- */
  const colaYT = [];
  let ytApiPedida = false;
  function cargarYT(ok, fallo) {
    if (window.YT && window.YT.Player) { ok(); return; }
    colaYT.push(ok);
    if (ytApiPedida) return;
    ytApiPedida = true;
    window.onYouTubeIframeAPIReady = () => colaYT.splice(0).forEach((fn) => fn());
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => fallo && fallo();
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------------
     Vídeo de fondo translúcido (tráileres oficiales vía YouTube)
     --------------------------------------------------------------------- */
  let yt = null, ytListo = false, ytErrores = 0, ytIdx = 0;
  let siguienteVideo = () => {};

  function initVideo() {
    const dock = $('#videoDock');
    const titulo = $('#videoTitle');
    const opac = $('#vidOpacity');
    const guardada = store.get('hpwiki:opacidad', 32);
    opac.value = guardada;
    document.documentElement.style.setProperty('--video-opacity', guardada / 100);
    document.dispatchEvent(new Event('hp:opacidad'));
    opac.addEventListener('input', () => {
      document.documentElement.style.setProperty('--video-opacity', opac.value / 100);
      store.set('hpwiki:opacidad', +opac.value);
      document.dispatchEvent(new Event('hp:opacidad'));
    });

    // En pantallas medianas el dock del vídeo empieza plegado para dejar sitio a la gramola
    if (window.innerWidth < 1280) dock.classList.add('collapsed');
    $('#dockToggle').addEventListener('click', () => dock.classList.toggle('collapsed'));

    $('#vidPlay').addEventListener('click', (e) => {
      if (!ytListo) return;
      const pausado = yt.getPlayerState() !== YT.PlayerState.PLAYING;
      pausado ? yt.playVideo() : yt.pauseVideo();
      e.currentTarget.innerHTML = `<i class="bi ${pausado ? 'bi-pause-fill' : 'bi-play-fill'}"></i>`;
    });
    $('#vidNext').addEventListener('click', () => siguienteVideo());
    $('#vidMute').addEventListener('click', (e) => {
      if (!ytListo) return;
      if (yt.isMuted()) { yt.unMute(); yt.setVolume(35); musica.pausar(); } else yt.mute();
      e.currentTarget.innerHTML = `<i class="bi ${yt.isMuted() ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'}"></i>`;
      toast(yt.isMuted() ? '🔇' : '🔊', yt.isMuted() ? 'Silencio en el Gran Comedor' : 'Sonido activado');
    });
    $('#vidHide').addEventListener('click', (e) => {
      const bg = $('#bgVideo');
      bg.classList.toggle('hidden-video');
      const oculto = bg.classList.contains('hidden-video');
      e.currentTarget.innerHTML = `<i class="bi ${oculto ? 'bi-eye' : 'bi-eye-slash'}"></i>`;
      if (ytListo) oculto ? yt.pauseVideo() : yt.playVideo();
    });

    if (location.protocol === 'file:') {
      titulo.textContent = 'Abre la web con un servidor local para ver las escenas';
      setTimeout(() => toast('🎬', 'Para ver los tráileres de fondo abre la web con un servidor local (mira el README).', 7000), 2500);
    }

    // Lista de reproducción manual: así cada tráiler empieza saltándose el cartel de clasificación
    const SALTO = 11;
    const tituloActual = () => { titulo.textContent = `Tráiler oficial · ${VIDEOS_FONDO[ytIdx].titulo}`; };
    siguienteVideo = () => {
      if (!ytListo) return;
      ytIdx = (ytIdx + 1) % VIDEOS_FONDO.length;
      yt.loadVideoById({ videoId: VIDEOS_FONDO[ytIdx].id, startSeconds: SALTO });
      tituloActual();
    };

    cargarYT(() => {
      yt = new YT.Player('ytPlayer', {
        videoId: VIDEOS_FONDO[0].id,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3,
          modestbranding: 1, playsinline: 1, rel: 0, start: SALTO,
          ...(location.protocol.startsWith('http') ? { origin: location.origin } : {})
        },
        events: {
          onReady: (e) => {
            ytListo = true;
            e.target.mute();
            e.target.playVideo();
            tituloActual();
            // Si el navegador bloquea el autoplay, se reintenta con la primera interacción
            const reintentar = () => {
              const bg = $('#bgVideo');
              if (!bg.classList.contains('playing') && !bg.classList.contains('hidden-video')) yt.playVideo();
            };
            setTimeout(reintentar, 2500);
            ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => window.addEventListener(ev, reintentar, { once: true, passive: true }));
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) $('#bgVideo').classList.add('playing');
            if (e.data === YT.PlayerState.ENDED) siguienteVideo();
          },
          onError: () => {
            ytErrores++;
            if (ytErrores < VIDEOS_FONDO.length && ytListo) siguienteVideo();
            else titulo.textContent = 'Escenas no disponibles ahora mismo';
          }
        }
      });
    }, () => (titulo.textContent = 'Sin conexión con YouTube'));
  }


  /* ---------------------------------------------------------------------
     Gramola mágica: banda sonora oficial de fondo
     --------------------------------------------------------------------- */
  const musica = { pausar() {}, reanudar() {}, sonando: () => false, quiereSonar: () => false };

  function initMusica() {
    const dock = $('#musicDock');
    const btnPlay = $('#musPlay');
    const vol = $('#musVolume');
    const menu = $('#trackMenu');
    let mp = null, listo = false, idx = store.get('hpwiki:tema', 0) % BSO.length, errores = 0, sonando = false;
    let pausadaPorUsuario = store.get('hpwiki:musicaPausada', false);

    vol.value = store.get('hpwiki:volumen', 35);
    if (window.innerWidth < 768) dock.classList.add('collapsed');

    menu.innerHTML = BSO.map((t, i) => `
      <li><button class="dropdown-item" data-track="${i}">
        <span class="num">${i + 1}</span>
        <span><strong>${esc(t.titulo)}</strong><small>${esc(t.autor)} · ${esc(t.pelicula)}</small></span>
      </button></li>`).join('');

    const pintar = () => {
      const t = BSO[idx];
      $('#trackTitle').textContent = t.titulo;
      $('#trackInfo').textContent = `${t.autor} · ${t.pelicula}`;
      $$('[data-track]', menu).forEach((b) => b.classList.toggle('active', +b.dataset.track === idx));
      dock.classList.toggle('playing', sonando);
      btnPlay.innerHTML = `<i class="bi ${sonando ? 'bi-pause-fill' : 'bi-play-fill'}"></i>`;
    };

    const cargarTema = (i, reproducir = true) => {
      idx = (i + BSO.length) % BSO.length;
      store.set('hpwiki:tema', idx);
      if (listo) reproducir ? mp.loadVideoById(BSO[idx].id) : mp.cueVideoById(BSO[idx].id);
      pintar();
    };

    const play = () => {
      if (!listo) return;
      pausadaPorUsuario = false;
      store.set('hpwiki:musicaPausada', false);
      // El tráiler de fondo queda en silencio mientras suena la BSO
      if (ytListo && !yt.isMuted()) { yt.mute(); $('#vidMute').innerHTML = '<i class="bi bi-volume-mute-fill"></i>'; }
      mp.setVolume(+vol.value);
      mp.playVideo();
    };
    const pause = (porUsuario) => {
      if (!listo) return;
      mp.pauseVideo();
      if (porUsuario) { pausadaPorUsuario = true; store.set('hpwiki:musicaPausada', true); }
    };
    musica.pausar = () => pause(false);
    musica.reanudar = () => { if (!pausadaPorUsuario) play(); };
    musica.sonando = () => sonando;
    musica.quiereSonar = () => listo && !pausadaPorUsuario;

    btnPlay.addEventListener('click', () => (sonando ? pause(true) : play()));
    $('#musNext').addEventListener('click', () => { pausadaPorUsuario = false; cargarTema(idx + 1); });
    $('#musPrev').addEventListener('click', () => { pausadaPorUsuario = false; cargarTema(idx - 1); });
    menu.addEventListener('click', (e) => {
      const b = e.target.closest('[data-track]');
      if (b) { pausadaPorUsuario = false; cargarTema(+b.dataset.track); }
    });
    vol.addEventListener('input', () => { if (listo) mp.setVolume(+vol.value); store.set('hpwiki:volumen', +vol.value); });
    $('#musToggle').addEventListener('click', () => {
      const abrir = dock.classList.contains('collapsed');
      dock.classList.toggle('collapsed', !abrir);
      if (abrir && !sonando) play();
    });

    // Barra de progreso
    setInterval(() => {
      if (!listo || !sonando) return;
      const d = mp.getDuration(), c = mp.getCurrentTime();
      if (d > 0) $('#musicBar').style.width = `${(c / d) * 100}%`;
    }, 500);

    // Los navegadores sólo permiten sonido tras una interacción: la música arranca con el primer gesto
    const arrancarConGesto = (e) => {
      if (e && e.target && e.target.closest && e.target.closest('#musicDock')) return;
      if (!pausadaPorUsuario && !sonando) {
        play();
        setTimeout(() => sonando && toast('🎻', `Sonando <b>${esc(BSO[idx].titulo)}</b> · ${esc(BSO[idx].autor)}. Controla la música con el vinilo ⚡`, 4500), 800);
      }
    };
    const gestos = ['pointerdown', 'keydown'];
    const unaVez = (e) => { gestos.forEach((g) => window.removeEventListener(g, unaVez, true)); arrancarConGesto(e); };

    pintar();
    cargarYT(() => {
      // Dominio distinto al del tráiler: así YouTube no pausa un reproductor al arrancar el otro
      mp = new YT.Player('musicPlayer', {
        width: 200, height: 200,
        videoId: BSO[idx].id,
        host: 'https://www.youtube.com',
        playerVars: {
          autoplay: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, playsinline: 1, rel: 0,
          ...(location.protocol.startsWith('http') ? { origin: location.origin } : {})
        },
        events: {
          onReady: () => {
            listo = true;
            mp.setVolume(+vol.value);
            if (pausadaPorUsuario) $('#trackInfo').textContent = `${BSO[idx].autor} · pulsa ▶ para escuchar`;
            gestos.forEach((g) => window.addEventListener(g, unaVez, true));
          },
          onStateChange: (e) => {
            sonando = e.data === YT.PlayerState.PLAYING;
            if (sonando) errores = 0;
            if (e.data === YT.PlayerState.ENDED) { cargarTema(idx + 1); return; }
            pintar();
          },
          onError: () => {
            // Si un tema no se puede reproducir en esta región, se salta al siguiente
            if (++errores < BSO.length) cargarTema(idx + 1);
            else $('#trackInfo').textContent = 'La banda sonora no está disponible ahora mismo';
          }
        }
      });
    }, () => ($('#trackInfo').textContent = 'Sin conexión con YouTube'));
  }

  /* ---------------------------------------------------------------------
     Lienzo mágico: polvo dorado, estrellas fugaces y estela de varita
     --------------------------------------------------------------------- */
  const cv = $('#magicCanvas');
  const ctx = cv.getContext('2d');
  let CW = 0, CH = 0, DPR = 1;
  const motas = [], chispas = [], ondas = [], fugaces = [];

  function redimCanvas() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    CW = window.innerWidth; CH = window.innerHeight;
    cv.width = CW * DPR; cv.height = CH * DPR;
    cv.style.width = CW + 'px'; cv.style.height = CH + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const objetivo = Math.round(Math.min(120, (CW * CH) / 13000) * (reduceMotion ? 0.3 : 1));
    while (motas.length < objetivo) motas.push(nuevaMota(true));
    motas.length = objetivo;
  }
  function nuevaMota(aleatoria) {
    return {
      x: Math.random() * CW, y: aleatoria ? Math.random() * CH : CH + 10,
      r: Math.random() * 1.6 + 0.4, vy: -(Math.random() * 0.35 + 0.08), vx: (Math.random() - 0.5) * 0.15,
      fase: Math.random() * Math.PI * 2, vel: Math.random() * 0.03 + 0.01,
      col: Math.random() < 0.8 ? [245, 215, 122] : [200, 210, 255]
    };
  }
  function chispazo(x, y, n = 24, color) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = Math.random() * 4 + 1;
      chispas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 0, max: 40 + Math.random() * 30, r: Math.random() * 2 + 0.8, col: color || (Math.random() < 0.7 ? '255,221,130' : '255,255,255') });
    }
    ondas.push({ x, y, r: 4, a: 0.7 });
  }
  function hexRGB(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }
  function fuegosArtificiales(color) {
    const rgb = hexRGB(color);
    for (let i = 0; i < 5; i++) setTimeout(() => chispazo(CW * (0.2 + Math.random() * 0.6), CH * (0.2 + Math.random() * 0.4), 50, rgb), i * 260);
  }

  let ultimoMov = 0;
  window.addEventListener('pointermove', (e) => {
    const nox = $('#noxLayer');
    nox.style.setProperty('--mx', e.clientX + 'px');
    nox.style.setProperty('--my', e.clientY + 'px');
    if (reduceMotion || e.pointerType === 'touch') return;
    const ahora = performance.now();
    if (ahora - ultimoMov < 16) return;
    ultimoMov = ahora;
    for (let i = 0; i < 2; i++) {
      chispas.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 1.2, vy: Math.random() * 1.2 + 0.2, vida: 0, max: 30 + Math.random() * 25, r: Math.random() * 1.8 + 0.6, col: Math.random() < 0.75 ? '255,221,130' : '190,210,255' });
    }
  }, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input, select, .graph, .modal')) return;
    chispazo(e.clientX, e.clientY, 16);
  }, { passive: true });

  function dibujar() {
    ctx.clearRect(0, 0, CW, CH);
    ctx.globalCompositeOperation = 'lighter';

    for (const m of motas) {
      m.y += m.vy; m.x += m.vx + Math.sin(m.fase) * 0.12; m.fase += m.vel;
      if (m.y < -10) Object.assign(m, nuevaMota(false));
      const a = 0.35 + Math.sin(m.fase * 2) * 0.3;
      ctx.fillStyle = `rgba(${m.col.join(',')},${Math.max(0.05, a) * 0.35})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 3, 0, 7); ctx.fill();
      ctx.fillStyle = `rgba(${m.col.join(',')},${Math.max(0.1, a)})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill();
    }

    if (!reduceMotion && Math.random() < 0.004 && fugaces.length < 2) {
      fugaces.push({ x: Math.random() * CW * 0.7, y: Math.random() * CH * 0.35, vx: 9 + Math.random() * 5, vy: 3 + Math.random() * 2, vida: 0 });
    }
    for (let i = fugaces.length - 1; i >= 0; i--) {
      const f = fugaces[i];
      f.x += f.vx; f.y += f.vy; f.vida++;
      const g = ctx.createLinearGradient(f.x, f.y, f.x - f.vx * 12, f.y - f.vy * 12);
      g.addColorStop(0, 'rgba(255,245,210,.9)'); g.addColorStop(1, 'rgba(255,245,210,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - f.vx * 12, f.y - f.vy * 12); ctx.stroke();
      if (f.vida > 70 || f.x > CW + 100) fugaces.splice(i, 1);
    }

    for (let i = chispas.length - 1; i >= 0; i--) {
      const s = chispas[i];
      s.x += s.vx; s.y += s.vy; s.vy += 0.035; s.vx *= 0.98; s.vida++;
      const a = 1 - s.vida / s.max;
      if (a <= 0) { chispas.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(${s.col},${a * 0.3})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.2, 0, 7); ctx.fill();
      ctx.fillStyle = `rgba(${s.col},${a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    if (chispas.length > 600) chispas.splice(0, chispas.length - 600);

    for (let i = ondas.length - 1; i >= 0; i--) {
      const o = ondas[i];
      o.r += 4; o.a *= 0.92;
      ctx.strokeStyle = `rgba(255,221,130,${o.a})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 7); ctx.stroke();
      if (o.a < 0.02) ondas.splice(i, 1);
    }

    ctx.globalCompositeOperation = 'source-over';
    if (!document.hidden) requestAnimationFrame(dibujar);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(dibujar); });

  /* ---------------------------------------------------------------------
     Lumos / Nox
     --------------------------------------------------------------------- */
  function initLumos() {
    const btn = $('#btnLumos');
    btn.addEventListener('click', () => {
      const nox = document.body.classList.toggle('nox');
      btn.innerHTML = nox ? '<i class="bi bi-lightbulb"></i> <span>Lumos</span>' : '<i class="bi bi-lightbulb-fill"></i> <span>Nox</span>';
      toast(nox ? '🌑' : '💡', nox ? '<b>Nox.</b> Sólo tu varita ilumina el castillo… mueve el cursor.' : '<b>¡Lumos!</b> Se hace la luz.');
    });
  }

  /* ---------------------------------------------------------------------
     Easter egg: escribir la frase en el buscador abre el Mapa del Merodeador
     --------------------------------------------------------------------- */
  function huevoMerodeador(txt) {
    const t = norm(txt);
    const abrir = t.includes('juro solemnemente');
    const cerrar = t.includes('travesura realizada');
    if (!abrir && !cerrar) return false;
    $('#searchInput').value = '';
    state.q = '';
    actualizar();
    if (abrir) mostrarVista('merodeador');
    else if (state.vista === 'merodeador') window.Merodeador.travesuraRealizada();
    return true;
  }

  /* ---------------------------------------------------------------------
     Hero: velas, contadores y escenas
     --------------------------------------------------------------------- */
  function initHero() {
    const cont = $('#candles');
    const n = window.innerWidth < 768 ? 8 : 16;
    for (let i = 0; i < n; i++) {
      const c = document.createElement('span');
      c.className = 'candle';
      const prof = Math.random();
      // Velas a los lados y sobre el título, para no tapar el texto
      const lado = i % 3;
      const left = lado === 0 ? 2 + Math.random() * 18 : lado === 1 ? 80 + Math.random() * 18 : 25 + Math.random() * 50;
      const top = lado === 2 ? 2 + Math.random() * 8 : 6 + Math.random() * 50;
      c.style.cssText = `left:${left}%;top:${top}%;--h:${28 + prof * 34}px;--dur:${5 + Math.random() * 5}s;--delay:${-Math.random() * 6}s;--o:${0.45 + prof * 0.5};--blur:${(1 - prof) * 1.5}px;transform:scale(${0.6 + prof * 0.6})`;
      cont.appendChild(c);
    }

    // --hero-p: 0 en la portada → 1 al llegar al contenido
    const root = document.documentElement;
    const hero = $('#hero');
    const actualizarPortada = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.75)));
      const base = parseFloat(getComputedStyle(root).getPropertyValue('--video-opacity')) || 0.32;
      const enPortada = Math.max(base, 0.88);
      root.style.setProperty('--hero-p', p.toFixed(3));
      root.style.setProperty('--video-live', (enPortada + (base - enPortada) * p).toFixed(3));
    };
    window.addEventListener('scroll', actualizarPortada, { passive: true });
    document.addEventListener('hp:opacidad', actualizarPortada);
    actualizarPortada();


  }

  /* ---------------------------------------------------------------------
     Toasts y animación de aparición
     --------------------------------------------------------------------- */
  function toast(icono, html, delay = 3200) {
    const el = document.createElement('div');
    el.className = 'toast magic-toast align-items-center';
    el.setAttribute('role', 'status');
    el.innerHTML = `<div class="toast-body"><span class="toast-icon">${icono}</span><span>${html}</span></div>`;
    $('#toastBox').appendChild(el);
    const t = new bootstrap.Toast(el, { delay });
    el.addEventListener('hidden.bs.toast', () => el.remove());
    t.show();
  }

  const revealObs = 'IntersectionObserver' in window
    ? new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } }), { threshold: 0.12 })
    : null;
  function observarReveal(ctxEl) {
    $$('.reveal', ctxEl).forEach((el) => (revealObs ? revealObs.observe(el) : el.classList.add('in')));
  }

  /* ---------------------------------------------------------------------
     Arranque
     --------------------------------------------------------------------- */
  window.HP = {
    imgError(img) {
      const id = img.dataset.char;
      const fb = avatar(id);
      if (img.src !== fb) img.src = fb;
    },
    abrirFicha: (id) => abrirFicha(id),
    toast: (...a) => toast(...a),
    cargarYT: (...a) => cargarYT(...a),
    musica,
    reduceMotion
  };

  function arrancar() {
    construirFiltros();
    construirLeyenda();
    initTarjetas();
    initFicha();
    initNavegacion();
    initSombrero();
    initLumos();
    initHero();
    renderCronologia();
    renderCasas();
    actualizar();
    redimCanvas();
    window.addEventListener('resize', redimCanvas);
    requestAnimationFrame(dibujar);
    initVideo();
    initMusica();
    window.Merodeador.init();
    cargarFotos();

    $('#btnAccio').addEventListener('click', () => {
      const lista = filtrados().length ? filtrados() : LISTA;
      const p = lista[Math.floor(Math.random() * lista.length)];
      toast('🪄', `<b>¡Accio ${esc(p.nombre)}!</b>`);
      abrirFicha(p.id);
    });

    const ocultarLoader = () => {
      const l = $('#loader');
      if (l.classList.contains('done')) return;
      l.classList.add('done');
      $$('.hero .reveal').forEach((el, i) => { el.style.setProperty('--d', `${i * 0.12}s`); el.classList.add('in'); });
      const m = location.hash.match(/^#personaje\/([\w-]+)/);
      if (m && BY_ID[m[1]]) setTimeout(() => abrirFicha(m[1]), 500);
    };
    window.addEventListener('load', () => setTimeout(ocultarLoader, 700));
    setTimeout(ocultarLoader, 3500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
