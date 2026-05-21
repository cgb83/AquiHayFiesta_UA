import { useRef, useState } from 'react';
import { Upload, Check, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { createFiesta } from '../services/api';

const CATEGORY_OPTIONS = [
  { id: 'amor',      label: 'Amor' },
  { id: 'noche',     label: 'Noche' },
  { id: 'disfraces', label: 'Disfraces' },
  { id: 'familia',   label: 'Familia' },
  { id: 'musica',    label: 'Música' },
  { id: 'gastronomia', label: 'Gastronomía' },
  { id: 'deporte',   label: 'Deporte' },
  { id: 'infantil',  label: 'Infantil' },
  { id: 'bodas',     label: 'Bodas' },
  { id: 'negocios',  label: 'Negocios' },
  { id: 'cultural',  label: 'Cultural' },
  { id: 'religiosa', label: 'Religiosa' },
];

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export default function CreateFiestaPage({ onNavigate }) {
  const { user, t } = useApp();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    categories: ['familia'],
    startDate: '',
    endDate: '',
    city: '',
    country: 'España',
    address: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-xl)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('create_login_needed')}</h2>
        <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-soft)' }}>
          {t('create_login_msg')}
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate('login')}>
          {t('create_login_btn')}
        </button>
      </div>
    );
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();


  // Validaciones
  if (!form.title.trim()) {
    setError('El título es obligatorio.');
    return;
  }
  if (!coverImage) {
    setError('La portada es obligatoria.');
    return;
  }
  if (!form.description.trim()) {
    setError('La descripción es obligatoria.');
    return;
  }
  if (form.categories.length === 0) {
    setError('Debes seleccionar al menos una categoría.');
    return;
  }
  if (!form.startDate) {
    setError('La fecha de inicio es obligatoria.');
    return;
  }
  if (form.endDate && form.endDate < form.startDate) {
    setError('La fecha de fin no puede ser anterior a la de inicio.');
    return;
  }
  if (coverImage && !IMAGE_TYPES.includes(coverImage.type)) {
    setError('La portada debe ser una imagen JPG, PNG, WEBP o GIF.');
    return;
  }
  if (coverImage && coverImage.size > MAX_IMAGE_SIZE) {
    setError('La portada no puede superar 10MB.');
    return;
  }

    try {
      setLoading(true);
      setError('');
      await createFiesta({ 
        ...form, 
        title: form.title.trim(), 
        description: form.description.trim(), 
        coverImage 
      });
      
      addToast('¡Fiesta creada correctamente!', 'success');
      
      // Limpiar formulario
      setForm({
        title: '',
        description: '',
        categories: ['familia'],
        startDate: '',
        endDate: '',
        city: '',
        country: 'España',
        address: '',
      });
      setCoverImage(null);
      
      // Redirigir a manage después de 1.5 segundos
      setTimeout(() => {
        onNavigate('manage');
      }, 1500);
    } catch (err) {
      setError(err.message || 'No se pudo crear la fiesta.');
      addToast(err.message || 'Error al crear la fiesta', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setForm((prev) => {
      const exists = prev.categories.includes(categoryId);
      if (exists) {
        return { ...prev, categories: prev.categories.filter((item) => item !== categoryId) };
      }
      return { ...prev, categories: [...prev.categories, categoryId] };
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--space-xl)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,5vw,2.5rem)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
        {t('create_title')}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {error && (
          <div className="form-validation-error" role="alert">
            {error}
          </div>
        )}

        {/* Título */}
        <div className="form-group">
          <label className="form-label" htmlFor="create-title">
            {t('modal_titulo')} <span className="alerta">*</span>
          </label>
          <input 
            id="create-title" 
            className="form-input" 
            placeholder="Ej: Fiestas del pueblo 2026"
            value={form.title} 
            onChange={e => set('title', e.target.value)} 
            disabled={loading}
            required
          />
        </div>

        {/* Portada */}
        <div className="form-group">
          <label className="form-label" htmlFor="create-cover">
            {t('create_portada_label')}  <span className="alerta">*</span>
          </label>
          <input
            ref={fileInputRef}
            id="create-cover-input"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            disabled={loading}
            required
          />
          <button 
            id="create-cover"
            type="button"
            className="btn btn-outline" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => fileInputRef.current?.click()} 
            disabled={loading}
          >
            {coverImage ? <><Check size={16} /> {coverImage.name}</> : <><Upload size={16} /> {t('create_subir_imagen')}</>}
          </button>
          <div className="form-hint">{t('modal_hint_imagen')}</div>
          {coverImage && (
            <div style={{ marginTop: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--color-text-soft)' }}>
              {t('create_tamano')} {(coverImage.size / 1024 / 1024).toFixed(2)}MB
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label className="form-label" htmlFor="create-description">
            {t('modal_descripcion')}  <span className="alerta">*</span>
          </label>
          <input 
            id="create-description" 
            className="form-input" 
            placeholder={t('create_desc_placeholder')}
            value={form.description} 
            onChange={e => set('description', e.target.value)} 
            disabled={loading}
            required
          />
        </div>

        {/* Categorías */}
        <div className="form-group">
          <label className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
            {t('modal_categorias')} <span className="alerta">*</span> (puedes elegir varias)
          </label>
          <div className="category-multi-grid" role="group" aria-label="Categorías">
            {CATEGORY_OPTIONS.map((category) => {
              const active = form.categories.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`category-pill ${active ? 'is-active' : ''}`}
                  onClick={() => toggleCategory(category.id)}
                  disabled={loading}
                  aria-pressed={active}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fechas */}
        <div className="dates-row">
          <div className="form-group">
            <label className="form-label" htmlFor="create-start">{t('modal_fecha_inicio')}  <span className="alerta">*</span></label>
            <input 
              id="create-start" 
              className="form-input" 
              type="date"
              style={{ width: '100%' }}
              value={form.startDate} 
              onChange={e => set('startDate', e.target.value)} 
              disabled={loading}
              required

            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="create-end">{t('modal_fecha_fin')}</label>
            <input 
              id="create-end" 
              className="form-input" 
              type="date"
              value={form.endDate} 
              style={{ width: '100%' }}
              onChange={e => set('endDate', e.target.value)} 
              disabled={loading}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="create-city">{t('modal_ciudad')}</label>
            <input 
              id="create-city" 
              className="form-input" 
              placeholder="Madrid"
              value={form.city} 
              onChange={e => set('city', e.target.value)} 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="create-country">{t('modal_pais')}</label>
            <input 
              id="create-country" 
              className="form-input" 
              placeholder={t('modal_pais')}
              value={form.country} 
              onChange={e => set('country', e.target.value)} 
              disabled={loading}

            />
          </div>
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label className="form-label" htmlFor="create-address">{t('modal_direccion')}</label>
          <input 
            id="create-address" 
            className="form-input" 
            placeholder="Calle principal, 123"
            value={form.address} 
            onChange={e => set('address', e.target.value)} 
            disabled={loading}
          />
        </div>

        {/* Botones */}
        <div className="create-fiesta-buttons">
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <Upload size={16} />
          <span className="create-btn-text"> {loading ? t('create_publicando') : t('create_publicar')}</span>
          </button>
          <button 
            type="button"
            className="btn btn-outline" 
            onClick={() => onNavigate('manage')}
            disabled={loading}
          >
            <ArrowLeft size={16} />
            <span className="create-btn-text"> {t('cancelar')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
