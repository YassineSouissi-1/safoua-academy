import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { API_BASE } from "../config/api";
import { setToken } from "../utils/auth"; // ← NEW
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${API_BASE}/api/login`, formData);
      const { token, user } = response.data;

      // ✅ Store the JWT token (replaces storing username/role in plain localStorage)
      setToken(token);

      // Keep these for components that still read them directly (backwards compat)
      // You can remove them once all components use getUser() from auth.js
      localStorage.setItem("username", user.username);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role || "student");

      setMessage("Connexion réussie !");
      setTimeout(() => navigate(from, { replace: true }), 900);
    } catch (err) {
      setMessage("Erreur : " + (err.response?.data?.error || "Identifiants invalides"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #064e3b 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "100px 24px 40px", fontFamily: "system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", fontSize: "300px", fontFamily: "serif", lineHeight: 1, color: "rgba(255,255,255,0.025)", pointerEvents: "none", userSelect: "none" }}>الله</div>

      <div style={{
        maxWidth: "420px", width: "100%",
        background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)",
        padding: "40px", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", position: "relative", zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 900, color: "#fff", margin: "0 auto 16px", boxShadow: "0 0 24px rgba(16,185,129,0.4)" }}>س</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "99px", padding: "4px 14px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            <Sparkles size={10} /> Safoua Academy
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", fontWeight: 900, color: "#fff", marginBottom: "6px" }}>Bienvenue</h2>
          <p style={{ fontSize: "13px", color: "#64748b" }}>Connectez-vous à votre espace personnel</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { label: "Email",        type: "email",    key: "email",    placeholder: "nom@exemple.com" },
            { label: "Mot de passe", type: "password", key: "password", placeholder: "••••••••" },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "7px" }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ marginTop: "4px", padding: "13px", borderRadius: "14px", background: "#10b981", color: "#fff", border: "none", fontWeight: 900, fontSize: "14px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1, boxShadow: "0 0 20px rgba(16,185,129,0.35)", transition: "opacity 0.15s, transform 0.15s" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
            {loading ? "Connexion..." : "Se connecter →"}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "12px", background: message.includes("Erreur") ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)", color: message.includes("Erreur") ? "#f87171" : "#34d399", border: `1px solid ${message.includes("Erreur") ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`, fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
            {message}
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#475569" }}>
          Pas encore de compte ?{" "}
          <Link to="/register" style={{ color: "#34d399", fontWeight: 700, textDecoration: "none" }}>S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;