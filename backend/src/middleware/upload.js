const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ── Tipos de archivo permitidos ──────────────────────────────────
const ALLOWED_TYPES = {
  image:    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video:    ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi', 'video/x-msvideo'],
  audio:    ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-wav'],
  document: ['application/pdf', 'application/msword',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

const ALL_ALLOWED = Object.values(ALLOWED_TYPES).flat();

// ── Configuración de Cloudinary Storage ──────────────────────────
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isDocument = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(file.mimetype);
  
    const ext = file.originalname.split('.').pop();
  
    return {
      folder: 'aquihayfiesta_ua',
      resource_type: isDocument ? 'raw' : 'auto',
      public_id: isDocument
        ? `${file.fieldname}-${Date.now()}.${ext}`
        : `${file.fieldname}-${Date.now()}`,
    };
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
    fileSize: 500 * 1024 * 1024, // 500 MB máximo (para videos)
  },
});

module.exports = upload;
