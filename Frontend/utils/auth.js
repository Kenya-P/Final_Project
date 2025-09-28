const LS_USERS = 'pf_users';
const LS_SESSIONS = 'pf_sessions'; // token -> { userId, createdAt }
const LS_TOKEN = 'petfinder_token';
const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

// storage helpers
const readJSON = (k, fb) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
};

const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v ?? null));

function getUsers() {
  return readJSON(LS_USERS, []);
}
function saveUsers(u) {
  writeJSON(LS_USERS, u);
}
function getSessions() {
  return readJSON(LS_SESSIONS, {});
}
function saveSessions(s) {
  writeJSON(LS_SESSIONS, s);
}

export function currentToken() {
  return localStorage.getItem(LS_TOKEN);
}
function setToken(t) {
  localStorage.setItem(LS_TOKEN, t);
}
function clearToken() {
  localStorage.removeItem(LS_TOKEN);
}

function makeToken() {
  return `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`;
}

export async function registerUser({ name, email, password }) {
  await delay();
  const users = getUsers();
  const exists = users.find(
    (u) => String(u.email).toLowerCase() === String(email).toLowerCase()
  );
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

  return { user: { id, name: user.name, email: user.email } };
}

export async function logIn({ email, password }) {
  await delay();
  const users = getUsers();
  const user = users.find(
    (u) =>
      String(u.email).toLowerCase() === String(email).toLowerCase() &&
      u.password === password
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

  return { user: { id: user.id, name: user.name, email: user.email } };
}

export async function logOut() {
  await delay();
  const t = currentToken();
  if (t) {
    const sessions = getSessions();
    delete sessions[t];
    saveSessions(sessions);
    clearToken();
  }
  return { ok: true };
}

export function getCurrentUserId() {
  const t = currentToken();
  const s = getSessions();
  return t && s[t] ? s[t].userId : null;
}
