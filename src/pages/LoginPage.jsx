import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_USER } from '../data/mockData';

export default function LoginPage({ onNavigate }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) { setError('Rellena todos los campos.'); return; }
    // Mock auth — any credentials work, or use sara@gmail.com
    login({ ...MOCK_USER, email });
    onNavigate('home');
  };

  const handleClear = () => { setEmail(''); setPassword(''); setError(''); };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Inicia Sesión</h2>

        {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', textAlign: 'center', marginBottom: 12 }}>{error}</p>}

        <div className="form-group">
          <input className="form-input" placeholder="Correo electrónico" type="email"
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input className="form-input" placeholder="Contraseña" type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <div className="form-row mt-md">
          <button className="btn btn-outline w-full" onClick={handleClear}>Borrar</button>
          <button className="btn btn-primary w-full" onClick={handleLogin}>Entrar</button>
        </div>

        <div className="auth-links mt-md">
          <p><button className="auth-link" onClick={() => {}}>¿Has olvidado tu contraseña?</button></p>
          <p style={{ marginTop: 6 }}>
            ¿No tienes cuenta?{' '}
            <button className="auth-link" onClick={() => onNavigate('register')}>Regístrate</button>
          </p>
        </div>
      </div>
    </div>
  );
}
