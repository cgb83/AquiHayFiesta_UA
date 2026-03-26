import { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import { CreateFiestaModal } from '../components/modals/CreateModals';
import { formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function HomePage({ onNavigate }) {
  const { user, fiestas, fiestasLoading, fiestasError, reloadFiestas } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const searchValue = search.trim().toLowerCase();
  const filteredFiestas = fiestas.filter((f) => {
    const byCategory = !catFilter || f.category === catFilter;
    const bySearch = !searchValue || f.title.toLowerCase().includes(searchValue) || f.description.toLowerCase().includes(searchValue);
    return byCategory && bySearch;
  });

  const featured = filteredFiestas.filter(f => f.featured);
  const noPerder = filteredFiestas.filter(f => !f.featured && !f.upcoming).slice(0, 4);

  return (
    <>
      {fiestasError && (
        <p role="status" style={{ marginBottom: 'var(--space-md)', color: 'var(--color-text-soft)' }}>
          {fiestasError}
        </p>
      )}

      <div className="flex-between mb-lg">
        <h2 className="section-title" style={{ borderBottom: 'none', marginBottom: 0 }}>
          Descubre tu próxima fiesta
        </h2>
        {user && (
          <button className="btn btn-outline" onClick={() => setShowCreate(true)}
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}>
            ⊕ Crear fiesta
          </button>
        )}
      </div>

      <div className="content-grid">
        {/* Main column */}
        <div>
          {/* Featured */}
          <div className="mb-lg">
            <h3 className="section-title">Destacado</h3>
            {fiestasLoading && <p style={{ color: 'var(--color-muted)' }}>Cargando fiestas...</p>}
            <div className="card-list">
              {featured.map(f => (
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

          {/* No te pierdas */}
          <div>
            <h3 className="section-title">No te pierdas...</h3>
            {!fiestasLoading && noPerder.length === 0 && (
              <p style={{ color: 'var(--color-muted)' }}>No hay resultados con los filtros actuales.</p>
            )}
            <div className="card-grid">
              {noPerder.map(f => (
                <div key={f.id} className="card-grid-item"
                  onClick={() => onNavigate('fiesta', f.slug)}>
                  <img className="card-grid-thumb" src={f.image} alt={f.title} />
                  <div className="card-grid-info">
                    <div className="card-title" style={{ fontSize: '0.9rem' }}>{f.title}</div>
                    <div className="card-views">{formatViews(f.views)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar onNavigate={onNavigate} onCategory={(id) => onNavigate('category', id)} />
      </div>

      {showCreate && (
        <CreateFiestaModal
          onClose={() => setShowCreate(false)}
          onCreated={reloadFiestas}
        />
      )}
    </>
  );
}
