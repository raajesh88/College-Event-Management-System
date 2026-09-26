import React from 'react';

/**
 * BotanicalDecor
 * Collection of hand-drawn editorial, botanical, and scrapbook elements:
 * - Ink-drawn botanical branches & leaves
 * - Washi tape strips (semi-transparent textured tape)
 * - Embossed wax seal stamp
 * - Postal cancellation stamp & hand-drawn ink doodles
 */

export const BotanicalBranch = ({ className = '', style = {}, variant = 1 }) => {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sketch-botanical-svg ${className}`}
      style={style}
      aria-hidden="true"
    >
      {variant === 1 ? (
        // Eucalyptus / Olive Branch
        <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45">
          <path d="M60 170 C55 120 62 70 50 15" />
          {/* Leaves */}
          <path d="M56 140 C35 135 28 115 45 110 C55 118 57 130 56 140 Z" />
          <path d="M58 135 C78 130 85 110 68 105 C58 113 57 125 58 135 Z" />
          <path d="M55 105 C32 98 25 80 44 75 C54 83 55 95 55 105 Z" />
          <path d="M57 95 C75 88 82 70 65 65 C55 73 56 85 57 95 Z" />
          <path d="M53 65 C34 58 28 42 45 38 C52 46 53 56 53 65 Z" />
          <path d="M55 58 C72 50 78 35 62 30 C53 38 54 48 55 58 Z" />
          <path d="M50 25 C42 12 52 5 56 14 C55 18 52 22 50 25 Z" />
        </g>
      ) : (
        // Wildflower & Fern
        <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.4">
          <path d="M60 175 C58 110 60 60 62 10" />
          <path d="M60 150 C40 148 30 138 48 132" />
          <path d="M61 142 C78 140 88 130 70 125" />
          <path d="M60 120 C38 115 28 102 46 96" />
          <path d="M61 112 C80 108 90 95 72 88" />
          <path d="M60 88 C40 82 32 70 48 64" />
          <path d="M61 80 C78 74 86 62 70 56" />
          <path d="M61 52 C45 44 38 32 52 28" />
          <path d="M62 46 C75 38 82 26 68 22" />
          <circle cx="62" cy="12" r="3.5" fill="none" />
        </g>
      )}
    </svg>
  );
};

export const WashiTape = ({ className = '', style = {}, color = 'kraft' }) => {
  return (
    <div
      className={`sketch-washi-tape tape-${color} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <div className="tape-texture" />
    </div>
  );
};

export const WaxSeal = ({ className = '', text = 'ACCREDITED // 2026', size = 68 }) => {
  return (
    <div
      className={`sketch-wax-seal ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
      title="Official University Wax Seal"
    >
      <div className="seal-outer-rim">
        <div className="seal-inner-emboss">
          <svg viewBox="0 0 100 100" className="seal-svg">
            <path
              id="seal-curve"
              d="M 18,50 A 32,32 0 1,1 82,50 A 32,32 0 1,1 18,50"
              fill="none"
            />
            <text className="seal-curved-text">
              <textPath href="#seal-curve" startOffset="50%" textAnchor="middle">
                {text}
              </textPath>
            </text>
            <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M45 42 L50 36 L55 42 L50 48 Z M43 56 L57 56 M46 61 L54 61" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const PostalStamp = ({ className = '', city = 'CAMPUS EXPEDITION', date = 'OCT 2026' }) => {
  return (
    <div className={`sketch-postal-mark ${className}`} aria-hidden="true">
      <div className="postal-circles">
        <div className="circle-outer" />
        <div className="circle-inner">
          <span className="postal-city">{city}</span>
          <span className="postal-date">{date}</span>
        </div>
      </div>
      <div className="postal-waves">
        <span className="wave-bar" />
        <span className="wave-bar" />
        <span className="wave-bar" />
      </div>
    </div>
  );
};

export const HandDrawnArrow = ({ className = '', style = {}, direction = 'right' }) => {
  return (
    <svg
      viewBox="0 0 60 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sketch-arrow-svg dir-${direction} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M 4,14 C 18,8 35,16 52,10" />
      <path d="M 44,5 C 48,8 53,10 55,10 C 52,13 47,17 44,20" />
    </svg>
  );
};

export const HandUnderline = ({ className = '', style = {} }) => {
  return (
    <svg
      viewBox="0 0 160 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={`sketch-underline-svg ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M 3,9 C 45,4 95,13 155,7 C 115,11 65,5 25,12" />
    </svg>
  );
};
