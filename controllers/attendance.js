const { StatusCodes } = require('http-status-codes');
const CourseHour = require('../models/CourseHour');
const Attendance = require('../models/Attendance');
const Semester = require('../models/Semester');
const getCorrectCourseName = require('../utils/convertCourseName');
const { BadRequestError } = require('../errors');

const recordTheAttendance = async (req, res) => {
  const { studentId, semesterId } = req.student;
  // ? lessons array is a list of lesson objects where each object has: string course (course name), boolean attended
  const { lessons } = req.body;
  const semester = await Semester.findById(semesterId);
  const updatedLessons = [];

  if (!lessons) {
    throw new BadRequestError('Provide lessons which attendance needs to be updated.');
  }

  for (let lesson of lessons) {
    const courseName = getCorrectCourseName(lesson.course, semester.name);

    if (!courseName) {
      throw new BadRequestError(`Invalid Course: ${lesson.course}. Please provide a correct course name.`);
    }
    if (lesson.attended === undefined) {
      throw new BadRequestError(`Provide the attendance status for the lesson: ${courseName}`);
    }

    let attendance = await Attendance.findOne({ course: courseName, student_id: studentId });

    if (!attendance) {
      const courseHour = await CourseHour.findOne({ course: courseName, semester_id: semesterId });

      const tempAttendanceObj = {
        course: courseName,
        remaining_lessons: courseHour.hours / 1.5,
        remaining_skips: Math.floor(courseHour.hours / 1.5 / 4),
        student_id: studentId
      };

      attendance = await Attendance.create(tempAttendanceObj);
    }

    const tempAttendanceObj = {
      skipped_lessons: attendance.skipped_lessons,
      attended_lessons: attendance.attended_lessons,
      remaining_skips: attendance.remaining_skips,
      remaining_lessons: attendance.remaining_lessons - 1
    };

    if (lesson.attended) {
      tempAttendanceObj.attended_lessons += 1;
    } else {
      tempAttendanceObj.skipped_lessons += 1;
      tempAttendanceObj.remaining_skips -= 1;
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(attendance._id, tempAttendanceObj, {
      new: true,
      runValidators: true
    });

    updatedLessons.push(updatedAttendance);
  }

  res.status(StatusCodes.OK).json({ msg: `Attendance was successfully updated.`, updatedLessons });
};

module.exports = {
  recordTheAttendance
};
