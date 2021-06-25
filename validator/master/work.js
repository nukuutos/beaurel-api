const { check } = require('express-validator');
const { paramId } = require('../utils/id');

const workId = paramId('workId', 'Work Id');
const masterId = paramId('masterId', 'Master Id');

const title = check('title')
  .exists({ checkFalsy: true })
  .withMessage('Title is required.')
  .isString()
  .withMessage('Title must be a string.');

exports.getWorks = [masterId];
exports.addWork = [masterId, title];
exports.updateWork = [masterId, workId, title];
exports.deleteWork = [masterId, workId];
