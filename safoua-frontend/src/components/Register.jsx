import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Sparkles, CheckCircle, KeyRound, ArrowRight, Eye, EyeOff } from "lucide-react";
import { API_BASE } from "../config/api";
import { useTheme } from "../context/ThemeContext";

/* ── AMBIENT CANVAS ─────────────────────────────────── */
function AmbientBg({ isDark }) {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    let W=(canvas.width=window.innerWidth); let H=(canvas.height=window.innerHeight);
    const onResize=()=>{ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    window.addEventListener("resize",onResize);
    const pts=Array.from({length:45},()=>({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.2+0.3,
      vx:(Math.random()-0.5)*0.14, vy:(Math.random()-0.5)*0.12,
      a:Math.random()*Math.PI*2,
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach((p)=>{
        p.x+=p.vx; p.y+=p.vy; p.a+=0.0025;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        const alpha=(Math.sin(p.a)*0.5+0.5)*(isDark?0.4:0.2);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${isDark?"201,168,76":"160,120,40"},${alpha})`; ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ window.removeEventListener("resize",onResize); cancelAnimationFrame(raf); };
  },[isDark]);

  if(isDark) {
    return (
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 130% 90% at 50% -5%,#0e1a0f 0%,#080b0f 45%,#06080f 100%)" }}/>
        <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"min(800px,110vw)",height:"50vh",background:"radial-gradient(ellipse,rgba(201,168,76,0.055) 0%,transparent 65%)",filter:"blur(40px)" }}/>
        <div style={{ position:"absolute",top:"30%",right:"-8%",width:400,height:400,background:"radial-gradient(circle,rgba(29,181,132,0.04) 0%,transparent 65%)",filter:"blur(60px)" }}/>
        <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(201,168,76,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.018) 1px,transparent 1px)`,backgroundSize:"88px 88px" }}/>
        <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%" }}/>
      </div>
    );
  }

  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 130% 90% at 50% -5%,#ede4cc 0%,#f5f0e8 45%,#f0ebe0 100%)" }}/>
      <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"min(800px,110vw)",height:"50vh",background:"radial-gradient(ellipse,rgba(160,120,40,0.07) 0%,transparent 65%)",filter:"blur(40px)" }}/>
      <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(160,120,40,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(160,120,40,0.035) 1px,transparent 1px)`,backgroundSize:"88px 88px" }}/>
      <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%" }}/>
    </div>
  );
}

/* ── FIELD ─────────────────────────────────────────── */
function Field({ label, type, placeholder, value, onChange, required, accent, suffix, C }) {
  const [focused,setFocused] = useState(false);
  const accentColor = accent || C.gold;
  const borderColor = focused?`${accentColor}70`:C.border;
  const bg = focused?`${accentColor}07`:C.inputBg;

  return (
    <div>
      {label && (
        <label style={{ display:"block",fontSize:10,fontWeight:700,color:focused?accentColor:C.muted,
          textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,
          fontFamily:"'DM Sans',sans-serif",transition:"color 0.2s" }}>
          {label}
        </label>
      )}
      <div style={{ position:"relative" }}>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{ width:"100%",padding:suffix?"12px 48px 12px 16px":"12px 16px",borderRadius:12,
            border:`1.5px solid ${borderColor}`,background:bg,color:C.text,
            fontSize:14,outline:"none",fontFamily:"'DM Sans',sans-serif",
            boxSizing:"border-box",transition:"border-color 0.2s, background 0.2s" }}/>
        {suffix && (
          <div style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)" }}>
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── REGISTER PAGE ──────────────────────────────────── */
function Register() {
  const navigate = useNavigate();
  const { C, theme } = useTheme();
  const isDark = theme === "dark";

  const [formData,setFormData]   = useState({ username:"",email:"",password:"",role:"",teacherCode:"" });
  const [message,setMessage]     = useState("");
  const [loading,setLoading]     = useState(false);
  const [success,setSuccess]     = useState(false);
  const [countdown,setCountdown] = useState(3);
  const [showCode,setShowCode]   = useState(false);
  const [isErr,setIsErr]         = useState(false);

  useEffect(()=>{
    if(!success) return;
    if(countdown===0){ navigate("/login"); return; }
    const t=setTimeout(()=>setCountdown(c=>c-1),1000);
    return ()=>clearTimeout(t);
  },[success,countdown,navigate]);

  const handleRoleSelect=(role)=>{
    setFormData(prev=>({...prev,role,teacherCode:""}));
    setShowCode(false); setMessage("");
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.role){ setIsErr(true); setMessage("Veuillez sélectionner votre rôle."); return; }
    if(formData.role==="teacher"&&!formData.teacherCode.trim()){
      setIsErr(true); setMessage("Le code d'accès enseignant est requis."); return;
    }
    setLoading(true); setMessage("");
    try {
      const response=await axios.post(`${API_BASE}/api/register`,formData);
      setMessage(response.data.message); setIsErr(false); setSuccess(true);
    } catch(err) {
      setIsErr(true); setMessage(err.response?.data?.error||"Serveur injoignable");
    } finally { setLoading(false); }
  };

  const roles=[
    { value:"student", icon:<GraduationCap size={22}/>, label:"Étudiant",   sub:"J'apprends",
      accent:C.teal,   accentBg:`${C.teal}10`,   accentBorder:`${C.teal}40` },
    { value:"teacher", icon:<BookOpen size={22}/>,      label:"Enseignant", sub:"J'enseigne",
      accent:C.purple, accentBg:`${C.purple}10`,  accentBorder:`${C.purple}40` },
  ];

  const submitGlow = formData.role==="teacher"?`rgba(139,92,246,0.35)`:`rgba(29,181,132,0.32)`;

  return (
    <div style={{ minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",
      justifyContent:"center",padding:"100px 24px 48px",fontFamily:"'DM Sans',sans-serif",
      position:"relative",overflow:"hidden",transition:"background 0.3s" }}>
      <Helmet>
        <title>Inscription — Safoua Academy</title>
        <meta name="description" content="Créez votre compte gratuitement et commencez à apprendre le Coran et l'Arabe dès aujourd'hui."/>
      </Helmet>

      <AmbientBg isDark={isDark}/>

      {/* Arabic watermark */}
      <div style={{ position:"absolute",top:"-30px",right:"-50px",fontSize:"320px",fontFamily:"serif",
        lineHeight:1,color:isDark?"rgba(201,168,76,0.035)":"rgba(160,120,40,0.05)",
        pointerEvents:"none",userSelect:"none",zIndex:1 }}>
        بسم
      </div>

      <motion.div initial={{ opacity:0,y:28 }} animate={{ opacity:1,y:0 }}
        transition={{ duration:0.75,ease:[0.22,0.68,0,1] }}
        style={{ maxWidth:480,width:"100%",position:"relative",zIndex:2 }}>

        <div style={{ background:C.cardBg,backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",
          borderRadius:28,border:`1px solid ${C.border}`,padding:"44px 40px",
          boxShadow:C.shadow,transition:"background 0.3s, box-shadow 0.3s" }}>

          {/* Header */}
          <div style={{ textAlign:"center",marginBottom:36 }}>
            <motion.div whileHover={{ scale:1.08 }}
              style={{ width:54,height:54,borderRadius:16,overflow:"hidden",margin:"0 auto 18px",boxShadow:`0 0 22px ${C.gold}40` }}>
              <img src="/images/favicon-512.png" alt="Safoua Academy" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            </motion.div>
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:`${C.gold}18`,color:C.gold,
              border:`1px solid ${C.gold}35`,borderRadius:99,padding:"4px 14px",fontSize:10,
              fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14 }}>
              <Sparkles size={10}/> Safoua Academy
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,color:C.text,
              marginBottom:8,letterSpacing:"-0.02em",lineHeight:1.1 }}>
              Rejoignez-nous
            </h1>
            <p style={{ fontSize:13,color:C.muted,lineHeight:1.6 }}>
              Créez votre compte et commencez votre voyage
            </p>
          </div>

          {/* Divider */}
          <div style={{ height:1,background:`linear-gradient(90deg,transparent,${C.border},transparent)`,marginBottom:32 }}/>

          {/* SUCCESS / FORM */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }}
                exit={{ opacity:0 }} style={{ textAlign:"center",padding:"16px 0 8px" }}>
                <div style={{ width:68,height:68,borderRadius:20,background:`${C.teal}12`,
                  border:`1px solid ${C.teal}35`,display:"flex",alignItems:"center",justifyContent:"center",
                  margin:"0 auto 20px",color:C.teal }}>
                  <CheckCircle size={34}/>
                </div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:C.text,marginBottom:10 }}>
                  Compte créé !
                </h2>
                <p style={{ color:C.muted,fontSize:14,marginBottom:24,lineHeight:1.6 }}>
                  Redirection dans{" "}
                  <span style={{ color:C.tealL,fontWeight:700 }}>{countdown}s</span>…
                </p>
                <Link to="/login" style={{ textDecoration:"none" }}>
                  <motion.button whileHover={{ scale:1.03,boxShadow:`0 0 28px ${C.teal}45` }} whileTap={{ scale:0.97 }}
                    style={{ padding:"12px 28px",borderRadius:12,background:`linear-gradient(135deg,${C.gold},${C.teal})`,
                      color:"#ffffff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif",display:"inline-flex",alignItems:"center",gap:8 }}>
                    Se connecter <ArrowRight size={15}/>
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

                {/* Role picker */}
                <div style={{ marginBottom:28 }}>
                  <p style={{ fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",
                    letterSpacing:"0.12em",marginBottom:12,fontFamily:"'DM Sans',sans-serif" }}>
                    Je suis…
                  </p>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                    {roles.map((r)=>{
                      const sel=formData.role===r.value;
                      return (
                        <motion.button key={r.value} type="button" onClick={()=>handleRoleSelect(r.value)}
                          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                          style={{ padding:"18px 12px",borderRadius:16,
                            border:sel?`1.5px solid ${r.accentBorder}`:`1.5px solid ${C.border}`,
                            background:sel?r.accentBg:C.inputBg,
                            cursor:"pointer",transition:"all 0.2s",display:"flex",flexDirection:"column",
                            alignItems:"center",gap:7,
                            boxShadow:sel?`0 0 24px ${r.accent}22`:"none" }}>
                          <span style={{ color:sel?r.accent:C.muted,transition:"color 0.2s" }}>{r.icon}</span>
                          <span style={{ fontSize:14,fontWeight:700,color:sel?C.text:C.muted,
                            fontFamily:"'DM Sans',sans-serif",transition:"color 0.2s" }}>{r.label}</span>
                          <span style={{ fontSize:10,color:sel?C.muted:C.dim,fontWeight:600,
                            fontFamily:"'DM Sans',sans-serif" }}>{r.sub}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:18 }}>
                  <Field label="Nom d'utilisateur" type="text"     placeholder="Votre nom"
                    onChange={e=>setFormData({...formData,username:e.target.value})} required C={C}/>
                  <Field label="Email"              type="email"    placeholder="nom@exemple.com"
                    onChange={e=>setFormData({...formData,email:e.target.value})} required C={C}/>
                  <Field label="Mot de passe"       type="password" placeholder="••••••••"
                    onChange={e=>setFormData({...formData,password:e.target.value})} required C={C}/>

                  {/* Teacher code */}
                  <AnimatePresence>
                    {formData.role==="teacher" && (
                      <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:"auto" }}
                        exit={{ opacity:0,height:0 }} style={{ overflow:"hidden" }}>
                        <div style={{ padding:"18px",borderRadius:16,
                          background:`${C.purple}08`,border:`1.5px solid ${C.purple}30` }}>
                          <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:12 }}>
                            <KeyRound size={13} color={C.purple}/>
                            <span style={{ fontSize:10,fontWeight:700,color:C.purple,
                              textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"'DM Sans',sans-serif" }}>
                              Code d'accès enseignant
                            </span>
                          </div>
                          <Field label="" type={showCode?"text":"password"}
                            placeholder="Entrez le code secret"
                            value={formData.teacherCode}
                            onChange={e=>setFormData({...formData,teacherCode:e.target.value})}
                            required accent={C.purple}
                            suffix={
                              <button type="button" onClick={()=>setShowCode(s=>!s)}
                                style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",
                                  display:"flex",alignItems:"center",padding:0 }}>
                                {showCode?<EyeOff size={15}/>:<Eye size={15}/>}
                              </button>
                            } C={C}/>
                          <p style={{ fontSize:11,color:C.muted,marginTop:10,lineHeight:1.55,fontFamily:"'DM Sans',sans-serif" }}>
                            Ce code est fourni par l'administration de Safoua Academy.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Message */}
                  {message&&!success && (
                    <motion.div initial={{ opacity:0,y:-6 }} animate={{ opacity:1,y:0 }}
                      style={{ padding:"11px 16px",borderRadius:12,
                        background:isErr?"rgba(239,68,68,0.1)":"rgba(29,181,132,0.1)",
                        color:isErr?"#f87171":C.teal,
                        border:`1px solid ${isErr?"rgba(239,68,68,0.22)":"rgba(29,181,132,0.22)"}`,
                        fontSize:13,fontWeight:600,textAlign:"center",fontFamily:"'DM Sans',sans-serif" }}>
                      {message}
                    </motion.div>
                  )}

                  <motion.button type="submit" disabled={loading}
                    whileHover={!loading?{ scale:1.02,boxShadow:`0 0 32px ${submitGlow}` }:{}}
                    whileTap={!loading?{ scale:0.98 }:{}}
                    style={{ marginTop:4,padding:"13px 24px",borderRadius:14,
                      background:formData.role==="teacher"
                        ?`linear-gradient(135deg,${C.purple},${C.gold})`
                        :`linear-gradient(135deg,${C.gold},${C.teal})`,
                      color:"#ffffff",border:"none",fontWeight:700,fontSize:14,
                      cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",
                      opacity:loading?0.65:1,display:"flex",alignItems:"center",justifyContent:"center",
                      gap:8,transition:"opacity 0.15s" }}>
                    {loading?"Création en cours…":(<>Créer mon compte <ArrowRight size={15}/></>)}
                  </motion.button>
                </form>

                <p style={{ textAlign:"center",marginTop:24,fontSize:13,color:C.muted }}>
                  Déjà un compte ?{" "}
                  <Link to="/login" style={{ color:C.gold,fontWeight:700,textDecoration:"none" }}>
                    Se connecter
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quote */}
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5,duration:0.8 }}
          style={{ textAlign:"center",marginTop:24,fontFamily:"'Cormorant Garamond',serif",
            fontStyle:"italic",fontSize:14,color:C.dim,lineHeight:1.7 }}>
          « Celui qui emprunte un chemin pour chercher la connaissance, Dieu lui facilite le chemin vers le Paradis. »
        </motion.p>
      </motion.div>

      <style>{`
        * { box-sizing:border-box; }
        ::placeholder { color:${C.dim}; }
        ::selection { background:rgba(201,168,76,0.22); color:#f2ede6; }
      `}</style>
    </div>
  );
}

export default Register;