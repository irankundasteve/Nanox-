import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { initDb } from './db.js';
import { requireAdmin } from './middleware/adminAuth.js';
import adminAboutRoutes from './routes/adminAbout.js';
import adminCategoriesRoutes from './routes/adminCategories.js';
import adminContactRoutes from './routes/adminContact.js';
import adminPortfolioRoutes from './routes/adminPortfolio.js';
import adminServicesRoutes from './routes/adminServices.js';
import publicAboutRoutes from './routes/publicAbout.js';
import publicContactRoutes from './routes/publicContact.js';
import publicPortfolioRoutes from './routes/publicPortfolio.js';
import publicPrivacyPolicyRoutes from './routes/publicPrivacyPolicy.js';
import publicServicesRoutes from './routes/publicServices.js';
import publicTermsOfServiceRoutes from './routes/publicTermsOfService.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/portfolio', publicPortfolioRoutes);
app.use('/api/about', publicAboutRoutes);
app.use('/api/services', publicServicesRoutes);
app.use('/api/contact', publicContactRoutes);
app.use('/api/privacy-policy', publicPrivacyPolicyRoutes);
app.use('/api/terms-of-service', publicTermsOfServiceRoutes);
app.use('/api/admin/portfolio', requireAdmin, adminPortfolioRoutes);
app.use('/api/admin/categories', requireAdmin, adminCategoriesRoutes);
app.use('/api/admin/about', requireAdmin, adminAboutRoutes);
app.use('/api/admin/services', requireAdmin, adminServicesRoutes);
app.use('/api/admin/contact', requireAdmin, adminContactRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
});

async function start() {
  await initDb();
  app.listen(env.port, () => {
    console.log(`Nanox API listening on port ${env.port}`);
  });
}

start();
