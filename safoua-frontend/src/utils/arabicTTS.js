/**
 * arabicTTS.js — Safoua Academy
 * ─────────────────────────────
 * Natural Arabic pronunciation using:
 * Layer 1 → Google Translate TTS  (native Arabic speaker, free, no key needed)
 * Layer 2 → Web Speech API        (browser built-in, as fallback)
 *
 * Usage:
 *   import { speakArabic, stopArabicAudio, onTTSState } from "../utils/arabicTTS";
 *   speakArabic("بِسْمِ اللَّهِ");
 *   stopArabicAudio();
 *   const unsub = onTTSState((state) => console.log(state));
 */

/* ── Internal state ──────────────────────────────────────────────── */
let _listeners = new Set();
let _audio     = null;

function _broadcast(state) {
  _listeners.forEach((fn) => { try { fn(state); } catch (_) {} });
}

/** Stop any currently-playing audio immediately. */
export function stopArabicAudio() {
  if (_audio) {
    _audio.pause();
    _audio.src = "";
    _audio = null;
  }
  try { window.speechSynthesis?.cancel(); } catch (_) {}
  _broadcast("idle");
}

/** Subscribe to TTS state: "idle" | "loading" | "playing" | "error" */
export function onTTSState(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/* ── Layer 1: Google Translate TTS ───────────────────────────────── */
// Returns a URL that streams native Arabic audio for the given text.
// Works for words and short phrases — perfect for dictionary lookups.
function _googleTTSUrl(text) {
  const encoded = encodeURIComponent(text);
  return `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=ar&client=gtx&q=${encoded}`;
}

function _speakWithGoogle(text, onStart, onEnd) {
  return new Promise((resolve) => {
    stopArabicAudio();

    const audio = new Audio();
    _audio = audio;

    audio.crossOrigin = "anonymous";
    audio.src = _googleTTSUrl(text);
    audio.volume = 1.0;
    audio.playbackRate = 0.9; // slight slowdown for clarity

    const cleanup = () => { if (_audio === audio) _audio = null; };

    audio.oncanplaythrough = () => {
      _broadcast("playing");
      try { onStart?.(); } catch (_) {}
      resolve(true);
    };

    audio.onended = () => {
      cleanup();
      _broadcast("idle");
      try { onEnd?.(); } catch (_) {}
    };

    audio.onerror = () => {
      cleanup();
      resolve(false);
    };

    // Timeout — if it doesn't load in 5s, fall through
    const timeout = setTimeout(() => {
      audio.onerror = null;
      audio.oncanplaythrough = null;
      cleanup();
      resolve(false);
    }, 5000);

    audio.play()
      .then(() => clearTimeout(timeout))
      .catch(() => {
        clearTimeout(timeout);
        cleanup();
        resolve(false);
      });
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

      if (!arVoice) return resolve(false);

      const u = new SpeechSynthesisUtterance(text);
      u.voice  = arVoice;
      u.lang   = arVoice.lang;
      u.rate   = 0.82;
      u.pitch  = 1.0;
      u.volume = 1.0;

      let resolved = false;
      const finish = (ok) => { if (!resolved) { resolved = true; resolve(ok); } };

      u.onstart = () => { _broadcast("playing"); try { onStart?.(); } catch (_) {} finish(true); };
      u.onend   = () => { _broadcast("idle");    try { onEnd?.();   } catch (_) {} };
      u.onerror = () => finish(false);

      synth.speak(u);
      setTimeout(() => finish(false), 4000);
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
 * Uses Google Translate TTS first (natural native voice),
 * falls back to Web Speech API.
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

  // ── Layer 1: Google Translate TTS ──────────────────────────────
  const ok = await _speakWithGoogle(text, onStart, onEnd);
  if (ok) return;

  // ── Layer 2: Web Speech API ─────────────────────────────────────
  const wsOk = await _speakWithWebSpeech(text, onStart, onEnd);

  if (!wsOk) {
    console.warn("[arabicTTS] All layers failed for:", text);
    _broadcast("error");
    try { onEnd?.(); } catch (_) {}
  }
}

/**
 * Play a Quranic verse using Mishary Rashid Alafasy's recitation.
 * Uses the free api.alquran.cloud CDN — no API key needed.
 *
 * @param {number} surah  - Surah number (1-114)
 * @param {number} ayah   - Ayah number
 * @param {object} [opts]
 * @param {Function} [opts.onStart]
 * @param {Function} [opts.onEnd]
 * @param {Function} [opts.onError]  - called if reciter audio fails (fallback to TTS)
 */
export async function playReciterAyah(surah, ayah, { onStart, onEnd, onError } = {}) {
  if (!surah || !ayah) return;

  stopArabicAudio();
  _broadcast("loading");

  // Mishary Rashid Alafasy — identifier: ar.alafasy
  // Audio URL format: https://cdn.islamic.network/quran/audio/128/ar.alafasy/AYAH_NUMBER.mp3
  // where AYAH_NUMBER is the global ayah number (1-6236)
  // We use the per-surah endpoint instead which is simpler:
  const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${_globalAyah(surah, ayah)}.mp3`;

  const audio = new Audio(url);
  _audio = audio;

  const cleanup = () => { if (_audio === audio) _audio = null; };

  audio.oncanplaythrough = () => {
    _broadcast("playing");
    try { onStart?.(); } catch (_) {}
  };

  audio.onended = () => {
    cleanup();
    _broadcast("idle");
    try { onEnd?.(); } catch (_) {}
  };

  audio.onerror = async () => {
    cleanup();
    console.warn("[arabicTTS] Reciter audio failed, falling back to Google TTS");
    try { onError?.(); } catch (_) {}
    // fallback handled by caller
    _broadcast("error");
  };

  try {
    await audio.play();
  } catch (err) {
    cleanup();
    _broadcast("error");
    try { onError?.(); } catch (_) {}
  }
}

/**
 * Convert surah + ayah to global ayah number (1-6236).
 * Uses precomputed cumulative ayah counts per surah.
 */
function _globalAyah(surah, ayah) {
  // Cumulative ayah count BEFORE each surah (index 0 = before surah 1 = 0)
  const CUMULATIVE = [
      0,   7, 293, 493, 669, 789, 954,1160,1235,1364,1473,1596,1707,1750,
   1802, 1901,2029,2140,2250,2348,2483,2595,2673,2791,2855,2932,3159,3252,
   3340, 3409,3469,3503,3533,3606,3660,3705,3788,3970,4058,4133,4218,4272,
   4325, 4414,4473,4510,4545,4583,4612,4630,4675,4735,4784,4846,4901,4979,
   5075, 5104,5126,5150,5163,5177,5188,5199,5217,5229,5241,5271,5323,5375,
   5419, 5447,5475,5495,5551,5591,5622,5672,5712,5758,5800,5829,5848,5884,
   5909, 5931,5948,5967,5993,6023,6043,6058,6079,6090,6098,6106,6125,6130,
   6138, 6146,6157,6168,6176,6179,6188,6193,6197,6204,6207,6213,6216,6221,
   6225, 6230,6236
  ];

  if (surah < 1 || surah > 114) return 1;
  return CUMULATIVE[surah - 1] + ayah;
}