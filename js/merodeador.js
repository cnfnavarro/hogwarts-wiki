/* =========================================================================
   HOGWARTS WIKI · El Mapa del Merodeador
   Mapa interactivo de Hogwarts (castillo, terrenos y Hogsmeade) por el que
   se mueven todos los personajes dejando sus huellas, como en la película.
   - La tinta del mapa es SVG (nítida con cualquier zoom).
   - Huellas y nombres se dibujan en un <canvas> superpuesto.
   Depende de: d3, data.js (PERSONAJES, CASAS, CLIP_FRASE) y window.HP (app.js).
   ========================================================================= */
(() => {
  'use strict';

  const W = 2000, H = 1300;
  const TINTA = '#3b2412';
  const TINTA_ROJA = '#8a1c0c';
  const $ = (s, c = document) => c.querySelector(s);

  // Aleatorio con semilla: el mapa se dibuja siempre igual
  let semilla = 7;
  const rnd = () => ((semilla = (semilla * 16807) % 2147483647) - 1) / 2147483646;

  /* ---------------------------------------------------------------------
     Geometría: lugares, cruces de pasillos y caminos
     --------------------------------------------------------------------- */
  const LUGARES = {
    comedor: { n: 'Gran Comedor', x: 920, y: 550, r: 70 },
    vestibulo: { n: 'Vestíbulo', x: 1095, y: 550, r: 28 },
    patio: { n: 'Patio', x: 1240, y: 555, r: 50 },
    escaleras: { n: 'Escaleras móviles', x: 940, y: 390, r: 28 },
    biblioteca: { n: 'Biblioteca', x: 700, y: 530, r: 50 },
    enfermeria: { n: 'Enfermería', x: 700, y: 640, r: 45 },
    gryffindor: { n: 'Torre de Gryffindor', x: 700, y: 330, r: 36 },
    ravenclaw: { n: 'Torre de Ravenclaw', x: 1310, y: 330, r: 34 },
    dumbledore: { n: 'Despacho del Director', x: 1100, y: 330, r: 24 },
    adivinacion: { n: 'Torre de Adivinación', x: 830, y: 285, r: 18 },
    menesteres: { n: 'Sala de los Menesteres', x: 1222, y: 425, r: 30 },
    defensa: { n: 'Aula de Defensa', x: 1080, y: 428, r: 40 },
    astronomia: { n: 'Torre de Astronomía', x: 548, y: 560, r: 20 },
    myrtle: { n: 'Baño de Myrtle', x: 820, y: 408, r: 16 },
    mazmorras: { n: 'Mazmorras de Slytherin', x: 875, y: 755, r: 50 },
    pociones: { n: 'Aula de Pociones', x: 1030, y: 745, r: 34 },
    cocinas: { n: 'Cocinas', x: 1185, y: 745, r: 50 },
    camara: { n: 'Cámara de los Secretos', x: 685, y: 790, r: 50 },
    lechuceria: { n: 'Lechucería', x: 1430, y: 560, r: 14 },
    lago: { n: 'Orilla del Lago Negro', x: 610, y: 960, r: 30 },
    barco: { n: 'Barco de Durmstrang', x: 340, y: 1000, r: 16 },
    invernaderos: { n: 'Invernaderos', x: 1000, y: 990, r: 40 },
    sauce: { n: 'Sauce Boxeador', x: 1230, y: 1010, r: 22 },
    hagrid: { n: 'Cabaña de Hagrid', x: 1480, y: 880, r: 30 },
    carruaje: { n: 'Carruaje de Beauxbatons', x: 1470, y: 1070, r: 26 },
    bosque: { n: 'Bosque Prohibido', x: 1780, y: 1030, r: 140 },
    quidditch: { n: 'Campo de quidditch', x: 1700, y: 450, r: 110 },
    hogsmeade: { n: 'Hogsmeade', x: 1770, y: 155, r: 55 },
    tresescobas: { n: 'Las Tres Escobas', x: 1690, y: 125, r: 16 },
    cabezapuerco: { n: 'Cabeza de Puerco', x: 1885, y: 100, r: 16 },
    honeydukes: { n: 'Honeydukes', x: 1800, y: 205, r: 14 },
    gritos: { n: 'Casa de los Gritos', x: 1930, y: 640, r: 18 },
    estacion: { n: 'Estación de Hogsmeade', x: 1530, y: 95, r: 30 }
  };

  const CRUCES = {
    n1: [600, 467], gt: [700, 467], n2: [790, 467], n3: [940, 467], n4: [1080, 467], n5: [1215, 467], n6: [1375, 467],
    s1: [790, 665], s2: [940, 665], s3: [1095, 665], s4: [1240, 665], s5: [1375, 665],
    w2: [600, 560], w3: [600, 640], w4: [600, 700],
    puerta: [1095, 860], cesped: [1095, 935], orilla: [820, 950], o2: [1380, 960], lindero: [1605, 960],
    este: [1500, 420], e2: [1525, 700], h1: [1560, 300], h2: [1935, 300]
  };

  // [a, b, puntos intermedios?, tipo?]  tipo: 'pasillo' | 'fuera' | 'secreto'
  const CAMINOS = [
    ['n1', 'gt'], ['gt', 'n2'], ['n2', 'n3'], ['n3', 'n4'], ['n4', 'n5'], ['n5', 'n6'],
    ['s1', 's2'], ['s2', 's3'], ['s3', 's4'], ['s4', 's5'], ['n6', 's5'], ['n2', 's1'],
    ['n1', 'w2'], ['w2', 'w3'], ['w3', 'w4'], ['w4', 's1'],
    ['gryffindor', 'gt'], ['biblioteca', 'gt'], ['myrtle', 'n2'], ['escaleras', 'n3'], ['escaleras', 'adivinacion'],
    ['escaleras', 'dumbledore'], ['defensa', 'n4'], ['menesteres', 'n5'], ['ravenclaw', 'n6'],
    ['comedor', 'n3'], ['comedor', 's2'], ['comedor', 'vestibulo'], ['vestibulo', 'n4'], ['vestibulo', 's3'],
    ['vestibulo', 'patio'], ['patio', 'n5'], ['patio', 's4'], ['patio', 'lechuceria'],
    ['astronomia', 'w2'], ['enfermeria', 'w3'], ['camara', 'w4'], ['mazmorras', 's1'], ['mazmorras', 's2'],
    ['pociones', 's2'], ['pociones', 's3'], ['cocinas', 's3'], ['cocinas', 's4'], ['s3', 'puerta'],
    // Terrenos
    ['puerta', 'cesped', null, 'fuera'], ['cesped', 'orilla', null, 'fuera'], ['orilla', 'lago', null, 'fuera'],
    ['lago', 'barco', null, 'fuera'], ['cesped', 'invernaderos', null, 'fuera'], ['cesped', 'sauce', null, 'fuera'],
    ['sauce', 'o2', null, 'fuera'], ['o2', 'hagrid', null, 'fuera'], ['o2', 'carruaje', null, 'fuera'],
    ['hagrid', 'lindero', null, 'fuera'], ['lindero', 'bosque', null, 'fuera'], ['carruaje', 'lindero', null, 'fuera'],
    ['n6', 'este', null, 'fuera'], ['este', 'quidditch', null, 'fuera'], ['este', 'e2', null, 'fuera'],
    ['e2', 'hagrid', null, 'fuera'], ['este', 'h1', null, 'fuera'], ['h1', 'hogsmeade', null, 'fuera'],
    ['h1', 'estacion', null, 'fuera'], ['hogsmeade', 'tresescobas', null, 'fuera'], ['hogsmeade', 'cabezapuerco', null, 'fuera'],
    ['hogsmeade', 'honeydukes', null, 'fuera'], ['hogsmeade', 'h2', null, 'fuera'], ['h2', 'gritos', null, 'fuera'],
    // Pasadizos secretos
    ['myrtle', 'camara', [[760, 600]], 'secreto'],
    ['escaleras', 'honeydukes', [[985, 300], [1010, 215], [1250, 185], [1550, 215]], 'secreto'],
    ['sauce', 'gritos', [[1330, 1120], [1880, 760]], 'secreto']
  ];

  // Dónde suele estar cada personaje (se repite un lugar para que sea más probable)
  const RUTINAS = {
    harry: ['gryffindor', 'comedor', 'quidditch', 'hagrid', 'biblioteca', 'patio', 'menesteres', 'lago', 'honeydukes'],
    hermione: ['biblioteca', 'biblioteca', 'gryffindor', 'comedor', 'hagrid', 'defensa', 'patio'],
    ron: ['gryffindor', 'comedor', 'comedor', 'quidditch', 'hagrid', 'patio', 'cocinas'],
    dumbledore: ['dumbledore', 'dumbledore', 'dumbledore', 'dumbledore', 'comedor'],
    snape: ['pociones', 'mazmorras', 'mazmorras', 'defensa', 'comedor', 'dumbledore'],
    mcgonagall: ['gryffindor', 'comedor', 'vestibulo', 'dumbledore', 'patio', 'escaleras'],
    hagrid: ['hagrid', 'hagrid', 'bosque', 'bosque', 'comedor', 'tresescobas'],
    lupin: ['defensa', 'defensa', 'gritos', 'sauce', 'comedor', 'biblioteca'],
    slughorn: ['pociones', 'mazmorras', 'comedor', 'tresescobas'],
    flitwick: ['ravenclaw', 'comedor', 'escaleras', 'biblioteca'],
    trelawney: ['adivinacion', 'adivinacion', 'adivinacion', 'comedor'],
    sprout: ['invernaderos', 'invernaderos', 'comedor', 'cocinas'],
    filch: ['vestibulo', 'escaleras', 'patio', 'comedor', 'biblioteca', 'mazmorras', 'lechuceria', 'enfermeria'],
    draco: ['mazmorras', 'mazmorras', 'comedor', 'menesteres', 'quidditch', 'patio', 'pociones'],
    neville: ['gryffindor', 'invernaderos', 'comedor', 'menesteres', 'lago'],
    luna: ['ravenclaw', 'patio', 'bosque', 'lago', 'comedor', 'biblioteca'],
    cedric: ['cocinas', 'quidditch', 'comedor', 'patio', 'lago'],
    cho: ['ravenclaw', 'lechuceria', 'quidditch', 'comedor', 'menesteres'],
    lavender: ['gryffindor', 'adivinacion', 'comedor', 'patio'],
    ginny: ['gryffindor', 'quidditch', 'comedor', 'menesteres', 'patio'],
    fred: ['gryffindor', 'escaleras', 'honeydukes', 'comedor', 'quidditch', 'cocinas'],
    george: ['gryffindor', 'escaleras', 'honeydukes', 'comedor', 'quidditch', 'cocinas'],
    arthur: ['hogsmeade', 'tresescobas', 'estacion', 'vestibulo'],
    molly: ['estacion', 'hogsmeade', 'comedor', 'cocinas'],
    percy: ['gryffindor', 'biblioteca', 'comedor', 'vestibulo'],
    bill: ['hogsmeade', 'cabezapuerco', 'carruaje', 'patio'],
    james: ['gritos', 'sauce', 'escaleras', 'gryffindor', 'bosque'],
    lily: ['gryffindor', 'biblioteca', 'lago', 'patio'],
    sirius: ['gritos', 'bosque', 'sauce', 'hogsmeade', 'gryffindor'],
    pettigrew: ['gryffindor', 'gritos', 'bosque', 'cocinas'],
    tonks: ['hogsmeade', 'estacion', 'tresescobas', 'vestibulo'],
    moody: ['defensa', 'vestibulo', 'patio', 'cabezapuerco'],
    kingsley: ['hogsmeade', 'estacion', 'vestibulo'],
    aberforth: ['cabezapuerco', 'cabezapuerco', 'hogsmeade'],
    voldemort: ['camara', 'bosque', 'bosque', 'gritos'],
    bellatrix: ['bosque', 'cabezapuerco', 'gritos'],
    lucius: ['vestibulo', 'hogsmeade', 'mazmorras'],
    narcissa: ['hogsmeade', 'bosque', 'mazmorras'],
    crouchjr: ['defensa', 'bosque', 'vestibulo'],
    greyback: ['bosque', 'bosque', 'gritos'],
    quirrell: ['defensa', 'bosque', 'escaleras'],
    umbridge: ['dumbledore', 'defensa', 'vestibulo', 'comedor'],
    fudge: ['tresescobas', 'hagrid', 'vestibulo', 'hogsmeade'],
    rita: ['tresescobas', 'patio', 'lago', 'carruaje'],
    fleur: ['carruaje', 'carruaje', 'comedor', 'lago'],
    krum: ['barco', 'barco', 'lago', 'biblioteca'],
    grindelwald: ['bosque', 'gritos'],
    ollivander: ['hogsmeade', 'estacion'],
    dobby: ['cocinas', 'cocinas', 'gryffindor', 'menesteres'],
    kreacher: ['cocinas', 'cocinas', 'mazmorras'],
    griphook: ['hogsmeade', 'honeydukes'],
    vernon: ['estacion', 'estacion', 'hogsmeade'],
    petunia: ['estacion', 'hogsmeade'],
    dudley: ['honeydukes', 'estacion', 'hogsmeade'],
    lockhart: ['defensa', 'biblioteca', 'comedor', 'patio']
  };

  /* ---------------------------------------------------------------------
     Grafo de caminos + Dijkstra
     --------------------------------------------------------------------- */
  const PUNTOS = {};
  Object.entries(LUGARES).forEach(([k, l]) => (PUNTOS[k] = [l.x, l.y]));
  Object.entries(CRUCES).forEach(([k, p]) => (PUNTOS[k] = p));
  const ADY = {};
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  CAMINOS.forEach(([a, b, pts]) => {
    const tramo = [PUNTOS[a], ...(pts || []), PUNTOS[b]];
    let largo = 0;
    for (let i = 1; i < tramo.length; i++) largo += dist(tramo[i - 1], tramo[i]);
    (ADY[a] = ADY[a] || []).push({ a: b, largo, pts: pts || [] });
    (ADY[b] = ADY[b] || []).push({ a: a, largo, pts: (pts || []).slice().reverse() });
  });

  function ruta(desde, hasta) {
    const d = { [desde]: 0 }, prev = {}, visto = new Set();
    const cola = [desde];
    while (cola.length) {
      cola.sort((x, y) => d[x] - d[y]);
      const u = cola.shift();
      if (visto.has(u)) continue;
      visto.add(u);
      if (u === hasta) break;
      (ADY[u] || []).forEach((e) => {
        const nd = d[u] + e.largo;
        if (d[e.a] === undefined || nd < d[e.a]) { d[e.a] = nd; prev[e.a] = { de: u, pts: e.pts }; cola.push(e.a); }
      });
    }
    if (!(hasta in prev) && desde !== hasta) return null;
    const puntos = [];
    let n = hasta;
    while (n !== desde) {
      const p = prev[n];
      puntos.unshift(PUNTOS[n]);
      p.pts.slice().reverse().forEach((q) => puntos.unshift(q));
      n = p.de;
    }
    return puntos;
  }

  /* ---------------------------------------------------------------------
     Dibujo del mapa (tinta SVG)
     --------------------------------------------------------------------- */
  const t = (x, y, txt, size = 16, cls = 'label', extra = '') => {
    const lineas = String(txt).split('\n');
    const ini = y - ((lineas.length - 1) * size * 1.05) / 2;
    return `<text class="${cls}" x="${x}" y="${ini}" font-size="${size}" ${extra}>${lineas.map((l, i) =>
      `<tspan x="${x}" dy="${i ? size * 1.05 : 0}">${l}</tspan>`).join('')}</text>`;
  };
  const rect = (x, y, w, h, cls = 'room', extra = '') => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3" ${extra}/>`;
  const circ = (x, y, r, cls = 'room', extra = '') => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
  const linea = (pts, cls = 'ink') => `<polyline class="${cls}" points="${pts.map((p) => p.join(',')).join(' ')}"/>`;

  function torre(x, y, r, nombre, size = 14) {
    return circ(x, y, r) + circ(x, y, r * 0.55, 'ink-thin', 'stroke-dasharray="3 4"') + t(x, y + 5, nombre, size);
  }

  function tintaMapa() {
    semilla = 7;
    let s = '';

    // Cartela
    s += `<g>
      <rect x="50" y="36" width="500" height="186" fill="rgba(255,248,225,.35)" stroke="${TINTA}" stroke-width="2.5"/>
      <rect x="60" y="46" width="480" height="166" fill="none" stroke="${TINTA}" stroke-width="1"/>
      ${[[60, 46], [540, 46], [60, 212], [540, 212]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${TINTA}" stroke-width="1.5"/>`).join('')}
      ${t(300, 84, 'Los señores Lunático, Colagusano, Canuto y Cornamenta', 19, 'label-i')}
      ${t(300, 112, 'se enorgullecen de presentar', 17, 'label-i')}
      ${t(300, 170, 'EL MAPA DEL MERODEADOR', 42, 'label')}
      <path class="ink-thin" d="M110 190 q95 -16 190 0 t190 0"/>
    </g>`;

    // Rosa de los vientos y leyenda
    s += `<g transform="translate(270 560)">
      <circle r="62" class="ink-thin"/><circle r="48" class="ink-thin" stroke-dasharray="2 5"/>
      <path d="M0 -78 L10 -10 L0 0 L-10 -10Z M0 78 L10 10 L0 0 L-10 10Z M-78 0 L-10 -10 L0 0 L-10 10Z M78 0 L10 -10 L0 0 L10 10Z" fill="rgba(59,36,18,.18)" stroke="${TINTA}" stroke-width="1.4"/>
      ${t(0, -86, 'N', 18)}${t(0, 104, 'S', 18)}${t(-96, 6, 'O', 18)}${t(96, 6, 'E', 18)}
    </g>
    ${t(270, 720, 'Leyenda', 18)}
    <path d="M190 748 h60" class="ink-thin" stroke-dasharray="1 5" stroke-width="2"/>${t(330, 753, 'pasillo', 15, 'label-i')}
    <path d="M190 776 h60" class="path-out"/>${t(335, 781, 'camino', 15, 'label-i')}
    <path d="M190 804 h60" class="secret"/>${t(362, 809, 'pasadizo secreto', 15, 'label-i')}
    <g fill="${TINTA}"><ellipse cx="200" cy="834" rx="3" ry="5" transform="rotate(90 200 834)"/><ellipse cx="214" cy="840" rx="3" ry="5" transform="rotate(90 214 840)"/></g>${t(330, 842, 'alguien pasea', 15, 'label-i')}`;

    // Muralla del castillo
    const muralla = [[590, 235], [1400, 235], [1400, 478], [1460, 478], [1460, 648], [1400, 648], [1400, 860], [590, 860], [590, 690], [505, 690], [505, 430], [590, 430], [590, 235]];
    s += linea(muralla, 'wall') + linea(muralla, 'wall-inner');
    s += t(720, 222, 'Castillo de Hogwarts', 22, 'label-i');
    s += `<path d="M1080 860 v-10 a15 15 0 0 1 30 0 v10" class="ink"/>` + t(1160, 880, 'Puerta principal', 13, 'label-i');

    // Pasillos (líneas punteadas entre cruces)
    CAMINOS.filter((c) => !c[3]).forEach(([a, b]) => {
      s += `<line x1="${PUNTOS[a][0]}" y1="${PUNTOS[a][1]}" x2="${PUNTOS[b][0]}" y2="${PUNTOS[b][1]}" class="ink-thin" stroke-dasharray="1 6" stroke-width="2"/>`;
    });

    // Estancias
    s += rect(800, 480, 240, 140);
    [505, 530, 555, 580].forEach((y) => (s += `<line x1="835" y1="${y}" x2="1015" y2="${y}" class="ink-thin" stroke-width="2.5"/>`));
    s += `<line x1="818" y1="498" x2="818" y2="600" class="ink-thin" stroke-width="3"/>` + t(920, 609, 'Gran Comedor', 16);
    s += rect(1040, 490, 110, 120) + t(1095, 600, 'Vestíbulo', 14);
    s += rect(1160, 480, 160, 150, 'room', 'fill="rgba(95,58,22,.03)"') + circ(1240, 555, 14, 'ink') + circ(1240, 555, 5, 'ink-thin') + t(1240, 615, 'Patio', 15);
    s += rect(880, 340, 120, 100);
    s += `<g class="stairs"><rect x="895" y="352" width="26" height="62" class="ink-thin"/>${[362, 372, 382, 392, 402].map((y) => `<line x1="895" x2="921" y1="${y}" y2="${y}" class="ink-thin"/>`).join('')}</g>`;
    s += `<g class="stairs b"><rect x="955" y="352" width="26" height="62" class="ink-thin"/>${[362, 372, 382, 392, 402].map((y) => `<line x1="955" x2="981" y1="${y}" y2="${y}" class="ink-thin"/>`).join('')}</g>`;
    s += t(940, 432, 'Escaleras móviles', 12);
    s += rect(620, 475, 160, 110);
    for (let r = 0; r < 4; r++) s += `<line x1="636" y1="${490 + r * 14}" x2="${700 + rnd() * 20}" y2="${490 + r * 14}" class="ink-thin" stroke-width="3"/>`;
    s += rect(715, 485, 55, 40, 'room hidden-room') + t(742, 509, 'Sección\nProhibida', 9, 'label-i');
    s += t(700, 574, 'Biblioteca', 16);
    s += rect(620, 600, 160, 80);
    for (let b = 0; b < 5; b++) s += rect(632 + b * 28, 610, 16, 26, 'ink-thin');
    s += t(700, 666, 'Enfermería', 14);
    s += torre(700, 330, 62, 'Torre de\nGryffindor', 15);
    s += torre(1310, 330, 58, 'Torre de\nRavenclaw', 15);
    s += circ(1100, 330, 45) + circ(1100, 330, 20, 'ink-thin') + t(1100, 334, 'Despacho del\nDirector', 11) + t(1060, 392, 'Gárgola', 10, 'label-i');
    s += torre(830, 285, 36, 'Adivinación', 10);
    s += torre(548, 560, 40, 'Torre de\nAstronomía', 10);
    s += rect(775, 380, 90, 55) + t(820, 410, 'Baño de\nMyrtle', 11);
    s += rect(1010, 395, 140, 65) + t(1080, 428, 'Defensa Contra\nlas Artes Oscuras', 11);
    s += `<g class="flicker">${rect(1165, 395, 115, 60, 'room hidden-room')}${t(1222, 426, 'Sala de los\nMenesteres', 12)}</g>`;
    s += torre(1430, 560, 26, 'Lechucería', 9);
    s += rect(790, 700, 170, 110, 'room hidden-room') + t(875, 758, 'Mazmorras\nSala común de Slytherin', 12);
    s += `<path d="M830 790 q10 -10 20 0 t20 0 t20 0" class="ink-thin"/>`;
    s += rect(970, 700, 120, 90);
    [[995, 725], [1030, 722], [1065, 725]].forEach(([x, y]) => (s += circ(x, y, 8, 'ink-thin') + circ(x, y, 3, 'ink-thin')));
    s += t(1030, 765, 'Aula de\nPociones', 12);
    s += rect(1100, 700, 170, 90);
    [715, 730, 745].forEach((y) => (s += `<line x1="1115" x2="1255" y1="${y}" y2="${y}" class="ink-thin" stroke-width="2.5"/>`));
    s += t(1185, 772, 'Cocinas · Sala común\nde Hufflepuff', 11);
    s += rect(600, 740, 170, 100, 'room hidden-room') + t(685, 795, 'Cámara de los\nSecretos', 13);
    s += `<path d="M615 825 q12 -14 24 0 t24 0 t24 0 t24 0" class="ink-thin"/>`;

    // Lago Negro
    const lago = d3.line().curve(d3.curveCardinalClosed.tension(0.2))([[120, 900], [330, 872], [560, 890], [650, 960], [615, 1075], [520, 1185], [340, 1252], [160, 1232], [88, 1110], [96, 988]]);
    s += `<path d="${lago}" class="water"/>`;
    for (let i = 0; i < 26; i++) {
      const x = 150 + rnd() * 420, y = 930 + rnd() * 280;
      if ((x - 350) ** 2 / 260 ** 2 + (y - 1060) ** 2 / 170 ** 2 > 1) continue;
      s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q8 -6 16 0 t16 0 t16 0" class="wave"/>`;
    }
    s += `<path d="M430 1110 q-12 -30 4 -58 q14 -20 0 -40" class="tentacle" fill="none" stroke="${TINTA}" stroke-width="3" stroke-linecap="round"/>`;
    s += t(330, 1150, 'Lago Negro', 30, 'label-i');
    s += `<g><path d="M318 1000 L370 1000 L360 1014 L326 1014Z" class="ink"/><line x1="344" y1="1000" x2="344" y2="962" class="ink"/><path d="M346 966 L368 990 L346 990Z" class="ink-thin"/></g>` + t(344, 1036, 'Barco de Durmstrang', 12, 'label-i');
    s += `<line x1="610" y1="960" x2="372" y2="1002" class="path-out"/>`;

    // Caminos exteriores y pasadizos
    CAMINOS.filter((c) => c[3] === 'fuera').forEach(([a, b]) => {
      s += `<line x1="${PUNTOS[a][0]}" y1="${PUNTOS[a][1]}" x2="${PUNTOS[b][0]}" y2="${PUNTOS[b][1]}" class="path-out"/>`;
    });
    CAMINOS.filter((c) => c[3] === 'secreto').forEach(([a, b, pts]) => {
      const tramo = [PUNTOS[a], ...pts, PUNTOS[b]];
      s += `<path d="${d3.line().curve(d3.curveCatmullRom)(tramo)}" class="secret"/>`;
    });
    s += t(1270, 176, 'Pasadizo de la bruja tuerta', 13, 'label-i');
    s += t(1560, 915, 'Túnel del Sauce Boxeador', 13, 'label-i', 'transform="rotate(-33 1560 915)"');
    s += t(735, 612, 'tubería', 10, 'label-i', 'transform="rotate(-75 735 612)"');

    // Invernaderos
    [930, 980, 1030].forEach((x) => {
      s += rect(x, 965, 42, 28);
      s += `<path d="M${x} 965 l42 28 M${x + 42} 965 l-42 28" class="ink-thin"/>`;
    });
    s += t(1000, 1020, 'Invernaderos', 14);

    // Sauce Boxeador
    s += `<g class="sway">${[-60, -30, 0, 30, 60, 90, -90].map((a) => {
      const r = (a * Math.PI) / 180;
      return `<path d="M1230 1010 q${(Math.sin(r) * 18).toFixed(1)} ${(-Math.cos(r) * 14).toFixed(1)} ${(Math.sin(r) * 34).toFixed(1)} ${(-Math.cos(r) * 32).toFixed(1)}" class="ink"/>`;
    }).join('')}</g>` + circ(1230, 1010, 7, 'ink') + t(1230, 1040, 'Sauce Boxeador', 14);

    // Cabaña de Hagrid
    s += circ(1480, 880, 22) + `<path d="M1462 870 L1480 850 L1498 870" class="ink"/>` + rect(1490, 855, 6, 10, 'ink');
    s += [0, 1, 2].map((i) => `<circle class="smoke" cx="1493" cy="850" r="${4 + i}" fill="none" stroke="${TINTA}" stroke-width=".8" style="animation-delay:${-i * 1.3}s"/>`).join('');
    for (let i = 0; i < 6; i++) s += circ(1512 + (i % 3) * 12, 900 + Math.floor(i / 3) * 12, 5, 'ink-thin');
    s += t(1480, 925, 'Cabaña de Hagrid', 14);

    // Carruaje de Beauxbatons
    s += rect(1450, 1058, 40, 22) + circ(1456, 1084, 6, 'ink-thin') + circ(1484, 1084, 6, 'ink-thin') + t(1470, 1108, 'Carruaje de\nBeauxbatons', 12, 'label-i');

    // Campo de quidditch
    s += `<ellipse cx="1700" cy="450" rx="165" ry="92" class="room"/><ellipse cx="1700" cy="450" rx="150" ry="78" class="ink-thin" stroke-dasharray="4 5"/>`;
    s += circ(1700, 450, 14, 'ink-thin');
    [-1, 1].forEach((lado) => [-20, 0, 20].forEach((dy) => {
      const x = 1700 + lado * 136;
      s += `<line x1="${x}" y1="${450 + dy}" x2="${x}" y2="${450 + dy - 18}" class="ink-thin"/>` + circ(x, 450 + dy - 22, 5, 'ink-thin');
    }));
    s += `<path d="M1590 360 q110 -34 220 0" class="ink" stroke-width="5"/><path d="M1590 540 q110 34 220 0" class="ink" stroke-width="5"/>`;
    s += t(1700, 580, 'Campo de quidditch', 16);

    // Hogsmeade y estación
    s += `<path d="M1600 160 Q1760 120 1965 150" class="ink" stroke-width="1.5"/>`;
    for (let i = 0; i < 22; i++) {
      const x = 1610 + rnd() * 340, y = 110 + rnd() * 110;
      if (Math.abs(y - (160 - (x - 1600) * 0.04)) < 14) continue;
      s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(14 + rnd() * 12).toFixed(0)}" height="${(10 + rnd() * 8).toFixed(0)}" class="ink-thin" transform="rotate(${((rnd() - 0.5) * 20).toFixed(1)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
    }
    s += rect(1672, 104, 36, 24) + t(1690, 96, 'Las Tres Escobas', 12, 'label-i');
    s += rect(1868, 80, 34, 24) + t(1885, 72, 'Cabeza de Puerco', 12, 'label-i');
    s += rect(1786, 195, 30, 20) + t(1800, 234, 'Honeydukes', 12, 'label-i');
    s += t(1780, 55, 'Hogsmeade', 30, 'label-i');
    s += `<line x1="1370" y1="80" x2="1620" y2="80" class="ink"/><line x1="1370" y1="92" x2="1620" y2="92" class="ink"/>`;
    for (let x = 1375; x < 1620; x += 12) s += `<line x1="${x}" y1="76" x2="${x}" y2="96" class="ink-thin"/>`;
    s += rect(1490, 100, 80, 16) + t(1520, 134, 'Estación de Hogsmeade', 12, 'label-i');

    // Casa de los Gritos
    s += `<path d="M1912 650 L1914 628 L1930 614 L1947 629 L1946 652Z" class="room"/><path d="M1906 660 h52 M1906 606 h52" class="path-out"/>`;
    s += t(1930, 684, 'Casa de los Gritos', 13, 'label-i');

    // Bosque Prohibido
    let arboles = '';
    for (let i = 0; i < 190; i++) {
      const x = 1565 + rnd() * 420, y = 720 + rnd() * 565;
      if (x < 1640 && y < 980) continue;
      if (Math.hypot(x - 1780, y - 1030) < 60) continue;
      const r = 8 + rnd() * 9;
      arboles += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" class="tree"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.4" fill="${TINTA}"/>`;
    }
    for (let i = 0; i < 26; i++) {
      const x = 80 + rnd() * 460, y = 760 + rnd() * 90;
      arboles += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(6 + rnd() * 6).toFixed(1)}" class="tree"/>`;
    }
    s += arboles;
    s += t(1780, 1036, 'Bosque\nProhibido', 30, 'label-i', 'style="paint-order:stroke;stroke:#ead8ad;stroke-width:6px"');
    s += t(1885, 1195, 'Acromántulas', 12, 'label-i', 'style="paint-order:stroke;stroke:#ead8ad;stroke-width:4px"');
    s += t(1690, 1230, 'Centauros', 12, 'label-i', 'style="paint-order:stroke;stroke:#ead8ad;stroke-width:4px"');

    return s;
  }

  // Textura de pergamino generada una sola vez
  function crearPergamino() {
    const c = document.createElement('canvas');
    c.width = 1000; c.height = 650;
    const g = c.getContext('2d');
    semilla = 99;
    const base = g.createRadialGradient(500, 325, 80, 500, 325, 720);
    base.addColorStop(0, '#f3e5c0');
    base.addColorStop(1, '#d3b67e');
    g.fillStyle = base;
    g.fillRect(0, 0, 1000, 650);
    for (let i = 0; i < 28; i++) {
      const x = rnd() * 1000, y = rnd() * 650, r = 20 + rnd() * 120;
      const m = g.createRadialGradient(x, y, 0, x, y, r);
      m.addColorStop(0, `rgba(120,78,28,${(0.04 + rnd() * 0.08).toFixed(3)})`);
      m.addColorStop(1, 'rgba(120,78,28,0)');
      g.fillStyle = m;
      g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    const img = g.getImageData(0, 0, 1000, 650);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (rnd() - 0.5) * 20;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n * 0.8;
    }
    g.putImageData(img, 0, 0);
    const pliegue = (x0, y0, x1, y1, w, h) => {
      const gr = g.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, 'rgba(90,55,15,0)');
      gr.addColorStop(0.48, 'rgba(90,55,15,.2)');
      gr.addColorStop(0.52, 'rgba(255,250,230,.3)');
      gr.addColorStop(1, 'rgba(90,55,15,0)');
      g.fillStyle = gr;
      g.fillRect(Math.min(x0, x1), Math.min(y0, y1), w, h);
    };
    [250, 500, 750].forEach((x) => pliegue(x - 14, 0, x + 14, 0, 28, 650));
    pliegue(0, 311, 0, 339, 1000, 28);
    return new Promise((res) => c.toBlob((b) => res(URL.createObjectURL(b)), 'image/jpeg', 0.88));
  }

  /* ---------------------------------------------------------------------
     Estado del módulo
     --------------------------------------------------------------------- */
  let listo = false, activo = false, estado = 'cerrado', secuencia = 0, enSeccion = false;
  let shell, viewport, svgEl, canvas, ctx, zoom, svgSel, gMundo, gTinta, circuloTinta;
  let T = { k: 1, x: 0, y: 0 };
  let vw = 0, vh = 0, DPR = 1, ajuste = 0.5;
  let alfa = 0, radioTinta = 0, raf = null, ultimo = 0;
  let mostrarNombres = true, hoverId = null, seguirId = null;
  const caminantes = [];
  let huellas = [];
  let rectsEtiquetas = [];
  const anchos = {};
  const VIDA = 5000, PASO = 11, RMAX = 1500;

  /* ---------------------------------------------------------------------
     Caminantes
     --------------------------------------------------------------------- */
  function crearCaminantes() {
    PERSONAJES.forEach((p) => {
      const rutina = RUTINAS[p.id] || ['comedor', 'patio'];
      const loc = rutina[Math.floor(rnd() * rutina.length)];
      const L = LUGARES[loc];
      const a = rnd() * Math.PI * 2, d = rnd() * L.r * 0.6;
      caminantes.push({
        id: p.id, nombre: p.nombre, casa: p.casa, rutina, loc,
        x: L.x + Math.cos(a) * d, y: L.y + Math.sin(a) * d,
        camino: [], i: 0, estado: 'espera', hasta: performance.now() + rnd() * 5000,
        vel: 24 + rnd() * 14, acc: 0, lado: 1, dir: rnd() * Math.PI * 2,
        paseos: 1 + Math.floor(rnd() * 3), inquieto: p.id === 'dumbledore', ultimoPisoton: 0
      });
    });
  }

  function puntoEn(loc, f = 0.55) {
    const L = LUGARES[loc];
    const a = Math.random() * Math.PI * 2, d = Math.random() * L.r * f;
    return [L.x + Math.cos(a) * d, L.y + Math.sin(a) * d];
  }

  function planificar(w, ahora) {
    if (w.paseos > 0) {
      // pasea dentro de la estancia (como Dumbledore en su despacho)
      w.paseos--;
      w.camino = [puntoEn(w.loc, w.inquieto ? 0.8 : 0.6)];
      w.i = 0; w.estado = 'pasea';
      return;
    }
    const opciones = w.rutina.filter((l) => l !== w.loc);
    const destino = opciones.length ? opciones[Math.floor(Math.random() * opciones.length)] : w.loc;
    const pts = ruta(w.loc, destino);
    if (!pts) { w.hasta = ahora + 4000; return; }
    const jit = () => (Math.random() - 0.5) * 10;
    w.camino = pts.slice(0, -1).map(([x, y]) => [x + jit(), y + jit()]).concat([puntoEn(destino, 0.45)]);
    w.i = 0; w.estado = 'viaja'; w.destino = destino;
  }

  function actualizarCaminantes(dt, ahora) {
    caminantes.forEach((w) => {
      if (w.estado === 'espera') {
        // pisotones en el sitio para que se note que hay alguien
        if (ahora - w.ultimoPisoton > 900) {
          w.ultimoPisoton = ahora;
          w.dir += (Math.random() - 0.5) * 1.2;
          w.lado = -w.lado;
          pisar(w, ahora);
        }
        if (ahora >= w.hasta) planificar(w, ahora);
        return;
      }
      let resto = w.vel * dt;
      while (resto > 0 && w.i < w.camino.length) {
        const [tx, ty] = w.camino[w.i];
        const dx = tx - w.x, dy = ty - w.y, d = Math.hypot(dx, dy);
        if (d < 0.001) { w.i++; continue; }
        const paso = Math.min(resto, d);
        w.dir = Math.atan2(dy, dx);
        w.x += (dx / d) * paso; w.y += (dy / d) * paso;
        resto -= paso;
        w.acc += paso;
        while (w.acc >= PASO) { w.acc -= PASO; w.lado = -w.lado; pisar(w, ahora); }
        if (paso >= d) w.i++;
      }
      if (w.i >= w.camino.length) {
        if (w.estado === 'viaja') {
          w.loc = w.destino;
          w.paseos = w.inquieto ? 6 + Math.floor(Math.random() * 5) : Math.floor(Math.random() * 3);
          w.hasta = ahora + (w.inquieto ? 800 : 5000 + Math.random() * 11000);
        } else {
          w.hasta = ahora + (w.inquieto ? 500 + Math.random() * 900 : 1500 + Math.random() * 3000);
        }
        w.estado = 'espera';
      }
    });
    while (huellas.length && ahora - huellas[0].t > VIDA) huellas.shift();
    if (huellas.length > 2600) huellas = huellas.slice(-2600);
  }

  function pisar(w, ahora) {
    const px = -Math.sin(w.dir) * 2.6 * w.lado, py = Math.cos(w.dir) * 2.6 * w.lado;
    huellas.push({ x: w.x + px, y: w.y + py, a: w.dir, t: ahora, id: w.id });
  }

  /* ---------------------------------------------------------------------
     Dibujo del canvas: huellas + nombres
     --------------------------------------------------------------------- */
  const FUENTE = '"IM Fell English SC", "Cinzel", Georgia, serif';

  function dibujar(ahora) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectsEtiquetas = [];
    if (alfa <= 0.001) return;
    const k = T.k;

    // Huellas (en coordenadas del mundo)
    ctx.setTransform(DPR * k, 0, 0, DPR * k, DPR * T.x, DPR * T.y);
    const largo = Math.min(10, Math.max(5, 13 * k * 0.5)) / k;
    for (const h of huellas) {
      const edad = (ahora - h.t) / VIDA;
      if (edad >= 1) continue;
      const destacada = h.id === hoverId || h.id === seguirId;
      ctx.globalAlpha = Math.pow(1 - edad, 1.2) * alfa * 0.9;
      ctx.fillStyle = destacada ? TINTA_ROJA : TINTA;
      const ca = Math.cos(h.a), sa = Math.sin(h.a);
      ctx.beginPath();
      ctx.ellipse(h.x + ca * largo * 0.22, h.y + sa * largo * 0.22, largo * 0.34, largo * 0.2, h.a, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(h.x - ca * largo * 0.32, h.y - sa * largo * 0.32, largo * 0.17, largo * 0.15, h.a, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nombres (en coordenadas de pantalla, siempre legibles).
    // Cada cinta busca un hueco libre (misma posición que el fotograma anterior si puede) para no pisarse.
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalAlpha = alfa;
    const destacadoDe = (w) => w.id === hoverId || w.id === seguirId;
    const orden = caminantes.slice().sort((a, b) => destacadoDe(b) - destacadoDe(a));
    const colocadas = [];
    const libre = (r) => !colocadas.some((q) => r.x < q.x + q.w && r.x + r.w > q.x && r.y < q.y + q.h && r.y + r.h > q.y);
    const aDibujar = [];
    for (const w of orden) {
      const sx = T.x + k * w.x, sy = T.y + k * w.y;
      if (sx < -80 || sy < -40 || sx > vw + 80 || sy > vh + 40) continue;
      const destacado = destacadoDe(w);
      if (!mostrarNombres && !destacado) { aDibujar.push({ w, sx, sy, destacado, sinNombre: true }); continue; }
      const fs = destacado ? 14 : 12;
      const clave = w.id + fs;
      if (!anchos[clave]) { ctx.font = `${fs}px ${FUENTE}`; anchos[clave] = ctx.measureText(w.nombre).width; }
      const bw = anchos[clave] + 12, bh = fs + 6;
      const huecos = [sy - bh - 8, sy - 2 * bh - 11, sy + 8, sy - 3 * bh - 14, sy + bh + 11];
      const preferido = w.hueco || 0;
      const intentos = [preferido, ...huecos.keys()].filter((v, i, arr) => arr.indexOf(v) === i);
      let elegido = preferido, rect = null;
      for (const h of intentos) {
        const r = { x: sx - bw / 2 - 5, y: huecos[h], w: bw + 10, h: bh };
        if (libre(r)) { elegido = h; rect = r; break; }
      }
      if (!rect) { elegido = 0; rect = { x: sx - bw / 2 - 5, y: huecos[0], w: bw + 10, h: bh }; }
      w.hueco = elegido;
      colocadas.push(rect);
      aDibujar.push({ w, sx, sy, destacado, fs, bw, bh, by: rect.y, desplazada: elegido !== 0 });
    }
    // primero los normales, al final los destacados (quedan encima)
    aDibujar.reverse();
    for (const d of aDibujar) {
      const { w, sx, sy, destacado } = d;
      const tinta = destacado ? TINTA_ROJA : TINTA;
      ctx.fillStyle = tinta;
      ctx.beginPath(); ctx.arc(sx, sy, destacado ? 3.5 : 2.5, 0, Math.PI * 2); ctx.fill();
      if (d.sinNombre) continue;
      const { fs, bw, bh, by } = d, bx = sx - bw / 2;
      if (d.desplazada) {
        ctx.strokeStyle = tinta; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, by < sy ? by + bh : by); ctx.stroke();
      }
      ctx.font = `${fs}px ${FUENTE}`;
      ctx.fillStyle = destacado ? '#fff4d8' : 'rgba(246,234,204,.93)';
      ctx.strokeStyle = tinta;
      ctx.lineWidth = destacado ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(bx - 5, by); ctx.lineTo(bx + bw + 5, by); ctx.lineTo(bx + bw, by + bh / 2);
      ctx.lineTo(bx + bw + 5, by + bh); ctx.lineTo(bx - 5, by + bh); ctx.lineTo(bx, by + bh / 2); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = tinta;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(w.nombre, sx, by + bh / 2 + 1);
      rectsEtiquetas.push({ id: w.id, x: bx - 5, y: Math.min(by, sy - 6), w: bw + 10, h: Math.abs(sy - by) + bh + 6 });
    }
    ctx.globalAlpha = 1;
  }

  function bucle(ahora) {
    if (!activo) { raf = null; return; }
    const dt = Math.min(0.05, (ahora - (ultimo || ahora)) / 1000);
    ultimo = ahora;
    if (alfa > 0) actualizarCaminantes(dt, ahora);
    seguir();
    dibujar(ahora);
    raf = requestAnimationFrame(bucle);
  }
  function arrancarBucle() { activo = true; ultimo = 0; if (!raf) raf = requestAnimationFrame(bucle); }
  function pararBucle() { activo = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  /* ---------------------------------------------------------------------
     Cámara: zoom, arrastre, seguimiento
     --------------------------------------------------------------------- */
  function medir() {
    const r = viewport.getBoundingClientRect();
    vw = r.width; vh = r.height;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(vw * DPR); canvas.height = Math.round(vh * DPR);
    ajuste = Math.min(vw / W, vh / H);
    zoom.scaleExtent([ajuste * 0.9, 5]).translateExtent([[-150, -150], [W + 150, H + 150]]);
  }

  function encuadrar(dur = 700, centro = null, k = null) {
    const kk = k || ajuste;
    const [cx, cy] = centro || [W / 2, H / 2];
    const tr = d3.zoomIdentity.translate(vw / 2 - cx * kk, vh / 2 - cy * kk).scale(kk);
    (dur ? svgSel.transition().duration(dur) : svgSel).call(zoom.transform, tr);
  }

  function seguir() {
    if (!seguirId) return;
    const w = caminantes.find((c) => c.id === seguirId);
    if (!w) return;
    const tx = vw / 2 - T.k * w.x, ty = vh / 2 - T.k * w.y;
    const nx = T.x + (tx - T.x) * 0.08, ny = T.y + (ty - T.y) * 0.08;
    if (Math.abs(nx - T.x) + Math.abs(ny - T.y) > 0.2) svgSel.call(zoom.transform, d3.zoomIdentity.translate(nx, ny).scale(T.k));
  }

  function fijarSeguimiento(id) {
    seguirId = id || null;
    const f = $('#mmFollow');
    if (!seguirId) { f.classList.remove('show'); $('#mmFind').value = ''; return; }
    const w = caminantes.find((c) => c.id === id);
    f.innerHTML = `<i class="bi bi-eye"></i> Siguiendo a ${w.nombre} <button aria-label="Dejar de seguir"><i class="bi bi-x"></i></button>`;
    f.classList.add('show');
    encuadrar(900, [w.x, w.y], Math.max(T.k, ajuste * 2.4));
  }

  /* ---------------------------------------------------------------------
     La frase: «Juro solemnemente que mis intenciones no son buenas»
     1) el audio del doblaje que el usuario cargue (se guarda en IndexedDB)
     2) un archivo del doblaje en assets/audio (CLIP_FRASE.AUDIO_LOCAL)
     3) voz en castellano del navegador
     4) clip oficial en inglés, solo si CLIP_FRASE.usarClipOriginal
     --------------------------------------------------------------------- */
  const almacen = {
    abrir() {
      return new Promise((res, rej) => {
        const r = indexedDB.open('hpwiki', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('audios');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    },
    async op(modo, fn) {
      const db = await this.abrir();
      return new Promise((res) => {
        const q = fn(db.transaction('audios', modo).objectStore('audios'));
        q.onsuccess = () => res(q.result ?? null);
        q.onerror = () => res(null);
      });
    },
    leer: (k) => almacen.op('readonly', (st) => st.get(k)).catch(() => null),
    guardar: (k, v) => almacen.op('readwrite', (st) => st.put(v, k)).catch(() => null),
    borrar: (k) => almacen.op('readwrite', (st) => st.delete(k)).catch(() => null)
  };
  let audioPropio = null; // { nombre, blob }
  let fraseYT = null, fraseYTListo = false, oyente = null, audioLocal = null, hayAudioLocal, fraseSonando = false, fuenteFrase = null;

  async function reproducirFrase() {
    if (fraseSonando) return;
    fraseSonando = true;
    const volverMusica = HP.musica.sonando() || HP.musica.quiereSonar();
    HP.musica.pausar();
    // si la música estaba arrancando justo en ese momento (primer clic), se vuelve a pausar
    setTimeout(() => { if (fraseSonando && HP.musica.sonando()) HP.musica.pausar(); }, 700);
    try {
      if (await fraseCargada()) fuenteFrase = 'tu audio del doblaje';
      else if (await fraseLocal()) fuenteFrase = 'audio del doblaje (assets/audio)';
      else if (await fraseVoz(CLIP_FRASE.texto)) fuenteFrase = 'voz en castellano';
      else if (CLIP_FRASE.usarClipOriginal && (await fraseYouTube())) fuenteFrase = 'clip original en inglés';
      else fuenteFrase = 'sin sonido';
      console.info('[Mapa del Merodeador] Frase reproducida con:', fuenteFrase);
    } finally {
      fraseSonando = false;
      if (volverMusica) setTimeout(() => HP.musica.reanudar(), 500);
    }
  }

  function pararFrase() {
    try { audioLocal && audioLocal.pause(); } catch { /* nada */ }
    try { fraseYT && fraseYTListo && fraseYT.pauseVideo(); } catch { /* nada */ }
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch { /* nada */ }
  }

  function sonarUrl(url) {
    return new Promise((res) => {
      audioLocal = new Audio(url);
      audioLocal.onended = () => res(true);
      audioLocal.onerror = () => res(false);
      audioLocal.play().catch(() => res(false));
      setTimeout(() => res(true), 15000);
    });
  }

  async function fraseCargada() {
    if (!audioPropio) return false;
    const url = URL.createObjectURL(audioPropio.blob);
    const ok = await sonarUrl(url);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return ok;
  }

  async function fraseLocal() {
    if (!location.protocol.startsWith('http')) return false;
    if (hayAudioLocal === undefined) {
      try { hayAudioLocal = (await fetch(CLIP_FRASE.AUDIO_LOCAL, { method: 'HEAD' })).ok; } catch { hayAudioLocal = false; }
    }
    if (!hayAudioLocal) return false;
    return sonarUrl(CLIP_FRASE.AUDIO_LOCAL);
  }

  function destruirFraseYT() {
    try { fraseYT && fraseYT.destroy(); } catch { /* nada */ }
    fraseYT = null; fraseYTListo = false;
    const host = $('#phraseHost');
    if (host && !$('#phrasePlayer')) host.innerHTML = '<div id="phrasePlayer"></div>';
  }

  function fraseYouTube() {
    return new Promise((res) => {
      let hecho = false, tFin = null;
      const fin = (ok) => { if (hecho) return; hecho = true; clearTimeout(tArranque); clearTimeout(tFin); oyente = null; res(ok); };
      // Si en 5 s no suena el fragmento (sin conexión, anuncio, bloqueo…) se pasa a la voz sintetizada
      const tArranque = setTimeout(() => { destruirFraseYT(); fin(false); }, 5000);
      oyente = (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
          const ct = fraseYT.getCurrentTime();
          if (ct >= CLIP_FRASE.inicio - 3) {
            clearTimeout(tArranque); clearTimeout(tFin);
            tFin = setTimeout(() => { try { fraseYT.pauseVideo(); } catch { /* nada */ } fin(true); }, (CLIP_FRASE.fin - ct) * 1000 + 250);
          }
        } else if (e.data === YT.PlayerState.ENDED) fin(true);
      };
      const lanzar = () => {
        fraseYT.unMute();
        fraseYT.setVolume(100);
        fraseYT.loadVideoById({ videoId: CLIP_FRASE.videoId, startSeconds: CLIP_FRASE.inicio, endSeconds: CLIP_FRASE.fin });
      };
      if (fraseYT && fraseYTListo) { lanzar(); return; }
      HP.cargarYT(() => {
        fraseYT = new YT.Player('phrasePlayer', {
          width: 200, height: 200,
          host: 'https://www.youtube.com',
          playerVars: {
            autoplay: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, playsinline: 1, rel: 0,
            ...(location.protocol.startsWith('http') ? { origin: location.origin } : {})
          },
          events: {
            onReady: () => { fraseYTListo = true; lanzar(); },
            onStateChange: (e) => oyente && oyente(e),
            onError: () => { destruirFraseYT(); fin(false); }
          }
        });
      }, () => fin(false));
    });
  }

  // Chrome carga las voces de forma asíncrona: se esperan un momento si aún no están
  function vocesListas() {
    return new Promise((res) => {
      const v = speechSynthesis.getVoices();
      if (v.length) { res(v); return; }
      const t = setTimeout(() => res(speechSynthesis.getVoices()), 900);
      speechSynthesis.addEventListener('voiceschanged', () => { clearTimeout(t); res(speechSynthesis.getVoices()); }, { once: true });
    });
  }

  async function fraseVoz(texto) {
    if (!('speechSynthesis' in window)) return false;
    const voces = await vocesListas();
    return new Promise((res) => {
      const u = new SpeechSynthesisUtterance(texto);
      const espana = voces.filter((v) => /es[-_]ES/i.test(v.lang));
      u.voice = espana.find((v) => /jorge|pablo|enrique|diego|alvaro|google/i.test(v.name)) || espana[0] || voces.find((v) => /^es/i.test(v.lang)) || null;
      u.lang = 'es-ES'; u.rate = 0.82; u.pitch = 0.75;
      u.onend = () => res(true);
      u.onerror = () => res(false);
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      setTimeout(() => res(true), 9000);
    });
  }

  /* ---------------------------------------------------------------------
     Apertura y cierre del mapa
     --------------------------------------------------------------------- */
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  function revelar(objetivo, dur) {
    const r0 = radioTinta, a0 = alfa, r1 = objetivo ? RMAX : 0;
    gTinta.setAttribute('mask', 'url(#mmInkMask)');
    const fin = () => { if (objetivo) gTinta.removeAttribute('mask'); };
    if (!dur) { radioTinta = r1; alfa = objetivo; circuloTinta.setAttribute('r', r1); fin(); return; }
    const t0 = performance.now();
    const paso = (ahora) => {
      const k = Math.min(1, (ahora - t0) / dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      radioTinta = r0 + (r1 - r0) * e;
      alfa = a0 + (objetivo - a0) * Math.min(1, k * 1.2);
      circuloTinta.setAttribute('r', radioTinta.toFixed(1));
      if (k < 1) requestAnimationFrame(paso); else fin();
    };
    requestAnimationFrame(paso);
  }

  function escribir(texto) {
    const span = $('#mmOathText');
    span.textContent = texto;
    shell.classList.remove('writing');
    void span.offsetWidth;
    shell.classList.add('writing');
  }

  // Espera a que el pergamino esté a la vista (la página aún puede estar desplazándose)
  function cuandoVisible(el) {
    return new Promise((res) => {
      if (!('IntersectionObserver' in window)) { res(); return; }
      const t = setTimeout(() => { io.disconnect(); res(); }, 1800);
      const io = new IntersectionObserver((ents) => {
        if (ents.some((e) => e.intersectionRatio >= 0.5)) { clearTimeout(t); io.disconnect(); res(); }
      }, { threshold: [0.5] });
      io.observe(el);
    });
  }

  async function abrir({ conSonido = true } = {}) {
    if (!enSeccion || estado === 'abierto' || estado === 'abriendo') return;
    const tok = ++secuencia;
    const rm = HP.reduceMotion;
    estado = 'abriendo';
    shell.classList.remove('open', 'opening', 'closed');
    escribir(CLIP_FRASE.texto);
    if (conSonido) reproducirFrase();
    await esperar(rm ? 300 : 3000);
    if (tok !== secuencia) return;
    shell.classList.remove('writing');
    shell.classList.add('opening');
    await esperar(rm ? 0 : 700);
    if (tok !== secuencia) return;
    arrancarBucle();
    revelar(1, rm ? 0 : 2600);
    await esperar(rm ? 0 : 1300);
    if (tok !== secuencia) return;
    shell.classList.remove('opening');
    shell.classList.add('open');
    estado = 'abierto';
  }

  async function travesuraRealizada() {
    if (estado !== 'abierto') return;
    const tok = ++secuencia;
    estado = 'cerrando';
    fijarSeguimiento(null);
    revelar(0, HP.reduceMotion ? 0 : 1700);
    await esperar(HP.reduceMotion ? 0 : 1600);
    if (tok !== secuencia) return;
    shell.classList.remove('open');
    escribir(CLIP_FRASE.cierre);
    await esperar(1400);
    if (tok !== secuencia) return;
    pararBucle();
    huellas = [];
    await esperar(1800);
    if (tok !== secuencia) return;
    shell.classList.remove('writing');
    shell.classList.add('closed');
    estado = 'cerrado';
  }

  function cerrarAlInstante() {
    secuencia++;
    pararFrase();
    pararBucle();
    fijarSeguimiento(null);
    shell.classList.add('no-anim');
    shell.classList.remove('open', 'opening', 'writing');
    shell.classList.add('closed');
    alfa = 0; radioTinta = 0; huellas = [];
    if (circuloTinta) { circuloTinta.setAttribute('r', 0); gTinta.setAttribute('mask', 'url(#mmInkMask)'); }
    estado = 'cerrado';
    requestAnimationFrame(() => shell.classList.remove('no-anim'));
  }

  /* ---------------------------------------------------------------------
     Construcción (perezosa: la primera vez que se entra en la sección)
     --------------------------------------------------------------------- */
  function construir() {
    shell = $('#mmShell');
    viewport = $('#mmViewport');
    svgEl = $('#mmSvg');
    canvas = $('#mmCanvas');
    ctx = canvas.getContext('2d');

    svgEl.innerHTML = `
      <defs>
        <filter id="mmInkRough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" result="ruido"/>
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="160" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <mask id="mmInkMask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="${W + 400}" height="${H + 400}">
          <rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#000"/>
          <circle id="mmInkCircle" cx="${W / 2}" cy="${H / 2 + 20}" r="0" fill="#fff" filter="url(#mmInkRough)"/>
        </mask>
      </defs>
      <g id="mmWorld">
        <rect width="${W}" height="${H}" fill="#e6d2a4"/>
        <image id="mmPaper" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>
        <g id="mmInk" mask="url(#mmInkMask)">${tintaMapa()}</g>
      </g>`;
    crearPergamino().then((url) => $('#mmPaper').setAttribute('href', url));

    gMundo = $('#mmWorld');
    gTinta = $('#mmInk');
    circuloTinta = $('#mmInkCircle');
    svgSel = d3.select(svgEl);

    zoom = d3.zoom()
      .filter((e) => (e.type === 'wheel' ? e.ctrlKey || e.metaKey : !e.button))
      .clickDistance(5)
      .on('start', (e) => { if (e.sourceEvent && seguirId) fijarSeguimiento(null); })
      .on('zoom', (e) => { T = e.transform; gMundo.setAttribute('transform', e.transform.toString()); });
    svgSel.call(zoom).on('dblclick.zoom', null);

    medir();
    encuadrar(0, [1000, 560], ajuste * 1.45);
    new ResizeObserver(() => { const k0 = ajuste; medir(); if (Math.abs(ajuste - k0) > 0.001) encuadrar(0, [1000, 560], ajuste * 1.45); }).observe(viewport);

    // Rueda sin Ctrl: aviso (la página sigue desplazándose)
    let tAviso;
    viewport.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey || estado !== 'abierto') return;
      const h = $('#mmWheelHint');
      h.classList.add('show');
      clearTimeout(tAviso);
      tAviso = setTimeout(() => h.classList.remove('show'), 1300);
    }, { passive: true });

    // Pasar por encima / pulsar un nombre
    const buscar = (e) => {
      const r = viewport.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      for (let i = rectsEtiquetas.length - 1; i >= 0; i--) {
        const q = rectsEtiquetas[i];
        if (x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h) return q.id;
      }
      return null;
    };
    viewport.addEventListener('pointermove', (e) => {
      hoverId = buscar(e);
      viewport.classList.toggle('hover-walker', !!hoverId);
    });
    viewport.addEventListener('pointerleave', () => { hoverId = null; viewport.classList.remove('hover-walker'); });
    svgSel.on('click', (e) => {
      const id = buscar(e);
      if (id) HP.abrirFicha(id);
    });

    // Controles
    const sel = $('#mmFind');
    sel.innerHTML = '<option value="">¿Dónde está…?</option>' + PERSONAJES.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      .map((p) => `<option value="${p.id}">${p.nombre}</option>`).join('');
    sel.addEventListener('change', () => fijarSeguimiento(sel.value));
    $('#mmFollow').addEventListener('click', (e) => { if (e.target.closest('button')) fijarSeguimiento(null); });
    $('#mmNames').addEventListener('click', (e) => {
      mostrarNombres = !mostrarNombres;
      e.currentTarget.classList.toggle('off', !mostrarNombres);
    });
    $('#mmZoomIn').addEventListener('click', () => svgSel.transition().duration(400).call(zoom.scaleBy, 1.4));
    $('#mmZoomOut').addEventListener('click', () => svgSel.transition().duration(400).call(zoom.scaleBy, 1 / 1.4));
    $('#mmFit').addEventListener('click', () => { fijarSeguimiento(null); encuadrar(800); });
    $('#mmReplay').addEventListener('click', () => reproducirFrase());
    const pintarAudio = () => {
      $('#mmAudioInfo').textContent = audioPropio ? `Ahora suena: ${audioPropio.nombre}` : 'Ahora suena: voz en castellano';
      $('#mmAudioDel').disabled = !audioPropio;
      $('#mmAudioBtn').classList.toggle('has-audio', !!audioPropio);
    };
    almacen.leer('frase').then((a) => { if (a && a.blob) audioPropio = a; pintarAudio(); });
    $('#mmAudioPick').addEventListener('click', () => $('#mmAudioFile').click());
    $('#mmAudioFile').addEventListener('change', async (e) => {
      const f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!f) return;
      if (!f.type.startsWith('audio/')) { HP.toast('⚠️', 'Ese archivo no es de audio.'); return; }
      if (f.size > 8 * 1024 * 1024) { HP.toast('⚠️', 'El audio es demasiado grande (máximo 8 MB). Recorta solo la frase.'); return; }
      audioPropio = { nombre: f.name, blob: f };
      await almacen.guardar('frase', audioPropio);
      pintarAudio();
      HP.toast('🎙️', `<b>Audio guardado.</b> «${f.name}» sonará cada vez que abras el mapa.`, 4500);
      reproducirFrase();
    });
    $('#mmAudioDel').addEventListener('click', async () => {
      audioPropio = null;
      await almacen.borrar('frase');
      pintarAudio();
      HP.toast('🗑️', 'Audio quitado: vuelve a sonar la voz en castellano.');
    });
    $('#mmClose').addEventListener('click', () => travesuraRealizada());
    $('#mmOpenBtn').addEventListener('click', () => abrir());
    $('#mmStatus').textContent = `${PERSONAJES.length} personas en el mapa · arrastra para moverte · toca un nombre para abrir su ficha`;

    if (document.fonts) document.fonts.load(`12px ${FUENTE}`).then(() => Object.keys(anchos).forEach((k) => delete anchos[k]));

    semilla = 31;
    crearCaminantes();
    listo = true;
  }

  window.Merodeador = {
    init() {
      // El módulo se construye al entrar por primera vez en la sección
      const s = $('#mmShell');
      if (s) s.classList.add('closed');
    },
    async entrar() {
      if (!listo) construir();
      enSeccion = true;
      medir();
      await cuandoVisible(shell);
      abrir();
    },
    salir() {
      enSeccion = false;
      if (listo) cerrarAlInstante();
    },
    travesuraRealizada: () => travesuraRealizada(),
    get fuenteFrase() { return fuenteFrase; }
  };
})();
