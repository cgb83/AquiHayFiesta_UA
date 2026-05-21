import { Phone, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Hero() {
  return (
    <div className="hero">
      <h1 className="hero-title">AquiHayFiesta</h1>
    </div>
  );
}

export function Footer({ onNavigate }) {
  const { t } = useApp();
  return (
    <footer className="footer">
      <span>© AquiHayFiesta 2026</span>
      <button 
        type="button"
        className="footer-link"
        onClick={() => onNavigate?.('contact')}
      >
        <Phone size={14} /> {t('footer_contact')}
      </button>
      <button 
        type="button"
        className="footer-link"
        onClick={() => onNavigate?.('privacy')}
      >
        <Shield size={14} /> {t('footer_privacy')}
      </button>
    </footer>
  );
}