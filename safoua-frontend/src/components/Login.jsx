import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { API_BASE } from "../config/api";
import { setToken } from "../utils/auth";
import axios from "axios";

/* ── PALETTE ─────────────────────────────────────────── */
const C = {
  bg:     "#080b0f",
  gold:   "#c9a84c",
  goldL:  "#e8c97a",
  teal:   "#1db584",
  tealL:  "#25d4a0",
  text:   "#f2ede6",
  muted:  "rgba(242,237,230,0.45)",
  dim:    "rgba(242,237,230,0.16)",
  border: "rgba(255,255,255,0.07)",
};

/* ── AMBIENT CANVAS ─────────────────────────────────── */
function AmbientBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    const pts = Array.from({ length: 45 }, () => ({
      x:  Math.random() * W,  y:  Math.random() * H,
      r:  Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.12,
      a:  Math.random() * Math.PI * 2,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.a += 0.0025;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const alpha = (Math.sin(p.a) * 0.5 + 0.5) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {/* base dark */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 130% 90% at 50% -5%,#0e1a0f 0%,#080b0f 45%,#06080f 100%)" }} />
      {/* gold glow top-center */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "min(800px,110vw)", height: "50vh", background: "radial-gradient(ellipse,rgba(201,168,76,0.055) 0%,transparent 65%)", filter: "blur(40px)" }} />
      {/* teal glow right */}
      <div style={{ position: "absolute", top: "30%", right: "-8%", width: 400, height: 400, background: "radial-gradient(circle,rgba(29,181,132,0.04) 0%,transparent 65%)", filter: "blur(60px)" }} />
      {/* subtle grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.018) 1px,transparent 1px)`, backgroundSize: "88px 88px" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}

/* ── FIELD ─────────────────────────────────────────── */
function Field({ label, type, placeholder, onChange, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: focused ? C.gold : C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, fontFamily: "'DM Sans',sans-serif", transition: "color 0.2s" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 16px", borderRadius: 12,
          border: `1.5px solid ${focused ? "rgba(201,168,76,0.45)" : C.border}`,
          background: focused ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.04)",
          color: C.text, fontSize: 14, outline: "none",
          fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box",
          transition: "border-color 0.2s, background 0.2s",
        }}
      />
    </div>
  );
}

/* ── LOGIN PAGE ─────────────────────────────────────── */
function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message,  setMessage]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [isErr,    setIsErr]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${API_BASE}/api/login`, formData);
      const { token, user } = response.data;
      setToken(token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role || "student");
      setIsErr(false);
      setMessage("Connexion réussie !");
      setTimeout(() => navigate(from, { replace: true }), 900);
    } catch (err) {
      setIsErr(true);
      setMessage(err.response?.data?.error || "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 48px", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <Helmet>
        <title>Connexion — Safoua Academy</title>
        <meta name="description" content="Connectez-vous à votre espace personnel Safoua Academy et reprenez votre apprentissage." />
      </Helmet>

      <AmbientBg />

      {/* Arabic watermark */}
      <div style={{ position: "absolute", bottom: "-60px", left: "-40px", fontSize: "280px", fontFamily: "serif", lineHeight: 1, color: "rgba(201,168,76,0.04)", pointerEvents: "none", userSelect: "none", zIndex: 1 }}>
        الله
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 0.68, 0, 1] }}
        style={{ maxWidth: 440, width: "100%", position: "relative", zIndex: 2 }}
      >
        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.028)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderRadius: 28, border: `1px solid ${C.border}`, padding: "44px 40px", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            {/* Logo badge */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              style={{ width: 54, height: 54, borderRadius: 16, overflow: "hidden", margin: "0 auto 18px", boxShadow: `0 0 22px ${C.gold}40` }}
            >
              <img src="/images/favicon-512.png" alt="Safoua Academy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.1)", color: C.gold, border: "1px solid rgba(201,168,76,0.28)", borderRadius: 99, padding: "4px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
              <Sparkles size={10} /> Safoua Academy
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 8, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Bonjour !
            </h1>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              Connectez-vous pour reprendre votre voyage
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${C.border},transparent)`, marginBottom: 32 }} />

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field
              label="Email"
              type="email"
              placeholder="nom@exemple.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Field
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "11px 16px", borderRadius: 12,
                  background: isErr ? "rgba(239,68,68,0.1)" : "rgba(29,181,132,0.1)",
                  color: isErr ? "#f87171" : C.tealL,
                  border: `1px solid ${isErr ? "rgba(239,68,68,0.22)" : "rgba(29,181,132,0.22)"}`,
                  fontSize: 13, fontWeight: 600, textAlign: "center",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {message}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: `0 0 32px rgba(201,168,76,0.35)` } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{
                marginTop: 4, padding: "13px 24px", borderRadius: 14,
                background: `linear-gradient(135deg,${C.gold},${C.teal})`,
                color: "#080b0f", border: "none", fontWeight: 700, fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans',sans-serif",
                opacity: loading ? 0.65 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Connexion en cours…" : (<>Se connecter <ArrowRight size={15} /></>)}
            </motion.button>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: C.muted }}>
            Pas encore de compte ?{" "}
            <Link to="/register" style={{ color: C.gold, fontWeight: 700, textDecoration: "none" }}>
              S'inscrire
            </Link>
          </p>
        </div>

        {/* Quote below card */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ textAlign: "center", marginTop: 24, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 14, color: C.dim, lineHeight: 1.7 }}
        >
          « Celui qui emprunte un chemin pour chercher la connaissance, Dieu lui facilite le chemin vers le Paradis. »
        </motion.p>
      </motion.div>

      <style>{`
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(242,237,230,0.22); }
        ::selection { background: rgba(201,168,76,0.22); color: #f2ede6; }
      `}</style>
    </div>
  );
}

export default Login;