const configured = import.meta.env.VITE_API_URL;
const API = configured === 'same-origin' ? '' : configured || 'http://localhost:3000';
const sessionKey = 'alanyerler_session';

export function loadSession() {
  try {
    const raw = localStorage.getItem(sessionKey);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.accessToken || !data?.user?.email) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(sessionKey);
}

async function postAuth(path, body, token) {
  const response = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data.message === 'string'
      ? data.message
      : Array.isArray(data?.message)
        ? String(data.message[0])
        : 'İstek tamamlanamadı.';
    throw new Error(message);
  }
  return data;
}

export function login(email, password) {
  return postAuth('/auth/login', { email, password });
}

export function register(name, email, password) {
  return postAuth('/auth/register', { name, email, password });
}

export function loadAccount(token) {
  return getAuth('/auth/account', token);
}

export function updateAccount(token, body) {
  return sendJson('/auth/account', 'PATCH', body, token);
}

export function loadSales(token) {
  return getAuth('/auth/account/sales', token);
}

export function loadAccountPage(key) {
  return getAuth(`/auth/account/pages/${key}`);
}

export function deleteAccount(token, password) {
  return sendJson('/auth/account', 'DELETE', { password }, token);
}

export function changePassword(token, currentPassword, newPassword) {
  return postAuth('/auth/change-password', { currentPassword, newPassword }, token);
}

export function mediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API}${path}`;
}

export function loadCategories(token) {
  return getAuth('/categories', token);
}

export function loadListings(token) {
  return getAuth('/listings', token);
}

export function loadOffers(token, listingId) {
  return getAuth(`/listings/${listingId}/offers`, token);
}

export function acceptOffer(token, listingId, offerId) {
  return sendJson(`/listings/${listingId}/offers/${offerId}/accept`, 'POST', {}, token);
}

export function loadNotifications(token) {
  return getAuth('/notifications', token);
}

export function markNotificationsRead(token, id) {
  return postAuth('/notifications/read', id ? { id } : {}, token);
}

export function loadConversations(token) {
  return getAuth('/conversations', token);
}

export function openConversation(token, listingId, storeId) {
  return postAuth('/conversations', { listingId, storeId }, token);
}

export function loadConversation(token, id) {
  return getAuth(`/conversations/${id}`, token);
}

export function sendConversationMessage(token, id, body) {
  return postAuth(`/conversations/${id}/messages`, { body }, token);
}

export function setConversationFavorite(token, id, favorite) {
  if (favorite) return postAuth(`/conversations/${id}/favorite`, {}, token);
  return sendJson(`/conversations/${id}/favorite`, 'DELETE', null, token);
}

export function updateListing(token, id, body) {
  return sendJson(`/listings/${id}`, 'PATCH', body, token);
}

export function cancelListing(token, id) {
  return sendJson(`/listings/${id}/cancel`, 'POST', {}, token);
}

export async function deleteListing(token, id) {
  const response = await fetch(`${API}/listings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 204) return;
  return readResponse(response);
}

export function submitListing(token, payload, files) {
  const form = new FormData();
  form.append('categoryId', payload.categoryId);
  form.append('deviceTypeId', payload.deviceTypeId);
  form.append('specs', JSON.stringify(payload.specs));
  form.append('condition', JSON.stringify(payload.condition));
  files.forEach((file) => form.append('photos', file));
  return sendAuth('/listings/submit', { token, form });
}

async function sendJson(path, method, body, token) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return readResponse(response);
}

async function getAuth(path, token) {
  const response = await fetch(`${API}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return readResponse(response);
}

async function sendAuth(path, { token, form }) {
  const response = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  return readResponse(response);
}

async function readResponse(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data.message === 'string'
      ? data.message
      : Array.isArray(data?.message)
        ? String(data.message[0])
        : 'İstek tamamlanamadı.';
    throw new Error(message);
  }
  return data;
}

export async function loadSite() {
  const response = await fetch(`${API}/site`);
  if (!response.ok) throw new Error('Site verisi alınamadı.');
  return response.json();
}
