import { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import { FIESTAS, CATEGORIES, formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function SavedPage({ onNavigate }) {
  const { savedItems, toggleSave } = useApp();
  const [catFilter, setCatFilter] = useState('all');

  const saved = FIESTAS.filter(f => savedItems.includes(f.id));
  const filtered = catFilter === 'all' ? saved
    : saved.filter(f => f.category === catFilter);

  return (
    <div className="content-grid">
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
          Guardados
        </h2>

        {/* Filter: Todos */}
        <div className="mb-lg">
          <h3 className="section-title">Todos</h3>
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 16 }} />

          {filtered.length === 0 && (
            <p style={{ color: 'var(--color-muted)' }}>No tienes elementos guardados.</p>
          )}

          <div className="card-list">
            {filtered.map(f => (
              <div key={f.id} className="saved-item">
                <img className="card-thumb" src={f.image} alt={f.title}
                  onClick={() => onNavigate('fiesta', f.slug)}
                  style={{ cursor: 'pointer' }} />
                <div className="card-info" style={{ cursor: 'pointer' }}
                  onClick={() => onNavigate('fiesta', f.slug)}>
                  <div className="card-title">{f.title}</div>
                  <div className="card-views">{formatViews(f.views)}</div>
                </div>
                <button className="saved-bookmark"
                  onClick={() => toggleSave(f.id)}
                  title="Quitar de guardados">
                  🔖
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
