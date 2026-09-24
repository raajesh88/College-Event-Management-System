const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: [
          'Technical',
          'Hackathon',
          'Cultural',
          'Workshop',
          'Sports',
          'Seminar',
          'Coding',
          'Other',
        ],
        message: 'Invalid event category',
      },
      default: 'Technical',
    },
    department: {
      type: String,
      required: [true, 'Please provide hosting department'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide event date'],
      trim: true,
    },
    time: {
      type: String,
      default: '10:00 AM - 04:00 PM',
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Please provide event venue or room'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify event capacity'],
      min: [1, 'Capacity must be at least 1'],
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=80',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizerName: {
      type: String,
      default: 'Faculty Coordinator',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
