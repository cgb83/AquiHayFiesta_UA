require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Fiesta = require('../models/Fiesta');
const Publication = require('../models/Publication');

const adminsData = [
  {
    username: 'admin_fiestas',
    email: 'admin.fiestas@aquihayfiesta.es',
    password: 'Admin123',
    country: 'Espana',
    city: 'Madrid',
    role: 'admin',
  },
  {
    username: 'admin_cultura',
    email: 'admin.cultura@aquihayfiesta.es',
    password: 'Admin123',
    country: 'Espana',
    city: 'Sevilla',
    role: 'admin',
  },
];

const normalUsersData = [
  { username: 'silvia', email: 'silvia@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Albatera', role: 'user' },
  { username: 'sara', email: 'sara@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Alicante', role: 'user' },
  { username: 'carlos', email: 'carlos@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Murcia', role: 'user' },
  { username: 'maria', email: 'maria@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Valencia', role: 'user' },
  { username: 'javier', email: 'javier@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Sevilla', role: 'user' },
  { username: 'lucia', email: 'lucia@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'A Coruna', role: 'user' },
  { username: 'pedro', email: 'pedro@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Pamplona', role: 'user' },
  { username: 'ana', email: 'ana@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Madrid', role: 'user' },
  { username: 'david', email: 'david@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Barcelona', role: 'user' },
  { username: 'elena', email: 'elena@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Toledo', role: 'user' },
  { username: 'miguel', email: 'miguel@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Granada', role: 'user' },
  { username: 'laura', email: 'laura@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Bilbao', role: 'user' },
  { username: 'paula', email: 'paula@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Malaga', role: 'user' },
  { username: 'diego', email: 'diego@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Zaragoza', role: 'user' },
  { username: 'nuria', email: 'nuria@aquihayfiesta.es', password: 'Prueba123', country: 'Espana', city: 'Cordoba', role: 'user' },
];

const officialFiestas = [
  {
    slug: 'san-valentin',
    title: 'San Valentin',
    description: 'Celebracion del amor y la amistad con planes romanticos y detalles especiales.',
    category: 'amor',
    subcategories: ['Romance', 'Amistad'],
    startDate: new Date('2026-02-14'),
    endDate: new Date('2026-02-14'),
    location: { city: 'Toda Espana', country: 'Espana', address: '' },
    featured: true,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&q=80',
  },
  {
    slug: 'halloween',
    title: 'Halloween',
    description: 'Noche de disfraces, calabazas y actividades de miedo para todas las edades.',
    category: 'disfraces',
    subcategories: ['Terror', 'Disfraces'],
    startDate: new Date('2026-10-31'),
    endDate: new Date('2026-10-31'),
    location: { city: 'Toda Espana', country: 'Espana', address: '' },
    featured: true,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1477313372947-d68a0b41b454?w=1200&q=80',
  },
  {
    slug: 'navidad',
    title: 'Navidad',
    description: 'Fiestas navidenas con cenas familiares, villancicos y tradiciones populares.',
    category: 'familia',
    subcategories: ['Familia', 'Tradicion'],
    startDate: new Date('2026-12-24'),
    endDate: new Date('2026-12-25'),
    location: { city: 'Toda Espana', country: 'Espana', address: '' },
    featured: true,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1200&q=80',
  },
  {
    slug: 'semana-santa',
    title: 'Semana Santa',
    description: 'Procesiones y actos religiosos durante toda la semana en multiples ciudades.',
    category: 'familia',
    subcategories: ['Tradicion', 'Religiosa'],
    startDate: new Date('2026-03-29'),
    endDate: new Date('2026-04-05'),
    location: { city: 'Sevilla', country: 'Espana', address: '' },
    featured: true,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
  },
  {
    slug: 'feria-de-sevilla',
    title: 'Feria de Sevilla',
    description: 'Casetas, sevillanas y ambiente andaluz en una de las ferias mas famosas de Espana.',
    category: 'musica',
    subcategories: ['Flamenco', 'Tradicion'],
    startDate: new Date('2026-04-19'),
    endDate: new Date('2026-04-25'),
    location: { city: 'Sevilla', country: 'Espana', address: 'Real de la Feria' },
    featured: true,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1549061680-196562585576?w=1200&q=80',
  },
  {
    slug: 'carnaval',
    title: 'Carnaval',
    description: 'Desfiles, disfraces y musica para celebrar el carnaval en todo el pais.',
    category: 'disfraces',
    subcategories: ['Comparsas', 'Desfile'],
    startDate: new Date('2026-02-12'),
    endDate: new Date('2026-02-17'),
    location: { city: 'Cadiz', country: 'Espana', address: '' },
    featured: false,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=80',
  },
  {
    slug: 'dia-del-padre',
    title: 'Dia del Padre',
    description: 'Jornada para homenajear a los padres con planes familiares y regalos.',
    category: 'familia',
    subcategories: ['Familia', 'Homenaje'],
    startDate: new Date('2026-03-19'),
    endDate: new Date('2026-03-19'),
    location: { city: 'Toda Espana', country: 'Espana', address: '' },
    featured: false,
    upcoming: false,
    coverImage: 'https://images.unsplash.com/photo-1472723318973-3fc0d7f6b9a9?w=1200&q=80',
  },
  {
    slug: 'dia-de-la-madre',
    title: 'Dia de la Madre',
    description: 'Celebracion para agradecer y compartir tiempo con las madres.',
    category: 'familia',
    subcategories: ['Familia', 'Celebracion'],
    startDate: new Date('2026-05-03'),
    endDate: new Date('2026-05-03'),
    location: { city: 'Toda Espana', country: 'Espana', address: '' },
    featured: false,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80',
  },
  {
    slug: 'nochevieja',
    title: 'Nochevieja',
    description: 'Despedida del ano con cotillon, campanadas y celebraciones nocturnas.',
    category: 'noche',
    subcategories: ['Campanadas', 'Fiesta'],
    startDate: new Date('2026-12-31'),
    endDate: new Date('2027-01-01'),
    location: { city: 'Madrid', country: 'Espana', address: 'Puerta del Sol' },
    featured: true,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&q=80',
  },
  {
    slug: 'san-fermin',
    title: 'San Fermin',
    description: 'Fiesta popular de Pamplona con encierros, musica y actos tradicionales.',
    category: 'familia',
    subcategories: ['Encierros', 'Tradicion'],
    startDate: new Date('2026-07-07'),
    endDate: new Date('2026-07-14'),
    location: { city: 'Pamplona', country: 'Espana', address: '' },
    featured: true,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=1200&q=80',
  },
];

const buildUserFiestas = (normalUsersByName) => [
  {
    slug: 'moros-y-cristianos-albatera',
    title: 'Moros y Cristianos Albatera',
    description: 'Fiestas locales de Albatera con desfiles, comparsas y actos tradicionales.',
    category: 'disfraces',
    subcategories: ['Desfile', 'Tradicion'],
    startDate: new Date('2026-07-23'),
    endDate: new Date('2026-07-27'),
    location: { city: 'Albatera', country: 'Espana', address: 'Centro urbano' },
    featured: false,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    createdBy: normalUsersByName.silvia._id,
  },
  {
    slug: 'boda-de-mi-mejor-amiga',
    title: 'Boda de mi mejor amiga',
    description: 'Celebracion privada con familia y amistades cercanas.',
    category: 'amor',
    subcategories: ['Boda', 'Celebracion'],
    startDate: new Date('2026-09-12'),
    endDate: new Date('2026-09-12'),
    location: { city: 'Valencia', country: 'Espana', address: 'Finca La Alqueria' },
    featured: false,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    createdBy: normalUsersByName.sara._id,
  },
  {
    slug: 'bando-de-la-huerta-murcia',
    title: 'Bando de la Huerta Murcia',
    description: 'Tradicion murciana con desfile, gastronomia y trajes regionales.',
    category: 'gastronomia',
    subcategories: ['Tradicion', 'Gastronomia'],
    startDate: new Date('2026-04-07'),
    endDate: new Date('2026-04-07'),
    location: { city: 'Murcia', country: 'Espana', address: 'Centro de Murcia' },
    featured: false,
    upcoming: true,
    coverImage: 'https://images.unsplash.com/photo-1464219222984-216ebffaaf85?w=1200&q=80',
    createdBy: normalUsersByName.carlos._id,
  },
];

const buildPublications = (fiestasBySlug, normalUsersByName) => {
  const specs = [
    {
      fiestaSlug: 'san-valentin',
      title: 'Album de fotos romanticas',
      description: 'Galeria con ideas de decoracion y detalles para San Valentin.',
      contentType: 'image',
      fileUrl: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=400&q=80',
      fileName: 'fotos-san-valentin.jpg',
      username: 'silvia',
    },
    {
      fiestaSlug: 'halloween',
      title: 'Video de disfraces y maquillaje',
      description: 'Tutorial audiovisual de maquillaje de terror y vestuario.',
      contentType: 'video',
      fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&q=80',
      fileName: 'video-halloween.mp4',
      username: 'david',
    },
    {
      fiestaSlug: 'navidad',
      title: 'Recetas navidenas en PDF',
      description: 'Documento con recetas de entrantes, platos principales y postres.',
      contentType: 'document',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      thumbnailUrl: '',
      fileName: 'recetas-navidad.pdf',
      username: 'ana',
    },
    {
      fiestaSlug: 'semana-santa',
      title: 'Poemas de Semana Santa',
      description: 'Recopilacion de poemas y textos de tradicion popular.',
      contentType: 'document',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      thumbnailUrl: '',
      fileName: 'poemas-semana-santa.pdf',
      username: 'laura',
    },
    {
      fiestaSlug: 'feria-de-sevilla',
      title: 'Lista de sevillanas y rumbas',
      description: 'Audio con musica para ambientar la feria.',
      contentType: 'audio',
      fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      thumbnailUrl: '',
      fileName: 'musica-feria.mp3',
      username: 'javier',
    },
    {
      fiestaSlug: 'carnaval',
      title: 'Fotos de comparsas',
      description: 'Coleccion de imagenes de comparsas y desfiles.',
      contentType: 'image',
      fileUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80',
      fileName: 'comparsas-carnaval.jpg',
      username: 'paula',
    },
    {
      fiestaSlug: 'dia-del-padre',
      title: 'Video homenaje para el Dia del Padre',
      description: 'Montaje de recuerdos familiares para celebrar el dia.',
      contentType: 'video',
      fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1472723318973-3fc0d7f6b9a9?w=400&q=80',
      fileName: 'homenaje-padre.mp4',
      username: 'miguel',
    },
    {
      fiestaSlug: 'dia-de-la-madre',
      title: 'Podcast de mensajes para mama',
      description: 'Audio con dedicatorias y recuerdos de familia.',
      contentType: 'audio',
      fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      thumbnailUrl: '',
      fileName: 'podcast-madre.mp3',
      username: 'nuria',
    },
    {
      fiestaSlug: 'nochevieja',
      title: 'Playlist para cotillon',
      description: 'Audio con temas de fiesta para Nochevieja.',
      contentType: 'audio',
      fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      thumbnailUrl: '',
      fileName: 'playlist-nochevieja.mp3',
      username: 'carlos',
    },
    {
      fiestaSlug: 'san-fermin',
      title: 'Guia del encierro',
      description: 'Documento con recomendaciones para vivir San Fermin.',
      contentType: 'document',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      thumbnailUrl: '',
      fileName: 'guia-san-fermin.pdf',
      username: 'pedro',
    },
    {
      fiestaSlug: 'moros-y-cristianos-albatera',
      title: 'Fotos de escuadras en Albatera',
      description: 'Galeria de escuadras y comparsas de Moros y Cristianos.',
      contentType: 'image',
      fileUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
      fileName: 'moros-cristianos-albatera.jpg',
      username: 'silvia',
    },
    {
      fiestaSlug: 'boda-de-mi-mejor-amiga',
      title: 'Video resumen de la boda',
      description: 'Recopilacion de momentos clave de la ceremonia y la fiesta.',
      contentType: 'video',
      fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
      fileName: 'boda-mejor-amiga.mp4',
      username: 'sara',
    },
    {
      fiestaSlug: 'bando-de-la-huerta-murcia',
      title: 'Recetas murcianas tradicionales',
      description: 'Documento con recetas de paparajotes y zarangollo.',
      contentType: 'document',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      thumbnailUrl: '',
      fileName: 'recetas-murcia.pdf',
      username: 'carlos',
    },
  ];

  return specs.map((spec, index) => ({
    title: spec.title,
    description: spec.description,
    fiesta: fiestasBySlug[spec.fiestaSlug]._id,
    createdBy: normalUsersByName[spec.username]._id,
    contentType: spec.contentType,
    fileUrl: spec.fileUrl,
    fileName: spec.fileName,
    thumbnailUrl: spec.thumbnailUrl,
    views: 40 + index * 8,
    downloads: 5 + index,
  }));
};

async function seed() {
  try {
    await connectDB();

    await Publication.deleteMany({});
    await Fiesta.deleteMany({});
    await User.deleteMany({});

    const admins = await User.insertMany(adminsData);
    const normalUsers = await User.insertMany(normalUsersData);

    const normalUsersByName = Object.fromEntries(
      normalUsers.map((user) => [user.username, user])
    );

    const officialFiestaDocs = officialFiestas.map((fiesta, index) => ({
      ...fiesta,
      views: 200 + index * 50,
      createdBy: admins[index % admins.length]._id,
    }));

    const userFiestaDocs = buildUserFiestas(normalUsersByName).map((fiesta, index) => ({
      ...fiesta,
      views: 80 + index * 30,
    }));

    const fiestas = await Fiesta.insertMany([...officialFiestaDocs, ...userFiestaDocs]);
    const fiestasBySlug = Object.fromEntries(fiestas.map((fiesta) => [fiesta.slug, fiesta]));

    const publications = await Publication.insertMany(
      buildPublications(fiestasBySlug, normalUsersByName)
    );

    normalUsersByName.silvia.savedFiestas = [
      fiestasBySlug['san-valentin']._id,
      fiestasBySlug['moros-y-cristianos-albatera']._id,
      fiestasBySlug['semana-santa']._id,
    ];

    normalUsersByName.sara.savedFiestas = [
      fiestasBySlug['boda-de-mi-mejor-amiga']._id,
      fiestasBySlug['navidad']._id,
    ];

    normalUsersByName.carlos.savedFiestas = [
      fiestasBySlug['bando-de-la-huerta-murcia']._id,
      fiestasBySlug['nochevieja']._id,
    ];

    normalUsersByName.silvia.downloadHistory = [
      { filename: 'poemas-semana-santa.pdf' },
      { filename: 'moros-cristianos-albatera.jpg' },
    ];

    normalUsersByName.sara.downloadHistory = [
      { filename: 'boda-mejor-amiga.mp4' },
      { filename: 'fotos-san-valentin.jpg' },
    ];

    await Promise.all(normalUsers.map((user) => user.save()));

    console.log('Seed completado correctamente.');
    console.log(`Administradores creados: ${admins.length}`);
    console.log(`Usuarios normales creados: ${normalUsers.length}`);
    console.log(`Fiestas creadas: ${fiestas.length}`);
    console.log(`Publicaciones creadas: ${publications.length}`);
    console.log('Credencial Silvia: silvia@aquihayfiesta.es / Prueba123');
    console.log('Credencial Admin: admin.fiestas@aquihayfiesta.es / Admin123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error ejecutando seed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
