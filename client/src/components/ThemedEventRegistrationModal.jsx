import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Printer,
  Award,
  ShieldCheck,
  Terminal,
  Code2,
  Sparkles,
  Music,
  Trophy,
  Cpu,
  BookOpen,
  Users,
  Flame,
  Check,
  Download,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

/**
 * Deterministic SVG QR Code Generator
 */
const generateQRMatrix = (text) => {
  const size = 25;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

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

  drawFinderPattern(0, 0);
  drawFinderPattern(0, size - 7);
  drawFinderPattern(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = true;
      matrix[i][6] = true;
    }
  }

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let seed = Math.abs(hash);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
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

const QRCodeSVG = ({ text, size = 180, darkColor = '#0f172a' }) => {
  const { matrix, size: matrixSize } = generateQRMatrix(text);
  const cellSize = size / matrixSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="qr-code-svg"
      style={{ borderRadius: '10px', background: '#ffffff', padding: '10px' }}
    >
      <rect width={size} height={size} fill="#ffffff" rx="8" />
      {matrix.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.3}
              height={cellSize + 0.3}
              fill={darkColor}
            />
          ) : null
        )
      )}
    </svg>
  );
};

/**
 * Detect category key for dynamic themed templates
 */
export const getEventThemeKey = (category = '') => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('hackathon') || cat.includes('coding') || cat.includes('hack')) {
    return 'hackathon';
  }
  if (cat.includes('cultural') || cat.includes('dance') || cat.includes('music') || cat.includes('fest')) {
    return 'cultural';
  }
  if (cat.includes('sport') || cat.includes('athletic') || cat.includes('tournament')) {
    return 'sports';
  }
  if (cat.includes('technical') || cat.includes('robotics') || cat.includes('cyber')) {
    return 'technical';
  }
  return 'workshop';
};

const THEME_CONFIGS = {
  hackathon: {
    name: "The Inventor's Drafting Ledger",
    subheading: '36-Hour Prototype Challenge • Architectural Blueprint & Code Folio',
    badge: 'COLLEGIATE INVENTORS CHARTER // EST. 1926',
    icon: Code2,
    accentColor: '#8b2500',
    secondaryColor: '#c9a050',
    headerCodeSnippet: '✎ Field Plate 42 // Blueprint Drafted: AI, Web3 & Cloud Systems',
    bannerTag: 'SCHOLAR INVENTOR CREDENTIAL',
    qrDark: '#2b221a',
    containerClass: 'theme-template-hackathon',
    passPrefix: 'HACK',
    tracks: ['AI & Autonomous Agents', 'Web3 & Decentralized Protocols', 'IoT & Smart Hardware', 'Open Innovation & FinTech'],
  },
  cultural: {
    name: 'Campus Cultural Arts Folio',
    subheading: 'Music, Performing Arts, Classical Symphony & Theatrical Drama',
    badge: 'UNIVERSITY ARTS COUNCIL // ANNUAL FESTIVAL PASS',
    icon: Music,
    accentColor: '#8b2500',
    secondaryColor: '#b85d19',
    headerCodeSnippet: '♫ Live on Central Amphitheatre • Stage Lights & Classical Sound ♫',
    bannerTag: 'FESTIVAL ADMISSION PASS',
    qrDark: '#2b1b17',
    containerClass: 'theme-template-cultural',
    passPrefix: 'FEST',
    tracks: ['Battle of the Bands (Rock/Acoustic)', 'Classical & Contemporary Dance', 'Theatrical Drama & Monologue', 'Visual Arts & Photography Expo'],
  },
  sports: {
    name: 'Inter-College Varsity Athletics Register',
    subheading: 'University Championship Arena • Varsity Tournament Ledger',
    badge: 'VARSITY ATHLETICS COUNCIL // FIELD CLEARANCE',
    icon: Trophy,
    accentColor: '#2b4535',
    secondaryColor: '#c9a050',
    headerCodeSnippet: '⚡ Official Referee Ledger // Match Day Field Entry Pass',
    bannerTag: 'VARSITY ATHLETE CREDENTIAL',
    qrDark: '#1a291f',
    containerClass: 'theme-template-sports',
    passPrefix: 'VARSITY',
    tracks: ['Football / Soccer Tournament', 'Basketball 3v3 & 5v5', 'Badminton Singles & Doubles', 'Track & Field 100m/400m Relay'],
  },
  technical: {
    name: 'Robotics & Engineering Symposium Log',
    subheading: 'Autonomous Robotics, Drone Navigation & Engineering Schematic',
    badge: 'TECH SYMPOSIUM // LABORATORY ACCREDITATION',
    icon: Cpu,
    accentColor: '#334155',
    secondaryColor: '#c9a050',
    headerCodeSnippet: '⚙ Schematic Approved // Mechanical & Computing Laboratories',
    bannerTag: 'TECHNICAL DELEGATE CLEARANCE',
    qrDark: '#1e293b',
    containerClass: 'theme-template-technical',
    passPrefix: 'TECH',
    tracks: ['Autonomous Combat Bot League', 'Zero-Day Ethical Cyber Defense', 'Drone Swarm Navigation Lab', 'Embedded VLSI & IoT Systems'],
  },
  workshop: {
    name: 'Academic Masterclass & Leadership Scroll',
    subheading: 'Hands-on Skills Seminar • Verified University Certificate',
    badge: 'ACADEMIC SENATE MASTERCLASS // CERTIFICATE PASS',
    icon: BookOpen,
    accentColor: '#78350f',
    secondaryColor: '#c9a050',
    headerCodeSnippet: '★ Senate Seminar Hall • Verified University Certificate ★',
    bannerTag: 'MASTERCLASS DELEGATE VOUCHER',
    qrDark: '#291807',
    containerClass: 'theme-template-workshop',
    passPrefix: 'CONF',
    tracks: ['Executive Leadership & Pitching', 'Cloud DevOps & Microservices', 'UI/UX Design Systems Workshop', 'Research Paper Publishing'],
  },
};

const ThemedEventRegistrationModal = ({
  event,
  student,
  isAlreadyRegistered = false,
  passData = null,
  onClose,
  onConfirmRegistration,
}) => {
  if (!event) return null;

  const themeKey = getEventThemeKey(event.category);
  const theme = THEME_CONFIGS[themeKey] || THEME_CONFIGS.workshop;
  const ThemeIcon = theme.icon;

  // View state: 'form' (if registering) or 'pass' (if confirmed or already registered)
  const [viewState, setViewState] = useState(isAlreadyRegistered ? 'pass' : 'form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields customized by category
  const [formData, setFormData] = useState({
    studentName: student?.name || 'Alex Rivera',
    studentEmail: student?.email || 'alex.rivera@college.edu',
    rollNumber: student?.rollNumber || `CS-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    department: student?.department || event.department || 'Computer Science & Engineering',
    track: theme.tracks[0],
    participationType: themeKey === 'hackathon' ? 'Team Lead (2-4 Members)' : 'Individual Delegate',
    teamName: themeKey === 'hackathon' ? 'CodeNexus Crew' : '',
    githubOrPortfolio: '',
    specialRequirement: '',
    acknowledgedRules: true,
  });

  const [activePass, setActivePass] = useState(
    passData || {
      passCode: `PASS-${theme.passPrefix}-${event.id?.toString().slice(-4).toUpperCase() || '8842'}`,
      title: event.title,
      category: event.category,
      department: event.department,
      date: event.date,
      time: event.time || '10:00 AM - 05:00 PM',
      venue: event.venue,
      studentName: student?.name || 'Alex Rivera',
      studentEmail: student?.email || 'alex.rivera@college.edu',
      rollNumber: student?.rollNumber || 'CS-2024-8842',
      track: theme.tracks[0],
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acknowledgedRules) return;

    setIsSubmitting(true);
    try {
      if (onConfirmRegistration) {
        const result = await onConfirmRegistration(event, formData);
        if (result?.passCode) {
          setActivePass({
            ...activePass,
            ...result,
            track: formData.track,
          });
        }
      }
      setViewState('pass');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = `EVENT_PASS_VERIFICATION:${activePass.passCode}:${event.title}:${formData.studentName}:${event.venue}`;

  return (
    <div className="themed-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`themed-registration-container ${theme.containerClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Category Themed Background Canvas / Ambient Glow */}
        <div className="themed-bg-effects" aria-hidden="true">
          <div className="theme-ambient-light light-1"></div>
          <div className="theme-ambient-light light-2"></div>
          <div className="theme-grid-lines"></div>

          {/* Theme-Specific Floating Decorative Elements (Sketchbook & Folio Style) */}
          {themeKey === 'hackathon' && (
            <div className="hackathon-matrix-decor">
              <span className="matrix-stream s1">📐 Blueprint Grid // Scale 1:20 • System Architecture</span>
              <span className="matrix-stream s2">✎ "The code is the brushstroke of the modern inventor"</span>
              <span className="matrix-watermark font-serif">INVENTOR FOLIO</span>
            </div>
          )}

          {themeKey === 'cultural' && (
            <div className="cultural-particles-decor">
              <span className="cultural-music-note n1">♩</span>
              <span className="cultural-music-note n2">♪</span>
              <span className="cultural-music-note n3">♫</span>
              <span className="cultural-watermark font-serif">ARTS FESTIVAL</span>
            </div>
          )}

          {themeKey === 'sports' && (
            <div className="sports-tracks-decor">
              <div className="athletic-track-curve"></div>
              <span className="sports-watermark font-serif">VARSITY ARENA</span>
            </div>
          )}

          {themeKey === 'technical' && (
            <div className="technical-schematic-decor">
              <span className="tech-chip-text">⚙ Mechanical & Robotics Schematic // Field Plate IV</span>
              <span className="tech-watermark font-serif">ENGINEERING</span>
            </div>
          )}

          {themeKey === 'workshop' && (
            <div className="workshop-crest-decor">
              <span className="workshop-watermark font-serif">ACADEMIC CHARTER</span>
            </div>
          )}
        </div>

        {/* Top Header Bar */}
        <div className="themed-modal-header">
          <div className="theme-header-left">
            <span className="theme-badge-pill">
              <ThemeIcon size={14} className="theme-icon-pulse" />
              <span>{theme.badge}</span>
            </span>
            <div className="theme-code-subtitle">{theme.headerCodeSnippet}</div>
          </div>
          <button
            type="button"
            className="themed-close-btn"
            onClick={onClose}
            aria-label="Close template"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content Area: Form or Confirmed Pass */}
        <div className="themed-modal-content">
          {viewState === 'form' ? (
            /* =================================================================
               MODE 1: CATEGORY-THEMED REGISTRATION FORM TEMPLATE
               ================================================================= */
            <div className="themed-form-wrapper">
              <div className="themed-event-summary-card">
                <div className="summary-left">
                  <span className="summary-category-tag">{event.category}</span>
                  <h2 className="summary-title">{event.title}</h2>
                  <p className="summary-desc">{event.description}</p>
                </div>
                <div className="summary-specs-grid">
                  <div className="spec-item">
                    <Calendar size={15} style={{ color: theme.accentColor }} />
                    <div>
                      <small>Date</small>
                      <strong>{event.date}</strong>
                    </div>
                  </div>
                  <div className="spec-item">
                    <Clock size={15} style={{ color: theme.secondaryColor }} />
                    <div>
                      <small>Timing</small>
                      <strong>{event.time || '10:00 AM - 05:00 PM'}</strong>
                    </div>
                  </div>
                  <div className="spec-item full-width">
                    <MapPin size={15} style={{ color: '#f43f5e' }} />
                    <div>
                      <small>Campus Venue</small>
                      <strong>{event.venue}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="themed-interactive-form">
                <div className="form-section-heading">
                  <span className="step-circle">1</span>
                  <h3>Student Registration Details</h3>
                </div>

                <div className="form-two-col">
                  <div className="themed-field-group">
                    <label>Attendee Full Name</label>
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      required
                      className="themed-input"
                    />
                  </div>

                  <div className="themed-field-group">
                    <label>College Roll / Student ID</label>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      required
                      className="themed-input font-mono"
                    />
                  </div>
                </div>

                <div className="form-two-col">
                  <div className="themed-field-group">
                    <label>Academic Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                      className="themed-input"
                    />
                  </div>

                  <div className="themed-field-group">
                    <label>Official Campus Email</label>
                    <input
                      type="email"
                      value={formData.studentEmail}
                      onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                      required
                      className="themed-input"
                    />
                  </div>
                </div>

                {/* Category-Specific Form Customization */}
                <div className="form-section-heading mt-4">
                  <span className="step-circle">2</span>
                  <h3>{theme.name} Options</h3>
                </div>

                <div className="themed-field-group">
                  <label>Select Your Domain / Specialization Track</label>
                  <select
                    value={formData.track}
                    onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                    className="themed-select"
                  >
                    {theme.tracks.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {themeKey === 'hackathon' && (
                  <div className="hackathon-custom-fields">
                    <div className="form-two-col">
                      <div className="themed-field-group">
                        <label>Participation Format</label>
                        <select
                          value={formData.participationType}
                          onChange={(e) =>
                            setFormData({ ...formData, participationType: e.target.value })
                          }
                          className="themed-select"
                        >
                          <option value="Team Lead (2-4 Members)">Team Lead (2-4 Members)</option>
                          <option value="Team Member">Team Member</option>
                          <option value="Solo Developer">Solo Developer</option>
                        </select>
                      </div>

                      <div className="themed-field-group">
                        <label>Team Name (Optional for Solo)</label>
                        <input
                          type="text"
                          placeholder="e.g., SyntaxSorcerers"
                          value={formData.teamName}
                          onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                          className="themed-input"
                        />
                      </div>
                    </div>

                    <div className="themed-field-group">
                      <label>GitHub Repository / Developer Portfolio URL</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={formData.githubOrPortfolio}
                        onChange={(e) =>
                          setFormData({ ...formData, githubOrPortfolio: e.target.value })
                        }
                        className="themed-input font-mono"
                      />
                    </div>
                  </div>
                )}

                {themeKey === 'cultural' && (
                  <div className="form-two-col">
                    <div className="themed-field-group">
                      <label>Participation Mode</label>
                      <select
                        value={formData.participationType}
                        onChange={(e) =>
                          setFormData({ ...formData, participationType: e.target.value })
                        }
                        className="themed-select"
                      >
                        <option value="Performer / Competitor">Performer / Stage Competitor</option>
                        <option value="Stage Crew & Audio Support">Stage Crew & Event Coordination</option>
                        <option value="General Audience Ticket">General Festival Audience Pass</option>
                      </select>
                    </div>

                    <div className="themed-field-group">
                      <label>Performance Duration / Art Medium</label>
                      <input
                        type="text"
                        placeholder="e.g. 5-min Rock Solo or Acrylics Canvas"
                        value={formData.specialRequirement}
                        onChange={(e) =>
                          setFormData({ ...formData, specialRequirement: e.target.value })
                        }
                        className="themed-input"
                      />
                    </div>
                  </div>
                )}

                {themeKey === 'sports' && (
                  <div className="form-two-col">
                    <div className="themed-field-group">
                      <label>Squad Status</label>
                      <select
                        value={formData.participationType}
                        onChange={(e) =>
                          setFormData({ ...formData, participationType: e.target.value })
                        }
                        className="themed-select"
                      >
                        <option value="Main Starting Athlete">Main Starting Athlete</option>
                        <option value="Team Captain">Team Captain</option>
                        <option value="Reserve / Substitute">Reserve / Alternate Athlete</option>
                      </select>
                    </div>

                    <div className="themed-field-group">
                      <label>Jersey Size & Position</label>
                      <input
                        type="text"
                        placeholder="e.g. Size L, Center Forward"
                        value={formData.specialRequirement}
                        onChange={(e) =>
                          setFormData({ ...formData, specialRequirement: e.target.value })
                        }
                        className="themed-input"
                      />
                    </div>
                  </div>
                )}

                {/* Acknowledgement Checkbox */}
                <div className="themed-checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.acknowledgedRules}
                      onChange={(e) =>
                        setFormData({ ...formData, acknowledgedRules: e.target.checked })
                      }
                      required
                    />
                    <span>
                      I agree to abide by the official University Event Code of Conduct and arrive
                      at the venue 15 minutes before reporting time with my digital pass.
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="themed-form-actions">
                  <button type="button" onClick={onClose} className="themed-btn-secondary">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.acknowledgedRules}
                    className="themed-btn-primary"
                    style={{
                      backgroundColor: theme.accentColor,
                      boxShadow: `0 8px 24px -4px ${theme.accentColor}80`,
                    }}
                  >
                    {isSubmitting ? (
                      'Generating Pass...'
                    ) : (
                      <>
                        Confirm & Generate {theme.name.split(' ')[0]} Pass <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* =================================================================
               MODE 2: CATEGORY-THEMED OFFICIAL DIGITAL PASS & TICKET
               ================================================================= */
            <div className="themed-pass-wrapper">
              <div className="official-ticket-card">
                {/* Ticket Top Ribbon */}
                <div className="ticket-top-ribbon">
                  <div className="ribbon-seal">
                    <ShieldCheck size={18} />
                    <span>UNIVERSITY ACCREDITED EVENT PASS</span>
                  </div>
                  <span className="ribbon-serial font-mono">{activePass.passCode}</span>
                </div>

                <div className="ticket-body-grid">
                  {/* Left QR & Code Panel */}
                  <div className="ticket-qr-panel">
                    <QRCodeSVG
                      text={qrPayload}
                      size={180}
                      darkColor={theme.qrDark || '#0f172a'}
                    />
                    <div className="ticket-code-display">
                      <span className="code-label">OFFICIAL PASS CODE</span>
                      <strong className="code-digits font-mono">{activePass.passCode}</strong>
                    </div>
                    <div className="verification-status-pill">
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>VERIFIED & ADMITTED</span>
                    </div>
                  </div>

                  {/* Right Event & Attendee Details */}
                  <div className="ticket-info-panel">
                    <div className="ticket-header-group">
                      <span
                        className="ticket-category-pill"
                        style={{
                          backgroundColor: `${theme.accentColor}25`,
                          color: theme.accentColor,
                          border: `1px solid ${theme.accentColor}50`,
                        }}
                      >
                        {event.category}
                      </span>
                      <h2 className="ticket-event-title">{event.title}</h2>
                      <span className="ticket-dept-text">Host: {event.department}</span>
                    </div>

                    <div className="ticket-attendee-card">
                      <div className="attendee-row">
                        <div>
                          <small>Attendee Name</small>
                          <strong className="attendee-name">
                            {formData.studentName || student?.name || 'Registered Student'}
                          </strong>
                        </div>
                        <div className="text-right">
                          <small>Student Roll ID</small>
                          <strong className="font-mono">
                            {formData.rollNumber || student?.rollNumber || 'CS-2024-8842'}
                          </strong>
                        </div>
                      </div>

                      <div className="attendee-row mt-2">
                        <div>
                          <small>Department</small>
                          <span>{formData.department || student?.department || 'Engineering'}</span>
                        </div>
                        <div className="text-right">
                          <small>Domain Track / Role</small>
                          <span className="font-semibold" style={{ color: theme.accentColor }}>
                            {formData.track || theme.tracks[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-schedule-grid">
                      <div className="ticket-meta-item">
                        <Calendar size={15} style={{ color: theme.accentColor }} />
                        <div>
                          <small>Date</small>
                          <strong>{event.date}</strong>
                        </div>
                      </div>

                      <div className="ticket-meta-item">
                        <Clock size={15} style={{ color: theme.secondaryColor }} />
                        <div>
                          <small>Time</small>
                          <strong>{event.time || '10:00 AM - 05:00 PM'}</strong>
                        </div>
                      </div>

                      <div className="ticket-meta-item full-span">
                        <MapPin size={15} style={{ color: '#f43f5e' }} />
                        <div>
                          <small>Campus Venue</small>
                          <strong>{event.venue}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-footer-notice">
                      <Award size={16} style={{ color: '#8b2500' }} />
                      <p>
                        Present this verified archival pass at venue gate reception for
                        ledger check-in and academic certificate accreditation.
                      </p>
                      <div className="gate-stamp-verified" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                        ★ ADMITTED • GATE CLEARANCE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perforated Stub Barcode Line */}
                <div className="ticket-barcode-stub">
                  <div className="barcode-bars">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <span
                        key={i}
                        className="barcode-line"
                        style={{
                          width: `${(i % 3) + 1.5}px`,
                          height: '28px',
                          backgroundColor: i % 4 === 0 ? 'transparent' : '#94a3b8',
                        }}
                      />
                    ))}
                  </div>
                  <span className="barcode-number font-mono">
                    UNIV-{theme.passPrefix}-{(event.id || '0000').toString().slice(-6)}-ENTRY
                  </span>
                </div>
              </div>

              {/* Pass Actions */}
              <div className="themed-pass-actions">
                <button type="button" onClick={handlePrint} className="themed-btn-secondary">
                  <Printer size={16} /> Print Pass
                </button>
                <button
                  type="button"
                  onClick={() => setViewState('form')}
                  className="themed-btn-secondary"
                >
                  Edit Registration Details
                </button>
                <button type="button" onClick={onClose} className="themed-btn-primary">
                  <Check size={16} /> Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemedEventRegistrationModal;
