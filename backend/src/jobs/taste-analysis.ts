/**
 * Taste analysis background job.
 *
 * Analyzes listening history for active users:
 *  - Fetches listening history
 *  - Uses AI to extract taste insights
 *  - Updates user_taste_profile table
 *  - Runs daily for users with recent activity
 */

import { supabase } from '../lib/supabase';
import { generateTasteInsights } from '../lib/ai-service';

export async function analyzeTasteForActiveUsers(): Promise<void> {
  console.log('Starting taste analysis for active users...');

  // Get users with recent listening history (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: listeningHistory, error } = await supabase
    .from('listening_history')
    .select('user_id, playlist_id, platform, played_at')
    .gte('played_at', sevenDaysAgo.toISOString());

  if (error) {
    console.error('Failed to fetch listening history:', error);
    return;
  }

  if (!listeningHistory || listeningHistory.length === 0) {
    console.log('No recent listening history found');
    return;
  }

  // Group by user
  const historyByUser: Record<string, typeof listeningHistory> = {};
  listeningHistory.forEach((h) => {
    if (!historyByUser[h.user_id]) {
      historyByUser[h.user_id] = [];
    }
    historyByUser[h.user_id].push(h);
  });

  console.log(`Analyzing taste for ${Object.keys(historyByUser).length} users...`);

  // Get playlist details for context
  const playlistIds = [...new Set(listeningHistory.map((h) => h.playlist_id).filter(Boolean))];
  const { data: playlists } = await supabase
    .from('playlists')
    .select('id, title, genre')
    .in('id', playlistIds);

  const playlistMap = new Map(playlists?.map((p) => [p.id, p]) || []);

  // Analyze taste for each user
  for (const [userId, history] of Object.entries(historyByUser)) {
    try {
      const enrichedHistory = history
        .map((h) => {
          const playlist = playlistMap.get(h.playlist_id);
          return {
            playlist_title: playlist?.title || 'Unknown',
            genre: playlist?.genre,
            platform: h.platform,
            played_at: h.played_at,
          };
        })
        .slice(0, 100); // Limit to last 100 entries

      const insights = await generateTasteInsights(enrichedHistory);

      // Get existing taste profile
      const { data: existingProfile } = await supabase
        .from('user_taste_profile')
        .select('id')
        .eq('user_id', userId)
        .single();

      const profileData = {
        user_id: userId,
        favorite_genres: insights.favorite_genres,
        favorite_artists: insights.favorite_artists,
        preferred_moods: insights.preferred_moods,
        listening_patterns: {
          pattern: insights.listening_pattern,
          total_sessions: history.length,
        },
        last_analyzed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingProfile) {
        await supabase
          .from('user_taste_profile')
          .update(profileData)
          .eq('id', existingProfile.id);
      } else {
        await supabase.from('user_taste_profile').insert(profileData);
      }

      console.log(`Analyzed taste for user ${userId}`);
    } catch (error) {
      console.error(`Failed to analyze taste for user ${userId}:`, error);
    }
  }

  console.log('Taste analysis completed');
}
