const configured = import.meta.env.VITE_API_URL;
const API = configured === 'same-origin' ? '' : configured || 'http://localhost:3000';

export async function loadSite() {
  const response = await fetch(`${API}/site`);
  if (!response.ok) throw new Error('Site verisi alınamadı.');
  return response.json();
}
