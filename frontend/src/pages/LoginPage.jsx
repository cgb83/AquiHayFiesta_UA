import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { loginUser } from '../services/api';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function LoginPage({ onNavigate }) {
  const { login, t } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleLogin = async () => {
    const emailValue = email.trim().toLowerCase();

    if (!emailValue || !password) {
      setError('Rellena todos los campos.');
      return;
    }

    if (!EMAIL_REGEX.test(emailValue)) {
      setError('Introduce un correo valido.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await loginUser({ email: emailValue, password });
      login(response.user, response.token);
      onNavigate('home');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesion.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">{t('login_title')}</h2>

        {error && <p role="alert" style={{ color: '#c0392b', fontSize: '0.85rem', textAlign: 'center', marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">{t('profile_email')}</label>
            <input className="form-input" placeholder={t('profile_email')} type="email"
              id="login-email"
              aria-invalid={Boolean(error)}
              value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">{t('login_password')}</label>
            <input className="form-input" placeholder={t('login_password')} type="password"
              id="login-password"
              autoComplete="current-password"
              aria-invalid={Boolean(error)}
              value={password} onChange={e => setPassword(e.target.value)}
              disabled={loading} />
          </div>

          <div className="form-row mt-md">
            <button type="button" className="btn btn-outline w-full" onClick={handleClear} disabled={loading}>{t('borrar')}</button>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? t('login_loading') : t('login_btn')}
            </button>
          </div>
        </form>

        <div className="auth-links mt-md">
          <p>
            <button className="auth-link" onClick={() => setShowForgotMsg(v => !v)}>
              {t('login_forgot')}
            </button>
          </p>
          {showForgotMsg && (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-soft)', marginTop: 6, textAlign: 'center' }}>
              {t('login_forgot_msg')}
            </p>
          )}
          <p style={{ marginTop: 6 }}>
            {t('login_no_cuenta')}{' '}
            <button className="auth-link" onClick={() => onNavigate('register')}>{t('login_register')}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
