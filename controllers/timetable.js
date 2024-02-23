const { StatusCodes } = require('http-status-codes');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { getCorrectCourseName: convertCourseName } = require('../utils/convertCourseName');
const { Edupage } = require('edupage-api');
const Semester = require('../models/Semester');

const getTimetable = async (req, res) => {
  const { date } = req.params;
  const { studentId, password, semesterId } = req.student;

  const student = await Student.findById(studentId);
  const semester = await Semester.findById(semesterId);

  const edupage = new Edupage();
  await edupage.login(student.username, password);

  const timetable = await edupage.getTimetableForDate(new Date(date));
  const lessons = timetable.lessons;

  edupage.exit;

  const formattedLessons = [];
  const lessonsAttendanceStatuses = await Attendance.find({ date: new Date(date), student_id: studentId });

  for (let lesson of lessons) {
    const attended = lessonsAttendanceStatuses.find(
      (l) =>
        `${l.period}` === lesson.period.short &&
        (!lesson.groupnames[0] || lesson.groupnames[0].includes(`${student.group_number}`)) &&
        convertCourseName(l.course, semester.name) == convertCourseName(lesson.subject.name, semester.name)
    )?.attended;

    const tempLesson = {
      period: +lesson.period.short,
      course: lesson.subject.name,
      group: lesson.groupnames[0],
      attended
    };

    if (convertCourseName(tempLesson.course, semester.name) == 'none') {
      continue;
    }

    formattedLessons.push(tempLesson);
  }

  res.status(StatusCodes.OK).json({ msg: `Here is the timetable for ${date}`, lessons: formattedLessons });
};

module.exports = {
  getTimetable
};
