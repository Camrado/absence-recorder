const Student = require('../models/Student');
const { Edupage } = require('edupage-api');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnathenticatedError } = require('../errors');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError('Failed to login. Please provide username and password.');
  }

  const edupage = new Edupage();
  await edupage.login(username, password);
  let semesterName;

  // TODO: set semester name so the user with correct semester_id can be added to db

  switch (edupage.user.class.name) {
    case 'A':
    case 'B':
    case 'C':
    case 'D':
      break;

    default:
      break;
  }

  edupage.exit();
};

module.exports = { login };
