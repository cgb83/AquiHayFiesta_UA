const User          = require('../models/User');
const { generateToken } = require('../middleware/auth');

// ── POST /api/auth/register ──────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, email, password, country, city } = req.body;

    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario, correo y contraseña son obligatorios.',
      });
    }

    // Comprobar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cuenta con ese correo.',
      });
    }

    // Comprobar si el username ya existe
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Ese nombre de usuario ya está en uso.',
      });
    }

    // Crear usuario (la contraseña se encripta en el modelo)
    const user = await User.create({ username, email, password, country, city });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Cuenta creada correctamente.',
      token,
      user: {
        id:           user._id,
        username:     user.username,
        email:        user.email,
        country:      user.country,
        city:         user.city,
        role:         user.role,
        savedFiestas: [],
        theme:        user.theme,
        language:     user.language,
      },
    });
  } catch (error) {
    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('[auth/register] Error:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son obligatorios.',
      });
    }

    // Buscar usuario incluyendo la contraseña (está excluida por defecto)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos.',
      });
    }

    // Comparar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos.',
      });
    }

    const token = generateToken(user._id);

    const populatedUser = await User.findById(user._id).populate('savedFiestas', '_id');

    res.json({
      success: true,
      message: 'Sesión iniciada correctamente.',
      token,
      user: {
        id:           user._id,
        username:     user.username,
        email:        user.email,
        country:      user.country,
        city:         user.city,
        role:         user.role,
        savedFiestas: (populatedUser.savedFiestas || []).map(f => String(f._id)),
        theme:        user.theme,
        language:     user.language,
      },
    });
  } catch (error) {
    console.error('[auth/login] Error:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// ── GET /api/auth/me  (ruta protegida) ───────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedFiestas', 'title slug coverImage');
    res.json({ success: true, user });
  } catch (error) {
    console.error('[auth/me] Error:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// ── PUT /api/auth/profile  (ruta protegida) ──────────────────────
const updateProfile = async (req, res) => {
  try {
    const { username, email, password, country, city, theme, language } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });

    // Si se quiere cambiar la contraseña, verificar la actual
    if (password) {
      const { currentPassword } = req.body;
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Debes introducir tu contraseña actual para cambiarla.',
        });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta.' });
      }
      user.password = password;
    }

    if (username) user.username = username;
    if (email)    user.email    = email;
    if (country !== undefined) user.country  = country;
    if (city    !== undefined) user.city     = city;
    if (theme)    user.theme    = theme;
    if (language) user.language = language;

    await user.save();

    const populatedUser = await User.findById(user._id).populate('savedFiestas', '_id');

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente.',
      user: {
        id:           user._id,
        username:     user.username,
        email:        user.email,
        country:      user.country,
        city:         user.city,
        role:         user.role,
        savedFiestas: (populatedUser.savedFiestas || []).map(f => String(f._id)),
        theme:        user.theme,
        language:     user.language,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('[auth/profile] Error:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// ── DELETE /api/auth/delete  (ruta protegida) ────────────────────
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Cuenta eliminada correctamente.' });
  } catch (error) {
    console.error('[auth/delete] Error:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

module.exports = { register, login, getMe, updateProfile, deleteAccount };
