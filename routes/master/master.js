const express = require('express');

const controller = require('../../controllers/master/master');

const validator = require('../../validator/master/master');

const validate = require('../../middleware/validate');

const serviceRouter = require('./service');
const serviceParameterRouter = require('./service-parameter');
const timetableRouter = require('./timetable');
const workRouter = require('./work');
const appointmentRouter = require('./appointment/appointment');
const auth = require('../../middleware/auth');
const master = require('../../middleware/master');
const isYourself = require('../../middleware/is-yourself');
const getCleanCache = require('../../middleware/get-clean-cache');
const { CITY, MASTER_ID } = require('../../config/cache');

const router = express.Router();

const cleanCache = getCleanCache(MASTER_ID, CITY);

router.use('/:masterId/service', serviceRouter);
router.use('/:masterId/service-parameter', serviceParameterRouter);
router.use('/:masterId/timetable', timetableRouter);
router.use('/:masterId/work', workRouter);
router.use('/:masterId/appointment', appointmentRouter);

// @route     Get /api/v1/master
// @desc      Get masters by query
// @access    Public
router.get('/', validator.getMastersByQuery, validate, controller.getMasters);

// @route     Get /api/v1/master/:masterId/place-of-work
// @desc      Get masters by query
// @access    private
router.put(
  '/:masterId/place-of-work',
  auth,
  master,
  validator.updatePlaceOfWork,
  validate,
  isYourself,
  cleanCache,
  controller.updatePlaceOfWork
);

module.exports = router;
