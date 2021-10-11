const express = require("express");

const controller = require("../../controllers/profile/appointment");

const validator = require("../../validator/profile/appointment");

const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const master = require("../../middleware/master");
const isYourself = require("../../middleware/is-yourself");

const router = express.Router({ mergeParams: true });

// @route     Get /api/profile/:profileId/appointment/master?category
// @desc      Get appointments for master with specific type
// @access    Private(master)
router.get(
  "/master",
  auth,
  master,
  validator.getMasterAppointments,
  validate,
  isYourself,
  controller.getMasterAppointments
);

// @route     Get /api/profile/:profileId/appointment/customer?category
// @desc      Get appointments for customer with specific type
// @access    Private
router.get(
  "/customer",
  auth,
  validator.getMasterAppointments,
  validate,
  isYourself,
  controller.getCustomerAppointments
);

module.exports = router;
