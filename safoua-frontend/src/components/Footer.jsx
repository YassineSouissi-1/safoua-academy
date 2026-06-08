import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Sparkles, ArrowUpRight } from "lucide-react";

/* ── FONTS ─────────────────────────────────────────────────────── */
const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
`;

/* ── PALETTE (mirroring Courses page) ──────────────────────────── */
const C = {
  bg:      "#080b0f",
  surface: "#0d1117",
  card:    "#111820",
  border:  "rgba(255,255,255,0.07)",
  gold:    "#c9a84c",
  goldL:   "#e8c97a",
  teal:    "#1db584",
  tealL:   "#25d4a0",
  text:    "#f2ede6",
  muted:   "rgba(242,237,230,0.4)",
  dim:     "rgba(242,237,230,0.18)",
  purple:  "#9d7bea",
};

const NAV_LINKS = [
  { label: "Accueil",    to: "/" },
  { label: "Catalogue",  to: "/courses" },
  { label: "Mon Espace", to: "/dashboard" },
  { label: "Connexion",  to: "/login" },
  { label: "Inscription",to: "/register" },
];

const TECH_STACK = [
  { name: "MongoDB",    desc: "Base de données", color: C.teal },
  { name: "Express.js", desc: "Backend API",     color: "#60a5fa" },
  { name: "React.js",   desc: "Interface",       color: "#38bdf8" },
  { name: "Node.js",    desc: "Runtime",         color: C.tealL },
];

const CONTACT = [
  { icon: <Mail size={14}/>,   label: "contact@safoua.edu",   href: "mailto:contact@safoua.edu" },
  { icon: <Phone size={14}/>,  label: "+216 00 000 000",       href: "tel:+21600000000" },
  { icon: <MapPin size={14}/>, label: "Tunis, Tunisie",        href: "#" },
];

const SOCIALS = [
  { icon: <Github size={15}/>,   href: "#", label: "GitHub" },
  { icon: <Twitter size={15}/>,  href: "#", label: "Twitter" },
  { icon: <Linkedin size={15}/>, href: "#", label: "LinkedIn" },
];

/* ── STAGGER FADE IN ───────────────────────────────────────────── */
function FadeIn({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 0.68, 0, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── DIVIDER LINE ──────────────────────────────────────────────── */
function GoldLine({ delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.22, 0.68, 0, 1] }}
      style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}55, ${C.teal}55, transparent)`, transformOrigin: "left" }}
    />
  );
}

/* ── FOOTER COMPONENT ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: C.bg, fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{FONT_LINK}</style>

      {/* Background grid (matches Courses page) */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: "88px 88px", opacity: 0.4,
      }}/>

      {/* Ambient orb */}
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", bottom: "-20%", right: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)`,
          filter: "blur(60px)", pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ x: [0, -15, 12, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute", top: "0%", left: "-8%",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(29,181,132,0.045) 0%, transparent 65%)`,
          filter: "blur(60px)", pointerEvents: "none",
        }}
      />

      {/* Noise overlay */}
      <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:0.025,mixBlendMode:"overlay" }} xmlns="http://www.w3.org/2000/svg">
        <filter id="fnoise"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#fnoise)"/>
      </svg>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── TOP DIVIDER ─────────────────────────────────────── */}
        <GoldLine />

        {/* ── MAIN CONTENT ────────────────────────────────────── */}
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 56 }}>

          {/* BRAND */}
          <FadeIn delay={0} style={{ gridColumn: "span 1" }}>
            <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: C.bg,
                background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
                boxShadow: `0 4px 20px ${C.gold}40`,
              }}>س</div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                Safoua Academy
              </span>
            </Link>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, marginBottom: 24, fontWeight: 300, maxWidth: 260 }}>
              Plateforme éducative dédiée à l'excellence dans les sciences islamiques et la langue arabe.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIALS.map((s, i) => (
                <motion.a
                  key={i} href={s.href} aria-label={s.label}
                  whileHover={{ y: -3, borderColor: C.gold }}
                  style={{
                    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
                    color: C.dim, textDecoration: "none", transition: "color 0.25s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = C.gold}
                  onMouseLeave={e => e.currentTarget.style.color = C.dim}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </FadeIn>

          {/* NAVIGATION */}
          <FadeIn delay={0.08}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontWeight: 600, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
              Navigation
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {NAV_LINKS.map((l, i) => (
                <motion.div key={i} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link to={l.to} style={{
                    textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
                    fontSize: 13, fontWeight: 500, color: C.muted, transition: "color 0.25s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = C.text}
                    onMouseLeave={e => e.currentTarget.style.color = C.muted}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.teal, flexShrink: 0, opacity: 0.7 }} />
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* TECH STACK */}
          <FadeIn delay={0.16}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontWeight: 600, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
              Stack MERN
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
              {TECH_STACK.map((tech, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: tech.color, flexShrink: 0, boxShadow: `0 0 8px ${tech.color}60` }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: tech.color }}>{tech.name}</span>
                  <span style={{ fontSize: 11, color: C.dim }}>{tech.desc}</span>
                </div>
              ))}
            </div>
            {/* AI Badge */}
            <div style={{
              padding: "12px 16px", borderRadius: 14,
              background: `linear-gradient(135deg, rgba(29,181,132,0.08), rgba(201,168,76,0.06))`,
              border: `1px solid rgba(29,181,132,0.2)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Sparkles size={11} color={C.teal}/>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.teal, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  IA Integration
                </span>
              </div>
              <p style={{ fontSize: 11, color: C.muted, fontWeight: 300 }}>Chatbot · Traducteur · Quiz adaptatif</p>
            </div>
          </FadeIn>

          {/* CONTACT */}
          <FadeIn delay={0.24}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontWeight: 600, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
              Contact
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              {CONTACT.map((c, i) => (
                <motion.a
                  key={i} href={c.href}
                  whileHover={{ x: 4 }}
                  style={{
                    textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
                    fontSize: 13, fontWeight: 400, color: C.muted, transition: "color 0.25s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = C.text}
                  onMouseLeave={e => e.currentTarget.style.color = C.muted}
                >
                  <span style={{ color: C.teal, flexShrink: 0 }}>{c.icon}</span>
                  {c.label}
                </motion.a>
              ))}
            </div>

            {/* Project badge */}
            <div style={{
              padding: "14px 18px", borderRadius: 14,
              background: C.card,
              border: `1px solid ${C.border}`,
              position: "relative", overflow: "hidden",
            }}>
              {/* accent line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.gold}, ${C.teal})` }}/>
              <p style={{ fontSize: 10, fontWeight: 600, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                Projet de Fin d'Études
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>
                L3 Informatique — 2026
              </p>
            </div>
          </FadeIn>
        </div>

        {/* ── BOTTOM DIVIDER ──────────────────────────────────── */}
        <GoldLine delay={0.2} />

        {/* ── BOTTOM BAR ──────────────────────────────────────── */}
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ fontSize: 11, color: C.dim, fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 Safoua Academy. Tous droits réservés.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: C.gold, direction: "rtl", opacity: 0.7, letterSpacing: "0.04em" }}>
            بسم الله الرحمن الرحيم
          </p>
          <p style={{ fontSize: 11, color: C.dim, fontFamily: "'DM Sans', sans-serif" }}>
            Conçu avec ❤️ pour la communauté
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;