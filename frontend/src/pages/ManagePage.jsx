import { useEffect, useState } from 'react';
import ContentViewerModal from '../components/modals/ContentViewerModal';
import { deletePublication, fetchMyPublications, resolveMediaUrl } from '../services/api';

function ConfirmDialog({ title, message, onCancel, onConfirm, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <p>{title}</p>
        <div style={{ color: 'var(--color-text-soft)', marginBottom: 'var(--space-lg)', fontSize: '0.92rem' }}>{message}</div>
        <div className="confirm-buttons">
          <button className="confirm-btn" type="button" onClick={onCancel} disabled={loading}>Cancelar</button>
          <button className="confirm-btn" type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [content, setContent] = useState({});
  const [viewer, setViewer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchMyPublications();
      const grouped = response.grouped || {};

      const normalized = Object.fromEntries(
        Object.entries(grouped).map(([key, types]) => {
          const normalizeItems = (items = []) =>
            items.map((item) => ({
              id: item._id,
              title: item.title,
              image: resolveMediaUrl(item.thumbnailUrl || item.fileUrl),
            }));

          return [
            key,
            {
              videos: normalizeItems(types.videos),
              images: normalizeItems(types.images),
              documents: normalizeItems(types.documents),
              audios: normalizeItems(types.audios),
            },
          ];
        })
      );

      setContent(normalized);
    } catch (err) {
      setError(err.message || 'No se pudo cargar tu contenido.');
      setContent({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleDelete = async (sectionKey, itemId, type) => {
    setConfirmDialog({
      title: 'Borrar publicacion',
      message: 'Esta accion no se puede deshacer. ¿Quieres continuar?',
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          await deletePublication(itemId);
          setContent(prev => ({
            ...prev,
            [sectionKey]: {
              ...prev[sectionKey],
              [type + 's']: (prev[sectionKey][type + 's'] || []).filter(i => i.id !== itemId),
            }
          }));
          setConfirmDialog(null);
        } catch (err) {
          setError(err.message || 'No se pudo eliminar la publicación.');
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleDeleteAll = (sectionKey) => {
    const section = content[sectionKey] || {};
    const allIds = [
      ...(section.videos || []),
      ...(section.images || []),
      ...(section.documents || []),
      ...(section.audios || []),
    ].map((item) => item.id);

    setConfirmDialog({
      title: 'Borrar seccion completa',
      message: 'Se eliminaran todos los archivos de esta seccion. Esta accion no se puede deshacer.',
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          await Promise.all(allIds.map((id) => deletePublication(id)));
          setContent((prev) => ({ ...prev, [sectionKey]: {} }));
          setConfirmDialog(null);
        } catch (err) {
          setError(err.message || 'No se pudo borrar toda la sección.');
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
        Gestiona tu contenido
      </h2>

      {loading && <p className="text-muted">Cargando publicaciones...</p>}
      {error && <p role="alert" style={{ color: '#c0392b' }}>{error}</p>}
      {!loading && Object.keys(content).length === 0 && (
        <p className="text-muted">Todavia no tienes publicaciones creadas.</p>
      )}

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

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          loading={confirmLoading}
          onCancel={() => {
            if (!confirmLoading) setConfirmDialog(null);
          }}
          onConfirm={confirmDialog.onConfirm}
        />
      )}
    </>
  );
}
