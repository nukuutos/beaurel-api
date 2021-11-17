const express = require('express');

const controller = require('../../controllers/master/work');

const validator = require('../../validator/master/work');

const auth = require('../../middleware/auth');
const master = require('../../middleware/master');
const validate = require('../../middleware/validate');
const isYourself = require('../../middleware/is-yourself');
const image = require('../../middleware/image');
const isFile = require('../../middleware/is-file');
const getCleanCache = require('../../middleware/get-clean-cache');

const { MASTER_ID, WORKS } = require('../../config/cache');

const router = express.Router({ mergeParams: true });
const cleanCache = getCleanCache(MASTER_ID, WORKS);

// @route     Get /api/v1/master/:masterId/work
// @desc      Get works
// @access    Public
router.get('/', validator.getWorks, validate, controller.getWorks);

// @route     Post /api/v1/master/:masterId/work
// @desc      Create work
// @access    Private(master)
router.post(
  '/',
  auth,
  master,
  image,
  validator.addWork,
  validate,
  isFile,
  isYourself,
  cleanCache,
  controller.addWork
);

// @route     Put /api/v1/master/:masterId/work/:workId
// @desc      Update work
// @access    Private(master)
router.put(
  '/:workId',
  auth,
  master,
  image,
  validator.updateWork,
  validate,
  isYourself,
  cleanCache,
  controller.updateWork
);

// @route     Delete /api/v1/master/:masterId/work/:workId
// @desc      Delete work
// @access    Private(master)
router.delete(
  '/:workId',
  auth,
  master,
  validator.deleteWork,
  validate,
  isYourself,
  cleanCache,
  controller.deleteWork
);

module.exports = router;
