const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ── Tipos de archivo permitidos ──────────────────────────────────
const ALLOWED_TYPES = {
  image:    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video:    ['video/mp4', 'video/webm', 'video/quicktime'],
  audio:    ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
  document: ['application/pdf', 'application/msword',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

const ALL_ALLOWED = Object.values(ALLOWED_TYPES).flat();

// ── Configuración de Cloudinary Storage ──────────────────────────
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aquihayfiesta_ua',
    format: async (req, file) => 'png', 
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

// ── Filtro de tipos ──────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (ALL_ALLOWED.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

// ── Configuración de multer ──────────────────────────────────────
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB máximo
  },
});

module.exports = upload;
