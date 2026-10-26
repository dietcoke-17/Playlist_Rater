import React, { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

interface LoginPageProps {
  onBack: () => void;
}

export default function LoginPage({ onBack }: LoginPageProps) {
  const { user, isLoggedIn, login, logout, toggleService, toastMessage } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'providers' | 'email'>('providers');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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
    <div className="login-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="login-toast" role="status" aria-live="polite">
          <CheckCircle2 size={16} className="login-toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="login-grid">
        {/* Showcase Side (Left - Desktop Only) */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="login-showcase"
        >
          {/* Spotlight glow tracking mouse pointer */}
          <div
            className="login-spotlight"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 85, 0, 0.08), rgba(255, 255, 255, 0.04) 40%, transparent 80%)`,
            }}
          />

          {/* Graphic Grid lines overlay */}
          <div className="login-grid-lines" />

          {/* Ambient subtle backdrop glows */}
          <div className="login-ambient-glow" />

          {/* Top Brand Tag */}
          <div className="login-showcase-top">
            <div className="login-brand-pill">
              <svg width="22" height="22" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <rect width="36" height="36" rx="8" fill="#FFFFFF" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11 8H20.5C24.5 8 27.5 11 27.5 15C27.5 19 24.5 22 20.5 22H15.5V28H11V8ZM15.5 12V18H20C21.6 18 23 16.7 23 15C23 13.3 21.6 12 20 12H15.5Z" fill="#000000" />
              </svg>
              <span className="login-brand-text">PLAYLITFY WORKSPACE</span>
            </div>
            <span className="login-status-indicator">
              <span className="login-status-dot" />
              OPERATIONAL
            </span>
          </div>

          {/* Quotes Accent */}
          <div className="login-quote-box">
            <p className="login-quote-text">
              "Music curation is the art of knowing what connects across cultures, vibes, and platforms."
            </p>
            <div className="login-quote-divider" />
            <p className="login-quote-author">PLAYLITFY CORE ENGINE</p>
            <p className="login-quote-sub">Universal synchronization for Spotify, Apple Music, and YouTube</p>
          </div>

          {/* Bottom Metagrid */}
          <div className="login-showcase-bottom">
            <div className="login-spec-item">
              <span className="login-spec-label">ACCURACY</span>
              <span className="login-spec-val">99.4% ISRC MATCH</span>
            </div>
            <div className="login-spec-sep" />
            <div className="login-spec-item">
              <span className="login-spec-label">LATENCY</span>
              <span className="login-spec-val">SUB 4 SECONDS</span>
            </div>
            <div className="login-spec-sep" />
            <div className="login-spec-item">
              <span className="login-spec-label">CURATION</span>
              <span className="login-spec-val">COMMUNITY RATED</span>
            </div>
          </div>
        </div>

        {/* Form Side (Right) */}
        <div className="login-form-side">
          {/* Top Navigation */}
          <div className="login-top-nav">
            <button
              id="login-back-btn"
              onClick={onBack}
              className="login-back-btn"
              type="button"
            >
              <ArrowLeft size={16} />
              <span>Back to Hub</span>
            </button>
            <div className="login-top-mode">SECURE PORTAL</div>
          </div>

          {/* Center Pane */}
          <div className="login-center-pane">
            {/* Title - Large spaced typography (matching Timmo) */}
            <div className="login-title-group">
              <h1 className="login-title">PLAYLITFY</h1>
              <p className="login-subtitle">MUSIC WORKSPACE</p>
            </div>

            {/* Thin Short Divider */}
            <div className="login-divider" />

            {/* Tagline */}
            <div className="login-tagline-group">
              <p className="login-tagline-main">Your music your way.</p>
              <p className="login-tagline-accent">Universal sync and ratings.</p>
            </div>

            {isLoggedIn && user ? (
              /* Authenticated Connected State */
              <div className="login-connected-card">
                <div className="login-profile-header">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="login-profile-avatar"
                  />
                  <div className="login-profile-info">
                    <span className="login-profile-name">{user.name}</span>
                    <span className="login-profile-email">{user.email}</span>
                  </div>
                </div>

                <div className="login-service-status-list">
                  <div className="login-service-row">
                    <span className="login-service-name">Spotify Library</span>
                    <button
                      type="button"
                      className={`login-service-toggle ${user.connectedServices.spotify ? 'active' : ''}`}
                      onClick={() => toggleService('spotify')}
                    >
                      {user.connectedServices.spotify ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  <div className="login-service-row">
                    <span className="login-service-name">Apple Music</span>
                    <button
                      type="button"
                      className={`login-service-toggle ${user.connectedServices.appleMusic ? 'active' : ''}`}
                      onClick={() => toggleService('appleMusic')}
                    >
                      {user.connectedServices.appleMusic ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  <div className="login-service-row">
                    <span className="login-service-name">YouTube Music</span>
                    <button
                      type="button"
                      className={`login-service-toggle ${user.connectedServices.youtubeMusic ? 'active' : ''}`}
                      onClick={() => toggleService('youtubeMusic')}
                    >
                      {user.connectedServices.youtubeMusic ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                </div>

                <div className="login-connected-actions">
                  <button
                    type="button"
                    className="login-primary-action-btn"
                    onClick={onBack}
                  >
                    Open Hub Workspace
                  </button>
                  <button
                    type="button"
                    className="login-secondary-action-btn"
                    onClick={logout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* Unauthenticated Auth Provider Form */
              <div className="login-actions-container">
                {/* Mode Tabs */}
                <div className="login-tab-pill">
                  <button
                    type="button"
                    className={`login-tab-btn ${activeTab === 'providers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('providers')}
                  >
                    Direct Connect
                  </button>
                  <button
                    type="button"
                    className={`login-tab-btn ${activeTab === 'email' ? 'active' : ''}`}
                    onClick={() => setActiveTab('email')}
                  >
                    Magic Link
                  </button>
                </div>

                {activeTab === 'providers' ? (
                  <div className="login-providers-stack">
                    {/* Google Login Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleProviderLogin('google')}
                      className="login-provider-btn google"
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

                    {/* Spotify Connect Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleProviderLogin('spotify')}
                      className="login-provider-btn spotify"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1ED760">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.353-.675.464-1.028.25-2.816-1.72-6.36-2.11-10.536-1.157-.402.092-.803-.16-.895-.562-.092-.403.16-.804.563-.896 4.57-1.043 8.492-.596 11.648 1.337.353.215.464.675.248 1.028zm1.47-3.26c-.27.44-.848.58-1.288.31-3.224-1.982-8.138-2.555-11.95-1.397-.497.15-1.023-.135-1.173-.632-.15-.497.135-1.023.632-1.173 4.364-1.324 9.782-.684 13.47 1.583.44.27.58.848.31 1.288zm.126-3.41c-3.864-2.294-10.238-2.506-13.927-1.386-.593.18-1.22-.162-1.4-.755-.18-.593.162-1.22.755-1.4 4.24-1.287 11.28-1.042 15.72 1.595.534.317.708 1.01.392 1.544-.316.534-1.01.708-1.54.392z" />
                      </svg>
                      <span>Connect Spotify Library</span>
                    </button>

                    {/* Apple Music Connect Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleProviderLogin('apple')}
                      className="login-provider-btn apple"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#FA2D48">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.57.66-.99 1.72-.85 2.74 1.01.08 2.05-.53 2.58-1.24z" />
                      </svg>
                      <span>Connect Apple Music</span>
                    </button>

                    {/* YouTube Music Connect Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleProviderLogin('youtube')}
                      className="login-provider-btn youtube"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
                        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-2-10.5v7l6-3.5-6-3.5z" />
                      </svg>
                      <span>Connect YouTube Music</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="login-email-form">
                    <div className="login-input-group">
                      <label htmlFor="login-email-field" className="login-input-label">
                        CURATOR EMAIL
                      </label>
                      <input
                        id="login-email-field"
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="login-email-input"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !emailInput.trim()}
                      className="login-email-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={16} className="login-spinner" />
                          <span>Generating token...</span>
                        </>
                      ) : (
                        <span>Send Passwordless Magic Link</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Padlock Security Notice (Matching Timmo) */}
            <div className="login-security-notice">
              <Lock size={14} className="login-lock-icon" />
              <span className="login-lock-text">
                Secure passwordless authentication. Read and playlist write scope only.
              </span>
            </div>
          </div>

          {/* Footer spacer */}
          <div className="login-footer-spacer" />
        </div>
      </div>
    </div>
  );
}
