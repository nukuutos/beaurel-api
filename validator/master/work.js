const { body, paramId } = require("express-validator");
const { TITLE_REQUIRED, INVALID_TITLE } = require("../../config/errors/work");
const { WORK_ID, MASTER_ID } = require("../../config/id-names");

const workId = paramId("workId", WORK_ID);
const masterId = paramId("masterId", MASTER_ID);

const title = body("title")
  .exists({ checkFalsy: true })
  .withMessage(TITLE_REQUIRED)
  .matches(/^[а-я -,.!?()0-9]+$/i)
  .withMessage(INVALID_TITLE);

exports.getWorks = [masterId];
exports.addWork = [masterId, title];
exports.updateWork = [masterId, workId, title];
exports.deleteWork = [masterId, workId];
