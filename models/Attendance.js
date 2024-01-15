const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  skipped_lessons: {
    type: Number,
    default: 0,
    required: true
  },
  attended_lessons: {
    type: Number,
    default: 0,
    required: true
  },
  remaining_skips: {
    type: Number,
    default: 0,
    required: true
  },
  remaining_lessons: {
    type: Number,
    default: 0,
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
