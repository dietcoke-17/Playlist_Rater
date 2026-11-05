/**
 * Vercel serverless entrypoint.
 *
 * Vercel deploys every supported file under /api as a function, but does
 * NOT support catch-all segments like api/[...path].ts (that is a Next.js
 * feature). Instead this single function serves /api, and vercel.json
 * rewrites every /api/* request here. Vercel preserves the original
 * req.url, so the Express app still sees /api/v1/* paths and routes match.
 */

import type { Request, Response } from 'express';
import app from '../src/app';

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
