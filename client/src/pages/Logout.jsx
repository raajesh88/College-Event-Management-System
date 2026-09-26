import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CapybaraLoader from '../components/CapybaraLoader';
import { useAuth } from '../context/AuthContext';
import { LogOut, ArrowLeft, LogIn, Home } from 'lucide-react';

const Logout = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleConfirm = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/login', {
        state: { message: 'You have been successfully signed out.' },
      });
    }, 1000);
  };

  const handleCancel = () => {
    if (user?.role === 'organizer') {
      navigate('/organizer-dashboard');
    } else if (user?.role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="cyber-auth-bg">
        <div className="form-container">
          <div className="form">
            <span className="heading">College Event Management System</span>
            <span className="c1">Campus Account Logout</span>

            {token ? (
              <>
                <span className="c2">
                  Are you sure you want to end your active session,{' '}
                  <strong style={{ color: '#caf438' }}>{user?.name || 'Student'}</strong>? Your event
                  registrations and passes will remain securely stored on campus servers.
                </span>

                {loggingOut ? (
                  <div style={{ padding: '1rem 0' }}>
                    <CapybaraLoader message="Signing out of event portal..." />
                  </div>
                ) : (
                  <div className="button-container">
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="send-button auth-signout-btn"
                      data-auth="signout"
                    >
                      <LogOut size={16} /> Confirm Sign Out
                    </button>
                    <div className="reset-button-container">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="reset-button"
                      >
                        <ArrowLeft size={16} /> Stay Logged In
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <span className="c2">
                  You are currently not signed in. Please sign in to access your event dashboard or explore the campus events catalog.
                </span>

                <div className="button-container">
                  <Link to="/login" className="send-button auth-signin-btn" data-auth="signin">
                    <LogIn size={16} /> Sign In
                  </Link>
                  <div className="reset-button-container">
                    <Link to="/" className="reset-button">
                      <Home size={16} /> Home
                    </Link>
                  </div>
                </div>
              </>
            )}

            <div className="cyber-footer-links">
              <span>Need help or need to register?</span>
              <Link to="/signup">Create an Account</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Logout;
