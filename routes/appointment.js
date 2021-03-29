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

// @route     put /api/appointment/:appointmentId
// @desc      Update appointment
// @access    Private
// router.put('/:appointmentId', master, validator.updateAppointment, validate, controller.updateAppointment); // protect

// @route     put /api/profile/:masterId/appointment/:appointmentId/status
// @desc      Update appointment status
// @access    Private
router.put('/:appointmentId/status', auth, validator.appointmentId, validate, controller.updateStatus); // check status in the body

module.exports = router;
