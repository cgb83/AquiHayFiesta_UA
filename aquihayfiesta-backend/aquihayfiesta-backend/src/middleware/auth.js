const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Middleware: verificar token JWT ──────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // El token viene en el header: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Inicia sesión para continuar.',
    });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'El usuario ya no existe.',
      });
    }

    // Añadir el usuario a la request para usarlo en los controladores
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token no válido o expirado.',
    });
  }
};

// ── Helper: generar token JWT ────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = { protect, generateToken };
