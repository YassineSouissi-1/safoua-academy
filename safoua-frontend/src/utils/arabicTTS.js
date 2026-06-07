/**
 * arabicTTS.js — Safoua Academy
 * ─────────────────────────────
 * Arabic TTS using Microsoft Edge Neural voices (ar-SA-ZariyahNeural).
 * 100% free — no API key, no signup, no credit card.
 * Calls the backend /api/tts which proxies to Microsoft's Edge TTS service.
 * Falls back to Web Speech API if the server is unreachable.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Internal state ─────────────────────────────────────────────────────────
let _audio     = null;
let _abortCtrl = null;
let _listeners = new Set();

function _broadcast(state) {
  _listeners.forEach((fn) => fn(state));
}

/** Stop any currently-playing audio. */
export function stopArabicAudio() {
  _abortCtrl?.abort();
  _abortCtrl = null;
  if (_audio) {
    try { _audio.pause(); _audio.currentTime = 0; } catch (_) {}
    _audio = null;
  }
  try { window.speechSynthesis?.cancel(); } catch (_) {}
  _broadcast("idle");
}

/** Subscribe to state changes: "idle" | "loading" | "playing" | "error" */
export function onTTSState(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/**
 * Speak Arabic text via Microsoft Edge Neural TTS (backend proxy).
 * @param {string}   text
 * @param {object}   [opts]
 * @param {Function} [opts.onStart]
 * @param {Function} [opts.onEnd]
 */
export async function speakArabic(text, { onStart, onEnd } = {}) {
  if (!text?.trim()) return () => {};

  stopArabicAudio();
  _broadcast("loading");

  const ctrl = new AbortController();
  _abortCtrl  = ctrl;

  const finish = (state = "idle") => {
    _audio     = null;
    _abortCtrl = null;
    _broadcast(state);
    onEnd?.();
  };

  try {
    const res = await fetch(`${API_BASE}/api/tts`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ text: text.trim() }),
      signal:  ctrl.signal,
    });

    if (!res.ok) {
      console.warn(`[arabicTTS] server ${res.status} — fallback`);
      return _fallbackWebSpeech(text, onStart, () => finish("idle"));
    }

    const blob  = await res.blob();
    if (ctrl.signal.aborted) return;

    const url   = URL.createObjectURL(blob);
    const audio = new Audio(url);
    _audio = audio;

    audio.onplay  = () => { _broadcast("playing"); onStart?.(); };
    audio.onended = () => { URL.revokeObjectURL(url); finish("idle"); };
    audio.onerror = () => { URL.revokeObjectURL(url); finish("error"); };

    await audio.play();

  } catch (err) {
    if (err.name === "AbortError") return;
    console.warn("[arabicTTS] fetch failed — fallback:", err.message);
    _fallbackWebSpeech(text, onStart, () => finish("idle"));
  }

  return stopArabicAudio;
}

// ── Web Speech API fallback ────────────────────────────────────────────────
function _fallbackWebSpeech(text, onStart, onEnd) {
  const synth = window.speechSynthesis;
  if (!synth) { onEnd?.(); return; }
  synth.cancel();
  const doSpeak = () => {
    const u   = new SpeechSynthesisUtterance(text);
    u.lang    = "ar-SA";
    u.rate    = 0.82;
    u.pitch   = 1.0;
    const arVoice = synth.getVoices().find(v => v.lang === "ar-SA")
                 || synth.getVoices().find(v => v.lang.startsWith("ar"));
    if (arVoice) u.voice = arVoice;
    u.onstart = () => { _broadcast("playing"); onStart?.(); };
    u.onend   = onEnd;
    u.onerror = onEnd;
    synth.speak(u);
  };
  if (synth.getVoices().length > 0) doSpeak();
  else { synth.onvoiceschanged = () => { synth.onvoiceschanged = null; doSpeak(); }; setTimeout(doSpeak, 800); }
}