const { check } = require('express-validator');
const { paramId } = require('../utils/id');

const masterId = paramId('masterId', 'Master Id');

// const specializationArray = check('specialization').not().isEmpty().withMessage('Specialization is required');
// const specializationElements = check('specialization.*')
//   .trim()
//   .isAlpha()
//   .withMessage('Specialization must be only strings');

const name = check('name')
  .trim()
  .customSanitizer((string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // $& means the whole matched string);

exports.getMastersByQuery = [name];
exports.getMasterProfile = [masterId];
