const mongoose = require('mongoose');

const AttendaceSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    unique: false
  },
  period: {
    type: Number,
    required: true,
    unique: false
  },
  attended: {
    type: Boolean,
    required: false,
    default: null
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  }
});

AttendaceSchema.index({ date: 1, period: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendaceSchema);
