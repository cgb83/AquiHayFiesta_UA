import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { registerUser } from '../services/api';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function RegisterPage({ onNavigate }) {
  const { login, t } = useApp(); // Obtenemos `t` desde el contexto
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', country: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();

    if (!username || !email || !form.password) {
      setError(t('register_errors_required_fields'));
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError(t('register_errors_invalid_email'));
      return;
    }
    if (username.length < 3 || username.length > 30) {
      setError(t('register_errors_username_length'));
      return;
    }
    if (form.password.length < 6) {
      setError(t('register_errors_password_length'));
      return;
    }
    if (form.password !== form.confirm) {
      setError(t('register_errors_password_mismatch'));
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
      setError(err.message || t('register_errors_creation_failed'));
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
        <h2 className="auth-title">{t('register_title')}</h2>

        {error && <p role="alert" style={{ color: '#c0392b', fontSize: '0.85rem', textAlign: 'center', marginBottom: 12 }}>{error}</p>}

        <div className="auth-card-scrollable">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-username">{t('register_username')}</label>
              <input className="form-input" placeholder={t('register_username')}
                id="register-username"
                aria-invalid={Boolean(error)}
                value={form.username} onChange={e => set('username', e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="register-email">{t('register_email')}</label>
              <input className="form-input" placeholder={t('register_email')} type="email"
                id="register-email"
                aria-invalid={Boolean(error)}
                value={form.email} onChange={e => set('email', e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="register-password">{t('register_password')}</label>
              <input className="form-input" placeholder={t('register_password')} type="password"
                id="register-password"
                aria-invalid={Boolean(error)}
                value={form.password} onChange={e => set('password', e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">{t('register_confirm_password')}</label>
              <input className="form-input" placeholder={t('register_confirm_password')} type="password"
                id="register-confirm"
                aria-invalid={Boolean(error)}
                value={form.confirm} onChange={e => set('confirm', e.target.value)} disabled={loading} />
            </div>
            <div className="form-row form-group">
              <label className="sr-only" htmlFor="register-country">{t('register_country')}</label>
              <input className="form-input" placeholder={t('register_country')}
                id="register-country"
                value={form.country} onChange={e => set('country', e.target.value)} disabled={loading} />
              <label className="sr-only" htmlFor="register-city">{t('register_city')}</label>
              <input className="form-input" placeholder={t('register_city')}
                id="register-city"
                value={form.city} onChange={e => set('city', e.target.value)} disabled={loading} />
            </div>

            <div className="form-row mt-md">
              <button type="button" className="btn btn-outline w-full" onClick={handleClear} disabled={loading}>
                {t('register_clear')}
              </button>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? t('register_creating') : t('register_create')}
              </button>
            </div>
          </form>
        </div>

        <div className="auth-links mt-md">
          <p>{t('register_already_have_account')}{' '}
            <button className="auth-link" onClick={() => onNavigate('login')}>{t('register_login')}</button>
          </p>
        </div>
      </div>
    </div>
  );
}