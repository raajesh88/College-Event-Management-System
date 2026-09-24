import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
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
  Filter,
  LogOut,
  Mail,
  Building,
  UserCheck,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';

const initialOrganizerEvents = [
  {
    id: 'EVT-201',
    title: 'HackCampus 2026: 36-Hour Hackathon',
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
    title: 'International Robotics & AI Symposium',
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
    title: 'Tarang: Annual Cultural Fest',
    category: 'Cultural',
    department: 'Student Affairs',
    date: 'Nov 02-04, 2026',
    time: '10:00 AM - 10:00 PM',
    venue: 'Open Air Amphitheatre',
    capacity: 800,
    registeredCount: 650,
    status: 'Upcoming',
  },
  {
    id: 'EVT-204',
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
    department: 'Computer Science',
    eventTitle: 'HackCampus 2026',
    regDate: '2026-09-24',
    status: 'Confirmed',
  },
  {
    id: 'P-102',
    name: 'Sophia Chen',
    email: 'sophia.c@college.edu',
    department: 'Information Technology',
    eventTitle: 'HackCampus 2026',
    regDate: '2026-09-23',
    status: 'Confirmed',
  },
  {
    id: 'P-103',
    name: 'Marcus Brody',
    email: 'marcus.b@college.edu',
    department: 'Electronics & Communication',
    eventTitle: 'International Robotics & AI Symposium',
    regDate: '2026-09-22',
    status: 'Confirmed',
  },
  {
    id: 'P-104',
    name: 'Aisha Patel',
    email: 'aisha.p@college.edu',
    department: 'Mechanical Engineering',
    eventTitle: 'International Robotics & AI Symposium',
    regDate: '2026-09-21',
    status: 'Confirmed',
  },
  {
    id: 'P-105',
    name: 'Ethan Miller',
    email: 'ethan.m@college.edu',
    department: 'Business Administration',
    eventTitle: 'Tarang: Annual Cultural Fest',
    regDate: '2026-09-20',
    status: 'Confirmed',
  },
];

const OrganizerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [eventsList, setEventsList] = useState(initialOrganizerEvents);
  const [participantsList, setParticipantsList] = useState(initialParticipants);
  const [toastMsg, setToastMsg] = useState('');

  // Search in Participants
  const [participantQuery, setParticipantQuery] = useState('');

  // Create Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Technical',
    department: user?.department || 'Computer Science & Engineering',
    date: '',
    time: '',
    venue: '',
    capacity: 100,
    description: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.venue) {
      alert('Please fill in Event Title, Date, and Venue');
      return;
    }

    const created = {
      id: `EVT-${Math.floor(100 + Math.random() * 900)}`,
      title: newEvent.title.trim(),
      category: newEvent.category,
      department: newEvent.department,
      date: newEvent.date,
      time: newEvent.time || '10:00 AM - 04:00 PM',
      venue: newEvent.venue,
      capacity: parseInt(newEvent.capacity, 10) || 100,
      registeredCount: 0,
      status: 'Upcoming',
    };

    setEventsList([created, ...eventsList]);
    setToastMsg(`Event "${created.title}" successfully created and published!`);
    setTimeout(() => setToastMsg(''), 3500);

    // Reset form & go to manage events
    setNewEvent({
      title: '',
      category: 'Technical',
      department: user?.department || 'Computer Science & Engineering',
      date: '',
      time: '',
      venue: '',
      capacity: 100,
      description: '',
    });
    setActiveTab('manage-events');
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      setEventsList(eventsList.filter((e) => e.id !== id));
      setToastMsg('Event deleted successfully.');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  // 3 STATS COMPUTATIONS
  const totalEvents = eventsList.length;
  const upcomingEvents = eventsList.filter((e) => e.status === 'Upcoming').length;
  const totalParticipants = eventsList.reduce((acc, curr) => acc + curr.registeredCount, 0);

  const filteredParticipants = participantsList.filter(
    (p) =>
      p.name.toLowerCase().includes(participantQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(participantQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(participantQuery.toLowerCase()) ||
      p.eventTitle.toLowerCase().includes(participantQuery.toLowerCase())
  );

  return (
    <div className="page-wrapper dashboard-page">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-content-area">
        <div className="container">
          {/* Welcome Banner */}
          <div className="dashboard-welcome-banner organizer-banner">
            <div className="welcome-text-side">
              <span className="organizer-badge">
                <Briefcase size={16} /> Organizer Administration
              </span>
              <h1 className="welcome-heading">Welcome, {user?.name || 'Organizer'}</h1>
              <p className="welcome-subtext">
                Department: {user?.department || 'Faculty Coordinator'} • Event Management Operations
              </p>
            </div>

            <div className="welcome-actions">
              <button
                onClick={() => setActiveTab('create-event')}
                className="btn btn-primary"
              >
                <PlusCircle size={16} /> Create New Event
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                title="Sign out of organizer account"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMsg && (
            <div className="toast-notification alert-success">
              <Check size={18} />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* 3 MANDATORY STATISTIC CARDS */}
          <div className="dashboard-stats-grid">
            {/* Card 1: Total Events */}
            <div
              className={`stat-card ${activeTab === 'manage-events' ? 'card-active' : ''}`}
              onClick={() => setActiveTab('manage-events')}
            >
              <div className="stat-card-icon-box bg-indigo-subtle">
                <Layers size={24} className="text-indigo" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Total Events</span>
                <h3 className="stat-card-val">{totalEvents}</h3>
                <span className="stat-card-hint">All created events</span>
              </div>
            </div>

            {/* Card 2: Upcoming Events */}
            <div
              className={`stat-card ${activeTab === 'manage-events' ? 'card-active' : ''}`}
              onClick={() => setActiveTab('manage-events')}
            >
              <div className="stat-card-icon-box bg-amber-subtle">
                <Calendar size={24} className="text-amber" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Upcoming Events</span>
                <h3 className="stat-card-val">{upcomingEvents}</h3>
                <span className="stat-card-hint">Scheduled & published</span>
              </div>
            </div>

            {/* Card 3: Total Participants */}
            <div
              className={`stat-card ${activeTab === 'participants' ? 'card-active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              <div className="stat-card-icon-box bg-emerald-subtle">
                <Users size={24} className="text-emerald" />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Total Participants</span>
                <h3 className="stat-card-val">{totalParticipants}</h3>
                <span className="stat-card-hint">Enrolled across events</span>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-tab-content">
              <div className="dashboard-section-box">
                <div className="section-box-header">
                  <div>
                    <h3 className="section-box-title">Recent Event Overview</h3>
                    <p className="section-box-desc">Quick look at participant occupancy and event schedules</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('create-event')}
                    className="btn btn-outline btn-sm"
                  >
                    + Add Event
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Event Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Venue</th>
                        <th>Participants</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsList.slice(0, 4).map((evt) => (
                        <tr key={evt.id}>
                          <td>
                            <strong>{evt.title}</strong>
                            <div className="table-subtext">{evt.department}</div>
                          </td>
                          <td>
                            <span className="badge-cat">{evt.category}</span>
                          </td>
                          <td>{evt.date}</td>
                          <td>{evt.venue}</td>
                          <td>
                            <span className="occupancy-pill">
                              {evt.registeredCount} / {evt.capacity}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-pill ${
                                evt.status === 'Upcoming' ? 'status-active' : 'status-completed'
                              }`}
                            >
                              {evt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE EVENT */}
          {activeTab === 'create-event' && (
            <div className="dashboard-tab-content">
              <div className="form-card-container">
                <div className="form-card-header">
                  <PlusCircle size={22} className="text-indigo" />
                  <div>
                    <h3>Publish New College Event</h3>
                    <p>Provide the event details, venue, and attendance limits</p>
                  </div>
                </div>

                <form onSubmit={handleCreateEvent} className="organizer-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Event Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. National Robotics Hackfest 2026"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                        className="form-input form-select"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Sports">Sports</option>
                        <option value="Seminar">Seminar</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hosting Department</label>
                      <input
                        type="text"
                        value={newEvent.department}
                        onChange={(e) => setNewEvent({ ...newEvent, department: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Maximum Capacity (Seats)</label>
                      <input
                        type="number"
                        min="10"
                        max="2000"
                        value={newEvent.capacity}
                        onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Event Date *</label>
                      <input
                        type="text"
                        placeholder="e.g. Nov 14, 2026"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Event Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM - 04:30 PM"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Event Venue / Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Main Auditorium / Lab B4"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Event Description & Guidelines</label>
                    <textarea
                      rows={3}
                      placeholder="Explain the objectives, rules, eligibility, prizes, and schedule for participating students..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="form-input form-textarea"
                    />
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <PlusCircle size={18} /> Publish Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE EVENTS */}
          {activeTab === 'manage-events' && (
            <div className="dashboard-tab-content">
              <div className="dashboard-section-box">
                <div className="section-box-header">
                  <div>
                    <h3 className="section-box-title">Manage Your College Events</h3>
                    <p className="section-box-desc">Total {eventsList.length} events hosted by your division</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('create-event')}
                    className="btn btn-primary btn-sm"
                  >
                    + Create Event
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Event Code</th>
                        <th>Event Details</th>
                        <th>Schedule</th>
                        <th>Venue</th>
                        <th>Registration Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsList.map((evt) => (
                        <tr key={evt.id}>
                          <td>
                            <code className="code-badge">{evt.id}</code>
                          </td>
                          <td>
                            <strong>{evt.title}</strong>
                            <div className="table-subtext">
                              {evt.department} • <span className="text-indigo">{evt.category}</span>
                            </div>
                          </td>
                          <td>
                            <div>{evt.date}</div>
                            <small className="text-muted">{evt.time}</small>
                          </td>
                          <td>{evt.venue}</td>
                          <td>
                            <div className="progress-cell">
                              <span className="occupancy-pill">
                                {evt.registeredCount} / {evt.capacity} students
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="icon-action-btn delete-btn"
                                title="Delete Event"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PARTICIPANTS */}
          {activeTab === 'participants' && (
            <div className="dashboard-tab-content">
              <div className="dashboard-section-box">
                <div className="section-box-header">
                  <div>
                    <h3 className="section-box-title">Registered Participants Roster</h3>
                    <p className="section-box-desc">Search and verify attending students across departments</p>
                  </div>

                  <div className="search-input-wrapper-sm">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search participant name, email, department..."
                      value={participantQuery}
                      onChange={(e) => setParticipantQuery(e.target.value)}
                      className="catalog-search-input"
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Registered Event</th>
                        <th>Registered On</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <code className="code-badge">{p.id}</code>
                          </td>
                          <td>
                            <strong>{p.name}</strong>
                          </td>
                          <td>{p.email}</td>
                          <td>{p.department}</td>
                          <td>
                            <span className="text-indigo">{p.eventTitle}</span>
                          </td>
                          <td>{p.regDate}</td>
                          <td>
                            <span className="status-pill status-active">
                              <UserCheck size={12} className="inline mr-1" /> {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="dashboard-tab-content">
              <div className="profile-container-card">
                <div className="profile-header-banner organizer-header-banner">
                  <div className="profile-avatar-large organizer-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
                  </div>
                  <div className="profile-header-text">
                    <h2>{user?.name}</h2>
                    <span className="profile-badge-role organizer-badge">
                      <Briefcase size={14} /> Organizer / Faculty Coordinator
                    </span>
                  </div>
                </div>

                <div className="profile-details-grid">
                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      <Mail size={16} /> Official Email
                    </span>
                    <span className="profile-detail-val">{user?.email}</span>
                  </div>

                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      <Building size={16} /> Department Division
                    </span>
                    <span className="profile-detail-val">{user?.department}</span>
                  </div>

                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      <Briefcase size={16} /> Administrative Role
                    </span>
                    <span className="profile-detail-val capitalize">{user?.role}</span>
                  </div>

                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      <Clock size={16} /> Organizer ID
                    </span>
                    <span className="profile-detail-val text-mono">{user?.id}</span>
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

      <Footer />
    </div>
  );
};

export default OrganizerDashboard;
