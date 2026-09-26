const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const { seedDefaultEvents } = require('./controllers/eventController');

// Initialize Express app
const app = express();

// Connect to MongoDB Database and seed initial events if empty
connectDB()
  .then(() => {
    seedDefaultEvents();
  })
  .catch((err) => {
    console.error('Initial DB Connection Warning:', err.message);
  });

// Core Middleware - Deployment ready CORS supporting Localhost, Vercel, and Render
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  'https://college-event-management-bte0iq11m-rajesh-49da.vercel.app',
  'https://college-event-management-system-1.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const isVercel = /\.vercel\.app$/.test(origin);
    const isNetlify = /\.netlify\.app$/.test(origin);
    const isRender = /\.onrender\.com$/.test(origin);
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (
      allowedOrigins.includes(origin) ||
      isVercel ||
      isNetlify ||
      isRender ||
      isLocalhost ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    // Reflect origin to allow preview deployments without disruption
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Explicit preflight handler compatible with Express 5
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Readiness Guard: prevents 10s Mongoose buffering timeout
app.use(async (req, res, next) => {
  // Allow health checks and documentation without blocking
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }

  // If already connected, continue immediately
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  // If currently connecting, wait briefly or respond
  if (mongoose.connection.readyState === 2) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (mongoose.connection.readyState === 1) return next();
    } catch {
      // Continue to next check
    }
  }

  // Attempt re-connection if disconnected
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(503).json({
      success: false,
      message:
        'Database connection unavailable. If using MongoDB Atlas, ensure IP 0.0.0.0/0 is whitelisted in Network Access.',
      error: err.message,
    });
  }
});

// Root Service Status (For Cloud Hosting Health Checks)
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'College Event Management System API',
    status: 'online',
    version: '1.0.0',
    documentation: 'See README.md',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      registrations: '/api/registrations',
      health: '/api/health',
    },
  });
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    message: 'College Event Management System API is running smoothly',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server if not loaded as a module in serverless function
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`College Event Management Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`Auth Endpoints: http://localhost:${PORT}/api/auth`);
    console.log(`Events Endpoints: http://localhost:${PORT}/api/events`);
    console.log(`Registration Endpoints: http://localhost:${PORT}/api/registrations`);
    console.log(`===============================================`);
  });
}

module.exports = app;

