import { useState } from 'react';
import { CATEGORIES } from '../../data/mockData';

export default function SearchBar({ onSearch, onCategory }) {
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
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Buscar..."
          value={query}
          onChange={handleSearch}
        />
      </div>
      <select className="category-select" value={cat} onChange={handleCat}>
        <option value="">Categoría ▾</option>
        {CATEGORIES.map(c => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
    </div>
  );
}
