/**
 * components/Navbar.jsx — Safoua Academy
 * Beautiful in both dark and light modes.
 */

import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { isLoggedIn, getUser, logout } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const user = getUser();
  const userRole = user?.role;
  const { theme, toggleTheme, C } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* In dark mode on hero pages, nav is transparent until scroll */
  const heroPages = ['/', '/courses'];
  const isHero = heroPages.some(p => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p));
  const transparent = isDark && isHero && !scrolled;

  const navBg = transparent ? 'transparent'
    : isDark ? 'rgba(8,11,15,0.96)' : 'rgba(255,255,255,0.97)';

  const navBorder = scrolled
    ? `1px solid ${C.border}`
    : '1px solid transparent';

  const linkStyle = ({ isActive }) => ({
    fontSize: 13, fontWeight: 600, textDecoration: 'none',
    color: isActive ? C.gold : C.muted,
    borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
    paddingBottom: 2, transition: 'color 0.15s',
    fontFamily: "'DM Sans',sans-serif",
  });

  const roleBadge = userRole === 'teacher'
    ? <span style={{ fontSize: 9, fontWeight: 700, background: `${C.purple}18`, color: C.purple, border: `1px solid ${C.purple}35`, borderRadius: 99, padding: '2px 8px', marginLeft: 6 }}>Enseignant</span>
    : userRole === 'student'
      ? <span style={{ fontSize: 9, fontWeight: 700, background: `${C.teal}14`, color: C.teal, border: `1px solid ${C.teal}30`, borderRadius: 99, padding: '2px 8px', marginLeft: 6 }}>Étudiant</span>
      : null;

  const mobileLinks = [
    { label: 'Accueil', to: '/' }, { label: 'Cours', to: '/courses' },
    { label: 'Dictionnaire', to: '/dictionary' }, { label: 'Quran', to: '/quran' },
    ...(loggedIn
      ? [{ label: 'Mon Espace', to: '/dashboard' }]
      : [{ label: 'Connexion', to: '/login' }, { label: "S'inscrire", to: '/register' }]
    ),
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [.22, .68, 0, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 'var(--nav-h)', display: 'flex', alignItems: 'center',
          padding: '0 var(--container-pad)',
          background: navBg, borderBottom: navBorder,
          backdropFilter: transparent ? 'none' : 'blur(20px)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(20px)',
          transition: 'background 0.3s, border-color 0.3s',
          boxShadow: scrolled && !isDark ? '0 1px 16px rgba(0,0,0,0.06)' : 'none',
        }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <motion.div whileHover={{ scale: 1.06 }}
              style={{ width: 34, height: 34, borderRadius: 11, overflow: 'hidden', boxShadow: `0 0 14px ${C.gold}40`, flexShrink: 0 }}>
              <img src="/images/favicon-512.png" alt="Safoua Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <span style={{ fontSize: 'clamp(0.9rem, 0.8rem + 0.5vw, 1.0625rem)', fontWeight: 700, color: C.text, fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Safoua Academy
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <NavLink to="/" end style={linkStyle}>Accueil</NavLink>
            <NavLink to="/courses" style={linkStyle}>Cours</NavLink>
            <NavLink to="/dictionary" style={linkStyle}>Dictionnaire</NavLink>
            <NavLink to="/quran" style={linkStyle}>Quran</NavLink>
            <div style={{ width: 1, height: 16, background: C.border }} />
            {loggedIn ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NavLink to="/dashboard" style={linkStyle}>Mon Espace</NavLink>
                  {roleBadge}
                </div>
                <motion.button whileHover={{ background: `${C.red}20` }} onClick={logout}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: `${C.red}0e`, color: C.red, border: `1px solid ${C.red}25`, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'background 0.2s' }}>
                  <LogOut size={13} /> Déconnexion
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={linkStyle}>Connexion</NavLink>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <motion.button whileHover={{ scale: 1.04, boxShadow: `0 4px 20px ${C.gold}45` }} whileTap={{ scale: 0.97 }}
                    style={{ padding: '8px 20px', borderRadius: 10, background: `linear-gradient(135deg,${C.gold},${C.teal})`, color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                    S'inscrire
                  </motion.button>
                </Link>
              </>
            )}
            {/* Theme toggle */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} C={C} isDark={isDark} />
          </div>

          {/* Mobile */}
          <div className="nav-mobile-trigger" style={{ alignItems: 'center', gap: 8 }}>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} C={C} isDark={isDark} compact />
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" aria-expanded={menuOpen}
              style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 'var(--tap-min)', minHeight: 'var(--tap-min)' }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="mobile-drawer"
            style={{ position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, zIndex: 49, maxHeight: 'calc(100dvh - var(--nav-h))', overflowY: 'auto', background: isDark ? 'rgba(8,11,15,0.98)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}`, padding: 'var(--space-xs) var(--container-pad) var(--space-md)', boxShadow: !isDark ? '0 8px 32px rgba(0,0,0,0.08)' : 'none' }}>
            {mobileLinks.map((l, i) => (
              <Link key={i} to={l.to} onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 'var(--tap-min)', padding: '13px 0', fontSize: 'var(--text-body-lg)', fontWeight: 600, color: C.muted, textDecoration: 'none', borderBottom: `1px solid ${C.border}`, fontFamily: "'DM Sans',sans-serif" }}>
                {l.label}
              </Link>
            ))}
            {loggedIn && (
              <button onClick={logout}
                style={{ marginTop: 14, minHeight: 'var(--tap-min)', background: 'none', border: 'none', color: C.red, fontWeight: 600, fontSize: 'var(--text-body-lg)', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans',sans-serif" }}>
                Déconnexion
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-desktop-links { display: flex; }
        .nav-mobile-trigger { display: none; }
        @media (max-width: 767px) {
          .nav-desktop-links  { display: none !important; }
          .nav-mobile-trigger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function ThemeToggle({ theme, toggleTheme, C, isDark, compact }) {
  return (
    <motion.button onClick={toggleTheme} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      style={{
        width: compact ? 44 : 38, height: compact ? 44 : 38, borderRadius: 11,
        border: `1.5px solid ${C.border}`,
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
      }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ rotate: -30, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.7 }} transition={{ duration: 0.22 }} style={{ display: 'flex' }}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}