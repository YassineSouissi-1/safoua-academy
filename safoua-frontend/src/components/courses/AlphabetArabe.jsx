import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Volume2, Globe, Search, RotateCcw, CheckCircle, Zap, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const ARABIC_LETTERS = [
  { letter: "ا", name: "Alif", transcription: "aa", ar: "ألف", tts: "أَلِف", fr: "Alif", en: "Alif", forms: ["ا","ـا","ـا","ا"], tip: "Comme un 'A' long. La lettre la plus simple: un simple trait vertical.", color: "#10b981", audioKey: "alif" },
  { letter: "ب", name: "Ba", transcription: "b", ar: "باء", tts: "بَاء", fr: "Ba", en: "Ba", forms: ["بـ","ـبـ","ـب","ب"], tip: "Comme le 'B' français. Un bol avec un point en dessous.", color: "#3b82f6", audioKey: "ba" },
  { letter: "ت", name: "Ta", transcription: "t", ar: "تاء", tts: "تَاء", fr: "Ta", en: "Ta", forms: ["تـ","ـتـ","ـت","ت"], tip: "Comme le 'T' français. Même forme que Ba mais DEUX points au-dessus.", color: "#8b5cf6", audioKey: "ta" },
  { letter: "ث", name: "Tha", transcription: "th", ar: "ثاء", tts: "ثَاء", fr: "Tha", en: "Tha", forms: ["ثـ","ـثـ","ـث","ث"], tip: "Comme 'th' anglais dans 'think'. Même bol mais TROIS points au-dessus.", color: "#f59e0b", audioKey: "tha" },
  { letter: "ج", name: "Jim", transcription: "j", ar: "جيم", tts: "جِيم", fr: "Jim", en: "Jim", forms: ["جـ","ـجـ","ـج","ج"], tip: "Comme le 'J' français. Forme de crochet avec un point au milieu.", color: "#ef4444", audioKey: "jim" },
  { letter: "ح", name: "Ha", transcription: "ħ", ar: "حاء", tts: "حَاؤ", fr: "Ha", en: "Ha", forms: ["حـ","ـحـ","ـح","ح"], tip: "Son guttural doux, comme un souffle chaud. Même forme que Jim sans point.", color: "#06b6d4", audioKey: "ha" },
  { letter: "خ", name: "Kha", transcription: "kh", ar: "خاء", tts: "خَاء", fr: "Kha", en: "Kha", forms: ["خـ","ـخـ","ـخ","خ"], tip: "Comme le 'r' allemand ou le 'j' espagnol. Jim avec un point AU-DESSUS.", color: "#84cc16", audioKey: "kha" },
  { letter: "د", name: "Dal", transcription: "d", ar: "دال", tts: "دَال", fr: "Dal", en: "Dal", forms: ["د","ـد","ـد","د"], tip: "Comme le 'D' français. Une petite bosse. Ne se connecte PAS à droite.", color: "#f97316", audioKey: "dal" },
  { letter: "ذ", name: "Dhal", transcription: "dh", ar: "ذال", tts: "ذَال", fr: "Dhal", en: "Dhal", forms: ["ذ","ـذ","ـذ","ذ"], tip: "Comme 'th' anglais dans 'this'. Dal avec un point au-dessus.", color: "#ec4899", audioKey: "thal" },
  { letter: "ر", name: "Ra", transcription: "r", ar: "راء", tts: "رَاء", fr: "Ra", en: "Ra", forms: ["ر","ـر","ـر","ر"], tip: "Comme un 'R' roulé. Courbe douce vers le bas. Ne se connecte pas.", color: "#10b981", audioKey: "ra" },
  { letter: "ز", name: "Zay", transcription: "z", ar: "زاي", tts: "زَاي", fr: "Zaï", en: "Zay", forms: ["ز","ـز","ـز","ز"], tip: "Comme le 'Z' français. Ra avec un point au-dessus.", color: "#3b82f6", audioKey: "zain" },
  { letter: "س", name: "Sin", transcription: "s", ar: "سين", tts: "سِين", fr: "Sin", en: "Sin", forms: ["سـ","ـسـ","ـس","س"], tip: "Comme le 'S' français. Trois dents de scie au fond, comme des vagues.", color: "#8b5cf6", audioKey: "sin" },
  { letter: "ش", name: "Shin", transcription: "sh", ar: "شين", tts: "شِين", fr: "Shin", en: "Shin", forms: ["شـ","ـشـ","ـش","ش"], tip: "Comme 'ch' français dans 'chat'. Sin avec trois points au-dessus.", color: "#f59e0b", audioKey: "shin" },
  { letter: "ص", name: "Sad", transcription: "ṣ", ar: "صاد", tts: "صَاد", fr: "Sad", en: "Sad", forms: ["صـ","ـصـ","ـص","ص"], tip: "S emphatique, prononcé plus profond. Boucle ronde avec une queue.", color: "#ef4444", audioKey: "sad" },
  { letter: "ض", name: "Dad", transcription: "ḍ", ar: "ضاد", tts: "ضَاد", fr: "Dad", en: "Dad", forms: ["ضـ","ـضـ","ـض","ض"], tip: "D emphatique. Sad avec un point au-dessus. Unique à l'arabe!", color: "#06b6d4", audioKey: "dad" },
  { letter: "ط", name: "Taa", transcription: "ṭ", ar: "طاء", tts: "طَاء", fr: "Ta emphatique", en: "Ta", forms: ["طـ","ـطـ","ـط","ط"], tip: "T emphatique, prononcé profondément. Boucle avec un trait vertical.", color: "#84cc16", audioKey: "ta2" },
  { letter: "ظ", name: "Dha", transcription: "ẓ", ar: "ظاء", tts: "ظَاء", fr: "Dha emphatique", en: "Dha", forms: ["ظـ","ـظـ","ـظ","ظ"], tip: "Th emphatique. Ta avec un point au-dessus.", color: "#f97316", audioKey: "dha" },
  { letter: "ع", name: "Ayn", transcription: "ʿ", ar: "عين", tts: "عَين", fr: "Ayn", en: "Ayn", forms: ["عـ","ـعـ","ـع","ع"], tip: "Son guttural unique - contraction de la gorge. Comme un 'A' du fond de la gorge.", color: "#ec4899", audioKey: "ain" },
  { letter: "غ", name: "Ghayn", transcription: "gh", ar: "غين", tts: "غَين", fr: "Ghayn", en: "Ghayn", forms: ["غـ","ـغـ","ـغ","غ"], tip: "Comme le 'R' parisien grasseyé. Ayn avec un point au-dessus.", color: "#10b981", audioKey: "ghain" },
  { letter: "ف", name: "Fa", transcription: "f", ar: "فاء", tts: "فَاء", fr: "Fa", en: "Fa", forms: ["فـ","ـفـ","ـف","ف"], tip: "Comme le 'F' français. Un cercle avec un point au-dessus et une queue.", color: "#3b82f6", audioKey: "fa" },
  { letter: "ق", name: "Qaf", transcription: "q", ar: "قاف", tts: "قَاف", fr: "Qaf", en: "Qaf", forms: ["قـ","ـقـ","ـق","ق"], tip: "K guttural du fond de la gorge. Fa mais avec DEUX points et plus arrondi.", color: "#8b5cf6", audioKey: "qaf" },
  { letter: "ك", name: "Kaf", transcription: "k", ar: "كاف", tts: "كَاف", fr: "Kaf", en: "Kaf", forms: ["كـ","ـكـ","ـك","ك"], tip: "Comme le 'K' français. Grande courbe avec un petit trait intérieur.", color: "#f59e0b", audioKey: "kaf" },
  { letter: "ل", name: "Lam", transcription: "l", ar: "لام", tts: "لَام", fr: "Lam", en: "Lam", forms: ["لـ","ـلـ","ـل","ل"], tip: "Comme le 'L' français. Une belle courbe qui se ferme. Forme élégante.", color: "#ef4444", audioKey: "lam" },
  { letter: "م", name: "Meem", transcription: "m", ar: "ميم", tts: "مِيم", fr: "Meem", en: "Meem", forms: ["مـ","ـمـ","ـم","م"], tip: "Comme le 'M' français. Un petit cercle avec une queue qui descend.", color: "#06b6d4", audioKey: "meem" },
  { letter: "ن", name: "Nun", transcription: "n", ar: "نون", tts: "نُون", fr: "Noun", en: "Nun", forms: ["نـ","ـنـ","ـن","ن"], tip: "Comme le 'N' français. Bol profond avec un point AU-DESSUS (≠ Ba qui a le point en dessous).", color: "#84cc16", audioKey: "nun" },
  { letter: "ه", name: "Ha2", transcription: "h", ar: "هاء", tts: "هَاء", fr: "Ha", en: "Ha", forms: ["هـ","ـهـ","ـه","ه"], tip: "H doux comme une aspiration. Change beaucoup de forme selon sa position!", color: "#f97316", audioKey: "ha2" },
  { letter: "و", name: "Waw", transcription: "w/uu", ar: "واو", tts: "وَاو", fr: "Waw", en: "Waw", forms: ["و","ـو","ـو","و"], tip: "Comme 'W' ou 'OU'. Tête ronde avec une queue. Ne se connecte pas.", color: "#ec4899", audioKey: "waw" },
  { letter: "ي", name: "Ya", transcription: "y/ii", ar: "ياء", tts: "يَاء", fr: "Ya", en: "Ya", forms: ["يـ","ـيـ","ـي","ي"], tip: "Comme 'Y' ou 'I'. Deux points dessous en position finale. Très souple!", color: "#10b981", audioKey: "ya" },
];

// ─── Quiz types: "write" (type the letter), "mcq" (multiple choice), "listen_mcq" (hear + choose), "draw" (draw the letter) ───
const ALL_QUIZZES = [
  // MCQ type
  { type: "mcq", letter: "ب", question: "Quelle lettre est-ce?", options: ["Ba (ب)", "Nun (ن)", "Ta (ت)", "Ya (ي)"], correct: 0, hint: "Un bol avec UN point en dessous" },
  { type: "mcq", letter: "ث", question: "Combien de points pour Tha (ث)?", options: ["1 point en dessous", "2 points au-dessus", "3 points au-dessus", "Aucun point"], correct: 2, hint: "Tha = même bol que Ba/Ta mais avec TROIS points au-dessus" },
  { type: "mcq", letter: "ع", question: "Quel son fait cette lettre ع?", options: ["F comme français", "Son guttural unique", "S comme soleil", "K comme kaléidoscope"], correct: 1, hint: "Le son le plus unique de l'arabe — contraction de la gorge" },
  { type: "mcq", letter: "ل", question: "Lam + Alif forme une ligature spéciale. C'est quoi?", options: ["لو", "لا", "لي", "له"], correct: 1, hint: "ل + ا = لا — cette combinaison est obligatoire en arabe!" },
  { type: "mcq", letter: "م", question: "Quelle est la forme de Meem?", options: ["Trois dents de scie", "Petit cercle + queue", "Grande boucle", "Trait vertical"], correct: 1, hint: "Comme un petit escargot avec une queue" },
  { type: "mcq", letter: "ص", question: "Sad est la version emphatique de…?", options: ["Shin (ش)", "Sin (س)", "Zay (ز)", "Ra (ر)"], correct: 1, hint: "ص est un S prononcé profondément depuis le fond de la gorge" },
  { type: "mcq", letter: "خ", question: "Kha (خ) ressemble à…?", options: ["Jim sans point", "Jim avec point en dessous", "Jim avec point au-dessus", "Ha avec queue"], correct: 2, hint: "خ = ج + un point au-dessus. Même forme, son différent!" },
  { type: "mcq", letter: "ذ", question: "Dhal (ذ) est la version pointée de…?", options: ["Ra (ر)", "Dal (د)", "Zay (ز)", "Waw (و)"], correct: 1, hint: "ذ = د + un point au-dessus. Pensez à 'this' en anglais." },
  { type: "mcq", letter: "غ", question: "Ghayn (غ) ressemble à quel son français?", options: ["Le 'L' parisien", "Le 'R' grasseyé parisien", "Le 'N' nasal", "Le 'V' doux"], correct: 1, hint: "Comme le 'R' que font les Parisiens — au fond de la gorge!" },
  { type: "mcq", letter: "ق", question: "Qaf (ق) se distingue de Fa (ف) par…?", options: ["Un point en dessous", "Deux points en dessous", "Trois points au-dessus", "Aucune différence"], correct: 1, hint: "ق = comme ف mais avec DEUX points en dessous et plus arrondi" },
  // Write type (type the Arabic letter)
  { type: "write", letter: "ب", question: "Écoutez et écrivez la lettre 'Ba'", hint: "Un bol avec un point en dessous" },
  { type: "write", letter: "ت", question: "Écoutez et écrivez la lettre 'Ta'", hint: "Deux points au-dessus, même forme que Ba" },
  { type: "write", letter: "س", question: "Écoutez et écrivez la lettre 'Sin'", hint: "Trois vagues horizontales, comme la mer" },
  { type: "write", letter: "م", question: "Écoutez et écrivez la lettre 'Meem'", hint: "Un petit cercle avec une queue descendante" },
  { type: "write", letter: "ن", question: "Écoutez et écrivez la lettre 'Nun'", hint: "Un bol avec UN point AU-DESSUS (≠ Ba qui a le point en dessous)" },
  { type: "write", letter: "ل", question: "Écoutez et écrivez la lettre 'Lam'", hint: "Une belle courbe élégante" },
  { type: "write", letter: "ر", question: "Écoutez et écrivez la lettre 'Ra'", hint: "Une douce courbe vers le bas, comme un crochet" },
  { type: "write", letter: "ك", question: "Écoutez et écrivez la lettre 'Kaf'", hint: "Grande courbe avec un petit trait intérieur" },
  // Listen + MCQ (hear the name, pick the letter visually)
  { type: "listen_mcq", letter: "ع", question: "Vous entendez 'Ayn'. Quelle est cette lettre?", options: ["غ", "ع", "ف", "ق"], correct: 1, hint: "Ayn = عين. Son guttural unique, la lettre la plus difficile!" },
  { type: "listen_mcq", letter: "ح", question: "Vous entendez 'Ha'. Quelle est cette lettre?", options: ["ه", "ح", "خ", "ج"], correct: 1, hint: "Ha = حاء. Le Ha guttural doux, sans point." },
  { type: "listen_mcq", letter: "ش", question: "Vous entendez 'Shin'. Quelle est cette lettre?", options: ["س", "ص", "ش", "ث"], correct: 2, hint: "Shin = شين. Sin + 3 points au-dessus = le son 'ch'!" },
  { type: "listen_mcq", letter: "ض", question: "Vous entendez 'Dad'. Quelle est cette lettre?", options: ["ص", "د", "ذ", "ض"], correct: 3, hint: "Dad = ضاد. Le D emphatique, unique à l'arabe!" },
  { type: "listen_mcq", letter: "ط", question: "Vous entendez 'Taa emphatique'. Quelle lettre?", options: ["ت", "ط", "ث", "ظ"], correct: 1, hint: "طاء = le T profond, prononcé depuis le fond de la gorge." },
  { type: "listen_mcq", letter: "و", question: "Vous entendez 'Waw'. Quelle est cette lettre?", options: ["ر", "ز", "و", "ي"], correct: 2, hint: "Waw = واو. Tête ronde avec une queue, ne se connecte pas." },
  // Draw type — covers all 28 letters
  { type: "draw", letter: "ا", question: "Dessinez la lettre 'Alif'", hint: "Un simple trait vertical, la lettre la plus simple!" },
  { type: "draw", letter: "ب", question: "Dessinez la lettre 'Ba'", hint: "Un bol avec UN point en dessous" },
  { type: "draw", letter: "ت", question: "Dessinez la lettre 'Ta'", hint: "Même bol que Ba, mais DEUX points au-dessus" },
  { type: "draw", letter: "ث", question: "Dessinez la lettre 'Tha'", hint: "Même bol, mais TROIS points au-dessus" },
  { type: "draw", letter: "ج", question: "Dessinez la lettre 'Jim'", hint: "Un crochet avec un point au milieu" },
  { type: "draw", letter: "ح", question: "Dessinez la lettre 'Ha'", hint: "Même forme que Jim, sans aucun point" },
  { type: "draw", letter: "خ", question: "Dessinez la lettre 'Kha'", hint: "Comme Ha mais avec un point AU-DESSUS" },
  { type: "draw", letter: "د", question: "Dessinez la lettre 'Dal'", hint: "Une petite bosse, simple et courte" },
  { type: "draw", letter: "ذ", question: "Dessinez la lettre 'Dhal'", hint: "Dal + un point au-dessus" },
  { type: "draw", letter: "ر", question: "Dessinez la lettre 'Ra'", hint: "Une courbe douce vers le bas" },
  { type: "draw", letter: "ز", question: "Dessinez la lettre 'Zay'", hint: "Ra + un point au-dessus" },
  { type: "draw", letter: "س", question: "Dessinez la lettre 'Sin'", hint: "Trois petites vagues horizontales" },
  { type: "draw", letter: "ش", question: "Dessinez la lettre 'Shin'", hint: "Sin + trois points au-dessus" },
  { type: "draw", letter: "ص", question: "Dessinez la lettre 'Sad'", hint: "Une boucle ronde avec une queue" },
  { type: "draw", letter: "ض", question: "Dessinez la lettre 'Dad'", hint: "Sad + un point au-dessus" },
  { type: "draw", letter: "ط", question: "Dessinez la lettre 'Taa'", hint: "Une boucle avec un trait vertical dedans" },
  { type: "draw", letter: "ظ", question: "Dessinez la lettre 'Dha'", hint: "Taa + un point au-dessus" },
  { type: "draw", letter: "ع", question: "Dessinez la lettre 'Ayn'", hint: "Forme ouverte en haut, comme un œil" },
  { type: "draw", letter: "غ", question: "Dessinez la lettre 'Ghayn'", hint: "Ayn + un point au-dessus" },
  { type: "draw", letter: "ف", question: "Dessinez la lettre 'Fa'", hint: "Un cercle avec un point AU-DESSUS et une queue" },
  { type: "draw", letter: "ق", question: "Dessinez la lettre 'Qaf'", hint: "Comme Fa mais DEUX points en dessous, plus arrondi" },
  { type: "draw", letter: "ك", question: "Dessinez la lettre 'Kaf'", hint: "Grande courbe avec un petit trait intérieur" },
  { type: "draw", letter: "ل", question: "Dessinez la lettre 'Lam'", hint: "Une belle courbe élégante, comme un crochet inversé" },
  { type: "draw", letter: "م", question: "Dessinez la lettre 'Meem'", hint: "Petit cercle avec une queue qui descend" },
  { type: "draw", letter: "ن", question: "Dessinez la lettre 'Nun'", hint: "Un bol profond avec un point AU-DESSUS" },
  { type: "draw", letter: "ه", question: "Dessinez la lettre 'Ha'", hint: "Deux petits cercles liés ensemble" },
  { type: "draw", letter: "و", question: "Dessinez la lettre 'Waw'", hint: "Tête ronde avec une queue qui descend" },
  { type: "draw", letter: "ي", question: "Dessinez la lettre 'Ya'", hint: "Deux points en dessous, queue qui plonge" },
];

// Shuffle and pick N quizzes — guarantees at least 3 draw questions per session
function getShuffledQuizzes(n = 10) {
  const byType = (type) => ALL_QUIZZES.filter(q => q.type === type).sort(() => Math.random() - 0.5);
  const draws    = byType("draw").slice(0, 3);
  const others   = ALL_QUIZZES.filter(q => q.type !== "draw").sort(() => Math.random() - 0.5).slice(0, n - 3);
  return [...draws, ...others].sort(() => Math.random() - 0.5);
}

// ─── Vocabulary categories ────────────────────────────────────────────────────
const VOCABULARY_CATEGORIES = [
  {
    label: "Salutations",
    icon: "👋",
    color: "#10b981",
    words: [
      { ar: "مَرْحَباً", tr: "Marhaban", fr: "Bonjour / Bienvenue", en: "Hello / Welcome", emoji: "👋" },
      { ar: "السَّلَامُ عَلَيْكُمْ", tr: "Assalāmu ʿalaykum", fr: "La paix sur vous", en: "Peace be upon you", emoji: "🕊️" },
      { ar: "أَهْلاً وَسَهْلاً", tr: "Ahlan wa sahlan", fr: "Bienvenue (chaleureux)", en: "Welcome (warm)", emoji: "🤗" },
      { ar: "كَيْفَ حَالُكَ؟", tr: "Kayfa ḥāluk?", fr: "Comment vas-tu?", en: "How are you?", emoji: "😊" },
      { ar: "بِخَيْر", tr: "Bikhair", fr: "Bien / Ça va", en: "Fine / Well", emoji: "✅" },
      { ar: "مَعَ السَّلَامَة", tr: "Maʿa as-salāma", fr: "Au revoir", en: "Goodbye", emoji: "👋" },
      { ar: "إِلَى اللِّقَاء", tr: "Ilā al-liqāʾ", fr: "À bientôt", en: "See you soon", emoji: "🌟" },
      { ar: "صَبَاحَ الخَيْر", tr: "Ṣabāḥ al-khayr", fr: "Bonjour (matin)", en: "Good morning", emoji: "🌅" },
      { ar: "مَسَاءَ الخَيْر", tr: "Masāʾ al-khayr", fr: "Bonsoir", en: "Good evening", emoji: "🌆" },
    ],
  },
  {
    label: "Politesse",
    icon: "🙏",
    color: "#8b5cf6",
    words: [
      { ar: "شُكْراً", tr: "Shukran", fr: "Merci", en: "Thank you", emoji: "🙏" },
      { ar: "شُكْراً جَزِيلاً", tr: "Shukran jazīlan", fr: "Merci beaucoup", en: "Thank you very much", emoji: "💖" },
      { ar: "عَفْواً", tr: "ʿAfwan", fr: "De rien / Pardon", en: "You're welcome / Sorry", emoji: "😇" },
      { ar: "مِنْ فَضْلِكَ", tr: "Min faḍlik", fr: "S'il vous plaît", en: "Please", emoji: "🤲" },
      { ar: "آسِف", tr: "Āsif", fr: "Désolé", en: "Sorry", emoji: "😔" },
      { ar: "نَعَم", tr: "Naʿam", fr: "Oui", en: "Yes", emoji: "✔️" },
      { ar: "لَا", tr: "Lā", fr: "Non", en: "No", emoji: "❌" },
      { ar: "بِالتَّوْفِيق", tr: "Bit-tawfīq", fr: "Bonne chance", en: "Good luck", emoji: "🍀" },
    ],
  },
  {
    label: "Nature",
    icon: "🌿",
    color: "#06b6d4",
    words: [
      { ar: "شَمْس", tr: "Shams", fr: "Soleil", en: "Sun", emoji: "☀️" },
      { ar: "قَمَر", tr: "Qamar", fr: "Lune", en: "Moon", emoji: "🌙" },
      { ar: "نَجْمَة", tr: "Najma", fr: "Étoile", en: "Star", emoji: "⭐" },
      { ar: "مَاء", tr: "Māʾ", fr: "Eau", en: "Water", emoji: "💧" },
      { ar: "نَار", tr: "Nār", fr: "Feu", en: "Fire", emoji: "🔥" },
      { ar: "هَوَاء", tr: "Hawāʾ", fr: "Air / Vent", en: "Air / Wind", emoji: "💨" },
      { ar: "أَرْض", tr: "Arḍ", fr: "Terre / Sol", en: "Earth / Ground", emoji: "🌍" },
      { ar: "بَحْر", tr: "Baḥr", fr: "Mer / Océan", en: "Sea / Ocean", emoji: "🌊" },
      { ar: "جَبَل", tr: "Jabal", fr: "Montagne", en: "Mountain", emoji: "⛰️" },
      { ar: "شَجَرَة", tr: "Shajara", fr: "Arbre", en: "Tree", emoji: "🌳" },
      { ar: "وَرْدَة", tr: "Warda", fr: "Rose / Fleur", en: "Rose / Flower", emoji: "🌹" },
      { ar: "سَمَاء", tr: "Samāʾ", fr: "Ciel", en: "Sky", emoji: "🌌" },
    ],
  },
  {
    label: "Famille",
    icon: "👨‍👩‍👧",
    color: "#f59e0b",
    words: [
      { ar: "أُمّ", tr: "Umm", fr: "Mère", en: "Mother", emoji: "👩" },
      { ar: "أَب", tr: "Ab", fr: "Père", en: "Father", emoji: "👨" },
      { ar: "أَخ", tr: "Akh", fr: "Frère", en: "Brother", emoji: "👦" },
      { ar: "أُخْت", tr: "Ukht", fr: "Sœur", en: "Sister", emoji: "👧" },
      { ar: "جَدَّة", tr: "Jadda", fr: "Grand-mère", en: "Grandmother", emoji: "👵" },
      { ar: "جَدّ", tr: "Jadd", fr: "Grand-père", en: "Grandfather", emoji: "👴" },
      { ar: "طِفْل", tr: "Ṭifl", fr: "Enfant", en: "Child", emoji: "🧒" },
      { ar: "عَائِلَة", tr: "ʿĀʾila", fr: "Famille", en: "Family", emoji: "👨‍👩‍👧‍👦" },
    ],
  },
  {
    label: "Nourriture",
    icon: "🍽️",
    color: "#ef4444",
    words: [
      { ar: "خُبْز", tr: "Khubz", fr: "Pain", en: "Bread", emoji: "🍞" },
      { ar: "تَمْر", tr: "Tamr", fr: "Dattes", en: "Dates", emoji: "🌴" },
      { ar: "لَبَن", tr: "Laban", fr: "Lait / Yaourt", en: "Milk / Yogurt", emoji: "🥛" },
      { ar: "عَسَل", tr: "ʿAsal", fr: "Miel", en: "Honey", emoji: "🍯" },
      { ar: "شَاي", tr: "Shāy", fr: "Thé", en: "Tea", emoji: "🍵" },
      { ar: "قَهْوَة", tr: "Qahwa", fr: "Café", en: "Coffee", emoji: "☕" },
      { ar: "تُفَّاح", tr: "Tuffāḥ", fr: "Pomme", en: "Apple", emoji: "🍎" },
      { ar: "مَوْز", tr: "Mawz", fr: "Banane", en: "Banana", emoji: "🍌" },
      { ar: "سَمَك", tr: "Samak", fr: "Poisson", en: "Fish", emoji: "🐟" },
      { ar: "لَحْم", tr: "Laḥm", fr: "Viande", en: "Meat", emoji: "🥩" },
    ],
  },
  {
    label: "Maison & Objets",
    icon: "🏠",
    color: "#84cc16",
    words: [
      { ar: "بَيْت", tr: "Bayt", fr: "Maison", en: "House", emoji: "🏠" },
      { ar: "بَاب", tr: "Bāb", fr: "Porte", en: "Door", emoji: "🚪" },
      { ar: "نَافِذَة", tr: "Nāfidha", fr: "Fenêtre", en: "Window", emoji: "🪟" },
      { ar: "كِتَاب", tr: "Kitāb", fr: "Livre", en: "Book", emoji: "📚" },
      { ar: "قَلَم", tr: "Qalam", fr: "Stylo", en: "Pen", emoji: "✏️" },
      { ar: "كُرْسِي", tr: "Kursī", fr: "Chaise", en: "Chair", emoji: "🪑" },
      { ar: "طَاوِلَة", tr: "Ṭāwila", fr: "Table", en: "Table", emoji: "🪵" },
      { ar: "مَطْبَخ", tr: "Maṭbakh", fr: "Cuisine", en: "Kitchen", emoji: "🍳" },
      { ar: "سَرِير", tr: "Sarīr", fr: "Lit", en: "Bed", emoji: "🛏️" },
      { ar: "مِصْبَاح", tr: "Miṣbāḥ", fr: "Lampe", en: "Lamp", emoji: "💡" },
    ],
  },
  {
    label: "Couleurs & Chiffres",
    icon: "🎨",
    color: "#ec4899",
    words: [
      { ar: "أَحْمَر", tr: "Aḥmar", fr: "Rouge", en: "Red", emoji: "🔴" },
      { ar: "أَزْرَق", tr: "Azraq", fr: "Bleu", en: "Blue", emoji: "🔵" },
      { ar: "أَخْضَر", tr: "Akhḍar", fr: "Vert", en: "Green", emoji: "🟢" },
      { ar: "أَصْفَر", tr: "Aṣfar", fr: "Jaune", en: "Yellow", emoji: "🟡" },
      { ar: "أَبْيَض", tr: "Abyaḍ", fr: "Blanc", en: "White", emoji: "⬜" },
      { ar: "أَسْوَد", tr: "Aswad", fr: "Noir", en: "Black", emoji: "⬛" },
      { ar: "وَاحِد", tr: "Wāḥid", fr: "Un (1)", en: "One (1)", emoji: "1️⃣" },
      { ar: "اثْنَان", tr: "Ithnān", fr: "Deux (2)", en: "Two (2)", emoji: "2️⃣" },
      { ar: "ثَلَاثَة", tr: "Thalātha", fr: "Trois (3)", en: "Three (3)", emoji: "3️⃣" },
      { ar: "عَشَرَة", tr: "ʿAshara", fr: "Dix (10)", en: "Ten (10)", emoji: "🔟" },
    ],
  },
];

// ─── Audio: single source of truth ───────────────────────────────────────────
const GT_TTS = (text) =>
  `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=ar&client=gtx&q=${encodeURIComponent(text)}`;

// Global audio instance — ensures only ONE audio plays at a time, no doubles
let _currentAudio = null;
function stopAllAudio() {
  if (_currentAudio) {
    try { _currentAudio.pause(); _currentAudio.currentTime = 0; } catch (_) {}
    _currentAudio = null;
  }
  try { window.speechSynthesis.cancel(); } catch (_) {}
    notifyAllButtons();

}

function playArabicAudio(text, buttonId) {
  stopAllAudio();

  const url = GT_TTS(text);
  const audio = new Audio(url);
  audio.crossOrigin = "anonymous";
  audio.dataset.id = buttonId;
  _currentAudio = audio;
  notifyAllButtons();

  const MIN_DISPLAY_MS = 2000; // "En cours" shows for at least 2s
  const startTime = Date.now();

  const finish = () => {
    _currentAudio = null;
    const elapsed = Date.now() - startTime;
    const remaining = MIN_DISPLAY_MS - elapsed;
    if (remaining > 0) {
      setTimeout(() => notifyAllButtons(), remaining);
    } else {
      notifyAllButtons();
    }
  };

  audio.onended = finish;
  audio.onerror = () => {
    _currentAudio = null;
    notifyAllButtons();
    speakTextFallback(text, buttonId);
  };

  audio.play().catch(() => {
    _currentAudio = null;
    notifyAllButtons();
    speakTextFallback(text, buttonId);
  });
}
let _playingSetters = new Set(); // tracks all AudioButton setState fns

function notifyAllButtons() {
  _playingSetters.forEach(fn => fn(_currentAudio?.dataset?.id));
}

function speakTextFallback(text, buttonId) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const doSpeak = () => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA"; u.rate = 0.65; u.pitch = 1.0;
    const arVoice = synth.getVoices().find(v => v.lang.startsWith("ar"));
    if (arVoice) u.voice = arVoice;
    u.onend = u.onerror = () => { _currentAudio = null; notifyAllButtons(); };
    synth.speak(u);
  };
  if (synth.getVoices().length > 0) doSpeak();
  else { synth.onvoiceschanged = () => { synth.onvoiceschanged = null; doSpeak(); }; setTimeout(doSpeak, 1000); }
}

// Kept for backward-compat with call sites that pass audioKey (ignored now — all use GT_TTS)
function playLetterAudio(audioKey, ttsText, onStart, onEnd) {
  playArabicAudio(ttsText, audioKey);
}

// ─── AudioButton ──────────────────────────────────────────────────────────────
function AudioButton({ audioKey, tts, display, color, label = "Écouter la lettre" }) {
  const buttonId = audioKey || display;
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    _playingSetters.add(setActiveId);
    return () => _playingSetters.delete(setActiveId);
  }, []);

  const playing = activeId === buttonId;

  const handleClick = () => {
    if (playing) { stopAllAudio(); return; }
    playArabicAudio(tts || display, buttonId);
  };

  return (
    <button onClick={handleClick} style={{
      width: "100%",
      background: playing ? `${color}44` : `${color}18`,
      border: `1.5px solid ${playing ? color : color + "44"}`,
      color,
      borderRadius: 14,
      padding: "12px",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "all 0.2s ease",
      transform: playing ? "scale(0.97)" : "scale(1)",
    }}>
      <Volume2 size={18} style={{ animation: playing ? "soundWave 0.4s ease infinite alternate" : "none" }} />
      {playing ? "🔊 En cours… (cliquer pour stopper)" : label}
    </button>
  );
}

// ─── MicButton ────────────────────────────────────────────────────────────────
function MicButton({ targetAr, onResult }) {
  const [state, setState] = useState("idle");
  const recogRef = useRef(null);
  const forceStopRef = useRef(null);
  const stop = useCallback((nextState = "idle") => {
    clearTimeout(forceStopRef.current);
    try { recogRef.current && recogRef.current.stop(); } catch (_) {}
    recogRef.current = null; setState(nextState);
  }, []);
  const handleClick = () => {
    if (state === "listening") { stop("idle"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setState("unsupported"); return; }
    const recognition = new SR();
    recogRef.current = recognition;
    recognition.lang = "ar-SA"; recognition.continuous = false; recognition.interimResults = false; recognition.maxAlternatives = 3;
    setState("listening");
    forceStopRef.current = setTimeout(() => stop("idle"), 7000);
    recognition.onresult = (event) => {
      clearTimeout(forceStopRef.current); setState("processing");
      const results = Array.from(event.results[0]);
      const transcript = results[0].transcript;
      const confidence = results[0].confidence ?? 0.5;
      const norm = s => s.replace(/[\u064B-\u065F\u0670]/g, "").trim();
      const said = norm(transcript); const target = norm(targetAr || "");
      const matched = said === target || said.includes(target) || target.includes(said);
      setTimeout(() => { setState(matched ? "correct" : "wrong"); onResult && onResult(transcript, confidence, matched); setTimeout(() => setState("idle"), 3000); }, 300);
    };
    recognition.onerror = (e) => { clearTimeout(forceStopRef.current); setState(e.error === "no-speech" ? "idle" : "error"); if (e.error !== "no-speech") setTimeout(() => setState("idle"), 2500); };
    recognition.onend = () => { clearTimeout(forceStopRef.current); setState(s => (s === "listening" ? "idle" : s)); };
    try { recognition.start(); } catch (_) { stop("error"); }
  };
  const cfg = {
    idle:        { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)", text: "🎙 Prononcer — dites: " + (targetAr || "") },
    listening:   { bg: "rgba(239,68,68,0.15)",   border: "#ef4444",                color: "#ef4444",               text: "🔴 En écoute… (cliquez pour annuler)" },
    processing:  { bg: "rgba(245,158,11,0.15)",   border: "#f59e0b",                color: "#f59e0b",               text: "⏳ Analyse…" },
    correct:     { bg: "rgba(16,185,129,0.15)",   border: "#10b981",                color: "#10b981",               text: "✓ Bonne prononciation!" },
    wrong:       { bg: "rgba(245,158,11,0.12)",   border: "#f59e0b",                color: "#f59e0b",               text: "Essayez encore!" },
    error:       { bg: "rgba(239,68,68,0.08)",    border: "#ef4444",                color: "#ef4444",               text: "✗ Erreur micro" },
    unsupported: { bg: "rgba(255,255,255,0.03)",  border: "rgba(255,255,255,0.1)",  color: "rgba(255,255,255,0.3)", text: "✗ Non supporté (utilisez Chrome)" },
  };
  const c = cfg[state] || cfg.idle;
  return (
    <button onClick={handleClick} style={{ width: "100%", background: c.bg, border: `1.5px solid ${c.border}`, color: c.color, borderRadius: 14, padding: "12px 16px", fontSize: 13, fontWeight: 700, cursor: state === "unsupported" ? "default" : "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.25s ease", position: "relative", overflow: "hidden" }}>
      {state === "listening" && (<><span style={{ position: "absolute", inset: 0, borderRadius: 14, border: "2px solid #ef4444", animation: "micPulse 1s ease-out infinite", pointerEvents: "none" }} /><span style={{ position: "absolute", inset: 0, borderRadius: 14, border: "2px solid #ef4444", animation: "micPulse 1s ease-out 0.4s infinite", pointerEvents: "none" }} /></>)}
      <Mic size={15} style={{ flexShrink: 0, transform: state === "listening" ? "scale(1.3)" : "scale(1)", transition: "transform 0.2s" }} />
      <span style={{ textAlign: "left", lineHeight: 1.3 }}>{c.text}</span>
    </button>
  );
}

// ─── DrawingPad ───────────────────────────────────────────────────────────────
function DrawingPad({ targetName, onSuccess, forms, compact = false }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [letterForm, setLetterForm] = useState(0);
  const lastPos = useRef(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [feedback, setFeedback] = useState("");

  const drawGuideLines = useCallback((ctx, w, h) => {
    ctx.strokeStyle = "rgba(139,92,246,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const drawGhostLetter = useCallback((ctx, w, h) => {
    ctx.font = `${h * 0.6}px 'Amiri', serif`;
    ctx.fillStyle = "rgba(139,92,246,0.15)";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(forms[letterForm], w / 2, h / 2);
  }, [forms, letterForm]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1e1b4b"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuideLines(ctx, canvas.width, canvas.height);
    if (showTarget) drawGhostLetter(ctx, canvas.width, canvas.height);
  }, [showTarget, drawGuideLines, drawGhostLetter]);

  useEffect(() => { redraw(); }, [redraw]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const startDraw = (e) => { e.preventDefault(); setIsDrawing(true); setHasDrawn(true); lastPos.current = getPos(e, canvasRef.current); };
  const draw = (e) => {
    e.preventDefault(); if (!isDrawing) return;
    const canvas = canvasRef.current; const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke(); lastPos.current = pos;
  };
  const endDraw = () => { if (isDrawing) setStrokeCount(s => s + 1); setIsDrawing(false); lastPos.current = null; };
  const clearCanvas = () => { redraw(); setHasDrawn(false); setStrokeCount(0); setFeedback(""); };

  const handleSuccess = () => {
    const names = ["isolée", "initiale", "médiale", "finale"];
    setFeedback(`✓ Forme ${names[letterForm]} maîtrisée!`);
    setTimeout(() => {
      if (letterForm < 3) { setLetterForm(f => f + 1); clearCanvas(); }
      else onSuccess();
    }, 1200);
  };

  const canvasHeight = compact ? 200 : 300;

  return (
    <div style={{ background: "#0f0c29", borderRadius: 20, padding: compact ? "1rem" : "1.5rem", border: "1px solid rgba(139,92,246,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div>
          <p style={{ color: "#a78bfa", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>Atelier d'écriture</p>
          <p style={{ color: "white", fontSize: compact ? 14 : 16, fontWeight: 700, margin: 0 }}>
            Trace <span style={{ color: "#a78bfa" }}>{forms[letterForm]}</span> — {targetName} ({["isolée","initiale","médiale","finale"][letterForm]})
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setShowTarget(s => !s)} style={{ background: showTarget ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            {showTarget ? "👻" : "👁 Guide"}
          </button>
          <button onClick={clearCanvas} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            <RotateCcw size={12} style={{ display: "inline", marginRight: 2 }} />Effacer
          </button>
        </div>
      </div>

      {feedback && <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 10, padding: "0.5rem", marginBottom: "0.75rem", color: "#10b981", fontWeight: 600, textAlign: "center", fontSize: 13 }}>{feedback}</div>}

      <canvas ref={canvasRef} width={560} height={canvasHeight}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        style={{ width: "100%", borderRadius: 12, cursor: "crosshair", touchAction: "none", display: "block" }} />

      {!compact && (
        <div style={{ display: "flex", gap: 6, marginTop: "0.75rem", justifyContent: "center" }}>
          {["Isolée","Initiale","Médiale","Finale"].map((name, i) => (
            <button key={i} onClick={() => { setLetterForm(i); clearCanvas(); }}
              style={{ padding: "5px 10px", borderRadius: 6, border: `1.5px solid ${letterForm === i ? "#a78bfa" : "rgba(255,255,255,0.1)"}`, background: letterForm === i ? "rgba(167,139,250,0.2)" : "transparent", color: letterForm === i ? "#a78bfa" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 11, fontWeight: 600, transition: "all 0.2s" }}>
              {name}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>
          {strokeCount > 0 ? `${strokeCount} trait${strokeCount > 1 ? "s" : ""}` : "Dessine avec ta souris ou ton doigt"}
        </p>
        {hasDrawn && strokeCount >= 1 && (
          <button onClick={handleSuccess} style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "none", color: "white", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            ✓ {compact ? "Valider" : (letterForm === 3 ? "Terminé!" : "Suivant")}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── LetterCard ───────────────────────────────────────────────────────────────
function LetterCard({ letterData, index, onSelect, isSelected, learned }) {
  const [playing, setPlaying] = useState(false);
  const speak = (e) => {
    e.stopPropagation();
    if (playing) { stopAllAudio(); setPlaying(false); return; }
    playArabicAudio(letterData.tts, () => setPlaying(true), () => setPlaying(false));
  };
  return (
    <div onClick={() => onSelect(index)} style={{ background: isSelected ? `linear-gradient(135deg, ${letterData.color}22, ${letterData.color}44)` : "rgba(255,255,255,0.03)", border: `1.5px solid ${isSelected ? letterData.color : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "1rem", cursor: "pointer", transition: "all 0.2s", position: "relative", textAlign: "center" }}>
      {learned && <div style={{ position: "absolute", top: 8, right: 8, background: "#10b981", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={12} color="white" /></div>}
      <div style={{ fontSize: 42, lineHeight: 1.2, marginBottom: 6, fontFamily: "'Amiri', serif", color: "white" }}>{letterData.letter}</div>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>{letterData.fr}</p>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "0 0 8px" }}>[{letterData.transcription}]</p>
      <button onClick={speak} style={{ background: playing ? `${letterData.color}44` : `${letterData.color}22`, border: `1px solid ${letterData.color}44`, color: letterData.color, borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", width: "100%", transition: "all 0.2s" }}>
        <Volume2 size={11} style={{ display: "inline", marginRight: 4, animation: playing ? "soundWave 0.4s ease infinite alternate" : "none" }} />
        {playing ? "🔊" : "Écouter"}
      </button>
    </div>
  );
}

// ─── VocabCard ────────────────────────────────────────────────────────────────
function VocabCard({ v }) {
  const [playing, setPlaying] = useState(false);
  const handleClick = () => {
    if (playing) { stopAllAudio(); setPlaying(false); return; }
    playArabicAudio(v.ar, () => setPlaying(true), () => setPlaying(false));
  };
  return (
    <div onClick={handleClick} style={{ background: playing ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${playing ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "1rem 1.25rem", cursor: "pointer", transition: "all 0.2s" }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{v.emoji}</div>
      <div style={{ fontSize: 32, fontFamily: "'Amiri', serif", color: "white", marginBottom: 6, direction: "rtl" }}>{v.ar}</div>
      <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: "#a78bfa" }}>{v.tr}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>🇫🇷 {v.fr}</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>·</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>🇬🇧 {v.en}</span>
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, color: playing ? "#a78bfa" : "rgba(139,92,246,0.6)", fontSize: 11, fontWeight: playing ? 700 : 400 }}>
        <Volume2 size={11} style={{ animation: playing ? "soundWave 0.4s ease infinite alternate" : "none" }} />
        {playing ? "🔊 En cours…" : "Appuie pour écouter"}
      </div>
    </div>
  );
}

// ─── QuizDrawPanel — the quiz drawing sub-component ──────────────────────────
function QuizDrawPanel({ quiz, onDone }) {
  const letterData = ARABIC_LETTERS.find(l => l.letter === quiz.letter);
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#a78bfa" }}>{quiz.question}</p>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>💡 {quiz.hint}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 16, alignItems: "start" }}>
        <DrawingPad
          targetName={letterData?.fr || quiz.letter}
          forms={letterData?.forms || [quiz.letter, quiz.letter, quiz.letter, quiz.letter]}
          onSuccess={onDone}
          compact={true}
        />
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontSize: 72, fontFamily: "'Amiri', serif", color: "white", marginBottom: 8 }}>{quiz.letter}</div>
          <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 16, color: "white" }}>{letterData?.fr}</p>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>[{letterData?.transcription}]</p>
          <AudioButton
            audioKey={letterData?.audioKey}
            tts={letterData?.tts}
            display={quiz.letter}
            color="#a78bfa"
            label="🔊 Écouter"
          />
          <div style={{ marginTop: 8 }}>
            {(letterData?.forms || []).map((f, i) => (
              <div key={i} style={{ display: "inline-block", margin: 4, padding: "4px 8px", background: "rgba(167,139,250,0.1)", borderRadius: 6, fontSize: 18, fontFamily: "'Amiri', serif", color: "#a78bfa" }}>{f}</div>
            ))}
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 10, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>4 formes</p>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button onClick={onDone} style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          Passer cette question →
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function AlphabetArabe() {
  const [activeTab, setActiveTab] = useState("lettres");
  const [selectedLetterIdx, setSelectedLetterIdx] = useState(0);
  const [learnedLetters, setLearnedLetters] = useState(new Set());

  // Quiz state
  const [quizzes, setQuizzes] = useState(() => getShuffledQuizzes(10));
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null); // null | true | false
  const [quizDone, setQuizDone] = useState(false);
  const [quizUserAnswer, setQuizUserAnswer] = useState("");
  const [quizDrawDone, setQuizDrawDone] = useState(false);

  // Vocab state
  const [activeVocabCat, setActiveVocabCat] = useState(0);

  // Translator state
  const [dictSearchTerm, setDictSearchTerm] = useState("");
  const [dictLanguage, setDictLanguage] = useState("english");
  const [dictResults, setDictResults] = useState(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState("");

  // Writing workshop state
  const [drawingLetter, setDrawingLetter] = useState(null);
  const [practicedLetters, setPracticedLetters] = useState(new Set());

  // XP
  const [xp, setXp] = useState(0);
  const [showXpPop, setShowXpPop] = useState(false);
  const [micResult, setMicResult] = useState(null);

  const selectedLetter = ARABIC_LETTERS[selectedLetterIdx];
  const currentQuiz = quizzes[quizStep];

  const addXp = (amount) => { setXp(x => x + amount); setShowXpPop(true); setTimeout(() => setShowXpPop(false), 1500); };

  const handleMicResult = (transcript, confidence, matched) => {
    setMicResult({ transcript, confidence, matched });
    if (matched || confidence > 0.5) addXp(15);
    setTimeout(() => setMicResult(null), 3500);
  };

  const handleDictSearch = async (e) => {
    e.preventDefault();
    if (!dictSearchTerm.trim()) { setDictError("Entrez un mot à chercher"); return; }
    setDictLoading(true); setDictError(""); setDictResults(null);
    try {
      const response = await axios.get("http://localhost:5000/api/dictionary/translate", { params: { word: dictSearchTerm.trim(), language: dictLanguage } });
      if (response.data.success) { setDictResults(response.data); addXp(5); }
      else setDictError(response.data.message || "Mot introuvable.");
    } catch { setDictError("Erreur de connexion au serveur."); }
    finally { setDictLoading(false); }
  };

  // MCQ / listen_mcq answer
  const handleMcqAnswer = (idx) => {
    if (quizAnswered !== null) return;
    const isCorrect = idx === currentQuiz.correct;
    setQuizAnswered(isCorrect);
    if (isCorrect) { setQuizScore(s => s + 1); addXp(20); }
    setTimeout(() => advanceQuiz(), 1400);
  };

  // Write answer
  const handleWriteAnswer = (userText) => {
    if (quizAnswered !== null) return;
    const isCorrect = userText.trim() === currentQuiz.letter;
    setQuizAnswered(isCorrect);
    if (isCorrect) { setQuizScore(s => s + 1); addXp(20); }
    setTimeout(() => advanceQuiz(), 1400);
  };

  // Draw quiz done
  const handleDrawDone = () => {
    if (!quizDrawDone) { setQuizScore(s => s + 1); addXp(20); setQuizDrawDone(true); }
    setTimeout(() => advanceQuiz(), 400);
  };

  const advanceQuiz = () => {
    if (quizStep + 1 >= quizzes.length) setQuizDone(true);
    else { setQuizStep(s => s + 1); setQuizAnswered(null); setQuizUserAnswer(""); setQuizDrawDone(false); }
  };

  const resetQuiz = () => {
    setQuizzes(getShuffledQuizzes(10));
    setQuizStep(0); setQuizScore(0); setQuizAnswered(null);
    setQuizDone(false); setQuizUserAnswer(""); setQuizDrawDone(false);
  };

  const markLearned = (idx) => { if (!learnedLetters.has(idx)) { setLearnedLetters(prev => new Set([...prev, idx])); addXp(10); } };

  const tabs = [
    { id: "lettres", label: "Les 28 Lettres", icon: "📖" },
    { id: "ecriture", label: "Atelier Écriture", icon: "✏️" },
    { id: "quiz", label: "Quiz", icon: "🎯" },
    { id: "vocabulaire", label: "Vocabulaire", icon: "💬" },
    { id: "traducteur", label: "Traducteur", icon: "🔤" },
  ];

  // Badge for quiz type
  const quizTypeBadge = (type) => {
    const map = { mcq: { label: "Choix multiple", color: "#3b82f6" }, write: { label: "Écriture", color: "#8b5cf6" }, listen_mcq: { label: "Écoute", color: "#10b981" }, draw: { label: "Dessin ✏️", color: "#f59e0b" } };
    const t = map[type] || { label: type, color: "#888" };
    return <span style={{ background: `${t.color}22`, border: `1px solid ${t.color}55`, color: t.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 12 }}>{t.label}</span>;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09080f", color: "white", fontFamily: "'Inter', sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f0c29 100%)", borderBottom: "1px solid rgba(139,92,246,0.2)", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link to="/courses" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              <ArrowLeft size={18} /> Cours
            </Link>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "white" }}>الأبجدية العربية</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Alphabet Arabe & Phonétique</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
              <Zap size={14} color="#f59e0b" />
              <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14 }}>{xp} XP</span>
              {showXpPop && <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#1e1b4b", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", animation: "fadeUp 1.5s ease forwards" }}>+XP!</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>PROGRESSION</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 100, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${Math.round((learnedLetters.size / 28) * 100)}%`, height: "100%", background: "linear-gradient(90deg, #8b5cf6, #10b981)", borderRadius: 3, transition: "width 0.5s" }} />
                </div>
                <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{learnedLetters.size}/28</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#0f0c29", borderBottom: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "1rem 1.5rem", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 700, color: activeTab === t.id ? "#a78bfa" : "rgba(255,255,255,0.35)", borderBottom: activeTab === t.id ? "2px solid #a78bfa" : "2px solid transparent", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ===== LES 28 LETTRES ===== */}
        {activeTab === "lettres" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 390px", gap: 24 }}>
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Les 28 Lettres Arabes</h2>
                <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Clique sur une lettre pour explorer. Appuie sur Écouter pour entendre la prononciation native.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
                {ARABIC_LETTERS.map((l, i) => <LetterCard key={i} letterData={l} index={i} onSelect={setSelectedLetterIdx} isSelected={selectedLetterIdx === i} learned={learnedLetters.has(i)} />)}
              </div>
            </div>
            <div style={{ position: "sticky", top: 24, height: "fit-content" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "1.5rem" }}>
                <div style={{ textAlign: "center", background: `linear-gradient(135deg, ${selectedLetter.color}11, ${selectedLetter.color}22)`, borderRadius: 20, padding: "2rem 1rem", marginBottom: "1.5rem", border: `1px solid ${selectedLetter.color}33` }}>
                  <div style={{ fontSize: 96, fontFamily: "'Amiri', serif", lineHeight: 1, color: "white", marginBottom: 8 }}>{selectedLetter.letter}</div>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white" }}>{selectedLetter.fr}</p>
                  <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>[ {selectedLetter.transcription} ]</p>
                </div>
                <AudioButton audioKey={selectedLetter.audioKey} tts={selectedLetter.tts} display={selectedLetter.letter} color={selectedLetter.color} label="🔊 Écouter la lettre (audio natif)" />
                <MicButton targetAr={selectedLetter.ar} onResult={handleMicResult} />
                {micResult && (
                  <div style={{ background: micResult.matched ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${micResult.matched ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: 12, padding: "0.75rem", marginBottom: 16, textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: 14, color: micResult.matched ? "#10b981" : "#f59e0b", fontWeight: 700 }}>{micResult.matched ? "✓ Parfait!" : "Essayez encore!"} — «{micResult.transcript}»</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Confiance: {Math.round((micResult.confidence ?? 0) * 100)}%</p>
                  </div>
                )}
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: "0.75rem 1rem", marginBottom: 16 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>💡 ASTUCE MNÉMO</p>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{selectedLetter.tip}</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>4 Formes dans le mot</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
                    {["Isolée","Initiale","Médiale","Finale"].map((pos, i) => (
                      <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 4px" }}>
                        <div style={{ fontSize: 24, fontFamily: "'Amiri', serif", color: "white", marginBottom: 4 }}>{selectedLetter.forms[i]}</div>
                        <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase" }}>{pos}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setDrawingLetter(selectedLetterIdx); setActiveTab("ecriture"); }} style={{ flex: 1, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa", borderRadius: 12, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✏️ Pratiquer</button>
                  <button onClick={() => markLearned(selectedLetterIdx)} style={{ flex: 1, background: learnedLetters.has(selectedLetterIdx) ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${learnedLetters.has(selectedLetterIdx) ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`, color: learnedLetters.has(selectedLetterIdx) ? "#10b981" : "rgba(255,255,255,0.5)", borderRadius: 12, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {learnedLetters.has(selectedLetterIdx) ? "✓ Apprise!" : "☆ Marquer"}
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                  <button onClick={() => setSelectedLetterIdx(i => Math.max(0, i - 1))} disabled={selectedLetterIdx === 0} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Précédente</button>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, alignSelf: "center" }}>{selectedLetterIdx + 1}/28</span>
                  <button onClick={() => setSelectedLetterIdx(i => Math.min(27, i + 1))} disabled={selectedLetterIdx === 27} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Suivante →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ATELIER ÉCRITURE ===== */}
        {activeTab === "ecriture" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>✏️ Atelier d'Écriture</h2>
              <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Entraîne-toi à écrire les lettres arabes. Active le guide fantôme pour voir la forme.</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {ARABIC_LETTERS.map((l, i) => (
                <button key={i} onClick={() => setDrawingLetter(i)} style={{ background: drawingLetter === i ? `${l.color}33` : "rgba(255,255,255,0.04)", border: `1.5px solid ${drawingLetter === i ? l.color : "rgba(255,255,255,0.08)"}`, color: drawingLetter === i ? "white" : "rgba(255,255,255,0.5)", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 18, fontFamily: "'Amiri', serif", position: "relative" }}>
                  {l.letter}
                  {practicedLetters.has(i) && <span style={{ position: "absolute", top: -4, right: -4, background: "#10b981", borderRadius: "50%", width: 12, height: 12, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>}
                </button>
              ))}
            </div>
            {drawingLetter !== null ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
                <DrawingPad targetName={ARABIC_LETTERS[drawingLetter].fr} forms={ARABIC_LETTERS[drawingLetter].forms} onSuccess={() => { setPracticedLetters(prev => new Set([...prev, drawingLetter])); addXp(15); }} />
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "1.5rem" }}>
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: 80, fontFamily: "'Amiri', serif" }}>{ARABIC_LETTERS[drawingLetter].letter}</div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>{ARABIC_LETTERS[drawingLetter].fr}</p>
                    <p style={{ margin: "4px 0 12px", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>[ {ARABIC_LETTERS[drawingLetter].transcription} ]</p>
                    <AudioButton audioKey={ARABIC_LETTERS[drawingLetter].audioKey} tts={ARABIC_LETTERS[drawingLetter].tts} display={ARABIC_LETTERS[drawingLetter].letter} color="#a78bfa" label="🔊 Écouter" />
                  </div>
                  <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#f59e0b" }}>💡 ASTUCE</p>
                    <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{ARABIC_LETTERS[drawingLetter].tip}</p>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase" }}>4 Formes</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["Isolée","Init.","Méd.","Fin."].map((pos, i) => (
                        <div key={i} style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 2px" }}>
                          <div style={{ fontSize: 20, fontFamily: "'Amiri', serif", color: "white" }}>{ARABIC_LETTERS[drawingLetter].forms[i]}</div>
                          <p style={{ margin: 0, fontSize: 8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{pos}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 16, padding: "0.75rem", background: "rgba(16,185,129,0.08)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.2)" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{practicedLetters.size} / 28 lettres pratiquées</p>
                    <div style={{ marginTop: 6, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${(practicedLetters.size / 28) * 100}%`, height: "100%", background: "#10b981", transition: "width 0.5s", borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255,255,255,0.02)", borderRadius: 20, border: "1px dashed rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✏️</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>Sélectionne une lettre ci-dessus pour commencer</p>
              </div>
            )}
          </div>
        )}

        {/* ===== QUIZ ===== */}
        {activeTab === "quiz" && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>🎯 Quiz des Lettres</h2>
              <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 15 }}>4 types de questions — Chaque bonne réponse = +20 XP!</p>
            </div>

            {!quizDone ? (
              <div>
                {/* Progress bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${(quizStep / quizzes.length) * 100}%`, height: "100%", background: "linear-gradient(90deg, #8b5cf6, #a78bfa)", borderRadius: 3, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600 }}>{quizStep}/{quizzes.length}</span>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "2rem" }}>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    {quizTypeBadge(currentQuiz.type)}
                  </div>

                  {/* ── MCQ ── */}
                  {currentQuiz.type === "mcq" && (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 100, fontFamily: "'Amiri', serif", lineHeight: 1, marginBottom: 12 }}>{currentQuiz.letter}</div>
                      <AudioButton
                        audioKey={ARABIC_LETTERS.find(l => l.letter === currentQuiz.letter)?.audioKey}
                        tts={ARABIC_LETTERS.find(l => l.letter === currentQuiz.letter)?.tts}
                        display={currentQuiz.letter} color="#8b5cf6" label="🔊 Écouter la lettre" />
                      <p style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 20 }}>{currentQuiz.question}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {currentQuiz.options.map((opt, i) => {
                          let bg = "rgba(255,255,255,0.04)";
                          let border = "rgba(255,255,255,0.1)";
                          let color = "rgba(255,255,255,0.8)";
                          if (quizAnswered !== null) {
                            if (i === currentQuiz.correct) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; color = "#10b981"; }
                            else if (quizAnswered === false) { bg = "rgba(239,68,68,0.08)"; border = "rgba(239,68,68,0.3)"; color = "#f87171"; }
                          }
                          return (
                            <button key={i} onClick={() => handleMcqAnswer(i)} disabled={quizAnswered !== null}
                              style={{ background: bg, border: `1.5px solid ${border}`, color, borderRadius: 14, padding: "14px 16px", cursor: quizAnswered !== null ? "default" : "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s", textAlign: "left", fontFamily: opt.match(/[\u0600-\u06FF]/) ? "'Amiri', serif" : "inherit", fontSize: opt.match(/[\u0600-\u06FF]/) ? 24 : 14 }}>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizAnswered !== null && (
                        <div style={{ marginTop: 16, padding: "1rem", background: quizAnswered ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", borderRadius: 12, border: `1px solid ${quizAnswered ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                          <p style={{ margin: 0, fontSize: 15, color: quizAnswered ? "#10b981" : "#ef4444", fontWeight: 700 }}>
                            {quizAnswered ? "✓ Correct! Bien joué!" : `✗ Incorrect. La bonne réponse: ${currentQuiz.options[currentQuiz.correct]}`}
                          </p>
                          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>💡 {currentQuiz.hint}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── LISTEN_MCQ ── */}
                  {currentQuiz.type === "listen_mcq" && (
                    <div style={{ textAlign: "center" }}>
                      <AudioButton
                        audioKey={ARABIC_LETTERS.find(l => l.letter === currentQuiz.letter)?.audioKey}
                        tts={ARABIC_LETTERS.find(l => l.letter === currentQuiz.letter)?.tts}
                        display={currentQuiz.letter} color="#10b981" label="🔊 Écouter et identifier la lettre" />
                      <p style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 20 }}>{currentQuiz.question}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                        {currentQuiz.options.map((opt, i) => {
                          let bg = "rgba(255,255,255,0.04)";
                          let border = "rgba(255,255,255,0.1)";
                          let color = "white";
                          if (quizAnswered !== null) {
                            if (i === currentQuiz.correct) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; color = "#10b981"; }
                            else { bg = "rgba(239,68,68,0.08)"; border = "rgba(239,68,68,0.2)"; color = "rgba(255,255,255,0.3)"; }
                          }
                          return (
                            <button key={i} onClick={() => handleMcqAnswer(i)} disabled={quizAnswered !== null}
                              style={{ background: bg, border: `1.5px solid ${border}`, color, borderRadius: 14, padding: "20px 10px", cursor: quizAnswered !== null ? "default" : "pointer", fontSize: 36, fontFamily: "'Amiri', serif", transition: "all 0.2s" }}>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizAnswered !== null && (
                        <div style={{ marginTop: 16, padding: "1rem", background: quizAnswered ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", borderRadius: 12, border: `1px solid ${quizAnswered ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                          <p style={{ margin: 0, fontSize: 15, color: quizAnswered ? "#10b981" : "#ef4444", fontWeight: 700 }}>
                            {quizAnswered ? "✓ Parfait!" : `✗ C'était: ${currentQuiz.options[currentQuiz.correct]}`}
                          </p>
                          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>💡 {currentQuiz.hint}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── WRITE ── */}
                  {currentQuiz.type === "write" && (
                    <div style={{ textAlign: "center" }}>
                      <AudioButton
                        audioKey={ARABIC_LETTERS.find(l => l.letter === currentQuiz.letter)?.audioKey}
                        tts={ARABIC_LETTERS.find(l => l.letter === currentQuiz.letter)?.tts}
                        display={currentQuiz.letter} color="#8b5cf6" label="🔊 Écouter la lettre" />
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 12 }}>{currentQuiz.question}</p>
                      <input type="text" value={quizUserAnswer}
                        onChange={e => setQuizUserAnswer(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && quizUserAnswer.trim()) handleWriteAnswer(quizUserAnswer); }}
                        placeholder="Tapez la lettre…"
                        disabled={quizAnswered !== null}
                        style={{ width: "100%", maxWidth: 200, padding: "12px 16px", background: "rgba(255,255,255,0.08)", border: "2px solid rgba(139,92,246,0.3)", borderRadius: 14, color: "white", fontSize: 28, textAlign: "center", fontFamily: "'Amiri', serif", outline: "none", boxSizing: "border-box", marginBottom: 14 }}
                      />
                      <br />
                      <button onClick={() => handleWriteAnswer(quizUserAnswer)} disabled={quizAnswered !== null || !quizUserAnswer.trim()}
                        style={{ background: quizUserAnswer.trim() ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)", border: "1.5px solid rgba(139,92,246,0.4)", color: "#a78bfa", borderRadius: 14, padding: "10px 20px", cursor: quizUserAnswer.trim() ? "pointer" : "default", fontSize: 14, fontWeight: 700 }}>
                        ✓ Vérifier
                      </button>
                      {quizAnswered !== null && (
                        <div style={{ marginTop: 16, padding: "1rem", background: quizAnswered ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", borderRadius: 12, border: `1px solid ${quizAnswered ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                          <p style={{ margin: 0, fontSize: 16, color: quizAnswered ? "#10b981" : "#ef4444", fontWeight: 700 }}>
                            {quizAnswered ? "✓ Correct! Bien joué!" : `✗ Incorrect. La réponse est: ${currentQuiz.letter}`}
                          </p>
                          <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>💡 {currentQuiz.hint}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── DRAW ── */}
                  {currentQuiz.type === "draw" && (
                    <QuizDrawPanel quiz={currentQuiz} onDone={handleDrawDone} />
                  )}
                </div>

                {/* Dot progress */}
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
                  {quizzes.map((q, i) => {
                    const typeColors = { mcq: "#3b82f6", write: "#8b5cf6", listen_mcq: "#10b981", draw: "#f59e0b" };
                    return (
                      <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: i < quizStep ? "#10b981" : i === quizStep ? (typeColors[q.type] || "#a78bfa") : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} title={q.type} />
                    );
                  })}
                </div>
                <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>
                  🔵 MCQ · 🟣 Écriture · 🟢 Écoute · 🟡 Dessin
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "3rem" }}>
                <div style={{ fontSize: 80, marginBottom: 16 }}>{quizScore >= quizzes.length ? "🏆" : quizScore >= quizzes.length * 0.7 ? "⭐" : "💪"}</div>
                <h3 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>{quizScore >= quizzes.length ? "Parfait!" : quizScore >= quizzes.length * 0.7 ? "Très bien!" : "Continue!"}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 8 }}>{quizScore} / {quizzes.length} bonnes réponses</p>
                <p style={{ color: "#f59e0b", fontSize: 14, marginBottom: 24 }}>+{quizScore * 20} XP gagnés!</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button onClick={resetQuiz} style={{ background: "rgba(139,92,246,0.2)", border: "1.5px solid rgba(139,92,246,0.4)", color: "#a78bfa", borderRadius: 14, padding: "12px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700 }}>🔄 Nouveau Quiz</button>
                  <button onClick={() => setActiveTab("lettres")} style={{ background: "rgba(16,185,129,0.2)", border: "1.5px solid rgba(16,185,129,0.4)", color: "#10b981", borderRadius: 14, padding: "12px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700 }}>📖 Réviser</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== VOCABULAIRE ===== */}
        {activeTab === "vocabulaire" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>💬 Vocabulaire Essentiel</h2>
              <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                {VOCABULARY_CATEGORIES.reduce((acc, c) => acc + c.words.length, 0)} mots répartis en {VOCABULARY_CATEGORIES.length} catégories. Clique sur un mot pour l'entendre.
              </p>
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {VOCABULARY_CATEGORIES.map((cat, i) => (
                <button key={i} onClick={() => setActiveVocabCat(i)}
                  style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${activeVocabCat === i ? cat.color : "rgba(255,255,255,0.1)"}`, background: activeVocabCat === i ? `${cat.color}22` : "transparent", color: activeVocabCat === i ? cat.color : "rgba(255,255,255,0.4)", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.2s" }}>
                  {cat.icon} {cat.label}
                  <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>({cat.words.length})</span>
                </button>
              ))}
            </div>

            {/* Words grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {VOCABULARY_CATEGORIES[activeVocabCat].words.map((v, i) => <VocabCard key={i} v={v} />)}
            </div>
          </div>
        )}

        {/* ===== TRADUCTEUR ===== */}
        {activeTab === "traducteur" && (
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>🔤 Traducteur Arabe</h2>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Traduis un mot en arabe et écoute sa prononciation.</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["english","french"].map(lang => (
                <button key={lang} onClick={() => { setDictLanguage(lang); setDictResults(null); setDictSearchTerm(""); }}
                  style={{ flex: 1, padding: "10px", border: `1.5px solid ${dictLanguage === lang ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.1)"}`, background: dictLanguage === lang ? "rgba(139,92,246,0.15)" : "transparent", color: dictLanguage === lang ? "#a78bfa" : "rgba(255,255,255,0.4)", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                  {lang === "english" ? "🇬🇧 English" : "🇫🇷 Français"}
                </button>
              ))}
            </div>
            <form onSubmit={handleDictSearch} style={{ marginBottom: 20 }}>
              <div style={{ position: "relative", marginBottom: 12 }}>
                <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input type="text" value={dictSearchTerm} onChange={e => setDictSearchTerm(e.target.value)}
                  placeholder={dictLanguage === "english" ? "Ex: peace, hello, love…" : "Ex: paix, bonjour, amour…"}
                  style={{ width: "100%", boxSizing: "border-box", paddingLeft: 46, paddingRight: 16, paddingTop: 14, paddingBottom: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "white", fontSize: 15, outline: "none" }} />
              </div>
              <button type="submit" disabled={dictLoading} style={{ width: "100%", background: dictLoading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", color: "white", borderRadius: 14, padding: "14px", fontSize: 16, fontWeight: 800, cursor: dictLoading ? "not-allowed" : "pointer" }}>
                {dictLoading ? "Traduction…" : "🔍 Traduire en Arabe"}
              </button>
            </form>
            {dictError && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "1rem", textAlign: "center", color: "#f87171", fontSize: 14, marginBottom: 16 }}>{dictError}</div>}
            {dictResults && (
              <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 20, padding: "2rem", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Traduction Arabe</p>
                <div style={{ fontSize: 72, fontFamily: "'Amiri', serif", color: "white", margin: "0.5rem 0", direction: "rtl" }}>{dictResults.arabic}</div>
                <p style={{ margin: "8px 0 16px", fontSize: 18, color: "#a78bfa", fontWeight: 600, fontStyle: "italic" }}>{dictResults.pronunciation}</p>
                <AudioButton display={dictResults.arabic} color="#a78bfa" label="🔊 Écouter la prononciation" />
              </div>
            )}
            {!dictResults && !dictLoading && !dictError && (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "rgba(255,255,255,0.2)" }}>
                <Globe size={48} style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 16 }}>Entrez un mot pour découvrir son équivalent en arabe ✨</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { 0%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(-20px)} }
        @keyframes soundWave { 0%{transform:scale(1)} 100%{transform:scale(1.2) rotate(-10deg)} }
        @keyframes micPulse { 0%{opacity:0.7;transform:scale(1)} 100%{opacity:0;transform:scale(1.2)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.3);border-radius:3px}
      `}</style>
    </div>
  );
}

export default AlphabetArabe;