import { getCurrentUserId } from './auth';

const API_BASE = '/api/pf';

async function parseProblem(res) {
  let text = await res.text().catch(() => '');
  try { return JSON.parse(text); } catch { return { status: res.status, title: res.statusText, detail: text }; }
}

async function assertOk(res) {
  if (!res.ok) {
    const prob = await parseProblem(res);
    const err = new Error(prob.detail || prob.title || `HTTP ${res.status}`);
    err.problem = prob;
    throw err;
  }
  return res.json();
}

// ---- Petfinder passthroughs ----
export async function getAnimalTypes() {
  const url = new URL(`${API_BASE}/types`, window.location.origin);
  const res = await fetch(url.toString().replace(window.location.origin, ''));
  assertOk(res);
  return { types: data.types || [] };
}

export async function getPets(params = {}) {
  const url = new URL(`${API_BASE}/animals`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && String(v).trim() !== '') url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString().replace(window.location.origin, ''));

  const animals = (data.animals || []).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    imageUrl:
      a.photos?.[0]?.medium ||
      a.primary_photo_cropped?.medium ||
      '',
    age: a.age,
    gender: a.gender,
    size: a.size,
    breeds: a.breeds?.primary || '',
    url: a.url,
    contact: a.contact,
    published_at: a.published_at
  }));

  assertOk(res);

  return {
    animals,
    pagination: data.pagination || { current_page: 1, total_pages: 1, count_per_page: animals.length, total_count: animals.length }
  };
}

// ---- Likes (localStorage, per user) ----
const LS_LIKES_PREFIX = 'pf_likes_';
const likesKey = (uid) => `${LS_LIKES_PREFIX}${uid}`;
const readJSON = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v ?? null));
const getUserLikes = (uid) => readJSON(likesKey(uid), []);
const saveUserLikes = (uid, a) => writeJSON(likesKey(uid), a);

export async function getUserPets() {
  const uid = getCurrentUserId();
  if (!uid) { const e = new Error('Unauthorized'); e.status = 401; throw e; }
  const liked = new Set(getUserLikes(uid).map(String));
  // we’ll fetch the first page and filter by liked ids
  const { animals } = await getPets({ page: 1, limit: 100 });
  return (animals || []).filter((a) => liked.has(String(a.id)));
}

export async function likePet(petId) {
  const uid = getCurrentUserId();
  if (!uid) { const e = new Error('Unauthorized'); e.status = 401; throw e; }
  const likes = new Set(getUserLikes(uid).map(String));
  likes.add(String(petId));
  saveUserLikes(uid, Array.from(likes));
  return { ok: true, petId };
}

export async function unlikePet(petId) {
  const uid = getCurrentUserId();
  if (!uid) { const e = new Error('Unauthorized'); e.status = 401; throw e; }
  const likes = new Set(getUserLikes(uid).map(String));
  likes.delete(String(petId));
  saveUserLikes(uid, Array.from(likes));
  return { ok: true, petId };
}
