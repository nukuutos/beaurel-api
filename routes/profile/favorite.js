const express = require('express');

const controller = require('../../controllers/profile/favorite');

const validator = require('../../validator/profile');

const validate = require('../../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     Get /api/v1/profile/:profileId/favorite
// @desc      Get favorite masters
// @access    Private
router.get('/', validator.getMasters, validate, controller.getFavorites);

// @route     Delete /api/v1/profile/:profileId/favorite/:masterId
// @desc      Delete master from favorites
// @access    Private
router.delete('/:masterId', validator.deleteMaster, validate, controller.deleteFavorite);

// @route     Put /api/v1/profile/:profileId/favorite/:masterId
// @desc      Add master to favorites
// @access    Private
router.put('/:masterId', validator.addMaster, validate, controller.addFavorite);

module.exports = router;
