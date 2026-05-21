import { useEffect, useState, useRef } from 'react';
import { PartyPopper, MapPin, Plus, Pencil, Trash2, FileText, Eraser, ChevronUp, ChevronDown } from 'lucide-react';
import ContentViewerModal from '../components/modals/ContentViewerModal';
import { EditFiestaModal } from '../components/modals/CreateModals';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { deletePublication, updatePublication, deleteFiesta, fetchMyPublications, fetchMyFiestas, fetchFiestas, fetchAllPublications, resolveMediaUrl } from '../services/api';

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

function ConfirmDialog({ title, message, onCancel, onConfirm, loading, t }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <p>{title}</p>
        <div style={{ color: 'var(--color-text-soft)', marginBottom: 'var(--space-lg)', fontSize: '0.92rem' }}>{message}</div>
        <div className="confirm-buttons">
          <button className="confirm-btn" type="button" onClick={onCancel} disabled={loading}>{t('cancelar')}</button>
          <button className="confirm-btn" type="button" onClick={onConfirm} disabled={loading}>
            {loading ? t('procesando') : t('confirmar')}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditPublicationModal({ item, onClose, onSaved, t }) {
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
        {error && <p role="alert" style={{ color: 'var(--color-surface)', marginBottom: 12 }}>{error}</p>}
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
          {loading ? t('guardando') : t('guardar')}
        </button>
      </div>
    </div>
  );
}

function MediaGroup({ label, items, type, onView, onDelete, onEdit, expanded, onToggleExpand, t }) {
  if (!items || items.length === 0) return null;
  
  const gridRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (!gridRef.current) return;
      
      const container = gridRef.current;
      const children = Array.from(container.children);
      
      if (children.length === 0) {
        setHasOverflow(false);
        return;
      }

      // Detectar si es mobile o desktop
      const isMobile = window.innerWidth <= 768;
      let hasOverflowDetected = false;

      if (isMobile) {
        // En mobile: scroll horizontal
        // Mostrar "Ver más" si el contenido necesita scroll
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        hasOverflowDetected = scrollWidth > clientWidth + 10; // 10px de tolerancia
      } else {
        // En desktop: flex-wrap
        // Mostrar "Ver más" si hay múltiples filas
        let firstRowHeight = children[0]?.offsetHeight || 0;
        let hasMultipleRows = false;

        children.forEach((child, idx) => {
          if (idx > 0 && child.offsetTop > firstRowHeight / 2) {
            hasMultipleRows = true;
          }
        });

        hasOverflowDetected = hasMultipleRows;
      }

      setHasOverflow(hasOverflowDetected);
    };

    // Esperar a que se renderice el contenido
    const timer = setTimeout(checkOverflow, 100);
    
    const observer = new ResizeObserver(checkOverflow);
    if (gridRef.current) observer.observe(gridRef.current);

    window.addEventListener('resize', checkOverflow);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [items.length]);

  return (
    <div className="mb-md">
      <div className="section-subtitle">{label}</div>
      <div ref={gridRef} className="manage-thumb-grid manage-thumb-grid--desktop">
        {items.map(item => (
          <div key={item.id} className="manage-thumb-item"
            onClick={() => onView(item, type)}>
            {type === 'document' ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-pale)', fontSize: '1.8rem' }}><FileText size={32} style={{ color: 'var(--color-primary)' }} /></div>
            ) : type === 'audio' ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', background: 'var(--color-primary-pale)' }}>
                <AudioWave />
              </div>
            ) : item.image ? (
              <img src={item.image} alt={item.title} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-pale)', fontSize: '1.8rem' }}>🎵</div>
            )}


            <button className="manage-edit-btn"
              onClick={e => { e.stopPropagation(); onEdit(item, type); }}
              aria-label="Editar publicación"><Pencil size={12} />
            </button>
            <button className="manage-delete-btn"
              onClick={e => { e.stopPropagation(); onDelete(item.id, type); }}
              aria-label="Borrar publicacion">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      {hasOverflow && (
        <button 
          className="btn btn-outline manage-expand-btn-mobile" 
          onClick={onToggleExpand}
          style={{ fontSize: '0.82rem', padding: '6px 14px', marginTop: 'var(--space-sm)' }}
        >
          {expanded ? <><ChevronUp size={14} /> {t('manage_ver_menos')} ({items.length} total)</> : <><ChevronDown size={14} /> {t('manage_ver_mas')} ({items.length} total)</>}
        </button>
      )}
    </div>
  );
}

export default function ManagePage({ onNavigate }) {
  const { user, reloadFiestas, t } = useApp();
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
  const [expandedGroups, setExpandedGroups] = useState({});

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
      title: t('manage_borrar_fiesta_title'),
      message: t('manage_borrar_fiesta_msg'),
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
      title: t('manage_borrar_pub_title'),
      message: t('manage_borrar_pub_msg'),
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
      title: t('manage_borrar_seccion_title'),
      message: t('manage_borrar_seccion_msg'),
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
          {isAdmin ? t('manage_admin_title') : t('manage_title')}
        </h2>
        {isAdmin && (
          <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>
            ADMIN
          </span>
        )}
      </div>

      {/* ── Mis Fiestas ─────────────────────────────── */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
        {isAdmin ? t('manage_todas_fiestas') : t('manage_mis_fiestas')}
      </h3>

      {fiestaLoading && <p className="text-muted">Cargando fiestas...</p>}
      {!fiestaLoading && myFiestas.length === 0 && (
        <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <p className="text-muted">{isAdmin ? t('manage_no_fiestas_admin') : t('manage_no_fiestas')}</p>
          {!isAdmin && onNavigate && (
            <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '6px 16px' }}
              onClick={() => onNavigate('create-fiesta')}>
              <Plus size={16} /> {t('manage_primera_fiesta')}
            </button>
          )}
        </div>
      )}

      {myFiestas.length > 0 && (
        <div className="manage-fiesta-list" style={{ marginBottom: 'var(--space-xl)' }}>
          {myFiestas.map(f => (
            <div 
              key={f.id} 
              className="manage-fiesta-item"
              onClick={() => onNavigate('fiesta', f.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('fiesta', f.slug);
                }
              }}
            >
              {f.image
                ? <img src={f.image} alt={f.title} className="manage-fiesta-thumb" />
                : <PartyPopper size={24} style={{ color: 'var(--color-primary)' }} />
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="manage-fiesta-title">
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'inherit' }}>
                    {f.title}
                  </div>
                </div>
                {f.location?.city && <div className="text-muted" style={{ fontSize: '0.8rem' }}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{f.location.city}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              <button className="btn btn-outline manage-fiesta-btn" style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={(e) => { e.stopPropagation(); setEditFiesta(f); }}
                aria-label="Editar fiesta">
                <Pencil size={14} />
                <span className="manage-fiesta-btn-text"> {t('manage_editar')}</span>
              </button>
              <button className="btn btn-outline btn-danger manage-fiesta-btn" style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={(e) => { e.stopPropagation(); handleDeleteFiesta(f.id); }}
                aria-label="Borrar fiesta">
                <Trash2 size={14} />
                <span className="manage-fiesta-btn-text"> {t('manage_borrar')}</span>
              </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
        {isAdmin ? t('manage_todas_pubs') : t('manage_mis_pubs')}
      </h3>

      {loading && <p className="text-muted">{t('manage_cargando_fiestas')}</p>}
      {error && <p role="alert" className="alerta">{error}</p>}
      {!loading && Object.keys(content).length === 0 && (
        <p className="text-muted">{isAdmin ? t('manage_no_pubs_admin') : t('manage_no_pubs')}</p>
      )}

      {Object.entries(content).map(([sectionKey, types]) => (
        <div key={sectionKey} className="manage-section">
          <div className="manage-section-header">
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem' }}>{sectionKey}</h3>
            <button className="btn btn-outline manage-section-btn" style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              onClick={() => handleDeleteAll(sectionKey)}>
              <Eraser size={14} />
              <span className="manage-section-btn-text"> {t('manage_borrar_todo')}</span>
            </button>
          </div>

          <MediaGroup label={t('fiesta_videos')}     items={types.videos}    type="video"    onView={(i,tp) => setViewer({item:i,type:tp})} onEdit={i => setEditPublication(i)} onDelete={(id,tp) => handleDelete(sectionKey, id, 'video')} expanded={expandedGroups[`${sectionKey}-video`] || false} onToggleExpand={() => setExpandedGroups(prev => ({ ...prev, [`${sectionKey}-video`]: !prev[`${sectionKey}-video`] }))} t={t}/>
          <MediaGroup label={t('fiesta_imagenes')}   items={types.images}    type="image"    onView={(i,tp) => setViewer({item:i,type:tp})} onEdit={i => setEditPublication(i)} onDelete={(id,tp) => handleDelete(sectionKey, id, 'image')} expanded={expandedGroups[`${sectionKey}-image`] || false} onToggleExpand={() => setExpandedGroups(prev => ({ ...prev, [`${sectionKey}-image`]: !prev[`${sectionKey}-image`] }))}  t={t}/>
          <MediaGroup label={t('fiesta_documentos')} items={types.documents} type="document" onView={(i,tp) => setViewer({item:i,type:tp})} onEdit={i => setEditPublication(i)} onDelete={(id,tp) => handleDelete(sectionKey, id, 'document')} expanded={expandedGroups[`${sectionKey}-document`] || false} onToggleExpand={() => setExpandedGroups(prev => ({ ...prev, [`${sectionKey}-document`]: !prev[`${sectionKey}-document`] }))}  t={t}/>
          <MediaGroup label={t('fiesta_audios')}     items={types.audios}    type="audio"    onView={(i,tp) => setViewer({item:i,type:tp})} onEdit={i => setEditPublication(i)} onDelete={(id,tp) => handleDelete(sectionKey, id, 'audio')} expanded={expandedGroups[`${sectionKey}-audio`] || false} onToggleExpand={() => setExpandedGroups(prev => ({ ...prev, [`${sectionKey}-audio`]: !prev[`${sectionKey}-audio`] }))}  t={t}/>
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
          t={t}
        />
      )}

      {editFiesta && (
        <EditFiestaModal
          fiesta={editFiesta}
          onClose={() => setEditFiesta(null)}
          onUpdated={() => { setEditFiesta(null); loadMyFiestas(); reloadFiestas(); addToast('Fiesta actualizada correctamente.'); }}
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
          t={t}
        />
      )}
    </>
  );
}
