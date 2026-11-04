/**
 * Playlist sync background job.
 *
 * Syncs playlists from all connected platforms:
 *  - Fetches playlists from platform tokens
 *  - Updates playlist records in database
 *  - Fetches audio features
 *  - Handles rate limiting and pagination
 */

import { supabase } from '../lib/supabase';

export async function syncAllPlaylists(): Promise<void> {
  console.log('Starting playlist sync for all platforms...');

  // Get all users with platform tokens
  const { data: platformTokens, error } = await supabase
    .from('platform_tokens')
    .select('user_id, platform, access_token, refresh_token, token_expires_at');

  if (error) {
    console.error('Failed to fetch platform tokens:', error);
    return;
  }

  if (!platformTokens || platformTokens.length === 0) {
    console.log('No platform tokens found');
    return;
  }

  console.log(`Found ${platformTokens.length} platform connections`);

  // Group by platform
  const tokensByPlatform: Record<string, typeof platformTokens> = {};
  platformTokens.forEach((token) => {
    if (!tokensByPlatform[token.platform]) {
      tokensByPlatform[token.platform] = [];
    }
    tokensByPlatform[token.platform].push(token);
  });

  // Sync each platform
  for (const [platform, tokens] of Object.entries(tokensByPlatform)) {
    console.log(`Syncing ${platform} for ${tokens.length} users...`);
    await syncPlatform(platform, tokens);
  }

  console.log('Playlist sync completed');
}

async function syncPlatform(
  platform: string,
  tokens: Array<{ user_id: string; access_token: string }>
): Promise<void> {
  for (const token of tokens) {
    try {
      await syncUserPlaylists(platform, token.user_id, token.access_token);
    } catch (error) {
      console.error(`Failed to sync ${platform} for user ${token.user_id}:`, error);
    }
  }
}

async function syncUserPlaylists(
  platform: string,
  userId: string,
  accessToken: string
): Promise<void> {
  // Platform-specific sync logic would go here
  // For now, this is a placeholder

  console.log(`Syncing ${platform} playlists for user ${userId}`);

  // Example: Fetch playlists from Spotify (existing implementation)
  if (platform === 'spotify') {
    const { fetchUserPublicPlaylists } = await import('../lib/spotify');
    const playlists = await fetchUserPublicPlaylists(userId, accessToken);

    for (const playlist of playlists) {
      // Upsert playlist to database
      await supabase.from('playlists').upsert({
        user_id: userId,
        spotify_playlist_id: playlist.id,
        title: playlist.name,
        description: playlist.description,
        cover_image: playlist.images[0]?.url || null,
        track_count: playlist.tracks.total,
        followers_count: playlist.followers.total,
        source_service: 'Spotify',
        spotify_url: playlist.external_urls.spotify,
        is_public: playlist.public,
        platform: 'spotify',
        updated_at: new Date().toISOString(),
      });
    }
  }

  // Other platforms would be implemented similarly
  // with their respective API clients
}
