import { useState, useRef } from 'react';
import { useModalAccessibility } from './useModalAccessibility';

export default function ContentViewerModal({ item, type, onClose, onDownload, canDownload = true, onNavigate }) {
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
          onClick={onClose}>←
        </button>

        <div className="content-viewer">
          {/* Vista previa del contenido */}
          <div className="content-viewer-media">
            {type === 'video' && item.fileUrl && (
              <video
                src={item.fileUrl}
                controls
                style={{ width: '100%', borderRadius: 8, maxHeight: 360 }}
              >
                Tu navegador no soporta la reproducción de vídeo.
              </video>
            )}
            {type === 'image' && item.image && (
              <img src={item.image} alt={item.title}
                style={{ width: '100%', borderRadius: 8 }} />
            )}
            {type === 'audio' && item.fileUrl && (
              <div style={{ padding: 'var(--space-lg)', background: 'var(--color-primary-pale)', borderRadius: 8 }}>
                <div className="audio-waveform" style={{ marginBottom: 'var(--space-md)' }}>
                  {[...Array(12)].map((_, i) => <span key={i} />)}
                </div>
                <audio
                  src={item.fileUrl}
                  controls
                  style={{ width: '100%' }}
                >
                  Tu navegador no soporta la reproducción de audio.
                </audio>
              </div>
            )}
            {type === 'document' && (
              <div className="doc-thumb" style={{ width: '100%', aspectRatio: '4/3' }}>📄</div>
            )}
          </div>

          {/* Info */}
          <div className="content-viewer-info">
            <div id="content-viewer-title" className="content-viewer-title">{item.title}</div>
            {item.description && (
              <p className="content-viewer-desc">{item.description}</p>
            )}
            {error && <p role="alert" style={{ color: '#c0392b' }}>{error}</p>}
          </div>
        </div>

        {/* Descarga: solo si el usuario está logueado */}
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          {canDownload ? (
            <button className="btn btn-outline" style={{ gap: 6 }}
              onClick={handleDownload} disabled={loading}>
              ⬇ {loading ? 'Descargando...' : 'Descargar'}
            </button>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-soft)' }}>
              <button className="auth-link" onClick={() => onNavigate?.('login')} 
                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--color-primary)' }}>
                Inicia sesión
              </button>
              {' '}para descargar este contenido.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
