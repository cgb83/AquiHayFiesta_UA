const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
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
    response = await fetch(endpoint, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(`Tiempo de espera agotado al conectar con ${endpoint}.`);
    }

    throw new Error(
      `No se pudo conectar con la API en ${endpoint}. Revisa que el backend este iniciado y CORS permitido. Detalle tecnico: ${error.message}`
    );
  }

  clearTimeout(timeoutId);

  let payload = null;
  let rawText = '';
  try {
    payload = await response.json();
  } catch {
    try {
      rawText = await response.text();
    } catch {
      rawText = '';
    }
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      rawText ||
      `Error ${response.status} en ${endpoint}`;
    throw new Error(message);
  }

  return payload;
}

function authHeaders() {
  const token = localStorage.getItem('ahf_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginUser(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(data) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createFiesta(data) {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description || '');
  const categories = Array.isArray(data.categories) ? data.categories.filter(Boolean) : [];
  const primaryCategory = categories[0] || data.category;
  if (primaryCategory) formData.append('category', primaryCategory);
  formData.append('categories', JSON.stringify(categories.length > 0 ? categories : [primaryCategory].filter(Boolean)));
  formData.append('subcategories', JSON.stringify(data.subcategories || []));
  if (data.startDate) formData.append('startDate', data.startDate);
  if (data.endDate) formData.append('endDate', data.endDate);
  formData.append(
    'location',
    JSON.stringify({
      address: data.address || '',
      city: data.city || '',
      country: data.country || 'España',
    })
  );
  if (data.coverImage) formData.append('coverImage', data.coverImage);

  return request('/fiestas', {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
}

export async function createPublication(data) {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description || '');
  formData.append('fiestaId', data.fiestaId);
  if (data.file) formData.append('file', data.file);

  return request('/publications', {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
}

export async function fetchMe() {
  return request('/auth/me', {
    headers: authHeaders(),
  });
}

export async function updateProfile(data) {
  return request('/auth/profile', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteMyAccount() {
  return request('/auth/delete', {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function toggleSaveFiesta(id) {
  return request(`/fiestas/${id}/save`, {
    method: 'POST',
    headers: authHeaders(),
  });
}

export async function fetchMyFiestas() {
  return request('/fiestas/my', {
    headers: authHeaders(),
  });
}

export async function updateFiesta(id, data) {
  return request(`/fiestas/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteFiesta(id) {
  return request(`/fiestas/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function fetchFiestas(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return request(`/fiestas${suffix}`);
}

export async function fetchFiestaBySlug(slug) {
  return request(`/fiestas/${slug}`, {
    headers: authHeaders(),
  });
}

export async function fetchPublicationsByFiesta(slug) {
  const query = new URLSearchParams({ fiesta: slug });
  return request(`/publications?${query.toString()}`);
}

export async function fetchMyPublications() {
  return request('/publications/my', {
    headers: authHeaders(),
  });
}

export async function updatePublication(id, data) {
  return request(`/publications/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deletePublication(id) {
  return request(`/publications/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function registerDownload(id) {
  return request(`/publications/${id}/download`, {
    method: 'POST',
    headers: authHeaders(),
  });
}

export function resolveMediaUrl(path = '') {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
