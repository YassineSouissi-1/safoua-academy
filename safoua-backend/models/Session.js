import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  topic:            { type: String, required: true },
  description:      String,
  teacher:          { type: String, required: true },
  teacherAvatar:    String,
  date:             { type: String, required: true },
  time:             { type: String, required: true },
  duration:         { type: Number, default: 60 },
  maxStudents:      { type: Number, default: 8 },
  enrolledStudents: { type: [String], default: [] },
  level:            { type: String, default: 'Débutant' },
  meetLink:         String,
  accent:           { type: String, default: '#8b5cf6' },
  status:           { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
}, { timestamps: true });

export default mongoose.model('Session', SessionSchema);