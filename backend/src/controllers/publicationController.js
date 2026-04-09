const Publication = require('../models/Publication');
const Fiesta      = require('../models/Fiesta');
const User        = require('../models/User');

// Detectar el tipo de archivo por su mimetype
const getContentType = (mimetype) => {
  if (mimetype.startsWith('image/'))       return 'image';
  if (mimetype.startsWith('video/'))       return 'video';
  if (mimetype.startsWith('audio/'))       return 'audio';
  return 'document';
};

// ── GET /api/publications?fiesta=slug ───────────────────────────
const getPublications = async (req, res) => {
  try {
    const { fiesta: fiestaSlug, contentType } = req.query;

    const filter = {};

    // Filtrar por fiesta
    if (fiestaSlug) {
      const fiestaDoc = await Fiesta.findOne({ slug: fiestaSlug });
      if (!fiestaDoc) return res.json({ success: true, publications: [] });
      filter.fiesta = fiestaDoc._id;
    }

    if (contentType) filter.contentType = contentType;

    const publications = await Publication.find(filter)
      .populate('createdBy', 'username')
      .populate('fiesta', 'title slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: publications.length, publications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener publicaciones.' });
  }
};

// ── POST /api/publications  (requiere login) ─────────────────────
const createPublication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Debes subir un archivo.' });
    }

    const { title, description, fiestaId } = req.body;

    // Verificar que la fiesta existe
    const fiesta = await Fiesta.findById(fiestaId);
    if (!fiesta) {
      return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    }

    const contentType = getContentType(req.file.mimetype);

    const publication = await Publication.create({
      title,
      description,
      fiesta:      fiestaId,
      createdBy:   req.user._id,
      contentType,
      fileUrl:     `/uploads/${req.file.filename}`,
      fileName:    req.file.originalname,
    });

    res.status(201).json({
      success: true,
      message: 'Publicación creada correctamente.',
      publication,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error al crear la publicación.' });
  }
};

// ── DELETE /api/publications/:id  (solo el autor) ────────────────
const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    if (publication.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta publicación.' });
    }

    await Publication.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Publicación eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar la publicación.' });
  }
};

// ── GET /api/publications/my  (mis publicaciones) ────────────────
const getMyPublications = async (req, res) => {
  try {
    const publications = await Publication.find({ createdBy: req.user._id })
      .populate('fiesta', 'title slug')
      .sort({ createdAt: -1 });

    // Agrupar por fiesta para el frontend
    const grouped = {};
    publications.forEach(pub => {
      const key = pub.fiesta?.title || 'Sin fiesta';
      if (!grouped[key]) grouped[key] = { videos: [], images: [], documents: [], audios: [] };
      grouped[key][pub.contentType + 's'].push(pub);
    });

    res.json({ success: true, grouped, publications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tus publicaciones.' });
  }
};

// ── POST /api/publications/:id/download ─────────────────────────
const registerDownload = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    // Añadir al historial del usuario
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        downloadHistory: {
          $each: [{ filename: publication.fileName }],
          $position: 0,
          $slice: 50, // Máximo 50 entradas en el historial
        },
      },
    });

    res.json({ success: true, fileUrl: publication.fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar la descarga.' });
  }
};

module.exports = { getPublications, createPublication, deletePublication, getMyPublications, registerDownload };
