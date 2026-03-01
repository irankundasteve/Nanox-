import { randomUUID } from 'crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../db.js';
import { validateAboutInput } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, standardHeaders: true });

router.put('/', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateAboutInput(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  const db = getDb();
  const existing = await db.get('SELECT id FROM aboutPageContent LIMIT 1');
  const now = new Date().toISOString();

  if (!existing) {
    const id = randomUUID();
    await db.run(
      `INSERT INTO aboutPageContent (id,headline,introParagraph,artisticVision,experienceCredentials,ctaText,ctaLink,updatedAt)
       VALUES (?,?,?,?,?,?,?,?)`,
      [id, sanitized.headline, sanitized.introParagraph, sanitized.artisticVision, sanitized.experienceCredentials, sanitized.ctaText, sanitized.ctaLink, now]
    );
    const created = await db.get('SELECT * FROM aboutPageContent WHERE id = ?', [id]);
    return res.json({ data: created });
  }

  await db.run(
    `UPDATE aboutPageContent SET headline=?, introParagraph=?, artisticVision=?, experienceCredentials=?, ctaText=?, ctaLink=?, updatedAt=? WHERE id=?`,
    [sanitized.headline, sanitized.introParagraph, sanitized.artisticVision, sanitized.experienceCredentials, sanitized.ctaText, sanitized.ctaLink, now, existing.id]
  );
  const updated = await db.get('SELECT * FROM aboutPageContent WHERE id = ?', [existing.id]);
  return res.json({ data: updated });
});

export default router;
