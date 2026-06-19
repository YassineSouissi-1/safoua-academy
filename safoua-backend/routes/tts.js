/**
 * routes/tts.js — Safoua Academy
 *
 * Voice engine: ElevenLabs (https://elevenlabs.io)
 *   - Free forever, no credit card, just email signup
 *   - 10,000 characters/month on the free tier
 *   - eleven_multilingual_v2 model: real neural voice, auto-detects Arabic
 *     from the text itself — no language code needed, handles harakat
 *     far better than VoiceRSS or a generic browser voice.
 *
 * Responses are cached to disk (safoua-backend/tts-cache/) so every
 * repeated word/letter only ever costs quota ONCE, ever — not monthly.
 * With ~28 letters + a few hundred vocab words, the entire app's audio
 * fits comfortably inside a single month's free quota and then costs
 * nothing more after that.
 *
 * IMPORTANT: this route's contract (GET /api/tts?text=...&rate=...) is
 * unchanged, so arabicTTS.js on the frontend does NOT need any edits —
 * just drop this file in and add the .env key. The `rate` param is
 * accepted for compatibility but not sent to ElevenLabs (their basic
 * TTS endpoint doesn't expose a speed control).
 *
 * GET /api/tts?text=أَلِف
 * → streams audio/mpeg
 */

import express from "express";
import crypto  from "crypto";
import fs      from "fs";
import path    from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const CACHE_DIR  = path.join(__dirname, "..", "tts-cache");

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const ELEVEN_KEY     = process.env.ELEVENLABS_API_KEY;
// "Rachel" — one of the default voices included in every ElevenLabs account,
// usable on the free tier. Swap via ELEVENLABS_VOICE_ID if you pick another
// voice from your dashboard's "Voices" tab.
const DEFAULT_VOICE  = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
const MODEL_ID        = "eleven_multilingual_v2";

function cacheKey(text, voiceId) {
  return crypto.createHash("sha1").update(`${voiceId}|${text}`).digest("hex");
}

router.get("/", async (req, res) => {
  const text    = (req.query.text || "").trim();
  const voiceId = req.query.voice || DEFAULT_VOICE;
  // rate is accepted for frontend compatibility but ElevenLabs' basic
  // TTS endpoint has no speed parameter, so it's intentionally unused here.

  if (!text || text.length > 500) {
    return res.status(400).json({ error: "text param required (max 500 chars)" });
  }
  if (!ELEVEN_KEY) {
    return res.status(503).json({ error: "ElevenLabs not configured on server (missing ELEVENLABS_API_KEY)" });
  }

  const key      = cacheKey(text, voiceId);
  const filePath = path.join(CACHE_DIR, `${key}.mp3`);

  // ── Serve from disk cache (saves quota on every repeat) ─────────────────
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type",  "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=2592000"); // 30 days
    res.setHeader("X-Cache",       "HIT");
    return fs.createReadStream(filePath).pipe(res);
  }

  try {
    const elRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key":   ELEVEN_KEY,
          "Content-Type": "application/json",
          "Accept":       "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!elRes.ok) {
      const errBody = await elRes.json().catch(() => ({}));
      console.error("[tts] ElevenLabs error:", elRes.status, errBody);
      return res.status(502).json({
        error: errBody?.detail?.message || `ElevenLabs returned ${elRes.status}`,
      });
    }

    const buf = Buffer.from(await elRes.arrayBuffer());
    fs.writeFile(filePath, buf, () => {}); // fire-and-forget disk cache

    res.setHeader("Content-Type",  "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.setHeader("X-Cache",       "MISS");
    res.end(buf);
  } catch (err) {
    console.error("[tts] ElevenLabs fetch failed:", err.message);
    res.status(500).json({ error: "TTS request failed" });
  }
});

export default router;