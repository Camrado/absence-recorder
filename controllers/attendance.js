const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const Attendance = require('../models/Attendance');
const CourseHour = require('../models/CourseHour');
const Semester = require('../models/Semester');
const getCorrectCourseName = require('../utils/convertCourseName');

const recordTheAttendance = async (req, res) => {
  const { studentId, semesterId } = req.student;
  // ? lessons array is a list of lesson objects where each object has: string course (course name), boolean attended, number period
  const { date, lessons } = req.body;
  const semester = await Semester.findById(semesterId);
  let updatedAttendanceRecords = [];

  if (!date || !lessons) {
    throw new BadRequestError('Provide all the required data.');
  }
  if (new Date(date).toString() === 'Invalid Date') {
    throw new BadRequestError(`Invalid Date: ${date}. Provide correct date.`);
  }

  for (let lesson of lessons) {
    const courseName = getCorrectCourseName(lesson.course, semester.name);

    if (!courseName) {
      throw new BadRequestError(`Invalid Course: ${lesson.course}. Please provide a correct course name.`);
    }
    if (lesson.attended === undefined || typeof lesson.attended != 'boolean') {
      throw new BadRequestError(`Provide the attendance status for the lesson: ${courseName}`);
    }
    if (typeof lesson.period != 'number') {
      throw new BadRequestError(`Provide the correct period number for the lesson: ${courseName}`);
    }

    let attendanceRecord = await Attendance.findOne({
      course: courseName,
      date: new Date(date),
      period: lesson.period,
      student_id: studentId
    });

    // if the attendance record for the course 'courseName' doesn't exist then create one
    if (!attendanceRecord) {
      attendanceRecord = await Attendance.create({
        course: courseName,
        date: new Date(date),
        period: lesson.period,
        student_id: studentId
      });
    }

    attendanceRecord.attended = lesson.attended;

    updatedAttendanceRecords.push(attendanceRecord);
  }

  // save all the changes made
  for (let updatedAttendanceRecord of updatedAttendanceRecords) {
    await updatedAttendanceRecord.save();
  }

  res.status(StatusCodes.OK).json({ msg: `Attendance Records were successfully updated.`, updatedAttendanceRecords });
};

const getAttendanceStatus = async (req, res) => {
  const { studentId, semesterId } = req.student;
  const semester = await Semester.findById(semesterId);

  const { course } = req.params;
  const courseName = getCorrectCourseName(course, semester.name);
  if (!courseName) {
    throw new BadRequestError(`Invalid Course: ${course}. Please provide a correct course name.`);
  }

  const attendedLessonsNumber = await Attendance.countDocuments({ course: courseName, attended: true, student_id: studentId });
  const skippedLessonsNumber = await Attendance.countDocuments({ course: courseName, attended: false, student_id: studentId });
  const courseHour = await CourseHour.findOne({ course: courseName, semester_id: semesterId });
  const totalLessonsNumber = courseHour.hours / 1.5;

  const attendanceStatus = {
    course: courseName,
    attendedLessons: attendedLessonsNumber,
    skippedLessons: skippedLessonsNumber,
    remainingLessons: totalLessonsNumber - (attendedLessonsNumber + skippedLessonsNumber),
    remainingSkips: Math.floor(totalLessonsNumber / 4) - skippedLessonsNumber,
    totalLessons: totalLessonsNumber
  };

  res.status(StatusCodes.OK).json(attendanceStatus);
};

module.exports = {
  recordTheAttendance,
  getAttendanceStatus
};
