const express = require('express');
const AttendanceRouter = express.Router();

// Controllers
const { recordTheAttendance } = require('../controllers/attendance');

AttendanceRouter.post('/', recordTheAttendance);

module.exports = AttendanceRouter;
