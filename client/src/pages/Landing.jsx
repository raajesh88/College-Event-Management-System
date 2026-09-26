import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QRCodePassModal from '../components/QRCodePassModal';
import ThemedEventRegistrationModal from '../components/ThemedEventRegistrationModal';
import SketchbookLanding from '../components/Sketchbook/SketchbookLanding';
import { useAuth } from '../context/AuthContext';
import { eventService, registrationService } from '../services/api';
import {
  COLLEGE_ACTIVITIES,
  DEFAULT_UPCOMING_EVENTS,
  PLATFORM_STATS,
  CONTACT_CARDS,
  FALLBACK_EVENT_IMAGE,
  HERO_BACKGROUND_IMAGE,
} from '../data/landingData';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Users,
  CheckCircle2,
  Compass,
  CalendarDays,
  BellRing,
  BarChart3,
  BookOpen,
  Music,
  Code,
  Cpu,
  Wrench,
  Trophy,
  Medal,
  Presentation,
  Search,
  Mail,
  Building,
  ShieldCheck,
  Check,
  Send,
} from 'lucide-react';

const renderActivityIcon = (iconName, size = 20, className = '') => {
  switch (iconName) {
    case 'Music':
      return <Music size={size} className={className} />;
    case 'Code':
      return <Code size={size} className={className} />;
    case 'Cpu':
      return <Cpu size={size} className={className} />;
    case 'Wrench':
      return <Wrench size={size} className={className} />;
    case 'Trophy':
      return <Trophy size={size} className={className} />;
    case 'Medal':
      return <Medal size={size} className={className} />;
    case 'Presentation':
      return <Presentation size={size} className={className} />;
    case 'Users':
      return <Users size={size} className={className} />;
    default:
      return <Sparkles size={size} className={className} />;
  }
};

const Landing = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // State
  const [eventsList, setEventsList] = useState(DEFAULT_UPCOMING_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Registration & Modal State
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [activePassRegistration, setActivePassRegistration] = useState(null);
  const [themedModalEvent, setThemedModalEvent] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);


  // Sync live events from backend API if available
  useEffect(() => {
    let isMounted = true;

    const fetchLiveEvents = async () => {
      try {
        const res = await eventService.getAll({ status: 'Upcoming' });
        if (res.data?.success && res.data.data?.length > 0 && isMounted) {
          const liveEvents = res.data.data.map((e) => {
            const matchedActivity = COLLEGE_ACTIVITIES.find(
              (act) =>
                act.category.toLowerCase() === (e.category || '').toLowerCase() ||
                act.name.toLowerCase() === (e.category || '').toLowerCase()
            );

            return {
              id: e._id,
              title: e.title,
              category: matchedActivity ? matchedActivity.name : e.category || 'General',
              date: e.date,
              time: e.time || '10:00 AM - 04:00 PM',
              venue: e.venue,
              department: e.department || 'Campus Department',
              capacity: e.capacity || 100,
              spotsLeft: Math.max(0, (e.capacity || 100) - (e.registeredCount || 0)),
              image: e.image || matchedActivity?.image || FALLBACK_EVENT_IMAGE,
              description: e.description || '',
            };
          });

          // Merge live events with curated showcase so cards are always populated
          setEventsList(liveEvents);
        }
      } catch (err) {
        console.warn('Live events sync notice (using curated default events):', err?.message || err);
      }
    };

    fetchLiveEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth scroll to section if URL hash is present (e.g. /#events, /#about, /#contact)
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  // Fetch student's existing registrations if logged in
  useEffect(() => {
    if (token && user?.role === 'student') {
      registrationService
        .getMyRegistrations()
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.data)) {
            const ids = new Set(res.data.data.map((r) => r.event?._id || r.event));
            setRegisteredIds(ids);
          }
        })
        .catch(() => {
          // Ignore registration sync issues on landing page
        });
    }
  }, [token, user]);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // Direct handlers for active in-image buttons
  const handleExploreEvents = (e) => {
    if (e) e.preventDefault();
    setSelectedCategory('All');
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroBadgeSelect = (categoryName) => {
    setSelectedCategory(categoryName);
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Event Registration directly from Landing Page - Opens Category Themed Template Modal
  const handleRegisterClick = (event) => {
    if (!token) {
      // Guide unauthenticated users to signup/login
      navigate('/signup');
      return;
    }

    if (user?.role === 'organizer') {
      showToast('Faculty & Organizers coordinate events from the Organizer Dashboard.', 'info');
      navigate('/organizer-dashboard');
      return;
    }

    // Open dedicated category-themed registration template (Hackathon, Cultural, Sports, etc.)
    setThemedModalEvent(event);
  };

  const handleConfirmThemedRegistration = async (event, customFormData) => {
    try {
      setRegisteringId(event.id);
      const res = await registrationService.register(event.id);
      if (res.data?.success) {
        setRegisteredIds((prev) => new Set([...prev, event.id]));
        showToast(`Registration confirmed for "${event.title}"! Digital pass generated.`, 'success');
        return {
          passCode: res.data.data?.passCode || `PASS-${event.id?.toString().slice(-4).toUpperCase() || '8842'}`,
          ...res.data.data,
        };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration request could not be completed.';
      showToast(msg, 'error');
      throw err;
    } finally {
      setRegisteringId(null);
    }
  };

  // Filter Categories matching the 8 college activities
  const categoryFilters = useMemo(
    () => ['All', ...COLLEGE_ACTIVITIES.map((act) => act.name)],
    []
  );

  // Filter Events by Category & Search query
  const filteredEvents = useMemo(() => {
    return eventsList.filter((evt) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        evt.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Cultural Events' && evt.category.toLowerCase().includes('cultural')) ||
        (selectedCategory === 'Hackathons' && evt.category.toLowerCase().includes('hackathon')) ||
        (selectedCategory === 'Technical Events' && evt.category.toLowerCase().includes('technical')) ||
        (selectedCategory === 'Workshops' && evt.category.toLowerCase().includes('workshop')) ||
        (selectedCategory === 'Sports' && evt.category.toLowerCase().includes('sport')) ||
        (selectedCategory === 'Competitions' && evt.category.toLowerCase().includes('competition')) ||
        (selectedCategory === 'Seminars' && evt.category.toLowerCase().includes('seminar')) ||
        (selectedCategory === 'Club Activities' && evt.category.toLowerCase().includes('club'));

      const matchesSearch =
        !searchQuery.trim() ||
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.department.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [eventsList, selectedCategory, searchQuery]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    showToast('Your message has been sent to the Campus Event Desk!', 'success');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-wrapper landing-premium-theme">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div className={`landing-toast toast-${toastNotification.type}`}>
          <Sparkles size={16} />
          <span>{toastNotification.message}</span>
        </div>
      )}

      {/* QR Digital Pass Modal */}
      {activePassRegistration && (
        <QRCodePassModal
          registration={activePassRegistration}
          onClose={() => setActivePassRegistration(null)}
        />
      )}

      {/* Category Themed Event Registration & Pass Modal */}
      {themedModalEvent && (
        <ThemedEventRegistrationModal
          event={themedModalEvent}
          student={user}
          isAlreadyRegistered={registeredIds.has(themedModalEvent.id)}
          onClose={() => setThemedModalEvent(null)}
          onConfirmRegistration={handleConfirmThemedRegistration}
        />
      )}

      <main>
        {/* ====================================================================
            1. TACTILE EDITORIAL SKETCHBOOK SYSTEM (Interactive Travel Journal)
            ==================================================================== */}
        <SketchbookLanding
          events={eventsList}
          registeredIds={registeredIds}
          onRegisterClick={handleRegisterClick}
          token={token}
          user={user}
          showToast={showToast}
        />

        {/* Platform Stats Ribbon */}
        <div className="hero-stats-ribbon">
          <div className="container">
            <div className="stats-ribbon-grid">
              {PLATFORM_STATS.map((st) => (
                <div key={st.label} className="stats-ribbon-item">
                  <span className="stats-ribbon-number">{st.value}</span>
                  <span className="stats-ribbon-label">{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================================
            2. EVENT CATEGORIES SECTION (Explicitly showcasing the 8 activities)
            ==================================================================== */}
        <section className="categories-section" id="categories">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">Campus Life Spectrum</span>
              <h2 className="section-title">Event Categories</h2>
              <p className="section-subtitle">
                Explore dedicated programs, competitions, and gatherings designed to enrich your
                academic journey and collegiate experience.
              </p>
            </div>

            <div className="categories-grid-8">
              {COLLEGE_ACTIVITIES.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card-premium"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    const el = document.getElementById('events');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="category-card-image-box">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="category-card-img"
                      onError={(e) => {
                        e.target.src = FALLBACK_EVENT_IMAGE;
                      }}
                    />
                    <div className="category-image-gradient"></div>
                    <div className="category-icon-bubble">
                      {renderActivityIcon(cat.iconName, 22, 'category-icon')}
                    </div>
                  </div>

                  <div className="category-card-content">
                    <h3 className="category-card-title">{cat.name}</h3>
                    <p className="category-card-tagline">{cat.tagline}</p>
                    <p className="category-card-desc">{cat.description}</p>

                    <div className="category-card-action">
                      <span className="category-explore-link">
                        Explore Category <ChevronRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. UPCOMING EVENTS SECTION (Rich cards with filter & register actions)
            ==================================================================== */}
        <section className="events-preview-section" id="events">
          <div className="container">
            <div className="preview-top-bar">
              <div className="preview-top-header">
                <span className="section-tag">Calendar & Registrations</span>
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-subtitle">
                  Discover upcoming hackathons, fests, workshops, and meets. Secure your spot in
                  seconds.
                </p>
              </div>

              {/* Search input for events */}
              <div className="events-search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search events, venues, or departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="events-search-input"
                />
                {searchQuery && (
                  <button
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Filter pills for All + the 8 activities */}
            <div className="category-filters-container">
              <div className="category-filters scrollable-filter-row">
                {categoryFilters.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Cards Grid */}
            {filteredEvents.length === 0 ? (
              <div className="empty-events-state">
                <Calendar size={48} className="empty-icon" />
                <h3>No events match your criteria</h3>
                <p>Try resetting the category filter or search keywords.</p>
                <button
                  className="btn btn-primary btn-sm mt-3"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="events-grid-modern">
                {filteredEvents.map((evt) => {
                  const isRegistered = registeredIds.has(evt.id);
                  const isRegistering = registeringId === evt.id;

                  return (
                    <div key={evt.id} className="event-card-modern">
                      {/* Event Image Box */}
                      <div className="event-image-box">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="event-img"
                          onError={(e) => {
                            e.target.src = FALLBACK_EVENT_IMAGE;
                          }}
                        />
                        <span className="event-badge-cat">{evt.category}</span>
                        <span className="event-badge-spots">
                          {evt.spotsLeft > 0 ? `${evt.spotsLeft} spots open` : 'Full Capacity'}
                        </span>
                        {isRegistered && (
                          <span className="event-badge-registered">
                            <CheckCircle2 size={13} /> Registered
                          </span>
                        )}
                      </div>

                      {/* Event Card Content */}
                      <div className="event-card-content">
                        <div className="event-dept-tag">
                          <span>{evt.department}</span>
                        </div>

                        <h3 className="event-title">{evt.title}</h3>
                        <p className="event-desc">{evt.description}</p>

                        <div className="event-info-list">
                          <div className="info-row">
                            <Calendar size={15} className="info-icon" />
                            <span>{evt.date}</span>
                          </div>
                          <div className="info-row">
                            <Clock size={15} className="info-icon" />
                            <span>{evt.time}</span>
                          </div>
                          <div className="info-row">
                            <MapPin size={15} className="info-icon" />
                            <span>{evt.venue}</span>
                          </div>
                        </div>

                        <div className="event-card-actions">
                          <button
                            onClick={() => handleRegisterClick(evt)}
                            disabled={isRegistering}
                            className={`btn ${
                              isRegistered
                                ? 'btn-outline-success'
                                : evt.spotsLeft === 0
                                ? 'btn-disabled'
                                : 'btn-primary'
                            } btn-block`}
                          >
                            {isRegistering ? (
                              'Processing...'
                            ) : isRegistered ? (
                              <>
                                <Check size={16} /> View Digital Pass
                              </>
                            ) : evt.spotsLeft === 0 ? (
                              'Registration Full'
                            ) : (
                              <>
                                Register for Event <ChevronRight size={16} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="text-center mt-5">
              <Link to="/signup" className="btn btn-outline btn-lg">
                View All Events & Join Platform <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ABOUT SECTION
            ==================================================================== */}
        <section className="about-section" id="about">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">About the System</span>
              <h2 className="section-title">The Unified Digital Hub for University Events</h2>
              <p className="section-subtitle">
                Designed specifically for modern campus ecosystems to replace scattered paper
                notices, fragmented spreadsheets, and chaotic lineups with a smooth, automated
                digital experience.
              </p>
            </div>

            <div className="about-grid-3">
              <div className="about-card">
                <div className="about-icon-box bg-indigo-subtle">
                  <BookOpen size={28} className="text-indigo" />
                </div>
                <h3>For Students</h3>
                <p>
                  Explore college festivals, hackathons, seminars, and varsity sports meets.
                  Register with a single click, instantly generate QR passes, and build an
                  accredited portfolio of co-curricular achievements.
                </p>
                <ul className="about-list">
                  <li>Instant registrations with student profiles</li>
                  <li>Real-time schedules, guidelines, and venue maps</li>
                  <li>Digital certificates and participation logs</li>
                </ul>
              </div>

              <div className="about-card">
                <div className="about-icon-box bg-violet-subtle">
                  <Users size={28} className="text-violet" />
                </div>
                <h3>For Department Organizers</h3>
                <p>
                  Create, publish, and supervise departmental events with ease. Manage participant
                  capacities, inspect attendee rosters in real time, and export verified records for
                  academic and audit purposes.
                </p>
                <ul className="about-list">
                  <li>Rapid event creation with custom guidelines</li>
                  <li>Live attendance roster and CSV exports</li>
                  <li>Department-specific coordination controls</li>
                </ul>
              </div>

              <div className="about-card">
                <div className="about-icon-box bg-emerald-subtle">
                  <ShieldCheck size={28} className="text-emerald" />
                </div>
                <h3>For Campus Clubs & Societies</h3>
                <p>
                  Empower student societies to mobilize talent, launch annual fests, recruit
                  members, and host inter-college tournaments backed by reliable cloud
                  infrastructure.
                </p>
                <ul className="about-list">
                  <li>Club activity announcements and recruitment</li>
                  <li>QR-code admission scanners for event desks</li>
                  <li>Automated notifications and reminders</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            5. KEY CAPABILITIES (6 Features Grid)
            ==================================================================== */}
        <section className="features-section" id="features">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">Key Capabilities</span>
              <h2 className="section-title">Everything Needed for College Event Success</h2>
              <p className="section-subtitle">
                Purpose-built features crafted to maximize student engagement and streamline campus
                event administration.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon bg-amber-subtle">
                  <Compass size={26} className="text-amber" />
                </div>
                <h3 className="feature-title">1. Discover Events</h3>
                <p className="feature-text">
                  Browse a curated feed of all campus events categorized by technical, cultural,
                  sports, and workshops with instant search and department filters.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon bg-emerald-subtle">
                  <CheckCircle2 size={26} className="text-emerald" />
                </div>
                <h3 className="feature-title">2. Register for Events</h3>
                <p className="feature-text">
                  Join events instantly with your student profile. Reserve seats, receive digital
                  QR confirmation, and access attendee materials.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon bg-amber-subtle">
                  <CalendarDays size={26} className="text-amber" />
                </div>
                <h3 className="feature-title">3. Organize Events</h3>
                <p className="feature-text">
                  Department faculty and club leads can publish rich event postings with dates,
                  locations, schedules, and capacity caps in minutes.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon bg-purple-subtle">
                  <Users size={26} className="text-purple" />
                </div>
                <h3 className="feature-title">4. Manage Participants</h3>
                <p className="feature-text">
                  View real-time registrations, filter by department, download attendee rosters, and
                  ensure proper venue allocation and logistics.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon bg-rose-subtle">
                  <BellRing size={26} className="text-rose" />
                </div>
                <h3 className="feature-title">5. Event Notifications</h3>
                <p className="feature-text">
                  Never miss an important event. Receive automated alerts about upcoming deadlines,
                  venue changes, and certificate releases.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon bg-violet-subtle">
                  <BarChart3 size={26} className="text-violet" />
                </div>
                <h3 className="feature-title">6. Track Participation</h3>
                <p className="feature-text">
                  Maintain a comprehensive digital transcript of all completed events and earned
                  campus engagement credentials for your career profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            6. CONTACT SECTION (Direct support cards + inquiry form)
            ==================================================================== */}
        <section className="contact-section" id="contact">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">Campus Support & Inquiry</span>
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-subtitle">
                Have questions about participating, organizing an event, or integrating your student
                club? Our campus event desk is here to help.
              </p>
            </div>

            <div className="contact-layout-grid">
              {/* Contact Information Cards */}
              <div className="contact-cards-column">
                {CONTACT_CARDS.map((card) => (
                  <div key={card.title} className="contact-info-card">
                    <div className="contact-card-icon-box">
                      {card.icon === 'Mail' && <Mail size={22} className="text-primary" />}
                      {card.icon === 'Building' && <Building size={22} className="text-primary" />}
                      {card.icon === 'Users' && <Users size={22} className="text-primary" />}
                    </div>
                    <div className="contact-card-text">
                      <h4>{card.title}</h4>
                      <p>{card.desc}</p>
                      <strong className="contact-highlight">{card.contact}</strong>
                      <span className="contact-meta">{card.info}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Inquiry Form */}
              <div className="contact-form-card">
                <h3 className="form-card-title">Send a Campus Inquiry</h3>
                <p className="form-card-subtitle">
                  We typically respond within one business day during semester sessions.
                </p>

                {contactSubmitted ? (
                  <div className="form-success-banner">
                    <CheckCircle2 size={24} className="text-emerald" />
                    <div>
                      <strong>Message Received!</strong>
                      <p>Thank you for reaching out. The coordinating desk will get back to you shortly.</p>
                      <button
                        className="btn btn-outline btn-sm mt-3"
                        onClick={() => setContactSubmitted(false)}
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="landing-inquiry-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="inquiry-name">Your Name</label>
                        <input
                          id="inquiry-name"
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, name: e.target.value })
                          }
                          placeholder="e.g. Alex Rivera"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="inquiry-email">College Email</label>
                        <input
                          id="inquiry-email"
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, email: e.target.value })
                          }
                          placeholder="your.name@college.edu"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="inquiry-subject">Subject</label>
                      <input
                        id="inquiry-subject"
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, subject: e.target.value })
                        }
                        placeholder="Event registration, venue inquiry, or society query"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="inquiry-message">Message</label>
                      <textarea
                        id="inquiry-message"
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, message: e.target.value })
                        }
                        placeholder="Describe your question or proposed event details..."
                        className="form-input form-textarea"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                      <Send size={16} /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            7. CALL TO ACTION SECTION
            ==================================================================== */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box cta-box-rich">
              <div className="cta-glow-backdrop"></div>
              <div className="cta-content">
                <span className="cta-badge">Ready to Participate?</span>
                <h2>Elevate your college event experience today</h2>
                <p>
                  Join thousands of active students and department organizers. Discover inspiring
                  events, reserve seats instantly, and celebrate campus culture.
                </p>
                <div className="cta-buttons">
                  <Link to="/signup" className="btn btn-primary btn-lg">
                    Create Free Account
                  </Link>
                  <Link to="/login" className="btn btn-ghost-light btn-lg auth-signin-btn" data-auth="signin">
                    Sign In to Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
