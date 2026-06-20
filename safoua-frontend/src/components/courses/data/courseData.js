// ─── Course content ─────────────────────────────────────────────────────
// 8 modules, sequenced for a learner who knows the Arabic alphabet, short
// vowels, tanwīn, madd, sukūn and shadda — but no grammar terms yet.
// Each lesson pairs a short theory note with one bespoke interactive
// activity designed for that specific concept (not a reused template).

export const MODULES = [
  {
    id: 0, num: "01", title: "اسم أم فعل؟", subtitle: "Nom ou Verbe ?",
    description: "Les deux briques de toute phrase arabe : le nom (اسم) et le verbe (فعل).",
    lessons: [
      {
        id: "1a", title: "Le Nom — اسم", kicker: "Reconnaître un nom",
        theory: "Un nom (اسم) désigne une personne, un lieu, une chose ou une idée. Contrairement au verbe, sa forme ne change pas selon le moment de l'action — un livre reste كِتَابٌ hier, aujourd'hui et demain. Voici quelques noms, mêlés à des verbes que tu reconnaîtras peut-être déjà par leur forme.",
        words: [
          { ar: "كِتَابٌ", tr: "kitābun", trFr: "kitaboun", fr: "un livre" },
          { ar: "قَمَرٌ", tr: "qamarun", trFr: "qamaroun", fr: "une lune" },
          { ar: "بَيْتٌ", tr: "baytun", trFr: "baytoun", fr: "une maison" },
          { ar: "ذَهَبَ", tr: "dhahaba", trFr: "dahaba", fr: "il est allé", root: ["ذ","ه","ب"] },
          { ar: "وَلَدٌ", tr: "waladun", trFr: "waladoun", fr: "un garçon" },
          { ar: "كَتَبَ", tr: "kataba", trFr: "kataba", fr: "il a écrit", root: ["ك","ت","ب"] },
          { ar: "بَحْرٌ", tr: "baḥrun", trFr: "bahroun", fr: "une mer" },
          { ar: "شَمْسٌ", tr: "shamsun", trFr: "chamsoun", fr: "un soleil" },
        ],
        activity: "sort-niches",
      },
      {
        id: "1b", title: "Le Verbe — فعل", kicker: "Reconnaître un verbe",
        theory: "Un verbe (فعل) exprime une action liée à un moment précis. Presque tous les verbes arabes se construisent sur une racine de 3 lettres — la forme du passé simple ressemble toujours à فَعَلَ.",
        words: [
          { ar: "كَتَبَ", tr: "kataba", trFr: "kataba", fr: "il a écrit", root: ["ك","ت","ب"] },
          { ar: "ذَهَبَ", tr: "dhahaba", trFr: "dahaba", fr: "il est allé", root: ["ذ","ه","ب"] },
          { ar: "شَرِبَ", tr: "shariba", trFr: "chariba", fr: "il a bu", root: ["ش","ر","ب"] },
          { ar: "لَعِبَ", tr: "laʿiba", trFr: "la'iba", fr: "il a joué", root: ["ل","ع","ب"] },
          { ar: "فَتَحَ", tr: "fataḥa", trFr: "fataha", fr: "il a ouvert", root: ["ف","ت","ح"] },
        ],
        activity: "root-extractor",
      }
    ],
    quiz: [
      { q: "كِتَابٌ est :", opts: ["Un verbe", "Un nom", "Une lettre", "Un pronom"], ans: 1, exp: "كِتَابٌ (un livre) ne change pas de forme selon le temps — c'est un nom." },
      { q: "Laquelle de ces formes est un verbe au passé ?", opts: ["بَيْتٌ", "كَتَبَ", "قَمَرٌ", "وَلَدٌ"], ans: 1, exp: "كَتَبَ suit le schème فَعَلَ du passé : il a écrit." },
      { q: "Quelle est la racine du verbe ذَهَبَ ?", opts: ["ذ ه ب", "ذ ه", "ه ب ذ", "ذ ب ه"], ans: 0, exp: "La racine garde l'ordre des lettres : ذ-ه-ب (le sens 'aller')." },
      { q: "شَرِبَ signifie :", opts: ["il a écrit", "il a joué", "il a bu", "il est allé"], ans: 2, exp: "شَرِبَ (shariba) = il a bu, racine ش-ر-ب." },
      { q: "Un nom change-t-il de forme selon le temps ?", opts: ["Oui, toujours", "Non, jamais", "Seulement au pluriel", "Seulement au féminin"], ans: 1, exp: "C'est justement ce qui distingue le nom du verbe : sa forme reste stable." },
    ]
  },
  {
    id: 1, num: "02", title: "التنكير والتعريف", subtitle: "Indéfini & Défini",
    description: "Le tanwīn qui dit « un/une », et ال qui dit « le/la » — avec son secret : les lettres solaires et lunaires.",
    lessons: [
      {
        id: "2a", title: "Le Tanwīn — التنوين", kicker: "« un » sans mot pour « un »",
        theory: "L'arabe n'a pas de mot pour « un/une » comme en français. À la place, la voyelle finale double — le tanwīn ـٌ — indique qu'un nom est indéfini. Tu sais déjà la lire ; ici tu apprends ce qu'elle veut dire.",
        pairs: [
          { indef: "نُورٌ", indefTr: "nūrun", indefFr: "nouroun", def: "النُّورُ", defTr: "an-nūru", defFr: "an-nourou", fr: "lumière" },
          { indef: "قَلَمٌ", indefTr: "qalamun", indefFr: "qalamoun", def: "القَلَمُ", defTr: "al-qalamu", defFr: "al-qalamou", fr: "stylo" },
          { indef: "بَابٌ", indefTr: "bābun", indefFr: "baboun", def: "البَابُ", defTr: "al-bābu", defFr: "al-babou", fr: "porte" },
          { indef: "نَجْمٌ", indefTr: "najmun", indefFr: "najmoun", def: "النَّجْمُ", defTr: "an-najmu", defFr: "an-najmou", fr: "étoile" },
        ],
        activity: "tanwin-toggle",
      },
      {
        id: "2b", title: "الحروف الشمسية والقمرية", kicker: "Lettres solaires & lunaires",
        theory: "Quand ال rencontre une lettre « lunaire », le ل se prononce normalement : القَمَرُ. Mais devant une lettre « solaire », le ل devient muet et la lettre suivante double : الشَّمْسُ se prononce ash-shamsu, pas al-shamsu.",
        sun: ["ت","ث","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ل","ن"],
        moon: ["ا","ب","ج","ح","خ","ع","غ","ف","ق","ك","م","ه","و","ي"],
        examples: [
          { ar: "القَمَرُ", tr: "al-qamaru", trFr: "al-qamarou", fr: "la lune", type: "moon" },
          { ar: "الشَّمْسُ", tr: "ash-shamsu", trFr: "ach-chamsou", fr: "le soleil", type: "sun" },
          { ar: "الكِتَابُ", tr: "al-kitābu", trFr: "al-kitabou", fr: "le livre", type: "moon" },
          { ar: "الرَّجُلُ", tr: "ar-rajulu", trFr: "ar-rajoulou", fr: "l'homme", type: "sun" },
          { ar: "البَيْتُ", tr: "al-baytu", trFr: "al-baytou", fr: "la maison", type: "moon" },
          { ar: "الدَّرْسُ", tr: "ad-darsu", trFr: "ad-darsou", fr: "la leçon", type: "sun" },
        ],
        activity: "sun-moon-sort",
      }
    ],
    quiz: [
      { q: "Le tanwīn ـٌ à la fin d'un nom marque :", opts: ["Le défini", "L'indéfini", "Le pluriel", "Le féminin"], ans: 1, exp: "ـٌ (tanwīn) = indéfini, l'équivalent de « un/une »." },
      { q: "Dans القَمَرُ, comment se prononce le ل ?", opts: ["Il est muet", "Il se prononce normalement", "Il devient ر", "Il devient ش"], ans: 1, exp: "ق est une lettre lunaire : le ل de ال se prononce normalement." },
      { q: "الشَّمْسُ se prononce :", opts: ["al-shamsu", "ash-shamsu", "asch-lamsu", "al-chamsu"], ans: 1, exp: "ش est solaire : le ل s'assimile et le ش double → ash-shamsu." },
      { q: "النُّورُ est la version définie de :", opts: ["نَجْمٌ", "نُورٌ", "نَارٌ", "نَهْرٌ"], ans: 1, exp: "نُورٌ (une lumière) → النُّورُ (la lumière) : on ajoute ال et on retire le tanwīn." },
      { q: "ر est une lettre :", opts: ["Lunaire", "Solaire", "Ni l'un ni l'autre", "Les deux"], ans: 1, exp: "ر fait partie des 14 lettres solaires — devant elle, le ل de ال est muet." },
    ]
  },
  {
    id: 2, num: "03", title: "الجملة الاسمية", subtitle: "La phrase sans verbe",
    description: "Dire « X est Y » sans aucun verbe « être ». Le مبتدأ (sujet) et le خبر (ce qu'on en dit).",
    lessons: [
      {
        id: "3a", title: "مبتدأ + خبر", kicker: "La phrase à deux blocs",
        theory: "En arabe, le présent du verbe « être » n'existe pas. On pose simplement le sujet (مبتدأ, presque toujours défini) puis ce qu'on en dit (خبر, presque toujours indéfini) : مُحَمَّدٌ طَالِبٌ — « Muhammad est un étudiant », sans aucun mot pour « est ».",
        examples: [
          { ar: "مُحَمَّدٌ طَالِبٌ", tr: "Muḥammadun ṭālibun", trFr: "Mouhammadoun taliboun", fr: "Muhammad est un étudiant" },
          { ar: "البَيْتُ كَبِيرٌ", tr: "al-baytu kabīrun", trFr: "al-baytou kabiroun", fr: "La maison est grande" },
          { ar: "العِلْمُ نُورٌ", tr: "al-ʿilmu nūrun", trFr: "al-'ilmou nouroun", fr: "Le savoir est une lumière" },
          { ar: "القَلَمُ جَدِيدٌ", tr: "al-qalamu jadīdun", trFr: "al-qalamou jadidoun", fr: "Le stylo est neuf" },
        ],
        activity: "sentence-builder",
      },
      {
        id: "3b", title: "L'ordre des blocs", kicker: "مبتدأ + خبر : le bon ordre",
        theory: "Le مبتدأ vient en premier, le خبر en second. Si l'ordre ou la définitude est inversé — par exemple un sujet indéfini sans raison particulière — la phrase sonne fausse. Apprends à repérer une phrase nominale correcte.",
        cases: [
          { ar: "الكِتَابُ جَدِيدٌ", valid: true, fr: "Le livre est neuf", why: "Sujet défini (الكتاب) + prédicat indéfini (جديد) — structure classique." },
          { ar: "كِتَابٌ الجَدِيدُ", valid: false, fr: "—", why: "Le sujet indéfini en premier sans contexte particulier ne forme pas une phrase nominale claire." },
          { ar: "الوَلَدُ سَعِيدٌ", valid: true, fr: "Le garçon est heureux", why: "Sujet défini + prédicat indéfini : correct." },
          { ar: "بَيْتٌ كَبِيرٌ", valid: false, fr: "—", why: "Ici les deux mots sont indéfinis : c'est un groupe nominal (« une grande maison »), pas une phrase complète." },
          { ar: "المَدْرَسَةُ قَرِيبَةٌ", valid: true, fr: "L'école est proche", why: "Sujet défini + prédicat indéfini : correct." },
        ],
        activity: "sentence-judge",
      }
    ],
    quiz: [
      { q: "Traduisez : البَيْتُ كَبِيرٌ", opts: ["Une grande maison", "La maison est grande", "Les maisons sont grandes", "C'est une maison"], ans: 1, exp: "البيت (sujet défini) + كبير (prédicat indéfini) = la maison est grande, sans verbe être." },
      { q: "Dans une phrase nominale simple, le مبتدأ est en général :", opts: ["Indéfini", "Défini", "Toujours un verbe", "Toujours pluriel"], ans: 1, exp: "Le sujet (مبتدأ) est presque toujours défini — on parle d'une chose précise." },
      { q: "بَيْتٌ كَبِيرٌ (les deux mots indéfinis) signifie plutôt :", opts: ["Une phrase complète", "Un groupe nominal : « une grande maison »", "Une question", "Un ordre"], ans: 1, exp: "Sans sujet défini, les deux mots indéfinis forment un groupe, pas une phrase." },
      { q: "العِلْمُ نُورٌ : quel mot est le خبر (prédicat) ?", opts: ["العِلْمُ", "نُورٌ", "Aucun", "Les deux"], ans: 1, exp: "نُورٌ, indéfini, est ce qu'on affirme à propos du sujet العلم." },
      { q: "Quel est l'ordre habituel d'une phrase nominale ?", opts: ["خبر puis مبتدأ", "مبتدأ puis خبر", "L'ordre est libre", "Verbe puis sujet"], ans: 1, exp: "Le sujet (مبتدأ) ouvre la phrase, suivi du prédicat (خبر)." },
    ]
  },
  {
    id: 3, num: "04", title: "المذكر والمؤنث", subtitle: "Masculin & Féminin",
    description: "La marque ة qui féminise un nom ou un adjectif — et les exceptions qu'il faut connaître par cœur.",
    lessons: [
      {
        id: "4a", title: "La marque ة", kicker: "Féminiser un mot",
        theory: "Le féminin se forme le plus souvent en ajoutant ة (tāʾ marbūṭa) à la fin du masculin. Cette même marque s'applique aux noms de métier/qualité et aux adjectifs, qui doivent s'accorder avec le nom qu'ils décrivent.",
        pairs: [
          { m: "طَالِبٌ", mTr: "ṭālibun", mFr: "taliboun", f: "طَالِبَةٌ", fTr: "ṭālibatun", fFr: "talibatoun", fr: "étudiant(e)" },
          { m: "مُعَلِّمٌ", mTr: "muʿallimun", mFr: "mou'allimoun", f: "مُعَلِّمَةٌ", fTr: "muʿallimatun", fFr: "mou'allimatoun", fr: "enseignant(e)" },
          { m: "كَبِيرٌ", mTr: "kabīrun", mFr: "kabiroun", f: "كَبِيرَةٌ", fTr: "kabīratun", fFr: "kabiratoun", fr: "grand(e)" },
          { m: "جَدِيدٌ", mTr: "jadīdun", mFr: "jadidoun", f: "جَدِيدَةٌ", fTr: "jadīdatun", fFr: "jadidatoun", fr: "nouveau / nouvelle" },
          { m: "سَعِيدٌ", mTr: "saʿīdun", mFr: "sa'idoun", f: "سَعِيدَةٌ", fTr: "saʿīdatun", fFr: "sa'idatoun", fr: "heureux / heureuse" },
        ],
        activity: "gender-flip",
      },
      {
        id: "4b", title: "Les exceptions naturelles", kicker: "Féminin sans ة",
        theory: "Certains noms sont féminins sans porter de ة : les noms de pays/villes, et certains noms de personnes ou de parties du corps par paires. Il faut les apprendre au cas par cas — l'adjectif qui les décrit, lui, prend tout de même le ة féminin.",
        items: [
          { ar: "مِصْرُ", tr: "Miṣru", trFr: "Misrou", fr: "l'Égypte", reason: "pays" },
          { ar: "فَرَنْسَا", tr: "Faransā", trFr: "Faransa", fr: "la France", reason: "pays" },
          { ar: "بِنْتٌ", tr: "bintun", trFr: "bintoun", fr: "une fille", reason: "personne féminine" },
          { ar: "أُمٌّ", tr: "ummun", trFr: "oummoun", fr: "une mère", reason: "personne féminine" },
          { ar: "عَيْنٌ", tr: "ʿaynun", trFr: "'aynoun", fr: "un œil", reason: "partie du corps par paire" },
          { ar: "شَمْسٌ", tr: "shamsun", trFr: "chamsoun", fr: "un soleil", reason: "mot féminin par usage" },
        ],
        sentence: { ar: "مِصْرُ جَمِيلَةٌ", tr: "Miṣru jamīlatun", trFr: "Misrou jamilatoun", fr: "L'Égypte est belle", note: "جميلة prend ة même si مصر n'en a pas." },
        activity: "exception-memory",
      }
    ],
    quiz: [
      { q: "Le féminin de طَالِبٌ est :", opts: ["طَالِبُونَ", "طَالِبَةٌ", "طَالِبَيْنِ", "طُلَّابٌ"], ans: 1, exp: "On ajoute ة : طالب + ة = طَالِبَةٌ." },
      { q: "مِصْرُ (l'Égypte) est féminin :", opts: ["Grâce à la ة finale", "Sans aucune marque, par nature (pays)", "Parce que c'est un pluriel", "Ce n'est pas un mot féminin"], ans: 1, exp: "Les noms de pays sont féminins par nature, même sans ة." },
      { q: "Accordez : البِنْتُ ___ (heureuse)", opts: ["سَعِيدٌ", "سَعِيدَةٌ", "سَعِيدُونَ", "سَعِيدَيْنِ"], ans: 1, exp: "بنت est féminin → l'adjectif prend ة : سَعِيدَةٌ." },
      { q: "عَيْنٌ (un œil) est féminin parce que :", opts: ["Il porte une ة", "C'est une partie du corps par paire", "C'est un pays", "Il est au pluriel"], ans: 1, exp: "Les parties du corps par paires (œil, main, oreille...) sont féminines sans ة." },
      { q: "مُعَلِّمَةٌ signifie :", opts: ["un enseignant", "une enseignante", "des enseignants", "l'enseignement"], ans: 1, exp: "Le ة final féminise مُعَلِّمٌ → une enseignante." },
    ]
  },
  {
    id: 4, num: "05", title: "أسماء الإشارة", subtitle: "Démonstratifs : ceci, cela",
    description: "Montrer du doigt avec des mots : هذا، هذه pour le proche, ذلك، تلك pour le lointain.",
    lessons: [
      {
        id: "5a", title: "هذا و هذه", kicker: "« ceci » au masculin et au féminin",
        theory: "هذا pointe vers une chose proche masculine, هذه vers une chose proche féminine. Seul, le démonstratif + un nom indéfini forme une phrase complète : هذا كِتَابٌ — « ceci est un livre ».",
        items: [
          { demo: "هذا", ar: "كِتَابٌ", tr: "hādhā kitābun", trFr: "hada kitaboun", fr: "Ceci est un livre", gender: "m" },
          { demo: "هذا", ar: "بَيْتٌ", tr: "hādhā baytun", trFr: "hada baytoun", fr: "Ceci est une maison", gender: "m" },
          { demo: "هذه", ar: "طَالِبَةٌ", tr: "hādhihi ṭālibatun", trFr: "hadihi talibatoun", fr: "Ceci est une étudiante", gender: "f" },
          { demo: "هذه", ar: "مَدْرَسَةٌ", tr: "hādhihi madrasatun", trFr: "hadihi madrasatoun", fr: "Ceci est une école", gender: "f" },
          { demo: "هذا", ar: "قَلَمٌ", tr: "hādhā qalamun", trFr: "hada qalamoun", fr: "Ceci est un stylo", gender: "m" },
          { demo: "هذه", ar: "شَمْسٌ", tr: "hādhihi shamsun", trFr: "hadihi chamsoun", fr: "Ceci est un soleil", gender: "f" },
        ],
        activity: "demo-match",
      },
      {
        id: "5b", title: "ذلك و تلك + la phrase complète", kicker: "« cela », et pointer + décrire",
        theory: "ذلك (cela, m) et تلك (cela, f) pointent vers le lointain. Combinés à un nom défini, ils forment un sujet complet auquel on peut ajouter un prédicat indéfini : ذلك البَيْتُ كَبِيرٌ — « cette maison(-là) est grande ».",
        examples: [
          { ar: "ذلك البَيْتُ كَبِيرٌ", tr: "dhālika l-baytu kabīrun", trFr: "dalika l-baytou kabiroun", fr: "Cette maison(-là) est grande" },
          { ar: "تلك المَدْرَسَةُ قَرِيبَةٌ", tr: "tilka l-madrasatu qarībatun", trFr: "tilka l-madrasatou qaribatoun", fr: "Cette école(-là) est proche" },
          { ar: "ذلك القَلَمُ جَدِيدٌ", tr: "dhālika l-qalamu jadīdun", trFr: "dalika l-qalamou jadidoun", fr: "Ce stylo(-là) est neuf" },
        ],
        activity: "demo-builder",
      }
    ],
    quiz: [
      { q: "Pour pointer un livre (كِتَابٌ), on dit :", opts: ["هذه", "هذا", "تلك", "ذلك"], ans: 1, exp: "كِتَابٌ est masculin et proche → هذا كِتَابٌ." },
      { q: "هذه طَالِبَةٌ utilise هذه parce que :", opts: ["طالبة est lointain", "طالبة est féminin", "طالبة est un verbe", "Pas de raison particulière"], ans: 1, exp: "طَالِبَةٌ est féminin → on utilise le démonstratif féminin هذه." },
      { q: "ذلك et تلك servent à pointer :", opts: ["Une chose proche", "Une chose lointaine", "Un pluriel", "Une question"], ans: 1, exp: "ذلك (m) / تلك (f) = « cela », pour ce qui est plus loin que هذا/هذه." },
      { q: "ذلك البَيْتُ كَبِيرٌ signifie :", opts: ["Une grande maison", "Cette maison(-là) est grande", "La maison est-elle grande ?", "J'ai une grande maison"], ans: 1, exp: "ذلك + nom défini = sujet complet, suivi du prédicat indéfini كبير." },
      { q: "Pour une école (مَدْرَسَةٌ, féminin) lointaine, on dit :", opts: ["ذلك مَدْرَسَةٌ", "تلك مَدْرَسَةٌ", "هذا مَدْرَسَةٌ", "هذه مَدْرَسَةٌ"], ans: 1, exp: "مدرسة est féminin et lointain → تلك مَدْرَسَةٌ." },
    ]
  },
  {
    id: 5, num: "06", title: "الضمائر", subtitle: "Les pronoms : أنا، أنتَ، هو، هي",
    description: "Parler de soi et des autres sans répéter le nom : les pronoms personnels isolés et leurs phrases.",
    lessons: [
      {
        id: "6a", title: "أنا، أنتَ، أنتِ", kicker: "Moi et toi",
        theory: "أنا (moi) ne change pas selon le genre — c'est le prédicat qui s'accorde. أنتَ (toi, masculin) et أنتِ (toi, féminin) se distinguent seulement par la voyelle finale, qu'il faut bien prononcer.",
        examples: [
          { ar: "أنَا طَالِبٌ", tr: "anā ṭālibun", trFr: "ana taliboun", fr: "Je suis étudiant", gender:"m" },
          { ar: "أنَا طَالِبَةٌ", tr: "anā ṭālibatun", trFr: "ana talibatoun", fr: "Je suis étudiante", gender:"f" },
          { ar: "أنْتَ سَعِيدٌ", tr: "anta saʿīdun", trFr: "anta sa'idoun", fr: "Tu es heureux", gender:"m" },
          { ar: "أنْتِ سَعِيدَةٌ", tr: "anti saʿīdatun", trFr: "anti sa'idatoun", fr: "Tu es heureuse", gender:"f" },
        ],
        activity: "pronoun-agree",
      },
      {
        id: "6b", title: "هو، هي + lieu", kicker: "Il, elle — et « ici »/« là »",
        theory: "هو (il) et هي (elle) remplacent un nom déjà connu. Avec un prédicat de lieu, ils forment des phrases très utiles : هُوَ هُنَا (il est ici), هِيَ هُنَاكَ (elle est là-bas).",
        examples: [
          { ar: "هُوَ مُعَلِّمٌ", tr: "huwa muʿallimun", trFr: "houwa mou'allimoun", fr: "Il est enseignant", gender:"m" },
          { ar: "هِيَ مُعَلِّمَةٌ", tr: "hiya muʿallimatun", trFr: "hiya mou'allimatoun", fr: "Elle est enseignante", gender:"f" },
          { ar: "هُوَ هُنَا", tr: "huwa hunā", trFr: "houwa houna", fr: "Il est ici", gender:"m" },
          { ar: "هِيَ هُنَاكَ", tr: "hiya hunāka", trFr: "hiya hounaka", fr: "Elle est là-bas", gender:"f" },
        ],
        activity: "pronoun-story",
      }
    ],
    quiz: [
      { q: "« Je suis étudiante » se dit :", opts: ["أنَا طَالِبٌ", "أنَا طَالِبَةٌ", "أنْتِ طَالِبَةٌ", "هِيَ طَالِبَةٌ"], ans: 1, exp: "أنا (je, invariable) + طالبة (accordé au féminin du locuteur)." },
      { q: "Quelle est la différence entre أنْتَ et أنْتِ ?", opts: ["Aucune", "Le genre : toi-masculin / toi-féminin", "Le nombre", "Le temps"], ans: 1, exp: "أنْتَ s'adresse à un homme, أنْتِ à une femme — seule la voyelle finale change." },
      { q: "هُوَ هُنَا signifie :", opts: ["Elle est ici", "Il est ici", "Il est là-bas", "Ils sont ici"], ans: 1, exp: "هو = il, هنا = ici." },
      { q: "Pour parler d'une enseignante déjà mentionnée, on utilise :", opts: ["أنا", "أنتَ", "هو", "هي"], ans: 3, exp: "هي (elle) remplace un nom féminin déjà connu." },
      { q: "هِيَ هُنَاكَ signifie :", opts: ["Elle est ici", "Il est là-bas", "Elle est là-bas", "Elle est étudiante"], ans: 2, exp: "هي = elle, هناك = là-bas." },
    ]
  },
  {
    id: 6, num: "07", title: "الجمع", subtitle: "Le pluriel",
    description: "Deux façons de mettre un mot au pluriel : le pluriel régulier (ـُونَ / ـَاتٌ) et le pluriel irrégulier, qui change la forme du mot.",
    lessons: [
      {
        id: "7a", title: "Le pluriel régulier — جمع سالم", kicker: "Garder la racine",
        theory: "Le pluriel sain garde le mot intact et ajoute une terminaison. Masculin : ـُونَ (sujet) ou ـِينَ (objet). Féminin : ـَاتٌ. On le trouve surtout pour les humains et les noms de métier.",
        rows: [
          { sing: "مُسْلِمٌ", stem: "مُسْلِم", suffix: "ُونَ", pl: "مُسْلِمُونَ", plTr: "muslimūna", plFr: "mouslimouna", fr: "musulman → musulmans" },
          { sing: "مُعَلِّمٌ", stem: "مُعَلِّم", suffix: "ُونَ", pl: "مُعَلِّمُونَ", plTr: "muʿallimūna", plFr: "mou'allimouna", fr: "enseignant → enseignants" },
          { sing: "طَالِبَةٌ", stem: "طَالِب", suffix: "َاتٌ", pl: "طَالِبَاتٌ", plTr: "ṭālibātun", plFr: "talibatoun", fr: "étudiante → étudiantes" },
          { sing: "مُعَلِّمَةٌ", stem: "مُعَلِّم", suffix: "َاتٌ", pl: "مُعَلِّمَاتٌ", plTr: "muʿallimātun", plFr: "mou'allimatoun", fr: "enseignante → enseignantes" },
        ],
        activity: "suffix-builder",
      },
      {
        id: "7b", title: "Le pluriel irrégulier — جمع تكسير", kicker: "Le mot change de forme",
        theory: "La majorité des noms arabes forment leur pluriel en changeant complètement de structure interne — impossible à deviner, à apprendre mot par mot, comme child → children en anglais.",
        rows: [
          { sing: "كِتَابٌ", pl: "كُتُبٌ", plTr: "kutubun", plFr: "koutouboun", fr: "livre → livres" },
          { sing: "بَيْتٌ", pl: "بُيُوتٌ", plTr: "buyūtun", plFr: "bouyoutoun", fr: "maison → maisons" },
          { sing: "رَجُلٌ", pl: "رِجَالٌ", plTr: "rijālun", plFr: "rijaloun", fr: "homme → hommes" },
          { sing: "وَلَدٌ", pl: "أَوْلَادٌ", plTr: "awlādun", plFr: "awladoun", fr: "garçon → garçons" },
          { sing: "قَلَمٌ", pl: "أَقْلَامٌ", plTr: "aqlāmun", plFr: "aqlamoun", fr: "stylo → stylos" },
        ],
        activity: "memory-match",
      }
    ],
    quiz: [
      { q: "Le pluriel de مُسْلِمٌ est :", opts: ["مُسْلِمَاتٌ", "مُسْلِمُونَ", "مَسَالِمُ", "مُسْلِمَيْنِ"], ans: 1, exp: "Pluriel masculin sain : on ajoute ـُونَ → مُسْلِمُونَ." },
      { q: "كِتَابٌ → كُتُبٌ est un exemple de :", opts: ["Pluriel régulier", "Pluriel irrégulier (forme change)", "Duel", "Féminin"], ans: 1, exp: "Le mot change complètement de structure : c'est un pluriel irrégulier (جمع تكسير)." },
      { q: "Le pluriel de طَالِبَةٌ est :", opts: ["طَالِبُونَ", "طَالِبَاتٌ", "طُلَّابٌ", "طَالِبَيْنِ"], ans: 1, exp: "Pluriel féminin sain : on remplace ة par ـَاتٌ → طَالِبَاتٌ." },
      { q: "Pluriel irrégulier de وَلَدٌ ?", opts: ["وَلَدَاتٌ", "وَالِدُونَ", "أَوْلَادٌ", "وِلْدَانٌ"], ans: 2, exp: "وَلَدٌ → أَوْلَادٌ : changement de structure, à mémoriser." },
      { q: "بُيُوتٌ est le pluriel de :", opts: ["بَابٌ", "بَيْتٌ", "بِنْتٌ", "بَحْرٌ"], ans: 1, exp: "بَيْتٌ (maison) → بُيُوتٌ (maisons), pluriel irrégulier." },
    ]
  },
  {
    id: 7, num: "08", title: "الإضافة", subtitle: "L'annexion : « le livre DE l'étudiant »",
    description: "Le chapitre qui rassemble tout : relier deux noms pour dire « le X de Y », sans aucun mot pour « de ».",
    lessons: [
      {
        id: "8a", title: "مضاف + مضاف إليه", kicker: "Deux noms, un seul lien",
        theory: "Pour dire « le livre de l'étudiant », l'arabe colle deux noms : كِتَابُ الطَّالِبِ. Le premier mot (مضاف) perd son ال et son tanwīn ; le second (مضاف إليه) reste défini. Aucun mot ne traduit « de ».",
        rows: [
          { first: "كِتَابُ", second: "الطَّالِبِ", fr: "le livre de l'étudiant", tr: "kitābu ṭ-ṭālibi", trFr: "kitabou t-talibi" },
          { first: "بَيْتُ", second: "مُحَمَّدٍ", fr: "la maison de Muhammad", tr: "baytu Muḥammadin", trFr: "baytou Mouhammadin" },
          { first: "قَلَمُ", second: "الوَلَدِ", fr: "le stylo du garçon", tr: "qalamu l-waladi", trFr: "qalamou l-waladi" },
          { first: "بَابُ", second: "البَيْتِ", fr: "la porte de la maison", tr: "bābu l-bayti", trFr: "babou l-bayti" },
        ],
        activity: "idafa-builder",
      },
      {
        id: "8b", title: "Tout ensemble", kicker: "Le bilan du cours",
        theory: "Une إضافة peut elle-même devenir sujet d'une phrase nominale : كِتَابُ الطَّالِبِ جَدِيدٌ — « le livre de l'étudiant est neuf ». Sujet défini (par annexion), prédicat indéfini : tout ce que tu as appris se rejoint ici.",
        examples: [
          { ar: "كِتَابُ الطَّالِبِ جَدِيدٌ", tr: "kitābu ṭ-ṭālibi jadīdun", trFr: "kitabou t-talibi jadidoun", fr: "Le livre de l'étudiant est neuf" },
          { ar: "بَيْتُ المُعَلِّمَةِ كَبِيرٌ", tr: "baytu l-muʿallimati kabīrun", trFr: "baytou l-mou'allimati kabiroun", fr: "La maison de l'enseignante est grande" },
          { ar: "أَقْلَامُ الطُّلَّابِ كَثِيرَةٌ", tr: "aqlāmu ṭ-ṭullābi kathīratun", trFr: "aqlamou t-toullabi kathiratoun", fr: "Les stylos des étudiants sont nombreux" },
        ],
        activity: "capstone-recap",
      }
    ],
    quiz: [
      { q: "Dans كِتَابُ الطَّالِبِ, le mot كِتَابُ (مضاف) garde-t-il ال ou le tanwīn ?", opts: ["Oui, les deux", "Non, ni l'un ni l'autre", "Seulement ال", "Seulement le tanwīn"], ans: 1, exp: "Le مضاف ne porte jamais ال ni tanwīn — c'est le second mot qui porte la définitude." },
      { q: "بَيْتُ مُحَمَّدٍ signifie :", opts: ["Une maison et Muhammad", "La maison de Muhammad", "Muhammad a une maison", "La maison est à Muhammad ?"], ans: 1, exp: "Deux noms collés = annexion : « la maison de Muhammad », sans mot pour « de »." },
      { q: "كِتَابُ الطَّالِبِ جَدِيدٌ : quel mot est le خبر de toute la phrase ?", opts: ["كِتَابُ", "الطَّالِبِ", "جَدِيدٌ", "Aucun"], ans: 2, exp: "جَدِيدٌ, indéfini, est le prédicat — le sujet entier est l'annexion كِتَابُ الطَّالِبِ." },
      { q: "Comment dit-on « le stylo du garçon » ?", opts: ["قَلَمٌ الوَلَدُ", "قَلَمُ الوَلَدِ", "القَلَمُ وَلَدٌ", "قَلَمُ وَلَدٌ"], ans: 1, exp: "مضاف sans marque (قَلَمُ) + مضاف إليه défini (الوَلَدِ)." },
      { q: "Une إضافة peut-elle servir de sujet (مبتدأ) à une phrase nominale ?", opts: ["Non, jamais", "Oui, comme dans كِتَابُ الطَّالِبِ جَدِيدٌ", "Seulement au pluriel", "Seulement avec des pronoms"], ans: 1, exp: "L'annexion entière, étant définie par son second terme, fonctionne comme sujet." },
    ]
  },
];

export const COURSE_META = {
  title: "أساسيات النحو",
  subtitle: "Les fondations de la grammaire arabe",
  forWho: "Pour qui sait déjà lire l'alphabet, les voyelles courtes, le tanwīn et la shadda — et veut maintenant comprendre comment les mots se rassemblent en phrases.",
  totalLessons: 16,
  totalQuiz: 40,
  next: "La suite — les cas (الإعراب), le duel (المثنى) et les phrases verbales — fera l'objet d'un second cours.",
};