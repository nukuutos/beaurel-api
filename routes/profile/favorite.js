const express = require("express");

const controller = require("../../controllers/profile/favorite");

const validator = require("../../validator/profile/favorite");

const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const isYourself = require("../../middleware/is-yourself");

const router = express.Router({ mergeParams: true });

// @route     Get /api/v1/profile/:profileId/favorite
// @desc      Get favorite masters
// @access    Private
router.get("/", auth, isYourself, validator.getFavorites, validate, controller.getFavorites);

// @route     Delete /api/v1/profile/:profileId/favorite/:masterId
// @desc      Delete master from favorites
// @access    Private
router.delete(
  "/:masterId",
  auth,
  validator.deleteFavorite,
  validate,
  isYourself,
  controller.deleteFavorite
);

// @route     Post /api/v1/profile/:profileId/favorite/:masterId
// @desc      Add master to favorites
// @access    Private
router.post(
  "/:masterId",
  auth,
  validator.addFavorite,
  validate,
  isYourself,
  controller.addFavorite
);

module.exports = router;
