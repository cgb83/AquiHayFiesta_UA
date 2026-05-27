import { useRef, useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModalAccessibility } from './useModalAccessibility';
import { createFiesta, createPublication, updateFiesta } from '../../services/api';
import { CATEGORIES as CATEGORY_OPTIONS } from '../../data/mockData';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const FILE_TYPES = [
  ...IMAGE_TYPES,
  'video/mp4', 'video/webm', 'video/quicktime',
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function CreateFiestaModal({ onClose, onCreated }) {
  const { t } = useApp();
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
        <h2 id="create-fiesta-title" className="modal-title">{t('modal_crear_fiesta')}</h2>

        {error && <p role="alert" style={{ color: '#c0392b', marginBottom: 12 }}>{error}</p>}

        <div className="create-fiesta-scrollable">
          <div className="form-row mb-md">
            <div className="form-group">
              <label className="form-label" htmlFor="fiesta-title">{t('modal_titulo')}</label>
              <input id="fiesta-title" className="form-input" placeholder="Ej: Fiestas del pueblo"
                value={form.title} onChange={e => set('title', e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fiesta-cover">{t('modal_portada')}</label>
              <input
                ref={fileInputRef}
                id="fiesta-cover-input"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              />
              <button id="fiesta-cover" className="btn btn-outline w-full" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                {coverImage ? `${t('modal_archivo')}${coverImage.name}` : t('modal_subir_archivo')}
              </button>
              <div className="form-hint">{t('modal_hint_imagen')}</div>
            </div>
          </div>

          <div className="form-group mb-md">
            <label className="form-label" htmlFor="fiesta-description">{t('modal_descripcion')}</label>
            <input id="fiesta-description" className="form-input" placeholder="Ej: Tutorial para hacer un regalo especial."
              value={form.description} onChange={e => set('description', e.target.value)} disabled={loading} />
          </div>

          <div className="form-group mb-md">
            <label className="form-label">{t('modal_categorias')}</label>
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
              <label className="form-label" htmlFor="fiesta-start">{t('modal_fecha_inicio')}</label>
              <input id="fiesta-start" className="form-input" type="date"
                value={form.startDate} onChange={e => set('startDate', e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fiesta-end">{t('modal_fecha_fin')}</label>
              <input id="fiesta-end" className="form-input" type="date"
                value={form.endDate} onChange={e => set('endDate', e.target.value)} disabled={loading} />
            </div>
          </div>

          <div className="form-row mb-md">
            <div className="form-group">
              <label className="form-label" htmlFor="fiesta-city">{t('modal_ciudad')}</label>
              <input id="fiesta-city" className="form-input" placeholder={t('modal_ciudad')}
                value={form.city} onChange={e => set('city', e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fiesta-country">{t('modal_pais')}</label>
              <input id="fiesta-country" className="form-input" placeholder={t('modal_pais')}
                value={form.country} onChange={e => set('country', e.target.value)} disabled={loading} />
            </div>
          </div>

          <div className="form-group mb-md">
            <label className="form-label" htmlFor="fiesta-address">{t('modal_direccion')}</label>
            <input id="fiesta-address" className="form-input" placeholder={t('modal_direccion')}
              value={form.address} onChange={e => set('address', e.target.value)} disabled={loading} />
          </div>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}
          onClick={handleSubmit}
          disabled={loading}>
          <Upload size={16} /> {loading ? t('modal_publicando') : t('modal_publicar')}
        </button>
      </div>
    </div>
  );
}

export function EditFiestaModal({ fiesta, onClose, onUpdated }) {
  const { t } = useApp();
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
        <h2 id="edit-fiesta-modal-title" className="modal-title">{t('modal_editar_fiesta')}</h2>

        {error && <p role="alert" style={{ color: '#c0392b', marginBottom: 12 }}>{error}</p>}

        <div className="modal-scrollable">
          <div className="form-row mb-md">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-fiesta-title">{t('modal_titulo')}</label>
              <input id="edit-fiesta-title" className="form-input"
                value={form.title} onChange={e => set('title', e.target.value)} disabled={loading} />
            </div>
          </div>

          <div className="form-group mb-md">
            <label className="form-label" htmlFor="edit-fiesta-desc">{t('modal_descripcion')}</label>
            <input id="edit-fiesta-desc" className="form-input"
              value={form.description} onChange={e => set('description', e.target.value)} disabled={loading} />
          </div>

          <div className="form-group mb-md">
            <label className="form-label">{t('modal_categorias')}</label>
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
              <label className="form-label" htmlFor="edit-fiesta-start">{t('modal_fecha_inicio')}</label>
              <input id="edit-fiesta-start" className="form-input" type="date"
                value={form.startDate} onChange={e => set('startDate', e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-fiesta-end">{t('modal_fecha_fin')}</label>
              <input id="edit-fiesta-end" className="form-input" type="date"
                value={form.endDate} onChange={e => set('endDate', e.target.value)} disabled={loading} />
            </div>
          </div>

          <div className="form-row mb-md">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-fiesta-city">{t('modal_ciudad')}</label>
              <input id="edit-fiesta-city" className="form-input"
                value={form.city} onChange={e => set('city', e.target.value)} disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-fiesta-country">{t('modal_pais')}</label>
              <input id="edit-fiesta-country" className="form-input"
                value={form.country} onChange={e => set('country', e.target.value)} disabled={loading} />
            </div>
          </div>

          <div className="form-group mb-md">
            <label className="form-label" htmlFor="edit-fiesta-address">{t('modal_direccion')}</label>
            <input id="edit-fiesta-address" className="form-input"
              value={form.address} onChange={e => set('address', e.target.value)} disabled={loading} />
          </div>
        </div>

        {/* Botón fuera del contenedor scrolleable */}
        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}
          onClick={handleSubmit} disabled={loading}>
          <Save size={16} /> {loading ? t('modal_guardando') : t('modal_guardar')}
        </button>
      </div>
    </div>
  );
}

export function CreatePublicationModal({ fiestaTitle = 'San Valentín', fiestaId, onClose, onCreated }) {
  const { t } = useApp();
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

    if (!FILE_TYPES.includes(file.type)) {
      setError('Tipo de archivo no permitido.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo no puede superar 50MB.');
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
        <h2 id="create-publication-title" className="modal-title">{t('modal_crear_pub')}</h2>

        {error && <p role="alert" style={{ color: '#c0392b', marginBottom: 12 }}>{error}</p>}

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label" htmlFor="publication-title">{t('modal_titulo')}</label>
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
          <label className="form-label" htmlFor="publication-description">{t('modal_descripcion')}</label>
          <input id="publication-description" className="form-input" placeholder="Ej: Tutorial para hacer un regalo especial."
            value={form.description} onChange={e => set('description', e.target.value)} disabled={loading} />
        </div>

        <div className="form-group mb-md">
          <label className="form-label" htmlFor="publication-content">{t('modal_contenido')}</label>
          <input
            ref={fileInputRef}
            id="publication-content-input"
            type="file"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button id="publication-content" className="btn btn-outline w-full" onClick={() => fileInputRef.current?.click()} disabled={loading}>
            {file ? `${t('modal_archivo')}${file.name}` : t('modal_subir_archivo')}
          </button>
          <div className="form-hint">{t('modal_hint_archivo')}</div>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}
          onClick={handleCreate}
          disabled={loading}>
          <Upload size={16} /> {loading ? t('modal_creando') : t('modal_crear_pub_btn')}
        </button>
      </div>
    </div>
  );
}
