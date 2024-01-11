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
  if (err.code === 11000) {
    customError.msg = `Failed to register. The account with '${err.keyValue.username}' username is already registered.`;
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }
  if (err.name === 'ValidationError') {
    customError.msg = err.message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // return res.status(customError.statusCode).json(err);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
