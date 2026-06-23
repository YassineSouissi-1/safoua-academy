/**
 * routes/quranProgress.js — Safoua Academy
 * GET  /api/quran-progress        → load the user's bookmark
 * PUT  /api/quran-progress        → save / update bookmark
 * DELETE /api/quran-progress      → clear bookmark
 */
import express       from 'express';
import { body, validationResult } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import QuranProgress  from '../models/QuranProgress.js';

const router = express.Router();

// All routes require a valid JWT
router.use(authMiddleware);

/* ── Validation ──────────────────────────────────────────────────── */
const bookmarkValidation = [
  body('surahNumber').isInt({ min: 1, max: 114 }).withMessage('Numéro de sourate invalide.'),
  body('surahNameAr').trim().notEmpty().isLength({ max: 60 }),
  body('surahNameEn').trim().notEmpty().isLength({ max: 60 }),
  body('ayahNumber').isInt({ min: 1 }).withMessage('Numéro de verset invalide.'),
  body('totalAyahs').isInt({ min: 1 }).withMessage('Total de versets invalide.'),
  body('reciter').optional().trim().isLength({ max: 40 }),
];

/* ── GET — load bookmark ─────────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const progress = await QuranProgress.findOne({ user: req.user.id });
    if (!progress) return res.json({ bookmark: null });
    res.json({ bookmark: progress });
  } catch (err) {
    console.error('[quranProgress] GET error:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/* ── PUT — save / update bookmark ───────────────────────────────── */
router.put('/', bookmarkValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { surahNumber, surahNameAr, surahNameEn, ayahNumber, totalAyahs, reciter } = req.body;

  try {
    const progress = await QuranProgress.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        surahNumber, surahNameAr, surahNameEn,
        ayahNumber, totalAyahs,
        reciter: reciter || 'mishari',
        savedAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ bookmark: progress });
  } catch (err) {
    console.error('[quranProgress] PUT error:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

/* ── DELETE — clear bookmark ─────────────────────────────────────── */
router.delete('/', async (req, res) => {
  try {
    await QuranProgress.deleteOne({ user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    console.error('[quranProgress] DELETE error:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

export default router;