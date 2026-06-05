import { useState, useRef, useEffect, useCallback } from "react";

const C = {
  bg: "#050408",
  surface: "#0c0b10",
  panel: "#13111a",
  border: "#1e1b28",
  accent: "#c084fc",
  accentLt: "#e879f9",
  gold: "#d97706",
  goldLt: "#fbbf24",
  text: "#ede8f5",
  muted: "#4c4268",
  mutedLt: "#8b7aac",
};

const STYLES = [
  { id: "naskh", name: "النسخ", fr: "Naskh", desc: "Style clair et lisible, utilisé dans les Corans imprimés et les textes courants.", color: "#c084fc", difficulty: "Débutant" },
  { id: "thuluth", name: "الثلث", fr: "Thuluth", desc: "Style noble et majestueux, utilisé pour les mosquées et les grandes inscriptions.", color: "#f59e0b", difficulty: "Intermédiaire" },
  { id: "ruqah", name: "الرقعة", fr: "Ruq'a", desc: "Style rapide et fonctionnel, utilisé dans l'écriture quotidienne moderne.", color: "#34d399", difficulty: "Débutant" },
];

const LETTERS_DATA = [
  { letter: "ب", style: "naskh", strokes: 2, tip: "Commencez par la courbe de gauche à droite, puis ajoutez le point inférieur. La base est horizontale et légèrement courbée.", proportion: "2 largeurs de plume", joinable: true },
  { letter: "ل", style: "naskh", strokes: 2, tip: "Tracez d'abord le trait oblique descendant à gauche, puis la petite boucle supérieure. C'est une lettre élégante au mouvement naturel.", proportion: "3 largeurs de plume", joinable: true },
  { letter: "م", style: "naskh", strokes: 1, tip: "Le Meem est un petit cercle compact avec une queue. Tournez dans le sens antihoraire pour le cercle, puis ajoutez la queue.", proportion: "2 largeurs de plume", joinable: true },
  { letter: "ع", style: "thuluth", strokes: 2, tip: "L'Ayn est une des lettres les plus difficiles. La forme ouverte en haut ressemble à un œil. Pratiquez la courbe supérieure séparément.", proportion: "3 largeurs de plume", joinable: true },
  { letter: "ن", style: "naskh", strokes: 2, tip: "Le Nun est un bol profond avec un point AU-DESSUS. Différent du Ba qui a le point en dessous. La courbure est douce.", proportion: "2 largeurs de plume", joinable: true },
  { letter: "و", style: "ruqah", strokes: 1, tip: "Le Waw commence par une tête ronde puis descend en spirale. Une seule forme, ne se connecte pas à la droite.", proportion: "2 largeurs de plume", joinable: false },
];

const WORDS = [
  { ar: "بِسْمِ اللَّه", tr: "Bismillāh", fr: "Au nom d'Allah", style: "naskh", level: "Débutant" },
  { ar: "اللَّه", tr: "Allāh", fr: "Allah", style: "thuluth", level: "Débutant" },
  { ar: "مُحَمَّد", tr: "Muḥammad", fr: "Muhammad ﷺ", style: "thuluth", level: "Intermédiaire" },
  { ar: "الحَمْد لِلَّه", tr: "Alḥamdulillāh", fr: "Louange à Allah", style: "naskh", level: "Intermédiaire" },
];

function DrawingCanvas({ letterData, color }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const lastPos = useRef(null);
  const [tool, setTool] = useState({ size: 4, opacity: 1 });

  const drawBackground = useCallback((ctx, w, h) => {
    ctx.fillStyle = "#0c0b10";
    ctx.fillRect(0, 0, w, h);
    // Grid lines
    ctx.strokeStyle = "rgba(167,139,250,.06)"; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    // Baseline
    ctx.strokeStyle = "rgba(167,139,250,.2)"; ctx.lineWidth = 1.5; ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(20, h * .62); ctx.lineTo(w - 20, h * .62); ctx.stroke();
    ctx.setLineDash([]);
    // Ghost letter
    if (showGuide && letterData?.letter) {
      ctx.font = `${h * .72}px 'Amiri', serif`;
      ctx.fillStyle = `${color}12`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(letterData.letter, w / 2, h * .72);
    }
  }, [showGuide, letterData, color]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    drawBackground(ctx, canvas.width, canvas.height);
  }, [drawBackground]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const startDraw = (e) => { e.preventDefault(); setDrawing(true); setHasDrawn(true); lastPos.current = getPos(e); };
  const draw = (e) => {
    e.preventDefault(); if (!drawing) return;
    const canvas = canvasRef.current; const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color; ctx.lineWidth = tool.size; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.globalAlpha = tool.opacity; ctx.stroke(); ctx.globalAlpha = 1;
    lastPos.current = pos;
  };
  const endDraw = () => { if (drawing) setStrokes(s => s + 1); setDrawing(false); };

  const clear = () => {
    const canvas = canvasRef.current; const ctx = canvas.getContext("2d");
    drawBackground(ctx, canvas.width, canvas.height);
    setHasDrawn(false); setStrokes(0);
  };

  return (
    <div style={{ background: C.panel, borderRadius: 16, padding: 16, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 12, color: C.mutedLt, fontFamily: "sans-serif" }}>Atelier de calligraphie</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setShowGuide(g => !g)} style={{ background: showGuide ? `${color}20` : "transparent", border: `1px solid ${showGuide ? color : C.border}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 11, color: showGuide ? color : C.mutedLt, fontFamily: "sans-serif" }}>
            👻 {showGuide ? "Guide ON" : "Guide OFF"}
          </button>
          <button onClick={clear} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 11, color: "#f87171", fontFamily: "sans-serif" }}>
            🗑 Effacer
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[2, 4, 8, 14].map(s => (
          <button key={s} onClick={() => setTool(t => ({ ...t, size: s }))}
            style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${tool.size === s ? color : C.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: s, height: s, borderRadius: "50%", background: tool.size === s ? color : C.mutedLt }} />
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} width={560} height={300}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        style={{ width: "100%", borderRadius: 10, cursor: "crosshair", touchAction: "none", display: "block" }} />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: C.muted, fontFamily: "sans-serif" }}>
        <span>{strokes} traits tracés</span>
        {hasDrawn && <span style={{ color: color }}>✓ Bien! Continuez à pratiquer</span>}
      </div>
    </div>
  );
}

function AIFeedback({ word, onClose }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [aspect, setAspect] = useState("general");

  const ASPECTS = {
    general: `Donne-moi des conseils généraux pour calligraphier le mot arabe "${word.ar}" (${word.fr}) en style ${word.style}. Explique les proportions, les connexions, les erreurs courantes. 200 mots max.`,
    history: `Quelle est l'histoire du style ${word.style} en calligraphie arabe? Quand a-t-il été développé, par qui, dans quel contexte culturel? Cites des grands maîtres calligraphes. 200 mots max.`,
    technique: `Explique en détail la technique pour écrire "${word.ar}" (${word.fr}): angle du calame, ordre des traits, épaisseur, corrections possibles. Sois très précis et technique. 200 mots max.`,
  };

  const generate = async (a) => {
    setAspect(a); setLoading(true); setFeedback("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: "Tu es un maître calligraphe arabe avec 30 ans d'expérience. Tu enseignes les styles Naskh, Thuluth, Ruq'a, Diwani. Tu donnes des conseils précis et encourageants en français.",
          messages: [{ role: "user", content: ASPECTS[a] }],
        }),
      });
      const data = await res.json();
      setFeedback(data.content?.[0]?.text || "Erreur.");
    } catch { setFeedback("Erreur de connexion."); }
    setLoading(false);
  };

  useEffect(() => { generate("general"); }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#1a0a2e,#0d0b1e)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "serif", fontSize: 28, color: C.accent }}>{word.ar}</span>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>Maître IA — {word.fr}</div>
              <div style={{ fontSize: 11, color: C.accent }}>Style {word.style}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 6 }}>
          {[["general", "💡 Conseils"], ["technique", "✏️ Technique"], ["history", "📜 Histoire"]].map(([k, l]) => (
            <button key={k} onClick={() => generate(k)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${aspect === k ? C.accent : C.border}`, background: aspect === k ? `${C.accent}20` : "transparent", color: aspect === k ? C.accent : C.mutedLt, cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", fontWeight: 600 }}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: C.mutedLt }}>
              <div style={{ width: 30, height: 30, border: `2px solid ${C.accent}30`, borderTop: `2px solid ${C.accent}`, borderRadius: "50%", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
              Consultation du maître...
            </div>
          ) : (
            <div style={{ fontSize: 14, lineHeight: 1.8, color: C.text, whiteSpace: "pre-wrap", fontFamily: "sans-serif" }}>{feedback}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Calligraphy() {
  const [activeStyle, setActiveStyle] = useState("naskh");
  const [activeLetter, setActiveLetter] = useState(0);
  const [activeTab, setActiveTab] = useState("practice");
  const [aiWord, setAiWord] = useState(null);
  const styleLetters = LETTERS_DATA.filter(l => l.style === activeStyle);
  const letter = styleLetters[activeLetter] || LETTERS_DATA[0];
  const style = STYLES.find(s => s.id === activeStyle);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Amiri:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade{animation:fadeIn .3s ease}
      `}</style>
      {aiWord && <AIFeedback word={aiWord} onClose={() => setAiWord(null)} />}

      {/* Hero */}
      <div style={{ background: "radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #050408 60%)", borderBottom: `1px solid ${C.border}`, padding: "40px 32px 28px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 8 }}>الخَطّ العَرَبِي</div>
          <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 700, color: "#fff", fontFamily: "'Cinzel', serif", letterSpacing: "-.5px", marginBottom: 8 }}>
            L'Art de la Calligraphie Arabe
          </h1>
          <p style={{ color: C.mutedLt, fontSize: 14, maxWidth: 500, margin: "0 auto 20px" }}>Maîtrisez les styles Naskh, Thuluth et Ruq'a — l'écriture en art sacré</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => { setActiveStyle(s.id); setActiveLetter(0); }}
                style={{ padding: "8px 18px", borderRadius: 20, border: `1.5px solid ${activeStyle === s.id ? s.color : C.border}`, background: activeStyle === s.id ? `${s.color}18` : "transparent", cursor: "pointer", fontWeight: 600, fontSize: 13, color: activeStyle === s.id ? s.color : C.mutedLt, transition: "all .2s" }}>
                <span style={{ fontFamily: "Amiri, serif", marginRight: 6 }}>{s.name}</span>{s.fr}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
        {/* Sidebar */}
        <aside>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>{style?.fr} — Lettres</div>
          {LETTERS_DATA.map((l, i) => (
            <button key={i} onClick={() => { setActiveLetter(i); setActiveTab("practice"); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${activeLetter === i ? style?.color : "transparent"}`, background: activeLetter === i ? `${style?.color}10` : "transparent", cursor: "pointer", marginBottom: 4, transition: "all .2s" }}>
              <span style={{ fontFamily: "Amiri, serif", fontSize: 24, color: activeLetter === i ? style?.color : "#fff", width: 32, textAlign: "center" }}>{l.letter}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, color: activeLetter === i ? style?.color : C.mutedLt, fontWeight: 600 }}>{l.tip.split(" ").slice(0, 3).join(" ")}...</div>
                <div style={{ fontSize: 10, color: C.muted }}>{l.strokes} trait{l.strokes > 1 ? "s" : ""}</div>
              </div>
            </button>
          ))}

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Style actuel</div>
            <div style={{ background: C.panel, borderRadius: 10, padding: "12px" }}>
              <div style={{ fontFamily: "Amiri, serif", fontSize: 18, color: style?.color, marginBottom: 4 }}>{style?.name}</div>
              <div style={{ fontSize: 11, color: C.mutedLt, lineHeight: 1.5 }}>{style?.desc}</div>
              <div style={{ marginTop: 8, padding: "4px 10px", background: `${style?.color}15`, borderRadius: 20, display: "inline-block", fontSize: 10, color: style?.color }}>
                {style?.difficulty}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: C.panel, borderRadius: 12, padding: 4, width: "fit-content", marginBottom: 20 }}>
            {[["practice", "✏️ Pratiquer"], ["words", "🖋️ Mots"], ["gallery", "🎨 Galerie"]].map(([k, l]) => (
              <button key={k} onClick={() => setActiveTab(k)}
                style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: activeTab === k ? style?.color : "transparent", color: activeTab === k ? "#fff" : C.muted, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "sans-serif" }}>
                {l}
              </button>
            ))}
          </div>

          {activeTab === "practice" && (
            <div className="fade">
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                  <div style={{ fontFamily: "Amiri, serif", fontSize: 80, color: style?.color, lineHeight: 1 }}>{letter.letter}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Lettre {letter.letter}</div>
                    <div style={{ fontSize: 13, color: C.mutedLt, marginBottom: 8, lineHeight: 1.5 }}>📐 Proportion: {letter.proportion}</div>
                    <div style={{ fontSize: 13, color: C.mutedLt }}>{letter.joinable ? "✓ Se connecte" : "✗ Ne se connecte pas"}</div>
                  </div>
                </div>
                <div style={{ background: "rgba(167,139,250,.08)", borderRadius: 10, padding: "12px 16px", borderLeft: `3px solid ${style?.color}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: style?.color, marginBottom: 4 }}>💡 Conseil du maître</div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{letter.tip}</div>
                </div>
              </div>
              <DrawingCanvas letterData={letter} color={style?.color || C.accent} />
            </div>
          )}

          {activeTab === "words" && (
            <div className="fade">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                {WORDS.map((w, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", transition: "all .2s" }}>
                    <div style={{ textAlign: "center", marginBottom: 14 }}>
                      <div style={{ fontFamily: "Amiri, serif", fontSize: 42, color: "#fff", direction: "rtl", lineHeight: 1.4 }}>{w.ar}</div>
                      <div style={{ fontSize: 13, color: C.accent, fontWeight: 600, marginTop: 6 }}>{w.tr}</div>
                      <div style={{ fontSize: 12, color: C.mutedLt }}>{w.fr}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12 }}>
                      <span style={{ background: "rgba(167,139,250,.1)", borderRadius: 20, padding: "2px 10px", fontSize: 10, color: C.accent, fontWeight: 600 }}>{w.style}</span>
                      <span style={{ background: "rgba(255,255,255,.04)", borderRadius: 20, padding: "2px 10px", fontSize: 10, color: C.mutedLt }}>{w.level}</span>
                    </div>
                    <button onClick={() => setAiWord(w)}
                      style={{ width: "100%", background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 10, padding: "8px", cursor: "pointer", color: C.accent, fontSize: 12, fontWeight: 600, fontFamily: "sans-serif" }}>
                      ✨ Consulter le maître IA
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="fade">
              <div style={{ background: C.surface, borderRadius: 16, padding: "28px", textAlign: "center", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Galerie de Maîtres</h3>
                <p style={{ color: C.mutedLt, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                  Quelques chefs-d'œuvre inspirants de la calligraphie islamique classique
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { text: "بِسْمِ اللَّهِ", style: "Naskh classique", color: "#c084fc" },
                    { text: "الله", style: "Thuluth majestueux", color: "#f59e0b" },
                    { text: "مُحَمَّد ﷺ", style: "Diwani libre", color: "#34d399" },
                    { text: "الحَمْد لِلَّه", style: "Kufique géométrique", color: "#f43f5e" },
                    { text: "لَا إِلَٰهَ إِلَّا اللَّه", style: "Nastaliq persan", color: "#0ea5e9" },
                    { text: "اقْرَأ", style: "Ruq'a moderne", color: "#d97706" },
                  ].map((item, i) => (
                    <div key={i} style={{ background: C.panel, borderRadius: 12, padding: "20px 12px", border: `1px solid ${item.color}20` }}>
                      <div style={{ fontFamily: "Amiri, serif", fontSize: 28, color: item.color, direction: "rtl", marginBottom: 8, lineHeight: 1.5 }}>{item.text}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{item.style}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}