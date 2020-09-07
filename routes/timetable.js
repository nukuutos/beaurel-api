const express = require('express');

const controller = require('../controllers/timetable');

const validator = require('../validator/timetable');

const master = require('../middleware/master');
const validate = require('../middleware/validate');

const router = express.Router();

// @route     Post /api/timetable/
// @desc      Create timetable
// @access    Private(master)
router.post('/', validator.createTimetable, validate, controller.createTimetable);

// @route     Patch /api/timetable/:timetableId
// @desc      Update timetable
// @access    Private(master)
router.put('/:timetableId', master, validator.updateTimetable, validate, controller.updateTimetable);

// @route     Patch /api/timetable/:timetableId/update
// @desc      Change timetable update
// @access    Private(master)
router.patch('/:timetableId/update', master, validator.updateTimetable, validate, controller.changeTimetableUpdate);

// @route     Delete /api/timetable/:timetableId/update
// @desc      Delete timetable update
// @access    Private(master)
router.delete(
  '/:timetableId/update',
  master,
  validator.deleteTimetableUpdate,
  validate,
  controller.deleteTimetableUpdate
);

module.exports = router;
