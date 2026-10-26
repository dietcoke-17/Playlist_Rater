import { useState } from 'react';
import { twitterReviews } from '../data/playlists';
import './TwitterReviewsSection.css';

export default function TwitterReviewsSection() {
  const [likesState, setLikesState] = useState<Record<string, { count: number; active: boolean }>>(() => {
    const init: Record<string, { count: number; active: boolean }> = {};
    twitterReviews.forEach((t) => {
      init[t.id] = { count: t.likes, active: false };
    });
    return init;
  });

  const toggleLike = (id: string) => {
    setLikesState((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      return {
        ...prev,
        [id]: {
          count: cur.active ? cur.count - 1 : cur.count + 1,
          active: !cur.active,
        },
      };
    });
  };

  return (
    <section id="reviews" className="twitter-reviews-section" aria-label="Community reviews on X">
      <div className="twitter-reviews-container">
        {/* Section Header */}
        <div className="twitter-header">
          <div className="twitter-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>COMMUNITY SENTIMENT</span>
          </div>
          <h2 className="twitter-main-title">What curators are saying on X</h2>
          <p className="twitter-subtitle">
            Live feedback from music enthusiasts, DJs, and playlist creators sharing their library transfers.
          </p>
        </div>

        {/* Twitter Cards Grid */}
        <div className="twitter-cards-grid">
          {twitterReviews.map((tweet) => {
            const likeInfo = likesState[tweet.id] || { count: tweet.likes, active: false };
            return (
              <div key={tweet.id} className="twitter-card" role="article">
                {/* Tweet Header */}
                <div className="tweet-header">
                  <div className="tweet-author-info">
                    <img
                      src={tweet.avatar}
                      alt={tweet.name}
                      className="tweet-avatar"
                      loading="lazy"
                    />
                    <div className="tweet-names">
                      <div className="tweet-name-row">
                        <span className="tweet-author-name">{tweet.name}</span>
                        {tweet.verified && (
                          <svg className="tweet-verified-badge" viewBox="0 0 22 22" fill="#1d9bf0">
                            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.909-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.136 2.136 5.428-5.428 1.293 1.293-6.721 6.729z" />
                          </svg>
                        )}
                      </div>
                      <span className="tweet-author-handle">
                        @{tweet.handle} · {tweet.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* X Logo */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#71767b" className="tweet-x-icon">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>

                {/* Tweet Body */}
                <p className="tweet-content">{tweet.content}</p>

                {/* Tweet Metrics Bar */}
                <div className="tweet-metrics-bar">
                  {/* Reply */}
                  <button type="button" className="tweet-metric-btn reply" aria-label="Reply">
                    <svg viewBox="0 0 24 24" className="tweet-metric-icon">
                      <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-1.602.88 1.56 1.4c.4.36.44.98.08 1.38-.18.2-.44.3-.7.3-.24 0-.48-.09-.67-.26l-3.8-3.42h-3.14c-4.42 0-8.006-3.58-8.006-8zm8.005-6c-3.317 0-6.005 2.69-6.005 6s2.688 6 6.005 6h3.66c.26 0 .52.1.71.29l2.41 2.17c1.38-1.07 2.21-2.73 2.21-4.46 0-3.38-2.75-6-6.13-6H9.756z" />
                    </svg>
                    <span>{tweet.replies}</span>
                  </button>

                  {/* Repost */}
                  <button type="button" className="tweet-metric-btn repost" aria-label="Repost">
                    <svg viewBox="0 0 24 24" className="tweet-metric-icon">
                      <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.895 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.895-2-2-2z" />
                    </svg>
                    <span>{tweet.reposts}</span>
                  </button>

                  {/* Like */}
                  <button
                    type="button"
                    className={`tweet-metric-btn like ${likeInfo.active ? 'active' : ''}`}
                    onClick={() => toggleLike(tweet.id)}
                    aria-label="Like"
                  >
                    <svg viewBox="0 0 24 24" className="tweet-metric-icon">
                      <path d={likeInfo.active ? "M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.15 2.355-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" : "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-2.063.1-3.354 1.76-3.354 3.78 0 3.82 5.138 9.39 8.05 10.32 2.91-.93 8.05-6.5 8.05-10.32 0-2.02-1.291-3.68-3.353-3.78zM12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.15 2.355-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"} />
                    </svg>
                    <span>{likeInfo.count}</span>
                  </button>

                  {/* Views */}
                  <div className="tweet-metric-btn views">
                    <svg viewBox="0 0 24 24" className="tweet-metric-icon">
                      <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
                    </svg>
                    <span>{tweet.views}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
