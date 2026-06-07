// Single source of truth for the backend URL.
// Every component imports API_BASE from here — no more hardcoded localhost strings.
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";