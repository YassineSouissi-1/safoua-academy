import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Sparkles } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      setMessage("Erreur : Veuillez sélectionner votre rôle.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      setMessage(response.data.message);
    } catch (err) {
      setMessage("Erreur : " + (err.response?.data?.error || "Serveur injoignable"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #064e3b 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "100px 24px 40px",
      fontFamily: "system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative Arabic text */}
      <div style={{
        position: "absolute", top: "-40px", right: "-60px",
        fontSize: "360px", fontFamily: "serif", lineHeight: 1,
        color: "rgba(255,255,255,0.025)", pointerEvents: "none", userSelect: "none",
      }}>بسم</div>

      <div style={{
        maxWidth: "480px", width: "100%",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "40px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        position: "relative", zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: "#10b981",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: 900, color: "#fff",
            margin: "0 auto 16px",
            boxShadow: "0 0 24px rgba(16,185,129,0.4)",
          }}>س</div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(16,185,129,0.15)", color: "#34d399",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "99px", padding: "4px 14px",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: "12px",
          }}>
            <Sparkles size={10} /> Safoua Academy
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "26px", fontWeight: 900, color: "#fff", marginBottom: "6px",
          }}>Rejoignez-nous</h2>
          <p style={{ fontSize: "13px", color: "#64748b" }}>Créez votre compte et commencez votre voyage</p>
        </div>

        {/* Role Picker */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            Je suis...
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { value: "student", icon: <GraduationCap size={20} />, label: "Étudiant", sub: "J'apprends" },
              { value: "teacher", icon: <BookOpen size={20} />, label: "Enseignant", sub: "J'enseigne" },
            ].map((r) => {
              const selected = formData.role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  style={{
                    padding: "16px 12px", borderRadius: "16px",
                    border: selected ? "2px solid #10b981" : "2px solid rgba(255,255,255,0.1)",
                    background: selected ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    boxShadow: selected ? "0 0 20px rgba(16,185,129,0.2)" : "none",
                  }}
                >
                  <span style={{ color: selected ? "#34d399" : "#94a3b8", transition: "color 0.2s" }}>
                    {r.icon}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 900, color: selected ? "#fff" : "#94a3b8", transition: "color 0.2s" }}>
                    {r.label}
                  </span>
                  <span style={{ fontSize: "10px", color: selected ? "#6ee7b7" : "#475569", fontWeight: 600 }}>
                    {r.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { label: "Nom d'utilisateur", type: "text", key: "username", placeholder: "Votre nom" },
            { label: "Email", type: "email", key: "email", placeholder: "nom@exemple.com" },
            { label: "Mot de passe", type: "password", key: "password", placeholder: "••••••••" },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "7px" }}>
                {f.label}
              </label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                required
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: "12px",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)", color: "#fff",
                  fontSize: "13px", outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "4px", padding: "13px",
              borderRadius: "14px", background: "#10b981",
              color: "#fff", border: "none",
              fontWeight: 900, fontSize: "14px", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: loading ? 0.7 : 1,
              boxShadow: "0 0 20px rgba(16,185,129,0.35)",
              transition: "opacity 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            {loading ? "Création..." : "Créer mon compte →"}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: "16px", padding: "12px 16px", borderRadius: "12px",
            background: message.includes("Erreur") ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
            color: message.includes("Erreur") ? "#f87171" : "#34d399",
            border: `1px solid ${message.includes("Erreur") ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`,
            fontSize: "13px", fontWeight: 600, textAlign: "center",
          }}>
            {message}
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#475569" }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: "#34d399", fontWeight: 700, textDecoration: "none" }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;