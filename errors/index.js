const BadRequestError = require('./bad-request');
const NotFoundError = require('./not-found');
const UnauthenticatedError = require('./unathenticated');
const ForbiddenError = require('./forbidden');

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  ForbiddenError
};
