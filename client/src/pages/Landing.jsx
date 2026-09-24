import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Compass,
  CheckCircle2,
  CalendarDays,
  Users2,
  BellRing,
  BarChart3,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  Clock,
  Award,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

const upcomingEventsData = [
  {
    id: 1,
    title: 'HackCampus 2026: 36-Hour Hackathon',
    category: 'Hackathon',
    date: 'Oct 14-16, 2026',
    time: '09:00 AM - 09:00 PM',
    venue: 'Campus Innovation Hub & Auditorium',
    department: 'Computer Science & Engineering',
    spotsLeft: 42,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=80',
    description: 'Build breakthrough applications in AI, Web3, and IoT with mentorship from leading tech pioneers.',
  },
  {
    id: 2,
    title: 'Tarang: Annual Inter-College Cultural Fest',
    category: 'Cultural',
    date: 'Nov 02-04, 2026',
    time: '10:00 AM - 10:00 PM',
    venue: 'Open Air Amphitheatre',
    department: 'Student Affairs & Arts Council',
    spotsLeft: 150,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80',
    description: 'Three electrifying days of music battles, classical dance, theatrical drama, and art exhibitions.',
  },
  {
    id: 3,
    title: 'International Robotics & AI Symposium',
    category: 'Technical',
    date: 'Nov 18, 2026',
    time: '09:30 AM - 05:00 PM',
    venue: 'Mechanical & Robotics Center',
    department: 'Electronics & Mechanical',
    spotsLeft: 28,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80',
    description: 'Keynotes from autonomous vehicle researchers, live humanoid bot demos, and hands-on ROS workshops.',
  },
  {
    id: 4,
    title: 'Campus Leadership & Entrepreneurship Summit',
    category: 'Workshop',
    date: 'Dec 05, 2026',
    time: '11:00 AM - 04:00 PM',
    venue: 'Executive Seminar Hall A',
    department: 'Business Administration',
    spotsLeft: 60,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=700&q=80',
    description: 'Pitch ideas to campus incubators and angel investors. Learn from founders of top YC alumni startups.',
  },
];

const Landing = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Hackathon', 'Cultural', 'Technical', 'Workshop'];

  const filteredEvents =
    selectedCategory === 'All'
      ? upcomingEventsData
      : upcomingEventsData.filter((e) => e.category === selectedCategory);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-background-glow"></div>
          <div className="container hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={16} className="badge-sparkle" />
                <span>Empowering Student Campus Life</span>
              </div>

              <h1 className="hero-title">
                College Event <span className="text-gradient">Management System</span>
              </h1>

              <p className="hero-subtitle">
                Discover, organize and participate in exciting college events from one platform.
              </p>

              <div className="hero-actions">
                <a href="#events" className="btn btn-primary btn-lg">
                  Explore Events <ArrowRight size={18} />
                </a>
                <Link to="/signup" className="btn btn-secondary btn-lg">
                  Get Started
                </Link>
              </div>

              {/* Live stats counter */}
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Annual Events</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">12,000+</span>
                  <span className="stat-label">Active Participants</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">24+</span>
                  <span className="stat-label">College Departments</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card-stack">
                <div className="floating-preview-card main-card">
                  <div className="preview-card-header">
                    <span className="card-tag">Featured Event</span>
                    <span className="live-pulse-badge">
                      <span className="pulse-dot"></span> Live Registration
                    </span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80"
                    alt="Campus Tech Fest"
                    className="preview-img"
                  />
                  <div className="preview-card-body">
                    <h3>National Collegiate Tech Symposium 2026</h3>
                    <p className="preview-meta">
                      <Calendar size={14} /> Oct 24, 2026 • Main Auditorium
                    </p>
                    <div className="preview-footer">
                      <div className="avatar-group">
                        <span className="avatar-mini">A</span>
                        <span className="avatar-mini">B</span>
                        <span className="avatar-mini">C</span>
                        <span className="avatar-count">+240 registered</span>
                      </div>
                      <Link to="/signup" className="btn btn-primary btn-sm">
                        Join Now
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="floating-badge badge-top-right">
                  <Award size={20} className="text-amber" />
                  <div>
                    <strong>Certificates Issued</strong>
                    <small>Official Verified Credentials</small>
                  </div>
                </div>

                <div className="floating-badge badge-bottom-left">
                  <Users2 size={20} className="text-indigo" />
                  <div>
                    <strong>Role-Based Portals</strong>
                    <small>Students & Organizers</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="about">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">About CampusEvents</span>
              <h2 className="section-title">The Unified Digital Hub for University Events</h2>
              <p className="section-subtitle">
                Designed specifically for collegiate ecosystems to replace disorganized notice boards,
                endless spreadsheets, and fragmented registrations with a streamlined, modern experience.
              </p>
            </div>

            <div className="about-grid">
              <div className="about-card">
                <div className="about-icon-box bg-indigo-subtle">
                  <BookOpen size={28} className="text-indigo" />
                </div>
                <h3>For Students</h3>
                <p>
                  Explore college festivals, hackathons, seminars, and sports meets. Register with a single click,
                  receive event updates, track your participation history, and build your extracurricular portfolio.
                </p>
                <ul className="about-list">
                  <li>Instant registrations with your college ID</li>
                  <li>Real-time schedules and venue details</li>
                  <li>Participation records for academic credits</li>
                </ul>
              </div>

              <div className="about-card">
                <div className="about-icon-box bg-violet-subtle">
                  <Users2 size={28} className="text-violet" />
                </div>
                <h3>For Department Organizers</h3>
                <p>
                  Create, publish, and supervise college events seamlessly. Monitor registered participant rosters,
                  verify attendee departments, and broadcast urgent schedule changes effortlessly.
                </p>
                <ul className="about-list">
                  <li>Custom event creation with date and venue</li>
                  <li>Automated participant roster tracking</li>
                  <li>Department-specific coordination tools</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION (6 Cards required) */}
        <section className="features-section" id="features">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-tag">Key Capabilities</span>
              <h2 className="section-title">Everything Needed for College Event Success</h2>
              <p className="section-subtitle">
                Powerful, purpose-built features crafted to enhance campus engagement and simplify administration.
              </p>
            </div>

            <div className="features-grid">
              {/* Feature 1 */}
              <div className="feature-card">
                <div className="feature-icon bg-blue-subtle">
                  <Compass size={26} className="text-blue" />
                </div>
                <h3 className="feature-title">1. Discover Events</h3>
                <p className="feature-text">
                  Browse a curated feed of all campus events categorized by technical, cultural, sports,
                  and workshops with smart search and department filters.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="feature-card">
                <div className="feature-icon bg-emerald-subtle">
                  <CheckCircle2 size={26} className="text-emerald" />
                </div>
                <h3 className="feature-title">2. Register for Events</h3>
                <p className="feature-text">
                  Join events instantly with your authenticated student profile. Reserve seats, receive digital confirmation,
                  and access exclusive attendee material.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="feature-card">
                <div className="feature-icon bg-amber-subtle">
                  <CalendarDays size={26} className="text-amber" />
                </div>
                <h3 className="feature-title">3. Organize Events</h3>
                <p className="feature-text">
                  Department faculty and club leads can publish rich event postings with dates, locations,
                  guidelines, and participant capacities in minutes.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="feature-card">
                <div className="feature-icon bg-purple-subtle">
                  <Users2 size={26} className="text-purple" />
                </div>
                <h3 className="feature-title">4. Manage Participants</h3>
                <p className="feature-text">
                  View real-time registrations, filter by department, download participant rosters,
                  and ensure proper venue allocation.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="feature-card">
                <div className="feature-icon bg-rose-subtle">
                  <BellRing size={26} className="text-rose" />
                </div>
                <h3 className="feature-title">5. Event Notifications</h3>
                <p className="feature-text">
                  Never miss an important event. Receive automated alerts about upcoming deadlines, venue updates,
                  and certificate availability.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="feature-card">
                <div className="feature-icon bg-cyan-subtle">
                  <BarChart3 size={26} className="text-cyan" />
                </div>
                <h3 className="feature-title">6. Track Participation</h3>
                <p className="feature-text">
                  Maintain a comprehensive digital log of all completed events, won competitions, and earned
                  campus engagement badges for placement resumes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS PREVIEW SECTION */}
        <section className="events-preview-section" id="events">
          <div className="container">
            <div className="preview-top-bar">
              <div>
                <span className="section-tag">What's Happening</span>
                <h2 className="section-title">Upcoming College Events</h2>
              </div>

              {/* Category Pills */}
              <div className="category-filters">
                {categories.map((cat) => (
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

            <div className="events-grid">
              {filteredEvents.map((evt) => (
                <div key={evt.id} className="event-card">
                  <div className="event-image-box">
                    <img src={evt.image} alt={evt.title} className="event-img" />
                    <span className="event-badge-cat">{evt.category}</span>
                    <span className="event-badge-spots">{evt.spotsLeft} spots open</span>
                  </div>

                  <div className="event-card-content">
                    <div className="event-card-header">
                      <span className="event-dept">{evt.department}</span>
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
                      <Link to="/login" className="btn btn-primary btn-block">
                        Register for Event <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <Link to="/signup" className="btn btn-outline btn-lg">
                View All Events & Join Platform <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <div className="cta-content">
                <h2>Ready to elevate your college event experience?</h2>
                <p>
                  Join thousands of fellow students and department faculty members today.
                  Free registration with your college email.
                </p>
                <div className="cta-buttons">
                  <Link to="/signup" className="btn btn-primary btn-lg">
                    Create Free Account
                  </Link>
                  <Link to="/login" className="btn btn-ghost btn-lg">
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
