const express = require('express');

const controller = require('../../../controllers/master/appointment/review');

const validator = require('../../../validator/master/appointment/review');

const auth = require('../../../middleware/auth');
const validate = require('../../../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     post /api/profile/:masterId/appointment/:appointmentId/review
// @desc      Add review to appointment
// @access    Private
router.post('/', auth, validator.addReview, validate, controller.addReview);

// @route     put /api/profile/:masterId/appointment/:appointmentId/review
// @desc      Update review of appointment
// @access    Private
router.put('/', auth, validator.updateReview, validate, controller.updateReview);

module.exports = router;
