import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import PortfolioImage from '../models/PortfolioImage.js';
import { validatePortfolioInput } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.post('/', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = await validatePortfolioInput(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const created = await PortfolioImage.create(sanitized);
  return res.status(201).json({ data: created });
});

router.put('/:id', mutateLimiter, async (req, res) => {
  const existing = await PortfolioImage.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Portfolio image not found' });

  const payload = {
    title: req.body.title ?? existing.title,
    description: req.body.description ?? existing.description,
    category: req.body.category ?? existing.category,
    imageUrl: req.body.imageUrl ?? existing.imageUrl,
    isFeatured: req.body.isFeatured ?? existing.isFeatured,
  };

  const { errors, sanitized } = await validatePortfolioInput(payload);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  existing.title = sanitized.title;
  existing.description = sanitized.description;
  existing.category = sanitized.category;
  existing.imageUrl = sanitized.imageUrl;
  existing.isFeatured = sanitized.isFeatured;
  await existing.save();

  return res.json({ data: existing });
});

router.delete('/:id', mutateLimiter, async (req, res) => {
  const deleted = await PortfolioImage.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Portfolio image not found' });
  return res.status(204).send();
});

export default router;
