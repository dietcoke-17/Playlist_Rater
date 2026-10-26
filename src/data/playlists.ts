export interface Playlist {
  id: string;
  title: string;
  curator: string;
  rating: number;
  reviewCount: number;
  trackCount: number;
  coverGradient: [string, string];
  coverIcon: string;
  genre: string;
  duration: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export const featuredPlaylists: Playlist[] = [
  {
    id: '1',
    title: 'Late Night Vibes',
    curator: 'Sarah K.',
    rating: 9.2,
    reviewCount: 2847,
    trackCount: 64,
    coverGradient: ['#1DB954', '#064E3B'],
    coverIcon: '🌙',
    genre: 'Lo-fi / Chill',
    duration: '3h 42m',
  },
  {
    id: '2',
    title: 'Workout Beast Mode',
    curator: 'FitTracks',
    rating: 8.8,
    reviewCount: 5132,
    trackCount: 80,
    coverGradient: ['#FF6B35', '#B91C1C'],
    coverIcon: '🔥',
    genre: 'Hip-Hop / EDM',
    duration: '4h 15m',
  },
  {
    id: '3',
    title: 'Indie Discoveries',
    curator: 'MusicNerd42',
    rating: 9.5,
    reviewCount: 1203,
    trackCount: 45,
    coverGradient: ['#A855F7', '#4C1D95'],
    coverIcon: '💎',
    genre: 'Indie / Alt',
    duration: '2h 58m',
  },
  {
    id: '4',
    title: 'Road Trip Classics',
    curator: 'DriveTunes',
    rating: 8.6,
    reviewCount: 3891,
    trackCount: 72,
    coverGradient: ['#FACC15', '#92400E'],
    coverIcon: '🚗',
    genre: 'Rock / Pop',
    duration: '4h 30m',
  },
  {
    id: '5',
    title: 'Jazz After Hours',
    curator: 'BlueNote',
    rating: 9.4,
    reviewCount: 987,
    trackCount: 38,
    coverGradient: ['#3B82F6', '#1E3A5F'],
    coverIcon: '🎷',
    genre: 'Jazz / Soul',
    duration: '2h 20m',
  },
  {
    id: '6',
    title: 'Y2K Pop Revival',
    curator: 'Nostalgic90s',
    rating: 8.9,
    reviewCount: 4210,
    trackCount: 55,
    coverGradient: ['#EC4899', '#831843'],
    coverIcon: '✨',
    genre: 'Pop / Dance',
    duration: '3h 10m',
  },
];

export const topRatedPlaylists: Playlist[] = [
  {
    id: '10',
    title: 'Classical Masterworks',
    curator: 'Philharmonic',
    rating: 9.7,
    reviewCount: 6420,
    trackCount: 32,
    coverGradient: ['#D4AF37', '#8B6914'],
    coverIcon: '🎻',
    genre: 'Classical',
    duration: '5h 12m',
  },
  {
    id: '11',
    title: 'Coding Flow State',
    curator: 'DevBeats',
    rating: 9.6,
    reviewCount: 8933,
    trackCount: 120,
    coverGradient: ['#06B6D4', '#155E75'],
    coverIcon: '💻',
    genre: 'Ambient / Electronic',
    duration: '6h 45m',
  },
  {
    id: '12',
    title: 'Acoustic Morning',
    curator: 'SunriseChords',
    rating: 9.5,
    reviewCount: 3201,
    trackCount: 42,
    coverGradient: ['#F59E0B', '#78350F'],
    coverIcon: '☀️',
    genre: 'Acoustic / Folk',
    duration: '2h 48m',
  },
  {
    id: '13',
    title: 'Underground Beats',
    curator: 'BassDrop',
    rating: 9.4,
    reviewCount: 2156,
    trackCount: 88,
    coverGradient: ['#EF4444', '#7F1D1D'],
    coverIcon: '🎧',
    genre: 'Techno / House',
    duration: '5h 30m',
  },
  {
    id: '14',
    title: 'Rainy Day Melancholy',
    curator: 'CloudyMood',
    rating: 9.3,
    reviewCount: 4782,
    trackCount: 50,
    coverGradient: ['#6366F1', '#312E81'],
    coverIcon: '🌧️',
    genre: 'Dream Pop / Shoegaze',
    duration: '3h 15m',
  },
];

export const features: Feature[] = [
  {
    icon: '⭐',
    title: 'Rate any playlist 1 to 10',
    description: 'Score playlists the way film fans score movies. Your vote feeds the global ranking, not the streaming algorithm.',
    color: '#FFD700',
  },
  {
    icon: '🔍',
    title: 'Find what the algorithm misses',
    description: 'Browse community-ranked playlists by genre, mood, and score. No editorial curation, no hidden agenda.',
    color: '#3EC96A',
  },
  {
    icon: '📊',
    title: 'See inside any playlist',
    description: 'Tempo, energy, danceability, genre split — real audio metrics, not just vibes.',
    color: '#3B82F6',
  },
  {
    icon: '🏆',
    title: 'Compete on the leaderboard',
    description: 'Top 250 playlists, genre charts, and a Hall of Fame for scores above 9.0. Submit yours and see where you rank.',
    color: '#A855F7',
  },
  {
    icon: '👥',
    title: 'Follow tastemakers',
    description: 'See what the people with the best scores are listening to this week. Build your own following as a curator.',
    color: '#EC4899',
  },
  {
    icon: '🎯',
    title: 'Match your mood',
    description: 'Tell PlaylistIQ how you feel and it surfaces the highest-rated playlist for that exact moment.',
    color: '#FF6B35',
  },
];
