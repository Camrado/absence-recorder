const Student = require('../models/Student');
const Semester = require('../models/Semester');
const { Edupage } = require('edupage-api');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const { username, password, term, group } = req.body;

  // basic validations
  if (!username || !password || !term || !group) {
    throw new BadRequestError('Failed to register. Please provide username, password, term number, and group number.');
  }
  if (!(term === 1 || term === 2)) {
    throw new BadRequestError('Failed to get right term number. Please input either 1 or 2.');
  }
  if (!(group === 1 || group === 2)) {
    throw new BadRequestError('Failed to get right group number. Please input either 1 or 2.');
  }

  // try to login the user with the username and password credentials. if it fails, it will throw an error.
  const edupage = new Edupage();
  await edupage.login(username, password);

  let className = edupage.user.class.name.trim();

  // get semester name like 'L0S1', 'L1S2CS', etc. to add that semester_id to student
  let semesterName;
  if (className == 'A' || className == 'B' || className == 'C' || className == 'D') {
    semesterName = `L0S${term}`;
  } else {
    semesterName = `L${className[1]}S${term}${className[3]}${className[4]}`;
  }

  // finished working with edupage
  edupage.exit();

  const semester = await Semester.findOne({ name: semesterName });
  const studentObj = { username, term_number: term, group_number: group, semester_id: semester._id };

  const student = await Student.create(studentObj);

  // create a JWT token
  const token = student.createJWT();

  res.status(StatusCodes.CREATED).json({ msg: `${student.username}'s account was successfully created.`, student, token });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  // basic validation
  if (!username || !password) {
    throw new BadRequestError('Failed to login. Please provide username and password.');
  }

  const student = await Student.findOne({ username });

  // check if user provided username that is signed up
  if (!student) {
    throw new UnauthenticatedError(`Student ${username} is not registered. Please sign up.`);
  }

  // check for correct credentials
  const edupage = new Edupage();
  await edupage.login(username, password);
  edupage.exit();

  // create a JWT token
  const token = student.createJWT();

  res.status(StatusCodes.OK).json({ msg: `You were successfully logged in.`, student, token });
};

module.exports = { login, register };
