/**
 * Playlist conversion URL builder.
 *
 * Generates direct deep-links to Apple Music, YouTube Music, TIDAL, and
 * Amazon Music that let users open a converted playlist in those apps.
 *
 * Strategy used here: search-based deep-links using the playlist title
 * and first-track artist as query parameters. This is the most reliable
 * cross-platform approach without requiring paid API access to every service.
 *
 * When a user has an active Spotify token we enrich the link with ISRC
 * codes for higher match accuracy (displayed in the UI only).
 */

export type ConversionTarget =
  | 'Apple Music'
  | 'YouTube Music'
  | 'TIDAL'
  | 'Amazon Music';

export interface ConversionLink {
  service: ConversionTarget;
  webUrl: string;       // Universal browser URL
  deepLinkUrl: string;  // Native app deep link (iOS / Android URI scheme)
  searchQuery: string;  // Human-readable query used to build the link
}

export interface TrackHint {
  title: string;
  artist: string;
  isrc?: string;
}

/**
 * Build conversion links for all supported target services.
 *
 * @param playlistTitle  – The original playlist name (e.g. "Chill Beats Vol. 1")
 * @param firstTrack     – First track hint for search matching
 * @param target         – Target service, or 'all' for every service
 */
export function buildConversionLinks(
  playlistTitle: string,
  firstTrack: TrackHint,
  target: ConversionTarget | 'all' = 'all'
): ConversionLink[] {
  const q = encodeURIComponent(`${firstTrack.title} ${firstTrack.artist}`);
  const pq = encodeURIComponent(playlistTitle);

  const all: ConversionLink[] = [
    {
      service: 'Apple Music',
      // Apple Music MusicKit JS search endpoint (web)
      webUrl: `https://music.apple.com/search?term=${q}`,
      // iOS: opens Apple Music app directly to search
      deepLinkUrl: `music://search?term=${q}`,
      searchQuery: `${firstTrack.title} – ${firstTrack.artist}`,
    },
    {
      service: 'YouTube Music',
      // YouTube Music search for the track
      webUrl: `https://music.youtube.com/search?q=${q}`,
      // Android intent-style deep link
      deepLinkUrl: `intent://music.youtube.com/search?q=${q}#Intent;scheme=https;package=com.google.android.apps.youtube.music;end`,
      searchQuery: `${firstTrack.title} – ${firstTrack.artist}`,
    },
    {
      service: 'TIDAL',
      // TIDAL search for the playlist
      webUrl: `https://listen.tidal.com/search?q=${pq}`,
      deepLinkUrl: `tidal://search?q=${pq}`,
      searchQuery: playlistTitle,
    },
    {
      service: 'Amazon Music',
      // Amazon Music Unlimited web player search
      webUrl: `https://music.amazon.com/search/${encodeURIComponent(playlistTitle)}`,
      deepLinkUrl: `amazonmusic://search?q=${q}`,
      searchQuery: `${firstTrack.title} – ${firstTrack.artist}`,
    },
  ];

  if (target === 'all') return all;
  return all.filter((l) => l.service === target);
}

/**
 * Normalise and validate a Spotify playlist URL, returning the raw playlist ID.
 * Also accepts plain 22-character Spotify IDs.
 */
export function parseSpotifyPlaylistUrl(input: string): string | null {
  const trimmed = input.trim();

  // Full URL: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...
  const urlMatch = trimmed.match(
    /open\.spotify\.com\/playlist\/([a-zA-Z0-9]{22})/
  );
  if (urlMatch) return urlMatch[1];

  // URI: spotify:playlist:37i9dQZF1DXcBWIGoYBM5M
  const uriMatch = trimmed.match(/spotify:playlist:([a-zA-Z0-9]{22})/);
  if (uriMatch) return uriMatch[1];

  // Bare ID
  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) return trimmed;

  return null;
}
