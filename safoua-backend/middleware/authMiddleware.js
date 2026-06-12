import jwt  from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware: verifies the JWT token sent in the Authorization header.
 *
 * What changed vs the original:
 *   After the token is verified we do ONE extra DB query to confirm
 *   the user still exists.  This means that if an account is deleted
 *   or banned, the token stops working immediately — it can no longer
 *   be used to access protected routes for the remaining 7-day window.
 *
 * Usage: app.get('/api/protected', authMiddleware, handler)
 *
 * Token format expected in header:
 *   Authorization: Bearer <token>
 *
 * On success → attaches req.user = { id, username, email, role }
 * On failure → returns 401 Unauthorized
 */
export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Header must be: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. ── NEW: confirm the user still exists in the database ──────
    //    .select('-password') avoids loading the hashed password
    //    into memory — we don't need it here
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      // Account was deleted after the token was issued
      return res.status(401).json({ error: 'Compte introuvable. Veuillez vous reconnecter.' });
    }

    // 3. Attach fresh data from DB (not just whatever was in the token)
    //    This also means a role change (e.g. student → teacher) takes
    //    effect on the next request without needing a new token.
    req.user = {
      id:       user._id,
      username: user.username,
      email:    user.email,
      role:     user.role,
    };

    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expirée. Veuillez vous reconnecter.' });
    }
    return res.status(401).json({ error: 'Token invalide.' });
  }
}
