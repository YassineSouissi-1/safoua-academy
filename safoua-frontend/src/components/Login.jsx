/**
 * components/Login.jsx — Safoua Academy
 * Beautiful editorial design in both dark and light modes.
 */

import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { API_BASE } from '../config/api';
import { setToken } from '../utils/auth';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

/* ── BACKGROUND ─────────────────────────────────────────────────── */
function LoginBg({ isDark }) {
  if (isDark) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 130% 90% at 50% -5%, #0e1a0f 0%, #080b0f 45%, #06080f 100%)' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 700, height: '55vh', background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-8%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(29,181,132,0.04) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.018) 1px, transparent 1px)', backgroundSize: '88px 88px' }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#f8f6f1' }} />
      <div style={{ position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)', width: 700, height: '60vh', background: 'radial-gradient(ellipse, rgba(154,111,30,0.07) 0%, transparent 65%)', filter: 'blur(50px)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 400, height: 400, background: 'radial-gradient(circle, rgba(13,122,87,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(154,111,30,0.09) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
    </div>
  );
}

/* ── INPUT FIELD ─────────────────────────────────────────────────── */
function Field({ label, type: typeProp, placeholder, onChange, required, C, isDark }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = typeProp === 'password';
  const type = isPassword && show ? 'text' : typeProp;
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: focused ? C.gold : C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontFamily: "'DM Sans',sans-serif", transition: 'color 0.2s' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input type={type} placeholder={placeholder} onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: isPassword ? '13px 44px 13px 16px' : '13px 16px',
            borderRadius: 12, border: `1.5px solid ${focused ? C.gold : C.border}`,
            background: focused
              ? (isDark ? 'rgba(201,168,76,0.04)' : 'rgba(154,111,30,0.04)')
              : C.inputBg,
            color: C.text, fontSize: 14.5, outline: 'none',
            fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box',
            transition: 'border-color 0.2s, background 0.2s',
          }} />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.dim, padding: 0, display: 'flex' }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── LOGIN PAGE ──────────────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const { C, theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isErr, setIsErr] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const res = await axios.post(`${API_BASE}/api/login`, formData);
      const { token, user } = res.data;
      setToken(token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', user.role || 'student');
      setIsErr(false); setMessage('Connexion réussie !');
      setTimeout(() => navigate(from, { replace: true }), 900);
    } catch (err) {
      setIsErr(true);
      setMessage(err.response?.data?.error || 'Identifiants invalides');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#080b0f' : '#f8f6f1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.3s' }}>
      <Helmet>
        <title>Connexion — Safoua Academy</title>
        <meta name="description" content="Connectez-vous à votre espace Safoua Academy." />
      </Helmet>

      <LoginBg isDark={isDark} />

      {/* Arabic watermark */}
      <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', fontSize: 280, fontFamily: 'serif', lineHeight: 1, color: isDark ? 'rgba(201,168,76,0.03)' : 'rgba(154,111,30,0.05)', pointerEvents: 'none', userSelect: 'none', zIndex: 1 }}>الله</div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [.22, .68, 0, 1] }}
        style={{ maxWidth: 460, width: '100%', position: 'relative', zIndex: 2 }}>

        {/* Card */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.028)' : '#ffffff',
          backdropFilter: isDark ? 'blur(28px)' : 'none',
          borderRadius: 28,
          border: `1px solid ${C.border}`,
          padding: '48px 44px',
          boxShadow: isDark ? '0 40px 100px rgba(0,0,0,0.5)' : '0 8px 48px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)',
          transition: 'background 0.3s',
        }}>
          {/* Top accent */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${C.gold}, ${C.teal})`, borderRadius: '99px 99px 0 0', margin: '-48px -44px 40px', position: 'relative' }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <motion.div whileHover={{ scale: 1.06 }}
              style={{ width: 56, height: 56, borderRadius: 17, overflow: 'hidden', margin: '0 auto 18px', boxShadow: `0 0 24px ${C.gold}40` }}>
              <img src="/images/favicon-512.png" alt="Safoua Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${C.gold}14`, color: C.gold, border: `1px solid ${C.gold}30`, borderRadius: 99, padding: '4px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>
              <Sparkles size={10} /> Safoua Academy
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Bonjour !
            </h1>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>
              Connectez-vous pour reprendre votre voyage
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Email" type="email" placeholder="nom@exemple.com"
              onChange={e => setFormData({ ...formData, email: e.target.value })} required C={C} isDark={isDark} />
            <Field label="Mot de passe" type="password" placeholder="••••••••"
              onChange={e => setFormData({ ...formData, password: e.target.value })} required C={C} isDark={isDark} />

            {message && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '12px 16px', borderRadius: 12, background: isErr ? 'rgba(176,48,32,0.08)' : 'rgba(13,122,87,0.08)', color: isErr ? C.red : C.teal, border: `1px solid ${isErr ? C.red : C.teal}28`, fontSize: 13.5, fontWeight: 600, textAlign: 'center', fontFamily: "'DM Sans',sans-serif" }}>
                {message}
              </motion.div>
            )}

            <motion.button type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: `0 8px 32px ${C.gold}45` } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{ marginTop: 4, padding: '14px 24px', borderRadius: 14, background: `linear-gradient(135deg, ${C.gold}, ${C.teal})`, color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", opacity: loading ? 0.65 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}>
              {loading ? 'Connexion en cours…' : (<>Se connecter <ArrowRight size={15} /></>)}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13.5, color: C.muted, fontFamily: "'DM Sans',sans-serif" }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>S'inscrire</Link>
          </p>
        </div>

        {/* Quote */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
          style={{ textAlign: 'center', marginTop: 24, fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 14, color: C.dim, lineHeight: 1.75 }}>
          « Celui qui emprunte un chemin pour chercher la connaissance, Dieu lui facilite le chemin vers le Paradis. »
        </motion.p>
      </motion.div>

      <style>{`
        * { box-sizing: border-box; }
        ::placeholder { color: ${isDark ? 'rgba(242,237,230,0.2)' : 'rgba(20,18,16,0.3)'}; }
        ::selection { background: rgba(154,111,30,0.2); }
      `}</style>
    </div>
  );
}