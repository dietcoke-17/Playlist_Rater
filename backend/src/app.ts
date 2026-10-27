/**
 * Express application setup.
 * Registers CORS, JSON parsing, all v1 routes, and a global error handler.
 */

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { spotifyRouter } from './routes/spotify';
import { curatorRouter } from './routes/curators';
import { ratingsRouter } from './routes/ratings';
import { convertRouter } from './routes/convert';
import { playlistRouter } from './routes/playlists';
import { errorHandler } from './middleware/errorHandler';
import { requireAuth } from './middleware/requireAuth';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4000',
  'https://playlitfy.vercel.app',
  'https://playlitfy.com',
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman) and allowed origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error(`CORS: origin ${origin} not permitted`));
      }
    },
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── Public routes (no auth required) ─────────────────────────────────────────
app.use('/api/v1/auth', authRouter);        // /auth/spotify, /auth/callback, /auth/logout
app.use('/api/v1/spotify', spotifyRouter);  // /spotify/playlist, /spotify/search
app.use('/api/v1/convert', convertRouter);  // /convert – builds cross-service deep-links
app.use('/api/v1/curators', curatorRouter); // GET /curators – public directory
app.use('/api/v1/ratings', ratingsRouter);  // GET /ratings/:playlistId, POST (public votes)

// ── Protected routes (JWT required) ──────────────────────────────────────────
app.use('/api/v1/playlists', requireAuth, playlistRouter); // curator playlist management

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
