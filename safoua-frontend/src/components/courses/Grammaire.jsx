import React, { useState, useRef, useEffect, useCallback } from "react";

// ════════════════════════════════════════════════════════════════════════════
// Stand-in TTS — replace this block with:  import { speakArabic } from "../../utils/arabicTTS";
// ════════════════════════════════════════════════════════════════════════════
function speakArabic(text) {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  } catch (e) { /* no-op */ }
}

// ─── Global Styles ────────────────────────────────────────────────────────────
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --paper:#f6efe0;
  --paper2:#eee3c9;
  --paper3:#e8dab8;
  --panel:#fbf6ea;
  --ink:#2c2417;
  --ink-soft:#6e5f47;
  --ink-faint:#a4926e;
  --line:rgba(44,36,23,.12);
  --line2:rgba(44,36,23,.2);
  --zellige:#1f6f63;
  --zellige2:#2f8c7d;
  --zellige-dim:rgba(31,111,99,.1);
  --terracotta:#c1622d;
  --terracotta-dim:rgba(193,98,45,.1);
  --gold:#a8782e;
  --gold2:#c99a3f;
  --gold-dim:rgba(168,120,46,.12);
  --rose:#a8493f;
  --rose-dim:rgba(168,73,63,.1);
  --green:#3f7d4a;
  --green-dim:rgba(63,125,74,.1);
  --r:9px;--r2:15px;--r3:20px;
}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--paper);color:var(--ink);line-height:1.6;min-height:100vh}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:var(--ink-faint);border-radius:4px}
.arabic{font-family:'Amiri',serif;direction:rtl;line-height:2}
.display{font-family:'Fraunces',Georgia,serif}
.mono{font-family:'Inter',sans-serif;letter-spacing:.02em}

@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes recordPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.75}}
@keyframes waveBar{0%,100%{height:4px}50%{height:16px}}
@keyframes scoreIn{from{transform:scale(.7) rotate(-6deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
@keyframes correctBounce{0%{transform:scale(1)}30%{transform:scale(1.06)}60%{transform:scale(.97)}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@keyframes starSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes starTwinkle{0%,100%{opacity:.5;transform:scale(.92)}50%{opacity:1;transform:scale(1.06)}}
@keyframes inkReveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.fade-up{animation:fadeUp .35s ease both}
.fade-in{animation:fadeIn .25s ease both}
`;

// ─── 8-point star SVG (signature motif) ───────────────────────────────────────
function Khatim({ size = 20, color = "var(--gold)", fill = "none", spin = false, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0, animation: spin ? "starSpin 16s linear infinite" : "none", ...style }}>
      <g transform="translate(20,20)">
        {[0, 45].map((rot, gi) => (
          <polygon key={gi}
            points="0,-17 4,-4 17,0 4,4 0,17 -4,4 -17,0 -4,-4"
            transform={`rotate(${rot})`}
            fill={gi === 0 ? (fill === "none" ? "none" : fill) : "none"}
            stroke={color} strokeWidth="1.3" strokeLinejoin="round"
            opacity={gi === 0 ? 1 : 0.55}
          />
        ))}
      </g>
    </svg>
  );
}

function StarDivider({ color = "var(--gold)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "26px 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color}50)` }} />
      <Khatim size={16} color={color} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}50, transparent)` }} />
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const MODULES = [
  {
    id:0, num:"١", title:"الاسم والفعل", subtitle:"Nom & Verbe",
    color:"#1f6f63", colorDim:"rgba(31,111,99,.1)", emoji:"📖",
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
    color:"#a8782e", colorDim:"rgba(168,120,46,.1)", emoji:"⚖️",
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
    color:"#a8493f", colorDim:"rgba(168,73,63,.1)", emoji:"🔤",
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
    color:"#c1622d", colorDim:"rgba(193,98,45,.1)", emoji:"🔢",
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
  const subScore = (t.includes(s) || s.includes(t)) ? 40 : 0;
  return Math.min(100, Math.round(jaccard * 100 + subScore));
}
function speak(text) { speakArabic(text); }

// ─── Hook: Speech Recognition ────────────────────────────────────────────────
function useSpeech() {
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
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
  const [phase, setPhase] = useState("listen");
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
    if (s >= 80) return { label: "Excellent !", emoji: "🏆", color: "#3f7d4a" };
    if (s >= 55) return { label: "Bien !", emoji: "⭐", color: "#a8782e" };
    if (s >= 30) return { label: "Continuez", emoji: "💪", color: color };
    return { label: "Réessayez", emoji: "🔄", color: "#a8493f" };
  };

  return (
    <div style={{ padding: "30px 26px" }}>
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:30 }}>
        {items.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} aria-label={`Mot ${i+1}`} style={{
            width: i===current ? 22 : 9, height:9, borderRadius:5,
            background: i===current ? color : i<current ? color+"70" : "var(--paper3)",
            border:"none", cursor:"pointer", transition:"all .3s"
          }} />
        ))}
      </div>

      <div style={{
        background:"var(--panel)", borderRadius:"var(--r3)", padding:"36px 28px",
        border:`1.5px solid ${color}35`, textAlign:"center", position:"relative",
        boxShadow:`0 14px 36px -18px ${color}50, 0 1px 0 var(--line) inset`
      }}>
        <Khatim size={18} color={color} style={{ position:"absolute", top:18, left:18 }} />
        <Khatim size={18} color={color} style={{ position:"absolute", top:18, right:18 }} />

        <div className="arabic" style={{ fontSize:54, fontWeight:700, color:"var(--ink)", letterSpacing:2, marginBottom:10 }}>
          {item.ar}
        </div>
        <div className="display" style={{ fontSize:14, fontStyle:"italic", color: color, marginBottom:6 }}>{item.tr}</div>
        <div style={{ fontSize:12, color:"var(--ink-faint)", marginBottom:30 }}>
          Syllabes : <span style={{ color:"var(--ink-soft)", letterSpacing:2 }}>{item.hint}</span>
        </div>

        {phase === "listen" && (
          <div className="fade-in">
            <p style={{ fontSize:13, color:"var(--ink-soft)", marginBottom:22 }}>
              Étape 1 — Écoutez la prononciation, puis répétez
            </p>
            <button onClick={handleListen} aria-label="Écouter" style={{
              width:84, height:84, borderRadius:"50%", border:`2px solid ${color}`,
              background:`${color}14`, color:color, fontSize:30, cursor:"pointer",
              display:"inline-flex", alignItems:"center", justifyContent:"center",
              transition:"all .2s"
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow=`0 0 0 8px ${color}18`}
            onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
            >🔊</button>
          </div>
        )}

        {phase === "record" && (
          <div className="fade-in">
            <p style={{ fontSize:13, color:"var(--ink-soft)", marginBottom:22 }}>
              Étape 2 — Prononcez le mot à haute voix
            </p>
            {speech.error && (
              <div style={{ fontSize:12, color:"var(--rose)", marginBottom:14, padding:"9px 14px", background:"var(--rose-dim)", borderRadius:"var(--r)" }}>
                {speech.error}
              </div>
            )}
            <div style={{ position:"relative", width:84, height:84, margin:"0 auto" }}>
              <svg width="84" height="84" viewBox="0 0 84 84" style={{ position:"absolute", top:0, left:0 }}>
                <g transform="translate(42,42)">
                  {[0, 45].map((rot, gi) => (
                    <polygon key={gi}
                      points="0,-37 9,-9 37,0 9,9 0,37 -9,9 -37,0 -9,-9"
                      transform={`rotate(${rot})`}
                      fill={speech.listening ? "var(--rose-dim)" : `${color}14`}
                      stroke={speech.listening ? "var(--rose)" : color} strokeWidth="2"
                      opacity={gi === 0 ? 1 : .5}
                    />
                  ))}
                </g>
              </svg>
              <button onClick={handleRecord} aria-label="Enregistrer" style={{
                position:"absolute", inset:0, borderRadius:"50%", border:"none", background:"transparent",
                color: speech.listening ? "var(--rose)" : color, fontSize:28, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                animation: speech.listening ? "recordPulse 1s infinite" : "none",
              }}>🎤</button>
            </div>
            {speech.listening && (
              <div style={{ display:"flex", gap:4, justifyContent:"center", marginTop:18, alignItems:"flex-end", height:20 }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    width:4, borderRadius:2, background:color,
                    animation:`waveBar .5s ease-in-out infinite`,
                    animationDelay:`${i*.07}s`, height:4
                  }} />
                ))}
              </div>
            )}
            <p style={{ fontSize:11, color:"var(--ink-faint)", marginTop:14 }}>
              {speech.listening ? "Parlez maintenant… (cliquez pour arrêter)" : "Cliquez pour parler"}
            </p>
            {!speech.supported && (
              <p style={{ fontSize:11, color:"var(--ink-faint)", marginTop:8 }}>⚠️ Ouvrez dans Chrome pour activer le micro</p>
            )}
          </div>
        )}

        {phase === "result" && score !== null && (
          <div className="fade-in" style={{ animation:"scoreIn .45s cubic-bezier(.34,1.56,.64,1) both" }}>
            {(() => {
              const sd = getScoreData(score);
              return (
                <>
                  <div style={{ fontSize:54, marginBottom:8 }}>{sd.emoji}</div>
                  <div className="display" style={{ fontSize:46, fontWeight:600, color:sd.color, marginBottom:4 }}>{score}%</div>
                  <div style={{ fontSize:16, fontWeight:600, color:sd.color, marginBottom:14 }}>{sd.label}</div>
                  {speech.transcript && (
                    <div style={{ fontSize:13, color:"var(--ink-faint)", marginBottom:22 }}>
                      Vous avez dit : <span className="arabic" style={{ fontSize:18, color:"var(--ink-soft)" }}>«{speech.transcript}»</span>
                    </div>
                  )}
                  <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                    <button onClick={handleRetry} style={{
                      padding:"11px 20px", borderRadius:"var(--r)", border:`1.5px solid ${color}45`,
                      background:"transparent", color:color, cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:500
                    }}>↺ Réessayer</button>
                    <button onClick={handleNext} style={{
                      padding:"11px 24px", borderRadius:"var(--r)", border:"none",
                      background:color, color:"var(--panel)", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600
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

// ─── TraceLab ─────────────────────────────────────────────────────────────────
function TraceLab({ words, color }) {
  const [idx, setIdx] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [rating, setRating] = useState(null);
  const canvasRef = useRef(null);
  const lastPos = useRef(null);
  const word = words[idx];

  const paintBase = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(44,36,23,.07)";
    for (let x = 22; x < canvas.width; x += 28) {
      for (let y = 22; y < canvas.height; y += 28) {
        ctx.beginPath(); ctx.arc(x, y, 1.3, 0, Math.PI*2); ctx.fill();
      }
    }
    const cy = canvas.height * 0.58;
    ctx.strokeStyle = `${color}35`;
    ctx.lineWidth = 1; ctx.setLineDash([5,7]);
    ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(canvas.width-20, cy); ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintBase(canvas.getContext("2d"), canvas);
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
    paintBase(canvas.getContext("2d"), canvas);
    setHasDrawn(false); setRating(null);
  };

  const submitTrace = () => {
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
    great: { label:"Belle calligraphie ! 🎨", color:"#3f7d4a", tip:"Continuez ainsi, votre tracé est bien couvert." },
    good:  { label:"Bon tracé !", color:"#a8782e", tip:"Essayez de soigner les connexions entre les lettres." },
    light: { label:"Tracé léger", color:"#8a6fae", tip:"Appuyez un peu plus et couvrez tout le mot." },
    empty: { label:"Dessin trop court", color:"#a8493f", tip:"Tracez le mot complet avant de valider." },
  };

  return (
    <div style={{ padding:"26px" }}>
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24, flexWrap:"wrap" }}>
        {words.map((w,i) => (
          <button key={i} onClick={() => { setIdx(i); setRating(null); setHasDrawn(false); }} style={{
            padding:"9px 16px", borderRadius:"var(--r)", border:`1.5px solid ${i===idx ? color : "var(--line2)"}`,
            background: i===idx ? `${color}14` : "var(--panel)",
            color: i===idx ? color : "var(--ink-soft)",
            cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:500, transition:"all .2s"
          }}>
            <span className="arabic" style={{ fontSize:16 }}>{w.ar}</span>
            <span style={{ display:"block", fontSize:10, color:"var(--ink-faint)", marginTop:3 }}>{w.meaning}</span>
          </button>
        ))}
      </div>

      <div style={{ textAlign:"center", marginBottom:18 }}>
        <p style={{ fontSize:11, color:"var(--ink-faint)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>Modèle à reproduire</p>
        <div className="arabic" style={{ fontSize:58, fontWeight:700, color:`${color}80`, letterSpacing:4, userSelect:"none" }}>{word.ar}</div>
        <p style={{ fontSize:11, color:"var(--ink-faint)", marginTop:6 }}>Tracez ce mot ci-dessous</p>
      </div>

      <div style={{ position:"relative", borderRadius:"var(--r2)", overflow:"hidden", border:`1.5px solid ${color}35`, background:"var(--panel)", marginBottom:16, touchAction:"none" }}>
        <canvas
          ref={canvasRef} width={560} height={180}
          style={{ display:"block", width:"100%", cursor:"crosshair", touchAction:"none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        {!hasDrawn && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <span style={{ fontSize:13, color:"var(--ink-faint)" }}>✏️ Tracez ici avec la souris ou le doigt</span>
          </div>
        )}
      </div>

      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        <button onClick={clearCanvas} style={{
          padding:"10px 18px", borderRadius:"var(--r)", border:"1.5px solid var(--line2)",
          background:"var(--panel)", color:"var(--ink-soft)", cursor:"pointer", fontSize:13, fontFamily:"inherit"
        }}>🗑️ Effacer</button>
        {hasDrawn && !rating && (
          <button onClick={submitTrace} style={{
            padding:"10px 20px", borderRadius:"var(--r)", border:"none",
            background:color, color:"var(--panel)", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600
          }}>✓ Valider mon tracé</button>
        )}
        {rating && ratings[rating] && (
          <div className="fade-in" style={{ display:"flex", alignItems:"center", gap:10, flex:1, padding:"11px 16px", borderRadius:"var(--r)", background:`${ratings[rating].color}12`, border:`1px solid ${ratings[rating].color}35` }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:ratings[rating].color }}>{ratings[rating].label}</div>
              <div style={{ fontSize:11, color:"var(--ink-faint)" }}>{ratings[rating].tip}</div>
            </div>
          </div>
        )}
        <button onClick={() => speak(word.ar)} style={{
          padding:"10px 18px", marginLeft:"auto", borderRadius:"var(--r)", border:`1.5px solid ${color}45`,
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
    <div style={{ textAlign:"center", padding:"44px 20px" }}>
      <Khatim size={48} color={color} fill={`${color}18`} />
      <div className="display" style={{ fontSize:22, fontWeight:600, color, margin:"16px 0 10px" }}>Parfait ! Tout associé</div>
      <button onClick={reset} style={{ padding:"11px 26px", borderRadius:"var(--r)", border:"none", background:color, color:"var(--panel)", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600 }}>Rejouer</button>
    </div>
  );

  return (
    <div style={{ padding:"26px" }}>
      <p style={{ fontSize:12, color:"var(--ink-faint)", textAlign:"center", marginBottom:22 }}>Associez chaque phrase arabe à sa traduction française</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {pairs.map(p => {
            const isMatched = matched.includes(p.id);
            const isSel = leftSel === p.id;
            const isWrong = wrong?.left === p.id;
            return (
              <button key={p.id} onClick={() => { if(!isMatched) setLeftSel(p.id); }}
                style={{
                  padding:"15px 16px", borderRadius:"var(--r)", border:`1.5px solid ${isMatched ? color : isSel ? color : isWrong ? "var(--rose)" : "var(--line2)"}`,
                  background: isMatched ? `${color}14` : isSel ? `${color}0c` : isWrong ? "var(--rose-dim)" : "var(--panel)",
                  color: isMatched ? color : "var(--ink)", cursor: isMatched ? "default" : "pointer",
                  textAlign:"right", fontFamily:"'Amiri',serif", fontSize:17, direction:"rtl",
                  opacity: isMatched ? .75 : 1, transition:"all .2s",
                  animation: isWrong ? "shake .3s ease" : isMatched ? "correctBounce .3s ease" : "none",
                  lineHeight:1.8
                }}>
                {isMatched ? "✓ " : ""}{p.ar}
              </button>
            );
          })}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {shuffledRight.map(p => {
            const isMatched = matched.includes(p.id);
            const isSel = rightSel === p.id;
            const isWrong = wrong?.right === p.id;
            return (
              <button key={p.id} onClick={() => { if(!isMatched) setRightSel(p.id); }}
                style={{
                  padding:"15px 16px", borderRadius:"var(--r)", border:`1.5px solid ${isMatched ? color : isSel ? color : isWrong ? "var(--rose)" : "var(--line2)"}`,
                  background: isMatched ? `${color}14` : isSel ? `${color}0c` : isWrong ? "var(--rose-dim)" : "var(--panel)",
                  color: isMatched ? color : "var(--ink)", cursor: isMatched ? "default" : "pointer",
                  textAlign:"left", fontFamily:"'Inter',sans-serif", fontSize:13,
                  opacity: isMatched ? .75 : 1, transition:"all .2s",
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
function FlashCards({ tableRows, color }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const row = tableRows[idx];

  return (
    <div style={{ padding:"26px", textAlign:"center" }}>
      <p style={{ fontSize:11, color:"var(--ink-faint)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:22 }}>
        Carte {idx+1} / {tableRows.length} — Cliquez pour révéler
      </p>
      <div onClick={() => setFlipped(f => !f)} style={{
        background: flipped ? "var(--paper2)" : "var(--panel)",
        border:`1.5px solid ${color}35`, borderRadius:"var(--r3)",
        padding:"38px 28px", cursor:"pointer", minHeight:170,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        transition:"all .25s", boxShadow:`0 14px 34px -20px ${color}45`,
        marginBottom:22, position:"relative"
      }}>
        <Khatim size={14} color={color} style={{ position:"absolute", top:14, right:14, opacity:.6 }} />
        {!flipped ? (
          <div className="arabic fade-in" style={{ fontSize:46, fontWeight:700, color:"var(--ink)", letterSpacing:3 }}>
            {row[1]}
          </div>
        ) : (
          <div className="fade-in" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:9 }}>
            <div className="arabic" style={{ fontSize:38, fontWeight:600, color }}>
              {row[1]}
            </div>
            <div className="display" style={{ fontSize:14, fontStyle:"italic", color:"var(--ink-soft)" }}>{row[2]}</div>
            <div style={{ fontSize:18, fontWeight:600, color:"var(--ink)", marginTop:4 }}>{row[3]}</div>
            {row[0] && <div style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:`${color}14`, color, marginTop:4 }}>{row[0]}</div>}
          </div>
        )}
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
        <button onClick={() => { setIdx(i => (i-1+tableRows.length)%tableRows.length); setFlipped(false); }}
          style={{ padding:"10px 18px", borderRadius:"var(--r)", border:"1.5px solid var(--line2)", background:"var(--panel)", color:"var(--ink-soft)", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>← Préc.</button>
        <button onClick={() => { speak(row[1]); }}
          style={{ padding:"10px 18px", borderRadius:"var(--r)", border:`1.5px solid ${color}45`, background:"transparent", color, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>🔊 Écouter</button>
        <button onClick={() => { setIdx(i => (i+1)%tableRows.length); setFlipped(false); }}
          style={{ padding:"10px 18px", borderRadius:"var(--r)", border:"1.5px solid var(--line2)", background:"var(--panel)", color:"var(--ink-soft)", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Suiv. →</button>
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
    return (
      <div style={{ textAlign:"center", padding:"44px 20px" }}>
        <Khatim size={56} color={color} fill={pct===100 ? `${color}22` : "none"} />
        <div className="display" style={{ fontSize:42, fontWeight:600, color, margin:"16px 0 6px" }}>{score}/{exercises.length}</div>
        <div style={{ fontSize:15, color:"var(--ink-soft)", marginBottom:26 }}>
          {pct===100?"Module parfaitement maîtrisé !":pct>=60?"Bon résultat ! Revoyez les erreurs.":"Continuez à pratiquer !"}
        </div>
        <button onClick={reset} style={{ padding:"12px 30px", borderRadius:"var(--r)", border:"none", background:color, color:"var(--panel)", cursor:"pointer", fontSize:14, fontFamily:"inherit", fontWeight:600 }}>Recommencer</button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ display:"flex", gap:5, marginBottom:22 }}>
        {exercises.map((_,i) => (
          <div key={i} style={{ flex:1, height:4, borderRadius:4, background: i<=step ? color : "var(--paper3)", opacity: i===step ? 1 : i<step ? .6 : 1, transition:"all .3s" }} />
        ))}
      </div>
      <div style={{ background:"var(--panel)", borderRadius:"var(--r2)", padding:"22px 22px", marginBottom:16, border:"1px solid var(--line)" }}>
        <div style={{ fontSize:11, color, fontWeight:600, textTransform:"uppercase", letterSpacing:1.5, marginBottom:9 }}>Question {step+1}</div>
        <p style={{ fontSize:16, fontWeight:500, color:"var(--ink)", lineHeight:1.7 }}
          dangerouslySetInnerHTML={{ __html: ex.q.replace(/([^\s]*[\u0600-\u06FF][^\s]*)/g, `<span style="font-family:'Amiri',serif;font-size:23px;color:var(--ink)">$1</span>`) }} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:16 }}>
        {ex.opts.map((opt,i) => {
          let bg="var(--panel)", bc="var(--line2)", tc="var(--ink)";
          if (sel!==null) {
            if (i===ex.ans) { bg="rgba(63,125,74,.1)"; bc="#3f7d4a"; tc="#3f7d4a"; }
            else if (i===sel) { bg="rgba(168,73,63,.08)"; bc="var(--rose)"; tc="var(--rose)"; }
          }
          return (
            <button key={i} onClick={() => pick(i)} disabled={sel!==null}
              style={{ background:bg, border:`1.5px solid ${bc}`, color:tc, borderRadius:"var(--r)", padding:"14px 18px", cursor:sel!==null?"default":"pointer", textAlign:"left", fontSize:14, fontFamily:"inherit", fontWeight:400, display:"flex", alignItems:"center", gap:12, transition:"all .2s" }}>
              <span style={{ width:25,height:25,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600, background: sel!==null&&i===ex.ans?"#3f7d4a":sel!==null&&i===sel?"var(--rose)":"var(--paper3)", color: sel!==null&&(i===ex.ans||i===sel)?"var(--panel)":tc }}>
                {sel!==null&&i===ex.ans?"✓":sel!==null&&i===sel?"✗":String.fromCharCode(65+i)}
              </span>
              <span style={opt.match(/[\u0600-\u06FF]/)?{fontFamily:"'Amiri',serif",fontSize:18}:{}}>{opt}</span>
            </button>
          );
        })}
      </div>
      {sel!==null && (
        <>
          <div className="fade-in" style={{ padding:"13px 16px",borderRadius:"var(--r)",marginBottom:16,background:sel===ex.ans?"rgba(63,125,74,.08)":"rgba(168,120,46,.08)",border:`1px solid ${sel===ex.ans?"rgba(63,125,74,.25)":"rgba(168,120,46,.3)"}`,fontSize:13,color:"var(--ink-soft)",lineHeight:1.7 }}>
            <span style={{ fontWeight:600,color:sel===ex.ans?"#3f7d4a":"var(--gold)" }}>{sel===ex.ans?"✅ Correct ! ":"💡 "}</span>{ex.exp}
          </div>
          <button onClick={next} style={{ padding:"11px 24px",borderRadius:"var(--r)",border:"none",background:color,color:"var(--panel)",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600 }}>
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
    <div style={{ overflowX:"auto", borderRadius:"var(--r2)", border:"1px solid var(--line)", marginBottom:22 }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:"var(--paper2)" }}>
            {headers.map((h,i) => (
              <th key={i} style={{ padding:"11px 14px", textAlign:"left", color:"var(--ink-soft)", fontWeight:600, borderBottom:"1px solid var(--line2)", fontFamily:"'Inter',sans-serif", fontSize:11, letterSpacing:".5px", textTransform:"uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri) => (
            <tr key={ri} style={{ background: ri%2===0?"var(--panel)":"var(--paper)" }}>
              {row.map((cell,ci) => {
                const isAr = cell.match(/[\u0600-\u06FF]/);
                return (
                  <td key={ci} style={{ padding:"12px 14px", borderBottom:"1px solid var(--line)", color:"var(--ink-soft)", fontFamily:isAr?"'Amiri',serif":"inherit", direction:isAr?"rtl":"ltr", fontSize:isAr?18:13 }}>
                    {isAr ? (
                      <span style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8 }}>
                        {cell}
                        <button onClick={() => speak(cell)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:11,opacity:.4,padding:2,color:"var(--ink)" }}>🔊</button>
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
    <div style={{ background:"var(--panel)", border:`1.5px solid ${color}25`, borderRadius:"var(--r3)", marginBottom:22, overflow:"hidden", boxShadow:"0 16px 40px -28px rgba(44,36,23,.35)" }}>
      <div style={{ padding:"22px 26px", borderBottom:"1px solid var(--line)", display:"flex", alignItems:"center", gap:16, background:"var(--paper2)" }}>
        <div style={{ width:46,height:46,borderRadius:"var(--r2)",background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${color}30` }}>{lesson.icon}</div>
        <div style={{ flex:1 }}>
          <h3 className="display" style={{ fontSize:18,fontWeight:600,color:"var(--ink)",marginBottom:2 }}>{lesson.title}</h3>
          <p style={{ fontSize:12,color:"var(--ink-faint)" }}>Cinq façons d'apprendre ce mot</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:2, padding:"10px 14px", borderBottom:"1px solid var(--line)", overflowX:"auto", background:"var(--paper)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:"8px 15px", borderRadius:"var(--r)", border:"none", cursor:"pointer",
            background: tab===t.id ? `${color}1c` : "transparent",
            color: tab===t.id ? color : "var(--ink-faint)",
            fontFamily:"inherit", fontSize:12, fontWeight:tab===t.id?600:400,
            whiteSpace:"nowrap", transition:"all .15s"
          }}>{t.label}</button>
        ))}
      </div>
      {tab==="theory" && (
        <div className="fade-in" style={{ padding:"26px" }}>
          <p style={{ fontSize:14,color:"var(--ink-soft)",lineHeight:1.85,marginBottom:24,padding:"16px 20px",background:`${color}0a`,borderRadius:"var(--r)",borderLeft:`3px solid ${color}` }}>{lesson.theory}</p>
          <GrammarTable headers={lesson.tableHeaders} rows={lesson.tableRows} color={color} />
          <StarDivider color={color} />
          <div>
            {lesson.examples.map((ex,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--paper)",borderRadius:"var(--r)",marginBottom:9,border:"1px solid var(--line)" }}>
                <button onClick={() => speak(ex.ar)} style={{ width:36,height:36,borderRadius:"50%",background:`${color}14`,border:`1.5px solid ${color}30`,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>🔊</button>
                <div style={{ flex:1 }}>
                  <div className="arabic" style={{ fontSize:21,fontWeight:600,color:"var(--ink)" }}>{ex.ar}</div>
                  <div style={{ display:"flex",gap:10,alignItems:"center",marginTop:3,flexWrap:"wrap" }}>
                    <span className="display" style={{ fontSize:12,color:"var(--ink-faint)",fontStyle:"italic" }}>{ex.tr}</span>
                    <span style={{ fontSize:12,color:"var(--ink-soft)" }}>— {ex.fr}</span>
                  </div>
                </div>
                <span style={{ padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:600,background:`${color}14`,color,border:`1px solid ${color}28` }}>{ex.tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="flash"  && <FlashCards tableRows={lesson.tableRows} color={color} />}
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
    <div style={{ minHeight:"100vh", background:"var(--paper)", paddingTop:0 }}>
      <style>{GS}</style>

      {/* ── Manuscript header band ───────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, var(--paper2), var(--paper))",
        borderBottom: "1px solid var(--line2)",
        padding: "34px 32px 26px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* corner ornaments */}
        <Khatim size={26} color="var(--gold)" style={{ position:"absolute", top:18, left:18, opacity:.5 }} />
        <Khatim size={26} color="var(--gold)" style={{ position:"absolute", top:18, right:18, opacity:.5 }} />

        <div style={{ maxWidth:1120, margin:"0 auto", position:"relative" }}>
          <div style={{ fontSize:11,color:"var(--ink-faint)",marginBottom:14,display:"flex",alignItems:"center",gap:7,letterSpacing:".3px" }}>
            <span>Safoua Academy</span><span style={{ opacity:.5 }}>·</span>
            <span>Arabe</span><span style={{ opacity:.5 }}>·</span>
            <span style={{ color:"var(--ink-soft)" }}>Grammaire — Tome 1</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <div style={{
                width:64,height:64,borderRadius:"var(--r3)",
                background:"radial-gradient(circle at 35% 30%, var(--gold-dim), var(--paper3))",
                border:"2px solid var(--gold)", display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"'Amiri',serif",fontSize:32,color:"var(--gold)",flexShrink:0,
                boxShadow:"0 8px 22px -10px rgba(168,120,46,.45)"
              }}>ن</div>
              <div>
                <h1 className="arabic" style={{ fontSize:30,fontWeight:700,color:"var(--ink)" }}>قواعد اللغة العربية</h1>
                <p className="display" style={{ fontSize:14,fontStyle:"italic",color:"var(--ink-soft)",marginTop:3 }}>Grammaire Arabe · Tome 1 de Médine · Dr. Amira</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {[{v:MODULES.length,l:"Modules"},{v:MODULES.reduce((s,m)=>s+m.exercises.length,0),l:"Exercices"},{v:"2.1k",l:"Étudiants"},{v:`${completed.length}/${MODULES.length}`,l:"Complétés"}].map(s => (
                <div key={s.l} style={{ background:"var(--panel)",border:"1px solid var(--line2)",borderRadius:"var(--r)",padding:"11px 18px",textAlign:"center" }}>
                  <div className="display" style={{ fontSize:20,fontWeight:600,color:"var(--gold)" }}>{s.v}</div>
                  <div style={{ fontSize:10,color:"var(--ink-faint)",marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Star-based progress */}
          <div style={{ marginTop:22, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ display:"flex", gap:8 }}>
              {MODULES.map(m => (
                <Khatim key={m.id} size={20} color={completed.includes(m.id) ? "var(--gold)" : "var(--ink-faint)"}
                  fill={completed.includes(m.id) ? "var(--gold)" : "none"} />
              ))}
            </div>
            <span style={{ fontSize:11,color:"var(--ink-faint)" }}>{completed.length} module{completed.length===1?"":"s"} maîtrisé{completed.length===1?"":"s"} sur {MODULES.length}</span>
          </div>
        </div>
      </div>

      {/* ── Bookmark-style module nav ────────────────────────────────────── */}
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"22px 24px 0" }}>
        <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
          {MODULES.map(m => {
            const active = modId===m.id;
            const done = completed.includes(m.id);
            return (
              <button key={m.id} onClick={() => { setModId(m.id); setMainTab("cours"); }} style={{
                display:"flex", alignItems:"center", gap:11, flexShrink:0,
                padding:"13px 18px 13px 14px",
                borderRadius:"14px 14px 0 0",
                border:`1.5px solid ${active ? m.color+"55":"var(--line2)"}`,
                borderBottom: active ? `1.5px solid ${m.color}` : "1.5px solid var(--line2)",
                background: active ? "var(--panel)" : "var(--paper2)",
                cursor:"pointer", transition:"all .2s",
                position:"relative", top: active ? 1 : 0,
                boxShadow: active ? `0 -6px 18px -10px ${m.color}40` : "none"
              }}>
                <div style={{ width:32,height:32,borderRadius:"50%",flexShrink:0,
                  background: done ? "var(--gold)" : active?`${m.color}22`:"var(--paper3)",
                  border:`1.5px solid ${active?m.color+"70":"var(--line2)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Amiri',serif",fontSize:14,
                  color: done ? "var(--panel)" : (active?m.color:"var(--ink-faint)") }}>
                  {done?"✓":m.num}
                </div>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:13,fontWeight:600,color:active?m.color:"var(--ink-soft)",whiteSpace:"nowrap" }}>{m.subtitle}</div>
                  <div style={{ fontSize:10,color:"var(--ink-faint)",whiteSpace:"nowrap" }}>{m.lessons.length} leçons</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Open page panel ──────────────────────────────────────────────── */}
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 24px 60px" }}>
        <div style={{
          background:"var(--panel)", borderRadius:"0 var(--r3) var(--r3) var(--r3)",
          border:"1px solid var(--line2)", borderTop:"none",
          padding:"32px 36px", boxShadow:"0 24px 60px -36px rgba(44,36,23,.4)",
          position:"relative"
        }}>
          {/* Module header */}
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:26,flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:11,marginBottom:6,flexWrap:"wrap" }}>
                <span style={{ fontSize:26 }}>{mod.emoji}</span>
                <h2 className="display" style={{ fontSize:23,fontWeight:600,color:"var(--ink)" }}>{mod.subtitle}</h2>
                <span className="arabic" style={{ fontSize:21,color:mod.color }}>{mod.title}</span>
              </div>
              <p style={{ fontSize:12.5,color:"var(--ink-faint)",maxWidth:520 }}>{mod.description}</p>
            </div>
            <div style={{ display:"flex",gap:4,background:"var(--paper2)",borderRadius:"var(--r)",padding:4,border:"1px solid var(--line)" }}>
              {[{id:"cours",label:"📖 Cours"},{id:"quiz",label:"✏️ Quiz"}].map(t => (
                <button key={t.id} onClick={() => setMainTab(t.id)} style={{
                  padding:"9px 19px",borderRadius:8,border:"none",cursor:"pointer",
                  background: mainTab===t.id ? "var(--panel)" : "transparent",
                  color: mainTab===t.id ? mod.color : "var(--ink-faint)",
                  fontFamily:"inherit",fontSize:13,fontWeight:mainTab===t.id?600:400,
                  boxShadow: mainTab===t.id ? "0 1px 4px rgba(44,36,23,.12)" : "none",
                  transition:"all .2s"
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          <StarDivider color={mod.color} />

          {mainTab==="cours" && (
            <div>
              {mod.lessons.map(lesson => <LessonView key={lesson.id} lesson={lesson} color={mod.color} />)}
              <div style={{
                padding:"24px 30px",borderRadius:"var(--r3)",
                background:`linear-gradient(135deg, ${mod.color}10, ${mod.color}04)`,
                border:`1.5px solid ${mod.color}28`,
                display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <Khatim size={32} color={mod.color} />
                  <div>
                    <div className="display" style={{ fontSize:17,fontWeight:600,color:"var(--ink)",marginBottom:3 }}>Prêt pour le quiz ?</div>
                    <p style={{ fontSize:12,color:"var(--ink-faint)" }}>{mod.exercises.length} questions · explications détaillées</p>
                  </div>
                </div>
                <button onClick={() => setMainTab("quiz")} style={{ padding:"12px 26px",borderRadius:"var(--r)",border:"none",background:mod.color,color:"var(--panel)",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap" }}>
                  Démarrer le quiz →
                </button>
              </div>
            </div>
          )}

          {mainTab==="quiz" && (
            <div style={{ background:"var(--paper)",border:`1px solid ${mod.color}25`,borderRadius:"var(--r3)",padding:"30px 34px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:26,paddingBottom:20,borderBottom:"1px solid var(--line)" }}>
                <div style={{ width:46,height:46,borderRadius:"var(--r2)",background:`${mod.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:`1px solid ${mod.color}30` }}>✏️</div>
                <div>
                  <div className="display" style={{ fontSize:17,fontWeight:600,color:"var(--ink)" }}>Quiz — {mod.subtitle}</div>
                  <div style={{ fontSize:12,color:"var(--ink-faint)" }}>{mod.exercises.length} questions · réponse expliquée à chaque fois</div>
                </div>
              </div>
              <ExercisePanel exercises={mod.exercises} color={mod.color} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}