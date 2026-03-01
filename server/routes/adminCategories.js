import { randomUUID } from 'crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../db.js';
import { validateCategoryName } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.get('/', async (_req, res) => {
  const db = getDb();
  const rows = await db.all('SELECT * FROM categories ORDER BY name ASC');
  return res.json({ data: rows });
});

router.post('/', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateCategoryName(req.body.name);
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  const db = getDb();
  const exists = await db.get('SELECT id FROM categories WHERE name = ?', [sanitized]);
  if (exists) return res.status(409).json({ message: 'Category already exists' });
  const now = new Date().toISOString();
  const id = randomUUID();
  await db.run('INSERT INTO categories (id,name,createdAt,updatedAt) VALUES (?,?,?,?)', [id, sanitized, now, now]);
  const created = await db.get('SELECT * FROM categories WHERE id = ?', [id]);
  return res.status(201).json({ data: created });
});

router.put('/:id', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateCategoryName(req.body.name);
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  const db = getDb();
  const category = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const inUse = await db.get('SELECT COUNT(*) as count FROM portfolioImages WHERE category = ?', [category.name]);
  if (inUse.count > 0 && category.name !== sanitized) {
    return res.status(409).json({ message: 'Cannot rename category while images are assigned' });
  }

  await db.run('UPDATE categories SET name=?, updatedAt=? WHERE id=?', [sanitized, new Date().toISOString(), req.params.id]);
  const updated = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  return res.json({ data: updated });
});

router.delete('/:id', mutateLimiter, async (req, res) => {
  const db = getDb();
  const category = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const inUse = await db.get('SELECT COUNT(*) as count FROM portfolioImages WHERE category = ?', [category.name]);
  if (inUse.count > 0) {
    return res.status(409).json({ message: 'Cannot delete category with assigned images' });
  }

  await db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
  return res.status(204).send();
});

export default router;
