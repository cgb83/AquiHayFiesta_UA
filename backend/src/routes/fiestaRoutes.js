const express = require('express');
const router  = express.Router();
const { protect, optionalProtect } = require('../middleware/auth');
const upload  = require('../middleware/upload');
const {
  getFiestas,
  getFiestaBySlug,
  getMyFiestas,
  createFiesta,
  updateFiesta,
  deleteFiesta,
  toggleSaveFiesta,
} = require('../controllers/fiestaController');

// Públicas
router.get('/', getFiestas);

// /my debe ir antes de /:slug para que Express no lo interprete como slug
router.get('/my',    protect, getMyFiestas);
router.get('/:slug', optionalProtect, getFiestaBySlug);

// Privadas
router.post  ('/',         protect, upload.single('coverImage'), createFiesta);
router.put   ('/:id',      protect, upload.single('coverImage'), updateFiesta);
router.delete('/:id',      protect, deleteFiesta);
router.post  ('/:id/save', protect, toggleSaveFiesta);

module.exports = router;
