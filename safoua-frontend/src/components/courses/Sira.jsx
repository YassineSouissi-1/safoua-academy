import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#06050a",
  surface: "#0e0c14",
  panel: "#141220",
  border: "#1e1b2e",
  accent: "#a78bfa",
  accentLt: "#c4b5fd",
  gold: "#d4a017",
  goldLt: "#f0c040",
  text: "#ede8f5",
  muted: "#4c4670",
  mutedLt: "#7c72a0",
};

const EVENTS = [
  {
    year: "570 CE",
    yearAr: "عام الفيل",
    title: "Naissance du Prophète ﷺ",
    titleAr: "مولد النبي ﷺ",
    icon: "🌟",
    color: "#f59e0b",
    place: "La Mecque",
    category: "Naissance",
    body: "Muhammad ibn Abdallāh ﷺ naquit dans la tribu des Quraysh, clan des Banū Hāshim, à La Mecque. Son père Abdallāh était décédé avant sa naissance. Il fut confié à la nourrice Halīma As-Sa'diyya chez les Banū Sa'd. C'est l'Année de l'Éléphant, lorsqu'Abraha tenta de détruire la Ka'ba.",
    lessons: ["L'importance des origines nobles", "Allah protège ce qu'Il a choisi", "La valeur du service aux pauvres et aux orphelins"],
    quranRef: "Sourate Al-Fīl (105) — Événement de l'Éléphant",
  },
  {
    year: "610 CE",
    yearAr: "سنة البعثة",
    title: "Première Révélation",
    titleAr: "نزول الوحي",
    icon: "📖",
    color: "#8b5cf6",
    place: "Grotte Hirā'",
    category: "Prophétie",
    body: "À 40 ans, pendant le mois de Ramadan, le Prophète ﷺ reçut la première révélation dans la grotte Hirā'. L'ange Jibrīl lui dit : « Lis! (اقرأ) ». Khadīja, sa première épouse, le réconforta et le conduisit vers Waraqah ibn Nawfal qui confirma sa prophétie. Ce fut le début de la mission prophétique.",
    lessons: ["L'importance de la connaissance (اقرأ)", "Le rôle du soutien familial dans les moments difficiles", "Allah ne confie une mission qu'à celui qui peut la porter"],
    quranRef: "Sourate Al-Alaq (96:1-5) — Première révélation",
  },
  {
    year: "622 CE",
    yearAr: "الهجرة",
    title: "L'Hégire vers Médine",
    titleAr: "الهجرة إلى المدينة",
    icon: "🌙",
    color: "#10b981",
    place: "La Mecque → Médine",
    category: "Hégire",
    body: "Face aux persécutions, Allah ordonna l'émigration vers Médine (Yathrib). Le Prophète ﷺ et Abu Bakr se cachèrent dans la grotte de Thawr pendant 3 jours. À Médine, il instaura la Constitution de Médine, fraternisa les Muhājirūn (emigrants) et les Anṣār (partisans). Cette date marque le début du calendrier islamique (1 AH).",
    lessons: ["Le sacrifice pour la vérité", "L'importance de la communauté (أمة)", "La stratégie et la patience dans l'adversité"],
    quranRef: "Sourate At-Tawbah (9:40) — Les deux dans la grotte",
  },
  {
    year: "624 CE",
    yearAr: "غزوة بدر",
    title: "Bataille de Badr",
    titleAr: "غزوة بدر الكبرى",
    icon: "⚔️",
    color: "#ef4444",
    place: "Vallée de Badr",
    category: "Bataille",
    body: "La première grande bataille de l'Islam. 313 musulmans contre ~1000 Qurayshites. Allah envoya des anges pour aider les croyants. Une victoire décisive qui établit la crédibilité de la communauté musulmane. 70 chefs qurayshites tués, 70 capturés. Les captifs furent traités avec dignité — certains furent libérés contre l'enseignement de l'alphabétisation.",
    lessons: ["La confiance en Allah malgré les probabilités", "La miséricorde même envers les ennemis", "La foi transforme les forces en actes"],
    quranRef: "Sourate Al-Anfāl (8:17) — 'Ce n'est pas vous qui avez tué...'",
  },
  {
    year: "630 CE",
    yearAr: "فتح مكة",
    title: "Conquête de La Mecque",
    titleAr: "فتح مكة المكرمة",
    icon: "🕌",
    color: "#0ea5e9",
    place: "La Mecque",
    category: "Victoire",
    body: "10 ans après l'Hégire, le Prophète ﷺ entra à La Mecque avec 10 000 compagnons. Il déclara une amnistie générale: « Allez, vous êtes libres! (اذهبوا فأنتم الطلقاء) ». Il détruisit les 360 idoles de la Ka'ba en récitant: « La vérité est venue et le mensonge a péri (Coran 17:81) ». Moment de pardon sans précédent dans l'histoire.",
    lessons: ["Le pardon est plus puissant que la vengeance", "La victoire ne doit pas corrompre", "La patient mène à la récompense ultime"],
    quranRef: "Sourate Al-Fatḥ (48:1) — 'Nous t'avons accordé une victoire éclatante'",
  },
  {
    year: "632 CE",
    yearAr: "حجة الوداع",
    title: "Le Pèlerinage d'Adieu",
    titleAr: "خطبة الوداع",
    icon: "🌿",
    color: "#d97706",
    place: "Mont Arafat",
    category: "Message final",
    body: "Le Prophète ﷺ prononça son discours d'adieu devant 124 000 compagnons: « Ô gens! Vos vies, vos biens et votre honneur vous sont sacrés... Les femmes ont des droits sur vous... Vous rendrez compte. Ai-je bien transmis le message? » Peu après, il rendit l'âme le 12 Rabi' Al-Awwal à Médine. Il avait 63 ans.",
    lessons: ["Les droits humains sont islamiques", "La Sunnah et le Coran : guides éternels", "La vie est une mission à accomplir"],
    quranRef: "Sourate Al-Mā'idah (5:3) — 'Aujourd'hui, j'ai parachevé...'",
  },
];

function AIStoryteller({ event, onClose }) {
  const [mode, setMode] = useState("story");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const PROMPTS = {
    story: `Raconte-moi l'histoire de "${event.title}" de manière vivante et immersive, comme si j'étais présent. Inclus des détails humains, des émotions, le contexte historique. Maximum 250 mots. En français.`,
    lesson: `Quelles leçons de vie peut-on tirer de l'événement "${event.title}" pour un Muslim contemporain? Donne 5 leçons pratiques avec des preuves coraniques ou des hadiths. En français.`,
    context: `Explique le contexte historique mondial (géopolitique, social, religieux) de "${event.title}" en ${event.year}. Qu'est-ce qui se passait en Arabie et dans le monde à cette époque? En français, 200 mots max.`,
  };

  const generate = async (m) => {
    setMode(m); setLoading(true); setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Tu es un historien islamique passionné et pédagogue. Tu racontes la Sīra du Prophète Muhammad ﷺ avec précision historique et enthousiasme. Tu cites les sources (Coran, Bukhari, Muslim, Ibn Hishām) quand possible.",
          messages: [{ role: "user", content: PROMPTS[m] }],
        }),
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "Erreur.");
    } catch { setResult("Erreur de connexion."); }
    setLoading(false);
  };

  useEffect(() => { generate("story"); }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, width: "100%", maxWidth: 640, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#1a0a2e,#0d0b1e)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>{event.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>IA Narrateur — {event.title}</div>
              <div style={{ fontSize: 11, color: C.accentLt }}>Powered by Claude</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 6 }}>
          {[["story", "📖 Histoire vive"], ["lesson", "💡 Leçons modernes"], ["context", "🌍 Contexte historique"]].map(([k, l]) => (
            <button key={k} onClick={() => generate(k)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${mode === k ? event.color : C.border}`, background: mode === k ? `${event.color}20` : "transparent", color: mode === k ? event.color : C.mutedLt, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: C.mutedLt }}>
              <div style={{ width: 32, height: 32, border: `2px solid ${C.accent}40`, borderTop: `2px solid ${C.accent}`, borderRadius: "50%", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
              <div style={{ fontSize: 13 }}>Génération en cours...</div>
            </div>
          ) : (
            <div style={{ fontSize: 14, lineHeight: 1.8, color: C.text, whiteSpace: "pre-wrap" }}>{result}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sira() {
  const [selectedEvent, setSelectedEvent] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const event = EVENTS[selectedEvent];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Georgia, 'IBM Plex Sans Arabic', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade{animation:fadeIn .4s ease}
      `}</style>
      {showAI && <AIStoryteller event={event} onClose={() => setShowAI(false)} />}

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg,#1a0a2e 0%,#06050a 100%)", borderBottom: `1px solid ${C.border}`, padding: "44px 32px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: C.accentLt, textTransform: "uppercase", marginBottom: 10, fontFamily: "sans-serif" }}>السيرة النبوية</div>
          <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, color: "#fff", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.15, marginBottom: 8 }}>
            La Vie du Prophète <span style={{ color: C.goldLt }}>Muhammad ﷺ</span>
          </h1>
          <p style={{ color: C.mutedLt, fontSize: 15, lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
            Un voyage spirituel et historique à travers les événements fondateurs de l'Islam
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ overflowX: "auto", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ display: "flex", gap: 0, minWidth: "max-content", padding: "0 24px" }}>
          {EVENTS.map((e, i) => (
            <button key={i} onClick={() => setSelectedEvent(i)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer", position: "relative", transition: "all .2s" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: selectedEvent === i ? e.color : `${e.color}20`, border: `2px solid ${selectedEvent === i ? e.color : `${e.color}40`}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all .2s" }}>{e.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: selectedEvent === i ? e.color : C.mutedLt, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{e.year}</div>
              <div style={{ fontSize: 11, color: selectedEvent === i ? "#fff" : C.muted, whiteSpace: "nowrap", fontFamily: "sans-serif", maxWidth: 100, textAlign: "center", lineHeight: 1.3 }}>{e.title.split(" ").slice(0, 3).join(" ")}</div>
              {selectedEvent === i && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: 2, background: e.color }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Event detail */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <div className="fade" key={selectedEvent}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", marginBottom: 24 }}>
            <div style={{ background: `linear-gradient(135deg, ${event.color}15, transparent)`, borderBottom: `1px solid ${C.border}`, padding: "24px 28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <span style={{ background: `${event.color}20`, border: `1px solid ${event.color}40`, borderRadius: 20, padding: "3px 12px", fontSize: 12, color: event.color, fontFamily: "sans-serif", fontWeight: 600 }}>{event.category}</span>
                  <span style={{ background: "rgba(255,255,255,.04)", borderRadius: 20, padding: "3px 12px", fontSize: 12, color: C.mutedLt, fontFamily: "sans-serif" }}>📍 {event.place}</span>
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>{event.title}</h2>
                <div style={{ fontFamily: "serif", fontSize: 20, color: event.color }}>{event.titleAr}</div>
                <div style={{ fontSize: 13, color: C.mutedLt, fontFamily: "sans-serif", marginTop: 4 }}>{event.year} — {event.yearAr}</div>
              </div>
              <span style={{ fontSize: 56 }}>{event.icon}</span>
            </div>

            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontSize: 15, color: C.text, lineHeight: 1.85, marginBottom: 24, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>{event.body}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ background: C.panel, borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.mutedLt, textTransform: "uppercase", marginBottom: 10, fontFamily: "sans-serif" }}>Leçons</div>
                  {event.lessons.map((l, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.text, lineHeight: 1.5, fontFamily: "sans-serif" }}>
                      <span style={{ color: event.color, flexShrink: 0 }}>✦</span> {l}
                    </div>
                  ))}
                </div>
                <div style={{ background: C.panel, borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.mutedLt, textTransform: "uppercase", marginBottom: 10, fontFamily: "sans-serif" }}>Référence Coran</div>
                  <div style={{ fontSize: 13, color: event.color, lineHeight: 1.6, fontStyle: "italic", fontFamily: "sans-serif" }}>📖 {event.quranRef}</div>
                </div>
              </div>

              <button onClick={() => setShowAI(true)}
                style={{ width: "100%", background: `linear-gradient(135deg, ${event.color}20, ${event.color}10)`, border: `1px solid ${event.color}40`, borderRadius: 14, padding: "14px", cursor: "pointer", color: event.color, fontWeight: 700, fontSize: 14, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                ✨ Explorer avec l'IA — Histoire vivante, leçons modernes, contexte historique
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setSelectedEvent(i => Math.max(0, i - 1))} disabled={selectedEvent === 0}
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.mutedLt, borderRadius: 12, padding: "10px 20px", cursor: selectedEvent === 0 ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontWeight: 600, fontSize: 13, opacity: selectedEvent === 0 ? .4 : 1 }}>
              ← Événement précédent
            </button>
            <div style={{ fontSize: 12, color: C.muted, alignSelf: "center", fontFamily: "sans-serif" }}>{selectedEvent + 1} / {EVENTS.length}</div>
            <button onClick={() => setSelectedEvent(i => Math.min(EVENTS.length - 1, i + 1))} disabled={selectedEvent === EVENTS.length - 1}
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.mutedLt, borderRadius: 12, padding: "10px 20px", cursor: selectedEvent === EVENTS.length - 1 ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontWeight: 600, fontSize: 13, opacity: selectedEvent === EVENTS.length - 1 ? .4 : 1 }}>
              Événement suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}