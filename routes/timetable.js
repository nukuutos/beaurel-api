const express = require('express');

const controller = require('../controllers/timetable');

const validator = require('../validator/timetable');

const master = require('../middleware/master');
const validate = require('../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     Get /api/profile/:masterId/timetable/
// @desc      Get timetable
// @access    Public
router.get('/', validator.getTimetable, controller.getTimetable);

// @route     Post /api/profile/:masterId/timetable/
// @desc      Create timetable
// @access    Private(master)
// router.post('/', validator.createTimetable, validate, controller.createTimetable);

// @route     Patch /api/profile/:masterId/timetable/:timetableId
// @desc      Update timetable
// @access    Private(master)
router.put('/:timetableId', master, validator.updateTimetable, validate, controller.updateTimetable);

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

// @route     GET /api/profile/:masterId/timetable/appointment
// @desc      Get timetable and appointmetns for booking time
// @access    Public
router.get('/appointment', validator.getTimetableAndAppointments, validate, controller.getTimetableAndAppointments);

module.exports = router;
