import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion, useScroll, useTransform, useSpring,
  useInView, AnimatePresence, easeOut
} from "framer-motion";
import { Star, Users, Clock, ArrowUpRight, Sparkles, ChevronDown } from "lucide-react";

/* ── FONTS ─────────────────────────────────────────────────────── */
const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
`;

/* ── PALETTE ───────────────────────────────────────────────────── */
const C = {
  bg:      "#080b0f",
  surface: "#0d1117",
  card:    "#111820",
  border:  "rgba(255,255,255,0.07)",
  gold:    "#c9a84c",
  goldL:   "#e8c97a",
  teal:    "#1db584",
  tealL:   "#25d4a0",
  text:    "#f2ede6",
  muted:   "rgba(242,237,230,0.4)",
  dim:     "rgba(242,237,230,0.18)",
};

/* ── DATA ──────────────────────────────────────────────────────── */
const ROADMAP = [
  {
    phase: "DÉPART", phaseAr: "البداية", phaseColor: C.teal, num: "01",
    courses: [
      { id:1, title:"Alphabet Arabe & Phonétique", titleAr:"الحروف والصوتيات", category:"Arabe", level:"Débutant", duration:"10h", rating:4.9, students:"1.2k", instructor:"Pr. Yassine", accent:C.teal, icon:"أ", image:"https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=85", tags:["Écriture","Oral"], description:"Maîtrisez les 28 lettres arabes, leurs formes et leur phonétique.", recommended:true },
      { id:7, title:"Calligraphie Arabe", titleAr:"الخط العربي", category:"Arabe", level:"Débutant", duration:"12h", rating:4.6, students:"450", instructor:"Ustadh Kamal", accent:"#9d7bea", icon:"خ", image:"https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=85", tags:["Art","Créativité"], description:"Transformez l'écriture en art avec les styles Naskh et Thuluth.", recommended:false },
    ]
  },
  {
    phase: "FONDATIONS", phaseAr: "الأساسيات", phaseColor: C.gold, num: "02",
    courses: [
      { id:4, title:"Grammaire : Tome 1 de Médine", titleAr:"النحو العربي", category:"Arabe", level:"Débutant", duration:"25h", rating:4.7, students:"2.1k", instructor:"Dr. Amira", accent:"#4fadd4", icon:"ن", image:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85", tags:["Syntaxe","Vocabulaire"], description:"Bases solides en grammaire arabe avec la méthode de l'Université de Médine.", recommended:true },
      { id:8, title:"Devenir Musulman : Les Bases", titleAr:"أساسيات الإسلام", category:"Sciences", level:"Débutant", duration:"14h", rating:4.9, students:"1.2k", instructor:"Dr. Nadia", accent:"#2ab89a", icon:"☪", image:"https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85", tags:["Conversion","Fondements"], description:"La Chahada, les 5 piliers, la prière et comment vivre en Islam.", recommended:false },
    ]
  },
  {
    phase: "CORAN", phaseAr: "القرآن الكريم", phaseColor: "#9d7bea", num: "03",
    courses: [
      { id:2, title:"Tajwid : Récitation Sacrée", titleAr:"أحكام التجويد", category:"Coran", level:"Intermédiaire", duration:"15h", rating:4.8, students:"850", instructor:"Cheikh Omar", accent:"#9d7bea", icon:"ت", image:"https://images.unsplash.com/photo-1564349683136-77e08bef1ef1?auto=format&fit=crop&w=1200&q=85", tags:["Règles","Mélodie"], description:"Récitez le Coran avec perfection grâce aux règles du Tajwid.", recommended:true },
      { id:3, title:"Mémorisation : Les Sourates", titleAr:"حفظ القرآن", category:"Coran", level:"Tous niveaux", duration:"20h", rating:5.0, students:"3.4k", instructor:"Pr. Fatma", accent:C.gold, icon:"س", image:"https://images.unsplash.com/photo-1584281723509-a16997486420?auto=format&fit=crop&w=1200&q=85", tags:["Hifz","Pratique"], description:"Mémorisez les sourates courtes avec des techniques éprouvées.", recommended:false },
    ]
  },
  {
    phase: "MAÎTRISE", phaseAr: "الإتقان", phaseColor: "#d4654a", num: "04",
    courses: [
      { id:9, title:"Arabe Moderne Standard", titleAr:"اللغة العربية الفصحى", category:"Arabe", level:"Intermédiaire", duration:"30h", rating:4.7, students:"1.8k", instructor:"Prof. Leila", accent:"#4fadd4", icon:"ع", image:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=85", tags:["Conversation","Presse"], description:"Maîtrisez l'arabe moderne pour lire la presse et communiquer.", recommended:true },
      { id:5, title:"Introduction au Fiqh", titleAr:"أصول الفقه", category:"Sciences", level:"Intermédiaire", duration:"12h", rating:4.9, students:"600", instructor:"Dr. Hassan", accent:"#d4654a", icon:"ف", image:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85", tags:["Législation","Éthique"], description:"Les fondements de la jurisprudence islamique.", recommended:false },
      { id:6, title:"Sira : Vie du Prophète ﷺ", titleAr:"السيرة النبوية", category:"Sciences", level:"Tous niveaux", duration:"18h", rating:4.9, students:"1.5k", instructor:"Pr. Walid", accent:C.teal, icon:"م", image:"https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=85", tags:["Histoire","Éthique"], description:"Un voyage à travers la vie du Prophète Muhammad ﷺ.", recommended:false },
    ]
  }
];

const ROUTES = {1:"/course-view/1",2:"/course-view/2",3:"/course-view/3",4:"/course-view/4",5:"/course-view/5",6:"/course-view/6",7:"/course-view/7",8:"/course-view/8",9:"/course-view/9"};

/* ── NOISE TEXTURE SVG (inline, no external dep) ───────────────── */
function NoiseOverlay() {
  return (
    <svg style={{ position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:2,opacity:0.032,mixBlendMode:"overlay" }} xmlns="http://www.w3.org/2000/svg">
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  );
}

/* ── AMBIENT ORBS ──────────────────────────────────────────────── */
function AmbientOrbs() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden" }}>
      <motion.div animate={{ x:[0,30,-20,0], y:[0,-20,15,0] }} transition={{ duration:18,repeat:Infinity,ease:"easeInOut" }}
        style={{ position:"absolute",top:"-15%",right:"5%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.055) 0%,transparent 65%)",filter:"blur(60px)" }}/>
      <motion.div animate={{ x:[0,-25,20,0], y:[0,30,-15,0] }} transition={{ duration:22,repeat:Infinity,ease:"easeInOut",delay:3 }}
        style={{ position:"absolute",bottom:"5%",left:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(29,181,132,0.05) 0%,transparent 65%)",filter:"blur(60px)" }}/>
      <motion.div animate={{ x:[0,20,-15,0], y:[0,-15,25,0] }} transition={{ duration:26,repeat:Infinity,ease:"easeInOut",delay:7 }}
        style={{ position:"absolute",top:"40%",left:"35%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(157,123,234,0.04) 0%,transparent 65%)",filter:"blur(70px)" }}/>
    </div>
  );
}

/* ── GRID LINES ────────────────────────────────────────────────── */
function GridLines() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
      backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
      backgroundSize:"88px 88px",opacity:0.5 }}/>
  );
}

/* ── COURSE CARD ───────────────────────────────────────────────── */
function CourseCard({ course, index }) {
  const [hov, setHov] = useState(false);
  const [imgOk, setImgOk] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:48, scale:0.96 }}
      animate={inView ? { opacity:1, y:0, scale:1 } : {}}
      transition={{ duration:0.65, delay:index*0.1, ease:[.22,.68,0,1] }}
    >
      <Link to={ROUTES[course.id]||"/courses"} style={{ textDecoration:"none",display:"block" }}>
        <motion.div
          onMouseEnter={()=>setHov(true)}
          onMouseLeave={()=>setHov(false)}
          animate={{ y: hov ? -10 : 0 }}
          transition={{ duration:0.35, ease:easeOut }}
          style={{
            borderRadius:24, overflow:"hidden",
            background: C.card,
            border:`1px solid ${hov ? course.accent+"50" : C.border}`,
            boxShadow: hov
              ? `0 32px 80px rgba(0,0,0,0.6),0 0 0 1px ${course.accent}22,inset 0 1px 0 rgba(255,255,255,0.05)`
              : "0 8px 32px rgba(0,0,0,0.35)",
            transition:"border-color 0.3s,box-shadow 0.3s",
            position:"relative",
          }}
        >
          {/* Image */}
          <div style={{ position:"relative",height:210,overflow:"hidden",background:"#0a0f14" }}>
            <motion.img
              src={course.image} alt={course.title}
              onLoad={()=>setImgOk(true)}
              animate={{ scale: hov?1.07:1, opacity: imgOk?(hov?0.72:0.52):0 }}
              transition={{ duration:0.55, ease:easeOut }}
              style={{ width:"100%",height:"100%",objectFit:"cover" }}
            />
            {/* Cinematic overlays */}
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(8,11,15,0.1) 0%,rgba(8,11,15,0.6) 55%,rgba(8,11,15,0.97) 100%)" }}/>
            <div style={{ position:"absolute",inset:0,background:`linear-gradient(135deg,${course.accent}18 0%,transparent 55%)` }}/>

            {/* Top-left: icon badge */}
            <motion.div
              animate={{ scale: hov?1.08:1 }}
              transition={{ duration:0.3 }}
              style={{ position:"absolute",top:16,left:16,width:46,height:46,borderRadius:14,background:`${course.accent}1a`,border:`1.5px solid ${course.accent}50`,backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:course.accent,fontWeight:700 }}>
              {course.icon}
            </motion.div>

            {/* Recommended */}
            {course.recommended && (
              <div style={{ position:"absolute",top:16,right:16,padding:"4px 11px",borderRadius:99,background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.4)",backdropFilter:"blur(10px)",fontSize:9,fontWeight:700,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase" }}>
                ★ Recommandé
              </div>
            )}

            {/* Bottom: category */}
            <div style={{ position:"absolute",bottom:14,left:16,padding:"3px 10px",borderRadius:99,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.09)",fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.6)",letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif" }}>
              {course.category}
            </div>

            {/* Right: arrow */}
            <motion.div
              animate={{ opacity: hov?1:0, x: hov?0:8, y: hov?0:-8 }}
              transition={{ duration:0.25 }}
              style={{ position:"absolute",bottom:14,right:16,width:32,height:32,borderRadius:10,background:course.accent,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <ArrowUpRight size={15} color="#fff"/>
            </motion.div>
          </div>

          {/* Body */}
          <div style={{ padding:"18px 20px 22px" }}>
            {/* Arabic subtitle */}
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:12,color:`${course.accent}99`,marginBottom:5,direction:"rtl",letterSpacing:"0.03em" }}>
              {course.titleAr}
            </div>

            <h3 style={{ fontSize:15,fontWeight:700,color:C.text,lineHeight:1.3,marginBottom:9,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"-0.01em" }}>
              {course.title}
            </h3>

            <p style={{ fontSize:12,color:C.muted,lineHeight:1.65,marginBottom:14,fontFamily:"'DM Sans',sans-serif",fontWeight:300 }}>
              {course.description}
            </p>

            {/* Tags */}
            <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:16 }}>
              {course.tags.map(t=>(
                <span key={t} style={{ padding:"3px 10px",borderRadius:99,background:`${course.accent}10`,border:`1px solid ${course.accent}28`,fontSize:10,fontWeight:600,color:course.accent,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif" }}>{t}</span>
              ))}
            </div>

            {/* Meta */}
            <div style={{ display:"flex",alignItems:"center",gap:16,borderTop:`1px solid ${C.border}`,paddingTop:14 }}>
              <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.gold,fontWeight:600,fontFamily:"'DM Sans',sans-serif" }}>
                <Star size={11} fill={C.gold}/> {course.rating}
              </span>
              <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.dim,fontFamily:"'DM Sans',sans-serif" }}>
                <Users size={11}/> {course.students}
              </span>
              <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.dim,fontFamily:"'DM Sans',sans-serif" }}>
                <Clock size={11}/> {course.duration}
              </span>
              <div style={{ marginLeft:"auto",fontSize:11,color:C.dim,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic" }}>
                {course.instructor}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            animate={{ scaleX: hov?1:0, opacity: hov?1:0 }}
            transition={{ duration:0.3 }}
            style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${course.accent},transparent)`,transformOrigin:"center" }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── PHASE DIVIDER ─────────────────────────────────────────────── */
function PhaseDivider({ phase, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, x:-40 }}
      animate={inView ? { opacity:1, x:0 } : {}}
      transition={{ duration:0.7, ease:[.22,.68,0,1] }}
      style={{ display:"flex",alignItems:"center",gap:20,marginBottom:36 }}
    >
      {/* Phase number */}
      <div style={{ flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:11,fontWeight:600,color:phase.phaseColor,letterSpacing:"0.2em",textTransform:"uppercase" }}>
          {phase.num}
        </div>
        <div style={{ width:1,height:36,background:`linear-gradient(180deg,${phase.phaseColor}60,transparent)` }}/>
      </div>

      <div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.text,lineHeight:1,marginBottom:3,letterSpacing:"-0.02em" }}>
          {phase.phase}
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:phase.phaseColor,direction:"rtl",opacity:0.8 }}>
          {phase.phaseAr}
        </div>
      </div>

      {/* Line */}
      <motion.div
        initial={{ scaleX:0 }}
        animate={inView ? { scaleX:1 } : {}}
        transition={{ duration:1, delay:0.3, ease:easeOut }}
        style={{ flex:1,height:1,background:`linear-gradient(90deg,${phase.phaseColor}50,transparent)`,transformOrigin:"left" }}
      />

      {/* Phase tag */}
      <div style={{ flexShrink:0,padding:"6px 14px",borderRadius:99,background:`${phase.phaseColor}12`,border:`1px solid ${phase.phaseColor}30`,fontSize:10,fontWeight:700,color:phase.phaseColor,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>
        {phase.courses.length} cours
      </div>
    </motion.div>
  );
}

/* ── HERO ──────────────────────────────────────────────────────── */
function Hero() {
  const { scrollY } = useScroll();
  const y     = useTransform(scrollY, [0,500], [0,120]);
  const opHero = useTransform(scrollY, [0,400], [1,0]);

  const total = ROADMAP.reduce((s,p)=>s+p.courses.length,0);

  return (
    <div style={{ position:"relative",minHeight:"92vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",zIndex:1 }}>
      {/* Parallax Arabic watermark */}
      <motion.div style={{ y, position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:0 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(200px,35vw,520px)",color:"rgba(201,168,76,0.028)",lineHeight:1,userSelect:"none",letterSpacing:"-0.05em" }}>
          علم
        </div>
      </motion.div>

      <motion.div style={{ opacity:opHero, position:"relative",zIndex:1,textAlign:"center",padding:"120px 24px 80px",maxWidth:860 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, ease:easeOut }}
          style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:99,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.28)",fontSize:11,fontWeight:600,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:32,fontFamily:"'DM Sans',sans-serif" }}>
          <Sparkles size={11}/> {total} Cours · 4 Niveaux · Certifiés
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.9, delay:0.1, ease:[.22,.68,0,1] }}
          style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.8rem,7vw,5.5rem)",fontWeight:700,lineHeight:1.04,color:C.text,marginBottom:22,letterSpacing:"-0.03em" }}>
          Votre parcours vers<br/>
          <span style={{ fontStyle:"italic",background:`linear-gradient(135deg,${C.goldL} 0%,${C.gold} 40%,${C.tealL} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
            la maîtrise islamique
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, delay:0.25, ease:easeOut }}
          style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1rem,2vw,1.25rem)",fontStyle:"italic",color:C.muted,lineHeight:1.75,maxWidth:560,margin:"0 auto 44px" }}>
          De l'alphabet au Coran — un chemin structuré, guidé par des experts, enrichi par l'intelligence artificielle.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.4, ease:easeOut }}
          style={{ display:"flex",justifyContent:"center",gap:"clamp(24px,5vw,56px)",flexWrap:"wrap",paddingTop:36,borderTop:`1px solid ${C.border}` }}>
          {[["9","Cours"],["4k+","Étudiants"],["98%","Réussite"],["6","Experts"]].map(([val,lbl])=>(
            <div key={lbl} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:700,background:`linear-gradient(135deg,${C.goldL},${C.tealL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1 }}>{val}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:4 }}>{lbl}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y:[0,8,0] }}
        transition={{ duration:2.2,repeat:Infinity,ease:"easeInOut" }}
        style={{ position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.35,zIndex:1 }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:600,letterSpacing:"0.16em",color:C.gold,textTransform:"uppercase" }}>Découvrir</span>
        <ChevronDown size={14} color={C.gold}/>
      </motion.div>
    </div>
  );
}

/* ── MAIN COURSES PAGE ─────────────────────────────────────────── */
export default function Courses() {
  return (
    <div style={{ minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",position:"relative" }}>
      <style>{FONT_LINK + `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(201,168,76,0.25); color: #f2ede6; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080b0f; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.25); border-radius: 99px; }
      `}</style>

      <GridLines/>
      <AmbientOrbs/>
      <NoiseOverlay/>

      <div style={{ position:"relative",zIndex:3 }}>
        <Hero/>

        {/* Roadmap */}
        <div style={{ maxWidth:1180,margin:"0 auto",padding:"0 24px 120px" }}>
          {ROADMAP.map((phase,pi)=>(
            <div key={phase.phase} style={{ marginBottom:100 }}>
              <PhaseDivider phase={phase} index={pi}/>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:24 }}>
                {phase.courses.map((course,ci)=>(
                  <CourseCard key={course.id} course={course} index={ci}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}