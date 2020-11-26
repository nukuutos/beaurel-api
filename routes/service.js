const express = require('express');

const controller = require('../controllers/service');

const validator = require('../validator/service');

const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const serviceParameterRoute = require('../routes/service-parameter');

const router = express.Router({ mergeParams: true });

router.use('/parameter', serviceParameterRoute);

// @route     Get /api/profile/:masterId/service
// @desc      Get services
// @access    Public
router.get('/', validator.getServices, validate, controller.getServices);

// @route     Post /api/profile/:masterId/service
// @desc      Add service
// @access    Private(master)
router.post('/', auth, validator.addService, validate, controller.addService);

// @route     Put /api/profile/:masterId/service/:serviceId
// @desc      Add update to service, :serviceId can be an id (ordinary service or sub parameters) or title (group of service parameters)
// @desc      Send whole service or title of service parameter or sub-service
// @access    Private(master)
router.put('/:serviceId', validator.updateService, validate, controller.updateService);

// @route     Delete /api/profile/:masterId/service/:serviceId
// @desc      Delete service, :serviceId can be an id (ordinary service or sub parameters) or title (group of service parameters)
// @access    Private(master)
router.delete('/:serviceId', validator.deleteService, validate, controller.deleteService);

// @route     Put /api/profile/:masterId/service/order
// @desc      Update services' order
// @access    Private(master)
router.patch('/order', validator.updateService, validate, controller.updateServicesOrder);

module.exports = router;
