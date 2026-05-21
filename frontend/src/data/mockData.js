// ── Categories ──────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'amor',      label: 'Amor' },
  { id: 'noche',     label: 'Noche' },
  { id: 'disfraces', label: 'Disfraces' },
  { id: 'familia',   label: 'Familia' },
  { id: 'musica',    label: 'Música' },
  { id: 'gastronomia', label: 'Gastronomía' },
  { id: 'deporte',   label: 'Deporte' },
  { id: 'infantil',  label: 'Infantil' },
  { id: 'bodas',     label: 'Bodas' },
  { id: 'negocios',  label: 'Negocios' },
  { id: 'cultural',  label: 'Cultural' },
  { id: 'religiosa', label: 'Religiosa' },
];

// ── Fiestas ──────────────────────────────────────────────────────
export const FIESTAS = [
  {
    id: 1,
    slug: 'san-valentin',
    title: 'San Valentín',
    description: 'El 14 de febrero es San Valentín. Un día dedicado al amor en todas sus formas: en pareja, con amigos, en familia. Algunos regalan flores, otros preparan cenas, muchos simplemente aprovechan para estar con quienes quieren.',
    category: 'amor',
    subcategories: ['Amor', 'Amistad', 'Floral'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80',
    date: '2026-02-14',
    location: 'España',
    featured: true,
  },
  {
    id: 2,
    slug: 'fiesta-blanca-mallorca',
    title: 'Fiesta Blanca en Mallorca',
    description: 'Una noche mágica en la isla. Todos de blanco bajo las estrellas mediterráneas.',
    category: 'noche',
    subcategories: ['Noche', 'Verano'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
    date: null,
    location: 'Mallorca',
    featured: true,
  },
  {
    id: 3,
    slug: 'festes-tarbena',
    title: 'Festes en Tárbena',
    description: 'Las fiestas tradicionales del pueblo de Tárbena, con música, baile y gastronomía valenciana.',
    category: 'familia',
    subcategories: ['Familia', 'Tradición'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    date: null,
    location: 'Tárbena, Alicante',
    featured: false,
  },
  {
    id: 4,
    slug: 'samain-galicia',
    title: 'Samaín en Galicia',
    description: 'El festival celta del Samaín, ancestro del Halloween, celebrado en tierras gallegas con su magia y misterio.',
    category: 'disfraces',
    subcategories: ['Disfraces', 'Tradición'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&q=80',
    date: null,
    location: 'Galicia',
    featured: false,
  },
  {
    id: 5,
    slug: 'feria-abril',
    title: 'Feria de Abril',
    description: 'La famosa Feria de Abril de Sevilla, con sus casetas, sevillanas, trajes de flamenca y alegría andaluza.',
    category: 'musica',
    subcategories: ['Música', 'Tradición'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1549061680-196562585576?w=400&q=80',
    date: null,
    location: 'Sevilla',
    featured: false,
  },
  {
    id: 6,
    slug: 'maruxaina-lucense',
    title: 'La Maruxaiña lucense',
    description: 'Festival de los mares de Lugo, con música celta, danzas y el sabor del noroeste de España.',
    category: 'musica',
    subcategories: ['Música', 'Mar'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80',
    date: null,
    location: 'Lugo',
    featured: false,
  },
  {
    id: 7,
    slug: 'san-juan-alicante',
    title: 'San Juan en Alicante',
    description: 'Las hogueras de San Juan, declaradas Patrimonio Cultural Inmaterial por la UNESCO.',
    category: 'familia',
    subcategories: ['Familia', 'Tradición', 'Fuego'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80',
    date: '2026-06-23',
    location: 'Alicante',
    featured: false,
    upcoming: true,
  },
  {
    id: 8,
    slug: 'fiestas-bertamiran',
    title: 'Fiestas de Bertamiráns',
    description: 'Las fiestas patronales de Bertamiráns, con verbenas, fuegos artificiales y tradición gallega.',
    category: 'familia',
    subcategories: ['Familia', 'Tradición'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    date: '2026-06-27',
    location: 'Bertamiráns, A Coruña',
    featured: false,
    upcoming: true,
  },
  {
    id: 9,
    slug: 'halloween',
    title: 'Halloween',
    description: 'La noche de brujas más terrorífica del año. Disfraces, calabazas y mucho dulce o truco.',
    category: 'disfraces',
    subcategories: ['Disfraces', 'Noche'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&q=80',
    date: null,
    location: null,
    featured: false,
  },
  {
    id: 10,
    slug: 'carnaval-tenerife',
    title: 'Carnaval en Tenerife',
    description: 'El carnaval más famoso de España, con desfiles espectaculares y disfraces increíbles.',
    category: 'disfraces',
    subcategories: ['Disfraces', 'Música'],
    views: 2000,
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80',
    date: null,
    location: 'Tenerife',
    featured: false,
  },
  {
    id: 11,
    slug: 'navidad',
    title: 'Navidad',
    description: 'La época más mágica del año, con tradiciones, villancicos, belenes y espíritu familiar.',
    category: 'familia',
    views: 2000,
    image: 'https://images.unsplash.com/photo-1512389098783-66b81f86e199?w=400&q=80',
    date: null,
    location: null,
  },
  {
    id: 12,
    slug: 'fiesta-disfraces-casa',
    title: 'Fiesta de disfraces en mi casa',
    description: 'Una fiesta privada de disfraces con amigos.',
    category: 'disfraces',
    views: 50,
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80',
    date: null,
    location: null,
    userCreated: true,
  },
  {
    id: 13,
    slug: 'fiesta-disfraces-albatera',
    title: 'Fiesta de disfraces Albatera',
    description: 'Fiesta de disfraces en el municipio de Albatera.',
    category: 'disfraces',
    views: 200,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&q=80',
    date: null,
    location: 'Albatera, Alicante',
    userCreated: true,
  },
];

// ── Content items (media inside a fiesta) ───────────────────────
export const CONTENT_ITEMS = {
  'san-valentin': {
    videos: [
      { id: 'v1', title: 'DIY Regalo para...', views: 2000, image: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=300&q=80' },
      { id: 'v2', title: 'Receta cupcakes en...', views: 2000, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&q=80' },
      { id: 'v3', title: 'Ayúdame a preparar...', views: 2000, image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&q=80' },
    ],
    images: [
      { id: 'i1', title: 'Ideas para regalar...', views: 2000, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80' },
      { id: 'i2', title: 'Te ayudamos a...', views: 2000, image: 'https://images.unsplash.com/photo-1549032305-e816babf0eb2?w=300&q=80' },
      { id: 'i3', title: 'Cómo hacer paso...', views: 2000, image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=300&q=80' },
    ],
    documents: [
      { id: 'd1', title: 'Poemas de amor...', views: 2000 },
      { id: 'd2', title: '10 ideas de regalos...', views: 2000 },
      { id: 'd3', title: 'Ayúdame a preparar...', views: 2000 },
    ],
    audios: [
      { id: 'a1', title: 'Poemas de amor...', views: 2000 },
      { id: 'a2', title: '10 ideas de regalos...', views: 2000 },
      { id: 'a3', title: 'Ayúdame a preparar...', views: 2000 },
    ],
  },
};

// ── User mock data ────────────────────────────────────────────────
export const MOCK_USER = {
  id: 'u1',
  name: 'Sara',
  email: 'sara@gmail.com',
  country: 'España',
  city: 'Pontevedra',
  downloadHistory: [
    { name: 'video_san_valentin.mp4', date: '03/01/2026' },
    { name: 'receta_navidad.pdf',      date: '25/12/2025' },
    { name: 'desfile_myc_monforte.mp4',date: '06/12/2025' },
    { name: 'audio_halloween.mp3',     date: '31/10/2025' },
    { name: 'fiesta_disfraces_david.jpg', date: '04/09/2025' },
  ],
};

export const formatViews = (n, lang = 'ES') => {
  const formatter = new Intl.NumberFormat('es-ES');
  const value = Number.isFinite(n) ? n : 0;
  const label = lang === 'EN' 
    ? (value === 1 ? 'time viewed' : 'times viewed')
    : (value === 1 ? 'vez visto' : 'veces visto');
  return `${formatter.format(value)} ${label}`;
};

export const formatDownloads = (n, lang = 'ES') => {
  if (lang === 'EN') {
    return n >= 1000 ? `${(n / 1000).toFixed(0)}k downloads` : `${n} downloads`;
  }
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k descargas` : `${n} descargas`;
};

export const formatDate = (iso) => {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
