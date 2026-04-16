import { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES, FIESTAS } from '../data/mockData';
import { fetchFiestas, fetchMe, resolveMediaUrl } from '../services/api';

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
  const [savedItems, setSavedItems] = useState(() => parseJSON(STORAGE_KEYS.savedItems, [1, 3]));
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
      id: userData.id,
      name: userData.name || userData.username || '',
      email: userData.email || '',
      country: userData.country || '',
      city: userData.city || '',
    };
    setUser(normalizedUser);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser));
    if (token) localStorage.setItem(STORAGE_KEYS.token, token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.token);
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
          id: me._id || me.id,
          username: me.username,
          name: me.username,
          email: me.email,
          country: me.country,
          city: me.city,
        },
        token
      );
    } catch {
      logout();
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleSave = (id) => {
    setSavedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const isSaved = (id) => savedItems.includes(id);

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
