const express = require('express');

const controller = require('../controllers/auth/auth');

const validator = require('../validator/auth');

const validate = require('../middleware/validate');

const router = express.Router();

// @route     Post /api/v1/auth/sign-up
// @desc      Sign up user
// @access    Public
router.post('/sign-up', validator.signUp, validate, controller.signUp);

// @route     Post /api/v1/auth/sign-in
// @desc      Sign in user
// @access    Public
router.post('/sign-in', validator.signIn, validate, controller.signIn);

// @route     Post /api/v1/auth/refresh-token
// @desc      Refresh user token
// @access    Public
router.post('/refresh-token', controller.refreshToken);

// @route     Post /api/v1/auth/forgot-password
// @desc      Recover password
// @access    Public
router.post('/forgot-password', validator.forgotPassword, validate, controller.forgotPassword);

// @route     Patch /api/v1/auth/reset-password/:resettoken
// @desc      Set new password with reset token
// @access    Public
router.patch('/reset-password/:resetToken', controller.resetPassword);

module.exports = router;
