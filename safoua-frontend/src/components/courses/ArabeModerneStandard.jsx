import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Volume2, CheckCircle, BookOpen,
  Target, Zap, ChevronRight, Star,
  Globe, Layers, Award, Flame, Brain,
  RotateCcw, PenLine, Eye, EyeOff, Sparkles
} from "lucide-react";
import axios from "axios";

const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap');`;

const C = {
  bg:      "#080b0f",
  card:    "#111820",
  border:  "rgba(255,255,255,0.07)",
  borderM: "rgba(255,255,255,0.14)",
  blue:    "#4fadd4",
  blueL:   "#7dc8e8",
  teal:    "#1db584",
  tealL:   "#25d4a0",
  gold:    "#c9a84c",
  goldL:   "#e8c97a",
  purple:  "#9d7bea",
  coral:   "#d4654a",
  text:    "#f2ede6",
  muted:   "rgba(242,237,230,0.5)",
  dim:     "rgba(242,237,230,0.22)",
};

const ACCENT = C.blue;
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ══════════════════════════════════════════════════════════
   COURSE DATA
══════════════════════════════════════════════════════════ */
const MODULES = [
  {
    id:"m1", num:"01", title:"Fondations de l'Arabe Moderne", titleAr:"أسس اللغة العربية المعاصرة", color:C.blue, icon:"ف",
    lessons:[
      {
        id:"m1l1", title:"L'Arabe Standard Moderne", subtitle:"Vue d'ensemble",
        content:[
          {type:"intro", text:"L'Arabe Standard Moderne (اللغة العربية الفصحى المعاصرة) est la forme standardisée et contemporaine de l'arabe classique, utilisée partout dans le monde arabophone éduqué."},
          {type:"section", title:"Domaines d'usage", items:[
            {icon:"📰", label:"Médias", detail:"Al-Jazeera, BBC Arabic, Al-Arabiya, journaux Al-Ahram et Asharq Al-Awsat"},
            {icon:"🏛", label:"Politique & diplomatie", detail:"Discours officiels, Nations Unies, Ligue Arabe"},
            {icon:"📚", label:"Éducation", detail:"Manuels scolaires dans les 22 pays membres de la Ligue Arabe"},
            {icon:"✍️", label:"Littérature", detail:"Romans, poésie moderne, essais contemporains"},
            {icon:"🌐", label:"Internet", detail:"Grande partie du contenu arabe en ligne"},
          ]},
          {type:"highlight", color:C.teal, text:"L'ASM vous donne accès à 420 millions de locuteurs natifs et sert de pont vers tous les dialectes régionaux."},
        ],
        flashcards:[
          {ar:"الفُصْحَى", tr:"Al-Fusha", fr:"L'arabe standard"},
          {ar:"اللُّغَة", tr:"Al-lugha", fr:"La langue"},
          {ar:"الإِعْلَام", tr:"Al-i'lam", fr:"Les médias"},
          {ar:"الدِّبْلُومَاسِيَّة", tr:"Ad-diblumasiyya", fr:"La diplomatie"},
          {ar:"التَّعْلِيم", tr:"At-ta'lim", fr:"L'éducation"},
        ],
      },
      {
        id:"m1l2", title:"Salutations & Expressions", subtitle:"المحادثات اليومية",
        content:[
          {type:"intro", text:"Les formules de politesse sont la première étape pour interagir avec aisance. Maîtrisez-les et toute conversation devient possible."},
          {type:"cards", title:"Salutations fondamentales", cards:[
            {ar:"السَّلَامُ عَلَيْكُمْ", tr:"As-salamu alaykum", fr:"La paix soit sur vous", note:"Réponse : وَعَلَيْكُمُ السَّلَام"},
            {ar:"مَرْحَبًا", tr:"Marhaban", fr:"Bonjour / Bienvenue", note:"Réponse : أَهْلاً وَسَهْلاً"},
            {ar:"صَبَاحُ الخَيْر", tr:"Sabah al-khayr", fr:"Bonjour (matin)", note:"Réponse : صَبَاحُ النُّور"},
            {ar:"مَسَاءُ الخَيْر", tr:"Masa al-khayr", fr:"Bonsoir", note:"Réponse : مَسَاءُ النُّور"},
          ]},
          {type:"cards", title:"Politesse", cards:[
            {ar:"شُكْرًا جَزِيلاً", tr:"Shukran jazilan", fr:"Merci beaucoup", note:""},
            {ar:"عَفْوًا", tr:"Afwan", fr:"De rien / Pardon", note:""},
            {ar:"مِن فَضْلِك", tr:"Min fadlik", fr:"S'il vous plaît", note:""},
            {ar:"آسِف / آسِفَة", tr:"Aasif / Aasifah", fr:"Désolé(e)", note:"m. / f."},
          ]},
        ],
        flashcards:[
          {ar:"مَرْحَبًا", tr:"Marhaban", fr:"Bonjour"},
          {ar:"شُكْرًا", tr:"Shukran", fr:"Merci"},
          {ar:"عَفْوًا", tr:"Afwan", fr:"De rien"},
          {ar:"مِن فَضْلِك", tr:"Min fadlik", fr:"S'il vous plaît"},
          {ar:"مَعَ السَّلَامَة", tr:"Ma'a as-salama", fr:"Au revoir"},
        ],
      },
      {
        id:"m1l3", title:"Pronoms & Conjugaison", subtitle:"الضمائر والفعل",
        content:[
          {type:"intro", text:"Les pronoms arabes sont genrés et varient selon le nombre — une richesse qui permet une précision remarquable dans l'expression."},
          {type:"table", title:"Pronoms sujets", headers:["Pronom","Arabe","Prononciation","Traduction"], rows:[
            ["Singulier","أَنَا","ana","Je"],
            ["","أَنْتَ","anta","Tu (masc.)"],
            ["","أَنْتِ","anti","Tu (fém.)"],
            ["","هُوَ","huwa","Il"],
            ["","هِيَ","hiya","Elle"],
            ["Pluriel","نَحْنُ","nahnu","Nous"],
            ["","أَنْتُم","antum","Vous"],
            ["","هُم","hum","Ils"],
          ]},
          {type:"highlight", color:C.gold, text:"⚠️ En arabe standard, le verbe 'être' au PRÉSENT est omis ! أَنَا طَالِب = littéralement 'Moi étudiant' → Je suis étudiant."},
        ],
        flashcards:[
          {ar:"أَنَا", tr:"Ana", fr:"Je"},
          {ar:"أَنْتَ", tr:"Anta", fr:"Tu (masc.)"},
          {ar:"هُوَ", tr:"Huwa", fr:"Il"},
          {ar:"هِيَ", tr:"Hiya", fr:"Elle"},
          {ar:"نَحْنُ", tr:"Nahnu", fr:"Nous"},
        ],
      },
    ],
    exercises:[
      {q:"Comment dit-on 'Merci beaucoup' ?", opts:["مَرْحَبًا","شُكْرًا جَزِيلاً","مَعَ السَّلَامَة","أَهْلاً"], ans:"شُكْرًا جَزِيلاً"},
      {q:"Le pronom هِيَ correspond à :", opts:["Il","Je","Elle","Nous"], ans:"Elle"},
      {q:"La réponse à صَبَاحُ الخَيْر est :", opts:["شُكْرًا","الحَمْدُ لِلَّه","صَبَاحُ النُّور","مَعَ السَّلَامَة"], ans:"صَبَاحُ النُّور"},
      {q:"L'ASM est utilisé principalement dans :", opts:["Les conversations familières","Les médias, l'éducation, la diplomatie","Les marchés locaux","Les chansons pop"], ans:"Les médias, l'éducation, la diplomatie"},
      {q:"أَنَا مِن signifie :", opts:["Comment allez-vous ?","Je m'appelle","Je suis de","Où est ?"], ans:"Je suis de"},
    ],
  },
  {
    id:"m2", num:"02", title:"Les Chiffres & Le Temps", titleAr:"الأرقام والوقت", color:C.teal, icon:"٣",
    lessons:[
      {
        id:"m2l1", title:"Les Chiffres de 0 à 1000", subtitle:"الأرقام العربية",
        content:[
          {type:"intro", text:"Les chiffres arabes — appelés à tort 'arabes' en Occident, car les 1 2 3 que nous utilisons viennent en réalité de l'Inde via les mathématiciens arabes!"},
          {type:"numbers", title:"De 0 à 10", numbers:[
            {ar:"٠",name:"صِفْر",tr:"sifr",val:"0",note:"Origine du mot 'zéro' !"},
            {ar:"١",name:"وَاحِد",tr:"waahid",val:"1"},
            {ar:"٢",name:"اثْنَان",tr:"ithnaani",val:"2"},
            {ar:"٣",name:"ثَلَاثَة",tr:"thalaathah",val:"3"},
            {ar:"٤",name:"أَرْبَعَة",tr:"arba'ah",val:"4"},
            {ar:"٥",name:"خَمْسَة",tr:"khamsah",val:"5"},
            {ar:"٦",name:"سِتَّة",tr:"sittah",val:"6"},
            {ar:"٧",name:"سَبْعَة",tr:"sab'ah",val:"7"},
            {ar:"٨",name:"ثَمَانِيَة",tr:"thamaaniyah",val:"8"},
            {ar:"٩",name:"تِسْعَة",tr:"tis'ah",val:"9"},
            {ar:"١٠",name:"عَشَرَة",tr:"asharah",val:"10"},
          ]},
          {type:"highlight", color:C.coral, text:"⚠️ Particularité : les chiffres 3–10 s'accordent en genre INVERSE du nom qui suit !"},
        ],
        flashcards:[
          {ar:"وَاحِد",tr:"Waahid",fr:"1 — Un"},
          {ar:"اثْنَان",tr:"Ithnaani",fr:"2 — Deux"},
          {ar:"ثَلَاثَة",tr:"Thalaathah",fr:"3 — Trois"},
          {ar:"عَشَرَة",tr:"Asharah",fr:"10 — Dix"},
          {ar:"مِئَة",tr:"Mi'ah",fr:"100 — Cent"},
        ],
      },
      {
        id:"m2l2", title:"Les Jours & Saisons", subtitle:"الأيام والأشهر",
        content:[
          {type:"intro", text:"Le calendrier arabe est riche en histoire — les noms des jours reflètent l'ancien système de comptage sémitique."},
          {type:"cards", title:"Jours de la semaine", cards:[
            {ar:"الأَحَد",tr:"Al-Ahad",fr:"Dimanche",note:"litt. 'le premier'"},
            {ar:"الاثْنَيْن",tr:"Al-Ithnayn",fr:"Lundi",note:"litt. 'le deux'"},
            {ar:"الثَّلَاثَاء",tr:"Ath-Thalaathaa'",fr:"Mardi",note:"litt. 'le trois'"},
            {ar:"الأَرْبِعَاء",tr:"Al-Arbi'aa'",fr:"Mercredi",note:"litt. 'le quatre'"},
            {ar:"الخَمِيس",tr:"Al-Khamiis",fr:"Jeudi",note:"litt. 'le cinq'"},
            {ar:"الجُمُعَة",tr:"Al-Jumu'ah",fr:"Vendredi",note:"jour de la prière"},
            {ar:"السَّبْت",tr:"As-Sabt",fr:"Samedi",note:"racine hébraïque Sabbat"},
          ]},
        ],
        flashcards:[
          {ar:"اليَوْم",tr:"Al-yawm",fr:"Aujourd'hui"},
          {ar:"غَدًا",tr:"Ghadan",fr:"Demain"},
          {ar:"أَمْس",tr:"Ams",fr:"Hier"},
          {ar:"الأُسْبُوع",tr:"Al-usbu'",fr:"La semaine"},
          {ar:"الشَّهْر",tr:"Ash-shahr",fr:"Le mois"},
        ],
      },
      {
        id:"m2l3", title:"Dire l'Heure", subtitle:"قول الوقت",
        content:[
          {type:"intro", text:"Dire l'heure suit une structure précise. Une fois le schème maîtrisé, toutes les heures deviennent accessibles."},
          {type:"examples_list", title:"Exemples complets", examples:[
            {ar:"السَّاعَة الثَّالِثَة وَالرُّبْع",tr:"As-saa'ah ath-thaalithah wa r-rub'",fr:"3h15"},
            {ar:"السَّاعَة الخَامِسَة وَالنِّصْف",tr:"As-saa'ah al-khaamisah wa n-nisf",fr:"5h30"},
            {ar:"السَّاعَة السَّابِعَة إِلَّا رُبْعًا",tr:"As-saa'ah as-saabi'ah illaa rub'an",fr:"6h45"},
            {ar:"السَّاعَة التَّاسِعَة صَبَاحًا",tr:"As-saa'ah at-taasi'ah sabaahan",fr:"9h du matin"},
          ]},
        ],
        flashcards:[
          {ar:"السَّاعَة",tr:"As-saa'ah",fr:"L'heure"},
          {ar:"وَالنِّصْف",tr:"Wa n-nisf",fr:"Et demie"},
          {ar:"وَالرُّبْع",tr:"Wa r-rub'",fr:"Et quart"},
          {ar:"صَبَاحًا",tr:"Sabaahan",fr:"Du matin"},
          {ar:"مَسَاءً",tr:"Masaa'an",fr:"Du soir"},
        ],
      },
    ],
    exercises:[
      {q:"Comment dit-on 'mille' en arabe ?", opts:["مِئَة","أَلْف","عَشَرَة","مِلْيُون"], ans:"أَلْف"},
      {q:"الجُمُعَة est :", opts:["Samedi","Dimanche","Vendredi","Lundi"], ans:"Vendredi"},
      {q:"وَالنِّصْف signifie :", opts:["Et quart","Et demie","Moins le quart","Une heure"], ans:"Et demie"},
      {q:"Le mot 'zéro' vient de l'arabe :", opts:["أَلْف","مِئَة","صِفْر","وَاحِد"], ans:"صِفْر"},
      {q:"السَّاعَة الخَامِسَة وَالرُّبْع = ?", opts:["4h15","5h30","5h15","4h45"], ans:"5h15"},
    ],
  },
  {
    id:"m3", num:"03", title:"La Vie Quotidienne", titleAr:"الحياة اليومية", color:C.gold, icon:"ع",
    lessons:[
      {
        id:"m3l1", title:"La Famille & Les Relations", subtitle:"مفردات العائلة",
        content:[
          {type:"intro", text:"Le vocabulaire familial est essentiel — dans la culture arabe, la famille occupe une place centrale dans toute interaction sociale."},
          {type:"cards", title:"La famille proche", cards:[
            {ar:"الأَب",tr:"Al-ab",fr:"Le père",note:""},
            {ar:"الأُم",tr:"Al-umm",fr:"La mère",note:""},
            {ar:"الأَخ",tr:"Al-akh",fr:"Le frère",note:""},
            {ar:"الأُخْت",tr:"Al-ukht",fr:"La sœur",note:""},
            {ar:"الابْن",tr:"Al-ibn",fr:"Le fils",note:""},
            {ar:"البِنْت",tr:"Al-bint",fr:"La fille",note:""},
          ]},
        ],
        flashcards:[
          {ar:"الأَب",tr:"Al-ab",fr:"Le père"},
          {ar:"الأُم",tr:"Al-umm",fr:"La mère"},
          {ar:"الأَخ",tr:"Al-akh",fr:"Le frère"},
          {ar:"الأُخْت",tr:"Al-ukht",fr:"La sœur"},
          {ar:"العَائِلَة",tr:"Al-'a'ila",fr:"La famille"},
        ],
      },
      {
        id:"m3l2", title:"Le Corps & La Santé", subtitle:"الجسم والصحة",
        content:[
          {type:"intro", text:"Savoir décrire son corps et parler de sa santé est crucial pour toute situation pratique."},
          {type:"cards", title:"Les parties du corps", cards:[
            {ar:"الرَّأْس",tr:"Ar-ra's",fr:"La tête",note:""},
            {ar:"العَيْن",tr:"Al-'ayn",fr:"L'œil",note:"pl. العُيُون"},
            {ar:"اليَد",tr:"Al-yad",fr:"La main",note:"pl. الأَيْدِي"},
            {ar:"الفَم",tr:"Al-famm",fr:"La bouche",note:""},
            {ar:"الأُذُن",tr:"Al-udhun",fr:"L'oreille",note:""},
            {ar:"الظَّهْر",tr:"Adh-dhahr",fr:"Le dos",note:""},
          ]},
          {type:"cards", title:"Santé & maladie", cards:[
            {ar:"أَنَا مَرِيض",tr:"Ana mariid",fr:"Je suis malade",note:""},
            {ar:"الطَّبِيب",tr:"At-tabiib",fr:"Le médecin",note:""},
            {ar:"المُسْتَشْفَى",tr:"Al-mustashfaa",fr:"L'hôpital",note:""},
            {ar:"الدَّوَاء",tr:"Ad-dawaa'",fr:"Le médicament",note:""},
          ]},
        ],
        flashcards:[
          {ar:"الرَّأْس",tr:"Ar-ra's",fr:"La tête"},
          {ar:"اليَد",tr:"Al-yad",fr:"La main"},
          {ar:"الطَّبِيب",tr:"At-tabiib",fr:"Le médecin"},
          {ar:"الدَّوَاء",tr:"Ad-dawaa'",fr:"Le médicament"},
          {ar:"أَنَا بِخَيْر",tr:"Ana bikhair",fr:"Je vais bien"},
        ],
      },
      {
        id:"m3l3", title:"La Nourriture & Les Repas", subtitle:"الطعام والأكل",
        content:[
          {type:"intro", text:"La gastronomie est au cœur de la culture arabe — connaître ce vocabulaire enrichit chaque interaction sociale."},
          {type:"cards", title:"Boissons & aliments", cards:[
            {ar:"المَاء",tr:"Al-maa'",fr:"L'eau",note:""},
            {ar:"الشَّاي",tr:"Ash-shaay",fr:"Le thé",note:""},
            {ar:"القَهْوَة",tr:"Al-qahwah",fr:"Le café",note:"origine du mot 'café' !"},
            {ar:"الخُبْز",tr:"Al-khubz",fr:"Le pain",note:""},
            {ar:"الأَرُزّ",tr:"Al-aruzz",fr:"Le riz",note:""},
          ]},
          {type:"examples_list", title:"Au restaurant", examples:[
            {ar:"أُرِيد أَن أَطْلُب",tr:"Uriidu an atulub",fr:"Je voudrais commander"},
            {ar:"الحِسَاب مِن فَضْلِك",tr:"Al-hisaab min fadlik",fr:"L'addition s'il vous plaît"},
            {ar:"هَذَا لَذِيذ!",tr:"Haadha ladhiidh!",fr:"C'est délicieux !"},
          ]},
        ],
        flashcards:[
          {ar:"القَهْوَة",tr:"Al-qahwah",fr:"Le café"},
          {ar:"الشَّاي",tr:"Ash-shaay",fr:"Le thé"},
          {ar:"الخُبْز",tr:"Al-khubz",fr:"Le pain"},
          {ar:"لَذِيذ",tr:"Ladhiidh",fr:"Délicieux"},
          {ar:"الإِفْطَار",tr:"Al-iftar",fr:"Le petit-déjeuner"},
        ],
      },
    ],
    exercises:[
      {q:"Comment dit-on 'le père' en arabe ?", opts:["الأُم","الأَخ","الأَب","الابْن"], ans:"الأَب"},
      {q:"الطَّبِيب signifie :", opts:["L'hôpital","Le médicament","Le médecin","La douleur"], ans:"Le médecin"},
      {q:"هَذَا لَذِيذ! signifie :", opts:["C'est cher !","C'est délicieux !","C'est grand !","Merci !"], ans:"C'est délicieux !"},
      {q:"الرَّأْس désigne :", opts:["La main","Le dos","La tête","L'œil"], ans:"La tête"},
      {q:"القَهْوَة est l'origine du mot :", opts:["Sucre","Alcool","Café","Thé"], ans:"Café"},
    ],
  },
  {
    id:"m4", num:"04", title:"Grammaire Essentielle", titleAr:"القواعد الأساسية", color:C.purple, icon:"ن",
    lessons:[
      {
        id:"m4l1", title:"La Phrase Nominale", subtitle:"الجملة الاسمية",
        content:[
          {type:"intro", text:"La phrase nominale est l'une des structures les plus caractéristiques de l'arabe : au présent, il n'y a pas de verbe 'être' !"},
          {type:"highlight", color:C.blue, text:"Structure : Sujet (مُبْتَدَأ) + Prédicat (خَبَر) — sans verbe au présent (copule zéro)"},
          {type:"examples_list", title:"Exemples", examples:[
            {ar:"الكِتَابُ جَمِيلٌ",tr:"Al-kitaabu jamiilun",fr:"Le livre [est] beau"},
            {ar:"أَنَا طَالِبٌ",tr:"Ana taalibun",fr:"Je [suis] étudiant"},
            {ar:"هِيَ مُعَلِّمَةٌ",tr:"Hiya mu'allimah",fr:"Elle [est] enseignante"},
          ]},
        ],
        flashcards:[
          {ar:"جَمِيل",tr:"Jamiil",fr:"Beau"},
          {ar:"كَبِير",tr:"Kabiir",fr:"Grand"},
          {ar:"صَغِير",tr:"Saghiir",fr:"Petit"},
          {ar:"طَالِب",tr:"Taalib",fr:"Étudiant"},
          {ar:"مُعَلِّم",tr:"Mu'allim",fr:"Enseignant"},
        ],
      },
      {
        id:"m4l2", title:"La Conjugaison", subtitle:"الجملة الفعلية",
        content:[
          {type:"intro", text:"La conjugaison arabe encode le genre, le nombre et la personne dans les préfixes et suffixes."},
          {type:"table", title:"Passé — كَتَبَ (écrire)", headers:["Personne","Arabe","Prononciation"], rows:[
            ["Je","كَتَبْتُ","katabtu"],
            ["Tu (m)","كَتَبْتَ","katabta"],
            ["Il","كَتَبَ","kataba"],
            ["Elle","كَتَبَت","katabat"],
            ["Nous","كَتَبْنَا","katabnaa"],
            ["Ils","كَتَبُوا","katabuu"],
          ]},
          {type:"table", title:"Présent — يَكْتُبُ (écrire)", headers:["Personne","Arabe","Prononciation"], rows:[
            ["Je","أَكْتُبُ","aktubu"],
            ["Tu","تَكْتُبُ","taktubu"],
            ["Il","يَكْتُبُ","yaktubu"],
            ["Elle","تَكْتُبُ","taktubu"],
            ["Nous","نَكْتُبُ","naktubu"],
            ["Ils","يَكْتُبُون","yaktubun"],
          ]},
        ],
        flashcards:[
          {ar:"كَتَبَ",tr:"Kataba",fr:"Il a écrit"},
          {ar:"يَكْتُبُ",tr:"Yaktubu",fr:"Il écrit"},
          {ar:"قَرَأَ",tr:"Qara'a",fr:"Il a lu"},
          {ar:"ذَهَبَ",tr:"Dhahaba",fr:"Il est allé"},
          {ar:"أَكَلَ",tr:"Akala",fr:"Il a mangé"},
        ],
      },
      {
        id:"m4l3", title:"Les Questions", subtitle:"الأسئلة",
        content:[
          {type:"intro", text:"Poser des questions est la clé de toute conversation."},
          {type:"cards", title:"Particules interrogatives", cards:[
            {ar:"مَن؟",tr:"man?",fr:"Qui ?",note:""},
            {ar:"مَاذَا؟",tr:"maadha?",fr:"Que ? / Quoi ?",note:""},
            {ar:"أَيْن؟",tr:"ayna?",fr:"Où ?",note:""},
            {ar:"مَتَى؟",tr:"mataa?",fr:"Quand ?",note:""},
            {ar:"كَيْف؟",tr:"kayfa?",fr:"Comment ?",note:""},
            {ar:"لِمَاذَا؟",tr:"limaadha?",fr:"Pourquoi ?",note:""},
            {ar:"كَم؟",tr:"kam?",fr:"Combien ?",note:""},
            {ar:"هَل؟",tr:"hal?",fr:"Est-ce que ?",note:""},
          ]},
        ],
        flashcards:[
          {ar:"أَيْن؟",tr:"Ayna?",fr:"Où ?"},
          {ar:"مَتَى؟",tr:"Mataa?",fr:"Quand ?"},
          {ar:"لِمَاذَا؟",tr:"Limaadha?",fr:"Pourquoi ?"},
          {ar:"كَيْف؟",tr:"Kayfa?",fr:"Comment ?"},
          {ar:"نَعَم",tr:"Na'am",fr:"Oui"},
        ],
      },
    ],
    exercises:[
      {q:"La phrase 'البَيْتُ كَبِيرٌ' signifie :", opts:["La maison est petite","La maison est grande","Le livre est grand","Le jardin est beau"], ans:"La maison est grande"},
      {q:"أَيْن؟ signifie :", opts:["Quand ?","Qui ?","Où ?","Pourquoi ?"], ans:"Où ?"},
      {q:"أَكْتُبُ signifie :", opts:["Il a écrit","J'écris","Tu écris","Nous écrivons"], ans:"J'écris"},
      {q:"بَلَى sert à :", opts:["Dire oui","Dire non","Contredire une négation","Poser une question"], ans:"Contredire une négation"},
      {q:"Je suis étudiant se dit :", opts:["أَنَا طَالِبٌ","هُوَ طَالِبٌ","أَنَا مُعَلِّمٌ","نَحْنُ طُلَّابٌ"], ans:"أَنَا طَالِبٌ"},
    ],
  },
  {
    id:"m5", num:"05", title:"Lecture de la Presse", titleAr:"قراءة الصحافة", color:C.coral, icon:"ص",
    lessons:[
      {
        id:"m5l1", title:"Vocabulaire des Médias", subtitle:"مفردات الإعلام",
        content:[
          {type:"intro", text:"L'un des objectifs principaux de l'ASM est de permettre la lecture de la presse arabophone internationale."},
          {type:"cards", title:"Médias & communication", cards:[
            {ar:"الصَّحِيفَة",tr:"as-sahiifah",fr:"Le journal",note:""},
            {ar:"الأَخْبَار",tr:"al-akhbaar",fr:"Les actualités",note:""},
            {ar:"التَّقْرِير",tr:"at-taqriir",fr:"Le rapport",note:""},
            {ar:"الصَّحَفِي",tr:"as-sahafii",fr:"Le journaliste",note:""},
            {ar:"الإِعْلَام",tr:"al-i'laam",fr:"Les médias",note:""},
            {ar:"المُقَابَلَة",tr:"al-muqaabalah",fr:"L'interview",note:""},
          ]},
          {type:"cards", title:"Vocabulaire politique", cards:[
            {ar:"الحُكُومَة",tr:"al-hukuumah",fr:"Le gouvernement",note:""},
            {ar:"الرَّئِيس",tr:"ar-ra'iis",fr:"Le président",note:""},
            {ar:"الانْتِخَابَات",tr:"al-intikhaabaaat",fr:"Les élections",note:""},
            {ar:"القَانُون",tr:"al-qaanuun",fr:"La loi",note:""},
          ]},
        ],
        flashcards:[
          {ar:"الأَخْبَار",tr:"Al-akhbaar",fr:"Les nouvelles"},
          {ar:"الصَّحِيفَة",tr:"As-sahiifah",fr:"Le journal"},
          {ar:"الرَّئِيس",tr:"Ar-ra'iis",fr:"Le président"},
          {ar:"الحُكُومَة",tr:"Al-hukuumah",fr:"Le gouvernement"},
          {ar:"الانْتِخَابَات",tr:"Al-intikhaabaaat",fr:"Les élections"},
        ],
      },
      {
        id:"m5l2", title:"Économie & Société", subtitle:"الاقتصاد والمجتمع",
        content:[
          {type:"intro", text:"Ces mots apparaissent constamment dans la presse arabophone."},
          {type:"cards", title:"Économie", cards:[
            {ar:"الاقْتِصَاد",tr:"al-iqtisaad",fr:"L'économie",note:""},
            {ar:"البِطَالَة",tr:"al-bitaalah",fr:"Le chômage",note:""},
            {ar:"النُّمُو",tr:"an-numuww",fr:"La croissance",note:""},
            {ar:"الاسْتِثْمَار",tr:"al-istithmaar",fr:"L'investissement",note:""},
          ]},
          {type:"cards", title:"Technologie", cards:[
            {ar:"الذَّكَاء الاصْطِنَاعِي",tr:"adh-dhakaa' al-istinaa'i",fr:"L'intelligence artificielle",note:""},
            {ar:"الهَاتِف الذَّكِي",tr:"al-haatif adh-dhakii",fr:"Le smartphone",note:""},
            {ar:"التَّطْبِيق",tr:"at-tatbiiiq",fr:"L'application",note:""},
          ]},
        ],
        flashcards:[
          {ar:"الاقْتِصَاد",tr:"Al-iqtisaad",fr:"L'économie"},
          {ar:"البِطَالَة",tr:"Al-bitaalah",fr:"Le chômage"},
          {ar:"التِّقْنِيَة",tr:"At-tiqniyya",fr:"La technologie"},
          {ar:"النُّمُو",tr:"An-numuww",fr:"La croissance"},
          {ar:"السُّوق",tr:"As-suuq",fr:"Le marché"},
        ],
      },
      {
        id:"m5l3", title:"Méthode de Lecture", subtitle:"كيف تقرأ مقالاً",
        content:[
          {type:"intro", text:"Adopter une méthode structurée transforme la lecture d'un article arabe d'une tâche intimidante en une compétence maîtrisable."},
          {type:"section", title:"5 étapes pour lire un article arabe", items:[
            {icon:"1️⃣",label:"Le titre (العُنْوَان)",detail:"Les titres sont souvent en style nominal — pas de verbe, juste les mots-clés."},
            {icon:"2️⃣",label:"Le chapeau (المُقَدِّمَة)",detail:"Les premiers paragraphes répondent à : مَن؟ مَاذَا؟ أَيْن؟ مَتَى؟"},
            {icon:"3️⃣",label:"Les mots-clés",detail:"Repérez les noms propres, verbes au passé et connecteurs logiques."},
            {icon:"4️⃣",label:"Les chiffres et dates",detail:"Maîtrisez leur lecture pour contextualiser l'information."},
            {icon:"5️⃣",label:"Résumer",detail:"Reformulez l'article en une phrase courte — test de compréhension idéal."},
          ]},
          {type:"cards", title:"Connecteurs logiques", cards:[
            {ar:"لَكِن",tr:"laakin",fr:"mais",note:""},
            {ar:"لِأَن",tr:"li'anna",fr:"parce que",note:""},
            {ar:"لِذَلِك",tr:"lidhaalik",fr:"donc",note:""},
            {ar:"وَفْقًا لِـ",tr:"wafqan li",fr:"selon",note:""},
          ]},
        ],
        flashcards:[
          {ar:"لَكِن",tr:"Laakin",fr:"Mais"},
          {ar:"لِأَن",tr:"Li'anna",fr:"Parce que"},
          {ar:"لِذَلِك",tr:"Lidhaalik",fr:"Donc"},
          {ar:"وَفْقًا لِـ",tr:"Wafqan li",fr:"Selon"},
          {ar:"بَيْنَمَا",tr:"Baynamaa",fr:"Tandis que"},
        ],
      },
    ],
    exercises:[
      {q:"الأَخْبَار signifie :", opts:["Le journal","Les nouvelles","Le journaliste","L'interview"], ans:"Les nouvelles"},
      {q:"البِطَالَة signifie :", opts:["L'inflation","La croissance","Le chômage","L'investissement"], ans:"Le chômage"},
      {q:"وَفْقًا لِـ signifie :", opts:["Malgré","Donc","Selon","Parce que"], ans:"Selon"},
      {q:"الذَّكَاء الاصْطِنَاعِي signifie :", opts:["La technologie","L'intelligence artificielle","L'ordinateur","L'application"], ans:"L'intelligence artificielle"},
      {q:"Un titre de presse arabe est souvent :", opts:["Une question","Un style nominal sans verbe","Une citation directe","Un chiffre"], ans:"Un style nominal sans verbe"},
    ],
  },
  {
    id:"m6", num:"06", title:"Conversation Pratique", titleAr:"المحادثة والحياة العملية", color:C.tealL, icon:"ك",
    lessons:[
      {
        id:"m6l1", title:"Au Restaurant & Dans les Magasins", subtitle:"في المطعم والمتجر",
        content:[
          {type:"intro", text:"Ces expressions sont votre passeport pour toute interaction pratique dans un pays arabophone."},
          {type:"examples_list", title:"Au restaurant", examples:[
            {ar:"أُرِيد طَاوِلَةً لِشَخْصَيْن",tr:"Uriidu taawilataan lishakhsayn",fr:"Une table pour deux"},
            {ar:"مَاذَا تَنْصَح؟",tr:"Maadha tansah?",fr:"Que recommandez-vous ?"},
            {ar:"الحِسَاب مِن فَضْلِك",tr:"Al-hisaab min fadlik",fr:"L'addition s'il vous plaît"},
          ]},
          {type:"examples_list", title:"Dans les magasins", examples:[
            {ar:"كَم سِعْر هَذَا؟",tr:"Kam si'r haadha?",fr:"Quel est le prix ?"},
            {ar:"هَذَا غَالٍ جِدًّا",tr:"Haadha ghalin jiddan",fr:"C'est trop cher"},
          ]},
        ],
        flashcards:[
          {ar:"السِّعْر",tr:"As-si'r",fr:"Le prix"},
          {ar:"غَالٍ",tr:"Ghaalin",fr:"Cher"},
          {ar:"رَخِيص",tr:"Rakhiis",fr:"Bon marché"},
          {ar:"الحِسَاب",tr:"Al-hisaab",fr:"L'addition"},
          {ar:"المَنُو",tr:"Al-manuu",fr:"Le menu"},
        ],
      },
      {
        id:"m6l2", title:"Transports & Orientation", subtitle:"المواصلات والتوجيه",
        content:[
          {type:"intro", text:"Se déplacer et s'orienter dans une ville arabophone devient naturel avec ce vocabulaire essentiel."},
          {type:"cards", title:"Transports", cards:[
            {ar:"السَّيَّارَة",tr:"as-sayyaarah",fr:"La voiture",note:""},
            {ar:"الحَافِلَة",tr:"al-haafilah",fr:"Le bus",note:""},
            {ar:"القِطَار",tr:"al-qitaar",fr:"Le train",note:""},
            {ar:"المَطَار",tr:"al-mataar",fr:"L'aéroport",note:""},
            {ar:"التَّاكْسِي",tr:"at-taaksi",fr:"Le taxi",note:""},
          ]},
          {type:"examples_list", title:"Directions", examples:[
            {ar:"إِلَى الأَمَام",tr:"Ilaa al-amaam",fr:"Tout droit"},
            {ar:"إِلَى اليَمِين",tr:"Ilaa al-yamiin",fr:"À droite"},
            {ar:"إِلَى اليَسَار",tr:"Ilaa al-yasaar",fr:"À gauche"},
          ]},
        ],
        flashcards:[
          {ar:"المَطَار",tr:"Al-mataar",fr:"L'aéroport"},
          {ar:"القِطَار",tr:"Al-qitaar",fr:"Le train"},
          {ar:"اليَمِين",tr:"Al-yamiin",fr:"La droite"},
          {ar:"اليَسَار",tr:"Al-yasaar",fr:"La gauche"},
          {ar:"قَرِيب",tr:"Qariib",fr:"Proche"},
        ],
      },
      {
        id:"m6l3", title:"Voyage dans le Monde Arabe", subtitle:"السفر والاكتشاف",
        content:[
          {type:"intro", text:"Le monde arabophone s'étend sur 22 pays — chacun avec une culture unique, mais l'ASM vous y donne accès partout."},
          {type:"cards", title:"Villes arabes incontournables", cards:[
            {ar:"القَاهِرَة",tr:"Al-Qaahirah",fr:"Le Caire",note:"Égypte"},
            {ar:"دُبَيّ",tr:"Dubayy",fr:"Dubaï",note:"EAU"},
            {ar:"مَرَّاكُش",tr:"Marraakush",fr:"Marrakech",note:"Maroc"},
            {ar:"تُونِس",tr:"Tuunis",fr:"Tunis",note:"Tunisie"},
            {ar:"بَيْرُوت",tr:"Bayrut",fr:"Beyrouth",note:"Liban"},
            {ar:"الرِّيَاض",tr:"Ar-Riyaadh",fr:"Riyad",note:"Arabie Saoudite"},
          ]},
        ],
        flashcards:[
          {ar:"القَاهِرَة",tr:"Al-Qaahirah",fr:"Le Caire"},
          {ar:"مَرَّاكُش",tr:"Marraakush",fr:"Marrakech"},
          {ar:"تُونِس",tr:"Tuunis",fr:"Tunis"},
          {ar:"الفُنْدُق",tr:"Al-funduq",fr:"L'hôtel"},
          {ar:"الجَوَاز",tr:"Al-jawaaz",fr:"Le passeport"},
        ],
      },
    ],
    exercises:[
      {q:"Comment dit-on 'À droite' en arabe ?", opts:["إِلَى الأَمَام","إِلَى اليَسَار","إِلَى اليَمِين","إِلَى الوَرَاء"], ans:"إِلَى اليَمِين"},
      {q:"المَطَار signifie :", opts:["La gare","L'aéroport","La station de bus","Le port"], ans:"L'aéroport"},
      {q:"هَذَا غَالٍ جِدًّا signifie :", opts:["C'est gratuit","C'est trop cher","C'est bon marché","Quel est le prix ?"], ans:"C'est trop cher"},
      {q:"القَاهِرَة est la capitale de :", opts:["Le Maroc","La Tunisie","L'Égypte","Le Liban"], ans:"L'Égypte"},
      {q:"تُونِس en arabe désigne :", opts:["Le Caire","Dubaï","Riyad","Tunis"], ans:"Tunis"},
    ],
  },
  {
    id:"m7", num:"07", title:"Révision & Maîtrise", titleAr:"المراجعة والإتقان", color:C.goldL, icon:"م",
    lessons:[
      {
        id:"m7l1", title:"Récapitulatif Grammatical", subtitle:"ملخص قواعد النحو",
        content:[
          {type:"intro", text:"Ce module consolide toutes les structures grammaticales étudiées. Une révision régulière est la clé de la maîtrise."},
          {type:"section", title:"Structures clés", items:[
            {icon:"1",label:"Phrase nominale",detail:"Sujet + Prédicat sans verbe : أَنَا سَعِيدٌ → Je suis heureux"},
            {icon:"2",label:"Phrase verbale",detail:"Verbe + Sujet + Complément : ذَهَبَ الوَلَدُ إِلَى المَدْرَسَةِ"},
            {icon:"3",label:"Article défini ال",detail:"Assimilation solaire / lunaire selon la lettre suivante"},
            {icon:"4",label:"Accord des adjectifs",detail:"L'adjectif suit le nom en genre et en nombre"},
          ]},
          {type:"highlight", color:C.purple, text:"L'Idafa (الإِضَافَة) — groupe possessif : بَيْتُ الرَّجُل = La maison de l'homme. Le premier nom perd son article !"},
        ],
        flashcards:[
          {ar:"لَيْسَ",tr:"Laysa",fr:"Ce n'est pas"},
          {ar:"لَا يَكْتُب",tr:"Laa yaktub",fr:"Il n'écrit pas"},
          {ar:"لَم يَكْتُب",tr:"Lam yaktub",fr:"Il n'a pas écrit"},
          {ar:"الإِضَافَة",tr:"Al-idaafa",fr:"Le groupe possessif"},
          {ar:"مُبْتَدَأ",tr:"Mubtada'",fr:"Le sujet (gramm.)"},
        ],
      },
      {
        id:"m7l2", title:"L'Arabe dans le Monde", subtitle:"موقع العربية عالمياً",
        content:[
          {type:"intro", text:"Lisez ce texte lentement — identifiez les structures grammaticales que vous connaissez."},
          {type:"text_ar", paragraphs:[
            {ar:"اللُّغَةُ العَرَبِيَّةُ هِيَ لُغَةٌ سَامِيَّةٌ قَدِيمَة.",tr:"Al-lughatu al-'arabiyyatu hiya lughatun saamiyyatun qadiimah.",fr:"La langue arabe est une ancienne langue sémitique."},
            {ar:"يَتَحَدَّثُ بِهَا أَكْثَرُ مِنْ أَرْبَعِمِئَةٍ وَعِشْرِينَ مِلْيُونَ شَخْص.",tr:"Yatahaddathu bihaa akthar min arba'imi'atin wa 'ishriina milyuuna shakhs.",fr:"Plus de 420 millions de personnes la parlent."},
            {ar:"وَهِيَ اللُّغَةُ الرَّسْمِيَّةُ لِثَلَاثَةٍ وَعِشْرِينَ دَوْلَة.",tr:"Wa hiya al-lughatu ar-rasmiyyatu lithalathatin wa 'ishriina dawlah.",fr:"Et c'est la langue officielle de 23 pays."},
          ]},
          {type:"section", title:"Mots arabes en français", items:[
            {icon:"🔢",label:"Algèbre",detail:"← الجَبْر (al-jabr)"},
            {icon:"☕",label:"Café",detail:"← القَهْوَة (al-qahwah)"},
            {icon:"🍬",label:"Sucre",detail:"← السُّكَّر (as-sukkar)"},
            {icon:"0️⃣",label:"Zéro",detail:"← صِفْر (sifr)"},
          ]},
        ],
        flashcards:[
          {ar:"الجَبْر",tr:"Al-jabr",fr:"Algèbre (origine)"},
          {ar:"الكِيمِيَاء",tr:"Al-kiimiyaa'",fr:"Chimie (origine)"},
          {ar:"الكُحُول",tr:"Al-kuhuul",fr:"Alcool (origine)"},
          {ar:"السُّكَّر",tr:"As-sukkar",fr:"Sucre (origine)"},
          {ar:"صِفْر",tr:"Sifr",fr:"Zéro (origine)"},
        ],
      },
      {
        id:"m7l3", title:"Méthode pour Progresser", subtitle:"كيف تتقدم في تعلم العربية",
        content:[
          {type:"intro", text:"Les polyglottes qui réussissent partagent les mêmes stratégies. Voici la méthode éprouvée pour maîtriser l'arabe standard moderne."},
          {type:"section", title:"3 objectifs progressifs", items:[
            {icon:"🎯",label:"Objectif 1 — La Lecture (6 mois)",detail:"15 min d'arabe chaque matin. Titres d'Al-Jazeera. 5 nouveaux mots/jour sur Anki."},
            {icon:"🎯",label:"Objectif 2 — L'Écoute (parallèle)",detail:"Podcasts pour apprenants. Journaux télévisés d'Al-Arabiya. Musique classique arabe."},
            {icon:"🎯",label:"Objectif 3 — L'Expression (3-6 mois après)",detail:"Tandem via HelloTalk. Journal personnel en arabe. Conversations régulières."},
          ]},
          {type:"highlight", color:C.teal, text:"Les 3 secrets : (1) La régularité > l'intensité : 20 min/jour > 3h le weekend. (2) Contexte > répétition. (3) Trouvez du contenu qui VOUS intéresse."},
        ],
        flashcards:[
          {ar:"التَّكْرَار",tr:"At-tikraar",fr:"La répétition"},
          {ar:"الاسْتِمَاع",tr:"Al-istimaa'",fr:"L'écoute"},
          {ar:"الكِتَابَة",tr:"Al-kitaabah",fr:"L'écriture"},
          {ar:"المُحَادَثَة",tr:"Al-muhaadathah",fr:"La conversation"},
          {ar:"الإِتْقَان",tr:"Al-itqaan",fr:"La maîtrise"},
        ],
      },
    ],
    exercises:[
      {q:"بَيْتُ الرَّجُل signifie :", opts:["Un homme dans la maison","La maison de l'homme","La grande maison","L'homme est dans la maison"], ans:"La maison de l'homme"},
      {q:"لَم يَكْتُب signifie :", opts:["Il écrit","Il va écrire","Il n'a pas écrit","Il a écrit"], ans:"Il n'a pas écrit"},
      {q:"Le mot 'algèbre' vient de l'arabe :", opts:["الكِيمِيَاء","الجَبْر","القَهْوَة","السُّكَّر"], ans:"الجَبْر"},
      {q:"La régularité recommandée est :", opts:["3h le weekend","20 min par jour","1h par semaine","5h par mois"], ans:"20 min par jour"},
      {q:"L'idafa fonctionne :", opts:["Avec de/du","Sans article sur le 1er nom","Avec l'adjectif avant","Avec une préposition"], ans:"Sans article sur le 1er nom"},
    ],
  },
];

/* ── TTS ── */
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA"; u.rate = 0.72; u.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const arVoice = voices.find(v => v.lang.startsWith("ar"));
  if (arVoice) u.voice = arVoice;
  window.speechSynthesis.speak(u);
}

function GridLines() {
  return <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,backgroundSize:"88px 88px",opacity:0.45 }}/>;
}

/* ══════════════════════════════════════════════════════════
   FLASHCARD COMPONENT
══════════════════════════════════════════════════════════ */
function FlashcardDeck({ cards, color }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [done, setDone] = useState(false);

  const card = cards[idx];
  const remaining = cards.filter((_, i) => !known.has(i));

  const handleKnow = () => {
    const newKnown = new Set([...known, idx]);
    setKnown(newKnown);
    setFlipped(false);
    if (newKnown.size === cards.length) { setDone(true); return; }
    let next = (idx + 1) % cards.length;
    while (newKnown.has(next)) next = (next + 1) % cards.length;
    setIdx(next);
  };
  const handleAgain = () => {
    setFlipped(false);
    let next = (idx + 1) % cards.length;
    while (known.has(next) && known.size < cards.length) next = (next + 1) % cards.length;
    setIdx(next);
  };
  const reset = () => { setIdx(0); setFlipped(false); setKnown(new Set()); setDone(false); };

  if (done) return (
    <div style={{ textAlign:"center", padding:"32px 20px" }}>
      <div style={{ fontSize:56, fontFamily:"'Cormorant Garamond',serif", fontWeight:700, color:C.teal, lineHeight:1, marginBottom:8 }}>🌟</div>
      <div style={{ fontSize:20, fontFamily:"'Cormorant Garamond',serif", fontWeight:700, color:C.text, marginBottom:6 }}>Toutes les cartes maîtrisées !</div>
      <div style={{ fontSize:13, color:C.muted, marginBottom:24, fontFamily:"'DM Sans',sans-serif" }}>{cards.length} cartes · 100%</div>
      <button onClick={reset} style={{ padding:"10px 24px", borderRadius:12, background:`${color}20`, color, border:`1px solid ${color}40`, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>🔄 Recommencer</button>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.dim, fontFamily:"'DM Sans',sans-serif" }}>Carte {idx+1} / {cards.length}</span>
        <div style={{ display:"flex", gap:6 }}>
          {cards.map((_, i) => (
            <div key={i} style={{ width:8, height:8, borderRadius:99, background: known.has(i) ? C.teal : i===idx ? color : C.border, transition:"background 0.3s" }}/>
          ))}
        </div>
        <span style={{ fontSize:11, fontWeight:700, color:C.teal, fontFamily:"'DM Sans',sans-serif" }}>✓ {known.size}/{cards.length}</span>
      </div>

      <motion.div
        onClick={() => setFlipped(f => !f)}
        style={{ cursor:"pointer", perspective:1000, height:200, marginBottom:16, position:"relative" }}
        whileHover={{ scale:1.01 }}
        whileTap={{ scale:0.98 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration:0.45, ease:[0.22,0.68,0,1] }}
          style={{ width:"100%", height:"100%", position:"relative", transformStyle:"preserve-3d" }}
        >
          {/* Front */}
          <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", borderRadius:20, background:C.card, border:`1px solid ${color}30`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},transparent)`, borderRadius:"20px 20px 0 0" }}/>
            <div style={{ fontSize:10, fontWeight:700, color:color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>Arabe</div>
            <div style={{ fontFamily:"'Amiri',serif", fontSize:44, color:C.text, direction:"rtl", lineHeight:1.2, textAlign:"center" }}>{card.ar}</div>
            <button onClick={e=>{e.stopPropagation(); speak(card.ar);}} style={{ marginTop:14, padding:"5px 12px", borderRadius:8, background:`${color}15`, border:`1px solid ${color}30`, color, cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600 }}>
              <Volume2 size={12}/> Écouter
            </button>
          </div>
          {/* Back */}
          <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", transform:"rotateY(180deg)", borderRadius:20, background:`${color}12`, border:`1px solid ${color}40`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},transparent)`, borderRadius:"20px 20px 0 0" }}/>
            <div style={{ fontSize:14, fontWeight:700, color:color, fontFamily:"'DM Sans',sans-serif", marginBottom:6, fontStyle:"italic" }}>{card.tr}</div>
            <div style={{ fontSize:22, fontWeight:700, color:C.text, fontFamily:"'Cormorant Garamond',serif" }}>{card.fr}</div>
          </div>
        </motion.div>
      </motion.div>

      <div style={{ fontSize:12, color:C.dim, textAlign:"center", marginBottom:16, fontFamily:"'DM Sans',sans-serif" }}>
        {flipped ? "Évaluez votre réponse" : "Cliquez pour révéler la traduction"}
      </div>

      {flipped && (
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ display:"flex", gap:10 }}>
          <button onClick={handleAgain} style={{ flex:1, padding:"12px 16px", borderRadius:12, background:"rgba(212,101,74,0.1)", border:"1px solid rgba(212,101,74,0.3)", color:C.coral, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            🔄 À revoir
          </button>
          <button onClick={handleKnow} style={{ flex:1, padding:"12px 16px", borderRadius:12, background:"rgba(29,181,132,0.12)", border:"1px solid rgba(29,181,132,0.3)", color:C.teal, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            ✓ Je sais !
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   WRITING PAD
══════════════════════════════════════════════════════════ */
function WritingPad({ color }) {
  const [text, setText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const HINTS = ["مَرْحَبًا","كَيْفَ حَالُك؟","أَنَا طَالِبٌ","الكِتَابُ جَمِيلٌ","شُكْرًا جَزِيلاً"];
  const hint = HINTS[Math.floor(Math.random() * HINTS.length)];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, gap:10 }}>
        <div style={{ fontSize:10, fontWeight:700, color:color, letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>Entraînement à l'écriture arabe</div>
        <button onClick={() => setShowHint(s => !s)} style={{ padding:"5px 12px", borderRadius:8, background:`${color}15`, border:`1px solid ${color}30`, color, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:4 }}>
          {showHint ? <EyeOff size={12}/> : <Eye size={12}/>} {showHint ? "Masquer" : "Exemple"}
        </button>
      </div>
      <AnimatePresence>
        {showHint && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
            style={{ padding:"12px 16px", borderRadius:12, background:`${color}08`, border:`1px solid ${color}20`, marginBottom:12, fontFamily:"'Amiri',serif", fontSize:28, direction:"rtl", color:C.muted, textAlign:"center" }}>
            {hint}
          </motion.div>
        )}
      </AnimatePresence>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="اكتب هنا..."
        dir="rtl"
        style={{ width:"100%", minHeight:120, padding:"16px 18px", borderRadius:14, background:"rgba(0,0,0,0.35)", border:`1px solid ${C.border}`, color:C.text, fontFamily:"'Amiri',serif", fontSize:28, lineHeight:1.8, resize:"vertical", outline:"none", boxSizing:"border-box" }}
        onFocus={e => e.target.style.borderColor = color + "60"}
        onBlur={e => e.target.style.borderColor = C.border}
      />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
        <span style={{ fontSize:11, color:C.dim, fontFamily:"'DM Sans',sans-serif" }}>{text.length} caractère{text.length !== 1 ? "s" : ""}</span>
        <button onClick={() => setText("")} style={{ padding:"4px 10px", borderRadius:7, background:"transparent", border:`1px solid ${C.border}`, color:C.dim, cursor:"pointer", fontSize:10, fontFamily:"'DM Sans',sans-serif" }}>Effacer</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTENT BLOCK
══════════════════════════════════════════════════════════ */
function ContentBlock({ block, moduleColor }) {
  const color = moduleColor || ACCENT;

  if (block.type === "intro") return (
    <div style={{ padding:"20px 24px", borderRadius:16, background:"rgba(255,255,255,0.025)", border:`1px solid ${C.border}`, marginBottom:20 }}>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:C.text, lineHeight:1.8, margin:0, fontStyle:"italic" }}>{block.text}</p>
    </div>
  );

  if (block.type === "highlight") return (
    <div style={{ padding:"16px 20px", borderRadius:14, background:`${block.color||color}0f`, border:`1px solid ${block.color||color}30`, borderLeft:`4px solid ${block.color||color}`, marginBottom:20 }}>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.text, lineHeight:1.7, margin:0, fontWeight:400 }}>{block.text}</p>
    </div>
  );

  if (block.type === "section") return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:10, fontWeight:700, color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1, height:1, background:`${color}25` }}/>{block.title}<div style={{ flex:3, height:1, background:`${color}25` }}/>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {block.items.map((item, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 18px", borderRadius:14, background:"rgba(255,255,255,0.02)", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:18, flexShrink:0, width:28, textAlign:"center" }}>{item.icon}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>{item.label}</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>{item.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (block.type === "cards") return (
    <div style={{ marginBottom:24 }}>
      {block.title && (
        <div style={{ fontSize:10, fontWeight:700, color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ flex:1, height:1, background:`${color}25` }}/>{block.title}<div style={{ flex:3, height:1, background:`${color}25` }}/>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
        {block.cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04, duration:0.3 }}
            style={{ padding:"16px 18px", borderRadius:16, background:C.card, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${color},transparent)` }}/>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10, gap:8 }}>
              <div style={{ fontFamily:"'Amiri',serif", fontSize:26, color:C.text, direction:"rtl", lineHeight:1.2, fontWeight:700 }}>{card.ar}</div>
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.95 }} onClick={() => speak(card.ar)}
                style={{ padding:6, borderRadius:9, background:`${color}15`, border:`1px solid ${color}30`, color, cursor:"pointer", flexShrink:0 }}>
                <Volume2 size={12}/>
              </motion.button>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color, marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>{card.tr}</div>
            <div style={{ fontSize:11, color:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>{card.fr}</div>
            {card.note && <div style={{ fontSize:10, color:C.dim, marginTop:4, fontStyle:"italic", fontFamily:"'DM Sans',sans-serif" }}>{card.note}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (block.type === "numbers") return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:10, fontWeight:700, color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1, height:1, background:`${color}25` }}/>{block.title}<div style={{ flex:3, height:1, background:`${color}25` }}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(88px,1fr))", gap:10 }}>
        {block.numbers.map((n, i) => (
          <motion.div key={i} whileHover={{ y:-3 }} onClick={() => speak(n.name)}
            style={{ padding:"12px 8px", borderRadius:14, background:C.card, border:`1px solid ${C.border}`, textAlign:"center", cursor:"pointer" }}>
            <div style={{ fontFamily:"'Amiri',serif", fontSize:30, color, lineHeight:1, marginBottom:3 }}>{n.ar}</div>
            <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:1, fontFamily:"'DM Sans',sans-serif" }}>{n.val}</div>
            <div style={{ fontSize:9, color:C.dim, fontFamily:"'DM Sans',sans-serif" }}>{n.tr}</div>
            {n.note && <div style={{ fontSize:8, color, marginTop:3, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>{n.note}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (block.type === "table") return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:10, fontWeight:700, color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1, height:1, background:`${color}25` }}/>{block.title}<div style={{ flex:3, height:1, background:`${color}25` }}/>
      </div>
      <div style={{ borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}` }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:`${color}12` }}>
              {block.headers.map((h, i) => (
                <th key={i} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, fontWeight:700, color, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} style={{ borderBottom:`1px solid ${C.border}` }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding:"10px 16px", fontSize:/[\u0600-\u06FF]/.test(cell)?20:12, fontFamily:/[\u0600-\u06FF]/.test(cell)?"'Amiri',serif":"'DM Sans',sans-serif", color:ci===0?C.dim:/[\u0600-\u06FF]/.test(cell)?C.text:C.muted, direction:/[\u0600-\u06FF]/.test(cell)?"rtl":"ltr", fontWeight:ci===0?600:300 }}>
                    {cell}
                    {ci===1 && /[\u0600-\u06FF]/.test(cell) && (
                      <button onClick={() => speak(cell)} style={{ marginRight:6, padding:"2px 5px", borderRadius:5, background:`${color}12`, border:`1px solid ${color}25`, color, cursor:"pointer", fontSize:9 }}>▶</button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (block.type === "examples_list") return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:10, fontWeight:700, color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1, height:1, background:`${color}25` }}/>{block.title}<div style={{ flex:3, height:1, background:`${color}25` }}/>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {block.examples.map((ex, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", borderRadius:14, background:"rgba(255,255,255,0.02)", border:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:"'Amiri',serif", fontSize:20, color:C.text, direction:"rtl", minWidth:140, lineHeight:1.4 }}>{ex.ar}</div>
            <button onClick={() => speak(ex.ar)} style={{ padding:"4px 7px", borderRadius:7, background:`${color}12`, border:`1px solid ${color}25`, color, cursor:"pointer", flexShrink:0 }}>
              <Volume2 size={11}/>
            </button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:600, color, marginBottom:2, fontFamily:"'DM Sans',sans-serif", fontStyle:"italic" }}>{ex.tr}</div>
              <div style={{ fontSize:11, color:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>{ex.fr}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (block.type === "text_ar") return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {block.paragraphs.map((p, i) => (
          <div key={i} style={{ padding:"16px 20px", borderRadius:16, background:`${color}08`, border:`1px solid ${color}20`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:3, height:"100%", background:color, opacity:0.4 }}/>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:8 }}>
              <div style={{ fontFamily:"'Amiri',serif", fontSize:22, color:C.text, direction:"rtl", lineHeight:1.7, flex:1 }}>{p.ar}</div>
              <button onClick={() => speak(p.ar)} style={{ padding:6, borderRadius:8, background:`${color}15`, border:`1px solid ${color}30`, color, cursor:"pointer", flexShrink:0, marginTop:2 }}>
                <Volume2 size={12}/>
              </button>
            </div>
            <div style={{ fontSize:10, color:`${color}cc`, fontStyle:"italic", marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>{p.tr}</div>
            <div style={{ fontSize:11, color:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>{p.fr}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}

/* ══════════════════════════════════════════════════════════
   QUIZ DRILL
══════════════════════════════════════════════════════════ */
function ModuleDrill({ exercises, color, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [done, setDone] = useState(false);

  const q = exercises[idx];

  const answer = (opt) => {
    if (answered !== null) return;
    setAnswered(opt);
    const correct = opt === q.ans;
    if (correct) { setScore(s => s+1); setStreak(s => s+1); }
    else setStreak(0);
    setTimeout(() => {
      if (idx+1 >= exercises.length) setDone(true);
      else { setIdx(i => i+1); setAnswered(null); }
    }, 1500);
  };

  if (done) return (
    <div style={{ textAlign:"center", padding:"40px 24px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:72, fontWeight:700, color, lineHeight:1, marginBottom:8 }}>
        {Math.round((score/exercises.length)*100)}%
      </div>
      <p style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:6, fontFamily:"'Cormorant Garamond',serif" }}>{score} / {exercises.length} correctes</p>
      <p style={{ fontSize:13, color:C.muted, marginBottom:28, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>
        {score===exercises.length?"🌟 Module maîtrisé !":score>=exercises.length*0.7?"👏 Très bien !":"📚 Continuez à pratiquer !"}
      </p>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <button onClick={() => { setIdx(0);setScore(0);setStreak(0);setAnswered(null);setDone(false); }}
          style={{ padding:"11px 24px", borderRadius:13, background:`${color}20`, color, border:`1px solid ${color}40`, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
          🔄 Recommencer
        </button>
        {onFinish && (
          <button onClick={onFinish} style={{ padding:"11px 24px", borderRadius:13, background:color, color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            Module suivant →
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.dim, fontFamily:"'DM Sans',sans-serif" }}>Question {idx+1}/{exercises.length}</span>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {streak >= 2 && (
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
              style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:99, background:"rgba(201,168,76,0.15)", border:"1px solid rgba(201,168,76,0.3)", fontSize:11, fontWeight:700, color:C.gold }}>
              <Flame size={11}/> {streak} 🔥
            </motion.div>
          )}
          <span style={{ fontSize:11, fontWeight:700, color, fontFamily:"'DM Sans',sans-serif" }}>✓ {score}</span>
        </div>
      </div>
      <div style={{ height:3, borderRadius:99, background:C.border, marginBottom:20, overflow:"hidden" }}>
        <motion.div animate={{ width:`${(idx/exercises.length)*100}%` }}
          style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${color},${color}99)`, transition:"width 0.4s" }}/>
      </div>
      <div style={{ padding:"24px 20px", borderRadius:18, background:"rgba(0,0,0,0.3)", border:`1px solid ${C.border}`, marginBottom:16 }}>
        <p style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:20, fontFamily:"'Cormorant Garamond',serif", lineHeight:1.4 }}>{q.q}</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {q.opts.map((opt, i) => {
            const isCorrect = opt === q.ans;
            const isWrong   = answered === opt && !isCorrect;
            const isRight   = answered !== null && isCorrect;
            return (
              <motion.button key={i} onClick={() => answer(opt)} whileHover={answered===null?{ x:4 }:{}}
                style={{ padding:"12px 18px", borderRadius:12, textAlign:"left", fontWeight:600, fontSize:13,
                  background: answered===null?"rgba(255,255,255,0.03)":isRight?`${C.teal}12`:isWrong?"rgba(212,101,74,0.1)":"rgba(255,255,255,0.02)",
                  border:`1.5px solid ${answered===null?C.border:isRight?C.teal+"50":isWrong?C.coral+"40":C.border}`,
                  color: answered===null?C.muted:isRight?C.teal:isWrong?C.coral:C.dim,
                  cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif" }}>
                {opt}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {answered && (
            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
              style={{ marginTop:14, padding:"11px 16px", borderRadius:11, fontSize:12, fontWeight:700,
                background: answered===q.ans?"rgba(29,181,132,0.1)":"rgba(212,101,74,0.1)",
                border:`1px solid ${answered===q.ans?"rgba(29,181,132,0.3)":"rgba(212,101,74,0.3)"}`,
                color: answered===q.ans?C.teal:C.coral, fontFamily:"'DM Sans',sans-serif" }}>
              {answered===q.ans?"✅ Bonne réponse !": `❌ La bonne réponse : ${q.ans}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   XP TOAST
══════════════════════════════════════════════════════════ */
function XpToast({ show, points, lessonTitle }) {
  if (!show) return null;
  return (
    <motion.div initial={{ opacity:0, y:32, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:16 }}
      style={{ position:"fixed", bottom:32, right:32, zIndex:9999, background:`linear-gradient(135deg,${ACCENT}ee,${ACCENT}99)`, backdropFilter:"blur(16px)", color:"#fff", padding:"18px 24px", borderRadius:20, boxShadow:`0 8px 40px ${ACCENT}60`, fontFamily:"'DM Sans',sans-serif", minWidth:220 }}>
      <span style={{ fontSize:22, fontWeight:900, display:"block" }}>+10 XP 🎉</span>
      <span style={{ fontSize:12, fontWeight:600, opacity:0.9, display:"block", marginTop:3 }}>{lessonTitle}</span>
      <span style={{ fontSize:13, fontWeight:800, marginTop:4, display:"block" }}>Total : {points} pts ✨</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function ArabeModerneStandard() {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeTab, setActiveTab]   = useState("lesson");
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [xpNotif, setXpNotif]       = useState(null);
  const [marking, setMarking]       = useState(false);

  const activeModule  = MODULES[activeModuleIdx];
  const activeLesson  = activeModule.lessons[activeLessonIdx];
  const lessonKey     = `${activeModule.title} — ${activeLesson.title}`;
  const totalLessons  = MODULES.reduce((a, m) => a + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progressPct   = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isDone        = completedLessons.has(lessonKey);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    axios.get(`${API}/api/user/${email}`)
      .then(r => setCompletedLessons(new Set(r.data.completedLessons?.map(k => k.replace(/^Arabe Moderne Standard — /, "")) || [])))
      .catch(() => {});
    if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = () => {};
  }, []);

  const handleMarkComplete = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) { alert("Connectez-vous pour enregistrer votre progression."); return; }
    if (isDone) return;
    setMarking(true);
    try {
      const res = await axios.post(`${API}/api/update-progress`, { email, lessonTitle:`Arabe Moderne Standard — ${lessonKey}` });
      setCompletedLessons(prev => new Set([...prev, lessonKey]));
      setXpNotif({ lessonTitle: activeLesson.title, points: res.data.points });
      setTimeout(() => setXpNotif(null), 4200);
    } catch { alert("Impossible d'enregistrer."); }
    setMarking(false);
  };

  const goNextLesson = () => {
    const mod = MODULES[activeModuleIdx];
    if (activeLessonIdx < mod.lessons.length - 1) { setActiveLessonIdx(activeLessonIdx + 1); setActiveTab("lesson"); }
    else if (activeModuleIdx < MODULES.length - 1) { setActiveModuleIdx(activeModuleIdx + 1); setActiveLessonIdx(0); setActiveTab("lesson"); }
  };

  const isModuleDone = (m) => m.lessons.every(l => completedLessons.has(`${m.title} — ${l.title}`));

  const TABS = [
    { id:"lesson",    label:"📖 Leçon" },
    { id:"cards",     label:"🃏 Flashcards" },
    { id:"write",     label:"✍️ Écriture" },
    { id:"drill",     label:"🎯 Quiz" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.text, position:"relative" }}>
      <style>{FONT_LINK + `
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:rgba(79,173,212,0.25);color:#f2ede6}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#080b0f}
        ::-webkit-scrollbar-thumb{background:rgba(79,173,212,0.2);border-radius:99px}
        textarea{font-family:'Amiri',serif !important}
      `}</style>
      <GridLines/>
      <AnimatePresence><XpToast show={!!xpNotif} points={xpNotif?.points} lessonTitle={xpNotif?.lessonTitle}/></AnimatePresence>

      {/* TOP BAR */}
      <div style={{ position:"sticky", top:0, zIndex:40, background:"rgba(8,11,15,0.9)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1300, margin:"0 auto", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
          <Link to="/courses" style={{ textDecoration:"none", display:"inline-flex", alignItems:"center", gap:7, fontSize:12, fontWeight:600, color:C.muted, padding:"6px 14px", borderRadius:99, border:`1px solid ${C.border}` }}
            onMouseEnter={e=>{e.currentTarget.style.color=C.text;e.currentTarget.style.borderColor=C.borderM;}}
            onMouseLeave={e=>{e.currentTarget.style.color=C.muted;e.currentTarget.style.borderColor=C.border;}}>
            <ArrowLeft size={13}/> Catalogue
          </Link>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700, color:C.text }}>Arabe Standard Moderne</div>
            <div style={{ fontFamily:"'Amiri',serif", fontSize:12, color:`${ACCENT}99`, direction:"rtl" }}>اللغة العربية الفصحى المعاصرة</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:ACCENT, background:`${ACCENT}15`, border:`1px solid ${ACCENT}30`, padding:"5px 12px", borderRadius:99 }}>
              <CheckCircle size={11}/>{completedCount}/{totalLessons} · {progressPct}%
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1300, margin:"0 auto", padding:"24px 24px 80px", display:"grid", gridTemplateColumns:"252px 1fr", gap:22, alignItems:"start", position:"relative", zIndex:3 }}>

        {/* SIDEBAR */}
        <aside style={{ position:"sticky", top:76, display:"flex", flexDirection:"column", gap:12 }}>

          {/* Progress ring-style card */}
          <div style={{ borderRadius:18, background:C.card, border:`1px solid ${C.border}`, padding:18, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${ACCENT},${C.teal})` }}/>
            <div style={{ fontSize:9, fontWeight:700, color:ACCENT, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}>Progression du cours</div>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
              <div style={{ position:"relative", width:52, height:52, flexShrink:0 }}>
                <svg width="52" height="52" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="26" cy="26" r="22" fill="none" stroke={C.border} strokeWidth="4"/>
                  <motion.circle cx="26" cy="26" r="22" fill="none" stroke={ACCENT} strokeWidth="4"
                    strokeDasharray={`${2*Math.PI*22}`}
                    initial={{ strokeDashoffset: 2*Math.PI*22 }}
                    animate={{ strokeDashoffset: 2*Math.PI*22 * (1 - progressPct/100) }}
                    transition={{ duration:1.2, ease:[.22,.68,0,1] }}
                    strokeLinecap="round"/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:ACCENT }}>{progressPct}%</div>
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:C.text, fontFamily:"'Cormorant Garamond',serif" }}>{completedCount} leçons</div>
                <div style={{ fontSize:11, color:C.dim, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>sur {totalLessons} terminées</div>
              </div>
            </div>
            <div style={{ height:4, borderRadius:99, background:C.border, overflow:"hidden" }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${progressPct}%` }} transition={{ duration:1, ease:[.22,.68,0,1] }}
                style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${ACCENT},${C.teal})` }}/>
            </div>
          </div>

          {/* Module nav */}
          <div style={{ borderRadius:18, background:C.card, border:`1px solid ${C.border}`, overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}>
              <Layers size={12} style={{ color:ACCENT }}/>
              <span style={{ fontSize:10, fontWeight:700, color:ACCENT, letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>7 Modules · 21 Leçons</span>
            </div>
            <div style={{ maxHeight:460, overflowY:"auto", padding:"4px 0" }}>
              {MODULES.map((mod, mi) => {
                const isActive = activeModuleIdx === mi;
                const modDone  = isModuleDone(mod);
                return (
                  <div key={mod.id}>
                    <motion.button whileHover={{ x:2 }}
                      onClick={() => { setActiveModuleIdx(mi); setActiveLessonIdx(0); setActiveTab("lesson"); }}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 16px", textAlign:"left", background:isActive?`${mod.color}09`:"transparent", border:"none", cursor:"pointer", borderLeft:`3px solid ${isActive?mod.color:"transparent"}` }}>
                      <div style={{ width:26, height:26, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:isActive?mod.color:modDone?`${C.teal}18`:"rgba(255,255,255,0.04)", fontSize:9, fontWeight:800, color:isActive?"#fff":modDone?C.teal:C.dim, fontFamily:"'DM Sans',sans-serif", border:`1px solid ${isActive?mod.color:modDone?C.teal+"30":C.border}` }}>
                        {modDone?"✓":mod.num}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:11, fontWeight:600, color:isActive?C.text:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif" }}>{mod.title}</div>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>{mod.lessons.length} leçons</div>
                      </div>
                      {modDone?<CheckCircle size={11} style={{ color:C.teal, flexShrink:0 }}/>:<ChevronRight size={11} style={{ color:C.dim, flexShrink:0 }}/>}
                    </motion.button>
                    {isActive && (
                      <div style={{ paddingBottom:4 }}>
                        {mod.lessons.map((ls, li) => {
                          const lKey   = `${mod.title} — ${ls.title}`;
                          const lDone  = completedLessons.has(lKey);
                          const lActive = activeLessonIdx === li;
                          return (
                            <button key={ls.id} onClick={() => { setActiveLessonIdx(li); setActiveTab("lesson"); }}
                              style={{ width:"100%", display:"flex", alignItems:"center", gap:7, padding:"6px 16px 6px 34px", background:lActive?`${mod.color}10`:"transparent", border:"none", cursor:"pointer", borderLeft:`3px solid ${lActive?mod.color:"transparent"}` }}>
                              <div style={{ width:14, height:14, borderRadius:3, background:lDone?`${C.teal}20`:lActive?`${mod.color}20`:"rgba(255,255,255,0.03)", border:`1px solid ${lDone?C.teal+"50":lActive?mod.color+"40":C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, color:lDone?C.teal:lActive?mod.color:C.dim, flexShrink:0 }}>
                                {lDone?"✓":lActive?"▶":""}
                              </div>
                              <span style={{ fontSize:10, fontWeight:lActive?600:400, color:lActive?mod.color:C.dim, fontFamily:"'DM Sans',sans-serif", lineHeight:1.3, textAlign:"left" }}>{ls.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course info */}
          <div style={{ borderRadius:18, background:C.card, border:`1px solid ${C.border}`, padding:16 }}>
            <div style={{ fontSize:9, fontWeight:700, color:C.dim, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}>Ce cours inclut</div>
            {[
              { icon:<Brain size={11}/>,    label:"Flashcards interactives" },
              { icon:<PenLine size={11}/>,  label:"Entraînement à l'écriture" },
              { icon:<Target size={11}/>,   label:"Quiz avec score de flamme" },
              { icon:<Volume2 size={11}/>,  label:"Audio natif arabe" },
              { icon:<Award size={11}/>,    label:"Certificat de réussite" },
              { icon:<Zap size={11}/>,      label:"Accès à vie" },
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:9, fontSize:11, color:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:300, marginBottom:8 }}>
                <span style={{ color:ACCENT }}>{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main>
          {/* Module header + hero band */}
          <motion.div key={activeModuleIdx}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[.22,.68,0,1] }}
            style={{ borderRadius:22, overflow:"hidden", background:C.card, border:`1px solid ${C.border}`, marginBottom:20, position:"relative" }}>
            <div style={{ background:`linear-gradient(135deg,${activeModule.color}22,transparent 60%)`, padding:"24px 28px 0" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${activeModule.color},transparent)` }}/>
              {/* Big Arabic watermark */}
              <div style={{ position:"absolute", top:-10, right:20, fontFamily:"'Amiri',serif", fontSize:110, color:`${activeModule.color}09`, lineHeight:1, userSelect:"none", pointerEvents:"none" }}>{activeModule.icon}</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18, position:"relative" }}>
                <div style={{ width:50, height:50, borderRadius:14, background:`${activeModule.color}18`, border:`2px solid ${activeModule.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Amiri',serif", fontSize:26, color:activeModule.color, flexShrink:0 }}>
                  {activeModule.icon}
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:activeModule.color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>Module {activeModule.num}</div>
                  <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:C.text, lineHeight:1.1 }}>{activeModule.title}</h1>
                  <div style={{ fontFamily:"'Amiri',serif", fontSize:14, color:`${activeModule.color}88`, direction:"rtl" }}>{activeModule.titleAr}</div>
                </div>
              </div>
              {/* Tab bar */}
              <div style={{ display:"flex", gap:0, borderTop:`1px solid ${C.border}` }}>
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ flex:1, padding:"12px 8px", fontSize:11, fontWeight:700, color:activeTab===tab.id?activeModule.color:C.dim, borderBottom:`2px solid ${activeTab===tab.id?activeModule.color:"transparent"}`, background:"transparent", border:"none", borderBottom:`2px solid ${activeTab===tab.id?activeModule.color:"transparent"}`, cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.01em" }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Lesson sub-tabs (only in lesson mode) */}
          {activeTab === "lesson" && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
              {activeModule.lessons.map((ls, li) => {
                const lKey  = `${activeModule.title} — ${ls.title}`;
                const lDone = completedLessons.has(lKey);
                const isActive = activeLessonIdx === li;
                return (
                  <button key={ls.id} onClick={() => setActiveLessonIdx(li)}
                    style={{ padding:"5px 14px", borderRadius:99, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", background:isActive?`${activeModule.color}22`:"rgba(255,255,255,0.04)", color:isActive?activeModule.color:lDone?C.teal:C.dim, border:`1px solid ${isActive?activeModule.color+"50":lDone?C.teal+"25":C.border}`, transition:"all 0.2s" }}>
                    {lDone?"✓ ":""}{li+1}. {ls.subtitle}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div key={`${activeModuleIdx}-${activeLessonIdx}-${activeTab}`}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}>

              {/* ── LESSON ── */}
              {activeTab === "lesson" && (
                <div>
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:activeModule.color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6, fontFamily:"'DM Sans',sans-serif" }}>
                      Leçon {activeLessonIdx+1} / {activeModule.lessons.length}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:C.text, lineHeight:1.15 }}>{activeLesson.title}</h2>
                      {isDone && (
                        <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0, padding:"5px 12px", borderRadius:99, background:"rgba(29,181,132,0.12)", border:"1px solid rgba(29,181,132,0.3)", fontSize:11, fontWeight:700, color:C.teal }}>
                          <CheckCircle size={11}/> Terminée
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column" }}>
                    {activeLesson.content.map((block, i) => <ContentBlock key={i} block={block} moduleColor={activeModule.color}/>)}
                  </div>
                  <div style={{ marginTop:24 }}>
                    {isDone ? (
                      <div style={{ display:"flex", alignItems:"center", gap:9, padding:"13px 18px", borderRadius:13, background:"rgba(29,181,132,0.08)", border:"1px solid rgba(29,181,132,0.25)", color:C.teal, fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                        <CheckCircle size={16}/> Leçon déjà enregistrée ✅
                      </div>
                    ) : (
                      <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} onClick={handleMarkComplete} disabled={marking}
                        style={{ width:"100%", padding:"14px 20px", borderRadius:13, background:`linear-gradient(135deg,${activeModule.color},${activeModule.color}bb)`, color:"#fff", border:"none", fontWeight:900, fontSize:14, cursor:marking?"not-allowed":"pointer", opacity:marking?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"'DM Sans',sans-serif", boxShadow:`0 4px 24px ${activeModule.color}40` }}>
                        {marking?"⏳ Enregistrement...":"✅ Leçon terminée — +10 XP"}
                      </motion.button>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:10, marginTop:14 }}>
                    <button onClick={() => { if (activeLessonIdx>0) setActiveLessonIdx(activeLessonIdx-1); else if (activeModuleIdx>0) { setActiveModuleIdx(activeModuleIdx-1); setActiveLessonIdx(MODULES[activeModuleIdx-1].lessons.length-1); } setActiveTab("lesson"); }}
                      style={{ padding:"9px 18px", borderRadius:11, fontWeight:700, fontSize:12, background:"rgba(255,255,255,0.05)", color:C.muted, border:`1px solid ${C.border}`, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                      ← Précédent
                    </button>
                    <button onClick={goNextLesson}
                      style={{ padding:"9px 18px", borderRadius:11, fontWeight:700, fontSize:12, background:`${activeModule.color}20`, color:activeModule.color, border:`1px solid ${activeModule.color}40`, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                      Suivant →
                    </button>
                  </div>
                </div>
              )}

              {/* ── FLASHCARDS ── */}
              {activeTab === "cards" && (
                <div>
                  <div style={{ marginBottom:18 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:activeModule.color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6, fontFamily:"'DM Sans',sans-serif" }}>Vocabulaire clé — {activeLesson.title}</div>
                    <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:C.text }}>Révision par flashcards</h2>
                    <p style={{ fontSize:12, color:C.muted, marginTop:4, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>Cliquez sur la carte pour révéler la traduction. Évaluez ensuite votre réponse.</p>
                  </div>
                  <div style={{ background:C.card, borderRadius:20, border:`1px solid ${C.border}`, padding:24 }}>
                    <FlashcardDeck cards={activeLesson.flashcards} color={activeModule.color}/>
                  </div>
                </div>
              )}

              {/* ── WRITING ── */}
              {activeTab === "write" && (
                <div>
                  <div style={{ marginBottom:18 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:activeModule.color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6, fontFamily:"'DM Sans',sans-serif" }}>Pratique libre</div>
                    <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:C.text }}>Entraînement à l'écriture arabe</h2>
                    <p style={{ fontSize:12, color:C.muted, marginTop:4, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>Utilisez ce bloc-note pour vous exercer à écrire en arabe. Copiez des mots du cours ou composez librement.</p>
                  </div>
                  <div style={{ background:C.card, borderRadius:20, border:`1px solid ${C.border}`, padding:24 }}>
                    <WritingPad color={activeModule.color}/>
                  </div>
                  <div style={{ marginTop:16, padding:"16px 20px", borderRadius:14, background:`${activeModule.color}08`, border:`1px solid ${activeModule.color}20` }}>
                    <div style={{ fontSize:10, fontWeight:700, color:activeModule.color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}>Mots à pratiquer ce module</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {activeLesson.flashcards.map((fc, i) => (
                        <motion.button key={i} whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                          style={{ padding:"7px 14px", borderRadius:10, background:C.card, border:`1px solid ${C.border}`, cursor:"pointer", fontFamily:"'Amiri',serif", fontSize:20, color:C.text, direction:"rtl" }}>
                          {fc.ar}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── QUIZ ── */}
              {activeTab === "drill" && (
                <div>
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:activeModule.color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6, fontFamily:"'DM Sans',sans-serif" }}>Évaluation du module</div>
                    <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:C.text }}>Quiz — {activeModule.title}</h2>
                    <p style={{ fontSize:12, color:C.muted, marginTop:4, fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>5 questions · Enchaînez les bonnes réponses pour une flamme 🔥</p>
                  </div>
                  <div style={{ background:C.card, borderRadius:20, border:`1px solid ${C.border}`, padding:24 }}>
                    <ModuleDrill exercises={activeModule.exercises} color={activeModule.color} onFinish={goNextLesson}/>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}