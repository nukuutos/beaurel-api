const express = require("express");

const controller = require("../controllers/timezone");

const validator = require("../validator/timezone");

const validate = require("../middleware/validate");

const router = express.Router();

// @route     Get /api/v1/timezone?lat&lng
// @desc      Get Timezone by latitude and longitude
// @access    Public
router.get("/", validator.getTimezone, validate, controller.getTimezone);

// @route     Get /api/v1/timezone/city?city&page
// @desc      Get Timezone by city
// @access    Public
router.get("/city", validator.getTimezoneByQuery, validate, controller.getTimezoneByQuery);

module.exports = router;
