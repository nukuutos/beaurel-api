const { query, paramId } = require("express-validator");

const { INVALID_CATEGORY } = require("../../config/errors/appointment");
const { PROFILE_ID } = require("../../config/id-names");

const profileId = paramId("profileId", PROFILE_ID);

const category = query("category")
  .custom((value) => {
    const categories = ["onConfirmation", "confirmed", "history", "unsuitable"];
    return categories.includes(value);
  })
  .withMessage(INVALID_CATEGORY);

exports.getMasterAppointments = [profileId, category];
