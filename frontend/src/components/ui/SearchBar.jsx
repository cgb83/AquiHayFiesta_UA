import { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SearchBar({ onSearch, onCategory, searchQuery = '', categoryFilter = '' }) {
  const { categories, t } = useApp();
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
        <label className="sr-only" htmlFor="search-input">{t('search_label')}</label>
        <Search size={18} className="search-icon" />
        <input
          id="search-input"
          className="search-input"
          placeholder={t('search_placeholder')}
          value={query}
          onChange={handleSearch}
        />
      </div>
      <div className="search-category-wrap">
        <label className="sr-only" htmlFor="category-select">{t('search_cat_label')}</label>
        <select id="category-select" className="category-select" value={cat} onChange={handleCat}>
          <option value="">{t('search_cat_placeholder')}</option>
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
            title={t('search_clear')}
            type="button"
            aria-label={t('search_clear')}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}