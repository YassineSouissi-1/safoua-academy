import React, { useState, useEffect } from "react";
import {
  BookOpen, Clock, Award, Star,
  Globe, Zap, ChevronRight, Plus, Users,
  Calendar, Video, CheckCircle, XCircle, Edit3, Trash2,
  BookMarked, ChevronDown, ChevronUp, Lock, Volume2,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const API = "http://localhost:5000";

// totalLessons: Course 1 = 7 modules × 3 lessons = 21
const RECENT_COURSES = [
  { id: 1, title: "Alphabet Arabe & Phonétique", totalLessons: 21, accent: "#10b981", icon: "أ" },
  { id: 2, title: "Tajwid : Récitation Sacrée",  totalLessons: 4,  accent: "#8b5cf6", icon: "ت" },
];

// ✅ threshold-based: earned is computed at render time from completedLessons.length
const BADGE_DEFS = [
  { icon: "🏅", label: "Première Leçon",  threshold: 1,  desc: "Terminez votre 1ère leçon"  },
  { icon: "📖", label: "Lecteur Assidu",   threshold: 5,  desc: "Terminez 5 leçons"           },
  { icon: "⭐", label: "Top Étudiant",    threshold: 15, desc: "Terminez 15 leçons"          },
  { icon: "🎓", label: "Diplômé",         threshold: 30, desc: "Terminez 30 leçons"          },
];

const DAYS   = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const levelColors = {
  "Débutant":      { text: "#93c5fd" },
  "Intermédiaire": { text: "#fbbf24" },
  "Tous niveaux":  { text: "#c4b5fd" },
};

const ACCENT_OPTIONS = ["#8b5cf6","#10b981","#0ea5e9","#f59e0b","#ef4444","#ec4899"];
const EMPTY_FORM = {
  title: "", topic: "", description: "", date: "", time: "",
  duration: 60, maxStudents: 8, level: "Débutant", meetLink: "", accent: "#8b5cf6",
};

/* ═══════════════════════════════════════════════════════════════
   SHARED UI
═══════════════════════════════════════════════════════════════ */
function Pill({ children, color = "#10b981" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: "99px",
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em",
      background: `${color}22`, color, border: `1px solid ${color}44`,
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px", padding: "20px", ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ children, icon, color = "#10b981" }) {
  return (
    <h2 style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "17px", fontWeight: 900, color: "#f1f5f9",
      marginBottom: "14px", display: "flex", alignItems: "center", gap: "7px",
    }}>
      {icon && <span style={{ color }}>{icon}</span>}
      {children}
    </h2>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 13px", borderRadius: "11px",
  border: "1.5px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)", color: "#f1f5f9",
  fontSize: "13px", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box", transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block", fontSize: "10px", fontWeight: 700,
  color: "#94a3b8", textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: "6px",
};

function Field({ label, value, onChange, type = "text", placeholder = "", textarea = false }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={e => e.target.style.borderColor = "#10b981"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}/>
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#10b981"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}/>
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MINI CALENDAR
═══════════════════════════════════════════════════════════════ */
function MiniCalendar({ sessions }) {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const firstDay    = new Date(year, month, 1).getDay();
  const offset      = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const sessionDates = new Set(sessions.filter(s => s.status !== "past").map(s => s.date));

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const pad = n => String(n).padStart(2, "0");
  const dateStr = d => `${year}-${pad(month + 1)}-${pad(d)}`;
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "18px" }}>‹</button>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "18px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "9px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const hasSession = sessionDates.has(dateStr(d));
          const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
          return (
            <div key={i} style={{
              aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "8px", position: "relative",
              background: isToday ? "#10b981" : hasSession ? "rgba(139,92,246,0.2)" : "transparent",
              border: hasSession && !isToday ? "1px solid rgba(139,92,246,0.4)" : "1px solid transparent",
            }}>
              <span style={{ fontSize: "11px", fontWeight: isToday || hasSession ? 900 : 400, color: isToday ? "#fff" : hasSession ? "#c4b5fd" : "#64748b" }}>
                {d}
              </span>
              {hasSession && !isToday && (
                <div style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: "#8b5cf6" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SESSION CARD
═══════════════════════════════════════════════════════════════ */
function SessionCard({ session, currentUsername, role, onBook, onCancel, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const isEnrolled = session.enrolledStudents?.includes(currentUsername);
  const isFull     = session.enrolledStudents?.length >= session.maxStudents;
  const spotsLeft  = session.maxStudents - (session.enrolledStudents?.length || 0);
  const isPast     = session.status === "past";
  const lvColor    = (levelColors[session.level] || levelColors["Débutant"]).text;

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${isEnrolled ? session.accent + "55" : "rgba(255,255,255,0.08)"}`,
      borderRadius: "18px", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: "3px", background: isPast ? "#334155" : session.accent, opacity: isPast ? 0.4 : 1 }} />
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
              <Pill color={isPast ? "#64748b" : session.accent}>{session.topic}</Pill>
              <Pill color={lvColor}>{session.level}</Pill>
              {isEnrolled && !isPast && <Pill color="#10b981">✓ Inscrit</Pill>}
              {isPast && <Pill color="#64748b">Terminé</Pill>}
            </div>
            <h3 style={{ fontSize: "14px", fontWeight: 900, color: isPast ? "#64748b" : "#f1f5f9", lineHeight: 1.3, marginBottom: "6px" }}>{session.title}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "7px", background: session.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 900, color: "#fff" }}>
                {session.teacherAvatar}
              </div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>{session.teacher}</span>
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ background: isPast ? "rgba(100,116,139,0.1)" : `${session.accent}18`, border: `1px solid ${isPast ? "rgba(100,116,139,0.15)" : session.accent + "33"}`, borderRadius: "12px", padding: "8px 12px", minWidth: "64px" }}>
              <div style={{ fontSize: "18px", fontWeight: 900, color: isPast ? "#475569" : session.accent, lineHeight: 1 }}>{session.date?.split("-")[2]}</div>
              <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>{MONTHS[parseInt(session.date?.split("-")[1]) - 1]?.slice(0,3)}</div>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>{session.time}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
            <Clock size={11} /> {session.duration} min
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: spotsLeft <= 2 && !isPast ? "#f59e0b" : "#64748b", fontWeight: 600 }}>
            <Users size={11} /> {session.enrolledStudents?.length}/{session.maxStudents}
            {spotsLeft <= 2 && !isPast && spotsLeft > 0 && <span style={{ color: "#f59e0b" }}> · {spotsLeft} place{spotsLeft > 1 ? "s" : ""}</span>}
            {isFull && !isPast && <span style={{ color: "#ef4444" }}> · Complet</span>}
          </span>
        </div>

        {session.description && (
          <>
            <button onClick={() => setExpanded(p => !p)}
              style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "11px", fontWeight: 600, padding: 0, marginBottom: expanded ? "10px" : 0 }}>
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {expanded ? "Moins" : "Détails"}
            </button>
            {expanded && (
              <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "10px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "10px" }}>
                {session.description}
              </p>
            )}
          </>
        )}

        {!isPast && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
            {role === "student" && (
              isEnrolled ? (
                <>
                  <a href={session.meetLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", borderRadius: "10px", background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                      <Video size={12} /> Rejoindre
                    </button>
                  </a>
                  <button onClick={() => onCancel(session._id || session.id)}
                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                    <XCircle size={12} /> Se désinscrire
                  </button>
                </>
              ) : (
                <button onClick={() => onBook(session._id || session.id)} disabled={isFull}
                  style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", borderRadius: "10px", background: isFull ? "rgba(100,116,139,0.1)" : `${session.accent}22`, color: isFull ? "#475569" : session.accent, border: `1px solid ${isFull ? "rgba(100,116,139,0.2)" : session.accent + "44"}`, fontWeight: 700, fontSize: "12px", cursor: isFull ? "not-allowed" : "pointer" }}>
                  {isFull ? <Lock size={12} /> : <CheckCircle size={12} />}
                  {isFull ? "Complet" : "Réserver ma place"}
                </button>
              )
            )}
            {role === "teacher" && (
              <>
                <a href={session.meetLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", borderRadius: "10px", background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                    <Video size={12} /> Démarrer
                  </button>
                </a>
                <button onClick={() => onEdit(session)}
                  style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", borderRadius: "10px", background: "rgba(14,165,233,0.1)", color: "#38bdf8", border: "1px solid rgba(14,165,233,0.2)", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                  <Edit3 size={12} /> Modifier
                </button>
                <button onClick={() => onDelete(session._id || session.id)}
                  style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                  <Trash2 size={12} /> Supprimer
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SESSION MODAL
═══════════════════════════════════════════════════════════════ */
function SessionModal({ initial, onSave, onClose, teacherName, teacherAvatar }) {
  const [form, setForm]     = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    if (!form.title || !form.date || !form.time || !form.topic) {
      alert("Veuillez remplir tous les champs obligatoires (titre, sujet, date, heure)."); return;
    }
    setSaving(true);
    await onSave({ ...form, teacher: teacherName, teacherAvatar });
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", padding: "28px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "19px", fontWeight: 900, color: "#f1f5f9" }}>
            {initial?._id ? "Modifier la session" : "Créer une session"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Couleur</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {ACCENT_OPTIONS.map(c => (
                <button key={c} onClick={() => f("accent", c)} style={{ width: "26px", height: "26px", borderRadius: "50%", background: c, border: form.accent === c ? "3px solid white" : "3px solid transparent", cursor: "pointer", transform: form.accent === c ? "scale(1.2)" : "none", transition: "transform 0.15s" }} />
              ))}
            </div>
          </div>
          <Field label="Titre *"     value={form.title}       onChange={v => f("title", v)}       placeholder="Ex: Tajwid — Règles de la Noon Sakinah" />
          <Field label="Sujet *"     value={form.topic}       onChange={v => f("topic", v)}       placeholder="Ex: Coran & Tajwid" />
          <Field label="Description" value={form.description} onChange={v => f("description", v)} placeholder="Décrivez le contenu..." textarea />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Date *"  value={form.date} onChange={v => f("date", v)} type="date" />
            <Field label="Heure *" value={form.time} onChange={v => f("time", v)} type="time" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Durée (min)"   value={form.duration}    onChange={v => f("duration",    parseInt(v) || 60)} type="number" />
            <Field label="Max étudiants" value={form.maxStudents} onChange={v => f("maxStudents", parseInt(v) || 1)}  type="number" />
          </div>
          <div>
            <label style={labelStyle}>Niveau</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Débutant","Intermédiaire","Tous niveaux"].map(l => (
                <button key={l} onClick={() => f("level", l)} style={{ padding: "6px 12px", borderRadius: "10px", background: form.level === l ? `${form.accent}22` : "rgba(255,255,255,0.04)", color: form.level === l ? form.accent : "#64748b", border: `1px solid ${form.level === l ? form.accent + "55" : "rgba(255,255,255,0.08)"}`, fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Field label="Lien Meet / Zoom" value={form.meetLink} onChange={v => f("meetLink", v)} placeholder="https://meet.google.com/..." />
          <button onClick={handleSave} disabled={saving}
            style={{ marginTop: "6px", padding: "13px", borderRadius: "14px", background: form.accent, color: "#fff", border: "none", fontWeight: 900, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "inherit" }}>
            {saving ? "Enregistrement..." : (initial?._id ? "✓ Sauvegarder" : "✓ Créer la session")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STAT GRIDS
═══════════════════════════════════════════════════════════════ */
function TeacherStats({ sessions, username }) {
  const mine     = sessions.filter(s => s.teacher === username);
  const total    = mine.reduce((a, s) => a + (s.enrolledStudents?.length || 0), 0);
  const upcoming = mine.filter(s => s.status !== "past").length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
      {[
        { icon: <Calendar size={18}/>, label: "Sessions créées",    value: mine.length, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
        { icon: <Users size={18}/>,    label: "Étudiants inscrits", value: total,       color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
        { icon: <Video size={18}/>,    label: "À venir",            value: upcoming,    color: "#0ea5e9", bg: "rgba(14,165,233,0.12)"  },
      ].map((s, i) => (
        <Card key={i} style={{ padding: "14px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>{s.icon}</div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{s.label}</div>
          <div style={{ fontSize: "22px", fontWeight: 900, color: "#f1f5f9", lineHeight: 1 }}>{s.value}</div>
        </Card>
      ))}
    </div>
  );
}

// ✅ completedCount and points now come from real MongoDB data
function StudentStats({ sessions, username, completedCount, points }) {
  const enrolled = sessions.filter(s => s.enrolledStudents?.includes(username) && s.status !== "past").length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
      {[
        { icon: <BookOpen size={16}/>, label: "Cours actifs",       value: RECENT_COURSES.length, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
        { icon: <Star size={16}/>,     label: "Leçons terminées",   value: completedCount,         color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
        { icon: <Calendar size={16}/>, label: "Sessions réservées", value: enrolled,               color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
        { icon: <Award size={16}/>,    label: "Points XP",          value: points,                 color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
      ].map((s, i) => (
        <Card key={i} style={{ padding: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "7px" }}>{s.icon}</div>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{s.label}</div>
          <div style={{ fontSize: "18px", fontWeight: 900, color: "#f1f5f9", lineHeight: 1 }}>{s.value}</div>
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DICTIONARY WIDGET
═══════════════════════════════════════════════════════════════ */
function DictionaryWidget() {
  const [term, setTerm]       = useState("");
  const [lang, setLang]       = useState("french");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSearch = async e => {
    e.preventDefault();
    if (!term.trim()) { setError("Veuillez entrer un mot."); return; }
    setLoading(true); setError(""); setResults(null);
    try {
      const r = await axios.get(`${API}/api/dictionary/translate`, { params: { word: term.trim(), language: lang } });
      if (r.data.success) setResults(r.data);
      else setError(r.data.message || "Mot introuvable.");
    } catch { setError("Erreur de connexion."); }
    finally { setLoading(false); }
  };

  const speak = w => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(w);
    u.lang = "ar-SA"; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  return (
    <Card>
      <SectionTitle icon={<Globe size={15}/>}>Traducteur Arabe</SectionTitle>
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {[{ code: "french", flag: "🇫🇷", label: "Français" }, { code: "english", flag: "🇬🇧", label: "English" }].map(l => (
          <button key={l.code} onClick={() => { setLang(l.code); setResults(null); setTerm(""); }}
            style={{ padding: "6px 12px", borderRadius: "9px", fontWeight: 700, fontSize: "11px", border: "none", cursor: "pointer", background: lang === l.code ? "#10b981" : "rgba(255,255,255,0.06)", color: lang === l.code ? "#fff" : "#64748b" }}>
            {l.flag} {l.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "7px", marginBottom: "10px" }}>
        <input type="text" value={term} onChange={e => setTerm(e.target.value)}
          placeholder={lang === "french" ? "paix, bonjour..." : "peace, hello..."}
          style={{ ...inputStyle, flex: 1 }}
          onFocus={e => e.target.style.borderColor = "#10b981"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}/>
        <button type="submit" disabled={loading}
          style={{ padding: "9px 14px", borderRadius: "10px", background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
          {loading ? "..." : "→"}
        </button>
      </form>
      {error && <div style={{ padding: "8px 12px", borderRadius: "9px", background: "rgba(239,68,68,0.1)", color: "#f87171", fontSize: "12px", marginBottom: "8px" }}>{error}</div>}
      {results ? (
        <div style={{ padding: "14px", borderRadius: "13px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "38px", fontFamily: "serif", color: "#34d399", fontWeight: 900 }}>{results.arabic}</span>
            <button onClick={() => speak(results.arabic)} style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "none", borderRadius: "9px", padding: "8px", cursor: "pointer" }}>
              <Volume2 size={16}/>
            </button>
          </div>
          <p style={{ fontSize: "10px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Prononciation</p>
          <p style={{ fontWeight: 700, fontStyle: "italic", color: "#6ee7b7", fontSize: "13px" }}>{results.pronunciation}</p>
        </div>
      ) : !loading && !error && (
        <div style={{ textAlign: "center", padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px" }}>
          <Globe size={24} style={{ margin: "0 auto 6px", color: "#334155" }}/>
          <p style={{ color: "#475569", fontSize: "12px" }}>Entrez un mot pour le traduire ✨</p>
        </div>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [sessions, setSessions]               = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [showModal, setShowModal]             = useState(false);
  const [editTarget, setEditTarget]           = useState(null);
  const [filter, setFilter]                   = useState("all");
  const [userData, setUserData]               = useState({ username: "Utilisateur", completedLessons: [], points: 0 });
  const [userLoading, setUserLoading]         = useState(true);
  const [apiError, setApiError]               = useState("");

  const role      = localStorage.getItem("userRole") || "student";
  const isTeacher = role === "teacher";
  const username  = userData.username;
  const avatar    = username ? username[0].toUpperCase() : "U";
  const roleColor = isTeacher ? "#8b5cf6" : "#10b981";

  // ✅ derived from real DB data — no hardcoded values
  const completedCount = userData.completedLessons.length;
  const points         = userData.points;

  // ✅ progress bar per course: counts completed lessons whose key starts with that course title
  const getCourseProgress = (courseTitle, totalLessons) => {
    if (!completedCount) return 0;
    const done = userData.completedLessons.filter(k => k.startsWith(courseTitle + " —")).length;
    return Math.min(Math.round((done / totalLessons) * 100), 100);
  };

  // ✅ next badge to unlock — first one whose threshold hasn't been reached yet
  const nextBadge         = BADGE_DEFS.find(b => completedCount < b.threshold);
  const nextBadgeProgress = nextBadge
    ? Math.min(Math.round((completedCount / nextBadge.threshold) * 100), 100)
    : 100;

  /* ── Fetch user from MongoDB ── */
  useEffect(() => {
    const fetchUser = async () => {
      const email      = localStorage.getItem("userEmail");
      const storedName = localStorage.getItem("username");
      if (email) {
        try {
          const r = await axios.get(`${API}/api/user/${email}`);
          setUserData({
            username:         r.data.username || storedName,
            completedLessons: r.data.completedLessons || [],
            points:           r.data.points || 0,
          });
        } catch {
          setUserData(p => ({ ...p, username: storedName || "Utilisateur" }));
        }
      } else {
        setUserData(p => ({ ...p, username: storedName || "Utilisateur" }));
      }
      setUserLoading(false);
    };
    fetchUser();
  }, []);

  /* ── Fetch sessions ── */
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const r = await axios.get(`${API}/api/sessions`);
        setSessions(r.data);
      } catch (err) {
        setApiError("Impossible de charger les sessions. Vérifiez que le serveur tourne.");
      } finally {
        setSessionsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleSaveSession = async (session) => {
    try {
      if (session._id) {
        const r = await axios.put(`${API}/api/sessions/${session._id}`, session);
        setSessions(prev => prev.map(s => s._id === r.data._id ? r.data : s));
      } else {
        const r = await axios.post(`${API}/api/sessions`, session);
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
      await axios.delete(`${API}/api/sessions/${id}`);
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch (err) { alert("Erreur lors de la suppression."); }
  };

  const handleBook = async (id) => {
    try {
      const r = await axios.post(`${API}/api/sessions/${id}/book`, { username });
      setSessions(prev => prev.map(s => s._id === r.data._id ? r.data : s));
    } catch (err) { alert(err.response?.data?.error || "Erreur lors de la réservation."); }
  };

  const handleCancel = async (id) => {
    try {
      const r = await axios.post(`${API}/api/sessions/${id}/cancel`, { username });
      setSessions(prev => prev.map(s => s._id === r.data._id ? r.data : s));
    } catch (err) { alert(err.response?.data?.error || "Erreur lors de l'annulation."); }
  };

  const handleEdit = session => { setEditTarget(session); setShowModal(true); };

  const filteredSessions = sessions.filter(s => {
    if (filter === "upcoming") return s.status !== "past";
    if (filter === "past")     return s.status === "past";
    if (filter === "mine")     return isTeacher ? s.teacher === username : s.enrolledStudents?.includes(username);
    return true;
  });

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #0a1628 0%, #0d1f38 40%, #071a12 100%)",
      fontFamily: "system-ui, sans-serif",
      paddingTop: "88px", paddingBottom: "60px",
    }}>
      <div style={{ position: "fixed", top: "10%", right: "5%", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${roleColor}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "15%", left: "0", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>

        {/* ── HEADER ── */}
        <header style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>{greeting} 👋</p>
                <Pill color={roleColor}>{isTeacher ? "Enseignant" : "Étudiant"}</Pill>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, color: "#f1f5f9", lineHeight: 1.1, marginBottom: "4px" }}>
                {userLoading ? "..." : username}
              </h1>
              <p style={{ fontSize: "13px", color: "#475569" }}>
                {isTeacher ? "Gérez vos sessions et accompagnez vos étudiants." : "Continuez votre voyage vers la maîtrise islamique."}
              </p>
            </div>
            {isTeacher && (
              <button onClick={() => { setEditTarget(null); setShowModal(true); }}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px", borderRadius: "14px", background: "#8b5cf6", color: "#fff", border: "none", fontWeight: 900, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 20px rgba(139,92,246,0.35)", flexShrink: 0 }}>
                <Plus size={16}/> Créer une session
              </button>
            )}
          </div>

          {isTeacher
            ? <TeacherStats sessions={sessions} username={username}/>
            : <StudentStats sessions={sessions} username={username} completedCount={completedCount} points={points}/>
          }
        </header>

        {/* ── BODY ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Sessions */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <SectionTitle icon={<Calendar size={16}/>} color={roleColor}>
                  {isTeacher ? "Mes Sessions" : "Sessions Disponibles"}
                </SectionTitle>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                {[
                  { key: "all",      label: "Toutes" },
                  { key: "upcoming", label: "À venir" },
                  { key: "mine",     label: isTeacher ? "Mes créations" : "Mes réservations" },
                  { key: "past",     label: "Passées" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setFilter(key)}
                    style={{ padding: "5px 13px", borderRadius: "99px", background: filter === key ? roleColor : "rgba(255,255,255,0.04)", color: filter === key ? "#fff" : "#64748b", border: `1px solid ${filter === key ? roleColor : "rgba(255,255,255,0.08)"}`, fontWeight: 700, fontSize: "11px", cursor: "pointer", transition: "all 0.15s" }}>
                    {label}
                  </button>
                ))}
              </div>

              {apiError && (
                <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>
                  ⚠️ {apiError}
                </div>
              )}

              {sessionsLoading ? (
                <Card style={{ textAlign: "center", padding: "36px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏳</div>
                  <p style={{ color: "#475569", fontSize: "13px" }}>Chargement des sessions...</p>
                </Card>
              ) : filteredSessions.length === 0 ? (
                <Card style={{ textAlign: "center", padding: "36px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
                  <p style={{ color: "#475569", fontSize: "13px", fontWeight: 600 }}>
                    {isTeacher ? "Aucune session. Créez-en une !" : "Aucune session pour ce filtre."}
                  </p>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredSessions.map(session => (
                    <SessionCard key={session._id} session={session} currentUsername={username}
                      role={role} onBook={handleBook} onCancel={handleCancel}
                      onDelete={handleDeleteSession} onEdit={handleEdit}/>
                  ))}
                </div>
              )}
            </div>

            {/* Student: my courses — ✅ progress is now live from completedLessons */}
            {!isTeacher && (
              <div>
                <SectionTitle icon={<BookMarked size={15}/>} color="#10b981">Mes Cours</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {RECENT_COURSES.map(c => {
                    const pct = getCourseProgress(c.title, c.totalLessons);
                    return (
                      <Link key={c.id} to={`/course-view/${c.id}`} style={{ textDecoration: "none" }}>
                        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "13px 15px", display: "flex", alignItems: "center", gap: "12px", transition: "background 0.15s, transform 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "none"; }}>
                          <div style={{ width: "42px", height: "42px", borderRadius: "11px", background: c.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>{c.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 800, color: "#f1f5f9", fontSize: "13px", marginBottom: "6px" }}>{c.title}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ flex: 1, height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.08)" }}>
                                <div style={{ width: `${pct}%`, height: "100%", borderRadius: "99px", background: c.accent, transition: "width 0.5s ease" }}/>
                              </div>
                              <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", flexShrink: 0 }}>{pct}%</span>
                            </div>
                          </div>
                          <ChevronRight size={15} color="#334155"/>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Teacher: enrolled students */}
            {isTeacher && (
              <Card>
                <SectionTitle icon={<Users size={15}/>} color="#10b981">Étudiants inscrits</SectionTitle>
                {sessions.filter(s => s.teacher === username && s.status !== "past" && s.enrolledStudents?.length > 0).length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#475569", textAlign: "center", padding: "10px 0" }}>Aucun étudiant inscrit pour l'instant.</p>
                ) : (
                  sessions.filter(s => s.teacher === username && s.status !== "past" && s.enrolledStudents?.length > 0).map(s => (
                    <div key={s._id} style={{ marginBottom: "14px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: s.accent, marginBottom: "7px" }}>{s.title}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {s.enrolledStudents.map(st => (
                          <div key={st} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 900, color: "#fff" }}>{st[0]?.toUpperCase()}</div>
                            <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </Card>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Calendar */}
            <Card>
              <SectionTitle icon={<Calendar size={15}/>} color={roleColor}>Calendrier</SectionTitle>
              <MiniCalendar sessions={sessions}/>
            </Card>

            {/* ✅ UPDATED badges: earned computed from completedLessons.length vs threshold */}
            {!isTeacher && (
              <Card>
                <SectionTitle>🏅 Badges</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {BADGE_DEFS.map((b, i) => {
                    const earned = completedCount >= b.threshold;
                    return (
                      <div key={i} title={b.desc} style={{
                        textAlign: "center", padding: "11px 8px", borderRadius: "12px",
                        background: earned ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1.5px solid ${earned ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`,
                        opacity: earned ? 1 : 0.5,
                        transition: "all 0.3s",
                      }}>
                        <div style={{ fontSize: "24px", marginBottom: "5px", filter: earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                        <p style={{ fontSize: "10px", fontWeight: 700, color: earned ? "#6ee7b7" : "#475569", lineHeight: 1.3 }}>{b.label}</p>
                        {earned && <p style={{ fontSize: "9px", color: "#10b981", fontWeight: 600, marginTop: "3px" }}>✓ Obtenu</p>}
                      </div>
                    );
                  })}
                </div>

                {/* ✅ Next badge progress bar */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "11px", padding: "11px" }}>
                  {nextBadge ? (
                    <>
                      <p style={{ fontSize: "10px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Prochain badge</p>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#f1f5f9", marginBottom: "8px" }}>{nextBadge.icon} {nextBadge.label}</p>
                      <div style={{ height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", marginBottom: "5px" }}>
                        <div style={{ width: `${nextBadgeProgress}%`, height: "100%", borderRadius: "99px", background: "#10b981", transition: "width 0.5s ease" }}/>
                      </div>
                      <p style={{ fontSize: "11px", color: "#475569", fontWeight: 600 }}>
                        {completedCount} / {nextBadge.threshold} leçons
                      </p>
                    </>
                  ) : (
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#6ee7b7", textAlign: "center" }}>
                      🎓 Tous les badges obtenus !
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* AI Tutor */}
            <Card style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(16,185,129,0.07))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
                <Zap size={16} color="#a78bfa"/>
                <h3 style={{ fontSize: "14px", fontWeight: 900, color: "#f1f5f9", fontFamily: "'Playfair Display', Georgia, serif" }}>Tuteur IA</h3>
              </div>
              <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.6, marginBottom: "12px" }}>
                Questions sur une leçon ? Notre IA répond 24h/24.
              </p>
              <button style={{ width: "100%", background: "linear-gradient(90deg, #8b5cf6, #10b981)", border: "none", borderRadius: "11px", padding: "10px", color: "#fff", fontWeight: 700, fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                Démarrer une session →
              </button>
            </Card>

            {/* Dictionary */}
            <DictionaryWidget/>
          </div>
        </div>
      </div>

      {showModal && (
        <SessionModal
          initial={editTarget}
          onSave={handleSaveSession}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          teacherName={username}
          teacherAvatar={avatar}
        />
      )}

      <style>{`
        @media (max-width: 860px) { .dash-body { grid-template-columns: 1fr !important; } }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
      `}</style>
    </div>
  );
}