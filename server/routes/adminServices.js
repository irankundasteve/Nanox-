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
