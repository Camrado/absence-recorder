const express = require('express');
const AttendanceRouter = express.Router();

// Controllers
const { recordTheAttendance, getAttendanceStatus, getUnmarkedDates, getSubjectNames } = require('../controllers/attendance');

AttendanceRouter.post('/', recordTheAttendance);
AttendanceRouter.get('/status/:course', getAttendanceStatus);
AttendanceRouter.get('/unmarked-dates', getUnmarkedDates);
AttendanceRouter.get('/subjects', getSubjectNames);

module.exports = AttendanceRouter;
