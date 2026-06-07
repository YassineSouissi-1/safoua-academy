import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";

export default function NotFound() {
  const numRef = useRef(null);

  useEffect(() => {
    let frame;
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      if (numRef.current)
        numRef.current.style.transform = `translateY(${Math.sin(t * 0.9) * 12}px)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      padding: "100px 24px 40px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Arabic watermark */}
      <div style={{
        position: "absolute", top: "-60px", right: "-60px",
        fontSize: "420px", fontFamily: "serif", lineHeight: 1,
        color: "rgba(255,255,255,0.025)", pointerEvents: "none", userSelect: "none",
      }}>٤٠٤</div>

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>

        {/* Animated 404 */}
        <div ref={numRef} style={{
          fontSize: "clamp(6rem, 20vw, 10rem)", fontWeight: 900,
          fontFamily: "'Playfair Display', Georgia, serif",
          background: "linear-gradient(135deg, #10b981, #34d399, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", lineHeight: 1, marginBottom: "24px",
          display: "inline-block",
        }}>404</div>

        <div style={{
          width: "64px", height: "64px", borderRadius: "20px",
          background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", color: "#34d399",
        }}>
          <BookOpen size={28} />
        </div>

        <h1 style={{
          fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 900, color: "#f1f5f9",
          fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "12px",
        }}>Page introuvable</h1>

        <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "380px", margin: "0 auto 36px", lineHeight: 1.7 }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <p style={{ fontFamily: "serif", fontSize: "18px", color: "rgba(255,255,255,0.15)", direction: "rtl", marginBottom: "36px" }}>
          وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "13px 24px", borderRadius: "14px",
              background: "#10b981", color: "#fff", border: "none",
              fontWeight: 900, fontSize: "14px", cursor: "pointer",
              fontFamily: "inherit", boxShadow: "0 0 20px rgba(16,185,129,0.35)",
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <Home size={16} /> Accueil
            </button>
          </Link>
          <Link to="/courses" style={{ textDecoration: "none" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "13px 24px", borderRadius: "14px",
              background: "rgba(255,255,255,0.06)", color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.12)",
              fontWeight: 900, fontSize: "14px", cursor: "pointer",
              fontFamily: "inherit", transition: "background 0.15s, transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}
            >
              <BookOpen size={16} /> Voir les cours
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}