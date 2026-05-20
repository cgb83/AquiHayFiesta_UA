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

export default function HomePage({ onNavigate, searchQuery = '', categoryFilter = '' }) {
  const { user, fiestas, fiestasLoading, fiestasError, reloadFiestas, categories } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchPage, setSearchPage] = useState(10);

  useEffect(() => {
    const query = searchQuery.trim();
    const hasCategoryFilter = categoryFilter && categoryFilter.trim();
    
    // Si hay búsqueda, buscar en API
    if (query) {
      const timer = setTimeout(async () => {
        try {
          setSearchLoading(true);
          const response = await fetchFiestas({ search: query });
          let results = (response.fiestas || []).map(f => ({
            id: f._id,
            slug: f.slug,
            title: f.title,
            description: f.description || '',
            category: f.category,
            views: f.views || 0,
            image: resolveMediaUrl(f.coverImage || ''),
          }));
          // Si hay filtro de categoría también, aplicarlo
          if (hasCategoryFilter) {
            results = results.filter(f => f.category === categoryFilter);
          }
          setSearchResults(results);
          setSearchPage(10);
        } catch {
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
    
    // Si solo hay filtro de categoría (sin búsqueda), filtrar localmente
    if (hasCategoryFilter) {
      const filtered = fiestas.filter(f => f.category === categoryFilter);
      setSearchResults(filtered);
    } else {
      setSearchResults(null);
    }
  }, [searchQuery, categoryFilter]);

  const hasSearch = searchResults !== null;
  const recommendationSource = fiestas;

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 4);

  const featured = useMemo(
    () => [...recommendationSource].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4),
    [recommendationSource]
  );

  const noPerder = useMemo(() => {
    const featuredIds = new Set(featured.map((f) => f.id));
    const candidates = recommendationSource.filter((f) => !featuredIds.has(f.id));
    return shuffle(candidates).slice(0, 4);
  }, [featured, recommendationSource]);

  const seAcerca = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return recommendationSource
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
  }, [recommendationSource]);

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
        <div className="main-content">
          {hasSearch && (
            <div className="mb-lg">
              <h3 className="section-title">Resultados</h3>
              {!searchLoading && searchResults.length === 0 && (
                <p style={{ color: 'var(--color-muted)' }}>No hay resultados con tu busqueda.</p>
              )}
              <div className="card-grid">
                {searchResults.slice(0, searchPage).map(f => (
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
                      <div className="card-title">{f.title}</div>
                      <div className="card-views">{formatViews(f.views)}</div>
                    </div>
                  </div>
                ))}
              </div>
              {searchResults.length > searchPage && (
                <button
                  className="btn btn-outline"
                  style={{ marginTop: 'var(--space-md)', fontSize: '0.85rem' }}
                  onClick={() => setSearchPage(p => p + 10)}
                >
                  Ver más ({searchResults.length - searchPage} resultados más)
                </button>
              )}
            </div>
          )}

          {/* Featured + Categorías lado a lado */}
          <div className="featured-categories-row mb-lg">
            {/* Featured */}
            <div className="featured-section">
              <h3 className="section-title">Destacado</h3>
              {fiestasLoading && <p style={{ color: 'var(--color-muted)' }}>Cargando fiestas...</p>}
              <div className="card-grid">
                {featured.map(f => (
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
                      <div className="card-title">{f.title}</div>
                      <div className="card-views">{formatViews(f.views)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorías - solo en mobile, a la derecha */}
            <div className="categories-mobile">
              <h3 className="section-title">Categorías</h3>
              <div className="sidebar-categories">
                {displayedCategories.map(c => (
                  <button
                    key={c.id}
                    className="sidebar-cat-item"
                    onClick={() => onNavigate?.('home', `cat:${c.id}`)}
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
                    {showAllCategories ? '▲' : '▼'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* No te pierdas + Se acerca lado a lado */}
          <div className="no-perder-acerca-row mb-lg">
            {/* No te pierdas */}
            <div className="no-perder-section">
              <h3 className="section-title">No te pierdas...</h3>
              {!fiestasLoading && noPerder.length === 0 && (
                <p style={{ color: 'var(--color-muted)' }}>No hay resultados con los filtros actuales.</p>
              )}
              <div className="noperder-grid">
                {noPerder.map(f => (
                  <div
                    key={f.id}
                    className="noperder-item"
                    role="button"
                    tabIndex={0}
                    onClick={() => onNavigate('fiesta', f.slug)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('fiesta', f.slug); } }}
                  >
                    <img
                      className="noperder-thumb"
                      src={f.image}
                      alt={f.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_FIESTA_IMAGE;
                      }}
                    />
                    <div className="noperder-info">
                      <div className="card-title" style={{ fontSize: '0.82rem' }}>{f.title}</div>
                      <div className="card-views">{formatViews(f.views)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Se acerca - en paralelo en mobile */}
            <div className="acerca-section">
              <h3 className="section-title">Se acerca...</h3>
              {seAcerca.length === 0 && (
                <p style={{ color: 'var(--color-muted)' }}>No hay fiestas próximas.</p>
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
                    <div className="upcoming-date">{f.date ? new Date(f.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'Próximamente'}</div>
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
