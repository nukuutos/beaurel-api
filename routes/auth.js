const express = require('express');

const controller = require('../controllers/auth');

const validator = require('../validator/auth');

const validate = require('../middleware/validate');

const router = express.Router();

// @route     Post /api/v1/auth/sign-up
// @desc      Sign up user
// @access    Public
router.post('/sign-up', validator.signUp, validate, controller.signUp);

// @route     Post /api/v1/auth/sign-up/confirmation
// @desc      Confirm account
// @access    Public
router.post('/sign-up/confirmation', validator.confirmAccount, validate, controller.confirmAccount);

// @route     Post /api/v1/auth/sign-up/code
// @desc      Resend verification code
// @access    Public
router.post(
  '/sign-up/code',
  validator.resendVerificationCode,
  validate,
  controller.resendVerificationCode
);

// @route     Post /api/v1/auth/sign-in
// @desc      Sign in user
// @access    Public
router.post('/sign-in', validator.signIn, validate, controller.signIn);

// @route     Post /api/v1/auth/refresh-token
// @desc      Refresh user token
// @access    Public
router.post('/refresh-token', validator.refreshToken, validate, controller.refreshToken);

module.exports = router;
