const express = require('express');

const controller = require('../controllers/timezone/timezone');

const validator = require('../validator/timezone');

const validate = require('../middleware/validate');

const router = express.Router();

// @route     Get /api/v1/timezone
// @desc      Get Timezone by latitude and longitude
// @access    Public
router.get('/', validator.getTimezone, validate, controller.getTimezone);

// @route     Get /api/v1/timezone/city
// @desc      Get Timezone by city
// @access    Public
router.get('/city', validator.getTimezoneByCity, validate, controller.getTimezoneByCity);

module.exports = router;
