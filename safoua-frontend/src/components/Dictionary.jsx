import React, { useState, useRef } from "react";
import { Search, Volume2, Globe, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import axios from "axios";
import { speakArabic } from "../utils/arabicTTS";

/* ── FONTS ─────────────────────────────────────────────────────── */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');`;

/* ── PALETTE ───────────────────────────────────────────────────── */
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
};

/* ── EXAMPLE WORDS ─────────────────────────────────────────────── */
const EXAMPLES = {
  english: ["peace", "knowledge", "light", "mercy", "faith", "heart", "sky", "love"],
  french:  ["paix", "lumière", "savoir", "miséricorde", "foi", "cœur", "ciel", "amour"],
};

/* ── AMBIENT ORBS ──────────────────────────────────────────────── */
function AmbientOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "-10%", right: "10%", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 65%)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ x: [0, -30, 25, 0], y: [0, 25, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ position: "absolute", bottom: "10%", left: "-5%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,181,132,0.05) 0%,transparent 65%)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ x: [0, 20, -15, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        style={{ position: "absolute", top: "45%", left: "40%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle,rgba(157,123,234,0.04) 0%,transparent 65%)", filter: "blur(70px)" }}
      />
    </div>
  );
}

/* ── GRID LINES ────────────────────────────────────────────────── */
function GridLines() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
      backgroundSize: "88px 88px", opacity: 0.5 }}
    />
  );
}

/* ── NOISE OVERLAY ─────────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2, opacity: 0.032, mixBlendMode: "overlay" }} xmlns="http://www.w3.org/2000/svg">
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  );
}

/* ── RESULT CARD ───────────────────────────────────────────────── */
function ResultCard({ results, onSpeak }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [.22, .68, 0, 1] }}
      style={{
        borderRadius: 28,
        background: C.card,
        border: `1px solid rgba(201,168,76,0.18)`,
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.06)",
      }}
    >
      {/* Gold accent top bar */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.teal}, transparent)` }} />

      {/* Arabic word hero section */}
      <div style={{
        padding: "48px 40px 36px",
        background: `linear-gradient(135deg, rgba(201,168,76,0.05) 0%, rgba(29,181,132,0.03) 100%)`,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
            Traduction en Arabe
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
            fontWeight: 700,
            color: C.goldL,
            lineHeight: 1,
            letterSpacing: "0.04em",
            direction: "rtl",
          }}>
            {results.arabic}
          </div>
        </div>
        <motion.button
          onClick={() => onSpeak(results.arabic)}
          whileHover={{ scale: 1.08, boxShadow: `0 0 28px rgba(201,168,76,0.35)` }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${C.gold}22, ${C.teal}18)`,
            border: `1.5px solid ${C.gold}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: `0 0 20px rgba(201,168,76,0.15)`,
            flexShrink: 0,
          }}
        >
          <Volume2 size={26} color={C.gold} />
        </motion.button>
      </div>

      {/* Details grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* Pronunciation */}
        <div style={{ padding: "24px 32px", borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
            📢 Prononciation
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", color: C.tealL, fontWeight: 600, lineHeight: 1.3 }}>
            [{results.pronunciation || results.arabic}]
          </div>
        </div>

        {/* Source word */}
        <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
            🔤 Mot source
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.text, fontWeight: 600, lineHeight: 1.3 }}>
            {results.word}
          </div>
        </div>

        {/* Meaning — full width */}
        <div style={{ padding: "24px 32px", gridColumn: "1 / -1" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
            📖 Sens & Définition
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "rgba(242,237,230,0.7)", lineHeight: 1.7 }}>
            {results.meaning}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 32px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        <Globe size={12} color={C.dim} />
        <span style={{ fontSize: 11, color: C.dim, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
          Traduit via {results.source} · Safoua Academy
        </span>
      </div>
    </motion.div>
  );
}

/* ── MAIN DICTIONARY ───────────────────────────────────────────── */
export default function Dictionary() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [results, setResults]           = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [searchLanguage, setSearchLanguage] = useState("english");
  const inputRef = useRef(null);

  const handleSearch = async (word) => {
    const term = (word || searchTerm).trim();
    if (!term) { setError("Veuillez entrer un mot à chercher"); return; }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/dictionary/translate`,
        { params: { word: term, language: searchLanguage } }
      );
      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.message || "Impossible de traduire ce mot.");
      }
    } catch {
      setError("Erreur de connexion. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  const speakWord = (arabic) => {
    speakArabic(arabic);
  };

  const exampleWords = EXAMPLES[searchLanguage];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
      <style>{FONT_LINK + `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(201,168,76,0.25); color: #f2ede6; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080b0f; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.25); border-radius: 99px; }
        .dict-input:focus { border-color: rgba(201,168,76,0.55) !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.08) !important; }
        .lang-btn:hover { transform: translateY(-1px); }
        .example-btn:hover { background: rgba(201,168,76,0.12) !important; color: #e8c97a !important; }
      `}</style>

      <GridLines />
      <AmbientOrbs />
      <NoiseOverlay />

      <div style={{ position: "relative", zIndex: 3, paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>

          {/* ── HERO HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [.22, .68, 0, 1] }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 99, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.28)", fontSize: 11, fontWeight: 600, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}
            >
              <Sparkles size={11} /> Dictionnaire · FR & EN → عربي
            </motion.div>

            {/* Arabic watermark */}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: -1 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(160px,22vw,320px)", color: "rgba(201,168,76,0.025)", lineHeight: 1, userSelect: "none", display: "block", marginTop: -60 }}>قاموس</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [.22, .68, 0, 1] }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem,6vw,4rem)", fontWeight: 700, lineHeight: 1.06, color: C.text, marginBottom: 18, letterSpacing: "-0.03em" }}
            >
              Dictionnaire{" "}
              <em style={{ fontStyle: "italic", background: `linear-gradient(135deg,${C.goldL} 0%,${C.tealL} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Arabe
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic", color: C.muted, lineHeight: 1.72, maxWidth: 480, margin: "0 auto" }}
            >
              Cherchez un mot en anglais ou en français pour obtenir sa traduction en arabe avec prononciation.
            </motion.p>
          </motion.div>

          {/* ── SEARCH BOX ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [.22, .68, 0, 1] }}
            style={{
              borderRadius: 28,
              background: C.card,
              border: `1px solid ${C.border}`,
              padding: "32px",
              marginBottom: 32,
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            }}
          >
            {/* Language Toggle */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24, justifyContent: "center" }}>
              {[
                { code: "english", flag: "🇬🇧", label: "English" },
                { code: "french",  flag: "🇫🇷", label: "Français" },
              ].map(l => (
                <button
                  key={l.code}
                  className="lang-btn"
                  onClick={() => { setSearchLanguage(l.code); setResults(null); setSearchTerm(""); setError(""); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 22px", borderRadius: 13, border: "none",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                    background: searchLanguage === l.code
                      ? `linear-gradient(135deg, ${C.gold}, ${C.teal})`
                      : "rgba(255,255,255,0.05)",
                    color: searchLanguage === l.code ? "#080b0f" : C.muted,
                    boxShadow: searchLanguage === l.code ? `0 0 24px rgba(201,168,76,0.3)` : "none",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{l.flag}</span> {l.label}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={18} color={C.gold} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  ref={inputRef}
                  className="dict-input"
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !loading && handleSearch()}
                  placeholder={searchLanguage === "english" ? "peace, knowledge, light…" : "paix, lumière, savoir…"}
                  style={{
                    width: "100%", paddingLeft: 48, paddingRight: 20, paddingTop: 14, paddingBottom: 14,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${C.border}`,
                    color: C.text, fontSize: 15,
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>
              <motion.button
                onClick={() => handleSearch()}
                disabled={loading}
                whileHover={!loading ? { scale: 1.04, boxShadow: `0 0 28px rgba(201,168,76,0.4)` } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                style={{
                  padding: "14px 22px", borderRadius: 14, border: "none",
                  background: loading ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg, ${C.gold}, ${C.teal})`,
                  color: loading ? C.muted : "#080b0f",
                  fontWeight: 700, fontSize: 14, cursor: loading ? "wait" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 7, flexShrink: 0,
                  boxShadow: loading ? "none" : `0 0 20px rgba(201,168,76,0.2)`,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Sparkles size={16} />
                  </motion.div>
                ) : (
                  <><ArrowRight size={16} /> Chercher</>
                )}
              </motion.button>
            </div>

            {/* Example Words */}
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.dim, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Essayez :
              </span>
              {exampleWords.map(w => (
                <button
                  key={w}
                  className="example-btn"
                  onClick={() => { setSearchTerm(w); handleSearch(w); }}
                  style={{
                    padding: "4px 12px", borderRadius: 99,
                    background: "rgba(201,168,76,0.07)",
                    border: `1px solid rgba(201,168,76,0.2)`,
                    color: C.gold, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── ERROR ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ padding: "16px 22px", borderRadius: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 24 }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── RESULT ── */}
          <AnimatePresence>
            {results && <ResultCard results={results} onSpeak={speakWord} />}
          </AnimatePresence>

          {/* ── EMPTY STATE ── */}
          {!results && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ textAlign: "center", padding: "60px 24px" }}
            >
              {/* Big Arabic glyph */}
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 96, color: `${C.gold}18`, lineHeight: 1, marginBottom: 20 }}>ع</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, color: C.muted, lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
                Entrez un mot pour découvrir sa traduction, sa prononciation et son sens en arabe.
              </p>

              {/* Decorative divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 240, margin: "32px auto 0" }}>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.border})` }} />
                <BookOpen size={14} color={C.dim} />
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}