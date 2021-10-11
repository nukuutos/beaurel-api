const express = require("express");

const controller = require("../../controllers/master/timetable");

const validator = require("../../validator/master/timetable");

const master = require("../../middleware/master");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const isYourself = require("../../middleware/is-yourself");

const router = express.Router({ mergeParams: true });

// @route     Post /api/master/:masterId/timetable/:timetableId/update
// @desc      Create Timetable Update
// @access    Private(master)
router.post(
  "/:timetableId/update",
  auth,
  master,
  validator.updateTimetable,
  validate,
  isYourself,
  controller.updateTimetable
);

// @route     Delete /api/master/:masterId/timetable/:timetableId/update
// @desc      Delete Timetable Update
// @access    Private(master)
router.delete(
  "/:timetableId/update",
  auth,
  master,
  validator.deleteTimetableUpdate,
  validate,
  isYourself,
  controller.deleteTimetableUpdate
);

// @route     Get /api/master/:masterId/timetable/booking
// @desc      Get timetable and appointmetns for booking time
// @access    Public
router.get(
  "/booking",
  validator.getTimetableAndAppointments,
  validate,
  controller.getTimetableAndAppointments
);

module.exports = router;
