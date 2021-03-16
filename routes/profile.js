const express = require('express');

const controller = require('../controllers/profile');

const validator = require('../validator/profile');

const validate = require('../middleware/validate');

const reviewRouter = require('./review');
const serviceRouter = require('./service');
const timetableRouter = require('./timetable');
const workRouter = require('./work');
const appointmentRouter = require('./appointment');

const auth = require('../middleware/auth');
const isItYou = require('../middleware/is-it-you');

const router = express.Router();

// Re-route to the other resourse routers
router.use('/:masterId/review', reviewRouter);
router.use('/:masterId/service', serviceRouter);
router.use('/:masterId/timetable', timetableRouter);
router.use('/:masterId/work', workRouter);
router.use('/:masterId/appointment', appointmentRouter);

// @route     Get /api/v1/profile
// @desc      Get masters by query
// @access    Public
router.get('/', validator.getMastersByQuery, controller.getMasters); // add validation for specia zation

// @route     Get /api/v1/profile/:masterId
// @desc      Get profile
// @access    Public
router.get('/:masterId', validator.getProfile, validate, controller.getProfile);

// @route     Get /api/v1/profile/:masterId
// @desc      Update profile
// @access    Private
router.patch('/:masterId', auth, validator.updateProfile, validate, controller.updateProfile);

// @route     Get /api/v1/profile/:masterId/avatar
// @desc      Update profile's avatar
// @access    Private
router.put('/:masterId/avatar', auth, validator.updateAvatar, validate, controller.updateAvatar);

// @route     Patch /api/v1/profile/:userId/master
// @desc      Upgrade profile to master
// @access    Private
// router.patch('/:userId/master', validator.upgradeMaster, validate, controller.upgradeMaster);

// another routes ?

// @route     Patch /api/v1/profile/:userId/master/:masterId
// @desc      Add master to favorites
// @access    Private
router.put('/:userId/master/:masterId', validator.addMaster, validate, controller.addMaster);

// @route     Patch /api/v1/profile/:userId/master/:masterId
// @desc      Delete master from favorites
// @access    Private
router.delete('/:userId/master/:masterId', validator.deleteMaster, validate, controller.deleteMaster);

// @route     Get /api/v1/profile/:userId/master/:masterId
// @desc      Get favorite and not favorite masters
// @access    Private
router.get('/:userId/master', validator.getMasters, validate, controller.getPrivateMasters);

// @route     Get /api/v1/profile/:userId/master/:masterId
// @desc      Get favorite masters
// @access    Private
router.get('/:userId/master/favorites', validator.getMasters, validate, controller.getFavoriteMasters);

module.exports = router;
