import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import { HfInference } from "@huggingface/inference";
import axios from "axios";
import pronunciationsRouter from './routes/pronunciations.js';

dotenv.config();

const app = express();
const hf = new HfInference(process.env.HF_TOKEN);

app.use(cors());
app.use(express.json());

console.log("⏳ Tentative de connexion à MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connexion à MongoDB réussie !"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err.message));

// ── PRONUNCIATIONS ──────────────────────────────────────────────
app.use('/api/pronunciations', pronunciationsRouter);

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

// ── LOGIN ────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});

// ── REGISTER ─────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Cet email est déjà utilisé." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "student",
    });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès ! 🛡️" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// ── UPDATE PROGRESS ──────────────────────────────────────────────
app.post('/api/update-progress', async (req, res) => {
  const { email, lessonTitle } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { completedLessons: lessonTitle }, $inc: { points: 10 } },
      { new: true }
    );
    res.json({ message: "Succès", points: user.points });
  } catch (err) {
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
    res.status(500).json({ error: "Erreur lors de la récupération des sessions." });
  }
});

// POST create session (teacher)
app.post('/api/sessions', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de la session." });
  }
});

// PUT update session
app.put('/api/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ error: "Session introuvable." });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification de la session." });
  }
});

// DELETE session
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: "Session supprimée." });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

// POST book a spot
app.post('/api/sessions/:id/book', async (req, res) => {
  try {
    const { username } = req.body;
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
    res.status(500).json({ error: "Erreur lors de la réservation." });
  }
});

// POST cancel booking
app.post('/api/sessions/:id/cancel', async (req, res) => {
  try {
    const { username } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session introuvable." });
    session.enrolledStudents = session.enrolledStudents.filter(u => u !== username);
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'annulation." });
  }
});

// ── DICTIONARY / TRANSLATION ─────────────────────────────────────
app.get('/api/dictionary/translate', async (req, res) => {
  try {
    const { word, language } = req.query;
    if (!word || !language) {
      return res.status(400).json({ success: false, error: "Veuillez fournir un mot et une langue (english ou french)" });
    }
    const lang = language.toLowerCase();
    if (!['english', 'french'].includes(lang)) {
      return res.status(400).json({ success: false, error: "Langue non supportée. Utilisez 'english' ou 'french'" });
    }
    const searchWord = word.trim();
    const sourceLang = lang === 'english' ? 'en' : 'fr';
    try {
      const translationUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(searchWord)}&langpair=${sourceLang}|ar`;
      const translationResponse = await axios.get(translationUrl, { timeout: 10000 });
      if (translationResponse.data.responseStatus === 200 && translationResponse.data.responseData.translatedText) {
        const arabicTranslation = translationResponse.data.responseData.translatedText;
        return res.json({
          success: true,
          word: searchWord,
          language: lang,
          arabic: arabicTranslation,
          pronunciation: `Prononciation de: ${arabicTranslation}`,
          meaning: `Traduction du mot "${searchWord}" (${lang === 'english' ? 'Anglais' : 'Français'}) vers l'Arabe`,
          source: "MyMemory API"
        });
      } else {
        throw new Error("Réponse invalide");
      }
    } catch (apiError) {
      return res.json({ success: false, message: `Impossible de traduire "${searchWord}" en ce moment.` });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: "Erreur serveur lors de la traduction" });
  }
});

// ── CHATBOT ──────────────────────────────────────────────────────
const templates = {
  greeting: {
    patterns: ["bonjour", "hello", "salut", "hi", "hey", "coucou", "ça va", "comment allez"],
    responses: [
      "Bonjour! 👋 Comment puis-je t'aider avec Safoua Academy?",
      "Coucou! Je suis ton assistant IA. Qu'est-ce que tu veux savoir?",
      "Salut! Je suis ravi de te rencontrer. Comment je peux t'aider?"
    ]
  },
  help: {
    patterns: ["aide", "aider", "help", "support", "problème", "question", "peux-tu"],
    responses: [
      "Bien sûr! Je suis là pour t'aider. 💪 Dis-moi ce que tu cherches.",
      "Absolument! Je peux t'assister avec tes cours, tes questions, ou tes progressions. Qu'est-ce qui t'intéresse?",
      "Je serais ravi de t'aider! Explique-moi ce que tu cherches."
    ]
  },
  courses: {
    patterns: ["cours", "lesson", "matière", "sujet", "enseignement", "formation", "apprendre"],
    responses: [
      "📚 Safoua Academy propose des cours dans plusieurs domaines. Quel sujet t'intéresse particulièrement?",
      "Nous avons des cours variés! Tu peux me dire quel domaine t'intéresse?",
      "Quel type de cours cherches-tu? Je peux te guider!"
    ]
  },
  progress: {
    patterns: ["progression", "points", "avancement", "leçon", "complété"],
    responses: [
      "📊 Je peux vérifier ta progression! Quel est ton email Safoua?",
      "Super question! Je peux t'aider à suivre ta progression. Donne-moi plus de détails!",
      "Bravo pour ton engagement! Qu'est-ce que tu veux savoir sur tes progrès?"
    ]
  },
  tajwid: {
    patterns: ["tajwid", "tajwîd", "récitation", "coran", "quran", "sourate", "verset"],
    responses: [
      "📖 Le Tajwid est l'art de réciter le Coran correctement. Veux-tu en savoir plus sur nos cours de Tajwid?",
      "Le Coran mérite une récitation parfaite. Nos cours de Tajwid te guideront pas à pas!",
      "As-tu commencé le cours de Tajwid? Je peux t'aider à trouver des ressources."
    ]
  },
  arabic: {
    patterns: ["arabe", "arabic", "alphabet", "grammaire", "calligraphie", "lettre"],
    responses: [
      "🔤 L'arabe est une belle langue! Nous proposons des cours de l'alphabet aux niveaux avancés.",
      "Veux-tu apprendre l'alphabet arabe ou améliorer ta grammaire? Dis-moi où tu en es!",
      "La langue arabe ouvre les portes du Coran. Par quel cours veux-tu commencer?"
    ]
  },
  islam: {
    patterns: ["islam", "musulman", "fiqh", "sira", "prophète", "prière", "salat"],
    responses: [
      "☪️ Safoua propose des cours de Sciences Islamiques: Fiqh, Sîra, et plus encore!",
      "Excellent! La connaissance islamique est une lumière. Quel domaine t'intéresse: Fiqh, Sîra, ou autre?",
      "Nos cours de Sciences Islamiques sont conçus par des experts. Veux-tu en savoir plus?"
    ]
  },
  session: {
    patterns: ["session", "classe", "live", "direct", "professeur", "enseignant", "réserver"],
    responses: [
      "📅 Tu peux réserver des sessions live avec nos enseignants depuis ton tableau de bord!",
      "Les sessions en direct sont disponibles dans 'Mon Espace'. Connecte-toi pour voir les disponibilités!",
      "Nos enseignants proposent des sessions personnalisées. Va dans Dashboard > Sessions pour réserver."
    ]
  },
  default: {
    patterns: [],
    responses: [
      "C'est une très bonne question! 🤔 Peux-tu me donner plus de détails?",
      "Intéressant! Dis-m'en plus pour que je puisse mieux t'aider.",
      "Je comprends! Qu'est-ce que tu aimerais savoir exactement?",
      "Bonne question! Explique-moi un peu plus ce que tu cherches.",
      "D'accord! Pour mieux t'aider, peux-tu préciser ta question?"
    ]
  }
};

function getTemplateResponse(message) {
  const lowerMessage = message.toLowerCase().trim();
  for (const [category, data] of Object.entries(templates)) {
    if (category === "default") continue;
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  const defaultResponses = templates.default.responses;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

const conversationHistory = new Map();

app.post("/api/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Veuillez entrer un message." });
    }
    console.log("📨 Message reçu:", message);
    const uid = userId || "default";
    if (!conversationHistory.has(uid)) conversationHistory.set(uid, []);
    const history = conversationHistory.get(uid);

    try {
      console.log("🔄 Appel de l'API Serverless Inference...");
      const response = await axios.post(
        "https://theb4rt-phi2text.hf.space/api/v1/predict",
        { text: message },
        { timeout: 60000 }
      );
      const reply = response.data?.text || response.data?.output || response.data;
      if (reply && reply.length > 0) {
        const textReply = typeof reply === 'string' ? reply : reply[0];
        history.push({ role: "user", content: message });
        history.push({ role: "assistant", content: textReply });
        return res.json({ reply: textReply });
      }
    } catch (publicError) {
      console.warn("⚠️ Public API failed:", publicError.message);
    }

    try {
      console.log("🔄 Tentative avec l'API privée...");
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/microsoft/phi-2`,
        { inputs: message, wait_for_model: false, max_length: 300, temperature: 0.9, top_p: 0.95 },
        {
          headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, "Content-Type": "application/json" },
          timeout: 60000
        }
      );
      let reply = response.data[0]?.generated_text || response.data?.generated_text || response.data;
      if (reply) {
        if (typeof reply === 'object' && reply.generated_text) reply = reply.generated_text;
        reply = String(reply).replace(message, "").trim();
        if (reply.length > 0) {
          history.push({ role: "user", content: message });
          history.push({ role: "assistant", content: reply });
          return res.json({ reply });
        }
      }
    } catch (privateError) {
      console.warn("⚠️ Private API failed:", privateError.message);
    }

    const templateReply = getTemplateResponse(message);
    res.json({ reply: templateReply });

  } catch (error) {
    const templateReply = getTemplateResponse(req.body?.message || "");
    res.status(200).json({ reply: templateReply });
  }
});

// ── START ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Le serveur tourne sur : http://localhost:${PORT}`);
});