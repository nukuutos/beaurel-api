const express = require("express");

const reviewRouter = require("./review");
const statusRouter = require("./status");

const controller = require("../../../controllers/master/appointment/appointment");

const validator = require("../../../validator/master/appointment/appointment");

const validate = require("../../../middleware/validate");
const auth = require("../../../middleware/auth");

const router = express.Router({ mergeParams: true });

router.use("/:appointmentId/review", reviewRouter);
router.use("/:appointmentId/status", statusRouter);

// @route     post /api/master/:masterId/appointment
// @desc      Book an appointment
// @access    Private
router.post("/", auth, validator.bookAppointment, validate, controller.bookAppointment);

module.exports = router;
