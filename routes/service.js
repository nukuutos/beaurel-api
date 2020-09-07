const express = require('express');

const controller = require('../controllers/service');

const validator = require('../validator/service');

const validate = require('../middleware/validate');

const router = express.Router();

// @route     Post /api/service
// @desc      Add service
// @access    Private(master)
router.post('/', validator.addService, validate, controller.addService);

// @route     Put /api/service/:serviceId
// @desc      Add update to service
// @access    Private(master)
router.put('/:serviceId', validator.updateService, validate, controller.updateService);

// @route     Delete /api/service/:serviceId
// @desc      Delete service
// @access    Private(master)
router.delete('/:serviceId', validator.deleteService, validate, controller.deleteService);

// Change update and cancel update

module.exports = router;
