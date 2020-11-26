const express = require('express');

const controller = require('../controllers/profile');

const validator = require('../validator/profile');

const validate = require('../middleware/validate');

const reviewRouter = require('./review');
const serviceRouter = require('./service');
const timetableRouter = require('./timetable');

const auth = require('../middleware/auth');
const isItYou = require('../middleware/is-it-you');

const router = express.Router();

// Re-route to the other resourse routers
router.use('/:masterId/review', reviewRouter);
router.use('/:masterId/service', serviceRouter);
router.use('/:masterId/timetable', timetableRouter);

// @route     Get /api/v1/profile/:masterId
// @desc      Get profile
// @access    Public
router.get('/:masterId', validator.getProfile, validate, controller.getProfile);

// @route     Get /api/v1/profile/:masterId
// @desc      Update profile
// @access    Private
router.patch('/:masterId', auth, isItYou, validator.updateProfile, validate, controller.updateProfile);

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
