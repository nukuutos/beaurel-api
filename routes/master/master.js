const express = require("express");

const controller = require("../../controllers/master/master");

const validator = require("../../validator/master/master");

const validate = require("../../middleware/validate");

const serviceRouter = require("./service/service");
const serviceParameterRouter = require("./service/service-parameter");
const timetableRouter = require("./timetable");
const workRouter = require("./work");
const appointmentRouter = require("./appointment/appointment");
const auth = require("../../middleware/auth");

const router = express.Router();

// Re-route to the other resourse routers
router.use("/:masterId/service", serviceRouter);
router.use("/:masterId/service-parameter", serviceParameterRouter);
router.use("/:masterId/timetable", timetableRouter);
router.use("/:masterId/work", workRouter);
router.use("/:masterId/appointment", appointmentRouter);

// @route     Get /api/v1/master/:masterId
// @desc      Get master profile
// @access    Public
router.get("/:masterId/timezone", auth, validator.getMasterProfile, validate, controller.getMasterTimezone);

// @route     Get /api/v1/master/:masterId
// @desc      Get master master
// @access    Public
router.get("/:masterId", validator.getMasterProfile, validate, controller.getMasterProfile);

// @route     Get /api/v1/master
// @desc      Get masters by query
// @access    Public
router.get("/", validator.getMastersByQuery, controller.getMasters); // add validation for specialization

module.exports = router;
