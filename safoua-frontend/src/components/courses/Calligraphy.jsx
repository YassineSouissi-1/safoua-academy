import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

/* ══════════════════════════════════════════════════════════════════
   PALETTE & CONSTANTS
══════════════════════════════════════════════════════════════════ */
const C = {
  bg:      "#04080f",
  surface: "#080e1a",
  panel:   "#0d1625",
  card:    "#111e30",
  border:  "rgba(56,189,248,0.12)",
  accent:  "#38bdf8",
  accentD: "#0ea5e9",
  gold:    "#f59e0b",
  goldLt:  "#fcd34d",
  teal:    "#2dd4bf",
  rose:    "#fb7185",
  purple:  "#a78bfa",
  text:    "#e2f0ff",
  muted:   "rgba(226,240,255,0.4)",
  dim:     "rgba(226,240,255,0.18)",
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function saveProgress(lessonKey) {
  const email = localStorage.getItem("userEmail");
  if (!email) return;
  try {
    await axios.post(`${API}/api/update-progress`, {
      email,
      lessonTitle: `Tashkeel — ${lessonKey}`,
    });
  } catch {}
}

/* ══════════════════════════════════════════════════════════════════
   TASHKEEL DATA
══════════════════════════════════════════════════════════════════ */
const CHAPTERS = [
  {
    id: "short",
    title: "Voyelles Courtes",
    titleAr: "الحركات القصيرة",
    color: C.accent,
    icon: "◌َ",
    description: "Les trois voyelles de base : fatha (a), kasra (i), damma (u).",
    level: "Débutant",
    lessons: [
      {
        id: "fatha", name: "Fatha  — le A court", signName: "Fatha", sign: "◌َ", color: C.accent,
        base: "م",
        tip: "La fatha est un petit trait oblique AU-DESSUS de la lettre. Elle donne le son A comme dans « ami ».",
        rule: "Lettre + fatha → son « a »",
        examples: [
          { arab: "مَ",  roman: "ma",  fr: "ma  (comme dans « ma » française)",          ayah:{ surah:1, ayah:1 } },
          { arab: "بَ",  roman: "ba",  fr: "ba  (comme dans « bal »)",                   ayah:{ surah:2, ayah:1 } },
          { arab: "نَ",  roman: "na",  fr: "na  (comme dans « nage »)",                  ayah:{ surah:68, ayah:1 } },
          { arab: "سَ",  roman: "sa",  fr: "sa  (comme dans « sac »)",                   ayah:{ surah:94, ayah:1 } },
          { arab: "كَ",  roman: "ka",  fr: "ka  (comme dans « café »)",                  ayah:{ surah:108, ayah:1 } },
          { arab: "لَ",  roman: "la",  fr: "la  (comme dans « la » musicale)",            ayah:{ surah:103, ayah:1 } },
        ],
      },
      {
        id: "kasra", name: "Kasra — le I court", signName: "Kasra", sign: "◌ِ", color: C.teal,
        base: "م",
        tip: "La kasra est un petit trait oblique EN DESSOUS de la lettre. Elle donne le son I comme dans « île ».",
        rule: "Lettre + kasra → son « i »",
        examples: [
          { arab: "مِ",  tts: "مِنْ",       roman: "mi",  fr: "mi  (la note de musique)",          ayah:{ surah:1, ayah:2 } },
          { arab: "بِ",  tts: "بِئْرٌ",     roman: "bi",  fr: "bi  (comme dans « bidon »)",         ayah:{ surah:1, ayah:1 } },
          { arab: "نِ",  tts: "نِعْمَةٌ",   roman: "ni",  fr: "ni  (comme dans « nid »)",           ayah:{ surah:114, ayah:2 } },
          { arab: "سِ",  tts: "سِتَّةٌ",    roman: "si",  fr: "si  (la note de musique)",           ayah:{ surah:112, ayah:1 } },
          { arab: "كِ",  tts: "كِتَابٌ",    roman: "ki",  fr: "ki  (comme dans « kilo »)",          ayah:{ surah:108, ayah:2 } },
          { arab: "لِ",  tts: "لِسَانٌ",    roman: "li",  fr: "li  (comme dans « lit »)",           ayah:{ surah:1, ayah:2 } },
        ],
      },
      {
        id: "damma", name: "Damma — le U court", signName: "Damma", sign: "◌ُ", color: C.gold,
        base: "م",
        tip: "La damma ressemble à un petit waw (و) au-dessus de la lettre. Elle donne le son U comme dans « flûte ».",
        rule: "Lettre + damma → son « u »",
        examples: [
          { arab: "مُ",  roman: "mu",  fr: "mu  (comme dans « mur »)",          ayah:{ surah:112, ayah:1 } },
          { arab: "بُ",  roman: "bu",  fr: "bu  (passé de « boire »)",           ayah:{ surah:2, ayah:2 } },
          { arab: "نُ",  roman: "nu",  fr: "nu  (sans vêtements)",               ayah:{ surah:68, ayah:1 } },
          { arab: "سُ",  roman: "su",  fr: "su  (passé de « savoir »)",          ayah:{ surah:94, ayah:2 } },
          { arab: "كُ",  roman: "ku",  fr: "ku  (comme dans « kumquat »)",       ayah:{ surah:112, ayah:2 } },
          { arab: "لُ",  roman: "lu",  fr: "lu  (passé de « lire »)",            ayah:{ surah:1, ayah:3 } },
        ],
      },
    ],
  },
  {
    id: "sukun",
    title: "Sukun — Consonne Pure",
    titleAr: "السكون",
    color: C.purple,
    icon: "◌ْ",
    description: "Le sukun (°) indique qu'une lettre N'A PAS de voyelle.",
    level: "Débutant",
    lessons: [
      {
        id: "sukun_intro", name: "Le Sukun — consonne sans voyelle", signName: "Sukun", sign: "◌ْ", color: C.purple,
        base: "ب",
        tip: "Le sukun est un petit cercle vide au-dessus de la lettre. Il signifie : cette consonne est FERMÉE, pas de voyelle après elle.",
        rule: "Lettre + sukun → consonne fermée, pas de voyelle",
        examples: [
          { arab: "بَبْ",  roman: "bab",  fr: "bab  — séquence ba + b fermé",                    ayah:{ surah:110, ayah:1 } },
          { arab: "مَبْ",  roman: "mab",  fr: "mab  — ma + b fermé",                              ayah:{ surah:111, ayah:1 } },
          { arab: "كَلْ",  roman: "kal",  fr: "kal  — ka + l fermé",                              ayah:{ surah:96, ayah:1 } },
          { arab: "مَنْ",  roman: "man",  fr: "man  — comme « man » en anglais",                  ayah:{ surah:99, ayah:7 } },
          { arab: "بِنْ",  roman: "bin",  fr: "bin  — comme « bonne » abrégé",                   ayah:{ surah:114, ayah:1 } },
          { arab: "كُنْ",  roman: "kun",  fr: "kun  — « sois ! » en arabe (ordre divin)",        ayah:{ surah:2, ayah:117 } },
        ],
      },
    ],
  },
  {
    id: "tanwin",
    title: "Tanwin — La Nunation",
    titleAr: "التنوين",
    color: C.rose,
    icon: "◌ً",
    description: "Le tanwin double une voyelle et ajoute un son N à la fin : an, in, un.",
    level: "Débutant",
    lessons: [
      {
        id: "tanwin_fath", name: "Tanwin Fath — « -an »", signName: "Tanwin Fath", sign: "◌ً", color: C.rose,
        base: "م",
        tip: "Double fatha en fin de mot. Prononcez -AN : comme dans « rang » sans le G.",
        rule: "Double fatha → son « -an » en fin de mot",
        examples: [
          { arab: "كِتَابًا",  roman: "kitāban",  fr: "un livre (accusatif)",        ayah:{ surah:2, ayah:2 } },
          { arab: "رَجُلًا",   roman: "rajulan",  fr: "un homme (accusatif)",         ayah:{ surah:2, ayah:30 } },
          { arab: "بَيْتًا",   roman: "baytan",   fr: "une maison (accusatif)",       ayah:{ surah:2, ayah:125 } },
          { arab: "كَلْبًا",   roman: "kalban",   fr: "un chien (accusatif)",         ayah:{ surah:18, ayah:18 } },
        ],
      },
      {
        id: "tanwin_kasr", name: "Tanwin Kasr — « -in »", signName: "Tanwin Kasr", sign: "◌ٍ", color: "#f97316",
        base: "م",
        tip: "Double kasra sous la lettre finale. Prononcez -IN : comme dans « vin ».",
        rule: "Double kasra → son « -in » en fin de mot",
        examples: [
          { arab: "كِتَابٍ",  tts: "كِتَابِنْ",   roman: "kitābin",  fr: "d'un livre (génitif)",         ayah:{ surah:2, ayah:2 } },
          { arab: "رَجُلٍ",   tts: "رَجُلِنْ",    roman: "rajulin",  fr: "d'un homme (génitif)",          ayah:{ surah:36, ayah:20 } },
          { arab: "بَيْتٍ",   tts: "بَيْتِنْ",    roman: "baytin",   fr: "d'une maison (génitif)",        ayah:{ surah:2, ayah:125 } },
          { arab: "عِلْمٍ",   tts: "عِلْمِنْ",    roman: "ʿilmin",   fr: "d'une science (génitif)",       ayah:{ surah:2, ayah:255 } },
        ],
      },
      {
        id: "tanwin_damm", name: "Tanwin Damm — « -un »", signName: "Tanwin Damm", sign: "◌ٌ", color: "#a3e635",
        base: "م",
        tip: "Double damma sur la lettre finale. Prononcez -UN : comme dans « lune ».",
        rule: "Double damma → son « -un » en fin de mot",
        examples: [
          { arab: "كِتَابٌ",  roman: "kitābun",  fr: "un livre (nominatif)",          ayah:{ surah:2, ayah:2 } },
          { arab: "رَجُلٌ",   roman: "rajulun",  fr: "un homme (nominatif)",           ayah:{ surah:36, ayah:20 } },
          { arab: "بَيْتٌ",   roman: "baytun",   fr: "une maison (nominatif)",         ayah:{ surah:2, ayah:125 } },
          { arab: "مُسْلِمٌ", roman: "muslimun", fr: "un musulman (nominatif)",        ayah:{ surah:3, ayah:52 } },
        ],
      },
    ],
  },
  {
    id: "shadda",
    title: "Shadda — La Gémination",
    titleAr: "الشدة",
    color: "#e879f9",
    icon: "◌ّ",
    description: "La shadda double la consonne — comme si vous la teniez une seconde de plus.",
    level: "Intermédiaire",
    lessons: [
      {
        id: "shadda_base", name: "Shadda seule — consonne doublée", signName: "Shadda", sign: "◌ّ", color: "#e879f9",
        base: "م",
        tip: "La shadda ressemble à un W retourné (ّ). Elle double la consonne : maintenez-la une beat avant de la relâcher.",
        rule: "Shadda = consonne × 2 — tenez la consonne une demi-seconde",
        examples: [
          { arab: "مَدَّ",   roman: "madda",  fr: "il a étendu (d doublé)",       ayah:{ surah:73, ayah:20 } },
          { arab: "شَدَّ",   roman: "shadda", fr: "il a tiré fort",                ayah:{ surah:94, ayah:7 } },
          { arab: "رَبَّ",   roman: "rabba",  fr: "Seigneur (intensif)",           ayah:{ surah:1, ayah:2 } },
          { arab: "حَقَّ",   roman: "ḥaqqa",  fr: "il était vrai (q doublé)",     ayah:{ surah:22, ayah:6 } },
        ],
      },
      {
        id: "shadda_fath", name: "Shadda + Fatha", signName: "Shadda + Fatha", sign: "◌َّ", color: "#f0abfc",
        base: "م",
        tip: "Shadda combinée à la fatha : consonne doublée puis son A.",
        rule: "Shadda + fatha = consonne doublée + A",
        examples: [
          { arab: "مَكَّةَ",   tts: "مكة",        roman: "Makkata",   fr: "La Mecque",                    ayah:{ surah:48, ayah:24 } },
          { arab: "جَنَّةَ",   tts: "جنة",         roman: "jannata",   fr: "le paradis",                    ayah:{ surah:2, ayah:35 } },
          { arab: "نَبِيًّا",  tts: "نبيا",        roman: "nabiyyan",  fr: "un prophète",                   ayah:{ surah:19, ayah:30 } },
          { arab: "عَلَيَّ",   tts: "عليّ",        roman: "ʿalayya",   fr: "sur moi",                       ayah:{ surah:20, ayah:36 } },
        ],
      },
      {
        id: "shadda_kasr", name: "Shadda + Kasra", signName: "Shadda + Kasra", sign: "◌ِّ", color: "#c4b5fd",
        base: "م",
        tip: "Shadda + kasra : consonne doublée puis I. Très courant dans les adjectifs de relation.",
        rule: "Shadda + kasra = consonne doublée + I",
        examples: [
          { arab: "نَبِيٌّ",   tts: "نبيٌّ",       roman: "nabiyyun",  fr: "un prophète",                   ayah:{ surah:19, ayah:30 } },
          { arab: "وَلِيٌّ",   tts: "وليٌّ",        roman: "waliyyun",  fr: "un tuteur / ami d'Allah",        ayah:{ surah:2, ayah:257 } },
          { arab: "مَدَنِيٌّ", tts: "مدنيٌّ",       roman: "madaniyyun",fr: "relatif à Médine",               ayah:{ surah:2, ayah:1 } },
          { arab: "عَرَبِيٌّ", tts: "عربيٌّ",       roman: "ʿarabiyyun",fr: "arabe (adjectif)",               ayah:{ surah:12, ayah:2 } },
        ],
      },
    ],
  },
  {
    id: "madd_basic",
    title: "Madd — Voyelles Longues",
    titleAr: "المد الأساسي",
    color: C.teal,
    icon: "آ",
    description: "Les voyelles longues durent 2 temps. Alif (ā), Waw (ū), Ya (ī).",
    level: "Intermédiaire",
    lessons: [
      {
        id: "madd_alif", name: "Madd Alif — aaaa (2 temps)", signName: "Fatha + Alif", sign: "ا", color: C.teal,
        base: "م",
        tip: "Fatha suivie d'un Alif sans voyelle = son ā long (2 temps). Tenez le A deux fois plus longtemps.",
        rule: "Fatha + Alif = son ā (2 counts)",
        examples: [
          { arab: "مَا",    tts: "ما",           roman: "mā",     fr: "quoi ? / ce qui (A long)",          ayah:{ surah:91, ayah:1 } },
          { arab: "كَانَ",  tts: "كان",          roman: "kāna",   fr: "il était",                          ayah:{ surah:2, ayah:184 } },
          { arab: "قَالَ",  tts: "قال",          roman: "qāla",   fr: "il a dit",                          ayah:{ surah:2, ayah:30 } },
          { arab: "بَابٌ",  tts: "باب",          roman: "bābun",  fr: "une porte",                         ayah:{ surah:2, ayah:189 } },
          { arab: "كِتَابٌ",tts: "كتاب",         roman: "kitābun",fr: "un livre",                          ayah:{ surah:2, ayah:2 } },
          { arab: "آمَنَ",  tts: "آمَنَ",        roman: "āmana",  fr: "il a cru / fait confiance",         ayah:{ surah:2, ayah:136 } },
        ],
      },
      {
        id: "madd_waw", name: "Madd Waw — uuuu (2 temps)", signName: "Damma + Waw", sign: "و", color: "#67e8f9",
        base: "م",
        tip: "Damma suivie d'un Waw sans voyelle = son ū long. Arrondissez les lèvres et tenez le U deux temps.",
        rule: "Damma + Waw = son ū (2 counts)",
        examples: [
          { arab: "نُورٌ",   roman: "nūrun",  fr: "une lumière",                     ayah:{ surah:24, ayah:35 } },
          { arab: "يَقُولُ", roman: "yaqūlu", fr: "il dit (présent)",                ayah:{ surah:2, ayah:8 } },
          { arab: "رَسُولٌ", roman: "rasūlun",fr: "un messager / prophète",          ayah:{ surah:2, ayah:87 } },
          { arab: "قُلْ",    roman: "qul",    fr: "dis ! (U long + sukun)",           ayah:{ surah:112, ayah:1 } },
          { arab: "كُونُوا", roman: "kūnū",   fr: "soyez ! (impératif pluriel)",     ayah:{ surah:2, ayah:65 } },
        ],
      },
      {
        id: "madd_ya", name: "Madd Ya — iiii (2 temps)", signName: "Kasra + Ya", sign: "ي", color: "#a5f3fc",
        base: "م",
        tip: "Kasra suivie d'un Ya sans voyelle = son ī long. Étirez les lèvres en souriant et tenez le I deux temps.",
        rule: "Kasra + Ya = son ī (2 counts)",
        examples: [
          { arab: "فِي",    tts: "في الكتاب",    roman: "fī",     fr: "dans / en (préposition)",          ayah:{ surah:1, ayah:7 } },
          { arab: "كَبِيرٌ",tts: "كبير",         roman: "kabīrun",fr: "grand (adjectif)",                 ayah:{ surah:2, ayah:7 } },
          { arab: "يَدِي",  tts: "يدي",          roman: "yadī",   fr: "ma main",                          ayah:{ surah:5, ayah:28 } },
          { arab: "دِينٌ",  tts: "دين",          roman: "dīnun",  fr: "une religion / la foi",            ayah:{ surah:109, ayah:6 } },
          { arab: "رَحِيمٌ",tts: "رحيم",         roman: "raḥīmun",fr: "Miséricordieux",                   ayah:{ surah:1, ayah:3 } },
        ],
      },
    ],
  },
  {
    id: "madd_advanced",
    title: "Madd Avancé — 4 & 6 temps",
    titleAr: "أنواع المد",
    color: C.gold,
    icon: "◌ٰ",
    description: "En Tajwid, les voyelles longues peuvent s'allonger jusqu'à 6 temps.",
    level: "Avancé",
    lessons: [
      {
        id: "madd_muttasil", name: "Madd Muttasil — 4 à 5 temps", signName: "Madd Muttasil", sign: "◌ٓ", color: C.gold,
        base: "ء",
        tip: "Voyelle longue SUIVIE d'un hamza DANS le même mot → allongement obligatoire 4-5 temps.",
        rule: "Madd + Hamza dans le même mot = 4-5 temps",
        examples: [
          { arab: "جَاءَ",            tts: "جاء",              roman: "jā'a",         fr: "il est venu",                          ayah:{ surah:2, ayah:87 } },
          { arab: "شَاءَ",            tts: "شاء",              roman: "shā'a",        fr: "il a voulu (Allah)",                   ayah:{ surah:2, ayah:253 } },
          { arab: "سُوءٍ",            tts: "سوء",              roman: "sū'in",        fr: "d'un mal / d'un péché",               ayah:{ surah:4, ayah:17 } },
          { arab: "الشِّتَاءِ",        tts: "الشتاء",           roman: "ash-shitā'i", fr: "de l'hiver",                           ayah:{ surah:106, ayah:2 } },
        ],
      },
      {
        id: "madd_munfasil", name: "Madd Munfasil — 2 à 4 temps", signName: "Madd Munfasil", sign: "◌ٓ", color: C.goldLt,
        base: "ا",
        tip: "Voyelle longue EN FIN DE MOT suivie d'un hamza au MOT SUIVANT → allongement 2 à 4 temps.",
        rule: "Madd en fin de mot + Hamza début mot suivant = 2-4 temps",
        examples: [
          { arab: "إِنَّا أَعْطَيْنَاكَ", tts: "إنا أعطيناك",       roman: "innā aʿṭaynāka", fr: "Nous t'avons accordé (Al-Kawthar)", ayah:{ surah:108, ayah:1 } },
          { arab: "وَمَا أَدْرَاكَ",      tts: "وما أدراك",          roman: "wa mā adrāka",   fr: "Et qu'est-ce qui te fera savoir ?", ayah:{ surah:82, ayah:17 } },
          { arab: "قُلْ أَعُوذُ",        tts: "قل أعوذ",            roman: "qul aʿūdhu",     fr: "Dis : Je cherche refuge",           ayah:{ surah:113, ayah:1 } },
        ],
      },
      {
        id: "madd_lazim", name: "Madd Lazim — 6 temps", signName: "Madd Lazim", sign: "◌ّٓ", color: "#fef08a",
        base: "ص",
        tip: "Voyelle longue suivie d'une lettre avec SHADDA ou sukun → 6 temps fixes, obligatoires.",
        rule: "Madd + Shadda ou Sukun = 6 temps — jamais moins",
        examples: [
          { arab: "الم",              tts: "ألف لام ميم",      roman: "alif-lam-mim",  fr: "Lettres isolées (Baqarah)",              ayah:{ surah:2, ayah:1 } },
          { arab: "الر",              tts: "ألف لام راء",      roman: "alif-lam-ra",   fr: "Lettres isolées (Yunus)",                 ayah:{ surah:10, ayah:1 } },
          { arab: "الحاقة",           tts: "الحاقة",           roman: "al-ḥāqqah",    fr: "L'Inévitable",                            ayah:{ surah:69, ayah:1 } },
          { arab: "الضَّالِّينَ",      tts: "الضالين",          roman: "aḍ-ḍāllīn",   fr: "les égarés — Fatiha",                    ayah:{ surah:1, ayah:7 } },
        ],
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   FIX 1 — AUDIO
   Uses Web Speech API with the system Arabic voice.
   Reads ONLY the Arabic text passed in (e.g. "مَ", "بَ", "كِتَابٌ").
   No external URL, no Quran verse fetching, no AI voice.
══════════════════════════════════════════════════════════════════ */
let arabicVoice = null;

// Pre-load voices once (browsers populate them async)
function loadArabicVoice() {
  if (arabicVoice) return;
  const voices = window.speechSynthesis.getVoices();
  arabicVoice =
    voices.find(v => v.lang === "ar-SA") ||
    voices.find(v => v.lang === "ar-EG") ||
    voices.find(v => v.lang.startsWith("ar")) ||
    null;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = loadArabicVoice;
  loadArabicVoice();
}

function playArabic(text) {
  if (!("speechSynthesis" in window)) return;
  loadArabicVoice();
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ar-SA";
  utt.rate = 0.65;   // slow & clear — good for learning
  utt.pitch = 1.0;
  utt.volume = 1.0;
  if (arabicVoice) utt.voice = arabicVoice;
  window.speechSynthesis.speak(utt);
}

/* ══════════════════════════════════════════════════════════════════
   EXAMPLE CARD
══════════════════════════════════════════════════════════════════ */
function ExampleCard({ ex, color, index }) {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed]   = useState(false);
  const [hov, setHov]         = useState(false);

  const handlePlay = () => {
    if (playing) return;
    setPlaying(true);
    playArabic(ex.tts || ex.arab);
    // Web Speech API fires onend but timing varies — safe timeout
    setTimeout(() => setPlaying(false), 2500);
    setPlayed(true);
  };

  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:16,background:hov?`${color}0d`:C.card,border:`1px solid ${hov?color+"44":C.border}`,padding:"18px 16px",transition:"all 0.25s",cursor:"default",animation:`cardIn 0.4s ease ${index*0.06}s both` }}>
      <div style={{ textAlign:"center",marginBottom:12 }}>
        <div style={{ fontFamily:"'Amiri','serif'",fontSize:56,color,lineHeight:1.2,direction:"rtl",letterSpacing:"0.05em" }}>
          {ex.arab}
        </div>
      </div>
      <div style={{ textAlign:"center",fontSize:18,fontWeight:800,color:C.text,marginBottom:4,letterSpacing:"0.06em" }}>
        {ex.roman}
      </div>
      <div style={{ textAlign:"center",fontSize:12,color:C.muted,marginBottom:14,lineHeight:1.5 }}>
        {ex.fr}
      </div>
      <button onClick={handlePlay} disabled={playing} style={{ width:"100%",padding:"9px",borderRadius:11,background:played?`${color}22`:`${color}12`,border:`1px solid ${played?color+"66":color+"30"}`,color:played?color:C.muted,cursor:playing?"wait":"pointer",fontWeight:700,fontSize:12,transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
        {playing ? "🔊 Lecture…" : played ? "🔊 Rejouer" : "▶ Écouter"}
      </button>
      {ex.ayah && (
        <div style={{ textAlign:"center",fontSize:9,color:C.dim,marginTop:5,fontWeight:600,letterSpacing:"0.04em" }}>
          Sourate {ex.ayah.surah} · Verset {ex.ayah.ayah}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LESSON VIEW
══════════════════════════════════════════════════════════════════ */
function LessonView({ lesson, chapter, isDone, onMarkDone }) {
  const [tab, setTab] = useState("learn");

  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ background:`linear-gradient(135deg,${lesson.color}12,transparent)`,border:`1px solid ${lesson.color}30`,borderRadius:20,padding:"24px 26px",marginBottom:22 }}>
        <div style={{ display:"flex",alignItems:"center",gap:18,marginBottom:16 }}>
          <div style={{ width:72,height:72,borderRadius:18,background:`${lesson.color}18`,border:`2px solid ${lesson.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <span style={{ fontFamily:"serif",fontSize:40,color:lesson.color,lineHeight:1 }}>{lesson.sign}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,letterSpacing:"0.12em",color:lesson.color,textTransform:"uppercase",marginBottom:4 }}>{lesson.signName}</div>
            <h2 style={{ fontSize:20,fontWeight:900,color:C.text,lineHeight:1.2,marginBottom:8 }}>{lesson.name}</h2>
            <div style={{ display:"inline-flex",alignItems:"center",padding:"4px 12px",borderRadius:99,background:`${lesson.color}15`,border:`1px solid ${lesson.color}30`,fontSize:11,fontWeight:700,color:lesson.color }}>
              {lesson.rule}
            </div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)",borderLeft:`3px solid ${lesson.color}`,borderRadius:"0 12px 12px 0",padding:"12px 16px" }}>
          <div style={{ fontSize:11,fontWeight:800,color:lesson.color,marginBottom:5,letterSpacing:"0.08em" }}>💡 CONSEIL DU PROFESSEUR</div>
          <div style={{ fontSize:13,color:C.text,lineHeight:1.65 }}>{lesson.tip}</div>
        </div>
      </div>

      <div style={{ display:"flex",gap:4,background:C.panel,borderRadius:12,padding:4,width:"fit-content",marginBottom:24 }}>
        {[["learn","📖 Apprendre"],["drill","🎯 Exercices"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{ padding:"8px 18px",borderRadius:9,border:"none",background:tab===k?lesson.color:"transparent",color:tab===k?"#000":C.muted,cursor:"pointer",fontWeight:800,fontSize:13 }}>{l}</button>
        ))}
      </div>

      {tab === "learn" && (
        <div>
          <div style={{ fontSize:11,fontWeight:800,letterSpacing:"0.1em",color:C.muted,textTransform:"uppercase",marginBottom:16 }}>
            {lesson.examples.length} exemples — cliquez ▶ pour écouter
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14,marginBottom:28 }}>
            {lesson.examples.map((ex,i)=>(
              <ExampleCard key={i} ex={ex} color={lesson.color} index={i}/>
            ))}
          </div>
        </div>
      )}

      {tab === "drill" && <DrillTab lesson={lesson}/>}

      <div style={{ marginTop:32,paddingTop:24,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:14 }}>
        <button onClick={onMarkDone} disabled={isDone} style={{ display:"flex",alignItems:"center",gap:9,padding:"12px 26px",borderRadius:14,background:isDone?`${lesson.color}15`:lesson.color,color:isDone?lesson.color:(lesson.color==="#fcd34d"?"#000":"#fff"),border:`2px solid ${lesson.color}`,fontWeight:900,fontSize:14,cursor:isDone?"not-allowed":"pointer",transition:"all 0.2s",opacity:isDone?0.85:1 }}>
          {isDone ? "✓ Leçon complétée" : "✓ Marquer comme apprise"}
        </button>
        {!isDone && <span style={{ fontSize:12,color:C.muted,fontStyle:"italic" }}>Complétez les exemples puis marquez la leçon</span>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DRILL TAB
══════════════════════════════════════════════════════════════════ */
function DrillTab({ lesson }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [done, setDone] = useState(false);

  const quiz = lesson.examples.map(ex => {
    const others = lesson.examples.filter(e=>e.roman!==ex.roman).map(e=>e.roman);
    const FAKES = ["ga","gu","gi","za","zu","zi","ha","hu","hi","fa","fi","fu","ra","ri","ru"];
    while(others.length < 3) others.push(FAKES[Math.floor(Math.random()*FAKES.length)]);
    const wrong = others.sort(()=>Math.random()-0.5).slice(0,3);
    const options = [ex.roman, ...wrong].sort(()=>Math.random()-0.5);
    return { ...ex, options };
  });

  const current = quiz[idx];

  const answer = (opt) => {
    if (answered!==null) return;
    setAnswered(opt);
    if (opt===current.roman) setScore(s=>s+1);
    setTimeout(()=>{
      if (idx+1 >= quiz.length) setDone(true);
      else { setIdx(i=>i+1); setAnswered(null); }
    }, 1200);
  };

  if (done) return (
    <div style={{ textAlign:"center",padding:"48px 24px",background:C.card,borderRadius:20,border:`1px solid ${C.border}` }}>
      <div style={{ fontSize:52,marginBottom:12 }}>{score>=quiz.length*.7?"🎉":"📚"}</div>
      <h3 style={{ fontSize:22,fontWeight:900,color:C.text,marginBottom:8 }}>{score}/{quiz.length} bonnes réponses</h3>
      <p style={{ color:C.muted,fontSize:14,marginBottom:24 }}>{score===quiz.length?"Parfait ! Leçon maîtrisée.":score>=quiz.length*.7?"Bien ! Revoyez les erreurs.":"Continuez à pratiquer !"}</p>
      <button onClick={()=>{setIdx(0);setScore(0);setAnswered(null);setDone(false);}} style={{ padding:"11px 28px",borderRadius:13,background:lesson.color,color:"#000",border:"none",fontWeight:800,fontSize:14,cursor:"pointer" }}>
        🔄 Recommencer
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth:480,margin:"0 auto" }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}>
        <span style={{ fontSize:12,color:C.muted,fontWeight:600 }}>Question {idx+1}/{quiz.length}</span>
        <span style={{ fontSize:12,color:lesson.color,fontWeight:700 }}>✓ {score} correct{score>1?"s":""}</span>
      </div>
      <div style={{ height:4,borderRadius:99,background:"rgba(255,255,255,0.06)",marginBottom:28 }}>
        <div style={{ width:`${((idx)/quiz.length)*100}%`,height:"100%",borderRadius:99,background:lesson.color,transition:"width 0.4s" }}/>
      </div>
      <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"36px 28px",textAlign:"center",marginBottom:20 }}>
        <div style={{ fontSize:11,fontWeight:700,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14 }}>Quelle est la translittération ?</div>
        <div style={{ fontFamily:"serif",fontSize:72,color:lesson.color,direction:"rtl",lineHeight:1.2,marginBottom:8 }}>{current.arab}</div>
        <button onClick={()=>playArabic(current.tts || current.arab)} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:0 }}>🔊 Écouter</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        {current.options.map((opt,i)=>{
          const isCorrect = opt===current.roman;
          const isWrong = answered===opt && !isCorrect;
          const bg = answered===null?"rgba(255,255,255,0.04)":isCorrect?`${lesson.color}22`:isWrong?"rgba(251,113,133,0.15)":"rgba(255,255,255,0.04)";
          const border = answered===null?C.border:isCorrect?lesson.color:isWrong?"#fb7185":C.border;
          const color  = answered===null?C.text:isCorrect?lesson.color:isWrong?"#fb7185":C.dim;
          return (
            <button key={i} onClick={()=>answer(opt)} style={{ padding:"14px",borderRadius:14,background:bg,border:`1.5px solid ${border}`,color,fontWeight:800,fontSize:16,cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.05em" }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FIX 2 & 3 — CHAPTER CARD + LESSON LIST
   - Fixed prop name: now accepts onSelect (matches parent call)
   - Shows an expandable lesson list when the chapter is active
══════════════════════════════════════════════════════════════════ */
function ChapterCard({ chapter, doneLessons, activeLesson, onSelect, onSelectLesson, isActive }) {
  const total = chapter.lessons.length;
  const done  = chapter.lessons.filter(l=>doneLessons.has(l.id)).length;
  const pct   = total>0?Math.round((done/total)*100):0;
  const [hov, setHov] = useState(false);

  return (
    <div style={{ marginBottom: isActive ? 4 : 8 }}>
      {/* Chapter header button */}
      <button
        onClick={() => onSelect(chapter)}
        onMouseEnter={()=>setHov(true)}
        onMouseLeave={()=>setHov(false)}
        style={{ width:"100%",textAlign:"left",padding:"14px 16px",borderRadius:isActive?"14px 14px 0 0":14,background:isActive?`${chapter.color}15`:hov?"rgba(255,255,255,0.03)":"transparent",border:`1.5px solid ${isActive?chapter.color+"55":hov?chapter.color+"28":C.border}`,borderBottom:isActive?`1.5px solid ${chapter.color}22`:`1.5px solid ${isActive?chapter.color+"55":hov?chapter.color+"28":C.border}`,cursor:"pointer",transition:"all 0.22s" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:7 }}>
          <div style={{ width:34,height:34,borderRadius:10,background:`${chapter.color}18`,border:`1.5px solid ${chapter.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"serif",fontSize:18,color:chapter.color,flexShrink:0 }}>
            {chapter.icon}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:12,fontWeight:800,color:isActive?chapter.color:C.text,lineHeight:1.2 }}>{chapter.title}</div>
            <div style={{ fontSize:9,color:chapter.color,fontFamily:"serif",direction:"rtl",opacity:0.75 }}>{chapter.titleAr}</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0 }}>
            <div style={{ fontSize:9,padding:"2px 7px",borderRadius:99,background:`${chapter.color}15`,border:`1px solid ${chapter.color}30`,color:chapter.color,fontWeight:700 }}>
              {chapter.level}
            </div>
            <div style={{ fontSize:9,color:isActive?chapter.color:C.dim,fontWeight:700 }}>
              {isActive ? "▲" : "▼"}
            </div>
          </div>
        </div>
        <div style={{ height:3,borderRadius:99,background:"rgba(255,255,255,0.06)" }}>
          <div style={{ width:`${pct}%`,height:"100%",borderRadius:99,background:chapter.color,transition:"width 0.5s ease" }}/>
        </div>
        <div style={{ fontSize:9,color:C.dim,marginTop:4,fontWeight:600 }}>
          {done}/{total} leçon{total>1?"s":""} · {pct}%
        </div>
      </button>

      {/* Lesson list — only visible when chapter is active */}
      {isActive && (
        <div style={{ background:`${chapter.color}08`,border:`1.5px solid ${chapter.color}33`,borderTop:"none",borderRadius:"0 0 14px 14px",overflow:"hidden" }}>
          {chapter.lessons.map((ls, i) => {
            const lessonDone   = doneLessons.has(ls.id);
            const lessonActive = activeLesson && activeLesson.id === ls.id;
            return (
              <button
                key={ls.id}
                onClick={() => onSelectLesson(ls)}
                style={{ width:"100%",textAlign:"left",padding:"10px 14px",border:"none",borderTop:i>0?`1px solid ${chapter.color}18`:"none",background:lessonActive?`${ls.color}18`:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background 0.18s" }}
              >
                {/* Done / active indicator */}
                <div style={{ width:20,height:20,borderRadius:6,background:lessonDone?`${ls.color}25`:"rgba(255,255,255,0.04)",border:`1.5px solid ${lessonDone?ls.color+"70":lessonActive?ls.color+"55":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,color:lessonDone?ls.color:lessonActive?ls.color:C.dim,fontWeight:700 }}>
                  {lessonDone ? "✓" : lessonActive ? "▶" : "○"}
                </div>
                {/* Sign preview */}
                <div style={{ fontFamily:"serif",fontSize:16,color:lessonActive?ls.color:C.muted,width:20,textAlign:"center",flexShrink:0 }}>
                  {ls.sign}
                </div>
                {/* Name */}
                <span style={{ fontSize:11,fontWeight:lessonActive?700:500,color:lessonActive?ls.color:C.muted,lineHeight:1.3,flex:1 }}>
                  {ls.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   FIX: passes onSelect={handleSelectChapter} to match ChapterCard
══════════════════════════════════════════════════════════════════ */
export default function TashkeelCourse() {
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0]);
  const [activeLesson,  setActiveLesson]  = useState(CHAPTERS[0].lessons[0]);
  const [doneLessons,   setDoneLessons]   = useState(new Set());

  useEffect(()=>{
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    axios.get(`${API}/api/user/${email}`)
      .then(r=>{
        const done = new Set();
        (r.data.completedLessons||[]).forEach(key=>{
          const m = key.match(/^Tashkeel — (.+)$/);
          if (m) done.add(m[1]);
        });
        setDoneLessons(done);
      }).catch(()=>{});
  },[]);

  const totalLessons = CHAPTERS.reduce((s,c)=>s+c.lessons.length,0);
  const totalDone    = doneLessons.size;
  const overallPct   = totalLessons>0?Math.min(Math.round((totalDone/totalLessons)*100),100):0;

  const handleMarkDone = async () => {
    if (doneLessons.has(activeLesson.id)) return;
    setDoneLessons(prev=>new Set([...prev,activeLesson.id]));
    await saveProgress(activeLesson.id);
  };

  // FIX: when selecting a chapter, open it and show its first lesson
  const handleSelectChapter = (ch) => {
    setActiveChapter(ch);
    setActiveLesson(ch.lessons[0]);
  };

  return (
    <div style={{ minHeight:"100vh",background:C.bg,color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=DM+Sans:wght@300;400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:${C.bg}} ::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.2);border-radius:99px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(16px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* HERO HEADER */}
      <div style={{ background:`radial-gradient(ellipse 140% 80% at 50% -10%,${C.accentD}18 0%,transparent 65%)`,borderBottom:`1px solid ${C.border}`,padding:"110px 28px 32px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:24,flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:10,fontWeight:800,letterSpacing:"0.18em",color:C.accent,textTransform:"uppercase",marginBottom:8 }}>
                التَّشْكِيل — TASHKEEL
              </div>
              <h1 style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(22px,5vw,36px)",fontWeight:900,color:C.text,marginBottom:10,lineHeight:1.1 }}>
                L'Art du Tashkeel Arabe
              </h1>
              <p style={{ color:C.muted,fontSize:14,maxWidth:520,lineHeight:1.65 }}>
                Maîtrisez les signes de vocalisation — de la fatha de base (مَ = ma) aux allongements coraniques avancés (6 temps). Chaque leçon inclut exemples audio et exercices interactifs.
              </p>
            </div>
            <div style={{ background:C.panel,border:`1px solid ${C.border}`,borderRadius:18,padding:"16px 22px",minWidth:190,flexShrink:0 }}>
              <div style={{ fontSize:10,fontWeight:800,letterSpacing:"0.1em",color:C.muted,textTransform:"uppercase",marginBottom:10 }}>Progression globale</div>
              <div style={{ position:"relative",width:80,height:80,margin:"0 auto 10px" }}>
                <svg width="80" height="80" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke={C.accent} strokeWidth="6"
                    strokeDasharray={`${(overallPct/100)*213.6} 213.6`} strokeLinecap="round"
                    style={{ transition:"stroke-dasharray 0.7s ease" }}/>
                </svg>
                <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:C.accent }}>{overallPct}%</div>
              </div>
              <div style={{ textAlign:"center",fontSize:12,color:C.muted,fontWeight:600 }}>{totalDone}/{totalLessons} leçons</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"28px 20px",display:"grid",gridTemplateColumns:"270px 1fr",gap:24,alignItems:"start" }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ position:"sticky",top:20 }}>
          <div style={{ fontSize:10,fontWeight:800,letterSpacing:"0.14em",color:C.dim,textTransform:"uppercase",marginBottom:12 }}>
            {CHAPTERS.length} Chapitres
          </div>
          {CHAPTERS.map(ch=>(
            <ChapterCard
              key={ch.id}
              chapter={ch}
              doneLessons={doneLessons}
              activeLesson={activeLesson}
              onSelect={handleSelectChapter}
              onSelectLesson={setActiveLesson}
              isActive={activeChapter.id===ch.id}
            />
          ))}
        </aside>

        {/* RIGHT: LESSON CONTENT */}
        <main key={activeLesson.id} style={{ animation:"fadeIn 0.35s ease" }}>
          <LessonView
            lesson={activeLesson}
            chapter={activeChapter}
            isDone={doneLessons.has(activeLesson.id)}
            onMarkDone={handleMarkDone}
          />
        </main>
      </div>
    </div>
  );
}