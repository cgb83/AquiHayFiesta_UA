import { useEffect, useRef, useState } from 'react';
import { Globe, LogIn, ChevronRight, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { deleteMyAccount } from '../../services/api';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout, lang, setLang, t } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navRef = useRef(null);
  const navLinksRef = useRef(null);
  const menuRef = useRef(null);
  const langRef = useRef(null);
  const userRef = useRef(null);

  const nav = (page) => { onNavigate(page); setMenuOpen(false); setLangOpen(false); setUserOpen(false); };

  // Auto-focus first item when a dropdown opens
  useEffect(() => {
    if (menuOpen) {
      const first = menuRef.current?.querySelector('.dropdown-menu button');
      first?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (langOpen) {
      const first = langRef.current?.querySelector('.dropdown-menu button');
      first?.focus();
    }
  }, [langOpen]);

  useEffect(() => {
    if (userOpen) {
      const first = userRef.current?.querySelector('.dropdown-menu button');
      first?.focus();
    }
  }, [userOpen]);

  // Up/Down arrow navigation inside any dropdown menu (uses event bubbling)
  const handleMenuKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
    const menu = e.currentTarget;
    const items = Array.from(menu.querySelectorAll('button'));
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement);
    e.preventDefault();
    if (e.key === 'ArrowDown') items[(idx + 1) % items.length].focus();
    else if (e.key === 'ArrowUp') items[(idx - 1 + items.length) % items.length].focus();
    else if (e.key === 'Home') items[0].focus();
    else if (e.key === 'End') items[items.length - 1].focus();
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
      if (!langRef.current?.contains(event.target)) setLangOpen(false);
      if (!userRef.current?.contains(event.target)) setUserOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setLangOpen(false);
        setUserOpen(false);
        setShowLogoutConfirm(false);
        setShowDeleteConfirm(false);
        return;
      }

      // Arrow navigation for desktop nav links
      const NAV_ARROW_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (NAV_ARROW_KEYS.includes(event.key) && navLinksRef.current?.contains(document.activeElement)) {
        const items = Array.from(navLinksRef.current.querySelectorAll('button'));
        const idx = items.indexOf(document.activeElement);
        if (idx === -1) return;
        event.preventDefault();
        let next = idx;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (idx + 1) % items.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (idx - 1 + items.length) % items.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = items.length - 1;
        items.forEach((btn, i) => { btn.tabIndex = i === next ? 0 : -1; });
        items[next].focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Roving tabindex: only the active nav button (or 'home' as fallback) is a Tab stop
  const navPages = ['home', 'saved', 'manage', 'create-fiesta'];
  const navTabIdx = (page) =>
    currentPage === page || (!navPages.includes(currentPage) && page === 'home') ? 0 : -1;

  return (
    <>
      <nav className="navbar" ref={navRef} aria-label="Navegacion principal">
        {/* Left: nav links (Desktop) */}
        <div className="navbar-links" role="menubar" aria-label="Navegación" ref={navLinksRef}>
          <button type="button" role="menuitem" tabIndex={navTabIdx('home')}
            className={`navbar-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => nav('home')}>{ t('nav_home') }</button>
          {user && <>
            <button type="button" role="menuitem" tabIndex={navTabIdx('saved')}
              className={`navbar-link ${currentPage === 'saved' ? 'active' : ''}`}
              onClick={() => nav('saved')}>{ t('nav_saved') }</button>
            <button type="button" role="menuitem" tabIndex={navTabIdx('manage')}
              className={`navbar-link ${currentPage === 'manage' ? 'active' : ''}`}
              onClick={() => nav('manage')}>{ t('nav_manage') }</button>
            <button type="button" role="menuitem" tabIndex={navTabIdx('create-fiesta')}
              className={`navbar-link ${currentPage === 'create-fiesta' ? 'active' : ''}`}
              onClick={() => nav('create-fiesta')}>{ t('nav_create') }</button>
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
            <div className="dropdown-menu" id="nav-menu" role="menu" onKeyDown={handleMenuKeyDown}>
              <button type="button" role="menuitem" className={`dropdown-item ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => nav('home')}>{ t('nav_home') }</button>
              {user && <>
                <button type="button" role="menuitem" className={`dropdown-item ${currentPage === 'saved' ? 'active' : ''}`}
                  onClick={() => nav('saved')}>{ t('nav_saved') }</button>
                <button type="button" role="menuitem" className={`dropdown-item ${currentPage === 'manage' ? 'active' : ''}`}
                  onClick={() => nav('manage')}>{ t('nav_manage') }</button>
                <button type="button" role="menuitem" className={`dropdown-item ${currentPage === 'create-fiesta' ? 'active' : ''}`}
                  onClick={() => nav('create-fiesta')}>{ t('nav_create') }</button>
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
              {lang} <ChevronDown size={12}/>
              <Globe size={18} style={{ color: 'var(--color-text)' }} />
            </button>
            {langOpen && (
              <div className="dropdown-menu" id="lang-menu" role="menu" onKeyDown={handleMenuKeyDown}>
                <button type="button" role="menuitem" className="dropdown-item" onClick={() => { setLang('ES'); setLangOpen(false); }}>Español</button>
                <button type="button" role="menuitem" className="dropdown-item" onClick={() => { setLang('EN'); setLangOpen(false); }}>English</button>
              </div>
            )}
          </div>

          {/* Auth */}
          {!user ? (
            <button type="button" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              onClick={() => nav('login')}>
              <LogIn size={16} /> { t('nav_login') }
            </button>
          ) : (
            <div className="dropdown-wrap" ref={userRef}>
              <button type="button" className="dropdown-trigger"
                aria-haspopup="menu"
                aria-expanded={userOpen}
                aria-controls="user-menu"
                onClick={() => { setUserOpen(o => !o); setLangOpen(false); }}>
                {user.name} <ChevronRight size={14}/>
              </button>
              {userOpen && (
                <div className="dropdown-menu" id="user-menu" role="menu" onKeyDown={handleMenuKeyDown}>
                  <button type="button" role="menuitem" className="dropdown-item" onClick={() => { nav('profile'); setUserOpen(false); }}>{ t('nav_profile') }</button>
                  <button type="button" role="menuitem" className="dropdown-item" onClick={() => { setShowLogoutConfirm(true); setUserOpen(false); }}>{ t('nav_logout') }</button>
                  <button type="button" role="menuitem" className="dropdown-item danger" onClick={() => { setShowDeleteConfirm(true); setUserOpen(false); }}>{ t('nav_delete') }</button>
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
            <p>{ t('nav_logout_confirm') }</p>
            <div className="confirm-buttons">
              <button type="button" className="confirm-btn" onClick={() => { logout(); setShowLogoutConfirm(false); nav('home'); }}>{ t('nav_yes') }</button>
              <button type="button" className="confirm-btn" onClick={() => setShowLogoutConfirm(false)}>{ t('nav_no') }</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account confirm */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => { if (!deleteLoading) setShowDeleteConfirm(false); }}>
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-label="Confirmar borrado de cuenta" onClick={e => e.stopPropagation()} tabIndex={-1}>
            <p>{ t('nav_delete_confirm') }</p>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-soft)' }}>{ t('nav_delete_warning') }</p>
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
                { deleteLoading ? t('nav_deleting') : t('nav_eliminar') }
              </button>
              <button type="button" className="confirm-btn" disabled={deleteLoading} onClick={() => setShowDeleteConfirm(false)}>{ t('nav_no') }</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
