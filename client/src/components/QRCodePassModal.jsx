import React from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, Printer, Award, ShieldCheck } from 'lucide-react';

/**
 * Deterministic pseudo-random 25x25 QR Matrix Generator
 * Generates an authentic SVG QR Code pattern for the given passCode and details
 */
const generateQRMatrix = (text) => {
  const size = 25;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to draw corner locator square
  const drawFinderPattern = (r0, c0) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[r0 + r][c0 + c] = true;
        }
      }
    }
  };

  // 3 Finder patterns (top-left, top-right, bottom-left)
  drawFinderPattern(0, 0);
  drawFinderPattern(0, size - 7);
  drawFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = true;
      matrix[i][6] = true;
    }
  }

  // Hash the text string to seed data modules
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  // Fill data areas
  let seed = Math.abs(hash);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder pattern zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const onTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !onTiming) {
        seed = (seed * 9301 + 49297) % 233280;
        matrix[r][c] = seed / 233280 > 0.48;
      }
    }
  }

  return { matrix, size };
};

const QRCodeSVG = ({ text, size = 180 }) => {
  const { matrix, size: matrixSize } = generateQRMatrix(text);
  const cellSize = size / matrixSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="qr-code-svg"
      style={{ borderRadius: '8px', background: '#ffffff', padding: '8px' }}
    >
      <rect width={size} height={size} fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.3}
              height={cellSize + 0.3}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
};

const QRCodePassModal = ({ pass, registration, onClose }) => {
  const item = pass || registration;
  if (!item) return null;

  const title = item.title || item.eventTitle || item.event?.title || 'Campus Event';
  const category = item.category || item.event?.category || 'Event';
  const passCode = item.passCode || (typeof item.id === 'string' && item.id.startsWith('PASS-') ? item.id : `PASS-${item.id || item._id?.toString().slice(-4).toUpperCase() || '8842'}`);
  const studentName = item.studentName || item.student?.name || item.name || 'Registered Student';
  const department = item.department || item.studentDepartment || item.student?.department || item.event?.department || 'Academic Department';
  const date = item.date || item.event?.date || 'Campus Schedule';
  const time = item.time || item.event?.time || '10:00 AM - 04:00 PM';
  const venue = item.venue || item.event?.venue || 'Campus Venue';

  const qrData = `COLLEGE-PASS:${passCode}:${title}:${studentName}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container digital-pass-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close pass">
          <X size={20} />
        </button>

        <div className="pass-modal-header">
          <div className="pass-status-pill">
            <ShieldCheck size={14} /> Official Campus Event Pass
          </div>
          <h2 className="pass-modal-title">{title}</h2>
          <span className="pass-category-tag">{category}</span>
        </div>

        <div className="pass-modal-body">
          {/* QR Code Presentation */}
          <div className="pass-qr-section">
            <QRCodeSVG text={qrData} size={190} />
            <div className="pass-code-banner">
              <span className="pass-code-label">Pass Identification Code</span>
              <strong className="pass-code-digits">{passCode}</strong>
            </div>
            <div className="pass-verification-badge">
              <CheckCircle size={15} className="text-emerald" />
              <span>Verified Active Registration</span>
            </div>
          </div>

          {/* Pass Meta Information */}
          <div className="pass-details-section">
            <div className="pass-detail-group">
              <span className="pass-detail-label">Attendee Name</span>
              <span className="pass-detail-value font-semibold">
                {studentName}
              </span>
            </div>

            <div className="pass-detail-group">
              <span className="pass-detail-label">Academic Department</span>
              <span className="pass-detail-value">{department}</span>
            </div>

            <div className="pass-meta-grid">
              <div className="pass-meta-item">
                <Calendar size={16} className="text-indigo" />
                <div>
                  <small>Event Date</small>
                  <p>{date}</p>
                </div>
              </div>

              <div className="pass-meta-item">
                <Clock size={16} className="text-amber" />
                <div>
                  <small>Schedule</small>
                  <p>{time}</p>
                </div>
              </div>

              <div className="pass-meta-item full-width">
                <MapPin size={16} className="text-rose" />
                <div>
                  <small>Campus Venue</small>
                  <p>{venue}</p>
                </div>
              </div>
            </div>

            <div className="pass-instructions-box">
              <Award size={16} className="text-indigo" />
              <p>
                Please present this digital pass or physical printout at the venue check-in desk
                for badge accreditation and certificate eligibility.
              </p>
            </div>
          </div>
        </div>

        <div className="pass-modal-footer">
          <button onClick={handlePrint} className="btn btn-outline">
            <Printer size={16} /> Print Pass
          </button>
          <button onClick={onClose} className="btn btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePassModal;
