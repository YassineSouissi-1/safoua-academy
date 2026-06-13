import React, { useState } from "react";
import { api } from "../../utils/auth";

const COURSE_TITLE = "Introduction au Fiqh";
const MODULE_TITLE = "Introduction au Fiqh";

async function saveProgress(lessonTitle) {
  try {
    await api.post("/api/update-progress", { lessonTitle });
  } catch (err) {
    console.error("Erreur progression:", err);
  }
}

const C = {
  bg:       "#080b0f",
  surface:  "#0f1318",
  panel:    "#161c24",
  border:   "#1e2832",
  accent:   "#ef4444",
  accentLt: "#fca5a5",
  text:     "#e7edf3",
  muted:    "#4b5563",
  mutedLt:  "#9ca3af",
};

const LEVEL_COLORS = {
  "فرض":  { bg:"rgba(239,68,68,.15)",   border:"#ef4444", text:"#fca5a5" },
  "واجب": { bg:"rgba(245,158,11,.12)",  border:"#f59e0b", text:"#fcd34d" },
  "شرط":  { bg:"rgba(59,130,246,.12)",  border:"#3b82f6", text:"#93c5fd" },
  "رخصة": { bg:"rgba(16,185,129,.12)",  border:"#10b981", text:"#6ee7b7" },
  "محرم": { bg:"rgba(139,92,246,.12)",  border:"#8b5cf6", text:"#c4b5fd" },
  "سنة":  { bg:"rgba(236,72,153,.12)",  border:"#ec4899", text:"#f9a8d4" },
};

const PILLARS = [
  {
    id: 0, ar: "الطَّهَارَة", fr: "La Purification", icon: "💧", color: "#0ea5e9",
    subtitle: "Conditions de l'adoration",
    desc: "La purification (طهارة) est la condition première pour la prière et de nombreux actes d'adoration. Elle englobe la purification physique et spirituelle selon des règles précises.",
    rulings: [
      { title: "الوضوء — L'ablution (Wudhu)", level: "فرض", levelFr: "Obligatoire", text: "Le Wudhu est obligatoire avant la prière. Il consiste à laver le visage, les mains jusqu'aux coudes, se passer les mains humides sur la tête et laver les pieds jusqu'aux chevilles. Conditions : intention (نية), eau pure, ordre correct des membres.", evidence: "Sourate Al-Mā'idah 5:6" },
      { title: "الغسل — La grande ablution (Ghusl)", level: "فرض", levelFr: "Obligatoire", text: "Le Ghusl devient obligatoire après la janāba (impureté majeure), les menstruations, l'accouchement. Il faut mouiller entièrement le corps avec intention. Les 3 éléments : intention, se rincer la bouche, mouiller tout le corps.", evidence: "Sourate An-Nisā' 4:43" },
      { title: "التيمم — L'ablution sèche", level: "رخصة", levelFr: "Dispense", text: "Quand l'eau est absente ou nuisible pour la santé, on frappe la terre propre une seule fois avec les deux mains, puis on se touche le visage et les mains. Valide pour la prière.", evidence: "Sourate Al-Mā'idah 5:6" },
      { title: "النجاسة — L'impureté", level: "محرم", levelFr: "Interdit", text: "Certaines substances sont rituellement impures (نجس) : le sang, l'urine, les excréments, l'alcool, la charogne. Le contact avec elles nécessite une purification avant la prière. Le corps du musulman est pur par nature.", evidence: "Hadith : 'La pureté est la moitié de la foi' — Muslim" },
    ],
    quiz: [
      { q: "Combien de fois frappe-t-on la terre pour le Tayammum ?", opts: ["Deux fois", "Une seule fois", "Trois fois", "Quatre fois"], ans: 1 },
      { q: "Le Wudhu est :", opts: ["Sunnah", "Moustahabb", "Fard (obligatoire)", "Makruh"], ans: 2 },
      { q: "Lequel de ces éléments NE fait PAS partie du Wudhu ?", opts: ["Laver le visage", "Se couper les ongles", "Laver les pieds", "Se passer les mains sur la tête"], ans: 1 },
      { q: "Le Ghusl est obligatoire dans quel cas ?", opts: ["Après avoir mangé", "Après les menstruations", "Avant chaque prière", "Après avoir dormi"], ans: 1 },
    ],
  },
  {
    id: 1, ar: "الصَّلَاة", fr: "La Prière", icon: "🕌", color: "#8b5cf6",
    subtitle: "Pilier de l'Islam",
    desc: "La prière (صلاة) est le second pilier de l'Islam et le lien direct entre le serviteur et Allah. Elle est obligatoire 5 fois par jour pour tout musulman pubère et sain d'esprit.",
    rulings: [
      { title: "أوقات الصلاة — Les heures de prière", level: "فرض", levelFr: "Obligatoire", text: "Al-Fajr (aube avant le lever du soleil), Ad-Dhuhr (quand le soleil décline), Al-Asr (milieu d'après-midi), Al-Maghrib (juste après le coucher du soleil), Al-Ishā' (début de la nuit). Chaque prière a une heure précise qu'il ne faut pas dépasser.", evidence: "Sourate An-Nisā' 4:103" },
      { title: "شروط صحة الصلاة — Conditions de validité", level: "شرط", levelFr: "Condition", text: "Purification (wudhu), couverture de l'awra, direction de la Qibla (La Mecque), entrée du temps de prière, intention (نية). Sans l'une de ces conditions, la prière est invalide.", evidence: "Hadith du Prophète ﷺ — Bukhari" },
      { title: "أركان الصلاة — Piliers de la prière", level: "فرض", levelFr: "Obligatoire", text: "Takbīrat Al-Ihrām (الله أكبر), la station debout (pour celui qui peut), la récitation d'Al-Fatiha, le rukū' (inclination), les deux sujud (prosternations), le tashahhud final, le salām. Manquer un pilier invalide la prière.", evidence: "Hadith : 'Priez comme vous m'avez vu prier' — Bukhari" },
      { title: "صلاة الجماعة — Prière en congrégation", level: "واجب", levelFr: "Requis", text: "La prière en congrégation à la mosquée est fortement recommandée pour les hommes (certains savants disent obligatoire). Sa récompense est 27 fois supérieure à la prière individuelle selon le hadith.", evidence: "Sahih Muslim 649" },
    ],
    quiz: [
      { q: "Combien de prières obligatoires y a-t-il par jour ?", opts: ["3", "4", "5", "6"], ans: 2 },
      { q: "La prière en congrégation vaut combien de fois plus ?", opts: ["7 fois", "17 fois", "27 fois", "70 fois"], ans: 2 },
      { q: "Qu'est-ce que la Takbīrat Al-Ihrām ?", opts: ["La salutation finale", "الله أكبر au début de la prière", "La récitation d'Al-Fatiha", "La prosternation"], ans: 1 },
      { q: "Quelle est la première condition de validité de la prière ?", opts: ["Être à la mosquée", "La purification (wudhu)", "Avoir un tapis de prière", "Connaître le Coran par cœur"], ans: 1 },
    ],
  },
  {
    id: 2, ar: "الزَّكَاة", fr: "La Zakat", icon: "🌿", color: "#10b981",
    subtitle: "Purification des biens",
    desc: "La Zakat est le troisième pilier : un prélèvement annuel obligatoire sur la richesse excédant le nisāb (seuil minimum), destiné aux 8 catégories bénéficiaires mentionnées dans le Coran.",
    rulings: [
      { title: "النصاب — Le seuil minimum", level: "شرط", levelFr: "Condition", text: "Le Nisāb pour l'or est de 85g, pour l'argent 595g. La Zakat n'est due que si la richesse a atteint ce seuil pendant un an complet (hawl الحول). Le taux standard est 2,5% de la richesse totale.", evidence: "Hadith mutwātir — consensus des savants" },
      { title: "مصارف الزكاة — Les 8 bénéficiaires", level: "فرض", levelFr: "Obligatoire", text: "1- Les pauvres (فقراء), 2- les nécessiteux (مساكين), 3- les collecteurs de Zakat, 4- ceux dont le cœur est à attirer à l'Islam, 5- les esclaves à libérer, 6- les endettés, 7- la cause d'Allah (في سبيل الله), 8- les voyageurs en détresse.", evidence: "Sourate At-Tawbah 9:60" },
      { title: "زكاة الفطر — Zakat Al-Fitr", level: "واجب", levelFr: "Obligatoire", text: "Obligatoire pour tout musulman capable avant la prière de l'Aïd Al-Fitr. Équivaut à un Sa' (≈2.5 kg) de nourriture de base du pays. Elle purifie le jeûne de Ramadan des manquements.", evidence: "Hadith — Sahih Bukhari & Muslim" },
      { title: "زكاة التجارة — Zakat sur le commerce", level: "فرض", levelFr: "Obligatoire", text: "Les biens commerciaux (stocks, marchandises) sont soumis à la Zakat au taux de 2,5% si leur valeur dépasse le Nisāb après un an. Les revenus locatifs, actions boursières et épargnes suivent des règles similaires.", evidence: "Consensus des 4 écoles juridiques" },
    ],
    quiz: [
      { q: "Le Nisāb pour l'or est :", opts: ["50g", "85g", "100g", "200g"], ans: 1 },
      { q: "Combien de catégories bénéficiaires de la Zakat ?", opts: ["5", "6", "7", "8"], ans: 3 },
      { q: "Quel est le taux standard de la Zakat sur la richesse ?", opts: ["1%", "2,5%", "5%", "10%"], ans: 1 },
      { q: "La Zakat Al-Fitr doit être payée :", opts: ["N'importe quand en Ramadan", "Avant la prière de l'Aïd", "Après l'Aïd", "Le 1er Ramadan"], ans: 1 },
    ],
  },
  {
    id: 3, ar: "الصِّيَام", fr: "Le Jeûne", icon: "🌙", color: "#f59e0b",
    subtitle: "Ramadan et jeûnes",
    desc: "Le jeûne de Ramadan est le quatrième pilier : s'abstenir de manger, boire et toute relation conjugale du Fajr au Maghrib pendant le mois de Ramadan, avec sincérité et piété.",
    rulings: [
      { title: "فرائض الصيام — Conditions du jeûne", level: "فرض", levelFr: "Obligatoire", text: "Intention (niyya) avant le Fajr pour le jeûne obligatoire, abstention de tout ce qui rompt le jeûne du Fajr au Maghrib. Conditions : Islam, puberté, santé mentale, absence de voyage long ou maladie invalidante.", evidence: "Sourate Al-Baqarah 2:183-185" },
      { title: "مفسدات الصيام — Ce qui rompt le jeûne", level: "محرم", levelFr: "Interdit", text: "Manger ou boire intentionnellement, relations conjugales, vomissement volontaire, injection nourrissante. L'oubli ne rompt pas le jeûne selon le hadith : 'Mangez et buvez, c'est Allah qui vous a nourri.' Certains actes sont disputés entre écoles.", evidence: "Consensus et Hadith Bukhari 1933" },
      { title: "المفطرون — Exemptions légales", level: "رخصة", levelFr: "Dispense", text: "Le malade dont le jeûne aggrave l'état, le voyageur (voyage ≥88km), la femme enceinte ou allaitante si crainte pour elle/l'enfant, la personne âgée incapable. Ils doivent rattraper (قضاء) ou payer la fidya (kafāra).", evidence: "Sourate Al-Baqarah 2:185 & 184" },
      { title: "الكفارة — L'expiation", level: "واجب", levelFr: "Obligatoire", text: "Si le jeûne de Ramadan est rompu par relation conjugale intentionnelle : libérer un esclave OU jeûner 2 mois consécutifs OU nourrir 60 pauvres (par ordre de capacité). Pour les autres ruptures intentionnelles : rattrapage (قضاء) uniquement.", evidence: "Hadith — Sahih Bukhari & Muslim" },
    ],
    quiz: [
      { q: "Le jeûne de Ramadan est :", opts: ["Sunnah", "Mustahabb", "Fard", "Makruh"], ans: 2 },
      { q: "L'expiation pour avoir rompu le jeûne intentionnellement par relation conjugale inclut :", opts: ["Juste du repentir", "Nourrir 10 pauvres", "Jeûner 60 jours consécutifs", "Payer 100€"], ans: 2 },
      { q: "Qu'est-ce qui NE rompt PAS le jeûne ?", opts: ["Manger par oubli", "Boire intentionnellement", "Relations conjugales", "Vomissement volontaire"], ans: 0 },
      { q: "Qui est exempté du jeûne de Ramadan ?", opts: ["Celui qui travaille dur", "Le voyageur (voyage long)", "Celui qui a faim", "L'étudiant en examen"], ans: 1 },
    ],
  },
  {
    id: 4, ar: "الحَجّ", fr: "Le Pèlerinage", icon: "🕋", color: "#f97316",
    subtitle: "5ème pilier de l'Islam",
    desc: "Le Hajj est le cinquième pilier de l'Islam : le pèlerinage à La Mecque, obligatoire une fois dans la vie pour tout musulman qui en a la capacité physique et financière.",
    rulings: [
      { title: "فريضة الحج — Obligation du Hajj", level: "فرض", levelFr: "Obligatoire", text: "Le Hajj est obligatoire une fois dans la vie pour tout musulman adulte, sain d'esprit, libre, et capable (الاستطاعة) — capacité physique et financière d'accomplir le voyage sans s'endetter ni laisser sa famille dans le besoin. Il se pratique au mois de Dhul-Hijja.", evidence: "Sourate Āl 'Imrān 3:97 — 'Le pèlerinage à la Maison est un devoir envers Allah'" },
      { title: "أركان الحج — Les piliers du Hajj", level: "فرض", levelFr: "Obligatoire", text: "1- L'Ihrām (état de consécration avec intention), 2- La station à Arafat (9 Dhul-Hijja — condition sine qua non), 3- Le Tawāf Al-Ifāda (7 tours autour de la Ka'ba), 4- Le Sa'i (7 fois entre Safā et Marwā). Manquer l'un invalide le Hajj.", evidence: "Hadith : 'Le Hajj est Arafat' — Tirmidhi" },
      { title: "محظورات الإحرام — Interdits de l'Ihrām", level: "محرم", levelFr: "Interdit", text: "Pendant l'Ihrām il est interdit de : couper cheveux/ongles, se parfumer, porter des vêtements cousus (pour l'homme), chasser, se marier, avoir des relations conjugales. L'Ihrām symbolise l'égalité devant Allah — tous portent deux pièces de tissu blanc.", evidence: "Sourate Al-Baqarah 2:197" },
      { title: "العمرة — Le petit pèlerinage", level: "سنة", levelFr: "Sunnah fortement recommandée", text: "L'Umra (Ihrām + Tawāf + Sa'i + rasage/coupe de cheveux) peut être accomplie à n'importe quel moment de l'année. Certains savants la considèrent obligatoire une fois. Le Hajj Al-Qirān combine Hajj et Umra. Le Prophète ﷺ dit : 'L'Umra jusqu'à l'Umra expie les péchés entre les deux.'", evidence: "Sahih Bukhari 1773" },
    ],
    quiz: [
      { q: "Combien de fois le Hajj est-il obligatoire dans une vie ?", opts: ["Chaque année", "5 fois", "Une seule fois", "Jamais, c'est sunnah"], ans: 2 },
      { q: "Quel est le pilier le plus important du Hajj sans lequel il est invalide ?", opts: ["Le Tawāf", "La station à Arafat", "Le Sa'i", "Le sacrifice"], ans: 1 },
      { q: "Qu'est-ce que l'Ihrām ?", opts: ["La prière du vendredi", "L'état de consécration pour le Hajj/Umra", "La course entre Safā et Marwā", "Le sacrifice de l'Aïd"], ans: 1 },
      { q: "Combien de tours comprend le Tawāf autour de la Ka'ba ?", opts: ["5", "6", "7", "8"], ans: 2 },
    ],
  },
];

const FINAL_QUIZ = [
  { q: "Combien de piliers de l'Islam y a-t-il ?", opts: ["4", "5", "6", "7"], ans: 1 },
  { q: "La Shahada est le quel pilier ?", opts: ["1er", "2ème", "3ème", "4ème"], ans: 0 },
  { q: "Le Nisāb pour l'argent est de :", opts: ["200g", "400g", "595g", "1kg"], ans: 2 },
  { q: "Combien de prières obligatoires par jour ?", opts: ["3", "4", "5", "6"], ans: 2 },
  { q: "Le Ghusl est obligatoire après :", opts: ["Le sommeil", "Les menstruations", "Avoir mangé", "Avoir touché un non-mahram"], ans: 1 },
  { q: "La station à Arafat a lieu quel jour du Hajj ?", opts: ["7 Dhul-Hijja", "8 Dhul-Hijja", "9 Dhul-Hijja", "10 Dhul-Hijja"], ans: 2 },
  { q: "Qui peut être exempté du jeûne de Ramadan ?", opts: ["Celui qui travaille", "Le voyageur en long voyage", "L'étudiant", "Celui qui a faim"], ans: 1 },
  { q: "La Zakat Al-Fitr est payée :", opts: ["Le 1er Ramadan", "Au milieu de Ramadan", "Avant la prière de l'Aïd", "Après l'Aïd"], ans: 2 },
];

/* ─── AI modal ──────────────────────────────────────────────────── */
function AICaseStudy({ pillar, onClose }) {
  const [scenario, setScenario] = useState("");
  const [answer, setAnswer]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [asked, setAsked]       = useState(false);

  const PRESETS = [
    "Je suis en voyage longue distance. Dois-je jeûner ce jour ?",
    "J'ai oublié de faire le wudhu avant la prière. Que faire ?",
    "Ma richesse vient de dépasser le nisāb il y a 6 mois. Dois-je payer la Zakat maintenant ?",
    "Je suis malade et ne peux pas faire le Hajj cette année. Que faire ?",
  ];

  const ask = async () => {
    const q = scenario.trim();
    if (!q || loading) return;
    setLoading(true); setAsked(true); setAnswer("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `Tu es un savant islamique pédagogique qui enseigne le Fiqh. Tu présentes les positions des 4 écoles (Hanafi, Maliki, Shafi'i, Hanbali) quand elles diffèrent. Tu cites les preuves coraniques et les hadiths. Tu RAPPELLES toujours que pour des questions pratiques importantes, il faut consulter un savant qualifié. Contexte du cours : ${pillar}. Réponds en français, de façon claire et structurée.`,
          messages: [{ role: "user", content: q }],
        }),
      });
      const data = await res.json();
      setAnswer(data.content?.[0]?.text || "Erreur.");
    } catch { setAnswer("Erreur de connexion."); }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:620, maxHeight:"80vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ background:"linear-gradient(135deg,#1c0a0a,#2d1515)", padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>⚖️</span>
            <div>
              <div style={{ fontWeight:700, color:"#fff", fontSize:14 }}>Assistant Fiqh — IA</div>
              <div style={{ fontSize:11, color:C.accentLt }}>Cas pratiques & questions juridiques</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.1)", border:"none", color:"#fff", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:14 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:20 }}>
          <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:C.accentLt }}>
            ⚠️ Outil pédagogique uniquement. Pour des questions importantes, consultez un savant qualifié.
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, color:C.mutedLt, marginBottom:8 }}>Scénarios suggérés :</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {PRESETS.map(p => (
                <button key={p} onClick={() => setScenario(p)}
                  style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", cursor:"pointer", textAlign:"left", fontSize:12, color:C.mutedLt, fontFamily:"inherit" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <textarea value={scenario} onChange={e => setScenario(e.target.value)}
            placeholder="Décrivez votre cas ou posez une question de Fiqh..."
            style={{ width:"100%", background:C.panel, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px", color:C.text, fontSize:14, outline:"none", resize:"vertical", minHeight:80, fontFamily:"inherit", boxSizing:"border-box" }}
          />
          <button onClick={ask} disabled={!scenario.trim() || loading}
            style={{ width:"100%", marginTop:10, background:loading?C.border:C.accent, border:"none", color:"#fff", borderRadius:12, padding:"12px", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit" }}>
            {loading ? "⏳ Analyse en cours..." : "⚖️ Obtenir la réponse Fiqh"}
          </button>
          {asked && !loading && answer && (
            <div style={{ marginTop:16, background:C.panel, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px", fontSize:13, lineHeight:1.8, color:C.text, whiteSpace:"pre-wrap" }}>
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Final Quiz Modal ──────────────────────────────────────────── */
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
    const newScore = score + (ans === q.ans ? 1 : 0);
    if (step + 1 >= FINAL_QUIZ.length) { setDone(true); onComplete(newScore); return; }
    setStep(s => s + 1); setAns(null);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:560, overflow:"hidden" }}>
        <div style={{ background:"linear-gradient(135deg,#1c0a0a,#2d1515)", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontWeight:700, color:"#fff" }}>🎯 Quiz Final — Fiqh complet</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.12)", border:"none", color:"#fff", borderRadius:8, padding:"6px 14px", cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:24 }}>
          {!done ? (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontSize:12, color:C.mutedLt, fontWeight:700 }}>Question {step+1}/{FINAL_QUIZ.length}</span>
                <span style={{ fontSize:12, color:C.accent, fontWeight:700 }}>Score : {score}</span>
              </div>
              <div style={{ height:4, background:"rgba(255,255,255,.06)", borderRadius:2, marginBottom:20, overflow:"hidden" }}>
                <div style={{ width:`${(step/FINAL_QUIZ.length)*100}%`, height:"100%", background:C.accent, transition:"width .4s" }} />
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
              <div style={{ fontSize:28, fontWeight:700, color:C.accentLt, marginBottom:6 }}>{score} / {FINAL_QUIZ.length}</div>
              <p style={{ color:C.mutedLt, fontSize:14, marginBottom:20 }}>
                {score >= 6 ? "Excellent ! Vous maîtrisez le Fiqh de base !" : score >= 4 ? "Bien ! Continuez à réviser." : "Relisez les chapitres et réessayez."}
              </p>
              <button onClick={onClose} style={{ background:C.accent, border:"none", color:"#fff", borderRadius:12, padding:"10px 28px", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Fermer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────── */
export default function Fiqh() {
  const [activePillar, setActivePillar] = useState(0);
  const [activeTab,    setActiveTab]    = useState("rulings");
  const [showAI,       setShowAI]       = useState(false);
  const [showFinalQuiz,setShowFinalQuiz]= useState(false);
  const [quizStep,     setQuizStep]     = useState(0);
  const [quizAns,      setQuizAns]      = useState(null);
  const [quizScore,    setQuizScore]    = useState(0);
  const [quizDone,     setQuizDone]     = useState(false);
  const [completedPillars, setCompletedPillars] = useState(new Set());
  const [finalQuizDone,    setFinalQuizDone]    = useState(false);

  const pillar = PILLARS[activePillar];

  const pct = Math.round((completedPillars.size / PILLARS.length) * 100);

  const markPillarComplete = (id) => {
    if (completedPillars.has(id)) return;
    const updated = new Set([...completedPillars, id]);
    setCompletedPillars(updated);
    const p = PILLARS.find(pl => pl.id === id);
    saveProgress(`${COURSE_TITLE} — ${MODULE_TITLE} — ${p.fr}`);
  };

  const pickQuiz = (i) => {
    if (quizAns !== null) return;
    setQuizAns(i);
    if (i === pillar.quiz[quizStep].ans) setQuizScore(s => s + 1);
  };

  const nextQuiz = () => {
    if (quizStep + 1 >= pillar.quiz.length) {
      setQuizDone(true);
      markPillarComplete(activePillar);
      return;
    }
    setQuizStep(s => s + 1); setQuizAns(null);
  };

  const resetQuiz = () => { setQuizStep(0); setQuizAns(null); setQuizScore(0); setQuizDone(false); };

  const switchPillar = (id) => {
    setActivePillar(id); setActiveTab("rulings"); resetQuiz();
  };

  const handleFinalQuizComplete = (score) => {
    setFinalQuizDone(true);
    saveProgress(`${COURSE_TITLE} — ${MODULE_TITLE} — Quiz Fiqh`);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation: fadeIn .3s ease; }
      `}</style>

      {showAI       && <AICaseStudy pillar={`${pillar.ar} — ${pillar.fr}`} onClose={() => setShowAI(false)} />}
      {showFinalQuiz && <FinalQuiz onClose={() => setShowFinalQuiz(false)} onComplete={handleFinalQuizComplete} />}

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#080b0f 0%,#1a0a0a 60%,#080b0f 100%)", borderBottom:`1px solid ${C.border}`, padding:"80px 24px 28px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            <div style={{ width:52, height:52, borderRadius:14, flexShrink:0, background:"rgba(239,68,68,.12)", border:"1.5px solid rgba(239,68,68,.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>⚖️</div>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:"#fff", fontFamily:"'Playfair Display', serif", lineHeight:1.1 }}>مبادئ الفقه الإسلامي</div>
              <div style={{ fontSize:13, color:C.mutedLt, marginTop:2 }}>Introduction au Fiqh — Les 5 Piliers de l'Islam</div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ background:"rgba(255,255,255,.04)", borderRadius:12, padding:"12px 18px", display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:12, color:C.mutedLt }}>Chapitres complétés</span>
                <span style={{ fontSize:12, color:C.accentLt, fontWeight:700 }}>{completedPillars.size}/{PILLARS.length} — {pct}%</span>
              </div>
              <div style={{ height:5, background:"rgba(255,255,255,.07)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${C.accent},#f97316)`, borderRadius:3, transition:"width .5s" }} />
              </div>
            </div>
            <button onClick={() => setShowFinalQuiz(true)}
              style={{ background:`linear-gradient(135deg,${C.accent},#dc2626)`, border:"none", color:"#fff", borderRadius:12, padding:"10px 18px", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
              {finalQuizDone ? "✓ Quiz refaire" : "🎯 Quiz final"}
            </button>
          </div>

          {/* Pillar tabs */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {PILLARS.map(p => (
              <button key={p.id} onClick={() => switchPillar(p.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:20, border:`1.5px solid ${activePillar===p.id?p.color:C.border}`, background:activePillar===p.id?`${p.color}18`:"transparent", color:activePillar===p.id?p.color:C.mutedLt, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", position:"relative" }}>
                <span>{p.icon}</span> {p.fr}
                {completedPillars.has(p.id) && <span style={{ fontSize:10, background:"#10b981", color:"#fff", borderRadius:"50%", width:14, height:14, display:"inline-flex", alignItems:"center", justifyContent:"center", marginLeft:2 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"24px 24px 60px" }}>

        {/* Pillar header card */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 22px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:32, flexShrink:0 }}>{pillar.icon}</span>
            <div>
              <div style={{ fontFamily:"serif", fontSize:22, color:pillar.color, lineHeight:1 }}>{pillar.ar}</div>
              <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginTop:2 }}>{pillar.fr}</div>
              <div style={{ fontSize:12, color:C.mutedLt, marginTop:2 }}>{pillar.subtitle}</div>
            </div>
          </div>
          <button onClick={() => setShowAI(true)} style={{ background:"linear-gradient(135deg,#1c0a0a,#2d1515)", border:`1px solid rgba(239,68,68,.35)`, borderRadius:12, padding:"10px 18px", color:C.accentLt, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit", whiteSpace:"nowrap" }}>
            ⚖️ Cas pratique IA
          </button>
        </div>

        {/* Content tabs */}
        <div style={{ display:"flex", gap:4, background:C.panel, borderRadius:12, padding:4, width:"fit-content", marginBottom:20 }}>
          {[["rulings","📜 Règles"],["quiz","🎯 Quiz"]].map(([k,l]) => (
            <button key={k} onClick={() => setActiveTab(k)} style={{ padding:"8px 22px", borderRadius:8, border:"none", background:activeTab===k?pillar.color:"transparent", color:activeTab===k?"#fff":C.muted, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit", transition:"background .2s" }}>
              {l}
            </button>
          ))}
        </div>

        {/* RULINGS TAB */}
        {activeTab === "rulings" && (
          <div className="fade">
            <p style={{ color:C.mutedLt, fontSize:14, lineHeight:1.7, marginBottom:18, padding:"12px 16px", background:C.panel, borderRadius:10, borderLeft:`3px solid ${pillar.color}` }}>
              {pillar.desc}
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {pillar.rulings.map((r, i) => {
                const lc = LEVEL_COLORS[r.level] || LEVEL_COLORS["فرض"];
                return (
                  <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 22px" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:10, flexWrap:"wrap" }}>
                      <div style={{ fontFamily:"serif", fontSize:16, color:"#fff", fontWeight:700, flex:1, minWidth:0 }}>{r.title}</div>
                      <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                        <span style={{ background:lc.bg, border:`1px solid ${lc.border}`, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, color:lc.text }}>{r.level}</span>
                        <span style={{ background:"rgba(255,255,255,.05)", borderRadius:20, padding:"3px 10px", fontSize:11, color:C.mutedLt }}>{r.levelFr}</span>
                      </div>
                    </div>
                    <p style={{ color:C.mutedLt, fontSize:14, lineHeight:1.7, marginBottom:10 }}>{r.text}</p>
                    <div style={{ fontSize:12, color:pillar.color, fontStyle:"italic" }}>📖 {r.evidence}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setActiveTab("quiz")} style={{ marginTop:20, width:"100%", background:`${pillar.color}15`, border:`1px solid ${pillar.color}40`, borderRadius:14, padding:"13px", cursor:"pointer", color:pillar.color, fontWeight:700, fontSize:14, fontFamily:"inherit" }}>
              🎯 Tester mes connaissances →
            </button>
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === "quiz" && (
          <div className="fade" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px" }}>
            {!quizDone ? (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>
                    Question {quizStep+1} / {pillar.quiz.length}
                  </span>
                  <span style={{ fontSize:12, color:pillar.color, fontWeight:700 }}>Score : {quizScore}</span>
                </div>
                <div style={{ height:4, background:"rgba(255,255,255,.06)", borderRadius:2, marginBottom:20, overflow:"hidden" }}>
                  <div style={{ width:`${(quizStep/pillar.quiz.length)*100}%`, height:"100%", background:pillar.color, transition:"width .4s" }} />
                </div>
                <p style={{ fontSize:16, fontWeight:600, color:C.text, lineHeight:1.6, marginBottom:18 }}>
                  {pillar.quiz[quizStep].q}
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {pillar.quiz[quizStep].opts.map((opt, i) => {
                    let bg = C.panel, border = C.border, col = C.text;
                    if (quizAns !== null) {
                      if (i === pillar.quiz[quizStep].ans) { bg="rgba(16,185,129,.15)"; border="#10b981"; col="#34d399"; }
                      else if (i === quizAns)              { bg="rgba(239,68,68,.10)";  border="#ef4444"; col="#fca5a5"; }
                    }
                    return (
                      <button key={i} onClick={() => pickQuiz(i)} disabled={quizAns !== null}
                        style={{ background:bg, border:`1.5px solid ${border}`, color:col, borderRadius:12, padding:"12px 16px", cursor:quizAns!==null?"default":"pointer", textAlign:"left", fontSize:14, fontFamily:"inherit", transition:"all .2s" }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizAns !== null && (
                  <button onClick={nextQuiz} style={{ marginTop:16, background:pillar.color, border:"none", color:"#fff", borderRadius:12, padding:"10px 24px", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
                    {quizStep+1 >= pillar.quiz.length ? "Terminer ✓" : "Suivant →"}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ fontSize:52, marginBottom:12 }}>{quizScore === pillar.quiz.length ? "🏆" : quizScore >= pillar.quiz.length/2 ? "⭐" : "📚"}</div>
                <div style={{ fontSize:28, fontWeight:700, color:pillar.color, marginBottom:6 }}>{quizScore} / {pillar.quiz.length}</div>
                <div style={{ fontSize:14, color:C.mutedLt, marginBottom:8 }}>
                  {quizScore === pillar.quiz.length ? "Parfait ! Chapitre maîtrisé !" : quizScore >= pillar.quiz.length/2 ? "Bien ! Continuez à réviser." : "Relisez les règles et réessayez."}
                </div>
                {completedPillars.has(activePillar) && (
                  <div style={{ fontSize:12, color:"#34d399", marginBottom:16 }}>✓ Progression sauvegardée</div>
                )}
                <button onClick={resetQuiz} style={{ background:pillar.color, border:"none", color:"#fff", borderRadius:12, padding:"10px 28px", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
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