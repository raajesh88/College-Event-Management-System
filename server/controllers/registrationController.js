const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

// 1. Register for an Event (Student Only)
const registerForEvent = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only students can register for events',
      });
    }

    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is already completed or cancelled
    if (event.status === 'Completed' || event.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot register for a ${event.status.toLowerCase()} event`,
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event has reached maximum capacity',
      });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      event: eventId,
      student: req.user.userId,
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Fetch student info
    const studentUser = await User.findById(req.user.userId);
    if (!studentUser) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found',
      });
    }

    // Generate unique pass code: PASS-<EventSuffix>-<RandomCode>
    const eventSuffix = event._id.toString().slice(-4).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const passCode = `PASS-${eventSuffix}-${randomSuffix}`;

    const registration = await Registration.create({
      event: event._id,
      student: studentUser._id,
      studentName: studentUser.name,
      studentEmail: studentUser.email,
      studentDepartment: studentUser.department,
      eventTitle: event.title,
      passCode,
      status: 'Confirmed',
    });

    // Increment event registration count
    event.registeredCount = (event.registeredCount || 0) + 1;
    await event.save();

    return res.status(201).json({
      success: true,
      message: `Successfully registered for "${event.title}"!`,
      data: {
        registrationId: registration._id,
        passCode: registration.passCode,
        eventTitle: registration.eventTitle,
        eventDate: event.date,
        eventVenue: event.venue,
        status: registration.status,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to process event registration',
      error: error.message,
    });
  }
};

// 2. Withdraw / Cancel Registration (Student Only)
const cancelRegistration = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only students can cancel registrations',
      });
    }

    const { eventId } = req.params;

    const registration = await Registration.findOne({
      event: eventId,
      student: req.user.userId,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found for this event',
      });
    }

    // Remove registration
    await Registration.findByIdAndDelete(registration._id);

    // Decrement event registeredCount
    const event = await Event.findById(eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    return res.status(200).json({
      success: true,
      message: `Registration withdrawn for "${registration.eventTitle}"`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
      error: error.message,
    });
  }
};

// 3. Get All Registrations for Logged-In Student
const getMyRegistrations = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only students have personal event registrations',
      });
    }

    const registrations = await Registration.find({ student: req.user.userId })
      .populate('event')
      .sort({ createdAt: -1 });

    const formatted = registrations.map((r) => {
      const evt = r.event || {};
      return {
        registrationId: r._id,
        passCode: r.passCode,
        eventId: evt._id || r.event,
        title: evt.title || r.eventTitle,
        category: evt.category || 'Event',
        department: evt.department || r.studentDepartment,
        date: evt.date || 'TBD',
        time: evt.time || 'TBD',
        venue: evt.venue || 'Campus Venue',
        image:
          evt.image ||
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        description: evt.description || '',
        status: (evt.status || 'Upcoming').toLowerCase(),
        regDate: r.createdAt ? r.createdAt.toISOString().split('T')[0] : 'N/A',
        regStatus: r.status,
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch personal registrations',
      error: error.message,
    });
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
};
