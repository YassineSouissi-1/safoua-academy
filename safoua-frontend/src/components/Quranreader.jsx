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
};

/* ── PALETTE ─────────────────────────────────────────────────── */
const P = {
  bg0:"#0c0a08", bg1:"#110f0c", bg2:"#1a1612", bg3:"#221e19",
  ink1:"#f0e8d8", ink2:"rgba(240,232,216,0.62)", ink3:"rgba(240,232,216,0.32)", ink4:"rgba(240,232,216,0.14)",
  gold:"#c8a45a", goldL:"#e8c97a", goldD:"#9a7a3a",
  goldBg:"rgba(200,164,90,0.08)", goldBr:"rgba(200,164,90,0.22)",
  teal:"#1e9e72", tealL:"#27c490",
  tealBg:"rgba(30,158,114,0.1)", tealBr:"rgba(30,158,114,0.24)",
  br1:"rgba(200,164,90,0.14)", br2:"rgba(240,232,216,0.07)",
  pur:"#a78bda", purBg:"rgba(167,139,218,0.1)", purBr:"rgba(167,139,218,0.24)",
};

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
  {n:1,ar:"الفاتحة",en:"Al-Fatiha",meaning:"The Opening",verses:7,type:"Meccan",revelation:"مكية",juz:1,fr:"al-faa-ti-HA"},
  {n:2,ar:"البقرة",en:"Al-Baqarah",meaning:"The Cow",verses:286,type:"Medinan",revelation:"مدنية",juz:1,fr:"al-ba-QA-ra"},
  {n:3,ar:"آل عمران",en:"Al-Imran",meaning:"Family of Imran",verses:200,type:"Medinan",revelation:"مدنية",juz:3,fr:"a-li 'im-RAAN"},
  {n:4,ar:"النساء",en:"An-Nisa",meaning:"The Women",verses:176,type:"Medinan",revelation:"مدنية",juz:4,fr:"an-ni-SAA"},
  {n:5,ar:"المائدة",en:"Al-Ma'idah",meaning:"The Table Spread",verses:120,type:"Medinan",revelation:"مدنية",juz:6,fr:"al-maa-'i-DA"},
  {n:6,ar:"الأنعام",en:"Al-An'am",meaning:"The Cattle",verses:165,type:"Meccan",revelation:"مكية",juz:7,fr:"al-an-'AAM"},
  {n:7,ar:"الأعراف",en:"Al-A'raf",meaning:"The Heights",verses:206,type:"Meccan",revelation:"مكية",juz:8,fr:"al-a'-RAAF"},
  {n:8,ar:"الأنفال",en:"Al-Anfal",meaning:"The Spoils of War",verses:75,type:"Medinan",revelation:"مدنية",juz:9,fr:"al-an-FAAL"},
  {n:9,ar:"التوبة",en:"At-Tawbah",meaning:"The Repentance",verses:129,type:"Medinan",revelation:"مدنية",juz:10,fr:"at-taw-BA"},
  {n:10,ar:"يونس",en:"Yunus",meaning:"Jonah",verses:109,type:"Meccan",revelation:"مكية",juz:11,fr:"YOU-nous"},
  {n:11,ar:"هود",en:"Hud",meaning:"Hud",verses:123,type:"Meccan",revelation:"مكية",juz:11,fr:"HOUD"},
  {n:12,ar:"يوسف",en:"Yusuf",meaning:"Joseph",verses:111,type:"Meccan",revelation:"مكية",juz:12,fr:"YOU-souf"},
  {n:13,ar:"الرعد",en:"Ar-Ra'd",meaning:"The Thunder",verses:43,type:"Medinan",revelation:"مدنية",juz:13,fr:"ar-RA'd"},
  {n:14,ar:"إبراهيم",en:"Ibrahim",meaning:"Abraham",verses:52,type:"Meccan",revelation:"مكية",juz:13,fr:"ib-raa-HEEM"},
  {n:15,ar:"الحجر",en:"Al-Hijr",meaning:"The Rocky Tract",verses:99,type:"Meccan",revelation:"مكية",juz:14,fr:"al-HIJR"},
  {n:16,ar:"النحل",en:"An-Nahl",meaning:"The Bee",verses:128,type:"Meccan",revelation:"مكية",juz:14,fr:"an-NAHL"},
  {n:17,ar:"الإسراء",en:"Al-Isra",meaning:"The Night Journey",verses:111,type:"Meccan",revelation:"مكية",juz:15,fr:"al-is-RAA"},
  {n:18,ar:"الكهف",en:"Al-Kahf",meaning:"The Cave",verses:110,type:"Meccan",revelation:"مكية",juz:15,fr:"al-KAHF"},
  {n:19,ar:"مريم",en:"Maryam",meaning:"Mary",verses:98,type:"Meccan",revelation:"مكية",juz:16,fr:"MAR-yam"},
  {n:20,ar:"طه",en:"Ta-Ha",meaning:"Ta-Ha",verses:135,type:"Meccan",revelation:"مكية",juz:16,fr:"TAA-HAA"},
  {n:21,ar:"الأنبياء",en:"Al-Anbiya",meaning:"The Prophets",verses:112,type:"Meccan",revelation:"مكية",juz:17,fr:"al-an-bi-YAA"},
  {n:22,ar:"الحج",en:"Al-Hajj",meaning:"The Pilgrimage",verses:78,type:"Medinan",revelation:"مدنية",juz:17,fr:"al-HAJJ"},
  {n:23,ar:"المؤمنون",en:"Al-Mu'minun",meaning:"The Believers",verses:118,type:"Meccan",revelation:"مكية",juz:18,fr:"al-mou'-mi-NOUN"},
  {n:24,ar:"النور",en:"An-Nur",meaning:"The Light",verses:64,type:"Medinan",revelation:"مدنية",juz:18,fr:"an-NOUR"},
  {n:25,ar:"الفرقان",en:"Al-Furqan",meaning:"The Criterion",verses:77,type:"Meccan",revelation:"مكية",juz:18,fr:"al-four-QAAN"},
  {n:26,ar:"الشعراء",en:"Ash-Shu'ara",meaning:"The Poets",verses:227,type:"Meccan",revelation:"مكية",juz:19,fr:"ach-chou-'a-RAA"},
  {n:27,ar:"النمل",en:"An-Naml",meaning:"The Ant",verses:93,type:"Meccan",revelation:"مكية",juz:19,fr:"an-NAML"},
  {n:28,ar:"القصص",en:"Al-Qasas",meaning:"The Stories",verses:88,type:"Meccan",revelation:"مكية",juz:20,fr:"al-qa-SASS"},
  {n:29,ar:"العنكبوت",en:"Al-Ankabut",meaning:"The Spider",verses:69,type:"Meccan",revelation:"مكية",juz:20,fr:"al-'an-ka-BOUT"},
  {n:30,ar:"الروم",en:"Ar-Rum",meaning:"The Romans",verses:60,type:"Meccan",revelation:"مكية",juz:21,fr:"ar-ROUM"},
  {n:31,ar:"لقمان",en:"Luqman",meaning:"Luqman",verses:34,type:"Meccan",revelation:"مكية",juz:21,fr:"louk-MAAN"},
  {n:32,ar:"السجدة",en:"As-Sajdah",meaning:"The Prostration",verses:30,type:"Meccan",revelation:"مكية",juz:21,fr:"as-saj-DA"},
  {n:33,ar:"الأحزاب",en:"Al-Ahzab",meaning:"The Confederates",verses:73,type:"Medinan",revelation:"مدنية",juz:21,fr:"al-ah-ZAAB"},
  {n:34,ar:"سبأ",en:"Saba",meaning:"Sheba",verses:54,type:"Meccan",revelation:"مكية",juz:22,fr:"sa-BA"},
  {n:35,ar:"فاطر",en:"Fatir",meaning:"Originator",verses:45,type:"Meccan",revelation:"مكية",juz:22,fr:"FAA-tir"},
  {n:36,ar:"يس",en:"Ya-Sin",meaning:"Ya-Sin",verses:83,type:"Meccan",revelation:"مكية",juz:22,fr:"YAA-SEEN"},
  {n:37,ar:"الصافات",en:"As-Saffat",meaning:"Those Who Set The Ranks",verses:182,type:"Meccan",revelation:"مكية",juz:23,fr:"as-saa-FAAT"},
  {n:38,ar:"ص",en:"Sad",meaning:"The Letter Sad",verses:88,type:"Meccan",revelation:"مكية",juz:23,fr:"SAAD"},
  {n:39,ar:"الزمر",en:"Az-Zumar",meaning:"The Troops",verses:75,type:"Meccan",revelation:"مكية",juz:23,fr:"az-ZOU-mar"},
  {n:40,ar:"غافر",en:"Ghafir",meaning:"The Forgiver",verses:85,type:"Meccan",revelation:"مكية",juz:24,fr:"GHAA-fir"},
  {n:41,ar:"فصلت",en:"Fussilat",meaning:"Explained In Detail",verses:54,type:"Meccan",revelation:"مكية",juz:24,fr:"fouss-si-LAT"},
  {n:42,ar:"الشورى",en:"Ash-Shura",meaning:"The Consultation",verses:53,type:"Meccan",revelation:"مكية",juz:25,fr:"ach-CHOU-raa"},
  {n:43,ar:"الزخرف",en:"Az-Zukhruf",meaning:"The Ornaments of Gold",verses:89,type:"Meccan",revelation:"مكية",juz:25,fr:"az-ZOUKHROUF"},
  {n:44,ar:"الدخان",en:"Ad-Dukhan",meaning:"The Smoke",verses:59,type:"Meccan",revelation:"مكية",juz:25,fr:"ad-dou-KHAAN"},
  {n:45,ar:"الجاثية",en:"Al-Jathiyah",meaning:"The Crouching",verses:37,type:"Meccan",revelation:"مكية",juz:25,fr:"al-jaa-thi-YA"},
  {n:46,ar:"الأحقاف",en:"Al-Ahqaf",meaning:"The Wind-Curved Sandhills",verses:35,type:"Meccan",revelation:"مكية",juz:26,fr:"al-ah-QAAF"},
  {n:47,ar:"محمد",en:"Muhammad",meaning:"Muhammad",verses:38,type:"Medinan",revelation:"مدنية",juz:26,fr:"mo-HAM-mad"},
  {n:48,ar:"الفتح",en:"Al-Fath",meaning:"The Victory",verses:29,type:"Medinan",revelation:"مدنية",juz:26,fr:"al-FATH"},
  {n:49,ar:"الحجرات",en:"Al-Hujurat",meaning:"The Rooms",verses:18,type:"Medinan",revelation:"مدنية",juz:26,fr:"al-hou-jou-RAAT"},
  {n:50,ar:"ق",en:"Qaf",meaning:"The Letter Qaf",verses:45,type:"Meccan",revelation:"مكية",juz:26,fr:"QAAF"},
  {n:51,ar:"الذاريات",en:"Adh-Dhariyat",meaning:"The Winnowing Winds",verses:60,type:"Meccan",revelation:"مكية",juz:26,fr:"adh-dhaa-ri-YAAT"},
  {n:52,ar:"الطور",en:"At-Tur",meaning:"The Mount",verses:49,type:"Meccan",revelation:"مكية",juz:27,fr:"at-TOUR"},
  {n:53,ar:"النجم",en:"An-Najm",meaning:"The Star",verses:62,type:"Meccan",revelation:"مكية",juz:27,fr:"an-NAJM"},
  {n:54,ar:"القمر",en:"Al-Qamar",meaning:"The Moon",verses:55,type:"Meccan",revelation:"مكية",juz:27,fr:"al-QA-mar"},
  {n:55,ar:"الرحمن",en:"Ar-Rahman",meaning:"The Beneficent",verses:78,type:"Medinan",revelation:"مدنية",juz:27,fr:"ar-rah-MAAN"},
  {n:56,ar:"الواقعة",en:"Al-Waqi'ah",meaning:"The Inevitable",verses:96,type:"Meccan",revelation:"مكية",juz:27,fr:"al-waa-qi-'A"},
  {n:57,ar:"الحديد",en:"Al-Hadid",meaning:"The Iron",verses:29,type:"Medinan",revelation:"مدنية",juz:27,fr:"al-ha-DEED"},
  {n:58,ar:"المجادلة",en:"Al-Mujadila",meaning:"The Pleading Woman",verses:22,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-mou-jaa-di-LA"},
  {n:59,ar:"الحشر",en:"Al-Hashr",meaning:"The Exile",verses:24,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-HACHR"},
  {n:60,ar:"الممتحنة",en:"Al-Mumtahanah",meaning:"She That Is To Be Examined",verses:13,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-moum-ta-HA-na"},
  {n:61,ar:"الصف",en:"As-Saf",meaning:"The Ranks",verses:14,type:"Medinan",revelation:"مدنية",juz:28,fr:"as-SAFF"},
  {n:62,ar:"الجمعة",en:"Al-Jumu'ah",meaning:"The Congregation",verses:11,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-jou-MOU-'a"},
  {n:63,ar:"المنافقون",en:"Al-Munafiqun",meaning:"The Hypocrites",verses:11,type:"Medinan",revelation:"مدنية",juz:28,fr:"al-mou-naa-fi-QOUN"},
  {n:64,ar:"التغابن",en:"At-Taghabun",meaning:"The Mutual Disillusion",verses:18,type:"Medinan",revelation:"مدنية",juz:28,fr:"at-ta-GHAA-boun"},
  {n:65,ar:"الطلاق",en:"At-Talaq",meaning:"The Divorce",verses:12,type:"Medinan",revelation:"مدنية",juz:28,fr:"at-ta-LAAQ"},
  {n:66,ar:"التحريم",en:"At-Tahrim",meaning:"The Prohibition",verses:12,type:"Medinan",revelation:"مدنية",juz:28,fr:"at-tah-REEM"},
  {n:67,ar:"الملك",en:"Al-Mulk",meaning:"The Sovereignty",verses:30,type:"Meccan",revelation:"مكية",juz:29,fr:"al-MOULK"},
  {n:68,ar:"القلم",en:"Al-Qalam",meaning:"The Pen",verses:52,type:"Meccan",revelation:"مكية",juz:29,fr:"al-QA-lam"},
  {n:69,ar:"الحاقة",en:"Al-Haqqah",meaning:"The Reality",verses:52,type:"Meccan",revelation:"مكية",juz:29,fr:"al-haaq-QA"},
  {n:70,ar:"المعارج",en:"Al-Ma'arij",meaning:"The Ascending Stairways",verses:44,type:"Meccan",revelation:"مكية",juz:29,fr:"al-ma-'AA-rij"},
  {n:71,ar:"نوح",en:"Nuh",meaning:"Noah",verses:28,type:"Meccan",revelation:"مكية",juz:29,fr:"NOUH"},
  {n:72,ar:"الجن",en:"Al-Jinn",meaning:"The Jinn",verses:28,type:"Meccan",revelation:"مكية",juz:29,fr:"al-JINN"},
  {n:73,ar:"المزمل",en:"Al-Muzzammil",meaning:"The Enshrouded One",verses:20,type:"Meccan",revelation:"مكية",juz:29,fr:"al-mouz-ZAM-mil"},
  {n:74,ar:"المدثر",en:"Al-Muddaththir",meaning:"The Cloaked One",verses:56,type:"Meccan",revelation:"مكية",juz:29,fr:"al-mou-DATH-thir"},
  {n:75,ar:"القيامة",en:"Al-Qiyamah",meaning:"The Resurrection",verses:40,type:"Meccan",revelation:"مكية",juz:29,fr:"al-qi-YAA-ma"},
  {n:76,ar:"الإنسان",en:"Al-Insan",meaning:"The Man",verses:31,type:"Medinan",revelation:"مدنية",juz:29,fr:"al-in-SAAN"},
  {n:77,ar:"المرسلات",en:"Al-Mursalat",meaning:"The Emissaries",verses:50,type:"Meccan",revelation:"مكية",juz:29,fr:"al-mour-sa-LAAT"},
  {n:78,ar:"النبأ",en:"An-Naba",meaning:"The Tidings",verses:40,type:"Meccan",revelation:"مكية",juz:30,fr:"an-NA-ba"},
  {n:79,ar:"النازعات",en:"An-Nazi'at",meaning:"Those Who Drag Forth",verses:46,type:"Meccan",revelation:"مكية",juz:30,fr:"an-naa-zi-'AAT"},
  {n:80,ar:"عبس",en:"Abasa",meaning:"He Frowned",verses:42,type:"Meccan",revelation:"مكية",juz:30,fr:"'a-BA-sa"},
  {n:81,ar:"التكوير",en:"At-Takwir",meaning:"The Overthrowing",verses:29,type:"Meccan",revelation:"مكية",juz:30,fr:"at-tak-WEER"},
  {n:82,ar:"الانفطار",en:"Al-Infitar",meaning:"The Cleaving",verses:19,type:"Meccan",revelation:"مكية",juz:30,fr:"al-in-fi-TAAR"},
  {n:83,ar:"المطففين",en:"Al-Mutaffifin",meaning:"The Defrauding",verses:36,type:"Meccan",revelation:"مكية",juz:30,fr:"al-mou-taf-fi-FEEN"},
  {n:84,ar:"الانشقاق",en:"Al-Inshiqaq",meaning:"The Sundering",verses:25,type:"Meccan",revelation:"مكية",juz:30,fr:"al-inch-qi-QAAQ"},
  {n:85,ar:"البروج",en:"Al-Buruj",meaning:"The Mansions of the Stars",verses:22,type:"Meccan",revelation:"مكية",juz:30,fr:"al-bou-ROUJ"},
  {n:86,ar:"الطارق",en:"At-Tariq",meaning:"The Morning Star",verses:17,type:"Meccan",revelation:"مكية",juz:30,fr:"at-TAA-riq"},
  {n:87,ar:"الأعلى",en:"Al-A'la",meaning:"The Most High",verses:19,type:"Meccan",revelation:"مكية",juz:30,fr:"al-a'-LAA"},
  {n:88,ar:"الغاشية",en:"Al-Ghashiyah",meaning:"The Overwhelming",verses:26,type:"Meccan",revelation:"مكية",juz:30,fr:"al-ghaa-chi-YA"},
  {n:89,ar:"الفجر",en:"Al-Fajr",meaning:"The Dawn",verses:30,type:"Meccan",revelation:"مكية",juz:30,fr:"al-FAJR"},
  {n:90,ar:"البلد",en:"Al-Balad",meaning:"The City",verses:20,type:"Meccan",revelation:"مكية",juz:30,fr:"al-BA-lad"},
  {n:91,ar:"الشمس",en:"Ash-Shams",meaning:"The Sun",verses:15,type:"Meccan",revelation:"مكية",juz:30,fr:"ach-CHAMS"},
  {n:92,ar:"الليل",en:"Al-Layl",meaning:"The Night",verses:21,type:"Meccan",revelation:"مكية",juz:30,fr:"al-LAYL"},
  {n:93,ar:"الضحى",en:"Ad-Duha",meaning:"The Morning Hours",verses:11,type:"Meccan",revelation:"مكية",juz:30,fr:"ad-dou-HAA"},
  {n:94,ar:"الشرح",en:"Ash-Sharh",meaning:"The Relief",verses:8,type:"Meccan",revelation:"مكية",juz:30,fr:"ach-CHARH"},
  {n:95,ar:"التين",en:"At-Tin",meaning:"The Fig",verses:8,type:"Meccan",revelation:"مكية",juz:30,fr:"at-TEEN"},
  {n:96,ar:"العلق",en:"Al-Alaq",meaning:"The Clot",verses:19,type:"Meccan",revelation:"مكية",juz:30,fr:"al-'a-LAQ"},
  {n:97,ar:"القدر",en:"Al-Qadr",meaning:"The Power",verses:5,type:"Meccan",revelation:"مكية",juz:30,fr:"al-QA-dr"},
  {n:98,ar:"البينة",en:"Al-Bayyinah",meaning:"The Clear Proof",verses:8,type:"Medinan",revelation:"مدنية",juz:30,fr:"al-bay-yi-NA"},
  {n:99,ar:"الزلزلة",en:"Az-Zalzalah",meaning:"The Earthquake",verses:8,type:"Medinan",revelation:"مدنية",juz:30,fr:"az-zal-ZA-la"},
  {n:100,ar:"العاديات",en:"Al-Adiyat",meaning:"The Courser",verses:11,type:"Meccan",revelation:"مكية",juz:30,fr:"al-'aa-di-YAAT"},
  {n:101,ar:"القارعة",en:"Al-Qari'ah",meaning:"The Calamity",verses:11,type:"Meccan",revelation:"مكية",juz:30,fr:"al-qaa-ri-'A"},
  {n:102,ar:"التكاثر",en:"At-Takathur",meaning:"The Rivalry",verses:8,type:"Meccan",revelation:"مكية",juz:30,fr:"at-ta-KA-thour"},
  {n:103,ar:"العصر",en:"Al-Asr",meaning:"The Declining Day",verses:3,type:"Meccan",revelation:"مكية",juz:30,fr:"al-'ASR"},
  {n:104,ar:"الهمزة",en:"Al-Humazah",meaning:"The Traducer",verses:9,type:"Meccan",revelation:"مكية",juz:30,fr:"al-hou-MA-za"},
  {n:105,ar:"الفيل",en:"Al-Fil",meaning:"The Elephant",verses:5,type:"Meccan",revelation:"مكية",juz:30,fr:"al-FEEL"},
  {n:106,ar:"قريش",en:"Quraysh",meaning:"Quraysh",verses:4,type:"Meccan",revelation:"مكية",juz:30,fr:"qou-RAYCHE"},
  {n:107,ar:"الماعون",en:"Al-Ma'un",meaning:"The Small Kindnesses",verses:7,type:"Meccan",revelation:"مكية",juz:30,fr:"al-maa-'OUN"},
  {n:108,ar:"الكوثر",en:"Al-Kawthar",meaning:"A River in Paradise",verses:3,type:"Meccan",revelation:"مكية",juz:30,fr:"al-KAW-thar"},
  {n:109,ar:"الكافرون",en:"Al-Kafirun",meaning:"The Disbelievers",verses:6,type:"Meccan",revelation:"مكية",juz:30,fr:"al-kaa-fi-ROUN"},
  {n:110,ar:"النصر",en:"An-Nasr",meaning:"The Divine Support",verses:3,type:"Medinan",revelation:"مدنية",juz:30,fr:"an-NASR"},
  {n:111,ar:"المسد",en:"Al-Masad",meaning:"The Palm Fibre",verses:5,type:"Meccan",revelation:"مكية",juz:30,fr:"al-MA-sad"},
  {n:112,ar:"الإخلاص",en:"Al-Ikhlas",meaning:"The Sincerity",verses:4,type:"Meccan",revelation:"مكية",juz:30,fr:"al-ikh-LAAS"},
  {n:113,ar:"الفلق",en:"Al-Falaq",meaning:"The Daybreak",verses:5,type:"Meccan",revelation:"مكية",juz:30,fr:"al-FA-laq"},
  {n:114,ar:"الناس",en:"An-Nas",meaning:"The Mankind",verses:6,type:"Meccan",revelation:"مكية",juz:30,fr:"an-NAAS"},
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
    width:32, height:32, borderRadius:8, cursor:"pointer", border:"none",
    background:"rgba(200,164,90,0.06)", color: accent || P.ink3,
    transition:"all .15s", flexShrink:0,
  });

  const skipLabelStyle = {
    fontSize:9, fontWeight:800, fontFamily:"system-ui", lineHeight:1, letterSpacing:"0.04em"
  };

  return (
    <div style={{
      background:`linear-gradient(135deg,rgba(200,164,90,0.06),rgba(200,164,90,0.02))`,
      border:`1px solid ${P.br1}`, borderRadius:14,
      padding:"14px 16px",
    }}>
      {/* Reciter name + live indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
        <div style={{
          width:7, height:7, borderRadius:"50%",
          background: playing ? P.gold : P.ink4,
          boxShadow: playing ? `0 0 8px ${P.gold}` : "none",
          transition:"all .3s", flexShrink:0
        }}/>
        <Icon.Volume/>
        <span style={{ fontSize:10, color: playing ? P.gold : P.ink3, fontFamily:"system-ui", fontWeight:700, letterSpacing:"0.1em" }}>
          {reciterName || "RÉCITATION"}
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
        style={{ position:"relative", height:5, borderRadius:99, background:P.ink4, cursor:"pointer", marginBottom:12 }}
      >
        <div style={{
          position:"absolute", left:0, top:0, height:"100%",
          width:`${pct}%`,
          background:`linear-gradient(90deg,${P.goldD},${P.gold})`,
          borderRadius:99, transition:"width .1s",
          boxShadow:`0 0 8px ${P.gold}50`
        }}/>
        <div style={{
          position:"absolute", top:"50%", left:`${pct}%`,
          width:13, height:13, borderRadius:"50%",
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
          background:"rgba(200,164,90,0.1)",
          border:`1px solid rgba(200,164,90,0.2)`,
          width:36, height:36, borderRadius:9,
        }} title="-5s">
          <span style={{...skipLabelStyle, color:P.gold}}>−5</span>
        </button>

        {/* Play/Pause — primary button */}
        <button onClick={toggle} style={{
          width:44, height:44, borderRadius:"50%",
          background: playing ? P.goldBg : P.gold,
          border:`2px solid ${P.gold}`,
          color: playing ? P.gold : P.bg0,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0, transition:"all .2s",
          boxShadow: playing ? `0 0 20px ${P.gold}50` : `0 4px 16px ${P.gold}40`,
          margin:"0 4px",
        }}>
          {loading
            ? <div style={{width:14,height:14,border:`2px solid currentColor`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
            : playing ? <Icon.Pause/> : <Icon.Play/>}
        </button>

        {/* +5s */}
        <button onClick={() => skip(5)} style={{
          ...ctrlStyle(P.gold),
          background:"rgba(200,164,90,0.1)",
          border:`1px solid rgba(200,164,90,0.2)`,
          width:36, height:36, borderRadius:9,
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

/* ── ORNAMENTAL DIVIDER ──────────────────────────────────────── */
function OrnamentDivider({ color = P.goldBr }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"6px 0" }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,${color})` }}/>
      <svg width="14" height="14" viewBox="0 0 14 14" fill={color}>
        <polygon points="7,1 8.5,5.5 13,7 8.5,8.5 7,13 5.5,8.5 1,7 5.5,5.5"/>
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

  /* ── VERSE NUMBER ROUNDEL ───────────────────────────────── */
  const VerseNumber = ({ n }) => (
    <div style={{
      width:32, height:32, borderRadius:"50%", flexShrink:0,
      border:`1px solid ${P.gold}`, background:P.goldBg,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Cormorant Garamond',serif", fontSize:12,
      color:P.gold, fontWeight:700, lineHeight:1,
    }}>{n}</div>
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
      padding:"2px 9px", borderRadius:20, cursor:"pointer",
      border:`1px solid ${on ? borderColor : "rgba(240,232,216,0.12)"}`,
      background: on ? bgColor : "transparent",
      color: on ? color : P.ink3,
      fontFamily:"system-ui", fontSize:10, fontWeight:700,
      transition:"all .2s",
    });

    const pillStyle = (color, bgColor, borderColor) => ({
      fontSize:12, color, fontFamily:"system-ui",
      fontStyle:"italic", fontWeight:600,
      background:bgColor, border:`1px solid ${borderColor}`,
      borderRadius:20, padding:"2px 10px",
      animation:"fadeUp .15s ease both",
    });

    return (
      <div className="verse-row" style={{
        padding:"16px 0", borderBottom:`1px solid ${P.br2}`,
        background: hl ? P.goldBg : "transparent",
        borderRadius: hl ? 8 : 0, transition:"background .2s",
        animation:`fadeUp .3s ease ${index*0.018}s both`
      }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
          <VerseNumber n={verse.num}/>

          <div style={{ flex:1 }}>
            {/* Arabic text */}
            <p style={{
              direction:"rtl", fontFamily:"'Cormorant Garamond',serif",
              fontSize:fontSize, color:P.ink1, lineHeight:2.1,
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
                  {localTrans ? <Icon.Eye/> : <Icon.EyeOff/>} EXPL.
                </button>
              )}
            </div>

            {/* Translation panel — slides in under the button row */}
            {localTrans && verse.fr && (
              <div style={{
                background:P.tealBg, border:`1px solid ${P.tealBr}`,
                borderRadius:8, padding:"9px 13px", marginTop:4,
                animation:"fadeUp .18s ease both"
              }}>
                <div style={{
                  fontSize:9, fontFamily:"system-ui", fontWeight:700,
                  color:P.teal, letterSpacing:"0.12em", marginBottom:4
                }}>TRADUCTION</div>
                <span style={{
                  fontFamily:"'Cormorant Garamond',serif", fontSize:14,
                  color:"rgba(30,200,150,0.85)", fontStyle:"italic", lineHeight:1.7
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
              title={bk ? "Remove bookmark" : "Bookmark"}
              style={{
                width:26, height:26, borderRadius:6, cursor:"pointer",
                border:`1px solid ${bk ? P.gold : P.br2}`,
                background: bk ? P.goldBg : "transparent",
                color: bk ? P.gold : P.ink3,
                fontSize:13, display:"flex", alignItems:"center", justifyContent:"center"
              }}
            >{bk ? "★" : "☆"}</button>
            <button
              onClick={() => setHighlightedVerse(hl ? null : verse.num)}
              title="Highlight"
              style={{
                width:26, height:26, borderRadius:6, cursor:"pointer",
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
    <div style={{ display:"flex", height:"calc(100vh - 70px)", marginTop:70, background:P.bg1, color:P.ink1, overflow:"hidden" }}>
      <style>{`
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
      `}</style>

      {/* ══ SIDEBAR ═══════════════════════════════════════════ */}
      <aside style={{
        width:280, background:P.bg0, borderRight:`1px solid ${P.br1}`,
        display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden"
      }}>
        <div style={{ padding:"18px 18px 14px", borderBottom:`1px solid ${P.br2}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:P.goldBg, border:`1px solid ${P.goldBr}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon.Book/>
            </div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700, color:P.ink1 }}>القرآن الكريم</div>
              <div style={{ fontSize:9, color:P.ink3, fontFamily:"system-ui", letterSpacing:"0.12em" }}>THE HOLY QURAN · 114 SURAHS</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:P.bg2, border:`1px solid ${P.br2}`, borderRadius:8, padding:"7px 11px" }}>
            <Icon.Search/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search surah..."
              style={{ border:"none", background:"transparent", fontSize:12, outline:"none", width:"100%", color:P.ink1, fontFamily:"system-ui" }}/>
          </div>
        </div>

        <div style={{ display:"flex", borderBottom:`1px solid ${P.br2}`, flexShrink:0 }}>
          {[["surahs","Surahs"],["juzaa","Juz'"]].map(([k,l]) => (
            <button key={k} onClick={() => setSidebarTab(k)} style={{
              flex:1, padding:"9px 0", border:"none", background:"transparent",
              color: sidebarTab===k ? P.gold : P.ink3,
              fontFamily:"system-ui", fontWeight:700, fontSize:10, cursor:"pointer",
              borderBottom: sidebarTab===k ? `2px solid ${P.gold}` : "2px solid transparent",
              letterSpacing:"0.1em", transition:"all .15s"
            }}>{l.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          {sidebarTab === "surahs" && filteredSurahs.map(s => (
            <button key={s.n} className="sidebar-btn" onClick={() => loadSurah(s)} style={{
              display:"flex", alignItems:"center", width:"100%", padding:"10px 16px",
              border:"none", borderBottom:`1px solid ${P.br2}`,
              background: selectedSurah?.n===s.n ? P.goldBg : "transparent",
              borderLeft: selectedSurah?.n===s.n ? `3px solid ${P.gold}` : "3px solid transparent",
              cursor:"pointer", textAlign:"left", transition:"background .12s"
            }}>
              <div style={{
                width:28, height:28, borderRadius:8, flexShrink:0, marginRight:10,
                background: selectedSurah?.n===s.n ? P.goldBg : P.bg2,
                border:`1px solid ${selectedSurah?.n===s.n ? P.gold : P.br2}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"system-ui", fontSize:10, fontWeight:700,
                color: selectedSurah?.n===s.n ? P.gold : P.ink3,
              }}>{s.n}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, fontWeight:700, color: selectedSurah?.n===s.n ? P.gold : P.ink1, fontFamily:"system-ui" }}>{s.en}</span>
                  <span style={{ fontSize:14, color: selectedSurah?.n===s.n ? P.gold : P.ink2, fontFamily:"'Cormorant Garamond',serif" }}>{s.ar}</span>
                </div>
                <div style={{ fontSize:10, color:P.ink3, fontFamily:"system-ui", marginTop:1 }}>
                  <span style={{ color: s.type==="Meccan" ? P.teal : "#c09060" }}>{s.revelation}</span>
                  &ensp;·&ensp;{s.verses}v
                  {selectedSurah?.n===s.n && <span style={{ color:P.gold, marginLeft:5 }}>Juz' {s.juz}</span>}
                </div>
                {s.fr && selectedSurah?.n===s.n && (
                  <div style={{ fontSize:9, color:P.pur, fontFamily:"system-ui", fontStyle:"italic", marginTop:2 }}>{s.fr}</div>
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
              <div style={{ width:34, height:34, borderRadius:8, flexShrink:0, marginRight:12, background:P.bg2, border:`1px solid ${P.br2}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:8, color:P.ink3, fontFamily:"system-ui", fontWeight:700, letterSpacing:"0.06em", lineHeight:1 }}>JUZ'</span>
                <span style={{ fontSize:13, color:P.gold, fontFamily:"'Cormorant Garamond',serif", fontWeight:700, lineHeight:1.1 }}>{j.n}</span>
              </div>
              <div>
                <div style={{ fontSize:13, color:P.ink1, fontFamily:"'Cormorant Garamond',serif", fontWeight:700 }}>{j.name}</div>
                <div style={{ fontSize:10, color:P.ink3, fontFamily:"system-ui", marginTop:1 }}>Starts: {ALL_SURAHS.find(s=>s.n===j.start.s)?.en} : {j.start.v}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ══ MAIN READER ═══════════════════════════════════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Toolbar */}
        <div style={{
          height:52, background:P.bg2, borderBottom:`1px solid ${P.br1}`,
          display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0
        }}>
          {selectedSurah ? (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700, color:P.ink1 }}>{selectedSurah.en}</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:P.gold }}>{selectedSurah.ar}</span>
                <span style={{ fontSize:9, color:P.ink3, fontFamily:"system-ui", background:P.bg3, border:`1px solid ${P.br2}`, borderRadius:5, padding:"2px 7px" }}>
                  {selectedSurah.verses} verses · Juz' {selectedSurah.juz}
                </span>
              </div>
              <div style={{ flex:1 }}/>

              {/* Font size */}
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <button onClick={() => setFontSize(f => Math.max(18,f-2))} style={{ width:24,height:24,borderRadius:5,border:`1px solid ${P.br2}`,background:P.bg3,color:P.ink2,cursor:"pointer",fontFamily:"system-ui",fontSize:12,fontWeight:700 }}>−</button>
                <span style={{ fontSize:10,color:P.ink3,fontFamily:"system-ui",width:26,textAlign:"center" }}>{fontSize}</span>
                <button onClick={() => setFontSize(f => Math.min(40,f+2))} style={{ width:24,height:24,borderRadius:5,border:`1px solid ${P.br2}`,background:P.bg3,color:P.ink2,cursor:"pointer",fontFamily:"system-ui",fontSize:12,fontWeight:700 }}>+</button>
              </div>

              {/* EXPL. global toggle */}
              <button onClick={() => setShowAllTrans(v => !v)} style={{
                padding:"4px 11px", borderRadius:6, cursor:"pointer",
                border:`1px solid ${showAllTrans ? P.tealBr : P.br2}`,
                background: showAllTrans ? P.tealBg : "transparent",
                color: showAllTrans ? P.teal : P.ink3,
                fontFamily:"system-ui", fontWeight:700, fontSize:10, transition:"all .15s",
                display:"flex", alignItems:"center", gap:4
              }}>
                {showAllTrans ? <Icon.Eye/> : <Icon.EyeOff/>} EXPL.
              </button>

              {/* PRON. global toggle — only when API returned data */}
              {loadingPron ? (
                <div style={{ padding:"4px 11px", borderRadius:6, border:`1px solid ${P.br2}`, background:"transparent", display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8,height:8,border:`1.5px solid ${P.purBg}`,borderTopColor:P.pur,borderRadius:"50%",animation:"spin .7s linear infinite" }}/>
                  <span style={{ fontSize:9, color:P.ink3, fontFamily:"system-ui" }}>Pron…</span>
                </div>
              ) : hasPron && (
                <button onClick={() => setShowAllPron(v => !v)} style={{
                  padding:"4px 11px", borderRadius:6, cursor:"pointer",
                  border:`1px solid ${showAllPron ? P.purBr : P.br2}`,
                  background: showAllPron ? P.purBg : "transparent",
                  color: showAllPron ? P.pur : P.ink3,
                  fontFamily:"system-ui", fontWeight:700, fontSize:10, transition:"all .15s",
                  display:"flex", alignItems:"center", gap:4
                }}>
                  {showAllPron ? <Icon.Eye/> : <Icon.EyeOff/>} Prononciation FR
                </button>
              )}
            </>
          ) : (
            <span style={{ fontSize:13, color:P.ink3, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>
              اختر سورة — Select a surah to begin reading
            </span>
          )}
        </div>

        {/* Reciter bar + full audio player */}
        {selectedSurah && (
          <div style={{
            background:P.bg0, borderBottom:`1px solid ${P.br2}`,
            padding:"12px 20px", flexShrink:0
          }}>
            {/* Reciter selector */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, flexWrap:"wrap" }}>
              <Icon.Volume/>
              <span style={{ fontSize:9, color:P.ink3, fontFamily:"system-ui", fontWeight:700, letterSpacing:"0.12em", marginRight:4 }}>RÉCITATEUR</span>
              {RECITERS.map(r => (
                <button key={r.id} onClick={() => setReciter(r.id)} className="reciter-btn" style={{
                  padding:"4px 12px", borderRadius:20,
                  border:`1px solid ${reciter===r.id ? P.gold : P.br2}`,
                  background: reciter===r.id ? P.goldBg : "transparent",
                  color: reciter===r.id ? P.gold : P.ink3,
                  fontFamily:"system-ui", fontSize:10,
                  fontWeight: reciter===r.id ? 700 : 400,
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
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:64, color:P.goldBr, lineHeight:1, marginBottom:8 }}>بِسْمِ اللَّهِ</div>
                <OrnamentDivider/>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:P.ink2, marginTop:12, fontStyle:"italic" }}>الرَّحْمَٰنِ الرَّحِيمِ</div>
                <div style={{ marginTop:28, fontSize:12, color:P.ink3, fontFamily:"system-ui", lineHeight:1.7, maxWidth:360 }}>
                  Select any surah from the list on the left to begin your reading session.
                  Use the toolbar to toggle pronunciation guides and translations.
                </div>
                <div style={{ marginTop:24, display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
                  {[{n:1,label:"Al-Fatiha"},{n:36,label:"Ya-Sin"},{n:67,label:"Al-Mulk"},{n:112,label:"Al-Ikhlas"}].map(q => (
                    <button key={q.n} onClick={() => loadSurah(ALL_SURAHS[q.n-1])} style={{
                      padding:"8px 18px", borderRadius:9,
                      border:`1px solid ${P.goldBr}`, background:P.goldBg,
                      color:P.gold, fontFamily:"system-ui", fontSize:12, fontWeight:700, cursor:"pointer"
                    }}>{q.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:14 }}>
              <div style={{ width:36,height:36,border:`2px solid ${P.goldBg}`,borderTopColor:P.gold,borderRadius:"50%",animation:"spin .8s linear infinite" }}/>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:P.ink3, fontStyle:"italic" }}>جارٍ التحميل...</div>
            </div>
          )}

          {/* Verses */}
          {selectedSurah && verses && !loading && (
            <div style={{ maxWidth:760, margin:"0 auto", padding:"32px 28px 80px" }}>

              {/* Surah header */}
              <div style={{
                textAlign:"center", marginBottom:36,
                background:P.bg2, border:`1px solid ${P.br1}`, borderRadius:16,
                padding:"28px 32px", position:"relative", overflow:"hidden"
              }}>
                {[0,1,2,3].map(i => (
                  <svg key={i} width="28" height="28" viewBox="0 0 28 28" style={{
                    position:"absolute",
                    top: i<2 ? 12 : "auto", bottom: i>=2 ? 12 : "auto",
                    left: i%2===0 ? 12 : "auto", right: i%2===1 ? 12 : "auto",
                    transform: i===1?"scaleX(-1)":i===2?"scaleY(-1)":i===3?"scale(-1,-1)":"none"
                  }}>
                    <path d="M2 2 Q10 2 10 10" fill="none" stroke={P.goldBr} strokeWidth="1.2"/>
                    <path d="M2 2 Q2 10 10 10" fill="none" stroke={P.goldBr} strokeWidth="1.2"/>
                    <circle cx="2" cy="2" r="1.5" fill={P.goldBr}/>
                  </svg>
                ))}
                <div style={{ fontFamily:"system-ui", fontSize:9, fontWeight:700, color:P.ink3, letterSpacing:"0.15em", marginBottom:10 }}>
                  {selectedSurah.revelation} · SURAH {selectedSurah.n} OF 114
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:700, color:P.gold, marginBottom:4, lineHeight:1.2 }}>
                  {selectedSurah.ar}
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:P.ink2, marginBottom:6 }}>
                  {selectedSurah.en}
                </div>
                {selectedSurah.fr && (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:8, background:P.purBg, border:`1px solid ${P.purBr}`, borderRadius:20, padding:"3px 13px" }}>
                    <span style={{ fontSize:10, color:P.ink3, fontFamily:"system-ui" }}>🗣</span>
                    <span style={{ fontSize:12, color:P.pur, fontFamily:"system-ui", fontStyle:"italic", fontWeight:700 }}>{selectedSurah.fr}</span>
                  </div>
                )}
                <div style={{ fontFamily:"system-ui", fontSize:11, color:P.ink3, fontStyle:"italic" }}>
                  {selectedSurah.meaning} · {selectedSurah.verses} verses
                </div>
                <OrnamentDivider/>
              </div>

              {/* Basmala */}
              {basmala && (
                <div style={{ textAlign:"center", marginBottom:28 }}>
                  <div style={{ display:"inline-block", padding:"14px 36px", background:P.goldBg, border:`1px solid ${P.goldBr}`, borderRadius:12 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:P.gold, lineHeight:1.9 }}>{basmala.ar}</div>
                    <div style={{ fontSize:9, color:P.ink3, fontFamily:"system-ui", letterSpacing:"0.08em", marginTop:4 }}>
                      BASMALA — In the name of Allah, the Most Gracious, the Most Merciful
                    </div>
                    <div style={{ fontSize:10, color:P.ink3, fontFamily:"system-ui", fontStyle:"italic", marginTop:2 }}>
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
                <div style={{ marginTop:12, fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:P.goldBr }}>
                  ﴾ {selectedSurah.ar} ﴿
                </div>
                {selectedSurah.n < 114 && (
                  <div style={{ marginTop:20 }}>
                    <button onClick={() => loadSurah(ALL_SURAHS[selectedSurah.n])} style={{
                      padding:"9px 22px", borderRadius:9,
                      border:`1px solid ${P.goldBr}`, background:P.goldBg,
                      color:P.gold, fontFamily:"system-ui", fontWeight:700, fontSize:12, cursor:"pointer",
                      display:"inline-flex", alignItems:"center", gap:8
                    }}>
                      Suivant : {ALL_SURAHS[selectedSurah.n].en} <Icon.ChevR/>
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