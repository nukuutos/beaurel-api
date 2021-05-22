const express = require('express');

const favoriteRouter = require('./favorite');

const controller = require('../../controllers/profile/profile');

const validator = require('../../validator/profile');

const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');

const router = express.Router();

router.use('/:profileId/favorite', favoriteRouter);

// @route     Get /api/v1/profile/:masterId
// @desc      Update profile
// @access    Private
router.patch('/:profileId', auth, validator.updateProfile, validate, controller.updateProfile);

// @route     Get /api/v1/profile/:profileId/avatar
// @desc      Update profile's avatar
// @access    Private
router.put('/:profileId/avatar', auth, validator.updateAvatar, validate, controller.updateAvatar);

// @route     Patch /api/v1/profile/:userId/master
// @desc      Upgrade profile to master
// @access    Private
// router.patch('/:userId/master', validator.upgradeMaster, validate, controller.upgradeMaster);

module.exports = router;
