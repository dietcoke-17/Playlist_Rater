export type StreamingService = 'Spotify' | 'Apple Music' | 'YouTube Music' | 'TIDAL' | 'Amazon Music' | 'SoundCloud';

export interface ServiceLink {
  service: StreamingService;
  url: string;
  available: boolean;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverImage: string;
  matchRate: string;
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
  tracks: PlaylistTrack[];
  allowedPublic?: boolean;
}

export interface Curator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  genres: string[];
  rating: number;
  playlistsCount: number;
  listenersCount: string;
  allowedPublic?: boolean;
  bio?: string;
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

export const curatorsList: Curator[] = [
  {
    id: 'c-1',
    name: 'Sarah Vance',
    handle: '@sarahvmusic',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: true,
    genres: ['Lo Fi Chill', 'Downtempo', 'Beats'],
    rating: 9.8,
    playlistsCount: 14,
    listenersCount: '48.2K',
  },
  {
    id: 'c-2',
    name: 'Julian Croft',
    handle: '@croftstrings',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    verified: true,
    genres: ['Neo Classical', 'Minimalist Piano', 'Ambient Strings'],
    rating: 9.6,
    playlistsCount: 9,
    listenersCount: '31.5K',
  },
  {
    id: 'c-3',
    name: 'Kenji Sato',
    handle: '@kenjisounds',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    verified: true,
    genres: ['City Pop', 'Japanese Disco', 'Retro Funk'],
    rating: 9.7,
    playlistsCount: 12,
    listenersCount: '54.1K',
  },
  {
    id: 'c-4',
    name: 'Elena Rostova',
    handle: '@elenabeats',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    verified: true,
    genres: ['Melodic Deep House', 'Berlin Club', 'Organic Groove'],
    rating: 9.5,
    playlistsCount: 18,
    listenersCount: '72.8K',
  },
  {
    id: 'c-5',
    name: 'Kendrick Lamar',
    handle: '@kendrickcurates',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    verified: true,
    genres: ['Hip Hop', 'Soul Roots', 'Jazz Fusion'],
    rating: 9.9,
    playlistsCount: 6,
    listenersCount: '185K',
  },
  {
    id: 'c-6',
    name: 'Billie Eilish',
    handle: '@billielistens',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    verified: true,
    genres: ['Alt Pop', 'Dark Wave', 'Acoustic Intimate'],
    rating: 9.8,
    playlistsCount: 8,
    listenersCount: '210K',
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
    genre: 'Lo Fi Chill',
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
    tracks: [
      { id: 'trk-101', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We Are Dreaming', duration: '04:04', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-102', title: 'Resonance', artist: 'HOME', album: 'Odyssey', duration: '03:32', coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-103', title: 'Less than Zero', artist: 'The Weeknd', album: 'Dawn FM', duration: '02:11', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-104', title: 'Sunset Lover', artist: 'Petit Biscuit', album: 'Presence', duration: '03:58', coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-105', title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', duration: '03:17', coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-106', title: 'meant to be', artist: 'bbno$', album: 'bag or die', duration: '02:46', coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
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
    tracks: [
      { id: 'trk-201', title: 'Plastic Love', artist: 'Mariya Takeuchi', album: 'Variety', duration: '04:52', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-202', title: 'Stay With Me', artist: 'Miki Matsubara', album: 'Pocket Park', duration: '05:12', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-203', title: 'Sparkle', artist: 'Tatsuro Yamashita', album: 'For You', duration: '04:15', coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-204', title: 'Midnight Pretenders', artist: 'Tomoko Aran', album: 'Fuyu-Kukan', duration: '05:40', coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-205', title: 'Homay', artist: 'AY YOLA', album: 'Night Vision', duration: '03:12', coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
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
    tracks: [
      { id: 'trk-301', title: 'On the Nature of Daylight', artist: 'Max Richter', album: 'The Blue Notebooks', duration: '06:11', coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-302', title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', album: 'Una Mattina', duration: '05:57', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-303', title: 'Experience', artist: 'Ludovico Einaudi', album: 'In a Time Lapse', duration: '05:15', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-304', title: 'Written on the Sky', artist: 'Max Richter', album: 'Blue Notebooks 15', duration: '01:40', coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-305', title: 'Flight from the City', artist: 'Johann Johannsson', album: 'Orphee', duration: '06:31', coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
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
    tracks: [
      { id: 'trk-401', title: 'Innerbloom', artist: 'RUFUS DU SOL', album: 'Bloom', duration: '09:38', coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-402', title: 'Glue', artist: 'Bicep', album: 'Bicep', duration: '04:29', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-403', title: 'Sirens', artist: 'Monolink', album: 'Under Darkening Skies', duration: '04:41', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-404', title: 'Was ich liebe', artist: 'Rammstein', album: 'Rammstein Studio', duration: '04:20', coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-405', title: 'Underwater', artist: 'RUFUS DU SOL', album: 'Solace', duration: '05:49', coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
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
    tracks: [
      { id: 'trk-501', title: 'Holocene', artist: 'Bon Iver', album: 'Bon Iver', duration: '05:37', coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-502', title: 'Cherry Wine', artist: 'Hozier', album: 'Hozier (Special Edition)', duration: '04:00', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-503', title: 'Rivers and Roads', artist: 'The Head and The Heart', album: 'The Head and the Heart', duration: '04:44', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-504', title: 'Re: Stacks', artist: 'Bon Iver', album: 'For Emma, Forever Ago', duration: '06:41', coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
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
    tracks: [
      { id: 'trk-601', title: 'Archangel', artist: 'Burial', album: 'Untrue', duration: '03:58', coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-602', title: 'Dawn Chorus', artist: 'Jon Hopkins', album: 'Immunity', duration: '03:22', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-603', title: 'Open Eye Signal', artist: 'Jon Hopkins', album: 'Immunity', duration: '07:48', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-604', title: 'Gosh', artist: 'Jamie xx', album: 'In Colour', duration: '04:51', coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
    ],
  },
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
    tracks: [
      { id: 'trk-701', title: 'So What', artist: 'Miles Davis', album: 'Kind of Blue', duration: '09:22', coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-702', title: 'Blue in Green', artist: 'Miles Davis, Bill Evans', album: 'Kind of Blue', duration: '05:37', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-703', title: 'My Favorite Things', artist: 'John Coltrane', album: 'My Favorite Things', duration: '13:41', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
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
    tracks: [
      { id: 'trk-801', title: 'Tech Noir', artist: 'GUNSHIP', album: 'GUNSHIP', duration: '04:57', coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-802', title: 'Nightcall', artist: 'Kavinsky', album: 'OutRun', duration: '04:19', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-803', title: 'Running in the Night', artist: 'FM-84, Ollie Wride', album: 'Atlas', duration: '04:30', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
    ],
  },
  {
    id: 'sp-9',
    title: 'Hip Hop Golden Era and Modern Soul',
    curator: 'Kendrick Lamar',
    curatorHandle: '@kendrickcurates',
    rating: 9.9,
    reviewCount: 5820,
    trackCount: 60,
    coverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    genre: 'Hip Hop & Soul',
    duration: '3h 45m',
    sourceService: 'Spotify',
    matchedPercentage: 100,
    sampleUrl: 'https://open.spotify.com/playlist/hiphop-roots',
    description: 'Soulful jazz samples, rhythmic boom bap percussion, and timeless conscious lyrics.',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/hiphop-roots', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/hiphop-roots', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_hiphop', available: true },
    ],
    tracks: [
      { id: 'trk-901', title: 'DNA.', artist: 'Kendrick Lamar', album: 'DAMN.', duration: '03:05', coverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-902', title: 'Shook Ones, Pt. II', artist: 'Mobb Deep', album: 'The Infamous', duration: '05:26', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-903', title: 'Electric Relaxation', artist: 'A Tribe Called Quest', album: 'Midnight Marauders', duration: '04:03', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-904', title: 'C.R.E.A.M.', artist: 'Wu-Tang Clan', album: 'Enter The Wu-Tang (36 Chambers)', duration: '04:12', coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
    ],
  },
  {
    id: 'sp-10',
    title: 'Intimate Alt Pop and Acoustic Wave',
    curator: 'Billie Eilish',
    curatorHandle: '@billielistens',
    rating: 9.8,
    reviewCount: 4780,
    trackCount: 48,
    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
    genre: 'Alt Pop & Acoustic',
    duration: '2h 40m',
    sourceService: 'Apple Music',
    matchedPercentage: 99,
    sampleUrl: 'https://music.apple.com/playlist/intimate-pop',
    description: 'Sub bass textures, close mic whisper vocals, and melancholic indie pop melodies.',
    serviceLinks: [
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/intimate-pop', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/intimate-pop', available: true },
      { service: 'YouTube Music', url: 'https://music.youtube.com/playlist?list=PL_intimate', available: true },
    ],
    tracks: [
      { id: 'trk-1001', title: 'BIRDS OF A FEATHER', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', duration: '03:14', coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-1002', title: 'WILDFLOWER', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', duration: '04:21', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-1003', title: 'Motion Sickness', artist: 'Phoebe Bridgers', album: 'Stranger in the Alps', duration: '03:49', coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
    ],
  },
  {
    id: 'sp-11',
    title: 'Peak Hour Berlin Techno',
    curator: 'Klaus Weber',
    curatorHandle: '@klausberlin',
    rating: 9.6,
    reviewCount: 3120,
    trackCount: 55,
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    genre: 'Industrial Techno',
    duration: '4h 10m',
    sourceService: 'Spotify',
    matchedPercentage: 98,
    sampleUrl: 'https://open.spotify.com/playlist/berlin-techno',
    description: 'Relentless kicks, dark warehouse reverberation, and hypnotic analog acid modular lines.',
    serviceLinks: [
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/berlin-techno', available: true },
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/berlin-techno', available: true },
    ],
    tracks: [
      { id: 'trk-1101', title: 'Spastik', artist: 'Plastikman', album: 'Sheet One', duration: '09:18', coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-1102', title: 'Subzero', artist: 'Ben Klock', album: 'Before One EP', duration: '06:24', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
    ],
  },
  {
    id: 'sp-12',
    title: 'Afrobeats Worldwide Flow',
    curator: 'Amara Diallo',
    curatorHandle: '@amaragrooves',
    rating: 9.7,
    reviewCount: 3890,
    trackCount: 48,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
    genre: 'Afrobeats & Amapiano',
    duration: '2h 50m',
    sourceService: 'Apple Music',
    matchedPercentage: 100,
    sampleUrl: 'https://music.apple.com/playlist/afrobeats-flow',
    description: 'Infectious log drum percussion, vibrant horn melodies, and uplifting Lagos club rhythms.',
    serviceLinks: [
      { service: 'Apple Music', url: 'https://music.apple.com/playlist/afrobeats-flow', available: true },
      { service: 'Spotify', url: 'https://open.spotify.com/playlist/afrobeats-flow', available: true },
    ],
    tracks: [
      { id: 'trk-1201', title: 'Last Last', artist: 'Burna Boy', album: 'Love, Damini', duration: '02:52', coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
      { id: 'trk-1202', title: 'Calm Down', artist: 'Rema', album: 'Rave & Roses', duration: '03:39', coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=80', matchRate: '100% matched' },
    ],
  },
];

export const topLeaderboardPlaylists: Playlist[] = popularSpotifyPlaylists;

export const twitterReviews: TwitterReview[] = [
  {
    id: 'tw-1',
    name: 'Sarah Vance',
    handle: 'sarahvmusic',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verified: true,
    timestamp: '2h',
    content: 'Finally a way to share my Spotify playlists with friends who use Apple Music without manually rebuilding 50 songs. Converted 52 tracks with 100% matched metadata in literally 3 seconds. Playlitfy is incredible.',
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
    content: 'The community rating on Playlitfy is what playlist discovery always needed. A pure 1 to 10 score based on track progression rather than follower count hype. Found the best classical curation here.',
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
    verified: true,
    timestamp: '8h',
    content: 'Exported my entire Tokyo City Pop archive to YouTube Music with direct deep links. No duplicate tracks and exact artwork retained. Outstanding execution.',
    replies: 19,
    reposts: 67,
    likes: 612,
    views: '22.8K',
  },
];

const COMMUNITY_PLAYLISTS_STORAGE_KEY = 'playlitfy_community_playlists_v1';
const USER_RATINGS_STORAGE_KEY = 'playlitfy_user_ratings_v1';

export function getCommunityPlaylists(): Playlist[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(COMMUNITY_PLAYLISTS_STORAGE_KEY) : null;
    if (raw) {
      const parsed: Playlist[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  const initial = popularSpotifyPlaylists.map((p) => ({ ...p, allowedPublic: true }));
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMMUNITY_PLAYLISTS_STORAGE_KEY, JSON.stringify(initial));
    }
  } catch {}
  return initial;
}

export function saveCommunityPlaylists(list: Playlist[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMMUNITY_PLAYLISTS_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {}
}

export function publishCommunityPlaylist(newPlaylist: Playlist): Playlist[] {
  const current = getCommunityPlaylists();
  const updated = [{ ...newPlaylist, allowedPublic: true }, ...current];
  saveCommunityPlaylists(updated);
  return updated;
}

export function getUserRatings(): Record<string, number> {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(USER_RATINGS_STORAGE_KEY) : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function rateCommunityPlaylist(playlistId: string, score: number): { updatedPlaylist?: Playlist; userRatings: Record<string, number> } {
  const ratings = getUserRatings();
  ratings[playlistId] = score;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    }
  } catch {}

  const current = getCommunityPlaylists();
  const idx = current.findIndex((p) => p.id === playlistId);
  let updatedPlaylist: Playlist | undefined;

  if (idx !== -1) {
    const item = current[idx];
    const prevCount = item.reviewCount || 100;
    const prevRating = item.rating || 9.0;
    const newRating = Number(((prevRating * prevCount + score) / (prevCount + 1)).toFixed(1));
    updatedPlaylist = {
      ...item,
      rating: newRating,
      reviewCount: prevCount + 1,
    };
    current[idx] = updatedPlaylist;
    saveCommunityPlaylists(current);
  }

  return { updatedPlaylist, userRatings: ratings };
}

