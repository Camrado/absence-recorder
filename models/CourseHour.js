const mongoose = require('mongoose');

const CourseHourSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  semester_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Semester'
  }
});

module.exports = mongoose.model('CourseHour', CourseHourSchema);
