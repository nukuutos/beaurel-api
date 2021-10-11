const express = require("express");

const controller = require("../../../controllers/master/service/service-parameter");

const validator = require("../../../validator/master/service-parameter");

const validate = require("../../../middleware/validate");
const auth = require("../../../middleware/auth");
const master = require("../../../middleware/master");
const isYourself = require("../../../middleware/is-yourself");

const router = express.Router({ mergeParams: true });

// @route     Post /api/profile/:masterId/service-parameter
// @desc      Add service-parameter
// @access    Private(master)
router.post(
  "/",
  auth,
  master,
  validator.addServiceParameter,
  validate,
  isYourself,
  controller.addServiceParameter
);

// @route     Delete /api/profile/:masterId/service-parameter/:serviceTitle
// @desc      Delete service-parameter
// @access    Private(master)
router.delete(
  "/:serviceTitle",
  auth,
  master,
  validator.deleteServiceParameter,
  validate,
  isYourself,
  controller.deleteServiceParameter
);

// @route     Put /api/profile/:masterId/service-parameter/:serviceTitle
// @desc      Update service-parameter title
// @access    Private(master)
router.put(
  "/:serviceTitle",
  auth,
  master,
  validator.updateServiceParameter,
  validate,
  isYourself,
  controller.updateServiceParameter
);

// @route     Delete /api/profile/:masterId/service-parameter/:serviceTitle
// @desc      Delete sub-service
// @access    Private(master)
router.delete(
  "/:serviceTitle/sub-service/:subServiceId",
  auth,
  master,
  validator.deleteSubService,
  validate,
  isYourself,
  controller.deleteSubService
);

// @route     Put /api/profile/:masterId/service-parameter/:serviceTitle/sub-service/:subServiceId
// @desc      Update sub-service
// @access    Private(master)
router.put(
  "/:serviceTitle/sub-service/:subServiceId",
  auth,
  master,
  validator.updateSubService,
  validate,
  isYourself,
  controller.updateSubService
);

module.exports = router;
