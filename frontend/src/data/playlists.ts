export type StreamingService = 'Spotify' | 'Apple Music' | 'YouTube Music' | 'TIDAL' | 'Amazon Music' | 'SoundCloud';

export interface ServiceLink {
  service: StreamingService;
  url: string;
  available: boolean;
}

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
  sourceService: StreamingService;
  serviceLinks: ServiceLink[];
  matchedPercentage: number;
  sampleUrl: string;
}

export interface ConverterPreset {
  id: string;
  label: string;
  url: string;
  sourceService: StreamingService;
  title: string;
  trackCount: number;
  curator: string;
  matchRate: number;
}

export const converterPresets: ConverterPreset[] = [
  {
    id: 'preset-1',
    label: 'Late Night Chill',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
    sourceService: 'Spotify',
    title: 'Late Night Chill and Focus',
    trackCount: 52,
    curator: 'Sarah Vance',
    matchRate: 98,
  },
  {
    id: 'preset-2',
    label: 'Neo Classical Study',
    url: 'https://music.apple.com/us/playlist/neo-classical-essentials/pl.u-380128',
    sourceService: 'Apple Music',
    title: 'Neo Classical Essentials',
    trackCount: 44,
    curator: 'Julian Croft',
    matchRate: 100,
  },
  {
    id: 'preset-3',
    label: 'Tokyo City Pop',
    url: 'https://music.youtube.com/playlist?list=PL4fGSI1pDJn7t8f',
    sourceService: 'YouTube Music',
    title: 'Tokyo Midnight Grooves',
    trackCount: 38,
    curator: 'Kenji Sato',
    matchRate: 96,
  },
];

export const featuredPlaylists: Playlist[] = [
  {
    id: '1',
    title: 'Late Night Vibes',
    curator: 'Sarah K.',
    rating: 9.4,
    reviewCount: 2847,
    trackCount: 64,
    coverGradient: ['#1DB954', '#064E3B'],
    coverIcon: '🌙',
    genre: 'Lo-fi / Chill',
    duration: '3h 42m',
    sourceService: 'Spotify',
    matchedPercentage: 100,
    sampleUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/late-night-vibes', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_late_night', available: true },
      { service: 'TIDAL', url: 'https://tidal.com/playlist/late-night', available: true },
    ],
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
    sourceService: 'Apple Music',
    matchedPercentage: 97,
    sampleUrl: 'https://music.apple.com/us/playlist/workout-beast-mode',
    serviceLinks: [
      { service: 'Apple Music', url: 'https://music.apple.com/us/playlist/workout-beast-mode', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/workout-beast-mode', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=workout', available: true },
    ],
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
    sourceService: 'YouTube Music',
    matchedPercentage: 98,
    sampleUrl: 'https://music.youtube.com/playlist?list=indie_gems',
    serviceLinks: [
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=indie_gems', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/indie-discoveries', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/indie-discoveries', available: true },
      { service: 'TIDAL', url: 'https://tidal.com/playlist/indie-discoveries', available: true },
    ],
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
    sourceService: 'Spotify',
    matchedPercentage: 100,
    sampleUrl: 'https://open.spotify.com/playlist/road-trip-classics',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/road-trip-classics', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/road-trip-classics', available: true },
      { service: 'Amazon Music', url: 'https://music.amazon.com/playlists/road-trip', available: true },
    ],
  },
  {
    id: '5',
    title: 'Jazz After Hours',
    curator: 'BlueNote',
    rating: 9.6,
    reviewCount: 987,
    trackCount: 38,
    coverGradient: ['#3B82F6', '#1E3A5F'],
    coverIcon: '🎷',
    genre: 'Jazz / Soul',
    duration: '2h 20m',
    sourceService: 'TIDAL',
    matchedPercentage: 99,
    sampleUrl: 'https://tidal.com/playlist/jazz-after-hours',
    serviceLinks: [
      { service: 'TIDAL', url: 'https://tidal.com/playlist/jazz-after-hours', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/jazz-after-hours', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/jazz-after-hours', available: true },
    ],
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
    sourceService: 'Apple Music',
    matchedPercentage: 95,
    sampleUrl: 'https://music.apple.com/playlist/y2k-pop',
    serviceLinks: [
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/y2k-pop', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/y2k-pop', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=y2k-pop', available: true },
    ],
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
    sourceService: 'Apple Music',
    matchedPercentage: 100,
    sampleUrl: 'https://music.apple.com/playlist/classical-masterworks',
    serviceLinks: [
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/classical-masterworks', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/classical-masterworks', available: true },
      { service: 'TIDAL', url: 'https://tidal.com/playlist/classical-masterworks', available: true },
    ],
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
    sourceService: 'Spotify',
    matchedPercentage: 99,
    sampleUrl: 'https://open.spotify.com/playlist/coding-flow',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/coding-flow', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=coding-flow', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/coding-flow', available: true },
    ],
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
    sourceService: 'Spotify',
    matchedPercentage: 98,
    sampleUrl: 'https://open.spotify.com/playlist/acoustic-morning',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/acoustic-morning', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/acoustic-morning', available: true },
      { service: 'Amazon Music', url: 'https://music.amazon.com/playlists/acoustic-morning', available: true },
    ],
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
    sourceService: 'SoundCloud',
    matchedPercentage: 94,
    sampleUrl: 'https://soundcloud.com/playlists/underground-beats',
    serviceLinks: [
      { service: 'SoundCloud', url: 'https://soundcloud.com/playlists/underground-beats', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/underground-beats', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/underground-beats', available: true },
    ],
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
    sourceService: 'YouTube Music',
    matchedPercentage: 97,
    sampleUrl: 'https://music.youtube.com/playlist?list=rainy-day',
    serviceLinks: [
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=rainy-day', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/rainy-day', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/rainy-day', available: true },
    ],
  },
];
