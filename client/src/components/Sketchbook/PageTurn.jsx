import React, { useState, useEffect, useRef } from 'react';

/**
 * PageTurn
 * Provides a 3D perspective page-turning transition system mimicking
 * a physical artist's sketchbook or leather-bound journal.
 * Includes transform-origin on the spine, dynamic lighting gradients,
 * cast shadows, and reduced motion fallback.
 */
const PageTurn = ({
  children,
  currentPage = 0,
  totalPages = 5,
  isTurning = false,
  turnDirection = 'next', // 'next' | 'prev'
  onTurnEnd,
}) => {
  const [turningState, setTurningState] = useState('idle'); // 'idle' | 'turning'
  const turnTimeoutRef = useRef(null);

  // Check user preference for reduced motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (isTurning && turningState === 'idle') {
      setTurningState('turning');

      const duration = prefersReducedMotion.current ? 300 : 750;
      turnTimeoutRef.current = setTimeout(() => {
        setTurningState('idle');
        if (onTurnEnd) onTurnEnd();
      }, duration);
    }

    return () => {
      if (turnTimeoutRef.current) clearTimeout(turnTimeoutRef.current);
    };
  }, [isTurning, onTurnEnd]);

  return (
    <div
      className={`sketchbook-3d-stage ${
        turningState === 'turning' ? `is-turning turn-${turnDirection}` : ''
      } ${prefersReducedMotion.current ? 'reduced-motion' : ''}`}
    >
      {/* 3D Journal Spine Center Shadow */}
      <div className="sketchbook-center-spine" aria-hidden="true">
        <div className="spine-deep-shadow" />
        <div className="spine-stitches" />
      </div>

      {/* Pages Container */}
      <div className="sketchbook-leaves-stack">
        {/* Active Page Surface */}
        <div className="sketchbook-leaf current-leaf">
          {children}

          {/* Realistic Page Curl Shadow Overlay during turn */}
          {turningState === 'turning' && (
            <div className="leaf-curl-shadow-overlay" aria-hidden="true">
              <div className="curl-highlight" />
              <div className="curl-deep-shadow" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTurn;
