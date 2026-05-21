import { useMemo, useState } from 'react';
import { Bookmark, ChevronUp, ChevronDown } from 'lucide-react';
import Sidebar from '../components/ui/Sidebar';
import { formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';

const DEFAULT_FIESTA_IMAGE = 'https://picsum.photos/seed/ahf-fiesta/640/360';

export default function SavedPage({ onNavigate }) {
  const { toggleSave, isSaved, fiestas, categories, t } = useApp();
  const [catFilter, setCatFilter] = useState('all');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const saved = fiestas.filter(f => isSaved(f.id));

  // Mostrar todas las categorías disponibles del sitio
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 4);

  const filtered = catFilter === 'all' ? saved
    : saved.filter(f => f.category === catFilter);

  // Se acerca - próximas fiestas
  const seAcerca = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return fiestas
      .filter((f) => {
        if (f.upcoming) return true;
        if (!f.date) return false;
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
  }, [fiestas]);

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
        {t('saved_title')}
      </h2>

      <div className="content-grid">
        {/* Main column */}
        <div className="main-content">
          {/* Guardados + Categorías y Se acerca lado a lado */}
          <div className="featured-categories-row mb-lg">
            {/* Guardados section */}
            <div className="featured-section">
              {saved.length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}><Bookmark size={40} style={{ color: 'var(--color-muted)' }} /></div>
                  <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-md)' }}>
                    {t('saved_empty')}
                  </p>
                  <button className="btn btn-primary" onClick={() => onNavigate('home')}>
                    {t('saved_explore')}
                  </button>
                </div>
              )}
              {saved.length > 0 && filtered.length === 0 && (
                <p style={{ color: 'var(--color-muted)' }}>{t('saved_no_cat')}</p>
              )}

              <div className="card-list">
                {filtered.map(f => (
                  <div key={f.id} className="saved-item"
                    role="button" tabIndex={0}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onNavigate('fiesta', f.slug)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('fiesta', f.slug); } }}>
                    <img 
                      className="card-thumb" 
                      src={f.image} 
                      alt={f.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_FIESTA_IMAGE;
                      }}
                    />
                    <div className="card-info">
                      <div className="card-title">{f.title}</div>
                      <div className="card-views">{formatViews(f.views)}</div>
                    </div>
                    <button className="saved-bookmark"
                      onClick={(e) => { e.stopPropagation(); toggleSave(f.id); }}
                      aria-label="Quitar de guardados">
                      <Bookmark size={28} fill="var(--color-primary)" style={{ color: 'var(--color-primary)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorías y Se acerca - lado a lado en mobile */}
            <div className="categories-mobile">
              {/* Categorías */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 className="section-title">{t('home_categorias')}</h3>
                <div className="sidebar-categories">
                  
                  {displayedCategories.map(c => (
                    <button
                      key={c.id}
                      className={`sidebar-cat-item ${catFilter === c.id ? 'is-active' : ''}`}
                      onClick={() => setCatFilter(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                {categories.length > 4 && (
                  <div className="sidebar-show-more">
                    <button
                      className="show-more-btn"
                      onClick={() => setShowAllCategories(o => !o)}
                      title={showAllCategories ? 'Ver menos' : 'Ver más'}
                    >
                      {showAllCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Se acerca */}
              <div>
                <h3 className="section-title">{t('home_se_acerca')}</h3>
                {seAcerca.length === 0 && (
                  <p style={{ color: 'var(--color-muted)' }}>{t('home_no_upcoming')}</p>
                )}
                <div className="upcoming-list">
                  {seAcerca.map(f => (
                    <div
                      key={f.id}
                      className="upcoming-item"
                      role="button"
                      tabIndex={0}
                      onClick={() => onNavigate('fiesta', f.slug)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('fiesta', f.slug); } }}
                    >
                      <div className="upcoming-date">{f.date ? new Date(f.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : t('home_proximamente')}</div>
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
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar onNavigate={onNavigate} onCategory={(id) => onNavigate('category', id)} />
      </div>
    </>
  );
}
