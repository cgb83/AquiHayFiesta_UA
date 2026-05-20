import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, searchQuery = '' }) {
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch?.(newQuery);
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
    </div>
  );
}
