/**
 * components/Home.jsx — Safoua Academy
 * Full theme-aware redesign: dark stays premium, light is clean editorial white.
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useSpring, useInView, easeOut } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, Mic, Trophy, Brain, ChevronDown, Star, Users, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ── TYPEWRITER ──────────────────────────────────────────────────── */
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    const delay = deleting ? speed / 2 : charIdx === current.length ? pause : speed;
    const t = setTimeout(() => {
      if (!deleting && charIdx === current.length) { setDeleting(true); }
      else if (deleting && charIdx === 0) { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
      else { const n = charIdx + (deleting ? -1 : 1); setCharIdx(n); setDisplay(current.slice(0, n)); }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

/* ── BACKGROUND ──────────────────────────────────────────────────── */
function PageBg({ isDark }) {
  if (isDark) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 130% 90% at 50% -5%, #0e1a0f 0%, #080b0f 45%, #06080f 100%)' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 'min(900px,120vw)', height: '55vh', background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '35%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(29,181,132,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.022) 1px, transparent 1px)', backgroundSize: '88px 88px' }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#ffffff' }} />
      {/* Subtle warm tint at top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60vh', background: 'linear-gradient(180deg, #fffbf2 0%, #ffffff 100%)' }} />
      {/* Faint gold orb top-center */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(154,111,30,0.06) 0%, transparent 65%)', filter: 'blur(50px)' }} />
      {/* Faint teal orb right */}
      <div style={{ position: 'absolute', top: '20%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(13,122,87,0.04) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      {/* Very faint dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(154,111,30,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    </div>
  );
}

/* ── FLOATING QURAN + DRAGGABLE LETTERS ──────────────────────────── */
const FLOATING_LETTERS = [
  { char: 'ي', x: '14%', y: '4%',  size: 46, color: '#7c3aed', dur: 4.1, delay: 0 },
  { char: 'ش', x: '4%',  y: '32%', size: 44, color: '#7c3aed', dur: 4.1, delay: 0 },
  { char: 'س', x: '76%', y: '8%',  size: 36, color: '#0d7a57', dur: 3.5, delay: 0.6 },
  { char: 'م', x: '80%', y: '62%', size: 50, color: '#0a7a30', dur: 5.0, delay: 0.3 },
  { char: 'ا', x: '22%', y: '76%', size: 34, color: '#14a872', dur: 3.8, delay: 1.0 },
  { char: 'ل', x: '50%', y: '2%',  size: 28, color: '#c9932a', dur: 4.6, delay: 0.8 },
  { char: 'ن', x: '60%', y: '82%', size: 42, color: '#b03020', dur: 3.2, delay: 0.2 },
  { char: 'ر', x: '88%', y: '36%', size: 32, color: '#9a6f1e', dur: 4.3, delay: 1.2 },
  { char: 'ح', x: '6%',  y: '60%', size: 38, color: '#0d7a57', dur: 3.9, delay: 0.5 },
];

function FloatingQuran({ onOpen, isDark }) {
  const [rot, setRot] = useState({ x: -12, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragStart = useRef(null);
  const floatY = useSpring(0, { stiffness: 22, damping: 8 });

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, rot: { ...rot }, moved: false };
  };
  const onTouchStart = (e) => {
    setDragging(true);
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, rot: { ...rot }, moved: false };
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging || !dragStart.current) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      if (Math.abs(cx - dragStart.current.x) > 4 || Math.abs(cy - dragStart.current.y) > 4)
        dragStart.current.moved = true;
      setRot({
        x: Math.max(-45, Math.min(45, dragStart.current.rot.x - (cy - dragStart.current.y) * 0.35)),
        y: Math.max(-65, Math.min(65, dragStart.current.rot.y + (cx - dragStart.current.x) * 0.35)),
      });
    };
    const onUp = () => {
      if (dragStart.current && !dragStart.current.moved && onOpen) onOpen();
      setDragging(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, onOpen]);

  useEffect(() => {
    let up = true;
    const iv = setInterval(() => { if (!dragging) { floatY.set(up ? -16 : 0); up = !up; } }, 2000);
    return () => clearInterval(iv);
  }, [dragging, floatY]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 500, perspective: 1000 }}>
      {FLOATING_LETTERS.map((l, i) => (
        <motion.div key={i} drag
          dragConstraints={{ left: -70, right: 70, top: -70, bottom: 70 }}
          dragElastic={0.2} dragMomentum={false}
          animate={{ y: [0, -(14 + i * 1.5), 0], rotate: [0, 5, -4, 0] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: 'easeInOut' }}
          whileDrag={{ scale: 1.3, zIndex: 30, filter: `drop-shadow(0 0 18px ${l.color})` }}
          whileHover={{ scale: 1.15 }}
          style={{
            position: 'absolute', left: l.x, top: l.y,
            fontFamily: "'Cormorant Garamond',serif", fontSize: l.size,
            color: l.color, fontWeight: 700, cursor: 'grab', userSelect: 'none',
            textShadow: `0 0 20px ${l.color}55, 0 0 40px ${l.color}22`, zIndex: 5, lineHeight: 1,
          }}>
          {l.char}
        </motion.div>
      ))}

      <motion.div
        style={{ position: 'absolute', top: '50%', left: '50%', x: '-50%', y: floatY, marginTop: -110, cursor: dragging ? 'grabbing' : 'pointer', zIndex: 10, transformStyle: 'preserve-3d', userSelect: 'none' }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        animate={hovered && !dragging ? { filter: 'drop-shadow(0 0 32px rgba(201,168,76,0.6))' } : { filter: 'drop-shadow(0 0 0px rgba(201,168,76,0))' }}
        transition={{ duration: 0.3 }}>
        <div style={{ width: 170, height: 228, transformStyle: 'preserve-3d', transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`, transition: dragging ? 'none' : 'transform 1s cubic-bezier(.22,.68,0,1)', position: 'relative' }}>
          {/* Front */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#1a1a0e 0%,#0d0d07 50%,#111108 100%)', borderRadius: '4px 12px 12px 4px', transform: 'translateZ(18px)', boxShadow: '0 32px 80px rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 4, border: '2.5px solid #b8922a', borderRadius: 9, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(201,168,76,0.45)', borderRadius: 6, pointerEvents: 'none' }} />
            {[['top:10,left:10', ''], ['top:10,right:10', 'scaleX(-1)'], ['bottom:10,left:10', 'scaleY(-1)'], ['bottom:10,right:10', 'scale(-1,-1)']].map(([pos, transform], ci) => {
              const s = { position: 'absolute', width: 44, height: 44, opacity: 0.88, transform };
              pos.split(',').forEach(p => { const [k, v] = p.split(':'); s[k] = parseInt(v); });
              return (
                <svg key={ci} style={s} viewBox="0 0 44 44">
                  <g fill="none" stroke="#c9a84c" strokeWidth="0.9">
                    <path d="M2 2 Q11 2 11 11 Q11 2 20 2" /><path d="M2 2 Q2 11 11 11 Q2 11 2 20" />
                    <path d="M6 6 Q13 6 13 13 Q13 6 20 6" /><path d="M6 6 Q6 13 13 13 Q6 13 6 20" />
                    <circle cx="11" cy="11" r="3.5" fill="#c9a84c" opacity="0.6" /><circle cx="2" cy="2" r="1.2" fill="#c9a84c" />
                  </g>
                </svg>
              );
            })}
            <div style={{ position: 'relative', width: 110, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 110 130">
                <ellipse cx="55" cy="65" rx="52" ry="62" fill="#0d0d07" stroke="#c9a84c" strokeWidth="2.2" />
                <ellipse cx="55" cy="65" rx="46" ry="56" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" />
                <polygon points="55,3 58,10 55,17 52,10" fill="#c9a84c" opacity="0.9" />
                <polygon points="55,113 58,120 55,127 52,120" fill="#c9a84c" opacity="0.9" />
                <polygon points="3,65 10,62 17,65 10,68" fill="#c9a84c" opacity="0.9" />
                <polygon points="93,65 100,62 107,65 100,68" fill="#c9a84c" opacity="0.9" />
              </svg>
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', lineHeight: 1.3 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 9, color: 'rgba(201,168,76,0.7)', letterSpacing: '0.1em', marginBottom: 4 }}>بِسْمِ اللَّهِ</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: '#d4a83a', textShadow: '0 0 14px rgba(201,168,76,0.8)', lineHeight: 1.1 }}>القرآن</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, fontWeight: 600, color: 'rgba(201,168,76,0.8)', letterSpacing: '0.06em' }}>الكريم</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 7, color: 'rgba(201,168,76,0.45)', letterSpacing: '0.12em', marginTop: 4, textTransform: 'uppercase' }}>Al-Qur'an</div>
              </div>
            </div>
          </div>
          {/* Back */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#141408 0%,#0a0a05 100%)', borderRadius: '4px 12px 12px 4px', transform: 'rotateY(180deg) translateZ(18px)', boxShadow: '0 28px 70px rgba(0,0,0,0.85)' }}>
            <div style={{ position: 'absolute', inset: 5, border: '2px solid rgba(201,168,76,0.35)', borderRadius: 8 }} />
          </div>
          {/* Spine */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 36, height: '100%', background: 'linear-gradient(90deg,#060603,#111108 40%,#0a0a05 70%,#060603)', transform: 'rotateY(-90deg) translateZ(0) translateX(-18px)', borderRadius: '4px 0 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(201,168,76,0.2)' }}>
            <div style={{ writingMode: 'vertical-rl', fontFamily: "'Cormorant Garamond',serif", fontSize: 8.5, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.2em', transform: 'rotate(180deg)', textTransform: 'uppercase' }}>القرآن الكريم</div>
          </div>
          {/* Pages */}
          <div style={{ position: 'absolute', left: 4, right: 0, top: 0, height: 36, background: 'linear-gradient(180deg,#f0ebe0 0%,#e2d9c4 100%)', transform: 'rotateX(90deg) translateZ(0) translateY(-18px)' }} />
          <div style={{ position: 'absolute', left: 4, right: 0, bottom: 0, height: 36, background: 'linear-gradient(0deg,#f0ebe0 0%,#e2d9c4 100%)', transform: 'rotateX(-90deg) translateZ(0) translateY(18px)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 36, height: '100%', background: 'linear-gradient(90deg,#e2d9c4,#f0ebe0 40%,#e2d9c4)', transform: 'rotateY(90deg) translateZ(0) translateX(18px)' }} />
          {/* Bookmark */}
          <div style={{ position: 'absolute', bottom: -28, right: 28, width: 10, height: 56, background: 'linear-gradient(180deg,#c0192c 0%,#8b0f1e 70%,#6b0b17 100%)', transform: 'translateZ(16px)', zIndex: 20, clipPath: 'polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)', boxShadow: '1px 2px 8px rgba(0,0,0,0.5)' }} />
        </div>
      </motion.div>

      {/* Glow */}
      <motion.div style={{ y: floatY }} animate={{ opacity: [0.4, 0.7, 0.4], scaleX: [1, 1.08, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <div style={{ position: 'absolute', top: '64%', left: '50%', transform: 'translate(-50%,0)', width: 150, height: 28, background: 'radial-gradient(ellipse,rgba(201,168,76,0.3),transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
      </motion.div>

      {/* Hint */}
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: isDark ? 'rgba(242,237,230,0.3)' : 'rgba(20,18,16,0.35)', fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.1em', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <span>Cliquez pour lire · Glissez pour pivoter</span>
        <span style={{ color: 'rgba(154,111,30,0.55)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Déplacez les lettres</span>
      </div>
    </div>
  );
}

/* ── FEATURE CARD ────────────────────────────────────────────────── */
function FeatureCard({ icon, color, title, desc, delay, C, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [.22, .68, 0, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      style={{
        padding: '32px 28px', borderRadius: 20,
        background: isDark ? 'rgba(255,255,255,0.028)' : '#ffffff',
        border: `1px solid ${C.border}`,
        boxShadow: isDark ? 'none' : C.shadowSm,
        backdropFilter: isDark ? 'blur(12px)' : 'none',
        position: 'relative', overflow: 'hidden',
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}>
      {/* top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 28, right: 28, height: 2, background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />
      <div style={{ width: 52, height: 52, borderRadius: 16, background: `${color}14`, border: `1.5px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 20 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif", fontWeight: 400 }}>{desc}</p>
    </motion.div>
  );
}

/* ── TESTIMONIAL CARD ────────────────────────────────────────────── */
function Testimonial({ name, role, text, avatar, color, delay, C, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [.22, .68, 0, 1] }}
      style={{
        padding: '28px', borderRadius: 20,
        background: isDark ? 'rgba(255,255,255,0.025)' : '#ffffff',
        border: `1px solid ${C.border}`,
        boxShadow: isDark ? 'none' : C.shadowSm,
      }}>
      {/* Stars */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
        {[...Array(5)].map((_, i) => <Star key={i} size={13} fill={color} color={color} />)}
      </div>
      <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.75, marginBottom: 22, fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic' }}>"{text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${color}30, ${color}18)`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color, fontWeight: 700 }}>{avatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>{name}</div>
          <div style={{ fontSize: 11, color: C.dim, fontFamily: "'DM Sans',sans-serif", marginTop: 1 }}>{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── STAT PILL ───────────────────────────────────────────────────── */
function StatItem({ val, label, C, isDark }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, color: C.gold, lineHeight: 1 }}>{val}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, color: C.dim, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ── DATA ────────────────────────────────────────────────────────── */
const PHRASES = ["à votre rythme.", "avec l'IA.", "en famille.", "sans limite.", "avec passion."];

/* ── HOME ────────────────────────────────────────────────────────── */
export default function Home() {
  const { C, theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const typed = useTypewriter(PHRASES, 75, 1900);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOp = useTransform(scrollY, [0, 500], [1, 0]);

  const featRef = useRef(null);
  const testRef = useRef(null);
  const ctaRef = useRef(null);
  const featInView = useInView(featRef, { once: true, margin: '-80px' });
  const testInView = useInView(testRef, { once: true, margin: '-60px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });

  const FEATURES = [
    { icon: <BookOpen size={24} />, color: C.teal,    title: 'Alphabet & Phonétique', desc: "Maîtrisez les 28 lettres arabes avec audio natif et exercices interactifs conçus par des experts." },
    { icon: <Mic size={24} />,      color: C.purple,  title: 'Tajwid & Récitation',   desc: "Récitez le Coran avec perfection grâce à des cours structurés et une analyse vocale en temps réel." },
    { icon: <Zap size={24} />,      color: C.gold,    title: 'Tuteur IA 24h/24',      desc: "Un assistant intelligent répond à chaque question, adapte les exercices et guide votre progression." },
    { icon: <Trophy size={24} />,   color: C.red,     title: 'Gamification',          desc: "Badges, points XP, classements hebdomadaires — restez motivé à chaque étape de votre voyage." },
  ];

  const TESTIMONIALS = [
    { name: 'Yasmine B.', role: 'Étudiante · Paris',       text: "J'ai appris l'alphabet en 2 semaines. Les exercices interactifs et le tuteur IA sont absolument incroyables.", avatar: 'ي', color: C.teal },
    { name: 'Karim M.',   role: 'Étudiant · Lyon',         text: "Le cours de Tajwid a transformé ma récitation. La qualité pédagogique est au niveau des meilleures universités islamiques.", avatar: 'ك', color: C.purple },
    { name: 'Fatima S.',  role: 'Enseignante · Marseille', text: "La plateforme la plus complète pour l'enseignement islamique. Je la recommande à tous mes élèves sans hésitation.", avatar: 'ف', color: C.gold },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", position: 'relative', overflowX: 'hidden', background: C.bg, transition: 'background 0.3s' }}>
      <Helmet>
        <title>Safoua Academy — Apprendre le Coran & l'Arabe en ligne</title>
        <meta name="description" content="Rejoignez Safoua Academy pour apprendre le Coran, le Tajwid et l'Arabe grâce à l'IA et des experts." />
        <meta property="og:title" content="Safoua Academy" />
        <meta property="og:image" content="/images/og-cover.png" />
      </Helmet>

      <PageBg isDark={isDark} />

      {/* ════════════════ HERO ════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Parallax Arabic watermark */}
        <motion.div style={{ y: heroY, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(140px,38vw,600px)', color: isDark ? 'rgba(201,168,76,0.022)' : 'rgba(154,111,30,0.05)', lineHeight: 1, userSelect: 'none' }}>بسم</span>
        </motion.div>

        <motion.div style={{ opacity: heroOp }}
          className="hero-grid"
          style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* LEFT */}
          <div>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 99, background: isDark ? `${C.gold}15` : `${C.gold}12`, border: `1px solid ${C.gold}35`, fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24, fontFamily: "'DM Sans',sans-serif" }}>
              <Sparkles size={11} /> Plateforme Islamique · MERN + IA
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.08, ease: [.22, .68, 0, 1] }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 700, lineHeight: 1.05, color: C.text, marginBottom: 20, letterSpacing: '-0.03em' }}>
              Apprenez le Quran<br />& l'Arabe{' '}
              <em style={{ fontStyle: 'italic', color: C.gold, position: 'relative', display: 'inline-block', minWidth: '2ch' }}>
                {typed}
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.85, repeat: Infinity }}
                  style={{ display: 'inline-block', width: 3, height: '0.82em', background: C.gold, marginLeft: 3, verticalAlign: 'middle', borderRadius: 2 }} />
              </em>
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.18, ease: easeOut }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: 'italic', color: C.muted, lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
              Rejoignez Safoua Academy pour un apprentissage guidé par des experts, enrichi par l'intelligence artificielle.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.3, ease: easeOut }}
              className="hero-cta-row"
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.03, boxShadow: `0 8px 32px ${C.gold}45` }} whileTap={{ scale: 0.97 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 30px', borderRadius: 14, background: `linear-gradient(135deg, ${C.gold}, ${C.teal})`, color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: isDark ? `0 4px 24px ${C.gold}35` : `0 4px 20px ${C.gold}30` }}>
                  Commencer gratuitement <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/courses" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ borderColor: C.gold, color: C.gold }} whileTap={{ scale: 0.97 }}
                  style={{ padding: '14px 28px', borderRadius: 14, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s' }}>
                  Voir les cours
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.45 }}
              style={{ display: 'flex', gap: 0, paddingTop: 28, borderTop: `1px solid ${C.border}` }}>
              {[['9', 'Cours'], ['4k+', 'Étudiants'], ['98%', 'Réussite']].map(([val, lbl], i) => (
                <div key={lbl} style={{ flex: 1, textAlign: 'center', padding: '0 8px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                  <StatItem val={val} label={lbl} C={C} isDark={isDark} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Quran */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.25, ease: [.22, .68, 0, 1] }}
            style={{ position: 'relative', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className="hero-quran-col">
            <FloatingQuran onOpen={() => navigate('/quran')} isDark={isDark} />
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: isDark ? 0.3 : 0.4, zIndex: 1 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: C.gold, textTransform: 'uppercase' }}>Défiler</span>
          <ChevronDown size={13} color={C.gold} />
        </motion.div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
      <section ref={featRef} style={{ padding: '120px 24px', position: 'relative', zIndex: 1, background: isDark ? 'transparent' : 'linear-gradient(180deg, #ffffff 0%, #f8f6f1 100%)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={featInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, ease: easeOut }}
            style={{ textAlign: 'center', marginBottom: 72 }}>
            {/* Section eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 99, background: `${C.gold}12`, border: `1px solid ${C.gold}30`, fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>
              Pourquoi Safoua
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.2rem,4.5vw,3.4rem)', fontWeight: 700, color: C.text, lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: 14 }}>
              Une plateforme pensée<br />
              <em style={{ fontStyle: 'italic', color: C.gold }}>pour votre voyage spirituel</em>
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 17, color: C.muted, maxWidth: 520, margin: '0 auto' }}>
              Des outils modernes au service d'un apprentissage traditionnel et profond.
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} {...f} delay={i * 0.08} C={C} isDark={isDark} />)}
          </div>
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section ref={testRef} style={{ padding: '100px 24px', position: 'relative', zIndex: 1, background: isDark ? 'transparent' : '#ffffff' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={testInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 99, background: `${C.purple}12`, border: `1px solid ${C.purple}28`, fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>
              Témoignages
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: C.text, letterSpacing: '-0.025em' }}>
              Ils ont transformé leur apprentissage
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => <Testimonial key={i} {...t} delay={i * 0.1} C={C} isDark={isDark} />)}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section ref={ctaRef} style={{ padding: '100px 24px 130px', position: 'relative', zIndex: 1, background: isDark ? 'transparent' : 'linear-gradient(180deg, #f8f6f1 0%, #fff8ee 100%)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={ctaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [.22, .68, 0, 1] }}
            style={{
              padding: '64px 56px', borderRadius: 32, textAlign: 'center', position: 'relative', overflow: 'hidden',
              background: isDark
                ? `linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(29,181,132,0.05) 100%)`
                : `linear-gradient(135deg, #fffbf0 0%, #f0faf5 100%)`,
              border: `1px solid ${isDark ? `${C.gold}20` : `${C.gold}30`}`,
              boxShadow: isDark ? 'none' : `0 24px 80px rgba(154,111,30,0.1), 0 0 0 1px ${C.gold}10`,
            }}>
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `${C.gold}08`, filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: `${C.teal}06`, filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, color: `${C.gold}45`, marginBottom: 8, lineHeight: 1, direction: 'rtl' }}>بسم الله</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: C.text, marginBottom: 16, letterSpacing: '-0.025em' }}>
                Prêt à commencer votre voyage ?
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: C.muted, fontSize: 17, lineHeight: 1.75, maxWidth: 440, margin: '0 auto 40px' }}>
                Rejoignez des milliers d'étudiants qui apprennent l'arabe et le Coran sur Safoua Academy.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <motion.button whileHover={{ scale: 1.04, boxShadow: `0 8px 40px ${C.gold}50` }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '15px 36px', borderRadius: 14, background: `linear-gradient(135deg, ${C.gold}, ${C.teal})`, color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                    S'inscrire gratuitement →
                  </motion.button>
                </Link>
                <Link to="/courses" style={{ textDecoration: 'none' }}>
                  <motion.button whileHover={{ borderColor: C.gold, color: C.gold }} whileTap={{ scale: 0.97 }}
                    style={{ padding: '15px 28px', borderRadius: 14, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s' }}>
                    Voir les cours
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: rgba(154,111,30,0.2); }
        @media (max-width: 767px) {
          .hero-grid      { grid-template-columns: 1fr !important; padding-top: 100px !important; }
          .hero-quran-col { display: none !important; }
          .hero-cta-row   { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}