import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/api';
import {
  Calendar,
  Users,
  Layers,
  PlusCircle,
  Briefcase,
  MapPin,
  Clock,
  Trash2,
  Edit3,
  CheckCircle2,
  Search,
  LogOut,
  Mail,
  Building,
  UserCheck,
  Check,
  FileSpreadsheet,
  Award,
  ShieldCheck,
  TrendingUp,
  Compass,
} from 'lucide-react';

const initialOrganizerEvents = [
  {
    id: 'EVT-201',
    code: 'EVT-201',
    title: 'HackCampus 2026: 36-Hour National Hackathon',
    category: 'Hackathon',
    department: 'Computer Science & Engineering',
    date: 'Oct 14-16, 2026',
    time: '09:00 AM - 09:00 PM',
    venue: 'Campus Innovation Hub & Auditorium',
    capacity: 250,
    registeredCount: 208,
    status: 'Upcoming',
  },
  {
    id: 'EVT-202',
    code: 'EVT-202',
    title: 'RoboQuest: Autonomous Robotics & AI Symposium',
    category: 'Technical',
    department: 'Electronics & Communication',
    date: 'Nov 18, 2026',
    time: '09:30 AM - 05:00 PM',
    venue: 'Mechanical & Robotics Center',
    capacity: 180,
    registeredCount: 152,
    status: 'Upcoming',
  },
  {
    id: 'EVT-203',
    code: 'EVT-203',
    title: 'Tarang: Annual Cultural Fest',
    category: 'Cultural',
    department: 'Student Affairs & Arts Council',
    date: 'Nov 02-04, 2026',
    time: '10:00 AM - 10:00 PM',
    venue: 'Open Air Amphitheatre',
    capacity: 800,
    registeredCount: 650,
    status: 'Upcoming',
  },
  {
    id: 'EVT-204',
    code: 'EVT-204',
    title: 'Full-Stack Cloud & DevOps Architecture Workshop',
    category: 'Workshop',
    department: 'Information Technology',
    date: 'Dec 05, 2026',
    time: '11:00 AM - 04:00 PM',
    venue: 'Executive Seminar Hall A & Cloud Lab',
    capacity: 120,
    registeredCount: 98,
    status: 'Upcoming',
  },
  {
    id: 'EVT-205',
    code: 'EVT-205',
    title: 'Championship Trophy: Inter-Department Football & Track Meet',
    category: 'Sports',
    department: 'Physical Education & Athletics',
    date: 'Dec 12-14, 2026',
    time: '08:00 AM - 06:00 PM',
    venue: 'Main Campus Stadium & Sports Complex',
    capacity: 350,
    registeredCount: 275,
    status: 'Upcoming',
  },
  {
    id: 'EVT-206',
    code: 'EVT-206',
    title: 'National Collegiate Debate & Case Study Challenge',
    category: 'Competition',
    department: 'Literary & Debating Society',
    date: 'Jan 10, 2027',
    time: '10:00 AM - 05:30 PM',
    venue: 'Central Conference Hall',
    capacity: 120,
    registeredCount: 104,
    status: 'Upcoming',
  },
  {
    id: 'EVT-207',
    code: 'EVT-207',
    title: 'Future Horizons: AI Ethics & Quantum Computing Seminar',
    category: 'Seminar',
    department: 'Research & Development Cell',
    date: 'Jan 22, 2027',
    time: '02:00 PM - 05:00 PM',
    venue: 'Auditorium Block C',
    capacity: 200,
    registeredCount: 176,
    status: 'Upcoming',
  },
  {
    id: 'EVT-208',
    code: 'EVT-208',
    title: 'Campus Photography Society Showcase & Heritage Walk',
    category: 'Club Activity',
    department: 'Photography & Creative Arts Club',
    date: 'Feb 06, 2027',
    time: '03:00 PM - 07:00 PM',
    venue: 'Student Activities Center & Campus Lawn',
    capacity: 80,
    registeredCount: 72,
    status: 'Upcoming',
  },
  {
    id: 'EVT-209',
    code: 'EVT-209',
    title: 'National Cyber Security Awareness Seminar',
    category: 'Technical',
    department: 'Information Technology',
    date: 'Sep 08, 2025',
    time: '10:00 AM - 01:00 PM',
    venue: 'Virtual Hall & Seminar Hall 1',
    capacity: 200,
    registeredCount: 198,
    status: 'Completed',
  },
];

const initialParticipants = [
  {
    id: 'P-101',
    name: 'Alex Rivera',
    email: 'alex.rivera@college.edu',
    department: 'Computer Science & Engineering',
    eventTitle: 'HackCampus 2026: 36-Hour Hackathon',
    regDate: '2026-09-24',
    status: 'Confirmed',
    checkedIn: true,
  },
  {
    id: 'P-102',
    name: 'Sophia Chen',
    email: 'sophia.c@college.edu',
    department: 'Information Technology',
    eventTitle: 'HackCampus 2026: 36-Hour Hackathon',
    regDate: '2026-09-23',
    status: 'Confirmed',
    checkedIn: false,
  },
  {
    id: 'P-103',
    name: 'Marcus Brody',
    email: 'marcus.b@college.edu',
    department: 'Electronics & Communication',
    eventTitle: 'International Robotics & AI Symposium',
    regDate: '2026-09-22',
    status: 'Confirmed',
    checkedIn: true,
  },
  {
    id: 'P-104',
    name: 'Aisha Patel',
    email: 'aisha.p@college.edu',
    department: 'Mechanical Engineering',
    eventTitle: 'International Robotics & AI Symposium',
    regDate: '2026-09-21',
    status: 'Confirmed',
    checkedIn: false,
  },
  {
    id: 'P-105',
    name: 'Ethan Miller',
    email: 'ethan.m@college.edu',
    department: 'Business Administration',
    eventTitle: 'Tarang: Annual Cultural Fest',
    regDate: '2026-09-20',
    status: 'Confirmed',
    checkedIn: false,
  },
];

const CAMPUS_VENUES = [
  { name: 'Campus Innovation Hub & Auditorium', capacity: 250, allocatedTo: 'HackCampus 2026', occupancy: '83%' },
  { name: 'Open Air Amphitheatre', capacity: 800, allocatedTo: 'Tarang Fest', occupancy: '81%' },
  { name: 'Mechanical & Robotics Center', capacity: 180, allocatedTo: 'Robotics Symposium', occupancy: '84%' },
  { name: 'Executive Seminar Hall A', capacity: 120, allocatedTo: 'Leadership Summit', occupancy: '73%' },
];

const OrganizerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab states: 'dashboard', 'create-event', 'manage-events', 'participants', 'venues', 'profile'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [eventsList, setEventsList] = useState(initialOrganizerEvents);
  const [participantsList, setParticipantsList] = useState(initialParticipants);
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search in Participants
  const [participantQuery, setParticipantQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');

  // Faculty coordinator identity
  const facultyStaffId = `FAC-${(user?.id || user?._id || '409').toString().slice(-4).toUpperCase()}-COORD`;
  const facultyDesignation = 'Faculty Event In-Charge & Student Affairs Council';
  const facultyDepartment = user?.department || 'Computer Science & Engineering';

  // Create Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Technical',
    department: user?.department || 'Computer Science & Engineering',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: '',
    capacity: 150,
    description: '',
  });

  // Edit Event State
  const [editingEventId, setEditingEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch organizer events and registered participants from backend
  const fetchOrganizerData = async () => {
    try {
      const [eventsRes, participantsRes] = await Promise.allSettled([
        eventService.getMyEvents(),
        eventService.getParticipants(),
      ]);

      if (
        eventsRes.status === 'fulfilled' &&
        eventsRes.value.data?.success &&
        Array.isArray(eventsRes.value.data.data) &&
        eventsRes.value.data.data.length > 0
      ) {
        const formatted = eventsRes.value.data.data.map((evt) => ({
          id: evt._id,
          code: `EVT-${evt._id.toString().slice(-4).toUpperCase()}`,
          title: evt.title,
          category: evt.category,
          department: evt.department,
          date: evt.date,
          time: evt.time || '10:00 AM - 04:00 PM',
          venue: evt.venue,
          capacity: evt.capacity || 200,
          registeredCount: evt.registeredCount || 0,
          description: evt.description || '',
          status: evt.status || 'Upcoming',
        }));
        setEventsList(formatted);
      } else {
        const allEventsRes = await eventService.getAll().catch(() => null);
        if (allEventsRes?.data?.success && allEventsRes.data.data.length > 0) {
          const formatted = allEventsRes.data.data.map((evt) => ({
            id: evt._id,
            code: `EVT-${evt._id.toString().slice(-4).toUpperCase()}`,
            title: evt.title,
            category: evt.category,
            department: evt.department,
            date: evt.date,
            time: evt.time || '10:00 AM - 04:00 PM',
            venue: evt.venue,
            capacity: evt.capacity || 200,
            registeredCount: evt.registeredCount || 0,
            description: evt.description || '',
            status: evt.status || 'Upcoming',
          }));
          setEventsList(formatted);
        }
      }

      if (
        participantsRes.status === 'fulfilled' &&
        participantsRes.value.data?.success &&
        Array.isArray(participantsRes.value.data.data)
      ) {
        const backendParticipants = participantsRes.value.data.data;
        if (backendParticipants.length > 0) {
          // Put real student registrations first, merge with unique mock entries for a full campus view
          const realEmails = new Set(
            backendParticipants.map((p) => (p.email || '').toLowerCase())
          );
          const extraDemos = initialParticipants.filter(
            (p) => !realEmails.has((p.email || '').toLowerCase())
          );
          setParticipantsList([...backendParticipants, ...extraDemos]);
        } else {
          setParticipantsList(initialParticipants);
        }
      }
    } catch (err) {
      console.warn('Backend sync notice for organizer:', err);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // CSV Export Handler
  const downloadParticipantsCSV = () => {
    if (filteredParticipants.length === 0) {
      alert('No participants found matching the current search criteria.');
      return;
    }

    const headers = [
      'Pass ID',
      'Student Name',
      'Email',
      'Department',
      'Event Title',
      'Registration Date',
      'Gate Status',
    ];

    const rows = filteredParticipants.map((p) => [
      `"${p.id || ''}"`,
      `"${p.name || ''}"`,
      `"${p.email || ''}"`,
      `"${p.department || ''}"`,
      `"${p.eventTitle || ''}"`,
      `"${p.regDate || ''}"`,
      `"${p.checkedIn ? 'Checked In' : 'Confirmed'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `campus_event_attendance_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Event Handler
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!newEvent.title.trim() || !newEvent.date || !newEvent.venue.trim()) {
      setToastMsg('Please fill in all mandatory fields (Title, Date, Venue).');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...newEvent,
      capacity: Number(newEvent.capacity) || 100,
    };

    try {
      const res = await eventService.create(payload);
      if (res.data?.success && res.data.data) {
        const created = res.data.data;
        const formatted = {
          id: created._id,
          code: `EVT-${created._id.toString().slice(-4).toUpperCase()}`,
          title: created.title,
          category: created.category,
          department: created.department,
          date: created.date,
          time: created.time,
          venue: created.venue,
          capacity: created.capacity,
          description: created.description || payload.description || '',
          registeredCount: 0,
          status: 'Upcoming',
        };
        setEventsList((prev) => [formatted, ...prev]);
      } else {
        const fakeId = `EVT-${Math.floor(100 + Math.random() * 900)}`;
        setEventsList((prev) => [{ id: fakeId, code: fakeId, ...payload, registeredCount: 0, status: 'Upcoming' }, ...prev]);
      }
      setToastMsg(`"${newEvent.title}" has been successfully published to the campus catalog!`);
    } catch {
      const fakeId = `EVT-${Math.floor(100 + Math.random() * 900)}`;
      setEventsList((prev) => [{ id: fakeId, code: fakeId, ...payload, registeredCount: 0, status: 'Upcoming' }, ...prev]);
      setToastMsg(`"${newEvent.title}" published to student portal.`);
    } finally {
      setIsSubmitting(false);
      setNewEvent({
        title: '',
        category: 'Technical',
        department: user?.department || 'Computer Science & Engineering',
        date: '',
        time: '10:00 AM - 04:00 PM',
        venue: '',
        capacity: 150,
        description: '',
      });
      setTimeout(() => setToastMsg(''), 4000);
      setActiveTab('manage-events');
    }
  };

  // Delete Event Handler
  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove the event "${title}"?`)) return;

    try {
      await eventService.delete(id);
      setToastMsg(`Event "${title}" has been successfully removed.`);
    } catch (err) {
      console.warn('Server delete notification:', err.response?.data?.message || err.message);
      setToastMsg(`Event "${title}" removed.`);
    }

    setEventsList((prev) => prev.filter((item) => item.id !== id));
    setParticipantsList((prev) => prev.filter((p) => p.eventId !== id && p.eventTitle !== title));
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Toggle Check-in status
  const handleToggleCheckIn = async (participantId) => {
    const target = participantsList.find((p) => p.id === participantId);
    const newChecked = !target?.checkedIn;

    setParticipantsList((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, checkedIn: newChecked } : p))
    );

    try {
      await eventService.checkInParticipant(target?.registrationId || participantId);
    } catch (err) {
      console.warn('Gate status check-in sync notification:', err.message);
    }
  };

  // Edit Event Handlers
  const handleEditClick = (evt) => {
    setEditingEventId(evt.id);
    setEditFormData({
      title: evt.title,
      category: evt.category || 'Technical',
      department: evt.department || 'Computer Science & Engineering',
      date: evt.date,
      time: evt.time || '10:00 AM - 04:00 PM',
      venue: evt.venue,
      capacity: evt.capacity,
      description: evt.description || '',
      status: evt.status || 'Upcoming',
    });
  };

  const handleUpdateEvent = async (id) => {
    try {
      const res = await eventService.update(id, editFormData);
      if (res.data?.success && res.data.data) {
        const updated = res.data.data;
        setEventsList((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  title: updated.title,
                  category: updated.category,
                  department: updated.department,
                  date: updated.date,
                  time: updated.time,
                  venue: updated.venue,
                  capacity: updated.capacity,
                  description: updated.description,
                  status: updated.status,
                }
              : item
          )
        );
        if (editFormData.title) {
          setParticipantsList((prev) =>
            prev.map((p) =>
              p.eventId === id ? { ...p, eventTitle: editFormData.title } : p
            )
          );
        }
        setToastMsg('Event details updated successfully in database.');
      } else {
        setEventsList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...editFormData } : item))
        );
        setToastMsg('Event details updated.');
      }
    } catch (err) {
      console.warn('Update notice:', err.response?.data?.message || err.message);
      setEventsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...editFormData } : item))
      );
      setToastMsg('Event details updated.');
    }

    setEditingEventId(null);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Compute metrics
  const totalEvents = eventsList.length;
  const upcomingEvents = eventsList.filter((e) => e.status !== 'Completed').length;
  const totalParticipants = eventsList.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);
  const totalCapacity = eventsList.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalParticipants / totalCapacity) * 100) : 78;

  // Filter participants
  const filteredParticipants = participantsList.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(participantQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(participantQuery.toLowerCase()) ||
      p.eventTitle.toLowerCase().includes(participantQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(participantQuery.toLowerCase());

    const matchesDept = filterDepartment === 'All' || p.department.toLowerCase().includes(filterDepartment.toLowerCase());

    return matchesQuery && matchesDept;
  });

  return (
    <div className="page-wrapper dashboard-page">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-content-area">
        <div className="container">
          {/* ====================================================================
              COLLEGE ORGANIZER TEMPLATE: FACULTY EVENT COORDINATION COMMAND DESK
              ==================================================================== */}
          <div className="faculty-id-dossier" aria-label="Faculty Coordinator Administrative Profile">
            <div className="dossier-header-bar faculty-header-bar">
              <div className="dossier-institution">
                <span className="inst-badge inst-badge-faculty">FACULTY EVENT OPERATIONS COUNCIL</span>
                <span className="inst-division">DEAN OF STUDENT AFFAIRS • EVENT PLANNING & CAPACITY DESK</span>
              </div>
              <div className="dossier-status-pill faculty-status-pill">
                <ShieldCheck size={14} />
                LEVEL-1 APPROVED DESK • ACTIVE
              </div>
            </div>

            <div className="dossier-body-grid">
              {/* Faculty Coordinator Left Identity Block */}
              <div className="dossier-identity-block">
                <div className="faculty-avatar-seal">
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'F'}</span>
                </div>
                <div className="student-identity-meta">
                  <h1 className="student-full-name">{user?.name || 'Prof. David Vance'}</h1>
                  <p className="student-department-line text-amber">
                    <Building size={15} /> {facultyDepartment}
                  </p>
                  <div className="student-credentials-row">
                    <span className="cred-chip">
                      <strong>Staff ID:</strong> {facultyStaffId}
                    </span>
                    <span className="cred-chip">
                      <strong>Designation:</strong> {facultyDesignation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coordinator Summary Stats */}
              <div className="dossier-actions-block">
                <div className="dossier-stat-summary">
                  <div className="summary-item">
                    <span className="summary-label">Events Managed</span>
                    <span className="summary-val text-gold">{totalEvents}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Attendees</span>
                    <span className="summary-val text-emerald">{totalParticipants}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Venue Occupancy</span>
                    <span className="summary-val text-amber">{overallOccupancy}%</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm auth-signout-btn"
                  data-auth="signout"
                  title="Sign out of organizer account"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Toast Notification Alert */}
          {toastMsg && (
            <div className="toast-notification alert-success" role="status">
              <CheckCircle2 size={18} />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* ====================================================================
              UNHURRIED ORGANIZER NAVIGATION TABS
              ==================================================================== */}
          <div className="college-tab-navigation" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'dashboard'}
              className={`college-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Compass size={17} />
              <span>Operations Command</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'create-event'}
              className={`college-tab-btn ${activeTab === 'create-event' ? 'active' : ''}`}
              onClick={() => setActiveTab('create-event')}
            >
              <PlusCircle size={17} />
              <span>Publish New Event</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'manage-events'}
              className={`college-tab-btn ${activeTab === 'manage-events' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage-events')}
            >
              <Layers size={17} />
              <span>Manage Events & Capacity ({totalEvents})</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'participants'}
              className={`college-tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              <Users size={17} />
              <span>Attendee Rosters ({filteredParticipants.length})</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'venues'}
              className={`college-tab-btn ${activeTab === 'venues' ? 'active' : ''}`}
              onClick={() => setActiveTab('venues')}
            >
              <Building size={17} />
              <span>Campus Venue Allocations</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'profile'}
              className={`college-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <UserCheck size={17} />
              <span>Faculty Dossier</span>
            </button>
          </div>

          {/* ====================================================================
              TAB 1: OPERATIONS COMMAND (Clean, Relaxed Overview)
              ==================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="unhurried-view-container">
              {/* 3 Executive Stat Cards */}
              <div className="organizer-metrics-row">
                <div
                  className="exec-metric-card"
                  onClick={() => setActiveTab('manage-events')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="metric-icon-box bg-gold-subtle">
                    <Layers size={24} className="text-gold" />
                  </div>
                  <div className="metric-info-col">
                    <span className="metric-lbl">Total Scheduled Events</span>
                    <h3 className="metric-big-num">{totalEvents}</h3>
                    <span className="metric-helper text-gold">{upcomingEvents} active & accepting passes</span>
                  </div>
                </div>

                <div
                  className="exec-metric-card"
                  onClick={() => setActiveTab('participants')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="metric-icon-box bg-emerald-subtle">
                    <Users size={24} className="text-emerald" />
                  </div>
                  <div className="metric-info-col">
                    <span className="metric-lbl">Enrolled Student Attendees</span>
                    <h3 className="metric-big-num">{totalParticipants}</h3>
                    <span className="metric-helper text-emerald">Across all university colleges</span>
                  </div>
                </div>

                <div
                  className="exec-metric-card"
                  onClick={() => setActiveTab('venues')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="metric-icon-box bg-amber-subtle">
                    <TrendingUp size={24} className="text-amber" />
                  </div>
                  <div className="metric-info-col">
                    <span className="metric-lbl">Campus Venue Occupancy</span>
                    <h3 className="metric-big-num">{overallOccupancy}%</h3>
                    <span className="metric-helper text-amber">{totalCapacity - totalParticipants} seats remaining</span>
                  </div>
                </div>
              </div>

              {/* Active Events Schedule Table */}
              <div className="collegiate-card-section">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Active Campus Event Roster</h2>
                    <p className="section-subheading">Live seat occupancy and venue status overview.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('create-event')}
                    className="btn btn-primary btn-sm"
                  >
                    <PlusCircle size={15} /> Publish Event
                  </button>
                </div>

                <div className="transcript-table-wrapper">
                  <table className="transcript-table">
                    <thead>
                      <tr>
                        <th>Event & Department</th>
                        <th>Category</th>
                        <th>Date & Time</th>
                        <th>Venue Allotment</th>
                        <th>Occupancy</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsList.slice(0, 5).map((evt) => {
                        const pct = Math.min(
                          100,
                          Math.round(((evt.registeredCount || 0) / (evt.capacity || 200)) * 100)
                        );
                        return (
                          <tr key={evt.id || evt.code}>
                            <td>
                              <strong>{evt.title}</strong>
                              <div className="text-muted text-xs">{evt.department}</div>
                            </td>
                            <td>
                              <span className="category-pill-sm">{evt.category}</span>
                            </td>
                            <td>
                              <div>{evt.date}</div>
                              <span className="text-muted text-xs">{evt.time}</span>
                            </td>
                            <td>
                              <MapPin size={13} className="inline mr-1" />
                              {evt.venue}
                            </td>
                            <td>
                              <div className="occupancy-cell">
                                <span className="occupancy-text">
                                  {evt.registeredCount} / {evt.capacity} ({pct}%)
                                </span>
                                <div className="occupancy-mini-track">
                                  <div
                                    className="occupancy-mini-fill"
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => setActiveTab('manage-events')}
                                className="btn btn-ghost btn-sm"
                                style={{ color: '#ffd700' }}
                              >
                                Manage →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 2: PUBLISH NEW EVENT STUDIO (Calm, Unhurried Form)
              ==================================================================== */}
          {activeTab === 'create-event' && (
            <div className="unhurried-view-container">
              <div className="collegiate-card-section max-w-3xl mx-auto">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Publish University Event</h2>
                    <p className="section-subheading">
                      Schedule a campus event across Cultural, Technical, Hackathon, or Workshop categories.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateEvent} className="unhurried-form">
                  <div className="form-group-clean">
                    <label className="clean-label" htmlFor="evt-title">Event Title *</label>
                    <input
                      id="evt-title"
                      type="text"
                      className="clean-input"
                      placeholder="e.g. AI & Quantum Computing Summit 2026"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="clean-form-row">
                    <div className="form-group-clean flex-1">
                      <label className="clean-label" htmlFor="evt-cat">Event Category *</label>
                      <select
                        id="evt-cat"
                        className="clean-input clean-select"
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      >
                        <option value="Technical">Technical Event</option>
                        <option value="Hackathon">Hackathon (Sprints)</option>
                        <option value="Cultural">Cultural Fest & Arts</option>
                        <option value="Workshop">Hands-on Workshop</option>
                        <option value="Sports">Sports & Athletics</option>
                        <option value="Seminar">Academic Seminar</option>
                        <option value="Competition">Competition & Debate</option>
                        <option value="Club Activity">Club & Society Activity</option>
                        <option value="Coding">Coding Contest</option>
                      </select>
                    </div>

                    <div className="form-group-clean flex-1">
                      <label className="clean-label" htmlFor="evt-dept">Host Department *</label>
                      <input
                        id="evt-dept"
                        type="text"
                        className="clean-input"
                        placeholder="e.g. Computer Science & Engineering"
                        value={newEvent.department}
                        onChange={(e) => setNewEvent({ ...newEvent, department: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="clean-form-row">
                    <div className="form-group-clean flex-1">
                      <label className="clean-label" htmlFor="evt-date">Event Date *</label>
                      <input
                        id="evt-date"
                        type="text"
                        className="clean-input"
                        placeholder="e.g. Nov 14, 2026"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group-clean flex-1">
                      <label className="clean-label" htmlFor="evt-time">Timing</label>
                      <input
                        id="evt-time"
                        type="text"
                        className="clean-input"
                        placeholder="e.g. 10:00 AM - 04:00 PM"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="clean-form-row">
                    <div className="form-group-clean flex-1">
                      <label className="clean-label" htmlFor="evt-venue">Campus Venue / Room *</label>
                      <input
                        id="evt-venue"
                        type="text"
                        className="clean-input"
                        placeholder="e.g. Campus Innovation Hub & Auditorium"
                        value={newEvent.venue}
                        onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group-clean flex-1">
                      <label className="clean-label" htmlFor="evt-cap">Seating Capacity *</label>
                      <input
                        id="evt-cap"
                        type="number"
                        min="10"
                        max="2000"
                        className="clean-input"
                        placeholder="e.g. 150"
                        value={newEvent.capacity}
                        onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-clean">
                    <label className="clean-label" htmlFor="evt-desc">Event Description & Eligibility</label>
                    <textarea
                      id="evt-desc"
                      rows="4"
                      className="clean-input clean-textarea"
                      placeholder="Outline keynotes, rules, eligibility criteria, and mentor guidelines..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-actions-bar mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg"
                    >
                      {isSubmitting ? 'Publishing Event...' : 'Publish to Student Portal'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 3: MANAGE EVENTS & CAPACITY (Spacious List & Edit Actions)
              ==================================================================== */}
          {activeTab === 'manage-events' && (
            <div className="unhurried-view-container">
              <div className="collegiate-card-section">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Scheduled Events Portfolio</h2>
                    <p className="section-subheading">Edit schedules, track registration capacity, or archive events.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('create-event')}
                    className="btn btn-primary btn-sm"
                  >
                    <PlusCircle size={15} /> Add Another Event
                  </button>
                </div>

                <div className="events-manage-grid">
                  {eventsList.map((evt) => {
                    const isEditing = editingEventId === evt.id;
                    const pct = Math.min(
                      100,
                      Math.round(((evt.registeredCount || 0) / (evt.capacity || 200)) * 100)
                    );

                    return (
                      <div key={evt.id || evt.code} className="manage-event-card">
                        {isEditing ? (
                          <div className="inline-edit-form">
                            <h4 className="text-gold mb-3">Editing Event Details</h4>
                            <div className="form-group-clean mb-2">
                              <label className="clean-label">Title</label>
                              <input
                                type="text"
                                className="clean-input"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                              />
                            </div>
                            <div className="clean-form-row mb-2">
                              <div className="flex-1">
                                <label className="clean-label">Category</label>
                                <select
                                  className="clean-input clean-select"
                                  value={editFormData.category || 'Technical'}
                                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                >
                                  <option value="Technical">Technical</option>
                                  <option value="Hackathon">Hackathon</option>
                                  <option value="Cultural">Cultural</option>
                                  <option value="Workshop">Workshop</option>
                                  <option value="Sports">Sports</option>
                                  <option value="Seminar">Seminar</option>
                                  <option value="Competition">Competition</option>
                                  <option value="Club Activity">Club Activity</option>
                                  <option value="Coding">Coding</option>
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="clean-label">Department</label>
                                <input
                                  type="text"
                                  className="clean-input"
                                  value={editFormData.department || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="clean-form-row mb-2">
                              <div className="flex-1">
                                <label className="clean-label">Date</label>
                                <input
                                  type="text"
                                  className="clean-input"
                                  value={editFormData.date}
                                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                />
                              </div>
                              <div className="flex-1">
                                <label className="clean-label">Timing</label>
                                <input
                                  type="text"
                                  className="clean-input"
                                  value={editFormData.time || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="clean-form-row mb-3">
                              <div className="flex-1">
                                <label className="clean-label">Venue</label>
                                <input
                                  type="text"
                                  className="clean-input"
                                  value={editFormData.venue}
                                  onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                                />
                              </div>
                              <div className="flex-1">
                                <label className="clean-label">Capacity</label>
                                <input
                                  type="number"
                                  className="clean-input"
                                  value={editFormData.capacity}
                                  onChange={(e) => setEditFormData({ ...editFormData, capacity: Number(e.target.value) })}
                                />
                              </div>
                              <div className="flex-1">
                                <label className="clean-label">Status</label>
                                <select
                                  className="clean-input"
                                  value={editFormData.status}
                                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                >
                                  <option value="Upcoming">Upcoming</option>
                                  <option value="Ongoing">Ongoing</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                            </div>
                            <div className="form-group-clean mb-3">
                              <label className="clean-label">Description & Rules</label>
                              <textarea
                                rows="3"
                                className="clean-input clean-textarea"
                                value={editFormData.description || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateEvent(evt.id)}
                                className="btn btn-primary btn-sm flex-1"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEditingEventId(null)}
                                className="btn btn-outline btn-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="manage-card-header">
                              <span className="category-pill-sm">{evt.category}</span>
                              <span
                                className={`badge-status ${
                                  evt.status === 'Completed' ? 'status-completed' : 'status-upcoming'
                                }`}
                              >
                                {evt.status}
                              </span>
                            </div>

                            <h3 className="manage-card-title">{evt.title}</h3>
                            <p className="manage-card-dept">{evt.department}</p>

                            <div className="manage-specs">
                              <div className="spec-row">
                                <Calendar size={13} /> {evt.date}
                              </div>
                              <div className="spec-row">
                                <Clock size={13} /> {evt.time}
                              </div>
                              <div className="spec-row">
                                <MapPin size={13} /> {evt.venue}
                              </div>
                            </div>

                            <div className="capacity-meter-box mt-3">
                              <div className="capacity-labels">
                                <span>Occupancy Rate</span>
                                <span className="text-gold font-bold">
                                  {evt.registeredCount} / {evt.capacity} ({pct}%)
                                </span>
                              </div>
                              <div className="capacity-track">
                                <div
                                  className="capacity-bar"
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="manage-card-actions mt-4">
                              <button
                                onClick={() => handleEditClick(evt)}
                                className="btn btn-outline btn-sm flex-1"
                              >
                                <Edit3 size={14} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(evt.id, evt.title)}
                                className="btn btn-danger-outline btn-sm"
                                title="Remove event"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 4: ATTENDEE ROSTERS & GATE CHECK-IN DESK
              ==================================================================== */}
          {activeTab === 'participants' && (
            <div className="unhurried-view-container">
              <div className="collegiate-card-section">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Student Registration & Gate Check-In Desk</h2>
                    <p className="section-subheading">
                      Search student rosters, toggle venue gate entry, or export official CSV reports.
                    </p>
                  </div>
                  <button
                    onClick={downloadParticipantsCSV}
                    className="btn btn-primary btn-sm"
                  >
                    <FileSpreadsheet size={15} /> Export Attendance CSV
                  </button>
                </div>

                {/* Search & Department Filter Toolbar */}
                <div className="clean-search-toolbar">
                  <div className="search-box-field">
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search participant by name, email, or event title..."
                      value={participantQuery}
                      onChange={(e) => setParticipantQuery(e.target.value)}
                      className="clean-search-input"
                    />
                  </div>

                  <div className="category-filter-chips">
                    {['All', 'Computer Science', 'Information Tech', 'Electronics', 'Mechanical', 'Business'].map((dept) => (
                      <button
                        key={dept}
                        className={`chip-filter-btn ${filterDepartment === dept ? 'active' : ''}`}
                        onClick={() => setFilterDepartment(dept)}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="transcript-table-wrapper">
                  <table className="transcript-table">
                    <thead>
                      <tr>
                        <th>Participant Name</th>
                        <th>Academic Department</th>
                        <th>Enrolled Event</th>
                        <th>Registration Date</th>
                        <th>Gate Status</th>
                        <th>Gate Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.name}</strong>
                            <div className="text-muted text-xs">{p.email}</div>
                          </td>
                          <td>{p.department}</td>
                          <td>
                            <span className="text-gold font-medium">{p.eventTitle}</span>
                          </td>
                          <td>{p.regDate}</td>
                          <td>
                            <span
                              className={`badge-status ${
                                p.checkedIn ? 'status-completed' : 'status-upcoming'
                              }`}
                            >
                              {p.checkedIn ? 'Checked In' : 'Confirmed Pass'}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleCheckIn(p.id)}
                              className={`btn btn-sm ${
                                p.checkedIn ? 'btn-outline' : 'btn-primary'
                              }`}
                              style={{ padding: '0.25rem 0.65rem' }}
                            >
                              {p.checkedIn ? 'Revoke Check-In' : 'Verify Gate Entry'}
                            </button>
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
              TAB 5: CAMPUS VENUE ALLOCATIONS DESK
              ==================================================================== */}
          {activeTab === 'venues' && (
            <div className="unhurried-view-container">
              <div className="collegiate-card-section">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Campus Venue & Hall Allotment Desk</h2>
                    <p className="section-subheading">
                      Auditorium bookings, seating availability, and campus venue allocation schedules.
                    </p>
                  </div>
                </div>

                <div className="venues-grid-unhurried">
                  {CAMPUS_VENUES.map((v, idx) => (
                    <div key={idx} className="venue-card-clean">
                      <div className="venue-header">
                        <MapPin size={18} className="text-gold" />
                        <h3 className="venue-name">{v.name}</h3>
                      </div>
                      <div className="venue-meta-row">
                        <span className="venue-lbl">Seating Capacity:</span>
                        <span className="venue-val">{v.capacity} Seats</span>
                      </div>
                      <div className="venue-meta-row">
                        <span className="venue-lbl">Allocated Activity:</span>
                        <span className="venue-val text-gold">{v.allocatedTo}</span>
                      </div>
                      <div className="venue-meta-row">
                        <span className="venue-lbl">Current Occupancy:</span>
                        <span className="venue-val text-emerald font-bold">{v.occupancy}</span>
                      </div>
                      <div className="venue-footer-status">
                        <span className="status-pill status-active">
                          <Check size={12} className="inline mr-1" /> Allotted & Operational
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 6: FACULTY COORDINATOR ADMINISTRATIVE PROFILE
              ==================================================================== */}
          {activeTab === 'profile' && (
            <div className="unhurried-view-container">
              <div className="collegiate-card-section max-w-2xl mx-auto">
                <div className="section-title-bar">
                  <div>
                    <h2 className="section-heading">Faculty Coordinator Dossier</h2>
                    <p className="section-subheading">University administration credentials and event council credentials.</p>
                  </div>
                </div>

                <div className="profile-credentials-grid">
                  <div className="profile-field-item">
                    <span className="field-label"><Mail size={15} /> Campus Email Address</span>
                    <span className="field-value">{user?.email || 'david.vance@college.edu'}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><Building size={15} /> Academic Department</span>
                    <span className="field-value">{facultyDepartment}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><Briefcase size={15} /> Designation</span>
                    <span className="field-value">{facultyDesignation}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><Award size={15} /> Staff ID Code</span>
                    <span className="field-value text-mono text-gold">{facultyStaffId}</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><Layers size={15} /> Published Campus Events</span>
                    <span className="field-value text-gold">{totalEvents} Events Managed</span>
                  </div>

                  <div className="profile-field-item">
                    <span className="field-label"><ShieldCheck size={15} /> Administrative Standing</span>
                    <span className="field-value text-emerald">Level-1 Approved Authority</span>
                  </div>
                </div>

                <div className="profile-logout-bar mt-6">
                  <button onClick={handleLogout} className="btn btn-outline auth-signout-btn" data-auth="signout">
                    <LogOut size={16} /> Sign Out of Organizer Console
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrganizerDashboard;
