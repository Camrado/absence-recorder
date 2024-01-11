const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const Student = require('../models/Student');

const updateStudent = async (req, res) => {
  const { term, group } = req.body;

  if (!term && !group) {
    throw new BadRequestError('Nothing to update. Provide new term or(and) group number(s) to update.');
  }

  const newDetails = {};
  if (term) {
    newDetails.term_number = term;
  }
  if (group) {
    newDetails.group_number = group;
  }

  const { studentId } = req.student;
  const student = await Student.findByIdAndUpdate(studentId, newDetails, {
    new: true,
    runValidators: true
  });

  res.status(StatusCodes.OK).json({ msg: `Your account was successfully updated.`, student });
};

module.exports = { updateStudent };
