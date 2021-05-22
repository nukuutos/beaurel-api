const express = require('express');

const controller = require('../../controllers/master/master');

const validator = require('../../validator/profile');

const validate = require('../../middleware/validate');

const serviceRouter = require('./service/service');
const timetableRouter = require('./timetable');
const workRouter = require('./work');
const appointmentRouter = require('./appointment/appointment');

const router = express.Router();

// Re-route to the other resourse routers
router.use('/:masterId/service', serviceRouter);
router.use('/:masterId/service-parameter', serviceRouter);
router.use('/:masterId/timetable', timetableRouter);
router.use('/:masterId/work', workRouter);
router.use('/:masterId/appointment', appointmentRouter);

// @route     Get /api/v1/profile/:masterId
// @desc      Get master profile
// @access    Public
router.get('/:masterId', validator.getProfile, validate, controller.getMasterProfile);

// @route     Get /api/v1/profile
// @desc      Get masters by query
// @access    Public
router.get('/', validator.getMastersByQuery, controller.getMasters); // add validation for specialization

module.exports = router;
