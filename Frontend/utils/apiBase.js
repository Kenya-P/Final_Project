const RAW = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE = RAW.endsWith('/') ? RAW.slice(0, -1) : RAW;

export function apiUrl(path = '') {
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function apiFetch(path, init) {
  return fetch(apiUrl(path), init);
}
