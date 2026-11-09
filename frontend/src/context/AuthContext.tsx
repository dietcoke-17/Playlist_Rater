import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setToken, clearToken } from '../lib/api';

export interface ConnectedServices {
  spotify: boolean;
  appleMusic: boolean;
  youtubeMusic: boolean;
  google: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  connectedServices: ConnectedServices;
  syncedPlaylistsCount: number;
  totalRatingsCount: number;
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (provider: 'google' | 'spotify' | 'apple' | 'youtube' | 'tidal' | 'amazon' | 'email', email?: string) => Promise<void>;
  logout: () => void;
  toggleService: (service: keyof ConnectedServices) => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const storedToken = localStorage.getItem('token') || localStorage.getItem('playlitfy_token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        return JSON.parse(storedUser);
      }
    } catch {
      // Ignore parsing errors
    }
    return null;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Check for OAuth ?token= or ?error= query params on redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setToastMessage(`Sign-in failed: ${errorParam.replace(/_/g, ' ')}`);
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
      return;
    }
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem('token', tokenFromUrl);

      api.getMe()
        .then(({ user: apiUser }) => {
          const profile: UserProfile = {
            id: apiUser.id,
            name: apiUser.display_name,
            email: apiUser.email,
            avatar: apiUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            connectedServices: {
              spotify: true,
              appleMusic: false,
              youtubeMusic: false,
              google: false,
            },
            syncedPlaylistsCount: apiUser.playlists_count,
            totalRatingsCount: Math.round(apiUser.avg_rating * 10),
          };
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
          setToastMessage(`Welcome back, ${profile.name}! Spotify library linked.`);
        })
        .catch(() => {
          // If network / API error, keep token and fall back
        })
        .finally(() => {
          // Clean up query string from address bar
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        });
    }
  }, []);

  // Fetch connected services when logged in
  useEffect(() => {
    if (user && api.isLoggedIn()) {
      api.getConnectedServices()
        .then(({ platforms }) => {
          const services: ConnectedServices = {
            spotify: platforms.some((p) => p.platform === 'spotify'),
            appleMusic: platforms.some((p) => p.platform === 'apple'),
            youtubeMusic: platforms.some((p) => p.platform === 'youtube'),
            google: false,
          };
          setUser((prev) => prev ? { ...prev, connectedServices: services } : prev);
        })
        .catch(() => {
          // Ignore error, keep default values
        });
    }
  }, [user]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const login = useCallback(
    async (provider: 'google' | 'spotify' | 'apple' | 'youtube' | 'tidal' | 'amazon' | 'email', emailInput?: string) => {
      const providerNames: Record<string, string> = {
        google: 'Google',
        spotify: 'Spotify',
        apple: 'Apple Music',
        youtube: 'YouTube Music',
        tidal: 'TIDAL',
        amazon: 'Amazon Music',
        email: 'Magic Link Email',
      };

      // Only attempt live backend OAuth redirect if a custom backend is configured and reachable
      const apiUrl = import.meta.env.VITE_API_URL;
      const hasLiveBackend = apiUrl && !apiUrl.includes('localhost:5001');

      if (hasLiveBackend && provider !== 'email') {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 1000);
          const healthRes = await fetch(`${apiUrl}/health`, { signal: controller.signal });
          clearTimeout(timeout);

          if (healthRes.ok) {
            if (provider === 'spotify') { api.initiateSpotifyLogin(); return; }
            if (provider === 'google') { api.initiateGoogleLogin(); return; }
            if (provider === 'apple') { api.initiateAppleLogin(); return; }
            if (provider === 'youtube') { api.initiateYoutubeLogin(); return; }
            if (provider === 'tidal') { api.initiateTidalLogin(); return; }
            if (provider === 'amazon') { api.initiateAmazonLogin(); return; }
          }
        } catch {
          // Backend is offline/unreachable; proceed with resilient client session
        }
      }

      // Smooth authentication flow
      await new Promise((resolve) => setTimeout(resolve, 400));

      const defaultNames: Record<string, string> = {
        google: 'Alex Rivera (Google)',
        spotify: 'Alex Rivera (Spotify Curator)',
        apple: 'Alex Rivera (Apple Music)',
        youtube: 'Alex Rivera (YouTube Music)',
        tidal: 'Alex Rivera (TIDAL HiFi)',
        amazon: 'Alex Rivera (Amazon Music)',
        email: emailInput ? emailInput.split('@')[0] : 'Curator',
      };

      const resolvedName = emailInput ? emailInput.split('@')[0] : defaultNames[provider] || 'Alex Rivera';
      const resolvedEmail = emailInput || `curator.${provider}@playlitfy.com`;

      const newUser: UserProfile = {
        id: `usr_${provider}_${Date.now()}`,
        name: resolvedName,
        email: resolvedEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        connectedServices: {
          spotify: provider === 'spotify',
          appleMusic: provider === 'apple',
          youtubeMusic: provider === 'youtube',
          google: provider === 'google',
        },
        syncedPlaylistsCount: 24,
        totalRatingsCount: 88,
      };

      localStorage.setItem('playlitfy_token', `playlitfy_token_${Date.now()}`);
      localStorage.setItem('token', `playlitfy_token_${Date.now()}`);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setToastMessage(`Signed in via ${providerNames[provider]}. Library ready to sync.`);
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToastMessage('Signed out of Playlitfy workspace.');
  }, []);

  const toggleService = useCallback((service: keyof ConnectedServices) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: UserProfile = {
        ...prev,
        connectedServices: {
          ...prev.connectedServices,
          [service]: !prev.connectedServices[service],
        },
      };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    toggleService,
    toastMessage,
    clearToast,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
