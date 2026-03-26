import { useState, useRef } from 'react';
import { useModalAccessibility } from './useModalAccessibility';

export default function ContentViewerModal({ item, type, onClose, onDownload }) {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useModalAccessibility({ modalRef, isOpen: true, onClose });

  const handleDownload = async () => {
    if (!onDownload) return;

    try {
      setLoading(true);
      setError('');
      await onDownload(item);
    } catch (err) {
      setError(err.message || 'No se pudo descargar el contenido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-viewer-title"
        style={{ maxWidth: 660 }}
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginBottom: 8 }}
          aria-label="Cerrar visor"
          onClick={onClose}>← </button>

        <div className="content-viewer">
          {/* Media preview */}
          <div className="content-viewer-media">
            {(type === 'video' || type === 'image') && item.image && (
              <div style={{ position: 'relative' }}>
                <img src={item.image} alt={item.title}
                  style={{ width: '100%', borderRadius: 8 }} />
                {type === 'video' && (
                  <div className="media-play" style={{ borderRadius: 8 }}>
                    <div className="play-icon">▶</div>
                  </div>
                )}
              </div>
            )}
            {type === 'document' && (
              <div className="doc-thumb" style={{ width: '100%', aspectRatio: '4/3' }}>
                📄
              </div>
            )}
            {type === 'audio' && (
              <div className="audio-thumb" style={{ width: '100%' }}>
                <div className="audio-waveform">
                  {[...Array(12)].map((_, i) => <span key={i} />)}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="content-viewer-info">
            <div id="content-viewer-title" className="content-viewer-title">{item.title}</div>
            <p className="content-viewer-desc">
              En este tutorial aprenderás a preparar un regalo muy personal y agradable para aquel al que quieras.
            </p>
            {error && <p role="alert" style={{ color: '#c0392b' }}>{error}</p>}
          </div>
        </div>

        {/* Download */}
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <button className="btn btn-outline" style={{ gap: 6 }} onClick={handleDownload} disabled={loading}>
            ⬇ {loading ? 'Descargando...' : 'Descargar'}
          </button>
        </div>
      </div>
    </div>
  );
}
