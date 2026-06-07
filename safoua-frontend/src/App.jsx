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

/* ── page imports ───────────────────────────────────────────────── */
import Register      from "./components/Register";
import Courses       from "./components/Courses";
import Login         from "./components/Login";
import Dashboard     from "./components/Dashboard";
import CourseDetail  from "./components/CourseDetail";
import Footer        from "./components/Footer";
import Chatbot       from "./components/Chatbot";
import NotFound      from "./components/NotFound";
import Dictionary   from "./components/Dictionary";
import ProtectedRoute   from "./components/ProtectedRoute";
import AlphabetArabe    from "./components/courses/AlphabetArabe";
import Tajwid           from "./components/courses/Tajwid";
import Memorisation     from "./components/courses/Memorisation";
import Grammaire        from "./components/courses/Grammaire";
import Fiqh             from "./components/courses/Fiqh";
import Sira             from "./components/courses/Sira";
import Calligraphy      from "./components/courses/Calligraphy";
import BecomeMuslim     from "./components/courses/BecomeMuslim";

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
      {/* Noise */}
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
      {/* Glow on hover handled by CSS */}
      <div style={{ width:48,height:48,borderRadius:14,background:`${color}15`,border:`1.5px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",color,marginBottom:20 }}>{icon}</div>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:C.text,marginBottom:10,letterSpacing:"-0.01em" }}>{title}</h3>
      <p style={{ color:C.muted,fontSize:13,lineHeight:1.68,fontFamily:"'DM Sans',sans-serif",fontWeight:300 }}>{desc}</p>
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${color}40,transparent)`,opacity:0.5 }}/>
    </motion.div>
  );
}

/* ── HOME: PREVIEW CARD (floating hero) ─────────────────────────── */
function FloatingCard({ course, floatDuration, rotateDeg, delay, style={} }) {
  const [imgOk, setImgOk] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, scale:0.88 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ duration:0.8, delay, ease:[.22,.68,0,1] }}
      style={{ position:"absolute", borderRadius:20, overflow:"hidden", background:"rgba(13,17,23,0.85)", border:`1px solid ${course.accent}30`, backdropFilter:"blur(20px)", boxShadow:`0 24px 60px rgba(0,0,0,0.55),0 0 0 1px ${course.accent}15`, ...style }}>
      <motion.div
        animate={{ y:[0,-14,0], rotate:[rotateDeg, rotateDeg+0.5, rotateDeg] }}
        transition={{ duration:floatDuration, repeat:Infinity, ease:"easeInOut" }}>
        <div style={{ height:100, overflow:"hidden", position:"relative" }}>
          <img src={course.image} alt="" onLoad={()=>setImgOk(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", opacity:imgOk?0.5:0, transition:"opacity 0.5s" }}/>
          <div style={{ position:"absolute",inset:0,background:`linear-gradient(180deg,transparent 20%,rgba(8,11,15,0.9) 100%)` }}/>
          <div style={{ position:"absolute",bottom:10,left:12,fontFamily:"'Cormorant Garamond',serif",fontSize:12,color:course.accent,direction:"rtl",opacity:0.9 }}>{course.titleAr}</div>
        </div>
        <div style={{ padding:"12px 14px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
            <div style={{ width:26,height:26,borderRadius:7,background:`${course.accent}20`,border:`1px solid ${course.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:course.accent,fontWeight:700 }}>{course.icon}</div>
            <span style={{ fontSize:12,fontWeight:600,color:C.text,fontFamily:"'DM Sans',sans-serif" }}>{course.title}</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:10,color:C.dim,fontFamily:"'DM Sans',sans-serif" }}>{course.level}</span>
            <span style={{ display:"flex",alignItems:"center",gap:3,fontSize:10,color:C.dim,fontFamily:"'DM Sans',sans-serif" }}><Users size={9}/>{course.students}</span>
          </div>
        </div>
      </motion.div>
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

/* ── HOME PAGE ──────────────────────────────────────────────────── */
const FEATURES = [
  { icon:<BookOpen size={22}/>, color:C.teal,   title:"Alphabet & Phonétique",  desc:"Maîtrisez les 28 lettres arabes avec audio natif et exercices interactifs conçus par des experts." },
  { icon:<Mic size={22}/>,      color:"#9d7bea", title:"Tajwid & Récitation",     desc:"Récitez le Coran avec perfection grâce à des cours structurés et une analyse vocale en temps réel." },
  { icon:<Brain size={22}/>,    color:C.gold,    title:"Tuteur IA 24h/24",        desc:"Un assistant intelligent répond à chaque question, adapte les exercices et guide votre progression." },
  { icon:<Trophy size={22}/>,   color:"#d4654a", title:"Gamification",            desc:"Badges, points XP, classements hebdomadaires — restez motivé à chaque étape de votre voyage." },
];

const PREVIEW_COURSES = [
  { id:1, title:"Alphabet Arabe",  titleAr:"الحروف",  accent:C.teal,   icon:"أ", level:"Débutant",     students:"1.2k", image:"https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80" },
  { id:2, title:"Tajwid Sacré",    titleAr:"التجويد", accent:"#9d7bea", icon:"ت", level:"Intermédiaire", students:"850",  image:"https://images.unsplash.com/photo-1564349683136-77e08bef1ef1?auto=format&fit=crop&w=600&q=80" },
  { id:3, title:"Mémorisation",    titleAr:"الحفظ",   accent:C.gold,   icon:"س", level:"Tous niveaux",  students:"3.4k", image:"https://images.unsplash.com/photo-1584281723509-a16997486420?auto=format&fit=crop&w=600&q=80" },
];

const TESTIMONIALS = [
  { name:"Yasmine B.", role:"Étudiante, Paris",     text:"J'ai appris l'alphabet en 2 semaines. Les exercices interactifs et le tuteur IA sont absolument incroyables.", avatar:"ي", color:C.teal },
  { name:"Karim M.",   role:"Étudiant, Lyon",       text:"Le cours de Tajwid a transformé ma récitation. La qualité pédagogique est au niveau des meilleures universités islamiques.", avatar:"ك", color:"#9d7bea" },
  { name:"Fatima S.",  role:"Enseignante, Marseille",text:"La plateforme la plus complète pour l'enseignement islamique. Je la recommande à tous mes élèves sans hésitation.", avatar:"ف", color:C.gold },
];

function Home() {
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY, [0,600], [0,130]);
  const heroOp = useTransform(scrollY, [0,500], [1,0]);

  const featRef = useRef(null);
  const featInView = useInView(featRef, { once:true, margin:"-80px" });

  const testRef = useRef(null);
  const testInView = useInView(testRef, { once:true, margin:"-60px" });

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",position:"relative",overflowX:"hidden" }}>
      <HomeBg/>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{ minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",zIndex:1,overflow:"hidden" }}>
        {/* Parallax Arabic glyph */}
        <motion.div style={{ y:heroY,position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:0 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(260px,38vw,580px)",color:"rgba(201,168,76,0.025)",lineHeight:1,userSelect:"none",letterSpacing:"-0.06em" }}>بسم</span>
        </motion.div>

        <motion.div style={{ opacity:heroOp,position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"120px 24px 80px",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center" }} className="hero-grid">

          {/* Left */}
          <div>
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:easeOut}}
              style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:99,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.28)",fontSize:11,fontWeight:600,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:28 }}>
              <Sparkles size={11}/> Plateforme Islamique · MERN + IA
            </motion.div>

            <motion.h1 initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.9,delay:0.1,ease:[.22,.68,0,1]}}
              style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.6rem,5.5vw,4.2rem)",fontWeight:700,lineHeight:1.06,color:C.text,marginBottom:22,letterSpacing:"-0.03em" }}>
              Apprenez le Coran<br/>& l'Arabe{" "}
              <em style={{ fontStyle:"italic",background:`linear-gradient(135deg,${C.goldL} 0%,${C.tealL} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>à votre rythme.</em>
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

          {/* Right: floating cards */}
          <div style={{ position:"relative",height:500,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <FloatingCard course={PREVIEW_COURSES[0]} floatDuration={3.8} rotateDeg={-2} delay={0.3} style={{ width:230,top:"5%",left:"5%" }}/>
            <FloatingCard course={PREVIEW_COURSES[1]} floatDuration={4.5} rotateDeg={2}  delay={0.5} style={{ width:250,top:"28%",right:"0%" }}/>
            <FloatingCard course={PREVIEW_COURSES[2]} floatDuration={3.2} rotateDeg={-1} delay={0.7} style={{ width:220,bottom:"5%",left:"15%" }}/>
            {/* Central glow orb */}
            <div style={{ position:"absolute",width:180,height:180,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}12,transparent 70%)`,filter:"blur(30px)",zIndex:-1 }}/>
          </div>
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
  const isLoggedIn = !!localStorage.getItem("username");
  const userRole   = localStorage.getItem("userRole");
  const darkPages  = ["/", "/courses"];
  const alwaysDark = darkPages.some(p=>p==="/"?location.pathname==="/":location.pathname.startsWith(p));
  useEffect(()=>{ setMenuOpen(false); },[location.pathname]);
  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>24);
    window.addEventListener("scroll",onScroll,{passive:true});
    onScroll();
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);
  const handleLogout=()=>{ localStorage.removeItem("username");localStorage.removeItem("userEmail");localStorage.removeItem("userRole");window.location.href="/"; };
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
            {isLoggedIn?(
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
            {[{label:"Accueil",to:"/"},{label:"Cours",to:"/courses"},{label:"Dictionnaire",to:"/dictionary"},...(isLoggedIn?[{label:"Mon Espace",to:"/dashboard"}]:[{label:"Connexion",to:"/login"},{label:"S'inscrire",to:"/register"}])].map((l,i)=>(
              <Link key={i} to={l.to} onClick={()=>setMenuOpen(false)}
                style={{ display:"block",padding:"13px 0",fontSize:15,fontWeight:600,color:"rgba(242,237,230,0.75)",textDecoration:"none",borderBottom:`1px solid ${C.border}`,fontFamily:"'DM Sans',sans-serif" }}>
                {l.label}
              </Link>
            ))}
            {isLoggedIn&&<button onClick={handleLogout} style={{ marginTop:12,background:"none",border:"none",color:"#d4654a",fontWeight:600,fontSize:15,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif" }}>Déconnexion</button>}
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
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }
      `}</style>
    </>
  );
}

/* ── APP ────────────────────────────────────────────────────────── */
function AppInner() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("username");
  return (
    <div style={{ minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column" }}>
      <CursorSparks/>
      <Navbar/>
      <main style={{ flex:1 }}>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path="/"         element={<Home/>}/>
            <Route path="/courses"  element={<Courses/>}/>
            <Route path="/login"    element={isLoggedIn ? <Navigate to="/dashboard" replace/> : <Login/>}/>
            <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace/> : <Register/>}/>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            <Route path="/course-view/1" element={<ProtectedRoute><AlphabetArabe/></ProtectedRoute>}/>
            <Route path="/course-view/2" element={<ProtectedRoute><Tajwid/></ProtectedRoute>}/>
            <Route path="/course-view/3" element={<ProtectedRoute><Memorisation/></ProtectedRoute>}/>
            <Route path="/course-view/4" element={<ProtectedRoute><Grammaire/></ProtectedRoute>}/>
            <Route path="/course-view/5" element={<ProtectedRoute><Fiqh/></ProtectedRoute>}/>
            <Route path="/course-view/6" element={<ProtectedRoute><Sira/></ProtectedRoute>}/>
            <Route path="/course-view/7" element={<ProtectedRoute><Calligraphy/></ProtectedRoute>}/>
            <Route path="/course-view/8" element={<ProtectedRoute><BecomeMuslim/></ProtectedRoute>}/>
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