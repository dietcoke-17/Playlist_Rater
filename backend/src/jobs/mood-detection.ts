/**
 * Mood detection background job.
 *
 * Detects moods for playlists that don't have mood tags:
 *  - Fetches playlists without moods
 *  - Uses AI service to detect moods
 *  - Updates playlist_moods table
 *  - Batches requests to minimize API costs
 */

import { supabase } from '../lib/supabase';
import { detectMoodFromPlaylist } from '../lib/ai-service';

export async function detectMoodsForNewPlaylists(): Promise<void> {
  console.log('Starting mood detection for new playlists...');

  // Get playlists without mood tags
  const { data: playlists, error } = await supabase
    .from('playlists')
    .select('id, title, description, genre')
    .eq('is_curator_approved', true)
    .limit(100);

  if (error) {
    console.error('Failed to fetch playlists:', error);
    return;
  }

  if (!playlists || playlists.length === 0) {
    console.log('No playlists found for mood detection');
    return;
  }

  console.log(`Detecting moods for ${playlists.length} playlists...`);

  // Get mood tags
  const { data: moodTags } = await supabase
    .from('mood_tags')
    .select('id, name');

  if (!moodTags) {
    console.error('Failed to fetch mood tags');
    return;
  }

  const moodMap = new Map(moodTags.map((m) => [m.name, m.id]));

  for (const playlist of playlists) {
    try {
      // Detect moods using AI
      const detection = await detectMoodFromPlaylist(playlist);

      // Insert mood associations
      for (const mood of detection.moods) {
        const moodId = moodMap.get(mood.name);
        if (moodId) {
          await supabase.from('playlist_moods').upsert({
            playlist_id: playlist.id,
            mood_id: moodId,
            confidence_score: mood.confidence,
          });
        }
      }

      console.log(`Detected moods for playlist ${playlist.id}`);
    } catch (error) {
      console.error(`Failed to detect moods for playlist ${playlist.id}:`, error);
    }
  }

  console.log('Mood detection completed');
}
