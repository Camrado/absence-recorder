const express = require('express');
const StudentRouter = express.Router();

// Controllers
const { updateStudent } = require('../controllers/student');

StudentRouter.patch('/', updateStudent);

module.exports = StudentRouter;
