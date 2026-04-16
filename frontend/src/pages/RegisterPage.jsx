import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { registerUser } from '../services/api';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function RegisterPage({ onNavigate }) {
  const { login } = useApp();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', country: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();

    if (!username || !email || !form.password) {
      setError('Por favor, rellena todos los campos obligatorios.');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Introduce un correo valido.');
      return;
    }
    if (username.length < 3 || username.length > 30) {
      setError('El usuario debe tener entre 3 y 30 caracteres.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await registerUser({
        username,
        email,
        password: form.password,
        country: form.country.trim(),
        city: form.city.trim(),
      });

      login(response.user, response.token);
      onNavigate('home');
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setForm({ username: '', email: '', password: '', confirm: '', country: '', city: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate();
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Crea tu cuenta</h2>

        {error && <p role="alert" style={{ color: '#c0392b', fontSize: '0.85rem', textAlign: 'center', marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-username">Usuario</label>
            <input className="form-input" placeholder="Usuario"
              id="register-username"
              aria-invalid={Boolean(error)}
              value={form.username} onChange={e => set('username', e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Correo electronico</label>
            <input className="form-input" placeholder="Correo electrónico" type="email"
              id="register-email"
              aria-invalid={Boolean(error)}
              value={form.email} onChange={e => set('email', e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Contraseña</label>
            <input className="form-input" placeholder="Contraseña" type="password"
              id="register-password"
              aria-invalid={Boolean(error)}
              value={form.password} onChange={e => set('password', e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm">Confirmar contraseña</label>
            <input className="form-input" placeholder="Confirmar contraseña" type="password"
              id="register-confirm"
              aria-invalid={Boolean(error)}
              value={form.confirm} onChange={e => set('confirm', e.target.value)} disabled={loading} />
          </div>
          <div className="form-row form-group">
            <label className="sr-only" htmlFor="register-country">Pais</label>
            <input className="form-input" placeholder="País"
              id="register-country"
              value={form.country} onChange={e => set('country', e.target.value)} disabled={loading} />
            <label className="sr-only" htmlFor="register-city">Ciudad</label>
            <input className="form-input" placeholder="Ciudad"
              id="register-city"
              value={form.city} onChange={e => set('city', e.target.value)} disabled={loading} />
          </div>

          <div className="form-row mt-md">
            <button type="button" className="btn btn-outline w-full" onClick={handleClear} disabled={loading}>Borrar</button>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>

        <div className="auth-links mt-md">
          <p>¿Ya tienes cuenta?{' '}
            <button className="auth-link" onClick={() => onNavigate('login')}>Inicia sesión</button>
          </p>
        </div>
      </div>
    </div>
  );
}
