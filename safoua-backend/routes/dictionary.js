/**
 * routes/dictionary.js — Safoua Academy
 * AI-powered Arabic dictionary using Groq (free, no credit card).
 *
 * GET /api/dictionary/translate?word=peace&language=english
 * GET /api/dictionary/translate?word=paix&language=french
 */

import express from "express";
import axios   from "axios";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ── Cache ────────────────────────────────────────────────────────── */
const CACHE_VERSION = "v6";
const cache         = new Map();
const CACHE_MAX     = 500;

function cacheKey(word, lang) {
  return `${CACHE_VERSION}:${lang}:${word.toLowerCase().trim()}`;
}

function containsArabic(str) {
  return /[\u0600-\u06FF]/.test(str);
}

/* ── Route ────────────────────────────────────────────────────────── */
router.get("/translate", async (req, res) => {
  try {
    const { word, language = "english" } = req.query;

    if (!word?.trim()) {
      return res.status(400).json({ success: false, message: "Mot requis." });
    }

    const clean = word.trim().slice(0, 100);
    const lang  = language === "french" ? "french" : "english";
    const key   = cacheKey(clean, lang);

    /* ── Cache hit ──────────────────────────────────────────────── */
    if (cache.has(key)) {
      console.log(`[Dict] cache HIT: ${key}`);
      return res.json(cache.get(key));
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "Service de traduction non configuré (GROQ_API_KEY manquant).",
      });
    }

    const langLabel = lang === "french" ? "French" : "English";
    const defLang   = lang === "french" ? "French" : "English";

    const prompt =
`You are an Arabic dictionary API. Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text whatsoever.

Translate this single word to Arabic: "${clean}"
Source language: ${langLabel}

STRICT RULES:
1. "arabic" = the single most common Arabic word for "${clean}" WITH full diacritics. Must be Arabic script (Unicode \\u0600-\\u06FF). Must NOT be "${clean}".
   - love → مَحَبَّة
   - peace → سَلَام
   - light → نُور
   - mercy → رَحْمَة
   - knowledge → عِلْم
   - faith → إِيمَان
   - heart → قَلْب
   - sky → سَمَاء

2. "pronunciation" = Latin romanization of the Arabic word ONLY (e.g. maḥabbah, salām, nūr). Must NOT contain "${clean}". Must NOT be Arabic script.

3. "root" = the Arabic 3-letter root in Arabic script only (e.g. ح ب ب or حبب). Must be Arabic script. Must NOT be Latin letters like "h-b-b".

4. "meaning" = 2-3 sentences in ${defLang} about the meaning and Islamic/Quranic relevance.

5. "examples" = 1-2 short Quranic or Islamic phrases using the word.

Return exactly:
{
  "arabic": "<single Arabic word with diacritics>",
  "pronunciation": "<Latin romanization only, e.g. maḥabbah>",
  "meaning": "<2-3 sentences in ${defLang}>",
  "root": "<Arabic script root only, e.g. ح ب ب>",
  "examples": [
    {
      "arabic": "<Arabic phrase with diacritics>",
      "transliteration": "<Latin romanization>",
      "translation": "<${defLang} translation>"
    }
  ]
}`;

    console.log(`[Dict] calling Groq for: "${clean}" (${lang})`);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model:       "llama-3.3-70b-versatile",
        max_tokens:  900,
        temperature: 0.1,
        messages: [
          {
            role:    "system",
            content: "You are an Arabic dictionary API. Always respond with valid JSON only. Never use markdown. Never use Latin letters for the root field — always use Arabic script.",
          },
          {
            role:    "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization:  `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const rawContent = response.data?.choices?.[0]?.message?.content?.trim() || "";

    // Strip accidental markdown fences
    let jsonStr = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i,    "")
      .replace(/```\s*$/,     "")
      .trim();

    console.log(`[Dict] raw JSON:\n${jsonStr}\n`);

    /* ── Parse ──────────────────────────────────────────────────── */
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("[Dict] JSON parse failed:", parseErr.message, "\nRaw:", jsonStr);
      return res.status(502).json({
        success: false,
        message: "Erreur de traitement de la réponse.",
      });
    }

    /* ── Validate ────────────────────────────────────────────────── */
    const arabic        = (parsed.arabic        || "").trim();
    const pronunciation = (parsed.pronunciation || "").trim();
    const meaning       = (parsed.meaning       || "").trim();
    const rawRoot       = (parsed.root          || "").trim();

    if (!arabic || !containsArabic(arabic)) {
      console.error(`[Dict] 'arabic' field invalid: "${arabic}"`);
      return res.status(502).json({
        success: false,
        message: `Traduction arabe invalide pour "${clean}". Réessayez.`,
      });
    }

    const pLower = pronunciation.toLowerCase();
    const badPronunciation =
      pLower === clean.toLowerCase()   ||
      pLower.includes("prononciation") ||
      pLower.includes("pronunciation") ||
      pLower.includes("de:")           ||
      containsArabic(pronunciation);

    // Root must be Arabic script — if it came back as Latin (e.g. "h-b-b"), discard it
    const root = containsArabic(rawRoot) ? rawRoot : "";

    const result = {
      success:       true,
      word:          clean,
      language:      lang,
      arabic,
      pronunciation: badPronunciation ? "" : pronunciation,
      meaning:       meaning || `Traduction de "${clean}" en arabe.`,
      root,
      examples:      Array.isArray(parsed.examples)
                       ? parsed.examples.filter(
                           (e) => e && e.arabic && containsArabic(e.arabic)
                         )
                       : [],
      source: "Groq AI (llama-3.3-70b)",
    };

    console.log(`[Dict] ✅ "${clean}" → arabic="${result.arabic}" pronunciation="${result.pronunciation}" root="${result.root}"`);

    /* ── Cache ───────────────────────────────────────────────────── */
    if (cache.size >= CACHE_MAX) {
      cache.delete(cache.keys().next().value);
    }
    cache.set(key, result);

    res.json(result);

  } catch (err) {
    console.error("❌ Dictionary error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Erreur interne du service de traduction.",
      detail:  err.message,
    });
  }
});

/* ── Cache flush (dev: GET /api/dictionary/flush) ─────────────────── */
router.get("/flush", authMiddleware, (_req, res) => {
  const size = cache.size;
  cache.clear();
  console.log(`[Dict] cache flushed (${size} entries)`);
  res.json({ success: true, flushed: size });
});

export default router;