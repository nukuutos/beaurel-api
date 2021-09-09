const express = require("express");

const controller = require("../../controllers/profile/appointment");

const validator = require("../../validator/profile/appointment");

const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");

const router = express.Router({ mergeParams: true });

// @route     get /api/profile/:profileId/appointment/master?category=category
// @desc      get appointments for master with specific type
// @access    Private
router.get("/master", auth, validator.getMasterAppointments, validate, controller.getMasterAppointments);

// @route     get /api/profile/:profileId/appointment/customer?category=category
// @desc      get appointments for customer with specific type
// @access    Private
router.get("/customer", auth, validator.getMasterAppointments, validate, controller.getCustomerAppointments);

module.exports = router;
