const express = require('express');

const controller = require('../../controllers/profile/message');

const validator = require('../../validator/profile/message');

const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const isYourself = require('../../middleware/is-yourself');

const router = express.Router({ mergeParams: true });

// @route     Get /api/v1/profile/:profileId/message/:recipientId
// @desc      Get dialogs
// @access    Private
router.get('/', auth, validator.getDialogs, validate, isYourself, controller.getDialogs);

// @route     Post /api/v1/profile/:profileId/message/:recipientId
// @desc      Create message
// @access    Private
router.post(
  '/:recipientId',
  auth,
  validator.addMessage,
  validate,
  isYourself,
  controller.addMessage
);

// @route     Get /api/v1/profile/:profileId/message/:interlocutorId?page
// @desc      Get dialog
// @access    Private
router.get(
  '/:interlocutorId',
  auth,
  validator.getDialog,
  validate,
  isYourself,
  controller.getDialog
);

// @route     PUT /api/v1/profile/:profileId/message/:interlocutorId
// @desc      Set messages status to viewed
// @access    Private
router.put(
  '/:interlocutorId',
  auth,
  validator.setMessagesViewed,
  validate,
  isYourself,
  controller.setMessagesViewed
);

module.exports = router;
