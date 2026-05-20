const express   = require('express');
const router    = express.Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
} = require('../controllers/authController');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Demasiados intentos. Inténtalo de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Públicas
router.post('/register', authLimiter, register);
router.post('/login',    authLimiter, login);

// Privadas (requieren token JWT)
router.get   ('/me',     protect, getMe);
router.put   ('/profile',protect, updateProfile);
router.delete('/delete', protect, deleteAccount);

module.exports = router;
