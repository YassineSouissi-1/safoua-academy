/**
 * server.js — Safoua Academy
 * ──────────────────────────
 * Responsibilities: DB connection, CORS, security headers, mount routers.
 * All business logic lives in routes/*.js
 *
 * UPGRADES:
 *   - helmet: HTTP security headers (CSP, X-Frame-Options, HSTS, etc.)
 *   - express-rate-limit: global limiter as a safety net on all routes
 *   - Auth rate limiting moved to express-rate-limit (was custom Map)
 */

import express    from 'express';
import cors       from 'cors';
import dotenv     from 'dotenv';
import mongoose   from 'mongoose';
import helmet     from 'helmet';
import rateLimit  from 'express-rate-limit';

import authRouter          from './routes/auth.js';
import sessionsRouter      from './routes/sessions.js';
import chatRouter          from './routes/chat.js';
import pronunciationsRouter from './routes/pronunciations.js';
import dictionaryRouter    from './routes/dictionary.js';
import authMiddleware      from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// ── SECURITY HEADERS (helmet) ───────────────────────────────────────
// Sets X-Frame-Options, X-Content-Type-Options, HSTS, referrer-policy, etc.
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); // reject oversized payloads

// ── GLOBAL RATE LIMIT (safety net — generous ceiling) ───────────────
// Individual routes apply tighter limits on top of this.
const globalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             300,             // max 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Trop de requêtes. Réessayez dans quelques minutes.' },
});
app.use(globalLimiter);

// ── DATABASE ─────────────────────────────────────────────────────────
console.log('⏳ Connexion à MongoDB…');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté !'))
  .catch((err) => console.error('❌ MongoDB :', err.message));

// ── ROUTES ───────────────────────────────────────────────────────────
// Auth  →  POST /api/login, /api/register, GET /api/me, POST /api/update-progress
app.use('/api', authRouter);

// Sessions  →  /api/sessions/**
app.use('/api/sessions', sessionsRouter);

// Chatbot  →  POST /api/chat
app.use('/api/chat', chatRouter);

// Pronunciations  →  /api/pronunciations/**
app.use('/api/pronunciations', pronunciationsRouter);

// Dictionary  →  /api/dictionary/** (protected)
app.use('/api/dictionary', authMiddleware, dictionaryRouter);

// ── HEALTH ───────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.send('Safoua Academy API 🚀'));

// ── START ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur en ligne : http://localhost:${PORT}`)
);
