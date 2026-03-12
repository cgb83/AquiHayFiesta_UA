import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_USER } from '../data/mockData';

const STYLES = [
  { value: 'standard',       label: 'Modo estándar' },
  { value: 'dark',           label: 'Modo oscuro' },
  { value: 'high-contrast',  label: 'Alto contraste' },
  { value: 'large-text',     label: 'Letra grande' },
  { value: 'large-contrast', label: 'Letra + Contraste' },
];

export default function ProfilePage() {
  const { theme, setTheme } = useApp();
  const [form, setForm] = useState({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    password: '',
    country: MOCK_USER.country,
    city: MOCK_USER.city,
    currentPassword: '',
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setForm({ name: '', email: '', password: '', country: '', city: '', currentPassword: '' });
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
              Limpiar campos
            </button>
          </div>

          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 'var(--space-md)' }} />

          <div className="form-group">
            <input className="form-input" placeholder="Nombre de usuario"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <input className="form-input" placeholder="Correo electrónico" type="email"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <input className="form-input" placeholder="Nueva contraseña" type="password"
              value={form.password} onChange={e => set('password', e.target.value)} />
            <div className="form-hint">*Si no se rellena, se mantendrá la contraseña actual</div>
          </div>

          <div className="form-row form-group">
            <input className="form-input" placeholder="País"
              value={form.country} onChange={e => set('country', e.target.value)} />
            <input className="form-input" placeholder="Ciudad"
              value={form.city} onChange={e => set('city', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Escribe tu contraseña para verificar los cambios:</label>
            <input className="form-input" placeholder="Contraseña actual" type="password"
              value={form.currentPassword} onChange={e => set('currentPassword', e.target.value)} />
          </div>

          {/* Style picker */}
          <div className="mt-lg">
            <h3 className="section-title">Estilo</h3>
            <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 'var(--space-md)' }} />
            <select className="style-select" value={theme}
              onChange={e => setTheme(e.target.value)}>
              {STYLES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary btn-full mt-lg"
            onClick={handleSave}
            style={{ justifyContent: 'center', gap: 8 }}>
            💾 {saved ? '¡Guardado!' : 'Guardar cambios'}
          </button>
        </div>

        {/* Right: download history */}
        <div>
          <h3 className="section-title" style={{ textAlign: 'right' }}>Historial descargas</h3>
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 'var(--space-md)' }} />

          <div className="download-history">
            {MOCK_USER.downloadHistory.map((item, i) => (
              <div key={i} className="download-item">
                <span className="download-name">{item.name}</span>
                <span className="download-date">{item.date}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-show-more">
            <button className="show-more-btn" title="Ver más">▼</button>
          </div>
        </div>
      </div>
    </>
  );
}
