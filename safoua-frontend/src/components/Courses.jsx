import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Star, Users, Clock, ArrowUpRight, Sparkles, ChevronDown } from "lucide-react";

/* ── DATA ─────────────────────────────────────────────────────── */
const ROADMAP = [
  {
    phase: "DÉPART", phaseAr: "البداية", phaseColor: "#10b981",
    phaseBg: "rgba(16,185,129,0.12)",
    courses: [
      { id: 1, title: "Alphabet Arabe & Phonétique", titleAr: "الحروف والصوتيات", category: "Arabe", level: "Débutant", duration: "10h", rating: 4.9, students: "1.2k", instructor: "Pr. Yassine", accent: "#10b981", icon: "أ", image: "https://images.unsplash.com/photo-1584281723509-a16997486420?auto=format&fit=crop&w=800&q=80", tags: ["Écriture", "Oral"], description: "Maîtrisez les 28 lettres arabes, leurs formes et leur phonétique.", recommended: true, unlocked: true, step: 1, why: "Point de départ absolu — sans l'alphabet, rien n'est possible." },
      { id: 7, title: "Calligraphie Arabe", titleAr: "الخط العربي", category: "Arabe", level: "Débutant", duration: "12h", rating: 4.6, students: "450", instructor: "Ustadh Kamal", accent: "#8b5cf6", icon: "خ", image: "https://images.unsplash.com/photo-1564349683136-77e08bef1ef1?auto=format&fit=crop&w=800&q=80", tags: ["Art", "Créativité"], description: "Transformez l'écriture en art avec les styles Naskh et Thuluth.", recommended: false, unlocked: true, step: 1, why: "Parallèle idéal à l'alphabet pour renforcer la mémorisation des lettres." },
    ]
  },
  {
    phase: "FONDATIONS", phaseAr: "الأساسيات", phaseColor: "#f59e0b",
    phaseBg: "rgba(245,158,11,0.12)",
    courses: [
      { id: 4, title: "Grammaire : Tome 1 de Médine", titleAr: "النحو العربي", category: "Arabe", level: "Débutant", duration: "25h", rating: 4.7, students: "2.1k", instructor: "Dr. Amira", accent: "#0ea5e9", icon: "ن", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80", tags: ["Syntaxe", "Vocabulaire"], description: "Bases solides en grammaire arabe avec la méthode de l'Université de Médine.", recommended: true, unlocked: true, step: 2, why: "La grammaire est le squelette de la langue — indispensable dès le départ." },
      { id: 8, title: "Devenir Musulman : Les Bases", titleAr: "أساسيات الإسلام", category: "Sciences", level: "Débutant", duration: "14h", rating: 4.9, students: "1.2k", instructor: "Dr. Nadia", accent: "#0d9e8a", icon: "☪", image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80", tags: ["Conversion", "Fondements"], description: "La Chahada, les 5 piliers, la prière et comment vivre en Islam.", recommended: false, unlocked: true, step: 2, why: "Comprendre sa foi avant de plonger dans les textes sacrés." },
    ]
  },
  {
    phase: "CORAN", phaseAr: "القرآن الكريم", phaseColor: "#8b5cf6",
    phaseBg: "rgba(139,92,246,0.12)",
    courses: [
      { id: 2, title: "Tajwid : Récitation Sacrée", titleAr: "أحكام التجويد", category: "Coran", level: "Intermédiaire", duration: "15h", rating: 4.8, students: "850", instructor: "Cheikh Omar", accent: "#8b5cf6", icon: "ت", image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80", tags: ["Règles", "Mélodie"], description: "Récitez le Coran avec perfection grâce aux règles du Tajwid.", recommended: true, unlocked: true, step: 3, why: "Réciter correctement est une obligation avant la mémorisation." },
      { id: 3, title: "Mémorisation : Les 10 Sourates", titleAr: "حفظ القرآن", category: "Coran", level: "Tous niveaux", duration: "20h", rating: 5.0, students: "3.4k", instructor: "Pr. Fatma", accent: "#f59e0b", icon: "س", image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80", tags: ["Hifz", "Pratique"], description: "Mémorisez les sourates courtes avec des techniques éprouvées.", recommended: false, unlocked: true, step: 3, why: "Les 10 dernières sourates — la porte d'entrée du Hifz." },
    ]
  },
  {
    phase: "MAÎTRISE", phaseAr: "الإتقان", phaseColor: "#ef4444",
    phaseBg: "rgba(239,68,68,0.12)",
    courses: [
      { id: 9, title: "Arabe Moderne Standard", titleAr: "اللغة العربية الفصحى", category: "Arabe", level: "Intermédiaire", duration: "30h", rating: 4.7, students: "1.8k", instructor: "Prof. Leila", accent: "#0ea5e9", icon: "ع", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80", tags: ["Conversation", "Presse"], description: "Maîtrisez l'arabe moderne pour lire la presse et communiquer.", recommended: true, unlocked: true, step: 4, why: "Passez à la communication réelle en arabe moderne." },
      { id: 5, title: "Introduction au Fiqh", titleAr: "أصول الفقه", category: "Sciences", level: "Intermédiaire", duration: "12h", rating: 4.9, students: "600", instructor: "Dr. Hassan", accent: "#ef4444", icon: "ف", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", tags: ["Législation", "Éthique"], description: "Les fondements de la jurisprudence islamique.", recommended: false, unlocked: true, step: 4, why: "Comprendre le droit islamique pour vivre sa foi pleinement." },
      { id: 6, title: "Sira : Vie du Prophète ﷺ", titleAr: "السيرة النبوية", category: "Sciences", level: "Tous niveaux", duration: "18h", rating: 4.9, students: "1.5k", instructor: "Pr. Walid", accent: "#10b981", icon: "م", image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80", tags: ["Histoire", "Éthique"], description: "Un voyage à travers la vie du Prophète Muhammad ﷺ.", recommended: false, unlocked: true, step: 4, why: "La Sîra inspire et contextualise tout l'apprentissage islamique." },
    ]
  }
];

const levelColors = {
  "Débutant":      { bg: "#dbeafe", text: "#1d4ed8" },
  "Intermédiaire": { bg: "#fef3c7", text: "#b45309" },
  "Tous niveaux":  { bg: "#f3e8ff", text: "#7c3aed" },
};

const courseRoutes = { 1:"/course-view/1",2:"/course-view/2",3:"/course-view/3",4:"/course-view/4",5:"/course-view/5",6:"/course-view/6",7:"/course-view/7",8:"/course-view/8",9:"/course-view/9" };

/* ── BACKGROUND — zero React re-renders for mouse parallax ───── */
/*
   All parallax layers are moved by direct DOM style writes inside a RAF loop.
   React never re-renders due to mouse movement — only the CSS transforms update.
*/
function RoadmapBackground() {
  // One ref per parallax layer
  const starsRef    = useRef(null);
  const sunRef      = useRef(null);
  const farMtnRef   = useRef(null);
  const midMtnRef   = useRef(null);
  const treesRef    = useRef(null);
  const roadRef     = useRef(null);
  const firefliesRef = useRef(null);
  const cloudsRef   = useRef([]);
  const rafRef      = useRef(null);
  const cur         = useRef({ x: 0, y: 0 });   // current (lerped) position
  const tgt         = useRef({ x: 0, y: 0 });   // target (raw mouse)

  useEffect(() => {
    const onMove = (e) => {
      tgt.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      tgt.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      // Lerp toward target — smooth, no state, no React render
      cur.current.x += (tgt.current.x - cur.current.x) * 0.06;
      cur.current.y += (tgt.current.y - cur.current.y) * 0.06;
      const mx = cur.current.x;
      const my = cur.current.y;

      // Direct DOM writes — bypasses React entirely
      if (starsRef.current)
        starsRef.current.style.transform = `translate(${mx * -12}px, ${my * -8}px)`;
      if (sunRef.current)
        sunRef.current.style.transform = `translateX(-50%) translate(${mx * -6}px, ${my * -4}px)`;
      if (farMtnRef.current)
        farMtnRef.current.style.transform = `translate(${mx * -8}px, ${my * -5}px)`;
      if (midMtnRef.current)
        midMtnRef.current.style.transform = `translate(${mx * -16}px, ${my * -10}px)`;
      if (treesRef.current)
        treesRef.current.style.transform = `translate(${mx * -22}px, ${my * -14}px)`;
      if (roadRef.current)
        roadRef.current.style.transform = `translate(${mx * -28}px, ${my * -18}px)`;
      if (firefliesRef.current) {
        const ff = firefliesRef.current.children;
        for (let i = 0; i < ff.length; i++) {
          ff[i].style.transform = `translate(${mx * -(2 + i % 4)}px, ${my * -(1 + i % 3)}px)`;
        }
      }
      cloudsRef.current.forEach((el, i) => {
        if (el) el.style.transform = `translate(${mx * -(6 + i * 2)}px, ${my * -(3 + i)}px)`;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Static star positions — computed once, never change
  const stars = Array.from({ length: 80 }, (_, i) => ({
    left:   `${(i * 137.5) % 100}%`,
    top:    `${(i * 97.3)  % 55}%`,
    size:   i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
    opacity: 0.4 + (i % 6) * 0.1,
    animDur: `${2 + (i % 4)}s`,
    animDel: `${(i % 10) * 0.3}s`,
  }));

  const fireflyColors = ["#10b981","#10b981","#f59e0b","#f59e0b","#8b5cf6","#8b5cf6","#ffffff"];
  const fireflies = Array.from({ length: 18 }, (_, i) => ({
    left:  `${10 + (i * 53.7) % 80}%`,
    top:   `${20 + (i * 73.1) % 65}%`,
    color: fireflyColors[i % fireflyColors.length],
    dur:   `${3 + (i % 5)}s`,
    del:   `${(i % 7) * 0.6}s`,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Sky */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, #0a1628 0%, #0d2240 25%, #0f3d2b 55%, #162d1a 80%, #0a1a0e 100%)" }}/>

      {/* Stars — layer moved by ref, children are static */}
      <div ref={starsRef} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
        {stars.map((s, i) => (
          <div key={i} style={{
            position: "absolute", left: s.left, top: s.top,
            width: s.size, height: s.size,
            borderRadius: "50%", background: "white", opacity: s.opacity,
            animation: `twinkle ${s.animDur} ease-in-out infinite ${s.animDel}`
          }}/>
        ))}
      </div>

      {/* Sun glow */}
      <div ref={sunRef} style={{
        position: "absolute", top: "-80px", left: "50%",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,200,80,0.55) 0%, rgba(255,150,30,0.25) 40%, transparent 70%)",
        willChange: "transform",
      }}/>

      {/* Clouds */}
      {[
        { top: "8%",  left: "5%",  scale: 1.2, animDur: "24s", animDel: "0s" },
        { top: "12%", left: "60%", scale: 0.8, animDur: "32s", animDel: "-10s" },
        { top: "18%", left: "30%", scale: 1.0, animDur: "28s", animDel: "-5s" },
      ].map((c, i) => (
        <div key={i} ref={el => cloudsRef.current[i] = el} style={{
          position: "absolute", top: c.top, left: c.left,
          opacity: 0.12, willChange: "transform",
          animation: `driftCloud ${c.animDur} linear infinite ${c.animDel}`
        }}>
          <svg width="140" height="50" viewBox="0 0 140 50" style={{ transform: `scale(${c.scale})` }}>
            <ellipse cx="70" cy="35" rx="65" ry="18" fill="white"/>
            <ellipse cx="50" cy="28" rx="32" ry="22" fill="white"/>
            <ellipse cx="90" cy="26" rx="28" ry="20" fill="white"/>
          </svg>
        </div>
      ))}

      {/* Far mountains */}
      <svg ref={farMtnRef} viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", bottom: 0, width: "100%", height: "75%", willChange: "transform" }}>
        <path d="M0,400 L80,260 L180,320 L260,150 L360,280 L440,100 L520,240 L620,180 L700,320 L800,140 L880,280 L960,80 L1060,220 L1160,100 L1260,260 L1360,180 L1440,300 L1440,600 L0,600 Z" fill="#0d2a1a" opacity="0.9"/>
        <path d="M440,100 L420,160 L460,155 Z" fill="rgba(255,255,255,0.6)"/>
        <path d="M800,140 L778,195 L822,190 Z" fill="rgba(255,255,255,0.55)"/>
        <path d="M960,80 L935,148 L985,143 Z" fill="rgba(255,255,255,0.65)"/>
        <path d="M1160,100 L1138,162 L1182,157 Z" fill="rgba(255,255,255,0.5)"/>
      </svg>

      {/* Mid mountains */}
      <svg ref={midMtnRef} viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", bottom: 0, width: "100%", height: "70%", willChange: "transform" }}>
        <path d="M0,480 L100,340 L200,420 L320,260 L420,380 L520,200 L620,350 L720,240 L820,380 L920,200 L1040,340 L1160,220 L1280,360 L1380,280 L1440,380 L1440,600 L0,600 Z" fill="#0e3320" opacity="0.95"/>
        <path d="M520,200 L500,258 L540,253 Z" fill="rgba(255,255,255,0.7)"/>
        <path d="M920,200 L900,255 L940,250 Z" fill="rgba(255,255,255,0.65)"/>
        <path d="M1160,220 L1140,272 L1180,267 Z" fill="rgba(255,255,255,0.6)"/>
      </svg>

      {/* Forest */}
      <svg ref={treesRef} viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", bottom: 0, width: "100%", height: "45%", willChange: "transform" }}>
        {Array.from({ length: 28 }, (_, i) => {
          const x = (i / 28) * 1440 + (i % 3) * 8;
          const h = 60 + (i % 5) * 18;
          const w = 28 + (i % 3) * 8;
          const fills = ["#0a3a18","#0d4a1f","#093015","#0b4020"];
          return (
            <g key={i} transform={`translate(${x}, ${300 - h})`}>
              <polygon points={`${w/2},0 ${w},${h*0.45} ${w*0.75},${h*0.4} ${w},${h*0.7} ${w*0.8},${h*0.65} ${w},${h} 0,${h} ${w*0.2},${h*0.65} 0,${h*0.7} ${w*0.25},${h*0.4} 0,${h*0.45}`}
                fill={fills[i % 4]}/>
            </g>
          );
        })}
      </svg>

      {/* Road */}
      <svg ref={roadRef} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", bottom: 0, width: "100%", height: "80%", willChange: "transform" }}>
        <path d="M680,900 C660,780 580,700 520,600 C460,500 440,420 400,340 C360,260 300,200 320,120" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="72" strokeLinecap="round"/>
        <path d="M680,900 C660,780 580,700 520,600 C460,500 440,420 400,340 C360,260 300,200 320,120" fill="none" stroke="#2d3a2a" strokeWidth="64" strokeLinecap="round"/>
        <path d="M680,900 C660,780 580,700 520,600 C460,500 440,420 400,340 C360,260 300,200 320,120" fill="none" stroke="rgba(255,220,80,0.7)" strokeWidth="3" strokeLinecap="round" strokeDasharray="24 20" style={{ animation: "roadDash 1.2s linear infinite" }}/>
        <path d="M650,900 C630,780 554,702 494,602 C434,502 414,422 374,342 C334,262 274,202 294,122" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M710,900 C690,780 606,698 546,598 C486,498 466,418 426,338 C386,258 326,198 346,118" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round"/>
        {[
          { cx:666, cy:820, label:"▶", color:"#10b981" },
          { cx:560, cy:650, label:"1",  color:"#10b981" },
          { cx:480, cy:520, label:"2",  color:"#f59e0b" },
          { cx:418, cy:390, label:"3",  color:"#8b5cf6" },
          { cx:348, cy:240, label:"4",  color:"#ef4444"  },
        ].map((m, i) => (
          <g key={i}>
            <circle cx={m.cx} cy={m.cy} r="14" fill={m.color} opacity="0.9"/>
            <circle cx={m.cx} cy={m.cy} r="14" fill="none" stroke={m.color} strokeWidth="4" opacity="0.35"
              style={{ animation: `pulseRing 2s ease-out infinite ${i * 0.4}s` }}/>
            <text x={m.cx} y={m.cy+5} textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="system-ui">{m.label}</text>
          </g>
        ))}
        <text x="320" y="100" textAnchor="middle" fontSize="26">🏆</text>
      </svg>

      {/* Ground */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "18%", background: "linear-gradient(to top, #071a0d 0%, #0a2a12 60%, transparent 100%)" }}/>

      {/* Atmosphere */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,180,60,0.08) 0%, transparent 60%)" }}/>

      {/* Fireflies — each child moved by ref loop (no state) */}
      <div ref={firefliesRef} style={{ position: "absolute", inset: 0 }}>
        {fireflies.map((f, i) => (
          <div key={i} style={{
            position: "absolute", left: f.left, top: f.top,
            width: 4, height: 4, borderRadius: "50%",
            background: f.color,
            boxShadow: `0 0 8px 3px ${f.color}`,
            opacity: 0,
            animation: `firefly ${f.dur} ease-in-out infinite ${f.del}`,
            willChange: "transform",
          }}/>
        ))}
      </div>

      {/* Readability overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,15,10,0.38)" }}/>
    </div>
  );
}

/* ── CONNECTOR ────────────────────────────────────────────────── */
function Connector({ color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 4, height: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(to bottom, ${color} 0px, ${color} 10px, transparent 10px, transparent 20px)`, animation: "dashFlow 1s linear infinite" }}/>
      </div>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 6px ${color}30, 0 0 24px ${color}60` }}>
        <ChevronDown size={17} color="white" strokeWidth={3}/>
      </div>
      <div style={{ width: 4, height: 20, background: color, opacity: 0.25, borderRadius: 99 }}/>
    </div>
  );
}

/* ── COURSE CARD ─────────────────────────────────────────────── */
function CourseCard({ course, isRecommended }) {
  const [hovered, setHovered] = useState(false);
  const lv = levelColors[course.level] || levelColors["Débutant"];

  return (
    <Link
      to={courseRoutes[course.id]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", textDecoration: "none",
        transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div style={{
        background: "rgba(255,255,255,0.93)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: 24, overflow: "hidden",
        border: isRecommended ? `2px solid ${course.accent}` : "2px solid rgba(255,255,255,0.3)",
        boxShadow: hovered
          ? `0 28px 60px rgba(0,0,0,0.35), 0 0 0 1px ${course.accent}50, 0 0 40px ${course.accent}20`
          : isRecommended
            ? `0 10px 40px rgba(0,0,0,0.25), 0 0 20px ${course.accent}30`
            : "0 6px 24px rgba(0,0,0,0.2)",
        transition: "all 0.35s ease",
        position: "relative",
        display: "flex", flexDirection: "column", width: "100%",
      }}>
        {isRecommended && (
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10, background: course.accent, color: "white", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 99, boxShadow: `0 4px 14px ${course.accent}60`, display: "flex", alignItems: "center", gap: 4 }}>
            <Sparkles size={9}/> RECOMMANDÉ
          </div>
        )}
        <div style={{ position: "relative", height: 140, overflow: "hidden", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, transparent 30%, rgba(8,12,20,0.8) 100%)" }}/>
          <img src={course.image} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.1)" : "scale(1)", transition: "transform 0.5s ease" }}/>
          <div style={{ position: "absolute", bottom: 14, left: 14, zIndex: 2, width: 46, height: 46, borderRadius: 14, background: course.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontFamily: "serif", color: "white", boxShadow: `0 4px 18px ${course.accent}70` }}>{course.icon}</div>
          <div style={{ position: "absolute", bottom: 14, right: 14, zIndex: 2 }}>
            <span style={{ background: lv.bg, color: lv.text, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>{course.level}</span>
          </div>
        </div>
        <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 12, color: course.accent, fontFamily: "Georgia, serif", direction: "rtl", marginBottom: 2, fontWeight: 600, opacity: 0.85 }}>{course.titleAr}</div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.3, fontFamily: "Georgia, serif" }}>{course.title}</h3>
          <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: "0 0 10px", fontFamily: "system-ui" }}>{course.description}</p>
          <div style={{ background: `${course.accent}12`, border: `1px solid ${course.accent}28`, borderRadius: 10, padding: "7px 10px", marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: course.accent }}>💡 {course.why}</span>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
            {course.tags.map(tag => (
              <span key={tag} style={{ background: `${course.accent}18`, color: course.accent, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>{tag}</span>
            ))}
          </div>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1.5px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#94a3b8", fontWeight: 600 }}><Clock size={11}/>{course.duration}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#94a3b8", fontWeight: 600 }}><Users size={11}/>{course.students}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: course.accent }}><Star size={11} style={{ fill: course.accent }}/>{course.rating}</span>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: hovered ? course.accent : `${course.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
              <ArrowUpRight size={16} color={hovered ? "white" : course.accent}/>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── PHASE BLOCK ─────────────────────────────────────────────── */
function PhaseBlock({ phase, index, visible }) {
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(50px)", transition: `all 0.8s cubic-bezier(0.22,1,0.36,1) ${index * 0.15}s` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg, ${phase.phaseColor}, ${phase.phaseColor}bb)`, border: "4px solid rgba(255,255,255,0.15)", boxShadow: `0 0 0 5px ${phase.phaseColor}25, 0 10px 40px ${phase.phaseColor}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "white", marginBottom: 12, position: "relative", zIndex: 2 }}>
          {index + 1}
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1.5px solid ${phase.phaseColor}40`, borderRadius: 99, padding: "7px 22px" }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: phase.phaseColor, letterSpacing: "0.12em" }}>{phase.phase}</span>
          <span style={{ fontSize: 14, color: phase.phaseColor, fontFamily: "Georgia, serif", opacity: 0.8 }}>— {phase.phaseAr}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: phase.courses.length >= 3 ? "repeat(3, 1fr)" : phase.courses.length === 2 ? "1fr 1fr" : "1fr", gap: 16, alignItems: "stretch" }}>
        {phase.courses.map(course => (
          <CourseCard key={course.id} course={course} isRecommended={course.recommended}/>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────────────── */
export default function Courses() {
  const [visiblePhases, setVisiblePhases] = useState([]);
  const phaseRefs = useRef([]);

  useEffect(() => {
    const check = () => {
      phaseRefs.current.forEach((ref, i) => {
        if (!ref) return;
        if (ref.getBoundingClientRect().top < window.innerHeight * 0.88) {
          setVisiblePhases(prev => prev.includes(i) ? prev : [...prev, i]);
        }
      });
    };
    window.addEventListener("scroll", check, { passive: true });
    setTimeout(check, 100);
    return () => window.removeEventListener("scroll", check);
  }, []);

  const totalCourses = ROADMAP.reduce((a, p) => a + p.courses.length, 0);

  return (
    <div style={{ minHeight: "100vh", fontFamily: "system-ui, sans-serif", position: "relative" }}>
      <style>{`
        @keyframes dashFlow  { from { transform: translateY(0); }      to { transform: translateY(-20px); } }
        @keyframes roadDash  { from { stroke-dashoffset: 0; }           to { stroke-dashoffset: -44; } }
        @keyframes twinkle   { 0%,100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
        @keyframes firefly   { 0%,100% { opacity: 0; } 30% { opacity: 0.9; } 60% { opacity: 0.5; } 80% { opacity: 0.8; } }
        @keyframes pulseRing { 0% { r: 14; opacity: 0.8; } 100% { r: 28; opacity: 0; } }
        @keyframes driftCloud{ from { transform: translateX(-200px); }  to { transform: translateX(1800px); } }
        @keyframes floatGently{ 0%,100% { transform: translateY(0); }  50% { transform: translateY(-10px); } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 8px 32px rgba(16,185,129,0.3); } 50% { box-shadow: 0 8px 50px rgba(16,185,129,0.7); } }
        @keyframes shimmer   { from { background-position: -400% 0; }  to { background-position: 400% 0; } }
        @keyframes heroReveal{ from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
      `}</style>

      {/* Background — no mouse state passed, all DOM-direct */}
      <RoadmapBackground/>

      {/* HERO */}
      <div style={{ position: "relative", zIndex: 2, paddingTop: 110, paddingBottom: 90, overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -30, fontSize: 240, fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.03)", lineHeight: 1, userSelect: "none", pointerEvents: "none", direction: "rtl" }}>بسم الله</div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 99, padding: "8px 22px", marginBottom: 30, fontSize: 11, fontWeight: 700, color: "#34d399", letterSpacing: "0.16em", animation: "heroReveal 0.8s ease both 0.1s" }}>
            <Sparkles size={12}/> VOTRE PARCOURS D'APPRENTISSAGE — SAFOUA ACADEMY
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, fontFamily: "Georgia, serif", color: "white", animation: "heroReveal 0.8s ease both 0.2s" }}>
            Votre Feuille de Route vers<br/>
            <span style={{ background: "linear-gradient(90deg, #34d399, #a78bfa, #fbbf24, #34d399)", backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 5s linear infinite" }}>la Sagesse Islamique</span>
          </h1>
          <p style={{ color: "rgba(148,163,184,0.9)", fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 38px", animation: "heroReveal 0.8s ease both 0.35s" }}>
            Suivez ce chemin balisé par nos experts — de l'alphabet jusqu'à la maîtrise. Chaque étape prépare la suivante.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", animation: "heroReveal 0.8s ease both 0.5s" }}>
            {[
              { v: `${totalCourses}`, l: "Cours" }, { v: "4", l: "Étapes" },
              { v: "4k+", l: "Étudiants" },         { v: "98%", l: "Réussite" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "14px 26px", textAlign: "center", minWidth: 88 }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#34d399" }}>{s.v}</div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, letterSpacing: "0.1em", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROADMAP BODY */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px 100px" }}>

          {/* START */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 44 }}>
            <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 20, padding: "13px 34px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 40px rgba(16,185,129,0.4)", animation: "pulseGlow 3s ease-in-out infinite" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "white", animation: "twinkle 1.5s ease-in-out infinite" }}/>
              <span style={{ fontSize: 13, fontWeight: 900, color: "white", letterSpacing: "0.18em" }}>COMMENCEZ ICI — ابدأ هنا</span>
            </div>
            <div style={{ width: 2, height: 32, background: "linear-gradient(to bottom, #10b981, transparent)", marginTop: 6 }}/>
          </div>

          {/* Phases */}
          {ROADMAP.map((phase, idx) => (
            <div key={idx}>
              <div ref={el => phaseRefs.current[idx] = el}>
                <PhaseBlock phase={phase} index={idx} visible={visiblePhases.includes(idx)}/>
              </div>
              {idx < ROADMAP.length - 1 && (
                <div style={{ margin: "42px 0", display: "flex", justifyContent: "center" }}>
                  <Connector color={ROADMAP[idx + 1].phaseColor}/>
                </div>
              )}
            </div>
          ))}

          {/* FINISH */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 52 }}>
            <div style={{ width: 2, height: 32, background: "linear-gradient(to bottom, transparent, #f59e0b)", marginBottom: 4 }}/>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 48px rgba(245,158,11,0.5)", fontSize: 38, marginBottom: 18, animation: "floatGently 3s ease-in-out infinite" }}>🏆</div>
            <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: 20, padding: "16px 38px", textAlign: "center", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "white", letterSpacing: "0.14em" }}>DIPLÔMÉ SAFOUA ACADEMY</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, fontFamily: "Georgia, serif" }}>خريج أكاديمية الصفوة</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ marginTop: 64, padding: "24px 28px", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#64748b", letterSpacing: "0.14em", marginBottom: 14 }}>LÉGENDE DE LA CARTE</p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { color: "#10b981", label: "Cours recommandé en priorité" },
                { color: "#64748b", label: "Cours complémentaire (optionnel)" },
                { color: "#f59e0b", label: "💡 Explication du choix du cours" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }}/>
                  <span style={{ fontSize: 12, color: "rgba(148,163,184,0.9)", fontWeight: 600 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}