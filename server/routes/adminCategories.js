import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Category from '../models/Category.js';
import PortfolioImage from '../models/PortfolioImage.js';
import { validateCategoryName } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.get('/', async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  return res.json({ data: categories });
});

router.post('/', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateCategoryName(req.body.name);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const exists = await Category.findOne({ name: sanitized }).lean();
  if (exists) return res.status(409).json({ message: 'Category already exists' });

  const created = await Category.create({ name: sanitized });
  return res.status(201).json({ data: created });
});

router.put('/:id', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateCategoryName(req.body.name);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const inUse = await PortfolioImage.countDocuments({ category: category.name });
  if (inUse > 0 && category.name !== sanitized) {
    return res.status(409).json({ message: 'Cannot rename category while images are assigned' });
  }

  category.name = sanitized;
  await category.save();
  return res.json({ data: category });
});

router.delete('/:id', mutateLimiter, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const inUse = await PortfolioImage.countDocuments({ category: category.name });
  if (inUse > 0) {
    return res.status(409).json({ message: 'Cannot delete category with assigned images' });
  }

  await category.deleteOne();
  return res.status(204).send();
});

export default router;
