/**
 * JWT utilities – sign and verify Playlitfy session tokens.
 *
 * The payload stores:
 *   sub           – Playlitfy users.id (UUID primary key)
 *   spotifyId     – Spotify user ID (only for Spotify-linked accounts)
 *   email         – account email
 *   displayName   – display name
 *   avatarUrl     – profile image URL
 *   authProvider  – provider used to sign in (spotify, google, apple, ...)
 *   platform      – legacy alias, kept for backwards compatibility
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
  sub: string;        // Playlitfy users.id (UUID)
  spotifyId?: string; // Spotify user ID, when linked
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  authProvider?: string; // spotify | google | apple | youtube | tidal | amazon
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
