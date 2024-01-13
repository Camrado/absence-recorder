const Semester = require('../models/Semester');
const { BadRequestError } = require('../errors');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');

const createSemester = async (req, res) => {
  const semester = await Semester.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: `Semester '${semester.name}' was successfully created.` }, semester);
};

const getSemester = async (req, res) => {
  const { id: semesterId, name: semesterName } = req.query;

  let semester;

  if (semesterId) {
    // Checking if semesterId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(semesterId)) {
      throw new BadRequestError(`Incorrect semester ID: ${semesterId}. Please provide valid semester ID.`);
    }

    semester = await Semester.findOne({ _id: semesterId });

    if (!semester) {
      throw new BadRequestError(`No semester with ID: ${semesterId}. Please provide correct ID of existing semester.`);
    }
  } else if (semesterName) {
    semester = await Semester.findOne({ name: semesterName });

    if (!semester) {
      throw new BadRequestError(`No semester with Name: ${semesterName}. Please provide correct Name of existing semester.`);
    }
  } else {
    semester = await Semester.find({});
  }

  res.status(StatusCodes.OK).json(semester);
};

module.exports = {
  createSemester,
  getSemester
};
