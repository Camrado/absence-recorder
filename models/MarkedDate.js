const mongoose = require('mongoose');

const MarkedDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  }
});

MarkedDateSchema.index({ date: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model('MarkedDate', MarkedDateSchema);
