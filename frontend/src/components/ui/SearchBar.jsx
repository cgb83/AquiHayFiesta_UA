import { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SearchBar({ onSearch, onCategory, searchQuery = '', categoryFilter = '' }) {
  const { categories } = useApp();
  const [query, setQuery] = useState(searchQuery);
  const [cat, setCat] = useState(categoryFilter);

  useEffect(() => { setQuery(searchQuery); }, [searchQuery]);
  useEffect(() => { setCat(categoryFilter); }, [categoryFilter]);

  const handleSearch = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch?.(newQuery);
  };

  const handleCat = (e) => {
    const newCat = e.target.value;
    setCat(newCat);
    onCategory?.(newCat);
  };

  const clearCategory = () => {
    setCat('');
    onCategory?.('');
  };

  return (
    <div className="search-row">
      <div className="search-input-wrap">
        <label className="sr-only" htmlFor="search-input">Buscar fiestas</label>
        <Search size={18} className="search-icon" />
        <input
          id="search-input"
          className="search-input"
          placeholder="Buscar..."
          value={query}
          onChange={handleSearch}
        />
      </div>
      <div className="search-category-wrap">
        <label className="sr-only" htmlFor="category-select">Filtrar por categoria</label>
        <select id="category-select" className="category-select" value={cat} onChange={handleCat}>
          <option value="">Categoría</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        {!cat && (
          <ChevronDown size={18} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text)', pointerEvents: 'none' }} />
        )}
        {cat && (
          <button
            className="clear-category-btn"
            onClick={clearCategory}
            title="Limpiar categoría"
            type="button"
            aria-label="Limpiar filtro de categoría"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}