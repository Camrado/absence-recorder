// Node Modules
require('dotenv').config();
require('express-async-errors');

// Extra security modules
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect');

// Middlewares
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const authenticateUser = require('./middlewares/authentication');
const authenticateAdmin = require('./middlewares/admin-authentication');

// Routes
const authRouter = require('./routes/auth');
const semesterRouter = require('./routes/semester');
const studentRouter = require('./routes/student');
const courseHourRouter = require('./routes/course-hour');
// const attendanceStatusRouter = require('./routes/attendance-status');
const attendanceRouter = require('./routes/attendance');
const timetableRouter = require('./routes/timetable');

// it is a legacy line of code so that it would work when we upload it to heroku, in a newer version this line of code seems to be redundant
app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
//   })
// );
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(xss());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/semester', authenticateUser, authenticateAdmin, semesterRouter);
app.use('/api/v1/course-hour', authenticateUser, authenticateAdmin, courseHourRouter);
app.use('/api/v1/student', authenticateUser, studentRouter);
// app.use('/api/v1/attendance', authenticateUser, attendanceStatusRouter);
app.use('/api/v1/attendance', authenticateUser, attendanceRouter);
app.use('/api/v1/timetable', authenticateUser, timetableRouter);

// Error Handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
