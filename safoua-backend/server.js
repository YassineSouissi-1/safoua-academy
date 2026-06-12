import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import axios from 'axios';
import pronunciationsRouter from './routes/pronunciations.js';
import ttsRouter from './routes/tts.js';
import dictionaryRouter from './routes/dictionary.js';
import authMiddleware from './middleware/authMiddleware.js';
import Session from './models/Session.js';

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

console.log('⏳ Tentative de connexion à MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err.message));

// ── PRONUNCIATIONS ──────────────────────────────────────────────
app.use('/api/pronunciations', pronunciationsRouter);

// ── TTS (Microsoft Edge Neural — free, no key) ─────────────────
app.use('/api/tts', ttsRouter);

// ── DICTIONARY (Claude AI-powered, protected) ──────────────────
app.use('/api/dictionary', authMiddleware, dictionaryRouter);



// ── INPUT VALIDATION HELPERS ─────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

// ── JWT HELPER ───────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    {
      id:       user._id,
      username: user.username,
      email:    user.email,
      role:     user.role || 'student',
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ── LOGIN ────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });
    if (!validateEmail(email)) return res.status(400).json({ error: "Format d'email invalide." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Mot de passe incorrect.' });

    const token = signToken(user);

    res.status(200).json({
      message: 'Connexion réussie ! 👋',
      token,
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
        role:     user.role || 'student',
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// ── REGISTER ─────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role, teacherCode } = req.body;
    if (role === 'teacher') {
      if (!teacherCode || teacherCode !== process.env.TEACHER_CODE) {
        return res.status(403).json({ error: 'Code enseignant invalide.' });
      }
    }
    if (!username || !email || !password) return res.status(400).json({ error: 'Tous les champs sont requis.' });
    if (!validateEmail(email)) return res.status(400).json({ error: "Format d'email invalide." });
    if (!validatePassword(password)) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
    if (role && !['student', 'teacher'].includes(role)) return res.status(400).json({ error: 'Rôle invalide.' });

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) return res.status(400).json({ error: 'Cet email est déjà utilisé.' });

    const salt = await bcrypt.genSalt(10);
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

// ── GET CURRENT USER (from token) ───────────────────────────────
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json({
      id:               user._id,
      username:         user.username,
      email:            user.email,
      role:             user.role || 'student',
      completedLessons: user.completedLessons,
      points:           user.points,
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── UPDATE PROGRESS (protected) ─────────────────────────────────
app.post('/api/update-progress', authMiddleware, async (req, res) => {
  const { lessonTitle } = req.body;
  if (!lessonTitle) return res.status(400).json({ error: 'Titre de leçon requis.' });
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { completedLessons: lessonTitle }, $inc: { points: 10 } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json({ message: 'Succès', points: user.points });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// ── SESSIONS ROUTES ──────────────────────────────────────────────
// GET all sessions — public
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1, time: 1 });
    const now = new Date();
    const enriched = sessions.map(s => {
      const obj = s.toObject();
      const dt = new Date(`${obj.date}T${obj.time}`);
      obj.status = dt < now ? 'past' : 'upcoming';
      return obj;
    });
    res.json(enriched);
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des sessions.' });
  }
});

// POST create session — teacher only
app.post('/api/sessions', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Accès réservé aux enseignants.' });
    }
    const { title, topic, date, time, teacher } = req.body;
    if (!title || !topic || !date || !time || !teacher) {
      return res.status(400).json({ error: 'Champs obligatoires manquants (titre, sujet, date, heure, enseignant).' });
    }
    const { description, teacherAvatar, duration, maxStudents, level, meetLink, accent } = req.body;
    const session = new Session({ title, topic, description, teacher, teacherAvatar, date, time, duration, maxStudents, level, meetLink, accent });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ error: 'Erreur lors de la création de la session.' });
  }
});

// PUT update session — teacher only
app.put('/api/sessions/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Accès réservé aux enseignants.' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID de session invalide.' });
    }
    const allowed = ['title', 'topic', 'description', 'date', 'time', 'duration', 'maxStudents', 'level', 'meetLink', 'accent'];
    const update = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    const session = await Session.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!session) return res.status(404).json({ error: 'Session introuvable.' });
    res.json(session);
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ error: 'Erreur lors de la modification de la session.' });
  }
});

// DELETE session — teacher only
app.delete('/api/sessions/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Accès réservé aux enseignants.' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID de session invalide.' });
    }
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session supprimée.' });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// POST book a spot — authenticated users
app.post('/api/sessions/:id/book', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID de session invalide.' });
    }
    const username = req.user.username;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session introuvable.' });
    if (session.enrolledStudents.includes(username))
      return res.status(400).json({ error: 'Déjà inscrit à cette session.' });
    if (session.enrolledStudents.length >= session.maxStudents)
      return res.status(400).json({ error: 'Session complète.' });
    session.enrolledStudents.push(username);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Book session error:', err);
    res.status(500).json({ error: 'Erreur lors de la réservation.' });
  }
});

// POST cancel booking — authenticated users
app.post('/api/sessions/:id/cancel', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID de session invalide.' });
    }
    const username = req.user.username;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session introuvable.' });
    session.enrolledStudents = session.enrolledStudents.filter(u => u !== username);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Cancel session error:', err);
    res.status(500).json({ error: "Erreur lors de l'annulation." });
  }
});

// ── CHATBOT ──────────────────────────────────────────────────────
const TEMPLATE_RULES = [
  { patterns: ['bonjour','salam','salut','hello','hi ','coucou','bonsoir','assalam'], answer: "Bonjour et bienvenue sur Safoua Academy ! 👋 Je suis votre assistant IA. Posez-moi n'importe quelle question sur nos cours, l'arabe ou les sciences islamiques." },
  { patterns: ['alphabet','lettres arabe','apprendre l\'arabe','learn arab','arabe debutant','commencer arabe'], answer: "📘 Pour apprendre l'alphabet arabe, rendez-vous sur le cours **Alphabet Arabe & Phonétique** (cours n°1). Il couvre les 28 lettres, leur prononciation et leur écriture. Parfait pour les débutants !" },
  { patterns: ['tajwid','recitation','reciter','regles coran'], answer: "🎵 Le **Tajwid** est la science de la belle récitation du Coran. Notre cours Tajwid (n°2) couvre toutes les règles : la prolongation (Madd), le son nasal (Ghunna), l'assimilation (Idgham) et bien plus." },
  { patterns: ['memoris','hifz','sourate','apprendre par coeur'], answer: "📖 Notre cours de **Mémorisation** (n°3) couvre les 114 sourates avec audio de 5 récitateurs célèbres." },
  { patterns: ['grammaire','nahw','medine','syntaxe arabe'], answer: "📚 Le cours **Grammaire Arabe** (n°4) suit la méthode de l'Université de Médine (Tome 1)." },
  { patterns: ['fiqh','jurisprudence','halal','haram','regles islamiques'], answer: "⚖️ Le cours **Introduction au Fiqh** (n°5) couvre les fondements de la jurisprudence islamique." },
  { patterns: ['sira','prophete','muhammad','vie du prophete','biographie'], answer: "🌟 Le cours **Sîra** (n°6) retrace la vie du Prophète Muhammad ﷺ." },
  { patterns: ['calligraphie','naskh','thuluth','ecriture arabe artistique'], answer: "✍️ Le cours **Calligraphie Arabe** (n°7) enseigne les styles Naskh et Thuluth." },
  { patterns: ['devenir musulman','conversion','shahada','nouveau musulman','piliers islam','convertir'], answer: "☪️ Le cours **Devenir Musulman** (n°8) explique la Chahada et les 5 piliers de l'Islam." },
  { patterns: ['session','cours live','en direct','reserver','professeur','enseignant'], answer: "📅 Les **sessions live** sont disponibles depuis votre Dashboard (Mon Espace > Sessions)." },
  { patterns: ['progression','avancement','badge','points','xp','lecon terminee'], answer: "📊 Votre progression est visible dans le **Dashboard**. Chaque leçon terminée rapporte 10 XP." },
  { patterns: ['dictionnaire','traduire','traduction','mot arabe','signifie'], answer: "📖 Le **Dictionnaire** est accessible depuis le menu. Entrez un mot en français ou en anglais." },
  { patterns: ['inscription','s inscrire','creer un compte','register','sign up'], answer: "✅ Pour vous inscrire, cliquez sur **S'inscrire** en haut à droite. C'est gratuit !" },
  { patterns: ['connexion','se connecter','login','mot de passe','acces mon compte'], answer: "🔑 Pour vous connecter, cliquez sur **Connexion** dans la barre de navigation." },
  { patterns: ['merci','shukran','thank','super','parfait','excellent'], answer: "Avec plaisir ! 😊 N'hésitez pas à revenir si vous avez d'autres questions." },
  { patterns: ['aide','help','comment utiliser','je ne sais pas','perdu'], answer: "💡 Je peux vous aider avec : les cours disponibles, la navigation, les sessions live, votre progression." },
];

function getTemplateResponse(message) {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const rule of TEMPLATE_RULES) {
    for (const pattern of rule.patterns) {
      const np = pattern.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lower.includes(np)) return rule.answer;
    }
  }
  return "Je n'ai pas bien compris votre question. Essayez de me demander des informations sur un cours spécifique, les sessions live, ou la navigation sur Safoua Academy. 😊";
}

// ── In-memory conversation history (keyed by user ID) ───────────
// Capped at MAX_HISTORY_SESSIONS to prevent unbounded memory growth.
const conversationHistory  = new Map();
const MAX_HISTORY_SESSIONS = 1000;

// ── In-memory rate limiter ────────────────────────────────────────
const rateLimitMap = new Map();

// Clean up stale rate-limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of rateLimitMap.entries()) {
    const filtered = times.filter(t => now - t < 60_000);
    if (filtered.length === 0) rateLimitMap.delete(ip);
    else rateLimitMap.set(ip, filtered);
  }
}, 5 * 60 * 1000);

function chatRateLimit(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
  const times = rateLimitMap.get(ip).filter(t => now - t < windowMs);
  if (times.length >= 30) return res.status(429).json({ error: 'Trop de messages. Attendez une minute.' });
  times.push(now);
  rateLimitMap.set(ip, times);
  next();
}

// POST /api/chat — protected: requires valid JWT
app.post('/api/chat', authMiddleware, chatRateLimit, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Veuillez entrer un message.' });
    }

    // Use the authenticated user's ID as the history key
    const uid = req.user.id;

    // Evict oldest session if the map is at capacity
    if (!conversationHistory.has(uid) && conversationHistory.size >= MAX_HISTORY_SESSIONS) {
      const oldestKey = conversationHistory.keys().next().value;
      conversationHistory.delete(oldestKey);
    }

    if (!conversationHistory.has(uid)) conversationHistory.set(uid, []);
    const history = conversationHistory.get(uid);

    const SYSTEM_PROMPT = `Tu es l'assistant IA de Safoua Academy, une plateforme e-learning dédiée à l'enseignement du Coran, de l'arabe et des sciences islamiques.
Tu réponds TOUJOURS en français sauf si on te parle en anglais ou arabe.
Tu es bienveillant, pédagogique, concis et précis (max 3-4 phrases par réponse).
Cours disponibles : Alphabet Arabe & Phonétique, Tajwid, Mémorisation du Coran, Grammaire Arabe, Fiqh, Sîra, Calligraphie Arabe, Devenir Musulman.
Fonctionnalités : sessions live, dictionnaire arabe, suivi de progression, badges XP.
L'utilisateur connecté est : ${req.user.username} (${req.user.role}).`;

    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10),
      { role: 'user', content: message.trim() },
    ];

    // ── Try Groq first ────────────────────────────────────────────
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          { model: 'llama-3.1-8b-instant', messages: chatMessages, max_tokens: 400, temperature: 0.7 },
          {
            headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
            timeout: 20000,
          }
        );
        const reply = response.data?.choices?.[0]?.message?.content;
        if (reply) {
          history.push({ role: 'user', content: message });
          history.push({ role: 'assistant', content: reply });
          if (history.length > 20) history.splice(0, history.length - 20);
          return res.json({ reply });
        }
      } catch (groqError) {
        console.warn('⚠️ Groq API failed:', groqError.response?.data?.error?.message || groqError.message);
      }
    }

    // ── Fallback to Anthropic ─────────────────────────────────────
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 400,
            system: SYSTEM_PROMPT,
            messages: history.slice(-10).concat([{ role: 'user', content: message.trim() }]),
          },
          {
            headers: {
              'x-api-key': process.env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json',
            },
            timeout: 20000,
          }
        );
        const reply = response.data?.content?.[0]?.text;
        if (reply) {
          history.push({ role: 'user', content: message });
          history.push({ role: 'assistant', content: reply });
          if (history.length > 20) history.splice(0, history.length - 20);
          return res.json({ reply });
        }
      } catch (anthropicError) {
        console.warn('⚠️ Anthropic API failed:', anthropicError.message);
      }
    }

    // ── Final fallback: template responses ────────────────────────
    const templateReply = getTemplateResponse(message);
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: templateReply });
    res.json({ reply: templateReply });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(200).json({ reply: getTemplateResponse(req.body?.message || '') });
  }
});

// ── TEST ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Serveur Safoua Academy opérationnel ! 🚀');
});

// ── START ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Le serveur tourne sur : http://localhost:${PORT}`);
});