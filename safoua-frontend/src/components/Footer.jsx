/**
 * components/Footer.jsx — Safoua Academy
 * Beautiful in both dark and light modes.
 */

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Accueil',      to: '/' },
  { label: 'Catalogue',    to: '/courses' },
  { label: 'Dictionnaire', to: '/dictionary' },
  { label: 'Mon Espace',   to: '/dashboard' },
  { label: 'Connexion',    to: '/login' },
  { label: 'Inscription',  to: '/register' },
];

const SOCIALS = [
  { icon: <Github size={15} />,   href: '#', label: 'GitHub' },
  { icon: <Twitter size={15} />,  href: '#', label: 'Twitter' },
  { icon: <Linkedin size={15} />, href: '#', label: 'LinkedIn' },
];

function FadeIn({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [.22, .68, 0, 1] }} style={style}>
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const { C, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer style={{
      background: isDark ? C.bg : '#ffffff',
      borderTop: `1px solid ${C.border}`,
      fontFamily: "'DM Sans',sans-serif",
      position: 'relative', overflow: 'hidden',
      transition: 'background 0.3s',
    }}>
      {/* Top accent line */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${C.gold}, ${C.teal})` }} />

      {/* Subtle background detail */}
      {!isDark && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(154,111,30,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
      )}
      {isDark && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: '88px 88px', opacity: 0.4, pointerEvents: 'none' }} />
      )}

      {/* Ambient orbs */}
      <motion.div animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${C.gold}06 0%, transparent 65%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Main grid */}
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '72px 24px 56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 56 }}>

          {/* Brand */}
          <FadeIn delay={0} style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, overflow: 'hidden', boxShadow: `0 4px 18px ${C.gold}40`, flexShrink: 0 }}>
                <img src="/images/favicon-512.png" alt="Safoua Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>
                Safoua Academy
              </span>
            </Link>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75, marginBottom: 24, maxWidth: 260 }}>
              Plateforme éducative dédiée à l'excellence dans les sciences islamiques et la langue arabe.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIALS.map((s, i) => (
                <motion.a key={i} href={s.href} aria-label={s.label}
                  whileHover={{ y: -3, borderColor: C.gold, color: C.gold }}
                  style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${C.border}`, color: C.dim, textDecoration: 'none', transition: 'all 0.2s' }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </FadeIn>

          {/* Navigation */}
          <FadeIn delay={0.07}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, fontWeight: 600, color: C.gold, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>
              Navigation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV_LINKS.map((l, i) => (
                <motion.div key={i} whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
                  <Link to={l.to}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 500, color: C.muted, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = C.text}
                    onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.teal, opacity: 0.7, flexShrink: 0 }} />
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Islamic quote */}
          <FadeIn delay={0.14}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, fontWeight: 600, color: C.gold, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>
              Parole du Prophète ﷺ
            </div>
            <blockquote style={{ margin: 0, padding: '16px 20px', borderRadius: 14, background: isDark ? `${C.gold}08` : `${C.gold}08`, borderLeft: `3px solid ${C.gold}60` }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 14, color: C.muted, lineHeight: 1.75, margin: 0 }}>
                « Celui qui emprunte un chemin pour chercher la connaissance, Dieu lui facilite le chemin vers le Paradis. »
              </p>
            </blockquote>
          </FadeIn>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${C.border}`, maxWidth: 1180, margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 12, color: C.dim, fontFamily: "'DM Sans',sans-serif" }}>
            © 2026 Safoua Academy. Tous droits réservés.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: C.gold, direction: 'rtl', opacity: 0.75, letterSpacing: '0.04em' }}>
            بسم الله الرحمن الرحيم
          </p>
          <p style={{ fontSize: 12, color: C.dim, fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
            Conçu avec <Heart size={12} fill={C.red} color={C.red} /> pour la communauté
          </p>
        </div>
      </div>
    </footer>
  );
}