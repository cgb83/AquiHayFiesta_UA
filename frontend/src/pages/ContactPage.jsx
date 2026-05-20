import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function ContactPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('error', 'Por favor, corrige los errores del formulario.');
      return;
    }

    try {
      setLoading(true);
      
      // Simular envío con delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // TODO: Implementar endpoint de contacto en el backend
      // await sendContactMessage(formData);
      
      setSent(true);
      addToast('success', '¡Mensaje enviado! Nos pondremos en contacto pronto.');
      
      // Resetear después de 3 segundos
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSent(false);
      }, 3000);
    } catch (error) {
      addToast('error', 'Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-success">
            <div className="success-icon">✓</div>
            <h2>¡Mensaje Enviado!</h2>
            <p>Gracias por contactarnos. Revisaremos tu mensaje y te responderemos pronto.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contacto</h1>
        <p className="contact-subtitle">¿Tienes preguntas o sugerencias? Nos encantaría escucharte.</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'form-input-error' : ''}`}
              placeholder="Tu nombre"
              disabled={loading}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">Asunto *</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`form-input ${errors.subject ? 'form-input-error' : ''}`}
              placeholder="Asunto de tu mensaje"
              disabled={loading}
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Mensaje *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`form-input form-textarea ${errors.message ? 'form-input-error' : ''}`}
              placeholder="Cuéntanos qué piensas..."
              rows="6"
              disabled={loading}
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
            <span className="char-count">{formData.message.length} caracteres</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary contact-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Enviando...
              </>
            ) : (
              'Enviar mensaje'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
