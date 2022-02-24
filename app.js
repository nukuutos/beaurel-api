const express = require('express');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

require('./modules');

const errorHandler = require('./middleware/error-handler');
const cors = require('./middleware/cors');
const staticFolder = require('./middleware/static-folder');

const timezoneRoutes = require('./routes/timezone');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile/profile');
const masterRoutes = require('./routes/master/master');
const logRequest = require('./middleware/log-request');
const serviceUpdateJob = require('./cron/service-update-job');
const timetableUpdateJob = require('./cron/timetable-update-job');
const restoreAuthAttemptsJob = require('./cron/restore-auth-attempts-job');
const deleteUnconfirmedAccountsJob = require('./cron/delete-unconfirmed-accounts-job');

const app = express();

app.use(cors);

app.use('/images', staticFolder);

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());

app.use('/', logRequest);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/master', masterRoutes);
app.use('/api/v1/timezone', timezoneRoutes);

serviceUpdateJob();
timetableUpdateJob();
restoreAuthAttemptsJob();
deleteUnconfirmedAccountsJob();

app.use(errorHandler);

module.exports = app;
