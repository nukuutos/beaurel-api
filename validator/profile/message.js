const { paramId, body, query } = require('express-validator');
const { NO_PAGE, INVALID_PAGE } = require('../../config/errors/master');
const { INVALID_MESSAGE } = require('../../config/errors/message');
const { PROFILE_ID, RECIPIENT_ID, INTERLOCUTOR_ID } = require('../../config/id-names');

const recipientId = paramId('recipientId', RECIPIENT_ID);
const profileId = paramId('profileId', PROFILE_ID);
const interlocutorId = paramId('interlocutorId', INTERLOCUTOR_ID);
const message = body('message').exists({ checkFalsy: true }).withMessage(INVALID_MESSAGE);
const page = query('page')
  .exists({ checkNull: true })
  .withMessage(NO_PAGE)
  .isInt({ min: 0 })
  .withMessage(INVALID_PAGE)
  .customSanitizer((value) => +value);

exports.getMessages = [profileId];
exports.addMessage = [profileId, recipientId, message];
exports.getDialog = [profileId, interlocutorId, page];
exports.setMessagesViewed = [profileId, interlocutorId];
