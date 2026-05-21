import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatDate, formatViews } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import Calendar from './Calendar';

const DEFAULT_FIESTA_IMAGE = 'https://picsum.photos/seed/ahf-fiesta/640/360';

export default function Sidebar({ onNavigate, onCategory, fiesta = null }) {
  const { categories, fiestas, t } = useApp();
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? categories : categories.slice(0, 3);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = fiestas
    .filter((f) => {
      if (!f.date) return Boolean(f.upcoming);
      const eventDate = new Date(`${f.date}T00:00:00`);
      return !Number.isNaN(eventDate.getTime()) && eventDate >= today;
    })
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date) - new Date(b.date);
    })
    .slice(0, 5);

  return (
    <aside className="sidebar">
      {fiesta && (
        <div className="mb-lg">
          <Calendar fiesta={fiesta} />
        </div>
      )}

      <div className="mb-lg">
        <h3 className="section-title" style={{ textAlign: 'right' }}>{t('home_categorias')}</h3>
        <div className="sidebar-categories">
          {displayed.map(c => (
            <button
              key={c.id}
              className="sidebar-cat-item"
              onClick={() => onCategory?.(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="sidebar-show-more">
          <button
            className="show-more-btn"
            onClick={() => setShowAll(o => !o)}
            title={showAll ? 'Ver menos' : 'Ver más'}
          >
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div>
        <h3 className="section-title" style={{ textAlign: 'right' }}>{t('home_se_acerca')}</h3>
        <div className="upcoming-list">
          {upcoming.length === 0 && (
            <p className="text-muted" style={{ textAlign: 'right' }}>{t('home_no_upcoming')}</p>
          )}
          {upcoming.map(f => (
            <div
              key={f.id}
              className="upcoming-item"
              role="button"
              tabIndex={0}
              onClick={() => onNavigate?.('fiesta', f.slug)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate?.('fiesta', f.slug); } }}
            >
              <div className="upcoming-date">{formatDate(f.date)}</div>
              <img
                className="upcoming-thumb"
                src={f.image}
                alt={f.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_FIESTA_IMAGE;
                }}
              />
              <div className="upcoming-title">{f.title}</div>
              <div className="text-muted">{formatViews(f.views)}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
