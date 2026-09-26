import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Move, Eye, Minimize2, RotateCcw } from 'lucide-react';

/**
 * MagnifyingLens
 * A tactile, draggable brass magnifying loupe with smooth elastic tracking,
 * touch-action scrolling prevention, and an interactive magnified inspection lens.
 */
const MagnifyingLens = ({
  containerRef,
  isActive = true,
  onToggle,
  defaultPos = { x: 120, y: 140 },
}) => {
  // Target position (where pointer is)
  const targetPos = useRef({ x: defaultPos.x, y: defaultPos.y });
  // Current interpolated position (smooth lag)
  const currentPos = useRef({ x: defaultPos.x, y: defaultPos.y });
  // Visual state to trigger render
  const [lensPos, setLensPos] = useState({ x: defaultPos.x, y: defaultPos.y });
  const [isDragging, setIsDragging] = useState(false);
  const [inspectedMode, setInspectedMode] = useState('notes'); // 'notes' | 'zoom'

  const animFrameId = useRef(null);
  const isMoving = useRef(false);
  const lensRef = useRef(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  // Smooth lerp loop
  const updatePhysics = useCallback(() => {
    const dx = targetPos.current.x - currentPos.current.x;
    const dy = targetPos.current.y - currentPos.current.y;

    currentPos.current.x += dx * 0.16;
    currentPos.current.y += dy * 0.16;

    setLensPos({
      x: Math.round(currentPos.current.x * 10) / 10,
      y: Math.round(currentPos.current.y * 10) / 10,
    });

    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3 || isDragging) {
      animFrameId.current = requestAnimationFrame(updatePhysics);
    } else {
      isMoving.current = false;
    }
  }, [isDragging]);

  const triggerMovement = useCallback(() => {
    if (!isMoving.current) {
      isMoving.current = true;
      animFrameId.current = requestAnimationFrame(updatePhysics);
    }
  }, [updatePhysics]);

  // Pointer down (Desktop Mouse & Mobile Touch)
  const handlePointerDown = (e) => {
    e.stopPropagation();
    // Prevent default scroll behavior on mobile touch
    if (e.cancelable) e.preventDefault();

    const lensEl = lensRef.current;
    if (!lensEl) return;

    lensEl.setPointerCapture(e.pointerId);
    setIsDragging(true);

    const rect = lensEl.getBoundingClientRect();
    dragStartOffset.current = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };

    triggerMovement();
  };

  // Pointer move
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();

    const parent = containerRef?.current || document.body;
    const parentRect = parent.getBoundingClientRect();

    // Constrain to container
    const rawX = e.clientX - parentRect.left - dragStartOffset.current.x;
    const rawY = e.clientY - parentRect.top - dragStartOffset.current.y;

    const clampedX = Math.max(70, Math.min(parentRect.width - 70, rawX));
    const clampedY = Math.max(70, Math.min(parentRect.height - 70, rawY));

    targetPos.current = { x: clampedX, y: clampedY };
    triggerMovement();
  };

  // Pointer up
  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      if (lensRef.current && lensRef.current.hasPointerCapture(e.pointerId)) {
        lensRef.current.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
  };

  // Reset to default dock position
  const handleReset = (e) => {
    e.stopPropagation();
    targetPos.current = { x: defaultPos.x, y: defaultPos.y };
    triggerMovement();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  if (!isActive) return null;

  // Determine dynamic field note revealed by position
  const getRevealedSecret = (x, y) => {
    if (x < 300 && y < 350) {
      return {
        tag: 'ARCHIVAL INSCRIPTION',
        title: 'Founder\'s Quadrangle',
        note: 'Est. 1926 • Hand-hewn granite foundations. Central meridian alignment with campus astronomy tower.',
      };
    }
    if (x >= 300 && y < 350) {
      return {
        tag: 'INNOVATION CELL',
        title: 'Hackathon War Room',
        note: '36-hour sprint active. AI & Web3 cluster bandwidth monitored. Overclocked coffee machines ready.',
      };
    }
    if (x < 350 && y >= 350) {
      return {
        tag: 'ATHLETIC ARCHIVES',
        title: 'Varsity Field Ledger',
        note: 'Track record: 4x100m relay 41.2s (2024). Stadium floodlights schedule confirmed for varsity cup.',
      };
    }
    return {
      tag: 'CULTURAL REGISTER',
      title: 'Amphitheatre Acoustics',
      note: 'Sound pressure test: 104dB during annual battle of bands. Stage curtain rigging checked and verified.',
    };
  };

  const secret = getRevealedSecret(lensPos.x, lensPos.y);

  return (
    <div
      ref={lensRef}
      className={`sketchbook-magnifier-lens ${isDragging ? 'is-dragging' : ''}`}
      style={{
        transform: `translate3d(${lensPos.x - 90}px, ${lensPos.y - 90}px, 0)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="region"
      aria-label="Interactive Magnifying Loupe. Drag across page to inspect archival details."
    >
      {/* Brass Loupe Frame */}
      <div className="lens-brass-rim">
        {/* Screw Highlights on Rim */}
        <span className="rim-screw screw-top" />
        <span className="rim-screw screw-right" />
        <span className="rim-screw screw-bottom" />
        <span className="rim-screw screw-left" />

        {/* Convex Glass & Glare Reflections */}
        <div className="lens-glass-surface">
          <div className="lens-glare-arc" />
          <div className="lens-glare-dot" />

          {/* Magnified Revealed Secret / Calligraphy */}
          <div className="lens-magnified-content">
            <span className="lens-micro-tag">{secret.tag}</span>
            <strong className="lens-micro-title">{secret.title}</strong>
            <p className="lens-micro-note">{secret.note}</p>
            <div className="lens-crosshair" aria-hidden="true">
              <span className="crosshair-v" />
              <span className="crosshair-h" />
            </div>
          </div>
        </div>

        {/* Brass Handle */}
        <div className="lens-wooden-handle">
          <div className="handle-collar" />
          <div className="handle-shaft" />
          <div className="handle-pommel" />
        </div>
      </div>

      {/* Floating Mini Controls on Lens */}
      <div className="lens-quick-actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleReset}
          className="lens-action-btn"
          title="Reset Loupe to margin"
        >
          <RotateCcw size={11} />
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="lens-action-btn"
          title="Park Loupe"
        >
          <Minimize2 size={11} />
        </button>
      </div>

      <div className="lens-drag-hint">
        <Move size={12} />
        <span>Drag Loupe</span>
      </div>
    </div>
  );
};

export default MagnifyingLens;
