import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import { CreateFiestaModal } from '../components/modals/CreateModals';
import { formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { fetchFiestas, resolveMediaUrl } from '../services/api';

const DEFAULT_FIESTA_IMAGE = 'https://picsum.photos/seed/ahf-fiesta/640/360';

function shuffle(list) {
  const clone = [...list];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export default function HomePage({ onNavigate, searchQuery = '' }) {
  const { user, fiestas, fiestasLoading, fiestasError, reloadFiestas } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) { setSearchResults(null); return; }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await fetchFiestas({ search: query });
        setSearchResults((response.fiestas || []).map(f => ({
          id: f._id,
          slug: f.slug,
          title: f.title,
          description: f.description || '',
          category: f.category,
          views: f.views || 0,
          image: resolveMediaUrl(f.coverImage || ''),
        })));
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const activeFiestas = searchResults !== null ? searchResults : fiestas;

  const featured = useMemo(
    () => [...activeFiestas].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    [activeFiestas]
  );

  const noPerder = useMemo(() => {
    const featuredIds = new Set(featured.map((f) => f.id));
    const candidates = activeFiestas.filter((f) => !featuredIds.has(f.id));
    return shuffle(candidates).slice(0, 4);
  }, [featured, activeFiestas]);

  return (
    <>
      {fiestasError && !searchQuery && (
        <p role="status" style={{ marginBottom: 'var(--space-md)', color: 'var(--color-text-soft)' }}>
          {fiestasError}
        </p>
      )}
      {searchLoading && (
        <p style={{ marginBottom: 'var(--space-md)', color: 'var(--color-muted)' }}>Buscando...</p>
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
                  role="button" tabIndex={0}
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
                  role="button" tabIndex={0}
                  onClick={() => onNavigate('fiesta', f.slug)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('fiesta', f.slug); } }}>
                  <img
                    className="card-grid-thumb"
                    src={f.image}
                    alt={f.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_FIESTA_IMAGE;
                    }}
                  />
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
