/**
 * routes/auth.js — Safoua Academy
 * ─────────────────────────────────
 * Handles: login, register, /me, update-progress
 *
 * UPGRADES:
 *   - express-rate-limit replaces custom in-memory Map limiter
 *   - express-validator for input sanitization on all routes
 */

import express    from 'express';
import bcrypt     from 'bcrypt';
import jwt        from 'jsonwebtoken';
import rateLimit  from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import User       from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ── AUTH RATE LIMIT — 10 attempts / minute per IP ──────────────────
const authRateLimit = rateLimit({
  windowMs:        60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Trop de tentatives. Réessayez dans une minute.' },
});

// ── INPUT VALIDATORS ───────────────────────────────────────────────
const loginValidation = [
  body('email').trim().isEmail().withMessage("Format d'email invalide.").normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis.'),
];

const registerValidation = [
  body('username').trim().notEmpty().withMessage('Nom d\'utilisateur requis.').isLength({ max: 50 }).escape(),
  body('email').trim().isEmail().withMessage("Format d'email invalide.").normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  body('role').optional().isIn(['student', 'teacher']).withMessage('Rôle invalide.'),
  body('teacherCode').optional().trim().escape(),
];

// NOTE: .escape() was removed — it HTML-entity-encodes characters like
// apostrophes (' → &#x27;), which broke exact-string matching between
// what the frontend saves and what it later compares against when
// reloading progress (e.g. "L'Assimilation" became "L&#x27;Assimilation"
// in the DB, so the next page load could never find it again).
// This field is only ever stored in MongoDB and rendered by React
// (which auto-escapes text), so .escape() added no real protection here.
const progressValidation = [
  body('lessonTitle').trim().notEmpty().withMessage('Titre de leçon requis.').isLength({ max: 200 }),
];

// ── JWT HELPER ─────────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email, role: user.role || 'student' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ── POST /api/login ────────────────────────────────────────────────
router.post('/login', authRateLimit, loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(400).json({ error: 'Utilisateur non trouvé.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Mot de passe incorrect.' });

    const token = signToken(user);
    res.status(200).json({
      message: 'Connexion réussie ! 👋',
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role || 'student' },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// ── POST /api/register ─────────────────────────────────────────────
router.post('/register', authRateLimit, registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const { username, email, password, role, teacherCode } = req.body;

    if (role === 'teacher') {
      if (!teacherCode || teacherCode !== process.env.TEACHER_CODE)
        return res.status(403).json({ error: 'Code enseignant invalide.' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists)
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username.trim(),
      email:    email.toLowerCase().trim(),
      password: hashedPassword,
      role:     role || 'student',
    });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès ! 🛡️' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// Old rows saved before the .escape() fix may contain HTML-entity-encoded
// characters (e.g. "L&#x27;Assimilation" instead of "L'Assimilation").
// Decoding here means existing users don't lose progress that was already
// saved under the broken encoding — it heals itself on next read/write.
function unescapeEntities(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

// ── GET /api/me ────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json({
      id:               user._id,
      username:         user.username,
      email:            user.email,
      role:             user.role || 'student',
      completedLessons: (user.completedLessons || []).map(unescapeEntities),
      points:           user.points,
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── POST /api/update-progress ──────────────────────────────────────
router.post('/update-progress', authMiddleware, progressValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const lessonTitle = req.body.lessonTitle;
    // Also clean up the old escaped variant if it exists, so a user who
    // already has the broken entry doesn't end up with two near-duplicate
    // rows (the old escaped one + the new clean one) padding their count.
    const escapedVariant = lessonTitle
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });

    // MongoDB won't allow $addToSet and $pull on the same field in one
    // update, so the old-escaped-duplicate cleanup runs as its own step.
    if (escapedVariant !== lessonTitle) {
      await User.updateOne(
        { _id: req.user.id },
        { $pull: { completedLessons: escapedVariant } }
      );
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { completedLessons: lessonTitle }, $inc: { points: 10 } },
      { new: true }
    );
    res.json({ message: 'Succès', points: updated.points });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

export default router;
