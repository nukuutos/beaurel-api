const { paramId, query } = require("express-validator");
const { INVALID_PAGE, INVALID_SPECIALIZATION } = require("../../config/errors/master");
const { MASTER_ID } = require("../../config/id-names");
const specializations = require("../../config/specializations");

const masterId = paramId("masterId", MASTER_ID);

const specialization = query("specialization")
  .trim()
  .custom((value) => specializations.includes(value))
  .withMessage(INVALID_SPECIALIZATION);

const name = query("name")
  .trim()
  .customSanitizer((string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

const page = query("page")
  .isInt({ min: 0 })
  .withMessage(INVALID_PAGE)
  .customSanitizer((value) => +value);

exports.getMastersByQuery = [name, specialization, page];
exports.getMasterTimezone = [masterId];
