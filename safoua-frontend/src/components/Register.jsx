import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Sparkles, CheckCircle, KeyRound } from "lucide-react";
import { API_BASE } from "../config/api";

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "12px",
  border: "1.5px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)", color: "#fff",
  fontSize: "13px", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box", transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: "#94a3b8", textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: "7px",
};

function Register() {
  const navigate = useNavigate();

  const [formData,   setFormData]   = useState({ username: "", email: "", password: "", role: "", teacherCode: "" });
  const [message,    setMessage]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [countdown,  setCountdown]  = useState(3);
  const [showCode,   setShowCode]   = useState(false); // toggle code field visibility

  // ✅ Auto-redirect to /login after successful registration
  useEffect(() => {
    if (!success) return;
    if (countdown === 0) { navigate("/login"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, navigate]);

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role, teacherCode: "" }));
    setShowCode(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) { setMessage("Erreur : Veuillez sélectionner votre rôle."); return; }
    if (formData.role === "teacher" && !formData.teacherCode.trim()) {
      setMessage("Erreur : Le code d'accès enseignant est requis."); return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${API_BASE}/api/register`, formData);
      setMessage(response.data.message);
      setSuccess(true);
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
      padding: "100px 24px 40px", fontFamily: "system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Arabic watermark */}
      <div style={{
        position: "absolute", top: "-40px", right: "-60px",
        fontSize: "360px", fontFamily: "serif", lineHeight: 1,
        color: "rgba(255,255,255,0.025)", pointerEvents: "none", userSelect: "none",
      }}>بسم</div>

      <div style={{
        maxWidth: "480px", width: "100%",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)",
        padding: "40px", boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        position: "relative", zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px", background: "#10b981",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: 900, color: "#fff",
            margin: "0 auto 16px", boxShadow: "0 0 24px rgba(16,185,129,0.4)",
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
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", fontWeight: 900, color: "#fff", marginBottom: "6px" }}>
            Rejoignez-nous
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b" }}>Créez votre compte et commencez votre voyage</p>
        </div>

        {/* ✅ Success screen with countdown */}
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "20px",
              background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", color: "#34d399",
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 900, color: "#fff", marginBottom: "8px" }}>
              Compte créé !
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
              Redirection dans <span style={{ color: "#34d399", fontWeight: 900 }}>{countdown}s</span>…
            </p>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button style={{ padding: "10px 24px", borderRadius: "12px", background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
                Se connecter maintenant →
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Role Picker */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                Je suis...
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { value: "student", icon: <GraduationCap size={20} />, label: "Étudiant",   sub: "J'apprends",  accent: "#10b981" },
                  { value: "teacher", icon: <BookOpen size={20} />,      label: "Enseignant", sub: "J'enseigne",  accent: "#8b5cf6" },
                ].map((r) => {
                  const selected = formData.role === r.value;
                  return (
                    <button key={r.value} type="button" onClick={() => handleRoleSelect(r.value)}
                      style={{
                        padding: "16px 12px", borderRadius: "16px",
                        border: selected ? `2px solid ${r.accent}` : "2px solid rgba(255,255,255,0.1)",
                        background: selected ? `${r.accent}22` : "rgba(255,255,255,0.04)",
                        cursor: "pointer", transition: "all 0.2s",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                        boxShadow: selected ? `0 0 20px ${r.accent}30` : "none",
                      }}>
                      <span style={{ color: selected ? r.accent : "#94a3b8", transition: "color 0.2s" }}>{r.icon}</span>
                      <span style={{ fontSize: "13px", fontWeight: 900, color: selected ? "#fff" : "#94a3b8" }}>{r.label}</span>
                      <span style={{ fontSize: "10px", color: selected ? "#94a3b8" : "#475569", fontWeight: 600 }}>{r.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Nom d'utilisateur", type: "text",     key: "username", placeholder: "Votre nom" },
                { label: "Email",              type: "email",    key: "email",    placeholder: "nom@exemple.com" },
                { label: "Mot de passe",       type: "password", key: "password", placeholder: "••••••••" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "#10b981"}
                    onBlur={(e)  => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>
              ))}

              {/* ✅ Teacher code field — only shown when "Enseignant" is selected */}
              {formData.role === "teacher" && (
                <div style={{
                  padding: "14px", borderRadius: "14px",
                  background: "rgba(139,92,246,0.08)",
                  border: "1.5px solid rgba(139,92,246,0.25)",
                  animation: "fadeIn 0.25s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                    <KeyRound size={14} color="#a78bfa" />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      Code d'accès enseignant
                    </span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showCode ? "text" : "password"}
                      placeholder="Entrez le code secret"
                      value={formData.teacherCode}
                      onChange={(e) => setFormData({ ...formData, teacherCode: e.target.value })}
                      required
                      style={{ ...inputStyle, borderColor: "rgba(139,92,246,0.3)", paddingRight: "44px" }}
                      onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                      onBlur={(e)  => e.target.style.borderColor = "rgba(139,92,246,0.3)"}
                    />
                    {/* Show/hide toggle */}
                    <button type="button" onClick={() => setShowCode(s => !s)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "11px", fontWeight: 700 }}>
                      {showCode ? "Cacher" : "Voir"}
                    </button>
                  </div>
                  <p style={{ fontSize: "11px", color: "#64748b", marginTop: "8px", lineHeight: 1.5 }}>
                    Ce code est fourni par l'administration de Safoua Academy.
                  </p>
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  marginTop: "4px", padding: "13px", borderRadius: "14px",
                  background: formData.role === "teacher" ? "#8b5cf6" : "#10b981",
                  color: "#fff", border: "none", fontWeight: 900, fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: formData.role === "teacher" ? "0 0 20px rgba(139,92,246,0.35)" : "0 0 20px rgba(16,185,129,0.35)",
                  transition: "opacity 0.15s, transform 0.15s, background 0.2s",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
                {loading ? "Création..." : "Créer mon compte →"}
              </button>
            </form>

            {/* Error message */}
            {message && !success && (
              <div style={{
                marginTop: "16px", padding: "12px 16px", borderRadius: "12px",
                background: "rgba(239,68,68,0.12)", color: "#f87171",
                border: "1px solid rgba(239,68,68,0.25)",
                fontSize: "13px", fontWeight: 600, textAlign: "center",
              }}>
                {message}
              </div>
            )}

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#475569" }}>
              Déjà un compte ?{" "}
              <Link to="/login" style={{ color: "#34d399", fontWeight: 700, textDecoration: "none" }}>Se connecter</Link>
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default Register;