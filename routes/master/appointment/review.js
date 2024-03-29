const express = require('express');

const controller = require('../../../controllers/master/appointment/review');

const validator = require('../../../validator/master/appointment/review');

const auth = require('../../../middleware/auth');
const validate = require('../../../middleware/validate');
const getCleanCache = require('../../../middleware/get-clean-cache');

const { MASTER_ID, REVIEWS } = require('../../../config/cache');

const router = express.Router({ mergeParams: true });
const cleanCache = getCleanCache(MASTER_ID, REVIEWS);

// @route     Post /api/master/:masterId/appointment/:appointmentId/review
// @desc      Add review to appointment
// @access    Private
router.post('/', auth, validator.addReview, validate, cleanCache, controller.addReview);

// @route     Put /api/master/:masterId/appointment/:appointmentId/review
// @desc      Update review of appointment
// @access    Private
router.put('/', auth, validator.updateReview, validate, cleanCache, controller.updateReview);

module.exports = router;
