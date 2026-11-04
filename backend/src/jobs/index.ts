/**
 * Background job scheduler using node-cron.
 *
 * Schedules and manages background jobs:
 *  - Playlist sync (every 6 hours)
 *  - Curator ranking (daily)
 *  - Mood detection (daily)
 *  - Taste analysis (daily for active users)
 */

import cron from 'node-cron';
import { syncAllPlaylists } from './playlist-sync';
import { updateAllCuratorRankings } from './curator-ranking';
import { detectMoodsForNewPlaylists } from './mood-detection';
import { analyzeTasteForActiveUsers } from './taste-analysis';

// ── Initialize Jobs ───────────────────────────────────────────────────────────

export function initializeJobs(): void {
  console.log('Initializing background jobs...');

  // Playlist sync - every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Job] Starting playlist sync...');
    try {
      await syncAllPlaylists();
      console.log('[Job] Playlist sync completed');
    } catch (error) {
      console.error('[Job] Playlist sync failed:', error);
    }
  });

  // Curator ranking - daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[Job] Starting curator ranking update...');
    try {
      await updateAllCuratorRankings();
      console.log('[Job] Curator ranking update completed');
    } catch (error) {
      console.error('[Job] Curator ranking update failed:', error);
    }
  });

  // Mood detection - daily at 3 AM
  cron.schedule('0 3 * * *', async () => {
    console.log('[Job] Starting mood detection...');
    try {
      await detectMoodsForNewPlaylists();
      console.log('[Job] Mood detection completed');
    } catch (error) {
      console.error('[Job] Mood detection failed:', error);
    }
  });

  // Taste analysis - daily at 4 AM
  cron.schedule('0 4 * * *', async () => {
    console.log('[Job] Starting taste analysis...');
    try {
      await analyzeTasteForActiveUsers();
      console.log('[Job] Taste analysis completed');
    } catch (error) {
      console.error('[Job] Taste analysis failed:', error);
    }
  });

  console.log('Background jobs initialized');
}

// ── Manual Job Triggers (for testing) ─────────────────────────────────────────

export async function triggerPlaylistSync(): Promise<void> {
  console.log('[Manual] Triggering playlist sync...');
  await syncAllPlaylists();
}

export async function triggerCuratorRanking(): Promise<void> {
  console.log('[Manual] Triggering curator ranking...');
  await updateAllCuratorRankings();
}

export async function triggerMoodDetection(): Promise<void> {
  console.log('[Manual] Triggering mood detection...');
  await detectMoodsForNewPlaylists();
}

export async function triggerTasteAnalysis(): Promise<void> {
  console.log('[Manual] Triggering taste analysis...');
  await analyzeTasteForActiveUsers();
}
