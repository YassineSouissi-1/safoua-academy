/**
 * utils/auth.js — Safoua Academy
 * ─────────────────────────────────
 * FIX: Removed duplicate API_BASE definition.
 *      Now imports from config/api.js (single source of truth).
 */

import axios    from 'axios';
import { API_BASE } from '../config/api.js';   // ← single source of truth

const TOKEN_KEY = 'safoua_token';

// ── Token helpers ──────────────────────────────────────────────────
export function getToken()        { return localStorage.getItem(TOKEN_KEY); }
export function setToken(token)   { localStorage.setItem(TOKEN_KEY, token); }
export function removeToken()     { localStorage.removeItem(TOKEN_KEY); }

// ── Decode JWT payload (client-side only — verification is server-side) ──
export function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

// ── Check if stored token is still valid (not expired) ────────────
export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  return payload.exp * 1000 > Date.now(); // exp is seconds, Date.now() ms
}

// ── Get current user from the stored token ─────────────────────────
export function getUser() {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token); // { id, username, email, role, iat, exp }
}

// ── Logout: clear all auth data ────────────────────────────────────
export function logout() {
  removeToken();
  // Remove legacy keys from before the JWT migration (backward compat)
  localStorage.removeItem('username');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  window.location.href = '/';
}

// ── Axios instance with auto Bearer token ──────────────────────────
/**
 * Use `api` instead of plain `axios` for any authenticated request.
 *
 * Example:
 *   import { api } from '../utils/auth';
 *   const res = await api.get('/api/me');
 *   const res = await api.post('/api/sessions', { ... });
 */
export const api = axios.create({ baseURL: API_BASE });

// Request interceptor — attach token before every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Response interceptor — force logout on 401 (expired / invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      localStorage.removeItem('username');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
