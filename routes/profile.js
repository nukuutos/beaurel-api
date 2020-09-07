const express = require('express');

const controller = require('../controllers/profile');

const validator = require('../validator/profile');

const validate = require('../middleware/validate');

const router = express.Router();

// @route     Get /api/v1/profile/:userId
// @desc      Get profile profile
// @access    Private
router.get('/:userId', validator.getProfile, controller.getProfile);

// @route     Patch /api/v1/profile/:userId/master
// @desc      Upgrade profile to master
// @access    Private
router.patch('/:userId/master', validator.upgradeMaster, validate, controller.upgradeMaster);

// @route     Patch /api/v1/profile/:userId/star-master/:masterId
// @desc      Star master
// @access    Private
router.patch('/:userId/star-master/:masterId', validator.starMaster, validate, controller.starMaster);

// @route     Patch /api/v1/profile/:userId/unstar-master/:masterId
// @desc      Unstar master
// @access    Private
router.patch('/:userId/unstar-master/:masterId', validator.starMaster, validate, controller.unstarMaster);

module.exports = router;
