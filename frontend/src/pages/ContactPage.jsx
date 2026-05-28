import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useApp } from '../context/AppContext';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function ContactPage() {
  const { t } = useApp();
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
      newErrors.name = t('contact_error_name');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('contact_error_email');
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = t('contact_error_email_invalid');
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t('contact_error_subject');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact_error_message');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact_error_message_short');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('error', t('contact_toast_error'));
      return;
    }

    try {
      setLoading(true);
      
      // Simular envío con delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // TODO: Implementar endpoint de contacto en el backend
      // await sendContactMessage(formData);
      
      setSent(true);
      addToast('success', t('contact_toast_success'));
      
      // Resetear después de 3 segundos
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSent(false);
      }, 3000);
    } catch (error) {
      addToast('error', t('contact_toast_fail'));
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
            <h2>{t('contact_sent_title')}</h2>
            <p>{t('contact_sent_msg')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">{t('contact_title')}</h1>
        <p className="contact-subtitle">{t('contact_subtitle')}</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">{t('contact_nombre')} <span class="alert">*</span></label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'form-input-error' : ''}`}
              placeholder={t('contact_nombre_placeholder')}
              disabled={loading}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">{t('contact_email')} <span class="alert">*</span></label>
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
            <label htmlFor="subject" className="form-label">{t('contact_asunto')} <span class="alert">*</span></label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`form-input ${errors.subject ? 'form-input-error' : ''}`}
              placeholder={t('contact_asunto_placeholder')}
              disabled={loading}
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">{t('contact_mensaje')} <span class="alert">*</span></label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`form-input form-textarea ${errors.message ? 'form-input-error' : ''}`}
              placeholder={t('contact_mensaje_placeholder')}
              rows="6"
              disabled={loading}
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
            <span className="char-count">{formData.message.length} {t('contact_caracteres')}</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary contact-submit-btn"
            disabled={loading}
          >
            {loading ? <><span className="spinner" />{t('contact_enviando')}</> : t('contact_enviar')}
          </button>
        </form>
      </div>
    </div>
  );
}
