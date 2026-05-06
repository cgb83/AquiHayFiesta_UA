import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { createFiesta } from '../services/api';

const CATEGORY_OPTIONS = [
  { id: 'amor', label: 'Amor' },
  { id: 'noche', label: 'Noche' },
  { id: 'disfraces', label: 'Disfraces' },
  { id: 'familia', label: 'Familia' },
  { id: 'musica', label: 'Musica' },
  { id: 'gastronomia', label: 'Gastronomia' },
];

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export default function CreateFiestaPage({ onNavigate }) {
  const { user } = useApp();
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
        <h2 style={{ marginBottom: 'var(--space-md)' }}>Necesitas iniciar sesión</h2>
        <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-soft)' }}>
          Para crear una fiesta debes estar autenticado.
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate('login')}>
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || form.categories.length === 0) {
      setError('El título y al menos una categoría son obligatorios.');
      return;
    }

    if (coverImage) {
      if (!IMAGE_TYPES.includes(coverImage.type)) {
        setError('La portada debe ser una imagen JPG, PNG, WEBP o GIF.');
        return;
      }
      if (coverImage.size > MAX_IMAGE_SIZE) {
        setError('La portada no puede superar 10MB.');
        return;
      }
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
        ✨ Crear Nueva Fiesta
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {error && (
          <div role="alert" style={{ 
            background: '#fee', 
            border: '1px solid #c0392b', 
            color: '#c0392b', 
            padding: 'var(--space-md)', 
            borderRadius: '6px',
            fontSize: '0.92rem'
          }}>
            {error}
          </div>
        )}

        {/* Título */}
        <div className="form-group">
          <label className="form-label" htmlFor="create-title">
            Título de la fiesta <span style={{ color: '#e74c3c' }}>*</span>
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
            Portada de la fiesta
          </label>
          <input
            ref={fileInputRef}
            id="create-cover-input"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            disabled={loading}
          />
          <button 
            id="create-cover"
            type="button"
            className="btn btn-outline" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => fileInputRef.current?.click()} 
            disabled={loading}
          >
            {coverImage ? `✓ ${coverImage.name}` : '📸 Subir imagen'}
          </button>
          <div className="form-hint">JPG, PNG, WEBP o GIF. Máximo 10MB.</div>
          {coverImage && (
            <div style={{ marginTop: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--color-text-soft)' }}>
              Tamaño: {(coverImage.size / 1024 / 1024).toFixed(2)}MB
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label className="form-label" htmlFor="create-description">
            Descripción
          </label>
          <input 
            id="create-description" 
            className="form-input" 
            placeholder="Describe tu fiesta... (opcional)"
            value={form.description} 
            onChange={e => set('description', e.target.value)} 
            disabled={loading}
          />
        </div>

        {/* Categorías */}
        <div className="form-group">
          <label className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
            Categorías <span style={{ color: '#e74c3c' }}>*</span> (puedes elegir varias)
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="create-start">Fecha de inicio</label>
            <input 
              id="create-start" 
              className="form-input" 
              type="date"
              value={form.startDate} 
              onChange={e => set('startDate', e.target.value)} 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="create-end">Fecha de fin</label>
            <input 
              id="create-end" 
              className="form-input" 
              type="date"
              value={form.endDate} 
              onChange={e => set('endDate', e.target.value)} 
              disabled={loading}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="create-city">Ciudad</label>
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
            <label className="form-label" htmlFor="create-country">País</label>
            <input 
              id="create-country" 
              className="form-input" 
              placeholder="España"
              value={form.country} 
              onChange={e => set('country', e.target.value)} 
              disabled={loading}
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label className="form-label" htmlFor="create-address">Dirección completa</label>
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
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
          <button 
            type="submit"
            className="btn btn-primary" 
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? '⏳ Publicando fiesta...' : '🎉 Publicar fiesta'}
          </button>
          <button 
            type="button"
            className="btn btn-outline" 
            onClick={() => onNavigate('manage')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
