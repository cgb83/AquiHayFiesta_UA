import { useState } from 'react';

export default function PrivacyPage() {
  const [expanded, setExpanded] = useState(null);

  const sections = [
    { id: 'intro', title: 'Introducción' },
    { id: 'collect', title: 'Información que Recopilamos' },
    { id: 'usage', title: 'Cómo Utilizamos Tu Información' },
    { id: 'cloud', title: 'Almacenamiento en la Nube' },
    { id: 'protection', title: 'Protección de Datos' },
    { id: 'share', title: 'Compartir Información' },
    { id: 'rights', title: 'Tus Derechos' },
    { id: 'cookies', title: 'Cookies y Seguimiento' },
    { id: 'links', title: 'Enlaces a Terceros' },
    { id: 'changes', title: 'Cambios en Esta Política' },
    { id: 'contact', title: 'Contacto' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <header className="privacy-header">
          <h1 className="privacy-title">Política de Privacidad</h1>
          <p className="privacy-updated">
            Última actualización: {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="privacy-toc">
          <h2>Índice de Contenidos</h2>
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
            <h2>Introducción</h2>
            <p>
              En AquiHayFiesta respetamos tu privacidad y nos comprometemos a proteger tus datos personales. 
              Esta política de privacidad explica de manera clara y transparente cómo recopilamos, utilizamos, 
              almacenamos y protegemos tu información cuando interactúas con nuestra plataforma.
            </p>
            <p>
              Si tienes preguntas sobre esta política o cómo manejamos tus datos, no dudes en <a href="#section-contact">contactarnos</a>.
            </p>
          </section>

          {/* 2. Información que Recopilamos */}
          <section id="section-collect" className="privacy-section">
            <h2>Información que Recopilamos</h2>
            <p>Recopilamos la siguiente información en diferentes contextos:</p>
            
            <div className="info-card">
              <h3>📝 Información de Registro</h3>
              <p>Nombre, correo electrónico y contraseña encriptada cuando te registras en nuestra plataforma.</p>
            </div>

            <div className="info-card">
              <h3>👤 Información de Perfil</h3>
              <p>Foto de perfil, biografía, ubicación y preferencias de usuario que configuraste en tu cuenta.</p>
            </div>

            <div className="info-card">
              <h3>🎉 Información de Actividad</h3>
              <p>Fiestas guardadas, búsquedas realizadas, comentarios, reseñas e interacciones con otros usuarios.</p>
            </div>

            <div className="info-card">
              <h3>💻 Información Técnica</h3>
              <p>Dirección IP, tipo de navegador, sistema operativo, página de referencia, timestamps de acceso y datos de sesión.</p>
            </div>

            <div className="info-card">
              <h3>📸 Información de Contenido</h3>
              <p>Imágenes, videos y documentos que subes para crear fiestas, incluyendo metadatos asociados.</p>
            </div>
          </section>

          {/* 3. Cómo Utilizamos Tu Información */}
          <section id="section-usage" className="privacy-section">
            <h2>Cómo Utilizamos Tu Información</h2>
            <p>Utilizamos la información recopilada para los siguientes propósitos:</p>
            
            <ul className="privacy-list">
              <li><strong>Prestación de Servicios:</strong> Proporcionar acceso a la plataforma y funcionalidades.</li>
              <li><strong>Mejora Continua:</strong> Analizar patrones de uso para mejorar características y experiencia.</li>
              <li><strong>Personalización:</strong> Personalizar tu experiencia mostrando contenido relevante.</li>
              <li><strong>Comunicación:</strong> Enviarte notificaciones, actualizaciones y responder a consultas.</li>
              <li><strong>Seguridad:</strong> Garantizar la seguridad de la plataforma y prevenir fraudes.</li>
              <li><strong>Cumplimiento Legal:</strong> Cumplir con obligaciones legales y regulatorias.</li>
              <li><strong>Análisis:</strong> Entender demográficos, intereses y comportamientos de usuarios.</li>
            </ul>
          </section>

          {/* 4. Almacenamiento en la Nube */}
          <section id="section-cloud" className="privacy-section">
            <h2>Almacenamiento de Contenido en la Nube</h2>
            <p>
              Utilizamos <strong>Cloudinary</strong> como proveedor de almacenamiento en la nube para imágenes y videos. 
              Tu contenido se almacena de forma segura en servidores en la nube con encriptación en tránsito.
            </p>
            <div className="warning-box">
              <strong>⚠️ Importante:</strong> Por favor, respeta los derechos de autor y no subas contenido que no te pertenezca 
              o que viole políticas de uso. Cloudinary cuenta con sistemas para detectar y actuar sobre contenido violatorio.
            </div>
          </section>

          {/* 5. Protección de Datos */}
          <section id="section-protection" className="privacy-section">
            <h2>Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad exhaustivas para proteger tus datos personales contra acceso no autorizado, 
              alteración, divulgación o destrucción:
            </p>
            
            <ul className="privacy-list">
              <li><strong>Encriptación SSL:</strong> Transmisión segura de datos sensibles mediante HTTPS.</li>
              <li><strong>Contraseñas Encriptadas:</strong> Las contraseñas se almacenan encriptadas usando algoritmos modernos.</li>
              <li><strong>Control de Acceso:</strong> Acceso restringido a datos personales a personal autorizado.</li>
              <li><strong>Auditorías de Seguridad:</strong> Revisiones periódicas de nuestros sistemas de seguridad.</li>
              <li><strong>Firewalls y Protección:</strong> Sistemas avanzados de defensa contra intrusiones.</li>
            </ul>
            
            <p>
              Sin embargo, ningún método de transmisión por Internet es 100% seguro. Aunque tomamos todas las precauciones, 
              no podemos garantizar seguridad absoluta.
            </p>
          </section>

          {/* 6. Compartir Información */}
          <section id="section-share" className="privacy-section">
            <h2>Compartir Información</h2>
            <p>
              <strong>No vendemos</strong> tus datos personales a terceros. Sin embargo, compartimos información en los siguientes casos:
            </p>
            
            <div className="info-card">
              <h3>📋 Proveedores de Servicios</h3>
              <p>Con servicios que nos ayudan a operar: Cloudinary (almacenamiento), MongoDB (base de datos), proveedores de email, etc.</p>
            </div>

            <div className="info-card">
              <h3>⚖️ Requerimientos Legales</h3>
              <p>Cuando sea requerido por ley, orden judicial, o por autoridades competentes.</p>
            </div>

            <div className="info-card">
              <h3>🛡️ Protección de Derechos</h3>
              <p>Para proteger nuestros derechos legales, privacidad, seguridad o la de nuestros usuarios.</p>
            </div>
          </section>

          {/* 7. Tus Derechos */}
          <section id="section-rights" className="privacy-section">
            <h2>Tus Derechos</h2>
            <p>Tienes los siguientes derechos respecto a tu información personal:</p>
            
            <ul className="privacy-list">
              <li><strong>Derecho de Acceso:</strong> Solicitar y acceder a tus datos personales.</li>
              <li><strong>Derecho de Corrección:</strong> Corregir información inexacta o incompleta.</li>
              <li><strong>Derecho al Olvido:</strong> Solicitar la eliminación de tus datos (dentro de limitaciones legales).</li>
              <li><strong>Derecho de Portabilidad:</strong> Recibir tus datos en formato estructurado y portable.</li>
              <li><strong>Derecho a Revocar Consentimiento:</strong> Retirar tu consentimiento en cualquier momento.</li>
              <li><strong>Derecho de Oposición:</strong> Oponerme al procesamiento de tus datos en ciertos casos.</li>
            </ul>
            
            <p>
              Para ejercer cualquiera de estos derechos, contacta con nosotros a través de la <a href="#section-contact">sección de contacto</a>.
            </p>
          </section>

          {/* 8. Cookies y Tecnologías de Seguimiento */}
          <section id="section-cookies" className="privacy-section">
            <h2>Cookies y Tecnologías de Seguimiento</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Las cookies son pequeños archivos 
              de texto almacenados en tu dispositivo que nos ayudan a:
            </p>
            
            <ul className="privacy-list">
              <li>Recordar tus preferencias y configuración.</li>
              <li>Entender cómo usas nuestra plataforma.</li>
              <li>Mantener tu sesión activa de forma segura.</li>
              <li>Proporcionar funcionalidad esencial.</li>
            </ul>
            
            <p>
              Puedes controlar las cookies a través de la configuración de tu navegador. Ten en cuenta que desactivar 
              cookies puede afectar la funcionalidad de la plataforma.
            </p>
          </section>

          {/* 9. Enlaces a Terceros */}
          <section id="section-links" className="privacy-section">
            <h2>Enlaces a Sitios de Terceros</h2>
            <p>
              Nuestra plataforma puede contener enlaces a sitios web de terceros. No somos responsables de sus políticas 
              de privacidad o prácticas de seguridad.
            </p>
            <div className="warning-box">
              <strong>⚠️ Aviso:</strong> Te recomendamos revisar la política de privacidad de cualquier sitio de terceros 
              antes de proporcionar información personal.
            </div>
          </section>

          {/* 10. Cambios en Esta Política */}
          <section id="section-changes" className="privacy-section">
            <h2>Cambios en Esta Política</h2>
            <p>
              Podemos actualizar esta política de privacidad en cualquier momento para reflejar cambios en nuestras prácticas, 
              tecnología, requisitos legales u otros factores.
            </p>
            <p>
              Te notificaremos sobre cambios significativos mediante un aviso destacado en la plataforma. 
              Tu uso continuado de AquiHayFiesta después de los cambios constituye tu aceptación de la política actualizada.
            </p>
          </section>

          {/* 11. Contacto */}
          <section id="section-contact" className="privacy-section">
            <h2>Contacto</h2>
            <p>
              Si tienes preguntas, preocupaciones o deseas ejercer tus derechos de privacidad, 
              ponte en contacto con nosotros a través de nuestra <a href="#/contact">página de contacto</a>.
            </p>
            <p>
              Nos comprometemos a responder a todas las solicitudes dentro de 30 días hábiles.
            </p>
          </section>

          {/* Footer Note */}
          <div className="privacy-footer-note">
            <p>
              <strong>Nota Legal:</strong> Esta política de privacidad se proporciona con fines informativos. 
              Para asuntos legales específicos, consulta con un abogado especializado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
