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
const master = require("../../middleware/master");
const isYourself = require("../../middleware/is-yourself");

const router = express.Router();

router.use("/:masterId/service", serviceRouter);
router.use("/:masterId/service-parameter", serviceParameterRouter);
router.use("/:masterId/timetable", timetableRouter);
router.use("/:masterId/work", workRouter);
router.use("/:masterId/appointment", appointmentRouter);

// @route     Get /api/v1/master/:masterId/timezone
// @desc      Get master timezone
// @access    Private(master)
router.get(
  "/:masterId/timezone",
  auth,
  master,
  validator.getMasterTimezone,
  validate,
  isYourself,
  controller.getMasterTimezone
);

// @route     Get /api/v1/master
// @desc      Get masters by query
// @access    Public
router.get("/", validator.getMastersByQuery, validate, controller.getMasters);

module.exports = router;
