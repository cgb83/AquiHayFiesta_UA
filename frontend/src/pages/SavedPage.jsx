import { useMemo, useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import { formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function SavedPage({ onNavigate }) {
  const { savedItems, toggleSave, isSaved, fiestas, categories } = useApp();
  const [catFilter, setCatFilter] = useState('all');

  const saved = fiestas.filter(f => isSaved(f.id));

  const availableCats = useMemo(() => {
    const ids = new Set(saved.map(f => f.category).filter(Boolean));
    return categories.filter(c => ids.has(c.id));
  }, [saved, categories]);

  const filtered = catFilter === 'all' ? saved
    : saved.filter(f => f.category === catFilter);

  return (
    <div className="content-grid">
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
          Guardados
        </h2>

        {/* Filtros de categoría */}
        {availableCats.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
            <button
              className={`category-pill ${catFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setCatFilter('all')}>
              Todos
            </button>
            {availableCats.map(c => (
              <button key={c.id}
                className={`category-pill ${catFilter === c.id ? 'is-active' : ''}`}
                onClick={() => setCatFilter(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="mb-lg">
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 16 }} />

          {filtered.length === 0 && (
            <p style={{ color: 'var(--color-muted)' }}>No tienes elementos guardados.</p>
          )}

          <div className="card-list">
            {filtered.map(f => (
              <div key={f.id} className="saved-item"
                role="button" tabIndex={0}
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate('fiesta', f.slug)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('fiesta', f.slug); } }}>
                <img className="card-thumb" src={f.image} alt={f.title} />
                <div className="card-info">
                  <div className="card-title">{f.title}</div>
                  <div className="card-views">{formatViews(f.views)}</div>
                </div>
                <button className="saved-bookmark"
                  onClick={(e) => { e.stopPropagation(); toggleSave(f.id); }}
                  aria-label="Quitar de guardados">
                  ❤️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sidebar onNavigate={onNavigate} onCategory={(id) => onNavigate('category', id)} />
    </div>
  );
}
