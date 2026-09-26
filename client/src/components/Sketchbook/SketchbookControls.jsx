import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

/**
 * SketchbookControls
 * Tactile floating toolbar and silk ribbon bookmarks for navigating pages,
 * adjusting scale/zoom, and toggling inspection tools.
 */
const SketchbookControls = ({
  currentPage = 0,
  totalPages = 5,
  onPageChange,
  zoomScale = 1,
  onZoomChange,
  isLensActive = true,
  onToggleLens,
  pagesInfo = [],
}) => {
  const handleZoomIn = () => {
    onZoomChange((prev) => Math.min(1.25, Math.round((prev + 0.1) * 10) / 10));
  };

  const handleZoomOut = () => {
    onZoomChange((prev) => Math.max(0.85, Math.round((prev - 0.1) * 10) / 10));
  };

  const handleZoomReset = () => {
    onZoomChange(1.0);
  };

  return (
    <div className="sketchbook-control-dock" role="toolbar" aria-label="Sketchbook Navigation & Zoom Controls">
      {/* Top Hanging Silk Ribbon Bookmarks */}
      <nav className="sketchbook-ribbon-bookmarks" aria-label="Sketchbook Volumes">
        {pagesInfo.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPageChange(idx)}
            className={`ribbon-bookmark-tab ${currentPage === idx ? 'is-active' : ''} ribbon-${p.color || 'crimson'}`}
            title={`Flip to ${p.title}`}
            aria-current={currentPage === idx ? 'page' : undefined}
          >
            <span className="ribbon-notch" />
            <span className="ribbon-label">{p.shortLabel || `Vol. ${idx + 1}`}</span>
          </button>
        ))}
      </nav>

      {/* Main Floating Toolstrip */}
      <div className="sketchbook-floating-toolstrip">
        {/* Page Nav Arrows */}
        <div className="toolstrip-group page-nav-group">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="tool-btn"
            title="Turn to Previous Page"
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="page-counter-badge font-serif">
            Vol. {currentPage + 1} <small>/ {totalPages}</small>
          </span>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="tool-btn"
            title="Turn to Next Page"
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Separator */}
        <span className="toolstrip-divider" />

        {/* Zoom Controls */}
        <div className="toolstrip-group zoom-controls-group">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomScale <= 0.85}
            className="tool-btn"
            title="Zoom Out Journal"
            aria-label="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <button
            type="button"
            onClick={handleZoomReset}
            className="zoom-percent-btn font-mono"
            title="Reset Zoom to 100%"
          >
            {Math.round(zoomScale * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomScale >= 1.25}
            className="tool-btn"
            title="Zoom In Journal"
            aria-label="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
        </div>

        {/* Separator */}
        <span className="toolstrip-divider" />

        {/* Magnifying Loupe Toggle */}
        <button
          type="button"
          onClick={onToggleLens}
          className={`tool-btn lens-toggle-btn ${isLensActive ? 'is-active' : ''}`}
          title={isLensActive ? 'Park Magnifying Loupe' : 'Summon Magnifying Loupe'}
          aria-pressed={isLensActive}
        >
          <Eye size={15} />
          <span className="tool-btn-text">Loupe</span>
        </button>
      </div>
    </div>
  );
};

export default SketchbookControls;
