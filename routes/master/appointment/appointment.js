const express = require('express');

const reviewRouter = require('./review');
const statusRouter = require('./status');

const controller = require('../../../controllers/master/appointment/appointment');

const validator = require('../../../validator/master/appointment/appointment');

const validate = require('../../../middleware/validate');
const auth = require('../../../middleware/auth');
const getCleanCache = require('../../../middleware/get-clean-cache');

const { TIMETABLE_AND_APPOINTMENTS, MASTER_ID } = require('../../../config/cache');

const router = express.Router({ mergeParams: true });
const cleanCache = getCleanCache(MASTER_ID, TIMETABLE_AND_APPOINTMENTS);

router.use('/:appointmentId/review', reviewRouter);
router.use('/:appointmentId/status', statusRouter);

// @route     post /api/master/:masterId/appointment
// @desc      Book an appointment
// @access    Private
router.post('/', auth, validator.bookAppointment, validate, cleanCache, controller.bookAppointment);

// @route     put /api/master/:masterId/appointment/:appointmentId/unsuitable
// @desc      Update an unsuitable appointment
// @access    Private
router.put(
  '/:appointmentId/viewed-state',
  auth,
  validator.updateViewedState,
  validate,
  controller.updateViewedState
);

// @route     put /api/master/:masterId/appointment/:appointmentId/unsuitable
// @desc      Update an unsuitable appointment
// @access    Private
router.put(
  '/:appointmentId/unsuitable',
  auth,
  validator.updateUnsuitableAppointment,
  validate,
  cleanCache,
  controller.updateUnsuitableAppointment
);

module.exports = router;
