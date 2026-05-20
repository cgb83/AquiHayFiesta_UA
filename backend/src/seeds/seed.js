require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Fiesta = require('../models/Fiesta');
const Publication = require('../models/Publication');

const cloudinaryImage = 'https://res.cloudinary.com/dmqkrgprk/image/upload/v1778102145/aquihayfiesta_ua/file-1778102145476.jpg';
const cloudinaryPdf   = 'https://res.cloudinary.com/dmqkrgprk/raw/upload/v1778106813/aquihayfiesta_ua/file-1778106813257.pdf';
const img = (slug) => `https://picsum.photos/seed/ahf-${slug}/640/360`;

// ── Usuarios ──────────────────────────────────────────────────────────────────

const adminsData = [
  { username: 'admin_fiestas', email: 'admin.fiestas@aquihayfiesta.es', password: 'Admin123', country: 'España', city: 'Madrid',  role: 'admin' },
  { username: 'admin_cultura', email: 'admin.cultura@aquihayfiesta.es', password: 'Admin123', country: 'España', city: 'Sevilla', role: 'admin' },
];

const normalUsersData = [
  { username: 'silvia',  email: 'silvia@aquihayfiesta.es',  password: 'Prueba123', country: 'España', city: 'Albatera',   role: 'user' },
  { username: 'sara',    email: 'sara@aquihayfiesta.es',    password: 'Prueba123', country: 'España', city: 'Alicante',   role: 'user' },
  { username: 'carlos',  email: 'carlos@aquihayfiesta.es',  password: 'Prueba123', country: 'España', city: 'Murcia',     role: 'user' },
  { username: 'maria',   email: 'maria@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'Valencia',   role: 'user' },
  { username: 'javier',  email: 'javier@aquihayfiesta.es',  password: 'Prueba123', country: 'España', city: 'Sevilla',    role: 'user' },
  { username: 'lucia',   email: 'lucia@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'A Coruña',   role: 'user' },
  { username: 'pedro',   email: 'pedro@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'Pamplona',   role: 'user' },
  { username: 'ana',     email: 'ana@aquihayfiesta.es',     password: 'Prueba123', country: 'España', city: 'Madrid',     role: 'user' },
  { username: 'david',   email: 'david@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'Barcelona',  role: 'user' },
  { username: 'elena',   email: 'elena@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'Toledo',     role: 'user' },
  { username: 'miguel',  email: 'miguel@aquihayfiesta.es',  password: 'Prueba123', country: 'España', city: 'Granada',    role: 'user' },
  { username: 'laura',   email: 'laura@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'Bilbao',     role: 'user' },
  { username: 'paula',   email: 'paula@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'Málaga',     role: 'user' },
  { username: 'diego',   email: 'diego@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'Zaragoza',   role: 'user' },
  { username: 'nuria',   email: 'nuria@aquihayfiesta.es',   password: 'Prueba123', country: 'España', city: 'Córdoba',    role: 'user' },
];

// ── Fiestas oficiales ─────────────────────────────────────────────────────────
// Referencia de fecha actual: 2026-05-20
// Pasadas: ene-may | Próximas: jun-dic

const officialFiestas = [

  // ── PASADAS ────────────────────────────────────────────────────────────────

  {
    slug: 'san-valentin',
    title: 'San Valentín',
    description: 'El 14 de febrero es San Valentín. Un día dedicado al amor en todas sus formas: en pareja, con amigos, en familia. Algunos regalan flores, otros preparan cenas románticas; muchos simplemente aprovechan para estar con quienes más quieren.',
    category: 'amor', categories: ['amor'],
    subcategories: ['Romance', 'Pareja', 'Amistad'],
    startDate: new Date('2026-02-14'), endDate: new Date('2026-02-14'),
    location: { city: 'Toda España', country: 'España', address: '' },
    featured: true, upcoming: false, views: 4200,
    coverImage: img('san-valentin'),
  },
  {
    slug: 'carnaval-cadiz',
    title: 'Carnaval de Cádiz',
    description: 'El Carnaval de Cádiz es uno de los más famosos del mundo por su ingenio, sus letras satíricas y su ambiente inigualable. Comparsas, chirigotas y coros se adueñan de las calles durante una semana entera de fiesta y humor.',
    category: 'disfraces', categories: ['disfraces'],
    subcategories: ['Comparsas', 'Chirigotas', 'Desfile'],
    startDate: new Date('2026-02-12'), endDate: new Date('2026-02-17'),
    location: { city: 'Cádiz', country: 'España', address: '' },
    featured: true, upcoming: false, views: 3800,
    coverImage: img('carnaval-cadiz'),
  },
  {
    slug: 'dia-del-padre',
    title: 'Día del Padre',
    description: 'El 19 de marzo se celebra el Día del Padre en España. Una jornada para homenajear a los padres con planes en familia, regalos especiales y momentos que quedan para siempre.',
    category: 'familia', categories: ['familia'],
    subcategories: ['Familia', 'Homenaje'],
    startDate: new Date('2026-03-19'), endDate: new Date('2026-03-19'),
    location: { city: 'Toda España', country: 'España', address: '' },
    featured: false, upcoming: false, views: 1500,
    coverImage: img('dia-del-padre'),
  },
  {
    slug: 'semana-santa-sevilla',
    title: 'Semana Santa de Sevilla',
    description: 'La Semana Santa sevillana es Patrimonio Inmaterial de la Humanidad. Cofradías con siglos de historia recorren las calles entre el silencio y la emoción. Una experiencia que mezcla fe, arte y tradición como ninguna otra en el mundo.',
    category: 'religiosa', categories: ['religiosa', 'familia'],
    subcategories: ['Procesiones', 'Cofradías', 'Tradición'],
    startDate: new Date('2026-03-29'), endDate: new Date('2026-04-05'),
    location: { city: 'Sevilla', country: 'España', address: 'Centro histórico' },
    featured: true, upcoming: false, views: 5100,
    coverImage: img('semana-santa-sevilla'),
  },
  {
    slug: 'bando-de-la-huerta',
    title: 'Bando de la Huerta de Murcia',
    description: 'El Bando de la Huerta es la fiesta grande de Murcia. Miles de personas visten trajes regionales, montan en carros engalanados y disfrutan de la gastronomía murciana en el desfile más multitudinario de la Región.',
    category: 'gastronomia', categories: ['gastronomia', 'familia'],
    subcategories: ['Tradición', 'Trajes Regionales', 'Gastronomía'],
    startDate: new Date('2026-04-07'), endDate: new Date('2026-04-07'),
    location: { city: 'Murcia', country: 'España', address: 'Centro de Murcia' },
    featured: false, upcoming: false, views: 1900,
    coverImage: img('bando-de-la-huerta'),
  },
  {
    slug: 'feria-de-sevilla',
    title: 'Feria de Abril de Sevilla',
    description: 'La Feria de Abril es la fiesta más vistosa de Andalucía. Casetas repletas de gente, sevillanas que suenan sin parar, caballos engalanados y el olor inconfundible de la manzanilla. Una semana donde Sevilla se convierte en la capital del mundo.',
    category: 'musica', categories: ['musica', 'familia'],
    subcategories: ['Sevillanas', 'Flamenco', 'Tradición'],
    startDate: new Date('2026-04-19'), endDate: new Date('2026-04-25'),
    location: { city: 'Sevilla', country: 'España', address: 'Real de la Feria' },
    featured: true, upcoming: false, views: 6300,
    coverImage: img('feria-de-sevilla'),
  },
  {
    slug: 'dia-de-la-madre',
    title: 'Día de la Madre',
    description: 'El primer domingo de mayo se celebra el Día de la Madre. Una ocasión para expresar gratitud, compartir momentos especiales y demostrar cuánto queremos a las madres de nuestra vida.',
    category: 'familia', categories: ['familia'],
    subcategories: ['Familia', 'Celebración'],
    startDate: new Date('2026-05-03'), endDate: new Date('2026-05-03'),
    location: { city: 'Toda España', country: 'España', address: '' },
    featured: false, upcoming: false, views: 1700,
    coverImage: img('dia-de-la-madre'),
  },

  // ── PRÓXIMAS ───────────────────────────────────────────────────────────────

  {
    slug: 'romeria-del-rocio',
    title: 'Romería del Rocío',
    description: 'La Romería del Rocío es la peregrinación más multitudinaria de España. Cada año, miles de hermandades se dirigen a pie, a caballo y en carretas engalanadas hasta la aldea del Rocío para venerar a la Virgen. Una celebración única llena de fe, música y color.',
    category: 'religiosa', categories: ['religiosa'],
    subcategories: ['Peregrinación', 'Hermandades', 'Devoción'],
    startDate: new Date('2026-06-05'), endDate: new Date('2026-06-08'),
    location: { city: 'Almonte', country: 'España', address: 'Aldea del Rocío' },
    featured: true, upcoming: true, views: 3200,
    coverImage: img('romeria-del-rocio'),
  },
  {
    slug: 'networking-emprendedores',
    title: 'Networking de Emprendedores',
    description: 'Una tarde de networking para emprendedores y profesionales del sector tecnológico y creativo. Ponencias cortas, ronda de presentaciones y cóctel. El mejor plan para hacer contactos antes del verano en el entorno startup de Barcelona.',
    category: 'negocios', categories: ['negocios'],
    subcategories: ['Emprendimiento', 'Startup', 'Networking'],
    startDate: new Date('2026-06-18'), endDate: new Date('2026-06-18'),
    location: { city: 'Barcelona', country: 'España', address: 'Impact Hub Barcelona' },
    featured: false, upcoming: true, views: 310,
    coverImage: img('networking-emprendedores'),
  },
  {
    slug: 'san-juan',
    title: 'Noche de San Juan',
    description: 'La noche del 23 de junio la magia se apodera de las playas y plazas de España. Hogueras, saltos al mar, rituales de buena suerte y música hasta el amanecer marcan una de las noches más especiales del año.',
    category: 'noche', categories: ['noche'],
    subcategories: ['Hogueras', 'Playa', 'Ritual'],
    startDate: new Date('2026-06-23'), endDate: new Date('2026-06-24'),
    location: { city: 'Toda España', country: 'España', address: '' },
    featured: true, upcoming: true, views: 4700,
    coverImage: img('san-juan'),
  },
  {
    slug: 'san-fermin',
    title: 'Sanfermines de Pamplona',
    description: 'Los Sanfermines son la fiesta más internacional de España. Del 7 al 14 de julio, Pamplona vive una semana de encierros, peñas, música y tradición que atrae a visitantes de todo el mundo. El pañuelo rojo y el chupinazo son ya símbolos universales.',
    category: 'familia', categories: ['familia'],
    subcategories: ['Encierros', 'Tradición', 'Peñas'],
    startDate: new Date('2026-07-07'), endDate: new Date('2026-07-14'),
    location: { city: 'Pamplona', country: 'España', address: 'Casco Antiguo' },
    featured: true, upcoming: true, views: 5800,
    coverImage: img('san-fermin'),
  },
  {
    slug: 'festival-infantil-verano',
    title: 'Festival Infantil de Verano',
    description: 'Un festival pensado para los más pequeños, con espectáculos de circo, talleres de manualidades, cuentacuentos y animación. Tres días de risas y actividades familiares para disfrutar del verano en grande.',
    category: 'infantil', categories: ['infantil', 'familia'],
    subcategories: ['Niños', 'Circo', 'Talleres'],
    startDate: new Date('2026-07-15'), endDate: new Date('2026-07-17'),
    location: { city: 'Madrid', country: 'España', address: 'Parque del Retiro' },
    featured: false, upcoming: true, views: 980,
    coverImage: img('festival-infantil-verano'),
  },
  {
    slug: 'festival-cine-san-sebastian',
    title: 'Festival de Cine de San Sebastián',
    description: 'Uno de los festivales de cine más prestigiosos del mundo. La Concha de Oro reúne cada septiembre a directores, actores y amantes del séptimo arte en el marco incomparable de la Bahía de la Concha.',
    category: 'cultural', categories: ['cultural'],
    subcategories: ['Cine', 'Arte', 'Internacional'],
    startDate: new Date('2026-09-18'), endDate: new Date('2026-09-26'),
    location: { city: 'San Sebastián', country: 'España', address: 'Kursaal' },
    featured: true, upcoming: true, views: 2100,
    coverImage: img('festival-cine-san-sebastian'),
  },
  {
    slug: 'salon-gastronomia-madrid',
    title: 'Salón Internacional de Gastronomía',
    description: 'Madrid acoge el mayor encuentro gastronómico de España. Chefs Michelin, productores artesanales, showcookings en directo y degustaciones de todo el territorio nacional hacen de este evento una cita obligatoria para los amantes de la buena cocina.',
    category: 'gastronomia', categories: ['gastronomia'],
    subcategories: ['Alta Cocina', 'Showcooking', 'Vinos'],
    startDate: new Date('2026-09-20'), endDate: new Date('2026-09-22'),
    location: { city: 'Madrid', country: 'España', address: 'IFEMA' },
    featured: false, upcoming: true, views: 1400,
    coverImage: img('salon-gastronomia-madrid'),
  },
  {
    slug: 'maraton-de-madrid',
    title: 'Maratón de Madrid',
    description: 'El Maratón de Madrid es una de las grandes carreras populares de Europa. Miles de atletas de todos los niveles recorren la capital en un trazado que pasa por los monumentos más emblemáticos de Madrid.',
    category: 'deporte', categories: ['deporte'],
    subcategories: ['Running', 'Maratón', 'Atletismo'],
    startDate: new Date('2026-11-01'), endDate: new Date('2026-11-01'),
    location: { city: 'Madrid', country: 'España', address: 'Paseo del Prado' },
    featured: false, upcoming: true, views: 2400,
    coverImage: img('maraton-de-madrid'),
  },
  {
    slug: 'halloween',
    title: 'Halloween',
    description: 'La noche del 31 de octubre la oscuridad se apodera de las calles. Disfraces terroríficos, calabazas iluminadas, dulce o truco para los más pequeños y fiestas de miedo para los mayores. Una celebración que cada año gana más adeptos en España.',
    category: 'disfraces', categories: ['disfraces'],
    subcategories: ['Terror', 'Disfraces', 'Calabazas'],
    startDate: new Date('2026-10-31'), endDate: new Date('2026-10-31'),
    location: { city: 'Toda España', country: 'España', address: '' },
    featured: true, upcoming: true, views: 5500,
    coverImage: img('halloween'),
  },
  {
    slug: 'navidad',
    title: 'Navidad',
    description: 'La Navidad es la fiesta más familiar del año. Cenas con los seres queridos, villancicos, luces por las calles y el espíritu de la generosidad. Una época que despierta ilusión en grandes y pequeños.',
    category: 'familia', categories: ['familia'],
    subcategories: ['Familia', 'Tradición', 'Villancicos'],
    startDate: new Date('2026-12-24'), endDate: new Date('2026-12-25'),
    location: { city: 'Toda España', country: 'España', address: '' },
    featured: true, upcoming: true, views: 7100,
    coverImage: img('navidad'),
  },
  {
    slug: 'nochevieja',
    title: 'Nochevieja',
    description: 'La última noche del año es la más festiva del calendario. Las uvas de la suerte en la Puerta del Sol, el cotillón con amigos, el brindis con cava y los abrazos de medianoche. Una noche para despedir lo vivido y recibir el año que llega con ilusión.',
    category: 'noche', categories: ['noche'],
    subcategories: ['Campanadas', 'Cotillón', 'Fuegos Artificiales'],
    startDate: new Date('2026-12-31'), endDate: new Date('2027-01-01'),
    location: { city: 'Madrid', country: 'España', address: 'Puerta del Sol' },
    featured: true, upcoming: true, views: 8900,
    coverImage: img('nochevieja'),
  },
];

// ── Fiestas de usuarios ───────────────────────────────────────────────────────

const buildUserFiestas = (u) => [
  {
    slug: 'moros-y-cristianos-albatera',
    title: 'Moros y Cristianos de Albatera',
    description: 'Las fiestas patronales de Albatera son uno de los Moros y Cristianos más vistosos de la Vega Baja. Cuatro días de desfiles, dianas, actos de moros y bandas de música llenan las calles de color y emoción.',
    category: 'disfraces', categories: ['disfraces', 'musica'],
    subcategories: ['Comparsas', 'Desfile', 'Tradición'],
    startDate: new Date('2026-07-23'), endDate: new Date('2026-07-27'),
    location: { city: 'Albatera', country: 'España', address: 'Centro urbano' },
    featured: false, upcoming: true, views: 870,
    coverImage: img('moros-y-cristianos-albatera'),
    createdBy: u.silvia._id,
  },
  {
    slug: 'boda-sara-y-marcos',
    title: 'Boda de Sara y Marcos',
    description: 'Sara y Marcos se dan el sí quiero en la Finca La Alquería rodeados de sus familias y amigos más cercanos. Una celebración íntima y llena de detalles que promete ser una noche inolvidable.',
    category: 'bodas', categories: ['bodas', 'amor'],
    subcategories: ['Boda', 'Celebración', 'Finca'],
    startDate: new Date('2026-09-12'), endDate: new Date('2026-09-12'),
    location: { city: 'Valencia', country: 'España', address: 'Finca La Alquería' },
    featured: false, upcoming: true, views: 430,
    coverImage: img('boda-sara-y-marcos'),
    createdBy: u.sara._id,
  },
  {
    slug: 'cumpleanos-infantil-alba',
    title: 'Cumpleaños de Alba',
    description: 'Alba cumple 6 años y lo celebra por todo lo alto con sus amigos del colegio. Castillo hinchable, tarta de unicornio, juegos de agua y bolsas sorpresa. ¡Los peques lo van a pasar en grande!',
    category: 'infantil', categories: ['infantil', 'familia'],
    subcategories: ['Cumpleaños', 'Niños', 'Juegos'],
    startDate: new Date('2026-07-05'), endDate: new Date('2026-07-05'),
    location: { city: 'Valencia', country: 'España', address: '' },
    featured: false, upcoming: true, views: 180,
    coverImage: img('cumpleanos-infantil-alba'),
    createdBy: u.maria._id,
  },
  {
    slug: 'cata-de-vinos-alicante',
    title: 'Cata de Vinos D.O. Alicante',
    description: 'Cata guiada por los mejores vinos de la Denominación de Origen Alicante. Sommeliers profesionales presentarán seis referencias maridadas con productos locales. Aforo limitado a 30 personas.',
    category: 'gastronomia', categories: ['gastronomia'],
    subcategories: ['Vino', 'Cata', 'D.O. Alicante'],
    startDate: new Date('2026-06-27'), endDate: new Date('2026-06-27'),
    location: { city: 'Alicante', country: 'España', address: 'Bodega El Portal' },
    featured: false, upcoming: true, views: 520,
    coverImage: img('cata-de-vinos-alicante'),
    createdBy: u.carlos._id,
  },
];

// ── Publicaciones ─────────────────────────────────────────────────────────────

const buildPublications = (bySlug, u) => {
  const specs = [
    // San Valentín
    { fiestaSlug: 'san-valentin',       username: 'silvia',  contentType: 'image',    title: 'Fotos de decoración romántica',            description: 'Galería con ideas de mesas, velas y detalles para sorprender a tu pareja.',                          fileName: 'decoracion-san-valentin.jpg',      downloads: 34 },
    { fiestaSlug: 'san-valentin',       username: 'maria',   contentType: 'audio',    title: 'Playlist romántica para cenar',            description: 'Selección de canciones para una noche especial a la luz de las velas.',                            fileName: 'playlist-romantica.mp3',           downloads: 21 },
    // Carnaval
    { fiestaSlug: 'carnaval-cadiz',     username: 'paula',   contentType: 'image',    title: 'Fotos de comparsas gaditanas',             description: 'Álbum de las mejores comparsas del Carnaval de Cádiz 2026.',                                        fileName: 'comparsas-cadiz.jpg',              downloads: 19 },
    { fiestaSlug: 'carnaval-cadiz',     username: 'diego',   contentType: 'video',    title: 'Vídeo resumen del Gran Desfile',           description: 'Mejores momentos del Desfile de Comparsas en el estadio Ramón de Carranza.',                         fileName: 'gran-desfile-carnaval.mp4',         downloads: 28 },
    // Día del Padre
    { fiestaSlug: 'dia-del-padre',      username: 'ana',     contentType: 'document', title: 'Carta para papá en PDF',                  description: 'Plantilla descargable para escribir una dedicatoria especial para el Día del Padre.',               fileName: 'carta-dia-padre.pdf',              downloads: 15 },
    { fiestaSlug: 'dia-del-padre',      username: 'miguel',  contentType: 'video',    title: 'Vídeo homenaje para el Día del Padre',    description: 'Montaje de recuerdos familiares para celebrar el día.',                                             fileName: 'homenaje-padre.mp4',               downloads: 11 },
    // Semana Santa
    { fiestaSlug: 'semana-santa-sevilla', username: 'javier', contentType: 'document', title: 'Programa oficial de Semana Santa',      description: 'PDF con itinerarios, horarios y orden de procesiones de todas las hermandades.',                     fileName: 'programa-semana-santa.pdf',         downloads: 47 },
    { fiestaSlug: 'semana-santa-sevilla', username: 'laura',  contentType: 'audio',    title: 'Marchas procesionales clásicas',        description: 'Las marchas más emotivas para ambientar la Semana Santa desde casa.',                               fileName: 'marchas-procesionales.mp3',         downloads: 15 },
    // Bando de la Huerta
    { fiestaSlug: 'bando-de-la-huerta',  username: 'carlos', contentType: 'image',    title: 'Galería de trajes regionales',           description: 'Colección de imágenes con los trajes huertanos más tradicionales del desfile.',                       fileName: 'trajes-huertanos.jpg',              downloads: 12 },
    { fiestaSlug: 'bando-de-la-huerta',  username: 'elena',  contentType: 'document', title: 'Recetas murcianas tradicionales',        description: 'PDF con recetas de paparajotes, zarangollo, pastel de carne y michirones.',                         fileName: 'recetas-murcia.pdf',               downloads: 39 },
    // Feria de Sevilla
    { fiestaSlug: 'feria-de-sevilla',    username: 'javier', contentType: 'audio',    title: 'Las mejores sevillanas de la feria',     description: 'Recopilación de sevillanas y rumbas para bailar en la caseta.',                                      fileName: 'sevillanas-feria.mp3',              downloads: 62 },
    { fiestaSlug: 'feria-de-sevilla',    username: 'elena',  contentType: 'document', title: 'Guía de casetas y horarios',             description: 'Mapa de casetas, horarios de apertura y consejos de visita.',                                        fileName: 'guia-feria-sevilla.pdf',            downloads: 33 },
    // Día de la Madre
    { fiestaSlug: 'dia-de-la-madre',     username: 'nuria',  contentType: 'image',    title: 'Galería de recuerdos familiares',        description: 'Álbum de fotos con momentos en familia para el Día de la Madre.',                                    fileName: 'galeria-dia-madre.jpg',             downloads: 24 },
    { fiestaSlug: 'dia-de-la-madre',     username: 'ana',    contentType: 'audio',    title: 'Podcast de mensajes para mamá',          description: 'Audio con dedicatorias y recuerdos de familia.',                                                    fileName: 'podcast-madre.mp3',                downloads: 18 },
    // Romería del Rocío
    { fiestaSlug: 'romeria-del-rocio',   username: 'nuria',  contentType: 'document', title: 'Guía de hermandades y ruta',            description: 'Listado de hermandades participantes, rutas de camino y consejos prácticos.',                         fileName: 'guia-romeria-rocio.pdf',            downloads: 24 },
    // Networking
    { fiestaSlug: 'networking-emprendedores', username: 'david', contentType: 'document', title: 'Agenda y lista de ponentes',        description: 'Programa completo con horarios, ponentes confirmados y descripción de cada charla.',                  fileName: 'agenda-networking.pdf',             downloads: 14 },
    // San Juan
    { fiestaSlug: 'san-juan',            username: 'lucia',  contentType: 'image',    title: 'Fotos de hogueras en la playa',          description: 'Álbum de las mejores hogueras de San Juan en playas del norte y levante.',                          fileName: 'hogueras-san-juan.jpg',             downloads: 41 },
    { fiestaSlug: 'san-juan',            username: 'ana',    contentType: 'audio',    title: 'Música para la noche de San Juan',       description: 'Playlist especial para celebrar la noche más corta del año.',                                       fileName: 'playlist-san-juan.mp3',             downloads: 17 },
    // San Fermín
    { fiestaSlug: 'san-fermin',          username: 'pedro',  contentType: 'document', title: 'Guía completa del visitante',            description: 'Todo lo que necesitas saber: encierros, peñas, alojamiento, transporte y más.',                     fileName: 'guia-san-fermin.pdf',               downloads: 58 },
    { fiestaSlug: 'san-fermin',          username: 'miguel', contentType: 'audio',    title: 'Ambiente del encierro',                  description: 'Audio real del encierro para revivir la emoción desde casa.',                                        fileName: 'audio-encierro.mp3',               downloads: 22 },
    // Festival Infantil
    { fiestaSlug: 'festival-infantil-verano', username: 'maria', contentType: 'image', title: 'Actividades para niños en verano',     description: 'Ideas y fotos de talleres, juegos de agua y manualidades para el verano.',                            fileName: 'actividades-infantiles.jpg',        downloads: 9 },
    // Festival de Cine
    { fiestaSlug: 'festival-cine-san-sebastian', username: 'david', contentType: 'document', title: 'Catálogo de películas a concurso', description: 'Selección oficial de largometrajes, documentales y cortometrajes en competición.',              fileName: 'catalogo-cine-donosti.pdf',          downloads: 31 },
    // Salón Gastronomía
    { fiestaSlug: 'salon-gastronomia-madrid', username: 'carlos', contentType: 'document', title: 'Programa de showcookings',           description: 'Horario completo de demostraciones culinarias con chefs estrella Michelin.',                         fileName: 'programa-showcookings.pdf',         downloads: 27 },
    // Maratón
    { fiestaSlug: 'maraton-de-madrid',   username: 'diego',  contentType: 'document', title: 'Recorrido oficial y avituallamiento',   description: 'Mapa del trazado, puntos de avituallamiento y consejos de entrenamiento.',                           fileName: 'recorrido-maraton-madrid.pdf',      downloads: 45 },
    { fiestaSlug: 'maraton-de-madrid',   username: 'ana',    contentType: 'image',    title: 'Fotos de la edición anterior',           description: 'Galería de la pasada edición para inspirarse de cara a la 2026.',                                   fileName: 'fotos-maraton.jpg',                downloads: 18 },
    // Halloween
    { fiestaSlug: 'halloween',           username: 'diego',  contentType: 'image',    title: 'Ideas de disfraces y decoración',        description: 'Fotos e ideas para el disfraz y decoración más terrorífica del barrio.',                            fileName: 'disfraces-halloween.jpg',           downloads: 76 },
    { fiestaSlug: 'halloween',           username: 'laura',  contentType: 'audio',    title: 'Banda sonora de terror',                 description: 'Temas y efectos de sonido para ambientar tu fiesta de Halloween.',                                   fileName: 'bso-terror-halloween.mp3',          downloads: 53 },
    // Navidad
    { fiestaSlug: 'navidad',             username: 'ana',    contentType: 'document', title: 'Menú completo de Navidad con recetas',  description: 'PDF con recetas de entrantes, platos principales, postres y bebidas para las cenas navideñas.',     fileName: 'menu-navidad.pdf',                  downloads: 91 },
    { fiestaSlug: 'navidad',             username: 'silvia', contentType: 'audio',    title: 'Villancicos tradicionales españoles',   description: 'Los villancicos más queridos para cantar en familia estas Navidades.',                              fileName: 'villancicos-espanoles.mp3',         downloads: 44 },
    // Nochevieja
    { fiestaSlug: 'nochevieja',          username: 'carlos', contentType: 'audio',    title: 'Playlist para el cotillón',             description: 'Temas de fiesta para bailar toda la noche y recibir el año nuevo con energía.',                      fileName: 'playlist-cotillon.mp3',             downloads: 88 },
    { fiestaSlug: 'nochevieja',          username: 'lucia',  contentType: 'video',    title: 'Vídeo resumen de campanadas',           description: 'Los mejores momentos de las campanadas del año pasado para entrar en ambiente.',                      fileName: 'campanadas.mp4',                   downloads: 67 },
    // Moros y Cristianos
    { fiestaSlug: 'moros-y-cristianos-albatera', username: 'silvia', contentType: 'image', title: 'Fotos de escuadras y comparsas', description: 'Galería de las principales escuadras de Moros y Cristianos de Albatera.',                           fileName: 'moros-cristianos-albatera.jpg',    downloads: 16 },
    { fiestaSlug: 'moros-y-cristianos-albatera', username: 'silvia', contentType: 'audio', title: 'Marchas festeras de Albatera',   description: 'Selección de marchas de la Unión Musical de Albatera para los desfiles.',                           fileName: 'marchas-festeras-albatera.mp3',    downloads: 11 },
    // Boda
    { fiestaSlug: 'boda-sara-y-marcos',  username: 'sara',   contentType: 'video',    title: 'Vídeo de la ceremonia',               description: 'Resumen de los momentos más emotivos de la ceremonia y el banquete.',                                fileName: 'boda-sara-marcos.mp4',              downloads: 8 },
    // Cata de vinos
    { fiestaSlug: 'cata-de-vinos-alicante', username: 'carlos', contentType: 'document', title: 'Ficha técnica de los vinos',      description: 'Descripción de las seis referencias, bodega, variedad, maridaje y puntuación.',                       fileName: 'fichas-vinos-alicante.pdf',         downloads: 19 },
  ];

  return specs.map((spec) => {
    const isImage = spec.contentType === 'image' || spec.contentType === 'video';
    return {
      title:        spec.title,
      description:  spec.description,
      fiesta:       bySlug[spec.fiestaSlug]._id,
      createdBy:    u[spec.username]._id,
      contentType:  spec.contentType,
      fileUrl:      spec.contentType === 'document' ? cloudinaryPdf : cloudinaryImage,
      fileName:     spec.fileName,
      thumbnailUrl: isImage ? cloudinaryImage : '',
      downloads:    spec.downloads,
    };
  });
};

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await connectDB();

    await Publication.deleteMany({});
    await Fiesta.deleteMany({});
    await User.deleteMany({});

    // create() para que el middleware de hash de contraseña se ejecute
    const admins      = await User.create(adminsData);
    const normalUsers = await User.create(normalUsersData);
    const u = Object.fromEntries(normalUsers.map((user) => [user.username, user]));

    const officialDocs = officialFiestas.map((fiesta, i) => ({
      ...fiesta,
      createdBy: admins[i % admins.length]._id,
    }));
    const userDocs = buildUserFiestas(u);

    // insertMany no dispara pre('save') → los slugs están definidos manualmente arriba
    const fiestas = await Fiesta.insertMany([...officialDocs, ...userDocs]);
    const bySlug  = Object.fromEntries(fiestas.map((f) => [f.slug, f]));

    await Publication.insertMany(buildPublications(bySlug, u));

    // Fiestas guardadas
    u.silvia.savedFiestas  = [bySlug['san-valentin']._id, bySlug['moros-y-cristianos-albatera']._id, bySlug['semana-santa-sevilla']._id, bySlug['nochevieja']._id];
    u.sara.savedFiestas    = [bySlug['boda-sara-y-marcos']._id, bySlug['navidad']._id];
    u.carlos.savedFiestas  = [bySlug['cata-de-vinos-alicante']._id, bySlug['salon-gastronomia-madrid']._id];
    u.pedro.savedFiestas   = [bySlug['san-fermin']._id];
    u.javier.savedFiestas  = [bySlug['feria-de-sevilla']._id];

    // Historial de descargas
    u.silvia.downloadHistory = [
      { filename: 'programa-semana-santa.pdf' },
      { filename: 'moros-cristianos-albatera.jpg' },
      { filename: 'villancicos-espanoles.mp3' },
    ];
    u.sara.downloadHistory = [
      { filename: 'boda-sara-marcos.mp4' },
      { filename: 'decoracion-san-valentin.jpg' },
    ];

    await Promise.all(normalUsers.map((user) => user.save()));

    const cats = [...new Set([...officialFiestas, ...userDocs].flatMap(f => f.categories))].sort();
    console.log('\n✓ Seed completado');
    console.log(`  Admins:       ${admins.length}`);
    console.log(`  Usuarios:     ${normalUsers.length}`);
    console.log(`  Fiestas:      ${fiestas.length} (${officialDocs.length} oficiales + ${userDocs.length} de usuarios)`);
    console.log(`  Categorías:   ${cats.join(', ')}`);
    console.log('\n  Credenciales:');
    console.log('    silvia@aquihayfiesta.es            / Prueba123  (usuario)');
    console.log('    admin.fiestas@aquihayfiesta.es     / Admin123   (admin)\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error ejecutando seed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
