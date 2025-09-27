import { getCurrentUserId } from "./auth";

const FORCE_GHPAGES =
  typeof location !== "undefined" && /github\.io$/.test(location.hostname);
const USE_MOCK =
  FORCE_GHPAGES || import.meta.env.VITE_USE_MOCK === "true";

const API_BASE = USE_MOCK ? "" : (import.meta.env.VITE_API_BASE || "").trim();
const API_PREFIX = (import.meta.env.VITE_API_PREFIX || '/api/pf').trim();

function join(...parts) {
  return parts
  .filter(Boolean)
  .map((p,i)=> i===0 ? String(p)
  .replace(/\/+$/, '') : String(p)
  .replace(/^\/+/, ''))
  .join('/');
}

function buildUrl(path, params = {}) {
  const root = API_BASE ? join(API_BASE, API_PREFIX) : API_PREFIX;
  const url  = new URL(join(root, path), window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && String(v).trim() !== '') url.searchParams.set(k, v);
  });
  return url.toString();
}

async function getJson(path, params = {}) {
  const url = buildUrl(path, params);
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text}`);
  }
  return res.json();
}

export function getAnimalTypes() { return getJson('types'); }
export function getPets(params={}) { return getJson('animals', params); }

const LS_LIKES_PREFIX = 'pf_likes_';
const likesKey  = (uid) => `${LS_LIKES_PREFIX}${uid}`;
const readJSON  = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v ?? null));
const getUserLikes  = (uid) => readJSON(likesKey(uid), []);
const saveUserLikes = (uid, a) => writeJSON(likesKey(uid), a);

export async function getUserPets() {
  const uid = getCurrentUserId();
  if (!uid) { const e = new Error('Unauthorized'); e.status = 401; throw e; }
  const liked = new Set(getUserLikes(uid).map(String));
  const { animals } = await getPets({ page: 1, limit: 100 });
  return (animals ?? []).filter(a => liked.has(String(a.id)));
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