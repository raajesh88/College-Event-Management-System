import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';
import { Calendar, User, LogOut, Menu, X, Sparkles, PlusCircle, CheckSquare, Layers } from 'lucide-react';

const Navbar = ({ activeTab, onTabChange }) => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);

  const toggleMobile = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobile = () => setMobileMenuOpen(false);

  const handleNavSection = (sectionId, e) => {
    if (e) e.preventDefault();
    closeMobile();
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="navbar-header">
      {/* Cyber-themed Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
      <div className="nav-container">
        {/* Brand / Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobile}>
          <div className="brand-icon-wrapper">
            <Calendar className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">College Events</span>
            <span className="brand-subtitle">Campus Event Hub</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {/* Public links when not logged in or on landing page */}
          {(!token || isPublicPage) && (
            <div className="nav-links">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
              <a href="#events" onClick={(e) => handleNavSection('events', e)} className="nav-link">
                Events
              </a>
              <a href="#about" onClick={(e) => handleNavSection('about', e)} className="nav-link">
                About
              </a>
              <a href="#contact" onClick={(e) => handleNavSection('contact', e)} className="nav-link">
                Contact
              </a>
            </div>
          )}

          {/* Student links when logged in on student dashboard */}
          {token && user?.role === 'student' && !isPublicPage && (
            <div className="nav-links">
              <button
                className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('dashboard')}
              >
                <Layers size={17} /> Dashboard
              </button>
              <button
                className={`nav-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('events')}
              >
                <Calendar size={17} /> Events
              </button>
              <button
                className={`nav-tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('registrations')}
              >
                <CheckSquare size={17} /> My Registrations
              </button>
              <button
                className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('profile')}
              >
                <User size={17} /> Profile
              </button>
            </div>
          )}

          {/* Organizer links when logged in on organizer dashboard */}
          {token && user?.role === 'organizer' && !isPublicPage && (
            <div className="nav-links">
              <button
                className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('dashboard')}
              >
                <Layers size={17} /> Dashboard
              </button>
              <button
                className={`nav-tab-btn ${activeTab === 'create-event' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('create-event')}
              >
                <PlusCircle size={17} /> Create Event
              </button>
              <button
                className={`nav-tab-btn ${activeTab === 'manage-events' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('manage-events')}
              >
                <Calendar size={17} /> Manage Events
              </button>
              <button
                className={`nav-tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('participants')}
              >
                <User size={17} /> Participants
              </button>
              <button
                className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('profile')}
              >
                <User size={17} /> Profile
              </button>
            </div>
          )}

          {/* Right Action buttons */}
          <div className="nav-actions">
            {!token ? (
              <>
                <Link to="/login" className="btn btn-ghost auth-login-btn" data-auth="login">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="user-dropdown-area">
                <div className="user-pill">
                  <div className="avatar-circle">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-pill-info">
                    <span className="user-pill-name">{user?.name}</span>
                    <span className="user-pill-role badge-role">{user?.role}</span>
                  </div>
                </div>

                {isPublicPage && (
                  <Link
                    to={user.role === 'student' ? '/student-dashboard' : '/organizer-dashboard'}
                    className="btn btn-outline btn-sm"
                  >
                    Go to Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="btn btn-danger-outline btn-sm nav-logout-btn auth-signout-btn"
                  title="Logout"
                  data-auth="signout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button className="mobile-toggle-btn" onClick={toggleMobile} aria-label="Toggle Navigation">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          {(!token || isPublicPage) && (
            <div className="mobile-links">
              <Link to="/" onClick={closeMobile} className="mobile-link">Home</Link>
              <a href="#events" onClick={(e) => handleNavSection('events', e)} className="mobile-link">Events</a>
              <a href="#about" onClick={(e) => handleNavSection('about', e)} className="mobile-link">About</a>
              <a href="#contact" onClick={(e) => handleNavSection('contact', e)} className="mobile-link">Contact</a>
            </div>
          )}

          {token && user?.role === 'student' && !isPublicPage && (
            <div className="mobile-links">
              <button
                className={`mobile-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('dashboard'); closeMobile(); }}
              >
                Dashboard
              </button>
              <button
                className={`mobile-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('events'); closeMobile(); }}
              >
                Events
              </button>
              <button
                className={`mobile-tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('registrations'); closeMobile(); }}
              >
                My Registrations
              </button>
              <button
                className={`mobile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('profile'); closeMobile(); }}
              >
                Profile
              </button>
            </div>
          )}

          {token && user?.role === 'organizer' && !isPublicPage && (
            <div className="mobile-links">
              <button
                className={`mobile-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('dashboard'); closeMobile(); }}
              >
                Dashboard
              </button>
              <button
                className={`mobile-tab-btn ${activeTab === 'create-event' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('create-event'); closeMobile(); }}
              >
                Create Event
              </button>
              <button
                className={`mobile-tab-btn ${activeTab === 'manage-events' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('manage-events'); closeMobile(); }}
              >
                Manage Events
              </button>
              <button
                className={`mobile-tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('participants'); closeMobile(); }}
              >
                Participants
              </button>
              <button
                className={`mobile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => { onTabChange && onTabChange('profile'); closeMobile(); }}
              >
                Profile
              </button>
            </div>
          )}

          <div className="mobile-actions">
            {!token ? (
              <div className="mobile-auth-btns">
                <Link to="/login" onClick={closeMobile} className="btn btn-ghost btn-block auth-login-btn" data-auth="login">
                  Login
                </Link>
                <Link to="/signup" onClick={closeMobile} className="btn btn-primary btn-block">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <strong>{user?.name}</strong>
                  <span className="badge-role">{user?.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-danger-outline btn-block auth-signout-btn" data-auth="signout">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
