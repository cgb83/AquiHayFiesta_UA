const mongoose = require('mongoose');

// Tipos de contenido permitidos
const CONTENT_TYPES = ['video', 'image', 'document', 'audio'];

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [100, 'El título no puede superar 100 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres'],
      default: '',
    },
    // A qué fiesta pertenece esta publicación
    fiesta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fiesta',
      required: [true, 'La publicación debe pertenecer a una fiesta'],
    },
    // Quién publicó el contenido
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La publicación necesita un autor'],
    },
    // Tipo de contenido
    contentType: {
      type: String,
      required: [true, 'El tipo de contenido es obligatorio'],
      enum: CONTENT_TYPES,
    },
    // Ruta o URL del archivo subido
    fileUrl: {
      type: String,
      required: [true, 'El archivo es obligatorio'],
    },
    // Nombre original del archivo
    fileName: {
      type: String,
      default: '',
    },
    // Miniatura (para videos e imágenes)
    thumbnailUrl: {
      type: String,
      default: '',
    },
    // Número de veces visto / descargado
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Índices para búsquedas rápidas ───────────────────────────────
publicationSchema.index({ fiesta: 1, contentType: 1 });
publicationSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Publication', publicationSchema);
