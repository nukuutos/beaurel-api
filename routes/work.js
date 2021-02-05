const express = require('express');

const controller = require('../controllers/work');

const validator = require('../validator/work');

const auth = require('../middleware/auth');
const master = require('../middleware/master');
const validate = require('../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     Get /api/v1/profile/:masterId/work
// @desc      Delete work
// @access    Private
router.get('/', validator.getWorks, validate, controller.getWorks);

// @route     Post /api/v1/profile/:masterId/work
// @desc      Create work
// @access    Private
router.post('/', auth, master, validator.addWork, validate, controller.addWork);

// @route     Post /api/v1/profile/:masterId/work/:workId
// @desc      Update work
// @access    Private
router.put('/:workId', auth, master, validator.updateWork, validate, controller.updateWork);

// @route     Post /api/v1/profile/:masterId/work/:workId
// @desc      Delete work
// @access    Private
router.delete('/:workId', auth, master, validator.deleteWork, validate, controller.deleteWork);

module.exports = router;
