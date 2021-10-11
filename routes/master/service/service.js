const express = require("express");

const controller = require("../../../controllers/master/service/service");

const validator = require("../../../validator/master/service");

const validate = require("../../../middleware/validate");
const auth = require("../../../middleware/auth");
const master = require("../../../middleware/master");
const isYourself = require("../../../middleware/is-yourself");

const router = express.Router({ mergeParams: true });

// @route     Get /api/master/:masterId/service
// @desc      Get services(service and service-parameter too)
// @access    Public
router.get("/", validator.getServices, validate, controller.getServices);

// @route     Post /api/master/:masterId/service
// @desc      Add service
// @access    Private(master)
router.post("/", auth, master, validator.addService, validate, isYourself, controller.addService);

// @route     Patch /api/master/:masterId/service/order
// @desc      Update order of services
// @access    Private(master)
router.patch(
  "/order",
  auth,
  master,
  validator.updateServicesOrder,
  validate,
  isYourself,
  controller.updateServicesOrder
);

// @route     Get /api/master/:masterId/service/update
// @desc      Get services that needing update
// @access    Private(master)
router.get(
  "/update",
  auth,
  master,
  validator.getUnsuitableServices,
  validate,
  isYourself,
  controller.getUnsuitableServices
);

// @route     Put /api/master/:masterId/service/update
// @desc      Put update to services
// @access    Private(master)
router.put(
  "/update",
  auth,
  master,
  validator.putUpdateToServices,
  validate,
  isYourself,
  controller.putUpdateToServices
);

// @route     Put /api/master/:masterId/service/:serviceId
// @desc      Update service
// @access    Private(master)
router.put(
  "/:serviceId",
  auth,
  master,
  validator.updateService,
  validate,
  isYourself,
  controller.updateService
);

// @route     Delete /api/master/:masterId/service/:serviceId
// @desc      Delete service
// @access    Private(master)
router.delete(
  "/:serviceId",
  auth,
  master,
  validator.deleteService,
  validate,
  isYourself,
  controller.deleteService
);

module.exports = router;
