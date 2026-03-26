const multer = require('multer');
const path   = require('path');

// ── Tipos de archivo permitidos ──────────────────────────────────
const ALLOWED_TYPES = {
  image:    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video:    ['video/mp4', 'video/webm', 'video/quicktime'],
  audio:    ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
  document: ['application/pdf', 'application/msword',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

const ALL_ALLOWED = Object.values(ALLOWED_TYPES).flat();

// ── Dónde y cómo guardar los archivos ───────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // carpeta en la raíz del backend
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + nombre original sin espacios
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
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
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB máximo
  },
});

module.exports = upload;
