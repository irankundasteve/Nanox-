import { randomUUID } from 'crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../db.js';
import { validateContactSubmissionInput } from '../utils/validators.js';

const router = Router();
const submitLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.post('/', submitLimiter, async (req, res) => {
  const { errors, sanitized } = validateContactSubmissionInput(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', errors });

  const db = getDb();
  await db.run(
    'INSERT INTO contactSubmissions (id,name,email,phone,message,status,submittedAt) VALUES (?,?,?,?,?,?,?)',
    [randomUUID(), sanitized.name, sanitized.email, sanitized.phone, sanitized.message, 'new', new Date().toISOString()]
  );
  return res.status(201).json({ message: 'Submission received' });
});

export default router;
