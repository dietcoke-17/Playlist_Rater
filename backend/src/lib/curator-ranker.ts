/**
 * Curator ranking algorithm.
 *
 * Calculates curator quality scores based on:
 *  - Engagement score (followers, ratings, playlist views)
 *  - Consistency score (quality across all playlists)
 *  - Quality score (avg rating, review count)
 *
 * Functions:
 *  - calculateCuratorScore(userId) - Calculate overall curator score
 *  - calculateEngagementScore(userId) - Based on followers, ratings
 *  - calculateConsistencyScore(userId) - Quality consistency
 *  - determineFollowerTier(followerCount) - micro/mid/macro/mega
 *  - updateAllCuratorRankings() - Batch update all curators
 */

import { supabase } from './supabase';

export interface CuratorRanking {
  user_id: string;
  quality_score: number;
  engagement_score: number;
  consistency_score: number;
  total_score: number;
  follower_tier: string;
  specialty_genres: string[];
}

// ── Follower Tier Classification ───────────────────────────────────────────────
export function determineFollowerTier(followerCount: number): string {
  if (followerCount < 1000) return 'micro';
  if (followerCount < 10000) return 'mid';
  if (followerCount < 100000) return 'macro';
  return 'mega';
}

// ── Calculate Engagement Score ─────────────────────────────────────────────────
export async function calculateEngagementScore(userId: string): Promise<number> {
  // Get user's playlists
  const { data: playlists, error } = await supabase
    .from('playlists')
    .select('followers_count, review_count, avg_rating')
    .eq('user_id', userId)
    .eq('is_curator_approved', true);

  if (error || !playlists || playlists.length === 0) {
    return 0;
  }

  // Calculate engagement metrics
  const totalFollowers = playlists.reduce((sum, p) => sum + (p.followers_count || 0), 0);
  const totalReviews = playlists.reduce((sum, p) => sum + (p.review_count || 0), 0);
  const avgRating = playlists.reduce((sum, p) => sum + (p.avg_rating || 0), 0) / playlists.length;

  // Normalize and combine (0-1 scale)
  const followerScore = Math.min(totalFollowers / 100000, 1); // 100k followers = 1.0
  const reviewScore = Math.min(totalReviews / 1000, 1); // 1000 reviews = 1.0
  const ratingScore = avgRating / 10; // 10 rating = 1.0

  // Weighted average
  return (followerScore * 0.4 + reviewScore * 0.3 + ratingScore * 0.3);
}

// ── Calculate Consistency Score ───────────────────────────────────────────────
export async function calculateConsistencyScore(userId: string): Promise<number> {
  const { data: playlists, error } = await supabase
    .from('playlists')
    .select('avg_rating, review_count')
    .eq('user_id', userId)
    .eq('is_curator_approved', true);

  if (error || !playlists || playlists.length === 0) {
    return 0;
  }

  if (playlists.length === 1) {
    return 1; // Single playlist is consistent by default
  }

  // Calculate standard deviation of ratings
  const ratings = playlists.map((p) => p.avg_rating || 0);
  const mean = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  const variance = ratings.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ratings.length;
  const stdDev = Math.sqrt(variance);

  // Lower standard deviation = higher consistency
  // StdDev of 0 = 1.0, StdDev of 5 = 0.0
  const consistencyScore = Math.max(0, 1 - stdDev / 5);

  return consistencyScore;
}

// ── Calculate Quality Score ────────────────────────────────────────────────────
export async function calculateQualityScore(userId: string): Promise<number> {
  const { data: playlists, error } = await supabase
    .from('playlists')
    .select('avg_rating, review_count')
    .eq('user_id', userId)
    .eq('is_curator_approved', true);

  if (error || !playlists || playlists.length === 0) {
    return 0;
  }

  // Average rating weighted by review count
  const totalWeight = playlists.reduce((sum, p) => sum + (p.review_count || 0), 0);
  if (totalWeight === 0) {
    return 0;
  }

  const weightedRating = playlists.reduce(
    (sum, p) => sum + (p.avg_rating || 0) * (p.review_count || 0),
    0
  ) / totalWeight;

  // Normalize to 0-1
  return weightedRating / 10;
}

// ── Calculate Specialty Genres ───────────────────────────────────────────────────
export async function calculateSpecialtyGenres(userId: string): Promise<string[]> {
  const { data: playlists, error } = await supabase
    .from('playlists')
    .select('genre')
    .eq('user_id', userId)
    .eq('is_curator_approved', true)
    .not('genre', 'is', null);

  if (error || !playlists || playlists.length === 0) {
    return [];
  }

  // Count genre occurrences
  const genreCount: Record<string, number> = {};
  playlists.forEach((p) => {
    if (p.genre) {
      genreCount[p.genre] = (genreCount[p.genre] || 0) + 1;
    }
  });

  // Return top 3 genres (at least 30% of playlists)
  const sortedGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count / playlists.length >= 0.3)
    .slice(0, 3)
    .map(([genre]) => genre);

  return sortedGenres;
}

// ── Calculate Overall Curator Score ────────────────────────────────────────────
export async function calculateCuratorScore(userId: string): Promise<CuratorRanking> {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('followers_count')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    throw new Error('User not found');
  }

  const [qualityScore, engagementScore, consistencyScore, specialtyGenres] = await Promise.all([
    calculateQualityScore(userId),
    calculateEngagementScore(userId),
    calculateConsistencyScore(userId),
    calculateSpecialtyGenres(userId),
  ]);

  // Total score = weighted average
  const totalScore = qualityScore * 0.4 + engagementScore * 0.4 + consistencyScore * 0.2;

  const followerTier = determineFollowerTier(user.followers_count || 0);

  return {
    user_id: userId,
    quality_score: Math.round(qualityScore * 100) / 100,
    engagement_score: Math.round(engagementScore * 100) / 100,
    consistency_score: Math.round(consistencyScore * 100) / 100,
    total_score: Math.round(totalScore * 100) / 100,
    follower_tier: followerTier,
    specialty_genres: specialtyGenres,
  };
}

// ── Update All Curator Rankings ───────────────────────────────────────────────
export async function updateAllCuratorRankings(): Promise<void> {
  // Get all public curators
  const { data: users, error } = await supabase
    .from('users')
    .select('id')
    .eq('is_curator_public', true);

  if (error || !users) {
    console.error('Failed to fetch curators:', error);
    return;
  }

  console.log(`Updating rankings for ${users.length} curators...`);

  // Calculate and update rankings for each curator
  for (const user of users) {
    try {
      const ranking = await calculateCuratorScore(user.id);

      await supabase.from('curator_rankings').upsert({
        user_id: ranking.user_id,
        quality_score: ranking.quality_score,
        engagement_score: ranking.engagement_score,
        consistency_score: ranking.consistency_score,
        total_score: ranking.total_score,
        follower_tier: ranking.follower_tier,
        specialty_genres: ranking.specialty_genres,
        last_calculated_at: new Date().toISOString(),
      });

      // Update is_top_tier in playlists
      if (ranking.total_score >= 0.8) {
        await supabase
          .from('playlists')
          .update({ is_top_tier: true })
          .eq('user_id', user.id);
      }
    } catch (err) {
      console.error(`Failed to calculate ranking for user ${user.id}:`, err);
    }
  }

  console.log('Curator rankings updated successfully');
}
