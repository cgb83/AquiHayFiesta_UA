import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, MapPin, ArrowLeft, Plus, Download, Play, FileText } from 'lucide-react';
import ContentViewerModal from '../components/modals/ContentViewerModal';
import { CreatePublicationModal } from '../components/modals/CreateModals';
import { CATEGORIES, formatDownloads, formatViews } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { fetchFiestaBySlug, fetchPublicationsByFiesta, registerDownload, resolveMediaUrl } from '../services/api';

import Calendar from '../components/ui/Calendar';
import { SkeletonContent } from '../components/ui/SkeletonLoader';

function AudioWave() {
  return (
    <div className="audio-thumb">
      <div className="audio-waveform">
        {[...Array(14)].map((_, i) => <span key={i} />)}
      </div>
      <div className="media-play" style={{ background: 'transparent' }}>
        <div className="play-icon" style={{ position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, fontSize: '0.8rem' }}><Play size={16} fill="currentColor" /></div>
      </div>
    </div>
  );
}

function getFileExt(fileName) {
  if (!fileName) return 'DOC';
  const ext = fileName.split('.').pop().toUpperCase();
  return ext.length <= 4 ? ext : 'DOC';
}
export default function FiestaPage({ slug, onNavigate, searchQuery = '' }) {
  const { user, fiestas, toggleSave, isSaved, t } = useApp();
  const [activeViewer, setActiveViewer] = useState(null); // { item, type }
  const [showPublish, setShowPublish] = useState(false);
  const [content, setContent] = useState({ videos: [], images: [], documents: [], audios: [] });
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState('');
  const [fiestaDetail, setFiestaDetail] = useState(null);
  const [fiestaLoading, setFiestaLoading] = useState(true);
  const lastDetailSlugRef = useRef(null);

  const fiesta = fiestaDetail;

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
      setFiestaLoading(true);
      const response = await fetchFiestaBySlug(slug);
      if (!response?.fiesta) return;

      const data = response.fiesta;
      setFiestaDetail({
        id: data._id,
        slug: data.slug,
        title: data.title,
        description: data.description || '',
        category: data.category,
        subcategories: data.subcategories?.length > 0 ? data.subcategories : data.categories || [],
        views: data.views || 0,
        image: resolveMediaUrl(data.coverImage || ''),
        date: data.startDate ? String(data.startDate).slice(0, 10) : null,
        location: data.location?.city || data.location?.country || null,
        creator: data.createdBy || data.creator,
        startDate: data.startDate ? String(data.startDate).slice(0, 10) : null,
        endDate: data.endDate ? String(data.endDate).slice(0, 10) : null,
        creatorName: data.createdBy?.username || data.creator?.username || 'Anónimo',
        creatorAvatar: resolveMediaUrl(data.createdBy?.avatar || data.creator?.avatar || ''),
        creatorId: data.createdBy?._id || data.creator?._id,
      });
    } catch {
      // API error
    } finally {
      setFiestaLoading(false);
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
          description: pub.description || '',
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

  if (!fiesta && !fiestaLoading) return <div className="page-content"><p> {t('fiesta_not_found')}</p></div>;
  if (!fiesta && fiestaLoading) return <div className="page-content" style={{ minHeight: '60vh' }}><SkeletonContent /></div>;

  const downloadBlob = async (url, fileName) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se pudo descargar el archivo');
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = fileName || 'archivo';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  };

  const handleDownload = async (item) => {
    try {
      if (item.fromApi) {
        const response = await registerDownload(item.id);
        const fileUrl = resolveMediaUrl(response.fileUrl || item.fileUrl);
        await downloadBlob(fileUrl, item.fileName);
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
        await downloadBlob(resolveMediaUrl(item.fileUrl), item.fileName);
      }
    } catch (error) {
      throw new Error(error.message || 'No se pudo descargar el contenido.');
    }
  };

  const MediaThumb = ({ item, type }) => (
    <div>
      <div className="media-thumb" onClick={() => setActiveViewer({ item, type })}>
        {type === 'document' ? (
          <div className="doc-thumb" style={{ position: 'static', background: 'var(--color-primary-pale)' }}>
            <FileText size={32} style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : type === 'audio' ? (
          <AudioWave />
        ) : (
          <>
            <img src={item.image} alt={item.title} />
            {type === 'video' && (
              <div className="media-play">
                <div className="play-icon"><Play size={16} fill="currentColor" /></div>
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
        {/* Mobile: Title || Calendar || Categories in parallel */}
        <div className="fiesta-mobile-main">
          {/* Left: Title + Description + Date/Location */}
          <div className="fiesta-mobile-left">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
                {fiesta.title}
                {user && (
                  <button className={`bookmark-btn ${isSaved(fiesta.id) ? 'saved' : ''}`}
                    onClick={() => toggleSave(fiesta.id)}
                    aria-label={isSaved(fiesta.id) ? 'Quitar de guardados' : 'Guardar fiesta'}>
                    {isSaved(fiesta.id) 
                      ? <Bookmark size={20} fill="var(--color-primary)" style={{ color: 'var(--color-primary)' }} />
                      : <Bookmark size={20} style={{ color: 'var(--color-text-soft)' }} />
                    }
                  </button>
                )}
              </h1>
              <button onClick={() => onNavigate('home')} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '5px 12px', flexShrink: 0, marginLeft: 'var(--space-md)' }} aria-label="Volver al inicio">
                <ArrowLeft size={16} />
                <span className="back-text"> {t('fiesta_volver')}</span>
              </button>
            </div>

            <p style={{ marginTop: 8, fontSize: '0.92rem', color: 'var(--color-text-soft)' }}>
              {fiesta.description}
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
              {fiesta.location && (
                <div className="fiesta-info-block">
                  <span className="fiesta-info-label"><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> {t('fiesta_lugar')}</span>
                  <span className="fiesta-info-value">{fiesta.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Calendar + Categories */}
          <div className="fiesta-mobile-right">
            {/* Calendar */}
            <div className="fiesta-calendar-mobile">
              <Calendar fiesta={fiesta} />
            </div>

            {/* Categories */}
            <div className="fiesta-categories-mobile-sidebar">
              <h3 className="section-title" style={{ textAlign: 'left' }}>{t('fiesta_categorias')}</h3>
              {fiesta.subcategories?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                  {fiesta.subcategories.map(s => {
                    const cat = CATEGORIES.find(c => c.id === s);
                    return (
                      <button
                        key={s}
                        className="sidebar-cat-item"
                        onClick={() => onNavigate('home', `cat:${s}`)}
                        type="button"
                        style={{ cursor: 'pointer', textAlign: 'right' }}
                      >
                        {cat ? cat.label : s}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted" style={{ textAlign: 'right', fontSize: '0.85rem' }}>{t('fiesta_no_cats')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Content - Carrusel deslizable */}
        <div className="fiesta-content-mobile">
          {/* Content header */}
          <div className="flex-between mb-md">
            <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>{t('fiesta_contenido')}</h3>
            {user && (
              <button className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => setShowPublish(true)}>
                <Plus size={16} />
                <span className="publish-text"> {t('fiesta_publicar')}</span>
              </button>
            )}
          </div>

          {contentLoading ? (
            <SkeletonContent />
          ) : (
            <>
              {contentError && <p style={{ color: 'var(--color-text-soft)' }}>{contentError}</p>}

              {/* Videos carousel */}
              {filteredContent.videos.length > 0 && (
                <div className="mb-lg">
                  <div className="section-subtitle">{t('fiesta_videos')}</div>
                  <div className="media-grid">
                    {filteredContent.videos.map(item => <MediaThumb key={item.id} item={item} type="video" />)}
                  </div>
                </div>
              )}

              {/* Images carousel */}
              {filteredContent.images.length > 0 && (
                <div className="mb-lg">
                  <div className="section-subtitle">{t('fiesta_imagenes')}</div>
                  <div className="media-grid">
                    {filteredContent.images.map(item => <MediaThumb key={item.id} item={item} type="image" />)}
                  </div>
                </div>
              )}

              {/* Documents — filas con badge + botón descargar */}
              {filteredContent.documents.length > 0 && (
                <div className="mb-lg">
                  <div className="section-subtitle">{t('fiesta_documentos')}</div>
                  <div className="doc-list">
                    {filteredContent.documents.map(item => (
                      <div key={item.id} className="doc-row">
                        <div className="doc-row-icon" aria-hidden="true">
                          <span className="doc-type-badge">{getFileExt(item.fileName)}</span>
                        </div>
                        <div className="doc-row-info" role="button" tabIndex={0}
                          onClick={() => setActiveViewer({ item, type: 'document' })}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveViewer({ item, type: 'document' }); } }}>
                          <div className="doc-row-title">{item.title}</div>
                          <div className="doc-row-meta">{formatDownloads(item.downloads || 0)}</div>
                        </div>
                        <button className="doc-row-download btn btn-outline"
                          onClick={() => handleDownload(item)}
                          aria-label={`Descargar ${item.title}`}>
                          <Download size={14} />
                          <span className="doc-download-text"> {t('fiesta_descargar')}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audios — filas tipo playlist */}
              {filteredContent.audios.length > 0 && (
                <div className="mb-lg">
                  <div className="section-subtitle">{t('fiesta_audios')}</div>
                  <div className="audio-list">
                    {filteredContent.audios.map(item => (
                      <div key={item.id} className="audio-row" role="button" tabIndex={0}
                        onClick={() => setActiveViewer({ item, type: 'audio' })}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveViewer({ item, type: 'audio' }); } }}>
                        <div className="audio-row-wave" aria-hidden="true">
                          <div className="audio-waveform">
                            {[...Array(8)].map((_, i) => <span key={i} />)}
                          </div>
                        </div>
                        <div className="audio-row-info">
                          <div className="audio-row-title">{item.title}</div>
                          <div className="audio-row-meta">{formatDownloads(item.downloads || 0)}</div>
                        </div>
                        <div className="audio-row-play" aria-hidden="true"><Play size={12} fill="currentColor" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredContent.videos.length === 0 &&
                filteredContent.images.length === 0 &&
                filteredContent.documents.length === 0 &&
                filteredContent.audios.length === 0 && (
                  <p className="text-muted">{t(searchQuery ? 'fiesta_no_search' : 'fiesta_no_content')}</p>
                )}
            </>
          )}
        </div>

        {/* Mobile Explore */}
        <div className="fiesta-explore-mobile">
          {/* Creator Profile */}
          {fiesta.creatorName && (
            <div className="creator-profile">
              <h3 className="section-title">{t('fiesta_creador')}</h3>
              <div className="creator-card">
                {fiesta.creatorAvatar && (
                  <img src={fiesta.creatorAvatar} alt={fiesta.creatorName} className="creator-avatar" />
                )}
                <div className="creator-info">
                  <div className="creator-name">{fiesta.creatorName}</div>
                  <div className="creator-meta">{t('fiesta_creador_meta')}</div>
                </div>
              </div>
            </div>
          )}

          <h3 className="section-title" style={{ textAlign: 'left' }}>{t('fiesta_explorar')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {exploreFiestas.map(f => (
              <div key={f.id} className="explore-item" onClick={() => onNavigate('fiesta', f.slug)}>
                <img src={f.image} alt={f.title}
                  style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: 4 }}>{f.title}</div>
                <div className="text-muted">{formatViews(f.views)}</div>
              </div>
            ))}
            
          </div>
        </div>

        {/* Desktop layout */}
        <div className="fiesta-sidebar">
          {/* Header - Solo titulo */}
          <div className="flex-between mb-md" style={{ alignItems: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
              {fiesta.title}
              {user && (
                <button className={`bookmark-btn ${isSaved(fiesta.id) ? 'saved' : ''}`}
                  onClick={() => toggleSave(fiesta.id)}
                  aria-label={isSaved(fiesta.id) ? 'Quitar de guardados' : 'Guardar fiesta'}>
                  {isSaved(fiesta.id) 
                    ? <Bookmark size={30} fill="var(--color-primary)" style={{ color: 'var(--color-primary)' }} />
                    : <Bookmark size={30} style={{ color: 'var(--color-text-soft)' }} />
                  }
                </button>
              )}
            </h1>
            <button onClick={() => onNavigate('home')} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '5px 12px', flexShrink: 0, marginLeft: 'var(--space-md)' }} aria-label="Volver al inicio">
              <ArrowLeft size={16} />
              <span className="back-text"> {t('fiesta_volver')}</span>
            </button>
          </div>

          {/* Description with date and location */}
          <div className="mb-lg">
            <p style={{ marginTop: 8, fontSize: '0.92rem', color: 'var(--color-text-soft)' }}>
              {fiesta.description}
            </p>
            {/* Info block: date + location */}
            <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
              {fiesta.location && (
                <div className="fiesta-info-block">
                  <span className="fiesta-info-label"><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> {t('fiesta_lugar')}</span>
                  <span className="fiesta-info-value">{fiesta.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Calendar - debajo de la descripción */}
          <div className="calendar-section mb-lg">
            <Calendar fiesta={fiesta} />
          </div>

          {/* Content sections */}
          <div className="flex-between mb-md">
            <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>{t('fiesta_contenido')}</h3>
            {user && (
              <button className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => setShowPublish(true)}>
                <Plus size={16} /> {t('fiesta_publicar')}
              </button>
            )}
          </div>

          {contentLoading ? (
            <SkeletonContent />
          ) : (
            <>
              {contentError && <p style={{ color: 'var(--color-text-soft)' }}>{contentError}</p>}

              {/* Videos */}
              {filteredContent.videos.length > 0 && (
                <div className="mb-lg">
                  <div className="section-subtitle">{t('fiesta_videos')}</div>
                  <div className="media-grid">
                    {filteredContent.videos.map(item => <MediaThumb key={item.id} item={item} type="video" />)}
                  </div>
                </div>
              )}

              {/* Images */}
              {filteredContent.images.length > 0 && (
                <div className="mb-lg">
                  <div className="section-subtitle">{t('fiesta_imagenes')}</div>
                  <div className="media-grid">
                    {filteredContent.images.map(item => <MediaThumb key={item.id} item={item} type="image" />)}
                  </div>
                </div>
              )}

              {/* Documents */}
              {filteredContent.documents.length > 0 && (
                <div className="mb-lg">
                  <div className="section-subtitle">{t('fiesta_documentos')}</div>
                  <div className="media-grid">
                    {filteredContent.documents.map(item => <MediaThumb key={item.id} item={item} type="document" />)}
                  </div>
                </div>
              )}

              {/* Audios */}
              {filteredContent.audios.length > 0 && (
                <div className="mb-lg">
                  <div className="section-subtitle">{t('fiesta_audios')}</div>
                  <div className="media-grid">
                    {filteredContent.audios.map(item => <MediaThumb key={item.id} item={item} type="audio" />)}
                  </div>
                </div>
              )}

              {filteredContent.videos.length === 0 &&
                filteredContent.images.length === 0 &&
                filteredContent.documents.length === 0 &&
                filteredContent.audios.length === 0 && (
                  <p className="text-muted">{t(searchQuery ? 'fiesta_no_search' : 'fiesta_no_content')}</p>
                )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="fiesta-sidebar-right">
          {/* Calendar - solo en desktop */}
          <div className="mb-lg calendar-desktop-only">
            <Calendar fiesta={fiesta} />
          </div>

          {/* Categories */}
          <div className="mb-lg">
            <h3 className="section-title" style={{ textAlign: 'right' }}>{t('fiesta_categorias')}</h3>
            {fiesta.subcategories?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0 }}>
                {fiesta.subcategories.map(s => {
                  const cat = CATEGORIES.find(c => c.id === s);
                  return (
                    <button
                      key={s}
                      className="sidebar-cat-item"
                      onClick={() => onNavigate('home', `cat:${s}`)}
                      type="button"
                      style={{ cursor: 'pointer', textAlign: 'right' }}
                    >
                      {cat ? cat.label : s}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted" style={{ textAlign: 'right', fontSize: '0.85rem' }}>{t('fiesta_no_cats')}</p>
            )}
          </div>

          {/* Explore fiestas */}
          <div>
            {/* Creator Profile */}
            {fiesta.creatorName && (
              <div className="creator-profile mb-lg">
                <h3 className="section-title" style={{ textAlign: 'right' }}>{t('fiesta_creador')}</h3>
                <div className="creator-card">
                  {fiesta.creatorAvatar && (
                    <img src={fiesta.creatorAvatar} alt={fiesta.creatorName} className="creator-avatar" />
                  )}
                  <div className="creator-info">
                    <div className="creator-name">{fiesta.creatorName}</div>
                    <div className="creator-meta">{t('fiesta_creador_meta')}</div>
                  </div>
                </div>
              </div>
            )}

            <h3 className="section-title" style={{ textAlign: 'right' }}>{t('fiesta_explorar')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {exploreFiestas.map(f => (
                <div key={f.id} className="explore-item" onClick={() => onNavigate('fiesta', f.slug)}>
                  <img src={f.image} alt={f.title}
                    style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: 4 }}>{f.title}</div>
                  <div className="text-muted">{formatViews(f.views)}</div>
                </div>
              ))}
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
