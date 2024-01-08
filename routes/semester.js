const express = require('express');
const SemesterRouter = express.Router();

// Controllers
const { createSemester, getSemester } = require('../controllers/semester');

SemesterRouter.get('/', getSemester);
SemesterRouter.post('/', createSemester);

module.exports = SemesterRouter;
