import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Music,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

interface LoginPageProps {
  onBack: () => void;
}

export default function LoginPage({ onBack }: LoginPageProps) {
  const { user, isLoggedIn, login, logout, toggleService, toastMessage } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'providers' | 'email'>('providers');

  const handleProviderLogin = async (provider: 'google' | 'spotify' | 'apple' | 'youtube') => {
    setIsSubmitting(true);
    try {
      await login(provider);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubmitting(true);
    try {
      await login('email', emailInput.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wallpeace-login-root">
      {/* Background contrast overlay & grid */}
      <div className="wallpeace-login-overlay" aria-hidden="true" />
      <div className="wallpeace-login-grid" aria-hidden="true" />

      {/* Floating ambient blurred orbs */}
      <div className="blob blob-animate-slow wallpeace-login-blob-1" aria-hidden="true" />
      <div className="blob blob-animate-reverse wallpeace-login-blob-2" aria-hidden="true" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="wallpeace-login-toast" role="status" aria-live="polite">
          <CheckCircle2 size={16} className="wallpeace-toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Centered Auth Window */}
      <div className="wallpeace-login-container">
        <div className="wallpeace-login-card">
          {/* Card Top Navigation */}
          <div className="wallpeace-login-header-nav">
            <button
              id="login-back-btn"
              onClick={onBack}
              className="wallpeace-login-back-btn"
              type="button"
            >
              <ArrowLeft size={16} />
              <span>Back to Hub</span>
            </button>

            <div className="wallpeace-login-badge">
              <ShieldCheck size={13} color="#a855f7" />
              <span>SECURE WORKSPACE</span>
            </div>
          </div>

          {/* Card Brand Header */}
          <div className="wallpeace-login-brand-group">
            <div className="wallpeace-login-brand-icon">
              <Music size={22} color="#ffffff" />
            </div>
            <h1 className="wallpeace-login-title">
              Sign in to <span className="wallpeace-title-gradient">Playlitfy</span>
            </h1>
            <p className="wallpeace-login-subtitle">
              Universal cross-platform playlist engine and community ratings.
            </p>
          </div>

          {/* Content: Authenticated Profile OR Login Options */}
          {isLoggedIn && user ? (
            /* Authenticated Connected State */
            <div className="wallpeace-connected-card">
              <div className="wallpeace-profile-header">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="wallpeace-profile-avatar"
                />
                <div className="wallpeace-profile-info">
                  <div className="wallpeace-profile-name-row">
                    <span className="wallpeace-profile-name">{user.name}</span>
                    <span className="wallpeace-verified-tag">Active</span>
                  </div>
                  <span className="wallpeace-profile-email">{user.email}</span>
                </div>
              </div>

              {/* Connected Services Quick Manager */}
              <div className="wallpeace-services-panel">
                <span className="wallpeace-panel-label">Connected Music Libraries:</span>

                <div className="wallpeace-service-item">
                  <div className="wallpeace-service-meta">
                    <div className="wallpeace-service-dot spotify" />
                    <span className="wallpeace-service-title">Spotify Library</span>
                  </div>
                  <button
                    type="button"
                    className={`wallpeace-toggle-btn ${user.connectedServices.spotify ? 'active' : ''}`}
                    onClick={() => toggleService('spotify')}
                  >
                    {user.connectedServices.spotify ? (
                      <>
                        <Check size={13} />
                        <span>Connected</span>
                      </>
                    ) : (
                      <span>Connect</span>
                    )}
                  </button>
                </div>

                <div className="wallpeace-service-item">
                  <div className="wallpeace-service-meta">
                    <div className="wallpeace-service-dot apple" />
                    <span className="wallpeace-service-title">Apple Music</span>
                  </div>
                  <button
                    type="button"
                    className={`wallpeace-toggle-btn ${user.connectedServices.appleMusic ? 'active' : ''}`}
                    onClick={() => toggleService('appleMusic')}
                  >
                    {user.connectedServices.appleMusic ? (
                      <>
                        <Check size={13} />
                        <span>Connected</span>
                      </>
                    ) : (
                      <span>Connect</span>
                    )}
                  </button>
                </div>

                <div className="wallpeace-service-item">
                  <div className="wallpeace-service-meta">
                    <div className="wallpeace-service-dot youtube" />
                    <span className="wallpeace-service-title">YouTube Music</span>
                  </div>
                  <button
                    type="button"
                    className={`wallpeace-toggle-btn ${user.connectedServices.youtubeMusic ? 'active' : ''}`}
                    onClick={() => toggleService('youtubeMusic')}
                  >
                    {user.connectedServices.youtubeMusic ? (
                      <>
                        <Check size={13} />
                        <span>Connected</span>
                      </>
                    ) : (
                      <span>Connect</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="wallpeace-login-actions-row">
                <button
                  type="button"
                  className="wallpeace-primary-cta w-full"
                  onClick={onBack}
                >
                  <span>Open Hub Workspace</span>
                  <ExternalLink size={15} />
                </button>

                <button
                  type="button"
                  className="wallpeace-secondary-cta w-full"
                  onClick={logout}
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated Login Forms */
            <div className="wallpeace-login-body">
              {/* Mode Tabs */}
              <div className="wallpeace-tab-pill">
                <button
                  type="button"
                  className={`wallpeace-tab-btn ${activeTab === 'providers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('providers')}
                >
                  <span>Direct Connect</span>
                </button>
                <button
                  type="button"
                  className={`wallpeace-tab-btn ${activeTab === 'email' ? 'active' : ''}`}
                  onClick={() => setActiveTab('email')}
                >
                  <span>Magic Link</span>
                </button>
              </div>

              {activeTab === 'providers' ? (
                /* Providers Stack */
                <div className="wallpeace-providers-stack">
                  {/* Google Login */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleProviderLogin('google')}
                    className="wallpeace-provider-btn google"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.18 3.66-9.12z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.25 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.43l4.03-3.14z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Spotify Login */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleProviderLogin('spotify')}
                    className="wallpeace-provider-btn spotify"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1ED760">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.353-.675.464-1.028.25-2.816-1.72-6.36-2.11-10.536-1.157-.402.092-.803-.16-.895-.562-.092-.403.16-.804.563-.896 4.57-1.043 8.492-.596 11.648 1.337.353.215.464.675.248 1.028zm1.47-3.26c-.27.44-.848.58-1.288.31-3.224-1.982-8.138-2.555-11.95-1.397-.497.15-1.023-.135-1.173-.632-.15-.497.135-1.023.632-1.173 4.364-1.324 9.782-.684 13.47 1.583.44.27.58.848.31 1.288zm.126-3.41c-3.864-2.294-10.238-2.506-13.927-1.386-.593.18-1.22-.162-1.4-.755-.18-.593.162-1.22.755-1.4 4.24-1.287 11.28-1.042 15.72 1.595.534.317.708 1.01.392 1.544-.316.534-1.01.708-1.54.392z" />
                    </svg>
                    <span>Connect Spotify Library</span>
                  </button>

                  {/* Apple Music */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleProviderLogin('apple')}
                    className="wallpeace-provider-btn apple"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FA2D48">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.57.66-.99 1.72-.85 2.74 1.01.08 2.05-.53 2.58-1.24z" />
                    </svg>
                    <span>Connect Apple Music</span>
                  </button>

                  {/* YouTube Music */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleProviderLogin('youtube')}
                    className="wallpeace-provider-btn youtube"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
                      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-2-10.5v7l6-3.5-6-3.5z" />
                    </svg>
                    <span>Connect YouTube Music</span>
                  </button>
                </div>
              ) : (
                /* Magic Link Form */
                <form onSubmit={handleEmailSubmit} className="wallpeace-email-form">
                  <div className="wallpeace-input-group-col">
                    <label htmlFor="wallpeace-email-field" className="wallpeace-input-label">
                      Curator Email
                    </label>
                    <input
                      id="wallpeace-email-field"
                      type="email"
                      required
                      placeholder="curator@playlitfy.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="wallpeace-email-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !emailInput.trim()}
                    className="wallpeace-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={15} className="wallpeace-spinner" />
                        <span>Generating session...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>Send Passwordless Magic Link</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Security Notice Footer */}
          <div className="wallpeace-login-footer">
            <Lock size={13} className="wallpeace-lock-icon" />
            <span>
              Secure passwordless authentication. Read and playlist sync scope only.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
