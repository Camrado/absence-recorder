const Student = require('../models/Student');
const Semester = require('../models/Semester');
const { Edupage } = require('edupage-api');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnathenticatedError } = require('../errors');

const login = async (req, res) => {
  const { username, password, term } = req.body;

  if (!username || !password) {
    throw new BadRequestError('Failed to login. Please provide username and password.');
  }

  const edupage = new Edupage();
  await edupage.login(username, password);
  let className = edupage.user.class.name;

  let semesterName;

  if(className == 'A' || className == 'B' || className == 'C' || className == 'D') {
    semesterName = 
  }

  edupage.exit();
};

module.exports = { login };
