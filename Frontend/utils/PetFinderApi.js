import { getCurrentUserId } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE || "";

// ---- helpers ----
async function parseProblem(res) {
  let text = await res.text().catch(() => "");
  try {
    return JSON.parse(text);
  } catch {
    return { status: res.status, title: res.statusText, detail: text };
  }
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

function originless(url) {
  return url.toString().replace(window.location.origin, "");
}

async function getJson(path, params = {}) {
  const url = new URL(`${API_BASE}/api/pf${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && String(v).trim() !== "") url.searchParams.set(k, v);
  });
  const res = await fetch(originless(url), { cache: "no-store" });
  return await assertOk(res);
}

// ---- Petfinder passthroughs ----
export async function getAnimalTypes() {
  const data = await getJson("/types");
  return { types: data.types ?? [] };
}

export async function getPets(params = {}) {
  const data = await getJson("/animals", params);

  const animals = (data.animals ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    imageUrl:
      a?.photos?.[0]?.medium ||
      a?.primary_photo_cropped?.medium ||
      "",
    age: a.age,
    gender: a.gender,
    size: a.size,
    breeds: a?.breeds?.primary || "",
    url: a.url,
    contact: a.contact,
    published_at: a.published_at,
    // keep the raw photos too so components that expect it still work
    photos: a?.photos ?? [],
  }));

  return {
    animals,
    pagination:
      data.pagination ?? {
        current_page: 1,
        total_pages: 1,
        count_per_page: animals.length,
        total_count: animals.length,
      },
  };
}

// ---- Likes (localStorage, per user) ----
const LS_LIKES_PREFIX = "pf_likes_";
const likesKey = (uid) => `${LS_LIKES_PREFIX}${uid}`;
const readJSON = (k, fb) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
};
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v ?? null));
const getUserLikes = (uid) => readJSON(likesKey(uid), []);
const saveUserLikes = (uid, a) => writeJSON(likesKey(uid), a);

export async function getUserPets() {
  const uid = getCurrentUserId();
  if (!uid) {
    const e = new Error("Unauthorized");
    e.status = 401;
    throw e;
  }
  const liked = new Set(getUserLikes(uid).map(String));
  const { animals } = await getPets({ page: 1, limit: 100 });
  return (animals ?? []).filter((a) => liked.has(String(a.id)));
}

export async function likePet(petId) {
  const uid = getCurrentUserId();
  if (!uid) {
    const e = new Error("Unauthorized");
    e.status = 401;
    throw e;
  }
  const likes = new Set(getUserLikes(uid).map(String));
  likes.add(String(petId));
  saveUserLikes(uid, Array.from(likes));
  return { ok: true, petId };
}

export async function unlikePet(petId) {
  const uid = getCurrentUserId();
  if (!uid) {
    const e = new Error("Unauthorized");
    e.status = 401;
    throw e;
  }
  const likes = new Set(getUserLikes(uid).map(String));
  likes.delete(String(petId));
  saveUserLikes(uid, Array.from(likes));
  return { ok: true, petId };
}
