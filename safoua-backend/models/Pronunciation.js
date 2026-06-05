import mongoose from 'mongoose';

const pronunciationSchema = new mongoose.Schema({
  surahNumber: { type: Number, required: true, unique: true },
  surahName: { type: String, required: true },
  verses: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model('Pronunciation', pronunciationSchema);
