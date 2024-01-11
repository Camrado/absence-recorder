const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication Error. You have to be signed in!');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { studentId, semesterId } = jwt.verify(token, process.env.JWT_SECRET);

    // attach the student to the routes
    req.student = { studentId, semesterId };
    next();
  } catch (err) {
    throw new UnauthenticatedError('Authentication Error.');
  }
};

module.exports = auth;
