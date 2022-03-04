const { paramId, query } = require('express-validator');
const { NO_PAGE, INVALID_PAGE } = require('../../config/errors/master');
const { MASTER_ID, PROFILE_ID } = require('../../config/id-names');

const masterId = paramId('masterId', MASTER_ID);
const profileId = paramId('profileId', PROFILE_ID);

const page = query('page')
  .exists({ checkNull: true })
  .withMessage(NO_PAGE)
  .isInt({ min: 0 })
  .withMessage(INVALID_PAGE)
  .customSanitizer((value) => +value);

exports.addFavorite = [profileId, masterId];
exports.deleteFavorite = [profileId, masterId];
exports.getFavorites = [profileId, page];
