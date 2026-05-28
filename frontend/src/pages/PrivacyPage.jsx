import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, User, Activity, Monitor, Camera, Clipboard, Scale, Shield, Phone, AlertTriangle } from 'lucide-react';

export default function PrivacyPage() {
  const { t, lang } = useApp();
  const [expanded, setExpanded] = useState(null);

  const sections = [
    { id: 'intro', title: t('priv_s1_title') },
    { id: 'collect', title: t('priv_s2_title') },
    { id: 'usage', title: t('priv_s3_title') },
    { id: 'cloud', title: t('priv_s4_title') },
    { id: 'protection', title: t('priv_s5_title') },
    { id: 'share', title: t('priv_s6_title') },
    { id: 'rights', title: t('priv_s7_title') },
    { id: 'cookies', title: t('priv_s8_title') },
    { id: 'links', title: t('priv_s9_title') },
    { id: 'changes', title: t('priv_s10_title') },
    { id: 'contact', title: t('priv_s11_title') },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <header className="privacy-header">
          <h1 className="privacy-title">{t('priv_title')}</h1>
          <p className="privacy-updated">
            {t('priv_updated')} {new Date().toLocaleDateString(lang === 'EN' ? 'en-US' : 'es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="privacy-toc">
          <h2>{t('priv_toc')}</h2>
          <ul className="toc-list">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className="toc-link"
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="privacy-content">
          {/* 1. Introducción */}
          <section id="section-intro" className="privacy-section">
            <h2>{t('priv_s1_title')}</h2>
            <p>{t('priv_s1_p1')}</p>
            <p>
              {t('priv_s1_p2')} <a href="#section-contact">{t('priv_s1_link')}</a>.
            </p>
          </section>

          {/* 2. Información que Recopilamos */}
          <section id="section-collect" className="privacy-section">
            <h2>{t('priv_s2_title')}</h2>
            <p>{t('priv_s2_intro')}</p>
            
            <div className="info-card">
              <h3><FileText size={16} /> {t('priv_s2_c1_title')}</h3>
              <p>{t('priv_s2_c1')}</p>
            </div>

            <div className="info-card">
              <h3><User size={16} /> {t('priv_s2_c2_title')}</h3>
              <p>{t('priv_s2_c2')}</p>
            </div>

            <div className="info-card">
              <h3><Activity size={16} /> {t('priv_s2_c3_title')}</h3>
              <p>{t('priv_s2_c3')}</p>
            </div>

            <div className="info-card">
              <h3><Monitor size={16} /> {t('priv_s2_c4_title')}</h3>
              <p>{t('priv_s2_c4')}</p>
            </div>

            <div className="info-card">
              <h3><Camera size={16} /> {t('priv_s2_c5_title')}</h3>
              <p>{t('priv_s2_c5')}</p>
            </div>
          </section>

          {/* 3. Cómo Utilizamos Tu Información */}
          <section id="section-usage" className="privacy-section">
            <h2>{t('priv_s3_title')}</h2>
            <p>{t('priv_s3_intro')}</p>
            
            <ul className="privacy-list">
              <li>{t('priv_s3_l1')}</li>
              <li>{t('priv_s3_l2')}</li>
              <li>{t('priv_s3_l3')}</li>
              <li>{t('priv_s3_l4')}</li>
              <li>{t('priv_s3_l5')}</li>
              <li>{t('priv_s3_l6')}</li>
              <li>{t('priv_s3_l7')}</li>
            </ul>
          </section>

          {/* 4. Almacenamiento en la Nube */}
          <section id="section-cloud" className="privacy-section">
            <h2>{t('priv_s4_title')}</h2>
            <p>{t('priv_s4_p1')}</p>
            <div className="warning-box">
              <strong><AlertTriangle size={16} style={{ display: 'inline', marginRight: 4 }} /> {t('priv_s4_warn')}</strong>
            </div>
          </section>

          {/* 5. Protección de Datos */}
          <section id="section-protection" className="privacy-section">
            <h2>{t('priv_s5_title')}</h2>
            <p>{t('priv_s5_p1')}</p>
            
            <ul className="privacy-list">
              <li>{t('priv_s5_l1')}</li>
              <li>{t('priv_s5_l2')}</li>
              <li>{t('priv_s5_l3')}</li>
              <li>{t('priv_s5_l4')}</li>
              <li>{t('priv_s5_l5')}</li>
            </ul>
            
            <p>{t('priv_s5_p2')}</p>
          </section>

          {/* 6. Compartir Información */}
          <section id="section-share" className="privacy-section">
            <h2>{t('priv_s6_title')}</h2>
            <p>{t('priv_s6_intro')}</p>
            
            <div className="info-card">
              <h3><Clipboard size={16} /> {t('priv_s6_c1_title')}</h3>
              <p>{t('priv_s6_c1')}</p>
            </div>

            <div className="info-card">
              <h3><Scale size={16} /> {t('priv_s6_c2_title')}</h3>
              <p>{t('priv_s6_c2')}</p>
            </div>

            <div className="info-card">
              <h3><Shield size={16} /> {t('priv_s6_c3_title')}</h3>
              <p>{t('priv_s6_c3')}</p>
            </div>
          </section>

          {/* 7. Tus Derechos */}
          <section id="section-rights" className="privacy-section">
            <h2>{t('priv_s7_title')}</h2>
            <p>{t('priv_s7_intro')}</p>
            
            <ul className="privacy-list">
              <li>{t('priv_s7_l1')}</li>
              <li>{t('priv_s7_l2')}</li>
              <li>{t('priv_s7_l3')}</li>
              <li>{t('priv_s7_l4')}</li>
              <li>{t('priv_s7_l5')}</li>
              <li>{t('priv_s7_l6')}</li>
            </ul>
            
            <p>
              {t('priv_s7_p2')} <a href="#section-contact">{t('priv_s7_link')}</a>.
            </p>
          </section>

          {/* 8. Cookies y Tecnologías de Seguimiento */}
          <section id="section-cookies" className="privacy-section">
            <h2>{t('priv_s8_title')}</h2>
            <p>{t('priv_s8_p1')}</p>
            
            <ul className="privacy-list">
              <li>{t('priv_s8_l1')}</li>
              <li>{t('priv_s8_l2')}</li>
              <li>{t('priv_s8_l3')}</li>
              <li>{t('priv_s8_l4')}</li>
            </ul>
            
            <p>{t('priv_s8_p2')}</p>
          </section>

          {/* 9. Enlaces a Terceros */}
          <section id="section-links" className="privacy-section">
            <h2>{t('priv_s9_title')}</h2>
            <p>{t('priv_s9_p1')}</p>
            <div className="warning-box">
              <strong><AlertTriangle size={16} style={{ display: 'inline', marginRight: 4 }} /> {t('priv_s9_warn')}</strong>
            </div>
          </section>

          {/* 10. Cambios en Esta Política */}
          <section id="section-changes" className="privacy-section">
            <h2>{t('priv_s10_title')}</h2>
            <p>{t('priv_s10_p1')}</p>
            <p>{t('priv_s10_p2')}</p>
          </section>

          {/* 11. Contacto */}
          <section id="section-contact" className="privacy-section">
            <h2>{t('priv_s11_title')}</h2>
            <p>
              {t('priv_s11_p1')} <a href="#/contact">{t('priv_s11_link')}</a>.
            </p>
            <p>{t('priv_s11_p2')}</p>
          </section>

          {/* Footer Note */}
          <div className="privacy-footer-note">
            <p>
              <strong>{t('priv_footer')}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}