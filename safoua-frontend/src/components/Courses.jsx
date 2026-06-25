/**
 * components/Courses.jsx — Safoua Academy
 * Full redesign: beautiful white editorial design in light mode,
 * premium dark design preserved. No gradient-text bug.
 */

import { useRef, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  motion, useScroll, useTransform,
  useInView, AnimatePresence, easeOut,
} from "framer-motion";
import { Star, Users, Clock, ArrowUpRight, Sparkles, ChevronDown, BookOpen, Lock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ── ROADMAP DATA ──────────────────────────────────────────────── */
const ROADMAP = [
  {
    phase: "DÉPART", phaseAr: "البداية", phaseColor: "#1db584", num: "01",
    courses: [
      {
        id: 1, title: "Alphabet Arabe & Phonétique", titleAr: "الحروف والصوتيات",
        category: "Arabe", level: "Débutant", duration: "10h", rating: 4.9, students: "1.2k",
        instructor: "Pr. Yassine", accent: "#1db584", icon: "أ",
        image: "https://images.unsplash.com/photo-1696513553729-17129c427356?auto=format&fit=crop&w=1200&q=90",
        tags: ["Écriture", "Oral"],
        description: "Maîtrisez les 28 lettres arabes, leurs formes et leur phonétique.",
        recommended: true,
      },
      {
        id: 7, title: "L'Art du Tashkeel Arabe", titleAr: "فن التشكيل العربي",
        category: "Arabe", level: "Débutant", duration: "12h", rating: 4.6, students: "450",
        instructor: "Ustadh Kamal", accent: "#9d7bea", icon: "خ",
        image: "https://images.unsplash.com/photo-1761639935382-43452f278898?auto=format&fit=crop&w=1200&q=90",
        tags: ["Art", "Créativité"],
        description: "Transformez l'écriture en art avec les styles Naskh et Thuluth.",
        recommended: false,
      },
    ],
  },
  {
    phase: "FONDATIONS", phaseAr: "الأساسيات", phaseColor: "#c9a84c", num: "02",
    courses: [
      {
        id: 4, title: "Grammaire : Tome 1 de Médine", titleAr: "النحو العربي",
        category: "Arabe", level: "Débutant", duration: "25h", rating: 4.7, students: "2.1k",
        instructor: "Dr. Amira", accent: "#4fadd4", icon: "ن",
        image: "https://images.unsplash.com/photo-1720701575003-51dafcf39cb4?auto=format&fit=crop&w=1200&q=90",
        tags: ["Syntaxe", "Vocabulaire"],
        description: "Bases solides en grammaire arabe avec la méthode de l'Université de Médine.",
        recommended: true,
      },
      {
        id: 8, title: "Devenir Musulman : Les Bases", titleAr: "أساسيات الإسلام",
        category: "Sciences", level: "Débutant", duration: "14h", rating: 4.9, students: "1.2k",
        instructor: "Dr. Nadia", accent: "#2ab89a", icon: "☪",
        image: "https://images.unsplash.com/photo-1513072064285-240f87fa81e8?auto=format&fit=crop&w=1200&q=90",
        tags: ["Conversion", "Fondements"],
        description: "La Chahada, les 5 piliers, la prière et comment vivre en Islam.",
        recommended: false,
      },
    ],
  },
  {
    phase: "CORAN", phaseAr: "القرآن الكريم", phaseColor: "#9d7bea", num: "03",
    courses: [
      {
        id: 2, title: "Tajwid : Récitation Sacrée", titleAr: "أحكام التجويد",
        category: "Coran", level: "Intermédiaire", duration: "15h", rating: 4.8, students: "850",
        instructor: "Cheikh Omar", accent: "#9d7bea", icon: "ت",
        image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=90",
        tags: ["Règles", "Mélodie"],
        description: "Récitez le Coran avec perfection grâce aux règles du Tajwid.",
        recommended: true,
      },
      {
        id: 3, title: "Mémorisation : Les Sourates", titleAr: "حفظ القرآن",
        category: "Coran", level: "Tous niveaux", duration: "20h", rating: 5.0, students: "3.4k",
        instructor: "Pr. Fatma", accent: "#c9a84c", icon: "س",
        image: "https://images.unsplash.com/photo-1773738495671-79b90e39dc54?auto=format&fit=crop&w=1200&q=90",
        tags: ["Hifz", "Pratique"],
        description: "Mémorisez les sourates courtes avec des techniques éprouvées.",
        recommended: false,
      },
    ],
  },
  {
    phase: "MAÎTRISE", phaseAr: "الإتقان", phaseColor: "#d4654a", num: "04",
    courses: [
      {
        id: 9, title: "Arabe Moderne Standard", titleAr: "اللغة العربية الفصحى",
        category: "Arabe", level: "Intermédiaire", duration: "30h", rating: 4.7, students: "1.8k",
        instructor: "Prof. Leila", accent: "#4fadd4", icon: "ع",
        image: "https://images.unsplash.com/photo-1670852738521-701618bb5eb4?auto=format&fit=crop&w=1200&q=90",
        tags: ["Conversation", "Presse"],
        description: "Maîtrisez l'arabe moderne pour lire la presse et communiquer.",
        recommended: true,
      },
      {
        id: 5, title: "Introduction au Fiqh", titleAr: "أصول الفقه",
        category: "Sciences", level: "Intermédiaire", duration: "12h", rating: 4.9, students: "600",
        instructor: "Dr. Hassan", accent: "#d4654a", icon: "ف",
        image: "https://images.unsplash.com/photo-1744957280831-8d30f63914b8?auto=format&fit=crop&w=1200&q=90",
        tags: ["Législation", "Éthique"],
        description: "Les fondements de la jurisprudence islamique.",
        recommended: false,
      },
      {
        id: 6, title: "Sira : Vie du Prophète ﷺ", titleAr: "السيرة النبوية",
        category: "Sciences", level: "Tous niveaux", duration: "18h", rating: 4.9, students: "1.5k",
        instructor: "Pr. Walid", accent: "#1db584", icon: "م",
        image: "https://images.unsplash.com/photo-1605976528013-638e49b6599f?auto=format&fit=crop&w=1200&q=90",
        tags: ["Histoire", "Éthique"],
        description: "Un voyage à travers la vie du Prophète Muhammad ﷺ.",
        recommended: false,
      },
    ],
  },
];

const ROUTES = { 1: "/course-view/1", 2: "/course-view/2", 3: "/course-view/3", 4: "/course-view/4", 5: "/course-view/5", 6: "/course-view/6", 7: "/course-view/7", 8: "/course-view/8", 9: "/course-view/9" };

/* ── TYPEWRITER ──────────────────────────────────────────────────── */
function useTypewriter(text, { speed = 38, startDelay = 0, trigger = true } = {}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!trigger) return;
    setDisplayed(""); setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay, trigger]);
  return { displayed, done };
}

function WritingText({ text, style, as: Tag = "span", speed = 38, startDelay = 0, trigger = true, cursorColor }) {
  const { displayed, done } = useTypewriter(text, { speed, startDelay, trigger });
  return (
    <Tag style={style}>
      {displayed}
      {!done && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-block", width: "2px", height: "1em", background: cursorColor || "#c9a84c", marginLeft: 2, verticalAlign: "text-bottom", borderRadius: 1 }} />
      )}
    </Tag>
  );
}

function WritingItalicLine({ text, speed, startDelay, trigger, C }) {
  const { displayed, done } = useTypewriter(text, { speed, startDelay, trigger });
  return (
    <span style={{ display: "block", fontStyle: "italic", color: C.gold }}>
      {displayed}
      {!done && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-block", width: "3px", height: "0.85em", background: C.gold, marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} />
      )}
    </span>
  );
}

function WordReveal({ text, style, delay = 0, inView = true }) {
  return (
    <span style={{ ...style, display: "block" }}>
      {text.split(" ").map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}>
          <motion.span style={{ display: "inline-block" }} initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: delay + i * 0.07, ease: [0.22, 0.68, 0, 1] }}>
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── BACKGROUND ──────────────────────────────────────────────────── */
function CoursesBg({ isDark }) {
  if (isDark) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "#080b0f" }} />
        <motion.div animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-15%", right: "5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,0.055) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <motion.div animate={{ x: [0, -25, 20, 0], y: [0, 30, -15, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ position: "absolute", bottom: "5%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,181,132,0.05) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <motion.div animate={{ x: [0, 20, -15, 0], y: [0, -15, 25, 0] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 7 }}
          style={{ position: "absolute", top: "40%", left: "35%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(157,123,234,0.04) 0%,transparent 65%)", filter: "blur(70px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.018) 1px,transparent 1px)", backgroundSize: "88px 88px" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.032, mixBlendMode: "overlay" }} xmlns="http://www.w3.org/2000/svg">
          <filter id="cnoise"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#cnoise)" />
        </svg>
      </div>
    );
  }
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "#ffffff" }} />
      <div style={{ position: "absolute", top: "-10%", right: "5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(154,111,30,0.05) 0%, transparent 65%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,122,87,0.04) 0%, transparent 65%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(154,111,30,0.09) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
    </div>
  );
}

/* ── LEVEL BADGE ─────────────────────────────────────────────────── */
function LevelBadge({ level }) {
  const colors = {
    "Débutant":      { bg: "rgba(29,181,132,0.12)",  text: "#1db584" },
    "Intermédiaire": { bg: "rgba(79,173,212,0.12)",  text: "#4fadd4" },
    "Tous niveaux":  { bg: "rgba(201,168,76,0.12)",  text: "#c9a84c" },
  };
  const c = colors[level] || colors["Débutant"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 9px", borderRadius: 99, background: c.bg, color: c.text, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", fontFamily: "'DM Sans',sans-serif" }}>
      {level}
    </span>
  );
}

/* ── COURSE CARD ─────────────────────────────────────────────────── */
function CourseCard({ course, index, C, isDark }) {
  const [hov, setHov] = useState(false);
  const [imgOk, setImgOk] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [.22, .68, 0, 1] }}
      style={{ height: "100%" }}>
      <Link to={ROUTES[course.id] || "/courses"} style={{ textDecoration: "none", display: "flex", height: "100%" }}>
        <motion.div
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          animate={{ y: hov ? -8 : 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          style={{
            borderRadius: 22, overflow: "hidden",
            background: isDark ? C.card : "#ffffff",
            border: `1px solid ${hov ? course.accent + "60" : C.border}`,
            boxShadow: hov
              ? (isDark
                ? `0 28px 70px rgba(0,0,0,0.55), 0 0 0 1px ${course.accent}20`
                : `0 20px 60px rgba(0,0,0,0.12), 0 0 0 2px ${course.accent}25`)
              : (isDark
                ? "0 4px 24px rgba(0,0,0,0.3)"
                : "0 2px 16px rgba(0,0,0,0.07)"),
            transition: "border-color 0.25s, box-shadow 0.25s, background 0.3s",
            position: "relative", display: "flex", flexDirection: "column", width: "100%",
          }}>

          {/* ── IMAGE ── */}
          <div style={{ position: "relative", height: 200, overflow: "hidden", background: isDark ? "#0a0f14" : "#f0ede7", flexShrink: 0 }}>
            <motion.img src={course.image} alt={course.title} onLoad={() => setImgOk(true)}
              animate={{ scale: hov ? 1.06 : 1, opacity: imgOk ? (hov ? 0.85 : isDark ? 0.55 : 0.75) : 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />

            {/* Image overlay — different for dark/light */}
            {isDark ? (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(8,11,15,0.08) 0%,rgba(8,11,15,0.55) 60%,rgba(8,11,15,0.95) 100%)" }} />
            ) : (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.4) 60%,rgba(255,255,255,0.95) 100%)" }} />
            )}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${course.accent}20 0%,transparent 60%)` }} />

            {/* Icon badge */}
            <motion.div animate={{ scale: hov ? 1.1 : 1 }} transition={{ duration: 0.25 }}
              style={{ position: "absolute", top: 14, left: 14, width: 44, height: 44, borderRadius: 13, background: isDark ? `${course.accent}22` : "rgba(255,255,255,0.92)", border: `1.5px solid ${course.accent}50`, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: course.accent, fontWeight: 700, boxShadow: isDark ? "none" : "0 2px 10px rgba(0,0,0,0.1)" }}>
              {course.icon}
            </motion.div>

            {/* Recommended badge */}
            {course.recommended && (
              <div style={{ position: "absolute", top: 14, right: 14, padding: "4px 10px", borderRadius: 99, background: isDark ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.92)", border: "1px solid rgba(201,168,76,0.45)", backdropFilter: "blur(8px)", fontSize: 9, fontWeight: 700, color: "#9a6f1e", letterSpacing: "0.08em", textTransform: "uppercase", boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.08)" }}>
                ★ Recommandé
              </div>
            )}

            {/* Category pill */}
            <div style={{ position: "absolute", bottom: 12, left: 14, padding: "3px 10px", borderRadius: 99, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.05em", fontFamily: "'DM Sans',sans-serif" }}>
              {course.category}
            </div>

            {/* Arrow on hover */}
            <motion.div animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : 6, y: hov ? 0 : -6 }} transition={{ duration: 0.22 }}
              style={{ position: "absolute", bottom: 12, right: 14, width: 30, height: 30, borderRadius: 9, background: course.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${course.accent}50` }}>
              <ArrowUpRight size={14} color="#fff" />
            </motion.div>
          </div>

          {/* ── BODY ── */}
          <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Arabic subtitle */}
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, color: `${course.accent}88`, marginBottom: 6, direction: "rtl", letterSpacing: "0.03em" }}>
              {course.titleAr}
            </div>

            {/* Title */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 8, fontFamily: "'Cormorant Garamond',serif", letterSpacing: "-0.01em" }}>
              {course.title}
            </h3>

            {/* Description */}
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>
              {course.description}
            </p>

            {/* Level badge + tags */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, marginTop: "auto", alignItems: "center" }}>
              <LevelBadge level={course.level} />
              {course.tags.map(t => (
                <span key={t} style={{ padding: "2px 9px", borderRadius: 99, background: isDark ? `${course.accent}10` : `${course.accent}0e`, border: `1px solid ${course.accent}28`, fontSize: 10, fontWeight: 600, color: course.accent, letterSpacing: "0.04em", fontFamily: "'DM Sans',sans-serif" }}>{t}</span>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: C.border, marginBottom: 14 }} />

            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#c9a84c", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", flex: 1 }}>
                <Star size={12} fill="#c9a84c" color="#c9a84c" /> {course.rating}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.dim, fontFamily: "'DM Sans',sans-serif", flex: 1, justifyContent: "center" }}>
                <Users size={12} /> {course.students}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.dim, fontFamily: "'DM Sans',sans-serif", flex: 1, justifyContent: "flex-end" }}>
                <Clock size={12} /> {course.duration}
              </div>
            </div>

            {/* Instructor */}
            <div style={{ marginTop: 10, fontSize: 11.5, color: C.dim, fontFamily: "'DM Sans',sans-serif", fontStyle: "italic", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${course.accent}30, ${course.accent}15)`, border: `1px solid ${course.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: course.accent, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", flexShrink: 0 }}>
                {course.instructor[0]}
              </div>
              {course.instructor}
            </div>
          </div>

          {/* Bottom accent line on hover */}
          <motion.div animate={{ scaleX: hov ? 1 : 0, opacity: hov ? 1 : 0 }} transition={{ duration: 0.28 }}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${course.accent}, transparent)`, transformOrigin: "center" }} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── PHASE DIVIDER ───────────────────────────────────────────────── */
function PhaseDivider({ phase, C, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: -32 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: [.22, .68, 0, 1] }}
      style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
      {/* Number column */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, fontWeight: 700, color: phase.phaseColor, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {phase.num}
        </div>
        <div style={{ width: 1, height: 32, background: `linear-gradient(180deg, ${phase.phaseColor}70, transparent)` }} />
      </div>

      {/* Phase name */}
      <div>
        <WordReveal text={phase.phase} inView={inView} delay={0.1}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1, marginBottom: 2, letterSpacing: "-0.02em" }} />
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: phase.phaseColor, direction: "rtl", opacity: 0.75 }}>
          {phase.phaseAr}
        </div>
      </div>

      {/* Expanding line */}
      <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.25, ease: easeOut }}
        style={{ flex: 1, height: 1, background: isDark ? `linear-gradient(90deg, ${phase.phaseColor}50, transparent)` : `linear-gradient(90deg, ${phase.phaseColor}40, transparent)`, transformOrigin: "left" }} />

      {/* Count pill */}
      <div style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 99, background: isDark ? `${phase.phaseColor}12` : `${phase.phaseColor}10`, border: `1px solid ${phase.phaseColor}30`, fontSize: 10, fontWeight: 700, color: phase.phaseColor, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
        {phase.courses.length} cours
      </div>
    </motion.div>
  );
}

/* ── HERO SECTION ────────────────────────────────────────────────── */
function CoursesHero({ C, isDark }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opHero = useTransform(scrollY, [0, 400], [1, 0]);
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), 300); return () => clearTimeout(t); }, []);

  const total = ROADMAP.reduce((s, p) => s + p.courses.length, 0);
  const line1 = "Votre parcours vers";
  const line2 = "la maîtrise islamique";

  return (
    <div style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 1 }}>
      {/* Parallax watermark */}
      <motion.div style={{ y, position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(200px,35vw,520px)", color: isDark ? "rgba(201,168,76,0.022)" : "rgba(154,111,30,0.04)", lineHeight: 1, userSelect: "none", letterSpacing: "-0.05em" }}>
          علم
        </div>
      </motion.div>

      <motion.div style={{ opacity: opHero, position: "relative", zIndex: 1, textAlign: "center", padding: "120px 24px 80px", maxWidth: 860, width: "100%" }}>
        {/* Eyebrow badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: easeOut }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 99, background: `${C.gold}14`, border: `1px solid ${C.gold}35`, fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32, fontFamily: "'DM Sans',sans-serif" }}>
          <Sparkles size={11} /> {total} Cours · 4 Niveaux · Certifiés
        </motion.div>

        {/* Animated heading */}
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.8rem,7vw,5.5rem)", fontWeight: 700, lineHeight: 1.08, color: C.text, marginBottom: 24, letterSpacing: "-0.03em", minHeight: "2.5em" }}>
          <WritingText text={line1} speed={42} startDelay={400} trigger={started}
            style={{ display: "block" }} cursorColor={C.gold} />
          <WritingItalicLine text={line2} speed={38} startDelay={400 + line1.length * 42 + 180} trigger={started} C={C} />
        </h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 + (line1.length + line2.length) * 0.042 + 0.3 }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1rem,2vw,1.2rem)", fontStyle: "italic", color: C.muted, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 48px" }}>
          <WritingText
            text="De l'alphabet au Coran — un chemin structuré, guidé par des experts, enrichi par l'intelligence artificielle."
            speed={22} startDelay={400 + (line1.length + line2.length) * 40 + 400}
            trigger={started} cursorColor={C.teal} />
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4 + (line1.length + line2.length) * 0.042 + 1.2 }}
          style={{ display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap", paddingTop: 36, borderTop: `1px solid ${C.border}`, maxWidth: 560, margin: "0 auto" }}>
          {[["9", "Cours"], ["4k+", "Étudiants"], ["98%", "Réussite"], ["6", "Experts"]].map(([val, lbl], i) => (
            <motion.div key={lbl}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 + (line1.length + line2.length) * 0.042 + 1.2 + i * 0.1 }}
              style={{ flex: 1, textAlign: "center", padding: "0 12px", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, color: C.gold, lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 5 }}>{lbl}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: isDark ? 0.35 : 0.45, zIndex: 1 }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: C.gold, textTransform: "uppercase" }}>Découvrir</span>
        <ChevronDown size={14} color={C.gold} />
      </motion.div>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────────────────────── */
export default function Courses() {
  const { C, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif", position: "relative", transition: "background 0.3s" }}>
      <Helmet>
        <title>Nos Cours — Safoua Academy</title>
        <meta name="description" content="Découvrez nos 9 cours : Alphabet Arabe, Tajwid, Mémorisation, Grammaire, Fiqh, Sira, Calligraphie et plus." />
        <meta property="og:title" content="Nos Cours — Safoua Academy" />
        <meta property="og:description" content="9 cours islamiques structurés, guidés par des experts et enrichis par l'IA." />
        <meta property="og:image" content="/images/og-cover.png" />
      </Helmet>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(154,111,30,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: rgba(154,111,30,0.28); border-radius: 99px; }
      `}</style>

      <CoursesBg isDark={isDark} />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Hero */}
        <CoursesHero C={C} isDark={isDark} />

        {/* Roadmap */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 140px" }}>
          {ROADMAP.map((phase, pi) => (
            <div key={phase.phase}
              style={{
                marginBottom: 96,
                /* In light mode, alternate sections get a very subtle background */
                padding: "0",
              }}>
              <PhaseDivider phase={phase} C={C} isDark={isDark} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 24 }}>
                {phase.courses.map((course, ci) => (
                  <CourseCard key={course.id} course={course} index={ci} C={C} isDark={isDark} />
                ))}
              </div>
            </div>
          ))}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [.22, .68, 0, 1] }}
            style={{
              padding: "56px 48px", borderRadius: 28, textAlign: "center",
              background: isDark ? `linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(29,181,132,0.04) 100%)` : `linear-gradient(135deg, #fffbf0 0%, #f0fdf8 100%)`,
              border: `1px solid ${isDark ? `rgba(201,168,76,0.16)` : `rgba(154,111,30,0.22)`}`,
              boxShadow: isDark ? "none" : "0 8px 40px rgba(154,111,30,0.08)",
            }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, color: `${C.gold}45`, marginBottom: 8, lineHeight: 1, direction: "rtl" }}>بسم الله</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, color: C.text, marginBottom: 14, letterSpacing: "-0.025em" }}>
              Prêt à commencer votre voyage ?
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: C.muted, fontSize: 16, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 32px" }}>
              Chaque cours est conçu pour vous guider pas à pas, de la première lettre au Coran complet.
            </p>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <motion.button whileHover={{ scale: 1.04, boxShadow: `0 8px 36px ${C.gold}45` }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 36px", borderRadius: 14, background: `linear-gradient(135deg, ${C.gold}, ${C.teal})`, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                S'inscrire gratuitement <BookOpen size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}