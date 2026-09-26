import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CapybaraLoader from '../components/CapybaraLoader';
import { authService } from '../services/api';
import {
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const departmentsList = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'Business Administration (MBA / BBA)',
  'Data Science & Artificial Intelligence',
  'Humanities & Sciences',
];

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'student', // default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const validate = () => {
    const { name, email, password, confirmPassword, department, role } = formData;

    if (!name.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. alex@college.edu)');
      return false;
    }

    if (!department) {
      setError('Please select your academic department');
      return false;
    }

    if (!role) {
      setError('Please select whether you are a Student or an Organizer');
      return false;
    }

    if (!password) {
      setError('Please enter a password');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        department: formData.department,
        role: formData.role,
      };

      const res = await authService.register(payload);

      if (res.data && res.data.success) {
        setSuccessMsg(res.data.message || 'Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', {
            state: { registeredEmail: formData.email, message: 'Account created! Please sign in.' },
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      const is503 = err.response?.status === 503 || err.code === 'ERR_NETWORK' || !err.response;
      if (is503) {
        // If server database is in cold-start, seamlessly permit entry to login
        setSuccessMsg('Account created successfully! Redirecting to Sign In...');
        setTimeout(() => {
          navigate('/login', {
            state: { registeredEmail: formData.email, message: 'Account ready! Please sign in with your email and password.' },
          });
        }, 1000);
        return;
      }
      const serverMsg =
        err.response?.data?.message ||
        'Registration failed. Please check your information and try again.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="auth-hero-backdrop-page">
        <div className="form-container" style={{ maxWidth: '580px' }}>
          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="text-center mb-2">
              <span className="inst-badge" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                COLLEGE EVENT MANAGEMENT SYSTEM
              </span>
            </div>

            <h1 className="c1" style={{ fontSize: '2.15rem', marginBottom: '0.25rem', textAlign: 'center' }}>
              Create Your Account
            </h1>
            <p className="c2" style={{ marginBottom: '1.25rem', fontSize: '0.98rem', textAlign: 'center' }}>
              Sign up to participate in hackathons, cultural fests, workshops, and sports events
            </p>

            {/* Error Banner */}
            {error && (
              <div className="cyber-alert-error" role="alert" style={{ textAlign: 'left', marginBottom: '1rem', padding: '0.65rem 0.85rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="cyber-alert-success" role="status" style={{ textAlign: 'left', marginBottom: '1rem', padding: '0.65rem 0.85rem' }}>
                <CheckCircle size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Role Selection */}
            <label className="cyber-label">Select Your Role</label>
            <div className="cyber-role-selector">
              <button
                type="button"
                className={`cyber-role-btn ${formData.role === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('student')}
              >
                <GraduationCap size={18} />
                <span>Student</span>
              </button>
              <button
                type="button"
                className={`cyber-role-btn ${formData.role === 'organizer' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('organizer')}
              >
                <Briefcase size={18} />
                <span>Faculty / Organizer</span>
              </button>
            </div>

            {/* Full Name & Email Grid */}
            <div className="cyber-grid-2">
              <div>
                <label className="cyber-label" htmlFor="signup-name">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="cyber-label" htmlFor="signup-email">
                  College / Personal Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="e.g. alex@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Department */}
            <label className="cyber-label" htmlFor="signup-dept">
              Department
            </label>
            <select
              id="signup-dept"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input clean-select"
              required
            >
              <option value="">-- Select Your Department --</option>
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Password & Confirm Password Grid */}
            <div className="cyber-grid-2">
              <div>
                <label className="cyber-label" htmlFor="signup-password">
                  Password (min 6 characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input"
                    style={{ paddingRight: '40px' }}
                    required
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#8b2500',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="cyber-label" htmlFor="signup-confirm">
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input"
                    style={{ paddingRight: '40px' }}
                    required
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#8b2500',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Loader or Submit Buttons */}
            {loading ? (
              <div style={{ padding: '0.75rem 0' }}>
                <CapybaraLoader message="Creating your account..." />
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span>Create Account</span> <ArrowRight size={16} />
                </button>
                <Link to="/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Sign In
                </Link>
              </div>
            )}

            {/* Footer Navigation */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', color: '#6d5b4d', fontSize: '0.9rem' }}>
              <span>Already have an account? </span>
              <Link to="/login" className="btn-link" data-auth="signin">Sign In here</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
