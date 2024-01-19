const { StatusCodes } = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Try again later'
  };

  if (err.name === 'LoginError') {
    customError.msg = 'Failed to login. Please provide correct credentials to your Edupage Account.';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }
  if (err.code === 11000 && err.keyPattern.username) {
    customError.msg = `Failed to register. The account with '${err.keyValue.username}' username is already registered.`;
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }
  if (err.code === 11000 && err.keyPattern.date && err.keyPattern.period) {
    customError.msg = `Failed to create an attendance record at period ${
      err.keyValue.period
    } at ${err.keyValue.date.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}, because it is already taken.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'ValidationError') {
    customError.msg = err.message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // return res.status(customError.statusCode).json(err);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
