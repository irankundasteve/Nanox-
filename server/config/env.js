import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || '',
  adminPassword: process.env.ADMIN_PASSWORD || 'change-me',
  jwtSecret: process.env.JWT_SECRET || '',
};
