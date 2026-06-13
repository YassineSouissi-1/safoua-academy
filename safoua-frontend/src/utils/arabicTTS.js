/**
 * arabicTTS.js — Safoua Academy
 * ─────────────────────────────
 * Layer 1 → Google Translate TTS  (short words ≤120 chars)
 * Layer 2 → Web Speech API        (fallback for long text)
 *
 * Reciter: everyayah.com — Mishary Rashid Alafasy
 * Uses surah+ayah directly (no global numbering, no off-by-one bugs)
 */

/* ── Internal state ──────────────────────────────────────────────── */
let _listeners = new Set();
let _audio     = null;
let _sessionId = 0; // incremented on every new play — old callbacks self-cancel

function _broadcast(state) {
  _listeners.forEach((fn) => { try { fn(state); } catch (_) {} });
}

export function stopArabicAudio() {
  _sessionId++; // invalidate all in-flight chains first
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

/* ── Layer 1: Google Translate TTS ───────────────────────────────── */
function _googleTTSUrl(text) {
  return `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=ar&client=gtx&q=${encodeURIComponent(text)}`;
}

function _speakWithGoogle(text, onStart, onEnd, sid) {
  return new Promise((resolve) => {
    // Skip for long text — CORS blocks it in production
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

    // Use { once: true } equivalent by nulling after first fire
    audio.oncanplaythrough = () => {
      audio.oncanplaythrough = null; // fire only once
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
        if (e.error === "interrupted") return; // intentional cancel, not an error
        finish(false);
      };

      synth.speak(u);
      setTimeout(() => finish(false), 8000);
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
      setTimeout(() => {
        if (!fired) { fired = true; synth.onvoiceschanged = null; attempt(); }
      }, 1500);
    }
  });
}

/**
 * Speak an Arabic word (dictionary lookup).
 * Layer 1: Google TTS → Layer 2: Web Speech API
 */
export async function speakArabic(text, { onStart, onEnd } = {}) {
  if (!text?.trim()) return;

  const sid = ++_sessionId;
  _broadcast("loading");

  const ok = await _speakWithGoogle(text, onStart, onEnd, sid);
  if (ok || _sessionId !== sid) return;

  const wsOk = await _speakWithWebSpeech(text, onStart, onEnd, sid);
  if (!wsOk && _sessionId === sid) {
    console.warn("[arabicTTS] All layers failed for:", text);
    _broadcast("error");
    try { onEnd?.(); } catch (_) {}
  }
}

/**
 * Play a Quranic ayah — Mishary Rashid Alafasy recitation.
 *
 * Uses everyayah.com which accepts surah + ayah directly as a
 * zero-padded filename: {surah3}{ayah3}.mp3
 * No global ayah number needed → no off-by-one bugs possible.
 *
 * Example: S2:A255 → 002255.mp3
 */
export async function playReciterAyah(surah, ayah, { onStart, onEnd, onError } = {}) {
  if (!surah || !ayah) return;

  const sid = ++_sessionId;

  // Stop previous audio synchronously before broadcasting loading
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

  console.log(`[arabicTTS] Reciter loading S${surah}:A${ayah} → ${url}`);

  const audio = new Audio(url);
  _audio = audio;

  const cleanup = () => { if (_audio === audio) _audio = null; };

  // Fire only once — guards against duplicate "playing" broadcasts
  audio.oncanplaythrough = () => {
    audio.oncanplaythrough = null; // prevent re-firing
    if (_sessionId !== sid) { audio.pause(); cleanup(); return; }
    console.log(`[arabicTTS] Reciter playing S${surah}:A${ayah}`);
    _broadcast("playing");
    try { onStart?.(); } catch (_) {}
  };

  audio.onended = () => {
    cleanup();
    if (_sessionId !== sid) return;
    console.log(`[arabicTTS] Reciter ended S${surah}:A${ayah}`);
    _broadcast("idle");
    try { onEnd?.(); } catch (_) {}
  };

  audio.onerror = (e) => {
    cleanup();
    if (_sessionId !== sid) return; // user stopped — never trigger fallback
    console.warn(`[arabicTTS] Reciter failed for S${surah}:A${ayah}`, e);
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