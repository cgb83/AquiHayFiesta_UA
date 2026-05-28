const mongoose = require('mongoose');
const ALLOWED_CATEGORIES = ['amor', 'noche', 'disfraces', 'familia', 'musica', 'gastronomia', 'deporte', 'infantil', 'bodas', 'negocios', 'cultural', 'religiosa'];

// Esquema para los comentarios
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo de usuario
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Valoración entre 1 y 5 estrellas
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'El comentario no puede superar 500 caracteres'],
    },
  },
  { timestamps: true } // Añade createdAt y updatedAt automáticamente
);

const fiestaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [100, 'El título no puede superar 100 caracteres'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La descripción no puede superar 1000 caracteres'],
      default: '',
    },
    // Imagen de portada
    coverImage: {
      type: String,
      required: [true, 'La portada es obligatoria'],
      default: '',
    },
    // Categorías
    categories: {
      type: [
        {
          type: String,
          enum: ALLOWED_CATEGORIES,
        },
      ],
      default: [],
    },
    // Fechas del evento (opcional)
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    // Ubicación
    location: {
      address: { type: String, default: '' },
      city:    { type: String, default: '' },
      country: { type: String, default: '' },
    },
    // Quién creó esta fiesta
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = fiesta oficial del sistema
    },
    // Estadísticas
    views: {
      type: Number,
      default: 0,
    },
    // Si aparece en la sección "Destacado" del home
    featured: {
      type: Boolean,
      default: false,
    },
    // Si aparece en "Se acerca..."
    upcoming: {
      type: Boolean,
      default: false,
    },
    // Comentarios
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

// ── Middleware: generar slug automáticamente desde el título ─────
fiestaSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quitar acentos
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
  next();
});

fiestaSchema.pre('validate', function (next) {
  const uniqueCategories = Array.from(new Set((this.categories || []).filter(Boolean)));

  if (uniqueCategories.length === 0 && this.category) {
    uniqueCategories.push(this.category);
  }

  if (!this.category && uniqueCategories.length > 0) {
    this.category = uniqueCategories[0];
  }

  this.categories = uniqueCategories;
  next();
});

// ── Método: incrementar visitas ──────────────────────────────────
fiestaSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Fiesta', fiestaSchema);
