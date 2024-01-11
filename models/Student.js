const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const StudentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  term_number: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  group_number: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  semester_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Semester'
  }
});

StudentSchema.methods.createJWT = function () {
  return jwt.sign({ studentId: this._id, semesterId: this.semester_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  });
};

module.exports = mongoose.model('Student', StudentSchema);
