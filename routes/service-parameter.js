const express = require('express');

const controller = require('../controllers/service-parameter');

const validator = require('../validator/service-parameter');

const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// @route     Post /api/profile/:masterId/service/parameter
// @desc      Add service-parameter (service with sub-services)
// @access    Private(master)
router.post('/', auth, validator.addServiceParameter, validate, controller.addServiceParameter);

// @route     Delete /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Delete service-parameter
// @access    Private(master)
router.post('/:serviceTitle', validator.addSubService, validate, controller.addSubService);

// @route     Delete /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Delete service-parameter
// @access    Private(master)
router.delete('/:serviceTitle', validator.deleteServiceParameter, validate, controller.deleteServiceParameter);

// @route     Put /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Update service-parameter(title)
// @access    Private(master)
router.put('/:serviceTitle', validator.updateServiceParameter, validate, controller.updateServiceParameter);

// @route     Delete /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Delete sub-service
// @access    Private(master)
router.delete(
  '/:serviceTitle/sub-service/:subServiceId',
  validator.deleteSubService,
  validate,
  controller.deleteSubService
);

// @route     Put /api/profile/:masterId/service/parameter/:serviceTitle/sub-service/:subServiceId
// @desc      Update sub-service
// @access    Private(master)
router.put(
  '/:serviceTitle/sub-service/:subServiceId',
  validator.updateSubService,
  validate,
  controller.updateSubService
);

// @route     Post /api/profile/:masterId/service/parameter/:serviceTitle
// @desc      Add sub-service
// @access    Private(master)
router.post('/:serviceTitle', validator.addSubService, validate, controller.addSubService);

module.exports = router;
