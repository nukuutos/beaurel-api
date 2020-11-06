const { check } = require('express-validator');
const { paramId } = require('./utils/id');

const userId = paramId('userId', 'User Id');
const masterId = paramId('masterId', 'Master Id');
const aboutText = check('aboutText').isString().withMessage('About text is not text');
const specializationArray = check('specialization').not().isEmpty().withMessage('Specialization is required');
const specializationElements = check('specialization.*')
  .trim()
  .isAlpha()
  .withMessage('Specialization must be only strings');

exports.userId = [userId];
exports.updateProfile = [userId, aboutText];
exports.upgradeMaster = [userId, specializationArray, specializationElements];
exports.starMaster = [userId, masterId];
