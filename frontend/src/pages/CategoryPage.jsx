import Sidebar from '../components/ui/Sidebar';
import { formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';

const DEFAULT_FIESTA_IMAGE = 'https://picsum.photos/seed/ahf-fiesta/640/360';

export default function CategoryPage({ categoryId, onNavigate }) {
  const { categories, fiestas } = useApp();
  const cat = categories.find(c => c.id === categoryId);
  const fiestasByCategory = fiestas.filter(
    (f) => f.category === categoryId || (Array.isArray(f.categories) && f.categories.includes(categoryId))
  );

  return (
    <div className="content-grid">
      <div>
        <div className="category-header">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700 }}>
            Categoría:
          </h2>
        </div>

        <div className="mb-lg">
          <div className="category-badge">{cat?.label?.toUpperCase() || categoryId.toUpperCase()}</div>
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 16 }} />

          <div className="card-list">
            {fiestasByCategory.length === 0 && (
              <p style={{ color: 'var(--color-muted)' }}>No hay fiestas en esta categoría aún.</p>
            )}
            {fiestasByCategory.map(f => (
              <div key={f.id} className="card-item"
                role="button" tabIndex={0}
                onClick={() => onNavigate('fiesta', f.slug)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('fiesta', f.slug); } }}>
                <img className="card-thumb" src={f.image} alt={f.title}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_FIESTA_IMAGE; }} />
                <div className="card-info">
                  <div className="card-title">{f.title}</div>
                  <div className="card-views">{formatViews(f.views)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sidebar onNavigate={onNavigate} onCategory={(id) => onNavigate('category', id)} />
    </div>
  );
}
