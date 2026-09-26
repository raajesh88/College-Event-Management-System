import axios from 'axios';

// Helper to check if a URL string is just an unreplaced placeholder
const isPlaceholderUrl = (str) => {
  if (!str || typeof str !== 'string') return true;
  const s = str.trim().toLowerCase();
  return (
    s === '' ||
    s.includes('your-backend-url') ||
    s.includes('your-backend-host') ||
    s.includes('<your-backend-host>') ||
    s.includes('your-domain') ||
    s.includes('example.com')
  );
};

// Dynamically determine the API Base URL:
// 1. If VITE_API_URL is configured with a valid non-placeholder value, use it.
// 2. If running locally in a browser on localhost / 127.0.0.1, use http://localhost:5000/api.
// 3. Otherwise (deployed on Vercel or cloud domain), connect directly to the live Render backend.
const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;

  if (url && typeof url === 'string' && !isPlaceholderUrl(url)) {
    url = url.trim().replace(/\/+$/, '');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    if (!url.endsWith('/api')) {
      url = `${url}/api`;
    }
    return url;
  }

  if (typeof window !== 'undefined' && window.location) {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return 'http://localhost:5000/api';
    }
  }

  return 'https://college-event-management-system-1-p5mx.onrender.com/api';
};

// Base API configuration
const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds to accommodate Render free-tier cold start
});

// Request Interceptor: Automatically attach JWT Token to Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common response errors and retry on cloud cold-start 503
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry once on 503 or transient 502/504 if backend is waking up
    if (
      originalRequest &&
      !originalRequest._retry &&
      error.response &&
      [502, 503, 504].includes(error.response.status)
    ) {
      originalRequest._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return API(originalRequest);
    }

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
  getToken: () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!(token && token !== 'undefined' && token !== 'null');
  },
};

// Event Service Endpoints
export const eventService = {
  getAll: (params) => API.get('/events', { params }),
  getById: (id) => API.get(`/events/${id}`),
  getMyEvents: () => API.get('/events/organizer/my-events'),
  getParticipants: (params) => API.get('/events/organizer/participants', { params }),
  checkInParticipant: (id) => API.patch(`/events/organizer/participants/${id}/checkin`),
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


