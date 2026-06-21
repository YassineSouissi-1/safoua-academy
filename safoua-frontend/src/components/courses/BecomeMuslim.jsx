import { useState, useEffect, useRef, useCallback } from "react";
import { api, getUser } from "../../utils/auth";

export const COURSE_TITLE = "Devenir Musulman : Les Bases";
export const MODULE_TITLE = "Devenir Musulman : Les Bases";

async function saveProgress(lessonTitle) {
  try {
    await api.post("/api/update-progress", { lessonTitle });
  } catch (err) {
    console.error("Erreur progression:", err);
  }
}

/* ═══════════════════════════════════════════════════════════
   "ZELLIGE" DESIGN SYSTEM
   Warm sand & clay palette drawn from Fes tilework, terracotta
   courtyards, sage-glazed pottery and brushed gold leaf.
   Soft on the eyes — warm light surfaces, gentle contrast.
═══════════════════════════════════════════════════════════ */
const T = {
  bg:        "#F8F1E4",   // warm sand
  bgDeep:    "#F1E7D4",
  card:      "#FFFCF6",
  cardSoft:  "#FBF5E9",
  line:      "#E5D6BC",
  lineSoft:  "#EFE3CB",
  ink:       "#3C2E22",   // warm umber, not black
  inkSoft:   "#5C4B3A",
  muted:     "#8C7860",
  mutedLt:   "#AC9A82",
  clay:      "#C0623F",   // terracotta
  clayLt:    "#DD8C66",
  clayDeep:  "#9A4A2E",
  teal:      "#2D7468",   // zellige teal
  tealLt:    "#4FA092",
  tealDeep:  "#1E5650",
  gold:      "#B8872E",
  goldLt:    "#D9AC55",
  goldPale:  "#EFD9A4",
  plum:      "#7C5A82",
  plumLt:    "#A584AC",
  green:     "#4C8F5C",
  red:       "#B5503D",
};

/* ─── Eight-point rosette (zellige star) path ─── */
function rosettePoints(cx, cy, r1, r2, points = 8) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (Math.PI / points) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

/* Signature element: interlocking tile rosette, built from three
   overlapping 8-point stars in clay / teal / gold — the page's
   recurring mark for progress, ornament & loading states. */
function Rosette({ size = 40, spin = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0, animation: spin ? "rosetteSpin 14s linear infinite" : "none" }}>
      <polygon points={rosettePoints(50, 50, 46, 23)} fill="none" stroke={T.clay} strokeWidth="2.2" opacity="0.9" />
      <polygon points={rosettePoints(50, 50, 36, 16)} fill="none" stroke={T.teal} strokeWidth="2.2" opacity="0.85" transform="rotate(22.5 50 50)" />
      <circle cx="50" cy="50" r="6.5" fill={T.gold} />
    </svg>
  );
}

function RosetteTiny({ size = 14, color = T.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      <polygon points={rosettePoints(50, 50, 46, 24)} fill="none" stroke={color} strokeWidth="6" />
    </svg>
  );
}

/* ─── Tile-strip divider — a row of alternating glazed tiles ─── */
function TileDivider({ tone = T.clay }) {
  const tiles = [T.clay, T.gold, T.teal, T.gold, T.clay];
  return (
    <div style={{ display: "flex", height: 5, margin: "30px 0", borderRadius: 3, overflow: "hidden", boxShadow: "0 1px 0 rgba(60,46,34,0.06)" }}>
      {tiles.map((c, i) => (
        <div key={i} style={{ flex: 1, background: c, opacity: 0.55 }} />
      ))}
    </div>
  );
}

/* ─── Ambient backdrop: faint repeating zellige lattice ─── */
function Backdrop() {
  return (
    <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5 }}>
      <defs>
        <pattern id="zellige" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill={T.bg} />
          <polygon points={rosettePoints(48, 48, 40, 21)} fill="none" stroke={T.line} strokeWidth="1" />
          <polygon points={rosettePoints(0, 0, 22, 11)} fill="none" stroke={T.line} strokeWidth="1" />
          <polygon points={rosettePoints(96, 0, 22, 11)} fill="none" stroke={T.line} strokeWidth="1" />
          <polygon points={rosettePoints(0, 96, 22, 11)} fill="none" stroke={T.line} strokeWidth="1" />
          <polygon points={rosettePoints(96, 96, 22, 11)} fill="none" stroke={T.line} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige)" />
    </svg>
  );
}

/* ─── Scalloped arch frame — used for featured content blocks ─── */
function ArchFrame({ children, tone = T.clay, tint = T.cardSoft }) {
  return (
    <div style={{ position: "relative", borderRadius: "26px 26px 10px 10px", border: `1px solid ${tone}35`, background: tint, overflow: "hidden" }}>
      <svg width="100%" height="14" viewBox="0 0 400 14" preserveAspectRatio="none" style={{ display: "block" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={16.5 + i * 33} cy="0" r="14" fill="none" stroke={`${tone}55`} strokeWidth="1.4" />
        ))}
      </svg>
      <div>{children}</div>
    </div>
  );
}

/* ─── Global ayah number → MP3 URL ─── */
const VERSE_COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,43,32,20,29,27,29,22,14,31,13,11,11,48,14,4,160,15,98,68,21,25,21,11,5,6,5,7,4,7,3,6,3,5,4,5,6,5,8,4,10,9,5,6];
function ayahUrl(surah, ayah) {
  const global = VERSE_COUNTS.slice(0, surah - 1).reduce((a, b) => a + b, 0) + ayah;
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${global}.mp3`;
}
function surahUrl(surah) {
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah}.mp3`;
}

/* ═══════════════════════════════════════════════
   SURAH DATA — Al-Ikhlas, Al-Falaq, Al-Nas
═══════════════════════════════════════════════ */
const SURAHS = [
  {
    name: "Al-Ikhlas", ar: "الإخلاص", surahNum: 112,
    audioUrl: surahUrl(112), reciter: "Mishary Rashid Alafasy",
    verses: [
      { ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", tr: "Qul huwa-llāhu aḥad", fr: "Dis : Il est Allah, l'Unique", audioUrl: ayahUrl(112,1) },
      { ar: "اللَّهُ الصَّمَدُ", tr: "Allāhu ṣ-ṣamad", fr: "Allah, le Seul à être imploré pour ce que nous désirons", audioUrl: ayahUrl(112,2) },
      { ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", tr: "Lam yalid wa-lam yūlad", fr: "Il n'a pas engendré et n'a pas été engendré", audioUrl: ayahUrl(112,3) },
      { ar: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", tr: "Wa-lam yakun lahu kufuwan aḥad", fr: "Et nul n'est égal à Lui", audioUrl: ayahUrl(112,4) },
    ],
  },
  {
    name: "Al-Falaq", ar: "الفلق", surahNum: 113,
    audioUrl: surahUrl(113), reciter: "Mishary Rashid Alafasy",
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", tr: "Qul aʿūdhu bi-rabbi l-falaq", fr: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante", audioUrl: ayahUrl(113,1) },
      { ar: "مِن شَرِّ مَا خَلَقَ", tr: "Min sharri mā khalaq", fr: "contre le mal de ce qu'Il a créé", audioUrl: ayahUrl(113,2) },
      { ar: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", tr: "Wa-min sharri ghāsiqin idhā waqab", fr: "contre le mal de l'obscurité quand elle s'étend", audioUrl: ayahUrl(113,3) },
      { ar: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", tr: "Wa-min sharri n-naffāthāti fī l-ʿuqad", fr: "contre le mal de celles qui soufflent sur les nœuds", audioUrl: ayahUrl(113,4) },
      { ar: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", tr: "Wa-min sharri ḥāsidin idhā ḥasad", fr: "contre le mal de l'envieux quand il envie", audioUrl: ayahUrl(113,5) },
    ],
  },
  {
    name: "Al-Nas", ar: "الناس", surahNum: 114,
    audioUrl: surahUrl(114), reciter: "Mishary Rashid Alafasy",
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", tr: "Qul aʿūdhu bi-rabbi n-nās", fr: "Dis : Je cherche protection auprès du Seigneur des hommes", audioUrl: ayahUrl(114,1) },
      { ar: "مَلِكِ النَّاسِ", tr: "Maliki n-nās", fr: "du Roi des hommes", audioUrl: ayahUrl(114,2) },
      { ar: "إِلَٰهِ النَّاسِ", tr: "Ilāhi n-nās", fr: "du Dieu des hommes", audioUrl: ayahUrl(114,3) },
      { ar: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", tr: "Min sharri l-waswāsi l-khannās", fr: "contre le mal du mauvais conseiller, le furtif", audioUrl: ayahUrl(114,4) },
      { ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", tr: "Alladhī yuwaswisu fī ṣudūri n-nās", fr: "qui souffle le mal dans les poitrines des hommes", audioUrl: ayahUrl(114,5) },
      { ar: "مِنَ الْجِنَّةِ وَالنَّاسِ", tr: "Mina l-jinnati wa-n-nās", fr: "qu'il soit djinn ou être humain", audioUrl: ayahUrl(114,6) },
    ],
  },
];

/* ═══════════════════════════════════════════════
   COURSE AYAT — full texts
═══════════════════════════════════════════════ */
const COURSE_AYAT = {
  islam_def: {
    ar: "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ ۚ لَا إِلَٰهَ إِلَّا هُوَ الْعَزِيزُ الْحَكِيمُ ۚ إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ",
    highlight: "إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ",
    tr: "Inna d-dīna ʿinda-llāhi l-islām",
    fr: "Certes, la religion agréée d'Allah, c'est l'Islam",
    ref: "Sourate Âl Imrân 3:19",
    audioUrl: ayahUrl(3,19)
  },
  zakat: {
    ar: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    highlight: "آتُوا الزَّكَاةَ",
    tr: "Wa aqīmū aṣ-ṣalāh wa ātū az-zakāh wa rkaʿū maʿa r-rākiʿīn",
    fr: "Accomplissez la prière, acquittez la Zakat et inclinez-vous avec ceux qui s'inclinent",
    ref: "Coran 2:43",
    audioUrl: ayahUrl(2,43)
  },
  ramadan: {
    ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    highlight: "كُتِبَ عَلَيْكُمُ الصِّيَامُ",
    tr: "Yā ayyuhā lladhīna āmanū kutiba ʿalaykumu ṣ-ṣiyāmu kamā kutiba ʿalā lladhīna min qablikum laʿallakum tattaqūn",
    fr: "Ô vous qui croyez ! Le jeûne vous est prescrit comme il l'a été pour ceux qui vous ont précédés, ainsi peut-être serez-vous pieux",
    ref: "Coran 2:183",
    audioUrl: ayahUrl(2,183)
  },
  hajj: {
    ar: "فِيهِ آيَاتٌ بَيِّنَاتٌ مَّقَامُ إِبْرَاهِيمَ ۖ وَمَن دَخَلَهُ كَانَ آمِنًا ۗ وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا ۚ وَمَن كَفَرَ فَإِنَّ اللَّهَ غَنِيٌّ عَنِ الْعَالَمِينَ",
    highlight: "حِجُّ الْبَيْتِ",
    tr: "Fīhi āyātun bayyinātun maqāmu Ibrāhīm, wa man dakhalahu kāna āminā, wa li-llāhi ʿalā n-nāsi ḥijju l-bayti mani staṭāʿa ilayhi sabīlā, wa man kafara fa-inna-llāha ghaniyyun ʿani l-ʿālamīn",
    fr: "Il renferme des signes évidents — dont la station d'Ibrahim. Quiconque y entre est en sécurité. Et c'est pour Allah une obligation imposée aux hommes de faire le pèlerinage, pour celui qui en a les moyens. Et quiconque ne croit pas... Allah Se passe de l'univers entier",
    ref: "Coran 3:97",
    audioUrl: ayahUrl(3,97)
  },
  iman_ref: {
    ar: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
    highlight: "آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ",
    tr: "Āmana r-rasūlu bi-mā unzila ilayhi min rabbihi wa l-muʾminūn, kullun āmana bi-llāhi wa malāʾikatihi wa kutubihi wa rusulihi lā nufarriqu bayna aḥadin min rusulihi wa qālū samiʿnā wa aṭaʿnā ghufranaka rabbanā wa ilayka l-maṣīr",
    fr: "Le Messager a cru en ce qui lui a été révélé de son Seigneur, et les croyants aussi — ils ont tous cru en Allah, en Ses anges, en Ses livres et en Ses messagers. Nous ne faisons pas de distinction entre ses messagers. Ils ont dit : Nous avons entendu et nous avons obéi. Accorde-nous Ton pardon, notre Seigneur. C'est vers Toi que sera le retour",
    ref: "Coran 2:285",
    audioUrl: ayahUrl(2,285)
  },
  salat: {
    ar: "فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ ۚ فَإِذَا اطْمَأْنَنتُمْ فَأَقِيمُوا الصَّلَاةَ ۚ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    highlight: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    tr: "Fa-idhā qaḍaytumu ṣ-ṣalāta fa-dhkurū llāha qiyāman wa quʿūdan wa ʿalā junūbikum, fa-idhā ṭmaʾnantum fa-aqīmū ṣ-ṣalāh, inna ṣ-ṣalāta kānat ʿalā l-muʾminīna kitāban mawqūtā",
    fr: "Quand vous avez accompli la prière, invoquez Allah debout, assis ou couchés sur vos côtés. Et quand vous êtes en sécurité, accomplissez la prière. La prière est, pour les croyants, une obligation à des temps déterminés",
    ref: "Coran 4:103",
    audioUrl: ayahUrl(4,103)
  },
  brotherhood: {
    ar: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ ۚ وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُرْحَمُونَ",
    highlight: "الْمُؤْمِنُونَ إِخْوَةٌ",
    tr: "Innamā l-muʾminūna ikhwatun fa-aṣliḥū bayna akhawaykum wa ttaqū-llāha laʿallakum turḥamūn",
    fr: "Les croyants ne sont que des frères. Réconciliez donc vos frères et craignez Allah, afin qu'on vous fasse miséricorde",
    ref: "Coran 49:10",
    audioUrl: ayahUrl(49,10)
  },
};

/* ═══════════════════════════════════════════════
   COURSE DATA
═══════════════════════════════════════════════ */
export const CHAPTERS = [
  {
    id: 0, ar: "مَن هو المسلم؟", fr: "Qui est le Musulman ?", icon: "crescent", color: T.teal,
    intro: "L'Islam (الإسلام) signifie « soumission à Allah ». Devenir musulman est un acte conscient et sincère du cœur. Il n'y a pas de race, de nationalité ou d'origine requise — l'Islam est universel.",
    sections: [
      {
        title: "La définition de l'Islam",
        text: "L'Islam est la religion abrahamique monothéiste révélée au Prophète Muhammad ﷺ par l'ange Jibrīl. Il repose sur la croyance en un Dieu unique (Allah), en ses prophètes, ses livres, ses anges, le Jour dernier et le destin.",
        ayah: COURSE_AYAT.islam_def,
      },
      {
        title: "Comment prononcer la Chahada ?",
        text: "Pour entrer en Islam, il suffit de prononcer la Chahada (شهادة) avec sincérité et conviction, devant témoins si possible.",
        shahada: true,
      },
      {
        title: "Ce que change la Chahada",
        text: "Dès que la Chahada est prononcée sincèrement, tous les péchés antérieurs sont effacés. La personne entre dans la communauté islamique (أمة) avec une ardoise vierge.",
        hadith: { text: "L'Islam efface ce qui précède.", ref: "Sahih Muslim" },
      },
    ],
    quiz: [
      { q: "Que signifie le mot 'Islam' ?", opts: ["Paix uniquement","Soumission à Allah","Prière","Jeûne"], ans: 1 },
      { q: "La Chahada est :", opts: ["Optionnelle","Une condition d'entrée en Islam","Uniquement pour les arabes","Un pilier de la prière"], ans: 1 },
      { q: "Que se passe-t-il avec les péchés passés après la Chahada ?", opts: ["Ils restent","Ils sont punis plus tard","Ils sont tous effacés","Ils sont jugés au Paradis"], ans: 2 },
    ],
    video: { title: "Comment se convertir à l'Islam", youtubeId: "4N_KCciaNg8", desc: "Une explication claire et émouvante de la Chahada et du processus de conversion." },
    funFact: "Plus de 20 000 personnes se convertissent à l'Islam chaque année rien qu'en France.",
  },
  {
    id: 1, ar: "أَرْكَانُ الإِسْلَام", fr: "Les 5 Piliers de l'Islam", icon: "pillar", color: T.gold,
    intro: "Les cinq piliers (أركان الإسلام) sont les cinq pratiques fondamentales que tout musulman doit accomplir. Ils structurent la vie spirituelle et sociale du croyant.",
    sections: [
      {
        title: "1 — الشَّهَادَة · La Déclaration de foi",
        text: "Témoigner qu'il n'y a de dieu qu'Allah et que Muhammad est son messager. C'est l'acte fondateur de l'Islam.",
        pillarDetails: { arabic: "أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله", transliteration: "Ash-hadu allā ilāha illā-llāh, wa ash-hadu anna Muḥammadan rasūlu-llāh", meaning: "Je témoigne qu'il n'y a de dieu qu'Allah et que Muhammad est son messager." },
      },
      {
        title: "2 — الصَّلَاة · La Prière (5 fois/jour)",
        text: "La prière rituelle (salāt) est obligatoire 5 fois par jour.",
        prayerTimes: [
          { name: "الفجر", fr: "Fajr", time: "Aube", rakaat: 2 },
          { name: "الظهر", fr: "Dhuhr", time: "Midi", rakaat: 4 },
          { name: "العصر", fr: "Asr", time: "Après-midi", rakaat: 4 },
          { name: "المغرب", fr: "Maghrib", time: "Coucher du soleil", rakaat: 3 },
          { name: "العشاء", fr: "Isha", time: "Soir", rakaat: 4 },
        ],
      },
      {
        title: "3 — الزَّكَاة · L'Aumône légale",
        text: "La Zakat est un impôt religieux annuel de 2.5% sur les économies détenues pendant un an.",
        ayah: COURSE_AYAT.zakat,
      },
      {
        title: "4 — صَوْم رَمَضَان · Le Jeûne de Ramadan",
        text: "Pendant le mois de Ramadan, les musulmans s'abstiennent de manger, boire et relations intimes du Fajr au Maghrib.",
        ayah: COURSE_AYAT.ramadan,
      },
      {
        title: "5 — الحَجّ · Le Pèlerinage à La Mecque",
        text: "Le Hajj est obligatoire une fois dans sa vie pour tout musulman physiquement et financièrement capable.",
        ayah: COURSE_AYAT.hajj,
      },
    ],
    quiz: [
      { q: "Combien y a-t-il de piliers de l'Islam ?", opts: ["3","4","5","6"], ans: 2 },
      { q: "Combien de fois par jour doit-on prier ?", opts: ["3","4","5","7"], ans: 2 },
      { q: "Quel est le taux de la Zakat sur l'épargne ?", opts: ["1%","2.5%","5%","10%"], ans: 1 },
      { q: "Le Hajj est obligatoire :", opts: ["Chaque année","Tous les 5 ans","Une fois si on en a les moyens","Jamais"], ans: 2 },
    ],
    video: { title: "Les 5 piliers de l'Islam", youtubeId: "QBoqUBVw5io", desc: "Une présentation claire des 5 piliers fondamentaux de l'Islam." },
    funFact: "La prière du Fajr (aube) est l'une des plus difficiles mais aussi des plus méritoires.",
  },
  {
    id: 2, ar: "أَرْكَانُ الإِيمَان", fr: "Les 6 Piliers de la Foi", icon: "star", color: T.plum,
    intro: "Les six piliers de la foi (أركان الإيمان) constituent les croyances fondamentales de tout musulman, mentionnés dans le célèbre Hadith de Jibrīl.",
    sections: [
      {
        title: "Hadith de Jibrīl — La source",
        text: "L'ange Jibrīl demanda au Prophète ﷺ : « Qu'est-ce que la foi (إيمان) ? » Le Prophète répondit : « C'est croire en Allah, en ses anges, en ses livres, en ses messagers, au Jour dernier, et au destin. »",
        hadith: { text: "Que tu croies en Allah, en ses Anges, en ses Livres, en ses Messagers, au Jour Dernier, et au destin, tant dans son bien que dans son mal.", ref: "Sahih Muslim — Hadith de Jibrīl" },
      },
      {
        title: "Les 6 piliers en détail",
        text: "",
        imanPillars: [
          { ar: "الإيمان بالله", fr: "Foi en Allah", desc: "Croire que Allah est unique (توحيد), sans associé, fils ou partenaire. Il est le Créateur, le Sustentateur, l'Omniscient." },
          { ar: "الإيمان بالملائكة", fr: "Foi en les Anges", desc: "Croire aux anges créés de lumière, qui obéissent parfaitement à Allah. Jibrīl, Mikaïl, Israfil..." },
          { ar: "الإيمان بالكتب", fr: "Foi en les Livres", desc: "Croire aux livres révélés : Tawrat (Moïse), Injil (Jésus), Coran (Muhammad ﷺ). Le Coran est la version finale et préservée." },
          { ar: "الإيمان بالرسل", fr: "Foi en les Prophètes", desc: "Croire en tous les prophètes d'Adam à Muhammad ﷺ (le dernier). Tous transmettaient le même message monothéiste." },
          { ar: "الإيمان باليوم الآخر", fr: "Foi au Jour Dernier", desc: "Croire en la résurrection, le Jugement dernier, le Paradis (جنة) et l'Enfer (نار)." },
          { ar: "الإيمان بالقدر", fr: "Foi au Destin (Qadar)", desc: "Croire que tout est dans la connaissance d'Allah. Le croyant accepte ce qu'il ne peut changer avec patience (صبر)." },
        ],
      },
      {
        title: "Verset de référence",
        text: "Allah décrit dans le Coran ce que doit croire tout croyant sincère :",
        ayah: COURSE_AYAT.iman_ref,
      },
    ],
    quiz: [
      { q: "Combien y a-t-il de piliers de la foi (Iman) ?", opts: ["4","5","6","7"], ans: 2 },
      { q: "Quel ange a apporté la révélation au Prophète ﷺ ?", opts: ["Mikaïl","Israfil","Jibrīl","Munkar"], ans: 2 },
      { q: "Le Coran a été révélé à quel prophète ?", opts: ["Moïse","Jésus","Abraham","Muhammad ﷺ"], ans: 3 },
      { q: "Le Qadar inclut :", opts: ["Seulement le bien","Seulement le mal","Le bien et le mal","Ni l'un ni l'autre"], ans: 2 },
    ],
    video: { title: "Les 6 piliers de la foi", youtubeId: "t6oFslfztYM", desc: "Comprendre les croyances fondamentales de l'Islam." },
    funFact: "Le mot 'Iman' (foi) apparaît plus de 800 fois dans le Coran.",
  },
  {
    id: 3, ar: "كَيْفَ تُصَلِّي", fr: "Comment prier correctement", icon: "prayer", color: T.tealDeep,
    intro: "La prière (الصلاة) est le deuxième pilier de l'Islam et le lien quotidien entre le croyant et Allah. Voici comment accomplir la prière pas à pas.",
    sections: [
      {
        title: "Étape 1 — L'ablution (الوضوء · Wudhu)",
        text: "Avant toute prière, il faut accomplir le Wudhu — la purification rituelle avec l'eau.",
        wudhuSteps: [
          { step:1, ar:"النية", fr:"L'intention", desc:"Faire l'intention silencieuse de purification pour la prière." },
          { step:2, ar:"غسل اليدين", fr:"Laver les mains", desc:"Laver les deux mains jusqu'aux poignets, 3 fois." },
          { step:3, ar:"المضمضة والاستنشاق", fr:"Rincer bouche & nez", desc:"Se rincer la bouche 3 fois, puis le nez 3 fois." },
          { step:4, ar:"غسل الوجه", fr:"Laver le visage", desc:"Laver tout le visage du haut du front au bas du menton, 3 fois." },
          { step:5, ar:"غسل الذراعين", fr:"Laver les avant-bras", desc:"Laver le bras droit jusqu'au coude 3 fois, puis le gauche." },
          { step:6, ar:"مسح الرأس والأذنين", fr:"Tête & oreilles", desc:"Passer les mains mouillées sur la tête une fois, puis les oreilles." },
          { step:7, ar:"غسل القدمين", fr:"Laver les pieds", desc:"Laver le pied droit jusqu'à la cheville 3 fois, puis le gauche." },
        ],
        wudhuVideo: { title:"Comment faire le Wudhu", youtubeId:"Kfvf1EhWHrE", desc:"Tutoriel visuel complet pour apprendre le Wudhu correctement." },
      },
      {
        title: "Le Ghusl (الغسل) — La purification complète",
        text: "Le Ghusl est la purification totale du corps, obligatoire après certains états (relations conjugales, menstruation, etc.).",
        ghuslVideo: { title:"Comment faire le Ghusl", youtubeId:"pPcMBk4bnM8", desc:"Guide pratique pour accomplir le Ghusl selon la Sunnah." },
      },
      {
        title: "Étape 2 — Les positions de la prière",
        text: "La prière suit une séquence précise de positions (أركان الصلاة). Chaque position a ses invocations spécifiques.",
        prayerSteps: [
          { pos:"القيام", fr:"Debout (Qiyam)", desc:"Se tenir debout face à la Qibla, les mains sur la poitrine. Réciter Al-Fatiha puis une autre sourate.", dhikr:"اللّٰهُ أَكْبَر · Allahu Akbar" },
          { pos:"الركوع", fr:"Inclination (Ruku)", desc:"S'incliner à 90°, les mains sur les genoux. Le dos doit être droit et plat.", dhikr:"سُبْحَانَ رَبِّيَ الْعَظِيمِ · Subhāna Rabbī al-ʿAẓīm (x3)" },
          { pos:"السجود", fr:"Prosternation (Sujud)", desc:"Se prosterner, le front et le nez touchant le sol, les paumes à plat. 7 membres touchent le sol.", dhikr:"سُبْحَانَ رَبِّيَ الْأَعْلَى · Subhāna Rabbī al-Aʿlā (x3)" },
          { pos:"الجلوس", fr:"Assis (Julūs)", desc:"S'asseoir entre les deux prosternations sur le pied gauche, le droit dressé.", dhikr:"رَبِّ اغْفِرْ لِي · Rabbi ghfir lī" },
          { pos:"التشهد", fr:"Témoignage (Tashahhud)", desc:"S'asseoir à la fin et réciter le Tashahhud, puis les bénédictions sur le Prophète ﷺ.", dhikr:"التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ" },
          { pos:"السلام", fr:"Salutation (Salam)", desc:"Tourner la tête à droite puis à gauche. C'est la clôture de la prière.", dhikr:"السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ · Assalāmu ʿalaykum wa raḥmatullāh" },
        ],
      },
      {
        title: "Al-Fatiha — La sourate essentielle",
        text: "Al-Fatiha (الفاتحة) doit être récitée dans chaque rakat. Cliquez sur un verset pour voir la translittération et la traduction.",
        fatiha: true,
      },
      {
        title: "Verset sur la prière",
        text: "Allah ordonne la prière dans le Coran :",
        ayah: COURSE_AYAT.salat,
      },
    ],
    quiz: [
      { q: "Combien d'étapes compte le Wudhu ?", opts: ["4","5","6","7"], ans: 3 },
      { q: "Que dit-on pendant le Ruku ?", opts: ["Allahu Akbar","Subhāna Rabbī al-ʿAẓīm","Al-Fatiha","Alhamdulillah"], ans: 1 },
      { q: "Comment se termine la prière ?", opts: ["Par un du'a","Par le Salam","Par une prosternation","Par Al-Fatiha"], ans: 1 },
      { q: "Al-Fatiha est récitée :", opts: ["Une seule fois par jour","Dans chaque rakat","Seulement le vendredi","Uniquement au Fajr"], ans: 1 },
    ],
    video: { title:"Comment faire la prière (débutant)", youtubeId:"fEd1iUeFwKQ", desc:"Guide visuel complet pour accomplir la prière islamique correctement." },
    funFact: "Un musulman qui prie 5 fois par jour effectue 34 rak'ats — soit plus de 12 000 prosternations par an !",
    hasReciter: true,
  },
  {
    id: 4, ar: "الحَيَاة بَعد الإِسْلَام", fr: "Vivre en tant que Musulman", icon: "branch", color: T.clayDeep,
    intro: "Devenir musulman est le début d'un voyage de toute une vie. L'Islam est un mode de vie complet qui guide chaque aspect de l'existence quotidienne.",
    sections: [
      {
        title: "Les pratiques quotidiennes",
        text: "Un musulman structure sa journée autour de la prière, de la mémoire d'Allah (ذكر) et de bonnes actions.",
        dailyPractices: [
          { ar:"بِسْمِ اللَّه", fr:"Bismillah", when:"Avant chaque acte", desc:"Commencer toute activité au nom d'Allah.", color:T.teal },
          { ar:"الحمد لله", fr:"Alhamdulillah", when:"Après chaque bienfait", desc:"Rendre grâce à Allah pour tout ce qu'Il nous donne.", color:T.gold },
          { ar:"سبحان الله", fr:"Subhanallah", when:"Face à la beauté", desc:"Glorifier Allah devant Ses merveilles.", color:T.plum },
          { ar:"إن شاء الله", fr:"In sha'Allah", when:"Pour les projets futurs", desc:"Reconnaître que tout dépend de la volonté d'Allah.", color:T.tealDeep },
          { ar:"أستغفر الله", fr:"Astaghfirullah", when:"Après une erreur", desc:"Demander le pardon d'Allah sincèrement.", color:T.clay },
        ],
      },
      {
        title: "Ce qui est Halal et Haram",
        text: "L'Islam définit clairement ce qui est permis (حلال) et ce qui est interdit (حرام) pour protéger le croyant et la société.",
        halalHaram: {
          halal: ["Viande abattue au nom d'Allah","Mariage légal","Commerce honnête","Divertissement sain","Bonnes relations sociales"],
          haram: ["Porc et alcool","Adultère et fornication","Usure (Riba)","Jeux de hasard","Orgueil et arrogance"],
        },
      },
      {
        title: "La fraternité islamique (الأخوة)",
        text: "Les musulmans forment une communauté (أمة) unie par la foi.",
        hadith: { text:"Le Muslim est le frère du Muslim : il ne l'opprime pas, ne l'abandonne pas et ne le méprise pas.", ref:"Sahih Muslim" },
      },
      {
        title: "Verset sur la fraternité",
        text: "Allah rappelle dans le Coran le lien qui unit tous les croyants :",
        ayah: COURSE_AYAT.brotherhood,
      },
    ],
    quiz: [
      { q: "Que dit-on avant de commencer un repas ?", opts: ["Alhamdulillah","Bismillah","Subhanallah","Inshallah"], ans: 1 },
      { q: "Que signifie 'Halal' ?", opts: ["Interdit","Permis","Obligatoire","Recommandé"], ans: 1 },
      { q: "L'alcool est :", opts: ["Halal","Makruh","Haram","Optionnel"], ans: 2 },
      { q: "Que dit-on après avoir reçu un bienfait ?", opts: ["Bismillah","Inshallah","Alhamdulillah","Astaghfirullah"], ans: 2 },
    ],
    funFact: "Dire 'Subhanallah, Alhamdulillah, Allahu Akbar' 33 fois chacun après la prière vaut une grande récompense.",
  },
];

/* ═══════════════════════════════════════════════
   AUDIO PLAYER HOOK
═══════════════════════════════════════════════ */
function useAudioPlayer(src) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.src = src;
    audio.preload = "metadata";
    const onLoaded  = () => { setDuration(audio.duration || 0); setLoading(false); };
    const onTime    = () => setCurrentTime(audio.currentTime);
    const onEnded   = () => { setPlaying(false); setCurrentTime(0); };
    const onWaiting = () => setLoading(true);
    const onPlay    = () => { setLoading(false); setPlaying(true); };
    const onPause   = () => setPlaying(false);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
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
    audioRef.current.currentTime = Math.max(0, Math.min(t, duration));
    setCurrentTime(audioRef.current.currentTime);
  }, [duration]);

  const skip = useCallback((delta) => {
    if (!audioRef.current) return;
    seek(audioRef.current.currentTime + delta);
  }, [seek]);

  return { playing, currentTime, duration, loading, toggle, stop, seek, skip };
}

/* ═══════════════════════════════════════════════
   FULL AUDIO PLAYER — "tile cassette"
═══════════════════════════════════════════════ */
function AudioPlayer({ src, accentColor = T.clay }) {
  const { playing, currentTime, duration, loading, toggle, stop, seek, skip } = useAudioPlayer(src);
  const fmt = (s) => { if (!isFinite(s)) return "0:00"; return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`; };
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const handleSeek = (e) => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * duration); };
  return (
    <div style={{ background:T.card, border:`1px solid ${accentColor}40`, borderRadius:16, padding:"16px 20px", display:"flex", flexDirection:"column", gap:10, boxShadow:"0 2px 10px rgba(60,46,34,0.05)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
        <button onClick={() => skip(-5)} style={btnSm(accentColor)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
        </button>
        <button onClick={toggle} style={{ width:40, height:40, borderRadius:"50%", background: playing ? `${accentColor}16` : accentColor, border:`1.5px solid ${accentColor}`, color: playing ? accentColor : "#FFFCF6", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"transform .15s" }}>
          {loading ? <div style={{ width:13, height:13, border:`2px solid currentColor`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> :
           playing ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> :
           <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:2}}><path d="M8 5v14l11-7z"/></svg>}
        </button>
        <button onClick={() => skip(5)} style={btnSm(accentColor)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 6v12l8.5-6L13 6zM4 18l8.5-6L4 6v12z"/></svg>
        </button>
        <button onClick={stop} style={btnSm(T.red)}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>
        </button>
        <span style={{ marginLeft:"auto", fontSize:11, color:T.muted, fontVariantNumeric:"tabular-nums" }}>{fmt(currentTime)} / {fmt(duration)}</span>
      </div>
      <div onClick={handleSeek} style={{ cursor:"pointer", height:5, borderRadius:99, background:`${accentColor}1a`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:accentColor, borderRadius:99, transition:"width .1s" }}/>
      </div>
      {playing && (
        <div style={{ display:"flex", gap:3, alignItems:"center", justifyContent:"center" }}>
          {[3,5,8,11,8,5,3,5,8].map((h,i) => (
            <div key={i} style={{ width:2.5, borderRadius:99, background:accentColor, opacity:0.55, animation:`soundWave ${0.4+i*0.07}s ease-in-out infinite alternate`, height:`${h}px` }}/>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Small inline play button ─── */
function AyahPlayBtn({ src, accentColor = T.clay }) {
  const { playing, loading, toggle } = useAudioPlayer(src);
  return (
    <button onClick={(e) => { e.stopPropagation(); toggle(); }} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:99, background: playing ? `${accentColor}1c` : `${accentColor}0e`, border:`1px solid ${accentColor}45`, color:accentColor, cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit", letterSpacing:"0.01em" }}>
      {loading ? <div style={{ width:9, height:9, border:`1.5px solid ${accentColor}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> :
       playing ? <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> :
       <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:1}}><path d="M8 5v14l11-7z"/></svg>}
      {playing ? "En écoute" : "Écouter"}
    </button>
  );
}

function btnSm(color) {
  return { width:30, height:30, borderRadius:"50%", background:"transparent", border:`1px solid ${color}40`, color, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 };
}

/* ─── Render Arabic text with optional highlight ─── */
function ArabicWithHighlight({ ar, highlight, fontSize = 22 }) {
  if (!highlight || !ar.includes(highlight)) {
    return <p style={{ fontFamily:"'Lateef',serif", fontSize, color:T.clayDeep, lineHeight:2.1, direction:"rtl", textAlign:"right" }}>{ar}</p>;
  }
  const parts = ar.split(highlight);
  return (
    <p style={{ fontFamily:"'Lateef',serif", fontSize, color:T.clayDeep, lineHeight:2.1, direction:"rtl", textAlign:"right" }}>
      {parts[0]}
      <span style={{ background:`${T.teal}1f`, color:T.tealDeep, padding:"0 5px", borderRadius:4, boxShadow:`0 2px 0 ${T.teal}55` }}>
        {highlight}
      </span>
      {parts.slice(1).join(highlight)}
    </p>
  );
}

/* ═══════════════════════════════════════════════
   AYAH BOX — arch-framed verse tile
═══════════════════════════════════════════════ */
function AyahBox({ ayah }) {
  const [open, setOpen] = useState(false);
  return (
    <ArchFrame tone={T.gold} tint={T.cardSoft}>
      <div style={{ padding:"6px 24px 16px" }}>
        <ArabicWithHighlight ar={ayah.ar} highlight={ayah.highlight} fontSize={21} />
        <div style={{ display:"flex", alignItems:"center", gap:9, marginTop:14, flexWrap:"wrap" }}>
          {ayah.audioUrl && <AyahPlayBtn src={ayah.audioUrl} accentColor={T.gold} />}
          <button onClick={() => setOpen(o => !o)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:99, background: open ? `${T.teal}1c` : `${T.teal}0e`, border:`1px solid ${T.teal}45`, color:T.tealDeep, cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit" }}>
            {open ? "▲ Masquer" : "Translittération & traduction"}
          </button>
        </div>
      </div>
      <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${T.gold}55, transparent)`, margin:"0 24px" }}/>
      {open ? (
        <div style={{ padding:"14px 24px 18px" }}>
          <p style={{ fontSize:13, color:T.tealDeep, fontStyle:"italic", marginBottom:7 }}>{ayah.tr}</p>
          <p style={{ fontSize:14, color:T.inkSoft, fontStyle:"italic", marginBottom:7 }}>« {ayah.fr} »</p>
          <p style={{ fontSize:11, color:T.gold, fontWeight:800, letterSpacing:"0.03em" }}>{ayah.ref}</p>
        </div>
      ) : (
        <div style={{ padding:"10px 24px 16px" }}>
          <p style={{ fontSize:11, color:T.gold, fontWeight:800, letterSpacing:"0.03em" }}>{ayah.ref}</p>
        </div>
      )}
    </ArchFrame>
  );
}

/* ═══════════════════════════════════════════════
   SHAHADA — featured tile pairing
═══════════════════════════════════════════════ */
function ShahadaBox() {
  return (
    <div style={{ margin:"4px 0", borderRadius:24, overflow:"hidden", border:`1px solid ${T.gold}50`, boxShadow:"0 6px 24px rgba(184,135,46,0.12)" }}>
      <div style={{ padding:"32px 28px 26px", background:`linear-gradient(165deg, ${T.cardSoft}, ${T.card})`, textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:14, left:"50%", transform:"translateX(-50%)" }}><Rosette size={26} /></div>
        <div style={{ height:30 }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9, marginBottom:22 }}>
          <div style={{ fontSize:10, fontWeight:800, color:T.tealDeep, letterSpacing:"0.18em", textTransform:"uppercase" }}>الشَّهَادَة · La Déclaration de Foi</div>
        </div>
        <p style={{ fontFamily:"'Lateef',serif", fontSize:34, color:T.clayDeep, lineHeight:2, direction:"rtl", marginBottom:16 }}>
          أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ
        </p>
        <p style={{ fontSize:12, color:T.muted, fontStyle:"italic", marginBottom:6 }}>Ash-hadu allā ilāha illā-llāh</p>
        <p style={{ fontSize:14, color:T.inkSoft, fontWeight:500 }}>Je témoigne qu'il n'y a de dieu qu'Allah</p>
      </div>
      <div style={{ height:2, background:`repeating-linear-gradient(90deg, ${T.gold} 0 14px, ${T.teal} 14px 28px)`, opacity:0.5 }}/>
      <div style={{ padding:"26px 28px 32px", background:T.bgDeep, textAlign:"center" }}>
        <p style={{ fontFamily:"'Lateef',serif", fontSize:34, color:T.tealDeep, lineHeight:2, direction:"rtl", marginBottom:16 }}>
          وَأَشْهَدُ أَنَّ مُحَمَّداً رَسُولُ اللَّهِ
        </p>
        <p style={{ fontSize:12, color:T.muted, fontStyle:"italic", marginBottom:6 }}>Wa ash-hadu anna Muḥammadan rasūlu-llāh</p>
        <p style={{ fontSize:14, color:T.inkSoft, fontWeight:500 }}>Et je témoigne que Muhammad est le messager d'Allah</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   QURAN RECITER
═══════════════════════════════════════════════ */
function QuranReciter() {
  const [selected, setSelected] = useState(0);
  const [activeVerse, setActiveVerse] = useState(null);
  const surah = SURAHS[selected];
  return (
    <div style={{ margin:"30px 0", borderRadius:22, border:`1px solid ${T.line}`, background:T.card, overflow:"hidden", boxShadow:"0 4px 18px rgba(60,46,34,0.06)" }}>
      <div style={{ padding:"17px 24px", borderBottom:`1px solid ${T.line}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, background:T.cardSoft }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <RosetteTiny size={20} color={T.gold} />
          <span style={{ fontSize:12, fontWeight:800, color:T.ink, letterSpacing:"0.04em", textTransform:"uppercase" }}>Réciteur du Coran</span>
          <span style={{ fontSize:11, color:T.muted }}>· Mishary Rashid Alafasy</span>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {SURAHS.map((s,i) => (
            <button key={i} onClick={() => { setSelected(i); setActiveVerse(null); }}
              style={{ padding:"6px 15px", borderRadius:99, background: selected===i ? T.gold : "transparent", border:`1px solid ${selected===i ? T.gold : T.line}`, color: selected===i ? "#fff" : T.inkSoft, fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.line}` }}>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Sourate · {surah.verses.length} versets</div>
          <div style={{ fontFamily:"'Lateef',serif", fontSize:24, color:T.gold }}>{surah.ar} — {surah.name}</div>
        </div>
        <AudioPlayer key={surah.audioUrl} src={surah.audioUrl} accentColor={T.gold} />
      </div>
      <div style={{ padding:"10px 10px 16px" }}>
        <div style={{ fontSize:10, color:T.muted, padding:"8px 16px 10px", letterSpacing:"0.04em" }}>
          Cliquez sur un verset pour la translittération & traduction
        </div>
        {surah.verses.map((v,i) => (
          <div key={i} style={{ borderRadius:14, border:`1px solid ${activeVerse===i ? T.gold+"45" : "transparent"}`, background: activeVerse===i ? `${T.gold}0d` : "transparent", transition:"all .15s", marginBottom:2 }}>
            <div onClick={() => setActiveVerse(activeVerse===i ? null : i)}
              style={{ padding:"11px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:10, color:T.muted, width:18, textAlign:"center", flexShrink:0 }}>{i+1}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Lateef',serif", fontSize:20, color:T.clayDeep, lineHeight:1.85, direction:"rtl", textAlign:"right" }}>{v.ar}</p>
              </div>
              {v.audioUrl && <AyahPlayBtn src={v.audioUrl} accentColor={T.gold} />}
            </div>
            {activeVerse===i && (
              <div style={{ padding:"7px 16px 15px 46px", borderTop:`1px solid ${T.line}` }}>
                <p style={{ fontSize:12, color:T.tealDeep, fontStyle:"italic", marginBottom:5 }}>{v.tr}</p>
                <p style={{ fontSize:13, color:T.inkSoft }}>« {v.fr} »</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Al-Fatiha standalone display ─── */
function FatihaDisplay() {
  const fatihaVerses = [
    { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", tr: "Bismi-llāhi r-raḥmāni r-raḥīm", fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux", audioUrl: ayahUrl(1,1) },
    { ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tr: "Al-ḥamdu li-llāhi rabbi l-ʿālamīn", fr: "Louange à Allah, Seigneur de l'Univers", audioUrl: ayahUrl(1,2) },
    { ar: "الرَّحْمَٰنِ الرَّحِيمِ", tr: "Ar-raḥmāni r-raḥīm", fr: "Le Tout Miséricordieux, le Très Miséricordieux", audioUrl: ayahUrl(1,3) },
    { ar: "مَالِكِ يَوْمِ الدِّينِ", tr: "Māliki yawmi d-dīn", fr: "Maître du Jour de la rétribution", audioUrl: ayahUrl(1,4) },
    { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", tr: "Iyyāka naʿbudu wa-iyyāka nastaʿīn", fr: "C'est Toi seul que nous adorons et Toi seul dont nous implorons le secours", audioUrl: ayahUrl(1,5) },
    { ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tr: "Ihdinā ṣ-ṣirāṭa l-mustaqīm", fr: "Guide-nous dans le droit chemin", audioUrl: ayahUrl(1,6) },
    { ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", tr: "Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn", fr: "Le chemin de ceux que Tu as comblés de bienfaits, non pas ceux qui ont encouru Ta colère, ni les égarés", audioUrl: ayahUrl(1,7) },
  ];
  const [sel, setSel] = useState(null);
  return (
    <div style={{ margin:"20px 0", borderRadius:18, border:`1px solid ${T.line}`, background:T.card, overflow:"hidden" }}>
      <div style={{ padding:"13px 20px", borderBottom:`1px solid ${T.line}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:T.cardSoft }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:"'Lateef',serif", fontSize:19, color:T.gold }}>الفاتحة</span>
          <span style={{ fontSize:11, color:T.muted }}>· 7 versets</span>
        </div>
        <span style={{ fontSize:10, color:T.muted }}>Cliquer pour traduire</span>
      </div>
      <div style={{ padding:"6px 8px 10px" }}>
        {fatihaVerses.map((v,i) => (
          <div key={i} style={{ borderRadius:12, border:`1px solid ${sel===i ? T.gold+"45" : "transparent"}`, background: sel===i ? `${T.gold}0d` : "transparent", transition:"all .15s", marginBottom:2 }}>
            <div onClick={() => setSel(sel===i ? null : i)} style={{ padding:"10px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:10, color:T.muted, width:18, textAlign:"center", flexShrink:0 }}>{i+1}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Lateef',serif", fontSize:19, color:T.clayDeep, lineHeight:1.85, direction:"rtl", textAlign:"right" }}>{v.ar}</p>
              </div>
              {v.audioUrl && <AyahPlayBtn src={v.audioUrl} accentColor={T.gold} />}
            </div>
            {sel===i && (
              <div style={{ padding:"6px 12px 12px 40px", borderTop:`1px solid ${T.line}` }}>
                <p style={{ fontSize:12, color:T.tealDeep, fontStyle:"italic", marginBottom:5 }}>{v.tr}</p>
                <p style={{ fontSize:13, color:T.inkSoft }}>« {v.fr} »</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Hadith box ─── */
function HadithBox({ hadith }) {
  return (
    <div style={{ margin:"20px 0", background:T.cardSoft, borderRadius:16, border:`1px solid ${T.teal}30`, borderLeft:`4px solid ${T.teal}`, padding:"18px 22px" }}>
      <p style={{ fontSize:14, color:T.inkSoft, lineHeight:1.9, fontStyle:"italic", marginBottom:8 }}>« {hadith.text} »</p>
      <p style={{ fontSize:11, color:T.tealDeep, fontWeight:800, letterSpacing:"0.03em" }}>{hadith.ref}</p>
    </div>
  );
}

function PillarDetail({ pd }) {
  return (
    <ArchFrame tone={T.gold} tint={T.cardSoft}>
      <div style={{ padding:"10px 24px 22px" }}>
        <p style={{ fontFamily:"'Lateef',serif", fontSize:22, color:T.clayDeep, textAlign:"right", direction:"rtl", lineHeight:1.9, marginBottom:11 }}>{pd.arabic}</p>
        <p style={{ fontSize:13, color:T.tealDeep, fontStyle:"italic", marginBottom:7 }}>{pd.transliteration}</p>
        <p style={{ fontSize:14, color:T.inkSoft }}>« {pd.meaning} »</p>
      </div>
    </ArchFrame>
  );
}

function WudhuSteps({ steps }) {
  const [active, setActive] = useState(0);
  return (
    <div style={{ margin:"20px 0" }}>
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {steps.map((s,i) => (
          <button key={i} onClick={() => setActive(i)} style={{ width:34, height:34, borderRadius:"50%", border:`1.5px solid ${active===i ? T.teal : T.line}`, background: active===i ? `${T.teal}1c` : T.card, color: active===i ? T.tealDeep : T.muted, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>
            {s.step}
          </button>
        ))}
      </div>
      <div style={{ background:T.cardSoft, borderRadius:18, padding:"20px", border:`1px solid ${T.teal}30` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ width:26, height:26, borderRadius:"50%", background:T.teal, color:"#fff", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{steps[active].step}</span>
          <span style={{ fontSize:15, fontWeight:700, color:T.ink }}>{steps[active].fr}</span>
          <span style={{ fontFamily:"'Lateef',serif", fontSize:15, color:T.gold }}>{steps[active].ar}</span>
        </div>
        <p style={{ fontSize:14, color:T.inkSoft, lineHeight:1.8 }}>{steps[active].desc}</p>
        <div style={{ display:"flex", gap:8, marginTop:16 }}>
          <button onClick={() => setActive(a => Math.max(0,a-1))} disabled={active===0} style={{ padding:"8px 16px", borderRadius:99, border:`1px solid ${T.line}`, background:T.card, color:T.inkSoft, cursor: active===0 ? "not-allowed" : "pointer", opacity: active===0 ? 0.4 : 1, fontSize:12, fontFamily:"inherit" }}>← Précédent</button>
          <button onClick={() => setActive(a => Math.min(steps.length-1,a+1))} disabled={active===steps.length-1} style={{ padding:"8px 16px", borderRadius:99, background:T.teal, border:"none", color:"#fff", cursor: active===steps.length-1 ? "not-allowed" : "pointer", opacity: active===steps.length-1 ? 0.4 : 1, fontSize:12, fontWeight:700, fontFamily:"inherit" }}>Suivant →</button>
        </div>
      </div>
    </div>
  );
}

function PrayerSteps({ steps }) {
  const [active, setActive] = useState(0);
  const step = steps[active];
  return (
    <div style={{ margin:"20px 0" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:18 }}>
        {steps.map((s,i) => (
          <button key={i} onClick={() => setActive(i)} style={{ padding:"11px 6px", textAlign:"center", borderRadius:14, border:`1.5px solid ${active===i ? T.tealDeep : T.line}`, background: active===i ? `${T.tealDeep}12` : T.card, cursor:"pointer", transition:"all .2s" }}>
            <div style={{ fontFamily:"'Lateef',serif", fontSize:14, color: active===i ? T.tealDeep : T.gold, marginBottom:4 }}>{s.pos}</div>
            <div style={{ fontSize:10, color: active===i ? T.tealDeep : T.muted, fontWeight:600, fontFamily:"inherit", lineHeight:1.2 }}>{s.fr}</div>
          </button>
        ))}
      </div>
      <div style={{ background:T.cardSoft, borderRadius:18, padding:"20px", border:`1px solid ${T.tealDeep}28` }}>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"'Lateef',serif", fontSize:20, color:T.tealDeep }}>{step.pos}</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>{step.fr}</div>
        </div>
        <p style={{ fontSize:14, color:T.inkSoft, lineHeight:1.8, marginBottom:15 }}>{step.desc}</p>
        <div style={{ background:`${T.tealDeep}0d`, borderRadius:12, border:`1px solid ${T.tealDeep}28`, padding:"12px 15px" }}>
          <div style={{ fontSize:10, color:T.tealDeep, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Dhikr</div>
          <div style={{ fontFamily:"'Lateef',serif", fontSize:17, color:T.clayDeep, direction:"rtl", lineHeight:1.7 }}>{step.dhikr.split(" · ")[0]}</div>
          {step.dhikr.includes(" · ") && <div style={{ fontSize:11, color:T.tealDeep, fontStyle:"italic", marginTop:4 }}>{step.dhikr.split(" · ").slice(1).join(" · ")}</div>}
        </div>
        <div style={{ display:"flex", gap:8, marginTop:15 }}>
          <button onClick={() => setActive(a => Math.max(0,a-1))} disabled={active===0} style={{ flex:1, padding:"10px", borderRadius:99, border:`1px solid ${T.line}`, background:T.card, color:T.inkSoft, cursor: active===0 ? "not-allowed" : "pointer", opacity: active===0 ? 0.4 : 1, fontSize:12, fontFamily:"inherit" }}>← Préc.</button>
          <button onClick={() => setActive(a => Math.min(steps.length-1,a+1))} disabled={active===steps.length-1} style={{ flex:1, padding:"10px", borderRadius:99, background:T.tealDeep, border:"none", color:"#fff", cursor: active===steps.length-1 ? "not-allowed" : "pointer", opacity: active===steps.length-1 ? 0.4 : 1, fontSize:12, fontWeight:700, fontFamily:"inherit" }}>Suivant →</button>
        </div>
      </div>
    </div>
  );
}

function PrayerTimesTable({ times }) {
  return (
    <div style={{ margin:"20px 0", borderRadius:18, overflow:"hidden", border:`1px solid ${T.line}` }}>
      {times.map((t,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", background: i%2===0 ? T.card : T.cardSoft, borderBottom: i<times.length-1 ? `1px solid ${T.line}` : "none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontFamily:"'Lateef',serif", fontSize:18, color:T.gold, minWidth:58, textAlign:"right", direction:"rtl" }}>{t.name}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{t.fr}</div>
              <div style={{ fontSize:11, color:T.muted }}>{t.time}</div>
            </div>
          </div>
          <div style={{ background:`${T.gold}16`, border:`1px solid ${T.gold}35`, padding:"4px 13px", borderRadius:99 }}>
            <span style={{ fontSize:11, color:T.gold, fontWeight:800 }}>{t.rakaat} rak'at</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ImanPillars({ pillars }) {
  const [sel, setSel] = useState(0);
  return (
    <div style={{ margin:"20px 0" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:18 }}>
        {pillars.map((p,i) => (
          <button key={i} onClick={() => setSel(i)} style={{ padding:"15px 7px", textAlign:"center", borderRadius:14, border:`1.5px solid ${sel===i ? T.plum : T.line}`, background: sel===i ? `${T.plum}14` : T.card, cursor:"pointer", transition:"all .2s" }}>
            <RosetteTiny size={20} color={sel===i ? T.plum : T.mutedLt} />
            <div style={{ fontSize:10, color: sel===i ? T.plum : T.muted, fontWeight:700, fontFamily:"inherit", lineHeight:1.3, marginTop:6 }}>{p.fr}</div>
          </button>
        ))}
      </div>
      <div style={{ background:T.cardSoft, borderRadius:18, padding:"20px", border:`1px solid ${T.plum}30` }}>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"'Lateef',serif", fontSize:20, color:T.plum }}>{pillars[sel].ar}</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>{pillars[sel].fr}</div>
        </div>
        <p style={{ fontSize:14, color:T.inkSoft, lineHeight:1.9 }}>{pillars[sel].desc}</p>
      </div>
    </div>
  );
}

function DailyPractices({ practices }) {
  const [flipped, setFlipped] = useState(null);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10, margin:"20px 0" }}>
      {practices.map((p,i) => (
        <div key={i} onClick={() => setFlipped(flipped===i ? null : i)} style={{ background: flipped===i ? `${p.color}14` : T.card, borderRadius:16, border:`1.5px solid ${flipped===i ? p.color+"55" : T.line}`, padding:"14px 16px", cursor:"pointer", transition:"all .25s", boxShadow: flipped===i ? "0 4px 14px rgba(60,46,34,0.08)" : "none" }}>
          <div style={{ fontFamily:"'Lateef',serif", fontSize:20, color: flipped===i ? p.color : T.clayDeep, marginBottom:7, direction:"rtl", textAlign:"right" }}>{p.ar}</div>
          <div style={{ fontSize:13, fontWeight:800, color:p.color, marginBottom:5 }}>{p.fr}</div>
          {flipped===i ? (
            <>
              <div style={{ fontSize:11, color:T.gold, marginBottom:6, fontStyle:"italic" }}>{p.when}</div>
              <div style={{ fontSize:12, color:T.inkSoft, lineHeight:1.65 }}>{p.desc}</div>
            </>
          ) : (
            <div style={{ fontSize:11, color:T.mutedLt }}>Appuyer pour plus →</div>
          )}
        </div>
      ))}
    </div>
  );
}

function HalalHaram({ data }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, margin:"20px 0" }}>
      <div style={{ background:"#EFF6EE", borderRadius:16, border:"1px solid rgba(76,143,92,0.3)", padding:"18px" }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.green, marginBottom:12 }}>Halal — حلال</div>
        {data.halal.map((item,i) => <div key={i} style={{ display:"flex", gap:9, marginBottom:9, fontSize:13, color:T.inkSoft }}><span style={{ color:T.green, flexShrink:0 }}>●</span>{item}</div>)}
      </div>
      <div style={{ background:"#FAEEEA", borderRadius:16, border:"1px solid rgba(181,80,61,0.3)", padding:"18px" }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.red, marginBottom:12 }}>Haram — حرام</div>
        {data.haram.map((item,i) => <div key={i} style={{ display:"flex", gap:9, marginBottom:9, fontSize:13, color:T.inkSoft }}><span style={{ color:T.red, flexShrink:0 }}>●</span>{item}</div>)}
      </div>
    </div>
  );
}

function VideoEmbed({ video }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ margin:"24px 0", borderRadius:18, overflow:"hidden", border:`1px solid ${T.line}`, boxShadow:"0 4px 16px rgba(60,46,34,0.06)" }}>
      <div style={{ background:T.cardSoft, padding:"13px 20px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{video.title}</div>
        <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>{video.desc}</div>
      </div>
      {!show ? (
        <div onClick={() => setShow(true)} style={{ background:"#000", height:200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", backgroundImage:`url(https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg)`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(40,28,18,0.4)" }}/>
          <div style={{ position:"relative", zIndex:1, width:52, height:52, borderRadius:"50%", background:T.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:"#fff", boxShadow:"0 4px 14px rgba(0,0,0,0.3)" }}>▶</div>
          <div style={{ position:"relative", zIndex:1, marginTop:10, fontSize:11, color:"#fff", fontWeight:600 }}>Cliquer pour regarder</div>
        </div>
      ) : (
        <iframe width="100%" height="260" src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen style={{ display:"block" }}/>
      )}
    </div>
  );
}

function FunFact({ text }) {
  return (
    <div style={{ margin:"20px 0 24px", padding:"15px 20px", background:T.cardSoft, borderRadius:16, border:`1px solid ${T.gold}35`, borderLeft:`4px solid ${T.gold}`, display:"flex", gap:13, alignItems:"flex-start" }}>
      <RosetteTiny size={17} color={T.gold} />
      <p style={{ fontSize:13, color:T.inkSoft, lineHeight:1.8 }}>{text}</p>
    </div>
  );
}

function Quiz({ questions, color }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const pick = (i) => { if (ans!==null) return; setAns(i); if (i===questions[step].ans) setScore(s=>s+1); };
  const next = () => { if (step+1>=questions.length) { setDone(true); return; } setStep(s=>s+1); setAns(null); };
  const reset = () => { setStep(0); setAns(null); setScore(0); setDone(false); };
  const pct = Math.round((score/questions.length)*100);
  return (
    <div style={{ marginTop:30, background:T.card, borderRadius:22, border:`1px solid ${T.line}`, padding:"26px", boxShadow:"0 4px 18px rgba(60,46,34,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:9, fontSize:11, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:2, marginBottom:18 }}>
        <RosetteTiny size={15} color={color} /> Vérification de la compréhension
      </div>
      {!done ? (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:13, color:T.muted }}>Question {step+1} / {questions.length}</span>
            <div style={{ display:"flex", gap:5 }}>{questions.map((_,i)=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background: i<=step ? color : T.line, opacity: i>step ? 0.6 : 1 }}/>)}</div>
          </div>
          <div style={{ height:4, background:T.line, borderRadius:99, marginBottom:20, overflow:"hidden" }}>
            <div style={{ width:`${(step/questions.length)*100}%`, height:"100%", background:color, transition:"width .4s", borderRadius:99 }}/>
          </div>
          <p style={{ fontSize:15, fontWeight:600, color:T.ink, lineHeight:1.6, marginBottom:16 }}>{questions[step].q}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {questions[step].opts.map((opt,i) => {
              let bg=T.cardSoft, border=T.line, col=T.ink;
              if (ans!==null) {
                if (i===questions[step].ans) { bg="#EAF5EC"; border=T.green; col="#2E6B3C"; }
                else if (i===ans) { bg="#FBEDE9"; border=T.red; col="#8C3D2C"; }
              }
              return (
                <button key={i} onClick={() => pick(i)} disabled={ans!==null} style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:14, color:col, padding:"12px 16px", cursor: ans!==null ? "default" : "pointer", textAlign:"left", fontSize:14, fontFamily:"inherit", transition:"all .2s", display:"flex", alignItems:"center", gap:11 }}>
                  <span style={{ width:22, height:22, borderRadius:"50%", border:`1.5px solid ${border}`, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, flexShrink:0 }}>{["A","B","C","D"][i]}</span>
                  {opt}
                  {ans!==null && i===questions[step].ans && <span style={{ marginLeft:"auto" }}>✓</span>}
                  {ans!==null && i===ans && i!==questions[step].ans && <span style={{ marginLeft:"auto" }}>✗</span>}
                </button>
              );
            })}
          </div>
          {ans!==null && <button onClick={next} style={{ marginTop:16, background:color, border:"none", borderRadius:99, color:"#fff", padding:"11px 24px", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>{step+1>=questions.length ? "Voir le résultat →" : "Question suivante →"}</button>}
        </>
      ) : (
        <div style={{ textAlign:"center", padding:"12px 0" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <Rosette size={64} spin />
          </div>
          <div style={{ fontSize:30, fontWeight:900, color, marginBottom:5 }}>{score}/{questions.length}</div>
          <div style={{ fontSize:14, color:T.muted, marginBottom:22 }}>{pct===100?"Parfait ! Excellent travail !":pct>=70?"Très bien ! Continuez ainsi.":"Révisez le cours et réessayez."}</div>
          <button onClick={reset} style={{ background:color, border:"none", borderRadius:99, color:"#fff", padding:"11px 26px", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Recommencer le quiz</button>
        </div>
      )}
    </div>
  );
}

/* ─── Chapter icon glyphs — minimal line marks ─── */
function ChapterIcon({ type, color, size = 30 }) {
  const common = { width: size, height: size, viewBox: "0 0 32 32", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "crescent") return <svg {...common}><path d="M20 6a11 11 0 1 0 0 20 9 9 0 1 1 0-20Z" /></svg>;
  if (type === "pillar") return <svg {...common}><path d="M9 26h14M11 26V11M21 26V11M8 11h16l-8-6-8 6Z" /></svg>;
  if (type === "star") return <svg {...common}><polygon points={rosettePoints(16,16,13,7)} /></svg>;
  if (type === "prayer") return <svg {...common}><path d="M16 6v6M11 16h10M9 26h14M16 12c-3 3-5 5-5 9M16 12c3 3 5 5 5 9" /></svg>;
  if (type === "branch") return <svg {...common}><path d="M16 27V9M16 9c-3-3-7-3-8 0 4 1 6 3 8 6M16 9c3-3 7-3 8 0-4 1-6 3-8 6" /></svg>;
  return null;
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function BecomeMuslim() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [visible, setVisible] = useState(false);
  const ch = CHAPTERS[activeChapter];

  const markDone = (id) => {
    if (completed.includes(id)) return;
    setCompleted(c => [...c, id]);
    const chapter = CHAPTERS.find(c => c.id === id);
    saveProgress(`${COURSE_TITLE} — ${MODULE_TITLE} — ${chapter.fr}`);
  };

  // Load already-completed chapters from the backend on mount — without this,
  // progress always reset to 0 when leaving and reentering the course
  // (this course previously didn't save to the backend at all).
  useEffect(() => {
    if (!getUser()) return;
    api.get("/api/me")
      .then(r => {
        const doneSet = new Set(r.data.completedLessons || []);
        const done = [];
        CHAPTERS.forEach(c => {
          if (doneSet.has(`${COURSE_TITLE} — ${MODULE_TITLE} — ${c.fr}`)) done.push(c.id);
        });
        setCompleted(done);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setVisible(false);
    window.scrollTo({ top:0 });
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [activeChapter]);

  const renderSection = (sec, i) => (
    <div key={i} style={{ marginBottom:36 }}>
      <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:600, color:ch.color, marginBottom:14, paddingBottom:12, borderBottom:`1px dashed ${T.line}`, letterSpacing:"0.01em" }}>{sec.title}</h3>
      {sec.text && <p style={{ fontSize:14, color:T.inkSoft, lineHeight:2, marginBottom:12 }}>{sec.text}</p>}
      {sec.ayah          && <AyahBox ayah={sec.ayah} />}
      {sec.hadith        && <HadithBox hadith={sec.hadith} />}
      {sec.pillarDetails && <PillarDetail pd={sec.pillarDetails} />}
      {sec.shahada       && <ShahadaBox />}
      {sec.prayerTimes   && <PrayerTimesTable times={sec.prayerTimes} />}
      {sec.wudhuSteps    && <WudhuSteps steps={sec.wudhuSteps} />}
      {sec.wudhuVideo    && <VideoEmbed video={sec.wudhuVideo} />}
      {sec.ghuslVideo    && <VideoEmbed video={sec.ghuslVideo} />}
      {sec.prayerSteps   && <PrayerSteps steps={sec.prayerSteps} />}
      {sec.fatiha        && <FatihaDisplay />}
      {sec.imanPillars   && <ImanPillars pillars={sec.imanPillars} />}
      {sec.dailyPractices && <DailyPractices practices={sec.dailyPractices} />}
      {sec.halalHaram    && <HalalHaram data={sec.halalHaram} />}
    </div>
  );

  const progress = Math.round((completed.length / CHAPTERS.length) * 100);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Mulish','Source Sans 3',system-ui,sans-serif", color:T.ink, position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lateef:wght@400;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Mulish:wght@400;500;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes soundWave { from { transform:scaleY(0.4); } to { transform:scaleY(1); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes rosetteSpin { to { transform:rotate(360deg); } }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:${T.bg}; }
        ::-webkit-scrollbar-thumb { background:${T.line}; border-radius:99px; }
        @media (prefers-reduced-motion: reduce) { *{ animation-duration:0.01ms !important; } }
        .ch-tab:focus-visible, .nav-btn:focus-visible, button:focus-visible { outline:2px solid ${T.tealDeep}; outline-offset:2px; }
        @media (max-width:760px) { .chapter-rail{ overflow-x:auto; flex-wrap:nowrap !important; } }
      `}</style>

      <Backdrop />

      {/* HERO */}
      <div style={{ position:"relative", padding:"70px 24px 0", overflow:"hidden" }}>
        <div style={{ maxWidth:880, margin:"0 auto", position:"relative", zIndex:1, textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:22 }}>
            <Rosette size={56} />
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:99, background:T.card, border:`1px solid ${T.gold}45`, fontSize:11, color:T.gold, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>
            Guide d'introduction à l'Islam
          </div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:600, fontSize:"clamp(2rem,4.6vw,2.9rem)", color:T.ink, marginBottom:11, lineHeight:1.14, letterSpacing:"-0.01em" }}>Comment devenir Musulman ?</h1>
          <p style={{ fontFamily:"'Lateef',serif", fontSize:"clamp(1.3rem,3vw,1.7rem)", color:T.clayDeep, marginBottom:16 }}>كَيْفَ تُصْبِحُ مُسْلِماً؟</p>
          <p style={{ fontSize:14.5, color:T.inkSoft, maxWidth:520, lineHeight:1.9, margin:"0 auto 30px" }}>Un guide bienveillant, pas à pas : la Chahada, les piliers de l'Islam, la prière, et la vie quotidienne du croyant.</p>

          <div style={{ maxWidth:420, margin:"0 auto 32px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.muted, marginBottom:7 }}>
              <span>{completed.length} / {CHAPTERS.length} chapitres complétés</span>
              <span style={{ color:T.clayDeep, fontWeight:800 }}>{progress}%</span>
            </div>
            <div style={{ height:6, background:T.line, borderRadius:99, overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${T.teal},${T.gold},${T.clay})`, transition:"width .5s ease", borderRadius:99 }}/>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER RAIL — horizontal tab navigation replacing the old sidebar */}
      <div style={{ position:"sticky", top:0, zIndex:5, background:`${T.bg}f2`, backdropFilter:"blur(6px)", borderBottom:`1px solid ${T.line}`, padding:"14px 24px" }}>
        <div className="chapter-rail" style={{ maxWidth:1000, margin:"0 auto", display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          {CHAPTERS.map((c,i) => (
            <button key={i} className="ch-tab" onClick={() => setActiveChapter(i)} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 16px", borderRadius:99, background: activeChapter===i ? c.color : completed.includes(i) ? `${T.teal}12` : T.card, border:`1.5px solid ${activeChapter===i ? c.color : completed.includes(i) ? T.teal : T.line}`, fontSize:12, fontWeight:700, color: activeChapter===i ? "#fff" : completed.includes(i) ? T.tealDeep : T.inkSoft, cursor:"pointer", transition:"all .2s", flexShrink:0, fontFamily:"inherit", whiteSpace:"nowrap" }}>
              <span style={{ width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                {completed.includes(i) && activeChapter!==i ? "✓" : <ChapterIcon type={c.icon} color={activeChapter===i ? "#fff" : completed.includes(i) ? T.tealDeep : T.inkSoft} size={15} />}
              </span>
              {c.fr}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth:760, margin:"0 auto", padding:"36px 24px 80px", position:"relative", zIndex:1 }}>
        <main style={{ opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(10px)", transition:"opacity .35s,transform .35s" }}>

          <div style={{ background:T.card, borderRadius:24, border:`1px solid ${T.line}`, borderTop:`5px solid ${ch.color}`, padding:"26px 28px", marginBottom:30, position:"relative", boxShadow:"0 6px 22px rgba(60,46,34,0.07)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:14 }}>
              <div style={{ width:54, height:54, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", background:`${ch.color}14`, border:`1px solid ${ch.color}40`, flexShrink:0 }}>
                <ChapterIcon type={ch.icon} color={ch.color} size={28} />
              </div>
              <div>
                <div style={{ fontFamily:"'Lateef',serif", fontSize:24, color:ch.color, lineHeight:1.1 }}>{ch.ar}</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:19, fontWeight:600, color:T.ink }}>{ch.fr}</div>
              </div>
            </div>
            <p style={{ fontSize:14.5, color:T.inkSoft, lineHeight:1.95 }}>{ch.intro}</p>
          </div>

          <FunFact text={ch.funFact} />
          {ch.sections.map((sec,i) => (
            <>
              {renderSection(sec,i)}
              {i < ch.sections.length - 1 && <TileDivider />}
            </>
          ))}
          {ch.hasReciter && <QuranReciter />}
          {ch.video && <VideoEmbed video={ch.video} />}
          <Quiz questions={ch.quiz} color={ch.color} />

          <div style={{ marginTop:30, paddingTop:22, borderTop:`1px dashed ${T.line}` }}>
            {completed.includes(ch.id) ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9, padding:"13px 18px", borderRadius:13, background:`${T.teal}12`, border:`1px solid ${T.teal}40`, color:T.tealDeep, fontWeight:700, fontSize:13, marginBottom:18 }}>
                ✓ Chapitre lu et compris
              </div>
            ) : (
              <button onClick={() => markDone(ch.id)}
                style={{ width:"100%", padding:"13px 18px", borderRadius:13, background:ch.color, border:"none", color:"#fff", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", marginBottom:18, boxShadow:`0 4px 14px ${ch.color}40` }}>
                ✓ J'ai lu et compris ce chapitre
              </button>
            )}
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <button className="nav-btn" onClick={() => { if (activeChapter>0) setActiveChapter(a=>a-1); }} disabled={activeChapter===0}
                style={{ padding:"11px 20px", borderRadius:99, border:`1px solid ${T.line}`, background:T.card, color:T.inkSoft, cursor: activeChapter===0?"not-allowed":"pointer", opacity: activeChapter===0?0.4:1, fontSize:13, fontFamily:"inherit" }}>
                ← Précédent
              </button>
              <button className="nav-btn" onClick={() => { if (activeChapter<CHAPTERS.length-1) setActiveChapter(a=>a+1); }} disabled={activeChapter===CHAPTERS.length-1}
                style={{ padding:"11px 24px", borderRadius:99, background:ch.color, border:"none", color:"#fff", cursor: activeChapter===CHAPTERS.length-1?"not-allowed":"pointer", opacity: activeChapter===CHAPTERS.length-1?0.4:1, fontWeight:700, fontSize:13, fontFamily:"inherit", boxShadow:`0 4px 14px ${ch.color}40` }}>
                Chapitre suivant →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}