import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { deleteMyAccount } from '../../services/api';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout, lang, setLang } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const langRef = useRef(null);
  const userRef = useRef(null);

  const nav = (page) => { onNavigate(page); setMenuOpen(false); setLangOpen(false); setUserOpen(false); };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }

      if (!langRef.current?.contains(event.target)) {
        setLangOpen(false);
      }

      if (!userRef.current?.contains(event.target)) {
        setUserOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setLangOpen(false);
        setUserOpen(false);
        setShowLogoutConfirm(false);
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <nav className="navbar" ref={navRef} aria-label="Navegacion principal">
        {/* Left: nav links (Desktop) */}
        <div className="navbar-links">
          <button type="button" className={`navbar-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => nav('home')}>Inicio</button>
          {user && <>
            <button type="button" className={`navbar-link ${currentPage === 'saved' ? 'active' : ''}`}
              onClick={() => nav('saved')}>Guardados</button>
            <button type="button" className={`navbar-link ${currentPage === 'manage' ? 'active' : ''}`}
              onClick={() => nav('manage')}>Mis publicaciones</button>
            <button type="button" className={`navbar-link ${currentPage === 'create-fiesta' ? 'active' : ''}`}
              onClick={() => nav('create-fiesta')}>Crear Fiesta</button>
          </>}
        </div>

        {/* Left: nav menu (Mobile) */}
        <div className="dropdown-wrap navbar-menu-dropdown" ref={menuRef}>
          <button type="button" className="dropdown-trigger navbar-hamburger"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            aria-label="Menú"
            onClick={() => { setMenuOpen(o => !o); setLangOpen(false); setUserOpen(false); }}>
            <span /><span /><span />
          </button>
          {menuOpen && (
            <div className="dropdown-menu" id="nav-menu" role="menu">
              <button type="button" className={`dropdown-item ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => nav('home')}>Inicio</button>
              {user && <>
                <button type="button" className={`dropdown-item ${currentPage === 'saved' ? 'active' : ''}`}
                  onClick={() => nav('saved')}>Guardados</button>
                <button type="button" className={`dropdown-item ${currentPage === 'manage' ? 'active' : ''}`}
                  onClick={() => nav('manage')}>Mis publicaciones</button>
                <button type="button" className={`dropdown-item ${currentPage === 'create-fiesta' ? 'active' : ''}`}
                  onClick={() => nav('create-fiesta')}>Crear Fiesta</button>
              </>}
            </div>
          )}
        </div>

        {/* Right: lang + user */}
        <div className="navbar-actions" style={{ marginLeft: 'auto' }}>
          {/* Language picker */}
          <div className="dropdown-wrap" ref={langRef}>
            <button type="button" className="dropdown-trigger"
              aria-haspopup="menu"
              aria-expanded={langOpen}
              aria-controls="lang-menu"
              onClick={() => { setLangOpen(o => !o); setUserOpen(false); }}>
              {lang} <span style={{ fontSize: '0.7rem' }}>▼</span>
              <span style={{
                fontSize: '1rem',
                filter: 'none'
              }}>
                🌐
              </span>
            </button>
            {langOpen && (
              <div className="dropdown-menu" id="lang-menu" role="menu">
                <button type="button" className="dropdown-item" onClick={() => { setLang('ES'); setLangOpen(false); }}>Español</button>
                <button type="button" className="dropdown-item" onClick={() => { setLang('EN'); setLangOpen(false); }}>English</button>
              </div>
            )}
          </div>

          {/* Auth */}
          {!user ? (
            <button type="button" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              onClick={() => nav('login')}>
              Iniciar Sesión →
            </button>
          ) : (
            <div className="dropdown-wrap" ref={userRef}>
              <button type="button" className="dropdown-trigger"
                aria-haspopup="menu"
                aria-expanded={userOpen}
                aria-controls="user-menu"
                onClick={() => { setUserOpen(o => !o); setLangOpen(false); }}>
                {user.name} →
              </button>
              {userOpen && (
                <div className="dropdown-menu" id="user-menu" role="menu">
                  <button type="button" className="dropdown-item" onClick={() => { nav('profile'); setUserOpen(false); }}>Mi perfil</button>
                  <button type="button" className="dropdown-item" onClick={() => { setShowLogoutConfirm(true); setUserOpen(false); }}>Cerrar sesión</button>
                  <button type="button" className="dropdown-item danger" onClick={() => { setShowDeleteConfirm(true); setUserOpen(false); }}>Borrar cuenta</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-label="Confirmar cierre de sesion" onClick={e => e.stopPropagation()} tabIndex={-1}>
            <p>¿Estás seguro de que quieres cerrar la sesión?</p>
            <div className="confirm-buttons">
              <button type="button" className="confirm-btn" onClick={() => { logout(); setShowLogoutConfirm(false); nav('home'); }}>Sí</button>
              <button type="button" className="confirm-btn" onClick={() => setShowLogoutConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account confirm */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => { if (!deleteLoading) setShowDeleteConfirm(false); }}>
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-label="Confirmar borrado de cuenta" onClick={e => e.stopPropagation()} tabIndex={-1}>
            <p>¿Estás seguro de que quieres eliminar tu cuenta?</p>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-soft)' }}>Esta acción no se puede deshacer.</p>
            <div className="confirm-buttons">
              <button type="button" className="confirm-btn" disabled={deleteLoading}
                onClick={async () => {
                  try {
                    setDeleteLoading(true);
                    await deleteMyAccount();
                  } catch {
                    // Si la llamada falla, el usuario ya no existe o el token caducó — limpiar igualmente
                  } finally {
                    logout();
                    setDeleteLoading(false);
                    setShowDeleteConfirm(false);
                    nav('home');
                  }
                }}>
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
              <button type="button" className="confirm-btn" disabled={deleteLoading} onClick={() => setShowDeleteConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
