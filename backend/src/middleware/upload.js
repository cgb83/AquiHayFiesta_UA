const multer = require('multer');
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

// ── Determinar resource_type según el tipo de archivo ──────────────
const getResourceType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'video'; // Cloudinary trata audio como video
  return 'raw'; // PDFs y documentos → raw
};

// ── Storage en memoria (no en disco) ──────────────────────────────
const storage = multer.memoryStorage();

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

// ── Middleware: Sube a Cloudinary después de multer ──────────────
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();

  const resourceType = getResourceType(req.file.mimetype);
  
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'aquihayfiesta_ua',
      resource_type: resourceType,
      public_id: `${req.file.fieldname}-${Date.now()}`,
      // Parámetros extra para PDFs
      ...(resourceType === 'raw' && { format: 'pdf' }),
    },
    (error, result) => {
      if (error) {
        console.error('Error Cloudinary:', error);
        return res.status(500).json({ 
          success: false, 
          message: `Error al subir a Cloudinary: ${error.message}` 
        });
      }
      
      // Guardar info en req.file para que el controlador la use
      req.file.path = result.secure_url;
      req.file.filename = result.public_id;
      next();
    }
  );
  
  // Enviar el buffer del archivo al stream
  uploadStream.end(req.file.buffer);
};

// ── Middleware de manejo de errores de multer ──────────────────
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ success: false, message: 'El archivo es demasiado grande (máximo 500MB).' });
    }
    return res.status(400).json({ success: false, message: `Error de carga: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

module.exports = {
  upload,
  uploadToCloudinary,
  multerErrorHandler,
};
