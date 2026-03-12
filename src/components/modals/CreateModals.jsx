import { useState } from 'react';

export function CreateFiestaModal({ onClose }) {
  const [form, setForm] = useState({ title: '', description: '', dates: '', location: '' });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Crear nueva fiesta</h2>

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label">Título</label>
            <input className="form-input" placeholder="Ej: Fiestas del pueblo"
              value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Portada</label>
            <button className="btn btn-outline w-full">Subir Archivo</button>
          </div>
        </div>

        <div className="form-group mb-md">
          <label className="form-label">Descripción</label>
          <input className="form-input" placeholder="Ej: Tutorial para hacer un regalo especial."
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="form-group mb-md">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📅</span>
            <input className="form-input" placeholder="DD/MM/YYYY - DD/MM/YYYY"
              value={form.dates} onChange={e => set('dates', e.target.value)} />
          </div>
        </div>

        <div className="form-group mb-md">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📍</span>
            <input className="form-input" placeholder="Dirección, código postal..."
              value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}
          onClick={onClose}>
          Publicar
        </button>
      </div>
    </div>
  );
}

export function CreatePublicationModal({ fiestaTitle = 'San Valentín', onClose }) {
  const [form, setForm] = useState({ title: '', description: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Crear nueva publicación</h2>

        <div className="form-row mb-md">
          <div className="form-group">
            <label className="form-label">Título</label>
            <input className="form-input" placeholder="Ej: Regalo romántico"
              value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div>
            <div style={{ marginTop: 24 }}>
              <span className="tag">{fiestaTitle}</span>
            </div>
          </div>
        </div>

        <div className="form-group mb-md">
          <label className="form-label">Descripción</label>
          <input className="form-input" placeholder="Ej: Tutorial para hacer un regalo especial."
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="form-group mb-md">
          <label className="form-label">Contenido</label>
          <button className="btn btn-outline w-full">Subir Archivo</button>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }}
          onClick={onClose}>
          Crear publicación
        </button>
      </div>
    </div>
  );
}
