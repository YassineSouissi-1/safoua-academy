import React, { useState, useRef, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { speakArabic } from "../../utils/arabicTTS";
import { api, getUser } from "../../utils/auth";
import { MODULES, COURSE_META } from "./data/courseData";

export const COURSE_TITLE = "Grammaire : Tome 1 de Médine";
export const MODULE_PREFIX = "Module";

async function saveProgress(lessonTitle) {
  try {
    await api.post("/api/update-progress", { lessonTitle });
  } catch (err) {
    console.error("Erreur progression:", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// DESIGN CONCEPT
// A modern mosque interior at midday: pale limestone walls, a mihrab niche
// in deep teal-green, a single shaft of warm light through a mashrabiya
// screen. The architecture itself — light, repetition, the niche, the
// carved inscription — is the UI grammar, not ornament layered on a
// generic dashboard. Arches are reserved for two structural moments
// (module niches, the quiz "mihrab" frame) so the motif reads as
// intentional rather than wallpaper.
// ─────────────────────────────────────────────────────────────────────────

const GS = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --stone:#eae6dc;
  --stone2:#ddd6c5;
  --stone3:#c8bd9c;
  --wall:#f4f1e8;
  --ink:#23262a;
  --ink-soft:#5e5c52;
  --ink-faint:#90897a;
  --mihrab:#1c3d3a;
  --mihrab-light:#2c5a54;
  --mihrab-dim:rgba(28,61,58,.07);
  --mihrab-dim2:rgba(28,61,58,.14);
  --gold:#b9863f;
  --gold-light:#d9a456;
  --gold-dim:rgba(185,134,63,.12);
  --gold-dim2:rgba(185,134,63,.22);
  --line:rgba(35,38,42,.14);
  --line-soft:rgba(35,38,42,.07);
  --rose:#a8503f;
  --rose-dim:rgba(168,80,63,.09);
  --green:#3f7a5c;
  --green-dim:rgba(63,122,92,.09);
}
html{scroll-behavior:smooth}
.mosque-app{font-family:'Inter',sans-serif;background:var(--stone);color:var(--ink);line-height:1.6;min-height:100vh;position:relative}
.mosque-app *{box-sizing:border-box}
.mosque-app ::-webkit-scrollbar{width:5px}
.mosque-app ::-webkit-scrollbar-thumb{background:var(--stone3);border-radius:0}
.arabic{font-family:'Amiri',serif;direction:rtl;line-height:2.1}
.mono{font-family:'IBM Plex Mono',monospace}
.display{font-family:'Fraunces',serif;font-optical-sizing:auto}

@media (prefers-reduced-motion: reduce){
  .mosque-app *{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}
}

@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes lightSweep{0%{transform:translateX(-40%) skewX(-6deg);opacity:0}10%{opacity:.9}90%{opacity:.9}100%{transform:translateX(140%) skewX(-6deg);opacity:0}}
@keyframes recordPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.75}}
@keyframes waveBar{0%,100%{height:4px}50%{height:16px}}
@keyframes scoreIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes correctBounce{0%{transform:scale(1)}30%{transform:scale(1.05)}60%{transform:scale(.98)}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@keyframes flipCard{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
.fade-up{animation:fadeUp .35s ease both}
.fade-in{animation:fadeIn .25s ease both}

.mosque-app .niche-btn:hover .niche-arch{ background:var(--mihrab) !important; border-color:var(--mihrab) !important; }
.mosque-app .niche-btn:hover .niche-label{ color:var(--mihrab) !important; }
.mosque-app .lintel-tab:hover{ color:var(--ink) !important; }
.mosque-app button{ font-family:inherit; }
.mosque-app .focus-ring:focus-visible{ outline:2px solid var(--mihrab); outline-offset:2px; }
`;

// ─── Mashrabiya pattern (signature element) ────────────────────────────────
// A real 8-fold girih star tiling, generated geometrically (not clip-art),
// used as: hero backdrop with a light sweep, the quiz frame texture, and
// section dividers.
function MashrabiyaDefs({ id, stroke = "var(--ink)", opacity = 0.16 }) {
  return (
    <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 45.71,36.51 L 34.95,34.95 L 36.51,45.71 L 30.00,37.00 L 23.49,45.71 L 25.05,34.95 L 14.29,36.51 L 23.00,30.00 L 14.29,23.49 L 25.05,25.05 L 23.49,14.29 L 30.00,23.00 L 36.51,14.29 L 34.95,25.05 L 45.71,23.49 L 37.00,30.00 Z"
        fill="none" stroke={stroke} strokeWidth="1" opacity={opacity} />
      <circle cx="30" cy="30" r="3.2" fill="none" stroke={stroke} strokeWidth="1" opacity={opacity} />
      <path d="M0,30 L8,30 M52,30 L60,30 M30,0 L30,8 M30,52 L30,60" stroke={stroke} strokeWidth="1" opacity={opacity * 0.7} />
    </pattern>
  );
}

function MashrabiyaBackdrop({ sweep = true, opacity = 0.22 }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs><MashrabiyaDefs id="mshb-hero" opacity={opacity} /></defs>
        <rect width="100%" height="100%" fill="url(#mshb-hero)" />
      </svg>
      {sweep && (
        <div style={{
          position: "absolute", top: "-20%", left: 0, width: "38%", height: "140%",
          background: "linear-gradient(100deg, transparent, rgba(217,164,86,.32) 45%, rgba(217,164,86,.46) 50%, rgba(217,164,86,.32) 55%, transparent)",
          animation: "lightSweep 6s ease-in-out infinite", animationDelay: "1s"
        }} />
      )}
    </div>
  );
}

// ─── Hook: Speech Recognition ───────────────────────────────────────────────
function useSpeech() {
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const supported = !!SR;
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const start = useCallback(() => {
    if (!supported) { setError("Utilisez Chrome pour la reconnaissance vocale."); return; }
    setTranscript(""); setError("");
    const rec = new SR();
    rec.lang = "ar-SA"; rec.interimResults = false; rec.maxAlternatives = 5;
    rec.onstart = () => setListening(true);
    rec.onresult = e => {
      const best = Array.from(e.results[0]).map(r => r.transcript);
      setTranscript(best[0] || "");
    };
    rec.onerror = e => { setError(e.error === "not-allowed" ? "Microphone non autorisé." : "Erreur : " + e.error); setListening(false); };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
  }, [supported]);

  const stop = useCallback(() => { recRef.current?.stop(); setListening(false); }, []);
  const reset = useCallback(() => { setTranscript(""); setError(""); }, []);

  return { supported, listening, transcript, error, start, stop, reset };
}

function normalize(s) {
  return (s || "").replace(/[\u064B-\u065F]/g, "").replace(/[أإآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();
}
function scoreMatch(target, spoken) {
  const t = normalize(target), s = normalize(spoken);
  if (!s) return 0;
  if (t === s) return 100;
  const set1 = new Set(t.split(""));
  const set2 = new Set(s.split(""));
  let common = 0;
  set1.forEach(c => { if (set2.has(c)) common++; });
  const jaccard = common / (set1.size + set2.size - common);
  const subScore = (t.includes(s) || s.includes(t)) ? 40 : 0;
  return Math.min(100, Math.round(jaccard * 100 + subScore));
}
function speak(text) { try { speakArabic(text); } catch (e) {} }

// ─── Inscription marks (line icons, echoing carved stone) ─────────────────
function Mark({ type, size = 18, color = "currentColor", strokeWidth = 1.6 }) {
  const s = { width: size, height: size, stroke: color, fill: "none", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "speaker": return <svg viewBox="0 0 24 24" style={s}><path d="M4 10V14H8L13 18V6L8 10H4Z" /><path d="M16.5 9C17.5 10 18 10.9 18 12C18 13.1 17.5 14 16.5 15" /></svg>;
    case "mic": return <svg viewBox="0 0 24 24" style={s}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11C5 14.9 8.1 18 12 18C15.9 18 19 14.9 19 11" /><path d="M12 18V21M9 21H15" /></svg>;
    case "check": return <svg viewBox="0 0 24 24" style={s}><path d="M5 12.5L9.5 17L19 6.5" /></svg>;
    case "x": return <svg viewBox="0 0 24 24" style={s}><path d="M6 6L18 18M18 6L6 18" /></svg>;
    case "retry": return <svg viewBox="0 0 24 24" style={s}><path d="M4 12C4 7.6 7.6 4 12 4C15 4 17.6 5.7 19 8.2" /><path d="M19 4V8.5H14.5" /><path d="M20 12C20 16.4 16.4 20 12 20C9 20 6.4 18.3 5 15.8" /><path d="M5 20V15.5H9.5" /></svg>;
    case "arrowL": return <svg viewBox="0 0 24 24" style={s}><path d="M15 5L8 12L15 19" /></svg>;
    case "arrowR": return <svg viewBox="0 0 24 24" style={s}><path d="M9 5L16 12L9 19" /></svg>;
    case "lock": return <svg viewBox="0 0 24 24" style={s}><rect x="6" y="10.5" width="12" height="9" rx="1" /><path d="M8.5 10.5V8C8.5 5.5 10 4 12 4C14 4 15.5 5.5 15.5 8V10.5" /></svg>;
    case "scroll": return <svg viewBox="0 0 24 24" style={s}><path d="M6 4H17C18.1 4 19 4.9 19 6V18C19 19.1 18.1 20 17 20H6" /><path d="M6 4C4.9 4 4 4.9 4 6C4 7.1 4.9 8 6 8" /><path d="M6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16V8" /><path d="M9 11H15M9 14H13" /></svg>;
    case "spark": return <svg viewBox="0 0 24 24" style={s}><path d="M12 3V8M12 16V21M3 12H8M16 12H21M5.5 5.5L8.5 8.5M15.5 15.5L18.5 18.5M5.5 18.5L8.5 15.5M15.5 8.5L18.5 5.5" /></svg>;
    case "sun": return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="4.5" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M5.6 18.4L7.4 16.6M16.6 7.4L18.4 5.6" /></svg>;
    case "moon": return <svg viewBox="0 0 24 24" style={s}><path d="M19 13.5C17.8 14.9 16 15.7 14 15.7C10.1 15.7 7 12.6 7 8.7C7 6.7 7.8 4.9 9.2 3.7C5.4 4.4 2.5 7.8 2.5 11.9C2.5 16.6 6.3 20.4 11 20.4C15.1 20.4 18.6 17.5 19.3 13.6C19.2 13.5 19.1 13.5 19 13.5Z" /></svg>;
    default: return null;
  }
}

// ─── Structural pieces ──────────────────────────────────────────────────────

// An arched niche — the recurring architectural unit for module selection.
function Niche({ active, color = "var(--mihrab)", onClick, num, label, sublabel, locked, completed }) {
  return (
    <button onClick={onClick} disabled={locked} className="niche-btn focus-ring" style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      background: "transparent", border: "none", cursor: locked ? "default" : "pointer",
      padding: "0 6px", opacity: locked ? 0.45 : 1, minWidth: 92,
    }}>
      <svg width="64" height="76" viewBox="0 0 64 76" style={{ display: "block" }}>
        <path
          className="niche-arch"
          d="M4 76 V34 C4 16 16 4 32 4 C48 4 60 16 60 34 V76 Z"
          fill={active ? color : "var(--wall)"}
          stroke={active ? color : "var(--line)"}
          strokeWidth="1.5"
          style={{ transition: "all .25s" }}
        />
        <text x="32" y="42" textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize="15" fontWeight="500"
          fill={active ? "var(--wall)" : "var(--ink-soft)"} style={{ transition: "fill .25s" }}>{num}</text>
        {completed && (
          <g transform="translate(32,58)">
            <path d="M-6 0 L-1.5 4.5 L6 -5" stroke={active ? "var(--wall)" : color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {locked && (
          <g transform="translate(32,58)" opacity="0.7">
            <rect x="-5" y="-1" width="10" height="7" rx="1" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5" />
            <path d="M-3 -1V-3C-3 -4.5 -1.5 -5.5 0 -5.5C1.5 -5.5 3 -4.5 3 -3V-1" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5" />
          </g>
        )}
      </svg>
      <div style={{ textAlign: "center" }}>
        <div className="niche-label" style={{ fontSize: 12.5, fontWeight: 600, color: active ? color : "var(--ink)", transition: "color .25s" }}>{label}</div>
        <div style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 1 }}>{sublabel}</div>
      </div>
    </button>
  );
}

// Pointed-arch frame used for the quiz ("mihrab moment") and module hero.
function ArchFrame({ children, tint = "var(--mihrab)", padding = "40px 36px", patternId = "mshb-arch" }) {
  return (
    <div style={{ position: "relative" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs><MashrabiyaDefs id={patternId} stroke={tint} opacity={0.05} /></defs>
      </svg>
      <div style={{
        position: "relative", borderRadius: "28px 28px 6px 6px", overflow: "hidden",
        background: "var(--wall)", border: `1.5px solid ${tint}33`,
        boxShadow: `0 1px 0 ${tint}22 inset`,
      }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
        <div style={{ position: "relative", padding }}>{children}</div>
      </div>
    </div>
  );
}

// Section divider — a thin inscribed rule, not a generic <hr>.
function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 20px" }}>
      <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      {label && <span className="mono" style={{ fontSize: 10.5, letterSpacing: 1.5, color: "var(--ink-faint)", textTransform: "uppercase" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
    </div>
  );
}

// Speaker button — reused atomically (not a "mode"), since hearing a word
// spoken is a primitive every lesson needs, not an activity in itself.
function SpeakBtn({ text, size = 30, color = "var(--mihrab)" }) {
  return (
    <button onClick={() => speak(text)} aria-label={`Écouter ${text}`} className="focus-ring" style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `${color}12`, border: `1.5px solid ${color}33`, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", color, padding: 0,
      transition: "background .15s"
    }}>
      <Mark type="speaker" size={size * 0.5} color={color} />
    </button>
  );
}

// ─── Pronunciation context ─────────────────────────────────────────────────
// One global switch controls whether the French phonetic respelling shows
// alongside the scientific transliteration, everywhere in the course.
const PronunciationContext = createContext({ showFrench: true });
function usePronunciation() { return useContext(PronunciationContext); }

// Renders the scientific transliteration, and — when the global toggle is
// on — the French-readable respelling right under it. `fr` may be absent
// on a handful of fields; in that case only the scientific line shows.
// Block-level by design: this must never sit glued against the Arabic
// glyph that precedes it, so it always starts on its own line with a
// small top margin.
function Pron({ sci, fr, size = 12.5, color = "var(--ink-faint)" }) {
  const { showFrench } = usePronunciation();
  if (!sci) return null;
  return (
    <div className="mono" style={{ fontSize: size, color, fontStyle: "italic", lineHeight: 1.5, marginTop: 3 }}>
      {sci}
      {showFrench && fr && <div style={{ fontStyle: "normal", color: "var(--gold)", fontSize: size - 0.5, marginTop: 1 }}>FR · {fr}</div>}
    </div>
  );
}

// Theory note block — the "inscription" introducing each lesson.
function TheoryNote({ text, color = "var(--mihrab)" }) {
  return (
    <p style={{
      fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.85, marginBottom: 22,
      padding: "16px 20px", background: `${color}08`, borderLeft: `3px solid ${color}`,
      borderRadius: "0 8px 8px 0"
    }}>{text}</p>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE 1 ACTIVITIES — اسم أم فعل؟
// ═══════════════════════════════════════════════════════════════════════

// 1a — "Sort the stones": click a word, then click the niche it belongs
// in (Noun / Verb). Chosen because the core skill here is binary
// classification by shape — a sort, not a quiz.
function SortNiches({ words, color }) {
  const [placed, setPlaced] = useState({}); // word.ar -> 'noun'|'verb'|'wrong'
  const [selected, setSelected] = useState(null);
  const remaining = words.filter(w => !placed[w.ar] || placed[w.ar] === "wrong");
  const isNoun = (w) => !w.root; // nouns have no root field in our data shape
  const allDone = words.every(w => placed[w.ar] === "correct");

  const choose = (w) => setSelected(w);
  const drop = (bucket) => {
    if (!selected) return;
    const correctBucket = isNoun(selected) ? "noun" : "verb";
    if (bucket === correctBucket) {
      setPlaced(p => ({ ...p, [selected.ar]: "correct" }));
    } else {
      setPlaced(p => ({ ...p, [selected.ar]: "wrong" }));
      setTimeout(() => setPlaced(p => ({ ...p, [selected.ar]: undefined })), 600);
    }
    setSelected(null);
  };

  const reset = () => { setPlaced({}); setSelected(null); };

  return (
    <div style={{ padding: "26px 24px" }}>
      <p style={{ fontSize: 12.5, color: "var(--ink-faint)", textAlign: "center", marginBottom: 20 }}>
        Touchez un mot, puis touchez la niche qui lui correspond
      </p>

      {/* word pool */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 28, minHeight: 50 }}>
        {words.map(w => {
          const state = placed[w.ar];
          if (state === "correct") return null;
          const isSel = selected?.ar === w.ar;
          return (
            <button key={w.ar} onClick={() => choose(w)} className="focus-ring" style={{
              padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              border: `1.5px solid ${isSel ? color : state === "wrong" ? "var(--rose)" : "var(--line)"}`,
              background: isSel ? `${color}14` : state === "wrong" ? "var(--rose-dim)" : "var(--wall)",
              animation: state === "wrong" ? "shake .35s ease" : "none",
            }}>
              <div className="arabic" style={{ fontSize: 19, color: "var(--ink)" }}>{w.ar}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-faint)", marginTop: 2 }}>{w.fr}</div>
            </button>
          );
        })}
        {remaining.length === 0 && !allDone && <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>…</span>}
      </div>

      {/* niches */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[{ id: "noun", label: "اسم", fr: "Nom" }, { id: "verb", label: "فعل", fr: "Verbe" }].map(b => (
          <button key={b.id} onClick={() => drop(b.id)} className="focus-ring" style={{
            cursor: selected ? "pointer" : "default", border: `1.5px dashed ${selected ? color : "var(--line)"}`,
            borderRadius: "20px 20px 6px 6px", background: selected ? `${color}08` : "var(--wall)",
            padding: "24px 10px", textAlign: "center", transition: "all .2s"
          }}>
            <div className="arabic" style={{ fontSize: 26, color, marginBottom: 4 }}>{b.label}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{b.fr}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 12 }}>
              {words.filter(w => placed[w.ar] === "correct" && (isNoun(w) ? "noun" : "verb") === b.id).map(w => (
                <span key={w.ar} className="arabic fade-in" style={{ fontSize: 14, padding: "3px 9px", borderRadius: 6, background: `${color}15`, color }}>{w.ar}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {allDone && (
        <div className="fade-up" style={{ textAlign: "center", marginTop: 22 }}>
          <p style={{ fontSize: 13.5, color, fontWeight: 600, marginBottom: 10 }}>Bien classé — chaque mot est à sa place.</p>
          <button onClick={reset} style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${color}40`, background: "transparent", color, cursor: "pointer", fontSize: 12.5 }}>↺ Recommencer</button>
        </div>
      )}
    </div>
  );
}

// 1b — "Root extractor": click the 3 root letters of a verb in order.
// Chosen because root-extraction is THE foundational skill for every verb
// lesson after this one — worth its own dedicated, repeatable drill.
function RootExtractor({ words, color }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState([]);
  const [wrongFlash, setWrongFlash] = useState(null);
  const [doneWords, setDoneWords] = useState([]);
  const word = words[idx];
  const letters = word.ar.replace(/[\u064B-\u065F]/g, "").split("");

  const pick = (ch, i) => {
    const expected = word.root[picked.length];
    if (ch === expected) {
      const next = [...picked, ch];
      setPicked(next);
      if (next.length === word.root.length) {
        setTimeout(() => setDoneWords(d => [...d, word.ar]), 300);
      }
    } else {
      setWrongFlash(i);
      setTimeout(() => setWrongFlash(null), 350);
    }
  };

  const next = () => {
    if (idx < words.length - 1) { setIdx(idx + 1); setPicked([]); }
    else { setIdx(0); setPicked([]); setDoneWords([]); }
  };

  const isComplete = picked.length === word.root.length;

  return (
    <div style={{ padding: "26px 24px" }}>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 22 }}>
        {words.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 18 : 7, height: 7, borderRadius: 4, background: doneWords.includes(words[i].ar) ? color : i === idx ? `${color}80` : "var(--stone3)", transition: "all .25s" }} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 12 }}>Touchez les lettres de la racine, dans l'ordre</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 6 }}>
          <SpeakBtn text={word.ar} size={26} color={color} />
        </div>
        <Pron sci={word.tr} fr={word.trFr} size={11.5} color="var(--ink-faint)" />
        <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2, marginBottom: 4 }}>{word.fr}</div>
      </div>

      {/* letter row, click to extract */}
      <div className="arabic" style={{ display: "flex", justifyContent: "center", gap: 4, direction: "rtl", margin: "20px 0", flexWrap: "wrap" }}>
        {letters.map((ch, i) => {
          const usedCount = picked.filter(p => p === ch).length;
          const isRoot = word.root.includes(ch);
          return (
            <button key={i} onClick={() => isRoot && pick(ch, i)} className="focus-ring" style={{
              width: 42, height: 50, fontSize: 22, borderRadius: 8, cursor: isRoot ? "pointer" : "default",
              border: `1.5px solid ${wrongFlash === i ? "var(--rose)" : "var(--line)"}`,
              background: "var(--wall)", color: "var(--ink)", fontFamily: "'Amiri',serif",
              animation: wrongFlash === i ? "shake .35s ease" : "none",
            }}>{ch}</button>
          );
        })}
      </div>

      {/* extracted root display */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 18, minHeight: 50 }}>
        {word.root.map((r, i) => (
          <div key={i} className="arabic" style={{
            width: 42, height: 50, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, borderRadius: 8, border: `1.5px solid ${color}`,
            background: i < picked.length ? `${color}18` : "transparent", color,
            opacity: i < picked.length ? 1 : 0.25
          }}>{i < picked.length ? r : "—"}</div>
        ))}
      </div>

      {isComplete && (
        <div className="fade-up" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 13, color, fontWeight: 600, marginBottom: 12 }}>
            Racine extraite : <span className="arabic" style={{ fontSize: 17 }}>{word.root.join(" - ")}</span>
          </p>
          <button onClick={next} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            {idx < words.length - 1 ? "Mot suivant →" : "Recommencer ↺"}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE 2 ACTIVITIES — التنكير والتعريف
// ═══════════════════════════════════════════════════════════════════════

// 2a — "Tanwīn toggle": flip a single word between indefinite/definite
// and hear + see the change live. Chosen because the concept IS a
// transformation, so the activity should literally be a switch.
function TanwinToggle({ pairs, color }) {
  const [idx, setIdx] = useState(0);
  const [isDef, setIsDef] = useState(false);
  const p = pairs[idx];

  return (
    <div style={{ padding: "28px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 22 }}>Activez l'interrupteur pour voir le mot changer</p>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 26 }}>
        {pairs.map((_, i) => (
          <button key={i} onClick={() => { setIdx(i); setIsDef(false); }} style={{
            width: 9, height: 9, borderRadius: "50%", border: "none", cursor: "pointer",
            background: i === idx ? color : "var(--stone3)"
          }} />
        ))}
      </div>

      <div style={{ background: "var(--wall)", border: `1.5px solid ${color}30`, borderRadius: 20, padding: "36px 28px", marginBottom: 22 }}>
        <div className="arabic fade-in" key={isDef ? "def" : "indef"} style={{ fontSize: 46, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>
          {isDef ? p.def : p.indef}
        </div>
        <Pron sci={isDef ? p.defTr : p.indefTr} fr={isDef ? p.defFr : p.indefFr} size={13} color={color} />
        <div style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 18 }}>
          {isDef ? `« la / le ${p.fr} »` : `« une / un ${p.fr} »`}
        </div>
        <SpeakBtn text={isDef ? p.def : p.indef} color={color} />
      </div>

      {/* the switch */}
      <button onClick={() => setIsDef(d => !d)} className="focus-ring" style={{
        position: "relative", width: 130, height: 44, borderRadius: 22, border: `1.5px solid ${color}`,
        background: isDef ? color : "var(--wall)", cursor: "pointer", transition: "background .25s"
      }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 600, color: isDef ? "var(--wall)" : color }}>ـٌ</span>
        <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 600, color: isDef ? "var(--wall)" : "var(--ink-faint)" }}>ال</span>
        <span style={{
          position: "absolute", top: 3, left: isDef ? 89 : 3, width: 38, height: 38, borderRadius: "50%",
          background: "var(--wall)", border: `1.5px solid ${color}`, transition: "left .25s",
          boxShadow: "0 1px 3px rgba(0,0,0,.15)"
        }} />
      </button>
      <p style={{ fontSize: 10.5, color: "var(--ink-faint)", marginTop: 10 }}>indéfini (tanwīn) ⇄ défini (ال)</p>
    </div>
  );
}

// 2b — "Sun or Moon": the classic beginner trap, given its own sorting
// drill with audio so the ear learns the assimilation, not just the eye.
function SunMoonSort({ examples, color }) {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null); // 'sun'|'moon'
  const [results, setResults] = useState({});
  const ex = examples[idx];

  const choose = (type) => {
    if (answered) return;
    setAnswered(type);
    setResults(r => ({ ...r, [idx]: type === ex.type }));
    speak(ex.ar);
  };
  const next = () => {
    if (idx < examples.length - 1) { setIdx(idx + 1); setAnswered(null); }
    else { setIdx(0); setAnswered(null); setResults({}); }
  };

  const score = Object.values(results).filter(Boolean).length;

  return (
    <div style={{ padding: "26px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Le ل s'entend-il ou s'assimile-t-il ?</p>
        <span className="mono" style={{ fontSize: 11, color }}>{score}/{Object.keys(results).length || 0}</span>
      </div>

      <div style={{ textAlign: "center", background: "var(--wall)", border: `1.5px solid ${color}30`, borderRadius: 18, padding: "30px 24px", marginBottom: 20 }}>
        <div className="arabic" style={{ fontSize: 38, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{ex.ar}</div>
        {answered && (
          <div className="fade-in"><Pron sci={ex.tr} fr={ex.trFr} size={13} color={color} /></div>
        )}
        <div style={{ marginTop: 10 }}><SpeakBtn text={ex.ar} color={color} /></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <button onClick={() => choose("moon")} disabled={!!answered} className="focus-ring" style={{
          padding: "16px 10px", borderRadius: 14, cursor: answered ? "default" : "pointer",
          border: `1.5px solid ${answered === "moon" ? (ex.type === "moon" ? "var(--green)" : "var(--rose)") : "var(--line)"}`,
          background: answered === "moon" ? (ex.type === "moon" ? "var(--green-dim)" : "var(--rose-dim)") : "var(--wall)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><Mark type="moon" color={color} /></div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>Lunaire</div>
          <div style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>ل se prononce</div>
        </button>
        <button onClick={() => choose("sun")} disabled={!!answered} className="focus-ring" style={{
          padding: "16px 10px", borderRadius: 14, cursor: answered ? "default" : "pointer",
          border: `1.5px solid ${answered === "sun" ? (ex.type === "sun" ? "var(--green)" : "var(--rose)") : "var(--line)"}`,
          background: answered === "sun" ? (ex.type === "sun" ? "var(--green-dim)" : "var(--rose-dim)") : "var(--wall)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><Mark type="sun" color={color} /></div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>Solaire</div>
          <div style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>ل s'assimile</div>
        </button>
      </div>

      {answered && (
        <div className="fade-in" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 12.5, color: answered === ex.type ? "var(--green)" : "var(--rose)", fontWeight: 600, marginBottom: 12 }}>
            {answered === ex.type ? "Exact." : `Non — ${ex.ar} est ${ex.type === "sun" ? "solaire" : "lunaire"}.`}
          </p>
          <button onClick={next} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            {idx < examples.length - 1 ? "Suivant →" : "Recommencer ↺"}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE 3 ACTIVITIES — الجملة الاسمية
// ═══════════════════════════════════════════════════════════════════════

// 3a — "Build the sentence": tap subject then predicate from the
// example bank, see them assemble into a full sentence with translation.
// Chosen because constructing (not just reading) the مبتدأ+خبر pairing
// is the actual target skill.
function SentenceBuilder({ examples, color }) {
  const subjects = examples.map(e => ({ word: e.ar.split(" ")[0], full: e }));
  const [chosenSubj, setChosenSubj] = useState(null);
  const [built, setBuilt] = useState([]);

  const choose = (s) => {
    setChosenSubj(s);
    setTimeout(() => {
      setBuilt(b => [...b, s.full]);
      setChosenSubj(null);
    }, 550);
  };

  const remaining = examples.filter(e => !built.includes(e));
  const reset = () => setBuilt([]);

  return (
    <div style={{ padding: "26px 24px" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", textAlign: "center", marginBottom: 20 }}>
        Touchez un sujet pour révéler la phrase nominale complète
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
        {remaining.map((e, i) => {
          const subjWord = e.ar.split(" ")[0];
          const isChosen = chosenSubj?.full === e;
          return (
            <button key={i} onClick={() => choose({ word: subjWord, full: e })} className="focus-ring" style={{
              padding: "12px 20px", borderRadius: 12, border: `1.5px solid ${isChosen ? color : "var(--line)"}`,
              background: isChosen ? `${color}14` : "var(--wall)", cursor: "pointer",
            }}>
              <span className="arabic" style={{ fontSize: 20, color: "var(--ink)" }}>{subjWord}</span>
              <span style={{ display: "block", fontSize: 10, color: "var(--ink-faint)", marginTop: 2 }}>مبتدأ</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {built.map((e, i) => (
          <div key={i} className="fade-up" style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
            background: "var(--wall)", border: `1px solid ${color}25`, borderRadius: 12,
          }}>
            <SpeakBtn text={e.ar} size={32} color={color} />
            <div style={{ flex: 1 }}>
              <div className="arabic" style={{ fontSize: 21, color: "var(--ink)" }}>
                <span style={{ color, fontWeight: 700 }}>{e.ar.split(" ")[0]}</span>{" " + e.ar.split(" ").slice(1).join(" ")}
              </div>
              <Pron sci={e.tr} fr={e.trFr} size={11} color="var(--ink-faint)" />
              <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{e.fr}</div>
            </div>
          </div>
        ))}
      </div>

      {built.length === examples.length && (
        <div className="fade-up" style={{ textAlign: "center", marginTop: 20 }}>
          <p style={{ fontSize: 13, color, fontWeight: 600, marginBottom: 10 }}>Toutes les phrases sont construites.</p>
          <button onClick={reset} style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${color}40`, background: "transparent", color, cursor: "pointer", fontSize: 12.5 }}>↺ Recommencer</button>
        </div>
      )}
    </div>
  );
}

// 3b — "Sentence judge": shown a candidate sentence, decide grammatical
// or not, then read why. Chosen because the target skill at this stage
// is judgment/error-spotting, which a binary judge call trains directly.
function SentenceJudge({ cases, color }) {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const c = cases[idx];

  const choose = (val) => {
    if (answered !== null) return;
    setAnswered(val);
    if (val === c.valid) setScore(s => s + 1);
  };
  const next = () => {
    if (idx < cases.length - 1) { setIdx(idx + 1); setAnswered(null); }
    else { setIdx(0); setAnswered(null); setScore(0); }
  };

  return (
    <div style={{ padding: "26px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Phrase correcte ou non ?</p>
        <span className="mono" style={{ fontSize: 11, color }}>{idx + 1}/{cases.length}</span>
      </div>

      <div style={{ textAlign: "center", background: "var(--wall)", border: `1.5px solid ${color}30`, borderRadius: 18, padding: "32px 24px", marginBottom: 20 }}>
        <div className="arabic" style={{ fontSize: 32, fontWeight: 700, color: "var(--ink)" }}>{c.ar}</div>
        {c.valid && <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 8 }}>{c.fr}</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <button onClick={() => choose(true)} disabled={answered !== null} className="focus-ring" style={{
          padding: "14px", borderRadius: 12, cursor: answered !== null ? "default" : "pointer",
          border: `1.5px solid ${answered === true ? (c.valid ? "var(--green)" : "var(--rose)") : "var(--line)"}`,
          background: answered === true ? (c.valid ? "var(--green-dim)" : "var(--rose-dim)") : "var(--wall)",
          fontSize: 13.5, fontWeight: 600, color: "var(--ink)"
        }}>✓ Correcte</button>
        <button onClick={() => choose(false)} disabled={answered !== null} className="focus-ring" style={{
          padding: "14px", borderRadius: 12, cursor: answered !== null ? "default" : "pointer",
          border: `1.5px solid ${answered === false ? (!c.valid ? "var(--green)" : "var(--rose)") : "var(--line)"}`,
          background: answered === false ? (!c.valid ? "var(--green-dim)" : "var(--rose-dim)") : "var(--wall)",
          fontSize: 13.5, fontWeight: 600, color: "var(--ink)"
        }}>✗ Incorrecte</button>
      </div>

      {answered !== null && (
        <div className="fade-in">
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7, padding: "12px 16px", background: `${color}08`, borderRadius: 10, marginBottom: 16 }}>
            <strong style={{ color }}>{answered === c.valid ? "Exact. " : "Pas tout à fait. "}</strong>{c.why}
          </p>
          <div style={{ textAlign: "center" }}>
            <button onClick={next} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              {idx < cases.length - 1 ? "Suivante →" : `Terminé — ${score}/${cases.length} ↺`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE 4 ACTIVITIES — المذكر والمؤنث
// ═══════════════════════════════════════════════════════════════════════

// 4a — "Gender flip": a card you flip between masculine/feminine forms.
// Chosen because the transformation (adding ة) is itself the lesson, so
// a literal flip mirrors the grammar move.
function GenderFlip({ pairs, color }) {
  const [idx, setIdx] = useState(0);
  const [showF, setShowF] = useState(false);
  const p = pairs[idx];

  return (
    <div style={{ padding: "28px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 20 }}>Touchez la carte pour basculer le genre</p>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 22 }}>
        {pairs.map((_, i) => (
          <button key={i} onClick={() => { setIdx(i); setShowF(false); }} style={{ width: 9, height: 9, borderRadius: "50%", border: "none", cursor: "pointer", background: i === idx ? color : "var(--stone3)" }} />
        ))}
      </div>

      <div onClick={() => setShowF(s => !s)} style={{
        cursor: "pointer", background: showF ? "var(--mihrab-dim2)" : "var(--wall)",
        border: `1.5px solid ${color}35`, borderRadius: 20, padding: "38px 24px", marginBottom: 16,
        transition: "background .25s"
      }}>
        <div className="arabic fade-in" key={showF ? "f" : "m"} style={{ fontSize: 42, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
          {showF ? p.f : p.m}
        </div>
        <Pron sci={showF ? p.fTr : p.mTr} fr={showF ? p.fFr : p.mFr} size={12.5} color={color} />
        <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{p.fr} — {showF ? "féminin" : "masculin"}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
        <SpeakBtn text={showF ? p.f : p.m} color={color} />
        <button onClick={() => setIdx((idx + 1) % pairs.length)} style={{ padding: "9px 20px", borderRadius: 9, border: `1.5px solid ${color}40`, background: "transparent", color, cursor: "pointer", fontSize: 12.5 }}>Mot suivant →</button>
      </div>
    </div>
  );
}

// 4b — "Exception memory": flip tiles pairing each exception-noun with
// its reason (pays / personne / paire). Chosen because these exceptions
// must be memorized as arbitrary facts — a memory-pairing game is the
// honest way to drill rote knowledge, not disguised as logic.
function ExceptionMemory({ items, sentence, color }) {
  const [revealed, setRevealed] = useState({});
  const [matched, setMatched] = useState([]);
  const allMatched = matched.length === items.length;

  const reveal = (i) => {
    if (matched.includes(i)) return;
    setRevealed(r => ({ ...r, [i]: true }));
    setTimeout(() => setMatched(m => [...m, i]), 250);
  };

  return (
    <div style={{ padding: "26px 24px" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", textAlign: "center", marginBottom: 18 }}>
        Touchez chaque mot pour découvrir pourquoi il est féminin sans ة
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 22 }}>
        {items.map((it, i) => (
          <button key={i} onClick={() => reveal(i)} className="focus-ring" style={{
            padding: "16px 8px", borderRadius: 12, cursor: matched.includes(i) ? "default" : "pointer",
            border: `1.5px solid ${matched.includes(i) ? color : "var(--line)"}`,
            background: matched.includes(i) ? `${color}10` : "var(--wall)", textAlign: "center", minHeight: 92,
          }}>
            <div className="arabic" style={{ fontSize: 18, color: "var(--ink)", marginBottom: 4 }}>{it.ar}</div>
            {revealed[i] ? (
              <div className="fade-in" style={{ fontSize: 10, color, fontWeight: 600, lineHeight: 1.3 }}>{it.reason}</div>
            ) : (
              <div style={{ fontSize: 9.5, color: "var(--ink-faint)" }}>{it.fr}</div>
            )}
          </button>
        ))}
      </div>

      {allMatched && (
        <div className="fade-up" style={{ textAlign: "center", padding: "16px 18px", background: `${color}08`, borderRadius: 12 }}>
          <div className="arabic" style={{ fontSize: 20, color: "var(--ink)", marginBottom: 4 }}>{sentence.ar}</div>
          <Pron sci={sentence.tr} fr={sentence.trFr} size={11.5} color={color} />
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 6 }}>{sentence.fr}</div>
          <div style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>{sentence.note}</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE 5 ACTIVITIES — أسماء الإشارة
// ═══════════════════════════════════════════════════════════════════════

// 5a — "Point and match": given a noun, pick هذا or هذه by gender —
// trains the gender-recognition reflex needed before combining demonstrative
// + noun confidently.
function DemoMatch({ items, color }) {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const it = items[idx];

  const choose = (g) => {
    if (answered) return;
    setAnswered(g);
    if (g === it.gender) { setScore(s => s + 1); speak(`${it.demo} ${it.ar}`); }
  };
  const next = () => {
    if (idx < items.length - 1) { setIdx(idx + 1); setAnswered(null); }
    else { setIdx(0); setAnswered(null); setScore(0); }
  };

  return (
    <div style={{ padding: "26px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Quel démonstratif pour ce mot ?</p>
        <span className="mono" style={{ fontSize: 11, color }}>{score}/{idx + (answered ? 1 : 0)}</span>
      </div>

      <div style={{ textAlign: "center", background: "var(--wall)", border: `1.5px solid ${color}30`, borderRadius: 18, padding: "30px 24px", marginBottom: 20 }}>
        <div className="arabic" style={{ fontSize: 36, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{it.ar}</div>
        <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{it.fr.replace("Ceci est ", "")}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        {["m", "f"].map(g => (
          <button key={g} onClick={() => choose(g)} disabled={!!answered} className="focus-ring" style={{
            padding: "16px", borderRadius: 12, cursor: answered ? "default" : "pointer",
            border: `1.5px solid ${answered === g ? (g === it.gender ? "var(--green)" : "var(--rose)") : "var(--line)"}`,
            background: answered === g ? (g === it.gender ? "var(--green-dim)" : "var(--rose-dim)") : "var(--wall)",
          }}>
            <div className="arabic" style={{ fontSize: 24, color: "var(--ink)" }}>{g === "m" ? "هذا" : "هذه"}</div>
            <div style={{ fontSize: 10.5, color: "var(--ink-faint)", marginTop: 4 }}>{g === "m" ? "masculin" : "féminin"}</div>
          </button>
        ))}
      </div>

      {answered && (
        <div className="fade-in" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 12.5, color: answered === it.gender ? "var(--green)" : "var(--rose)", fontWeight: 600, marginBottom: 4 }}>
            {answered === it.gender ? "Exact." : "Pas tout à fait."}
          </p>
          <div className="arabic" style={{ fontSize: 18, color: "var(--ink)", marginBottom: 4 }}>{it.demo} {it.ar}</div>
          <Pron sci={it.tr} fr={it.trFr} size={11.5} color="var(--ink-faint)" />
          <div style={{ height: 8 }} />
          <button onClick={next} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            {idx < items.length - 1 ? "Suivant →" : "Recommencer ↺"}
          </button>
        </div>
      )}
    </div>
  );
}

// 5b — "Demonstrative builder": slot-fill ذلك/تلك + noun + adjective,
// the full pointing sentence, capping the lesson with production not
// just recognition.
function DemoBuilder({ examples, color }) {
  const [idx, setIdx] = useState(0);
  const ex = examples[idx];
  const parts = ex.ar.split(" ");
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => { setRevealedCount(0); }, [idx]);

  const revealNext = () => setRevealedCount(c => Math.min(c + 1, parts.length));
  const next = () => setIdx((idx + 1) % examples.length);

  return (
    <div style={{ padding: "26px 24px" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", textAlign: "center", marginBottom: 20 }}>
        Touchez « Bloc suivant » pour assembler la phrase, morceau par morceau
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, direction: "rtl", marginBottom: 22, flexWrap: "wrap" }}>
        {parts.map((word, i) => (
          <div key={i} className={i < revealedCount ? "fade-up" : ""} style={{
            padding: "12px 16px", borderRadius: 10, minWidth: 50, textAlign: "center",
            border: `1.5px solid ${i < revealedCount ? color : "var(--line)"}`,
            background: i < revealedCount ? `${color}12` : "var(--wall)",
          }}>
            <span className="arabic" style={{ fontSize: 19, color: i < revealedCount ? "var(--ink)" : "var(--ink-faint)" }}>
              {i < revealedCount ? word : "؟"}
            </span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        {revealedCount < parts.length ? (
          <button onClick={revealNext} style={{ padding: "10px 24px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Bloc suivant ({revealedCount}/{parts.length})
          </button>
        ) : (
          <div className="fade-in">
            <SpeakBtn text={ex.ar} color={color} />
            <div style={{ marginTop: 10 }}><Pron sci={ex.tr} fr={ex.trFr} size={12} color="var(--ink-faint)" /></div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "6px 0 14px" }}>{ex.fr}</p>
            <button onClick={next} style={{ padding: "9px 22px", borderRadius: 9, border: `1.5px solid ${color}40`, background: "transparent", color, cursor: "pointer", fontSize: 12.5 }}>
              {idx < examples.length - 1 ? "Phrase suivante →" : "Recommencer ↺"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE 6 ACTIVITIES — الضمائر
// ═══════════════════════════════════════════════════════════════════════

// 6a — "Pronoun agreement": shown أنا/أنتَ/أنتِ, pick the matching
// predicate form (m/f) — drills the agreement reflex specific to pronouns.
function PronounAgree({ examples, color }) {
  const pronGroups = [
    { pron: "أنَا", m: examples[0], f: examples[1] },
    { pron: "أنْتَ / أنْتِ", m: examples[2], f: examples[3] },
  ];
  const [gIdx, setGIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const g = pronGroups[gIdx];

  const choose = (which) => {
    setChosen(which);
    speak(which === "m" ? g.m.ar : g.f.ar);
  };
  const next = () => { setGIdx((gIdx + 1) % pronGroups.length); setChosen(null); };

  return (
    <div style={{ padding: "26px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 20 }}>Choisissez la forme qui correspond à votre genre</p>

      <div className="arabic" style={{ fontSize: 30, color: "var(--ink)", marginBottom: 20 }}>{g.pron}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        {["m", "f"].map(which => {
          const e = which === "m" ? g.m : g.f;
          const isChosen = chosen === which;
          return (
            <button key={which} onClick={() => choose(which)} className="focus-ring" style={{
              padding: "18px 10px", borderRadius: 12, cursor: "pointer",
              border: `1.5px solid ${isChosen ? color : "var(--line)"}`,
              background: isChosen ? `${color}14` : "var(--wall)",
            }}>
              <div className="arabic" style={{ fontSize: 20, color: "var(--ink)", marginBottom: 4 }}>{e.ar.split(" ").slice(1).join(" ")}</div>
              <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>{which === "m" ? "masculin" : "féminin"}</div>
            </button>
          );
        })}
      </div>

      {chosen && (
        <div className="fade-in">
          <div className="arabic" style={{ fontSize: 22, color, marginBottom: 4 }}>{chosen === "m" ? g.m.ar : g.f.ar}</div>
          <Pron sci={chosen === "m" ? g.m.tr : g.f.tr} fr={chosen === "m" ? g.m.trFr : g.f.trFr} size={12} color={color} />
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 14, marginTop: 4 }}>{chosen === "m" ? g.m.fr : g.f.fr}</div>
          <button onClick={next} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            {gIdx < pronGroups.length - 1 ? "Suivant →" : "Recommencer ↺"}
          </button>
        </div>
      )}
    </div>
  );
}

// 6b — "Pronoun story": a tiny 4-panel storyboard (هو/هي + lieu/métier)
// the learner advances through, reinforcing هو/هي in connected context
// rather than as isolated flashcards.
function PronounStory({ examples, color }) {
  const [panel, setPanel] = useState(0);
  const ex = examples[panel];

  return (
    <div style={{ padding: "26px 24px" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", textAlign: "center", marginBottom: 18 }}>Une petite histoire en quatre phrases</p>

      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
        {examples.map((_, i) => (
          <button key={i} onClick={() => setPanel(i)} style={{ width: i === panel ? 22 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === panel ? color : i < panel ? `${color}80` : "var(--stone3)", transition: "all .2s" }} />
        ))}
      </div>

      <div className="fade-up" key={panel} style={{ background: "var(--wall)", border: `1.5px solid ${color}30`, borderRadius: 18, padding: "32px 24px", textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 22, marginBottom: 10 }}>
          <Mark type={ex.gender === "m" ? "sun" : "moon"} size={26} color={color} />
        </div>
        <div className="arabic" style={{ fontSize: 30, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{ex.ar}</div>
        <Pron sci={ex.tr} fr={ex.trFr} size={12.5} color={color} />
        <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>{ex.fr}</div>
        <SpeakBtn text={ex.ar} color={color} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        <button onClick={() => setPanel(p => Math.max(0, p - 1))} disabled={panel === 0} className="focus-ring" style={{ padding: "9px 16px", borderRadius: 9, border: "1.5px solid var(--line)", background: "transparent", color: "var(--ink-soft)", cursor: panel === 0 ? "default" : "pointer", opacity: panel === 0 ? 0.4 : 1 }}>
          <Mark type="arrowL" size={15} />
        </button>
        <button onClick={() => setPanel(p => Math.min(examples.length - 1, p + 1))} disabled={panel === examples.length - 1} className="focus-ring" style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: panel === examples.length - 1 ? "default" : "pointer", opacity: panel === examples.length - 1 ? 0.4 : 1 }}>
          <Mark type="arrowR" size={15} color="var(--wall)" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE 7 ACTIVITIES — الجمع
// ═══════════════════════════════════════════════════════════════════════

// 7a — "Suffix builder": given a singular, choose the correct plural
// suffix from options (ـُونَ / ـَاتٌ / wrong ones) and watch it attach.
// Chosen because sound plurals are rule-based — testing suffix choice
// IS testing the rule.
function SuffixBuilder({ rows, color }) {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const row = rows[idx];
  const ALL_SUFFIXES = ["ُونَ", "َاتٌ", "ِينَ"];
  const options = useMemo(() => {
    const opts = new Set([row.suffix]);
    const shuffled = [...ALL_SUFFIXES].sort(() => Math.random() - 0.5);
    for (const s of shuffled) { if (opts.size >= 3) break; opts.add(s); }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  }, [idx]);

  const choose = (s) => {
    setAnswered(s);
    if (s === row.suffix) speak(row.pl);
  };
  const next = () => {
    if (idx < rows.length - 1) { setIdx(idx + 1); setAnswered(null); }
    else { setIdx(0); setAnswered(null); }
  };

  return (
    <div style={{ padding: "26px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 20 }}>Quel suffixe complète le pluriel ?</p>

      <div style={{ background: "var(--wall)", border: `1.5px solid ${color}30`, borderRadius: 16, padding: "24px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 8 }}>{row.fr.split(" → ")[0]}</div>
        <div className="arabic" style={{ fontSize: 28, color: "var(--ink)", marginBottom: 4 }}>{row.sing}</div>
        <div className="arabic" style={{ fontSize: 30, color, marginTop: 14, direction: "rtl" }}>
          {row.stem}<span style={{ opacity: answered ? 1 : 0.3 }}>{answered || "ـ ـ ـ"}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => choose(opt)} disabled={!!answered} className="focus-ring" style={{
            padding: "12px 18px", borderRadius: 10, cursor: answered ? "default" : "pointer",
            border: `1.5px solid ${answered === opt ? (opt === row.suffix ? "var(--green)" : "var(--rose)") : "var(--line)"}`,
            background: answered === opt ? (opt === row.suffix ? "var(--green-dim)" : "var(--rose-dim)") : "var(--wall)",
          }}><span className="arabic" style={{ fontSize: 18 }}>{opt}</span></button>
        ))}
      </div>

      {answered && (
        <div className="fade-in">
          <p style={{ fontSize: 12.5, color: answered === row.suffix ? "var(--green)" : "var(--rose)", fontWeight: 600, marginBottom: 4 }}>
            {answered === row.suffix ? "Exact : " : "La bonne forme : "}<span className="arabic">{row.pl}</span>
          </p>
          <Pron sci={row.plTr} fr={row.plFr} size={11.5} color="var(--ink-faint)" />
          <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginBottom: 14, marginTop: 2 }}>{row.fr}</div>
          <button onClick={next} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            {idx < rows.length - 1 ? "Suivant →" : "Recommencer ↺"}
          </button>
        </div>
      )}
    </div>
  );
}

// 7b — "Memory match": flip tiles to pair each irregular singular with
// its plural. Chosen because broken plurals are NOT rule-derivable —
// memorization is the honest task, so a memory game is the honest
// activity (mirrors 4b's reasoning, applied to a harder set).
function MemoryMatchPlural({ rows, color }) {
  const cards = useMemo(() => {
    const arr = [];
    rows.forEach((r, i) => {
      arr.push({ key: `s${i}`, pairId: i, ar: r.sing, kind: "sing" });
      arr.push({ key: `p${i}`, pairId: i, ar: r.pl, kind: "pl" });
    });
    return arr.sort(() => Math.random() - 0.5);
  }, [rows]);

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState([]);

  const click = (card) => {
    if (matched.includes(card.pairId) || flipped.find(f => f.key === card.key)) return;
    if (flipped.length === 1) {
      const a = flipped[0], b = card;
      if (a.pairId === b.pairId && a.kind !== b.kind) {
        setMatched(m => [...m, a.pairId]);
        setFlipped([]);
        speak(b.kind === "pl" ? b.ar : a.ar);
      } else {
        setWrong([a.key, b.key]);
        setTimeout(() => { setWrong([]); setFlipped([]); }, 650);
        setFlipped([a, b]);
      }
    } else {
      setFlipped([card]);
    }
  };

  const allMatched = matched.length === rows.length;
  const reset = () => { setFlipped([]); setMatched([]); setWrong([]); };

  return (
    <div style={{ padding: "26px 24px" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", textAlign: "center", marginBottom: 18 }}>
        Retrouvez chaque singulier et son pluriel irrégulier
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        {cards.map(card => {
          const isFlipped = flipped.find(f => f.key === card.key) || matched.includes(card.pairId);
          const isWrong = wrong.includes(card.key);
          return (
            <button key={card.key} onClick={() => click(card)} className="focus-ring" style={{
              padding: "18px 8px", minHeight: 70, borderRadius: 12, cursor: matched.includes(card.pairId) ? "default" : "pointer",
              border: `1.5px solid ${matched.includes(card.pairId) ? color : isWrong ? "var(--rose)" : "var(--line)"}`,
              background: matched.includes(card.pairId) ? `${color}10` : isWrong ? "var(--rose-dim)" : "var(--wall)",
              animation: isWrong ? "shake .35s ease" : "none",
            }}>
              {isFlipped ? (
                <span className="arabic fade-in" style={{ fontSize: card.kind === "sing" ? 18 : 16, color: "var(--ink)" }}>{card.ar}</span>
              ) : (
                <span style={{ fontSize: 18, color: "var(--ink-faint)" }}>؟</span>
              )}
            </button>
          );
        })}
      </div>

      {allMatched && (
        <div className="fade-up" style={{ textAlign: "center", marginTop: 20 }}>
          <p style={{ fontSize: 13, color, fontWeight: 600, marginBottom: 10 }}>Toutes les paires sont trouvées.</p>
          <button onClick={reset} style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${color}40`, background: "transparent", color, cursor: "pointer", fontSize: 12.5 }}>↺ Rejouer</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODULE 8 ACTIVITIES — الإضافة (capstone)
// ═══════════════════════════════════════════════════════════════════════

// 8a — "Idafa builder": pick two noun cards; the first automatically
// loses ال/tanwīn as it's placed, demonstrating the rule live rather
// than describing it.
function IdafaBuilder({ rows, color }) {
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState(0); // 0 = pick first, 1 = pick second, 2 = done
  const row = rows[idx];

  const next = () => { setIdx((idx + 1) % rows.length); setStage(0); };

  return (
    <div style={{ padding: "26px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 20 }}>Construisez l'annexion, bloc par bloc</p>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, direction: "rtl", marginBottom: 24, minHeight: 70 }}>
        <div style={{
          padding: "14px 18px", borderRadius: 10, border: `1.5px solid ${stage >= 1 ? color : "var(--line)"}`,
          background: stage >= 1 ? `${color}12` : "var(--wall)", minWidth: 90
        }}>
          <span className="arabic" style={{ fontSize: 20, color: stage >= 1 ? "var(--ink)" : "var(--ink-faint)" }}>{stage >= 1 ? row.first : "؟"}</span>
          {stage >= 1 && <div style={{ fontSize: 9, color, marginTop: 4 }}>مضاف</div>}
        </div>
        <div style={{
          padding: "14px 18px", borderRadius: 10, border: `1.5px solid ${stage >= 2 ? color : "var(--line)"}`,
          background: stage >= 2 ? `${color}12` : "var(--wall)", minWidth: 90
        }}>
          <span className="arabic" style={{ fontSize: 20, color: stage >= 2 ? "var(--ink)" : "var(--ink-faint)" }}>{stage >= 2 ? row.second : "؟"}</span>
          {stage >= 2 && <div style={{ fontSize: 9, color, marginTop: 4 }}>مضاف إليه</div>}
        </div>
      </div>

      {stage === 0 && (
        <button onClick={() => setStage(1)} style={{ padding: "10px 22px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          Placer le premier mot (sans ال, sans tanwīn)
        </button>
      )}
      {stage === 1 && (
        <button onClick={() => setStage(2)} style={{ padding: "10px 22px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          Placer le second mot (défini)
        </button>
      )}
      {stage === 2 && (
        <div className="fade-in">
          <Pron sci={row.tr} fr={row.trFr} size={12.5} color={color} />
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>{row.fr}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <SpeakBtn text={`${row.first} ${row.second}`} color={color} />
            <button onClick={next} style={{ padding: "9px 20px", borderRadius: 9, border: `1.5px solid ${color}40`, background: "transparent", color, cursor: "pointer", fontSize: 12.5 }}>Phrase suivante →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// 8b — "Capstone recap": full sentences combining idafa + nominal
// sentence; learner reveals subject (the idafa) vs predicate, tying the
// whole course together as the closing exercise.
function CapstoneRecap({ examples, color }) {
  const [idx, setIdx] = useState(0);
  const [showSplit, setShowSplit] = useState(false);
  const ex = examples[idx];
  const words = ex.ar.split(" ");
  const predicate = words[words.length - 1];
  const subject = words.slice(0, -1).join(" ");

  const next = () => { setIdx((idx + 1) % examples.length); setShowSplit(false); };

  return (
    <div style={{ padding: "26px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 20 }}>Le sujet est lui-même une annexion — retrouvez la structure</p>

      <div style={{ background: "var(--wall)", border: `1.5px solid ${color}30`, borderRadius: 18, padding: "30px 22px", marginBottom: 18 }}>
        {!showSplit ? (
          <div className="arabic" style={{ fontSize: 26, color: "var(--ink)", lineHeight: 1.8 }}>{ex.ar}</div>
        ) : (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <span style={{ fontSize: 9.5, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: 1 }}>مبتدأ — annexion</span>
              <div className="arabic" style={{ fontSize: 24, color: "var(--mihrab)" }}>{subject}</div>
            </div>
            <div>
              <span style={{ fontSize: 9.5, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: 1 }}>خبر</span>
              <div className="arabic" style={{ fontSize: 24, color: "var(--gold)" }}>{predicate}</div>
            </div>
          </div>
        )}
        <Pron sci={ex.tr} fr={ex.trFr} size={12} color={color} />
        <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>{ex.fr}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        <SpeakBtn text={ex.ar} color={color} />
        {!showSplit ? (
          <button onClick={() => setShowSplit(true)} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>Décomposer la phrase</button>
        ) : (
          <button onClick={next} style={{ padding: "9px 20px", borderRadius: 9, border: `1.5px solid ${color}40`, background: "transparent", color, cursor: "pointer", fontSize: 12.5 }}>
            {idx < examples.length - 1 ? "Suivante →" : "Recommencer ↺"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Activity router ────────────────────────────────────────────────────
function ActivityRouter({ lesson, color }) {
  switch (lesson.activity) {
    case "sort-niches": return <SortNiches words={lesson.words} color={color} />;
    case "root-extractor": return <RootExtractor words={lesson.words} color={color} />;
    case "tanwin-toggle": return <TanwinToggle pairs={lesson.pairs} color={color} />;
    case "sun-moon-sort": return <SunMoonSort examples={lesson.examples} color={color} />;
    case "sentence-builder": return <SentenceBuilder examples={lesson.examples} color={color} />;
    case "sentence-judge": return <SentenceJudge cases={lesson.cases} color={color} />;
    case "gender-flip": return <GenderFlip pairs={lesson.pairs} color={color} />;
    case "exception-memory": return <ExceptionMemory items={lesson.items} sentence={lesson.sentence} color={color} />;
    case "demo-match": return <DemoMatch items={lesson.items} color={color} />;
    case "demo-builder": return <DemoBuilder examples={lesson.examples} color={color} />;
    case "pronoun-agree": return <PronounAgree examples={lesson.examples} color={color} />;
    case "pronoun-story": return <PronounStory examples={lesson.examples} color={color} />;
    case "suffix-builder": return <SuffixBuilder rows={lesson.rows} color={color} />;
    case "memory-match": return <MemoryMatchPlural rows={lesson.rows} color={color} />;
    case "idafa-builder": return <IdafaBuilder rows={lesson.rows} color={color} />;
    case "capstone-recap": return <CapstoneRecap examples={lesson.examples} color={color} />;
    default: return null;
  }
}

// ─── Theory content per lesson (varies by data shape) ──────────────────
function TheoryBody({ lesson, color }) {
  return (
    <div style={{ padding: "24px" }}>
      <TheoryNote text={lesson.theory} color={color} />

      {lesson.words && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {lesson.words.map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--wall)", border: "1px solid var(--line)", borderRadius: 10 }}>
              <SpeakBtn text={w.ar} size={28} color={color} />
              <div>
                <div className="arabic" style={{ fontSize: 17, color: "var(--ink)" }}>{w.ar}</div>
                <Pron sci={w.tr} fr={w.trFr} size={10} color="var(--ink-faint)" />
                <div style={{ fontSize: 10.5, color: "var(--ink-faint)", marginTop: 1 }}>{w.fr}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lesson.pairs && lesson.pairs[0]?.indef && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lesson.pairs.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "var(--wall)", border: "1px solid var(--line)", borderRadius: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 90 }}>
                <span className="arabic" style={{ fontSize: 17, color: "var(--ink)" }}>{p.indef}</span>
                <Pron sci={p.indefTr} fr={p.indefFr} size={10} color="var(--ink-faint)" />
              </div>
              <Mark type="arrowL" size={13} color="var(--ink-faint)" />
              <div style={{ flex: 1, minWidth: 90 }}>
                <span className="arabic" style={{ fontSize: 17, color }}>{p.def}</span>
                <Pron sci={p.defTr} fr={p.defFr} size={10} color="var(--ink-faint)" />
              </div>
              <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{p.fr}</span>
            </div>
          ))}
        </div>
      )}

      {lesson.pairs && lesson.pairs[0]?.m && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lesson.pairs.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "var(--wall)", border: "1px solid var(--line)", borderRadius: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 90 }}>
                <span className="arabic" style={{ fontSize: 17, color: "var(--ink)" }}>{p.m}</span>
                <Pron sci={p.mTr} fr={p.mFr} size={10} color="var(--ink-faint)" />
              </div>
              <Mark type="arrowL" size={13} color="var(--ink-faint)" />
              <div style={{ flex: 1, minWidth: 90 }}>
                <span className="arabic" style={{ fontSize: 17, color }}>{p.f}</span>
                <Pron sci={p.fTr} fr={p.fFr} size={10} color="var(--ink-faint)" />
              </div>
              <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{p.fr}</span>
            </div>
          ))}
        </div>
      )}

      {lesson.sun && lesson.moon && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 4 }}>
          <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--rose-dim)", border: "1px solid rgba(168,80,63,.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><Mark type="sun" size={15} color="var(--rose)" /><span style={{ fontSize: 11, fontWeight: 600, color: "var(--rose)" }}>Solaires</span></div>
            <div className="arabic" style={{ fontSize: 17, color: "var(--ink)", letterSpacing: 4, lineHeight: 1.8 }}>{lesson.sun.join("  ")}</div>
          </div>
          <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--mihrab-dim)", border: "1px solid rgba(28,61,58,.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><Mark type="moon" size={15} color="var(--mihrab)" /><span style={{ fontSize: 11, fontWeight: 600, color: "var(--mihrab)" }}>Lunaires</span></div>
            <div className="arabic" style={{ fontSize: 17, color: "var(--ink)", letterSpacing: 4, lineHeight: 1.8 }}>{lesson.moon.join("  ")}</div>
          </div>
        </div>
      )}

      {lesson.examples && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: lesson.sun ? 16 : 0 }}>
          {lesson.examples.map((ex, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "var(--wall)", border: "1px solid var(--line)", borderRadius: 10 }}>
              <SpeakBtn text={ex.ar} size={30} color={color} />
              <div style={{ flex: 1 }}>
                <div className="arabic" style={{ fontSize: 18, color: "var(--ink)" }}>{ex.ar}</div>
                <Pron sci={ex.tr} fr={ex.trFr} size={10.5} color="var(--ink-faint)" />
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>{ex.fr}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lesson.items && lesson.items[0]?.demo && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {lesson.items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--wall)", border: "1px solid var(--line)", borderRadius: 10 }}>
              <div>
                <span className="arabic" style={{ fontSize: 16, color }}>{it.demo}</span>{" "}
                <span className="arabic" style={{ fontSize: 16, color: "var(--ink)" }}>{it.ar}</span>
                <Pron sci={it.tr} fr={it.trFr} size={10} color="var(--ink-faint)" />
              </div>
            </div>
          ))}
        </div>
      )}

      {lesson.items && lesson.items[0]?.reason && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {lesson.items.map((it, i) => (
            <div key={i} style={{ padding: "10px 14px", background: "var(--wall)", border: "1px solid var(--line)", borderRadius: 10, textAlign: "center" }}>
              <div className="arabic" style={{ fontSize: 16, color: "var(--ink)" }}>{it.ar}</div>
              <div style={{ fontSize: 9.5, color: "var(--ink-faint)" }}>{it.reason}</div>
            </div>
          ))}
        </div>
      )}

      {lesson.rows && lesson.rows[0]?.pl && !lesson.rows[0]?.first && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lesson.rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "var(--wall)", border: "1px solid var(--line)", borderRadius: 10, flexWrap: "wrap" }}>
              <span className="arabic" style={{ fontSize: 17, color: "var(--ink)", flex: 1, minWidth: 70 }}>{r.sing}</span>
              <Mark type="arrowL" size={13} color="var(--ink-faint)" />
              <div style={{ flex: 1, minWidth: 90 }}>
                <span className="arabic" style={{ fontSize: 17, color }}>{r.pl}</span>
                <Pron sci={r.plTr} fr={r.plFr} size={10} color="var(--ink-faint)" />
              </div>
              <span style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>{r.fr}</span>
            </div>
          ))}
        </div>
      )}

      {lesson.rows && lesson.rows[0]?.first && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lesson.rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--wall)", border: "1px solid var(--line)", borderRadius: 10, flexWrap: "wrap" }}>
              <SpeakBtn text={`${r.first} ${r.second}`} size={28} color={color} />
              <div style={{ flex: 1, minWidth: 120 }}>
                <span className="arabic" style={{ fontSize: 17, color: "var(--ink)" }}>{r.first} <span style={{ color }}>{r.second}</span></span>
                <Pron sci={r.tr} fr={r.trFr} size={10} color="var(--ink-faint)" />
              </div>
              <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{r.fr}</span>
            </div>
          ))}
        </div>
      )}

      {lesson.cases && (
        <div style={{ fontSize: 12, color: "var(--ink-faint)", padding: "12px 16px", background: "var(--wall)", borderRadius: 10, border: "1px solid var(--line)" }}>
          Direction l'activité ci-dessous pour tester votre intuition phrase par phrase.
        </div>
      )}
    </div>
  );
}

// ─── LessonView ──────────────────────────────────────────────────────────
function LessonView({ lesson, color, lessonNumber, onWritingScore }) {
  const [tab, setTab] = useState("theory");
  return (
    <div style={{ background: "var(--wall)", border: `1.5px solid ${color}22`, borderRadius: 18, marginBottom: 22, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14 }}>
        <div className="mono" style={{
          width: 38, height: 38, borderRadius: 10, background: `${color}14`, border: `1.5px solid ${color}35`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color, flexShrink: 0
        }}>{lessonNumber}</div>
        <div style={{ flex: 1 }}>
          <h3 className="display" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{lesson.title}</h3>
          <p style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 1 }}>{lesson.kicker}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 2, padding: "8px 12px", borderBottom: "1px solid var(--line)", background: "var(--stone2)" }}>
        {[{ id: "theory", label: "La règle" }, { id: "practice", label: "S'exercer" }, { id: "write", label: "Calligraphie" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="lintel-tab focus-ring" style={{
            padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            background: tab === t.id ? "var(--wall)" : "transparent",
            color: tab === t.id ? color : "var(--ink-faint)",
            fontSize: 12.5, fontWeight: tab === t.id ? 600 : 400, transition: "all .15s"
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "theory" && <TheoryBody lesson={lesson} color={color} />}
      {tab === "practice" && <ActivityRouter lesson={lesson} color={color} />}
      {tab === "write" && <Calligraphy lesson={lesson} color={color} onScore={onWritingScore} />}
    </div>
  );
}

// ─── Quiz panel ──────────────────────────────────────────────────────────
function QuizPanel({ quiz, color, onComplete }) {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = quiz[step];

  const pick = (i) => { if (sel !== null) return; setSel(i); if (i === q.ans) setScore(s => s + 1); };
  const next = () => {
    if (step + 1 >= quiz.length) {
      setDone(true);
      if (onComplete) onComplete(score);
      return;
    }
    setStep(s => s + 1); setSel(null);
  };
  const reset = () => { setStep(0); setSel(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / quiz.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "36px 20px" }}>
        <div className="display" style={{ fontSize: 44, fontWeight: 600, color, marginBottom: 6 }}>{score}/{quiz.length}</div>
        <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 22 }}>
          {pct === 100 ? "Module parfaitement maîtrisé." : pct >= 60 ? "Bon résultat — revoyez les erreurs si besoin." : "Reprenez la section « La règle » puis réessayez."}
        </div>
        <button onClick={reset} style={{ padding: "10px 26px", borderRadius: 10, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13.5, fontWeight: 600 }}>Recommencer</button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ display: "flex", gap: 4, marginBottom: 22 }}>
        {quiz.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < step ? color : i === step ? `${color}90` : "var(--stone3)", transition: "all .3s" }} />
        ))}
      </div>
      <div style={{ background: "var(--stone2)", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 10.5, color, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>Q{step + 1}</div>
        <p style={{ fontSize: 15.5, fontWeight: 500, color: "var(--ink)", lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: q.q.replace(/([^\s]*[\u0600-\u06FF][^\s]*)/g, `<span style="font-family:'Amiri',serif;font-size:21px;color:var(--ink)">$1</span>`) }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {q.opts.map((opt, i) => {
          let bg = "var(--wall)", bc = "var(--line)", tc = "var(--ink)";
          if (sel !== null) {
            if (i === q.ans) { bg = "var(--green-dim)"; bc = "var(--green)"; tc = "var(--green)"; }
            else if (i === sel) { bg = "var(--rose-dim)"; bc = "var(--rose)"; tc = "var(--rose)"; }
          }
          return (
            <button key={i} onClick={() => pick(i)} disabled={sel !== null} className="focus-ring" style={{
              background: bg, border: `1.5px solid ${bc}`, color: tc, borderRadius: 10, padding: "13px 16px",
              cursor: sel !== null ? "default" : "pointer", textAlign: "left", fontSize: 13.5, display: "flex", alignItems: "center", gap: 10
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10.5, fontWeight: 600, background: sel !== null && i === q.ans ? "var(--green)" : sel !== null && i === sel ? "var(--rose)" : "var(--stone3)",
                color: sel !== null && (i === q.ans || i === sel) ? "var(--wall)" : "var(--ink-soft)"
              }}>{sel !== null && i === q.ans ? "✓" : sel !== null && i === sel ? "✗" : String.fromCharCode(65 + i)}</span>
              <span style={opt.match(/[\u0600-\u06FF]/) ? { fontFamily: "'Amiri',serif", fontSize: 17 } : {}}>{opt}</span>
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <>
          <div className="fade-in" style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 14, background: sel === q.ans ? "var(--green-dim)" : "var(--gold-dim)", border: `1px solid ${sel === q.ans ? "rgba(63,122,92,.3)" : "rgba(185,134,63,.3)"}`, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
            <strong style={{ color: sel === q.ans ? "var(--green)" : "var(--gold)" }}>{sel === q.ans ? "Exact. " : "Pas tout à fait. "}</strong>{q.exp}
          </div>
          <button onClick={next} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            {step + 1 >= quiz.length ? "Terminer →" : "Suivante →"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────
export default function Grammaire() {
  const [modId, setModId] = useState(0);
  const [mainTab, setMainTab] = useState("cours");
  const [completed, setCompleted] = useState([]);
  const [writingScores, setWritingScores] = useState({}); // word -> best score
  const [showFrench, setShowFrench] = useState(true);
  const mod = MODULES.find(m => m.id === modId);
  const color = "var(--mihrab)";

  const recordWritingScore = useCallback((word, score) => {
    setWritingScores(prev => ({ ...prev, [word]: Math.max(prev[word] || 0, score) }));
  }, []);

  const wordsTraced = Object.keys(writingScores).length;
  const avgWritingScore = wordsTraced ? Math.round(Object.values(writingScores).reduce((a, b) => a + b, 0) / wordsTraced) : 0;

  const markModuleComplete = (moduleId) => {
    if (completed.includes(moduleId)) return;
    setCompleted(c => [...c, moduleId]);
    const m = MODULES.find(mm => mm.id === moduleId);
    saveProgress(`${COURSE_TITLE} — ${MODULE_PREFIX} ${m.num} — ${m.subtitle}`);
  };

  // NOTE on key format: this saves "<course> — Module <num> — <subtitle>"
  // as one flat string (3 segments). The Dashboard mirrors this exactly by
  // using "Module <num>" as the module title and <subtitle> as the lesson
  // title, so lessonKey() reproduces the same 3-segment string — see
  // Dashboard.jsx's ALL_COURSES entry for this course (id 4).

  // Load already-completed modules from the backend on mount — without this,
  // progress always reset to 0 when leaving and reentering the course
  // (this course previously didn't save to the backend at all).
  useEffect(() => {
    if (!getUser()) return;
    api.get("/api/me")
      .then(r => {
        const doneSet = new Set(r.data.completedLessons || []);
        const done = [];
        MODULES.forEach(m => {
          if (doneSet.has(`${COURSE_TITLE} — ${MODULE_PREFIX} ${m.num} — ${m.subtitle}`)) done.push(m.id);
        });
        setCompleted(done);
      })
      .catch(() => {});
  }, []);

  const goNextModule = () => {
    markModuleComplete(modId);
    if (modId < MODULES.length - 1) { setModId(modId + 1); setMainTab("cours"); }
  };

  return (
    <PronunciationContext.Provider value={{ showFrench }}>
    <div className="mosque-app">
      <style>{GS}</style>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", background: "var(--wall)", borderBottom: "1px solid var(--line)", padding: "44px 32px 36px", overflow: "hidden" }}>
        <MashrabiyaBackdrop opacity={0.16} />
        <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-faint)", letterSpacing: 0.5 }}>
              Safoua Academy · Grammaire arabe · Cours 1
            </div>
            <button onClick={() => setShowFrench(s => !s)} className="focus-ring" style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 6px 6px 12px", borderRadius: 20,
              border: `1.5px solid ${showFrench ? "var(--gold)" : "var(--line)"}`,
              background: showFrench ? "var(--gold-dim)" : "var(--stone2)", cursor: "pointer", transition: "all .2s"
            }}>
              <span style={{ fontSize: 11, color: showFrench ? "var(--gold)" : "var(--ink-faint)", fontWeight: 500 }}>Prononciation en français</span>
              <span style={{
                position: "relative", width: 30, height: 17, borderRadius: 10,
                background: showFrench ? "var(--gold)" : "var(--stone3)", transition: "background .2s", flexShrink: 0
              }}>
                <span style={{
                  position: "absolute", top: 2, left: showFrench ? 15 : 2, width: 13, height: 13, borderRadius: "50%",
                  background: "var(--wall)", transition: "left .2s"
                }} />
              </span>
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 22, height: 1.5, background: "var(--gold)" }} />
                <div className="arabic" style={{ fontSize: 26, color: "var(--mihrab)", fontWeight: 600 }}>{COURSE_META.title}</div>
              </div>
              <h1 className="display" style={{ fontSize: 32, fontWeight: 600, color: "var(--ink)", marginBottom: 10, lineHeight: 1.15 }}>{COURSE_META.subtitle}</h1>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", maxWidth: 480, lineHeight: 1.7 }}>{COURSE_META.forWho}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[{ v: MODULES.length, l: "Modules" }, { v: COURSE_META.totalLessons, l: "Leçons" }, { v: `${completed.length}/${MODULES.length}`, l: "Terminés" }, { v: wordsTraced ? `${avgWritingScore}%` : "—", l: "Calligraphie" }].map(s => (
                <div key={s.l} style={{ background: "var(--stone2)", borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 76 }}>
                  <div className="display" style={{ fontSize: 21, fontWeight: 600, color: "var(--mihrab)" }}>{s.v}</div>
                  <div style={{ fontSize: 9.5, color: "var(--ink-faint)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 4, background: "var(--stone3)" }}>
              <div style={{ height: "100%", borderRadius: 4, background: "var(--gold)", width: `${(completed.length / MODULES.length) * 100}%`, transition: "width .5s" }} />
            </div>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>{Math.round((completed.length / MODULES.length) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* ── Niche frieze navigation ──────────────────────────────────── */}
      <div style={{ background: "var(--stone2)", borderBottom: "1px solid var(--line)", padding: "20px 24px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", minWidth: 720, maxWidth: 1080, margin: "0 auto" }}>
          {MODULES.map(m => (
            <Niche key={m.id} active={modId === m.id} onClick={() => { setModId(m.id); setMainTab("cours"); }}
              num={m.num} label={m.subtitle} sublabel={`${m.lessons.length} leçons`} completed={completed.includes(m.id)} />
          ))}
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 64px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--mihrab)", letterSpacing: 1, marginBottom: 6 }}>MODULE {mod.num}</div>
            <h2 className="display" style={{ fontSize: 25, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{mod.subtitle}</h2>
            <span className="arabic" style={{ fontSize: 18, color: "var(--mihrab)" }}>{mod.title}</span>
            <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 8, maxWidth: 480 }}>{mod.description}</p>
          </div>
          <div style={{ display: "flex", gap: 4, background: "var(--stone2)", borderRadius: 10, padding: 4 }}>
            {[{ id: "cours", label: "Cours" }, { id: "quiz", label: "Quiz" }].map(t => (
              <button key={t.id} onClick={() => setMainTab(t.id)} className="focus-ring" style={{
                padding: "8px 18px", borderRadius: 7, border: "none", cursor: "pointer",
                background: mainTab === t.id ? "var(--wall)" : "transparent",
                color: mainTab === t.id ? "var(--mihrab)" : "var(--ink-faint)",
                fontSize: 12.5, fontWeight: mainTab === t.id ? 600 : 400, transition: "all .2s"
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {mainTab === "cours" && (
          <div>
            {mod.lessons.map((lesson, i) => (
              <LessonView key={lesson.id} lesson={lesson} color={color} lessonNumber={`${mod.num}.${i + 1}`} onWritingScore={recordWritingScore} />
            ))}
            <div style={{ padding: "20px 26px", borderRadius: 16, background: "var(--mihrab-dim)", border: "1.5px solid rgba(28,61,58,.18)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>Prêt pour le quiz ?</div>
                <p style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{mod.quiz.length} questions, avec explication à chaque réponse</p>
              </div>
              <button onClick={() => setMainTab("quiz")} className="focus-ring" style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--mihrab)", color: "var(--wall)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Démarrer le quiz →
              </button>
            </div>
          </div>
        )}

        {mainTab === "quiz" && (
          <ArchFrame tint="var(--mihrab)" padding="32px 30px">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--mihrab-dim2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mark type="scroll" size={19} color="var(--mihrab)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Quiz — {mod.subtitle}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{mod.quiz.length} questions</div>
              </div>
            </div>
            <QuizPanel quiz={mod.quiz} color="var(--mihrab)" onComplete={() => markModuleComplete(modId)} />
            {modId < MODULES.length - 1 && (
              <div style={{ textAlign: "center", marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
                <button onClick={goNextModule} className="focus-ring" style={{ padding: "9px 22px", borderRadius: 9, border: "1.5px solid rgba(28,61,58,.3)", background: "transparent", color: "var(--mihrab)", cursor: "pointer", fontSize: 12.5 }}>
                  Module suivant <Mark type="arrowR" size={12} color="var(--mihrab)" />
                </button>
              </div>
            )}
          </ArchFrame>
        )}

        {modId === MODULES.length - 1 && mainTab === "cours" && (
          <div style={{ marginTop: 28, padding: "20px 24px", borderRadius: 14, background: "var(--gold-dim)", border: "1px solid rgba(185,134,63,.25)", fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--gold)" }}>Et la suite ? </strong>{COURSE_META.next}
          </div>
        )}
      </div>
    </div>
    </PronunciationContext.Provider>
  );
}

// ─── Calligraphy tracking engine ───────────────────────────────────────────
// Pulls a practiceable word/phrase list out of any lesson's data shape
// (words / pairs / examples / items / rows all differ across modules).
function extractPracticeWords(lesson) {
  const out = [];
  const push = (ar, fr) => { if (ar && !out.find(o => o.ar === ar)) out.push({ ar, fr: fr || "" }); };
  (lesson.words || []).forEach(w => push(w.ar, w.fr));
  (lesson.pairs || []).forEach(p => {
    if (p.indef) { push(p.indef, p.fr); push(p.def, p.fr); }
    else if (p.m) { push(p.m, p.fr); push(p.f, p.fr); }
  });
  (lesson.examples || []).forEach(e => push(e.ar, e.fr));
  (lesson.items || []).forEach(it => { if (it.ar) push(it.demo ? `${it.demo} ${it.ar}` : it.ar, it.fr || it.reason); });
  (lesson.rows || []).forEach(r => {
    if (r.sing) { push(r.sing, r.fr); push(r.pl, r.fr); }
    else if (r.first) push(`${r.first} ${r.second}`, r.fr);
  });
  (lesson.cases || []).forEach(c => push(c.ar, c.fr));
  return out.slice(0, 8); // keep the practice set focused
}

// Renders the target word to an offscreen canvas once, then samples it
// into a binary ink mask used for live scoring as the learner traces.
function buildGuideMask(word, w, h) {
  const off = document.createElement("canvas");
  off.width = w; off.height = h;
  const ctx = off.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.floor(h * 0.5)}px Amiri, serif`;
  ctx.fillStyle = "#000";
  ctx.fillText(word, w / 2, h / 2 + h * 0.04);
  const data = ctx.getImageData(0, 0, w, h).data;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = data[i * 4 + 3] > 80 ? 1 : 0;
  return mask;
}

// Dilate a binary mask by `radius` px — builds the tolerance band around
// each stroke so handwriting that hugs the letterform (not pixel-perfect)
// still scores well.
function dilateMask(mask, w, h, radius) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w) out[ny * w + nx] = 1;
        }
      }
    }
  }
  return out;
}

// 17th activity — "Calligraphy": trace the target word over a faint guide.
// Scoring is real geometric pixel comparison (coverage of the guide's ink +
// precision of the learner's strokes within a tolerance band), not a
// placeholder — it genuinely rewards staying on the letterforms.
function Calligraphy({ lesson, color, onScore }) {
  const words = useMemo(() => extractPracticeWords(lesson), [lesson]);
  const [idx, setIdx] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [result, setResult] = useState(null); // { coverage, precision, overall }
  const [localScores, setLocalScores] = useState({}); // index -> best overall score, for this lesson's dot indicators
  const canvasRef = useRef(null);
  const guideMaskRef = useRef(null);
  const toleranceMaskRef = useRef(null);
  const drawnRef = useRef(null); // Uint8Array, learner's ink mask
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const W = 560, H = 170;
  const word = words[idx];

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !word) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    // faint guide glyph
    ctx.save();
    ctx.direction = "rtl"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `${Math.floor(H * 0.5)}px Amiri, serif`;
    ctx.fillStyle = `${color.startsWith("var") ? "#1c3d3a" : color}33`;
    ctx.globalAlpha = 0.35;
    ctx.fillText(word.ar, W / 2, H / 2 + H * 0.04);
    ctx.restore();
    // baseline
    ctx.strokeStyle = "rgba(35,38,42,.18)"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(16, H * 0.58); ctx.lineTo(W - 16, H * 0.58); ctx.stroke();
    ctx.setLineDash([]);

    const guide = buildGuideMask(word.ar, W, H);
    guideMaskRef.current = guide;
    toleranceMaskRef.current = dilateMask(guide, W, H, 6);
    drawnRef.current = new Uint8Array(W * H);
    setHasDrawn(false); setResult(null);
  }, [word, color]);

  useEffect(() => {
    let cancelled = false;
    const run = () => { if (!cancelled) setupCanvas(); };
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.load(`16px Amiri`).catch(() => {});
      document.fonts.ready.then(run);
    }
    run(); // draw immediately too, then the .ready redraw corrects the glyph if the font was still loading
    return () => { cancelled = true; };
  }, [idx, setupCanvas]);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: Math.round((src.clientX - r.left) * (W / r.width)),
      y: Math.round((src.clientY - r.top) * (H / r.height)),
    };
  };

  const markInk = (x, y) => {
    const radius = 3;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < W && ny >= 0 && ny < H && dx * dx + dy * dy <= radius * radius) {
          drawnRef.current[ny * W + nx] = 1;
        }
      }
    }
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
    drawing.current = true; setHasDrawn(true); setResult(null);
    markInk(lastPos.current.x, lastPos.current.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color.startsWith("var") ? "#1c3d3a" : color;
    ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
    // sample along the segment so fast strokes don't leave gaps in the mask
    const steps = Math.max(1, Math.ceil(Math.hypot(pos.x - lastPos.current.x, pos.y - lastPos.current.y) / 3));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      markInk(Math.round(lastPos.current.x + (pos.x - lastPos.current.x) * t), Math.round(lastPos.current.y + (pos.y - lastPos.current.y) * t));
    }
    lastPos.current = pos;
  };

  const endDraw = () => { drawing.current = false; };

  const clearCanvas = () => setupCanvas();

  const submit = () => {
    const guide = guideMaskRef.current, tol = toleranceMaskRef.current, drawn = drawnRef.current;
    if (!guide || !drawn) return;
    let guideTotal = 0, guideCovered = 0, drawnTotal = 0, drawnInTolerance = 0;
    for (let i = 0; i < guide.length; i++) {
      if (guide[i]) { guideTotal++; if (drawn[i]) guideCovered++; }
      if (drawn[i]) { drawnTotal++; if (tol[i]) drawnInTolerance++; }
    }
    if (drawnTotal < 30) { setResult({ empty: true }); return; }
    const coverage = guideTotal ? Math.round((guideCovered / guideTotal) * 100) : 0;
    const precision = drawnTotal ? Math.round((drawnInTolerance / drawnTotal) * 100) : 0;
    const overall = Math.round(coverage * 0.5 + precision * 0.5);
    setResult({ coverage, precision, overall });
    setLocalScores(prev => ({ ...prev, [idx]: Math.max(prev[idx] || 0, overall) }));
    if (onScore) onScore(word.ar, overall);
  };

  const next = () => setIdx((idx + 1) % words.length);

  if (!words.length) {
    return <div style={{ padding: "26px 24px", textAlign: "center", fontSize: 12.5, color: "var(--ink-faint)" }}>Pas de mot à tracer pour cette leçon.</div>;
  }

  const scoreLabel = (overall) => {
    if (overall >= 75) return { label: "Très net", tone: "var(--green)" };
    if (overall >= 50) return { label: "Bien", tone: "var(--gold)" };
    return { label: "À retravailler", tone: "var(--rose)" };
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Tracez par-dessus le modèle</p>
        <div style={{ display: "flex", gap: 6 }}>
          {words.map((_, i) => {
            const s = localScores[i];
            const dotColor = s === undefined ? "var(--stone3)" : s >= 75 ? "var(--green)" : s >= 50 ? "var(--gold)" : "var(--rose)";
            return (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Mot ${i + 1}`} style={{
                width: i === idx ? 18 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer",
                background: i === idx ? color : dotColor, opacity: i === idx ? 1 : s === undefined ? 1 : 0.85, transition: "all .2s"
              }} />
            );
          })}
        </div>
      </div>

      {word.fr && <div style={{ textAlign: "center", fontSize: 11.5, color: "var(--ink-faint)", marginBottom: 10 }}>{word.fr}</div>}

      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1.5px solid ${color}30`, background: "var(--wall)", marginBottom: 14, touchAction: "none" }}>
        <canvas
          ref={canvasRef} width={W} height={H}
          style={{ display: "block", width: "100%", height: "auto", cursor: "crosshair", touchAction: "none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        {!hasDrawn && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Tracez ici avec la souris ou le doigt</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={clearCanvas} className="focus-ring" style={{ padding: "9px 16px", borderRadius: 9, border: "1.5px solid var(--line)", background: "transparent", color: "var(--ink-soft)", cursor: "pointer", fontSize: 12.5 }}>Effacer</button>
        {hasDrawn && !result && (
          <button onClick={submit} className="focus-ring" style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: color, color: "var(--wall)", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>Valider mon tracé</button>
        )}
        <SpeakBtn text={word.ar} size={30} color={color} />

        {result && !result.empty && (
          <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 200, padding: "8px 14px", borderRadius: 9, background: `${scoreLabel(result.overall).tone}12` }}>
            <div className="display" style={{ fontSize: 19, fontWeight: 600, color: scoreLabel(result.overall).tone }}>{result.overall}%</div>
            <div style={{ fontSize: 10.5, color: "var(--ink-faint)", lineHeight: 1.4 }}>
              {scoreLabel(result.overall).label}<br />couverture {result.coverage}% · précision {result.precision}%
            </div>
          </div>
        )}
        {result && result.empty && (
          <div className="fade-in" style={{ fontSize: 11.5, color: "var(--rose)" }}>Tracez le mot avant de valider.</div>
        )}

        <button onClick={next} className="focus-ring" style={{ marginLeft: result ? 0 : "auto", padding: "9px 16px", borderRadius: 9, border: `1.5px solid ${color}40`, background: "transparent", color, cursor: "pointer", fontSize: 12.5, whiteSpace: "nowrap" }}>
          {idx < words.length - 1 ? "Mot suivant →" : "Recommencer ↺"}
        </button>
      </div>
    </div>
  );
}