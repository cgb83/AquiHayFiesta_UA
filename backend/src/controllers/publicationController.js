const Publication = require('../models/Publication');
const Fiesta      = require('../models/Fiesta');
const User        = require('../models/User');

const getContentType = (mimetype) => {
  if (mimetype.startsWith('image/'))       return 'image';
  if (mimetype.startsWith('video/'))       return 'video';
  if (mimetype.startsWith('audio/'))       return 'audio';
  return 'document';
};

const getPublications = async (req, res) => {
  try {
    const { fiesta: fiestaSlug, contentType } = req.query;
    const filter = {};
    if (fiestaSlug) {
      const fiestaDoc = await Fiesta.findOne({ slug: fiestaSlug });
      if (!fiestaDoc) return res.json({ success: true, publications: [] });
      filter.fiesta = fiestaDoc._id;
    }
    if (contentType) filter.contentType = contentType;
    const publications = await Publication.find(filter).populate('createdBy', 'username').populate('fiesta', 'title slug').sort({ createdAt: -1 });
    res.json({ success: true, count: publications.length, publications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener publicaciones.' });
  }
};

const createPublication = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Debes subir un archivo.' });
    const { title, description, fiestaId } = req.body;
    const fiesta = await Fiesta.findById(fiestaId);
    if (!fiesta) return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    const contentType = getContentType(req.file.mimetype);

    // Usar la URL de Cloudinary
    const fileUrl = req.file.path || req.file.secure_url;

    const publication = await Publication.create({
      title,
      description,
      fiesta:      fiestaId,
      createdBy:   req.user._id,
      contentType,
      fileUrl:     fileUrl,
      fileName:    req.file.originalname,
    });
    res.status(201).json({ success: true, message: 'Publicación creada correctamente.', publication });
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ success: false, message: `Error al crear la publicación: ${error.message}` });
  }
};

// AÑADIDA: Función para actualizar publicación
const updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    if (publication.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta publicación.' });
    }

    const { title, description } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'El título es obligatorio.' });
    }

    publication.title       = title.trim();
    publication.description = description?.trim() || '';
    await publication.save();

    res.json({ success: true, message: 'Publicación actualizada.', publication });
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({ success: false, message: `Error al actualizar la publicación: ${error.message}` });
  }
};

const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    if (publication.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta publicación.' });
    }

    await Publication.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Publicación eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar la publicación.' });
  }
};

const getMyPublications = async (req, res) => {
  try {
    const publications = await Publication.find({ createdBy: req.user._id }).populate('fiesta', 'title slug').sort({ createdAt: -1 });
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

const registerDownload = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
    if (!publication) return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    await User.findByIdAndUpdate(req.user._id, { $push: { downloadHistory: { $each: [{ filename: publication.fileName }], $position: 0, $slice: 50 } } });
    res.json({ success: true, fileUrl: publication.fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar la descarga.' });
  }
};

module.exports = { 
  getPublications, 
  createPublication, 
  updatePublication, // Asegúrate de que esté aquí
  deletePublication, 
  getMyPublications, 
  registerDownload 
};
