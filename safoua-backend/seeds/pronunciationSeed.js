/**
 * pronunciationSeed.js
 * Run with: node seeds/pronunciationSeed.js
 * Populates the `pronunciations` collection with French phonetic
 * pronunciations for every verse of all 114 surahs.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import Pronunciation from '../models/Pronunciation.js';
import { juzzAmmaSurahs } from './data/surahs_juzz_amma.js';
import { surahs_67_77 } from './data/surahs_67_77.js';
import { surahs_36_66 } from './data/surahs_36_66.js';
import { surahs_2_35 } from './data/surahs_2_35.js';

// ─── Merge all surah data ───────────────────────────────────────
const ALL_DATA = [
  ...surahs_2_35,
  ...surahs_36_66,
  ...surahs_67_77,
  ...juzzAmmaSurahs,
];

// Remove duplicates (keep last occurrence wins)
const deduped = [];
const seen = new Set();
for (const s of ALL_DATA) {
  const key = s.surahNumber;
  if (!seen.has(key)) {
    seen.add(key);
    deduped.push(s);
  }
}

// Sort by surah number
deduped.sort((a, b) => a.surahNumber - b.surahNumber);

async function seed() {
  try {
    console.log('⏳ Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    console.log(`📖 ${deduped.length} sourates à insérer...`);

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const surah of deduped) {
      try {
        const result = await Pronunciation.findOneAndUpdate(
          { surahNumber: surah.surahNumber },
          {
            surahNumber: surah.surahNumber,
            surahName: surah.surahName,
            verses: surah.verses,
          },
          { upsert: true, new: true }
        );
        if (result) {
          const wasNew = result.__v === undefined || result.createdAt?.getTime() === result.updatedAt?.getTime();
          wasNew ? inserted++ : updated++;
          process.stdout.write(`\r✔ Sourate ${surah.surahNumber} — ${surah.surahName} (${surah.verses.length} versets)`);
        }
      } catch (err) {
        console.error(`\n❌ Erreur sourate ${surah.surahNumber}: ${err.message}`);
        errors++;
      }
    }

    console.log('\n');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Seed terminé !`);
    console.log(`   📗 Sourates traitées : ${deduped.length}`);
    console.log(`   ❌ Erreurs           : ${errors}`);
    console.log('═══════════════════════════════════════');

    // Verify
    const total = await Pronunciation.countDocuments();
    console.log(`📊 Total en base : ${total} sourates`);

    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur fatale:', err.message);
    process.exit(1);
  }
}

seed();