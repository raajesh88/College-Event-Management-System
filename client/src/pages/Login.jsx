import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
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
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Unable to connect to server. Please ensure the backend is running on port 5000.'
          : 'Invalid email or password. Please try again.');
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="auth-page-container">
        <div className="auth-card-wrapper">
          <div className="auth-card">
            {/* Header */}
            <div className="auth-header">
              <span className="auth-badge">Campus Portal</span>
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">
                Sign in with your registered college credentials
              </p>
            </div>

            {/* Information Notice */}
            {infoMsg && (
              <div className="alert-box alert-success" role="status">
                <CheckCircle size={18} className="alert-icon" />
                <span>{infoMsg}</span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="alert-box alert-error" role="alert">
                <AlertCircle size={18} className="alert-icon" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">
                  Email Address
                </label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="e.g. your.name@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="login-password" className="form-label">
                    Password
                  </label>
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block btn-lg auth-submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Helper */}
            <div className="demo-credentials-box">
              <span className="demo-title">
                <ShieldCheck size={14} /> Quick Demo Accounts:
              </span>
              <div className="demo-btns">
                <button
                  type="button"
                  onClick={() => handleQuickFill('student')}
                  className="btn btn-sm btn-ghost demo-btn"
                >
                  <UserCheck size={14} /> Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('organizer')}
                  className="btn btn-sm btn-ghost demo-btn"
                >
                  <UserCheck size={14} /> Organizer Demo
                </button>
              </div>
            </div>

            {/* Footer link to Signup */}
            <div className="auth-footer-nav">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
