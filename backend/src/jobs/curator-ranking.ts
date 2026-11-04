/**
 * Curator ranking background job.
 *
 * Calculates and updates curator rankings:
 *  - Quality score
 *  - Engagement score
 *  - Consistency score
 *  - Total score
 *  - Follower tier
 *  - Specialty genres
 */

import { updateAllCuratorRankings } from '../lib/curator-ranker';

export { updateAllCuratorRankings };

export async function runCuratorRankingJob(): Promise<void> {
  console.log('Running curator ranking job...');
  await updateAllCuratorRankings();
  console.log('Curator ranking job completed');
}
