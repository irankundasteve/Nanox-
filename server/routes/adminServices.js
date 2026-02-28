import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Service from '../models/Service.js';
import { validateServiceInput } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.post('/', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateServiceInput(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  const created = await Service.create(sanitized);
  return res.status(201).json({ data: created });
});

router.put('/:id', mutateLimiter, async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });

  const payload = {
    title: req.body.title ?? service.title,
    description: req.body.description ?? service.description,
    details: req.body.details ?? service.details,
    pricing: req.body.pricing ?? service.pricing,
  };

  const { errors, sanitized } = validateServiceInput(payload);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  service.title = sanitized.title;
  service.description = sanitized.description;
  service.details = sanitized.details;
  service.pricing = sanitized.pricing;
  await service.save();

  return res.json({ data: service });
});

router.delete('/:id', mutateLimiter, async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Service not found' });
  return res.status(204).send();
});

export default router;
