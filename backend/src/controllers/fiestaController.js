const Fiesta = require('../models/Fiesta');
const ALLOWED_CATEGORIES = ['amor', 'noche', 'disfraces', 'familia', 'musica', 'gastronomia'];

const getFiestas = async (req, res) => {
  try {
    const { category, search, featured, upcoming } = req.query;
    const filter = {};
    if (category) filter.$or = [{ category }, { categories: category }];
    if (featured === 'true') filter.featured = true;
    if (upcoming === 'true') filter.upcoming = true;
    if (search) {
      const searchFilter = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
        delete filter.$or;
      } else {
        filter.$or = searchFilter;
      }
    }
    const fiestas = await Fiesta.find(filter).populate('createdBy', 'username').sort({ createdAt: -1 });
    res.json({ success: true, count: fiestas.length, fiestas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener las fiestas.' });
  }
};

const getFiestaBySlug = async (req, res) => {
  try {
    const fiesta = await Fiesta.findOne({ slug: req.params.slug }).populate('createdBy', 'username');
    if (!fiesta) return res.status(404).json({ success: false, message: 'Fiesta no encontrada.' });
    if (fiesta.incrementViews) await fiesta.incrementViews(req.user?._id || null);
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
    // CORRECCIÓN: Eliminada la declaración duplicada
    const updatedFiesta = await Fiesta.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Fiesta actualizada.', fiesta: updatedFiesta });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la fiesta.' });
  }
};

const deleteFiesta = async (req, res) => {
  try {
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

module.exports = { 
  getFiestas, 
  getFiestaBySlug, 
  createFiesta, 
  updateFiesta, 
  deleteFiesta, 
  toggleSaveFiesta 
};
