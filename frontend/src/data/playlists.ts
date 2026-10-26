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
  curatorHandle: string;
  rating: number;
  reviewCount: number;
  trackCount: number;
  coverImage: string;
  genre: string;
  duration: string;
  sourceService: StreamingService;
  serviceLinks: ServiceLink[];
  matchedPercentage: number;
  sampleUrl: string;
  description: string;
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
  coverImage: string;
}

export interface TwitterReview {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  timestamp: string;
  content: string;
  replies: number;
  reposts: number;
  likes: number;
  views: string;
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
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-4',
    label: 'Deep House Therapy',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXa2PvUikemBt',
    sourceService: 'Spotify',
    title: 'Deep House Sunset Session',
    trackCount: 68,
    curator: 'Elena Rostova',
    matchRate: 99,
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  },
];

export const popularSpotifyPlaylists: Playlist[] = [
  {
    id: 'sp-1',
    title: 'Late Night Chill and Focus',
    curator: 'Sarah Vance',
    curatorHandle: '@sarahvmusic',
    rating: 9.8,
    reviewCount: 3420,
    trackCount: 52,
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    genre: 'Lo-Fi Chill',
    duration: '2h 45m',
    sourceService: 'Spotify',
    matchedPercentage: 100,
    sampleUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
    description: 'Downtempo beats and warm vinyl textures for coding and midnight focus sessions.',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/late-night-chill', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_chill', available: true },
    ],
  },
  {
    id: 'sp-2',
    title: 'Tokyo Midnight Grooves',
    curator: 'Kenji Sato',
    curatorHandle: '@kenjisounds',
    rating: 9.7,
    reviewCount: 2890,
    trackCount: 38,
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    genre: 'City Pop & Funk',
    duration: '2h 15m',
    sourceService: 'YouTube Music',
    matchedPercentage: 98,
    sampleUrl: 'https://music.youtube.com/playlist?list=PL4fGSI1pDJn7t8f',
    description: 'Lush 80s synthesizers and sparkling Japanese disco city grooves remastered in high resolution.',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/tokyo-grooves', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/tokyo-grooves', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL4fGSI1pDJn7t8f', available: true },
    ],
  },
  {
    id: 'sp-3',
    title: 'Neo Classical Essentials',
    curator: 'Julian Croft',
    curatorHandle: '@croftstrings',
    rating: 9.6,
    reviewCount: 1940,
    trackCount: 44,
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    genre: 'Neo Classical',
    duration: '3h 10m',
    sourceService: 'Apple Music',
    matchedPercentage: 100,
    sampleUrl: 'https://music.apple.com/us/playlist/neo-classical-essentials/pl.u-380128',
    description: 'Intimate felt piano and modern minimalist strings curated for deep concentration.',
    serviceLinks: [
      { service: 'Apple Music', url: 'https://music.apple.com/us/playlist/neo-classical-essentials/pl.u-380128', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/neo-classical', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_strings', available: true },
    ],
  },
  {
    id: 'sp-4',
    title: 'Deep House Sunset Session',
    curator: 'Elena Rostova',
    curatorHandle: '@elenabeats',
    rating: 9.5,
    reviewCount: 4120,
    trackCount: 68,
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    genre: 'Melodic Deep House',
    duration: '4h 20m',
    sourceService: 'Spotify',
    matchedPercentage: 99,
    sampleUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXa2PvUikemBt',
    description: 'Organic percussion and hypnotic basslines from Berlin, Ibiza, and Tulum underground clubs.',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/37i9dQZF1DXa2PvUikemBt', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/deep-house-sunset', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_deephouse', available: true },
    ],
  },
  {
    id: 'sp-5',
    title: 'Golden Hour Acoustic',
    curator: 'Marcus Vance',
    curatorHandle: '@marcusacoustic',
    rating: 9.5,
    reviewCount: 2210,
    trackCount: 46,
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    genre: 'Acoustic & Folk',
    duration: '2h 50m',
    sourceService: 'Apple Music',
    matchedPercentage: 97,
    sampleUrl: 'https://music.apple.com/playlist/golden-hour-acoustic',
    description: 'Warm fingerpicked acoustic guitars and soulful vocal harmonies recorded live in studio.',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/golden-acoustic', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/golden-hour-acoustic', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_acoustic', available: true },
    ],
  },
  {
    id: 'sp-6',
    title: 'Underground Electronic Curation',
    curator: 'David Chen',
    curatorHandle: '@dchensound',
    rating: 9.4,
    reviewCount: 1870,
    trackCount: 54,
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    genre: 'Leftfield & Ambient',
    duration: '3h 35m',
    sourceService: 'Spotify',
    matchedPercentage: 99,
    sampleUrl: 'https://open.spotify.com/playlist/underground-electronic',
    description: 'Textural modular synths, UK garage rhythms, and experimental electronica from boutique labels.',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/underground-electronic', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/underground-electronic', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_underground', available: true },
    ],
  },
];

export const topLeaderboardPlaylists: Playlist[] = [
  ...popularSpotifyPlaylists,
  {
    id: 'sp-7',
    title: 'Rainy Night Jazz Club',
    curator: 'Miles Morgan',
    curatorHandle: '@milesjazz',
    rating: 9.4,
    reviewCount: 1650,
    trackCount: 42,
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
    genre: 'Midnight Jazz',
    duration: '2h 55m',
    sourceService: 'Spotify',
    matchedPercentage: 99,
    sampleUrl: 'https://open.spotify.com/playlist/rainy-jazz',
    description: 'Smoky horns, upright bass solos, and vintage vinyl recordings from legendary blue note vaults.',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/rainy-jazz', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/rainy-jazz', available: true },
    ],
  },
  {
    id: 'sp-8',
    title: 'Synthesizer Odyssey',
    curator: 'Astral Shift',
    curatorHandle: '@astralcurator',
    rating: 9.3,
    reviewCount: 1390,
    trackCount: 36,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    genre: 'Synthwave & Retrowave',
    duration: '2h 20m',
    sourceService: 'YouTube Music',
    matchedPercentage: 96,
    sampleUrl: 'https://music.youtube.com/playlist?list=PL_synthwave',
    description: 'Analog synthesizer arpeggios, driving drum machines, and cinematic cyberpunk soundscapes.',
    serviceLinks: [
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_synthwave', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/synth-odyssey', available: true },
    ],
  },
];

export const twitterReviews: TwitterReview[] = [
  {
    id: 'tw-1',
    name: 'Sarah Vance',
    handle: 'sarahvmusic',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verified: true,
    timestamp: '2h',
    content: 'Finally a way to share my Spotify playlists with friends who use Apple Music without manually rebuilding 50 songs. Converted 52 tracks with 100% matched metadata in literally 3 seconds. PlaylistIQ is incredible.',
    replies: 42,
    reposts: 189,
    likes: 1420,
    views: '48.2K',
  },
  {
    id: 'tw-2',
    name: 'Julian Croft',
    handle: 'croftstrings',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verified: true,
    timestamp: '5h',
    content: 'The community rating on PlaylistIQ is what playlist discovery always needed. A pure 1 to 10 score based on track progression rather than follower count hype. Found the best classical curation here.',
    replies: 28,
    reposts: 94,
    likes: 874,
    views: '31.5K',
  },
  {
    id: 'tw-3',
    name: 'Kenji Sato',
    handle: 'kenjisounds',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    verified: false,
    timestamp: '1d',
    content: 'Moved my entire 80s Japanese City Pop library from YouTube Music into Spotify and Apple Music in one click. Zero track duplicates and the ISRC matching resolved every rare single perfectly.',
    replies: 19,
    reposts: 73,
    likes: 628,
    views: '24.1K',
  },
  {
    id: 'tw-4',
    name: 'Elena Rostova',
    handle: 'elenabeats',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    verified: true,
    timestamp: '2d',
    content: 'Being able to rate track flow and view community reviews across music services is such a breath of fresh air. No platform lock in anymore. Any curator can build a cross platform following.',
    replies: 35,
    reposts: 112,
    likes: 1105,
    views: '39.8K',
  },
];
