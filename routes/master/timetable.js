const express = require('express');

const controller = require('../../controllers/master/timetable');

const validator = require('../../validator/master/timetable');

const master = require('../../middleware/master');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const isYourself = require('../../middleware/is-yourself');
const getCleanCache = require('../../middleware/get-clean-cache');

const {
  MASTER_ID,
  UNSUITABLE_SERVICES,
  BOOKED_APPOINTMENTS,
  SERVICES_AND_TIMETABLE,
} = require('../../config/cache');

const router = express.Router({ mergeParams: true });

const cleanCacheServicesAndTimetable = getCleanCache(MASTER_ID, SERVICES_AND_TIMETABLE);
const cleanCacheUnsuitableServices = getCleanCache(MASTER_ID, UNSUITABLE_SERVICES);
const cleanCacheAppointmentsAndTimetable = getCleanCache(MASTER_ID, BOOKED_APPOINTMENTS);

// @route     Post /api/master/:masterId/timetable/:timetableId/update
// @desc      Create Timetable Update
// @access    Private(master)
router.post(
  '/',
  auth,
  master,
  validator.createTimetable,
  validate,
  isYourself,
  controller.createTimetable
);

// @route     Post /api/master/:masterId/timetable/:timetableId/update
// @desc      Create Timetable Update
// @access    Private(master)
router.post(
  '/:timetableId/update',
  auth,
  master,
  validator.updateTimetable,
  validate,
  isYourself,
  cleanCacheServicesAndTimetable,
  cleanCacheUnsuitableServices,
  cleanCacheAppointmentsAndTimetable,
  controller.updateTimetable
);

// @route     Delete /api/master/:masterId/timetable/:timetableId/update
// @desc      Delete Timetable Update
// @access    Private(master)
router.delete(
  '/:timetableId/update',
  auth,
  master,
  validator.deleteTimetableUpdate,
  validate,
  isYourself,
  cleanCacheServicesAndTimetable,
  cleanCacheUnsuitableServices,
  cleanCacheAppointmentsAndTimetable,
  controller.deleteTimetableUpdate
);

// @route     Get /api/master/:masterId/timetable/booking
// @desc      Get timetable and appointments for booking time
// @access    Public
router.get(
  '/booking',
  validator.getTimetableAndAppointments,
  validate,
  controller.getTimetableAndAppointments
);

module.exports = router;
