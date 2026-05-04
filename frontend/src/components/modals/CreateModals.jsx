import { useRef, useState } from 'react';
import { useModalAccessibility } from './useModalAccessibility';
import { createFiesta, createPublication, updateFiesta } from '../../services/api';

const CATEGORY_OPTIONS = [
  { id: 'amor', label: 'Amor' },
  { id: 'noche', label: 'Noche' },
  { id: 'disfraces', label: 'Disfraces' },
  { id: 'familia', label: 'Familia' },
  { id: 'musica', label: 'Musica' },
  { id: 'gastronomia', label: 'Gastronomia' },
];

export function CreateFiestaModal({ onClose, onCreated }) {
  const modalRef = useRef(null);
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

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  useModalAccessibility({ modalRef, isOpen: true, onClose });

  const handleSubmit = async () => {
    if (!form.title.trim() || form.categories.length === 0) {
      setError('Titulo y al menos una categoria son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createFiesta({ ...form, title: form.title.trim(), description: form.description.trim(), coverImage });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || 'No se pudo crear la fiesta.');
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-fiesta-title"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">✕</button>
        <h2 id="create-fiesta-title" className="modal-title">Crear nueva fiesta</h2>

        {error && <p role="alert" style={{ color: '#c0392b', marginBottom: 12 }}>{error}</p>}

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label" htmlFor="fiesta-title">Titulo</label>
            <input id="fiesta-title" className="form-input" placeholder="Ej: Fiestas del pueblo"
              value={form.title} onChange={e => set('title', e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="fiesta-cover">Portada</label>
            <input
              ref={fileInputRef}
              id="fiesta-cover-input"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
            <button id="fiesta-cover" className="btn btn-outline w-full" onClick={() => fileInputRef.current?.click()} disabled={loading}>
              {coverImage ? `Archivo: ${coverImage.name}` : 'Subir Archivo'}
            </button>
          </div>
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="fiesta-description">Descripcion</label>
          <input id="fiesta-description" className="form-input" placeholder="Ej: Tutorial para hacer un regalo especial."
            value={form.description} onChange={e => set('description', e.target.value)} disabled={loading} />
        </div>

        <div className="form-group mb-md">
          <label className="form-label">Categorias (puedes elegir varias)</label>
          <div className="category-multi-grid" role="group" aria-label="Categorias">
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

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label" htmlFor="fiesta-start">Fecha inicio</label>
            <input id="fiesta-start" className="form-input" type="date"
              value={form.startDate} onChange={e => set('startDate', e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="fiesta-end">Fecha fin</label>
            <input id="fiesta-end" className="form-input" type="date"
              value={form.endDate} onChange={e => set('endDate', e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label" htmlFor="fiesta-city">Ciudad</label>
            <input id="fiesta-city" className="form-input" placeholder="Ciudad"
              value={form.city} onChange={e => set('city', e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="fiesta-country">Pais</label>
            <input id="fiesta-country" className="form-input" placeholder="Pais"
              value={form.country} onChange={e => set('country', e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="fiesta-address">Direccion</label>
          <input id="fiesta-address" className="form-input" placeholder="Direccion completa"
            value={form.address} onChange={e => set('address', e.target.value)} disabled={loading} />
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}
          onClick={handleSubmit}
          disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </div>
  );
}

export function EditFiestaModal({ fiesta, onClose, onUpdated }) {
  const modalRef = useRef(null);
  const [form, setForm] = useState({
    title:       fiesta.title       || '',
    description: fiesta.description || '',
    categories:  fiesta.categories?.length ? fiesta.categories : [fiesta.category].filter(Boolean),
    startDate:   fiesta.startDate ? String(fiesta.startDate).slice(0, 10) : '',
    endDate:     fiesta.endDate   ? String(fiesta.endDate).slice(0, 10)   : '',
    city:        fiesta.location?.city    || '',
    country:     fiesta.location?.country || 'España',
    address:     fiesta.location?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  useModalAccessibility({ modalRef, isOpen: true, onClose });

  const toggleCategory = (id) => {
    setForm(prev => {
      const exists = prev.categories.includes(id);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter(c => c !== id)
          : [...prev.categories, id],
      };
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || form.categories.length === 0) {
      setError('Título y al menos una categoría son obligatorios.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await updateFiesta(fiesta.id, {
        title:       form.title.trim(),
        description: form.description.trim(),
        category:    form.categories[0],
        categories:  form.categories,
        startDate:   form.startDate || null,
        endDate:     form.endDate   || null,
        location: { city: form.city, country: form.country, address: form.address },
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la fiesta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-fiesta-modal-title"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">✕</button>
        <h2 id="edit-fiesta-modal-title" className="modal-title">Editar fiesta</h2>

        {error && <p role="alert" style={{ color: '#c0392b', marginBottom: 12 }}>{error}</p>}

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-fiesta-title">Título</label>
            <input id="edit-fiesta-title" className="form-input"
              value={form.title} onChange={e => set('title', e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="edit-fiesta-desc">Descripción</label>
          <input id="edit-fiesta-desc" className="form-input"
            value={form.description} onChange={e => set('description', e.target.value)} disabled={loading} />
        </div>

        <div className="form-group mb-md">
          <label className="form-label">Categorías</label>
          <div className="category-multi-grid" role="group" aria-label="Categorias">
            {CATEGORY_OPTIONS.map(cat => (
              <button key={cat.id} type="button"
                className={`category-pill ${form.categories.includes(cat.id) ? 'is-active' : ''}`}
                onClick={() => toggleCategory(cat.id)} disabled={loading}
                aria-pressed={form.categories.includes(cat.id)}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-fiesta-start">Fecha inicio</label>
            <input id="edit-fiesta-start" className="form-input" type="date"
              value={form.startDate} onChange={e => set('startDate', e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-fiesta-end">Fecha fin</label>
            <input id="edit-fiesta-end" className="form-input" type="date"
              value={form.endDate} onChange={e => set('endDate', e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-fiesta-city">Ciudad</label>
            <input id="edit-fiesta-city" className="form-input"
              value={form.city} onChange={e => set('city', e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-fiesta-country">País</label>
            <input id="edit-fiesta-country" className="form-input"
              value={form.country} onChange={e => set('country', e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="edit-fiesta-address">Dirección</label>
          <input id="edit-fiesta-address" className="form-input"
            value={form.address} onChange={e => set('address', e.target.value)} disabled={loading} />
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

export function CreatePublicationModal({ fiestaTitle = 'San Valentín', fiestaId, onClose, onCreated }) {
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  useModalAccessibility({ modalRef, isOpen: true, onClose });

  const handleCreate = async () => {
    if (!form.title.trim() || !fiestaId) {
      setError('Titulo y fiesta son obligatorios.');
      return;
    }

    if (!file) {
      setError('Selecciona un archivo para publicar.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createPublication({
        title: form.title.trim(),
        description: form.description.trim(),
        fiestaId,
        file,
      });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || 'No se pudo crear la publicación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-publication-title"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">✕</button>
        <h2 id="create-publication-title" className="modal-title">Crear nueva publicación</h2>

        {error && <p role="alert" style={{ color: '#c0392b', marginBottom: 12 }}>{error}</p>}

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label" htmlFor="publication-title">Titulo</label>
            <input id="publication-title" className="form-input" placeholder="Ej: Regalo romantico"
              value={form.title} onChange={e => set('title', e.target.value)} disabled={loading} />
          </div>
          <div>
            <div style={{ marginTop: 24 }}>
              <span className="tag">{fiestaTitle}</span>
            </div>
          </div>
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="publication-description">Descripcion</label>
          <input id="publication-description" className="form-input" placeholder="Ej: Tutorial para hacer un regalo especial."
            value={form.description} onChange={e => set('description', e.target.value)} disabled={loading} />
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="publication-content">Contenido</label>
          <input
            ref={fileInputRef}
            id="publication-content-input"
            type="file"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button id="publication-content" className="btn btn-outline w-full" onClick={() => fileInputRef.current?.click()} disabled={loading}>
            {file ? `Archivo: ${file.name}` : 'Subir Archivo'}
          </button>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}
          onClick={handleCreate}
          disabled={loading}>
          {loading ? 'Creando...' : 'Crear publicación'}
        </button>
      </div>
    </div>
  );
}
