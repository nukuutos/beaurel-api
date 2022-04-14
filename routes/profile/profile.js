const express = require('express');

const favoriteRouter = require('./favorite');
const appointmentRouter = require('./appointment');
const messageRouter = require('./message');

const controller = require('../../controllers/profile/profile');

const validator = require('../../validator/profile/profile');

const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const isYourself = require('../../middleware/is-yourself');
const image = require('../../middleware/image');
const isFile = require('../../middleware/is-file');

const router = express.Router();

router.use('/:profileId/favorite', favoriteRouter);
router.use('/:profileId/appointment', appointmentRouter);
router.use('/:profileId/message', messageRouter);

// @route     Get /api/v1/profile/:profileId
// @desc      Get customer data
// @access    Public
router.get('/:profileId', validator.getCustomerProfile, validate, controller.getCustomerProfile);

// @route     Patch /api/v1/profile/:profileId
// @desc      Update profile
// @access    Private
router.patch(
  '/:profileId',
  auth,
  validator.updateProfile,
  validate,
  isYourself,
  controller.updateProfile
);

// @route     Put /api/v1/profile/:profileId/username
// @desc      Update username
// @access    Private
router.put(
  '/:profileId/username',
  auth,
  validator.updateUsername,
  validate,
  isYourself,
  controller.updateUsername
);

// @route     Put /api/v1/profile/:profileId/avatar
// @desc      Update avatar
// @access    Private
router.put(
  '/:profileId/avatar',
  auth,
  validator.updateAvatar,
  validate,
  isYourself,
  image,
  isFile,
  controller.updateAvatar
);

// @route     Get /api/v1/profile/:profileId
// @desc      Update user status (when was user last time online)
// @access    Public
router.put(
  '/:profileId/online',
  auth,
  validator.updateOnlineStatus,
  validate,
  isYourself,
  controller.updateOnlineStatus
);

// @route     Get /api/v1/profile/:profileId
// @desc      Get online status
// @access    Private
router.get(
  '/:profileId/online',
  auth,
  validator.getOnlineStatus,
  validate,
  controller.getOnlineStatus
);

// @route     Put /api/v1/profile/:profileId/password
// @desc      Update user's password
// @access    Private
router.put(
  '/:profileId/password',
  auth,
  validator.updatePassword,
  validate,
  isYourself,
  controller.updatePassword
);
module.exports = router;
