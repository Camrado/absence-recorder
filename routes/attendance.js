const express = require('express');
const AttendanceRouter = express.Router();

// Controllers
const { recordTheAttendance, getAttendanceStatus } = require('../controllers/attendance');

AttendanceRouter.post('/', recordTheAttendance);
AttendanceRouter.get('/status/:course', getAttendanceStatus);

module.exports = AttendanceRouter;
