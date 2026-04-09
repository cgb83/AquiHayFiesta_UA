const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
} = require('../controllers/authController');

// Públicas
router.post('/register', register);
router.post('/login',    login);

// Privadas (requieren token JWT)
router.get   ('/me',     protect, getMe);
router.put   ('/profile',protect, updateProfile);
router.delete('/delete', protect, deleteAccount);

module.exports = router;
