const express = require('express');

const controller = require('../../controllers/profile/favorite');

const validator = require('../../validator/profile/favorite');

const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const isYourself = require('../../middleware/is-yourself');
const getCleanCache = require('../../middleware/get-clean-cache');

const { PROFILE_ID, FAVORITES } = require('../../config/cache');

const router = express.Router({ mergeParams: true });
const cleanCache = getCleanCache(PROFILE_ID, FAVORITES);

// @route     Get /api/v1/profile/:profileId/favorite
// @desc      Get favorite masters
// @access    Private
router.get('/', auth, validator.getFavorites, validate, isYourself, controller.getFavorites);

// @route     Delete /api/v1/profile/:profileId/favorite/:masterId
// @desc      Delete master from favorites
// @access    Private
router.delete(
  '/:masterId',
  auth,
  validator.deleteFavorite,
  validate,
  isYourself,
  cleanCache,
  controller.deleteFavorite
);

// @route     Post /api/v1/profile/:profileId/favorite/:masterId
// @desc      Add master to favorites
// @access    Private
router.post(
  '/:masterId',
  auth,
  validator.addFavorite,
  validate,
  isYourself,
  cleanCache,
  controller.addFavorite
);

module.exports = router;
