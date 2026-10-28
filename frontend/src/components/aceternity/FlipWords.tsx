import React, { useEffect, useState, useCallback } from 'react';
import './FlipWords.css';

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const FlipWords: React.FC<FlipWordsProps> = ({
  words,
  duration = 2600,
  className = '',
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    const nextIndex = (words.indexOf(currentWord) + 1) % words.length;
    setCurrentWord(words[nextIndex]);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <span className={`aceternity-flip-words-container ${className}`}>
      <span
        key={currentWord}
        className="aceternity-flip-word"
        onAnimationEnd={() => setIsAnimating(false)}
      >
        {currentWord.split(' ').map((word, wordIndex) => (
          <span key={wordIndex} className="flip-word-segment">
            {word.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                className="flip-letter"
                style={{
                  animationDelay: `${letterIndex * 0.035}s`,
                }}
              >
                {letter}
              </span>
            ))}
            <span className="flip-space">&nbsp;</span>
          </span>
        ))}
      </span>
    </span>
  );
};

export default FlipWords;
