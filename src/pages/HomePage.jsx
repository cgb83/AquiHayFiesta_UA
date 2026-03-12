import { useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import Sidebar from '../components/ui/Sidebar';
import { CreateFiestaModal } from '../components/modals/CreateModals';
import { FIESTAS, formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function HomePage({ onNavigate }) {
  const { user } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const featured = FIESTAS.filter(f => f.featured);
  const noPerder = FIESTAS.filter(f => !f.featured && !f.upcoming).slice(0, 4);

  return (
    <>
      <SearchBar onSearch={setSearch} onCategory={setCatFilter} />

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
        <Sidebar onNavigate={onNavigate} onCategory={setCatFilter} />
      </div>

      {showCreate && <CreateFiestaModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
