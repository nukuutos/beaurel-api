const { check } = require("express-validator");
const { paramId } = require("../utils/id");

const profileId = paramId("profileId", "Profile Id");

// about, for everyone?
const aboutText = check("aboutText")
  .isString()
  .withMessage("About text is not string")
  .trim()
  .isLength({ min: 0, max: 150 })
  .withMessage(`Incorrect text length`);
// .exists({ checkFalsy: true }) // if this route will be only for about text
// .withMessage(`About text is required`)

// specializations, it's for master
// place of work, it's for master

exports.updateAvatar = [profileId];
exports.updateProfile = [profileId, aboutText];
