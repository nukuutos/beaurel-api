const express = require('express');

const controller = require('../../../controllers/master/service/service');

const validator = require('../../../validator/service');

const validate = require('../../../middleware/validate');
const auth = require('../../../middleware/auth');

const router = express.Router({ mergeParams: true });

// @route     Get /api/profile/:masterId/service
// @desc      Get services(service and service-parameter too)
// @access    Public
router.get('/', validator.getServices, validate, controller.getServices);

// @route     Post /api/profile/:masterId/service
// @desc      Add service
// @access    Private(master)
router.post('/', auth, validator.addService, validate, controller.addService);

// @route     Patch /api/profile/:masterId/service/order
// @desc      Update services' order
// @access    Private(master)
router.patch('/order', validator.updateServicesOrder, validate, controller.updateServicesOrder);

// @route     Get /api/profile/:masterId/service/update
// @desc      Get services that needing update because timetable's update
// @access    Private(master)
router.get('/update', auth, controller.getUnsuitableServices);

// @route     Put /api/profile/:masterId/service/update
// @desc      Put update to services
// @access    Private(master)
router.put('/update', auth, controller.putUpdateToServices);

// @route     Put /api/profile/:masterId/service/:serviceId
// @desc      Add update to service, :serviceId can be an id (ordinary service or sub parameters) or title (group of service parameters)
// @desc      Send whole service or title of service parameter or sub-service
// @access    Private(master)
router.put('/:serviceId', validator.updateService, validate, controller.updateService);

// @route     Delete /api/profile/:masterId/service/:serviceId
// @desc      Delete service, :serviceId can be an id (ordinary service or sub parameters) or title (group of service parameters)
// @access    Private(master)
router.delete('/:serviceId', validator.deleteService, validate, controller.deleteService);

module.exports = router;
