import React, { useState, useRef, useEffect, useCallback } from "react";
import { speakArabic } from "../../utils/arabicTTS";

// ─── Global Styles ────────────────────────────────────────────────────────────
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0c0e14;
  --bg2:#111318;
  --bg3:#161920;
  --surface:#1a1d26;
  --surface2:#1f2230;
  --border:rgba(255,255,255,.07);
  --border2:rgba(255,255,255,.13);
  --text:#e8eaf0;
  --text2:#9499b0;
  --text3:#5c6080;
  --gold:#e2b96a;
  --gold2:#f5d48a;
  --gold-dim:rgba(226,185,106,.12);
  --teal:#3ecfbf;
  --teal2:#5ee8d8;
  --teal-dim:rgba(62,207,191,.1);
  --violet:#9b7ff4;
  --violet-dim:rgba(155,127,244,.1);
  --rose:#f07070;
  --rose-dim:rgba(240,112,112,.1);
  --green:#5dd68c;
  --green-dim:rgba(93,214,140,.1);
  --r:10px;--r2:16px;--r3:22px;
}
html{scroll-behavior:smooth}
body{font-family:'Space Grotesk',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:var(--surface2);border-radius:4px}
.arabic{font-family:'Noto Naskh Arabic',serif;direction:rtl;line-height:2}
.mono{font-family:'JetBrains Mono',monospace}
.serif{font-family:'Crimson Pro',Georgia,serif}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 20px 4px rgba(62,207,191,.25)}}
@keyframes recordPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.12);opacity:.7}}
@keyframes waveBar{0%,100%{height:4px}50%{height:18px}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes scoreIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes drawLine{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}
@keyframes correctBounce{0%{transform:scale(1)}30%{transform:scale(1.08)}60%{transform:scale(.96)}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes particleFloat{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-60px) scale(0);opacity:0}}
.fade-up{animation:fadeUp .3s ease both}
.fade-in{animation:fadeIn .2s ease both}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const MODULES = [
  {
    id:0, num:"١", title:"الاسم والفعل", subtitle:"Nom & Verbe",
    color:"#3ecfbf", colorDim:"rgba(62,207,191,.1)", emoji:"📖",
    description:"Les deux piliers de l'arabe : le nom اسم et le verbe فعل.",
    lessons:[
      {
        id:"1a", title:"Le Nom — اسم", icon:"🏷️",
        theory:"Un nom (اسم) désigne une personne, un lieu, une chose ou une idée. Il est défini avec ال (al-) ou indéfini avec le tanwīn (double voyelle finale ـٌ).",
        tableHeaders:["Type","Arabe","Lecture","Sens"],
        tableRows:[
          ["Indéfini","كِتَابٌ","kitābun","un livre"],
          ["Défini","الكِتَابُ","al-kitābu","le livre"],
          ["Acc. indéf.","كِتَاباً","kitāban","un livre (objet)"],
          ["Propre","مُحَمَّدٌ","Muḥammadun","Muhammad"],
        ],
        examples:[
          {ar:"كِتَابٌ جَدِيدٌ",tr:"kitābun jadīdun",fr:"un nouveau livre",tag:"Indéfini"},
          {ar:"الكِتَابُ الجَدِيدُ",tr:"al-kitābu l-jadīdu",fr:"le nouveau livre",tag:"Défini"},
          {ar:"بَيْتٌ كَبِيرٌ",tr:"baytun kabīrun",fr:"une grande maison",tag:"Indéfini"},
        ],
        pronounce:[
          {ar:"كِتَابٌ",tr:"kitābun",hint:"ki · taa · bun"},
          {ar:"الكِتَابُ",tr:"al-kitābu",hint:"al · ki · taa · bu"},
          {ar:"بَيْتٌ",tr:"baytun",hint:"bay · tun"},
          {ar:"مُحَمَّدٌ",tr:"Muḥammadun",hint:"mu · ḥam · ma · dun"},
        ],
        traceWords:[
          {ar:"كِتَابٌ",meaning:"livre"},
          {ar:"بَيْتٌ",meaning:"maison"},
          {ar:"نُورٌ",meaning:"lumière"},
        ]
      },
      {
        id:"1b", title:"Le Verbe — فعل", icon:"⚡",
        theory:"Le verbe (فعل) est bâti sur une racine de 3 lettres. Les trois temps : passé ماضي, présent مضارع, impératif أمر.",
        tableHeaders:["Temps","Arabe","Lecture","Sens"],
        tableRows:[
          ["Passé (ماضي)","كَتَبَ","kataba","il a écrit"],
          ["Présent (مضارع)","يَكْتُبُ","yaktubu","il écrit"],
          ["Impératif (أمر)","اكْتُبْ","uktub","écris !"],
          ["1ère pers. passé","كَتَبْتُ","katabtu","j'ai écrit"],
          ["1ère pers. prés.","أَكْتُبُ","aktubu","j'écris"],
        ],
        examples:[
          {ar:"كَتَبَ الطَّالِبُ",tr:"kataba ṭ-ṭālibu",fr:"l'étudiant a écrit",tag:"ماضي"},
          {ar:"يَقْرَأُ الوَلَدُ",tr:"yaqraʾu l-waladu",fr:"le garçon lit",tag:"مضارع"},
          {ar:"افْتَحِ الكِتَابَ",tr:"iftaḥi l-kitāba",fr:"ouvre le livre !",tag:"أمر"},
        ],
        pronounce:[
          {ar:"كَتَبَ",tr:"kataba",hint:"ka · ta · ba"},
          {ar:"يَكْتُبُ",tr:"yaktubu",hint:"yak · tu · bu"},
          {ar:"اكْتُبْ",tr:"uktub",hint:"uk · tub"},
          {ar:"كَتَبْتُ",tr:"katabtu",hint:"ka · tab · tu"},
        ],
        traceWords:[
          {ar:"كَتَبَ",meaning:"il a écrit"},
          {ar:"قَرَأَ",meaning:"il a lu"},
          {ar:"ذَهَبَ",meaning:"il est allé"},
        ]
      }
    ],
    exercises:[
      {q:"كِتَابٌ est-il défini ou indéfini ?",opts:["Défini (avec ال)","Indéfini (avec tanwīn ـٌ)","Un verbe","Un adjectif"],ans:1,exp:"Le tanwīn ـٌ à la fin marque l'indéfini. Pour le rendre défini : الكِتَابُ."},
      {q:"Quelle est la forme au passé de la racine د-ر-س (étudier) ?",opts:["يَدْرُسُ","دَرَسَ","اُدْرُسْ","دِرَاسَةٌ"],ans:1,exp:"Le passé suit فَعَلَ → دَرَسَ (darasa = il a étudié)."},
      {q:"يَكْتُبُ est à quel temps ?",opts:["Passé ماضي","Présent مضارع","Impératif أمر","Nom verbal"],ans:1,exp:"يَ au début est la marque du مضارع (3ème personne masc.)."},
      {q:"Comment dit-on 'j'ai écrit' ?",opts:["أَكْتُبُ","كَتَبَ","كَتَبْتُ","يَكْتُبُ"],ans:2,exp:"كَتَبْتُ — le suffixe تُ indique la 1ère personne du singulier au passé."},
      {q:"الكِتَابُ signifie :",opts:["un livre","le livre","les livres","un beau livre"],ans:1,exp:"ال au début = article défini, équivalent de 'le/la'."},
    ]
  },
  {
    id:1, num:"٢", title:"المبتدأ والخبر", subtitle:"Sujet & Prédicat",
    color:"#9b7ff4", colorDim:"rgba(155,127,244,.1)", emoji:"⚖️",
    description:"La phrase nominale sans verbe 'être' et le système de cas (الإعراب).",
    lessons:[
      {
        id:"2a", title:"Phrase Nominale — الجملة الاسمية", icon:"🏛️",
        theory:"En arabe, pas de verbe 'être' au présent. La phrase nominale = مبتدأ (sujet) + خبر (prédicat), tous deux au nominatif ـُ.",
        tableHeaders:["Arabe","Lecture","Traduction","Structure"],
        tableRows:[
          ["مُحَمَّدٌ طَالِبٌ","Muḥammadun ṭālibun","Muhammad est un étudiant","مبتدأ + خبر"],
          ["البَيْتُ كَبِيرٌ","al-baytu kabīrun","La maison est grande","مبتدأ + خبر adj."],
          ["هُوَ هُنَا","huwa hunā","Il est ici","ضمير + خبر"],
          ["العِلْمُ نُورٌ","al-ʿilmu nūrun","La connaissance est lumière","مثل عربي"],
        ],
        examples:[
          {ar:"العِلْمُ نُورٌ",tr:"al-ʿilmu nūrun",fr:"La connaissance est une lumière",tag:"Proverbe"},
          {ar:"اللهُ أَكْبَرُ",tr:"Allāhu akbaru",fr:"Dieu est le plus grand",tag:"Religieux"},
          {ar:"الصَّبْرُ جَمِيلٌ",tr:"aṣ-ṣabru jamīlun",fr:"La patience est belle",tag:"Sagesse"},
        ],
        pronounce:[
          {ar:"مُحَمَّدٌ طَالِبٌ",tr:"Muḥammadun ṭālibun",hint:"mu·ḥam·ma·dun ṭaa·li·bun"},
          {ar:"البَيْتُ كَبِيرٌ",tr:"al-baytu kabīrun",hint:"al·bay·tu ka·bii·run"},
          {ar:"العِلْمُ نُورٌ",tr:"al-ʿilmu nūrun",hint:"al·'il·mu nuu·run"},
        ],
        traceWords:[
          {ar:"نُورٌ",meaning:"lumière"},
          {ar:"كَبِيرٌ",meaning:"grand"},
          {ar:"جَمِيلٌ",meaning:"beau"},
        ]
      },
      {
        id:"2b", title:"La Déclinaison — الإعراب", icon:"🔑",
        theory:"L'إعراب marque la fonction par la voyelle finale. Nominatif ـُ (sujet), Accusatif ـَ (objet), Génitif ـِ (après préposition ou إضافة).",
        tableHeaders:["Cas","Voyelle","Rôle","Exemple"],
        tableRows:[
          ["Nominatif (رفع)","ـُ damma","Sujet","الطَّالِبُ نَجَحَ"],
          ["Accusatif (نصب)","ـَ fatḥa","Objet direct","رَأَيْتُ الطَّالِبَ"],
          ["Génitif (جر)","ـِ kasra","Après prép., إضافة","كِتَابُ الطَّالِبِ"],
        ],
        examples:[
          {ar:"الطَّالِبُ نَجَحَ",tr:"aṭ-ṭālibu najaḥa",fr:"L'étudiant a réussi (sujet ـُ)",tag:"Nominatif"},
          {ar:"رَأَيْتُ الطَّالِبَ",tr:"raʾaytu ṭ-ṭāliba",fr:"J'ai vu l'étudiant (objet ـَ)",tag:"Accusatif"},
          {ar:"كِتَابُ الطَّالِبِ",tr:"kitābu ṭ-ṭālibi",fr:"Le livre de l'étudiant (génitif ـِ)",tag:"Génitif"},
        ],
        pronounce:[
          {ar:"الطَّالِبُ",tr:"aṭ-ṭālibu",hint:"aṭ·ṭaa·li·bu"},
          {ar:"نَجَحَ",tr:"najaḥa",hint:"na·ja·ḥa"},
          {ar:"كِتَابُ الطَّالِبِ",tr:"kitābu ṭ-ṭālibi",hint:"ki·taa·bu ṭ·ṭaa·li·bi"},
        ],
        traceWords:[
          {ar:"طَالِبٌ",meaning:"étudiant"},
          {ar:"مُعَلِّمٌ",meaning:"enseignant"},
          {ar:"مَسْجِدٌ",meaning:"mosquée"},
        ]
      }
    ],
    exercises:[
      {q:"Traduisez : البَيْتُ جَمِيلٌ",opts:["Une belle maison","La maison est belle","Les maisons sont belles","C'est une maison"],ans:1,exp:"Phrase nominale : البيت (sujet) + جميل (prédicat) = la maison est belle. Pas de verbe être !"},
      {q:"Quelle voyelle finale marque le nominatif (رفع) ?",opts:["ـَ fatḥa","ـِ kasra","ـُ damma","ـْ sukun"],ans:2,exp:"La damma ـُ marque le nominatif. C'est le cas du sujet."},
      {q:"Dans رَأَيْتُ الكِتَابَ, الكتاب est :",opts:["Sujet","Prédicat","Objet direct","Génitif"],ans:2,exp:"Après رَأَيْتُ (j'ai vu), le nom est objet → accusatif ـَ."},
      {q:"Complétez : كِتَابُ ___ (de l'enseignant)",opts:["المُعَلِّمُ","المُعَلِّمَ","المُعَلِّمِ","مُعَلِّمٌ"],ans:2,exp:"Dans l'إضافة, le second terme est au génitif ـِ : كِتَابُ المُعَلِّمِ."},
      {q:"Quelle phrase nominale est correcte ?",opts:["مُحَمَّدَ طَالِبَ","مُحَمَّدٌ طَالِبٌ","مُحَمَّدِ طَالِبِ","مُحَمَّدُ طَالِبَ"],ans:1,exp:"مبتدأ et خبر sont tous deux au nominatif : مُحَمَّدٌ + طَالِبٌ."},
    ]
  },
  {
    id:2, num:"٣", title:"التذكير والتأنيث", subtitle:"Masculin & Féminin",
    color:"#f07070", colorDim:"rgba(240,112,112,.1)", emoji:"🔤",
    description:"Les genres en arabe et le nombre dual (مثنى) pour parler de deux entités.",
    lessons:[
      {
        id:"3a", title:"Le Genre — الجنس", icon:"⚧",
        theory:"Le féminin se forme en ajoutant ة (tā' marbūṭa). Certains mots sont féminins naturellement (femmes, villes, pays, parties du corps par paires) sans ة.",
        tableHeaders:["Masculin","Féminin","Lecture","Sens"],
        tableRows:[
          ["طَالِبٌ","طَالِبَةٌ","ṭālib / ṭāliba","étudiant(e)"],
          ["مُعَلِّمٌ","مُعَلِّمَةٌ","muʿallim / muʿallima","enseignant(e)"],
          ["كَبِيرٌ","كَبِيرَةٌ","kabīr / kabīra","grand(e)"],
          ["مِصْرُ (fém.)","—","Miṣr","Égypte (naturel)"],
        ],
        examples:[
          {ar:"الطَّالِبَةُ مُجْتَهِدَةٌ",tr:"aṭ-ṭālibatu mujtahidatun",fr:"L'étudiante est diligente",tag:"ة"},
          {ar:"باريسُ مَدِينَةٌ جَمِيلَةٌ",tr:"Bārīsu madīnatun jamīlatun",fr:"Paris est une belle ville",tag:"Naturel"},
          {ar:"المُعَلِّمَةُ تَشْرَحُ",tr:"al-muʿallimatu tašraḥu",fr:"L'enseignante explique",tag:"ة"},
        ],
        pronounce:[
          {ar:"طَالِبَةٌ",tr:"ṭālibatun",hint:"ṭaa·li·ba·tun"},
          {ar:"مُعَلِّمَةٌ",tr:"muʿallimatun",hint:"mu·'al·li·ma·tun"},
          {ar:"جَدِيدَةٌ",tr:"jadīdatun",hint:"ja·dii·da·tun"},
        ],
        traceWords:[
          {ar:"طَالِبَةٌ",meaning:"étudiante"},
          {ar:"كَبِيرَةٌ",meaning:"grande"},
          {ar:"جَمِيلَةٌ",meaning:"belle"},
        ]
      },
      {
        id:"3b", title:"Le Duel — المثنى", icon:"2️⃣",
        theory:"L'arabe a un nombre spécifique pour deux : le duel. On ajoute ـَانِ (nominatif) ou ـَيْنِ (accusatif/génitif) au singulier.",
        tableHeaders:["Singulier","Duel nom. ـَانِ","Duel acc. ـَيْنِ","Sens"],
        tableRows:[
          ["كِتَابٌ","كِتَابَانِ","كِتَابَيْنِ","un→deux livres"],
          ["طَالِبٌ","طَالِبَانِ","طَالِبَيْنِ","un→deux étudiants"],
          ["طَالِبَةٌ","طَالِبَتَانِ","طَالِبَتَيْنِ","une→deux étudiantes"],
          ["بَيْتٌ","بَيْتَانِ","بَيْتَيْنِ","une→deux maisons"],
        ],
        examples:[
          {ar:"عِنْدِي كِتَابَانِ",tr:"ʿindī kitābāni",fr:"J'ai deux livres (sujet)",tag:"Duel nom."},
          {ar:"رَأَيْتُ طَالِبَيْنِ",tr:"raʾaytu ṭālibayni",fr:"J'ai vu deux étudiants",tag:"Duel acc."},
          {ar:"بَيْتَانِ كَبِيرَانِ",tr:"baytāni kabīrāni",fr:"Deux grandes maisons",tag:"Duel nom."},
        ],
        pronounce:[
          {ar:"كِتَابَانِ",tr:"kitābāni",hint:"ki·taa·baa·ni"},
          {ar:"طَالِبَيْنِ",tr:"ṭālibayni",hint:"ṭaa·li·bay·ni"},
          {ar:"بَيْتَانِ",tr:"baytāni",hint:"bay·taa·ni"},
        ],
        traceWords:[
          {ar:"كِتَابَانِ",meaning:"deux livres"},
          {ar:"بَيْتَيْنِ",meaning:"deux maisons"},
          {ar:"طَالِبَانِ",meaning:"deux étudiants"},
        ]
      }
    ],
    exercises:[
      {q:"Comment forme-t-on le féminin de مُدَرِّسٌ ?",opts:["مُدَرِّسُون","مُدَرِّسَةٌ","مَدْرَسَةٌ","مُدَرِّسَيْنِ"],ans:1,exp:"On ajoute ة : مُدَرِّس + ة = مُدَرِّسَةٌ (enseignante)."},
      {q:"كِتَابَانِ signifie :",opts:["Les livres","Un livre","Deux livres","Le livre"],ans:2,exp:"ـَانِ est la marque du duel au nominatif."},
      {q:"Duel accusatif de بَيْتٌ ?",opts:["بَيْتَانِ","بُيُوتٌ","بَيْتَيْنِ","بَيْتَةٌ"],ans:2,exp:"Au duel accusatif/génitif : ـَيْنِ → بَيْتَيْنِ."},
      {q:"Laquelle est féminine SANS ة ?",opts:["مَدِينَةٌ","بِنْتٌ seulement","فَرَنْسَا seulement","بِنْتٌ et فَرَنْسَا"],ans:3,exp:"بِنْتٌ (féminin naturel personne) et فَرَنْسَا (pays) sont féminins sans ة."},
      {q:"Accordez : البَيْتُ ___ (grand)",opts:["كَبِيرٌ","كَبِيرَةٌ","كَبِيرَانِ","كِبَارٌ"],ans:0,exp:"بَيْتٌ est masculin → adjectif masculin كَبِيرٌ."},
    ]
  },
  {
    id:3, num:"٤", title:"الجمع", subtitle:"Le Pluriel",
    color:"#e2b96a", colorDim:"rgba(226,185,106,.1)", emoji:"🔢",
    description:"Le pluriel sain (جمع سالم) et le pluriel brisé (جمع تكسير) qui restructure le mot.",
    lessons:[
      {
        id:"4a", title:"Pluriel Sain — جمع سالم", icon:"✅",
        theory:"Le pluriel sain conserve la racine. Masculin : ـُونَ (nom.) / ـِينَ (acc.). Féminin : ـَاتٌ. Il s'applique surtout aux êtres animés.",
        tableHeaders:["Singulier","Pl. masc. nom.","Pl. masc. acc.","Pl. féminin"],
        tableRows:[
          ["مُسْلِمٌ","مُسْلِمُونَ","مُسْلِمِينَ","مُسْلِمَاتٌ"],
          ["مُعَلِّمٌ","مُعَلِّمُونَ","مُعَلِّمِينَ","مُعَلِّمَاتٌ"],
          ["مُهَنْدِسٌ","مُهَنْدِسُونَ","مُهَنْدِسِينَ","مُهَنْدِسَاتٌ"],
        ],
        examples:[
          {ar:"المُسْلِمُونَ يُصَلُّونَ",tr:"al-muslimūna yuṣallūna",fr:"Les musulmans prient",tag:"Pl. masc."},
          {ar:"رَأَيْتُ مُعَلِّمِينَ",tr:"raʾaytu muʿallimīna",fr:"J'ai vu des enseignants",tag:"Acc."},
          {ar:"الطَّالِبَاتُ نَجَحْنَ",tr:"aṭ-ṭālibātu najaḥna",fr:"Les étudiantes ont réussi",tag:"Pl. fém."},
        ],
        pronounce:[
          {ar:"مُسْلِمُونَ",tr:"muslimūna",hint:"mus·li·muu·na"},
          {ar:"مُعَلِّمِينَ",tr:"muʿallimīna",hint:"mu·'al·li·mii·na"},
          {ar:"الطَّالِبَاتُ",tr:"aṭ-ṭālibātu",hint:"aṭ·ṭaa·li·baa·tu"},
        ],
        traceWords:[
          {ar:"مُسْلِمُونَ",meaning:"musulmans"},
          {ar:"مُعَلِّمَاتٌ",meaning:"enseignantes"},
          {ar:"طَالِبَاتٌ",meaning:"étudiantes"},
        ]
      },
      {
        id:"4b", title:"Pluriel Brisé — جمع تكسير", icon:"🧩",
        theory:"Le pluriel brisé modifie la structure interne du mot selon des schèmes (أوزان). Imprévisible — à apprendre mot par mot. C'est le pluriel le plus fréquent.",
        tableHeaders:["Singulier","Pluriel brisé","Schème","Sens"],
        tableRows:[
          ["كِتَابٌ","كُتُبٌ","فُعُل","livre→livres"],
          ["بَيْتٌ","بُيُوتٌ","فُعُول","maison→maisons"],
          ["رَجُلٌ","رِجَالٌ","فِعَال","homme→hommes"],
          ["وَلَدٌ","أَوْلَادٌ","أَفْعَال","garçon→garçons"],
          ["عَيْنٌ","أَعْيُنٌ","أَفْعُل","œil→yeux"],
        ],
        examples:[
          {ar:"الكُتُبُ عَلَى الطَّاوِلَةِ",tr:"al-kutubu ʿalā ṭ-ṭāwilati",fr:"Les livres sont sur la table",tag:"كُتُب"},
          {ar:"الرِّجَالُ يَعْمَلُونَ",tr:"ar-rijālu yaʿmalūna",fr:"Les hommes travaillent",tag:"رِجَال"},
          {ar:"بُيُوتُ المَدِينَةِ كَبِيرَةٌ",tr:"buyūtu l-madīnati kabīratun",fr:"Les maisons de la ville sont grandes",tag:"بُيُوت"},
        ],
        pronounce:[
          {ar:"كُتُبٌ",tr:"kutubun",hint:"ku·tu·bun"},
          {ar:"رِجَالٌ",tr:"rijālun",hint:"ri·jaa·lun"},
          {ar:"بُيُوتٌ",tr:"buyūtun",hint:"bu·yuu·tun"},
        ],
        traceWords:[
          {ar:"كُتُبٌ",meaning:"livres"},
          {ar:"رِجَالٌ",meaning:"hommes"},
          {ar:"أَوْلَادٌ",meaning:"enfants"},
        ]
      }
    ],
    exercises:[
      {q:"Le pluriel de كِتَابٌ est :",opts:["كِتَابَات","كُتُبٌ","كِتَابُونَ","كُتَّابٌ"],ans:1,exp:"كِتَابٌ → كُتُبٌ est un pluriel brisé sur فُعُل. À mémoriser !"},
      {q:"مُسْلِمُونَ est quel type de pluriel ?",opts:["Pluriel brisé","Pl. féminin sain","Pl. masculin sain","Duel"],ans:2,exp:"ـُونَ / ـِينَ = marques du pluriel masculin sain (جمع مذكر سالم)."},
      {q:"Traduisez : رَأَيْتُ مُعَلِّمِينَ كَثِيرِينَ",opts:["J'ai vu beaucoup d'enseignants","Les enseignants ont vu beaucoup","Beaucoup sont venus","J'enseigne à beaucoup"],ans:0,exp:"رَأَيْتُ = j'ai vu + مُعَلِّمِينَ (acc.) + كَثِيرِينَ = nombreux."},
      {q:"Pluriel brisé de وَلَدٌ (garçon) ?",opts:["وَلَدَاتٌ","وَالِدُونَ","أَوْلَادٌ","وِلْدَانٌ"],ans:2,exp:"وَلَدٌ → أَوْلَادٌ (schème أَفْعَال). Très fréquent dans le Coran."},
      {q:"Pl. féminin sain de مُهَنْدِسَةٌ (ingénieure) ?",opts:["مُهَنْدِسُونَ","مَهَانِدُ","مُهَنْدِسَاتٌ","مُهَنْدِسِينَ"],ans:2,exp:"On remplace ة par ات : مُهَنْدِسَة → مُهَنْدِسَاتٌ."},
    ]
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalize(s) {
  return (s||"").replace(/[\u064B-\u065F]/g,"").replace(/[أإآا]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").trim();
}
function scoreMatch(target, spoken) {
  const t = normalize(target), s = normalize(spoken);
  if (!s) return 0;
  if (t === s) return 100;
  const set1 = new Set(t.split(""));
  const set2 = new Set(s.split(""));
  let common = 0;
  set1.forEach(c => { if(set2.has(c)) common++; });
  const jaccard = common / (set1.size + set2.size - common);
  // also check substring
  const subScore = (t.includes(s) || s.includes(t)) ? 40 : 0;
  return Math.min(100, Math.round(jaccard * 100 + subScore));
}
function speak(text) {
  speakArabic(text);
}

// ─── Hook: Speech Recognition ────────────────────────────────────────────────
function useSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = !!SR;
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const start = useCallback(() => {
    if (!supported) { setError("Utilisez Chrome pour la reconnaissance vocale."); return; }
    setTranscript(""); setError("");
    const rec = new SR();
    rec.lang = "ar-SA"; rec.interimResults = false; rec.maxAlternatives = 5;
    rec.onstart = () => setListening(true);
    rec.onresult = e => {
      const best = Array.from(e.results[0]).map(r => r.transcript);
      setTranscript(best[0] || "");
    };
    rec.onerror = e => { setError(e.error === "not-allowed" ? "Microphone non autorisé." : "Erreur : " + e.error); setListening(false); };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
  }, [supported]);

  const stop = useCallback(() => { recRef.current?.stop(); setListening(false); }, []);
  const reset = useCallback(() => { setTranscript(""); setError(""); }, []);

  return { supported, listening, transcript, error, start, stop, reset };
}

// ─── PronunciationLab ─────────────────────────────────────────────────────────
function PronunciationLab({ items, color }) {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState("listen"); // listen | record | result
  const [score, setScore] = useState(null);
  const speech = useSpeech();
  const item = items[current];

  useEffect(() => { setPhase("listen"); setScore(null); speech.reset(); }, [current]);

  useEffect(() => {
    if (speech.transcript && !speech.listening) {
      const s = scoreMatch(item.ar, speech.transcript);
      setScore(s); setPhase("result");
    }
  }, [speech.transcript, speech.listening]);

  const handleListen = () => { speak(item.ar); setPhase("record"); };
  const handleRecord = () => { if (speech.listening) { speech.stop(); } else { speech.start(); } };
  const handleNext = () => {
    if (current < items.length - 1) { setCurrent(c => c + 1); }
    else { setCurrent(0); }
    setPhase("listen"); setScore(null); speech.reset();
  };
  const handleRetry = () => { setPhase("record"); setScore(null); speech.reset(); };

  const getScoreData = (s) => {
    if (s >= 80) return { label: "Excellent !", emoji: "🏆", color: "#5dd68c" };
    if (s >= 55) return { label: "Bien !", emoji: "⭐", color: "#e2b96a" };
    if (s >= 30) return { label: "Continuez", emoji: "💪", color: "#9b7ff4" };
    return { label: "Réessayez", emoji: "🔄", color: "#f07070" };
  };

  return (
    <div style={{ padding: "28px 24px" }}>
      {/* Progress dots */}
      <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:28 }}>
        {items.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i===current ? 20 : 8, height:8, borderRadius:4,
            background: i===current ? color : i<current ? color+"60" : "var(--surface2)",
            border:"none", cursor:"pointer", transition:"all .3s"
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{
        background:"var(--surface)", borderRadius:"var(--r3)", padding:"32px",
        border:`1px solid ${color}30`, textAlign:"center",
        boxShadow:`0 0 40px ${color}10`
      }}>
        {/* Arabic word — huge */}
        <div className="arabic" style={{ fontSize:52, fontWeight:700, color:"var(--text)", letterSpacing:4, marginBottom:8 }}>
          {item.ar}
        </div>
        <div className="mono" style={{ fontSize:13, color: color, marginBottom:4 }}>{item.tr}</div>
        <div style={{ fontSize:12, color:"var(--text3)", marginBottom:28 }}>
          Syllabes : <span style={{ color:"var(--text2)", letterSpacing:2 }}>{item.hint}</span>
        </div>

        {/* Phase: listen */}
        {phase === "listen" && (
          <div className="fade-in">
            <p style={{ fontSize:13, color:"var(--text2)", marginBottom:20 }}>
              Étape 1 — Écoutez la prononciation native, puis répétez
            </p>
            <button onClick={handleListen} style={{
              width:80, height:80, borderRadius:"50%", border:`2px solid ${color}`,
              background:`${color}15`, color:color, fontSize:32, cursor:"pointer",
              display:"inline-flex", alignItems:"center", justifyContent:"center",
              transition:"all .2s", boxShadow:`0 0 0 0 ${color}40`
            }}
            onMouseEnter={e => e.target.style.boxShadow=`0 0 20px 6px ${color}30`}
            onMouseLeave={e => e.target.style.boxShadow="none"}
            >🔊</button>
          </div>
        )}

        {/* Phase: record */}
        {phase === "record" && (
          <div className="fade-in">
            <p style={{ fontSize:13, color:"var(--text2)", marginBottom:20 }}>
              Étape 2 — Prononcez le mot à haute voix
            </p>
            {speech.error && (
              <div style={{ fontSize:12, color:"var(--rose)", marginBottom:12, padding:"8px 14px", background:"var(--rose-dim)", borderRadius:"var(--r)" }}>
                {speech.error}
              </div>
            )}
            <button onClick={handleRecord} style={{
              width:80, height:80, borderRadius:"50%", border:`2px solid ${speech.listening ? "var(--rose)" : color}`,
              background: speech.listening ? "var(--rose-dim)" : `${color}15`,
              color: speech.listening ? "var(--rose)" : color,
              fontSize:32, cursor:"pointer",
              display:"inline-flex", alignItems:"center", justifyContent:"center",
              animation: speech.listening ? "recordPulse 1s infinite" : "none",
              transition:"all .2s"
            }}>🎤</button>
            {speech.listening && (
              <div style={{ display:"flex", gap:4, justifyContent:"center", marginTop:16, alignItems:"flex-end", height:24 }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    width:4, borderRadius:2, background:color,
                    animation:`waveBar .5s ease-in-out infinite`,
                    animationDelay:`${i*.07}s`, height:4
                  }} />
                ))}
              </div>
            )}
            <p style={{ fontSize:11, color:"var(--text3)", marginTop:12 }}>
              {speech.listening ? "Parlez maintenant... (cliquez pour arrêter)" : "Cliquez pour parler"}
            </p>
            {!speech.supported && (
              <p style={{ fontSize:11, color:"var(--text3)", marginTop:8 }}>⚠️ Ouvrez dans Chrome pour activer le micro</p>
            )}
          </div>
        )}

        {/* Phase: result */}
        {phase === "result" && score !== null && (
          <div className="fade-in" style={{ animation:"scoreIn .4s cubic-bezier(.34,1.56,.64,1) both" }}>
            {(() => {
              const sd = getScoreData(score);
              return (
                <>
                  <div style={{ fontSize:56, marginBottom:8 }}>{sd.emoji}</div>
                  <div style={{ fontSize:48, fontWeight:700, color:sd.color, marginBottom:4, fontFamily:"'Space Grotesk',sans-serif" }}>{score}%</div>
                  <div style={{ fontSize:16, fontWeight:600, color:sd.color, marginBottom:12 }}>{sd.label}</div>
                  {speech.transcript && (
                    <div style={{ fontSize:13, color:"var(--text3)", marginBottom:20 }}>
                      Vous avez dit : <span className="arabic" style={{ fontSize:18, color:"var(--text2)" }}>«{speech.transcript}»</span>
                    </div>
                  )}
                  <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                    <button onClick={handleRetry} style={{
                      padding:"10px 20px", borderRadius:"var(--r)", border:`1.5px solid ${color}40`,
                      background:"transparent", color:color, cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:500
                    }}>↺ Réessayer</button>
                    <button onClick={handleNext} style={{
                      padding:"10px 22px", borderRadius:"var(--r)", border:"none",
                      background:color, color:"#0c0e14", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600
                    }}>{current < items.length-1 ? "Suivant →" : "Recommencer ↺"}</button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TraceLab (Canvas Drawing) ────────────────────────────────────────────────
function TraceLab({ words, color }) {
  const [idx, setIdx] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [rating, setRating] = useState(null);
  const canvasRef = useRef(null);
  const lastPos = useRef(null);
  const word = words[idx];

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Grid dots
    ctx.fillStyle = "rgba(255,255,255,.06)";
    for (let x = 20; x < canvas.width; x += 30) {
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
      }
    }
    // Baseline
    const cy = canvas.height * 0.58;
    ctx.strokeStyle = `${color}30`;
    ctx.lineWidth = 1; ctx.setLineDash([6,6]);
    ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(canvas.width-20, cy); ctx.stroke();
    ctx.setLineDash([]);
    setHasDrawn(false); setRating(null);
  }, [idx]);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
    setDrawing(true); setHasDrawn(true); setRating(null);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // redraw dots + baseline
    ctx.fillStyle = "rgba(255,255,255,.06)";
    for (let x = 20; x < canvas.width; x += 30) {
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
      }
    }
    const cy = canvas.height * 0.58;
    ctx.strokeStyle = `${color}30`; ctx.lineWidth = 1; ctx.setLineDash([6,6]);
    ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(canvas.width-20, cy); ctx.stroke();
    ctx.setLineDash([]);
    setHasDrawn(false); setRating(null);
  };

  const submitTrace = () => {
    // Simulate scoring based on coverage (pixels drawn)
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let pixels = 0;
    for (let i = 3; i < data.length; i += 4) { if (data[i] > 50) pixels++; }
    const coverage = pixels / (canvas.width * canvas.height);
    if (coverage < 0.005) { setRating("empty"); return; }
    if (coverage > 0.04) { setRating("great"); }
    else if (coverage > 0.015) { setRating("good"); }
    else { setRating("light"); }
  };

  const ratings = {
    great: { label:"Belle calligraphie ! 🎨", color:"#5dd68c", tip:"Continuez ainsi, votre tracé est bien couvert." },
    good:  { label:"Bon tracé !", color:"#e2b96a", tip:"Essayez de soigner les connexions entre les lettres." },
    light: { label:"Tracé léger", color:"#9b7ff4", tip:"Appuyez un peu plus et couvrez tout le mot." },
    empty: { label:"Dessin trop court", color:"var(--rose)", tip:"Tracez le mot complet avant de valider." },
  };

  return (
    <div style={{ padding:"24px" }}>
      {/* Word selector */}
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24 }}>
        {words.map((w,i) => (
          <button key={i} onClick={() => { setIdx(i); setRating(null); setHasDrawn(false); }} style={{
            padding:"8px 16px", borderRadius:"var(--r)", border:`1.5px solid ${i===idx ? color : "var(--border2)"}`,
            background: i===idx ? `${color}18` : "transparent",
            color: i===idx ? color : "var(--text2)",
            cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:500, transition:"all .2s"
          }}>
            <span className="arabic" style={{ fontSize:16 }}>{w.ar}</span>
            <span style={{ display:"block", fontSize:10, color:"var(--text3)", marginTop:2 }}>{w.meaning}</span>
          </button>
        ))}
      </div>

      {/* Reference */}
      <div style={{ textAlign:"center", marginBottom:16 }}>
        <p style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Modèle à reproduire</p>
        <div className="arabic" style={{ fontSize:56, fontWeight:700, color:`${color}70`, letterSpacing:6, userSelect:"none" }}>{word.ar}</div>
        <p style={{ fontSize:11, color:"var(--text3)", marginTop:4 }}>Tracez ce mot ci-dessous</p>
      </div>

      {/* Canvas */}
      <div style={{ position:"relative", borderRadius:"var(--r2)", overflow:"hidden", border:`1.5px solid ${color}30`, background:"var(--bg2)", marginBottom:14, touchAction:"none" }}>
        <canvas
          ref={canvasRef} width={560} height={180}
          style={{ display:"block", width:"100%", cursor:"crosshair", touchAction:"none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        {!hasDrawn && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <span style={{ fontSize:13, color:"var(--text3)" }}>✏️ Tracez ici avec la souris ou le doigt</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        <button onClick={clearCanvas} style={{
          padding:"9px 18px", borderRadius:"var(--r)", border:"1.5px solid var(--border2)",
          background:"transparent", color:"var(--text2)", cursor:"pointer", fontSize:13, fontFamily:"inherit"
        }}>🗑️ Effacer</button>
        {hasDrawn && !rating && (
          <button onClick={submitTrace} style={{
            padding:"9px 20px", borderRadius:"var(--r)", border:"none",
            background:color, color:"#0c0e14", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600
          }}>✓ Valider mon tracé</button>
        )}
        {rating && ratings[rating] && (
          <div className="fade-in" style={{ display:"flex", alignItems:"center", gap:10, flex:1, padding:"10px 16px", borderRadius:"var(--r)", background:`${ratings[rating].color}12`, border:`1px solid ${ratings[rating].color}30` }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:ratings[rating].color }}>{ratings[rating].label}</div>
              <div style={{ fontSize:11, color:"var(--text3)" }}>{ratings[rating].tip}</div>
            </div>
          </div>
        )}
        <button onClick={() => speak(word.ar)} style={{
          padding:"9px 18px", marginLeft:"auto", borderRadius:"var(--r)", border:`1.5px solid ${color}40`,
          background:"transparent", color:color, cursor:"pointer", fontSize:13, fontFamily:"inherit"
        }}>🔊 Écouter</button>
      </div>
    </div>
  );
}

// ─── MatchGame ────────────────────────────────────────────────────────────────
function MatchGame({ examples, color }) {
  const pairs = examples.slice(0,4).map((ex,i) => ({ id:i, ar:ex.ar, fr:ex.fr }));
  const [leftSel, setLeftSel] = useState(null);
  const [rightSel, setRightSel] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [done, setDone] = useState(false);
  const shuffledRight = useRef([...pairs].sort(() => Math.random()-.5)).current;

  const tryMatch = useCallback((lid, rid) => {
    if (lid === rid) {
      const newMatched = [...matched, lid];
      setMatched(newMatched);
      setWrong(null);
      if (newMatched.length === pairs.length) setTimeout(() => setDone(true), 400);
    } else {
      setWrong({ left:lid, right:rid });
      setTimeout(() => { setWrong(null); setLeftSel(null); setRightSel(null); }, 700);
      return;
    }
    setLeftSel(null); setRightSel(null);
  }, [matched, pairs.length]);

  useEffect(() => {
    if (leftSel !== null && rightSel !== null) tryMatch(leftSel, rightSel);
  }, [leftSel, rightSel]);

  const reset = () => { setLeftSel(null); setRightSel(null); setMatched([]); setWrong(null); setDone(false); };

  if (done) return (
    <div style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ fontSize:56, marginBottom:12 }}>🎯</div>
      <div style={{ fontSize:22, fontWeight:700, color, marginBottom:8 }}>Parfait ! Tout associé !</div>
      <button onClick={reset} style={{ padding:"10px 24px", borderRadius:"var(--r)", border:"none", background:color, color:"#0c0e14", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600 }}>Rejouer</button>
    </div>
  );

  return (
    <div style={{ padding:"24px" }}>
      <p style={{ fontSize:12, color:"var(--text3)", textAlign:"center", marginBottom:20 }}>Associez chaque phrase arabe à sa traduction française</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {/* Left: Arabic */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {pairs.map(p => {
            const isMatched = matched.includes(p.id);
            const isSel = leftSel === p.id;
            const isWrong = wrong?.left === p.id;
            return (
              <button key={p.id} onClick={() => { if(!isMatched) setLeftSel(p.id); }}
                style={{
                  padding:"14px 16px", borderRadius:"var(--r)", border:`1.5px solid ${isMatched ? color : isSel ? color : isWrong ? "var(--rose)" : "var(--border2)"}`,
                  background: isMatched ? `${color}18` : isSel ? `${color}12` : isWrong ? "var(--rose-dim)" : "var(--surface)",
                  color: isMatched ? color : "var(--text)", cursor: isMatched ? "default" : "pointer",
                  textAlign:"right", fontFamily:"'Noto Naskh Arabic',serif", fontSize:16, direction:"rtl",
                  opacity: isMatched ? .7 : 1, transition:"all .2s",
                  animation: isWrong ? "shake .3s ease" : isMatched ? "correctBounce .3s ease" : "none",
                  lineHeight:1.8
                }}>
                {isMatched ? "✓ " : ""}{p.ar}
              </button>
            );
          })}
        </div>
        {/* Right: French */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {shuffledRight.map(p => {
            const isMatched = matched.includes(p.id);
            const isSel = rightSel === p.id;
            const isWrong = wrong?.right === p.id;
            return (
              <button key={p.id} onClick={() => { if(!isMatched) setRightSel(p.id); }}
                style={{
                  padding:"14px 16px", borderRadius:"var(--r)", border:`1.5px solid ${isMatched ? color : isSel ? color : isWrong ? "var(--rose)" : "var(--border2)"}`,
                  background: isMatched ? `${color}18` : isSel ? `${color}12` : isWrong ? "var(--rose-dim)" : "var(--surface)",
                  color: isMatched ? color : "var(--text)", cursor: isMatched ? "default" : "pointer",
                  textAlign:"left", fontFamily:"'Space Grotesk',sans-serif", fontSize:13,
                  opacity: isMatched ? .7 : 1, transition:"all .2s",
                  animation: isWrong ? "shake .3s ease" : isMatched ? "correctBounce .3s ease" : "none",
                }}>
                {isMatched ? "✓ " : ""}{p.fr}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── FlashCards ───────────────────────────────────────────────────────────────
function FlashCards({ tableRows, tableHeaders, color }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const row = tableRows[idx];

  return (
    <div style={{ padding:"24px", textAlign:"center" }}>
      <p style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:1, marginBottom:20 }}>
        Carte {idx+1} / {tableRows.length} — Cliquez pour révéler
      </p>
      {/* Card */}
      <div onClick={() => setFlipped(f => !f)} style={{
        background: flipped ? "var(--surface2)" : "var(--surface)",
        border:`1.5px solid ${color}30`, borderRadius:"var(--r3)",
        padding:"36px 28px", cursor:"pointer", minHeight:160,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        transition:"all .25s", boxShadow:`0 0 30px ${color}10`,
        marginBottom:20
      }}>
        {!flipped ? (
          <div className="arabic fade-in" style={{ fontSize:44, fontWeight:700, color:"var(--text)", letterSpacing:4 }}>
            {row[1]}
          </div>
        ) : (
          <div className="fade-in" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div className="arabic" style={{ fontSize:36, fontWeight:600, color }}>
              {row[1]}
            </div>
            <div className="mono" style={{ fontSize:14, color:"var(--text2)" }}>{row[2]}</div>
            <div style={{ fontSize:18, fontWeight:600, color:"var(--text)", marginTop:4 }}>{row[3]}</div>
            {row[0] && <div style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:`${color}15`, color, marginTop:4 }}>{row[0]}</div>}
          </div>
        )}
      </div>
      {/* Controls */}
      <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
        <button onClick={() => { setIdx(i => (i-1+tableRows.length)%tableRows.length); setFlipped(false); }}
          style={{ padding:"9px 18px", borderRadius:"var(--r)", border:"1.5px solid var(--border2)", background:"transparent", color:"var(--text2)", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>← Préc.</button>
        <button onClick={() => { speak(row[1]); }}
          style={{ padding:"9px 18px", borderRadius:"var(--r)", border:`1.5px solid ${color}40`, background:"transparent", color, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>🔊 Écouter</button>
        <button onClick={() => { setIdx(i => (i+1)%tableRows.length); setFlipped(false); }}
          style={{ padding:"9px 18px", borderRadius:"var(--r)", border:"1.5px solid var(--border2)", background:"transparent", color:"var(--text2)", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Suiv. →</button>
      </div>
    </div>
  );
}

// ─── ExercisePanel ─────────────────────────────────────────────────────────────
function ExercisePanel({ exercises, color }) {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const ex = exercises[step];

  const pick = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === ex.ans) setScore(s => s+1);
  };
  const next = () => {
    if (step+1 >= exercises.length) { setDone(true); return; }
    setStep(s => s+1); setSel(null);
  };
  const reset = () => { setStep(0); setSel(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score/exercises.length)*100);
    const emoji = pct===100?"🏆":pct>=60?"⭐":"💪";
    return (
      <div style={{ textAlign:"center", padding:"40px 20px" }}>
        <div style={{ fontSize:64, marginBottom:12 }}>{emoji}</div>
        <div style={{ fontSize:40, fontWeight:700, color, marginBottom:4 }}>{score}/{exercises.length}</div>
        <div style={{ fontSize:15, color:"var(--text2)", marginBottom:24 }}>
          {pct===100?"Module parfaitement maîtrisé !":pct>=60?"Bon résultat ! Revoyez les erreurs.":"Continuez à pratiquer !"}
        </div>
        <button onClick={reset} style={{ padding:"11px 28px", borderRadius:"var(--r)", border:"none", background:color, color:"#0c0e14", cursor:"pointer", fontSize:14, fontFamily:"inherit", fontWeight:600 }}>Recommencer</button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      {/* Progress */}
      <div style={{ display:"flex", gap:5, marginBottom:20 }}>
        {exercises.map((_,i) => (
          <div key={i} style={{ flex:1, height:4, borderRadius:4, background: i<step ? color : i===step ? color : "var(--surface2)", opacity: i===step ? 1 : i<step ? .6 : 1, transition:"all .3s" }} />
        ))}
      </div>
      {/* Question */}
      <div style={{ background:"var(--surface)", borderRadius:"var(--r2)", padding:"20px 22px", marginBottom:14, border:"1px solid var(--border)" }}>
        <div style={{ fontSize:11, color, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Q{step+1}</div>
        <p style={{ fontSize:16, fontWeight:500, color:"var(--text)", lineHeight:1.7 }}
          dangerouslySetInnerHTML={{ __html: ex.q.replace(/([^\s]*[\u0600-\u06FF][^\s]*)/g, `<span style="font-family:'Noto Naskh Arabic',serif;font-size:22px;color:var(--text)">$1</span>`) }} />
      </div>
      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
        {ex.opts.map((opt,i) => {
          let bg="var(--surface)", bc="var(--border2)", tc="var(--text)";
          if (sel!==null) {
            if (i===ex.ans) { bg="rgba(93,214,140,.1)"; bc="#5dd68c"; tc="#5dd68c"; }
            else if (i===sel) { bg="rgba(240,112,112,.08)"; bc="var(--rose)"; tc="var(--rose)"; }
          }
          return (
            <button key={i} onClick={() => pick(i)} disabled={sel!==null}
              style={{ background:bg, border:`1.5px solid ${bc}`, color:tc, borderRadius:"var(--r)", padding:"13px 18px", cursor:sel!==null?"default":"pointer", textAlign:"left", fontSize:14, fontFamily:"inherit", fontWeight:400, display:"flex", alignItems:"center", gap:10, transition:"all .2s" }}>
              <span style={{ width:24,height:24,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600, background: sel!==null&&i===ex.ans?"#5dd68c":sel!==null&&i===sel?"var(--rose)":"var(--surface2)", color: sel!==null&&(i===ex.ans||i===sel)?"#0c0e14":tc }}>
                {sel!==null&&i===ex.ans?"✓":sel!==null&&i===sel?"✗":String.fromCharCode(65+i)}
              </span>
              <span style={opt.match(/[\u0600-\u06FF]/)?{fontFamily:"'Noto Naskh Arabic',serif",fontSize:18}:{}}>{opt}</span>
            </button>
          );
        })}
      </div>
      {sel!==null && (
        <>
          <div className="fade-in" style={{ padding:"12px 16px",borderRadius:"var(--r)",marginBottom:14,background:sel===ex.ans?"rgba(93,214,140,.08)":"rgba(226,185,106,.08)",border:`1px solid ${sel===ex.ans?"rgba(93,214,140,.25)":"rgba(226,185,106,.3)"}`,fontSize:13,color:"var(--text2)",lineHeight:1.7 }}>
            <span style={{ fontWeight:600,color:sel===ex.ans?"#5dd68c":"var(--gold)" }}>{sel===ex.ans?"✅ Correct ! ":"💡 "}</span>{ex.exp}
          </div>
          <button onClick={next} style={{ padding:"10px 22px",borderRadius:"var(--r)",border:"none",background:color,color:"#0c0e14",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600 }}>
            {step+1>=exercises.length?"Terminer →":"Suivante →"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── GrammarTable ─────────────────────────────────────────────────────────────
function GrammarTable({ headers, rows, color }) {
  return (
    <div style={{ overflowX:"auto", borderRadius:"var(--r2)", border:"1px solid var(--border)", marginBottom:20 }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:"var(--surface2)" }}>
            {headers.map((h,i) => (
              <th key={i} style={{ padding:"10px 14px", textAlign:"left", color:"var(--text3)", fontWeight:600, borderBottom:"1px solid var(--border2)", fontFamily:"'Space Grotesk',sans-serif", fontSize:11, letterSpacing:".5px", textTransform:"uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri) => (
            <tr key={ri} style={{ background: ri%2===0?"var(--surface)":"var(--bg3)" }}>
              {row.map((cell,ci) => {
                const isAr = cell.match(/[\u0600-\u06FF]/);
                return (
                  <td key={ci} style={{ padding:"11px 14px", borderBottom:"1px solid var(--border)", color:"var(--text2)", fontFamily:isAr?"'Noto Naskh Arabic',serif":"inherit", direction:isAr?"rtl":"ltr", fontSize:isAr?17:13 }}>
                    {isAr ? (
                      <span style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8 }}>
                        {cell}
                        <button onClick={() => speak(cell)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:11,opacity:.4,padding:2,color:"var(--text)" }}>🔊</button>
                      </span>
                    ) : cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── LessonView ───────────────────────────────────────────────────────────────
function LessonView({ lesson, color }) {
  const [tab, setTab] = useState("theory");
  const tabs = [
    { id:"theory", label:"📚 Théorie" },
    { id:"flash",  label:"🃏 Flashcards" },
    { id:"match",  label:"🎯 Association" },
    { id:"trace",  label:"✏️ Calligraphie" },
    { id:"voice",  label:"🎤 Prononciation" },
  ];
  return (
    <div style={{ background:"var(--surface)", border:`1px solid ${color}20`, borderRadius:"var(--r3)", marginBottom:20, overflow:"hidden" }}>
      {/* Lesson header */}
      <div style={{ padding:"20px 24px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:44,height:44,borderRadius:"var(--r2)",background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{lesson.icon}</div>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:17,fontWeight:600,color:"var(--text)",marginBottom:2 }}>{lesson.title}</h3>
          <p style={{ fontSize:12,color:"var(--text3)" }}>5 modes d'apprentissage interactifs</p>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display:"flex", gap:2, padding:"8px 12px", borderBottom:"1px solid var(--border)", overflowX:"auto", background:"var(--bg3)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:"7px 14px", borderRadius:"var(--r)", border:"none", cursor:"pointer",
            background: tab===t.id ? `${color}20` : "transparent",
            color: tab===t.id ? color : "var(--text3)",
            fontFamily:"inherit", fontSize:12, fontWeight:tab===t.id?600:400,
            borderBottom: tab===t.id ? `2px solid ${color}` : "2px solid transparent",
            whiteSpace:"nowrap", transition:"all .15s"
          }}>{t.label}</button>
        ))}
      </div>
      {/* Tab content */}
      {tab==="theory" && (
        <div className="fade-in" style={{ padding:"24px" }}>
          <p style={{ fontSize:14,color:"var(--text2)",lineHeight:1.85,marginBottom:22,padding:"14px 18px",background:`${color}0c`,borderRadius:"var(--r)",borderLeft:`3px solid ${color}` }}>{lesson.theory}</p>
          <GrammarTable headers={lesson.tableHeaders} rows={lesson.tableRows} color={color} />
          {/* Examples */}
          <div>
            {lesson.examples.map((ex,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:14,padding:"13px 16px",background:"var(--bg3)",borderRadius:"var(--r)",marginBottom:8,border:"1px solid var(--border)" }}>
                <button onClick={() => speak(ex.ar)} style={{ width:34,height:34,borderRadius:"50%",background:`${color}15`,border:`1.5px solid ${color}30`,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>🔊</button>
                <div style={{ flex:1 }}>
                  <div className="arabic" style={{ fontSize:20,fontWeight:600,color:"var(--text)" }}>{ex.ar}</div>
                  <div style={{ display:"flex",gap:10,alignItems:"center",marginTop:2 }}>
                    <span className="mono" style={{ fontSize:11,color:"var(--text3)",fontStyle:"italic" }}>{ex.tr}</span>
                    <span style={{ fontSize:12,color:"var(--text2)" }}>— {ex.fr}</span>
                  </div>
                </div>
                <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:`${color}15`,color,border:`1px solid ${color}25` }}>{ex.tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="flash"  && <FlashCards tableRows={lesson.tableRows} tableHeaders={lesson.tableHeaders} color={color} />}
      {tab==="match"  && <MatchGame examples={lesson.examples} color={color} />}
      {tab==="trace"  && <TraceLab words={lesson.traceWords} color={color} />}
      {tab==="voice"  && <PronunciationLab items={lesson.pronounce} color={color} />}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Grammaire() {
  const [modId, setModId] = useState(0);
  const [mainTab, setMainTab] = useState("cours");
  const [completed, setCompleted] = useState([]);
  const mod = MODULES.find(m => m.id === modId);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingTop:80 }}>
      <style>{GS}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ background:"var(--bg2)", borderBottom:"1px solid var(--border)", padding:"30px 32px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11,color:"var(--text3)",marginBottom:12,display:"flex",alignItems:"center",gap:6 }}>
            <span>Safoua Academy</span><span style={{ opacity:.4 }}>›</span>
            <span>Arabe</span><span style={{ opacity:.4 }}>›</span>
            <span style={{ color:"var(--text2)" }}>Grammaire Tome 1</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ width:60,height:60,borderRadius:"var(--r2)",background:"var(--gold-dim)",border:`2px solid var(--gold)30`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"serif",fontSize:30,color:"var(--gold)",flexShrink:0 }}>ن</div>
              <div>
                <h1 className="arabic" style={{ fontSize:26,fontWeight:700,color:"var(--text)" }}>قواعد اللغة العربية</h1>
                <p style={{ fontSize:13,color:"var(--text3)",marginTop:2 }}>Grammaire Arabe · Tome 1 de Médine · Dr. Amira</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {[{v:MODULES.length,l:"Modules"},{v:MODULES.reduce((s,m)=>s+m.exercises.length,0),l:"Exercices"},{v:"2.1k",l:"Étudiants"},{v:`${completed.length}/${MODULES.length}`,l:"Complétés"}].map(s => (
                <div key={s.l} style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"10px 18px",textAlign:"center" }}>
                  <div style={{ fontSize:20,fontWeight:700,color:"var(--gold)" }}>{s.v}</div>
                  <div style={{ fontSize:10,color:"var(--text3)",marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop:20,display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ flex:1,height:4,borderRadius:4,background:"var(--surface2)" }}>
              <div style={{ height:"100%",borderRadius:4,background:`linear-gradient(90deg,var(--gold),var(--teal))`,width:`${(completed.length/MODULES.length)*100}%`,transition:"width .5s" }} />
            </div>
            <span style={{ fontSize:11,color:"var(--text3)" }}>{Math.round((completed.length/MODULES.length)*100)}%</span>
          </div>
        </div>
      </div>

      {/* ── Layout ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"24px",display:"grid",gridTemplateColumns:"240px 1fr",gap:24 }}>
        {/* Sidebar */}
        <aside style={{ position:"sticky",top:100,height:"fit-content" }}>
          <div style={{ fontSize:10,fontWeight:700,letterSpacing:2,color:"var(--text3)",textTransform:"uppercase",marginBottom:12 }}>MODULES</div>
          {MODULES.map(m => {
            const active = modId===m.id;
            const done = completed.includes(m.id);
            return (
              <button key={m.id} onClick={() => { setModId(m.id); setMainTab("cours"); }} style={{
                display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 14px",
                borderRadius:"var(--r2)",border:`1.5px solid ${active ? m.color+"50":"transparent"}`,
                background: active ? `${m.color}0c` : "transparent",
                cursor:"pointer",marginBottom:4,textAlign:"left",transition:"all .2s"
              }}>
                <div style={{ width:36,height:36,borderRadius:"var(--r)",flexShrink:0,background:active?`${m.color}25`:"var(--surface)",border:`1.5px solid ${active?m.color+"60":"var(--border2)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Noto Naskh Arabic',serif",fontSize:16,color:active?m.color:"var(--text3)" }}>
                  {done?"✓":m.num}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:active?m.color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{m.subtitle}</div>
                  <div style={{ fontSize:10,color:"var(--text3)" }}>{m.lessons.length} leçons · {m.exercises.length} exercices</div>
                </div>
                {active && <div style={{ width:6,height:6,borderRadius:"50%",background:m.color,flexShrink:0 }} />}
              </button>
            );
          })}

          {/* Activity legend */}
          <div style={{ marginTop:20,padding:"14px 16px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)" }}>
            <div style={{ fontSize:10,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:1,marginBottom:10 }}>Activités</div>
            {[["📚","Théorie & tableaux"],["🃏","Flashcards"],["🎯","Jeu d'association"],["✏️","Calligraphie canvas"],["🎤","Test de prononciation"],["✏️","Quiz interactif"]].map(([icon,label]) => (
              <div key={label} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:7 }}>
                <span style={{ fontSize:13 }}>{icon}</span>
                <span style={{ fontSize:11,color:"var(--text3)" }}>{label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main>
          {/* Module header */}
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24,flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
                <span style={{ fontSize:26 }}>{mod.emoji}</span>
                <h2 style={{ fontSize:22,fontWeight:700,color:"var(--text)" }}>{mod.subtitle}</h2>
                <span className="arabic" style={{ fontSize:20,color:mod.color }}>{mod.title}</span>
              </div>
              <p style={{ fontSize:12,color:"var(--text3)",maxWidth:500 }}>{mod.description}</p>
            </div>
            <div style={{ display:"flex",gap:4,background:"var(--surface2)",borderRadius:"var(--r)",padding:4 }}>
              {[{id:"cours",label:"📖 Cours"},{id:"quiz",label:"✏️ Quiz"}].map(t => (
                <button key={t.id} onClick={() => setMainTab(t.id)} style={{
                  padding:"8px 18px",borderRadius:8,border:"none",cursor:"pointer",
                  background: mainTab===t.id ? `${mod.color}25` : "transparent",
                  color: mainTab===t.id ? mod.color : "var(--text3)",
                  fontFamily:"inherit",fontSize:13,fontWeight:mainTab===t.id?600:400,
                  transition:"all .2s"
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {mainTab==="cours" && (
            <div>
              {mod.lessons.map(lesson => <LessonView key={lesson.id} lesson={lesson} color={mod.color} />)}
              <div style={{ padding:"22px 28px",borderRadius:"var(--r3)",background:`${mod.color}0a`,border:`1.5px solid ${mod.color}20`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14 }}>
                <div>
                  <div style={{ fontSize:16,fontWeight:600,color:"var(--text)",marginBottom:4 }}>Prêt pour le quiz ?</div>
                  <p style={{ fontSize:12,color:"var(--text3)" }}>{mod.exercises.length} questions · Explications détaillées</p>
                </div>
                <button onClick={() => setMainTab("quiz")} style={{ padding:"10px 24px",borderRadius:"var(--r)",border:"none",background:mod.color,color:"#0c0e14",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600 }}>
                  Démarrer le quiz →
                </button>
              </div>
            </div>
          )}

          {mainTab==="quiz" && (
            <div style={{ background:"var(--surface)",border:`1px solid ${mod.color}20`,borderRadius:"var(--r3)",padding:"28px 32px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingBottom:18,borderBottom:"1px solid var(--border)" }}>
                <div style={{ width:44,height:44,borderRadius:"var(--r2)",background:`${mod.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>✏️</div>
                <div>
                  <div style={{ fontSize:16,fontWeight:600,color:"var(--text)" }}>Quiz — {mod.subtitle}</div>
                  <div style={{ fontSize:12,color:"var(--text3)" }}>{mod.exercises.length} questions · réponse expliquée à chaque fois</div>
                </div>
              </div>
              <ExercisePanel exercises={mod.exercises} color={mod.color} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}