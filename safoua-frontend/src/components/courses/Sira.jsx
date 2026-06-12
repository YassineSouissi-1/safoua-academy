import React, { useState, useEffect } from "react";
import { api } from "../../utils/auth";

const COURSE_TITLE = "Sira : Vie du Prophète ﷺ";

async function saveProgress(lessonTitle) {
  try {
    await api.post("/api/update-progress", { lessonTitle });
  } catch (err) {
    console.error("Erreur progression:", err);
  }
}

const C = {
  bg:       "#06050a",
  surface:  "#0e0c14",
  panel:    "#141220",
  border:   "#1e1b2e",
  accent:   "#a78bfa",
  accentLt: "#c4b5fd",
  gold:     "#d4a017",
  goldLt:   "#f0c040",
  text:     "#ede8f5",
  muted:    "#4c4670",
  mutedLt:  "#7c72a0",
};

const EVENTS = [
  {
    id: 0,
    year: "570 CE", yearAr: "عام الفيل",
    title: "Naissance du Prophète ﷺ", titleAr: "مولد النبي ﷺ",
    icon: "🌟", color: "#f59e0b", place: "La Mecque", category: "Naissance",
    body: "Muhammad ibn Abdallāh ﷺ naquit dans la tribu des Quraysh, clan des Banū Hāshim, à La Mecque. Son père Abdallāh était décédé avant sa naissance. Il fut confié à la nourrice Halīma As-Sa'diyya chez les Banū Sa'd. C'est l'Année de l'Éléphant, lorsqu'Abraha tenta de détruire la Ka'ba — mais Allah protégea Sa Maison.",
    lessons: ["Allah protège ce qu'Il a choisi", "L'importance des origines nobles", "La valeur du service aux orphelins"],
    quranRef: "Sourate Al-Fīl (105) — Événement de l'Éléphant",
    quiz: { q: "Dans quelle tribu le Prophète ﷺ est-il né ?", opts: ["Banū Makhzūm", "Banū Hāshim", "Banū Umayya", "Banū Thaqīf"], ans: 1 },
  },
  {
    id: 1,
    year: "595 CE", yearAr: "زواج خديجة",
    title: "Mariage avec Khadīja", titleAr: "الزواج المبارك",
    icon: "💍", color: "#ec4899", place: "La Mecque", category: "Famille",
    body: "À 25 ans, Muhammad ﷺ épousa Khadīja bint Khuwaylid, veuve prospère de 40 ans qui l'avait engagé comme commerçant. Elle fut impressionnée par son honnêteté (surnommé Al-Amīn — le Fidèle). Khadīja fut sa première épouse, sa plus grande soutien, et la première à accepter l'Islam. Elle lui donna 6 enfants dont Fātima.",
    lessons: ["La confiance et l'honnêteté ouvrent les portes", "Le soutien conjugal est fondamental", "La femme peut prendre des initiatives honorables"],
    quranRef: "Hadith : « Elle m'a cru quand les gens me traitaient de menteur » — Sahih Bukhari",
    quiz: { q: "Quel surnom le Prophète ﷺ portait-il avant la prophétie ?", opts: ["As-Sādiq", "Al-Amīn", "Al-Wafī", "Al-Karīm"], ans: 1 },
  },
  {
    id: 2,
    year: "610 CE", yearAr: "سنة البعثة",
    title: "Première Révélation", titleAr: "نزول الوحي",
    icon: "📖", color: "#8b5cf6", place: "Grotte Hirā'", category: "Prophétie",
    body: "À 40 ans, pendant le mois de Ramadan, le Prophète ﷺ reçut la première révélation dans la grotte Hirā'. L'ange Jibrīl lui dit : « Lis! (اقرأ) ». Khadīja le réconforta et le conduisit vers Waraqah ibn Nawfal qui confirma sa prophétie. Waraqah lui dit : « C'est le même ange que celui envoyé à Moïse. »",
    lessons: ["L'importance de la connaissance — اقرأ", "Le rôle du soutien familial", "Allah ne confie une mission qu'à celui qui peut la porter"],
    quranRef: "Sourate Al-Alaq (96:1-5) — Première révélation",
    quiz: { q: "Quelle fut la première parole révélée au Prophète ﷺ ?", opts: ["بسم الله", "اقرأ", "قل هو الله", "الحمد لله"], ans: 1 },
  },
  {
    id: 3,
    year: "613 CE", yearAr: "الدعوة الجهرية",
    title: "Début de la Prédication Publique", titleAr: "الجهر بالدعوة",
    icon: "📢", color: "#06b6d4", place: "La Mecque", category: "Prédication",
    body: "Après 3 ans de prédication secrète, le Prophète ﷺ reçut l'ordre de prêcher publiquement. Il monta sur la colline de Safā et interpella les Qurayshites. Quand ils confirmèrent ne l'avoir jamais trouvé menteur, il leur annonça le message de l'Islam. Abū Lahab, son oncle, l'insulta publiquement — ce à quoi la sourate Al-Masad fut révélée.",
    lessons: ["La vérité doit être dite même face à l'hostilité", "La persévérance dans la prédication", "La famille n'est pas toujours un soutien"],
    quranRef: "Sourate Al-Masad (111) — Révélée après l'incident",
    quiz: { q: "Sur quelle colline le Prophète ﷺ fit-il sa première prédication publique ?", opts: ["Hirā", "Safā", "Arafat", "Thawr"], ans: 1 },
  },
  {
    id: 4,
    year: "615 CE", yearAr: "هجرة الحبشة",
    title: "Hégire en Abyssinie", titleAr: "الهجرة إلى الحبشة",
    icon: "🌍", color: "#10b981", place: "Abyssinie (Éthiopie)", category: "Hégire",
    body: "Face aux persécutions, le Prophète ﷺ envoya un premier groupe de 15 personnes puis un second de 83 personnes en Abyssinie, chez le roi chrétien juste An-Najāshī (Négus). Quand les Qurayshites envoyèrent des émissaires pour les récupérer, Ja'far ibn Abī Tālib récita la sourate Maryam. Le Négus pleura et refusa de les livrer.",
    lessons: ["Chercher refuge est permis quand nécessaire", "La justice existe chez les non-musulmans", "Le Coran touche les cœurs sincères"],
    quranRef: "Sourate Maryam (19) — Récitée au Négus",
    quiz: { q: "Qui récita le Coran devant le roi An-Najāshī ?", opts: ["Abu Bakr", "Umar ibn al-Khattab", "Ja'far ibn Abi Talib", "Uthman ibn Affan"], ans: 2 },
  },
  {
    id: 5,
    year: "619 CE", yearAr: "عام الحزن",
    title: "L'Année du Chagrin", titleAr: "عام الحزن",
    icon: "💔", color: "#64748b", place: "La Mecque", category: "Épreuve",
    body: "En 619 CE, le Prophète ﷺ perdit ses deux plus grands soutiens en l'espace de quelques semaines : son oncle Abū Tālib qui l'avait protégé pendant 10 ans, puis sa femme bien-aimée Khadīja. Sans leur protection, les persécutions s'intensifièrent. Le Prophète ﷺ tenta de chercher appui à Tā'if mais fut chassé à coups de pierres par des esclaves.",
    lessons: ["Les épreuves testent et élèvent", "La patience dans la douleur est une vertu sublime", "Allah console après chaque détresse"],
    quranRef: "Sourate Ad-Duha (93) — Révélée en période de tristesse",
    quiz: { q: "Qui mourut en 619 CE, la même année que Khadīja ?", opts: ["Abu Bakr", "Hamza", "Abu Talib", "Ali ibn Abi Talib"], ans: 2 },
  },
  {
    id: 6,
    year: "621 CE", yearAr: "الإسراء والمعراج",
    title: "Le Voyage Nocturne", titleAr: "الإسراء والمعراج",
    icon: "🌙", color: "#7c3aed", place: "Jérusalem → Les Cieux", category: "Miracle",
    body: "En une nuit, le Prophète ﷺ fut transporté de La Mecque à la mosquée Al-Aqsā à Jérusalem (Al-Isrā'), puis il monta à travers les 7 cieux (Al-Mi'rāj). Il rencontra les prophètes précédents, dont Adam, Ibrāhim, Mūsā et 'Īsā. Allah lui prescrivit les 5 prières quotidiennes — initialement 50, réduites à 5 grâce aux conseils de Mūsā.",
    lessons: ["Les miracles confirment la prophétie", "Les 5 prières sont le lien direct avec Allah", "La résilience mène aux plus grands honneurs"],
    quranRef: "Sourate Al-Isrā' (17:1) — 'Gloire à Celui qui a transporté Son serviteur'",
    quiz: { q: "Combien de prières Allah prescrivit-il initialement lors du Mi'raj ?", opts: ["5", "10", "30", "50"], ans: 3 },
  },
  {
    id: 7,
    year: "622 CE", yearAr: "الهجرة",
    title: "L'Hégire vers Médine", titleAr: "الهجرة إلى المدينة",
    icon: "🕌", color: "#f97316", place: "La Mecque → Médine", category: "Hégire",
    body: "Face aux persécutions, Allah ordonna l'émigration vers Médine (Yathrib). Le Prophète ﷺ et Abu Bakr se cachèrent 3 jours dans la grotte de Thawr. À Médine, il instaura la Constitution de Médine — premier document constitutionnel garantissant les droits de toutes les communautés. Il fraternisa les Muhājirūn et les Anṣār. Cette date marque le début du calendrier islamique (1 AH).",
    lessons: ["Le sacrifice pour la vérité est nécessaire", "L'importance de la communauté (أمة)", "La stratégie et la patience mènent à la victoire"],
    quranRef: "Sourate At-Tawbah (9:40) — 'Les deux dans la grotte'",
    quiz: { q: "Combien de jours le Prophète ﷺ se cacha-t-il dans la grotte de Thawr ?", opts: ["1 jour", "2 jours", "3 jours", "7 jours"], ans: 2 },
  },
  {
    id: 8,
    year: "624 CE", yearAr: "غزوة بدر",
    title: "Bataille de Badr", titleAr: "غزوة بدر الكبرى",
    icon: "⚔️", color: "#ef4444", place: "Vallée de Badr", category: "Bataille",
    body: "La première grande bataille de l'Islam. 313 musulmans contre ~1000 Qurayshites. Allah envoya des anges pour aider les croyants. Une victoire décisive qui établit la crédibilité de la communauté. 70 chefs qurayshites tués, 70 capturés. Les captifs furent traités avec dignité — certains libérés contre l'enseignement de l'alphabétisation aux enfants de Médine.",
    lessons: ["La confiance en Allah malgré les probabilités", "La miséricorde même envers les ennemis", "La foi transforme les forces en actes"],
    quranRef: "Sourate Al-Anfāl (8:17) — 'Ce n'est pas vous qui avez tué...'",
    quiz: { q: "Combien de musulmans participèrent à la bataille de Badr ?", opts: ["100", "200", "313", "500"], ans: 2 },
  },
  {
    id: 9,
    year: "625 CE", yearAr: "غزوة أحد",
    title: "Bataille d'Uhud", titleAr: "غزوة أحد",
    icon: "🏔️", color: "#dc2626", place: "Mont Uhud, Médine", category: "Bataille",
    body: "700 musulmans contre 3000 Qurayshites. Les musulmans eurent d'abord l'avantage mais une désobéissance aux ordres du Prophète ﷺ — des archers quittèrent leurs postes pour ramasser le butin — renversa la bataille. Le Prophète ﷺ fut blessé. 70 compagnons furent martyrisés, dont Hamza, l'oncle du Prophète. Une leçon d'obéissance et de discipline.",
    lessons: ["L'obéissance aux ordres est essentielle", "La défaite peut être une leçon précieuse", "La discipline distingue les vrais croyants"],
    quranRef: "Sourate Āl 'Imrān (3:152) — 'Quand vous avez faibli et disputé l'ordre'",
    quiz: { q: "Quelle erreur causa la défaite partielle à Uhud ?", opts: ["Manque d'armes", "Les archers quittèrent leurs postes", "Le Prophète fut absent", "Trop peu de soldats"], ans: 1 },
  },
  {
    id: 10,
    year: "627 CE", yearAr: "غزوة الأحزاب",
    title: "Bataille du Fossé", titleAr: "غزوة الخندق",
    icon: "🛡️", color: "#0891b2", place: "Médine", category: "Bataille",
    body: "Une coalition de 10 000 guerriers des tribus arabes encercla Médine. Sur le conseil du Persan Salmān Al-Fārisī, les musulmans creusèrent un fossé — stratégie inconnue des Arabes. Le siège dura 27 jours. Le vent et le froid finirent par décourager les assaillants qui levèrent le camp. Ce fut la dernière grande offensive contre Médine.",
    lessons: ["La consultation (shūrā) produit les meilleures décisions", "L'innovation stratégique est permise en Islam", "Allah est le meilleur des défenseurs"],
    quranRef: "Sourate Al-Ahzāb (33:22) — 'Quand les croyants virent les coalisés'",
    quiz: { q: "Qui proposa de creuser le fossé défensif autour de Médine ?", opts: ["Abu Bakr", "Omar ibn al-Khattab", "Salman al-Farisi", "Ali ibn Abi Talib"], ans: 2 },
  },
  {
    id: 11,
    year: "630 CE", yearAr: "فتح مكة",
    title: "Conquête de La Mecque", titleAr: "فتح مكة المكرمة",
    icon: "🕋", color: "#0ea5e9", place: "La Mecque", category: "Victoire",
    body: "10 ans après l'Hégire, le Prophète ﷺ entra à La Mecque avec 10 000 compagnons. Il déclara une amnistie générale: « Allez, vous êtes libres! (اذهبوا فأنتم الطلقاء) ». Il détruisit les 360 idoles de la Ka'ba en récitant: « La vérité est venue et le mensonge a péri (17:81) ». Un moment de pardon sans précédent dans l'histoire humaine.",
    lessons: ["Le pardon est plus puissant que la vengeance", "La victoire ne doit pas corrompre", "La patience est toujours récompensée"],
    quranRef: "Sourate Al-Fatḥ (48:1) — 'Nous t'avons accordé une victoire éclatante'",
    quiz: { q: "Qu'annonça le Prophète ﷺ aux habitants de La Mecque après la conquête ?", opts: ["Ils seraient punis", "Ils étaient libres (amnistie)", "Ils devaient partir", "Ils paieraient une rançon"], ans: 1 },
  },
  {
    id: 12,
    year: "632 CE", yearAr: "حجة الوداع",
    title: "Le Pèlerinage d'Adieu", titleAr: "خطبة الوداع",
    icon: "🌿", color: "#d97706", place: "Mont Arafat", category: "Message final",
    body: "Le Prophète ﷺ prononça son discours d'adieu devant 124 000 compagnons sur le mont Arafat: « Ô gens! Vos vies, vos biens et votre honneur vous sont sacrés... Les femmes ont des droits sur vous... Vous rendrez compte. Ai-je bien transmis le message? » L'assemblée répondit: Oui. Puis il dit: « Ô Allah, sois témoin. » Peu après, il rendit l'âme à 63 ans.",
    lessons: ["Les droits humains sont islamiques", "Le Coran et la Sunnah : guides éternels", "La vie est une mission à accomplir"],
    quranRef: "Sourate Al-Mā'idah (5:3) — 'Aujourd'hui, j'ai parachevé votre religion'",
    quiz: { q: "Quel âge avait le Prophète ﷺ à son décès ?", opts: ["55 ans", "60 ans", "63 ans", "70 ans"], ans: 2 },
  },
];

const CATEGORIES = ["Tous", ...new Set(EVENTS.map(e => e.category))];

const FINAL_QUIZ = [
  { q: "En quelle année naquit le Prophète ﷺ ?", opts: ["565 CE", "570 CE", "580 CE", "590 CE"], ans: 1 },
  { q: "Quel est le nom complet du Prophète ﷺ ?", opts: ["Ahmad ibn Omar", "Muhammad ibn Abdallah", "Ibrahim ibn Ishaq", "Yusuf ibn Yaqub"], ans: 1 },
  { q: "Dans quelle grotte reçut-il la première révélation ?", opts: ["Grotte de Thawr", "Grotte d'Uhud", "Grotte Hirā'", "Grotte de Badr"], ans: 2 },
  { q: "Qui fut la première personne à accepter l'Islam ?", opts: ["Abu Bakr", "Ali ibn Abi Talib", "Khadija", "Omar ibn al-Khattab"], ans: 2 },
  { q: "Combien d'années dura la prédication secrète avant la prédication publique ?", opts: ["1 an", "2 ans", "3 ans", "5 ans"], ans: 2 },
  { q: "En quelle année commence le calendrier islamique (Hégire) ?", opts: ["610 CE", "615 CE", "622 CE", "630 CE"], ans: 2 },
  { q: "Qui fut martyrisé à la bataille d'Uhud parmi les proches du Prophète ﷺ ?", opts: ["Abu Bakr", "Hamza", "Ali", "Omar"], ans: 1 },
  { q: "Combien de compagnons accompagnèrent le Prophète ﷺ lors du Pèlerinage d'Adieu ?", opts: ["10 000", "40 000", "70 000", "124 000"], ans: 3 },
];

/* ─── AI Storyteller ───────────────────────────────────────────── */
function AIStoryteller({ event, onClose }) {
  const [mode, setMode] = useState("story");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const PROMPTS = {
    story:   `Raconte-moi l'histoire de "${event.title}" de manière vivante et immersive, comme si j'étais présent. Inclus des détails humains, des émotions, le contexte. Maximum 250 mots. En français.`,
    lesson:  `Quelles leçons de vie peut-on tirer de l'événement "${event.title}" pour un Muslim contemporain? Donne 5 leçons pratiques avec des preuves coraniques ou des hadiths. En français.`,
    context: `Explique le contexte historique mondial de "${event.title}" en ${event.year}. Qu'est-ce qui se passait en Arabie et dans le monde à cette époque? En français, 200 mots max.`,
  };

  const generate = async (m) => {
    setMode(m); setLoading(true); setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "Tu es un historien islamique passionné. Tu racontes la Sīra du Prophète Muhammad ﷺ avec précision et enthousiasme. Tu cites les sources (Coran, Bukhari, Muslim, Ibn Hishām) quand possible.",
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
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:640, maxHeight:"85vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ background:"linear-gradient(135deg,#1a0a2e,#0d0b1e)", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{event.icon}</span>
            <div>
              <div style={{ fontWeight:700, color:"#fff", fontSize:13 }}>IA Narrateur — {event.title}</div>
              <div style={{ fontSize:11, color:C.accentLt }}>Propulsé par Claude</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.12)", border:"none", color:"#fff", borderRadius:8, padding:"6px 14px", cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:6, flexWrap:"wrap" }}>
          {[["story","📖 Histoire vive"],["lesson","💡 Leçons modernes"],["context","🌍 Contexte"]].map(([k,l]) => (
            <button key={k} onClick={() => generate(k)}
              style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${mode===k?event.color:C.border}`, background:mode===k?`${event.color}20`:"transparent", color:mode===k?event.color:C.mutedLt, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:20 }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:"2rem", color:C.mutedLt }}>
              <div style={{ width:32, height:32, border:`2px solid ${C.accent}40`, borderTop:`2px solid ${C.accent}`, borderRadius:"50%", margin:"0 auto 12px", animation:"spin 1s linear infinite" }} />
              <div style={{ fontSize:13 }}>Génération en cours...</div>
            </div>
          ) : (
            <div style={{ fontSize:14, lineHeight:1.85, color:C.text, whiteSpace:"pre-wrap" }}>{result}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Quiz final ────────────────────────────────────────────────── */
function FinalQuiz({ onClose, onComplete }) {
  const [step, setStep]   = useState(0);
  const [ans, setAns]     = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone]   = useState(false);

  const q = FINAL_QUIZ[step];

  const pick = (i) => {
    if (ans !== null) return;
    setAns(i);
    if (i === q.ans) setScore(s => s + 1);
  };

  const next = () => {
    if (step + 1 >= FINAL_QUIZ.length) { setDone(true); onComplete(score + (ans === q.ans ? 1 : 0)); return; }
    setStep(s => s + 1); setAns(null);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:560, overflow:"hidden" }}>
        <div style={{ background:"linear-gradient(135deg,#1a0a2e,#0d0b1e)", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontWeight:700, color:"#fff" }}>🎯 Quiz Final — Sîra</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.12)", border:"none", color:"#fff", borderRadius:8, padding:"6px 14px", cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:24 }}>
          {!done ? (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <span style={{ fontSize:12, color:C.mutedLt, fontWeight:700 }}>Question {step+1}/{FINAL_QUIZ.length}</span>
                <span style={{ fontSize:12, color:C.accent, fontWeight:700 }}>Score : {score}</span>
              </div>
              <div style={{ height:4, background:"rgba(255,255,255,.06)", borderRadius:2, marginBottom:20, overflow:"hidden" }}>
                <div style={{ width:`${((step)/FINAL_QUIZ.length)*100}%`, height:"100%", background:C.accent, transition:"width .4s" }} />
              </div>
              <p style={{ fontSize:16, fontWeight:600, color:C.text, lineHeight:1.6, marginBottom:18 }}>{q.q}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {q.opts.map((opt, i) => {
                  let bg = C.panel, border = C.border, col = C.text;
                  if (ans !== null) {
                    if (i === q.ans)    { bg="rgba(16,185,129,.15)"; border="#10b981"; col="#34d399"; }
                    else if (i === ans) { bg="rgba(239,68,68,.10)";  border="#ef4444"; col="#fca5a5"; }
                  }
                  return (
                    <button key={i} onClick={() => pick(i)} disabled={ans!==null}
                      style={{ background:bg, border:`1.5px solid ${border}`, color:col, borderRadius:12, padding:"12px 16px", cursor:ans!==null?"default":"pointer", textAlign:"left", fontSize:14, fontFamily:"inherit", transition:"all .2s" }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {ans !== null && (
                <button onClick={next} style={{ marginTop:16, background:C.accent, border:"none", color:"#fff", borderRadius:12, padding:"10px 24px", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
                  {step+1 >= FINAL_QUIZ.length ? "Terminer ✓" : "Suivant →"}
                </button>
              )}
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"1rem 0" }}>
              <div style={{ fontSize:56, marginBottom:12 }}>{score >= 6 ? "🏆" : score >= 4 ? "⭐" : "📚"}</div>
              <div style={{ fontSize:28, fontWeight:700, color:C.goldLt, marginBottom:6 }}>{score} / {FINAL_QUIZ.length}</div>
              <p style={{ color:C.mutedLt, fontSize:14, marginBottom:20 }}>
                {score >= 6 ? "Excellent ! Vous maîtrisez la Sîra !" : score >= 4 ? "Bien ! Continuez à réviser." : "Relisez les événements et réessayez."}
              </p>
              <button onClick={onClose} style={{ background:C.accent, border:"none", color:"#fff", borderRadius:12, padding:"10px 28px", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────── */
export default function Sira() {
  const [selectedIdx, setSelectedIdx]   = useState(0);
  const [showAI, setShowAI]             = useState(false);
  const [showQuiz, setShowQuiz]         = useState(false);
  const [readEvents, setReadEvents]     = useState(new Set());
  const [quizDone, setQuizDone]         = useState(false);
  const [filterCat, setFilterCat]       = useState("Tous");

  const filtered = filterCat === "Tous" ? EVENTS : EVENTS.filter(e => e.category === filterCat);
  const event    = EVENTS[selectedIdx];

  const markRead = (id) => {
    if (readEvents.has(id)) return;
    const updated = new Set([...readEvents, id]);
    setReadEvents(updated);
    const e = EVENTS.find(ev => ev.id === id);
    saveProgress(`${COURSE_TITLE} — ${COURSE_TITLE} — ${e.title}`);
  };

  const handleQuizComplete = (score) => {
    setQuizDone(true);
    saveProgress(`${COURSE_TITLE} — ${COURSE_TITLE} — Quiz Sira`);
  };

  const pct = Math.round((readEvents.size / EVENTS.length) * 100);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"Georgia, 'IBM Plex Sans Arabic', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade{animation:fadeIn .4s ease}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
      `}</style>

      {showAI   && <AIStoryteller event={event} onClose={() => setShowAI(false)} />}
      {showQuiz && <FinalQuiz onClose={() => setShowQuiz(false)} onComplete={handleQuizComplete} />}

      {/* Hero */}
      <div style={{ background:"linear-gradient(180deg,#1a0a2e 0%,#06050a 100%)", borderBottom:`1px solid ${C.border}`, padding:"80px 32px 28px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:11, letterSpacing:4, color:C.accentLt, textTransform:"uppercase", marginBottom:10, fontFamily:"sans-serif" }}>السيرة النبوية</div>
            <h1 style={{ fontSize:"clamp(26px,5vw,42px)", fontWeight:700, color:"#fff", fontFamily:"'Cormorant Garamond',serif", lineHeight:1.15, marginBottom:8 }}>
              La Vie du Prophète <span style={{ color:C.goldLt }}>Muhammad ﷺ</span>
            </h1>
            <p style={{ color:C.mutedLt, fontSize:14, lineHeight:1.6, maxWidth:520, margin:"0 auto 20px" }}>
              {EVENTS.length} événements fondateurs de l'Islam — De la naissance au dernier pèlerinage
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ background:"rgba(255,255,255,.05)", borderRadius:12, padding:"14px 20px", display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, color:C.mutedLt, fontFamily:"sans-serif" }}>Événements lus</span>
                <span style={{ fontSize:12, color:C.accentLt, fontWeight:700, fontFamily:"sans-serif" }}>{readEvents.size}/{EVENTS.length} — {pct}%</span>
              </div>
              <div style={{ height:6, background:"rgba(255,255,255,.08)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${C.accent},${C.goldLt})`, borderRadius:3, transition:"width .5s" }} />
              </div>
            </div>
            <button onClick={() => setShowQuiz(true)}
              style={{ background:`linear-gradient(135deg,${C.accent},#7c3aed)`, border:"none", color:"#fff", borderRadius:12, padding:"10px 20px", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
              {quizDone ? "✓ Quiz refaire" : "🎯 Quiz final"}
            </button>
          </div>

          {/* Category filter */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                style={{ padding:"5px 14px", borderRadius:20, border:`1px solid ${filterCat===cat?C.accent:C.border}`, background:filterCat===cat?`${C.accent}20`:"transparent", color:filterCat===cat?C.accentLt:C.mutedLt, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"sans-serif" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline scroll */}
      <div style={{ overflowX:"auto", borderBottom:`1px solid ${C.border}`, background:C.surface }}>
        <div style={{ display:"flex", minWidth:"max-content", padding:"0 24px" }}>
          {filtered.map(e => (
            <button key={e.id} onClick={() => { setSelectedIdx(e.id); markRead(e.id); }}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"12px 16px", border:"none", background:"transparent", cursor:"pointer", position:"relative", transition:"all .2s" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:selectedIdx===e.id?e.color:`${e.color}20`, border:`2px solid ${selectedIdx===e.id?e.color:`${e.color}40`}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, transition:"all .2s", position:"relative" }}>
                {e.icon}
                {readEvents.has(e.id) && <div style={{ position:"absolute", top:-3, right:-3, width:12, height:12, background:"#10b981", borderRadius:"50%", border:"2px solid "+C.surface, fontSize:7, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>✓</div>}
              </div>
              <div style={{ fontSize:10, fontWeight:700, color:selectedIdx===e.id?e.color:C.mutedLt, fontFamily:"sans-serif", whiteSpace:"nowrap" }}>{e.year}</div>
              <div style={{ fontSize:10, color:selectedIdx===e.id?"#fff":C.muted, whiteSpace:"nowrap", fontFamily:"sans-serif", maxWidth:90, textAlign:"center", lineHeight:1.3 }}>{e.title.split(" ").slice(0,3).join(" ")}</div>
              {selectedIdx===e.id && <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", height:2, background:e.color }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Event detail */}
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"28px 24px 60px" }}>
        <div className="fade" key={selectedIdx}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden", marginBottom:20 }}>
            <div style={{ background:`linear-gradient(135deg,${event.color}15,transparent)`, borderBottom:`1px solid ${C.border}`, padding:"22px 28px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
              <div>
                <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                  <span style={{ background:`${event.color}20`, border:`1px solid ${event.color}40`, borderRadius:20, padding:"3px 12px", fontSize:11, color:event.color, fontFamily:"sans-serif", fontWeight:600 }}>{event.category}</span>
                  <span style={{ background:"rgba(255,255,255,.04)", borderRadius:20, padding:"3px 12px", fontSize:11, color:C.mutedLt, fontFamily:"sans-serif" }}>📍 {event.place}</span>
                  {readEvents.has(event.id) && <span style={{ background:"rgba(16,185,129,.15)", border:"1px solid rgba(16,185,129,.3)", borderRadius:20, padding:"3px 12px", fontSize:11, color:"#34d399", fontFamily:"sans-serif" }}>✓ Lu</span>}
                </div>
                <h2 style={{ fontSize:24, fontWeight:700, color:"#fff", fontFamily:"'Cormorant Garamond',serif", marginBottom:4 }}>{event.title}</h2>
                <div style={{ fontFamily:"serif", fontSize:18, color:event.color }}>{event.titleAr}</div>
                <div style={{ fontSize:12, color:C.mutedLt, fontFamily:"sans-serif", marginTop:4 }}>{event.year} — {event.yearAr}</div>
              </div>
              <span style={{ fontSize:52 }}>{event.icon}</span>
            </div>

            <div style={{ padding:"22px 28px" }}>
              <p style={{ fontSize:15, color:C.text, lineHeight:1.9, marginBottom:22, fontFamily:"'IBM Plex Sans Arabic',sans-serif" }}>{event.body}</p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
                <div style={{ background:C.panel, borderRadius:12, padding:"14px 16px" }}>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, color:C.mutedLt, textTransform:"uppercase", marginBottom:8, fontFamily:"sans-serif" }}>Leçons</div>
                  {event.lessons.map((l,i) => (
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13, color:C.text, lineHeight:1.5, fontFamily:"sans-serif" }}>
                      <span style={{ color:event.color, flexShrink:0 }}>✦</span> {l}
                    </div>
                  ))}
                </div>
                <div style={{ background:C.panel, borderRadius:12, padding:"14px 16px" }}>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, color:C.mutedLt, textTransform:"uppercase", marginBottom:8, fontFamily:"sans-serif" }}>Référence Coranique</div>
                  <div style={{ fontSize:13, color:event.color, lineHeight:1.6, fontStyle:"italic", fontFamily:"sans-serif" }}>📖 {event.quranRef}</div>
                  <div style={{ marginTop:12, background:`${event.color}10`, border:`1px solid ${event.color}25`, borderRadius:10, padding:"10px 12px" }}>
                    <div style={{ fontSize:11, color:C.mutedLt, fontFamily:"sans-serif", marginBottom:4 }}>Question rapide</div>
                    <div style={{ fontSize:13, color:C.text, fontFamily:"sans-serif" }}>{event.quiz.q}</div>
                  </div>
                </div>
              </div>

              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button onClick={() => { setShowAI(true); markRead(event.id); }}
                  style={{ flex:1, minWidth:180, background:`linear-gradient(135deg,${event.color}20,${event.color}10)`, border:`1px solid ${event.color}40`, borderRadius:14, padding:"12px", cursor:"pointer", color:event.color, fontWeight:700, fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  ✨ Explorer avec l'IA
                </button>
                {!readEvents.has(event.id) && (
                  <button onClick={() => markRead(event.id)}
                    style={{ background:"rgba(16,185,129,.12)", border:"1px solid rgba(16,185,129,.3)", borderRadius:14, padding:"12px 20px", cursor:"pointer", color:"#34d399", fontWeight:700, fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                    ✓ Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <button onClick={() => { const prev=EVENTS[Math.max(0,selectedIdx-1)]; setSelectedIdx(prev.id); markRead(prev.id); }} disabled={selectedIdx===0}
              style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.mutedLt, borderRadius:12, padding:"10px 20px", cursor:selectedIdx===0?"not-allowed":"pointer", fontFamily:"sans-serif", fontWeight:600, fontSize:13, opacity:selectedIdx===0?.4:1 }}>
              ← Précédent
            </button>
            <div style={{ fontSize:12, color:C.muted, fontFamily:"sans-serif" }}>
              {selectedIdx+1} / {EVENTS.length} événements
            </div>
            <button onClick={() => { const next=EVENTS[Math.min(EVENTS.length-1,selectedIdx+1)]; setSelectedIdx(next.id); markRead(next.id); }} disabled={selectedIdx===EVENTS.length-1}
              style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.mutedLt, borderRadius:12, padding:"10px 20px", cursor:selectedIdx===EVENTS.length-1?"not-allowed":"pointer", fontFamily:"sans-serif", fontWeight:600, fontSize:13, opacity:selectedIdx===EVENTS.length-1?.4:1 }}>
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}