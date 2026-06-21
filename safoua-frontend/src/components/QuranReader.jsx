/**
 * components/QuranReader.jsx — Safoua Academy
 * Immersive standalone Quran reading experience.
 * Route: /quran
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";

/* ── ICONS ───────────────────────────────────────────────────── */
const Icon = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Play:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  ChevL:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Eye:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Book:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Volume: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  SkipB:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>,
  SkipF:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="4" x2="19" y2="20"/></svg>,
  Stop:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>,
  Star8:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l2.2 6.8L21 10l-6.8 2.2L12 19l-2.2-6.8L3 10l6.8-2.2z" transform="rotate(22.5 12 12)"/><path d="M12 1l2.2 6.8L21 10l-6.8 2.2L12 19l-2.2-6.8L3 10l6.8-2.2z"/></svg>,
};

/* ── PALETTE — "Illuminated Manuscript": deep ink-emerald ground,
   hand-burnished gold leaf, jade for translation, muted amethyst
   for pronunciation. Modeled on lacquered Quran bindings & old
   Maghrebi/Ottoman manuscript pages. ─────────────────────────── */
const P = {
  bg0:"#070f0c", bg1:"#0b1712", bg2:"#122019", bg3:"#182a21",
  ink1:"#f3ead2", ink2:"rgba(243,234,210,0.64)", ink3:"rgba(243,234,210,0.34)", ink4:"rgba(243,234,210,0.13)",
  gold:"#cda053", goldL:"#f0cf85", goldD:"#8a6a2e",
  goldBg:"rgba(205,160,83,0.09)", goldBr:"rgba(205,160,83,0.26)",
  teal:"#3fa085", tealL:"#5fc4a6",
  tealBg:"rgba(63,160,133,0.1)", tealBr:"rgba(63,160,133,0.26)",
  br1:"rgba(205,160,83,0.16)", br2:"rgba(243,234,210,0.07)",
  pur:"#b08fd6", purBg:"rgba(176,143,214,0.1)", purBr:"rgba(176,143,214,0.26)",
  vine:"rgba(205,160,83,0.5)",
};

/* Shared manuscript-style font stacks (Cormorant for Latin/numerals,
   system serif fallback keeps weight if the webfont hasn't loaded) */
const F_DISPLAY = "'Cormorant Garamond', Georgia, serif";
const F_UI = "'Inter', system-ui, sans-serif";

/* ── RECITERS ────────────────────────────────────────────────── */
const RECITERS = [
  { id:"mishari",    name:"Mishari Al-Afasy",  ar:"مشاري العفاسي", server:"https://server8.mp3quran.net/afs" },
  { id:"abdulbasit", name:"Abdul Basit",        ar:"عبد الباسط",    server:"https://server7.mp3quran.net/basit" },
  { id:"minshawi",   name:"Al-Minshawi",        ar:"المنشاوي",      server:"https://server13.mp3quran.net/minsh" },
  { id:"husary",     name:"Al-Husary",          ar:"الحصري",        server:"https://server13.mp3quran.net/husr" },
  { id:"ghamdi",     name:"Saad Al-Ghamidi",    ar:"سعد الغامدي",   server:"https://server7.mp3quran.net/s_gmd" },
];

/* ── JUZAA ───────────────────────────────────────────────────── */
const JUZAA = [
  {n:1,name:"الم",start:{s:1,v:1}},{n:2,name:"سيقول",start:{s:2,v:142}},{n:3,name:"تلك الرسل",start:{s:2,v:253}},
  {n:4,name:"لن تنالوا",start:{s:3,v:92}},{n:5,name:"والمحصنات",start:{s:4,v:24}},{n:6,name:"لا يحب الله",start:{s:4,v:148}},
  {n:7,name:"وإذا سمعوا",start:{s:5,v:82}},{n:8,name:"ولو أننا",start:{s:6,v:111}},{n:9,name:"قال الملأ",start:{s:7,v:88}},
  {n:10,name:"واعلموا",start:{s:8,v:41}},{n:11,name:"يعتذرون",start:{s:9,v:93}},{n:12,name:"وما من دابة",start:{s:11,v:6}},
  {n:13,name:"وما أبرئ",start:{s:12,v:53}},{n:14,name:"ربما",start:{s:15,v:1}},{n:15,name:"سبحان الذي",start:{s:17,v:1}},
  {n:16,name:"قال ألم",start:{s:18,v:75}},{n:17,name:"اقترب للناس",start:{s:21,v:1}},{n:18,name:"قد أفلح",start:{s:23,v:1}},
  {n:19,name:"وقال الذين",start:{s:25,v:20}},{n:20,name:"أمن خلق",start:{s:27,v:60}},{n:21,name:"اتل ما أوحي",start:{s:29,v:45}},
  {n:22,name:"ومن يقنت",start:{s:33,v:31}},{n:23,name:"وما لي",start:{s:36,v:27}},{n:24,name:"فمن أظلم",start:{s:39,v:32}},
  {n:25,name:"إليه يرد",start:{s:41,v:47}},{n:26,name:"حم",start:{s:46,v:1}},{n:27,name:"قال فما خطبكم",start:{s:51,v:31}},
  {n:28,name:"قد سمع الله",start:{s:58,v:1}},{n:29,name:"تبارك الذي",start:{s:67,v:1}},{n:30,name:"عم يتساءلون",start:{s:78,v:1}},
];

/* ── ALL 114 SURAHS ──────────────────────────────────────────── */
const ALL_SURAHS = [
  {n:1,ar:"الفاتحة",en:"Al-Fatiha",meaning:"L'Ouverture",verses:7,type:"Meccan",revelation:"مكية",juz:1,fr:"al-faa-ti-HA"},
  {n:2,ar:"البقرة",en:"Al-Baqarah",meaning:"La Vache",verses:286,type:"Medinan",revelation:"مدنية",juz:1,fr:"al-ba-QA-ra"},
  {n:3,ar:"آل عمران",en:"Al-Imran",meaning:"La Famille d'Imrân",verses:200,type:"Medinan",revelation:"مدنية",juz:3,fr:"a-li 'im-RAAN"},
  {n:4,ar:"النساء",en:"An-Nisa",meaning:"Les Femmes",verses:176,type:"Medinan",revelation:"مدنية",juz:4,fr:"an-ni-SAA"},
  {n:5,ar:"المائدة",en:"Al-Ma'idah",meaning:"La Table Servie",verses:120,type:"Medinan",revelation:"مدنية",juz:6,fr:"al-maa-'i-DA"},
  {n:6,ar:"الأنعام",en:"Al-An'am",meaning:"Les Bestiaux",verses:165,type:"Meccan",revelation:"مكية",juz:7,fr:"al-an-'AAM"},
  {n:7,ar:"الأعراف",en:"Al-A'raf",meaning:"Les Murailles",verses:206,type:"Meccan",revelation:"مكية",juz:8,fr:"al-a'-RAAF"},
  {n:8,ar:"الأنفال",en:"Al-Anfal",meaning:"Les Butins",verses:75,type:"Medinan",revelation:"مدنية",juz:9,fr:"al-an-FAAL"},
  {n:9,ar:"التوبة",en:"At-Tawbah",meaning:"Le Repentir",verses:129,type:"Medinan",revelation:"مدنية",juz:10,fr:"at-taw-BA"},
  {n:10,ar:"يونس",en:"Yunus",meaning:"Jonas",verses:109,type:"Meccan",revelation:"مكية",juz:11,fr:"YOU-nous"},
  {n:11,ar:"هود",en:"Hud",meaning:"Houd",verses:123,type:"Meccan",revelation:"مكية",juz:11,fr:"HOUD"},
  {n:12,ar:"يوسف",en:"Yusuf",meaning:"Joseph",verses:111,type:"Meccan",revelation:"مكية",juz:12,fr:"YOU-souf"},
  {n:13,ar:"الرعد",en:"Ar-Ra'd",meaning:"Le Tonnerre",verses:43,type:"Medinan",revelation:"مدنية",juz:13,fr:"ar-RA'd"},
  {n:14,ar:"إبراهيم",en:"Ibrahim",meaning:"Ibrahim",verses:52,type:"Meccan",revelation:"مكية",juz:13,fr:"ib-raa-HEEM"},
  {n:15,ar:"الحجر",en:"Al-Hijr",meaning:"Al-Hijr",verses:99,type:"Meccan",revelation:"مكية",juz:14,fr:"al-HIJR"},
  {n:16,ar:"النحل",en:"An-Nahl",meaning:"L'Abeille",verses:128,type:"Meccan",revelation:"مكية",juz:14,fr:"an-NAHL"},
  {n:17,ar:"الإسراء",en:"Al-Isra",meaning:"Le Voyage Nocturne",verses:111,type:"Meccan",revelation:"مكية",juz:15,fr:"al-is-RAA"},
  {n:18,ar:"الكهف",en:"Al-Kahf",meaning:"La Caverne",verses:110,type:"Meccan",revelation:"مكية",juz:15,fr:"al-KAHF"},
  {n:19,ar:"مريم",en:"Maryam",meaning:"Marie",verses:98,type:"Meccan",revelation:"مكية",juz:16,fr:"MAR-yam"},
  {n:20,ar:"طه",en:"Ta-Ha",meaning:"Tâ-Hâ",verses:135,type:"Meccan",revelation:"مكية",juz:16,fr:"TAA-HAA"},
  {n:21,ar:"الأنبياء",en:"Al-Anbiya",meaning:"Les Prophètes",verses:112,type:"Meccan",revelation:"مكية",juz:17,fr:"al-an-bi-YAA"},
  {n:22,ar:"الحج",en:"Al-Hajj",meaning:"Le Pèlerinage",verses:78,type:"Medinan",revelation:"مدنية",juz:17,fr:"al-HAJJ"},
  {n:23,ar:"المؤمنون",en:"Al-Mu'minun",meaning:"Les Croyants",verses:118,type:"Meccan",revelation:"مكية",juz:18,fr:"al-mou'-mi-NOUN"},
  {n:24,ar:"النور",en:"An-Nur",meaning:"La Lumière",verses:64,type:"Medinan",revelation:"مدنية",juz:18,fr:"an-NOUR"},
  {n:25,ar:"الفرقان",en:"Al-Furqan",meaning:"Le Discernement",verses:77,type:"Meccan",revelation:"مكية",juz:18,fr:"al-four-QAAN"},
  {n:26,ar:"الشعراء",en:"Ash-Shu'ara",meaning:"Les Poètes",verses:227,type:"Meccan",revelation:"مكية",juz:19,fr:"ach-chou-'a-RAA"},
  {n:27,ar:"النمل",en:"An-Naml",meaning:"La Fourmi",verses:93,type:"Meccan",revelation:"مكية",juz:19,fr:"an-NAML"},
  {n:28,ar:"القصص",en:"Al-Qasas",meaning:"Les Récits",verses:88,type:"Meccan",revelation:"مكية",juz:20,fr:"al-qa-SASS"},
  {n:29,ar:"العنكبوت",en:"Al-Ankabut",meaning:"L'Araignée",verses:69,type:"Meccan",revelation:"مكية",juz:20,fr:"al-'an-ka-BOUT"},
  {n:30,ar:"الروم",en:"Ar-Rum",meaning:"Les Romains",verses:60,type:"Meccan",revelation:"مكية",juz:21,fr:"ar-ROUM"},
  {n:31,ar:"لقمان",en:"Luqman",meaning:"Luqmân",verses:34,type:"Meccan",revelation:"مكية",juz:21,fr:"louk-MAAN"},
  {n:32,ar:"السجدة",en:"As-Sajdah",meaning:"La Prosternation",verses:30,type:"Meccan",revelation:"مكية",juz:21,fr:"as-saj-DA"},
  {n:33,ar:"الأحزاب",en:"Al-Ahzab",meaning:"Les Coalisés",verses:73,type:"Medinan",revelation:"مدنية",juz:21,fr:"al-ah-ZAAB"},
  {n:34,ar:"سبأ",en:"Saba",meaning:"Saba'",verses:54,type:"Meccan",revelation:"مكية",juz:22,fr:"sa-BA"},
  {n:35,ar:"فاطر",en:"Fatir",meaning:"Le Créateur",verses:45,type:"Meccan",revelation:"مكية",juz:22,fr:"FAA-tir"},
  {n:36,ar:"يس",en:"Ya-Sin",meaning:"Yâ-Sîn",verses:83,type:"Meccan",revelation:"مكية",juz:22,fr:"YAA-SEEN"},
  {n:37,ar:"الصافات",en:"As-Saffat",meaning:"Ceux qui font des rangs",verses:182,type:"Meccan",revelation:"مكية",juz:23,fr:"as-saa-FAAT"},
  {n:38,ar:"ص",en:"Sad",meaning:"La Lettre Sâd",verses:88,type:"Meccan",revelation:"مكية",juz:23,fr:"SAAD"},
  {n:39,ar:"الزمر",en:"Az-Zumar",meaning:"Les Groupes",verses:75,type:"Meccan",revelation:"مكية",juz:23,fr:"az-ZOU-mar"},
  {n:40,ar:"غافر",en:"Ghafir",meaning:"Le Pardonneur",verses:85,type:"Meccan",revelation:"مكية",juz:24,fr:"GHAA-fir"},
  {n:41,ar:"فصلت",en:"Fussilat",meaning:"Détaillés",verses:54,type:"Meccan",revelation:"مكية",juz:24,fr:"fouss-si-LAT"},
  {n:42,ar:"الشورى",en:"Ash-Shura",meaning:"La Consultation",verses:53,type:"Meccan",revelation:"مكية",juz:25,fr:"ach-CHOU-raa"},
  {n:43,ar:"الزخرف",en:"Az-Zukhruf",meaning:"Les Ornements d'or",verses:89,type:"Meccan",revelation:"مكية",juz:25,fr:"az-ZOUKHROUF"},
  {n:44,ar:"الدخان",en:"Ad-Dukhan",meaning:"La Fumée",verses:59,type:"Meccan",revelation:"مكية",juz:25,fr:"ad-dou-KHAAN"},
  {n:45,ar:"الجاثية",en:"Al-Jathiyah",meaning:"L'Agenouillée",verses:37,type:"Meccan",revelation:"مكية",juz:25,fr:"al-jaa-thi-YA"},
  {n:46,ar:"الأحقاف",en:"Al-Ahqaf",meaning:"Les Dunes",verses:35,type:"Meccan",revelation:"مكية",juz:26,fr:"al-ah-QAAF"},
  {n:47,ar:"محمد",en:"Muhammad",meaning:"Muhammad",verses:38,type:"Medinan",revelation:"مدنية",juz:26,fr:"mo-HAM-mad"},
  {n:48,ar:"الفتح",en:"Al-Fath",meaning:"La Victoire",verses:29,type:"Medinan",revelation:"مدنية",juz:26,fr:"al-FATH"},
  {n:49,ar:"الحجرات",en:"Al-Hujurat",meaning:"Les Appartements",verses:18,type:"Medinan",revelation:"مدنية",juz:26,fr:"al-hou-jou-RAAT"},
  {n:50,ar:"ق",en:"Qaf",meaning:"La Lettre Qâf",verses:45,type:"Meccan",revelation:"مكية",juz:26,fr:"QAAF"},
  {n:51,ar:"الذاريات",en:"Adh-Dhariyat",meaning:"Les Vents Dispersants",verses:60,type:"Meccan",revelation:"مكية",juz:26,fr:"adh-dhaa-ri-YAAT"},
  {n:52,ar:"الطور",en:"At-Tur",meaning:"Le Mont",verses:49,type:"Meccan",revelation:"مكية",juz:27,fr:"at-TOUR"},
  {n:53,ar:"النجم",en:"An-Najm",meaning:"L'Étoile",verses:62,type:"Meccan",revelation:"مكية",juz:27,fr:"an-NAJM"},
  {n:54,ar:"القمر",en:"Al-Qamar",meaning:"La Lune",verses:55,type:"Meccan",revelation:"مكية",juz:27,fr:"al-QA-mar"},
  {n:55,ar:"الرحمن",en:"Ar-Rahman",meaning:"Le Miséricordieux",verses:78,type:"Medinan",revelation:"مدنية",juz:27,fr:"ar-rah-MAAN"},
  {n:56,ar:"الواقعة",en:"Al-Waqi'ah",meaning:"L'Événement",verses:96,type:"Meccan",revelation:"مكية",juz:27,fr:"al-waa-qi-'A"},
  {n:57,ar:"الحديد",en:"Al-Hadid",meaning:"Le Fer",verses:29,type:"Medinan",revelation:"مدنية",juz:27,fr:"al-ha-DEED"},
  {n:58,ar:"المجادلة",en:"Al-Mujadila",meaning:"La Femme qui plaide",verses:22,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-mou-jaa-di-LA"},
  {n:59,ar:"الحشر",en:"Al-Hashr",meaning:"Le Rassemblement",verses:24,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-HACHR"},
  {n:60,ar:"الممتحنة",en:"Al-Mumtahanah",meaning:"L'Éprouvée",verses:13,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-moum-ta-HA-na"},
  {n:61,ar:"الصف",en:"As-Saf",meaning:"Les Rangs",verses:14,type:"Medinan",revelation:"مدنية",juz:28,fr:"as-SAFF"},
  {n:62,ar:"الجمعة",en:"Al-Jumu'ah",meaning:"Le Vendredi",verses:11,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-jou-MOU-'a"},
  {n:63,ar:"المنافقون",en:"Al-Munafiqun",meaning:"Les Hypocrites",verses:11,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-mou-naa-fi-QOUN"},
  {n:64,ar:"التغابن",en:"At-Taghabun",meaning:"La Déception réciproque",verses:18,type:"Medinan",revelation:"مدنية",juz:28,fr:"at-ta-GHAA-boun"},
  {n:65,ar:"الطلاق",en:"At-Talaq",meaning:"Le Divorce",verses:12,type:"Medinan",revelation:"مدنية",juz:28,fr:"at-ta-LAAQ"},
  {n:66,ar:"التحريم",en:"At-Tahrim",meaning:"L'Interdiction",verses:12,type:"Medinan",revelation:"مدنية",juz:28,fr:"at-tah-REEM"},
  {n:67,ar:"الملك",en:"Al-Mulk",meaning:"La Royauté",verses:30,type:"Meccan",revelation:"مكية",juz:29,fr:"al-MOULK"},
  {n:68,ar:"القلم",en:"Al-Qalam",meaning:"Le Calame",verses:52,type:"Meccan",revelation:"مكية",juz:29,fr:"al-QA-lam"},
  {n:69,ar:"الحاقة",en:"Al-Haqqah",meaning:"La Vérité inéluctable",verses:52,type:"Meccan",revelation:"مكية",juz:29,fr:"al-haaq-QA"},
  {n:70,ar:"المعارج",en:"Al-Ma'arij",meaning:"Les Voies d'ascension",verses:44,type:"Meccan",revelation:"مكية",juz:29,fr:"al-ma-'AA-rij"},
  {n:71,ar:"نوح",en:"Nuh",meaning:"Noé",verses:28,type:"Meccan",revelation:"مكية",juz:29,fr:"NOUH"},
  {n:72,ar:"الجن",en:"Al-Jinn",meaning:"Les Djinns",verses:28,type:"Meccan",revelation:"مكية",juz:29,fr:"al-JINN"},
  {n:73,ar:"المزمل",en:"Al-Muzzammil",meaning:"L'Enveloppé",verses:20,type:"Meccan",revelation:"مكية",juz:29,fr:"al-mouz-ZAM-mil"},
  {n:74,ar:"المدثر",en:"Al-Muddaththir",meaning:"Le Revêtu",verses:56,type:"Meccan",revelation:"مكية",juz:29,fr:"al-mou-DATH-thir"},
  {n:75,ar:"القيامة",en:"Al-Qiyamah",meaning:"La Résurrection",verses:40,type:"Meccan",revelation:"مكية",juz:29,fr:"al-qi-YAA-ma"},
  {n:76,ar:"الإنسان",en:"Al-Insan",meaning:"L'Homme",verses:31,type:"Medinan",revelation:"مدنية",juz:29,fr:"al-in-SAAN"},
  {n:77,ar:"المرسلات",en:"Al-Mursalat",meaning:"Les Envoyés",verses:50,type:"Meccan",revelation:"مكية",juz:29,fr:"al-mour-sa-LAAT"},
  {n:78,ar:"النبأ",en:"An-Naba",meaning:"La Nouvelle",verses:40,type:"Meccan",revelation:"مكية",juz:30,fr:"an-NA-ba"},
  {n:79,ar:"النازعات",en:"An-Nazi'at",meaning:"Ceux qui arrachent",verses:46,type:"Meccan",revelation:"مكية",juz:30,fr:"an-naa-zi-'AAT"},
  {n:80,ar:"عبس",en:"Abasa",meaning:"Il s'est renfrogné",verses:42,type:"Meccan",revelation:"مكية",juz:30,fr:"'a-BA-sa"},
  {n:81,ar:"التكوير",en:"At-Takwir",meaning:"L'Enroulement",verses:29,type:"Meccan",revelation:"مكية",juz:30,fr:"at-tak-WEER"},
  {n:82,ar:"الانفطار",en:"Al-Infitar",meaning:"La Déchirure",verses:19,type:"Meccan",revelation:"مكية",juz:30,fr:"al-in-fi-TAAR"},
  {n:83,ar:"المطففين",en:"Al-Mutaffifin",meaning:"Les Fraudeurs",verses:36,type:"Meccan",revelation:"مكية",juz:30,fr:"al-mou-taf-fi-FEEN"},
  {n:84,ar:"الانشقاق",en:"Al-Inshiqaq",meaning:"La Fissuration",verses:25,type:"Meccan",revelation:"مكية",juz:30,fr:"al-inch-qi-QAAQ"},
  {n:85,ar:"البروج",en:"Al-Buruj",meaning:"Les Constellations",verses:22,type:"Meccan",revelation:"مكية",juz:30,fr:"al-bou-ROUJ"},
  {n:86,ar:"الطارق",en:"At-Tariq",meaning:"L'Astre nocturne",verses:17,type:"Meccan",revelation:"مكية",juz:30,fr:"at-TAA-riq"},
  {n:87,ar:"الأعلى",en:"Al-A'la",meaning:"Le Très-Haut",verses:19,type:"Meccan",revelation:"مكية",juz:30,fr:"al-a'-LAA"},
  {n:88,ar:"الغاشية",en:"Al-Ghashiyah",meaning:"L'Enveloppante",verses:26,type:"Meccan",revelation:"مكية",juz:30,fr:"al-ghaa-chi-YA"},
  {n:89,ar:"الفجر",en:"Al-Fajr",meaning:"L'Aube",verses:30,type:"Meccan",revelation:"مكية",juz:30,fr:"al-FAJR"},
  {n:90,ar:"البلد",en:"Al-Balad",meaning:"La Cité",verses:20,type:"Meccan",revelation:"مكية",juz:30,fr:"al-BA-lad"},
  {n:91,ar:"الشمس",en:"Ash-Shams",meaning:"Le Soleil",verses:15,type:"Meccan",revelation:"مكية",juz:30,fr:"ach-CHAMS"},
  {n:92,ar:"الليل",en:"Al-Layl",meaning:"La Nuit",verses:21,type:"Meccan",revelation:"مكية",juz:30,fr:"al-LAYL"},
  {n:93,ar:"الضحى",en:"Ad-Duha",meaning:"Le Matin",verses:11,type:"Meccan",revelation:"مكية",juz:30,fr:"ad-dou-HAA"},
  {n:94,ar:"الشرح",en:"Ash-Sharh",meaning:"L'Expansion",verses:8,type:"Meccan",revelation:"مكية",juz:30,fr:"ach-CHARH"},
  {n:95,ar:"التين",en:"At-Tin",meaning:"Le Figuier",verses:8,type:"Meccan",revelation:"مكية",juz:30,fr:"at-TEEN"},
  {n:96,ar:"العلق",en:"Al-Alaq",meaning:"L'Adhérence",verses:19,type:"Meccan",revelation:"مكية",juz:30,fr:"al-'a-LAQ"},
  {n:97,ar:"القدر",en:"Al-Qadr",meaning:"La Nuit du Destin",verses:5,type:"Meccan",revelation:"مكية",juz:30,fr:"al-QA-dr"},
  {n:98,ar:"البينة",en:"Al-Bayyinah",meaning:"La Preuve évidente",verses:8,type:"Medinan",revelation:"مدنية",juz:30,fr:"al-bay-yi-NA"},
  {n:99,ar:"الزلزلة",en:"Az-Zalzalah",meaning:"Le Tremblement de terre",verses:8,type:"Medinan",revelation:"مدنية",juz:30,fr:"az-zal-ZA-la"},
  {n:100,ar:"العاديات",en:"Al-Adiyat",meaning:"Les Coursiers",verses:11,type:"Meccan",revelation:"مكية",juz:30,fr:"al-'aa-di-YAAT"},
  {n:101,ar:"القارعة",en:"Al-Qari'ah",meaning:"La Calamité",verses:11,type:"Meccan",revelation:"مكية",juz:30,fr:"al-qaa-ri-'A"},
  {n:102,ar:"التكاثر",en:"At-Takathur",meaning:"La Course aux richesses",verses:8,type:"Meccan",revelation:"مكية",juz:30,fr:"at-ta-KA-thour"},
  {n:103,ar:"العصر",en:"Al-Asr",meaning:"Le Temps",verses:3,type:"Meccan",revelation:"مكية",juz:30,fr:"al-'ASR"},
  {n:104,ar:"الهمزة",en:"Al-Humazah",meaning:"Le Calomniateur",verses:9,type:"Meccan",revelation:"مكية",juz:30,fr:"al-hou-MA-za"},
  {n:105,ar:"الفيل",en:"Al-Fil",meaning:"L'Éléphant",verses:5,type:"Meccan",revelation:"مكية",juz:30,fr:"al-FEEL"},
  {n:106,ar:"قريش",en:"Quraysh",meaning:"Quraysh",verses:4,type:"Meccan",revelation:"مكية",juz:30,fr:"qou-RAYCHE"},
  {n:107,ar:"الماعون",en:"Al-Ma'un",meaning:"Les Ustensiles",verses:7,type:"Meccan",revelation:"مكية",juz:30,fr:"al-maa-'OUN"},
  {n:108,ar:"الكوثر",en:"Al-Kawthar",meaning:"L'Abondance",verses:3,type:"Meccan",revelation:"مكية",juz:30,fr:"al-KAW-thar"},
  {n:109,ar:"الكافرون",en:"Al-Kafirun",meaning:"Les Infidèles",verses:6,type:"Meccan",revelation:"مكية",juz:30,fr:"al-kaa-fi-ROUN"},
  {n:110,ar:"النصر",en:"An-Nasr",meaning:"Le Secours",verses:3,type:"Medinan",revelation:"مدنية",juz:30,fr:"an-NASR"},
  {n:111,ar:"المسد",en:"Al-Masad",meaning:"Les Fibres",verses:5,type:"Meccan",revelation:"مكية",juz:30,fr:"al-MA-sad"},
  {n:112,ar:"الإخلاص",en:"Al-Ikhlas",meaning:"Le Monothéisme pur",verses:4,type:"Meccan",revelation:"مكية",juz:30,fr:"al-ikh-LAAS"},
  {n:113,ar:"الفلق",en:"Al-Falaq",meaning:"L'Aube",verses:5,type:"Meccan",revelation:"مكية",juz:30,fr:"al-FA-laq"},
  {n:114,ar:"الناس",en:"An-Nas",meaning:"Les Hommes",verses:6,type:"Meccan",revelation:"مكية",juz:30,fr:"an-NAAS"},
];

const NO_BASMALA = new Set([1, 9]);
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function stripDiac(s) {
  return s.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g,"")
          .replace(/\u0640/g,"").trim();
}
function isBasmala(txt) {
  return stripDiac(txt).replace(/\s+/g," ").trim() === "بسم الله الرحمن الرحيم";
}

/* ── PRONUNCIATION CACHE + HOOK ──────────────────────────────── */
const pronCache = {};
async function fetchPronunciations(surahNumber) {
  if (pronCache[surahNumber]) return pronCache[surahNumber];
  try {
    const res = await fetch(`${API_BASE}/api/pronunciations/${surahNumber}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    pronCache[surahNumber] = Array.isArray(data.verses) ? data.verses : [];
  } catch (err) {
    console.warn(`Could not load pronunciations for surah ${surahNumber}:`, err.message);
    pronCache[surahNumber] = [];
  }
  return pronCache[surahNumber];
}

function usePronunciations(surahNumber) {
  const [pronunciations, setPronunciations] = useState([]);
  const [loadingPron, setLoadingPron] = useState(false);
  useEffect(() => {
    if (!surahNumber) { setPronunciations([]); return; }
    setLoadingPron(true);
    fetchPronunciations(surahNumber).then(v => { setPronunciations(v); setLoadingPron(false); });
  }, [surahNumber]);
  return { pronunciations, loadingPron };
}

/* ── AUDIO HOOK ──────────────────────────────────────────────── */
function useAudio(src) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const a = new Audio();
    ref.current = a;
    if (src) { a.src = src; setPlaying(false); setTime(0); setDur(0); }
    const onMeta  = () => { setDur(a.duration || 0); setLoading(false); };
    const onTime  = () => setTime(a.currentTime);
    const onEnd   = () => { setPlaying(false); setTime(0); };
    const onWait  = () => setLoading(true);
    const onPlay  = () => { setLoading(false); setPlaying(true); };
    const onPause = () => setPlaying(false);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    a.addEventListener("waiting", onWait);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.pause();
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("waiting", onWait);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [src]);

  const toggle = useCallback(() => {
    if (!ref.current) return;
    if (playing) ref.current.pause();
    else { setLoading(true); ref.current.play().catch(() => setLoading(false)); }
  }, [playing]);

  const seek = useCallback((t) => {
    if (!ref.current) return;
    ref.current.currentTime = Math.max(0, Math.min(t, dur || 9999));
    setTime(ref.current.currentTime);
  }, [dur]);

  const skip = useCallback((delta) => {
    if (!ref.current) return;
    ref.current.currentTime = Math.max(0, Math.min(ref.current.currentTime + delta, dur || 9999));
    setTime(ref.current.currentTime);
  }, [dur]);

  const stop = useCallback(() => {
    if (!ref.current) return;
    ref.current.pause(); ref.current.currentTime = 0;
    setPlaying(false); setTime(0);
  }, []);

  return { playing, time, dur, loading, toggle, seek, skip, stop };
}

/* ── FULL AUDIO PLAYER ───────────────────────────────────────── */
function AudioPlayer({ src, reciterName }) {
  const { playing, time, dur, loading, toggle, seek, skip, stop } = useAudio(src);
  const pct = dur > 0 ? (time / dur) * 100 : 0;
  const fmt = s => isFinite(s) && s > 0 ? `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}` : "0:00";

  const handleBar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * (dur || 0));
  };

  const ctrlStyle = (accent) => ({
    display:"flex", alignItems:"center", justifyContent:"center",
    width:31, height:31, borderRadius:5, cursor:"pointer", border:"none",
    background:"rgba(205,160,83,0.06)", color: accent || P.ink3,
    transition:"all .15s", flexShrink:0,
  });

  const skipLabelStyle = {
    fontSize:9, fontWeight:700, fontFamily:F_UI, lineHeight:1, letterSpacing:"0.03em"
  };

  return (
    <div style={{
      background:`linear-gradient(135deg, rgba(205,160,83,0.07), rgba(63,160,133,0.03))`,
      border:`1px solid ${P.br1}`, borderRadius:4,
      padding:"15px 17px", position:"relative",
    }}>
      {/* corner brackets — manuscript frame detail */}
      {["0px,0px","auto,0px","0px,auto","auto,auto"].map((pos,i) => {
        const [l,t] = pos.split(",");
        return (
          <svg key={i} width="9" height="9" viewBox="0 0 9 9" style={{
            position:"absolute",
            top: t==="0px" ? 4 : "auto", bottom: t==="auto" ? 4 : "auto",
            left: l==="0px" ? 4 : "auto", right: l==="auto" ? 4 : "auto",
            transform: i===1?"scaleX(-1)":i===2?"scaleY(-1)":i===3?"scale(-1,-1)":"none",
          }}>
            <path d="M0.5 0.5 L0.5 8.5 M0.5 0.5 L8.5 0.5" fill="none" stroke={P.goldBr} strokeWidth="1"/>
          </svg>
        );
      })}
      {/* Reciter name + live indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:11 }}>
        <div style={{
          width:6, height:6, borderRadius:"50%",
          background: playing ? P.gold : P.ink4,
          boxShadow: playing ? `0 0 8px ${P.gold}` : "none",
          transition:"all .3s", flexShrink:0
        }}/>
        <Icon.Volume/>
        <span style={{ fontSize:10, color: playing ? P.gold : P.ink3, fontFamily:F_UI, fontWeight:600, letterSpacing:"0.12em" }}>
          {(reciterName || "RÉCITATION").toUpperCase()}
        </span>
        {playing && (
          <div style={{ marginLeft:"auto", display:"flex", gap:2, alignItems:"flex-end", height:14 }}>
            {[4,7,10,13,10,7,4,7,10,13,10,7,4].map((h,i) => (
              <div key={i} style={{
                width:2, height:h, borderRadius:99, background:P.gold,
                opacity:0.3+(h/13)*0.6,
                animation:`wave ${0.4+i*0.06}s ease-in-out infinite alternate`
              }}/>
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div
        onClick={handleBar}
        style={{ position:"relative", height:4, borderRadius:99, background:P.ink4, cursor:"pointer", marginBottom:13 }}
      >
        <div style={{
          position:"absolute", left:0, top:0, height:"100%",
          width:`${pct}%`,
          background:`linear-gradient(90deg,${P.goldD},${P.gold},${P.goldL})`,
          borderRadius:99, transition:"width .1s",
          boxShadow:`0 0 8px ${P.gold}50`
        }}/>
        <div style={{
          position:"absolute", top:"50%", left:`${pct}%`,
          width:12, height:12, borderRadius:"50%",
          background:P.gold, border:`2px solid ${P.bg0}`,
          transform:"translate(-50%,-50%)",
          boxShadow:`0 0 8px ${P.gold}80`,
          transition:"left .1s", cursor:"grab"
        }}/>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {/* −30s */}
        <button onClick={() => skip(-30)} style={ctrlStyle(P.ink3)} title="-30s">
          <Icon.SkipB/>
        </button>

        {/* −10s */}
        <button onClick={() => skip(-10)} style={ctrlStyle(P.ink2)} title="-10s">
          <span style={skipLabelStyle}>−10</span>
        </button>

        {/* −5s */}
        <button onClick={() => skip(-5)} style={{
          ...ctrlStyle(P.gold),
          background:"rgba(205,160,83,0.1)",
          border:`1px solid rgba(205,160,83,0.22)`,
          width:35, height:35, borderRadius:6,
        }} title="-5s">
          <span style={{...skipLabelStyle, color:P.gold}}>−5</span>
        </button>

        {/* Play/Pause — primary button */}
        <button onClick={toggle} style={{
          width:43, height:43, borderRadius:"50%",
          background: playing ? P.goldBg : `linear-gradient(155deg, ${P.goldL}, ${P.gold} 60%, ${P.goldD})`,
          border:`2px solid ${P.gold}`,
          color: playing ? P.gold : P.bg0,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0, transition:"all .2s",
          boxShadow: playing ? `0 0 20px ${P.gold}50` : `0 3px 14px ${P.gold}45`,
          margin:"0 4px",
        }}>
          {loading
            ? <div style={{width:14,height:14,border:`2px solid currentColor`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
            : playing ? <Icon.Pause/> : <Icon.Play/>}
        </button>

        {/* +5s */}
        <button onClick={() => skip(5)} style={{
          ...ctrlStyle(P.gold),
          background:"rgba(205,160,83,0.1)",
          border:`1px solid rgba(205,160,83,0.22)`,
          width:35, height:35, borderRadius:6,
        }} title="+5s">
          <span style={{...skipLabelStyle, color:P.gold}}>+5</span>
        </button>

        {/* +10s */}
        <button onClick={() => skip(10)} style={ctrlStyle(P.ink2)} title="+10s">
          <span style={skipLabelStyle}>+10</span>
        </button>

        {/* +30s */}
        <button onClick={() => skip(30)} style={ctrlStyle(P.ink3)} title="+30s">
          <Icon.SkipF/>
        </button>

        {/* Stop */}
        <button onClick={stop} style={{
          ...ctrlStyle("#c86450"),
          background:"rgba(200,80,60,0.08)",
          marginLeft:"auto",
        }} title="Stop">
          <Icon.Stop/>
        </button>

        {/* Time */}
        <span style={{
          fontSize:11, color:P.ink3, fontFamily:"monospace",
          whiteSpace:"nowrap", letterSpacing:"0.04em"
        }}>
          {fmt(time)} / {fmt(dur)}
        </span>
      </div>
    </div>
  );
}

/* ── ORNAMENTAL DIVIDER — eight-point manuscript star (rub el hizb),
   the signature motif repeated throughout the reader ────────── */
function OrnamentDivider({ color = P.goldBr }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"6px 0" }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,${color})` }}/>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
        <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" strokeLinejoin="round"/>
        <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" transform="rotate(45 12 12)" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="1.4" fill={color}/>
      </svg>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${color},transparent)` }}/>
    </div>
  );
}

/* ── MAIN COMPONENT ──────────────────────────────────────────── */
export default function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses,        setVerses]        = useState(null);
  const [basmala,       setBasmala]       = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [reciter,       setReciter]       = useState("mishari");
  const [search,        setSearch]        = useState("");
  const [sidebarTab,    setSidebarTab]    = useState("surahs");
  const [showAllPron,   setShowAllPron]   = useState(false);
  const [showAllTrans,  setShowAllTrans]  = useState(false);
  const [bookmarks,     setBookmarks]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("qr_bookmarks") || "[]"); } catch { return []; }
  });
  const [highlightedVerse, setHighlightedVerse] = useState(null);
  const [fontSize, setFontSize] = useState(26);
  const contentRef = useRef(null);

  const { pronunciations, loadingPron } = usePronunciations(selectedSurah?.n);
  const hasPron = pronunciations.length > 0;

  const rec = RECITERS.find(r => r.id === reciter) || RECITERS[0];
  const audioSrc = selectedSurah ? `${rec.server}/${String(selectedSurah.n).padStart(3,"0")}.mp3` : null;

  const filteredSurahs = ALL_SURAHS.filter(s =>
    s.en.toLowerCase().includes(search.toLowerCase()) ||
    s.ar.includes(search) ||
    s.meaning.toLowerCase().includes(search.toLowerCase()) ||
    (s.fr && s.fr.toLowerCase().includes(search.toLowerCase())) ||
    String(s.n).includes(search)
  );

  async function loadSurah(surah) {
    setSelectedSurah(surah);
    setVerses(null); setBasmala(null);
    setHighlightedVerse(null);
    setShowAllPron(false); setShowAllTrans(false);
    setLoading(true);
    if (contentRef.current) contentRef.current.scrollTop = 0;
    try {
      const [arRes, frRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.n}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.n}/fr.hamidullah`),
      ]);
      const [arData, frData] = await Promise.all([arRes.json(), frRes.json()]);
      if (arData.code === 200) {
        const raw = arData.data.ayahs;
        const frRaw = frData.data?.ayahs || [];
        let bas = null, mainVerses = raw;
        if (!NO_BASMALA.has(surah.n) && raw.length > 0 && isBasmala(raw[0].text)) {
          bas = { ar: raw[0].text, num: raw[0].numberInSurah };
          mainVerses = raw.slice(1);
        }
        setBasmala(bas);
        setVerses(mainVerses.map((v, i) => ({
          ar: v.text, num: v.numberInSurah,
          fr: frRaw[bas ? i+1 : i]?.text || ""
        })));
      }
    } catch(e) {
      setVerses([{ ar: "تعذّر تحميل الآيات", num:1, fr:"Impossible de charger les versets." }]);
    }
    setLoading(false);
  }

  function toggleBookmark(surahN, verseNum) {
    const key = `${surahN}:${verseNum}`;
    const next = bookmarks.includes(key)
      ? bookmarks.filter(b => b !== key)
      : [...bookmarks, key];
    setBookmarks(next);
    try { localStorage.setItem("qr_bookmarks", JSON.stringify(next)); } catch {}
  }

  function isBookmarked(surahN, verseNum) {
    return bookmarks.includes(`${surahN}:${verseNum}`);
  }

  /* ── VERSE NUMBER — traditional ayah-end star marker ─────── */
  const VerseNumber = ({ n }) => (
    <div style={{ width:32, height:32, flexShrink:0, position:"relative" }}>
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ position:"absolute", inset:0 }}>
        <path d="M16 2l3 11 11 3-11 3-3 11-3-11-11-3 11-3z" fill={P.goldBg} stroke={P.gold} strokeWidth="1" strokeLinejoin="round"/>
      </svg>
      <div style={{
        position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:F_UI, fontSize:11, color:P.gold, fontWeight:700, lineHeight:1,
      }}>{n}</div>
    </div>
  );

  /* ── VERSE CARD — per-verse PRON. + EXPL. toggles ────────── */
  function VerseCard({ verse, index, globalPron, globalTrans }) {
    const [localPron,  setLocalPron]  = useState(false);
    const [localTrans, setLocalTrans] = useState(false);

    // Sync when global toggles change
    useEffect(() => { setLocalPron(globalPron);   }, [globalPron]);
    useEffect(() => { setLocalTrans(globalTrans);  }, [globalTrans]);

    const pronunciation = pronunciations[index] || null;
    const bk = isBookmarked(selectedSurah.n, verse.num);
    const hl = highlightedVerse === verse.num;

    const toggleBtnStyle = (on, color, bgColor, borderColor) => ({
      display:"inline-flex", alignItems:"center", gap:4,
      padding:"2px 9px", borderRadius:4, cursor:"pointer",
      border:`1px solid ${on ? borderColor : "rgba(243,234,210,0.12)"}`,
      background: on ? bgColor : "transparent",
      color: on ? color : P.ink3,
      fontFamily:F_UI, fontSize:10, fontWeight:600,
      transition:"all .2s",
    });

    const pillStyle = (color, bgColor, borderColor) => ({
      fontSize:12, color, fontFamily:F_UI,
      fontStyle:"italic", fontWeight:500,
      background:bgColor, border:`1px solid ${borderColor}`,
      borderRadius:4, padding:"2px 10px",
      animation:"fadeUp .15s ease both",
    });

    return (
      <div className="verse-row" style={{
        padding:"17px 0", borderBottom:`1px solid ${P.br2}`,
        background: hl ? P.goldBg : "transparent",
        borderRadius: hl ? 4 : 0, transition:"background .2s",
        animation:`fadeUp .3s ease ${index*0.018}s both`
      }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
          <VerseNumber n={verse.num}/>

          <div style={{ flex:1 }}>
            {/* Arabic text */}
            <p style={{
              direction:"rtl", fontFamily:"'Amiri', 'Cormorant Garamond', serif",
              fontSize:fontSize, color:P.ink1, lineHeight:2.15,
              margin:"0 0 10px", letterSpacing:"0.01em"
            }}>{verse.ar}</p>

            {/* Toggle buttons row — PRON. and EXPL. side by side */}
            <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", marginBottom:6 }}>

              {/* PRON. toggle — purple */}
              {pronunciation && (
                <>
                  <button
                    onClick={() => setLocalPron(v => !v)}
                    style={toggleBtnStyle(localPron, P.pur, P.purBg, P.purBr)}
                  >
                    {localPron ? <Icon.Eye/> : <Icon.EyeOff/>} PRON.
                  </button>
                  {localPron && (
                    <span style={pillStyle(P.pur, P.purBg, P.purBr)}>
                      {pronunciation}
                    </span>
                  )}
                </>
              )}

              {/* EXPL. toggle — teal, same pill pattern */}
              {verse.fr && (
                <button
                  onClick={() => setLocalTrans(v => !v)}
                  style={toggleBtnStyle(localTrans, P.teal, P.tealBg, P.tealBr)}
                >
                  {localTrans ? <Icon.Eye/> : <Icon.EyeOff/>} TRAD.
                </button>
              )}
            </div>

            {/* Translation panel — slides in under the button row */}
            {localTrans && verse.fr && (
              <div style={{
                background:P.tealBg, border:`1px solid ${P.tealBr}`,
                borderRadius:4, padding:"9px 13px", marginTop:4,
                animation:"fadeUp .18s ease both"
              }}>
                <div style={{
                  fontSize:9, fontFamily:F_UI, fontWeight:700,
                  color:P.tealL, letterSpacing:"0.13em", marginBottom:4
                }}>TRADUCTION</div>
                <span style={{
                  fontFamily:F_DISPLAY, fontSize:14,
                  color:"rgba(95,196,166,0.9)", fontStyle:"italic", lineHeight:1.7
                }}>{verse.fr}</span>
              </div>
            )}
          </div>

          {/* Hover actions: bookmark + highlight */}
          <div className="verse-actions" style={{
            opacity:0, transition:"opacity .15s",
            display:"flex", flexDirection:"column", gap:4, flexShrink:0
          }}>
            <button
              onClick={() => toggleBookmark(selectedSurah.n, verse.num)}
              title={bk ? "Retirer le signet" : "Ajouter un signet"}
              style={{
                width:26, height:26, borderRadius:4, cursor:"pointer",
                border:`1px solid ${bk ? P.gold : P.br2}`,
                background: bk ? P.goldBg : "transparent",
                color: bk ? P.gold : P.ink3,
                fontSize:13, display:"flex", alignItems:"center", justifyContent:"center"
              }}
            >{bk ? "★" : "☆"}</button>
            <button
              onClick={() => setHighlightedVerse(hl ? null : verse.num)}
              title="Surligner"
              style={{
                width:26, height:26, borderRadius:4, cursor:"pointer",
                border:`1px solid ${hl ? P.gold : P.br2}`,
                background: hl ? P.goldBg : "transparent",
                color: hl ? P.gold : P.ink3,
                fontSize:10, display:"flex", alignItems:"center", justifyContent:"center"
              }}
            >◉</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <div style={{
      display:"flex", height:"calc(100vh - 70px)", marginTop:70,
      background:P.bg1, color:P.ink1, overflow:"hidden", position:"relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wave{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
        *{box-sizing:border-box} button:focus{outline:none}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${P.bg0}}
        ::-webkit-scrollbar-thumb{background:${P.br1};border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:${P.goldBr}}
        .verse-row:hover .verse-actions{opacity:1!important}
        .sidebar-btn:hover{background:${P.bg3}!important}
        .reciter-btn:hover{background:${P.bg3}!important}
        .qr-lattice{
          position:absolute; inset:0; pointer-events:none; z-index:0; opacity:0.5;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(205,160,83,0.10) 1px, transparent 1.6px);
          background-size:26px 26px;
          mask-image: radial-gradient(ellipse 80% 60% at 18% 0%, black 0%, transparent 70%);
        }
      `}</style>
      <div className="qr-lattice"/>

      {/* ══ SIDEBAR ═══════════════════════════════════════════ */}
      <aside style={{
        width:280, background:P.bg0, borderRight:`1px solid ${P.br1}`,
        display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden",
        position:"relative", zIndex:1,
      }}>
        <div style={{ padding:"20px 18px 15px", borderBottom:`1px solid ${P.br2}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:16 }}>
            <div style={{
              width:38, height:38, borderRadius:"50%", flexShrink:0,
              background:`radial-gradient(circle at 35% 30%, ${P.goldL}22, ${P.goldBg})`,
              border:`1px solid ${P.goldBr}`, position:"relative",
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>
              <div style={{ position:"absolute", inset:3, borderRadius:"50%", border:`1px solid ${P.br1}` }}/>
              <span style={{ color:P.gold }}><Icon.Book/></span>
            </div>
            <div>
              <div style={{ fontFamily:"'Amiri', 'Cormorant Garamond', serif", fontSize:18, fontWeight:700, color:P.ink1, lineHeight:1.2 }}>القرآن الكريم</div>
              <div style={{ fontSize:9, color:P.ink3, fontFamily:F_UI, fontWeight:600, letterSpacing:"0.14em", marginTop:2 }}>LE SAINT CORAN · 114 SOURATES</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:P.bg2, border:`1px solid ${P.br2}`, borderRadius:6, padding:"7px 11px" }}>
            <Icon.Search/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search surah..."
              style={{ border:"none", background:"transparent", fontSize:12, outline:"none", width:"100%", color:P.ink1, fontFamily:F_UI }}/>
          </div>
        </div>

        <div style={{ display:"flex", borderBottom:`1px solid ${P.br2}`, flexShrink:0 }}>
          {[["surahs","Surahs"],["juzaa","Juz'"]].map(([k,l]) => (
            <button key={k} onClick={() => setSidebarTab(k)} style={{
              flex:1, padding:"10px 0", border:"none", background:"transparent",
              color: sidebarTab===k ? P.gold : P.ink3,
              fontFamily:F_UI, fontWeight:600, fontSize:10, cursor:"pointer",
              borderBottom: sidebarTab===k ? `2px solid ${P.gold}` : "2px solid transparent",
              letterSpacing:"0.12em", transition:"all .15s"
            }}>{l.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          {sidebarTab === "surahs" && filteredSurahs.map(s => (
            <button key={s.n} className="sidebar-btn" onClick={() => loadSurah(s)} style={{
              display:"flex", alignItems:"center", width:"100%", padding:"10px 16px",
              border:"none", borderBottom:`1px solid ${P.br2}`,
              background: selectedSurah?.n===s.n ? P.goldBg : "transparent",
              borderLeft: selectedSurah?.n===s.n ? `2px solid ${P.gold}` : "2px solid transparent",
              cursor:"pointer", textAlign:"left", transition:"background .12s"
            }}>
              <div style={{
                width:27, height:27, borderRadius:"30%", flexShrink:0, marginRight:11,
                transform:"rotate(45deg)",
                background: selectedSurah?.n===s.n ? P.goldBg : P.bg2,
                border:`1px solid ${selectedSurah?.n===s.n ? P.gold : P.br2}`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <span style={{
                  transform:"rotate(-45deg)",
                  fontFamily:F_UI, fontSize:10, fontWeight:700,
                  color: selectedSurah?.n===s.n ? P.gold : P.ink3,
                }}>{s.n}</span>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, fontWeight:600, color: selectedSurah?.n===s.n ? P.gold : P.ink1, fontFamily:F_UI }}>{s.en}</span>
                  <span style={{ fontSize:15, color: selectedSurah?.n===s.n ? P.gold : P.ink2, fontFamily:"'Amiri',serif" }}>{s.ar}</span>
                </div>
                <div style={{ fontSize:10, color:P.ink3, fontFamily:F_UI, marginTop:1 }}>
                  <span style={{ color: s.type==="Meccan" ? P.teal : "#c09060" }}>{s.revelation}</span>
                  &ensp;·&ensp;{s.verses}v
                  {selectedSurah?.n===s.n && <span style={{ color:P.gold, marginLeft:5 }}>Juz' {s.juz}</span>}
                </div>
                {s.fr && selectedSurah?.n===s.n && (
                  <div style={{ fontSize:9, color:P.pur, fontFamily:F_UI, fontStyle:"italic", marginTop:2 }}>{s.fr}</div>
                )}
              </div>
            </button>
          ))}

          {sidebarTab === "juzaa" && JUZAA.map(j => (
            <button key={j.n} className="sidebar-btn" onClick={() => {
              const t = ALL_SURAHS.find(s => s.n === j.start.s);
              if (t) loadSurah(t);
            }} style={{
              display:"flex", alignItems:"center", width:"100%", padding:"11px 16px",
              border:"none", borderBottom:`1px solid ${P.br2}`,
              background:"transparent", cursor:"pointer", textAlign:"left", transition:"background .12s"
            }}>
              <div style={{ width:33, height:33, borderRadius:"50%", flexShrink:0, marginRight:12, background:P.bg2, border:`1px solid ${P.br1}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:7, color:P.ink3, fontFamily:F_UI, fontWeight:700, letterSpacing:"0.08em", lineHeight:1 }}>JUZ'</span>
                <span style={{ fontSize:13, color:P.gold, fontFamily:F_DISPLAY, fontWeight:700, lineHeight:1.1 }}>{j.n}</span>
              </div>
              <div>
                <div style={{ fontSize:14, color:P.ink1, fontFamily:"'Amiri',serif", fontWeight:700 }}>{j.name}</div>
                <div style={{ fontSize:10, color:P.ink3, fontFamily:F_UI, marginTop:1 }}>Début : {ALL_SURAHS.find(s=>s.n===j.start.s)?.ar} : {j.start.v}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ══ MAIN READER ═══════════════════════════════════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", zIndex:1 }}>

        {/* Toolbar */}
        <div style={{
          height:52, background:P.bg2, borderBottom:`1px solid ${P.br1}`,
          display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0
        }}>
          {selectedSurah ? (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <span style={{ fontFamily:"'Amiri',serif", fontSize:17, fontWeight:700, color:P.ink1 }}>{selectedSurah.ar}</span>
                <span style={{ fontFamily:F_DISPLAY, fontSize:13, color:P.gold, fontStyle:"italic" }}>{selectedSurah.en}</span>
                <span style={{ fontSize:9, color:P.ink3, fontFamily:F_UI, fontWeight:600, background:P.bg3, border:`1px solid ${P.br2}`, borderRadius:4, padding:"3px 8px" }}>
                  {selectedSurah.verses} versets · Juz' {selectedSurah.juz}
                </span>
              </div>
              <div style={{ flex:1 }}/>

              {/* Font size */}
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <button onClick={() => setFontSize(f => Math.max(18,f-2))} style={{ width:24,height:24,borderRadius:4,border:`1px solid ${P.br2}`,background:P.bg3,color:P.ink2,cursor:"pointer",fontFamily:F_UI,fontSize:12,fontWeight:700 }}>−</button>
                <span style={{ fontSize:10,color:P.ink3,fontFamily:F_UI,width:26,textAlign:"center" }}>{fontSize}</span>
                <button onClick={() => setFontSize(f => Math.min(40,f+2))} style={{ width:24,height:24,borderRadius:4,border:`1px solid ${P.br2}`,background:P.bg3,color:P.ink2,cursor:"pointer",fontFamily:F_UI,fontSize:12,fontWeight:700 }}>+</button>
              </div>

              {/* EXPL. global toggle */}
              <button onClick={() => setShowAllTrans(v => !v)} style={{
                padding:"4px 11px", borderRadius:5, cursor:"pointer",
                border:`1px solid ${showAllTrans ? P.tealBr : P.br2}`,
                background: showAllTrans ? P.tealBg : "transparent",
                color: showAllTrans ? P.teal : P.ink3,
                fontFamily:F_UI, fontWeight:600, fontSize:10, transition:"all .15s",
                display:"flex", alignItems:"center", gap:4
              }}>
                {showAllTrans ? <Icon.Eye/> : <Icon.EyeOff/>} TRAD.
              </button>

              {/* PRON. global toggle — only when API returned data */}
              {loadingPron ? (
                <div style={{ padding:"4px 11px", borderRadius:5, border:`1px solid ${P.br2}`, background:"transparent", display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8,height:8,border:`1.5px solid ${P.purBg}`,borderTopColor:P.pur,borderRadius:"50%",animation:"spin .7s linear infinite" }}/>
                  <span style={{ fontSize:9, color:P.ink3, fontFamily:F_UI }}>Pron…</span>
                </div>
              ) : hasPron && (
                <button onClick={() => setShowAllPron(v => !v)} style={{
                  padding:"4px 11px", borderRadius:5, cursor:"pointer",
                  border:`1px solid ${showAllPron ? P.purBr : P.br2}`,
                  background: showAllPron ? P.purBg : "transparent",
                  color: showAllPron ? P.pur : P.ink3,
                  fontFamily:F_UI, fontWeight:600, fontSize:10, transition:"all .15s",
                  display:"flex", alignItems:"center", gap:4
                }}>
                  {showAllPron ? <Icon.Eye/> : <Icon.EyeOff/>} Prononciation FR
                </button>
              )}
            </>
          ) : (
            <span style={{ fontSize:13, color:P.ink3, fontFamily:F_DISPLAY, fontStyle:"italic" }}>
              اختر سورة — Sélectionnez une sourate pour commencer
            </span>
          )}
        </div>

        {/* Reciter bar + full audio player */}
        {selectedSurah && (
          <div style={{
            background:P.bg0, borderBottom:`1px solid ${P.br2}`,
            padding:"13px 20px", flexShrink:0
          }}>
            {/* Reciter selector */}
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:11, flexWrap:"wrap" }}>
              <Icon.Volume/>
              <span style={{ fontSize:9, color:P.ink3, fontFamily:F_UI, fontWeight:700, letterSpacing:"0.14em", marginRight:4 }}>RÉCITATEUR</span>
              {RECITERS.map(r => (
                <button key={r.id} onClick={() => setReciter(r.id)} className="reciter-btn" style={{
                  padding:"4px 12px", borderRadius:4,
                  border:`1px solid ${reciter===r.id ? P.gold : P.br2}`,
                  background: reciter===r.id ? P.goldBg : "transparent",
                  color: reciter===r.id ? P.gold : P.ink3,
                  fontFamily:F_UI, fontSize:10,
                  fontWeight: reciter===r.id ? 600 : 400,
                  cursor:"pointer", transition:"all .12s"
                }}>{r.name}</button>
              ))}
            </div>
            {/* Full player */}
            <AudioPlayer key={`${selectedSurah.n}-${reciter}`} src={audioSrc} reciterName={rec.name}/>
          </div>
        )}

        {/* Content area */}
        <div ref={contentRef} style={{ flex:1, overflowY:"auto", background:P.bg1 }}>

          {/* Welcome */}
          {!selectedSurah && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:20, padding:40 }}>
              <div style={{
                textAlign:"center", position:"relative", padding:"44px 56px",
                border:`1px solid ${P.br1}`, borderRadius:4,
              }}>
                {[0,1,2,3].map(i => (
                  <svg key={i} width="34" height="34" viewBox="0 0 34 34" style={{
                    position:"absolute",
                    top: i<2 ? -1 : "auto", bottom: i>=2 ? -1 : "auto",
                    left: i%2===0 ? -1 : "auto", right: i%2===1 ? -1 : "auto",
                    transform: i===1?"scaleX(-1)":i===2?"scaleY(-1)":i===3?"scale(-1,-1)":"none"
                  }}>
                    <path d="M1 1 Q1 17 17 17" fill="none" stroke={P.goldBr} strokeWidth="1"/>
                    <path d="M1 1 L1 13 M1 1 L13 1" fill="none" stroke={P.gold} strokeWidth="1.4"/>
                  </svg>
                ))}
                <div style={{ fontFamily:"'Amiri',serif", fontSize:58, color:P.goldL, lineHeight:1, marginBottom:10, textShadow:`0 0 28px ${P.gold}30` }}>بِسْمِ اللَّهِ</div>
                <OrnamentDivider/>
                <div style={{ fontFamily:"'Amiri',serif", fontSize:23, color:P.ink2, marginTop:13 }}>الرَّحْمَٰنِ الرَّحِيمِ</div>
                <div style={{ marginTop:26, fontSize:12, color:P.ink3, fontFamily:F_UI, lineHeight:1.75, maxWidth:340 }}>
                  Sélectionnez une sourate dans la liste à gauche pour commencer votre lecture.
                  Utilisez la barre d'outils pour afficher la prononciation et la traduction.
                </div>
                <div style={{ marginTop:26, display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
                  {[{n:1,label:"Al-Fatiha"},{n:36,label:"Ya-Sin"},{n:67,label:"Al-Mulk"},{n:112,label:"Al-Ikhlas"}].map(q => (
                    <button key={q.n} onClick={() => loadSurah(ALL_SURAHS[q.n-1])} style={{
                      padding:"8px 18px", borderRadius:4,
                      border:`1px solid ${P.goldBr}`, background:P.goldBg,
                      color:P.gold, fontFamily:"'Amiri',serif", fontSize:14, fontWeight:700, cursor:"pointer"
                    }}>{ALL_SURAHS[q.n-1].ar}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:14 }}>
              <div style={{ width:36,height:36,border:`2px solid ${P.goldBg}`,borderTopColor:P.gold,borderRadius:"50%",animation:"spin .8s linear infinite" }}/>
              <div style={{ fontFamily:"'Amiri',serif", fontSize:14, color:P.ink3 }}>جارٍ التحميل...</div>
            </div>
          )}

          {/* Verses */}
          {selectedSurah && verses && !loading && (
            <div style={{ maxWidth:760, margin:"0 auto", padding:"32px 28px 80px" }}>

              {/* Surah header — illuminated medallion */}
              <div style={{
                textAlign:"center", marginBottom:36,
                background:`linear-gradient(180deg, ${P.bg2}, ${P.bg1})`,
                border:`1px solid ${P.br1}`, borderRadius:6,
                padding:"30px 32px", position:"relative", overflow:"hidden"
              }}>
                <div style={{ position:"absolute", inset:8, border:`1px solid ${P.br2}`, borderRadius:3, pointerEvents:"none" }}/>
                {[0,1,2,3].map(i => (
                  <svg key={i} width="30" height="30" viewBox="0 0 30 30" style={{
                    position:"absolute",
                    top: i<2 ? 6 : "auto", bottom: i>=2 ? 6 : "auto",
                    left: i%2===0 ? 6 : "auto", right: i%2===1 ? 6 : "auto",
                    transform: i===1?"scaleX(-1)":i===2?"scaleY(-1)":i===3?"scale(-1,-1)":"none"
                  }}>
                    <path d="M2 2 Q12 2 12 12" fill="none" stroke={P.goldBr} strokeWidth="1"/>
                    <path d="M2 2 Q2 12 12 12" fill="none" stroke={P.goldBr} strokeWidth="1"/>
                    <path d="M2 2 L2 9 M2 2 L9 2" fill="none" stroke={P.gold} strokeWidth="1.3"/>
                    <circle cx="2" cy="2" r="1.6" fill={P.gold}/>
                  </svg>
                ))}
                <div style={{ fontFamily:F_UI, fontSize:9, fontWeight:700, color:P.ink3, letterSpacing:"0.18em", marginBottom:12 }}>
                  {selectedSurah.revelation} · SOURATE {selectedSurah.n} SUR 114
                </div>
                <div style={{ fontFamily:"'Amiri',serif", fontSize:38, fontWeight:700, color:P.goldL, marginBottom:5, lineHeight:1.2, textShadow:`0 0 22px ${P.gold}25` }}>
                  {selectedSurah.ar}
                </div>
                <div style={{ fontFamily:F_DISPLAY, fontSize:19, color:P.ink2, marginBottom:7, fontStyle:"italic" }}>
                  {selectedSurah.en}
                </div>
                {selectedSurah.fr && (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:9, background:P.purBg, border:`1px solid ${P.purBr}`, borderRadius:4, padding:"3px 13px" }}>
                    <span style={{ fontSize:10, color:P.ink3, fontFamily:F_UI }}>🗣</span>
                    <span style={{ fontSize:12, color:P.pur, fontFamily:F_UI, fontStyle:"italic", fontWeight:600 }}>{selectedSurah.fr}</span>
                  </div>
                )}
                <div style={{ fontFamily:F_UI, fontSize:11, color:P.ink3, fontStyle:"italic" }}>
                  {selectedSurah.meaning} · {selectedSurah.verses} versets
                </div>
                <OrnamentDivider/>
              </div>

              {/* Basmala */}
              {basmala && (
                <div style={{ textAlign:"center", marginBottom:28 }}>
                  <div style={{ display:"inline-block", padding:"15px 38px", background:P.goldBg, border:`1px solid ${P.goldBr}`, borderRadius:4 }}>
                    <div style={{ fontFamily:"'Amiri',serif", fontSize:25, color:P.goldL, lineHeight:1.9 }}>{basmala.ar}</div>
                    <div style={{ fontSize:9, color:P.ink3, fontFamily:F_UI, letterSpacing:"0.1em", marginTop:4 }}>
                      BASMALA — Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux
                    </div>
                    <div style={{ fontSize:10, color:P.ink3, fontFamily:F_UI, fontStyle:"italic", marginTop:2 }}>
                      Biss-mill-aa-hir-rah-maa-nir-ra-HEEM
                    </div>
                  </div>
                </div>
              )}

              {/* Verse list */}
              <div style={{ animation:"fadeUp .4s ease both" }}>
                {verses.map((v, i) => (
                  <VerseCard
                    key={v.num}
                    verse={v}
                    index={i}
                    globalPron={showAllPron}
                    globalTrans={showAllTrans}
                  />
                ))}
              </div>

              {/* Footer */}
              <div style={{ textAlign:"center", marginTop:40 }}>
                <OrnamentDivider/>
                <div style={{ marginTop:13, fontFamily:"'Amiri',serif", fontSize:19, color:P.goldBr }}>
                  ﴾ {selectedSurah.ar} ﴿
                </div>
                {selectedSurah.n < 114 && (
                  <div style={{ marginTop:20 }}>
                    <button onClick={() => loadSurah(ALL_SURAHS[selectedSurah.n])} style={{
                      padding:"9px 22px", borderRadius:4,
                      border:`1px solid ${P.goldBr}`, background:P.goldBg,
                      color:P.gold, fontFamily:F_UI, fontWeight:600, fontSize:12, cursor:"pointer",
                      display:"inline-flex", alignItems:"center", gap:8
                    }}>
                      Suivant : {ALL_SURAHS[selectedSurah.n].ar} <Icon.ChevR/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}