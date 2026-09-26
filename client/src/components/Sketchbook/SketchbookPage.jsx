import React, { useEffect, useRef, useState } from 'react';

/**
 * SketchbookPage
 * Renders an editorial sketchbook surface with subtle deckled edges,
 * mouse parallax response, staggered entry transitions, and ruled margins.
 */
const SketchbookPage = ({
  children,
  pageNumber = 1,
  headerTag = 'CAMPUS CHRONICLE',
  volumeTitle = 'University Event Registry',
  className = '',
  mouseCoords = { x: 0, y: 0 },
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [pageNumber]);

  // Subtle Parallax offsets based on parent mouse coordinates
  const parallaxMain = {
    transform: `translate3d(${mouseCoords.x * 4}px, ${mouseCoords.y * 3}px, 0)`,
  };

  const parallaxDecor = {
    transform: `translate3d(${-mouseCoords.x * 7}px, ${-mouseCoords.y * 6}px, 0)`,
  };

  return (
    <article
      ref={pageRef}
      className={`sketchbook-page-canvas ${isLoaded ? 'page-entered' : 'page-entering'} ${className}`}
      aria-label={`Sketchbook Volume ${pageNumber}: ${volumeTitle}`}
    >
      {/* Deckled Edge Paper Border */}
      <div className="page-deckled-edge-left" aria-hidden="true" />
      <div className="page-deckled-edge-right" aria-hidden="true" />

      {/* Ruled Notebook / Ledger Header */}
      <header className="page-editorial-header">
        <div className="header-meta-left">
          <span className="page-chapter-roman">VOLUME {pageNumber}</span>
          <span className="page-sep-dot">•</span>
          <span className="page-header-tag">{headerTag}</span>
        </div>
        <div className="header-meta-right">
          <span className="page-volume-title">{volumeTitle}</span>
          <span className="page-folio-number font-serif">Folio {pageNumber}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="page-body-spread" style={parallaxMain}>
        {children}
      </div>

      {/* Editorial Footer Line */}
      <footer className="page-editorial-footer">
        <div className="footer-margin-rule" />
        <div className="footer-details">
          <span className="footer-watermark">ACCREDITED COLLEGIATE EVENT SYSTEM • 2026 ARCHIVES</span>
          <span className="footer-leaf-count font-serif">p. {pageNumber * 2 - 1} &amp; {pageNumber * 2}</span>
        </div>
      </footer>
    </article>
  );
};

export default SketchbookPage;
