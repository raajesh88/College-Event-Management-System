import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PaperBackground from './PaperBackground';
import SketchbookPage from './SketchbookPage';
import PageTurn from './PageTurn';
import SketchbookControls from './SketchbookControls';
import MagnifyingLens from './MagnifyingLens';
import {
  BotanicalBranch,
  WashiTape,
  WaxSeal,
  PostalStamp,
  HandDrawnArrow,
  HandUnderline,
} from './BotanicalDecor';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Search,
  Code,
  Music,
  Trophy,
  Cpu,
  BookOpen,
  Send,
  Users,
  ShieldCheck,
  Check,
  Layers,
  Award,
} from 'lucide-react';

const VOLUMES_INFO = [
  { id: 'vol-1', title: 'Volume I: Campus Chronicle', shortLabel: 'I. Chronicle', color: 'crimson' },
  { id: 'vol-2', title: 'Volume II: Event Disciplines', shortLabel: 'II. Disciplines', color: 'emerald' },
  { id: 'vol-3', title: 'Volume III: Expeditions & Catalog', shortLabel: 'III. Events', color: 'amber' },
  { id: 'vol-4', title: 'Volume IV: The Academic Dossier', shortLabel: 'IV. Dossier', color: 'indigo' },
  { id: 'vol-5', title: 'Volume V: Postcard Dispatch', shortLabel: 'V. Dispatch', color: 'rose' },
];

const SketchbookLanding = ({
  events = [],
  registeredIds = new Set(),
  onRegisterClick,
  token,
  user,
  showToast,
}) => {
  const navigate = useNavigate();

  // Sketchbook Page State
  const [currentPage, setCurrentPage] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState('next');
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isLensActive, setIsLensActive] = useState(true);

  // Filter & Search State for Catalog Page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Contact Postcard State
  const [postcardForm, setPostcardForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isDispatched, setIsDispatched] = useState(false);

  // Mouse Parallax Coordinates
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const sketchbookRef = useRef(null);

  // Track Mouse movement for subtle parallax
  const handleMouseMove = (e) => {
    if (!sketchbookRef.current) return;
    const rect = sketchbookRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseCoords({
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
    });
  };

  // Change Page with 3D Page Turn Animation
  const handlePageChange = (targetPage) => {
    if (targetPage === currentPage || isTurning) return;
    setTurnDirection(targetPage > currentPage ? 'next' : 'prev');
    setIsTurning(true);
    setCurrentPage(targetPage);
  };

  const handleTurnEnd = () => {
    setIsTurning(false);
  };

  // Filtered Events for Volume III
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const catA = (evt.category || '').toLowerCase();
      const catB = (selectedCategory || '').toLowerCase();
      const matchesCat =
        selectedCategory === 'All' ||
        catA.includes(catB) ||
        catB.includes(catA) ||
        (catB.includes('club') && catA.includes('club')) ||
        (catB.includes('hack') && catA.includes('hack')) ||
        (catB.includes('cultur') && catA.includes('cultur')) ||
        (catB.includes('sport') && catA.includes('sport')) ||
        (catB.includes('comp') && catA.includes('comp')) ||
        (catB.includes('seminar') && catA.includes('seminar'));
      const matchesQuery =
        !searchQuery.trim() ||
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [events, selectedCategory, searchQuery]);

  // Handle Postcard submission
  const handlePostcardSubmit = (e) => {
    e.preventDefault();
    if (!postcardForm.email || !postcardForm.message) return;
    setIsDispatched(true);
    if (showToast) {
      showToast('Archival postcard dispatched to University Event Desk!', 'success');
    }
    setPostcardForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsDispatched(false), 5000);
  };

  return (
    <section
      ref={sketchbookRef}
      onMouseMove={handleMouseMove}
      className="sketchbook-workspace-section"
      aria-label="Interactive University Sketchbook & Field Journal"
    >
      {/* Floating Studio Desk Controls */}
      <SketchbookControls
        currentPage={currentPage}
        totalPages={VOLUMES_INFO.length}
        onPageChange={handlePageChange}
        zoomScale={zoomScale}
        onZoomChange={setZoomScale}
        isLensActive={isLensActive}
        onToggleLens={() => setIsLensActive((prev) => !prev)}
        pagesInfo={VOLUMES_INFO}
      />

      {/* Main Sketchbook Surface Container */}
      <div
        className="sketchbook-viewport-scaler"
        style={{
          transform: `scale(${zoomScale})`,
          transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <PaperBackground className="sketchbook-leather-binding">
          {/* Draggable Brass Magnifying Loupe */}
          <MagnifyingLens
            containerRef={sketchbookRef}
            isActive={isLensActive}
            onToggle={() => setIsLensActive(false)}
            defaultPos={{ x: 190, y: 160 }}
          />

          {/* 3D Page Turn Transition Stage */}
          <PageTurn
            currentPage={currentPage}
            totalPages={VOLUMES_INFO.length}
            isTurning={isTurning}
            turnDirection={turnDirection}
            onTurnEnd={handleTurnEnd}
          >
            {/* =============================================================
                VOLUME I: THE FRONTISPIECE & CAMPUS CHRONICLE (HERO PAGE)
                ============================================================= */}
            {currentPage === 0 && (
              <SketchbookPage
                pageNumber={1}
                headerTag="THE FRONTISPIECE"
                volumeTitle="University Event Chronicle"
                mouseCoords={mouseCoords}
              >
                <div className="sketch-spread-grid">
                  {/* Left Column: Hand-taped Polaroid & Field Notes */}
                  <div className="spread-col-left">
                    <div className="sketch-polaroid-card">
                      <WashiTape color="amber" className="polaroid-tape-top" />
                      <div className="polaroid-photo-frame">
                        <img
                          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
                          alt="University Heritage Quadrangle"
                          className="polaroid-img"
                        />
                        <span className="polaroid-caption font-handwriting">
                          The Heritage Quadrangle &amp; Clock Tower, Autumn Session
                        </span>
                      </div>
                      <div className="polaroid-scribble-note font-handwriting">
                        "Where technology, arts, and athletic grit converge."
                      </div>
                    </div>

                    <div className="sketch-curated-stats-ledger">
                      <div className="stat-ledger-item">
                        <span className="stat-ledger-num font-serif">48+</span>
                        <span className="stat-ledger-desc">Active Student Guilds</span>
                      </div>
                      <div className="stat-ledger-divider" />
                      <div className="stat-ledger-item">
                        <span className="stat-ledger-num font-serif">12,500+</span>
                        <span className="stat-ledger-desc">Verified Scholars</span>
                      </div>
                      <div className="stat-ledger-divider" />
                      <div className="stat-ledger-item">
                        <span className="stat-ledger-num font-serif">100%</span>
                        <span className="stat-ledger-desc">Digital QR Passes</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Editorial Letter & Call to Adventure */}
                  <div className="spread-col-right">
                    <div className="journal-entry-meta">
                      <span className="entry-dateline font-serif">AUTUMN TERM • FOLIO 01</span>
                      <PostalStamp city="UNIVERSITY NEXUS" date="OCT 2026" />
                    </div>

                    <h1 className="journal-editorial-headline font-serif">
                      The Collegiate Event &amp; Innovation Journal
                    </h1>
                    <HandUnderline className="journal-headline-underline" />

                    <p className="journal-lead-paragraph font-serif">
                      Welcome to the living digital archive of campus life. Here, every hackathon sprint,
                      classical dance recitative, robotics trial, and varsity championship is chronicled
                      with meticulous academic accreditation.
                    </p>

                    <div className="journal-handwritten-marginalia font-handwriting">
                      * Note: Single-click instant registration generates an official digital QR pass.
                    </div>

                    <div className="journal-actions-row">
                      <button
                        type="button"
                        onClick={() => handlePageChange(2)}
                        className="sketch-btn-primary font-serif"
                      >
                        <Sparkles size={16} /> Explore Field Catalog <ArrowRight size={16} />
                      </button>

                      <Link
                        to={token ? (user?.role === 'student' ? '/student-dashboard' : '/organizer-dashboard') : '/signup'}
                        className="sketch-btn-outline font-serif"
                      >
                        {token ? 'Open Student Dossier' : 'Register as Scholar'}
                      </Link>
                    </div>

                    {/* Pressed Botanical & Wax Seal */}
                    <div className="journal-botanical-footer">
                      <BotanicalBranch variant={1} className="decor-botanical-bottom" />
                      <WaxSeal text="COLLEGIATE COUNCIL • ACCREDITED A+" size={64} />
                    </div>
                  </div>
                </div>
              </SketchbookPage>
            )}

            {/* =============================================================
                VOLUME II: THE SPECTRUM OF DISCIPLINES (CATEGORIES)
                ============================================================= */}
            {currentPage === 1 && (
              <SketchbookPage
                pageNumber={2}
                headerTag="COLLEGIATE DISCIPLINES"
                volumeTitle="The Activity Spectrum"
                mouseCoords={mouseCoords}
              >
                <div className="disciplines-page-wrapper">
                  <div className="disciplines-intro-bar text-center">
                    <span className="section-tag font-serif">Section II • Curated Disciplines</span>
                    <h2 className="disciplines-page-title font-serif">
                      A Chronicle of Eight Great Campus Arenas
                    </h2>
                    <p className="disciplines-page-sub font-serif">
                      Turn the pages of your university journey across eight interdisciplinary activity fields.
                    </p>
                  </div>

                  {/* 8 Specimen Cards Grid */}
                  <div className="disciplines-specimen-grid">
                    {/* Hackathons */}
                    <div
                      className="specimen-card card-hackathon"
                      onClick={() => {
                        setSelectedCategory('Hackathon');
                        handlePageChange(2);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <WashiTape color="cyan" className="specimen-tape" />
                      <div className="specimen-icon-circle cyan">
                        <Code size={22} />
                      </div>
                      <span className="specimen-plate font-mono">SPECIMEN // 01</span>
                      <h3 className="specimen-title font-serif">Hackathons &amp; Sprints</h3>
                      <p className="specimen-summary font-serif">
                        36-hour code marathons in AI, Web3, and IoT. Multidisciplinary teams, live mentorship,
                        and prototype demos.
                      </p>
                      <div className="specimen-sketch-tag font-handwriting">
                        &gt; "Build before sunrise."
                      </div>
                    </div>

                    {/* Cultural Events */}
                    <div
                      className="specimen-card card-cultural"
                      onClick={() => {
                        setSelectedCategory('Cultural');
                        handlePageChange(2);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <WashiTape color="rose" className="specimen-tape" />
                      <div className="specimen-icon-circle rose">
                        <Music size={22} />
                      </div>
                      <span className="specimen-plate font-mono">SPECIMEN // 02</span>
                      <h3 className="specimen-title font-serif">Cultural Festivals</h3>
                      <p className="specimen-summary font-serif">
                        Battle of the bands, classical Bharatanatyam, street plays, theatrical monologue,
                        and fine arts galleries.
                      </p>
                      <div className="specimen-sketch-tag font-handwriting">
                        ♫ "Echoes through the amphitheatre."
                      </div>
                    </div>

                    {/* Varsity Sports */}
                    <div
                      className="specimen-card card-sports"
                      onClick={() => {
                        setSelectedCategory('Sports');
                        handlePageChange(2);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <WashiTape color="emerald" className="specimen-tape" />
                      <div className="specimen-icon-circle emerald">
                        <Trophy size={22} />
                      </div>
                      <span className="specimen-plate font-mono">SPECIMEN // 03</span>
                      <h3 className="specimen-title font-serif">Varsity Athletics</h3>
                      <p className="specimen-summary font-serif">
                        High-stakes inter-college tournaments in football, basketball, badminton, and track relays
                        under stadium floodlights.
                      </p>
                      <div className="specimen-sketch-tag font-handwriting">
                        ⚡ "Glory on the turf."
                      </div>
                    </div>

                    {/* Technical Symposia */}
                    <div
                      className="specimen-card card-technical"
                      onClick={() => {
                        setSelectedCategory('Technical');
                        handlePageChange(2);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <WashiTape color="indigo" className="specimen-tape" />
                      <div className="specimen-icon-circle indigo">
                        <Cpu size={22} />
                      </div>
                      <span className="specimen-plate font-mono">SPECIMEN // 04</span>
                      <h3 className="specimen-title font-serif">Robotics &amp; AI</h3>
                      <p className="specimen-summary font-serif">
                        Combat bot arenas, drone obstacle courses, cybersecurity defenses, and autonomous
                        embedded systems.
                      </p>
                      <div className="specimen-sketch-tag font-handwriting">
                        ▲ "ROS 2.0 telemetry locked."
                      </div>
                    </div>

                    {/* Masterclasses */}
                    <div
                      className="specimen-card card-workshop"
                      onClick={() => {
                        setSelectedCategory('Workshop');
                        handlePageChange(2);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <WashiTape color="amber" className="specimen-tape" />
                      <div className="specimen-icon-circle amber">
                        <BookOpen size={22} />
                      </div>
                      <span className="specimen-plate font-mono">SPECIMEN // 05</span>
                      <h3 className="specimen-title font-serif">Executive Masterclasses</h3>
                      <p className="specimen-summary font-serif">
                        Hands-on skill labs led by industry pioneers with verified micro-credentials
                        for semester activity points.
                      </p>
                      <div className="specimen-sketch-tag font-handwriting">
                        ★ "Verified credentials."
                      </div>
                    </div>

                    {/* Competitions */}
                    <div
                      className="specimen-card card-competition"
                      onClick={() => {
                        setSelectedCategory('Competition');
                        handlePageChange(2);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <WashiTape color="rose" className="specimen-tape" />
                      <div className="specimen-icon-circle crimson">
                        <Award size={22} />
                      </div>
                      <span className="specimen-plate font-mono">SPECIMEN // 06</span>
                      <h3 className="specimen-title font-serif">Debates &amp; Contests</h3>
                      <p className="specimen-summary font-serif">
                        Parliamentary debate tournaments, national business case study challenges, and competitive algorithmic sprints.
                      </p>
                      <div className="specimen-sketch-tag font-handwriting">
                        ⚖ "Prowess in rhetoric."
                      </div>
                    </div>

                    {/* Seminars */}
                    <div
                      className="specimen-card card-seminar"
                      onClick={() => {
                        setSelectedCategory('Seminar');
                        handlePageChange(2);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <WashiTape color="cyan" className="specimen-tape" />
                      <div className="specimen-icon-circle amber">
                        <Sparkles size={22} />
                      </div>
                      <span className="specimen-plate font-mono">SPECIMEN // 07</span>
                      <h3 className="specimen-title font-serif">Academic Seminars</h3>
                      <p className="specimen-summary font-serif">
                        Distinguished keynote lectures on quantum computing, AI ethics, and academic research colloquiums.
                      </p>
                      <div className="specimen-sketch-tag font-handwriting">
                        ✦ "Expanding human frontiers."
                      </div>
                    </div>

                    {/* Club Activities */}
                    <div
                      className="specimen-card card-club"
                      onClick={() => {
                        setSelectedCategory('Club Activity');
                        handlePageChange(2);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <WashiTape color="emerald" className="specimen-tape" />
                      <div className="specimen-icon-circle emerald">
                        <Users size={22} />
                      </div>
                      <span className="specimen-plate font-mono">SPECIMEN // 08</span>
                      <h3 className="specimen-title font-serif">Societies &amp; Guilds</h3>
                      <p className="specimen-summary font-serif">
                        Student-led community drives, campus photography walks, astronomy watch parties, and community outreach.
                      </p>
                      <div className="specimen-sketch-tag font-handwriting">
                        ❦ "Community ignites passion."
                      </div>
                    </div>
                  </div>
                </div>
              </SketchbookPage>
            )}

            {/* =============================================================
                VOLUME III: THE ARCHIVAL EXPEDITIONS (LIVE EVENTS)
                ============================================================= */}
            {currentPage === 2 && (
              <SketchbookPage
                pageNumber={3}
                headerTag="FIELD DISPATCHES"
                volumeTitle="Scheduled Campus Expeditions"
                mouseCoords={mouseCoords}
              >
                <div className="catalog-spread-wrapper">
                  {/* Ledger Header & Search */}
                  <div className="catalog-toolbar-card">
                    <div className="catalog-search-field">
                      <Search size={18} className="search-icon-sketch" />
                      <input
                        type="text"
                        placeholder="Search field registry by title, venue, or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="sketch-ledger-input font-serif"
                      />
                    </div>

                    {/* Filter Ribbon Chips */}
                    <div className="catalog-filter-chips">
                      {['All', 'Hackathon', 'Cultural', 'Sports', 'Technical', 'Workshop', 'Competition', 'Seminar', 'Club Activity'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`chip-sketch-btn ${selectedCategory === cat ? 'active' : ''} font-serif`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pinned Field Cards */}
                  {filteredEvents.length === 0 ? (
                    <div className="catalog-empty-ledger text-center">
                      <p className="font-serif">No expeditions match your current inquiry.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('All');
                          setSearchQuery('');
                        }}
                        className="sketch-btn-outline font-serif mt-2"
                      >
                        Reset Ledger Filters
                      </button>
                    </div>
                  ) : (
                    <div className="catalog-pinned-cards-grid">
                      {filteredEvents.map((evt) => {
                        const isRegistered = registeredIds.has(evt.id);
                        return (
                          <div key={evt.id} className="pinned-event-card">
                            <WashiTape color="kraft" className="pinned-tape-top" />
                            <div className="pinned-card-inner">
                              <div className="pinned-card-photo">
                                <img src={evt.image} alt={evt.title} className="pinned-photo-img" />
                                <span className="pinned-category-badge font-mono">{evt.category}</span>
                              </div>

                              <div className="pinned-card-body">
                                <span className="pinned-dept-tag font-serif">{evt.department}</span>
                                <h3 className="pinned-event-title font-serif">{evt.title}</h3>
                                <p className="pinned-event-desc font-serif">{evt.description}</p>

                                <div className="pinned-specs-ledger">
                                  <div className="spec-row">
                                    <Calendar size={13} /> <span>{evt.date}</span>
                                  </div>
                                  <div className="spec-row">
                                    <Clock size={13} /> <span>{evt.time}</span>
                                  </div>
                                  <div className="spec-row">
                                    <MapPin size={13} /> <span>{evt.venue}</span>
                                  </div>
                                </div>

                                <div className="pinned-card-footer">
                                  <button
                                    type="button"
                                    onClick={() => onRegisterClick(evt)}
                                    className={`sketch-enroll-btn font-serif ${isRegistered ? 'is-enrolled' : ''}`}
                                  >
                                    {isRegistered ? (
                                      <>
                                        <Check size={14} /> View Digital Pass
                                      </>
                                    ) : (
                                      <>
                                        Enroll &amp; Generate Pass <ChevronRight size={14} />
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </SketchbookPage>
            )}

            {/* =============================================================
                VOLUME IV: THE ACADEMIC DOSSIER (ABOUT & CAPABILITIES)
                ============================================================= */}
            {currentPage === 3 && (
              <SketchbookPage
                pageNumber={4}
                headerTag="UNIVERSITY DOSSIER"
                volumeTitle="The Architectural Blueprint"
                mouseCoords={mouseCoords}
              >
                <div className="dossier-spread-wrapper">
                  <div className="dossier-header-center text-center">
                    <span className="section-tag font-serif">Volume IV • The Academic Charter</span>
                    <h2 className="dossier-headline font-serif">
                      Crafted for the Modern University Ecosystem
                    </h2>
                    <p className="dossier-subheading font-serif">
                      Replacing fragmented paper sign-up sheets and chaotic check-in queues with an
                      authentic, accredited digital workflow.
                    </p>
                  </div>

                  <div className="dossier-trio-ledger">
                    {/* Scholar Ledger */}
                    <div className="dossier-column-card">
                      <div className="dossier-pillar-top">
                        <Users size={22} className="pillar-icon text-indigo" />
                        <span className="pillar-seal-text font-serif">FOR STUDENTS</span>
                      </div>
                      <h3 className="pillar-title font-serif">The Scholar's Portfolio</h3>
                      <p className="pillar-summary font-serif">
                        Explore varsity sports, hackathons, and cultural festivals. One-click registration,
                        instant QR admission passes, and certified extracurricular transcripts.
                      </p>
                      <ul className="pillar-bullet-list font-serif">
                        <li>Instant single-click enrollment</li>
                        <li>Digital passes with deterministic QR code</li>
                        <li>Extracurricular activity credit accumulation</li>
                      </ul>
                    </div>

                    {/* Organizer Ledger */}
                    <div className="dossier-column-card">
                      <div className="dossier-pillar-top">
                        <ShieldCheck size={22} className="pillar-icon text-emerald" />
                        <span className="pillar-seal-text font-serif">FOR FACULTY</span>
                      </div>
                      <h3 className="pillar-title font-serif">Coordinator Console</h3>
                      <p className="pillar-summary font-serif">
                        Publish departmental events with seat quotas and detailed guidelines. Monitor live
                        attendance rosters and export verified registration logs for accreditation.
                      </p>
                      <ul className="pillar-bullet-list font-serif">
                        <li>Instant event publishing &amp; quota controls</li>
                        <li>Live attendance roster &amp; CSV export</li>
                        <li>Accreditation compliance audit trails</li>
                      </ul>
                    </div>

                    {/* Guild Ledger */}
                    <div className="dossier-column-card">
                      <div className="dossier-pillar-top">
                        <Award size={22} className="pillar-icon text-amber" />
                        <span className="pillar-seal-text font-serif">FOR SOCIETIES</span>
                      </div>
                      <h3 className="pillar-title font-serif">Campus Guilds</h3>
                      <p className="pillar-summary font-serif">
                        Empower student clubs to mobilize talent, launch annual fests, recruit new cohorts,
                        and host tournaments backed by robust cloud infrastructure.
                      </p>
                      <ul className="pillar-bullet-list font-serif">
                        <li>Annual festival scheduling and stages</li>
                        <li>QR verification desks at entry venues</li>
                        <li>Official Dean notice bulletins</li>
                      </ul>
                    </div>
                  </div>

                  {/* Handwritten Closing Note */}
                  <div className="dossier-signature-block">
                    <span className="sig-quote font-handwriting">
                      "A university thrives where its scholars convene to create, compete, and celebrate."
                    </span>
                    <div className="sig-author font-serif">
                      <span>Office of the Dean of Student Affairs</span>
                      <small>Accredited University Event Council</small>
                    </div>
                  </div>
                </div>
              </SketchbookPage>
            )}

            {/* =============================================================
                VOLUME V: THE CAMPUS POSTCARD & DISPATCH (CONTACT DESK)
                ============================================================= */}
            {currentPage === 4 && (
              <SketchbookPage
                pageNumber={5}
                headerTag="CAMPUS POST"
                volumeTitle="The University Dispatch Desk"
                mouseCoords={mouseCoords}
              >
                <div className="postcard-spread-wrapper">
                  <div className="vintage-postcard-card">
                    {/* Airmail Border Pattern */}
                    <div className="postcard-airmail-border" aria-hidden="true" />

                    <div className="postcard-body-grid">
                      {/* Left: Message Writing Area */}
                      <form onSubmit={handlePostcardSubmit} className="postcard-message-side">
                        <span className="postcard-heading font-serif">CAMPUS INQUIRY &amp; DISPATCH</span>
                        <p className="postcard-hint font-serif">
                          Write to the Event Organizing Council for stall booking, sponsorship, or general queries.
                        </p>

                        <div className="postcard-field-group">
                          <label className="font-serif">Sender's Full Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Alex Rivera"
                            value={postcardForm.name}
                            onChange={(e) => setPostcardForm({ ...postcardForm, name: e.target.value })}
                            required
                            className="postcard-input font-serif"
                          />
                        </div>

                        <div className="postcard-field-group">
                          <label className="font-serif">Academic Email Address</label>
                          <input
                            type="email"
                            placeholder="alex.rivera@college.edu"
                            value={postcardForm.email}
                            onChange={(e) => setPostcardForm({ ...postcardForm, email: e.target.value })}
                            required
                            className="postcard-input font-serif"
                          />
                        </div>

                        <div className="postcard-field-group">
                          <label className="font-serif">Inquiry &amp; Notes</label>
                          <textarea
                            rows={4}
                            placeholder="Write your message on this ledger page..."
                            value={postcardForm.message}
                            onChange={(e) => setPostcardForm({ ...postcardForm, message: e.target.value })}
                            required
                            className="postcard-textarea font-handwriting"
                          />
                        </div>

                        <button type="submit" className="postcard-dispatch-btn font-serif">
                          <Send size={15} /> Dispatch Postcard to Desk
                        </button>

                        {isDispatched && (
                          <div className="postcard-success-banner font-serif">
                            ✓ Message recorded in the Central Event Register.
                          </div>
                        )}
                      </form>

                      {/* Right: Postal Stamp & Official Address Lines */}
                      <div className="postcard-address-side">
                        <div className="postcard-stamp-corner">
                          <div className="vintage-postage-stamp">
                            <span className="stamp-denomination font-mono">1926</span>
                            <span className="stamp-portrait">🎓</span>
                            <span className="stamp-caption font-serif">UNIVERSITY POST</span>
                          </div>
                          <PostalStamp city="CENTRAL DESK" date="2026-27" />
                        </div>

                        <div className="postcard-ruled-address-lines">
                          <div className="address-rule">
                            <span className="font-handwriting">To: The Central Event Coordination Desk</span>
                          </div>
                          <div className="address-rule">
                            <span className="font-handwriting">Office of Dean of Student Activities, Block A</span>
                          </div>
                          <div className="address-rule">
                            <span className="font-handwriting">Campus Heritage Quadrangle, University Campus</span>
                          </div>
                          <div className="address-rule">
                            <span className="font-handwriting">Postal Code: CAMPUS-01 // Desk 4</span>
                          </div>
                        </div>

                        <div className="postcard-wax-seal-wrapper">
                          <WaxSeal text="OFFICIAL DISPATCH // VERIFIED" size={72} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SketchbookPage>
            )}
          </PageTurn>
        </PaperBackground>
      </div>
    </section>
  );
};

export default SketchbookLanding;
