import './Nvg8TypographySection.css';

export default function Nvg8TypographySection() {
  return (
    <section className="nvg8-section">
      {/* Decorative NVG8 Side Graphic Arrows */}
      <div className="nvg8-side-shapes" aria-hidden="true">
        <div className="shape-arrow shape-red" />
        <div className="shape-arrow shape-blue" />
        <div className="shape-arrow shape-yellow" />
      </div>

      <div className="nvg8-container">
        {/* Fun Fact Header Sub-caption */}
        <div className="nvg8-caption-wrap">
          <span className="caption-label">Here’s a fun fact:</span>
          <span className="caption-sub">Today, you are the product</span>
        </div>

        {/* Main NVG8 Display Headline with Inline Icon Chips */}
        <h2 className="nvg8-title-display">
          <div className="title-row">
            <span>Your favorite</span>
            <span className="inline-icon-pill icon-violet" title="Music">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="50" fill="#7B61FF" />
                <path d="M68 28V58C68 64.6 62.6 70 56 70C49.4 70 44 64.6 44 58C44 51.4 49.4 46 56 46C58.8 46 61.4 47 63.4 48.6V36L38 41V64C38 70.6 32.6 76 26 76C19.4 76 14 70.6 14 64C14 57.4 19.4 52 26 52C28.8 52 31.4 53 33.4 54.6V34C33.4 31.2 35.3 28.8 38.1 28.3L64.1 23.1C66.2 22.6 68 24.3 68 26.5V28Z" fill="#0A0A0A" />
              </svg>
            </span>
            <span>songs.</span>
          </div>

          <div className="title-row">
            <span>That</span>
            <span className="inline-icon-pill icon-green" title="Cinema">
              <svg viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="28" fill="#3EC96A" />
                <path d="M22 28H78C82.4 28 86 31.6 86 36V72C86 76.4 82.4 80 78 80H22C17.6 80 14 76.4 14 72V36C14 31.6 17.6 28 22 28Z" fill="#0A0A0A" />
                <path d="M22 28L34 42H22V28ZM42 28L54 42H42V28ZM62 28L74 42H62V28Z" fill="#3EC96A" />
              </svg>
            </span>
            <span>must-see movie.</span>
          </div>

          <div className="title-row">
            <span>Your top</span>
            <span className="inline-icon-pill icon-red" title="Interests">
              <svg viewBox="0 0 120 100" fill="none">
                <path d="M0 24C0 10.7 10.7 0 24 0H70C83.3 0 94 10.7 94 24V32L120 50L94 68V76C94 89.3 83.3 100 70 100H24C10.7 100 0 89.3 0 76V24Z" fill="#FF5733" />
                <path d="M47 28C32 28 25 40 25 55V76L34 68L44 76L54 68L64 76L74 68L83 76V55C83 40 76 28 61 28H47Z" fill="#0A0A0A" />
                <circle cx="43" cy="46" r="5" fill="#FF5733" />
                <circle cx="65" cy="46" r="5" fill="#FF5733" />
              </svg>
            </span>
            <span>interests and</span>
          </div>

          <div className="title-row">
            <span>all your shopping</span>
            <span className="inline-icon-pill icon-yellow" title="Merch">
              <svg viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="28" fill="#FFB830" />
                <path d="M25 42L22 80H78L75 42H25Z" fill="#0A0A0A" />
                <path d="M36 42V32C36 24.3 42.3 18 50 18C57.7 18 64 24.3 64 32V42" stroke="#0A0A0A" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="inline-icon-pill icon-blue" title="Custom Wear">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="50" fill="#4A90FF" />
                <path d="M32 25L18 36L26 50L34 44V78H66V44L74 50L82 36L68 25C68 25 60 32 50 32C40 32 32 25 32 25Z" fill="#0A0A0A" />
              </svg>
            </span>
            <span>habits.</span>
          </div>
        </h2>
      </div>
    </section>
  );
}
