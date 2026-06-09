import jwt from 'jsonwebtoken';

/**
 * Middleware: verifies the JWT token sent in the Authorization header.
 * Usage: app.get('/api/protected', authMiddleware, handler)
 *
 * The token must be sent as:
 *   Authorization: Bearer <token>
 *
 * On success, attaches req.user = { id, username, email, role }
 * On failure, returns 401 Unauthorized.
 */
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Header must be: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expirée. Veuillez vous reconnecter.' });
    }
    return res.status(401).json({ error: 'Token invalide.' });
  }
}