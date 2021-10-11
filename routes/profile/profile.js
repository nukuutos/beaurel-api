const express = require("express");

const favoriteRouter = require("./favorite");
const appointmentRouter = require("./appointment");

const controller = require("../../controllers/profile/profile");

const validator = require("../../validator/profile/profile");

const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const isYourself = require("../../middleware/is-yourself");
const image = require("../../middleware/image");

const router = express.Router();

router.use("/:profileId/favorite", favoriteRouter);
router.use("/:profileId/appointment", appointmentRouter);

// @route     Patch /api/v1/profile/:profileId
// @desc      Update profile
// @access    Private
router.patch(
  "/:profileId",
  auth,
  validator.updateProfile,
  validate,
  isYourself,
  controller.updateProfile
);

// @route     Put /api/v1/profile/:profileId/avatar
// @desc      Update avatar
// @access    Private
router.put(
  "/:profileId/avatar",
  auth,
  validator.updateAvatar,
  validate,
  isYourself,
  image,
  controller.updateAvatar
);

module.exports = router;
