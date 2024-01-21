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
    const data = jwt.verify(token, process.env.JWT_SECRET);

    const now = new Date();
    const expireDate = new Date(data.exp * 1000);

    if (now > expireDate) {
      throw new UnauthenticatedError("You've been logged out. Please sign in again.");
    }

    const { studentId, semesterId, password } = data;

    // attach the student to the routes
    req.student = { studentId, semesterId, password };
    next();
  } catch (err) {
    throw new UnauthenticatedError('Authentication Error.');
  }
};

module.exports = auth;
