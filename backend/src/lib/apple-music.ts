/**
 * Apple Music API helper.
 *
 * Handles:
 *  1. OAuth 2.0 flow for Apple Music
 *  2. JWT token generation for MusicKit
 *  3. Playlist and track fetching
 *
 * Required environment variables:
 *   APPLE_MUSIC_KEY_ID
 *   APPLE_MUSIC_TEAM_ID
 *   APPLE_MUSIC_PRIVATE_KEY
 *   APPLE_MUSIC_REDIRECT_URI
 */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import * as functions from 'firebase-functions';

const cfg = functions.config();

export const APPLE_MUSIC_KEY_ID: string =
  process.env.APPLE_MUSIC_KEY_ID ?? cfg.apple?.key_id ?? '';

export const APPLE_MUSIC_TEAM_ID: string =
  process.env.APPLE_MUSIC_TEAM_ID ?? cfg.apple?.team_id ?? '';

export const APPLE_MUSIC_PRIVATE_KEY: string =
  process.env.APPLE_MUSIC_PRIVATE_KEY ?? cfg.apple?.private_key ?? '';

export const APPLE_MUSIC_REDIRECT_URI: string =
  process.env.APPLE_MUSIC_REDIRECT_URI ?? cfg.apple?.redirect_uri ?? '';

export const APPLE_MUSIC_SCOPES = [
  'music-user-library-read',
  'music-user-library-restricted',
].join(' ');

// ── JWT Token Generation for MusicKit ──────────────────────────────────────────
interface AppleMusicTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export function generateDeveloperToken(): string {
  if (!APPLE_MUSIC_KEY_ID || !APPLE_MUSIC_TEAM_ID || !APPLE_MUSIC_PRIVATE_KEY) {
    throw new Error('Missing Apple Music credentials');
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: APPLE_MUSIC_TEAM_ID,
    iat: now,
    exp: now + 15777000, // 6 months
    sub: APPLE_MUSIC_KEY_ID,
  };

  return jwt.sign(payload, APPLE_MUSIC_PRIVATE_KEY, {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: APPLE_MUSIC_KEY_ID,
    },
  });
}

// ── OAuth Code Exchange ────────────────────────────────────────────────────────
export async function exchangeAppleCode(code: string): Promise<AppleMusicTokens> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: APPLE_MUSIC_REDIRECT_URI,
    client_id: APPLE_MUSIC_KEY_ID,
    client_secret: generateDeveloperToken(),
  });

  const { data } = await axios.post<AppleMusicTokens>(
    'https://appleid.apple.com/auth/oauth2/token',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

export async function refreshAppleToken(refreshToken: string): Promise<AppleMusicTokens> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: APPLE_MUSIC_KEY_ID,
    client_secret: generateDeveloperToken(),
  });

  const { data } = await axios.post<AppleMusicTokens>(
    'https://appleid.apple.com/auth/oauth2/token',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

// ── Apple Music API Types ─────────────────────────────────────────────────────
export interface AppleMusicTrack {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    durationInMillis: number;
    playParams: {
      id: string;
      kind: string;
    };
    artwork?: {
      url: string;
    };
  };
}

export interface AppleMusicPlaylist {
  id: string;
  attributes: {
    name: string;
    description?: {
      standard: string;
    };
    artwork?: {
      url: string;
    };
    lastModifiedDate: string;
  };
  relationships?: {
    tracks: {
      data: AppleMusicTrack[];
    };
  };
}

// ── Fetch Playlist ────────────────────────────────────────────────────────────
export async function fetchApplePlaylist(
  playlistId: string,
  accessToken: string
): Promise<AppleMusicPlaylist> {
  const developerToken = generateDeveloperToken();
  const { data } = await axios.get<{ data: AppleMusicPlaylist }>(
    `https://api.music.apple.com/v1/catalog/us/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${developerToken}`,
        'Music-User-Token': accessToken,
      },
    }
  );

  return data.data;
}

// ── Format Duration ───────────────────────────────────────────────────────────
export function formatAppleDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
