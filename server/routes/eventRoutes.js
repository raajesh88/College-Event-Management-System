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
} = require('../controllers/eventController');

// Public route: Browse all events (filters: category, search, department)
router.get('/', getAllEvents);

// Organizer routes (protected)
router.get('/organizer/my-events', authMiddleware, getOrganizerEvents);
router.get('/organizer/participants', authMiddleware, getEventParticipants);
router.post('/', authMiddleware, createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

// Public route: Get single event
router.get('/:id', getEventById);

module.exports = router;
