import { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES, FIESTAS } from '../data/mockData';
import { fetchFiestas, fetchMe, resolveMediaUrl, toggleSaveFiesta } from '../services/api';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  user: 'ahf_user',
  lang: 'ahf_lang',
  theme: 'ahf_theme',
  savedItems: 'ahf_saved_items',
  token: 'ahf_token',
};

const parseJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeFiesta = (fiesta) => ({
  id: fiesta._id || fiesta.id,
  slug: fiesta.slug,
  title: fiesta.title,
  description: fiesta.description || '',
  category: fiesta.category,
  categories: Array.isArray(fiesta.categories)
    ? fiesta.categories
    : fiesta.category
      ? [fiesta.category]
      : [],
  subcategories: fiesta.subcategories || [],
  views: fiesta.views || 0,
  image: resolveMediaUrl(fiesta.coverImage || fiesta.image || ''),
  date: fiesta.startDate ? String(fiesta.startDate).slice(0, 10) : fiesta.date || null,
  location: fiesta.location?.city || fiesta.location || null,
  featured: Boolean(fiesta.featured),
  upcoming: Boolean(fiesta.upcoming),
});

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => parseJSON(STORAGE_KEYS.user, null));
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEYS.lang) || 'ES');
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.theme) || 'standard');
  const [savedItems, setSavedItems] = useState(() => parseJSON(STORAGE_KEYS.savedItems, []));
  const [fiestas, setFiestas] = useState(FIESTAS);
  const [fiestasLoading, setFiestasLoading] = useState(false);
  const [fiestasError, setFiestasError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Apply theme to <html>
  useEffect(() => {
    const themeMap = {
      standard: '',
      dark: 'dark',
      'high-contrast': 'high-contrast',
      'large-text': 'large-text',
      'large-contrast': 'large-contrast',
    };
    document.documentElement.setAttribute('data-theme', themeMap[theme] || '');
  }, [theme]);

  const login = (userData, token) => {
    const normalizedUser = {
      id:      userData.id,
      name:    userData.name || userData.username || '',
      email:   userData.email || '',
      country: userData.country || '',
      city:    userData.city || '',
      role:    userData.role || 'user',
    };
    setUser(normalizedUser);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser));
    if (token) localStorage.setItem(STORAGE_KEYS.token, token);

    // Inicializar fiestas guardadas desde los datos del servidor
    if (Array.isArray(userData.savedFiestas)) {
      const ids = userData.savedFiestas.map(f =>
        typeof f === 'object' ? String(f._id || f.id) : String(f)
      );
      setSavedItems(ids);
    }
  };

  const logout = () => {
    setUser(null);
    setSavedItems([]);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.savedItems);
  };

  const refreshCurrentUser = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (!token) return;

    try {
      setAuthLoading(true);
      const response = await fetchMe();
      const me = response.user || {};
      login(
        {
          id:           me._id || me.id,
          username:     me.username,
          name:         me.username,
          email:        me.email,
          country:      me.country,
          city:         me.city,
          role:         me.role,
          savedFiestas: me.savedFiestas || [],
        },
        token
      );
    } catch {
      logout();
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleSave = async (id) => {
    if (!id) return;
    const strId = String(id);

    // Actualización optimista para respuesta inmediata en UI
    setSavedItems(prev =>
      prev.includes(strId) ? prev.filter(x => x !== strId) : [...prev, strId]
    );

    try {
      const response = await toggleSaveFiesta(strId);
      // Sincronizar con el estado real de la BD
      if (Array.isArray(response.savedFiestas)) {
        setSavedItems(response.savedFiestas.map(String));
      }
    } catch {
      // Si falla la API, revertir el cambio optimista
      setSavedItems(prev =>
        prev.includes(strId) ? prev.filter(x => x !== strId) : [...prev, strId]
      );
    }
  };

  const isSaved = (id) => savedItems.includes(String(id));

  const loadFiestas = async () => {
    try {
      setFiestasLoading(true);
      setFiestasError('');
      const response = await fetchFiestas();

      if (Array.isArray(response.fiestas) && response.fiestas.length > 0) {
        setFiestas(response.fiestas.map(normalizeFiesta));
      } else {
        setFiestas(FIESTAS);
      }
    } catch {
      setFiestas(FIESTAS);
      setFiestasError('No se pudo cargar la API. Mostrando datos locales.');
    } finally {
      setFiestasLoading(false);
    }
  };

  useEffect(() => {
    loadFiestas();
  }, []);

  useEffect(() => {
    refreshCurrentUser();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.lang, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.savedItems, JSON.stringify(savedItems));
  }, [savedItems]);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      lang, setLang,
      theme, setTheme,
      savedItems, toggleSave, isSaved,
      categories: CATEGORIES,
      fiestas,
      fiestasLoading,
      fiestasError,
      reloadFiestas: loadFiestas,
      authLoading,
      refreshCurrentUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
