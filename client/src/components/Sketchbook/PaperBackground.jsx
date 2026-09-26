import React from 'react';

/**
 * PaperBackground
 * Creates a rich, tactile artist's sketchbook background with subtle procedural
 * paper grain, warm tones, deckled drop shadows, and soft organic watercolor washes.
 */
const PaperBackground = ({ children, className = '', tone = 'parchment' }) => {
  return (
    <div className={`sketchbook-paper-surface tone-${tone} ${className}`}>
      {/* Procedural SVG Paper Texture Filter */}
      <svg className="sr-only" aria-hidden="true" width="0" height="0">
        <filter id="sketchbook-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.15   0 0 0 0 0.12   0 0 0 0 0.08  0 0 0 0.045 0"
            result="coloredNoise"
          />
          <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
        </filter>
      </svg>

      {/* Subtle Watercolor & Vignette Overlays */}
      <div className="paper-grain-overlay" aria-hidden="true" />
      <div className="paper-wash wash-warm" aria-hidden="true" />
      <div className="paper-wash wash-sage" aria-hidden="true" />
      <div className="paper-edge-shadow" aria-hidden="true" />

      {/* Paper Content */}
      <div className="paper-content-flow">{children}</div>
    </div>
  );
};

export default PaperBackground;
