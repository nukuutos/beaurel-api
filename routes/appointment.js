const express = require('express');

const controller = require('../controllers/appointment');

const validator = require('../validator/appointment');

const master = require('../middleware/master');
const validate = require('../middleware/validate');

const router = express.Router();

// @route     post /api/appointment
// @desc      Book an appointment
// @access    Private
router.post('/', validator.bookAppointment, validate, controller.bookAppointment);

// @route     put /api/appointment/:appointmentId
// @desc      Update appointment
// @access    Private
router.put('/:appointmentId', master, validator.updateAppointment, validate, controller.updateAppointment); // protect

// @route     patch /api/appointment/:appointmentId/status
// @desc      Update appointment status
// @access    Private
router.patch('/:appointmentId/status', validator.appointmentId, validate, controller.updateStatus); // check status in the body

module.exports = router;
