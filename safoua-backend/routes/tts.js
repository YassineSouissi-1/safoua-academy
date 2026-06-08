/**
 * routes/tts.js — Safoua Academy
 * 
 * Stub route — TTS is handled entirely in the browser via
 * arabicTTS.js (ResponsiveVoice + Web Speech API fallback).
 * 
 * This route returns 501 immediately so the frontend skips
 * to the browser-based TTS without wasting time on a request.
 */

import express from "express";

const router = express.Router();

router.post("/", (_req, res) => {
  res.status(501).json({ error: "TTS handled client-side." });
});

export default router;