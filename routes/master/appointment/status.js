const express = require('express');

const controller = require('../../../controllers/master/appointment/status');

const validator = require('../../../validator/master/appointment/status');

const auth = require('../../../middleware/auth');
const validate = require('../../../middleware/validate');

const router = express.Router({ mergeParams: true });

// @route     put /api/profile/:masterId/appointment/:appointmentId/status/master
// @desc      Update appointment status by master
// @access    Private
router.put('/master', auth, validator.updateStatusByMaster, validate, controller.updateStatusByMaster);

// @route     put /api/profile/:masterId/appointment/:appointmentId/status/customer // :customerId ?
// @desc      Update appointment status by customer
// @access    Private
router.put('/customer', auth, validator.updateStatusByCustomer, validate, controller.updateStatusByCustomer);

module.exports = router;
