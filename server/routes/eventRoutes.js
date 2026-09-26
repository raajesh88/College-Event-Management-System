const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllEvents,
  getOrganizerEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  toggleCheckInStatus,
} = require('../controllers/eventController');

// Public route: Browse all events (filters: category, search, department)
router.get('/', getAllEvents);

// Organizer routes (protected)
router.get('/organizer/my-events', authMiddleware, getOrganizerEvents);
router.get('/organizer/participants', authMiddleware, getEventParticipants);
router.patch('/organizer/participants/:id/checkin', authMiddleware, toggleCheckInStatus);
router.post('/', authMiddleware, createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

// Public route: Get single event
router.get('/:id', getEventById);

module.exports = router;
