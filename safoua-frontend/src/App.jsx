import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, NavLink } from "react-router-dom";
import { LogOut, Menu, X, Sparkles } from "lucide-react";
import Register from "./components/Register";
import Courses from "./components/Courses";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CourseDetail from "./components/CourseDetail";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AlphabetArabe from "./components/courses/AlphabetArabe";
import Tajwid from "./components/courses/Tajwid";
import Memorisation from "./components/courses/Memorisation";
import Grammaire from "./components/courses/Grammaire";
import Fiqh from "./components/courses/Fiqh";
import Sira from "./components/courses/Sira";
import Calligraphy from "./components/courses/Calligraphy";
import BecomeMuslim from "./components/courses/BecomeMuslim";

/* ─── CursorSparks ─────────────────────────────────────────────── */
function CursorSparks() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -999, y: -999 });
  const rafRef = useRef(null);
  const lastEmit = useRef(0);
  const COLORS = ["#10b981", "#34d399", "#f59e0b", "#fbbf24", "#8b5cf6", "#a78bfa", "#ffffff"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.current = { x: cx, y: cy };
      const now = Date.now();
      if (now - lastEmit.current < 18) return;
      lastEmit.current = now;
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 2.2;
        const size = 2 + Math.random() * 4;
        particles.current.push({
          x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.2,
          size, maxSize: size, color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 1, decay: 0.018 + Math.random() * 0.022,
          rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.15,
          shape: Math.random() > 0.5 ? "circle" : "star",
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });

    const drawStar = (ctx, x, y, r, rotation) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a  = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const ai = (i * 4 * Math.PI) / 5 + (2 * Math.PI) / 5 - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else         ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(ai) * (r * 0.45), Math.sin(ai) * (r * 0.45));
      }
      ctx.closePath(); ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.life > 0);
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.vx *= 0.98;
        p.life -= p.decay; p.rotation += p.rotSpeed; p.size = p.maxSize * p.life;
        ctx.globalAlpha = Math.max(0, p.life * 0.9);
        ctx.fillStyle = p.color;
        if (p.shape === "star") { drawStar(ctx, p.x, p.y, p.size, p.rotation); ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.1, p.size / 2), 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", mixBlendMode: "screen" }}
    />
  );
}

/* ─── Home ─────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "📖", title: "Alphabet & Phonétique",  desc: "Maîtrisez les 28 lettres arabes avec audio et exercices interactifs." },
  { icon: "🕌", title: "Tajwid & Coran",          desc: "Récitez le Coran avec perfection grâce à des cours structurés." },
  { icon: "🤖", title: "Tuteur IA",               desc: "Un assistant intelligent disponible 24h/24 pour répondre à vos questions." },
  { icon: "🏆", title: "Gamification",            desc: "Gagnez des badges et des points XP à chaque leçon complétée." },
];
const STATS = [
  { value: "4k+", label: "Étudiants" },
  { value: "9",   label: "Cours" },
  { value: "98%", label: "Réussite" },
  { value: "6",   label: "Experts" },
];

const Home = () => (
  <div style={{ fontFamily: "system-ui, sans-serif" }}>
    {/* Hero */}
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%)",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", userSelect: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", fontSize: "480px", fontFamily: "serif", lineHeight: 1, color: "rgba(255,255,255,0.025)" }}>بسم</div>
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", fontSize: "280px", fontFamily: "serif", lineHeight: 1, color: "rgba(255,255,255,0.025)" }}>الله</div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "720px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "99px", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "28px" }}>
            <Sparkles size={12} /> Plateforme Éducative Islamique · MERN + IA
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.08, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "20px" }}>
            Apprenez le Coran & l'Arabe{" "}<span style={{ color: "#34d399" }}>à votre rythme.</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "18px", lineHeight: 1.7, marginBottom: "36px", maxWidth: "560px" }}>
            Rejoignez Safoua Academy pour un apprentissage guidé par des experts, enrichi par l'intelligence artificielle et la technologie moderne.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button
                style={{ padding: "14px 28px", borderRadius: "14px", background: "#10b981", color: "#fff", border: "none", fontWeight: 900, fontSize: "15px", cursor: "pointer", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Commencer gratuitement →
              </button>
            </Link>
            <Link to="/courses" style={{ textDecoration: "none" }}>
              <button
                style={{ padding: "14px 28px", borderRadius: "14px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", fontWeight: 900, fontSize: "15px", cursor: "pointer", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              >
                Voir les cours
              </button>
            </Link>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "72px" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "20px 12px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "36px", fontWeight: 900, color: "#34d399", lineHeight: 1, marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: "96px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, color: "#0f172a", marginBottom: "12px" }}>
            Pourquoi Safoua Academy ?
          </h2>
          <p style={{ color: "#64748b", fontSize: "16px", maxWidth: "480px", margin: "0 auto" }}>
            Une plateforme pensée pour l'apprentissage islamique, enrichie par la technologie.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{ background: "#fff", padding: "28px 24px", borderRadius: "20px", border: "1px solid #e2e8f0", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "17px", fontWeight: 900, color: "#0f172a", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "96px 24px", background: "#0f172a" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, color: "#fff", marginBottom: "16px" }}>
          Prêt à commencer votre voyage ?
        </h2>
        <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "36px", lineHeight: 1.6 }}>
          Rejoignez des milliers d'étudiants qui apprennent l'arabe et le Coran sur Safoua Academy.
        </p>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <button
            style={{ padding: "16px 36px", borderRadius: "16px", background: "#10b981", color: "#fff", border: "none", fontWeight: 900, fontSize: "16px", cursor: "pointer", fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            S'inscrire maintenant — C'est gratuit
          </button>
        </Link>
      </div>
    </section>
  </div>
);

/* ─── Navbar ────────────────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Re-read from localStorage on every render so logout/login is reflected immediately
  const isLoggedIn = !!localStorage.getItem("username");
  const userRole   = localStorage.getItem("userRole");

  const darkPages = ["/", "/courses"];
  const alwaysDark = darkPages.some(p =>
    p === "/" ? location.pathname === "/" : location.pathname.startsWith(p)
  );

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  const showSolidBg = !alwaysDark && scrolled;
  const transparent = alwaysDark && !scrolled;
  const navBg =
    showSolidBg  ? "rgba(255,255,255,0.97)"  :
    transparent  ? "transparent"              :
    alwaysDark   ? "rgba(10, 20, 14, 0.72)"  : "rgba(255,255,255,0.97)";
  const navBorder = showSolidBg ? "1px solid #f1f5f9" : alwaysDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9";
  const textColor  = alwaysDark ? "rgba(255,255,255,0.8)" : "#475569";
  const logoColor  = alwaysDark ? "#ffffff" : "#0f172a";
  const activeColor = "#10b981";
  const iconColor  = alwaysDark ? "rgba(255,255,255,0.8)" : "#0f172a";

  const navLinkStyle = ({ isActive }) => ({
    fontSize: "14px", fontWeight: 700, textDecoration: "none",
    color: isActive ? activeColor : textColor, transition: "color 0.15s",
    borderBottom: isActive ? `2px solid ${activeColor}` : "2px solid transparent",
    paddingBottom: "2px",
  });

  // Role badge shown next to "Mon Espace"
  const roleBadge = userRole === "teacher"
    ? <span style={{ fontSize: "9px", fontWeight: 700, background: "rgba(139,92,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "99px", padding: "2px 7px", marginLeft: "6px" }}>Enseignant</span>
    : userRole === "student"
    ? <span style={{ fontSize: "9px", fontWeight: 700, background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "99px", padding: "2px 7px", marginLeft: "6px" }}>Étudiant</span>
    : null;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "72px",
        display: "flex", alignItems: "center", padding: "0 24px",
        background: navBg, borderBottom: navBorder,
        backdropFilter: transparent ? "none" : "blur(20px)",
        WebkitBackdropFilter: transparent ? "none" : "blur(20px)",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 900, color: "#fff", boxShadow: alwaysDark ? "0 0 16px rgba(16,185,129,0.35)" : "none", transition: "box-shadow 0.3s" }}>س</div>
            <span style={{ fontSize: "18px", fontWeight: 900, color: logoColor, fontFamily: "'Playfair Display', Georgia, serif", transition: "color 0.3s" }}>Safoua Academy</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }} className="hidden-mobile">
            <NavLink to="/" end style={navLinkStyle}>Accueil</NavLink>
            <NavLink to="/courses" style={navLinkStyle}>Cours</NavLink>
            <div style={{ width: "1px", height: "18px", background: alwaysDark ? "rgba(255,255,255,0.15)" : "#e2e8f0" }} />
            {isLoggedIn ? (
              <>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <NavLink to="/dashboard" style={navLinkStyle}>Mon Espace</NavLink>
                  {roleBadge}
                </div>
                <button
                  onClick={handleLogout}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", background: alwaysDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.22)"}
                  onMouseLeave={e => e.currentTarget.style.background = alwaysDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)"}
                >
                  <LogOut size={14} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={navLinkStyle}>Connexion</NavLink>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <button
                    style={{ padding: "8px 18px", borderRadius: "10px", background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", boxShadow: alwaysDark ? "0 0 12px rgba(16,185,129,0.3)" : "none", transition: "opacity 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    S'inscrire
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="show-mobile"
            style={{ background: "none", border: "none", color: iconColor, cursor: "pointer", padding: "6px", display: "none" }}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: "72px", left: 0, right: 0, zIndex: 49, background: alwaysDark ? "rgba(10,20,14,0.97)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${alwaysDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"}`, padding: "12px 24px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", animation: "slideDown 0.18s ease" }}>
          {[
            { label: "Accueil",    to: "/" },
            { label: "Cours",      to: "/courses" },
            ...(isLoggedIn
              ? [{ label: "Mon Espace", to: "/dashboard" }]
              : [{ label: "Connexion", to: "/login" }, { label: "S'inscrire", to: "/register" }]
            ),
          ].map((l, i) => (
            <Link
              key={i} to={l.to} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "13px 0", fontSize: "15px", fontWeight: 700, color: alwaysDark ? "rgba(255,255,255,0.8)" : "#334155", textDecoration: "none", borderBottom: `1px solid ${alwaysDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"}`, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#10b981"}
              onMouseLeave={e => e.currentTarget.style.color = alwaysDark ? "rgba(255,255,255,0.8)" : "#334155"}
            >
              {l.label}
            </Link>
          ))}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              style={{ marginTop: "12px", background: "none", border: "none", color: "#ef4444", fontWeight: 700, fontSize: "15px", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
            >
              Déconnexion
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .hidden-mobile { display: flex; }
        .show-mobile   { display: none !important; }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
        }
      `}</style>
    </>
  );
}

/* ─── App ───────────────────────────────────────────────────────── */
function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
        <CursorSparks />
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/courses"       element={<Courses />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/course-view/1" element={<AlphabetArabe />} />
            <Route path="/course-view/2" element={<Tajwid />} />
            <Route path="/course-view/3" element={<Memorisation />} />
            <Route path="/course-view/4" element={<Grammaire />} />
            <Route path="/course-view/5" element={<Fiqh />} />
            <Route path="/course-view/6" element={<Sira />} />
            <Route path="/course-view/7" element={<Calligraphy />} />
            <Route path="/course-view/8" element={<BecomeMuslim />} />
            <Route path="/course-view/:id" element={<CourseDetail />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;