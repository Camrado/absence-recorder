const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const Attendance = require('../models/Attendance');
const CourseHour = require('../models/CourseHour');
const Semester = require('../models/Semester');
const Student = require('../models/Student');
const MarkedDate = require('../models/MarkedDate');
const { Edupage } = require('edupage-api');
const { getCorrectCourseName, subjectsL0S2 } = require('../utils/convertCourseName');

const recordTheAttendance = async (req, res) => {
  const { studentId, semesterId } = req.student;
  // ? lessons array is a list of lesson objects where each object has: string course (course name), boolean attended, number period
  const { date, isDateMarked, lessons } = req.body;
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
    } else {
      attendanceRecord.course = courseName;
    }

    attendanceRecord.attended = lesson.attended;

    updatedAttendanceRecords.push(attendanceRecord);
  }

  // save all the changes made
  for (let updatedAttendanceRecord of updatedAttendanceRecords) {
    await updatedAttendanceRecord.save();
  }

  if (isDateMarked === true) {
    let isDateAlreadyMarked = await MarkedDate.findOne({ date: new Date(date), student_id: studentId });
    if (!isDateAlreadyMarked) {
      await MarkedDate.create({ date: new Date(date), student_id: studentId });
    }
  }

  res.status(StatusCodes.OK).json({ msg: `Attendance Records were successfully updated.` });
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

  if (courseName == 'Azerbaijani Language') {
    const attendanceStatus = {
      course: courseName,
      attendedLessons: attendedLessonsNumber,
      skippedLessons: skippedLessonsNumber
    };

    return res
      .status(StatusCodes.OK)
      .json({ msg: `Attendance status for ${courseName} course was successfully retrieved.`, attendanceStatus });
  }

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

  if ((courseName.includes('Physics') || courseName.includes('Chemistry')) && courseName.includes('PW')) {
    attendanceStatus.remainingSkips = 0;
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: `Attendance status for ${courseName} course was successfully retrieved.`, attendanceStatus });
};

const getUnmarkedDates = async (req, res) => {
  const { studentId, password } = req.student;
  const student = await Student.findById(studentId);

  const edupage = new Edupage();
  await edupage.login(student.username, password);

  const endDate = new Date(); // ! changed to new Date()
  const startDate = new Date(endDate); // one month before now
  startDate.setMonth(endDate.getMonth() - 1);

  const timetables = await edupage.fetchTimetablesForDates(startDate, endDate);

  edupage.exit();

  let markedDates = await MarkedDate.find({ student_id: studentId });
  markedDates = markedDates.map((markedDate) => markedDate.date.getTime()); // converting to miliseconds to be able to compare

  let unmarkedDates = [];

  for (let timetable of timetables) {
    if (markedDates.includes(timetable.date.getTime())) {
      continue;
    } else if (timetable.lessons.length === 0) {
      continue;
    } else if (timetable.lessons.length !== 0) {
      // Check if the lessons are only for the other group or not
      let onlyOtherGroup = true;
      let otherGroupNumber = student.group_number === 1 ? 2 : 1;

      for (let lesson of timetable.lessons) {
        if (!lesson.groupnames[0].includes(`${otherGroupNumber}`)) {
          onlyOtherGroup = false;
          break;
        }
      }

      if (onlyOtherGroup) continue;
      else unmarkedDates.push(timetable.date);
    }
  }

  res.status(StatusCodes.OK).json({ unmarkedDates });
};

const getSubjectNames = (req, res) => {
  res.status(StatusCodes.OK).json({ subjects: Object.entries(subjectsL0S2) });
};

module.exports = {
  recordTheAttendance,
  getAttendanceStatus,
  getUnmarkedDates,
  getSubjectNames
};
