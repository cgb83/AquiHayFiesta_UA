export function Hero() {
  return (
    <div className="hero">
      <img 
        src="/assets/logo.png" 
        alt="AquiHayFiesta Logo" 
        className="hero-logo"
        style={{ maxWidth: '140px', height: 'auto', marginBottom: '8px', objectFit: 'contain' }}
      />
      <h1 className="hero-title">AquiHayFiesta</h1>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>© AquiHayFiesta 2026</span>
      <a href="mailto:contacto@aquihayfiesta.es" className="footer-link">
         Contacto
      </a>
      <a href="#privacy" className="footer-link">
         Privacidad
      </a>
    </footer>
  );
}
