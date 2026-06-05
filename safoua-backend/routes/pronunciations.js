import express from 'express';
import Pronunciation from '../models/Pronunciation.js';

const router = express.Router();

// GET /api/pronunciations/:surahNumber
router.get('/:surahNumber', async (req, res) => {
  try {
    const surahNumber = parseInt(req.params.surahNumber);
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return res.status(400).json({ error: 'Numéro de sourate invalide (1–114).' });
    }
    const doc = await Pronunciation.findOne({ surahNumber });
    if (!doc) {
      return res.status(404).json({ error: `Pas de prononciation trouvée pour la sourate ${surahNumber}.` });
    }
    res.json({ surahNumber: doc.surahNumber, surahName: doc.surahName, verses: doc.verses });
  } catch (err) {
    console.error('Erreur GET pronunciation:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/pronunciations  →  all surahs (light: no verses array)
router.get('/', async (req, res) => {
  try {
    const all = await Pronunciation.find({}, { surahNumber: 1, surahName: 1, _id: 0 }).sort({ surahNumber: 1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

export default router;