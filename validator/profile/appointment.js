const { query, paramId } = require('express-validator');

const { INVALID_CATEGORY } = require('../../config/errors/appointment');
const { NO_PAGE, INVALID_PAGE } = require('../../config/errors/master');
const { PROFILE_ID } = require('../../config/id-names');

const profileId = paramId('profileId', PROFILE_ID);

const category = query('category')
  .custom((value) => {
    const categories = ['onConfirmation', 'confirmed', 'history', 'unsuitable'];
    return categories.includes(value);
  })
  .withMessage(INVALID_CATEGORY);

const page = query('page')
  .exists({ checkNull: true })
  .withMessage(NO_PAGE)
  .isInt({ min: 0 })
  .withMessage(INVALID_PAGE)
  .customSanitizer((value) => +value);

exports.getMasterAppointments = [profileId, category, page];
exports.getCustomerAppointments = [profileId, category, page];
