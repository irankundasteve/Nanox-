import { Router } from 'express';
import { getDb } from '../db.js';

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
  const db = getDb();
  const rows = await db.all('SELECT * FROM services ORDER BY createdAt DESC');
  return res.json({ data: rows.length ? rows : defaults });
});

export default router;
