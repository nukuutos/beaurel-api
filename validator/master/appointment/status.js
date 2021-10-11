const { body, paramId } = require("express-validator");
const { INVALID_STATUS } = require("../../../config/errors/appointment");
const { APPOINTMENT_ID, MASTER_ID } = require("../../../config/id-names");

const appointmentId = paramId("appointmentId", APPOINTMENT_ID);
const masterId = paramId("masterId", MASTER_ID);

const masterStatuses = body("status")
  .custom((status) => {
    const statusList = ["confirmed", "rejected"];
    return statusList.includes(status);
  })
  .withMessage(INVALID_STATUS);

const customerStatuses = body("status")
  .custom((status) => {
    const statusList = ["cancelled"];
    return statusList.includes(status);
  })
  .withMessage(INVALID_STATUS);

exports.updateStatusByMaster = [masterId, appointmentId, masterStatuses];
exports.updateStatusByCustomer = [masterId, appointmentId, customerStatuses];
