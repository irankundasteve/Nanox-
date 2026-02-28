import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ContactSubmission from '../models/ContactSubmission.js';
import { validateContactStatus } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.get('/', async (_req, res) => {
  const submissions = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
  return res.json({ data: submissions });
});

router.put('/:id', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateContactStatus(req.body.status);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const updated = await ContactSubmission.findByIdAndUpdate(
    req.params.id,
    { status: sanitized },
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: 'Submission not found' });
  return res.json({ data: updated });
});

router.delete('/:id', mutateLimiter, async (req, res) => {
  const deleted = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Submission not found' });
  return res.status(204).send();
});

export default router;
