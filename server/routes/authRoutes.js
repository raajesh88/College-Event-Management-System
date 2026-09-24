const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register - Register a new user (student or organizer)
router.post('/register', register);

// POST /api/auth/login - Login existing user & receive JWT token
router.post('/login', login);

// GET /api/auth/me - Protected route to get authenticated user details
router.get('/me', authMiddleware, getMe);

module.exports = router;
