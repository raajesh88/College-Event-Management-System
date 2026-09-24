const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Seed default events if database has no events
const seedDefaultEvents = async () => {
  try {
    const count = await Event.countDocuments();
    if (count > 0) return;

    console.log('Seeding initial campus events into MongoDB...');

    // Find or create a default organizer for initial events
    let organizer = await User.findOne({ role: 'organizer' });
    if (!organizer) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      organizer = await User.create({
        name: 'Prof. David Vance',
        email: 'david.vance@college.edu',
        password: hashedPassword,
        department: 'Computer Science & Engineering',
        role: 'organizer',
      });
    }

    const defaultEvents = [
      {
        title: 'HackCampus 2026: 36-Hour Hackathon',
        category: 'Hackathon',
        department: 'Computer Science & Engineering',
        date: 'Oct 14-16, 2026',
        time: '09:00 AM - 09:00 PM',
        venue: 'Campus Innovation Hub & Auditorium',
        capacity: 250,
        registeredCount: 42,
        status: 'Upcoming',
        description:
          'Build breakthrough applications in AI, Web3, and IoT with mentorship from leading tech pioneers and cash prizes.',
        image:
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'Tarang: Annual Inter-College Cultural Fest',
        category: 'Cultural',
        department: 'Student Affairs & Arts Council',
        date: 'Nov 02-04, 2026',
        time: '10:00 AM - 10:00 PM',
        venue: 'Open Air Amphitheatre',
        capacity: 800,
        registeredCount: 150,
        status: 'Upcoming',
        description:
          'Three electrifying days of battle of bands, classical dance, theatrical drama, fashion show, and art exhibitions.',
        image:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'International Robotics & AI Symposium',
        category: 'Technical',
        department: 'Electronics & Communication',
        date: 'Nov 18, 2026',
        time: '09:30 AM - 05:00 PM',
        venue: 'Mechanical & Robotics Center',
        capacity: 180,
        registeredCount: 28,
        status: 'Upcoming',
        description:
          'Keynotes from autonomous robotics researchers, live humanoid bot demonstrations, and hands-on ROS 2 workshops.',
        image:
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'Campus Leadership & Entrepreneurship Summit',
        category: 'Workshop',
        department: 'Business Administration',
        date: 'Dec 05, 2026',
        time: '11:00 AM - 04:00 PM',
        venue: 'Executive Seminar Hall A',
        capacity: 120,
        registeredCount: 60,
        status: 'Upcoming',
        description:
          'Pitch ideas directly to campus venture incubators and angel investors. Learn startup scaling tactics from YC alumni.',
        image:
          'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'CodeSprint: Algorithmic Contest',
        category: 'Coding',
        department: 'Computer Science & Engineering',
        date: 'Aug 12, 2025',
        time: '02:00 PM - 06:00 PM',
        venue: 'Turing Computer Lab 3',
        capacity: 150,
        registeredCount: 148,
        status: 'Completed',
        description:
          'Speed algorithmic puzzle challenge covering Dynamic Programming, Graph Theory, and Combinatorics.',
        image:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'National Cyber Security Awareness Seminar',
        category: 'Technical',
        department: 'Information Technology',
        date: 'Sep 08, 2025',
        time: '10:00 AM - 01:00 PM',
        venue: 'Virtual Hall & Seminar Hall 1',
        capacity: 200,
        registeredCount: 198,
        status: 'Completed',
        description:
          'Deep dive into zero-day exploitation, penetration testing methodology, and ethical defense pipelines.',
        image:
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
    ];

    await Event.insertMany(defaultEvents);
    console.log('Campus events seeded successfully.');
  } catch (err) {
    console.error('Error seeding default events:', err.message);
  }
};

// 1. Get All Events (with optional search, category, status filters)
const getAllEvents = async (req, res) => {
  try {
    const { category, search, status, department } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (department && department !== 'All') {
      filter.department = { $regex: department, $options: 'i' };
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { venue: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message,
    });
  }
};

// 2. Get Events for Logged-In Organizer
const getOrganizerEvents = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only organizers can access their managed events',
      });
    }

    const events = await Event.find({ organizer: req.user.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch organizer events',
      error: error.message,
    });
  }
};

// 3. Get Single Event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
};

// 4. Create New Event (Organizer Only)
const createEvent = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only organizers can publish new events',
      });
    }

    const {
      title,
      category,
      department,
      date,
      time,
      venue,
      capacity,
      description,
      image,
    } = req.body;

    if (!title || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Event title, date, and venue are required',
      });
    }

    // Lookup organizer name
    const organizerUser = await User.findById(req.user.userId);

    const event = await Event.create({
      title: title.trim(),
      category: category || 'Technical',
      department: department || organizerUser?.department || 'College Department',
      date: date.trim(),
      time: time ? time.trim() : '10:00 AM - 04:00 PM',
      venue: venue.trim(),
      capacity: parseInt(capacity, 10) || 100,
      registeredCount: 0,
      description: description ? description.trim() : '',
      image:
        image ||
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=80',
      organizer: req.user.userId,
      organizerName: organizerUser ? organizerUser.name : 'Faculty Coordinator',
      status: 'Upcoming',
    });

    return res.status(201).json({
      success: true,
      message: 'Event successfully created and published',
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message,
    });
  }
};

// 5. Update Event (Organizer Only)
const updateEvent = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only organizers can update events',
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Verify organizer owns the event
    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit events you created',
      });
    }

    const allowedFields = [
      'title',
      'category',
      'department',
      'date',
      'time',
      'venue',
      'capacity',
      'description',
      'image',
      'status',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message,
    });
  }
};

// 6. Delete Event (Organizer Only)
const deleteEvent = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only organizers can delete events',
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Verify ownership
    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete events you created',
      });
    }

    // Remove event and cascade delete associated registrations
    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ event: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message,
    });
  }
};

// 7. Get Event Participants (Organizer Only)
const getEventParticipants = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only organizers can access attendee lists',
      });
    }

    const { eventId, search } = req.query;
    let query = {};

    if (eventId) {
      query.event = eventId;
    } else {
      // Find all events created by this organizer
      const organizerEvents = await Event.find({ organizer: req.user.userId }).select('_id');
      const eventIds = organizerEvents.map((e) => e._id);
      query.event = { $in: eventIds };
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { studentName: { $regex: q, $options: 'i' } },
        { studentEmail: { $regex: q, $options: 'i' } },
        { studentDepartment: { $regex: q, $options: 'i' } },
        { eventTitle: { $regex: q, $options: 'i' } },
      ];
    }

    const participants = await Registration.find(query)
      .populate('event', 'title category date venue')
      .sort({ createdAt: -1 });

    const formatted = participants.map((p) => ({
      id: p.passCode,
      registrationId: p._id,
      name: p.studentName,
      email: p.studentEmail,
      department: p.studentDepartment,
      eventTitle: p.eventTitle,
      eventId: p.event?._id,
      regDate: p.createdAt ? p.createdAt.toISOString().split('T')[0] : 'N/A',
      status: p.status,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch participants',
      error: error.message,
    });
  }
};

module.exports = {
  seedDefaultEvents,
  getAllEvents,
  getOrganizerEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
};
