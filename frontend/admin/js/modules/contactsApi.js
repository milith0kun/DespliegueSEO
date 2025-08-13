// Funciones de API para contactos usando API_CONFIG global
if (!window.API_CONFIG) {
    console.error('❌ API_CONFIG no está disponible en contactsApi');
    throw new Error('API_CONFIG no está disponible');
}

const API = window.API_CONFIG;
console.log('✅ contactsApi inicializado con API_CONFIG:', API);
const BASE = () => `${API.BASE_URL}${API.ENDPOINTS.CONTACTOS}`;

export async function getContacts(params = {}) {
  const url = new URL(BASE());
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Error al obtener contactos');
  return res.json();
}

export async function updateContact(id, payload) {
  const res = await fetch(`${BASE()}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error al actualizar contacto');
  return res.json();
}

export async function deleteContact(id) {
  const res = await fetch(`${BASE()}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Error al eliminar contacto');
  return res.json();
}