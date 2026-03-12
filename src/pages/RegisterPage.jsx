import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RegisterPage({ onNavigate }) {
  const { login } = useApp();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', country: '', city: '' });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = () => {
    if (!form.username || !form.email || !form.password) {
      setError('Por favor, rellena todos los campos obligatorios.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.'); return;
    }
    login({ name: form.username, email: form.email, country: form.country, city: form.city });
    onNavigate('home');
  };

  const handleClear = () => setForm({ username: '', email: '', password: '', confirm: '', country: '', city: '' });

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Crea tu cuenta</h2>

        {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', textAlign: 'center', marginBottom: 12 }}>{error}</p>}

        <div className="form-group">
          <input className="form-input" placeholder="Usuario"
            value={form.username} onChange={e => set('username', e.target.value)} />
        </div>
        <div className="form-group">
          <input className="form-input" placeholder="Correo electrónico" type="email"
            value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="form-group">
          <input className="form-input" placeholder="Contraseña" type="password"
            value={form.password} onChange={e => set('password', e.target.value)} />
        </div>
        <div className="form-group">
          <input className="form-input" placeholder="Confirmar contraseña" type="password"
            value={form.confirm} onChange={e => set('confirm', e.target.value)} />
        </div>
        <div className="form-row form-group">
          <input className="form-input" placeholder="País"
            value={form.country} onChange={e => set('country', e.target.value)} />
          <input className="form-input" placeholder="Ciudad"
            value={form.city} onChange={e => set('city', e.target.value)} />
        </div>

        <div className="form-row mt-md">
          <button className="btn btn-outline w-full" onClick={handleClear}>Borrar</button>
          <button className="btn btn-primary w-full" onClick={handleCreate}>Crear</button>
        </div>

        <div className="auth-links mt-md">
          <p>¿Ya tienes cuenta?{' '}
            <button className="auth-link" onClick={() => onNavigate('login')}>Inicia sesión</button>
          </p>
        </div>
      </div>
    </div>
  );
}
