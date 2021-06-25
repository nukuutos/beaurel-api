const express = require('express');

const controller = require('../../controllers/profile/favorite');

const validator = require('../../validator/profile/favorite');

const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

// @route     Get /api/v1/profile/:profileId/favorite
// @desc      Get favorite masters
// @access    Private
router.get('/', auth, validator.getFavorites, validate, controller.getFavorites);

// @route     Delete /api/v1/profile/:profileId/favorite/:masterId
// @desc      Delete master from favorites
// @access    Private
router.delete('/:masterId', auth, validator.deleteFavorite, validate, controller.deleteFavorite);

// @route     Put /api/v1/profile/:profileId/favorite/:masterId
// @desc      Add master to favorites
// @access    Private
router.put('/:masterId', auth, validator.addFavorite, validate, controller.addFavorite);

module.exports = router;
