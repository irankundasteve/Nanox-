import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import AboutPageContent from '../models/AboutPageContent.js';
import { validateAboutInput } from '../utils/validators.js';

const router = Router();
const mutateLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, standardHeaders: true });

router.put('/', mutateLimiter, async (req, res) => {
  const { errors, sanitized } = validateAboutInput(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  let doc = await AboutPageContent.findOne();
  if (!doc) {
    doc = await AboutPageContent.create(sanitized);
    return res.json({ data: doc });
  }

  doc.headline = sanitized.headline;
  doc.introParagraph = sanitized.introParagraph;
  doc.artisticVision = sanitized.artisticVision;
  doc.experienceCredentials = sanitized.experienceCredentials;
  doc.ctaText = sanitized.ctaText;
  doc.ctaLink = sanitized.ctaLink;
  await doc.save();

  return res.json({ data: doc });
});

export default router;
