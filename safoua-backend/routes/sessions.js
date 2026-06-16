/**
 * routes/sessions.js — Safoua Academy
 * ─────────────────────────────────────
 * CRUD for live sessions + booking/cancellation.
 *
 * FIX 1 (extracted from server.js monolith)
 * FIX 2 enrolledStudents now stores user IDs (strings) instead of
 *        usernames — if a username changes, bookings are no longer broken.
 *
 * NOTE for frontend: when checking if the current user is booked,
 *   compare against user.id (from JWT/getUser()), not user.username.
 *   Example:  session.enrolledStudents.includes(user.id)
 */

import express  from 'express';
import mongoose from 'mongoose';
import Session  from '../models/Session.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper — validate MongoDB ObjectId
function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ── GET /api/sessions — public ──────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1, time: 1 });
    const now      = new Date();
    const enriched = sessions.map(s => {
      const obj = s.toObject();
      const dt  = new Date(`${obj.date}T${obj.time}`);
      obj.status = dt < now ? 'past' : 'upcoming';
      return obj;
    });
    res.json(enriched);
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des sessions.' });
  }
});

// ── POST /api/sessions — teacher only ──────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ error: 'Accès réservé aux enseignants.' });

    const { title, topic, date, time, teacher } = req.body;
    if (!title || !topic || !date || !time || !teacher)
      return res.status(400).json({ error: 'Champs obligatoires manquants (titre, sujet, date, heure, enseignant).' });

    const { description, teacherAvatar, duration, maxStudents, level, meetLink, accent } = req.body;
    const session = new Session({
      title, topic, description, teacher, teacherAvatar,
      date, time, duration, maxStudents, level, meetLink, accent,
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ error: 'Erreur lors de la création de la session.' });
  }
});

// ── PUT /api/sessions/:id — teacher only ───────────────────────────
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ error: 'Accès réservé aux enseignants.' });
    if (!validId(req.params.id))
      return res.status(400).json({ error: 'ID de session invalide.' });

    const allowed = ['title','topic','description','date','time','duration','maxStudents','level','meetLink','accent'];
    const update  = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );
    const session = await Session.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!session)
      return res.status(404).json({ error: 'Session introuvable.' });
    res.json(session);
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ error: 'Erreur lors de la modification de la session.' });
  }
});

// ── DELETE /api/sessions/:id — teacher only ────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ error: 'Accès réservé aux enseignants.' });
    if (!validId(req.params.id))
      return res.status(400).json({ error: 'ID de session invalide.' });

    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session supprimée.' });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// ── POST /api/sessions/:id/book — authenticated ────────────────────
router.post('/:id/book', authMiddleware, async (req, res) => {
  try {
    if (!validId(req.params.id))
      return res.status(400).json({ error: 'ID de session invalide.' });

    // FIX: use user ID (not username) so bookings survive username changes
    const userId  = req.user.id.toString();
    const session = await Session.findById(req.params.id);
    if (!session)
      return res.status(404).json({ error: 'Session introuvable.' });
    if (session.enrolledStudents.includes(userId))
      return res.status(400).json({ error: 'Déjà inscrit à cette session.' });
    if (session.enrolledStudents.length >= session.maxStudents)
      return res.status(400).json({ error: 'Session complète.' });

    session.enrolledStudents.push(userId);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Book session error:', err);
    res.status(500).json({ error: 'Erreur lors de la réservation.' });
  }
});

// ── POST /api/sessions/:id/cancel — authenticated ──────────────────
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    if (!validId(req.params.id))
      return res.status(400).json({ error: 'ID de session invalide.' });

    const userId  = req.user.id.toString();
    const session = await Session.findById(req.params.id);
    if (!session)
      return res.status(404).json({ error: 'Session introuvable.' });

    session.enrolledStudents = session.enrolledStudents.filter(id => id !== userId);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Cancel session error:', err);
    res.status(500).json({ error: "Erreur lors de l'annulation." });
  }
});

export default router;
