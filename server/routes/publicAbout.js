import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

const defaultContent = {
  headline: 'Capturing Moments, Creating Stories',
  introParagraph:
    'Nanox is the creative portfolio of Steve Irankunda, an artistic photographer passionate about capturing moments that speak to the heart. Every image reflects emotion, light, and connection, blending artistry with personal storytelling.',
  artisticVision:
    'Photography is more than just a picture—it’s a feeling frozen in time. My work focuses on authentic emotion, natural light, and timeless compositions. I aim to create images that evoke memories, intimacy, and beauty in every frame.',
  experienceCredentials:
    'With over 5 years of experience in portrait, event, and artistic photography, my work has been featured across exhibitions in North America and beyond. I continuously explore new techniques to capture the essence of every subject.',
  ctaText: 'Book a Shoot',
  ctaLink: '/contact',
};

router.get('/', async (_req, res) => {
  const db = getDb();
  const row = await db.get('SELECT * FROM aboutPageContent ORDER BY updatedAt DESC LIMIT 1');
  return res.json({ data: row || defaultContent });
});

export default router;
