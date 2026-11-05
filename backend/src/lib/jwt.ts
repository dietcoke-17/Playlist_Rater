/**
 * JWT utilities – sign and verify Playlitfy session tokens.
 *
 * The payload stores:
 *   sub          – Spotify user ID
 *   email        – Spotify email
 *   displayName  – Spotify display name
 *   avatarUrl    – first Spotify profile image URL
 *   spotifyId    – alias for sub (kept for clarity in consuming code)
 *
 * Required env / Firebase config:
 *   JWT_SECRET   (long random string, min 32 chars)
 */

import jwt from 'jsonwebtoken';
import * as functions from 'firebase-functions';

const cfg = functions.config();

const JWT_SECRET: string =
  process.env.JWT_SECRET ?? cfg.jwt?.secret ?? 'CHANGE_ME_IN_PRODUCTION';

const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  sub: string;        // User ID
  spotifyId?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  platform?: string;  // Platform (spotify, apple, youtube, tidal, amazon)
  iat?: number;
  exp?: number;
}

/** Sign a new JWT for a verified user. */
export function signToken(payload: Partial<JwtPayload> & { sub: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/** Verify and decode a Playlitfy JWT. Throws if invalid or expired. */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
