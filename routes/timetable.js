const express = require('express');
const TimetableRouter = express.Router();

// Controllers
const { getTimetable } = require('../controllers/timetable');

TimetableRouter.get('/:date', getTimetable);

module.exports = TimetableRouter;
