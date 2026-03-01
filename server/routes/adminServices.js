import { randomUUID } from 'crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../db.js';
import { validateServiceInput } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.post('/', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateServiceInput(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  const db = getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  await db.run(
    'INSERT INTO services (id,title,description,details,pricing,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)',
    [id, sanitized.title, sanitized.description, sanitized.details, sanitized.pricing, now, now]
  );
  const created = await db.get('SELECT * FROM services WHERE id = ?', [id]);
  return res.status(201).json({ data: created });
});

router.put('/:id', mutateLimiter, async (req, res) => {
  const db = getDb();
  const existing = await db.get('SELECT * FROM services WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ message: 'Service not found' });

  const payload = {
    title: req.body.title ?? existing.title,
    description: req.body.description ?? existing.description,
    details: req.body.details ?? existing.details,
    pricing: req.body.pricing ?? existing.pricing,
  };
  const { errors, sanitized } = validateServiceInput(payload);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  await db.run(
    'UPDATE services SET title=?,description=?,details=?,pricing=?,updatedAt=? WHERE id=?',
    [sanitized.title, sanitized.description, sanitized.details, sanitized.pricing, new Date().toISOString(), req.params.id]
  );
  const updated = await db.get('SELECT * FROM services WHERE id = ?', [req.params.id]);
  return res.json({ data: updated });
});

router.delete('/:id', mutateLimiter, async (req, res) => {
  const db = getDb();
  const result = await db.run('DELETE FROM services WHERE id = ?', [req.params.id]);
  if (!result.changes) return res.status(404).json({ message: 'Service not found' });
  return res.status(204).send();
});

export default router;
