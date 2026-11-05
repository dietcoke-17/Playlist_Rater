/**
 * Amazon Music API helper.
 *
 * Handles:
 *  1. OAuth 2.0 flow for Amazon Music
 *  2. Token management and refresh
 *  3. Playlist and track fetching
 *
 * Required environment variables:
 *   AMAZON_CLIENT_ID
 *   AMAZON_CLIENT_SECRET
 *   AMAZON_REDIRECT_URI
 *
 * Note: Amazon Music API access requires approval from Amazon.
 * This is a basic implementation that follows the OAuth 2.0 pattern.
 */

import axios from 'axios';
import qs from 'qs';
import * as functions from 'firebase-functions';

const cfg = functions.config();

export const AMAZON_CLIENT_ID: string =
  process.env.AMAZON_CLIENT_ID ?? cfg.amazon?.client_id ?? '';

export const AMAZON_CLIENT_SECRET: string =
  process.env.AMAZON_CLIENT_SECRET ?? cfg.amazon?.client_secret ?? '';

export const AMAZON_REDIRECT_URI: string =
  process.env.AMAZON_REDIRECT_URI ?? cfg.amazon?.redirect_uri ?? '';

// ── OAuth Code Exchange ────────────────────────────────────────────────────────
export interface AmazonTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export async function exchangeAmazonCode(code: string): Promise<AmazonTokens> {
  const { data } = await axios.post<AmazonTokens>(
    'https://api.amazon.com/auth/o2/token',
    qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: AMAZON_REDIRECT_URI,
      client_id: AMAZON_CLIENT_ID,
      client_secret: AMAZON_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

export async function refreshAmazonToken(refreshToken: string): Promise<AmazonTokens> {
  const { data } = await axios.post<AmazonTokens>(
    'https://api.amazon.com/auth/o2/token',
    qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: AMAZON_CLIENT_ID,
      client_secret: AMAZON_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

// ── Amazon Music API Types ─────────────────────────────────────────────────────
export interface AmazonTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverImage: string;
}

export interface AmazonPlaylist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  trackCount: number;
  duration: number;
}

// ── Fetch Playlist ────────────────────────────────────────────────────────────
export async function fetchAmazonPlaylist(
  playlistId: string,
  accessToken: string
): Promise<{ playlist: AmazonPlaylist; tracks: AmazonTrack[] }> {
  // Note: Amazon Music API requires specific approval and endpoint structure
  // This is a placeholder implementation
  // Actual implementation depends on Amazon's API documentation

  try {
    const { data: playlist } = await axios.get<{ data: AmazonPlaylist }>(
      `https://api.amazon.com/music/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data: tracksData } = await axios.get<{ data: AmazonTrack[] }>(
      `https://api.amazon.com/music/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return { playlist: playlist.data, tracks: tracksData.data };
  } catch (error) {
    console.error('Amazon Music API error:', error);
    throw new Error('Amazon Music API not yet implemented - requires API approval');
  }
}

// ── Format Duration ───────────────────────────────────────────────────────────
export function formatAmazonDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
