export function Hero() {
  return (
  <div className="hero">

    <h1 className="hero-title">AquiHayFiesta</h1>
  </div>
  );
}

export function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <span>© AquiHayFiesta 2026</span>
      <button 
        type="button"
        className="footer-link"
        onClick={() => onNavigate?.('contact')}
      >
        Contacto
      </button>
      <button 
        type="button"
        className="footer-link"
        onClick={() => onNavigate?.('privacy')}
      >
        Privacidad
      </button>
    </footer>
  );
}
