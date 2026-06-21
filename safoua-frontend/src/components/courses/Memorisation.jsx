/**
 * components/courses/Memorisation.jsx — Safoua Academy
 * Redesigned: pure Hifz academy — lessons, audio, voice practice, quiz, plan.
 * The Quran browser is now a separate page (/quran).
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { api } from "../../utils/auth";
import {
  BookOpen, Play, Pause, Eye, EyeOff, CheckCircle, XCircle,
  RotateCcw, Mic, MicOff, Volume2, ChevronRight, ChevronLeft,
  Search, Brain, BookMarked, X, AlertCircle,
  Calendar, Clock, Zap, Target, CheckSquare, Square,
  SkipBack, SkipForward, Rewind, FastForward, Star,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ── PALETTE ─────────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COURSE_TITLE = "Mémorisation : Les 10 dernières Sourates";

async function saveProgress(lessonKey) {
  try { await api.post("/api/update-progress", { lessonTitle: lessonKey }); }
  catch (err) { console.error("Erreur de progression :", err); }
}

// Warm dark ink palette
const D1 = "#09080a";
const D2 = "#100f13";
const D3 = "#171520";
const D4 = "#1d1b28";
const D5 = "#242232";
const GOLD = "#c8a45a";
const GOLD2 = "#a8843a";
const GOLD_L = "#e8c97a";
const GOLD_BG = "rgba(200,164,90,0.1)";
const GOLD_BR = "rgba(200,164,90,0.24)";
const TEAL = "#1a9e75";
const TEAL_L = "#22d4a0";
const TEAL_DIM = "rgba(26,158,117,0.12)";
const TEAL_BR = "rgba(26,158,117,0.24)";
const CREAM = "#f0e8d8";
const T1 = "#ede8f0";
const T2 = "rgba(237,232,240,0.62)";
const T3 = "rgba(237,232,240,0.32)";
const T4 = "rgba(237,232,240,0.12)";
const BR1 = "rgba(200,164,90,0.14)";
const BR2 = "rgba(237,232,240,0.07)";
const RED = "#e05050";
const RED_DIM = "rgba(224,80,80,0.1)";
const BLUE = "#5080d0";
const BLUE_DIM = "rgba(80,128,208,0.12)";
const PUR = "#a080d8";
const PUR_DIM = "rgba(160,128,216,0.12)";

/* ── RECITERS ────────────────────────────────────────────────── */
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

/* ── HELPERS ─────────────────────────────────────────────────── */
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

/* ── AUDIO HOOK ──────────────────────────────────────────────── */
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
    ref.current.pause(); ref.current.currentTime=0;
    setPlaying(false); setTime(0);
  }, []);
  const seek = useCallback((t) => {
    if (!ref.current) return;
    ref.current.currentTime=Math.max(0,Math.min(t,dur||9999));
    setTime(ref.current.currentTime);
  }, [dur]);
  const skip = useCallback((d) => { if(ref.current) seek(ref.current.currentTime+d); }, [seek]);
  return { playing, time, dur, loading, toggle, stop, seek, skip };
}

/* ── AUDIO PLAYER COMPONENT ──────────────────────────────────── */
function AudioPlayer({ src, label, reciterName }) {
  const { playing, time, dur, loading, toggle, stop, seek, skip } = useAudio(src);
  const fmt = s => isFinite(s)&&s>0 ? `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}` : "0:00";
  const pct = dur > 0 ? (time/dur)*100 : 0;
  const handleBar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX-r.left)/r.width)*(dur||0));
  };

  return (
    <div style={{ background:D4, border:`1px solid ${BR1}`, borderRadius:12, padding:"14px 16px" }}>
      {label && (
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
          <div style={{ width:7,height:7,borderRadius:"50%", background:playing?TEAL:T3, boxShadow:playing?`0 0 7px ${TEAL}`:"none", transition:"all .3s" }}/>
          <span style={{ fontSize:9, fontWeight:700, color:TEAL, letterSpacing:"0.14em", fontFamily:"system-ui" }}>{label}</span>
          {reciterName && <span style={{ fontSize:9, color:T3, fontFamily:"system-ui", marginLeft:"auto" }}>{reciterName}</span>}
        </div>
      )}
      <div onClick={handleBar} style={{ position:"relative", height:4, borderRadius:99, background:T4, cursor:"pointer", marginBottom:10 }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${GOLD2},${GOLD})`, borderRadius:99, transition:"width .1s", boxShadow:`0 0 6px ${GOLD}50` }}/>
        <div style={{ position:"absolute", top:"50%", left:`${pct}%`, width:12, height:12, borderRadius:"50%", background:GOLD, border:`2px solid ${D1}`, transform:"translate(-50%,-50%)", boxShadow:`0 0 7px ${GOLD}70`, transition:"left .1s" }}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        {[[-30,<SkipBack size={11}/>],[-10,<Rewind size={11}/>]].map(([d,ic]) => (
          <button key={d} onClick={() => skip(d)} style={ctrlBtn(T3)}>{ic}</button>
        ))}
        <button onClick={toggle} style={{
          width:38,height:38,borderRadius:"50%",
          background:playing?TEAL_DIM:GOLD, border:`1.5px solid ${playing?TEAL:GOLD}`,
          color:playing?TEAL:D1, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0, transition:"all .2s", boxShadow:playing?`0 0 14px ${TEAL}40`:`0 2px 10px ${GOLD}40`
        }}>
          {loading
            ? <div style={{width:12,height:12,border:`2px solid currentColor`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
            : playing ? <Pause size={13} fill="currentColor"/> : <Play size={13} fill="currentColor" style={{marginLeft:2}}/>}
        </button>
        {[[10,<FastForward size={11}/>],[30,<SkipForward size={11}/>]].map(([d,ic]) => (
          <button key={d} onClick={() => skip(d)} style={ctrlBtn(T3)}>{ic}</button>
        ))}
        <button onClick={stop} style={{ ...ctrlBtn(RED), marginLeft:"auto" }}>
          <div style={{ width:8,height:8,borderRadius:2,background:"currentColor" }}/>
        </button>
        <span style={{ fontSize:10,color:T3,fontFamily:"monospace",marginLeft:4 }}>{fmt(time)} / {fmt(dur)}</span>
      </div>
      {playing && (
        <div style={{ display:"flex",gap:2,alignItems:"center",justifyContent:"center",marginTop:8 }}>
          {[3,5,7,9,12,9,7,5,3,5,7,9,12,9,7,5,3].map((h,i) => (
            <div key={i} style={{ width:2,height:h,borderRadius:99,background:GOLD,opacity:0.3+(h/12)*0.5,animation:`wave ${0.35+i*0.04}s ease-in-out infinite alternate` }}/>
          ))}
        </div>
      )}
    </div>
  );
}

function ctrlBtn(col) {
  return { width:28,height:28,borderRadius:7,background:T4,border:`1px solid ${BR2}`,color:col,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s" };
}
function primaryBtn(col=GOLD, outline=false) {
  return { display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:9,border:`1.5px solid ${col}`,background:outline?"transparent":col==="GOLD"?GOLD_BG:TEAL_DIM,color:col,fontFamily:"system-ui",fontWeight:700,fontSize:12,cursor:"pointer",transition:"all .15s" };
}

function ProgressBar({ current, total, color }) {
  return (
    <div style={{ display:"flex",gap:2,marginBottom:14 }}>
      {Array.from({length:Math.min(total,40)}).map((_,i) => (
        <div key={i} style={{ flex:1,height:3,borderRadius:99,background:i<current?color:i===current?`${color}50`:T4,transition:"background .3s" }}/>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   VOICE PRACTICE MODAL
══════════════════════════════════════════════════════════════ */
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

  const startRec = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Use Google Chrome for voice recognition."); return; }
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
      const pct = Math.round(s*100);
      setScore(pct);
      setHistory(h => [...h,{ar:cur.ar,said:transcript,score:pct}]);
    }
  }, [step]);

  const next = () => {
    if (idx < (lines?.length||0)-1) { setIdx(i=>i+1); setStep("practice"); setTranscript(""); setScore(null); }
    else setStep("done");
  };
  const avg = history.length ? Math.round(history.reduce((a,h)=>a+h.score,0)/history.length) : 0;
  const scoreCol = s => s>=75?TEAL:s>=50?GOLD:RED;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,5,0.88)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)" }}>
      <div style={{ background:D2,border:`1px solid ${BR1}`,borderRadius:20,width:"100%",maxWidth:600,maxHeight:"90vh",overflow:"auto",boxShadow:`0 32px 80px rgba(0,0,0,.7),0 0 40px ${GOLD}08` }}>
        {/* Header */}
        <div style={{ background:D3,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BR2}`,borderRadius:"20px 20px 0 0" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:TEAL_DIM,border:`1px solid ${TEAL_BR}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Mic size={15} color={TEAL}/>
            </div>
            <div>
              <div style={{ fontWeight:700,fontSize:15,color:T1,fontFamily:"'Cormorant Garamond',serif" }}>Pratique vocale — {surah.en}</div>
              <div style={{ fontSize:9,color:T3,fontFamily:"system-ui",letterSpacing:"0.1em" }}>{surah.ar} · {surah.fr && <span style={{ color:TEAL }}>({surah.fr})</span>} · {surah.verses} versets</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
            <button onClick={() => setShowPron(v=>!v)} style={{ display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:7,border:`1px solid rgba(160,128,216,${showPron?.4:.18})`,background:showPron?PUR_DIM:"transparent",color:showPron?PUR:T3,fontFamily:"system-ui",fontWeight:700,fontSize:9,cursor:"pointer" }}>
              {showPron?<Eye size={9}/>:<EyeOff size={9}/>} PRON
            </button>
            <button onClick={onClose} style={{ background:T4,border:`1px solid ${BR2}`,borderRadius:7,color:T2,cursor:"pointer",padding:"6px 9px" }}><X size={13}/></button>
          </div>
        </div>

        <div style={{ padding:22 }}>
          {!ready && (
            <div style={{ textAlign:"center",padding:50 }}>
              <div style={{ width:30,height:30,border:`2px solid ${TEAL_DIM}`,borderTopColor:TEAL,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 12px" }}/>
              <p style={{ color:T3,fontFamily:"system-ui",fontSize:12 }}>{loading?"Chargement des versets...":"Chargement des prononciations..."}</p>
            </div>
          )}

          {ready && lines && lines.length===0 && (
            <div style={{ textAlign:"center",padding:40 }}>
              <p style={{ color:T2,fontFamily:"system-ui" }}>Unable to load verses.</p>
              <button onClick={onClose} style={primaryBtn(TEAL)}>Close</button>
            </div>
          )}

          {/* INTRO */}
          {ready && lines && lines.length>0 && step==="intro" && (
            <div>
              {bas && (
                <div style={{ background:GOLD_BG,border:`1px solid ${GOLD_BR}`,borderRadius:10,padding:"10px 16px",marginBottom:14,textAlign:"center" }}>
                  <div style={{ fontSize:8,color:GOLD,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.12em",marginBottom:5 }}>BASMALA</div>
                  <p style={{ fontSize:20,direction:"rtl",fontFamily:"'Cormorant Garamond',serif",color:T1,margin:0,lineHeight:1.9 }}>{bas.ar}</p>
                </div>
              )}
              <div style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:12,padding:14,marginBottom:16 }}>
                <AudioPlayer src={audioSrc} label="Écouter d'abord" reciterName={rec.name}/>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:18,maxHeight:260,overflowY:"auto" }}>
                {lines.slice(0,10).map((l,i) => (
                  <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:9,padding:"9px 12px",background:D3,border:`1px solid ${BR2}`,borderRadius:8 }}>
                    <div style={{ width:20,height:20,borderRadius:"50%",background:TEAL_DIM,border:`1px solid ${TEAL_BR}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:4 }}>
                      <span style={{ fontSize:8,fontWeight:700,color:TEAL,fontFamily:"system-ui" }}>{i+1}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:16,fontFamily:"'Cormorant Garamond',serif",color:T1,direction:"rtl",display:"block",lineHeight:1.9 }}>{l.ar}</span>
                      {showPron && prons[i] && <span style={{ fontSize:10,color:PUR,fontFamily:"system-ui",fontStyle:"italic",display:"block",marginTop:2 }}>🔊 {prons[i]}</span>}
                    </div>
                  </div>
                ))}
                {lines.length>10 && <p style={{ color:T3,fontSize:10,textAlign:"center",fontFamily:"system-ui" }}>...et {lines.length-10} autres versets</p>}
              </div>
              <button onClick={() => setStep("practice")} style={{ ...primaryBtn(TEAL),width:"100%",justifyContent:"center" }}>
                Commencer la pratique →
              </button>
            </div>
          )}

          {/* PRACTICE */}
          {ready && lines && (step==="practice"||step==="record") && cur && (
            <div>
              <ProgressBar current={idx} total={lines.length} color={TEAL}/>
              <div style={{ background:D3,border:`1.5px solid ${BR1}`,borderRadius:12,padding:18,marginBottom:14,textAlign:"center" }}>
                <div style={{ fontSize:8,color:TEAL,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.14em",marginBottom:8 }}>VERSET {idx+1} / {lines.length}</div>
                <p style={{ fontSize:24,direction:"rtl",fontFamily:"'Cormorant Garamond',serif",color:T1,margin:"0 0 10px",lineHeight:1.9 }}>{cur.ar}</p>
                {curPron && (
                  <button onClick={() => setShowPron(v=>!v)} style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 11px",borderRadius:20,border:`1px solid rgba(160,128,216,${showPron?.35:.2})`,background:showPron?PUR_DIM:"transparent",color:showPron?PUR:T3,fontFamily:"system-ui",fontSize:9,fontWeight:700,cursor:"pointer",marginBottom:showPron?6:0 }}>
                    {showPron?<Eye size={8}/>:<EyeOff size={8}/>} {showPron?"Masquer":"Voir"} prononciation
                  </button>
                )}
                {showPron && curPron && <div style={{ display:"inline-block",background:PUR_DIM,border:`1px solid rgba(160,128,216,.2)`,borderRadius:20,padding:"2px 11px",fontSize:11,color:PUR,fontStyle:"italic",fontFamily:"system-ui",marginLeft:6 }}>{curPron}</div>}
              </div>
              <div style={{ marginBottom:14 }}>
                <AudioPlayer src={audioSrc} label="Récitation" reciterName={rec.name}/>
              </div>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontFamily:"system-ui",fontSize:11,color:T3,marginBottom:10 }}>Récitez ce verset en arabe :</p>
                {!recording ? (
                  <button onClick={startRec} style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"12px 26px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${RED},#a03030)`,color:"white",fontFamily:"system-ui",fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:`0 4px 18px rgba(224,80,80,0.3)` }}>
                    <Mic size={16}/> Appuyer pour réciter
                  </button>
                ) : (
                  <button onClick={() => { recRef.current?.stop(); setRecording(false); }} style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"12px 26px",borderRadius:11,border:"none",background:"#601818",color:"white",fontFamily:"system-ui",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    <MicOff size={16}/> Arrêter
                  </button>
                )}
                {recording && (
                  <div style={{ marginTop:10 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:5,justifyContent:"center",marginBottom:5 }}>
                      <div style={{ width:7,height:7,borderRadius:"50%",background:RED,animation:"pulse 1s ease-in-out infinite" }}/>
                      <p style={{ fontFamily:"system-ui",fontSize:10,color:RED,margin:0 }}>En écoute...</p>
                    </div>
                    {transcript && <p style={{ direction:"rtl",fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:T1,padding:"7px 12px",background:D4,borderRadius:7,border:`1px solid ${BR1}` }}>{transcript}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESULT */}
          {ready && lines && step==="result" && cur && (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:82,height:82,borderRadius:"50%",background:D3,border:`3px solid ${scoreCol(score)}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:`0 0 22px ${scoreCol(score)}25` }}>
                <span style={{ fontSize:22,fontWeight:900,color:scoreCol(score),fontFamily:"system-ui" }}>{score}%</span>
              </div>
              <p style={{ fontWeight:700,fontFamily:"system-ui",fontSize:14,color:T1,marginBottom:14 }}>
                {score>=75?"🌟 Maasha Allah ! Excellent !":score>=50?"👍 Bien, continuez !":"🎧 Écoutez et réessayez"}
              </p>
              <div style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:10,padding:12,textAlign:"left",marginBottom:16 }}>
                <div style={{ fontSize:8,color:TEAL,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.12em",marginBottom:3 }}>VERSET CORRECT</div>
                <p style={{ fontSize:19,direction:"rtl",fontFamily:"'Cormorant Garamond',serif",color:T1,margin:"0 0 4px",lineHeight:1.9 }}>{cur.ar}</p>
                {curPron && <p style={{ fontSize:10,fontFamily:"system-ui",color:PUR,margin:0,fontStyle:"italic" }}>🔊 {curPron}</p>}
                {transcript && (<>
                  <div style={{ fontSize:8,color:scoreCol(score),fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.12em",margin:"10px 0 3px" }}>VOTRE RÉPONSE</div>
                  <p style={{ fontSize:14,direction:"rtl",fontFamily:"'Cormorant Garamond',serif",color:T2,margin:0,padding:"6px 10px",background:D4,borderRadius:6 }}>{transcript}</p>
                </>)}
              </div>
              <div style={{ display:"flex",gap:8,justifyContent:"center" }}>
                <button onClick={() => { setStep("practice"); setTranscript(""); setScore(null); setHistory(h=>h.slice(0,-1)); }} style={primaryBtn(T2,true)}>
                  <RotateCcw size={12}/> Réessayer
                </button>
                <button onClick={next} style={primaryBtn(TEAL)}>
                  {idx<lines.length-1?"Suivant →":"Terminer"}
                </button>
              </div>
            </div>
          )}

          {/* DONE */}
          {ready && lines && step==="done" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:52,marginBottom:12 }}>{avg>=75?"🏆":avg>=50?"🥈":"📚"}</div>
              <h3 style={{ fontSize:19,fontWeight:900,fontFamily:"'Cormorant Garamond',serif",color:T1,margin:"0 0 5px" }}>Session terminée !</h3>
              <div style={{ display:"flex",justifyContent:"center",gap:10,margin:"16px 0" }}>
                {[["Score moyen",`${avg}%`],["Versets",`${history.length}`],["Réussis",`${history.filter(h=>h.score>=75).length}`]].map(([l,v]) => (
                  <div key={l} style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:10,padding:"9px 14px" }}>
                    <div style={{ fontSize:8,color:T3,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.1em",marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:18,fontWeight:900,color:TEAL,fontFamily:"system-ui" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:8,justifyContent:"center" }}>
                <button onClick={() => { setStep("intro"); setIdx(0); setHistory([]); setTranscript(""); setScore(null); }} style={primaryBtn(TEAL)}>Recommencer</button>
                <button onClick={onClose} style={primaryBtn(T2,true)}>Fermer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   VOICE QUIZ MODAL
══════════════════════════════════════════════════════════════ */
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

  function startRec() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Use Chrome."); return; }
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
  const scoreCol = s => s>=75?TEAL:s>=50?GOLD:RED;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,5,0.88)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)" }}>
      <div style={{ background:D2,border:`1px solid ${BR1}`,borderRadius:20,width:"100%",maxWidth:560,maxHeight:"90vh",overflow:"auto",boxShadow:`0 24px 80px rgba(0,0,0,.7)` }}>
        <div style={{ background:`linear-gradient(135deg,#0d0f20,#151828)`,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid rgba(80,128,208,0.2)`,borderRadius:"20px 20px 0 0" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,color:T1 }}>
            <div style={{ width:34,height:34,borderRadius:9,background:BLUE_DIM,border:"1px solid rgba(80,128,208,.3)",display:"flex",alignItems:"center",justifyContent:"center" }}><Brain size={15} color={BLUE}/></div>
            <div>
              <div style={{ fontWeight:700,fontSize:14,fontFamily:"'Cormorant Garamond',serif" }}>Quiz Vocal — {surahName}</div>
              <div style={{ fontSize:9,color:T3,letterSpacing:"0.1em" }}>TESTEZ VOTRE MÉMORISATION</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:T4,border:`1px solid ${BR2}`,borderRadius:7,color:T2,cursor:"pointer",padding:"5px 9px" }}><X size={13}/></button>
        </div>

        <div style={{ padding:22 }}>
          {!ready && (
            <div style={{ textAlign:"center",padding:46 }}>
              <div style={{ width:26,height:26,border:`2px solid ${BLUE_DIM}`,borderTopColor:BLUE,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 10px" }}/>
              <p style={{ color:T3,fontFamily:"system-ui",fontSize:11 }}>{loading?"Chargement des versets...":"Chargement des prononciations..."}</p>
            </div>
          )}

          {ready && phase==="intro" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:12 }}>🧠</div>
              <h3 style={{ fontSize:17,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",color:T1,margin:"0 0 14px" }}>Quiz de Mémorisation Vocale</h3>
              <div style={{ marginBottom:14 }}><AudioPlayer src={audioSrc} label="Écouter d'abord" reciterName={rec.name}/></div>
              <button onClick={() => setPhase("prompt")} style={{ background:BLUE,color:"white",border:"none",borderRadius:10,padding:"11px 28px",fontFamily:"system-ui",fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:`0 4px 18px rgba(80,128,208,.3)` }}>
                Commencer →
              </button>
            </div>
          )}

          {ready && lines && (phase==="prompt"||phase==="record") && q && (
            <div>
              <ProgressBar current={qIdx} total={lines.length} color={BLUE}/>
              <div style={{ textAlign:"center",marginBottom:16 }}>
                <div style={{ fontSize:8,color:T3,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.12em",marginBottom:6 }}>VERSET {qIdx+1} / {lines.length}</div>
                <div style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:12,padding:"16px 20px" }}>
                  <div style={{ background:GOLD_BG,border:`1px solid ${GOLD_BR}`,borderRadius:7,padding:"6px 12px",display:"inline-block",marginBottom:10 }}>
                    <span style={{ fontSize:8,color:GOLD,fontFamily:"system-ui",fontWeight:700,display:"block",marginBottom:2 }}>INDICE — DÉBUT DU VERSET</span>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:GOLD,direction:"rtl" }}>{q.hint}</span>
                  </div>
                  {curPron && (
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                      <button onClick={() => setShowPron(v=>!v)} style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,border:`1px solid rgba(160,128,216,${showPron?.35:.18})`,background:showPron?PUR_DIM:"transparent",color:showPron?PUR:T3,fontFamily:"system-ui",fontSize:9,fontWeight:700,cursor:"pointer" }}>
                        {showPron?<Eye size={8}/>:<EyeOff size={8}/>} {showPron?"Masquer aide":"🔊 Aide prononciation"}
                      </button>
                      {showPron && <span style={{ fontSize:10,color:PUR,fontFamily:"system-ui",fontStyle:"italic",background:PUR_DIM,border:`1px solid rgba(160,128,216,.2)`,borderRadius:20,padding:"2px 9px" }}>{curPron}</span>}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginBottom:14 }}><AudioPlayer src={audioSrc} label="Recitation aid" reciterName={rec.name}/></div>
              <div style={{ textAlign:"center" }}>
                {!recording ? (
                  <button onClick={startRec} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"12px 26px",borderRadius:11,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${RED},#a03030)`,color:"white",fontFamily:"system-ui",fontWeight:700,fontSize:13,boxShadow:`0 4px 18px rgba(224,80,80,.3)` }}>
                    <Mic size={16}/> Appuyer pour réciter
                  </button>
                ) : (
                  <button onClick={() => { recogRef.current?.stop(); setRecording(false); }} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"12px 26px",borderRadius:11,border:"none",cursor:"pointer",background:"#601818",color:"white",fontFamily:"system-ui",fontWeight:700,fontSize:13 }}>
                    <MicOff size={16}/> Terminer
                  </button>
                )}
                {recording && (
                  <div style={{ marginTop:9 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:5,justifyContent:"center",marginBottom:5 }}>
                      <div style={{ width:7,height:7,borderRadius:"50%",background:RED,animation:"pulse 1s ease-in-out infinite" }}/>
                      <p style={{ fontFamily:"system-ui",fontSize:10,color:RED,margin:0 }}>En écoute...</p>
                    </div>
                    {transcript && <p style={{ direction:"rtl",fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:T1,marginTop:6,padding:"6px 11px",background:D4,borderRadius:7 }}>{transcript}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {ready && phase==="result" && q && (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:80,height:80,borderRadius:"50%",background:D3,border:`3px solid ${scoreCol(lineScore)}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:`0 0 20px ${scoreCol(lineScore)}25` }}>
                <span style={{ fontSize:21,fontWeight:900,color:scoreCol(lineScore),fontFamily:"system-ui" }}>{lineScore}%</span>
              </div>
              <h3 style={{ fontSize:14,fontWeight:700,fontFamily:"system-ui",color:T1,margin:"0 0 12px" }}>
                {lineScore>=75?"✅ Maasha Allah !":lineScore>=50?"🟡 Presque !":"❌ Révisez ce verset."}
              </h3>
              <div style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:10,padding:12,textAlign:"left",marginBottom:16 }}>
                <div style={{ fontSize:8,color:TEAL,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.1em",marginBottom:3 }}>VERSET CORRECT</div>
                <div style={{ fontSize:17,direction:"rtl",fontFamily:"'Cormorant Garamond',serif",color:T1,lineHeight:1.9 }}>{q.ar}</div>
                {prons[qIdx] && <div style={{ fontSize:10,color:PUR,marginTop:3,fontFamily:"system-ui",fontStyle:"italic" }}>🔊 {prons[qIdx]}</div>}
                <div style={{ fontSize:8,color:scoreCol(lineScore),fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.1em",margin:"9px 0 3px" }}>VOTRE RÉPONSE</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,direction:"rtl",color:T2,background:D4,padding:"6px 10px",borderRadius:6 }}>{transcript||"(rien détecté)"}</div>
              </div>
              <div style={{ display:"flex",gap:8,justifyContent:"center" }}>
                <button onClick={() => { setPhase("prompt"); setTranscript(""); setLineScore(null); setShowPron(false); setResults(r=>r.slice(0,-1)); }} style={primaryBtn(T2,true)}>
                  <RotateCcw size={12}/> Réessayer
                </button>
                <button onClick={next} style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"9px 18px",background:BLUE,border:"none",color:"white",borderRadius:9,fontFamily:"system-ui",fontWeight:700,fontSize:12,cursor:"pointer" }}>
                  {qIdx<(lines?.length||0)-1?"Suivant":"Terminer"} <ChevronRight size={12}/>
                </button>
              </div>
            </div>
          )}

          {ready && phase==="done" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:52,marginBottom:12 }}>{avg>=75?"🏆":avg>=50?"🥈":"📚"}</div>
              <h3 style={{ fontSize:18,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",color:T1,margin:"0 0 3px" }}>Quiz Terminé !</h3>
              <div style={{ display:"flex",justifyContent:"center",gap:12,margin:"16px 0" }}>
                {[["Score",`${avg}%`],["Versets",`${results.length}`],["Réussis",`${results.filter(r=>r.score>=75).length}`]].map(([l,v]) => (
                  <div key={l} style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:10,padding:"10px 16px" }}>
                    <div style={{ fontSize:8,color:T3,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.1em",marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:18,fontWeight:900,color:TEAL,fontFamily:"system-ui" }}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => { setPhase("intro"); setQIdx(0); setResults([]); }} style={primaryBtn(BLUE)}>Recommencer le Quiz</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── PLAN GENERATOR ──────────────────────────────────────────── */
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

/* ── MEMO PLAN MODAL ─────────────────────────────────────────── */
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
    slow:   { label:"Lent",   sub:"5v/j · 3 ans",   color:TEAL, icon:"🌱", days:"~1 095 jours" },
    medium: { label:"Moyen",  sub:"10v/j · 1 an",   color:GOLD, icon:"⭐", days:"~365 jours" },
    fast:   { label:"Rapide", sub:"20v/j · 6 mois", color:RED,  icon:"⚡", days:"~180 jours" },
  };
  const cfg = speedCfg[speed];
  const totalDays = plan?.length||0;
  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = totalDays>0 ? Math.round((doneCount/totalDays)*100) : 0;
  const pages = plan ? Math.ceil(plan.length/PER_PAGE) : 0;
  const visible = plan ? plan.slice(page*PER_PAGE,(page+1)*PER_PAGE) : [];

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,5,0.9)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)" }}>
      {voiceSurah && <VoicePractice surah={voiceSurah} reciterId={reciter} onClose={() => setVoiceSurah(null)}/>}
      <div style={{ background:D2,border:`1px solid ${BR1}`,borderRadius:22,width:"100%",maxWidth:980,height:"92vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:`0 32px 80px rgba(0,0,0,.7)` }}>
        {/* Header */}
        <div style={{ background:D3,padding:"18px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BR1}`,flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:42,height:42,borderRadius:11,background:GOLD_BG,border:`1px solid ${GOLD_BR}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Calendar size={18} color={GOLD}/>
            </div>
            <div>
              <h2 style={{ margin:0,fontWeight:700,fontSize:17,fontFamily:"'Cormorant Garamond',serif",color:T1 }}>Plan de Mémorisation</h2>
              <p style={{ margin:0,fontSize:9,color:T3,fontFamily:"system-ui",letterSpacing:"0.12em" }}>خطة الحفظ · 114 SOURATES · CORAN COMPLET</p>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            {/* Progress ring */}
            <div style={{ width:42,height:42,position:"relative" }}>
              <svg viewBox="0 0 42 42" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="21" cy="21" r="17" fill="none" stroke={T4} strokeWidth="4"/>
                <circle cx="21" cy="21" r="17" fill="none" stroke={GOLD} strokeWidth="4" strokeDasharray={`${2*Math.PI*17}`} strokeDashoffset={`${2*Math.PI*17*(1-pct/100)}`} strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/>
              </svg>
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:GOLD,fontFamily:"system-ui" }}>{pct}%</div>
            </div>
            <button onClick={onClose} style={{ background:T4,border:`1px solid ${BR2}`,borderRadius:8,color:T2,cursor:"pointer",padding:"7px 10px" }}><X size={14}/></button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ background:D1,borderBottom:`1px solid ${BR2}`,padding:"9px 26px",display:"flex",alignItems:"center",gap:10,flexShrink:0,flexWrap:"wrap" }}>
          <span style={{ fontSize:8,color:T3,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.14em" }}>RYTHME</span>
          {Object.entries(speedCfg).map(([k,v]) => (
            <button key={k} onClick={() => setSpeed(k)} style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 13px",borderRadius:7,border:`1.5px solid ${speed===k?v.color:BR2}`,background:speed===k?`${v.color}14`:"transparent",color:speed===k?v.color:T3,fontFamily:"system-ui",fontWeight:700,fontSize:10,cursor:"pointer" }}>
              {v.icon} {v.label} <span style={{ opacity:.55,fontSize:9 }}>{v.sub}</span>
            </button>
          ))}
          <div style={{ width:1,height:18,background:BR1 }}/>
          {reciters.slice(0,3).map(r => (
            <button key={r.id} onClick={() => setReciter(r.id)} style={{ padding:"4px 9px",borderRadius:6,border:`1px solid ${reciter===r.id?GOLD:BR2}`,background:reciter===r.id?GOLD_BG:"transparent",color:reciter===r.id?GOLD:T3,fontFamily:"system-ui",fontWeight:600,fontSize:10,cursor:"pointer" }}>{r.short}</button>
          ))}
          <div style={{ marginLeft:"auto",background:D3,border:`1px solid ${BR1}`,borderRadius:7,padding:"4px 11px",fontSize:10,fontFamily:"system-ui",color:GOLD,fontWeight:700 }}>{cfg.days}</div>
        </div>

        {/* Body */}
        <div style={{ flex:1,overflowY:"auto",padding:"20px 26px" }}>
          {!plan && <div style={{ textAlign:"center",padding:60,color:T3 }}>Génération en cours...</div>}
          {plan && !dayView && (
            <div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:9,marginBottom:18 }}>
                {visible.map(day => {
                  const done = completed[day.day];
                  const totalV = day.items.reduce((a,it)=>a+it.verses,0);
                  return (
                    <button key={day.day} onClick={() => setDayView(day)} style={{
                      background:done?`${TEAL}0a`:D3,
                      border:`1.5px solid ${done?TEAL:BR2}`,
                      borderRadius:12,padding:"12px 14px",cursor:"pointer",textAlign:"left",
                      position:"relative",transition:"all .15s",boxShadow:done?`0 0 18px ${TEAL}12`:"none"
                    }}>
                      {done && <div style={{ position:"absolute",top:9,right:9,width:16,height:16,borderRadius:"50%",background:TEAL,display:"flex",alignItems:"center",justifyContent:"center" }}><CheckCircle size={9} color={D1}/></div>}
                      <div style={{ fontSize:8,fontFamily:"system-ui",fontWeight:800,color:cfg.color,letterSpacing:"0.12em",marginBottom:4 }}>JOUR {day.day}</div>
                      <div style={{ fontSize:12,fontWeight:700,color:T1,fontFamily:"system-ui",marginBottom:2,lineHeight:1.3 }}>
                        {day.items.map(it=>it.surah.en).join(", ").slice(0,36)}{day.items.map(it=>it.surah.en).join(", ").length>36?"…":""}
                      </div>
                      <div style={{ direction:"rtl",fontSize:12,color:GOLD,fontFamily:"'Cormorant Garamond',serif" }}>
                        {day.items.map(it=>it.surah.ar).join("، ").slice(0,26)}
                      </div>
                      <div style={{ fontSize:9,color:T3,fontFamily:"system-ui",marginTop:3 }}>{totalV} versets</div>
                    </button>
                  );
                })}
              </div>
              {pages>1 && (
                <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
                  <button onClick={() => setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{ ...primaryBtn(T2,true),opacity:page===0?.4:1 }}><ChevronLeft size={12}/> Préc.</button>
                  <span style={{ fontFamily:"system-ui",fontSize:11,color:T2,fontWeight:700 }}>Page {page+1} / {pages}</span>
                  <button onClick={() => setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1} style={{ ...primaryBtn(GOLD),opacity:page===pages-1?.4:1 }}>Suiv. <ChevronRight size={12}/></button>
                </div>
              )}
            </div>
          )}

          {plan && dayView && (
            <div>
              <button onClick={() => setDayView(null)} style={{ ...primaryBtn(T2,true),marginBottom:16 }}><ChevronLeft size={12}/> Retour</button>
              <div style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:14,padding:"18px 22px",marginBottom:14 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10 }}>
                  <div>
                    <div style={{ fontSize:9,color:cfg.color,fontFamily:"system-ui",fontWeight:700,letterSpacing:"0.12em",marginBottom:5 }}>JOUR {dayView.day} — {cfg.icon} {cfg.label.toUpperCase()}</div>
                    <h3 style={{ margin:0,fontSize:18,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",color:T1 }}>{dayView.items.map(it=>it.surah.en).join(" + ")}</h3>
                    <p style={{ margin:"3px 0 0",fontSize:11,color:T3,fontFamily:"system-ui" }}>{dayView.items.reduce((a,it)=>a+it.verses,0)} versets à mémoriser</p>
                  </div>
                  <button onClick={() => {
                    const nowDone = !completed[dayView.day];
                    setCompleted(c=>({...c,[dayView.day]:nowDone}));
                    if(nowDone) saveProgress(`${COURSE_TITLE} — Day ${dayView.day} : ${dayView.items.map(it=>it.surah.en).join(" + ")}`);
                  }} style={primaryBtn(completed[dayView.day]?TEAL:T2,!completed[dayView.day])}>
                    {completed[dayView.day]?<><CheckCircle size={12}/> Terminé</>:<><Square size={12}/> Marquer fait</>}
                  </button>
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {dayView.items.map((item,i) => {
                  const audSrc = `${reciters.find(r=>r.id===reciter).server}/${String(item.surah.n).padStart(3,"0")}.mp3`;
                  return (
                    <div key={i} style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:14,overflow:"hidden" }}>
                      <div style={{ display:"flex",alignItems:"center",padding:"14px 18px",gap:12 }}>
                        <div style={{ width:38,height:38,borderRadius:9,background:GOLD_BG,border:`1px solid ${GOLD_BR}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                          <span style={{ fontSize:11,fontWeight:900,color:GOLD,fontFamily:"system-ui" }}>{item.surah.n}</span>
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700,fontSize:14,color:T1,fontFamily:"system-ui" }}>{item.surah.en}</div>
                          <div style={{ fontSize:10,color:T3,fontFamily:"system-ui" }}>
                            {item.surah.meaning} · {item.surah.type} · {item.verses}v
                            {item.surah.fr && <span style={{ color:GOLD,marginLeft:5 }}>· {item.surah.fr}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:18,color:GOLD,fontFamily:"'Cormorant Garamond',serif",direction:"rtl" }}>{item.surah.ar}</div>
                          <div style={{ fontSize:9,color:cfg.color,fontFamily:"system-ui",fontWeight:700 }}>{item.part==="full"?"Complète":`v${item.part}`}</div>
                        </div>
                      </div>
                      <div style={{ borderTop:`1px solid ${BR2}`,padding:"12px 18px",background:D4 }}>
                        <AudioPlayer src={audSrc} reciterName={reciters.find(r=>r.id===reciter)?.name}/>
                        <div style={{ marginTop:10 }}>
                          {ALL_SURAHS.find(s=>s.n===item.surah.n) && (
                            <button onClick={() => setVoiceSurah(ALL_SURAHS.find(s=>s.n===item.surah.n))} style={{ display:"flex",alignItems:"center",gap:9,width:"100%",padding:"10px 14px",borderRadius:9,border:`1.5px solid ${TEAL}`,background:TEAL_DIM,cursor:"pointer",textAlign:"left" }}>
                              <div style={{ width:30,height:30,borderRadius:7,background:TEAL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Mic size={13} color={D1}/></div>
                              <div>
                                <div style={{ fontWeight:700,fontSize:12,color:TEAL,fontFamily:"system-ui" }}>Pratiquer la récitation</div>
                                <div style={{ fontSize:10,color:T3,fontFamily:"system-ui" }}>Récitez verset par verset — score instantané</div>
                              </div>
                              <ChevronRight size={12} color={TEAL} style={{ marginLeft:"auto" }}/>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:18,gap:10 }}>
                {dayView.day>1 && <button onClick={() => setDayView(plan[dayView.day-2])} style={primaryBtn(T2,true)}><ChevronLeft size={12}/> Jour {dayView.day-1}</button>}
                <div/>
                {dayView.day<plan.length && <button onClick={() => setDayView(plan[dayView.day])} style={primaryBtn(GOLD)}>Jour {dayView.day+1} <ChevronRight size={12}/></button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── LESSON DATA (French) ────────────────────────────────────── */
const lessons = [
  {
    id:0, title:"Introduction", subtitle:"Le Voyage du Hifz", arabic:"مقدمة", icon:"🎓", surahNumber:null,
    description:"Bienvenue dans votre parcours de mémorisation du Coran.",
    lesson:`### L'Art de la Mémorisation\nLe Hifz n'est pas une course, c'est une relation vivante avec le Livre d'Allah. Pour réussir, transformez la répétition mécanique en compréhension profonde.\n\n### Les Piliers de la Réussite\nL'Intention (Niyyah) : Pourquoi apprenez-vous ? Pour briller ou pour vous guider ? La réponse détermine votre endurance sur le long terme.\n\nLa Répétition Espacée : Il vaut mieux réviser une sourate 5 minutes tous les jours que 2 heures une fois par semaine.\n\nL'Écoute Active : La mémoire auditive est plus robuste que la mémoire visuelle. Écoutez les récitateurs avant de mémoriser.\n\n### La Méthode des 3R\nLire → Répéter → Réviser. Chaque nouveau verset doit être relié au précédent pour former des chaînes solides dans la mémoire.`
  },
  {
    id:5, title:"Al-Fatiha", subtitle:"L'Ouverture Divine", arabic:"سورة الفاتحة", icon:"⚡", surahNumber:1,
    pronunciation:"al-faa-ti-HA", verses:7, description:"La Mère du Livre — récitée 17 fois par jour dans la prière.",
    lesson:`### La Mère du Livre\nAl-Fatiha (al-faa-ti-HA) est récitée au moins 17 fois par jour dans la prière. Elle contient l'essence de tout le Coran.\n\n### Prononciation française\n• Al — comme « al » dans « album »\n• Faa — « a » long, comme « fâme »\n• ti — bref, comme « ti » dans « petit »\n• HA — le « H » est expiré (aspiré), pas silencieux\n\n### Le Dialogue Divin\nSelon un hadith du Prophète ﷺ, Allah dit : "J'ai partagé la prière entre Moi et Mon serviteur en deux moitiés." Chaque verset reçoit une réponse divine.\n\n### Structure et Sens\nLes 7 versets se divisent en deux parties : les versets 1–4 glorifient Allah, et les versets 5–7 formulent la grande demande : "Guide-nous au chemin droit."\n\n### La Seule Demande\nParmi tous les versets, un seul est une vraie supplique : "Ihdina as-sirat al-mustaqim". Tout le reste est louange et reconnaissance.`
  },
  {
    id:1, title:"An-Nas", subtitle:"Le Sanctuaire Intérieur", arabic:"سورة الناس", icon:"🛡️", surahNumber:114,
    pronunciation:"an-NAAS", verses:6, description:"Votre bouclier contre les pensées intrusives et les doutes internes.",
    lesson:`### Prononciation française\n• An — comme « an » dans « antan »\n• Naas — le « aa » est allongé, comme « naaace »\n• Accent sur la deuxième syllabe : an-NAAS\n\n### Maîtriser son Esprit\nCette sourate identifie la source principale de l'anxiété spirituelle : le "Waswas" — le murmure intérieur qui détourne du bien.\n\n### Les Trois Attributs Divins\nAllah est décrit par trois noms en séquence : Rabb (Seigneur-protecteur), Malik (Roi souverain) et Ilah (Dieu adoré). C'est une progression de la protection vers l'autorité absolue.\n\n### Le Waswas Khannas\n"Al-Khannas" signifie "celui qui se rétracte" — une description précise du doute qui disparaît quand on invoque Allah et revient dès qu'on l'oublie.\n\n### Application Pratique\nRécitez An-Nas avant de dormir, après chaque prière, et lors de pensées négatives persistantes.`
  },
  {
    id:2, title:"Al-Falaq", subtitle:"L'Aube de la Clarté", arabic:"سورة الفلق", icon:"✨", surahNumber:113,
    pronunciation:"al-FA-laq", verses:5, description:"Protection contre les maux extérieurs, l'obscurité et l'envie.",
    lesson:`### Prononciation française\n• Al — comme « al » dans « album »\n• FA — bref et net\n• laq — le « q » final est une occlusion gutturale (comme un « k » du fond de la gorge)\n• Accent sur la deuxième syllabe : al-FA-laq\n\n### Dissiper l'Obscurité\n"Al-Falaq" signifie l'aube — la lumière qui fend l'obscurité. Le terme évoque la percée soudaine de la lumière dans la nuit.\n\n### Les Quatre Protections\nLa sourate demande protection contre quatre maux précis : la création en général, la nuit obscure, la sorcellerie (nœuds soufflés), et la jalousie de l'envieux.\n\n### Al-Mu'awwidhatain\nAl-Falaq et An-Nas forment les "deux sourates de refuge". Le Prophète ﷺ les récitait chaque matin et soir, et les soufflait sur ses mains avant de dormir.\n\n### Signification du Hasad\nLa jalousie (حسد) est mentionnée séparément car elle est la source de nombreux maux humains.`
  },
  {
    id:3, title:"Al-Ikhlas", subtitle:"L'Essence de l'Unité", arabic:"سورة الإخلاص", icon:"⭐", surahNumber:112,
    pronunciation:"al-ikh-LAAS", verses:4, description:"Équivaut au tiers du Coran — la définition pure de la divinité.",
    lesson:`### Prononciation française\n• Al — comme « al » dans « album »\n• ikh — le « kh » est une fricative gutturale, comme le « j » espagnol dans « jota »\n• LAAS — « aa » allongé, comme « laaace »\n• Accent sur la troisième syllabe : al-ikh-LAAS\n\n### La Pureté Absolue\n"Ikhlas" signifie purifier son intention. Cette sourate équivaut au tiers du Coran car elle couvre le tiers doctrinal fondamental : la nature d'Allah.\n\n### Al-Samad — Le Mot Unique\n"Al-Samad" (الصمد) est l'un des mots les plus denses du Coran. Il désigne Celui qui est parfait en Lui-même et vers qui toute créature se tourne dans le besoin.\n\n### La Négation Totale\nLes deux derniers versets établissent trois négations absolues : Il n'engendre pas, n'est pas engendré, et n'a aucun égal. Chaque négation réfute une erreur théologique majeure.\n\n### Pourquoi la réciter 3 fois ?\nLe Prophète ﷺ a dit que réciter Al-Ikhlas trois fois équivaut à réciter tout le Coran.`
  },
];

const quizzes = [
  {id:101,lessonId:0,q:"Que signifie le mot 'Hifz' en arabe ?",opts:["La lecture","La mémorisation","La compréhension","La récitation"],ans:"La mémorisation"},
  {id:102,lessonId:0,q:"Quelle approche est plus efficace pour mémoriser ?",opts:["2h une fois par semaine","5 min chaque jour","1h une fois par mois","Apprendre tout d'un coup"],ans:"5 min chaque jour"},
  {id:103,lessonId:0,q:"La méthode des 3R signifie :",opts:["Réciter, Réfléchir, Relier","Lire, Répéter, Réviser","Regarder, Redire, Retenir","Rien de tout cela"],ans:"Lire, Répéter, Réviser"},
  {id:501,lessonId:5,q:"Quel est le surnom d'Al-Fatiha ?",opts:["La Dernière","La Clé","La Mère du Livre","Le Trône"],ans:"La Mère du Livre"},
  {id:502,lessonId:5,q:"Combien de versets contient Al-Fatiha ?",opts:["5","6","7","8"],ans:"7"},
  {id:503,lessonId:5,q:"Combien de fois Al-Fatiha est-elle récitée dans les 5 prières ?",opts:["10","15","17","20"],ans:"17"},
  {id:111,lessonId:1,q:"Que signifie 'Al-Khanas' ?",opts:["Le fort","Celui qui se cache / recule","Le bruyant","Le visible"],ans:"Celui qui se cache / recule"},
  {id:112,lessonId:1,q:"Combien de versets contient An-Nas ?",opts:["4","5","6","7"],ans:"6"},
  {id:113,lessonId:1,q:"Les trois attributs d'Allah dans An-Nas sont :",opts:["Rabb, Malik, Ilah","Rahman, Rahim, Malik","Ahad, Samad, Rabb","Ilah, Qadeer, Aziz"],ans:"Rabb, Malik, Ilah"},
  {id:201,lessonId:2,q:"Al-Falaq signifie :",opts:["Le crépuscule","L'aube / percée de lumière","La nuit","Le soleil"],ans:"L'aube / percée de lumière"},
  {id:202,lessonId:2,q:"Combien de maux sont mentionnés dans Al-Falaq ?",opts:["2","3","4","5"],ans:"4"},
  {id:203,lessonId:2,q:"Que signifie 'Hasad' ?",opts:["La sorcellerie","La jalousie / envie","L'obscurité","La peur"],ans:"La jalousie / envie"},
  {id:204,lessonId:2,q:"Al-Falaq et An-Nas sont appelées :",opts:["Al-Mufassal","Al-Mu'awwidhatain","Al-Mathani","Al-Kiram"],ans:"Al-Mu'awwidhatain"},
  {id:301,lessonId:3,q:"Que signifie 'Al-Samad' ?",opts:["Le Miséricordieux","L'Éternel dont tout dépend","Le Créateur","Le Pardonneur"],ans:"L'Éternel dont tout dépend"},
  {id:302,lessonId:3,q:"Al-Ikhlas équivaut à quelle fraction du Coran ?",opts:["1/4","1/3","1/2","2/3"],ans:"1/3"},
  {id:303,lessonId:3,q:"Combien de versets contient Al-Ikhlas ?",opts:["3","4","5","6"],ans:"4"},
  {id:304,lessonId:3,q:"'Lam yalid wa lam yulad' signifie :",opts:["Il est unique","Il n'a ni engendré ni été engendré","Il est éternel","Rien ne Lui ressemble"],ans:"Il n'a ni engendré ni été engendré"},
];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Memorisation() {
  const [tab, setTab] = useState("lesson");
  const [lid, setLid] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reciter, setReciter] = useState("mishari");
  const [showPlan, setShowPlan] = useState(false);
  const [showVoicePractice, setShowVoicePractice] = useState(false);
  const [showVoiceQuiz, setShowVoiceQuiz] = useState(false);

  const lesson = lessons.find(l => l.id === lid);
  const rec = reciters.find(r => r.id === reciter);
  const qList = quizzes.filter(q => q.lessonId === lid);
  const score = qList.filter(q => answers[q.id] === q.ans).length;
  const hasAud = !!lesson?.surahNumber;
  const audioSrc = hasAud ? `${rec.server}/${String(lesson.surahNumber).padStart(3,"0")}.mp3` : null;
  const surahObj = hasAud ? ALL_SURAHS.find(s => s.n === lesson.surahNumber) : null;

  function pickLesson(id) { setLid(id); setTab("lesson"); setSubmitted(false); setAnswers({}); }

  const tabs = [
    { key:"lesson", label:"📖 Leçon" },
    { key:"quiz",   label:`Quiz · ${qList.length}` },
    ...(hasAud ? [{ key:"voice", label:"🎙️ Pratique" }] : []),
  ];

  return (
    <div style={{ fontFamily:"system-ui", background:D1, minHeight:"100vh", color:T1 }}>
      <style>{`
        @keyframes wave{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}button:focus{outline:none}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${BR1};border-radius:99px}
        .lsnbtn:hover{background:${D5}!important}
        .appear{animation:fadeIn .3s ease both}
      `}</style>

      {showVoicePractice && surahObj && (
        <VoicePractice surah={surahObj} reciterId={reciter} onClose={() => setShowVoicePractice(false)}/>
      )}
      {showVoiceQuiz && lesson?.surahNumber && (
        <VoiceQuiz surahNumber={lesson.surahNumber} surahName={lesson.title} onClose={() => setShowVoiceQuiz(false)} reciterId={reciter}/>
      )}
      {showPlan && <MemoPlan onClose={() => setShowPlan(false)}/>}

      {/* ══ PAGE HEADER ══ */}
      <div style={{ background:D2, borderBottom:`1px solid ${BR1}` }}>
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:9,background:GOLD_BG,border:`1px solid ${GOLD_BR}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:GOLD }}>حفظ</div>
            <div>
              <div style={{ fontSize:14,fontWeight:700,color:T1,fontFamily:"'Cormorant Garamond',serif" }}>Académie <span style={{ color:GOLD }}>Hifz</span></div>
              <div style={{ fontSize:8,color:T3,letterSpacing:"0.14em" }}>MÉMORISER LE SAINT CORAN</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <Link to="/quran" style={{ textDecoration:"none" }}>
              <button style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 13px",borderRadius:8,border:`1px solid ${BR1}`,background:D3,color:GOLD,fontFamily:"system-ui",fontWeight:700,fontSize:11,cursor:"pointer" }}>
                <BookMarked size={12}/> Lire le Coran <ExternalLink size={10}/>
              </button>
            </Link>
            <button onClick={() => setShowPlan(true)} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 13px",borderRadius:8,border:`1px solid ${GOLD_BR}`,background:GOLD_BG,color:GOLD,fontFamily:"system-ui",fontWeight:700,fontSize:11,cursor:"pointer" }}>
              <Calendar size={12}/> Hifz Plan
            </button>
          </div>
        </div>

        {/* Hero strip */}
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"22px 22px 28px",textAlign:"center" }}>
          <div style={{ fontSize:9,letterSpacing:"0.2em",color:GOLD,textTransform:"uppercase",marginBottom:8,fontFamily:"system-ui" }}>أكاديمية الحفظ</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,4vw,34px)",fontWeight:700,color:T1,lineHeight:1.15,margin:"0 0 6px" }}>
            Académie <span style={{ color:GOLD }}>Hifz</span> — الحفظ
          </h1>
          <p style={{ color:T3,fontSize:12,lineHeight:1.6,maxWidth:440,margin:"0 auto" }}>
            Comprendre · Écouter · Mémoriser · Réciter
          </p>
        </div>
      </div>

      {/* ══ MAIN LAYOUT ══ */}
      <div style={{ display:"grid",gridTemplateColumns:"200px 1fr",gap:0,maxWidth:1100,margin:"0 auto",padding:"22px 18px 80px",alignItems:"start" }}>

        {/* SIDEBAR */}
        <aside style={{ paddingRight:16,position:"sticky",top:22 }}>
          <p style={{ fontSize:8,color:T3,letterSpacing:"0.16em",fontWeight:700,marginBottom:7,textTransform:"uppercase" }}>Parcours</p>
          {lessons.map(l => {
            const act = l.id === lid;
            return (
              <button key={l.id} className="lsnbtn" onClick={() => pickLesson(l.id)} style={{
                display:"block",width:"100%",textAlign:"left",padding:"9px 11px",borderRadius:9,
                marginBottom:3,border:act?`1.5px solid ${GOLD_BR}`:"1.5px solid transparent",
                background:act?GOLD_BG:"transparent",cursor:"pointer",transition:"all .15s"
              }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:15 }}>{l.icon}</span>
                  <div>
                    <div style={{ fontSize:11,fontWeight:700,color:act?GOLD:T2,fontFamily:"system-ui" }}>{l.title}</div>
                    <div style={{ fontSize:9,color:T3,fontFamily:"system-ui",marginTop:1 }}>{l.subtitle}</div>
                    {l.pronunciation && <div style={{ fontSize:8,color:GOLD,fontFamily:"system-ui",marginTop:1,fontStyle:"italic" }}>{l.pronunciation}</div>}
                  </div>
                </div>
              </button>
            );
          })}
          <div style={{ marginTop:12,paddingTop:12,borderTop:`1px solid ${BR2}`,display:"flex",flexDirection:"column",gap:6 }}>
            <button onClick={() => setShowPlan(true)} style={{ display:"flex",alignItems:"center",gap:6,width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${GOLD_BR}`,background:GOLD_BG,color:GOLD,fontFamily:"system-ui",fontWeight:700,fontSize:10,cursor:"pointer" }}>
              <Calendar size={11}/> Plan de Mémorisation
            </button>
            <Link to="/quran" style={{ textDecoration:"none" }}>
              <button style={{ display:"flex",alignItems:"center",gap:6,width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${BR1}`,background:"transparent",color:T2,fontFamily:"system-ui",fontWeight:700,fontSize:10,cursor:"pointer" }}>
                <BookMarked size={11}/> Lire le Coran <ExternalLink size={9}/>
              </button>
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main>
          {/* Tabs */}
          <div style={{ display:"flex",gap:3,marginBottom:16,background:D3,borderRadius:9,padding:3,width:"fit-content",border:`1px solid ${BR2}` }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:"6px 15px",borderRadius:6,border:"none",cursor:"pointer",
                fontFamily:"system-ui",fontWeight:700,fontSize:11,
                background:tab===t.key?D5:"transparent",
                color:tab===t.key?GOLD:T3,
                boxShadow:tab===t.key?`0 0 0 1px ${BR1}`:"none",
                transition:"all .15s"
              }}>{t.label}</button>
            ))}
          </div>

          {/* LESSON TAB */}
          {tab==="lesson" && (
            <div style={{ display:"flex",flexDirection:"column",gap:14 }} className="appear">
              <div style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:14,padding:"24px 26px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10 }}>
                  <div>
                    <h2 style={{ margin:0,fontSize:24,fontWeight:700,color:T1,fontFamily:"'Cormorant Garamond',serif" }}>{lesson.title}</h2>
                    <p style={{ margin:"3px 0 0",fontSize:19,color:GOLD,direction:"rtl",fontFamily:"'Cormorant Garamond',serif" }}>{lesson.arabic}</p>
                    {lesson.pronunciation && (
                      <div style={{ display:"inline-flex",alignItems:"center",gap:5,marginTop:5,background:GOLD_BG,border:`1px solid ${GOLD_BR}`,borderRadius:20,padding:"2px 11px" }}>
                        <span style={{ fontSize:9,color:T3 }}>🗣</span>
                        <span style={{ fontSize:11,color:GOLD,fontStyle:"italic",fontWeight:700 }}>{lesson.pronunciation}</span>
                      </div>
                    )}
                  </div>
                  {lesson.verses && (
                    <span style={{ fontSize:9,fontFamily:"system-ui",fontWeight:700,color:TEAL,border:`1.5px solid ${TEAL_BR}`,background:TEAL_DIM,borderRadius:20,padding:"3px 11px",letterSpacing:"0.08em" }}>{lesson.verses} VERSES</span>
                  )}
                </div>
                <div style={{ borderLeft:`3px solid ${GOLD}`,paddingLeft:14,marginBottom:18,background:D4,borderRadius:"0 9px 9px 0",padding:"10px 16px" }}>
                  <p style={{ margin:0,fontSize:13,color:T2,fontStyle:"italic",lineHeight:1.7 }}>"{lesson.description}"</p>
                </div>
                <div style={{ color:T2,lineHeight:1.95,fontSize:13 }}>
                  {lesson.lesson.split('\n').filter(Boolean).map((line,i) =>
                    line.startsWith('###')
                      ? <h3 key={i} style={{ fontSize:13,fontWeight:700,color:T1,margin:"18px 0 6px",paddingBottom:4,borderBottom:`1px solid ${BR2}` }}>{line.replace('### ','')}</h3>
                      : <p key={i} style={{ margin:"0 0 8px",color:T2 }}>{line}</p>
                  )}
                </div>
              </div>

              {hasAud && audioSrc && (
                <div style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:14,padding:"18px 22px" }}>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:12 }}>
                    {reciters.map(r => (
                      <button key={r.id} onClick={() => setReciter(r.id)} style={{ padding:"5px 12px",borderRadius:7,border:"1.5px solid",borderColor:reciter===r.id?GOLD:BR2,background:reciter===r.id?GOLD_BG:"transparent",color:reciter===r.id?GOLD:T3,fontFamily:"system-ui",fontWeight:600,fontSize:11,cursor:"pointer",transition:"all .15s" }}>{r.name}</button>
                    ))}
                  </div>
                  <AudioPlayer key={audioSrc} src={audioSrc} label={lesson.title} reciterName={rec.name}/>
                </div>
              )}

              {hasAud && (
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                  {[
                    { onClick:() => setShowVoicePractice(true), icon:<Mic size={18} color={D1}/>, bg:TEAL, col:TEAL, dim:TEAL_DIM, br:TEAL_BR, title:"🎙️ Coach Vocal", desc:"Répétez les versets, l'IA corrige votre prononciation" },
                    { onClick:() => setShowVoiceQuiz(true), icon:<Brain size={18} color="white"/>, bg:BLUE, col:BLUE, dim:BLUE_DIM, br:"rgba(80,128,208,.24)", title:"🧠 Quiz Vocal", desc:"Récitez de mémoire, testez votre Hifz" },
                  ].map((t,i) => (
                    <button key={i} onClick={t.onClick} style={{ display:"flex",alignItems:"center",gap:11,padding:"16px 18px",borderRadius:12,border:`1.5px solid ${t.dim}`,background:D3,cursor:"pointer",textAlign:"left",transition:"all .15s" }}>
                      <div style={{ width:40,height:40,borderRadius:10,background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 12px ${t.bg}30` }}>{t.icon}</div>
                      <div>
                        <div style={{ fontWeight:700,fontSize:12,color:t.col,fontFamily:"system-ui" }}>{t.title}</div>
                        <div style={{ fontSize:10,color:T3,fontFamily:"system-ui",marginTop:2,lineHeight:1.4 }}>{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button onClick={() => setShowPlan(true)} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderRadius:12,border:`1.5px solid ${GOLD_BR}`,background:D3,cursor:"pointer",textAlign:"left" }}>
                <div style={{ display:"flex",alignItems:"center",gap:11 }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 12px ${GOLD}30` }}><Calendar size={18} color={D1}/></div>
                  <div>
                    <div style={{ fontWeight:700,fontSize:13,color:GOLD,fontFamily:"system-ui" }}>Plan de Mémorisation Personnalisé</div>
                    <div style={{ fontSize:11,color:T3,fontFamily:"system-ui",marginTop:2 }}>Lent · Moyen · Rapide — Programme jour par jour pour tout le Coran</div>
                  </div>
                </div>
                <ChevronRight size={16} color={GOLD}/>
              </button>
            </div>
          )}

          {/* QUIZ TAB */}
          {tab==="quiz" && (
            <div style={{ display:"flex",flexDirection:"column",gap:12 }} className="appear">
              {qList.length>0 ? (
                <>
                  {qList.map((q,qi) => {
                    const sel = answers[q.id];
                    return (
                      <div key={q.id} style={{ background:D3,border:`1px solid ${BR1}`,borderRadius:12,padding:"20px 22px" }}>
                        <div style={{ display:"flex",gap:11,marginBottom:14,alignItems:"flex-start" }}>
                          <span style={{ width:24,height:24,borderRadius:"50%",background:GOLD_BG,border:`1.5px solid ${GOLD_BR}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:GOLD,fontFamily:"system-ui",flexShrink:0,marginTop:2 }}>{qi+1}</span>
                          <p style={{ margin:0,fontSize:14,fontWeight:700,color:T1,lineHeight:1.5,fontFamily:"system-ui" }}>{q.q}</p>
                        </div>
                        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                          {q.opts.map(opt => {
                            const isSel=sel===opt, isCorr=opt===q.ans;
                            let bg=D4, bdr=BR2, col=T2, fw=400;
                            if(isSel&&!submitted){bg=GOLD_BG;bdr=GOLD;col=GOLD;fw=700;}
                            if(submitted&&isCorr){bg=TEAL_DIM;bdr=TEAL;col=TEAL;fw=700;}
                            if(submitted&&isSel&&!isCorr){bg=RED_DIM;bdr=RED;col=RED;fw=700;}
                            return (
                              <label key={opt} onClick={() => !submitted&&setAnswers(a=>({...a,[q.id]:opt}))} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:9,border:`1.5px solid ${bdr}`,background:bg,cursor:submitted?"default":"pointer",transition:"all .15s" }}>
                                <span style={{ fontFamily:"system-ui",fontSize:13,color:col,fontWeight:fw }}>{opt}</span>
                                {submitted&&isCorr&&<CheckCircle size={14} color={TEAL}/>}
                                {submitted&&isSel&&!isCorr&&<XCircle size={14} color={RED}/>}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {!submitted ? (
                    <button onClick={() => setSubmitted(true)} style={{ width:"100%",padding:"12px",background:GOLD_BG,color:GOLD,border:`1.5px solid ${GOLD}`,borderRadius:10,fontFamily:"system-ui",fontWeight:700,fontSize:14,cursor:"pointer",letterSpacing:"0.04em" }}>
                      TERMINER LE TEST
                    </button>
                  ) : (
                    <div style={{ background:D3,border:`1.5px solid ${GOLD}`,borderRadius:14,padding:"24px",textAlign:"center" }}>
                      <div style={{ fontSize:44,marginBottom:7 }}>🏆</div>
                      <h3 style={{ fontSize:20,fontWeight:700,margin:"0 0 4px",color:T1,fontFamily:"'Cormorant Garamond',serif" }}>Résultat</h3>
                      <p style={{ color:T3,fontFamily:"system-ui",margin:"0 0 18px",fontSize:11 }}>{lesson.title}</p>
                      <div style={{ display:"flex",justifyContent:"center",gap:14,marginBottom:18 }}>
                        {[["Score",`${score} / ${qList.length}`],["Précision",`${Math.round(score/qList.length*100)}%`]].map(([l,v]) => (
                          <div key={l} style={{ background:D4,border:`1px solid ${BR1}`,borderRadius:10,padding:"10px 20px" }}>
                            <div style={{ fontSize:8,fontFamily:"system-ui",fontWeight:700,color:T3,letterSpacing:"0.12em",marginBottom:2 }}>{l}</div>
                            <div style={{ fontSize:22,fontWeight:900,color:GOLD,fontFamily:"system-ui" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { setSubmitted(false); setAnswers({}); }} style={{ display:"inline-flex",alignItems:"center",gap:6,...primaryBtn(GOLD,true) }}>
                        <RotateCcw size={12}/> Réessayer
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ background:D3,border:`1.5px dashed ${BR2}`,borderRadius:12,padding:"48px 26px",textAlign:"center" }}>
                  <h3 style={{ color:T3,fontFamily:"system-ui",fontSize:13 }}>Questions bientôt disponibles pour cette leçon</h3>
                </div>
              )}
            </div>
          )}

          {/* VOICE TAB */}
          {tab==="voice" && hasAud && (
            <div style={{ display:"flex",flexDirection:"column",gap:12 }} className="appear">
              <div style={{ background:D3,border:`1.5px solid ${BR1}`,borderRadius:14,padding:"20px 24px" }}>
                <h3 style={{ margin:"0 0 4px",fontSize:16,fontWeight:700,color:GOLD,fontFamily:"'Cormorant Garamond',serif" }}>Pratique Vocale Interactive</h3>
                <p style={{ margin:"0 0 16px",fontSize:12,color:T2,fontFamily:"system-ui",lineHeight:1.6 }}>
                  Deux modes pour maîtriser la récitation de <strong style={{ color:T1 }}>{lesson.title}</strong>
                  {lesson.pronunciation && <span style={{ color:GOLD }}> ({lesson.pronunciation})</span>}
                </p>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                  {[
                    { onClick:() => setShowVoicePractice(true), icon:<Mic size={22} color={D1}/>, bg:TEAL, col:TEAL, dim:TEAL_DIM, title:"🎙️ Coach Vocal", desc:"L'IA écoute votre récitation et corrige votre prononciation en temps réel", btn:"Commencer →" },
                    { onClick:() => setShowVoiceQuiz(true), icon:<Brain size={22} color="white"/>, bg:BLUE, col:BLUE, dim:BLUE_DIM, title:"🧠 Quiz Vocal", desc:"Récitez les versets de mémoire sans texte, l'IA évalue votre Hifz", btn:"Commencer →" },
                  ].map((t,i) => (
                    <button key={i} onClick={t.onClick} style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px",borderRadius:12,border:`1.5px solid ${t.dim}`,background:D4,cursor:"pointer",gap:8,textAlign:"center",transition:"all .15s" }}>
                      <div style={{ width:48,height:48,borderRadius:12,background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px ${t.bg}30` }}>{t.icon}</div>
                      <div style={{ fontWeight:700,fontSize:13,color:t.col,fontFamily:"system-ui" }}>{t.title}</div>
                      <div style={{ fontSize:10,color:T3,fontFamily:"system-ui",lineHeight:1.45 }}>{t.desc}</div>
                      <div style={{ background:t.bg,color:i===0?D1:"white",borderRadius:7,padding:"6px 16px",fontFamily:"system-ui",fontWeight:700,fontSize:11,marginTop:2,boxShadow:`0 2px 8px ${t.bg}30` }}>{t.btn} →</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background:GOLD_BG,border:`1px solid ${GOLD_BR}`,borderRadius:10,padding:"11px 14px",display:"flex",gap:8,alignItems:"flex-start" }}>
                <AlertCircle size={14} color={GOLD} style={{ flexShrink:0,marginTop:1 }}/>
                <div style={{ fontFamily:"system-ui",fontSize:11,color:GOLD,lineHeight:1.6 }}>
                  La reconnaissance vocale arabe fonctionne mieux dans <strong>Google Chrome</strong> sur desktop. Les tashkeel (voyelles) sont ignorés pour une évaluation plus juste.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}