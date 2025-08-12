import dataset from '../src/mocks/animal.json';

// ---------------------------
// Helpers / "DB" primitives
// ---------------------------
const LS_USERS = 'pf_users';
const LS_SESSIONS = 'pf_sessions';      // token -> { userId, createdAt }
const LS_TOKEN = 'petfinder_token';      // active token key (compat with your old code)
const LS_LIKES_PREFIX = 'pf_likes_';     // per-user likes: pf_likes_<userId> -> [ids]
const LS_HIDDEN_PREFIX = 'pf_hidden_';   // optional: "removed" pets for user

const delay = (ms = 250) => new Promise(res => setTimeout(res, ms));

// localStorage JSON helpers
const readJSON = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
};
const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value ?? null));

// Users table
function getUsers() { return readJSON(LS_USERS, []); }
function saveUsers(users) { writeJSON(LS_USERS, users); }

// Sessions
function getSessions() { return readJSON(LS_SESSIONS, {}); }
function saveSessions(sessions) { writeJSON(LS_SESSIONS, sessions); }

function currentToken() { return localStorage.getItem(LS_TOKEN); }
function setToken(token) { localStorage.setItem(LS_TOKEN, token); }
function clearToken() { localStorage.removeItem(LS_TOKEN); }

function getCurrentUserId() {
  const token = currentToken();
  if (!token) return null;
  const sessions = getSessions();
  return sessions[token]?.userId ?? null;
}

function getLikesKey(userId) { return `${LS_LIKES_PREFIX}${userId}`; }
function getHiddenKey(userId) { return `${LS_HIDDEN_PREFIX}${userId}`; }

function getUserLikes(userId) { return readJSON(getLikesKey(userId), []); }
function saveUserLikes(userId, likes) { writeJSON(getLikesKey(userId), likes); }

function getUserHidden(userId) { return readJSON(getHiddenKey(userId), []); }
function saveUserHidden(userId, ids) { writeJSON(getHiddenKey(userId), ids); }

// Simple token generator (mock only)
function makeToken() {
  return `mock.${Math.random().toString(36).slice(2)}.${Date.now().toString(36)}`;
}

// ---------------------------
// API: Response helpers (compat with your existing code)
// ---------------------------
export function _handleResponse(x) { return x; } // no-op in mock
function request(fn) {
  return Promise.resolve()
    .then(fn)
    .catch((err) => {
      console.error('Mock API error:', err);
      throw err;
    });
}
function getAuthHeaders() {
  const token = currentToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------------------------
// Pets (mocked from animals.json)
// ---------------------------
/**
 * getPets({ page=1, limit=20, type, gender, size, age, status, city, state, q, sort })
 * Returns: { animals: [...], pagination: {...} }
 */
export function getPets(params = {}) {
  return request(async () => {
    await delay();

    const {
      page = 1, limit = 20,
      type, gender, size, age, status,
      city, state, q, sort
    } = params;

    let animals = [...(dataset.animals || [])];

    const knownTypes = new Set((dataset.types || []).map(
  t => String(t.name).toLowerCase()
));
const normalizedType = type ? String(type).toLowerCase() : null;

if (normalizedType) {
  if (knownTypes.has(normalizedType)) {
    animals = animals.filter(a => String(a.type).toLowerCase() === normalizedType);
  } else {
    // Unknown type → return empty set early
    return {
      animals: [],
      pagination: {
        count_per_page: limit,
        total_count: 0,
        current_page: page,
        total_pages: 0
      }
    };
  }
}

    // Optional: hide user-removed pets from the list
    const uid = getCurrentUserId();
    if (uid) {
      const hidden = new Set(getUserHidden(uid));
      animals = animals.filter(a => !hidden.has(String(a.id)));
    }

    // Filters
    const lcEq = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();
    if (type) animals = animals.filter(a => lcEq(a.type, type));
    if (gender) animals = animals.filter(a => lcEq(a.gender, gender));
    if (size) animals = animals.filter(a => lcEq(a.size, size));
    if (age) animals = animals.filter(a => lcEq(a.age, age));
    if (status) animals = animals.filter(a => lcEq(a.status, status));
    if (city) animals = animals.filter(a => lcEq(a.contact?.address?.city, city));
    if (state) animals = animals.filter(a => lcEq(a.contact?.address?.state, state));

    if (q && String(q).trim()) {
      const needle = String(q).toLowerCase().trim();
      animals = animals.filter(a =>
        [a.name, a.type, a.species, a.breeds?.primary, a.description]
          .some(v => v && String(v).toLowerCase().includes(needle))
      );
    }

    // Sort
    if (sort === 'recent') {
      animals.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    } else if (sort === 'distance') {
      animals.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    // Pagination
    const total_count = animals.length;
    const total_pages = Math.max(1, Math.ceil(total_count / limit));
    const current_page = Math.min(Math.max(1, page), total_pages);
    const start = (current_page - 1) * limit;
    const pageItems = animals.slice(start, start + limit);

    return {
      animals: pageItems,
      pagination: {
        count_per_page: limit,
        total_count,
        current_page,
        total_pages
      }
    };
  });
}

/** getPetById(id) -> { animal } */
export function getPetById(id) {
  return request(async () => {
    await delay();
    const animal = (dataset.animals || []).find(a => String(a.id) === String(id));
    if (!animal) {
      const err = new Error('Not Found');
      err.status = 404;
      throw err;
    }
    // Respect hidden per-user
    const uid = getCurrentUserId();
    if (uid) {
      const hidden = new Set(getUserHidden(uid));
      if (hidden.has(String(id))) {
        const err = new Error('Not Found');
        err.status = 404;
        throw err;
      }
    }
    return { animal };
  });
}

/**
 * getUserPets() -> returns the user's liked pets (as full animal objects)
 * Shape: { animals: [...] }
 */
export function getUserPets() {
  return request(async () => {
    await delay();
    const uid = getCurrentUserId();
    if (!uid) return { animals: [] };

    const likes = new Set(getUserLikes(uid).map(String));
    const animals = (dataset.animals || []).filter(a => likes.has(String(a.id)));
    return { animals };
  });
}

// ---------------------------
// Auth (Registration/Login/Logout)
// ---------------------------
/**
 * registerUser({ name, email, password })
 * Returns: { user: { id, name, email }, token }
 */
export function registerUser({ name, email, password }) {
  return request(async () => {
    await delay();

    const users = getUsers();
    const exists = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
    if (exists) {
      const err = new Error('Email already registered');
      err.status = 409;
      throw err;
    }

    const id = String(Date.now());
    const user = { id, name: name ?? 'User', email, password };
    users.push(user);
    saveUsers(users);

    const token = makeToken();
    const sessions = getSessions();
    sessions[token] = { userId: id, createdAt: Date.now() };
    saveSessions(sessions);
    setToken(token);

    return { user: { id, name: user.name, email: user.email }, token };
  });
}

/**
 * logIn({ email, password })
 * On success: stores token in localStorage (petfinder_token) for compatibility
 */
export function logIn({ email, password }) {
  return request(async () => {
    await delay();

    const users = getUsers();
    const user = users.find(
      u => String(u.email).toLowerCase() === String(email).toLowerCase() && u.password === password
    );
    if (!user) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const token = makeToken();
    const sessions = getSessions();
    sessions[token] = { userId: user.id, createdAt: Date.now() };
    saveSessions(sessions);
    setToken(token);

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  });
}

export function logOut() {
  return request(async () => {
    await delay();
    const token = currentToken();
    if (token) {
      const sessions = getSessions();
      delete sessions[token];
      saveSessions(sessions);
      clearToken();
    }
    return { ok: true };
  });
}

// ---------------------------
// Likes / Remove Pets
// ---------------------------
/** likePet(petId) -> adds to user's likes */
export function likePet(petId) {
  return request(async () => {
    await delay();
    const uid = getCurrentUserId();
    if (!uid) {
      const err = new Error('Unauthorized');
      err.status = 401;
      throw err;
    }
    const likes = new Set(getUserLikes(uid).map(String));
    likes.add(String(petId));
    saveUserLikes(uid, Array.from(likes));
    return { ok: true, petId };
  });
}

/** unlikePet(petId) -> removes from user's likes */
export function unlikePet(petId) {
  return request(async () => {
    await delay();
    const uid = getCurrentUserId();
    if (!uid) {
      const err = new Error('Unauthorized');
      err.status = 401;
      throw err;
    }
    const likes = new Set(getUserLikes(uid).map(String));
    likes.delete(String(petId));
    saveUserLikes(uid, Array.from(likes));
    return { ok: true, petId };
  });
}

/**
 * removePet(petId)
 * In a real app this might delete a user-owned listing.
 * For the mock, we interpret "remove" as *hide from this user* and also un-like it.
 */
export function removePet(petId) {
  return request(async () => {
    await delay();
    const uid = getCurrentUserId();
    if (!uid) {
      const err = new Error('Unauthorized');
      err.status = 401;
      throw err;
    }
    // Un-like
    const likes = new Set(getUserLikes(uid).map(String));
    likes.delete(String(petId));
    saveUserLikes(uid, Array.from(likes));
    // Hide
    const hidden = new Set(getUserHidden(uid).map(String));
    hidden.add(String(petId));
    saveUserHidden(uid, Array.from(hidden));
    return { ok: true, petId };
  });
}

// ---------- Types ----------
/** getAnimalTypes() -> { types: [...] }  // mirrors GET /v2/types */
export function getAnimalTypes() {
  return request(async () => {
    await delay();
    const types = dataset.types || [];
    return { types };
  });
}

/** getAnimalTypeByName(name) -> { type } // convenience helper (not in PF spec) */
export function getAnimalTypeByName(name) {
  return request(async () => {
    await delay();
    const type = (dataset.types || []).find(
      t => String(t.name).toLowerCase() === String(name).toLowerCase()
    );
    if (!type) {
      const err = new Error('Type not found');
      err.status = 404;
      throw err;
    }
    return { type };
  });
}


// ---------------------------
// Backward-compat values
// -------------
// NOTE: If you later revive real calls in Vite, use VITE_* prefix for envs.
export const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:3001';
export { getAuthHeaders }; // if any old code spreads headers