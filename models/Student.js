const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  term: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  semester_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Semester'
  }
});

module.exports = mongoose.model('Student', StudentSchema);
