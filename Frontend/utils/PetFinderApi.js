import { getCurrentUserId } from './auth';
import localDataset from '../src/mocks/animal.json';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const MOCK_DATA_URL = import.meta?.env?.VITE_MOCK_DATA_URL || '/mocks/animals.json';
const delay = (ms = 250) => new Promise(res => setTimeout(res, ms));

export function _handleResponse(res) {
  if (res.ok) return res.json();
  return res.text().then((text) => Promise.reject(`Error ${res.status}: ${text}`));
}

let cachedDataset = null;
async function loadDataset() {
  if (cachedDataset) return cachedDataset;
  try {
    const res = await fetch(MOCK_DATA_URL, { cache: 'no-store' });
    if (res.ok) { cachedDataset = await res.json(); return cachedDataset; }
  } catch { /* fall back */ }
  cachedDataset = localDataset;
  return cachedDataset;
}

// per-user likes/hide
const LS_LIKES_PREFIX  = 'pf_likes_';
const LS_HIDDEN_PREFIX = 'pf_hidden_';
const readJSON  = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v ?? null));
const likesKey  = (uid) => `${LS_LIKES_PREFIX}${uid}`;
const hideKey   = (uid) => `${LS_HIDDEN_PREFIX}${uid}`;
const getUserLikes  = (uid) => readJSON(likesKey(uid), []);
const saveUserLikes = (uid, a) => writeJSON(likesKey(uid), a);
const getUserHidden = (uid) => readJSON(hideKey(uid), []);
const saveUserHidden= (uid, a) => writeJSON(hideKey(uid), a);

// ---- pets ----
export async function getPets(params = {}) {
  const url = new URL(`${BASE}/api/pf/animals`);
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch animals');
  const data = await res.json();
  return (data.animals || []).map(a => ({
    id: a.id,
    name: a.name,
    imageUrl: a.photos?.[0]?.medium || a.primary_photo_cropped?.medium || '',
    url: a.url,
  }));
}

  // type sanity
  const knownTypes = new Set((data.types || []).map(t => String(t.name).toLowerCase()));
  const normalizedType = type ? String(type).toLowerCase() : null;
  if (normalizedType) {
    if (knownTypes.has(normalizedType)) {
      animals = animals.filter(a => String(a.type).toLowerCase() === normalizedType);
    } else {
      return { animals: [], pagination: { count_per_page: limit, total_count: 0, current_page: page, total_pages: 0 } };
    }
  }

  const lcEq = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();
  if (gender) animals = animals.filter(a => lcEq(a.gender, gender));
  if (size)   animals = animals.filter(a => lcEq(a.size, size));
  if (age)    animals = animals.filter(a => lcEq(a.age, age));
  if (status) animals = animals.filter(a => lcEq(a.status, status));
  if (city)   animals = animals.filter(a => lcEq(a.contact?.address?.city, city));
  if (state)  animals = animals.filter(a => lcEq(a.contact?.address?.state, state));

  if (q && String(q).trim()) {
    const needle = String(q).toLowerCase().trim();
    animals = animals.filter(a =>
      [a.name, a.type, a.species, a.breeds?.primary, a.description]
        .some(v => v && String(v).toLowerCase().includes(needle))
    );
  }

  if (sort === 'recent') {
    animals.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  } else if (sort === 'distance') {
    animals.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }

  const total_count = animals.length;
  const count_per_page = limit;
  const total_pages = Math.max(1, Math.ceil(total_count / count_per_page));
  const current_page = Math.min(Math.max(1, page), total_pages);
  const start = (current_page - 1) * count_per_page;
  const pageItems = animals.slice(start, start + count_per_page);

  return { animals: pageItems, pagination: { count_per_page, total_count, current_page, total_pages } };
}

export const getPetsShowMore = (page, filters = {}) =>
  getPets({ ...filters, page, limit: 3, sort: filters.sort || 'recent' });

export async function getPetById(id) {
  await delay();
  const data = await loadDataset();
  const uid = getCurrentUserId();
  const hidden = uid ? new Set(getUserHidden(uid).map(String)) : new Set();
  const animal = (data.animals || []).find(a => String(a.id) === String(id) && !hidden.has(String(a.id)));
  if (!animal) { const err = new Error('Not Found'); err.status = 404; throw err; }
  return { animal };
}

export async function getUserPets() {
  await delay();
  const data = await loadDataset();
  const uid = getCurrentUserId();
  if (!uid) return { animals: [] };
  const likes = new Set(getUserLikes(uid).map(String));
  const animals = (data.animals || []).filter(a => likes.has(String(a.id)));
  return { animals };
}

// ---- types ----
export async function getAnimalTypes() {
  await delay();
  const data = await loadDataset();
  return { types: data.types || [] };
}

export async function getAnimalTypeByName(name) {
  await delay();
  const data = await loadDataset();
  const type = (data.types || []).find(t => String(t.name).toLowerCase() === String(name).toLowerCase());
  if (!type) { const err = new Error('Type not found'); err.status = 404; throw err; }
  return { type };
}

// ---- likes / hide ----
export async function likePet(petId) {
  await delay();
  const uid = getCurrentUserId();
  if (!uid) { const e = new Error('Unauthorized'); e.status = 401; throw e; }
  const likes = new Set(getUserLikes(uid).map(String));
  likes.add(String(petId)); saveUserLikes(uid, Array.from(likes));
  return { ok: true, petId };
}

export async function unlikePet(petId) {
  await delay();
  const uid = getCurrentUserId();
  if (!uid) { const e = new Error('Unauthorized'); e.status = 401; throw e; }
  const likes = new Set(getUserLikes(uid).map(String));
  likes.delete(String(petId)); saveUserLikes(uid, Array.from(likes));
  return { ok: true, petId };
}

export async function removePet(petId) {
  await delay();
  const uid = getCurrentUserId();
  if (!uid) { const e = new Error('Unauthorized'); e.status = 401; throw e; }
  const likes = new Set(getUserLikes(uid).map(String));
  likes.delete(String(petId)); saveUserLikes(uid, Array.from(likes));
  const hidden = new Set(getUserHidden(uid).map(String));
  hidden.add(String(petId)); saveUserHidden(uid, Array.from(hidden));
  return { ok: true, petId };
}

export {
  registerUser, logIn, logOut, authorize, checkToken, getAuthHeaders
} from './auth';
