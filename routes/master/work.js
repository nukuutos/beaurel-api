const express = require("express");

const controller = require("../../controllers/master/work/work");

const validator = require("../../validator/master/work");

const auth = require("../../middleware/auth");
const master = require("../../middleware/master");
const validate = require("../../middleware/validate");
const isYourself = require("../../middleware/is-yourself");
const image = require("../../middleware/image");

const router = express.Router({ mergeParams: true });

// @route     Get /api/v1/master/:masterId/work
// @desc      Get works
// @access    Public
router.get("/", validator.getWorks, validate, controller.getWorks);

// @route     Post /api/v1/master/:masterId/work
// @desc      Create work
// @access    Private(master)
router.post("/", auth, master, validator.addWork, validate, isYourself, image, controller.addWork);

// @route     Put /api/v1/master/:masterId/work/:workId
// @desc      Update work
// @access    Private(master)
router.put(
  "/:workId",
  auth,
  master,
  validator.updateWork,
  validate,
  isYourself,
  image,
  controller.updateWork
);

// @route     Delete /api/v1/master/:masterId/work/:workId
// @desc      Delete work
// @access    Private(master)
router.delete(
  "/:workId",
  auth,
  master,
  validator.deleteWork,
  validate,
  isYourself,
  controller.deleteWork
);

module.exports = router;
