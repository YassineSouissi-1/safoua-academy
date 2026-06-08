/**
 * arabicTTS.js — Safoua Academy
 * ─────────────────────────────
 * 100% browser-side Arabic TTS — no backend call, no API key.
 *
 * Layer 1 → ResponsiveVoice  (loaded from free CDN, great Arabic quality)
 * Layer 2 → Web Speech API   (browser built-in)
 *
 * Usage:
 *   import { speakArabic, stopArabicAudio, onTTSState } from "../utils/arabicTTS";
 *
 *   speakArabic("بِسْمِ اللَّهِ");
 *   stopArabicAudio();
 *   const unsub = onTTSState((state) => console.log(state)); // "idle"|"loading"|"playing"|"error"
 */

/* ── Internal state ──────────────────────────────────────────────── */
let _listeners  = new Set();
let _rvLoaded   = false;
let _rvLoading  = false;
let _currentUtterance = null;

function _broadcast(state) {
  _listeners.forEach((fn) => { try { fn(state); } catch (_) {} });
}

/** Stop any currently-playing TTS immediately. */
export function stopArabicAudio() {
  try { window.speechSynthesis?.cancel(); } catch (_) {}
  try {
    if (window.responsiveVoice?.isPlaying()) window.responsiveVoice.cancel();
  } catch (_) {}
  _currentUtterance = null;
  _broadcast("idle");
}

/** Subscribe to TTS state: "idle" | "loading" | "playing" | "error" */
export function onTTSState(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/* ── Load ResponsiveVoice from CDN ───────────────────────────────── */
function _loadRV() {
  return new Promise((resolve) => {
    // Already ready
    if (_rvLoaded && window.responsiveVoice) return resolve(true);

    // Script already injected, wait for it
    if (_rvLoading) {
      let waited = 0;
      const iv = setInterval(() => {
        waited += 100;
        if (window.responsiveVoice) {
          clearInterval(iv);
          _rvLoaded = true;
          resolve(true);
        } else if (waited > 6000) {
          clearInterval(iv);
          resolve(false);
        }
      }, 100);
      return;
    }

    _rvLoading = true;
    const script = document.createElement("script");
    // Free tier key — works for localhost and most domains without signup
    script.src = "https://code.responsivevoice.org/responsivevoice.js?key=FREE";
    script.async = true;

    script.onload = () => {
      let attempts = 0;
      const iv = setInterval(() => {
        attempts++;
        if (window.responsiveVoice) {
          clearInterval(iv);
          _rvLoaded = true;
          resolve(true);
        } else if (attempts > 50) {
          clearInterval(iv);
          resolve(false);
        }
      }, 100);
    };

    script.onerror = () => {
      _rvLoading = false;
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

/* ── Layer 1: ResponsiveVoice ─────────────────────────────────────── */
function _speakWithRV(text, onStart, onEnd) {
  return new Promise((resolve) => {
    if (!window.responsiveVoice) return resolve(false);

    let resolved = false;
    const finish = (success) => {
      if (!resolved) { resolved = true; resolve(success); }
    };

    // Try Arabic Male first, fall back to Arabic Female
    const voice = "Arabic Male";

    try {
      window.responsiveVoice.speak(text, voice, {
        rate:    0.88,
        pitch:   1.0,
        volume:  1.0,
        onstart: () => {
          _broadcast("playing");
          try { onStart?.(); } catch (_) {}
          finish(true);
        },
        onend: () => {
          _broadcast("idle");
          try { onEnd?.(); } catch (_) {}
        },
        onerror: () => {
          finish(false);
        },
      });
    } catch {
      finish(false);
    }

    // If onstart never fires within 4s, consider it failed
    setTimeout(() => finish(false), 4000);
  });
}

/* ── Layer 2: Web Speech API ──────────────────────────────────────── */
function _speakWithWebSpeech(text, onStart, onEnd) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) return resolve(false);

    synth.cancel();

    const attempt = () => {
      const voices = synth.getVoices();
      const arVoice =
        voices.find((v) => v.lang === "ar-SA") ||
        voices.find((v) => v.lang === "ar-EG") ||
        voices.find((v) => v.lang.startsWith("ar"));

      if (!arVoice) {
        console.warn("[TTS] No Arabic voice found in Web Speech API");
        return resolve(false);
      }

      const u = new SpeechSynthesisUtterance(text);
      u.voice  = arVoice;
      u.lang   = arVoice.lang;
      u.rate   = 0.82;
      u.pitch  = 1.0;
      u.volume = 1.0;
      _currentUtterance = u;

      let resolved = false;
      const finish = (success) => {
        if (!resolved) { resolved = true; resolve(success); }
      };

      u.onstart = () => {
        _broadcast("playing");
        try { onStart?.(); } catch (_) {}
        finish(true);
      };
      u.onend = () => {
        _broadcast("idle");
        try { onEnd?.(); } catch (_) {}
      };
      u.onerror = (e) => {
        console.warn("[TTS] Web Speech error:", e.error);
        finish(false);
      };

      synth.speak(u);

      // If it never starts in 3s, bail
      setTimeout(() => finish(false), 3000);
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
        if (!fired) {
          fired = true;
          synth.onvoiceschanged = null;
          attempt();
        }
      }, 1500);
    }
  });
}

/**
 * Speak Arabic text.
 * Tries ResponsiveVoice first, then Web Speech API.
 *
 * @param {string}   text
 * @param {object}   [opts]
 * @param {Function} [opts.onStart]
 * @param {Function} [opts.onEnd]
 */
export async function speakArabic(text, { onStart, onEnd } = {}) {
  if (!text?.trim()) return;

  stopArabicAudio();
  _broadcast("loading");

  // ── Layer 1: ResponsiveVoice ────────────────────────────────────
  const rvLoaded = await _loadRV();

  if (rvLoaded) {
    const ok = await _speakWithRV(text, onStart, onEnd);
    if (ok) return;
  }

  // ── Layer 2: Web Speech API ─────────────────────────────────────
  const wsOk = await _speakWithWebSpeech(text, onStart, onEnd);

  if (!wsOk) {
    console.warn("[arabicTTS] All layers failed for:", text);
    _broadcast("error");
    try { onEnd?.(); } catch (_) {}
  }
}