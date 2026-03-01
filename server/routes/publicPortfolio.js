import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const db = getDb();
  const category = req.query.category ? String(req.query.category).trim() : null;
  const rows = category
    ? await db.all('SELECT * FROM portfolioImages WHERE category = ? ORDER BY createdAt DESC', [category])
    : await db.all('SELECT * FROM portfolioImages ORDER BY createdAt DESC');
  return res.json({ data: rows.map((r) => ({ ...r, isFeatured: Boolean(r.isFeatured) })) });
});

router.get('/:id', async (req, res) => {
  const db = getDb();
  const row = await db.get('SELECT * FROM portfolioImages WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ message: 'Portfolio image not found' });
  return res.json({ data: { ...row, isFeatured: Boolean(row.isFeatured) } });
});

export default router;
