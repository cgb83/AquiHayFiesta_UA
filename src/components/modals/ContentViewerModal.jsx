export default function ContentViewerModal({ item, type, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>
        <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginBottom: 8 }}
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
            <div className="content-viewer-title">{item.title}</div>
            <p className="content-viewer-desc">
              En este tutorial aprenderás a preparar un regalo muy personal y agradable para aquel al que quieras.
            </p>
          </div>
        </div>

        {/* Download */}
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <button className="btn btn-outline" style={{ gap: 6 }}>
            ⬇ Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
