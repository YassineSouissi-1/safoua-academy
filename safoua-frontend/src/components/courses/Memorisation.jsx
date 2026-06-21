/**
 * components/courses/Memorisation.jsx — Safoua Academy
 * Design: warm ivory palette · Cormorant Garamond + Mulish + Amiri
 * Mirrors the aesthetic of Académie Hifz.html
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { api } from "../../utils/auth";
import {
  BookOpen, Play, Pause, Eye, EyeOff, CheckCircle, XCircle,
  RotateCcw, Mic, MicOff, ChevronRight, ChevronLeft,
  X, AlertCircle, Calendar, Brain, Star, ExternalLink,
  SkipBack, SkipForward, Rewind, FastForward, BookMarked,
  Square, Square as CheckSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════
   PALETTE  — warm ivory · deep teal · terracotta
═══════════════════════════════════════════════════════════ */
const BG       = "#f3efe3";
const BG2      = "#ece8db";
const SURF     = "#faf8f2";
const SURF2    = "#f0ece0";
const SURF3    = "#e8e4d8";

const INK      = "#1e2822";
const INK2     = "#475449";
const INK3     = "#808c84";
const INK4     = "rgba(30,40,34,0.10)";

const GREEN    = "#3f7d5f";   /* primary */
const GREEN_D  = "#2d5c45";
const GREEN_L  = "#5da07e";
const GREEN_BG = "rgba(63,125,95,0.09)";
const GREEN_BR = "rgba(63,125,95,0.26)";

const GOLD     = "#a8843a";   /* accent */
const GOLD_L   = "#c8a45a";
const GOLD_BG  = "rgba(168,132,58,0.10)";
const GOLD_BR  = "rgba(168,132,58,0.28)";

const BLUE     = "#4f5b93";
const BLUE_BG  = "rgba(79,91,147,0.10)";
const BLUE_BR  = "rgba(79,91,147,0.24)";

const CLAY     = "#b0455a";
const CLAY_BG  = "rgba(176,69,90,0.10)";

const TERRA    = "#c0622a";   /* terracotta — chapter eyebrow */
const TERRA_BG = "rgba(192,98,42,0.09)";
const TERRA_BR = "rgba(192,98,42,0.28)";

const BR       = "rgba(40,60,50,0.13)";
const BR2      = "rgba(40,60,50,0.07)";

const SHADOW   = "0 1px 3px rgba(40,55,45,0.05), 0 8px 24px rgba(40,55,45,0.08)";
const SHADOW_S = "0 1px 2px rgba(40,55,45,0.05), 0 3px 10px rgba(40,55,45,0.05)";

/* ── shared style helpers ── */
const eyebrow = {
  fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em",
  textTransform: "uppercase", fontFamily: "'Mulish', sans-serif",
};

function softBtn(col, filled = false) {
  return {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 16px", borderRadius: 9,
    border: `1.5px solid ${filled ? col : BR}`,
    background: filled ? col : SURF,
    color: filled ? "#fff" : INK2,
    fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: 12,
    cursor: "pointer", transition: "all .15s",
  };
}
function tintBtn(col, bg, border) {
  return {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 8,
    border: `1px solid ${border}`, background: bg, color: col,
    fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: 11.5,
    cursor: "pointer", transition: "all .15s",
  };
}
function ctrlBtn(col = INK3) {
  return {
    width: 30, height: 30, borderRadius: 8,
    background: SURF2, border: `1px solid ${BR}`,
    color: col, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all .15s",
  };
}

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const API_BASE    = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COURSE_TITLE = "Mémorisation : Les 10 dernières Sourates";

async function saveProgress(lessonKey) {
  try { await api.post("/api/update-progress", { lessonTitle: lessonKey }); }
  catch (err) { console.error("Erreur de progression :", err); }
}

const reciters = [
  { id:"mishari",    name:"Mishari Al-Afasy",  short:"Afasy",   server:"https://server8.mp3quran.net/afs" },
  { id:"abdulbasit", name:"Abdul Basit",        short:"A.Basit", server:"https://server7.mp3quran.net/basit" },
  { id:"minshawi",   name:"Al-Minshawi",        short:"Minsh.",  server:"https://server13.mp3quran.net/minsh" },
  { id:"husary",     name:"Al-Husary",          short:"Husary",  server:"https://server13.mp3quran.net/husr" },
  { id:"ghamdi",     name:"Sa'd Al-Ghamidi",    short:"Ghamdi",  server:"https://server7.mp3quran.net/s_gmd" },
];

const BASMALA_STRIPPED = "بسم الله الرحمن الرحيم";
const NO_BASMALA = new Set([1, 9]);

const ALL_SURAHS = [
  {n:1,ar:"الفاتحة",en:"Al-Fatiha",meaning:"The Opening",verses:7,type:"Meccan",fr:"al-faa-ti-HA"},
  {n:2,ar:"البقرة",en:"Al-Baqarah",meaning:"The Cow",verses:286,type:"Medinan",fr:"al-ba-QA-ra"},
  {n:78,ar:"النبأ",en:"An-Naba",meaning:"The Tidings",verses:40,type:"Meccan",fr:"an-NA-ba"},
  {n:87,ar:"الأعلى",en:"Al-A'la",meaning:"The Most High",verses:19,type:"Meccan",fr:"al-a'-LAA"},
  {n:88,ar:"الغاشية",en:"Al-Ghashiyah",meaning:"The Overwhelming",verses:26,type:"Meccan",fr:"al-ghaa-chi-YA"},
  {n:89,ar:"الفجر",en:"Al-Fajr",meaning:"The Dawn",verses:30,type:"Meccan",fr:"al-FAJR"},
  {n:90,ar:"البلد",en:"Al-Balad",meaning:"The City",verses:20,type:"Meccan",fr:"al-BA-lad"},
  {n:91,ar:"الشمس",en:"Ash-Shams",meaning:"The Sun",verses:15,type:"Meccan",fr:"ach-CHAMS"},
  {n:92,ar:"الليل",en:"Al-Layl",meaning:"The Night",verses:21,type:"Meccan",fr:"al-LAYL"},
  {n:93,ar:"الضحى",en:"Ad-Duha",meaning:"The Morning Hours",verses:11,type:"Meccan",fr:"ad-dou-HAA"},
  {n:94,ar:"الشرح",en:"Ash-Sharh",meaning:"The Relief",verses:8,type:"Meccan",fr:"ach-CHARH"},
  {n:95,ar:"التين",en:"At-Tin",meaning:"The Fig",verses:8,type:"Meccan",fr:"at-TEEN"},
  {n:96,ar:"العلق",en:"Al-Alaq",meaning:"The Clot",verses:19,type:"Meccan",fr:"al-'a-LAQ"},
  {n:97,ar:"القدر",en:"Al-Qadr",meaning:"The Power",verses:5,type:"Meccan",fr:"al-QA-dr"},
  {n:98,ar:"البينة",en:"Al-Bayyinah",meaning:"The Clear Proof",verses:8,type:"Medinan",fr:"al-bay-yi-NA"},
  {n:99,ar:"الزلزلة",en:"Az-Zalzalah",meaning:"The Earthquake",verses:8,type:"Medinan",fr:"az-zal-ZA-la"},
  {n:100,ar:"العاديات",en:"Al-Adiyat",meaning:"The Courser",verses:11,type:"Meccan",fr:"al-'aa-di-YAAT"},
  {n:101,ar:"القارعة",en:"Al-Qari'ah",meaning:"The Calamity",verses:11,type:"Meccan",fr:"al-qaa-ri-'A"},
  {n:102,ar:"التكاثر",en:"At-Takathur",meaning:"The Rivalry",verses:8,type:"Meccan",fr:"at-ta-KA-thour"},
  {n:103,ar:"العصر",en:"Al-Asr",meaning:"The Declining Day",verses:3,type:"Meccan",fr:"al-'ASR"},
  {n:104,ar:"الهمزة",en:"Al-Humazah",meaning:"The Traducer",verses:9,type:"Meccan",fr:"al-hou-MA-za"},
  {n:105,ar:"الفيل",en:"Al-Fil",meaning:"The Elephant",verses:5,type:"Meccan",fr:"al-FEEL"},
  {n:106,ar:"قريش",en:"Quraysh",meaning:"Quraysh",verses:4,type:"Meccan",fr:"qou-RAYCHE"},
  {n:107,ar:"الماعون",en:"Al-Ma'un",meaning:"The Small Kindnesses",verses:7,type:"Meccan",fr:"al-maa-'OUN"},
  {n:108,ar:"الكوثر",en:"Al-Kawthar",meaning:"A River in Paradise",verses:3,type:"Meccan",fr:"al-KAW-thar"},
  {n:109,ar:"الكافرون",en:"Al-Kafirun",meaning:"The Disbelievers",verses:6,type:"Meccan",fr:"al-kaa-fi-ROUN"},
  {n:110,ar:"النصر",en:"An-Nasr",meaning:"The Divine Support",verses:3,type:"Medinan",fr:"an-NASR"},
  {n:111,ar:"المسد",en:"Al-Masad",meaning:"The Palm Fibre",verses:5,type:"Meccan",fr:"al-MA-sad"},
  {n:112,ar:"الإخلاص",en:"Al-Ikhlas",meaning:"The Sincerity",verses:4,type:"Meccan",fr:"al-ikh-LAAS"},
  {n:113,ar:"الفلق",en:"Al-Falaq",meaning:"The Daybreak",verses:5,type:"Meccan",fr:"al-FA-laq"},
  {n:114,ar:"الناس",en:"An-Nas",meaning:"The Mankind",verses:6,type:"Meccan",fr:"an-NAAS"},
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
function stripDiac(s) {
  return s.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g,"")
          .replace(/\u0640/g,"")
          .replace(/[\u0622\u0623\u0625\u0671\u0627\u0672\u0673\u0675]/g,"\u0627")
          .replace(/\u0629/g,"\u0647").replace(/\u0649/g,"\u064A").trim();
}
function normAr(s) { return stripDiac(s).replace(/\s+/g," ").trim(); }
function isAr(s)   { return /[\u0600-\u06FF]/.test(s); }
function isBasmala(txt) { return normAr(txt) === normAr(BASMALA_STRIPPED); }

function similarity(spoken, target) {
  const a = normAr(spoken), b = normAr(target);
  if (!a || !b) return 0;
  const wa = a.split(" ").filter(Boolean), wb = b.split(" ").filter(Boolean);
  if (!wa.length) return 0;
  const wbCopy = [...wb]; let exact = 0;
  wa.forEach(w => { const i = wbCopy.indexOf(w); if (i!==-1){exact++;wbCopy.splice(i,1);}});
  let partial = 0;
  wa.forEach(w => {
    const best = wb.reduce((b2,tw)=>{
      const sh=w.length<tw.length?w:tw,lo=w.length>=tw.length?w:tw;
      let m=0;for(let i=0;i<sh.length;i++)if(lo.includes(sh[i]))m++;
      return Math.max(b2,m/lo.length);
    },0);
    partial+=best;
  });
  const er=exact/Math.max(wa.length,wb.length),pr=partial/Math.max(wa.length,wb.length);
  return Math.min(1,er*.7+pr*.3);
}

const pronCache = {};
async function fetchProns(n) {
  if (pronCache[n]) return pronCache[n];
  try {
    const r = await fetch(`${API_BASE}/api/pronunciations/${n}`);
    if (!r.ok) throw new Error();
    const d = await r.json();
    pronCache[n] = Array.isArray(d.verses) ? d.verses : [];
  } catch { pronCache[n] = []; }
  return pronCache[n];
}
function useProns(n) {
  const [prons, setProns] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!n) { setProns([]); return; }
    setLoading(true);
    fetchProns(n).then(v => { setProns(v); setLoading(false); });
  }, [n]);
  return { prons, loading };
}

/* ═══════════════════════════════════════════════════════════
   AUDIO HOOK
═══════════════════════════════════════════════════════════ */
function useAudio(src) {
  const ref = useRef(null);
  const [playing,  setPlaying]  = useState(false);
  const [time,     setTime]     = useState(0);
  const [dur,      setDur]      = useState(0);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const a = new Audio();
    ref.current = a;
    if (src) a.src = src;
    const fns = {
      loadedmetadata: () => { setDur(a.duration||0); setLoading(false); },
      timeupdate:     () => setTime(a.currentTime),
      ended:          () => { setPlaying(false); setTime(0); },
      waiting:        () => setLoading(true),
      play:           () => { setLoading(false); setPlaying(true); },
      pause:          () => setPlaying(false),
    };
    Object.entries(fns).forEach(([ev,fn]) => a.addEventListener(ev,fn));
    return () => { a.pause(); Object.entries(fns).forEach(([ev,fn]) => a.removeEventListener(ev,fn)); };
  }, [src]);

  const toggle = useCallback(() => {
    if (!ref.current) return;
    if (playing) ref.current.pause();
    else { setLoading(true); ref.current.play().catch(() => setLoading(false)); }
  }, [playing]);
  const stop = useCallback(() => {
    if (!ref.current) return;
    ref.current.pause(); ref.current.currentTime=0; setPlaying(false); setTime(0);
  }, []);
  const seek = useCallback((t) => {
    if (!ref.current) return;
    ref.current.currentTime=Math.max(0,Math.min(t,dur||9999)); setTime(ref.current.currentTime);
  }, [dur]);
  const skip = useCallback((d) => { if(ref.current) seek(ref.current.currentTime+d); }, [seek]);
  return { playing, time, dur, loading, toggle, stop, seek, skip };
}

/* ═══════════════════════════════════════════════════════════
   AUDIO PLAYER
═══════════════════════════════════════════════════════════ */
function AudioPlayer({ src, label, reciterName }) {
  const { playing, time, dur, loading, toggle, stop, seek, skip } = useAudio(src);
  const fmt = s => isFinite(s)&&s>0 ? `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}` : "0:00";
  const pct = dur > 0 ? (time/dur)*100 : 0;
  const handleBar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX-r.left)/r.width)*(dur||0));
  };

  return (
    <div style={{ background:SURF, border:`1px solid ${BR}`, borderRadius:14, padding:"14px 16px", boxShadow:SHADOW_S }}>
      {label && (
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:11 }}>
          <span style={{ width:7,height:7,borderRadius:"50%", background:playing?GREEN:INK4, transition:"all .3s" }}/>
          <span style={{ ...eyebrow, fontSize:9.5, color:GREEN }}>{label}</span>
          {reciterName && <span style={{ fontSize:10, color:INK3, fontFamily:"'Mulish',sans-serif", marginLeft:"auto" }}>{reciterName}</span>}
        </div>
      )}
      <div onClick={handleBar} style={{ position:"relative", height:5, borderRadius:99, background:SURF3, cursor:"pointer", marginBottom:11 }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${GREEN},${GREEN_L})`, borderRadius:99, transition:"width .1s" }}/>
        <div style={{ position:"absolute", top:"50%", left:`${pct}%`, width:13, height:13, borderRadius:"50%", background:SURF, border:`2px solid ${GREEN}`, transform:"translate(-50%,-50%)", boxShadow:SHADOW_S, transition:"left .1s" }}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {[[-30,<SkipBack size={11}/>],[-10,<Rewind size={11}/>]].map(([d,ic]) => (
          <button key={d} onClick={() => skip(d)} style={ctrlBtn()}>{ic}</button>
        ))}
        <button onClick={toggle} style={{
          width:40, height:40, borderRadius:"50%",
          background: playing ? GREEN_BG : GREEN,
          border: `1.5px solid ${GREEN}`,
          color: playing ? GREEN : "#fff",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0, transition:"all .2s", boxShadow: playing ? "none" : SHADOW_S,
        }}>
          {loading
            ? <div style={{width:13,height:13,border:`2px solid currentColor`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
            : playing
              ? <Pause size={14} fill="currentColor" color={GREEN}/>
              : <Play size={14} fill="currentColor" color="#fff" style={{marginLeft:2}}/>}
        </button>
        {[[10,<FastForward size={11}/>],[30,<SkipForward size={11}/>]].map(([d,ic]) => (
          <button key={d} onClick={() => skip(d)} style={ctrlBtn()}>{ic}</button>
        ))}
        <button onClick={stop} style={{ ...ctrlBtn(CLAY), marginLeft:"auto" }}>
          <span style={{ width:9,height:9,borderRadius:2,background:"currentColor" }}/>
        </button>
        <span style={{ fontSize:11, color:INK3, fontFamily:"'Mulish',sans-serif", letterSpacing:"0.02em" }}>{fmt(time)} / {fmt(dur)}</span>
      </div>
      {playing && (
        <div style={{ display:"flex",gap:2.5,alignItems:"center",justifyContent:"center",marginTop:9 }}>
          {[3,5,7,9,12,9,7,5,3,5,7,9,12,9,7,5,3].map((h,i) => (
            <span key={i} style={{ width:2.5,height:h,borderRadius:99,background:GOLD,opacity:0.3+(h/12)*0.5,animation:`wave ${0.35+i*0.04}s ease-in-out infinite alternate` }}/>
          ))}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ current, total, color }) {
  return (
    <div style={{ display:"flex",gap:2,marginBottom:16 }}>
      {Array.from({length:Math.min(total,40)}).map((_,i) => (
        <div key={i} style={{ flex:1,height:4,borderRadius:99,background:i<current?color:i===current?`${color}55`:INK4,transition:"background .3s" }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VOICE PRACTICE MODAL
═══════════════════════════════════════════════════════════ */
function VoicePractice({ surah, reciterId, onClose }) {
  const [lines, setLines] = useState(null);
  const [bas, setBas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("intro");
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [showPron, setShowPron] = useState(true);
  const recRef = useRef(null);
  const { prons, loading: pronLoading } = useProns(surah?.n);
  const rec = reciters.find(r => r.id === reciterId) || reciters[0];
  const audioSrc = `${rec.server}/${String(surah.n).padStart(3,"0")}.mp3`;

  useEffect(() => {
    setLoading(true); setLines(null); setBas(null); setStep("intro"); setIdx(0); setHistory([]); setScore(null); setTranscript("");
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surah.n}`),
      fetch(`https://api.alquran.cloud/v1/surah/${surah.n}/en.asad`)
    ]).then(async ([ar,en]) => {
      const [aj,ej] = await Promise.all([ar.json(),en.json()]);
      if (aj.code===200) {
        const raw = aj.data.ayahs.map((v,i) => ({ ar:v.text, en:ej.data?.ayahs[i]?.text||"" }));
        if (!NO_BASMALA.has(surah.n) && raw.length>0 && isBasmala(raw[0].ar)) { setBas(raw[0]); setLines(raw.slice(1)); }
        else setLines(raw);
      }
      setLoading(false);
    }).catch(() => { setLines([]); setLoading(false); });
  }, [surah.n]);

  const cur = lines ? lines[idx] : null;
  const curPron = prons[idx] || null;
  const ready = !loading && !pronLoading;
  const scoreCol = s => s>=75 ? GREEN : s>=50 ? GOLD : CLAY;

  const startRec = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Utilisez Google Chrome pour la reconnaissance vocale."); return; }
    setTranscript(""); setScore(null); setRecording(true);
    const r = new SR(); r.lang="ar-SA"; r.continuous=false; r.interimResults=true;
    r.onresult = e => setTranscript(Array.from(e.results).map(r2=>r2[0].transcript).join(" "));
    r.onend = () => { setRecording(false); setStep("result"); };
    r.onerror = () => { setRecording(false); setStep("result"); };
    recRef.current = r; r.start();
  };

  useEffect(() => {
    if (step==="result" && cur) {
      const s = !transcript.trim() ? 0 : isAr(transcript) ? similarity(transcript,cur.ar) : 0.3;
      setScore(Math.round(s*100));
      setHistory(h => [...h,{ar:cur.ar,said:transcript,score:Math.round(s*100)}]);
    }
  }, [step]);

  const next = () => {
    if (idx<(lines?.length||0)-1) { setIdx(i=>i+1); setStep("practice"); setTranscript(""); setScore(null); }
    else setStep("done");
  };
  const avg = history.length ? Math.round(history.reduce((a,h)=>a+h.score,0)/history.length) : 0;

  /* overlay */
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(20,30,24,0.62)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)" }}>
      <div style={{ background:SURF,border:`1px solid ${BR}`,borderRadius:20,width:"100%",maxWidth:600,maxHeight:"90vh",overflow:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.22)" }}>
        {/* Header */}
        <div style={{ background:SURF2,padding:"16px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BR}`,borderRadius:"20px 20px 0 0" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:38,height:38,borderRadius:11,background:GREEN_BG,border:`1px solid ${GREEN_BR}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Mic size={16} color={GREEN}/>
            </div>
            <div>
              <div style={{ fontWeight:700,fontSize:16,color:INK,fontFamily:"'Cormorant Garamond',serif" }}>Pratique vocale — {surah.en}</div>
              <div style={{ ...eyebrow,fontSize:9,color:INK3 }}>{surah.ar} · {surah.fr && <span style={{ color:GOLD }}>({surah.fr})</span>} · {surah.verses} versets</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
            <button onClick={() => setShowPron(v=>!v)} style={{ display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:7,border:`1px solid ${showPron?GOLD_BR:BR}`,background:showPron?GOLD_BG:SURF,color:showPron?GOLD:INK3,fontFamily:"'Mulish',sans-serif",fontWeight:700,fontSize:9.5,cursor:"pointer" }}>
              {showPron?<Eye size={9}/>:<EyeOff size={9}/>} PRON
            </button>
            <button onClick={onClose} style={{ background:SURF3,border:`1px solid ${BR}`,borderRadius:7,color:INK2,cursor:"pointer",padding:"6px 9px" }}><X size={13}/></button>
          </div>
        </div>

        <div style={{ padding:22 }}>
          {!ready && (
            <div style={{ textAlign:"center",padding:50 }}>
              <div style={{ width:30,height:30,border:`2px solid ${GREEN_BR}`,borderTopColor:GREEN,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 12px" }}/>
              <p style={{ color:INK3,fontFamily:"'Mulish',sans-serif",fontSize:12 }}>{loading?"Chargement des versets…":"Chargement des prononciations…"}</p>
            </div>
          )}

          {ready && lines && lines.length===0 && (
            <div style={{ textAlign:"center",padding:40 }}>
              <p style={{ color:INK2,fontFamily:"'Mulish',sans-serif" }}>Impossible de charger les versets.</p>
              <button onClick={onClose} style={softBtn(GREEN,true)}>Fermer</button>
            </div>
          )}

          {/* INTRO */}
          {ready && lines && lines.length>0 && step==="intro" && (
            <div>
              {bas && (
                <div style={{ background:GOLD_BG,border:`1px solid ${GOLD_BR}`,borderRadius:12,padding:"10px 18px",marginBottom:14,textAlign:"center" }}>
                  <div style={{ ...eyebrow,fontSize:9,color:GOLD,marginBottom:5 }}>Basmala</div>
                  <p style={{ fontSize:22,direction:"rtl",fontFamily:"'Amiri',serif",color:INK,margin:0,lineHeight:1.9 }}>{bas.ar}</p>
                </div>
              )}
              <div style={{ background:SURF2,border:`1px solid ${BR}`,borderRadius:12,padding:14,marginBottom:16 }}>
                <AudioPlayer src={audioSrc} label="Écouter d'abord" reciterName={rec.name}/>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:18,maxHeight:260,overflowY:"auto" }}>
                {lines.slice(0,10).map((l,i) => (
                  <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",background:SURF,border:`1px solid ${BR2}`,borderRadius:10 }}>
                    <div style={{ width:22,height:22,borderRadius:"50%",background:GREEN_BG,border:`1px solid ${GREEN_BR}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:4 }}>
                      <span style={{ ...eyebrow,fontSize:8,color:GREEN }}>{i+1}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:18,fontFamily:"'Amiri',serif",color:INK,direction:"rtl",display:"block",lineHeight:1.9 }}>{l.ar}</span>
                      {showPron && prons[i] && <span style={{ fontSize:10,color:GOLD,fontFamily:"'Mulish',sans-serif",fontStyle:"italic",display:"block",marginTop:2 }}>🔊 {prons[i]}</span>}
                    </div>
                  </div>
                ))}
                {lines.length>10 && <p style={{ color:INK3,fontSize:10,textAlign:"center",fontFamily:"'Mulish',sans-serif" }}>…et {lines.length-10} autres versets</p>}
              </div>
              <button onClick={() => setStep("practice")} style={{ ...softBtn(GREEN,true),width:"100%",justifyContent:"center" }}>
                Commencer la pratique <ChevronRight size={14}/>
              </button>
            </div>
          )}

          {/* PRACTICE */}
          {ready && lines && (step==="practice"||step==="record") && cur && (
            <div>
              <ProgressBar current={idx} total={lines.length} color={GREEN}/>
              <div style={{ background:SURF2,border:`1.5px solid ${BR}`,borderRadius:14,padding:20,marginBottom:14,textAlign:"center" }}>
                <div style={{ ...eyebrow,fontSize:9,color:GREEN,marginBottom:10 }}>Verset {idx+1} / {lines.length}</div>
                <p style={{ fontSize:26,direction:"rtl",fontFamily:"'Amiri',serif",color:INK,margin:"0 0 12px",lineHeight:1.9 }}>{cur.ar}</p>
                {curPron && (
                  <button onClick={() => setShowPron(v=>!v)} style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 12px",borderRadius:20,border:`1px solid ${showPron?GOLD_BR:BR}`,background:showPron?GOLD_BG:SURF,color:showPron?GOLD:INK3,fontFamily:"'Mulish',sans-serif",fontSize:9.5,fontWeight:700,cursor:"pointer",marginBottom:showPron?8:0 }}>
                    {showPron?<Eye size={8}/>:<EyeOff size={8}/>} {showPron?"Masquer":"Voir"} prononciation
                  </button>
                )}
                {showPron && curPron && <div style={{ display:"inline-block",background:GOLD_BG,border:`1px solid ${GOLD_BR}`,borderRadius:20,padding:"2px 12px",fontSize:11,color:GOLD,fontStyle:"italic",fontFamily:"'Mulish',sans-serif",marginLeft:6 }}>{curPron}</div>}
              </div>
              <div style={{ marginBottom:14 }}>
                <AudioPlayer src={audioSrc} label="Récitation" reciterName={rec.name}/>
              </div>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontFamily:"'Mulish',sans-serif",fontSize:12,color:INK3,marginBottom:12 }}>Récitez ce verset en arabe :</p>
                {!recording ? (
                  <button onClick={startRec} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",borderRadius:12,border:"none",background:CLAY,color:"#fff",fontFamily:"'Mulish',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:`0 4px 18px ${CLAY}30` }}>
                    <Mic size={16}/> Appuyer pour réciter
                  </button>
                ) : (
                  <button onClick={() => { recRef.current?.stop(); setRecording(false); }} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",borderRadius:12,border:"none",background:"#7a2030",color:"#fff",fontFamily:"'Mulish',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    <MicOff size={16}/> Arrêter
                  </button>
                )}
                {recording && (
                  <div style={{ marginTop:10 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6,justifyContent:"center",marginBottom:6 }}>
                      <div style={{ width:7,height:7,borderRadius:"50%",background:CLAY,animation:"pulse 1s ease-in-out infinite" }}/>
                      <p style={{ fontFamily:"'Mulish',sans-serif",fontSize:11,color:CLAY,margin:0 }}>En écoute…</p>
                    </div>
                    {transcript && <p style={{ direction:"rtl",fontFamily:"'Amiri',serif",fontSize:18,color:INK,padding:"8px 14px",background:SURF2,borderRadius:9,border:`1px solid ${BR}` }}>{transcript}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESULT */}
          {ready && lines && step==="result" && cur && (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:82,height:82,borderRadius:"50%",background:SURF2,border:`3px solid ${scoreCol(score)}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:`0 0 22px ${scoreCol(score)}18` }}>
                <span style={{ fontSize:22,fontWeight:800,color:scoreCol(score),fontFamily:"'Mulish',sans-serif" }}>{score}%</span>
              </div>
              <p style={{ fontWeight:700,fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:INK,marginBottom:16 }}>
                {score>=75?"🌟 Masha Allah ! Excellent !":score>=50?"👍 Bien, continuez !":"🎧 Écoutez et réessayez"}
              </p>
              <div style={{ background:SURF2,border:`1px solid ${BR}`,borderRadius:12,padding:14,textAlign:"left",marginBottom:16 }}>
                <div style={{ ...eyebrow,fontSize:9,color:GREEN,marginBottom:5 }}>Verset correct</div>
                <p style={{ fontSize:22,direction:"rtl",fontFamily:"'Amiri',serif",color:INK,margin:"0 0 6px",lineHeight:1.9 }}>{cur.ar}</p>
                {prons[idx] && <p style={{ fontSize:11,fontFamily:"'Mulish',sans-serif",color:GOLD,margin:0,fontStyle:"italic" }}>🔊 {prons[idx]}</p>}
                {transcript && (<>
                  <div style={{ ...eyebrow,fontSize:9,color:scoreCol(score),margin:"10px 0 5px" }}>Votre réponse</div>
                  <p style={{ fontSize:15,direction:"rtl",fontFamily:"'Amiri',serif",color:INK2,margin:0,padding:"6px 10px",background:SURF,borderRadius:8,border:`1px solid ${BR2}` }}>{transcript}</p>
                </>)}
              </div>
              <div style={{ display:"flex",gap:9,justifyContent:"center" }}>
                <button onClick={() => { setStep("practice"); setTranscript(""); setScore(null); setHistory(h=>h.slice(0,-1)); }} style={softBtn(INK2)}>
                  <RotateCcw size={12}/> Réessayer
                </button>
                <button onClick={next} style={softBtn(GREEN,true)}>
                  {idx<lines.length-1?"Suivant":"Terminer"} <ChevronRight size={12}/>
                </button>
              </div>
            </div>
          )}

          {/* DONE */}
          {ready && lines && step==="done" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:52,marginBottom:12 }}>{avg>=75?"🏆":avg>=50?"🥈":"📚"}</div>
              <h3 style={{ fontSize:22,fontWeight:600,fontFamily:"'Cormorant Garamond',serif",color:INK,margin:"0 0 5px" }}>Session terminée !</h3>
              <div style={{ display:"flex",justifyContent:"center",gap:10,margin:"18px 0" }}>
                {[["Score moyen",`${avg}%`],["Versets",`${history.length}`],["Réussis",`${history.filter(h=>h.score>=75).length}`]].map(([l,v]) => (
                  <div key={l} style={{ background:SURF2,border:`1px solid ${BR}`,borderRadius:12,padding:"10px 16px" }}>
                    <div style={{ ...eyebrow,fontSize:8.5,color:INK3,marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:20,fontWeight:800,color:GREEN,fontFamily:"'Mulish',sans-serif" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:9,justifyContent:"center" }}>
                <button onClick={() => { setStep("intro"); setIdx(0); setHistory([]); setTranscript(""); setScore(null); }} style={softBtn(GREEN,true)}>Recommencer</button>
                <button onClick={onClose} style={softBtn(INK2)}>Fermer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VOICE QUIZ MODAL
═══════════════════════════════════════════════════════════ */
function VoiceQuiz({ surahNumber, surahName, onClose, reciterId }) {
  const [lines, setLines] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lineScore, setLineScore] = useState(null);
  const [results, setResults] = useState([]);
  const [showPron, setShowPron] = useState(false);
  const recogRef = useRef(null);
  const { prons, loading: pronLoading } = useProns(surahNumber);
  const rec = reciters.find(r => r.id === reciterId) || reciters[0];
  const audioSrc = `${rec.server}/${String(surahNumber).padStart(3,"0")}.mp3`;

  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
      .then(r => r.json()).then(aj => {
        if (aj.code===200) {
          const raw = aj.data.ayahs.map(v => ({ ar:v.text, hint:v.text.split(" ").slice(0,3).join(" ")+"…" }));
          setLines(!NO_BASMALA.has(surahNumber)&&raw.length>0&&isBasmala(raw[0].ar) ? raw.slice(1) : raw);
        }
        setLoading(false);
      }).catch(() => { setLines([]); setLoading(false); });
  }, [surahNumber]);

  const q = lines ? lines[qIdx] : null;
  const curPron = prons[qIdx] || null;
  const ready = !loading && !pronLoading;
  const scoreCol = s => s>=75 ? GREEN : s>=50 ? GOLD : CLAY;

  function startRec() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Utilisez Chrome."); return; }
    setTranscript(""); setLineScore(null); setRecording(true);
    const r = new SR(); r.lang="ar-SA"; r.continuous=false; r.interimResults=true;
    r.onresult = e => setTranscript(Array.from(e.results).map(r2=>r2[0].transcript).join(" "));
    r.onend = () => { setRecording(false); setPhase("result"); };
    r.onerror = () => { setRecording(false); setPhase("result"); };
    recogRef.current = r; r.start();
  }

  useEffect(() => {
    if (phase==="result"&&q) {
      const s = !transcript.trim() ? 0 : isAr(transcript) ? similarity(transcript,q.ar) : 0.35;
      const pct = Math.round(s*100);
      setLineScore(pct);
      setResults(p => [...p,{ar:q.ar,said:transcript,score:pct}]);
    }
  }, [phase]);

  const avg = results.length ? Math.round(results.reduce((a,r2)=>a+r2.score,0)/results.length) : 0;
  const next = () => {
    if (qIdx<(lines?.length||0)-1) { setQIdx(i=>i+1); setPhase("prompt"); setTranscript(""); setLineScore(null); setShowPron(false); }
    else setPhase("done");
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(20,30,24,0.62)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)" }}>
      <div style={{ background:SURF,border:`1px solid ${BR}`,borderRadius:20,width:"100%",maxWidth:560,maxHeight:"90vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,.2)" }}>
        {/* Header */}
        <div style={{ background:BLUE_BG,padding:"16px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BLUE_BR}`,borderRadius:"20px 20px 0 0" }}>
          <div style={{ display:"flex",alignItems:"center",gap:11 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:BLUE_BG,border:`1px solid ${BLUE_BR}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Brain size={16} color={BLUE}/>
            </div>
            <div>
              <div style={{ fontWeight:700,fontSize:16,color:INK,fontFamily:"'Cormorant Garamond',serif" }}>Quiz Vocal — {surahName}</div>
              <div style={{ ...eyebrow,fontSize:9,color:INK3 }}>Testez votre mémorisation</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:SURF2,border:`1px solid ${BR}`,borderRadius:7,color:INK2,cursor:"pointer",padding:"5px 9px" }}><X size={13}/></button>
        </div>

        <div style={{ padding:22 }}>
          {!ready && (
            <div style={{ textAlign:"center",padding:46 }}>
              <div style={{ width:26,height:26,border:`2px solid ${BLUE_BR}`,borderTopColor:BLUE,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 10px" }}/>
              <p style={{ color:INK3,fontFamily:"'Mulish',sans-serif",fontSize:11 }}>{loading?"Chargement des versets…":"Chargement des prononciations…"}</p>
            </div>
          )}

          {ready && phase==="intro" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:14 }}>🧠</div>
              <h3 style={{ fontSize:20,fontWeight:600,fontFamily:"'Cormorant Garamond',serif",color:INK,margin:"0 0 14px" }}>Quiz de Mémorisation Vocale</h3>
              <div style={{ marginBottom:16 }}><AudioPlayer src={audioSrc} label="Écouter d'abord" reciterName={rec.name}/></div>
              <button onClick={() => setPhase("prompt")} style={softBtn(BLUE,true)}>
                Commencer <ChevronRight size={13}/>
              </button>
            </div>
          )}

          {ready && lines && (phase==="prompt"||phase==="record") && q && (
            <div>
              <ProgressBar current={qIdx} total={lines.length} color={BLUE}/>
              <div style={{ textAlign:"center",marginBottom:16 }}>
                <div style={{ ...eyebrow,fontSize:8.5,color:INK3,marginBottom:7 }}>Verset {qIdx+1} / {lines.length}</div>
                <div style={{ background:SURF2,border:`1px solid ${BR}`,borderRadius:12,padding:"16px 20px" }}>
                  <div style={{ background:GOLD_BG,border:`1px solid ${GOLD_BR}`,borderRadius:8,padding:"6px 14px",display:"inline-block",marginBottom:12 }}>
                    <span style={{ ...eyebrow,fontSize:8,color:GOLD,display:"block",marginBottom:3 }}>Indice — début du verset</span>
                    <span style={{ fontFamily:"'Amiri',serif",fontSize:17,color:GOLD,direction:"rtl" }}>{q.hint}</span>
                  </div>
                  {curPron && (
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                      <button onClick={() => setShowPron(v=>!v)} style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"3px 11px",borderRadius:20,border:`1px solid ${showPron?GOLD_BR:BR}`,background:showPron?GOLD_BG:SURF,color:showPron?GOLD:INK3,fontFamily:"'Mulish',sans-serif",fontSize:9.5,fontWeight:700,cursor:"pointer" }}>
                        {showPron?<Eye size={8}/>:<EyeOff size={8}/>} {showPron?"Masquer aide":"Aide prononciation"}
                      </button>
                      {showPron && <span style={{ fontSize:11,color:GOLD,fontFamily:"'Mulish',sans-serif",fontStyle:"italic",background:GOLD_BG,border:`1px solid ${GOLD_BR}`,borderRadius:20,padding:"2px 10px" }}>{curPron}</span>}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginBottom:14 }}><AudioPlayer src={audioSrc} label="Aide à la récitation" reciterName={rec.name}/></div>
              <div style={{ textAlign:"center" }}>
                {!recording ? (
                  <button onClick={startRec} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",borderRadius:12,border:"none",cursor:"pointer",background:CLAY,color:"#fff",fontFamily:"'Mulish',sans-serif",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px ${CLAY}30` }}>
                    <Mic size={16}/> Appuyer pour réciter
                  </button>
                ) : (
                  <button onClick={() => { recogRef.current?.stop(); setRecording(false); }} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",borderRadius:12,border:"none",cursor:"pointer",background:"#7a2030",color:"#fff",fontFamily:"'Mulish',sans-serif",fontWeight:700,fontSize:13 }}>
                    <MicOff size={16}/> Terminer
                  </button>
                )}
                {recording && (
                  <div style={{ marginTop:10 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6,justifyContent:"center",marginBottom:6 }}>
                      <div style={{ width:7,height:7,borderRadius:"50%",background:CLAY,animation:"pulse 1s ease-in-out infinite" }}/>
                      <p style={{ fontFamily:"'Mulish',sans-serif",fontSize:11,color:CLAY,margin:0 }}>En écoute…</p>
                    </div>
                    {transcript && <p style={{ direction:"rtl",fontFamily:"'Amiri',serif",fontSize:17,color:INK,marginTop:7,padding:"6px 12px",background:SURF2,borderRadius:9,border:`1px solid ${BR}` }}>{transcript}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {ready && phase==="result" && q && (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:80,height:80,borderRadius:"50%",background:SURF2,border:`3px solid ${scoreCol(lineScore)}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:`0 0 20px ${scoreCol(lineScore)}18` }}>
                <span style={{ fontSize:21,fontWeight:800,color:scoreCol(lineScore),fontFamily:"'Mulish',sans-serif" }}>{lineScore}%</span>
              </div>
              <h3 style={{ fontSize:15,fontWeight:700,fontFamily:"'Mulish',sans-serif",color:INK,margin:"0 0 14px" }}>
                {lineScore>=75?"✅ Masha Allah !":lineScore>=50?"🟡 Presque !":"❌ Révisez ce verset."}
              </h3>
              <div style={{ background:SURF2,border:`1px solid ${BR}`,borderRadius:12,padding:14,textAlign:"left",marginBottom:18 }}>
                <div style={{ ...eyebrow,fontSize:8.5,color:GREEN,marginBottom:4 }}>Verset correct</div>
                <div style={{ fontSize:20,direction:"rtl",fontFamily:"'Amiri',serif",color:INK,lineHeight:1.9 }}>{q.ar}</div>
                {prons[qIdx] && <div style={{ fontSize:10,color:GOLD,fontFamily:"'Mulish',sans-serif",marginTop:4,fontStyle:"italic" }}>🔊 {prons[qIdx]}</div>}
                <div style={{ ...eyebrow,fontSize:8.5,color:scoreCol(lineScore),margin:"10px 0 4px" }}>Votre réponse</div>
                <div style={{ fontFamily:"'Amiri',serif",fontSize:14,direction:"rtl",color:INK2,background:SURF,padding:"6px 10px",borderRadius:8,border:`1px solid ${BR2}` }}>{transcript||"(rien détecté)"}</div>
              </div>
              <div style={{ display:"flex",gap:9,justifyContent:"center" }}>
                <button onClick={() => { setPhase("prompt"); setTranscript(""); setLineScore(null); setShowPron(false); setResults(r=>r.slice(0,-1)); }} style={softBtn(INK2)}>
                  <RotateCcw size={12}/> Réessayer
                </button>
                <button onClick={next} style={softBtn(BLUE,true)}>
                  {qIdx<(lines?.length||0)-1?"Suivant":"Terminer"} <ChevronRight size={12}/>
                </button>
              </div>
            </div>
          )}

          {ready && phase==="done" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:52,marginBottom:14 }}>{avg>=75?"🏆":avg>=50?"🥈":"📚"}</div>
              <h3 style={{ fontSize:21,fontWeight:600,fontFamily:"'Cormorant Garamond',serif",color:INK,margin:"0 0 4px" }}>Quiz Terminé !</h3>
              <div style={{ display:"flex",justifyContent:"center",gap:12,margin:"18px 0" }}>
                {[["Score",`${avg}%`],["Versets",`${results.length}`],["Réussis",`${results.filter(r=>r.score>=75).length}`]].map(([l,v]) => (
                  <div key={l} style={{ background:SURF2,border:`1px solid ${BR}`,borderRadius:12,padding:"10px 18px" }}>
                    <div style={{ ...eyebrow,fontSize:8.5,color:INK3,marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:20,fontWeight:800,color:GREEN,fontFamily:"'Mulish',sans-serif" }}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => { setPhase("intro"); setQIdx(0); setResults([]); }} style={softBtn(BLUE,true)}>Recommencer le Quiz</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLAN GENERATOR
═══════════════════════════════════════════════════════════ */
function generatePlan(speed) {
  const ORDER = [114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,55,56,57,58,59,60,61,62,63,64,65,66,48,49,50,51,52,53,54,36,37,38,39,40,41,42,43,44,45,46,47,29,30,31,32,33,34,35,20,21,22,23,24,25,26,27,28,13,14,15,16,17,18,19,6,7,8,9,10,11,12,3,4,5,1,2];
  const FULL_SURAHS = Array.from({length:114},(_,i) => {
    const found = ALL_SURAHS.find(s=>s.n===i+1);
    return found || {n:i+1,ar:`سورة ${i+1}`,en:`Surah ${i+1}`,verses:10};
  });
  const vpd = {slow:5,medium:10,fast:20}[speed];
  const days=[]; let dayNum=1,buf=[],bufV=0;
  ORDER.forEach(n => {
    const s=FULL_SURAHS[n-1]; if(!s) return;
    buf.push(s); bufV+=s.verses;
    while(bufV>=vpd) {
      const dayItems=[]; let rem=vpd; const left=[];
      buf.forEach(su => {
        if(rem<=0){left.push(su);return;}
        if(su.verses<=rem){dayItems.push({surah:su,part:"full",verses:su.verses});rem-=su.verses;}
        else{dayItems.push({surah:su,part:`1–${rem}`,verses:rem});if(su.verses-rem>0)left.unshift({...su,verses:su.verses-rem});rem=0;}
      });
      days.push({day:dayNum++,items:dayItems});
      buf=left; bufV=buf.reduce((a,s2)=>a+s2.verses,0);
    }
  });
  if(buf.length>0) days.push({day:dayNum++,items:buf.map(su=>({surah:su,part:"full",verses:su.verses}))});
  return days;
}

/* ═══════════════════════════════════════════════════════════
   MEMO PLAN MODAL
═══════════════════════════════════════════════════════════ */
function MemoPlan({ onClose }) {
  const [speed, setSpeed] = useState("medium");
  const [plan, setPlan] = useState(null);
  const [dayView, setDayView] = useState(null);
  const [completed, setCompleted] = useState({});
  const [page, setPage] = useState(0);
  const [reciter, setReciter] = useState("mishari");
  const [voiceSurah, setVoiceSurah] = useState(null);
  const PER_PAGE = 14;

  useEffect(() => { const p = generatePlan(speed); setPlan(p); setPage(0); setDayView(null); }, [speed]);

  const speedCfg = {
    slow:   { label:"Lent",   sub:"5 v/j",  color:GREEN, days:"~1 095 jours · 3 ans" },
    medium: { label:"Moyen",  sub:"10 v/j", color:GOLD,  days:"~365 jours · 1 an" },
    fast:   { label:"Rapide", sub:"20 v/j", color:CLAY,  days:"~180 jours · 6 mois" },
  };
  const cfg = speedCfg[speed];
  const totalDays = plan?.length||0;
  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = totalDays>0 ? Math.round((doneCount/totalDays)*100) : 0;
  const pages = plan ? Math.ceil(plan.length/PER_PAGE) : 0;
  const visible = plan ? plan.slice(page*PER_PAGE,(page+1)*PER_PAGE) : [];

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(20,30,24,0.62)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)" }}>
      {voiceSurah && <VoicePractice surah={voiceSurah} reciterId={reciter} onClose={() => setVoiceSurah(null)}/>}
      <div style={{ background:SURF,border:`1px solid ${BR}`,borderRadius:22,width:"100%",maxWidth:980,height:"92vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.18)" }}>

        {/* Header */}
        <div style={{ background:SURF2,padding:"18px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BR}`,flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:46,height:46,borderRadius:13,background:GREEN_BG,border:`1px solid ${GREEN_BR}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Calendar size={20} color={GREEN}/>
            </div>
            <div>
              <div style={{ ...eyebrow,fontSize:9.5,color:GOLD,marginBottom:5 }}>خطة الحفظ · 114 sourates</div>
              <h2 style={{ margin:0,fontWeight:600,fontSize:24,fontFamily:"'Cormorant Garamond',serif",color:INK,lineHeight:1 }}>Plan de mémorisation</h2>
              <p style={{ margin:"4px 0 0",fontSize:12,color:INK3,fontFamily:"'Mulish',sans-serif" }}>Un programme jour par jour pour tout le Coran, à votre rythme.</p>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:50,height:50,position:"relative" }}>
              <svg viewBox="0 0 50 50" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="25" cy="25" r="20" fill="none" stroke={INK4} strokeWidth="5"/>
                <circle cx="25" cy="25" r="20" fill="none" stroke={GREEN} strokeWidth="5" strokeDasharray={`${2*Math.PI*20}`} strokeDashoffset={`${2*Math.PI*20*(1-pct/100)}`} strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/>
              </svg>
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:GREEN,fontFamily:"'Mulish',sans-serif" }}>{pct}%</div>
            </div>
            <button onClick={onClose} style={{ background:SURF3,border:`1px solid ${BR}`,borderRadius:8,color:INK2,cursor:"pointer",padding:"7px 10px" }}><X size={14}/></button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ background:BG2,borderBottom:`1px solid ${BR2}`,padding:"10px 26px",display:"flex",alignItems:"center",gap:10,flexShrink:0,flexWrap:"wrap" }}>
          <span style={{ ...eyebrow,fontSize:8.5,color:INK3 }}>Rythme</span>
          {Object.entries(speedCfg).map(([k,v]) => (
            <button key={k} onClick={() => setSpeed(k)} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:9,border:`1.5px solid ${speed===k?v.color:BR}`,background:speed===k?`${v.color}14`:SURF,color:speed===k?v.color:INK3,fontFamily:"'Mulish',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer",transition:"all .15s" }}>
              {v.label} <span style={{ opacity:.6,fontSize:10 }}>{v.sub}</span>
            </button>
          ))}
          <span style={{ width:1,height:20,background:BR }}/>
          {reciters.slice(0,3).map(r => (
            <button key={r.id} onClick={() => setReciter(r.id)} style={{ padding:"5px 11px",borderRadius:8,border:`1px solid ${reciter===r.id?GREEN:BR}`,background:reciter===r.id?GREEN_BG:SURF,color:reciter===r.id?GREEN:INK3,fontFamily:"'Mulish',sans-serif",fontWeight:700,fontSize:10.5,cursor:"pointer" }}>{r.short}</button>
          ))}
          <div style={{ marginLeft:"auto",background:SURF,border:`1px solid ${BR}`,borderRadius:9,padding:"5px 14px",fontSize:11,fontFamily:"'Mulish',sans-serif",color:GREEN,fontWeight:700 }}>{cfg.days}</div>
        </div>

        {/* Body */}
        <div style={{ flex:1,overflowY:"auto",padding:"20px 26px" }}>
          {!plan && <div style={{ textAlign:"center",padding:60,color:INK3,fontFamily:"'Mulish',sans-serif" }}>Génération en cours…</div>}

          {plan && !dayView && (
            <div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10,marginBottom:20 }}>
                {visible.map(day => {
                  const done = completed[day.day];
                  const totalV = day.items.reduce((a,it)=>a+it.verses,0);
                  const names = day.items.map(it=>it.surah.en).join(", ");
                  return (
                    <button key={day.day} onClick={() => setDayView(day)} style={{
                      background:done?GREEN_BG:SURF, border:`1.5px solid ${done?GREEN_BR:BR}`,
                      borderRadius:14,padding:"14px 16px",cursor:"pointer",textAlign:"left",
                      position:"relative",transition:"all .15s",boxShadow:done?"none":SHADOW_S
                    }}>
                      {done && <span style={{ position:"absolute",top:11,right:11,width:18,height:18,borderRadius:"50%",background:GREEN,display:"flex",alignItems:"center",justifyContent:"center" }}><CheckCircle size={10} color="#fff"/></span>}
                      <div style={{ ...eyebrow,fontSize:8.5,color:cfg.color,marginBottom:6 }}>Jour {day.day}</div>
                      <div style={{ fontSize:13,fontWeight:700,color:INK,fontFamily:"'Mulish',sans-serif",marginBottom:3,lineHeight:1.3 }}>
                        {names.length>38?names.slice(0,38)+"…":names}
                      </div>
                      <div style={{ direction:"rtl",fontSize:15,color:GOLD,fontFamily:"'Amiri',serif",lineHeight:1.6 }}>
                        {day.items.map(it=>it.surah.ar).join("، ").slice(0,28)}
                      </div>
                      <div style={{ fontSize:10,color:INK3,fontFamily:"'Mulish',sans-serif",marginTop:5 }}>{totalV} versets</div>
                    </button>
                  );
                })}
              </div>
              {pages>1 && (
                <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
                  <button onClick={() => setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{ ...softBtn(INK2),opacity:page===0?.4:1 }}><ChevronLeft size={13}/> Préc.</button>
                  <span style={{ fontFamily:"'Mulish',sans-serif",fontSize:11.5,color:INK2,fontWeight:700 }}>Page {page+1} / {pages}</span>
                  <button onClick={() => setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1} style={{ ...softBtn(GREEN,true),opacity:page===pages-1?.4:1 }}>Suiv. <ChevronRight size={13}/></button>
                </div>
              )}
            </div>
          )}

          {plan && dayView && (
            <div className="appear">
              <button onClick={() => setDayView(null)} style={{ ...softBtn(INK2),marginBottom:14 }}><ChevronLeft size={13}/> Retour au calendrier</button>
              <div style={{ background:SURF,border:`1px solid ${BR}`,borderRadius:16,padding:"20px 24px",marginBottom:14,boxShadow:SHADOW_S }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
                  <div>
                    <div style={{ ...eyebrow,fontSize:9.5,color:cfg.color,marginBottom:6 }}>Jour {dayView.day} — {cfg.label}</div>
                    <h3 style={{ margin:0,fontSize:22,fontWeight:600,fontFamily:"'Cormorant Garamond',serif",color:INK }}>{dayView.items.map(it=>it.surah.en).join(" + ")}</h3>
                    <p style={{ margin:"4px 0 0",fontSize:12,color:INK3,fontFamily:"'Mulish',sans-serif" }}>{dayView.items.reduce((a,it)=>a+it.verses,0)} versets à mémoriser</p>
                  </div>
                  <button onClick={() => {
                    const nowDone = !completed[dayView.day];
                    setCompleted(c=>({...c,[dayView.day]:nowDone}));
                    if(nowDone) saveProgress(`${COURSE_TITLE} — Jour ${dayView.day} : ${dayView.items.map(it=>it.surah.en).join(" + ")}`);
                  }} style={completed[dayView.day]?softBtn(GREEN,true):softBtn(INK2)}>
                    {completed[dayView.day]?<><CheckCircle size={13}/> Terminé</>:<><Square size={13}/> Marquer fait</>}
                  </button>
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
                {dayView.items.map((item,i) => {
                  const audSrc = `${reciters.find(r=>r.id===reciter).server}/${String(item.surah.n).padStart(3,"0")}.mp3`;
                  const practiceable = ALL_SURAHS.find(s=>s.n===item.surah.n);
                  return (
                    <div key={i} style={{ background:SURF,border:`1px solid ${BR}`,borderRadius:16,overflow:"hidden",boxShadow:SHADOW_S }}>
                      <div style={{ display:"flex",alignItems:"center",padding:"16px 20px",gap:14 }}>
                        <span style={{ width:42,height:42,borderRadius:11,background:GOLD_BG,border:`1px solid ${GOLD_BR}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13,fontWeight:800,color:GOLD,fontFamily:"'Mulish',sans-serif" }}>{item.surah.n}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700,fontSize:16,color:INK,fontFamily:"'Mulish',sans-serif" }}>{item.surah.en}</div>
                          <div style={{ fontSize:11,color:INK3,fontFamily:"'Mulish',sans-serif" }}>
                            {item.surah.meaning} · {item.surah.type} · {item.verses} v
                            {item.surah.fr && <span style={{ color:GOLD,marginLeft:6 }}>· {item.surah.fr}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:22,color:GOLD,fontFamily:"'Amiri',serif",direction:"rtl" }}>{item.surah.ar}</div>
                          <div style={{ ...eyebrow,fontSize:9,color:cfg.color }}>{item.part==="full"?"Complète":`v. ${item.part}`}</div>
                        </div>
                      </div>
                      <div style={{ borderTop:`1px solid ${BR2}`,padding:"14px 20px",background:SURF2 }}>
                        <AudioPlayer src={audSrc} reciterName={reciters.find(r=>r.id===reciter)?.name}/>
                        {practiceable && (
                          <button onClick={() => setVoiceSurah(practiceable)} style={{ display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${GREEN_BR}`,background:GREEN_BG,cursor:"pointer",textAlign:"left",marginTop:11 }}>
                            <span style={{ width:34,height:34,borderRadius:9,background:GREEN,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Mic size={15} color="#fff"/></span>
                            <div>
                              <div style={{ fontWeight:700,fontSize:13,color:GREEN,fontFamily:"'Mulish',sans-serif" }}>Pratiquer la récitation</div>
                              <div style={{ fontSize:11,color:INK3,fontFamily:"'Mulish',sans-serif" }}>Verset par verset — score instantané</div>
                            </div>
                            <ChevronRight size={14} color={GREEN} style={{ marginLeft:"auto" }}/>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:18,gap:10 }}>
                {dayView.day>1 ? <button onClick={() => setDayView(plan[dayView.day-2])} style={softBtn(INK2)}><ChevronLeft size={13}/> Jour {dayView.day-1}</button> : <span/>}
                {dayView.day<plan.length && <button onClick={() => setDayView(plan[dayView.day])} style={softBtn(GREEN,true)}>Jour {dayView.day+1} <ChevronRight size={13}/></button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LESSON DATA
═══════════════════════════════════════════════════════════ */
const lessons = [
  {
    id:0, title:"L'intention & la régularité", subtitle:"Le socle du Hifz", arabic:"النية والمداومة", icon:"🌱", surahNumber:null,
    pronunciation:"an-NIY-ya", verses:null, description:"Les fondements spirituels et pratiques pour mémoriser le Coran durablement.",
    lesson:`### Pourquoi l'intention change tout\nEn Islam, chaque acte commence par une intention (نية). Mémoriser le Coran « li-llah » — pour Allah — n'est pas qu'une formalité spirituelle : c'est ce qui donne à l'effort sa direction et sa durabilité. Sans intention claire, la motivation s'effrite dès les premières difficultés.\n\n### La régularité avant la quantité\n5 minutes chaque jour surpassent 2 heures une fois par semaine. Le cerveau consolide les souvenirs pendant le sommeil : mémorisez chaque soir, révisez chaque matin.\n\n### Se fixer un contrat quotidien\nDécidez d'un « contrat » minimal — par exemple : « Je lis au moins 3 versets chaque soir après Isha. » Inscrivez-le. Tenez-le même les mauvais jours.\n\n### Lier la mémorisation à une prière\nAssociez votre session de Hifz à une prière fixe (Fajr ou Isha). La prière agit comme ancre horaire et rappel spirituel simultané.\n\n### La régularité modeste bat l'intensité irrégulière.`
  },
  {
    id:1, title:"Comprendre avant de mémoriser", subtitle:"Le sens avant le son", arabic:"الفهم", icon:"🧠", surahNumber:null,
    pronunciation:"al-FAHM", verses:null, description:"L'esprit retient le sens bien mieux qu'une suite de sons.",
    lesson:`### Lire la traduction\nAvant de mémoriser, lisez le sens du passage en français. Vous saurez ce que vous dites.\n\n### Nommer le thème\nChaque passage raconte quelque chose : un récit, une promesse, une mise en garde. Donnez-lui un titre.\n\n### Visualiser\nTransformez le verset en image mentale. Une scène se retient mieux qu'une chaîne de mots.\n\n### Marquer les mots-clés\nRepérez deux ou trois mots qui résument le verset : ils deviennent vos points d'ancrage.\n\n### Un verset compris est déjà à moitié mémorisé.`
  },
  {
    id:2, title:"Écoute & répétition", subtitle:"La méthode des oreilles", arabic:"السماع والتكرار", icon:"🎧", surahNumber:114,
    pronunciation:"an-NAAS", verses:6, description:"L'oreille mémorise avant même que l'esprit conscient ne travaille.",
    lesson:`### Écouter avant de lire\nAvant de lire un verset, écoutez-le au moins 3 fois. L'oreille crée une empreinte sonore — quand vous lirez ensuite, vous reconnaîtrez, vous n'apprendrez plus.\n\n### La règle des 10 répétitions\nRépétez chaque verset 10 fois à voix haute avant de passer au suivant. En dessous de 7-8 répétitions, la trace mnésique reste fragile.\n\n### Répéter sans regarder\nAprès 5 répétitions avec le texte, couvrez la page et récitez. L'effort de rappel renforce bien plus que la simple relecture.\n\n### La voix à voix haute\nRécitez à voix haute, même en murmure. L'engagement vocal active la mémoire auditive, kinesthésique et sémantique — trois canaux au lieu d'un.\n\n### L'oreille apprend avant que l'esprit ne travaille.`
  },
  {
    id:3, title:"Techniques de mémorisation", subtitle:"Des outils concrets", arabic:"تقنيات الحفظ", icon:"🔧", surahNumber:113,
    pronunciation:"al-FA-laq", verses:5, description:"Des méthodes éprouvées pour ancrer les versets durablement.",
    lesson:`### La technique du palais de mémoire\nAssociez chaque verset à un lieu précis de votre maison : l'entrée, le couloir, la cuisine… Parcourez mentalement ce trajet en récitant.\n\n### Mémorisation par blocs\nGroupez 3-5 versets en un « bloc thématique », mémorisez le bloc, puis passez au suivant. Les blocs se connectent et forment une chaîne solide.\n\n### La répétition espacée\nRéviser aujourd'hui, demain, dans 3 jours, dans une semaine, dans un mois. Chaque révision à intervalle croissant consolide la mémoire à long terme.\n\n### Écriture active\nÉcrivez le verset à la main après l'avoir mémorisé, sans regarder. L'acte d'écriture révèle précisément où se trouvent les lacunes.\n\n### Enseigner un verset, c'est le mémoriser deux fois.`
  },
  {
    id:4, title:"Les versets qui se ressemblent", subtitle:"Ne plus les confondre", arabic:"المتشابهات", icon:"🔍", surahNumber:112,
    pronunciation:"al-ikh-LAAS", verses:4, description:"Repérer et distinguer les versets similaires pour éviter les confusions.",
    lesson:`### Le phénomène des Mutashabihat\nDe nombreux versets du Coran se ressemblent à une ou deux lettres près. Ces quasi-doublets sont l'une des principales sources d'erreur chez les Huffaz débutants.\n\n### Stratégie de comparaison directe\nQuand vous rencontrez un verset similaire à un déjà mémorisé, placez-les côte à côte. Lisez-les en alternance. Identifiez le mot ou la particule qui diffère. Répétez la différence 10 fois.\n\n### Créer des phrases-mémo\nInventez une courte phrase en français qui encode la différence. L'absurdité aide à mémoriser : elle rend l'information saillante et unique.\n\n### Révision comparative\nLors des révisions, récitez systématiquement les versets similaires l'un après l'autre. L'objectif est d'ancrer la distinction, pas seulement chaque verset isolément.\n\n### Anticiper les similitudes vaut mieux que les corriger après.`
  },
  {
    id:5, title:"Le Hifz au quotidien", subtitle:"Mémoriser sans bureau dédié", arabic:"الحفظ في الحياة اليومية", icon:"🌿", surahNumber:110,
    pronunciation:"an-NASR", verses:3, description:"Intégrer la mémorisation dans les interstices de la vie ordinaire.",
    lesson:`### Les moments volés\nLe trajet en transport, la file d'attente, la vaisselle, la marche : ces moments apparemment vides sont des fenêtres de révision idéales. Un écouteur, le récitateur en fond sonore — le Hifz progresse.\n\n### La routine du matin\nLes 20 premières minutes après le réveil sont neurologiquement favorables à la mémorisation. Le cortex préfrontal est en transition entre sommeil et éveil — état propice à l'encodage.\n\n### Afficher les versets\nCollez un verset sur le miroir de la salle de bain, sur l'écran de veille, dans le portefeuille. L'exposition répétée passive complète la mémorisation active.\n\n### Réciter pendant la prière\nIntégrez progressivement les sourates mémorisées dans vos prières. La pression douce de la récitation en prière renforce et teste simultanément.\n\n### Un jour manqué n'est pas un échec — reprendre l'est.`
  },
  {
    id:6, title:"La révision (Muraja'a)", subtitle:"Le vrai secret du Hifz", arabic:"المراجعة", icon:"♻️", surahNumber:109,
    pronunciation:"al-kaa-fi-ROUN", verses:6, description:"Sans révision, pas de Hifz durable — la Muraja'a est la moitié du travail.",
    lesson:`### La Muraja'a : définition\nLa révision systématique (المراجعة) est au Hifz ce que l'eau est à la plante : sans elle, même une mémorisation solide se dessèche et disparaît.\n\n### La règle d'or\nPour chaque page nouvellement mémorisée, prévoyez deux sessions de révision des pages déjà acquises. La mémoire durable se construit dans les révisions, pas dans l'apprentissage initial.\n\n### Système de révision en trois cercles\nCercle court (quotidien) : les 7 derniers jours. Cercle moyen (hebdomadaire) : le mois en cours. Cercle long (mensuel) : tout ce qui a été mémorisé depuis le début.\n\n### Révision à voix haute vs silencieuse\nLa révision silencieuse donne l'illusion de maîtrise. La révision à voix haute, surtout devant quelqu'un, révèle les vraies lacunes. Privilégiez toujours la voix.\n\n### La révision en prière est le test le plus honnête.`
  },
  {
    id:7, title:"Le suivi du professeur", subtitle:"On ne mémorise pas seul", arabic:"الشيخ والطالب", icon:"👤", surahNumber:null,
    pronunciation:null, verses:null, description:"Le regard d'un professeur corrige ce que l'oreille propre ne peut pas entendre.",
    lesson:`### Pourquoi un professeur est indispensable\nOn ne peut pas entendre ses propres erreurs de tajweed. Un professeur qualifié (مقرئ) capte en quelques secondes des défauts que vous n'avez jamais remarqués — et que vous ne remarquerez jamais seul.\n\n### La chaîne ininterrompue (Isnad)\nChaque récitation correcte remonte, de maître en maître, jusqu'au Prophète ﷺ. S'inscrire dans cette transmission vivante est un honneur spirituel unique au monde.\n\n### Comment trouver un professeur\nMosquées locales, plateformes en ligne (Tarteel, Quran Academy), associations islamiques — les ressources existent. Un Hafiz dans votre entourage peut aussi jouer ce rôle.\n\n### Préparer ses sessions\nVenez préparé : récitez votre leçon et vos révisions avant la séance. Le professeur affine vos acquis, il ne découvre pas vos lacunes à votre place.\n\n### Chaque correction acceptée est un verset mieux ancré.`
  },
];

const quizzes = [
  /* Chapitre 0 — L'intention & la régularité */
  {id:101,lessonId:0,q:"Quelle approche est la plus efficace pour mémoriser le Coran ?",opts:["2h une fois par semaine","5 min chaque jour","1h une fois par mois","Apprendre tout d'un coup"],ans:"5 min chaque jour"},
  {id:102,lessonId:0,q:"À quel moment de la journée la mémorisation est-elle neurologique­ment favorisée ?",opts:["Le midi","Après le sport","Juste après le réveil","Tard le soir"],ans:"Juste après le réveil"},
  {id:103,lessonId:0,q:"Que signifie 'Hifz' en arabe ?",opts:["La récitation","La mémorisation / préservation","La compréhension","La révision"],ans:"La mémorisation / préservation"},
  /* Chapitre 1 — Comprendre avant de mémoriser */
  {id:111,lessonId:1,q:"Que faut-il faire avant de mémoriser un passage ?",opts:["Le répéter 20 fois","Lire sa traduction","Écrire chaque mot","Écouter un récitateur"],ans:"Lire sa traduction"},
  {id:112,lessonId:1,q:"Donner un titre à un passage aide à :",opts:["Améliorer le tajweed","Ancrer le thème en mémoire","Connaître le nombre de versets","Rien de particulier"],ans:"Ancrer le thème en mémoire"},
  {id:113,lessonId:1,q:"Les 'mots-clés' d'un verset servent de :",opts:["Décoration","Points d'ancrage mémoriel","Aide à la prononciation","Traduction"],ans:"Points d'ancrage mémoriel"},
  /* Chapitre 2 — Écoute & répétition */
  {id:201,lessonId:2,q:"Combien de fois faut-il répéter un verset avant de passer au suivant ?",opts:["3 fois","5 fois","10 fois","20 fois"],ans:"10 fois"},
  {id:202,lessonId:2,q:"Pourquoi réciter à voix haute est-il préférable ?",opts:["C'est plus rapide","Cela active plusieurs mémoires simultanément","Cela impressionne l'entourage","Aucune raison particulière"],ans:"Cela active plusieurs mémoires simultanément"},
  {id:203,lessonId:2,q:"Quelle est l'erreur à éviter après 5 répétitions avec le texte ?",opts:["Relire encore","Couvrir la page et réciter","Prendre une pause","Écouter à nouveau"],ans:"Relire encore"},
  /* Chapitre 3 — Techniques de mémorisation */
  {id:301,lessonId:3,q:"Que propose la technique du 'palais de mémoire' ?",opts:["Mémoriser dans le silence","Associer des versets à des lieux précis","Écrire chaque verset 10 fois","Réciter en marchant"],ans:"Associer des versets à des lieux précis"},
  {id:302,lessonId:3,q:"La mémorisation par blocs consiste à :",opts:["Mémoriser verset par verset","Grouper 3-5 versets thématiques","Écrire chaque mot","Écouter sans répéter"],ans:"Grouper 3-5 versets thématiques"},
  {id:303,lessonId:3,q:"La répétition espacée vise à :",opts:["Aller plus vite","Consolider la mémoire à long terme","Mémoriser plus de versets","Éviter la fatigue"],ans:"Consolider la mémoire à long terme"},
  /* Chapitre 4 — Les versets qui se ressemblent */
  {id:401,lessonId:4,q:"Comment s'appelle le phénomène des versets similaires dans le Coran ?",opts:["Al-Mufassal","Al-Mutashabihat","Al-Mathani","Al-Muhkam"],ans:"Al-Mutashabihat"},
  {id:402,lessonId:4,q:"Quelle stratégie aide à distinguer deux versets similaires ?",opts:["Les ignorer","Les placer côte à côte et répéter la différence","Les mémoriser séparément","Changer de sourate"],ans:"Les placer côte à côte et répéter la différence"},
  /* Chapitre 5 — Le Hifz au quotidien */
  {id:501,lessonId:5,q:"Quel moment de la journée est particulièrement propice à la mémorisation ?",opts:["Après le déjeuner","Pendant le sport","Les 20 premières minutes après le réveil","La nuit profonde"],ans:"Les 20 premières minutes après le réveil"},
  {id:502,lessonId:5,q:"Intégrer les sourates mémorisées dans la prière permet de :",opts:["Mémoriser plus vite","Tester et ancrer la mémorisation","Impressionner les autres","Réduire le temps de révision"],ans:"Tester et ancrer la mémorisation"},
  /* Chapitre 6 — La révision (Muraja'a) */
  {id:601,lessonId:6,q:"Que signifie 'Muraja'a' ?",opts:["Mémorisation initiale","Révision systématique","Récitation en groupe","Correction du tajweed"],ans:"Révision systématique"},
  {id:602,lessonId:6,q:"Quelle est la règle d'or de la Muraja'a ?",opts:["Réviser 1× autant qu'on apprend","Réviser 2× plus qu'on apprend","Ne réviser que le week-end","Réviser une fois par mois"],ans:"Réviser 2× plus qu'on apprend"},
  {id:603,lessonId:6,q:"Quelle forme de révision révèle le mieux les lacunes ?",opts:["Révision silencieuse","Révision à voix haute","Révision par écrit","Révision en lisant"],ans:"Révision à voix haute"},
  /* Chapitre 7 — Le suivi du professeur */
  {id:701,lessonId:7,q:"Pourquoi un professeur de Hifz est-il indispensable ?",opts:["Pour aller plus vite","Pour corriger les erreurs qu'on ne peut pas entendre soi-même","Pour avoir un certificat","Pour accéder aux ressources"],ans:"Pour corriger les erreurs qu'on ne peut pas entendre soi-même"},
  {id:702,lessonId:7,q:"Que désigne l'isnad dans la transmission coranique ?",opts:["Un livre de règles","La chaîne ininterrompue de maîtres jusqu'au Prophète ﷺ","Un style de récitation","Un programme d'études"],ans:"La chaîne ininterrompue de maîtres jusqu'au Prophète ﷺ"},
];

/* ═══════════════════════════════════════════════════════════
   DECORATIVE KHATAM STAR
═══════════════════════════════════════════════════════════ */
function Khatam({ size=22, color=GOLD_L }) {
  const sq = { position:"absolute",inset:0,border:`1.5px solid ${color}`,borderRadius:3 };
  return (
    <span style={{ position:"relative",width:size,height:size,display:"inline-block",flexShrink:0,opacity:0.7 }}>
      <span style={sq}/>
      <span style={{ ...sq,transform:"rotate(45deg)" }}/>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Memorisation() {
  const [tab, setTab] = useState("lesson");
  const [lid, setLid] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reciter, setReciter] = useState("mishari");
  const [showPlan, setShowPlan] = useState(false);
  const [showVoicePractice, setShowVoicePractice] = useState(false);
  const [showVoiceQuiz, setShowVoiceQuiz] = useState(false);
  const layoutRef = useRef(null);

  const lesson = lessons.find(l => l.id === lid);
  const rec = reciters.find(r => r.id === reciter);
  const qList = quizzes.filter(q => q.lessonId === lid);
  const score = qList.filter(q => answers[q.id] === q.ans).length;
  const hasAud = !!lesson?.surahNumber;
  const audioSrc = hasAud ? `${rec.server}/${String(lesson.surahNumber).padStart(3,"0")}.mp3` : null;
  const surahObj = hasAud ? ALL_SURAHS.find(s => s.n === lesson.surahNumber) : null;

  function pickLesson(id) {
    setLid(id); setTab("lesson"); setSubmitted(false); setAnswers({});
    if (layoutRef.current) {
      const top = layoutRef.current.getBoundingClientRect().top + window.scrollY - 14;
      window.scrollTo({ top, behavior:"smooth" });
    }
  }

  const tabs = [
    { key:"lesson", label:"📖 Leçon" },
    { key:"quiz",   label:`Quiz · ${qList.length}` },
  ];

  return (
    <div style={{ fontFamily:"'Mulish', sans-serif", background:BG, minHeight:"100vh", color:INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Mulish:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap');
        @keyframes wave{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .appear{animation:fadeIn .32s ease both}
        *{box-sizing:border-box} button:focus{outline:none}
        ::-webkit-scrollbar{width:7px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${BR};border-radius:99px}
        .lsnbtn:hover{background:${SURF2}!important}
        .taббtn:hover{background:${SURF2}!important}
        @media(max-width:760px){
          .main-layout{grid-template-columns:1fr!important}
          .sidebar-col{position:static!important;padding-right:0!important;margin-bottom:20px}
        }
      `}</style>

      {showVoicePractice && surahObj && (
        <VoicePractice surah={surahObj} reciterId={reciter} onClose={() => setShowVoicePractice(false)}/>
      )}
      {showVoiceQuiz && lesson?.surahNumber && (
        <VoiceQuiz surahNumber={lesson.surahNumber} surahName={lesson.title} onClose={() => setShowVoiceQuiz(false)} reciterId={reciter}/>
      )}
      {showPlan && <MemoPlan onClose={() => setShowPlan(false)}/>}

      {/* ══ HEADER ══ */}
      <header style={{ background:SURF, borderBottom:`1px solid ${BR}` }}>
        <div style={{ maxWidth:1140,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:62 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <span style={{ width:40,height:40,borderRadius:12,background:GREEN_BG,border:`1px solid ${GREEN_BR}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Amiri',serif",fontSize:18,color:GREEN }}>حفظ</span>
            <div>
              <div style={{ fontSize:16,fontWeight:700,color:INK,fontFamily:"'Cormorant Garamond',serif" }}>Safoua <span style={{ color:GREEN }}>Académie</span></div>
              <div style={{ ...eyebrow,fontSize:8.5,color:INK3 }}>L'art de mémoriser le Coran</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:9 }}>
            <Link to="/quran" style={{ textDecoration:"none" }}>
              <button style={{ ...tintBtn(INK2,SURF,BR),fontSize:11.5,padding:"7px 14px" }}>
                <BookMarked size={13}/> Lire le Coran <ExternalLink size={10}/>
              </button>
            </Link>
            <button onClick={() => setShowPlan(true)} style={{ ...tintBtn(GREEN,GREEN_BG,GREEN_BR),fontSize:11.5,padding:"7px 14px" }}>
              <Calendar size={13}/> Plan Hifz
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background:"linear-gradient(180deg,#f6f2e6,#eeeada)", borderTop:`1px solid ${BR2}` }}>
          <div style={{ maxWidth:1140,margin:"0 auto",padding:"32px 24px 38px",textAlign:"center" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:14 }}>
              <span style={{ height:1,width:40,background:`linear-gradient(90deg,transparent,${GOLD_BR})` }}/>
              <Khatam size={20} color={GOLD_L}/>
              <span style={{ height:1,width:40,background:`linear-gradient(90deg,${GOLD_BR},transparent)` }}/>
            </div>
            <div style={{ ...eyebrow,fontSize:10,color:GOLD,marginBottom:10,fontFamily:"'Amiri',serif",letterSpacing:"0.2em" }}>أكاديمية الحفظ</div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:600,color:INK,lineHeight:1.1,margin:"0 0 12px" }}>
              L'art du <span style={{ color:GREEN,fontStyle:"italic" }}>Hifz</span>
            </h1>
            <p style={{ color:INK2,fontSize:14,lineHeight:1.65,maxWidth:460,margin:"0 auto",fontFamily:"'Mulish',sans-serif" }}>
              Les méthodes, techniques et habitudes pour mémoriser le Coran — et pratiquer la récitation verset par verset.
            </p>
          </div>
        </div>
      </header>

      {/* ══ MAIN LAYOUT ══ */}
      <div ref={layoutRef}
        className="main-layout"
        style={{ display:"grid",gridTemplateColumns:"248px 1fr",gap:0,maxWidth:1140,margin:"0 auto",padding:"26px 20px 90px",alignItems:"start" }}>

        {/* SIDEBAR */}
        <aside className="sidebar-col" style={{ paddingRight:20,position:"sticky",top:18 }}>
          <p style={{ ...eyebrow,fontSize:9,color:INK3,marginBottom:9 }}>Les chapitres</p>
          <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
            {lessons.map((l,i) => {
              const act = l.id === lid;
              return (
                <button key={l.id} className="lsnbtn" onClick={() => pickLesson(l.id)} style={{
                  display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",
                  padding:"10px 12px",borderRadius:11,cursor:"pointer",transition:"all .15s",
                  border:`1.5px solid ${act?GREEN_BR:"transparent"}`,
                  background:act?GREEN_D:"transparent",
                }}>
                  <span style={{ width:28,height:28,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:act?"rgba(255,255,255,0.18)":SURF2,border:`1px solid ${act?"rgba(255,255,255,0.25)":BR}`,color:act?"#fff":INK3,fontFamily:"'Mulish',sans-serif",fontWeight:800,fontSize:11 }}>{i+1}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:12.5,fontWeight:700,color:act?"#fff":INK,fontFamily:"'Mulish',sans-serif",lineHeight:1.25 }}>{l.title}</div>
                    <div style={{ fontSize:10,color:act?"rgba(255,255,255,0.65)":INK3,fontFamily:"'Mulish',sans-serif",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{l.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop:16,paddingTop:16,borderTop:`1px solid ${BR}` }}>
            <p style={{ ...eyebrow,fontSize:9,color:INK3,marginBottom:9 }}>Pratique</p>
            <button onClick={() => setShowPlan(true)} style={{
              display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 14px",
              borderRadius:13,cursor:"pointer",textAlign:"left",transition:"all .15s",
              border:`1.5px solid ${GREEN_BR}`,background:GREEN_BG,
            }}>
              <span style={{ width:32,height:32,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:GREEN }}><Calendar size={15} color="#fff"/></span>
              <div>
                <div style={{ fontSize:12.5,fontWeight:800,color:GREEN_D,fontFamily:"'Mulish',sans-serif" }}>Plan de mémorisation</div>
                <div style={{ fontSize:10,color:INK3,fontFamily:"'Mulish',sans-serif" }}>Coran complet, jour par jour</div>
              </div>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main>
          {/* Tabs */}
          <div style={{ display:"flex",gap:2,marginBottom:18,background:SURF2,borderRadius:11,padding:4,width:"fit-content",border:`1px solid ${BR}` }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",
                fontFamily:"'Mulish',sans-serif",fontWeight:700,fontSize:12,
                background:tab===t.key?SURF:"transparent",
                color:tab===t.key?GREEN:INK3,
                boxShadow:tab===t.key?SHADOW_S:"none",
                transition:"all .15s"
              }}>{t.label}</button>
            ))}
          </div>

          {/* LESSON TAB */}
          {tab==="lesson" && (
            <div style={{ display:"flex",flexDirection:"column",gap:16 }} className="appear">
              <article style={{ background:SURF,border:`1px solid ${BR}`,borderRadius:18,padding:"28px 32px",boxShadow:SHADOW }}>
                {/* Article header */}
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12 }}>
                  <div>
                    <div style={{ ...eyebrow,fontSize:9.5,color:TERRA,marginBottom:8 }}>Chapitre {lessons.findIndex(l=>l.id===lid)+1} · {lesson.subtitle}</div>
                    <h2 style={{ margin:0,fontSize:30,fontWeight:600,color:INK,fontFamily:"'Cormorant Garamond',serif",lineHeight:1.05 }}>{lesson.title}</h2>
                  </div>
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <div style={{ fontSize:32,color:GREEN,direction:"rtl",fontFamily:"'Amiri',serif",lineHeight:1.3 }}>{lesson.arabic}</div>
                    {lesson.pronunciation ? (
                      <div style={{ fontSize:11,color:TERRA,fontFamily:"'Mulish',sans-serif",fontStyle:"italic",marginTop:2,fontWeight:600 }}>{lesson.pronunciation}</div>
                    ) : lesson.verses && (
                      <span style={{ ...eyebrow,fontSize:9,color:GREEN,border:`1.5px solid ${GREEN_BR}`,background:GREEN_BG,borderRadius:20,padding:"3px 12px",display:"inline-block",marginTop:4 }}>{lesson.verses} versets</span>
                    )}
                  </div>
                </div>

                {/* Description quote */}
                <div style={{ background:SURF2,borderRadius:12,padding:"14px 20px",marginBottom:22,borderLeft:`3px solid ${TERRA}` }}>
                  <p style={{ margin:0,fontSize:16,color:INK,fontStyle:"italic",lineHeight:1.65,fontFamily:"'Cormorant Garamond',serif" }}>{lesson.description}</p>
                </div>

                {/* Lesson body */}
                <div style={{ color:INK2,lineHeight:1.9,fontSize:14,fontFamily:"'Mulish',sans-serif" }}>
                  {(() => {
                    const lines = lesson.lesson.split('\n').filter(Boolean);
                    const headings = lines.filter(l => l.startsWith('###'));
                    const isStepFormat = headings.length >= 3;
                    if (isStepFormat) {
                      return headings.map((h, hi) => {
                        const title = h.replace('### ', '');
                        const idx = lines.indexOf(h);
                        const nextIdx = lines.findIndex((l, i) => i > idx && l.startsWith('###'));
                        const body = lines.slice(idx+1, nextIdx === -1 ? undefined : nextIdx).join(' ');
                        const isLast = hi === headings.length - 1;
                        if (isLast) {
                          return (
                            <div key={hi} style={{ background:`rgba(192,98,42,0.07)`,border:`1.5px solid ${TERRA_BR}`,borderRadius:12,padding:"14px 18px",marginTop:18,display:"flex",gap:12,alignItems:"flex-start" }}>
                              <div style={{ width:32,height:32,borderRadius:9,flexShrink:0,background:TERRA,display:"flex",alignItems:"center",justifyContent:"center" }}><Star size={14} color="#fff"/></div>
                              <div>
                                <div style={{ ...eyebrow,fontSize:9,color:TERRA,marginBottom:5 }}>À retenir</div>
                                <div style={{ fontWeight:700,fontSize:14,color:INK,fontFamily:"'Mulish',sans-serif" }}>{body}</div>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={hi} style={{ display:"flex",gap:14,marginBottom:18,alignItems:"flex-start" }}>
                            <span style={{ width:30,height:30,borderRadius:9,flexShrink:0,background:GREEN_BG,border:`1.5px solid ${GREEN_BR}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:GREEN,fontFamily:"'Mulish',sans-serif",marginTop:2 }}>{hi+1}</span>
                            <div>
                              <div style={{ fontSize:14.5,fontWeight:800,color:INK,marginBottom:4,fontFamily:"'Mulish',sans-serif" }}>{title}</div>
                              <p style={{ margin:0,fontSize:13.5,color:INK2,lineHeight:1.7 }}>{body}</p>
                            </div>
                          </div>
                        );
                      });
                    }
                    return lines.map((line,i) =>
                      line.startsWith('###')
                        ? <h3 key={i} style={{ fontSize:14.5,fontWeight:800,color:INK,margin:"22px 0 7px",paddingBottom:5,borderBottom:`1px solid ${BR2}`,fontFamily:"'Mulish',sans-serif" }}>{line.replace('### ','')}</h3>
                        : <p key={i} style={{ margin:"0 0 8px" }}>{line}</p>
                    );
                  })()}
                </div>
              </article>

              {/* Audio player */}
              {hasAud && audioSrc && (
                <div style={{ background:SURF,border:`1px solid ${BR}`,borderRadius:16,padding:"20px 24px",boxShadow:SHADOW_S }}>
                  <div style={{ ...eyebrow,fontSize:9.5,color:GREEN,marginBottom:12 }}>Récitation</div>
                  <AudioPlayer key={audioSrc} src={audioSrc} label={lesson.title} reciterName={rec.name}/>
                </div>
              )}
            </div>
          )}

          {/* QUIZ TAB */}
          {tab==="quiz" && (
            <div style={{ display:"flex",flexDirection:"column",gap:14 }} className="appear">
              {qList.length>0 ? (
                <>
                  {qList.map((q,qi) => {
                    const sel = answers[q.id];
                    return (
                      <div key={q.id} style={{ background:SURF,border:`1px solid ${BR}`,borderRadius:16,padding:"22px 26px",boxShadow:SHADOW_S }}>
                        <div style={{ display:"flex",gap:13,marginBottom:16,alignItems:"flex-start" }}>
                          <span style={{ width:28,height:28,borderRadius:9,flexShrink:0,background:GREEN_BG,border:`1.5px solid ${GREEN_BR}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11.5,fontWeight:800,color:GREEN,fontFamily:"'Mulish',sans-serif",marginTop:1 }}>{qi+1}</span>
                          <p style={{ margin:0,fontSize:14.5,fontWeight:700,color:INK,lineHeight:1.5,fontFamily:"'Mulish',sans-serif" }}>{q.q}</p>
                        </div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                          {q.opts.map(opt => {
                            const isSel=sel===opt, isCorr=opt===q.ans;
                            let bg=SURF2, bdr=BR, col=INK2, fw=600;
                            if(isSel&&!submitted){bg=GREEN_BG;bdr=GREEN;col=GREEN_D;fw=700;}
                            if(submitted&&isCorr){bg=GREEN_BG;bdr=GREEN;col=GREEN_D;fw=700;}
                            if(submitted&&isSel&&!isCorr){bg=CLAY_BG;bdr=CLAY;col=CLAY;fw=700;}
                            return (
                              <button key={opt} onClick={() => !submitted&&setAnswers(a=>({...a,[q.id]:opt}))} style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:10,border:`1.5px solid ${bdr}`,background:bg,cursor:submitted?"default":"pointer",fontFamily:"'Mulish',sans-serif",fontSize:13,color:col,fontWeight:fw,transition:"all .15s" }}>
                                {submitted&&isCorr&&<CheckCircle size={12} color={GREEN}/>}
                                {submitted&&isSel&&!isCorr&&<XCircle size={12} color={CLAY}/>}
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {!submitted ? (
                    <button onClick={() => setSubmitted(true)} style={{ ...softBtn(GREEN,true),justifyContent:"center",padding:"12px" }}>
                      Terminer le test
                    </button>
                  ) : (
                    <div style={{ background:SURF,border:`1.5px solid ${GREEN_BR}`,borderRadius:18,padding:"28px",textAlign:"center",boxShadow:SHADOW }}>
                      <div style={{ fontSize:44,marginBottom:9 }}>🏆</div>
                      <h3 style={{ fontSize:22,fontWeight:600,margin:"0 0 5px",color:INK,fontFamily:"'Cormorant Garamond',serif" }}>Résultat</h3>
                      <p style={{ color:INK3,fontFamily:"'Mulish',sans-serif",margin:"0 0 20px",fontSize:11.5 }}>{lesson.title}</p>
                      <div style={{ display:"flex",justifyContent:"center",gap:14,marginBottom:20 }}>
                        {[["Score",`${score} / ${qList.length}`],["Précision",`${Math.round(score/qList.length*100)}%`]].map(([l,v]) => (
                          <div key={l} style={{ background:SURF2,border:`1px solid ${BR}`,borderRadius:12,padding:"12px 24px" }}>
                            <div style={{ ...eyebrow,fontSize:8.5,color:INK3,marginBottom:3 }}>{l}</div>
                            <div style={{ fontSize:24,fontWeight:800,color:GREEN,fontFamily:"'Mulish',sans-serif" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { setSubmitted(false); setAnswers({}); }} style={{ ...softBtn(INK2),display:"inline-flex" }}>
                        <RotateCcw size={12}/> Réessayer
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ background:SURF,border:`1.5px dashed ${BR}`,borderRadius:16,padding:"56px 30px",textAlign:"center" }}>
                  <h3 style={{ color:INK3,fontFamily:"'Mulish',sans-serif",fontSize:14,fontWeight:600 }}>Questions bientôt disponibles pour cette leçon</h3>
                </div>
              )}
            </div>
          )}

          {/* VOICE TAB */}
          {/* Lesson navigation */}
          {tab==="lesson" && (
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:18,gap:10 }}>
              {lid>0
                ? <button onClick={() => pickLesson(lessons[lessons.findIndex(l=>l.id===lid)-1].id)} style={softBtn(INK2)}><ChevronLeft size={13}/> {lessons[lessons.findIndex(l=>l.id===lid)-1].title}</button>
                : <span/>}
              {lid<lessons[lessons.length-1].id
                ? <button onClick={() => pickLesson(lessons[lessons.findIndex(l=>l.id===lid)+1].id)} style={softBtn(GREEN,true)}>{lessons[lessons.findIndex(l=>l.id===lid)+1].title} <ChevronRight size={13}/></button>
                : <button onClick={() => setShowPlan(true)} style={softBtn(GOLD,true)}>Passer au plan <ChevronRight size={13}/></button>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}