import { useEffect, useState } from 'react';
import ContentViewerModal from '../components/modals/ContentViewerModal';
import { EditFiestaModal } from '../components/modals/CreateModals';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { deletePublication, updatePublication, deleteFiesta, fetchMyPublications, fetchMyFiestas, fetchFiestas, fetchAllPublications, resolveMediaUrl } from '../services/api';
import TestUpload from '../components/TestUpload';
import { deletePublication, updatePublication, deleteFiesta, fetchMyPublications, fetchMyFiestas, resolveMediaUrl } from '../services/api';

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

function EditPublicationModal({ item, onClose, onSaved }) {
  const [title, setTitle]       = useState(item.title || '');
  const [description, setDesc]  = useState(item.description || '');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSave = async () => {
    if (!title.trim()) { setError('El título es obligatorio.'); return; }
    try {
      setLoading(true);
      setError('');
      await updatePublication(item.id, { title: title.trim(), description: description.trim() });
      onSaved(item.id, title.trim(), description.trim());
      onClose();
    } catch (err) {
      setError(err.message || 'No se pudo guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true"
        style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()} tabIndex={-1}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <h2 className="modal-title">Editar publicación</h2>
        {error && <p role="alert" style={{ color: '#c0392b', marginBottom: 12 }}>{error}</p>}
        <div className="form-group mb-md">
          <label className="form-label" htmlFor="ep-title">Título</label>
          <input id="ep-title" className="form-input" value={title}
            onChange={e => setTitle(e.target.value)} disabled={loading} />
        </div>
        <div className="form-group mb-md">
          <label className="form-label" htmlFor="ep-desc">Descripción</label>
          <input id="ep-desc" className="form-input" value={description}
            onChange={e => setDesc(e.target.value)} disabled={loading} />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

function MediaGroup({ label, items, type, onView, onDelete, onEdit }) {
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
            <button className="manage-edit-btn"
              onClick={e => { e.stopPropagation(); onEdit(item, type); }}
              aria-label="Editar publicación">✏
            </button>
            <button className="manage-delete-btn"
              onClick={e => { e.stopPropagation(); onDelete(item.id, type); }}
              aria-label="Borrar publicacion">
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ManagePage() {
  const { user } = useApp();
  const { addToast } = useToast();
  const isAdmin = user?.role === 'admin';

  const [content, setContent] = useState({});
  const [myFiestas, setMyFiestas] = useState([]);
  const [fiestaLoading, setFiestaLoading] = useState(false);
  const [editFiesta, setEditFiesta] = useState(null);
  const [editPublication, setEditPublication] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const normalizeFiestaItem = (f) => ({
    id: f._id,
    slug: f.slug,
    title: f.title,
    description: f.description || '',
    category: f.category,
    categories: f.categories || [],
    startDate: f.startDate || null,
    endDate: f.endDate || null,
    location: f.location || {},
    image: resolveMediaUrl(f.coverImage || ''),
  });

  const loadMyFiestas = async () => {
    try {
      setFiestaLoading(true);
      const response = isAdmin ? await fetchFiestas() : await fetchMyFiestas();
      const list = response.fiestas || [];
      setMyFiestas(list.map(normalizeFiestaItem));
    } catch {
      // silently fail — show empty list
    } finally {
      setFiestaLoading(false);
    }
  };

  const normalizeItems = (items = []) =>
    items.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description || '',
      image: resolveMediaUrl(item.thumbnailUrl || item.fileUrl),
    }));

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');

      let grouped = {};

      if (isAdmin) {
        const response = await fetchAllPublications();
        const publications = response.publications || [];
        publications.forEach(pub => {
          const key = pub.fiesta?.title || 'Sin fiesta';
          if (!grouped[key]) grouped[key] = { videos: [], images: [], documents: [], audios: [] };
          grouped[key][pub.contentType + 's'].push(pub);
        });
      } else {
        const response = await fetchMyPublications();
        grouped = response.grouped || {};
      }

      const normalized = Object.fromEntries(
        Object.entries(grouped).map(([key, types]) => [
          key,
          {
            videos:    normalizeItems(types.videos),
            images:    normalizeItems(types.images),
            documents: normalizeItems(types.documents),
            audios:    normalizeItems(types.audios),
          },
        ])
      );

      setContent(normalized);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el contenido.');
      setContent({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyFiestas();
    loadContent();
  }, [isAdmin]);

  const handleEditPublicationSaved = (id, newTitle, newDesc) => {
    setContent(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(section => {
        ['videos', 'images', 'documents', 'audios'].forEach(typeKey => {
          if (next[section][typeKey]) {
            next[section] = {
              ...next[section],
              [typeKey]: next[section][typeKey].map(item =>
                item.id === id ? { ...item, title: newTitle, description: newDesc } : item
              ),
            };
          }
        });
      });
      return next;
    });
  };

  const handleDeleteFiesta = (fiestaId) => {
    setConfirmDialog({
      title: 'Borrar fiesta',
      message: 'Se eliminará la fiesta y no se puede deshacer. ¿Continuar?',
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          await deleteFiesta(fiestaId);
          setMyFiestas(prev => prev.filter(f => f.id !== fiestaId));
          setConfirmDialog(null);
          addToast('Fiesta eliminada correctamente.');
        } catch (err) {
          addToast(err.message || 'No se pudo eliminar la fiesta.', 'error');
          setConfirmDialog(null);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleDelete = async (sectionKey, itemId, type) => {
    setConfirmDialog({
      title: 'Borrar publicación',
      message: 'Esta acción no se puede deshacer. ¿Quieres continuar?',
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
          addToast('Publicación eliminada.');
        } catch (err) {
          addToast(err.message || 'No se pudo eliminar la publicación.', 'error');
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
      title: 'Borrar sección completa',
      message: 'Se eliminarán todos los archivos de esta sección. Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          await Promise.all(allIds.map((id) => deletePublication(id)));
          setContent((prev) => ({ ...prev, [sectionKey]: {} }));
          setConfirmDialog(null);
          addToast('Sección eliminada correctamente.');
        } catch (err) {
          addToast(err.message || 'No se pudo borrar toda la sección.', 'error');
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700 }}>
          {isAdmin ? 'Panel de administración' : 'Gestiona tu contenido'}
        </h2>
        {isAdmin && (
          <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>
            ADMIN
          </span>
        )}
      </div>

<<<<<<< HEAD
      {/* ── Fiestas ─────────────────────────────── */}
=======
      {/* ── Test Upload ─────────────────────────────── */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <TestUpload />
      </div>

      {/* ── Mis Fiestas ─────────────────────────────── */}
>>>>>>> dbd58c8 (WIP: cambios en ManagePage)
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
        {isAdmin ? 'Todas las fiestas' : 'Mis Fiestas'}
      </h3>

      {fiestaLoading && <p className="text-muted">Cargando fiestas...</p>}
      {!fiestaLoading && myFiestas.length === 0 && (
        <p className="text-muted" style={{ marginBottom: 'var(--space-xl)' }}>Todavía no has creado ninguna fiesta.</p>
      )}

      {myFiestas.length > 0 && (
        <div className="manage-fiesta-list" style={{ marginBottom: 'var(--space-xl)' }}>
          {myFiestas.map(f => (
            <div key={f.id} className="manage-fiesta-item">
              {f.image
                ? <img src={f.image} alt={f.title} className="manage-fiesta-thumb" />
                : <div className="manage-fiesta-thumb manage-fiesta-thumb--empty">🎉</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</div>
                {f.location?.city && <div className="text-muted" style={{ fontSize: '0.8rem' }}>📍 {f.location.city}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() => setEditFiesta(f)}>
                  Editar
                </button>
                <button className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '4px 10px', color: '#c0392b', borderColor: '#c0392b' }}
                  onClick={() => handleDeleteFiesta(f.id)}>
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
        {isAdmin ? 'Todas las publicaciones' : 'Mis Publicaciones'}
      </h3>

      {loading && <p className="text-muted">Cargando publicaciones...</p>}
      {error && <p role="alert" style={{ color: '#c0392b' }}>{error}</p>}
      {!loading && Object.keys(content).length === 0 && (
        <p className="text-muted">{isAdmin ? 'No hay publicaciones en la plataforma.' : 'Todavía no tienes publicaciones creadas.'}</p>
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

          <MediaGroup label="Vídeos"     items={types.videos}    type="video"    onView={(i,t) => setViewer({item:i,type:t})} onEdit={i => setEditPublication(i)} onDelete={(id,t) => handleDelete(sectionKey, id, 'video')} />
          <MediaGroup label="Imágenes"   items={types.images}    type="image"    onView={(i,t) => setViewer({item:i,type:t})} onEdit={i => setEditPublication(i)} onDelete={(id,t) => handleDelete(sectionKey, id, 'image')} />
          <MediaGroup label="Documentos" items={types.documents} type="document" onView={(i,t) => setViewer({item:i,type:t})} onEdit={i => setEditPublication(i)} onDelete={(id,t) => handleDelete(sectionKey, id, 'document')} />
          <MediaGroup label="Audios"     items={types.audios}    type="audio"    onView={(i,t) => setViewer({item:i,type:t})} onEdit={i => setEditPublication(i)} onDelete={(id,t) => handleDelete(sectionKey, id, 'audio')} />
        </div>
      ))}

      {editPublication && (
        <EditPublicationModal
          item={editPublication}
          onClose={() => setEditPublication(null)}
          onSaved={(id, title, desc) => {
            handleEditPublicationSaved(id, title, desc);
            addToast('Publicación actualizada correctamente.');
          }}
        />
      )}

      {editFiesta && (
        <EditFiestaModal
          fiesta={editFiesta}
          onClose={() => setEditFiesta(null)}
          onUpdated={() => { setEditFiesta(null); loadMyFiestas(); addToast('Fiesta actualizada correctamente.'); }}
        />
      )}

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
