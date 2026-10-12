import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAdmin(req, res, next) {
  const token = req.cookies?.[env.cookieName];
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
    if (payload.role !== 'admin') throw new Error('bad role');
    req.adminId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please sign in again.' });
  }
}

// CSRF defence: browsers cannot send a custom header cross-site without a CORS
// preflight, and our CORS policy only allows our own frontend.
export function requireCustomHeader(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('x-requested-with') !== 'ShailendraTech') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}
