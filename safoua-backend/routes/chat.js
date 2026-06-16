/**
 * routes/chat.js — Safoua Academy
 * ─────────────────────────────────
 * POST /api/chat — protected (requires JWT)
 *
 * FIX 3: History now stored in MongoDB (ChatHistory collection)
 *        so conversations survive server restarts and redeploys.
 *
 * Rate limiting now uses express-rate-limit (npm) instead of
 * the custom in-memory Map, so it also survives restarts.
 *
 * AI fallback chain: Groq → Anthropic → template keywords
 */

import express      from 'express';
import axios        from 'axios';
import rateLimit    from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import ChatHistory  from '../models/ChatHistory.js';

const router = express.Router();

// ── Rate limiter — 30 messages / minute per IP ──────────────────────
const chatRateLimit = rateLimit({
  windowMs:         60 * 1000,
  max:              30,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: 'Trop de messages. Attendez une minute.' },
});

// ── Input validation ────────────────────────────────────────────────
const validateMessage = [
  body('message')
    .trim()
    .notEmpty().withMessage('Veuillez entrer un message.')
    .isLength({ max: 1000 }).withMessage('Message trop long (max 1000 caractères).')
    .escape(),
];

// ── Template fallback responses ─────────────────────────────────────
const TEMPLATE_RULES = [
  { patterns: ['bonjour','salam','salut','hello','coucou','bonsoir','assalam'], answer: "Bonjour et bienvenue sur Safoua Academy ! 👋 Je suis votre assistant IA. Posez-moi n'importe quelle question sur nos cours, l'arabe ou les sciences islamiques." },
  { patterns: ['alphabet','lettres arabe','apprendre l\'arabe','arabe debutant','commencer arabe'], answer: "📘 Pour apprendre l'alphabet arabe, rendez-vous sur le cours **Alphabet Arabe & Phonétique** (cours n°1). Il couvre les 28 lettres, leur prononciation et leur écriture. Parfait pour les débutants !" },
  { patterns: ['tajwid','recitation','reciter','regles coran'], answer: "🎵 Le **Tajwid** est la science de la belle récitation du Coran. Notre cours Tajwid (n°2) couvre toutes les règles : la prolongation (Madd), le son nasal (Ghunna), l'assimilation (Idgham) et bien plus." },
  { patterns: ['memoris','hifz','sourate','apprendre par coeur'], answer: "📖 Notre cours de **Mémorisation** (n°3) couvre les 114 sourates avec audio de 5 récitateurs célèbres." },
  { patterns: ['grammaire','nahw','medine','syntaxe arabe'], answer: "📚 Le cours **Grammaire Arabe** (n°4) suit la méthode de l'Université de Médine (Tome 1)." },
  { patterns: ['fiqh','jurisprudence','halal','haram','regles islamiques'], answer: "⚖️ Le cours **Introduction au Fiqh** (n°5) couvre les fondements de la jurisprudence islamique." },
  { patterns: ['sira','prophete','muhammad','vie du prophete','biographie'], answer: "🌟 Le cours **Sîra** (n°6) retrace la vie du Prophète Muhammad ﷺ." },
  { patterns: ['calligraphie','naskh','thuluth','ecriture arabe artistique'], answer: "✍️ Le cours **Calligraphie Arabe** (n°7) enseigne les styles Naskh et Thuluth." },
  { patterns: ['devenir musulman','conversion','shahada','nouveau musulman','convertir'], answer: "☪️ Le cours **Devenir Musulman** (n°8) explique la Chahada et les 5 piliers de l'Islam." },
  { patterns: ['session','cours live','en direct','reserver','professeur'], answer: "📅 Les **sessions live** sont disponibles depuis votre Dashboard (Mon Espace > Sessions)." },
  { patterns: ['progression','avancement','badge','points','xp'], answer: "📊 Votre progression est visible dans le **Dashboard**. Chaque leçon terminée rapporte 10 XP." },
  { patterns: ['dictionnaire','traduire','traduction','mot arabe'], answer: "📖 Le **Dictionnaire** est accessible depuis le menu. Entrez un mot en français ou en anglais." },
  { patterns: ['inscription','s inscrire','creer un compte','register'], answer: "✅ Pour vous inscrire, cliquez sur **S'inscrire** en haut à droite. C'est gratuit !" },
  { patterns: ['connexion','se connecter','login','mot de passe'], answer: "🔑 Pour vous connecter, cliquez sur **Connexion** dans la barre de navigation." },
  { patterns: ['merci','shukran','thank','super','parfait','excellent'], answer: "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions." },
  { patterns: ['aide','help','comment utiliser'], answer: "💡 Je peux vous aider avec : les cours disponibles, la navigation, les sessions live, votre progression." },
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

const MAX_HISTORY = 20; // messages kept per user (user+assistant pairs = 10 turns)

// ── POST /api/chat ──────────────────────────────────────────────────
router.post('/', authMiddleware, chatRateLimit, validateMessage, async (req, res) => {
  // Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const message = req.body.message.trim();
    const userId  = req.user.id;

    // ── Load history from MongoDB ────────────────────────────────
    let chatDoc = await ChatHistory.findOne({ userId });
    if (!chatDoc) {
      chatDoc = new ChatHistory({ userId, messages: [] });
    }
    const history = chatDoc.messages;

    const SYSTEM_PROMPT = `Tu es l'assistant IA de Safoua Academy, une plateforme e-learning dédiée à l'enseignement du Coran, de l'arabe et des sciences islamiques.
Tu réponds TOUJOURS en français sauf si on te parle en anglais ou arabe.
Tu es bienveillant, pédagogique, concis et précis (max 3-4 phrases par réponse).
Cours disponibles : Alphabet Arabe & Phonétique, Tajwid, Mémorisation du Coran, Grammaire Arabe, Fiqh, Sîra, Calligraphie Arabe, Devenir Musulman, Arabe Moderne Standard.
Fonctionnalités : sessions live, dictionnaire arabe, suivi de progression, badges XP.
L'utilisateur connecté est : ${req.user.username} (${req.user.role}).`;

const recentHistory = history.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content }));    const chatMessages  = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentHistory,
      { role: 'user', content: message },
    ];

    // Helper: persist history to MongoDB
    const saveHistory = async (userMsg, assistantMsg) => {
      history.push({ role: 'user',      content: userMsg });
      history.push({ role: 'assistant', content: assistantMsg });
      // Keep only the last MAX_HISTORY messages in DB
      if (history.length > MAX_HISTORY) {
        history.splice(0, history.length - MAX_HISTORY);
      }
      chatDoc.messages = history;
      await chatDoc.save();
    };

    // ── Layer 1: Groq ─────────────────────────────────────────────
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          { model: 'llama-3.1-8b-instant', messages: chatMessages, max_tokens: 400, temperature: 0.7 },
          { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 20_000 }
        );
        const reply = response.data?.choices?.[0]?.message?.content;
        if (reply) { await saveHistory(message, reply); return res.json({ reply }); }
      } catch (err) {
        console.warn('⚠️ Groq API failed:', err.response?.data?.error?.message || err.message);
      }
    }

    // ── Layer 2: Anthropic ────────────────────────────────────────
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model:      'claude-haiku-4-5-20251001',
            max_tokens: 400,
            system:     SYSTEM_PROMPT,
            messages:   recentHistory.concat([{ role: 'user', content: message }]),
          },
          {
            headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
            timeout: 20_000,
          }
        );
        const reply = response.data?.content?.[0]?.text;
        if (reply) { await saveHistory(message, reply); return res.json({ reply }); }
      } catch (err) {
        console.warn('⚠️ Anthropic API failed:', err.message);
      }
    }

    // ── Layer 3: Template fallback ────────────────────────────────
    const templateReply = getTemplateResponse(message);
    await saveHistory(message, templateReply);
    res.json({ reply: templateReply });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(200).json({ reply: getTemplateResponse(req.body?.message || '') });
  }
});

export default router;
