const keyFor = (userId = "guest") => `ppf:saved:${userId}`;

export function loadSaved(userId = "guest") {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSaved(userId = "guest", items = []) {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(items));
  } catch {}
}
