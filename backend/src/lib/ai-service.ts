/**
 * AI Service integration for mood detection and taste analysis.
 *
 * Uses OpenAI API (or can be configured for Anthropic Claude) to:
 *  - Detect moods from playlists
 *  - Analyze playlist characteristics
 *  - Generate taste insights from listening history
 *  - Recommend playlists based on mood and taste
 *
 * Required environment variables:
 *   OPENAI_API_KEY (or ANTHROPIC_API_KEY)
 */

import OpenAI from 'openai';
import * as functions from 'firebase-functions';

const cfg = functions.config();

const OPENAI_API_KEY: string =
  process.env.OPENAI_API_KEY ?? cfg.openai?.api_key ?? '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// ── Mood Detection ───────────────────────────────────────────────────────────
export interface MoodDetection {
  moods: Array<{
    name: string;
    confidence: number;
  }>;
}

export async function detectMoodFromPlaylist(playlist: {
  title: string;
  description?: string;
  genre?: string;
  tracks?: Array<{ title: string; artist: string }>;
}): Promise<MoodDetection> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using fallback');
    return fallbackMoodDetection(playlist);
  }

  const trackInfo = playlist.tracks?.slice(0, 10).map((t) => `${t.title} by ${t.artist}`).join(', ') || '';

  const prompt = `Analyze this music playlist and determine the primary moods (max 3) from these options: chill, energetic, focus, romantic, sad, happy, workout, sleep, party, nostalgic.

Playlist:
Title: ${playlist.title}
Description: ${playlist.description || 'N/A'}
Genre: ${playlist.genre || 'N/A'}
Top tracks: ${trackInfo}

Return only a JSON object with this structure:
{
  "moods": [
    {"name": "mood_name", "confidence": 0.0-1.0}
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a music mood analysis expert. Analyze playlists and return JSON with mood names and confidence scores.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return fallbackMoodDetection(playlist);
    }

    const result = JSON.parse(content) as MoodDetection;
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return fallbackMoodDetection(playlist);
  }
}

// ── Fallback Mood Detection (rule-based) ───────────────────────────────────────
function fallbackMoodDetection(playlist: {
  title: string;
  description?: string;
  genre?: string;
}): MoodDetection {
  const text = `${playlist.title} ${playlist.description || ''} ${playlist.genre || ''}`.toLowerCase();

  const moodKeywords: Record<string, string[]> = {
    chill: ['chill', 'relax', 'calm', 'peaceful', 'ambient', 'lo-fi', 'study', 'focus'],
    energetic: ['energetic', 'upbeat', 'pump', 'hype', 'intense', 'power'],
    focus: ['focus', 'study', 'work', 'concentrate', 'productivity'],
    romantic: ['love', 'romantic', 'valentine', 'date', 'intimate'],
    sad: ['sad', 'melancholy', 'depress', 'cry', 'breakup', 'emotional'],
    happy: ['happy', 'joy', 'uplifting', 'positive', 'feel good', 'smile'],
    workout: ['workout', 'gym', 'fitness', 'exercise', 'run', 'cardio'],
    sleep: ['sleep', 'lullaby', 'bedtime', 'relax', 'meditation'],
    party: ['party', 'dance', 'club', 'celebration', 'festival'],
    nostalgic: ['retro', 'old school', 'classic', 'throwback', 'nostalgic'],
  };

  const detectedMoods: Array<{ name: string; confidence: number }> = [];

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    const matchCount = keywords.filter((kw) => text.includes(kw)).length;
    if (matchCount > 0) {
      detectedMoods.push({
        name: mood,
        confidence: Math.min(matchCount * 0.3, 0.9),
      });
    }
  }

  // If no moods detected, default to chill
  if (detectedMoods.length === 0) {
    detectedMoods.push({ name: 'chill', confidence: 0.5 });
  }

  // Sort by confidence and return top 3
  return {
    moods: detectedMoods.sort((a, b) => b.confidence - a.confidence).slice(0, 3),
  };
}

// ── Analyze Playlist Characteristics ───────────────────────────────────────────
export interface PlaylistCharacteristics {
  energy: number;
  tempo: 'slow' | 'medium' | 'fast';
  primary_mood: string;
  genre: string;
}

export async function analyzePlaylistCharacteristics(playlist: {
  title: string;
  description?: string;
  genre?: string;
  tracks?: Array<{ title: string; artist: string }>;
}): Promise<PlaylistCharacteristics> {
  const moodDetection = await detectMoodFromPlaylist(playlist);
  const primaryMood = moodDetection.moods[0]?.name || 'chill';

  // Determine tempo based on mood
  const tempoByMood: Record<string, 'slow' | 'medium' | 'fast'> = {
    chill: 'slow',
    energetic: 'fast',
    focus: 'medium',
    romantic: 'slow',
    sad: 'slow',
    happy: 'medium',
    workout: 'fast',
    sleep: 'slow',
    party: 'fast',
    nostalgic: 'medium',
  };

  const tempo = tempoByMood[primaryMood] || 'medium';

  // Determine energy based on mood
  const energyByMood: Record<string, number> = {
    chill: 0.3,
    energetic: 0.9,
    focus: 0.5,
    romantic: 0.4,
    sad: 0.2,
    happy: 0.7,
    workout: 0.95,
    sleep: 0.1,
    party: 0.85,
    nostalgic: 0.5,
  };

  const energy = energyByMood[primaryMood] || 0.5;

  return {
    energy,
    tempo,
    primary_mood: primaryMood,
    genre: playlist.genre || 'Unknown',
  };
}

// ── Generate Taste Insights ───────────────────────────────────────────────────
export interface TasteInsights {
  favorite_genres: string[];
  favorite_artists: string[];
  preferred_moods: string[];
  listening_pattern: string;
}

export async function generateTasteInsights(listeningHistory: Array<{
  playlist_title: string;
  genre?: string;
  platform: string;
  played_at: string;
}>): Promise<TasteInsights> {
  if (!OPENAI_API_KEY) {
    return fallbackTasteInsights(listeningHistory);
  }

  const historySummary = listeningHistory
    .slice(0, 50)
    .map((h) => `${h.playlist_title} (${h.genre || 'Unknown'}, ${h.platform})`)
    .join('\n');

  const prompt = `Analyze this user's listening history and extract their music taste preferences.

Listening history:
${historySummary}

Return only a JSON object with this structure:
{
  "favorite_genres": ["genre1", "genre2"],
  "favorite_artists": ["artist1", "artist2"],
  "preferred_moods": ["mood1", "mood2"],
  "listening_pattern": "description of when/how they listen"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a music taste analysis expert. Analyze listening history and return JSON with taste insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return fallbackTasteInsights(listeningHistory);
    }

    const result = JSON.parse(content) as TasteInsights;
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return fallbackTasteInsights(listeningHistory);
  }
}

// ── Fallback Taste Insights (rule-based) ───────────────────────────────────────
function fallbackTasteInsights(listeningHistory: Array<{
  playlist_title: string;
  genre?: string;
  platform: string;
}>): TasteInsights {
  // Count genres
  const genreCount: Record<string, number> = {};
  listeningHistory.forEach((h) => {
    if (h.genre) {
      genreCount[h.genre] = (genreCount[h.genre] || 0) + 1;
    }
  });

  const favoriteGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  return {
    favorite_genres: favoriteGenres,
    favorite_artists: [],
    preferred_moods: ['chill'],
    listening_pattern: 'Varied listening across genres',
  };
}

// ── Recommend Playlists by Mood ───────────────────────────────────────────────
export async function recommendPlaylistsByMood(
  mood: string,
  userTaste?: {
    favorite_genres?: string[];
    preferred_moods?: string[];
  }
): Promise<{ playlist_ids: string[]; reasoning: string }> {
  if (!OPENAI_API_KEY) {
    return {
      playlist_ids: [],
      reasoning: 'AI recommendations not available',
    };
  }

  const prompt = `Recommend playlists for a user who wants ${mood} music.

User taste preferences:
- Favorite genres: ${userTaste?.favorite_genres?.join(', ') || 'Not specified'}
- Preferred moods: ${userTaste?.preferred_moods?.join(', ') || 'Not specified'}

Since I don't have access to the playlist database, provide a reasoning for what kind of playlists would be good for this user.

Return only a JSON object with this structure:
{
  "reasoning": "explanation of what playlists would be recommended"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a music recommendation expert. Provide reasoning for playlist recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return {
        playlist_ids: [],
        reasoning: 'Unable to generate recommendations',
      };
    }

    const result = JSON.parse(content) as { reasoning: string };
    return {
      playlist_ids: [],
      reasoning: result.reasoning,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      playlist_ids: [],
      reasoning: 'Error generating recommendations',
    };
  }
}
