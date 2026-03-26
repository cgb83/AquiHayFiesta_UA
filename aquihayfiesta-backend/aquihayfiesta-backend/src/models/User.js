const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      trim: true,
      minlength: [3, 'El usuario debe tener al menos 3 caracteres'],
      maxlength: [30, 'El usuario no puede superar 30 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de correo no válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No se devuelve en consultas por defecto
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    // Fiestas que el usuario ha guardado (referencia)
    savedFiestas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fiesta',
      },
    ],
    // Historial de descargas
    downloadHistory: [
      {
        filename: { type: String },
        downloadedAt: { type: Date, default: Date.now },
      },
    ],
    // Preferencias de estilo (tema de la UI)
    theme: {
      type: String,
      enum: ['standard', 'dark', 'high-contrast', 'large-text', 'large-contrast'],
      default: 'standard',
    },
    // Idioma preferido
    language: {
      type: String,
      enum: ['ES', 'EN'],
      default: 'ES',
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// ── Middleware: encriptar contraseña antes de guardar ────────────
userSchema.pre('save', async function (next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Método: comparar contraseña al hacer login ───────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
