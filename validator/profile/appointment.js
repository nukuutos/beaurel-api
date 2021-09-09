const { query } = require("express-validator");

const { paramId } = require("../utils/id");
const HttpError = require("../../models/utils/http-error");

const profileId = paramId("profileId", "Profile Id");

const category = query("category").custom((value) => {
  const categories = ["onConfirmation", "confirmed", "history", "unsuitable"];
  if (!categories.includes(value)) throw new HttpError("Invalid category", 400);
  return true;
});

exports.getMasterAppointments = [profileId, category];
