const express = require('express');

const controller = require('../controllers/review');

const validator = require('../validator/review');

const auth = require('../middleware/auth');
const master = require('../middleware/master');
const validate = require('../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     Post /api/v1/profile/:userId/review/
// @desc      Get reviews
// @access    Public
router.get('/', validator.userId, controller.getReviews);

// @route     Post /api/v1/review/
// @desc      Add review to master by customer
// @access    Private
// router.post('/', auth, validator.addReview, validate, controller.addReview);

// @route     Put /api/v1/review/:reviewId
// @desc      Update review
// @access    Private
// router.put('/:reviewId', auth, validator.updateReview, validate, controller.updateReview);

// @route     Delete /api/v1/review/:reviewId
// @desc      Delete review
// @access    Private
// router.delete('/:reviewId', auth, validator.reviewId, validate, controller.deleteReview);

// @route     Post /api/v1/review/:reviewId/reply
// @desc      Add/update reply
// @access    Private
// router.patch('/:reviewId/reply', auth, master, validator.upsertReply, validate, controller.upsertReply);

// @route     Post /api/v1/review/:reviewId/reply
// @desc      delete reply
// @access    Private
// router.delete('/:reviewId/reply', auth, master, validator.reviewId, validate, controller.deleteReply);

module.exports = router;
