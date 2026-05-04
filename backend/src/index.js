require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const connectDB = require('./config/db');

// ── Conectar a MongoDB ───────────────────────────────────────────
connectDB();

const app = express();

// ── Middlewares globales ─────────────────────────────────────────

// CORS: permite peticiones desde el frontend React
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parsear JSON en el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos subidos estáticamente
// Ejemplo: http://localhost:5000/uploads/mi-imagen.jpg
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Rutas de la API ──────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/fiestas',      require('./routes/fiestaRoutes'));
app.use('/api/publications', require('./routes/publicationRoutes'));
app.use('/api/upload',       require('./routes/uploadRoutes'));

// ── Ruta de comprobación ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '¡API de AquiHayFiesta funcionando! 🎉' });
});

// ── Manejo de rutas no encontradas ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Ruta ${req.originalUrl} no encontrada.` });
});

// ── Manejo global de errores ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor.',
  });
});

// ── Arrancar servidor ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});
