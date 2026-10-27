/**
 * Conversion route – builds cross-service deep-links for a Spotify playlist URL.
 *
 * POST /api/v1/convert
 * Body: { url: string, target?: ConversionTarget | 'all' }
 *
 * 1. Parses the Spotify playlist URL
 * 2. Fetches the playlist (public, client-credentials)
 * 3. Returns normalised playlist + conversion links for target service(s)
 *
 * GET /api/v1/convert/link?title=<>&artist=<>&target=<>
 *   Lightweight variant – builds a single link without fetching Spotify
 */

import { Router, Request, Response, NextFunction } from 'express';
import { extractPlaylistId, fetchPlaylist } from '../lib/spotify';
import {
  buildConversionLinks,
  parseSpotifyPlaylistUrl,
  type ConversionTarget,
} from '../lib/converter';
import { normalisePlaylist } from './spotify';
import axios from 'axios';

export const convertRouter = Router();

const VALID_TARGETS: ConversionTarget[] = [
  'Apple Music',
  'YouTube Music',
  'TIDAL',
  'Amazon Music',
];

// ── POST /convert ─────────────────────────────────────────────────────────────
convertRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { url, target = 'all' } = req.body as {
        url?: string;
        target?: ConversionTarget | 'all';
      };

      if (!url) {
        return res.status(400).json({ error: 'url is required in the request body' });
      }

      // Validate target
      if (target !== 'all' && !VALID_TARGETS.includes(target as ConversionTarget)) {
        return res.status(400).json({
          error: `Invalid target. Must be one of: all, ${VALID_TARGETS.join(', ')}`,
        });
      }

      const playlistId = parseSpotifyPlaylistUrl(url);
      if (!playlistId) {
        return res.status(400).json({ error: 'Invalid or unrecognised Spotify playlist URL' });
      }

      // Fetch full playlist
      const raw = await fetchPlaylist(playlistId);
      const playlist = normalisePlaylist(raw);

      // Build links for the requested target
      const firstTrack = playlist.tracks[0];
      const links = firstTrack
        ? buildConversionLinks(
            playlist.title,
            { title: firstTrack.title, artist: firstTrack.artist, isrc: firstTrack.isrc ?? undefined },
            target as ConversionTarget | 'all'
          )
        : [];

      return res.json({
        playlist: {
          id: playlist.id,
          title: playlist.title,
          description: playlist.description,
          coverImage: playlist.coverImage,
          trackCount: playlist.trackCount,
          duration: playlist.duration,
          curator: playlist.curator,
          spotifyUrl: playlist.spotifyUrl,
          tracks: playlist.tracks.slice(0, 5), // preview first 5 tracks
        },
        conversionLinks: links,
        matchedTracks: playlist.trackCount,
        matchRate: 100, // Spotify→Spotify is always 100%; other platforms use search
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return res.status(404).json({ error: 'Playlist not found or is private' });
      }
      next(err);
    }
  }
);

// ── GET /convert/link ─────────────────────────────────────────────────────────
convertRouter.get(
  '/link',
  (req: Request, res: Response) => {
    const { title, artist, target = 'all' } = req.query as Record<string, string>;

    if (!title || !artist) {
      return res
        .status(400)
        .json({ error: 'title and artist query parameters are required' });
    }

    const links = buildConversionLinks(
      title,
      { title, artist },
      target as ConversionTarget | 'all'
    );

    return res.json({ links });
  }
);

// ── GET /convert/targets ──────────────────────────────────────────────────────
convertRouter.get('/targets', (_req: Request, res: Response) => {
  res.json({
    targets: VALID_TARGETS.map((t) => ({
      name: t,
      id: t.toLowerCase().replace(/\s+/g, '-'),
    })),
  });
});
