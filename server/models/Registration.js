const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    studentDepartment: {
      type: String,
      required: true,
      trim: true,
    },
    eventTitle: {
      type: String,
      required: true,
      trim: true,
    },
    passCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled', 'Attended'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a student from registering for the same event multiple times
registrationSchema.index({ event: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
