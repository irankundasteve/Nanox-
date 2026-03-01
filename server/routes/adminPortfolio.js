import { randomUUID } from 'crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../db.js';
import { validatePortfolioInput } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.post('/', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validatePortfolioInput(req.body);
  const db = getDb();
  const category = await db.get('SELECT id FROM categories WHERE name = ?', [sanitized.category]);
  if (!category) errors.category = 'category must match an existing category';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const now = new Date().toISOString();
  const id = randomUUID();
  await db.run(
    `INSERT INTO portfolioImages (id,title,description,category,imageUrl,isFeatured,createdAt,updatedAt)
     VALUES (?,?,?,?,?,?,?,?)`,
    [id, sanitized.title, sanitized.description, sanitized.category, sanitized.imageUrl, sanitized.isFeatured ? 1 : 0, now, now]
  );
  const created = await db.get('SELECT * FROM portfolioImages WHERE id = ?', [id]);
  return res.status(201).json({ data: { ...created, isFeatured: Boolean(created.isFeatured) } });
});

router.put('/:id', mutateLimiter, async (req, res) => {
  const db = getDb();
  const existing = await db.get('SELECT * FROM portfolioImages WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ message: 'Portfolio image not found' });

  const payload = {
    title: req.body.title ?? existing.title,
    description: req.body.description ?? existing.description,
    category: req.body.category ?? existing.category,
    imageUrl: req.body.imageUrl ?? existing.imageUrl,
    isFeatured: req.body.isFeatured ?? Boolean(existing.isFeatured),
  };
  const { errors, sanitized } = validatePortfolioInput(payload);
  const category = await db.get('SELECT id FROM categories WHERE name = ?', [sanitized.category]);
  if (!category) errors.category = 'category must match an existing category';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const now = new Date().toISOString();
  await db.run(
    `UPDATE portfolioImages SET title=?,description=?,category=?,imageUrl=?,isFeatured=?,updatedAt=? WHERE id=?`,
    [sanitized.title, sanitized.description, sanitized.category, sanitized.imageUrl, sanitized.isFeatured ? 1 : 0, now, req.params.id]
  );
  const updated = await db.get('SELECT * FROM portfolioImages WHERE id = ?', [req.params.id]);
  return res.json({ data: { ...updated, isFeatured: Boolean(updated.isFeatured) } });
});

router.delete('/:id', mutateLimiter, async (req, res) => {
  const db = getDb();
  const result = await db.run('DELETE FROM portfolioImages WHERE id = ?', [req.params.id]);
  if (!result.changes) return res.status(404).json({ message: 'Portfolio image not found' });
  return res.status(204).send();
});

export default router;
