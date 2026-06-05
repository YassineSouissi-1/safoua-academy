import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

const TECH_STACK = [
  { name: "MongoDB", desc: "Base de données", color: "#4ade80" },
  { name: "Express.js", desc: "Backend API", color: "#60a5fa" },
  { name: "React.js", desc: "Interface", color: "#38bdf8" },
  { name: "Node.js", desc: "Runtime", color: "#86efac" },
];

function Footer() {
  return (
    <footer style={{ background: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

          {/* Brand — 4 col */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl text-white transition-transform group-hover:scale-110"
                style={{ background: "#10b981" }}>
                س
              </div>
              <span className="text-xl font-black text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Safoua Academy
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Plateforme éducative MERN dédiée à l'excellence dans les sciences islamiques et la langue arabe. Apprenez à votre rythme, guidé par des experts.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: <Github size={17} />, href: "#" },
                { icon: <Twitter size={17} />, href: "#" },
                { icon: <Linkedin size={17} />, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-emerald-500"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation — 2 col */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-5">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: "Accueil", to: "/" },
                { label: "Catalogue", to: "/courses" },
                { label: "Mon Espace", to: "/dashboard" },
                { label: "Connexion", to: "/login" },
                { label: "Inscription", to: "/register" },
              ].map((l, i) => (
                <li key={i}>
                  <Link to={l.to}
                    className="text-slate-400 text-sm font-semibold hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack — 3 col */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-5">Stack MERN</h4>
            <div className="space-y-3">
              {TECH_STACK.map((tech, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: tech.color }} />
                  <div>
                    <span className="text-sm font-black" style={{ color: tech.color }}>{tech.name}</span>
                    <span className="text-slate-500 text-xs ml-2">{tech.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Badge */}
            <div className="mt-6 p-4 rounded-2xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">+ IA Integration</p>
              <p className="text-xs text-slate-400">Chatbot · Traducteur · Quiz adaptatif</p>
            </div>
          </div>

          {/* Contact — 3 col */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-4">
              {[
                { icon: <Mail size={16} />, label: "contact@safoua.edu", href: "mailto:contact@safoua.edu" },
                { icon: <Phone size={16} />, label: "+216 00 000 000", href: "tel:+21600000000" },
                { icon: <MapPin size={16} />, label: "Tunis, Tunisie", href: "#" },
              ].map((c, i) => (
                <li key={i}>
                  <a href={c.href} className="flex items-center gap-3 text-slate-400 text-sm font-semibold hover:text-emerald-400 transition-colors">
                    <span style={{ color: "#10b981" }}>{c.icon}</span>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Project badge */}
            <div className="mt-6 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs text-slate-500 font-semibold">Projet de Fin d'Études</p>
              <p className="text-sm font-black text-white">L3 Informatique — 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider with Arabic text decoration */}
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © 2026 Safoua Academy. Tous droits réservés.
          </p>
          <p className="text-slate-600 text-xs font-semibold" style={{ fontFamily: "serif", direction: "rtl" }}>
            بسم الله الرحمن الرحيم
          </p>
          <p className="text-slate-500 text-xs">
            Conçu avec ❤️ pour la communauté
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;