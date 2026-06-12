/**
 * auth.js — Safoua Academy
 * ─────────────────────────
 * Central auth utility:
 *   - Stores/reads the JWT token from localStorage
 *   - Provides a pre-configured axios instance that automatically
 *     sends the token on every request (no need to add headers manually)
 *   - Helpers: login(), logout(), getUser(), isLoggedIn()
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'safoua_token';

// ── Token helpers ─────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Decode the JWT payload (without verification — just for reading) ──
// The signature is verified server-side; here we just read the claims.
export function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// ── Check if the stored token is still valid (not expired) ───────
export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  // exp is in seconds; Date.now() is in ms
  return payload.exp * 1000 > Date.now();
}

// ── Get the current user from the stored token ───────────────────
export function getUser() {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token); // { id, username, email, role, iat, exp }
}

// ── Logout: clear all auth data ──────────────────────────────────
export function logout() {
  removeToken();
  // Remove old localStorage keys in case they exist from before the JWT migration
  localStorage.removeItem('username');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  window.location.href = '/';
}

// ── Axios instance with auto Bearer token ────────────────────────
/**
 * Use `api` instead of plain `axios` for any request that needs auth.
 *
 * Example:
 *   import { api } from '../utils/auth';
 *   const res = await api.get('/api/me');
 *   const res = await api.post('/api/update-progress', { lessonTitle });
 */
export const api = axios.create({
  baseURL: API_BASE,
});

// Request interceptor: attach the token before every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: if the server returns 401, log the user out automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — force logout
      removeToken();
      localStorage.removeItem('username');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);