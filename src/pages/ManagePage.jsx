import { useState } from 'react';
import { CONTENT_ITEMS } from '../data/mockData';
import ContentViewerModal from '../components/modals/ContentViewerModal';

const MOCK_USER_CONTENT = {
  'San Valentín': {
    videos: [
      { id: 'v1', title: 'DIY Regalo para...', image: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=200&q=70' },
      { id: 'v2', title: 'Receta cupcakes en...', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&q=70' },
      { id: 'v3', title: 'Ayúdame a preparar...', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&q=70' },
      { id: 'v4', title: 'Cómo preparar....', image: 'https://images.unsplash.com/photo-1549032305-e816babf0eb2?w=200&q=70' },
    ],
    images: [
      { id: 'i1', title: 'Ideas para regalar...', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=70' },
      { id: 'i2', title: 'Te ayudamos a...', image: 'https://images.unsplash.com/photo-1549032305-e816babf0eb2?w=200&q=70' },
      { id: 'i3', title: 'Cómo hacer paso...', image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=200&q=70' },
    ],
    documents: [
      { id: 'd1', title: 'Poemas de amor...' },
      { id: 'd2', title: '10 ideas de regalos...' },
      { id: 'd3', title: 'Ayúdame a preparar...' },
    ],
  },
  'Fiesta de Ibiza': {
    audios: [
      { id: 'a1', title: 'Poemas de amor...' },
      { id: 'a2', title: '10 ideas de regalos...' },
      { id: 'a3', title: 'Ayúdame a preparar...' },
    ],
  },
};

function MediaGroup({ label, items, type, onView, onDelete }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-md">
      <div className="section-subtitle">{label}</div>
      <div className="manage-thumb-grid">
        {items.map(item => (
          <div key={item.id} className="manage-thumb-item"
            onClick={() => onView(item, type)}>
            {item.image ? (
              <img src={item.image} alt={item.title} />
            ) : type === 'document' ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-pale)', fontSize: '1.8rem' }}>📄</div>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-pale)', fontSize: '1.8rem' }}>🎵</div>
            )}
            <button className="manage-delete-btn"
              onClick={e => { e.stopPropagation(); onDelete(item.id, type); }}>
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ManagePage() {
  const [content, setContent] = useState(MOCK_USER_CONTENT);
  const [viewer, setViewer] = useState(null);

  const handleDelete = (sectionKey, itemId, type) => {
    setContent(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [type + 's']: (prev[sectionKey][type + 's'] || []).filter(i => i.id !== itemId),
      }
    }));
  };

  const handleDeleteAll = (sectionKey) => {
    setContent(prev => ({ ...prev, [sectionKey]: {} }));
  };

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
        Gestiona tu contenido
      </h2>

      {Object.entries(content).map(([sectionKey, types]) => (
        <div key={sectionKey} className="manage-section">
          <div className="manage-section-header">
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem' }}>{sectionKey}</h3>
            <button className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              onClick={() => handleDeleteAll(sectionKey)}>
              Borrar todo
            </button>
          </div>

          <MediaGroup label="Vídeos"     items={types.videos}    type="video"    onView={(i,t) => setViewer({item:i,type:t})} onDelete={(id,t) => handleDelete(sectionKey, id, 'video')} />
          <MediaGroup label="Imágenes"   items={types.images}    type="image"    onView={(i,t) => setViewer({item:i,type:t})} onDelete={(id,t) => handleDelete(sectionKey, id, 'image')} />
          <MediaGroup label="Documentos" items={types.documents} type="document" onView={(i,t) => setViewer({item:i,type:t})} onDelete={(id,t) => handleDelete(sectionKey, id, 'document')} />
          <MediaGroup label="Audios"     items={types.audios}    type="audio"    onView={(i,t) => setViewer({item:i,type:t})} onDelete={(id,t) => handleDelete(sectionKey, id, 'audio')} />
        </div>
      ))}

      {viewer && (
        <ContentViewerModal
          item={viewer.item}
          type={viewer.type}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
}
