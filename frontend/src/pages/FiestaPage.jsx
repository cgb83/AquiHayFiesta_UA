import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ContentViewerModal from '../components/modals/ContentViewerModal';
import { CreatePublicationModal } from '../components/modals/CreateModals';
import { formatDownloads, formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { fetchFiestaBySlug, fetchPublicationsByFiesta, registerDownload, resolveMediaUrl } from '../services/api';

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
export default function FiestaPage({ slug, onNavigate, searchQuery = '' }) {
  const { user, fiestas, toggleSave, isSaved } = useApp();
  const [activeViewer, setActiveViewer] = useState(null); // { item, type }
  const [showPublish, setShowPublish] = useState(false);
  const [content, setContent] = useState({ videos: [], images: [], documents: [], audios: [] });
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');
  const [fiestaDetail, setFiestaDetail] = useState(null);
  const lastDetailSlugRef = useRef(null);

  const fiesta = fiestaDetail || fiestas.find(f => f.slug === slug);

  // Filtrar contenido basado en searchQuery
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return content;

    const query = searchQuery.toLowerCase();
    return {
      videos: content.videos.filter(item => item.title.toLowerCase().includes(query)),
      images: content.images.filter(item => item.title.toLowerCase().includes(query)),
      documents: content.documents.filter(item => item.title.toLowerCase().includes(query)),
      audios: content.audios.filter(item => item.title.toLowerCase().includes(query)),
    };
  }, [content, searchQuery]);

  const loadFiestaDetail = useCallback(async () => {
    try {
      const response = await fetchFiestaBySlug(slug);
      if (!response?.fiesta) return;

      const data = response.fiesta;
      setFiestaDetail({
        id: data._id,
        slug: data.slug,
        title: data.title,
        description: data.description || '',
        category: data.category,
        subcategories: data.subcategories || [],
        views: data.views || 0,
        image: resolveMediaUrl(data.coverImage || ''),
        date: data.startDate ? String(data.startDate).slice(0, 10) : null,
        location: data.location?.city || data.location?.country || null,
      });
    } catch {
      // Keep fallback from context list.
    }
  }, [slug]);

  const loadContent = useCallback(async () => {
    if (!fiesta) return;

    try {
      setContentLoading(true);
      setContentError('');
      const response = await fetchPublicationsByFiesta(slug);
      const publications = response.publications || [];

      const nextContent = { videos: [], images: [], documents: [], audios: [] };
      publications.forEach((pub) => {
        const item = {
          id: pub._id,
          title: pub.title,
          downloads: pub.downloads || 0,
          image: resolveMediaUrl(pub.thumbnailUrl || pub.fileUrl),
          fileUrl: resolveMediaUrl(pub.fileUrl),
          fileName: pub.fileName || pub.title,
          fromApi: true,
        };

        if (pub.contentType === 'video') nextContent.videos.push(item);
        if (pub.contentType === 'image') nextContent.images.push(item);
        if (pub.contentType === 'document') nextContent.documents.push(item);
        if (pub.contentType === 'audio') nextContent.audios.push(item);
      });
      setContent(nextContent);
    } catch {
      setContent({ videos: [], images: [], documents: [], audios: [] });
      setContentError('No se pudo cargar el contenido desde la API.');
    } finally {
      setContentLoading(false);
    }
  }, [slug, fiesta]);

  useEffect(() => {
    if (lastDetailSlugRef.current === slug) return;
    lastDetailSlugRef.current = slug;
    loadFiestaDetail();
  }, [loadFiestaDetail, slug]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const exploreFiestas = useMemo(() => {
    const candidates = fiestas.filter((f) => f.slug !== slug);
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [fiestas, slug]);

  if (!fiesta) return <div className="page-content"><p>Fiesta no encontrada.</p></div>;

  const forceDownload = (url) => {
    if (url.includes('/raw/upload/')) {
      return url.replace('/raw/upload/', '/raw/upload/fl_attachment/');
    }
    return url;
  };
  
  const handleDownload = async (item) => {
    try {
      if (item.fromApi) {
        const response = await registerDownload(item.id);
        const url = forceDownload(resolveMediaUrl(response.fileUrl || item.fileUrl));
  
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
  
        setContent((prev) => {
          const updateType = (typeList) =>
            typeList.map((entry) =>
              entry.id === item.id
                ? { ...entry, downloads: (entry.downloads || 0) + 1 }
                : entry
            );
          return {
            videos: updateType(prev.videos),
            images: updateType(prev.images),
            documents: updateType(prev.documents),
            audios: updateType(prev.audios),
          };
        });
        return;
      }
  
      if (item.fileUrl) {
        const anchor = document.createElement('a');
        anchor.href = forceDownload(item.fileUrl);
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }
    } catch (error) {
      setContentError(error.message || 'No se pudo registrar la descarga.');
    }
  };

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
      <div className="text-muted" style={{ fontSize: '0.72rem' }}>{formatDownloads(item.downloads || 0)}</div>
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
                    onClick={() => toggleSave(fiesta.id)}
                    aria-label={isSaved(fiesta.id) ? 'Quitar de guardados' : 'Guardar fiesta'}>
                    {isSaved(fiesta.id) ? '❤️' : '🤍'}
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

          {contentLoading && <p style={{ color: 'var(--color-muted)' }}>Cargando contenido...</p>}
          {contentError && <p style={{ color: 'var(--color-text-soft)' }}>{contentError}</p>}

          {/* Videos */}
          {filteredContent.videos.length > 0 && (
            <div className="mb-lg">
              <div className="section-subtitle">Vídeos</div>
              <div className="media-grid">
                {filteredContent.videos.map(item => <MediaThumb key={item.id} item={item} type="video" />)}
              </div>
            </div>
          )}

          {/* Images */}
          {filteredContent.images.length > 0 && (
            <div className="mb-lg">
              <div className="section-subtitle">Imágenes</div>
              <div className="media-grid">
                {filteredContent.images.map(item => <MediaThumb key={item.id} item={item} type="image" />)}
              </div>
            </div>
          )}

          {/* Documents */}
          {filteredContent.documents.length > 0 && (
            <div className="mb-lg">
              <div className="section-subtitle">Documentos</div>
              <div className="media-grid">
                {filteredContent.documents.map(item => <MediaThumb key={item.id} item={item} type="document" />)}
              </div>
            </div>
          )}

          {/* Audios */}
          {filteredContent.audios.length > 0 && (
            <div className="mb-lg">
              <div className="section-subtitle">Audios</div>
              <div className="media-grid">
                {filteredContent.audios.map(item => <MediaThumb key={item.id} item={item} type="audio" />)}
              </div>
            </div>
          )}

          {!contentLoading &&
            filteredContent.videos.length === 0 &&
            filteredContent.images.length === 0 &&
            filteredContent.documents.length === 0 &&
            filteredContent.audios.length === 0 && (
              <p className="text-muted">{searchQuery ? 'No hay resultados para tu búsqueda.' : 'No hay publicaciones todavia para esta fiesta.'}</p>
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
              {exploreFiestas.map(f => (
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
          onDownload={user ? handleDownload : undefined}
          canDownload={Boolean(user)}
          onClose={() => setActiveViewer(null)}
          onNavigate={onNavigate}
        />
      )}

      {showPublish && (
        <CreatePublicationModal
          fiestaTitle={fiesta.title}
          fiestaId={fiesta.id}
          onCreated={loadContent}
          onClose={() => setShowPublish(false)}
        />
      )}
    </>
  );
}
