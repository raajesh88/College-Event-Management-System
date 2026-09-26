import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QRCodePassModal from '../components/QRCodePassModal';
import ThemedEventRegistrationModal from '../components/ThemedEventRegistrationModal';
import { useAuth } from '../context/AuthContext';
import { eventService, registrationService } from '../services/api';
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Search,
  Award,
  LogOut,
  Check,
  AlertCircle,
  Building,
  Mail,
  GraduationCap,
  QrCode,
  ShieldCheck,
  BellRing,
  Download,
  ChevronRight,
  Compass,
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
    capacity: 250,
    registeredCount: 208,
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    description:
      'Build breakthrough applications in AI, Web3, and IoT with mentorship from leading tech industry pioneers.',
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
    capacity: 800,
    registeredCount: 650,
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    description:
      'Three electrifying days of music battles, classical dance, theatrical drama, and visual art exhibitions.',
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
    capacity: 180,
    registeredCount: 152,
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
    capacity: 120,
    registeredCount: 88,
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    description:
      'Pitch ideas to campus incubators and venture investors. Learn from founders of top YC alumni startups.',
  },
  {
    id: 'EVT-105',
    title: 'CodeSprint: Algorithmic Contest',
    category: 'Competition',
    department: 'Computer Science & Engineering',
    date: 'Aug 12, 2025',
    time: '02:00 PM - 06:00 PM',
    venue: 'Computing Lab 3 & 4',
    registered: true,
    passCode: 'PASS-CODE-2091',
    status: 'completed',
    capacity: 150,
    registeredCount: 150,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    description:
      'High-speed competitive programming sprint focusing on graph theory, dynamic programming, and optimization.',
  },
  {
    id: 'EVT-106',
    title: 'Hands-on Cyber Security & Ethical Hacking Bootcamp',
    category: 'Technical',
    department: 'Information Technology',
    date: 'Jun 19, 2025',
    time: '10:00 AM - 05:00 PM',
    venue: 'Network Security Research Lab',
    registered: true,
    passCode: 'PASS-CYBER-7731',
    status: 'completed',
    capacity: 100,
    registeredCount: 98,
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    description:
      'Deep dive into zero-day exploitation, penetration testing methodology, and ethical defense pipelines.',
  },
  {
    id: 'EVT-107',
    title: 'Championship Trophy: Inter-Department Football & Track Meet',
    category: 'Sports',
    department: 'Physical Education & Athletics',
    date: 'Dec 12-14, 2026',
    time: '08:00 AM - 06:00 PM',
    venue: 'Main Campus Stadium & Sports Complex',
    registered: true,
    passCode: 'PASS-SPORT-5520',
    status: 'upcoming',
    capacity: 350,
    registeredCount: 110,
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    description:
      'Annual varsity championship games featuring inter-department football tournaments, 100m sprint relays, basketball showdowns, and badminton cups.',
  },
  {
    id: 'EVT-108',
    title: 'National Collegiate Debate & Case Study Challenge',
    category: 'Competition',
    department: 'Literary & Debating Society',
    date: 'Jan 10, 2027',
    time: '10:00 AM - 05:30 PM',
    venue: 'Central Conference Hall',
    registered: false,
    status: 'upcoming',
    capacity: 120,
    registeredCount: 45,
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    description:
      'Showcase critical thinking, debate prowess, business case modeling, and quiz acumen in prestigious campus-wide tournaments.',
  },
  {
    id: 'EVT-109',
    title: 'Future Horizons: AI Ethics & Quantum Computing Seminar',
    category: 'Seminar',
    department: 'Research & Development Cell',
    date: 'Jan 22, 2027',
    time: '02:00 PM - 05:00 PM',
    venue: 'Auditorium Block C',
    registered: false,
    status: 'upcoming',
    capacity: 200,
    registeredCount: 88,
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    description:
      'Distinguished keynote lecture by quantum computing research fellows exploring the paradigm shift in next-generation computation and ethical artificial intelligence.',
  },
  {
    id: 'EVT-110',
    title: 'Campus Photography Society Showcase & Heritage Walk',
    category: 'Club Activity',
    department: 'Photography & Creative Arts Club',
    date: 'Feb 06, 2027',
    time: '03:00 PM - 07:00 PM',
    venue: 'Student Activities Center & Campus Lawn',
    registered: false,
    status: 'upcoming',
    capacity: 80,
    registeredCount: 35,
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    description:
      'Live photo exhibition displaying student perspectives on campus architecture, followed by a golden-hour outdoor photo walk and critique session.',
  },
];

const CAMPUS_BULLETINS = [
  {
    id: 'BUL-01',
    date: 'Sep 26, 2026',
    department: 'Office of Dean (Student Affairs)',
    title: 'Auditorium Seating & QR Pass Verification Protocol for Annual Cultural Fest (Tarang)',
    tag: 'Official Notice',
    priority: 'high',
  },
  {
    id: 'BUL-02',
    date: 'Sep 24, 2026',
    department: 'Dept of Computer Science & Innovation Cell',
    title: 'HackCampus 2026: 36-Hour Hardware Lab Allotment and Mentor Desk Schedules',
    tag: 'Lab Circular',
    priority: 'normal',
  },
  {
    id: 'BUL-03',
    date: 'Sep 21, 2026',
    department: 'Academic Council & Examination Branch',
    title: 'Extracurricular Credit Submission: Submit Event Certificates before Semester Deadline',
    tag: 'Academic',
    priority: 'normal',
  },
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab states: 'dashboard', 'events', 'registrations' (passes), 'transcript', 'notices', 'profile'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState(initialStudentEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [_isLoading, setIsLoading] = useState(false);
  const [selectedPassForQR, setSelectedPassForQR] = useState(null);
  const [themedModalEvent, setThemedModalEvent] = useState(null);

  // Derive authentic collegiate identity values
  const rollNumber = `STD-${(user?.id || user?._id || '8842').toString().slice(-4).toUpperCase()}-CSE`;
  const academicProgram = 'Bachelor of Technology (B.Tech)';
  const academicYear = '3rd Year • Semester 6 (Batch 2023-2027)';
  const collegeDepartment = user?.department || 'Computer Science & Engineering';

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
            capacity: evt.capacity || 200,
            registeredCount: evt.registeredCount || 0,
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

  const openPassModal = (passItem) => {
    setThemedModalEvent({
      ...passItem,
      studentName: user?.name || 'Registered Student',
      studentEmail: user?.email || 'student@college.edu',
      rollNumber,
      department: collegeDepartment,
    });
  };

  const handleEnrollClick = (evt) => {
    setThemedModalEvent({
      ...evt,
      studentName: user?.name || 'Registered Student',
      studentEmail: user?.email || 'student@college.edu',
      rollNumber,
      department: collegeDepartment,
    });
  };

  const handleConfirmThemedRegistration = async (targetEvent, _customFormData) => {
    try {
      const res = await registrationService.register(targetEvent.id);
      const passCode =
        res.data?.data?.passCode ||
        `PASS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      setEvents((prev) =>
        prev.map((e) =>
          e.id === targetEvent.id
            ? {
                ...e,
                registered: true,
                passCode,
                registeredCount: (e.registeredCount || 0) + 1,
              }
            : e
        )
      );

      setToastMessage(res.data?.message || `Successfully registered for "${targetEvent.title}"!`);
      setTimeout(() => setToastMessage(''), 3500);
      return {
        passCode,
        ...res.data?.data,
      };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration request could not be completed.';
      setToastMessage(msg);
      setTimeout(() => setToastMessage(''), 3500);
      throw err;
    }
  };

  // Stats computation
  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const registeredCount = events.filter((e) => e.registered && e.status === 'upcoming').length;
  const completedCount = events.filter((e) => e.status === 'completed' && e.registered).length;
  const activityCredits = registeredCount * 15 + completedCount * 30;

  // Filtered list
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCat === 'All' || evt.category.toLowerCase() === selectedCat.toLowerCase();

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
          {/* ====================================================================
              COLLEGE STUDENT TEMPLATE: OFFICIAL DIGITAL CAMPUS ID & DOSSIER
              ==================================================================== */}
          <div className="student-id-dossier" aria-label="Student Official Campus Profile">
            <div className="dossier-header-bar">
              <div className="dossier-institution">
                <span className="inst-badge">UNIVERSITY STUDENT PORTAL</span>
                <span className="inst-division">COLLEGIATE EVENT & ACTIVITY REGISTRY • ACCREDITED A+</span>
              </div>
              <div className="dossier-status-pill">
                <span className="pulse-dot"></span>
                ACTIVE STUDENT • VERIFIED
              </div>
            </div>

            <div className="dossier-body-grid">
              {/* Student Identity Card Left Block */}
              <div className="dossier-identity-block">
                <div className="student-avatar-seal">
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
                </div>
                <div className="student-identity-meta">
                  <h1 className="student-full-name">{user?.name || 'Alex Rivera'}</h1>
                  <p className="student-department-line">
                    <Building size={15} /> {collegeDepartment}
                  </p>
                  <div className="student-credentials-row">
                    <span className="cred-chip">
                      <strong>Roll No:</strong> {rollNumber}
                    </span>
                    <span className="cred-chip">
                      <strong>Program:</strong> {academicProgram}
                    </span>
                    <span className="cred-chip">
                      <strong>Academic Term:</strong> {academicYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Sync */}
              <div className="dossier-actions-block">
                <div className="dossier-stat-summary">
                  <div className="summary-item">
                    <span className="summary-label">Active Passes</span>
                    <span className="summary-val text-gold">{registeredCount}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Activity Credits</span>
                    <span className="summary-val text-emerald">{activityCredits} pts</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Completed</span>
                    <span className="summary-val">{completedCount}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm auth-signout-btn"
                  data-auth="signout"
                  title="Sign out of student account"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="toast-notification alert-success" role="status">
              <CheckCircle size={18} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ====================================================================
              UNHURRIED COLLEGE TEMPLATE NAVIGATION TABS
              ==================================================================== */}
          <div className="college-tab-navigation" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'dashboard'}
              className={`college-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Compass size={17} />
              <span>Campus Overview</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'events'}
              className={`college-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={17} />
              <span>Explore Events ({upcomingCount})</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'registrations'}
              className={`college-tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('registrations')}
            >
              <QrCode size={17} />
              <span>My Entry Passes ({registeredCount})</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'transcript'}
              className={`college-tab-btn ${activeTab === 'transcript' ? 'active' : ''}`}
              onClick={() => setActiveTab('transcript')}
            >
              <Award size={17} />
              <span>Activity Transcript</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'notices'}
              className={`college-tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
              onClick={() => setActiveTab('notices')}
            >
              <BellRing size={17} />
              <span>Campus Notices</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'profile'}
              className={`college-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <GraduationCap size={17} />
              <span>Student Profile</span>
            </button>
          </div>

          {/* ====================================================================
              VIEW 1: CAMPUS OVERVIEW (Unhurried, Spacious, Clean Visuals)
              ==================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="unhurried-view-container">
              {/* Confirmed Passes Fast-Lane */}
              <div className="collegiate-card-section">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Confirmed Campus Event Passes</h2>
                    <p className="section-subheading">
                      Official gate passes with scannable QR verification for your enrolled activities.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('registrations')}
                    className="btn btn-outline btn-sm"
                  >
                    View All Passes <ChevronRight size={15} />
                  </button>
                </div>

                {events.filter((e) => e.registered && e.status === 'upcoming').length === 0 ? (
                  <div className="empty-unhurried-box">
                    <QrCode size={38} className="empty-icon" />
                    <h3>No active event passes currently</h3>
                    <p>You haven't enrolled in any upcoming events yet. Explore open fests and workshops!</p>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="btn btn-primary btn-sm mt-3"
                    >
                      Browse Campus Events
                    </button>
                  </div>
                ) : (
                  <div className="tickets-grid-unhurried">
                    {events
                      .filter((e) => e.registered && e.status === 'upcoming')
                      .map((item) => (
                        <div key={item.id} className="collegiate-pass-card">
                          <div className="pass-stub-left">
                            <span className="pass-status-chip">
                              <ShieldCheck size={13} /> CONFIRMED SEAT
                            </span>
                            <h3 className="pass-event-title">{item.title}</h3>
                            <div className="pass-meta-grid">
                              <div className="meta-cell">
                                <span className="meta-lbl">Date</span>
                                <span className="meta-val"><Calendar size={13} /> {item.date}</span>
                              </div>
                              <div className="meta-cell">
                                <span className="meta-lbl">Time</span>
                                <span className="meta-val"><Clock size={13} /> {item.time}</span>
                              </div>
                              <div className="meta-cell full-width">
                                <span className="meta-lbl">Venue / Gate Checkpoint</span>
                                <span className="meta-val"><MapPin size={13} /> {item.venue}</span>
                              </div>
                            </div>
                            <div className="pass-dept-tag">{item.department}</div>
                          </div>

                          <div className="pass-barcode-right">
                            <div className="barcode-simulation">
                              <span className="barcode-line"></span>
                              <span className="barcode-line w-2"></span>
                              <span className="barcode-line"></span>
                              <span className="barcode-line w-3"></span>
                              <span className="barcode-line w-2"></span>
                              <span className="barcode-line"></span>
                            </div>
                            <span className="pass-code-text">{item.passCode}</span>
                            <button
                              onClick={() => openPassModal(item)}
                              className="btn btn-primary btn-sm w-full mt-2"
                              title="Open verified QR pass modal"
                            >
                              <QrCode size={15} /> Open QR Pass
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Recommended Events & Notice Board Split Row */}
              <div className="dashboard-dual-split">
                {/* Recommended Events */}
                <div className="collegiate-card-section flex-1">
                  <div className="section-title-bar">
                    <div>
                      <h2 className="section-heading">Featured Events in Your Department</h2>
                      <p className="section-subheading">Opportunities curated for {collegeDepartment}.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="btn btn-ghost btn-sm"
                    >
                      All Events →
                    </button>
                  </div>

                  <div className="compact-events-list">
                    {events
                      .filter((e) => !e.registered && e.status === 'upcoming')
                      .slice(0, 3)
                      .map((evt) => (
                        <div key={evt.id} className="compact-event-row">
                          <img src={evt.image} alt={evt.title} className="compact-event-thumb" />
                          <div className="compact-event-details">
                            <span className="category-pill-sm">{evt.category}</span>
                            <h4 className="compact-title">{evt.title}</h4>
                            <span className="compact-meta">
                              <Calendar size={13} /> {evt.date} • <MapPin size={13} /> {evt.venue}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEnrollClick(evt)}
                            className="btn btn-outline btn-sm"
                          >
                            Enroll
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* College Circulars & Bulletin Board */}
                <div className="collegiate-card-section side-bulletin-box">
                  <div className="section-title-bar">
                    <div>
                      <h2 className="section-heading">Campus Notice Board</h2>
                      <p className="section-subheading">Dean & Academic Council circulars.</p>
                    </div>
                  </div>

                  <div className="bulletin-list">
                    {CAMPUS_BULLETINS.map((b) => (
                      <div key={b.id} className="bulletin-item">
                        <div className="bulletin-top">
                          <span className="bulletin-date">{b.date}</span>
                          <span className="bulletin-tag">{b.tag}</span>
                        </div>
                        <h4 className="bulletin-title">{b.title}</h4>
                        <span className="bulletin-dept">{b.department}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              VIEW 2: EXPLORE EVENTS & REGISTRATIONS (Clean Grid, No Clutter)
              ==================================================================== */}
          {(activeTab === 'events' || activeTab === 'registrations') && (
            <div className="unhurried-view-container">
              {/* Clean Filter and Search Toolbar */}
              <div className="clean-search-toolbar">
                <div className="search-box-field">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by event title, college department, or campus venue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="clean-search-input"
                  />
                </div>

                <div className="category-filter-chips">
                  {['All', 'Hackathon', 'Cultural', 'Technical', 'Workshop', 'Sports', 'Competition', 'Seminar', 'Club Activity'].map((cat) => (
                    <button
                      key={cat}
                      className={`chip-filter-btn ${selectedCat === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="empty-unhurried-box">
                  <AlertCircle size={42} className="empty-icon" />
                  <h3>No events match your search criteria</h3>
                  <p>Try resetting the category filter or searching for a different keyword.</p>
                  <button
                    onClick={() => {
                      setSelectedCat('All');
                      setSearchQuery('');
                    }}
                    className="btn btn-outline btn-sm mt-3"
                  >
                    Clear Search Filters
                  </button>
                </div>
              ) : (
                <div className="collegiate-events-grid">
                  {filteredEvents.map((evt) => {
                    const capacityPercent = Math.min(
                      100,
                      Math.round(((evt.registeredCount || 0) / (evt.capacity || 200)) * 100)
                    );
                    return (
                      <div key={evt.id} className="collegiate-event-card">
                        <div className="event-cover-wrapper">
                          <img src={evt.image} alt={evt.title} className="event-cover-img" />
                          <span className="event-category-tag">{evt.category}</span>
                          {evt.registered && (
                            <span className="event-enrolled-badge">
                              <Check size={13} /> Enrolled
                            </span>
                          )}
                        </div>

                        <div className="event-body-details">
                          <span className="event-dept-badge">{evt.department}</span>
                          <h3 className="event-headline">{evt.title}</h3>
                          <p className="event-summary">{evt.description}</p>

                          <div className="event-specs-list">
                            <div className="spec-row">
                              <Calendar size={14} /> <span>{evt.date}</span>
                            </div>
                            <div className="spec-row">
                              <Clock size={14} /> <span>{evt.time}</span>
                            </div>
                            <div className="spec-row">
                              <MapPin size={14} /> <span>{evt.venue}</span>
                            </div>
                          </div>

                          {/* Capacity Meter */}
                          <div className="capacity-meter-box">
                            <div className="capacity-labels">
                              <span>Seat Availability</span>
                              <span>
                                {evt.registeredCount} / {evt.capacity} filled
                              </span>
                            </div>
                            <div className="capacity-track">
                              <div
                                className="capacity-bar"
                                style={{ width: `${capacityPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="event-actions-bar">
                            {evt.status === 'completed' ? (
                              <button className="btn btn-secondary btn-block" disabled>
                                <Award size={16} /> Completed • Certificate Ready
                              </button>
                            ) : evt.registered ? (
                              <div className="registered-btn-group">
                                <button
                                  onClick={() => openPassModal(evt)}
                                  className="btn btn-primary flex-1"
                                >
                                  <QrCode size={16} /> Digital QR Pass
                                </button>
                                <button
                                  onClick={() => handleRegisterToggle(evt.id)}
                                  className="btn btn-outline"
                                  title="Withdraw registration"
                                >
                                  Withdraw
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEnrollClick(evt)}
                                className="btn btn-primary btn-block"
                              >
                                Enroll for Event
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ====================================================================
              VIEW 3: ACTIVITY TRANSCRIPT & EXTRACURRICULAR RECORD
              ==================================================================== */}
          {activeTab === 'transcript' && (
            <div className="unhurried-view-container">
              <div className="collegiate-card-section">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Extracurricular Activity Transcript</h2>
                    <p className="section-subheading">
                      Official record of verified participation, seminar attendance, and competitive achievements.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Transcript verified and signed by University Examination Cell.')}
                    className="btn btn-outline btn-sm"
                  >
                    <Download size={15} /> Download PDF Transcript
                  </button>
                </div>

                <div className="transcript-stats-row">
                  <div className="transcript-stat-box">
                    <span className="tstat-label">Total Activities</span>
                    <span className="tstat-number">{events.filter((e) => e.registered).length}</span>
                    <span className="tstat-hint">Enrolled & Completed</span>
                  </div>
                  <div className="transcript-stat-box">
                    <span className="tstat-label">Earned Activity Credits</span>
                    <span className="tstat-number text-gold">{activityCredits} pts</span>
                    <span className="tstat-hint">Required for Degree: 60 pts</span>
                  </div>
                  <div className="transcript-stat-box">
                    <span className="tstat-label">Verification Standing</span>
                    <span className="tstat-number text-emerald">Compliant</span>
                    <span className="tstat-hint">Approved by Faculty Mentor</span>
                  </div>
                </div>

                <div className="transcript-table-wrapper">
                  <table className="transcript-table">
                    <thead>
                      <tr>
                        <th>Activity Title</th>
                        <th>Category</th>
                        <th>Host Department</th>
                        <th>Event Date</th>
                        <th>Status</th>
                        <th>Certificate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events
                        .filter((e) => e.registered)
                        .map((evt) => (
                          <tr key={evt.id}>
                            <td>
                              <strong>{evt.title}</strong>
                              <div className="text-muted text-xs">Pass Code: {evt.passCode}</div>
                            </td>
                            <td>
                              <span className="category-pill-sm">{evt.category}</span>
                            </td>
                            <td>{evt.department}</td>
                            <td>{evt.date}</td>
                            <td>
                              <span
                                className={`badge-status ${
                                  evt.status === 'completed' ? 'status-completed' : 'status-upcoming'
                                }`}
                              >
                                {evt.status === 'completed' ? 'Completed' : 'Enrolled'}
                              </span>
                            </td>
                            <td>
                              {evt.status === 'completed' ? (
                                <button
                                  onClick={() =>
                                    alert(`Downloading verified Certificate of Participation for "${evt.title}".`)
                                  }
                                  className="btn btn-ghost btn-sm"
                                  style={{ color: '#ffd700', padding: '0.2rem 0.5rem' }}
                                >
                                  <Download size={14} /> Download
                                </button>
                              ) : (
                                <span className="text-muted text-xs">Pending Attendance</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              VIEW 4: CAMPUS NOTICES & CIRCULARS
              ==================================================================== */}
          {activeTab === 'notices' && (
            <div className="unhurried-view-container">
              <div className="collegiate-card-section">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Official Campus Notice Bulletin</h2>
                    <p className="section-subheading">
                      Notifications from the Dean of Student Affairs, Sports Council, and Examination Branches.
                    </p>
                  </div>
                </div>

                <div className="notices-detailed-grid">
                  {CAMPUS_BULLETINS.map((notice) => (
                    <div key={notice.id} className="detailed-notice-card">
                      <div className="notice-card-header">
                        <span className="notice-chip">{notice.tag}</span>
                        <span className="notice-date">{notice.date}</span>
                      </div>
                      <h3 className="notice-card-title">{notice.title}</h3>
                      <p className="notice-card-dept">
                        <Building size={14} /> Issued by: {notice.department}
                      </p>
                      <p className="notice-card-excerpt">
                        All participating students must present their verified digital QR passes along with their
                        official student ID cards at the gate checkpoint 15 minutes before the scheduled session.
                      </p>
                      <div className="notice-card-footer">
                        <span className="text-gold text-xs">University Event Circular #2026-EN-08</span>
                        <button
                          onClick={() => alert(`Viewing official circular ${notice.id}`)}
                          className="btn btn-ghost btn-sm"
                        >
                          View Full Circular →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              VIEW 5: DETAILED STUDENT PROFILE
              ==================================================================== */}
          {activeTab === 'profile' && (
            <div className="unhurried-view-container">
              <div className="collegiate-card-section max-w-2xl mx-auto">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Student Registration Credentials</h2>
                    <p className="section-subheading">Academic portal identity and student registry details.</p>
                  </div>
                </div>

                <div className="profile-credentials-grid">
                  <div className="profile-field-item">
                    <span className="field-label"><Mail size={15} /> Campus Email Address</span>
                    <span className="field-value">{user?.email}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><Building size={15} /> Department</span>
                    <span className="field-value">{collegeDepartment}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><GraduationCap size={15} /> Degree Program</span>
                    <span className="field-value">{academicProgram}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><Award size={15} /> Student ID & Roll Number</span>
                    <span className="field-value text-mono text-gold">{rollNumber}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><Clock size={15} /> Enrollment Term</span>
                    <span className="field-value">{academicYear}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><ShieldCheck size={15} /> Account Clearance</span>
                    <span className="field-value text-emerald">Verified Active Scholar</span>
                  </div>
                </div>

                <div className="profile-logout-bar mt-6">
                  <button onClick={handleLogout} className="btn btn-outline auth-signout-btn" data-auth="signout">
                    <LogOut size={16} /> Sign Out of Student Portal
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

      {/* CATEGORY THEMED EVENT REGISTRATION & PASS MODAL */}
      {themedModalEvent && (
        <ThemedEventRegistrationModal
          event={themedModalEvent}
          student={user}
          isAlreadyRegistered={themedModalEvent.registered}
          onClose={() => setThemedModalEvent(null)}
          onConfirmRegistration={handleConfirmThemedRegistration}
        />
      )}

      <Footer />
    </div>
  );
};

export default StudentDashboard;
