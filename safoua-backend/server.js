import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import axios from "axios";
import pronunciationsRouter from './routes/pronunciations.js';
import ttsRouter from './routes/tts.js';
import dictionaryRouter from './routes/dictionary.js';

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

console.log("⏳ Tentative de connexion à MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connexion à MongoDB réussie !"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err.message));

// ── PRONUNCIATIONS ──────────────────────────────────────────────
app.use('/api/pronunciations', pronunciationsRouter);

// ── TTS (Microsoft Edge Neural — free, no key) ─────────────────
app.use('/api/tts', ttsRouter);

// ── DICTIONARY (Claude AI-powered) ─────────────────────────────
app.use('/api/dictionary', dictionaryRouter);

// ── SESSION MODEL ───────────────────────────────────────────────
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
  level:            { type: String, default: "Débutant" },
  meetLink:         String,
  accent:           { type: String, default: "#8b5cf6" },
  status:           { type: String, enum: ["upcoming", "past"], default: "upcoming" },
}, { timestamps: true });

const Session = mongoose.model("Session", SessionSchema);

// ── INPUT VALIDATION HELPERS ─────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

// ── LOGIN ────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis." });
    if (!validateEmail(email)) return res.status(400).json({ error: "Format d'email invalide." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ error: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect." });

    res.status(200).json({
      message: "Connexion réussie ! 👋",
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
        role:     user.role || "student",
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});

// ── REGISTER ─────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role, teacherCode } = req.body;
    if (role === "teacher") {
      if (!teacherCode || teacherCode !== process.env.TEACHER_CODE) {
        return res.status(403).json({ error: "Code enseignant invalide." });
      }
    }
    if (!username || !email || !password) return res.status(400).json({ error: "Tous les champs sont requis." });
    if (!validateEmail(email)) return res.status(400).json({ error: "Format d'email invalide." });
    if (!validatePassword(password)) return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
    if (role && !["student", "teacher"].includes(role)) return res.status(400).json({ error: "Rôle invalide." });

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) return res.status(400).json({ error: "Cet email est déjà utilisé." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "student",
    });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès ! 🛡️" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// ── UPDATE PROGRESS ──────────────────────────────────────────────
app.post('/api/update-progress', async (req, res) => {
  const { email, lessonTitle } = req.body;
  if (!email || !lessonTitle) return res.status(400).json({ error: "Email et titre de leçon requis." });
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { completedLessons: lessonTitle }, $inc: { points: 10 } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });
    res.json({ message: "Succès", points: user.points });
  } catch (err) {
    console.error("Update progress error:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// ── GET USER ─────────────────────────────────────────────────────
app.get('/api/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.status(200).json({
      username:         user.username,
      email:            user.email,
      role:             user.role || "student",
      completedLessons: user.completedLessons,
      points:           user.points,
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des données" });
  }
});

// ── TEST ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Serveur Safoua Academy opérationnel ! 🚀');
});

// ── SESSIONS ROUTES ──────────────────────────────────────────────

// GET all sessions — auto-updates status based on current date/time
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1, time: 1 });
    const now = new Date();
    const enriched = sessions.map(s => {
      const obj = s.toObject();
      const dt = new Date(`${obj.date}T${obj.time}`);
      obj.status = dt < now ? "past" : "upcoming";
      return obj;
    });
    res.json(enriched);
  } catch (err) {
    console.error("Get sessions error:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des sessions." });
  }
});

// POST create session (teacher)
app.post('/api/sessions', async (req, res) => {
  try {
    const { title, topic, date, time, teacher } = req.body;
    if (!title || !topic || !date || !time || !teacher) {
      return res.status(400).json({ error: "Champs obligatoires manquants (titre, sujet, date, heure, enseignant)." });
    }
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ error: "Erreur lors de la création de la session." });
  }
});

// PUT update session
app.put('/api/sessions/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de session invalide." });
    }
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ error: "Session introuvable." });
    res.json(session);
  } catch (err) {
    console.error("Update session error:", err);
    res.status(500).json({ error: "Erreur lors de la modification de la session." });
  }
});

// DELETE session
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de session invalide." });
    }
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: "Session supprimée." });
  } catch (err) {
    console.error("Delete session error:", err);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

// POST book a spot
app.post('/api/sessions/:id/book', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de session invalide." });
    }
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Nom d'utilisateur requis." });
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session introuvable." });
    if (session.enrolledStudents.includes(username))
      return res.status(400).json({ error: "Déjà inscrit à cette session." });
    if (session.enrolledStudents.length >= session.maxStudents)
      return res.status(400).json({ error: "Session complète." });
    session.enrolledStudents.push(username);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error("Book session error:", err);
    res.status(500).json({ error: "Erreur lors de la réservation." });
  }
});

// POST cancel booking
app.post('/api/sessions/:id/cancel', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de session invalide." });
    }
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Nom d'utilisateur requis." });
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session introuvable." });
    session.enrolledStudents = session.enrolledStudents.filter(u => u !== username);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error("Cancel session error:", err);
    res.status(500).json({ error: "Erreur lors de l'annulation." });
  }
});

// ── CHATBOT TEMPLATE FALLBACK ────────────────────────────────────
// Used only when no AI API key is configured.
const TEMPLATE_RULES = [
  {
    patterns: ["bonjour", "salam", "salut", "hello", "hi ", "coucou", "bonsoir", "assalam"],
    answer: "Bonjour et bienvenue sur Safoua Academy ! 👋 Je suis votre assistant IA. Posez-moi n'importe quelle question sur nos cours, l'arabe ou les sciences islamiques."
  },
  {
    patterns: ["alphabet", "lettres arabe", "apprendre l'arabe", "learn arab", "arabe debutant", "commencer arabe"],
    answer: "📘 Pour apprendre l'alphabet arabe, rendez-vous sur le cours **Alphabet Arabe & Phonétique** (cours n°1). Il couvre les 28 lettres, leur prononciation et leur écriture. Parfait pour les débutants !"
  },
  {
    patterns: ["tajwid", "tajwid", "recitation", "reciter", "regles coran"],
    answer: "🎵 Le **Tajwid** est la science de la belle récitation du Coran. Notre cours Tajwid (n°2) couvre toutes les règles : la prolongation (Madd), le son nasal (Ghunna), l'assimilation (Idgham) et bien plus."
  },
  {
    patterns: ["memoris", "hifz", "sourate", "apprendre par coeur"],
    answer: "📖 Notre cours de **Mémorisation** (n°3) couvre les 114 sourates avec audio de 5 récitateurs célèbres. Vous pouvez écouter, répéter et suivre votre progression."
  },
  {
    patterns: ["grammaire", "nahw", "medine", "syntaxe arabe"],
    answer: "📚 Le cours **Grammaire Arabe** (n°4) suit la méthode de l'Université de Médine (Tome 1). Il enseigne les bases de la syntaxe (Nahw) et du vocabulaire de manière progressive."
  },
  {
    patterns: ["fiqh", "jurisprudence", "halal", "haram", "regles islamiques"],
    answer: "⚖️ Le cours **Introduction au Fiqh** (n°5) couvre les fondements de la jurisprudence islamique : les actes d'adoration, les transactions et l'éthique."
  },
  {
    patterns: ["sira", "prophete", "muhammad", "vie du prophete", "biographie"],
    answer: "🌟 Le cours **Sîra** (n°6) retrace la vie du Prophète Muhammad ﷺ de sa naissance jusqu'à sa mort. Un voyage historique et spirituel essentiel."
  },
  {
    patterns: ["calligraphie", "naskh", "thuluth", "ecriture arabe artistique"],
    answer: "✍️ Le cours **Calligraphie Arabe** (n°7) enseigne les styles Naskh et Thuluth. Vous apprendrez à transformer l'écriture arabe en véritable art islamique."
  },
  {
    patterns: ["devenir musulman", "conversion", "shahada", "nouveau musulman", "piliers islam", "convertir"],
    answer: "☪️ Le cours **Devenir Musulman** (n°8) explique la Chahada, les 5 piliers de l'Islam, la prière et comment vivre en Muslim au quotidien."
  },
  {
    patterns: ["session", "cours live", "en direct", "reserver", "professeur", "enseignant"],
    answer: "📅 Les **sessions live** sont disponibles depuis votre Dashboard (Mon Espace > Sessions). Vous pouvez voir les créneaux disponibles et réserver une place."
  },
  {
    patterns: ["progression", "avancement", "badge", "points", "xp", "lecon terminee"],
    answer: "📊 Votre progression est visible dans le **Dashboard**. Chaque leçon terminée rapporte 10 XP. Des badges sont débloqués à 1, 5, 15 et 30 leçons."
  },
  {
    patterns: ["dictionnaire", "traduire", "traduction", "mot arabe", "signifie"],
    answer: "📖 Le **Dictionnaire** est accessible depuis le menu. Entrez un mot en français ou en anglais pour obtenir sa traduction en arabe avec la prononciation."
  },
  {
    patterns: ["inscription", "s inscrire", "creer un compte", "register", "sign up"],
    answer: "✅ Pour vous inscrire, cliquez sur **S'inscrire** en haut à droite. Choisissez votre rôle (Étudiant ou Enseignant) et remplissez le formulaire. C'est gratuit !"
  },
  {
    patterns: ["connexion", "se connecter", "login", "mot de passe", "acces mon compte"],
    answer: "🔑 Pour vous connecter, cliquez sur **Connexion** dans la barre de navigation et entrez votre email et mot de passe."
  },
  {
    patterns: ["combien", "nombre de cours", "quels cours", "liste des cours", "catalogue"],
    answer: "📋 Safoua Academy propose **8 cours** : Alphabet Arabe, Tajwid, Mémorisation du Coran, Grammaire, Fiqh, Sîra, Calligraphie et Devenir Musulman. Rendez-vous sur la page **Cours** pour tout voir !"
  },
  {
    patterns: ["gratuit", "prix", "payant", "abonnement", "cout"],
    answer: "🎁 Safoua Academy est **entièrement gratuit** ! Tous les cours, le dictionnaire et les sessions sont accessibles sans frais."
  },
  {
    patterns: ["merci", "shukran", "thank", "super", "parfait", "excellent"],
    answer: "Avec plaisir ! 😊 N'hésitez pas à revenir si vous avez d'autres questions. Bon apprentissage sur Safoua Academy !"
  },
  {
    patterns: ["aide", "help", "comment utiliser", "je ne sais pas", "perdu"],
    answer: "💡 Je peux vous aider avec : les cours disponibles, la navigation, les sessions live, votre progression, ou toute question sur l'arabe et l'Islam. Que souhaitez-vous savoir ?"
  },
];

function getTemplateResponse(message) {
  const lower = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const rule of TEMPLATE_RULES) {
    for (const pattern of rule.patterns) {
      const np = pattern.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (lower.includes(np)) return rule.answer;
    }
  }
  return `Je n'ai pas bien compris votre question. Essayez de me demander des informations sur un cours spécifique (Alphabet, Tajwid, Mémorisation...), les sessions live, ou la navigation sur Safoua Academy. 😊`;
}

// In-memory session store (resets on restart — use a DB for persistence)
const conversationHistory = new Map();

// Simple in-memory rate limiter for /api/chat (30 req/min per IP)
const rateLimitMap = new Map();
function chatRateLimit(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
  const times = rateLimitMap.get(ip).filter(t => now - t < windowMs);
  if (times.length >= 30) return res.status(429).json({ error: "Trop de messages. Attendez une minute." });
  times.push(now);
  rateLimitMap.set(ip, times);
  next();
}

app.post("/api/chat", chatRateLimit, async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || typeof message !== 'string' || message.trim() === "") {
      return res.status(400).json({ error: "Veuillez entrer un message." });
    }

    const uid = userId || "default";
    if (!conversationHistory.has(uid)) conversationHistory.set(uid, []);
    const history = conversationHistory.get(uid);

    const SYSTEM_PROMPT = `Tu es l'assistant IA de Safoua Academy, une plateforme e-learning dédiée à l'enseignement du Coran, de l'arabe et des sciences islamiques.
Tu réponds TOUJOURS en français sauf si on te parle en anglais ou arabe.
Tu es bienveillant, pédagogique, concis et précis (max 3-4 phrases par réponse).
Cours disponibles sur la plateforme : Alphabet Arabe & Phonétique, Tajwid (Récitation Sacrée), Mémorisation du Coran, Grammaire Arabe (Médine Tome 1), Fiqh (Introduction), Sîra (Vie du Prophète ﷺ), Calligraphie Arabe, Devenir Musulman.
Fonctionnalités : sessions live avec enseignants (réservables depuis le Dashboard), dictionnaire arabe, suivi de progression, badges XP.
Sois chaleureux, encourage l'apprentissage, et utilise des emojis avec parcimonie.`;

    // Shared messages array format (OpenAI-compatible, used by Groq)
    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10),
      { role: "user", content: message.trim() },
    ];

    // ── 1. Groq (FREE — no credit card, 1000 req/day, very fast) ─
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.1-8b-instant",
            messages: chatMessages,
            max_tokens: 400,
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 20000,
          }
        );
        const reply = response.data?.choices?.[0]?.message?.content;
        if (reply) {
          history.push({ role: "user", content: message });
          history.push({ role: "assistant", content: reply });
          if (history.length > 20) history.splice(0, history.length - 20);
          return res.json({ reply });
        }
      } catch (groqError) {
        console.warn("⚠️ Groq API failed:", groqError.response?.data?.error?.message || groqError.message);
      }
    }

    // ── 2. Fallback: Anthropic (if key set) ──────────────────────
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const response = await axios.post(
          "https://api.anthropic.com/v1/messages",
          {
            model: "claude-haiku-4-5-20251001",
            max_tokens: 400,
            system: SYSTEM_PROMPT,
            messages: history.slice(-10).concat([{ role: "user", content: message.trim() }]),
          },
          {
            headers: {
              "x-api-key": process.env.ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
              "Content-Type": "application/json",
            },
            timeout: 20000,
          }
        );
        const reply = response.data?.content?.[0]?.text;
        if (reply) {
          history.push({ role: "user", content: message });
          history.push({ role: "assistant", content: reply });
          if (history.length > 20) history.splice(0, history.length - 20);
          return res.json({ reply });
        }
      } catch (anthropicError) {
        console.warn("⚠️ Anthropic API failed:", anthropicError.message);
      }
    }

    // ── 3. Last resort: smart template responses ──────────────────
    const templateReply = getTemplateResponse(message);
    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: templateReply });
    res.json({ reply: templateReply });

  } catch (error) {
    console.error("Chat endpoint error:", error);
    const templateReply = getTemplateResponse(req.body?.message || "");
    res.status(200).json({ reply: templateReply });
  }
});

// ── START ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Le serveur tourne sur : http://localhost:${PORT}`);
});