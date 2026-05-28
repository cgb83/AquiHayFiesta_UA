const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary, multerErrorHandler }  = require('../middleware/upload');
const {
  getFiestas,
  getFiestaBySlug,
  createFiesta,
  updateFiesta,
  deleteFiesta,
  toggleSaveFiesta,
  getMyFiestas,
  getComments,
  addComment,
  deleteComment,
} = require('../controllers/fiestaController');

// Públicas
router.get('/',      getFiestas);

// Privadas
router.get    ('/my',                      protect, getMyFiestas);
router.post   ('/',                        protect, upload.single('coverImage'), multerErrorHandler, uploadToCloudinary, createFiesta);
router.put    ('/:id',                     protect, updateFiesta);
router.delete ('/:id',                     protect, deleteFiesta);
router.post   ('/:id/save',                protect, toggleSaveFiesta);
router.get    ('/:id/comments',                     getComments);
router.post   ('/:id/comments',            protect, addComment);
router.delete ('/:id/comments/:commentId', protect, deleteComment);

router.get('/:slug', getFiestaBySlug); // Quitamos optionalProtect por si acaso

module.exports = router;
