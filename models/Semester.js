const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'L0S1',
      'L0S2',
      'L1S1CS',
      'L1S1CE',
      'L1S1GE',
      'L1S1PE',
      'L1S2CS',
      'L1S2CE',
      'L1S2GE',
      'L1S2PE',
      'L2S1CS',
      'L2S1CE',
      'L2S1GE',
      'L2S1PE',
      'L2S2CS',
      'L2S2CE',
      'L2S2GE',
      'L2S2PE',
      'L3S1CS',
      'L3S1CE',
      'L3S1GE',
      'L3S1PE',
      'L3S2CS',
      'L3S2CE',
      'L3S2GE',
      'L3S2PE'
    ]
  },
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('Semester', SemesterSchema);
