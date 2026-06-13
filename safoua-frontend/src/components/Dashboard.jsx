import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, Clock, Award, Star,
  Globe, Zap, ChevronRight, Plus, Users,
  Calendar, Video, CheckCircle, XCircle, Edit3, Trash2,
  BookMarked, ChevronDown, ChevronUp, Lock, Volume2, TrendingUp, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { api, getUser, logout } from "../utils/auth";

/* ── FONTS ─────────────────────────────────────────────────────── */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');`;

/* ── PALETTE ────────────────────────────────────────────────────── */
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
  muted:   "rgba(242,237,230,0.45)",
  dim:     "rgba(242,237,230,0.18)",
  purple:  "#9d7bea",
  blue:    "#4fadd4",
  red:     "#d4654a",
};

/* ── CONSTANTS ──────────────────────────────────────────────────── */
const ALL_COURSES = [
  {
    id: 1,
    title: "Alphabet Arabe & Phonétique",
    accent: C.teal,
    icon: "أ",
    modules: [
      {
        title: "Alphabet Arabe & Phonétique",
        lessons: [
          "Lettre Alif (ا)","Lettre Ba (ب)","Lettre Ta (ت)","Lettre Tha (ث)",
          "Lettre Jim (ج)","Lettre Ha (ح)","Lettre Kha (خ)","Lettre Dal (د)",
          "Lettre Dhal (ذ)","Lettre Ra (ر)","Lettre Zay (ز)","Lettre Sin (س)",
          "Lettre Shin (ش)","Lettre Sad (ص)","Lettre Dad (ض)","Lettre Taa (ط)",
          "Lettre Dha (ظ)","Lettre Ayn (ع)","Lettre Ghayn (غ)","Lettre Fa (ف)",
          "Lettre Qaf (ق)","Lettre Kaf (ك)","Lettre Lam (ل)","Lettre Meem (م)",
          "Lettre Nun (ن)","Lettre Ha2 (ه)","Lettre Waw (و)","Lettre Ya (ي)",
        ],
      },
      {
        title: "Atelier Écriture",
        lessons: [
          "Pratique Alif (ا)","Pratique Ba (ب)","Pratique Ta (ت)","Pratique Tha (ث)",
          "Pratique Jim (ج)","Pratique Ha (ح)","Pratique Kha (خ)","Pratique Dal (د)",
          "Pratique Dhal (ذ)","Pratique Ra (ر)","Pratique Zay (ز)","Pratique Sin (س)",
          "Pratique Shin (ش)","Pratique Sad (ص)","Pratique Dad (ض)","Pratique Taa (ط)",
          "Pratique Dha (ظ)","Pratique Ayn (ع)","Pratique Ghayn (غ)","Pratique Fa (ف)",
          "Pratique Qaf (ق)","Pratique Kaf (ك)","Pratique Lam (ل)","Pratique Meem (م)",
          "Pratique Nun (ن)","Pratique Ha2 (ه)","Pratique Waw (و)","Pratique Ya (ي)",
        ],
      },
      { title: "Quiz", lessons: ["Quiz Alphabet (10/10)"] },
    ],
  },
  {
    id: 2,
    title: "Tajwid : Récitation Sacrée",
    accent: C.purple,
    icon: "ت",
    modules: [
      {
        title: "Tajwid : Récitation Sacrée",
        lessons: [
          "La Prolongation","Le Son Nasal","L'Assimilation","Le Voilement",
          "L'Écho / Vibration","La Prononciation Claire","La Transformation","L'Arrêt",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Mémorisation : Les 10 dernières Sourates",
    accent: C.gold,
    icon: "س",
    targetLessons: 10,
    modules: [
      {
        title: "Sourates",
        lessons: [
          "Sourate 105 : Al-Fil","Sourate 106 : Quraysh","Sourate 107 : Al-Ma'un",
          "Sourate 108 : Al-Kawthar","Sourate 109 : Al-Kafirun","Sourate 110 : An-Nasr",
          "Sourate 111 : Al-Masad","Sourate 112 : Al-Ikhlas","Sourate 113 : Al-Falaq",
          "Sourate 114 : An-Nas",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Grammaire : Tome 1 de Médine",
    accent: C.blue,
    icon: "ن",
    modules: [
      {
        title: "Grammaire : Tome 1 de Médine",
        lessons: [
          "Leçon 1 : Les noms (Ism)","Leçon 2 : Les pronoms","Leçon 3 : Le genre grammatical",
          "Leçon 4 : L'article défini","Leçon 5 : Les adjectifs","Leçon 6 : L'accord",
          "Leçon 7 : Les prépositions","Leçon 8 : Les nombres","Leçon 9 : Le verbe au passé",
          "Leçon 10 : Le verbe au présent","Leçon 11 : La phrase nominale","Leçon 12 : La phrase verbale",
          "Leçon 13 : Le duel","Leçon 14 : Le pluriel sain","Leçon 15 : Le pluriel brisé",
          "Leçon 16 : Les cas grammaticaux","Leçon 17 : Le tanwin","Leçon 18 : Les interrogatifs",
          "Leçon 19 : Les relatifs","Leçon 20 : Les démonstratifs","Quiz Grammaire Tome 1",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Introduction au Fiqh",
    accent: C.red,
    icon: "ف",
    modules: [
      {
        title: "Introduction au Fiqh",
        lessons: ["La Purification","La Prière","La Zakat","Le Jeûne","Le Pèlerinage","Quiz Fiqh"],
      },
    ],
  },
  {
    id: 6,
    title: "Sira : Vie du Prophète ﷺ",
    accent: C.teal,
    icon: "م",
    modules: [
      {
        title: "Sira : Vie du Prophète ﷺ",
        lessons: [
          "Naissance du Prophète ﷺ","Mariage avec Khadīja","Première Révélation",
          "Début de la Prédication Publique","Hégire en Abyssinie","L'Année du Chagrin",
          "Le Voyage Nocturne","L'Hégire vers Médine","Bataille de Badr",
          "Bataille d'Uhud","Bataille du Fossé","Conquête de La Mecque",
          "Le Pèlerinage d'Adieu","Quiz Sira",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Calligraphie Arabe",
    accent: "#9d7bea",
    icon: "خ",
    modules: [
      {
        title: "Calligraphie Arabe",
        lessons: [
          "Introduction à la calligraphie","Les outils du calligraphe","Le style Naskh : bases",
          "Naskh : les lettres isolées","Naskh : les connexions","Naskh : mots et phrases",
          "Le style Thuluth : introduction","Thuluth : proportions et tracés","Thuluth : composition",
          "La mise en page islamique","Calligraphie du Basmala","Calligraphie de la Shahada",
          "Créer une œuvre complète","Quiz Calligraphie",
        ],
      },
    ],
  },
  {
    id: 8,
    title: "Devenir Musulman : Les Bases",
    accent: "#2ab89a",
    icon: "☪",
    modules: [
      {
        title: "Devenir Musulman : Les Bases",
        lessons: [
          "Qu'est-ce que l'Islam ?","Les 5 piliers de l'Islam","La Shahada : témoignage de foi",
          "Comment prononcer la Shahada","La Salat : la prière","Apprendre Al-Fatiha",
          "Les 5 prières quotidiennes","La purification avant la prière","Le Ramadan et le jeûne",
          "La Zakat : purification des biens","Le Hajj : le pèlerinage","La foi en Allah",
          "La foi aux anges et aux prophètes","Les livres révélés","Le Jour du Jugement",
          "Vivre en musulman au quotidien","Quiz Bases de l'Islam",
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Arabe Moderne Standard",
    accent: "#f97316",
    icon: "ع",
    modules: [
      {
        title: "Arabe Moderne Standard",
        lessons: [
          "Module 1 : Fondamentaux","Module 2 : Vocabulaire","Module 3 : Grammaire avancée",
          "Module 4 : Expression","Module 5 : Compréhension","Quiz Arabe Moderne",
        ],
      },
    ],
  },
];

const lessonKey = (courseTitle, moduleTitle, lessonTitle) =>
  `${courseTitle} — ${moduleTitle} — ${lessonTitle}`;

const totalLessons = (course) =>
  course.modules.reduce((s, m) => s + m.lessons.length, 0);

const BADGE_DEFS = [
  { icon: "🏅", label: "Première Leçon",  type: "lessons",  threshold: 1,  desc: "Terminez votre 1ère leçon"    },
  { icon: "📖", label: "Lecteur Assidu",  type: "lessons",  threshold: 5,  desc: "Terminez 5 leçons"             },
  { icon: "⭐", label: "Top Étudiant",   type: "lessons",  threshold: 15, desc: "Terminez 15 leçons"            },
  { icon: "🎓", label: "Diplômé",        type: "courses",  threshold: 9,  desc: "Terminez les 9 cours complets" },
];

const DAYS   = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const ACCENT_OPTIONS = [C.purple, C.teal, C.blue, C.gold, "#ef4444", "#ec4899"];
const EMPTY_FORM = {
  title: "", topic: "", description: "", date: "", time: "",
  duration: 60, maxStudents: 8, level: "Débutant", meetLink: "", accent: C.purple,
};

/* ── HELPERS ────────────────────────────────────────────────────── */
function pad(n) { return String(n).padStart(2, "0"); }
function toDateStr(y, m, d) { return `${y}-${pad(m)}-${pad(d)}`; }

/* ── ISLAMIC EVENTS CACHE ───────────────────────────────────────── */
const islamicEventsCache = {};

async function fetchIslamicEventsForMonth(gYear, gMonth) {
  const key = `${gYear}-${gMonth}`;
  if (islamicEventsCache[key]) return islamicEventsCache[key];

  const events = {};
  const daysInMonth = new Date(gYear, gMonth, 0).getDate();

  try {
    const promises = [];
    for (let d = 1; d <= daysInMonth; d++) {
      promises.push(
        fetch(`https://api.aladhan.com/v1/gToH/${pad(d)}-${pad(gMonth)}-${gYear}`)
          .then(r => r.json())
          .then(data => ({ d, hijri: data.data?.hijri }))
      );
    }
    const results = await Promise.all(promises);

    results.forEach(({ d, hijri }) => {
      if (!hijri) return;
      const hDay   = parseInt(hijri.day);
      const hMonth = parseInt(hijri.month.number);
      const dateStr = toDateStr(gYear, gMonth, d);

      const add = (label, type, desc) => {
        if (!events[dateStr]) events[dateStr] = [];
        events[dateStr].push({ label, type, desc });
      };

      // ── Muharram ────────────────────────────────────────────────
      if (hMonth === 1 && hDay === 1)
        add("Nouvel An Hégirien", "special", "1 Muharram — Nouvel An Islamique");
      if (hMonth === 1 && hDay === 9)
        add("Tassua", "sunnah", "9 Muharram — jeûne sunnah avant Achoura");
      if (hMonth === 1 && hDay === 10)
        add("Achoura", "fast", "10 Muharram — jeûne expiatoire (2 ans de péchés effacés)");

      // ── Rajab ───────────────────────────────────────────────────
      if (hMonth === 7 && hDay === 27)
        add("Isra' & Mi'raj", "special", "27 Rajab — Voyage nocturne du Prophète ﷺ");

      // ── Sha'ban ─────────────────────────────────────────────────
      if (hMonth === 8 && hDay === 15)
        add("Laylat al-Barâ'a", "special", "15 Sha'ban — Nuit du pardon et de la destinée");

      // ── Ramadan ─────────────────────────────────────────────────
      if (hMonth === 9) {
        if (hDay === 1)
          add("Ramadan", "ramadan", "1 Ramadan — début du jeûne obligatoire 🌙");
        else if (hDay === 27)
          add("Laylat al-Qadr", "laylatul", "27 Ramadan — Nuit du Destin ✨ (meilleure des nuits)");
        else
          add("Ramadan", "ramadan", `${hDay} Ramadan — jeûne obligatoire`);
      }

      // ── Shawwal ─────────────────────────────────────────────────
      if (hMonth === 10 && hDay === 1)
        add("Aïd el-Fitr", "eid", "1 Shawwal — fête de la rupture du jeûne 🌙");
      if (hMonth === 10 && hDay >= 2 && hDay <= 7)
        add("Jeûne Shawwal", "fast", `${hDay - 1}/6 — jeûne de Shawwal (équivaut à jeûner une année entière)`);

      // ── Dhul Hijja ──────────────────────────────────────────────
      if (hMonth === 12 && hDay >= 1 && hDay <= 8)
        add("10 jours Dhul Hijja", "special", `${hDay} Dhul Hijja — parmi les meilleurs jours de l'année`);
      if (hMonth === 12 && hDay === 9)
        add("Jour d'Arafah", "arafah", "9 Dhul Hijja — jeûne efface 2 ans de péchés 🤲");
      if (hMonth === 12 && hDay === 10)
        add("Aïd el-Adha", "eid", "10 Dhul Hijja — fête du sacrifice 🐑");
      if (hMonth === 12 && hDay >= 11 && hDay <= 13)
        add("Ayyam al-Tashriq", "special", `${hDay} Dhul Hijja — jours de célébration (jeûne interdit)`);

      // ── Ayyam al-Bidh — 13, 14, 15 of every month ──────────────
      if ([13, 14, 15].includes(hDay)) {
        const ordinal = { 13: "13ème", 14: "14ème", 15: "15ème" }[hDay];
        add("Ayyam al-Bidh", "sunnah", `${ordinal} jour lunaire — jeûne des nuits blanches`);
      }
    });

    islamicEventsCache[key] = events;
    return events;
  } catch (err) {
    console.warn("[IslamicCalendar] API fetch failed:", err.message);
    islamicEventsCache[key] = {};
    return {};
  }
}

/* ── EVENT TYPE CONFIG ──────────────────────────────────────────── */
const EVENT_TYPES = {
  eid:      { color: "#c9a84c", bg: "rgba(201,168,76,0.22)",  dot: "#c9a84c",  border: "rgba(201,168,76,0.5)"  },
  ramadan:  { color: "#25d4a0", bg: "rgba(29,181,132,0.18)",  dot: "#1db584",  border: "rgba(29,181,132,0.4)"  },
  laylatul: { color: "#e8c97a", bg: "rgba(232,201,122,0.28)", dot: "#e8c97a",  border: "rgba(232,201,122,0.6)" },
  arafah:   { color: "#9d7bea", bg: "rgba(157,123,234,0.22)", dot: "#9d7bea",  border: "rgba(157,123,234,0.5)" },
  fast:     { color: "#4fadd4", bg: "rgba(79,173,212,0.15)",  dot: "#4fadd4",  border: "rgba(79,173,212,0.35)" },
  sunnah:   { color: "#9d7bea", bg: "rgba(157,123,234,0.12)", dot: "#9d7bea",  border: "rgba(157,123,234,0.3)" },
  special:  { color: "#f97316", bg: "rgba(249,115,22,0.13)",  dot: "#f97316",  border: "rgba(249,115,22,0.35)" },
};

const LEGEND = [
  { type: "eid",      label: "Aïd" },
  { type: "ramadan",  label: "Ramadan" },
  { type: "laylatul", label: "Laylat al-Qadr" },
  { type: "arafah",   label: "Arafah" },
  { type: "fast",     label: "Jeûne recommandé" },
  { type: "sunnah",   label: "Sunnah" },
  { type: "special",  label: "Jour spécial" },
];

/* ── AMBIENT ORBS ───────────────────────────────────────────────── */
function AmbientOrbs({ roleColor }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "-10%", right: "5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle,${roleColor}08 0%,transparent 65%)`, filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ x: [0, -25, 20, 0], y: [0, 30, -15, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{ position: "absolute", bottom: "5%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,181,132,0.05) 0%,transparent 65%)", filter: "blur(60px)" }}
      />
    </div>
  );
}

function GridLines() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
      backgroundSize: "88px 88px", opacity: 0.5 }}
    />
  );
}

function NoiseOverlay() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2, opacity: 0.028, mixBlendMode: "overlay" }} xmlns="http://www.w3.org/2000/svg">
      <filter id="dashNoise"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#dashNoise)"/>
    </svg>
  );
}

function Pill({ children, color = C.teal }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", background: `${color}20`, color, border: `1px solid ${color}40`, fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </span>
  );
}

function GlassCard({ children, style = {}, accent }) {
  return (
    <div style={{
      background: "rgba(17,24,32,0.85)",
      backdropFilter: "blur(20px)",
      border: `1px solid ${accent ? accent + "20" : C.border}`,
      borderRadius: 24, padding: 22,
      boxShadow: accent ? `0 0 0 1px ${accent}08` : "none",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, icon, color = C.teal }) {
  return (
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, letterSpacing: "-0.01em" }}>
      {icon && <span style={{ color }}>{icon}</span>}
      {children}
    </h2>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 13px", borderRadius: 11,
  border: `1.5px solid ${C.border}`,
  background: "rgba(255,255,255,0.04)", color: C.text,
  fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box", transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block", fontSize: 10, fontWeight: 700,
  color: C.muted, textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif",
};

function Field({ label, value, onChange, type = "text", placeholder = "", textarea = false }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={e => e.target.style.borderColor = C.teal}
            onBlur={e => e.target.style.borderColor = C.border} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = C.teal}
            onBlur={e => e.target.style.borderColor = C.border} />
      }
    </div>
  );
}

function CircleProgress({ pct, accent, size = 64, strokeWidth = 5 }) {
  const r    = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={accent} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.7s ease" }} />
    </svg>
  );
}

function CourseProgressCard({ course, completedLessons, index }) {
  const [expanded, setExpanded] = useState(false);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const doneSet = new Set(completedLessons);

  const courseDone = course.targetLessons
    ? Math.min(
        completedLessons.filter(l => l.startsWith(course.title + " —")).length,
        course.targetLessons
      )
    : course.modules.reduce((sum, mod) =>
        sum + mod.lessons.filter(l => doneSet.has(lessonKey(course.title, mod.title, l))).length, 0);
  const courseTotal = course.targetLessons ?? totalLessons(course);
  const pct         = courseTotal > 0 ? Math.min(Math.round((courseDone / courseTotal) * 100), 100) : 0;
  const isComplete  = pct === 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [.22, .68, 0, 1] }}
      style={{
        borderRadius: 20, overflow: "hidden",
        background: C.card,
        border: `1px solid ${isComplete ? course.accent + "40" : C.border}`,
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      whileHover={{ y: -3, boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${course.accent}18` }}
    >
      <div style={{ height: 2, background: course.accent, opacity: isComplete ? 1 : 0.6 }} />
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <CircleProgress pct={pct} accent={course.accent} size={62} strokeWidth={4} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: course.accent, fontFamily: "'DM Sans', sans-serif" }}>
              {pct}%
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: course.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", flexShrink: 0, fontFamily: "'Cormorant Garamond', serif" }}>
                {course.icon}
              </span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: C.text, fontSize: 14, lineHeight: 1.3 }}>
                {course.title}
              </p>
            </div>
            <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>
              {courseDone} / {courseTotal} leçons
              {isComplete && <span style={{ color: C.teal, marginLeft: 8 }}>✓ Complet !</span>}
            </p>
            <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.07)" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: course.accent, transition: "width 0.6s ease" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
            <Link to={`/course-view/${course.id}`} style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 0 16px ${course.accent}40` }}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", borderRadius: 10, background: `${course.accent}18`, color: course.accent, border: `1px solid ${course.accent}35`, fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {isComplete ? "Revoir" : "Continuer"} <ChevronRight size={11} />
              </motion.button>
            </Link>
            {course.modules.length > 1 && (
              <button onClick={() => setExpanded(p => !p)}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: C.dim, fontSize: 10, fontWeight: 600, padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {expanded ? "Masquer" : "Modules"}
              </button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {expanded && course.modules.length > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                {course.modules.map((mod, i) => {
                  const modDone = mod.lessons.filter(l => doneSet.has(lessonKey(course.title, mod.title, l))).length;
                  const modPct  = mod.lessons.length > 0 ? Math.round((modDone / mod.lessons.length) * 100) : 0;
                  const modOk   = modPct === 100;
                  return (
                    <div key={i} style={{ padding: "9px 12px", borderRadius: 11, background: modOk ? `${course.accent}10` : "rgba(255,255,255,0.02)", border: `1px solid ${modOk ? course.accent + "28" : "rgba(255,255,255,0.05)"}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: modOk ? course.accent : C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                          {modOk ? "✓ " : ""}{mod.title}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.dim, fontFamily: "'DM Sans', sans-serif" }}>{modDone}/{mod.lessons.length}</span>
                      </div>
                      <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)" }}>
                        <div style={{ width: `${modPct}%`, height: "100%", borderRadius: 99, background: modOk ? course.accent : `${course.accent}80`, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function OverallProgress({ completedLessons }) {
  const totalAll = ALL_COURSES.reduce((s, c) => s + totalLessons(c), 0);
  const doneAll  = completedLessons.length;
  const pct      = totalAll > 0 ? Math.min(Math.round((doneAll / totalAll) * 100), 100) : 0;

  return (
    <GlassCard style={{ padding: "18px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={15} color={C.teal} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>Progression globale</span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, background: `linear-gradient(135deg,${C.goldL},${C.tealL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {pct}%
        </motion.span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", marginBottom: 10, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [.22, .68, 0, 1], delay: 0.3 }}
          style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${C.teal}, ${C.blue})` }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
          {doneAll} leçon{doneAll !== 1 ? "s" : ""} terminée{doneAll !== 1 ? "s" : ""}
        </span>
        <span style={{ fontSize: 11, color: C.dim, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
          {totalAll} au total
        </span>
      </div>
    </GlassCard>
  );
}

/* ── MINI CALENDAR ──────────────────────────────────────────────── */
function MiniCalendar({ sessions, roleColor }) {
  const now   = new Date();
  const [year, setYear]                   = useState(now.getFullYear());
  const [month, setMonth]                 = useState(now.getMonth());
  const [tooltip, setTooltip]             = useState(null);
  const [islamicEvents, setIslamicEvents] = useState({});
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    setLoadingEvents(true);
    setTooltip(null);
    fetchIslamicEventsForMonth(year, month + 1)
      .then(evts => {
        setIslamicEvents(evts);
        setLoadingEvents(false);
      });
  }, [year, month]);

  const firstDay    = new Date(year, month, 1).getDay();
  const offset      = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sessionDates = new Set(
    sessions.filter(s => s.status !== "past").map(s => s.date)
  );

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const PRIORITY = ["eid", "laylatul", "arafah", "ramadan", "fast", "sunnah", "special"];

  const getDayStyle = (d) => {
    const key        = toDateStr(year, month + 1, d);
    const evts       = islamicEvents[key] || [];
    const hasSession = sessionDates.has(key);
    const isToday    = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();

    if (isToday) return { bg: roleColor, text: "#fff", border: "transparent", isToday: true };

    const topType = PRIORITY.find(t => evts.some(e => e.type === t));
    if (topType) {
      const cfg = EVENT_TYPES[topType];
      return { bg: cfg.bg, text: cfg.color, border: cfg.border, topType, hasSession, evts };
    }
    if (hasSession) return { bg: "rgba(157,123,234,0.1)", text: C.purple, border: "rgba(157,123,234,0.3)", hasSession };
    return { bg: "transparent", text: C.dim, border: "transparent" };
  };

  return (
    <div>
      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "2px 6px" }}>‹</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: C.text }}>
            {MONTHS[month]} {year}
          </span>
          {loadingEvents && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Sparkles size={10} color={C.gold} />
            </motion.div>
          )}
        </div>
        <button onClick={nextMonth} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "2px 6px" }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: C.dim, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const ds = getDayStyle(d);
          return (
            <div
              key={i}
              onClick={() => ds.evts?.length ? setTooltip(tooltip?.day === d ? null : { day: d, events: ds.evts }) : null}
              style={{
                aspectRatio: "1",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 7, position: "relative",
                background: ds.bg,
                border: `1px solid ${ds.border}`,
                cursor: ds.evts?.length ? "pointer" : "default",
                transition: "all 0.15s",
                opacity: loadingEvents ? 0.5 : 1,
              }}
            >
              <span style={{
                fontSize: 11,
                fontWeight: ds.isToday || ds.topType || ds.hasSession ? 900 : 400,
                color: ds.text,
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1,
              }}>
                {d}
              </span>
              {!ds.isToday && (ds.topType || ds.hasSession) && (
                <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2 }}>
                  {ds.topType && <div style={{ width: 3, height: 3, borderRadius: "50%", background: EVENT_TYPES[ds.topType]?.dot }} />}
                  {ds.hasSession && <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.purple }} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: 10, borderRadius: 12,
              background: C.surface,
              border: `1px solid ${C.border}`,
              padding: "10px 12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, fontFamily: "'DM Sans', sans-serif", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {pad(tooltip.day)} {MONTHS[month]} {year}
            </div>
            {tooltip.events.map((ev, i) => {
              const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.special;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < tooltip.events.length - 1 ? 7 : 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{ev.label}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4, marginTop: 1 }}>{ev.desc}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: "5px 10px" }}>
        {LEGEND.map(({ type, label }) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: EVENT_TYPES[type].dot, flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: C.dim, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SESSION CARD ───────────────────────────────────────────────── */
function SessionCard({ session, currentUsername, role, onBook, onCancel, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const isEnrolled = session.enrolledStudents?.includes(currentUsername);
  const isFull     = session.enrolledStudents?.length >= session.maxStudents;
  const spotsLeft  = session.maxStudents - (session.enrolledStudents?.length || 0);
  const isPast     = session.status === "past";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: `0 16px 48px rgba(0,0,0,0.35)` }}
      style={{ borderRadius: 20, overflow: "hidden", background: C.card, border: `1px solid ${isEnrolled ? session.accent + "40" : C.border}`, transition: "border-color 0.3s" }}
    >
      <div style={{ height: 2, background: isPast ? "rgba(100,116,139,0.3)" : session.accent, opacity: isPast ? 0.4 : 1 }} />
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 7, flexWrap: "wrap" }}>
              <Pill color={isPast ? C.dim : session.accent}>{session.topic}</Pill>
              {isEnrolled && !isPast && <Pill color={C.teal}>✓ Inscrit</Pill>}
              {isPast && <Pill color={C.dim}>Terminé</Pill>}
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: isPast ? C.muted : C.text, lineHeight: 1.3, marginBottom: 8 }}>{session.title}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: session.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff", fontFamily: "'Cormorant Garamond', serif" }}>
                {session.teacherAvatar}
              </div>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{session.teacher}</span>
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ background: isPast ? "rgba(100,116,139,0.08)" : `${session.accent}14`, border: `1px solid ${isPast ? "rgba(100,116,139,0.12)" : session.accent + "28"}`, borderRadius: 14, padding: "8px 12px", minWidth: 66 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: isPast ? C.dim : session.accent, lineHeight: 1 }}>{session.date?.split("-")[2]}</div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{MONTHS[parseInt(session.date?.split("-")[1]) - 1]?.slice(0, 3)}</div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{session.time}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.dim, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            <Clock size={11} /> {session.duration} min
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: spotsLeft <= 2 && !isPast ? C.gold : C.dim, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            <Users size={11} /> {session.enrolledStudents?.length}/{session.maxStudents}
            {isFull && !isPast && <span style={{ color: "#ef4444" }}> · Complet</span>}
          </span>
        </div>
        {session.description && (
          <>
            <button onClick={() => setExpanded(p => !p)}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: C.dim, fontSize: 11, fontWeight: 600, padding: 0, marginBottom: expanded ? 10 : 0, fontFamily: "'DM Sans', sans-serif" }}>
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {expanded ? "Moins" : "Détails"}
            </button>
            {expanded && (
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, marginBottom: 10, padding: "10px 14px", background: "rgba(255,255,255,0.025)", borderRadius: 10, fontFamily: "'DM Sans', sans-serif" }}>
                {session.description}
              </p>
            )}
          </>
        )}
        {!isPast && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {role === "student" && (
              isEnrolled ? (
                <>
                  <a href={session.meetLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <motion.button whileHover={{ scale: 1.03 }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: C.teal, color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      <Video size={12} /> Rejoindre
                    </motion.button>
                  </a>
                  <button onClick={() => onCancel(session._id || session.id)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.18)", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    <XCircle size={12} /> Se désinscrire
                  </button>
                </>
              ) : (
                <motion.button onClick={() => onBook(session._id || session.id)} disabled={isFull}
                  whileHover={!isFull ? { scale: 1.03, boxShadow: `0 0 16px ${session.accent}35` } : {}}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: isFull ? "rgba(100,116,139,0.08)" : `${session.accent}18`, color: isFull ? C.dim : session.accent, border: `1px solid ${isFull ? "rgba(100,116,139,0.15)" : session.accent + "35"}`, fontWeight: 700, fontSize: 12, cursor: isFull ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {isFull ? <Lock size={12} /> : <CheckCircle size={12} />}
                  {isFull ? "Complet" : "Réserver ma place"}
                </motion.button>
              )
            )}
            {role === "teacher" && (
              <>
                <a href={session.meetLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <motion.button whileHover={{ scale: 1.03 }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: C.teal, color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    <Video size={12} /> Démarrer
                  </motion.button>
                </a>
                <button onClick={() => onEdit(session)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: `${C.blue}12`, color: C.blue, border: `1px solid ${C.blue}28`, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  <Edit3 size={12} /> Modifier
                </button>
                <button onClick={() => onDelete(session._id || session.id)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: "rgba(239,68,68,0.07)", color: "#f87171", border: "1px solid rgba(239,68,68,0.14)", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  <Trash2 size={12} /> Supprimer
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── SESSION MODAL ──────────────────────────────────────────────── */
function SessionModal({ initial, onSave, onClose, teacherName, teacherAvatar }) {
  const [form, setForm]     = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    if (!form.title || !form.date || !form.time || !form.topic) {
      alert("Veuillez remplir tous les champs obligatoires."); return;
    }
    setSaving(true);
    await onSave({ ...form, teacher: teacherName, teacherAvatar });
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [.22, .68, 0, 1] }}
        style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 28, padding: 32, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: C.text }}>
            {initial?._id ? "Modifier la session" : "Créer une session"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Couleur accent</label>
            <div style={{ display: "flex", gap: 8 }}>
              {ACCENT_OPTIONS.map(c => (
                <button key={c} onClick={() => f("accent", c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: form.accent === c ? "3px solid white" : "3px solid transparent", cursor: "pointer", transform: form.accent === c ? "scale(1.2)" : "none", transition: "transform 0.15s" }} />
              ))}
            </div>
          </div>
          <Field label="Titre *"     value={form.title}       onChange={v => f("title", v)}       placeholder="Ex: Tajwid — Les règles fondamentales" />
          <Field label="Sujet *"     value={form.topic}       onChange={v => f("topic", v)}       placeholder="Ex: Coran & Tajwid" />
          <Field label="Description" value={form.description} onChange={v => f("description", v)} placeholder="Décrivez le contenu de la session…" textarea />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date *"  value={form.date} onChange={v => f("date", v)} type="date" />
            <Field label="Heure *" value={form.time} onChange={v => f("time", v)} type="time" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Durée (min)"   value={form.duration}    onChange={v => f("duration",    parseInt(v) || 60)} type="number" />
            <Field label="Max étudiants" value={form.maxStudents} onChange={v => f("maxStudents", parseInt(v) || 1)}  type="number" />
          </div>
          <div>
            <label style={labelStyle}>Niveau</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Débutant","Intermédiaire","Tous niveaux"].map(l => (
                <button key={l} onClick={() => f("level", l)}
                  style={{ padding: "6px 14px", borderRadius: 10, background: form.level === l ? `${form.accent}18` : "rgba(255,255,255,0.04)", color: form.level === l ? form.accent : C.muted, border: `1px solid ${form.level === l ? form.accent + "40" : C.border}`, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Field label="Lien Meet / Zoom" value={form.meetLink} onChange={v => f("meetLink", v)} placeholder="https://meet.google.com/…" />
          <motion.button onClick={handleSave} disabled={saving}
            whileHover={!saving ? { scale: 1.02, boxShadow: `0 0 28px ${form.accent}40` } : {}}
            style={{ marginTop: 6, padding: 14, borderRadius: 14, background: `linear-gradient(135deg, ${form.accent}, ${C.teal})`, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif" }}>
            {saving ? "Enregistrement…" : (initial?._id ? "✓ Sauvegarder" : "✓ Créer la session")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── TEACHER STATS ──────────────────────────────────────────────── */
function TeacherStats({ sessions, username }) {
  const mine     = sessions.filter(s => s.teacher === username);
  const total    = mine.reduce((a, s) => a + (s.enrolledStudents?.length || 0), 0);
  const upcoming = mine.filter(s => s.status !== "past").length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {[
        { icon: <Calendar size={18}/>, label: "Sessions créées",    value: mine.length, color: C.purple },
        { icon: <Users size={18}/>,    label: "Étudiants inscrits", value: total,       color: C.teal   },
        { icon: <Video size={18}/>,    label: "À venir",            value: upcoming,    color: C.blue   },
      ].map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <GlassCard style={{ padding: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.color}18`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1 }}>{s.value}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ── STUDENT STATS ──────────────────────────────────────────────── */
function StudentStats({ sessions, username, completedCount, points }) {
  const enrolled = sessions.filter(s => s.enrolledStudents?.includes(username) && s.status !== "past").length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { icon: <BookOpen size={16}/>, label: "Cours",     value: ALL_COURSES.length, color: C.teal   },
        { icon: <Star size={16}/>,     label: "Leçons",    value: completedCount,     color: C.blue   },
        { icon: <Calendar size={16}/>, label: "Sessions",  value: enrolled,           color: C.purple },
        { icon: <Award size={16}/>,    label: "Points XP", value: points,             color: C.gold   },
      ].map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <GlassCard style={{ padding: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}18`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1 }}>{s.value}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ── BADGES PANEL ───────────────────────────────────────────────── */
function BadgesPanel({ completedCount, completedLessons }) {
  const doneSet = new Set(completedLessons);
  const coursesCompleted = ALL_COURSES.filter(course => {
    if (course.targetLessons) {
      return Math.min(
        completedLessons.filter(l => l.startsWith(course.title + " —")).length,
        course.targetLessons
      ) >= course.targetLessons;
    }
    const total = totalLessons(course);
    if (total === 0) return false;
    const done = course.modules.reduce((sum, mod) =>
      sum + mod.lessons.filter(l => doneSet.has(lessonKey(course.title, mod.title, l))).length, 0);
    return done >= total;
  }).length;

  const getCount  = (b) => b.type === "courses" ? coursesCompleted : completedCount;
  const nextBadge = BADGE_DEFS.find(b => getCount(b) < b.threshold);
  const nextCount = nextBadge ? getCount(nextBadge) : 0;
  const nextPct   = nextBadge ? Math.min(Math.round((nextCount / nextBadge.threshold) * 100), 100) : 100;

  return (
    <GlassCard>
      <SectionTitle>🏅 Badges</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {BADGE_DEFS.map((b, i) => {
          const earned = getCount(b) >= b.threshold;
          return (
            <motion.div key={i} title={b.desc}
              whileHover={earned ? { scale: 1.04 } : {}}
              style={{ textAlign: "center", padding: "12px 8px", borderRadius: 14, background: earned ? `${C.teal}10` : "rgba(255,255,255,0.02)", border: `1.5px solid ${earned ? C.teal + "28" : C.border}`, opacity: earned ? 1 : 0.45, transition: "all 0.3s" }}>
              <div style={{ fontSize: 26, marginBottom: 6, filter: earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
              <p style={{ fontSize: 10, fontWeight: 700, color: earned ? C.tealL : C.dim, lineHeight: 1.3, fontFamily: "'DM Sans', sans-serif" }}>{b.label}</p>
              {earned && <p style={{ fontSize: 9, color: C.teal, fontWeight: 600, marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>✓ Obtenu</p>}
            </motion.div>
          );
        })}
      </div>
      {nextBadge ? (
        <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: 13, padding: 12 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Prochain badge</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 9 }}>{nextBadge.icon} {nextBadge.label}</p>
          <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", marginBottom: 6 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${nextPct}%` }} transition={{ duration: 0.8, ease: [.22,.68,0,1], delay: 0.5 }}
              style={{ height: "100%", borderRadius: 99, background: C.teal }} />
          </div>
          <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{nextCount} / {nextBadge.threshold} {nextBadge.type === "courses" ? "cours terminés" : "leçons"}</p>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: C.tealL }}>🎓 Tous les badges obtenus !</p>
        </div>
      )}
    </GlassCard>
  );
}
/* ── ISLAMIC NOTIFICATIONS BELL ─────────────────────────────────── */
function IslamicNotificationsBell() {
  const [open, setOpen]       = useState(false);
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const ref                   = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const load = async () => {
      const now = new Date();
      const months = Array.from({ length: 3 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        return { y: d.getFullYear(), m: d.getMonth() + 1 };
      });
      const results = await Promise.all(months.map(({ y, m }) => fetchIslamicEventsForMonth(y, m)));
      const merged  = Object.assign({}, ...results);

      const todayStr  = toDateStr(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const cutoff    = new Date(now); cutoff.setDate(cutoff.getDate() + 90);
      const cutoffStr = toDateStr(cutoff.getFullYear(), cutoff.getMonth() + 1, cutoff.getDate());
      const PRIORITY  = ["eid", "laylatul", "arafah", "ramadan", "fast", "sunnah", "special"];

      const seen = new Set();
      const upcoming = Object.entries(merged)
        .filter(([date]) => date >= todayStr && date <= cutoffStr)
        .sort(([a], [b]) => a.localeCompare(b))
        .flatMap(([date, evts]) => {
          const diffDays = Math.round((new Date(date) - new Date(todayStr)) / 86400000);
          const topType  = PRIORITY.find(t => evts.some(e => e.type === t));
          const topEvt   = evts.find(e => e.type === topType);
          if (!topEvt) return [];
          if (seen.has(topEvt.label)) return [];
          seen.add(topEvt.label);
          return [{ date, diffDays, ...topEvt }];
        })
        .slice(0, 10);

      setEvents(upcoming);
      setLoading(false);
    };
    load();
  }, []);

  const todayCount = events.filter(e => e.diffDays === 0).length;
  const badge      = (d) => {
    if (d === 0) return { text: "Aujourd'hui", bg: `${C.teal}22`,              color: C.tealL };
    if (d === 1) return { text: "Demain",      bg: `${C.gold}18`,              color: C.goldL };
    if (d <= 7)  return { text: `Dans ${d} j`, bg: `${C.gold}14`,              color: C.gold  };
    return              { text: `Dans ${d} j`, bg: "rgba(255,255,255,0.06)",   color: C.muted };
  };

  const todayEvts = events.filter(e => e.diffDays === 0);
  const soonEvts  = events.filter(e => e.diffDays > 0 && e.diffDays <= 7);
  const laterEvts = events.filter(e => e.diffDays > 7);

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 9, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif", margin: "10px 0 4px" }}>
      {children}
    </div>
  );

  const NotifRow = ({ evt }) => {
    const cfg = EVENT_TYPES[evt.type] || EVENT_TYPES.special;
    const b   = badge(evt.diffDays);
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 3, borderRadius: 99, background: cfg.dot, alignSelf: "stretch", minHeight: 32, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>
            {evt.label}
          </div>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}>
            {evt.desc}
          </div>
          <span style={{ display: "inline-flex", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: b.bg, color: b.color, fontFamily: "'DM Sans', sans-serif" }}>
            {b.text}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell button */}
      <motion.button
        onClick={() => setOpen(p => !p)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: "relative", width: 40, height: 40, borderRadius: 12,
          background: open ? `${C.gold}18` : "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? C.gold + "40" : C.border}`,
          color: open ? C.goldL : C.muted,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
        }}
      >
        <Globe size={16} />
        {/* Red dot badge */}
        {!loading && events.length > 0 && (
          <div style={{
            position: "absolute", top: 7, right: 7,
            width: 7, height: 7, borderRadius: "50%",
            background: todayCount > 0 ? C.teal : C.gold,
            border: `1.5px solid ${C.bg}`,
          }} />
        )}
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [.22, .68, 0, 1] }}
            style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              width: 300, zIndex: 200,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Globe size={13} color={C.gold} />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: C.text }}>
                  Jours Islamiques
                </span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: `${C.gold}18`, color: C.goldL, fontFamily: "'DM Sans', sans-serif" }}>
                {events.length} à venir
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "4px 16px 14px", maxHeight: 420, overflowY: "auto" }}>
              {loading ? (
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                  style={{ textAlign: "center", padding: "24px 0", fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  Chargement…
                </motion.div>
              ) : events.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", fontSize: 12, color: C.muted, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                  Aucun événement à venir.
                </div>
              ) : (
                <>
                  {todayEvts.length > 0  && <><SectionLabel>Aujourd'hui</SectionLabel>  {todayEvts.map((e,i)  => <NotifRow key={i} evt={e} />)}</>}
                  {soonEvts.length  > 0  && <><SectionLabel>Cette semaine</SectionLabel> {soonEvts.map((e,i)   => <NotifRow key={i} evt={e} />)}</>}
                  {laterEvts.length > 0  && <><SectionLabel>Ce mois &amp; suivants</SectionLabel>{laterEvts.map((e,i) => <NotifRow key={i} evt={e} />)}</>}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [sessions, setSessions]               = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [showModal, setShowModal]             = useState(false);
  const [editTarget, setEditTarget]           = useState(null);
  const [filter, setFilter]                   = useState("all");
  const [userData, setUserData]               = useState({ username: "Utilisateur", completedLessons: [], points: 0 });
  const [userLoading, setUserLoading]         = useState(true);
  const [apiError, setApiError]               = useState("");

  const tokenUser  = getUser();
  const role       = tokenUser?.role || "student";
  const isTeacher  = role === "teacher";
  const username   = userData.username;
  const avatar     = username ? username[0].toUpperCase() : "U";
  const roleColor  = isTeacher ? C.purple : C.teal;

  const completedCount = userData.completedLessons.length;
  const points         = userData.points;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const r = await api.get("/api/me");
        setUserData({
          username:         r.data.username,
          completedLessons: r.data.completedLessons || [],
          points:           r.data.points || 0,
        });
      } catch {
        setUserData(p => ({ ...p, username: tokenUser?.username || "Utilisateur" }));
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const r = await api.get("/api/sessions");
        setSessions(r.data);
      } catch {
        setApiError("Impossible de charger les sessions.");
      } finally {
        setSessionsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleSaveSession = async (session) => {
    try {
      if (session._id) {
        const r = await api.put(`/api/sessions/${session._id}`, session);
        setSessions(prev => prev.map(s => s._id === r.data._id ? r.data : s));
      } else {
        const r = await api.post("/api/sessions", session);
        setSessions(prev => [...prev, r.data]);
      }
      setShowModal(false); setEditTarget(null);
    } catch (err) {
      alert("Erreur lors de la sauvegarde : " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Supprimer cette session ?")) return;
    try {
      await api.delete(`/api/sessions/${id}`);
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch { alert("Erreur lors de la suppression."); }
  };

  const handleBook = async (id) => {
    try {
      const r = await api.post(`/api/sessions/${id}/book`);
      setSessions(prev => prev.map(s => s._id === r.data._id ? r.data : s));
    } catch (err) { alert(err.response?.data?.error || "Erreur lors de la réservation."); }
  };

  const handleCancel = async (id) => {
    try {
      const r = await api.post(`/api/sessions/${id}/cancel`);
      setSessions(prev => prev.map(s => s._id === r.data._id ? r.data : s));
    } catch (err) { alert(err.response?.data?.error || "Erreur lors de l'annulation."); }
  };

  const filteredSessions = sessions.filter(s => {
    if (filter === "upcoming") return s.status !== "past";
    if (filter === "past")     return s.status === "past";
    if (filter === "mine")     return isTeacher ? s.teacher === username : s.enrolledStudents?.includes(username);
    return true;
  });

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", position: "relative", paddingTop: 96, paddingBottom: 80 }}>
      <style>{FONT_LINK + `
        * { box-sizing: border-box; }
        ::selection { background: rgba(201,168,76,0.22); color: #f2ede6; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
        @media (max-width: 860px) { .dash-body { grid-template-columns: 1fr !important; } }
      `}</style>

      <GridLines />
      <AmbientOrbs roleColor={roleColor} />
      <NoiseOverlay />

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 22px", position: "relative", zIndex: 3 }}>
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [.22, .68, 0, 1] }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{greeting} 👋</p>
                <Pill color={roleColor}>{isTeacher ? "Enseignant" : "Étudiant"}</Pill>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, color: C.text, lineHeight: 1.08, marginBottom: 6, letterSpacing: "-0.025em" }}>
                {userLoading ? "…" : username}
              </h1>
              <p style={{ fontSize: 13, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                {isTeacher ? "Gérez vos sessions et accompagnez vos étudiants." : "Continuez votre voyage vers la maîtrise islamique."}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
    <IslamicNotificationsBell />   {/* ← ADD THIS */}

            {isTeacher && (
              <motion.button onClick={() => { setEditTarget(null); setShowModal(true); }}
                whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${C.purple}40` }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 14, background: `linear-gradient(135deg, ${C.purple}, ${C.teal})`, color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                <Plus size={15} /> Créer une session
              </motion.button>
            )}
          </div>
        </div>

          {isTeacher
            ? <TeacherStats sessions={sessions} username={username} />
            : <StudentStats sessions={sessions} username={username} completedCount={completedCount} points={points} />
          }
        </motion.header>

        <div className="dash-body" style={{ display: "grid", gridTemplateColumns: "1fr 308px", gap: 22, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {!isTeacher && (
              <section>
                <SectionTitle icon={<TrendingUp size={16} />} color={C.teal}>Progression des Cours</SectionTitle>
                <div style={{ marginBottom: 16 }}>
                  <OverallProgress completedLessons={userData.completedLessons} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {userLoading ? (
                    <GlassCard style={{ textAlign: "center", padding: 36 }}>
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>⏳ Chargement de la progression…</p>
                      </motion.div>
                    </GlassCard>
                  ) : (
                    ALL_COURSES.map((course, idx) => (
                      <CourseProgressCard key={course.id} course={course} completedLessons={userData.completedLessons} index={idx} />
                    ))
                  )}
                </div>
              </section>
            )}

            <section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <SectionTitle icon={<Calendar size={16} />} color={roleColor}>
                  {isTeacher ? "Mes Sessions" : "Sessions Disponibles"}
                </SectionTitle>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {[
                  { key: "all",      label: "Toutes" },
                  { key: "upcoming", label: "À venir" },
                  { key: "mine",     label: isTeacher ? "Mes créations" : "Mes réservations" },
                  { key: "past",     label: "Passées" },
                ].map(({ key, label }) => (
                  <motion.button key={key} onClick={() => setFilter(key)}
                    whileHover={{ scale: 1.02 }}
                    style={{ padding: "5px 14px", borderRadius: 99, background: filter === key ? roleColor : "rgba(255,255,255,0.04)", color: filter === key ? "#fff" : C.muted, border: `1px solid ${filter === key ? roleColor : C.border}`, fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                    {label}
                  </motion.button>
                ))}
              </div>

              {apiError && (
                <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171", fontSize: 13, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
                  ⚠️ {apiError}
                </div>
              )}

              {sessionsLoading ? (
                <GlassCard style={{ textAlign: "center", padding: 48 }}>
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>⏳ Chargement des sessions…</p>
                  </motion.div>
                </GlassCard>
              ) : filteredSessions.length === 0 ? (
                <GlassCard style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: `${roleColor}20`, marginBottom: 10 }}>📭</div>
                  <p style={{ color: C.muted, fontSize: 14, fontWeight: 600, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                    {isTeacher ? "Aucune session. Créez-en une !" : "Aucune session pour ce filtre."}
                  </p>
                </GlassCard>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <AnimatePresence>
                    {filteredSessions.map(session => (
                      <SessionCard key={session._id} session={session} currentUsername={username}
                        role={role} onBook={handleBook} onCancel={handleCancel}
                        onDelete={handleDeleteSession} onEdit={s => { setEditTarget(s); setShowModal(true); }} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {isTeacher && (
              <GlassCard>
                <SectionTitle icon={<Users size={15} />} color={C.teal}>Étudiants inscrits</SectionTitle>
                {sessions.filter(s => s.teacher === username && s.status !== "past" && s.enrolledStudents?.length > 0).length === 0 ? (
                  <p style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: "12px 0", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Aucun étudiant inscrit pour l'instant.</p>
                ) : (
                  sessions.filter(s => s.teacher === username && s.status !== "past" && s.enrolledStudents?.length > 0).map(s => (
                    <div key={s._id} style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: s.accent, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {s.enrolledStudents.map(st => (
                          <div key={st} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}` }}>
                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", fontFamily: "'Cormorant Garamond', serif" }}>{st[0]?.toUpperCase()}</div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </GlassCard>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GlassCard>
              <SectionTitle icon={<Calendar size={15} />} color={roleColor}>Calendrier Islamique</SectionTitle>
              <MiniCalendar sessions={sessions} roleColor={roleColor} />
            </GlassCard>

            {!isTeacher && <BadgesPanel completedCount={completedCount} completedLessons={userData.completedLessons} />}

            <motion.div
              whileHover={{ scale: 1.01 }}
              style={{ borderRadius: 24, overflow: "hidden", background: C.card, border: `1px solid ${C.border}`, position: "relative" }}
            >
              <div style={{ height: 2, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg,${C.purple}22,${C.teal}18)`, border: `1px solid ${C.purple}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={14} color={C.purple} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: C.text }}>Tuteur IA</h3>
                </div>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>
                  Questions sur une leçon ? Notre IA vous accompagne 24h/24.
                </p>
                <motion.button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
                  whileHover={{ scale: 1.03, boxShadow: `0 0 24px ${C.purple}40` }}
                  whileTap={{ scale: 0.97 }}
                  style={{ width: "100%", background: `linear-gradient(135deg, ${C.purple}, ${C.teal})`, border: "none", borderRadius: 12, padding: "10px 0", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Démarrer une session →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <SessionModal
            initial={editTarget}
            onSave={handleSaveSession}
            onClose={() => { setShowModal(false); setEditTarget(null); }}
            teacherName={username}
            teacherAvatar={avatar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}