import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const LANGS = ['ES', 'EN'];

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout, lang, setLang } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const nav = (page) => { onNavigate(page); setMenuOpen(false); };

  return (
    <>
      <nav className="navbar">
        {/* Left: nav links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <button className={`navbar-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => nav('home')}>Inicio</button>
          {user && <>
            <button className={`navbar-link ${currentPage === 'saved' ? 'active' : ''}`}
              onClick={() => nav('saved')}>Guardados</button>
            <button className={`navbar-link ${currentPage === 'manage' ? 'active' : ''}`}
              onClick={() => nav('manage')}>Mis publicaciones</button>
          </>}
        </div>

        {/* Right: lang + user */}
        <div className="navbar-actions" style={{ marginLeft: 'auto' }}>
          {/* Language picker */}
          <div className="dropdown-wrap">
            <button className="dropdown-trigger"
              onClick={() => { setLangOpen(o => !o); setUserOpen(false); }}>
              {lang} <span style={{ fontSize: '0.7rem' }}>▼</span>
              <span style={{ fontSize: '1rem' }}>🌐</span>
            </button>
            {langOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setLang('ES'); setLangOpen(false); }}>Español</button>
                <button className="dropdown-item" onClick={() => { setLang('EN'); setLangOpen(false); }}>English</button>
              </div>
            )}
          </div>

          {/* Auth */}
          {!user ? (
            <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              onClick={() => nav('login')}>
              Iniciar Sesión →
            </button>
          ) : (
            <div className="dropdown-wrap">
              <button className="dropdown-trigger"
                onClick={() => { setUserOpen(o => !o); setLangOpen(false); }}>
                {user.name} →
              </button>
              {userOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => { nav('profile'); setUserOpen(false); }}>Mi perfil</button>
                  <button className="dropdown-item" onClick={() => { setShowLogoutConfirm(true); setUserOpen(false); }}>Cerrar sesión</button>
                  <button className="dropdown-item danger" onClick={() => { setShowDeleteConfirm(true); setUserOpen(false); }}>Borrar cuenta</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button className="navbar-hamburger" onClick={() => setMenuOpen(o => !o)}
          aria-label="Menú">
          <span /><span /><span />
        </button>
      </nav>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <p>¿Estás seguro de que quieres cerrar la sesión?</p>
            <div className="confirm-buttons">
              <button className="confirm-btn" onClick={() => { logout(); setShowLogoutConfirm(false); nav('home'); }}>Sí</button>
              <button className="confirm-btn" onClick={() => setShowLogoutConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account confirm */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <p>¿Estás seguro de que quieres eliminar tu cuenta?</p>
            <div className="confirm-buttons">
              <button className="confirm-btn" onClick={() => { logout(); setShowDeleteConfirm(false); nav('home'); }}>Sí</button>
              <button className="confirm-btn" onClick={() => setShowDeleteConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
