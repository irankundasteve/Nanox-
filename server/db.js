import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { env } from './config/env.js';

let db;

export async function initDb() {
  db = await open({
    filename: env.sqlitePath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS portfolioImages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      isFeatured INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS aboutPageContent (
      id TEXT PRIMARY KEY,
      headline TEXT NOT NULL,
      introParagraph TEXT NOT NULL,
      artisticVision TEXT NOT NULL,
      experienceCredentials TEXT NOT NULL,
      ctaText TEXT NOT NULL,
      ctaLink TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      details TEXT,
      pricing TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contactSubmissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      submittedAt TEXT NOT NULL
    );
  `);

  return db;
}

export function getDb() {
  if (!db) throw new Error('Database not initialized');
  return db;
}
