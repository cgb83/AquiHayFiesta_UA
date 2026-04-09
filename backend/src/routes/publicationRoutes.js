const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const upload  = require('../middleware/upload');
const {
  getPublications,
  createPublication,
  deletePublication,
  getMyPublications,
  registerDownload,
} = require('../controllers/publicationController');

// Públicas
router.get('/', getPublications);

// Privadas
router.get   ('/my',              protect, getMyPublications);
router.post  ('/',                protect, upload.single('file'), createPublication);
router.delete('/:id',             protect, deletePublication);
router.post  ('/:id/download',    protect, registerDownload);

module.exports = router;
