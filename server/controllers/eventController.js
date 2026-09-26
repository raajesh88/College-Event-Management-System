const mongoose = require('mongoose');
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
        title: 'HackCampus 2026: 36-Hour National Hackathon',
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
        title: 'RoboQuest: Autonomous Robotics & AI Symposium',
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
        title: 'Full-Stack Cloud & DevOps Architecture Workshop',
        category: 'Workshop',
        department: 'Information Technology',
        date: 'Dec 05, 2026',
        time: '11:00 AM - 04:00 PM',
        venue: 'Executive Seminar Hall A & Cloud Lab',
        capacity: 120,
        registeredCount: 60,
        status: 'Upcoming',
        description:
          'Hands-on lab deploying containerized microservices to cloud clusters with automated CI/CD pipelines and load testing.',
        image:
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'Championship Trophy: Inter-Department Football & Track Meet',
        category: 'Sports',
        department: 'Physical Education & Athletics',
        date: 'Dec 12-14, 2026',
        time: '08:00 AM - 06:00 PM',
        venue: 'Main Campus Stadium & Sports Complex',
        capacity: 350,
        registeredCount: 110,
        status: 'Upcoming',
        description:
          'Annual varsity championship games featuring inter-department football tournaments, 100m sprint relays, basketball showdowns, and badminton cups.',
        image:
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'National Collegiate Debate & Case Study Challenge',
        category: 'Competition',
        department: 'Literary & Debating Society',
        date: 'Jan 10, 2027',
        time: '10:00 AM - 05:30 PM',
        venue: 'Central Conference Hall',
        capacity: 120,
        registeredCount: 45,
        status: 'Upcoming',
        description:
          'Showcase critical thinking, debate prowess, business case modeling, and quiz acumen in prestigious campus-wide tournaments.',
        image:
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'Future Horizons: AI Ethics & Quantum Computing Seminar',
        category: 'Seminar',
        department: 'Research & Development Cell',
        date: 'Jan 22, 2027',
        time: '02:00 PM - 05:00 PM',
        venue: 'Auditorium Block C',
        capacity: 200,
        registeredCount: 88,
        status: 'Upcoming',
        description:
          'Distinguished keynote lecture by quantum computing research fellows exploring the paradigm shift in next-generation computation and ethical artificial intelligence.',
        image:
          'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=700&q=80',
        organizer: organizer._id,
        organizerName: organizer.name,
      },
      {
        title: 'Campus Photography Society Showcase & Heritage Walk',
        category: 'Club Activity',
        department: 'Photography & Creative Arts Club',
        date: 'Feb 06, 2027',
        time: '03:00 PM - 07:00 PM',
        venue: 'Student Activities Center & Campus Lawn',
        capacity: 80,
        registeredCount: 35,
        status: 'Upcoming',
        description:
          'Live photo exhibition displaying student perspectives on campus architecture, followed by a golden-hour outdoor photo walk and critique session.',
        image:
          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80',
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
    ];

    for (const evt of defaultEvents) {
      const exists = await Event.findOne({ title: evt.title });
      if (!exists) {
        await Event.create(evt);
        console.log(`Seeded event for activity: ${evt.category} - ${evt.title}`);
      }
    }
    console.log('All activities verified with at least one event in database.');
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

    // Return all campus events so faculty organizers have complete administrative visibility
    const events = await Event.find().sort({
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

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

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Faculty organizers have campus-wide administrative authority
    const oldTitle = event.title;
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
        if (field === 'capacity') {
          event[field] = parseInt(req.body[field], 10) || event[field];
        } else {
          event[field] = req.body[field];
        }
      }
    });

    await event.save();

    // If event title changed, update existing Registration records to keep them synced
    if (req.body.title && req.body.title !== oldTitle) {
      await Registration.updateMany(
        { event: event._id },
        { eventTitle: event.title }
      );
    }

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

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Faculty organizers have campus-wide authority to manage events
    // Remove event and cascade delete associated registrations
    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ event: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully',
      deletedId: req.params.id,
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

    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
      query.event = eventId;
    }
    // Note: When no specific eventId is supplied, all campus registrations are returned
    // so faculty organizers have complete oversight of all enrolled students.

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { studentName: { $regex: q, $options: 'i' } },
        { studentEmail: { $regex: q, $options: 'i' } },
        { studentDepartment: { $regex: q, $options: 'i' } },
        { eventTitle: { $regex: q, $options: 'i' } },
        { passCode: { $regex: q, $options: 'i' } },
      ];
    }

    const participants = await Registration.find(query)
      .populate('event', 'title category date venue capacity registeredCount')
      .populate('student', 'name email department')
      .sort({ createdAt: -1 });

    const formatted = participants.map((p) => ({
      id: p.passCode || `PASS-${p._id.toString().slice(-4).toUpperCase()}`,
      registrationId: p._id,
      name: p.studentName || p.student?.name || 'Student Participant',
      email: p.studentEmail || p.student?.email || '',
      department: p.studentDepartment || p.student?.department || 'Engineering & Technology',
      eventTitle: p.eventTitle || p.event?.title || 'Campus Event',
      eventId: p.event?._id || p.event,
      regDate: p.createdAt ? p.createdAt.toISOString().split('T')[0] : 'N/A',
      status: p.status || 'Confirmed',
      checkedIn: p.status === 'Attended',
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

// 8. Toggle Participant Check-in Gate Status (Organizer Only)
const toggleCheckInStatus = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only organizers can manage gate check-in',
      });
    }

    const { id } = req.params;
    let reg = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      reg = await Registration.findById(id);
    }
    if (!reg) {
      reg = await Registration.findOne({ passCode: id });
    }

    if (!reg) {
      return res.status(404).json({
        success: false,
        message: 'Participant registration record not found',
      });
    }

    reg.status = reg.status === 'Attended' ? 'Confirmed' : 'Attended';
    await reg.save();

    return res.status(200).json({
      success: true,
      message: `Participant gate entry updated to: ${reg.status}`,
      data: {
        registrationId: reg._id,
        passCode: reg.passCode,
        status: reg.status,
        checkedIn: reg.status === 'Attended',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update check-in status',
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
  toggleCheckInStatus,
};
