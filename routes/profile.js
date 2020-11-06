const express = require('express');

const controller = require('../controllers/profile');

const validator = require('../validator/profile');

const validate = require('../middleware/validate');

const reviewRouter = require('./review');
const auth = require('../middleware/auth');
const isItYou = require('../middleware/is-it-you');

const router = express.Router();

// Re-route to the other resourse routers
router.use('/:userId/review', reviewRouter);

// @route     Get /api/v1/profile/:userId
// @desc      Get profile
// @access    Public
router.get('/:userId', validator.userId, controller.getProfile);

// @route     Get /api/v1/profile/:userId
// @desc      Update profile
// @access    Private
router.patch('/:userId', auth, isItYou, validator.updateProfile, validate, controller.updateProfile);

// @route     Patch /api/v1/profile/:userId/master
// @desc      Upgrade profile to master
// @access    Private
// router.patch('/:userId/master', validator.upgradeMaster, validate, controller.upgradeMaster);

// @route     Patch /api/v1/profile/:userId/star-master/:masterId
// @desc      Star master
// @access    Private
// router.patch('/:userId/star-master/:masterId', validator.starMaster, validate, controller.starMaster);

// @route     Patch /api/v1/profile/:userId/unstar-master/:masterId
// @desc      Unstar master
// @access    Private
// router.patch('/:userId/unstar-master/:masterId', validator.starMaster, validate, controller.unstarMaster);

module.exports = router;
