/**
 * components/Dictionary.jsx — Safoua Academy
 * Beautiful in both dark and light modes — proper white editorial design.
 */

import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Volume2, Globe, Sparkles, ArrowRight, BookOpen, StopCircle, Star } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { api } from '../utils/auth';
import { speakArabic, stopArabicAudio, onTTSState, playReciterAyah } from '../utils/arabicTTS';
import { useTheme } from '../context/ThemeContext';

const EXAMPLES = {
  english: ['peace', 'knowledge', 'light', 'mercy', 'faith', 'heart', 'sky', 'love'],
  french:  ['paix', 'lumière', 'savoir', 'miséricorde', 'foi', 'cœur', 'ciel', 'amour'],
};

/* ── BACKGROUND ─────────────────────────────────────────────────── */
function DictBg({ isDark }) {
  if (isDark) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#080b0f' }} />
        <div style={{ position: 'absolute', top: '-5%', right: '10%', width: 650, height: 650, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,181,132,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.018) 1px,transparent 1px)', backgroundSize: '88px 88px' }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#ffffff' }} />
      <div style={{ position: 'absolute', top: '-5%', right: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(154,111,30,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '0', left: '0', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,122,87,0.04) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(154,111,30,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    </div>
  );
}

/* ── SPEAK BUTTON ───────────────────────────────────────────────── */
function SpeakButton({ arabic, ttsState, onSpeak, onStop, size = 44, C }) {
  const isLoading = ttsState === 'loading', isPlaying = ttsState === 'playing', isActive = isLoading || isPlaying;
  const iconSize = size < 50 ? 18 : 24;
  return (
    <motion.button onClick={() => isActive ? onStop() : onSpeak(arabic)}
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
      title={isPlaying ? 'Arrêter' : isLoading ? 'Chargement…' : 'Écouter la prononciation'}
      style={{ width: size, height: size, borderRadius: size / 3.5, background: isActive ? `linear-gradient(135deg,${C.gold}44,${C.teal}33)` : `linear-gradient(135deg,${C.gold}18,${C.teal}14)`, border: `1.5px solid ${isActive ? C.gold : C.gold + '40'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', boxShadow: isActive ? `0 0 24px ${C.gold}40` : 'none' }}>
      {isLoading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles size={iconSize} color={C.gold} />
        </motion.div>
      ) : isPlaying ? (
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
          <StopCircle size={iconSize} color={C.goldL} />
        </motion.div>
      ) : (
        <Volume2 size={iconSize} color={C.gold} />
      )}
    </motion.button>
  );
}

/* ── RECITER BUTTON ─────────────────────────────────────────────── */
function ReciterButton({ ex, reciterState, activeAyah, onSpeakAyah, C }) {
  const isThis = activeAyah?.surah === ex.surah && activeAyah?.ayah === ex.ayah;
  const isPlaying = isThis && reciterState === 'playing';
  const isLoading = isThis && reciterState === 'loading';
  return (
    <button onClick={() => onSpeakAyah(ex)} title={ex.surah ? 'Écouter — Mishary Rashid Alafasy' : 'Écouter'}
      style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, cursor: 'pointer', background: isPlaying ? `${C.red}10` : isLoading ? `${C.gold}10` : ex.surah ? `${C.teal}10` : `${C.gold}10`, border: `1px solid ${isPlaying ? `${C.red}30` : isLoading ? `${C.gold}40` : ex.surah ? `${C.teal}35` : `${C.gold}28`}`, transition: 'all 0.15s' }}>
      {isLoading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles size={12} color={C.gold} />
        </motion.div>
      ) : isPlaying ? (
        <StopCircle size={12} color={C.red} />
      ) : (
        <Volume2 size={12} color={ex.surah ? C.teal : C.gold} />
      )}
      {ex.surah && (
        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap', color: isPlaying ? C.red : isLoading ? C.gold : C.tealL }}>
          {isLoading ? 'Chargement…' : isPlaying ? 'Arrêter' : 'Récitateur'}
        </span>
      )}
    </button>
  );
}

/* ── RESULT CARD ────────────────────────────────────────────────── */
function ResultCard({ results, ttsState, onSpeak, onStop, onSpeakAyah, reciterState, activeAyah, C, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [.22, .68, 0, 1] }}
      style={{
        borderRadius: 24, overflow: 'hidden',
        background: isDark ? C.card : '#ffffff',
        border: `1px solid ${isDark ? `${C.gold}20` : C.border}`,
        boxShadow: isDark ? `0 24px 64px rgba(0,0,0,0.5)` : `0 8px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)`,
        transition: 'background 0.3s',
      }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.teal}, transparent)` }} />

      {/* Arabic hero */}
      <div style={{ padding: '44px 40px 32px', background: isDark ? `linear-gradient(135deg, ${C.gold}05 0%, ${C.teal}03 100%)` : `linear-gradient(135deg, #fffbf2 0%, #f0fdf8 100%)`, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>الترجمة العربية</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(3rem,7vw,5rem)', fontWeight: 700, color: C.gold, lineHeight: 1, letterSpacing: '0.04em', direction: 'rtl', marginBottom: 14 }}>
            {results.arabic}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: 'italic', color: C.teal, fontWeight: 600 }}>
              [{results.pronunciation}]
            </span>
            <SpeakButton arabic={results.arabic} ttsState={ttsState} onSpeak={onSpeak} onStop={onStop} size={44} C={C} />
          </div>
          <AnimatePresence>
            {(ttsState === 'loading' || ttsState === 'playing') && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                {ttsState === 'loading' ? (
                  <span style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Sans',sans-serif" }}>⏳ Chargement…</span>
                ) : (
                  <>
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div key={i} animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        style={{ width: 3, height: 16, borderRadius: 2, background: `linear-gradient(to top, ${C.teal}, ${C.gold})`, transformOrigin: 'bottom' }} />
                    ))}
                    <span style={{ fontSize: 12, color: C.teal, fontFamily: "'DM Sans',sans-serif", marginLeft: 4 }}>En lecture…</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {results.root && (
          <div style={{ padding: '14px 20px', borderRadius: 16, background: isDark ? `${C.purple}12` : `${C.purple}08`, border: `1px solid ${C.purple}25`, textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.purple, fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>الجذر</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: C.purple, direction: 'rtl', lineHeight: 1 }}>{results.root}</div>
            <div style={{ fontSize: 9, color: `${C.purple}70`, fontFamily: "'DM Sans',sans-serif", marginTop: 4, letterSpacing: '0.06em' }}>racine</div>
          </div>
        )}
      </div>

      {/* Meaning */}
      <div style={{ padding: '28px 40px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted, fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>📖 Sens & Définition</div>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: 'italic', color: C.textSub, lineHeight: 1.75, margin: 0 }}>
          {results.meaning}
        </p>
      </div>

      {/* Examples */}
      {results.examples?.length > 0 && (
        <div style={{ padding: '28px 40px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted, fontFamily: "'DM Sans',sans-serif", marginBottom: 18 }}>✨ Exemples coraniques</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {results.examples.map((ex, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ padding: '18px 20px', borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.025)' : '#f8f6f1', border: `1px solid ${C.border}` }}>
                {ex.surah && ex.ayah && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, opacity: 0.85 }}>
                    Sourate {ex.surah} — Verset {ex.ayah}
                  </div>
                )}
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: C.gold, direction: 'rtl', lineHeight: 1.4, marginBottom: 8 }}>
                  {ex.arabic}
                </div>
                {ex.transliteration && (
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 14, color: C.teal, marginBottom: 6 }}>{ex.transliteration}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.muted }}>{ex.translation}</div>
                  <ReciterButton ex={ex} reciterState={reciterState} activeAyah={activeAyah} onSpeakAyah={onSpeakAyah} C={C} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Globe size={12} color={C.dim} />
        <span style={{ fontSize: 12, color: C.dim, fontFamily: "'DM Sans',sans-serif" }}>
          Traduit via {results.source} · Safoua Academy
        </span>
      </div>
    </motion.div>
  );
}

/* ── MAIN DICTIONARY ─────────────────────────────────────────────── */
export default function Dictionary() {
  const { C, theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('english');
  const [ttsState, setTtsState] = useState('idle');
  const [reciterState, setReciterState] = useState('idle');
  const [activeAyah, setActiveAyah] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const unsub = onTTSState(setTtsState);
    return () => { unsub(); stopArabicAudio(); };
  }, []);

  const handleSearch = async (word) => {
    const term = (word || searchTerm).trim();
    if (!term) { setError('Veuillez entrer un mot à chercher'); return; }
    stopArabicAudio(); setActiveAyah(null); setReciterState('idle');
    setLoading(true); setError(''); setResults(null);
    try {
      const res = await api.get('/api/dictionary/translate', { params: { word: term, language: searchLanguage } });
      if (res.data.success) setResults(res.data);
      else setError(res.data.message || 'Impossible de traduire ce mot.');
    } catch { setError('Erreur de connexion. Vérifiez votre réseau.'); }
    finally { setLoading(false); }
  };

  const handleSpeak = (arabic) => {
    if (!arabic) return;
    stopArabicAudio(); setActiveAyah(null); setReciterState('idle');
    speakArabic(arabic, { onUnavailable: () => setTtsState('error') });
  };
  const handleStop = () => { stopArabicAudio(); setReciterState('idle'); setActiveAyah(null); };

  const handleSpeakAyah = async (ex) => {
    const isThis = activeAyah?.surah === ex.surah && activeAyah?.ayah === ex.ayah;
    if (isThis && (reciterState === 'playing' || reciterState === 'loading')) { stopArabicAudio(); setReciterState('idle'); setActiveAyah(null); return; }
    stopArabicAudio(); setReciterState('idle'); setActiveAyah(null);
    if (ex.surah && ex.ayah) {
      const tS = ex.surah, tA = ex.ayah;
      setActiveAyah({ surah: tS, ayah: tA }); setReciterState('loading');
      await playReciterAyah(tS, tA, {
        onStart: () => setActiveAyah(p => { if (p?.surah === tS && p?.ayah === tA) setReciterState('playing'); return p; }),
        onEnd: () => setActiveAyah(p => { if (p?.surah === tS && p?.ayah === tA) { setReciterState('idle'); return null; } return p; }),
        onError: () => setActiveAyah(p => { if (p?.surah === tS && p?.ayah === tA) { setReciterState('idle'); return null; } return p; }),
      });
    } else { speakArabic(ex.arabic); }
  };

  const handleLang = (code) => { stopArabicAudio(); setActiveAyah(null); setReciterState('idle'); setSearchLanguage(code); setResults(null); setSearchTerm(''); setError(''); };
  const examples = EXAMPLES[searchLanguage];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans',sans-serif", position: 'relative', transition: 'background 0.3s' }}>
      <Helmet>
        <title>Dictionnaire Arabe — Safoua Academy</title>
        <meta name="description" content="Dictionnaire arabe-français interactif avec audio natif." />
      </Helmet>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(154,111,30,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: rgba(154,111,30,0.25); border-radius: 99px; }
        .dict-input:focus { border-color: ${C.gold} !important; box-shadow: 0 0 0 3px ${C.gold}14 !important; outline: none !important; }
      `}</style>

      <DictBg isDark={isDark} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 110, paddingBottom: 100 }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px' }}>

          {/* ── HERO ── */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [.22, .68, 0, 1] }}
            style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }}>
            {/* Background Arabic watermark */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: -1, top: -50 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(120px,18vw,260px)', color: isDark ? 'rgba(201,168,76,0.025)' : 'rgba(154,111,30,0.04)', lineHeight: 1, userSelect: 'none', display: 'block' }}>قاموس</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 99, background: `${C.gold}14`, border: `1px solid ${C.gold}30`, fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24, fontFamily: "'DM Sans',sans-serif" }}>
              <Sparkles size={11} /> Dictionnaire · FR & EN → عربي
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.12, ease: [.22, .68, 0, 1] }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.6rem,6vw,4.2rem)', fontWeight: 700, lineHeight: 1.06, color: C.text, marginBottom: 18, letterSpacing: '-0.03em' }}>
              Dictionnaire <em style={{ fontStyle: 'italic', color: C.gold }}>Arabe</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17.5, fontStyle: 'italic', color: C.muted, lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
              Cherchez un mot en anglais ou en français — obtenez sa traduction arabe, sa prononciation, sa racine et des exemples coraniques.
            </motion.p>
          </motion.div>

          {/* ── SEARCH BOX ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [.22, .68, 0, 1] }}
            style={{ borderRadius: 24, background: isDark ? C.card : '#ffffff', border: `1px solid ${C.border}`, padding: '32px', marginBottom: 28, boxShadow: isDark ? 'none' : '0 4px 32px rgba(0,0,0,0.07)', transition: 'background 0.3s' }}>

            {/* Language toggle */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, justifyContent: 'center' }}>
              {[{ code: 'english', flag: '🇬🇧', label: 'English' }, { code: 'french', flag: '🇫🇷', label: 'Français' }].map(l => (
                <button key={l.code} onClick={() => handleLang(l.code)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s', background: searchLanguage === l.code ? `linear-gradient(135deg,${C.gold},${C.teal})` : (isDark ? 'rgba(255,255,255,0.05)' : '#f0ede7'), color: searchLanguage === l.code ? '#fff' : C.muted, boxShadow: searchLanguage === l.code ? `0 4px 16px ${C.gold}35` : 'none' }}>
                  <span style={{ fontSize: 16 }}>{l.flag}</span> {l.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} color={C.gold} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input ref={inputRef} className="dict-input" type="text" value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && handleSearch()}
                  placeholder={searchLanguage === 'english' ? 'peace, knowledge, light…' : 'paix, lumière, savoir…'}
                  style={{ width: '100%', paddingLeft: 48, paddingRight: 20, paddingTop: 14, paddingBottom: 14, borderRadius: 13, background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f3ee', border: `1.5px solid ${C.border}`, color: C.text, fontSize: 15, outline: 'none', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s' }} />
              </div>
              <motion.button onClick={() => handleSearch()} disabled={loading}
                whileHover={!loading ? { scale: 1.03, boxShadow: `0 6px 24px ${C.gold}40` } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                style={{ padding: '14px 24px', borderRadius: 13, border: 'none', background: loading ? (isDark ? 'rgba(255,255,255,0.06)' : '#e8e4de') : `linear-gradient(135deg,${C.gold},${C.teal})`, color: loading ? C.muted : '#fff', fontWeight: 700, fontSize: 14, cursor: loading ? 'wait' : 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, opacity: loading ? 0.6 : 1, transition: 'all 0.2s' }}>
                {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles size={16} /></motion.div> : <><ArrowRight size={16} /> Chercher</>}
              </motion.button>
            </div>

            {/* Example chips */}
            <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: C.dim, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Essayez :</span>
              {examples.map(w => (
                <motion.button key={w} onClick={() => { setSearchTerm(w); handleSearch(w); }}
                  whileHover={{ scale: 1.05, borderColor: C.gold, color: C.gold }}
                  style={{ padding: '4px 12px', borderRadius: 99, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.15s' }}>
                  {w}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: '14px 20px', borderRadius: 14, background: `${C.red}0a`, border: `1px solid ${C.red}25`, color: C.red, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* TTS error */}
          <AnimatePresence>
            {ttsState === 'error' && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: '12px 18px', borderRadius: 14, background: `${C.red}08`, border: `1px solid ${C.red}20`, color: C.red, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
                🔇 Prononciation indisponible sur ce navigateur.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ borderRadius: 24, background: isDark ? C.card : '#ffffff', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: isDark ? 'none' : '0 4px 32px rgba(0,0,0,0.06)' }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.teal}, transparent)` }} />
                <div style={{ padding: '40px' }}>
                  {[{ w: '35%', h: 14 }, { w: '55%', h: 52 }, { w: '28%', h: 16 }].map((s, i) => (
                    <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                      style={{ width: s.w, height: s.h, borderRadius: 8, background: isDark ? 'rgba(255,255,255,0.07)' : '#f0ede7', marginBottom: 14 }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {results && !loading && (
              <ResultCard results={results} ttsState={ttsState} onSpeak={handleSpeak} onStop={handleStop}
                onSpeakAyah={handleSpeakAyah} reciterState={reciterState} activeAyah={activeAyah} C={C} isDark={isDark} />
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!results && !loading && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ textAlign: 'center', padding: '72px 24px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 100, color: isDark ? `${C.gold}14` : `${C.gold}12`, lineHeight: 1, marginBottom: 20 }}>ع</div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 18, color: C.muted, lineHeight: 1.75, maxWidth: 360, margin: '0 auto' }}>
                Entrez un mot pour découvrir sa traduction, sa racine, sa prononciation et des exemples en arabe.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 200, margin: '28px auto 0' }}>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.border})` }} />
                <BookOpen size={14} color={C.dim} />
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}