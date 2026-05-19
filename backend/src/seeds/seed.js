require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Fiesta = require('../models/Fiesta');
const Publication = require('../models/Publication');

const cloudinaryImage = 'https://res.cloudinary.com/dmqkrgprk/image/upload/v1778102145/aquihayfiesta_ua/file-1778102145476.jpg';


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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
    coverImage: cloudinaryImage,
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
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'fotos-san-valentin.jpg',
      username: 'silvia',
    },
    {
      fiestaSlug: 'halloween',
      title: 'Video de disfraces y maquillaje',
      description: 'Tutorial audiovisual de maquillaje de terror y vestuario.',
      contentType: 'video',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'video-halloween.mp4',
      username: 'david',
    },
    {
      fiestaSlug: 'navidad',
      title: 'Recetas navidenas en PDF',
      description: 'Documento con recetas de entrantes, platos principales y postres.',
      contentType: 'document',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'recetas-navidad.pdf',
      username: 'ana',
    },
    {
      fiestaSlug: 'semana-santa',
      title: 'Poemas de Semana Santa',
      description: 'Recopilacion de poemas y textos de tradicion popular.',
      contentType: 'document',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'poemas-semana-santa.pdf',
      username: 'laura',
    },
    {
      fiestaSlug: 'feria-de-sevilla',
      title: 'Lista de sevillanas y rumbas',
      description: 'Audio con musica para ambientar la feria.',
      contentType: 'audio',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'musica-feria.mp3',
      username: 'javier',
    },
    {
      fiestaSlug: 'carnaval',
      title: 'Fotos de comparsas',
      description: 'Coleccion de imagenes de comparsas y desfiles.',
      contentType: 'image',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'comparsas-carnaval.jpg',
      username: 'paula',
    },
    {
      fiestaSlug: 'dia-del-padre',
      title: 'Video homenaje para el Dia del Padre',
      description: 'Montaje de recuerdos familiares para celebrar el dia.',
      contentType: 'video',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'homenaje-padre.mp4',
      username: 'miguel',
    },
    {
      fiestaSlug: 'dia-de-la-madre',
      title: 'Podcast de mensajes para mama',
      description: 'Audio con dedicatorias y recuerdos de familia.',
      contentType: 'audio',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'podcast-madre.mp3',
      username: 'nuria',
    },
    {
      fiestaSlug: 'nochevieja',
      title: 'Playlist para cotillon',
      description: 'Audio con temas de fiesta para Nochevieja.',
      contentType: 'audio',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'playlist-nochevieja.mp3',
      username: 'carlos',
    },
    {
      fiestaSlug: 'san-fermin',
      title: 'Guia del encierro',
      description: 'Documento con recomendaciones para vivir San Fermin.',
      contentType: 'document',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'guia-san-fermin.pdf',
      username: 'pedro',
    },
    {
      fiestaSlug: 'moros-y-cristianos-albatera',
      title: 'Fotos de escuadras en Albatera',
      description: 'Galeria de escuadras y comparsas de Moros y Cristianos.',
      contentType: 'image',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'moros-cristianos-albatera.jpg',
      username: 'silvia',
    },
    {
      fiestaSlug: 'boda-de-mi-mejor-amiga',
      title: 'Video resumen de la boda',
      description: 'Recopilacion de momentos clave de la ceremonia y la fiesta.',
      contentType: 'video',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'boda-mejor-amiga.mp4',
      username: 'sara',
    },
    {
      fiestaSlug: 'bando-de-la-huerta-murcia',
      title: 'Recetas murcianas tradicionales',
      description: 'Documento con recetas de paparajotes y zarangollo.',
      contentType: 'document',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'recetas-murcia.pdf',
      username: 'carlos',
    },
    {
      fiestaSlug: 'san-valentin',
      title: 'Playlist romantica para cenar',
      description: 'Selección de canciones para una noche especial.',
      contentType: 'audio',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'playlist-romantica.mp3',
      username: 'maria',
    },
    {
      fiestaSlug: 'feria-de-sevilla',
      title: 'Guia de casetas y horarios',
      description: 'Documento práctico para organizar el día en la feria.',
      contentType: 'document',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'guia-feria-sevilla.pdf',
      username: 'elena',
    },
    {
      fiestaSlug: 'halloween',
      title: 'Fotos de decoracion casera',
      description: 'Ideas rápidas para montar una casa del terror.',
      contentType: 'image',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'decoracion-halloween.jpg',
      username: 'diego',
    },
    {
      fiestaSlug: 'nochevieja',
      title: 'Video resumen de campanadas',
      description: 'Momentos destacados para despedir el año.',
      contentType: 'video',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'resumen-campanadas.mp4',
      username: 'lucia',
    },
    {
      fiestaSlug: 'dia-del-padre',
      title: 'Carta para papa en PDF',
      description: 'Plantilla para escribir una dedicatoria especial.',
      contentType: 'document',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'carta-dia-padre.pdf',
      username: 'ana',
    },
    {
      fiestaSlug: 'dia-de-la-madre',
      title: 'Galeria de recuerdos familiares',
      description: 'Album de fotos con momentos en familia.',
      contentType: 'image',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'galeria-dia-madre.jpg',
      username: 'nuria',
    },
    {
      fiestaSlug: 'san-fermin',
      title: 'Audio ambiente de encierro',
      description: 'Sonido ambiente para vivir la fiesta desde casa.',
      contentType: 'audio',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'audio-encierro.mp3',
      username: 'pedro',
    },
    {
      fiestaSlug: 'bando-de-la-huerta-murcia',
      title: 'Fotos de trajes regionales',
      description: 'Colección de imágenes del desfile huertano.',
      contentType: 'image',
      fileUrl: cloudinaryImage,
      thumbnailUrl: cloudinaryImage,
      fileName: 'trajes-huertanos.jpg',
      username: 'carlos',
    },
    {
      fiestaSlug: 'moros-y-cristianos-albatera',
      title: 'Marchas festeras en audio',
      description: 'Selección de marchas para comparsas.',
      contentType: 'audio',
      fileUrl: cloudinaryImage,
      thumbnailUrl: '',
      fileName: 'marchas-festeras.mp3',
      username: 'silvia',
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
    downloads: 5 + index,
  }));
};

async function seed() {
  try {
    await connectDB();

    await Publication.deleteMany({});
    await Fiesta.deleteMany({});
    await User.deleteMany({});

    // Use create() to ensure password hashing middleware runs.
    const admins = await User.create(adminsData);
    const normalUsers = await User.create(normalUsersData);

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
