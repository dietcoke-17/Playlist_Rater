/**
 * Playlitfy Backend – Firebase Cloud Functions Entry Point
 *
 * Exposes a single Express application as a Firebase HTTPS callable function.
 * All routes are mounted under /api/v1/* and the function is named `api`.
 *
 * Deploy:  cd backend && npm run deploy
 * Local:   cd backend && npm run serve
 */

import { https } from 'firebase-functions/v1';
import app from './app';

// Single HTTP function that handles all REST routes via Express
export const api = https.onRequest(app);
