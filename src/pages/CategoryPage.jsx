import Sidebar from '../components/ui/Sidebar';
import { FIESTAS, CATEGORIES, formatViews } from '../data/mockData';

export default function CategoryPage({ categoryId, onNavigate }) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  const fiestas = FIESTAS.filter(f => f.category === categoryId);

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
            {fiestas.length === 0 && (
              <p style={{ color: 'var(--color-muted)' }}>No hay fiestas en esta categoría aún.</p>
            )}
            {fiestas.map(f => (
              <div key={f.id} className="card-item"
                onClick={() => onNavigate('fiesta', f.slug)}>
                <img className="card-thumb" src={f.image} alt={f.title} />
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
