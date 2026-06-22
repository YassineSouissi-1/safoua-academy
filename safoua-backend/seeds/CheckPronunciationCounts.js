/**
 * checkPronunciationCounts.js
 * Quick diagnostic — prints how many verses are CURRENTLY stored in
 * MongoDB for every surah, so we can see if Al-Baqarah (286) and
 * Aal-Imran (200) really have full data or if the seed never updated them.
 *
 * Run with: node seeds/checkPronunciationCounts.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import Pronunciation from '../models/Pronunciation.js';

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const docs = await Pronunciation.find({}, { surahNumber: 1, surahName: 1, verses: 1 })
    .sort({ surahNumber: 1 });

  console.log(`Total docs in DB: ${docs.length}\n`);
  for (const d of docs) {
    if (d.surahNumber === 2 || d.surahNumber === 3) {
      console.log(`>>> Surah ${d.surahNumber} (${d.surahName}): ${d.verses.length} verses currently in DB`);
    }
  }

  await mongoose.disconnect();
}

check();