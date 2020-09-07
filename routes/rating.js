const express = require('express');

const controller = require('../controllers/rating');

const validator = require('../validator/rating');

const auth = require('../middleware/auth');
const master = require('../middleware/master');
const validate = require('../middleware/validate');

const router = express.Router();

// @route     Post /api/v1/rating/
// @desc      Add rating to master by customer
// @access    Private
router.post('/', auth, validator.addRating, validate, controller.addRating);

// @route     Put /api/v1/rating/:ratingId
// @desc      Update rating
// @access    Private
router.put('/:ratingId', auth, validator.updateRating, validate, controller.updateRating);

// @route     Delete /api/v1/rating/:ratingId
// @desc      Delete rating
// @access    Private
router.delete('/:ratingId', auth, validator.ratingId, validate, controller.deleteRating);

// @route     Post /api/v1/rating/:ratingId/reply
// @desc      Add/update reply
// @access    Private
router.patch('/:ratingId/reply', auth, master, validator.upsertReply, validate, controller.upsertReply);

// @route     Post /api/v1/rating/:ratingId/reply
// @desc      delete reply
// @access    Private
router.delete('/:ratingId/reply', auth, master, validator.ratingId, validate, controller.deleteReply);

module.exports = router;
