import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { api, getUser } from "../../utils/auth";
import {
  BookOpen, Play, Pause, Eye, EyeOff, CheckCircle, XCircle,
  RotateCcw, Mic, MicOff, Volume2, ChevronRight, ChevronDown,
  Search, MessageCircle, Brain, BookMarked, X, AlertCircle,
  Calendar, Clock, Zap, Target, ChevronLeft, CheckSquare, Square,
  SkipBack, SkipForward, Rewind, FastForward, Star
} from "lucide-react";

/* ── PALETTE ─────────────────────────────────────────────────── */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COURSE_TITLE = "Mémorisation : Les 10 dernières Sourates";

async function saveProgress(lessonKey) {
  try {
    await api.post("/api/update-progress", { lessonTitle: lessonKey });
  } catch (err) {
    console.error("Erreur de progression :", err);
  }
}

const D1 = "#080c10";
const D2 = "#0d1520";
const D3 = "#111e2e";
const D4 = "#162338";
const D5 = "#1c2d45";
const TEAL = "#0fa37f";
const TEAL2 = "#0d8c6c";
const TEAL3 = "#0b7559";
const TEAL_L = "#1fffc8";
const TEAL_DIM = "rgba(15,163,127,0.15)";
const GOLD = "#e8a830";
const GOLD2 = "#c98d1a";
const GOLD_L = "rgba(232,168,48,0.15)";
const CREAM = "#f0ead8";
const BORDER = "rgba(15,163,127,0.18)";
const BORDER2 = "rgba(15,163,127,0.08)";
const TEXT1 = "#e8e4d8";
const TEXT2 = "#9ba8b8";
const TEXT3 = "#6b7a8d";
const RED = "#ef4444";
const RED_DIM = "rgba(239,68,68,0.12)";
const BLUE = "#3b82f6";
const BLUE_DIM = "rgba(59,130,246,0.12)";
const PURPLE = "#a855f7";
const PURPLE_DIM = "rgba(168,85,247,0.12)";

/* ── API BASE ────────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── RECITERS ────────────────────────────────────────────────── */
const reciters = [
  { id: "mishari",    name: "Mishari Al-Afasy",  short: "Afasy",   server: "https://server8.mp3quran.net/afs" },
  { id: "abdulbasit", name: "Abdul Basit",        short: "A.Basit", server: "https://server7.mp3quran.net/basit" },
  { id: "minshawi",   name: "Al-Minshawi",        short: "Minsh.",  server: "https://server13.mp3quran.net/minsh" },
  { id: "husary",     name: "Al-Husary",          short: "Husary",  server: "https://server13.mp3quran.net/husr" },
  { id: "ghamdi",     name: "Saad Al-Ghamidi",    short: "Ghamdi",  server: "https://server7.mp3quran.net/s_gmd" },
];

/* ── BASMALA ─────────────────────────────────────────────────── */
const BASMALA_AR = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const BASMALA_STRIPPED = "بسم الله الرحمن الرحيم";
const NO_SEPARATE_BASMALA = new Set([1, 9]);

/* ── ALL 114 SURAHS ──────────────────────────────────────────── */
const ALL_SURAHS = [
  {n:1,ar:"الفاتحة",en:"Al-Fatiha",meaning:"The Opening",verses:7,type:"Meccan",fr:"al-faa-ti-HA"},
  {n:2,ar:"البقرة",en:"Al-Baqarah",meaning:"The Cow",verses:286,type:"Medinan",fr:"al-ba-QA-ra"},
  {n:3,ar:"آل عمران",en:"Al-Imran",meaning:"Family of Imran",verses:200,type:"Medinan",fr:"a-li 'im-RAAN"},
  {n:4,ar:"النساء",en:"An-Nisa",meaning:"The Women",verses:176,type:"Medinan",fr:"an-ni-SAA"},
  {n:5,ar:"المائدة",en:"Al-Ma'idah",meaning:"The Table Spread",verses:120,type:"Medinan",fr:"al-maa-'i-DA"},
  {n:6,ar:"الأنعام",en:"Al-An'am",meaning:"The Cattle",verses:165,type:"Meccan",fr:"al-an-'AAM"},
  {n:7,ar:"الأعراف",en:"Al-A'raf",meaning:"The Heights",verses:206,type:"Meccan",fr:"al-a'-RAAF"},
  {n:8,ar:"الأنفال",en:"Al-Anfal",meaning:"The Spoils of War",verses:75,type:"Medinan",fr:"al-an-FAAL"},
  {n:9,ar:"التوبة",en:"At-Tawbah",meaning:"The Repentance",verses:129,type:"Medinan",fr:"at-taw-BA"},
  {n:10,ar:"يونس",en:"Yunus",meaning:"Jonah",verses:109,type:"Meccan",fr:"YOU-nous"},
  {n:11,ar:"هود",en:"Hud",meaning:"Hud",verses:123,type:"Meccan",fr:"HOUD"},
  {n:12,ar:"يوسف",en:"Yusuf",meaning:"Joseph",verses:111,type:"Meccan",fr:"YOU-souf"},
  {n:13,ar:"الرعد",en:"Ar-Ra'd",meaning:"The Thunder",verses:43,type:"Medinan",fr:"ar-RA'd"},
  {n:14,ar:"إبراهيم",en:"Ibrahim",meaning:"Abraham",verses:52,type:"Meccan",fr:"ib-raa-HEEM"},
  {n:15,ar:"الحجر",en:"Al-Hijr",meaning:"The Rocky Tract",verses:99,type:"Meccan",fr:"al-HIJR"},
  {n:16,ar:"النحل",en:"An-Nahl",meaning:"The Bee",verses:128,type:"Meccan",fr:"an-NAHL"},
  {n:17,ar:"الإسراء",en:"Al-Isra",meaning:"The Night Journey",verses:111,type:"Meccan",fr:"al-is-RAA"},
  {n:18,ar:"الكهف",en:"Al-Kahf",meaning:"The Cave",verses:110,type:"Meccan",fr:"al-KAHF"},
  {n:19,ar:"مريم",en:"Maryam",meaning:"Mary",verses:98,type:"Meccan",fr:"MAR-yam"},
  {n:20,ar:"طه",en:"Ta-Ha",meaning:"Ta-Ha",verses:135,type:"Meccan",fr:"TAA-HAA"},
  {n:21,ar:"الأنبياء",en:"Al-Anbiya",meaning:"The Prophets",verses:112,type:"Meccan",fr:"al-an-bi-YAA"},
  {n:22,ar:"الحج",en:"Al-Hajj",meaning:"The Pilgrimage",verses:78,type:"Medinan",fr:"al-HAJJ"},
  {n:23,ar:"المؤمنون",en:"Al-Mu'minun",meaning:"The Believers",verses:118,type:"Meccan",fr:"al-mou'-mi-NOUN"},
  {n:24,ar:"النور",en:"An-Nur",meaning:"The Light",verses:64,type:"Medinan",fr:"an-NOUR"},
  {n:25,ar:"الفرقان",en:"Al-Furqan",meaning:"The Criterion",verses:77,type:"Meccan",fr:"al-four-QAAN"},
  {n:26,ar:"الشعراء",en:"Ash-Shu'ara",meaning:"The Poets",verses:227,type:"Meccan",fr:"ach-chou-'a-RAA"},
  {n:27,ar:"النمل",en:"An-Naml",meaning:"The Ant",verses:93,type:"Meccan",fr:"an-NAML"},
  {n:28,ar:"القصص",en:"Al-Qasas",meaning:"The Stories",verses:88,type:"Meccan",fr:"al-qa-SASS"},
  {n:29,ar:"العنكبوت",en:"Al-Ankabut",meaning:"The Spider",verses:69,type:"Meccan",fr:"al-'an-ka-BOUT"},
  {n:30,ar:"الروم",en:"Ar-Rum",meaning:"The Romans",verses:60,type:"Meccan",fr:"ar-ROUM"},
  {n:31,ar:"لقمان",en:"Luqman",meaning:"Luqman",verses:34,type:"Meccan",fr:"louk-MAAN"},
  {n:32,ar:"السجدة",en:"As-Sajdah",meaning:"The Prostration",verses:30,type:"Meccan",fr:"as-saj-DA"},
  {n:33,ar:"الأحزاب",en:"Al-Ahzab",meaning:"The Confederates",verses:73,type:"Medinan",fr:"al-ah-ZAAB"},
  {n:34,ar:"سبأ",en:"Saba",meaning:"Sheba",verses:54,type:"Meccan",fr:"sa-BA"},
  {n:35,ar:"فاطر",en:"Fatir",meaning:"Originator",verses:45,type:"Meccan",fr:"FAA-tir"},
  {n:36,ar:"يس",en:"Ya-Sin",meaning:"Ya-Sin",verses:83,type:"Meccan",fr:"YAA-SEEN"},
  {n:37,ar:"الصافات",en:"As-Saffat",meaning:"Those Who Set The Ranks",verses:182,type:"Meccan",fr:"as-saa-FAAT"},
  {n:38,ar:"ص",en:"Sad",meaning:"The Letter Sad",verses:88,type:"Meccan",fr:"SAAD"},
  {n:39,ar:"الزمر",en:"Az-Zumar",meaning:"The Troops",verses:75,type:"Meccan",fr:"az-ZOU-mar"},
  {n:40,ar:"غافر",en:"Ghafir",meaning:"The Forgiver",verses:85,type:"Meccan",fr:"GHAA-fir"},
  {n:41,ar:"فصلت",en:"Fussilat",meaning:"Explained In Detail",verses:54,type:"Meccan",fr:"fouss-si-LAT"},
  {n:42,ar:"الشورى",en:"Ash-Shura",meaning:"The Consultation",verses:53,type:"Meccan",fr:"ach-CHOU-raa"},
  {n:43,ar:"الزخرف",en:"Az-Zukhruf",meaning:"The Ornaments of Gold",verses:89,type:"Meccan",fr:"az-ZOUKHROUF"},
  {n:44,ar:"الدخان",en:"Ad-Dukhan",meaning:"The Smoke",verses:59,type:"Meccan",fr:"ad-dou-KHAAN"},
  {n:45,ar:"الجاثية",en:"Al-Jathiyah",meaning:"The Crouching",verses:37,type:"Meccan",fr:"al-jaa-thi-YA"},
  {n:46,ar:"الأحقاف",en:"Al-Ahqaf",meaning:"The Wind-Curved Sandhills",verses:35,type:"Meccan",fr:"al-ah-QAAF"},
  {n:47,ar:"محمد",en:"Muhammad",meaning:"Muhammad",verses:38,type:"Medinan",fr:"mo-HAM-mad"},
  {n:48,ar:"الفتح",en:"Al-Fath",meaning:"The Victory",verses:29,type:"Medinan",fr:"al-FATH"},
  {n:49,ar:"الحجرات",en:"Al-Hujurat",meaning:"The Rooms",verses:18,type:"Medinan",fr:"al-hou-jou-RAAT"},
  {n:50,ar:"ق",en:"Qaf",meaning:"The Letter Qaf",verses:45,type:"Meccan",fr:"QAAF"},
  {n:51,ar:"الذاريات",en:"Adh-Dhariyat",meaning:"The Winnowing Winds",verses:60,type:"Meccan",fr:"adh-dhaa-ri-YAAT"},
  {n:52,ar:"الطور",en:"At-Tur",meaning:"The Mount",verses:49,type:"Meccan",fr:"at-TOUR"},
  {n:53,ar:"النجم",en:"An-Najm",meaning:"The Star",verses:62,type:"Meccan",fr:"an-NAJM"},
  {n:54,ar:"القمر",en:"Al-Qamar",meaning:"The Moon",verses:55,type:"Meccan",fr:"al-QA-mar"},
  {n:55,ar:"الرحمن",en:"Ar-Rahman",meaning:"The Beneficent",verses:78,type:"Medinan",fr:"ar-rah-MAAN"},
  {n:56,ar:"الواقعة",en:"Al-Waqi'ah",meaning:"The Inevitable",verses:96,type:"Meccan",fr:"al-waa-qi-'A"},
  {n:57,ar:"الحديد",en:"Al-Hadid",meaning:"The Iron",verses:29,type:"Medinan",fr:"al-ha-DEED"},
  {n:58,ar:"المجادلة",en:"Al-Mujadila",meaning:"The Pleading Woman",verses:22,type:"Medinan",fr:"al-mou-jaa-di-LA"},
  {n:59,ar:"الحشر",en:"Al-Hashr",meaning:"The Exile",verses:24,type:"Medinan",fr:"al-HACHR"},
  {n:60,ar:"الممتحنة",en:"Al-Mumtahanah",meaning:"She That Is To Be Examined",verses:13,type:"Medinan",fr:"al-moum-ta-HA-na"},
  {n:61,ar:"الصف",en:"As-Saf",meaning:"The Ranks",verses:14,type:"Medinan",fr:"as-SAFF"},
  {n:62,ar:"الجمعة",en:"Al-Jumu'ah",meaning:"The Congregation",verses:11,type:"Medinan",fr:"al-jou-MOU-'a"},
  {n:63,ar:"المنافقون",en:"Al-Munafiqun",meaning:"The Hypocrites",verses:11,type:"Medinan",fr:"al-mou-naa-fi-QOUN"},
  {n:64,ar:"التغابن",en:"At-Taghabun",meaning:"The Mutual Disillusion",verses:18,type:"Medinan",fr:"at-ta-GHAA-boun"},
  {n:65,ar:"الطلاق",en:"At-Talaq",meaning:"The Divorce",verses:12,type:"Medinan",fr:"at-ta-LAAQ"},
  {n:66,ar:"التحريم",en:"At-Tahrim",meaning:"The Prohibition",verses:12,type:"Medinan",fr:"at-tah-REEM"},
  {n:67,ar:"الملك",en:"Al-Mulk",meaning:"The Sovereignty",verses:30,type:"Meccan",fr:"al-MOULK"},
  {n:68,ar:"القلم",en:"Al-Qalam",meaning:"The Pen",verses:52,type:"Meccan",fr:"al-QA-lam"},
  {n:69,ar:"الحاقة",en:"Al-Haqqah",meaning:"The Reality",verses:52,type:"Meccan",fr:"al-haaq-QA"},
  {n:70,ar:"المعارج",en:"Al-Ma'arij",meaning:"The Ascending Stairways",verses:44,type:"Meccan",fr:"al-ma-'AA-rij"},
  {n:71,ar:"نوح",en:"Nuh",meaning:"Noah",verses:28,type:"Meccan",fr:"NOUH"},
  {n:72,ar:"الجن",en:"Al-Jinn",meaning:"The Jinn",verses:28,type:"Meccan",fr:"al-JINN"},
  {n:73,ar:"المزمل",en:"Al-Muzzammil",meaning:"The Enshrouded One",verses:20,type:"Meccan",fr:"al-mouz-ZAM-mil"},
  {n:74,ar:"المدثر",en:"Al-Muddaththir",meaning:"The Cloaked One",verses:56,type:"Meccan",fr:"al-mou-DATH-thir"},
  {n:75,ar:"القيامة",en:"Al-Qiyamah",meaning:"The Resurrection",verses:40,type:"Meccan",fr:"al-qi-YAA-ma"},
  {n:76,ar:"الإنسان",en:"Al-Insan",meaning:"The Man",verses:31,type:"Medinan",fr:"al-in-SAAN"},
  {n:77,ar:"المرسلات",en:"Al-Mursalat",meaning:"The Emissaries",verses:50,type:"Meccan",fr:"al-mour-sa-LAAT"},
  {n:78,ar:"النبأ",en:"An-Naba",meaning:"The Tidings",verses:40,type:"Meccan",fr:"an-NA-ba"},
  {n:79,ar:"النازعات",en:"An-Nazi'at",meaning:"Those Who Drag Forth",verses:46,type:"Meccan",fr:"an-naa-zi-'AAT"},
  {n:80,ar:"عبس",en:"Abasa",meaning:"He Frowned",verses:42,type:"Meccan",fr:"'a-BA-sa"},
  {n:81,ar:"التكوير",en:"At-Takwir",meaning:"The Overthrowing",verses:29,type:"Meccan",fr:"at-tak-WEER"},
  {n:82,ar:"الانفطار",en:"Al-Infitar",meaning:"The Cleaving",verses:19,type:"Meccan",fr:"al-in-fi-TAAR"},
  {n:83,ar:"المطففين",en:"Al-Mutaffifin",meaning:"The Defrauding",verses:36,type:"Meccan",fr:"al-mou-taf-fi-FEEN"},
  {n:84,ar:"الانشقاق",en:"Al-Inshiqaq",meaning:"The Sundering",verses:25,type:"Meccan",fr:"al-inch-qi-QAAQ"},
  {n:85,ar:"البروج",en:"Al-Buruj",meaning:"The Mansions of the Stars",verses:22,type:"Meccan",fr:"al-bou-ROUJ"},
  {n:86,ar:"الطارق",en:"At-Tariq",meaning:"The Morning Star",verses:17,type:"Meccan",fr:"at-TAA-riq"},
  {n:87,ar:"الأعلى",en:"Al-A'la",meaning:"The Most High",verses:19,type:"Meccan",fr:"al-a'-LAA"},
  {n:88,ar:"الغاشية",en:"Al-Ghashiyah",meaning:"The Overwhelming",verses:26,type:"Meccan",fr:"al-ghaa-chi-YA"},
  {n:89,ar:"الفجر",en:"Al-Fajr",meaning:"The Dawn",verses:30,type:"Meccan",fr:"al-FAJR"},
  {n:90,ar:"البلد",en:"Al-Balad",meaning:"The City",verses:20,type:"Meccan",fr:"al-BA-lad"},
  {n:91,ar:"الشمس",en:"Ash-Shams",meaning:"The Sun",verses:15,type:"Meccan",fr:"ach-CHAMS"},
  {n:92,ar:"الليل",en:"Al-Layl",meaning:"The Night",verses:21,type:"Meccan",fr:"al-LAYL"},
  {n:93,ar:"الضحى",en:"Ad-Duha",meaning:"The Morning Hours",verses:11,type:"Meccan",fr:"ad-dou-HAA"},
  {n:94,ar:"الشرح",en:"Ash-Sharh",meaning:"The Relief",verses:8,type:"Meccan",fr:"ach-CHARH"},
  {n:95,ar:"التين",en:"At-Tin",meaning:"The Fig",verses:8,type:"Meccan",fr:"at-TEEN"},
  {n:96,ar:"العلق",en:"Al-Alaq",meaning:"The Clot",verses:19,type:"Meccan",fr:"al-'a-LAQ"},
  {n:97,ar:"القدر",en:"Al-Qadr",meaning:"The Power",verses:5,type:"Meccan",fr:"al-QA-dr"},
  {n:98,ar:"البينة",en:"Al-Bayyinah",meaning:"The Clear Proof",verses:8,type:"Medinan",fr:"al-bay-yi-NA"},
  {n:99,ar:"الزلزلة",en:"Az-Zalzalah",meaning:"The Earthquake",verses:8,type:"Medinan",fr:"az-zal-ZA-la"},
  {n:100,ar:"العاديات",en:"Al-Adiyat",meaning:"The Courser",verses:11,type:"Meccan",fr:"al-'aa-di-YAAT"},
  {n:101,ar:"القارعة",en:"Al-Qari'ah",meaning:"The Calamity",verses:11,type:"Meccan",fr:"al-qaa-ri-'A"},
  {n:102,ar:"التكاثر",en:"At-Takathur",meaning:"The Rivalry in World Increase",verses:8,type:"Meccan",fr:"at-ta-KA-thour"},
  {n:103,ar:"العصر",en:"Al-Asr",meaning:"The Declining Day",verses:3,type:"Meccan",fr:"al-'ASR"},
  {n:104,ar:"الهمزة",en:"Al-Humazah",meaning:"The Traducer",verses:9,type:"Meccan",fr:"al-hou-MA-za"},
  {n:105,ar:"الفيل",en:"Al-Fil",meaning:"The Elephant",verses:5,type:"Meccan",fr:"al-FEEL"},
  {n:106,ar:"قريش",en:"Quraysh",meaning:"Quraysh",verses:4,type:"Meccan",fr:"qou-RAYCHE"},
  {n:107,ar:"الماعون",en:"Al-Ma'un",meaning:"The Small Kindnesses",verses:7,type:"Meccan",fr:"al-maa-'OUN"},
  {n:108,ar:"الكوثر",en:"Al-Kawthar",meaning:"A River in Paradise",verses:3,type:"Meccan",fr:"al-KAW-thar"},
  {n:109,ar:"الكافرون",en:"Al-Kafirun",meaning:"The Disbelievers",verses:6,type:"Meccan",fr:"al-kaa-fi-ROUN"},
  {n:110,ar:"النصر",en:"An-Nasr",meaning:"The Divine Support",verses:3,type:"Medinan",fr:"an-NASR"},
  {n:111,ar:"المسد",en:"Al-Masad",meaning:"The Palm Fibre",verses:5,type:"Meccan",fr:"al-MA-sad"},
  {n:112,ar:"الإخلاص",en:"Al-Ikhlas",meaning:"The Sincerity",verses:4,type:"Meccan",fr:"al-ikh-LAAS"},
  {n:113,ar:"الفلق",en:"Al-Falaq",meaning:"The Daybreak",verses:5,type:"Meccan",fr:"al-FA-laq"},
  {n:114,ar:"الناس",en:"An-Nas",meaning:"The Mankind",verses:6,type:"Meccan",fr:"an-NAAS"},
];

/* ── PRONUNCIATION CACHE ─────────────────────────────────────── */
// In-memory cache so we don't re-fetch on every modal open
const pronunciationCache = {};

async function fetchPronunciations(surahNumber) {
  if (pronunciationCache[surahNumber]) return pronunciationCache[surahNumber];
  try {
    const res = await fetch(`${API_BASE}/api/pronunciations/${surahNumber}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // data.verses is string[]
    const verses = Array.isArray(data.verses) ? data.verses : [];
    pronunciationCache[surahNumber] = verses;
    return verses;
  } catch (err) {
    console.warn(`Could not load pronunciations for surah ${surahNumber}:`, err.message);
    pronunciationCache[surahNumber] = [];
    return [];
  }
}

/* ── SIMILARITY HELPERS ──────────────────────────────────────── */
function stripDiacritics(s) {
  return s
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[\u0622\u0623\u0625\u0671\u0627\u0672\u0673\u0675]/g, "\u0627")
    .replace(/\u0629/g, "\u0647")
    .replace(/\u0649/g, "\u064A")
    .trim();
}

function normalizeArabic(s) { return stripDiacritics(s).replace(/\s+/g," ").trim(); }
function isArabicScript(s)  { return /[\u0600-\u06FF]/.test(s); }

function similarity(spoken, target) {
  const a = normalizeArabic(spoken), b = normalizeArabic(target);
  if (!a || !b) return 0;
  const wa = a.split(" ").filter(Boolean), wb = b.split(" ").filter(Boolean);
  if (!wa.length) return 0;
  let exact = 0; const wbCopy = [...wb];
  wa.forEach(w => { const i = wbCopy.indexOf(w); if (i !== -1) { exact++; wbCopy.splice(i,1); }});
  let partial = 0;
  wa.forEach(w => {
    const best = wb.reduce((b2,tw) => {
      const sh = w.length<tw.length?w:tw, lo = w.length>=tw.length?w:tw;
      let m=0; for(let i=0;i<sh.length;i++) if(lo.includes(sh[i])) m++;
      return Math.max(b2,m/lo.length);
    },0);
    partial += best;
  });
  const er = exact/Math.max(wa.length,wb.length);
  const pr = partial/Math.max(wa.length,wb.length);
  return Math.min(1,er*.7+pr*.3);
}

function isBasmala(text) {
  const stripped = normalizeArabic(text);
  const basStripped = normalizeArabic(BASMALA_STRIPPED);
  return stripped === basStripped;
}

/* ── CUSTOM HOOK: pronunciations from API ────────────────────── */
function usePronunciations(surahNumber) {
  const [pronunciations, setPronunciations] = useState([]);
  const [loadingPron, setLoadingPron] = useState(false);

  useEffect(() => {
    if (!surahNumber) { setPronunciations([]); return; }
    setLoadingPron(true);
    fetchPronunciations(surahNumber).then(verses => {
      setPronunciations(verses);
      setLoadingPron(false);
    });
  }, [surahNumber]);

  return { pronunciations, loadingPron };
}

/* ── VERSE CARD with pronunciation toggle ────────────────────── */
function VerseCard({ verseNum, ar, en, pronunciation, showTranslation, showAllPron }) {
  const [prnVisible, setPrnVisible] = useState(false);

  useEffect(() => { setPrnVisible(showAllPron); }, [showAllPron]);

  return (
    <div style={{ background: D3, border: `1px solid ${BORDER2}`, borderRadius: 12, overflow: "hidden", display: "flex" }}>
      <div style={{
        width: 38, background: TEAL_DIM, borderRight: `1px solid ${BORDER2}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, fontFamily: "system-ui" }}>{verseNum}</span>
      </div>
      <div style={{ flex: 1, padding: "14px 18px" }}>
        <p style={{ fontSize: 21, direction: "rtl", fontFamily: "Georgia,serif", color: TEXT1, margin: "0 0 8px", lineHeight: 1.9 }}>{ar}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: showTranslation && en ? 8 : 0 }}>
          {pronunciation && (
            <>
              <button
                onClick={() => setPrnVisible(v => !v)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 20,
                  border: `1px solid rgba(168,85,247,${prnVisible ? "0.4" : "0.2"})`,
                  background: prnVisible ? PURPLE_DIM : "transparent",
                  color: prnVisible ? PURPLE : TEXT3,
                  fontFamily: "system-ui", fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all .2s"
                }}
              >
                {prnVisible ? <Eye size={9}/> : <EyeOff size={9}/>} PRON.
              </button>
              {prnVisible && (
                <span style={{
                  fontSize: 12, color: PURPLE, fontFamily: "system-ui", fontStyle: "italic", fontWeight: 600,
                  background: PURPLE_DIM, border: `1px solid rgba(168,85,247,0.2)`,
                  borderRadius: 20, padding: "2px 10px", animation: "fadeIn .2s ease both"
                }}>{pronunciation}</span>
              )}
            </>
          )}
        </div>
        {showTranslation && en && (
          <div style={{ background: BLUE_DIM, border: "1px solid rgba(59,130,246,0.2)", borderRadius: 7, padding: "7px 12px" }}>
            <span style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: "#93b4ef", letterSpacing: "0.1em", display: "block", marginBottom: 2 }}>ENGLISH</span>
            <span style={{ fontFamily: "Georgia,serif", fontSize: 12, color: "#93b4ef", fontStyle: "italic" }}>{en}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── AUDIO PLAYER HOOK ───────────────────────────────────────── */
function useAudioPlayer(src) {
  const audioRef = useRef(null);
  const [playing,     setPlaying]     = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [loading,     setLoading]     = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    if (src) audio.src = src;
    const onMeta    = () => { setDuration(audio.duration || 0); setLoading(false); };
    const onTime    = () => setCurrentTime(audio.currentTime);
    const onEnded   = () => { setPlaying(false); setCurrentTime(0); };
    const onWaiting = () => setLoading(true);
    const onPlay    = () => { setLoading(false); setPlaying(true); };
    const onPause   = () => setPlaying(false);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate",     onTime);
    audio.addEventListener("ended",          onEnded);
    audio.addEventListener("waiting",        onWaiting);
    audio.addEventListener("play",           onPlay);
    audio.addEventListener("pause",          onPause);
    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [src]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else { setLoading(true); audioRef.current.play().catch(() => setLoading(false)); }
  }, [playing]);
  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause(); audioRef.current.currentTime = 0;
    setPlaying(false); setCurrentTime(0);
  }, []);
  const seek = useCallback((t) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(t, duration || 9999));
    setCurrentTime(audioRef.current.currentTime);
  }, [duration]);
  const skip = useCallback((delta) => {
    if (!audioRef.current) return;
    seek(audioRef.current.currentTime + delta);
  }, [seek]);
  return { playing, currentTime, duration, loading, toggle, stop, seek, skip };
}

/* ── AUDIO PLAYER COMPONENT ──────────────────────────────────── */
function AudioPlayer({ src, label, reciterName }) {
  const { playing, currentTime, duration, loading, toggle, stop, seek, skip } = useAudioPlayer(src);
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) return "0:00";
    return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
  };
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const handleBar = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * (duration || 0));
  };

  return (
    <div style={{ background: D4, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px" }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: playing ? TEAL : TEXT3,
            boxShadow: playing ? `0 0 8px ${TEAL}` : "none", transition: "all .3s"
          }}/>
          <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.14em", fontFamily: "system-ui", textTransform: "uppercase" }}>{label}</span>
          {reciterName && <span style={{ fontSize: 10, color: TEXT3, fontFamily: "system-ui", marginLeft: "auto" }}>{reciterName}</span>}
        </div>
      )}
      <div onClick={handleBar} style={{ position: "relative", height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", cursor: "pointer", marginBottom: 12, overflow: "visible" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 99, background: "rgba(255,255,255,0.04)" }}/>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${TEAL3},${TEAL})`, borderRadius: 99, transition: "width .1s", boxShadow: `0 0 8px ${TEAL}60` }}/>
        <div style={{ position: "absolute", top: "50%", left: `${pct}%`, width: 14, height: 14, borderRadius: "50%", background: TEAL, border: `2px solid ${D1}`, transform: "translate(-50%,-50%)", boxShadow: `0 0 8px ${TEAL}80`, transition: "left .1s", cursor: "pointer" }}/>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={() => skip(-30)} title="-30s" style={ctrlBtn(TEXT3)}><SkipBack size={13}/></button>
        <button onClick={() => skip(-10)} title="-10s" style={ctrlBtn(TEXT2)}><Rewind size={13}/></button>
        <button onClick={() => skip(-5)}  title="-5s"  style={ctrlBtn(TEXT2, true)}><span style={{ fontSize: 9, fontWeight: 700, fontFamily: "system-ui" }}>-5</span></button>
        <button onClick={toggle} style={{
          width: 42, height: 42, borderRadius: "50%",
          background: playing ? TEAL_DIM : TEAL, border: `2px solid ${TEAL}`,
          color: playing ? TEAL : D1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s", flexShrink: 0, boxShadow: playing ? `0 0 16px ${TEAL}50` : `0 2px 12px ${TEAL}40`
        }}>
          {loading
            ? <div style={{ width: 14, height: 14, border: `2px solid ${TEAL}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }}/>
            : playing ? <Pause size={15} fill="currentColor"/> : <Play size={15} fill="currentColor" style={{ marginLeft: 2 }}/>
          }
        </button>
        <button onClick={() => skip(5)}  title="+5s"  style={ctrlBtn(TEXT2, true)}><span style={{ fontSize: 9, fontWeight: 700, fontFamily: "system-ui" }}>+5</span></button>
        <button onClick={() => skip(10)} title="+10s" style={ctrlBtn(TEXT2)}><FastForward size={13}/></button>
        <button onClick={() => skip(30)} title="+30s" style={ctrlBtn(TEXT3)}><SkipForward size={13}/></button>
        <button onClick={stop} title="Stop" style={{ ...ctrlBtn("#ef4444"), marginLeft: "auto", borderColor: "rgba(239,68,68,0.2)" }}>
          <div style={{ width: 9, height: 9, borderRadius: 2, background: "currentColor" }}/>
        </button>
        <span style={{ fontSize: 11, color: TEXT3, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", fontFamily: "monospace", marginLeft: 6 }}>
          {fmt(currentTime)} / {fmt(duration)}
        </span>
      </div>
      {playing && (
        <div style={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", marginTop: 10 }}>
          {[3,5,7,10,13,10,7,5,3,5,7,10,13,10,7,5,3].map((h,i) => (
            <div key={i} style={{ width: 2, height: h, borderRadius: 99, background: TEAL, opacity: 0.4 + (h/13)*0.5, animation: `wave ${0.35+i*0.05}s ease-in-out infinite alternate` }}/>
          ))}
        </div>
      )}
    </div>
  );
}

function ctrlBtn(color, small) {
  return {
    width: small ? 28 : 32, height: small ? 28 : 32, borderRadius: 8,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all .15s", fontFamily: "system-ui"
  };
}

function darkBtn(color, filled = true) {
  return {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px",
    borderRadius: 10, border: `1.5px solid ${color}`,
    background: filled ? TEAL_DIM : "transparent",
    color: color === TEAL ? TEAL : color,
    fontFamily: "system-ui", fontWeight: 700, fontSize: 13, cursor: "pointer"
  };
}

function ProgressBar({ current, total, color }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
      {Array.from({ length: total > 30 ? 1 : total }).map((_, i) => (
        total > 30 ? (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: D3, overflow: "hidden" }}>
            <div style={{ width: `${(current/total)*100}%`, height: "100%", background: color, borderRadius: 99 }}/>
          </div>
        ) : (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i < current ? color : i === current ? `${color}60` : `${color}15`,
            transition: "background .3s"
          }}/>
        )
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   VOICE PRACTICE MODAL
   — Uses API pronunciations for ALL surahs
══════════════════════════════════════════════════════════════ */
function VoicePractice({ surah, reciterId, onClose }) {
  const [lines,    setLines]    = useState(null);
  const [basmala,  setBasmala]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [step,     setStep]     = useState("intro");
  const [lineIdx,  setLineIdx]  = useState(0);
  const [recording,setRecording]= useState(false);
  const [transcript,setTranscript]= useState("");
  const [score,    setScore]    = useState(null);
  const [history,  setHistory]  = useState([]);
  const [showPron, setShowPron] = useState(true);
  const recRef = useRef(null);

  const rec = reciters.find(r => r.id === reciterId) || reciters[0];
  const audioSrc = `${rec.server}/${String(surah.n).padStart(3,"0")}.mp3`;

  // ── Fetch pronunciations from API ──
  const { pronunciations, loadingPron } = usePronunciations(surah?.n);

  // ── Fetch Quran verses ──
  useEffect(() => {
    setLoading(true); setLines(null); setBasmala(null);
    setStep("intro"); setLineIdx(0); setHistory([]); setScore(null); setTranscript("");
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surah.n}`),
      fetch(`https://api.alquran.cloud/v1/surah/${surah.n}/en.asad`)
    ]).then(async ([ar, en]) => {
      const [aj, ej] = await Promise.all([ar.json(), en.json()]);
      if (aj.code === 200) {
        const raw = aj.data.ayahs.map((v, i) => ({
          ar: v.text, pr: `Verse ${v.numberInSurah}`, en: ej.data?.ayahs[i]?.text || ""
        }));
        if (!NO_SEPARATE_BASMALA.has(surah.n) && raw.length > 0 && isBasmala(raw[0].ar)) {
          setBasmala(raw[0]); setLines(raw.slice(1));
        } else {
          setLines(raw);
        }
      }
      setLoading(false);
    }).catch(() => { setLines([]); setLoading(false); });
  }, [surah.n]);

  const currentLine = lines ? lines[lineIdx] : null;

  // For surahs that have a separate basmala stripped (most surahs except 1 & 9),
  // the API verses array index 0 corresponds to verse 1 (after basmala).
  // For surah 1 (Fatiha): verse[0] IS the basmala/verse-1, index matches directly.
  // We always use lineIdx as the pronunciation index since lines[] already has basmala removed.
  const currentPron = pronunciations[lineIdx] || null;

  const startRec = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Utilisez Google Chrome pour la reconnaissance vocale."); return; }
    setTranscript(""); setScore(null); setRecording(true);
    const r = new SR(); r.lang = "ar-SA"; r.continuous = false; r.interimResults = true;
    r.onresult = e => setTranscript(Array.from(e.results).map(r2 => r2[0].transcript).join(" "));
    r.onend = () => { setRecording(false); setStep("result"); };
    r.onerror = () => { setRecording(false); setStep("result"); };
    recRef.current = r; r.start();
  };

  useEffect(() => {
    if (step === "result" && currentLine) {
      const s = transcript.trim().length === 0 ? 0 : isArabicScript(transcript) ? similarity(transcript, currentLine.ar) : 0.3;
      const pct = Math.round(s * 100);
      setScore(pct);
      setHistory(h => [...h, { ar: currentLine.ar, said: transcript, score: pct }]);
    }
  }, [step]);

  const next = () => {
    if (lineIdx < (lines?.length || 0) - 1) {
      setLineIdx(i => i + 1); setStep("practice"); setTranscript(""); setScore(null);
    } else setStep("done");
  };
  const avgScore = history.length ? Math.round(history.reduce((a,h) => a+h.score,0)/history.length) : 0;
  const scoreColor = (s) => s >= 75 ? TEAL : s >= 50 ? GOLD : RED;

  const isReady = !loading && !loadingPron;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,5,12,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      <div style={{ background: D2, border: `1px solid ${BORDER}`, borderRadius: 20, width: "100%", maxWidth: 620, maxHeight: "90vh", overflow: "auto", boxShadow: `0 32px 80px rgba(0,0,0,.6), 0 0 40px ${TEAL}10` }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${D3},${D4})`, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, borderRadius: "20px 20px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: TEAL_DIM, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mic size={16} color={TEAL}/>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: TEXT1, fontFamily: "Georgia,serif" }}>Pratique vocale — {surah.en}</div>
              <div style={{ fontSize: 10, color: TEXT3, fontFamily: "system-ui", letterSpacing: "0.1em" }}>
                {surah.ar} · {surah.fr && <span style={{ color: TEAL }}>({surah.fr})</span>} · {surah.verses} versets
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setShowPron(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 8, border: `1px solid rgba(168,85,247,${showPron ? "0.4" : "0.2"})`, background: showPron ? PURPLE_DIM : "transparent", color: showPron ? PURPLE : TEXT3, fontFamily: "system-ui", fontWeight: 700, fontSize: 10, cursor: "pointer" }}
            >
              {showPron ? <Eye size={10}/> : <EyeOff size={10}/>} PRON.
            </button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: TEXT2, cursor: "pointer", padding: "6px 10px" }}><X size={15}/></button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Loading state */}
          {!isReady && (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ width: 36, height: 36, border: `3px solid ${TEAL_DIM}`, borderTopColor: TEAL, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 14px" }}/>
              <p style={{ color: TEXT3, fontFamily: "system-ui", fontSize: 13 }}>
                {loading ? "Chargement des versets..." : "Chargement des prononciations..."}
              </p>
            </div>
          )}

          {isReady && lines && lines.length === 0 && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <p style={{ color: TEXT2, fontFamily: "system-ui" }}>Impossible de charger les versets.</p>
              <button onClick={onClose} style={darkBtn(TEAL)}>Fermer</button>
            </div>
          )}

          {/* INTRO STEP */}
          {isReady && lines && lines.length > 0 && step === "intro" && (
            <div>
              {basmala && (
                <div style={{ background: TEAL_DIM, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEAL, letterSpacing: "0.14em", marginBottom: 6 }}>BASMALA — récitée une seule fois au début</div>
                  <p style={{ fontSize: 20, direction: "rtl", fontFamily: "Georgia,serif", color: TEXT1, margin: 0, lineHeight: 1.9 }}>{basmala.ar}</p>
                  <p style={{ fontSize: 11, fontFamily: "system-ui", color: TEXT3, margin: "4px 0 0", fontStyle: "italic" }}>Biss-mill-aa-hir-rah-maa-nir-ra-HEEM</p>
                </div>
              )}
              <div style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <AudioPlayer src={audioSrc} label="Écouter d'abord" reciterName={rec.name}/>
              </div>
              <p style={{ fontFamily: "system-ui", fontSize: 12, color: TEXT3, marginBottom: 14, textAlign: "center" }}>Écoutez la sourate, puis récitez verset par verset</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20, maxHeight: 280, overflowY: "auto" }}>
                {lines.slice(0, 10).map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: D3, border: `1px solid ${BORDER2}`, borderRadius: 9 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: TEAL_DIM, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, fontFamily: "system-ui" }}>{i+1}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 15, fontFamily: "Georgia,serif", color: TEXT1, direction: "rtl", display: "block" }}>{l.ar}</span>
                      {showPron && pronunciations[i] && (
                        <span style={{ fontSize: 11, color: PURPLE, fontFamily: "system-ui", fontStyle: "italic", display: "block", marginTop: 4, animation: "fadeIn .2s ease" }}>
                          🔊 {pronunciations[i]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {lines.length > 10 && (
                  <p style={{ color: TEXT3, fontSize: 11, textAlign: "center", fontFamily: "system-ui" }}>...et {lines.length - 10} autres versets</p>
                )}
              </div>
              <button onClick={() => setStep("practice")} style={{ ...darkBtn(TEAL), width: "100%", justifyContent: "center" }}>
                Commencer la pratique →
              </button>
            </div>
          )}

          {/* PRACTICE STEP */}
          {isReady && lines && (step === "practice" || step === "record") && currentLine && (
            <div>
              <ProgressBar current={lineIdx} total={lines.length} color={TEAL}/>
              <div style={{ background: D3, border: `1.5px solid ${BORDER}`, borderRadius: 14, padding: 20, marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEAL, letterSpacing: "0.15em", marginBottom: 10 }}>
                  VERSET {lineIdx+1} / {lines.length}
                </div>
                <p style={{ fontSize: 26, direction: "rtl", fontFamily: "Georgia,serif", color: TEXT1, margin: "0 0 10px", lineHeight: 1.9 }}>{currentLine.ar}</p>
                {currentPron && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
                    <button
                      onClick={() => setShowPron(v => !v)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, border: `1px solid rgba(168,85,247,${showPron ? "0.4" : "0.2"})`, background: showPron ? PURPLE_DIM : "transparent", color: showPron ? PURPLE : TEXT3, fontFamily: "system-ui", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                    >
                      {showPron ? <Eye size={9}/> : <EyeOff size={9}/>}
                      {showPron ? "Masquer prononciation" : "Voir prononciation"}
                    </button>
                    {showPron && (
                      <span style={{ fontSize: 12, color: PURPLE, fontFamily: "system-ui", fontStyle: "italic", fontWeight: 600, background: PURPLE_DIM, border: `1px solid rgba(168,85,247,0.2)`, borderRadius: 20, padding: "3px 12px", animation: "fadeIn .2s ease" }}>
                        {currentPron}
                      </span>
                    )}
                  </div>
                )}
                {currentLine.en && (
                  <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8, padding: "8px 14px", display: "inline-block" }}>
                    <span style={{ fontFamily: "Georgia,serif", fontSize: 12, color: "#93b4ef", fontStyle: "italic" }}>{currentLine.en}</span>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 16 }}>
                <AudioPlayer src={audioSrc} label="Récitation" reciterName={rec.name}/>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "system-ui", fontSize: 12, color: TEXT3, marginBottom: 12 }}>Récitez ce verset en arabe :</p>
                {!recording ? (
                  <button onClick={startRec} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${RED},#c53030)`, color: "white", fontFamily: "system-ui", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 20px rgba(239,68,68,0.3)` }}>
                    <Mic size={18}/> Appuyer pour réciter
                  </button>
                ) : (
                  <button onClick={() => { recRef.current?.stop(); setRecording(false); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, border: "none", background: "#7f1d1d", color: "white", fontFamily: "system-ui", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    <MicOff size={18}/> Arrêter
                  </button>
                )}
                {recording && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, animation: "pulse 1s ease-in-out infinite" }}/>
                      <p style={{ fontFamily: "system-ui", fontSize: 11, color: RED, margin: 0 }}>En écoute...</p>
                    </div>
                    {transcript && (
                      <p style={{ direction: "rtl", fontFamily: "Georgia,serif", fontSize: 17, color: TEXT1, padding: "8px 14px", background: D4, borderRadius: 8, border: `1px solid ${BORDER}` }}>{transcript}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESULT STEP */}
          {isReady && lines && step === "result" && currentLine && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: D3, border: `3px solid ${scoreColor(score)}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: `0 0 24px ${scoreColor(score)}30` }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: scoreColor(score), fontFamily: "system-ui" }}>{score}%</span>
              </div>
              <p style={{ fontWeight: 700, fontFamily: "system-ui", fontSize: 15, color: TEXT1, marginBottom: 16 }}>
                {score >= 75 ? "🌟 Maasha Allah ! Excellent !" : score >= 50 ? "👍 Bien, continuez !" : "🎧 Écoutez et réessayez"}
              </p>
              <div style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 14, textAlign: "left", marginBottom: 18 }}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEAL, letterSpacing: "0.12em", marginBottom: 4 }}>VERSET CORRECT</div>
                  <p style={{ fontSize: 20, direction: "rtl", fontFamily: "Georgia,serif", color: TEXT1, margin: 0 }}>{currentLine.ar}</p>
                  {currentPron && (
                    <p style={{ fontSize: 11, fontFamily: "system-ui", color: PURPLE, margin: "4px 0 0", fontStyle: "italic" }}>🔊 {currentPron}</p>
                  )}
                </div>
                {transcript && (
                  <div>
                    <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: scoreColor(score), letterSpacing: "0.12em", marginBottom: 4 }}>VOTRE RÉPONSE</div>
                    <p style={{ fontSize: 16, direction: "rtl", fontFamily: "Georgia,serif", color: TEXT2, margin: 0, padding: "7px 11px", background: D4, borderRadius: 7 }}>{transcript}</p>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 9, justifyContent: "center" }}>
                <button onClick={() => { setStep("practice"); setTranscript(""); setScore(null); setHistory(h => h.slice(0,-1)); }} style={darkBtn(TEXT2, false)}>
                  <RotateCcw size={13}/> Réessayer
                </button>
                <button onClick={next} style={darkBtn(TEAL)}>
                  {lineIdx < lines.length - 1 ? "Suivant →" : "Terminer"}
                </button>
              </div>
            </div>
          )}

          {/* DONE STEP */}
          {isReady && lines && step === "done" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>{avgScore >= 75 ? "🏆" : avgScore >= 50 ? "🥈" : "📚"}</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, fontFamily: "Georgia,serif", color: TEXT1, margin: "0 0 6px" }}>Session terminée !</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, margin: "18px 0" }}>
                {[["Score moyen", `${avgScore}%`], ["Versets", `${history.length}`], ["Réussis", `${history.filter(h => h.score >= 75).length}`]].map(([l,v]) => (
                  <div key={l} style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 11, padding: "10px 16px" }}>
                    <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEXT3, letterSpacing: "0.1em", marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: TEAL, fontFamily: "system-ui" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 9, justifyContent: "center" }}>
                <button onClick={() => { setStep("intro"); setLineIdx(0); setHistory([]); setTranscript(""); setScore(null); }} style={darkBtn(TEAL)}>Recommencer</button>
                <button onClick={onClose} style={darkBtn(TEXT2, false)}>Fermer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   VOICE QUIZ MODAL
   — Uses API pronunciations for ALL surahs
══════════════════════════════════════════════════════════════ */
function VoiceQuiz({ surahNumber, surahName, onClose, reciterId }) {
  const [lines,    setLines]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [phase,    setPhase]    = useState("intro");
  const [qIndex,   setQIndex]   = useState(0);
  const [recording,setRecording]= useState(false);
  const [transcript,setTranscript]= useState("");
  const [lineScore,setLineScore]= useState(null);
  const [results,  setResults]  = useState([]);
  const [showPron, setShowPron] = useState(false);
  const recognitionRef = useRef(null);

  const rec = reciters.find(r => r.id === reciterId) || reciters[0];
  const audioSrc = `${rec.server}/${String(surahNumber).padStart(3,"0")}.mp3`;

  // ── Fetch pronunciations from API ──
  const { pronunciations, loadingPron } = usePronunciations(surahNumber);

  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
      .then(r => r.json())
      .then(aj => {
        if (aj.code === 200) {
          const raw = aj.data.ayahs.map(v => ({ ar: v.text, hint: v.text.split(" ").slice(0,3).join(" ") + "…" }));
          let practiceLines = raw;
          if (!NO_SEPARATE_BASMALA.has(surahNumber) && raw.length > 0 && isBasmala(raw[0].ar)) {
            practiceLines = raw.slice(1);
          }
          setLines(practiceLines);
        }
        setLoading(false);
      })
      .catch(() => { setLines([]); setLoading(false); });
  }, [surahNumber]);

  const q = lines ? lines[qIndex] : null;
  const currentPron = pronunciations[qIndex] || null;
  const isReady = !loading && !loadingPron;

  function startRec() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Utilisez Chrome."); return; }
    setTranscript(""); setLineScore(null); setRecording(true);
    const r = new SR(); r.lang = "ar-SA"; r.continuous = false; r.interimResults = true;
    r.onresult = e => setTranscript(Array.from(e.results).map(r2 => r2[0].transcript).join(" "));
    r.onend = () => { setRecording(false); setPhase("result"); };
    r.onerror = () => { setRecording(false); setPhase("result"); };
    recognitionRef.current = r; r.start();
  }

  useEffect(() => {
    if (phase === "result" && q) {
      const s = !transcript.trim().length ? 0 : isArabicScript(transcript) ? similarity(transcript, q.ar) : 0.35;
      const pct = Math.round(s * 100);
      setLineScore(pct);
      setResults(prev => [...prev, { ar: q.ar, said: transcript, score: pct }]);
    }
  }, [phase]);

  const avgScore = results.length ? Math.round(results.reduce((a,r2) => a+r2.score,0)/results.length) : 0;
  const next = () => {
    if (qIndex < (lines?.length||0) - 1) {
      setQIndex(i => i+1); setPhase("prompt"); setTranscript(""); setLineScore(null); setShowPron(false);
    } else setPhase("done");
  };
  const scoreColor = s => s >= 75 ? TEAL : s >= 50 ? GOLD : RED;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,5,12,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      <div style={{ background: D2, border: `1px solid ${BORDER}`, borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "90vh", overflow: "auto", boxShadow: `0 24px 80px rgba(0,0,0,.7)` }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,#0d1a3a,#162344)`, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid rgba(59,130,246,0.2)`, borderRadius: "20px 20px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: TEXT1 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: BLUE_DIM, border: "1px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}><Brain size={16} color={BLUE}/></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "Georgia,serif" }}>Quiz Vocal — {surahName}</div>
              <div style={{ fontSize: 10, color: TEXT3 }}>TESTEZ VOTRE MÉMORISATION</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: TEXT2, cursor: "pointer", padding: "6px 10px" }}><X size={15}/></button>
        </div>

        <div style={{ padding: 24 }}>
          {!isReady && (
            <div style={{ textAlign: "center", padding: 50 }}>
              <div style={{ width: 28, height: 28, border: `2px solid ${BLUE_DIM}`, borderTopColor: BLUE, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 12px" }}/>
              <p style={{ color: TEXT3, fontFamily: "system-ui", fontSize: 12 }}>
                {loading ? "Chargement des versets..." : "Chargement des prononciations..."}
              </p>
            </div>
          )}

          {isReady && phase === "intro" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🧠</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "Georgia,serif", color: TEXT1, margin: "0 0 16px" }}>Quiz de Mémorisation Vocale</h3>
              <div style={{ background: D3, border: `1px solid rgba(59,130,246,0.2)`, borderRadius: 12, padding: 14, marginBottom: 20, textAlign: "left" }}>
                {["Parlez en arabe — le micro capte directement","Écoutez le récitateur avant de réciter","Récitez chaque verset de mémoire","Un bouton 🔊 révèle la prononciation si besoin","Réessayez autant que vous voulez"].map((s,i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontFamily: "system-ui", fontSize: 12, color: TEXT2 }}>
                    <span style={{ color: BLUE, fontWeight: 700 }}>→</span>{s}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <AudioPlayer src={audioSrc} label="Écouter d'abord" reciterName={rec.name}/>
              </div>
              <button onClick={() => setPhase("prompt")} style={{ background: BLUE, color: "white", border: "none", borderRadius: 12, padding: "13px 32px", fontFamily: "system-ui", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 20px rgba(59,130,246,0.3)` }}>
                Commencer →
              </button>
            </div>
          )}

          {isReady && lines && (phase === "prompt" || phase === "record") && q && (
            <div>
              <ProgressBar current={qIndex} total={lines.length} color={BLUE}/>
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontFamily: "system-ui", fontWeight: 700, color: TEXT3, letterSpacing: "0.12em", marginBottom: 7 }}>VERSET {qIndex+1} / {lines.length}</div>
                <div style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 22px" }}>
                  <div style={{ background: GOLD_L, border: `1px solid rgba(232,168,48,0.25)`, borderRadius: 8, padding: "7px 14px", display: "inline-block", marginBottom: 12 }}>
                    <span style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: GOLD, display: "block", marginBottom: 2 }}>INDICE — DÉBUT DU VERSET</span>
                    <span style={{ fontFamily: "Georgia,serif", fontSize: 14, color: GOLD, direction: "rtl" }}>{q.hint}</span>
                  </div>
                  {currentPron && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <button
                        onClick={() => setShowPron(v => !v)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, border: `1px solid rgba(168,85,247,${showPron ? "0.4" : "0.2"})`, background: showPron ? PURPLE_DIM : "transparent", color: showPron ? PURPLE : TEXT3, fontFamily: "system-ui", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                      >
                        {showPron ? <Eye size={9}/> : <EyeOff size={9}/>}
                        {showPron ? "Masquer aide" : "🔊 Aide prononciation"}
                      </button>
                      {showPron && (
                        <span style={{ fontSize: 11, color: PURPLE, fontFamily: "system-ui", fontStyle: "italic", fontWeight: 600, background: PURPLE_DIM, border: `1px solid rgba(168,85,247,0.2)`, borderRadius: 20, padding: "3px 10px", animation: "fadeIn .2s ease" }}>{currentPron}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <AudioPlayer src={audioSrc} label="Aide à la récitation" reciterName={rec.name}/>
              </div>
              <div style={{ textAlign: "center" }}>
                {!recording ? (
                  <button onClick={startRec} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "13px 28px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${RED},#c53030)`, color: "white", fontFamily: "system-ui", fontWeight: 700, fontSize: 14, boxShadow: `0 4px 20px rgba(239,68,68,0.3)` }}>
                    <Mic size={18}/> Appuyer pour réciter
                  </button>
                ) : (
                  <button onClick={() => { recognitionRef.current?.stop(); setRecording(false); }} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "13px 28px", borderRadius: 12, border: "none", cursor: "pointer", background: "#7f1d1d", color: "white", fontFamily: "system-ui", fontWeight: 700, fontSize: 14 }}>
                    <MicOff size={18}/> Terminer
                  </button>
                )}
                {recording && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, animation: "pulse 1s ease-in-out infinite" }}/>
                      <p style={{ fontFamily: "system-ui", fontSize: 11, color: RED, margin: 0 }}>En écoute...</p>
                    </div>
                    {transcript && (
                      <p style={{ direction: "rtl", fontFamily: "Georgia,serif", fontSize: 17, color: TEXT1, marginTop: 7, padding: "7px 12px", background: D4, borderRadius: 8 }}>{transcript}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {isReady && phase === "result" && q && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 86, height: 86, borderRadius: "50%", background: D3, border: `3px solid ${scoreColor(lineScore)}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: `0 0 24px ${scoreColor(lineScore)}30` }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(lineScore), fontFamily: "system-ui" }}>{lineScore}%</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "Georgia,serif", color: TEXT1, margin: "0 0 14px" }}>
                {lineScore >= 75 ? "✅ Maasha Allah !" : lineScore >= 50 ? "🟡 Presque !" : "❌ Révisez ce verset."}
              </h3>
              <div style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 14, textAlign: "left", marginBottom: 18 }}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEAL, letterSpacing: "0.1em", marginBottom: 3 }}>VERSET CORRECT</div>
                  <div style={{ fontSize: 18, direction: "rtl", fontFamily: "Georgia,serif", color: TEXT1 }}>{q.ar}</div>
                  {pronunciations[qIndex] && (
                    <div style={{ fontSize: 11, color: PURPLE, marginTop: 4, fontFamily: "system-ui", fontStyle: "italic" }}>🔊 {pronunciations[qIndex]}</div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: scoreColor(lineScore), letterSpacing: "0.1em", marginBottom: 3 }}>VOTRE RÉPONSE</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 14, direction: "rtl", color: TEXT2, background: D4, padding: "7px 11px", borderRadius: 7 }}>
                    {transcript || "(rien détecté)"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 9, justifyContent: "center" }}>
                <button onClick={() => { setPhase("prompt"); setTranscript(""); setLineScore(null); setShowPron(false); setResults(r => r.slice(0,-1)); }} style={darkBtn(TEXT2, false)}>
                  <RotateCcw size={13}/> Réessayer
                </button>
                <button onClick={next} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "10px 20px", background: BLUE, border: "none", color: "white", borderRadius: 10, fontFamily: "system-ui", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  {qIndex < (lines?.length||0) - 1 ? "Suivant" : "Terminer"} <ChevronRight size={13}/>
                </button>
              </div>
            </div>
          )}

          {isReady && phase === "done" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>{avgScore >= 75 ? "🏆" : avgScore >= 50 ? "🥈" : "📚"}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: "Georgia,serif", color: TEXT1, margin: "0 0 4px" }}>Quiz Terminé !</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, margin: "18px 0" }}>
                {[["Score", `${avgScore}%`], ["Versets", `${results.length}`], ["Réussis", `${results.filter(r => r.score >= 75).length}`]].map(([l,v]) => (
                  <div key={l} style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "11px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEXT3, letterSpacing: "0.1em", marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: TEAL, fontFamily: "system-ui" }}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => { setPhase("intro"); setQIndex(0); setResults([]); }} style={darkBtn(BLUE)}>
                Recommencer le Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   QURAN BROWSER
   — Uses API pronunciations for ALL surahs
══════════════════════════════════════════════════════════════ */
function QuranBrowser({ onClose }) {
  const [search,        setSearch]        = useState("");
  const [selected,      setSelected]      = useState(null);
  const [surahData,     setSurahData]     = useState(null);
  const [loadingVers,   setLoadingVers]   = useState(false);
  const [showTrans,     setShowTrans]     = useState(true);
  const [showAllPron,   setShowAllPron]   = useState(false);
  const [reciter,       setReciter]       = useState("mishari");
  const [voiceSurah,    setVoiceSurah]    = useState(null);
  const [memorised,     setMemorised]     = useState(new Set()); // surah numbers memorised

  const MEMO_MODULE = "Sourates";
  const MEMO_COURSE = "Mémorisation : Les 10 dernières Sourates";
  const surahKey = (s) => `${MEMO_COURSE} — ${MEMO_MODULE} — Sourate ${s.n} : ${s.en}`;

  // Load existing memorised surahs from backend on mount
  useEffect(() => {
    api.get("/api/me")
      .then(r => {
        const completed = r.data.completedLessons || [];
        const nums = new Set();
        completed.forEach(key => {
          const match = key.match(/^Mémorisation.*— Sourate (\d+) :/);
          if (match) nums.add(parseInt(match[1]));
        });
        setMemorised(nums);
      })
      .catch(() => {});
  }, []);

  const toggleMemorised = async (surah) => {
    const already = memorised.has(surah.n);
    if (already) {
      setMemorised(prev => { const s = new Set(prev); s.delete(surah.n); return s; });
    } else {
      setMemorised(prev => new Set([...prev, surah.n]));
      try {
        await api.post("/api/update-progress", { lessonTitle: surahKey(surah) });
      } catch (err) {
        console.error("Erreur sauvegarde mémorisation :", err);
        setMemorised(prev => { const s = new Set(prev); s.delete(surah.n); return s; });
      }
    }
  };

  // ── Fetch pronunciations from API whenever a surah is selected ──
  const { pronunciations: selectedProns, loadingPron } = usePronunciations(selected?.n);
  const hasPron = selectedProns.length > 0;

  const filtered = ALL_SURAHS.filter(s =>
    s.en.toLowerCase().includes(search.toLowerCase()) ||
    s.ar.includes(search) ||
    String(s.n).includes(search) ||
    s.meaning.toLowerCase().includes(search.toLowerCase()) ||
    (s.fr && s.fr.toLowerCase().includes(search.toLowerCase()))
  );

  async function loadSurah(surah) {
    setSelected(surah); setSurahData(null); setShowAllPron(false);
    setLoadingVers(true);
    try {
      const [ar, en] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.n}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.n}/en.asad`)
      ]);
      const [aj, ej] = await Promise.all([ar.json(), en.json()]);
      if (aj.code === 200) {
        const raw = aj.data.ayahs.map((v,i) => ({ ar: v.text, en: ej.data?.ayahs[i]?.text || "", num: v.numberInSurah }));
        let basmala = null, lines = raw;
        if (!NO_SEPARATE_BASMALA.has(surah.n) && raw.length > 0 && isBasmala(raw[0].ar)) {
          basmala = raw[0]; lines = raw.slice(1);
        }
        setSurahData({ lines, basmala });
      }
    } catch {
      setSurahData({ lines: [{ ar: "تعذّر التحميل", en: "Could not load.", num: 1 }], basmala: null });
    }
    setLoadingVers(false);
  }

  const rec = reciters.find(r => r.id === reciter);
  const audioSrc = selected ? `${rec.server}/${String(selected.n).padStart(3,"0")}.mp3` : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,5,12,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      {voiceSurah && <VoicePractice surah={voiceSurah} reciterId={reciter} onClose={() => setVoiceSurah(null)}/>}
      <div style={{ background: D2, border: `1px solid ${BORDER}`, borderRadius: 20, width: "100%", maxWidth: 980, height: "92vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: `0 24px 80px rgba(0,0,0,.7)` }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${D3},${D4})`, color: TEXT1, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: TEAL_DIM, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}><BookMarked size={16} color={TEAL}/></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "Georgia,serif" }}>المصحف الشريف — Le Saint Coran</div>
              <div style={{ fontSize: 10, color: TEXT3, fontFamily: "system-ui", letterSpacing: "0.1em" }}>114 SOURATES · RÉCITATEURS AUTHENTIQUES</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: TEXT2, cursor: "pointer", padding: "6px 10px" }}><X size={16}/></button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ width: 270, borderRight: `1px solid ${BORDER2}`, display: "flex", flexDirection: "column", flexShrink: 0, background: D3 }}>
            <div style={{ padding: "10px 12px", borderBottom: `1px solid ${BORDER2}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: D4, borderRadius: 8, padding: "7px 11px", border: `1px solid ${BORDER2}` }}>
                <Search size={13} color={TEXT3}/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ border: "none", background: "transparent", fontSize: 12, outline: "none", width: "100%", color: TEXT1, fontFamily: "system-ui" }}/>
              </div>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map(s => (
                <button key={s.n} onClick={() => loadSurah(s)} style={{ display: "flex", alignItems: "center", width: "100%", padding: "9px 14px", border: "none", borderBottom: `1px solid ${BORDER2}`, cursor: "pointer", textAlign: "left", background: selected?.n === s.n ? TEAL_DIM : "transparent", borderLeft: selected?.n === s.n ? `3px solid ${TEAL}` : "3px solid transparent" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: selected?.n === s.n ? TEAL_DIM : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 9, flexShrink: 0, border: `1px solid ${selected?.n === s.n ? BORDER : BORDER2}` }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: selected?.n === s.n ? TEAL : TEXT3, fontFamily: "system-ui" }}>{s.n}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: selected?.n === s.n ? TEAL : TEXT1, fontFamily: "system-ui" }}>{s.en}</div>
                    <div style={{ fontSize: 10, color: TEXT3, fontFamily: "system-ui" }}>
                      {s.fr && <span style={{ color: TEAL, marginRight: 4 }}>{s.fr}</span>}
                      {s.meaning} · {s.verses}v
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
                    {memorised.has(s.n) && (
                      <span style={{ fontSize: 11, color: TEAL }} title="Mémorisée">✓</span>
                    )}
                    <div style={{ fontSize: 14, color: TEXT2, fontFamily: "Georgia,serif" }}>{s.ar}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: D2 }}>
            {!selected && (
              <div style={{ textAlign: "center", paddingTop: 80, color: TEXT3 }}>
                <BookOpen size={52} style={{ margin: "0 auto 14px", display: "block", opacity: .3 }}/>
                <p style={{ fontFamily: "system-ui", fontSize: 14 }}>Sélectionnez une sourate</p>
              </div>
            )}
            {selected && (
              <div>
                <div style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT1, fontFamily: "Georgia,serif" }}>{selected.en}</h2>
                      <p style={{ margin: "3px 0 0", fontSize: 18, color: TEAL, fontFamily: "Georgia,serif", direction: "rtl" }}>{selected.ar}</p>
                      {selected.fr && <p style={{ margin: "3px 0 0", fontSize: 13, color: TEAL, fontFamily: "system-ui", fontStyle: "italic" }}>Prononciation : <strong>{selected.fr}</strong></p>}
                      <p style={{ margin: "3px 0 0", fontSize: 11, color: TEXT3, fontFamily: "system-ui", fontStyle: "italic" }}>{selected.meaning} · {selected.verses} versets · {selected.type}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => setShowTrans(v => !v)} style={{ padding: "5px 11px", borderRadius: 7, border: `1.5px solid ${showTrans ? BLUE : "rgba(255,255,255,0.1)"}`, background: showTrans ? BLUE_DIM : "transparent", color: showTrans ? BLUE : TEXT3, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {showTrans ? <Eye size={10}/> : <EyeOff size={10}/>} Traduction
                      </button>
                      {/* Pronunciation toggle — only shown when API returned data */}
                      {loadingPron ? (
                        <div style={{ padding: "5px 11px", borderRadius: 7, border: `1px solid ${BORDER2}`, background: "transparent", display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 10, height: 10, border: `1.5px solid ${PURPLE_DIM}`, borderTopColor: PURPLE, borderRadius: "50%", animation: "spin .7s linear infinite" }}/>
                          <span style={{ fontSize: 10, color: TEXT3, fontFamily: "system-ui" }}>Pron...</span>
                        </div>
                      ) : hasPron && (
                        <button onClick={() => setShowAllPron(v => !v)} style={{ padding: "5px 11px", borderRadius: 7, border: `1.5px solid rgba(168,85,247,${showAllPron ? "0.5" : "0.2"})`, background: showAllPron ? PURPLE_DIM : "transparent", color: showAllPron ? PURPLE : TEXT3, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          {showAllPron ? <Eye size={10}/> : <EyeOff size={10}/>} Prononciation FR
                        </button>
                      )}
                      <button onClick={() => setVoiceSurah(selected)} style={{ padding: "5px 11px", borderRadius: 7, border: `1.5px solid ${TEAL}`, background: TEAL_DIM, color: TEAL, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Mic size={10}/> Pratiquer
                      </button>
                      <button onClick={() => toggleMemorised(selected)} style={{ padding: "5px 11px", borderRadius: 7, border: `1.5px solid ${memorised.has(selected.n) ? "#f59e0b" : "rgba(245,158,11,0.3)"}`, background: memorised.has(selected.n) ? "rgba(245,158,11,0.15)" : "transparent", color: memorised.has(selected.n) ? "#f59e0b" : TEXT3, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={10}/> {memorised.has(selected.n) ? "Mémorisée ✓" : "Marquer mémorisée"}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                    {reciters.map(r => (
                      <button key={r.id} onClick={() => setReciter(r.id)} style={{ padding: "5px 10px", borderRadius: 6, border: `1.5px solid ${reciter === r.id ? TEAL : "rgba(255,255,255,0.08)"}`, background: reciter === r.id ? TEAL_DIM : "transparent", color: reciter === r.id ? TEAL : TEXT3, fontFamily: "system-ui", fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{r.name}</button>
                    ))}
                  </div>
                  <AudioPlayer key={`${selected.n}-${reciter}`} src={audioSrc} label={selected.en} reciterName={reciters.find(r => r.id === reciter)?.name}/>
                </div>

                {loadingVers && (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <div style={{ width: 28, height: 28, border: `2px solid ${TEAL_DIM}`, borderTopColor: TEAL, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 10px" }}/>
                    <p style={{ color: TEXT3, fontFamily: "system-ui", fontSize: 12 }}>Chargement...</p>
                  </div>
                )}

                {surahData && !loadingVers && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {surahData.basmala && (
                      <div style={{ background: TEAL_DIM, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 18px", textAlign: "center", marginBottom: 4 }}>
                        <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEAL, letterSpacing: "0.14em", marginBottom: 6 }}>بِسْمِ اللَّهِ — BASMALA</div>
                        <p style={{ fontSize: 22, direction: "rtl", fontFamily: "Georgia,serif", color: TEXT1, margin: 0, lineHeight: 1.9 }}>{surahData.basmala.ar}</p>
                        <p style={{ fontSize: 11, fontFamily: "system-ui", color: TEXT3, margin: "4px 0 0", fontStyle: "italic" }}>Biss-mill-aa-hir-rah-maa-nir-ra-HEEM</p>
                      </div>
                    )}
                    {surahData.lines.map((line, i) => (
                      <VerseCard
                        key={i}
                        verseNum={line.num || i+1}
                        ar={line.ar}
                        en={line.en}
                        pronunciation={selectedProns[i] || null}
                        showTranslation={showTrans}
                        showAllPron={showAllPron}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PLAN GENERATOR ──────────────────────────────────────────── */
function generatePlan(speed) {
  const ORDER = [114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,55,56,57,58,59,60,61,62,63,64,65,66,48,49,50,51,52,53,54,36,37,38,39,40,41,42,43,44,45,46,47,29,30,31,32,33,34,35,20,21,22,23,24,25,26,27,28,13,14,15,16,17,18,19,6,7,8,9,10,11,12,3,4,5,1,2];
  const vpd = { slow: 5, medium: 10, fast: 20 }[speed];
  const days = [];
  let dayNum = 1, buffer = [], bufVerse = 0;
  ORDER.forEach(n => {
    const s = ALL_SURAHS.find(x => x.n === n);
    if (!s) return;
    buffer.push(s); bufVerse += s.verses;
    while (bufVerse >= vpd) {
      const dayItems = []; let remaining = vpd; const leftover = [];
      buffer.forEach(su => {
        if (remaining <= 0) { leftover.push(su); return; }
        if (su.verses <= remaining) {
          dayItems.push({ surah: su, part: "full", verses: su.verses }); remaining -= su.verses;
        } else {
          dayItems.push({ surah: su, part: `1–${remaining}`, verses: remaining });
          if (su.verses - remaining > 0) leftover.unshift({ ...su, verses: su.verses - remaining });
          remaining = 0;
        }
      });
      days.push({ day: dayNum++, items: dayItems });
      buffer = leftover; bufVerse = buffer.reduce((a, s2) => a + s2.verses, 0);
    }
  });
  if (buffer.length > 0) days.push({ day: dayNum++, items: buffer.map(su => ({ surah: su, part: "full", verses: su.verses })) });
  return days;
}

/* ── MEMO PLAN MODAL ─────────────────────────────────────────── */
function MemoPlan({ onClose }) {
  const [speed,     setSpeed]     = useState("medium");
  const [plan,      setPlan]      = useState(null);
  const [dayView,   setDayView]   = useState(null);
  const [completed, setCompleted] = useState({});
  const [page,      setPage]      = useState(0);
  const [reciter,   setReciter]   = useState("mishari");
  const [voiceSurah,setVoiceSurah]= useState(null);
  const PER_PAGE = 12;

  useEffect(() => { const p = generatePlan(speed); setPlan(p); setPage(0); setDayView(null); }, [speed]);

  const speedCfg = {
    slow:   { label: "Lent",   sub: "5v/j · 3 ans",   color: TEAL,  icon: "🌱", days: "~1 095 jours" },
    medium: { label: "Moyen",  sub: "10v/j · 1 an",   color: GOLD,  icon: "⭐", days: "~365 jours" },
    fast:   { label: "Rapide", sub: "20v/j · 6 mois", color: RED,   icon: "⚡", days: "~180 jours" },
  };
  const cfg = speedCfg[speed];
  const totalDays = plan?.length || 0;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
  const pages = plan ? Math.ceil(plan.length / PER_PAGE) : 0;
  const visible = plan ? plan.slice(page * PER_PAGE, (page + 1) * PER_PAGE) : [];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,5,12,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      {voiceSurah && <VoicePractice surah={voiceSurah} reciterId={reciter} onClose={() => setVoiceSurah(null)}/>}
      <div style={{ background: D2, border: `1px solid ${BORDER}`, borderRadius: 24, width: "100%", maxWidth: 1020, height: "93vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: `0 32px 80px rgba(0,0,0,.7), 0 0 60px ${TEAL}08` }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${D3},${D4})`, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: TEAL_DIM, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={20} color={TEAL}/></div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: 18, fontFamily: "Georgia,serif", color: TEXT1 }}>Plan de Mémorisation</h2>
              <p style={{ margin: 0, fontSize: 10, color: TEXT3, fontFamily: "system-ui", letterSpacing: "0.12em" }}>خطة الحفظ · 114 SOURATES</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: TEXT1, fontFamily: "system-ui" }}>{progress}%</div>
              <div style={{ fontSize: 9, color: TEXT3, fontFamily: "system-ui" }}>{completedCount}/{totalDays} jours</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: "50%", position: "relative" }}>
              <svg viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
                <circle cx="22" cy="22" r="18" fill="none" stroke={TEAL} strokeWidth="4" strokeDasharray={`${2*Math.PI*18}`} strokeDashoffset={`${2*Math.PI*18*(1-progress/100)}`} strokeLinecap="round" style={{ transition: "stroke-dashoffset .5s" }}/>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={13} color={TEAL}/></div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: TEXT2, cursor: "pointer", padding: "7px 11px" }}><X size={15}/></button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ background: D3, borderBottom: `1px solid ${BORDER2}`, padding: "10px 28px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEXT3, letterSpacing: "0.14em" }}>RYTHME</span>
          {Object.entries(speedCfg).map(([k,v]) => (
            <button key={k} onClick={() => setSpeed(k)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${speed === k ? v.color : "rgba(255,255,255,0.08)"}`, background: speed === k ? `${v.color}18` : "transparent", color: speed === k ? v.color : TEXT3, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
              {v.icon} {v.label} <span style={{ opacity: .6 }}>{v.sub}</span>
            </button>
          ))}
          <div style={{ width: 1, height: 20, background: BORDER }}/>
          <span style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEXT3, letterSpacing: "0.14em" }}>RÉCITATEUR</span>
          {reciters.map(r => (
            <button key={r.id} onClick={() => setReciter(r.id)} style={{ padding: "5px 10px", borderRadius: 7, border: `1.5px solid ${reciter === r.id ? TEAL : "rgba(255,255,255,0.08)"}`, background: reciter === r.id ? TEAL_DIM : "transparent", color: reciter === r.id ? TEAL : TEXT3, fontFamily: "system-ui", fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{r.short}</button>
          ))}
          <div style={{ marginLeft: "auto", background: D4, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontFamily: "system-ui", color: TEAL, fontWeight: 700 }}>{cfg.days}</div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 28px" }}>
          {!plan && <div style={{ textAlign: "center", padding: 60, color: TEXT3 }}>Génération...</div>}
          {plan && !dayView && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10, marginBottom: 20 }}>
                {visible.map(day => {
                  const done = completed[day.day];
                  const totalV = day.items.reduce((a,it) => a+it.verses, 0);
                  return (
                    <button key={day.day} onClick={() => setDayView(day)} style={{ background: done ? `${TEAL}10` : D3, border: `1.5px solid ${done ? TEAL : BORDER2}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left", position: "relative", transition: "all .15s", boxShadow: done ? `0 0 20px ${TEAL}15` : "none" }}>
                      {done && <div style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: "50%", background: TEAL, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={10} color={D1}/></div>}
                      <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 800, color: cfg.color, letterSpacing: "0.12em", marginBottom: 5 }}>JOUR {day.day}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT1, fontFamily: "system-ui", marginBottom: 3, lineHeight: 1.35 }}>
                        {day.items.map(it => it.surah.en).join(", ").slice(0,38)}{day.items.map(it => it.surah.en).join(", ").length>38?"…":""}
                      </div>
                      <div style={{ direction: "rtl", fontSize: 13, color: TEAL, fontFamily: "Georgia,serif", marginBottom: 4 }}>
                        {day.items.map(it => it.surah.ar).join("، ").slice(0,28)}
                      </div>
                      <div style={{ fontSize: 10, color: TEXT3, fontFamily: "system-ui" }}>{totalV} versets</div>
                    </button>
                  );
                })}
              </div>
              {pages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0} style={{ ...darkBtn(TEAL, false), opacity: page===0?.4:1 }}><ChevronLeft size={13}/> Préc.</button>
                  <span style={{ fontFamily: "system-ui", fontSize: 12, color: TEXT2, fontWeight: 700 }}>Page {page+1} / {pages}</span>
                  <button onClick={() => setPage(p => Math.min(pages-1,p+1))} disabled={page===pages-1} style={{ ...darkBtn(TEAL), opacity: page===pages-1?.4:1 }}>Suiv. <ChevronRight size={13}/></button>
                </div>
              )}
            </div>
          )}

          {plan && dayView && (
            <div>
              <button onClick={() => setDayView(null)} style={{ ...darkBtn(TEXT2, false), marginBottom: 18 }}><ChevronLeft size={13}/> Retour</button>
              <div style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, fontFamily: "system-ui", fontWeight: 700, color: cfg.color, letterSpacing: "0.12em", marginBottom: 6 }}>JOUR {dayView.day} — {cfg.icon} {cfg.label.toUpperCase()}</div>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "Georgia,serif", color: TEXT1 }}>{dayView.items.map(it => it.surah.en).join(" + ")}</h3>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT3, fontFamily: "system-ui" }}>{dayView.items.reduce((a,it) => a+it.verses,0)} versets à mémoriser</p>
                  </div>
                  <button onClick={() => {
                    const nowDone = !completed[dayView.day];
                    setCompleted(c => ({...c,[dayView.day]:nowDone}));
                    if (nowDone) {
                      const surahNames = dayView.items.map(it => it.surah.en).join(" + ");
                      saveProgress(`${COURSE_TITLE} — Sourates — Jour ${dayView.day} : ${surahNames}`);
                    }
                  }} style={darkBtn(completed[dayView.day] ? TEAL : TEXT2, !!completed[dayView.day])}>
                    {completed[dayView.day] ? <><CheckCircle size={13}/> Terminé</> : <><Square size={13}/> Marquer fait</>}
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {dayView.items.map((item, i) => {
                  const audSrc = `${reciters.find(r => r.id === reciter).server}/${String(item.surah.n).padStart(3,"0")}.mp3`;
                  return (
                    <div key={i} style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: TEAL_DIM, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 900, color: TEAL, fontFamily: "system-ui" }}>{item.surah.n}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: TEXT1, fontFamily: "system-ui" }}>{item.surah.en}</div>
                          <div style={{ fontSize: 11, color: TEXT3, fontFamily: "system-ui" }}>
                            {item.surah.meaning} · {item.surah.type} · {item.verses} v
                            {item.surah.fr && <span style={{ color: TEAL, marginLeft: 6 }}>· {item.surah.fr}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 19, color: TEAL, fontFamily: "Georgia,serif", direction: "rtl" }}>{item.surah.ar}</div>
                          <div style={{ fontSize: 10, color: cfg.color, fontFamily: "system-ui", fontWeight: 700 }}>{item.part === "full" ? "Complète" : `v${item.part}`}</div>
                        </div>
                      </div>
                      <div style={{ borderTop: `1px solid ${BORDER2}`, padding: "14px 20px", background: D4 }}>
                        <p style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEXT3, letterSpacing: "0.14em", marginBottom: 10 }}>RÉCITATION</p>
                        <AudioPlayer src={audSrc} reciterName={reciters.find(r => r.id === reciter)?.name}/>
                        <div style={{ marginTop: 12 }}>
                          <button onClick={() => setVoiceSurah(item.surah)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${TEAL}`, background: TEAL_DIM, cursor: "pointer", textAlign: "left" }}>
                            <div style={{ width: 34, height: 34, borderRadius: 8, background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Mic size={15} color={D1}/></div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: TEAL, fontFamily: "system-ui" }}>Pratiquer la récitation</div>
                              <div style={{ fontSize: 11, color: TEXT3, fontFamily: "system-ui" }}>Récitez verset par verset — score instantané</div>
                            </div>
                            <ChevronRight size={14} color={TEAL} style={{ marginLeft: "auto" }}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 10 }}>
                {dayView.day > 1 && <button onClick={() => setDayView(plan[dayView.day-2])} style={darkBtn(TEXT2, false)}><ChevronLeft size={13}/> Jour {dayView.day-1}</button>}
                <div/>
                {dayView.day < plan.length && <button onClick={() => setDayView(plan[dayView.day])} style={darkBtn(TEAL)}>Jour {dayView.day+1} <ChevronRight size={13}/></button>}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

/* ── LESSONS DATA ─────────────────────────────────────────────── */
const lessons = [
  {
    id:0,title:"Introduction",subtitle:"Le Voyage du Hifz",arabic:"مقدمة",surahNumber:null,icon:"🎓",
    description:"Bienvenue dans votre parcours de mémorisation du Coran.",
    lesson:`### L'Art de la Mémorisation\nLe Hifz n'est pas une course, c'est une relation vivante avec le Livre d'Allah. Pour réussir, transformez la répétition mécanique en compréhension profonde.\n\n### Les Piliers de la Réussite\nL'Intention (Niyyah) : Pourquoi apprenez-vous ? Pour briller ou pour vous guider ? La réponse détermine votre endurance sur le long terme.\n\nLa Répétition Espacée : Il vaut mieux réviser une sourate 5 minutes tous les jours que 2 heures une fois par semaine.\n\nL'Écoute Active : La mémoire auditive est plus robuste que la mémoire visuelle. Écoutez les récitateurs avant de mémoriser.\n\n### La Méthode des 3R\nLire → Répéter → Réviser. Chaque nouveau verset doit être relié au précédent pour former des chaînes solides dans la mémoire.`
  },
  {
    id:5,title:"Al-Fatiha",subtitle:"L'Ouverture Divine",arabic:"سورة الفاتحة",verses:7,surahNumber:1,icon:"⚡",
    pronunciation:"al-faa-ti-HA",
    description:"La Mère du Livre — récitée 17 fois par jour dans la prière.",
    lesson:`### La Mère du Livre\nAl-Fatiha (al-faa-ti-HA) est récitée au moins 17 fois par jour dans la prière. Elle contient l'essence de tout le Coran.\n\n### Prononciation française\n• Al — comme « al » dans « album »\n• Faa — « a » long, comme « fâme »\n• ti — bref, comme « ti » dans « petit »\n• HA — le « H » est expiré (aspiré), pas silencieux\n\n### Le Dialogue Divin\nSelon un hadith du Prophète ﷺ, Allah dit : "J'ai partagé la prière entre Moi et Mon serviteur en deux moitiés." Chaque verset reçoit une réponse divine.\n\n### Structure et Sens\nLes 7 versets se divisent en deux parties : les versets 1–4 glorifient Allah, et les versets 5–7 formulent la grande demande : "Guide-nous au chemin droit."\n\n### La Seule Demande\nParmi tous les versets, un seul est une vraie supplique : "Ihdina as-sirat al-mustaqim". Tout le reste est louange et reconnaissance.`
  },
  {
    id:1,title:"An-Nas",subtitle:"Le Sanctuaire Intérieur",arabic:"سورة الناس",verses:6,surahNumber:114,icon:"🛡️",
    pronunciation:"an-NAAS",
    description:"Votre bouclier contre les pensées intrusives et les doutes internes.",
    lesson:`### Prononciation française\n• An — comme « an » dans « antan »\n• Naas — le « aa » est allongé, comme « naaace »\n• Accent sur la deuxième syllabe : an-NAAS\n\n### Maîtriser son Esprit\nCette sourate identifie la source principale de l'anxiété spirituelle : le "Waswas" — le murmure intérieur qui détourne du bien.\n\n### Les Trois Attributs Divins\nAllah est décrit par trois noms en séquence : Rabb (Seigneur-protecteur), Malik (Roi souverain) et Ilah (Dieu adoré). C'est une progression de la protection vers l'autorité absolue.\n\n### Le Waswas Khannas\n"Al-Khannas" signifie "celui qui se rétracte" — une description précise du doute qui disparaît quand on invoque Allah et revient dès qu'on l'oublie.\n\n### Application Pratique\nRécitez An-Nas avant de dormir, après chaque prière, et lors de pensées négatives persistantes.`
  },
  {
    id:2,title:"Al-Falaq",subtitle:"L'Aube de la Clarté",arabic:"سورة الفلق",verses:5,surahNumber:113,icon:"✨",
    pronunciation:"al-FA-laq",
    description:"Protection contre les maux extérieurs, l'obscurité et l'envie.",
    lesson:`### Prononciation française\n• Al — comme « al » dans « album »\n• FA — bref et net\n• laq — le « q » final est une occlusion gutturale (comme un « k » du fond de la gorge)\n• Accent sur la deuxième syllabe : al-FA-laq\n\n### Dissiper l'Obscurité\n"Al-Falaq" signifie l'aube — la lumière qui fend l'obscurité. Le terme évoque la percée soudaine de la lumière dans la nuit.\n\n### Les Quatre Protections\nLa sourate demande protection contre quatre maux précis : la création en général, la nuit obscure, la sorcellerie (nœuds soufflés), et la jalousie de l'envieux.\n\n### Al-Mu'awwidhatain\nAl-Falaq et An-Nas forment les "deux sourates de refuge". Le Prophète ﷺ les récitait chaque matin et soir, et les soufflait sur ses mains avant de dormir.\n\n### Signification du Hasad\nLa jalousie (حسد) est mentionnée séparément car elle est la source de nombreux maux humains.`
  },
  {
    id:3,title:"Al-Ikhlas",subtitle:"L'Essence de l'Unité",arabic:"سورة الإخلاص",verses:4,surahNumber:112,icon:"⭐",
    pronunciation:"al-ikh-LAAS",
    description:"Équivaut au tiers du Coran — la définition pure de la divinité.",
    lesson:`### Prononciation française\n• Al — comme « al » dans « album »\n• ikh — le « kh » est une fricative gutturale, comme le « j » espagnol dans « jota »\n• LAAS — « aa » allongé, comme « laaace »\n• Accent sur la troisième syllabe : al-ikh-LAAS\n\n### La Pureté Absolue\n"Ikhlas" signifie purifier son intention. Cette sourate équivaut au tiers du Coran car elle couvre le tiers doctrinal fondamental : la nature d'Allah.\n\n### Al-Samad — Le Mot Unique\n"Al-Samad" (الصمد) est l'un des mots les plus denses du Coran. Il désigne Celui qui est parfait en Lui-même et vers qui toute créature se tourne dans le besoin.\n\n### La Négation Totale\nLes deux derniers versets établissent trois négations absolues : Il n'engendre pas, n'est pas engendré, et n'a aucun égal. Chaque négation réfute une erreur théologique majeure.\n\n### Pourquoi la réciter 3 fois ?\nLe Prophète ﷺ a dit que réciter Al-Ikhlas trois fois équivaut à réciter tout le Coran.`
  },
];

const quizzes = [
  {id:101,lessonId:0,q:"Que signifie le mot 'Hifz' en arabe ?",opts:["La lecture","La mémorisation","La compréhension","La récitation"],ans:"La mémorisation"},
  {id:102,lessonId:0,q:"Quelle approche est plus efficace pour mémoriser ?",opts:["2h une fois par semaine","5 min chaque jour","1h une fois par mois","Apprendre tout d'un coup"],ans:"5 min chaque jour"},
  {id:103,lessonId:0,q:"La méthode des 3R signifie :",opts:["Réciter, Réfléchir, Relier","Lire, Répéter, Réviser","Regarder, Redire, Retenir","Rien de tout cela"],ans:"Lire, Répéter, Réviser"},
  {id:501,lessonId:5,q:"Quel est le surnom d'Al-Fatiha ?",opts:["La Dernière","La Clé","La Mère du Livre","Le Trône"],ans:"La Mère du Livre"},
  {id:502,lessonId:5,q:"Combien de versets contient Al-Fatiha ?",opts:["5","6","7","8"],ans:"7"},
  {id:503,lessonId:5,q:"Combien de fois Al-Fatiha est-elle récitée dans les 5 prières ?",opts:["10","15","17","20"],ans:"17"},
  {id:111,lessonId:1,q:"Que signifie 'Al-Khanas' ?",opts:["Le fort","Celui qui se cache / recule","Le bruyant","Le visible"],ans:"Celui qui se cache / recule"},
  {id:112,lessonId:1,q:"Combien de versets contient An-Nas ?",opts:["4","5","6","7"],ans:"6"},
  {id:113,lessonId:1,q:"Les trois attributs d'Allah dans An-Nas sont :",opts:["Rabb, Malik, Ilah","Rahman, Rahim, Malik","Ahad, Samad, Rabb","Ilah, Qadeer, Aziz"],ans:"Rabb, Malik, Ilah"},
  {id:201,lessonId:2,q:"Al-Falaq signifie :",opts:["Le crépuscule","L'aube / percée de lumière","La nuit","Le soleil"],ans:"L'aube / percée de lumière"},
  {id:202,lessonId:2,q:"Combien de maux sont mentionnés dans Al-Falaq ?",opts:["2","3","4","5"],ans:"4"},
  {id:203,lessonId:2,q:"Que signifie 'Hasad' ?",opts:["La sorcellerie","La jalousie / envie","L'obscurité","La peur"],ans:"La jalousie / envie"},
  {id:204,lessonId:2,q:"Al-Falaq et An-Nas sont appelées :",opts:["Al-Mufassal","Al-Mu'awwidhatain","Al-Mathani","Al-Kiram"],ans:"Al-Mu'awwidhatain"},
  {id:301,lessonId:3,q:"Que signifie 'Al-Samad' ?",opts:["Le Miséricordieux","L'Éternel dont tout dépend","Le Créateur","Le Pardonneur"],ans:"L'Éternel dont tout dépend"},
  {id:302,lessonId:3,q:"Al-Ikhlas équivaut à quelle fraction du Coran ?",opts:["1/4","1/3","1/2","2/3"],ans:"1/3"},
  {id:303,lessonId:3,q:"Combien de versets contient Al-Ikhlas ?",opts:["3","4","5","6"],ans:"4"},
  {id:304,lessonId:3,q:"'Lam yalid wa lam yulad' signifie :",opts:["Il est unique","Il n'a ni engendré ni été engendré","Il est éternel","Rien ne Lui ressemble"],ans:"Il n'a ni engendré ni été engendré"},
];

/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */
export default function AcademieHifz() {
  const [tab,               setTab]               = useState("lesson");
  const [lid,               setLid]               = useState(0);
  const [answers,           setAnswers]           = useState({});
  const [submitted,         setSubmitted]         = useState(false);
  const [reciter,           setReciter]           = useState("mishari");
  const [showTrans,         setShowTrans]         = useState(true);
  const [showQuran,         setShowQuran]         = useState(false);
  const [showVoiceQuiz,     setShowVoiceQuiz]     = useState(false);
  const [showPlan,          setShowPlan]          = useState(false);
  const [showVoicePractice, setShowVoicePractice] = useState(false);
  const [activePage,        setActivePage]        = useState("memorisation");

  const lesson = lessons.find(l => l.id === lid);
  const rec = reciters.find(r => r.id === reciter);
  const qList = quizzes.filter(q => q.lessonId === lid);
  const score = qList.filter(q => answers[q.id] === q.ans).length;
  const hasAud = !!lesson?.surahNumber;
  const audioSrc = hasAud ? `${rec.server}/${String(lesson.surahNumber).padStart(3,"0")}.mp3` : null;

  function pickLesson(id) { setLid(id); setTab("lesson"); setSubmitted(false); setAnswers({}); }

  const navLinks = [
    { key: "memorisation", label: "Hifz",    labelAr: "الحفظ" },
    { key: "sira",         label: "Sīra",    labelAr: "السيرة" },
    { key: "tafsir",       label: "Tafsīr",  labelAr: "التفسير" },
    { key: "arabic",       label: "Arabe",   labelAr: "العربية" },
  ];

  const tabs = [
    { key: "lesson", label: "📖 Leçon" },
    { key: "quiz",   label: `Quiz · ${qList.length}` },
    ...(hasAud ? [{ key: "voice", label: "🎙️ Pratique" }] : []),
  ];

  return (
    <div style={{ fontFamily: "Georgia,'Times New Roman',serif", background: D1, minHeight: "100vh", color: TEXT1 }}>
      <style>{`
        @keyframes wave{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}button:focus{outline:none}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(15,163,127,0.2);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(15,163,127,0.4)}
        .appear{animation:fadeIn .3s ease both}
      `}</style>

      {showQuran         && <QuranBrowser onClose={() => setShowQuran(false)}/>}
      {showVoicePractice && lesson?.surahNumber && (
        <VoicePractice
          surah={ALL_SURAHS.find(s => s.n === lesson.surahNumber)}
          reciterId={reciter}
          onClose={() => setShowVoicePractice(false)}
        />
      )}
      {showVoiceQuiz && lesson?.surahNumber && (
        <VoiceQuiz
          surahNumber={lesson.surahNumber}
          surahName={lesson.title}
          onClose={() => setShowVoiceQuiz(false)}
          reciterId={reciter}
        />
      )}
      {showPlan && <MemoPlan onClose={() => setShowPlan(false)}/>}

      {/* ══ NAVBAR ══ */}
      <div style={{ background: `linear-gradient(180deg,${D3},${D2})`, borderBottom: `1px solid ${BORDER2}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: TEAL_DIM, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={17} color={TEAL}/>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: TEXT1, fontFamily: "Georgia,serif" }}>Safoua <span style={{ color: GOLD }}>Academy</span></div>
              <div style={{ fontSize: 9, color: TEXT3, fontFamily: "system-ui", letterSpacing: "0.15em" }}>أكاديمية الصفوة</div>
            </div>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(l => (
              <button key={l.key} onClick={() => setActivePage(l.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 14px", border: "none", background: "transparent", cursor: "pointer", borderRadius: 8, position: "relative" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: activePage === l.key ? TEXT1 : TEXT3, fontFamily: "system-ui", transition: "color .2s" }}>{l.label}</span>
                <span style={{ fontSize: 9, color: activePage === l.key ? GOLD : TEXT3, fontFamily: "Georgia,serif", opacity: activePage === l.key ? 1 : .5 }}>{l.labelAr}</span>
                {activePage === l.key && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: 2, background: GOLD, borderRadius: 99 }}/>}
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setShowPlan(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: `1px solid ${GOLD_L}`, background: GOLD_L, color: GOLD, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
              <Calendar size={13}/> Plan Hifz
            </button>
            <button onClick={() => setShowQuran(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: `1px solid ${BORDER}`, background: TEAL_DIM, color: TEAL, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
              <BookMarked size={13}/> Coran · 114
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: TEAL, textTransform: "uppercase", marginBottom: 10, fontFamily: "system-ui" }}>
            {activePage === "memorisation" ? "أكاديمية الحفظ" : activePage === "sira" ? "السيرة النبوية" : activePage === "tafsir" ? "تفسير القرآن" : "تعلم العربية"}
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 700, color: TEXT1, fontFamily: "Georgia,serif", lineHeight: 1.2, margin: "0 0 8px" }}>
            {activePage === "memorisation" && <>Académie <span style={{ color: GOLD }}>Hifz</span> — الحفظ</>}
            {activePage === "sira"         && <>La Vie du Prophète <span style={{ color: GOLD }}>ﷺ</span></>}
            {activePage === "tafsir"       && <>Tafsīr <span style={{ color: GOLD }}>القرآن</span></>}
            {activePage === "arabic"       && <>Langue <span style={{ color: GOLD }}>Arabe</span> — العربية</>}
          </h1>
          <p style={{ color: TEXT3, fontSize: 13, lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
            {activePage === "memorisation" && "Comprendre · Écouter · Mémoriser · Réciter"}
            {activePage === "sira"         && "Un voyage spirituel à travers les événements fondateurs de l'Islam"}
            {activePage === "tafsir"       && "L'exégèse et la compréhension profonde du Saint Coran"}
            {activePage === "arabic"       && "Maîtrisez la langue du Coran pas à pas"}
          </p>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      {activePage !== "memorisation" ? (
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 18 }}>
            {activePage === "sira" ? "🌙" : activePage === "tafsir" ? "📖" : "✍️"}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia,serif", color: TEXT1, marginBottom: 8 }}>Module {activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
          <p style={{ color: TEXT3, fontFamily: "system-ui", fontSize: 14, marginBottom: 24 }}>Ce module arrive prochainement dans Safoua Academy.</p>
          <button onClick={() => setActivePage("memorisation")} style={darkBtn(TEAL)}>← Retour au Hifz</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 0, maxWidth: 1180, margin: "0 auto", padding: "24px 20px", alignItems: "start" }}>
          {/* SIDEBAR */}
          <aside style={{ paddingRight: 18, position: "sticky", top: 24 }}>
            <p style={{ fontSize: 9, fontFamily: "system-ui", color: TEXT3, letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Parcours</p>
            {lessons.map(l => {
              const act = l.id === lid;
              return (
                <button key={l.id} onClick={() => pickLesson(l.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, marginBottom: 3, border: act ? `1.5px solid ${TEAL}` : "1.5px solid transparent", background: act ? TEAL_DIM : "transparent", cursor: "pointer", transition: "all .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: 17 }}>{l.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: act ? TEAL : TEXT2, fontFamily: "system-ui" }}>{l.title}</div>
                      <div style={{ fontSize: 10, color: TEXT3, fontFamily: "system-ui", marginTop: 1 }}>{l.subtitle}</div>
                      {l.pronunciation && <div style={{ fontSize: 9, color: TEAL, fontFamily: "system-ui", marginTop: 1, fontStyle: "italic" }}>{l.pronunciation}</div>}
                    </div>
                  </div>
                </button>
              );
            })}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER2}`, display: "flex", flexDirection: "column", gap: 7 }}>
              <button onClick={() => setShowPlan(true)} style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "9px 11px", borderRadius: 10, border: `1.5px solid ${GOLD_L}`, background: GOLD_L, color: GOLD, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                <Calendar size={13}/> Plan de Mémorisation
              </button>
              <button onClick={() => setShowQuran(true)} style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "9px 11px", borderRadius: 10, border: `1.5px solid ${BORDER}`, background: TEAL_DIM, color: TEAL, fontFamily: "system-ui", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                <BookMarked size={13}/> Ouvrir le Coran
              </button>
            </div>
          </aside>

          {/* MAIN */}
          <main>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 3, marginBottom: 18, background: D3, borderRadius: 10, padding: 3, width: "fit-content", flexWrap: "wrap", border: `1px solid ${BORDER2}` }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "system-ui", fontWeight: 700, fontSize: 12, background: tab === t.key ? D5 : "transparent", color: tab === t.key ? TEAL : TEXT3, boxShadow: tab === t.key ? `0 0 0 1px ${BORDER}` : "none", transition: "all .15s" }}>{t.label}</button>
              ))}
            </div>

            {/* ══ LESSON TAB ══ */}
            {tab === "lesson" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="appear">
                <div style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "26px 30px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT1 }}>{lesson.title}</h2>
                      <p style={{ margin: "4px 0 0", fontSize: 20, color: TEAL, direction: "rtl", fontFamily: "Georgia,serif" }}>{lesson.arabic}</p>
                      {lesson.pronunciation && (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, background: TEAL_DIM, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "3px 12px" }}>
                          <span style={{ fontSize: 10, color: TEXT3, fontFamily: "system-ui" }}>🗣</span>
                          <span style={{ fontSize: 12, color: TEAL, fontFamily: "system-ui", fontStyle: "italic", fontWeight: 700 }}>{lesson.pronunciation}</span>
                        </div>
                      )}
                    </div>
                    {lesson.verses && (
                      <span style={{ fontSize: 10, fontFamily: "system-ui", fontWeight: 700, color: TEAL, border: `1.5px solid ${BORDER}`, background: TEAL_DIM, borderRadius: 20, padding: "3px 12px", letterSpacing: "0.08em", height: "fit-content" }}>{lesson.verses} VERSETS</span>
                    )}
                  </div>
                  <div style={{ borderLeft: `3px solid ${TEAL}`, paddingLeft: 16, marginBottom: 20, background: D4, borderRadius: "0 10px 10px 0", padding: "12px 18px" }}>
                    <p style={{ margin: 0, fontSize: 14, color: TEXT2, fontStyle: "italic", lineHeight: 1.7 }}>"{lesson.description}"</p>
                  </div>
                  <div style={{ color: TEXT2, lineHeight: 1.95, fontSize: 14 }}>
                    {lesson.lesson.split('\n').filter(Boolean).map((line, i) =>
                      line.startsWith('###')
                        ? <h3 key={i} style={{ fontSize: 14, fontWeight: 700, color: TEXT1, margin: "20px 0 7px", paddingBottom: 5, borderBottom: `1px solid ${BORDER2}` }}>{line.replace('### ', '')}</h3>
                        : <p key={i} style={{ margin: "0 0 10px", color: TEXT2 }}>{line}</p>
                    )}
                  </div>
                </div>

                {hasAud && audioSrc && (
                  <div style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "20px 26px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {reciters.map(r => (
                        <button key={r.id} onClick={() => setReciter(r.id)} style={{ padding: "6px 13px", borderRadius: 8, border: "1.5px solid", borderColor: reciter === r.id ? TEAL : "rgba(255,255,255,0.08)", background: reciter === r.id ? TEAL_DIM : "transparent", color: reciter === r.id ? TEAL : TEXT3, fontFamily: "system-ui", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all .15s" }}>{r.name}</button>
                      ))}
                    </div>
                    <AudioPlayer key={audioSrc} src={audioSrc} label={lesson.title} reciterName={rec.name}/>
                  </div>
                )}

                {hasAud && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { onClick: () => setShowVoicePractice(true), icon: <MessageCircle size={20} color={D1}/>, bg: TEAL, color: TEAL, bgDim: TEAL_DIM, title: "🎙️ Coach Vocal", desc: "Répétez les versets, l'IA corrige votre prononciation" },
                      { onClick: () => setShowVoiceQuiz(true), icon: <Brain size={20} color="white"/>, bg: BLUE, color: BLUE, bgDim: BLUE_DIM, title: "🧠 Quiz Vocal", desc: "Récitez de mémoire, testez votre Hifz" },
                    ].map((t, i) => (
                      <button key={i} onClick={t.onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px", borderRadius: 14, border: `1.5px solid ${t.bgDim}`, background: D3, cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 11, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 14px ${t.bg}30` }}>{t.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: t.color, fontFamily: "system-ui" }}>{t.title}</div>
                          <div style={{ fontSize: 11, color: TEXT3, fontFamily: "system-ui", marginTop: 2, lineHeight: 1.4 }}>{t.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <button onClick={() => setShowPlan(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderRadius: 14, border: `1.5px solid ${GOLD_L}`, background: D3, cursor: "pointer", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 14px ${GOLD}30` }}><Calendar size={20} color={D1}/></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: GOLD, fontFamily: "system-ui" }}>Plan de Mémorisation Personnalisé</div>
                      <div style={{ fontSize: 12, color: TEXT3, fontFamily: "system-ui", marginTop: 2 }}>Lent · Moyen · Rapide — Programme jour par jour pour tout le Coran</div>
                    </div>
                  </div>
                  <ChevronRight size={18} color={GOLD}/>
                </button>
              </div>
            )}

            {/* ══ QUIZ TAB ══ */}
            {tab === "quiz" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="appear">
                {qList.length > 0 ? (
                  <>
                    {qList.map((q, qi) => {
                      const sel = answers[q.id];
                      return (
                        <div key={q.id} style={{ background: D3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 26px" }}>
                          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                            <span style={{ width: 26, height: 26, borderRadius: "50%", background: TEAL_DIM, border: `1.5px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: TEAL, fontFamily: "system-ui", flexShrink: 0, marginTop: 2 }}>{qi+1}</span>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT1, lineHeight: 1.5, fontFamily: "system-ui" }}>{q.q}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                            {q.opts.map(opt => {
                              const isSel = sel === opt, isCorr = opt === q.ans;
                              let bg = D4, bdr = BORDER2, col = TEXT2, fw = 400;
                              if (isSel && !submitted) { bg = TEAL_DIM; bdr = TEAL; col = TEAL; fw = 700; }
                              if (submitted && isCorr) { bg = TEAL_DIM; bdr = TEAL; col = TEAL; fw = 700; }
                              if (submitted && isSel && !isCorr) { bg = RED_DIM; bdr = RED; col = RED; fw = 700; }
                              return (
                                <label key={opt} onClick={() => !submitted && setAnswers(a => ({...a,[q.id]:opt}))} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${bdr}`, background: bg, cursor: submitted ? "default" : "pointer", transition: "all .15s" }}>
                                  <span style={{ fontFamily: "system-ui", fontSize: 14, color: col, fontWeight: fw }}>{opt}</span>
                                  {submitted && isCorr && <CheckCircle size={16} color={TEAL}/>}
                                  {submitted && isSel && !isCorr && <XCircle size={16} color={RED}/>}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {!submitted ? (
                      <button onClick={() => setSubmitted(true)} style={{ width: "100%", padding: "14px", background: TEAL_DIM, color: TEAL, border: `1.5px solid ${TEAL}`, borderRadius: 12, fontFamily: "system-ui", fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: "0.04em" }}>
                        TERMINER LE TEST
                      </button>
                    ) : (
                      <div style={{ background: D3, border: `1.5px solid ${TEAL}`, borderRadius: 16, padding: "26px", textAlign: "center" }}>
                        <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
                        <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: TEXT1 }}>Résultat</h3>
                        <p style={{ color: TEXT3, fontFamily: "system-ui", margin: "0 0 22px", fontSize: 12 }}>{lesson.title}</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 22 }}>
                          {[["Score", `${score} / ${qList.length}`], ["Précision", `${Math.round(score/qList.length*100)}%`]].map(([lbl, val]) => (
                            <div key={lbl} style={{ background: D4, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 22px" }}>
                              <div style={{ fontSize: 9, fontFamily: "system-ui", fontWeight: 700, color: TEXT3, letterSpacing: "0.12em", marginBottom: 3 }}>{lbl}</div>
                              <div style={{ fontSize: 24, fontWeight: 900, color: TEAL, fontFamily: "system-ui" }}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => { setSubmitted(false); setAnswers({}); }} style={{ display: "inline-flex", alignItems: "center", gap: 7, ...darkBtn(TEAL, false) }}>
                          <RotateCcw size={13}/> Réessayer
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ background: D3, border: `1.5px dashed ${BORDER}`, borderRadius: 14, padding: "52px 28px", textAlign: "center" }}>
                    <h3 style={{ color: TEXT3, fontFamily: "system-ui", fontSize: 14 }}>Questions bientôt disponibles</h3>
                  </div>
                )}
              </div>
            )}

            {/* ══ VOICE PRACTICE TAB ══ */}
            {tab === "voice" && hasAud && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="appear">
                <div style={{ background: D3, border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: "22px 26px" }}>
                  <h3 style={{ margin: "0 0 5px", fontSize: 17, fontWeight: 700, color: TEAL, fontFamily: "Georgia,serif" }}>Pratique Vocale Interactive</h3>
                  <p style={{ margin: "0 0 18px", fontSize: 13, color: TEXT2, fontFamily: "system-ui", lineHeight: 1.6 }}>
                    Deux modes pour maîtriser la récitation de <strong style={{ color: TEXT1 }}>{lesson.title}</strong>
                    {lesson.pronunciation && <span style={{ color: TEAL }}> ({lesson.pronunciation})</span>} — tous les versets chargés depuis l'API.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { onClick: () => setShowVoicePractice(true), icon: <MessageCircle size={24} color={D1}/>, bg: TEAL, color: TEAL, bgDim: TEAL_DIM, title: "🎙️ Coach Vocal", desc: "L'IA écoute votre récitation et corrige votre prononciation en temps réel", btn: "Commencer →" },
                      { onClick: () => setShowVoiceQuiz(true), icon: <Brain size={24} color="white"/>, bg: BLUE, color: BLUE, bgDim: BLUE_DIM, title: "🧠 Quiz Vocal", desc: "Récitez les versets de mémoire sans texte, l'IA évalue votre Hifz", btn: "Commencer →" },
                    ].map((t, i) => (
                      <button key={i} onClick={t.onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "22px 18px", borderRadius: 14, border: `1.5px solid ${t.bgDim}`, background: D4, cursor: "pointer", gap: 9, textAlign: "center", transition: "all .15s" }}>
                        <div style={{ width: 52, height: 52, borderRadius: 13, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${t.bg}30` }}>{t.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: t.color, fontFamily: "system-ui" }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: TEXT3, fontFamily: "system-ui", lineHeight: 1.4 }}>{t.desc}</div>
                        <div style={{ background: t.bg, color: i===0?D1:"white", borderRadius: 8, padding: "7px 18px", fontFamily: "system-ui", fontWeight: 700, fontSize: 12, marginTop: 3, boxShadow: `0 2px 10px ${t.bg}30` }}>{t.btn}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ background: GOLD_L, border: `1px solid rgba(232,168,48,0.25)`, borderRadius: 12, padding: "13px 16px", display: "flex", gap: 9, alignItems: "flex-start" }}>
                  <AlertCircle size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 1 }}/>
                  <div style={{ fontFamily: "system-ui", fontSize: 12, color: GOLD, lineHeight: 1.6 }}>
                    La reconnaissance vocale arabe fonctionne mieux dans <strong>Chrome</strong> sur desktop.
                    Les tashkeel (voyelles) sont ignorés pour une évaluation plus juste.
                    La prononciation française 🔊 est chargée depuis votre base de données pour tous les 114 sourates.
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}