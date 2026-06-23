/**
 * models/QuranProgress.js — Safoua Academy
 * Stores each user's Quran reading bookmark:
 *   - which surah they stopped on
 *   - which ayah (verse) number
 *   - timestamp of last update
 * One document per user (upserted on save).
 */
import mongoose from 'mongoose';

const QuranProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,   // one bookmark per user
    index: true,
  },
  surahNumber:  { type: Number, required: true, min: 1, max: 114 },
  surahNameAr:  { type: String, required: true },
  surahNameEn:  { type: String, required: true },
  ayahNumber:   { type: Number, required: true, min: 1 },
  totalAyahs:   { type: Number, required: true },
  reciter:      { type: String, default: 'mishari' },
  savedAt:      { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('QuranProgress', QuranProgressSchema);