require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Fiesta = require('../models/Fiesta');
const Publication = require('../models/Publication');

const usersData = [
  {
    username: 'mariafiestas',
    email: 'maria@aquihayfiesta.es',
    password: 'Prueba123',
    country: 'Espana',
    city: 'Valencia',
  },
  {
    username: 'javi_eventos',
    email: 'javi@aquihayfiesta.es',
    password: 'Prueba123',
    country: 'Espana',
    city: 'Sevilla',
  },
  {
    username: 'lucia_media',
    email: 'lucia@aquihayfiesta.es',
    password: 'Prueba123',
    country: 'Espana',
    city: 'A Coruna',
  },
];

const fiestaBase = [
  ['san-valentin', 'San Valentin', 'amor', 'Madrid'],
  ['nochevieja-puerta-sol', 'Nochevieja en Puerta del Sol', 'noche', 'Madrid'],
  ['carnaval-cadiz', 'Carnaval de Cadiz', 'disfraces', 'Cadiz'],
  ['feria-abril-sevilla', 'Feria de Abril', 'familia', 'Sevilla'],
  ['sonar-barcelona', 'Sónar Barcelona', 'musica', 'Barcelona'],
  ['ruta-tapas-leon', 'Ruta de Tapas de Leon', 'gastronomia', 'Leon'],
  ['hogueras-alicante', 'Hogueras de San Juan', 'familia', 'Alicante'],
  ['fallas-valencia', 'Fallas de Valencia', 'familia', 'Valencia'],
  ['la-tomatina-bunol', 'La Tomatina', 'disfraces', 'Bunol'],
  ['romeria-rocio', 'Romeria del Rocio', 'familia', 'Huelva'],
  ['festival-ortigueira', 'Festival de Ortigueira', 'musica', 'Ortigueira'],
  ['fiesta-marisco-o-grove', 'Fiesta del Marisco', 'gastronomia', 'O Grove'],
  ['ibiza-closing-party', 'Ibiza Closing Party', 'noche', 'Ibiza'],
  ['moros-cristianos-alcoy', 'Moros y Cristianos', 'disfraces', 'Alcoy'],
  ['festival-jazz-vitoria', 'Festival de Jazz', 'musica', 'Vitoria'],
  ['calçotada-valls', 'Calçotada Popular', 'gastronomia', 'Valls'],
  ['dia-amigos', 'Dia de la Amistad', 'amor', 'Granada'],
  ['noche-blanca-malaga', 'Noche en Blanco', 'noche', 'Malaga'],
  ['samaín-galicia', 'Samain Galicia', 'disfraces', 'Santiago de Compostela'],
  ['fiesta-paella-sueca', 'Fiesta de la Paella', 'gastronomia', 'Sueca'],
];

const createFiestas = (users) =>
  fiestaBase.map(([slug, title, category, city], index) => ({
    slug,
    title,
    description: `${title} es una celebracion popular con actividades culturales y contenido multimedia colaborativo.`,
    category,
    subcategories: ['Tradicion', 'Comunidad'],
    startDate: new Date(2026, index % 12, (index % 27) + 1),
    endDate: new Date(2026, index % 12, (index % 27) + 2),
    location: {
      city,
      country: 'Espana',
      address: '',
    },
    coverImage: '',
    views: 100 + index * 25,
    featured: index < 4,
    upcoming: index % 2 === 0,
    createdBy: users[index % users.length]._id,
  }));

async function seed() {
  try {
    await connectDB();

    await Publication.deleteMany({});
    await Fiesta.deleteMany({});
    await User.deleteMany({});

    const users = await User.insertMany(usersData);
    const fiestas = await Fiesta.insertMany(createFiestas(users));

    users[0].savedFiestas = [fiestas[0]._id, fiestas[1]._id, fiestas[2]._id];
    users[1].savedFiestas = [fiestas[3]._id, fiestas[4]._id];
    users[2].savedFiestas = [fiestas[5]._id];

    users[0].downloadHistory = [
      { filename: 'guia-san-valentin.pdf' },
      { filename: 'receta-feria-abril.mp4' },
    ];

    await Promise.all(users.map((user) => user.save()));

    console.log('Seed completado correctamente.');
    console.log(`Usuarios creados: ${users.length}`);
    console.log(`Fiestas creadas: ${fiestas.length}`);
    console.log('Credencial ejemplo: maria@aquihayfiesta.es / Prueba123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error ejecutando seed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
