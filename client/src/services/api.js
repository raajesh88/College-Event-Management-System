import axios from 'axios';

// Dynamically determine the API Base URL:
// 1. If VITE_API_URL is explicitly configured, use it.
// 2. If running locally in a browser on localhost / 127.0.0.1, use http://localhost:5000/api.
// 3. Otherwise (deployed on Vercel or any cloud domain), connect directly to the live Render backend.
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined' && window.location) {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return 'http://localhost:5000/api';
    }
  }

  return 'https://college-event-management-system-yb3w.onrender.com/api';
};

// Base API configuration
const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35000, // 35 seconds to comfortably accommodate Render free-tier cold-start
});

// Request Interceptor: Automatically attach JWT Token to Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired, clear local storage and redirect to login
    if (error.response && error.response.status === 401) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service Endpoints
export const authService = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

// Event Service Endpoints
export const eventService = {
  getAll: (params) => API.get('/events', { params }),
  getById: (id) => API.get(`/events/${id}`),
  getMyEvents: () => API.get('/events/organizer/my-events'),
  getParticipants: (params) => API.get('/events/organizer/participants', { params }),
  create: (data) => API.post('/events', data),
  update: (id, data) => API.put(`/events/${id}`, data),
  delete: (id) => API.delete(`/events/${id}`),
};

// Registration Service Endpoints
export const registrationService = {
  register: (eventId) => API.post(`/registrations/${eventId}`),
  cancel: (eventId) => API.delete(`/registrations/${eventId}`),
  getMyRegistrations: () => API.get('/registrations/my-registrations'),
};

export default API;

