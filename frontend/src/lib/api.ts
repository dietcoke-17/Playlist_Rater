/**
 * Playlitfy Backend API Client
 *
 * Thin wrapper around fetch() for all backend calls.
 * Reads the base URL from VITE_API_URL environment variable.
 * Falls back to localhost:5001 (Firebase emulator) in development.
 *
 * Usage:
 *   import { api } from '../lib/api';
 *   const result = await api.convertPlaylist(url, 'Apple Music');
 */

const BASE_URL: string =
  import.meta.env.VITE_API_URL ??
  'http://localhost:5001/api/v1';

// ── Auth helpers ──────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('playlitfy_token');
}

function setToken(token: string): void {
  localStorage.setItem('playlitfy_token', token);
}

function clearToken(): void {
  localStorage.removeItem('playlitfy_token');
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(
      (error as { error?: string }).error ?? `HTTP ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NormalisedTrack {
  id: string;
  position: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationMs: number;
  coverImage: string | null;
  isrc: string | null;
  previewUrl: string | null;
  spotifyUrl: string;
  popularity: number;
}

export interface ConversionLink {
  service: string;
  webUrl: string;
  deepLinkUrl: string;
  searchQuery: string;
}

export interface NormalisedPlaylist {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  followers: number;
  coverImage: string | null;
  trackCount: number;
  tracks: NormalisedTrack[];
  duration: string;
  curator: {
    spotifyId: string;
    displayName: string;
    spotifyUrl: string;
  };
  spotifyUrl: string;
  conversionLinks: ConversionLink[];
}

export interface ConvertResponse {
  playlist: Omit<NormalisedPlaylist, 'tracks'> & { tracks: NormalisedTrack[] };
  conversionLinks: ConversionLink[];
  matchedTracks: number;
  matchRate: number;
}

export interface CuratorSummary {
  id: string;
  spotify_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  genres: string[];
  avg_rating: number;
  playlists_count: number;
  followers_count: number;
  playlists: PlaylistSummary[];
}

export interface PlaylistSummary {
  id: string;
  title: string;
  cover_image: string | null;
  track_count: number;
  avg_rating: number;
  review_count: number;
  genre: string | null;
  spotify_url: string;
  is_featured: boolean;
}

export interface RatingData {
  playlistId: string;
  avgRating: number;
  reviewCount: number;
  distribution: Array<{ score: number; count: number }>;
}

export interface RatingSubmitResult {
  success: boolean;
  avgRating: number;
  reviewCount: number;
  yourScore: number;
  updated: boolean;
}

export interface UserProfile {
  id: string;
  spotify_id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  is_curator_public: boolean;
  bio: string | null;
  genres: string[];
  avg_rating: number;
  playlists_count: number;
}

// ── API methods ───────────────────────────────────────────────────────────────

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────

  /** Redirect user to Spotify OAuth authorisation page. */
  initiateSpotifyLogin(): void {
    window.location.href = `${BASE_URL}/auth/spotify`;
  },

  /** Called after Spotify redirects back with ?token=<jwt> */
  handleOAuthCallback(token: string): void {
    setToken(token);
  },

  /** Fetch the currently authenticated user's profile. */
  async getMe(): Promise<{ user: UserProfile }> {
    return apiFetch('/auth/me');
  },

  /** Sign out and clear local token. */
  async logout(): Promise<void> {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      clearToken();
    }
  },

  isLoggedIn(): boolean {
    return !!getToken();
  },

  // ── Spotify data ──────────────────────────────────────────────────────────

  /** Fetch a public Spotify playlist by URL or ID. */
  async fetchPlaylist(url: string): Promise<{ playlist: NormalisedPlaylist }> {
    return apiFetch(`/spotify/playlist?url=${encodeURIComponent(url)}`);
  },

  // ── Conversion ────────────────────────────────────────────────────────────

  /** Convert a Spotify playlist URL to another service's links. */
  async convertPlaylist(
    url: string,
    target: string = 'all'
  ): Promise<ConvertResponse> {
    return apiFetch('/convert', {
      method: 'POST',
      body: JSON.stringify({ url, target }),
    });
  },

  /** Build a single deep-link without fetching Spotify. */
  async buildLink(
    title: string,
    artist: string,
    target: string = 'all'
  ): Promise<{ links: ConversionLink[] }> {
    return apiFetch(
      `/convert/link?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&target=${encodeURIComponent(target)}`
    );
  },

  // ── Curator directory ─────────────────────────────────────────────────────

  /** List public curators (paginated). */
  async getCurators(params: {
    genre?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<{
    curators: CuratorSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return apiFetch(`/curators${qs ? `?${qs}` : ''}`);
  },

  /** Get a single curator profile with their playlists. */
  async getCurator(id: string): Promise<{ curator: CuratorSummary }> {
    return apiFetch(`/curators/${id}`);
  },

  /** Opt the logged-in user into the public curator directory. */
  async optInAsCurator(): Promise<{ success: boolean; message: string }> {
    return apiFetch('/curators/opt-in', { method: 'POST' });
  },

  /** Opt the logged-in user out of the public curator directory. */
  async optOutAsCurator(): Promise<{ success: boolean; message: string }> {
    return apiFetch('/curators/opt-out', { method: 'POST' });
  },

  /** Update curator bio and genres. */
  async updateCuratorProfile(data: {
    bio?: string;
    genres?: string[];
  }): Promise<{ success: boolean }> {
    return apiFetch('/curators/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // ── Ratings ───────────────────────────────────────────────────────────────

  /** Get score distribution for a playlist. */
  async getRating(playlistId: string): Promise<RatingData> {
    return apiFetch(`/ratings/${playlistId}`);
  },

  /** Submit a 1–10 vote for a playlist. */
  async submitRating(
    playlistId: string,
    score: number,
    voterFingerprint?: string
  ): Promise<RatingSubmitResult> {
    return apiFetch(`/ratings/${playlistId}`, {
      method: 'POST',
      body: JSON.stringify({ score, voterFingerprint }),
    });
  },

  /** Get the global leaderboard of top-rated playlists. */
  async getLeaderboard(params: { limit?: number; genre?: string } = {}): Promise<{
    playlists: (PlaylistSummary & { users: { display_name: string; avatar_url: string | null } })[];
  }> {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return apiFetch(`/ratings/leaderboard${qs ? `?${qs}` : ''}`);
  },

  // ── Playlists (authenticated) ─────────────────────────────────────────────

  /** List the authenticated user's playlists. */
  async getMyPlaylists(): Promise<{ playlists: PlaylistSummary[] }> {
    return apiFetch('/playlists');
  },

  /** Publish a Spotify playlist URL to the community directory. */
  async publishPlaylist(data: {
    spotifyPlaylistUrl: string;
    genre?: string;
    description?: string;
    allowPublic?: boolean;
  }): Promise<{ success: boolean; playlistId: string; message: string }> {
    return apiFetch('/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Import the user's full public Spotify library. */
  async importLibrary(): Promise<{
    success: boolean;
    imported: number;
    total: number;
    message: string;
  }> {
    return apiFetch('/playlists/import-library', { method: 'POST' });
  },

  /** Re-sync a playlist from Spotify. */
  async syncPlaylist(
    id: string
  ): Promise<{ success: boolean; syncedTracks: number }> {
    return apiFetch(`/playlists/${id}/sync`, { method: 'POST' });
  },

  /** Remove a playlist from the public directory. */
  async removePlaylist(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/playlists/${id}`, { method: 'DELETE' });
  },

  // ── Platform Auth ───────────────────────────────────────────────────────────

  /** Redirect user to Google OAuth authorisation page. */
  initiateGoogleLogin(): void {
    window.location.href = `${BASE_URL}/auth/google`;
  },

  /** Redirect to Apple Music OAuth */
  initiateAppleLogin(): void {
    window.location.href = `${BASE_URL}/auth/apple`;
  },

  /** Redirect to YouTube Music OAuth */
  initiateYoutubeLogin(): void {
    window.location.href = `${BASE_URL}/auth/youtube`;
  },

  /** Redirect to TIDAL OAuth */
  initiateTidalLogin(): void {
    window.location.href = `${BASE_URL}/auth/tidal`;
  },

  /** Redirect to Amazon Music OAuth */
  initiateAmazonLogin(): void {
    window.location.href = `${BASE_URL}/auth/amazon`;
  },

  // ── Connected Services ──────────────────────────────────────────────────────

  /** List user's connected platforms */
  async getConnectedServices(): Promise<{ platforms: Array<{ platform: string; platform_user_id?: string }> }> {
    return apiFetch('/connected-services');
  },

  /** Connect a platform */
  async connectPlatform(platform: string, data: { access_token: string; refresh_token?: string; platform_user_id?: string }): Promise<{ success: boolean }> {
    return apiFetch(`/connected-services/${platform}/connect`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Disconnect a platform */
  async disconnectPlatform(platform: string): Promise<{ success: boolean }> {
    return apiFetch(`/connected-services/${platform}`, { method: 'DELETE' });
  },

  /** Get playlists from a connected platform */
  async getPlatformPlaylists(platform: string): Promise<{ playlists: any[] }> {
    return apiFetch(`/connected-services/${platform}/playlists`);
  },

  /** Sync playlists from a platform */
  async syncPlatformPlaylists(platform: string): Promise<{ success: boolean; message: string }> {
    return apiFetch(`/connected-services/${platform}/sync`, { method: 'POST' });
  },

  // ── Moods ─────────────────────────────────────────────────────────────────

  /** List all available moods */
  async getMoods(): Promise<{ moods: Array<{ id: string; name: string; emoji: string; description: string; color_hex: string }> }> {
    return apiFetch('/moods');
  },

  /** Get playlists for a specific mood */
  async getPlaylistsByMood(moodId: string, limit?: number, offset?: number): Promise<{ playlists: any[] }> {
    const params = new URLSearchParams({
      ...(limit && { limit: String(limit) }),
      ...(offset && { offset: String(offset) }),
    });
    return apiFetch(`/moods/${moodId}/playlists${params ? `?${params}` : ''}`);
  },

  /** Detect mood for a playlist */
  async detectPlaylistMood(playlistId: string): Promise<{ success: boolean; moods: Array<{ name: string; confidence: number }> }> {
    return apiFetch(`/moods/playlist/${playlistId}/detect`, { method: 'POST' });
  },

  // ── Taste ─────────────────────────────────────────────────────────────────

  /** Get user's taste profile */
  async getTasteProfile(): Promise<{ profile: any }> {
    return apiFetch('/taste/profile');
  },

  /** Trigger taste analysis */
  async analyzeTaste(): Promise<{ success: boolean; profile: any }> {
    return apiFetch('/taste/analyze', { method: 'POST' });
  },

  /** Get taste-based recommendations */
  async getTasteRecommendations(): Promise<{ playlists: any[]; reasoning: string }> {
    return apiFetch('/taste/recommendations');
  },

  // ── Curators ───────────────────────────────────────────────────────────────

  /** Get top-tier curators */
  async getTopTierCurators(limit?: number): Promise<{ curators: any[] }> {
    const params = limit ? `?limit=${limit}` : '';
    return apiFetch(`/curators/top-tier${params}`);
  },
};

export { setToken, getToken, clearToken };
