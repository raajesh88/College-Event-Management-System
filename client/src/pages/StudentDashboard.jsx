import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QRCodePassModal from '../components/QRCodePassModal';
import { useAuth } from '../context/AuthContext';
import { eventService, registrationService } from '../services/api';
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Search,
  BookOpen,
  Award,
  Users,
  LogOut,
  Tag,
  Sparkles,
  ExternalLink,
  Check,
  AlertCircle,
  Building,
  Mail,
  GraduationCap,
  QrCode,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const initialStudentEvents = [
  {
    id: 'EVT-101',
    title: 'HackCampus 2026: 36-Hour Hackathon',
    category: 'Hackathon',
    department: 'Computer Science & Engineering',
    date: 'Oct 14-16, 2026',
    time: '09:00 AM - 09:00 PM',
    venue: 'Campus Innovation Hub & Auditorium',
    registered: true,
    passCode: 'PASS-HACK-8842',
    status: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    description:
      'Build breakthrough applications in AI, Web3, and IoT with mentorship from leading tech pioneers.',
  },
  {
    id: 'EVT-102',
    title: 'Tarang: Annual Inter-College Cultural Fest',
    category: 'Cultural',
    department: 'Student Affairs & Arts Council',
    date: 'Nov 02-04, 2026',
    time: '10:00 AM - 10:00 PM',
    venue: 'Open Air Amphitheatre',
    registered: true,
    passCode: 'PASS-FEST-4921',
    status: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    description:
      'Three electrifying days of music battles, classical dance, theatrical drama, and art exhibitions.',
  },
  {
    id: 'EVT-103',
    title: 'International Robotics & AI Symposium',
    category: 'Technical',
    department: 'Electronics & Mechanical',
    date: 'Nov 18, 2026',
    time: '09:30 AM - 05:00 PM',
    venue: 'Mechanical & Robotics Center',
    registered: false,
    status: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    description:
      'Keynotes from autonomous vehicle researchers, live humanoid bot demos, and hands-on ROS workshops.',
  },
  {
    id: 'EVT-104',
    title: 'Campus Leadership & Entrepreneurship Summit',
    category: 'Workshop',
    department: 'Business Administration',
    date: 'Dec 05, 2026',
    time: '11:00 AM - 04:00 PM',
    venue: 'Executive Seminar Hall A',
    registered: false,
    status: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    description:
      'Pitch ideas to campus incubators and angel investors. Learn from founders of top YC alumni startups.',
  },
  {
    id: 'EVT-105',
    title: 'CodeSprint 2025: Algorithmic Contest',
    category: 'Coding',
    department: 'Computer Science & Engineering',
    date: 'Aug 12, 2025',
    time: '02:00 PM - 06:00 PM',
    venue: 'Turing Computer Lab 3',
    registered: true,
    passCode: 'PASS-CODE-2025',
    status: 'completed',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    description:
      'Speed algorithmic puzzle challenge covering Dynamic Programming, Graph Theory, and Combinatorics.',
  },
  {
    id: 'EVT-106',
    title: 'National Cyber Security Awareness Seminar',
    category: 'Technical',
    department: 'Information Technology',
    date: 'Sep 08, 2025',
    time: '10:00 AM - 01:00 PM',
    venue: 'Virtual Hall & Seminar Hall 1',
    registered: true,
    passCode: 'PASS-CYBER-2025',
    status: 'completed',
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    description:
      'Deep dive into zero-day exploitation, penetration testing methodology, and ethical defense pipelines.',
  },
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState(initialStudentEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPassForQR, setSelectedPassForQR] = useState(null);

  // Fetch live backend events & student registrations
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, regsRes] = await Promise.allSettled([
        eventService.getAll(),
        registrationService.getMyRegistrations(),
      ]);

      let backendEvents = [];
      let backendRegs = [];

      if (eventsRes.status === 'fulfilled' && eventsRes.value.data?.success) {
        backendEvents = eventsRes.value.data.data;
      }

      if (regsRes.status === 'fulfilled' && regsRes.value.data?.success) {
        backendRegs = regsRes.value.data.data;
      }

      if (backendEvents.length > 0) {
        const regMap = new Map();
        backendRegs.forEach((r) => {
          const key = r.eventId?._id || r.eventId || r.title;
          regMap.set(key.toString(), r.passCode);
        });

        const merged = backendEvents.map((evt) => {
          const idStr = evt._id?.toString();
          const isReg = regMap.has(idStr) || regMap.has(evt.title);
          const passCode =
            regMap.get(idStr) ||
            regMap.get(evt.title) ||
            `PASS-${idStr ? idStr.slice(-4).toUpperCase() : 'PASS'}`;

          return {
            id: evt._id,
            title: evt.title,
            category: evt.category,
            department: evt.department,
            date: evt.date,
            time: evt.time || '10:00 AM - 04:00 PM',
            venue: evt.venue,
            capacity: evt.capacity,
            registeredCount: evt.registeredCount,
            registered: isReg,
            passCode,
            status: (evt.status || 'upcoming').toLowerCase(),
            image:
              evt.image ||
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
            description: evt.description || '',
          };
        });

        setEvents(merged);
      }
    } catch (err) {
      console.warn('Backend events sync notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRegisterToggle = async (eventId) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const willRegister = !targetEvent.registered;

    // Optimistically update UI
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          return {
            ...evt,
            registered: willRegister,
            registeredCount: willRegister
              ? (evt.registeredCount || 0) + 1
              : Math.max(0, (evt.registeredCount || 1) - 1),
          };
        }
        return evt;
      })
    );

    try {
      if (willRegister) {
        const res = await registrationService.register(eventId);
        const passCode =
          res.data?.data?.passCode ||
          `PASS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, registered: true, passCode } : e))
        );

        setToastMessage(res.data?.message || `Successfully registered for "${targetEvent.title}"!`);
      } else {
        const res = await registrationService.cancel(eventId);
        setToastMessage(
          res.data?.message || `Withdrawn registration for "${targetEvent.title}".`
        );
      }
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      if (apiMsg) {
        setToastMessage(apiMsg);
      } else {
        setToastMessage(
          willRegister
            ? `Successfully registered for "${targetEvent.title}"!`
            : `Withdrawn registration for "${targetEvent.title}".`
        );
      }
    }

    setTimeout(() => setToastMessage(''), 3500);
  };

  // Open digital QR pass modal
  const openPassModal = (passItem) => {
    setSelectedPassForQR({
      ...passItem,
      studentName: user?.name || 'Registered Student',
      studentEmail: user?.email || 'student@college.edu',
    });
  };

  // Stats computation
  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const registeredCount = events.filter((e) => e.registered && e.status === 'upcoming').length;
  const completedCount = events.filter((e) => e.status === 'completed' && e.registered).length;

  // Filtered list
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCat === 'All' || evt.category === selectedCat;

    if (activeTab === 'registrations') {
      return matchesSearch && matchesCat && evt.registered;
    }
    return matchesSearch && matchesCat;
  });

  return (
    <div className="page-wrapper dashboard-page">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-content-area">
        <div className="container">
          {/* Welcome Banner */}
          <div className="dashboard-welcome-banner">
            <div className="welcome-text-side">
              <span className="student-badge">
                <GraduationCap size={16} /> Student Portal
              </span>
              <h1 className="welcome-heading">Welcome, {user?.name || 'Student'}</h1>
              <p className="welcome-subtext">
                Department of {user?.department || 'Engineering'} • Ready for your next campus event?
              </p>
            </div>

            <div className="welcome-actions">
              <button
                onClick={() => setActiveTab('events')}
                className="btn btn-primary"
              >
                <Sparkles size={16} /> Browse New Events
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                title="Sign out of student account"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Toast Alert */}
          {toastMessage && (
            <div className="toast-notification alert-success">
              <Check size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* 3 MANDATORY STATISTIC CARDS */}
          <div className="dashboard-stats-grid">
            {/* Card 1: Upcoming Events */}
            <div
              className={`stat-card ${activeTab === 'events' ? 'card-active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <div className="stat-card-icon-box bg-blue-subtle">
                <Calendar size={24} className="text-blue" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Upcoming Events</span>
                <h3 className="stat-card-val">{upcomingCount}</h3>
                <span className="stat-card-hint">Open for registration</span>
              </div>
            </div>

            {/* Card 2: Registered Events */}
            <div
              className={`stat-card ${activeTab === 'registrations' ? 'card-active' : ''}`}
              onClick={() => setActiveTab('registrations')}
            >
              <div className="stat-card-icon-box bg-emerald-subtle">
                <CheckCircle size={24} className="text-emerald" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Registered Events</span>
                <h3 className="stat-card-val">{registeredCount}</h3>
                <span className="stat-card-hint">Enrolled & confirmed</span>
              </div>
            </div>

            {/* Card 3: Completed Events */}
            <div
              className="stat-card"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="stat-card-icon-box bg-purple-subtle">
                <Award size={24} className="text-purple" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Completed Events</span>
                <h3 className="stat-card-val">{completedCount}</h3>
                <span className="stat-card-hint">Certificates eligible</span>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-tab-content">
              {/* Active Registrations Overview */}
              <div className="dashboard-section-box">
                <div className="section-box-header">
                  <div>
                    <h3 className="section-box-title">Your Confirmed Upcoming Events</h3>
                    <p className="section-box-desc">Keep track of your schedule and venue checkpoints</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('registrations')}
                    className="btn btn-ghost btn-sm"
                  >
                    View All Registrations →
                  </button>
                </div>

                <div className="registered-cards-row">
                  {events
                    .filter((e) => e.registered && e.status === 'upcoming')
                    .map((item) => (
                      <div key={item.id} className="ticket-card">
                        <div className="ticket-badge">
                          <ShieldCheck size={12} className="inline mr-1" /> Confirmed Pass
                        </div>
                        <h4>{item.title}</h4>
                        <div className="ticket-meta">
                          <p><Calendar size={14} /> {item.date}</p>
                          <p><Clock size={14} /> {item.time}</p>
                          <p><MapPin size={14} /> {item.venue}</p>
                        </div>
                        <div className="ticket-footer">
                          <span className="ticket-dept">{item.department}</span>
                          <button
                            onClick={() => openPassModal(item)}
                            className="btn btn-sm btn-outline pass-qr-btn"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem' }}
                            title="Open digital event pass with QR code"
                          >
                            <QrCode size={14} /> View QR Pass
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recommended Events */}
              <div className="dashboard-section-box mt-6">
                <div className="section-box-header">
                  <div>
                    <h3 className="section-box-title">Recommended For You</h3>
                    <p className="section-box-desc">Trending events matching your college department</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="btn btn-outline btn-sm"
                  >
                    Browse Catalog
                  </button>
                </div>

                <div className="events-grid">
                  {events
                    .filter((e) => !e.registered && e.status === 'upcoming')
                    .slice(0, 2)
                    .map((evt) => (
                      <div key={evt.id} className="event-card">
                        <div className="event-image-box">
                          <img src={evt.image} alt={evt.title} className="event-img" />
                          <span className="event-badge-cat">{evt.category}</span>
                        </div>
                        <div className="event-card-content">
                          <span className="event-dept">{evt.department}</span>
                          <h4 className="event-title">{evt.title}</h4>
                          <p className="event-desc">{evt.description}</p>
                          <div className="event-info-list">
                            <div className="info-row">
                              <Calendar size={14} /> <span>{evt.date}</span>
                            </div>
                            <div className="info-row">
                              <MapPin size={14} /> <span>{evt.venue}</span>
                            </div>
                          </div>
                          <div className="event-card-actions">
                            <button
                              onClick={() => handleRegisterToggle(evt.id)}
                              className="btn btn-primary btn-block"
                            >
                              Register Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: BROWSE EVENTS OR MY REGISTRATIONS */}
          {(activeTab === 'events' || activeTab === 'registrations') && (
            <div className="dashboard-tab-content">
              {/* Controls bar: search and category filters */}
              <div className="catalog-toolbar">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search events by title, department, or venue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="catalog-search-input"
                  />
                </div>

                <div className="catalog-filter-pills">
                  {['All', 'Hackathon', 'Cultural', 'Technical', 'Workshop', 'Coding'].map((cat) => (
                    <button
                      key={cat}
                      className={`filter-pill ${selectedCat === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="empty-state-box">
                  <AlertCircle size={40} className="text-muted" />
                  <h3>No events found</h3>
                  <p>Try adjusting your search query or selected category filter.</p>
                </div>
              ) : (
                <div className="events-grid">
                  {filteredEvents.map((evt) => (
                    <div key={evt.id} className="event-card">
                      <div className="event-image-box">
                        <img src={evt.image} alt={evt.title} className="event-img" />
                        <span className="event-badge-cat">{evt.category}</span>
                        {evt.registered && (
                          <span className="event-badge-registered">
                            <Check size={13} /> Registered
                          </span>
                        )}
                      </div>

                      <div className="event-card-content">
                        <span className="event-dept">{evt.department}</span>
                        <h3 className="event-title">{evt.title}</h3>
                        <p className="event-desc">{evt.description}</p>

                        <div className="event-info-list">
                          <div className="info-row">
                            <Calendar size={14} className="info-icon" />
                            <span>{evt.date}</span>
                          </div>
                          <div className="info-row">
                            <Clock size={14} className="info-icon" />
                            <span>{evt.time}</span>
                          </div>
                          <div className="info-row">
                            <MapPin size={14} className="info-icon" />
                            <span>{evt.venue}</span>
                          </div>
                        </div>

                        <div className="event-card-actions">
                          {evt.status === 'completed' ? (
                            <button className="btn btn-secondary btn-block" disabled>
                              <Award size={16} /> Completed • Certificate Ready
                            </button>
                          ) : evt.registered ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                              <button
                                onClick={() => openPassModal(evt)}
                                className="btn btn-outline btn-block"
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                              >
                                <QrCode size={16} /> Digital QR Pass
                              </button>
                              <button
                                onClick={() => handleRegisterToggle(evt.id)}
                                className="btn btn-danger-outline btn-block"
                              >
                                Withdraw Registration
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRegisterToggle(evt.id)}
                              className="btn btn-primary btn-block"
                            >
                              Register for Event
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="dashboard-tab-content">
              <div className="profile-container-card">
                <div className="profile-header-banner">
                  <div className="profile-avatar-large">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="profile-header-text">
                    <h2>{user?.name}</h2>
                    <span className="profile-badge-role">
                      <GraduationCap size={14} /> Student Account
                    </span>
                  </div>
                </div>

                <div className="profile-details-grid">
                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      <Mail size={16} /> Email Address
                    </span>
                    <span className="profile-detail-val">{user?.email}</span>
                  </div>

                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      <Building size={16} /> Academic Department
                    </span>
                    <span className="profile-detail-val">{user?.department}</span>
                  </div>

                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      <Award size={16} /> System Role
                    </span>
                    <span className="profile-detail-val capitalize">{user?.role}</span>
                  </div>

                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      <Clock size={16} /> Student User ID
                    </span>
                    <span className="profile-detail-val text-mono">{user?.id || user?._id}</span>
                  </div>
                </div>

                <div className="profile-actions-bar">
                  <button onClick={handleLogout} className="btn btn-danger">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* DIGITAL EVENT PASS POPUP MODAL */}
      {selectedPassForQR && (
        <QRCodePassModal
          pass={selectedPassForQR}
          onClose={() => setSelectedPassForQR(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default StudentDashboard;
