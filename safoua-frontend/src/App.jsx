import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router, Routes, Route,
  Link, useLocation, NavLink, Navigate
} from "react-router-dom";
import {
  motion, AnimatePresence, useScroll,
  useTransform, useSpring, useInView, easeOut
} from "framer-motion";
import {
  LogOut, Menu, X, Sparkles, ArrowRight,
  BookOpen, Mic, Trophy, Brain, ChevronDown, Users
} from "lucide-react";

import { isLoggedIn, getUser, logout } from "./utils/auth";
import Register      from "./components/Register";
import Courses       from "./components/Courses";
import Login         from "./components/Login";
import Dashboard     from "./components/Dashboard";
import CourseDetail  from "./components/CourseDetail";
import Footer        from "./components/Footer";
import Chatbot       from "./components/Chatbot";
import NotFound      from "./components/NotFound";
import Dictionary    from "./components/Dictionary";
import ProtectedRoute    from "./components/ProtectedRoute";
import AlphabetArabe     from "./components/courses/AlphabetArabe";
import Tajwid            from "./components/courses/Tajwid";
import Memorisation      from "./components/courses/Memorisation";
import Grammaire         from "./components/courses/Grammaire";
import Fiqh              from "./components/courses/Fiqh";
import Sira              from "./components/courses/Sira";
import Calligraphy       from "./components/courses/Calligraphy";
import BecomeMuslim      from "./components/courses/BecomeMuslim";
import ArabeModerneStandard from "./components/courses/ArabeModerneStandard";

/* ── FONTS ──────────────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');`;

/* ── PALETTE ────────────────────────────────────────────────────── */
const C = {
  bg:    "#080b0f",
  gold:  "#c9a84c",
  goldL: "#e8c97a",
  teal:  "#1db584",
  tealL: "#25d4a0",
  text:  "#f2ede6",
  muted: "rgba(242,237,230,0.4)",
  dim:   "rgba(242,237,230,0.16)",
  border:"rgba(255,255,255,0.07)",
};

/* ── TYPEWRITER HOOK ────────────────────────────────────────────── */
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const delay = deleting
      ? speed / 2
      : charIdx === current.length
      ? pause
      : speed;

    const timer = setTimeout(() => {
      if (!deleting && charIdx === current.length) {
        setDeleting(true);
      } else if (deleting && charIdx === 0) {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      } else {
        const next = charIdx + (deleting ? -1 : 1);
        setCharIdx(next);
        setDisplay(current.slice(0, next));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ── CURSOR SPARKS ──────────────────────────────────────────────── */
function CursorSparks() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rafRef    = useRef(null);
  const lastEmit  = useRef(0);
  const COLORS    = [C.gold,C.goldL,C.teal,C.tealL,"#9d7bea","#ffffff"];

  useEffect(()=>{
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const resize = ()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize();
    window.addEventListener("resize",resize);
    const onMove=(e)=>{
      const cx=e.touches?e.touches[0].clientX:e.clientX;
      const cy=e.touches?e.touches[0].clientY:e.clientY;
      const now=Date.now();
      if(now-lastEmit.current<20) return;
      lastEmit.current=now;
      for(let i=0;i<4;i++){
        const a=Math.random()*Math.PI*2;
        const sp=0.6+Math.random()*2;
        const sz=1.5+Math.random()*3.5;
        particles.current.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-0.9,size:sz,maxSize:sz,color:COLORS[Math.floor(Math.random()*COLORS.length)],life:1,decay:0.022+Math.random()*0.02,rotation:Math.random()*Math.PI*2,rotSpeed:(Math.random()-.5)*.12,shape:Math.random()>.5?"circle":"diamond"});
      }
    };
    window.addEventListener("mousemove",onMove,{passive:true});
    window.addEventListener("touchmove",onMove,{passive:true});
    const drawDiamond=(ctx,x,y,r,rot)=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot+Math.PI/4);ctx.beginPath();ctx.rect(-r/2,-r/2,r,r);ctx.restore();};
    const loop=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.current=particles.current.filter(p=>p.life>0);
      for(const p of particles.current){
        p.x+=p.vx;p.y+=p.vy;p.vy+=0.035;p.vx*=0.98;
        p.life-=p.decay;p.rotation+=p.rotSpeed;p.size=p.maxSize*p.life;
        ctx.globalAlpha=Math.max(0,p.life*0.85);
        ctx.fillStyle=p.color;
        if(p.shape==="diamond"){drawDiamond(ctx,p.x,p.y,Math.max(0.1,p.size),p.rotation);ctx.fill();}
        else{ctx.beginPath();ctx.arc(p.x,p.y,Math.max(0.1,p.size/2),0,Math.PI*2);ctx.fill();}
      }
      ctx.globalAlpha=1;
      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);
    return()=>{window.removeEventListener("resize",resize);window.removeEventListener("mousemove",onMove);window.removeEventListener("touchmove",onMove);cancelAnimationFrame(rafRef.current);};
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",mixBlendMode:"screen"}}/>;
}

/* ── PAGE TRANSITION WRAPPER ────────────────────────────────────── */
function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        exit={{ opacity:0 }}
        transition={{ duration:0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── HOME — AMBIENT BG ──────────────────────────────────────────── */
function HomeBg() {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    let W=canvas.width=window.innerWidth;
    let H=canvas.height=window.innerHeight*3;
    window.addEventListener("resize",()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight*3;});
    const pts=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+0.3,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.13,a:Math.random()*Math.PI*2}));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;p.a+=.0025;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        const alpha=(Math.sin(p.a)*.5+.5)*.45;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(201,168,76,${alpha})`;ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(raf);
  },[]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 130% 90% at 50% -5%,#0e1a0f 0%,#080b0f 45%,#06080f 100%)"}}/>
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"min(900px,120vw)",height:"50vh",background:"radial-gradient(ellipse,rgba(201,168,76,0.06) 0%,transparent 65%)",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",top:"30%",right:"-8%",width:500,height:500,background:"radial-gradient(circle,rgba(29,181,132,0.045) 0%,transparent 65%)",filter:"blur(60px)"}}/>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.022) 1px,transparent 1px)`,backgroundSize:"88px 88px"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.03,mixBlendMode:"overlay"}} xmlns="http://www.w3.org/2000/svg">
        <filter id="hn"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#hn)"/>
      </svg>
    </div>
  );
}

/* ── HOME: FEATURE CARD ─────────────────────────────────────────── */
function FeatureCard({ icon, color, title, desc, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:40 }}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.65, delay, ease:[.22,.68,0,1] }}
      whileHover={{ y:-6, transition:{ duration:0.3 } }}
      style={{ padding:"28px 24px",borderRadius:22,background:"rgba(255,255,255,0.028)",border:`1px solid ${C.border}`,backdropFilter:"blur(12px)",cursor:"default",position:"relative",overflow:"hidden" }}>
      <div style={{ width:48,height:48,borderRadius:14,background:`${color}15`,border:`1.5px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",color,marginBottom:20 }}>{icon}</div>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:C.text,marginBottom:10,letterSpacing:"-0.01em" }}>{title}</h3>
      <p style={{ color:C.muted,fontSize:13,lineHeight:1.68,fontFamily:"'DM Sans',sans-serif",fontWeight:300 }}>{desc}</p>
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${color}40,transparent)`,opacity:0.5 }}/>
    </motion.div>
  );
}

/* ── HOME: TESTIMONIAL ──────────────────────────────────────────── */
function Testimonial({ name, role, text, avatar, color, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:32 }}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.65, delay, ease:[.22,.68,0,1] }}
      style={{ padding:"24px",borderRadius:22,background:"rgba(255,255,255,0.025)",border:`1px solid ${C.border}`,backdropFilter:"blur(12px)" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:color,marginBottom:12,lineHeight:1 }}>"</div>
      <p style={{ fontSize:14,color:"rgba(242,237,230,0.6)",lineHeight:1.72,marginBottom:20,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>{text}</p>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:36,height:36,borderRadius:11,background:`${color}18`,border:`1.5px solid ${color}38`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:16,color,fontWeight:700 }}>{avatar}</div>
        <div>
          <div style={{ fontSize:13,fontWeight:600,color:C.text,fontFamily:"'DM Sans',sans-serif" }}>{name}</div>
          <div style={{ fontSize:11,color:C.dim,fontFamily:"'DM Sans',sans-serif" }}>{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── 3D FLOATING QURAN + DRAGGABLE ARABIC LETTERS ───────────────── */
const ARABIC_LETTERS = [
  { char: "ي", x: "20%",  y: "1%", size: 46, color: "#5822d7",    dur: 4.1, delay: 0 },
  { char: "ش", x: "6%",  y: "30%", size: 46, color: "#5822d7",    dur: 4.1, delay: 0 },
  { char: "س", x: "76%", y: "6%",  size: 38, color: C.teal,    dur: 3.5, delay: 0.6 },
  { char: "م", x: "80%", y: "66%", size: 52, color: "#15b94c",  dur: 5.0, delay: 0.3 },
  { char: "ا", x: "25%",  y: "75%", size: 36, color: C.tealL,   dur: 3.8, delay: 1.0 },
  { char: "ل", x: "48%", y: "2%",  size: 30, color: C.goldL,   dur: 4.6, delay: 0.8 },
  { char: "ن", x: "58%", y: "80%", size: 44, color: "#d4654a",  dur: 3.2, delay: 0.2 },
  { char: "ر", x: "88%", y: "35%", size: 34, color: C.gold,    dur: 4.3, delay: 1.2 },
  { char: "ح", x: "8%",  y: "58%", size: 40, color: C.teal,    dur: 3.9, delay: 0.5 },
  
];

function FloatingQuran() {
  const [rot, setRot] = useState({ x: -12, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const floatY = useSpring(0, { stiffness: 22, damping: 8 });

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, rot: { ...rot } };
  };
  const onTouchStart = (e) => {
    setDragging(true);
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, rot: { ...rot } };
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging || !dragStart.current) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = cx - dragStart.current.x;
      const dy = cy - dragStart.current.y;
      setRot({
        x: Math.max(-45, Math.min(45, dragStart.current.rot.x - dy * 0.35)),
        y: Math.max(-65, Math.min(65, dragStart.current.rot.y + dx * 0.35)),
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  // Idle float
  useEffect(() => {
    let up = true;
    const iv = setInterval(() => {
      if (!dragging) { floatY.set(up ? -16 : 0); up = !up; }
    }, 2000);
    return () => clearInterval(iv);
  }, [dragging, floatY]);

  return (
    <div style={{ position: "relative", width: "100%", height: 500, perspective: 1000 }}>

      {/* Floating draggable Arabic letters */}
      {ARABIC_LETTERS.map((l, i) => (
        <motion.div
          key={i}
          drag
          dragConstraints={{ left: -70, right: 70, top: -70, bottom: 70 }}
          dragElastic={0.2}
          dragMomentum={false}
          animate={{ y: [0, -(14 + i * 1.5), 0], rotate: [0, 5, -4, 0] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}
          whileDrag={{ scale: 1.3, zIndex: 30, filter: `drop-shadow(0 0 18px ${l.color})` }}
          whileHover={{ scale: 1.15 }}
          style={{
            position: "absolute",
            left: l.x, top: l.y,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: l.size,
            color: l.color,
            fontWeight: 700,
            cursor: "grab",
            userSelect: "none",
            textShadow: `0 0 20px ${l.color}55, 0 0 40px ${l.color}22`,
            zIndex: 5,
            lineHeight: 1,
          }}
        >
          {l.char}
        </motion.div>
      ))}

      {/* 3D Book wrapper */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          x: "-50%", y: floatY,
          marginTop: -110,
          cursor: dragging ? "grabbing" : "grab",
          zIndex: 10,
          transformStyle: "preserve-3d",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* Book inner — rotates on drag */}
        <div
          style={{
            width: 170,
            height: 228,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transition: dragging ? "none" : "transform 1s cubic-bezier(.22,.68,0,1)",
            position: "relative",
          }}
        >
          {/* ── FRONT COVER — black + ornate gold like reference ── */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg,#1a1a0e 0%,#0d0d07 50%,#111108 100%)",
            borderRadius: "4px 12px 12px 4px",
            transform: "translateZ(18px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(201,168,76,0.08)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {/* ── Gold ornamental border band (outer) ── */}
            <div style={{
              position:"absolute", inset:4,
              border:"2.5px solid #b8922a",
              borderRadius:9,
              pointerEvents:"none",
            }}/>
            {/* ── Decorative inner border ── */}
            <div style={{
              position:"absolute", inset:8,
              border:"1px solid rgba(201,168,76,0.45)",
              borderRadius:6,
              pointerEvents:"none",
            }}/>
            {/* ── Dense arabesque corner fill using SVG pattern ── */}
            {/* Top-left corner ornament */}
            <svg style={{position:"absolute",top:10,left:10,width:44,height:44,opacity:0.88}} viewBox="0 0 44 44">
              <g fill="none" stroke="#c9a84c" strokeWidth="0.9">
                <path d="M2 2 Q11 2 11 11 Q11 2 20 2"/>
                <path d="M2 2 Q2 11 11 11 Q2 11 2 20"/>
                <path d="M6 6 Q13 6 13 13 Q13 6 20 6"/>
                <path d="M6 6 Q6 13 13 13 Q6 13 6 20"/>
                <circle cx="11" cy="11" r="3.5" fill="#c9a84c" opacity="0.6"/>
                <circle cx="2" cy="2" r="1.2" fill="#c9a84c"/>
                <path d="M2 8 Q5 5 8 2" strokeWidth="0.6"/>
                <path d="M2 14 Q8 8 14 2" strokeWidth="0.5" opacity="0.5"/>
              </g>
            </svg>
            {/* Top-right corner ornament */}
            <svg style={{position:"absolute",top:10,right:10,width:44,height:44,opacity:0.88,transform:"scaleX(-1)"}} viewBox="0 0 44 44">
              <g fill="none" stroke="#c9a84c" strokeWidth="0.9">
                <path d="M2 2 Q11 2 11 11 Q11 2 20 2"/>
                <path d="M2 2 Q2 11 11 11 Q2 11 2 20"/>
                <path d="M6 6 Q13 6 13 13 Q13 6 20 6"/>
                <path d="M6 6 Q6 13 13 13 Q6 13 6 20"/>
                <circle cx="11" cy="11" r="3.5" fill="#c9a84c" opacity="0.6"/>
                <circle cx="2" cy="2" r="1.2" fill="#c9a84c"/>
                <path d="M2 8 Q5 5 8 2" strokeWidth="0.6"/>
                <path d="M2 14 Q8 8 14 2" strokeWidth="0.5" opacity="0.5"/>
              </g>
            </svg>
            {/* Bottom-left corner ornament */}
            <svg style={{position:"absolute",bottom:10,left:10,width:44,height:44,opacity:0.88,transform:"scaleY(-1)"}} viewBox="0 0 44 44">
              <g fill="none" stroke="#c9a84c" strokeWidth="0.9">
                <path d="M2 2 Q11 2 11 11 Q11 2 20 2"/>
                <path d="M2 2 Q2 11 11 11 Q2 11 2 20"/>
                <path d="M6 6 Q13 6 13 13 Q13 6 20 6"/>
                <path d="M6 6 Q6 13 13 13 Q6 13 6 20"/>
                <circle cx="11" cy="11" r="3.5" fill="#c9a84c" opacity="0.6"/>
                <circle cx="2" cy="2" r="1.2" fill="#c9a84c"/>
                <path d="M2 8 Q5 5 8 2" strokeWidth="0.6"/>
                <path d="M2 14 Q8 8 14 2" strokeWidth="0.5" opacity="0.5"/>
              </g>
            </svg>
            {/* Bottom-right corner ornament */}
            <svg style={{position:"absolute",bottom:10,right:10,width:44,height:44,opacity:0.88,transform:"scale(-1,-1)"}} viewBox="0 0 44 44">
              <g fill="none" stroke="#c9a84c" strokeWidth="0.9">
                <path d="M2 2 Q11 2 11 11 Q11 2 20 2"/>
                <path d="M2 2 Q2 11 11 11 Q2 11 2 20"/>
                <path d="M6 6 Q13 6 13 13 Q13 6 20 6"/>
                <path d="M6 6 Q6 13 13 13 Q6 13 6 20"/>
                <circle cx="11" cy="11" r="3.5" fill="#c9a84c" opacity="0.6"/>
                <circle cx="2" cy="2" r="1.2" fill="#c9a84c"/>
                <path d="M2 8 Q5 5 8 2" strokeWidth="0.6"/>
                <path d="M2 14 Q8 8 14 2" strokeWidth="0.5" opacity="0.5"/>
              </g>
            </svg>

            {/* ── Top horizontal arabesque band ── */}
            <svg style={{position:"absolute",top:14,left:14,right:14,width:"calc(100% - 28px)",height:16,opacity:0.7}} viewBox="0 0 142 16" preserveAspectRatio="none">
              <g fill="none" stroke="#c9a84c" strokeWidth="0.8">
                {Array.from({length:9}).map((_,i)=>(
                  <g key={i} transform={`translate(${i*16},0)`}>
                    <path d="M0 8 Q4 0 8 8 Q12 16 16 8"/>
                    <circle cx="8" cy="8" r="1.2" fill="#c9a84c" opacity="0.8"/>
                  </g>
                ))}
              </g>
            </svg>
            {/* ── Bottom horizontal arabesque band ── */}
            <svg style={{position:"absolute",bottom:14,left:14,right:14,width:"calc(100% - 28px)",height:16,opacity:0.7}} viewBox="0 0 142 16" preserveAspectRatio="none">
              <g fill="none" stroke="#c9a84c" strokeWidth="0.8">
                {Array.from({length:9}).map((_,i)=>(
                  <g key={i} transform={`translate(${i*16},0)`}>
                    <path d="M0 8 Q4 0 8 8 Q12 16 16 8"/>
                    <circle cx="8" cy="8" r="1.2" fill="#c9a84c" opacity="0.8"/>
                  </g>
                ))}
              </g>
            </svg>

            {/* ── Central oval medallion ── */}
            <div style={{
              position:"relative",
              width:110, height:130,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              zIndex:2,
            }}>
              {/* Oval border layers */}
              <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 110 130">
                <ellipse cx="55" cy="65" rx="52" ry="62" fill="#0d0d07" stroke="#c9a84c" strokeWidth="2.2"/>
                <ellipse cx="55" cy="65" rx="46" ry="56" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="0.8"/>
                <ellipse cx="55" cy="65" rx="40" ry="50" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="0.5"/>
                {/* Oval ornamental diamonds at compass points */}
                <polygon points="55,3 58,10 55,17 52,10" fill="#c9a84c" opacity="0.9"/>
                <polygon points="55,113 58,120 55,127 52,120" fill="#c9a84c" opacity="0.9"/>
                <polygon points="3,65 10,62 17,65 10,68" fill="#c9a84c" opacity="0.9"/>
                <polygon points="93,65 100,62 107,65 100,68" fill="#c9a84c" opacity="0.9"/>
                {/* Small accent dots */}
                <circle cx="55" cy="24" r="2" fill="#c9a84c" opacity="0.6"/>
                <circle cx="55" cy="106" r="2" fill="#c9a84c" opacity="0.6"/>
                <circle cx="24" cy="65" r="2" fill="#c9a84c" opacity="0.6"/>
                <circle cx="86" cy="65" r="2" fill="#c9a84c" opacity="0.6"/>
              </svg>
              {/* Inner text */}
              <div style={{position:"relative",zIndex:1,textAlign:"center",lineHeight:1.3}}>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:9, color:"rgba(201,168,76,0.7)",
                  letterSpacing:"0.1em", marginBottom:4,
                }}>بِسْمِ اللَّهِ</div>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:22, fontWeight:700,
                  color:"#d4a83a",
                  textShadow:`0 0 14px rgba(201,168,76,0.8)`,
                  lineHeight:1.1,
                }}>القرآن</div>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:11, fontWeight:600,
                  color:"rgba(201,168,76,0.8)",
                  letterSpacing:"0.06em",
                }}>الكريم</div>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:7, color:"rgba(201,168,76,0.45)",
                  letterSpacing:"0.12em",
                  marginTop:4, textTransform:"uppercase",
                }}>Al-Qur'an</div>
              </div>
            </div>

            {/* ── Shimmer light sweep ── */}
            <div style={{
              position:"absolute", inset:0,
              background:"linear-gradient(120deg,rgba(255,255,255,0.04) 0%,transparent 40%,rgba(0,0,0,0.15) 100%)",
              borderRadius:"inherit", pointerEvents:"none",
            }}/>
          </div>

          {/* ── BACK COVER — black + gold ornate ── */}
          <div style={{
            position:"absolute", inset:0,
            background:"linear-gradient(160deg,#141408 0%,#0a0a05 100%)",
            borderRadius:"4px 12px 12px 4px",
            transform:"rotateY(180deg) translateZ(18px)",
            boxShadow:"0 28px 70px rgba(0,0,0,0.85)",
          }}>
            <div style={{ position:"absolute", inset:5, border:"2px solid rgba(201,168,76,0.35)", borderRadius:8 }}/>
            <div style={{ position:"absolute", inset:9, border:"0.5px solid rgba(201,168,76,0.15)", borderRadius:6 }}/>
          </div>

          {/* ── SPINE — black + gold ── */}
          <div style={{
            position:"absolute",
            top:0, left:0,
            width:36, height:"100%",
            background:"linear-gradient(90deg,#060603,#111108 40%,#0a0a05 70%,#060603)",
            transform:"rotateY(-90deg) translateZ(0) translateX(-18px)",
            borderRadius:"4px 0 0 4px",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"inset -3px 0 10px rgba(0,0,0,0.7)",
            borderRight:"1px solid rgba(201,168,76,0.2)",
          }}>
            <div style={{
              writingMode:"vertical-rl",
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:8.5, color:"rgba(201,168,76,0.5)",
              letterSpacing:"0.2em",
              transform:"rotate(180deg)",
              textTransform:"uppercase",
            }}>القرآن الكريم</div>
          </div>

          {/* ── PAGE EDGES — cream/ivory with fine lines ── */}
          <div style={{
            position:"absolute", left:4, right:0, top:0, height:36,
            background:"linear-gradient(180deg,#f0ebe0 0%,#e2d9c4 100%)",
            transform:"rotateX(90deg) translateZ(0) translateY(-18px)",
            backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 3px)",
          }}/>
          <div style={{
            position:"absolute", left:4, right:0, bottom:0, height:36,
            background:"linear-gradient(0deg,#f0ebe0 0%,#e2d9c4 100%)",
            transform:"rotateX(-90deg) translateZ(0) translateY(18px)",
            backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 3px)",
          }}/>
          <div style={{
            position:"absolute", top:0, right:0, width:36, height:"100%",
            background:"linear-gradient(90deg,#e2d9c4,#f0ebe0 40%,#e2d9c4)",
            transform:"rotateY(90deg) translateZ(0) translateX(18px)",
            backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 3px)",
          }}/>

          {/* ── RED BOOKMARK RIBBON ── */}
          <div style={{
            position:"absolute",
            bottom:-28, right:28,
            width:10, height:56,
            background:"linear-gradient(180deg,#c0192c 0%,#8b0f1e 70%,#6b0b17 100%)",
            transform:"translateZ(16px)",
            zIndex:20,
            clipPath:"polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)",
            boxShadow:"1px 2px 8px rgba(0,0,0,0.5)",
          }}/>
        </div>
      </motion.div>

      {/* Glow pool beneath book */}
      <motion.div
        style={{ y: floatY }}
        animate={{ opacity: [0.4, 0.7, 0.4], scaleX: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{
          position:"absolute", top:"64%", left:"50%",
          transform:"translate(-50%,0)",
          width:150, height:28,
          background:`radial-gradient(ellipse,${C.gold}28,transparent 70%)`,
          filter:"blur(10px)",
          pointerEvents:"none",
        }}/>
      </motion.div>

      {/* Hint label */}
      <div style={{
        position:"absolute", bottom:8, left:"50%",
        transform:"translateX(-50%)",
        fontSize:10, color:"rgba(242,237,230,0.28)",
        fontFamily:"'DM Sans',sans-serif",
        letterSpacing:"0.1em",
        whiteSpace:"nowrap",
        userSelect:"none",
        pointerEvents:"none",
      }}>
        Glissez le livre · Déplacez les lettres
      </div>
    </div>
  );
}

/* ── HOME PAGE ──────────────────────────────────────────────────── */
const FEATURES = [
  { icon:<BookOpen size={22}/>, color:C.teal,   title:"Alphabet & Phonétique",  desc:"Maîtrisez les 28 lettres arabes avec audio natif et exercices interactifs conçus par des experts." },
  { icon:<Mic size={22}/>,      color:"#9d7bea", title:"Tajwid & Récitation",     desc:"Récitez le Coran avec perfection grâce à des cours structurés et une analyse vocale en temps réel." },
  { icon:<Brain size={22}/>,    color:C.gold,    title:"Tuteur IA 24h/24",        desc:"Un assistant intelligent répond à chaque question, adapte les exercices et guide votre progression." },
  { icon:<Trophy size={22}/>,   color:"#d4654a", title:"Gamification",            desc:"Badges, points XP, classements hebdomadaires — restez motivé à chaque étape de votre voyage." },
];

const TESTIMONIALS = [
  { name:"Yasmine B.", role:"Étudiante, Paris",      text:"J'ai appris l'alphabet en 2 semaines. Les exercices interactifs et le tuteur IA sont absolument incroyables.", avatar:"ي", color:C.teal },
  { name:"Karim M.",   role:"Étudiant, Lyon",        text:"Le cours de Tajwid a transformé ma récitation. La qualité pédagogique est au niveau des meilleures universités islamiques.", avatar:"ك", color:"#9d7bea" },
  { name:"Fatima S.",  role:"Enseignante, Marseille", text:"La plateforme la plus complète pour l'enseignement islamique. Je la recommande à tous mes élèves sans hésitation.", avatar:"ف", color:C.gold },
];

const TYPEWRITER_PHRASES = [
  "à votre rythme.",
  "avec l'IA.",
  "en famille.",
  "sans limite.",
  "avec passion.",
];

function Home() {
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY, [0,600], [0,130]);
  const heroOp = useTransform(scrollY, [0,500], [1,0]);

  const featRef    = useRef(null);
  const featInView = useInView(featRef, { once:true, margin:"-80px" });
  const testRef    = useRef(null);
  const testInView = useInView(testRef, { once:true, margin:"-60px" });

  // Typewriter
  const typed = useTypewriter(TYPEWRITER_PHRASES, 75, 1900);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",position:"relative",overflowX:"hidden" }}>
      <HomeBg/>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{ minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",zIndex:1,overflow:"hidden" }}>
        {/* Parallax Arabic glyph background */}
        <motion.div style={{ y:heroY,position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:0 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(260px,38vw,580px)",color:"rgba(201,168,76,0.025)",lineHeight:1,userSelect:"none",letterSpacing:"-0.06em" }}>بسم</span>
        </motion.div>

        <motion.div style={{ opacity:heroOp,position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"120px 24px 80px",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center" }} className="hero-grid">

          {/* Left: text */}
          <div>
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:easeOut}}
              style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:99,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.28)",fontSize:11,fontWeight:600,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:28 }}>
              <Sparkles size={11}/> Plateforme Islamique · MERN + IA
            </motion.div>

            <motion.h1
              initial={{opacity:0,y:32}} animate={{opacity:1,y:0}}
              transition={{duration:0.9,delay:0.1,ease:[.22,.68,0,1]}}
              style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.6rem,5.5vw,4.2rem)",fontWeight:700,lineHeight:1.06,color:C.text,marginBottom:22,letterSpacing:"-0.03em" }}>
              Apprenez le Quran<br/>& l'Arabe{" "}
              {/* Typewriter phrase */}
              <em style={{
                fontStyle:"italic",
                background:`linear-gradient(135deg,${C.goldL} 0%,${C.tealL} 100%)`,
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
                display:"inline-block",
                minWidth:"2ch",
                position:"relative",
              }}>
                {typed}
                {/* blinking cursor */}
                <motion.span
                  animate={{ opacity:[1,0,1] }}
                  transition={{ duration:0.9, repeat:Infinity, ease:"steps(1)" }}
                  style={{
                    display:"inline-block",
                    width:3, height:"0.85em",
                    background:C.gold,
                    marginLeft:3,
                    verticalAlign:"middle",
                    borderRadius:2,
                  }}
                />
              </em>
            </motion.h1>

            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.22,ease:easeOut}}
              style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:C.muted,lineHeight:1.75,marginBottom:38,maxWidth:460 }}>
              Rejoignez Safoua Academy pour un apprentissage guidé par des experts, enrichi par l'intelligence artificielle.
            </motion.p>

            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.34,ease:easeOut}}
              style={{ display:"flex",gap:12,flexWrap:"wrap",marginBottom:52 }}>
              <Link to="/register" style={{ textDecoration:"none" }}>
                <motion.button whileHover={{scale:1.04,boxShadow:`0 0 44px rgba(201,168,76,0.45)`}} whileTap={{scale:0.97}}
                  style={{ display:"flex",alignItems:"center",gap:9,padding:"14px 28px",borderRadius:14,background:`linear-gradient(135deg,${C.gold},${C.teal})`,color:"#080b0f",border:"none",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:`0 0 28px rgba(201,168,76,0.28)`,transition:"box-shadow 0.3s" }}>
                  Commencer gratuitement <ArrowRight size={16}/>
                </motion.button>
              </Link>
              <Link to="/courses" style={{ textDecoration:"none" }}>
                <motion.button whileHover={{background:"rgba(255,255,255,0.09)"}} whileTap={{scale:0.97}}
                  style={{ padding:"14px 28px",borderRadius:14,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.78)",border:`1px solid ${C.border}`,fontWeight:600,fontSize:15,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"background 0.2s" }}>
                  Voir les cours
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8,delay:0.5}}
              style={{ display:"flex",gap:36,paddingTop:28,borderTop:`1px solid ${C.border}` }}>
              {[["9","Cours"],["4k+","Étudiants"],["98%","Réussite"]].map(([val,lbl])=>(
                <div key={lbl}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:700,color:C.gold,lineHeight:1 }}>{val}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:3 }}>{lbl}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Quran + floating letters */}
          <motion.div
            initial={{ opacity:0, x:40 }}
            animate={{ opacity:1, x:0 }}
            transition={{ duration:1, delay:0.3, ease:[.22,.68,0,1] }}
            style={{ position:"relative", height:500, display:"flex", alignItems:"center", justifyContent:"center" }}
          >
            <FloatingQuran />
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{y:[0,9,0]}} transition={{duration:2.2,repeat:Infinity,ease:"easeInOut"}}
          style={{ position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:7,opacity:0.3,zIndex:1 }}>
          <span style={{ fontSize:9,fontWeight:600,letterSpacing:"0.18em",color:C.gold,textTransform:"uppercase" }}>Défiler</span>
          <ChevronDown size={13} color={C.gold}/>
        </motion.div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════ */}
      <section ref={featRef} style={{ padding:"110px 24px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:1120,margin:"0 auto" }}>
          <motion.div initial={{opacity:0,y:30}} animate={featInView?{opacity:1,y:0}:{}} transition={{duration:0.7,ease:easeOut}} style={{ textAlign:"center",marginBottom:64 }}>
            <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.2em",color:C.gold,textTransform:"uppercase",marginBottom:14 }}>Pourquoi Safoua</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.2rem)",fontWeight:700,color:C.text,lineHeight:1.08,letterSpacing:"-0.025em",marginBottom:14 }}>
              Une plateforme pensée<br/><em style={{ fontStyle:"italic",color:C.gold }}>pour votre voyage spirituel</em>
            </h2>
            <p style={{ color:C.muted,fontSize:15,maxWidth:420,margin:"0 auto",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.65 }}>
              Chaque cours, chaque outil — conçu pour vous rapprocher du Coran et de la langue arabe.
            </p>
          </motion.div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:18 }}>
            {FEATURES.map((f,i)=><FeatureCard key={i} {...f} delay={i*0.1}/>)}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
      <section ref={testRef} style={{ padding:"80px 24px 100px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:1120,margin:"0 auto" }}>
          <motion.div initial={{opacity:0,y:20}} animate={testInView?{opacity:1,y:0}:{}} transition={{duration:0.65}} style={{ textAlign:"center",marginBottom:52 }}>
            <div style={{ fontSize:10,fontWeight:700,letterSpacing:"0.2em",color:"#9d7bea",textTransform:"uppercase",marginBottom:12 }}>Témoignages</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:700,color:C.text,letterSpacing:"-0.025em" }}>
              Ils ont transformé leur apprentissage
            </h2>
          </motion.div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16 }}>
            {TESTIMONIALS.map((t,i)=><Testimonial key={i} {...t} delay={i*0.12}/>)}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════ */}
      <section style={{ padding:"80px 24px 120px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:700,margin:"0 auto" }}>
          <motion.div
            initial={{opacity:0,y:40,scale:0.97}}
            whileInView={{opacity:1,y:0,scale:1}}
            viewport={{once:true,margin:"-80px"}}
            transition={{duration:0.7,ease:[.22,.68,0,1]}}
            style={{ padding:"56px 48px",borderRadius:32,background:`linear-gradient(135deg,rgba(201,168,76,0.06) 0%,rgba(29,181,132,0.04) 100%)`,border:`1px solid rgba(201,168,76,0.16)`,backdropFilter:"blur(24px)",textAlign:"center",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:"-40%",left:"50%",transform:"translateX(-50%)",width:500,height:500,background:`radial-gradient(circle,${C.gold}08,transparent 65%)`,pointerEvents:"none" }}/>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:52,color:`${C.gold}40`,marginBottom:10,lineHeight:1 }}>بسم الله</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:700,color:C.text,marginBottom:16,letterSpacing:"-0.025em" }}>
              Prêt à commencer votre voyage ?
            </h2>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",color:C.muted,fontSize:16,marginBottom:38,lineHeight:1.7,maxWidth:420,margin:"0 auto 38px" }}>
              Rejoignez des milliers d'étudiants qui apprennent l'arabe et le Coran sur Safoua Academy.
            </p>
            <Link to="/register" style={{ textDecoration:"none" }}>
              <motion.button whileHover={{scale:1.04,boxShadow:`0 0 48px rgba(201,168,76,0.5)`}} whileTap={{scale:0.97}}
                style={{ padding:"15px 40px",borderRadius:16,background:`linear-gradient(135deg,${C.gold},${C.teal})`,color:"#080b0f",border:"none",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:`0 0 28px rgba(201,168,76,0.3)`,transition:"box-shadow 0.3s" }}>
                S'inscrire gratuitement →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ── NAVBAR ─────────────────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const loggedIn  = isLoggedIn();
  const user      = getUser();
  const userRole  = user?.role;
  const darkPages  = ["/", "/courses"];
  const alwaysDark = darkPages.some(p=>p==="/"?location.pathname==="/":location.pathname.startsWith(p));
  useEffect(()=>{ setMenuOpen(false); },[location.pathname]);
  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>24);
    window.addEventListener("scroll",onScroll,{passive:true});
    onScroll();
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);
  const handleLogout = () => logout();
  const transparent = alwaysDark && !scrolled;
  const navBg = (!alwaysDark&&scrolled)?"rgba(255,255,255,0.97)":transparent?"transparent":alwaysDark?"rgba(8,11,15,0.88)":"rgba(255,255,255,0.97)";
  const textColor = alwaysDark?"rgba(242,237,230,0.72)":"#475569";
  const logoColor = alwaysDark?"#f2ede6":"#0f172a";
  const navLinkStyle=({isActive})=>({fontSize:13,fontWeight:600,textDecoration:"none",color:isActive?C.gold:textColor,borderBottom:isActive?`2px solid ${C.gold}`:"2px solid transparent",paddingBottom:2,transition:"color 0.15s",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.02em"});
  const roleBadge=userRole==="teacher"?<span style={{fontSize:9,fontWeight:700,background:"rgba(157,123,234,0.18)",color:"#9d7bea",border:"1px solid rgba(157,123,234,0.3)",borderRadius:99,padding:"2px 7px",marginLeft:6}}>Enseignant</span>:userRole==="student"?<span style={{fontSize:9,fontWeight:700,background:"rgba(29,181,132,0.12)",color:C.teal,border:`1px solid rgba(29,181,132,0.28)`,borderRadius:99,padding:"2px 7px",marginLeft:6}}>Étudiant</span>:null;
  return (
    <>
      <motion.nav
        initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.7,ease:[.22,.68,0,1]}}
        style={{ position:"fixed",top:0,left:0,right:0,zIndex:50,height:70,display:"flex",alignItems:"center",padding:"0 24px",background:navBg,borderBottom:scrolled?`1px solid ${C.border}`:"1px solid transparent",backdropFilter:transparent?"none":"blur(22px)",WebkitBackdropFilter:transparent?"none":"blur(22px)",transition:"background 0.35s,border-color 0.35s" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <Link to="/" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:10 }}>
            <motion.div whileHover={{scale:1.08}} style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.gold},${C.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:"#080b0f",boxShadow:alwaysDark?`0 0 16px ${C.gold}40`:"none" }}>س</motion.div>
            <span style={{ fontSize:17,fontWeight:700,color:logoColor,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"-0.01em" }}>Safoua Academy</span>
          </Link>
          <div style={{ display:"flex",alignItems:"center",gap:28 }} className="hidden-mobile">
            <NavLink to="/" end style={navLinkStyle}>Accueil</NavLink>
            <NavLink to="/courses" style={navLinkStyle}>Cours</NavLink>
            <NavLink to="/dictionary" style={navLinkStyle}>Dictionnaire</NavLink>
            <div style={{ width:1,height:16,background:alwaysDark?"rgba(255,255,255,0.1)":"#e2e8f0" }}/>
            {loggedIn?(
              <>
                <div style={{ display:"flex",alignItems:"center" }}><NavLink to="/dashboard" style={navLinkStyle}>Mon Espace</NavLink>{roleBadge}</div>
                <motion.button whileHover={{background:"rgba(212,101,74,0.18)"}} onClick={handleLogout}
                  style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:"rgba(212,101,74,0.08)",color:"#d4654a",border:"1px solid rgba(212,101,74,0.2)",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"background 0.2s" }}>
                  <LogOut size={13}/> Déconnexion
                </motion.button>
              </>
            ):(
              <>
                <NavLink to="/login" style={navLinkStyle}>Connexion</NavLink>
                <Link to="/register" style={{ textDecoration:"none" }}>
                  <motion.button whileHover={{scale:1.04,boxShadow:`0 0 20px ${C.gold}40`}} whileTap={{scale:0.97}}
                    style={{ padding:"8px 18px",borderRadius:10,background:`linear-gradient(135deg,${C.gold},${C.teal})`,color:"#080b0f",border:"none",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                    S'inscrire
                  </motion.button>
                </Link>
              </>
            )}
          </div>
          <button onClick={()=>setMenuOpen(o=>!o)} className="show-mobile" style={{ background:"none",border:"none",color:alwaysDark?"rgba(242,237,230,0.8)":"#0f172a",cursor:"pointer",padding:6,display:"none" }}>
            {menuOpen?<X size={22}/>:<Menu size={22}/>}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.22}}
            style={{ position:"fixed",top:70,left:0,right:0,zIndex:49,background:"rgba(8,11,15,0.97)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,padding:"12px 24px 20px" }}>
            {[{label:"Accueil",to:"/"},{label:"Cours",to:"/courses"},{label:"Dictionnaire",to:"/dictionary"},...(loggedIn?[{label:"Mon Espace",to:"/dashboard"}]:[{label:"Connexion",to:"/login"},{label:"S'inscrire",to:"/register"}])].map((l,i)=>(
              <Link key={i} to={l.to} onClick={()=>setMenuOpen(false)}
                style={{ display:"block",padding:"13px 0",fontSize:15,fontWeight:600,color:"rgba(242,237,230,0.75)",textDecoration:"none",borderBottom:`1px solid ${C.border}`,fontFamily:"'DM Sans',sans-serif" }}>
                {l.label}
              </Link>
            ))}
            {loggedIn&&<button onClick={handleLogout} style={{ marginTop:12,background:"none",border:"none",color:"#d4654a",fontWeight:600,fontSize:15,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif" }}>Déconnexion</button>}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{FONTS + `
        * { box-sizing: border-box; }
        ::selection { background: rgba(201,168,76,0.22); color: #f2ede6; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080b0f; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.22); border-radius: 99px; }
        .hidden-mobile { display: flex !important; }
        .show-mobile   { display: none  !important; }
        @media (max-width: 767px) {
          .hidden-mobile { display: none  !important; }
          .show-mobile   { display: block !important; }
          .hero-grid     { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

/* ── APP ────────────────────────────────────────────────────────── */
function AppInner() {
  const location = useLocation();
  const loggedIn = isLoggedIn();
  return (
    <div style={{ minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column" }}>
      <CursorSparks/>
      <Navbar/>
      <main style={{ flex:1 }}>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path="/"          element={<Home/>}/>
            <Route path="/courses"   element={<Courses/>}/>
            <Route path="/login"     element={loggedIn ? <Navigate to="/dashboard" replace/> : <Login/>}/>
            <Route path="/register"  element={loggedIn ? <Navigate to="/dashboard" replace/> : <Register/>}/>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            <Route path="/course-view/1" element={<ProtectedRoute><AlphabetArabe/></ProtectedRoute>}/>
            <Route path="/course-view/2" element={<ProtectedRoute><Tajwid/></ProtectedRoute>}/>
            <Route path="/course-view/3" element={<ProtectedRoute><Memorisation/></ProtectedRoute>}/>
            <Route path="/course-view/4" element={<ProtectedRoute><Grammaire/></ProtectedRoute>}/>
            <Route path="/course-view/5" element={<ProtectedRoute><Fiqh/></ProtectedRoute>}/>
            <Route path="/course-view/6" element={<ProtectedRoute><Sira/></ProtectedRoute>}/>
            <Route path="/course-view/7" element={<ProtectedRoute><Calligraphy/></ProtectedRoute>}/>
            <Route path="/course-view/8" element={<ProtectedRoute><BecomeMuslim/></ProtectedRoute>}/>
            <Route path="/course-view/9" element={<ProtectedRoute><ArabeModerneStandard/></ProtectedRoute>}/>
            <Route path="/course-view/:id" element={<ProtectedRoute><CourseDetail/></ProtectedRoute>}/>
            <Route path="/dictionary"    element={<ProtectedRoute><Dictionary/></ProtectedRoute>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </PageTransition>
      </main>
      <Footer/>
      <Chatbot/>
    </div>
  );
}

export default function App() {
  return <Router><AppInner/></Router>;
}