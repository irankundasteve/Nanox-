import { Router } from 'express';
import Service from '../models/Service.js';

const router = Router();

const defaults = [
  {
    title: 'Portrait Sessions',
    description: 'Individual, couple, and family portrait sessions with guided direction and natural-light styling.',
    details: 'Perfect for personal branding, family keepsakes, and creative portraits tailored to your mood and style.',
    pricing: 'Starting at $180 • 60–90 minutes',
  },
  {
    title: 'Event Photography',
    description: 'Coverage for celebrations, gatherings, and milestone events with candid storytelling and edited highlights.',
    details: 'From intimate ceremonies to larger events, coverage is designed around your timeline and key moments.',
    pricing: 'Custom quote • Half-day and full-day options',
  },
  {
    title: 'Artistic Editorial Work',
    description: 'Creative concept shoots with mood, styling, and composition crafted for visual impact and storytelling.',
    details: 'Collaborative pre-production with references, lighting direction, and a final curated image set.',
    pricing: 'Starting at $250 • Concept + production support',
  },
];

router.get('/', async (_req, res) => {
  const services = await Service.find().sort({ createdAt: -1 }).lean();
  return res.json({ data: services.length ? services : defaults });
});

export default router;
