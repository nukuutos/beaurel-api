const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { mongoConnect } = require('./utils/database');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const appointmentRoutes = require('./routes/appointment');
const serviceRoutes = require('./routes/service');
const timetableRoutes = require('./routes/timetable');
const reviewRoutes = require('./routes/review');

const auth = require('./middleware/auth');
const master = require('./middleware/master');

// const { updateTimetableJob, updateServiceJob, updateAppointmentJob } = require('./utils/scheduleJob');
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// app.use('/', (req, res, next) => {
//   console.log('--- REQUEST ---');
//   console.log(req.method, req.url);
//   next();
// });

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/appointment', auth, appointmentRoutes);
app.use('/api/v1/service', auth, master, serviceRoutes);
app.use('/api/v1/timetable', auth, master, timetableRoutes);
app.use('/api/v1/profile', profileRoutes);
// app.use('/api/v1/profile',  profileRoutes);
app.use('/api/v1/review', auth, reviewRoutes);

// updateTimetableJob.start();
// updateServiceJob.start();
// updateAppointmentJob.start();

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error); // if res has already sent
  const { message, statusCode } = error;

  console.error(message);

  res.status(statusCode || 500).json({ message: message || 'Server error occured. Please try again.' });
});

mongoConnect(() => app.listen(process.env.PORT || 5000));
