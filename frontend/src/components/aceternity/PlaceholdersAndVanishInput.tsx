import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './PlaceholdersAndVanishInput.css';

interface PlaceholdersAndVanishInputProps {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  disabled?: boolean;
}

export const PlaceholdersAndVanishInput: React.FC<PlaceholdersAndVanishInputProps> = ({
  placeholders,
  onChange,
  onSubmit,
  value,
  disabled = false,
}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  return (
    <form className="aceternity-vanish-form" onSubmit={onSubmit}>
      <div className="vanish-input-wrapper">
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="vanish-input-field"
          aria-label="Playlist URL input"
        />

        {!value && (
          <div className="vanish-placeholder-layer" aria-hidden="true">
            <span key={currentPlaceholder} className="animated-placeholder-text">
              {placeholders[currentPlaceholder]}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={`vanish-submit-btn ${value.trim() ? 'active' : ''}`}
          aria-label="Convert playlist"
        >
          {value.trim() ? <ArrowRight size={17} /> : <Sparkles size={16} />}
        </button>
      </div>
    </form>
  );
};

export default PlaceholdersAndVanishInput;
