import { useState } from 'react';
import ContentViewerModal from '../components/modals/ContentViewerModal';
import { CreatePublicationModal } from '../components/modals/CreateModals';
import { FIESTAS, CONTENT_ITEMS, formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';


import Calendar from '../components/ui/Calendar';

function AudioWave() {
  return (
    <div className="audio-thumb">
      <div className="audio-waveform">
        {[...Array(14)].map((_, i) => <span key={i} />)}
      </div>
      <div className="media-play" style={{ background: 'transparent' }}>
        <div className="play-icon" style={{ position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, fontSize: '0.8rem' }}>▶</div>
      </div>
    </div>
  );
}
export default function FiestaPage({ slug, onNavigate }) {
  const { user, toggleSave, isSaved } = useApp();
  const [activeViewer, setActiveViewer] = useState(null); // { item, type }
  const [showPublish, setShowPublish] = useState(false);

  const fiesta = FIESTAS.find(f => f.slug === slug);
  if (!fiesta) return <div className="page-content"><p>Fiesta no encontrada.</p></div>;

  const content = CONTENT_ITEMS[slug] || { videos: [], images: [], documents: [], audios: [] };

  const MediaThumb = ({ item, type }) => (
    <div>
      <div className="media-thumb" onClick={() => setActiveViewer({ item, type })}>
        {type === 'document' ? (
          <div className="doc-thumb" style={{ position: 'static', background: 'var(--color-primary-pale)' }}>📄</div>
        ) : type === 'audio' ? (
          <AudioWave />
        ) : (
          <>
            <img src={item.image} alt={item.title} />
            {type === 'video' && (
              <div className="media-play">
                <div className="play-icon">▶</div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="media-label">{item.title}</div>
      <div className="text-muted" style={{ fontSize: '0.72rem' }}>{formatViews(item.views)}</div>
    </div>
  );

  return (
    <>
      <div className="content-grid fiesta-layout">
        <div className="fiesta-sidebar">
          {/* Header */}
          <div className="flex-between mb-md" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-md)' }}>
                {fiesta.title}
                {user && (
                  <button className={`bookmark-btn ${isSaved(fiesta.id) ? 'saved' : ''}`}
                    onClick={() => toggleSave(fiesta.id)}>
                    {isSaved(fiesta.id) ? '🔖' : '🔖'}
                  </button>
                )}
              </h1>
              <p style={{ marginTop: 8, fontSize: '0.92rem', color: 'var(--color-text-soft)', maxWidth: 480 }}>
                {fiesta.description}
              </p>
              {/* Info block: date + location */}
              <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
                {fiesta.date && (
                  <div className="fiesta-info-block">
                    <span className="fiesta-info-label">📅 Fecha</span>
                    <span className="fiesta-info-value">{fiesta.date}</span>
                  </div>
                )}
                {fiesta.location && (
                  <div className="fiesta-info-block">
                    <span className="fiesta-info-label">📍 Lugar</span>
                    <span className="fiesta-info-value">{fiesta.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="flex-between mb-md">
            <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>Contenido</h3>
            {user && (
              <button className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => setShowPublish(true)}>
                ⊕ Publicar
              </button>
            )}
          </div>

          {/* Videos */}
          {content.videos.length > 0 && (
            <div className="mb-lg">
              <div className="section-subtitle">Vídeos</div>
              <div className="media-grid">
                {content.videos.map(item => <MediaThumb key={item.id} item={item} type="video" />)}
              </div>
            </div>
          )}

          {/* Images */}
          {content.images.length > 0 && (
            <div className="mb-lg">
              <div className="section-subtitle">Imágenes</div>
              <div className="media-grid">
                {content.images.map(item => <MediaThumb key={item.id} item={item} type="image" />)}
              </div>
            </div>
          )}

          {/* Documents */}
          {content.documents.length > 0 && (
            <div className="mb-lg">
              <div className="section-subtitle">Documentos</div>
              <div className="media-grid">
                {content.documents.map(item => <MediaThumb key={item.id} item={item} type="document" />)}
              </div>
            </div>
          )}

          {/* Audios */}
          {content.audios.length > 0 && (
            <div className="mb-lg">
              <div className="section-subtitle">Audios</div>
              <div className="media-grid">
                {content.audios.map(item => <MediaThumb key={item.id} item={item} type="audio" />)}
              </div>
            </div>
          )}

          {/* Subcategories */}
          {fiesta.subcategories?.length > 0 && (
            <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginTop: 8 }}>
              {fiesta.subcategories.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Calendar */}
          <div className="mb-lg">
            <Calendar fiesta={fiesta} />
          </div>

          {/* Categories */}
          <div className="mb-lg">
            <h3 className="section-title" style={{ textAlign: 'right' }}>Categorías</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0 }}>
              {(fiesta.subcategories || []).map(s => (
                <button key={s} className="sidebar-cat-item">{s}</button>
              ))}
            </div>
          </div>

          {/* Explore fiestas */}
          <div>
            <h3 className="section-title" style={{ textAlign: 'right' }}>Explorar fiestas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FIESTAS.filter(f => f.upcoming).map(f => (
                <div key={f.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate('fiesta', f.slug)}>
                  <img src={f.image} alt={f.title}
                    style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: 4 }}>{f.title}</div>
                  <div className="text-muted">{formatViews(f.views)}</div>
                </div>
              ))}
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Ver más</button>
            </div>
          </div>
        </div>
      </div>

      {activeViewer && (
        <ContentViewerModal
          item={activeViewer.item}
          type={activeViewer.type}
          onClose={() => setActiveViewer(null)}
        />
      )}

      {showPublish && (
        <CreatePublicationModal
          fiestaTitle={fiesta.title}
          onClose={() => setShowPublish(false)}
        />
      )}
    </>
  );
}
