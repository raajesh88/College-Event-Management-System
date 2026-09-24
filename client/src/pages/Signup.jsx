import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../services/api';
import {
  User,
  Mail,
  Lock,
  Building,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
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
    role: 'student', // default to student
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
      setError('Please enter a valid email address (e.g. name@campus.edu)');
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
      const serverMsg =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || !err.response
          ? 'Unable to reach the server. If using the cloud backend on Render, it may be waking up from sleep. Please wait a moment and try again.'
          : 'Registration failed. Please check your information and try again.');
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
              <span className="auth-badge">Join CampusEvents</span>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">
                Register to explore events or manage campus activities
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="alert-box alert-error" role="alert">
                <AlertCircle size={18} className="alert-icon" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="alert-box alert-success" role="alert">
                <CheckCircle size={18} className="alert-icon" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {/* Role Selection */}
              <div className="form-group">
                <label className="form-label">Select Your Role</label>
                <div className="role-selector-grid">
                  <button
                    type="button"
                    className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('student')}
                  >
                    <div className="role-icon-box">
                      <GraduationCap size={20} />
                    </div>
                    <div className="role-text">
                      <strong>Student</strong>
                      <span>Browse & Register</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`role-btn ${formData.role === 'organizer' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('organizer')}
                  >
                    <div className="role-icon-box">
                      <Briefcase size={20} />
                    </div>
                    <div className="role-text">
                      <strong>Organizer</strong>
                      <span>Host & Manage Events</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  College / Personal Email
                </label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g. alex.rivera@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <div className="input-with-icon">
                  <Building size={18} className="input-icon" />
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input form-select"
                    required
                  >
                    <option value="">-- Choose your department --</option>
                    {departmentsList.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password (min 6 characters)
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer switch to login */}
            <div className="auth-footer-nav">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Login
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

export default Signup;
