/**
 * routes/dictionary.js — Safoua Academy
 * AI-powered Arabic dictionary using Groq (free, no credit card).
 *
 * GET /api/dictionary/translate?word=peace&language=english
 * GET /api/dictionary/translate?word=paix&language=french
 *
 * FIXES (v9):
 *  1. Phrase detection — multi-word input is translated as a phrase, not forced into one word.
 *  2. Transliteration is now generated SERVER-SIDE from the real verified Arabic text,
 *     so it always matches what is displayed. Groq's transliteration is discarded.
 *  3. Ask Groq for exactly 1 example (its most confident guess) — 1 verified = 1 shown.
 */

import express from "express";
import axios   from "axios";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ── Cache ────────────────────────────────────────────────────────── */
const CACHE_VERSION = "v9"; // bumped — server-side transliteration + 1-example logic
const cache         = new Map();
const CACHE_MAX     = 500;

function cacheKey(word, lang) {
  return `${CACHE_VERSION}:${lang}:${word.toLowerCase().trim()}`;
}

function containsArabic(str) {
  return /[\u0600-\u06FF]/.test(str);
}

/* ── Arabic → Latin transliteration ─────────────────────────────────
 * Simple but consistent Buckwalter-style romanization table.
 * Applied to the REAL verified Arabic text, so it always matches
 * what is displayed and played by the reciter.
 * ─────────────────────────────────────────────────────────────── */
const ARABIC_TO_LATIN = {
  // Letters
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'ā',
  'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'j', 'ح': 'ḥ', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 'ṣ', 'ض': 'ḍ',
  'ط': 'ṭ', 'ظ': 'ẓ', 'ع': "'", 'غ': 'gh',
  'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
  'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
  'ي': 'y', 'ى': 'a', 'ة': 'h',
  'ء': "'", 'ئ': "'", 'ؤ': "'",
  'لا': 'lā', 'لأ': 'la', 'لإ': 'li', 'لآ': 'lā',
  // Diacritics → vowels
  '\u064E': 'a',  // fatḥa
  '\u064F': 'u',  // ḍamma
  '\u0650': 'i',  // kasra
  '\u0651': '',   // shadda (double) — handled separately
  '\u0652': '',   // sukūn — no vowel
  '\u064B': 'an', // tanwīn fatḥ
  '\u064C': 'un', // tanwīn ḍamm
  '\u064D': 'in', // tanwīn kasr
  '\u0670': 'ā',  // superscript alif
  '\u0640': '',   // tatweel (stretch)
};

function transliterateArabic(arabicText) {
  if (!arabicText) return "";

  // Normalize: remove zero-width chars, tatweel
  let text = arabicText
    .replace(/\u200c|\u200d|\u200b/g, "")
    .replace(/\u0640/g, "");

  let result = "";
  let i = 0;

  while (i < text.length) {
    const char    = text[i];
    const next    = text[i + 1] || "";
    const shadda  = next === "\u0651";

    // Two-char ligatures first (لا etc.)
    const twoChar = text.slice(i, i + 2);
    if (ARABIC_TO_LATIN[twoChar] !== undefined) {
      result += ARABIC_TO_LATIN[twoChar];
      i += 2;
      continue;
    }

    const mapped = ARABIC_TO_LATIN[char];

    if (mapped !== undefined) {
      // Shadda = double the consonant
      if (shadda && mapped && !/[aeiouāūī]/.test(mapped)) {
        result += mapped + mapped;
        i += 2; // skip shadda
        continue;
      }
      result += mapped;
    } else if (char === "\u0651") {
      // standalone shadda already consumed above — skip
    } else if (char.charCodeAt(0) > 0x0600 && char.charCodeAt(0) < 0x06FF) {
      // Unknown Arabic char — skip silently
    } else {
      result += char; // punctuation, spaces, digits
    }

    i++;
  }

  // Clean up: collapse multiple apostrophes, fix spacing around them
  return result
    .replace(/'{2,}/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── Quran verse fetcher ──────────────────────────────────────────
 * Source: raw.githubusercontent.com/semarketir/quranjson
 * URL pattern: /source/surah/surah_{N}.json
 * Inside JSON: data.verse["verse_{ayah}"] = Arabic text
 * ───────────────────────────────────────────────────────────────── */
const verseCache = new Map();

async function fetchVerseText(surah, ayah) {
  if (!surah || !ayah || surah < 1 || surah > 114 || ayah < 1) return null;

  try {
    let data = verseCache.get(surah);

    if (!data) {
      const url = `https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah/surah_${surah}.json`;
      const response = await axios.get(url, { timeout: 8000 });
      data = response.data;
      verseCache.set(surah, data);
    }

    const verseText = data?.verse?.[`verse_${ayah}`];
    if (!verseText || !containsArabic(verseText)) {
      console.warn(`[Dict] verse not found: S${surah}:A${ayah}`);
      return null;
    }

    return verseText.trim();
  } catch (err) {
    console.warn(`[Dict] fetchVerseText failed for S${surah}:A${ayah}:`, err.message);
    return null;
  }
}

/* ── Route ────────────────────────────────────────────────────────── */
router.get("/translate", async (req, res) => {
  try {
    const { word, language = "english" } = req.query;

    if (!word?.trim()) {
      return res.status(400).json({ success: false, message: "Mot requis." });
    }

    // Sanitize
    const clean = word.trim().replace(/<[^>]*>/g, '').replace(/[^\w\s\u0600-\u06FF'-]/g, '').slice(0, 100);
    if (!clean) {
      return res.status(400).json({ success: false, message: "Mot invalide." });
    }

    const lang = language === "french" ? "french" : "english";
    const key  = cacheKey(clean, lang);

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

    // Phrase vs single-word detection
    const isPhrase = clean.trim().split(/\s+/).length > 1;

    /* ── PHRASE prompt ──────────────────────────────────────────── */
    const phrasePrompt =
`You are an Arabic dictionary API. Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text.

Translate this ${langLabel} phrase to Arabic: "${clean}"

RULES:
1. "arabic" = the most natural Arabic equivalent of the WHOLE phrase "${clean}" WITH full diacritics. Arabic script only. A phrase → a phrase, never reduce to one word.
   - "i trust you" → أَنَا أَثِقُ بِكَ
   - "i love you"  → أُحِبُّكَ
   - "praise be to God" → الْحَمْدُ لِلَّهِ
   - "God willing" → إِنْ شَاءَ اللَّهُ
   - "do not be sad" → لَا تَحْزَنْ

2. "pronunciation" = "" (empty string — will be generated automatically).

3. "root" = "" (phrases have no single root).

4. "meaning" = 2-3 sentences in ${defLang} about meaning and Islamic/Quranic relevance.

5. "examples" = exactly ONE Quranic verse where you are 100% certain the surah and ayah numbers are correct and the verse contains a key word from this phrase. If you are not certain, return an empty array [].

Return exactly this JSON:
{
  "arabic": "<natural Arabic phrase with diacritics>",
  "pronunciation": "",
  "meaning": "<2-3 sentences in ${defLang}>",
  "root": "",
  "examples": [
    {
      "translation": "<${defLang} translation of the verse>",
      "surah": <integer>,
      "ayah": <integer>
    }
  ]
}`;

    /* ── SINGLE-WORD prompt ─────────────────────────────────────── */
    const wordPrompt =
`You are an Arabic dictionary API. Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text.

Translate this single ${langLabel} word to Arabic: "${clean}"

RULES:
1. "arabic" = the single most common Arabic word for "${clean}" WITH full diacritics. Arabic script only.
   - love → مَحَبَّة   peace → سَلَام   light → نُور
   - mercy → رَحْمَة   knowledge → عِلْم   faith → إِيمَان
   - heart → قَلْب   sky → سَمَاء   trust → ثِقَة
   - patience → صَبْر   gratitude → شُكْر   prayer → صَلَاة
   - guidance → هِدَايَة   forgiveness → مَغْفِرَة

2. "pronunciation" = "" (empty string — will be generated automatically).

3. "root" = the Arabic 3-letter root in Arabic script only (e.g. ح ب ب). Must be Arabic script — NOT Latin letters.

4. "meaning" = 2-3 sentences in ${defLang} about the word's meaning and Islamic/Quranic relevance.

5. "examples" = exactly ONE Quranic verse where you are 100% certain:
   - the surah and ayah numbers are correct
   - the verse genuinely contains this word or a clear derivative of it
   If you are not 100% certain, return an empty array [].
   Well-known verses to consider: 2:255 (Ayat al-Kursi), 2:286, 3:18, 20:114, 59:22-24, etc.

Return exactly this JSON:
{
  "arabic": "<single Arabic word with diacritics>",
  "pronunciation": "",
  "meaning": "<2-3 sentences in ${defLang}>",
  "root": "<Arabic script root only, e.g. ح ب ب>",
  "examples": [
    {
      "translation": "<${defLang} translation of the verse>",
      "surah": <integer surah number>,
      "ayah": <integer ayah number>
    }
  ]
}`;

    const prompt = isPhrase ? phrasePrompt : wordPrompt;

    console.log(`[Dict] calling Groq for: "${clean}" (${lang}, ${isPhrase ? "phrase" : "word"})`);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model:       "llama-3.3-70b-versatile",
        max_tokens:  800,
        temperature: 0.1,
        messages: [
          {
            role:    "system",
            content: "You are an Arabic dictionary API. Respond with valid JSON only. Never use markdown. Root field must always be Arabic script, never Latin. For examples, provide only 1 verse where you are 100% certain of the surah and ayah numbers — return [] if unsure.",
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

    /* ── Validate main word ─────────────────────────────────────── */
    const arabic  = (parsed.arabic  || "").trim();
    const meaning = (parsed.meaning || "").trim();
    const rawRoot = (parsed.root    || "").trim();

    if (!arabic || !containsArabic(arabic)) {
      console.error(`[Dict] 'arabic' field invalid: "${arabic}"`);
      return res.status(502).json({
        success: false,
        message: `Traduction arabe invalide pour "${clean}". Réessayez.`,
      });
    }

    // Generate pronunciation server-side from the real Arabic text
    const pronunciation = transliterateArabic(arabic);

    // Root must be Arabic script
    const root = containsArabic(rawRoot) ? rawRoot : "";

    /* ── Verify Quranic example & generate transliteration ──────────
     *
     * We now:
     *  1. Take only Groq's surah+ayah (ignore its Arabic text & transliteration)
     *  2. Fetch the REAL Arabic text from quranjson
     *  3. Generate the transliteration ourselves from that real text
     *     → transliteration always matches what is displayed
     * ─────────────────────────────────────────────────────────────── */
    const rawExamples = Array.isArray(parsed.examples) ? parsed.examples.slice(0, 1) : [];

    const verifiedExamples = await Promise.all(
      rawExamples.map(async (e) => {
        if (!e) return null;

        const surah = e.surah ? parseInt(e.surah) : null;
        const ayah  = e.ayah  ? parseInt(e.ayah)  : null;

        if (!surah || !ayah || isNaN(surah) || isNaN(ayah)) {
          console.warn("[Dict] example missing surah/ayah — dropped");
          return null;
        }

        const realArabic = await fetchVerseText(surah, ayah);

        if (!realArabic) {
          console.warn(`[Dict] could not verify S${surah}:A${ayah} — dropped`);
          return null;
        }

        // Generate transliteration from the REAL Arabic text
        const realTransliteration = transliterateArabic(realArabic);

        console.log(`[Dict] ✅ verified S${surah}:A${ayah}: ${realArabic.slice(0, 60)}…`);
        console.log(`[Dict]    transliteration: ${realTransliteration.slice(0, 80)}…`);

        return {
          arabic:          realArabic,
          transliteration: realTransliteration, // ← server-generated, always matches
          translation:     e.translation || "",
          surah,
          ayah,
        };
      })
    );

    const examples = verifiedExamples.filter(Boolean);

    const result = {
      success:     true,
      word:        clean,
      language:    lang,
      arabic,
      pronunciation,
      meaning:     meaning || `Traduction de "${clean}" en arabe.`,
      root,
      examples,
      source: "Groq AI (llama-3.3-70b)",
    };

    console.log(`[Dict] ✅ "${clean}" → arabic="${result.arabic}" pronunciation="${result.pronunciation}" examples=${examples.length}`);

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

/* ── Cache flush — teacher only ──────────────────────────────────── */
router.get("/flush", authMiddleware, (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ success: false, message: "Accès réservé aux enseignants." });
  }
  const size = cache.size;
  cache.clear();
  verseCache.clear();
  console.log(`[Dict] cache flushed by ${req.user.username} (${size} entries)`);
  res.json({ success: true, flushed: size });
});

export default router;