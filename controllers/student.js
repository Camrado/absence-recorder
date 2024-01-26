const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const Student = require('../models/Student');
const Semester = require('../models/Semester');

const getStudentData = async (req, res) => {
  const { studentId, semesterId } = req.student;
  const student = await Student.findById(studentId);
  const semester = await Semester.findById(semesterId);

  let studentData = {
    username: student.username,
    term: student.term_number,
    group: student.group_number,
    semester: semester.name
  };

  res.status(StatusCodes.OK).json({ ...studentData });
};

const updateStudent = async (req, res) => {
  const { term, group } = req.body;
  const { studentId, semesterId, password } = req.student;

  if (!term && !group) {
    throw new BadRequestError('Nothing to update. Provide new term or(and) group number(s) to update.');
  }

  const newDetails = {};

  if (term) {
    newDetails.term_number = term;

    const oldSemester = await Semester.findById(semesterId);

    let newSemesterName = oldSemester.name;
    const indexToChange = newSemesterName.toLowerCase().indexOf('s') + 1;
    let tempNewSemesterName = newSemesterName.split('');
    tempNewSemesterName[indexToChange] = term;
    newSemesterName = tempNewSemesterName.join('');

    const newSemester = await Semester.findOne({ name: newSemesterName });
    newDetails.semester_id = newSemester._id;
  }

  if (group) {
    newDetails.group_number = group;
  }

  const student = await Student.findByIdAndUpdate(studentId, newDetails, {
    new: true,
    runValidators: true
  });

  if (term) {
    // create a JWT token
    const token = student.createJWT(password);
    const expireDate = new Date();
    expireDate.setDate(new Date().getDate() + +process.env.JWT_LIFETIME.substring(0, 2));
    return res.status(StatusCodes.OK).json({ msg: `Your account was successfully updated.`, student, token, expireDate });
  }

  res.status(StatusCodes.OK).json({ msg: `Your account was successfully updated.`, student });
};

module.exports = { getStudentData, updateStudent };
