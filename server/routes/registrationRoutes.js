const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
} = require('../controllers/registrationController');

// All registration routes are protected (students)
router.get('/my-registrations', authMiddleware, getMyRegistrations);
router.post('/:eventId', authMiddleware, registerForEvent);
router.delete('/:eventId', authMiddleware, cancelRegistration);

module.exports = router;
