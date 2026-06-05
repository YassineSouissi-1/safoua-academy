import { useState } from "react";

const C = {
  bg: "#080b0f",
  surface: "#0f1318",
  panel: "#161c24",
  border: "#1e2832",
  accent: "#ef4444",
  accentLt: "#fca5a5",
  text: "#e7edf3",
  muted: "#4b5563",
  mutedLt: "#9ca3af",
};

const PILLARS = [
  {
    id: 0, ar: "الطَّهَارَة", fr: "La Purification", icon: "💧", color: "#0ea5e9",
    subtitle: "Conditions de l'adoration",
    desc: "La purification (طهارة) est la condition première pour la prière et de nombreux actes d'adoration. Elle englobe la purification physique et spirituelle.",
    rulings: [
      { title: "الوضوء — L'ablution (Wudhu)", level: "فرض", levelFr: "Obligatoire", text: "Le Wudhu est obligatoire avant la prière. Il consiste à laver visage, mains, se passer les mains sur la tête et laver les pieds. Conditions: intention (نية), eau pure, ordre correct.", evidence: "Sourate Al-Mā'idah 5:6" },
      { title: "الغسل — La grande ablution (Ghusl)", level: "فرض", levelFr: "Obligatoire", text: "Le Ghusl devient obligatoire après la janāba (impureté majeure), les menstruations, l'accouchement. Il faut mouiller tout le corps.", evidence: "Sourate An-Nisā' 4:43" },
      { title: "التيمم — L'ablution sèche", level: "رخصة", levelFr: "Dispense", text: "Quand l'eau est absente ou nuisible, on frappe la terre propre une fois avec les mains et on se touche le visage et les mains.", evidence: "Sourate Al-Mā'idah 5:6" },
    ],
    quiz: [
      { q: "Combien de fois frappe-t-on la terre pour le Tayammum?", opts: ["Deux fois", "Une seule fois", "Trois fois", "Quatre fois"], ans: 1 },
      { q: "Le Wudhu est:", opts: ["Sunnah", "Moustahabb", "Fard (obligatoire)", "Makruh"], ans: 2 },
    ],
  },
  {
    id: 1, ar: "الصَّلَاة", fr: "La Prière", icon: "🕌", color: "#8b5cf6",
    subtitle: "Pilier de l'Islam",
    desc: "La prière (صلاة) est le second pilier de l'Islam. Elle est obligatoire 5 fois par jour pour tout musulman pubère et sain d'esprit.",
    rulings: [
      { title: "أوقات الصلاة — Les heures de prière", level: "فرض", levelFr: "Obligatoire", text: "Al-Fajr (aube), Ad-Dhuhr (midi), Al-Asr (après-midi), Al-Maghrib (coucher du soleil), Al-Ishā' (soir). Chaque prière a une heure précise.", evidence: "Sourate An-Nisā' 4:103" },
      { title: "شروط صحة الصلاة — Conditions de validité", level: "شرط", levelFr: "Condition", text: "Purification, couverture de l'awra, direction de la Qibla, entrée du temps de prière, intention (نية).", evidence: "Hadith du Prophète ﷺ" },
      { title: "صلاة الجماعة — Prière en congrégation", level: "واجب", levelFr: "Requis", text: "La prière en congrégation à la mosquée est fortement recommandée pour les hommes. Sa récompense est 27 fois supérieure à la prière individuelle.", evidence: "Sahih Muslim" },
    ],
    quiz: [
      { q: "Combien de prières obligatoires y a-t-il par jour?", opts: ["3", "4", "5", "6"], ans: 2 },
      { q: "La prière en congrégation vaut combien de fois plus?", opts: ["7 fois", "17 fois", "27 fois", "70 fois"], ans: 2 },
    ],
  },
  {
    id: 2, ar: "الزَّكَاة", fr: "La Zakat", icon: "🌿", color: "#10b981",
    subtitle: "Purification des biens",
    desc: "La Zakat est le troisième pilier : un prélèvement annuel obligatoire sur la richesse excédant le nisāb (seuil minimum), destiné aux 8 catégories bénéficiaires.",
    rulings: [
      { title: "النصاب — Le seuil minimum", level: "شرط", levelFr: "Condition", text: "Le Nisāb pour l'or est de 85g, pour l'argent 595g. La Zakat n'est due que si la richesse a atteint ce seuil pendant un an complet.", evidence: "Hadith mutwātir" },
      { title: "مصارف الزكاة — Bénéficiaires", level: "فرض", levelFr: "Obligatoire", text: "8 catégories : les pauvres (فقراء), les nécessiteux (مساكين), les collecteurs, ceux dont le cœur est à attirer, les esclaves à libérer, les endettés, la cause d'Allah, les voyageurs.", evidence: "Sourate At-Tawbah 9:60" },
      { title: "زكاة الفطر — Zakat Al-Fitr", level: "واجب", levelFr: "Obligatoire", text: "Obligatoire pour tout musulman capable, à payer avant la prière de l'Aïd. Équivaut à un Sa' (≈2.4 kg) de nourriture de base.", evidence: "Sahih Bukhari & Muslim" },
    ],
    quiz: [
      { q: "Le Nisāb pour l'or est:", opts: ["50g", "85g", "100g", "200g"], ans: 1 },
      { q: "Combien de catégories bénéficiaires de la Zakat?", opts: ["5", "6", "7", "8"], ans: 3 },
    ],
  },
  {
    id: 3, ar: "الصِّيَام", fr: "Le Jeûne", icon: "🌙", color: "#f59e0b",
    subtitle: "Ramadan et jeûnes",
    desc: "Le jeûne de Ramadan est le quatrième pilier : s'abstenir de manger, boire, relations conjugales du Fajr au Maghrib pendant le mois de Ramadan.",
    rulings: [
      { title: "فرائض الصيام — Obligations du jeûne", level: "فرض", levelFr: "Obligatoire", text: "Intention (niyya) avant le Fajr, abstention de tout ce qui rompt le jeûne du Fajr au Maghrib. Condition: Islam, puberté, santé mentale, absence de voyage ou maladie.", evidence: "Sourate Al-Baqarah 2:183-185" },
      { title: "مفسدات الصيام — Ce qui rompt le jeûne", level: "محرم", levelFr: "Interdit", text: "Manger, boire intentionnellement, relations conjugales, vomissement volontaire. Certains actes sont disputés entre les écoles juridiques.", evidence: "Consensus des savants" },
      { title: "الكفارة — L'expiation", level: "واجب", levelFr: "Obligatoire", text: "Si le jeûne de Ramadan est rompu par relation conjugale intentionnelle: libérer un esclave OU jeûner 2 mois consécutifs OU nourrir 60 pauvres.", evidence: "Hadith dans Bukhari & Muslim" },
    ],
    quiz: [
      { q: "Le jeûne de Ramadan est:", opts: ["Sunnah", "Mustahabb", "Fard", "Makruh"], ans: 2 },
      { q: "L'expiation pour avoir rompu le jeûne intentionnellement inclut:", opts: ["Juste du repentir", "Nourrir 10 pauvres", "Jeûner 60 jours consécutifs", "Payer 100€"], ans: 2 },
    ],
  },
];

const LEVEL_COLORS = {
  "فرض":  { bg: "rgba(239,68,68,.15)",   border: "#ef4444", text: "#fca5a5" },
  "واجب": { bg: "rgba(245,158,11,.12)",   border: "#f59e0b", text: "#fcd34d" },
  "شرط":  { bg: "rgba(59,130,246,.12)",   border: "#3b82f6", text: "#93c5fd" },
  "رخصة": { bg: "rgba(16,185,129,.12)",   border: "#10b981", text: "#6ee7b7" },
  "محرم": { bg: "rgba(139,92,246,.12)",   border: "#8b5cf6", text: "#c4b5fd" },
};

/* ── AI modal ── */
function AICaseStudy({ pillar, onClose }) {
  const [scenario, setScenario]   = useState("");
  const [answer,   setAnswer]     = useState("");
  const [loading,  setLoading]    = useState(false);
  const [asked,    setAsked]      = useState(false);

  const PRESETS = [
    "Je suis en voyage longue distance. Dois-je jeûner ce jour?",
    "J'ai oublié de faire le wudhu avant la prière. Que faire?",
    "Ma richesse vient de dépasser le nisāb il y a 6 mois. Dois-je payer la Zakat maintenant?",
  ];

  const ask = async () => {
    const q = scenario.trim();
    if (!q || loading) return;
    setLoading(true); setAsked(true); setAnswer("");
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Tu es un savant islamique pédagogique qui enseigne le Fiqh. Tu présentes les positions des 4 écoles (Hanafi, Maliki, Shafi'i, Hanbali) quand elles diffèrent. Tu cites les preuves coraniques et les hadiths. Tu RAPPELLES toujours que pour des questions pratiques importantes, il faut consulter un savant qualifié. Contexte du cours: ${pillar}. Réponds en français de façon claire et structurée.`,
          messages: [{ role: "user", content: q }],
        }),
      });
      const data = await res.json();
      setAnswer(data.content?.[0]?.text || "Erreur.");
    } catch { setAnswer("Erreur de connexion."); }
    setLoading(false);
  };

  /* faux-overlay pattern: normal flow div sized to fill the screen */
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,.82)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 20, width: "100%", maxWidth: 620,
        maxHeight: "80vh", display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* header */}
        <div style={{
          background: "linear-gradient(135deg,#1c0a0a,#2d1515)",
          padding: "14px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚖️</span>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>Assistant Fiqh — IA</div>
              <div style={{ fontSize: 11, color: C.accentLt }}>Cas pratiques & questions juridiques</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 14 }}
          >✕</button>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: C.accentLt }}>
            ⚠️ Ceci est un outil pédagogique. Pour des questions importantes, consultez un savant qualifié.
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: C.mutedLt, marginBottom: 8 }}>Scénarios suggérés :</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PRESETS.map(p => (
                <button key={p} onClick={() => setScenario(p)}
                  style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", textAlign: "left", fontSize: 12, color: C.mutedLt, fontFamily: "inherit" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={scenario} onChange={e => setScenario(e.target.value)}
            placeholder="Décrivez votre cas ou posez une question de Fiqh..."
            style={{ width: "100%", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", resize: "vertical", minHeight: 80, fontFamily: "inherit" }}
          />
          <button onClick={ask} disabled={!scenario.trim() || loading}
            style={{ width: "100%", marginTop: 10, background: loading ? C.border : C.accent, border: "none", color: "#fff", borderRadius: 12, padding: "12px", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}>
            {loading ? "⏳ Analyse en cours..." : "⚖️ Obtenir la réponse Fiqh"}
          </button>

          {asked && !loading && answer && (
            <div style={{ marginTop: 16, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", fontSize: 13, lineHeight: 1.8, color: C.text, whiteSpace: "pre-wrap" }}>
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function Fiqh() {
  const [activePillar, setActivePillar] = useState(0);
  const [activeTab,    setActiveTab]    = useState("rulings");
  const [showAI,       setShowAI]       = useState(false);
  const [quizStep,     setQuizStep]     = useState(0);
  const [quizAns,      setQuizAns]      = useState(null);
  const [quizScore,    setQuizScore]    = useState(0);
  const [quizDone,     setQuizDone]     = useState(false);

  const pillar = PILLARS[activePillar];

  const pickQuiz = (i) => {
    if (quizAns !== null) return;
    setQuizAns(i);
    if (i === pillar.quiz[quizStep].ans) setQuizScore(s => s + 1);
  };
  const nextQuiz  = () => {
    if (quizStep + 1 >= pillar.quiz.length) { setQuizDone(true); return; }
    setQuizStep(s => s + 1); setQuizAns(null);
  };
  const resetQuiz = () => { setQuizStep(0); setQuizAns(null); setQuizScore(0); setQuizDone(false); };
  const switchPillar = (id) => { setActivePillar(id); setActiveTab("rulings"); resetQuiz(); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade { animation: fadeIn .3s ease; }
      `}</style>

      {showAI && <AICaseStudy pillar={`${pillar.ar} — ${pillar.fr}`} onClose={() => setShowAI(false)} />}

      {/* ── Hero — KEY FIX: paddingTop accounts for the 72px fixed navbar ── */}
      <div style={{
        background: "linear-gradient(135deg,#080b0f 0%,#1a0a0a 60%,#080b0f 100%)",
        borderBottom: `1px solid ${C.border}`,
        /* 72px navbar + 28px breathing room = 100px top padding */
        padding: "100px 24px 28px",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: "rgba(239,68,68,.12)", border: "1.5px solid rgba(239,68,68,.35)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>⚖️</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>
                مبادئ الفقه الإسلامي
              </div>
              <div style={{ fontSize: 13, color: C.mutedLt, marginTop: 2 }}>
                Introduction au Fiqh — Jurisprudence Islamique
              </div>
            </div>
          </div>

          {/* Pillar tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PILLARS.map(p => (
              <button key={p.id} onClick={() => switchPillar(p.id)} style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 16px", borderRadius: 20,
                border: `1.5px solid ${activePillar === p.id ? p.color : C.border}`,
                background: activePillar === p.id ? `${p.color}18` : "transparent",
                color: activePillar === p.id ? p.color : C.mutedLt,
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                fontFamily: "inherit", transition: "all .2s",
              }}>
                <span>{p.icon}</span> {p.fr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* Active pillar card */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: "18px 22px",
          marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>{pillar.icon}</span>
            <div>
              <div style={{ fontFamily: "serif", fontSize: 22, color: pillar.color, lineHeight: 1 }}>{pillar.ar}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginTop: 2 }}>{pillar.fr}</div>
              <div style={{ fontSize: 12, color: C.mutedLt, marginTop: 2 }}>{pillar.subtitle}</div>
            </div>
          </div>
          <button onClick={() => setShowAI(true)} style={{
            background: "linear-gradient(135deg,#1c0a0a,#2d1515)",
            border: `1px solid rgba(239,68,68,.35)`,
            borderRadius: 12, padding: "10px 18px",
            color: C.accentLt, cursor: "pointer",
            fontWeight: 700, fontSize: 13, fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}>
            ⚖️ Cas pratique IA
          </button>
        </div>

        {/* Content tabs */}
        <div style={{
          display: "flex", gap: 4,
          background: C.panel, borderRadius: 12, padding: 4,
          width: "fit-content", marginBottom: 20,
        }}>
          {[["rulings", "📜 Règles"], ["quiz", "🎯 Quiz"]].map(([k, l]) => (
            <button key={k} onClick={() => setActiveTab(k)} style={{
              padding: "8px 22px", borderRadius: 8, border: "none",
              background: activeTab === k ? pillar.color : "transparent",
              color: activeTab === k ? "#fff" : C.muted,
              cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit",
              transition: "background .2s",
            }}>
              {l}
            </button>
          ))}
        </div>

        {/* ── RULINGS TAB ── */}
        {activeTab === "rulings" && (
          <div className="fade">
            <p style={{
              color: C.mutedLt, fontSize: 14, lineHeight: 1.7,
              marginBottom: 18, padding: "12px 16px",
              background: C.panel, borderRadius: 10,
              borderLeft: `3px solid ${pillar.color}`,
            }}>
              {pillar.desc}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {pillar.rulings.map((r, i) => {
                const lc = LEVEL_COLORS[r.level] || LEVEL_COLORS["فرض"];
                return (
                  <div key={i} style={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: 16, padding: "18px 22px",
                  }}>
                    {/* title + badges — wrap on small screens */}
                    <div style={{
                      display: "flex", alignItems: "flex-start",
                      justifyContent: "space-between", gap: 12,
                      marginBottom: 10, flexWrap: "wrap",
                    }}>
                      <div style={{ fontFamily: "serif", fontSize: 16, color: "#fff", fontWeight: 700, flex: 1, minWidth: 0 }}>
                        {r.title}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <span style={{
                          background: lc.bg, border: `1px solid ${lc.border}`,
                          borderRadius: 20, padding: "3px 10px",
                          fontSize: 11, fontWeight: 700, color: lc.text,
                        }}>{r.level}</span>
                        <span style={{
                          background: "rgba(255,255,255,.05)",
                          borderRadius: 20, padding: "3px 10px",
                          fontSize: 11, color: C.mutedLt,
                        }}>{r.levelFr}</span>
                      </div>
                    </div>
                    <p style={{ color: C.mutedLt, fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>{r.text}</p>
                    <div style={{ fontSize: 12, color: pillar.color, fontStyle: "italic" }}>📖 {r.evidence}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── QUIZ TAB ── */}
        {activeTab === "quiz" && (
          <div className="fade" style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "24px",
          }}>
            {!quizDone ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Question {quizStep + 1} / {pillar.quiz.length}
                  </span>
                  <span style={{ fontSize: 12, color: pillar.color, fontWeight: 700 }}>Score : {quizScore}</span>
                </div>

                <p style={{ fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.6, marginBottom: 18 }}>
                  {pillar.quiz[quizStep].q}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pillar.quiz[quizStep].opts.map((opt, i) => {
                    let bg = C.panel, border = C.border, col = C.text;
                    if (quizAns !== null) {
                      if (i === pillar.quiz[quizStep].ans) { bg = "rgba(16,185,129,.15)"; border = "#10b981"; col = "#34d399"; }
                      else if (i === quizAns)             { bg = "rgba(239,68,68,.10)";   border = "#ef4444"; col = "#fca5a5"; }
                    }
                    return (
                      <button key={i} onClick={() => pickQuiz(i)} disabled={quizAns !== null}
                        style={{
                          background: bg, border: `1.5px solid ${border}`, color: col,
                          borderRadius: 12, padding: "12px 16px",
                          cursor: quizAns !== null ? "default" : "pointer",
                          textAlign: "left", fontSize: 14,
                          fontFamily: "inherit", transition: "all .2s",
                        }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizAns !== null && (
                  <button onClick={nextQuiz} style={{
                    marginTop: 16, background: pillar.color, border: "none",
                    color: "#fff", borderRadius: 12, padding: "10px 24px",
                    cursor: "pointer", fontWeight: 700, fontFamily: "inherit",
                  }}>
                    {quizStep + 1 >= pillar.quiz.length ? "Terminer ✓" : "Suivant →"}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>{quizScore === pillar.quiz.length ? "🏆" : "📚"}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: pillar.color, marginBottom: 6 }}>
                  {quizScore} / {pillar.quiz.length}
                </div>
                <div style={{ fontSize: 14, color: C.mutedLt, marginBottom: 20 }}>
                  {quizScore === pillar.quiz.length ? "Parfait ! Toutes les bonnes réponses." : "Continuez à réviser !"}
                </div>
                <button onClick={resetQuiz} style={{
                  background: pillar.color, border: "none", color: "#fff",
                  borderRadius: 12, padding: "10px 28px",
                  cursor: "pointer", fontWeight: 700, fontFamily: "inherit",
                }}>
                  Recommencer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}