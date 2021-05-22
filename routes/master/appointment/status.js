const express = require('express');

const controller = require('../../../controllers/master/appointment/status');

const validator = require('../../../validator/appointment/appointment');

const auth = require('../../../middleware/auth');
const validate = require('../../../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     put /api/profile/:masterId/appointment/:appointmentId/status/master
// @desc      Update appointment status by master
// @access    Private
router.put('/master', auth, validator.appointmentId, validate, controller.updateStatusByMaster); // check status in the body

// @route     put /api/profile/:masterId/appointment/:appointmentId/status/customer
// @desc      Update appointment status by customer
// @access    Private
router.put('/customer', auth, validator.appointmentId, validate, controller.updateStatusByCustomer); // check status in the body

module.exports = router;
