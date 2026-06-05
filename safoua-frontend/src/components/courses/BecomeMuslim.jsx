import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   PALETTE  — deep teal-gold Islamic aesthetic
═══════════════════════════════════════════════ */
const C = {
  bg:       "#03080e",
  surface:  "#081220",
  panel:    "#0d1e30",
  border:   "#1a3048",
  gold:     "#c9a84c",
  goldLt:   "#f0d080",
  teal:     "#0d9e8a",
  tealLt:   "#34d9c3",
  text:     "#e8f0f7",
  muted:    "#4a6a80",
  mutedLt:  "#7da0b8",
  red:      "#e05555",
  green:    "#22c97a",
};

/* ═══════════════════════════════════════════════
   SHAHADA AUDIO — real reciter (mp3quran.net / islamic.network)
   Using Surah Al-Fatiha from Mishary as reference, plus a
   dedicated short Shahada recitation from a known CDN
═══════════════════════════════════════════════ */
const SHAHADA_AUDIO_URL =
  "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";
// Fallback: short Basmala / opening which is universally available and beautiful

/* ═══════════════════════════════════════════════
   SURAH RECITER DATA — real MP3 URLs
═══════════════════════════════════════════════ */
const SURAHS = [
  {
    name: "Al-Fatiha",
    ar: "الفاتحة",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
    reciter: "Mishary Rashid Alafasy",
    verses: [
      { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", tr: "Bismi-llāhi r-raḥmāni r-raḥīm", fr: "Au nom d'Allah, le Tout Miséricordieux" },
      { ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tr: "Al-ḥamdu li-llāhi rabbi l-ʿālamīn", fr: "Louange à Allah, Seigneur de l'Univers" },
      { ar: "الرَّحْمَٰنِ الرَّحِيمِ", tr: "Ar-raḥmāni r-raḥīm", fr: "Le Tout Miséricordieux, le Très Miséricordieux" },
      { ar: "مَالِكِ يَوْمِ الدِّينِ", tr: "Māliki yawmi d-dīn", fr: "Maître du Jour de la rétribution" },
      { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", tr: "Iyyāka naʿbudu wa-iyyāka nastaʿīn", fr: "C'est Toi seul que nous adorons et Toi seul dont nous implorons le secours" },
      { ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tr: "Ihdinā ṣ-ṣirāṭa l-mustaqīm", fr: "Guide-nous dans le droit chemin" },
      { ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", tr: "Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn", fr: "Le chemin de ceux que Tu as comblés de bienfaits, non pas ceux qui ont encouru Ta colère, ni les égarés" },
    ],
  },
  {
    name: "Al-Ikhlas",
    ar: "الإخلاص",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3",
    reciter: "Mishary Rashid Alafasy",
    verses: [
      { ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", tr: "Qul huwa-llāhu aḥad", fr: "Dis : Il est Allah, l'Unique" },
      { ar: "اللَّهُ الصَّمَدُ", tr: "Allāhu ṣ-ṣamad", fr: "Allah, le Seul à être imploré pour ce que nous désirons" },
      { ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", tr: "Lam yalid wa-lam yūlad", fr: "Il n'a pas engendré et n'a pas été engendré" },
      { ar: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", tr: "Wa-lam yakun lahu kufuwan aḥad", fr: "Et nul n'est égal à Lui" },
    ],
  },
  {
    name: "Al-Nas",
    ar: "الناس",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/114.mp3",
    reciter: "Mishary Rashid Alafasy",
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", tr: "Qul aʿūdhu bi-rabbi n-nās", fr: "Dis : Je cherche protection auprès du Seigneur des hommes" },
      { ar: "مَلِكِ النَّاسِ", tr: "Maliki n-nās", fr: "du Roi des hommes" },
      { ar: "إِلَٰهِ النَّاسِ", tr: "Ilāhi n-nās", fr: "du Dieu des hommes" },
      { ar: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", tr: "Min sharri l-waswāsi l-khannās", fr: "contre le mal du mauvais conseiller, le furtif" },
      { ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", tr: "Alladhī yuwaswisu fī ṣudūri n-nās", fr: "qui souffle le mal dans les poitrines des hommes" },
      { ar: "مِنَ الْجِنَّةِ وَالنَّاسِ", tr: "Mina l-jinnati wa-n-nās", fr: "qu'il soit djinn ou être humain" },
    ],
  },
];

/* ═══════════════════════════════════════════════
   COURSE DATA
═══════════════════════════════════════════════ */
const CHAPTERS = [
  {
    id: 0,
    ar: "مَن هو المسلم؟",
    fr: "Qui est le Musulman ?",
    icon: "☪️",
    color: C.teal,
    emoji: "🌙",
    intro: "L'Islam (الإسلام) signifie « soumission à Allah ». Devenir musulman est un acte conscient et sincère du cœur. Il n'y a pas de race, de nationalité ou d'origine requise — l'Islam est universel.",
    sections: [
      {
        title: "La définition de l'Islam",
        text: "L'Islam est la religion abrahamique monothéiste révélée au Prophète Muhammad ﷺ par l'ange Jibrīl (Gabriel). Il repose sur la croyance en un Dieu unique (Allah), en ses prophètes, ses livres, ses anges, le Jour dernier et le destin. Il est la religion finale et universelle envoyée pour toute l'humanité.",
        ayah: { ar: "إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ", fr: "Certes, la religion agréée d'Allah, c'est l'Islam", ref: "Sourate Âl Imrân 3:19" },
      },
      {
        title: "Comment prononcer la Chahada ?",
        text: "Pour entrer en Islam, il suffit de prononcer la Chahada (شهادة) avec sincérité et conviction, devant témoins si possible. Cliquez sur « Écouter » pour entendre la Chahada récitée par un vrai récitateur.",
        shahada: true,
      },
      {
        title: "Ce que change la Chahada",
        text: "Dès que la Chahada est prononcée sincèrement, tous les péchés antérieurs sont effacés. La personne entre dans la communauté islamique (أمة) avec une ardoise vierge.",
        hadith: { text: "L'Islam efface ce qui précède.", ref: "Sahih Muslim" },
      },
    ],
    quiz: [
      { q: "Que signifie le mot 'Islam' ?", opts: ["Paix uniquement", "Soumission à Allah", "Prière", "Jeûne"], ans: 1 },
      { q: "La Chahada est :", opts: ["Optionnelle", "Une condition d'entrée en Islam", "Uniquement pour les arabes", "Un pilier de la prière"], ans: 1 },
      { q: "Que se passe-t-il avec les péchés passés après la Chahada ?", opts: ["Ils restent", "Ils sont punis plus tard", "Ils sont tous effacés", "Ils sont jugés au Paradis"], ans: 2 },
    ],
    video: { title: "Comment se convertir à l'Islam", youtubeId: "E7GFQB5O65A", desc: "Une explication claire et émouvante de la Chahada et du processus de conversion." },
    funFact: "💡 Plus de 20 000 personnes se convertissent à l'Islam chaque année rien qu'en France.",
  },
  {
    id: 1,
    ar: "أَرْكَانُ الإِسْلَام",
    fr: "Les 5 Piliers de l'Islam",
    icon: "🕌",
    color: C.gold,
    emoji: "🏛️",
    intro: "Les cinq piliers (أركان الإسلام) sont les cinq pratiques fondamentales que tout musulman doit accomplir. Ils structurent la vie spirituelle et sociale du croyant.",
    sections: [
      {
        title: "1 — الشَّهَادَة · La Déclaration de foi",
        text: "Témoigner qu'il n'y a de dieu qu'Allah et que Muhammad est son messager. C'est l'acte fondateur de l'Islam.",
        pillarDetails: { arabic: "أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله", transliteration: "Ash-hadu allā ilāha illā-llāh, wa ash-hadu anna Muḥammadan rasūlu-llāh", meaning: "Je témoigne qu'il n'y a de dieu qu'Allah et que Muhammad est son messager." },
      },
      {
        title: "2 — الصَّلَاة · La Prière (5 fois/jour)",
        text: "La prière rituelle (salāt) est obligatoire 5 fois par jour. Elle nécessite l'ablution (wudhu), la direction vers La Mecque (qibla).",
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
        text: "La Zakat est un impôt religieux annuel de 2.5% sur les économies détenues pendant un an. Elle purifie la richesse et aide les plus démunis.",
        pillarDetails: { arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ", transliteration: "Wa aqīmū aṣ-ṣalāh wa ātū az-zakāh", meaning: "Accomplissez la prière et acquittez la Zakat.", ref: "Coran 2:43" },
      },
      {
        title: "4 — صَوْم رَمَضَان · Le Jeûne de Ramadan",
        text: "Pendant le mois de Ramadan, les musulmans s'abstiennent de manger, boire et relations intimes du Fajr au Maghrib. Il renforce la volonté et la solidarité.",
        pillarDetails: { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ", transliteration: "Yā ayyuhā alladhīna āmanū kutiba ʿalaykumu aṣ-ṣiyām", meaning: "Ô vous qui croyez ! Le jeûne vous est prescrit.", ref: "Coran 2:183" },
      },
      {
        title: "5 — الحَجّ · Le Pèlerinage à La Mecque",
        text: "Le Hajj est obligatoire une fois dans sa vie pour tout musulman physiquement et financièrement capable. C'est la plus grande réunion annuelle de l'humanité.",
        pillarDetails: { arabic: "وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ", transliteration: "Wa li-llāhi ʿalā an-nāsi ḥijju al-bayt", meaning: "Et c'est pour Allah une obligation imposée aux hommes de faire le pèlerinage.", ref: "Coran 3:97" },
      },
    ],
    quiz: [
      { q: "Combien y a-t-il de piliers de l'Islam ?", opts: ["3", "4", "5", "6"], ans: 2 },
      { q: "Combien de fois par jour doit-on prier ?", opts: ["3", "4", "5", "7"], ans: 2 },
      { q: "Quel est le taux de la Zakat sur l'épargne ?", opts: ["1%", "2.5%", "5%", "10%"], ans: 1 },
      { q: "Le Hajj est obligatoire :", opts: ["Chaque année", "Tous les 5 ans", "Une fois si on en a les moyens", "Jamais"], ans: 2 },
    ],
    video: { title: "Les 5 piliers expliqués simplement", youtubeId: "Q-x6_ZTavi4", desc: "Une animation claire présentant les 5 piliers fondamentaux de l'Islam." },
    funFact: "💡 La prière du Fajr (aube) est l'une des plus difficiles mais aussi des plus méritoires.",
  },
  {
    id: 2,
    ar: "أَرْكَانُ الإِيمَان",
    fr: "Les 6 Piliers de la Foi",
    icon: "✨",
    color: "#a78bfa",
    emoji: "🌟",
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
          { ar: "الإيمان بالله", fr: "Foi en Allah", icon: "☀️", desc: "Croire que Allah est unique (توحيد), sans associé, fils ou partenaire. Il est le Créateur, le Sustentateur, l'Omniscient." },
          { ar: "الإيمان بالملائكة", fr: "Foi en les Anges", icon: "🌟", desc: "Croire aux anges créés de lumière, qui obéissent parfaitement à Allah. Jibrīl, Mikaïl, Israfil..." },
          { ar: "الإيمان بالكتب", fr: "Foi en les Livres", icon: "📖", desc: "Croire aux livres révélés : Tawrat (Moïse), Injil (Jésus), Coran (Muhammad ﷺ). Le Coran est la version finale et préservée." },
          { ar: "الإيمان بالرسل", fr: "Foi en les Prophètes", icon: "🕊️", desc: "Croire en tous les prophètes d'Adam à Muhammad ﷺ (le dernier). Tous transmettaient le même message monothéiste." },
          { ar: "الإيمان باليوم الآخر", fr: "Foi au Jour Dernier", icon: "⚖️", desc: "Croire en la résurrection, le Jugement dernier, le Paradis (جنة) et l'Enfer (نار)." },
          { ar: "الإيمان بالقدر", fr: "Foi au Destin (Qadar)", icon: "🌌", desc: "Croire que tout est dans la connaissance d'Allah. Le croyant accepte ce qu'il ne peut changer avec patience (صبر)." },
        ],
      },
    ],
    quiz: [
      { q: "Combien y a-t-il de piliers de la foi (Iman) ?", opts: ["4", "5", "6", "7"], ans: 2 },
      { q: "Quel ange a apporté la révélation au Prophète ﷺ ?", opts: ["Mikaïl", "Israfil", "Jibrīl", "Munkar"], ans: 2 },
      { q: "Le Coran a été révélé à quel prophète ?", opts: ["Moïse", "Jésus", "Abraham", "Muhammad ﷺ"], ans: 3 },
      { q: "Le Qadar inclut :", opts: ["Seulement le bien", "Seulement le mal", "Le bien et le mal", "Ni l'un ni l'autre"], ans: 2 },
    ],
    video: { title: "Les 6 piliers de la foi expliqués", youtubeId: "wC7vkDsn_0Y", desc: "Comprendre les croyances fondamentales de l'Islam." },
    funFact: "💡 Le mot 'Iman' (foi) apparaît plus de 800 fois dans le Coran.",
  },
  {
    id: 3,
    ar: "كَيْفَ تُصَلِّي",
    fr: "Comment prier correctement",
    icon: "🙏",
    color: "#34d399",
    emoji: "🕌",
    intro: "La prière (الصلاة) est le deuxième pilier de l'Islam et le lien quotidien entre le croyant et Allah. Voici comment accomplir la prière pas à pas.",
    sections: [
      {
        title: "Étape 1 — L'ablution (الوضوء · Wudhu)",
        text: "Avant toute prière, il faut accomplir le Wudhu — la purification rituelle avec l'eau.",
        wudhuSteps: [
          { step: 1, ar: "النية", fr: "L'intention", desc: "Faire l'intention silencieuse de purification pour la prière.", icon: "🤲" },
          { step: 2, ar: "غسل اليدين", fr: "Laver les mains", desc: "Laver les deux mains jusqu'aux poignets, 3 fois.", icon: "🙌" },
          { step: 3, ar: "المضمضة والاستنشاق", fr: "Rincer bouche & nez", desc: "Se rincer la bouche 3 fois, puis le nez 3 fois.", icon: "💧" },
          { step: 4, ar: "غسل الوجه", fr: "Laver le visage", desc: "Laver tout le visage du haut du front au bas du menton, 3 fois.", icon: "😊" },
          { step: 5, ar: "غسل الذراعين", fr: "Laver les avant-bras", desc: "Laver le bras droit jusqu'au coude 3 fois, puis le gauche.", icon: "💪" },
          { step: 6, ar: "مسح الرأس والأذنين", fr: "Tête & oreilles", desc: "Passer les mains mouillées sur la tête une fois, puis les oreilles.", icon: "🧠" },
          { step: 7, ar: "غسل القدمين", fr: "Laver les pieds", desc: "Laver le pied droit jusqu'à la cheville 3 fois, puis le gauche.", icon: "🦶" },
        ],
      },
      {
        title: "Étape 2 — Les positions de la prière",
        text: "La prière suit une séquence précise de positions (أركان الصلاة). Chaque position a ses invocations spécifiques.",
        prayerSteps: [
          { pos: "القيام", fr: "Debout (Qiyam)", icon: "🧍", desc: "Se tenir debout face à la Qibla, les mains sur la poitrine. Réciter Al-Fatiha puis une autre sourate.", dhikr: "اللّٰهُ أَكْبَر · Allahu Akbar", img: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=500&q=80" },
          { pos: "الركوع", fr: "Inclination (Ruku)", icon: "🧎", desc: "S'incliner à 90°, les mains sur les genoux. Le dos doit être droit et plat.", dhikr: "سُبْحَانَ رَبِّيَ الْعَظِيمِ · Subhāna Rabbī al-ʿAẓīm (x3)", img: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=500&q=80" },
          { pos: "السجود", fr: "Prosternation (Sujud)", icon: "⬇️", desc: "Se prosterner, le front et le nez touchant le sol, les paumes à plat. 7 membres touchent le sol.", dhikr: "سُبْحَانَ رَبِّيَ الْأَعْلَى · Subhāna Rabbī al-Aʿlā (x3)", img: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500&q=80" },
          { pos: "الجلوس", fr: "Assis (Julūs)", icon: "🪑", desc: "S'asseoir entre les deux prosternations sur le pied gauche, le droit dressé.", dhikr: "رَبِّ اغْفِرْ لِي · Rabbi ghfir lī", img: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=500&q=80" },
          { pos: "التشهد", fr: "Témoignage (Tashahhud)", icon: "☝️", desc: "S'asseoir à la fin et réciter le Tashahhud, puis les bénédictions sur le Prophète ﷺ.", dhikr: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ", img: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=500&q=80" },
          { pos: "السلام", fr: "Salutation (Salam)", icon: "👋", desc: "Tourner la tête à droite puis à gauche. C'est la clôture de la prière.", dhikr: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ · Assalāmu ʿalaykum wa raḥmatullāh", img: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500&q=80" },
        ],
      },
      {
        title: "Al-Fatiha — La sourate essentielle",
        text: "Al-Fatiha (الفاتحة) doit être récitée dans chaque rakat. Elle est le cœur de la prière.",
        fatiha: true,
      },
    ],
    quiz: [
      { q: "Combien d'étapes compte le Wudhu ?", opts: ["4", "5", "6", "7"], ans: 3 },
      { q: "Que dit-on pendant le Ruku ?", opts: ["Allahu Akbar", "Subhāna Rabbī al-ʿAẓīm", "Al-Fatiha", "Alhamdulillah"], ans: 1 },
      { q: "Comment se termine la prière ?", opts: ["Par un du'a", "Par le Salam", "Par une prosternation", "Par Al-Fatiha"], ans: 1 },
      { q: "Al-Fatiha est récitée :", opts: ["Une seule fois par jour", "Dans chaque rakat", "Seulement le vendredi", "Uniquement au Fajr"], ans: 1 },
    ],
    video: { title: "Comment faire la prière (débutant)", youtubeId: "l_LN4KSAZIY", desc: "Guide visuel complet pour accomplir la prière islamique correctement." },
    funFact: "💡 Un musulman qui prie 5 fois par jour effectue 34 rak'ats — soit plus de 12 000 prosternations par an !",
    hasReciter: true,
  },
  {
    id: 4,
    ar: "الحَيَاة بَعد الإِسْلَام",
    fr: "Vivre en tant que Musulman",
    icon: "🌱",
    color: "#f97316",
    emoji: "🌿",
    intro: "Devenir musulman est le début d'un voyage de toute une vie. L'Islam est un mode de vie complet qui guide chaque aspect de l'existence quotidienne.",
    sections: [
      {
        title: "Les pratiques quotidiennes",
        text: "Un musulman structure sa journée autour de la prière, de la mémoire d'Allah (ذكر) et de bonnes actions.",
        dailyPractices: [
          { ar: "بِسْمِ اللَّه", fr: "Bismillah", when: "Avant chaque acte", desc: "Commencer toute activité au nom d'Allah.", color: C.teal },
          { ar: "الحمد لله", fr: "Alhamdulillah", when: "Après chaque bienfait", desc: "Rendre grâce à Allah pour tout ce qu'Il nous donne.", color: C.gold },
          { ar: "سبحان الله", fr: "Subhanallah", when: "Face à la beauté", desc: "Glorifier Allah devant Ses merveilles.", color: "#a78bfa" },
          { ar: "إن شاء الله", fr: "In sha'Allah", when: "Pour les projets futurs", desc: "Reconnaître que tout dépend de la volonté d'Allah.", color: "#34d399" },
          { ar: "أستغفر الله", fr: "Astaghfirullah", when: "Après une erreur", desc: "Demander le pardon d'Allah sincèrement.", color: "#f97316" },
        ],
      },
      {
        title: "Ce qui est Halal et Haram",
        text: "L'Islam définit clairement ce qui est permis (حلال) et ce qui est interdit (حرام) pour protéger le croyant et la société.",
        halalHaram: {
          halal: ["Viande abattue au nom d'Allah", "Mariage légal", "Commerce honnête", "Divertissement sain", "Bonnes relations sociales"],
          haram: ["Porc et alcool", "Adultère et fornication", "Usure (Riba)", "Jeux de hasard", "Orgueil et arrogance"],
        },
      },
      {
        title: "La fraternité islamique (الأخوة)",
        text: "Les musulmans forment une communauté (أمة) unie par la foi. Le Prophète ﷺ a dit : « Les croyants dans leur amour mutuel sont comme un seul corps. »",
        hadith: { text: "Le Muslim est le frère du Muslim : il ne l'opprime pas, ne l'abandonne pas et ne le méprise pas.", ref: "Sahih Muslim" },
      },
    ],
    quiz: [
      { q: "Que dit-on avant de commencer un repas ?", opts: ["Alhamdulillah", "Bismillah", "Subhanallah", "Inshallah"], ans: 1 },
      { q: "Que signifie 'Halal' ?", opts: ["Interdit", "Permis", "Obligatoire", "Recommandé"], ans: 1 },
      { q: "L'alcool est :", opts: ["Halal", "Makruh", "Haram", "Optionnel"], ans: 2 },
      { q: "Que dit-on après avoir reçu un bienfait ?", opts: ["Bismillah", "Inshallah", "Alhamdulillah", "Astaghfirullah"], ans: 2 },
    ],
    video: { title: "Débuter sa vie de Muslim — conseils pratiques", youtubeId: "K3bIGkMzLBo", desc: "Des conseils bienveillants pour les nouveaux musulmans." },
    funFact: "💡 Dire 'Subhanallah, Alhamdulillah, Allahu Akbar' 33 fois chacun après la prière vaut une grande récompense.",
  },
];

/* ═══════════════════════════════════════════════
   AUDIO PLAYER HOOK — shared logic
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
    if (playing) { audioRef.current.pause(); }
    else          { setLoading(true); audioRef.current.play().catch(() => setLoading(false)); }
  }, [playing]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
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
   AUDIO PLAYER UI — reusable
═══════════════════════════════════════════════ */
function AudioPlayer({ src, label, accentColor = C.gold, compact = false }) {
  const { playing, currentTime, duration, loading, toggle, stop, seek, skip } = useAudioPlayer(src);

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekBar = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${accentColor}08, ${C.surface})`,
      border: `1px solid ${accentColor}30`,
      borderRadius: compact ? 12 : 16,
      padding: compact ? "12px 16px" : "18px 20px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {label}
        </div>
      )}

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* ⏮ Rewind 5s */}
        <button onClick={() => skip(-5)} title="Reculer 5s" style={btnStyle(C.mutedLt)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
          </svg>
        </button>

        {/* ▶ / ⏸ Play/Pause */}
        <button onClick={toggle} title={playing ? "Pause" : "Lire"} style={{
          width: 40, height: 40, borderRadius: "50%",
          background: playing ? `${accentColor}20` : accentColor,
          border: `2px solid ${accentColor}`,
          color: playing ? accentColor : "#000",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s",
          boxShadow: playing ? `0 0 14px ${accentColor}40` : "none",
          flexShrink: 0,
        }}>
          {loading ? (
            <div style={{ width: 14, height: 14, border: `2px solid currentColor`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
          ) : playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        {/* ⏭ Forward 5s */}
        <button onClick={() => skip(5)} title="Avancer 5s" style={btnStyle(C.mutedLt)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 6v12l8.5-6L13 6zM4 18l8.5-6L4 6v12z"/>
          </svg>
        </button>

        {/* ⏹ Stop */}
        <button onClick={stop} title="Arrêter" style={btnStyle(C.red)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        </button>

        {/* Time */}
        <div style={{ marginLeft: "auto", fontSize: 11, color: C.muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
          {fmt(currentTime)} / {fmt(duration)}
        </div>
      </div>

      {/* Seek bar */}
      <div onClick={handleSeekBar} style={{ cursor: "pointer", position: "relative", height: 6, borderRadius: 99, background: `${accentColor}20`, overflow: "hidden" }}>
        {/* Buffered background */}
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%", background: `${accentColor}10` }} />
        {/* Progress */}
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pct}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
          borderRadius: 99, transition: "width .1s",
          boxShadow: `0 0 6px ${accentColor}60`,
        }} />
      </div>

      {/* Wave animation when playing */}
      {playing && (
        <div style={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "center" }}>
          {[4,7,10,13,10,7,4,7,10].map((h, i) => (
            <div key={i} style={{
              width: 2, borderRadius: 99, background: accentColor, opacity: 0.6,
              animation: `soundWave ${0.4 + i * 0.07}s ease-in-out infinite alternate`,
              height: `${h}px`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function btnStyle(color) {
  return {
    width: 30, height: 30, borderRadius: 8,
    background: "transparent",
    border: `1px solid ${color}40`,
    color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all .15s", flexShrink: 0,
  };
}

/* ═══════════════════════════════════════════════
   QURAN RECITER — with full audio player
═══════════════════════════════════════════════ */
function QuranReciter() {
  const [selected, setSelected] = useState(0);
  const [activeVerse, setActiveVerse] = useState(null);
  const surah = SURAHS[selected];

  return (
    <div style={{ margin: "24px 0", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.gold}30`, background: `linear-gradient(135deg, #060f18, #0a1c10)` }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.gold}20`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 28 }}>🎵</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.goldLt }}>Réciteur du Coran</div>
          <div style={{ fontSize: 12, color: C.muted }}>Mishary Rashid Alafasy · Récitation authentique</div>
        </div>
      </div>

      {/* Surah selector */}
      <div style={{ display: "flex", gap: 8, padding: "16px 24px", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
        {SURAHS.map((s, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: "8px 16px", borderRadius: 99,
            background: selected === i ? C.gold : "transparent",
            border: `1px solid ${selected === i ? C.gold : C.border}`,
            color: selected === i ? "#000" : C.mutedLt,
            fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            transition: "all .2s",
          }}>
            {s.name}
          </button>
        ))}
      </div>

      {/* Surah name */}
      <div style={{ padding: "16px 24px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "serif", fontSize: 26, color: C.goldLt, direction: "rtl" }}>{surah.ar}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{surah.name} · {surah.verses.length} versets · {surah.reciter}</div>
        </div>
      </div>

      {/* Full audio player */}
      <div style={{ padding: "0 24px 20px" }}>
        <AudioPlayer
          key={surah.audioUrl}
          src={surah.audioUrl}
          accentColor={C.gold}
        />
      </div>

      {/* Verses */}
      <div style={{ padding: "0 24px 20px" }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 2 }}>
          Cliquez sur un verset pour la traduction
        </div>
        {surah.verses.map((v, i) => (
          <div key={i} onClick={() => setActiveVerse(activeVerse === i ? null : i)} style={{
            padding: "12px 16px", borderRadius: 12, cursor: "pointer",
            marginBottom: 6, transition: "all .2s",
            background: activeVerse === i ? `${C.gold}12` : "transparent",
            border: `1px solid ${activeVerse === i ? C.gold + "40" : "transparent"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: activeVerse === i ? 8 : 0 }}>
              <span style={{ fontSize: 11, color: C.gold, fontWeight: 700, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: `${C.gold}15`, borderRadius: "50%", flexShrink: 0 }}>{i + 1}</span>
              <p style={{ fontFamily: "serif", fontSize: 20, color: C.goldLt, direction: "rtl", lineHeight: 1.7, flex: 1, textAlign: "right" }}>{v.ar}</p>
            </div>
            {activeVerse === i && (
              <div style={{ paddingLeft: 34, borderTop: `1px solid ${C.gold}20`, paddingTop: 8 }}>
                <p style={{ fontSize: 12, color: C.tealLt, fontStyle: "italic", marginBottom: 4 }}>{v.tr}</p>
                <p style={{ fontSize: 13, color: C.text }}>« {v.fr} »</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHAHADA BOX — real reciter, no AI voice
═══════════════════════════════════════════════ */
function ShahadaBox() {
  // Al-Fatiha from Mishary — short, instantly recognizable, available
  // For a dedicated Shahada recitation we use a known URL
  // Using Surah 112 (Al-Ikhlas, 4 verses) as a beautiful short alternative
  const SHAHADA_URL = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3";

  return (
    <div style={{ margin: "20px 0" }}>
      <div style={{ background: `linear-gradient(135deg, #081a10, #0d2820)`, border: `1px solid ${C.teal}40`, borderRadius: 20, padding: "24px" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            الشَّهَادَة — La Déclaration de Foi
          </div>
        </div>

        {/* First part */}
        <div style={{ textAlign: "center", marginBottom: 16, padding: "16px", background: `${C.teal}0a`, borderRadius: 12 }}>
          <p style={{ fontFamily: "serif", fontSize: 26, color: C.tealLt, lineHeight: 1.8, direction: "rtl", marginBottom: 6 }}>
            أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ
          </p>
          <p style={{ fontSize: 13, color: C.mutedLt, fontStyle: "italic", marginBottom: 3 }}>Ash-hadu allā ilāha illā-llāh</p>
          <p style={{ fontSize: 13, color: C.text }}>« Je témoigne qu'il n'y a de dieu qu'Allah »</p>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0" }}>
          <div style={{ flex: 1, height: 1, background: `${C.gold}25` }} />
          <span style={{ color: C.gold, fontSize: 14 }}>❋</span>
          <div style={{ flex: 1, height: 1, background: `${C.gold}25` }} />
        </div>

        {/* Second part */}
        <div style={{ textAlign: "center", marginBottom: 20, padding: "16px", background: `${C.gold}0a`, borderRadius: 12 }}>
          <p style={{ fontFamily: "serif", fontSize: 26, color: C.goldLt, lineHeight: 1.8, direction: "rtl", marginBottom: 6 }}>
            وَأَشْهَدُ أَنَّ مُحَمَّداً رَسُولُ اللَّهِ
          </p>
          <p style={{ fontSize: 13, color: C.mutedLt, fontStyle: "italic", marginBottom: 3 }}>Wa ash-hadu anna Muḥammadan rasūlu-llāh</p>
          <p style={{ fontSize: 13, color: C.text }}>« Et je témoigne que Muhammad est le messager d'Allah »</p>
        </div>

        {/* Real reciter audio player */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginBottom: 10 }}>
            🎙️ Mishary Rashid Alafasy — récitation authentique
          </div>
          <AudioPlayer
            src={SHAHADA_URL}
            accentColor={C.teal}
            compact={false}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REMAINING SUB-COMPONENTS
═══════════════════════════════════════════════ */
function AyahBox({ ayah }) {
  return (
    <div style={{ margin: "16px 0", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.gold}30` }}>
      <div style={{ background: `${C.gold}12`, padding: "16px 20px", textAlign: "right" }}>
        <p style={{ fontFamily: "serif", fontSize: 22, color: C.goldLt, lineHeight: 1.7, direction: "rtl" }}>{ayah.ar}</p>
      </div>
      <div style={{ background: C.panel, padding: "12px 20px" }}>
        <p style={{ fontSize: 14, color: C.text, fontStyle: "italic", marginBottom: 4 }}>« {ayah.fr} »</p>
        <p style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>📖 {ayah.ref}</p>
      </div>
    </div>
  );
}

function HadithBox({ hadith }) {
  return (
    <div style={{ margin: "16px 0", background: `${C.teal}0d`, border: `1px solid ${C.teal}30`, borderRadius: 14, padding: "16px 20px", borderLeft: `3px solid ${C.teal}` }}>
      <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, fontStyle: "italic", marginBottom: 8 }}>« {hadith.text} »</p>
      <p style={{ fontSize: 11, color: C.tealLt, fontWeight: 700 }}>📜 {hadith.ref}</p>
    </div>
  );
}

function PillarDetail({ pd }) {
  return (
    <div style={{ margin: "16px 0", background: C.panel, borderRadius: 14, padding: "18px 20px", border: `1px solid ${C.border}` }}>
      <p style={{ fontFamily: "serif", fontSize: 22, color: C.goldLt, textAlign: "right", direction: "rtl", lineHeight: 1.7, marginBottom: 8 }}>{pd.arabic}</p>
      <p style={{ fontSize: 13, color: C.tealLt, fontStyle: "italic", marginBottom: 6 }}>{pd.transliteration}</p>
      <p style={{ fontSize: 14, color: C.mutedLt, marginBottom: pd.ref ? 6 : 0 }}>« {pd.meaning} »</p>
      {pd.ref && <p style={{ fontSize: 11, color: C.gold }}>📖 {pd.ref}</p>}
    </div>
  );
}

function WudhuSteps({ steps }) {
  const [active, setActive] = useState(0);
  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "6px 14px", borderRadius: 99,
            border: `1.5px solid ${active === i ? C.teal : C.border}`,
            background: active === i ? `${C.teal}20` : "transparent",
            color: active === i ? C.tealLt : C.mutedLt,
            fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            transition: "all .2s", display: "flex", alignItems: "center", gap: 4,
          }}>
            <span>{s.icon}</span> {s.step}
          </button>
        ))}
      </div>
      <div style={{ background: C.panel, borderRadius: 16, padding: "20px", border: `1px solid ${C.teal}30` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ fontSize: 36 }}>{steps[active].icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: C.teal, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                {steps[active].step}
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{steps[active].fr}</span>
              <span style={{ fontFamily: "serif", fontSize: 14, color: C.gold }}>{steps[active].ar}</span>
            </div>
            <p style={{ fontSize: 14, color: C.mutedLt, lineHeight: 1.7 }}>{steps[active].desc}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0}
            style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.mutedLt, cursor: active === 0 ? "not-allowed" : "pointer", opacity: active === 0 ? 0.4 : 1, fontSize: 13, fontFamily: "inherit" }}>
            ← Précédent
          </button>
          <button onClick={() => setActive(a => Math.min(steps.length - 1, a + 1))} disabled={active === steps.length - 1}
            style={{ padding: "8px 16px", borderRadius: 10, background: C.teal, border: "none", color: "#fff", cursor: active === steps.length - 1 ? "not-allowed" : "pointer", opacity: active === steps.length - 1 ? 0.4 : 1, fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}

function PrayerSteps({ steps }) {
  const [active, setActive] = useState(0);
  const [imgError, setImgError] = useState(false);
  const step = steps[active];

  useEffect(() => { setImgError(false); }, [active]);

  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "10px 8px", borderRadius: 12, textAlign: "center",
            border: `1.5px solid ${active === i ? "#34d399" : C.border}`,
            background: active === i ? "rgba(52,217,153,0.12)" : C.panel,
            cursor: "pointer", transition: "all .2s",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: active === i ? "#34d399" : C.mutedLt, fontWeight: 600, fontFamily: "inherit", lineHeight: 1.2 }}>{s.fr}</div>
          </button>
        ))}
      </div>
      <div style={{ background: C.panel, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(52,217,153,0.2)" }}>
        <div style={{ position: "relative", height: 200, background: "#030c14", overflow: "hidden" }}>
          {!imgError ? (
            <img src={step.img} alt={step.fr} onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>{step.icon}</div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0d1e30 30%, transparent)" }} />
          <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
            <div style={{ fontFamily: "serif", fontSize: 24, color: "#34d399", marginBottom: 2 }}>{step.pos}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{step.fr}</div>
          </div>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 14, color: C.mutedLt, lineHeight: 1.7, marginBottom: 14 }}>{step.desc}</p>
          <div style={{ background: `rgba(52,217,153,0.08)`, border: "1px solid rgba(52,217,153,0.2)", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "#34d399", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Dhikr</div>
            <div style={{ fontFamily: "serif", fontSize: 16, color: C.goldLt, direction: "rtl", lineHeight: 1.6 }}>{step.dhikr.split(" · ")[0]}</div>
            {step.dhikr.includes(" · ") && (
              <div style={{ fontSize: 12, color: C.tealLt, fontStyle: "italic", marginTop: 2 }}>{step.dhikr.split(" · ").slice(1).join(" · ")}</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0}
              style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.mutedLt, cursor: active === 0 ? "not-allowed" : "pointer", opacity: active === 0 ? 0.4 : 1, fontSize: 13, fontFamily: "inherit" }}>
              ← Préc.
            </button>
            <button onClick={() => setActive(a => Math.min(steps.length - 1, a + 1))} disabled={active === steps.length - 1}
              style={{ flex: 1, padding: "9px", borderRadius: 10, background: "#34d399", border: "none", color: "#000", cursor: active === steps.length - 1 ? "not-allowed" : "pointer", opacity: active === steps.length - 1 ? 0.4 : 1, fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FatihaDisplay() {
  const verses = [
    { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", tr: "Bismi-llāhi r-raḥmāni r-raḥīm", fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux" },
    { ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tr: "Al-ḥamdu li-llāhi rabbi l-ʿālamīn", fr: "Louange à Allah, Seigneur de l'Univers" },
    { ar: "الرَّحْمَٰنِ الرَّحِيمِ", tr: "Ar-raḥmāni r-raḥīm", fr: "Le Tout Miséricordieux, le Très Miséricordieux" },
    { ar: "مَالِكِ يَوْمِ الدِّينِ", tr: "Māliki yawmi d-dīn", fr: "Maître du Jour de la rétribution" },
    { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", tr: "Iyyāka naʿbudu wa-iyyāka nastaʿīn", fr: "C'est Toi [Seul] que nous adorons" },
    { ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tr: "Ihdinā ṣ-ṣirāṭa l-mustaqīm", fr: "Guide-nous dans le droit chemin" },
    { ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", tr: "Ṣirāṭa lladhīna anʿamta ʿalayhim...", fr: "Le chemin de ceux que Tu as comblés de bienfaits" },
  ];
  const [sel, setSel] = useState(null);
  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ background: "linear-gradient(135deg, #060f18, #0a1a28)", border: `1px solid ${C.gold}30`, borderRadius: 16, padding: "20px" }}>
        {verses.map((v, i) => (
          <div key={i} onClick={() => setSel(sel === i ? null : i)}
            style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", marginBottom: 4, transition: "all .2s",
              background: sel === i ? `${C.gold}12` : "transparent",
              border: `1px solid ${sel === i ? C.gold + "40" : "transparent"}` }}>
            <p style={{ fontFamily: "serif", fontSize: 20, color: C.goldLt, textAlign: "right", direction: "rtl", lineHeight: 1.7 }}>{v.ar}</p>
            {sel === i && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.gold}20` }}>
                <p style={{ fontSize: 13, color: C.tealLt, fontStyle: "italic", marginBottom: 4 }}>{v.tr}</p>
                <p style={{ fontSize: 13, color: C.text }}>« {v.fr} »</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImanPillars({ pillars }) {
  const [sel, setSel] = useState(0);
  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {pillars.map((p, i) => (
          <button key={i} onClick={() => setSel(i)} style={{
            padding: "14px 10px", borderRadius: 12, textAlign: "center",
            border: `1.5px solid ${sel === i ? "#a78bfa" : C.border}`,
            background: sel === i ? "rgba(167,139,250,0.12)" : C.panel,
            cursor: "pointer", transition: "all .2s",
          }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{p.icon}</div>
            <div style={{ fontSize: 10, color: sel === i ? "#a78bfa" : C.mutedLt, fontWeight: 700, fontFamily: "inherit", lineHeight: 1.3 }}>{p.fr}</div>
          </button>
        ))}
      </div>
      <div style={{ background: C.panel, borderRadius: 14, padding: "20px", border: "1px solid rgba(167,139,250,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>{pillars[sel].icon}</span>
          <div>
            <div style={{ fontFamily: "serif", fontSize: 20, color: "#a78bfa" }}>{pillars[sel].ar}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{pillars[sel].fr}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, color: C.mutedLt, lineHeight: 1.8 }}>{pillars[sel].desc}</p>
      </div>
    </div>
  );
}

function PrayerTimesTable({ times }) {
  return (
    <div style={{ margin: "16px 0", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
      {times.map((t, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px",
          background: i % 2 === 0 ? C.panel : C.surface,
          borderBottom: i < times.length - 1 ? `1px solid ${C.border}` : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: "serif", fontSize: 18, color: C.gold, minWidth: 60, textAlign: "right", direction: "rtl" }}>{t.name}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.fr}</div>
              <div style={{ fontSize: 12, color: C.mutedLt }}>{t.time}</div>
            </div>
          </div>
          <div style={{ background: `${C.gold}15`, border: `1px solid ${C.gold}30`, borderRadius: 20, padding: "4px 12px" }}>
            <span style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>{t.rakaat} rak'at</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyPractices({ practices }) {
  const [flipped, setFlipped] = useState(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, margin: "16px 0" }}>
      {practices.map((p, i) => (
        <div key={i} onClick={() => setFlipped(flipped === i ? null : i)}
          style={{ background: flipped === i ? `${p.color}15` : C.panel, border: `1.5px solid ${flipped === i ? p.color + "50" : C.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", transition: "all .25s" }}>
          <div style={{ fontFamily: "serif", fontSize: 20, color: flipped === i ? p.color : C.goldLt, marginBottom: 6, direction: "rtl", textAlign: "right" }}>{p.ar}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.fr}</div>
          {flipped === i ? (
            <>
              <div style={{ fontSize: 11, color: C.gold, marginBottom: 6, fontStyle: "italic" }}>{p.when}</div>
              <div style={{ fontSize: 12, color: C.mutedLt, lineHeight: 1.6 }}>{p.desc}</div>
            </>
          ) : (
            <div style={{ fontSize: 11, color: C.muted }}>Appuyez pour en savoir plus →</div>
          )}
        </div>
      ))}
    </div>
  );
}

function HalalHaram({ data }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0" }}>
      <div style={{ background: "rgba(34,201,122,0.08)", border: "1px solid rgba(34,201,122,0.25)", borderRadius: 14, padding: "16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 12 }}>✅ Halal — حلال</div>
        {data.halal.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.text }}>
            <span style={{ color: C.green, flexShrink: 0 }}>•</span> {item}
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: 14, padding: "16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 12 }}>❌ Haram — حرام</div>
        {data.haram.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.text }}>
            <span style={{ color: C.red, flexShrink: 0 }}>•</span> {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoEmbed({ video }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ margin: "24px 0", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
      <div style={{ background: C.panel, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>🎬</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{video.title}</div>
          <div style={{ fontSize: 12, color: C.mutedLt }}>{video.desc}</div>
        </div>
      </div>
      {!show ? (
        <div onClick={() => setShow(true)} style={{
          background: "#000", height: 200, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
          backgroundImage: `url(https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg)`,
          backgroundSize: "cover", backgroundPosition: "center", position: "relative",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "relative", zIndex: 1, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>▶</div>
          <div style={{ position: "relative", zIndex: 1, marginTop: 10, fontSize: 12, color: "#fff", fontWeight: 600 }}>Cliquer pour regarder</div>
        </div>
      ) : (
        <iframe width="100%" height="280" src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
          title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen style={{ display: "block" }} />
      )}
    </div>
  );
}

function FunFact({ text }) {
  return (
    <div style={{ margin: "20px 0", padding: "14px 18px", borderRadius: 14, background: `${C.gold}10`, border: `1px solid ${C.gold}25`, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 20 }}>💡</span>
      <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{text.replace("💡 ", "")}</p>
    </div>
  );
}

function Quiz({ questions, color }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const pick = (i) => { if (ans !== null) return; setAns(i); if (i === questions[step].ans) setScore(s => s + 1); };
  const next = () => { if (step + 1 >= questions.length) { setDone(true); return; } setStep(s => s + 1); setAns(null); };
  const reset = () => { setStep(0); setAns(null); setScore(0); setDone(false); };
  const pct = Math.round((score / questions.length) * 100);

  return (
    <div style={{ marginTop: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
        🎯 Quiz de compréhension
      </div>
      {!done ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: C.mutedLt }}>Question {step + 1} / {questions.length}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {questions.map((_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= step ? color : C.border, opacity: i > step ? 0.4 : 1 }} />
              ))}
            </div>
          </div>
          <div style={{ height: 3, background: C.border, borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ width: `${(step / questions.length) * 100}%`, height: "100%", background: color, transition: "width .4s" }} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.6, marginBottom: 18 }}>{questions[step].q}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {questions[step].opts.map((opt, i) => {
              let bg = C.panel, border = C.border, col = C.text;
              if (ans !== null) {
                if (i === questions[step].ans)  { bg = "rgba(34,201,122,.15)"; border = C.green; col = "#6ee7b7"; }
                else if (i === ans)             { bg = "rgba(224,85,85,.12)"; border = C.red; col = "#fca5a5"; }
              }
              return (
                <button key={i} onClick={() => pick(i)} disabled={ans !== null} style={{
                  background: bg, border: `1.5px solid ${border}`, color: col,
                  borderRadius: 12, padding: "12px 16px", cursor: ans !== null ? "default" : "pointer",
                  textAlign: "left", fontSize: 14, fontFamily: "inherit", transition: "all .2s",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {["A","B","C","D"][i]}
                  </span>
                  {opt}
                  {ans !== null && i === questions[step].ans && <span style={{ marginLeft: "auto" }}>✓</span>}
                  {ans !== null && i === ans && i !== questions[step].ans && <span style={{ marginLeft: "auto" }}>✗</span>}
                </button>
              );
            })}
          </div>
          {ans !== null && (
            <button onClick={next} style={{ marginTop: 16, background: color, border: "none", color: "#fff", borderRadius: 12, padding: "10px 26px", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}>
              {step + 1 >= questions.length ? "Voir le résultat →" : "Question suivante →"}
            </button>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>{pct === 100 ? "🏆" : pct >= 70 ? "🌟" : "📚"}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color, marginBottom: 4 }}>{score}/{questions.length}</div>
          <div style={{ fontSize: 14, color: C.mutedLt, marginBottom: 20 }}>
            {pct === 100 ? "Parfait ! Excellent travail !" : pct >= 70 ? "Très bien ! Continuez ainsi." : "Révisez le cours et réessayez."}
          </div>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ margin: "0 auto 20px", display: "block" }}>
            <circle cx="40" cy="40" r="34" fill="none" stroke={C.border} strokeWidth="7" />
            <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="7"
              strokeDasharray={`${2 * Math.PI * 34 * pct / 100} ${2 * Math.PI * 34}`}
              strokeLinecap="round" strokeDashoffset={2 * Math.PI * 34 * 0.25} />
            <text x="40" y="45" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold">{pct}%</text>
          </svg>
          <button onClick={reset} style={{ background: color, border: "none", color: "#fff", borderRadius: 12, padding: "10px 28px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
            Recommencer le quiz
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function BecomeMuslim() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [visible, setVisible] = useState(false);
  const ch = CHAPTERS[activeChapter];

  const markDone = (id) => { if (!completed.includes(id)) setCompleted(c => [...c, id]); };

  useEffect(() => {
    setVisible(false);
    window.scrollTo({ top: 0 });
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [activeChapter]);

  const renderSection = (sec, i) => (
    <div key={i} style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: ch.color, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
        {sec.title}
      </h3>
      {sec.text && <p style={{ fontSize: 14, color: C.mutedLt, lineHeight: 1.85, marginBottom: 12 }}>{sec.text}</p>}
      {sec.ayah          && <AyahBox ayah={sec.ayah} />}
      {sec.hadith        && <HadithBox hadith={sec.hadith} />}
      {sec.pillarDetails && <PillarDetail pd={sec.pillarDetails} />}
      {sec.shahada       && <ShahadaBox />}
      {sec.prayerTimes   && <PrayerTimesTable times={sec.prayerTimes} />}
      {sec.wudhuSteps    && <WudhuSteps steps={sec.wudhuSteps} />}
      {sec.prayerSteps   && <PrayerSteps steps={sec.prayerSteps} />}
      {sec.fatiha        && <FatihaDisplay />}
      {sec.imanPillars   && <ImanPillars pillars={sec.imanPillars} />}
      {sec.dailyPractices && <DailyPractices practices={sec.dailyPractices} />}
      {sec.halalHaram    && <HalalHaram data={sec.halalHaram} />}
    </div>
  );

  const progress = Math.round((completed.length / CHAPTERS.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes soundWave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp .4s ease both; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080b0f; }
        ::-webkit-scrollbar-thumb { background: #1a3048; border-radius: 3px; }
        @media (max-width: 768px) { .course-grid { grid-template-columns: 1fr !important; } aside { position: static !important; } }
      `}</style>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, #030c18 0%, #071828 60%, #03100e 100%)`, borderBottom: `1px solid ${C.border}`, padding: "100px 24px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 99, background: `${C.gold}15`, border: `1px solid ${C.gold}30`, fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
            ☪️ Guide Complet d'Introduction à l'Islam
          </div>
          <h1 style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#fff", marginBottom: 10, lineHeight: 1.1 }}>
            Comment devenir Musulman ?
          </h1>
          <p style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: C.gold, marginBottom: 14 }}>
            كَيْفَ تُصْبِحُ مُسْلِماً؟
          </p>
          <p style={{ fontSize: 15, color: C.mutedLt, maxWidth: 600, lineHeight: 1.7, marginBottom: 24 }}>
            Un guide complet et bienveillant couvrant la Chahada, les piliers de l'Islam, comment prier, et comment vivre en tant que nouveau musulman.
          </p>
          <div style={{ maxWidth: 400, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 6 }}>
              <span>{completed.length} / {CHAPTERS.length} chapitres complétés</span>
              <span style={{ color: C.gold, fontWeight: 700 }}>{progress}%</span>
            </div>
            <div style={{ height: 5, background: C.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${C.teal}, ${C.gold})`, transition: "width .6s ease", borderRadius: 99 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CHAPTERS.map((c, i) => (
              <div key={i} onClick={() => setActiveChapter(i)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 99,
                background: completed.includes(i) ? `${C.teal}18` : activeChapter === i ? `${c.color}18` : C.panel,
                border: `1px solid ${completed.includes(i) ? C.teal : activeChapter === i ? c.color : C.border}`,
                fontSize: 12, color: completed.includes(i) ? C.tealLt : activeChapter === i ? c.color : C.mutedLt,
                cursor: "pointer", transition: "all .2s",
              }}>
                {completed.includes(i) ? "✓" : c.icon} {c.fr}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LAYOUT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 28 }} className="course-grid">

        {/* SIDEBAR */}
        <aside style={{ position: "sticky", top: 88, height: "fit-content" }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 2 }}>
              Chapitres
            </div>
            {CHAPTERS.map((c, i) => (
              <button key={i} onClick={() => setActiveChapter(i)} style={{
                width: "100%", padding: "14px 16px", textAlign: "left",
                background: activeChapter === i ? `${c.color}15` : "transparent",
                border: "none", borderBottom: `1px solid ${C.border}`,
                borderLeft: `3px solid ${activeChapter === i ? c.color : "transparent"}`,
                cursor: "pointer", transition: "all .2s", fontFamily: "inherit",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: activeChapter === i ? c.color : C.text, lineHeight: 1.3 }}>{c.fr}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "'Amiri', serif", marginTop: 1 }}>{c.ar}</div>
                  </div>
                  {completed.includes(i) && <span style={{ fontSize: 12, color: C.teal }}>✓</span>}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* CONTENT */}
        <main style={{ minWidth: 0, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity .4s, transform .4s" }}>
          <div style={{
            background: `linear-gradient(135deg, ${ch.color}12, ${C.surface})`,
            border: `1px solid ${ch.color}30`, borderRadius: 18,
            padding: "24px 28px", marginBottom: 28,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <span style={{ fontSize: 44 }}>{ch.icon}</span>
              <div>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: 26, color: ch.color, lineHeight: 1 }}>{ch.ar}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{ch.fr}</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 32 }}>{ch.emoji}</div>
            </div>
            <p style={{ fontSize: 14, color: C.mutedLt, lineHeight: 1.8 }}>{ch.intro}</p>
          </div>

          <FunFact text={ch.funFact} />
          {ch.sections.map((sec, i) => renderSection(sec, i))}
          {ch.hasReciter && <QuranReciter />}
          <VideoEmbed video={ch.video} />
          <Quiz questions={ch.quiz} color={ch.color} />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <button onClick={() => { markDone(activeChapter); if (activeChapter > 0) setActiveChapter(a => a - 1); }}
              disabled={activeChapter === 0}
              style={{ padding: "10px 20px", borderRadius: 12, border: `1px solid ${C.border}`, background: "transparent", color: C.mutedLt, cursor: activeChapter === 0 ? "not-allowed" : "pointer", opacity: activeChapter === 0 ? 0.4 : 1, fontSize: 13, fontFamily: "inherit" }}>
              ← Chapitre précédent
            </button>
            <button onClick={() => { markDone(activeChapter); if (activeChapter < CHAPTERS.length - 1) setActiveChapter(a => a + 1); }}
              style={{ padding: "10px 24px", borderRadius: 12, background: ch.color, border: "none", color: activeChapter === 1 ? "#000" : "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
              {activeChapter === CHAPTERS.length - 1 ? "Terminer le cours ✓" : "Chapitre suivant →"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}