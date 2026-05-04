const Fiesta = require('../models/Fiesta');
const ALLOWED_CATEGORIES = ['amor', 'noche', 'disfraces', 'familia', 'musica', 'gastronomia'];

// ── GET /api/fiestas ─────────────────────────────────────────────
// Listar todas las fiestas (con filtros opcionales)
const getFiestas = async (req, res) => {
  try {
    const { category, search, featured, upcoming } = req.query;

    // Construir filtro dinámico
    const filter = {};
    if (category) {
      filter.$or = [{ category }, { categories: category }];
    }
    if (featured === 'true') filter.featured = true;
    if (upcoming === 'true') filter.upcoming = true;
    if (search) {
      const searchFilter = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
        delete filter.$or;
      } else {
        filter.$or = searchFilter;
      }
    }

    const fiestas = await Fiesta.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: fiestas.length, fiestas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener las fiestas.' });
  }
};

// ── GET /api/fiestas/:slug ────────────────────────────────────────
const getFiestaBySlug = async (req, res) => {
  try {
    const fiesta = await Fiesta.findOne({ slug: req.params.slug })
      .populate('createdBy', 'username');

    if (!fiesta) {
      return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    }

    // Incrementar solo 1 visita por usuario autenticado.
    await fiesta.incrementViews(req.user?._id || null);

    res.json({ success: true, fiesta });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la fiesta.' });
  }
};

// ── POST /api/fiestas  (requiere login) ──────────────────────────
const createFiesta = async (req, res) => {
  try {
    const { title, description, category, categories, subcategories, startDate, endDate, location } = req.body;

    const parsedCategories = categories
      ? JSON.parse(categories)
      : category
        ? [category]
        : [];

    const safeCategories = Array.from(new Set(parsedCategories.filter((item) => ALLOWED_CATEGORIES.includes(item))));

    if (safeCategories.length === 0) {
      return res.status(400).json({ success: false, message: 'Debes seleccionar al menos una categoria.' });
    }

    const fiesta = await Fiesta.create({
      title,
      description,
      category: safeCategories[0],
      categories: safeCategories,
      subcategories: subcategories ? JSON.parse(subcategories) : [],
      startDate:  startDate  || null,
      endDate:    endDate    || null,
      location:   location   ? JSON.parse(location) : {},
      coverImage: req.file ? `/uploads/${req.file.filename}` : '',
      createdBy:  req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Fiesta creada correctamente.',
      fiesta,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error al crear la fiesta.' });
  }
};

// ── GET /api/fiestas/my  (fiestas del usuario logueado) ──────────
const getMyFiestas = async (req, res) => {
  try {
    const fiestas = await Fiesta.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: fiestas.length, fiestas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tus fiestas.' });
  }
};

// ── PUT /api/fiestas/:id  (solo el creador) ──────────────────────
const updateFiesta = async (req, res) => {
  try {
    const fiesta = await Fiesta.findById(req.params.id);
    if (!fiesta) {
      return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    }

    // Solo el creador puede editar
    if (fiesta.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta fiesta.' });
    }

    const { title, description, categories, startDate, endDate, location } = req.body;

    const parsedCategories = Array.isArray(categories) ? categories : [];
    const safeCategories = Array.from(new Set(parsedCategories.filter(c => ALLOWED_CATEGORIES.includes(c))));

    if (safeCategories.length === 0) {
      return res.status(400).json({ success: false, message: 'Debes seleccionar al menos una categoría.' });
    }

    const updateData = {
      title,
      description,
      category: safeCategories[0],
      categories: safeCategories,
      startDate: startDate || null,
      endDate:   endDate   || null,
      location:  location  || {},
    };

    const updated = await Fiesta.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Fiesta actualizada.', fiesta: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la fiesta.' });
  }
};

// ── DELETE /api/fiestas/:id  (solo el creador) ───────────────────
const deleteFiesta = async (req, res) => {
  try {
    const fiesta = await Fiesta.findById(req.params.id);
    if (!fiesta) {
      return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    }

    if (fiesta.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta fiesta.' });
    }

    await Fiesta.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Fiesta eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar la fiesta.' });
  }
};

// ── POST /api/fiestas/:id/save  (guardar fiesta) ─────────────────
const toggleSaveFiesta = async (req, res) => {
  try {
    const user = req.user;
    const fiestaId = req.params.id;

    const index = user.savedFiestas.indexOf(fiestaId);
    if (index === -1) {
      user.savedFiestas.push(fiestaId); // Guardar
    } else {
      user.savedFiestas.splice(index, 1); // Quitar
    }

    await user.save();

    res.json({
      success: true,
      saved: index === -1,
      savedFiestas: user.savedFiestas,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al guardar la fiesta.' });
  }
};

module.exports = { getFiestas, getFiestaBySlug, getMyFiestas, createFiesta, updateFiesta, deleteFiesta, toggleSaveFiesta };
