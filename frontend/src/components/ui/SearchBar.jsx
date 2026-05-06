import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function SearchBar({ onSearch, onCategory }) {
  const { categories } = useApp();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleCat = (e) => {
    setCat(e.target.value);
    onCategory?.(e.target.value);
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
