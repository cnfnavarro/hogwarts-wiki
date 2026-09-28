/* =========================================================================
   HOGWARTS WIKI · Base de datos del mundo mágico
   - CASAS, GRUPOS y TIPOS_RELACION: catálogos
   - PERSONAJES: fichas completas (actor, datos, historia, cronología)
   - RELACIONES: aristas del mapa de relaciones [origen, destino, tipo, etiqueta]
   - CRONOLOGIA: grandes acontecimientos de la saga
   ========================================================================= */

const CASAS = {
  gryffindor: { nombre: 'Gryffindor', color: '#ae0001', color2: '#d3a625', animal: '🦁', fundador: 'Godric Gryffindor', valores: 'Valentía, osadía y caballerosidad', elemento: 'Fuego', fantasma: 'Nick Casi Decapitado' },
  slytherin:  { nombre: 'Slytherin',  color: '#1a472a', color2: '#aaaaaa', animal: '🐍', fundador: 'Salazar Slytherin', valores: 'Astucia, ambición y determinación', elemento: 'Agua', fantasma: 'El Barón Sanguinario' },
  ravenclaw:  { nombre: 'Ravenclaw',  color: '#222f5b', color2: '#b08d57', animal: '🦅', fundador: 'Rowena Ravenclaw', valores: 'Inteligencia, sabiduría e ingenio', elemento: 'Aire', fantasma: 'La Dama Gris' },
  hufflepuff: { nombre: 'Hufflepuff', color: '#e3a000', color2: '#372e29', animal: '🦡', fundador: 'Helga Hufflepuff', valores: 'Lealtad, paciencia y trabajo duro', elemento: 'Tierra', fantasma: 'El Fraile Gordo' },
  ninguna:    { nombre: 'Sin casa',   color: '#4b3f72', color2: '#c9b37e', animal: '✨', fundador: '—', valores: 'Personajes ajenos a Hogwarts o de otras escuelas', elemento: '—', fantasma: '—' }
};

const GRUPOS = {
  protagonista: 'Trío protagonista',
  hogwarts: 'Personal de Hogwarts',
  estudiante: 'Estudiantes',
  weasley: 'Familia Weasley',
  merodeador: 'Merodeadores',
  orden: 'Orden del Fénix',
  ejercito: 'Ejército de Dumbledore',
  mortifago: 'Mortífagos',
  ministerio: 'Ministerio de Magia',
  muggle: 'Muggles',
  criatura: 'Criaturas mágicas',
  otros: 'Otros magos'
};

const IMPORTANCIA = {
  principal: 'Protagonista',
  secundario: 'Secundario',
  reparto: 'Reparto'
};

const TIPOS_RELACION = {
  familia:   { nombre: 'Familia',            color: '#f0b54a', icono: 'bi-house-heart' },
  amor:      { nombre: 'Amor',               color: '#ff6b9a', icono: 'bi-heart-fill' },
  amistad:   { nombre: 'Amistad',            color: '#4fc3f7', icono: 'bi-people-fill' },
  mentor:    { nombre: 'Mentoría',           color: '#9ccc65', icono: 'bi-mortarboard-fill' },
  lealtad:   { nombre: 'Lealtad / Servicio', color: '#b39ddb', icono: 'bi-shield-fill' },
  enemistad: { nombre: 'Enemistad',          color: '#ef5350', icono: 'bi-lightning-fill' }
};

const PERSONAJES = [
  /* ============================ TRÍO PROTAGONISTA ============================ */
  {
    id: 'harry', nombre: 'Harry Potter', nombreCompleto: 'Harry James Potter', apodo: 'El niño que vivió',
    actor: 'Daniel Radcliffe', wiki: 'Daniel_Radcliffe',
    casa: 'gryffindor', importancia: 'principal', grupos: ['protagonista', 'estudiante', 'orden', 'ejercito'],
    nacimiento: '31 de julio de 1980', muerte: null, sangre: 'Mestizo', patronus: 'Ciervo',
    varita: 'Acebo, pluma de fénix, 28 cm', ocupacion: 'Jefe del Departamento de Aurores',
    rasgos: ['Valiente', 'Leal', 'Impulsivo', 'Humilde', 'Buscador nato'],
    resumen: 'Hijo de James y Lily Potter, sobrevivió siendo un bebé a la maldición asesina de lord Voldemort y creció sin saber que era el mago más famoso de su generación.',
    historia: [
      'Harry quedó huérfano la noche del 31 de octubre de 1981, cuando Voldemort asesinó a sus padres en el Valle de Godric. El sacrificio de su madre le protegió con una magia antigua: la maldición asesina rebotó, destruyó el cuerpo del Señor Tenebroso y dejó en la frente del niño una cicatriz con forma de rayo. Dumbledore lo dejó al cuidado de sus tíos muggles, los Dursley, que lo criaron durante diez años en el armario de debajo de la escalera.',
      'Al cumplir once años, Hagrid le reveló que era un mago y lo llevó a Hogwarts, donde el Sombrero Seleccionador lo envió a Gryffindor. Allí forjó una amistad inquebrantable con Ron Weasley y Hermione Granger, se convirtió en el buscador más joven del siglo y, curso tras curso, frustró los intentos de Voldemort por recuperar su poder: la Piedra Filosofal, la Cámara de los Secretos, la verdad sobre Sirius Black y el Torneo de los Tres Magos.',
      'Tras el regreso de Voldemort fundó el Ejército de Dumbledore y descubrió la profecía que lo unía al Señor Tenebroso. Después de la muerte de Dumbledore abandonó el colegio para buscar y destruir los horrocruxes. En la Batalla de Hogwarts se entregó voluntariamente a la muerte, destruyendo así el fragmento de alma de Voldemort que vivía en él, y regresó para derrotarle definitivamente con un simple Expelliarmus.',
      'Diecinueve años después, Harry es jefe de Aurores, está casado con Ginny Weasley y es padre de James Sirius, Albus Severus y Lily Luna.'
    ],
    momentos: [
      { ano: '1981', texto: 'Sobrevive a la maldición asesina en el Valle de Godric.' },
      { ano: '1991', texto: 'Entra en Hogwarts y protege la Piedra Filosofal.' },
      { ano: '1992', texto: 'Mata al basilisco y destruye el diario de Tom Ryddle.' },
      { ano: '1994', texto: 'Gana el Torneo de los Tres Magos y presencia el regreso de Voldemort.' },
      { ano: '1995', texto: 'Funda el Ejército de Dumbledore.' },
      { ano: '1997', texto: 'Emprende la caza de los horrocruxes.' },
      { ano: '1998', texto: 'Derrota a Voldemort en la Batalla de Hogwarts.' }
    ]
  },
  {
    id: 'hermione', nombre: 'Hermione Granger', nombreCompleto: 'Hermione Jean Granger', apodo: 'La bruja más brillante de su edad',
    actor: 'Emma Watson', wiki: 'Emma_Watson',
    casa: 'gryffindor', importancia: 'principal', grupos: ['protagonista', 'estudiante', 'orden', 'ejercito'],
    nacimiento: '19 de septiembre de 1979', muerte: null, sangre: 'Hija de muggles', patronus: 'Nutria',
    varita: 'Vid, fibra de corazón de dragón, 27,3 cm', ocupacion: 'Ministra de Magia',
    rasgos: ['Brillante', 'Metódica', 'Justa', 'Valiente', 'Leal'],
    resumen: 'Hija de dos dentistas muggles, se convirtió en la alumna más brillante de Hogwarts y en el cerebro indispensable del trío protagonista.',
    historia: [
      'Hermione descubrió que era bruja al recibir su carta de Hogwarts y se preparó memorizando los libros de texto antes incluso de subir al expreso. Su carácter mandón la aisló al principio, pero todo cambió cuando Harry y Ron la salvaron de un trol en Halloween: desde entonces los tres fueron inseparables.',
      'Su inteligencia salvó a sus amigos una y otra vez: resolvió el acertijo de las pociones que protegía la Piedra Filosofal, descubrió que el monstruo de la Cámara era un basilisco (aunque quedó petrificada) y, con un giratiempo, ayudó a rescatar a Sirius y a Buckbeak. Fundó la P.E.D.D.O. para defender a los elfos domésticos y fue quien organizó en secreto las reuniones del Ejército de Dumbledore.',
      'Antes de partir en busca de los horrocruxes borró la memoria de sus padres para protegerlos. Soportó la tortura de Bellatrix en la Mansión Malfoy, destruyó la copa de Hufflepuff con un colmillo de basilisco y luchó en la Batalla de Hogwarts. Más tarde trabajó por los derechos de las criaturas mágicas, llegó a Ministra de Magia y se casó con Ron, con quien tuvo a Rose y Hugo.'
    ],
    momentos: [
      { ano: '1991', texto: 'Hace amistad con Harry y Ron tras el incidente del trol.' },
      { ano: '1993', texto: 'Usa un giratiempo para salvar a Sirius y a Buckbeak.' },
      { ano: '1994', texto: 'Acude al baile de Navidad con Viktor Krum.' },
      { ano: '1995', texto: 'Impulsa la creación del Ejército de Dumbledore.' },
      { ano: '1998', texto: 'Destruye la copa de Hufflepuff y besa por fin a Ron.' }
    ]
  },
  {
    id: 'ron', nombre: 'Ron Weasley', nombreCompleto: 'Ronald Bilius Weasley', apodo: 'Won-Won',
    actor: 'Rupert Grint', wiki: 'Rupert_Grint',
    casa: 'gryffindor', importancia: 'principal', grupos: ['protagonista', 'estudiante', 'weasley', 'orden', 'ejercito'],
    nacimiento: '1 de marzo de 1980', muerte: null, sangre: 'Sangre limpia', patronus: 'Jack Russell terrier',
    varita: 'Sauce, pelo de unicornio, 35,5 cm', ocupacion: 'Auror; después, Sortilegios Weasley',
    rasgos: ['Leal', 'Divertido', 'Estratega', 'Inseguro', 'Generoso'],
    resumen: 'Sexto hijo de la familia Weasley y mejor amigo de Harry desde el primer viaje en el expreso de Hogwarts.',
    historia: [
      'Criado en La Madriguera a la sombra de cinco hermanos mayores brillantes, Ron creció con ropa heredada, una rata llamada Scabbers y la sensación de no destacar nunca. Conoció a Harry en el expreso de Hogwarts y le ofreció algo que Harry nunca había tenido: una familia que lo acogía como a uno más.',
      'Su talento para la estrategia brilló en la partida de ajedrez gigante del primer curso, donde se sacrificó para que Harry siguiera adelante. Con los años se convirtió en guardián del equipo de quidditch y en prefecto, aunque sus inseguridades le jugaron malas pasadas: la envidia durante el Torneo de los Tres Magos y, sobre todo, el abandono temporal durante la búsqueda de horrocruxes, influido por el guardapelo de Slytherin.',
      'Regresó guiado por la luz del desiluminador de Dumbledore, salvó a Harry de ahogarse y destruyó el guardapelo con la espada de Gryffindor. Tras la guerra fue auror junto a Harry y después ayudó a George en Sortilegios Weasley. Se casó con Hermione.'
    ],
    momentos: [
      { ano: '1991', texto: 'Gana la partida de ajedrez mágico gigante.' },
      { ano: '1992', texto: 'Rescata a Harry de los Dursley en un coche volador.' },
      { ano: '1996', texto: 'Sale con Lavender Brown y es envenenado accidentalmente.' },
      { ano: '1997', texto: 'Destruye el guardapelo de Slytherin.' },
      { ano: '1998', texto: 'Abre la Cámara de los Secretos imitando pársel.' }
    ]
  },

  /* ============================ HOGWARTS ============================ */
  {
    id: 'dumbledore', nombre: 'Albus Dumbledore', nombreCompleto: 'Albus Percival Wulfric Brian Dumbledore', apodo: 'El único al que Voldemort temía',
    actor: 'Richard Harris (1-2) · Michael Gambon (3-8)', wiki: 'Michael_Gambon',
    casa: 'gryffindor', importancia: 'principal', grupos: ['hogwarts', 'orden'],
    nacimiento: 'Verano de 1881', muerte: '30 de junio de 1997', sangre: 'Mestizo', patronus: 'Fénix',
    varita: 'Varita de Saúco: saúco, pelo de cola de thestral, 38 cm', ocupacion: 'Director de Hogwarts',
    rasgos: ['Sabio', 'Excéntrico', 'Estratega', 'Compasivo', 'Reservado'],
    resumen: 'Director de Hogwarts, fundador de la Orden del Fénix y considerado el mago más grande de su tiempo.',
    historia: [
      'Albus fue un alumno excepcional, pero su juventud quedó marcada por la tragedia. Tras la muerte de su madre tuvo que cuidar de su hermana Ariana, y en ese verano conoció a Gellert Grindelwald, con quien soñó con dominar el mundo «por el bien mayor» y reunir las Reliquias de la Muerte. Un duelo a tres bandas entre Albus, Gellert y Aberforth terminó con la muerte de Ariana, algo que Dumbledore nunca se perdonó.',
      'En 1945 derrotó a Grindelwald en un duelo legendario y se quedó con la Varita de Saúco. Profesor de Transformaciones y después director de Hogwarts, fue el primero en sospechar del joven Tom Ryddle. Durante la primera guerra fundó la Orden del Fénix y, tras la caída de Voldemort, dejó a Harry con los Dursley para que la protección de sangre de su madre lo mantuviera a salvo.',
      'Guió a Harry durante seis años. Al descubrir los horrocruxes se puso el anillo de Gaunt y cayó víctima de una maldición mortal. Planificó entonces su propia muerte con Snape para proteger a Draco y engañar a Voldemort: murió en la Torre de Astronomía la noche del 30 de junio de 1997, dejando a Harry las pistas necesarias para terminar la misión.'
    ],
    momentos: [
      { ano: '1899', texto: 'Muere su hermana Ariana tras el duelo con Grindelwald.' },
      { ano: '1945', texto: 'Derrota a Grindelwald y gana la Varita de Saúco.' },
      { ano: '1970', texto: 'Funda la Orden del Fénix.' },
      { ano: '1981', texto: 'Deja al bebé Harry en Privet Drive.' },
      { ano: '1996', texto: 'Destruye el anillo de Gaunt y queda maldito.' },
      { ano: '1997', texto: 'Muere en la Torre de Astronomía a manos de Snape, según su propio plan.' }
    ]
  },
  {
    id: 'snape', nombre: 'Severus Snape', nombreCompleto: 'Severus Snape', apodo: 'El Príncipe Mestizo',
    actor: 'Alan Rickman', wiki: 'Alan_Rickman',
    casa: 'slytherin', importancia: 'principal', grupos: ['hogwarts', 'orden', 'mortifago'],
    nacimiento: '9 de enero de 1960', muerte: '2 de mayo de 1998', sangre: 'Mestizo', patronus: 'Cierva',
    varita: 'Desconocida', ocupacion: 'Profesor de Pociones, de Defensa y director de Hogwarts',
    rasgos: ['Enigmático', 'Leal', 'Sarcástico', 'Brillante', 'Rencoroso'],
    resumen: 'Profesor de Pociones temido por los alumnos, antiguo mortífago y el agente doble más importante de la guerra.',
    historia: [
      'Severus creció en Spinner\'s End, en un hogar infeliz, y encontró en su vecina Lily Evans a su primera y única amiga. En Hogwarts, ella fue a Gryffindor y él a Slytherin; la rivalidad con James Potter y los Merodeadores, y su fascinación por las Artes Oscuras, acabaron separándolos. Inventó hechizos propios como Sectumsempra y anotó su libro de pociones como «el Príncipe Mestizo».',
      'Se unió a los mortífagos y fue él quien informó a Voldemort de parte de la profecía de Trelawney. Cuando comprendió que el Señor Tenebroso iría a por Lily, suplicó a Dumbledore que la protegiera y cambió de bando. Tras la muerte de Lily juró proteger a su hijo, aunque en clase mostrara hacia Harry un desprecio constante.',
      'Durante la segunda guerra actuó como agente doble. Cumplió la petición de Dumbledore de matarle para salvar el alma de Draco, fue nombrado director de Hogwarts y protegió en secreto a los alumnos. Voldemort lo mató creyendo que así dominaría la Varita de Saúco. Antes de morir entregó a Harry sus recuerdos, que revelaron toda la verdad: su patronus era una cierva, como el de Lily.'
    ],
    momentos: [
      { ano: '1971', texto: 'Entra en Slytherin; Lily va a Gryffindor.' },
      { ano: '1980', texto: 'Escucha parte de la profecía y se la cuenta a Voldemort.' },
      { ano: '1981', texto: 'Cambia de bando y se convierte en espía de Dumbledore.' },
      { ano: '1997', texto: 'Mata a Dumbledore cumpliendo su plan.' },
      { ano: '1998', texto: 'Muere en la Casa de los Gritos y entrega sus recuerdos a Harry.' }
    ]
  },
  {
    id: 'mcgonagall', nombre: 'Minerva McGonagall', nombreCompleto: 'Minerva McGonagall', apodo: 'La jefa de Gryffindor',
    actor: 'Maggie Smith', wiki: 'Maggie_Smith',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['hogwarts', 'orden'],
    nacimiento: '4 de octubre de 1935', muerte: null, sangre: 'Mestiza', patronus: 'Gato',
    varita: 'Abeto, fibra de corazón de dragón, 24 cm', ocupacion: 'Profesora de Transformaciones y directora de Hogwarts',
    rasgos: ['Estricta', 'Justa', 'Valiente', 'Protectora', 'Irónica'],
    resumen: 'Subdirectora de Hogwarts, profesora de Transformaciones, jefa de la casa Gryffindor y animaga registrada.',
    historia: [
      'Minerva nació en Escocia, hija de un pastor muggle y de una bruja. Brillante en Transformaciones, se registró como animaga (puede convertirse en gata atigrada) y trabajó un tiempo en el Ministerio antes de volver a Hogwarts, llamada por Dumbledore, para enseñar.',
      'Severa pero profundamente justa, fue la primera en recibir a Harry en el castillo y quien le dio la oportunidad de jugar al quidditch en su primer año. Se enfrentó a Umbridge sin miedo, recibió cuatro hechizos aturdidores al defender a Hagrid y fue una pieza clave de la Orden del Fénix.',
      'En la Batalla de Hogwarts expulsó a Snape del castillo, animó a las estatuas y armaduras a defender el colegio y combatió contra el propio Voldemort junto a Kingsley y Slughorn. Después de la guerra se convirtió en directora de Hogwarts.'
    ],
    momentos: [
      { ano: '1956', texto: 'Comienza a enseñar Transformaciones en Hogwarts.' },
      { ano: '1981', texto: 'Vigila a los Dursley transformada en gata.' },
      { ano: '1991', texto: 'Recluta a Harry como buscador de Gryffindor.' },
      { ano: '1996', texto: 'Es atacada al defender a Hagrid del Ministerio.' },
      { ano: '1998', texto: 'Dirige la defensa del castillo en la Batalla de Hogwarts.' }
    ]
  },
  {
    id: 'hagrid', nombre: 'Rubeus Hagrid', nombreCompleto: 'Rubeus Hagrid', apodo: 'Guardián de las llaves',
    actor: 'Robbie Coltrane', wiki: 'Robbie_Coltrane',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['hogwarts', 'orden'],
    nacimiento: '6 de diciembre de 1928', muerte: null, sangre: 'Semigigante', patronus: 'No conjura',
    varita: 'Roble, 40,6 cm (partida; oculta en un paraguas rosa)', ocupacion: 'Guardabosques y profesor de Cuidado de Criaturas Mágicas',
    rasgos: ['Bondadoso', 'Leal', 'Indiscreto', 'Protector', 'Amante de las criaturas'],
    resumen: 'Guardián de las llaves y los terrenos de Hogwarts, primer amigo de Harry en el mundo mágico.',
    historia: [
      'Hijo de un mago y de la giganta Fridwulfa, Hagrid fue expulsado de Hogwarts en su tercer año cuando Tom Ryddle le acusó falsamente de abrir la Cámara de los Secretos (su culpa real era criar a una acromántula, Aragog). Le partieron la varita, pero Dumbledore confió en él y le dio trabajo como guardabosques.',
      'Fue él quien rescató al bebé Harry de las ruinas del Valle de Godric y quien, diez años después, le entregó su carta de Hogwarts y una tarta de cumpleaños. Su debilidad por las criaturas peligrosas —un dragón llamado Norberto, Fluffy el perro de tres cabezas, Buckbeak o su medio hermano Grawp— le trajo problemas constantes.',
      'Profesor de Cuidado de Criaturas Mágicas desde 1993, viajó como emisario de la Orden ante los gigantes y fue capturado por los mortífagos durante la Batalla de Hogwarts. Obligado a cargar con el cuerpo de Harry, que creía muerto, fue testigo de su regreso.'
    ],
    momentos: [
      { ano: '1943', texto: 'Expulsado de Hogwarts por la falsa acusación de Ryddle.' },
      { ano: '1981', texto: 'Rescata a Harry del Valle de Godric.' },
      { ano: '1991', texto: 'Entrega a Harry su carta de Hogwarts.' },
      { ano: '1993', texto: 'Se convierte en profesor; Buckbeak es condenado.' },
      { ano: '1998', texto: 'Carga con Harry en el Bosque Prohibido.' }
    ]
  },
  {
    id: 'lupin', nombre: 'Remus Lupin', nombreCompleto: 'Remus John Lupin', apodo: 'Lunático',
    actor: 'David Thewlis', wiki: 'David_Thewlis',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['hogwarts', 'merodeador', 'orden'],
    nacimiento: '10 de marzo de 1960', muerte: '2 de mayo de 1998', sangre: 'Mestizo', patronus: 'Lobo',
    varita: 'Ciprés, pelo de unicornio, 26 cm', ocupacion: 'Profesor de Defensa Contra las Artes Oscuras',
    rasgos: ['Paciente', 'Amable', 'Sabio', 'Inseguro', 'Pacificador'],
    resumen: 'Merodeador, hombre lobo y el mejor profesor de Defensa Contra las Artes Oscuras que tuvo Harry.',
    historia: [
      'Remus fue mordido de niño por Fenrir Greyback. Dumbledore le permitió estudiar en Hogwarts plantando el Sauce Boxeador para ocultar sus transformaciones en la Casa de los Gritos. Sus amigos James, Sirius y Peter se hicieron animagos para acompañarle en las noches de luna llena y juntos crearon el Mapa del Merodeador.',
      'En 1993 volvió como profesor de Defensa y enseñó a Harry a conjurar un Patronus. Descubrió la verdad sobre Pettigrew, pero una luna llena le hizo perder el control y tuvo que dimitir cuando Snape reveló su condición.',
      'Miembro de la Orden, se casó con Nymphadora Tonks a pesar de sus miedos y tuvo un hijo, Teddy, al que nombró padrino a Harry. Murió en la Batalla de Hogwarts en duelo con Antonin Dolohov.'
    ],
    momentos: [
      { ano: '1965', texto: 'Mordido por Fenrir Greyback.' },
      { ano: '1971', texto: 'Entra en Hogwarts y conoce a los Merodeadores.' },
      { ano: '1993', texto: 'Profesor de Defensa; enseña a Harry el encantamiento Patronus.' },
      { ano: '1997', texto: 'Se casa con Tonks.' },
      { ano: '1998', texto: 'Nace Teddy; Remus muere en la batalla final.' }
    ]
  },
  {
    id: 'slughorn', nombre: 'Horace Slughorn', nombreCompleto: 'Horace Eugene Flaccus Slughorn', apodo: 'El coleccionista de talentos',
    actor: 'Jim Broadbent', wiki: 'Jim_Broadbent',
    casa: 'slytherin', importancia: 'secundario', grupos: ['hogwarts'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Cedro, fibra de corazón de dragón, 26 cm', ocupacion: 'Profesor de Pociones y jefe de Slytherin',
    rasgos: ['Vanidoso', 'Sociable', 'Cobarde', 'Culto', 'Redimido'],
    resumen: 'Profesor de Pociones, fundador del Club de las Eminencias y guardián del recuerdo clave sobre los horrocruxes.',
    historia: [
      'Durante décadas Slughorn reunió a los alumnos más prometedores en su Club de las Eminencias, esperando beneficiarse de sus futuros éxitos. Entre sus favoritos estuvieron Lily Evans y un encantador Tom Ryddle, a quien, halagado, explicó qué era un horrocrux.',
      'Avergonzado, modificó su recuerdo de aquella conversación. Dumbledore lo convenció para volver a Hogwarts en 1996, en parte para que Harry obtuviera el recuerdo verdadero, cosa que logró tras el funeral de la acromántula Aragog y con ayuda de la suerte líquida.',
      'En la Batalla de Hogwarts regresó con refuerzos de Hogsmeade y se enfrentó a Voldemort junto a McGonagall y Kingsley.'
    ],
    momentos: [
      { ano: '1943', texto: 'Explica a Tom Ryddle qué son los horrocruxes.' },
      { ano: '1996', texto: 'Vuelve a Hogwarts como profesor de Pociones.' },
      { ano: '1997', texto: 'Entrega a Harry su recuerdo verdadero.' },
      { ano: '1998', texto: 'Lucha contra Voldemort en la batalla final.' }
    ]
  },
  {
    id: 'flitwick', nombre: 'Filius Flitwick', nombreCompleto: 'Filius Flitwick', apodo: 'Maestro de Encantamientos',
    actor: 'Warwick Davis', wiki: 'Warwick_Davis',
    casa: 'ravenclaw', importancia: 'reparto', grupos: ['hogwarts'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Mestizo (ascendencia duende)', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Profesor de Encantamientos y jefe de Ravenclaw',
    rasgos: ['Alegre', 'Erudito', 'Duelista', 'Entusiasta'],
    resumen: 'Diminuto y alegre profesor de Encantamientos, antiguo campeón de duelo y jefe de la casa Ravenclaw.',
    historia: [
      'Con algo de sangre de duende, Flitwick es un profesor bondadoso que se sube a una pila de libros para dar clase. Fue él quien enseñó a toda una generación el famoso Wingardium Leviosa.',
      'Durante la Batalla de Hogwarts levantó potentes encantamientos protectores alrededor del castillo y derrotó a varios mortífagos, demostrando por qué había sido campeón de duelo en su juventud.'
    ],
    momentos: [
      { ano: '1991', texto: 'Enseña el encantamiento levitador al primer curso.' },
      { ano: '1998', texto: 'Protege el castillo con encantamientos defensivos.' }
    ]
  },
  {
    id: 'trelawney', nombre: 'Sybill Trelawney', nombreCompleto: 'Sybill Patricia Trelawney', apodo: 'La vidente',
    actor: 'Emma Thompson', wiki: 'Emma_Thompson',
    casa: 'ravenclaw', importancia: 'reparto', grupos: ['hogwarts'],
    nacimiento: '9 de marzo (año desconocido)', muerte: null, sangre: 'Mestiza', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Profesora de Adivinación',
    rasgos: ['Excéntrica', 'Dramática', 'Solitaria', 'Auténtica vidente (a veces)'],
    resumen: 'Profesora de Adivinación, tataranieta de la célebre vidente Casandra Trelawney y autora de la profecía que marcó a Harry.',
    historia: [
      'Aunque la mayoría de sus predicciones son teatro, Sybill ha pronunciado en trance dos profecías auténticas. La primera, durante su entrevista con Dumbledore en Cabeza de Puerco en 1980, anunció el nacimiento de quien podría vencer al Señor Tenebroso; Snape escuchó parte y se la llevó a Voldemort.',
      'La segunda, ante Harry en 1994, predijo el regreso del siervo de Voldemort. Umbridge la despidió en 1996, pero Dumbledore le permitió quedarse en el castillo. En la batalla final lanzó bolas de cristal a los mortífagos.'
    ],
    momentos: [
      { ano: '1980', texto: 'Pronuncia la profecía sobre el elegido.' },
      { ano: '1994', texto: 'Predice la huida de Colagusano.' },
      { ano: '1996', texto: 'Umbridge la despide; Dumbledore la protege.' }
    ]
  },
  {
    id: 'sprout', nombre: 'Pomona Sprout', nombreCompleto: 'Pomona Sprout', apodo: 'La maestra de Herbología',
    actor: 'Miriam Margolyes', wiki: 'Miriam_Margolyes',
    casa: 'hufflepuff', importancia: 'reparto', grupos: ['hogwarts'],
    nacimiento: '15 de mayo (año desconocido)', muerte: null, sangre: 'Desconocida', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Profesora de Herbología y jefa de Hufflepuff',
    rasgos: ['Cálida', 'Práctica', 'Leal', 'Valiente'],
    resumen: 'Profesora de Herbología y jefa de Hufflepuff, mentora de Neville Longbottom.',
    historia: [
      'Sprout cuida los invernaderos de Hogwarts y fue quien cultivó las mandrágoras con las que se curó a los alumnos petrificados por el basilisco. Vio en Neville un talento extraordinario para las plantas.',
      'En la Batalla de Hogwarts organizó un ataque con plantas peligrosas —mandrágoras y tentáculas venenosas— contra los mortífagos.'
    ],
    momentos: [
      { ano: '1992', texto: 'Cultiva las mandrágoras que curan a los petrificados.' },
      { ano: '1998', texto: 'Lanza plantas mágicas contra los mortífagos.' }
    ]
  },
  {
    id: 'filch', nombre: 'Argus Filch', nombreCompleto: 'Argus Filch', apodo: 'El conserje',
    actor: 'David Bradley', wiki: 'David_Bradley_(English_actor)',
    casa: 'ninguna', importancia: 'reparto', grupos: ['hogwarts'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Squib', patronus: 'No puede conjurar',
    varita: 'Ninguna', ocupacion: 'Conserje de Hogwarts',
    rasgos: ['Gruñón', 'Vigilante', 'Resentido', 'Fiel a su gata'],
    resumen: 'Conserje de Hogwarts, squib amargado que patrulla el castillo junto a su gata, la Señora Norris.',
    historia: [
      'Nacido en una familia de magos pero sin poderes, Filch intentó en secreto aprender magia con un curso por correspondencia (Embrujorápid). Se venga de su frustración persiguiendo a los alumnos que rompen las normas y sueña con volver a los castigos de antaño.',
      'Encontró un aliado en Umbridge durante su mandato. Cuando la Señora Norris fue petrificada, su desesperación mostró su lado más humano.'
    ],
    momentos: [
      { ano: '1992', texto: 'La Señora Norris es petrificada.' },
      { ano: '1995', texto: 'Colabora con la Brigada Inquisitorial de Umbridge.' }
    ]
  },

  /* ============================ ESTUDIANTES ============================ */
  {
    id: 'draco', nombre: 'Draco Malfoy', nombreCompleto: 'Draco Lucius Malfoy', apodo: 'El príncipe de Slytherin',
    actor: 'Tom Felton', wiki: 'Tom_Felton',
    casa: 'slytherin', importancia: 'secundario', grupos: ['estudiante', 'mortifago'],
    nacimiento: '5 de junio de 1980', muerte: null, sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Espino, pelo de unicornio, 25 cm', ocupacion: 'Heredero de la familia Malfoy',
    rasgos: ['Arrogante', 'Ambicioso', 'Asustado', 'Orgulloso', 'Conflictivo'],
    resumen: 'Heredero de los Malfoy y rival escolar de Harry, obligado a convertirse en mortífago siendo adolescente.',
    historia: [
      'Educado en el orgullo de la sangre limpia, Draco ofreció su amistad a Harry en su primer día y fue rechazado; desde entonces fue su rival en clase y en el campo de quidditch como buscador de Slytherin.',
      'Tras el encarcelamiento de su padre, Voldemort lo castigó encargándole matar a Dumbledore. Pasó el sexto curso reparando el Armario Evanescente para introducir mortífagos en el castillo, pero en la Torre de Astronomía no fue capaz de lanzar la maldición.',
      'Durante la guerra se negó a identificar a Harry en la Mansión Malfoy. Harry le salvó la vida en el incendio de la Sala de los Menesteres. Años después aparece en el andén 9¾ despidiendo a su hijo Scorpius.'
    ],
    momentos: [
      { ano: '1991', texto: 'Harry rechaza su amistad.' },
      { ano: '1996', texto: 'Recibe la Marca Tenebrosa y la misión de matar a Dumbledore.' },
      { ano: '1997', texto: 'Desarma a Dumbledore en la Torre de Astronomía.' },
      { ano: '1998', texto: 'Harry le salva del Fuego Maldito.' }
    ]
  },
  {
    id: 'neville', nombre: 'Neville Longbottom', nombreCompleto: 'Neville Longbottom', apodo: 'El héroe inesperado',
    actor: 'Matthew Lewis', wiki: 'Matthew_Lewis_(actor)',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['estudiante', 'ejercito'],
    nacimiento: '30 de julio de 1980', muerte: null, sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Cerezo, pelo de unicornio, 33 cm', ocupacion: 'Profesor de Herbología',
    rasgos: ['Humilde', 'Valiente', 'Tenaz', 'Torpe (al principio)', 'Leal'],
    resumen: 'Torpe y tímido al principio, acabó siendo uno de los grandes héroes de la guerra y quien mató a Nagini.',
    historia: [
      'Sus padres, Frank y Alice, aurores de la Orden, fueron torturados hasta la locura por Bellatrix Lestrange. Neville creció con su abuela y, por la profecía, pudo haber sido «el elegido» en lugar de Harry. Ganó los diez puntos decisivos de la Copa de las Casas en primer curso al enfrentarse a sus amigos.',
      'Encontró su confianza en el Ejército de Dumbledore y luchó en el Departamento de Misterios. Durante el último año, con Hogwarts en manos de los Carrow, lideró la resistencia desde la Sala de los Menesteres.',
      'En la batalla final desafió a Voldemort, sacó la espada de Gryffindor del Sombrero Seleccionador y decapitó a Nagini, el último horrocrux. Más tarde fue profesor de Herbología en Hogwarts.'
    ],
    momentos: [
      { ano: '1991', texto: 'Planta cara a sus amigos y gana la Copa para Gryffindor.' },
      { ano: '1996', texto: 'Lucha en el Departamento de Misterios.' },
      { ano: '1997', texto: 'Lidera la resistencia estudiantil.' },
      { ano: '1998', texto: 'Mata a Nagini con la espada de Gryffindor.' }
    ]
  },
  {
    id: 'luna', nombre: 'Luna Lovegood', nombreCompleto: 'Luna Lovegood', apodo: 'Lunática',
    actor: 'Evanna Lynch', wiki: 'Evanna_Lynch',
    casa: 'ravenclaw', importancia: 'secundario', grupos: ['estudiante', 'ejercito'],
    nacimiento: '13 de febrero de 1981', muerte: null, sangre: 'Sangre limpia', patronus: 'Liebre',
    varita: 'Desconocida', ocupacion: 'Naturalista mágica',
    rasgos: ['Soñadora', 'Sincera', 'Excéntrica', 'Serena', 'Valiente'],
    resumen: 'Excéntrica alumna de Ravenclaw, hija del director de El Quisquilloso, capaz de ver a los thestrals.',
    historia: [
      'Luna vio morir a su madre en un accidente mágico cuando tenía nueve años, por lo que puede ver a los thestrals. Sus compañeros la apodaban «Lunática» por sus creencias en criaturas como los snorkacks de asta arrugada, pero ella nunca dejó de ser fiel a sí misma.',
      'Se unió al Ejército de Dumbledore y acompañó a Harry al Departamento de Misterios. Fue secuestrada por los mortífagos para silenciar a su padre y encerrada en la Mansión Malfoy hasta que Dobby la rescató.',
      'En la Batalla de Hogwarts ayudó a Harry a encontrar la diadema de Ravenclaw. Más tarde se hizo naturalista y viajó por el mundo estudiando criaturas mágicas.'
    ],
    momentos: [
      { ano: '1995', texto: 'Conoce a Harry en el expreso de Hogwarts.' },
      { ano: '1996', texto: 'Lucha en el Departamento de Misterios.' },
      { ano: '1998', texto: 'Rescatada de la Mansión Malfoy por Dobby.' }
    ]
  },
  {
    id: 'cedric', nombre: 'Cedric Diggory', nombreCompleto: 'Cedric Diggory', apodo: 'El campeón de Hogwarts',
    actor: 'Robert Pattinson', wiki: 'Robert_Pattinson',
    casa: 'hufflepuff', importancia: 'secundario', grupos: ['estudiante'],
    nacimiento: '1977', muerte: '24 de junio de 1995', sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Fresno, pelo de unicornio, 31 cm', ocupacion: 'Estudiante, prefecto y buscador de Hufflepuff',
    rasgos: ['Noble', 'Justo', 'Popular', 'Valiente'],
    resumen: 'Prefecto y buscador de Hufflepuff, campeón oficial de Hogwarts en el Torneo de los Tres Magos.',
    historia: [
      'Cedric era admirado por todo el colegio por su talento y su deportividad. Elegido por el Cáliz de Fuego como campeón de Hogwarts, compartió con Harry pistas sobre las pruebas y ambos acordaron tocar la copa a la vez al final del laberinto.',
      'La copa era un traslador que los llevó al cementerio de Little Hangleton. Por orden de Voldemort, Colagusano lo mató de inmediato. Su muerte marcó el regreso del Señor Tenebroso y el fin de la inocencia para toda una generación.'
    ],
    momentos: [
      { ano: '1994', texto: 'Elegido campeón por el Cáliz de Fuego.' },
      { ano: '1995', texto: 'Asesinado por Colagusano en el cementerio.' }
    ]
  },
  {
    id: 'cho', nombre: 'Cho Chang', nombreCompleto: 'Cho Chang', apodo: 'La buscadora de Ravenclaw',
    actor: 'Katie Leung', wiki: 'Katie_Leung',
    casa: 'ravenclaw', importancia: 'reparto', grupos: ['estudiante', 'ejercito'],
    nacimiento: '1979', muerte: null, sangre: 'Desconocida', patronus: 'Cisne',
    varita: 'Desconocida', ocupacion: 'Estudiante y buscadora de Ravenclaw',
    rasgos: ['Sensible', 'Popular', 'Leal'],
    resumen: 'Buscadora de Ravenclaw, novia de Cedric Diggory y primer amor de Harry.',
    historia: [
      'Cho salía con Cedric cuando este murió en el Torneo. Al año siguiente se unió al Ejército de Dumbledore y vivió una breve y complicada relación con Harry, marcada por el duelo.',
      'Regresó a Hogwarts para luchar en la batalla final.'
    ],
    momentos: [
      { ano: '1994', texto: 'Acude al baile de Navidad con Cedric.' },
      { ano: '1995', texto: 'Primer beso con Harry bajo el muérdago.' }
    ]
  },
  {
    id: 'lavender', nombre: 'Lavender Brown', nombreCompleto: 'Lavender Brown', apodo: 'Lav-Lav',
    actor: 'Jessie Cave', wiki: 'Jessie_Cave',
    casa: 'gryffindor', importancia: 'reparto', grupos: ['estudiante', 'ejercito'],
    nacimiento: '1979', muerte: '2 de mayo de 1998 (según las películas)', sangre: 'Desconocida', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Estudiante',
    rasgos: ['Romántica', 'Entusiasta', 'Chismosa'],
    resumen: 'Compañera de Gryffindor, novia de Ron durante el sexto curso.',
    historia: [
      'Lavender compartía dormitorio con Hermione y su pasión por la Adivinación. En sexto curso inició un apasionado noviazgo con Ron que despertó los celos de Hermione.',
      'Se unió al Ejército de Dumbledore y fue atacada por Fenrir Greyback durante la Batalla de Hogwarts.'
    ],
    momentos: [
      { ano: '1996', texto: 'Empieza a salir con Ron.' },
      { ano: '1998', texto: 'Lucha en la Batalla de Hogwarts.' }
    ]
  },

  /* ============================ FAMILIA WEASLEY ============================ */
  {
    id: 'ginny', nombre: 'Ginny Weasley', nombreCompleto: 'Ginevra Molly Weasley', apodo: 'La pequeña de los Weasley',
    actor: 'Bonnie Wright', wiki: 'Bonnie_Wright',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['estudiante', 'weasley', 'ejercito'],
    nacimiento: '11 de agosto de 1981', muerte: null, sangre: 'Sangre limpia', patronus: 'Caballo',
    varita: 'Desconocida', ocupacion: 'Jugadora de las Holyhead Harpies y periodista deportiva',
    rasgos: ['Decidida', 'Valiente', 'Ingeniosa', 'Deportista'],
    resumen: 'La hija menor de los Weasley, poseída por el diario de Tom Ryddle y, con los años, esposa de Harry.',
    historia: [
      'Única chica entre siete hermanos, Ginny se enamoró de Harry antes de conocerlo. En su primer año Lucius Malfoy colocó entre sus libros el diario de Tom Ryddle, que la poseyó y la obligó a abrir la Cámara de los Secretos. Harry la rescató.',
      'Con los años se convirtió en una bruja segura y temida por su maleficio de los mocomurciélagos. Cazadora de Gryffindor, miembro del Ejército de Dumbledore y líder de la resistencia en su sexto curso junto a Neville y Luna.',
      'Tras la guerra jugó con las Holyhead Harpies y fue periodista deportiva de El Profeta. Se casó con Harry.'
    ],
    momentos: [
      { ano: '1992', texto: 'Poseída por el diario de Tom Ryddle.' },
      { ano: '1996', texto: 'Comienza su relación con Harry.' },
      { ano: '1997', texto: 'Lidera la resistencia en Hogwarts.' }
    ]
  },
  {
    id: 'fred', nombre: 'Fred Weasley', nombreCompleto: 'Fred Weasley', apodo: 'Gred',
    actor: 'James Phelps', wiki: 'James_and_Oliver_Phelps',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['estudiante', 'weasley', 'orden', 'ejercito'],
    nacimiento: '1 de abril de 1978', muerte: '2 de mayo de 1998', sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Cofundador de Sortilegios Weasley',
    rasgos: ['Bromista', 'Ingenioso', 'Rebelde', 'Valiente'],
    resumen: 'Mitad del dúo de gemelos bromistas más famoso de Hogwarts y cofundador de Sortilegios Weasley.',
    historia: [
      'Fred y George fueron los reyes de las bromas en Hogwarts. Entregaron a Harry el Mapa del Merodeador y usaron el premio del Torneo que él les regaló para abrir su tienda de artículos de broma en el Callejón Diagon.',
      'Su huida espectacular de Hogwarts, dejando fuegos artificiales mágicos contra Umbridge, es legendaria. Fred murió en la Batalla de Hogwarts, riendo, en una explosión, una de las pérdidas más dolorosas de la guerra.'
    ],
    momentos: [
      { ano: '1993', texto: 'Regala a Harry el Mapa del Merodeador.' },
      { ano: '1996', texto: 'Abandona Hogwarts entre fuegos artificiales.' },
      { ano: '1998', texto: 'Muere en la Batalla de Hogwarts.' }
    ]
  },
  {
    id: 'george', nombre: 'George Weasley', nombreCompleto: 'George Weasley', apodo: 'Feorge',
    actor: 'Oliver Phelps', wiki: 'James_and_Oliver_Phelps',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['estudiante', 'weasley', 'orden', 'ejercito'],
    nacimiento: '1 de abril de 1978', muerte: null, sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Dueño de Sortilegios Weasley',
    rasgos: ['Bromista', 'Emprendedor', 'Leal', 'Resiliente'],
    resumen: 'Gemelo de Fred, cofundador de Sortilegios Weasley; perdió una oreja durante la huida de Privet Drive.',
    historia: [
      'Inseparable de Fred, George compartió con él todas sus travesuras e inventos: las orejas extensibles, los caramelos longuilinguos o el pantano portátil.',
      'Durante la Batalla de los Siete Potter una maldición de Snape le arrancó una oreja. Tras la muerte de su gemelo siguió adelante con la tienda y llamó Fred a su primer hijo.'
    ],
    momentos: [
      { ano: '1994', texto: 'Apuesta con Bagman en los Mundiales de Quidditch.' },
      { ano: '1997', texto: 'Pierde una oreja en la huida de Privet Drive.' }
    ]
  },
  {
    id: 'arthur', nombre: 'Arthur Weasley', nombreCompleto: 'Arthur Weasley', apodo: 'El fan de los muggles',
    actor: 'Mark Williams', wiki: 'Mark_Williams_(actor)',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['weasley', 'orden', 'ministerio'],
    nacimiento: '6 de febrero de 1950', muerte: null, sangre: 'Sangre limpia', patronus: 'Comadreja',
    varita: 'Desconocida', ocupacion: 'Ministerio: uso indebido de artefactos muggles',
    rasgos: ['Bondadoso', 'Curioso', 'Honrado', 'Humilde'],
    resumen: 'Patriarca de los Weasley, trabajador del Ministerio y apasionado de todo lo muggle.',
    historia: [
      'Arthur trabaja en la Oficina contra el Uso Indebido de Artefactos Muggles y colecciona enchufes y pilas. Hechizó un Ford Anglia para que volara, el mismo coche con el que Harry y Ron llegaron a Hogwarts.',
      'Miembro de la Orden del Fénix, fue atacado por Nagini mientras vigilaba el Departamento de Misterios; Harry lo vio en una visión y le salvó la vida.'
    ],
    momentos: [
      { ano: '1992', texto: 'Su Ford Anglia volador llega a Hogwarts.' },
      { ano: '1995', texto: 'Sobrevive al ataque de Nagini gracias a Harry.' }
    ]
  },
  {
    id: 'molly', nombre: 'Molly Weasley', nombreCompleto: 'Molly Weasley (de soltera Prewett)', apodo: 'El corazón de La Madriguera',
    actor: 'Julie Walters', wiki: 'Julie_Walters',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['weasley', 'orden'],
    nacimiento: '30 de octubre de 1949', muerte: null, sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Ama de casa y miembro de la Orden',
    rasgos: ['Protectora', 'Cariñosa', 'Temperamental', 'Feroz'],
    resumen: 'Madre de siete hijos y madre de adopción de Harry; derrotó a Bellatrix Lestrange en la batalla final.',
    historia: [
      'Molly acogió a Harry desde el primer día, cuando le enseñó a cruzar la barrera del andén 9¾. Cada Navidad le enviaba un jersey tejido a mano, como a sus propios hijos.',
      'Perdió a sus hermanos Gideon y Fabian en la primera guerra. En la Batalla de Hogwarts, al ver a Bellatrix atacar a Ginny, se enfrentó a ella en duelo y la derrotó.'
    ],
    momentos: [
      { ano: '1991', texto: 'Ayuda a Harry a cruzar al andén 9¾.' },
      { ano: '1998', texto: 'Derrota a Bellatrix Lestrange.' }
    ]
  },
  {
    id: 'percy', nombre: 'Percy Weasley', nombreCompleto: 'Percy Ignatius Weasley', apodo: 'El ambicioso',
    actor: 'Chris Rankin', wiki: 'Chris_Rankin',
    casa: 'gryffindor', importancia: 'reparto', grupos: ['weasley', 'ministerio'],
    nacimiento: '22 de agosto de 1976', muerte: null, sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Funcionario del Ministerio',
    rasgos: ['Ambicioso', 'Estricto', 'Orgulloso', 'Arrepentido'],
    resumen: 'Prefecto, Premio Anual y funcionario obsesionado con las normas que rompió con su familia y volvió para luchar.',
    historia: [
      'Percy llegó a ser asistente del ministro Fudge y se distanció de su familia al creer la versión oficial que negaba el regreso de Voldemort.',
      'Regresó arrepentido justo antes de la Batalla de Hogwarts y luchó junto a sus hermanos; estaba al lado de Fred cuando este murió.'
    ],
    momentos: [
      { ano: '1995', texto: 'Rompe con su familia para servir a Fudge.' },
      { ano: '1998', texto: 'Se reconcilia con los Weasley en la batalla final.' }
    ]
  },
  {
    id: 'bill', nombre: 'Bill Weasley', nombreCompleto: 'William Arthur Weasley', apodo: 'El rompedor de maldiciones',
    actor: 'Domhnall Gleeson', wiki: 'Domhnall_Gleeson',
    casa: 'gryffindor', importancia: 'reparto', grupos: ['weasley', 'orden'],
    nacimiento: '29 de noviembre de 1970', muerte: null, sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Rompedor de maldiciones en Gringotts',
    rasgos: ['Aventurero', 'Tranquilo', 'Valiente'],
    resumen: 'El mayor de los Weasley, rompedor de maldiciones de Gringotts, esposo de Fleur Delacour.',
    historia: [
      'Bill trabajó para Gringotts en Egipto. Fue herido por Fenrir Greyback en la batalla de la Torre de Astronomía, lo que le dejó cicatrices y cierta afición por la carne poco hecha.',
      'Se casó con Fleur en La Madriguera; la boda fue interrumpida por la caída del Ministerio. Su casa, El Refugio, dio cobijo al trío tras la fuga de la Mansión Malfoy.'
    ],
    momentos: [
      { ano: '1997', texto: 'Herido por Greyback; boda con Fleur.' },
      { ano: '1998', texto: 'Acoge al trío en El Refugio.' }
    ]
  },

  /* ============================ MERODEADORES Y POTTER ============================ */
  {
    id: 'james', nombre: 'James Potter', nombreCompleto: 'James Fleamont Potter', apodo: 'Cornamenta',
    actor: 'Adrian Rawlins', wiki: 'Adrian_Rawlins',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['merodeador', 'orden'],
    nacimiento: '27 de marzo de 1960', muerte: '31 de octubre de 1981', sangre: 'Sangre limpia', patronus: 'Ciervo',
    varita: 'Caoba, 28 cm', ocupacion: 'Miembro de la Orden del Fénix',
    rasgos: ['Carismático', 'Arrogante (de joven)', 'Valiente', 'Leal'],
    resumen: 'Padre de Harry, líder de los Merodeadores y animago ciervo; murió defendiendo a su familia.',
    historia: [
      'Brillante jugador de quidditch y bromista incorregible, James formó con Sirius, Remus y Peter el grupo de los Merodeadores. Se hizo animago —un ciervo— para acompañar a Remus en sus transformaciones. De joven fue cruel con Snape, pero maduró y conquistó a Lily Evans.',
      'Miembro de la Orden del Fénix, se enfrentó tres veces a Voldemort. Traicionado por Peter, su guardián secreto, murió desarmado intentando detener al Señor Tenebroso en el Valle de Godric. Su capa de invisibilidad, una de las Reliquias de la Muerte, pasó a Harry.'
    ],
    momentos: [
      { ano: '1971', texto: 'Entra en Hogwarts y conoce a Sirius.' },
      { ano: '1978', texto: 'Se casa con Lily Evans.' },
      { ano: '1981', texto: 'Muere en el Valle de Godric.' }
    ]
  },
  {
    id: 'lily', nombre: 'Lily Potter', nombreCompleto: 'Lily Potter (de soltera Evans)', apodo: 'La madre del elegido',
    actor: 'Geraldine Somerville', wiki: 'Geraldine_Somerville',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['orden'],
    nacimiento: '30 de enero de 1960', muerte: '31 de octubre de 1981', sangre: 'Hija de muggles', patronus: 'Cierva',
    varita: 'Sauce, 26 cm', ocupacion: 'Miembro de la Orden del Fénix',
    rasgos: ['Valiente', 'Compasiva', 'Talentosa', 'Íntegra'],
    resumen: 'Madre de Harry, bruja excepcional cuyo sacrificio protegió a su hijo de la maldición asesina.',
    historia: [
      'Lily descubrió su magia de niña y su vecino Severus Snape le explicó el mundo mágico. Su hermana Petunia, celosa, se distanció de ella para siempre. En Hogwarts destacó en Pociones y fue alumna favorita de Slughorn.',
      'Se casó con James y entró en la Orden. La noche del 31 de octubre de 1981 se interpuso entre Voldemort y Harry; su sacrificio voluntario creó la antigua protección que hizo rebotar la maldición asesina.'
    ],
    momentos: [
      { ano: '1971', texto: 'Entra en Gryffindor.' },
      { ano: '1976', texto: 'Rompe su amistad con Snape.' },
      { ano: '1981', texto: 'Se sacrifica por Harry.' }
    ]
  },
  {
    id: 'sirius', nombre: 'Sirius Black', nombreCompleto: 'Sirius Black III', apodo: 'Canuto',
    actor: 'Gary Oldman', wiki: 'Gary_Oldman',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['merodeador', 'orden'],
    nacimiento: '3 de noviembre de 1959', muerte: '18 de junio de 1996', sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Miembro de la Orden del Fénix',
    rasgos: ['Rebelde', 'Leal', 'Temerario', 'Afectuoso', 'Impulsivo'],
    resumen: 'Padrino de Harry, merodeador y animago perro, encarcelado doce años en Azkaban por un crimen que no cometió.',
    historia: [
      'Sirius rompió con su familia de sangre limpia al entrar en Gryffindor y encontró en los Potter su verdadero hogar. Animago no registrado —un gran perro negro—, fue el mejor amigo de James y padrino de Harry.',
      'Tras la muerte de los Potter persiguió a Peter Pettigrew, quien fingió su propia muerte, mató a doce muggles y le incriminó. Pasó doce años en Azkaban hasta que se convirtió en el primer preso en escapar de la prisión.',
      'Cedió la casa de su familia en Grimmauld Place como cuartel de la Orden. Murió en el Departamento de Misterios, alcanzado por su prima Bellatrix, y cayó a través del velo.'
    ],
    momentos: [
      { ano: '1981', texto: 'Encarcelado en Azkaban sin juicio.' },
      { ano: '1993', texto: 'Se fuga de Azkaban.' },
      { ano: '1994', texto: 'Escapa a lomos de Buckbeak.' },
      { ano: '1996', texto: 'Muere en el Departamento de Misterios.' }
    ]
  },
  {
    id: 'pettigrew', nombre: 'Peter Pettigrew', nombreCompleto: 'Peter Pettigrew', apodo: 'Colagusano',
    actor: 'Timothy Spall', wiki: 'Timothy_Spall',
    casa: 'gryffindor', importancia: 'secundario', grupos: ['merodeador', 'mortifago'],
    nacimiento: '1960', muerte: 'Marzo de 1998', sangre: 'Sangre limpia', patronus: 'No conjura',
    varita: 'Castaño, fibra de corazón de dragón, 23,5 cm', ocupacion: 'Mortífago',
    rasgos: ['Cobarde', 'Traidor', 'Servil', 'Oportunista'],
    resumen: 'El merodeador que traicionó a los Potter y vivió doce años como Scabbers, la rata de los Weasley.',
    historia: [
      'Peter siempre buscó la protección de los más fuertes. Guardián secreto de los Potter, los vendió a Voldemort y después fingió su muerte cortándose un dedo, incriminando a Sirius. Se escondió como la mascota de los Weasley hasta que fue descubierto en la Casa de los Gritos.',
      'Harry le perdonó la vida, lo que creó una deuda mágica. Ayudó a Voldemort a recuperar su cuerpo cortándose la mano; el Señor Tenebroso le dio una de plata. Cuando dudó un instante en matar a Harry en la Mansión Malfoy, la propia mano lo estranguló.'
    ],
    momentos: [
      { ano: '1981', texto: 'Traiciona a los Potter e incrimina a Sirius.' },
      { ano: '1994', texto: 'Descubierto en la Casa de los Gritos; huye.' },
      { ano: '1995', texto: 'Devuelve el cuerpo a Voldemort y mata a Cedric.' },
      { ano: '1998', texto: 'Muere estrangulado por su mano de plata.' }
    ]
  },

  /* ============================ ORDEN DEL FÉNIX ============================ */
  {
    id: 'tonks', nombre: 'Nymphadora Tonks', nombreCompleto: 'Nymphadora Tonks', apodo: 'Tonks',
    actor: 'Natalia Tena', wiki: 'Natalia_Tena',
    casa: 'hufflepuff', importancia: 'reparto', grupos: ['orden', 'ministerio'],
    nacimiento: '1973', muerte: '2 de mayo de 1998', sangre: 'Mestiza', patronus: 'Lobo (antes, liebre)',
    varita: 'Desconocida', ocupacion: 'Auror',
    rasgos: ['Divertida', 'Torpe', 'Valiente', 'Metamorfomaga'],
    resumen: 'Auror metamorfomaga de pelo rosa chicle, miembro de la Orden y esposa de Remus Lupin.',
    historia: [
      'Hija de Andromeda Black, que fue repudiada por casarse con un hijo de muggles, Tonks puede cambiar su aspecto a voluntad. Odia su nombre de pila y prefiere que la llamen por su apellido.',
      'Se enamoró de Remus Lupin, con quien se casó y tuvo a Teddy. Murió en la Batalla de Hogwarts a manos de su tía Bellatrix.'
    ],
    momentos: [
      { ano: '1995', texto: 'Escolta a Harry desde Privet Drive.' },
      { ano: '1998', texto: 'Nace Teddy; muere en la batalla final.' }
    ]
  },
  {
    id: 'moody', nombre: 'Alastor Moody', nombreCompleto: 'Alastor Moody', apodo: 'Ojoloco',
    actor: 'Brendan Gleeson', wiki: 'Brendan_Gleeson',
    casa: 'ninguna', importancia: 'secundario', grupos: ['orden', 'ministerio'],
    nacimiento: 'Desconocido', muerte: '27 de julio de 1997', sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Auror retirado',
    rasgos: ['Paranoico', 'Implacable', 'Leal', 'Veterano'],
    resumen: 'El auror más legendario de su época, con un ojo mágico que ve a través de todo.',
    historia: [
      'Moody llenó media Azkaban de mortífagos durante la primera guerra, a costa de perder un ojo, una pierna y parte de la nariz. Su lema era la vigilancia constante.',
      'En 1994 iba a enseñar Defensa en Hogwarts, pero Barty Crouch Jr. lo secuestró, lo encerró en un baúl y se hizo pasar por él durante todo el curso usando poción multijugos. Murió durante la huida de los Siete Potter.'
    ],
    momentos: [
      { ano: '1994', texto: 'Secuestrado y suplantado por Barty Crouch Jr.' },
      { ano: '1997', texto: 'Muere en la Batalla de los Siete Potter.' }
    ]
  },
  {
    id: 'kingsley', nombre: 'Kingsley Shacklebolt', nombreCompleto: 'Kingsley Shacklebolt', apodo: 'La voz grave de la Orden',
    actor: 'George Harris', wiki: 'George_Harris_(actor)',
    casa: 'ninguna', importancia: 'reparto', grupos: ['orden', 'ministerio'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Desconocida', patronus: 'Lince',
    varita: 'Desconocida', ocupacion: 'Auror y Ministro de Magia',
    rasgos: ['Sereno', 'Firme', 'Diplomático'],
    resumen: 'Auror de la Orden infiltrado en el Ministerio y, tras la guerra, Ministro de Magia.',
    historia: [
      'Kingsley protegía en secreto al primer ministro muggle mientras despistaba al Ministerio en la búsqueda de Sirius. Su patronus lince avisó de la caída del Ministerio durante la boda de Bill y Fleur.',
      'Luchó contra Voldemort en la Batalla de Hogwarts y fue nombrado Ministro de Magia provisional y después definitivo.'
    ],
    momentos: [
      { ano: '1997', texto: 'Avisa de la caída del Ministerio.' },
      { ano: '1998', texto: 'Ministro de Magia tras la guerra.' }
    ]
  },
  {
    id: 'aberforth', nombre: 'Aberforth Dumbledore', nombreCompleto: 'Aberforth Dumbledore', apodo: 'El tabernero',
    actor: 'Ciarán Hinds', wiki: 'Ciarán_Hinds',
    casa: 'ninguna', importancia: 'reparto', grupos: ['orden'],
    nacimiento: '1883/1884', muerte: null, sangre: 'Mestizo', patronus: 'Cabra',
    varita: 'Desconocida', ocupacion: 'Tabernero de Cabeza de Puerco',
    rasgos: ['Huraño', 'Protector', 'Rencoroso', 'Honesto'],
    resumen: 'Hermano menor de Albus, dueño de la taberna Cabeza de Puerco en Hogsmeade.',
    historia: [
      'Aberforth nunca perdonó a su hermano la muerte de Ariana. Vive rodeado de cabras en Hogsmeade y vigilaba a Harry a través de un fragmento del espejo de doble sentido de Sirius; fue él quien envió a Dobby a la Mansión Malfoy.',
      'Abrió a Harry un pasadizo secreto hacia la Sala de los Menesteres y luchó en la batalla final.'
    ],
    momentos: [
      { ano: '1899', texto: 'Muere Ariana; rompe con Albus.' },
      { ano: '1998', texto: 'Ayuda a Harry a entrar en Hogwarts.' }
    ]
  },

  /* ============================ MORTÍFAGOS ============================ */
  {
    id: 'voldemort', nombre: 'Lord Voldemort', nombreCompleto: 'Tom Sorvolo Ryddle', apodo: 'El que no debe ser nombrado',
    actor: 'Ralph Fiennes', wiki: 'Ralph_Fiennes',
    casa: 'slytherin', importancia: 'principal', grupos: ['mortifago'],
    nacimiento: '31 de diciembre de 1926', muerte: '2 de mayo de 1998', sangre: 'Mestizo', patronus: 'Ninguno',
    varita: 'Tejo, pluma de fénix, 34 cm', ocupacion: 'Señor Tenebroso',
    rasgos: ['Ambicioso', 'Cruel', 'Carismático', 'Brillante', 'Temeroso de la muerte'],
    resumen: 'El mago tenebroso más peligroso de todos los tiempos, obsesionado con la inmortalidad y la pureza de sangre.',
    historia: [
      'Tom Ryddle nació en un orfanato muggle; su madre, Mérope Gaunt, descendiente de Salazar Slytherin, murió al darle a luz. Dumbledore lo visitó a los once años y percibió en él una peligrosa inclinación a la crueldad. En Hogwarts fue un alumno modélico y prefecto, pero en secreto abrió la Cámara de los Secretos y asesinó a su padre muggle.',
      'Dividió su alma en siete fragmentos mediante horrocruxes —el diario, el anillo de Gaunt, el guardapelo de Slytherin, la copa de Hufflepuff, la diadema de Ravenclaw, la serpiente Nagini y, sin saberlo, el propio Harry— para no morir jamás. Reunió a los mortífagos y sembró el terror durante la primera guerra mágica.',
      'Por la profecía atacó a los Potter en 1981 y perdió su cuerpo. Tras años como un espectro, recuperó la forma humana en 1995 con la sangre de Harry. Tomó el Ministerio y Hogwarts, pero Harry, Ron, Hermione y Neville destruyeron sus horrocruxes. Murió el 2 de mayo de 1998 cuando su propia maldición asesina rebotó contra él.'
    ],
    momentos: [
      { ano: '1943', texto: 'Abre la Cámara de los Secretos y crea su primer horrocrux.' },
      { ano: '1970', texto: 'Comienza la primera guerra mágica.' },
      { ano: '1981', texto: 'Pierde su cuerpo al atacar a Harry.' },
      { ano: '1995', texto: 'Recupera su cuerpo en el cementerio de Little Hangleton.' },
      { ano: '1998', texto: 'Muere en el Gran Comedor.' }
    ]
  },
  {
    id: 'bellatrix', nombre: 'Bellatrix Lestrange', nombreCompleto: 'Bellatrix Lestrange (de soltera Black)', apodo: 'La lugarteniente',
    actor: 'Helena Bonham Carter', wiki: 'Helena_Bonham_Carter',
    casa: 'slytherin', importancia: 'secundario', grupos: ['mortifago'],
    nacimiento: '1951', muerte: '2 de mayo de 1998', sangre: 'Sangre limpia', patronus: 'Ninguno',
    varita: 'Nogal, fibra de corazón de dragón, 32 cm', ocupacion: 'Mortífaga',
    rasgos: ['Fanática', 'Sádica', 'Leal a Voldemort', 'Imprevisible'],
    resumen: 'La mortífaga más fanática y temida, prima de Sirius Black y hermana de Narcissa Malfoy.',
    historia: [
      'Bellatrix fue la seguidora más devota de Voldemort. Tras su caída, torturó con la maldición cruciatus a los padres de Neville, Frank y Alice Longbottom, hasta hacerles perder la razón, y fue condenada a Azkaban.',
      'Escapó en 1996, mató a su primo Sirius en el Departamento de Misterios y torturó a Hermione en la Mansión Malfoy. Guardaba en su cámara de Gringotts la copa de Hufflepuff. Lanzó el cuchillo que mató a Dobby y fue derrotada por Molly Weasley en la Batalla de Hogwarts.'
    ],
    momentos: [
      { ano: '1981', texto: 'Tortura a los Longbottom y es encarcelada.' },
      { ano: '1996', texto: 'Escapa de Azkaban y mata a Sirius.' },
      { ano: '1998', texto: 'Mata a Dobby; derrotada por Molly Weasley.' }
    ]
  },
  {
    id: 'lucius', nombre: 'Lucius Malfoy', nombreCompleto: 'Lucius Malfoy', apodo: 'El aristócrata',
    actor: 'Jason Isaacs', wiki: 'Jason_Isaacs',
    casa: 'slytherin', importancia: 'secundario', grupos: ['mortifago'],
    nacimiento: '1954', muerte: null, sangre: 'Sangre limpia', patronus: 'Ninguno',
    varita: 'Olmo, fibra de corazón de dragón (oculta en su bastón)', ocupacion: 'Miembro del Consejo Escolar',
    rasgos: ['Elitista', 'Manipulador', 'Orgulloso', 'Cobarde'],
    resumen: 'Patriarca de los Malfoy, mortífago influyente que compró su libertad y su poder en el Ministerio.',
    historia: [
      'Tras la caída de Voldemort, Lucius alegó haber actuado bajo la maldición imperius y usó su fortuna para ganarse al Ministerio. En 1992 deslizó el diario de Tom Ryddle entre los libros de Ginny y fue expulsado del Consejo Escolar. Harry lo engañó para liberar a su elfo, Dobby.',
      'Fracasó en el Departamento de Misterios y acabó en Azkaban. Liberado, cayó en desgracia ante Voldemort, que le quitó su varita. En la batalla final, la familia Malfoy abandonó el combate para buscar a Draco.'
    ],
    momentos: [
      { ano: '1992', texto: 'Entrega el diario de Ryddle a Ginny; pierde a Dobby.' },
      { ano: '1996', texto: 'Encarcelado tras el Departamento de Misterios.' }
    ]
  },
  {
    id: 'narcissa', nombre: 'Narcissa Malfoy', nombreCompleto: 'Narcissa Malfoy (de soltera Black)', apodo: 'La madre',
    actor: 'Helen McCrory', wiki: 'Helen_McCrory',
    casa: 'slytherin', importancia: 'reparto', grupos: ['mortifago'],
    nacimiento: '1955', muerte: null, sangre: 'Sangre limpia', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Aristócrata',
    rasgos: ['Protectora', 'Orgullosa', 'Astuta'],
    resumen: 'Madre de Draco, cuya mentira a Voldemort en el Bosque Prohibido cambió el curso de la guerra.',
    historia: [
      'Narcissa pidió a Snape que protegiera a Draco y sellaron un Voto Inquebrantable. Aunque compartía los ideales de sangre limpia, su prioridad siempre fue su hijo.',
      'Enviada por Voldemort a comprobar si Harry estaba muerto, sintió su corazón latir y le preguntó en voz baja si Draco seguía vivo. Al saber que sí, mintió: dijo que Harry había muerto.'
    ],
    momentos: [
      { ano: '1996', texto: 'Voto Inquebrantable con Snape.' },
      { ano: '1998', texto: 'Miente a Voldemort sobre la muerte de Harry.' }
    ]
  },
  {
    id: 'crouchjr', nombre: 'Barty Crouch Jr.', nombreCompleto: 'Bartemius Crouch Jr.', apodo: 'El impostor',
    actor: 'David Tennant', wiki: 'David_Tennant',
    casa: 'ninguna', importancia: 'reparto', grupos: ['mortifago'],
    nacimiento: '1962', muerte: '1995 (Beso del dementor)', sangre: 'Sangre limpia', patronus: 'Ninguno',
    varita: 'Desconocida', ocupacion: 'Mortífago',
    rasgos: ['Fanático', 'Astuto', 'Inestable'],
    resumen: 'Mortífago que suplantó a Ojoloco Moody durante un año entero para entregar a Harry a Voldemort.',
    historia: [
      'Hijo del estricto jefe de Cooperación Mágica Internacional, fue condenado a Azkaban junto a los Lestrange. Su madre moribunda se cambió por él con poción multijugos, y su padre lo mantuvo oculto bajo la maldición imperius.',
      'Liberado, se hizo pasar por Moody en Hogwarts, metió el nombre de Harry en el Cáliz de Fuego y convirtió la copa del Torneo en un traslador. Tras ser desenmascarado recibió el Beso del dementor.'
    ],
    momentos: [
      { ano: '1994', texto: 'Conjura la Marca Tenebrosa en los Mundiales.' },
      { ano: '1995', texto: 'Desenmascarado tras la tercera prueba.' }
    ]
  },
  {
    id: 'greyback', nombre: 'Fenrir Greyback', nombreCompleto: 'Fenrir Greyback', apodo: 'El hombre lobo',
    actor: 'Dave Legeno', wiki: 'Dave_Legeno',
    casa: 'ninguna', importancia: 'reparto', grupos: ['mortifago', 'criatura'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Hombre lobo', patronus: 'Ninguno',
    varita: 'Desconocida', ocupacion: 'Aliado de los mortífagos',
    rasgos: ['Salvaje', 'Sanguinario', 'Cruel'],
    resumen: 'Hombre lobo sanguinario que mordió a Remus Lupin cuando era niño.',
    historia: [
      'Greyback busca contagiar a tantos niños como pueda para crear un ejército de hombres lobo. Mordió a Remus Lupin en venganza contra su padre.',
      'Atacó a Bill Weasley en la Torre de Astronomía y lideró a los carroñeros que capturaron al trío en 1998.'
    ],
    momentos: [
      { ano: '1965', texto: 'Muerde al pequeño Remus Lupin.' },
      { ano: '1997', texto: 'Hiere a Bill Weasley.' },
      { ano: '1998', texto: 'Captura al trío con los carroñeros.' }
    ]
  },
  {
    id: 'quirrell', nombre: 'Quirinus Quirrell', nombreCompleto: 'Quirinus Quirrell', apodo: 'El profesor del turbante',
    actor: 'Ian Hart', wiki: 'Ian_Hart',
    casa: 'ravenclaw', importancia: 'reparto', grupos: ['hogwarts', 'mortifago'],
    nacimiento: 'Desconocido', muerte: 'Junio de 1992', sangre: 'Desconocida', patronus: 'Ninguno',
    varita: 'Aliso, pelo de unicornio, 23 cm', ocupacion: 'Profesor de Defensa Contra las Artes Oscuras',
    rasgos: ['Nervioso (fingido)', 'Ambicioso', 'Manipulado'],
    resumen: 'Tartamudo profesor de Defensa que ocultaba a Voldemort bajo su turbante.',
    historia: [
      'Buscando experiencias en Albania, Quirrell encontró el espectro de Voldemort y se convirtió en su huésped. Con él oculto en la nuca, intentó robar la Piedra Filosofal y bebió sangre de unicornio.',
      'Harry le impidió conseguir la piedra: el contacto con la piel del niño, protegida por el amor de Lily, quemaba a Quirrell, que murió.'
    ],
    momentos: [
      { ano: '1991', texto: 'Deja entrar a un trol en Halloween.' },
      { ano: '1992', texto: 'Muere al intentar robar la Piedra Filosofal.' }
    ]
  },

  /* ============================ MINISTERIO Y OTROS ============================ */
  {
    id: 'umbridge', nombre: 'Dolores Umbridge', nombreCompleto: 'Dolores Jane Umbridge', apodo: 'La Suma Inquisidora',
    actor: 'Imelda Staunton', wiki: 'Imelda_Staunton',
    casa: 'slytherin', importancia: 'secundario', grupos: ['ministerio', 'hogwarts'],
    nacimiento: '26 de agosto de 1965', muerte: null, sangre: 'Mestiza (se dice sangre limpia)', patronus: 'Gato',
    varita: 'Abedul, fibra de corazón de dragón, 20 cm', ocupacion: 'Subsecretaria del Ministro de Magia',
    rasgos: ['Autoritaria', 'Cruel', 'Hipócrita', 'Obsesionada con el orden'],
    resumen: 'Subsecretaria del Ministerio vestida de rosa que impuso un régimen de terror en Hogwarts.',
    historia: [
      'Enviada por Fudge como profesora de Defensa, prohibió la práctica de hechizos, publicó decenas de decretos de educación y se convirtió en Suma Inquisidora y directora. Castigaba a los alumnos con una pluma que grababa las frases en su propia piel.',
      'Envió dementores contra Harry en Little Whinging. Bajo el régimen de Voldemort presidió la Comisión de Registro de Nacidos de Muggles. Tras la guerra fue juzgada y encarcelada en Azkaban.'
    ],
    momentos: [
      { ano: '1995', texto: 'Envía dementores a Little Whinging.' },
      { ano: '1996', texto: 'Directora de Hogwarts; se la llevan los centauros.' },
      { ano: '1997', texto: 'Persigue a los nacidos de muggles.' }
    ]
  },
  {
    id: 'fudge', nombre: 'Cornelius Fudge', nombreCompleto: 'Cornelius Oswald Fudge', apodo: 'El Ministro que no quiso ver',
    actor: 'Robert Hardy', wiki: 'Robert_Hardy',
    casa: 'ninguna', importancia: 'reparto', grupos: ['ministerio'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Desconocida', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Ministro de Magia',
    rasgos: ['Cobarde', 'Vanidoso', 'Negacionista'],
    resumen: 'Ministro de Magia que negó el regreso de Voldemort y lanzó una campaña de difamación contra Harry y Dumbledore.',
    historia: [
      'Al principio Fudge admiraba a Dumbledore, pero el miedo a perder su cargo le llevó a negar el regreso de Voldemort y a desacreditar a Harry a través de El Profeta.',
      'Tuvo que reconocer la verdad cuando vio a Voldemort en el Ministerio en 1996 y fue destituido poco después.'
    ],
    momentos: [
      { ano: '1995', texto: 'Niega el regreso de Voldemort.' },
      { ano: '1996', texto: 'Ve a Voldemort en el Atrio y es destituido.' }
    ]
  },
  {
    id: 'rita', nombre: 'Rita Skeeter', nombreCompleto: 'Rita Skeeter', apodo: 'La pluma venenosa',
    actor: 'Miranda Richardson', wiki: 'Miranda_Richardson',
    casa: 'slytherin', importancia: 'reparto', grupos: ['otros'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Desconocida', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Periodista de El Profeta',
    rasgos: ['Sensacionalista', 'Manipuladora', 'Oportunista'],
    resumen: 'Periodista sensacionalista con su pluma a vuelapluma, animaga ilegal con forma de escarabajo.',
    historia: [
      'Rita escribió artículos llenos de mentiras sobre Harry, Hagrid y Hermione durante el Torneo de los Tres Magos. Hermione descubrió que era una animaga no registrada y la encerró en un tarro como escarabajo.',
      'Obligada por Hermione, publicó en El Quisquilloso la entrevista en la que Harry contaba la verdad sobre el regreso de Voldemort. Más tarde escribió una polémica biografía de Dumbledore.'
    ],
    momentos: [
      { ano: '1994', texto: 'Cubre el Torneo de los Tres Magos.' },
      { ano: '1996', texto: 'Publica la entrevista de Harry en El Quisquilloso.' }
    ]
  },
  {
    id: 'fleur', nombre: 'Fleur Delacour', nombreCompleto: 'Fleur Isabelle Delacour', apodo: 'La campeona de Beauxbatons',
    actor: 'Clémence Poésy', wiki: 'Clémence_Poésy',
    casa: 'ninguna', importancia: 'reparto', grupos: ['otros'],
    nacimiento: '1977', muerte: null, sangre: 'Cuarto de veela', patronus: 'Desconocido',
    varita: 'Palisandro, pelo de veela, 24 cm', ocupacion: 'Trabaja en Gringotts',
    rasgos: ['Orgullosa', 'Valiente', 'Leal', 'Elegante'],
    resumen: 'Campeona de Beauxbatons en el Torneo de los Tres Magos, con sangre de veela, y esposa de Bill Weasley.',
    historia: [
      'Fleur representó a la academia francesa de Beauxbatons en el Torneo. Harry rescató a su hermana Gabrielle en la segunda prueba y desde entonces le tuvo gran aprecio.',
      'Trabajó en Gringotts para mejorar su inglés, se enamoró de Bill Weasley y no dudó en casarse con él tras ser herido por Greyback.'
    ],
    momentos: [
      { ano: '1994', texto: 'Campeona de Beauxbatons.' },
      { ano: '1997', texto: 'Se casa con Bill Weasley.' }
    ]
  },
  {
    id: 'krum', nombre: 'Viktor Krum', nombreCompleto: 'Viktor Krum', apodo: 'La estrella del quidditch',
    actor: 'Stanislav Ianevski', wiki: 'Stanislav_Ianevski',
    casa: 'ninguna', importancia: 'reparto', grupos: ['otros'],
    nacimiento: '1976', muerte: null, sangre: 'Desconocida', patronus: 'Desconocido',
    varita: 'Carpe, fibra de corazón de dragón, 26 cm', ocupacion: 'Buscador de la selección de Bulgaria',
    rasgos: ['Reservado', 'Honorable', 'Deportista'],
    resumen: 'Buscador de la selección búlgara y campeón de Durmstrang en el Torneo de los Tres Magos.',
    historia: [
      'Viktor era ya una estrella internacional cuando fue elegido campeón de Durmstrang. Invitó a Hermione al baile de Navidad, lo que provocó los celos de Ron.',
      'Durante la tercera prueba fue hechizado con la maldición imperius por Barty Crouch Jr.'
    ],
    momentos: [
      { ano: '1994', texto: 'Final de los Mundiales de Quidditch; campeón de Durmstrang.' },
      { ano: '1995', texto: 'Hechizado en el laberinto.' }
    ]
  },
  {
    id: 'grindelwald', nombre: 'Gellert Grindelwald', nombreCompleto: 'Gellert Grindelwald', apodo: 'El mago tenebroso del «bien mayor»',
    actor: 'Jamie Campbell Bower (joven) · Michael Byrne (anciano)', wiki: 'Jamie_Campbell_Bower',
    casa: 'ninguna', importancia: 'reparto', grupos: ['otros'],
    nacimiento: '1883', muerte: 'Marzo de 1998', sangre: 'Desconocida', patronus: 'Desconocido',
    varita: 'Varita de Saúco (robada a Gregorovitch)', ocupacion: 'Mago tenebroso',
    rasgos: ['Carismático', 'Visionario', 'Despiadado'],
    resumen: 'El mago tenebroso más peligroso antes de Voldemort, amigo íntimo y después enemigo de Albus Dumbledore.',
    historia: [
      'Expulsado de Durmstrang, Gellert pasó un verano en el Valle de Godric donde compartió con Albus Dumbledore el sueño de reunir las Reliquias de la Muerte. Robó la Varita de Saúco al fabricante Gregorovitch.',
      'Tras aterrorizar Europa fue derrotado por Dumbledore en 1945 y encerrado en su propia prisión, Nurmengard. Voldemort lo mató al negarse a revelarle el paradero de la varita.'
    ],
    momentos: [
      { ano: '1899', texto: 'Conoce a Albus Dumbledore.' },
      { ano: '1945', texto: 'Derrotado por Dumbledore.' },
      { ano: '1998', texto: 'Muere a manos de Voldemort en Nurmengard.' }
    ]
  },
  {
    id: 'ollivander', nombre: 'Garrick Ollivander', nombreCompleto: 'Garrick Ollivander', apodo: 'El fabricante de varitas',
    actor: 'John Hurt', wiki: 'John_Hurt',
    casa: 'ravenclaw', importancia: 'reparto', grupos: ['otros'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Desconocida', patronus: 'Desconocido',
    varita: 'Desconocida', ocupacion: 'Fabricante de varitas en el Callejón Diagon',
    rasgos: ['Enigmático', 'Memorioso', 'Artesano'],
    resumen: 'El mejor fabricante de varitas de Gran Bretaña, que recuerda cada varita que ha vendido.',
    historia: [
      'Ollivander vendió a Harry su varita de acebo, hermana de la de Voldemort por compartir pluma del mismo fénix, Fawkes.',
      'Secuestrado por los mortífagos y encerrado en la Mansión Malfoy, fue rescatado por Dobby y explicó a Harry la naturaleza de la Varita de Saúco.'
    ],
    momentos: [
      { ano: '1991', texto: 'Vende a Harry su varita.' },
      { ano: '1998', texto: 'Rescatado de la Mansión Malfoy.' }
    ]
  },
  {
    id: 'dobby', nombre: 'Dobby', nombreCompleto: 'Dobby', apodo: 'El elfo libre',
    actor: 'Toby Jones (voz)', wiki: 'Toby_Jones',
    casa: 'ninguna', importancia: 'secundario', grupos: ['criatura'],
    nacimiento: 'Desconocido', muerte: 'Marzo de 1998', sangre: 'Elfo doméstico', patronus: '—',
    varita: 'Magia élfica sin varita', ocupacion: 'Elfo doméstico (libre)',
    rasgos: ['Leal', 'Valiente', 'Excesivo', 'Amante de los calcetines'],
    resumen: 'Elfo doméstico de los Malfoy liberado por Harry con un calcetín y héroe de la Mansión Malfoy.',
    historia: [
      'Dobby intentó proteger a Harry en 1992 impidiéndole volver a Hogwarts, con métodos tan desastrosos como una bludger hechizada. Harry lo liberó engañando a Lucius para que le diera un calcetín.',
      'Trabajó libre y pagado en las cocinas de Hogwarts, ayudó a Harry con la branquialga y le mostró la Sala de los Menesteres. Murió rescatando al trío de la Mansión Malfoy y Harry lo enterró sin magia junto a El Refugio.'
    ],
    momentos: [
      { ano: '1992', texto: 'Liberado por Harry con un calcetín.' },
      { ano: '1995', texto: 'Ayuda a Harry con la segunda prueba.' },
      { ano: '1998', texto: 'Muere salvando al trío en la Mansión Malfoy.' }
    ]
  },
  {
    id: 'kreacher', nombre: 'Kreacher', nombreCompleto: 'Kreacher', apodo: 'El elfo de los Black',
    actor: 'Simon McBurney (voz)', wiki: 'Simon_McBurney',
    casa: 'ninguna', importancia: 'reparto', grupos: ['criatura'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Elfo doméstico', patronus: '—',
    varita: 'Magia élfica sin varita', ocupacion: 'Elfo doméstico de la familia Black',
    rasgos: ['Gruñón', 'Leal a los Black', 'Redimido'],
    resumen: 'Viejo elfo de la familia Black que acabó sirviendo a Harry y luchando en Hogwarts.',
    historia: [
      'Kreacher sirvió a Regulus Black y guardó durante años el guardapelo de Slytherin que su amo le pidió destruir. Su resentimiento hacia Sirius le llevó a traicionarlo ante los Malfoy.',
      'Heredado por Harry, se transformó cuando este le trató con respeto y le regaló el guardapelo falso de Regulus. Encabezó a los elfos de Hogwarts en la batalla final.'
    ],
    momentos: [
      { ano: '1996', texto: 'Engaña a Harry para atraerlo al Ministerio.' },
      { ano: '1997', texto: 'Cuenta la historia de Regulus y el guardapelo.' }
    ]
  },
  {
    id: 'griphook', nombre: 'Griphook', nombreCompleto: 'Griphook', apodo: 'El duende de Gringotts',
    actor: 'Warwick Davis', wiki: 'Warwick_Davis',
    casa: 'ninguna', importancia: 'reparto', grupos: ['criatura'],
    nacimiento: 'Desconocido', muerte: '1998 (según las películas)', sangre: 'Duende', patronus: '—',
    varita: 'Ninguna', ocupacion: 'Empleado de Gringotts',
    rasgos: ['Astuto', 'Desconfiado', 'Orgulloso'],
    resumen: 'Duende de Gringotts que acompañó a Harry a su cámara y después al asalto del banco.',
    historia: [
      'Griphook llevó a Harry y a Hagrid a las cámaras de Gringotts en 1991. Años después, rescatado de la Mansión Malfoy, aceptó ayudar al trío a entrar en la cámara de los Lestrange a cambio de la espada de Gryffindor.',
      'Traicionó al trío en el último momento para quedarse la espada. En las películas, Voldemort lo mata al enterarse del robo.'
    ],
    momentos: [
      { ano: '1991', texto: 'Acompaña a Harry a su cámara.' },
      { ano: '1998', texto: 'Asalto a Gringotts.' }
    ]
  },

  /* ============================ MUGGLES ============================ */
  {
    id: 'vernon', nombre: 'Vernon Dursley', nombreCompleto: 'Vernon Dursley', apodo: 'Tío Vernon',
    actor: 'Richard Griffiths', wiki: 'Richard_Griffiths',
    casa: 'ninguna', importancia: 'reparto', grupos: ['muggle'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Muggle', patronus: '—',
    varita: 'Ninguna', ocupacion: 'Director de Grunnings (taladros)',
    rasgos: ['Intolerante', 'Gritón', 'Obsesionado con la normalidad'],
    resumen: 'Tío de Harry, muggle que detesta cualquier cosa fuera de lo normal.',
    historia: [
      'Vernon trató a Harry con desprecio durante toda su infancia, obligándole a dormir en el armario de la escalera. Intentó por todos los medios impedir que recibiera su carta de Hogwarts.',
      'En 1997 la familia tuvo que abandonar Privet Drive protegida por la Orden.'
    ],
    momentos: [
      { ano: '1991', texto: 'Huye a una isla para evitar las cartas.' },
      { ano: '1997', texto: 'Abandona Privet Drive.' }
    ]
  },
  {
    id: 'petunia', nombre: 'Petunia Dursley', nombreCompleto: 'Petunia Dursley (de soltera Evans)', apodo: 'Tía Petunia',
    actor: 'Fiona Shaw', wiki: 'Fiona_Shaw',
    casa: 'ninguna', importancia: 'reparto', grupos: ['muggle'],
    nacimiento: 'Desconocido', muerte: null, sangre: 'Muggle', patronus: '—',
    varita: 'Ninguna', ocupacion: 'Ama de casa',
    rasgos: ['Celosa', 'Cotilla', 'Amargada'],
    resumen: 'Hermana de Lily y tía de Harry, cuya envidia hacia la magia marcó su vida.',
    historia: [
      'De niña Petunia escribió a Dumbledore pidiendo entrar en Hogwarts; su rechazo se convirtió en resentimiento hacia su hermana Lily. Aun así, al acoger a Harry selló la protección de sangre que lo mantuvo a salvo.',
      'Conocía más del mundo mágico de lo que aparentaba: sabía qué eran los dementores.'
    ],
    momentos: [
      { ano: '1981', texto: 'Acoge al bebé Harry en su casa.' },
      { ano: '1995', texto: 'Recibe una carta vociferadora de Dumbledore.' }
    ]
  },
  {
    id: 'dudley', nombre: 'Dudley Dursley', nombreCompleto: 'Dudley Dursley', apodo: 'Dudders',
    actor: 'Harry Melling', wiki: 'Harry_Melling',
    casa: 'ninguna', importancia: 'reparto', grupos: ['muggle'],
    nacimiento: '23 de junio de 1980', muerte: null, sangre: 'Muggle', patronus: '—',
    varita: 'Ninguna', ocupacion: 'Estudiante de Smeltings',
    rasgos: ['Consentido', 'Abusón', 'Redimido'],
    resumen: 'Primo mimado de Harry que, tras ser salvado de los dementores, aprendió a apreciarle.',
    historia: [
      'Dudley pasó la infancia acosando a Harry con su pandilla. En el zoo, Harry lo encerró accidentalmente en el recinto de una boa, y Hagrid le hizo crecer una cola de cerdo.',
      'En 1995 Harry lo salvó del ataque de dos dementores. Al despedirse en 1997, le dio las gracias sinceramente.'
    ],
    momentos: [
      { ano: '1991', texto: 'Le crece una cola de cerdo.' },
      { ano: '1995', texto: 'Harry lo salva de los dementores.' }
    ]
  }
];

/* ============================ RELACIONES ============================
   [origen, destino, tipo, etiqueta]
   ==================================================================== */
const RELACIONES = [
  // Potter
  ['james', 'harry', 'familia', 'Padre e hijo'],
  ['lily', 'harry', 'familia', 'Madre e hijo · su sacrificio le protege'],
  ['james', 'lily', 'amor', 'Matrimonio'],
  ['lily', 'petunia', 'familia', 'Hermanas distanciadas'],
  ['petunia', 'harry', 'familia', 'Tía que le crió a disgusto'],
  ['vernon', 'harry', 'familia', 'Tío por matrimonio'],
  ['dudley', 'harry', 'familia', 'Primos'],
  ['vernon', 'petunia', 'amor', 'Matrimonio'],
  ['vernon', 'dudley', 'familia', 'Padre e hijo'],
  ['petunia', 'dudley', 'familia', 'Madre e hijo'],
  ['sirius', 'harry', 'familia', 'Padrino'],

  // Trío y amigos
  ['harry', 'ron', 'amistad', 'Mejores amigos'],
  ['harry', 'hermione', 'amistad', 'Mejores amigos'],
  ['ron', 'hermione', 'amor', 'Matrimonio'],
  ['harry', 'ginny', 'amor', 'Matrimonio'],
  ['harry', 'cho', 'amor', 'Primer amor'],
  ['cho', 'cedric', 'amor', 'Novios'],
  ['ron', 'lavender', 'amor', 'Noviazgo en sexto curso'],
  ['hermione', 'krum', 'amor', 'Pareja en el baile de Navidad'],
  ['harry', 'neville', 'amistad', 'Compañeros del ED'],
  ['harry', 'luna', 'amistad', 'Amigos fieles'],
  ['neville', 'luna', 'amistad', 'Resistencia de Hogwarts'],
  ['ginny', 'luna', 'amistad', 'Amigas del ED'],
  ['harry', 'hagrid', 'amistad', 'Su primer amigo'],
  ['harry', 'dobby', 'amistad', 'Harry lo liberó'],
  ['harry', 'cedric', 'amistad', 'Campeones del Torneo'],
  ['harry', 'fleur', 'amistad', 'Salvó a su hermana'],
  ['harry', 'krum', 'amistad', 'Rivales en el Torneo'],
  ['harry', 'aberforth', 'amistad', 'Le guió a Hogwarts'],
  ['molly', 'harry', 'amistad', 'Le acoge como a un hijo'],
  ['hermione', 'ginny', 'amistad', 'Amigas íntimas'],
  ['hermione', 'neville', 'amistad', 'Compañeros del ED'],
  ['hermione', 'dobby', 'amistad', 'Defensora de los elfos (P.E.D.D.O.)'],
  ['hagrid', 'hermione', 'amistad', 'Amigos fieles'],
  ['hagrid', 'ron', 'amistad', 'Amigos fieles'],
  ['ron', 'neville', 'amistad', 'Compañeros de dormitorio'],
  ['ron', 'luna', 'amistad', 'Amigos del ED'],
  ['fred', 'harry', 'amistad', 'Le regalaron el Mapa del Merodeador'],
  ['george', 'harry', 'amistad', 'Le regalaron el Mapa del Merodeador'],
  ['mcgonagall', 'hermione', 'mentor', 'Le confió el giratiempo'],
  ['draco', 'hermione', 'enemistad', 'La despreciaba por su origen muggle'],
  ['draco', 'ron', 'enemistad', 'Rivales escolares'],

  // Weasley
  ['arthur', 'molly', 'amor', 'Matrimonio'],
  ['arthur', 'ron', 'familia', 'Padre'], ['molly', 'ron', 'familia', 'Madre'],
  ['arthur', 'ginny', 'familia', 'Padre'], ['molly', 'ginny', 'familia', 'Madre'],
  ['arthur', 'fred', 'familia', 'Padre'], ['molly', 'fred', 'familia', 'Madre'],
  ['arthur', 'george', 'familia', 'Padre'], ['molly', 'george', 'familia', 'Madre'],
  ['arthur', 'percy', 'familia', 'Padre'], ['molly', 'percy', 'familia', 'Madre'],
  ['arthur', 'bill', 'familia', 'Padre'], ['molly', 'bill', 'familia', 'Madre'],
  ['fred', 'george', 'familia', 'Gemelos inseparables'],
  ['bill', 'fleur', 'amor', 'Matrimonio'],

  // Merodeadores
  ['james', 'sirius', 'amistad', 'Hermanos de elección'],
  ['james', 'lupin', 'amistad', 'Merodeadores'],
  ['sirius', 'lupin', 'amistad', 'Merodeadores'],
  ['pettigrew', 'james', 'enemistad', 'Le traicionó ante Voldemort'],
  ['pettigrew', 'sirius', 'enemistad', 'Le incriminó'],
  ['lupin', 'tonks', 'amor', 'Matrimonio'],
  ['lupin', 'harry', 'mentor', 'Le enseñó el Patronus'],
  ['greyback', 'lupin', 'enemistad', 'Le mordió de niño'],
  ['greyback', 'bill', 'enemistad', 'Le hirió en la Torre'],

  // Snape
  ['snape', 'lily', 'amor', 'Amor no correspondido'],
  ['snape', 'james', 'enemistad', 'Rivales en Hogwarts'],
  ['snape', 'sirius', 'enemistad', 'Odio mutuo'],
  ['snape', 'harry', 'mentor', 'Profesor hostil y protector secreto'],
  ['snape', 'draco', 'mentor', 'Voto Inquebrantable para protegerle'],
  ['snape', 'narcissa', 'lealtad', 'Voto Inquebrantable'],
  ['snape', 'voldemort', 'lealtad', 'Agente doble'],
  ['dumbledore', 'snape', 'mentor', 'Confianza absoluta'],
  ['slughorn', 'lily', 'mentor', 'Su alumna favorita'],

  // Dumbledore
  ['dumbledore', 'harry', 'mentor', 'Guía y protector'],
  ['dumbledore', 'aberforth', 'familia', 'Hermanos distanciados'],
  ['dumbledore', 'grindelwald', 'amor', 'Amor de juventud, luego enemigos'],
  ['dumbledore', 'voldemort', 'enemistad', 'Archienemigos'],
  ['dumbledore', 'mcgonagall', 'amistad', 'Colegas y confidentes'],
  ['hagrid', 'dumbledore', 'lealtad', 'Lealtad absoluta'],
  ['moody', 'dumbledore', 'lealtad', 'Orden del Fénix'],
  ['kingsley', 'dumbledore', 'lealtad', 'Orden del Fénix'],
  ['lupin', 'dumbledore', 'lealtad', 'Le permitió estudiar'],
  ['trelawney', 'dumbledore', 'lealtad', 'La protegió tras la profecía'],
  ['fudge', 'dumbledore', 'enemistad', 'Negó el regreso de Voldemort'],
  ['draco', 'dumbledore', 'enemistad', 'Su misión: matarle'],
  ['grindelwald', 'voldemort', 'enemistad', 'Se negó a revelarle la varita'],

  // Profesores
  ['mcgonagall', 'harry', 'mentor', 'Jefa de su casa'],
  ['mcgonagall', 'umbridge', 'enemistad', 'Rivalidad abierta'],
  ['slughorn', 'harry', 'mentor', 'Club de las Eminencias'],
  ['slughorn', 'voldemort', 'mentor', 'Le habló de los horrocruxes'],
  ['sprout', 'neville', 'mentor', 'Herbología'],
  ['flitwick', 'hermione', 'mentor', 'Su alumna estrella'],
  ['moody', 'tonks', 'mentor', 'Formación de auror'],
  ['ollivander', 'harry', 'mentor', 'Le eligió su varita'],
  ['hagrid', 'voldemort', 'enemistad', 'Le culpó de abrir la Cámara'],

  // Voldemort y mortífagos
  ['voldemort', 'harry', 'enemistad', 'Némesis · unidos por la profecía'],
  ['bellatrix', 'voldemort', 'lealtad', 'Su seguidora más fanática'],
  ['lucius', 'voldemort', 'lealtad', 'Mortífago'],
  ['pettigrew', 'voldemort', 'lealtad', 'Le devolvió su cuerpo'],
  ['crouchjr', 'voldemort', 'lealtad', 'Siervo fiel'],
  ['greyback', 'voldemort', 'lealtad', 'Aliado'],
  ['quirrell', 'voldemort', 'lealtad', 'Su huésped'],
  ['draco', 'voldemort', 'lealtad', 'Mortífago bajo coacción'],
  ['lucius', 'narcissa', 'amor', 'Matrimonio'],
  ['lucius', 'draco', 'familia', 'Padre e hijo'],
  ['narcissa', 'draco', 'familia', 'Madre e hijo'],
  ['bellatrix', 'narcissa', 'familia', 'Hermanas'],
  ['bellatrix', 'tonks', 'enemistad', 'Tía y sobrina · la mató'],
  ['bellatrix', 'sirius', 'enemistad', 'Primos · le mató'],
  ['bellatrix', 'neville', 'enemistad', 'Torturó a sus padres'],
  ['bellatrix', 'hermione', 'enemistad', 'La torturó en la Mansión Malfoy'],
  ['bellatrix', 'dobby', 'enemistad', 'Le mató'],
  ['molly', 'bellatrix', 'enemistad', 'Duelo final'],
  ['narcissa', 'harry', 'lealtad', 'Le salvó con una mentira'],
  ['draco', 'harry', 'enemistad', 'Rivales escolares'],
  ['lucius', 'dobby', 'lealtad', 'Antiguo amo'],
  ['lucius', 'ginny', 'enemistad', 'Le entregó el diario de Ryddle'],
  ['lucius', 'arthur', 'enemistad', 'Enemistad familiar'],
  ['voldemort', 'ginny', 'enemistad', 'La poseyó a través del diario'],
  ['pettigrew', 'cedric', 'enemistad', 'Le asesinó'],
  ['crouchjr', 'moody', 'enemistad', 'Le suplantó'],
  ['crouchjr', 'harry', 'enemistad', 'Le entregó a Voldemort'],
  ['quirrell', 'harry', 'enemistad', 'Intentó matarle'],
  ['neville', 'voldemort', 'enemistad', 'Mató a Nagini'],
  ['ollivander', 'voldemort', 'enemistad', 'Su prisionero'],

  // Ministerio y otros
  ['umbridge', 'harry', 'enemistad', 'Castigos con la pluma de sangre'],
  ['umbridge', 'fudge', 'lealtad', 'Subsecretaria'],
  ['umbridge', 'trelawney', 'enemistad', 'La despidió'],
  ['filch', 'umbridge', 'lealtad', 'Aliados'],
  ['percy', 'fudge', 'lealtad', 'Asistente personal'],
  ['lockhart', 'harry', 'enemistad', 'Intentó borrarles la memoria'],
  ['rita', 'harry', 'enemistad', 'Artículos difamatorios'],
  ['rita', 'hermione', 'enemistad', 'Hermione la desenmascaró'],
  ['kreacher', 'sirius', 'lealtad', 'Elfo de los Black'],
  ['kreacher', 'harry', 'lealtad', 'Su nuevo amo'],
  ['griphook', 'harry', 'lealtad', 'Pacto por la espada'],
  ['aberforth', 'dobby', 'lealtad', 'Le envió al rescate'],
  ['fleur', 'krum', 'amistad', 'Campeones del Torneo'],
  ['cedric', 'fleur', 'amistad', 'Campeones del Torneo']
];

/* Personal de Hogwarts adicional */
PERSONAJES.push({
  id: 'lockhart', nombre: 'Gilderoy Lockhart', nombreCompleto: 'Gilderoy Lockhart', apodo: 'El impostor encantador',
  actor: 'Kenneth Branagh', wiki: 'Kenneth_Branagh',
  casa: 'ravenclaw', importancia: 'reparto', grupos: ['hogwarts'],
  nacimiento: '26 de enero de 1964', muerte: null, sangre: 'Mestizo', patronus: 'No sabe conjurarlo',
  varita: 'Cerezo, fibra de corazón de dragón, 23 cm', ocupacion: 'Autor de éxito y profesor de Defensa',
  rasgos: ['Vanidoso', 'Fraude', 'Encantador', 'Cobarde'],
  resumen: 'Escritor famoso y profesor de Defensa que se atribuía las hazañas de otros magos.',
  historia: [
    'Lockhart ganó cinco veces el premio a la sonrisa más encantadora de la revista Corazón de Bruja. Su único talento real eran los encantamientos desmemorizantes: borraba la memoria a los verdaderos héroes y publicaba sus hazañas como propias.',
    'Como profesor de Defensa en 1992 demostró su incompetencia liberando duendecillos de Cornualles en clase. Al intentar borrar la memoria de Harry y Ron en la Cámara de los Secretos usó la varita rota de Ron: el hechizo rebotó y perdió la memoria para siempre.'
  ],
  momentos: [
    { ano: '1992', texto: 'Profesor de Defensa en Hogwarts.' },
    { ano: '1993', texto: 'Pierde la memoria por su propio hechizo.' }
  ]
});

/* ============================ CRONOLOGÍA ============================ */
const CRONOLOGIA = [
  { ano: '1899', titulo: 'La tragedia de los Dumbledore', texto: 'Un duelo entre Albus, Aberforth y Gellert Grindelwald termina con la muerte de Ariana Dumbledore.', personajes: ['dumbledore', 'aberforth', 'grindelwald'], icono: 'bi-hourglass-split' },
  { ano: '1943', titulo: 'Se abre la Cámara de los Secretos', texto: 'Tom Ryddle libera al basilisco, crea su primer horrocrux con el diario y culpa a Hagrid, que es expulsado.', personajes: ['voldemort', 'hagrid', 'dumbledore', 'slughorn'], icono: 'bi-door-closed' },
  { ano: '1945', titulo: 'Caída de Grindelwald', texto: 'Dumbledore derrota a Grindelwald en un duelo legendario y se convierte en el dueño de la Varita de Saúco.', personajes: ['dumbledore', 'grindelwald'], icono: 'bi-magic' },
  { ano: '1971', titulo: 'Los Merodeadores llegan a Hogwarts', texto: 'James, Sirius, Remus y Peter se conocen en Gryffindor. Lily y Severus son separados por el Sombrero.', personajes: ['james', 'sirius', 'lupin', 'pettigrew', 'lily', 'snape'], icono: 'bi-map' },
  { ano: '1980', titulo: 'La profecía', texto: 'En Cabeza de Puerco, Trelawney anuncia el nacimiento de quien podrá vencer al Señor Tenebroso. Snape informa a Voldemort.', personajes: ['trelawney', 'dumbledore', 'snape', 'voldemort'], icono: 'bi-eye' },
  { ano: '1981', titulo: 'Valle de Godric', texto: 'Traicionados por Pettigrew, James y Lily mueren. La maldición rebota en Harry y Voldemort pierde su cuerpo.', personajes: ['james', 'lily', 'harry', 'voldemort', 'pettigrew', 'hagrid', 'sirius'], icono: 'bi-lightning-charge-fill' },
  { ano: '1991', titulo: 'La Piedra Filosofal', texto: 'Harry entra en Hogwarts, conoce a Ron y Hermione y frustra el plan de Quirrell para robar la piedra.', personajes: ['harry', 'ron', 'hermione', 'quirrell', 'hagrid', 'neville', 'draco'], icono: 'bi-gem' },
  { ano: '1992', titulo: 'La Cámara de los Secretos', texto: 'El diario de Ryddle posee a Ginny. Harry mata al basilisco con la espada de Gryffindor y libera a Dobby.', personajes: ['harry', 'ginny', 'lockhart', 'lucius', 'dobby', 'ron', 'voldemort'], icono: 'bi-journal-bookmark' },
  { ano: '1993', titulo: 'El prisionero de Azkaban', texto: 'Sirius escapa de Azkaban. En la Casa de los Gritos se descubre que el traidor era Pettigrew.', personajes: ['sirius', 'lupin', 'pettigrew', 'harry', 'hermione', 'snape'], icono: 'bi-moon-stars' },
  { ano: '1994', titulo: 'El Cáliz de Fuego', texto: 'Harry es elegido cuarto campeón del Torneo. En el cementerio, Voldemort recupera su cuerpo y Cedric muere.', personajes: ['harry', 'cedric', 'fleur', 'krum', 'crouchjr', 'pettigrew', 'voldemort', 'rita'], icono: 'bi-trophy' },
  { ano: '1995', titulo: 'La Orden del Fénix', texto: 'Umbridge toma Hogwarts. Nace el Ejército de Dumbledore y Sirius muere en el Departamento de Misterios.', personajes: ['umbridge', 'luna', 'neville', 'ginny', 'cho', 'sirius', 'bellatrix', 'fudge'], icono: 'bi-fire' },
  { ano: '1996', titulo: 'El Príncipe Mestizo', texto: 'Dumbledore revela los horrocruxes. Draco repara el Armario Evanescente y Snape mata a Dumbledore en la Torre.', personajes: ['dumbledore', 'slughorn', 'draco', 'snape', 'narcissa', 'lavender', 'bill'], icono: 'bi-book-half' },
  { ano: '1997', titulo: 'Los Siete Potter y la caída del Ministerio', texto: 'Moody muere en la huida de Privet Drive. El Ministerio cae durante la boda de Bill y Fleur y el trío huye.', personajes: ['moody', 'george', 'harry', 'bill', 'fleur', 'kingsley', 'umbridge'], icono: 'bi-people' },
  { ano: '1998', titulo: 'Mansión Malfoy y Gringotts', texto: 'Dobby rescata a los prisioneros y muere. El trío asalta Gringotts a lomos de un dragón.', personajes: ['dobby', 'bellatrix', 'hermione', 'griphook', 'ollivander', 'luna', 'pettigrew'], icono: 'bi-bank' },
  { ano: '2 mayo 1998', titulo: 'La Batalla de Hogwarts', texto: 'Caen Fred, Lupin, Tonks y Snape. Neville mata a Nagini, Molly derrota a Bellatrix y Harry vence a Voldemort.', personajes: ['harry', 'voldemort', 'neville', 'molly', 'bellatrix', 'snape', 'fred', 'lupin', 'tonks', 'mcgonagall', 'narcissa'], icono: 'bi-stars' },
  { ano: '2017', titulo: 'Diecinueve años después', texto: 'En el andén 9¾, Harry y Ginny despiden a Albus Severus, junto a Ron, Hermione y un Draco adulto.', personajes: ['harry', 'ginny', 'ron', 'hermione', 'draco'], icono: 'bi-train-front' }
];

/* ============================ TRÁILERES DE FONDO ============================
   Vídeos oficiales de YouTube (se reproducen silenciados y translúcidos). */
const VIDEOS_FONDO = [
  { id: 'mObK5XD8udk', titulo: 'Las Reliquias de la Muerte · Parte 2' },
  { id: 'tAiy66Xrsz4', titulo: 'El misterio del Príncipe' },
  { id: 'Su1LOpjvdZ4', titulo: 'Las Reliquias de la Muerte' },
  { id: 'VyHV0BRtdxo', titulo: 'La piedra filosofal' },
  { id: 'MxqsmsA8y5k', titulo: 'Las Reliquias de la Muerte · Parte 1' }
];

/* ============================ BANDA SONORA (BSO) ============================
   Temas oficiales publicados en YouTube por WaterTower Music (sello de la BSO). */
const BSO = [
  { id: 'pMHCp0sg7gg', titulo: "Hedwig's Theme", autor: 'John Williams', pelicula: 'La piedra filosofal' },
  { id: 'fu_Rqd4fLSE', titulo: "Harry's Wondrous World", autor: 'John Williams', pelicula: 'La piedra filosofal' },
  { id: 'X7YLpHFFW64', titulo: 'Double Trouble', autor: 'John Williams', pelicula: 'El prisionero de Azkaban' },
  { id: 'pDPi_qYOtQI', titulo: 'In Noctem', autor: 'Nicholas Hooper', pelicula: 'El misterio del Príncipe' },
  { id: 'tLLhaXzE3Ho', titulo: 'Obliviate', autor: 'Alexandre Desplat', pelicula: 'Las Reliquias de la Muerte · Parte 1' },
  { id: 'admHlFY4ecI', titulo: 'The Deathly Hallows', autor: 'Alexandre Desplat', pelicula: 'Las Reliquias de la Muerte · Parte 1' },
  { id: 'PPogqE-0QBk', titulo: "Lily's Theme", autor: 'Alexandre Desplat', pelicula: 'Las Reliquias de la Muerte · Parte 2' },
  { id: 'r3cmADRAPRU', titulo: 'Statues', autor: 'Alexandre Desplat', pelicula: 'Las Reliquias de la Muerte · Parte 2' },
  { id: '7JepiN_Ub1M', titulo: 'Courtyard Apocalypse', autor: 'Alexandre Desplat', pelicula: 'Las Reliquias de la Muerte · Parte 2' },
  { id: 'PmQ1XTWg74M', titulo: 'Leaving Hogwarts', autor: 'John Williams', pelicula: 'La piedra filosofal' }
];


/* ============================ RETRATOS DE PELÍCULA ============================
   Página (o archivo) de la Harry Potter Wiki de Fandom de donde se toma la imagen
   del personaje tal y como aparece en las películas. */
const FOTOS_PELICULA = {
  harry: 'Harry Potter',
  hermione: 'Hermione Granger',
  ron: 'Ronald Weasley',
  dumbledore: 'Albus Dumbledore',
  snape: 'Severus Snape',
  mcgonagall: 'Minerva McGonagall',
  hagrid: 'Rubeus Hagrid',
  lupin: 'Remus Lupin',
  slughorn: 'Horace Slughorn',
  flitwick: 'Filius Flitwick',
  trelawney: 'Sybill Trelawney',
  sprout: 'Pomona Sprout',
  filch: 'Argus Filch',
  draco: 'Draco Malfoy',
  neville: 'Neville Longbottom',
  luna: 'Luna Lovegood',
  cedric: 'Cedric Diggory',
  cho: 'Cho Chang',
  lavender: 'Lavender Brown',
  ginny: 'Ginevra Weasley',
  fred: 'Fred Weasley',
  george: 'George Weasley',
  arthur: 'Arthur Weasley',
  molly: 'Molly Weasley',
  percy: 'Percy Weasley',
  bill: 'William Weasley',
  james: 'James Potter I',
  lily: 'Lily J. Potter',
  sirius: 'Sirius Black',
  pettigrew: 'Peter Pettigrew',
  tonks: 'Nymphadora Tonks',
  moody: 'Alastor Moody',
  kingsley: 'Kingsley Shacklebolt',
  aberforth: 'Aberforth Dumbledore',
  voldemort: 'Tom Riddle',
  bellatrix: 'Bellatrix Lestrange',
  lucius: 'Lucius Malfoy',
  narcissa: 'Narcissa Malfoy',
  crouchjr: 'Bartemius Crouch Junior',
  greyback: 'Fenrir Greyback',
  quirrell: 'Quirinus Quirrell',
  umbridge: 'Dolores Umbridge',
  fudge: 'Cornelius Fudge',
  rita: 'Rita Skeeter',
  fleur: 'Fleur Delacour',
  krum: 'Viktor Krum',
  grindelwald: 'File:GellertDH.jpg',
  ollivander: 'Garrick Ollivander',
  dobby: 'Dobby',
  kreacher: 'File:Kreacher_OOTP.jpg',
  griphook: 'Griphook',
  vernon: 'Vernon Dursley',
  petunia: 'Petunia Dursley',
  dudley: 'Dudley Dursley',
  lockhart: 'Gilderoy Lockhart'
};

/* ============================ FRASE DEL MAPA DEL MERODEADOR ============================
   Orden de reproducción al abrir el mapa:
   1) El audio doblado que el usuario cargue desde el propio mapa (botón del micrófono).
   2) Un archivo del doblaje en AUDIO_LOCAL (si lo copias en esa ruta del proyecto).
   3) Voz en castellano del navegador.
   4) Clip oficial de la película en inglés (canal Harry Potter), solo si usarClipOriginal = true.
   No hay publicada en canales oficiales una escena doblada al castellano con esta frase. */
const CLIP_FRASE = {
  texto: 'Juro solemnemente que mis intenciones no son buenas',
  cierre: 'Travesura realizada',
  AUDIO_LOCAL: 'assets/audio/juro-solemnemente.mp3',
  usarClipOriginal: false,
  videoId: 'vNc43oKqQzg',
  inicio: 63.4,
  fin: 68.4
};
