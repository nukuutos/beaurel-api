const express = require('express');

const reviewRouter = require('./review');
const statusRouter = require('./status');

const controller = require('../../../controllers/master/appointment/appointment');

const validator = require('../../../validator/appointment/appointment');

const validate = require('../../../middleware/validate');
const auth = require('../../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use('/:appointmentId/review', reviewRouter);
router.use('/:appointmentId/status', statusRouter);

// @route     post /api/profile/:masterId/appointment
// @desc      Book an appointment
// @access    Private
router.post('/', auth, validator.bookAppointment, validate, controller.bookAppointment);

// @route     get /api/profile/:userId/appointment/master?category=category
// @desc      get appointments for master with specific type
// @access    Private
router.get('/master', auth, validator.getMasterAppointments, validate, controller.getMasterAppointments);

// @route     get /api/profile/:userId/appointment/customer?category=category
// @desc      get appointments for customer with specific type
// @access    Private
router.get('/customer', auth, validator.getMasterAppointments, validate, controller.getCustomerAppointments);

// @route     put /api/appointment/:appointmentId
// @desc      Update appointment
// @access    Private
// router.put('/:appointmentId', master, validator.updateAppointment, validate, controller.updateAppointment); // protect

module.exports = router;
