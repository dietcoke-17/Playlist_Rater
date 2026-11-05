/**
 * Stateless OAuth `state` parameter.
 *
 * The previous implementation kept state in an in-memory Map, which breaks
 * on serverless platforms (Vercel): the /authorize redirect and the
 * /callback can land on different instances, so validation always failed
 * with `invalid_state`.
 *
 * Instead we embed an expiry timestamp and sign the payload with HMAC
 * using JWT_SECRET. No server-side storage required.
 */

import crypto from 'crypto';
import * as functions from 'firebase-functions';

const cfg = functions.config();

const SECRET: string =
  process.env.JWT_SECRET ?? cfg.jwt?.secret ?? 'CHANGE_ME_IN_PRODUCTION';

const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface StatePayload {
  exp: number; // expiry epoch ms
  n: string;  // random nonce
}

function sign(data: string): string {
  return crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
}

/** Create a signed state value to pass to the OAuth provider. */
export function createState(): string {
  const payload: StatePayload = {
    exp: Date.now() + STATE_TTL_MS,
    n: crypto.randomBytes(12).toString('hex'),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${sign(data)}`;
}

/** Verify a state value returned by the OAuth provider. */
export function verifyState(state: string): boolean {
  if (!state || typeof state !== 'string') return false;
  const dot = state.lastIndexOf('.');
  if (dot <= 0) return false;

  const data = state.slice(0, dot);
  const sig = state.slice(dot + 1);

  const expected = sign(data);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(data, 'base64url').toString('utf8')
    ) as StatePayload;
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}
