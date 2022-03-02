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
const { runCronJobs } = require('./cron/cron');

const app = express();

runCronJobs();

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

app.use(errorHandler);

module.exports = app;
