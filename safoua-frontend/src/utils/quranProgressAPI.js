/**
 * utils/quranProgressAPI.js — Safoua Academy
 * Thin wrapper around the /api/quran-progress endpoints.
 * Falls back to localStorage when the user is not logged in.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const LS_KEY   = 'safoua_quran_bookmark';

function getToken() {
  try { return localStorage.getItem('token') || sessionStorage.getItem('token') || null; }
  catch { return null; }
}

function authHeaders() {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

/* ── Local fallback helpers ─────────────────────────────────────── */
function lsLoad() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; } catch { return null; }
}
function lsSave(bm) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(bm)); } catch {}
}
function lsClear() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

/* ── API calls ──────────────────────────────────────────────────── */
export async function loadBookmark() {
  const token = getToken();
  if (!token) return lsLoad();

  try {
    const res = await fetch(`${API_BASE}/api/quran-progress`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Also mirror to localStorage so offline refresh still works
    if (data.bookmark) lsSave(data.bookmark);
    return data.bookmark || null;
  } catch (err) {
    console.warn('[quranProgress] load failed, using localStorage:', err.message);
    return lsLoad();
  }
}

export async function saveBookmark(bookmark) {
  // Always write to localStorage immediately (instant, offline-safe)
  lsSave(bookmark);

  const token = getToken();
  if (!token) return bookmark;

  try {
    const res = await fetch(`${API_BASE}/api/quran-progress`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(bookmark),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.bookmark || bookmark;
  } catch (err) {
    console.warn('[quranProgress] save failed, kept in localStorage:', err.message);
    return bookmark;
  }
}

export async function clearBookmark() {
  lsClear();

  const token = getToken();
  if (!token) return;

  try {
    await fetch(`${API_BASE}/api/quran-progress`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  } catch (err) {
    console.warn('[quranProgress] clear failed:', err.message);
  }
}