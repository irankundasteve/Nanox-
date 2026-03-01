import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ContactSubmission from '../models/ContactSubmission.js';
import { validateContactSubmissionInput } from '../utils/validators.js';

const router = Router();
const submitLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true });

router.post('/', submitLimiter, async (req, res) => {
  const { errors, sanitized } = validateContactSubmissionInput(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  await ContactSubmission.create(sanitized);
  return res.status(201).json({ message: 'Submission received' });
});

export default router;
