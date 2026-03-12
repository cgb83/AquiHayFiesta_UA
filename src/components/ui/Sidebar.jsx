import { useState } from 'react';
import { CATEGORIES, FIESTAS, formatDate, formatViews } from '../../data/mockData';

export default function Sidebar({ onNavigate, onCategory }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? CATEGORIES : CATEGORIES.slice(0, 3);
  const upcoming = FIESTAS.filter(f => f.upcoming);

  return (
    <aside className="sidebar">
      {/* Categories */}
      <div className="mb-lg">
        <h3 className="section-title" style={{ textAlign: 'right' }}>Categorías</h3>
        <div className="sidebar-categories">
          {displayed.map(c => (
            <button key={c.id} className="sidebar-cat-item"
              onClick={() => onCategory?.(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="sidebar-show-more">
          <button className="show-more-btn" onClick={() => setShowAll(o => !o)}
            title={showAll ? 'Ver menos' : 'Ver más'}>
            {showAll ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <h3 className="section-title" style={{ textAlign: 'right' }}>Se acerca...</h3>
        <div className="upcoming-list">
          {upcoming.map(f => (
            <div key={f.id} className="upcoming-item"
              onClick={() => onNavigate?.('fiesta', f.slug)}>
              <div className="upcoming-date">{formatDate(f.date)}</div>
              <img className="upcoming-thumb" src={f.image} alt={f.title} />
              <div className="upcoming-title">{f.title}</div>
              <div className="text-muted">{formatViews(f.views)}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
