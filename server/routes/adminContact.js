import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../db.js';
import { validateContactStatus } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.get('/', async (_req, res) => {
  const db = getDb();
  const rows = await db.all('SELECT * FROM contactSubmissions ORDER BY submittedAt DESC');
  return res.json({ data: rows });
});

router.put('/:id', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateContactStatus(req.body.status);
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  const db = getDb();
  const existing = await db.get('SELECT * FROM contactSubmissions WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ message: 'Submission not found' });
  await db.run('UPDATE contactSubmissions SET status=? WHERE id=?', [sanitized, req.params.id]);
  const updated = await db.get('SELECT * FROM contactSubmissions WHERE id = ?', [req.params.id]);
  return res.json({ data: updated });
});

router.delete('/:id', mutateLimiter, async (req, res) => {
  const db = getDb();
  const result = await db.run('DELETE FROM contactSubmissions WHERE id = ?', [req.params.id]);
  if (!result.changes) return res.status(404).json({ message: 'Submission not found' });
  return res.status(204).send();
});

export default router;
