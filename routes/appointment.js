const express = require('express');

const controller = require('../controllers/appointment');

const validator = require('../validator/appointment');

const master = require('../middleware/master');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

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

// @route     put /api/profile/:masterId/appointment/:appointmentId/status/master
// @desc      Update appointment status by master
// @access    Private
router.put('/:appointmentId/status/master', auth, validator.appointmentId, validate, controller.updateStatusByMaster); // check status in the body

// @route     put /api/profile/:masterId/appointment/:appointmentId/status/customer
// @desc      Update appointment status by customer
// @access    Private
router.put(
  '/:appointmentId/status/customer',
  auth,
  validator.appointmentId,
  validate,
  controller.updateStatusByCustomer
); // check status in the body

module.exports = router;
