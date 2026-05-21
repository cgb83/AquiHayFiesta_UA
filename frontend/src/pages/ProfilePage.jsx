import { useEffect, useState } from 'react';
import { Save, Check, ChevronUp, ChevronDown, Eraser } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchMe, updateProfile } from '../services/api';

const STYLES = [
  { value: 'standard',       label: 'Modo estándar' },
  { value: 'dark',           label: 'Modo oscuro' },
  { value: 'high-contrast',  label: 'Alto contraste' },
  { value: 'large-text',     label: 'Letra grande' },
  { value: 'large-contrast', label: 'Letra + Contraste' },
];

export default function ProfilePage() {
  const { user, theme, setTheme, lang, refreshCurrentUser } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    country: user?.country || '',
    city: user?.city || '',
    currentPassword: '',
  });
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [showAllDownloads, setShowAllDownloads] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      country: user?.country || '',
      city: user?.city || '',
    }));
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchMe();
        const me = response.user || {};
        setDownloadHistory(me.downloadHistory || []);
      } catch {
        setDownloadHistory([]);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    // Si quiere cambiar contraseña, requiere la actual
    if (form.password && !form.currentPassword) {
      setError('Introduce tu contraseña actual para cambiar la contraseña.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await updateProfile({
        username: form.name,
        email: form.email,
        password: form.password || undefined,
        currentPassword: form.currentPassword || undefined,
        country: form.country,
        city: form.city,
        theme,
        language: lang,
      });

      await refreshCurrentUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setForm((prev) => ({ ...prev, password: '', currentPassword: '' }));
    } catch (err) {
      setError(err.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setForm(prev => ({ ...prev, password: '', currentPassword: '' }));
  };

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
        Mi perfil
      </h2>

      <div className="profile-grid">
        {/* Left: form */}
        <div>
          <div className="flex-between mb-md">
            <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>Perfil</h3>
            <button className="btn btn-outline" style={{ fontSize: '0.82rem' }} onClick={handleClear}>
              <Eraser size={14} /> Limpiar contraseñas
            </button>
          </div>

          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 'var(--space-md)' }} />

          {error && (
            <p role="alert" style={{ color: '#c0392b', marginBottom: 'var(--space-sm)' }}>
              {error}
            </p>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Nombre de usuario</label>
            <input id="profile-name" className="form-input" placeholder="Nombre de usuario"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Correo electronico</label>
            <input id="profile-email" className="form-input" placeholder="Correo electrónico" type="email"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-password">Nueva contraseña</label>
            <input id="profile-password" className="form-input" placeholder="Nueva contraseña" type="password"
              autoComplete="new-password"
              value={form.password} onChange={e => set('password', e.target.value)} />
            <div className="form-hint">*Si no se rellena, se mantendrá la contraseña actual</div>
          </div>

          <div className="form-row form-group">
            <label className="sr-only" htmlFor="profile-country">Pais</label>
            <input id="profile-country" className="form-input" placeholder="País"
              value={form.country} onChange={e => set('country', e.target.value)} />
            <label className="sr-only" htmlFor="profile-city">Ciudad</label>
            <input id="profile-city" className="form-input" placeholder="Ciudad"
              value={form.city} onChange={e => set('city', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-current-password">Escribe tu contraseña para verificar los cambios:</label>
            <input id="profile-current-password" className="form-input" placeholder="Contraseña actual" type="password"
              autoComplete="current-password"
              value={form.currentPassword} onChange={e => set('currentPassword', e.target.value)} />
          </div>

          {/* Style picker */}
          <div className="mt-lg">
            <h3 className="section-title">Estilo</h3>
            <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 'var(--space-md)' }} />
            <label className="sr-only" htmlFor="profile-theme">Estilo visual</label>
            <select id="profile-theme" className="style-select" value={theme}
              onChange={e => setTheme(e.target.value)}>
              {STYLES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary btn-full mt-lg"
            onClick={handleSave}
            disabled={saving}
            style={{ justifyContent: 'center', gap: 8 }}>
            <Save size={16} /> {saving ? 'Guardando...' : (saved ? '¡Guardado!' : 'Guardar cambios')}
          </button>
        </div>

        {/* Right: download history */}
        <div>
          <h3 className="section-title" style={{ textAlign: 'right' }}>Historial de descargas</h3>
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 'var(--space-md)' }} />

          <div className="download-history">
            {(showAllDownloads ? downloadHistory : downloadHistory.slice(0, 5)).map((item, i) => (
              <div key={i} className="download-item">
                <span className="download-name">{item.filename}</span>
                <span className="download-date">{new Date(item.downloadedAt).toLocaleDateString('es-ES')}</span>
              </div>
            ))}
            {downloadHistory.length === 0 && (
              <p className="text-muted">Aun no hay descargas registradas.</p>
            )}
          </div>

          {downloadHistory.length > 5 && (
            <div className="sidebar-show-more">
              <button className="show-more-btn"
                title={showAllDownloads ? 'Ver menos' : 'Ver más'}
                onClick={() => setShowAllDownloads(o => !o)}>
                {showAllDownloads ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
