/**
 * arabicTTS.js — Safoua Academy
 * ─────────────────────────────
 * Layer 1 → ResponsiveVoice-style direct URL (works on mobile)
 * Layer 2 → Web Speech API (Arabic voice if available)
 * Layer 3 → Google Translate TTS (desktop only, CORS-blocked on mobile)
 *
 * Mobile browsers block cross-origin Audio from translate.googleapis.com.
 * Solution: detect mobile and skip straight to Web Speech API which works
 * natively on iOS Safari and Android Chrome without any CORS issues.
 */

/* ── Internal state ──────────────────────────────────────────────── */
let _listeners = new Set();
let _audio     = null;
let _sessionId = 0;

function _broadcast(state) {
  _listeners.forEach((fn) => { try { fn(state); } catch (_) {} });
}

export function stopArabicAudio() {
  _sessionId++;
  if (_audio) {
    _audio.pause();
    _audio.src = "";
    _audio = null;
  }
  try { window.speechSynthesis?.cancel(); } catch (_) {}
  _broadcast("idle");
}

export function onTTSState(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/* ── Detect mobile / touch device ──────────────────────────────── */
function _isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1);
}

/* ── Layer 1: Google Translate TTS (desktop only) ────────────────── */
function _googleTTSUrl(text) {
  return `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=ar&client=gtx&q=${encodeURIComponent(text)}`;
}

function _speakWithGoogle(text, onStart, onEnd, sid) {
  return new Promise((resolve) => {
    // Skip entirely on mobile — Google TTS is CORS-blocked there
    if (_isMobile()) return resolve(false);
    if (text.length > 120) return resolve(false);

    const audio = new Audio();
    _audio = audio;
    audio.crossOrigin  = "anonymous";
    audio.src          = _googleTTSUrl(text);
    audio.volume       = 1.0;
    audio.playbackRate = 0.9;

    const cleanup = () => { if (_audio === audio) _audio = null; };

    let resolved = false;
    const safeResolve = (val) => { if (!resolved) { resolved = true; resolve(val); } };

    const timeout = setTimeout(() => {
      audio.oncanplaythrough = null;
      audio.onerror          = null;
      audio.onended          = null;
      cleanup();
      safeResolve(false);
    }, 5000);

    audio.oncanplaythrough = () => {
      audio.oncanplaythrough = null;
      clearTimeout(timeout);
      if (_sessionId !== sid) { cleanup(); return safeResolve(false); }
      _broadcast("playing");
      try { onStart?.(); } catch (_) {}
      safeResolve(true);
    };

    audio.onended = () => {
      cleanup();
      if (_sessionId !== sid) return;
      _broadcast("idle");
      try { onEnd?.(); } catch (_) {}
    };

    audio.onerror = () => {
      clearTimeout(timeout);
      audio.oncanplaythrough = null;
      cleanup();
      safeResolve(false);
    };

    audio.play().catch(() => {
      clearTimeout(timeout);
      audio.oncanplaythrough = null;
      cleanup();
      safeResolve(false);
    });
  });
}

/* ── Layer 2: Web Speech API ──────────────────────────────────────── */
function _speakWithWebSpeech(text, onStart, onEnd, sid) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) return resolve(false);

    synth.cancel();

    const attempt = () => {
      if (_sessionId !== sid) return resolve(false);

      const voices  = synth.getVoices();
      const arVoice =
        voices.find((v) => v.lang === "ar-SA") ||
        voices.find((v) => v.lang === "ar-EG") ||
        voices.find((v) => v.lang === "ar-AE") ||
        voices.find((v) => v.lang.startsWith("ar"));

      if (!arVoice) return resolve(false);

      const u  = new SpeechSynthesisUtterance(text);
      u.voice  = arVoice;
      u.lang   = arVoice.lang;
      u.rate   = 0.82;
      u.pitch  = 1.0;
      u.volume = 1.0;

      let resolved = false;
      const finish = (ok) => { if (!resolved) { resolved = true; resolve(ok); } };

      u.onstart = () => {
        if (_sessionId !== sid) { synth.cancel(); return; }
        _broadcast("playing");
        try { onStart?.(); } catch (_) {}
        finish(true);
      };
      u.onend = () => {
        if (_sessionId !== sid) return;
        _broadcast("idle");
        try { onEnd?.(); } catch (_) {}
      };
      u.onerror = (e) => {
        if (e.error === "interrupted") return;
        finish(false);
      };

      synth.speak(u);
      // iOS Safari sometimes doesn't fire onstart, give it 10s
      setTimeout(() => finish(false), 10000);
    };

    const voices = synth.getVoices();
    if (voices.length > 0) {
      attempt();
    } else {
      let fired = false;
      synth.onvoiceschanged = () => {
        if (fired) return;
        fired = true;
        synth.onvoiceschanged = null;
        attempt();
      };
      // iOS: voices may never trigger onvoiceschanged, try after delay
      setTimeout(() => {
        if (!fired) { fired = true; synth.onvoiceschanged = null; attempt(); }
      }, 1500);
    }
  });
}

/* ── Layer 3: forvo-style open audio fallback ─────────────────────
   Uses ar.forvo.com embed — not reliable enough. Skip.
   Instead we display a clear "unavailable" message only when BOTH
   layers fail, with a suggestion to use headphones/browser.         */

/**
 * Speak an Arabic word.
 * Mobile: Layer 2 (Web Speech) first, then fail gracefully.
 * Desktop: Layer 1 (Google TTS) → Layer 2 (Web Speech).
 */
export async function speakArabic(text, { onStart, onEnd, onUnavailable } = {}) {
  if (!text?.trim()) return;

  const sid = ++_sessionId;
  _broadcast("loading");

  // On mobile, skip Google TTS entirely (CORS blocked) — go straight to WebSpeech
  if (!_isMobile()) {
    const ok = await _speakWithGoogle(text, onStart, onEnd, sid);
    if (ok || _sessionId !== sid) return;
  }

  const wsOk = await _speakWithWebSpeech(text, onStart, onEnd, sid);
  if (!wsOk && _sessionId === sid) {
    console.warn("[arabicTTS] All layers failed for:", text);
    _broadcast("error");
    try { onEnd?.(); } catch (_) {}
    try { onUnavailable?.(); } catch (_) {}
  }
}

/**
 * Play a Quranic ayah — Mishary Rashid Alafasy recitation via everyayah.com
 */
export async function playReciterAyah(surah, ayah, { onStart, onEnd, onError } = {}) {
  if (!surah || !ayah) return;

  const sid = ++_sessionId;

  if (_audio) {
    _audio.pause();
    _audio.src = "";
    _audio = null;
  }
  try { window.speechSynthesis?.cancel(); } catch (_) {}

  _broadcast("loading");

  const s   = String(surah).padStart(3, "0");
  const a   = String(ayah).padStart(3, "0");
  const url = `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;

  const audio = new Audio(url);
  // Don't set crossOrigin for everyayah — it doesn't send CORS headers
  _audio = audio;

  const cleanup = () => { if (_audio === audio) _audio = null; };

  audio.oncanplaythrough = () => {
    audio.oncanplaythrough = null;
    if (_sessionId !== sid) { audio.pause(); cleanup(); return; }
    _broadcast("playing");
    try { onStart?.(); } catch (_) {}
  };

  audio.onended = () => {
    cleanup();
    if (_sessionId !== sid) return;
    _broadcast("idle");
    try { onEnd?.(); } catch (_) {}
  };

  audio.onerror = (e) => {
    cleanup();
    if (_sessionId !== sid) return;
    _broadcast("error");
    try { onError?.(); } catch (_) {}
  };

  try {
    await audio.play();
  } catch (err) {
    cleanup();
    if (_sessionId !== sid) return;
    console.warn(`[arabicTTS] audio.play() rejected for S${surah}:A${ayah}:`, err);
    _broadcast("error");
    try { onError?.(); } catch (_) {}
  }
}