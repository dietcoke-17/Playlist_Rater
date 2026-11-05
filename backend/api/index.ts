/**
 * Vercel serverless entrypoint.
 *
 * Vercel auto-detects files under /api as serverless functions.
 * The [...path] catch-all routes every /api/* request (including
 * /api/v1/*) into the same Express app used by the Firebase function.
 * Express sees the original request path, so all /api/v1/* routes match.
 */

import type { Request, Response } from 'express';
import app from '../src/app';

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
