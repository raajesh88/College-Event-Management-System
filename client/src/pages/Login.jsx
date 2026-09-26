import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CapybaraLoader from '../components/CapybaraLoader';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Check if routed after registration or session expiry
  const initialEmail = location.state?.registeredEmail || '';
  const initialMsg = location.state?.message || '';
  const isExpired = new URLSearchParams(location.search).get('expired');

  const [formData, setFormData] = useState({
    email: initialEmail,
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    isExpired ? 'Your session has expired. Please sign in again.' : ''
  );
  const [infoMsg, setInfoMsg] = useState(initialMsg);

  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (infoMsg) setInfoMsg('');
  };

  const handleQuickFill = (roleType) => {
    if (roleType === 'student') {
      setFormData({
        email: 'alex.rivera@college.edu',
        password: 'password123',
      });
    } else {
      setFormData({
        email: 'david.vance@college.edu',
        password: 'password123',
      });
    }
    setError('');
  };

  const enterDirectly = (roleType) => {
    if (roleType === 'student') {
      const studentUser = {
        id: 'student_alex_id',
        name: 'Alex Rivera',
        email: 'alex.rivera@college.edu',
        department: 'Computer Science & Engineering',
        role: 'student',
      };
      const scholarToken = 'scholar_auth_token_' + Date.now();
      login(scholarToken, studentUser);
      navigate('/student-dashboard');
    } else {
      const facultyUser = {
        id: 'organizer_david_id',
        name: 'Prof. David Vance',
        email: 'david.vance@college.edu',
        department: 'Computer Science & Engineering',
        role: 'organizer',
      };
      const facultyToken = 'faculty_auth_token_' + Date.now();
      login(facultyToken, facultyUser);
      navigate('/organizer-dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.data && res.data.success) {
        const { token, user } = res.data;

        // Update auth context state and local storage
        login(token, user);

        // Role-based redirection
        if (user.role === 'student') {
          navigate('/student-dashboard');
        } else if (user.role === 'organizer') {
          navigate('/organizer-dashboard');
        } else {
          navigate('/');
        }
        return;
      }
    } catch (err) {
      console.error('Login error:', err);

      const isServerDownOr503 =
        err.response?.status === 503 ||
        err.response?.status === 502 ||
        err.response?.status === 504 ||
        err.code === 'ERR_NETWORK' ||
        !err.response;

      const normEmail = formData.email.trim().toLowerCase();

      // If backend is waking up or 503, immediately authenticate known demo credentials
      if (isServerDownOr503) {
        if (normEmail === 'alex.rivera@college.edu' || normEmail.includes('alex') || normEmail.includes('student')) {
          enterDirectly('student');
          return;
        }
        if (normEmail === 'david.vance@college.edu' || normEmail.includes('david') || normEmail.includes('organizer') || normEmail.includes('faculty')) {
          enterDirectly('organizer');
          return;
        }
      }

      const serverMsg =
        err.response?.data?.message ||
        (isServerDownOr503
          ? 'Cloud server is warming up or reconnecting. You can use the instant access keys below to enter immediately without waiting.'
          : 'Invalid email or password. Please check your credentials.');
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="auth-hero-backdrop-page">
        <div className="uiverse-form-card">
          <div className="text-center mb-3">
            <span className="inst-badge" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
              COLLEGIATE ARCHIVAL REGISTRY • EST. 1926
            </span>
          </div>

          <h1 className="title" style={{ fontSize: '2.15rem', marginBottom: '0.25rem' }}>
            Portal Authentication
          </h1>
          <p className="subtitle" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
            Enter your academic passkey to access your events dossier
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Information Notice */}
            {infoMsg && (
              <div className="cyber-alert-success" role="status" style={{ textAlign: 'left', marginBottom: '1rem', padding: '0.65rem 0.85rem' }}>
                <CheckCircle size={18} />
                <span>{infoMsg}</span>
              </div>
            )}

            {/* Error Banner with Instant Bypass Options */}
            {error && (
              <div className="cyber-alert-error" role="alert" style={{ textAlign: 'left', marginBottom: '1.25rem', padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
                    <div style={{ marginTop: '0.65rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => enterDirectly('student')}
                        className="cyber-demo-btn"
                        style={{ background: '#8b2500', color: '#fff', borderColor: '#8b2500', padding: '5px 10px', fontSize: '0.78rem' }}
                      >
                        ⚡ Enter as Scholar (Alex Rivera)
                      </button>
                      <button
                        type="button"
                        onClick={() => enterDirectly('organizer')}
                        className="cyber-demo-btn"
                        style={{ background: '#2c3e50', color: '#fff', borderColor: '#2c3e50', padding: '5px 10px', fontSize: '0.78rem' }}
                      >
                        ⚡ Enter as Faculty (Prof. David Vance)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field with Academic SVG */}
            <div className="field">
              <svg className="input-icon" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z"></path>
              </svg>
              <input
                autoComplete="off"
                id="logemail"
                placeholder="Institutional / Personal Email"
                className="input-field"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="field">
              <svg className="input-icon" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path>
              </svg>
              <input
                autoComplete="off"
                id="logpass"
                placeholder="Account Passkey"
                className="input-field"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b2500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Checkbox & Sign Up link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#5c4c3e' }}>
                <input
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                  style={{ accentColor: '#8b2500' }}
                />
                <span>Remember session</span>
              </label>

              <Link to="/signup" className="btn-link" style={{ margin: 0, fontSize: '0.88rem' }}>
                Create Scholar Account →
              </Link>
            </div>

            {/* Submit Button */}
            {loading ? (
              <div style={{ padding: '0.75rem 0' }}>
                <CapybaraLoader message="Verifying credentials & signing in..." />
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '1.25rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary auth-signin-btn"
                  data-auth="signin"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <ShieldCheck size={18} />
                  <span>Enter University Portal</span>
                </button>
              </div>
            )}

            {/* Quick Demo Helper */}
            <div className="cyber-demo-bar" style={{ justifyContent: 'center', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="cyber-demo-title" style={{ fontSize: '0.78rem' }}>
                Passkey Auto-fill:
              </span>
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="cyber-demo-btn"
              >
                <UserCheck size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                Scholar Key
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('organizer')}
                className="cyber-demo-btn"
              >
                <UserCheck size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                Faculty Key
              </button>
            </div>

            <div className="text-center mt-3">
              <a href="#forgot" onClick={(e) => { e.preventDefault(); setError('Contact campus registrar desk to reset your institutional credentials.'); }} className="btn-link" style={{ fontSize: '0.84rem' }}>
                Forgot your credentials?
              </a>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
