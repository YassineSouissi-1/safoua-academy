import React, { useRef, useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, useInView, AnimatePresence, easeOut } from "framer-motion";
import {
  ArrowLeft, Volume2, Globe, CheckCircle, BookOpen,
  ChevronRight, Search, Play, Star, Lock,
  Clock, Users, Award, ChevronDown, ChevronUp,
  Zap, Headphones, Mic, BarChart2, Sparkles,
  Trophy, Flame, Target, BookMarked, Layers
} from "lucide-react";
import axios from "axios";

/* ── FONTS ─────────────────────────────────────────────────────── */
const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
`;

/* ── PALETTE ────────────────────────────────────────────────────── */
const C = {
  bg:      "#080b0f",
  surface: "#0d1117",
  card:    "#111820",
  cardHov: "#141e28",
  border:  "rgba(255,255,255,0.07)",
  borderM: "rgba(255,255,255,0.12)",
  gold:    "#c9a84c",
  goldL:   "#e8c97a",
  teal:    "#1db584",
  tealL:   "#25d4a0",
  purple:  "#9d7bea",
  coral:   "#d4654a",
  blue:    "#4fadd4",
  text:    "#f2ede6",
  muted:   "rgba(242,237,230,0.5)",
  dim:     "rgba(242,237,230,0.22)",
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ══════════════════════════════════════════════════════════════════
   COURSE DATA  (course 9 removed — it has its own component)
══════════════════════════════════════════════════════════════════ */
const ARABIC_LETTERS = [
  { letter:"ا",name:"Alif",  transcription:"A",  ar:"ألف",  fr:"Alef",en:"Aleph"},
  { letter:"ب",name:"Ba",    transcription:"B",  ar:"با",   fr:"Ba",  en:"Ba"},
  { letter:"ت",name:"Ta",    transcription:"T",  ar:"تا",   fr:"Ta",  en:"Ta"},
  { letter:"ث",name:"Tha",   transcription:"Th", ar:"ثا",   fr:"Tha", en:"Tha"},
  { letter:"ج",name:"Jim",   transcription:"J",  ar:"جيم",  fr:"Jim", en:"Jim"},
  { letter:"ح",name:"Ha",    transcription:"H",  ar:"حا",   fr:"Ha",  en:"Ha"},
  { letter:"خ",name:"Kha",   transcription:"Kh", ar:"خا",   fr:"Kha", en:"Kha"},
  { letter:"د",name:"Dal",   transcription:"D",  ar:"دال",  fr:"Dal", en:"Dal"},
  { letter:"ذ",name:"Dhal",  transcription:"Dh", ar:"ذال",  fr:"Dhal",en:"Dhal"},
  { letter:"ر",name:"Ra",    transcription:"R",  ar:"را",   fr:"Ra",  en:"Ra"},
  { letter:"ز",name:"Zay",   transcription:"Z",  ar:"زاي",  fr:"Zaï", en:"Zay"},
  { letter:"س",name:"Sin",   transcription:"S",  ar:"سين",  fr:"Sin", en:"Sin"},
  { letter:"ش",name:"Shin",  transcription:"Sh", ar:"شين",  fr:"Shin",en:"Shin"},
  { letter:"ص",name:"Sad",   transcription:"S̈",  ar:"صاد",  fr:"Sad", en:"Sad"},
  { letter:"ض",name:"Dad",   transcription:"D̈",  ar:"ضاد",  fr:"Dad", en:"Dad"},
  { letter:"ط",name:"Ta'",   transcription:"Ṭ",  ar:"طا",   fr:"Ta emp.",en:"Ta"},
  { letter:"ظ",name:"Dha'",  transcription:"Ẓ",  ar:"ظا",   fr:"Dha emp.",en:"Dha"},
  { letter:"ع",name:"Ayn",   transcription:"ʿ",  ar:"عين",  fr:"Ayn", en:"Ayn"},
  { letter:"غ",name:"Ghayn", transcription:"Gh", ar:"غين",  fr:"Ghayn",en:"Ghayn"},
  { letter:"ف",name:"Fa",    transcription:"F",  ar:"فا",   fr:"Fa",  en:"Fa"},
  { letter:"ق",name:"Qaf",   transcription:"Q",  ar:"قاف",  fr:"Qaf", en:"Qaf"},
  { letter:"ك",name:"Kaf",   transcription:"K",  ar:"كاف",  fr:"Kaf", en:"Kaf"},
  { letter:"ل",name:"Lam",   transcription:"L",  ar:"لام",  fr:"Lam", en:"Lam"},
  { letter:"م",name:"Meem",  transcription:"M",  ar:"ميم",  fr:"Meem",en:"Meem"},
  { letter:"ن",name:"Nun",   transcription:"N",  ar:"نون",  fr:"Noun",en:"Nun"},
  { letter:"ه",name:"Ha",    transcription:"H",  ar:"ها",   fr:"Ha",  en:"Ha"},
  { letter:"و",name:"Waw",   transcription:"W",  ar:"واو",  fr:"Waw", en:"Waw"},
  { letter:"ي",name:"Ya",    transcription:"Y",  ar:"يا",   fr:"Ya",  en:"Ya"},
];

const COURS_DATA = [
  /* ───────────────────────────────── COURSE 1 ── */
  {
    id: 1, title:"Alphabet Arabe & Phonétique", titleAr:"الحروف والصوتيات",
    category:"Arabe", level:"Débutant", duration:"10h", rating:4.9, students:"1.2k",
    instructor:"Pr. Yassine", instructorRole:"Linguiste & Arabisant",
    accent: C.teal,
    image:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1400&q=90",
    tags:["Écriture","Oral"],
    videoUrl:"https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:"Maîtrisez les 28 lettres arabes, leurs formes selon la position et la phonétique complète avec les points d'articulation.",
    modules:[
      {
        title:"Module 1 — Histoire & Fondements",
        videoUrl:"https://www.youtube.com/embed/dQw4w9WgXcQ",
        lessons:[
          { title:"Histoire de la langue arabe", content:"L'arabe est une langue sémitique du Sud comptant plus de 420 millions de locuteurs natifs, ce qui en fait la 5ᵉ langue la plus parlée au monde. Elle appartient à la famille afro-asiatique, proche de l'hébreu et de l'araméen.\n\nLa langue arabe se divise en trois grandes variétés :\n— L'arabe classique (الفصحى القديمة), langue du Coran et des textes médiévaux\n— L'arabe standard moderne (الفصحى المعاصرة), utilisé dans les médias, l'éducation et la diplomatie\n— Les dialectes régionaux (العامية), qui varient considérablement d'un pays à l'autre\n\nL'écriture arabe descend de l'alphabet nabatéen, lui-même dérivé de l'araméen. Le plus ancien texte en arabe classique date du IVᵉ siècle. C'est avec la révélation coranique au VIIᵉ siècle que la langue fut codifiée et standardisée sous son état actuel." },
          { title:"L'Alphabet — 28 Lettres", content:"L'alphabet arabe (الأبجدية العربية) comporte 28 lettres, toutes consonantiques. Il s'écrit et se lit de droite à gauche, sans distinction entre majuscules et minuscules.\n\nCaractéristiques fondamentales :\n— Toutes les lettres sont des consonnes ; les voyelles sont indiquées par des signes diacritiques optionnels\n— Chaque lettre possède jusqu'à 4 formes selon sa position dans le mot : isolée, initiale, médiale, finale\n— 6 lettres ne se connectent qu'à la lettre précédente (non-connectantes) : ا د ذ ر ز و\n\nL'ordre traditionnel de l'alphabet arabe suit le système abjad (أبجد) : أ ب ج د ه و ز ح ط ي ك ل م ن س ع ف ص ق ر ش ت ث خ ذ ض ظ غ\nUn ordre alphabétique moderne (ترتيب هجائي) est également utilisé dans les dictionnaires contemporains." },
          { title:"Fusha vs Dialectes", content:"La diglossie arabe est l'une des caractéristiques les plus fascinantes de la langue : deux variétés coexistent dans la société arabe moderne.\n\nL'arabe standard moderne (Fusha — الفصحى) :\n— Langue de l'éducation, des médias formels, de la littérature\n— Compris par tous les arabophones éduqués\n— Très proche de l'arabe coranique classique\n— Langue de prestige utilisée dans les discours officiels\n\nLes dialectes (Ammiya — العامية) :\n— Égyptien (المصري) : le plus répandu médiatiquement grâce au cinéma\n— Levantin (الشامي) : Syrie, Liban, Palestine, Jordanie\n— Maghrébin (المغاربي) : Maroc, Algérie, Tunisie — fortement influencé par le berbère et le français\n— Golfe (الخليجي) : considéré comme le plus proche de l'arabe classique\n\nCe cours se concentre exclusivement sur le Fusha (arabe standard moderne), qui vous permettra de comprendre et d'être compris dans tous les pays arabophones." }
        ],
        exercises:[
          { question:"Combien de lettres compte l'alphabet arabe?", options:["24","26","28","30"], correctAnswer:"28" },
          { question:"Dans quel sens lit-on l'arabe?", options:["Gauche à droite","Droite à gauche","Haut en bas","Variable"], correctAnswer:"Droite à gauche" },
          { question:"Combien de formes peut avoir une lettre arabe?", options:["1","2","3","Jusqu'à 4"], correctAnswer:"Jusqu'à 4" },
        ],
        quiz:[
          { question:"L'arabe standard moderne s'appelle :", options:["Fusha","Darija","Levantin","Ammiya"], correctAnswer:"Fusha" },
          { question:"Combien de personnes parlent l'arabe ?", options:["100 millions","300 millions","Plus de 420 millions","600 millions"], correctAnswer:"Plus de 420 millions" },
          { question:"Les lettres arabes sont fondamentalement :", options:["Des voyelles","Des consonnes","Des syllabe","Des idéogrammes"], correctAnswer:"Des consonnes" },
        ]
      },
      {
        title:"Module 2 — Phonétique & Makharij",
        videoUrl:"https://www.youtube.com/embed/RQd5DGlnIWE",
        lessons:[
          { title:"Les Points d'Articulation (Makharij)", content:"Le terme Makharij (مخارج الحروف) désigne les points d'articulation des lettres arabes — c'est-à-dire les endroits précis de la bouche ou de la gorge où chaque son est produit.\n\nIl existe 17 points d'articulation principaux répartis en 5 zones :\n\n1. الجوف (Al-Jawf — La cavité buccale) : sons produits sans contact physique, lettres de prolongation : ا و ي\n\n2. الحلق (Al-Halq — La gorge) : 3 zones :\n   — Gorge profonde : ء ه\n   — Gorge médiane : ع ح\n   — Gorge supérieure : غ خ\n\n3. اللسان (Al-Lisan — La langue) : 10 points différents, la plupart des lettres arabes\n\n4. الشفتان (Ash-Shafatan — Les lèvres) : ب م و ف\n\n5. الخيشوم (Al-Khayshum — La cavité nasale) : sons de ghunna (nasalisation) م ن\n\nMaîtriser les Makharij est fondamental pour une prononciation authentique et juste." },
          { title:"Les Voyelles Courtes & Longues", content:"L'arabe possède 3 voyelles courtes (حركات) et 3 voyelles longues correspondantes :\n\nVoyelles courtes :\n— الفتحة (Fatha) : trait horizontal au-dessus → son [a] court, ex: كَتَبَ (kataba)\n— الكسرة (Kasra) : trait horizontal en-dessous → son [i] court, ex: كِتَاب (kitab)\n— الضمة (Damma) : petit واو au-dessus → son [u] court, ex: كُتُب (kutub)\n\nVoyelles longues (حروف المد) :\n— ا après fatha → [aa] long, ex: قَالَ (qaala = il a dit)\n— ي après kasra → [ii] long, ex: قِيل (qiila = il a été dit)\n— و après damma → [uu] long, ex: يَقُول (yaquulu = il dit)\n\nDiacritiques spéciaux :\n— السكون (Sukun ْ) : absence totale de voyelle sur une consonne\n— الشدة (Shadda ّ) : doublement de la consonne (gémination)\n— التنوين (Tanwin) : nunation — voyelle suivie d'un [n] : ً ٍ ٌ" },
          { title:"Les Sons Emphatiques", content:"L'arabe possède 4 consonnes emphatiques (مفخمة) qui n'ont pas d'équivalent en français. Elles sont produites avec une constriction pharyngale qui \"épaissit\" le son :\n\n— ص (Sad) : version emphatique de سـ, comme un [s] profond\n— ض (Dad) : version emphatique de دـ, son typiquement arabe\n— ط (Ta) : version emphatique de تـ, comme un [t] grave\n— ظ (Dha) : version emphatique de ذـ\n\nCes sons sont qualifiés de مفخمة (mufakhkhamah = voix épaissie) par opposition aux sons رقيقة (raqiiqah = légers).\n\nL'effet d'emphase se propage également aux voyelles voisines : فَتَحَ → [fataha] mais طَابَ → [ṭaab] avec le [a] profond.\n\nAstuce : Imaginez que vous prononcez ces sons avec la bouche plus remplie, la langue tirée vers l'arrière et le bas." }
        ],
        exercises:[
          { question:"Le Fatha (َ) produit quel son ?", options:["[i]","[u]","[a]","[o]"], correctAnswer:"[a]" },
          { question:"Laquelle est une voyelle longue ?", options:["Fatha","Kasra","Alif (ا)","Sukun"], correctAnswer:"Alif (ا)" },
          { question:"Le Sukun (ْ) signifie :", options:["Double lettre","Absence de voyelle","Voyelle longue","Aspiration"], correctAnswer:"Absence de voyelle" },
        ],
        quiz:[
          { question:"Combien de voyelles courtes y a-t-il en arabe ?", options:["2","3","4","5"], correctAnswer:"3" },
          { question:"La Shadda indique :", options:["Une voyelle longue","Un arrêt","Le doublement d'une consonne","L'absence de voyelle"], correctAnswer:"Le doublement d'une consonne" },
          { question:"Les consonnes emphatiques arabes sont au nombre de :", options:["2","3","4","6"], correctAnswer:"4" },
        ]
      },
      {
        title:"Module 3 — Construction de Mots",
        videoUrl:"https://www.youtube.com/embed/tYzMGcUty6s",
        lessons:[
          { title:"Le Système Trilitère", content:"L'un des aspects les plus élégants et logiques de l'arabe est son système de racines trilitères (جذور ثلاثية). La quasi-totalité du vocabulaire arabe est construite sur des racines de 3 consonnes (parfois 4) qui portent un sens de base.\n\nExemple avec la racine ك-ت-ب (K-T-B = idée d'écriture) :\n— كَتَبَ (kataba) = il a écrit\n— يَكْتُبُ (yaktubu) = il écrit\n— كِتَاب (kitaab) = livre\n— كَاتِب (kaatib) = écrivain\n— مَكْتُوب (maktuub) = écrit / lettre\n— مَكْتَب (maktab) = bureau\n— كِتَابَة (kitaabah) = écriture\n— مَكْتَبَة (maktabah) = bibliothèque / librairie\n\nUne fois que vous connaissez la racine et les schèmes (أوزان), vous pouvez déduire le sens d'un grand nombre de mots inconnus. C'est l'outil le plus puissant pour apprendre le vocabulaire arabe." },
          { title:"Les Schèmes (Awzân)", content:"Les schèmes (أوزان — awzaan, singulier وزن wazn) sont des patrons morphologiques dans lesquels s'insèrent les racines. Chaque schème a une signification grammaticale précise.\n\nSchèmes de base pour les verbes (sur la racine ف-ع-ل) :\n— فَعَلَ (fa'ala) : forme de base du passé → كَتَبَ\n— يَفْعُلُ (yaf'ulu) : présent Type 1 → يَكْتُبُ\n— فَاعِل (faa'il) : celui qui fait → كَاتِب (écrivain)\n— مَفْعُول (maf'uul) : ce qui est fait → مَكْتُوب (écrit)\n— مَفْعَل (maf'al) : lieu de l'action → مَكْتَب (bureau)\n— فِعَال (fi'aal) : nom de l'action → كِتَاب\n\nApprendre les schèmes, c'est apprendre le code secret de l'arabe. Maîtrisez 20 schèmes courants et vous pourrez déchiffrer des milliers de mots nouveaux." },
          { title:"Noms, Genre et Duel", content:"En arabe, tous les noms ont un genre grammatical : masculin (مذكر) ou féminin (مؤنث).\n\nFormation du féminin :\nLa plupart des noms féminins se terminent par ة (ta marbuta) :\n— كَاتِب (kaatib = écrivain masc.) → كَاتِبَة (kaatibah = écrivaine)\n— طَالِب (taalib = étudiant) → طَالِبَة (taalibah = étudiante)\n\nLe duel (المثنى) — une particularité de l'arabe :\nL'arabe dispose d'une forme spéciale pour exprimer DEUX entités :\n— Masculin : ajout de -aani (رفع) ou -ayni (نصب/جر)\n  كِتَاب (livre) → كِتَابَانِ (deux livres — sujet)\n— Féminin : ajout de -ataani / -atayni\n  طَالِبَة → طَالِبَتَانِ\n\nLe pluriel arabe peut être régulier (سالم) ou brisé (مكسور) :\n— Pluriel sain masc. : -uuna / -iina → مُعَلِّمُون (enseignants)\n— Pluriel sain fém. : -aat → مُعَلِّمَات (enseignantes)\n— Pluriel brisé (schème change) : كِتَاب → كُتُب / رَجُل → رِجَال" }
        ],
        exercises:[
          { question:"La racine K-T-B porte l'idée de :", options:["Lire","Écrire","Parler","Compter"], correctAnswer:"Écrire" },
          { question:"مَكْتَبَة (maktabah) signifie :", options:["Bureau","Livre","Bibliothèque","Stylo"], correctAnswer:"Bibliothèque" },
          { question:"La ta marbuta (ة) indique généralement :", options:["Le masculin","Le féminin","Le pluriel","Le duel"], correctAnswer:"Le féminin" },
        ],
        quiz:[
          { question:"كَاتِب (kaatib) signifie :", options:["Livre","Bureau","Écrivain","Il a écrit"], correctAnswer:"Écrivain" },
          { question:"كِتَابَانِ signifie :", options:["Des livres","Un livre","Deux livres","L'écriture"], correctAnswer:"Deux livres" },
          { question:"Le schème فَاعِل indique :", options:["L'action","Celui qui fait","Le lieu de l'action","Ce qui est fait"], correctAnswer:"Celui qui fait" },
        ]
      }
    ],
    vocabulary:[
      { ar:"مَرْحَبًا", tr:"Marhaban",  fr:"Bonjour",      en:"Hello" },
      { ar:"كِتَاب",   tr:"Kitaab",    fr:"Livre",         en:"Book" },
      { ar:"قَلَم",    tr:"Qalam",     fr:"Stylo",         en:"Pen" },
      { ar:"مَدْرَسَة",tr:"Madrasah",  fr:"École",         en:"School" },
      { ar:"طَالِب",   tr:"Taalib",    fr:"Étudiant",      en:"Student" },
    ]
  },

  /* ───────────────────────────────── COURSE 2 ── */
  {
    id: 2, title:"Tajwid : Récitation Sacrée", titleAr:"أحكام التجويد",
    category:"Coran", level:"Intermédiaire", duration:"15h", rating:4.8, students:"850",
    instructor:"Cheikh Omar", instructorRole:"Hafiz & Spécialiste Tajwid",
    accent: C.purple,
    image:"https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1400&q=90",
    tags:["Règles","Mélodie"],
    videoUrl:"https://www.youtube.com/embed/9jK-NcRmVcw",
    description:"Maîtrisez les règles du Tajwid pour une récitation impeccable du Coran selon les standards des grandes écoles de récitation.",
    modules:[
      {
        title:"Module 1 — Introduction au Tajwid",
        videoUrl:"https://www.youtube.com/embed/9jK-NcRmVcw",
        lessons:[
          { title:"Qu'est-ce que le Tajwid ?", content:"Le Tajwid (التجويد) vient du verbe جَوَّدَ (jawwada = améliorer, embellir). C'est la science qui définit les règles de prononciation correcte du Coran, telles qu'elles furent transmises par le Prophète Muhammad ﷺ et conservées jusqu'à aujourd'hui par une chaîne ininterrompue de transmission orale.\n\nApprendre le Tajwid est une obligation religieuse (فرض كفاية) pour la communauté musulmane. Le Coran lui-même commande dans la sourate 73, verset 4 : وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا (\"Récite le Coran avec tartil — de manière lente et distincte\").\n\nLes deux catégories principales :\n1. المستحيل (obligatoire) : ce qui est interdit par consensus\n2. المستحسن (recommandé) : les beautifications de la récitation\n\nLes grandes écoles de récitation (القراءات العشر) transmettent 10 lectures canoniques, toutes authentiquement transmises. La plus répandue est la lecture de Hafs d'Asim (حفص عن عاصم)." },
          { title:"Les Règles de Nun Saakin & Tanwin", content:"La nun saakin (النون الساكنة) — nun sans voyelle — et le tanwin (التنوين) — nun finale — suivent 4 règles précises selon la lettre qui suit :\n\n1. الإظهار (Izhar — Clarté) : la nun est prononcée clairement.\nDevant les 6 lettres gutturales : ء ه ع ح غ خ\nEx : مَنْ آمَنَ (man aamana)\n\n2. الإدغام (Idgham — Fusion) : la nun fusionne avec la lettre suivante.\nDevant : ي ر م ل و ن\n— Avec ghunna (nasalisation) devant : ي ن م و\n— Sans ghunna devant : ر ل\nEx : مَن يَقُول → (mayyaqul) — le nun disparaît dans le ya\n\n3. الإقلاب (Iqlab — Transformation) : la nun devient un mim.\nUniquement devant : ب\nEx : أَنبِئْهُم → prononcé comme أَمبِئهم\n\n4. الإخفاء (Ikhfa — Dissimulation) : son intermédiaire entre clarté et fusion.\nDevant les 15 lettres restantes de l'alphabet.\nEx : مَنتَهَى → la nun est \"cachée\"" },
          { title:"Les Règles de Mim Saakin", content:"Le mim saakin (الميم الساكنة) — mim sans voyelle — obéit à 3 règles :\n\n1. الإخفاء الشفوي (Ikhfa Shafawi — Dissimulation labiale) :\nDevant la lettre ب uniquement.\nEx : رَبَّهُم بِالْغَيْبِ — le mim est \"caché\" avec nasalisation (ghunna).\n\n2. الإدغام الشفوي (Idgham Shafawi — Fusion labiale) :\nDevant la lettre م uniquement.\nEx : لَهُم مَا يَشَاءُون — le premier mim fusionne dans le second.\nAttention : la ghunna (nasalisation) dure 2 temps (حركتان).\n\n3. الإظهار الشفوي (Izhar Shafawi — Clarté labiale) :\nDevant toutes les autres lettres de l'alphabet.\nEx : وَهُم بِرَبِّهِمْ يُشْرِكُون — le mim est clairement prononcé." }
        ],
        exercises:[
          { question:"Tajwid vient du verbe جَوَّدَ qui signifie :", options:["Réciter","Améliorer/Embellir","Mémoriser","Lire vite"], correctAnswer:"Améliorer/Embellir" },
          { question:"Devant quelle lettre la nun saakin devient-elle un mim (Iqlab) ?", options:["ي","ر","ب","ن"], correctAnswer:"ب" },
        ],
        quiz:[
          { question:"L'Idgham avec ghunna s'applique devant :", options:["ب","ي ن م و","ء ه ع ح غ خ","ر ل"], correctAnswer:"ي ن م و" },
          { question:"L'Izhar s'applique devant les lettres :", options:["Labiales","Gutturales","Nasales","Emphatiques"], correctAnswer:"Gutturales" },
          { question:"Combien de lectures coraniques canoniques existe-t-il ?", options:["3","7","10","14"], correctAnswer:"10" },
        ]
      }
    ],
    vocabulary:[
      { ar:"الحَمْد",  tr:"Al-Hamdu",  fr:"La louange",        en:"Praise" },
      { ar:"الرَّحْمٰن",tr:"Ar-Rahman",fr:"Le Miséricordieux",  en:"The Merciful" },
      { ar:"الرَّحِيم",tr:"Ar-Rahim",  fr:"Le Compatissant",   en:"The Compassionate" },
      { ar:"المَلِك",  tr:"Al-Malik",  fr:"Le Roi",            en:"The King" },
      { ar:"التَّجْوِيد",tr:"At-Tajwid",fr:"La récitation",   en:"Recitation rules" },
    ]
  },
];

/* Fill minimal data for other course IDs */
const FALLBACK = {
  id:0, title:"Cours", titleAr:"دَرْس", category:"Arabe", level:"Débutant",
  duration:"10h", rating:4.8, students:"500", instructor:"Expert", instructorRole:"Spécialiste",
  accent: C.teal, image:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=90",
  tags:["Apprentissage"], videoUrl:"https://www.youtube.com/embed/dQw4w9WgXcQ",
  description:"Contenu en cours de développement. Revenez bientôt !",
  modules:[], vocabulary:[]
};

function getCourse(id) {
  return COURS_DATA.find(c => c.id === parseInt(id)) || { ...FALLBACK, id: parseInt(id) };
}

/* ══════════════════════════════════════════════════════════════════
   BACKGROUND COMPONENTS
══════════════════════════════════════════════════════════════════ */
function GridLines() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
      backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
      backgroundSize:"88px 88px",opacity:0.45 }}/>
  );
}
function NoiseOverlay() {
  return (
    <svg style={{ position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:2,opacity:0.028,mixBlendMode:"overlay" }} xmlns="http://www.w3.org/2000/svg">
      <filter id="dn"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#dn)"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   XP TOAST
══════════════════════════════════════════════════════════════════ */
function XpToast({ notif, accent }) {
  if (!notif) return null;
  return (
    <motion.div
      initial={{ opacity:0, y:32, scale:0.9 }}
      animate={{ opacity:1, y:0, scale:1 }}
      exit={{ opacity:0, y:16, scale:0.95 }}
      style={{
        position:"fixed",bottom:32,right:32,zIndex:9999,
        background:`linear-gradient(135deg,${accent}ee,${accent}aa)`,
        backdropFilter:"blur(16px)",
        color:"#fff",padding:"18px 24px",borderRadius:20,
        boxShadow:`0 8px 40px ${accent}60,0 0 0 1px ${accent}50`,
        fontFamily:"'DM Sans',sans-serif",
        display:"flex",flexDirection:"column",gap:4,
        minWidth:220,
      }}>
      <span style={{ fontSize:22,fontWeight:900 }}>+10 XP 🎉</span>
      <span style={{ fontSize:12,fontWeight:600,opacity:0.9,lineHeight:1.4 }}>{notif.lessonTitle}</span>
      <span style={{ fontSize:13,fontWeight:800,marginTop:2 }}>Total : {notif.points} pts ✨</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LESSON CONTENT RENDERER
══════════════════════════════════════════════════════════════════ */
function LessonContent({ content, accent }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        return (
          <div key={i}>
            {lines.map((line, j) => {
              if (line.startsWith("━━")) {
                return (
                  <div key={j} style={{
                    fontSize:11,fontWeight:700,color:accent,
                    letterSpacing:"0.12em",textTransform:"uppercase",
                    marginBottom:8,marginTop: j===0 && i>0 ? 4 : 0,
                    fontFamily:"'DM Sans',sans-serif",
                    display:"flex",alignItems:"center",gap:10,
                  }}>
                    <div style={{ flex:1,height:1,background:`${accent}30` }}/>
                    {line.replace(/━━/g,"").trim()}
                    <div style={{ flex:1,height:1,background:`${accent}30` }}/>
                  </div>
                );
              }
              if (line.trim() === "") return <div key={j} style={{ height:4 }}/>;
              const hasArabic = /[\u0600-\u06FF]/.test(line);
              const isBullet = line.startsWith("—") || line.startsWith("•");
              const isNote = line.startsWith("⚠️") || line.startsWith("🎯") || line.startsWith("📚") || line.startsWith("📰") || line.startsWith("🌐") || line.startsWith("🏛") || line.startsWith("✍️");
              return (
                <div key={j} style={{
                  fontSize: isBullet ? 13 : 14,
                  lineHeight: 1.75,
                  color: isBullet ? C.muted : isNote ? C.text : C.text,
                  paddingLeft: isBullet ? 8 : 0,
                  fontFamily: hasArabic && !isBullet ? "'Cormorant Garamond',serif" : "'DM Sans',sans-serif",
                  direction: hasArabic && !isBullet ? "rtl" : "ltr",
                  fontWeight: isNote ? 500 : 300,
                  opacity: isBullet ? 0.8 : 1,
                }}>
                  {line}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function CourseDetail() {
  const { id } = useParams();

  /* ── Redirect course 9 to its dedicated component ── */
  

  const course  = getCourse(id);
  const accent  = course.accent || C.teal;

  /* ── state ─────────────────────────────────────────────────── */
  const [activeTab,            setActiveTab]            = useState("about");
  const [selectedModule,       setSelectedModule]       = useState(0);
  const [selectedLanguage,     setSelectedLanguage]     = useState("ar");
  const [activeModuleTab,      setActiveModuleTab]      = useState("lessons");
  const [currentLessonIndex,   setCurrentLessonIndex]   = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentQuizIndex,     setCurrentQuizIndex]     = useState(0);
  const [exerciseAnswers,      setExerciseAnswers]      = useState({});
  const [quizAnswers,          setQuizAnswers]          = useState({});
  const [moduleResults,        setModuleResults]        = useState(null);
  const [quizIndex,            setQuizIndex]            = useState(0);
  const [userAnswer,           setUserAnswer]           = useState("");
  const [quizResult,           setQuizResult]           = useState(null);
  const [quizScore,            setQuizScore]            = useState(0);
  const [dictSearchTerm,       setDictSearchTerm]       = useState("");
  const [dictSearchLanguage,   setDictSearchLanguage]   = useState("english");
  const [dictResults,          setDictResults]          = useState(null);
  const [dictLoading,          setDictLoading]          = useState(false);
  const [dictError,            setDictError]            = useState("");
  const [completedLessons,     setCompletedLessons]     = useState(new Set());
  const [xpNotif,              setXpNotif]              = useState(null);
  const [markingComplete,      setMarkingComplete]      = useState(false);
  const [letterLang,           setLetterLang]           = useState("ar");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    axios.get(`${API}/api/user/${email}`)
      .then(r => setCompletedLessons(new Set(r.data.completedLessons || [])))
      .catch(() => {});
  }, []);

  const lessonKey = (modTitle, lesTitle) => `${course.title} — ${modTitle} — ${lesTitle}`;

  const handleMarkComplete = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) { alert("Connectez-vous pour enregistrer votre progression."); return; }
    if (!currentModule) return;
    const key = lessonKey(currentModule.title, currentModule.lessons[currentLessonIndex].title);
    if (completedLessons.has(key)) return;
    setMarkingComplete(true);
    try {
      const res = await axios.post(`${API}/api/update-progress`, { email, lessonTitle: key });
      setCompletedLessons(prev => new Set([...prev, key]));
      setXpNotif({ lessonTitle: currentModule.lessons[currentLessonIndex].title, points: res.data.points });
      setTimeout(() => setXpNotif(null), 4200);
    } catch { alert("Impossible d'enregistrer la progression."); }
    setMarkingComplete(false);
  };

  const isModuleComplete = (mod) => {
    if (!mod?.lessons) return false;
    return mod.lessons.every(l => completedLessons.has(lessonKey(mod.title, l.title)));
  };

  const totalLessons = course.modules
    ? course.modules.reduce((a, m) => a + (m.lessons?.length || 0), 0) : 0;
  const completedCount = course.modules
    ? course.modules.reduce((a, m) => a + (m.lessons?.filter(l => completedLessons.has(lessonKey(m.title, l.title))).length || 0), 0) : 0;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const speak = (text, lang = "ar-SA") => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  const handleDictSearch = async (e) => {
    e.preventDefault();
    if (!dictSearchTerm.trim()) return;
    setDictLoading(true); setDictError(""); setDictResults(null);
    try {
      const r = await axios.get(`${API}/api/dictionary/translate`, {
        params: { word: dictSearchTerm.trim(), language: dictSearchLanguage }
      });
      if (r.data.success) setDictResults(r.data);
      else setDictError(r.data.message || "Mot introuvable.");
    } catch { setDictError("Erreur de connexion."); }
    setDictLoading(false);
  };

  const checkAnswer = () => {
    const correct = userAnswer.trim() === ARABIC_LETTERS[quizIndex].letter;
    setQuizResult(correct ? "correct" : "incorrect");
    if (correct) setQuizScore(s => s + 1);
  };

  const hasModules    = course.modules && course.modules.length > 0;
  const currentModule = hasModules ? course.modules[selectedModule] : null;
  const currentLesson = currentModule?.lessons?.[currentLessonIndex];
  const currentLessonDone = currentLesson
    ? completedLessons.has(lessonKey(currentModule.title, currentLesson.title)) : false;

  const TABS = [
    { id:"about",       label:"📖 Programme",   show: true },
    { id:"vocab",       label:"🔤 Vocabulaire",  show: true },
    ...(parseInt(id) === 1 ? [
      { id:"lettres",    label:"ح Lettres",       show: true },
      { id:"traducteur", label:"🌐 Traducteur",    show: true },
      { id:"quiz",       label:"🎯 Quiz Lettres",  show: true },
    ] : [])
  ].filter(t => t.show);

  /* ── RENDER ─────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text,position:"relative" }}>
      <style>{FONT_LINK + `
        * { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:rgba(201,168,76,0.25); color:#f2ede6; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#080b0f; }
        ::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.2); border-radius:99px; }
        textarea, input { background:transparent; }
      `}</style>
      <GridLines/>
      <NoiseOverlay/>
      <AnimatePresence><XpToast notif={xpNotif} accent={accent}/></AnimatePresence>

      {/* ── TOP BAR ── */}
      <div style={{
        position:"sticky",top:0,zIndex:40,
        background:"rgba(8,11,15,0.85)",backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16 }}>
          <Link to="/courses" style={{
            textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,
            fontSize:13,fontWeight:600,color:C.muted,
            padding:"7px 14px",borderRadius:99,border:`1px solid ${C.border}`,
            transition:"all 0.2s",
          }}
            onMouseEnter={e=>{e.currentTarget.style.color=C.text;e.currentTarget.style.borderColor=C.borderM;}}
            onMouseLeave={e=>{e.currentTarget.style.color=C.muted;e.currentTarget.style.borderColor=C.border;}}
          >
            <ArrowLeft size={15}/> Catalogue
          </Link>

          <div style={{ flex:1,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:C.text,lineHeight:1 }}>
              {course.title}
            </div>
            <div style={{ fontSize:10,color:C.dim,marginTop:3,fontWeight:600,letterSpacing:"0.06em" }}>
              {course.category} · {course.level}
            </div>
          </div>

          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            {totalLessons > 0 && (
              <div style={{
                display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,
                color:accent,background:`${accent}15`,border:`1px solid ${accent}30`,
                padding:"5px 12px",borderRadius:99,
              }}>
                <CheckCircle size={12}/>{completedCount}/{totalLessons} · {progressPct}%
              </div>
            )}
            <div style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:C.gold }}>
              <Star size={13} style={{ fill:C.gold }}/>{course.rating}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280,margin:"0 auto",padding:"32px 24px 80px",position:"relative",zIndex:3 }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:28 }}>

          {/* ════════════════ MAIN COLUMN ════════════════ */}
          <div style={{ display:"flex",flexDirection:"column",gap:24 }}>

            {/* Hero */}
            <motion.div
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6,ease:[.22,.68,0,1] }}
              style={{ borderRadius:24,overflow:"hidden",background:C.card,border:`1px solid ${C.border}`,position:"relative" }}>
              <div style={{ position:"relative",height:340,overflow:"hidden" }}>
                <img src={course.image} alt={course.title}
                  style={{ width:"100%",height:"100%",objectFit:"cover",opacity:0.45 }}/>
                <div style={{ position:"absolute",inset:0,background:`linear-gradient(180deg,rgba(8,11,15,0.2) 0%,rgba(8,11,15,0.85) 75%,${C.bg} 100%)` }}/>
                <div style={{ position:"absolute",inset:0,background:`linear-gradient(135deg,${accent}18 0%,transparent 55%)` }}/>
                <div style={{ position:"absolute",bottom:28,left:32,right:32 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
                    <span style={{ padding:"4px 12px",borderRadius:99,background:`${accent}20`,border:`1px solid ${accent}40`,fontSize:10,fontWeight:700,color:accent,letterSpacing:"0.1em",textTransform:"uppercase" }}>
                      {course.category}
                    </span>
                    <span style={{ padding:"4px 12px",borderRadius:99,background:"rgba(255,255,255,0.07)",border:`1px solid ${C.border}`,fontSize:10,fontWeight:600,color:C.dim,letterSpacing:"0.06em" }}>
                      {course.level}
                    </span>
                  </div>
                  <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3vw,2.8rem)",fontWeight:700,color:C.text,lineHeight:1.1,marginBottom:6,letterSpacing:"-0.02em" }}>
                    {course.title}
                  </h1>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:`${accent}99`,direction:"rtl",marginBottom:10 }}>
                    {course.titleAr}
                  </div>
                  <p style={{ fontSize:13,color:C.muted,lineHeight:1.65,maxWidth:600,fontWeight:300 }}>
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Tab bar */}
              <div style={{ display:"flex",overflowX:"auto",borderBottom:`1px solid ${C.border}`,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(8px)" }}>
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{
                      flexShrink:0,padding:"14px 20px",fontSize:12,fontWeight:700,
                      color: activeTab===tab.id ? accent : C.dim,
                      borderBottom: `2px solid ${activeTab===tab.id ? accent : "transparent"}`,
                      background:"transparent",border:"none",cursor:"pointer",
                      transition:"all 0.25s",fontFamily:"'DM Sans',sans-serif",
                      letterSpacing:"0.02em",
                    }}
                    onMouseEnter={e=>{if(activeTab!==tab.id)e.currentTarget.style.color=C.muted;}}
                    onMouseLeave={e=>{if(activeTab!==tab.id)e.currentTarget.style.color=C.dim;}}
                  >{tab.label}</button>
                ))}
              </div>
            </motion.div>

            {/* ═══ TAB CONTENT ═══ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.35,ease:easeOut }}
              >

                {/* ───── ABOUT / PROGRAMME TAB ───── */}
                {activeTab==="about" && (
                  <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
                    {currentModule ? (
                      <>
                        {currentModule.videoUrl && (
                          <div style={{ borderRadius:20,overflow:"hidden",border:`1px solid ${C.border}`,aspectRatio:"16/9" }}>
                            <iframe style={{ width:"100%",height:"100%" }}
                              src={currentModule.videoUrl} title={currentModule.title}
                              frameBorder="0" allowFullScreen/>
                          </div>
                        )}

                        <div style={{ background:C.card,borderRadius:20,border:`1px solid ${C.border}`,overflow:"hidden" }}>
                          <div style={{ display:"flex",padding:6,gap:4,background:"rgba(0,0,0,0.3)",borderBottom:`1px solid ${C.border}` }}>
                            {[
                              { id:"lessons",  label:"📖 Leçons" },
                              { id:"exercises",label:"✏️ Exercices" },
                              { id:"quiz",     label:"🎯 Quiz" },
                            ].map(t => (
                              <button key={t.id} onClick={() => {
                                setActiveModuleTab(t.id);
                                setCurrentLessonIndex(0); setCurrentExerciseIndex(0);
                                setCurrentQuizIndex(0); setModuleResults(null);
                                setQuizAnswers({}); setExerciseAnswers({});
                              }}
                                style={{
                                  flex:1,padding:"9px 14px",borderRadius:12,fontSize:12,fontWeight:700,
                                  background: activeModuleTab===t.id ? `${accent}18` : "transparent",
                                  color: activeModuleTab===t.id ? accent : C.dim,
                                  border: `1px solid ${activeModuleTab===t.id ? accent+"40" : "transparent"}`,
                                  cursor:"pointer",transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif",
                                }}>
                                {t.label}
                              </button>
                            ))}
                          </div>

                          <div style={{ padding:28 }}>

                            {/* ── LESSONS ── */}
                            {activeModuleTab==="lessons" && currentModule.lessons && (
                              <div>
                                <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:24 }}>
                                  {currentModule.lessons.map((l, li) => {
                                    const done = completedLessons.has(lessonKey(currentModule.title, l.title));
                                    return (
                                      <button key={li} onClick={() => setCurrentLessonIndex(li)}
                                        style={{
                                          padding:"5px 14px",borderRadius:99,fontSize:11,fontWeight:700,cursor:"pointer",
                                          background: li===currentLessonIndex ? `${accent}20` : done ? "rgba(29,181,132,0.08)" : "rgba(255,255,255,0.04)",
                                          color: li===currentLessonIndex ? accent : done ? C.teal : C.dim,
                                          border:`1px solid ${li===currentLessonIndex ? accent+"50" : done ? C.teal+"30" : C.border}`,
                                          transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif",
                                        }}>
                                        {done ? "✓ " : ""}{li+1}. {l.title.split(" — ").pop().slice(0,24)}{l.title.length>24?"…":""}
                                      </button>
                                    );
                                  })}
                                </div>

                                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12 }}>
                                  <div>
                                    <div style={{ fontSize:10,fontWeight:700,color:accent,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6,fontFamily:"'DM Sans',sans-serif" }}>
                                      Leçon {currentLessonIndex+1} / {currentModule.lessons.length}
                                    </div>
                                    <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:C.text,lineHeight:1.2 }}>
                                      {currentLesson?.title}
                                    </h3>
                                  </div>
                                  {currentLessonDone && (
                                    <div style={{
                                      display:"flex",alignItems:"center",gap:6,flexShrink:0,
                                      padding:"6px 14px",borderRadius:99,
                                      background:"rgba(29,181,132,0.12)",border:"1px solid rgba(29,181,132,0.3)",
                                      fontSize:11,fontWeight:700,color:C.teal,
                                    }}>
                                      <CheckCircle size={13}/> Terminée
                                    </div>
                                  )}
                                </div>

                                <div style={{ padding:24,borderRadius:16,marginBottom:20,background:"rgba(0,0,0,0.3)",border:`1px solid ${C.border}` }}>
                                  <LessonContent content={currentLesson?.content || ""} accent={accent}/>
                                </div>

                                <div style={{ marginBottom:20 }}>
                                  {currentLessonDone ? (
                                    <div style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 20px",borderRadius:14,background:"rgba(29,181,132,0.08)",border:"1px solid rgba(29,181,132,0.25)",color:C.teal,fontWeight:700,fontSize:13 }}>
                                      <CheckCircle size={18} color={C.teal}/> Leçon déjà enregistrée ✅
                                    </div>
                                  ) : (
                                    <motion.button whileHover={{ scale:1.015 }} whileTap={{ scale:0.98 }}
                                      onClick={handleMarkComplete} disabled={markingComplete}
                                      style={{ width:"100%",padding:"15px 20px",borderRadius:14,background:`linear-gradient(135deg,${accent},${accent}cc)`,color:"#fff",border:"none",fontWeight:900,fontSize:14,cursor:markingComplete?"not-allowed":"pointer",opacity:markingComplete?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'DM Sans',sans-serif",boxShadow:`0 4px 24px ${accent}40` }}>
                                      {markingComplete ? "⏳ Enregistrement..." : "✅ Leçon terminée — +10 XP"}
                                    </motion.button>
                                  )}
                                </div>

                                <div style={{ display:"flex",gap:10 }}>
                                  <button onClick={() => setCurrentLessonIndex(Math.max(0,currentLessonIndex-1))}
                                    disabled={currentLessonIndex===0}
                                    style={{ padding:"10px 22px",borderRadius:12,fontWeight:700,fontSize:12,background:"rgba(255,255,255,0.05)",color:C.muted,border:`1px solid ${C.border}`,cursor:currentLessonIndex===0?"not-allowed":"pointer",opacity:currentLessonIndex===0?0.4:1,fontFamily:"'DM Sans',sans-serif" }}>← Précédent</button>
                                  <button onClick={() => setCurrentLessonIndex(Math.min(currentModule.lessons.length-1,currentLessonIndex+1))}
                                    disabled={currentLessonIndex===currentModule.lessons.length-1}
                                    style={{ padding:"10px 22px",borderRadius:12,fontWeight:700,fontSize:12,background:`${accent}20`,color:accent,border:`1px solid ${accent}40`,cursor:currentLessonIndex===currentModule.lessons.length-1?"not-allowed":"pointer",opacity:currentLessonIndex===currentModule.lessons.length-1?0.4:1,fontFamily:"'DM Sans',sans-serif" }}>Suivant →</button>
                                </div>
                              </div>
                            )}

                            {/* ── EXERCISES ── */}
                            {activeModuleTab==="exercises" && currentModule.exercises && (
                              <div>
                                <div style={{ fontSize:10,fontWeight:700,color:accent,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16,fontFamily:"'DM Sans',sans-serif" }}>
                                  Question {currentExerciseIndex+1} / {currentModule.exercises.length}
                                </div>
                                <div style={{ padding:24,borderRadius:16,marginBottom:20,background:"rgba(0,0,0,0.3)",border:`1px solid ${C.border}` }}>
                                  <p style={{ fontSize:16,fontWeight:700,color:C.text,marginBottom:20,fontFamily:"'Cormorant Garamond',serif",lineHeight:1.4 }}>
                                    {currentModule.exercises[currentExerciseIndex].question}
                                  </p>
                                  <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                                    {currentModule.exercises[currentExerciseIndex].options.map((opt, idx) => {
                                      const selected = exerciseAnswers[currentExerciseIndex]===opt;
                                      return (
                                        <button key={idx} onClick={() => setExerciseAnswers({...exerciseAnswers,[currentExerciseIndex]:opt})}
                                          style={{ padding:"12px 18px",borderRadius:12,textAlign:"left",fontWeight:600,fontSize:13,background:selected?`${accent}15`:"rgba(255,255,255,0.03)",border:`1.5px solid ${selected?accent+"60":C.border}`,color:selected?accent:C.muted,cursor:"pointer",transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif" }}>
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {exerciseAnswers[currentExerciseIndex] && (
                                    <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }}
                                      style={{ marginTop:16,padding:"12px 18px",borderRadius:12,fontSize:13,fontWeight:700,background:exerciseAnswers[currentExerciseIndex]===currentModule.exercises[currentExerciseIndex].correctAnswer?"rgba(29,181,132,0.1)":"rgba(212,101,74,0.1)",border:`1px solid ${exerciseAnswers[currentExerciseIndex]===currentModule.exercises[currentExerciseIndex].correctAnswer?"rgba(29,181,132,0.3)":"rgba(212,101,74,0.3)"}`,color:exerciseAnswers[currentExerciseIndex]===currentModule.exercises[currentExerciseIndex].correctAnswer?C.teal:C.coral }}>
                                      {exerciseAnswers[currentExerciseIndex]===currentModule.exercises[currentExerciseIndex].correctAnswer?"✅ Excellent ! Bonne réponse.":`❌ Réponse correcte : ${currentModule.exercises[currentExerciseIndex].correctAnswer}`}
                                    </motion.div>
                                  )}
                                </div>
                                <div style={{ display:"flex",gap:10 }}>
                                  <button onClick={() => setCurrentExerciseIndex(Math.max(0,currentExerciseIndex-1))} disabled={currentExerciseIndex===0}
                                    style={{ padding:"10px 22px",borderRadius:12,fontWeight:700,fontSize:12,background:"rgba(255,255,255,0.05)",color:C.muted,border:`1px solid ${C.border}`,cursor:currentExerciseIndex===0?"not-allowed":"pointer",opacity:currentExerciseIndex===0?0.4:1,fontFamily:"'DM Sans',sans-serif" }}>← Précédent</button>
                                  <button onClick={() => setCurrentExerciseIndex(Math.min(currentModule.exercises.length-1,currentExerciseIndex+1))} disabled={currentExerciseIndex===currentModule.exercises.length-1}
                                    style={{ padding:"10px 22px",borderRadius:12,fontWeight:700,fontSize:12,background:`${accent}20`,color:accent,border:`1px solid ${accent}40`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Suivant →</button>
                                </div>
                              </div>
                            )}

                            {/* ── QUIZ ── */}
                            {activeModuleTab==="quiz" && currentModule.quiz && !moduleResults && (
                              <div>
                                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
                                  <div style={{ fontSize:10,fontWeight:700,color:accent,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>
                                    Évaluation {currentQuizIndex+1} / {currentModule.quiz.length}
                                  </div>
                                  <div style={{ fontSize:11,fontWeight:600,color:C.dim,fontFamily:"'DM Sans',sans-serif" }}>
                                    {Object.keys(quizAnswers).length}/{currentModule.quiz.length} répondues
                                  </div>
                                </div>
                                <div style={{ height:3,borderRadius:99,background:C.border,marginBottom:24,overflow:"hidden" }}>
                                  <div style={{ height:"100%",borderRadius:99,background:accent,width:`${(currentQuizIndex/currentModule.quiz.length)*100}%`,transition:"width 0.4s" }}/>
                                </div>
                                <div style={{ padding:24,borderRadius:16,marginBottom:20,background:"rgba(0,0,0,0.3)",border:`1px solid ${C.border}` }}>
                                  <p style={{ fontSize:17,fontWeight:700,color:C.text,marginBottom:20,fontFamily:"'Cormorant Garamond',serif",lineHeight:1.4 }}>
                                    {currentModule.quiz[currentQuizIndex].question}
                                  </p>
                                  <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                                    {currentModule.quiz[currentQuizIndex].options.map((opt, idx) => {
                                      const selected = quizAnswers[currentQuizIndex]===opt;
                                      return (
                                        <button key={idx} onClick={() => setQuizAnswers({...quizAnswers,[currentQuizIndex]:opt})}
                                          style={{ padding:"12px 18px",borderRadius:12,textAlign:"left",fontWeight:600,fontSize:13,background:selected?"rgba(79,173,212,0.1)":"rgba(255,255,255,0.03)",border:`1.5px solid ${selected?"#4fadd460":C.border}`,color:selected?"#4fadd4":C.muted,cursor:"pointer",transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif" }}>
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div style={{ display:"flex",gap:10 }}>
                                  <button onClick={() => setCurrentQuizIndex(Math.max(0,currentQuizIndex-1))} disabled={currentQuizIndex===0}
                                    style={{ padding:"10px 22px",borderRadius:12,fontWeight:700,fontSize:12,background:"rgba(255,255,255,0.05)",color:C.muted,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:currentQuizIndex===0?0.4:1 }}>← Précédent</button>
                                  {currentQuizIndex===currentModule.quiz.length-1 ? (
                                    <button onClick={() => { let correct=0; currentModule.quiz.forEach((q,i)=>{ if(quizAnswers[i]===q.correctAnswer) correct++; }); setModuleResults({ score:correct,total:currentModule.quiz.length }); }}
                                      disabled={Object.keys(quizAnswers).length<currentModule.quiz.length}
                                      style={{ padding:"10px 22px",borderRadius:12,fontWeight:700,fontSize:12,background:accent,color:"#fff",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:Object.keys(quizAnswers).length<currentModule.quiz.length?0.4:1 }}>
                                      Terminer ✓
                                    </button>
                                  ) : (
                                    <button onClick={() => setCurrentQuizIndex(currentQuizIndex+1)} disabled={!quizAnswers[currentQuizIndex]}
                                      style={{ padding:"10px 22px",borderRadius:12,fontWeight:700,fontSize:12,background:`${accent}20`,color:accent,border:`1px solid ${accent}40`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:!quizAnswers[currentQuizIndex]?0.4:1 }}>Suivant →</button>
                                  )}
                                </div>
                              </div>
                            )}

                            {activeModuleTab==="quiz" && moduleResults && (
                              <div style={{ textAlign:"center",padding:"32px 0" }}>
                                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:72,fontWeight:700,color:accent,lineHeight:1,marginBottom:8 }}>
                                  {Math.round((moduleResults.score/moduleResults.total)*100)}%
                                </div>
                                <p style={{ fontSize:18,fontWeight:700,color:C.text,marginBottom:6,fontFamily:"'Cormorant Garamond',serif" }}>
                                  {moduleResults.score} / {moduleResults.total} correctes
                                </p>
                                <p style={{ fontSize:13,color:C.muted,marginBottom:28,fontWeight:300 }}>
                                  {moduleResults.score===moduleResults.total?"🌟 Module maîtrisé !":moduleResults.score>=moduleResults.total*0.7?"👏 Très bien !":"📚 Continuez à pratiquer !"}
                                </p>
                                <button onClick={() => {setCurrentQuizIndex(0);setQuizAnswers({});setModuleResults(null);}}
                                  style={{ padding:"12px 28px",borderRadius:14,fontWeight:700,fontSize:13,background:accent,color:"#fff",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                                  Recommencer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ padding:40,textAlign:"center",color:C.muted,background:C.card,borderRadius:20,border:`1px solid ${C.border}` }}>
                        <BookOpen size={40} style={{ color:accent,marginBottom:16,opacity:0.5 }}/>
                        <p style={{ fontSize:15,fontWeight:300 }}>Sélectionnez un module dans le panneau de droite pour commencer.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ───── VOCABULARY TAB ───── */}
                {activeTab==="vocab" && (
                  <div>
                    <div style={{ marginBottom:24 }}>
                      <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.text,marginBottom:6 }}>Vocabulaire du cours</h2>
                      <p style={{ fontSize:13,color:C.muted,fontWeight:300 }}>Cliquez sur le bouton son pour écouter la prononciation.</p>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16 }}>
                      {course.vocabulary.map((item, i) => (
                        <motion.div key={i} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.4,delay:i*0.06 }}
                          style={{ padding:20,borderRadius:20,background:C.card,border:`1px solid ${C.border}`,position:"relative",overflow:"hidden" }}>
                          <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${accent},transparent)` }}/>
                          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
                            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:C.text,direction:"rtl",lineHeight:1,fontWeight:700 }}>{item.ar}</div>
                            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.95 }} onClick={() => speak(item.ar)}
                              style={{ padding:"9px",borderRadius:12,background:`${accent}15`,border:`1px solid ${accent}30`,color:accent,cursor:"pointer",flexShrink:0 }}>
                              <Volume2 size={16}/>
                            </motion.button>
                          </div>
                          <div style={{ fontSize:14,fontWeight:700,color:accent,marginBottom:6,fontFamily:"'DM Sans',sans-serif" }}>{item.tr}</div>
                          <div style={{ fontSize:12,color:C.dim,fontFamily:"'DM Sans',sans-serif",fontWeight:300,lineHeight:1.6 }}>🇫🇷 {item.fr} &nbsp;·&nbsp; 🇬🇧 {item.en}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ───── LETTRES TAB ───── */}
                {activeTab==="lettres" && (
                  <div>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12 }}>
                      <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.text }}>Les 28 Lettres Arabes</h2>
                      <div style={{ display:"flex",gap:6 }}>
                        {[{code:"ar",label:"🇸🇦 AR",col:"#ef4444"},{code:"fr",label:"🇫🇷 FR",col:C.blue},{code:"en",label:"🇬🇧 EN",col:C.gold}].map(l=>(
                          <button key={l.code} onClick={()=>setLetterLang(l.code)}
                            style={{ padding:"6px 14px",borderRadius:99,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:letterLang===l.code?`${l.col}20`:"rgba(255,255,255,0.04)",color:letterLang===l.code?l.col:C.dim,border:`1px solid ${letterLang===l.code?l.col+"40":C.border}` }}>
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:12 }}>
                      {ARABIC_LETTERS.map((item, i) => (
                        <motion.div key={i} initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} transition={{ duration:0.3,delay:i*0.025 }} whileHover={{ y:-4,borderColor:C.gold+"60" }}
                          style={{ padding:"16px 12px",borderRadius:16,textAlign:"center",background:C.card,border:`1px solid ${C.border}`,cursor:"pointer",position:"relative",overflow:"hidden" }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:42,color:C.text,marginBottom:6,lineHeight:1 }}>{item.letter}</div>
                          <div style={{ fontSize:11,fontWeight:700,color:C.text,marginBottom:4,fontFamily:"'DM Sans',sans-serif" }}>{item.name}</div>
                          <div style={{ fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:99,marginBottom:8,display:"inline-block",background:letterLang==="ar"?"rgba(239,68,68,0.1)":letterLang==="fr"?"rgba(79,173,212,0.1)":"rgba(201,168,76,0.1)",color:letterLang==="ar"?"#ef4444":letterLang==="fr"?C.blue:C.gold }}>
                            {letterLang==="ar"?item.ar:letterLang==="fr"?item.fr:item.en}
                          </div>
                          <div style={{ fontSize:10,fontFamily:"monospace",color:C.dim,marginBottom:10 }}>{item.transcription}</div>
                          <div style={{ display:"flex",gap:3,justifyContent:"center" }}>
                            {[{l:"ar-SA",label:"AR",c:"#ef4444"},{l:"fr-FR",label:"FR",c:C.blue},{l:"en-US",label:"EN",c:C.gold}].map(lng=>(
                              <button key={lng.label} onClick={()=>speak(lng.label==="AR"?item.letter:lng.label==="FR"?item.fr:item.en,lng.l)}
                                style={{ padding:"2px 7px",borderRadius:6,fontSize:8,fontWeight:700,color:"#fff",background:lng.c,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                                {lng.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ───── TRADUCTEUR TAB ───── */}
                {activeTab==="traducteur" && (
                  <div>
                    <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.text,marginBottom:6 }}>Traducteur & Phonétique</h2>
                    <p style={{ fontSize:13,color:C.muted,fontWeight:300,marginBottom:24 }}>Tapez un mot pour obtenir sa traduction arabe et sa prononciation.</p>
                    <div style={{ display:"flex",gap:8,marginBottom:20 }}>
                      {[{code:"english",label:"🇬🇧 English"},{code:"french",label:"🇫🇷 Français"}].map(l=>(
                        <button key={l.code} onClick={()=>{setDictSearchLanguage(l.code);setDictResults(null);setDictSearchTerm("");}}
                          style={{ padding:"8px 18px",borderRadius:12,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:dictSearchLanguage===l.code?`${accent}20`:"rgba(255,255,255,0.04)",color:dictSearchLanguage===l.code?accent:C.dim,border:`1px solid ${dictSearchLanguage===l.code?accent+"40":C.border}` }}>
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={handleDictSearch} style={{ display:"flex",gap:12,marginBottom:20 }}>
                      <div style={{ position:"relative",flex:1 }}>
                        <Search size={16} style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.dim }}/>
                        <input type="text" value={dictSearchTerm} onChange={e=>setDictSearchTerm(e.target.value)}
                          placeholder={dictSearchLanguage==="english"?"Ex: peace, hello, book...":"Ex: paix, bonjour, livre..."}
                          style={{ width:"100%",paddingLeft:44,paddingRight:16,paddingTop:13,paddingBottom:13,borderRadius:14,fontSize:13,color:C.text,background:C.card,border:`1px solid ${C.border}`,outline:"none",fontFamily:"'DM Sans',sans-serif" }}
                          onFocus={e=>e.target.style.borderColor=accent+"60"}
                          onBlur={e=>e.target.style.borderColor=C.border}/>
                      </div>
                      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} type="submit" disabled={dictLoading}
                        style={{ padding:"12px 24px",borderRadius:14,fontWeight:700,fontSize:13,background:accent,color:"#fff",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:dictLoading?0.7:1 }}>
                        {dictLoading?"...":"Traduire"}
                      </motion.button>
                    </form>
                    {dictError && <div style={{ padding:16,borderRadius:14,fontSize:13,fontWeight:600,marginBottom:16,background:"rgba(212,101,74,0.1)",border:"1px solid rgba(212,101,74,0.3)",color:C.coral }}>{dictError}</div>}
                    {dictResults ? (
                      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                        style={{ padding:28,borderRadius:20,background:C.card,border:`1px solid ${accent}30`,position:"relative",overflow:"hidden" }}>
                        <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${accent},${C.teal})` }}/>
                        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:64,color:C.text,fontWeight:700,direction:"rtl",lineHeight:1 }}>{dictResults.arabic}</div>
                          <motion.button whileHover={{scale:1.1}} onClick={()=>speak(dictResults.arabic)}
                            style={{ padding:14,borderRadius:16,background:`${accent}15`,border:`1px solid ${accent}30`,color:accent,cursor:"pointer" }}>
                            <Volume2 size={24}/>
                          </motion.button>
                        </div>
                        <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:16 }}>
                          <div style={{ fontSize:10,fontWeight:700,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6,fontFamily:"'DM Sans',sans-serif" }}>Prononciation</div>
                          <p style={{ fontSize:18,fontWeight:700,fontStyle:"italic",color:accent,fontFamily:"'Cormorant Garamond',serif" }}>{dictResults.pronunciation}</p>
                        </div>
                      </motion.div>
                    ) : !dictLoading && !dictError && (
                      <div style={{ textAlign:"center",padding:"48px 24px",borderRadius:20,background:C.card,border:`1px dashed ${C.border}` }}>
                        <Globe size={40} style={{ color:C.dim,marginBottom:12 }}/>
                        <p style={{ fontSize:13,color:C.dim,fontWeight:300 }}>Entrez un mot pour voir sa traduction ✨</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ───── QUIZ LETTRES TAB ───── */}
                {activeTab==="quiz" && (
                  <div>
                    {quizResult!=="finished" ? (
                      <div>
                        <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.text,marginBottom:6 }}>Quiz d'Écriture</h2>
                        <p style={{ fontSize:13,color:C.muted,fontWeight:300,marginBottom:24 }}>Écoutez la lettre et écrivez son caractère arabe.</p>
                        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
                          <span style={{ fontSize:12,fontWeight:700,color:C.dim,fontFamily:"'DM Sans',sans-serif" }}>Lettre {quizIndex+1} / {ARABIC_LETTERS.length}</span>
                          <span style={{ fontSize:12,fontWeight:700,color:accent,fontFamily:"'DM Sans',sans-serif" }}>{quizScore} correct</span>
                        </div>
                        <div style={{ height:4,borderRadius:99,background:C.border,marginBottom:28,overflow:"hidden" }}>
                          <motion.div animate={{ width:`${(quizIndex/ARABIC_LETTERS.length)*100}%` }}
                            style={{ height:"100%",borderRadius:99,background:`linear-gradient(90deg,${C.teal},${accent})` }}/>
                        </div>
                        <div style={{ padding:32,borderRadius:24,textAlign:"center",marginBottom:20,background:C.card,border:`1px solid ${C.border}` }}>
                          <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}}
                            onClick={()=>speak(ARABIC_LETTERS[quizIndex].letter,"ar-SA")}
                            style={{ display:"inline-flex",alignItems:"center",gap:10,padding:"14px 32px",borderRadius:16,fontWeight:700,fontSize:16,color:"#fff",background:accent,border:"none",cursor:"pointer",marginBottom:20,fontFamily:"'DM Sans',sans-serif",boxShadow:`0 4px 20px ${accent}40` }}>
                            <Volume2 size={20}/> Écouter
                          </motion.button>
                          <div style={{ fontSize:14,fontWeight:600,color:C.muted,marginBottom:24,fontFamily:"'DM Sans',sans-serif" }}>
                            Nom : <strong style={{color:C.text}}>{ARABIC_LETTERS[quizIndex].name}</strong>
                            {" · "}Transcription : <strong style={{color:C.text,fontFamily:"monospace"}}>{ARABIC_LETTERS[quizIndex].transcription}</strong>
                          </div>
                          <input type="text" value={userAnswer} onChange={e=>setUserAnswer(e.target.value)}
                            onKeyDown={e=>{if(e.key==="Enter"&&!quizResult) checkAnswer();}}
                            placeholder="Écrivez la lettre ici..."
                            style={{ width:"100%",padding:"20px",fontSize:48,textAlign:"center",borderRadius:18,fontFamily:"serif",direction:"rtl",color:C.text,background:"rgba(0,0,0,0.4)",border:`2px solid ${quizResult?(quizResult==="correct"?C.teal:C.coral):C.border}`,outline:"none",marginBottom:20 }}/>
                          <AnimatePresence>
                            {quizResult && quizResult!=="finished" && (
                              <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                                style={{ padding:14,borderRadius:14,marginBottom:16,fontSize:13,fontWeight:700,background:quizResult==="correct"?"rgba(29,181,132,0.1)":"rgba(212,101,74,0.1)",border:`1px solid ${quizResult==="correct"?"rgba(29,181,132,0.3)":"rgba(212,101,74,0.3)"}`,color:quizResult==="correct"?C.teal:C.coral,fontFamily:"'DM Sans',sans-serif" }}>
                                {quizResult==="correct"?`✅ Bravo ! La lettre est ${ARABIC_LETTERS[quizIndex].letter}`:`❌ La bonne réponse est : ${ARABIC_LETTERS[quizIndex].letter}`}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                            {!quizResult && (
                              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                                onClick={checkAnswer} disabled={!userAnswer.trim()}
                                style={{ padding:"11px 28px",borderRadius:12,fontWeight:700,fontSize:13,background:accent,color:"#fff",border:"none",cursor:"pointer",opacity:!userAnswer.trim()?0.4:1,fontFamily:"'DM Sans',sans-serif" }}>
                                Vérifier
                              </motion.button>
                            )}
                            {quizResult && (
                              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                                onClick={()=>{
                                  if(quizIndex<ARABIC_LETTERS.length-1){setQuizIndex(i=>i+1);setUserAnswer("");setQuizResult(null);}
                                  else setQuizResult("finished");
                                }}
                                style={{ padding:"11px 28px",borderRadius:12,fontWeight:700,fontSize:13,background:accent,color:"#fff",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                                {quizIndex<ARABIC_LETTERS.length-1?"Suivant →":"Terminer"}
                              </motion.button>
                            )}
                            <button onClick={()=>{setQuizIndex(0);setUserAnswer("");setQuizResult(null);setQuizScore(0);}}
                              style={{ padding:"11px 22px",borderRadius:12,fontWeight:700,fontSize:13,background:"rgba(255,255,255,0.05)",color:C.muted,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign:"center",padding:"48px 24px" }}>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:80,fontWeight:700,color:accent,lineHeight:1,marginBottom:8 }}>
                          {Math.round((quizScore/ARABIC_LETTERS.length)*100)}%
                        </div>
                        <p style={{ fontSize:22,fontWeight:700,color:C.text,marginBottom:8,fontFamily:"'Cormorant Garamond',serif" }}>{quizScore} / {ARABIC_LETTERS.length}</p>
                        <p style={{ fontSize:13,color:C.muted,marginBottom:28,fontWeight:300 }}>
                          {quizScore===ARABIC_LETTERS.length?"🌟 Alphabet maîtrisé !":quizScore>=ARABIC_LETTERS.length*0.8?"👏 Excellent !":"📚 Continuez à pratiquer !"}
                        </p>
                        <button onClick={()=>{setQuizIndex(0);setUserAnswer("");setQuizResult(null);setQuizScore(0);}}
                          style={{ padding:"14px 36px",borderRadius:16,fontWeight:700,fontSize:14,background:accent,color:"#fff",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:`0 4px 20px ${accent}40` }}>
                          Recommencer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ════════════════ SIDEBAR ════════════════ */}
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>

            {/* Progress card */}
            <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5,delay:0.1 }}
              style={{ borderRadius:20,background:C.card,border:`1px solid ${C.border}`,padding:20,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${accent},${C.teal})` }}/>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
                <BarChart2 size={16} style={{ color:accent }}/>
                <span style={{ fontSize:11,fontWeight:700,color:accent,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>Progression</span>
              </div>
              <div style={{ textAlign:"center",marginBottom:16 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:700,color:accent,lineHeight:1 }}>{progressPct}%</div>
                <div style={{ fontSize:12,color:C.dim,fontWeight:300,fontFamily:"'DM Sans',sans-serif" }}>{completedCount} / {totalLessons} leçons</div>
              </div>
              <div style={{ height:6,borderRadius:99,background:C.border,overflow:"hidden" }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${progressPct}%` }} transition={{ duration:1,delay:0.3,ease:[.22,.68,0,1] }}
                  style={{ height:"100%",borderRadius:99,background:`linear-gradient(90deg,${accent},${C.teal})` }}/>
              </div>
            </motion.div>

            {/* Module list */}
            {hasModules && (
              <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5,delay:0.15 }}
                style={{ borderRadius:20,background:C.card,border:`1px solid ${C.border}`,overflow:"hidden" }}>
                <div style={{ padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <Layers size={15} style={{ color:accent }}/>
                    <span style={{ fontSize:11,fontWeight:700,color:accent,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>Programme</span>
                  </div>
                  <span style={{ fontSize:10,color:C.dim,fontFamily:"'DM Sans',sans-serif",fontWeight:600 }}>{course.modules.length} modules</span>
                </div>
                <div style={{ maxHeight:480,overflowY:"auto",padding:"8px 0" }}>
                  {course.modules.map((mod, i) => {
                    const isActive = selectedModule===i;
                    const isDone   = isModuleComplete(mod);
                    return (
                      <motion.button key={i} whileHover={{ x:2 }}
                        onClick={() => { setSelectedModule(i); setActiveTab("about"); setActiveModuleTab("lessons"); setCurrentLessonIndex(0); setModuleResults(null); setQuizAnswers({}); setExerciseAnswers({}); }}
                        style={{ width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 20px",textAlign:"left",background:"transparent",border:"none",cursor:"pointer",transition:"background 0.2s",borderLeft:`3px solid ${isActive?accent:"transparent"}`,backgroundColor:isActive?`${accent}08`:"transparent" }}>
                        <div style={{ width:30,height:30,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:isActive?accent:isDone?`${C.teal}20`:"rgba(255,255,255,0.05)",fontSize:11,fontWeight:800,color:isActive?"#fff":isDone?C.teal:C.dim,fontFamily:"'DM Sans',sans-serif",border:`1px solid ${isActive?accent:isDone?C.teal+"30":C.border}` }}>
                          {isDone?"✓":String(i+1).padStart(2,"0")}
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontSize:12,fontWeight:600,color:isActive?C.text:C.muted,lineHeight:1.3,fontFamily:"'DM Sans',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                            {mod.title.replace(/^Module \d+ — /,"")}
                          </div>
                          {mod.lessons && (
                            <div style={{ fontSize:10,color:C.dim,marginTop:2,fontFamily:"'DM Sans',sans-serif",fontWeight:300 }}>
                              {mod.lessons.length} leçon{mod.lessons.length>1?"s":""}{" · "}{mod.exercises?.length||0} exercices
                            </div>
                          )}
                        </div>
                        {isDone?<CheckCircle size={14} style={{ color:C.teal,flexShrink:0 }}/>:<ChevronRight size={14} style={{ color:C.dim,flexShrink:0 }}/>}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Instructor card */}
            <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5,delay:0.2 }}
              style={{ borderRadius:20,background:C.card,border:`1px solid ${C.border}`,padding:20 }}>
              <div style={{ fontSize:10,fontWeight:700,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14,fontFamily:"'DM Sans',sans-serif" }}>Instructeur</div>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
                <div style={{ width:44,height:44,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff",flexShrink:0,background:`linear-gradient(135deg,${accent},${accent}aa)`,boxShadow:`0 4px 16px ${accent}40` }}>
                  {course.instructor.charAt(course.instructor.length-1)}
                </div>
                <div>
                  <div style={{ fontSize:14,fontWeight:700,color:C.text,fontFamily:"'Cormorant Garamond',serif" }}>{course.instructor}</div>
                  <div style={{ fontSize:11,color:C.dim,fontWeight:300,fontFamily:"'DM Sans',sans-serif",marginTop:2 }}>{course.instructorRole}</div>
                </div>
              </div>
              <div style={{ display:"flex",gap:16 }}>
                <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:700,color:C.gold,fontFamily:"'DM Sans',sans-serif" }}>
                  <Star size={12} style={{ fill:C.gold }}/>{course.rating}
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.dim,fontFamily:"'DM Sans',sans-serif",fontWeight:300 }}>
                  <Users size={12}/>{course.students} étudiants
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.dim,fontFamily:"'DM Sans',sans-serif",fontWeight:300 }}>
                  <Clock size={12}/>{course.duration}
                </div>
              </div>
            </motion.div>

            {/* Includes */}
            <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.5,delay:0.3 }}
              style={{ borderRadius:20,background:C.card,border:`1px solid ${C.border}`,padding:20 }}>
              <div style={{ fontSize:10,fontWeight:700,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14,fontFamily:"'DM Sans',sans-serif" }}>Ce cours inclut</div>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {[
                  { icon:<Play size={14}/>,    label:`${course.duration} de contenu vidéo` },
                  { icon:<BookOpen size={14}/>, label:"Exercices interactifs" },
                  { icon:<Target size={14}/>,   label:"Quiz d'évaluation" },
                  { icon:<Award size={14}/>,    label:"Certificat de réussite" },
                  { icon:<Globe size={14}/>,    label:"Accès à vie" },
                  { icon:<Zap size={14}/>,      label:"Tuteur IA inclus" },
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontSize:12,color:C.muted,fontFamily:"'DM Sans',sans-serif",fontWeight:300 }}>
                    <span style={{ color:accent,flexShrink:0 }}>{item.icon}</span>{item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}