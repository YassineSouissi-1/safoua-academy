import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Volume2, Globe, CheckCircle, BookOpen,
  ChevronRight, Headphones, Search, Play, Star,
  Clock, Users, Award, ChevronDown, ChevronUp, Zap
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000";

const ARABIC_LETTERS = [
  { letter: "ا", name: "Alif",  transcription: "A",  ar: "ألف",  fr: "Alef", en: "Aleph" },
  { letter: "ب", name: "Ba",    transcription: "B",  ar: "با",   fr: "Ba",   en: "Ba" },
  { letter: "ت", name: "Ta",    transcription: "T",  ar: "تا",   fr: "Ta",   en: "Ta" },
  { letter: "ث", name: "Tha",   transcription: "Th", ar: "ثا",   fr: "Tha",  en: "Tha" },
  { letter: "ج", name: "Jim",   transcription: "J",  ar: "جيم",  fr: "Jim",  en: "Jim" },
  { letter: "ح", name: "Ha",    transcription: "H",  ar: "حا",   fr: "Ha",   en: "Ha" },
  { letter: "خ", name: "Kha",   transcription: "Kh", ar: "خا",   fr: "Kha",  en: "Kha" },
  { letter: "د", name: "Dal",   transcription: "D",  ar: "دال",  fr: "Dal",  en: "Dal" },
  { letter: "ذ", name: "Dhal",  transcription: "Dh", ar: "ذال",  fr: "Dhal", en: "Dhal" },
  { letter: "ر", name: "Ra",    transcription: "R",  ar: "را",   fr: "Ra",   en: "Ra" },
  { letter: "ز", name: "Zay",   transcription: "Z",  ar: "زاي",  fr: "Zaï",  en: "Zay" },
  { letter: "س", name: "Sin",   transcription: "S",  ar: "سين",  fr: "Sin",  en: "Sin" },
  { letter: "ش", name: "Shin",  transcription: "Sh", ar: "شين",  fr: "Shin", en: "Shin" },
  { letter: "ص", name: "Sad",   transcription: "S̈",  ar: "صاد",  fr: "Sad",  en: "Sad" },
  { letter: "ض", name: "Dad",   transcription: "D̈",  ar: "ضاد",  fr: "Dad",  en: "Dad" },
  { letter: "ط", name: "Ta'",   transcription: "Ṭ",  ar: "طا",   fr: "Ta emphatic", en: "Ta" },
  { letter: "ظ", name: "Dha'",  transcription: "Ẓ",  ar: "ظا",   fr: "Dha emphatic", en: "Dha" },
  { letter: "ع", name: "Ayn",   transcription: "ʿ",  ar: "عين",  fr: "Ayn",  en: "Ayn" },
  { letter: "غ", name: "Ghayn", transcription: "Gh", ar: "غين",  fr: "Ghayn", en: "Ghayn" },
  { letter: "ف", name: "Fa",    transcription: "F",  ar: "فا",   fr: "Fa",   en: "Fa" },
  { letter: "ق", name: "Qaf",   transcription: "Q",  ar: "قاف",  fr: "Qaf",  en: "Qaf" },
  { letter: "ك", name: "Kaf",   transcription: "K",  ar: "كاف",  fr: "Kaf",  en: "Kaf" },
  { letter: "ل", name: "Lam",   transcription: "L",  ar: "لام",  fr: "Lam",  en: "Lam" },
  { letter: "م", name: "Meem",  transcription: "M",  ar: "ميم",  fr: "Meem", en: "Meem" },
  { letter: "ن", name: "Nun",   transcription: "N",  ar: "نون",  fr: "Noun", en: "Nun" },
  { letter: "ه", name: "Ha",    transcription: "H",  ar: "ها",   fr: "Ha",   en: "Ha" },
  { letter: "و", name: "Waw",   transcription: "W",  ar: "واو",  fr: "Waw",  en: "Waw" },
  { letter: "ي", name: "Ya",    transcription: "Y",  ar: "يا",   fr: "Ya",   en: "Ya" },
];

const COURS_DATA = [
  {
    id: 1,
    title: "Alphabet Arabe & Phonétique",
    category: "Arabe", level: "Débutant", duration: "10h", rating: 4.9, students: "1.2k",
    instructor: "Pr. Yassine", accent: "#10b981",
    image: "https://images.unsplash.com/photo-1584281723509-a16997486420?auto=format&fit=crop&w=800&q=80",
    tags: ["Écriture", "Oral"],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Dans cette leçon, nous explorons la forme des lettres selon leur position dans le mot (début, milieu, fin) et l'importance des points de sortie (Makharij). Vous apprendrez à reconnaître et à prononcer correctement chaque lettre de l'alphabet arabe.",
    modules: [
      {
        title: "Module 1 : Fondamentaux de l'Arabe",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        lessons: [
          { title: "Histoire de la langue arabe", content: "L'arabe est une langue sémitique parlée par plus de 400 millions de personnes. Langue du Coran, elle est la clé de la communication dans le monde islamique. L'arabe classique (Fusha) est la forme standard utilisée dans les textes formels, tandis que les dialectes varient selon les régions." },
          { title: "L'Alphabet Arabe — 28 Lettres", content: "L'alphabet arabe contient 28 lettres et se lit de droite à gauche. Contrairement au français, l'arabe n'a pas de majuscules. Les lettres changent de forme selon leur position dans le mot : initiale, médiale, finale, ou isolée." },
          { title: "Fusha vs Dialectes", content: "Fusha (l'arabe classique) est utilisé dans le Coran, la littérature et les médias formels. Les dialectes arabes sont parlés au quotidien mais varient d'une région à l'autre. Ce cours se concentre exclusivement sur le Fusha." }
        ],
        exercises: [
          { question: "Combien de lettres y a-t-il dans l'alphabet arabe?", options: ["24","26","28","30"], correctAnswer: "28" },
          { question: "Dans quel sens lit-on l'arabe?", options: ["Gauche à droite","Droite à gauche","Haut en bas","Variable"], correctAnswer: "Droite à gauche" }
        ],
        quiz: [
          { question: "L'arabe classique s'appelle :", options: ["Fusha","Darija","Levantin","Ammiya"], correctAnswer: "Fusha" },
          { question: "Combien de personnes parlent l'arabe ?", options: ["100 millions","300 millions","Plus de 400 millions","600 millions"], correctAnswer: "Plus de 400 millions" }
        ]
      },
      {
        title: "Module 2 : Les Groupes de Lettres",
        videoUrl: "https://www.youtube.com/embed/RQd5DGlnIWE",
        lessons: [
          { title: "Les Lettres Dentales", content: "Les lettres dentales (ب, ت, ث) sont produites avec les dents. Ba (ب) est un son [b], Ta (ت) est [t], et Tha (ث) est le 'th' anglais. Ces lettres se connectent à d'autres lettres dans le mot." },
          { title: "Les Lettres Gutturales", content: "Les lettres gutturales (ج, ح, خ) proviennent du fond de la gorge. Jim (ج) ressemble au 'j' français, Ha (ح) est un souffle léger, et Kha (خ) est le son 'kh' guttural." },
          { title: "Autres groupes phonétiques", content: "Les lettres liquides (د, ذ, ر, ز), les sifflantes (س, ش, ص, ض) et les emphatiques (ط, ظ, ع, غ) forment des groupes avec des caractéristiques phonétiques distinctes." }
        ],
        exercises: [
          { question: "Le son de la lettre Ba (ب) est :", options: ["[p]","[b]","[m]","[f]"], correctAnswer: "[b]" },
          { question: "Jim (ج) ressemble au son :", options: ["ch allemand","j français","th anglais","z"], correctAnswer: "j français" }
        ],
        quiz: [
          { question: "Les lettres (ب, ت, ث) appartiennent à quel groupe ?", options: ["Gutturales","Dentales","Liquides","Sifflantes"], correctAnswer: "Dentales" },
          { question: "Ha (ح) est un son de type :", options: ["Labial","Léger de gorge","Dur guttural","Nasal"], correctAnswer: "Léger de gorge" }
        ]
      },
      {
        title: "Module 3 : Formes des Lettres",
        videoUrl: "https://www.youtube.com/embed/tYzMGcUty6s",
        lessons: [
          { title: "Les 4 Positions des Lettres", content: "Chaque lettre arabe a jusqu'à 4 formes : initiale (début du mot), médiale (milieu), finale (fin) et isolée (seule). Exemple: ب en début = بـ, au milieu = ـبـ, à la fin = ـب." },
          { title: "Les Lettres Non-Connectantes", content: "Certaines lettres ne se connectent pas à la suivante : Alif (ا), Dal (د), Dhal (ذ), Ra (ر), Zay (ز), et Waw (و). Elles ne se connectent qu'à la lettre précédente." },
          { title: "Pratique de l'Écriture", content: "L'écriture va de droite à gauche. Pratiquez en écrivant les lettres dans leurs quatre positions. Comparez avec les formes imprimées pour améliorer votre reconnaissance visuelle." }
        ],
        exercises: [
          { question: "Combien de formes peut avoir une lettre arabe ?", options: ["1","2","3","Jusqu'à 4"], correctAnswer: "Jusqu'à 4" },
          { question: "Le Dal (د) se connecte-t-il à la lettre suivante ?", options: ["Oui","Non","Parfois","Seulement au début"], correctAnswer: "Non" }
        ],
        quiz: [
          { question: "Dans quel sens écrit-on l'arabe ?", options: ["Gauche à droite","Droite à gauche","Haut en bas","Variable"], correctAnswer: "Droite à gauche" },
          { question: "Quelle lettre NE se connecte PAS à la suivante ?", options: ["Ba (ب)","Alif (ا)","Ta (ت)","Sin (س)"], correctAnswer: "Alif (ا)" }
        ]
      },
      {
        title: "Module 4 : Phonétique & Voyelles",
        videoUrl: "https://www.youtube.com/embed/BRVSO11M_3U",
        lessons: [
          { title: "Les Voyelles Courtes", content: "Il existe 3 voyelles courtes en arabe: Fatha (َ) produit [a], Kasra (ِ) produit [i], et Damma (ُ) produit [u]. Ces diacritiques se placent au-dessus ou au-dessous des consonnes." },
          { title: "Les Voyelles Longues", content: "Les voyelles longues sont: Alif (ا) = [aa], Waw (و) = [oo], Ya (ي) = [ii]. Elles durent deux fois plus longtemps. Exemple: قال (qaal) = 'il a dit'." },
          { title: "Sukun & Shadda", content: "Le Sukun (ْ) indique l'absence de voyelle. Le Shadda (ّ) indique le doublement d'une lettre. Ces diacritiques sont essentiels pour une prononciation précise." }
        ],
        exercises: [
          { question: "Le Fatha (َ) produit quel son ?", options: ["[i]","[u]","[a]","[o]"], correctAnswer: "[a]" },
          { question: "Laquelle est une voyelle longue ?", options: ["Fatha","Kasra","Alif (ا)","Sukun"], correctAnswer: "Alif (ا)" }
        ],
        quiz: [
          { question: "Combien de voyelles courtes y a-t-il en arabe ?", options: ["2","3","4","5"], correctAnswer: "3" },
          { question: "Le Sukun (ْ) signifie :", options: ["Double lettre","Absence de voyelle","Voyelle longue","Aspiration"], correctAnswer: "Absence de voyelle" }
        ]
      },
      {
        title: "Module 5 : Makharij — Points d'Articulation",
        videoUrl: "https://www.youtube.com/embed/aJG9CKR8aYE",
        lessons: [
          { title: "Les Lettres Laryngales", content: "Les lettres laryngales (Hamza ء, Ha ه, Ha ح) sont produites dans la gorge. Hamza est l'arrêt glottal, Ha est un souffle léger, et Ha emphatique est un souffle plus forcé." },
          { title: "Les Lettres Pharyngales", content: "Les pharyngales (Ain ع, Ghain غ) proviennent profondément de la gorge. Ain est un son guttural caractéristique de l'arabe, Ghain ressemble au 'r' guttural français." },
          { title: "Tableau des Makharij", content: "Les points d'articulation incluent les dents (dentales), le palais (palatales), les lèvres (labiales) et zones de la gorge. Chaque zone produit des sons distincts irremplaçables." }
        ],
        exercises: [
          { question: "Ayn (ع) est produite :", options: ["Sur les dents","Dans la gorge","Sur le palais","Avec les lèvres"], correctAnswer: "Dans la gorge" },
          { question: "Quelle lettre représente l'arrêt glottal ?", options: ["ه","ح","ء","ع"], correctAnswer: "ء" }
        ],
        quiz: [
          { question: "Les lettres ح et ه sont de type :", options: ["Pharyngales","Laryngales","Dentales","Labiales"], correctAnswer: "Laryngales" },
          { question: "Ghain (غ) ressemble à :", options: ["r doux français","r guttural français","g dur","j français"], correctAnswer: "r guttural français" }
        ]
      },
      {
        title: "Module 6 : Construction de Mots",
        videoUrl: "https://www.youtube.com/embed/5Vw8YJJz9FY",
        lessons: [
          { title: "Le Système Trilitère", content: "La plupart des mots arabes sont basés sur des racines de 3 lettres. La racine K-T-B (كتب) signifie 'écrire' et produit: Kitab (livre), Kataba (il a écrit), Katibi (mon secrétaire). Ce système est la clé de la langue arabe." },
          { title: "Consonnes et Voyelles Combinées", content: "En ajoutant différentes voyelles à une racine, on obtient de nouveaux mots. Racine D-R-S (درس) = étudier → Darasa (il a étudié), Dars (leçon), Mudaris (enseignant)." },
          { title: "Lecture de Mots Simples", content: "Les syllabes arabes : CV = BA, CVC = BAT. Pratiquez: مدرسة (école), كتاب (livre), قلم (stylo), بيت (maison). La répétition est la clé de la maîtrise." }
        ],
        exercises: [
          { question: "La racine K-T-B signifie :", options: ["Manger","Écrire","Lire","Parler"], correctAnswer: "Écrire" },
          { question: "Combien de lettres a une racine trilitère ?", options: ["1","2","3","4"], correctAnswer: "3" }
        ],
        quiz: [
          { question: "كتب (Kataba) signifie :", options: ["Un livre","Il a écrit","L'écriture","L'auteur"], correctAnswer: "Il a écrit" },
          { question: "مدرس (Mudaris) signifie :", options: ["L'école","L'étudiant","L'enseignant","La leçon"], correctAnswer: "L'enseignant" }
        ]
      },
      {
        title: "Module 7 : Révision & Évaluation Finale",
        videoUrl: "https://www.youtube.com/embed/tYzMGcUty6s",
        lessons: [
          { title: "Révision de l'Alphabet", content: "Récapitulez les 28 lettres arabes, leurs formes dans les 4 positions et leurs sons. Assurez-vous de pouvoir reconnaître et prononcer chaque lettre correctement sans aide." },
          { title: "Révision des Groupes Phonétiques", content: "Récapitulez les groupes de lettres (dentales, gutturales, liquides, sifflantes, emphatiques). Pratiquez la prononciation de chaque groupe et identifiez leurs différences subtiles." },
          { title: "Lecture de Phrases Simples", content: "Lisez et prononcez des phrases arabes simples combinant vocabulaire et grammaire. Comparez avec des locuteurs natifs et continuez à pratiquer quotidiennement." }
        ],
        exercises: [
          { question: "L'alphabet arabe va de :", options: ["Alif à Waw","Alif à Ya","Ba à Ya","Alif à Zay"], correctAnswer: "Alif à Ya" },
          { question: "Le point d'articulation de Ayn (ع) est :", options: ["Les dents","La gorge","Le palais","Les lèvres"], correctAnswer: "La gorge" }
        ],
        quiz: [
          { question: "Ce cours compte combien de modules ?", options: ["4","6","7","10"], correctAnswer: "7" },
          { question: "L'alphabet arabe compte :", options: ["24 lettres","26 lettres","28 lettres","30 lettres"], correctAnswer: "28 lettres" }
        ]
      }
    ],
    vocabulary: [
      { ar: "مرحباً", tr: "Marhaban", fr: "Bonjour",    en: "Hello" },
      { ar: "كتاب",   tr: "Kitab",    fr: "Livre",      en: "Book" },
      { ar: "قلم",    tr: "Qalam",    fr: "Stylo",      en: "Pen" },
      { ar: "البيت",  tr: "Al-Bayt",  fr: "La maison",  en: "House" },
      { ar: "الطالب", tr: "At-Taleb", fr: "L'étudiant", en: "Student" },
    ]
  },
  {
    id: 2,
    title: "Tajwid : Récitation Sacrée",
    category: "Coran", level: "Intermédiaire", duration: "15h", rating: 4.8, students: "850",
    instructor: "Cheikh Omar", accent: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80",
    tags: ["Règles", "Mélodie"],
    videoUrl: "https://www.youtube.com/embed/9jK-NcRmVcw",
    description: "Maîtrisez les règles du Tajwid pour une récitation impeccable du Coran.",
    lessons: ["Introduction au Tajwid", "Les règles de bien-articulation", "Les lettres de prolongation", "Pratique et évaluation"],
    vocabulary: [
      { ar: "الحمد",   tr: "Al-Hamdu",  fr: "La louange",       en: "Praise" },
      { ar: "الرحمن",  tr: "Ar-Rahman", fr: "Le Miséricordieux", en: "The Merciful" },
      { ar: "الرحيم",  tr: "Ar-Rahim",  fr: "Le Compatissant",   en: "The Compassionate" },
      { ar: "الملك",   tr: "Al-Malik",  fr: "Le Roi",            en: "The King" },
      { ar: "القدوس",  tr: "Al-Quddus", fr: "Le Saint",          en: "The Holy" },
    ]
  },
  {
    id: 3,
    title: "Mémorisation : Les 10 dernières Sourates",
    category: "Coran", level: "Tous niveaux", duration: "20h", rating: 5.0, students: "3.4k",
    instructor: "Pr. Fatma", accent: "#f59e0b",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
    tags: ["Hifz", "Pratique"],
    videoUrl: "https://www.youtube.com/embed/ZbZSe6N_BXs",
    description: "Un cours complet pour mémoriser les 10 dernières sourates du Coran.",
    lessons: ["Sourate An-Nas", "Sourate Al-Falaq", "Sourate Al-Ikhlas", "Sourate Al-Masad", "Révision finale"],
    vocabulary: [
      { ar: "الناس",   tr: "An-Nas",    fr: "Les hommes", en: "The people" },
      { ar: "الفلق",   tr: "Al-Falaq",  fr: "L'aube",     en: "The dawn" },
      { ar: "الإخلاص", tr: "Al-Ikhlas", fr: "L'unicité",  en: "The purity" },
      { ar: "المسد",   tr: "Al-Masad",  fr: "Les fibres",  en: "The rope" },
      { ar: "القارعة", tr: "Al-Qarei'a",fr: "Le fracas",   en: "The calamity" },
    ]
  }
];

/* ── XP TOAST ─────────────────────────────────────────────────── */
function XpToast({ notif, accent }) {
  if (!notif) return null;
  return (
    <div style={{
      position: "fixed", bottom: "32px", right: "32px", zIndex: 9999,
      background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
      color: "#fff", padding: "18px 24px", borderRadius: "20px",
      boxShadow: `0 8px 40px ${accent}70, 0 0 0 1px ${accent}50`,
      fontFamily: "system-ui, sans-serif",
      display: "flex", flexDirection: "column", gap: "4px",
      animation: "xpSlideUp 0.35s cubic-bezier(0.22,1,0.36,1)",
      minWidth: "220px",
    }}>
      <span style={{ fontSize: "22px", fontWeight: 900 }}>+10 XP 🎉</span>
      <span style={{ fontSize: "12px", fontWeight: 600, opacity: 0.9, lineHeight: 1.4 }}>
        {notif.lessonTitle}
      </span>
      <span style={{ fontSize: "13px", fontWeight: 800, marginTop: "2px" }}>
        Total : {notif.points} pts ✨
      </span>
      <style>{`
        @keyframes xpSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────────────── */
function CourseDetail() {
  const { id } = useParams();
  const course  = COURS_DATA.find(c => c.id === parseInt(id)) || COURS_DATA[0];
  const accent  = course?.accent || "#10b981";

  // ── existing UI state ─────────────────────────────────────────
  const [activeTab,           setActiveTab]           = useState("about");
  const [selectedModule,      setSelectedModule]      = useState(0);
  const [selectedLanguage,    setSelectedLanguage]    = useState("ar");
  const [activeModuleTab,     setActiveModuleTab]     = useState("lessons");
  const [currentLessonIndex,  setCurrentLessonIndex]  = useState(0);
  const [currentExerciseIndex,setCurrentExerciseIndex]= useState(0);
  const [currentQuizIndex,    setCurrentQuizIndex]    = useState(0);
  const [exerciseAnswers,     setExerciseAnswers]     = useState({});
  const [quizAnswers,         setQuizAnswers]         = useState({});
  const [moduleResults,       setModuleResults]       = useState(null);
  const [sidebarOpen,         setSidebarOpen]         = useState(true);
  const [quizIndex,           setQuizIndex]           = useState(0);
  const [userAnswer,          setUserAnswer]          = useState("");
  const [quizResult,          setQuizResult]          = useState(null);
  const [quizScore,           setQuizScore]           = useState(0);
  const [quizAttempt,         setQuizAttempt]         = useState(0);
  const [dictSearchTerm,      setDictSearchTerm]      = useState("");
  const [dictSearchLanguage,  setDictSearchLanguage]  = useState("english");
  const [dictResults,         setDictResults]         = useState(null);
  const [dictLoading,         setDictLoading]         = useState(false);
  const [dictError,           setDictError]           = useState("");

  // ── ✅ NEW: progress tracking state ───────────────────────────
  const [completedLessonsSet, setCompletedLessonsSet] = useState(new Set());
  const [xpNotif,             setXpNotif]             = useState(null);   // { lessonTitle, points }
  const [markingComplete,     setMarkingComplete]     = useState(false);

  // ── ✅ NEW: load user's completedLessons on mount ─────────────
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    axios.get(`${API}/api/user/${email}`)
      .then(r => setCompletedLessonsSet(new Set(r.data.completedLessons || [])))
      .catch(() => {/* silent — user might not be logged in */});
  }, []);

  // ── ✅ NEW: lesson key = unique identifier stored in MongoDB ──
  // Format: "Course Title — Module Title — Lesson Title"
  const lessonKey = (moduleTitle, lessonTitle) =>
    `${course.title} — ${moduleTitle} — ${lessonTitle}`;

  // ── ✅ NEW: call /api/update-progress ─────────────────────────
  const handleMarkComplete = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("Connectez-vous pour enregistrer votre progression.");
      return;
    }
    if (!currentModule) return;
    const key = lessonKey(
      currentModule.title,
      currentModule.lessons[currentLessonIndex].title
    );
    if (completedLessonsSet.has(key)) return; // already done

    setMarkingComplete(true);
    try {
      const res = await axios.post(`${API}/api/update-progress`, {
        email,
        lessonTitle: key,
      });
      // Optimistic local update — no page reload needed
      setCompletedLessonsSet(prev => new Set([...prev, key]));
      setXpNotif({
        lessonTitle: currentModule.lessons[currentLessonIndex].title,
        points:      res.data.points,
      });
      setTimeout(() => setXpNotif(null), 4200);
    } catch (err) {
      console.error("Erreur de progression :", err);
      alert("Impossible d'enregistrer la progression. Vérifiez que le serveur tourne.");
    }
    setMarkingComplete(false);
  };

  // ── ✅ NEW: check if an entire module is fully completed ──────
  const isModuleComplete = (mod) => {
    if (!mod?.lessons) return false;
    return mod.lessons.every(l => completedLessonsSet.has(lessonKey(mod.title, l.title)));
  };

  // ── ✅ NEW: overall course progress (percentage) ──────────────
  const totalLessons = course.modules
    ? course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
    : (course.lessons?.length || 0);

  const completedCount = course.modules
    ? course.modules.reduce((acc, m) => {
        if (!m.lessons) return acc;
        return acc + m.lessons.filter(l => completedLessonsSet.has(lessonKey(m.title, l.title))).length;
      }, 0)
    : 0;

  const progressPct = totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  // ── helpers ──────────────────────────────────────────────────
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
      const response = await axios.get(`${API}/api/dictionary/translate`, {
        params: { word: dictSearchTerm.trim(), language: dictSearchLanguage }
      });
      if (response.data.success) setDictResults(response.data);
      else setDictError(response.data.message || "Mot introuvable.");
    } catch {
      setDictError("Erreur de connexion. Vérifiez votre serveur.");
    } finally {
      setDictLoading(false);
    }
  };

  const checkAnswer = () => {
    const isCorrect = userAnswer.trim() === ARABIC_LETTERS[quizIndex].letter;
    setQuizResult(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setQuizScore(s => s + 1);
    setQuizAttempt(a => a + 1);
  };

  const nextQuestion = () => {
    if (quizIndex < ARABIC_LETTERS.length - 1) {
      setQuizIndex(i => i + 1); setUserAnswer(""); setQuizResult(null);
    } else {
      setQuizResult("finished");
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0); setUserAnswer(""); setQuizResult(null); setQuizScore(0); setQuizAttempt(0);
  };

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-4">Cours non trouvé</h1>
        <Link to="/courses" className="text-emerald-600 font-bold hover:underline">← Retour au catalogue</Link>
      </div>
    </div>
  );

  const hasModules    = course.modules && course.modules.length > 0;
  const currentModule = hasModules ? course.modules[selectedModule] : null;

  const TABS = [
    { id: "about",      label: "À propos" },
    { id: "vocab",      label: "Vocabulaire" },
    ...(parseInt(id) === 1 ? [
      { id: "lettres",    label: "Lettres" },
      { id: "traducteur", label: "Traducteur" },
      { id: "quiz",       label: "Quiz" },
    ] : [])
  ];

  // ── current lesson is done? ───────────────────────────────────
  const currentLessonIsDone = currentModule
    ? completedLessonsSet.has(lessonKey(
        currentModule.title,
        currentModule.lessons[currentLessonIndex]?.title || ""
      ))
    : false;

  return (
    <div className="min-h-screen pt-20" style={{ background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>

      {/* ── XP Toast (floating) ───────────────────────────────── */}
      <XpToast notif={xpNotif} accent={accent} />

      {/* Top Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors">
            <ArrowLeft size={18} /> Catalogue
          </Link>
          <div className="flex items-center gap-3">
            {/* ✅ NEW: Live progress badge */}
            {totalLessons > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: `${accent}15`, color: accent,
                border: `1px solid ${accent}30`,
                padding: "4px 12px", borderRadius: "99px",
                fontSize: "11px", fontWeight: 700,
              }}>
                <CheckCircle size={12} />
                {completedCount}/{totalLessons} leçons · {progressPct}%
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: accent }}>
              <Star size={14} className="fill-current" /> {course.rating}
            </div>
            <div className="text-slate-400 text-sm flex items-center gap-1.5">
              <Users size={14} /> {course.students}
            </div>
            <div className="text-slate-400 text-sm flex items-center gap-1.5">
              <Clock size={14} /> {course.duration}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── MAIN ── */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">

              {/* Video */}
              <div className="aspect-video bg-slate-900 relative">
                <iframe className="w-full h-full" src={course.videoUrl} title={course.title}
                  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>

              {/* Tab nav */}
              <div className="flex overflow-x-auto border-b border-slate-100">
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-bold transition-all border-b-2"
                    style={{ color: activeTab === tab.id ? accent : "#94a3b8", borderBottomColor: activeTab === tab.id ? accent : "transparent", background: "transparent" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-8">

                {/* ───────── ABOUT TAB ───────── */}
                {activeTab === "about" && (
                  <div>
                    <div className="mb-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                        style={{ background: `${accent}18`, color: accent }}>
                        {course.category} · {course.level}
                      </span>
                      <h1 className="text-3xl font-black text-slate-900 mb-3"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {course.title}
                      </h1>
                      <p className="text-slate-500 leading-relaxed mb-4">{course.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {course.tags.map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded-xl text-xs font-bold"
                            style={{ background: `${accent}12`, color: accent }}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Module content */}
                    {currentModule && (
                      <div className="mt-8 pt-8 border-t border-slate-100">
                        <h3 className="text-xl font-black text-slate-900 mb-4">{currentModule.title}</h3>

                        {/* Module sub-tabs */}
                        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: "#f1f5f9" }}>
                          {["lessons","exercises","quiz"].map(t => (
                            <button key={t} onClick={() => {
                              setActiveModuleTab(t);
                              setCurrentLessonIndex(0); setCurrentExerciseIndex(0);
                              setCurrentQuizIndex(0);   setModuleResults(null);
                              setQuizAnswers({});        setExerciseAnswers({});
                            }}
                              className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                              style={{
                                background: activeModuleTab === t ? "white" : "transparent",
                                color: activeModuleTab === t ? accent : "#64748b",
                                boxShadow: activeModuleTab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
                              }}>
                              {t === "lessons" ? "📖 Leçons" : t === "exercises" ? "✏️ Exercices" : "🎯 Quiz"}
                            </button>
                          ))}
                        </div>

                        {/* ──── LESSONS ──── */}
                        {activeModuleTab === "lessons" && currentModule.lessons && (
                          <div>
                            {currentModule.videoUrl && (
                              <div className="mb-6 rounded-2xl overflow-hidden">
                                <iframe className="w-full aspect-video" src={currentModule.videoUrl}
                                  frameBorder="0" allowFullScreen />
                              </div>
                            )}

                            {/* Lesson title + counter */}
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-black text-slate-900">
                                {currentModule.lessons[currentLessonIndex].title}
                              </h4>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {/* ✅ Done badge on title row */}
                                {currentLessonIsDone && (
                                  <span style={{
                                    display: "flex", alignItems: "center", gap: "4px",
                                    background: "#ecfdf5", color: "#065f46",
                                    fontSize: "10px", fontWeight: 700,
                                    padding: "3px 9px", borderRadius: "99px",
                                    border: "1px solid #a7f3d0",
                                  }}>
                                    <CheckCircle size={11} /> Terminée
                                  </span>
                                )}
                                <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                                  {currentLessonIndex + 1} / {currentModule.lessons.length}
                                </span>
                              </div>
                            </div>

                            {/* Lesson content */}
                            <div className="p-5 rounded-2xl mb-6 leading-relaxed text-slate-600"
                              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "15px" }}>
                              {currentModule.lessons[currentLessonIndex].content}
                            </div>

                            {/* ✅ NEW: Mark-as-complete button */}
                            <div style={{
                              marginBottom: "20px", padding: "16px 0",
                              borderTop: "1.5px solid #f1f5f9", borderBottom: "1.5px solid #f1f5f9",
                            }}>
                              {currentLessonIsDone ? (
                                <div style={{
                                  display: "flex", alignItems: "center", gap: "10px",
                                  padding: "13px 20px", borderRadius: "14px",
                                  background: "#ecfdf5", border: "1.5px solid #a7f3d0",
                                  color: "#065f46", fontWeight: 700, fontSize: "14px",
                                }}>
                                  <CheckCircle size={20} color="#10b981" />
                                  Leçon déjà enregistrée ✅
                                </div>
                              ) : (
                                <button onClick={handleMarkComplete} disabled={markingComplete}
                                  style={{
                                    width: "100%", padding: "14px 20px", borderRadius: "14px",
                                    background: accent, color: "#fff", border: "none",
                                    fontWeight: 900, fontSize: "14px",
                                    cursor: markingComplete ? "not-allowed" : "pointer",
                                    opacity: markingComplete ? 0.7 : 1,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    gap: "8px", fontFamily: "inherit",
                                    boxShadow: `0 4px 20px ${accent}40`,
                                    transition: "all 0.2s",
                                  }}
                                  onMouseEnter={e => { if (!markingComplete) e.currentTarget.style.opacity = "0.88"; }}
                                  onMouseLeave={e => { e.currentTarget.style.opacity = markingComplete ? "0.7" : "1"; }}
                                >
                                  {markingComplete
                                    ? "⏳ Enregistrement..."
                                    : "✅ Leçon terminée — +10 XP"
                                  }
                                </button>
                              )}
                            </div>

                            {/* Prev / Next */}
                            <div className="flex gap-3">
                              <button onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                                disabled={currentLessonIndex === 0}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
                                style={{ background: "#f1f5f9", color: "#0f172a" }}>
                                ← Précédent
                              </button>
                              <button onClick={() => setCurrentLessonIndex(Math.min(currentModule.lessons.length - 1, currentLessonIndex + 1))}
                                disabled={currentLessonIndex === currentModule.lessons.length - 1}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 text-white"
                                style={{ background: accent }}>
                                Suivant →
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ──── EXERCISES ──── */}
                        {activeModuleTab === "exercises" && currentModule.exercises && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-black text-slate-900 text-lg">Question {currentExerciseIndex + 1}/{currentModule.exercises.length}</h4>
                              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Pratique</span>
                            </div>
                            <div className="p-6 rounded-2xl mb-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                              <p className="text-lg font-bold text-slate-900 mb-5">{currentModule.exercises[currentExerciseIndex].question}</p>
                              <div className="space-y-3">
                                {currentModule.exercises[currentExerciseIndex].options.map((opt, idx) => (
                                  <button key={idx} onClick={() => setExerciseAnswers({ ...exerciseAnswers, [currentExerciseIndex]: opt })}
                                    className="w-full p-4 rounded-xl text-left font-semibold transition-all text-sm border-2"
                                    style={{
                                      background: exerciseAnswers[currentExerciseIndex] === opt ? `${accent}12` : "white",
                                      borderColor: exerciseAnswers[currentExerciseIndex] === opt ? accent : "#e2e8f0",
                                      color: exerciseAnswers[currentExerciseIndex] === opt ? accent : "#374151"
                                    }}>
                                    {opt}
                                  </button>
                                ))}
                              </div>
                              {exerciseAnswers[currentExerciseIndex] && (
                                <div className="mt-4 p-4 rounded-xl text-sm font-bold"
                                  style={{
                                    background: exerciseAnswers[currentExerciseIndex] === currentModule.exercises[currentExerciseIndex].correctAnswer ? "#ecfdf5" : "#fef2f2",
                                    color: exerciseAnswers[currentExerciseIndex] === currentModule.exercises[currentExerciseIndex].correctAnswer ? "#065f46" : "#991b1b"
                                  }}>
                                  {exerciseAnswers[currentExerciseIndex] === currentModule.exercises[currentExerciseIndex].correctAnswer
                                    ? "✅ Excellent ! Bonne réponse."
                                    : `❌ Incorrect. Réponse : ${currentModule.exercises[currentExerciseIndex].correctAnswer}`}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))} disabled={currentExerciseIndex === 0}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-40" style={{ background: "#f1f5f9", color: "#0f172a" }}>← Précédent</button>
                              <button onClick={() => setCurrentExerciseIndex(Math.min(currentModule.exercises.length - 1, currentExerciseIndex + 1))}
                                disabled={currentExerciseIndex === currentModule.exercises.length - 1}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 text-white" style={{ background: accent }}>Suivant →</button>
                            </div>
                          </div>
                        )}

                        {/* ──── QUIZ ──── */}
                        {activeModuleTab === "quiz" && currentModule.quiz && !moduleResults && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-black text-slate-900 text-lg">Question {currentQuizIndex + 1}/{currentModule.quiz.length}</h4>
                              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Évaluation</span>
                            </div>
                            <div className="p-6 rounded-2xl mb-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                              <p className="text-lg font-bold text-slate-900 mb-5">{currentModule.quiz[currentQuizIndex].question}</p>
                              <div className="space-y-3">
                                {currentModule.quiz[currentQuizIndex].options.map((opt, idx) => (
                                  <button key={idx} onClick={() => setQuizAnswers({ ...quizAnswers, [currentQuizIndex]: opt })}
                                    className="w-full p-4 rounded-xl text-left font-semibold transition-all text-sm border-2"
                                    style={{
                                      background: quizAnswers[currentQuizIndex] === opt ? "#eff6ff" : "white",
                                      borderColor: quizAnswers[currentQuizIndex] === opt ? "#3b82f6" : "#e2e8f0",
                                      color: quizAnswers[currentQuizIndex] === opt ? "#1d4ed8" : "#374151"
                                    }}>
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => setCurrentQuizIndex(Math.max(0, currentQuizIndex - 1))} disabled={currentQuizIndex === 0}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-40" style={{ background: "#f1f5f9", color: "#0f172a" }}>← Précédent</button>
                              {currentQuizIndex === currentModule.quiz.length - 1 ? (
                                <button onClick={() => {
                                  let correct = 0;
                                  currentModule.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correctAnswer) correct++; });
                                  setModuleResults({ score: correct, total: currentModule.quiz.length });
                                }} disabled={Object.keys(quizAnswers).length < currentModule.quiz.length}
                                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40" style={{ background: accent }}>
                                  Terminer →
                                </button>
                              ) : (
                                <button onClick={() => setCurrentQuizIndex(currentQuizIndex + 1)} disabled={!quizAnswers[currentQuizIndex]}
                                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40" style={{ background: accent }}>
                                  Suivant →
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ──── QUIZ RESULTS ──── */}
                        {activeModuleTab === "quiz" && moduleResults && (
                          <div className="text-center py-8">
                            <div className="text-6xl font-black mb-2" style={{ color: accent }}>
                              {Math.round((moduleResults.score / moduleResults.total) * 100)}%
                            </div>
                            <p className="text-xl font-black text-slate-900 mb-1">{moduleResults.score} / {moduleResults.total} correct</p>
                            <p className="text-slate-500 text-sm mb-8">
                              {moduleResults.score === moduleResults.total ? "🌟 Parfait ! Module maîtrisé !" : "📚 Continuez à pratiquer !"}
                            </p>
                            <button onClick={() => { setCurrentQuizIndex(0); setQuizAnswers({}); setModuleResults(null); }}
                              className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: accent }}>
                              Recommencer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ───────── VOCAB TAB ───────── */}
                {activeTab === "vocab" && (
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-6"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Vocabulaire du cours</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {course.vocabulary.map((item, i) => (
                        <div key={i} className="p-5 rounded-2xl border transition-all hover:shadow-md"
                          style={{ background: "white", border: "1.5px solid #f1f5f9" }}>
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-4xl" style={{ fontFamily: "serif", direction: "rtl" }}>{item.ar}</span>
                            <button onClick={() => speak(item.ar)}
                              className="p-2.5 rounded-xl transition-all"
                              style={{ background: `${accent}15`, color: accent }}
                              onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = "white"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = `${accent}15`; e.currentTarget.style.color = accent; }}>
                              <Volume2 size={18} />
                            </button>
                          </div>
                          <div className="font-black text-sm mb-1" style={{ color: accent }}>{item.tr}</div>
                          <div className="text-xs text-slate-400 font-medium">🇫🇷 {item.fr} · 🇬🇧 {item.en}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ───────── LETTRES TAB ───────── */}
                {activeTab === "lettres" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-black text-slate-900"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Les 28 Lettres Arabes</h2>
                      <div className="flex gap-2">
                        {[{ code: "ar", label: "🇸🇦 AR", color: "#ef4444" }, { code: "fr", label: "🇫🇷 FR", color: "#3b82f6" }, { code: "en", label: "🇬🇧 EN", color: "#f97316" }]
                          .map(l => (
                            <button key={l.code} onClick={() => setSelectedLanguage(l.code)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                              style={{ background: selectedLanguage === l.code ? l.color : "#f1f5f9", color: selectedLanguage === l.code ? "white" : "#64748b" }}>
                              {l.label}
                            </button>
                          ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {ARABIC_LETTERS.map((item, i) => (
                        <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all text-center group cursor-pointer">
                          <div className="text-5xl mb-2 group-hover:scale-110 transition-transform" style={{ fontFamily: "serif" }}>{item.letter}</div>
                          <div className="text-xs font-black text-slate-700 mb-2">{item.name}</div>
                          <div className="text-xs font-semibold px-2 py-1 rounded-lg mb-3"
                            style={{
                              background: selectedLanguage === "ar" ? "#fef2f2" : selectedLanguage === "fr" ? "#eff6ff" : "#fff7ed",
                              color: selectedLanguage === "ar" ? "#dc2626" : selectedLanguage === "fr" ? "#2563eb" : "#ea580c"
                            }}>
                            {selectedLanguage === "ar" ? item.ar : selectedLanguage === "fr" ? item.fr : item.en}
                          </div>
                          <div className="text-xs text-slate-400 mb-3 font-mono">{item.transcription}</div>
                          <div className="flex gap-1 justify-center">
                            {[{ lang: "ar-SA", label: "AR", bg: "#ef4444" }, { lang: "fr-FR", label: "FR", bg: "#3b82f6" }, { lang: "en-US", label: "EN", bg: "#f97316" }]
                              .map(l => (
                                <button key={l.label} onClick={() => speak(l.label === "AR" ? item.letter : l.label === "FR" ? item.fr : item.en, l.lang)}
                                  className="px-1.5 py-1 rounded-md text-white font-bold transition-opacity hover:opacity-80"
                                  style={{ background: l.bg, fontSize: "9px" }}>
                                  {l.label}
                                </button>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ───────── TRADUCTEUR TAB ───────── */}
                {activeTab === "traducteur" && (
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Traducteur & Phonétique</h2>
                    <p className="text-slate-500 text-sm mb-6">Tapez un mot pour obtenir sa traduction arabe et sa prononciation.</p>
                    <div className="flex gap-2 mb-5">
                      {[{ code: "english", label: "🇬🇧 English" }, { code: "french", label: "🇫🇷 Français" }].map(l => (
                        <button key={l.code} onClick={() => { setDictSearchLanguage(l.code); setDictResults(null); setDictSearchTerm(""); }}
                          className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
                          style={{ background: dictSearchLanguage === l.code ? "#0f172a" : "#f1f5f9", color: dictSearchLanguage === l.code ? "white" : "#64748b" }}>
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={handleDictSearch} className="flex gap-3 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input type="text" value={dictSearchTerm} onChange={e => setDictSearchTerm(e.target.value)}
                          placeholder={dictSearchLanguage === "english" ? "Ex: peace, hello, book..." : "Ex: paix, bonjour, livre..."}
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                          style={{ border: "2px solid #e2e8f0" }} />
                      </div>
                      <button type="submit" disabled={dictLoading}
                        className="px-5 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60"
                        style={{ background: accent }}>
                        {dictLoading ? "..." : "Traduire"}
                      </button>
                    </form>
                    {dictError && <div className="p-4 rounded-xl text-sm font-semibold mb-4" style={{ background: "#fef2f2", color: "#dc2626" }}>{dictError}</div>}
                    {dictResults ? (
                      <div className="p-6 rounded-2xl" style={{ background: "linear-gradient(135deg,#ecfdf5,#eff6ff)", border: "2px solid #d1fae5" }}>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-7xl font-black" style={{ fontFamily: "serif", color: accent }}>{dictResults.arabic}</span>
                          <button onClick={() => speak(dictResults.arabic)}
                            className="p-4 rounded-2xl transition-all hover:scale-110"
                            style={{ background: `${accent}20`, color: accent }}>
                            <Volume2 size={28} />
                          </button>
                        </div>
                        <div className="border-t pt-4" style={{ borderColor: "#d1fae5" }}>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Prononciation</p>
                          <p className="text-lg font-bold italic" style={{ color: accent }}>{dictResults.pronunciation}</p>
                        </div>
                      </div>
                    ) : !dictLoading && !dictError && (
                      <div className="text-center py-12 rounded-2xl" style={{ background: "#f8fafc", border: "2px dashed #e2e8f0" }}>
                        <Globe size={40} className="mx-auto mb-3 text-slate-300" />
                        <p className="text-slate-400 text-sm">Entrez un mot pour voir sa traduction ✨</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ───────── QUIZ TAB ───────── */}
                {activeTab === "quiz" && (
                  <div>
                    {quizResult !== "finished" ? (
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Quiz d'Écriture</h2>
                        <p className="text-slate-500 text-sm mb-6">Écoutez la lettre et écrivez son caractère arabe.</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-slate-600">Lettre {quizIndex + 1} / {ARABIC_LETTERS.length}</span>
                          <span className="text-sm font-bold" style={{ color: accent }}>{quizScore} correct</span>
                        </div>
                        <div className="w-full h-2 rounded-full mb-8 overflow-hidden" style={{ background: "#f1f5f9" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${(quizIndex / ARABIC_LETTERS.length) * 100}%`, background: accent }} />
                        </div>
                        <div className="p-8 rounded-3xl text-center mb-6" style={{ background: "#f8fafc", border: "2px solid #e2e8f0" }}>
                          <div className="mb-6">
                            <button onClick={() => speak(ARABIC_LETTERS[quizIndex].letter, "ar-SA")}
                              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg mb-4 transition-all hover:opacity-90"
                              style={{ background: accent }}>
                              <Volume2 size={22} /> Écouter
                            </button>
                            <div className="text-sm font-bold text-slate-500">
                              Nom : <span className="text-slate-900 font-black">{ARABIC_LETTERS[quizIndex].name}</span>
                              {" · "}Transcription : <span className="font-black text-slate-900 font-mono">{ARABIC_LETTERS[quizIndex].transcription}</span>
                            </div>
                          </div>
                          <input type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter" && !quizResult) checkAnswer(); }}
                            placeholder="Écrivez la lettre ici..."
                            className="w-full py-5 text-4xl text-center rounded-2xl focus:outline-none mb-6 transition-all"
                            style={{ fontFamily: "serif", direction: "rtl", border: `2px solid ${quizResult ? (quizResult === "correct" ? "#10b981" : "#ef4444") : "#e2e8f0"}`, background: "white" }} />
                          {quizResult && quizResult !== "finished" && (
                            <div className="p-4 rounded-2xl mb-4 font-bold text-sm"
                              style={{ background: quizResult === "correct" ? "#ecfdf5" : "#fef2f2", color: quizResult === "correct" ? "#065f46" : "#991b1b" }}>
                              {quizResult === "correct" ? `✅ Bravo ! La lettre est ${ARABIC_LETTERS[quizIndex].letter}` : `❌ La bonne réponse est : ${ARABIC_LETTERS[quizIndex].letter}`}
                              <button onClick={() => speak(ARABIC_LETTERS[quizIndex].letter, "ar-SA")} className="ml-3 underline font-semibold text-xs">Réécouter</button>
                            </div>
                          )}
                          <div className="flex gap-3 justify-center">
                            {!quizResult && (
                              <button onClick={checkAnswer} disabled={!userAnswer.trim()}
                                className="px-8 py-3 rounded-xl font-bold text-white disabled:opacity-40 transition-all"
                                style={{ background: accent }}>Vérifier</button>
                            )}
                            {quizResult && (
                              <button onClick={nextQuestion} className="px-8 py-3 rounded-xl font-bold text-white transition-all" style={{ background: accent }}>
                                {quizIndex < ARABIC_LETTERS.length - 1 ? "Suivant →" : "Terminer"}
                              </button>
                            )}
                            <button onClick={resetQuiz} className="px-6 py-3 rounded-xl font-bold text-slate-700 transition-all" style={{ background: "#f1f5f9" }}>
                              Réinitialiser
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-7xl font-black mb-2" style={{ color: accent }}>
                          {Math.round((quizScore / ARABIC_LETTERS.length) * 100)}%
                        </div>
                        <p className="text-2xl font-black text-slate-900 mb-1">{quizScore} / {ARABIC_LETTERS.length}</p>
                        <p className="text-slate-500 mb-8">
                          {quizScore === ARABIC_LETTERS.length ? "🌟 Parfait ! Alphabet maîtrisé !" : quizScore >= ARABIC_LETTERS.length * 0.8 ? "👏 Excellent !" : "📚 Continuez à pratiquer !"}
                        </p>
                        <button onClick={resetQuiz} className="px-8 py-4 rounded-2xl font-bold text-white" style={{ background: accent }}>
                          Recommencer le Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Course Programme */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen size={20} style={{ color: accent }} /> Programme
                </h3>
                {hasModules && (
                  <button onClick={() => setSidebarOpen(o => !o)} className="text-slate-400 hover:text-slate-700">
                    {sidebarOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                )}
              </div>

              {sidebarOpen && (
                <div className="space-y-2 mb-5">
                  {(hasModules ? course.modules : course.lessons || []).map((item, i) => {
                    const label    = hasModules ? item.title : item;
                    const isActive = selectedModule === i;
                    // ✅ NEW: show checkmark if module fully completed
                    const isDone   = hasModules && isModuleComplete(course.modules[i]);
                    return (
                      <button key={i} onClick={() => {
                        setSelectedModule(i); setActiveTab("about");
                        setActiveModuleTab("lessons"); setCurrentLessonIndex(0);
                        setModuleResults(null); setQuizAnswers({}); setExerciseAnswers({});
                      }}
                        className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all font-semibold text-sm"
                        style={{
                          background: isActive ? `${accent}15` : isDone ? "rgba(16,185,129,0.04)" : "#f8fafc",
                          color: isActive ? accent : isDone ? "#10b981" : "#475569",
                          border: `1.5px solid ${isActive ? accent + "40" : isDone ? "rgba(16,185,129,0.2)" : "transparent"}`
                        }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                          style={{ background: isActive ? accent : isDone ? "#10b981" : "#e2e8f0", color: isActive || isDone ? "white" : "#64748b" }}>
                          {isDone ? "✓" : i + 1}
                        </div>
                        <span className="flex-1 line-clamp-2 leading-tight">{label}</span>
                        {/* ✅ NEW: green check if done, else arrow */}
                        {isDone
                          ? <CheckCircle size={15} color="#10b981" />
                          : <ChevronRight size={15} />
                        }
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ✅ UPDATED: Dynamic progress bar */}
              <div className="p-4 rounded-2xl" style={{ background: "#0f172a" }}>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Progression</p>
                <div className="w-full rounded-full h-1.5 mb-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, background: accent }} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-bold">{progressPct}% complété</p>
                  <p className="text-slate-400 text-xs font-semibold">{completedCount}/{totalLessons} leçons</p>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Instructeur</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg"
                  style={{ background: accent }}>
                  {course.instructor.charAt(course.instructor.length - 1)}
                </div>
                <div>
                  <p className="font-black text-slate-900">{course.instructor}</p>
                  <p className="text-xs text-slate-400 font-semibold">{course.category} · Expert</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1.5 font-bold" style={{ color: accent }}>
                  <Star size={14} className="fill-current" /> {course.rating}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                  <Users size={14} /> {course.students} étudiants
                </div>
              </div>
            </div>

            {/* AI Tutor */}
            <div className="rounded-3xl p-6 border" style={{ background: "linear-gradient(135deg,#ecfdf5,#eff6ff)", borderColor: "#a7f3d0" }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} style={{ color: accent }} />
                <h4 className="font-black text-slate-900">Tuteur IA</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Des questions sur le cours ? Notre assistant IA spécialisé est là pour vous aider.
              </p>
              <button className="w-full py-3 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90"
                style={{ background: accent }}>
                Lancer le Tuteur IA →
              </button>
            </div>

            {/* Includes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Ce cours inclut</h3>
              <div className="space-y-3">
                {[
                  { icon: <Play size={16} />,     label: `${course.duration} de vidéo` },
                  { icon: <BookOpen size={16} />,  label: "Exercices interactifs" },
                  { icon: <Award size={16} />,     label: "Certificat de réussite" },
                  { icon: <Globe size={16} />,     label: "Accès à vie" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                    <span style={{ color: accent }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;