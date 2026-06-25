/**
 * context/ThemeContext.jsx — Safoua Academy
 * Provides `theme` ("dark" | "light") and `toggleTheme` to the whole app.
 * Persists the user's choice in localStorage under "safoua-theme".
 * Also injects CSS custom-properties on <html> so any CSS can reference them.
 */

import { createContext, useContext, useEffect, useState } from "react";

/* ── PALETTES ──────────────────────────────────────────────────────────── */
export const DARK = {
  bg:      "#080b0f",
  surface: "#0d1117",
  card:    "#111820",
  border:  "rgba(255,255,255,0.07)",
  gold:    "#c9a84c",
  goldL:   "#e8c97a",
  teal:    "#1db584",
  tealL:   "#25d4a0",
  text:    "#f2ede6",
  muted:   "rgba(242,237,230,0.45)",
  dim:     "rgba(242,237,230,0.18)",
  purple:  "#9d7bea",
  blue:    "#4fadd4",
  red:     "#d4654a",
  navBg:   "rgba(8,11,15,0.96)",
  cardBg:  "rgba(255,255,255,0.028)",
  inputBg: "rgba(255,255,255,0.04)",
  shadow:  "0 40px 100px rgba(0,0,0,0.5)",
};

export const LIGHT = {
  bg:      "#f5f0e8",
  surface: "#ede8de",
  card:    "#e6e0d4",
  border:  "rgba(0,0,0,0.09)",
  gold:    "#a07828",        // darker gold — readable on cream
  goldL:   "#c9a84c",
  teal:    "#0e7a5a",        // darker teal for contrast
  tealL:   "#1db584",
  text:    "#1a1510",
  muted:   "rgba(26,21,16,0.55)",
  dim:     "rgba(26,21,16,0.28)",
  purple:  "#6b4fc4",
  blue:    "#2e7eb0",
  red:     "#b8402a",
  navBg:   "rgba(245,240,232,0.96)",
  cardBg:  "rgba(255,255,255,0.6)",
  inputBg: "rgba(0,0,0,0.04)",
  shadow:  "0 40px 100px rgba(0,0,0,0.12)",
};

/* ── CONTEXT ──────────────────────────────────────────────────────────── */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("safoua-theme") || "dark"
  );

  const C = theme === "dark" ? DARK : LIGHT;

  /* Inject CSS variables on <html> whenever theme changes */
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(C).forEach(([key, val]) => {
      root.style.setProperty(`--c-${key}`, val);
    });
    root.setAttribute("data-theme", theme);
    // Also update body background to prevent flash
    document.body.style.background = C.bg;
  }, [theme, C]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("safoua-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, C }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Convenience hook — use inside any component */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}