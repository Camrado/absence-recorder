const express = require('express');
const StudentRouter = express.Router();

// Controllers
const { getStudentData, updateStudent } = require('../controllers/student');

StudentRouter.get('/me', getStudentData);
StudentRouter.patch('/', updateStudent);

module.exports = StudentRouter;
