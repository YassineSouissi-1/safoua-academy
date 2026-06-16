/**
 * components/Navbar.jsx — Safoua Academy
 * Extracted from App.jsx (was inlined there before).
 */

import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion }    from 'framer-motion';
import { LogOut, Menu, X }            from 'lucide-react';
import { isLoggedIn, getUser, logout } from '../utils/auth';

const C = {
  gold:   '#c9a84c',
  teal:   '#1db584',
  text:   '#f2ede6',
  border: 'rgba(255,255,255,0.07)',
};

// Fonts loaded once in index.html
const FONTS = ``;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const user     = getUser();
  const userRole = user?.role;

  const heroPages  = ['/', '/courses'];
  const isHeroPage = heroPages.some(p =>
    p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
  );

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHeroPage && !scrolled;
  const navBg = transparent
    ? 'transparent'
    : scrolled
      ? 'rgba(8,11,15,0.96)'
      : 'rgba(8,11,15,0.88)';

  const textColor = 'rgba(242,237,230,0.72)';

  const navLinkStyle = ({ isActive }) => ({
    fontSize: 13, fontWeight: 600, textDecoration: 'none',
    color:  isActive ? C.gold : textColor,
    borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
    paddingBottom: 2,
    transition: 'color 0.15s',
    fontFamily: "'DM Sans',sans-serif",
    letterSpacing: '0.02em',
  });

  const roleBadge = userRole === 'teacher'
    ? <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(157,123,234,0.18)', color: '#9d7bea', border: '1px solid rgba(157,123,234,0.3)', borderRadius: 99, padding: '2px 7px', marginLeft: 6 }}>Enseignant</span>
    : userRole === 'student'
      ? <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(29,181,132,0.12)', color: C.teal, border: `1px solid rgba(29,181,132,0.28)`, borderRadius: 99, padding: '2px 7px', marginLeft: 6 }}>Étudiant</span>
      : null;

  const mobileLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Cours', to: '/courses' },
    { label: 'Dictionnaire', to: '/dictionary' },
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
          height: 70, display: 'flex', alignItems: 'center', padding: '0 24px',
          background: navBg,
          borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
          backdropFilter: transparent ? 'none' : 'blur(22px)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(22px)',
          transition: 'background 0.35s, border-color 0.35s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              whileHover={{ scale: 1.08 }}
              style={{ width: 38, height: 38, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 16px ${C.gold}40`, flexShrink: 0 }}
            >
              <img src="/images/favicon-512.png" alt="Safoua Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.text, fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.01em' }}>
              Safoua Academy
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <NavLink to="/" end style={navLinkStyle}>Accueil</NavLink>
            <NavLink to="/courses" style={navLinkStyle}>Cours</NavLink>
            <NavLink to="/dictionary" style={navLinkStyle}>Dictionnaire</NavLink>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            {loggedIn ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NavLink to="/dashboard" style={navLinkStyle}>Mon Espace</NavLink>
                  {roleBadge}
                </div>
                <motion.button
                  whileHover={{ background: 'rgba(212,101,74,0.18)' }}
                  onClick={logout}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'rgba(212,101,74,0.08)', color: '#d4654a', border: '1px solid rgba(212,101,74,0.2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'background 0.2s' }}
                >
                  <LogOut size={13} /> Déconnexion
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={navLinkStyle}>Connexion</NavLink>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${C.gold}40` }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: '8px 18px', borderRadius: 10, background: `linear-gradient(135deg,${C.gold},${C.teal})`, color: '#080b0f', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
                  >
                    S'inscrire
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="show-mobile"
            style={{ background: 'none', border: 'none', color: 'rgba(242,237,230,0.8)', cursor: 'pointer', padding: 6, display: 'none' }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            style={{ position: 'fixed', top: 70, left: 0, right: 0, zIndex: 49, background: 'rgba(8,11,15,0.97)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}`, padding: '12px 24px 20px' }}
          >
            {mobileLinks.map((l, i) => (
              <Link
                key={i} to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '13px 0', fontSize: 15, fontWeight: 600, color: 'rgba(242,237,230,0.75)', textDecoration: 'none', borderBottom: `1px solid ${C.border}`, fontFamily: "'DM Sans',sans-serif" }}
              >
                {l.label}
              </Link>
            ))}
            {loggedIn && (
              <button
                onClick={logout}
                style={{ marginTop: 12, background: 'none', border: 'none', color: '#d4654a', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: 0, fontFamily: "'DM Sans',sans-serif" }}
              >
                Déconnexion
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{FONTS + `
        * { box-sizing: border-box; }
        ::selection { background: rgba(201,168,76,0.22); color: #f2ede6; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080b0f; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.22); border-radius: 99px; }
        .hidden-mobile { display: flex !important; }
        .show-mobile   { display: none  !important; }
        @media (max-width: 767px) {
          .hidden-mobile { display: none  !important; }
          .show-mobile   { display: block !important; }
          .hero-grid     { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}