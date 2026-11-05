/**
 * Spotify API helper.
 *
 * Handles:
 *  1. Client-Credentials token caching (for public playlist reads)
 *  2. Authorisation-Code exchange & refresh (for OAuth user flows)
 *  3. Fetching playlist metadata and full tracklists
 *  4. Detecting if a playlist is "popular" enough to auto-feature
 *
 * Required environment / Firebase config keys:
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_REDIRECT_URI   (e.g. https://<region>-<project>.cloudfunctions.net/api/api/v1/auth/callback)
 */

import axios from 'axios';
import qs from 'qs';
import * as functions from 'firebase-functions';

const cfg = functions.config();

export const SPOTIFY_CLIENT_ID: string =
  process.env.SPOTIFY_CLIENT_ID ?? cfg.spotify?.client_id ?? '';

export const SPOTIFY_CLIENT_SECRET: string =
  process.env.SPOTIFY_CLIENT_SECRET ?? cfg.spotify?.client_secret ?? '';

export const SPOTIFY_REDIRECT_URI: string =
  process.env.SPOTIFY_REDIRECT_URI ?? cfg.spotify?.redirect_uri ?? '';

// ── OAuth scopes requested when a user connects their Spotify ─────────────────
export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ');

// ── Client-Credentials token cache (expires ~1 h) ────────────────────────────
interface TokenCache {
  access_token: string;
  expires_at: number; // ms epoch
}

let _ccTokenCache: TokenCache | null = null;

/** Returns a cached or freshly-obtained Client-Credentials access token. */
export async function getClientToken(): Promise<string> {
  const now = Date.now();
  if (_ccTokenCache && _ccTokenCache.expires_at > now + 30_000) {
    return _ccTokenCache.access_token;
  }

  const basicAuth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const { data } = await axios.post<{
    access_token: string;
    expires_in: number;
  }>(
    'https://accounts.spotify.com/api/token',
    qs.stringify({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  _ccTokenCache = {
    access_token: data.access_token,
    expires_at: now + data.expires_in * 1000,
  };

  return data.access_token;
}

// ── Auth-Code token exchange ──────────────────────────────────────────────────
export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function exchangeCodeForTokens(
  code: string
): Promise<SpotifyTokens> {
  const basicAuth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const { data } = await axios.post<SpotifyTokens>(
    'https://accounts.spotify.com/api/token',
    qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<SpotifyTokens> {
  const basicAuth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const { data } = await axios.post<SpotifyTokens>(
    'https://accounts.spotify.com/api/token',
    qs.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

// ── Spotify object types ──────────────────────────────────────────────────────
export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  external_ids?: { isrc?: string };
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: SpotifyImage[];
    release_date: string;
  };
  preview_url: string | null;
  external_urls: { spotify: string };
  popularity: number;
}

export interface SpotifyPlaylistTrackItem {
  added_at: string;
  track: SpotifyTrack | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  public: boolean;
  followers: { total: number };
  images: SpotifyImage[];
  owner: {
    id: string;
    display_name: string;
    external_urls: { spotify: string };
  };
  tracks: {
    total: number;
    items: SpotifyPlaylistTrackItem[];
    next: string | null;
  };
  external_urls: { spotify: string };
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
  followers: { total: number };
  external_urls: { spotify: string };
  country: string;
}

// ── Fetch full playlist (paginates to collect all tracks) ────────────────────
export async function fetchPlaylist(
  playlistId: string,
  accessToken?: string
): Promise<SpotifyPlaylist> {
  const token = accessToken ?? (await getClientToken());
  const headers = { Authorization: `Bearer ${token}` };

  // Base playlist info
  const { data: playlist } = await axios.get<SpotifyPlaylist>(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    { headers }
  );

  // Paginate tracks if there are more than 100
  let next: string | null = playlist.tracks.next;
  while (next) {
    const { data: page } = await axios.get<{
      items: SpotifyPlaylistTrackItem[];
      next: string | null;
    }>(next, { headers });
    playlist.tracks.items.push(...page.items);
    next = page.next;
  }

  return playlist;
}

/** Extracts playlist ID from any Spotify playlist URL or returns it as-is. */
export function extractPlaylistId(urlOrId: string): string {
  // Matches open.spotify.com/playlist/<id> or spotify:playlist:<id>
  const match =
    urlOrId.match(/playlist[/:]([a-zA-Z0-9]+)/) ??
    urlOrId.match(/^([a-zA-Z0-9]{22})$/);
  if (match) return match[1];
  throw new Error(`Cannot extract playlist ID from: ${urlOrId}`);
}

/** Fetch the authenticated user's Spotify profile. */
export async function fetchUserProfile(
  accessToken: string
): Promise<SpotifyUserProfile> {
  const { data } = await axios.get<SpotifyUserProfile>(
    'https://api.spotify.com/v1/me',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return data;
}

/** Fetch a user's public playlists (paginated, up to 200). */
export async function fetchUserPublicPlaylists(
  spotifyUserId: string,
  accessToken?: string
): Promise<SpotifyPlaylist[]> {
  const token = accessToken ?? (await getClientToken());
  const headers = { Authorization: `Bearer ${token}` };
  const playlists: SpotifyPlaylist[] = [];
  let url: string | null =
    `https://api.spotify.com/v1/users/${spotifyUserId}/playlists?limit=50`;

  type PageResult = { items: SpotifyPlaylist[]; next: string | null };

  while (url && playlists.length < 200) {
    const pageResp: { data: PageResult } = await axios.get<PageResult>(url, { headers });
    const page: PageResult = pageResp.data;
    playlists.push(...page.items.filter((p: SpotifyPlaylist) => p.public));
    url = page.next;
  }

  return playlists;
}

/** Popularity threshold (followers) to auto-feature a curator's playlist. */
export const POPULAR_PLAYLIST_THRESHOLD = 1_000;

/** Returns true if the playlist meets the auto-feature threshold. */
export function isPopularPlaylist(playlist: SpotifyPlaylist): boolean {
  return playlist.followers.total >= POPULAR_PLAYLIST_THRESHOLD;
}

/** Format duration in ms to MM:SS string. */
export function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
