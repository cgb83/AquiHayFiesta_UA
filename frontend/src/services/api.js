const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api' ).replace(/\/$/, '');
const API_ORIGIN = API_URL.replace(/\/api$/, '');
const REQUEST_TIMEOUT_MS = 12000;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };
  const endpoint = `${API_URL}${path}`;
  let response;
  try {
    response = await fetch(endpoint, { ...options, headers, signal: controller.signal });
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error(`Error de conexión: ${error.message}`);
  }
  clearTimeout(timeoutId);
  let payload = null;
  try { payload = await response.json(); } catch { /* ignore */ }
  if (!response.ok) {
    const errorMessage = payload?.message || `Error ${response.status}`;
    throw new Error(errorMessage);
  }
  return payload;
}

function authHeaders() {
  const token = localStorage.getItem('ahf_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Autenticación ---
export const loginUser = (c) => request('/auth/login', { method: 'POST', body: JSON.stringify(c) });
export const registerUser = (d) => request('/auth/register', { method: 'POST', body: JSON.stringify(d) });
export const fetchMe = () => request('/auth/me', { headers: authHeaders() });
export const updateProfile = (d) => request('/auth/profile', { method: 'PUT', headers: authHeaders(), body: JSON.stringify(d) });
export const deleteMyAccount = () => request('/auth/delete', { method: 'DELETE', headers: authHeaders() });

// --- Fiestas ---
export const fetchFiestas = (p = {}) => request(`/fiestas?${new URLSearchParams(p)}`);
export const fetchFiestaBySlug = (s) => request(`/fiestas/${s}`, { headers: authHeaders() });
export const fetchMyFiestas = () => request('/fiestas/my', { headers: authHeaders() }); // AÑADIDA
export const fetchComments = (fiestaId, page = 1, limit = 5) => request(`/fiestas/${fiestaId}/comments?page=${page}&limit=${limit}`);
export const addComment = (fiestaId, data) => request(`/fiestas/${fiestaId}/comments`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) });
export const deleteComment = (fiestaId, commentId) => request(`/fiestas/${fiestaId}/comments/${commentId}`, { method: 'DELETE', headers: authHeaders() });

export async function createFiesta(data) {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description || '');
  const categories = Array.isArray(data.categories) ? data.categories.filter(Boolean) : [];
  formData.append('categories', JSON.stringify(categories));
  if (data.startDate) formData.append('startDate', data.startDate);
  if (data.endDate) formData.append('endDate', data.endDate);
  formData.append('location', JSON.stringify({ 
    address: data.address || '',
    city: data.city || '', 
    country: data.country || 'España' 
  }));
  if (data.coverImage) formData.append('coverImage', data.coverImage);
  return request('/fiestas', { method: 'POST', headers: authHeaders(), body: formData });
}

export const updateFiesta = (id, d) => request(`/fiestas/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(d) });
export const deleteFiesta = (id) => request(`/fiestas/${id}`, { method: 'DELETE', headers: authHeaders() });
export const toggleSaveFiesta = (id) => request(`/fiestas/${id}/save`, { method: 'POST', headers: authHeaders() });

// --- Publicaciones ---
export const fetchAllPublications = () => request('/publications'); // AÑADIDA
export const fetchPublicationsByFiesta = (s) => request(`/publications?fiesta=${s}`);
export const fetchMyPublications = () => request('/publications/my', { headers: authHeaders() });

export async function createPublication(data) {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description || '');
  formData.append('fiestaId', data.fiestaId);
  if (data.file) formData.append('file', data.file);
  return request('/publications', { method: 'POST', headers: authHeaders(), body: formData });
}

export const updatePublication = (id, d) => request(`/publications/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(d) }); // AÑADIDA
export const deletePublication = (id) => request(`/publications/${id}`, { method: 'DELETE', headers: authHeaders() });
export const registerDownload = (id) => request(`/publications/${id}/download`, { method: 'POST', headers: authHeaders() });

// --- Subida Genérica ---
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  // Usamos la ruta de upload dedicada
  return request('/upload', { method: 'POST', headers: authHeaders(), body: formData });
}

// --- Utilidades ---
export function resolveMediaUrl(path = '') {
  if (!path) return '';
  if (/^https?:\/\//i.test(path )) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
