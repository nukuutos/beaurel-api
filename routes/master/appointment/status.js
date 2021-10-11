const express = require("express");

const controller = require("../../../controllers/master/appointment/status");

const validator = require("../../../validator/master/appointment/status");

const auth = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const isYourself = require("../../../middleware/is-yourself");
const master = require("../../../middleware/master");

const router = express.Router({ mergeParams: true });

// @route     Put /api/master/:masterId/appointment/:appointmentId/status/master
// @desc      Update appointment status by master
// @access    Private(master)
router.put(
  "/master",
  auth,
  master,
  validator.updateStatusByMaster,
  validate,
  isYourself,
  controller.updateStatusByMaster
);

// @route     Put /api/master/:masterId/appointment/:appointmentId/status/customer
// @desc      Update appointment status by customer
// @access    Private
router.put(
  "/customer",
  auth,
  master,
  validator.updateStatusByCustomer,
  validate,
  controller.updateStatusByCustomer
);

module.exports = router;
