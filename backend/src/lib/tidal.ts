/**
 * TIDAL API helper.
 *
 * Handles:
 *  1. OAuth 2.0 flow for TIDAL
 *  2. Token management and refresh
 *  3. Playlist and track fetching
 *
 * Required environment variables:
 *   TIDAL_CLIENT_ID
 *   TIDAL_CLIENT_SECRET
 *   TIDAL_REDIRECT_URI
 */

import axios from 'axios';
import qs from 'qs';
import * as functions from 'firebase-functions';

const cfg = functions.config();

export const TIDAL_CLIENT_ID: string =
  process.env.TIDAL_CLIENT_ID ?? cfg.tidal?.client_id ?? '';

export const TIDAL_CLIENT_SECRET: string =
  process.env.TIDAL_CLIENT_SECRET ?? cfg.tidal?.client_secret ?? '';

export const TIDAL_REDIRECT_URI: string =
  process.env.TIDAL_REDIRECT_URI ?? cfg.tidal?.redirect_uri ?? '';

// ── OAuth Code Exchange ────────────────────────────────────────────────────────
export interface TidalTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export async function exchangeTidalCode(code: string): Promise<TidalTokens> {
  const { data } = await axios.post<TidalTokens>(
    'https://auth.tidal.com/v1/oauth2/token',
    qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: TIDAL_REDIRECT_URI,
      client_id: TIDAL_CLIENT_ID,
      client_secret: TIDAL_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

export async function refreshTidalToken(refreshToken: string): Promise<TidalTokens> {
  const { data } = await axios.post<TidalTokens>(
    'https://auth.tidal.com/v1/oauth2/token',
    qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: TIDAL_CLIENT_ID,
      client_secret: TIDAL_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

// ── TIDAL API Types ───────────────────────────────────────────────────────────
export interface TidalTrack {
  id: number;
  title: string;
  duration: number;
  artists: Array<{ name: string; id: number }>;
  album: { title: string; cover: string };
  url: string;
}

export interface TidalPlaylist {
  uuid: string;
  title: string;
  description: string;
  duration: number;
  numberOfTracks: number;
  image: string;
  creator: { id: number; name: string };
}

// ── Fetch Playlist ────────────────────────────────────────────────────────────
export async function fetchTidalPlaylist(
  playlistId: string,
  accessToken: string
): Promise<{ playlist: TidalPlaylist; tracks: TidalTrack[] }> {
  // Fetch playlist details
  const { data: playlist } = await axios.get<{ data: TidalPlaylist }>(
    `https://openapi.tidal.com/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // Fetch playlist items
  const { data: tracksData } = await axios.get<{ items: TidalTrack[]; limit: number; offset: number; totalNumberOfItems: number }>(
    `https://openapi.tidal.com/playlists/${playlistId}/items`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 100,
        offset: 0,
      },
    }
  );

  const tracks = tracksData.items;

  return { playlist: playlist.data, tracks };
}

// ── Format Duration ───────────────────────────────────────────────────────────
export function formatTidalDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
