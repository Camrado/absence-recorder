const express = require('express');
const CourseHourRouter = express.Router();

// Controllers
const { getCourseHours, createCourseHour, updateCourseHour, deleteCourseHour } = require('../controllers/course-hour');

CourseHourRouter.get('/', getCourseHours);
CourseHourRouter.post('/', createCourseHour);
CourseHourRouter.patch('/:id', updateCourseHour);
CourseHourRouter.delete('/:id', deleteCourseHour);

module.exports = CourseHourRouter;
