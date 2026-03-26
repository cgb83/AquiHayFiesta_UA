import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import { Hero, Footer } from './components/layout/HeroFooter';
import SearchBar from './components/ui/SearchBar';

import HomePage     from './pages/HomePage';
import FiestaPage   from './pages/FiestaPage';
import CategoryPage from './pages/CategoryPage';
import SavedPage    from './pages/SavedPage';
import ManagePage   from './pages/ManagePage';
import ProfilePage  from './pages/ProfilePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import './styles/globals.css';

// Pages that show the hero+searchbar shell
const SHELL_PAGES = ['home', 'fiesta', 'category', 'saved', 'manage', 'profile'];

function AppInner() {
  const { user } = useApp();
  // route = { page, param } e.g. { page: 'fiesta', param: 'san-valentin' }
  const [route, setRoute] = useState({ page: 'home', param: null });
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null

  const closeAuthModal = () => setAuthModal(null);

  const handleAuthNavigate = (page, param = null) => {
    if (page === 'login' || page === 'register') {
      setAuthModal(page);
      return;
    }
    closeAuthModal();
    setRoute({ page, param });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = (page, param = null) => {
    if (page === 'login' || page === 'register') {
      setAuthModal(page);
      return;
    }

    // Guard auth-required pages
    if ((page === 'saved' || page === 'manage' || page === 'profile') && !user) {
      setAuthModal('login');
      return;
    }
    setRoute({ page, param });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isShell = SHELL_PAGES.includes(route.page);

  return (
    <div className={`app-shell ${authModal ? 'modal-open' : ''}`}>
      {/* Hero only on shell pages */}
      {isShell && <Hero />}

      <Navbar onNavigate={navigate} currentPage={route.page} />

      {/* Main content */}
      <main style={{ flex: 1 }}>
        {isShell && (
          <div className="page-content">
            {/* SearchBar shown on most pages except manage & profile */}
            {!['manage', 'profile'].includes(route.page) && (
              <SearchBar
                onSearch={() => {}}
                onCategory={(id) => id && navigate('category', id)}
              />
            )}

            {route.page === 'home'     && <HomePage     onNavigate={navigate} />}
            {route.page === 'fiesta'   && <FiestaPage   slug={route.param} onNavigate={navigate} />}
            {route.page === 'category' && <CategoryPage categoryId={route.param} onNavigate={navigate} />}
            {route.page === 'saved'    && <SavedPage    onNavigate={navigate} />}
            {route.page === 'manage'   && <ManagePage />}
            {route.page === 'profile'  && <ProfilePage />}
          </div>
        )}
      </main>

      {/* Footer on all shell pages */}
      {isShell && <Footer />}

      {authModal && (
        <div className="auth-modal-overlay" onClick={closeAuthModal}>
          <div
            className="auth-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={authModal === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="auth-modal-close" onClick={closeAuthModal} aria-label="Cerrar">
              ✕
            </button>
            {authModal === 'login' && <LoginPage onNavigate={handleAuthNavigate} />}
            {authModal === 'register' && <RegisterPage onNavigate={handleAuthNavigate} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
