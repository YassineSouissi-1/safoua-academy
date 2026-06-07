/**
 * routes/tts.js — Safoua Academy
 * Microsoft Edge Neural TTS — 100% FREE, no API key, no signup.
 *
 * Uses the same public WebSocket endpoint that Microsoft Edge's
 * "Read Aloud" feature uses internally.
 * Voice: ar-SA-ZariyahNeural (female MSA) — clear, natural Arabic.
 *
 * POST /api/tts  { text: "بِسْمِ اللَّهِ" }
 * → returns audio/mpeg
 */

import express    from "express";
import https      from "https";
import http       from "http";
import { randomUUID } from "crypto";

const router = express.Router();

// ── Microsoft Edge TTS constants ──────────────────────────────────────────────
const TRUSTED_TOKEN   = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const CHROMIUM_VER    = "130.0.2849.68";
const VOICE           = "ar-SA-ZariyahNeural"; // Natural MSA Arabic female
const OUTPUT_FORMAT   = "audio-24khz-48kbitrate-mono-mp3";

// Simple in-memory cache (text → Buffer)
const cache     = new Map();
const CACHE_MAX = 300;

// ── Build SSML document ───────────────────────────────────────────────────────
function buildSSML(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='ar-SA'>` +
    `<voice name='${VOICE}'>` +
    `<prosody rate='-5%'>${escaped}</prosody>` +
    `</voice></speak>`;
}

// ── Edge TTS via WebSocket (Node built-in net/tls — no ws package needed) ────
function edgeTTS(text) {
  return new Promise((resolve, reject) => {
    const ssml        = buildSSML(text);
    const connectionId = randomUUID().replace(/-/g, "");
    const reqId        = randomUUID().replace(/-/g, "").toUpperCase();

    // Build the WSS URL
    const wssPath = `/consumer/speech/synthesize/readaloud/edge/v1` +
      `?TrustedClientToken=${TRUSTED_TOKEN}` +
      `&Sec-MS-GEC-Version=1-${CHROMIUM_VER}` +
      `&ConnectionId=${connectionId}`;

    // Manual WebSocket upgrade via HTTPS request
    const options = {
      hostname: "speech.platform.bing.com",
      path:     wssPath,
      method:   "GET",
      headers: {
        "Host":                "speech.platform.bing.com",
        "Upgrade":             "websocket",
        "Connection":          "Upgrade",
        "Sec-WebSocket-Version": "13",
        "Sec-WebSocket-Key":   Buffer.from(randomUUID()).toString("base64"),
        "Origin":              "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
        "User-Agent":          `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_VER} Safari/537.36 Edg/${CHROMIUM_VER}`,
        "Accept-Encoding":     "gzip, deflate, br",
        "Accept-Language":     "en-US,en;q=0.9",
        "Pragma":              "no-cache",
        "Cache-Control":       "no-cache",
      },
    };

    const req = https.request(options);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("WebSocket upgrade timeout")); });

    req.on("upgrade", (res, socket) => {
      const audioChunks = [];
      let   done        = false;
      let   buf         = Buffer.alloc(0);

      // ── Send config message ──────────────────────────────────────────────
      const now = new Date().toUTCString();
      const configMsg =
        `X-Timestamp:${now}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        JSON.stringify({
          context: {
            synthesis: {
              audio: { metadataoptions: { sentenceBoundaryEnabled: false, wordBoundaryEnabled: false }, outputFormat: OUTPUT_FORMAT },
            },
          },
        });
      wsSend(socket, configMsg, 0x1); // text frame

      // ── Send SSML message ─────────────────────────────────────────────────
      const ssmlMsg =
        `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\n` +
        `X-Timestamp:${now}\r\nPath:ssml\r\n\r\n${ssml}`;
      wsSend(socket, ssmlMsg, 0x1); // text frame

      // ── Receive response frames ───────────────────────────────────────────
      socket.on("data", (chunk) => {
        if (done) return;
        buf = Buffer.concat([buf, chunk]);

        while (buf.length >= 2) {
          const fin    = (buf[0] & 0x80) !== 0;
          const opcode = buf[0] & 0x0f;
          let   payloadLen = buf[1] & 0x7f;
          let   offset = 2;

          if (payloadLen === 126) {
            if (buf.length < 4) break;
            payloadLen = buf.readUInt16BE(2);
            offset = 4;
          } else if (payloadLen === 127) {
            if (buf.length < 10) break;
            payloadLen = Number(buf.readBigUInt64BE(2));
            offset = 10;
          }

          if (buf.length < offset + payloadLen) break; // wait for more data

          const payload = buf.slice(offset, offset + payloadLen);
          buf = buf.slice(offset + payloadLen);

          if (opcode === 0x2) {
            // Binary frame — audio data comes after a header separator
            const sep = Buffer.from("Path:audio\r\n");
            const idx = payload.indexOf(sep);
            if (idx !== -1) {
              audioChunks.push(payload.slice(idx + sep.length));
            }
          } else if (opcode === 0x1) {
            // Text frame — check for turn.end
            const text = payload.toString("utf8");
            if (text.includes("Path:turn.end")) {
              done = true;
              socket.destroy();
              if (audioChunks.length === 0) {
                reject(new Error("No audio received from Edge TTS"));
              } else {
                resolve(Buffer.concat(audioChunks));
              }
              return;
            }
          } else if (opcode === 0x8) {
            // Close frame
            socket.destroy();
            if (!done && audioChunks.length > 0) {
              done = true;
              resolve(Buffer.concat(audioChunks));
            } else if (!done) {
              reject(new Error("WebSocket closed before audio received"));
            }
            return;
          }
        }
      });

      socket.on("error", (err) => { if (!done) { done = true; reject(err); } });
      socket.on("close", ()    => { if (!done && audioChunks.length > 0) { done = true; resolve(Buffer.concat(audioChunks)); } });
    });

    req.on("error", reject);
    req.end();
  });
}

// ── Minimal WebSocket frame builder (no masking needed server→server) ─────────
function wsSend(socket, data, opcode) {
  const payload   = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
  const len       = payload.length;
  let   header;

  if (len < 126) {
    header = Buffer.from([0x80 | opcode, len]);
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }

  socket.write(Buffer.concat([header, payload]));
}

// ── Express route ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "Texte requis." });
    const clean = text.trim().slice(0, 500);

    // Cache hit
    if (cache.has(clean)) {
      const buf = cache.get(clean);
      res.set("Content-Type", "audio/mpeg");
      res.set("X-Cache", "HIT");
      return res.send(buf);
    }

    const audioBuffer = await edgeTTS(clean);

    // Store in cache
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
    cache.set(clean, audioBuffer);

    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.set("X-Cache", "MISS");
    res.send(audioBuffer);

  } catch (err) {
    console.error("❌ Edge TTS error:", err.message);
    res.status(502).json({ error: "TTS temporairement indisponible." });
  }
});

export default router;