import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAdmin(req, res, next) {
  const providedPassword = req.header('x-admin-password');
  const authHeader = req.header('authorization') || '';

  if (providedPassword && providedPassword === env.adminPassword) {
    return next();
  }

  if (env.jwtSecret && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      jwt.verify(token, env.jwtSecret);
      return next();
    } catch {
      return res.status(401).json({ message: 'Invalid admin token' });
    }
  }

  return res.status(401).json({ message: 'Admin authentication required' });
}
