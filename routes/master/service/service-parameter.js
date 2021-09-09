const express = require("express");

const controller = require("../../../controllers/master/service/service-parameter");

const validator = require("../../../validator/master/service-parameter");

const validate = require("../../../middleware/validate");
const auth = require("../../../middleware/auth");

const router = express.Router({ mergeParams: true });

// @route     Post /api/profile/:masterId/service/parameter
// @desc      Add service-parameter (service with sub-services)
// @access    Private(master)
router.post("/", auth, validator.addServiceParameter, validate, controller.addServiceParameter);

// @route     Post /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Add service-parameter
// @access    Private(master)
router.post("/:serviceTitle", auth, validator.addSubService, validate, controller.addSubService);

// @route     Delete /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Delete service-parameter
// @access    Private(master)
router.delete("/:serviceTitle", auth, validator.deleteServiceParameter, validate, controller.deleteServiceParameter);

// @route     Put /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Update service-parameter(title)
// @access    Private(master)
router.put("/:serviceTitle", auth, validator.updateServiceParameter, validate, controller.updateServiceParameter);

// @route     Delete /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Delete sub-service
// @access    Private(master)
router.delete(
  "/:serviceTitle/sub-service/:subServiceId",
  auth,
  validator.deleteSubService,
  validate,
  controller.deleteSubService
);

// @route     Put /api/profile/:masterId/service/parameter/:serviceTitle/sub-service/:subServiceId
// @desc      Update sub-service
// @access    Private(master)
router.put(
  "/:serviceTitle/sub-service/:subServiceId",
  auth,
  validator.updateSubService,
  validate,
  controller.updateSubService
);

module.exports = router;
