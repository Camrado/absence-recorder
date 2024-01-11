const Student = require('../models/Student');
const { ForbiddenError } = require('../errors');

const adminAuth = async (req, res, next) => {
  const student = await Student.findById(req.student.studentId);

  if (!student.isAdmin) {
    throw new ForbiddenError('Forbidden: You do not have permission to access this resource.');
  }

  next();
};

module.exports = adminAuth;
