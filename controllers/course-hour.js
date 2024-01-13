const { StatusCodes } = require('http-status-codes');
const CourseHour = require('../models/CourseHour');
const Semester = require('../models/Semester');
const { BadRequestError } = require('../errors');
const mongoose = require('mongoose');

const getCourseHours = async (req, res) => {
  const { semestername: semesterName } = req.query;

  let courseHours;

  if (semesterName) {
    const semester = await Semester.findOne({ name: semesterName });

    if (!semester) {
      throw new BadRequestError(`Incorrect semester name: ${semesterName}. Please provide valid semester name.`);
    }

    courseHours = await CourseHour.find({ semester_id: semester._id });
  } else {
    courseHours = await CourseHour.find();
  }

  res.status(StatusCodes.OK).json({ courseHours });
};

const createCourseHour = async (req, res) => {
  const { course, hours, semesterName } = req.body;
  const semester = await Semester.findOne({ name: semesterName });

  if (!semester) {
    throw new BadRequestError(`Incorrect semester name: ${semesterName}. Please provide valid semester name.`);
  }

  const courseHour = await CourseHour.create({
    course,
    hours,
    semester_id: semester._id
  });
  res.status(StatusCodes.CREATED).json({ msg: `Hours for '${courseHour.course}' was set successfully.`, courseHour });
};

const updateCourseHour = async (req, res) => {
  const { id: courseHourId } = req.params;
  const { course, hours } = req.body;

  // Checking if courseHourId is valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseHourId)) {
    throw new BadRequestError(`Incorrect CourseHour ID: ${courseHourId}. Please provide the valid ID.`);
  }

  const courseHour = await CourseHour.findByIdAndUpdate(
    courseHourId,
    { course, hours },
    {
      new: true,
      runValidators: true
    }
  );

  if (!courseHour) {
    throw new BadRequestError(`No CourseHour with ID: ${courseHourId}. Please provide ID of existing CourseHour.`);
  }

  res.status(StatusCodes.OK).json({ msg: `CourseHour with ID: '${courseHour._id}' was successfully updated.`, courseHour });
};

const deleteCourseHour = async (req, res) => {
  const { id: courseHourId } = req.params;

  // Checking if courseHourId is valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseHourId)) {
    throw new BadRequestError(`Incorrect CourseHour ID: ${courseHourId}. Please provide the valid ID.`);
  }

  const courseHour = await CourseHour.findByIdAndDelete(courseHourId);

  if (!courseHour) {
    throw new BadRequestError(`No CourseHour with ID: ${courseHourId}. Please provide ID of existing CourseHour.`);
  }

  res.status(StatusCodes.OK).json({ msg: `CourseHour with ID: '${courseHour._id}' was successfully deleted.`, courseHour });
};

module.exports = {
  getCourseHours,
  createCourseHour,
  updateCourseHour,
  deleteCourseHour
};
