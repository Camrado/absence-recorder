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

  // return res.status(customError.statusCode).json(err);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
