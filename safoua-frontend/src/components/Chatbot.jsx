import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader, Sparkles, ChevronDown } from "lucide-react";
import { API_BASE } from "../config/api";
import { getToken } from "../utils/auth"; // ← FIXED: use the shared auth utility

const SUGGESTED = [
  "Comment apprendre l'alphabet arabe ?",
  "C'est quoi le Tajwid ?",
  "Comment réserver une session ?",
];

function ChatBot() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [input,     setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages,  setMessages]  = useState([
    { role: "bot", text: "السلام عليكم 👋\nJe suis l'assistant IA de Safoua Academy. Je peux vous aider avec vos cours, le Tajwid, l'arabe, et bien plus !" }
  ]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef  = useRef(null);
  const messagesAreaRef = useRef(null);
  const inputRef        = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  const handleScroll = () => {
    const el = messagesAreaRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsLoading(true);

    // ── FIXED: use getToken() which reads from 'safoua_token' ──────
    const token = getToken();

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: msg }),
      });

      // Handle auth errors gracefully
      if (res.status === 401 || res.status === 403) {
        setMessages(prev => [
          ...prev,
          { role: "bot", text: "🔒 Veuillez vous connecter pour utiliser le chat." }
        ]);
        return;
      }

      // Handle unexpected server errors
      if (!res.ok) {
        setMessages(prev => [
          ...prev,
          { role: "bot", text: "⚠️ Une erreur serveur s'est produite. Réessayez dans quelques instants." }
        ]);
        return;
      }

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "bot", text: data.reply || "Désolé, une erreur s'est produite." }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "⚠️ Impossible de joindre le serveur. Vérifiez votre connexion." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const G = {
    bg:      "#080b0f",
    surface: "rgba(13,17,23,0.97)",
    card:    "rgba(255,255,255,0.04)",
    border:  "rgba(255,255,255,0.08)",
    gold:    "#c9a84c",
    teal:    "#1db584",
    text:    "#f2ede6",
    muted:   "rgba(242,237,230,0.5)",
    dim:     "rgba(242,237,230,0.18)",
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Chat window */}
      {isOpen && (
        <div style={{
          marginBottom: 12, width: 360, height: 520,
          background: G.surface,
          borderRadius: 24, border: `1px solid ${G.border}`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          backdropFilter: "blur(24px)",
          animation: "chatSlideIn 0.28s cubic-bezier(.22,.68,0,1)",
          position: "relative",
        }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, rgba(201,168,76,0.12), rgba(29,181,132,0.08))`,
            borderBottom: `1px solid ${G.border}`,
            padding: "16px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: `linear-gradient(135deg, ${G.gold}, ${G.teal})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 16px rgba(201,168,76,0.3)`,
              }}>
                <Bot size={18} color="#080b0f" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.text, letterSpacing: "-0.01em" }}>Safoua AI</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: G.teal, fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: G.teal, display: "inline-block" }}/>
                  En ligne · Prêt à aider
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none", border: "none", color: G.muted, cursor: "pointer", padding: 4,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = G.text}
              onMouseLeave={e => e.currentTarget.style.color = G.muted}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesAreaRef}
            onScroll={handleScroll}
            style={{
              flex: 1, padding: "14px 14px 6px", overflowY: "auto",
              display: "flex", flexDirection: "column", gap: 10,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: 7,
                }}
              >
                {m.role === "bot" && (
                  <div style={{
                    width: 24, height: 24, borderRadius: 8,
                    background: `linear-gradient(135deg, ${G.gold}40, ${G.teal}30)`,
                    border: `1px solid ${G.gold}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginBottom: 2,
                  }}>
                    <Bot size={12} color={G.gold} />
                  </div>
                )}
                <div style={{
                  maxWidth: "78%", padding: "10px 14px", borderRadius: 16,
                  fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap",
                  ...(m.role === "user" ? {
                    background: `linear-gradient(135deg, ${G.gold}22, ${G.teal}18)`,
                    border: `1px solid ${G.gold}30`, color: G.text,
                    borderBottomRightRadius: 4,
                  } : {
                    background: G.card, border: `1px solid ${G.border}`,
                    color: "rgba(242,237,230,0.85)", borderBottomLeftRadius: 4,
                  })
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: `linear-gradient(135deg, ${G.gold}40, ${G.teal}30)`,
                  border: `1px solid ${G.gold}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Bot size={12} color={G.gold} />
                </div>
                <div style={{
                  padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4,
                  background: G.card, border: `1px solid ${G.border}`,
                  display: "flex", gap: 4, alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: G.gold, opacity: 0.7,
                      animation: `dotBounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll-to-bottom button */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              style={{
                position: "absolute", bottom: 80, right: 20,
                width: 28, height: 28, borderRadius: "50%",
                background: G.gold, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 12px rgba(201,168,76,0.4)`,
              }}
            >
              <ChevronDown size={14} color="#080b0f" />
            </button>
          )}

          {/* Suggestions (only shown before any user message) */}
          {messages.length === 1 && (
            <div style={{ padding: "4px 14px 8px", display: "flex", flexWrap: "wrap", gap: 5 }}>
              {SUGGESTED.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  style={{
                    padding: "5px 10px", borderRadius: 99,
                    border: `1px solid ${G.gold}30`,
                    background: `${G.gold}10`, color: G.gold,
                    fontSize: 11, fontWeight: 600,
                    cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${G.gold}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${G.gold}10`; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{
            padding: "10px 12px 12px",
            borderTop: `1px solid ${G.border}`,
            display: "flex", gap: 8,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && !isLoading && handleSend()}
              placeholder="Posez votre question..."
              disabled={isLoading}
              style={{
                flex: 1, background: G.card, border: `1.5px solid ${G.border}`,
                borderRadius: 12, padding: "9px 13px", color: G.text,
                fontSize: 13, outline: "none", fontFamily: "inherit",
                transition: "border-color 0.2s",
                opacity: isLoading ? 0.6 : 1,
              }}
              onFocus={e => e.target.style.borderColor = G.gold}
              onBlur={e  => e.target.style.borderColor = G.border}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 11, border: "none",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                background: input.trim() && !isLoading
                  ? `linear-gradient(135deg, ${G.gold}, ${G.teal})`
                  : G.card,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                transition: "all 0.2s",
                opacity: !input.trim() || isLoading ? 0.5 : 1,
                boxShadow: input.trim() && !isLoading ? `0 0 16px rgba(201,168,76,0.3)` : "none",
              }}
            >
              <Send size={15} color={input.trim() && !isLoading ? "#080b0f" : G.muted} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: 52, height: 52, borderRadius: 16, cursor: "pointer",
          background: isOpen
            ? "rgba(8,11,15,0.9)"
            : `linear-gradient(135deg, ${G.gold}, ${G.teal})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isOpen
            ? `0 4px 20px rgba(0,0,0,0.5)`
            : `0 0 28px rgba(201,168,76,0.45), 0 4px 20px rgba(0,0,0,0.4)`,
          border: isOpen ? `1px solid ${G.border}` : "none",
          transition: "all 0.28s cubic-bezier(.22,.68,0,1)",
        }}
        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
      >
        {isOpen
          ? <X size={22} color={G.muted} />
          : <MessageCircle size={22} color="#080b0f" />
        }
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0);   opacity: 0.5; }
          40%            { transform: translateY(-5px); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

export default ChatBot;