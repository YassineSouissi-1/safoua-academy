import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { speakArabic } from "../../utils/arabicTTS";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COURSE_TITLE = "Tajwid : Récitation Sacrée";

async function saveProgress(lessonKey) {
  try {
    await api.post("/api/update-progress", { lessonTitle: lessonKey });
  } catch (err) {
    console.error("Erreur de progression :", err);
  }
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;600;700;900&display=swap');`;

const C = {
  bg:       "#0d0a06",
  surface:  "#161009",
  panel:    "#1d1508",
  border:   "#2e2010",
  borderLt: "#3d2c14",
  gold:     "#c9870a",
  goldLt:   "#f0c040",
  goldDim:  "#6b4a08",
  cream:    "#f5e8c8",
  muted:    "#8a6f44",
  mutedLt:  "#b89a60",
  text:     "#ede0c4",
  white:    "#fdf6e3",
};

const RULES = [
  {
    id: "madd",
    ar: "المَدّ",
    fr: "La Prolongation",
    color: "#e8b84b",
    bg: "#e8b84b18",
    icon: "〜",
    shortDesc: "Allonger les voyelles longues",
    desc: "Le Madd consiste à allonger le son d'une voyelle longue (ا، و، ي). Il existe plusieurs types selon la durée et la cause.",
    types: [
      { name: "Madd Ṭabī'ī", ar: "مَدّ طَبِيعِي", dur: "2 temps", desc: "Allongement naturel, toujours présent avec les lettres de Madd sans cause supplémentaire." },
      { name: "Madd Wājib Muttaṣil", ar: "مَدّ وَاجِب مُتَّصِل", dur: "4–5 temps", desc: "Obligatoire quand la lettre de Madd est suivie d'un Hamza dans le même mot." },
      { name: "Madd Jā'iz Munfaṣil", ar: "مَدّ جَائِز مُنْفَصِل", dur: "2–5 temps", desc: "Permissible quand la lettre de Madd est suivie d'un Hamza dans un mot différent." },
      { name: "Madd Lāzim", ar: "مَدّ لَازِم", dur: "6 temps", desc: "Obligatoire quand une lettre de Madd est suivie d'une lettre portant un Sukun fixe." },
    ],
    examples: [
      {
        ar: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        note: "Madd Ṭabī'ī sur اللَّهُ (alif prolongé) — 2 temps",
        url: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
        words: [
          { w: "قُلْ", translit: "Qul", en: "Say", rule: "qalqala", label: "Qalqala" },
          { w: "هُوَ", translit: "hu-wa", en: "He is", rule: null },
          { w: "اللَّهُ", translit: "Al-lā-hu", en: "Allah", rule: "madd", label: "Madd 2t" },
          { w: "أَحَدٌ", translit: "a-ḥad", en: "the One", rule: "waqf", label: "Waqf" },
        ]
      },
      {
        ar: "اللَّهُ الصَّمَدُ",
        note: "Madd Ṭabī'ī sur اللَّهُ — alif prolongé 2 temps",
        url: "https://everyayah.com/data/Alafasy_128kbps/112002.mp3",
        words: [
          { w: "اللَّهُ", translit: "Al-lā-hu", en: "Allah", rule: "madd", label: "Madd 2t" },
          { w: "الصَّمَدُ", translit: "aṣ-Ṣa-mad", en: "the Eternal", rule: "waqf", label: "Waqf" },
        ]
      },
    ],
    testWord: "اللَّهُ",
    testTranslit: "Al-lā-hu",
    testInstruction: "Prononcez « Al-lā-hu » en allongeant clairement le son 'aa' — 2 temps",
    testHint: "Le 'aa' doit durer environ une seconde. Écoutez la référence d'abord.",
    testType: "duration",
    testUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
  },
  {
    id: "ghunnah",
    ar: "الغُنَّة",
    fr: "Le Son Nasal",
    color: "#5dcaa5",
    bg: "#5dcaa518",
    icon: "ن",
    shortDesc: "Son nasal de 2 temps sur نّ et مّ",
    desc: "La Ghunnah est un son nasal produit dans le nez, d'une durée de 2 temps. Elle accompagne toujours le Nūn et le Mīm portant une Shaddah.",
    types: [
      { name: "Ghunnah Kāmilah", ar: "غُنَّة كَامِلَة", dur: "2 temps", desc: "Son nasal complet sur نّ ou مّ avec Shaddah." },
      { name: "Ghunnah Nāqiṣah", ar: "غُنَّة نَاقِصَة", dur: "1 temps", desc: "Son nasal réduit dans certains cas d'assimilation." },
    ],
    examples: [
      {
        ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        note: "Ghunnah sur إِنَّا — نّ avec Shaddah, 2 temps de son nasal",
        url: "https://everyayah.com/data/Alafasy_128kbps/108001.mp3",
        words: [
          { w: "إِنَّا", translit: "In-nā", en: "Indeed We", rule: "ghunnah", label: "Ghunnah 2t" },
          { w: "أَعْطَيْنَاكَ", translit: "a'-ṭay-nā-ka", en: "have given you", rule: "madd", label: "Madd" },
          { w: "الْكَوْثَرَ", translit: "al-Kaw-thar", en: "al-Kawthar", rule: "waqf", label: "Waqf" },
        ]
      },
      {
        ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        note: "Ghunnah sur النَّاسِ — نّ avec Shaddah",
        url: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3",
        words: [
          { w: "قُلْ", translit: "Qul", en: "Say", rule: "qalqala", label: "Qalqala" },
          { w: "أَعُوذُ", translit: "a-'ū-dhu", en: "I seek refuge", rule: "madd", label: "Madd" },
          { w: "بِرَبِّ", translit: "bi-rab-bi", en: "in the Lord", rule: null },
          { w: "النَّاسِ", translit: "an-nā-si", en: "of mankind", rule: "ghunnah", label: "Ghunnah 2t" },
        ]
      },
    ],
    testWord: "إِنَّا",
    testTranslit: "In-nā",
    testInstruction: "Prononcez « In-nā » — maintenez 2 temps de résonance nasale sur le نّ",
    testHint: "Le son 'nn' doit vibrer dans le nez, comme un 'hmmm' bref. Bouche légèrement ouverte.",
    testType: "nasal",
    testUrl: "https://everyayah.com/data/Alafasy_128kbps/108001.mp3",
  },
  {
    id: "idgham",
    ar: "الإِدْغَام",
    fr: "L'Assimilation",
    color: "#ff8c94",
    bg: "#ff8c9418",
    icon: "⊕",
    shortDesc: "Fusionner deux lettres en une",
    desc: "L'Idgham consiste à fusionner une lettre dans celle qui la suit. Quand un Nūn sākin ou Tanwīn précède l'une des 6 lettres يرملون, la lettre s'assimile.",
    types: [
      { name: "Idgham bi-Ghunnah", ar: "إِدْغَام بِغُنَّة", dur: "avec son nasal", desc: "Assimilation avec Ghunnah. Lettres : ي، ن، م، و" },
      { name: "Idgham bilā Ghunnah", ar: "إِدْغَام بِلَا غُنَّة", dur: "sans son nasal", desc: "Assimilation sans Ghunnah. Lettres : ل، ر" },
    ],
    examples: [
      {
        ar: "مَن يَعْمَلْ مِثْقَالَ",
        note: "Idgham bi-Ghunnah: نْ + ي — fusion avec son nasal",
        url: "https://everyayah.com/data/Alafasy_128kbps/099007.mp3",
        words: [
          { w: "مَن", translit: "man", en: "whoever", rule: "idgham", label: "Idgham bi-G" },
          { w: "يَعْمَلْ", translit: "ya'-mal", en: "does", rule: null },
          { w: "مِثْقَالَ", translit: "mith-qā-la", en: "the weight", rule: "madd", label: "Madd" },
        ]
      },
      {
        ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        note: "Idgham bilā Ghunnah : مْ + يَ — fusion sans son nasal",
        url: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3",
        words: [
          { w: "لَمْ", translit: "lam", en: "He has not", rule: "idgham", label: "Idgham blG" },
          { w: "يَلِدْ", translit: "ya-lid", en: "begotten", rule: "qalqala", label: "Qalqala" },
          { w: "وَلَمْ", translit: "wa-lam", en: "nor has He", rule: "idgham", label: "Idgham blG" },
          { w: "يُولَدْ", translit: "yū-lad", en: "been begotten", rule: "qalqala", label: "Qalqala Kubrā" },
        ]
      },
    ],
    testWord: "مَن يَعْمَلْ",
    testTranslit: "man ya'-mal",
    testInstruction: "Prononcez « man ya'-mal » sans pause — le نْ se fond dans يَ avec Ghunnah",
    testHint: "Aucune pause entre 'man' et 'ya' — transition lisse avec légère résonance nasale.",
    testType: "blend",
    testUrl: "https://everyayah.com/data/Alafasy_128kbps/099007.mp3",
  },
  {
    id: "ikhfa",
    ar: "الإِخْفَاء",
    fr: "Le Voilement",
    color: "#afa9ec",
    bg: "#afa9ec18",
    icon: "◌",
    shortDesc: "Son entre l'izhar et l'idgham",
    desc: "L'Ikhfā' est un son intermédiaire entre la prononciation claire (Izhar) et l'assimilation (Idgham). Le Nūn sākin ou Tanwīn est 'voilé' devant 15 lettres spécifiques.",
    types: [
      { name: "Ikhfā' Ḥaqīqī", ar: "إِخْفَاء حَقِيقِي", dur: "2 temps", desc: "Voilement réel du Nūn sākin ou Tanwīn avec Ghunnah devant 15 lettres." },
      { name: "Ikhfā' Shafawī", ar: "إِخْفَاء شَفَوِي", dur: "2 temps", desc: "Voilement du Mīm sākin devant بَ." },
    ],
    examples: [
      {
        ar: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
        note: "Ikhfā': نْ + سَ dans الْإِنسَانَ — voilement devant س",
        url: "https://everyayah.com/data/Alafasy_128kbps/103002.mp3",
        words: [
          { w: "إِنَّ", translit: "in-na", en: "Indeed", rule: "ghunnah", label: "Ghunnah" },
          { w: "الْإِنسَانَ", translit: "al-in-sā-na", en: "mankind", rule: "ikhfa", label: "Ikhfa" },
          { w: "لَفِي", translit: "la-fī", en: "is in", rule: "madd", label: "Madd" },
          { w: "خُسْرٍ", translit: "khus-r", en: "loss", rule: "waqf", label: "Waqf" },
        ]
      },
      {
        ar: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
        note: "Ikhfā' Shafawī : مْ + نَ — Mīm sākin voilé devant نَ",
        url: "https://everyayah.com/data/Alafasy_128kbps/094001.mp3",
        words: [
          { w: "أَلَمْ", translit: "a-lam", en: "Did We not", rule: "ikhfa", label: "Ikhfa Shaf." },
          { w: "نَشْرَحْ", translit: "nash-raḥ", en: "expand", rule: null },
          { w: "لَكَ", translit: "la-ka", en: "for you", rule: null },
          { w: "صَدْرَكَ", translit: "ṣad-ra-ka", en: "your chest", rule: "qalqala", label: "Qalqala" },
        ]
      },
    ],
    testWord: "الْإِنسَانَ",
    testTranslit: "al-in-sā-na",
    testInstruction: "Prononcez « al-in-sā-na » — le نْ doit être voilé devant سَ, ni clair ni fusionné",
    testHint: "Son doux à mi-chemin : langue s'approche sans toucher, avec légère résonance nasale.",
    testType: "blend",
    testUrl: "https://everyayah.com/data/Alafasy_128kbps/103002.mp3",
  },
  {
    id: "qalqala",
    ar: "القَلْقَلَة",
    fr: "L'Écho / Vibration",
    color: "#f0a040",
    bg: "#f0a04018",
    icon: "◉",
    shortDesc: "Légère vibration sur ق ط ب ج د",
    desc: "La Qalqala est une légère vibration ou rebond sonore qui se produit sur les 5 lettres قطبجد quand elles portent un Sukun. Elle est plus forte en fin de verset.",
    types: [
      { name: "Qalqala Ṣughrā", ar: "قَلْقَلَة صُغْرَى", dur: "faible", desc: "Petite vibration au milieu d'un mot." },
      { name: "Qalqala Kubrā", ar: "قَلْقَلَة كُبْرَى", dur: "forte", desc: "Grande vibration en fin de verset, beaucoup plus prononcée." },
    ],
    examples: [
      {
        ar: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        note: "Qalqala Kubrā sur قُلْ — forte vibration sur قْ en fin de syllabe",
        url: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
        words: [
          { w: "قُلْ", translit: "Qul", en: "Say", rule: "qalqala", label: "Qalqala Kubrā" },
          { w: "هُوَ", translit: "hu-wa", en: "He is", rule: null },
          { w: "اللَّهُ", translit: "Al-lā-hu", en: "Allah", rule: "madd", label: "Madd 2t" },
          { w: "أَحَدٌ", translit: "a-ḥad", en: "the One", rule: "waqf", label: "Waqf" },
        ]
      },
      {
        ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        note: "Qalqala Ṣughrā sur يَلِدْ — Qalqala Kubrā sur يُولَدْ en fin d'ayah",
        url: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3",
        words: [
          { w: "لَمْ", translit: "lam", en: "He has not", rule: null },
          { w: "يَلِدْ", translit: "ya-lid", en: "begotten", rule: "qalqala", label: "Qalqala Ṣughrā" },
          { w: "وَلَمْ", translit: "wa-lam", en: "nor has He", rule: null },
          { w: "يُولَدْ", translit: "yū-lad", en: "been begotten", rule: "qalqala", label: "Qalqala Kubrā" },
        ]
      },
    ],
    testWord: "قُلْ",
    testTranslit: "Qul",
    testInstruction: "Prononcez « Qul » — le قْ doit avoir un rebond vibratoire audible",
    testHint: "Après le 'q', un léger 'uh' sort naturellement — c'est la Qalqala. Ne l'étouffez pas.",
    testType: "echo",
    testUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
  },
  {
    id: "izhar",
    ar: "الإِظْهَار",
    fr: "La Prononciation Claire",
    color: "#60c8e0",
    bg: "#60c8e018",
    icon: "◎",
    shortDesc: "Prononcer le نْ clairement",
    desc: "L'Izhar est la prononciation claire et distincte du Nūn sākin ou Tanwīn devant les 6 lettres de la gorge : ء ه ع ح غ خ. Aucun son nasal.",
    types: [
      { name: "Izhar Ḥalqī", ar: "إِظْهَار حَلْقِي", dur: "sans nasal", desc: "Prononciation claire devant les lettres gutturales ء ه ع ح غ خ — aucune Ghunnah." },
    ],
    examples: [
      {
        ar: "مِن كُلِّ أَمْرٍ",
        note: "Izhar : نْ + كُ — Nūn sākin clair devant ك (lettre gutturale proche)",
        url: "https://everyayah.com/data/Alafasy_128kbps/097004.mp3",
        words: [
          { w: "مِن", translit: "min", en: "of every", rule: "izhar", label: "Izhar" },
          { w: "كُلِّ", translit: "kul-li", en: "every", rule: null },
          { w: "أَمْرٍ", translit: "am-r", en: "matter", rule: "waqf", label: "Waqf" },
        ]
      },
      {
        ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        note: "Izhar : pas de nasalité entre رَبِّ et الْفَلَقِ",
        url: "https://everyayah.com/data/Alafasy_128kbps/113001.mp3",
        words: [
          { w: "قُلْ", translit: "Qul", en: "Say", rule: "qalqala", label: "Qalqala" },
          { w: "أَعُوذُ", translit: "a-'ū-dhu", en: "I seek refuge", rule: "madd", label: "Madd" },
          { w: "بِرَبِّ", translit: "bi-rab-bi", en: "in the Lord", rule: null },
          { w: "الْفَلَقِ", translit: "al-fa-laq", en: "of the daybreak", rule: "qalqala", label: "Qalqala" },
        ]
      },
    ],
    testWord: "مِن كُلِّ",
    testTranslit: "min kul-li",
    testInstruction: "Prononcez « min kul-li » — le نْ doit sonner clair, sans résonance nasale",
    testHint: "Son net, articulé — pas de 'mm' ou 'ng'. La langue touche le palais puis détache.",
    testType: "clear",
    testUrl: "https://everyayah.com/data/Alafasy_128kbps/097004.mp3",
  },
  {
    id: "iqlab",
    ar: "الإِقْلَاب",
    fr: "La Transformation",
    color: "#e07060",
    bg: "#e0706018",
    icon: "⟲",
    shortDesc: "نْ devient un son مْ devant بَ",
    desc: "L'Iqlab est la transformation du Nūn sākin ou Tanwīn en un son proche du Mīm, accompagné d'une légère Ghunnah, quand il est suivi de la lettre بَ.",
    types: [
      { name: "Iqlab", ar: "إِقْلَاب", dur: "2 temps nasal", desc: "Le نْ se transforme en son مْ avec Ghunnah devant بَ. Unique règle de ce type." },
    ],
    examples: [
      {
        ar: "مِن بَعْدِ مَا جَاءَكَ",
        note: "Iqlab : نْ + بَ → son مْ nasal, 2 temps",
        url: "https://everyayah.com/data/Alafasy_128kbps/002145.mp3",
        words: [
          { w: "مِن", translit: "mim", en: "after", rule: "iqlab", label: "Iqlab" },
          { w: "بَعْدِ", translit: "ba'-di", en: "after", rule: null },
          { w: "مَا", translit: "mā", en: "what", rule: "madd", label: "Madd" },
          { w: "جَاءَكَ", translit: "jā-'a-ka", en: "has come to you", rule: "madd", label: "Madd" },
        ]
      },
      {
        ar: "لَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        note: "Iqlab absent ici — mais مْ + يَ = Idgham bilā Ghunnah",
        url: "https://everyayah.com/data/Alafasy_128kbps/112004.mp3",
        words: [
          { w: "لَمْ", translit: "lam", en: "There is not", rule: "idgham", label: "Idgham blG" },
          { w: "يَكُن", translit: "ya-kun", en: "for Him", rule: null },
          { w: "لَّهُ", translit: "la-hu", en: "any", rule: null },
          { w: "كُفُوًا", translit: "ku-fu-wan", en: "equal", rule: "waqf", label: "Waqf" },
          { w: "أَحَدٌ", translit: "a-ḥad", en: "one", rule: "waqf", label: "Waqf" },
        ]
      },
    ],
    testWord: "مِن بَعْدِ",
    testTranslit: "mim ba'-di",
    testInstruction: "Prononcez « mim ba'-di » — lèvres fermées, son nasal avant le بَ",
    testHint: "Les lèvres se ferment brièvement comme pour 'mmm' avant d'ouvrir sur 'ba'. 2 temps.",
    testType: "nasal",
    testUrl: "https://everyayah.com/data/Alafasy_128kbps/002145.mp3",
  },
  {
    id: "waqf",
    ar: "الوَقْف",
    fr: "L'Arrêt",
    color: "#98c870",
    bg: "#98c87018",
    icon: "◼",
    shortDesc: "S'arrêter correctement en récitation",
    desc: "Le Waqf est l'art de s'arrêter à la bonne place pendant la récitation. L'arrêt doit respecter le sens du verset et les règles grammaticales. La voyelle finale disparaît à l'arrêt.",
    types: [
      { name: "Waqf Tāmm", ar: "وَقْف تَامّ", dur: "arrêt complet", desc: "Arrêt complet là où la phrase est terminée — sens et syntaxe complets. Idéal." },
      { name: "Waqf Kāfī", ar: "وَقْف كَافِي", dur: "arrêt suffisant", desc: "Arrêt suffisant — sens complet mais lien syntaxique avec la suite." },
      { name: "Waqf Ḥasan", ar: "وَقْف حَسَن", dur: "bel arrêt", desc: "Bel arrêt sur un mot dont le sens est acceptable, mais qui se continue naturellement." },
      { name: "Waqf Qabīḥ", ar: "وَقْف قَبِيح", dur: "mauvais arrêt", desc: "Arrêt mauvais qui déforme le sens — à éviter absolument." },
    ],
    examples: [
      {
        ar: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        note: "Waqf Tāmm sur أَحَدٌ — voyelle finale disparaît : 'aḥad' pas 'aḥadun'",
        url: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
        words: [
          { w: "قُلْ", translit: "Qul", en: "Say", rule: "qalqala", label: "Qalqala" },
          { w: "هُوَ", translit: "hu-wa", en: "He is", rule: null },
          { w: "اللَّهُ", translit: "Al-lā-hu", en: "Allah", rule: "madd", label: "Madd" },
          { w: "أَحَدٌ", translit: "a-ḥad", en: "the One", rule: "waqf", label: "Waqf Tāmm" },
        ]
      },
      {
        ar: "اللَّهُ الصَّمَدُ",
        note: "Waqf Tāmm sur الصَّمَدُ — 'aṣ-Ṣamad' (sans -u final)",
        url: "https://everyayah.com/data/Alafasy_128kbps/112002.mp3",
        words: [
          { w: "اللَّهُ", translit: "Al-lā-hu", en: "Allah", rule: "madd", label: "Madd" },
          { w: "الصَّمَدُ", translit: "aṣ-Ṣa-mad", en: "the Eternal", rule: "waqf", label: "Waqf Tāmm" },
        ]
      },
    ],
    testWord: "أَحَدٌ",
    testTranslit: "a-ḥad",
    testInstruction: "Prononcez puis arrêtez net sur « a-ḥad » — la voyelle finale -un disparaît",
    testHint: "Finissez sur 'd' (aḥad), pas sur 'dun' (aḥadun). Coupure nette, pas de traîne.",
    testType: "stop",
    testUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
  },
];

const ANNOTATED_AYAHS = [
  {
    ref: "Al-Fātiḥa 1:1",
    ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful",
    url: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
    words: [
      { w: "بِسْمِ", translit: "bis-mi", en: "In the name", rule: null },
      { w: "اللَّهِ", translit: "Al-lā-hi", en: "of Allah", rule: "madd", label: "Madd 2t" },
      { w: "الرَّحْمَٰنِ", translit: "ar-Raḥ-mā-ni", en: "the Most Gracious", rule: "madd", label: "Madd 2t" },
      { w: "الرَّحِيمِ", translit: "ar-Ra-ḥī-mi", en: "the Most Merciful", rule: "madd", label: "Madd 2t" },
    ],
  },
  {
    ref: "Al-Ikhlāṣ 112:1",
    ar: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Say: He is Allah, the One",
    url: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
    words: [
      { w: "قُلْ", translit: "Qul", en: "Say", rule: "qalqala", label: "Qalqala" },
      { w: "هُوَ", translit: "hu-wa", en: "He is", rule: null },
      { w: "اللَّهُ", translit: "Al-lā-hu", en: "Allah", rule: "madd", label: "Madd 2t" },
      { w: "أَحَدٌ", translit: "a-ḥad", en: "the One", rule: "waqf", label: "Waqf" },
    ],
  },
  {
    ref: "Al-Ikhlāṣ 112:3–4",
    ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    translation: "He neither begot nor was begotten",
    url: "https://everyayah.com/data/Alafasy_128kbps/112003.mp3",
    words: [
      { w: "لَمْ", translit: "lam", en: "not", rule: "idgham", label: "Idgham blG" },
      { w: "يَلِدْ", translit: "ya-lid", en: "begotten", rule: "qalqala", label: "Qalqala Ṣ." },
      { w: "وَلَمْ", translit: "wa-lam", en: "nor", rule: "idgham", label: "Idgham blG" },
      { w: "يُولَدْ", translit: "yū-lad", en: "was begotten", rule: "qalqala", label: "Qalqala K." },
    ],
  },
  {
    ref: "An-Nās 114:1",
    ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    translation: "Say: I seek refuge in the Lord of mankind",
    url: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3",
    words: [
      { w: "قُلْ", translit: "Qul", en: "Say", rule: "qalqala", label: "Qalqala" },
      { w: "أَعُوذُ", translit: "a-'ū-dhu", en: "I seek refuge", rule: "madd", label: "Madd" },
      { w: "بِرَبِّ", translit: "bi-rab-bi", en: "in the Lord", rule: null },
      { w: "النَّاسِ", translit: "an-nā-si", en: "of mankind", rule: "ghunnah", label: "Ghunnah 2t" },
    ],
  },
  {
    ref: "Al-Kawthar 108:1",
    ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    translation: "Indeed, We have granted you al-Kawthar",
    url: "https://everyayah.com/data/Alafasy_128kbps/108001.mp3",
    words: [
      { w: "إِنَّا", translit: "In-nā", en: "Indeed We", rule: "ghunnah", label: "Ghunnah 2t" },
      { w: "أَعْطَيْنَاكَ", translit: "a'-ṭay-nā-ka", en: "have given you", rule: "madd", label: "Madd" },
      { w: "الْكَوْثَرَ", translit: "al-Kaw-thar", en: "al-Kawthar", rule: "waqf", label: "Waqf" },
    ],
  },
];

const RULE_COLORS = Object.fromEntries(RULES.map((r) => [r.id, r.color]));

const GS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Cairo', sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: ${C.surface}; }
  ::-webkit-scrollbar-thumb { background: ${C.goldDim}; border-radius: 3px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes wordGlow { 0%,100% { text-shadow: none; } 50% { text-shadow: 0 0 16px var(--wc, #c9870a); } }
`;

// ─── AUDIO HOOK ───────────────────────────────────────────────────────────────
function useAudio() {
  const ref = useRef(null);
  const timers = useRef([]);
  const clipTimer = useRef(null);
  const [state, setState] = useState({ playing: null, loading: null, error: null, progress: 0, wordIdx: -1 });

  const clearT = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const stop = useCallback(() => {
    if (clipTimer.current) { clearTimeout(clipTimer.current); clipTimer.current = null; }
    if (ref.current) { ref.current.pause(); ref.current.src = ""; ref.current = null; }
    clearT();
    setState({ playing: null, loading: null, error: null, progress: 0, wordIdx: -1 });
  }, []);

  // maxDuration: clip playback to N ms (for reference snippets — everyayah serves full ayahs)
  const play = useCallback((url, wordCount = 0, maxDuration = 0) => {
    if (state.playing === url) { stop(); return; }
    stop();
    setState(s => ({ ...s, loading: url, error: null }));
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    ref.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        const clampDur = maxDuration > 0 ? Math.min(audio.duration, maxDuration / 1000) : audio.duration;
        setState(s => ({ ...s, progress: audio.currentTime / clampDur }));
      }
    });

    audio.oncanplaythrough = () => {
      setState(s => ({ ...s, loading: null, playing: url }));
      audio.play().catch(() => setState(s => ({ ...s, error: url, loading: null, playing: null })));
    };

    audio.onplay = () => {
      // Auto-stop after maxDuration ms if set
      if (maxDuration > 0) {
        clipTimer.current = setTimeout(() => stop(), maxDuration);
      }
      if (wordCount > 0) {
        const schedule = () => {
          const totalDur = maxDuration > 0
            ? Math.min((audio.duration || 4) * 1000, maxDuration)
            : (audio.duration || 4) * 1000;
          const interval = totalDur / wordCount;
          for (let i = 0; i < wordCount; i++) {
            const t = setTimeout(() => setState(s => ({ ...s, wordIdx: i })), i * interval);
            timers.current.push(t);
          }
        };
        if (audio.duration) schedule();
        else { const t = setTimeout(schedule, 300); timers.current.push(t); }
      }
    };

    audio.onerror = () => setState(s => ({ ...s, error: url, loading: null, playing: null }));
    audio.onended = () => { setState(s => ({ ...s, playing: null, wordIdx: -1, progress: 0 })); clearT(); };
    audio.load();
  }, [state.playing, stop]);

  useEffect(() => () => stop(), []);
  return { ...state, play, stop };
}

// ─── MIC HOOK — MediaRecorder + WebAudio analysis ────────────────────────────
function useMic() {
  const [micState, setMicState] = useState("idle");
  const [result, setResult] = useState(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const analyserRef = useRef(null);
  const ctxRef = useRef(null);
  const framesRef = useRef([]);
  const rafRef = useRef(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try { recorderRef.current.stop(); } catch {}
    }
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (ctxRef.current && ctxRef.current.state !== "closed") ctxRef.current.close().catch(() => {});
    streamRef.current = null; recorderRef.current = null; ctxRef.current = null; analyserRef.current = null;
  }, []);

  const analyzeFrames = useCallback((frames, testType) => {
    if (!frames || frames.length === 0) {
      return { score: 0, feedback: "Aucun son détecté. Parlez plus fort.", tip: "Approchez-vous du micro et parlez clairement.", good: false };
    }

    const rmsValues = frames.map(f => f.rms);
    const maxRms = Math.max(...rmsValues);

    // Adaptive noise floor: median of bottom 25% is ambient noise
    const sorted = [...rmsValues].sort((a, b) => a - b);
    const noiseFloor = sorted[Math.floor(sorted.length * 0.25)] || 0;
    // Speech threshold: clearly above noise (at least 2x noise, min 3)
    const speechThreshold = Math.max(noiseFloor * 2, 3);

    const speechFrames = frames.filter(f => f.rms > speechThreshold);
    const speechRatio = speechFrames.length / frames.length;

    if (maxRms < 2.5 || speechFrames.length < 4) {
      return { score: 0, feedback: "Micro non détecté ou son trop faible.", tip: "Vérifiez les permissions micro et parlez clairement.", good: false, speechRatio: 0 };
    }
    if (speechRatio < 0.12) {
      return { score: 25, feedback: "Prononciation trop courte ou silencieuse.", tip: "Parlez dès que l'enregistrement commence, maintenez le son.", good: false, speechRatio };
    }

    const avgRms = speechFrames.reduce((s, f) => s + f.rms, 0) / speechFrames.length;
    const rmsStd = Math.sqrt(speechFrames.reduce((s, f) => s + (f.rms - avgRms) ** 2, 0) / speechFrames.length);
    // Steadiness 0–1: lower std relative to mean = steadier
    const steadiness = Math.max(0, Math.min(1, 1 - rmsStd / (avgRms + 0.5)));
    const avgNasalRatio = speechFrames.reduce((s, f) => s + f.nasalRatio, 0) / speechFrames.length;
    // Duration score 0–1: 50% speech = full score (recording is 4s, word takes ~1-2s)
    const durationScore = Math.min(1, speechRatio / 0.5);

    // BASE SCORE — any clear speech attempt gets at least 55
    // This prevents the system from penalizing people who simply speak normally
    const basePresence = Math.min(40, speechRatio * 80);      // up to 40 pts for speech presence
    const baseVolume = Math.min(20, avgRms * 1.5);            // up to 20 pts for good volume
    const baseScore = Math.round(basePresence + baseVolume);  // 0–60 base

    let score = 0, feedback = "", tip = "";

    if (testType === "duration") {
      // Reward: sustained sound. Need speechRatio ≥ 0.45 for full marks.
      const sustain = Math.min(1, speechRatio / 0.45);
      const steady = steadiness;
      score = Math.round(baseScore * 0.4 + sustain * 40 + steady * 20);
      score = Math.min(100, Math.max(25, score));
      if (speechRatio < 0.35) {
        feedback = "Maintenez le son plus longtemps — au moins 1,5 seconde.";
        tip = "Inspirez bien, puis tenez 'Al-laaaa-hu' sans couper.";
      } else if (steadiness < 0.35) {
        feedback = "Son présent mais instable — volume irrégulier.";
        tip = "Maintenez une pression d'air constante pendant toute la voyelle.";
      } else {
        feedback = score >= 80 ? "Excellent ! Madd clair et bien soutenu." : score >= 65 ? "Bien — allongez encore légèrement." : "Continuez à pratiquer la prolongation.";
        tip = score < 80 ? "La voyelle 'aa' doit durer comme une note tenue." : "";
      }

    } else if (testType === "nasal") {
      // Nasal: reward nasalRatio > 0.25 AND speech presence. Most people get this with "Inn-aa".
      // Microphone variation is huge so we're generous — if they spoke AND have any nasal, pass.
      const nasalPresent = avgNasalRatio > 0.2 ? 1 : avgNasalRatio / 0.2;
      score = Math.round(baseScore * 0.5 + nasalPresent * 30 + durationScore * 20);
      score = Math.min(100, Math.max(25, score));
      if (speechRatio >= 0.15 && avgNasalRatio < 0.15) {
        feedback = "Son prononcé mais résonance nasale peu marquée.";
        tip = "Bloquez légèrement le nez en prononçant — le son doit changer. Humm puis parlez.";
      } else if (speechRatio >= 0.15) {
        feedback = score >= 75 ? "Bonne Ghunnah ! Résonance nasale présente." : score >= 55 ? "Son nasal détecté — accentuez-le encore." : "Laissez vibrer le 'nnn' dans les narines.";
        tip = score < 75 ? "La résonance nasale doit être clairement audible pendant 2 temps." : "";
      } else {
        feedback = "Prononciation trop brève pour analyser la nasalité.";
        tip = "Maintenez le son 'Inn-nnn-aa' en tenant le 'nnn'.";
      }

    } else if (testType === "echo") {
      // Qalqala: short sharp sound — any clear short utterance scores well
      // Penalize only if speech is too faint or too long (dragged out)
      const isSharp = speechRatio < 0.4 ? 1 : Math.max(0, 1 - (speechRatio - 0.4) * 2);
      score = Math.round(baseScore * 0.6 + isSharp * 25 + steadiness * 15);
      score = Math.min(100, Math.max(25, score));
      feedback = score >= 75 ? "Bonne Qalqala ! Rebond net." : score >= 55 ? "Son correct — ajoutez un léger rebond sur قْ." : "Prononcez plus fort avec un petit rebond.";
      tip = score < 75 ? "Comme claquer la langue : blocage bref de l'air puis explosion sur قْ." : "";

    } else if (testType === "blend") {
      // Smooth transition — steady volume = good blend. Just reward clear present speech.
      score = Math.round(baseScore * 0.5 + steadiness * 30 + durationScore * 20);
      score = Math.min(100, Math.max(25, score));
      feedback = score >= 75 ? "Fusion lisse ! Transition réussie." : score >= 55 ? "Correct — évitez toute pause entre les sons." : "Liez les sons sans aucune coupure ni silence.";
      tip = score < 75 ? "Prononcez d'une seule traite, sans reprendre votre souffle entre les deux sons." : "";

    } else if (testType === "stop") {
      // Clean stop: look for clear dropoff at end vs beginning
      const midpoint = Math.floor(speechFrames.length * 0.6);
      const firstHalf = speechFrames.slice(0, midpoint);
      const lastQuarter = frames.slice(-Math.ceil(frames.length * 0.2));
      const firstAvg = firstHalf.length ? firstHalf.reduce((s, f) => s + f.rms, 0) / firstHalf.length : 0;
      const lastAvg = lastQuarter.reduce((s, f) => s + f.rms, 0) / lastQuarter.length;
      // Good stop = last part is much quieter than first
      const dropoff = firstAvg > 0 ? Math.min(1, Math.max(0, 1 - lastAvg / (firstAvg + 0.1))) : 0.5;
      score = Math.round(baseScore * 0.4 + dropoff * 40 + durationScore * 20);
      score = Math.min(100, Math.max(25, score));
      feedback = score >= 75 ? "Arrêt net ! Waqf bien exécuté." : score >= 55 ? "Bon arrêt — coupez plus franchement à la fin." : "Terminez le son brusquement sans traîner.";
      tip = score < 75 ? "Prononcez 'a-ḥad' puis fermez la bouche net — pas de '-un' final." : "";

    } else if (testType === "clear") {
      // Clear articulation: high-freq consonants + absence of excessive nasality
      const avgHighFreq = speechFrames.reduce((s, f) => s + f.highFreq, 0) / speechFrames.length;
      const crispness = Math.min(1, avgHighFreq / 35);
      const notNasal = avgNasalRatio < 0.35 ? 1 : Math.max(0, 1 - (avgNasalRatio - 0.35) * 3);
      score = Math.round(baseScore * 0.4 + crispness * 35 + notNasal * 25);
      score = Math.min(100, Math.max(25, score));
      feedback = score >= 75 ? "Prononciation claire et nette !" : score >= 55 ? "Correct — articulez encore plus distinctement." : "Prononcez le نْ net, sans résonance nasale.";
      tip = score < 75 ? "Articulez clairement chaque consonne — langue active, pas de traîne nasale." : "";

    } else {
      score = Math.round(baseScore * 0.6 + steadiness * 25 + durationScore * 15);
      score = Math.min(100, Math.max(25, score));
      feedback = score >= 65 ? "Bonne récitation !" : "Continuez à pratiquer.";
      tip = "";
    }

    return { score, feedback, tip, good: score >= 70, speechRatio, speechFrames: speechFrames.length };
  }, []);

  const record = useCallback(async (durationMs = 4000, testType = "duration") => {
    stop();
    setResult(null);
    setMicState("requesting");
    framesRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);

      // Analyser for feature extraction
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      src.connect(analyser);
      analyserRef.current = analyser;

      const freqBinCount = analyser.frequencyBinCount;
      const freqData = new Uint8Array(freqBinCount);
      const timeData = new Uint8Array(analyser.fftSize);

      // Hz per bin
      const binHz = (ctx.sampleRate / 2) / freqBinCount;
      // Nasal resonance: ~100–500 Hz (bins ~2–11)
      const nasalLow = Math.round(100 / binHz);
      const nasalHigh = Math.round(500 / binHz);
      // High freq for clarity: ~2000–4000 Hz
      const hiLow = Math.round(2000 / binHz);
      const hiHigh = Math.round(4000 / binHz);

      setMicState("recording");

      const collectFrame = () => {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);

        // RMS from time domain
        let sumSq = 0;
        for (let i = 0; i < timeData.length; i++) sumSq += (timeData[i] - 128) ** 2;
        const rms = Math.sqrt(sumSq / timeData.length);

        // Nasal energy
        let nasalSum = 0;
        for (let i = nasalLow; i <= nasalHigh; i++) nasalSum += freqData[i];
        const nasalEnergy = nasalSum / (nasalHigh - nasalLow + 1);

        // High freq energy (consonant clarity)
        let hiSum = 0;
        for (let i = hiLow; i <= Math.min(hiHigh, freqBinCount - 1); i++) hiSum += freqData[i];
        const highFreq = hiSum / (Math.min(hiHigh, freqBinCount - 1) - hiLow + 1);

        // Total energy (all voiced freq 80–3000 Hz)
        let totalSum = 0;
        const totalLow = Math.round(80 / binHz);
        const totalHigh = Math.round(3000 / binHz);
        for (let i = totalLow; i <= Math.min(totalHigh, freqBinCount - 1); i++) totalSum += freqData[i];
        const totalEnergy = totalSum / (Math.min(totalHigh, freqBinCount - 1) - totalLow + 1);

        const nasalRatio = totalEnergy > 5 ? nasalEnergy / (totalEnergy + 1) : 0;

        framesRef.current.push({ rms, nasalRatio, highFreq, time: ctx.currentTime });
        rafRef.current = requestAnimationFrame(collectFrame);
      };
      collectFrame();

      setTimeout(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        if (ctxRef.current && ctxRef.current.state !== "closed") ctxRef.current.close().catch(() => {});

        setMicState("analyzing");
        // Short delay so UI updates before heavy analysis
        setTimeout(() => {
          const res = analyzeFrames(framesRef.current, testType);
          setResult(res);
          setMicState("done");
        }, 80);
      }, durationMs);

    } catch {
      setMicState("error");
      setResult({ score: 0, feedback: "Microphone non accessible.", tip: "Autorisez l'accès au microphone dans les paramètres du navigateur.", good: false });
    }
  }, [stop, analyzeFrames]);

  const reset = useCallback(() => { stop(); setMicState("idle"); setResult(null); framesRef.current = []; }, [stop]);
  return { micState, result, record, reset };
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function Btn({ children, onClick, color = C.gold, outline = false, small = false, disabled = false, style: extra = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: outline ? "transparent" : color,
      color: outline ? color : C.bg,
      border: `1.5px solid ${color}`,
      borderRadius: 30, padding: small ? "5px 14px" : "8px 20px",
      fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: small ? 12 : 13,
      cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
      transition: "all 0.2s", whiteSpace: "nowrap", ...extra,
    }}>
      {children}
    </button>
  );
}

// maxDuration in ms — clips long ayahs to just the relevant portion for reference
function PlayBtn({ url, label, audio, small = false, maxDuration = 0 }) {
  const isP = audio.playing === url;
  const isL = audio.loading === url;
  const isE = audio.error === url;
  return (
    <Btn onClick={() => audio.play(url, 0, maxDuration)} color={isE ? "#e06050" : isP ? C.goldLt : C.gold} small={small} style={{ minWidth: 90 }}>
      {isL
        ? <span style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${C.bg}44`, borderTop: `2px solid ${C.bg}`, display: "inline-block", animation: "spin 0.7s linear infinite" }} />
        : isP ? "⏸" : "▶"}
      {isL ? "…" : isE ? "Erreur" : isP ? "Pause" : label}
    </Btn>
  );
}

function ScoreMeter({ score, color }) {
  const r = 30, circ = 2 * Math.PI * r;
  const fill = circ * (1 - score / 100);
  return (
    <svg width={80} height={80} viewBox="0 0 80 80">
      <circle cx={40} cy={40} r={r} fill="none" stroke={C.border} strokeWidth={7} />
      <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={fill}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x={40} y={45} textAnchor="middle" fill={color} fontFamily="Cairo" fontWeight={900} fontSize={18}>
        {score}
      </text>
    </svg>
  );
}

// ─── WAVEFORM BAR DISPLAY ──────────────────────────────────────────────────────
function WaveformDisplay({ color }) {
  const [bars, setBars] = useState(Array(28).fill(4));
  useEffect(() => {
    const id = setInterval(() => {
      setBars(prev => prev.map(() => 4 + Math.random() * 28));
    }, 90);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center", height: 44, padding: "0 8px", background: C.surface, borderRadius: 10 }}>
      {bars.map((h, i) => (
        <span key={i} style={{ flex: 1, borderRadius: 2, background: color, height: `${h}px`, transition: "height 0.09s ease" }} />
      ))}
      <span style={{ marginLeft: 8, fontSize: 11, color, fontWeight: 800, whiteSpace: "nowrap", animation: "pulse 1s infinite" }}>● REC</span>
    </div>
  );
}

// ─── VOICE TEST PANEL ─────────────────────────────────────────────────────────
function VoiceTest({ rule, audio }) {
  const mic = useMic();
  const [countdown, setCountdown] = useState(null);
  const countRef = useRef(null);

  const handleRecord = () => {
    setCountdown(3);
    let c = 3;
    countRef.current = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(countRef.current);
        setCountdown(null);
        mic.record(4000, rule.testType);
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  useEffect(() => () => clearInterval(countRef.current), []);

  const isIdle = mic.micState === "idle" || mic.micState === "error";
  const isDone = mic.micState === "done";

  return (
    <div style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 20, marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${rule.color}22`, border: `1.5px solid ${rule.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎤</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: C.cream }}>Test de Voix</div>
          <div style={{ fontSize: 11, color: C.muted }}>4 secondes d'enregistrement</div>
        </div>
      </div>

      {/* Word to pronounce */}
      <div style={{ textAlign: "center", background: C.surface, borderRadius: 12, padding: "14px 20px", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Amiri',serif", fontSize: "2rem", color: rule.color, marginBottom: 4, lineHeight: 1.4 }}>{rule.testWord}</div>
        <button
          onClick={() => speakArabic(rule.testWord, { rate: 0.72 })}
          style={{ background: rule.color + "22", border: "1.5px solid " + rule.color + "55", color: rule.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}
        >
          🔊 Écouter la prononciation
        </button>
        <div style={{ fontSize: 13, color: C.mutedLt, fontWeight: 700, marginBottom: 6, letterSpacing: 1, fontStyle: "italic" }}>{rule.testTranslit}</div>
        <div style={{ fontSize: 12, color: C.text, fontWeight: 600, lineHeight: 1.7 }}>{rule.testInstruction}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 6, fontStyle: "italic" }}>💡 {rule.testHint}</div>
      </div>

      {/* Step 1: listen */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, background: C.surface, borderRadius: 10, padding: "10px 14px", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>① Écouter d'abord :</span>
        <PlayBtn url={rule.testUrl} label="Référence" audio={audio} small maxDuration={5500} />
        <span style={{ fontSize: 11, color: C.muted }}>② puis enregistrez</span>
      </div>

      {/* Countdown */}
      {countdown !== null && (
        <div style={{ textAlign: "center", padding: "18px 0", fontSize: "2.8rem", fontWeight: 900, color: rule.color, animation: "pulse 0.5s ease" }}>
          {countdown}
        </div>
      )}

      {/* Waveform during recording */}
      {mic.micState === "recording" && (
        <div style={{ marginBottom: 14 }}>
          <WaveformDisplay color={rule.color} />
        </div>
      )}

      {/* Analyzing */}
      {mic.micState === "analyzing" && (
        <div style={{ textAlign: "center", padding: 16, color: C.muted, fontSize: 12 }}>
          <span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginRight: 8 }}>⟳</span>
          Analyse en cours…
        </div>
      )}

      {/* Error */}
      {mic.micState === "error" && (
        <div style={{ padding: 12, background: "#e0706018", borderRadius: 10, fontSize: 12, color: "#e07060", marginBottom: 14 }}>
          {mic.result?.feedback} {mic.result?.tip && `— ${mic.result.tip}`}
        </div>
      )}

      {/* Result */}
      {isDone && mic.result && (
        <div style={{ display: "flex", gap: 16, alignItems: "center", background: C.surface, borderRadius: 12, padding: 16, marginBottom: 14, animation: "fadeIn 0.3s ease" }}>
          <ScoreMeter score={mic.result.score} color={mic.result.good ? "#5dcaa5" : mic.result.score >= 50 ? C.gold : "#e07060"} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: mic.result.good ? "#5dcaa5" : mic.result.score >= 50 ? C.gold : "#e07060", marginBottom: 6 }}>
              {mic.result.good ? "✓ " : mic.result.score >= 50 ? "◎ " : "✗ "}{mic.result.feedback}
            </div>
            {mic.result.tip && <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>👉 {mic.result.tip}</div>}
            {mic.result.speechFrames != null && (
              <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>
                Signal détecté : {Math.round((mic.result.speechRatio || 0) * 100)}% de l'enregistrement
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(isIdle || isDone) && countdown === null && (
          <Btn onClick={handleRecord} color={rule.color}>
            🎤 {isDone ? "Réessayer" : "Commencer (4s)"}
          </Btn>
        )}
        {mic.micState === "recording" && (
          <Btn onClick={mic.reset} color="#e07060">⏹ Arrêter</Btn>
        )}
        {isDone && (
          <Btn onClick={mic.reset} outline color={C.muted} small>Réinitialiser</Btn>
        )}
      </div>
    </div>
  );
}

// ─── RULE DETAIL PAGE ─────────────────────────────────────────────────────────
function RuleDetail({ rule, onBack, audio, isDone, onMarkDone }) {
  const [tab, setTab] = useState("learn");

  return (
    <div style={{ animation: "fadeIn 0.25s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← Retour
      </button>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: rule.bg, border: `2px solid ${rule.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Amiri',serif", fontSize: "2rem", color: rule.color, flexShrink: 0 }}>
          {rule.icon}
        </div>
        <div>
          <div style={{ fontFamily: "'Amiri',serif", fontSize: "1.8rem", color: rule.color, lineHeight: 1.2 }}>{rule.ar}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: C.cream }}>{rule.fr}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{rule.shortDesc}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: `1.5px solid ${C.border}`, marginBottom: 24 }}>
        {[["learn", "📖 Apprendre"], ["examples", "🎧 Écouter"], ["test", "🎤 Tester"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: "none", border: "none", borderBottom: tab === k ? `2.5px solid ${rule.color}` : "2.5px solid transparent",
            padding: "10px 20px", color: tab === k ? rule.color : C.muted,
            fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all 0.2s", marginBottom: -1.5,
          }}>{l}</button>
        ))}
      </div>

      {tab === "learn" && (
        <div style={{ animation: "fadeIn 0.2s ease" }}>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: C.text, marginBottom: 24, background: C.panel, padding: "16px 20px", borderRadius: 14, borderLeft: `3px solid ${rule.color}` }}>
            {rule.desc}
          </p>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Types</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {rule.types.map((t, i) => (
              <div key={i} style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr auto", gap: "8px 16px", alignItems: "start" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: C.cream, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontFamily: "'Amiri',serif", fontSize: "1.1rem", color: rule.color, marginBottom: 6 }}>{t.ar}</div>
                  <div style={{ fontSize: 13, color: C.mutedLt, lineHeight: 1.7 }}>{t.desc}</div>
                </div>
                <div style={{ background: rule.bg, border: `1.5px solid ${rule.color}44`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 800, color: rule.color, whiteSpace: "nowrap", textAlign: "center" }}>
                  {t.dur}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "examples" && (
        <div style={{ animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: C.muted, marginBottom: 16 }}>Exemples coraniques</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {rule.examples.map((ex, i) => {
              const isP = audio.playing === ex.url;
              // 7s clip — each everyayah.com file is one ayah; 7s covers even longer ayahs cleanly
              const handlePlay = () => audio.play(ex.url, ex.words ? ex.words.length : 0, 7000);
              const activeWord = isP && audio.wordIdx >= 0 && audio.wordIdx < (ex.words ? ex.words.length : 0)
                ? ex.words[audio.wordIdx] : null;

              return (
                <div key={i} style={{ background: C.panel, border: `1.5px solid ${isP ? rule.color + "66" : C.border}`, borderRadius: 16, padding: "18px 20px", transition: "border-color 0.3s" }}>
                  {ex.words ? (
                    <div style={{ direction: "rtl", fontFamily: "'Amiri',serif", fontSize: "1.8rem", lineHeight: 2.6, marginBottom: 8, textAlign: "center" }}>
                      {ex.words.map((word, j) => {
                        const color = word.rule ? (RULE_COLORS[word.rule] || C.cream) : C.text;
                        const isActive = isP && audio.wordIdx === j;
                        return (
                          <span key={j} style={{ position: "relative", display: "inline-block", margin: "0 4px", padding: "2px 6px", borderRadius: 8, transition: "all 0.2s", background: isActive ? `${color}28` : "transparent", transform: isActive ? "scale(1.12)" : "scale(1)", "--wc": color }}>
                            <span style={{ color, borderBottom: word.rule ? `2px solid ${color}88` : "none", paddingBottom: 2, animation: isActive ? "wordGlow 0.8s ease infinite" : "none" }}>{word.w}</span>
                            {word.label && <span style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 900, color, whiteSpace: "nowrap", opacity: 0.85 }}>{word.label}</span>}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontFamily: "'Amiri',serif", fontSize: "2rem", color: rule.color, direction: "rtl", lineHeight: 1.6, marginBottom: 6 }}>{ex.ar}</div>
                  )}

                  {ex.words && (
                    <div style={{ direction: "ltr", textAlign: "center", fontSize: "0.85rem", fontWeight: 700, letterSpacing: 1, marginBottom: 4, color: C.muted }}>
                      {ex.words.map((word, j) => {
                        const isActive = isP && audio.wordIdx === j;
                        return <span key={j} style={{ display: "inline-block", margin: "0 4px", padding: "1px 6px", borderRadius: 6, color: isActive ? rule.color : C.muted, background: isActive ? `${rule.color}18` : "transparent", transition: "all 0.2s", fontStyle: "italic" }}>{word.translit}</span>;
                      })}
                    </div>
                  )}

                  {ex.words && (
                    <div style={{ direction: "ltr", textAlign: "center", fontSize: "0.8rem", marginBottom: 10, color: C.muted }}>
                      {ex.words.map((word, j) => {
                        const isActive = isP && audio.wordIdx === j;
                        return <span key={j} style={{ display: "inline-block", margin: "0 3px", padding: "1px 5px", borderRadius: 6, color: isActive ? rule.color : C.muted, background: isActive ? `${rule.color}14` : "transparent", fontWeight: isActive ? 700 : 400, transition: "all 0.2s" }}>{word.en}</span>;
                      })}
                    </div>
                  )}

                  {activeWord ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, borderRadius: 10, padding: "8px 12px", marginBottom: 10, animation: "fadeIn 0.15s ease", fontSize: 12 }}>
                      <span style={{ fontFamily: "'Amiri',serif", fontSize: "1.3rem", color: activeWord.rule ? RULE_COLORS[activeWord.rule] : C.cream }}>{activeWord.w}</span>
                      <span style={{ color: C.muted }}>→</span>
                      <span style={{ color: C.mutedLt, fontStyle: "italic" }}>{activeWord.translit}</span>
                      {activeWord.rule && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, color: RULE_COLORS[activeWord.rule], background: `${RULE_COLORS[activeWord.rule]}18`, border: `1px solid ${RULE_COLORS[activeWord.rule]}44`, borderRadius: 10, padding: "2px 8px", whiteSpace: "nowrap" }}>{activeWord.label}</span>}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>{ex.note}</div>
                  )}

                  {isP && (
                    <div style={{ height: 3, background: C.border, borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: rule.color, width: `${audio.progress * 100}%`, transition: "width 0.1s linear", borderRadius: 2 }} />
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={handlePlay} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isP ? "#b84c11" : rule.color, color: C.bg, border: "none", borderRadius: 30, padding: "8px 18px", fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
                      {audio.loading === ex.url ? <span style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.bg}55`, borderTop: `2px solid ${C.bg}`, display: "inline-block", animation: "spin 0.7s linear infinite" }} /> : isP ? "⏸" : "▶"}
                      {audio.loading === ex.url ? "…" : isP ? "Pause" : "Écouter"}
                    </button>
                    {isP && ex.words && <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>Mots illuminés ✨</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "test" && <VoiceTest rule={rule} audio={audio} />}

      {/* ── Marquer fait ── */}
      <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onMarkDone}
          disabled={isDone}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "11px 24px", borderRadius: 14,
            background: isDone ? `${rule.color}18` : rule.color,
            color: isDone ? rule.color : C.bg,
            border: `2px solid ${rule.color}`,
            fontFamily: "'Cairo',sans-serif", fontWeight: 900, fontSize: 14,
            cursor: isDone ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: isDone ? 0.85 : 1,
          }}
        >
          {isDone ? "✓ Règle complétée" : "✓ Marquer comme fait"}
        </button>
        {!isDone && (
          <span style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>
            Cliquez après avoir compris et pratiqué la règle
          </span>
        )}
      </div>
    </div>
  );
}

// ─── RECITER PLAYER ───────────────────────────────────────────────────────────
function ReciterPlayer({ audio }) {
  const [ayahIdx, setAyahIdx] = useState(0);
  const ayah = ANNOTATED_AYAHS[ayahIdx];
  const isP = audio.playing === ayah.url;
  const isL = audio.loading === ayah.url;
  const activeWord = isP && audio.wordIdx >= 0 && audio.wordIdx < ayah.words.length ? ayah.words[audio.wordIdx] : null;
  const handlePlay = () => audio.play(ayah.url, ayah.words.length);

  return (
    <div style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: C.muted, marginBottom: 16 }}>
        🎵 Lecteur — Tajwid en direct
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {ANNOTATED_AYAHS.map((a, i) => (
          <button key={i} onClick={() => { audio.stop(); setAyahIdx(i); }} style={{ background: ayahIdx === i ? C.gold : C.surface, color: ayahIdx === i ? C.bg : C.muted, border: `1.5px solid ${ayahIdx === i ? C.gold : C.border}`, borderRadius: 20, padding: "5px 14px", fontFamily: "'Cairo',sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>{a.ref}</button>
        ))}
      </div>

      <div style={{ direction: "rtl", fontFamily: "'Amiri',serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", lineHeight: 3.2, marginBottom: 8, textAlign: "center", minHeight: 80 }}>
        {ayah.words.map((word, i) => {
          const color = word.rule ? (RULE_COLORS[word.rule] || C.cream) : C.text;
          const isActive = isP && audio.wordIdx === i;
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", margin: "0 6px", padding: "2px 6px", borderRadius: 8, transition: "all 0.2s", background: isActive ? `${color}28` : "transparent", transform: isActive ? "scale(1.12)" : "scale(1)", "--wc": color }}>
              <span style={{ color, borderBottom: word.rule ? `2px solid ${color}88` : "none", paddingBottom: 2, animation: isActive ? "wordGlow 0.8s ease infinite" : "none" }}>{word.w}</span>
              {word.label && <span style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 900, color, whiteSpace: "nowrap", opacity: 0.85 }}>{word.label}</span>}
            </span>
          );
        })}
      </div>

      <div style={{ direction: "ltr", textAlign: "center", fontSize: "clamp(0.8rem,2vw,1rem)", fontWeight: 700, letterSpacing: 1, marginBottom: 6, minHeight: 28 }}>
        {ayah.words.map((word, i) => {
          const color = word.rule ? (RULE_COLORS[word.rule] || C.mutedLt) : C.mutedLt;
          const isActive = isP && audio.wordIdx === i;
          return <span key={i} style={{ display: "inline-block", margin: "0 5px", padding: "1px 6px", borderRadius: 6, color: isActive ? color : C.muted, background: isActive ? `${color}18` : "transparent", transition: "all 0.2s", fontStyle: "italic" }}>{word.translit}</span>;
        })}
      </div>

      <div style={{ direction: "ltr", textAlign: "center", fontSize: "clamp(0.75rem,1.8vw,0.9rem)", marginBottom: 16, minHeight: 26 }}>
        {ayah.words.map((word, i) => {
          const color = word.rule ? (RULE_COLORS[word.rule] || C.cream) : C.cream;
          const isActive = isP && audio.wordIdx === i;
          return <span key={i} style={{ display: "inline-block", margin: "0 4px", padding: "1px 6px", borderRadius: 6, color: isActive ? color : C.muted, background: isActive ? `${color}14` : "transparent", fontWeight: isActive ? 700 : 400, transition: "all 0.2s" }}>{word.en}</span>;
        })}
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: C.muted, fontStyle: "italic", marginBottom: 16, padding: "0 16px" }}>"{ayah.translation}"</div>

      {activeWord && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.surface, borderRadius: 12, padding: "10px 16px", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
          <span style={{ fontFamily: "'Amiri',serif", fontSize: "1.5rem", color: activeWord.rule ? RULE_COLORS[activeWord.rule] : C.cream }}>{activeWord.w}</span>
          <span style={{ color: C.muted, fontSize: 12 }}>→</span>
          <span style={{ fontSize: 12, color: C.mutedLt, fontStyle: "italic" }}>{activeWord.translit}</span>
          <span style={{ color: C.muted, fontSize: 12 }}>·</span>
          <span style={{ fontSize: 12, color: C.cream, fontWeight: 600 }}>{activeWord.en}</span>
          {activeWord.rule && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800, color: RULE_COLORS[activeWord.rule], background: `${RULE_COLORS[activeWord.rule]}18`, border: `1px solid ${RULE_COLORS[activeWord.rule]}44`, borderRadius: 12, padding: "2px 10px" }}>{activeWord.label}</span>}
        </div>
      )}

      {isP && (
        <div style={{ height: 3, background: C.border, borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", background: C.gold, width: `${audio.progress * 100}%`, transition: "width 0.1s linear", borderRadius: 2 }} />
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handlePlay} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isP ? "#b84c11" : C.gold, color: C.bg, border: "none", borderRadius: 30, padding: "10px 24px", fontFamily: "'Cairo',sans-serif", fontWeight: 900, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
          {isL ? <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${C.bg}55`, borderTop: `2px solid ${C.bg}`, display: "inline-block", animation: "spin 0.7s linear infinite" }} /> : isP ? "⏸" : "▶"}
          {isL ? "Chargement…" : isP ? "Pause" : "Écouter Al-Afasy"}
        </button>
        {isP && <span style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Les mots s'illuminent ✨</span>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        {RULES.filter(r => ["madd","ghunnah","qalqala","idgham","waqf"].includes(r.id)).map(r => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: C.muted }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, background: r.color, display: "inline-block" }} />
            {r.ar}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({ onSelectRule, audio, completedRules = new Set() }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <ReciterPlayer audio={audio} />
      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: C.muted, marginBottom: 16 }}>
        8 Règles du Tajwid — {completedRules.size}/8 complétées
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
        {RULES.map((rule) => {
          const done = completedRules.has(rule.fr);
          return (
            <button key={rule.id} onClick={() => onSelectRule(rule)}
              style={{ background: done ? `${rule.color}0e` : C.panel, border: `1.5px solid ${done ? rule.color + "55" : C.border}`, borderRadius: 18, padding: 20, textAlign: "right", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Cairo',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = rule.color + "77"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${rule.color}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = done ? rule.color + "55" : C.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: rule.bg, border: `1.5px solid ${rule.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Amiri',serif", fontSize: "1.4rem", color: rule.color, flexShrink: 0 }}>{rule.icon}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  {done && <span style={{ fontSize: 10, fontWeight: 900, color: rule.color, background: `${rule.color}18`, border: `1px solid ${rule.color}44`, borderRadius: 10, padding: "2px 8px", letterSpacing: "0.05em" }}>✓ Complétée</span>}
                  <div style={{ fontFamily: "'Amiri',serif", fontSize: "1.4rem", color: rule.color, lineHeight: 1.2 }}>{rule.ar}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.cream }}>{rule.fr}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, textAlign: "right" }}>{rule.shortDesc}</div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
                {["📖", "🎧", "🎤"].map((ic, j) => (
                  <span key={j} style={{ width: 28, height: 28, borderRadius: 8, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{ic}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeRule, setActiveRule]         = useState(null);
  const [completedRules, setCompletedRules] = useState(new Set());
  const audio = useAudio();
  const handleBack = () => { audio.stop(); setActiveRule(null); };

  // Load already-completed rules from backend on mount
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    axios.get(`${API}/api/user/${email}`)
      .then(r => {
        const done = new Set();
        (r.data.completedLessons || []).forEach(key => {
          const match = key.match(/^Tajwid.*— (.+)$/);
          if (match) done.add(match[1]);
        });
        setCompletedRules(done);
      })
      .catch(() => {});
  }, []);

  const handleMarkDone = async (rule) => {
    if (completedRules.has(rule.fr)) return;
    setCompletedRules(prev => new Set([...prev, rule.fr]));
    await saveProgress(`${COURSE_TITLE} — ${COURSE_TITLE} — ${rule.fr}`);
  };

  const handleSelectRule = (rule) => {
    setActiveRule(rule);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Cairo',sans-serif" }}>
      <style>{GS}</style>
      <div style={{ background: `linear-gradient(180deg, #1d1508 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.gold}22`, border: `1.5px solid ${C.gold}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Amiri',serif", fontSize: "1.6rem", color: C.gold, flexShrink: 0 }}>ق</div>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontFamily: "'Amiri',serif", fontSize: "1.6rem", color: C.goldLt, lineHeight: 1 }}>تجويد القرآن</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.cream }}>Tajwid du Coran</div>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Apprendre · Écouter · Pratiquer</div>
          </div>
          {activeRule && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: activeRule.color }} />
              <span style={{ fontSize: 13, color: activeRule.color, fontWeight: 700 }}>{activeRule.fr}</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 60px" }}>
        {activeRule
          ? <RuleDetail rule={activeRule} onBack={handleBack} audio={audio} isDone={completedRules.has(activeRule.fr)} onMarkDone={() => handleMarkDone(activeRule)} />
          : <Home onSelectRule={handleSelectRule} audio={audio} completedRules={completedRules} />
        }
      </div>
    </div>
  );
}