const { body, paramId } = require("express-validator");
const { ABOUT_TEXT_LENGTH, INVALID_ABOUT_TEXT } = require("../../config/errors/profile");
const { PROFILE_ID } = require("../../config/id-names");

const profileId = paramId("profileId", PROFILE_ID);

const updateFields = body("*").expectedFields(["aboutText"]);

const aboutText = body("aboutText")
  .matches(/^[а-яa-z -,.!?():;0-9]+$/i)
  .withMessage(INVALID_ABOUT_TEXT)
  .trim()
  .isLength({ min: 0, max: 150 })
  .withMessage(ABOUT_TEXT_LENGTH);

exports.updateAvatar = [profileId];
exports.updateProfile = [profileId, updateFields, aboutText];
