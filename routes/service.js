const express = require('express');

const controller = require('../controllers/service');

const validator = require('../validator/service');

const validate = require('../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     Get /api/profile/:userId/service
// @desc      Get services
// @access    Public
router.get('/', validator.getServices, validate, controller.getServices);

// @route     Post /api/profile/:userId/service
// @desc      Add service
// @access    Private(master)
router.post('/', validator.getServices, validate, controller.addService);

// @route     Put /api/profile/:userId/service/:service
// @desc      Add update to service, :service can be an id (ordinary service or sub parameters) or title (group of service parameters)
// @access    Private(master)
router.put('/:serviceId', validator.deleteService, validate, controller.updateService);

// @route     Delete /api/profile/:userId/service/:service
// @desc      Delete service, :service can be an id (ordinary service or sub parameters) or title (group of service parameters)
// @access    Private(master)
router.delete('/:serviceId', validator.deleteService, validate, controller.deleteService);

// Change update and cancel update

module.exports = router;
