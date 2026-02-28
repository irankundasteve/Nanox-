import { Router } from 'express';
import PortfolioImage from '../models/PortfolioImage.js';

const router = Router();

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = String(req.query.category).trim();
  }

  const images = await PortfolioImage.find(filter).sort({ createdAt: -1 }).lean();
  return res.json({ data: images });
});

router.get('/:id', async (req, res) => {
  const image = await PortfolioImage.findById(req.params.id).lean();
  if (!image) return res.status(404).json({ message: 'Portfolio image not found' });
  return res.json({ data: image });
});

export default router;
