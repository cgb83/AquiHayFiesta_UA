import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import { Hero, Footer } from './components/layout/HeroFooter';
import SearchBar from './components/ui/SearchBar';

import HomePage        from './pages/HomePage';
import FiestaPage      from './pages/FiestaPage';
import CategoryPage    from './pages/CategoryPage';
import SavedPage       from './pages/SavedPage';
import ManagePage      from './pages/ManagePage';
import CreateFiestaPage from './pages/CreateFiestaPage';
import ProfilePage     from './pages/ProfilePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';

import './styles/globals.css';

// Pages that show the hero+searchbar shell
const SHELL_PAGES = ['home', 'fiesta', 'category', 'saved', 'manage', 'create-fiesta', 'profile'];

function AppInner() {
  const { user } = useApp();
  // route = { page, param } e.g. { page: 'fiesta', param: 'san-valentin' }
  const [route, setRoute] = useState(() => {
    try {
      const saved = sessionStorage.getItem('ahf_route');
      if (saved) {
        const parsed = JSON.parse(saved);
        const protectedPages = ['saved', 'manage', 'create-fiesta', 'profile'];
        const user = JSON.parse(localStorage.getItem('ahf_user'));
        if (protectedPages.includes(parsed.page) && !user) {
          return { page: 'home', param: null };
        }
        return parsed;
      }
      return { page: 'home', param: null };
    } catch {
      return { page: 'home', param: null };
    }
  });
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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
    if ((page === 'saved' || page === 'manage' || page === 'create-fiesta' || page === 'profile') && !user) {
      setAuthModal('login');
      return;
    }
    // Handle search queries (param starting with 'search:')
    if (page === 'home' && param && param.startsWith('search:')) {
      setSearchQuery(param.substring(7));
      setCategoryFilter(''); // Clear category filter when doing a text search
      param = null;
    } else if (page !== 'home') {
      setSearchQuery('');
      setCategoryFilter('');
    }
    const newRoute = { page, param };
    sessionStorage.setItem('ahf_route', JSON.stringify(newRoute));
    setRoute({ page, param });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isShell = SHELL_PAGES.includes(route.page);

  useEffect(() => {
    if (!authModal) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAuthModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [authModal]);

  return (
    <div className={`app-shell ${authModal ? 'modal-open' : ''}`}>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      {/* Hero only on shell pages */}
      {isShell && <Hero />}

      <Navbar onNavigate={navigate} currentPage={route.page} />

      {/* Main content */}
      <main id="main-content" style={{ flex: 1 }}>
        {isShell && (
          <div className="page-content">
            {/* SearchBar shown on most pages except manage, create-fiesta & profile */}
            {!['manage', 'create-fiesta', 'profile'].includes(route.page) && (
              <SearchBar
                key={route.page}
                searchQuery={searchQuery}
                categoryFilter={categoryFilter}
                onSearch={setSearchQuery}
                onCategory={setCategoryFilter}
              />
            )}

            {route.page === 'home'          && <HomePage     onNavigate={navigate} searchQuery={searchQuery} categoryFilter={categoryFilter} />}
            {route.page === 'fiesta'        && <FiestaPage   slug={route.param} onNavigate={navigate} searchQuery={searchQuery} />}
            {route.page === 'category'      && <CategoryPage categoryId={route.param} onNavigate={navigate} />}
            {route.page === 'saved'         && <SavedPage    onNavigate={navigate} />}
            {route.page === 'manage'        && <ManagePage   onNavigate={navigate} />}
            {route.page === 'create-fiesta' && <CreateFiestaPage onNavigate={navigate} />}
            {route.page === 'profile'       && <ProfilePage />}
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
    <ToastProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ToastProvider>
  );
}
