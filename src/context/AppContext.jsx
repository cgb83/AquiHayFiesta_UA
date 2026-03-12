import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // null = guest, object = logged in
  const [lang, setLang] = useState('ES');
  const [theme, setTheme] = useState('standard');
  const [savedItems, setSavedItems] = useState([1, 3]); // mock saved IDs

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

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const toggleSave = (id) => {
    setSavedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const isSaved = (id) => savedItems.includes(id);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      lang, setLang,
      theme, setTheme,
      savedItems, toggleSave, isSaved,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
