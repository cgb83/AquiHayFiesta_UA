const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary, multerErrorHandler } = require('../middleware/upload');

// Endpoint simple para subir archivos a Cloudinary
router.post('/', protect, upload.single('file'), multerErrorHandler, uploadToCloudinary, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  res.json({
    message: 'Archivo subido exitosamente',
    file: {
      url: req.file.path, // URL de Cloudinary
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});

module.exports = router;
