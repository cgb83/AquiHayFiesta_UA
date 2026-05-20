const Fiesta = require('../models/Fiesta');
const Publication = require('../models/Publication');
const ALLOWED_CATEGORIES = ['amor', 'noche', 'disfraces', 'familia', 'musica', 'gastronomia', 'deporte', 'infantil', 'bodas', 'negocios', 'cultural', 'religiosa'];

function accentInsensitiveRegex(str) {
  const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escaped
    .replace(/[aá]/gi, '[aá]')
    .replace(/[eé]/gi, '[eé]')
    .replace(/[ií]/gi, '[ií]')
    .replace(/[oó]/gi, '[oó]')
    .replace(/[uúü]/gi, '[uúü]')
    .replace(/[nñ]/gi, '[nñ]');
}

const getFiestas = async (req, res) => {
  try {
    const { category, search, featured, upcoming } = req.query;
    const filter = {};
    if (category) filter.$or = [{ category }, { categories: category }];
    if (featured === 'true') filter.featured = true;
    if (upcoming === 'true') filter.upcoming = true;
    if (search) {
      const r = accentInsensitiveRegex(search);
      const searchFilter = [
        { title:        { $regex: r, $options: 'i' } },
        { description:  { $regex: r, $options: 'i' } },
        { subcategories:{ $regex: r, $options: 'i' } },
        { categories:   { $regex: r, $options: 'i' } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
        delete filter.$or;
      } else {
        filter.$or = searchFilter;
      }
    }
    const fiestas = await Fiesta.find(filter).populate('createdBy', 'username email country city').sort({ createdAt: -1 });
    res.json({ success: true, count: fiestas.length, fiestas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener las fiestas.' });
  }
};

const getFiestaBySlug = async (req, res) => {
  try {
    const fiesta = await Fiesta.findOne({ slug: req.params.slug }).populate('createdBy', 'username email country city');
    if (!fiesta) return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    await fiesta.incrementViews();
    res.json({ success: true, fiesta });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la fiesta.' });
  }
};

const createFiesta = async (req, res) => {
  try {
    const { title, description, category, categories, subcategories, startDate, endDate, location } = req.body;
    const parsedCategories = categories ? JSON.parse(categories) : category ? [category] : [];
    const safeCategories = Array.from(new Set(parsedCategories.filter((item) => ALLOWED_CATEGORIES.includes(item))));
    
    const fiesta = await Fiesta.create({
      title,
      description,
      category: safeCategories[0] || 'familia',
      categories: safeCategories.length > 0 ? safeCategories : ['familia'],
      subcategories: subcategories ? JSON.parse(subcategories) : [],
      startDate:  startDate  || null,
      endDate:    endDate    || null,
      location:   location   ? JSON.parse(location) : {},
      coverImage: req.file ? req.file.path : '',
      createdBy:  req.user._id,
    });
    res.status(201).json({ success: true, message: 'Fiesta creada correctamente.', fiesta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al crear la fiesta.' });
  }
};

const updateFiesta = async (req, res) => {
  try {
    const fiesta = await Fiesta.findById(req.params.id);
    if (!fiesta) {
      return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    }

    const isOwner = fiesta.createdBy?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta fiesta.' });
    }

    const { title, description, startDate, endDate, location, categories, subcategories } = req.body;
    const allowedUpdate = {};
    if (title !== undefined) allowedUpdate.title = title;
    if (description !== undefined) allowedUpdate.description = description;
    if (startDate !== undefined) allowedUpdate.startDate = startDate || null;
    if (endDate !== undefined) allowedUpdate.endDate = endDate || null;
    if (location !== undefined) allowedUpdate.location = location;
    if (subcategories !== undefined) allowedUpdate.subcategories = subcategories;
    if (categories !== undefined) {
      const safe = Array.from(new Set(
        (Array.isArray(categories) ? categories : [categories]).filter(c => ALLOWED_CATEGORIES.includes(c))
      ));
      if (safe.length > 0) {
        allowedUpdate.categories = safe;
        allowedUpdate.category = safe[0];
      }
    }

    const updatedFiesta = await Fiesta.findByIdAndUpdate(req.params.id, allowedUpdate, { new: true, runValidators: true });
    res.json({ success: true, message: 'Fiesta actualizada.', fiesta: updatedFiesta });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la fiesta.' });
  }
};

const deleteFiesta = async (req, res) => {
  try {
    const fiesta = await Fiesta.findById(req.params.id);
    if (!fiesta) {
      return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    }
    const isOwner = fiesta.createdBy?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta fiesta.' });
    }
    await Publication.deleteMany({ fiesta: fiesta._id });
    await Fiesta.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Fiesta eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar la fiesta.' });
  }
};

const toggleSaveFiesta = async (req, res) => {
  try {
    const user = req.user;
    const fiestaId = req.params.id;
    const index = user.savedFiestas.indexOf(fiestaId);
    if (index === -1) user.savedFiestas.push(fiestaId);
    else user.savedFiestas.splice(index, 1);
    await user.save();
    res.json({ success: true, saved: index === -1, savedFiestas: user.savedFiestas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al guardar la fiesta.' });
  }
};

const getMyFiestas = async (req, res) => {
  try {
    const fiestas = await Fiesta.find({ createdBy: req.user._id })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: fiestas.length, fiestas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tus fiestas.' });
  }
};

module.exports = { 
  getFiestas, 
  getFiestaBySlug, 
  createFiesta, 
  updateFiesta, 
  deleteFiesta, 
  toggleSaveFiesta,
  getMyFiestas,
};
