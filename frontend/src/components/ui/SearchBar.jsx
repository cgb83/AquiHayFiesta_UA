import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function SearchBar({ onSearch, onCategory, searchQuery = '', categoryFilter = '' }) {
  const { categories } = useApp();
  const [query, setQuery] = useState(searchQuery);
  const [cat, setCat] = useState(categoryFilter);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setCat(categoryFilter);
  }, [categoryFilter]);

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

  return (
    <div className="search-row">
      <div className="search-input-wrap">
        <label className="sr-only" htmlFor="search-input">Buscar fiestas</label>
        <input
          id="search-input"
          className="search-input"
          placeholder="Buscar..."
          value={query}
          onChange={handleSearch}
        />
      </div>
      <label className="sr-only" htmlFor="category-select">Filtrar por categoria</label>
      <select id="category-select" className="category-select" value={cat} onChange={handleCat}>
        <option value="">Categoría ▾</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
    </div>
  );
}
