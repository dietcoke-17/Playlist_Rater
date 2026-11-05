/**
 * YouTube Music API helper.
 *
 * Handles:
 *  1. OAuth 2.0 flow for YouTube Music
 *  2. Token management and refresh
 *  3. Playlist and track fetching
 *
 * Required environment variables:
 *   YOUTUBE_CLIENT_ID
 *   YOUTUBE_CLIENT_SECRET
 *   YOUTUBE_REDIRECT_URI
 */

import axios from 'axios';
import qs from 'qs';
import * as functions from 'firebase-functions';

const cfg = functions.config();

export const YOUTUBE_CLIENT_ID: string =
  process.env.YOUTUBE_CLIENT_ID ?? cfg.youtube?.client_id ?? '';

export const YOUTUBE_CLIENT_SECRET: string =
  process.env.YOUTUBE_CLIENT_SECRET ?? cfg.youtube?.client_secret ?? '';

export const YOUTUBE_REDIRECT_URI: string =
  process.env.YOUTUBE_REDIRECT_URI ?? cfg.youtube?.redirect_uri ?? '';

export const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
].join(' ');

// ── OAuth Code Exchange ────────────────────────────────────────────────────────
export interface YoutubeTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export async function exchangeYoutubeCode(code: string): Promise<YoutubeTokens> {
  const { data } = await axios.post<YoutubeTokens>(
    'https://oauth2.googleapis.com/token',
    qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: YOUTUBE_REDIRECT_URI,
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

export async function refreshYoutubeToken(refreshToken: string): Promise<YoutubeTokens> {
  const { data } = await axios.post<YoutubeTokens>(
    'https://oauth2.googleapis.com/token',
    qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

// ── YouTube Music API Types ────────────────────────────────────────────────────
export interface YoutubeTrack {
  id: string;
  snippet: {
    title: string;
    channelId: string;
    channelTitle: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  contentDetails?: {
    duration: string;
  };
}

export interface YoutubePlaylist {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  contentDetails?: {
    itemCount: number;
  };
}

// ── Fetch Playlist ────────────────────────────────────────────────────────────
export async function fetchYoutubePlaylist(
  playlistId: string,
  accessToken: string
): Promise<{ playlist: YoutubePlaylist; tracks: YoutubeTrack[] }> {
  // Fetch playlist details
  const { data: playlistData } = await axios.get<{ items: YoutubePlaylist[] }>(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const playlist = playlistData.items[0];
  if (!playlist) {
    throw new Error('Playlist not found');
  }

  // Fetch playlist items
  const tracks: YoutubeTrack[] = [];
  let nextPageToken: string | null = null;

  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
    });

    if (nextPageToken) {
      params.append('pageToken', nextPageToken);
    }

    const { data: itemsData } = await axios.get<{
      items: any[];
      nextPageToken?: string;
    }>(
      `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Fetch video details for each item
    const videoIds = itemsData.items
      .map((item) => item.snippet.resourceId?.videoId)
      .filter(Boolean)
      .join(',');

    if (videoIds) {
      const { data: videosData } = await axios.get<{ items: YoutubeTrack[] }>(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      tracks.push(...videosData.items);
    }

    nextPageToken = itemsData.nextPageToken || null;
  } while (nextPageToken);

  return { playlist, tracks };
}

// ── Format Duration ───────────────────────────────────────────────────────────
export function formatYoutubeDuration(duration: string): string {
  // YouTube duration format: PT1H2M3S
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  const totalMinutes = hours * 60 + minutes;
  return `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;
}
