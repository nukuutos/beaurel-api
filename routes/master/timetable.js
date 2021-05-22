const express = require('express');

const controller = require('../../controllers/master/timetable/timetable');

const validator = require('../../validator/timetable');

const master = require('../../middleware/master');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     Get /api/profile/:masterId/timetable/
// @desc      Get timetable
// @access    Public
router.get('/', validator.getTimetable, controller.getTimetable);

// @route     Post /api/profile/:masterId/timetable/
// @desc      Create timetable
// @access    Private(master)
// router.post('/', validator.createTimetable, validate, controller.createTimetable);

// @route     POST /api/profile/:masterId/timetable/:timetableId/update
// @desc      Create Timetable Update
// @access    Private(master)
router.post('/:timetableId/update', auth, master, validator.updateTimetable, validate, controller.updateTimetable);

// @route     Delete /api/profile/:masterId/timetable/:timetableId/update
// @desc      Delete Timetable Update
// @access    Private(master)
router.delete(
  '/:timetableId/update',
  auth,
  master,
  validator.deleteTimetableUpdate,
  validate,
  controller.deleteTimetableUpdate
);

// @route     POST /api/profile/:masterId/timetable/:timetableId/update
// @desc      Create Timetable Update
// @access    Private(master)
// router.delete('/:timetableId/update', master, controller.deleteTimetableUpdate);

// @route     Patch /api/profile/:masterId/timetable/:timetableId/update
// @desc      Change timetable update
// @access    Private(master)
// router.patch('/:timetableId/update', master, validator.updateTimetable, validate, controller.changeTimetableUpdate);

// @route     Delete /api/profile/:masterId/timetable/:timetableId/update
// @desc      Delete timetable update
// @access    Private(master)
// router.delete(
//   '/:timetableId/update',
//   master,
//   validator.deleteTimetableUpdate,
//   validate,
//   controller.deleteTimetableUpdate
// );

// /:masterId/booking ? route
// @route     GET /api/profile/:masterId/timetable/booking
// @desc      Get timetable and appointmetns for booking time
// @access    Public
router.get('/booking', validator.getTimetableAndAppointments, validate, controller.getTimetableAndAppointments);

module.exports = router;
